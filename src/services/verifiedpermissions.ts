import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "VerifiedPermissions",
  serviceShapeName: "VerifiedPermissions",
});
const auth = T.AwsAuthSigv4({ name: "verifiedpermissions" });
const ver = T.ServiceVersion("2021-12-01");
const proto = T.AwsProtocolsAwsJson1_0();
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
                                url: "https://verifiedpermissions-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://verifiedpermissions-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://verifiedpermissions.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://verifiedpermissions.{Region}.{PartitionResult#dnsSuffix}",
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
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { resourceArn: S.String, tagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class GetPolicyStoreInput extends S.Class<GetPolicyStoreInput>(
  "GetPolicyStoreInput",
)(
  { policyStoreId: S.String, tags: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ValidationSettings extends S.Class<ValidationSettings>(
  "ValidationSettings",
)({ mode: S.String }) {}
export class UpdatePolicyStoreInput extends S.Class<UpdatePolicyStoreInput>(
  "UpdatePolicyStoreInput",
)(
  {
    policyStoreId: S.String,
    validationSettings: ValidationSettings,
    deletionProtection: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePolicyStoreInput extends S.Class<DeletePolicyStoreInput>(
  "DeletePolicyStoreInput",
)(
  { policyStoreId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePolicyStoreOutput extends S.Class<DeletePolicyStoreOutput>(
  "DeletePolicyStoreOutput",
)({}) {}
export class ListPolicyStoresInput extends S.Class<ListPolicyStoresInput>(
  "ListPolicyStoresInput",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSchemaInput extends S.Class<GetSchemaInput>("GetSchemaInput")(
  { policyStoreId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ActionIdentifier extends S.Class<ActionIdentifier>(
  "ActionIdentifier",
)({ actionType: S.String, actionId: S.String }) {}
export class EntityIdentifier extends S.Class<EntityIdentifier>(
  "EntityIdentifier",
)({ entityType: S.String, entityId: S.String }) {}
export type AttributeValue =
  | { boolean: boolean }
  | { entityIdentifier: EntityIdentifier }
  | { long: number }
  | { string: string }
  | { set: SetAttribute }
  | { record: RecordAttribute }
  | { ipaddr: string }
  | { decimal: string }
  | { datetime: string }
  | { duration: string };
export const AttributeValue = S.Union(
  S.Struct({ boolean: S.Boolean }),
  S.Struct({ entityIdentifier: EntityIdentifier }),
  S.Struct({ long: S.Number }),
  S.Struct({ string: S.String }),
  S.Struct({ set: S.suspend(() => SetAttribute) }),
  S.Struct({ record: S.suspend(() => RecordAttribute) }),
  S.Struct({ ipaddr: S.String }),
  S.Struct({ decimal: S.String }),
  S.Struct({ datetime: S.String }),
  S.Struct({ duration: S.String }),
) as any as S.Schema<AttributeValue>;
export const ContextMap = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue),
});
export const ContextDefinition = S.Union(
  S.Struct({ contextMap: ContextMap }),
  S.Struct({ cedarJson: S.String }),
);
export const EntityAttributes = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue),
});
export const ParentList = S.Array(EntityIdentifier);
export type CedarTagValue =
  | { boolean: boolean }
  | { entityIdentifier: EntityIdentifier }
  | { long: number }
  | { string: string }
  | { set: CedarTagSetAttribute }
  | { record: CedarTagRecordAttribute }
  | { ipaddr: string }
  | { decimal: string }
  | { datetime: string }
  | { duration: string };
export const CedarTagValue = S.Union(
  S.Struct({ boolean: S.Boolean }),
  S.Struct({ entityIdentifier: EntityIdentifier }),
  S.Struct({ long: S.Number }),
  S.Struct({ string: S.String }),
  S.Struct({ set: S.suspend(() => CedarTagSetAttribute) }),
  S.Struct({ record: S.suspend(() => CedarTagRecordAttribute) }),
  S.Struct({ ipaddr: S.String }),
  S.Struct({ decimal: S.String }),
  S.Struct({ datetime: S.String }),
  S.Struct({ duration: S.String }),
) as any as S.Schema<CedarTagValue>;
export const EntityCedarTags = S.Record({
  key: S.String,
  value: S.suspend(() => CedarTagValue),
});
export class EntityItem extends S.Class<EntityItem>("EntityItem")({
  identifier: EntityIdentifier,
  attributes: S.optional(EntityAttributes),
  parents: S.optional(ParentList),
  tags: S.optional(EntityCedarTags),
}) {}
export const EntityList = S.Array(EntityItem);
export const EntitiesDefinition = S.Union(
  S.Struct({ entityList: EntityList }),
  S.Struct({ cedarJson: S.String }),
);
export class IsAuthorizedWithTokenInput extends S.Class<IsAuthorizedWithTokenInput>(
  "IsAuthorizedWithTokenInput",
)(
  {
    policyStoreId: S.String,
    identityToken: S.optional(S.String),
    accessToken: S.optional(S.String),
    action: S.optional(ActionIdentifier),
    resource: S.optional(EntityIdentifier),
    context: S.optional(ContextDefinition),
    entities: S.optional(EntitiesDefinition),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdentitySourceInput extends S.Class<GetIdentitySourceInput>(
  "GetIdentitySourceInput",
)(
  { policyStoreId: S.String, identitySourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIdentitySourceInput extends S.Class<DeleteIdentitySourceInput>(
  "DeleteIdentitySourceInput",
)(
  { policyStoreId: S.String, identitySourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIdentitySourceOutput extends S.Class<DeleteIdentitySourceOutput>(
  "DeleteIdentitySourceOutput",
)({}) {}
export class GetPolicyInput extends S.Class<GetPolicyInput>("GetPolicyInput")(
  { policyStoreId: S.String, policyId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePolicyInput extends S.Class<DeletePolicyInput>(
  "DeletePolicyInput",
)(
  { policyStoreId: S.String, policyId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePolicyOutput extends S.Class<DeletePolicyOutput>(
  "DeletePolicyOutput",
)({}) {}
export class CreatePolicyTemplateInput extends S.Class<CreatePolicyTemplateInput>(
  "CreatePolicyTemplateInput",
)(
  {
    clientToken: S.optional(S.String),
    policyStoreId: S.String,
    description: S.optional(S.String),
    statement: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPolicyTemplateInput extends S.Class<GetPolicyTemplateInput>(
  "GetPolicyTemplateInput",
)(
  { policyStoreId: S.String, policyTemplateId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePolicyTemplateInput extends S.Class<UpdatePolicyTemplateInput>(
  "UpdatePolicyTemplateInput",
)(
  {
    policyStoreId: S.String,
    policyTemplateId: S.String,
    description: S.optional(S.String),
    statement: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePolicyTemplateInput extends S.Class<DeletePolicyTemplateInput>(
  "DeletePolicyTemplateInput",
)(
  { policyStoreId: S.String, policyTemplateId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePolicyTemplateOutput extends S.Class<DeletePolicyTemplateOutput>(
  "DeletePolicyTemplateOutput",
)({}) {}
export class ListPolicyTemplatesInput extends S.Class<ListPolicyTemplatesInput>(
  "ListPolicyTemplatesInput",
)(
  {
    policyStoreId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class BatchIsAuthorizedInputItem extends S.Class<BatchIsAuthorizedInputItem>(
  "BatchIsAuthorizedInputItem",
)({
  principal: S.optional(EntityIdentifier),
  action: S.optional(ActionIdentifier),
  resource: S.optional(EntityIdentifier),
  context: S.optional(ContextDefinition),
}) {}
export const BatchIsAuthorizedInputList = S.Array(BatchIsAuthorizedInputItem);
export class BatchIsAuthorizedWithTokenInputItem extends S.Class<BatchIsAuthorizedWithTokenInputItem>(
  "BatchIsAuthorizedWithTokenInputItem",
)({
  action: S.optional(ActionIdentifier),
  resource: S.optional(EntityIdentifier),
  context: S.optional(ContextDefinition),
}) {}
export const BatchIsAuthorizedWithTokenInputList = S.Array(
  BatchIsAuthorizedWithTokenInputItem,
);
export const NamespaceList = S.Array(S.String);
export const SchemaDefinition = S.Union(S.Struct({ cedarJson: S.String }));
export class BatchGetPolicyInputItem extends S.Class<BatchGetPolicyInputItem>(
  "BatchGetPolicyInputItem",
)({ policyStoreId: S.String, policyId: S.String }) {}
export const BatchGetPolicyInputList = S.Array(BatchGetPolicyInputItem);
export class IdentitySourceFilter extends S.Class<IdentitySourceFilter>(
  "IdentitySourceFilter",
)({ principalEntityType: S.optional(S.String) }) {}
export const IdentitySourceFilters = S.Array(IdentitySourceFilter);
export const ActionIdentifierList = S.Array(ActionIdentifier);
export const ClientIds = S.Array(S.String);
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: S.optional(TagMap) }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String, tags: TagMap },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class CreatePolicyStoreInput extends S.Class<CreatePolicyStoreInput>(
  "CreatePolicyStoreInput",
)(
  {
    clientToken: S.optional(S.String),
    validationSettings: ValidationSettings,
    description: S.optional(S.String),
    deletionProtection: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPolicyStoreOutput extends S.Class<GetPolicyStoreOutput>(
  "GetPolicyStoreOutput",
)({
  policyStoreId: S.String,
  arn: S.String,
  validationSettings: ValidationSettings,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  description: S.optional(S.String),
  deletionProtection: S.optional(S.String),
  cedarVersion: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class UpdatePolicyStoreOutput extends S.Class<UpdatePolicyStoreOutput>(
  "UpdatePolicyStoreOutput",
)({
  policyStoreId: S.String,
  arn: S.String,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class BatchIsAuthorizedWithTokenInput extends S.Class<BatchIsAuthorizedWithTokenInput>(
  "BatchIsAuthorizedWithTokenInput",
)(
  {
    policyStoreId: S.String,
    identityToken: S.optional(S.String),
    accessToken: S.optional(S.String),
    entities: S.optional(EntitiesDefinition),
    requests: BatchIsAuthorizedWithTokenInputList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSchemaOutput extends S.Class<GetSchemaOutput>(
  "GetSchemaOutput",
)({
  policyStoreId: S.String,
  schema: S.String,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  namespaces: S.optional(NamespaceList),
}) {}
export class PutSchemaInput extends S.Class<PutSchemaInput>("PutSchemaInput")(
  { policyStoreId: S.String, definition: SchemaDefinition },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetPolicyInput extends S.Class<BatchGetPolicyInput>(
  "BatchGetPolicyInput",
)(
  { requests: BatchGetPolicyInputList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListIdentitySourcesInput extends S.Class<ListIdentitySourcesInput>(
  "ListIdentitySourcesInput",
)(
  {
    policyStoreId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(IdentitySourceFilters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePolicyTemplateOutput extends S.Class<CreatePolicyTemplateOutput>(
  "CreatePolicyTemplateOutput",
)({
  policyStoreId: S.String,
  policyTemplateId: S.String,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetPolicyTemplateOutput extends S.Class<GetPolicyTemplateOutput>(
  "GetPolicyTemplateOutput",
)({
  policyStoreId: S.String,
  policyTemplateId: S.String,
  description: S.optional(S.String),
  statement: S.String,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class UpdatePolicyTemplateOutput extends S.Class<UpdatePolicyTemplateOutput>(
  "UpdatePolicyTemplateOutput",
)({
  policyStoreId: S.String,
  policyTemplateId: S.String,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class StaticPolicyDefinition extends S.Class<StaticPolicyDefinition>(
  "StaticPolicyDefinition",
)({ description: S.optional(S.String), statement: S.String }) {}
export class TemplateLinkedPolicyDefinition extends S.Class<TemplateLinkedPolicyDefinition>(
  "TemplateLinkedPolicyDefinition",
)({
  policyTemplateId: S.String,
  principal: S.optional(EntityIdentifier),
  resource: S.optional(EntityIdentifier),
}) {}
export class UpdateStaticPolicyDefinition extends S.Class<UpdateStaticPolicyDefinition>(
  "UpdateStaticPolicyDefinition",
)({ description: S.optional(S.String), statement: S.String }) {}
export const EntityReference = S.Union(
  S.Struct({ unspecified: S.Boolean }),
  S.Struct({ identifier: EntityIdentifier }),
);
export type SetAttribute = AttributeValue[];
export const SetAttribute = S.Array(
  S.suspend(() => AttributeValue),
) as any as S.Schema<SetAttribute>;
export class PolicyStoreItem extends S.Class<PolicyStoreItem>(
  "PolicyStoreItem",
)({
  policyStoreId: S.String,
  arn: S.String,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  description: S.optional(S.String),
}) {}
export const PolicyStoreList = S.Array(PolicyStoreItem);
export class DeterminingPolicyItem extends S.Class<DeterminingPolicyItem>(
  "DeterminingPolicyItem",
)({ policyId: S.String }) {}
export const DeterminingPolicyList = S.Array(DeterminingPolicyItem);
export class EvaluationErrorItem extends S.Class<EvaluationErrorItem>(
  "EvaluationErrorItem",
)({ errorDescription: S.String }) {}
export const EvaluationErrorList = S.Array(EvaluationErrorItem);
export class IdentitySourceDetails extends S.Class<IdentitySourceDetails>(
  "IdentitySourceDetails",
)({
  clientIds: S.optional(ClientIds),
  userPoolArn: S.optional(S.String),
  discoveryUrl: S.optional(S.String),
  openIdIssuer: S.optional(S.String),
}) {}
export class ResourceConflict extends S.Class<ResourceConflict>(
  "ResourceConflict",
)({ resourceId: S.String, resourceType: S.String }) {}
export const ResourceConflictList = S.Array(ResourceConflict);
export const PolicyDefinition = S.Union(
  S.Struct({ static: StaticPolicyDefinition }),
  S.Struct({ templateLinked: TemplateLinkedPolicyDefinition }),
);
export const UpdatePolicyDefinition = S.Union(
  S.Struct({ static: UpdateStaticPolicyDefinition }),
);
export class PolicyFilter extends S.Class<PolicyFilter>("PolicyFilter")({
  principal: S.optional(EntityReference),
  resource: S.optional(EntityReference),
  policyType: S.optional(S.String),
  policyTemplateId: S.optional(S.String),
}) {}
export class PolicyTemplateItem extends S.Class<PolicyTemplateItem>(
  "PolicyTemplateItem",
)({
  policyStoreId: S.String,
  policyTemplateId: S.String,
  description: S.optional(S.String),
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const PolicyTemplatesList = S.Array(PolicyTemplateItem);
export class CognitoGroupConfiguration extends S.Class<CognitoGroupConfiguration>(
  "CognitoGroupConfiguration",
)({ groupEntityType: S.String }) {}
export class OpenIdConnectGroupConfiguration extends S.Class<OpenIdConnectGroupConfiguration>(
  "OpenIdConnectGroupConfiguration",
)({ groupClaim: S.String, groupEntityType: S.String }) {}
export class UpdateCognitoGroupConfiguration extends S.Class<UpdateCognitoGroupConfiguration>(
  "UpdateCognitoGroupConfiguration",
)({ groupEntityType: S.String }) {}
export class UpdateOpenIdConnectGroupConfiguration extends S.Class<UpdateOpenIdConnectGroupConfiguration>(
  "UpdateOpenIdConnectGroupConfiguration",
)({ groupClaim: S.String, groupEntityType: S.String }) {}
export class CreatePolicyStoreOutput extends S.Class<CreatePolicyStoreOutput>(
  "CreatePolicyStoreOutput",
)({
  policyStoreId: S.String,
  arn: S.String,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListPolicyStoresOutput extends S.Class<ListPolicyStoresOutput>(
  "ListPolicyStoresOutput",
)({ nextToken: S.optional(S.String), policyStores: PolicyStoreList }) {}
export type CedarTagSetAttribute = CedarTagValue[];
export const CedarTagSetAttribute = S.Array(
  S.suspend(() => CedarTagValue),
) as any as S.Schema<CedarTagSetAttribute>;
export class IsAuthorizedWithTokenOutput extends S.Class<IsAuthorizedWithTokenOutput>(
  "IsAuthorizedWithTokenOutput",
)({
  decision: S.String,
  determiningPolicies: DeterminingPolicyList,
  errors: EvaluationErrorList,
  principal: S.optional(EntityIdentifier),
}) {}
export class PutSchemaOutput extends S.Class<PutSchemaOutput>(
  "PutSchemaOutput",
)({
  policyStoreId: S.String,
  namespaces: NamespaceList,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const Audiences = S.Array(S.String);
export class CreatePolicyInput extends S.Class<CreatePolicyInput>(
  "CreatePolicyInput",
)(
  {
    clientToken: S.optional(S.String),
    policyStoreId: S.String,
    definition: PolicyDefinition,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePolicyInput extends S.Class<UpdatePolicyInput>(
  "UpdatePolicyInput",
)(
  {
    policyStoreId: S.String,
    policyId: S.String,
    definition: UpdatePolicyDefinition,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPoliciesInput extends S.Class<ListPoliciesInput>(
  "ListPoliciesInput",
)(
  {
    policyStoreId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(PolicyFilter),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPolicyTemplatesOutput extends S.Class<ListPolicyTemplatesOutput>(
  "ListPolicyTemplatesOutput",
)({ nextToken: S.optional(S.String), policyTemplates: PolicyTemplatesList }) {}
export class CognitoUserPoolConfiguration extends S.Class<CognitoUserPoolConfiguration>(
  "CognitoUserPoolConfiguration",
)({
  userPoolArn: S.String,
  clientIds: S.optional(ClientIds),
  groupConfiguration: S.optional(CognitoGroupConfiguration),
}) {}
export class UpdateCognitoUserPoolConfiguration extends S.Class<UpdateCognitoUserPoolConfiguration>(
  "UpdateCognitoUserPoolConfiguration",
)({
  userPoolArn: S.String,
  clientIds: S.optional(ClientIds),
  groupConfiguration: S.optional(UpdateCognitoGroupConfiguration),
}) {}
export class StaticPolicyDefinitionDetail extends S.Class<StaticPolicyDefinitionDetail>(
  "StaticPolicyDefinitionDetail",
)({ description: S.optional(S.String), statement: S.String }) {}
export class TemplateLinkedPolicyDefinitionDetail extends S.Class<TemplateLinkedPolicyDefinitionDetail>(
  "TemplateLinkedPolicyDefinitionDetail",
)({
  policyTemplateId: S.String,
  principal: S.optional(EntityIdentifier),
  resource: S.optional(EntityIdentifier),
}) {}
export type RecordAttribute = { [key: string]: AttributeValue };
export const RecordAttribute = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue),
}) as any as S.Schema<RecordAttribute>;
export class OpenIdConnectAccessTokenConfiguration extends S.Class<OpenIdConnectAccessTokenConfiguration>(
  "OpenIdConnectAccessTokenConfiguration",
)({
  principalIdClaim: S.optional(S.String),
  audiences: S.optional(Audiences),
}) {}
export class OpenIdConnectIdentityTokenConfiguration extends S.Class<OpenIdConnectIdentityTokenConfiguration>(
  "OpenIdConnectIdentityTokenConfiguration",
)({
  principalIdClaim: S.optional(S.String),
  clientIds: S.optional(ClientIds),
}) {}
export class UpdateOpenIdConnectAccessTokenConfiguration extends S.Class<UpdateOpenIdConnectAccessTokenConfiguration>(
  "UpdateOpenIdConnectAccessTokenConfiguration",
)({
  principalIdClaim: S.optional(S.String),
  audiences: S.optional(Audiences),
}) {}
export class UpdateOpenIdConnectIdentityTokenConfiguration extends S.Class<UpdateOpenIdConnectIdentityTokenConfiguration>(
  "UpdateOpenIdConnectIdentityTokenConfiguration",
)({
  principalIdClaim: S.optional(S.String),
  clientIds: S.optional(ClientIds),
}) {}
export class BatchIsAuthorizedWithTokenOutputItem extends S.Class<BatchIsAuthorizedWithTokenOutputItem>(
  "BatchIsAuthorizedWithTokenOutputItem",
)({
  request: BatchIsAuthorizedWithTokenInputItem,
  decision: S.String,
  determiningPolicies: DeterminingPolicyList,
  errors: EvaluationErrorList,
}) {}
export const BatchIsAuthorizedWithTokenOutputList = S.Array(
  BatchIsAuthorizedWithTokenOutputItem,
);
export const PolicyDefinitionDetail = S.Union(
  S.Struct({ static: StaticPolicyDefinitionDetail }),
  S.Struct({ templateLinked: TemplateLinkedPolicyDefinitionDetail }),
);
export class BatchGetPolicyOutputItem extends S.Class<BatchGetPolicyOutputItem>(
  "BatchGetPolicyOutputItem",
)({
  policyStoreId: S.String,
  policyId: S.String,
  policyType: S.String,
  definition: PolicyDefinitionDetail,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const BatchGetPolicyOutputList = S.Array(BatchGetPolicyOutputItem);
export class BatchGetPolicyErrorItem extends S.Class<BatchGetPolicyErrorItem>(
  "BatchGetPolicyErrorItem",
)({
  code: S.String,
  policyStoreId: S.String,
  policyId: S.String,
  message: S.String,
}) {}
export const BatchGetPolicyErrorList = S.Array(BatchGetPolicyErrorItem);
export const OpenIdConnectTokenSelection = S.Union(
  S.Struct({ accessTokenOnly: OpenIdConnectAccessTokenConfiguration }),
  S.Struct({ identityTokenOnly: OpenIdConnectIdentityTokenConfiguration }),
);
export class CognitoGroupConfigurationDetail extends S.Class<CognitoGroupConfigurationDetail>(
  "CognitoGroupConfigurationDetail",
)({ groupEntityType: S.optional(S.String) }) {}
export class OpenIdConnectGroupConfigurationDetail extends S.Class<OpenIdConnectGroupConfigurationDetail>(
  "OpenIdConnectGroupConfigurationDetail",
)({ groupClaim: S.String, groupEntityType: S.String }) {}
export const UpdateOpenIdConnectTokenSelection = S.Union(
  S.Struct({ accessTokenOnly: UpdateOpenIdConnectAccessTokenConfiguration }),
  S.Struct({
    identityTokenOnly: UpdateOpenIdConnectIdentityTokenConfiguration,
  }),
);
export type CedarTagRecordAttribute = { [key: string]: CedarTagValue };
export const CedarTagRecordAttribute = S.Record({
  key: S.String,
  value: S.suspend(() => CedarTagValue),
}) as any as S.Schema<CedarTagRecordAttribute>;
export class BatchIsAuthorizedWithTokenOutput extends S.Class<BatchIsAuthorizedWithTokenOutput>(
  "BatchIsAuthorizedWithTokenOutput",
)({
  principal: S.optional(EntityIdentifier),
  results: BatchIsAuthorizedWithTokenOutputList,
}) {}
export class BatchGetPolicyOutput extends S.Class<BatchGetPolicyOutput>(
  "BatchGetPolicyOutput",
)({ results: BatchGetPolicyOutputList, errors: BatchGetPolicyErrorList }) {}
export class CreatePolicyOutput extends S.Class<CreatePolicyOutput>(
  "CreatePolicyOutput",
)({
  policyStoreId: S.String,
  policyId: S.String,
  policyType: S.String,
  principal: S.optional(EntityIdentifier),
  resource: S.optional(EntityIdentifier),
  actions: S.optional(ActionIdentifierList),
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  effect: S.optional(S.String),
}) {}
export class GetPolicyOutput extends S.Class<GetPolicyOutput>(
  "GetPolicyOutput",
)({
  policyStoreId: S.String,
  policyId: S.String,
  policyType: S.String,
  principal: S.optional(EntityIdentifier),
  resource: S.optional(EntityIdentifier),
  actions: S.optional(ActionIdentifierList),
  definition: PolicyDefinitionDetail,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  effect: S.optional(S.String),
}) {}
export class UpdatePolicyOutput extends S.Class<UpdatePolicyOutput>(
  "UpdatePolicyOutput",
)({
  policyStoreId: S.String,
  policyId: S.String,
  policyType: S.String,
  principal: S.optional(EntityIdentifier),
  resource: S.optional(EntityIdentifier),
  actions: S.optional(ActionIdentifierList),
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  effect: S.optional(S.String),
}) {}
export class OpenIdConnectConfiguration extends S.Class<OpenIdConnectConfiguration>(
  "OpenIdConnectConfiguration",
)({
  issuer: S.String,
  entityIdPrefix: S.optional(S.String),
  groupConfiguration: S.optional(OpenIdConnectGroupConfiguration),
  tokenSelection: OpenIdConnectTokenSelection,
}) {}
export class CognitoUserPoolConfigurationDetail extends S.Class<CognitoUserPoolConfigurationDetail>(
  "CognitoUserPoolConfigurationDetail",
)({
  userPoolArn: S.String,
  clientIds: ClientIds,
  issuer: S.String,
  groupConfiguration: S.optional(CognitoGroupConfigurationDetail),
}) {}
export class UpdateOpenIdConnectConfiguration extends S.Class<UpdateOpenIdConnectConfiguration>(
  "UpdateOpenIdConnectConfiguration",
)({
  issuer: S.String,
  entityIdPrefix: S.optional(S.String),
  groupConfiguration: S.optional(UpdateOpenIdConnectGroupConfiguration),
  tokenSelection: UpdateOpenIdConnectTokenSelection,
}) {}
export class IdentitySourceItemDetails extends S.Class<IdentitySourceItemDetails>(
  "IdentitySourceItemDetails",
)({
  clientIds: S.optional(ClientIds),
  userPoolArn: S.optional(S.String),
  discoveryUrl: S.optional(S.String),
  openIdIssuer: S.optional(S.String),
}) {}
export class OpenIdConnectAccessTokenConfigurationDetail extends S.Class<OpenIdConnectAccessTokenConfigurationDetail>(
  "OpenIdConnectAccessTokenConfigurationDetail",
)({
  principalIdClaim: S.optional(S.String),
  audiences: S.optional(Audiences),
}) {}
export class OpenIdConnectIdentityTokenConfigurationDetail extends S.Class<OpenIdConnectIdentityTokenConfigurationDetail>(
  "OpenIdConnectIdentityTokenConfigurationDetail",
)({
  principalIdClaim: S.optional(S.String),
  clientIds: S.optional(ClientIds),
}) {}
export const Configuration = S.Union(
  S.Struct({ cognitoUserPoolConfiguration: CognitoUserPoolConfiguration }),
  S.Struct({ openIdConnectConfiguration: OpenIdConnectConfiguration }),
);
export const UpdateConfiguration = S.Union(
  S.Struct({
    cognitoUserPoolConfiguration: UpdateCognitoUserPoolConfiguration,
  }),
  S.Struct({ openIdConnectConfiguration: UpdateOpenIdConnectConfiguration }),
);
export const OpenIdConnectTokenSelectionDetail = S.Union(
  S.Struct({ accessTokenOnly: OpenIdConnectAccessTokenConfigurationDetail }),
  S.Struct({
    identityTokenOnly: OpenIdConnectIdentityTokenConfigurationDetail,
  }),
);
export class IsAuthorizedInput extends S.Class<IsAuthorizedInput>(
  "IsAuthorizedInput",
)(
  {
    policyStoreId: S.String,
    principal: S.optional(EntityIdentifier),
    action: S.optional(ActionIdentifier),
    resource: S.optional(EntityIdentifier),
    context: S.optional(ContextDefinition),
    entities: S.optional(EntitiesDefinition),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateIdentitySourceInput extends S.Class<CreateIdentitySourceInput>(
  "CreateIdentitySourceInput",
)(
  {
    clientToken: S.optional(S.String),
    policyStoreId: S.String,
    configuration: Configuration,
    principalEntityType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateIdentitySourceInput extends S.Class<UpdateIdentitySourceInput>(
  "UpdateIdentitySourceInput",
)(
  {
    policyStoreId: S.String,
    identitySourceId: S.String,
    updateConfiguration: UpdateConfiguration,
    principalEntityType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class OpenIdConnectConfigurationDetail extends S.Class<OpenIdConnectConfigurationDetail>(
  "OpenIdConnectConfigurationDetail",
)({
  issuer: S.String,
  entityIdPrefix: S.optional(S.String),
  groupConfiguration: S.optional(OpenIdConnectGroupConfigurationDetail),
  tokenSelection: OpenIdConnectTokenSelectionDetail,
}) {}
export class CognitoGroupConfigurationItem extends S.Class<CognitoGroupConfigurationItem>(
  "CognitoGroupConfigurationItem",
)({ groupEntityType: S.optional(S.String) }) {}
export class OpenIdConnectGroupConfigurationItem extends S.Class<OpenIdConnectGroupConfigurationItem>(
  "OpenIdConnectGroupConfigurationItem",
)({ groupClaim: S.String, groupEntityType: S.String }) {}
export const ConfigurationDetail = S.Union(
  S.Struct({
    cognitoUserPoolConfiguration: CognitoUserPoolConfigurationDetail,
  }),
  S.Struct({ openIdConnectConfiguration: OpenIdConnectConfigurationDetail }),
);
export class CognitoUserPoolConfigurationItem extends S.Class<CognitoUserPoolConfigurationItem>(
  "CognitoUserPoolConfigurationItem",
)({
  userPoolArn: S.String,
  clientIds: ClientIds,
  issuer: S.String,
  groupConfiguration: S.optional(CognitoGroupConfigurationItem),
}) {}
export class StaticPolicyDefinitionItem extends S.Class<StaticPolicyDefinitionItem>(
  "StaticPolicyDefinitionItem",
)({ description: S.optional(S.String) }) {}
export class TemplateLinkedPolicyDefinitionItem extends S.Class<TemplateLinkedPolicyDefinitionItem>(
  "TemplateLinkedPolicyDefinitionItem",
)({
  policyTemplateId: S.String,
  principal: S.optional(EntityIdentifier),
  resource: S.optional(EntityIdentifier),
}) {}
export class BatchIsAuthorizedInput extends S.Class<BatchIsAuthorizedInput>(
  "BatchIsAuthorizedInput",
)(
  {
    policyStoreId: S.String,
    entities: S.optional(EntitiesDefinition),
    requests: BatchIsAuthorizedInputList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IsAuthorizedOutput extends S.Class<IsAuthorizedOutput>(
  "IsAuthorizedOutput",
)({
  decision: S.String,
  determiningPolicies: DeterminingPolicyList,
  errors: EvaluationErrorList,
}) {}
export class CreateIdentitySourceOutput extends S.Class<CreateIdentitySourceOutput>(
  "CreateIdentitySourceOutput",
)({
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  identitySourceId: S.String,
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  policyStoreId: S.String,
}) {}
export class GetIdentitySourceOutput extends S.Class<GetIdentitySourceOutput>(
  "GetIdentitySourceOutput",
)({
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  details: S.optional(IdentitySourceDetails),
  identitySourceId: S.String,
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  policyStoreId: S.String,
  principalEntityType: S.String,
  configuration: S.optional(ConfigurationDetail),
}) {}
export class UpdateIdentitySourceOutput extends S.Class<UpdateIdentitySourceOutput>(
  "UpdateIdentitySourceOutput",
)({
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  identitySourceId: S.String,
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  policyStoreId: S.String,
}) {}
export class OpenIdConnectAccessTokenConfigurationItem extends S.Class<OpenIdConnectAccessTokenConfigurationItem>(
  "OpenIdConnectAccessTokenConfigurationItem",
)({
  principalIdClaim: S.optional(S.String),
  audiences: S.optional(Audiences),
}) {}
export class OpenIdConnectIdentityTokenConfigurationItem extends S.Class<OpenIdConnectIdentityTokenConfigurationItem>(
  "OpenIdConnectIdentityTokenConfigurationItem",
)({
  principalIdClaim: S.optional(S.String),
  clientIds: S.optional(ClientIds),
}) {}
export const PolicyDefinitionItem = S.Union(
  S.Struct({ static: StaticPolicyDefinitionItem }),
  S.Struct({ templateLinked: TemplateLinkedPolicyDefinitionItem }),
);
export const OpenIdConnectTokenSelectionItem = S.Union(
  S.Struct({ accessTokenOnly: OpenIdConnectAccessTokenConfigurationItem }),
  S.Struct({ identityTokenOnly: OpenIdConnectIdentityTokenConfigurationItem }),
);
export class PolicyItem extends S.Class<PolicyItem>("PolicyItem")({
  policyStoreId: S.String,
  policyId: S.String,
  policyType: S.String,
  principal: S.optional(EntityIdentifier),
  resource: S.optional(EntityIdentifier),
  actions: S.optional(ActionIdentifierList),
  definition: PolicyDefinitionItem,
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  effect: S.optional(S.String),
}) {}
export const PolicyList = S.Array(PolicyItem);
export class OpenIdConnectConfigurationItem extends S.Class<OpenIdConnectConfigurationItem>(
  "OpenIdConnectConfigurationItem",
)({
  issuer: S.String,
  entityIdPrefix: S.optional(S.String),
  groupConfiguration: S.optional(OpenIdConnectGroupConfigurationItem),
  tokenSelection: OpenIdConnectTokenSelectionItem,
}) {}
export class ListPoliciesOutput extends S.Class<ListPoliciesOutput>(
  "ListPoliciesOutput",
)({ nextToken: S.optional(S.String), policies: PolicyList }) {}
export const ConfigurationItem = S.Union(
  S.Struct({ cognitoUserPoolConfiguration: CognitoUserPoolConfigurationItem }),
  S.Struct({ openIdConnectConfiguration: OpenIdConnectConfigurationItem }),
);
export class BatchIsAuthorizedOutputItem extends S.Class<BatchIsAuthorizedOutputItem>(
  "BatchIsAuthorizedOutputItem",
)({
  request: BatchIsAuthorizedInputItem,
  decision: S.String,
  determiningPolicies: DeterminingPolicyList,
  errors: EvaluationErrorList,
}) {}
export const BatchIsAuthorizedOutputList = S.Array(BatchIsAuthorizedOutputItem);
export class IdentitySourceItem extends S.Class<IdentitySourceItem>(
  "IdentitySourceItem",
)({
  createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
  details: S.optional(IdentitySourceItemDetails),
  identitySourceId: S.String,
  lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  policyStoreId: S.String,
  principalEntityType: S.String,
  configuration: S.optional(ConfigurationItem),
}) {}
export const IdentitySources = S.Array(IdentitySourceItem);
export class BatchIsAuthorizedOutput extends S.Class<BatchIsAuthorizedOutput>(
  "BatchIsAuthorizedOutput",
)({ results: BatchIsAuthorizedOutputList }) {}
export class ListIdentitySourcesOutput extends S.Class<ListIdentitySourcesOutput>(
  "ListIdentitySourcesOutput",
)({ nextToken: S.optional(S.String), identitySources: IdentitySources }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resources: ResourceConflictList },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes the specified policy store.
 *
 * This operation is idempotent. If you specify a policy store that does not exist, the request response will still return a successful HTTP 200 status code.
 */
export const deletePolicyStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyStoreInput,
  output: DeletePolicyStoreOutput,
  errors: [InvalidStateException],
}));
/**
 * Retrieves details about a policy store.
 */
export const getPolicyStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyStoreInput,
  output: GetPolicyStoreOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns a paginated list of all policy stores in the calling Amazon Web Services account.
 */
export const listPolicyStores = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPolicyStoresInput,
    output: ListPolicyStoresOutput,
    errors: [],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "policyStores",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Makes an authorization decision about a service request described in the parameters. The principal in this request comes from an external identity source in the form of an identity token formatted as a JSON web token (JWT). The information in the parameters can also define additional context that Verified Permissions can include in the evaluation. The request is evaluated against all matching policies in the specified policy store. The result of the decision is either `Allow` or `Deny`, along with a list of the policies that resulted in the decision.
 *
 * Verified Permissions validates each token that is specified in a request by checking its expiration date and its signature.
 *
 * Tokens from an identity source user continue to be usable until they expire. Token revocation and resource deletion have no effect on the validity of a token in your policy store
 */
export const isAuthorizedWithToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: IsAuthorizedWithTokenInput,
    output: IsAuthorizedWithTokenOutput,
    errors: [ResourceNotFoundException],
  }),
);
/**
 * Deletes an identity source that references an identity provider (IdP) such as Amazon Cognito. After you delete the identity source, you can no longer use tokens for identities from that identity source to represent principals in authorization queries made using IsAuthorizedWithToken. operations.
 */
export const deleteIdentitySource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIdentitySourceInput,
    output: DeleteIdentitySourceOutput,
    errors: [ConflictException, ResourceNotFoundException],
  }),
);
/**
 * Returns a paginated list of all policy templates in the specified policy store.
 */
export const listPolicyTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPolicyTemplatesInput,
    output: ListPolicyTemplatesOutput,
    errors: [ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "policyTemplates",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieve the details for the specified schema in the specified policy store.
 */
export const getSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaInput,
  output: GetSchemaOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieve the details for the specified policy template in the specified policy store.
 */
export const getPolicyTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyTemplateInput,
  output: GetPolicyTemplateOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes the specified policy from the policy store.
 *
 * This operation is idempotent; if you specify a policy that doesn't exist, the request response returns a successful `HTTP 200` status code.
 */
export const deletePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyInput,
  output: DeletePolicyOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Deletes the specified policy template from the policy store.
 *
 * This operation also deletes any policies that were created from the specified policy template. Those policies are immediately removed from all future API responses, and are asynchronously deleted from the policy store.
 */
export const deletePolicyTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePolicyTemplateInput,
    output: DeletePolicyTemplateOutput,
    errors: [ConflictException, ResourceNotFoundException],
  }),
);
/**
 * Modifies the validation setting for a policy store.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const updatePolicyStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePolicyStoreInput,
  output: UpdatePolicyStoreOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Updates the specified policy template. You can update only the description and the some elements of the policyBody.
 *
 * Changes you make to the policy template content are immediately (within the constraints of eventual consistency) reflected in authorization decisions that involve all template-linked policies instantiated from this template.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const updatePolicyTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePolicyTemplateInput,
    output: UpdatePolicyTemplateOutput,
    errors: [ConflictException, ResourceNotFoundException],
  }),
);
/**
 * Makes a series of decisions about multiple authorization requests for one token. The principal in this request comes from an external identity source in the form of an identity or access token, formatted as a JSON web token (JWT). The information in the parameters can also define additional context that Verified Permissions can include in the evaluations.
 *
 * The request is evaluated against all policies in the specified policy store that match the entities that you provide in the entities declaration and in the token. The result of the decisions is a series of `Allow` or `Deny` responses, along with the IDs of the policies that produced each decision.
 *
 * The `entities` of a `BatchIsAuthorizedWithToken` API request can contain up to 100 resources and up to 99 user groups. The `requests` of a `BatchIsAuthorizedWithToken` API request can contain up to 30 requests.
 *
 * The `BatchIsAuthorizedWithToken` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `verifiedpermissions:IsAuthorizedWithToken` in their IAM policies.
 */
export const batchIsAuthorizedWithToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchIsAuthorizedWithTokenInput,
    output: BatchIsAuthorizedWithTokenOutput,
    errors: [ResourceNotFoundException],
  }),
);
/**
 * Retrieves information about a group (batch) of policies.
 *
 * The `BatchGetPolicy` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `verifiedpermissions:GetPolicy` in their IAM policies.
 */
export const batchGetPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetPolicyInput,
  output: BatchGetPolicyOutput,
  errors: [],
}));
/**
 * Retrieves information about the specified policy.
 */
export const getPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyInput,
  output: GetPolicyOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns the tags associated with the specified Amazon Verified Permissions resource. In Verified Permissions, policy stores can be tagged.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a policy template. A template can use placeholders for the principal and resource. A template must be instantiated into a policy by associating it with specific principals and resources to use for the placeholders. That instantiated policy can then be considered in authorization decisions. The instantiated policy works identically to any other policy, except that it is dynamically linked to the template. If the template changes, then any policies that are linked to that template are immediately updated as well.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const createPolicyTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePolicyTemplateInput,
    output: CreatePolicyTemplateOutput,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }),
);
/**
 * Removes one or more tags from the specified Amazon Verified Permissions resource. In Verified Permissions, policy stores can be tagged.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a policy store. A policy store is a container for policy resources.
 *
 * Although Cedar supports multiple namespaces, Verified Permissions currently supports only one namespace per policy store.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const createPolicyStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyStoreInput,
  output: CreatePolicyStoreOutput,
  errors: [ConflictException, ServiceQuotaExceededException],
}));
/**
 * Creates or updates the policy schema in the specified policy store. The schema is used to validate any Cedar policies and policy templates submitted to the policy store. Any changes to the schema validate only policies and templates submitted after the schema change. Existing policies and templates are not re-evaluated against the changed schema. If you later update a policy, then it is evaluated against the new schema at that time.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const putSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSchemaInput,
  output: PutSchemaOutput,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Creates a Cedar policy and saves it in the specified policy store. You can create either a static policy or a policy linked to a policy template.
 *
 * - To create a static policy, provide the Cedar policy text in the `StaticPolicy` section of the `PolicyDefinition`.
 *
 * - To create a policy that is dynamically linked to a policy template, specify the policy template ID and the principal and resource to associate with this policy in the `templateLinked` section of the `PolicyDefinition`. If the policy template is ever updated, any policies linked to the policy template automatically use the updated template.
 *
 * Creating a policy causes it to be validated against the schema in the policy store. If the policy doesn't pass validation, the operation fails and the policy isn't stored.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const createPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyInput,
  output: CreatePolicyOutput,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Modifies a Cedar static policy in the specified policy store. You can change only certain elements of the UpdatePolicyDefinition parameter. You can directly update only static policies. To change a template-linked policy, you must update the template instead, using UpdatePolicyTemplate.
 *
 * - If policy validation is enabled in the policy store, then updating a static policy causes Verified Permissions to validate the policy against the schema in the policy store. If the updated static policy doesn't pass validation, the operation fails and the update isn't stored.
 *
 * - When you edit a static policy, you can change only certain elements of a static policy:
 *
 * - The action referenced by the policy.
 *
 * - A condition clause, such as when and unless.
 *
 * You can't change these elements of a static policy:
 *
 * - Changing a policy from a static policy to a template-linked policy.
 *
 * - Changing the effect of a static policy from permit or forbid.
 *
 * - The principal referenced by a static policy.
 *
 * - The resource referenced by a static policy.
 *
 * - To update a template-linked policy, you must update the template instead.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const updatePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePolicyInput,
  output: UpdatePolicyOutput,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified Amazon Verified Permissions resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. In Verified Permissions, policy stores can be tagged.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters.
 *
 * You can use the TagResource action with a resource that already has tags. If you specify a new tag key, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
  ],
}));
/**
 * Makes an authorization decision about a service request described in the parameters. The information in the parameters can also define additional context that Verified Permissions can include in the evaluation. The request is evaluated against all matching policies in the specified policy store. The result of the decision is either `Allow` or `Deny`, along with a list of the policies that resulted in the decision.
 */
export const isAuthorized = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IsAuthorizedInput,
  output: IsAuthorizedOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Adds an identity source to a policy store–an Amazon Cognito user pool or OpenID Connect (OIDC) identity provider (IdP).
 *
 * After you create an identity source, you can use the identities provided by the IdP as proxies for the principal in authorization queries that use the IsAuthorizedWithToken or BatchIsAuthorizedWithToken API operations. These identities take the form of tokens that contain claims about the user, such as IDs, attributes and group memberships. Identity sources provide identity (ID) tokens and access tokens. Verified Permissions derives information about your user and session from token claims. Access tokens provide action `context` to your policies, and ID tokens provide principal `Attributes`.
 *
 * Tokens from an identity source user continue to be usable until they expire. Token revocation and resource deletion have no effect on the validity of a token in your policy store
 *
 * To reference a user from this identity source in your Cedar policies, refer to the following syntax examples.
 *
 * - Amazon Cognito user pool: `Namespace::[Entity type]::[User pool ID]|[user principal attribute]`, for example `MyCorp::User::us-east-1_EXAMPLE|a1b2c3d4-5678-90ab-cdef-EXAMPLE11111`.
 *
 * - OpenID Connect (OIDC) provider: `Namespace::[Entity type]::[entityIdPrefix]|[user principal attribute]`, for example `MyCorp::User::MyOIDCProvider|a1b2c3d4-5678-90ab-cdef-EXAMPLE22222`.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const createIdentitySource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateIdentitySourceInput,
    output: CreateIdentitySourceOutput,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }),
);
/**
 * Retrieves the details about the specified identity source.
 */
export const getIdentitySource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentitySourceInput,
  output: GetIdentitySourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Updates the specified identity source to use a new identity provider (IdP), or to change the mapping of identities from the IdP to a different principal entity type.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const updateIdentitySource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateIdentitySourceInput,
    output: UpdateIdentitySourceOutput,
    errors: [ConflictException, ResourceNotFoundException],
  }),
);
/**
 * Returns a paginated list of all policies stored in the specified policy store.
 */
export const listPolicies = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPoliciesInput,
    output: ListPoliciesOutput,
    errors: [ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "policies",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Makes a series of decisions about multiple authorization requests for one principal or resource. Each request contains the equivalent content of an `IsAuthorized` request: principal, action, resource, and context. Either the `principal` or the `resource` parameter must be identical across all requests. For example, Verified Permissions won't evaluate a pair of requests where `bob` views `photo1` and `alice` views `photo2`. Authorization of `bob` to view `photo1` and `photo2`, or `bob` and `alice` to view `photo1`, are valid batches.
 *
 * The request is evaluated against all policies in the specified policy store that match the entities that you declare. The result of the decisions is a series of `Allow` or `Deny` responses, along with the IDs of the policies that produced each decision.
 *
 * The `entities` of a `BatchIsAuthorized` API request can contain up to 100 principals and up to 100 resources. The `requests` of a `BatchIsAuthorized` API request can contain up to 30 requests.
 *
 * The `BatchIsAuthorized` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `verifiedpermissions:IsAuthorized` in their IAM policies.
 */
export const batchIsAuthorized = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchIsAuthorizedInput,
  output: BatchIsAuthorizedOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns a paginated list of all of the identity sources defined in the specified policy store.
 */
export const listIdentitySources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListIdentitySourcesInput,
    output: ListIdentitySourcesOutput,
    errors: [ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "identitySources",
      pageSize: "maxResults",
    } as const,
  }));

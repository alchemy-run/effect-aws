import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "AmplifyUIBuilder",
  serviceShapeName: "AmplifyUIBuilder",
});
const auth = T.AwsAuthSigv4({ name: "amplifyuibuilder" });
const ver = T.ServiceVersion("2021-08-11");
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
                        url: "https://amplifyuibuilder-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://amplifyuibuilder-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://amplifyuibuilder.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://amplifyuibuilder.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class GetMetadataRequest extends S.Class<GetMetadataRequest>(
  "GetMetadataRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app/{appId}/environment/{environmentName}/metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class GetCodegenJobRequest extends S.Class<GetCodegenJobRequest>(
  "GetCodegenJobRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app/{appId}/environment/{environmentName}/codegen-jobs/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCodegenJobsRequest extends S.Class<ListCodegenJobsRequest>(
  "ListCodegenJobsRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app/{appId}/environment/{environmentName}/codegen-jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetComponentRequest extends S.Class<GetComponentRequest>(
  "GetComponentRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app/{appId}/environment/{environmentName}/components/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteComponentRequest extends S.Class<DeleteComponentRequest>(
  "DeleteComponentRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/app/{appId}/environment/{environmentName}/components/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteComponentResponse extends S.Class<DeleteComponentResponse>(
  "DeleteComponentResponse",
)({}) {}
export class ListComponentsRequest extends S.Class<ListComponentsRequest>(
  "ListComponentsRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app/{appId}/environment/{environmentName}/components",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportComponentsRequest extends S.Class<ExportComponentsRequest>(
  "ExportComponentsRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/export/app/{appId}/environment/{environmentName}/components",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFormRequest extends S.Class<GetFormRequest>("GetFormRequest")(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app/{appId}/environment/{environmentName}/forms/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFormRequest extends S.Class<DeleteFormRequest>(
  "DeleteFormRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/app/{appId}/environment/{environmentName}/forms/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFormResponse extends S.Class<DeleteFormResponse>(
  "DeleteFormResponse",
)({}) {}
export class ListFormsRequest extends S.Class<ListFormsRequest>(
  "ListFormsRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app/{appId}/environment/{environmentName}/forms",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportFormsRequest extends S.Class<ExportFormsRequest>(
  "ExportFormsRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/export/app/{appId}/environment/{environmentName}/forms",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetThemeRequest extends S.Class<GetThemeRequest>(
  "GetThemeRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app/{appId}/environment/{environmentName}/themes/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteThemeRequest extends S.Class<DeleteThemeRequest>(
  "DeleteThemeRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/app/{appId}/environment/{environmentName}/themes/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteThemeResponse extends S.Class<DeleteThemeResponse>(
  "DeleteThemeResponse",
)({}) {}
export class ListThemesRequest extends S.Class<ListThemesRequest>(
  "ListThemesRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app/{appId}/environment/{environmentName}/themes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportThemesRequest extends S.Class<ExportThemesRequest>(
  "ExportThemesRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/export/app/{appId}/environment/{environmentName}/themes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExchangeCodeForTokenRequestBody extends S.Class<ExchangeCodeForTokenRequestBody>(
  "ExchangeCodeForTokenRequestBody",
)({ code: S.String, redirectUri: S.String, clientId: S.optional(S.String) }) {}
export class PutMetadataFlagBody extends S.Class<PutMetadataFlagBody>(
  "PutMetadataFlagBody",
)({ newValue: S.String }) {}
export class RefreshTokenRequestBody extends S.Class<RefreshTokenRequestBody>(
  "RefreshTokenRequestBody",
)({ token: S.String, clientId: S.optional(S.String) }) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class ComponentPropertyBindingProperties extends S.Class<ComponentPropertyBindingProperties>(
  "ComponentPropertyBindingProperties",
)({ property: S.String, field: S.optional(S.String) }) {}
export class FormBindingElement extends S.Class<FormBindingElement>(
  "FormBindingElement",
)({ element: S.String, property: S.String }) {}
export const FormBindings = S.Record({
  key: S.String,
  value: FormBindingElement,
});
export class ComponentProperty extends S.Class<ComponentProperty>(
  "ComponentProperty",
)({
  value: S.optional(S.String),
  bindingProperties: S.optional(ComponentPropertyBindingProperties),
  collectionBindingProperties: S.optional(ComponentPropertyBindingProperties),
  defaultValue: S.optional(S.String),
  model: S.optional(S.String),
  bindings: S.optional(FormBindings),
  event: S.optional(S.String),
  userAttribute: S.optional(S.String),
  concat: S.optional(S.suspend(() => ComponentPropertyList)),
  condition: S.optional(
    S.suspend(
      (): S.Schema<ComponentConditionProperty, any> =>
        ComponentConditionProperty,
    ),
  ),
  configured: S.optional(S.Boolean),
  type: S.optional(S.String),
  importedValue: S.optional(S.String),
  componentName: S.optional(S.String),
  property: S.optional(S.String),
}) {}
export const ComponentProperties = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<ComponentProperty, any> => ComponentProperty),
});
export type ComponentChildList = ComponentChild[];
export const ComponentChildList = S.Array(
  S.suspend((): S.Schema<ComponentChild, any> => ComponentChild),
) as any as S.Schema<ComponentChildList>;
export const ComponentVariantValues = S.Record({
  key: S.String,
  value: S.String,
});
export const ComponentOverridesValue = S.Record({
  key: S.String,
  value: S.String,
});
export const ComponentOverrides = S.Record({
  key: S.String,
  value: ComponentOverridesValue,
});
export class ComponentVariant extends S.Class<ComponentVariant>(
  "ComponentVariant",
)({
  variantValues: S.optional(ComponentVariantValues),
  overrides: S.optional(ComponentOverrides),
}) {}
export const ComponentVariants = S.Array(ComponentVariant);
export type PredicateList = Predicate[];
export const PredicateList = S.Array(
  S.suspend((): S.Schema<Predicate, any> => Predicate),
) as any as S.Schema<PredicateList>;
export class ComponentBindingPropertiesValueProperties extends S.Class<ComponentBindingPropertiesValueProperties>(
  "ComponentBindingPropertiesValueProperties",
)({
  model: S.optional(S.String),
  field: S.optional(S.String),
  predicates: S.optional(PredicateList),
  userAttribute: S.optional(S.String),
  bucket: S.optional(S.String),
  key: S.optional(S.String),
  defaultValue: S.optional(S.String),
  slotName: S.optional(S.String),
}) {}
export class ComponentBindingPropertiesValue extends S.Class<ComponentBindingPropertiesValue>(
  "ComponentBindingPropertiesValue",
)({
  type: S.optional(S.String),
  bindingProperties: S.optional(ComponentBindingPropertiesValueProperties),
  defaultValue: S.optional(S.String),
}) {}
export const ComponentBindingProperties = S.Record({
  key: S.String,
  value: ComponentBindingPropertiesValue,
});
export class SortProperty extends S.Class<SortProperty>("SortProperty")({
  field: S.String,
  direction: S.String,
}) {}
export const SortPropertyList = S.Array(SortProperty);
export class Predicate extends S.Class<Predicate>("Predicate")({
  or: S.optional(S.suspend(() => PredicateList)),
  and: S.optional(S.suspend(() => PredicateList)),
  field: S.optional(S.String),
  operator: S.optional(S.String),
  operand: S.optional(S.String),
  operandType: S.optional(S.String),
}) {}
export const IdentifierList = S.Array(S.String);
export class ComponentDataConfiguration extends S.Class<ComponentDataConfiguration>(
  "ComponentDataConfiguration",
)({
  model: S.String,
  sort: S.optional(SortPropertyList),
  predicate: S.optional(Predicate),
  identifiers: S.optional(IdentifierList),
}) {}
export const ComponentCollectionProperties = S.Record({
  key: S.String,
  value: ComponentDataConfiguration,
});
export class MutationActionSetStateParameter extends S.Class<MutationActionSetStateParameter>(
  "MutationActionSetStateParameter",
)({ componentName: S.String, property: S.String, set: ComponentProperty }) {}
export class ActionParameters extends S.Class<ActionParameters>(
  "ActionParameters",
)({
  type: S.optional(ComponentProperty),
  url: S.optional(ComponentProperty),
  anchor: S.optional(ComponentProperty),
  target: S.optional(ComponentProperty),
  global: S.optional(ComponentProperty),
  model: S.optional(S.String),
  id: S.optional(ComponentProperty),
  fields: S.optional(ComponentProperties),
  state: S.optional(MutationActionSetStateParameter),
}) {}
export class ComponentEvent extends S.Class<ComponentEvent>("ComponentEvent")({
  action: S.optional(S.String),
  parameters: S.optional(ActionParameters),
  bindingEvent: S.optional(S.String),
}) {}
export const ComponentEvents = S.Record({
  key: S.String,
  value: ComponentEvent,
});
export class UpdateComponentData extends S.Class<UpdateComponentData>(
  "UpdateComponentData",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  sourceId: S.optional(S.String),
  componentType: S.optional(S.String),
  properties: S.optional(ComponentProperties),
  children: S.optional(ComponentChildList),
  variants: S.optional(ComponentVariants),
  overrides: S.optional(ComponentOverrides),
  bindingProperties: S.optional(ComponentBindingProperties),
  collectionProperties: S.optional(ComponentCollectionProperties),
  events: S.optional(ComponentEvents),
  schemaVersion: S.optional(S.String),
}) {}
export class Component extends S.Class<Component>("Component")({
  appId: S.String,
  environmentName: S.String,
  sourceId: S.optional(S.String),
  id: S.String,
  name: S.String,
  componentType: S.String,
  properties: ComponentProperties,
  children: S.optional(ComponentChildList),
  variants: ComponentVariants,
  overrides: ComponentOverrides,
  bindingProperties: ComponentBindingProperties,
  collectionProperties: S.optional(ComponentCollectionProperties),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(Tags),
  events: S.optional(ComponentEvents),
  schemaVersion: S.optional(S.String),
}) {}
export const ComponentList = S.Array(Component);
export class FormDataTypeConfig extends S.Class<FormDataTypeConfig>(
  "FormDataTypeConfig",
)({ dataSourceType: S.String, dataTypeName: S.String }) {}
export const FieldPosition = S.Union(
  S.Struct({ fixed: S.String }),
  S.Struct({ rightOf: S.String }),
  S.Struct({ below: S.String }),
);
export class FormInputValuePropertyBindingProperties extends S.Class<FormInputValuePropertyBindingProperties>(
  "FormInputValuePropertyBindingProperties",
)({ property: S.String, field: S.optional(S.String) }) {}
export class FormInputValueProperty extends S.Class<FormInputValueProperty>(
  "FormInputValueProperty",
)({
  value: S.optional(S.String),
  bindingProperties: S.optional(FormInputValuePropertyBindingProperties),
  concat: S.optional(S.suspend(() => FormInputValuePropertyList)),
}) {}
export class ValueMapping extends S.Class<ValueMapping>("ValueMapping")({
  displayValue: S.optional(FormInputValueProperty),
  value: FormInputValueProperty,
}) {}
export const ValueMappingList = S.Array(ValueMapping);
export class FormInputBindingPropertiesValueProperties extends S.Class<FormInputBindingPropertiesValueProperties>(
  "FormInputBindingPropertiesValueProperties",
)({ model: S.optional(S.String) }) {}
export class FormInputBindingPropertiesValue extends S.Class<FormInputBindingPropertiesValue>(
  "FormInputBindingPropertiesValue",
)({
  type: S.optional(S.String),
  bindingProperties: S.optional(FormInputBindingPropertiesValueProperties),
}) {}
export const FormInputBindingProperties = S.Record({
  key: S.String,
  value: FormInputBindingPropertiesValue,
});
export class ValueMappings extends S.Class<ValueMappings>("ValueMappings")({
  values: ValueMappingList,
  bindingProperties: S.optional(FormInputBindingProperties),
}) {}
export const StrValues = S.Array(S.String);
export class FileUploaderFieldConfig extends S.Class<FileUploaderFieldConfig>(
  "FileUploaderFieldConfig",
)({
  accessLevel: S.String,
  acceptedFileTypes: StrValues,
  showThumbnails: S.optional(S.Boolean),
  isResumable: S.optional(S.Boolean),
  maxFileCount: S.optional(S.Number),
  maxSize: S.optional(S.Number),
}) {}
export class FieldInputConfig extends S.Class<FieldInputConfig>(
  "FieldInputConfig",
)({
  type: S.String,
  required: S.optional(S.Boolean),
  readOnly: S.optional(S.Boolean),
  placeholder: S.optional(S.String),
  defaultValue: S.optional(S.String),
  descriptiveText: S.optional(S.String),
  defaultChecked: S.optional(S.Boolean),
  defaultCountryCode: S.optional(S.String),
  valueMappings: S.optional(ValueMappings),
  name: S.optional(S.String),
  minValue: S.optional(S.Number),
  maxValue: S.optional(S.Number),
  step: S.optional(S.Number),
  value: S.optional(S.String),
  isArray: S.optional(S.Boolean),
  fileUploaderConfig: S.optional(FileUploaderFieldConfig),
}) {}
export const NumValues = S.Array(S.Number);
export class FieldValidationConfiguration extends S.Class<FieldValidationConfiguration>(
  "FieldValidationConfiguration",
)({
  type: S.String,
  strValues: S.optional(StrValues),
  numValues: S.optional(NumValues),
  validationMessage: S.optional(S.String),
}) {}
export const ValidationsList = S.Array(FieldValidationConfiguration);
export class FieldConfig extends S.Class<FieldConfig>("FieldConfig")({
  label: S.optional(S.String),
  position: S.optional(FieldPosition),
  excluded: S.optional(S.Boolean),
  inputType: S.optional(FieldInputConfig),
  validations: S.optional(ValidationsList),
}) {}
export const FieldsMap = S.Record({ key: S.String, value: FieldConfig });
export const FormStyleConfig = S.Union(
  S.Struct({ tokenReference: S.String }),
  S.Struct({ value: S.String }),
);
export class FormStyle extends S.Class<FormStyle>("FormStyle")({
  horizontalGap: S.optional(FormStyleConfig),
  verticalGap: S.optional(FormStyleConfig),
  outerPadding: S.optional(FormStyleConfig),
}) {}
export class SectionalElement extends S.Class<SectionalElement>(
  "SectionalElement",
)({
  type: S.String,
  position: S.optional(FieldPosition),
  text: S.optional(S.String),
  level: S.optional(S.Number),
  orientation: S.optional(S.String),
  excluded: S.optional(S.Boolean),
}) {}
export const SectionalElementMap = S.Record({
  key: S.String,
  value: SectionalElement,
});
export class FormButton extends S.Class<FormButton>("FormButton")({
  excluded: S.optional(S.Boolean),
  children: S.optional(S.String),
  position: S.optional(FieldPosition),
}) {}
export class FormCTA extends S.Class<FormCTA>("FormCTA")({
  position: S.optional(S.String),
  clear: S.optional(FormButton),
  cancel: S.optional(FormButton),
  submit: S.optional(FormButton),
}) {}
export class UpdateFormData extends S.Class<UpdateFormData>("UpdateFormData")({
  name: S.optional(S.String),
  dataType: S.optional(FormDataTypeConfig),
  formActionType: S.optional(S.String),
  fields: S.optional(FieldsMap),
  style: S.optional(FormStyle),
  sectionalElements: S.optional(SectionalElementMap),
  schemaVersion: S.optional(S.String),
  cta: S.optional(FormCTA),
  labelDecorator: S.optional(S.String),
}) {}
export class Form extends S.Class<Form>("Form")({
  appId: S.String,
  environmentName: S.String,
  id: S.String,
  name: S.String,
  formActionType: S.String,
  style: FormStyle,
  dataType: FormDataTypeConfig,
  fields: FieldsMap,
  sectionalElements: SectionalElementMap,
  schemaVersion: S.String,
  tags: S.optional(Tags),
  cta: S.optional(FormCTA),
  labelDecorator: S.optional(S.String),
}) {}
export const FormList = S.Array(Form);
export type ThemeValuesList = ThemeValues[];
export const ThemeValuesList = S.Array(
  S.suspend((): S.Schema<ThemeValues, any> => ThemeValues),
) as any as S.Schema<ThemeValuesList>;
export class UpdateThemeData extends S.Class<UpdateThemeData>(
  "UpdateThemeData",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  values: ThemeValuesList,
  overrides: S.optional(ThemeValuesList),
}) {}
export class Theme extends S.Class<Theme>("Theme")({
  appId: S.String,
  environmentName: S.String,
  id: S.String,
  name: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  values: ThemeValuesList,
  overrides: S.optional(ThemeValuesList),
  tags: S.optional(Tags),
}) {}
export const ThemeList = S.Array(Theme);
export class ExchangeCodeForTokenRequest extends S.Class<ExchangeCodeForTokenRequest>(
  "ExchangeCodeForTokenRequest",
)(
  {
    provider: S.String.pipe(T.HttpLabel("provider")),
    request: ExchangeCodeForTokenRequestBody.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tokens/{provider}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: Tags }) {}
export class PutMetadataFlagRequest extends S.Class<PutMetadataFlagRequest>(
  "PutMetadataFlagRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    featureName: S.String.pipe(T.HttpLabel("featureName")),
    body: PutMetadataFlagBody.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/app/{appId}/environment/{environmentName}/metadata/features/{featureName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutMetadataFlagResponse extends S.Class<PutMetadataFlagResponse>(
  "PutMetadataFlagResponse",
)({}) {}
export class RefreshTokenRequest extends S.Class<RefreshTokenRequest>(
  "RefreshTokenRequest",
)(
  {
    provider: S.String.pipe(T.HttpLabel("provider")),
    refreshTokenBody: RefreshTokenRequestBody.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tokens/{provider}/refresh" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export class UpdateComponentRequest extends S.Class<UpdateComponentRequest>(
  "UpdateComponentRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    updatedComponent: UpdateComponentData.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/app/{appId}/environment/{environmentName}/components/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportComponentsResponse extends S.Class<ExportComponentsResponse>(
  "ExportComponentsResponse",
)({ entities: ComponentList, nextToken: S.optional(S.String) }) {}
export class UpdateFormRequest extends S.Class<UpdateFormRequest>(
  "UpdateFormRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    updatedForm: UpdateFormData.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/app/{appId}/environment/{environmentName}/forms/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportFormsResponse extends S.Class<ExportFormsResponse>(
  "ExportFormsResponse",
)({ entities: FormList, nextToken: S.optional(S.String) }) {}
export class UpdateThemeRequest extends S.Class<UpdateThemeRequest>(
  "UpdateThemeRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    updatedTheme: UpdateThemeData.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/app/{appId}/environment/{environmentName}/themes/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportThemesResponse extends S.Class<ExportThemesResponse>(
  "ExportThemesResponse",
)({ entities: ThemeList, nextToken: S.optional(S.String) }) {}
export class CodegenFeatureFlags extends S.Class<CodegenFeatureFlags>(
  "CodegenFeatureFlags",
)({
  isRelationshipSupported: S.optional(S.Boolean),
  isNonModelSupported: S.optional(S.Boolean),
}) {}
export class ComponentChild extends S.Class<ComponentChild>("ComponentChild")({
  componentType: S.String,
  name: S.String,
  properties: ComponentProperties,
  children: S.optional(S.suspend(() => ComponentChildList)),
  events: S.optional(ComponentEvents),
  sourceId: S.optional(S.String),
}) {}
export type ComponentPropertyList = ComponentProperty[];
export const ComponentPropertyList = S.Array(
  S.suspend((): S.Schema<ComponentProperty, any> => ComponentProperty),
) as any as S.Schema<ComponentPropertyList>;
export const FeaturesMap = S.Record({ key: S.String, value: S.String });
export class CodegenJobSummary extends S.Class<CodegenJobSummary>(
  "CodegenJobSummary",
)({
  appId: S.String,
  environmentName: S.String,
  id: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const CodegenJobSummaryList = S.Array(CodegenJobSummary);
export class ComponentSummary extends S.Class<ComponentSummary>(
  "ComponentSummary",
)({
  appId: S.String,
  environmentName: S.String,
  id: S.String,
  name: S.String,
  componentType: S.String,
}) {}
export const ComponentSummaryList = S.Array(ComponentSummary);
export class FormSummary extends S.Class<FormSummary>("FormSummary")({
  appId: S.String,
  dataType: FormDataTypeConfig,
  environmentName: S.String,
  formActionType: S.String,
  id: S.String,
  name: S.String,
}) {}
export const FormSummaryList = S.Array(FormSummary);
export class ThemeSummary extends S.Class<ThemeSummary>("ThemeSummary")({
  appId: S.String,
  environmentName: S.String,
  id: S.String,
  name: S.String,
}) {}
export const ThemeSummaryList = S.Array(ThemeSummary);
export class ThemeValue extends S.Class<ThemeValue>("ThemeValue")({
  value: S.optional(S.String),
  children: S.optional(S.suspend(() => ThemeValuesList)),
}) {}
export class ExchangeCodeForTokenResponse extends S.Class<ExchangeCodeForTokenResponse>(
  "ExchangeCodeForTokenResponse",
)({ accessToken: S.String, expiresIn: S.Number, refreshToken: S.String }) {}
export class GetMetadataResponse extends S.Class<GetMetadataResponse>(
  "GetMetadataResponse",
)({ features: FeaturesMap }) {}
export class RefreshTokenResponse extends S.Class<RefreshTokenResponse>(
  "RefreshTokenResponse",
)({ accessToken: S.String, expiresIn: S.Number }) {}
export class DataStoreRenderConfig extends S.Class<DataStoreRenderConfig>(
  "DataStoreRenderConfig",
)({}) {}
export class NoApiRenderConfig extends S.Class<NoApiRenderConfig>(
  "NoApiRenderConfig",
)({}) {}
export const CodegenPrimaryKeysList = S.Array(S.String);
export const CodegenGenericDataEnumValuesList = S.Array(S.String);
export class ListCodegenJobsResponse extends S.Class<ListCodegenJobsResponse>(
  "ListCodegenJobsResponse",
)({ entities: CodegenJobSummaryList, nextToken: S.optional(S.String) }) {}
export class GetComponentResponse extends S.Class<GetComponentResponse>(
  "GetComponentResponse",
)({ component: S.optional(Component).pipe(T.HttpPayload()) }) {}
export class UpdateComponentResponse extends S.Class<UpdateComponentResponse>(
  "UpdateComponentResponse",
)({ entity: S.optional(Component).pipe(T.HttpPayload()) }) {}
export class ListComponentsResponse extends S.Class<ListComponentsResponse>(
  "ListComponentsResponse",
)({ entities: ComponentSummaryList, nextToken: S.optional(S.String) }) {}
export class GetFormResponse extends S.Class<GetFormResponse>(
  "GetFormResponse",
)({ form: S.optional(Form).pipe(T.HttpPayload()) }) {}
export class UpdateFormResponse extends S.Class<UpdateFormResponse>(
  "UpdateFormResponse",
)({ entity: S.optional(Form).pipe(T.HttpPayload()) }) {}
export class ListFormsResponse extends S.Class<ListFormsResponse>(
  "ListFormsResponse",
)({ entities: FormSummaryList, nextToken: S.optional(S.String) }) {}
export class GetThemeResponse extends S.Class<GetThemeResponse>(
  "GetThemeResponse",
)({ theme: S.optional(Theme).pipe(T.HttpPayload()) }) {}
export class UpdateThemeResponse extends S.Class<UpdateThemeResponse>(
  "UpdateThemeResponse",
)({ entity: S.optional(Theme).pipe(T.HttpPayload()) }) {}
export class ListThemesResponse extends S.Class<ListThemesResponse>(
  "ListThemesResponse",
)({ entities: ThemeSummaryList, nextToken: S.optional(S.String) }) {}
export class CodegenJobAsset extends S.Class<CodegenJobAsset>(
  "CodegenJobAsset",
)({ downloadUrl: S.optional(S.String) }) {}
export class CodegenDependency extends S.Class<CodegenDependency>(
  "CodegenDependency",
)({
  name: S.optional(S.String),
  supportedVersion: S.optional(S.String),
  isSemVer: S.optional(S.Boolean),
  reason: S.optional(S.String),
}) {}
export const CodegenDependencies = S.Array(CodegenDependency);
export class ThemeValues extends S.Class<ThemeValues>("ThemeValues")({
  key: S.optional(S.String),
  value: S.optional(S.suspend((): S.Schema<ThemeValue, any> => ThemeValue)),
}) {}
export const ReactCodegenDependencies = S.Record({
  key: S.String,
  value: S.String,
});
export class CodegenGenericDataEnum extends S.Class<CodegenGenericDataEnum>(
  "CodegenGenericDataEnum",
)({ values: CodegenGenericDataEnumValuesList }) {}
export class ComponentConditionProperty extends S.Class<ComponentConditionProperty>(
  "ComponentConditionProperty",
)({
  property: S.optional(S.String),
  field: S.optional(S.String),
  operator: S.optional(S.String),
  operand: S.optional(S.String),
  then: S.optional(
    S.suspend((): S.Schema<ComponentProperty, any> => ComponentProperty),
  ),
  else: S.optional(
    S.suspend((): S.Schema<ComponentProperty, any> => ComponentProperty),
  ),
  operandType: S.optional(S.String),
}) {}
export class GraphQLRenderConfig extends S.Class<GraphQLRenderConfig>(
  "GraphQLRenderConfig",
)({
  typesFilePath: S.String,
  queriesFilePath: S.String,
  mutationsFilePath: S.String,
  subscriptionsFilePath: S.String,
  fragmentsFilePath: S.String,
}) {}
export const ApiConfiguration = S.Union(
  S.Struct({ graphQLConfig: GraphQLRenderConfig }),
  S.Struct({ dataStoreConfig: DataStoreRenderConfig }),
  S.Struct({ noApiConfig: NoApiRenderConfig }),
);
export class ReactStartCodegenJobData extends S.Class<ReactStartCodegenJobData>(
  "ReactStartCodegenJobData",
)({
  module: S.optional(S.String),
  target: S.optional(S.String),
  script: S.optional(S.String),
  renderTypeDeclarations: S.optional(S.Boolean),
  inlineSourceMap: S.optional(S.Boolean),
  apiConfiguration: S.optional(ApiConfiguration),
  dependencies: S.optional(ReactCodegenDependencies),
}) {}
export const CodegenJobRenderConfig = S.Union(
  S.Struct({ react: ReactStartCodegenJobData }),
);
export const RelatedModelFieldsList = S.Array(S.String);
export const AssociatedFieldsList = S.Array(S.String);
export class CodegenGenericDataRelationshipType extends S.Class<CodegenGenericDataRelationshipType>(
  "CodegenGenericDataRelationshipType",
)({
  type: S.String,
  relatedModelName: S.String,
  relatedModelFields: S.optional(RelatedModelFieldsList),
  canUnlinkAssociatedModel: S.optional(S.Boolean),
  relatedJoinFieldName: S.optional(S.String),
  relatedJoinTableName: S.optional(S.String),
  belongsToFieldOnRelatedModel: S.optional(S.String),
  associatedFields: S.optional(AssociatedFieldsList),
  isHasManyIndex: S.optional(S.Boolean),
}) {}
export class CodegenGenericDataField extends S.Class<CodegenGenericDataField>(
  "CodegenGenericDataField",
)({
  dataType: S.String,
  dataTypeValue: S.String,
  required: S.Boolean,
  readOnly: S.Boolean,
  isArray: S.Boolean,
  relationship: S.optional(CodegenGenericDataRelationshipType),
}) {}
export const CodegenGenericDataFields = S.Record({
  key: S.String,
  value: CodegenGenericDataField,
});
export class CodegenGenericDataModel extends S.Class<CodegenGenericDataModel>(
  "CodegenGenericDataModel",
)({
  fields: CodegenGenericDataFields,
  isJoinTable: S.optional(S.Boolean),
  primaryKeys: CodegenPrimaryKeysList,
}) {}
export const CodegenGenericDataModels = S.Record({
  key: S.String,
  value: CodegenGenericDataModel,
});
export const CodegenGenericDataEnums = S.Record({
  key: S.String,
  value: CodegenGenericDataEnum,
});
export const CodegenGenericDataNonModelFields = S.Record({
  key: S.String,
  value: CodegenGenericDataField,
});
export class CodegenGenericDataNonModel extends S.Class<CodegenGenericDataNonModel>(
  "CodegenGenericDataNonModel",
)({ fields: CodegenGenericDataNonModelFields }) {}
export const CodegenGenericDataNonModels = S.Record({
  key: S.String,
  value: CodegenGenericDataNonModel,
});
export class CodegenJobGenericDataSchema extends S.Class<CodegenJobGenericDataSchema>(
  "CodegenJobGenericDataSchema",
)({
  dataSourceType: S.String,
  models: CodegenGenericDataModels,
  enums: CodegenGenericDataEnums,
  nonModels: CodegenGenericDataNonModels,
}) {}
export class CodegenJob extends S.Class<CodegenJob>("CodegenJob")({
  id: S.String,
  appId: S.String,
  environmentName: S.String,
  renderConfig: S.optional(CodegenJobRenderConfig),
  genericDataSchema: S.optional(CodegenJobGenericDataSchema),
  autoGenerateForms: S.optional(S.Boolean),
  features: S.optional(CodegenFeatureFlags),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  asset: S.optional(CodegenJobAsset),
  tags: S.optional(Tags),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  dependencies: S.optional(CodegenDependencies),
}) {}
export class CreateThemeData extends S.Class<CreateThemeData>(
  "CreateThemeData",
)({
  name: S.String,
  values: ThemeValuesList,
  overrides: S.optional(ThemeValuesList),
  tags: S.optional(Tags),
}) {}
export class GetCodegenJobResponse extends S.Class<GetCodegenJobResponse>(
  "GetCodegenJobResponse",
)({ job: S.optional(CodegenJob).pipe(T.HttpPayload()) }) {}
export class CreateThemeRequest extends S.Class<CreateThemeRequest>(
  "CreateThemeRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    themeToCreate: CreateThemeData.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/app/{appId}/environment/{environmentName}/themes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export type FormInputValuePropertyList = FormInputValueProperty[];
export const FormInputValuePropertyList = S.Array(
  S.suspend(
    (): S.Schema<FormInputValueProperty, any> => FormInputValueProperty,
  ),
) as any as S.Schema<FormInputValuePropertyList>;
export class CreateThemeResponse extends S.Class<CreateThemeResponse>(
  "CreateThemeResponse",
)({ entity: S.optional(Theme).pipe(T.HttpPayload()) }) {}
export class CreateComponentData extends S.Class<CreateComponentData>(
  "CreateComponentData",
)({
  name: S.String,
  sourceId: S.optional(S.String),
  componentType: S.String,
  properties: ComponentProperties,
  children: S.optional(ComponentChildList),
  variants: ComponentVariants,
  overrides: ComponentOverrides,
  bindingProperties: ComponentBindingProperties,
  collectionProperties: S.optional(ComponentCollectionProperties),
  tags: S.optional(Tags),
  events: S.optional(ComponentEvents),
  schemaVersion: S.optional(S.String),
}) {}
export class CreateComponentRequest extends S.Class<CreateComponentRequest>(
  "CreateComponentRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    componentToCreate: CreateComponentData.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/app/{appId}/environment/{environmentName}/components",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateComponentResponse extends S.Class<CreateComponentResponse>(
  "CreateComponentResponse",
)({ entity: S.optional(Component).pipe(T.HttpPayload()) }) {}
export class StartCodegenJobData extends S.Class<StartCodegenJobData>(
  "StartCodegenJobData",
)({
  renderConfig: CodegenJobRenderConfig,
  genericDataSchema: S.optional(CodegenJobGenericDataSchema),
  autoGenerateForms: S.optional(S.Boolean),
  features: S.optional(CodegenFeatureFlags),
  tags: S.optional(Tags),
}) {}
export class StartCodegenJobRequest extends S.Class<StartCodegenJobRequest>(
  "StartCodegenJobRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    codegenJobToCreate: StartCodegenJobData.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/app/{appId}/environment/{environmentName}/codegen-jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFormData extends S.Class<CreateFormData>("CreateFormData")({
  name: S.String,
  dataType: FormDataTypeConfig,
  formActionType: S.String,
  fields: FieldsMap,
  style: FormStyle,
  sectionalElements: SectionalElementMap,
  schemaVersion: S.String,
  cta: S.optional(FormCTA),
  tags: S.optional(Tags),
  labelDecorator: S.optional(S.String),
}) {}
export class StartCodegenJobResponse extends S.Class<StartCodegenJobResponse>(
  "StartCodegenJobResponse",
)({ entity: S.optional(CodegenJob).pipe(T.HttpPayload()) }) {}
export class CreateFormRequest extends S.Class<CreateFormRequest>(
  "CreateFormRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    formToCreate: CreateFormData.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/app/{appId}/environment/{environmentName}/forms",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFormResponse extends S.Class<CreateFormResponse>(
  "CreateFormResponse",
)({ entity: S.optional(Form).pipe(T.HttpPayload()) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * This is for internal use.
 *
 * Amplify uses this action to refresh a previously issued access token that might have expired.
 */
export const refreshToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RefreshTokenRequest,
  output: RefreshTokenResponse,
  errors: [InvalidParameterException],
}));
/**
 * Retrieves a list of components for a specified Amplify app and backend
 * environment.
 */
export const listComponents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListComponentsRequest,
    output: ListComponentsResponse,
    errors: [InternalServerException, InvalidParameterException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "entities",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves a list of forms for a specified Amplify app and backend environment.
 */
export const listForms = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFormsRequest,
  output: ListFormsResponse,
  errors: [InternalServerException, InvalidParameterException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "entities",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of themes for a specified Amplify app and backend
 * environment.
 */
export const listThemes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThemesRequest,
  output: ListThemesResponse,
  errors: [InternalServerException, InvalidParameterException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "entities",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Exports component configurations to code that is ready to integrate into an Amplify app.
 */
export const exportComponents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ExportComponentsRequest,
    output: ExportComponentsResponse,
    errors: [InternalServerException, InvalidParameterException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "entities",
    } as const,
  }),
);
/**
 * Exports form configurations to code that is ready to integrate into an Amplify app.
 */
export const exportForms = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ExportFormsRequest,
    output: ExportFormsResponse,
    errors: [InternalServerException, InvalidParameterException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "entities",
    } as const,
  }),
);
/**
 * Exports theme configurations to code that is ready to integrate into an Amplify app.
 */
export const exportThemes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ExportThemesRequest,
    output: ExportThemesResponse,
    errors: [InternalServerException, InvalidParameterException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "entities",
    } as const,
  }),
);
/**
 * This is for internal use.
 *
 * Amplify uses this action to exchange an access code for a token.
 */
export const exchangeCodeForToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExchangeCodeForTokenRequest,
    output: ExchangeCodeForTokenResponse,
    errors: [InvalidParameterException],
  }),
);
/**
 * Stores the metadata information about a feature on a form.
 */
export const putMetadataFlag = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMetadataFlagRequest,
  output: PutMetadataFlagResponse,
  errors: [InvalidParameterException, UnauthorizedException],
}));
/**
 * Retrieves a list of code generation jobs for a specified Amplify app and backend environment.
 */
export const listCodegenJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCodegenJobsRequest,
    output: ListCodegenJobsResponse,
    errors: [
      InternalServerException,
      InvalidParameterException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "entities",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns an existing component for an Amplify app.
 */
export const getComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComponentRequest,
  output: GetComponentResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an existing component.
 */
export const updateComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateComponentRequest,
  output: UpdateComponentResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceConflictException,
  ],
}));
/**
 * Returns existing metadata for an Amplify app.
 */
export const getMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetadataRequest,
  output: GetMetadataResponse,
  errors: [InvalidParameterException, UnauthorizedException],
}));
/**
 * Returns an existing form for an Amplify app.
 */
export const getForm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFormRequest,
  output: GetFormResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns an existing theme for an Amplify app.
 */
export const getTheme = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetThemeRequest,
  output: GetThemeResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Untags a resource with a specified Amazon Resource Name (ARN).
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a component from an Amplify app.
 */
export const deleteComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteComponentRequest,
  output: DeleteComponentResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a form from an Amplify app.
 */
export const deleteForm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFormRequest,
  output: DeleteFormResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a theme from an Amplify app.
 */
export const deleteTheme = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThemeRequest,
  output: DeleteThemeResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of tags for a specified Amazon Resource Name (ARN).
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Tags the resource with a tag key and value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Returns an existing code generation job.
 */
export const getCodegenJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCodegenJobRequest,
  output: GetCodegenJobResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an existing form.
 */
export const updateForm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFormRequest,
  output: UpdateFormResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceConflictException,
  ],
}));
/**
 * Updates an existing theme.
 */
export const updateTheme = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThemeRequest,
  output: UpdateThemeResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceConflictException,
  ],
}));
/**
 * Creates a theme to apply to the components in an Amplify app.
 */
export const createTheme = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThemeRequest,
  output: CreateThemeResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceConflictException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Creates a new component for an Amplify app.
 */
export const createComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateComponentRequest,
  output: CreateComponentResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceConflictException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Starts a code generation job for a specified Amplify app and backend environment.
 */
export const startCodegenJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCodegenJobRequest,
  output: StartCodegenJobResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ThrottlingException,
  ],
}));
/**
 * Creates a new form for an Amplify app.
 */
export const createForm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFormRequest,
  output: CreateFormResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceConflictException,
    ServiceQuotaExceededException,
  ],
}));

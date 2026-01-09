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
  sdkId: "AmplifyUIBuilder",
  serviceShapeName: "AmplifyUIBuilder",
});
const auth = T.AwsAuthSigv4({ name: "amplifyuibuilder" });
const ver = T.ServiceVersion("2021-08-11");
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
              `https://amplifyuibuilder-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://amplifyuibuilder-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://amplifyuibuilder.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://amplifyuibuilder.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type TokenProviders = string;
export type TagKey = string;
export type AppId = string;
export type Uuid = string;
export type ListCodegenJobsLimit = number;
export type ListEntityLimit = number;
export type SensitiveString = string | redacted.Redacted<string>;
export type TagValue = string;
export type ComponentName = string;
export type ComponentType = string;
export type FormName = string;
export type LabelDecorator = string;
export type ThemeName = string;
export type FormDataSourceType = string;
export type OperandType = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface GetMetadataRequest {
  appId: string;
  environmentName: string;
}
export const GetMetadataRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetMetadataRequest",
}) as any as S.Schema<GetMetadataRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface GetCodegenJobRequest {
  appId: string;
  environmentName: string;
  id: string;
}
export const GetCodegenJobRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCodegenJobRequest",
}) as any as S.Schema<GetCodegenJobRequest>;
export interface ListCodegenJobsRequest {
  appId: string;
  environmentName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListCodegenJobsRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListCodegenJobsRequest",
}) as any as S.Schema<ListCodegenJobsRequest>;
export interface GetComponentRequest {
  appId: string;
  environmentName: string;
  id: string;
}
export const GetComponentRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetComponentRequest",
}) as any as S.Schema<GetComponentRequest>;
export interface DeleteComponentRequest {
  appId: string;
  environmentName: string;
  id: string;
}
export const DeleteComponentRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteComponentRequest",
}) as any as S.Schema<DeleteComponentRequest>;
export interface DeleteComponentResponse {}
export const DeleteComponentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteComponentResponse",
}) as any as S.Schema<DeleteComponentResponse>;
export interface ListComponentsRequest {
  appId: string;
  environmentName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListComponentsRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListComponentsRequest",
}) as any as S.Schema<ListComponentsRequest>;
export interface ExportComponentsRequest {
  appId: string;
  environmentName: string;
  nextToken?: string;
}
export const ExportComponentsRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ExportComponentsRequest",
}) as any as S.Schema<ExportComponentsRequest>;
export interface GetFormRequest {
  appId: string;
  environmentName: string;
  id: string;
}
export const GetFormRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetFormRequest",
}) as any as S.Schema<GetFormRequest>;
export interface DeleteFormRequest {
  appId: string;
  environmentName: string;
  id: string;
}
export const DeleteFormRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteFormRequest",
}) as any as S.Schema<DeleteFormRequest>;
export interface DeleteFormResponse {}
export const DeleteFormResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFormResponse",
}) as any as S.Schema<DeleteFormResponse>;
export interface ListFormsRequest {
  appId: string;
  environmentName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListFormsRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListFormsRequest",
}) as any as S.Schema<ListFormsRequest>;
export interface ExportFormsRequest {
  appId: string;
  environmentName: string;
  nextToken?: string;
}
export const ExportFormsRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ExportFormsRequest",
}) as any as S.Schema<ExportFormsRequest>;
export interface GetThemeRequest {
  appId: string;
  environmentName: string;
  id: string;
}
export const GetThemeRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetThemeRequest",
}) as any as S.Schema<GetThemeRequest>;
export interface DeleteThemeRequest {
  appId: string;
  environmentName: string;
  id: string;
}
export const DeleteThemeRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteThemeRequest",
}) as any as S.Schema<DeleteThemeRequest>;
export interface DeleteThemeResponse {}
export const DeleteThemeResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteThemeResponse",
}) as any as S.Schema<DeleteThemeResponse>;
export interface ListThemesRequest {
  appId: string;
  environmentName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListThemesRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListThemesRequest",
}) as any as S.Schema<ListThemesRequest>;
export interface ExportThemesRequest {
  appId: string;
  environmentName: string;
  nextToken?: string;
}
export const ExportThemesRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ExportThemesRequest",
}) as any as S.Schema<ExportThemesRequest>;
export type FormActionType = "create" | "update" | (string & {});
export const FormActionType = S.String;
export interface ExchangeCodeForTokenRequestBody {
  code: string | redacted.Redacted<string>;
  redirectUri: string;
  clientId?: string | redacted.Redacted<string>;
}
export const ExchangeCodeForTokenRequestBody = S.suspend(() =>
  S.Struct({
    code: SensitiveString,
    redirectUri: S.String,
    clientId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ExchangeCodeForTokenRequestBody",
}) as any as S.Schema<ExchangeCodeForTokenRequestBody>;
export interface PutMetadataFlagBody {
  newValue: string;
}
export const PutMetadataFlagBody = S.suspend(() =>
  S.Struct({ newValue: S.String }),
).annotations({
  identifier: "PutMetadataFlagBody",
}) as any as S.Schema<PutMetadataFlagBody>;
export interface RefreshTokenRequestBody {
  token: string | redacted.Redacted<string>;
  clientId?: string | redacted.Redacted<string>;
}
export const RefreshTokenRequestBody = S.suspend(() =>
  S.Struct({ token: SensitiveString, clientId: S.optional(SensitiveString) }),
).annotations({
  identifier: "RefreshTokenRequestBody",
}) as any as S.Schema<RefreshTokenRequestBody>;
export type Tags = { [key: string]: string | undefined };
export const Tags = S.Record({ key: S.String, value: S.UndefinedOr(S.String) });
export interface ComponentPropertyBindingProperties {
  property: string;
  field?: string;
}
export const ComponentPropertyBindingProperties = S.suspend(() =>
  S.Struct({ property: S.String, field: S.optional(S.String) }),
).annotations({
  identifier: "ComponentPropertyBindingProperties",
}) as any as S.Schema<ComponentPropertyBindingProperties>;
export interface FormBindingElement {
  element: string;
  property: string;
}
export const FormBindingElement = S.suspend(() =>
  S.Struct({ element: S.String, property: S.String }),
).annotations({
  identifier: "FormBindingElement",
}) as any as S.Schema<FormBindingElement>;
export type FormBindings = { [key: string]: FormBindingElement | undefined };
export const FormBindings = S.Record({
  key: S.String,
  value: S.UndefinedOr(FormBindingElement),
});
export interface ComponentProperty {
  value?: string;
  bindingProperties?: ComponentPropertyBindingProperties;
  collectionBindingProperties?: ComponentPropertyBindingProperties;
  defaultValue?: string;
  model?: string;
  bindings?: { [key: string]: FormBindingElement | undefined };
  event?: string;
  userAttribute?: string;
  concat?: ComponentProperty[];
  condition?: ComponentConditionProperty;
  configured?: boolean;
  type?: string;
  importedValue?: string;
  componentName?: string;
  property?: string;
}
export const ComponentProperty = S.suspend(() =>
  S.Struct({
    value: S.optional(S.String),
    bindingProperties: S.optional(ComponentPropertyBindingProperties),
    collectionBindingProperties: S.optional(ComponentPropertyBindingProperties),
    defaultValue: S.optional(S.String),
    model: S.optional(S.String),
    bindings: S.optional(FormBindings),
    event: S.optional(S.String),
    userAttribute: S.optional(S.String),
    concat: S.optional(
      S.suspend(() => ComponentPropertyList).annotations({
        identifier: "ComponentPropertyList",
      }),
    ),
    condition: S.optional(
      S.suspend(
        (): S.Schema<ComponentConditionProperty, any> =>
          ComponentConditionProperty,
      ).annotations({ identifier: "ComponentConditionProperty" }),
    ),
    configured: S.optional(S.Boolean),
    type: S.optional(S.String),
    importedValue: S.optional(S.String),
    componentName: S.optional(S.String),
    property: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentProperty",
}) as any as S.Schema<ComponentProperty>;
export type ComponentProperties = {
  [key: string]: ComponentProperty | undefined;
};
export const ComponentProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(
    S.suspend(
      (): S.Schema<ComponentProperty, any> => ComponentProperty,
    ).annotations({ identifier: "ComponentProperty" }),
  ),
});
export type ComponentChildList = ComponentChild[];
export const ComponentChildList = S.Array(
  S.suspend((): S.Schema<ComponentChild, any> => ComponentChild).annotations({
    identifier: "ComponentChild",
  }),
) as any as S.Schema<ComponentChildList>;
export type ComponentVariantValues = { [key: string]: string | undefined };
export const ComponentVariantValues = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type ComponentOverridesValue = { [key: string]: string | undefined };
export const ComponentOverridesValue = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type ComponentOverrides = {
  [key: string]: { [key: string]: string | undefined } | undefined;
};
export const ComponentOverrides = S.Record({
  key: S.String,
  value: S.UndefinedOr(ComponentOverridesValue),
});
export interface ComponentVariant {
  variantValues?: { [key: string]: string | undefined };
  overrides?: {
    [key: string]: { [key: string]: string | undefined } | undefined;
  };
}
export const ComponentVariant = S.suspend(() =>
  S.Struct({
    variantValues: S.optional(ComponentVariantValues),
    overrides: S.optional(ComponentOverrides),
  }),
).annotations({
  identifier: "ComponentVariant",
}) as any as S.Schema<ComponentVariant>;
export type ComponentVariants = ComponentVariant[];
export const ComponentVariants = S.Array(ComponentVariant);
export type PredicateList = Predicate[];
export const PredicateList = S.Array(
  S.suspend((): S.Schema<Predicate, any> => Predicate).annotations({
    identifier: "Predicate",
  }),
) as any as S.Schema<PredicateList>;
export interface ComponentBindingPropertiesValueProperties {
  model?: string;
  field?: string;
  predicates?: Predicate[];
  userAttribute?: string;
  bucket?: string;
  key?: string;
  defaultValue?: string;
  slotName?: string;
}
export const ComponentBindingPropertiesValueProperties = S.suspend(() =>
  S.Struct({
    model: S.optional(S.String),
    field: S.optional(S.String),
    predicates: S.optional(PredicateList),
    userAttribute: S.optional(S.String),
    bucket: S.optional(S.String),
    key: S.optional(S.String),
    defaultValue: S.optional(S.String),
    slotName: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentBindingPropertiesValueProperties",
}) as any as S.Schema<ComponentBindingPropertiesValueProperties>;
export interface ComponentBindingPropertiesValue {
  type?: string;
  bindingProperties?: ComponentBindingPropertiesValueProperties;
  defaultValue?: string;
}
export const ComponentBindingPropertiesValue = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    bindingProperties: S.optional(ComponentBindingPropertiesValueProperties),
    defaultValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentBindingPropertiesValue",
}) as any as S.Schema<ComponentBindingPropertiesValue>;
export type ComponentBindingProperties = {
  [key: string]: ComponentBindingPropertiesValue | undefined;
};
export const ComponentBindingProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(ComponentBindingPropertiesValue),
});
export type SortDirection = "ASC" | "DESC" | (string & {});
export const SortDirection = S.String;
export interface SortProperty {
  field: string;
  direction: SortDirection;
}
export const SortProperty = S.suspend(() =>
  S.Struct({ field: S.String, direction: SortDirection }),
).annotations({ identifier: "SortProperty" }) as any as S.Schema<SortProperty>;
export type SortPropertyList = SortProperty[];
export const SortPropertyList = S.Array(SortProperty);
export interface Predicate {
  or?: Predicate[];
  and?: Predicate[];
  field?: string;
  operator?: string;
  operand?: string;
  operandType?: string;
}
export const Predicate = S.suspend(() =>
  S.Struct({
    or: S.optional(
      S.suspend(() => PredicateList).annotations({
        identifier: "PredicateList",
      }),
    ),
    and: S.optional(
      S.suspend(() => PredicateList).annotations({
        identifier: "PredicateList",
      }),
    ),
    field: S.optional(S.String),
    operator: S.optional(S.String),
    operand: S.optional(S.String),
    operandType: S.optional(S.String),
  }),
).annotations({ identifier: "Predicate" }) as any as S.Schema<Predicate>;
export type IdentifierList = string[];
export const IdentifierList = S.Array(S.String);
export interface ComponentDataConfiguration {
  model: string;
  sort?: SortProperty[];
  predicate?: Predicate;
  identifiers?: string[];
}
export const ComponentDataConfiguration = S.suspend(() =>
  S.Struct({
    model: S.String,
    sort: S.optional(SortPropertyList),
    predicate: S.optional(Predicate),
    identifiers: S.optional(IdentifierList),
  }),
).annotations({
  identifier: "ComponentDataConfiguration",
}) as any as S.Schema<ComponentDataConfiguration>;
export type ComponentCollectionProperties = {
  [key: string]: ComponentDataConfiguration | undefined;
};
export const ComponentCollectionProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(ComponentDataConfiguration),
});
export interface MutationActionSetStateParameter {
  componentName: string;
  property: string;
  set: ComponentProperty;
}
export const MutationActionSetStateParameter = S.suspend(() =>
  S.Struct({
    componentName: S.String,
    property: S.String,
    set: ComponentProperty,
  }),
).annotations({
  identifier: "MutationActionSetStateParameter",
}) as any as S.Schema<MutationActionSetStateParameter>;
export interface ActionParameters {
  type?: ComponentProperty;
  url?: ComponentProperty;
  anchor?: ComponentProperty;
  target?: ComponentProperty;
  global?: ComponentProperty;
  model?: string;
  id?: ComponentProperty;
  fields?: { [key: string]: ComponentProperty | undefined };
  state?: MutationActionSetStateParameter;
}
export const ActionParameters = S.suspend(() =>
  S.Struct({
    type: S.optional(ComponentProperty),
    url: S.optional(ComponentProperty),
    anchor: S.optional(ComponentProperty),
    target: S.optional(ComponentProperty),
    global: S.optional(ComponentProperty),
    model: S.optional(S.String),
    id: S.optional(ComponentProperty),
    fields: S.optional(ComponentProperties),
    state: S.optional(MutationActionSetStateParameter),
  }),
).annotations({
  identifier: "ActionParameters",
}) as any as S.Schema<ActionParameters>;
export interface ComponentEvent {
  action?: string;
  parameters?: ActionParameters;
  bindingEvent?: string;
}
export const ComponentEvent = S.suspend(() =>
  S.Struct({
    action: S.optional(S.String),
    parameters: S.optional(ActionParameters),
    bindingEvent: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentEvent",
}) as any as S.Schema<ComponentEvent>;
export type ComponentEvents = { [key: string]: ComponentEvent | undefined };
export const ComponentEvents = S.Record({
  key: S.String,
  value: S.UndefinedOr(ComponentEvent),
});
export interface UpdateComponentData {
  id?: string;
  name?: string;
  sourceId?: string;
  componentType?: string;
  properties?: { [key: string]: ComponentProperty | undefined };
  children?: ComponentChild[];
  variants?: ComponentVariant[];
  overrides?: {
    [key: string]: { [key: string]: string | undefined } | undefined;
  };
  bindingProperties?: {
    [key: string]: ComponentBindingPropertiesValue | undefined;
  };
  collectionProperties?: {
    [key: string]: ComponentDataConfiguration | undefined;
  };
  events?: { [key: string]: ComponentEvent | undefined };
  schemaVersion?: string;
}
export const UpdateComponentData = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "UpdateComponentData",
}) as any as S.Schema<UpdateComponentData>;
export interface Component {
  appId: string;
  environmentName: string;
  sourceId?: string;
  id: string;
  name: string;
  componentType: string;
  properties: { [key: string]: ComponentProperty | undefined };
  children?: ComponentChild[];
  variants: ComponentVariant[];
  overrides: {
    [key: string]: { [key: string]: string | undefined } | undefined;
  };
  bindingProperties: {
    [key: string]: ComponentBindingPropertiesValue | undefined;
  };
  collectionProperties?: {
    [key: string]: ComponentDataConfiguration | undefined;
  };
  createdAt: Date;
  modifiedAt?: Date;
  tags?: { [key: string]: string | undefined };
  events?: { [key: string]: ComponentEvent | undefined };
  schemaVersion?: string;
}
export const Component = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Component" }) as any as S.Schema<Component>;
export type ComponentList = Component[];
export const ComponentList = S.Array(Component);
export interface FormDataTypeConfig {
  dataSourceType: string;
  dataTypeName: string;
}
export const FormDataTypeConfig = S.suspend(() =>
  S.Struct({ dataSourceType: S.String, dataTypeName: S.String }),
).annotations({
  identifier: "FormDataTypeConfig",
}) as any as S.Schema<FormDataTypeConfig>;
export type FixedPosition = "first" | (string & {});
export const FixedPosition = S.String;
export type FieldPosition =
  | { fixed: FixedPosition; rightOf?: never; below?: never }
  | { fixed?: never; rightOf: string; below?: never }
  | { fixed?: never; rightOf?: never; below: string };
export const FieldPosition = S.Union(
  S.Struct({ fixed: FixedPosition }),
  S.Struct({ rightOf: S.String }),
  S.Struct({ below: S.String }),
);
export interface FormInputValuePropertyBindingProperties {
  property: string;
  field?: string;
}
export const FormInputValuePropertyBindingProperties = S.suspend(() =>
  S.Struct({ property: S.String, field: S.optional(S.String) }),
).annotations({
  identifier: "FormInputValuePropertyBindingProperties",
}) as any as S.Schema<FormInputValuePropertyBindingProperties>;
export interface FormInputValueProperty {
  value?: string;
  bindingProperties?: FormInputValuePropertyBindingProperties;
  concat?: FormInputValueProperty[];
}
export const FormInputValueProperty = S.suspend(() =>
  S.Struct({
    value: S.optional(S.String),
    bindingProperties: S.optional(FormInputValuePropertyBindingProperties),
    concat: S.optional(
      S.suspend(() => FormInputValuePropertyList).annotations({
        identifier: "FormInputValuePropertyList",
      }),
    ),
  }),
).annotations({
  identifier: "FormInputValueProperty",
}) as any as S.Schema<FormInputValueProperty>;
export interface ValueMapping {
  displayValue?: FormInputValueProperty;
  value: FormInputValueProperty;
}
export const ValueMapping = S.suspend(() =>
  S.Struct({
    displayValue: S.optional(FormInputValueProperty),
    value: FormInputValueProperty,
  }),
).annotations({ identifier: "ValueMapping" }) as any as S.Schema<ValueMapping>;
export type ValueMappingList = ValueMapping[];
export const ValueMappingList = S.Array(ValueMapping);
export interface FormInputBindingPropertiesValueProperties {
  model?: string;
}
export const FormInputBindingPropertiesValueProperties = S.suspend(() =>
  S.Struct({ model: S.optional(S.String) }),
).annotations({
  identifier: "FormInputBindingPropertiesValueProperties",
}) as any as S.Schema<FormInputBindingPropertiesValueProperties>;
export interface FormInputBindingPropertiesValue {
  type?: string;
  bindingProperties?: FormInputBindingPropertiesValueProperties;
}
export const FormInputBindingPropertiesValue = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    bindingProperties: S.optional(FormInputBindingPropertiesValueProperties),
  }),
).annotations({
  identifier: "FormInputBindingPropertiesValue",
}) as any as S.Schema<FormInputBindingPropertiesValue>;
export type FormInputBindingProperties = {
  [key: string]: FormInputBindingPropertiesValue | undefined;
};
export const FormInputBindingProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(FormInputBindingPropertiesValue),
});
export interface ValueMappings {
  values: ValueMapping[];
  bindingProperties?: {
    [key: string]: FormInputBindingPropertiesValue | undefined;
  };
}
export const ValueMappings = S.suspend(() =>
  S.Struct({
    values: ValueMappingList,
    bindingProperties: S.optional(FormInputBindingProperties),
  }),
).annotations({
  identifier: "ValueMappings",
}) as any as S.Schema<ValueMappings>;
export type StorageAccessLevel =
  | "public"
  | "protected"
  | "private"
  | (string & {});
export const StorageAccessLevel = S.String;
export type StrValues = string[];
export const StrValues = S.Array(S.String);
export interface FileUploaderFieldConfig {
  accessLevel: StorageAccessLevel;
  acceptedFileTypes: string[];
  showThumbnails?: boolean;
  isResumable?: boolean;
  maxFileCount?: number;
  maxSize?: number;
}
export const FileUploaderFieldConfig = S.suspend(() =>
  S.Struct({
    accessLevel: StorageAccessLevel,
    acceptedFileTypes: StrValues,
    showThumbnails: S.optional(S.Boolean),
    isResumable: S.optional(S.Boolean),
    maxFileCount: S.optional(S.Number),
    maxSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "FileUploaderFieldConfig",
}) as any as S.Schema<FileUploaderFieldConfig>;
export interface FieldInputConfig {
  type: string;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  defaultValue?: string;
  descriptiveText?: string;
  defaultChecked?: boolean;
  defaultCountryCode?: string;
  valueMappings?: ValueMappings;
  name?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  value?: string;
  isArray?: boolean;
  fileUploaderConfig?: FileUploaderFieldConfig;
}
export const FieldInputConfig = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "FieldInputConfig",
}) as any as S.Schema<FieldInputConfig>;
export type NumValues = number[];
export const NumValues = S.Array(S.Number);
export interface FieldValidationConfiguration {
  type: string;
  strValues?: string[];
  numValues?: number[];
  validationMessage?: string;
}
export const FieldValidationConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    strValues: S.optional(StrValues),
    numValues: S.optional(NumValues),
    validationMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "FieldValidationConfiguration",
}) as any as S.Schema<FieldValidationConfiguration>;
export type ValidationsList = FieldValidationConfiguration[];
export const ValidationsList = S.Array(FieldValidationConfiguration);
export interface FieldConfig {
  label?: string;
  position?: FieldPosition;
  excluded?: boolean;
  inputType?: FieldInputConfig;
  validations?: FieldValidationConfiguration[];
}
export const FieldConfig = S.suspend(() =>
  S.Struct({
    label: S.optional(S.String),
    position: S.optional(FieldPosition),
    excluded: S.optional(S.Boolean),
    inputType: S.optional(FieldInputConfig),
    validations: S.optional(ValidationsList),
  }),
).annotations({ identifier: "FieldConfig" }) as any as S.Schema<FieldConfig>;
export type FieldsMap = { [key: string]: FieldConfig | undefined };
export const FieldsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(FieldConfig),
});
export type FormStyleConfig =
  | { tokenReference: string; value?: never }
  | { tokenReference?: never; value: string };
export const FormStyleConfig = S.Union(
  S.Struct({ tokenReference: S.String }),
  S.Struct({ value: S.String }),
);
export interface FormStyle {
  horizontalGap?: FormStyleConfig;
  verticalGap?: FormStyleConfig;
  outerPadding?: FormStyleConfig;
}
export const FormStyle = S.suspend(() =>
  S.Struct({
    horizontalGap: S.optional(FormStyleConfig),
    verticalGap: S.optional(FormStyleConfig),
    outerPadding: S.optional(FormStyleConfig),
  }),
).annotations({ identifier: "FormStyle" }) as any as S.Schema<FormStyle>;
export interface SectionalElement {
  type: string;
  position?: FieldPosition;
  text?: string;
  level?: number;
  orientation?: string;
  excluded?: boolean;
}
export const SectionalElement = S.suspend(() =>
  S.Struct({
    type: S.String,
    position: S.optional(FieldPosition),
    text: S.optional(S.String),
    level: S.optional(S.Number),
    orientation: S.optional(S.String),
    excluded: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SectionalElement",
}) as any as S.Schema<SectionalElement>;
export type SectionalElementMap = {
  [key: string]: SectionalElement | undefined;
};
export const SectionalElementMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(SectionalElement),
});
export type FormButtonsPosition =
  | "top"
  | "bottom"
  | "top_and_bottom"
  | (string & {});
export const FormButtonsPosition = S.String;
export interface FormButton {
  excluded?: boolean;
  children?: string;
  position?: FieldPosition;
}
export const FormButton = S.suspend(() =>
  S.Struct({
    excluded: S.optional(S.Boolean),
    children: S.optional(S.String),
    position: S.optional(FieldPosition),
  }),
).annotations({ identifier: "FormButton" }) as any as S.Schema<FormButton>;
export interface FormCTA {
  position?: FormButtonsPosition;
  clear?: FormButton;
  cancel?: FormButton;
  submit?: FormButton;
}
export const FormCTA = S.suspend(() =>
  S.Struct({
    position: S.optional(FormButtonsPosition),
    clear: S.optional(FormButton),
    cancel: S.optional(FormButton),
    submit: S.optional(FormButton),
  }),
).annotations({ identifier: "FormCTA" }) as any as S.Schema<FormCTA>;
export interface UpdateFormData {
  name?: string;
  dataType?: FormDataTypeConfig;
  formActionType?: FormActionType;
  fields?: { [key: string]: FieldConfig | undefined };
  style?: FormStyle;
  sectionalElements?: { [key: string]: SectionalElement | undefined };
  schemaVersion?: string;
  cta?: FormCTA;
  labelDecorator?: string;
}
export const UpdateFormData = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    dataType: S.optional(FormDataTypeConfig),
    formActionType: S.optional(FormActionType),
    fields: S.optional(FieldsMap),
    style: S.optional(FormStyle),
    sectionalElements: S.optional(SectionalElementMap),
    schemaVersion: S.optional(S.String),
    cta: S.optional(FormCTA),
    labelDecorator: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateFormData",
}) as any as S.Schema<UpdateFormData>;
export interface Form {
  appId: string;
  environmentName: string;
  id: string;
  name: string;
  formActionType: FormActionType;
  style: FormStyle;
  dataType: FormDataTypeConfig;
  fields: { [key: string]: FieldConfig | undefined };
  sectionalElements: { [key: string]: SectionalElement | undefined };
  schemaVersion: string;
  tags?: { [key: string]: string | undefined };
  cta?: FormCTA;
  labelDecorator?: string;
}
export const Form = S.suspend(() =>
  S.Struct({
    appId: S.String,
    environmentName: S.String,
    id: S.String,
    name: S.String,
    formActionType: FormActionType,
    style: FormStyle,
    dataType: FormDataTypeConfig,
    fields: FieldsMap,
    sectionalElements: SectionalElementMap,
    schemaVersion: S.String,
    tags: S.optional(Tags),
    cta: S.optional(FormCTA),
    labelDecorator: S.optional(S.String),
  }),
).annotations({ identifier: "Form" }) as any as S.Schema<Form>;
export type FormList = Form[];
export const FormList = S.Array(Form);
export type ThemeValuesList = ThemeValues[];
export const ThemeValuesList = S.Array(
  S.suspend((): S.Schema<ThemeValues, any> => ThemeValues).annotations({
    identifier: "ThemeValues",
  }),
) as any as S.Schema<ThemeValuesList>;
export interface UpdateThemeData {
  id?: string;
  name?: string;
  values: ThemeValues[];
  overrides?: ThemeValues[];
}
export const UpdateThemeData = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    values: ThemeValuesList,
    overrides: S.optional(ThemeValuesList),
  }),
).annotations({
  identifier: "UpdateThemeData",
}) as any as S.Schema<UpdateThemeData>;
export interface Theme {
  appId: string;
  environmentName: string;
  id: string;
  name: string;
  createdAt: Date;
  modifiedAt?: Date;
  values: ThemeValues[];
  overrides?: ThemeValues[];
  tags?: { [key: string]: string | undefined };
}
export const Theme = S.suspend(() =>
  S.Struct({
    appId: S.String,
    environmentName: S.String,
    id: S.String,
    name: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    values: ThemeValuesList,
    overrides: S.optional(ThemeValuesList),
    tags: S.optional(Tags),
  }),
).annotations({ identifier: "Theme" }) as any as S.Schema<Theme>;
export type ThemeList = Theme[];
export const ThemeList = S.Array(Theme);
export type CodegenJobGenericDataSourceType = "DataStore" | (string & {});
export const CodegenJobGenericDataSourceType = S.String;
export interface ExchangeCodeForTokenRequest {
  provider: string;
  request: ExchangeCodeForTokenRequestBody;
}
export const ExchangeCodeForTokenRequest = S.suspend(() =>
  S.Struct({
    provider: S.String.pipe(T.HttpLabel("provider")),
    request: ExchangeCodeForTokenRequestBody.pipe(T.HttpPayload()).annotations({
      identifier: "ExchangeCodeForTokenRequestBody",
    }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tokens/{provider}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExchangeCodeForTokenRequest",
}) as any as S.Schema<ExchangeCodeForTokenRequest>;
export interface ListTagsForResourceResponse {
  tags: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: Tags }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutMetadataFlagRequest {
  appId: string;
  environmentName: string;
  featureName: string;
  body: PutMetadataFlagBody;
}
export const PutMetadataFlagRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    featureName: S.String.pipe(T.HttpLabel("featureName")),
    body: PutMetadataFlagBody.pipe(T.HttpPayload()).annotations({
      identifier: "PutMetadataFlagBody",
    }),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutMetadataFlagRequest",
}) as any as S.Schema<PutMetadataFlagRequest>;
export interface PutMetadataFlagResponse {}
export const PutMetadataFlagResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutMetadataFlagResponse",
}) as any as S.Schema<PutMetadataFlagResponse>;
export interface RefreshTokenRequest {
  provider: string;
  refreshTokenBody: RefreshTokenRequestBody;
}
export const RefreshTokenRequest = S.suspend(() =>
  S.Struct({
    provider: S.String.pipe(T.HttpLabel("provider")),
    refreshTokenBody: RefreshTokenRequestBody.pipe(T.HttpPayload()).annotations(
      { identifier: "RefreshTokenRequestBody" },
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tokens/{provider}/refresh" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RefreshTokenRequest",
}) as any as S.Schema<RefreshTokenRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface UpdateComponentRequest {
  appId: string;
  environmentName: string;
  id: string;
  clientToken?: string;
  updatedComponent: UpdateComponentData;
}
export const UpdateComponentRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
    updatedComponent: UpdateComponentData.pipe(T.HttpPayload()).annotations({
      identifier: "UpdateComponentData",
    }),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateComponentRequest",
}) as any as S.Schema<UpdateComponentRequest>;
export interface ExportComponentsResponse {
  entities: Component[];
  nextToken?: string;
}
export const ExportComponentsResponse = S.suspend(() =>
  S.Struct({ entities: ComponentList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ExportComponentsResponse",
}) as any as S.Schema<ExportComponentsResponse>;
export interface UpdateFormRequest {
  appId: string;
  environmentName: string;
  id: string;
  clientToken?: string;
  updatedForm: UpdateFormData;
}
export const UpdateFormRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
    updatedForm: UpdateFormData.pipe(T.HttpPayload()).annotations({
      identifier: "UpdateFormData",
    }),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateFormRequest",
}) as any as S.Schema<UpdateFormRequest>;
export interface ExportFormsResponse {
  entities: Form[];
  nextToken?: string;
}
export const ExportFormsResponse = S.suspend(() =>
  S.Struct({ entities: FormList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ExportFormsResponse",
}) as any as S.Schema<ExportFormsResponse>;
export interface UpdateThemeRequest {
  appId: string;
  environmentName: string;
  id: string;
  clientToken?: string;
  updatedTheme: UpdateThemeData;
}
export const UpdateThemeRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    id: S.String.pipe(T.HttpLabel("id")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
    updatedTheme: UpdateThemeData.pipe(T.HttpPayload()).annotations({
      identifier: "UpdateThemeData",
    }),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateThemeRequest",
}) as any as S.Schema<UpdateThemeRequest>;
export interface ExportThemesResponse {
  entities: Theme[];
  nextToken?: string;
}
export const ExportThemesResponse = S.suspend(() =>
  S.Struct({ entities: ThemeList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ExportThemesResponse",
}) as any as S.Schema<ExportThemesResponse>;
export interface CodegenFeatureFlags {
  isRelationshipSupported?: boolean;
  isNonModelSupported?: boolean;
}
export const CodegenFeatureFlags = S.suspend(() =>
  S.Struct({
    isRelationshipSupported: S.optional(S.Boolean),
    isNonModelSupported: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CodegenFeatureFlags",
}) as any as S.Schema<CodegenFeatureFlags>;
export type CodegenJobStatus =
  | "in_progress"
  | "failed"
  | "succeeded"
  | (string & {});
export const CodegenJobStatus = S.String;
export interface ComponentChild {
  componentType: string;
  name: string;
  properties: { [key: string]: ComponentProperty | undefined };
  children?: ComponentChild[];
  events?: { [key: string]: ComponentEvent | undefined };
  sourceId?: string;
}
export const ComponentChild = S.suspend(() =>
  S.Struct({
    componentType: S.String,
    name: S.String,
    properties: ComponentProperties,
    children: S.optional(
      S.suspend(() => ComponentChildList).annotations({
        identifier: "ComponentChildList",
      }),
    ),
    events: S.optional(ComponentEvents),
    sourceId: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentChild",
}) as any as S.Schema<ComponentChild>;
export type JSModule = "es2020" | "esnext" | (string & {});
export const JSModule = S.String;
export type JSTarget = "es2015" | "es2020" | (string & {});
export const JSTarget = S.String;
export type JSScript = "jsx" | "tsx" | "js" | (string & {});
export const JSScript = S.String;
export type ComponentPropertyList = ComponentProperty[];
export const ComponentPropertyList = S.Array(
  S.suspend(
    (): S.Schema<ComponentProperty, any> => ComponentProperty,
  ).annotations({ identifier: "ComponentProperty" }),
) as any as S.Schema<ComponentPropertyList>;
export type FeaturesMap = { [key: string]: string | undefined };
export const FeaturesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CodegenJobSummary {
  appId: string;
  environmentName: string;
  id: string;
  createdAt?: Date;
  modifiedAt?: Date;
}
export const CodegenJobSummary = S.suspend(() =>
  S.Struct({
    appId: S.String,
    environmentName: S.String,
    id: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CodegenJobSummary",
}) as any as S.Schema<CodegenJobSummary>;
export type CodegenJobSummaryList = CodegenJobSummary[];
export const CodegenJobSummaryList = S.Array(CodegenJobSummary);
export interface ComponentSummary {
  appId: string;
  environmentName: string;
  id: string;
  name: string;
  componentType: string;
}
export const ComponentSummary = S.suspend(() =>
  S.Struct({
    appId: S.String,
    environmentName: S.String,
    id: S.String,
    name: S.String,
    componentType: S.String,
  }),
).annotations({
  identifier: "ComponentSummary",
}) as any as S.Schema<ComponentSummary>;
export type ComponentSummaryList = ComponentSummary[];
export const ComponentSummaryList = S.Array(ComponentSummary);
export interface FormSummary {
  appId: string;
  dataType: FormDataTypeConfig;
  environmentName: string;
  formActionType: FormActionType;
  id: string;
  name: string;
}
export const FormSummary = S.suspend(() =>
  S.Struct({
    appId: S.String,
    dataType: FormDataTypeConfig,
    environmentName: S.String,
    formActionType: FormActionType,
    id: S.String,
    name: S.String,
  }),
).annotations({ identifier: "FormSummary" }) as any as S.Schema<FormSummary>;
export type FormSummaryList = FormSummary[];
export const FormSummaryList = S.Array(FormSummary);
export interface ThemeSummary {
  appId: string;
  environmentName: string;
  id: string;
  name: string;
}
export const ThemeSummary = S.suspend(() =>
  S.Struct({
    appId: S.String,
    environmentName: S.String,
    id: S.String,
    name: S.String,
  }),
).annotations({ identifier: "ThemeSummary" }) as any as S.Schema<ThemeSummary>;
export type ThemeSummaryList = ThemeSummary[];
export const ThemeSummaryList = S.Array(ThemeSummary);
export interface ThemeValue {
  value?: string;
  children?: ThemeValues[];
}
export const ThemeValue = S.suspend(() =>
  S.Struct({
    value: S.optional(S.String),
    children: S.optional(
      S.suspend(() => ThemeValuesList).annotations({
        identifier: "ThemeValuesList",
      }),
    ),
  }),
).annotations({ identifier: "ThemeValue" }) as any as S.Schema<ThemeValue>;
export interface ExchangeCodeForTokenResponse {
  accessToken: string | redacted.Redacted<string>;
  expiresIn: number;
  refreshToken: string | redacted.Redacted<string>;
}
export const ExchangeCodeForTokenResponse = S.suspend(() =>
  S.Struct({
    accessToken: SensitiveString,
    expiresIn: S.Number,
    refreshToken: SensitiveString,
  }),
).annotations({
  identifier: "ExchangeCodeForTokenResponse",
}) as any as S.Schema<ExchangeCodeForTokenResponse>;
export interface GetMetadataResponse {
  features: { [key: string]: string | undefined };
}
export const GetMetadataResponse = S.suspend(() =>
  S.Struct({ features: FeaturesMap }),
).annotations({
  identifier: "GetMetadataResponse",
}) as any as S.Schema<GetMetadataResponse>;
export interface RefreshTokenResponse {
  accessToken: string | redacted.Redacted<string>;
  expiresIn: number;
}
export const RefreshTokenResponse = S.suspend(() =>
  S.Struct({ accessToken: SensitiveString, expiresIn: S.Number }),
).annotations({
  identifier: "RefreshTokenResponse",
}) as any as S.Schema<RefreshTokenResponse>;
export interface DataStoreRenderConfig {}
export const DataStoreRenderConfig = S.suspend(() => S.Struct({})).annotations({
  identifier: "DataStoreRenderConfig",
}) as any as S.Schema<DataStoreRenderConfig>;
export interface NoApiRenderConfig {}
export const NoApiRenderConfig = S.suspend(() => S.Struct({})).annotations({
  identifier: "NoApiRenderConfig",
}) as any as S.Schema<NoApiRenderConfig>;
export type CodegenPrimaryKeysList = string[];
export const CodegenPrimaryKeysList = S.Array(S.String);
export type CodegenGenericDataEnumValuesList = string[];
export const CodegenGenericDataEnumValuesList = S.Array(S.String);
export interface ListCodegenJobsResponse {
  entities: CodegenJobSummary[];
  nextToken?: string;
}
export const ListCodegenJobsResponse = S.suspend(() =>
  S.Struct({
    entities: CodegenJobSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCodegenJobsResponse",
}) as any as S.Schema<ListCodegenJobsResponse>;
export interface GetComponentResponse {
  component?: Component;
}
export const GetComponentResponse = S.suspend(() =>
  S.Struct({
    component: S.optional(Component)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Component" }),
  }),
).annotations({
  identifier: "GetComponentResponse",
}) as any as S.Schema<GetComponentResponse>;
export interface UpdateComponentResponse {
  entity?: Component;
}
export const UpdateComponentResponse = S.suspend(() =>
  S.Struct({
    entity: S.optional(Component)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Component" }),
  }),
).annotations({
  identifier: "UpdateComponentResponse",
}) as any as S.Schema<UpdateComponentResponse>;
export interface ListComponentsResponse {
  entities: ComponentSummary[];
  nextToken?: string;
}
export const ListComponentsResponse = S.suspend(() =>
  S.Struct({ entities: ComponentSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListComponentsResponse",
}) as any as S.Schema<ListComponentsResponse>;
export interface GetFormResponse {
  form?: Form;
}
export const GetFormResponse = S.suspend(() =>
  S.Struct({
    form: S.optional(Form)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Form" }),
  }),
).annotations({
  identifier: "GetFormResponse",
}) as any as S.Schema<GetFormResponse>;
export interface UpdateFormResponse {
  entity?: Form;
}
export const UpdateFormResponse = S.suspend(() =>
  S.Struct({
    entity: S.optional(Form)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Form" }),
  }),
).annotations({
  identifier: "UpdateFormResponse",
}) as any as S.Schema<UpdateFormResponse>;
export interface ListFormsResponse {
  entities: FormSummary[];
  nextToken?: string;
}
export const ListFormsResponse = S.suspend(() =>
  S.Struct({ entities: FormSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFormsResponse",
}) as any as S.Schema<ListFormsResponse>;
export interface GetThemeResponse {
  theme?: Theme;
}
export const GetThemeResponse = S.suspend(() =>
  S.Struct({
    theme: S.optional(Theme)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Theme" }),
  }),
).annotations({
  identifier: "GetThemeResponse",
}) as any as S.Schema<GetThemeResponse>;
export interface UpdateThemeResponse {
  entity?: Theme;
}
export const UpdateThemeResponse = S.suspend(() =>
  S.Struct({
    entity: S.optional(Theme)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Theme" }),
  }),
).annotations({
  identifier: "UpdateThemeResponse",
}) as any as S.Schema<UpdateThemeResponse>;
export interface ListThemesResponse {
  entities: ThemeSummary[];
  nextToken?: string;
}
export const ListThemesResponse = S.suspend(() =>
  S.Struct({ entities: ThemeSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListThemesResponse",
}) as any as S.Schema<ListThemesResponse>;
export interface CodegenJobAsset {
  downloadUrl?: string;
}
export const CodegenJobAsset = S.suspend(() =>
  S.Struct({ downloadUrl: S.optional(S.String) }),
).annotations({
  identifier: "CodegenJobAsset",
}) as any as S.Schema<CodegenJobAsset>;
export interface CodegenDependency {
  name?: string;
  supportedVersion?: string;
  isSemVer?: boolean;
  reason?: string;
}
export const CodegenDependency = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    supportedVersion: S.optional(S.String),
    isSemVer: S.optional(S.Boolean),
    reason: S.optional(S.String),
  }),
).annotations({
  identifier: "CodegenDependency",
}) as any as S.Schema<CodegenDependency>;
export type CodegenDependencies = CodegenDependency[];
export const CodegenDependencies = S.Array(CodegenDependency);
export interface ThemeValues {
  key?: string;
  value?: ThemeValue;
}
export const ThemeValues = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String),
    value: S.optional(
      S.suspend((): S.Schema<ThemeValue, any> => ThemeValue).annotations({
        identifier: "ThemeValue",
      }),
    ),
  }),
).annotations({ identifier: "ThemeValues" }) as any as S.Schema<ThemeValues>;
export type ReactCodegenDependencies = { [key: string]: string | undefined };
export const ReactCodegenDependencies = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CodegenGenericDataEnum {
  values: string[];
}
export const CodegenGenericDataEnum = S.suspend(() =>
  S.Struct({ values: CodegenGenericDataEnumValuesList }),
).annotations({
  identifier: "CodegenGenericDataEnum",
}) as any as S.Schema<CodegenGenericDataEnum>;
export interface ComponentConditionProperty {
  property?: string;
  field?: string;
  operator?: string;
  operand?: string;
  then?: ComponentProperty;
  else?: ComponentProperty;
  operandType?: string;
}
export const ComponentConditionProperty = S.suspend(() =>
  S.Struct({
    property: S.optional(S.String),
    field: S.optional(S.String),
    operator: S.optional(S.String),
    operand: S.optional(S.String),
    then: S.optional(
      S.suspend(
        (): S.Schema<ComponentProperty, any> => ComponentProperty,
      ).annotations({ identifier: "ComponentProperty" }),
    ),
    else: S.optional(
      S.suspend(
        (): S.Schema<ComponentProperty, any> => ComponentProperty,
      ).annotations({ identifier: "ComponentProperty" }),
    ),
    operandType: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentConditionProperty",
}) as any as S.Schema<ComponentConditionProperty>;
export interface GraphQLRenderConfig {
  typesFilePath: string;
  queriesFilePath: string;
  mutationsFilePath: string;
  subscriptionsFilePath: string;
  fragmentsFilePath: string;
}
export const GraphQLRenderConfig = S.suspend(() =>
  S.Struct({
    typesFilePath: S.String,
    queriesFilePath: S.String,
    mutationsFilePath: S.String,
    subscriptionsFilePath: S.String,
    fragmentsFilePath: S.String,
  }),
).annotations({
  identifier: "GraphQLRenderConfig",
}) as any as S.Schema<GraphQLRenderConfig>;
export type ApiConfiguration =
  | {
      graphQLConfig: GraphQLRenderConfig;
      dataStoreConfig?: never;
      noApiConfig?: never;
    }
  | {
      graphQLConfig?: never;
      dataStoreConfig: DataStoreRenderConfig;
      noApiConfig?: never;
    }
  | {
      graphQLConfig?: never;
      dataStoreConfig?: never;
      noApiConfig: NoApiRenderConfig;
    };
export const ApiConfiguration = S.Union(
  S.Struct({ graphQLConfig: GraphQLRenderConfig }),
  S.Struct({ dataStoreConfig: DataStoreRenderConfig }),
  S.Struct({ noApiConfig: NoApiRenderConfig }),
);
export interface ReactStartCodegenJobData {
  module?: JSModule;
  target?: JSTarget;
  script?: JSScript;
  renderTypeDeclarations?: boolean;
  inlineSourceMap?: boolean;
  apiConfiguration?: ApiConfiguration;
  dependencies?: { [key: string]: string | undefined };
}
export const ReactStartCodegenJobData = S.suspend(() =>
  S.Struct({
    module: S.optional(JSModule),
    target: S.optional(JSTarget),
    script: S.optional(JSScript),
    renderTypeDeclarations: S.optional(S.Boolean),
    inlineSourceMap: S.optional(S.Boolean),
    apiConfiguration: S.optional(ApiConfiguration),
    dependencies: S.optional(ReactCodegenDependencies),
  }),
).annotations({
  identifier: "ReactStartCodegenJobData",
}) as any as S.Schema<ReactStartCodegenJobData>;
export type CodegenJobRenderConfig = { react: ReactStartCodegenJobData };
export const CodegenJobRenderConfig = S.Union(
  S.Struct({ react: ReactStartCodegenJobData }),
);
export type CodegenGenericDataFieldDataType =
  | "ID"
  | "String"
  | "Int"
  | "Float"
  | "AWSDate"
  | "AWSTime"
  | "AWSDateTime"
  | "AWSTimestamp"
  | "AWSEmail"
  | "AWSURL"
  | "AWSIPAddress"
  | "Boolean"
  | "AWSJSON"
  | "AWSPhone"
  | "Enum"
  | "Model"
  | "NonModel"
  | (string & {});
export const CodegenGenericDataFieldDataType = S.String;
export type GenericDataRelationshipType =
  | "HAS_MANY"
  | "HAS_ONE"
  | "BELONGS_TO"
  | (string & {});
export const GenericDataRelationshipType = S.String;
export type RelatedModelFieldsList = string[];
export const RelatedModelFieldsList = S.Array(S.String);
export type AssociatedFieldsList = string[];
export const AssociatedFieldsList = S.Array(S.String);
export interface CodegenGenericDataRelationshipType {
  type: GenericDataRelationshipType;
  relatedModelName: string;
  relatedModelFields?: string[];
  canUnlinkAssociatedModel?: boolean;
  relatedJoinFieldName?: string;
  relatedJoinTableName?: string;
  belongsToFieldOnRelatedModel?: string;
  associatedFields?: string[];
  isHasManyIndex?: boolean;
}
export const CodegenGenericDataRelationshipType = S.suspend(() =>
  S.Struct({
    type: GenericDataRelationshipType,
    relatedModelName: S.String,
    relatedModelFields: S.optional(RelatedModelFieldsList),
    canUnlinkAssociatedModel: S.optional(S.Boolean),
    relatedJoinFieldName: S.optional(S.String),
    relatedJoinTableName: S.optional(S.String),
    belongsToFieldOnRelatedModel: S.optional(S.String),
    associatedFields: S.optional(AssociatedFieldsList),
    isHasManyIndex: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CodegenGenericDataRelationshipType",
}) as any as S.Schema<CodegenGenericDataRelationshipType>;
export interface CodegenGenericDataField {
  dataType: CodegenGenericDataFieldDataType;
  dataTypeValue: string;
  required: boolean;
  readOnly: boolean;
  isArray: boolean;
  relationship?: CodegenGenericDataRelationshipType;
}
export const CodegenGenericDataField = S.suspend(() =>
  S.Struct({
    dataType: CodegenGenericDataFieldDataType,
    dataTypeValue: S.String,
    required: S.Boolean,
    readOnly: S.Boolean,
    isArray: S.Boolean,
    relationship: S.optional(CodegenGenericDataRelationshipType),
  }),
).annotations({
  identifier: "CodegenGenericDataField",
}) as any as S.Schema<CodegenGenericDataField>;
export type CodegenGenericDataFields = {
  [key: string]: CodegenGenericDataField | undefined;
};
export const CodegenGenericDataFields = S.Record({
  key: S.String,
  value: S.UndefinedOr(CodegenGenericDataField),
});
export interface CodegenGenericDataModel {
  fields: { [key: string]: CodegenGenericDataField | undefined };
  isJoinTable?: boolean;
  primaryKeys: string[];
}
export const CodegenGenericDataModel = S.suspend(() =>
  S.Struct({
    fields: CodegenGenericDataFields,
    isJoinTable: S.optional(S.Boolean),
    primaryKeys: CodegenPrimaryKeysList,
  }),
).annotations({
  identifier: "CodegenGenericDataModel",
}) as any as S.Schema<CodegenGenericDataModel>;
export type CodegenGenericDataModels = {
  [key: string]: CodegenGenericDataModel | undefined;
};
export const CodegenGenericDataModels = S.Record({
  key: S.String,
  value: S.UndefinedOr(CodegenGenericDataModel),
});
export type CodegenGenericDataEnums = {
  [key: string]: CodegenGenericDataEnum | undefined;
};
export const CodegenGenericDataEnums = S.Record({
  key: S.String,
  value: S.UndefinedOr(CodegenGenericDataEnum),
});
export type CodegenGenericDataNonModelFields = {
  [key: string]: CodegenGenericDataField | undefined;
};
export const CodegenGenericDataNonModelFields = S.Record({
  key: S.String,
  value: S.UndefinedOr(CodegenGenericDataField),
});
export interface CodegenGenericDataNonModel {
  fields: { [key: string]: CodegenGenericDataField | undefined };
}
export const CodegenGenericDataNonModel = S.suspend(() =>
  S.Struct({ fields: CodegenGenericDataNonModelFields }),
).annotations({
  identifier: "CodegenGenericDataNonModel",
}) as any as S.Schema<CodegenGenericDataNonModel>;
export type CodegenGenericDataNonModels = {
  [key: string]: CodegenGenericDataNonModel | undefined;
};
export const CodegenGenericDataNonModels = S.Record({
  key: S.String,
  value: S.UndefinedOr(CodegenGenericDataNonModel),
});
export interface CodegenJobGenericDataSchema {
  dataSourceType: CodegenJobGenericDataSourceType;
  models: { [key: string]: CodegenGenericDataModel | undefined };
  enums: { [key: string]: CodegenGenericDataEnum | undefined };
  nonModels: { [key: string]: CodegenGenericDataNonModel | undefined };
}
export const CodegenJobGenericDataSchema = S.suspend(() =>
  S.Struct({
    dataSourceType: CodegenJobGenericDataSourceType,
    models: CodegenGenericDataModels,
    enums: CodegenGenericDataEnums,
    nonModels: CodegenGenericDataNonModels,
  }),
).annotations({
  identifier: "CodegenJobGenericDataSchema",
}) as any as S.Schema<CodegenJobGenericDataSchema>;
export interface CodegenJob {
  id: string;
  appId: string;
  environmentName: string;
  renderConfig?: CodegenJobRenderConfig;
  genericDataSchema?: CodegenJobGenericDataSchema;
  autoGenerateForms?: boolean;
  features?: CodegenFeatureFlags;
  status?: CodegenJobStatus;
  statusMessage?: string;
  asset?: CodegenJobAsset;
  tags?: { [key: string]: string | undefined };
  createdAt?: Date;
  modifiedAt?: Date;
  dependencies?: CodegenDependency[];
}
export const CodegenJob = S.suspend(() =>
  S.Struct({
    id: S.String,
    appId: S.String,
    environmentName: S.String,
    renderConfig: S.optional(CodegenJobRenderConfig),
    genericDataSchema: S.optional(CodegenJobGenericDataSchema),
    autoGenerateForms: S.optional(S.Boolean),
    features: S.optional(CodegenFeatureFlags),
    status: S.optional(CodegenJobStatus),
    statusMessage: S.optional(S.String),
    asset: S.optional(CodegenJobAsset),
    tags: S.optional(Tags),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    dependencies: S.optional(CodegenDependencies),
  }),
).annotations({ identifier: "CodegenJob" }) as any as S.Schema<CodegenJob>;
export interface CreateThemeData {
  name: string;
  values: ThemeValues[];
  overrides?: ThemeValues[];
  tags?: { [key: string]: string | undefined };
}
export const CreateThemeData = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: ThemeValuesList,
    overrides: S.optional(ThemeValuesList),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "CreateThemeData",
}) as any as S.Schema<CreateThemeData>;
export interface GetCodegenJobResponse {
  job?: CodegenJob;
}
export const GetCodegenJobResponse = S.suspend(() =>
  S.Struct({
    job: S.optional(CodegenJob)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CodegenJob" }),
  }),
).annotations({
  identifier: "GetCodegenJobResponse",
}) as any as S.Schema<GetCodegenJobResponse>;
export interface CreateThemeRequest {
  appId: string;
  environmentName: string;
  clientToken?: string;
  themeToCreate: CreateThemeData;
}
export const CreateThemeRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
    themeToCreate: CreateThemeData.pipe(T.HttpPayload()).annotations({
      identifier: "CreateThemeData",
    }),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateThemeRequest",
}) as any as S.Schema<CreateThemeRequest>;
export type FormInputValuePropertyList = FormInputValueProperty[];
export const FormInputValuePropertyList = S.Array(
  S.suspend(
    (): S.Schema<FormInputValueProperty, any> => FormInputValueProperty,
  ).annotations({ identifier: "FormInputValueProperty" }),
) as any as S.Schema<FormInputValuePropertyList>;
export interface CreateThemeResponse {
  entity?: Theme;
}
export const CreateThemeResponse = S.suspend(() =>
  S.Struct({
    entity: S.optional(Theme)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Theme" }),
  }),
).annotations({
  identifier: "CreateThemeResponse",
}) as any as S.Schema<CreateThemeResponse>;
export interface CreateComponentData {
  name: string;
  sourceId?: string;
  componentType: string;
  properties: { [key: string]: ComponentProperty | undefined };
  children?: ComponentChild[];
  variants: ComponentVariant[];
  overrides: {
    [key: string]: { [key: string]: string | undefined } | undefined;
  };
  bindingProperties: {
    [key: string]: ComponentBindingPropertiesValue | undefined;
  };
  collectionProperties?: {
    [key: string]: ComponentDataConfiguration | undefined;
  };
  tags?: { [key: string]: string | undefined };
  events?: { [key: string]: ComponentEvent | undefined };
  schemaVersion?: string;
}
export const CreateComponentData = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "CreateComponentData",
}) as any as S.Schema<CreateComponentData>;
export interface CreateComponentRequest {
  appId: string;
  environmentName: string;
  clientToken?: string;
  componentToCreate: CreateComponentData;
}
export const CreateComponentRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
    componentToCreate: CreateComponentData.pipe(T.HttpPayload()).annotations({
      identifier: "CreateComponentData",
    }),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateComponentRequest",
}) as any as S.Schema<CreateComponentRequest>;
export interface CreateComponentResponse {
  entity?: Component;
}
export const CreateComponentResponse = S.suspend(() =>
  S.Struct({
    entity: S.optional(Component)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Component" }),
  }),
).annotations({
  identifier: "CreateComponentResponse",
}) as any as S.Schema<CreateComponentResponse>;
export interface StartCodegenJobData {
  renderConfig: CodegenJobRenderConfig;
  genericDataSchema?: CodegenJobGenericDataSchema;
  autoGenerateForms?: boolean;
  features?: CodegenFeatureFlags;
  tags?: { [key: string]: string | undefined };
}
export const StartCodegenJobData = S.suspend(() =>
  S.Struct({
    renderConfig: CodegenJobRenderConfig,
    genericDataSchema: S.optional(CodegenJobGenericDataSchema),
    autoGenerateForms: S.optional(S.Boolean),
    features: S.optional(CodegenFeatureFlags),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "StartCodegenJobData",
}) as any as S.Schema<StartCodegenJobData>;
export interface StartCodegenJobRequest {
  appId: string;
  environmentName: string;
  clientToken?: string;
  codegenJobToCreate: StartCodegenJobData;
}
export const StartCodegenJobRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
    codegenJobToCreate: StartCodegenJobData.pipe(T.HttpPayload()).annotations({
      identifier: "StartCodegenJobData",
    }),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartCodegenJobRequest",
}) as any as S.Schema<StartCodegenJobRequest>;
export interface CreateFormData {
  name: string;
  dataType: FormDataTypeConfig;
  formActionType: FormActionType;
  fields: { [key: string]: FieldConfig | undefined };
  style: FormStyle;
  sectionalElements: { [key: string]: SectionalElement | undefined };
  schemaVersion: string;
  cta?: FormCTA;
  tags?: { [key: string]: string | undefined };
  labelDecorator?: string;
}
export const CreateFormData = S.suspend(() =>
  S.Struct({
    name: S.String,
    dataType: FormDataTypeConfig,
    formActionType: FormActionType,
    fields: FieldsMap,
    style: FormStyle,
    sectionalElements: SectionalElementMap,
    schemaVersion: S.String,
    cta: S.optional(FormCTA),
    tags: S.optional(Tags),
    labelDecorator: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateFormData",
}) as any as S.Schema<CreateFormData>;
export interface StartCodegenJobResponse {
  entity?: CodegenJob;
}
export const StartCodegenJobResponse = S.suspend(() =>
  S.Struct({
    entity: S.optional(CodegenJob)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CodegenJob" }),
  }),
).annotations({
  identifier: "StartCodegenJobResponse",
}) as any as S.Schema<StartCodegenJobResponse>;
export interface CreateFormRequest {
  appId: string;
  environmentName: string;
  clientToken?: string;
  formToCreate: CreateFormData;
}
export const CreateFormRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
    formToCreate: CreateFormData.pipe(T.HttpPayload()).annotations({
      identifier: "CreateFormData",
    }),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateFormRequest",
}) as any as S.Schema<CreateFormRequest>;
export interface CreateFormResponse {
  entity?: Form;
}
export const CreateFormResponse = S.suspend(() =>
  S.Struct({
    entity: S.optional(Form)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Form" }),
  }),
).annotations({
  identifier: "CreateFormResponse",
}) as any as S.Schema<CreateFormResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * This is for internal use.
 *
 * Amplify uses this action to refresh a previously issued access token that might have expired.
 */
export const refreshToken: (
  input: RefreshTokenRequest,
) => effect.Effect<
  RefreshTokenResponse,
  InvalidParameterException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RefreshTokenRequest,
  output: RefreshTokenResponse,
  errors: [InvalidParameterException],
}));
/**
 * Retrieves a list of components for a specified Amplify app and backend
 * environment.
 */
export const listComponents: {
  (
    input: ListComponentsRequest,
  ): effect.Effect<
    ListComponentsResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComponentsRequest,
  ) => stream.Stream<
    ListComponentsResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComponentsRequest,
  ) => stream.Stream<
    ComponentSummary,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComponentsRequest,
  output: ListComponentsResponse,
  errors: [InternalServerException, InvalidParameterException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "entities",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of forms for a specified Amplify app and backend environment.
 */
export const listForms: {
  (
    input: ListFormsRequest,
  ): effect.Effect<
    ListFormsResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFormsRequest,
  ) => stream.Stream<
    ListFormsResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFormsRequest,
  ) => stream.Stream<
    FormSummary,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listThemes: {
  (
    input: ListThemesRequest,
  ): effect.Effect<
    ListThemesResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThemesRequest,
  ) => stream.Stream<
    ListThemesResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThemesRequest,
  ) => stream.Stream<
    ThemeSummary,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const exportComponents: {
  (
    input: ExportComponentsRequest,
  ): effect.Effect<
    ExportComponentsResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ExportComponentsRequest,
  ) => stream.Stream<
    ExportComponentsResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ExportComponentsRequest,
  ) => stream.Stream<
    Component,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ExportComponentsRequest,
  output: ExportComponentsResponse,
  errors: [InternalServerException, InvalidParameterException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "entities",
  } as const,
}));
/**
 * Exports form configurations to code that is ready to integrate into an Amplify app.
 */
export const exportForms: {
  (
    input: ExportFormsRequest,
  ): effect.Effect<
    ExportFormsResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ExportFormsRequest,
  ) => stream.Stream<
    ExportFormsResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ExportFormsRequest,
  ) => stream.Stream<
    Form,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ExportFormsRequest,
  output: ExportFormsResponse,
  errors: [InternalServerException, InvalidParameterException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "entities",
  } as const,
}));
/**
 * Exports theme configurations to code that is ready to integrate into an Amplify app.
 */
export const exportThemes: {
  (
    input: ExportThemesRequest,
  ): effect.Effect<
    ExportThemesResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ExportThemesRequest,
  ) => stream.Stream<
    ExportThemesResponse,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ExportThemesRequest,
  ) => stream.Stream<
    Theme,
    InternalServerException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ExportThemesRequest,
  output: ExportThemesResponse,
  errors: [InternalServerException, InvalidParameterException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "entities",
  } as const,
}));
/**
 * This is for internal use.
 *
 * Amplify uses this action to exchange an access code for a token.
 */
export const exchangeCodeForToken: (
  input: ExchangeCodeForTokenRequest,
) => effect.Effect<
  ExchangeCodeForTokenResponse,
  InvalidParameterException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExchangeCodeForTokenRequest,
  output: ExchangeCodeForTokenResponse,
  errors: [InvalidParameterException],
}));
/**
 * Stores the metadata information about a feature on a form.
 */
export const putMetadataFlag: (
  input: PutMetadataFlagRequest,
) => effect.Effect<
  PutMetadataFlagResponse,
  InvalidParameterException | UnauthorizedException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMetadataFlagRequest,
  output: PutMetadataFlagResponse,
  errors: [InvalidParameterException, UnauthorizedException],
}));
/**
 * Retrieves a list of code generation jobs for a specified Amplify app and backend environment.
 */
export const listCodegenJobs: {
  (
    input: ListCodegenJobsRequest,
  ): effect.Effect<
    ListCodegenJobsResponse,
    | InternalServerException
    | InvalidParameterException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCodegenJobsRequest,
  ) => stream.Stream<
    ListCodegenJobsResponse,
    | InternalServerException
    | InvalidParameterException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCodegenJobsRequest,
  ) => stream.Stream<
    CodegenJobSummary,
    | InternalServerException
    | InvalidParameterException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns an existing component for an Amplify app.
 */
export const getComponent: (
  input: GetComponentRequest,
) => effect.Effect<
  GetComponentResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateComponent: (
  input: UpdateComponentRequest,
) => effect.Effect<
  UpdateComponentResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMetadata: (
  input: GetMetadataRequest,
) => effect.Effect<
  GetMetadataResponse,
  InvalidParameterException | UnauthorizedException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetadataRequest,
  output: GetMetadataResponse,
  errors: [InvalidParameterException, UnauthorizedException],
}));
/**
 * Returns an existing form for an Amplify app.
 */
export const getForm: (
  input: GetFormRequest,
) => effect.Effect<
  GetFormResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTheme: (
  input: GetThemeRequest,
) => effect.Effect<
  GetThemeResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteComponent: (
  input: DeleteComponentRequest,
) => effect.Effect<
  DeleteComponentResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteForm: (
  input: DeleteFormRequest,
) => effect.Effect<
  DeleteFormResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTheme: (
  input: DeleteThemeRequest,
) => effect.Effect<
  DeleteThemeResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCodegenJob: (
  input: GetCodegenJobRequest,
) => effect.Effect<
  GetCodegenJobResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateForm: (
  input: UpdateFormRequest,
) => effect.Effect<
  UpdateFormResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTheme: (
  input: UpdateThemeRequest,
) => effect.Effect<
  UpdateThemeResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTheme: (
  input: CreateThemeRequest,
) => effect.Effect<
  CreateThemeResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceConflictException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createComponent: (
  input: CreateComponentRequest,
) => effect.Effect<
  CreateComponentResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceConflictException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startCodegenJob: (
  input: StartCodegenJobRequest,
) => effect.Effect<
  StartCodegenJobResponse,
  | InternalServerException
  | InvalidParameterException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createForm: (
  input: CreateFormRequest,
) => effect.Effect<
  CreateFormResponse,
  | InternalServerException
  | InvalidParameterException
  | ResourceConflictException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFormRequest,
  output: CreateFormResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceConflictException,
    ServiceQuotaExceededException,
  ],
}));

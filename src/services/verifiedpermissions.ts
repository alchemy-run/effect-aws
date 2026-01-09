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
  sdkId: "VerifiedPermissions",
  serviceShapeName: "VerifiedPermissions",
});
const auth = T.AwsAuthSigv4({ name: "verifiedpermissions" });
const ver = T.ServiceVersion("2021-12-01");
const proto = T.AwsProtocolsAwsJson1_0();
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
              `https://verifiedpermissions-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://verifiedpermissions-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://verifiedpermissions.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://verifiedpermissions.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AmazonResourceName = string;
export type TagKey = string;
export type IdempotencyToken = string;
export type PolicyStoreDescription = string | redacted.Redacted<string>;
export type PolicyStoreId = string;
export type NextToken = string;
export type MaxResults = number;
export type Token = string | redacted.Redacted<string>;
export type PrincipalEntityType = string | redacted.Redacted<string>;
export type IdentitySourceId = string;
export type ListIdentitySourcesMaxResults = number;
export type PolicyId = string;
export type PolicyTemplateDescription = string | redacted.Redacted<string>;
export type PolicyStatement = string | redacted.Redacted<string>;
export type PolicyTemplateId = string;
export type TagValue = string;
export type CedarJson = string | redacted.Redacted<string>;
export type EntityType = string | redacted.Redacted<string>;
export type EntityId = string | redacted.Redacted<string>;
export type ActionType = string | redacted.Redacted<string>;
export type ActionId = string | redacted.Redacted<string>;
export type SchemaJson = string | redacted.Redacted<string>;
export type ResourceArn = string;
export type TimestampFormat = Date;
export type Namespace = string | redacted.Redacted<string>;
export type UserPoolArn = string;
export type ClientId = string | redacted.Redacted<string>;
export type Issuer = string;
export type EntityIdPrefix = string | redacted.Redacted<string>;
export type StaticPolicyDescription = string | redacted.Redacted<string>;
export type DiscoveryUrl = string;
export type BooleanAttribute = boolean;
export type LongAttribute = number;
export type StringAttribute = string | redacted.Redacted<string>;
export type IpAddr = string | redacted.Redacted<string>;
export type Decimal = string | redacted.Redacted<string>;
export type DatetimeAttribute = string | redacted.Redacted<string>;
export type Duration = string | redacted.Redacted<string>;
export type GroupEntityType = string | redacted.Redacted<string>;
export type Claim = string | redacted.Redacted<string>;
export type Audience = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type DeletionProtection = "ENABLED" | "DISABLED" | (string & {});
export const DeletionProtection = S.String;
export interface ListTagsForResourceInput {
  resourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface GetPolicyStoreInput {
  policyStoreId: string;
  tags?: boolean;
}
export const GetPolicyStoreInput = S.suspend(() =>
  S.Struct({ policyStoreId: S.String, tags: S.optional(S.Boolean) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPolicyStoreInput",
}) as any as S.Schema<GetPolicyStoreInput>;
export type ValidationMode = "OFF" | "STRICT" | (string & {});
export const ValidationMode = S.String;
export interface ValidationSettings {
  mode: ValidationMode;
}
export const ValidationSettings = S.suspend(() =>
  S.Struct({ mode: ValidationMode }),
).annotations({
  identifier: "ValidationSettings",
}) as any as S.Schema<ValidationSettings>;
export interface UpdatePolicyStoreInput {
  policyStoreId: string;
  validationSettings: ValidationSettings;
  deletionProtection?: DeletionProtection;
  description?: string | redacted.Redacted<string>;
}
export const UpdatePolicyStoreInput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    validationSettings: ValidationSettings,
    deletionProtection: S.optional(DeletionProtection),
    description: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePolicyStoreInput",
}) as any as S.Schema<UpdatePolicyStoreInput>;
export interface DeletePolicyStoreInput {
  policyStoreId: string;
}
export const DeletePolicyStoreInput = S.suspend(() =>
  S.Struct({ policyStoreId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePolicyStoreInput",
}) as any as S.Schema<DeletePolicyStoreInput>;
export interface DeletePolicyStoreOutput {}
export const DeletePolicyStoreOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePolicyStoreOutput",
}) as any as S.Schema<DeletePolicyStoreOutput>;
export interface ListPolicyStoresInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListPolicyStoresInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPolicyStoresInput",
}) as any as S.Schema<ListPolicyStoresInput>;
export interface GetSchemaInput {
  policyStoreId: string;
}
export const GetSchemaInput = S.suspend(() =>
  S.Struct({ policyStoreId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSchemaInput",
}) as any as S.Schema<GetSchemaInput>;
export interface ActionIdentifier {
  actionType: string | redacted.Redacted<string>;
  actionId: string | redacted.Redacted<string>;
}
export const ActionIdentifier = S.suspend(() =>
  S.Struct({ actionType: SensitiveString, actionId: SensitiveString }),
).annotations({
  identifier: "ActionIdentifier",
}) as any as S.Schema<ActionIdentifier>;
export interface EntityIdentifier {
  entityType: string | redacted.Redacted<string>;
  entityId: string | redacted.Redacted<string>;
}
export const EntityIdentifier = S.suspend(() =>
  S.Struct({ entityType: SensitiveString, entityId: SensitiveString }),
).annotations({
  identifier: "EntityIdentifier",
}) as any as S.Schema<EntityIdentifier>;
export type AttributeValue =
  | {
      boolean: boolean;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier: EntityIdentifier;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long: number;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string: string | redacted.Redacted<string>;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set: AttributeValue[];
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record: { [key: string]: AttributeValue | undefined };
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr: string | redacted.Redacted<string>;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal: string | redacted.Redacted<string>;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime: string | redacted.Redacted<string>;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration: string | redacted.Redacted<string>;
    };
export const AttributeValue = S.Union(
  S.Struct({ boolean: S.Boolean }),
  S.Struct({ entityIdentifier: EntityIdentifier }),
  S.Struct({ long: S.Number }),
  S.Struct({ string: SensitiveString }),
  S.Struct({
    set: S.suspend(() => SetAttribute).annotations({
      identifier: "SetAttribute",
    }),
  }),
  S.Struct({
    record: S.suspend(() => RecordAttribute).annotations({
      identifier: "RecordAttribute",
    }),
  }),
  S.Struct({ ipaddr: SensitiveString }),
  S.Struct({ decimal: SensitiveString }),
  S.Struct({ datetime: SensitiveString }),
  S.Struct({ duration: SensitiveString }),
) as any as S.Schema<AttributeValue>;
export type ContextMap = { [key: string]: AttributeValue | undefined };
export const ContextMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(
    S.suspend(() => AttributeValue).annotations({
      identifier: "AttributeValue",
    }),
  ),
});
export type ContextDefinition =
  | {
      contextMap: { [key: string]: AttributeValue | undefined };
      cedarJson?: never;
    }
  | { contextMap?: never; cedarJson: string | redacted.Redacted<string> };
export const ContextDefinition = S.Union(
  S.Struct({ contextMap: ContextMap }),
  S.Struct({ cedarJson: SensitiveString }),
);
export type EntityAttributes = { [key: string]: AttributeValue | undefined };
export const EntityAttributes = S.Record({
  key: S.String,
  value: S.UndefinedOr(
    S.suspend(() => AttributeValue).annotations({
      identifier: "AttributeValue",
    }),
  ),
});
export type ParentList = EntityIdentifier[];
export const ParentList = S.Array(EntityIdentifier);
export type CedarTagValue =
  | {
      boolean: boolean;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier: EntityIdentifier;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long: number;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string: string | redacted.Redacted<string>;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set: CedarTagValue[];
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record: { [key: string]: CedarTagValue | undefined };
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr: string | redacted.Redacted<string>;
      decimal?: never;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal: string | redacted.Redacted<string>;
      datetime?: never;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime: string | redacted.Redacted<string>;
      duration?: never;
    }
  | {
      boolean?: never;
      entityIdentifier?: never;
      long?: never;
      string?: never;
      set?: never;
      record?: never;
      ipaddr?: never;
      decimal?: never;
      datetime?: never;
      duration: string | redacted.Redacted<string>;
    };
export const CedarTagValue = S.Union(
  S.Struct({ boolean: S.Boolean }),
  S.Struct({ entityIdentifier: EntityIdentifier }),
  S.Struct({ long: S.Number }),
  S.Struct({ string: SensitiveString }),
  S.Struct({
    set: S.suspend(() => CedarTagSetAttribute).annotations({
      identifier: "CedarTagSetAttribute",
    }),
  }),
  S.Struct({
    record: S.suspend(() => CedarTagRecordAttribute).annotations({
      identifier: "CedarTagRecordAttribute",
    }),
  }),
  S.Struct({ ipaddr: SensitiveString }),
  S.Struct({ decimal: SensitiveString }),
  S.Struct({ datetime: SensitiveString }),
  S.Struct({ duration: SensitiveString }),
) as any as S.Schema<CedarTagValue>;
export type EntityCedarTags = { [key: string]: CedarTagValue | undefined };
export const EntityCedarTags = S.Record({
  key: S.String,
  value: S.UndefinedOr(
    S.suspend(() => CedarTagValue).annotations({ identifier: "CedarTagValue" }),
  ),
});
export interface EntityItem {
  identifier: EntityIdentifier;
  attributes?: { [key: string]: AttributeValue | undefined };
  parents?: EntityIdentifier[];
  tags?: { [key: string]: CedarTagValue | undefined };
}
export const EntityItem = S.suspend(() =>
  S.Struct({
    identifier: EntityIdentifier,
    attributes: S.optional(EntityAttributes),
    parents: S.optional(ParentList),
    tags: S.optional(EntityCedarTags),
  }),
).annotations({ identifier: "EntityItem" }) as any as S.Schema<EntityItem>;
export type EntityList = EntityItem[];
export const EntityList = S.Array(EntityItem);
export type EntitiesDefinition =
  | { entityList: EntityItem[]; cedarJson?: never }
  | { entityList?: never; cedarJson: string | redacted.Redacted<string> };
export const EntitiesDefinition = S.Union(
  S.Struct({ entityList: EntityList }),
  S.Struct({ cedarJson: SensitiveString }),
);
export interface IsAuthorizedWithTokenInput {
  policyStoreId: string;
  identityToken?: string | redacted.Redacted<string>;
  accessToken?: string | redacted.Redacted<string>;
  action?: ActionIdentifier;
  resource?: EntityIdentifier;
  context?: ContextDefinition;
  entities?: EntitiesDefinition;
}
export const IsAuthorizedWithTokenInput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    identityToken: S.optional(SensitiveString),
    accessToken: S.optional(SensitiveString),
    action: S.optional(ActionIdentifier),
    resource: S.optional(EntityIdentifier),
    context: S.optional(ContextDefinition),
    entities: S.optional(EntitiesDefinition),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "IsAuthorizedWithTokenInput",
}) as any as S.Schema<IsAuthorizedWithTokenInput>;
export interface GetIdentitySourceInput {
  policyStoreId: string;
  identitySourceId: string;
}
export const GetIdentitySourceInput = S.suspend(() =>
  S.Struct({ policyStoreId: S.String, identitySourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetIdentitySourceInput",
}) as any as S.Schema<GetIdentitySourceInput>;
export interface DeleteIdentitySourceInput {
  policyStoreId: string;
  identitySourceId: string;
}
export const DeleteIdentitySourceInput = S.suspend(() =>
  S.Struct({ policyStoreId: S.String, identitySourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteIdentitySourceInput",
}) as any as S.Schema<DeleteIdentitySourceInput>;
export interface DeleteIdentitySourceOutput {}
export const DeleteIdentitySourceOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIdentitySourceOutput",
}) as any as S.Schema<DeleteIdentitySourceOutput>;
export interface GetPolicyInput {
  policyStoreId: string;
  policyId: string;
}
export const GetPolicyInput = S.suspend(() =>
  S.Struct({ policyStoreId: S.String, policyId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPolicyInput",
}) as any as S.Schema<GetPolicyInput>;
export interface DeletePolicyInput {
  policyStoreId: string;
  policyId: string;
}
export const DeletePolicyInput = S.suspend(() =>
  S.Struct({ policyStoreId: S.String, policyId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePolicyInput",
}) as any as S.Schema<DeletePolicyInput>;
export interface DeletePolicyOutput {}
export const DeletePolicyOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePolicyOutput",
}) as any as S.Schema<DeletePolicyOutput>;
export interface CreatePolicyTemplateInput {
  clientToken?: string;
  policyStoreId: string;
  description?: string | redacted.Redacted<string>;
  statement: string | redacted.Redacted<string>;
}
export const CreatePolicyTemplateInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    policyStoreId: S.String,
    description: S.optional(SensitiveString),
    statement: SensitiveString,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePolicyTemplateInput",
}) as any as S.Schema<CreatePolicyTemplateInput>;
export interface GetPolicyTemplateInput {
  policyStoreId: string;
  policyTemplateId: string;
}
export const GetPolicyTemplateInput = S.suspend(() =>
  S.Struct({ policyStoreId: S.String, policyTemplateId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPolicyTemplateInput",
}) as any as S.Schema<GetPolicyTemplateInput>;
export interface UpdatePolicyTemplateInput {
  policyStoreId: string;
  policyTemplateId: string;
  description?: string | redacted.Redacted<string>;
  statement: string | redacted.Redacted<string>;
}
export const UpdatePolicyTemplateInput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    policyTemplateId: S.String,
    description: S.optional(SensitiveString),
    statement: SensitiveString,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePolicyTemplateInput",
}) as any as S.Schema<UpdatePolicyTemplateInput>;
export interface DeletePolicyTemplateInput {
  policyStoreId: string;
  policyTemplateId: string;
}
export const DeletePolicyTemplateInput = S.suspend(() =>
  S.Struct({ policyStoreId: S.String, policyTemplateId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePolicyTemplateInput",
}) as any as S.Schema<DeletePolicyTemplateInput>;
export interface DeletePolicyTemplateOutput {}
export const DeletePolicyTemplateOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePolicyTemplateOutput",
}) as any as S.Schema<DeletePolicyTemplateOutput>;
export interface ListPolicyTemplatesInput {
  policyStoreId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListPolicyTemplatesInput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPolicyTemplatesInput",
}) as any as S.Schema<ListPolicyTemplatesInput>;
export type PolicyType = "STATIC" | "TEMPLATE_LINKED" | (string & {});
export const PolicyType = S.String;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type CedarVersion = "CEDAR_2" | "CEDAR_4" | (string & {});
export const CedarVersion = S.String;
export interface BatchIsAuthorizedInputItem {
  principal?: EntityIdentifier;
  action?: ActionIdentifier;
  resource?: EntityIdentifier;
  context?: ContextDefinition;
}
export const BatchIsAuthorizedInputItem = S.suspend(() =>
  S.Struct({
    principal: S.optional(EntityIdentifier),
    action: S.optional(ActionIdentifier),
    resource: S.optional(EntityIdentifier),
    context: S.optional(ContextDefinition),
  }),
).annotations({
  identifier: "BatchIsAuthorizedInputItem",
}) as any as S.Schema<BatchIsAuthorizedInputItem>;
export type BatchIsAuthorizedInputList = BatchIsAuthorizedInputItem[];
export const BatchIsAuthorizedInputList = S.Array(BatchIsAuthorizedInputItem);
export interface BatchIsAuthorizedWithTokenInputItem {
  action?: ActionIdentifier;
  resource?: EntityIdentifier;
  context?: ContextDefinition;
}
export const BatchIsAuthorizedWithTokenInputItem = S.suspend(() =>
  S.Struct({
    action: S.optional(ActionIdentifier),
    resource: S.optional(EntityIdentifier),
    context: S.optional(ContextDefinition),
  }),
).annotations({
  identifier: "BatchIsAuthorizedWithTokenInputItem",
}) as any as S.Schema<BatchIsAuthorizedWithTokenInputItem>;
export type BatchIsAuthorizedWithTokenInputList =
  BatchIsAuthorizedWithTokenInputItem[];
export const BatchIsAuthorizedWithTokenInputList = S.Array(
  BatchIsAuthorizedWithTokenInputItem,
);
export type NamespaceList = string | redacted.Redacted<string>[];
export const NamespaceList = S.Array(SensitiveString);
export type Decision = "ALLOW" | "DENY" | (string & {});
export const Decision = S.String;
export type SchemaDefinition = {
  cedarJson: string | redacted.Redacted<string>;
};
export const SchemaDefinition = S.Union(
  S.Struct({ cedarJson: SensitiveString }),
);
export interface BatchGetPolicyInputItem {
  policyStoreId: string;
  policyId: string;
}
export const BatchGetPolicyInputItem = S.suspend(() =>
  S.Struct({ policyStoreId: S.String, policyId: S.String }),
).annotations({
  identifier: "BatchGetPolicyInputItem",
}) as any as S.Schema<BatchGetPolicyInputItem>;
export type BatchGetPolicyInputList = BatchGetPolicyInputItem[];
export const BatchGetPolicyInputList = S.Array(BatchGetPolicyInputItem);
export interface IdentitySourceFilter {
  principalEntityType?: string | redacted.Redacted<string>;
}
export const IdentitySourceFilter = S.suspend(() =>
  S.Struct({ principalEntityType: S.optional(SensitiveString) }),
).annotations({
  identifier: "IdentitySourceFilter",
}) as any as S.Schema<IdentitySourceFilter>;
export type IdentitySourceFilters = IdentitySourceFilter[];
export const IdentitySourceFilters = S.Array(IdentitySourceFilter);
export type ActionIdentifierList = ActionIdentifier[];
export const ActionIdentifierList = S.Array(ActionIdentifier);
export type PolicyEffect = "Permit" | "Forbid" | (string & {});
export const PolicyEffect = S.String;
export type ClientIds = string | redacted.Redacted<string>[];
export const ClientIds = S.Array(SensitiveString);
export interface ListTagsForResourceOutput {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagMap }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface CreatePolicyStoreInput {
  clientToken?: string;
  validationSettings: ValidationSettings;
  description?: string | redacted.Redacted<string>;
  deletionProtection?: DeletionProtection;
  tags?: { [key: string]: string | undefined };
}
export const CreatePolicyStoreInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    validationSettings: ValidationSettings,
    description: S.optional(SensitiveString),
    deletionProtection: S.optional(DeletionProtection),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePolicyStoreInput",
}) as any as S.Schema<CreatePolicyStoreInput>;
export interface GetPolicyStoreOutput {
  policyStoreId: string;
  arn: string;
  validationSettings: ValidationSettings;
  createdDate: Date;
  lastUpdatedDate: Date;
  description?: string | redacted.Redacted<string>;
  deletionProtection?: DeletionProtection;
  cedarVersion?: CedarVersion;
  tags?: { [key: string]: string | undefined };
}
export const GetPolicyStoreOutput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    arn: S.String,
    validationSettings: ValidationSettings,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(SensitiveString),
    deletionProtection: S.optional(DeletionProtection),
    cedarVersion: S.optional(CedarVersion),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetPolicyStoreOutput",
}) as any as S.Schema<GetPolicyStoreOutput>;
export interface UpdatePolicyStoreOutput {
  policyStoreId: string;
  arn: string;
  createdDate: Date;
  lastUpdatedDate: Date;
}
export const UpdatePolicyStoreOutput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    arn: S.String,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdatePolicyStoreOutput",
}) as any as S.Schema<UpdatePolicyStoreOutput>;
export interface BatchIsAuthorizedWithTokenInput {
  policyStoreId: string;
  identityToken?: string | redacted.Redacted<string>;
  accessToken?: string | redacted.Redacted<string>;
  entities?: EntitiesDefinition;
  requests: BatchIsAuthorizedWithTokenInputItem[];
}
export const BatchIsAuthorizedWithTokenInput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    identityToken: S.optional(SensitiveString),
    accessToken: S.optional(SensitiveString),
    entities: S.optional(EntitiesDefinition),
    requests: BatchIsAuthorizedWithTokenInputList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchIsAuthorizedWithTokenInput",
}) as any as S.Schema<BatchIsAuthorizedWithTokenInput>;
export interface GetSchemaOutput {
  policyStoreId: string;
  schema: string | redacted.Redacted<string>;
  createdDate: Date;
  lastUpdatedDate: Date;
  namespaces?: string | redacted.Redacted<string>[];
}
export const GetSchemaOutput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    schema: SensitiveString,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    namespaces: S.optional(NamespaceList),
  }),
).annotations({
  identifier: "GetSchemaOutput",
}) as any as S.Schema<GetSchemaOutput>;
export interface PutSchemaInput {
  policyStoreId: string;
  definition: SchemaDefinition;
}
export const PutSchemaInput = S.suspend(() =>
  S.Struct({ policyStoreId: S.String, definition: SchemaDefinition }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutSchemaInput",
}) as any as S.Schema<PutSchemaInput>;
export interface BatchGetPolicyInput {
  requests: BatchGetPolicyInputItem[];
}
export const BatchGetPolicyInput = S.suspend(() =>
  S.Struct({ requests: BatchGetPolicyInputList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetPolicyInput",
}) as any as S.Schema<BatchGetPolicyInput>;
export interface ListIdentitySourcesInput {
  policyStoreId: string;
  nextToken?: string;
  maxResults?: number;
  filters?: IdentitySourceFilter[];
}
export const ListIdentitySourcesInput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(IdentitySourceFilters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListIdentitySourcesInput",
}) as any as S.Schema<ListIdentitySourcesInput>;
export interface CreatePolicyTemplateOutput {
  policyStoreId: string;
  policyTemplateId: string;
  createdDate: Date;
  lastUpdatedDate: Date;
}
export const CreatePolicyTemplateOutput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    policyTemplateId: S.String,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreatePolicyTemplateOutput",
}) as any as S.Schema<CreatePolicyTemplateOutput>;
export interface GetPolicyTemplateOutput {
  policyStoreId: string;
  policyTemplateId: string;
  description?: string | redacted.Redacted<string>;
  statement: string | redacted.Redacted<string>;
  createdDate: Date;
  lastUpdatedDate: Date;
}
export const GetPolicyTemplateOutput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    policyTemplateId: S.String,
    description: S.optional(SensitiveString),
    statement: SensitiveString,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetPolicyTemplateOutput",
}) as any as S.Schema<GetPolicyTemplateOutput>;
export interface UpdatePolicyTemplateOutput {
  policyStoreId: string;
  policyTemplateId: string;
  createdDate: Date;
  lastUpdatedDate: Date;
}
export const UpdatePolicyTemplateOutput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    policyTemplateId: S.String,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdatePolicyTemplateOutput",
}) as any as S.Schema<UpdatePolicyTemplateOutput>;
export type OpenIdIssuer = "COGNITO" | (string & {});
export const OpenIdIssuer = S.String;
export type ResourceType =
  | "IDENTITY_SOURCE"
  | "POLICY_STORE"
  | "POLICY"
  | "POLICY_TEMPLATE"
  | "SCHEMA"
  | (string & {});
export const ResourceType = S.String;
export interface StaticPolicyDefinition {
  description?: string | redacted.Redacted<string>;
  statement: string | redacted.Redacted<string>;
}
export const StaticPolicyDefinition = S.suspend(() =>
  S.Struct({
    description: S.optional(SensitiveString),
    statement: SensitiveString,
  }),
).annotations({
  identifier: "StaticPolicyDefinition",
}) as any as S.Schema<StaticPolicyDefinition>;
export interface TemplateLinkedPolicyDefinition {
  policyTemplateId: string;
  principal?: EntityIdentifier;
  resource?: EntityIdentifier;
}
export const TemplateLinkedPolicyDefinition = S.suspend(() =>
  S.Struct({
    policyTemplateId: S.String,
    principal: S.optional(EntityIdentifier),
    resource: S.optional(EntityIdentifier),
  }),
).annotations({
  identifier: "TemplateLinkedPolicyDefinition",
}) as any as S.Schema<TemplateLinkedPolicyDefinition>;
export interface UpdateStaticPolicyDefinition {
  description?: string | redacted.Redacted<string>;
  statement: string | redacted.Redacted<string>;
}
export const UpdateStaticPolicyDefinition = S.suspend(() =>
  S.Struct({
    description: S.optional(SensitiveString),
    statement: SensitiveString,
  }),
).annotations({
  identifier: "UpdateStaticPolicyDefinition",
}) as any as S.Schema<UpdateStaticPolicyDefinition>;
export type EntityReference =
  | { unspecified: boolean; identifier?: never }
  | { unspecified?: never; identifier: EntityIdentifier };
export const EntityReference = S.Union(
  S.Struct({ unspecified: S.Boolean }),
  S.Struct({ identifier: EntityIdentifier }),
);
export type SetAttribute = AttributeValue[];
export const SetAttribute = S.Array(
  S.suspend(() => AttributeValue).annotations({ identifier: "AttributeValue" }),
) as any as S.Schema<SetAttribute>;
export interface PolicyStoreItem {
  policyStoreId: string;
  arn: string;
  createdDate: Date;
  lastUpdatedDate?: Date;
  description?: string | redacted.Redacted<string>;
}
export const PolicyStoreItem = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    arn: S.String,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    description: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "PolicyStoreItem",
}) as any as S.Schema<PolicyStoreItem>;
export type PolicyStoreList = PolicyStoreItem[];
export const PolicyStoreList = S.Array(PolicyStoreItem);
export interface DeterminingPolicyItem {
  policyId: string;
}
export const DeterminingPolicyItem = S.suspend(() =>
  S.Struct({ policyId: S.String }),
).annotations({
  identifier: "DeterminingPolicyItem",
}) as any as S.Schema<DeterminingPolicyItem>;
export type DeterminingPolicyList = DeterminingPolicyItem[];
export const DeterminingPolicyList = S.Array(DeterminingPolicyItem);
export interface EvaluationErrorItem {
  errorDescription: string;
}
export const EvaluationErrorItem = S.suspend(() =>
  S.Struct({ errorDescription: S.String }),
).annotations({
  identifier: "EvaluationErrorItem",
}) as any as S.Schema<EvaluationErrorItem>;
export type EvaluationErrorList = EvaluationErrorItem[];
export const EvaluationErrorList = S.Array(EvaluationErrorItem);
export interface IdentitySourceDetails {
  clientIds?: string | redacted.Redacted<string>[];
  userPoolArn?: string;
  discoveryUrl?: string;
  openIdIssuer?: OpenIdIssuer;
}
export const IdentitySourceDetails = S.suspend(() =>
  S.Struct({
    clientIds: S.optional(ClientIds),
    userPoolArn: S.optional(S.String),
    discoveryUrl: S.optional(S.String),
    openIdIssuer: S.optional(OpenIdIssuer),
  }),
).annotations({
  identifier: "IdentitySourceDetails",
}) as any as S.Schema<IdentitySourceDetails>;
export interface ResourceConflict {
  resourceId: string;
  resourceType: ResourceType;
}
export const ResourceConflict = S.suspend(() =>
  S.Struct({ resourceId: S.String, resourceType: ResourceType }),
).annotations({
  identifier: "ResourceConflict",
}) as any as S.Schema<ResourceConflict>;
export type ResourceConflictList = ResourceConflict[];
export const ResourceConflictList = S.Array(ResourceConflict);
export type PolicyDefinition =
  | { static: StaticPolicyDefinition; templateLinked?: never }
  | { static?: never; templateLinked: TemplateLinkedPolicyDefinition };
export const PolicyDefinition = S.Union(
  S.Struct({ static: StaticPolicyDefinition }),
  S.Struct({ templateLinked: TemplateLinkedPolicyDefinition }),
);
export type UpdatePolicyDefinition = { static: UpdateStaticPolicyDefinition };
export const UpdatePolicyDefinition = S.Union(
  S.Struct({ static: UpdateStaticPolicyDefinition }),
);
export interface PolicyFilter {
  principal?: EntityReference;
  resource?: EntityReference;
  policyType?: PolicyType;
  policyTemplateId?: string;
}
export const PolicyFilter = S.suspend(() =>
  S.Struct({
    principal: S.optional(EntityReference),
    resource: S.optional(EntityReference),
    policyType: S.optional(PolicyType),
    policyTemplateId: S.optional(S.String),
  }),
).annotations({ identifier: "PolicyFilter" }) as any as S.Schema<PolicyFilter>;
export interface PolicyTemplateItem {
  policyStoreId: string;
  policyTemplateId: string;
  description?: string | redacted.Redacted<string>;
  createdDate: Date;
  lastUpdatedDate: Date;
}
export const PolicyTemplateItem = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    policyTemplateId: S.String,
    description: S.optional(SensitiveString),
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "PolicyTemplateItem",
}) as any as S.Schema<PolicyTemplateItem>;
export type PolicyTemplatesList = PolicyTemplateItem[];
export const PolicyTemplatesList = S.Array(PolicyTemplateItem);
export interface CognitoGroupConfiguration {
  groupEntityType: string | redacted.Redacted<string>;
}
export const CognitoGroupConfiguration = S.suspend(() =>
  S.Struct({ groupEntityType: SensitiveString }),
).annotations({
  identifier: "CognitoGroupConfiguration",
}) as any as S.Schema<CognitoGroupConfiguration>;
export interface OpenIdConnectGroupConfiguration {
  groupClaim: string | redacted.Redacted<string>;
  groupEntityType: string | redacted.Redacted<string>;
}
export const OpenIdConnectGroupConfiguration = S.suspend(() =>
  S.Struct({ groupClaim: SensitiveString, groupEntityType: SensitiveString }),
).annotations({
  identifier: "OpenIdConnectGroupConfiguration",
}) as any as S.Schema<OpenIdConnectGroupConfiguration>;
export interface UpdateCognitoGroupConfiguration {
  groupEntityType: string | redacted.Redacted<string>;
}
export const UpdateCognitoGroupConfiguration = S.suspend(() =>
  S.Struct({ groupEntityType: SensitiveString }),
).annotations({
  identifier: "UpdateCognitoGroupConfiguration",
}) as any as S.Schema<UpdateCognitoGroupConfiguration>;
export interface UpdateOpenIdConnectGroupConfiguration {
  groupClaim: string | redacted.Redacted<string>;
  groupEntityType: string | redacted.Redacted<string>;
}
export const UpdateOpenIdConnectGroupConfiguration = S.suspend(() =>
  S.Struct({ groupClaim: SensitiveString, groupEntityType: SensitiveString }),
).annotations({
  identifier: "UpdateOpenIdConnectGroupConfiguration",
}) as any as S.Schema<UpdateOpenIdConnectGroupConfiguration>;
export interface CreatePolicyStoreOutput {
  policyStoreId: string;
  arn: string;
  createdDate: Date;
  lastUpdatedDate: Date;
}
export const CreatePolicyStoreOutput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    arn: S.String,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreatePolicyStoreOutput",
}) as any as S.Schema<CreatePolicyStoreOutput>;
export interface ListPolicyStoresOutput {
  nextToken?: string;
  policyStores: PolicyStoreItem[];
}
export const ListPolicyStoresOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), policyStores: PolicyStoreList }),
).annotations({
  identifier: "ListPolicyStoresOutput",
}) as any as S.Schema<ListPolicyStoresOutput>;
export type CedarTagSetAttribute = CedarTagValue[];
export const CedarTagSetAttribute = S.Array(
  S.suspend(() => CedarTagValue).annotations({ identifier: "CedarTagValue" }),
) as any as S.Schema<CedarTagSetAttribute>;
export interface IsAuthorizedWithTokenOutput {
  decision: Decision;
  determiningPolicies: DeterminingPolicyItem[];
  errors: EvaluationErrorItem[];
  principal?: EntityIdentifier;
}
export const IsAuthorizedWithTokenOutput = S.suspend(() =>
  S.Struct({
    decision: Decision,
    determiningPolicies: DeterminingPolicyList,
    errors: EvaluationErrorList,
    principal: S.optional(EntityIdentifier),
  }),
).annotations({
  identifier: "IsAuthorizedWithTokenOutput",
}) as any as S.Schema<IsAuthorizedWithTokenOutput>;
export interface PutSchemaOutput {
  policyStoreId: string;
  namespaces: string | redacted.Redacted<string>[];
  createdDate: Date;
  lastUpdatedDate: Date;
}
export const PutSchemaOutput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    namespaces: NamespaceList,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "PutSchemaOutput",
}) as any as S.Schema<PutSchemaOutput>;
export type Audiences = string[];
export const Audiences = S.Array(S.String);
export interface CreatePolicyInput {
  clientToken?: string;
  policyStoreId: string;
  definition: PolicyDefinition;
}
export const CreatePolicyInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    policyStoreId: S.String,
    definition: PolicyDefinition,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePolicyInput",
}) as any as S.Schema<CreatePolicyInput>;
export interface UpdatePolicyInput {
  policyStoreId: string;
  policyId: string;
  definition: UpdatePolicyDefinition;
}
export const UpdatePolicyInput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    policyId: S.String,
    definition: UpdatePolicyDefinition,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePolicyInput",
}) as any as S.Schema<UpdatePolicyInput>;
export interface ListPoliciesInput {
  policyStoreId: string;
  nextToken?: string;
  maxResults?: number;
  filter?: PolicyFilter;
}
export const ListPoliciesInput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(PolicyFilter),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPoliciesInput",
}) as any as S.Schema<ListPoliciesInput>;
export interface ListPolicyTemplatesOutput {
  nextToken?: string;
  policyTemplates: PolicyTemplateItem[];
}
export const ListPolicyTemplatesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    policyTemplates: PolicyTemplatesList,
  }),
).annotations({
  identifier: "ListPolicyTemplatesOutput",
}) as any as S.Schema<ListPolicyTemplatesOutput>;
export type BatchGetPolicyErrorCode =
  | "POLICY_STORE_NOT_FOUND"
  | "POLICY_NOT_FOUND"
  | (string & {});
export const BatchGetPolicyErrorCode = S.String;
export interface CognitoUserPoolConfiguration {
  userPoolArn: string;
  clientIds?: string | redacted.Redacted<string>[];
  groupConfiguration?: CognitoGroupConfiguration;
}
export const CognitoUserPoolConfiguration = S.suspend(() =>
  S.Struct({
    userPoolArn: S.String,
    clientIds: S.optional(ClientIds),
    groupConfiguration: S.optional(CognitoGroupConfiguration),
  }),
).annotations({
  identifier: "CognitoUserPoolConfiguration",
}) as any as S.Schema<CognitoUserPoolConfiguration>;
export interface UpdateCognitoUserPoolConfiguration {
  userPoolArn: string;
  clientIds?: string | redacted.Redacted<string>[];
  groupConfiguration?: UpdateCognitoGroupConfiguration;
}
export const UpdateCognitoUserPoolConfiguration = S.suspend(() =>
  S.Struct({
    userPoolArn: S.String,
    clientIds: S.optional(ClientIds),
    groupConfiguration: S.optional(UpdateCognitoGroupConfiguration),
  }),
).annotations({
  identifier: "UpdateCognitoUserPoolConfiguration",
}) as any as S.Schema<UpdateCognitoUserPoolConfiguration>;
export interface StaticPolicyDefinitionDetail {
  description?: string | redacted.Redacted<string>;
  statement: string | redacted.Redacted<string>;
}
export const StaticPolicyDefinitionDetail = S.suspend(() =>
  S.Struct({
    description: S.optional(SensitiveString),
    statement: SensitiveString,
  }),
).annotations({
  identifier: "StaticPolicyDefinitionDetail",
}) as any as S.Schema<StaticPolicyDefinitionDetail>;
export interface TemplateLinkedPolicyDefinitionDetail {
  policyTemplateId: string;
  principal?: EntityIdentifier;
  resource?: EntityIdentifier;
}
export const TemplateLinkedPolicyDefinitionDetail = S.suspend(() =>
  S.Struct({
    policyTemplateId: S.String,
    principal: S.optional(EntityIdentifier),
    resource: S.optional(EntityIdentifier),
  }),
).annotations({
  identifier: "TemplateLinkedPolicyDefinitionDetail",
}) as any as S.Schema<TemplateLinkedPolicyDefinitionDetail>;
export type RecordAttribute = { [key: string]: AttributeValue | undefined };
export const RecordAttribute = S.Record({
  key: S.String,
  value: S.UndefinedOr(
    S.suspend(() => AttributeValue).annotations({
      identifier: "AttributeValue",
    }),
  ),
}) as any as S.Schema<RecordAttribute>;
export interface OpenIdConnectAccessTokenConfiguration {
  principalIdClaim?: string | redacted.Redacted<string>;
  audiences?: string[];
}
export const OpenIdConnectAccessTokenConfiguration = S.suspend(() =>
  S.Struct({
    principalIdClaim: S.optional(SensitiveString),
    audiences: S.optional(Audiences),
  }),
).annotations({
  identifier: "OpenIdConnectAccessTokenConfiguration",
}) as any as S.Schema<OpenIdConnectAccessTokenConfiguration>;
export interface OpenIdConnectIdentityTokenConfiguration {
  principalIdClaim?: string | redacted.Redacted<string>;
  clientIds?: string | redacted.Redacted<string>[];
}
export const OpenIdConnectIdentityTokenConfiguration = S.suspend(() =>
  S.Struct({
    principalIdClaim: S.optional(SensitiveString),
    clientIds: S.optional(ClientIds),
  }),
).annotations({
  identifier: "OpenIdConnectIdentityTokenConfiguration",
}) as any as S.Schema<OpenIdConnectIdentityTokenConfiguration>;
export interface UpdateOpenIdConnectAccessTokenConfiguration {
  principalIdClaim?: string | redacted.Redacted<string>;
  audiences?: string[];
}
export const UpdateOpenIdConnectAccessTokenConfiguration = S.suspend(() =>
  S.Struct({
    principalIdClaim: S.optional(SensitiveString),
    audiences: S.optional(Audiences),
  }),
).annotations({
  identifier: "UpdateOpenIdConnectAccessTokenConfiguration",
}) as any as S.Schema<UpdateOpenIdConnectAccessTokenConfiguration>;
export interface UpdateOpenIdConnectIdentityTokenConfiguration {
  principalIdClaim?: string | redacted.Redacted<string>;
  clientIds?: string | redacted.Redacted<string>[];
}
export const UpdateOpenIdConnectIdentityTokenConfiguration = S.suspend(() =>
  S.Struct({
    principalIdClaim: S.optional(SensitiveString),
    clientIds: S.optional(ClientIds),
  }),
).annotations({
  identifier: "UpdateOpenIdConnectIdentityTokenConfiguration",
}) as any as S.Schema<UpdateOpenIdConnectIdentityTokenConfiguration>;
export interface BatchIsAuthorizedWithTokenOutputItem {
  request: BatchIsAuthorizedWithTokenInputItem;
  decision: Decision;
  determiningPolicies: DeterminingPolicyItem[];
  errors: EvaluationErrorItem[];
}
export const BatchIsAuthorizedWithTokenOutputItem = S.suspend(() =>
  S.Struct({
    request: BatchIsAuthorizedWithTokenInputItem,
    decision: Decision,
    determiningPolicies: DeterminingPolicyList,
    errors: EvaluationErrorList,
  }),
).annotations({
  identifier: "BatchIsAuthorizedWithTokenOutputItem",
}) as any as S.Schema<BatchIsAuthorizedWithTokenOutputItem>;
export type BatchIsAuthorizedWithTokenOutputList =
  BatchIsAuthorizedWithTokenOutputItem[];
export const BatchIsAuthorizedWithTokenOutputList = S.Array(
  BatchIsAuthorizedWithTokenOutputItem,
);
export type PolicyDefinitionDetail =
  | { static: StaticPolicyDefinitionDetail; templateLinked?: never }
  | { static?: never; templateLinked: TemplateLinkedPolicyDefinitionDetail };
export const PolicyDefinitionDetail = S.Union(
  S.Struct({ static: StaticPolicyDefinitionDetail }),
  S.Struct({ templateLinked: TemplateLinkedPolicyDefinitionDetail }),
);
export interface BatchGetPolicyOutputItem {
  policyStoreId: string;
  policyId: string;
  policyType: PolicyType;
  definition: PolicyDefinitionDetail;
  createdDate: Date;
  lastUpdatedDate: Date;
}
export const BatchGetPolicyOutputItem = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    policyId: S.String,
    policyType: PolicyType,
    definition: PolicyDefinitionDetail,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "BatchGetPolicyOutputItem",
}) as any as S.Schema<BatchGetPolicyOutputItem>;
export type BatchGetPolicyOutputList = BatchGetPolicyOutputItem[];
export const BatchGetPolicyOutputList = S.Array(BatchGetPolicyOutputItem);
export interface BatchGetPolicyErrorItem {
  code: BatchGetPolicyErrorCode;
  policyStoreId: string;
  policyId: string;
  message: string;
}
export const BatchGetPolicyErrorItem = S.suspend(() =>
  S.Struct({
    code: BatchGetPolicyErrorCode,
    policyStoreId: S.String,
    policyId: S.String,
    message: S.String,
  }),
).annotations({
  identifier: "BatchGetPolicyErrorItem",
}) as any as S.Schema<BatchGetPolicyErrorItem>;
export type BatchGetPolicyErrorList = BatchGetPolicyErrorItem[];
export const BatchGetPolicyErrorList = S.Array(BatchGetPolicyErrorItem);
export type OpenIdConnectTokenSelection =
  | {
      accessTokenOnly: OpenIdConnectAccessTokenConfiguration;
      identityTokenOnly?: never;
    }
  | {
      accessTokenOnly?: never;
      identityTokenOnly: OpenIdConnectIdentityTokenConfiguration;
    };
export const OpenIdConnectTokenSelection = S.Union(
  S.Struct({ accessTokenOnly: OpenIdConnectAccessTokenConfiguration }),
  S.Struct({ identityTokenOnly: OpenIdConnectIdentityTokenConfiguration }),
);
export interface CognitoGroupConfigurationDetail {
  groupEntityType?: string | redacted.Redacted<string>;
}
export const CognitoGroupConfigurationDetail = S.suspend(() =>
  S.Struct({ groupEntityType: S.optional(SensitiveString) }),
).annotations({
  identifier: "CognitoGroupConfigurationDetail",
}) as any as S.Schema<CognitoGroupConfigurationDetail>;
export interface OpenIdConnectGroupConfigurationDetail {
  groupClaim: string | redacted.Redacted<string>;
  groupEntityType: string | redacted.Redacted<string>;
}
export const OpenIdConnectGroupConfigurationDetail = S.suspend(() =>
  S.Struct({ groupClaim: SensitiveString, groupEntityType: SensitiveString }),
).annotations({
  identifier: "OpenIdConnectGroupConfigurationDetail",
}) as any as S.Schema<OpenIdConnectGroupConfigurationDetail>;
export type UpdateOpenIdConnectTokenSelection =
  | {
      accessTokenOnly: UpdateOpenIdConnectAccessTokenConfiguration;
      identityTokenOnly?: never;
    }
  | {
      accessTokenOnly?: never;
      identityTokenOnly: UpdateOpenIdConnectIdentityTokenConfiguration;
    };
export const UpdateOpenIdConnectTokenSelection = S.Union(
  S.Struct({ accessTokenOnly: UpdateOpenIdConnectAccessTokenConfiguration }),
  S.Struct({
    identityTokenOnly: UpdateOpenIdConnectIdentityTokenConfiguration,
  }),
);
export type CedarTagRecordAttribute = {
  [key: string]: CedarTagValue | undefined;
};
export const CedarTagRecordAttribute = S.Record({
  key: S.String,
  value: S.UndefinedOr(
    S.suspend(() => CedarTagValue).annotations({ identifier: "CedarTagValue" }),
  ),
}) as any as S.Schema<CedarTagRecordAttribute>;
export interface BatchIsAuthorizedWithTokenOutput {
  principal?: EntityIdentifier;
  results: BatchIsAuthorizedWithTokenOutputItem[];
}
export const BatchIsAuthorizedWithTokenOutput = S.suspend(() =>
  S.Struct({
    principal: S.optional(EntityIdentifier),
    results: BatchIsAuthorizedWithTokenOutputList,
  }),
).annotations({
  identifier: "BatchIsAuthorizedWithTokenOutput",
}) as any as S.Schema<BatchIsAuthorizedWithTokenOutput>;
export interface BatchGetPolicyOutput {
  results: BatchGetPolicyOutputItem[];
  errors: BatchGetPolicyErrorItem[];
}
export const BatchGetPolicyOutput = S.suspend(() =>
  S.Struct({
    results: BatchGetPolicyOutputList,
    errors: BatchGetPolicyErrorList,
  }),
).annotations({
  identifier: "BatchGetPolicyOutput",
}) as any as S.Schema<BatchGetPolicyOutput>;
export interface CreatePolicyOutput {
  policyStoreId: string;
  policyId: string;
  policyType: PolicyType;
  principal?: EntityIdentifier;
  resource?: EntityIdentifier;
  actions?: ActionIdentifier[];
  createdDate: Date;
  lastUpdatedDate: Date;
  effect?: PolicyEffect;
}
export const CreatePolicyOutput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    policyId: S.String,
    policyType: PolicyType,
    principal: S.optional(EntityIdentifier),
    resource: S.optional(EntityIdentifier),
    actions: S.optional(ActionIdentifierList),
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    effect: S.optional(PolicyEffect),
  }),
).annotations({
  identifier: "CreatePolicyOutput",
}) as any as S.Schema<CreatePolicyOutput>;
export interface GetPolicyOutput {
  policyStoreId: string;
  policyId: string;
  policyType: PolicyType;
  principal?: EntityIdentifier;
  resource?: EntityIdentifier;
  actions?: ActionIdentifier[];
  definition: PolicyDefinitionDetail;
  createdDate: Date;
  lastUpdatedDate: Date;
  effect?: PolicyEffect;
}
export const GetPolicyOutput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    policyId: S.String,
    policyType: PolicyType,
    principal: S.optional(EntityIdentifier),
    resource: S.optional(EntityIdentifier),
    actions: S.optional(ActionIdentifierList),
    definition: PolicyDefinitionDetail,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    effect: S.optional(PolicyEffect),
  }),
).annotations({
  identifier: "GetPolicyOutput",
}) as any as S.Schema<GetPolicyOutput>;
export interface UpdatePolicyOutput {
  policyStoreId: string;
  policyId: string;
  policyType: PolicyType;
  principal?: EntityIdentifier;
  resource?: EntityIdentifier;
  actions?: ActionIdentifier[];
  createdDate: Date;
  lastUpdatedDate: Date;
  effect?: PolicyEffect;
}
export const UpdatePolicyOutput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    policyId: S.String,
    policyType: PolicyType,
    principal: S.optional(EntityIdentifier),
    resource: S.optional(EntityIdentifier),
    actions: S.optional(ActionIdentifierList),
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    effect: S.optional(PolicyEffect),
  }),
).annotations({
  identifier: "UpdatePolicyOutput",
}) as any as S.Schema<UpdatePolicyOutput>;
export interface OpenIdConnectConfiguration {
  issuer: string;
  entityIdPrefix?: string | redacted.Redacted<string>;
  groupConfiguration?: OpenIdConnectGroupConfiguration;
  tokenSelection: OpenIdConnectTokenSelection;
}
export const OpenIdConnectConfiguration = S.suspend(() =>
  S.Struct({
    issuer: S.String,
    entityIdPrefix: S.optional(SensitiveString),
    groupConfiguration: S.optional(OpenIdConnectGroupConfiguration),
    tokenSelection: OpenIdConnectTokenSelection,
  }),
).annotations({
  identifier: "OpenIdConnectConfiguration",
}) as any as S.Schema<OpenIdConnectConfiguration>;
export interface CognitoUserPoolConfigurationDetail {
  userPoolArn: string;
  clientIds: string | redacted.Redacted<string>[];
  issuer: string;
  groupConfiguration?: CognitoGroupConfigurationDetail;
}
export const CognitoUserPoolConfigurationDetail = S.suspend(() =>
  S.Struct({
    userPoolArn: S.String,
    clientIds: ClientIds,
    issuer: S.String,
    groupConfiguration: S.optional(CognitoGroupConfigurationDetail),
  }),
).annotations({
  identifier: "CognitoUserPoolConfigurationDetail",
}) as any as S.Schema<CognitoUserPoolConfigurationDetail>;
export interface UpdateOpenIdConnectConfiguration {
  issuer: string;
  entityIdPrefix?: string | redacted.Redacted<string>;
  groupConfiguration?: UpdateOpenIdConnectGroupConfiguration;
  tokenSelection: UpdateOpenIdConnectTokenSelection;
}
export const UpdateOpenIdConnectConfiguration = S.suspend(() =>
  S.Struct({
    issuer: S.String,
    entityIdPrefix: S.optional(SensitiveString),
    groupConfiguration: S.optional(UpdateOpenIdConnectGroupConfiguration),
    tokenSelection: UpdateOpenIdConnectTokenSelection,
  }),
).annotations({
  identifier: "UpdateOpenIdConnectConfiguration",
}) as any as S.Schema<UpdateOpenIdConnectConfiguration>;
export interface IdentitySourceItemDetails {
  clientIds?: string | redacted.Redacted<string>[];
  userPoolArn?: string;
  discoveryUrl?: string;
  openIdIssuer?: OpenIdIssuer;
}
export const IdentitySourceItemDetails = S.suspend(() =>
  S.Struct({
    clientIds: S.optional(ClientIds),
    userPoolArn: S.optional(S.String),
    discoveryUrl: S.optional(S.String),
    openIdIssuer: S.optional(OpenIdIssuer),
  }),
).annotations({
  identifier: "IdentitySourceItemDetails",
}) as any as S.Schema<IdentitySourceItemDetails>;
export interface OpenIdConnectAccessTokenConfigurationDetail {
  principalIdClaim?: string | redacted.Redacted<string>;
  audiences?: string[];
}
export const OpenIdConnectAccessTokenConfigurationDetail = S.suspend(() =>
  S.Struct({
    principalIdClaim: S.optional(SensitiveString),
    audiences: S.optional(Audiences),
  }),
).annotations({
  identifier: "OpenIdConnectAccessTokenConfigurationDetail",
}) as any as S.Schema<OpenIdConnectAccessTokenConfigurationDetail>;
export interface OpenIdConnectIdentityTokenConfigurationDetail {
  principalIdClaim?: string | redacted.Redacted<string>;
  clientIds?: string | redacted.Redacted<string>[];
}
export const OpenIdConnectIdentityTokenConfigurationDetail = S.suspend(() =>
  S.Struct({
    principalIdClaim: S.optional(SensitiveString),
    clientIds: S.optional(ClientIds),
  }),
).annotations({
  identifier: "OpenIdConnectIdentityTokenConfigurationDetail",
}) as any as S.Schema<OpenIdConnectIdentityTokenConfigurationDetail>;
export type Configuration =
  | {
      cognitoUserPoolConfiguration: CognitoUserPoolConfiguration;
      openIdConnectConfiguration?: never;
    }
  | {
      cognitoUserPoolConfiguration?: never;
      openIdConnectConfiguration: OpenIdConnectConfiguration;
    };
export const Configuration = S.Union(
  S.Struct({ cognitoUserPoolConfiguration: CognitoUserPoolConfiguration }),
  S.Struct({ openIdConnectConfiguration: OpenIdConnectConfiguration }),
);
export type UpdateConfiguration =
  | {
      cognitoUserPoolConfiguration: UpdateCognitoUserPoolConfiguration;
      openIdConnectConfiguration?: never;
    }
  | {
      cognitoUserPoolConfiguration?: never;
      openIdConnectConfiguration: UpdateOpenIdConnectConfiguration;
    };
export const UpdateConfiguration = S.Union(
  S.Struct({
    cognitoUserPoolConfiguration: UpdateCognitoUserPoolConfiguration,
  }),
  S.Struct({ openIdConnectConfiguration: UpdateOpenIdConnectConfiguration }),
);
export type OpenIdConnectTokenSelectionDetail =
  | {
      accessTokenOnly: OpenIdConnectAccessTokenConfigurationDetail;
      identityTokenOnly?: never;
    }
  | {
      accessTokenOnly?: never;
      identityTokenOnly: OpenIdConnectIdentityTokenConfigurationDetail;
    };
export const OpenIdConnectTokenSelectionDetail = S.Union(
  S.Struct({ accessTokenOnly: OpenIdConnectAccessTokenConfigurationDetail }),
  S.Struct({
    identityTokenOnly: OpenIdConnectIdentityTokenConfigurationDetail,
  }),
);
export interface IsAuthorizedInput {
  policyStoreId: string;
  principal?: EntityIdentifier;
  action?: ActionIdentifier;
  resource?: EntityIdentifier;
  context?: ContextDefinition;
  entities?: EntitiesDefinition;
}
export const IsAuthorizedInput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    principal: S.optional(EntityIdentifier),
    action: S.optional(ActionIdentifier),
    resource: S.optional(EntityIdentifier),
    context: S.optional(ContextDefinition),
    entities: S.optional(EntitiesDefinition),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "IsAuthorizedInput",
}) as any as S.Schema<IsAuthorizedInput>;
export interface CreateIdentitySourceInput {
  clientToken?: string;
  policyStoreId: string;
  configuration: Configuration;
  principalEntityType?: string | redacted.Redacted<string>;
}
export const CreateIdentitySourceInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    policyStoreId: S.String,
    configuration: Configuration,
    principalEntityType: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateIdentitySourceInput",
}) as any as S.Schema<CreateIdentitySourceInput>;
export interface UpdateIdentitySourceInput {
  policyStoreId: string;
  identitySourceId: string;
  updateConfiguration: UpdateConfiguration;
  principalEntityType?: string | redacted.Redacted<string>;
}
export const UpdateIdentitySourceInput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    identitySourceId: S.String,
    updateConfiguration: UpdateConfiguration,
    principalEntityType: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateIdentitySourceInput",
}) as any as S.Schema<UpdateIdentitySourceInput>;
export interface OpenIdConnectConfigurationDetail {
  issuer: string;
  entityIdPrefix?: string | redacted.Redacted<string>;
  groupConfiguration?: OpenIdConnectGroupConfigurationDetail;
  tokenSelection: OpenIdConnectTokenSelectionDetail;
}
export const OpenIdConnectConfigurationDetail = S.suspend(() =>
  S.Struct({
    issuer: S.String,
    entityIdPrefix: S.optional(SensitiveString),
    groupConfiguration: S.optional(OpenIdConnectGroupConfigurationDetail),
    tokenSelection: OpenIdConnectTokenSelectionDetail,
  }),
).annotations({
  identifier: "OpenIdConnectConfigurationDetail",
}) as any as S.Schema<OpenIdConnectConfigurationDetail>;
export interface CognitoGroupConfigurationItem {
  groupEntityType?: string | redacted.Redacted<string>;
}
export const CognitoGroupConfigurationItem = S.suspend(() =>
  S.Struct({ groupEntityType: S.optional(SensitiveString) }),
).annotations({
  identifier: "CognitoGroupConfigurationItem",
}) as any as S.Schema<CognitoGroupConfigurationItem>;
export interface OpenIdConnectGroupConfigurationItem {
  groupClaim: string | redacted.Redacted<string>;
  groupEntityType: string | redacted.Redacted<string>;
}
export const OpenIdConnectGroupConfigurationItem = S.suspend(() =>
  S.Struct({ groupClaim: SensitiveString, groupEntityType: SensitiveString }),
).annotations({
  identifier: "OpenIdConnectGroupConfigurationItem",
}) as any as S.Schema<OpenIdConnectGroupConfigurationItem>;
export type ConfigurationDetail =
  | {
      cognitoUserPoolConfiguration: CognitoUserPoolConfigurationDetail;
      openIdConnectConfiguration?: never;
    }
  | {
      cognitoUserPoolConfiguration?: never;
      openIdConnectConfiguration: OpenIdConnectConfigurationDetail;
    };
export const ConfigurationDetail = S.Union(
  S.Struct({
    cognitoUserPoolConfiguration: CognitoUserPoolConfigurationDetail,
  }),
  S.Struct({ openIdConnectConfiguration: OpenIdConnectConfigurationDetail }),
);
export interface CognitoUserPoolConfigurationItem {
  userPoolArn: string;
  clientIds: string | redacted.Redacted<string>[];
  issuer: string;
  groupConfiguration?: CognitoGroupConfigurationItem;
}
export const CognitoUserPoolConfigurationItem = S.suspend(() =>
  S.Struct({
    userPoolArn: S.String,
    clientIds: ClientIds,
    issuer: S.String,
    groupConfiguration: S.optional(CognitoGroupConfigurationItem),
  }),
).annotations({
  identifier: "CognitoUserPoolConfigurationItem",
}) as any as S.Schema<CognitoUserPoolConfigurationItem>;
export interface StaticPolicyDefinitionItem {
  description?: string | redacted.Redacted<string>;
}
export const StaticPolicyDefinitionItem = S.suspend(() =>
  S.Struct({ description: S.optional(SensitiveString) }),
).annotations({
  identifier: "StaticPolicyDefinitionItem",
}) as any as S.Schema<StaticPolicyDefinitionItem>;
export interface TemplateLinkedPolicyDefinitionItem {
  policyTemplateId: string;
  principal?: EntityIdentifier;
  resource?: EntityIdentifier;
}
export const TemplateLinkedPolicyDefinitionItem = S.suspend(() =>
  S.Struct({
    policyTemplateId: S.String,
    principal: S.optional(EntityIdentifier),
    resource: S.optional(EntityIdentifier),
  }),
).annotations({
  identifier: "TemplateLinkedPolicyDefinitionItem",
}) as any as S.Schema<TemplateLinkedPolicyDefinitionItem>;
export interface BatchIsAuthorizedInput {
  policyStoreId: string;
  entities?: EntitiesDefinition;
  requests: BatchIsAuthorizedInputItem[];
}
export const BatchIsAuthorizedInput = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    entities: S.optional(EntitiesDefinition),
    requests: BatchIsAuthorizedInputList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchIsAuthorizedInput",
}) as any as S.Schema<BatchIsAuthorizedInput>;
export interface IsAuthorizedOutput {
  decision: Decision;
  determiningPolicies: DeterminingPolicyItem[];
  errors: EvaluationErrorItem[];
}
export const IsAuthorizedOutput = S.suspend(() =>
  S.Struct({
    decision: Decision,
    determiningPolicies: DeterminingPolicyList,
    errors: EvaluationErrorList,
  }),
).annotations({
  identifier: "IsAuthorizedOutput",
}) as any as S.Schema<IsAuthorizedOutput>;
export interface CreateIdentitySourceOutput {
  createdDate: Date;
  identitySourceId: string;
  lastUpdatedDate: Date;
  policyStoreId: string;
}
export const CreateIdentitySourceOutput = S.suspend(() =>
  S.Struct({
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    identitySourceId: S.String,
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    policyStoreId: S.String,
  }),
).annotations({
  identifier: "CreateIdentitySourceOutput",
}) as any as S.Schema<CreateIdentitySourceOutput>;
export interface GetIdentitySourceOutput {
  createdDate: Date;
  details?: IdentitySourceDetails;
  identitySourceId: string;
  lastUpdatedDate: Date;
  policyStoreId: string;
  principalEntityType: string | redacted.Redacted<string>;
  configuration?: ConfigurationDetail;
}
export const GetIdentitySourceOutput = S.suspend(() =>
  S.Struct({
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    details: S.optional(IdentitySourceDetails),
    identitySourceId: S.String,
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    policyStoreId: S.String,
    principalEntityType: SensitiveString,
    configuration: S.optional(ConfigurationDetail),
  }),
).annotations({
  identifier: "GetIdentitySourceOutput",
}) as any as S.Schema<GetIdentitySourceOutput>;
export interface UpdateIdentitySourceOutput {
  createdDate: Date;
  identitySourceId: string;
  lastUpdatedDate: Date;
  policyStoreId: string;
}
export const UpdateIdentitySourceOutput = S.suspend(() =>
  S.Struct({
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    identitySourceId: S.String,
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    policyStoreId: S.String,
  }),
).annotations({
  identifier: "UpdateIdentitySourceOutput",
}) as any as S.Schema<UpdateIdentitySourceOutput>;
export interface OpenIdConnectAccessTokenConfigurationItem {
  principalIdClaim?: string | redacted.Redacted<string>;
  audiences?: string[];
}
export const OpenIdConnectAccessTokenConfigurationItem = S.suspend(() =>
  S.Struct({
    principalIdClaim: S.optional(SensitiveString),
    audiences: S.optional(Audiences),
  }),
).annotations({
  identifier: "OpenIdConnectAccessTokenConfigurationItem",
}) as any as S.Schema<OpenIdConnectAccessTokenConfigurationItem>;
export interface OpenIdConnectIdentityTokenConfigurationItem {
  principalIdClaim?: string | redacted.Redacted<string>;
  clientIds?: string | redacted.Redacted<string>[];
}
export const OpenIdConnectIdentityTokenConfigurationItem = S.suspend(() =>
  S.Struct({
    principalIdClaim: S.optional(SensitiveString),
    clientIds: S.optional(ClientIds),
  }),
).annotations({
  identifier: "OpenIdConnectIdentityTokenConfigurationItem",
}) as any as S.Schema<OpenIdConnectIdentityTokenConfigurationItem>;
export type PolicyDefinitionItem =
  | { static: StaticPolicyDefinitionItem; templateLinked?: never }
  | { static?: never; templateLinked: TemplateLinkedPolicyDefinitionItem };
export const PolicyDefinitionItem = S.Union(
  S.Struct({ static: StaticPolicyDefinitionItem }),
  S.Struct({ templateLinked: TemplateLinkedPolicyDefinitionItem }),
);
export type OpenIdConnectTokenSelectionItem =
  | {
      accessTokenOnly: OpenIdConnectAccessTokenConfigurationItem;
      identityTokenOnly?: never;
    }
  | {
      accessTokenOnly?: never;
      identityTokenOnly: OpenIdConnectIdentityTokenConfigurationItem;
    };
export const OpenIdConnectTokenSelectionItem = S.Union(
  S.Struct({ accessTokenOnly: OpenIdConnectAccessTokenConfigurationItem }),
  S.Struct({ identityTokenOnly: OpenIdConnectIdentityTokenConfigurationItem }),
);
export interface PolicyItem {
  policyStoreId: string;
  policyId: string;
  policyType: PolicyType;
  principal?: EntityIdentifier;
  resource?: EntityIdentifier;
  actions?: ActionIdentifier[];
  definition: PolicyDefinitionItem;
  createdDate: Date;
  lastUpdatedDate: Date;
  effect?: PolicyEffect;
}
export const PolicyItem = S.suspend(() =>
  S.Struct({
    policyStoreId: S.String,
    policyId: S.String,
    policyType: PolicyType,
    principal: S.optional(EntityIdentifier),
    resource: S.optional(EntityIdentifier),
    actions: S.optional(ActionIdentifierList),
    definition: PolicyDefinitionItem,
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    effect: S.optional(PolicyEffect),
  }),
).annotations({ identifier: "PolicyItem" }) as any as S.Schema<PolicyItem>;
export type PolicyList = PolicyItem[];
export const PolicyList = S.Array(PolicyItem);
export interface OpenIdConnectConfigurationItem {
  issuer: string;
  entityIdPrefix?: string | redacted.Redacted<string>;
  groupConfiguration?: OpenIdConnectGroupConfigurationItem;
  tokenSelection: OpenIdConnectTokenSelectionItem;
}
export const OpenIdConnectConfigurationItem = S.suspend(() =>
  S.Struct({
    issuer: S.String,
    entityIdPrefix: S.optional(SensitiveString),
    groupConfiguration: S.optional(OpenIdConnectGroupConfigurationItem),
    tokenSelection: OpenIdConnectTokenSelectionItem,
  }),
).annotations({
  identifier: "OpenIdConnectConfigurationItem",
}) as any as S.Schema<OpenIdConnectConfigurationItem>;
export interface ListPoliciesOutput {
  nextToken?: string;
  policies: PolicyItem[];
}
export const ListPoliciesOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), policies: PolicyList }),
).annotations({
  identifier: "ListPoliciesOutput",
}) as any as S.Schema<ListPoliciesOutput>;
export type ConfigurationItem =
  | {
      cognitoUserPoolConfiguration: CognitoUserPoolConfigurationItem;
      openIdConnectConfiguration?: never;
    }
  | {
      cognitoUserPoolConfiguration?: never;
      openIdConnectConfiguration: OpenIdConnectConfigurationItem;
    };
export const ConfigurationItem = S.Union(
  S.Struct({ cognitoUserPoolConfiguration: CognitoUserPoolConfigurationItem }),
  S.Struct({ openIdConnectConfiguration: OpenIdConnectConfigurationItem }),
);
export interface BatchIsAuthorizedOutputItem {
  request: BatchIsAuthorizedInputItem;
  decision: Decision;
  determiningPolicies: DeterminingPolicyItem[];
  errors: EvaluationErrorItem[];
}
export const BatchIsAuthorizedOutputItem = S.suspend(() =>
  S.Struct({
    request: BatchIsAuthorizedInputItem,
    decision: Decision,
    determiningPolicies: DeterminingPolicyList,
    errors: EvaluationErrorList,
  }),
).annotations({
  identifier: "BatchIsAuthorizedOutputItem",
}) as any as S.Schema<BatchIsAuthorizedOutputItem>;
export type BatchIsAuthorizedOutputList = BatchIsAuthorizedOutputItem[];
export const BatchIsAuthorizedOutputList = S.Array(BatchIsAuthorizedOutputItem);
export interface IdentitySourceItem {
  createdDate: Date;
  details?: IdentitySourceItemDetails;
  identitySourceId: string;
  lastUpdatedDate: Date;
  policyStoreId: string;
  principalEntityType: string | redacted.Redacted<string>;
  configuration?: ConfigurationItem;
}
export const IdentitySourceItem = S.suspend(() =>
  S.Struct({
    createdDate: S.Date.pipe(T.TimestampFormat("date-time")),
    details: S.optional(IdentitySourceItemDetails),
    identitySourceId: S.String,
    lastUpdatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    policyStoreId: S.String,
    principalEntityType: SensitiveString,
    configuration: S.optional(ConfigurationItem),
  }),
).annotations({
  identifier: "IdentitySourceItem",
}) as any as S.Schema<IdentitySourceItem>;
export type IdentitySources = IdentitySourceItem[];
export const IdentitySources = S.Array(IdentitySourceItem);
export interface BatchIsAuthorizedOutput {
  results: BatchIsAuthorizedOutputItem[];
}
export const BatchIsAuthorizedOutput = S.suspend(() =>
  S.Struct({ results: BatchIsAuthorizedOutputList }),
).annotations({
  identifier: "BatchIsAuthorizedOutput",
}) as any as S.Schema<BatchIsAuthorizedOutput>;
export interface ListIdentitySourcesOutput {
  nextToken?: string;
  identitySources: IdentitySourceItem[];
}
export const ListIdentitySourcesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    identitySources: IdentitySources,
  }),
).annotations({
  identifier: "ListIdentitySourcesOutput",
}) as any as S.Schema<ListIdentitySourcesOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: ResourceType },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resources: ResourceConflictList },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: ResourceType,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes the specified policy store.
 *
 * This operation is idempotent. If you specify a policy store that does not exist, the request response will still return a successful HTTP 200 status code.
 */
export const deletePolicyStore: (
  input: DeletePolicyStoreInput,
) => effect.Effect<
  DeletePolicyStoreOutput,
  InvalidStateException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyStoreInput,
  output: DeletePolicyStoreOutput,
  errors: [InvalidStateException],
}));
/**
 * Retrieves details about a policy store.
 */
export const getPolicyStore: (
  input: GetPolicyStoreInput,
) => effect.Effect<
  GetPolicyStoreOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyStoreInput,
  output: GetPolicyStoreOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns a paginated list of all policy stores in the calling Amazon Web Services account.
 */
export const listPolicyStores: {
  (
    input: ListPolicyStoresInput,
  ): effect.Effect<
    ListPolicyStoresOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyStoresInput,
  ) => stream.Stream<
    ListPolicyStoresOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyStoresInput,
  ) => stream.Stream<
    PolicyStoreItem,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPolicyStoresInput,
  output: ListPolicyStoresOutput,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "policyStores",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Makes an authorization decision about a service request described in the parameters. The principal in this request comes from an external identity source in the form of an identity token formatted as a JSON web token (JWT). The information in the parameters can also define additional context that Verified Permissions can include in the evaluation. The request is evaluated against all matching policies in the specified policy store. The result of the decision is either `Allow` or `Deny`, along with a list of the policies that resulted in the decision.
 *
 * Verified Permissions validates each token that is specified in a request by checking its expiration date and its signature.
 *
 * Tokens from an identity source user continue to be usable until they expire. Token revocation and resource deletion have no effect on the validity of a token in your policy store
 */
export const isAuthorizedWithToken: (
  input: IsAuthorizedWithTokenInput,
) => effect.Effect<
  IsAuthorizedWithTokenOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IsAuthorizedWithTokenInput,
  output: IsAuthorizedWithTokenOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes an identity source that references an identity provider (IdP) such as Amazon Cognito. After you delete the identity source, you can no longer use tokens for identities from that identity source to represent principals in authorization queries made using IsAuthorizedWithToken. operations.
 */
export const deleteIdentitySource: (
  input: DeleteIdentitySourceInput,
) => effect.Effect<
  DeleteIdentitySourceOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentitySourceInput,
  output: DeleteIdentitySourceOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Returns a paginated list of all policy templates in the specified policy store.
 */
export const listPolicyTemplates: {
  (
    input: ListPolicyTemplatesInput,
  ): effect.Effect<
    ListPolicyTemplatesOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyTemplatesInput,
  ) => stream.Stream<
    ListPolicyTemplatesOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyTemplatesInput,
  ) => stream.Stream<
    PolicyTemplateItem,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getSchema: (
  input: GetSchemaInput,
) => effect.Effect<
  GetSchemaOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaInput,
  output: GetSchemaOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieve the details for the specified policy template in the specified policy store.
 */
export const getPolicyTemplate: (
  input: GetPolicyTemplateInput,
) => effect.Effect<
  GetPolicyTemplateOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyTemplateInput,
  output: GetPolicyTemplateOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes the specified policy from the policy store.
 *
 * This operation is idempotent; if you specify a policy that doesn't exist, the request response returns a successful `HTTP 200` status code.
 */
export const deletePolicy: (
  input: DeletePolicyInput,
) => effect.Effect<
  DeletePolicyOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyInput,
  output: DeletePolicyOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Deletes the specified policy template from the policy store.
 *
 * This operation also deletes any policies that were created from the specified policy template. Those policies are immediately removed from all future API responses, and are asynchronously deleted from the policy store.
 */
export const deletePolicyTemplate: (
  input: DeletePolicyTemplateInput,
) => effect.Effect<
  DeletePolicyTemplateOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyTemplateInput,
  output: DeletePolicyTemplateOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Modifies the validation setting for a policy store.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const updatePolicyStore: (
  input: UpdatePolicyStoreInput,
) => effect.Effect<
  UpdatePolicyStoreOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePolicyTemplate: (
  input: UpdatePolicyTemplateInput,
) => effect.Effect<
  UpdatePolicyTemplateOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePolicyTemplateInput,
  output: UpdatePolicyTemplateOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Makes a series of decisions about multiple authorization requests for one token. The principal in this request comes from an external identity source in the form of an identity or access token, formatted as a JSON web token (JWT). The information in the parameters can also define additional context that Verified Permissions can include in the evaluations.
 *
 * The request is evaluated against all policies in the specified policy store that match the entities that you provide in the entities declaration and in the token. The result of the decisions is a series of `Allow` or `Deny` responses, along with the IDs of the policies that produced each decision.
 *
 * The `entities` of a `BatchIsAuthorizedWithToken` API request can contain up to 100 resources and up to 99 user groups. The `requests` of a `BatchIsAuthorizedWithToken` API request can contain up to 30 requests.
 *
 * The `BatchIsAuthorizedWithToken` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `verifiedpermissions:IsAuthorizedWithToken` in their IAM policies.
 */
export const batchIsAuthorizedWithToken: (
  input: BatchIsAuthorizedWithTokenInput,
) => effect.Effect<
  BatchIsAuthorizedWithTokenOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchIsAuthorizedWithTokenInput,
  output: BatchIsAuthorizedWithTokenOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves information about a group (batch) of policies.
 *
 * The `BatchGetPolicy` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `verifiedpermissions:GetPolicy` in their IAM policies.
 */
export const batchGetPolicy: (
  input: BatchGetPolicyInput,
) => effect.Effect<
  BatchGetPolicyOutput,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetPolicyInput,
  output: BatchGetPolicyOutput,
  errors: [],
}));
/**
 * Retrieves information about the specified policy.
 */
export const getPolicy: (
  input: GetPolicyInput,
) => effect.Effect<
  GetPolicyOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyInput,
  output: GetPolicyOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns the tags associated with the specified Amazon Verified Permissions resource. In Verified Permissions, policy stores can be tagged.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => effect.Effect<
  ListTagsForResourceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPolicyTemplate: (
  input: CreatePolicyTemplateInput,
) => effect.Effect<
  CreatePolicyTemplateOutput,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyTemplateInput,
  output: CreatePolicyTemplateOutput,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Removes one or more tags from the specified Amazon Verified Permissions resource. In Verified Permissions, policy stores can be tagged.
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPolicyStore: (
  input: CreatePolicyStoreInput,
) => effect.Effect<
  CreatePolicyStoreOutput,
  ConflictException | ServiceQuotaExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyStoreInput,
  output: CreatePolicyStoreOutput,
  errors: [ConflictException, ServiceQuotaExceededException],
}));
/**
 * Creates or updates the policy schema in the specified policy store. The schema is used to validate any Cedar policies and policy templates submitted to the policy store. Any changes to the schema validate only policies and templates submitted after the schema change. Existing policies and templates are not re-evaluated against the changed schema. If you later update a policy, then it is evaluated against the new schema at that time.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const putSchema: (
  input: PutSchemaInput,
) => effect.Effect<
  PutSchemaOutput,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPolicy: (
  input: CreatePolicyInput,
) => effect.Effect<
  CreatePolicyOutput,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePolicy: (
  input: UpdatePolicyInput,
) => effect.Effect<
  UpdatePolicyOutput,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const isAuthorized: (
  input: IsAuthorizedInput,
) => effect.Effect<
  IsAuthorizedOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createIdentitySource: (
  input: CreateIdentitySourceInput,
) => effect.Effect<
  CreateIdentitySourceOutput,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIdentitySourceInput,
  output: CreateIdentitySourceOutput,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Retrieves the details about the specified identity source.
 */
export const getIdentitySource: (
  input: GetIdentitySourceInput,
) => effect.Effect<
  GetIdentitySourceOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentitySourceInput,
  output: GetIdentitySourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Updates the specified identity source to use a new identity provider (IdP), or to change the mapping of identities from the IdP to a different principal entity type.
 *
 * Verified Permissions is * eventually consistent *. It can take a few seconds for a new or changed element to propagate through the service and be visible in the results of other Verified Permissions operations.
 */
export const updateIdentitySource: (
  input: UpdateIdentitySourceInput,
) => effect.Effect<
  UpdateIdentitySourceOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIdentitySourceInput,
  output: UpdateIdentitySourceOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Returns a paginated list of all policies stored in the specified policy store.
 */
export const listPolicies: {
  (
    input: ListPoliciesInput,
  ): effect.Effect<
    ListPoliciesOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPoliciesInput,
  ) => stream.Stream<
    ListPoliciesOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPoliciesInput,
  ) => stream.Stream<
    PolicyItem,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPoliciesInput,
  output: ListPoliciesOutput,
  errors: [ResourceNotFoundException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "policies",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Makes a series of decisions about multiple authorization requests for one principal or resource. Each request contains the equivalent content of an `IsAuthorized` request: principal, action, resource, and context. Either the `principal` or the `resource` parameter must be identical across all requests. For example, Verified Permissions won't evaluate a pair of requests where `bob` views `photo1` and `alice` views `photo2`. Authorization of `bob` to view `photo1` and `photo2`, or `bob` and `alice` to view `photo1`, are valid batches.
 *
 * The request is evaluated against all policies in the specified policy store that match the entities that you declare. The result of the decisions is a series of `Allow` or `Deny` responses, along with the IDs of the policies that produced each decision.
 *
 * The `entities` of a `BatchIsAuthorized` API request can contain up to 100 principals and up to 100 resources. The `requests` of a `BatchIsAuthorized` API request can contain up to 30 requests.
 *
 * The `BatchIsAuthorized` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `verifiedpermissions:IsAuthorized` in their IAM policies.
 */
export const batchIsAuthorized: (
  input: BatchIsAuthorizedInput,
) => effect.Effect<
  BatchIsAuthorizedOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchIsAuthorizedInput,
  output: BatchIsAuthorizedOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns a paginated list of all of the identity sources defined in the specified policy store.
 */
export const listIdentitySources: {
  (
    input: ListIdentitySourcesInput,
  ): effect.Effect<
    ListIdentitySourcesOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdentitySourcesInput,
  ) => stream.Stream<
    ListIdentitySourcesOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdentitySourcesInput,
  ) => stream.Stream<
    IdentitySourceItem,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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

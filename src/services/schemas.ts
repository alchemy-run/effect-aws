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
const svc = T.AwsApiService({ sdkId: "schemas", serviceShapeName: "schemas" });
const auth = T.AwsAuthSigv4({ name: "schemas" });
const ver = T.ServiceVersion("2019-12-02");
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
              `https://schemas-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://schemas-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://schemas.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://schemas.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type __stringMin0Max256 = string;
export type __stringMin20Max1600 = string;
export type __string = string;
export type __stringMin1Max100000 = string;
export type GetDiscoveredSchemaVersionItemInput = string;
export type __integer = number;
export type SynthesizedJson__string = string;
export type __stringMin0Max36 = string;
export type __long = number;

//# Schemas
export type __listOfGetDiscoveredSchemaVersionItemInput = string[];
export const __listOfGetDiscoveredSchemaVersionItemInput = S.Array(S.String);
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateRegistryRequest {
  Description?: string;
  RegistryName: string;
  Tags?: Tags;
}
export const CreateRegistryRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/registries/name/{RegistryName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRegistryRequest",
}) as any as S.Schema<CreateRegistryRequest>;
export interface CreateSchemaRequest {
  Content: string;
  Description?: string;
  RegistryName: string;
  SchemaName: string;
  Tags?: Tags;
  Type: string;
}
export const CreateSchemaRequest = S.suspend(() =>
  S.Struct({
    Content: S.String,
    Description: S.optional(S.String),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Type: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/registries/name/{RegistryName}/schemas/name/{SchemaName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSchemaRequest",
}) as any as S.Schema<CreateSchemaRequest>;
export interface DeleteDiscovererRequest {
  DiscovererId: string;
}
export const DeleteDiscovererRequest = S.suspend(() =>
  S.Struct({ DiscovererId: S.String.pipe(T.HttpLabel("DiscovererId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/discoverers/id/{DiscovererId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDiscovererRequest",
}) as any as S.Schema<DeleteDiscovererRequest>;
export interface DeleteDiscovererResponse {}
export const DeleteDiscovererResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDiscovererResponse",
}) as any as S.Schema<DeleteDiscovererResponse>;
export interface DeleteRegistryRequest {
  RegistryName: string;
}
export const DeleteRegistryRequest = S.suspend(() =>
  S.Struct({ RegistryName: S.String.pipe(T.HttpLabel("RegistryName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/registries/name/{RegistryName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRegistryRequest",
}) as any as S.Schema<DeleteRegistryRequest>;
export interface DeleteRegistryResponse {}
export const DeleteRegistryResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteRegistryResponse" },
) as any as S.Schema<DeleteRegistryResponse>;
export interface DeleteResourcePolicyRequest {
  RegistryName?: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    RegistryName: S.optional(S.String).pipe(T.HttpQuery("registryName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteSchemaRequest {
  RegistryName: string;
  SchemaName: string;
}
export const DeleteSchemaRequest = S.suspend(() =>
  S.Struct({
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/registries/name/{RegistryName}/schemas/name/{SchemaName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSchemaRequest",
}) as any as S.Schema<DeleteSchemaRequest>;
export interface DeleteSchemaResponse {}
export const DeleteSchemaResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteSchemaResponse",
}) as any as S.Schema<DeleteSchemaResponse>;
export interface DeleteSchemaVersionRequest {
  RegistryName: string;
  SchemaName: string;
  SchemaVersion: string;
}
export const DeleteSchemaVersionRequest = S.suspend(() =>
  S.Struct({
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.String.pipe(T.HttpLabel("SchemaVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/registries/name/{RegistryName}/schemas/name/{SchemaName}/version/{SchemaVersion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSchemaVersionRequest",
}) as any as S.Schema<DeleteSchemaVersionRequest>;
export interface DeleteSchemaVersionResponse {}
export const DeleteSchemaVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSchemaVersionResponse",
}) as any as S.Schema<DeleteSchemaVersionResponse>;
export interface DescribeCodeBindingRequest {
  Language: string;
  RegistryName: string;
  SchemaName: string;
  SchemaVersion?: string;
}
export const DescribeCodeBindingRequest = S.suspend(() =>
  S.Struct({
    Language: S.String.pipe(T.HttpLabel("Language")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.optional(S.String).pipe(T.HttpQuery("schemaVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/registries/name/{RegistryName}/schemas/name/{SchemaName}/language/{Language}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCodeBindingRequest",
}) as any as S.Schema<DescribeCodeBindingRequest>;
export interface DescribeDiscovererRequest {
  DiscovererId: string;
}
export const DescribeDiscovererRequest = S.suspend(() =>
  S.Struct({ DiscovererId: S.String.pipe(T.HttpLabel("DiscovererId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/discoverers/id/{DiscovererId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDiscovererRequest",
}) as any as S.Schema<DescribeDiscovererRequest>;
export interface DescribeRegistryRequest {
  RegistryName: string;
}
export const DescribeRegistryRequest = S.suspend(() =>
  S.Struct({ RegistryName: S.String.pipe(T.HttpLabel("RegistryName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/registries/name/{RegistryName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRegistryRequest",
}) as any as S.Schema<DescribeRegistryRequest>;
export interface DescribeSchemaRequest {
  RegistryName: string;
  SchemaName: string;
  SchemaVersion?: string;
}
export const DescribeSchemaRequest = S.suspend(() =>
  S.Struct({
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.optional(S.String).pipe(T.HttpQuery("schemaVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/registries/name/{RegistryName}/schemas/name/{SchemaName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSchemaRequest",
}) as any as S.Schema<DescribeSchemaRequest>;
export interface ExportSchemaRequest {
  RegistryName: string;
  SchemaName: string;
  SchemaVersion?: string;
  Type: string;
}
export const ExportSchemaRequest = S.suspend(() =>
  S.Struct({
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.optional(S.String).pipe(T.HttpQuery("schemaVersion")),
    Type: S.String.pipe(T.HttpQuery("type")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/registries/name/{RegistryName}/schemas/name/{SchemaName}/export",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExportSchemaRequest",
}) as any as S.Schema<ExportSchemaRequest>;
export interface GetCodeBindingSourceRequest {
  Language: string;
  RegistryName: string;
  SchemaName: string;
  SchemaVersion?: string;
}
export const GetCodeBindingSourceRequest = S.suspend(() =>
  S.Struct({
    Language: S.String.pipe(T.HttpLabel("Language")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.optional(S.String).pipe(T.HttpQuery("schemaVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/registries/name/{RegistryName}/schemas/name/{SchemaName}/language/{Language}/source",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCodeBindingSourceRequest",
}) as any as S.Schema<GetCodeBindingSourceRequest>;
export interface GetDiscoveredSchemaRequest {
  Events: __listOfGetDiscoveredSchemaVersionItemInput;
  Type: string;
}
export const GetDiscoveredSchemaRequest = S.suspend(() =>
  S.Struct({
    Events: __listOfGetDiscoveredSchemaVersionItemInput,
    Type: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/discover" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDiscoveredSchemaRequest",
}) as any as S.Schema<GetDiscoveredSchemaRequest>;
export interface GetResourcePolicyRequest {
  RegistryName?: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    RegistryName: S.optional(S.String).pipe(T.HttpQuery("registryName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface ListDiscoverersRequest {
  DiscovererIdPrefix?: string;
  Limit?: number;
  NextToken?: string;
  SourceArnPrefix?: string;
}
export const ListDiscoverersRequest = S.suspend(() =>
  S.Struct({
    DiscovererIdPrefix: S.optional(S.String).pipe(
      T.HttpQuery("discovererIdPrefix"),
    ),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    SourceArnPrefix: S.optional(S.String).pipe(T.HttpQuery("sourceArnPrefix")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/discoverers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDiscoverersRequest",
}) as any as S.Schema<ListDiscoverersRequest>;
export interface ListRegistriesRequest {
  Limit?: number;
  NextToken?: string;
  RegistryNamePrefix?: string;
  Scope?: string;
}
export const ListRegistriesRequest = S.suspend(() =>
  S.Struct({
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RegistryNamePrefix: S.optional(S.String).pipe(
      T.HttpQuery("registryNamePrefix"),
    ),
    Scope: S.optional(S.String).pipe(T.HttpQuery("scope")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/registries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRegistriesRequest",
}) as any as S.Schema<ListRegistriesRequest>;
export interface ListSchemasRequest {
  Limit?: number;
  NextToken?: string;
  RegistryName: string;
  SchemaNamePrefix?: string;
}
export const ListSchemasRequest = S.suspend(() =>
  S.Struct({
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaNamePrefix: S.optional(S.String).pipe(
      T.HttpQuery("schemaNamePrefix"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/registries/name/{RegistryName}/schemas",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSchemasRequest",
}) as any as S.Schema<ListSchemasRequest>;
export interface ListSchemaVersionsRequest {
  Limit?: number;
  NextToken?: string;
  RegistryName: string;
  SchemaName: string;
}
export const ListSchemaVersionsRequest = S.suspend(() =>
  S.Struct({
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/registries/name/{RegistryName}/schemas/name/{SchemaName}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSchemaVersionsRequest",
}) as any as S.Schema<ListSchemaVersionsRequest>;
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
export interface PutCodeBindingRequest {
  Language: string;
  RegistryName: string;
  SchemaName: string;
  SchemaVersion?: string;
}
export const PutCodeBindingRequest = S.suspend(() =>
  S.Struct({
    Language: S.String.pipe(T.HttpLabel("Language")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.optional(S.String).pipe(T.HttpQuery("schemaVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/registries/name/{RegistryName}/schemas/name/{SchemaName}/language/{Language}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutCodeBindingRequest",
}) as any as S.Schema<PutCodeBindingRequest>;
export interface PutResourcePolicyRequest {
  Policy: string;
  RegistryName?: string;
  RevisionId?: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    Policy: S.String,
    RegistryName: S.optional(S.String).pipe(T.HttpQuery("registryName")),
    RevisionId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface SearchSchemasRequest {
  Keywords: string;
  Limit?: number;
  NextToken?: string;
  RegistryName: string;
}
export const SearchSchemasRequest = S.suspend(() =>
  S.Struct({
    Keywords: S.String.pipe(T.HttpQuery("keywords")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/registries/name/{RegistryName}/schemas/search",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchSchemasRequest",
}) as any as S.Schema<SearchSchemasRequest>;
export interface StartDiscovererRequest {
  DiscovererId: string;
}
export const StartDiscovererRequest = S.suspend(() =>
  S.Struct({ DiscovererId: S.String.pipe(T.HttpLabel("DiscovererId")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/discoverers/id/{DiscovererId}/start",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDiscovererRequest",
}) as any as S.Schema<StartDiscovererRequest>;
export interface StopDiscovererRequest {
  DiscovererId: string;
}
export const StopDiscovererRequest = S.suspend(() =>
  S.Struct({ DiscovererId: S.String.pipe(T.HttpLabel("DiscovererId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/discoverers/id/{DiscovererId}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopDiscovererRequest",
}) as any as S.Schema<StopDiscovererRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: Tags.pipe(T.JsonName("tags")),
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
  TagKeys: __listOf__string;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
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
export interface UpdateDiscovererRequest {
  Description?: string;
  DiscovererId: string;
  CrossAccount?: boolean;
}
export const UpdateDiscovererRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    DiscovererId: S.String.pipe(T.HttpLabel("DiscovererId")),
    CrossAccount: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/discoverers/id/{DiscovererId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDiscovererRequest",
}) as any as S.Schema<UpdateDiscovererRequest>;
export interface UpdateRegistryRequest {
  Description?: string;
  RegistryName: string;
}
export const UpdateRegistryRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/registries/name/{RegistryName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRegistryRequest",
}) as any as S.Schema<UpdateRegistryRequest>;
export interface UpdateSchemaRequest {
  ClientTokenId?: string;
  Content?: string;
  Description?: string;
  RegistryName: string;
  SchemaName: string;
  Type?: string;
}
export const UpdateSchemaRequest = S.suspend(() =>
  S.Struct({
    ClientTokenId: S.optional(S.String),
    Content: S.optional(S.String),
    Description: S.optional(S.String),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    Type: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/registries/name/{RegistryName}/schemas/name/{SchemaName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSchemaRequest",
}) as any as S.Schema<UpdateSchemaRequest>;
export interface CreateDiscovererRequest {
  Description?: string;
  SourceArn: string;
  CrossAccount?: boolean;
  Tags?: Tags;
}
export const CreateDiscovererRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    SourceArn: S.String,
    CrossAccount: S.optional(S.Boolean),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/discoverers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDiscovererRequest",
}) as any as S.Schema<CreateDiscovererRequest>;
export interface CreateRegistryResponse {
  Description?: string;
  RegistryArn?: string;
  RegistryName?: string;
  Tags?: Tags;
}
export const CreateRegistryResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    RegistryArn: S.optional(S.String),
    RegistryName: S.optional(S.String),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateRegistryResponse",
}) as any as S.Schema<CreateRegistryResponse>;
export interface CreateSchemaResponse {
  Description?: string;
  LastModified?: Date;
  SchemaArn?: string;
  SchemaName?: string;
  SchemaVersion?: string;
  Tags?: Tags;
  Type?: string;
  VersionCreatedDate?: Date;
}
export const CreateSchemaResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    SchemaVersion: S.optional(S.String),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Type: S.optional(S.String),
    VersionCreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateSchemaResponse",
}) as any as S.Schema<CreateSchemaResponse>;
export interface DescribeCodeBindingResponse {
  CreationDate?: Date;
  LastModified?: Date;
  SchemaVersion?: string;
  Status?: string;
}
export const DescribeCodeBindingResponse = S.suspend(() =>
  S.Struct({
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SchemaVersion: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeCodeBindingResponse",
}) as any as S.Schema<DescribeCodeBindingResponse>;
export interface DescribeDiscovererResponse {
  Description?: string;
  DiscovererArn?: string;
  DiscovererId?: string;
  SourceArn?: string;
  State?: string;
  CrossAccount?: boolean;
  Tags?: Tags;
}
export const DescribeDiscovererResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    DiscovererArn: S.optional(S.String),
    DiscovererId: S.optional(S.String),
    SourceArn: S.optional(S.String),
    State: S.optional(S.String),
    CrossAccount: S.optional(S.Boolean),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribeDiscovererResponse",
}) as any as S.Schema<DescribeDiscovererResponse>;
export interface DescribeRegistryResponse {
  Description?: string;
  RegistryArn?: string;
  RegistryName?: string;
  Tags?: Tags;
}
export const DescribeRegistryResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    RegistryArn: S.optional(S.String),
    RegistryName: S.optional(S.String),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribeRegistryResponse",
}) as any as S.Schema<DescribeRegistryResponse>;
export interface DescribeSchemaResponse {
  Content?: string;
  Description?: string;
  LastModified?: Date;
  SchemaArn?: string;
  SchemaName?: string;
  SchemaVersion?: string;
  Tags?: Tags;
  Type?: string;
  VersionCreatedDate?: Date;
}
export const DescribeSchemaResponse = S.suspend(() =>
  S.Struct({
    Content: S.optional(S.String),
    Description: S.optional(S.String),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    SchemaVersion: S.optional(S.String),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Type: S.optional(S.String),
    VersionCreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "DescribeSchemaResponse",
}) as any as S.Schema<DescribeSchemaResponse>;
export interface ExportSchemaResponse {
  Content?: string;
  SchemaArn?: string;
  SchemaName?: string;
  SchemaVersion?: string;
  Type?: string;
}
export const ExportSchemaResponse = S.suspend(() =>
  S.Struct({
    Content: S.optional(S.String),
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    SchemaVersion: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "ExportSchemaResponse",
}) as any as S.Schema<ExportSchemaResponse>;
export interface GetCodeBindingSourceResponse {
  Body?: T.StreamingOutputBody;
}
export const GetCodeBindingSourceResponse = S.suspend(() =>
  S.Struct({ Body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }),
).annotations({
  identifier: "GetCodeBindingSourceResponse",
}) as any as S.Schema<GetCodeBindingSourceResponse>;
export interface GetDiscoveredSchemaResponse {
  Content?: string;
}
export const GetDiscoveredSchemaResponse = S.suspend(() =>
  S.Struct({ Content: S.optional(S.String) }),
).annotations({
  identifier: "GetDiscoveredSchemaResponse",
}) as any as S.Schema<GetDiscoveredSchemaResponse>;
export interface GetResourcePolicyResponse {
  Policy?: string;
  RevisionId?: string;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String), RevisionId: S.optional(S.String) }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutCodeBindingResponse {
  CreationDate?: Date;
  LastModified?: Date;
  SchemaVersion?: string;
  Status?: string;
}
export const PutCodeBindingResponse = S.suspend(() =>
  S.Struct({
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SchemaVersion: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "PutCodeBindingResponse",
}) as any as S.Schema<PutCodeBindingResponse>;
export interface PutResourcePolicyResponse {
  Policy?: string;
  RevisionId?: string;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String), RevisionId: S.optional(S.String) }),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface StartDiscovererResponse {
  DiscovererId?: string;
  State?: string;
}
export const StartDiscovererResponse = S.suspend(() =>
  S.Struct({ DiscovererId: S.optional(S.String), State: S.optional(S.String) }),
).annotations({
  identifier: "StartDiscovererResponse",
}) as any as S.Schema<StartDiscovererResponse>;
export interface StopDiscovererResponse {
  DiscovererId?: string;
  State?: string;
}
export const StopDiscovererResponse = S.suspend(() =>
  S.Struct({ DiscovererId: S.optional(S.String), State: S.optional(S.String) }),
).annotations({
  identifier: "StopDiscovererResponse",
}) as any as S.Schema<StopDiscovererResponse>;
export interface UpdateDiscovererResponse {
  Description?: string;
  DiscovererArn?: string;
  DiscovererId?: string;
  SourceArn?: string;
  State?: string;
  CrossAccount?: boolean;
  Tags?: Tags;
}
export const UpdateDiscovererResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    DiscovererArn: S.optional(S.String),
    DiscovererId: S.optional(S.String),
    SourceArn: S.optional(S.String),
    State: S.optional(S.String),
    CrossAccount: S.optional(S.Boolean),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateDiscovererResponse",
}) as any as S.Schema<UpdateDiscovererResponse>;
export interface UpdateRegistryResponse {
  Description?: string;
  RegistryArn?: string;
  RegistryName?: string;
  Tags?: Tags;
}
export const UpdateRegistryResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    RegistryArn: S.optional(S.String),
    RegistryName: S.optional(S.String),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateRegistryResponse",
}) as any as S.Schema<UpdateRegistryResponse>;
export interface UpdateSchemaResponse {
  Description?: string;
  LastModified?: Date;
  SchemaArn?: string;
  SchemaName?: string;
  SchemaVersion?: string;
  Tags?: Tags;
  Type?: string;
  VersionCreatedDate?: Date;
}
export const UpdateSchemaResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    SchemaVersion: S.optional(S.String),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Type: S.optional(S.String),
    VersionCreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UpdateSchemaResponse",
}) as any as S.Schema<UpdateSchemaResponse>;
export interface DiscovererSummary {
  DiscovererArn?: string;
  DiscovererId?: string;
  SourceArn?: string;
  State?: string;
  CrossAccount?: boolean;
  Tags?: Tags;
}
export const DiscovererSummary = S.suspend(() =>
  S.Struct({
    DiscovererArn: S.optional(S.String),
    DiscovererId: S.optional(S.String),
    SourceArn: S.optional(S.String),
    State: S.optional(S.String),
    CrossAccount: S.optional(S.Boolean),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DiscovererSummary",
}) as any as S.Schema<DiscovererSummary>;
export type __listOfDiscovererSummary = DiscovererSummary[];
export const __listOfDiscovererSummary = S.Array(DiscovererSummary);
export interface RegistrySummary {
  RegistryArn?: string;
  RegistryName?: string;
  Tags?: Tags;
}
export const RegistrySummary = S.suspend(() =>
  S.Struct({
    RegistryArn: S.optional(S.String),
    RegistryName: S.optional(S.String),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "RegistrySummary",
}) as any as S.Schema<RegistrySummary>;
export type __listOfRegistrySummary = RegistrySummary[];
export const __listOfRegistrySummary = S.Array(RegistrySummary);
export interface SchemaSummary {
  LastModified?: Date;
  SchemaArn?: string;
  SchemaName?: string;
  Tags?: Tags;
  VersionCount?: number;
}
export const SchemaSummary = S.suspend(() =>
  S.Struct({
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    VersionCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "SchemaSummary",
}) as any as S.Schema<SchemaSummary>;
export type __listOfSchemaSummary = SchemaSummary[];
export const __listOfSchemaSummary = S.Array(SchemaSummary);
export interface SchemaVersionSummary {
  SchemaArn?: string;
  SchemaName?: string;
  SchemaVersion?: string;
  Type?: string;
}
export const SchemaVersionSummary = S.suspend(() =>
  S.Struct({
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    SchemaVersion: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "SchemaVersionSummary",
}) as any as S.Schema<SchemaVersionSummary>;
export type __listOfSchemaVersionSummary = SchemaVersionSummary[];
export const __listOfSchemaVersionSummary = S.Array(SchemaVersionSummary);
export interface CreateDiscovererResponse {
  Description?: string;
  DiscovererArn?: string;
  DiscovererId?: string;
  SourceArn?: string;
  State?: string;
  CrossAccount?: boolean;
  Tags?: Tags;
}
export const CreateDiscovererResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    DiscovererArn: S.optional(S.String),
    DiscovererId: S.optional(S.String),
    SourceArn: S.optional(S.String),
    State: S.optional(S.String),
    CrossAccount: S.optional(S.Boolean),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateDiscovererResponse",
}) as any as S.Schema<CreateDiscovererResponse>;
export interface ListDiscoverersResponse {
  Discoverers?: __listOfDiscovererSummary;
  NextToken?: string;
}
export const ListDiscoverersResponse = S.suspend(() =>
  S.Struct({
    Discoverers: S.optional(__listOfDiscovererSummary),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDiscoverersResponse",
}) as any as S.Schema<ListDiscoverersResponse>;
export interface ListRegistriesResponse {
  NextToken?: string;
  Registries?: __listOfRegistrySummary;
}
export const ListRegistriesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Registries: S.optional(__listOfRegistrySummary),
  }),
).annotations({
  identifier: "ListRegistriesResponse",
}) as any as S.Schema<ListRegistriesResponse>;
export interface ListSchemasResponse {
  NextToken?: string;
  Schemas?: __listOfSchemaSummary;
}
export const ListSchemasResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Schemas: S.optional(__listOfSchemaSummary),
  }),
).annotations({
  identifier: "ListSchemasResponse",
}) as any as S.Schema<ListSchemasResponse>;
export interface ListSchemaVersionsResponse {
  NextToken?: string;
  SchemaVersions?: __listOfSchemaVersionSummary;
}
export const ListSchemaVersionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    SchemaVersions: S.optional(__listOfSchemaVersionSummary),
  }),
).annotations({
  identifier: "ListSchemaVersionsResponse",
}) as any as S.Schema<ListSchemaVersionsResponse>;
export interface SearchSchemaVersionSummary {
  CreatedDate?: Date;
  SchemaVersion?: string;
  Type?: string;
}
export const SearchSchemaVersionSummary = S.suspend(() =>
  S.Struct({
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SchemaVersion: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchSchemaVersionSummary",
}) as any as S.Schema<SearchSchemaVersionSummary>;
export type __listOfSearchSchemaVersionSummary = SearchSchemaVersionSummary[];
export const __listOfSearchSchemaVersionSummary = S.Array(
  SearchSchemaVersionSummary,
);
export interface SearchSchemaSummary {
  RegistryName?: string;
  SchemaArn?: string;
  SchemaName?: string;
  SchemaVersions?: __listOfSearchSchemaVersionSummary;
}
export const SearchSchemaSummary = S.suspend(() =>
  S.Struct({
    RegistryName: S.optional(S.String),
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    SchemaVersions: S.optional(__listOfSearchSchemaVersionSummary),
  }),
).annotations({
  identifier: "SearchSchemaSummary",
}) as any as S.Schema<SearchSchemaSummary>;
export type __listOfSearchSchemaSummary = SearchSchemaSummary[];
export const __listOfSearchSchemaSummary = S.Array(SearchSchemaSummary);
export interface SearchSchemasResponse {
  NextToken?: string;
  Schemas?: __listOfSearchSchemaSummary;
}
export const SearchSchemasResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Schemas: S.optional(__listOfSearchSchemaSummary),
  }),
).annotations({
  identifier: "SearchSchemasResponse",
}) as any as S.Schema<SearchSchemasResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Code: S.String, Message: S.String },
).pipe(C.withBadRequestError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Code: S.String, Message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Code: S.String, Message: S.String },
).pipe(C.withConflictError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { Code: S.String, Message: S.String },
).pipe(C.withServerError) {}
export class GoneException extends S.TaggedError<GoneException>()(
  "GoneException",
  { Code: S.String, Message: S.String },
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Code: S.String, Message: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Code: S.String, Message: S.String },
).pipe(C.withServerError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { Code: S.String, Message: S.String },
).pipe(C.withAuthError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Code: S.String, Message: S.String },
).pipe(C.withThrottlingError) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { Code: S.String, Message: S.String },
) {}

//# Operations
/**
 * Get tags for resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Updates the schema definition
 *
 * Inactive schemas will be deleted after two years.
 */
export const updateSchema: (
  input: UpdateSchemaRequest,
) => Effect.Effect<
  UpdateSchemaResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSchemaRequest,
  output: UpdateSchemaResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Add tags to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Removes tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Creates a schema definition.
 *
 * Inactive schemas will be deleted after two years.
 */
export const createSchema: (
  input: CreateSchemaRequest,
) => Effect.Effect<
  CreateSchemaResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSchemaRequest,
  output: CreateSchemaResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
  ],
}));
/**
 * Search the schemas
 */
export const searchSchemas: {
  (
    input: SearchSchemasRequest,
  ): Effect.Effect<
    SearchSchemasResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchSchemasRequest,
  ) => Stream.Stream<
    SearchSchemasResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchSchemasRequest,
  ) => Stream.Stream<
    SearchSchemaSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchSchemasRequest,
  output: SearchSchemasResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Schemas",
    pageSize: "Limit",
  } as const,
}));
/**
 * Put code binding URI
 */
export const putCodeBinding: (
  input: PutCodeBindingRequest,
) => Effect.Effect<
  PutCodeBindingResponse,
  | BadRequestException
  | ForbiddenException
  | GoneException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutCodeBindingRequest,
  output: PutCodeBindingResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    GoneException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * The name of the policy.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => Effect.Effect<
  PutResourcePolicyResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | PreconditionFailedException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    PreconditionFailedException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Provides a list of the schema versions and related information.
 */
export const listSchemaVersions: {
  (
    input: ListSchemaVersionsRequest,
  ): Effect.Effect<
    ListSchemaVersionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchemaVersionsRequest,
  ) => Stream.Stream<
    ListSchemaVersionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchemaVersionsRequest,
  ) => Stream.Stream<
    SchemaVersionSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSchemaVersionsRequest,
  output: ListSchemaVersionsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SchemaVersions",
    pageSize: "Limit",
  } as const,
}));
/**
 * Describes the discoverer.
 */
export const describeDiscoverer: (
  input: DescribeDiscovererRequest,
) => Effect.Effect<
  DescribeDiscovererResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDiscovererRequest,
  output: DescribeDiscovererResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Describes the registry.
 */
export const describeRegistry: (
  input: DescribeRegistryRequest,
) => Effect.Effect<
  DescribeRegistryResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRegistryRequest,
  output: DescribeRegistryResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieve the schema definition.
 */
export const describeSchema: (
  input: DescribeSchemaRequest,
) => Effect.Effect<
  DescribeSchemaResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSchemaRequest,
  output: DescribeSchemaResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves the resource-based policy attached to a given registry.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => Effect.Effect<
  GetResourcePolicyResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Starts the discoverer
 */
export const startDiscoverer: (
  input: StartDiscovererRequest,
) => Effect.Effect<
  StartDiscovererResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDiscovererRequest,
  output: StartDiscovererResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Stops the discoverer
 */
export const stopDiscoverer: (
  input: StopDiscovererRequest,
) => Effect.Effect<
  StopDiscovererResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDiscovererRequest,
  output: StopDiscovererResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the discoverer
 */
export const updateDiscoverer: (
  input: UpdateDiscovererRequest,
) => Effect.Effect<
  UpdateDiscovererResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDiscovererRequest,
  output: UpdateDiscovererResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a registry.
 */
export const updateRegistry: (
  input: UpdateRegistryRequest,
) => Effect.Effect<
  UpdateRegistryResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRegistryRequest,
  output: UpdateRegistryResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a Registry.
 */
export const deleteRegistry: (
  input: DeleteRegistryRequest,
) => Effect.Effect<
  DeleteRegistryResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRegistryRequest,
  output: DeleteRegistryResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Delete the resource-based policy attached to the specified registry.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => Effect.Effect<
  DeleteResourcePolicyResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Delete a schema definition.
 */
export const deleteSchema: (
  input: DeleteSchemaRequest,
) => Effect.Effect<
  DeleteSchemaResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSchemaRequest,
  output: DeleteSchemaResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Delete the schema version definition
 */
export const deleteSchemaVersion: (
  input: DeleteSchemaVersionRequest,
) => Effect.Effect<
  DeleteSchemaVersionResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSchemaVersionRequest,
  output: DeleteSchemaVersionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * List the discoverers.
 */
export const listDiscoverers: {
  (
    input: ListDiscoverersRequest,
  ): Effect.Effect<
    ListDiscoverersResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDiscoverersRequest,
  ) => Stream.Stream<
    ListDiscoverersResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDiscoverersRequest,
  ) => Stream.Stream<
    DiscovererSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDiscoverersRequest,
  output: ListDiscoverersResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Discoverers",
    pageSize: "Limit",
  } as const,
}));
/**
 * List the registries.
 */
export const listRegistries: {
  (
    input: ListRegistriesRequest,
  ): Effect.Effect<
    ListRegistriesResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRegistriesRequest,
  ) => Stream.Stream<
    ListRegistriesResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRegistriesRequest,
  ) => Stream.Stream<
    RegistrySummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRegistriesRequest,
  output: ListRegistriesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Registries",
    pageSize: "Limit",
  } as const,
}));
/**
 * List the schemas.
 */
export const listSchemas: {
  (
    input: ListSchemasRequest,
  ): Effect.Effect<
    ListSchemasResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchemasRequest,
  ) => Stream.Stream<
    ListSchemasResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchemasRequest,
  ) => Stream.Stream<
    SchemaSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSchemasRequest,
  output: ListSchemasResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Schemas",
    pageSize: "Limit",
  } as const,
}));
/**
 * Creates a registry.
 */
export const createRegistry: (
  input: CreateRegistryRequest,
) => Effect.Effect<
  CreateRegistryResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRegistryRequest,
  output: CreateRegistryResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Get the discovered schema that was generated based on sampled events.
 */
export const getDiscoveredSchema: (
  input: GetDiscoveredSchemaRequest,
) => Effect.Effect<
  GetDiscoveredSchemaResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDiscoveredSchemaRequest,
  output: GetDiscoveredSchemaResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a discoverer.
 */
export const createDiscoverer: (
  input: CreateDiscovererRequest,
) => Effect.Effect<
  CreateDiscovererResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDiscovererRequest,
  output: CreateDiscovererResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a discoverer.
 */
export const deleteDiscoverer: (
  input: DeleteDiscovererRequest,
) => Effect.Effect<
  DeleteDiscovererResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDiscovererRequest,
  output: DeleteDiscovererResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Describe the code binding URI.
 */
export const describeCodeBinding: (
  input: DescribeCodeBindingRequest,
) => Effect.Effect<
  DescribeCodeBindingResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCodeBindingRequest,
  output: DescribeCodeBindingResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 *
 */
export const exportSchema: (
  input: ExportSchemaRequest,
) => Effect.Effect<
  ExportSchemaResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportSchemaRequest,
  output: ExportSchemaResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Get the code binding source URI.
 */
export const getCodeBindingSource: (
  input: GetCodeBindingSourceRequest,
) => Effect.Effect<
  GetCodeBindingSourceResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCodeBindingSourceRequest,
  output: GetCodeBindingSourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));

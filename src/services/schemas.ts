import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "schemas", serviceShapeName: "schemas" });
const auth = T.AwsAuthSigv4({ name: "schemas" });
const ver = T.ServiceVersion("2019-12-02");
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
                        url: "https://schemas-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://schemas-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://schemas.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://schemas.{Region}.{PartitionResult#dnsSuffix}",
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
export const __listOfGetDiscoveredSchemaVersionItemInput = S.Array(S.String);
export const __listOf__string = S.Array(S.String);
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateRegistryRequest extends S.Class<CreateRegistryRequest>(
  "CreateRegistryRequest",
)(
  {
    Description: S.optional(S.String),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/registries/name/{RegistryName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSchemaRequest extends S.Class<CreateSchemaRequest>(
  "CreateSchemaRequest",
)(
  {
    Content: S.String,
    Description: S.optional(S.String),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Type: S.String,
  },
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
) {}
export class DeleteDiscovererRequest extends S.Class<DeleteDiscovererRequest>(
  "DeleteDiscovererRequest",
)(
  { DiscovererId: S.String.pipe(T.HttpLabel("DiscovererId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/discoverers/id/{DiscovererId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDiscovererResponse extends S.Class<DeleteDiscovererResponse>(
  "DeleteDiscovererResponse",
)({}) {}
export class DeleteRegistryRequest extends S.Class<DeleteRegistryRequest>(
  "DeleteRegistryRequest",
)(
  { RegistryName: S.String.pipe(T.HttpLabel("RegistryName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/registries/name/{RegistryName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRegistryResponse extends S.Class<DeleteRegistryResponse>(
  "DeleteRegistryResponse",
)({}) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { RegistryName: S.optional(S.String).pipe(T.HttpQuery("registryName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}) {}
export class DeleteSchemaRequest extends S.Class<DeleteSchemaRequest>(
  "DeleteSchemaRequest",
)(
  {
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
  },
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
) {}
export class DeleteSchemaResponse extends S.Class<DeleteSchemaResponse>(
  "DeleteSchemaResponse",
)({}) {}
export class DeleteSchemaVersionRequest extends S.Class<DeleteSchemaVersionRequest>(
  "DeleteSchemaVersionRequest",
)(
  {
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.String.pipe(T.HttpLabel("SchemaVersion")),
  },
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
) {}
export class DeleteSchemaVersionResponse extends S.Class<DeleteSchemaVersionResponse>(
  "DeleteSchemaVersionResponse",
)({}) {}
export class DescribeCodeBindingRequest extends S.Class<DescribeCodeBindingRequest>(
  "DescribeCodeBindingRequest",
)(
  {
    Language: S.String.pipe(T.HttpLabel("Language")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.optional(S.String).pipe(T.HttpQuery("schemaVersion")),
  },
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
) {}
export class DescribeDiscovererRequest extends S.Class<DescribeDiscovererRequest>(
  "DescribeDiscovererRequest",
)(
  { DiscovererId: S.String.pipe(T.HttpLabel("DiscovererId")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/discoverers/id/{DiscovererId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRegistryRequest extends S.Class<DescribeRegistryRequest>(
  "DescribeRegistryRequest",
)(
  { RegistryName: S.String.pipe(T.HttpLabel("RegistryName")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/registries/name/{RegistryName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSchemaRequest extends S.Class<DescribeSchemaRequest>(
  "DescribeSchemaRequest",
)(
  {
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.optional(S.String).pipe(T.HttpQuery("schemaVersion")),
  },
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
) {}
export class ExportSchemaRequest extends S.Class<ExportSchemaRequest>(
  "ExportSchemaRequest",
)(
  {
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.optional(S.String).pipe(T.HttpQuery("schemaVersion")),
    Type: S.String.pipe(T.HttpQuery("type")),
  },
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
) {}
export class GetCodeBindingSourceRequest extends S.Class<GetCodeBindingSourceRequest>(
  "GetCodeBindingSourceRequest",
)(
  {
    Language: S.String.pipe(T.HttpLabel("Language")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.optional(S.String).pipe(T.HttpQuery("schemaVersion")),
  },
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
) {}
export class GetDiscoveredSchemaRequest extends S.Class<GetDiscoveredSchemaRequest>(
  "GetDiscoveredSchemaRequest",
)(
  { Events: __listOfGetDiscoveredSchemaVersionItemInput, Type: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v1/discover" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { RegistryName: S.optional(S.String).pipe(T.HttpQuery("registryName")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDiscoverersRequest extends S.Class<ListDiscoverersRequest>(
  "ListDiscoverersRequest",
)(
  {
    DiscovererIdPrefix: S.optional(S.String).pipe(
      T.HttpQuery("discovererIdPrefix"),
    ),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    SourceArnPrefix: S.optional(S.String).pipe(T.HttpQuery("sourceArnPrefix")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/discoverers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRegistriesRequest extends S.Class<ListRegistriesRequest>(
  "ListRegistriesRequest",
)(
  {
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RegistryNamePrefix: S.optional(S.String).pipe(
      T.HttpQuery("registryNamePrefix"),
    ),
    Scope: S.optional(S.String).pipe(T.HttpQuery("scope")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/registries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSchemasRequest extends S.Class<ListSchemasRequest>(
  "ListSchemasRequest",
)(
  {
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaNamePrefix: S.optional(S.String).pipe(
      T.HttpQuery("schemaNamePrefix"),
    ),
  },
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
) {}
export class ListSchemaVersionsRequest extends S.Class<ListSchemaVersionsRequest>(
  "ListSchemaVersionsRequest",
)(
  {
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
  },
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
) {}
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
export class PutCodeBindingRequest extends S.Class<PutCodeBindingRequest>(
  "PutCodeBindingRequest",
)(
  {
    Language: S.String.pipe(T.HttpLabel("Language")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    SchemaVersion: S.optional(S.String).pipe(T.HttpQuery("schemaVersion")),
  },
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
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  {
    Policy: S.String,
    RegistryName: S.optional(S.String).pipe(T.HttpQuery("registryName")),
    RevisionId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchSchemasRequest extends S.Class<SearchSchemasRequest>(
  "SearchSchemasRequest",
)(
  {
    Keywords: S.String.pipe(T.HttpQuery("keywords")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
  },
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
) {}
export class StartDiscovererRequest extends S.Class<StartDiscovererRequest>(
  "StartDiscovererRequest",
)(
  { DiscovererId: S.String.pipe(T.HttpLabel("DiscovererId")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/discoverers/id/{DiscovererId}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopDiscovererRequest extends S.Class<StopDiscovererRequest>(
  "StopDiscovererRequest",
)(
  { DiscovererId: S.String.pipe(T.HttpLabel("DiscovererId")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/discoverers/id/{DiscovererId}/stop" }),
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
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: Tags.pipe(T.JsonName("tags")),
  },
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
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
export class UpdateDiscovererRequest extends S.Class<UpdateDiscovererRequest>(
  "UpdateDiscovererRequest",
)(
  {
    Description: S.optional(S.String),
    DiscovererId: S.String.pipe(T.HttpLabel("DiscovererId")),
    CrossAccount: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/discoverers/id/{DiscovererId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRegistryRequest extends S.Class<UpdateRegistryRequest>(
  "UpdateRegistryRequest",
)(
  {
    Description: S.optional(S.String),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/registries/name/{RegistryName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSchemaRequest extends S.Class<UpdateSchemaRequest>(
  "UpdateSchemaRequest",
)(
  {
    ClientTokenId: S.optional(S.String),
    Content: S.optional(S.String),
    Description: S.optional(S.String),
    RegistryName: S.String.pipe(T.HttpLabel("RegistryName")),
    SchemaName: S.String.pipe(T.HttpLabel("SchemaName")),
    Type: S.optional(S.String),
  },
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
) {}
export class CreateDiscovererRequest extends S.Class<CreateDiscovererRequest>(
  "CreateDiscovererRequest",
)(
  {
    Description: S.optional(S.String),
    SourceArn: S.String,
    CrossAccount: S.optional(S.Boolean),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/discoverers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRegistryResponse extends S.Class<CreateRegistryResponse>(
  "CreateRegistryResponse",
)({
  Description: S.optional(S.String),
  RegistryArn: S.optional(S.String),
  RegistryName: S.optional(S.String),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class CreateSchemaResponse extends S.Class<CreateSchemaResponse>(
  "CreateSchemaResponse",
)({
  Description: S.optional(S.String),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  SchemaVersion: S.optional(S.String),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Type: S.optional(S.String),
  VersionCreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class DescribeCodeBindingResponse extends S.Class<DescribeCodeBindingResponse>(
  "DescribeCodeBindingResponse",
)({
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SchemaVersion: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class DescribeDiscovererResponse extends S.Class<DescribeDiscovererResponse>(
  "DescribeDiscovererResponse",
)({
  Description: S.optional(S.String),
  DiscovererArn: S.optional(S.String),
  DiscovererId: S.optional(S.String),
  SourceArn: S.optional(S.String),
  State: S.optional(S.String),
  CrossAccount: S.optional(S.Boolean),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class DescribeRegistryResponse extends S.Class<DescribeRegistryResponse>(
  "DescribeRegistryResponse",
)({
  Description: S.optional(S.String),
  RegistryArn: S.optional(S.String),
  RegistryName: S.optional(S.String),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class DescribeSchemaResponse extends S.Class<DescribeSchemaResponse>(
  "DescribeSchemaResponse",
)({
  Content: S.optional(S.String),
  Description: S.optional(S.String),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  SchemaVersion: S.optional(S.String),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Type: S.optional(S.String),
  VersionCreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ExportSchemaResponse extends S.Class<ExportSchemaResponse>(
  "ExportSchemaResponse",
)({
  Content: S.optional(S.String),
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  SchemaVersion: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export class GetCodeBindingSourceResponse extends S.Class<GetCodeBindingSourceResponse>(
  "GetCodeBindingSourceResponse",
)({ Body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }) {}
export class GetDiscoveredSchemaResponse extends S.Class<GetDiscoveredSchemaResponse>(
  "GetDiscoveredSchemaResponse",
)({ Content: S.optional(S.String) }) {}
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({ Policy: S.optional(S.String), RevisionId: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags).pipe(T.JsonName("tags")) }) {}
export class PutCodeBindingResponse extends S.Class<PutCodeBindingResponse>(
  "PutCodeBindingResponse",
)({
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SchemaVersion: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({ Policy: S.optional(S.String), RevisionId: S.optional(S.String) }) {}
export class StartDiscovererResponse extends S.Class<StartDiscovererResponse>(
  "StartDiscovererResponse",
)({ DiscovererId: S.optional(S.String), State: S.optional(S.String) }) {}
export class StopDiscovererResponse extends S.Class<StopDiscovererResponse>(
  "StopDiscovererResponse",
)({ DiscovererId: S.optional(S.String), State: S.optional(S.String) }) {}
export class UpdateDiscovererResponse extends S.Class<UpdateDiscovererResponse>(
  "UpdateDiscovererResponse",
)({
  Description: S.optional(S.String),
  DiscovererArn: S.optional(S.String),
  DiscovererId: S.optional(S.String),
  SourceArn: S.optional(S.String),
  State: S.optional(S.String),
  CrossAccount: S.optional(S.Boolean),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class UpdateRegistryResponse extends S.Class<UpdateRegistryResponse>(
  "UpdateRegistryResponse",
)({
  Description: S.optional(S.String),
  RegistryArn: S.optional(S.String),
  RegistryName: S.optional(S.String),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class UpdateSchemaResponse extends S.Class<UpdateSchemaResponse>(
  "UpdateSchemaResponse",
)({
  Description: S.optional(S.String),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  SchemaVersion: S.optional(S.String),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Type: S.optional(S.String),
  VersionCreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class DiscovererSummary extends S.Class<DiscovererSummary>(
  "DiscovererSummary",
)({
  DiscovererArn: S.optional(S.String),
  DiscovererId: S.optional(S.String),
  SourceArn: S.optional(S.String),
  State: S.optional(S.String),
  CrossAccount: S.optional(S.Boolean),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfDiscovererSummary = S.Array(DiscovererSummary);
export class RegistrySummary extends S.Class<RegistrySummary>(
  "RegistrySummary",
)({
  RegistryArn: S.optional(S.String),
  RegistryName: S.optional(S.String),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfRegistrySummary = S.Array(RegistrySummary);
export class SchemaSummary extends S.Class<SchemaSummary>("SchemaSummary")({
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  VersionCount: S.optional(S.Number),
}) {}
export const __listOfSchemaSummary = S.Array(SchemaSummary);
export class SchemaVersionSummary extends S.Class<SchemaVersionSummary>(
  "SchemaVersionSummary",
)({
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  SchemaVersion: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const __listOfSchemaVersionSummary = S.Array(SchemaVersionSummary);
export class CreateDiscovererResponse extends S.Class<CreateDiscovererResponse>(
  "CreateDiscovererResponse",
)({
  Description: S.optional(S.String),
  DiscovererArn: S.optional(S.String),
  DiscovererId: S.optional(S.String),
  SourceArn: S.optional(S.String),
  State: S.optional(S.String),
  CrossAccount: S.optional(S.Boolean),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class ListDiscoverersResponse extends S.Class<ListDiscoverersResponse>(
  "ListDiscoverersResponse",
)({
  Discoverers: S.optional(__listOfDiscovererSummary),
  NextToken: S.optional(S.String),
}) {}
export class ListRegistriesResponse extends S.Class<ListRegistriesResponse>(
  "ListRegistriesResponse",
)({
  NextToken: S.optional(S.String),
  Registries: S.optional(__listOfRegistrySummary),
}) {}
export class ListSchemasResponse extends S.Class<ListSchemasResponse>(
  "ListSchemasResponse",
)({
  NextToken: S.optional(S.String),
  Schemas: S.optional(__listOfSchemaSummary),
}) {}
export class ListSchemaVersionsResponse extends S.Class<ListSchemaVersionsResponse>(
  "ListSchemaVersionsResponse",
)({
  NextToken: S.optional(S.String),
  SchemaVersions: S.optional(__listOfSchemaVersionSummary),
}) {}
export class SearchSchemaVersionSummary extends S.Class<SearchSchemaVersionSummary>(
  "SearchSchemaVersionSummary",
)({
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SchemaVersion: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const __listOfSearchSchemaVersionSummary = S.Array(
  SearchSchemaVersionSummary,
);
export class SearchSchemaSummary extends S.Class<SearchSchemaSummary>(
  "SearchSchemaSummary",
)({
  RegistryName: S.optional(S.String),
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  SchemaVersions: S.optional(__listOfSearchSchemaVersionSummary),
}) {}
export const __listOfSearchSchemaSummary = S.Array(SearchSchemaSummary);
export class SearchSchemasResponse extends S.Class<SearchSchemasResponse>(
  "SearchSchemasResponse",
)({
  NextToken: S.optional(S.String),
  Schemas: S.optional(__listOfSearchSchemaSummary),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Code: S.String, Message: S.String },
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Code: S.String, Message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Code: S.String, Message: S.String },
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { Code: S.String, Message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class GoneException extends S.TaggedError<GoneException>()(
  "GoneException",
  { Code: S.String, Message: S.String },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Code: S.String, Message: S.String },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Code: S.String, Message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { Code: S.String, Message: S.String },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Code: S.String, Message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { Code: S.String, Message: S.String },
) {}

//# Operations
/**
 * Get tags for resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchSchemas = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Put code binding URI
 */
export const putCodeBinding = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSchemaVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Describes the discoverer.
 */
export const describeDiscoverer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeRegistry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startDiscoverer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopDiscoverer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDiscoverer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRegistry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRegistry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Delete a schema definition.
 */
export const deleteSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSchemaVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDiscoverers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * List the registries.
 */
export const listRegistries = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * List the schemas.
 */
export const listSchemas = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Creates a registry.
 */
export const createRegistry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDiscoveredSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDiscoverer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDiscoverer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeCodeBinding = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const exportSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCodeBindingSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);

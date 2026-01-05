import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Lex Model Building Service",
  serviceShapeName: "AWSDeepSenseModelBuildingService",
});
const auth = T.AwsAuthSigv4({ name: "lex" });
const ver = T.ServiceVersion("2017-04-19");
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
                        url: "https://models.lex-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      ],
                      endpoint: {
                        url: "https://models-fips.lex.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://models-fips.lex.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://models.lex-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://models.lex.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://models.lex.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws-us-gov",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://models.lex.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://models.lex.{Region}.{PartitionResult#dnsSuffix}",
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
export const BotVersions = S.Array(S.String);
export const IntentUtteranceList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CreateBotVersionRequest extends S.Class<CreateBotVersionRequest>(
  "CreateBotVersionRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")), checksum: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/bots/{name}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateIntentVersionRequest extends S.Class<CreateIntentVersionRequest>(
  "CreateIntentVersionRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")), checksum: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/intents/{name}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSlotTypeVersionRequest extends S.Class<CreateSlotTypeVersionRequest>(
  "CreateSlotTypeVersionRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")), checksum: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/slottypes/{name}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBotRequest extends S.Class<DeleteBotRequest>(
  "DeleteBotRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/bots/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBotResponse extends S.Class<DeleteBotResponse>(
  "DeleteBotResponse",
)({}) {}
export class DeleteBotAliasRequest extends S.Class<DeleteBotAliasRequest>(
  "DeleteBotAliasRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    botName: S.String.pipe(T.HttpLabel("botName")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/bots/{botName}/aliases/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBotAliasResponse extends S.Class<DeleteBotAliasResponse>(
  "DeleteBotAliasResponse",
)({}) {}
export class DeleteBotChannelAssociationRequest extends S.Class<DeleteBotChannelAssociationRequest>(
  "DeleteBotChannelAssociationRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/bots/{botName}/aliases/{botAlias}/channels/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBotChannelAssociationResponse extends S.Class<DeleteBotChannelAssociationResponse>(
  "DeleteBotChannelAssociationResponse",
)({}) {}
export class DeleteBotVersionRequest extends S.Class<DeleteBotVersionRequest>(
  "DeleteBotVersionRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    version: S.String.pipe(T.HttpLabel("version")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/bots/{name}/versions/{version}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBotVersionResponse extends S.Class<DeleteBotVersionResponse>(
  "DeleteBotVersionResponse",
)({}) {}
export class DeleteIntentRequest extends S.Class<DeleteIntentRequest>(
  "DeleteIntentRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/intents/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIntentResponse extends S.Class<DeleteIntentResponse>(
  "DeleteIntentResponse",
)({}) {}
export class DeleteIntentVersionRequest extends S.Class<DeleteIntentVersionRequest>(
  "DeleteIntentVersionRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    version: S.String.pipe(T.HttpLabel("version")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/intents/{name}/versions/{version}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIntentVersionResponse extends S.Class<DeleteIntentVersionResponse>(
  "DeleteIntentVersionResponse",
)({}) {}
export class DeleteSlotTypeRequest extends S.Class<DeleteSlotTypeRequest>(
  "DeleteSlotTypeRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/slottypes/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSlotTypeResponse extends S.Class<DeleteSlotTypeResponse>(
  "DeleteSlotTypeResponse",
)({}) {}
export class DeleteSlotTypeVersionRequest extends S.Class<DeleteSlotTypeVersionRequest>(
  "DeleteSlotTypeVersionRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    version: S.String.pipe(T.HttpLabel("version")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/slottypes/{name}/version/{version}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSlotTypeVersionResponse extends S.Class<DeleteSlotTypeVersionResponse>(
  "DeleteSlotTypeVersionResponse",
)({}) {}
export class DeleteUtterancesRequest extends S.Class<DeleteUtterancesRequest>(
  "DeleteUtterancesRequest",
)(
  {
    botName: S.String.pipe(T.HttpLabel("botName")),
    userId: S.String.pipe(T.HttpLabel("userId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/bots/{botName}/utterances/{userId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUtterancesResponse extends S.Class<DeleteUtterancesResponse>(
  "DeleteUtterancesResponse",
)({}) {}
export class GetBotRequest extends S.Class<GetBotRequest>("GetBotRequest")(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    versionOrAlias: S.String.pipe(T.HttpLabel("versionOrAlias")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/bots/{name}/versions/{versionOrAlias}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBotAliasRequest extends S.Class<GetBotAliasRequest>(
  "GetBotAliasRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    botName: S.String.pipe(T.HttpLabel("botName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/bots/{botName}/aliases/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBotAliasesRequest extends S.Class<GetBotAliasesRequest>(
  "GetBotAliasesRequest",
)(
  {
    botName: S.String.pipe(T.HttpLabel("botName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/bots/{botName}/aliases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBotChannelAssociationRequest extends S.Class<GetBotChannelAssociationRequest>(
  "GetBotChannelAssociationRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/bots/{botName}/aliases/{botAlias}/channels/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBotChannelAssociationsRequest extends S.Class<GetBotChannelAssociationsRequest>(
  "GetBotChannelAssociationsRequest",
)(
  {
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/bots/{botName}/aliases/{botAlias}/channels",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBotsRequest extends S.Class<GetBotsRequest>("GetBotsRequest")(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
  },
  T.all(T.Http({ method: "GET", uri: "/bots" }), svc, auth, proto, ver, rules),
) {}
export class GetBotVersionsRequest extends S.Class<GetBotVersionsRequest>(
  "GetBotVersionsRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/bots/{name}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBuiltinIntentRequest extends S.Class<GetBuiltinIntentRequest>(
  "GetBuiltinIntentRequest",
)(
  { signature: S.String.pipe(T.HttpLabel("signature")) },
  T.all(
    T.Http({ method: "GET", uri: "/builtins/intents/{signature}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBuiltinIntentsRequest extends S.Class<GetBuiltinIntentsRequest>(
  "GetBuiltinIntentsRequest",
)(
  {
    locale: S.optional(S.String).pipe(T.HttpQuery("locale")),
    signatureContains: S.optional(S.String).pipe(
      T.HttpQuery("signatureContains"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/builtins/intents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBuiltinSlotTypesRequest extends S.Class<GetBuiltinSlotTypesRequest>(
  "GetBuiltinSlotTypesRequest",
)(
  {
    locale: S.optional(S.String).pipe(T.HttpQuery("locale")),
    signatureContains: S.optional(S.String).pipe(
      T.HttpQuery("signatureContains"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/builtins/slottypes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExportRequest extends S.Class<GetExportRequest>(
  "GetExportRequest",
)(
  {
    name: S.String.pipe(T.HttpQuery("name")),
    version: S.String.pipe(T.HttpQuery("version")),
    resourceType: S.String.pipe(T.HttpQuery("resourceType")),
    exportType: S.String.pipe(T.HttpQuery("exportType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/exports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetImportRequest extends S.Class<GetImportRequest>(
  "GetImportRequest",
)(
  { importId: S.String.pipe(T.HttpLabel("importId")) },
  T.all(
    T.Http({ method: "GET", uri: "/imports/{importId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIntentRequest extends S.Class<GetIntentRequest>(
  "GetIntentRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    version: S.String.pipe(T.HttpLabel("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/intents/{name}/versions/{version}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIntentsRequest extends S.Class<GetIntentsRequest>(
  "GetIntentsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/intents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIntentVersionsRequest extends S.Class<GetIntentVersionsRequest>(
  "GetIntentVersionsRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/intents/{name}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMigrationRequest extends S.Class<GetMigrationRequest>(
  "GetMigrationRequest",
)(
  { migrationId: S.String.pipe(T.HttpLabel("migrationId")) },
  T.all(
    T.Http({ method: "GET", uri: "/migrations/{migrationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMigrationsRequest extends S.Class<GetMigrationsRequest>(
  "GetMigrationsRequest",
)(
  {
    sortByAttribute: S.optional(S.String).pipe(T.HttpQuery("sortByAttribute")),
    sortByOrder: S.optional(S.String).pipe(T.HttpQuery("sortByOrder")),
    v1BotNameContains: S.optional(S.String).pipe(
      T.HttpQuery("v1BotNameContains"),
    ),
    migrationStatusEquals: S.optional(S.String).pipe(
      T.HttpQuery("migrationStatusEquals"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/migrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSlotTypeRequest extends S.Class<GetSlotTypeRequest>(
  "GetSlotTypeRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    version: S.String.pipe(T.HttpLabel("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/slottypes/{name}/versions/{version}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSlotTypesRequest extends S.Class<GetSlotTypesRequest>(
  "GetSlotTypesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/slottypes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSlotTypeVersionsRequest extends S.Class<GetSlotTypeVersionsRequest>(
  "GetSlotTypeVersionsRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/slottypes/{name}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUtterancesViewRequest extends S.Class<GetUtterancesViewRequest>(
  "GetUtterancesViewRequest",
)(
  {
    botName: S.String.pipe(T.HttpLabel("botName")),
    botVersions: BotVersions.pipe(T.HttpQuery("bot_versions")),
    statusType: S.String.pipe(T.HttpQuery("status_type")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/bots/{botName}/utterances?view=aggregation",
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
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class StartImportRequest extends S.Class<StartImportRequest>(
  "StartImportRequest",
)(
  {
    payload: T.Blob,
    resourceType: S.String,
    mergeStrategy: S.String,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/imports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMigrationRequest extends S.Class<StartMigrationRequest>(
  "StartMigrationRequest",
)(
  {
    v1BotName: S.String,
    v1BotVersion: S.String,
    v2BotName: S.String,
    v2BotRole: S.String,
    migrationStrategy: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/migrations" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagList },
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
export const SlotUtteranceList = S.Array(S.String);
export const SynonymList = S.Array(S.String);
export const LocaleList = S.Array(S.String);
export const StringList = S.Array(S.String);
export class Intent extends S.Class<Intent>("Intent")({
  intentName: S.String,
  intentVersion: S.String,
}) {}
export const IntentList = S.Array(Intent);
export class Message extends S.Class<Message>("Message")({
  contentType: S.String,
  content: S.String,
  groupNumber: S.optional(S.Number),
}) {}
export const MessageList = S.Array(Message);
export class Statement extends S.Class<Statement>("Statement")({
  messages: MessageList,
  responseCard: S.optional(S.String),
}) {}
export class Prompt extends S.Class<Prompt>("Prompt")({
  messages: MessageList,
  maxAttempts: S.Number,
  responseCard: S.optional(S.String),
}) {}
export class FollowUpPrompt extends S.Class<FollowUpPrompt>("FollowUpPrompt")({
  prompt: Prompt,
  rejectionStatement: Statement,
}) {}
export class CodeHook extends S.Class<CodeHook>("CodeHook")({
  uri: S.String,
  messageVersion: S.String,
}) {}
export class FulfillmentActivity extends S.Class<FulfillmentActivity>(
  "FulfillmentActivity",
)({ type: S.String, codeHook: S.optional(CodeHook) }) {}
export class KendraConfiguration extends S.Class<KendraConfiguration>(
  "KendraConfiguration",
)({
  kendraIndex: S.String,
  queryFilterString: S.optional(S.String),
  role: S.String,
}) {}
export class InputContext extends S.Class<InputContext>("InputContext")({
  name: S.String,
}) {}
export const InputContextList = S.Array(InputContext);
export class OutputContext extends S.Class<OutputContext>("OutputContext")({
  name: S.String,
  timeToLiveInSeconds: S.Number,
  turnsToLive: S.Number,
}) {}
export const OutputContextList = S.Array(OutputContext);
export class EnumerationValue extends S.Class<EnumerationValue>(
  "EnumerationValue",
)({ value: S.String, synonyms: S.optional(SynonymList) }) {}
export const EnumerationValues = S.Array(EnumerationValue);
export class CreateBotVersionResponse extends S.Class<CreateBotVersionResponse>(
  "CreateBotVersionResponse",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  intents: S.optional(IntentList),
  clarificationPrompt: S.optional(Prompt),
  abortStatement: S.optional(Statement),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  idleSessionTTLInSeconds: S.optional(S.Number),
  voiceId: S.optional(S.String),
  checksum: S.optional(S.String),
  version: S.optional(S.String),
  locale: S.optional(S.String),
  childDirected: S.optional(S.Boolean),
  enableModelImprovements: S.optional(S.Boolean),
  detectSentiment: S.optional(S.Boolean),
}) {}
export class SlotDefaultValue extends S.Class<SlotDefaultValue>(
  "SlotDefaultValue",
)({ defaultValue: S.String }) {}
export const SlotDefaultValueList = S.Array(SlotDefaultValue);
export class SlotDefaultValueSpec extends S.Class<SlotDefaultValueSpec>(
  "SlotDefaultValueSpec",
)({ defaultValueList: SlotDefaultValueList }) {}
export class Slot extends S.Class<Slot>("Slot")({
  name: S.String,
  description: S.optional(S.String),
  slotConstraint: S.String,
  slotType: S.optional(S.String),
  slotTypeVersion: S.optional(S.String),
  valueElicitationPrompt: S.optional(Prompt),
  priority: S.optional(S.Number),
  sampleUtterances: S.optional(SlotUtteranceList),
  responseCard: S.optional(S.String),
  obfuscationSetting: S.optional(S.String),
  defaultValueSpec: S.optional(SlotDefaultValueSpec),
}) {}
export const SlotList = S.Array(Slot);
export class CreateIntentVersionResponse extends S.Class<CreateIntentVersionResponse>(
  "CreateIntentVersionResponse",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  slots: S.optional(SlotList),
  sampleUtterances: S.optional(IntentUtteranceList),
  confirmationPrompt: S.optional(Prompt),
  rejectionStatement: S.optional(Statement),
  followUpPrompt: S.optional(FollowUpPrompt),
  conclusionStatement: S.optional(Statement),
  dialogCodeHook: S.optional(CodeHook),
  fulfillmentActivity: S.optional(FulfillmentActivity),
  parentIntentSignature: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  version: S.optional(S.String),
  checksum: S.optional(S.String),
  kendraConfiguration: S.optional(KendraConfiguration),
  inputContexts: S.optional(InputContextList),
  outputContexts: S.optional(OutputContextList),
}) {}
export class SlotTypeRegexConfiguration extends S.Class<SlotTypeRegexConfiguration>(
  "SlotTypeRegexConfiguration",
)({ pattern: S.String }) {}
export class SlotTypeConfiguration extends S.Class<SlotTypeConfiguration>(
  "SlotTypeConfiguration",
)({ regexConfiguration: S.optional(SlotTypeRegexConfiguration) }) {}
export const SlotTypeConfigurations = S.Array(SlotTypeConfiguration);
export class CreateSlotTypeVersionResponse extends S.Class<CreateSlotTypeVersionResponse>(
  "CreateSlotTypeVersionResponse",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  enumerationValues: S.optional(EnumerationValues),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  version: S.optional(S.String),
  checksum: S.optional(S.String),
  valueSelectionStrategy: S.optional(S.String),
  parentSlotTypeSignature: S.optional(S.String),
  slotTypeConfigurations: S.optional(SlotTypeConfigurations),
}) {}
export class GetBotResponse extends S.Class<GetBotResponse>("GetBotResponse")({
  name: S.optional(S.String),
  description: S.optional(S.String),
  intents: S.optional(IntentList),
  enableModelImprovements: S.optional(S.Boolean),
  nluIntentConfidenceThreshold: S.optional(S.Number),
  clarificationPrompt: S.optional(Prompt),
  abortStatement: S.optional(Statement),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  idleSessionTTLInSeconds: S.optional(S.Number),
  voiceId: S.optional(S.String),
  checksum: S.optional(S.String),
  version: S.optional(S.String),
  locale: S.optional(S.String),
  childDirected: S.optional(S.Boolean),
  detectSentiment: S.optional(S.Boolean),
}) {}
export class BotMetadata extends S.Class<BotMetadata>("BotMetadata")({
  name: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  version: S.optional(S.String),
}) {}
export const BotMetadataList = S.Array(BotMetadata);
export class GetBotVersionsResponse extends S.Class<GetBotVersionsResponse>(
  "GetBotVersionsResponse",
)({ bots: S.optional(BotMetadataList), nextToken: S.optional(S.String) }) {}
export class GetExportResponse extends S.Class<GetExportResponse>(
  "GetExportResponse",
)({
  name: S.optional(S.String),
  version: S.optional(S.String),
  resourceType: S.optional(S.String),
  exportType: S.optional(S.String),
  exportStatus: S.optional(S.String),
  failureReason: S.optional(S.String),
  url: S.optional(S.String),
}) {}
export class GetImportResponse extends S.Class<GetImportResponse>(
  "GetImportResponse",
)({
  name: S.optional(S.String),
  resourceType: S.optional(S.String),
  mergeStrategy: S.optional(S.String),
  importId: S.optional(S.String),
  importStatus: S.optional(S.String),
  failureReason: S.optional(StringList),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetIntentResponse extends S.Class<GetIntentResponse>(
  "GetIntentResponse",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  slots: S.optional(SlotList),
  sampleUtterances: S.optional(IntentUtteranceList),
  confirmationPrompt: S.optional(Prompt),
  rejectionStatement: S.optional(Statement),
  followUpPrompt: S.optional(FollowUpPrompt),
  conclusionStatement: S.optional(Statement),
  dialogCodeHook: S.optional(CodeHook),
  fulfillmentActivity: S.optional(FulfillmentActivity),
  parentIntentSignature: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  version: S.optional(S.String),
  checksum: S.optional(S.String),
  kendraConfiguration: S.optional(KendraConfiguration),
  inputContexts: S.optional(InputContextList),
  outputContexts: S.optional(OutputContextList),
}) {}
export class IntentMetadata extends S.Class<IntentMetadata>("IntentMetadata")({
  name: S.optional(S.String),
  description: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  version: S.optional(S.String),
}) {}
export const IntentMetadataList = S.Array(IntentMetadata);
export class GetIntentVersionsResponse extends S.Class<GetIntentVersionsResponse>(
  "GetIntentVersionsResponse",
)({
  intents: S.optional(IntentMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class GetSlotTypeResponse extends S.Class<GetSlotTypeResponse>(
  "GetSlotTypeResponse",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  enumerationValues: S.optional(EnumerationValues),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  version: S.optional(S.String),
  checksum: S.optional(S.String),
  valueSelectionStrategy: S.optional(S.String),
  parentSlotTypeSignature: S.optional(S.String),
  slotTypeConfigurations: S.optional(SlotTypeConfigurations),
}) {}
export class SlotTypeMetadata extends S.Class<SlotTypeMetadata>(
  "SlotTypeMetadata",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  version: S.optional(S.String),
}) {}
export const SlotTypeMetadataList = S.Array(SlotTypeMetadata);
export class GetSlotTypeVersionsResponse extends S.Class<GetSlotTypeVersionsResponse>(
  "GetSlotTypeVersionsResponse",
)({
  slotTypes: S.optional(SlotTypeMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class StartImportResponse extends S.Class<StartImportResponse>(
  "StartImportResponse",
)({
  name: S.optional(S.String),
  resourceType: S.optional(S.String),
  mergeStrategy: S.optional(S.String),
  importId: S.optional(S.String),
  importStatus: S.optional(S.String),
  tags: S.optional(TagList),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class StartMigrationResponse extends S.Class<StartMigrationResponse>(
  "StartMigrationResponse",
)({
  v1BotName: S.optional(S.String),
  v1BotVersion: S.optional(S.String),
  v1BotLocale: S.optional(S.String),
  v2BotId: S.optional(S.String),
  v2BotRole: S.optional(S.String),
  migrationId: S.optional(S.String),
  migrationStrategy: S.optional(S.String),
  migrationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const MigrationAlertDetails = S.Array(S.String);
export const MigrationAlertReferenceURLs = S.Array(S.String);
export class LogSettingsRequest extends S.Class<LogSettingsRequest>(
  "LogSettingsRequest",
)({
  logType: S.String,
  destination: S.String,
  kmsKeyArn: S.optional(S.String),
  resourceArn: S.String,
}) {}
export const LogSettingsRequestList = S.Array(LogSettingsRequest);
export class LogSettingsResponse extends S.Class<LogSettingsResponse>(
  "LogSettingsResponse",
)({
  logType: S.optional(S.String),
  destination: S.optional(S.String),
  kmsKeyArn: S.optional(S.String),
  resourceArn: S.optional(S.String),
  resourcePrefix: S.optional(S.String),
}) {}
export const LogSettingsResponseList = S.Array(LogSettingsResponse);
export class ConversationLogsResponse extends S.Class<ConversationLogsResponse>(
  "ConversationLogsResponse",
)({
  logSettings: S.optional(LogSettingsResponseList),
  iamRoleArn: S.optional(S.String),
}) {}
export class BotAliasMetadata extends S.Class<BotAliasMetadata>(
  "BotAliasMetadata",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  botVersion: S.optional(S.String),
  botName: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  checksum: S.optional(S.String),
  conversationLogs: S.optional(ConversationLogsResponse),
}) {}
export const BotAliasMetadataList = S.Array(BotAliasMetadata);
export const ChannelConfigurationMap = S.Record({
  key: S.String,
  value: S.String,
});
export class BotChannelAssociation extends S.Class<BotChannelAssociation>(
  "BotChannelAssociation",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  botAlias: S.optional(S.String),
  botName: S.optional(S.String),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  type: S.optional(S.String),
  botConfiguration: S.optional(ChannelConfigurationMap),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
}) {}
export const BotChannelAssociationList = S.Array(BotChannelAssociation);
export class BuiltinIntentSlot extends S.Class<BuiltinIntentSlot>(
  "BuiltinIntentSlot",
)({ name: S.optional(S.String) }) {}
export const BuiltinIntentSlotList = S.Array(BuiltinIntentSlot);
export class BuiltinIntentMetadata extends S.Class<BuiltinIntentMetadata>(
  "BuiltinIntentMetadata",
)({
  signature: S.optional(S.String),
  supportedLocales: S.optional(LocaleList),
}) {}
export const BuiltinIntentMetadataList = S.Array(BuiltinIntentMetadata);
export class BuiltinSlotTypeMetadata extends S.Class<BuiltinSlotTypeMetadata>(
  "BuiltinSlotTypeMetadata",
)({
  signature: S.optional(S.String),
  supportedLocales: S.optional(LocaleList),
}) {}
export const BuiltinSlotTypeMetadataList = S.Array(BuiltinSlotTypeMetadata);
export class MigrationAlert extends S.Class<MigrationAlert>("MigrationAlert")({
  type: S.optional(S.String),
  message: S.optional(S.String),
  details: S.optional(MigrationAlertDetails),
  referenceURLs: S.optional(MigrationAlertReferenceURLs),
}) {}
export const MigrationAlerts = S.Array(MigrationAlert);
export class MigrationSummary extends S.Class<MigrationSummary>(
  "MigrationSummary",
)({
  migrationId: S.optional(S.String),
  v1BotName: S.optional(S.String),
  v1BotVersion: S.optional(S.String),
  v1BotLocale: S.optional(S.String),
  v2BotId: S.optional(S.String),
  v2BotRole: S.optional(S.String),
  migrationStatus: S.optional(S.String),
  migrationStrategy: S.optional(S.String),
  migrationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const MigrationSummaryList = S.Array(MigrationSummary);
export class ConversationLogsRequest extends S.Class<ConversationLogsRequest>(
  "ConversationLogsRequest",
)({ logSettings: LogSettingsRequestList, iamRoleArn: S.String }) {}
export class GetBotAliasesResponse extends S.Class<GetBotAliasesResponse>(
  "GetBotAliasesResponse",
)({
  BotAliases: S.optional(BotAliasMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class GetBotChannelAssociationResponse extends S.Class<GetBotChannelAssociationResponse>(
  "GetBotChannelAssociationResponse",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  botAlias: S.optional(S.String),
  botName: S.optional(S.String),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  type: S.optional(S.String),
  botConfiguration: S.optional(ChannelConfigurationMap),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
}) {}
export class GetBotChannelAssociationsResponse extends S.Class<GetBotChannelAssociationsResponse>(
  "GetBotChannelAssociationsResponse",
)({
  botChannelAssociations: S.optional(BotChannelAssociationList),
  nextToken: S.optional(S.String),
}) {}
export class GetBotsResponse extends S.Class<GetBotsResponse>(
  "GetBotsResponse",
)({ bots: S.optional(BotMetadataList), nextToken: S.optional(S.String) }) {}
export class GetBuiltinIntentResponse extends S.Class<GetBuiltinIntentResponse>(
  "GetBuiltinIntentResponse",
)({
  signature: S.optional(S.String),
  supportedLocales: S.optional(LocaleList),
  slots: S.optional(BuiltinIntentSlotList),
}) {}
export class GetBuiltinIntentsResponse extends S.Class<GetBuiltinIntentsResponse>(
  "GetBuiltinIntentsResponse",
)({
  intents: S.optional(BuiltinIntentMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class GetBuiltinSlotTypesResponse extends S.Class<GetBuiltinSlotTypesResponse>(
  "GetBuiltinSlotTypesResponse",
)({
  slotTypes: S.optional(BuiltinSlotTypeMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class GetIntentsResponse extends S.Class<GetIntentsResponse>(
  "GetIntentsResponse",
)({
  intents: S.optional(IntentMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class GetMigrationResponse extends S.Class<GetMigrationResponse>(
  "GetMigrationResponse",
)({
  migrationId: S.optional(S.String),
  v1BotName: S.optional(S.String),
  v1BotVersion: S.optional(S.String),
  v1BotLocale: S.optional(S.String),
  v2BotId: S.optional(S.String),
  v2BotRole: S.optional(S.String),
  migrationStatus: S.optional(S.String),
  migrationStrategy: S.optional(S.String),
  migrationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  alerts: S.optional(MigrationAlerts),
}) {}
export class GetMigrationsResponse extends S.Class<GetMigrationsResponse>(
  "GetMigrationsResponse",
)({
  migrationSummaries: S.optional(MigrationSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class GetSlotTypesResponse extends S.Class<GetSlotTypesResponse>(
  "GetSlotTypesResponse",
)({
  slotTypes: S.optional(SlotTypeMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class PutBotRequest extends S.Class<PutBotRequest>("PutBotRequest")(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    intents: S.optional(IntentList),
    enableModelImprovements: S.optional(S.Boolean),
    nluIntentConfidenceThreshold: S.optional(S.Number),
    clarificationPrompt: S.optional(Prompt),
    abortStatement: S.optional(Statement),
    idleSessionTTLInSeconds: S.optional(S.Number),
    voiceId: S.optional(S.String),
    checksum: S.optional(S.String),
    processBehavior: S.optional(S.String),
    locale: S.String,
    childDirected: S.Boolean,
    detectSentiment: S.optional(S.Boolean),
    createVersion: S.optional(S.Boolean),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/bots/{name}/versions/$LATEST" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutBotAliasRequest extends S.Class<PutBotAliasRequest>(
  "PutBotAliasRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    botVersion: S.String,
    botName: S.String.pipe(T.HttpLabel("botName")),
    checksum: S.optional(S.String),
    conversationLogs: S.optional(ConversationLogsRequest),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/bots/{botName}/aliases/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutSlotTypeRequest extends S.Class<PutSlotTypeRequest>(
  "PutSlotTypeRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    enumerationValues: S.optional(EnumerationValues),
    checksum: S.optional(S.String),
    valueSelectionStrategy: S.optional(S.String),
    createVersion: S.optional(S.Boolean),
    parentSlotTypeSignature: S.optional(S.String),
    slotTypeConfigurations: S.optional(SlotTypeConfigurations),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/slottypes/{name}/versions/$LATEST" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UtteranceData extends S.Class<UtteranceData>("UtteranceData")({
  utteranceString: S.optional(S.String),
  count: S.optional(S.Number),
  distinctUsers: S.optional(S.Number),
  firstUtteredDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUtteredDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ListOfUtterance = S.Array(UtteranceData);
export class UtteranceList extends S.Class<UtteranceList>("UtteranceList")({
  botVersion: S.optional(S.String),
  utterances: S.optional(ListOfUtterance),
}) {}
export const ListsOfUtterances = S.Array(UtteranceList);
export class GetBotAliasResponse extends S.Class<GetBotAliasResponse>(
  "GetBotAliasResponse",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  botVersion: S.optional(S.String),
  botName: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  checksum: S.optional(S.String),
  conversationLogs: S.optional(ConversationLogsResponse),
}) {}
export class GetUtterancesViewResponse extends S.Class<GetUtterancesViewResponse>(
  "GetUtterancesViewResponse",
)({
  botName: S.optional(S.String),
  utterances: S.optional(ListsOfUtterances),
}) {}
export class PutBotResponse extends S.Class<PutBotResponse>("PutBotResponse")({
  name: S.optional(S.String),
  description: S.optional(S.String),
  intents: S.optional(IntentList),
  enableModelImprovements: S.optional(S.Boolean),
  nluIntentConfidenceThreshold: S.optional(S.Number),
  clarificationPrompt: S.optional(Prompt),
  abortStatement: S.optional(Statement),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  idleSessionTTLInSeconds: S.optional(S.Number),
  voiceId: S.optional(S.String),
  checksum: S.optional(S.String),
  version: S.optional(S.String),
  locale: S.optional(S.String),
  childDirected: S.optional(S.Boolean),
  createVersion: S.optional(S.Boolean),
  detectSentiment: S.optional(S.Boolean),
  tags: S.optional(TagList),
}) {}
export class PutBotAliasResponse extends S.Class<PutBotAliasResponse>(
  "PutBotAliasResponse",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  botVersion: S.optional(S.String),
  botName: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  checksum: S.optional(S.String),
  conversationLogs: S.optional(ConversationLogsResponse),
  tags: S.optional(TagList),
}) {}
export class PutIntentRequest extends S.Class<PutIntentRequest>(
  "PutIntentRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    slots: S.optional(SlotList),
    sampleUtterances: S.optional(IntentUtteranceList),
    confirmationPrompt: S.optional(Prompt),
    rejectionStatement: S.optional(Statement),
    followUpPrompt: S.optional(FollowUpPrompt),
    conclusionStatement: S.optional(Statement),
    dialogCodeHook: S.optional(CodeHook),
    fulfillmentActivity: S.optional(FulfillmentActivity),
    parentIntentSignature: S.optional(S.String),
    checksum: S.optional(S.String),
    createVersion: S.optional(S.Boolean),
    kendraConfiguration: S.optional(KendraConfiguration),
    inputContexts: S.optional(InputContextList),
    outputContexts: S.optional(OutputContextList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/intents/{name}/versions/$LATEST" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutSlotTypeResponse extends S.Class<PutSlotTypeResponse>(
  "PutSlotTypeResponse",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  enumerationValues: S.optional(EnumerationValues),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  version: S.optional(S.String),
  checksum: S.optional(S.String),
  valueSelectionStrategy: S.optional(S.String),
  createVersion: S.optional(S.Boolean),
  parentSlotTypeSignature: S.optional(S.String),
  slotTypeConfigurations: S.optional(SlotTypeConfigurations),
}) {}
export class PutIntentResponse extends S.Class<PutIntentResponse>(
  "PutIntentResponse",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  slots: S.optional(SlotList),
  sampleUtterances: S.optional(IntentUtteranceList),
  confirmationPrompt: S.optional(Prompt),
  rejectionStatement: S.optional(Statement),
  followUpPrompt: S.optional(FollowUpPrompt),
  conclusionStatement: S.optional(Statement),
  dialogCodeHook: S.optional(CodeHook),
  fulfillmentActivity: S.optional(FulfillmentActivity),
  parentIntentSignature: S.optional(S.String),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  version: S.optional(S.String),
  checksum: S.optional(S.String),
  createVersion: S.optional(S.Boolean),
  kendraConfiguration: S.optional(KendraConfiguration),
  inputContexts: S.optional(InputContextList),
  outputContexts: S.optional(OutputContextList),
}) {}
export class ResourceReference extends S.Class<ResourceReference>(
  "ResourceReference",
)({ name: S.optional(S.String), version: S.optional(S.String) }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {
    referenceType: S.optional(S.String),
    exampleReference: S.optional(ResourceReference),
  },
) {}

//# Operations
/**
 * Use the `GetUtterancesView` operation to get information
 * about the utterances that your users have made to your bot. You can use
 * this list to tune the utterances that your bot responds to.
 *
 * For example, say that you have created a bot to order flowers.
 * After your users have used your bot for a while, use the
 * `GetUtterancesView` operation to see the requests that they
 * have made and whether they have been successful. You might find that the
 * utterance "I want flowers" is not being recognized. You could add this
 * utterance to the `OrderFlowers` intent so that your bot
 * recognizes that utterance.
 *
 * After you publish a new version of a bot, you can get information
 * about the old version and the new so that you can compare the performance
 * across the two versions.
 *
 * Utterance statistics are generated once a day. Data is available
 * for the last 15 days. You can request information for up to 5 versions of
 * your bot in each request. Amazon Lex returns the most frequent utterances
 * received by the bot in the last 15 days. The response contains information
 * about a maximum of 100 utterances for each version.
 *
 * If you set `childDirected` field to true when you
 * created your bot, if you are using slot obfuscation with one or more
 * slots, or if you opted out of participating in improving Amazon Lex, utterances
 * are not available.
 *
 * This operation requires permissions for the
 * `lex:GetUtterancesView` action.
 */
export const getUtterancesView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUtterancesViewRequest,
  output: GetUtterancesViewResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Returns a list of aliases for a specified Amazon Lex bot.
 *
 * This operation requires permissions for the
 * `lex:GetBotAliases` action.
 */
export const getBotAliases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBotAliasesRequest,
  output: GetBotAliasesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Returns a list of all of the channels associated with the
 * specified bot.
 *
 * The `GetBotChannelAssociations` operation requires
 * permissions for the `lex:GetBotChannelAssociations`
 * action.
 */
export const getBotChannelAssociations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBotChannelAssociationsRequest,
    output: GetBotChannelAssociationsResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Gets a list of built-in intents that meet the specified
 * criteria.
 *
 * This operation requires permission for the
 * `lex:GetBuiltinIntents` action.
 */
export const getBuiltinIntents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBuiltinIntentsRequest,
  output: GetBuiltinIntentsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Gets a list of built-in slot types that meet the specified
 * criteria.
 *
 * For a list of built-in slot types, see Slot Type Reference in the Alexa Skills
 * Kit.
 *
 * This operation requires permission for the
 * `lex:GetBuiltInSlotTypes` action.
 */
export const getBuiltinSlotTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBuiltinSlotTypesRequest,
  output: GetBuiltinSlotTypesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Gets a list of migrations between Amazon Lex V1 and Amazon Lex V2.
 */
export const getMigrations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMigrationsRequest,
  output: GetMigrationsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Starts a job to import a resource to Amazon Lex.
 */
export const startImport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportRequest,
  output: StartImportResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Returns metadata information for a specific bot. You must provide
 * the bot name and the bot version or alias.
 *
 * This operation requires permissions for the
 * `lex:GetBot` action.
 */
export const getBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBotRequest,
  output: GetBotResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Creates an Amazon Lex conversational bot or replaces an existing bot.
 * When you create or update a bot you are only required to specify a name, a
 * locale, and whether the bot is directed toward children under age 13. You
 * can use this to add intents later, or to remove intents from an existing
 * bot. When you create a bot with the minimum information, the bot is
 * created or updated but Amazon Lex returns the `` response
 * `FAILED`. You can build the bot after you add one or more
 * intents. For more information about Amazon Lex bots, see how-it-works.
 *
 * If you specify the name of an existing bot, the fields in the
 * request replace the existing values in the `$LATEST` version of
 * the bot. Amazon Lex removes any fields that you don't provide values for in the
 * request, except for the `idleTTLInSeconds` and
 * `privacySettings` fields, which are set to their default
 * values. If you don't specify values for required fields, Amazon Lex throws an
 * exception.
 *
 * This operation requires permissions for the `lex:PutBot`
 * action. For more information, see security-iam.
 */
export const putBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBotRequest,
  output: PutBotResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    PreconditionFailedException,
  ],
}));
/**
 * Creates an intent or replaces an existing intent.
 *
 * To define the interaction between the user and your bot, you use
 * one or more intents. For a pizza ordering bot, for example, you would
 * create an `OrderPizza` intent.
 *
 * To create an intent or replace an existing intent, you must provide
 * the following:
 *
 * - Intent name. For example, `OrderPizza`.
 *
 * - Sample utterances. For example, "Can I order a pizza, please."
 * and "I want to order a pizza."
 *
 * - Information to be gathered. You specify slot types for the
 * information that your bot will request from the user. You can specify
 * standard slot types, such as a date or a time, or custom slot types
 * such as the size and crust of a pizza.
 *
 * - How the intent will be fulfilled. You can provide a Lambda
 * function or configure the intent to return the intent information to
 * the client application. If you use a Lambda function, when all of the
 * intent information is available, Amazon Lex invokes your Lambda function.
 * If you configure your intent to return the intent information to the
 * client application.
 *
 * You can specify other optional information in the request, such
 * as:
 *
 * - A confirmation prompt to ask the user to confirm an intent. For
 * example, "Shall I order your pizza?"
 *
 * - A conclusion statement to send to the user after the intent has
 * been fulfilled. For example, "I placed your pizza order."
 *
 * - A follow-up prompt that asks the user for additional activity.
 * For example, asking "Do you want to order a drink with your
 * pizza?"
 *
 * If you specify an existing intent name to update the intent, Amazon Lex
 * replaces the values in the `$LATEST` version of the intent with
 * the values in the request. Amazon Lex removes fields that you don't provide in
 * the request. If you don't specify the required fields, Amazon Lex throws an
 * exception. When you update the `$LATEST` version of an intent,
 * the `status` field of any bot that uses the
 * `$LATEST` version of the intent is set to
 * `NOT_BUILT`.
 *
 * For more information, see how-it-works.
 *
 * This operation requires permissions for the
 * `lex:PutIntent` action.
 */
export const putIntent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutIntentRequest,
  output: PutIntentResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    PreconditionFailedException,
  ],
}));
/**
 * Returns information about an Amazon Lex bot alias. For more information
 * about aliases, see versioning-aliases.
 *
 * This operation requires permissions for the
 * `lex:GetBotAlias` action.
 */
export const getBotAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBotAliasRequest,
  output: GetBotAliasResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Returns information about the association between an Amazon Lex bot and
 * a messaging platform.
 *
 * This operation requires permissions for the
 * `lex:GetBotChannelAssociation` action.
 */
export const getBotChannelAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBotChannelAssociationRequest,
    output: GetBotChannelAssociationResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Returns bot information as follows:
 *
 * - If you provide the `nameContains` field, the
 * response includes information for the `$LATEST` version of
 * all bots whose name contains the specified string.
 *
 * - If you don't specify the `nameContains` field, the
 * operation returns information about the `$LATEST` version
 * of all of your bots.
 *
 * This operation requires permission for the `lex:GetBots`
 * action.
 */
export const getBots = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBotsRequest,
  output: GetBotsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Returns information about a built-in intent.
 *
 * This operation requires permission for the
 * `lex:GetBuiltinIntent` action.
 */
export const getBuiltinIntent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBuiltinIntentRequest,
  output: GetBuiltinIntentResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Returns intent information as follows:
 *
 * - If you specify the `nameContains` field, returns the
 * `$LATEST` version of all intents that contain the
 * specified string.
 *
 * - If you don't specify the `nameContains` field,
 * returns information about the `$LATEST` version of all
 * intents.
 *
 * The operation requires permission for the
 * `lex:GetIntents` action.
 */
export const getIntents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntentsRequest,
  output: GetIntentsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Provides details about an ongoing or complete migration from an
 * Amazon Lex V1 bot to an Amazon Lex V2 bot. Use this operation to view the migration
 * alerts and warnings related to the migration.
 */
export const getMigration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMigrationRequest,
  output: GetMigrationResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Returns slot type information as follows:
 *
 * - If you specify the `nameContains` field, returns the
 * `$LATEST` version of all slot types that contain the
 * specified string.
 *
 * - If you don't specify the `nameContains` field,
 * returns information about the `$LATEST` version of all slot
 * types.
 *
 * The operation requires permission for the
 * `lex:GetSlotTypes` action.
 */
export const getSlotTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSlotTypesRequest,
  output: GetSlotTypesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Starts migrating a bot from Amazon Lex V1 to Amazon Lex V2. Migrate your bot when
 * you want to take advantage of the new features of Amazon Lex V2.
 *
 * For more information, see Migrating a bot in the Amazon Lex
 * developer guide.
 */
export const startMigration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMigrationRequest,
  output: StartMigrationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Deletes the association between an Amazon Lex bot and a messaging
 * platform.
 *
 * This operation requires permission for the
 * `lex:DeleteBotChannelAssociation` action.
 */
export const deleteBotChannelAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBotChannelAssociationRequest,
    output: DeleteBotChannelAssociationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Adds the specified tags to the specified resource. If a tag key
 * already exists, the existing value is replaced with the new value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Removes tags from a bot, bot alias or bot channel.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Creates a new version of the bot based on the `$LATEST`
 * version. If the `$LATEST` version of this resource hasn't
 * changed since you created the last version, Amazon Lex doesn't create a new
 * version. It returns the last created version.
 *
 * You can update only the `$LATEST` version of the bot.
 * You can't update the numbered versions that you create with the
 * `CreateBotVersion` operation.
 *
 * When you create the first version of a bot, Amazon Lex sets the version
 * to 1. Subsequent versions increment by 1. For more information, see versioning-intro.
 *
 * This operation requires permission for the
 * `lex:CreateBotVersion` action.
 */
export const createBotVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotVersionRequest,
  output: CreateBotVersionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    PreconditionFailedException,
  ],
}));
/**
 * Creates a new version of an intent based on the
 * `$LATEST` version of the intent. If the `$LATEST`
 * version of this intent hasn't changed since you last updated it, Amazon Lex
 * doesn't create a new version. It returns the last version you
 * created.
 *
 * You can update only the `$LATEST` version of the
 * intent. You can't update the numbered versions that you create with the
 * `CreateIntentVersion` operation.
 *
 * When you create a version of an intent, Amazon Lex sets the version to
 * 1. Subsequent versions increment by 1. For more information, see versioning-intro.
 *
 * This operation requires permissions to perform the
 * `lex:CreateIntentVersion` action.
 */
export const createIntentVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIntentVersionRequest,
  output: CreateIntentVersionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    PreconditionFailedException,
  ],
}));
/**
 * Creates a new version of a slot type based on the
 * `$LATEST` version of the specified slot type. If the
 * `$LATEST` version of this resource has not changed since the
 * last version that you created, Amazon Lex doesn't create a new version. It
 * returns the last version that you created.
 *
 * You can update only the `$LATEST` version of a slot
 * type. You can't update the numbered versions that you create with the
 * `CreateSlotTypeVersion` operation.
 *
 * When you create a version of a slot type, Amazon Lex sets the version to
 * 1. Subsequent versions increment by 1. For more information, see versioning-intro.
 *
 * This operation requires permissions for the
 * `lex:CreateSlotTypeVersion` action.
 */
export const createSlotTypeVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSlotTypeVersionRequest,
    output: CreateSlotTypeVersionResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
      PreconditionFailedException,
    ],
  }),
);
/**
 * Gets information about all of the versions of a bot.
 *
 * The `GetBotVersions` operation returns a
 * `BotMetadata` object for each version of a bot. For example,
 * if a bot has three numbered versions, the `GetBotVersions`
 * operation returns four `BotMetadata` objects in the response,
 * one for each numbered version and one for the `$LATEST`
 * version.
 *
 * The `GetBotVersions` operation always returns at least
 * one version, the `$LATEST` version.
 *
 * This operation requires permissions for the
 * `lex:GetBotVersions` action.
 */
export const getBotVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBotVersionsRequest,
  output: GetBotVersionsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Exports the contents of a Amazon Lex resource in a specified format.
 */
export const getExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExportRequest,
  output: GetExportResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Gets information about an import job started with the
 * `StartImport` operation.
 */
export const getImport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportRequest,
  output: GetImportResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Returns information about an intent. In addition to the intent
 * name, you must specify the intent version.
 *
 * This operation requires permissions to perform the
 * `lex:GetIntent` action.
 */
export const getIntent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntentRequest,
  output: GetIntentResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Gets information about all of the versions of an intent.
 *
 * The `GetIntentVersions` operation returns an
 * `IntentMetadata` object for each version of an intent. For
 * example, if an intent has three numbered versions, the
 * `GetIntentVersions` operation returns four
 * `IntentMetadata` objects in the response, one for each
 * numbered version and one for the `$LATEST` version.
 *
 * The `GetIntentVersions` operation always returns at
 * least one version, the `$LATEST` version.
 *
 * This operation requires permissions for the
 * `lex:GetIntentVersions` action.
 */
export const getIntentVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntentVersionsRequest,
  output: GetIntentVersionsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Returns information about a specific version of a slot type. In
 * addition to specifying the slot type name, you must specify the slot type
 * version.
 *
 * This operation requires permissions for the
 * `lex:GetSlotType` action.
 */
export const getSlotType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSlotTypeRequest,
  output: GetSlotTypeResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Gets information about all versions of a slot type.
 *
 * The `GetSlotTypeVersions` operation returns a
 * `SlotTypeMetadata` object for each version of a slot type.
 * For example, if a slot type has three numbered versions, the
 * `GetSlotTypeVersions` operation returns four
 * `SlotTypeMetadata` objects in the response, one for each
 * numbered version and one for the `$LATEST` version.
 *
 * The `GetSlotTypeVersions` operation always returns at
 * least one version, the `$LATEST` version.
 *
 * This operation requires permissions for the
 * `lex:GetSlotTypeVersions` action.
 */
export const getSlotTypeVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSlotTypeVersionsRequest,
  output: GetSlotTypeVersionsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Gets a list of tags associated with the specified resource. Only bots,
 * bot aliases, and bot channels can have tags associated with them.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Deletes stored utterances.
 *
 * Amazon Lex stores the utterances that users send to your bot. Utterances
 * are stored for 15 days for use with the GetUtterancesView operation, and then stored indefinitely for use in improving the
 * ability of your bot to respond to user input.
 *
 * Use the `DeleteUtterances` operation to manually delete
 * stored utterances for a specific user. When you use the
 * `DeleteUtterances` operation, utterances stored for improving
 * your bot's ability to respond to user input are deleted immediately.
 * Utterances stored for use with the `GetUtterancesView`
 * operation are deleted after 15 days.
 *
 * This operation requires permissions for the
 * `lex:DeleteUtterances` action.
 */
export const deleteUtterances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUtterancesRequest,
  output: DeleteUtterancesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Creates an alias for the specified version of the bot or replaces
 * an alias for the specified bot. To change the version of the bot that the
 * alias points to, replace the alias. For more information about aliases,
 * see versioning-aliases.
 *
 * This operation requires permissions for the
 * `lex:PutBotAlias` action.
 */
export const putBotAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBotAliasRequest,
  output: PutBotAliasResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    PreconditionFailedException,
  ],
}));
/**
 * Creates a custom slot type or replaces an existing custom slot
 * type.
 *
 * To create a custom slot type, specify a name for the slot type and
 * a set of enumeration values, which are the values that a slot of this type
 * can assume. For more information, see how-it-works.
 *
 * If you specify the name of an existing slot type, the fields in the
 * request replace the existing values in the `$LATEST` version of
 * the slot type. Amazon Lex removes the fields that you don't provide in the
 * request. If you don't specify required fields, Amazon Lex throws an exception.
 * When you update the `$LATEST` version of a slot type, if a bot
 * uses the `$LATEST` version of an intent that contains the slot
 * type, the bot's `status` field is set to
 * `NOT_BUILT`.
 *
 * This operation requires permissions for the
 * `lex:PutSlotType` action.
 */
export const putSlotType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSlotTypeRequest,
  output: PutSlotTypeResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    PreconditionFailedException,
  ],
}));
/**
 * Deletes an alias for the specified bot.
 *
 * You can't delete an alias that is used in the association between a
 * bot and a messaging channel. If an alias is used in a channel association,
 * the `DeleteBot` operation returns a
 * `ResourceInUseException` exception that includes a reference
 * to the channel association that refers to the bot. You can remove the
 * reference to the alias by deleting the channel association. If you get the
 * same exception again, delete the referring association until the
 * `DeleteBotAlias` operation is successful.
 */
export const deleteBotAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotAliasRequest,
  output: DeleteBotAliasResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes a specific version of a bot. To delete all versions of a
 * bot, use the DeleteBot operation.
 *
 * This operation requires permissions for the
 * `lex:DeleteBotVersion` action.
 */
export const deleteBotVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotVersionRequest,
  output: DeleteBotVersionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes all versions of the intent, including the
 * `$LATEST` version. To delete a specific version of the
 * intent, use the DeleteIntentVersion operation.
 *
 * You can delete a version of an intent only if it is not
 * referenced. To delete an intent that is referred to in one or more bots
 * (see how-it-works), you must remove those references
 * first.
 *
 * If you get the `ResourceInUseException` exception, it
 * provides an example reference that shows where the intent is referenced.
 * To remove the reference to the intent, either update the bot or delete
 * it. If you get the same exception when you attempt to delete the intent
 * again, repeat until the intent has no references and the call to
 * `DeleteIntent` is successful.
 *
 * This operation requires permission for the
 * `lex:DeleteIntent` action.
 */
export const deleteIntent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntentRequest,
  output: DeleteIntentResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes a specific version of an intent. To delete all versions of
 * a intent, use the DeleteIntent operation.
 *
 * This operation requires permissions for the
 * `lex:DeleteIntentVersion` action.
 */
export const deleteIntentVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntentVersionRequest,
  output: DeleteIntentVersionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes all versions of the slot type, including the
 * `$LATEST` version. To delete a specific version of the slot
 * type, use the DeleteSlotTypeVersion operation.
 *
 * You can delete a version of a slot type only if it is not
 * referenced. To delete a slot type that is referred to in one or more
 * intents, you must remove those references first.
 *
 * If you get the `ResourceInUseException` exception,
 * the exception provides an example reference that shows the intent where
 * the slot type is referenced. To remove the reference to the slot type,
 * either update the intent or delete it. If you get the same exception
 * when you attempt to delete the slot type again, repeat until the slot
 * type has no references and the `DeleteSlotType` call is
 * successful.
 *
 * This operation requires permission for the
 * `lex:DeleteSlotType` action.
 */
export const deleteSlotType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSlotTypeRequest,
  output: DeleteSlotTypeResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes a specific version of a slot type. To delete all versions
 * of a slot type, use the DeleteSlotType operation.
 *
 * This operation requires permissions for the
 * `lex:DeleteSlotTypeVersion` action.
 */
export const deleteSlotTypeVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSlotTypeVersionRequest,
    output: DeleteSlotTypeVersionResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
      ResourceInUseException,
    ],
  }),
);
/**
 * Deletes all versions of the bot, including the `$LATEST`
 * version. To delete a specific version of the bot, use the DeleteBotVersion operation. The `DeleteBot`
 * operation doesn't immediately remove the bot schema. Instead, it is marked
 * for deletion and removed later.
 *
 * Amazon Lex stores utterances indefinitely for improving the ability of
 * your bot to respond to user inputs. These utterances are not removed when
 * the bot is deleted. To remove the utterances, use the DeleteUtterances operation.
 *
 * If a bot has an alias, you can't delete it. Instead, the
 * `DeleteBot` operation returns a
 * `ResourceInUseException` exception that includes a reference
 * to the alias that refers to the bot. To remove the reference to the bot,
 * delete the alias. If you get the same exception again, delete the
 * referring alias until the `DeleteBot` operation is
 * successful.
 *
 * This operation requires permissions for the
 * `lex:DeleteBot` action.
 */
export const deleteBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotRequest,
  output: DeleteBotResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));

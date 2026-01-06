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
  sdkId: "QApps",
  serviceShapeName: "QAppsService",
});
const auth = T.AwsAuthSigv4({ name: "qapps" });
const ver = T.ServiceVersion("2023-11-27");
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
                                url: "https://data.qapps-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://data.qapps-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://data.qapps.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://data.qapps.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type InstanceId = string;
export type UUID = string;
export type AppVersion = number;
export type Filename = string;
export type Title = string;
export type Description = string;
export type PageLimit = number;
export type PaginationToken = string;
export type AmazonResourceName = string;
export type TagKey = string;
export type SessionName = string;
export type InitialPrompt = string;
export type TagValue = string;
export type AppArn = string;
export type Placeholder = string;
export type Default = string;
export type Prompt = string;
export type PluginId = string;
export type ActionIdentifier = string;
export type UserId = string;
export type DocumentAttributeKey = string;
export type DocumentAttributeStringValue = string;
export type PlatoString = string;
export type Long = number;

//# Schemas
export type DeleteCategoryInputList = string[];
export const DeleteCategoryInputList = S.Array(S.String);
export type CategoryIdList = string[];
export const CategoryIdList = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface AssociateLibraryItemReviewInput {
  instanceId: string;
  libraryItemId: string;
}
export const AssociateLibraryItemReviewInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/catalog.associateItemRating" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateLibraryItemReviewInput",
}) as any as S.Schema<AssociateLibraryItemReviewInput>;
export interface AssociateLibraryItemReviewResponse {}
export const AssociateLibraryItemReviewResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateLibraryItemReviewResponse",
}) as any as S.Schema<AssociateLibraryItemReviewResponse>;
export interface AssociateQAppWithUserInput {
  instanceId: string;
  appId: string;
}
export const AssociateQAppWithUserInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/apps.install" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateQAppWithUserInput",
}) as any as S.Schema<AssociateQAppWithUserInput>;
export interface AssociateQAppWithUserResponse {}
export const AssociateQAppWithUserResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateQAppWithUserResponse",
}) as any as S.Schema<AssociateQAppWithUserResponse>;
export interface BatchDeleteCategoryInput {
  instanceId: string;
  categories: DeleteCategoryInputList;
}
export const BatchDeleteCategoryInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    categories: DeleteCategoryInputList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/catalog.deleteCategories" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteCategoryInput",
}) as any as S.Schema<BatchDeleteCategoryInput>;
export interface BatchDeleteCategoryResponse {}
export const BatchDeleteCategoryResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "BatchDeleteCategoryResponse",
}) as any as S.Schema<BatchDeleteCategoryResponse>;
export interface CreateLibraryItemInput {
  instanceId: string;
  appId: string;
  appVersion: number;
  categories: CategoryIdList;
}
export const CreateLibraryItemInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String,
    appVersion: S.Number,
    categories: CategoryIdList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/catalog.createItem" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLibraryItemInput",
}) as any as S.Schema<CreateLibraryItemInput>;
export interface CreatePresignedUrlInput {
  instanceId: string;
  cardId: string;
  appId: string;
  fileContentsSha256: string;
  fileName: string;
  scope: string;
  sessionId?: string;
}
export const CreatePresignedUrlInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    cardId: S.String,
    appId: S.String,
    fileContentsSha256: S.String,
    fileName: S.String,
    scope: S.String,
    sessionId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/apps.createPresignedUrl" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePresignedUrlInput",
}) as any as S.Schema<CreatePresignedUrlInput>;
export interface DeleteLibraryItemInput {
  instanceId: string;
  libraryItemId: string;
}
export const DeleteLibraryItemInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/catalog.deleteItem" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLibraryItemInput",
}) as any as S.Schema<DeleteLibraryItemInput>;
export interface DeleteLibraryItemResponse {}
export const DeleteLibraryItemResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLibraryItemResponse",
}) as any as S.Schema<DeleteLibraryItemResponse>;
export interface DeleteQAppInput {
  instanceId: string;
  appId: string;
}
export const DeleteQAppInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/apps.delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteQAppInput",
}) as any as S.Schema<DeleteQAppInput>;
export interface DeleteQAppResponse {}
export const DeleteQAppResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteQAppResponse",
}) as any as S.Schema<DeleteQAppResponse>;
export interface DescribeQAppPermissionsInput {
  instanceId: string;
  appId: string;
}
export const DescribeQAppPermissionsInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String.pipe(T.HttpQuery("appId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/apps.describeQAppPermissions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeQAppPermissionsInput",
}) as any as S.Schema<DescribeQAppPermissionsInput>;
export interface DisassociateLibraryItemReviewInput {
  instanceId: string;
  libraryItemId: string;
}
export const DisassociateLibraryItemReviewInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/catalog.disassociateItemRating" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateLibraryItemReviewInput",
}) as any as S.Schema<DisassociateLibraryItemReviewInput>;
export interface DisassociateLibraryItemReviewResponse {}
export const DisassociateLibraryItemReviewResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateLibraryItemReviewResponse",
}) as any as S.Schema<DisassociateLibraryItemReviewResponse>;
export interface DisassociateQAppFromUserInput {
  instanceId: string;
  appId: string;
}
export const DisassociateQAppFromUserInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/apps.uninstall" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateQAppFromUserInput",
}) as any as S.Schema<DisassociateQAppFromUserInput>;
export interface DisassociateQAppFromUserResponse {}
export const DisassociateQAppFromUserResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateQAppFromUserResponse",
}) as any as S.Schema<DisassociateQAppFromUserResponse>;
export interface ExportQAppSessionDataInput {
  instanceId: string;
  sessionId: string;
}
export const ExportQAppSessionDataInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/runtime.exportQAppSessionData" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExportQAppSessionDataInput",
}) as any as S.Schema<ExportQAppSessionDataInput>;
export interface GetLibraryItemInput {
  instanceId: string;
  libraryItemId: string;
  appId?: string;
}
export const GetLibraryItemInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String.pipe(T.HttpQuery("libraryItemId")),
    appId: S.optional(S.String).pipe(T.HttpQuery("appId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/catalog.getItem" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLibraryItemInput",
}) as any as S.Schema<GetLibraryItemInput>;
export interface GetQAppInput {
  instanceId: string;
  appId: string;
  appVersion?: number;
}
export const GetQAppInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String.pipe(T.HttpQuery("appId")),
    appVersion: S.optional(S.Number).pipe(T.HttpQuery("appVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/apps.get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetQAppInput" }) as any as S.Schema<GetQAppInput>;
export interface GetQAppSessionInput {
  instanceId: string;
  sessionId: string;
}
export const GetQAppSessionInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/runtime.getQAppSession" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQAppSessionInput",
}) as any as S.Schema<GetQAppSessionInput>;
export interface GetQAppSessionMetadataInput {
  instanceId: string;
  sessionId: string;
}
export const GetQAppSessionMetadataInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/runtime.getQAppSessionMetadata" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQAppSessionMetadataInput",
}) as any as S.Schema<GetQAppSessionMetadataInput>;
export interface ImportDocumentInput {
  instanceId: string;
  cardId: string;
  appId: string;
  fileContentsBase64: string;
  fileName: string;
  scope: string;
  sessionId?: string;
}
export const ImportDocumentInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    cardId: S.String,
    appId: S.String,
    fileContentsBase64: S.String,
    fileName: S.String,
    scope: S.String,
    sessionId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/apps.importDocument" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportDocumentInput",
}) as any as S.Schema<ImportDocumentInput>;
export interface ListCategoriesInput {
  instanceId: string;
}
export const ListCategoriesInput = S.suspend(() =>
  S.Struct({ instanceId: S.String.pipe(T.HttpHeader("instance-id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/catalog.listCategories" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCategoriesInput",
}) as any as S.Schema<ListCategoriesInput>;
export interface ListLibraryItemsInput {
  instanceId: string;
  limit?: number;
  nextToken?: string;
  categoryId?: string;
}
export const ListLibraryItemsInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    categoryId: S.optional(S.String).pipe(T.HttpQuery("categoryId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/catalog.list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLibraryItemsInput",
}) as any as S.Schema<ListLibraryItemsInput>;
export interface ListQAppsInput {
  instanceId: string;
  limit?: number;
  nextToken?: string;
}
export const ListQAppsInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/apps.list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListQAppsInput",
}) as any as S.Schema<ListQAppsInput>;
export interface ListQAppSessionDataInput {
  instanceId: string;
  sessionId: string;
}
export const ListQAppSessionDataInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/runtime.listQAppSessionData" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListQAppSessionDataInput",
}) as any as S.Schema<ListQAppSessionDataInput>;
export interface ListTagsForResourceRequest {
  resourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String.pipe(T.HttpLabel("resourceARN")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceARN}" }),
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
export interface StopQAppSessionInput {
  instanceId: string;
  sessionId: string;
}
export const StopQAppSessionInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/runtime.deleteMiniAppRun" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopQAppSessionInput",
}) as any as S.Schema<StopQAppSessionInput>;
export interface StopQAppSessionResponse {}
export const StopQAppSessionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopQAppSessionResponse",
}) as any as S.Schema<StopQAppSessionResponse>;
export interface UntagResourceRequest {
  resourceARN: string;
  tagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceARN: S.String.pipe(T.HttpLabel("resourceARN")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceARN}" }),
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
export interface UpdateLibraryItemInput {
  instanceId: string;
  libraryItemId: string;
  status?: string;
  categories?: CategoryIdList;
}
export const UpdateLibraryItemInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String,
    status: S.optional(S.String),
    categories: S.optional(CategoryIdList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/catalog.updateItem" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLibraryItemInput",
}) as any as S.Schema<UpdateLibraryItemInput>;
export interface UpdateLibraryItemMetadataInput {
  instanceId: string;
  libraryItemId: string;
  isVerified?: boolean;
}
export const UpdateLibraryItemMetadataInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String,
    isVerified: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/catalog.updateItemMetadata" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLibraryItemMetadataInput",
}) as any as S.Schema<UpdateLibraryItemMetadataInput>;
export interface UpdateLibraryItemMetadataResponse {}
export const UpdateLibraryItemMetadataResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLibraryItemMetadataResponse",
}) as any as S.Schema<UpdateLibraryItemMetadataResponse>;
export interface TextInputCardInput {
  title: string;
  id: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
}
export const TextInputCardInput = S.suspend(() =>
  S.Struct({
    title: S.String,
    id: S.String,
    type: S.String,
    placeholder: S.optional(S.String),
    defaultValue: S.optional(S.String),
  }),
).annotations({
  identifier: "TextInputCardInput",
}) as any as S.Schema<TextInputCardInput>;
export type DocumentAttributeStringListValue = string[];
export const DocumentAttributeStringListValue = S.Array(S.String);
export type DocumentAttributeValue =
  | { stringValue: string }
  | { stringListValue: DocumentAttributeStringListValue }
  | { longValue: number }
  | { dateValue: Date };
export const DocumentAttributeValue = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ stringListValue: DocumentAttributeStringListValue }),
  S.Struct({ longValue: S.Number }),
  S.Struct({ dateValue: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
);
export interface DocumentAttribute {
  name: string;
  value: (typeof DocumentAttributeValue)["Type"];
}
export const DocumentAttribute = S.suspend(() =>
  S.Struct({ name: S.String, value: DocumentAttributeValue }),
).annotations({
  identifier: "DocumentAttribute",
}) as any as S.Schema<DocumentAttribute>;
export interface AttributeFilter {
  andAllFilters?: AttributeFilters;
  orAllFilters?: AttributeFilters;
  notFilter?: AttributeFilter;
  equalsTo?: DocumentAttribute;
  containsAll?: DocumentAttribute;
  containsAny?: DocumentAttribute;
  greaterThan?: DocumentAttribute;
  greaterThanOrEquals?: DocumentAttribute;
  lessThan?: DocumentAttribute;
  lessThanOrEquals?: DocumentAttribute;
}
export const AttributeFilter = S.suspend(() =>
  S.Struct({
    andAllFilters: S.optional(
      S.suspend(() => AttributeFilters).annotations({
        identifier: "AttributeFilters",
      }),
    ),
    orAllFilters: S.optional(
      S.suspend(() => AttributeFilters).annotations({
        identifier: "AttributeFilters",
      }),
    ),
    notFilter: S.optional(
      S.suspend(
        (): S.Schema<AttributeFilter, any> => AttributeFilter,
      ).annotations({ identifier: "AttributeFilter" }),
    ),
    equalsTo: S.optional(DocumentAttribute),
    containsAll: S.optional(DocumentAttribute),
    containsAny: S.optional(DocumentAttribute),
    greaterThan: S.optional(DocumentAttribute),
    greaterThanOrEquals: S.optional(DocumentAttribute),
    lessThan: S.optional(DocumentAttribute),
    lessThanOrEquals: S.optional(DocumentAttribute),
  }),
).annotations({
  identifier: "AttributeFilter",
}) as any as S.Schema<AttributeFilter>;
export interface QQueryCardInput {
  title: string;
  id: string;
  type: string;
  prompt: string;
  outputSource?: string;
  attributeFilter?: AttributeFilter;
}
export const QQueryCardInput = S.suspend(() =>
  S.Struct({
    title: S.String,
    id: S.String,
    type: S.String,
    prompt: S.String,
    outputSource: S.optional(S.String),
    attributeFilter: S.optional(AttributeFilter),
  }),
).annotations({
  identifier: "QQueryCardInput",
}) as any as S.Schema<QQueryCardInput>;
export interface QPluginCardInput {
  title: string;
  id: string;
  type: string;
  prompt: string;
  pluginId: string;
  actionIdentifier?: string;
}
export const QPluginCardInput = S.suspend(() =>
  S.Struct({
    title: S.String,
    id: S.String,
    type: S.String,
    prompt: S.String,
    pluginId: S.String,
    actionIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "QPluginCardInput",
}) as any as S.Schema<QPluginCardInput>;
export interface FileUploadCardInput {
  title: string;
  id: string;
  type: string;
  filename?: string;
  fileId?: string;
  allowOverride?: boolean;
}
export const FileUploadCardInput = S.suspend(() =>
  S.Struct({
    title: S.String,
    id: S.String,
    type: S.String,
    filename: S.optional(S.String),
    fileId: S.optional(S.String),
    allowOverride: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FileUploadCardInput",
}) as any as S.Schema<FileUploadCardInput>;
export interface FormInputCardMetadata {
  schema: any;
}
export const FormInputCardMetadata = S.suspend(() =>
  S.Struct({ schema: S.Any }),
).annotations({
  identifier: "FormInputCardMetadata",
}) as any as S.Schema<FormInputCardMetadata>;
export interface FormInputCardInput {
  title: string;
  id: string;
  type: string;
  metadata: FormInputCardMetadata;
  computeMode?: string;
}
export const FormInputCardInput = S.suspend(() =>
  S.Struct({
    title: S.String,
    id: S.String,
    type: S.String,
    metadata: FormInputCardMetadata,
    computeMode: S.optional(S.String),
  }),
).annotations({
  identifier: "FormInputCardInput",
}) as any as S.Schema<FormInputCardInput>;
export type CardInput =
  | { textInput: TextInputCardInput }
  | { qQuery: QQueryCardInput }
  | { qPlugin: QPluginCardInput }
  | { fileUpload: FileUploadCardInput }
  | { formInput: FormInputCardInput };
export const CardInput = S.Union(
  S.Struct({ textInput: TextInputCardInput }),
  S.Struct({ qQuery: QQueryCardInput }),
  S.Struct({ qPlugin: QPluginCardInput }),
  S.Struct({ fileUpload: FileUploadCardInput }),
  S.Struct({ formInput: FormInputCardInput }),
);
export type CardList = (typeof CardInput)["Type"][];
export const CardList = S.Array(CardInput);
export interface AppDefinitionInput {
  cards: CardList;
  initialPrompt?: string;
}
export const AppDefinitionInput = S.suspend(() =>
  S.Struct({ cards: CardList, initialPrompt: S.optional(S.String) }),
).annotations({
  identifier: "AppDefinitionInput",
}) as any as S.Schema<AppDefinitionInput>;
export interface UpdateQAppInput {
  instanceId: string;
  appId: string;
  title?: string;
  description?: string;
  appDefinition?: AppDefinitionInput;
}
export const UpdateQAppInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String,
    title: S.optional(S.String),
    description: S.optional(S.String),
    appDefinition: S.optional(AppDefinitionInput),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/apps.update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateQAppInput",
}) as any as S.Schema<UpdateQAppInput>;
export interface SubmissionMutation {
  submissionId: string;
  mutationType: string;
}
export const SubmissionMutation = S.suspend(() =>
  S.Struct({ submissionId: S.String, mutationType: S.String }),
).annotations({
  identifier: "SubmissionMutation",
}) as any as S.Schema<SubmissionMutation>;
export interface CardValue {
  cardId: string;
  value: string;
  submissionMutation?: SubmissionMutation;
}
export const CardValue = S.suspend(() =>
  S.Struct({
    cardId: S.String,
    value: S.String,
    submissionMutation: S.optional(SubmissionMutation),
  }),
).annotations({ identifier: "CardValue" }) as any as S.Schema<CardValue>;
export type CardValueList = CardValue[];
export const CardValueList = S.Array(CardValue);
export interface UpdateQAppSessionInput {
  instanceId: string;
  sessionId: string;
  values?: CardValueList;
}
export const UpdateQAppSessionInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String,
    values: S.optional(CardValueList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/runtime.updateQAppSession" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateQAppSessionInput",
}) as any as S.Schema<UpdateQAppSessionInput>;
export interface BatchCreateCategoryInputCategory {
  id?: string;
  title: string;
  color?: string;
}
export const BatchCreateCategoryInputCategory = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    title: S.String,
    color: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchCreateCategoryInputCategory",
}) as any as S.Schema<BatchCreateCategoryInputCategory>;
export type BatchCreateCategoryInputCategoryList =
  BatchCreateCategoryInputCategory[];
export const BatchCreateCategoryInputCategoryList = S.Array(
  BatchCreateCategoryInputCategory,
);
export interface CategoryInput {
  id: string;
  title: string;
  color?: string;
}
export const CategoryInput = S.suspend(() =>
  S.Struct({ id: S.String, title: S.String, color: S.optional(S.String) }),
).annotations({
  identifier: "CategoryInput",
}) as any as S.Schema<CategoryInput>;
export type CategoryListInput = CategoryInput[];
export const CategoryListInput = S.Array(CategoryInput);
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export type AppRequiredCapabilities = string[];
export const AppRequiredCapabilities = S.Array(S.String);
export interface Category {
  id: string;
  title: string;
  color?: string;
  appCount?: number;
}
export const Category = S.suspend(() =>
  S.Struct({
    id: S.String,
    title: S.String,
    color: S.optional(S.String),
    appCount: S.optional(S.Number),
  }),
).annotations({ identifier: "Category" }) as any as S.Schema<Category>;
export type CategoriesList = Category[];
export const CategoriesList = S.Array(Category);
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface PermissionInput {
  action: string;
  principal: string;
}
export const PermissionInput = S.suspend(() =>
  S.Struct({ action: S.String, principal: S.String }),
).annotations({
  identifier: "PermissionInput",
}) as any as S.Schema<PermissionInput>;
export type PermissionsInputList = PermissionInput[];
export const PermissionsInputList = S.Array(PermissionInput);
export interface SessionSharingConfiguration {
  enabled: boolean;
  acceptResponses?: boolean;
  revealCards?: boolean;
}
export const SessionSharingConfiguration = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    acceptResponses: S.optional(S.Boolean),
    revealCards: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SessionSharingConfiguration",
}) as any as S.Schema<SessionSharingConfiguration>;
export interface BatchCreateCategoryInput {
  instanceId: string;
  categories: BatchCreateCategoryInputCategoryList;
}
export const BatchCreateCategoryInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    categories: BatchCreateCategoryInputCategoryList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/catalog.createCategories" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchCreateCategoryInput",
}) as any as S.Schema<BatchCreateCategoryInput>;
export interface BatchCreateCategoryResponse {}
export const BatchCreateCategoryResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "BatchCreateCategoryResponse",
}) as any as S.Schema<BatchCreateCategoryResponse>;
export interface BatchUpdateCategoryInput {
  instanceId: string;
  categories: CategoryListInput;
}
export const BatchUpdateCategoryInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    categories: CategoryListInput,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/catalog.updateCategories" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateCategoryInput",
}) as any as S.Schema<BatchUpdateCategoryInput>;
export interface BatchUpdateCategoryResponse {}
export const BatchUpdateCategoryResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "BatchUpdateCategoryResponse",
}) as any as S.Schema<BatchUpdateCategoryResponse>;
export interface CreateLibraryItemOutput {
  libraryItemId: string;
  status: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  ratingCount: number;
  isVerified?: boolean;
}
export const CreateLibraryItemOutput = S.suspend(() =>
  S.Struct({
    libraryItemId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    ratingCount: S.Number,
    isVerified: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CreateLibraryItemOutput",
}) as any as S.Schema<CreateLibraryItemOutput>;
export interface ExportQAppSessionDataOutput {
  csvFileLink: string;
  expiresAt: Date;
  sessionArn: string;
}
export const ExportQAppSessionDataOutput = S.suspend(() =>
  S.Struct({
    csvFileLink: S.String,
    expiresAt: S.Date.pipe(T.TimestampFormat("date-time")),
    sessionArn: S.String,
  }),
).annotations({
  identifier: "ExportQAppSessionDataOutput",
}) as any as S.Schema<ExportQAppSessionDataOutput>;
export interface GetQAppSessionMetadataOutput {
  sessionId: string;
  sessionArn: string;
  sessionName?: string;
  sharingConfiguration: SessionSharingConfiguration;
  sessionOwner?: boolean;
}
export const GetQAppSessionMetadataOutput = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    sessionArn: S.String,
    sessionName: S.optional(S.String),
    sharingConfiguration: SessionSharingConfiguration,
    sessionOwner: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetQAppSessionMetadataOutput",
}) as any as S.Schema<GetQAppSessionMetadataOutput>;
export interface ImportDocumentOutput {
  fileId?: string;
}
export const ImportDocumentOutput = S.suspend(() =>
  S.Struct({ fileId: S.optional(S.String) }),
).annotations({
  identifier: "ImportDocumentOutput",
}) as any as S.Schema<ImportDocumentOutput>;
export interface ListCategoriesOutput {
  categories?: CategoriesList;
}
export const ListCategoriesOutput = S.suspend(() =>
  S.Struct({ categories: S.optional(CategoriesList) }),
).annotations({
  identifier: "ListCategoriesOutput",
}) as any as S.Schema<ListCategoriesOutput>;
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceARN: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceARN: S.String.pipe(T.HttpLabel("resourceARN")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceARN}" }),
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
export type CategoryList = Category[];
export const CategoryList = S.Array(Category);
export interface UpdateLibraryItemOutput {
  libraryItemId: string;
  appId: string;
  appVersion: number;
  categories: CategoryList;
  status: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  ratingCount: number;
  isRatedByUser?: boolean;
  userCount?: number;
  isVerified?: boolean;
}
export const UpdateLibraryItemOutput = S.suspend(() =>
  S.Struct({
    libraryItemId: S.String,
    appId: S.String,
    appVersion: S.Number,
    categories: CategoryList,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    ratingCount: S.Number,
    isRatedByUser: S.optional(S.Boolean),
    userCount: S.optional(S.Number),
    isVerified: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UpdateLibraryItemOutput",
}) as any as S.Schema<UpdateLibraryItemOutput>;
export interface UpdateQAppOutput {
  appId: string;
  appArn: string;
  title: string;
  description?: string;
  initialPrompt?: string;
  appVersion: number;
  status: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  requiredCapabilities?: AppRequiredCapabilities;
}
export const UpdateQAppOutput = S.suspend(() =>
  S.Struct({
    appId: S.String,
    appArn: S.String,
    title: S.String,
    description: S.optional(S.String),
    initialPrompt: S.optional(S.String),
    appVersion: S.Number,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedBy: S.String,
    requiredCapabilities: S.optional(AppRequiredCapabilities),
  }),
).annotations({
  identifier: "UpdateQAppOutput",
}) as any as S.Schema<UpdateQAppOutput>;
export interface UpdateQAppPermissionsInput {
  instanceId: string;
  appId: string;
  grantPermissions?: PermissionsInputList;
  revokePermissions?: PermissionsInputList;
}
export const UpdateQAppPermissionsInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String,
    grantPermissions: S.optional(PermissionsInputList),
    revokePermissions: S.optional(PermissionsInputList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/apps.updateQAppPermissions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateQAppPermissionsInput",
}) as any as S.Schema<UpdateQAppPermissionsInput>;
export interface UpdateQAppSessionOutput {
  sessionId: string;
  sessionArn: string;
}
export const UpdateQAppSessionOutput = S.suspend(() =>
  S.Struct({ sessionId: S.String, sessionArn: S.String }),
).annotations({
  identifier: "UpdateQAppSessionOutput",
}) as any as S.Schema<UpdateQAppSessionOutput>;
export interface UpdateQAppSessionMetadataInput {
  instanceId: string;
  sessionId: string;
  sessionName?: string;
  sharingConfiguration: SessionSharingConfiguration;
}
export const UpdateQAppSessionMetadataInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String,
    sessionName: S.optional(S.String),
    sharingConfiguration: SessionSharingConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/runtime.updateQAppSessionMetadata" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateQAppSessionMetadataInput",
}) as any as S.Schema<UpdateQAppSessionMetadataInput>;
export interface ConversationMessage {
  body: string;
  type: string;
}
export const ConversationMessage = S.suspend(() =>
  S.Struct({ body: S.String, type: S.String }),
).annotations({
  identifier: "ConversationMessage",
}) as any as S.Schema<ConversationMessage>;
export type MessageList = ConversationMessage[];
export const MessageList = S.Array(ConversationMessage);
export type PresignedUrlFields = { [key: string]: string };
export const PresignedUrlFields = S.Record({ key: S.String, value: S.String });
export interface LibraryItemMember {
  libraryItemId: string;
  appId: string;
  appVersion: number;
  categories: CategoryList;
  status: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  ratingCount: number;
  isRatedByUser?: boolean;
  userCount?: number;
  isVerified?: boolean;
}
export const LibraryItemMember = S.suspend(() =>
  S.Struct({
    libraryItemId: S.String,
    appId: S.String,
    appVersion: S.Number,
    categories: CategoryList,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    ratingCount: S.Number,
    isRatedByUser: S.optional(S.Boolean),
    userCount: S.optional(S.Number),
    isVerified: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LibraryItemMember",
}) as any as S.Schema<LibraryItemMember>;
export type LibraryItemList = LibraryItemMember[];
export const LibraryItemList = S.Array(LibraryItemMember);
export interface UserAppItem {
  appId: string;
  appArn: string;
  title: string;
  description?: string;
  createdAt: Date;
  canEdit?: boolean;
  status?: string;
  isVerified?: boolean;
}
export const UserAppItem = S.suspend(() =>
  S.Struct({
    appId: S.String,
    appArn: S.String,
    title: S.String,
    description: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    canEdit: S.optional(S.Boolean),
    status: S.optional(S.String),
    isVerified: S.optional(S.Boolean),
  }),
).annotations({ identifier: "UserAppItem" }) as any as S.Schema<UserAppItem>;
export type UserAppsList = UserAppItem[];
export const UserAppsList = S.Array(UserAppItem);
export type PredictQAppInputOptions =
  | { conversation: MessageList }
  | { problemStatement: string };
export const PredictQAppInputOptions = S.Union(
  S.Struct({ conversation: MessageList }),
  S.Struct({ problemStatement: S.String }),
);
export interface CreatePresignedUrlOutput {
  fileId: string;
  presignedUrl: string;
  presignedUrlFields: PresignedUrlFields;
  presignedUrlExpiration: Date;
}
export const CreatePresignedUrlOutput = S.suspend(() =>
  S.Struct({
    fileId: S.String,
    presignedUrl: S.String,
    presignedUrlFields: PresignedUrlFields,
    presignedUrlExpiration: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreatePresignedUrlOutput",
}) as any as S.Schema<CreatePresignedUrlOutput>;
export type AttributeFilters = AttributeFilter[];
export const AttributeFilters = S.Array(
  S.suspend((): S.Schema<AttributeFilter, any> => AttributeFilter).annotations({
    identifier: "AttributeFilter",
  }),
) as any as S.Schema<AttributeFilters>;
export interface GetLibraryItemOutput {
  libraryItemId: string;
  appId: string;
  appVersion: number;
  categories: CategoryList;
  status: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  ratingCount: number;
  isRatedByUser?: boolean;
  userCount?: number;
  isVerified?: boolean;
}
export const GetLibraryItemOutput = S.suspend(() =>
  S.Struct({
    libraryItemId: S.String,
    appId: S.String,
    appVersion: S.Number,
    categories: CategoryList,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    ratingCount: S.Number,
    isRatedByUser: S.optional(S.Boolean),
    userCount: S.optional(S.Number),
    isVerified: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetLibraryItemOutput",
}) as any as S.Schema<GetLibraryItemOutput>;
export interface ListLibraryItemsOutput {
  libraryItems?: LibraryItemList;
  nextToken?: string;
}
export const ListLibraryItemsOutput = S.suspend(() =>
  S.Struct({
    libraryItems: S.optional(LibraryItemList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLibraryItemsOutput",
}) as any as S.Schema<ListLibraryItemsOutput>;
export interface ListQAppsOutput {
  apps: UserAppsList;
  nextToken?: string;
}
export const ListQAppsOutput = S.suspend(() =>
  S.Struct({ apps: UserAppsList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListQAppsOutput",
}) as any as S.Schema<ListQAppsOutput>;
export interface PredictQAppInput {
  instanceId: string;
  options?: (typeof PredictQAppInputOptions)["Type"];
}
export const PredictQAppInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    options: S.optional(PredictQAppInputOptions),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/apps.predictQApp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PredictQAppInput",
}) as any as S.Schema<PredictQAppInput>;
export interface StartQAppSessionInput {
  instanceId: string;
  appId: string;
  appVersion: number;
  initialValues?: CardValueList;
  sessionId?: string;
  tags?: TagMap;
}
export const StartQAppSessionInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String,
    appVersion: S.Number,
    initialValues: S.optional(CardValueList),
    sessionId: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/runtime.startQAppSession" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartQAppSessionInput",
}) as any as S.Schema<StartQAppSessionInput>;
export interface PrincipalOutput {
  userId?: string;
  userType?: string;
  email?: string;
}
export const PrincipalOutput = S.suspend(() =>
  S.Struct({
    userId: S.optional(S.String),
    userType: S.optional(S.String),
    email: S.optional(S.String),
  }),
).annotations({
  identifier: "PrincipalOutput",
}) as any as S.Schema<PrincipalOutput>;
export interface PermissionOutput {
  action: string;
  principal: PrincipalOutput;
}
export const PermissionOutput = S.suspend(() =>
  S.Struct({ action: S.String, principal: PrincipalOutput }),
).annotations({
  identifier: "PermissionOutput",
}) as any as S.Schema<PermissionOutput>;
export type PermissionsOutputList = PermissionOutput[];
export const PermissionsOutputList = S.Array(PermissionOutput);
export interface UpdateQAppPermissionsOutput {
  resourceArn?: string;
  appId?: string;
  permissions?: PermissionsOutputList;
}
export const UpdateQAppPermissionsOutput = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    appId: S.optional(S.String),
    permissions: S.optional(PermissionsOutputList),
  }),
).annotations({
  identifier: "UpdateQAppPermissionsOutput",
}) as any as S.Schema<UpdateQAppPermissionsOutput>;
export interface UpdateQAppSessionMetadataOutput {
  sessionId: string;
  sessionArn: string;
  sessionName?: string;
  sharingConfiguration: SessionSharingConfiguration;
}
export const UpdateQAppSessionMetadataOutput = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    sessionArn: S.String,
    sessionName: S.optional(S.String),
    sharingConfiguration: SessionSharingConfiguration,
  }),
).annotations({
  identifier: "UpdateQAppSessionMetadataOutput",
}) as any as S.Schema<UpdateQAppSessionMetadataOutput>;
export interface User {
  userId?: string;
}
export const User = S.suspend(() =>
  S.Struct({ userId: S.optional(S.String) }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type DependencyList = string[];
export const DependencyList = S.Array(S.String);
export type MemoryReferenceList = string[];
export const MemoryReferenceList = S.Array(S.String);
export interface QAppSessionData {
  cardId: string;
  value?: any;
  user: User;
  submissionId?: string;
  timestamp?: Date;
}
export const QAppSessionData = S.suspend(() =>
  S.Struct({
    cardId: S.String,
    value: S.optional(S.Any),
    user: User,
    submissionId: S.optional(S.String),
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "QAppSessionData",
}) as any as S.Schema<QAppSessionData>;
export type QAppSessionDataList = QAppSessionData[];
export const QAppSessionDataList = S.Array(QAppSessionData);
export interface TextInputCard {
  id: string;
  title: string;
  dependencies: DependencyList;
  type: string;
  placeholder?: string;
  defaultValue?: string;
}
export const TextInputCard = S.suspend(() =>
  S.Struct({
    id: S.String,
    title: S.String,
    dependencies: DependencyList,
    type: S.String,
    placeholder: S.optional(S.String),
    defaultValue: S.optional(S.String),
  }),
).annotations({
  identifier: "TextInputCard",
}) as any as S.Schema<TextInputCard>;
export interface QQueryCard {
  id: string;
  title: string;
  dependencies: DependencyList;
  type: string;
  prompt: string;
  outputSource: string;
  attributeFilter?: AttributeFilter;
  memoryReferences?: MemoryReferenceList;
}
export const QQueryCard = S.suspend(() =>
  S.Struct({
    id: S.String,
    title: S.String,
    dependencies: DependencyList,
    type: S.String,
    prompt: S.String,
    outputSource: S.String,
    attributeFilter: S.optional(AttributeFilter),
    memoryReferences: S.optional(MemoryReferenceList),
  }),
).annotations({ identifier: "QQueryCard" }) as any as S.Schema<QQueryCard>;
export interface QPluginCard {
  id: string;
  title: string;
  dependencies: DependencyList;
  type: string;
  prompt: string;
  pluginType: string;
  pluginId: string;
  actionIdentifier?: string;
}
export const QPluginCard = S.suspend(() =>
  S.Struct({
    id: S.String,
    title: S.String,
    dependencies: DependencyList,
    type: S.String,
    prompt: S.String,
    pluginType: S.String,
    pluginId: S.String,
    actionIdentifier: S.optional(S.String),
  }),
).annotations({ identifier: "QPluginCard" }) as any as S.Schema<QPluginCard>;
export interface FileUploadCard {
  id: string;
  title: string;
  dependencies: DependencyList;
  type: string;
  filename?: string;
  fileId?: string;
  allowOverride?: boolean;
}
export const FileUploadCard = S.suspend(() =>
  S.Struct({
    id: S.String,
    title: S.String,
    dependencies: DependencyList,
    type: S.String,
    filename: S.optional(S.String),
    fileId: S.optional(S.String),
    allowOverride: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FileUploadCard",
}) as any as S.Schema<FileUploadCard>;
export interface FormInputCard {
  id: string;
  title: string;
  dependencies: DependencyList;
  type: string;
  metadata: FormInputCardMetadata;
  computeMode?: string;
}
export const FormInputCard = S.suspend(() =>
  S.Struct({
    id: S.String,
    title: S.String,
    dependencies: DependencyList,
    type: S.String,
    metadata: FormInputCardMetadata,
    computeMode: S.optional(S.String),
  }),
).annotations({
  identifier: "FormInputCard",
}) as any as S.Schema<FormInputCard>;
export interface Submission {
  value?: any;
  submissionId?: string;
  timestamp?: Date;
}
export const Submission = S.suspend(() =>
  S.Struct({
    value: S.optional(S.Any),
    submissionId: S.optional(S.String),
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "Submission" }) as any as S.Schema<Submission>;
export type SubmissionList = Submission[];
export const SubmissionList = S.Array(Submission);
export interface DescribeQAppPermissionsOutput {
  resourceArn?: string;
  appId?: string;
  permissions?: PermissionsOutputList;
}
export const DescribeQAppPermissionsOutput = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    appId: S.optional(S.String),
    permissions: S.optional(PermissionsOutputList),
  }),
).annotations({
  identifier: "DescribeQAppPermissionsOutput",
}) as any as S.Schema<DescribeQAppPermissionsOutput>;
export interface ListQAppSessionDataOutput {
  sessionId: string;
  sessionArn: string;
  sessionData?: QAppSessionDataList;
  nextToken?: string;
}
export const ListQAppSessionDataOutput = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    sessionArn: S.String,
    sessionData: S.optional(QAppSessionDataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListQAppSessionDataOutput",
}) as any as S.Schema<ListQAppSessionDataOutput>;
export interface StartQAppSessionOutput {
  sessionId: string;
  sessionArn: string;
}
export const StartQAppSessionOutput = S.suspend(() =>
  S.Struct({ sessionId: S.String, sessionArn: S.String }),
).annotations({
  identifier: "StartQAppSessionOutput",
}) as any as S.Schema<StartQAppSessionOutput>;
export type Card =
  | { textInput: TextInputCard }
  | { qQuery: QQueryCard }
  | { qPlugin: QPluginCard }
  | { fileUpload: FileUploadCard }
  | { formInput: FormInputCard };
export const Card = S.Union(
  S.Struct({ textInput: TextInputCard }),
  S.Struct({ qQuery: QQueryCard }),
  S.Struct({ qPlugin: QPluginCard }),
  S.Struct({ fileUpload: FileUploadCard }),
  S.Struct({ formInput: FormInputCard }),
);
export type CardModelList = (typeof Card)["Type"][];
export const CardModelList = S.Array(Card);
export interface CardStatus {
  currentState: string;
  currentValue: string;
  submissions?: SubmissionList;
}
export const CardStatus = S.suspend(() =>
  S.Struct({
    currentState: S.String,
    currentValue: S.String,
    submissions: S.optional(SubmissionList),
  }),
).annotations({ identifier: "CardStatus" }) as any as S.Schema<CardStatus>;
export interface AppDefinition {
  appDefinitionVersion: string;
  cards: CardModelList;
  canEdit?: boolean;
}
export const AppDefinition = S.suspend(() =>
  S.Struct({
    appDefinitionVersion: S.String,
    cards: CardModelList,
    canEdit: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AppDefinition",
}) as any as S.Schema<AppDefinition>;
export type CardStatusMap = { [key: string]: CardStatus };
export const CardStatusMap = S.Record({ key: S.String, value: CardStatus });
export interface PredictAppDefinition {
  title: string;
  description?: string;
  appDefinition: AppDefinitionInput;
}
export const PredictAppDefinition = S.suspend(() =>
  S.Struct({
    title: S.String,
    description: S.optional(S.String),
    appDefinition: AppDefinitionInput,
  }),
).annotations({
  identifier: "PredictAppDefinition",
}) as any as S.Schema<PredictAppDefinition>;
export interface GetQAppOutput {
  appId: string;
  appArn: string;
  title: string;
  description?: string;
  initialPrompt?: string;
  appVersion: number;
  status: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  requiredCapabilities?: AppRequiredCapabilities;
  appDefinition: AppDefinition;
}
export const GetQAppOutput = S.suspend(() =>
  S.Struct({
    appId: S.String,
    appArn: S.String,
    title: S.String,
    description: S.optional(S.String),
    initialPrompt: S.optional(S.String),
    appVersion: S.Number,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedBy: S.String,
    requiredCapabilities: S.optional(AppRequiredCapabilities),
    appDefinition: AppDefinition,
  }),
).annotations({
  identifier: "GetQAppOutput",
}) as any as S.Schema<GetQAppOutput>;
export interface GetQAppSessionOutput {
  sessionId: string;
  sessionArn: string;
  sessionName?: string;
  appVersion?: number;
  latestPublishedAppVersion?: number;
  status: string;
  cardStatus: CardStatusMap;
  userIsHost?: boolean;
}
export const GetQAppSessionOutput = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    sessionArn: S.String,
    sessionName: S.optional(S.String),
    appVersion: S.optional(S.Number),
    latestPublishedAppVersion: S.optional(S.Number),
    status: S.String,
    cardStatus: CardStatusMap,
    userIsHost: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetQAppSessionOutput",
}) as any as S.Schema<GetQAppSessionOutput>;
export interface PredictQAppOutput {
  app: PredictAppDefinition;
  problemStatement: string;
}
export const PredictQAppOutput = S.suspend(() =>
  S.Struct({ app: PredictAppDefinition, problemStatement: S.String }),
).annotations({
  identifier: "PredictQAppOutput",
}) as any as S.Schema<PredictQAppOutput>;
export interface CreateQAppInput {
  instanceId: string;
  title: string;
  description?: string;
  appDefinition: AppDefinitionInput;
  tags?: TagMap;
}
export const CreateQAppInput = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    title: S.String,
    description: S.optional(S.String),
    appDefinition: AppDefinitionInput,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/apps.create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateQAppInput",
}) as any as S.Schema<CreateQAppInput>;
export interface CreateQAppOutput {
  appId: string;
  appArn: string;
  title: string;
  description?: string;
  initialPrompt?: string;
  appVersion: number;
  status: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  requiredCapabilities?: AppRequiredCapabilities;
}
export const CreateQAppOutput = S.suspend(() =>
  S.Struct({
    appId: S.String,
    appArn: S.String,
    title: S.String,
    description: S.optional(S.String),
    initialPrompt: S.optional(S.String),
    appVersion: S.Number,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedBy: S.String,
    requiredCapabilities: S.optional(AppRequiredCapabilities),
  }),
).annotations({
  identifier: "CreateQAppOutput",
}) as any as S.Schema<CreateQAppOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ContentTooLargeException extends S.TaggedError<ContentTooLargeException>()(
  "ContentTooLargeException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Associates tags with an Amazon Q Apps resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ConflictException
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
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the collected data of a Q App data collection session.
 */
export const listQAppSessionData: (
  input: ListQAppSessionDataInput,
) => Effect.Effect<
  ListQAppSessionDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListQAppSessionDataInput,
  output: ListQAppSessionDataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Starts a new session for an Amazon Q App, allowing inputs to be provided and the app to be run.
 *
 * Each Q App session will be condensed into a single conversation in the web experience.
 */
export const startQAppSession: (
  input: StartQAppSessionInput,
) => Effect.Effect<
  StartQAppSessionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartQAppSessionInput,
  output: StartQAppSessionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Uploads a file that can then be used either as a default in a `FileUploadCard` from Q App definition or as a file that is used inside a single Q App run. The purpose of the document is determined by a scope parameter that indicates whether it is at the app definition level or at the app session level.
 */
export const importDocument: (
  input: ImportDocumentInput,
) => Effect.Effect<
  ImportDocumentOutput,
  | AccessDeniedException
  | ContentTooLargeException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportDocumentInput,
  output: ImportDocumentOutput,
  errors: [
    AccessDeniedException,
    ContentTooLargeException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration metadata of a session for a given Q App `sessionId`.
 */
export const updateQAppSessionMetadata: (
  input: UpdateQAppSessionMetadataInput,
) => Effect.Effect<
  UpdateQAppSessionMetadataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQAppSessionMetadataInput,
  output: UpdateQAppSessionMetadataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Exports the collected data of a Q App data collection session.
 */
export const exportQAppSessionData: (
  input: ExportQAppSessionDataInput,
) => Effect.Effect<
  ExportQAppSessionDataOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportQAppSessionDataInput,
  output: ExportQAppSessionDataOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Removes a rating or review previously submitted by the user for a library item.
 */
export const disassociateLibraryItemReview: (
  input: DisassociateLibraryItemReviewInput,
) => Effect.Effect<
  DisassociateLibraryItemReviewResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateLibraryItemReviewInput,
  output: DisassociateLibraryItemReviewResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves the current configuration of a Q App session.
 */
export const getQAppSessionMetadata: (
  input: GetQAppSessionMetadataInput,
) => Effect.Effect<
  GetQAppSessionMetadataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQAppSessionMetadataInput,
  output: GetQAppSessionMetadataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates the session for a given Q App `sessionId`. This is only valid when at least one card of the session is in the `WAITING` state. Data for each `WAITING` card can be provided as input. If inputs are not provided, the call will be accepted but session will not move forward. Inputs for cards that are not in the `WAITING` status will be ignored.
 */
export const updateQAppSession: (
  input: UpdateQAppSessionInput,
) => Effect.Effect<
  UpdateQAppSessionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQAppSessionInput,
  output: UpdateQAppSessionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * This operation creates a link between the user's identity calling the operation and a specific Q App. This is useful to mark the Q App as a *favorite* for the user if the user doesn't own the Amazon Q App so they can still run it and see it in their inventory of Q Apps.
 */
export const associateQAppWithUser: (
  input: AssociateQAppWithUserInput,
) => Effect.Effect<
  AssociateQAppWithUserResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateQAppWithUserInput,
  output: AssociateQAppWithUserResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes a library item for an Amazon Q App, removing it from the library so it can no longer be discovered or used by other users.
 */
export const deleteLibraryItem: (
  input: DeleteLibraryItemInput,
) => Effect.Effect<
  DeleteLibraryItemResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLibraryItemInput,
  output: DeleteLibraryItemResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Stops an active session for an Amazon Q App.This deletes all data related to the session and makes it invalid for future uses. The results of the session will be persisted as part of the conversation.
 */
export const stopQAppSession: (
  input: StopQAppSessionInput,
) => Effect.Effect<
  StopQAppSessionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopQAppSessionInput,
  output: StopQAppSessionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Associates a rating or review for a library item with the user submitting the request. This increments the rating count for the specified library item.
 */
export const associateLibraryItemReview: (
  input: AssociateLibraryItemReviewInput,
) => Effect.Effect<
  AssociateLibraryItemReviewResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateLibraryItemReviewInput,
  output: AssociateLibraryItemReviewResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Describes read permissions for a Amazon Q App in Amazon Q Business application environment instance.
 */
export const describeQAppPermissions: (
  input: DescribeQAppPermissionsInput,
) => Effect.Effect<
  DescribeQAppPermissionsOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeQAppPermissionsInput,
  output: DescribeQAppPermissionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about a library item for an Amazon Q App, including its metadata, categories, ratings, and usage statistics.
 */
export const getLibraryItem: (
  input: GetLibraryItemInput,
) => Effect.Effect<
  GetLibraryItemOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLibraryItemInput,
  output: GetLibraryItemOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists the library items for Amazon Q Apps that are published and available for users in your Amazon Web Services account.
 */
export const listLibraryItems: {
  (
    input: ListLibraryItemsInput,
  ): Effect.Effect<
    ListLibraryItemsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLibraryItemsInput,
  ) => Stream.Stream<
    ListLibraryItemsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLibraryItemsInput,
  ) => Stream.Stream<
    LibraryItemMember,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLibraryItemsInput,
  output: ListLibraryItemsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "libraryItems",
    pageSize: "limit",
  } as const,
}));
/**
 * Updates read permissions for a Amazon Q App in Amazon Q Business application environment instance.
 */
export const updateQAppPermissions: (
  input: UpdateQAppPermissionsInput,
) => Effect.Effect<
  UpdateQAppPermissionsOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQAppPermissionsInput,
  output: UpdateQAppPermissionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates Categories for the Amazon Q Business application environment instance. Web experience users use Categories to tag and filter library items. For more information, see Custom labels for Amazon Q Apps.
 */
export const batchCreateCategory: (
  input: BatchCreateCategoryInput,
) => Effect.Effect<
  BatchCreateCategoryResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateCategoryInput,
  output: BatchCreateCategoryResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates Categories for the Amazon Q Business application environment instance. Web experience users use Categories to tag and filter library items. For more information, see Custom labels for Amazon Q Apps.
 */
export const batchUpdateCategory: (
  input: BatchUpdateCategoryInput,
) => Effect.Effect<
  BatchUpdateCategoryResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateCategoryInput,
  output: BatchUpdateCategoryResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates the library item for an Amazon Q App.
 */
export const updateLibraryItem: (
  input: UpdateLibraryItemInput,
) => Effect.Effect<
  UpdateLibraryItemOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLibraryItemInput,
  output: UpdateLibraryItemOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes Categories for the Amazon Q Business application environment instance. Web experience users use Categories to tag and filter library items. For more information, see Custom labels for Amazon Q Apps.
 */
export const batchDeleteCategory: (
  input: BatchDeleteCategoryInput,
) => Effect.Effect<
  BatchDeleteCategoryResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteCategoryInput,
  output: BatchDeleteCategoryResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates the verification status of a library item for an Amazon Q App.
 */
export const updateLibraryItemMetadata: (
  input: UpdateLibraryItemMetadataInput,
) => Effect.Effect<
  UpdateLibraryItemMetadataResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLibraryItemMetadataInput,
  output: UpdateLibraryItemMetadataResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists the categories of a Amazon Q Business application environment instance. For more information, see Custom labels for Amazon Q Apps.
 */
export const listCategories: (
  input: ListCategoriesInput,
) => Effect.Effect<
  ListCategoriesOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCategoriesInput,
  output: ListCategoriesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon Q App owned by the user. If the Q App was previously published to the library, it is also removed from the library.
 */
export const deleteQApp: (
  input: DeleteQAppInput,
) => Effect.Effect<
  DeleteQAppResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQAppInput,
  output: DeleteQAppResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Disassociates a Q App from a user removing the user's access to run the Q App.
 */
export const disassociateQAppFromUser: (
  input: DisassociateQAppFromUserInput,
) => Effect.Effect<
  DisassociateQAppFromUserResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateQAppFromUserInput,
  output: DisassociateQAppFromUserResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates an existing Amazon Q App, allowing modifications to its title, description, and definition.
 */
export const updateQApp: (
  input: UpdateQAppInput,
) => Effect.Effect<
  UpdateQAppOutput,
  | AccessDeniedException
  | ContentTooLargeException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQAppInput,
  output: UpdateQAppOutput,
  errors: [
    AccessDeniedException,
    ContentTooLargeException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists the Amazon Q Apps owned by or associated with the user either because they created it or because they used it from the library in the past. The user identity is extracted from the credentials used to invoke this operation..
 */
export const listQApps: {
  (
    input: ListQAppsInput,
  ): Effect.Effect<
    ListQAppsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQAppsInput,
  ) => Stream.Stream<
    ListQAppsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQAppsInput,
  ) => Stream.Stream<
    UserAppItem,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQAppsInput,
  output: ListQAppsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "apps",
    pageSize: "limit",
  } as const,
}));
/**
 * Creates a new library item for an Amazon Q App, allowing it to be discovered and used by other allowed users.
 */
export const createLibraryItem: (
  input: CreateLibraryItemInput,
) => Effect.Effect<
  CreateLibraryItemOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLibraryItemInput,
  output: CreateLibraryItemOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists the tags associated with an Amazon Q Apps resource.
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
 * Disassociates tags from an Amazon Q Apps resource.
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
 * Creates a presigned URL for an S3 POST operation to upload a file. You can use this URL to set a default file for a `FileUploadCard` in a Q App definition or to provide a file for a single Q App run. The `scope` parameter determines how the file will be used, either at the app definition level or the app session level.
 *
 * The IAM permissions are derived from the `qapps:ImportDocument` action. For more information on the IAM policy for Amazon Q Apps, see IAM permissions for using Amazon Q Apps.
 */
export const createPresignedUrl: (
  input: CreatePresignedUrlInput,
) => Effect.Effect<
  CreatePresignedUrlOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePresignedUrlInput,
  output: CreatePresignedUrlOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves the full details of an Q App, including its definition specifying the cards and flow.
 */
export const getQApp: (
  input: GetQAppInput,
) => Effect.Effect<
  GetQAppOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQAppInput,
  output: GetQAppOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves the current state and results for an active session of an Amazon Q App.
 */
export const getQAppSession: (
  input: GetQAppSessionInput,
) => Effect.Effect<
  GetQAppSessionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQAppSessionInput,
  output: GetQAppSessionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Generates an Amazon Q App definition based on either a conversation or a problem statement provided as input.The resulting app definition can be used to call `CreateQApp`. This API doesn't create Amazon Q Apps directly.
 */
export const predictQApp: (
  input: PredictQAppInput,
) => Effect.Effect<
  PredictQAppOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PredictQAppInput,
  output: PredictQAppOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates a new Amazon Q App based on the provided definition. The Q App definition specifies the cards and flow of the Q App. This operation also calculates the dependencies between the cards by inspecting the references in the prompts.
 */
export const createQApp: (
  input: CreateQAppInput,
) => Effect.Effect<
  CreateQAppOutput,
  | AccessDeniedException
  | ConflictException
  | ContentTooLargeException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQAppInput,
  output: CreateQAppOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ContentTooLargeException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));

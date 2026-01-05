import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export const DeleteCategoryInputList = S.Array(S.String);
export const CategoryIdList = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class AssociateLibraryItemReviewInput extends S.Class<AssociateLibraryItemReviewInput>(
  "AssociateLibraryItemReviewInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/catalog.associateItemRating" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateLibraryItemReviewResponse extends S.Class<AssociateLibraryItemReviewResponse>(
  "AssociateLibraryItemReviewResponse",
)({}) {}
export class AssociateQAppWithUserInput extends S.Class<AssociateQAppWithUserInput>(
  "AssociateQAppWithUserInput",
)(
  { instanceId: S.String.pipe(T.HttpHeader("instance-id")), appId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/apps.install" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateQAppWithUserResponse extends S.Class<AssociateQAppWithUserResponse>(
  "AssociateQAppWithUserResponse",
)({}) {}
export class BatchDeleteCategoryInput extends S.Class<BatchDeleteCategoryInput>(
  "BatchDeleteCategoryInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    categories: DeleteCategoryInputList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/catalog.deleteCategories" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteCategoryResponse extends S.Class<BatchDeleteCategoryResponse>(
  "BatchDeleteCategoryResponse",
)({}) {}
export class CreateLibraryItemInput extends S.Class<CreateLibraryItemInput>(
  "CreateLibraryItemInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String,
    appVersion: S.Number,
    categories: CategoryIdList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/catalog.createItem" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePresignedUrlInput extends S.Class<CreatePresignedUrlInput>(
  "CreatePresignedUrlInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    cardId: S.String,
    appId: S.String,
    fileContentsSha256: S.String,
    fileName: S.String,
    scope: S.String,
    sessionId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/apps.createPresignedUrl" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLibraryItemInput extends S.Class<DeleteLibraryItemInput>(
  "DeleteLibraryItemInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/catalog.deleteItem" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLibraryItemResponse extends S.Class<DeleteLibraryItemResponse>(
  "DeleteLibraryItemResponse",
)({}) {}
export class DeleteQAppInput extends S.Class<DeleteQAppInput>(
  "DeleteQAppInput",
)(
  { instanceId: S.String.pipe(T.HttpHeader("instance-id")), appId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/apps.delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQAppResponse extends S.Class<DeleteQAppResponse>(
  "DeleteQAppResponse",
)({}) {}
export class DescribeQAppPermissionsInput extends S.Class<DescribeQAppPermissionsInput>(
  "DescribeQAppPermissionsInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String.pipe(T.HttpQuery("appId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/apps.describeQAppPermissions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateLibraryItemReviewInput extends S.Class<DisassociateLibraryItemReviewInput>(
  "DisassociateLibraryItemReviewInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/catalog.disassociateItemRating" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateLibraryItemReviewResponse extends S.Class<DisassociateLibraryItemReviewResponse>(
  "DisassociateLibraryItemReviewResponse",
)({}) {}
export class DisassociateQAppFromUserInput extends S.Class<DisassociateQAppFromUserInput>(
  "DisassociateQAppFromUserInput",
)(
  { instanceId: S.String.pipe(T.HttpHeader("instance-id")), appId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/apps.uninstall" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateQAppFromUserResponse extends S.Class<DisassociateQAppFromUserResponse>(
  "DisassociateQAppFromUserResponse",
)({}) {}
export class ExportQAppSessionDataInput extends S.Class<ExportQAppSessionDataInput>(
  "ExportQAppSessionDataInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/runtime.exportQAppSessionData" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLibraryItemInput extends S.Class<GetLibraryItemInput>(
  "GetLibraryItemInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String.pipe(T.HttpQuery("libraryItemId")),
    appId: S.optional(S.String).pipe(T.HttpQuery("appId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/catalog.getItem" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQAppInput extends S.Class<GetQAppInput>("GetQAppInput")(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String.pipe(T.HttpQuery("appId")),
    appVersion: S.optional(S.Number).pipe(T.HttpQuery("appVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/apps.get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQAppSessionInput extends S.Class<GetQAppSessionInput>(
  "GetQAppSessionInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/runtime.getQAppSession" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQAppSessionMetadataInput extends S.Class<GetQAppSessionMetadataInput>(
  "GetQAppSessionMetadataInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/runtime.getQAppSessionMetadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportDocumentInput extends S.Class<ImportDocumentInput>(
  "ImportDocumentInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    cardId: S.String,
    appId: S.String,
    fileContentsBase64: S.String,
    fileName: S.String,
    scope: S.String,
    sessionId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/apps.importDocument" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCategoriesInput extends S.Class<ListCategoriesInput>(
  "ListCategoriesInput",
)(
  { instanceId: S.String.pipe(T.HttpHeader("instance-id")) },
  T.all(
    T.Http({ method: "GET", uri: "/catalog.listCategories" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLibraryItemsInput extends S.Class<ListLibraryItemsInput>(
  "ListLibraryItemsInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    categoryId: S.optional(S.String).pipe(T.HttpQuery("categoryId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/catalog.list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQAppsInput extends S.Class<ListQAppsInput>("ListQAppsInput")(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/apps.list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQAppSessionDataInput extends S.Class<ListQAppSessionDataInput>(
  "ListQAppSessionDataInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/runtime.listQAppSessionData" }),
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
  { resourceARN: S.String.pipe(T.HttpLabel("resourceARN")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceARN}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopQAppSessionInput extends S.Class<StopQAppSessionInput>(
  "StopQAppSessionInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/runtime.deleteMiniAppRun" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopQAppSessionResponse extends S.Class<StopQAppSessionResponse>(
  "StopQAppSessionResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceARN: S.String.pipe(T.HttpLabel("resourceARN")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceARN}" }),
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
export class UpdateLibraryItemInput extends S.Class<UpdateLibraryItemInput>(
  "UpdateLibraryItemInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String,
    status: S.optional(S.String),
    categories: S.optional(CategoryIdList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/catalog.updateItem" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLibraryItemMetadataInput extends S.Class<UpdateLibraryItemMetadataInput>(
  "UpdateLibraryItemMetadataInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    libraryItemId: S.String,
    isVerified: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/catalog.updateItemMetadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLibraryItemMetadataResponse extends S.Class<UpdateLibraryItemMetadataResponse>(
  "UpdateLibraryItemMetadataResponse",
)({}) {}
export class TextInputCardInput extends S.Class<TextInputCardInput>(
  "TextInputCardInput",
)({
  title: S.String,
  id: S.String,
  type: S.String,
  placeholder: S.optional(S.String),
  defaultValue: S.optional(S.String),
}) {}
export const DocumentAttributeStringListValue = S.Array(S.String);
export const DocumentAttributeValue = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ stringListValue: DocumentAttributeStringListValue }),
  S.Struct({ longValue: S.Number }),
  S.Struct({ dateValue: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
);
export class DocumentAttribute extends S.Class<DocumentAttribute>(
  "DocumentAttribute",
)({ name: S.String, value: DocumentAttributeValue }) {}
export class AttributeFilter extends S.Class<AttributeFilter>(
  "AttributeFilter",
)({
  andAllFilters: S.optional(S.suspend(() => AttributeFilters)),
  orAllFilters: S.optional(S.suspend(() => AttributeFilters)),
  notFilter: S.optional(
    S.suspend((): S.Schema<AttributeFilter, any> => AttributeFilter),
  ),
  equalsTo: S.optional(DocumentAttribute),
  containsAll: S.optional(DocumentAttribute),
  containsAny: S.optional(DocumentAttribute),
  greaterThan: S.optional(DocumentAttribute),
  greaterThanOrEquals: S.optional(DocumentAttribute),
  lessThan: S.optional(DocumentAttribute),
  lessThanOrEquals: S.optional(DocumentAttribute),
}) {}
export class QQueryCardInput extends S.Class<QQueryCardInput>(
  "QQueryCardInput",
)({
  title: S.String,
  id: S.String,
  type: S.String,
  prompt: S.String,
  outputSource: S.optional(S.String),
  attributeFilter: S.optional(AttributeFilter),
}) {}
export class QPluginCardInput extends S.Class<QPluginCardInput>(
  "QPluginCardInput",
)({
  title: S.String,
  id: S.String,
  type: S.String,
  prompt: S.String,
  pluginId: S.String,
  actionIdentifier: S.optional(S.String),
}) {}
export class FileUploadCardInput extends S.Class<FileUploadCardInput>(
  "FileUploadCardInput",
)({
  title: S.String,
  id: S.String,
  type: S.String,
  filename: S.optional(S.String),
  fileId: S.optional(S.String),
  allowOverride: S.optional(S.Boolean),
}) {}
export class FormInputCardMetadata extends S.Class<FormInputCardMetadata>(
  "FormInputCardMetadata",
)({ schema: S.Any }) {}
export class FormInputCardInput extends S.Class<FormInputCardInput>(
  "FormInputCardInput",
)({
  title: S.String,
  id: S.String,
  type: S.String,
  metadata: FormInputCardMetadata,
  computeMode: S.optional(S.String),
}) {}
export const CardInput = S.Union(
  S.Struct({ textInput: TextInputCardInput }),
  S.Struct({ qQuery: QQueryCardInput }),
  S.Struct({ qPlugin: QPluginCardInput }),
  S.Struct({ fileUpload: FileUploadCardInput }),
  S.Struct({ formInput: FormInputCardInput }),
);
export const CardList = S.Array(CardInput);
export class AppDefinitionInput extends S.Class<AppDefinitionInput>(
  "AppDefinitionInput",
)({ cards: CardList, initialPrompt: S.optional(S.String) }) {}
export class UpdateQAppInput extends S.Class<UpdateQAppInput>(
  "UpdateQAppInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String,
    title: S.optional(S.String),
    description: S.optional(S.String),
    appDefinition: S.optional(AppDefinitionInput),
  },
  T.all(
    T.Http({ method: "POST", uri: "/apps.update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SubmissionMutation extends S.Class<SubmissionMutation>(
  "SubmissionMutation",
)({ submissionId: S.String, mutationType: S.String }) {}
export class CardValue extends S.Class<CardValue>("CardValue")({
  cardId: S.String,
  value: S.String,
  submissionMutation: S.optional(SubmissionMutation),
}) {}
export const CardValueList = S.Array(CardValue);
export class UpdateQAppSessionInput extends S.Class<UpdateQAppSessionInput>(
  "UpdateQAppSessionInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String,
    values: S.optional(CardValueList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/runtime.updateQAppSession" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchCreateCategoryInputCategory extends S.Class<BatchCreateCategoryInputCategory>(
  "BatchCreateCategoryInputCategory",
)({ id: S.optional(S.String), title: S.String, color: S.optional(S.String) }) {}
export const BatchCreateCategoryInputCategoryList = S.Array(
  BatchCreateCategoryInputCategory,
);
export class CategoryInput extends S.Class<CategoryInput>("CategoryInput")({
  id: S.String,
  title: S.String,
  color: S.optional(S.String),
}) {}
export const CategoryListInput = S.Array(CategoryInput);
export const TagMap = S.Record({ key: S.String, value: S.String });
export const AppRequiredCapabilities = S.Array(S.String);
export class Category extends S.Class<Category>("Category")({
  id: S.String,
  title: S.String,
  color: S.optional(S.String),
  appCount: S.optional(S.Number),
}) {}
export const CategoriesList = S.Array(Category);
export const Tags = S.Record({ key: S.String, value: S.String });
export class PermissionInput extends S.Class<PermissionInput>(
  "PermissionInput",
)({ action: S.String, principal: S.String }) {}
export const PermissionsInputList = S.Array(PermissionInput);
export class SessionSharingConfiguration extends S.Class<SessionSharingConfiguration>(
  "SessionSharingConfiguration",
)({
  enabled: S.Boolean,
  acceptResponses: S.optional(S.Boolean),
  revealCards: S.optional(S.Boolean),
}) {}
export class BatchCreateCategoryInput extends S.Class<BatchCreateCategoryInput>(
  "BatchCreateCategoryInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    categories: BatchCreateCategoryInputCategoryList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/catalog.createCategories" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchCreateCategoryResponse extends S.Class<BatchCreateCategoryResponse>(
  "BatchCreateCategoryResponse",
)({}) {}
export class BatchUpdateCategoryInput extends S.Class<BatchUpdateCategoryInput>(
  "BatchUpdateCategoryInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    categories: CategoryListInput,
  },
  T.all(
    T.Http({ method: "POST", uri: "/catalog.updateCategories" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateCategoryResponse extends S.Class<BatchUpdateCategoryResponse>(
  "BatchUpdateCategoryResponse",
)({}) {}
export class CreateLibraryItemOutput extends S.Class<CreateLibraryItemOutput>(
  "CreateLibraryItemOutput",
)({
  libraryItemId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  ratingCount: S.Number,
  isVerified: S.optional(S.Boolean),
}) {}
export class ExportQAppSessionDataOutput extends S.Class<ExportQAppSessionDataOutput>(
  "ExportQAppSessionDataOutput",
)({
  csvFileLink: S.String,
  expiresAt: S.Date.pipe(T.TimestampFormat("date-time")),
  sessionArn: S.String,
}) {}
export class GetQAppSessionMetadataOutput extends S.Class<GetQAppSessionMetadataOutput>(
  "GetQAppSessionMetadataOutput",
)({
  sessionId: S.String,
  sessionArn: S.String,
  sessionName: S.optional(S.String),
  sharingConfiguration: SessionSharingConfiguration,
  sessionOwner: S.optional(S.Boolean),
}) {}
export class ImportDocumentOutput extends S.Class<ImportDocumentOutput>(
  "ImportDocumentOutput",
)({ fileId: S.optional(S.String) }) {}
export class ListCategoriesOutput extends S.Class<ListCategoriesOutput>(
  "ListCategoriesOutput",
)({ categories: S.optional(CategoriesList) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceARN: S.String.pipe(T.HttpLabel("resourceARN")), tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceARN}" }),
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
export const CategoryList = S.Array(Category);
export class UpdateLibraryItemOutput extends S.Class<UpdateLibraryItemOutput>(
  "UpdateLibraryItemOutput",
)({
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
}) {}
export class UpdateQAppOutput extends S.Class<UpdateQAppOutput>(
  "UpdateQAppOutput",
)({
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
}) {}
export class UpdateQAppPermissionsInput extends S.Class<UpdateQAppPermissionsInput>(
  "UpdateQAppPermissionsInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String,
    grantPermissions: S.optional(PermissionsInputList),
    revokePermissions: S.optional(PermissionsInputList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/apps.updateQAppPermissions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQAppSessionOutput extends S.Class<UpdateQAppSessionOutput>(
  "UpdateQAppSessionOutput",
)({ sessionId: S.String, sessionArn: S.String }) {}
export class UpdateQAppSessionMetadataInput extends S.Class<UpdateQAppSessionMetadataInput>(
  "UpdateQAppSessionMetadataInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    sessionId: S.String,
    sessionName: S.optional(S.String),
    sharingConfiguration: SessionSharingConfiguration,
  },
  T.all(
    T.Http({ method: "POST", uri: "/runtime.updateQAppSessionMetadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ConversationMessage extends S.Class<ConversationMessage>(
  "ConversationMessage",
)({ body: S.String, type: S.String }) {}
export const MessageList = S.Array(ConversationMessage);
export const PresignedUrlFields = S.Record({ key: S.String, value: S.String });
export class LibraryItemMember extends S.Class<LibraryItemMember>(
  "LibraryItemMember",
)({
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
}) {}
export const LibraryItemList = S.Array(LibraryItemMember);
export class UserAppItem extends S.Class<UserAppItem>("UserAppItem")({
  appId: S.String,
  appArn: S.String,
  title: S.String,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  canEdit: S.optional(S.Boolean),
  status: S.optional(S.String),
  isVerified: S.optional(S.Boolean),
}) {}
export const UserAppsList = S.Array(UserAppItem);
export const PredictQAppInputOptions = S.Union(
  S.Struct({ conversation: MessageList }),
  S.Struct({ problemStatement: S.String }),
);
export class CreatePresignedUrlOutput extends S.Class<CreatePresignedUrlOutput>(
  "CreatePresignedUrlOutput",
)({
  fileId: S.String,
  presignedUrl: S.String,
  presignedUrlFields: PresignedUrlFields,
  presignedUrlExpiration: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export type AttributeFilters = AttributeFilter[];
export const AttributeFilters = S.Array(
  S.suspend((): S.Schema<AttributeFilter, any> => AttributeFilter),
) as any as S.Schema<AttributeFilters>;
export class GetLibraryItemOutput extends S.Class<GetLibraryItemOutput>(
  "GetLibraryItemOutput",
)({
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
}) {}
export class ListLibraryItemsOutput extends S.Class<ListLibraryItemsOutput>(
  "ListLibraryItemsOutput",
)({
  libraryItems: S.optional(LibraryItemList),
  nextToken: S.optional(S.String),
}) {}
export class ListQAppsOutput extends S.Class<ListQAppsOutput>(
  "ListQAppsOutput",
)({ apps: UserAppsList, nextToken: S.optional(S.String) }) {}
export class PredictQAppInput extends S.Class<PredictQAppInput>(
  "PredictQAppInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    options: S.optional(PredictQAppInputOptions),
  },
  T.all(
    T.Http({ method: "POST", uri: "/apps.predictQApp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartQAppSessionInput extends S.Class<StartQAppSessionInput>(
  "StartQAppSessionInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    appId: S.String,
    appVersion: S.Number,
    initialValues: S.optional(CardValueList),
    sessionId: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/runtime.startQAppSession" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PrincipalOutput extends S.Class<PrincipalOutput>(
  "PrincipalOutput",
)({
  userId: S.optional(S.String),
  userType: S.optional(S.String),
  email: S.optional(S.String),
}) {}
export class PermissionOutput extends S.Class<PermissionOutput>(
  "PermissionOutput",
)({ action: S.String, principal: PrincipalOutput }) {}
export const PermissionsOutputList = S.Array(PermissionOutput);
export class UpdateQAppPermissionsOutput extends S.Class<UpdateQAppPermissionsOutput>(
  "UpdateQAppPermissionsOutput",
)({
  resourceArn: S.optional(S.String),
  appId: S.optional(S.String),
  permissions: S.optional(PermissionsOutputList),
}) {}
export class UpdateQAppSessionMetadataOutput extends S.Class<UpdateQAppSessionMetadataOutput>(
  "UpdateQAppSessionMetadataOutput",
)({
  sessionId: S.String,
  sessionArn: S.String,
  sessionName: S.optional(S.String),
  sharingConfiguration: SessionSharingConfiguration,
}) {}
export class User extends S.Class<User>("User")({
  userId: S.optional(S.String),
}) {}
export const DependencyList = S.Array(S.String);
export const MemoryReferenceList = S.Array(S.String);
export class QAppSessionData extends S.Class<QAppSessionData>(
  "QAppSessionData",
)({
  cardId: S.String,
  value: S.optional(S.Any),
  user: User,
  submissionId: S.optional(S.String),
  timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const QAppSessionDataList = S.Array(QAppSessionData);
export class TextInputCard extends S.Class<TextInputCard>("TextInputCard")({
  id: S.String,
  title: S.String,
  dependencies: DependencyList,
  type: S.String,
  placeholder: S.optional(S.String),
  defaultValue: S.optional(S.String),
}) {}
export class QQueryCard extends S.Class<QQueryCard>("QQueryCard")({
  id: S.String,
  title: S.String,
  dependencies: DependencyList,
  type: S.String,
  prompt: S.String,
  outputSource: S.String,
  attributeFilter: S.optional(AttributeFilter),
  memoryReferences: S.optional(MemoryReferenceList),
}) {}
export class QPluginCard extends S.Class<QPluginCard>("QPluginCard")({
  id: S.String,
  title: S.String,
  dependencies: DependencyList,
  type: S.String,
  prompt: S.String,
  pluginType: S.String,
  pluginId: S.String,
  actionIdentifier: S.optional(S.String),
}) {}
export class FileUploadCard extends S.Class<FileUploadCard>("FileUploadCard")({
  id: S.String,
  title: S.String,
  dependencies: DependencyList,
  type: S.String,
  filename: S.optional(S.String),
  fileId: S.optional(S.String),
  allowOverride: S.optional(S.Boolean),
}) {}
export class FormInputCard extends S.Class<FormInputCard>("FormInputCard")({
  id: S.String,
  title: S.String,
  dependencies: DependencyList,
  type: S.String,
  metadata: FormInputCardMetadata,
  computeMode: S.optional(S.String),
}) {}
export class Submission extends S.Class<Submission>("Submission")({
  value: S.optional(S.Any),
  submissionId: S.optional(S.String),
  timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const SubmissionList = S.Array(Submission);
export class DescribeQAppPermissionsOutput extends S.Class<DescribeQAppPermissionsOutput>(
  "DescribeQAppPermissionsOutput",
)({
  resourceArn: S.optional(S.String),
  appId: S.optional(S.String),
  permissions: S.optional(PermissionsOutputList),
}) {}
export class ListQAppSessionDataOutput extends S.Class<ListQAppSessionDataOutput>(
  "ListQAppSessionDataOutput",
)({
  sessionId: S.String,
  sessionArn: S.String,
  sessionData: S.optional(QAppSessionDataList),
  nextToken: S.optional(S.String),
}) {}
export class StartQAppSessionOutput extends S.Class<StartQAppSessionOutput>(
  "StartQAppSessionOutput",
)({ sessionId: S.String, sessionArn: S.String }) {}
export const Card = S.Union(
  S.Struct({ textInput: TextInputCard }),
  S.Struct({ qQuery: QQueryCard }),
  S.Struct({ qPlugin: QPluginCard }),
  S.Struct({ fileUpload: FileUploadCard }),
  S.Struct({ formInput: FormInputCard }),
);
export const CardModelList = S.Array(Card);
export class CardStatus extends S.Class<CardStatus>("CardStatus")({
  currentState: S.String,
  currentValue: S.String,
  submissions: S.optional(SubmissionList),
}) {}
export class AppDefinition extends S.Class<AppDefinition>("AppDefinition")({
  appDefinitionVersion: S.String,
  cards: CardModelList,
  canEdit: S.optional(S.Boolean),
}) {}
export const CardStatusMap = S.Record({ key: S.String, value: CardStatus });
export class PredictAppDefinition extends S.Class<PredictAppDefinition>(
  "PredictAppDefinition",
)({
  title: S.String,
  description: S.optional(S.String),
  appDefinition: AppDefinitionInput,
}) {}
export class GetQAppOutput extends S.Class<GetQAppOutput>("GetQAppOutput")({
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
}) {}
export class GetQAppSessionOutput extends S.Class<GetQAppSessionOutput>(
  "GetQAppSessionOutput",
)({
  sessionId: S.String,
  sessionArn: S.String,
  sessionName: S.optional(S.String),
  appVersion: S.optional(S.Number),
  latestPublishedAppVersion: S.optional(S.Number),
  status: S.String,
  cardStatus: CardStatusMap,
  userIsHost: S.optional(S.Boolean),
}) {}
export class PredictQAppOutput extends S.Class<PredictQAppOutput>(
  "PredictQAppOutput",
)({ app: PredictAppDefinition, problemStatement: S.String }) {}
export class CreateQAppInput extends S.Class<CreateQAppInput>(
  "CreateQAppInput",
)(
  {
    instanceId: S.String.pipe(T.HttpHeader("instance-id")),
    title: S.String,
    description: S.optional(S.String),
    appDefinition: AppDefinitionInput,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/apps.create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateQAppOutput extends S.Class<CreateQAppOutput>(
  "CreateQAppOutput",
)({
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
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ContentTooLargeException extends S.TaggedError<ContentTooLargeException>()(
  "ContentTooLargeException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}

//# Operations
/**
 * Associates tags with an Amazon Q Apps resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listQAppSessionData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startQAppSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importDocument = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateQAppSessionMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Exports the collected data of a Q App data collection session.
 */
export const exportQAppSessionData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Removes a rating or review previously submitted by the user for a library item.
 */
export const disassociateLibraryItemReview =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQAppSessionMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the session for a given Q App `sessionId`. This is only valid when at least one card of the session is in the `WAITING` state. Data for each `WAITING` card can be provided as input. If inputs are not provided, the call will be accepted but session will not move forward. Inputs for cards that are not in the `WAITING` status will be ignored.
 */
export const updateQAppSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateQAppWithUser = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes a library item for an Amazon Q App, removing it from the library so it can no longer be discovered or used by other users.
 */
export const deleteLibraryItem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopQAppSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateLibraryItemReview = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Describes read permissions for a Amazon Q App in Amazon Q Business application environment instance.
 */
export const describeQAppPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves details about a library item for an Amazon Q App, including its metadata, categories, ratings, and usage statistics.
 */
export const getLibraryItem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listLibraryItems = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates read permissions for a Amazon Q App in Amazon Q Business application environment instance.
 */
export const updateQAppPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates Categories for the Amazon Q Business application environment instance. Web experience users use Categories to tag and filter library items. For more information, see Custom labels for Amazon Q Apps.
 */
export const batchCreateCategory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchUpdateCategory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLibraryItem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDeleteCategory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLibraryItemMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists the categories of a Amazon Q Business application environment instance. For more information, see Custom labels for Amazon Q Apps.
 */
export const listCategories = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteQApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateQAppFromUser = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates an existing Amazon Q App, allowing modifications to its title, description, and definition.
 */
export const updateQApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listQApps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListQAppsInput,
  output: ListQAppsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates a new library item for an Amazon Q App, allowing it to be discovered and used by other allowed users.
 */
export const createLibraryItem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPresignedUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQAppSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const predictQApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createQApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

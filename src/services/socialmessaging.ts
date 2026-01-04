import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "SocialMessaging",
  serviceShapeName: "SocialMessaging",
});
const auth = T.AwsAuthSigv4({ name: "social-messaging" });
const ver = T.ServiceVersion("2024-01-01");
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
                                url: "https://social-messaging-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://social-messaging-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://social-messaging.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://social-messaging.{Region}.{PartitionResult#dnsSuffix}",
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
export const StringList = S.Array(S.String);
export class CreateWhatsAppMessageTemplateInput extends S.Class<CreateWhatsAppMessageTemplateInput>(
  "CreateWhatsAppMessageTemplateInput",
)(
  { templateDefinition: T.Blob, id: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v1/whatsapp/template/put" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWhatsAppMessageTemplateInput extends S.Class<DeleteWhatsAppMessageTemplateInput>(
  "DeleteWhatsAppMessageTemplateInput",
)(
  {
    metaTemplateId: S.optional(S.String).pipe(T.HttpQuery("metaTemplateId")),
    deleteAllLanguages: S.optional(S.Boolean).pipe(
      T.HttpQuery("deleteAllTemplates"),
    ),
    id: S.String.pipe(T.HttpQuery("id")),
    templateName: S.String.pipe(T.HttpQuery("templateName")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/whatsapp/template" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWhatsAppMessageTemplateOutput extends S.Class<DeleteWhatsAppMessageTemplateOutput>(
  "DeleteWhatsAppMessageTemplateOutput",
)({}) {}
export class GetWhatsAppMessageTemplateInput extends S.Class<GetWhatsAppMessageTemplateInput>(
  "GetWhatsAppMessageTemplateInput",
)(
  {
    metaTemplateId: S.String.pipe(T.HttpQuery("metaTemplateId")),
    id: S.String.pipe(T.HttpQuery("id")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/whatsapp/template" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/tags/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWhatsAppMessageTemplatesInput extends S.Class<ListWhatsAppMessageTemplatesInput>(
  "ListWhatsAppMessageTemplatesInput",
)(
  {
    id: S.String.pipe(T.HttpQuery("id")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/whatsapp/template/list" }),
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
  { resourceArn: S.String, tagKeys: StringList },
  T.all(
    T.Http({ method: "POST", uri: "/v1/tags/untag-resource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWhatsAppMessageTemplateInput extends S.Class<UpdateWhatsAppMessageTemplateInput>(
  "UpdateWhatsAppMessageTemplateInput",
)(
  {
    id: S.String,
    metaTemplateId: S.String,
    templateCategory: S.optional(S.String),
    templateComponents: S.optional(T.Blob),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/whatsapp/template" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWhatsAppMessageTemplateOutput extends S.Class<UpdateWhatsAppMessageTemplateOutput>(
  "UpdateWhatsAppMessageTemplateOutput",
)({}) {}
export class S3File extends S.Class<S3File>("S3File")({
  bucketName: S.String,
  key: S.String,
}) {}
export const Filter = S.Record({ key: S.String, value: S.String });
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class CreateWhatsAppMessageTemplateOutput extends S.Class<CreateWhatsAppMessageTemplateOutput>(
  "CreateWhatsAppMessageTemplateOutput",
)({
  metaTemplateId: S.optional(S.String),
  templateStatus: S.optional(S.String),
  category: S.optional(S.String),
}) {}
export class CreateWhatsAppMessageTemplateMediaInput extends S.Class<CreateWhatsAppMessageTemplateMediaInput>(
  "CreateWhatsAppMessageTemplateMediaInput",
)(
  { id: S.String, sourceS3File: S.optional(S3File) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/whatsapp/template/media" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWhatsAppMessageTemplateOutput extends S.Class<GetWhatsAppMessageTemplateOutput>(
  "GetWhatsAppMessageTemplateOutput",
)({ template: S.optional(S.String) }) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ statusCode: S.optional(S.Number), tags: S.optional(TagList) }) {}
export class ListWhatsAppTemplateLibraryInput extends S.Class<ListWhatsAppTemplateLibraryInput>(
  "ListWhatsAppTemplateLibraryInput",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    id: S.String.pipe(T.HttpQuery("id")),
    filters: S.optional(Filter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/whatsapp/template/library" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/v1/tags/tag-resource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({ statusCode: S.optional(S.Number) }) {}
export class LibraryTemplateBodyInputs extends S.Class<LibraryTemplateBodyInputs>(
  "LibraryTemplateBodyInputs",
)({
  addContactNumber: S.optional(S.Boolean),
  addLearnMoreLink: S.optional(S.Boolean),
  addSecurityRecommendation: S.optional(S.Boolean),
  addTrackPackageLink: S.optional(S.Boolean),
  codeExpirationMinutes: S.optional(S.Number),
}) {}
export class TemplateSummary extends S.Class<TemplateSummary>(
  "TemplateSummary",
)({
  templateName: S.optional(S.String),
  metaTemplateId: S.optional(S.String),
  templateStatus: S.optional(S.String),
  templateQualityScore: S.optional(S.String),
  templateLanguage: S.optional(S.String),
  templateCategory: S.optional(S.String),
}) {}
export const TemplateSummaryList = S.Array(TemplateSummary);
export const MetaUrlWithSuffixExample = S.Record({
  key: S.String,
  value: S.String,
});
export const SupportedApp = S.Record({ key: S.String, value: S.String });
export const SupportedApps = S.Array(SupportedApp);
export class CreateWhatsAppMessageTemplateMediaOutput extends S.Class<CreateWhatsAppMessageTemplateMediaOutput>(
  "CreateWhatsAppMessageTemplateMediaOutput",
)({ metaHeaderHandle: S.optional(S.String) }) {}
export class ListWhatsAppMessageTemplatesOutput extends S.Class<ListWhatsAppMessageTemplatesOutput>(
  "ListWhatsAppMessageTemplatesOutput",
)({
  templates: S.optional(TemplateSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({ statusCode: S.optional(S.Number) }) {}
export class LibraryTemplateButtonInput extends S.Class<LibraryTemplateButtonInput>(
  "LibraryTemplateButtonInput",
)({
  type: S.optional(S.String),
  phoneNumber: S.optional(S.String),
  url: S.optional(MetaUrlWithSuffixExample),
  otpType: S.optional(S.String),
  zeroTapTermsAccepted: S.optional(S.Boolean),
  supportedApps: S.optional(SupportedApps),
}) {}
export const MetaLibraryTemplateButtonInputs = S.Array(
  LibraryTemplateButtonInput,
);
export const MetaIndustries = S.Array(S.String);
export class MetaLibraryTemplate extends S.Class<MetaLibraryTemplate>(
  "MetaLibraryTemplate",
)({
  templateName: S.String,
  libraryTemplateName: S.String,
  templateCategory: S.String,
  templateLanguage: S.String,
  libraryTemplateButtonInputs: S.optional(MetaLibraryTemplateButtonInputs),
  libraryTemplateBodyInputs: S.optional(LibraryTemplateBodyInputs),
}) {}
export class CreateWhatsAppMessageTemplateFromLibraryInput extends S.Class<CreateWhatsAppMessageTemplateFromLibraryInput>(
  "CreateWhatsAppMessageTemplateFromLibraryInput",
)(
  { metaLibraryTemplate: MetaLibraryTemplate, id: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v1/whatsapp/template/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LibraryTemplateButtonList extends S.Class<LibraryTemplateButtonList>(
  "LibraryTemplateButtonList",
)({
  type: S.optional(S.String),
  text: S.optional(S.String),
  phoneNumber: S.optional(S.String),
  url: S.optional(S.String),
  otpType: S.optional(S.String),
  zeroTapTermsAccepted: S.optional(S.Boolean),
  supportedApps: S.optional(SupportedApps),
}) {}
export const MetaLibraryTemplateButtonList = S.Array(LibraryTemplateButtonList);
export class MetaLibraryTemplateDefinition extends S.Class<MetaLibraryTemplateDefinition>(
  "MetaLibraryTemplateDefinition",
)({
  templateName: S.optional(S.String),
  templateLanguage: S.optional(S.String),
  templateCategory: S.optional(S.String),
  templateTopic: S.optional(S.String),
  templateUseCase: S.optional(S.String),
  templateIndustry: S.optional(MetaIndustries),
  templateHeader: S.optional(S.String),
  templateBody: S.optional(S.String),
  templateButtons: S.optional(MetaLibraryTemplateButtonList),
  templateId: S.optional(S.String),
}) {}
export const MetaLibraryTemplatesList = S.Array(MetaLibraryTemplateDefinition);
export class CreateWhatsAppMessageTemplateFromLibraryOutput extends S.Class<CreateWhatsAppMessageTemplateFromLibraryOutput>(
  "CreateWhatsAppMessageTemplateFromLibraryOutput",
)({
  metaTemplateId: S.optional(S.String),
  templateStatus: S.optional(S.String),
  category: S.optional(S.String),
}) {}
export class ListWhatsAppTemplateLibraryOutput extends S.Class<ListWhatsAppTemplateLibraryOutput>(
  "ListWhatsAppTemplateLibraryOutput",
)({
  metaLibraryTemplates: S.optional(MetaLibraryTemplatesList),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class DependencyException extends S.TaggedError<DependencyException>()(
  "DependencyException",
  {},
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  {},
) {}
export class InvalidParametersException extends S.TaggedError<InvalidParametersException>()(
  "InvalidParametersException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottledRequestException extends S.TaggedError<ThrottledRequestException>()(
  "ThrottledRequestException",
  {},
) {}

//# Operations
/**
 * List all tags associated with a resource, such as a phone number or WABA.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServiceException,
    InvalidParametersException,
    ThrottledRequestException,
  ],
}));
/**
 * Removes the specified tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    InternalServiceException,
    InvalidParametersException,
    ThrottledRequestException,
  ],
}));
/**
 * Updates an existing WhatsApp message template.
 */
export const updateWhatsAppMessageTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateWhatsAppMessageTemplateInput,
    output: UpdateWhatsAppMessageTemplateOutput,
    errors: [
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }));
/**
 * Creates a new WhatsApp message template from a custom definition.
 */
export const createWhatsAppMessageTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateWhatsAppMessageTemplateInput,
    output: CreateWhatsAppMessageTemplateOutput,
    errors: [
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }));
/**
 * Uploads media for use in a WhatsApp message template.
 */
export const createWhatsAppMessageTemplateMedia =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateWhatsAppMessageTemplateMediaInput,
    output: CreateWhatsAppMessageTemplateMediaOutput,
    errors: [
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }));
/**
 * Deletes a WhatsApp message template.
 */
export const deleteWhatsAppMessageTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteWhatsAppMessageTemplateInput,
    output: DeleteWhatsAppMessageTemplateOutput,
    errors: [
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }));
/**
 * Retrieves a specific WhatsApp message template.
 */
export const getWhatsAppMessageTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWhatsAppMessageTemplateInput,
    output: GetWhatsAppMessageTemplateOutput,
    errors: [
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }),
);
/**
 * Lists WhatsApp message templates for a specific WhatsApp Business Account.
 */
export const listWhatsAppMessageTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListWhatsAppMessageTemplatesInput,
    output: ListWhatsAppMessageTemplatesOutput,
    errors: [
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }));
/**
 * Adds or overwrites only the specified tags for the specified resource. When you specify
 * an existing tag key, the value is overwritten with the new value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    InternalServiceException,
    InvalidParametersException,
    ThrottledRequestException,
  ],
}));
/**
 * Creates a new WhatsApp message template using a template from Meta's template library.
 */
export const createWhatsAppMessageTemplateFromLibrary =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateWhatsAppMessageTemplateFromLibraryInput,
    output: CreateWhatsAppMessageTemplateFromLibraryOutput,
    errors: [
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }));
/**
 * Lists templates available in Meta's template library for WhatsApp messaging.
 */
export const listWhatsAppTemplateLibrary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListWhatsAppTemplateLibraryInput,
    output: ListWhatsAppTemplateLibraryOutput,
    errors: [
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }),
);

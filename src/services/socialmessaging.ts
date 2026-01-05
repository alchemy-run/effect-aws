import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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
export class GetLinkedWhatsAppBusinessAccountInput extends S.Class<GetLinkedWhatsAppBusinessAccountInput>(
  "GetLinkedWhatsAppBusinessAccountInput",
)(
  { id: S.String.pipe(T.HttpQuery("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/whatsapp/waba/details" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateWhatsAppBusinessAccountInput extends S.Class<DisassociateWhatsAppBusinessAccountInput>(
  "DisassociateWhatsAppBusinessAccountInput",
)(
  { id: S.String.pipe(T.HttpQuery("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/whatsapp/waba/disassociate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateWhatsAppBusinessAccountOutput extends S.Class<DisassociateWhatsAppBusinessAccountOutput>(
  "DisassociateWhatsAppBusinessAccountOutput",
)({}) {}
export class ListLinkedWhatsAppBusinessAccountsInput extends S.Class<ListLinkedWhatsAppBusinessAccountsInput>(
  "ListLinkedWhatsAppBusinessAccountsInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/whatsapp/waba/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLinkedWhatsAppBusinessAccountPhoneNumberInput extends S.Class<GetLinkedWhatsAppBusinessAccountPhoneNumberInput>(
  "GetLinkedWhatsAppBusinessAccountPhoneNumberInput",
)(
  { id: S.String.pipe(T.HttpQuery("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/whatsapp/waba/phone/details" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWhatsAppMessageMediaInput extends S.Class<DeleteWhatsAppMessageMediaInput>(
  "DeleteWhatsAppMessageMediaInput",
)(
  {
    mediaId: S.String.pipe(T.HttpQuery("mediaId")),
    originationPhoneNumberId: S.String.pipe(
      T.HttpQuery("originationPhoneNumberId"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/whatsapp/media" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Headers = S.Record({ key: S.String, value: S.String });
export class S3PresignedUrl extends S.Class<S3PresignedUrl>("S3PresignedUrl")({
  url: S.String,
  headers: Headers,
}) {}
export class S3File extends S.Class<S3File>("S3File")({
  bucketName: S.String,
  key: S.String,
}) {}
export class PostWhatsAppMessageMediaInput extends S.Class<PostWhatsAppMessageMediaInput>(
  "PostWhatsAppMessageMediaInput",
)(
  {
    originationPhoneNumberId: S.String,
    sourceS3PresignedUrl: S.optional(S3PresignedUrl),
    sourceS3File: S.optional(S3File),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/whatsapp/media" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendWhatsAppMessageInput extends S.Class<SendWhatsAppMessageInput>(
  "SendWhatsAppMessageInput",
)(
  {
    originationPhoneNumberId: S.String,
    message: T.Blob,
    metaApiVersion: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/whatsapp/send" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Filter = S.Record({ key: S.String, value: S.String });
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class WhatsAppSignupCallback extends S.Class<WhatsAppSignupCallback>(
  "WhatsAppSignupCallback",
)({ accessToken: S.String, callbackUrl: S.optional(S.String) }) {}
export class WhatsAppBusinessAccountEventDestination extends S.Class<WhatsAppBusinessAccountEventDestination>(
  "WhatsAppBusinessAccountEventDestination",
)({ eventDestinationArn: S.String, roleArn: S.optional(S.String) }) {}
export const WhatsAppBusinessAccountEventDestinations = S.Array(
  WhatsAppBusinessAccountEventDestination,
);
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
export class PutWhatsAppBusinessAccountEventDestinationsInput extends S.Class<PutWhatsAppBusinessAccountEventDestinationsInput>(
  "PutWhatsAppBusinessAccountEventDestinationsInput",
)(
  { id: S.String, eventDestinations: WhatsAppBusinessAccountEventDestinations },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/whatsapp/waba/eventdestinations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutWhatsAppBusinessAccountEventDestinationsOutput extends S.Class<PutWhatsAppBusinessAccountEventDestinationsOutput>(
  "PutWhatsAppBusinessAccountEventDestinationsOutput",
)({}) {}
export class DeleteWhatsAppMessageMediaOutput extends S.Class<DeleteWhatsAppMessageMediaOutput>(
  "DeleteWhatsAppMessageMediaOutput",
)({ success: S.optional(S.Boolean) }) {}
export class PostWhatsAppMessageMediaOutput extends S.Class<PostWhatsAppMessageMediaOutput>(
  "PostWhatsAppMessageMediaOutput",
)({ mediaId: S.optional(S.String) }) {}
export class SendWhatsAppMessageOutput extends S.Class<SendWhatsAppMessageOutput>(
  "SendWhatsAppMessageOutput",
)({ messageId: S.optional(S.String) }) {}
export class LibraryTemplateBodyInputs extends S.Class<LibraryTemplateBodyInputs>(
  "LibraryTemplateBodyInputs",
)({
  addContactNumber: S.optional(S.Boolean),
  addLearnMoreLink: S.optional(S.Boolean),
  addSecurityRecommendation: S.optional(S.Boolean),
  addTrackPackageLink: S.optional(S.Boolean),
  codeExpirationMinutes: S.optional(S.Number),
}) {}
export class WabaPhoneNumberSetupFinalization extends S.Class<WabaPhoneNumberSetupFinalization>(
  "WabaPhoneNumberSetupFinalization",
)({
  id: S.String,
  twoFactorPin: S.String,
  dataLocalizationRegion: S.optional(S.String),
  tags: S.optional(TagList),
}) {}
export const WabaPhoneNumberSetupFinalizationList = S.Array(
  WabaPhoneNumberSetupFinalization,
);
export class WabaSetupFinalization extends S.Class<WabaSetupFinalization>(
  "WabaSetupFinalization",
)({
  id: S.optional(S.String),
  eventDestinations: S.optional(WhatsAppBusinessAccountEventDestinations),
  tags: S.optional(TagList),
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
export class WhatsAppSetupFinalization extends S.Class<WhatsAppSetupFinalization>(
  "WhatsAppSetupFinalization",
)({
  associateInProgressToken: S.String,
  phoneNumbers: WabaPhoneNumberSetupFinalizationList,
  phoneNumberParent: S.optional(S.String),
  waba: S.optional(WabaSetupFinalization),
}) {}
export class LinkedWhatsAppBusinessAccountSummary extends S.Class<LinkedWhatsAppBusinessAccountSummary>(
  "LinkedWhatsAppBusinessAccountSummary",
)({
  arn: S.String,
  id: S.String,
  wabaId: S.String,
  registrationStatus: S.String,
  linkDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  wabaName: S.String,
  eventDestinations: WhatsAppBusinessAccountEventDestinations,
}) {}
export const LinkedWhatsAppBusinessAccountSummaryList = S.Array(
  LinkedWhatsAppBusinessAccountSummary,
);
export class WhatsAppPhoneNumberDetail extends S.Class<WhatsAppPhoneNumberDetail>(
  "WhatsAppPhoneNumberDetail",
)({
  arn: S.String,
  phoneNumber: S.String,
  phoneNumberId: S.String,
  metaPhoneNumberId: S.String,
  displayPhoneNumberName: S.String,
  displayPhoneNumber: S.String,
  qualityRating: S.String,
  dataLocalizationRegion: S.optional(S.String),
}) {}
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
export class AssociateWhatsAppBusinessAccountInput extends S.Class<AssociateWhatsAppBusinessAccountInput>(
  "AssociateWhatsAppBusinessAccountInput",
)(
  {
    signupCallback: S.optional(WhatsAppSignupCallback),
    setupFinalization: S.optional(WhatsAppSetupFinalization),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/whatsapp/signup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLinkedWhatsAppBusinessAccountsOutput extends S.Class<ListLinkedWhatsAppBusinessAccountsOutput>(
  "ListLinkedWhatsAppBusinessAccountsOutput",
)({
  linkedAccounts: S.optional(LinkedWhatsAppBusinessAccountSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class GetLinkedWhatsAppBusinessAccountPhoneNumberOutput extends S.Class<GetLinkedWhatsAppBusinessAccountPhoneNumberOutput>(
  "GetLinkedWhatsAppBusinessAccountPhoneNumberOutput",
)({
  phoneNumber: S.optional(WhatsAppPhoneNumberDetail),
  linkedWhatsAppBusinessAccountId: S.optional(S.String),
}) {}
export class GetWhatsAppMessageMediaInput extends S.Class<GetWhatsAppMessageMediaInput>(
  "GetWhatsAppMessageMediaInput",
)(
  {
    mediaId: S.String,
    originationPhoneNumberId: S.String,
    metadataOnly: S.optional(S.Boolean),
    destinationS3PresignedUrl: S.optional(S3PresignedUrl),
    destinationS3File: S.optional(S3File),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/whatsapp/media/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
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
export class WhatsAppPhoneNumberSummary extends S.Class<WhatsAppPhoneNumberSummary>(
  "WhatsAppPhoneNumberSummary",
)({
  arn: S.String,
  phoneNumber: S.String,
  phoneNumberId: S.String,
  metaPhoneNumberId: S.String,
  displayPhoneNumberName: S.String,
  displayPhoneNumber: S.String,
  qualityRating: S.String,
  dataLocalizationRegion: S.optional(S.String),
}) {}
export const WhatsAppPhoneNumberSummaryList = S.Array(
  WhatsAppPhoneNumberSummary,
);
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
export class LinkedWhatsAppBusinessAccount extends S.Class<LinkedWhatsAppBusinessAccount>(
  "LinkedWhatsAppBusinessAccount",
)({
  arn: S.String,
  id: S.String,
  wabaId: S.String,
  registrationStatus: S.String,
  linkDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  wabaName: S.String,
  eventDestinations: WhatsAppBusinessAccountEventDestinations,
  phoneNumbers: WhatsAppPhoneNumberSummaryList,
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
export class GetLinkedWhatsAppBusinessAccountOutput extends S.Class<GetLinkedWhatsAppBusinessAccountOutput>(
  "GetLinkedWhatsAppBusinessAccountOutput",
)({ account: S.optional(LinkedWhatsAppBusinessAccount) }) {}
export class GetWhatsAppMessageMediaOutput extends S.Class<GetWhatsAppMessageMediaOutput>(
  "GetWhatsAppMessageMediaOutput",
)({ mimeType: S.optional(S.String), fileSize: S.optional(S.Number) }) {}
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
export const WhatsAppPhoneNumberDetailList = S.Array(WhatsAppPhoneNumberDetail);
export class LinkedWhatsAppBusinessAccountIdMetaData extends S.Class<LinkedWhatsAppBusinessAccountIdMetaData>(
  "LinkedWhatsAppBusinessAccountIdMetaData",
)({
  accountName: S.optional(S.String),
  registrationStatus: S.optional(S.String),
  unregisteredWhatsAppPhoneNumbers: S.optional(WhatsAppPhoneNumberDetailList),
  wabaId: S.optional(S.String),
}) {}
export const LinkedAccountWithIncompleteSetup = S.Record({
  key: S.String,
  value: LinkedWhatsAppBusinessAccountIdMetaData,
});
export class WhatsAppSignupCallbackResult extends S.Class<WhatsAppSignupCallbackResult>(
  "WhatsAppSignupCallbackResult",
)({
  associateInProgressToken: S.optional(S.String),
  linkedAccountsWithIncompleteSetup: S.optional(
    LinkedAccountWithIncompleteSetup,
  ),
}) {}
export class AssociateWhatsAppBusinessAccountOutput extends S.Class<AssociateWhatsAppBusinessAccountOutput>(
  "AssociateWhatsAppBusinessAccountOutput",
)({
  signupCallbackResult: S.optional(WhatsAppSignupCallbackResult),
  statusCode: S.optional(S.Number),
}) {}

//# Errors
export class DependencyException extends S.TaggedError<DependencyException>()(
  "DependencyException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class AccessDeniedByMetaException extends S.TaggedError<AccessDeniedByMetaException>()(
  "AccessDeniedByMetaException",
  { message: S.optional(S.String) },
) {}
export class InvalidParametersException extends S.TaggedError<InvalidParametersException>()(
  "InvalidParametersException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ThrottledRequestException extends S.TaggedError<ThrottledRequestException>()(
  "ThrottledRequestException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
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
 * Send a WhatsApp message. For examples of sending a message using the Amazon Web Services
 * CLI, see Sending messages in the
 *
 * *Amazon Web Services End User Messaging Social User Guide*
 * .
 */
export const sendWhatsAppMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendWhatsAppMessageInput,
  output: SendWhatsAppMessageOutput,
  errors: [
    DependencyException,
    InternalServiceException,
    InvalidParametersException,
    ResourceNotFoundException,
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
 * Upload a media file to the WhatsApp service. Only the specified
 * `originationPhoneNumberId` has the permissions to send the media file when
 * using SendWhatsAppMessage. You must use either `sourceS3File`
 * or `sourceS3PresignedUrl` for the source. If both or neither are specified then an
 * `InvalidParameterException` is returned.
 */
export const postWhatsAppMessageMedia = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PostWhatsAppMessageMediaInput,
    output: PostWhatsAppMessageMediaOutput,
    errors: [
      AccessDeniedByMetaException,
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }),
);
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
 * List all WhatsApp Business Accounts linked to your Amazon Web Services account.
 */
export const listLinkedWhatsAppBusinessAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListLinkedWhatsAppBusinessAccountsInput,
    output: ListLinkedWhatsAppBusinessAccountsOutput,
    errors: [
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }));
/**
 * Use your WhatsApp phone number id to get the WABA account id and phone number
 * details.
 */
export const getLinkedWhatsAppBusinessAccountPhoneNumber =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetLinkedWhatsAppBusinessAccountPhoneNumberInput,
    output: GetLinkedWhatsAppBusinessAccountPhoneNumberOutput,
    errors: [
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }));
/**
 * Delete a media object from the WhatsApp service. If the object is still in an Amazon S3 bucket you should delete it from there too.
 */
export const deleteWhatsAppMessageMedia = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWhatsAppMessageMediaInput,
    output: DeleteWhatsAppMessageMediaOutput,
    errors: [
      AccessDeniedByMetaException,
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }),
);
/**
 * Get the details of your linked WhatsApp Business Account.
 */
export const getLinkedWhatsAppBusinessAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetLinkedWhatsAppBusinessAccountInput,
    output: GetLinkedWhatsAppBusinessAccountOutput,
    errors: [
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }));
/**
 * Get a media file from the WhatsApp service. On successful completion the media file is
 * retrieved from Meta and stored in the specified Amazon S3 bucket. Use either
 * `destinationS3File` or `destinationS3PresignedUrl` for the
 * destination. If both are used then an `InvalidParameterException` is
 * returned.
 */
export const getWhatsAppMessageMedia = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWhatsAppMessageMediaInput,
    output: GetWhatsAppMessageMediaOutput,
    errors: [
      AccessDeniedByMetaException,
      DependencyException,
      InternalServiceException,
      InvalidParametersException,
      ResourceNotFoundException,
      ThrottledRequestException,
    ],
  }),
);
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
 * Add an event destination to log event data from WhatsApp for a WhatsApp Business Account (WABA). A WABA can only have one event destination at a time. All resources associated with the WABA use the same event destination.
 */
export const putWhatsAppBusinessAccountEventDestinations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutWhatsAppBusinessAccountEventDestinationsInput,
    output: PutWhatsAppBusinessAccountEventDestinationsOutput,
    errors: [
      InternalServiceException,
      InvalidParametersException,
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
 * Disassociate a WhatsApp Business Account (WABA) from your Amazon Web Services account.
 */
export const disassociateWhatsAppBusinessAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateWhatsAppBusinessAccountInput,
    output: DisassociateWhatsAppBusinessAccountOutput,
    errors: [
      DependencyException,
      InvalidParametersException,
      ResourceNotFoundException,
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
/**
 * This is only used through the Amazon Web Services console during sign-up to associate your WhatsApp Business Account to your Amazon Web Services account.
 */
export const associateWhatsAppBusinessAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateWhatsAppBusinessAccountInput,
    output: AssociateWhatsAppBusinessAccountOutput,
    errors: [
      DependencyException,
      InvalidParametersException,
      LimitExceededException,
      ThrottledRequestException,
    ],
  }));

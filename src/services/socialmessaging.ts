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

//# Newtypes
export type LinkedWhatsAppBusinessAccountId = string;
export type MetaTemplateId = string;
export type MetaTemplateName = string;
export type Arn = string;
export type NextToken = string;
export type MaxResults = number;
export type MetaTemplateCategory = string;
export type WhatsAppPhoneNumberId = string;
export type WhatsAppMediaId = string;
export type MetaTemplateLanguage = string;
export type AssociateInProgressToken = string | Redacted.Redacted<string>;
export type EventDestinationArn = string;
export type RoleArn = string;
export type ErrorMessage = string;
export type MetaTemplate = string;
export type ButtonType = string;
export type PhoneNumber = string;
export type OtpType = string;
export type CodeExpirationMinutes = number;
export type WhatsAppPhoneNumber = string;
export type TwoFactorPin = string | Redacted.Redacted<string>;
export type IsoCountryCode = string;
export type WhatsAppBusinessAccountId = string;
export type MetaTemplateStatus = string;
export type MetaTemplateQualityScore = string;
export type LinkedWhatsAppBusinessAccountArn = string;
export type WhatsAppBusinessAccountName = string;
export type LinkedWhatsAppPhoneNumberArn = string;
export type WhatsAppPhoneNumberName = string;
export type WhatsAppDisplayPhoneNumber = string;
export type WhatsAppPhoneNumberQualityRating = string;
export type MetaTemplateTopic = string;
export type MetaTemplateUseCase = string;
export type MetaIndustry = string;
export type MetaTemplateHeader = string;
export type MetaTemplateBody = string;
export type MetaText = string;
export type MetaUrl = string;

//# Schemas
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface CreateWhatsAppMessageTemplateInput {
  templateDefinition: Uint8Array;
  id: string;
}
export const CreateWhatsAppMessageTemplateInput = S.suspend(() =>
  S.Struct({ templateDefinition: T.Blob, id: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/whatsapp/template/put" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWhatsAppMessageTemplateInput",
}) as any as S.Schema<CreateWhatsAppMessageTemplateInput>;
export interface DeleteWhatsAppMessageTemplateInput {
  metaTemplateId?: string;
  deleteAllLanguages?: boolean;
  id: string;
  templateName: string;
}
export const DeleteWhatsAppMessageTemplateInput = S.suspend(() =>
  S.Struct({
    metaTemplateId: S.optional(S.String).pipe(T.HttpQuery("metaTemplateId")),
    deleteAllLanguages: S.optional(S.Boolean).pipe(
      T.HttpQuery("deleteAllTemplates"),
    ),
    id: S.String.pipe(T.HttpQuery("id")),
    templateName: S.String.pipe(T.HttpQuery("templateName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/whatsapp/template" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWhatsAppMessageTemplateInput",
}) as any as S.Schema<DeleteWhatsAppMessageTemplateInput>;
export interface DeleteWhatsAppMessageTemplateOutput {}
export const DeleteWhatsAppMessageTemplateOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWhatsAppMessageTemplateOutput",
}) as any as S.Schema<DeleteWhatsAppMessageTemplateOutput>;
export interface GetWhatsAppMessageTemplateInput {
  metaTemplateId: string;
  id: string;
}
export const GetWhatsAppMessageTemplateInput = S.suspend(() =>
  S.Struct({
    metaTemplateId: S.String.pipe(T.HttpQuery("metaTemplateId")),
    id: S.String.pipe(T.HttpQuery("id")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/whatsapp/template" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWhatsAppMessageTemplateInput",
}) as any as S.Schema<GetWhatsAppMessageTemplateInput>;
export interface ListTagsForResourceInput {
  resourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/tags/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface ListWhatsAppMessageTemplatesInput {
  id: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListWhatsAppMessageTemplatesInput = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpQuery("id")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/whatsapp/template/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWhatsAppMessageTemplatesInput",
}) as any as S.Schema<ListWhatsAppMessageTemplatesInput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: StringList;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: StringList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/tags/untag-resource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UpdateWhatsAppMessageTemplateInput {
  id: string;
  metaTemplateId: string;
  templateCategory?: string;
  templateComponents?: Uint8Array;
}
export const UpdateWhatsAppMessageTemplateInput = S.suspend(() =>
  S.Struct({
    id: S.String,
    metaTemplateId: S.String,
    templateCategory: S.optional(S.String),
    templateComponents: S.optional(T.Blob),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/whatsapp/template" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWhatsAppMessageTemplateInput",
}) as any as S.Schema<UpdateWhatsAppMessageTemplateInput>;
export interface UpdateWhatsAppMessageTemplateOutput {}
export const UpdateWhatsAppMessageTemplateOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateWhatsAppMessageTemplateOutput",
}) as any as S.Schema<UpdateWhatsAppMessageTemplateOutput>;
export interface GetLinkedWhatsAppBusinessAccountInput {
  id: string;
}
export const GetLinkedWhatsAppBusinessAccountInput = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpQuery("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/whatsapp/waba/details" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLinkedWhatsAppBusinessAccountInput",
}) as any as S.Schema<GetLinkedWhatsAppBusinessAccountInput>;
export interface DisassociateWhatsAppBusinessAccountInput {
  id: string;
}
export const DisassociateWhatsAppBusinessAccountInput = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpQuery("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/whatsapp/waba/disassociate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateWhatsAppBusinessAccountInput",
}) as any as S.Schema<DisassociateWhatsAppBusinessAccountInput>;
export interface DisassociateWhatsAppBusinessAccountOutput {}
export const DisassociateWhatsAppBusinessAccountOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateWhatsAppBusinessAccountOutput",
}) as any as S.Schema<DisassociateWhatsAppBusinessAccountOutput>;
export interface ListLinkedWhatsAppBusinessAccountsInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListLinkedWhatsAppBusinessAccountsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/whatsapp/waba/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLinkedWhatsAppBusinessAccountsInput",
}) as any as S.Schema<ListLinkedWhatsAppBusinessAccountsInput>;
export interface GetLinkedWhatsAppBusinessAccountPhoneNumberInput {
  id: string;
}
export const GetLinkedWhatsAppBusinessAccountPhoneNumberInput = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpQuery("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/whatsapp/waba/phone/details" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLinkedWhatsAppBusinessAccountPhoneNumberInput",
}) as any as S.Schema<GetLinkedWhatsAppBusinessAccountPhoneNumberInput>;
export interface DeleteWhatsAppMessageMediaInput {
  mediaId: string;
  originationPhoneNumberId: string;
}
export const DeleteWhatsAppMessageMediaInput = S.suspend(() =>
  S.Struct({
    mediaId: S.String.pipe(T.HttpQuery("mediaId")),
    originationPhoneNumberId: S.String.pipe(
      T.HttpQuery("originationPhoneNumberId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/whatsapp/media" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWhatsAppMessageMediaInput",
}) as any as S.Schema<DeleteWhatsAppMessageMediaInput>;
export type Headers = { [key: string]: string };
export const Headers = S.Record({ key: S.String, value: S.String });
export interface S3PresignedUrl {
  url: string;
  headers: Headers;
}
export const S3PresignedUrl = S.suspend(() =>
  S.Struct({ url: S.String, headers: Headers }),
).annotations({
  identifier: "S3PresignedUrl",
}) as any as S.Schema<S3PresignedUrl>;
export interface S3File {
  bucketName: string;
  key: string;
}
export const S3File = S.suspend(() =>
  S.Struct({ bucketName: S.String, key: S.String }),
).annotations({ identifier: "S3File" }) as any as S.Schema<S3File>;
export interface PostWhatsAppMessageMediaInput {
  originationPhoneNumberId: string;
  sourceS3PresignedUrl?: S3PresignedUrl;
  sourceS3File?: S3File;
}
export const PostWhatsAppMessageMediaInput = S.suspend(() =>
  S.Struct({
    originationPhoneNumberId: S.String,
    sourceS3PresignedUrl: S.optional(S3PresignedUrl),
    sourceS3File: S.optional(S3File),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/whatsapp/media" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PostWhatsAppMessageMediaInput",
}) as any as S.Schema<PostWhatsAppMessageMediaInput>;
export interface SendWhatsAppMessageInput {
  originationPhoneNumberId: string;
  message: Uint8Array | Redacted.Redacted<Uint8Array>;
  metaApiVersion: string;
}
export const SendWhatsAppMessageInput = S.suspend(() =>
  S.Struct({
    originationPhoneNumberId: S.String,
    message: SensitiveBlob,
    metaApiVersion: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/whatsapp/send" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendWhatsAppMessageInput",
}) as any as S.Schema<SendWhatsAppMessageInput>;
export type Filter = { [key: string]: string };
export const Filter = S.Record({ key: S.String, value: S.String });
export interface Tag {
  key: string;
  value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface WhatsAppSignupCallback {
  accessToken: string;
  callbackUrl?: string;
}
export const WhatsAppSignupCallback = S.suspend(() =>
  S.Struct({ accessToken: S.String, callbackUrl: S.optional(S.String) }),
).annotations({
  identifier: "WhatsAppSignupCallback",
}) as any as S.Schema<WhatsAppSignupCallback>;
export interface WhatsAppBusinessAccountEventDestination {
  eventDestinationArn: string;
  roleArn?: string;
}
export const WhatsAppBusinessAccountEventDestination = S.suspend(() =>
  S.Struct({ eventDestinationArn: S.String, roleArn: S.optional(S.String) }),
).annotations({
  identifier: "WhatsAppBusinessAccountEventDestination",
}) as any as S.Schema<WhatsAppBusinessAccountEventDestination>;
export type WhatsAppBusinessAccountEventDestinations =
  WhatsAppBusinessAccountEventDestination[];
export const WhatsAppBusinessAccountEventDestinations = S.Array(
  WhatsAppBusinessAccountEventDestination,
);
export interface CreateWhatsAppMessageTemplateOutput {
  metaTemplateId?: string;
  templateStatus?: string;
  category?: string;
}
export const CreateWhatsAppMessageTemplateOutput = S.suspend(() =>
  S.Struct({
    metaTemplateId: S.optional(S.String),
    templateStatus: S.optional(S.String),
    category: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateWhatsAppMessageTemplateOutput",
}) as any as S.Schema<CreateWhatsAppMessageTemplateOutput>;
export interface CreateWhatsAppMessageTemplateMediaInput {
  id: string;
  sourceS3File?: S3File;
}
export const CreateWhatsAppMessageTemplateMediaInput = S.suspend(() =>
  S.Struct({ id: S.String, sourceS3File: S.optional(S3File) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/whatsapp/template/media" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWhatsAppMessageTemplateMediaInput",
}) as any as S.Schema<CreateWhatsAppMessageTemplateMediaInput>;
export interface GetWhatsAppMessageTemplateOutput {
  template?: string;
}
export const GetWhatsAppMessageTemplateOutput = S.suspend(() =>
  S.Struct({ template: S.optional(S.String) }),
).annotations({
  identifier: "GetWhatsAppMessageTemplateOutput",
}) as any as S.Schema<GetWhatsAppMessageTemplateOutput>;
export interface ListTagsForResourceOutput {
  statusCode?: number;
  tags?: TagList;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ statusCode: S.optional(S.Number), tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface ListWhatsAppTemplateLibraryInput {
  nextToken?: string;
  maxResults?: number;
  id: string;
  filters?: Filter;
}
export const ListWhatsAppTemplateLibraryInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    id: S.String.pipe(T.HttpQuery("id")),
    filters: S.optional(Filter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/whatsapp/template/library" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWhatsAppTemplateLibraryInput",
}) as any as S.Schema<ListWhatsAppTemplateLibraryInput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: TagList;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/tags/tag-resource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface UntagResourceOutput {
  statusCode?: number;
}
export const UntagResourceOutput = S.suspend(() =>
  S.Struct({ statusCode: S.optional(S.Number) }),
).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface PutWhatsAppBusinessAccountEventDestinationsInput {
  id: string;
  eventDestinations: WhatsAppBusinessAccountEventDestinations;
}
export const PutWhatsAppBusinessAccountEventDestinationsInput = S.suspend(() =>
  S.Struct({
    id: S.String,
    eventDestinations: WhatsAppBusinessAccountEventDestinations,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/whatsapp/waba/eventdestinations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutWhatsAppBusinessAccountEventDestinationsInput",
}) as any as S.Schema<PutWhatsAppBusinessAccountEventDestinationsInput>;
export interface PutWhatsAppBusinessAccountEventDestinationsOutput {}
export const PutWhatsAppBusinessAccountEventDestinationsOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutWhatsAppBusinessAccountEventDestinationsOutput",
}) as any as S.Schema<PutWhatsAppBusinessAccountEventDestinationsOutput>;
export interface DeleteWhatsAppMessageMediaOutput {
  success?: boolean;
}
export const DeleteWhatsAppMessageMediaOutput = S.suspend(() =>
  S.Struct({ success: S.optional(S.Boolean) }),
).annotations({
  identifier: "DeleteWhatsAppMessageMediaOutput",
}) as any as S.Schema<DeleteWhatsAppMessageMediaOutput>;
export interface PostWhatsAppMessageMediaOutput {
  mediaId?: string;
}
export const PostWhatsAppMessageMediaOutput = S.suspend(() =>
  S.Struct({ mediaId: S.optional(S.String) }),
).annotations({
  identifier: "PostWhatsAppMessageMediaOutput",
}) as any as S.Schema<PostWhatsAppMessageMediaOutput>;
export interface SendWhatsAppMessageOutput {
  messageId?: string;
}
export const SendWhatsAppMessageOutput = S.suspend(() =>
  S.Struct({ messageId: S.optional(S.String) }),
).annotations({
  identifier: "SendWhatsAppMessageOutput",
}) as any as S.Schema<SendWhatsAppMessageOutput>;
export interface LibraryTemplateBodyInputs {
  addContactNumber?: boolean;
  addLearnMoreLink?: boolean;
  addSecurityRecommendation?: boolean;
  addTrackPackageLink?: boolean;
  codeExpirationMinutes?: number;
}
export const LibraryTemplateBodyInputs = S.suspend(() =>
  S.Struct({
    addContactNumber: S.optional(S.Boolean),
    addLearnMoreLink: S.optional(S.Boolean),
    addSecurityRecommendation: S.optional(S.Boolean),
    addTrackPackageLink: S.optional(S.Boolean),
    codeExpirationMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "LibraryTemplateBodyInputs",
}) as any as S.Schema<LibraryTemplateBodyInputs>;
export interface WabaPhoneNumberSetupFinalization {
  id: string;
  twoFactorPin: string | Redacted.Redacted<string>;
  dataLocalizationRegion?: string;
  tags?: TagList;
}
export const WabaPhoneNumberSetupFinalization = S.suspend(() =>
  S.Struct({
    id: S.String,
    twoFactorPin: SensitiveString,
    dataLocalizationRegion: S.optional(S.String),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "WabaPhoneNumberSetupFinalization",
}) as any as S.Schema<WabaPhoneNumberSetupFinalization>;
export type WabaPhoneNumberSetupFinalizationList =
  WabaPhoneNumberSetupFinalization[];
export const WabaPhoneNumberSetupFinalizationList = S.Array(
  WabaPhoneNumberSetupFinalization,
);
export interface WabaSetupFinalization {
  id?: string;
  eventDestinations?: WhatsAppBusinessAccountEventDestinations;
  tags?: TagList;
}
export const WabaSetupFinalization = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    eventDestinations: S.optional(WhatsAppBusinessAccountEventDestinations),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "WabaSetupFinalization",
}) as any as S.Schema<WabaSetupFinalization>;
export interface TemplateSummary {
  templateName?: string;
  metaTemplateId?: string;
  templateStatus?: string;
  templateQualityScore?: string;
  templateLanguage?: string;
  templateCategory?: string;
}
export const TemplateSummary = S.suspend(() =>
  S.Struct({
    templateName: S.optional(S.String),
    metaTemplateId: S.optional(S.String),
    templateStatus: S.optional(S.String),
    templateQualityScore: S.optional(S.String),
    templateLanguage: S.optional(S.String),
    templateCategory: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplateSummary",
}) as any as S.Schema<TemplateSummary>;
export type TemplateSummaryList = TemplateSummary[];
export const TemplateSummaryList = S.Array(TemplateSummary);
export interface WhatsAppSetupFinalization {
  associateInProgressToken: string | Redacted.Redacted<string>;
  phoneNumbers: WabaPhoneNumberSetupFinalizationList;
  phoneNumberParent?: string;
  waba?: WabaSetupFinalization;
}
export const WhatsAppSetupFinalization = S.suspend(() =>
  S.Struct({
    associateInProgressToken: SensitiveString,
    phoneNumbers: WabaPhoneNumberSetupFinalizationList,
    phoneNumberParent: S.optional(S.String),
    waba: S.optional(WabaSetupFinalization),
  }),
).annotations({
  identifier: "WhatsAppSetupFinalization",
}) as any as S.Schema<WhatsAppSetupFinalization>;
export interface LinkedWhatsAppBusinessAccountSummary {
  arn: string;
  id: string;
  wabaId: string;
  registrationStatus: string;
  linkDate: Date;
  wabaName: string;
  eventDestinations: WhatsAppBusinessAccountEventDestinations;
}
export const LinkedWhatsAppBusinessAccountSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    id: S.String,
    wabaId: S.String,
    registrationStatus: S.String,
    linkDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    wabaName: S.String,
    eventDestinations: WhatsAppBusinessAccountEventDestinations,
  }),
).annotations({
  identifier: "LinkedWhatsAppBusinessAccountSummary",
}) as any as S.Schema<LinkedWhatsAppBusinessAccountSummary>;
export type LinkedWhatsAppBusinessAccountSummaryList =
  LinkedWhatsAppBusinessAccountSummary[];
export const LinkedWhatsAppBusinessAccountSummaryList = S.Array(
  LinkedWhatsAppBusinessAccountSummary,
);
export interface WhatsAppPhoneNumberDetail {
  arn: string;
  phoneNumber: string;
  phoneNumberId: string;
  metaPhoneNumberId: string;
  displayPhoneNumberName: string;
  displayPhoneNumber: string;
  qualityRating: string;
  dataLocalizationRegion?: string;
}
export const WhatsAppPhoneNumberDetail = S.suspend(() =>
  S.Struct({
    arn: S.String,
    phoneNumber: S.String,
    phoneNumberId: S.String,
    metaPhoneNumberId: S.String,
    displayPhoneNumberName: S.String,
    displayPhoneNumber: S.String,
    qualityRating: S.String,
    dataLocalizationRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "WhatsAppPhoneNumberDetail",
}) as any as S.Schema<WhatsAppPhoneNumberDetail>;
export type MetaUrlWithSuffixExample = { [key: string]: string };
export const MetaUrlWithSuffixExample = S.Record({
  key: S.String,
  value: S.String,
});
export type SupportedApp = { [key: string]: string };
export const SupportedApp = S.Record({ key: S.String, value: S.String });
export type SupportedApps = SupportedApp[];
export const SupportedApps = S.Array(SupportedApp);
export interface CreateWhatsAppMessageTemplateMediaOutput {
  metaHeaderHandle?: string;
}
export const CreateWhatsAppMessageTemplateMediaOutput = S.suspend(() =>
  S.Struct({ metaHeaderHandle: S.optional(S.String) }),
).annotations({
  identifier: "CreateWhatsAppMessageTemplateMediaOutput",
}) as any as S.Schema<CreateWhatsAppMessageTemplateMediaOutput>;
export interface ListWhatsAppMessageTemplatesOutput {
  templates?: TemplateSummaryList;
  nextToken?: string;
}
export const ListWhatsAppMessageTemplatesOutput = S.suspend(() =>
  S.Struct({
    templates: S.optional(TemplateSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWhatsAppMessageTemplatesOutput",
}) as any as S.Schema<ListWhatsAppMessageTemplatesOutput>;
export interface TagResourceOutput {
  statusCode?: number;
}
export const TagResourceOutput = S.suspend(() =>
  S.Struct({ statusCode: S.optional(S.Number) }),
).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface AssociateWhatsAppBusinessAccountInput {
  signupCallback?: WhatsAppSignupCallback;
  setupFinalization?: WhatsAppSetupFinalization;
}
export const AssociateWhatsAppBusinessAccountInput = S.suspend(() =>
  S.Struct({
    signupCallback: S.optional(WhatsAppSignupCallback),
    setupFinalization: S.optional(WhatsAppSetupFinalization),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/whatsapp/signup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateWhatsAppBusinessAccountInput",
}) as any as S.Schema<AssociateWhatsAppBusinessAccountInput>;
export interface ListLinkedWhatsAppBusinessAccountsOutput {
  linkedAccounts?: LinkedWhatsAppBusinessAccountSummaryList;
  nextToken?: string;
}
export const ListLinkedWhatsAppBusinessAccountsOutput = S.suspend(() =>
  S.Struct({
    linkedAccounts: S.optional(LinkedWhatsAppBusinessAccountSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLinkedWhatsAppBusinessAccountsOutput",
}) as any as S.Schema<ListLinkedWhatsAppBusinessAccountsOutput>;
export interface GetLinkedWhatsAppBusinessAccountPhoneNumberOutput {
  phoneNumber?: WhatsAppPhoneNumberDetail;
  linkedWhatsAppBusinessAccountId?: string;
}
export const GetLinkedWhatsAppBusinessAccountPhoneNumberOutput = S.suspend(() =>
  S.Struct({
    phoneNumber: S.optional(WhatsAppPhoneNumberDetail),
    linkedWhatsAppBusinessAccountId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetLinkedWhatsAppBusinessAccountPhoneNumberOutput",
}) as any as S.Schema<GetLinkedWhatsAppBusinessAccountPhoneNumberOutput>;
export interface GetWhatsAppMessageMediaInput {
  mediaId: string;
  originationPhoneNumberId: string;
  metadataOnly?: boolean;
  destinationS3PresignedUrl?: S3PresignedUrl;
  destinationS3File?: S3File;
}
export const GetWhatsAppMessageMediaInput = S.suspend(() =>
  S.Struct({
    mediaId: S.String,
    originationPhoneNumberId: S.String,
    metadataOnly: S.optional(S.Boolean),
    destinationS3PresignedUrl: S.optional(S3PresignedUrl),
    destinationS3File: S.optional(S3File),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/whatsapp/media/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWhatsAppMessageMediaInput",
}) as any as S.Schema<GetWhatsAppMessageMediaInput>;
export interface LibraryTemplateButtonInput {
  type?: string;
  phoneNumber?: string;
  url?: MetaUrlWithSuffixExample;
  otpType?: string;
  zeroTapTermsAccepted?: boolean;
  supportedApps?: SupportedApps;
}
export const LibraryTemplateButtonInput = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    phoneNumber: S.optional(S.String),
    url: S.optional(MetaUrlWithSuffixExample),
    otpType: S.optional(S.String),
    zeroTapTermsAccepted: S.optional(S.Boolean),
    supportedApps: S.optional(SupportedApps),
  }),
).annotations({
  identifier: "LibraryTemplateButtonInput",
}) as any as S.Schema<LibraryTemplateButtonInput>;
export type MetaLibraryTemplateButtonInputs = LibraryTemplateButtonInput[];
export const MetaLibraryTemplateButtonInputs = S.Array(
  LibraryTemplateButtonInput,
);
export type MetaIndustries = string[];
export const MetaIndustries = S.Array(S.String);
export interface WhatsAppPhoneNumberSummary {
  arn: string;
  phoneNumber: string;
  phoneNumberId: string;
  metaPhoneNumberId: string;
  displayPhoneNumberName: string;
  displayPhoneNumber: string;
  qualityRating: string;
  dataLocalizationRegion?: string;
}
export const WhatsAppPhoneNumberSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    phoneNumber: S.String,
    phoneNumberId: S.String,
    metaPhoneNumberId: S.String,
    displayPhoneNumberName: S.String,
    displayPhoneNumber: S.String,
    qualityRating: S.String,
    dataLocalizationRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "WhatsAppPhoneNumberSummary",
}) as any as S.Schema<WhatsAppPhoneNumberSummary>;
export type WhatsAppPhoneNumberSummaryList = WhatsAppPhoneNumberSummary[];
export const WhatsAppPhoneNumberSummaryList = S.Array(
  WhatsAppPhoneNumberSummary,
);
export interface MetaLibraryTemplate {
  templateName: string;
  libraryTemplateName: string;
  templateCategory: string;
  templateLanguage: string;
  libraryTemplateButtonInputs?: MetaLibraryTemplateButtonInputs;
  libraryTemplateBodyInputs?: LibraryTemplateBodyInputs;
}
export const MetaLibraryTemplate = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    libraryTemplateName: S.String,
    templateCategory: S.String,
    templateLanguage: S.String,
    libraryTemplateButtonInputs: S.optional(MetaLibraryTemplateButtonInputs),
    libraryTemplateBodyInputs: S.optional(LibraryTemplateBodyInputs),
  }),
).annotations({
  identifier: "MetaLibraryTemplate",
}) as any as S.Schema<MetaLibraryTemplate>;
export interface LinkedWhatsAppBusinessAccount {
  arn: string;
  id: string;
  wabaId: string;
  registrationStatus: string;
  linkDate: Date;
  wabaName: string;
  eventDestinations: WhatsAppBusinessAccountEventDestinations;
  phoneNumbers: WhatsAppPhoneNumberSummaryList;
}
export const LinkedWhatsAppBusinessAccount = S.suspend(() =>
  S.Struct({
    arn: S.String,
    id: S.String,
    wabaId: S.String,
    registrationStatus: S.String,
    linkDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    wabaName: S.String,
    eventDestinations: WhatsAppBusinessAccountEventDestinations,
    phoneNumbers: WhatsAppPhoneNumberSummaryList,
  }),
).annotations({
  identifier: "LinkedWhatsAppBusinessAccount",
}) as any as S.Schema<LinkedWhatsAppBusinessAccount>;
export interface CreateWhatsAppMessageTemplateFromLibraryInput {
  metaLibraryTemplate: MetaLibraryTemplate;
  id: string;
}
export const CreateWhatsAppMessageTemplateFromLibraryInput = S.suspend(() =>
  S.Struct({ metaLibraryTemplate: MetaLibraryTemplate, id: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/whatsapp/template/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWhatsAppMessageTemplateFromLibraryInput",
}) as any as S.Schema<CreateWhatsAppMessageTemplateFromLibraryInput>;
export interface GetLinkedWhatsAppBusinessAccountOutput {
  account?: LinkedWhatsAppBusinessAccount;
}
export const GetLinkedWhatsAppBusinessAccountOutput = S.suspend(() =>
  S.Struct({ account: S.optional(LinkedWhatsAppBusinessAccount) }),
).annotations({
  identifier: "GetLinkedWhatsAppBusinessAccountOutput",
}) as any as S.Schema<GetLinkedWhatsAppBusinessAccountOutput>;
export interface GetWhatsAppMessageMediaOutput {
  mimeType?: string;
  fileSize?: number;
}
export const GetWhatsAppMessageMediaOutput = S.suspend(() =>
  S.Struct({ mimeType: S.optional(S.String), fileSize: S.optional(S.Number) }),
).annotations({
  identifier: "GetWhatsAppMessageMediaOutput",
}) as any as S.Schema<GetWhatsAppMessageMediaOutput>;
export interface LibraryTemplateButtonList {
  type?: string;
  text?: string;
  phoneNumber?: string;
  url?: string;
  otpType?: string;
  zeroTapTermsAccepted?: boolean;
  supportedApps?: SupportedApps;
}
export const LibraryTemplateButtonList = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    text: S.optional(S.String),
    phoneNumber: S.optional(S.String),
    url: S.optional(S.String),
    otpType: S.optional(S.String),
    zeroTapTermsAccepted: S.optional(S.Boolean),
    supportedApps: S.optional(SupportedApps),
  }),
).annotations({
  identifier: "LibraryTemplateButtonList",
}) as any as S.Schema<LibraryTemplateButtonList>;
export type MetaLibraryTemplateButtonList = LibraryTemplateButtonList[];
export const MetaLibraryTemplateButtonList = S.Array(LibraryTemplateButtonList);
export interface MetaLibraryTemplateDefinition {
  templateName?: string;
  templateLanguage?: string;
  templateCategory?: string;
  templateTopic?: string;
  templateUseCase?: string;
  templateIndustry?: MetaIndustries;
  templateHeader?: string;
  templateBody?: string;
  templateButtons?: MetaLibraryTemplateButtonList;
  templateId?: string;
}
export const MetaLibraryTemplateDefinition = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "MetaLibraryTemplateDefinition",
}) as any as S.Schema<MetaLibraryTemplateDefinition>;
export type MetaLibraryTemplatesList = MetaLibraryTemplateDefinition[];
export const MetaLibraryTemplatesList = S.Array(MetaLibraryTemplateDefinition);
export interface CreateWhatsAppMessageTemplateFromLibraryOutput {
  metaTemplateId?: string;
  templateStatus?: string;
  category?: string;
}
export const CreateWhatsAppMessageTemplateFromLibraryOutput = S.suspend(() =>
  S.Struct({
    metaTemplateId: S.optional(S.String),
    templateStatus: S.optional(S.String),
    category: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateWhatsAppMessageTemplateFromLibraryOutput",
}) as any as S.Schema<CreateWhatsAppMessageTemplateFromLibraryOutput>;
export interface ListWhatsAppTemplateLibraryOutput {
  metaLibraryTemplates?: MetaLibraryTemplatesList;
  nextToken?: string;
}
export const ListWhatsAppTemplateLibraryOutput = S.suspend(() =>
  S.Struct({
    metaLibraryTemplates: S.optional(MetaLibraryTemplatesList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWhatsAppTemplateLibraryOutput",
}) as any as S.Schema<ListWhatsAppTemplateLibraryOutput>;
export type WhatsAppPhoneNumberDetailList = WhatsAppPhoneNumberDetail[];
export const WhatsAppPhoneNumberDetailList = S.Array(WhatsAppPhoneNumberDetail);
export interface LinkedWhatsAppBusinessAccountIdMetaData {
  accountName?: string;
  registrationStatus?: string;
  unregisteredWhatsAppPhoneNumbers?: WhatsAppPhoneNumberDetailList;
  wabaId?: string;
}
export const LinkedWhatsAppBusinessAccountIdMetaData = S.suspend(() =>
  S.Struct({
    accountName: S.optional(S.String),
    registrationStatus: S.optional(S.String),
    unregisteredWhatsAppPhoneNumbers: S.optional(WhatsAppPhoneNumberDetailList),
    wabaId: S.optional(S.String),
  }),
).annotations({
  identifier: "LinkedWhatsAppBusinessAccountIdMetaData",
}) as any as S.Schema<LinkedWhatsAppBusinessAccountIdMetaData>;
export type LinkedAccountWithIncompleteSetup = {
  [key: string]: LinkedWhatsAppBusinessAccountIdMetaData;
};
export const LinkedAccountWithIncompleteSetup = S.Record({
  key: S.String,
  value: LinkedWhatsAppBusinessAccountIdMetaData,
});
export interface WhatsAppSignupCallbackResult {
  associateInProgressToken?: string | Redacted.Redacted<string>;
  linkedAccountsWithIncompleteSetup?: LinkedAccountWithIncompleteSetup;
}
export const WhatsAppSignupCallbackResult = S.suspend(() =>
  S.Struct({
    associateInProgressToken: S.optional(SensitiveString),
    linkedAccountsWithIncompleteSetup: S.optional(
      LinkedAccountWithIncompleteSetup,
    ),
  }),
).annotations({
  identifier: "WhatsAppSignupCallbackResult",
}) as any as S.Schema<WhatsAppSignupCallbackResult>;
export interface AssociateWhatsAppBusinessAccountOutput {
  signupCallbackResult?: WhatsAppSignupCallbackResult;
  statusCode?: number;
}
export const AssociateWhatsAppBusinessAccountOutput = S.suspend(() =>
  S.Struct({
    signupCallbackResult: S.optional(WhatsAppSignupCallbackResult),
    statusCode: S.optional(S.Number),
  }),
).annotations({
  identifier: "AssociateWhatsAppBusinessAccountOutput",
}) as any as S.Schema<AssociateWhatsAppBusinessAccountOutput>;

//# Errors
export class DependencyException extends S.TaggedError<DependencyException>()(
  "DependencyException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class AccessDeniedByMetaException extends S.TaggedError<AccessDeniedByMetaException>()(
  "AccessDeniedByMetaException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InvalidParametersException extends S.TaggedError<InvalidParametersException>()(
  "InvalidParametersException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottledRequestException extends S.TaggedError<ThrottledRequestException>()(
  "ThrottledRequestException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * List all tags associated with a resource, such as a phone number or WABA.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | InternalServiceException
  | InvalidParametersException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWhatsAppMessageTemplate: (
  input: GetWhatsAppMessageTemplateInput,
) => Effect.Effect<
  GetWhatsAppMessageTemplateOutput,
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWhatsAppMessageTemplateInput,
  output: GetWhatsAppMessageTemplateOutput,
  errors: [
    DependencyException,
    InternalServiceException,
    InvalidParametersException,
    ResourceNotFoundException,
    ThrottledRequestException,
  ],
}));
/**
 * Send a WhatsApp message. For examples of sending a message using the Amazon Web Services
 * CLI, see Sending messages in the
 *
 * *Amazon Web Services End User Messaging Social User Guide*
 * .
 */
export const sendWhatsAppMessage: (
  input: SendWhatsAppMessageInput,
) => Effect.Effect<
  SendWhatsAppMessageOutput,
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWhatsAppMessageTemplate: (
  input: UpdateWhatsAppMessageTemplateInput,
) => Effect.Effect<
  UpdateWhatsAppMessageTemplateOutput,
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWhatsAppMessageTemplate: (
  input: CreateWhatsAppMessageTemplateInput,
) => Effect.Effect<
  CreateWhatsAppMessageTemplateOutput,
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWhatsAppMessageTemplateMedia: (
  input: CreateWhatsAppMessageTemplateMediaInput,
) => Effect.Effect<
  CreateWhatsAppMessageTemplateMediaOutput,
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const postWhatsAppMessageMedia: (
  input: PostWhatsAppMessageMediaInput,
) => Effect.Effect<
  PostWhatsAppMessageMediaOutput,
  | AccessDeniedByMetaException
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a WhatsApp message template.
 */
export const deleteWhatsAppMessageTemplate: (
  input: DeleteWhatsAppMessageTemplateInput,
) => Effect.Effect<
  DeleteWhatsAppMessageTemplateOutput,
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listWhatsAppMessageTemplates: {
  (
    input: ListWhatsAppMessageTemplatesInput,
  ): Effect.Effect<
    ListWhatsAppMessageTemplatesOutput,
    | DependencyException
    | InternalServiceException
    | InvalidParametersException
    | ResourceNotFoundException
    | ThrottledRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWhatsAppMessageTemplatesInput,
  ) => Stream.Stream<
    ListWhatsAppMessageTemplatesOutput,
    | DependencyException
    | InternalServiceException
    | InvalidParametersException
    | ResourceNotFoundException
    | ThrottledRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWhatsAppMessageTemplatesInput,
  ) => Stream.Stream<
    TemplateSummary,
    | DependencyException
    | InternalServiceException
    | InvalidParametersException
    | ResourceNotFoundException
    | ThrottledRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWhatsAppMessageTemplatesInput,
  output: ListWhatsAppMessageTemplatesOutput,
  errors: [
    DependencyException,
    InternalServiceException,
    InvalidParametersException,
    ResourceNotFoundException,
    ThrottledRequestException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "templates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List all WhatsApp Business Accounts linked to your Amazon Web Services account.
 */
export const listLinkedWhatsAppBusinessAccounts: {
  (
    input: ListLinkedWhatsAppBusinessAccountsInput,
  ): Effect.Effect<
    ListLinkedWhatsAppBusinessAccountsOutput,
    | InternalServiceException
    | InvalidParametersException
    | ResourceNotFoundException
    | ThrottledRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLinkedWhatsAppBusinessAccountsInput,
  ) => Stream.Stream<
    ListLinkedWhatsAppBusinessAccountsOutput,
    | InternalServiceException
    | InvalidParametersException
    | ResourceNotFoundException
    | ThrottledRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLinkedWhatsAppBusinessAccountsInput,
  ) => Stream.Stream<
    LinkedWhatsAppBusinessAccountSummary,
    | InternalServiceException
    | InvalidParametersException
    | ResourceNotFoundException
    | ThrottledRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLinkedWhatsAppBusinessAccountsInput,
  output: ListLinkedWhatsAppBusinessAccountsOutput,
  errors: [
    InternalServiceException,
    InvalidParametersException,
    ResourceNotFoundException,
    ThrottledRequestException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "linkedAccounts",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Use your WhatsApp phone number id to get the WABA account id and phone number
 * details.
 */
export const getLinkedWhatsAppBusinessAccountPhoneNumber: (
  input: GetLinkedWhatsAppBusinessAccountPhoneNumberInput,
) => Effect.Effect<
  GetLinkedWhatsAppBusinessAccountPhoneNumberOutput,
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWhatsAppMessageMedia: (
  input: DeleteWhatsAppMessageMediaInput,
) => Effect.Effect<
  DeleteWhatsAppMessageMediaOutput,
  | AccessDeniedByMetaException
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Get the details of your linked WhatsApp Business Account.
 */
export const getLinkedWhatsAppBusinessAccount: (
  input: GetLinkedWhatsAppBusinessAccountInput,
) => Effect.Effect<
  GetLinkedWhatsAppBusinessAccountOutput,
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWhatsAppMessageMedia: (
  input: GetWhatsAppMessageMediaInput,
) => Effect.Effect<
  GetWhatsAppMessageMediaOutput,
  | AccessDeniedByMetaException
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Removes the specified tags from a resource.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | InternalServiceException
  | InvalidParametersException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putWhatsAppBusinessAccountEventDestinations: (
  input: PutWhatsAppBusinessAccountEventDestinationsInput,
) => Effect.Effect<
  PutWhatsAppBusinessAccountEventDestinationsOutput,
  | InternalServiceException
  | InvalidParametersException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | InternalServiceException
  | InvalidParametersException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateWhatsAppBusinessAccount: (
  input: DisassociateWhatsAppBusinessAccountInput,
) => Effect.Effect<
  DisassociateWhatsAppBusinessAccountOutput,
  | DependencyException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWhatsAppMessageTemplateFromLibrary: (
  input: CreateWhatsAppMessageTemplateFromLibraryInput,
) => Effect.Effect<
  CreateWhatsAppMessageTemplateFromLibraryOutput,
  | DependencyException
  | InternalServiceException
  | InvalidParametersException
  | ResourceNotFoundException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listWhatsAppTemplateLibrary: {
  (
    input: ListWhatsAppTemplateLibraryInput,
  ): Effect.Effect<
    ListWhatsAppTemplateLibraryOutput,
    | DependencyException
    | InternalServiceException
    | InvalidParametersException
    | ResourceNotFoundException
    | ThrottledRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWhatsAppTemplateLibraryInput,
  ) => Stream.Stream<
    ListWhatsAppTemplateLibraryOutput,
    | DependencyException
    | InternalServiceException
    | InvalidParametersException
    | ResourceNotFoundException
    | ThrottledRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWhatsAppTemplateLibraryInput,
  ) => Stream.Stream<
    MetaLibraryTemplateDefinition,
    | DependencyException
    | InternalServiceException
    | InvalidParametersException
    | ResourceNotFoundException
    | ThrottledRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWhatsAppTemplateLibraryInput,
  output: ListWhatsAppTemplateLibraryOutput,
  errors: [
    DependencyException,
    InternalServiceException,
    InvalidParametersException,
    ResourceNotFoundException,
    ThrottledRequestException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "metaLibraryTemplates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * This is only used through the Amazon Web Services console during sign-up to associate your WhatsApp Business Account to your Amazon Web Services account.
 */
export const associateWhatsAppBusinessAccount: (
  input: AssociateWhatsAppBusinessAccountInput,
) => Effect.Effect<
  AssociateWhatsAppBusinessAccountOutput,
  | DependencyException
  | InvalidParametersException
  | LimitExceededException
  | ThrottledRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateWhatsAppBusinessAccountInput,
  output: AssociateWhatsAppBusinessAccountOutput,
  errors: [
    DependencyException,
    InvalidParametersException,
    LimitExceededException,
    ThrottledRequestException,
  ],
}));

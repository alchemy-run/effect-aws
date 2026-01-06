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
  sdkId: "Chime SDK Identity",
  serviceShapeName: "ChimeIdentityService",
});
const auth = T.AwsAuthSigv4({ name: "chime" });
const ver = T.ServiceVersion("2021-04-20");
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
                        url: "https://identity-chime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://identity-chime-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://identity-chime.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://identity-chime.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type NonEmptyResourceName = string | Redacted.Redacted<string>;
export type Metadata = string | Redacted.Redacted<string>;
export type ClientRequestToken = string;
export type ChimeArn = string;
export type ResourceName = string | Redacted.Redacted<string>;
export type UserId = string | Redacted.Redacted<string>;
export type UserName = string | Redacted.Redacted<string>;
export type String64 = string;
export type String1600 = string;
export type MaxResults = number;
export type NextToken = string | Redacted.Redacted<string>;
export type SensitiveChimeArn = string | Redacted.Redacted<string>;
export type SensitiveString1600 = string | Redacted.Redacted<string>;
export type TagKey = string | Redacted.Redacted<string>;
export type TagValue = string | Redacted.Redacted<string>;
export type ExpirationDays = number;
export type NonEmptySensitiveString1600 = string | Redacted.Redacted<string>;
export type LexBotAliasArn = string;
export type LexIntentName = string;
export type RetentionDays = number;

//# Schemas
export type TagKeyList = string | Redacted.Redacted<string>[];
export const TagKeyList = S.Array(SensitiveString);
export interface CreateAppInstanceAdminRequest {
  AppInstanceAdminArn: string;
  AppInstanceArn: string;
}
export const CreateAppInstanceAdminRequest = S.suspend(() =>
  S.Struct({
    AppInstanceAdminArn: S.String,
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/app-instances/{AppInstanceArn}/admins" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppInstanceAdminRequest",
}) as any as S.Schema<CreateAppInstanceAdminRequest>;
export interface DeleteAppInstanceRequest {
  AppInstanceArn: string;
}
export const DeleteAppInstanceRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/app-instances/{AppInstanceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppInstanceRequest",
}) as any as S.Schema<DeleteAppInstanceRequest>;
export interface DeleteAppInstanceResponse {}
export const DeleteAppInstanceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAppInstanceResponse",
}) as any as S.Schema<DeleteAppInstanceResponse>;
export interface DeleteAppInstanceAdminRequest {
  AppInstanceAdminArn: string;
  AppInstanceArn: string;
}
export const DeleteAppInstanceAdminRequest = S.suspend(() =>
  S.Struct({
    AppInstanceAdminArn: S.String.pipe(T.HttpLabel("AppInstanceAdminArn")),
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/app-instances/{AppInstanceArn}/admins/{AppInstanceAdminArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppInstanceAdminRequest",
}) as any as S.Schema<DeleteAppInstanceAdminRequest>;
export interface DeleteAppInstanceAdminResponse {}
export const DeleteAppInstanceAdminResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAppInstanceAdminResponse",
}) as any as S.Schema<DeleteAppInstanceAdminResponse>;
export interface DeleteAppInstanceBotRequest {
  AppInstanceBotArn: string;
}
export const DeleteAppInstanceBotRequest = S.suspend(() =>
  S.Struct({
    AppInstanceBotArn: S.String.pipe(T.HttpLabel("AppInstanceBotArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/app-instance-bots/{AppInstanceBotArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppInstanceBotRequest",
}) as any as S.Schema<DeleteAppInstanceBotRequest>;
export interface DeleteAppInstanceBotResponse {}
export const DeleteAppInstanceBotResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAppInstanceBotResponse",
}) as any as S.Schema<DeleteAppInstanceBotResponse>;
export interface DeleteAppInstanceUserRequest {
  AppInstanceUserArn: string;
}
export const DeleteAppInstanceUserRequest = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/app-instance-users/{AppInstanceUserArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppInstanceUserRequest",
}) as any as S.Schema<DeleteAppInstanceUserRequest>;
export interface DeleteAppInstanceUserResponse {}
export const DeleteAppInstanceUserResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAppInstanceUserResponse",
}) as any as S.Schema<DeleteAppInstanceUserResponse>;
export interface DeregisterAppInstanceUserEndpointRequest {
  AppInstanceUserArn: string;
  EndpointId: string;
}
export const DeregisterAppInstanceUserEndpointRequest = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    EndpointId: S.String.pipe(T.HttpLabel("EndpointId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/app-instance-users/{AppInstanceUserArn}/endpoints/{EndpointId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterAppInstanceUserEndpointRequest",
}) as any as S.Schema<DeregisterAppInstanceUserEndpointRequest>;
export interface DeregisterAppInstanceUserEndpointResponse {}
export const DeregisterAppInstanceUserEndpointResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterAppInstanceUserEndpointResponse",
}) as any as S.Schema<DeregisterAppInstanceUserEndpointResponse>;
export interface DescribeAppInstanceRequest {
  AppInstanceArn: string;
}
export const DescribeAppInstanceRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/app-instances/{AppInstanceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAppInstanceRequest",
}) as any as S.Schema<DescribeAppInstanceRequest>;
export interface DescribeAppInstanceAdminRequest {
  AppInstanceAdminArn: string;
  AppInstanceArn: string;
}
export const DescribeAppInstanceAdminRequest = S.suspend(() =>
  S.Struct({
    AppInstanceAdminArn: S.String.pipe(T.HttpLabel("AppInstanceAdminArn")),
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/app-instances/{AppInstanceArn}/admins/{AppInstanceAdminArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAppInstanceAdminRequest",
}) as any as S.Schema<DescribeAppInstanceAdminRequest>;
export interface DescribeAppInstanceBotRequest {
  AppInstanceBotArn: string;
}
export const DescribeAppInstanceBotRequest = S.suspend(() =>
  S.Struct({
    AppInstanceBotArn: S.String.pipe(T.HttpLabel("AppInstanceBotArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/app-instance-bots/{AppInstanceBotArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAppInstanceBotRequest",
}) as any as S.Schema<DescribeAppInstanceBotRequest>;
export interface DescribeAppInstanceUserRequest {
  AppInstanceUserArn: string;
}
export const DescribeAppInstanceUserRequest = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/app-instance-users/{AppInstanceUserArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAppInstanceUserRequest",
}) as any as S.Schema<DescribeAppInstanceUserRequest>;
export interface DescribeAppInstanceUserEndpointRequest {
  AppInstanceUserArn: string;
  EndpointId: string;
}
export const DescribeAppInstanceUserEndpointRequest = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    EndpointId: S.String.pipe(T.HttpLabel("EndpointId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/app-instance-users/{AppInstanceUserArn}/endpoints/{EndpointId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAppInstanceUserEndpointRequest",
}) as any as S.Schema<DescribeAppInstanceUserEndpointRequest>;
export interface GetAppInstanceRetentionSettingsRequest {
  AppInstanceArn: string;
}
export const GetAppInstanceRetentionSettingsRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/app-instances/{AppInstanceArn}/retention-settings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAppInstanceRetentionSettingsRequest",
}) as any as S.Schema<GetAppInstanceRetentionSettingsRequest>;
export interface ListAppInstanceAdminsRequest {
  AppInstanceArn: string;
  MaxResults?: number;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListAppInstanceAdminsRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/app-instances/{AppInstanceArn}/admins" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppInstanceAdminsRequest",
}) as any as S.Schema<ListAppInstanceAdminsRequest>;
export interface ListAppInstanceBotsRequest {
  AppInstanceArn: string;
  MaxResults?: number;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListAppInstanceBotsRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpQuery("app-instance-arn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/app-instance-bots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppInstanceBotsRequest",
}) as any as S.Schema<ListAppInstanceBotsRequest>;
export interface ListAppInstancesRequest {
  MaxResults?: number;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListAppInstancesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/app-instances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppInstancesRequest",
}) as any as S.Schema<ListAppInstancesRequest>;
export interface ListAppInstanceUserEndpointsRequest {
  AppInstanceUserArn: string | Redacted.Redacted<string>;
  MaxResults?: number;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListAppInstanceUserEndpointsRequest = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: SensitiveString.pipe(T.HttpLabel("AppInstanceUserArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/app-instance-users/{AppInstanceUserArn}/endpoints",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppInstanceUserEndpointsRequest",
}) as any as S.Schema<ListAppInstanceUserEndpointsRequest>;
export interface ListAppInstanceUsersRequest {
  AppInstanceArn: string;
  MaxResults?: number;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListAppInstanceUsersRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpQuery("app-instance-arn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/app-instance-users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppInstanceUsersRequest",
}) as any as S.Schema<ListAppInstanceUsersRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String.pipe(T.HttpQuery("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags" }),
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
export interface ExpirationSettings {
  ExpirationDays: number;
  ExpirationCriterion: string;
}
export const ExpirationSettings = S.suspend(() =>
  S.Struct({ ExpirationDays: S.Number, ExpirationCriterion: S.String }),
).annotations({
  identifier: "ExpirationSettings",
}) as any as S.Schema<ExpirationSettings>;
export interface PutAppInstanceUserExpirationSettingsRequest {
  AppInstanceUserArn: string;
  ExpirationSettings?: ExpirationSettings;
}
export const PutAppInstanceUserExpirationSettingsRequest = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    ExpirationSettings: S.optional(ExpirationSettings),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/app-instance-users/{AppInstanceUserArn}/expiration-settings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAppInstanceUserExpirationSettingsRequest",
}) as any as S.Schema<PutAppInstanceUserExpirationSettingsRequest>;
export interface Tag {
  Key: string | Redacted.Redacted<string>;
  Value: string | Redacted.Redacted<string>;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: SensitiveString, Value: SensitiveString }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags?operation=tag-resource" }),
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
  ResourceARN: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags?operation=untag-resource" }),
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
export interface UpdateAppInstanceRequest {
  AppInstanceArn: string;
  Name: string | Redacted.Redacted<string>;
  Metadata: string | Redacted.Redacted<string>;
}
export const UpdateAppInstanceRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
    Name: SensitiveString,
    Metadata: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/app-instances/{AppInstanceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAppInstanceRequest",
}) as any as S.Schema<UpdateAppInstanceRequest>;
export interface InvokedBy {
  StandardMessages: string;
  TargetedMessages: string;
}
export const InvokedBy = S.suspend(() =>
  S.Struct({ StandardMessages: S.String, TargetedMessages: S.String }),
).annotations({ identifier: "InvokedBy" }) as any as S.Schema<InvokedBy>;
export interface LexConfiguration {
  RespondsTo?: string;
  InvokedBy?: InvokedBy;
  LexBotAliasArn: string;
  LocaleId: string;
  WelcomeIntent?: string;
}
export const LexConfiguration = S.suspend(() =>
  S.Struct({
    RespondsTo: S.optional(S.String),
    InvokedBy: S.optional(InvokedBy),
    LexBotAliasArn: S.String,
    LocaleId: S.String,
    WelcomeIntent: S.optional(S.String),
  }),
).annotations({
  identifier: "LexConfiguration",
}) as any as S.Schema<LexConfiguration>;
export interface Configuration {
  Lex: LexConfiguration;
}
export const Configuration = S.suspend(() =>
  S.Struct({ Lex: LexConfiguration }),
).annotations({
  identifier: "Configuration",
}) as any as S.Schema<Configuration>;
export interface UpdateAppInstanceBotRequest {
  AppInstanceBotArn: string;
  Name: string | Redacted.Redacted<string>;
  Metadata: string | Redacted.Redacted<string>;
  Configuration?: Configuration;
}
export const UpdateAppInstanceBotRequest = S.suspend(() =>
  S.Struct({
    AppInstanceBotArn: S.String.pipe(T.HttpLabel("AppInstanceBotArn")),
    Name: SensitiveString,
    Metadata: SensitiveString,
    Configuration: S.optional(Configuration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/app-instance-bots/{AppInstanceBotArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAppInstanceBotRequest",
}) as any as S.Schema<UpdateAppInstanceBotRequest>;
export interface UpdateAppInstanceUserRequest {
  AppInstanceUserArn: string;
  Name: string | Redacted.Redacted<string>;
  Metadata: string | Redacted.Redacted<string>;
}
export const UpdateAppInstanceUserRequest = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    Name: SensitiveString,
    Metadata: SensitiveString,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/app-instance-users/{AppInstanceUserArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAppInstanceUserRequest",
}) as any as S.Schema<UpdateAppInstanceUserRequest>;
export interface UpdateAppInstanceUserEndpointRequest {
  AppInstanceUserArn: string;
  EndpointId: string;
  Name?: string | Redacted.Redacted<string>;
  AllowMessages?: string;
}
export const UpdateAppInstanceUserEndpointRequest = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    EndpointId: S.String.pipe(T.HttpLabel("EndpointId")),
    Name: S.optional(SensitiveString),
    AllowMessages: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/app-instance-users/{AppInstanceUserArn}/endpoints/{EndpointId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAppInstanceUserEndpointRequest",
}) as any as S.Schema<UpdateAppInstanceUserEndpointRequest>;
export interface EndpointAttributes {
  DeviceToken: string | Redacted.Redacted<string>;
  VoipDeviceToken?: string | Redacted.Redacted<string>;
}
export const EndpointAttributes = S.suspend(() =>
  S.Struct({
    DeviceToken: SensitiveString,
    VoipDeviceToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EndpointAttributes",
}) as any as S.Schema<EndpointAttributes>;
export interface CreateAppInstanceRequest {
  Name: string | Redacted.Redacted<string>;
  Metadata?: string | Redacted.Redacted<string>;
  ClientRequestToken: string;
  Tags?: TagList;
}
export const CreateAppInstanceRequest = S.suspend(() =>
  S.Struct({
    Name: SensitiveString,
    Metadata: S.optional(SensitiveString),
    ClientRequestToken: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/app-instances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppInstanceRequest",
}) as any as S.Schema<CreateAppInstanceRequest>;
export interface CreateAppInstanceUserRequest {
  AppInstanceArn: string;
  AppInstanceUserId: string | Redacted.Redacted<string>;
  Name: string | Redacted.Redacted<string>;
  Metadata?: string | Redacted.Redacted<string>;
  ClientRequestToken: string;
  Tags?: TagList;
  ExpirationSettings?: ExpirationSettings;
}
export const CreateAppInstanceUserRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String,
    AppInstanceUserId: SensitiveString,
    Name: SensitiveString,
    Metadata: S.optional(SensitiveString),
    ClientRequestToken: S.String,
    Tags: S.optional(TagList),
    ExpirationSettings: S.optional(ExpirationSettings),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/app-instance-users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppInstanceUserRequest",
}) as any as S.Schema<CreateAppInstanceUserRequest>;
export interface ChannelRetentionSettings {
  RetentionDays?: number;
}
export const ChannelRetentionSettings = S.suspend(() =>
  S.Struct({ RetentionDays: S.optional(S.Number) }),
).annotations({
  identifier: "ChannelRetentionSettings",
}) as any as S.Schema<ChannelRetentionSettings>;
export interface AppInstanceRetentionSettings {
  ChannelRetentionSettings?: ChannelRetentionSettings;
}
export const AppInstanceRetentionSettings = S.suspend(() =>
  S.Struct({ ChannelRetentionSettings: S.optional(ChannelRetentionSettings) }),
).annotations({
  identifier: "AppInstanceRetentionSettings",
}) as any as S.Schema<AppInstanceRetentionSettings>;
export interface GetAppInstanceRetentionSettingsResponse {
  AppInstanceRetentionSettings?: AppInstanceRetentionSettings;
  InitiateDeletionTimestamp?: Date;
}
export const GetAppInstanceRetentionSettingsResponse = S.suspend(() =>
  S.Struct({
    AppInstanceRetentionSettings: S.optional(AppInstanceRetentionSettings),
    InitiateDeletionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetAppInstanceRetentionSettingsResponse",
}) as any as S.Schema<GetAppInstanceRetentionSettingsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutAppInstanceUserExpirationSettingsResponse {
  AppInstanceUserArn?: string;
  ExpirationSettings?: ExpirationSettings;
}
export const PutAppInstanceUserExpirationSettingsResponse = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.optional(S.String),
    ExpirationSettings: S.optional(ExpirationSettings),
  }),
).annotations({
  identifier: "PutAppInstanceUserExpirationSettingsResponse",
}) as any as S.Schema<PutAppInstanceUserExpirationSettingsResponse>;
export interface RegisterAppInstanceUserEndpointRequest {
  AppInstanceUserArn: string | Redacted.Redacted<string>;
  Name?: string | Redacted.Redacted<string>;
  Type: string;
  ResourceArn: string;
  EndpointAttributes: EndpointAttributes;
  ClientRequestToken: string;
  AllowMessages?: string;
}
export const RegisterAppInstanceUserEndpointRequest = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: SensitiveString.pipe(T.HttpLabel("AppInstanceUserArn")),
    Name: S.optional(SensitiveString),
    Type: S.String,
    ResourceArn: S.String,
    EndpointAttributes: EndpointAttributes,
    ClientRequestToken: S.String,
    AllowMessages: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/app-instance-users/{AppInstanceUserArn}/endpoints",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterAppInstanceUserEndpointRequest",
}) as any as S.Schema<RegisterAppInstanceUserEndpointRequest>;
export interface UpdateAppInstanceResponse {
  AppInstanceArn?: string;
}
export const UpdateAppInstanceResponse = S.suspend(() =>
  S.Struct({ AppInstanceArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateAppInstanceResponse",
}) as any as S.Schema<UpdateAppInstanceResponse>;
export interface UpdateAppInstanceBotResponse {
  AppInstanceBotArn?: string;
}
export const UpdateAppInstanceBotResponse = S.suspend(() =>
  S.Struct({ AppInstanceBotArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateAppInstanceBotResponse",
}) as any as S.Schema<UpdateAppInstanceBotResponse>;
export interface UpdateAppInstanceUserResponse {
  AppInstanceUserArn?: string;
}
export const UpdateAppInstanceUserResponse = S.suspend(() =>
  S.Struct({ AppInstanceUserArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateAppInstanceUserResponse",
}) as any as S.Schema<UpdateAppInstanceUserResponse>;
export interface UpdateAppInstanceUserEndpointResponse {
  AppInstanceUserArn?: string;
  EndpointId?: string;
}
export const UpdateAppInstanceUserEndpointResponse = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateAppInstanceUserEndpointResponse",
}) as any as S.Schema<UpdateAppInstanceUserEndpointResponse>;
export interface Identity {
  Arn?: string;
  Name?: string | Redacted.Redacted<string>;
}
export const Identity = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Name: S.optional(SensitiveString) }),
).annotations({ identifier: "Identity" }) as any as S.Schema<Identity>;
export interface AppInstance {
  AppInstanceArn?: string;
  Name?: string | Redacted.Redacted<string>;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
  Metadata?: string | Redacted.Redacted<string>;
}
export const AppInstance = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Metadata: S.optional(SensitiveString),
  }),
).annotations({ identifier: "AppInstance" }) as any as S.Schema<AppInstance>;
export interface AppInstanceAdmin {
  Admin?: Identity;
  AppInstanceArn?: string;
  CreatedTimestamp?: Date;
}
export const AppInstanceAdmin = S.suspend(() =>
  S.Struct({
    Admin: S.optional(Identity),
    AppInstanceArn: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "AppInstanceAdmin",
}) as any as S.Schema<AppInstanceAdmin>;
export interface AppInstanceBot {
  AppInstanceBotArn?: string;
  Name?: string | Redacted.Redacted<string>;
  Configuration?: Configuration;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
  Metadata?: string | Redacted.Redacted<string>;
}
export const AppInstanceBot = S.suspend(() =>
  S.Struct({
    AppInstanceBotArn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Configuration: S.optional(Configuration),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Metadata: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AppInstanceBot",
}) as any as S.Schema<AppInstanceBot>;
export interface AppInstanceUser {
  AppInstanceUserArn?: string;
  Name?: string | Redacted.Redacted<string>;
  Metadata?: string | Redacted.Redacted<string>;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
  ExpirationSettings?: ExpirationSettings;
}
export const AppInstanceUser = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Metadata: S.optional(SensitiveString),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ExpirationSettings: S.optional(ExpirationSettings),
  }),
).annotations({
  identifier: "AppInstanceUser",
}) as any as S.Schema<AppInstanceUser>;
export interface AppInstanceAdminSummary {
  Admin?: Identity;
}
export const AppInstanceAdminSummary = S.suspend(() =>
  S.Struct({ Admin: S.optional(Identity) }),
).annotations({
  identifier: "AppInstanceAdminSummary",
}) as any as S.Schema<AppInstanceAdminSummary>;
export type AppInstanceAdminList = AppInstanceAdminSummary[];
export const AppInstanceAdminList = S.Array(AppInstanceAdminSummary);
export interface AppInstanceBotSummary {
  AppInstanceBotArn?: string;
  Name?: string | Redacted.Redacted<string>;
  Metadata?: string | Redacted.Redacted<string>;
}
export const AppInstanceBotSummary = S.suspend(() =>
  S.Struct({
    AppInstanceBotArn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Metadata: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AppInstanceBotSummary",
}) as any as S.Schema<AppInstanceBotSummary>;
export type AppInstanceBotList = AppInstanceBotSummary[];
export const AppInstanceBotList = S.Array(AppInstanceBotSummary);
export interface AppInstanceSummary {
  AppInstanceArn?: string;
  Name?: string | Redacted.Redacted<string>;
  Metadata?: string | Redacted.Redacted<string>;
}
export const AppInstanceSummary = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Metadata: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AppInstanceSummary",
}) as any as S.Schema<AppInstanceSummary>;
export type AppInstanceList = AppInstanceSummary[];
export const AppInstanceList = S.Array(AppInstanceSummary);
export interface EndpointState {
  Status: string;
  StatusReason?: string;
}
export const EndpointState = S.suspend(() =>
  S.Struct({ Status: S.String, StatusReason: S.optional(S.String) }),
).annotations({
  identifier: "EndpointState",
}) as any as S.Schema<EndpointState>;
export interface AppInstanceUserEndpointSummary {
  AppInstanceUserArn?: string;
  EndpointId?: string;
  Name?: string | Redacted.Redacted<string>;
  Type?: string;
  AllowMessages?: string;
  EndpointState?: EndpointState;
}
export const AppInstanceUserEndpointSummary = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Type: S.optional(S.String),
    AllowMessages: S.optional(S.String),
    EndpointState: S.optional(EndpointState),
  }),
).annotations({
  identifier: "AppInstanceUserEndpointSummary",
}) as any as S.Schema<AppInstanceUserEndpointSummary>;
export type AppInstanceUserEndpointSummaryList =
  AppInstanceUserEndpointSummary[];
export const AppInstanceUserEndpointSummaryList = S.Array(
  AppInstanceUserEndpointSummary,
);
export interface AppInstanceUserSummary {
  AppInstanceUserArn?: string;
  Name?: string | Redacted.Redacted<string>;
  Metadata?: string | Redacted.Redacted<string>;
}
export const AppInstanceUserSummary = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Metadata: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AppInstanceUserSummary",
}) as any as S.Schema<AppInstanceUserSummary>;
export type AppInstanceUserList = AppInstanceUserSummary[];
export const AppInstanceUserList = S.Array(AppInstanceUserSummary);
export interface CreateAppInstanceResponse {
  AppInstanceArn?: string;
}
export const CreateAppInstanceResponse = S.suspend(() =>
  S.Struct({ AppInstanceArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateAppInstanceResponse",
}) as any as S.Schema<CreateAppInstanceResponse>;
export interface CreateAppInstanceAdminResponse {
  AppInstanceAdmin?: Identity;
  AppInstanceArn?: string;
}
export const CreateAppInstanceAdminResponse = S.suspend(() =>
  S.Struct({
    AppInstanceAdmin: S.optional(Identity),
    AppInstanceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAppInstanceAdminResponse",
}) as any as S.Schema<CreateAppInstanceAdminResponse>;
export interface CreateAppInstanceUserResponse {
  AppInstanceUserArn?: string;
}
export const CreateAppInstanceUserResponse = S.suspend(() =>
  S.Struct({ AppInstanceUserArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateAppInstanceUserResponse",
}) as any as S.Schema<CreateAppInstanceUserResponse>;
export interface DescribeAppInstanceResponse {
  AppInstance?: AppInstance;
}
export const DescribeAppInstanceResponse = S.suspend(() =>
  S.Struct({ AppInstance: S.optional(AppInstance) }),
).annotations({
  identifier: "DescribeAppInstanceResponse",
}) as any as S.Schema<DescribeAppInstanceResponse>;
export interface DescribeAppInstanceAdminResponse {
  AppInstanceAdmin?: AppInstanceAdmin;
}
export const DescribeAppInstanceAdminResponse = S.suspend(() =>
  S.Struct({ AppInstanceAdmin: S.optional(AppInstanceAdmin) }),
).annotations({
  identifier: "DescribeAppInstanceAdminResponse",
}) as any as S.Schema<DescribeAppInstanceAdminResponse>;
export interface DescribeAppInstanceBotResponse {
  AppInstanceBot?: AppInstanceBot;
}
export const DescribeAppInstanceBotResponse = S.suspend(() =>
  S.Struct({ AppInstanceBot: S.optional(AppInstanceBot) }),
).annotations({
  identifier: "DescribeAppInstanceBotResponse",
}) as any as S.Schema<DescribeAppInstanceBotResponse>;
export interface DescribeAppInstanceUserResponse {
  AppInstanceUser?: AppInstanceUser;
}
export const DescribeAppInstanceUserResponse = S.suspend(() =>
  S.Struct({ AppInstanceUser: S.optional(AppInstanceUser) }),
).annotations({
  identifier: "DescribeAppInstanceUserResponse",
}) as any as S.Schema<DescribeAppInstanceUserResponse>;
export interface ListAppInstanceAdminsResponse {
  AppInstanceArn?: string;
  AppInstanceAdmins?: AppInstanceAdminList;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListAppInstanceAdminsResponse = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.optional(S.String),
    AppInstanceAdmins: S.optional(AppInstanceAdminList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListAppInstanceAdminsResponse",
}) as any as S.Schema<ListAppInstanceAdminsResponse>;
export interface ListAppInstanceBotsResponse {
  AppInstanceArn?: string;
  AppInstanceBots?: AppInstanceBotList;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListAppInstanceBotsResponse = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.optional(S.String),
    AppInstanceBots: S.optional(AppInstanceBotList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListAppInstanceBotsResponse",
}) as any as S.Schema<ListAppInstanceBotsResponse>;
export interface ListAppInstancesResponse {
  AppInstances?: AppInstanceList;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListAppInstancesResponse = S.suspend(() =>
  S.Struct({
    AppInstances: S.optional(AppInstanceList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListAppInstancesResponse",
}) as any as S.Schema<ListAppInstancesResponse>;
export interface ListAppInstanceUserEndpointsResponse {
  AppInstanceUserEndpoints?: AppInstanceUserEndpointSummaryList;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListAppInstanceUserEndpointsResponse = S.suspend(() =>
  S.Struct({
    AppInstanceUserEndpoints: S.optional(AppInstanceUserEndpointSummaryList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListAppInstanceUserEndpointsResponse",
}) as any as S.Schema<ListAppInstanceUserEndpointsResponse>;
export interface ListAppInstanceUsersResponse {
  AppInstanceArn?: string;
  AppInstanceUsers?: AppInstanceUserList;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListAppInstanceUsersResponse = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.optional(S.String),
    AppInstanceUsers: S.optional(AppInstanceUserList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListAppInstanceUsersResponse",
}) as any as S.Schema<ListAppInstanceUsersResponse>;
export interface PutAppInstanceRetentionSettingsRequest {
  AppInstanceArn: string;
  AppInstanceRetentionSettings: AppInstanceRetentionSettings;
}
export const PutAppInstanceRetentionSettingsRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
    AppInstanceRetentionSettings: AppInstanceRetentionSettings,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/app-instances/{AppInstanceArn}/retention-settings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAppInstanceRetentionSettingsRequest",
}) as any as S.Schema<PutAppInstanceRetentionSettingsRequest>;
export interface RegisterAppInstanceUserEndpointResponse {
  AppInstanceUserArn?: string;
  EndpointId?: string;
}
export const RegisterAppInstanceUserEndpointResponse = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterAppInstanceUserEndpointResponse",
}) as any as S.Schema<RegisterAppInstanceUserEndpointResponse>;
export interface AppInstanceUserEndpoint {
  AppInstanceUserArn?: string;
  EndpointId?: string;
  Name?: string | Redacted.Redacted<string>;
  Type?: string;
  ResourceArn?: string;
  EndpointAttributes?: EndpointAttributes;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
  AllowMessages?: string;
  EndpointState?: EndpointState;
}
export const AppInstanceUserEndpoint = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Type: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    EndpointAttributes: S.optional(EndpointAttributes),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AllowMessages: S.optional(S.String),
    EndpointState: S.optional(EndpointState),
  }),
).annotations({
  identifier: "AppInstanceUserEndpoint",
}) as any as S.Schema<AppInstanceUserEndpoint>;
export interface CreateAppInstanceBotRequest {
  AppInstanceArn: string;
  Name?: string | Redacted.Redacted<string>;
  Metadata?: string | Redacted.Redacted<string>;
  ClientRequestToken: string;
  Tags?: TagList;
  Configuration: Configuration;
}
export const CreateAppInstanceBotRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String,
    Name: S.optional(SensitiveString),
    Metadata: S.optional(SensitiveString),
    ClientRequestToken: S.String,
    Tags: S.optional(TagList),
    Configuration: Configuration,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/app-instance-bots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppInstanceBotRequest",
}) as any as S.Schema<CreateAppInstanceBotRequest>;
export interface DescribeAppInstanceUserEndpointResponse {
  AppInstanceUserEndpoint?: AppInstanceUserEndpoint;
}
export const DescribeAppInstanceUserEndpointResponse = S.suspend(() =>
  S.Struct({ AppInstanceUserEndpoint: S.optional(AppInstanceUserEndpoint) }),
).annotations({
  identifier: "DescribeAppInstanceUserEndpointResponse",
}) as any as S.Schema<DescribeAppInstanceUserEndpointResponse>;
export interface PutAppInstanceRetentionSettingsResponse {
  AppInstanceRetentionSettings?: AppInstanceRetentionSettings;
  InitiateDeletionTimestamp?: Date;
}
export const PutAppInstanceRetentionSettingsResponse = S.suspend(() =>
  S.Struct({
    AppInstanceRetentionSettings: S.optional(AppInstanceRetentionSettings),
    InitiateDeletionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PutAppInstanceRetentionSettingsResponse",
}) as any as S.Schema<PutAppInstanceRetentionSettingsResponse>;
export interface CreateAppInstanceBotResponse {
  AppInstanceBotArn?: string;
}
export const CreateAppInstanceBotResponse = S.suspend(() =>
  S.Struct({ AppInstanceBotArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateAppInstanceBotResponse",
}) as any as S.Schema<CreateAppInstanceBotResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ThrottledClientException extends S.TaggedError<ThrottledClientException>()(
  "ThrottledClientException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class UnauthorizedClientException extends S.TaggedError<UnauthorizedClientException>()(
  "UnauthorizedClientException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Returns the full details of an `AppInstance`.
 */
export const describeAppInstance: (
  input: DescribeAppInstanceRequest,
) => Effect.Effect<
  DescribeAppInstanceResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppInstanceRequest,
  output: DescribeAppInstanceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * The `AppInstanceBot's` information.
 */
export const describeAppInstanceBot: (
  input: DescribeAppInstanceBotRequest,
) => Effect.Effect<
  DescribeAppInstanceBotResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppInstanceBotRequest,
  output: DescribeAppInstanceBotResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns the full details of an `AppInstanceUserEndpoint`.
 */
export const describeAppInstanceUserEndpoint: (
  input: DescribeAppInstanceUserEndpointRequest,
) => Effect.Effect<
  DescribeAppInstanceUserEndpointResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppInstanceUserEndpointRequest,
  output: DescribeAppInstanceUserEndpointResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Sets the amount of time in days that a given `AppInstance` retains
 * data.
 */
export const putAppInstanceRetentionSettings: (
  input: PutAppInstanceRetentionSettingsRequest,
) => Effect.Effect<
  PutAppInstanceRetentionSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAppInstanceRetentionSettingsRequest,
  output: PutAppInstanceRetentionSettingsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns a list of the administrators in the `AppInstance`.
 */
export const listAppInstanceAdmins: {
  (
    input: ListAppInstanceAdminsRequest,
  ): Effect.Effect<
    ListAppInstanceAdminsResponse,
    | BadRequestException
    | ForbiddenException
    | ResourceLimitExceededException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppInstanceAdminsRequest,
  ) => Stream.Stream<
    ListAppInstanceAdminsResponse,
    | BadRequestException
    | ForbiddenException
    | ResourceLimitExceededException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppInstanceAdminsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ResourceLimitExceededException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppInstanceAdminsRequest,
  output: ListAppInstanceAdminsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all `AppInstanceBots` created under a single `AppInstance`.
 */
export const listAppInstanceBots: {
  (
    input: ListAppInstanceBotsRequest,
  ): Effect.Effect<
    ListAppInstanceBotsResponse,
    | BadRequestException
    | ForbiddenException
    | ResourceLimitExceededException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppInstanceBotsRequest,
  ) => Stream.Stream<
    ListAppInstanceBotsResponse,
    | BadRequestException
    | ForbiddenException
    | ResourceLimitExceededException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppInstanceBotsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ResourceLimitExceededException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppInstanceBotsRequest,
  output: ListAppInstanceBotsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Registers an endpoint under an Amazon Chime `AppInstanceUser`. The endpoint receives messages for a user. For push notifications, the endpoint is a mobile device used to receive mobile push notifications for a user.
 */
export const registerAppInstanceUserEndpoint: (
  input: RegisterAppInstanceUserEndpointRequest,
) => Effect.Effect<
  RegisterAppInstanceUserEndpointResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterAppInstanceUserEndpointRequest,
  output: RegisterAppInstanceUserEndpointResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Applies the specified tags to the specified Amazon Chime SDK identity resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the name and metadata of an `AppInstanceBot`.
 */
export const updateAppInstanceBot: (
  input: UpdateAppInstanceBotRequest,
) => Effect.Effect<
  UpdateAppInstanceBotResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppInstanceBotRequest,
  output: UpdateAppInstanceBotResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the details of an `AppInstanceUser`. You can update names and
 * metadata.
 */
export const updateAppInstanceUser: (
  input: UpdateAppInstanceUserRequest,
) => Effect.Effect<
  UpdateAppInstanceUserResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppInstanceUserRequest,
  output: UpdateAppInstanceUserResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Demotes an `AppInstanceAdmin` to an `AppInstanceUser` or
 * `AppInstanceBot`. This action
 * does not delete the user.
 */
export const deleteAppInstanceAdmin: (
  input: DeleteAppInstanceAdminRequest,
) => Effect.Effect<
  DeleteAppInstanceAdminResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppInstanceAdminRequest,
  output: DeleteAppInstanceAdminResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes an `AppInstanceBot`.
 */
export const deleteAppInstanceBot: (
  input: DeleteAppInstanceBotRequest,
) => Effect.Effect<
  DeleteAppInstanceBotResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppInstanceBotRequest,
  output: DeleteAppInstanceBotResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes an `AppInstanceUser`.
 */
export const deleteAppInstanceUser: (
  input: DeleteAppInstanceUserRequest,
) => Effect.Effect<
  DeleteAppInstanceUserResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppInstanceUserRequest,
  output: DeleteAppInstanceUserResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates an Amazon Chime SDK messaging `AppInstance` under an AWS account.
 * Only SDK messaging customers use this API. `CreateAppInstance` supports
 * idempotency behavior as described in the AWS API Standard.
 *
 * identity
 */
export const createAppInstance: (
  input: CreateAppInstanceRequest,
) => Effect.Effect<
  CreateAppInstanceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppInstanceRequest,
  output: CreateAppInstanceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Promotes an `AppInstanceUser` or `AppInstanceBot` to an
 * `AppInstanceAdmin`. The
 * promoted entity can perform the following actions.
 *
 * - `ChannelModerator` actions across all channels in the
 * `AppInstance`.
 *
 * - `DeleteChannelMessage` actions.
 *
 * Only an `AppInstanceUser` and `AppInstanceBot` can be promoted to an `AppInstanceAdmin`
 * role.
 */
export const createAppInstanceAdmin: (
  input: CreateAppInstanceAdminRequest,
) => Effect.Effect<
  CreateAppInstanceAdminResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppInstanceAdminRequest,
  output: CreateAppInstanceAdminResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a user under an Amazon Chime `AppInstance`. The request consists of a
 * unique `appInstanceUserId` and `Name` for that user.
 */
export const createAppInstanceUser: (
  input: CreateAppInstanceUserRequest,
) => Effect.Effect<
  CreateAppInstanceUserResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppInstanceUserRequest,
  output: CreateAppInstanceUserResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns the full details of an `AppInstanceAdmin`.
 */
export const describeAppInstanceAdmin: (
  input: DescribeAppInstanceAdminRequest,
) => Effect.Effect<
  DescribeAppInstanceAdminResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppInstanceAdminRequest,
  output: DescribeAppInstanceAdminResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns the full details of an `AppInstanceUser`.
 */
export const describeAppInstanceUser: (
  input: DescribeAppInstanceUserRequest,
) => Effect.Effect<
  DescribeAppInstanceUserResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppInstanceUserRequest,
  output: DescribeAppInstanceUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Lists all Amazon Chime `AppInstance`s created under a single AWS
 * account.
 */
export const listAppInstances: {
  (
    input: ListAppInstancesRequest,
  ): Effect.Effect<
    ListAppInstancesResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppInstancesRequest,
  ) => Stream.Stream<
    ListAppInstancesResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppInstancesRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppInstancesRequest,
  output: ListAppInstancesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the `AppInstanceUserEndpoints` created under a single `AppInstanceUser`.
 */
export const listAppInstanceUserEndpoints: {
  (
    input: ListAppInstanceUserEndpointsRequest,
  ): Effect.Effect<
    ListAppInstanceUserEndpointsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppInstanceUserEndpointsRequest,
  ) => Stream.Stream<
    ListAppInstanceUserEndpointsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppInstanceUserEndpointsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppInstanceUserEndpointsRequest,
  output: ListAppInstanceUserEndpointsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all `AppInstanceUsers` created under a single
 * `AppInstance`.
 */
export const listAppInstanceUsers: {
  (
    input: ListAppInstanceUsersRequest,
  ): Effect.Effect<
    ListAppInstanceUsersResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppInstanceUsersRequest,
  ) => Stream.Stream<
    ListAppInstanceUsersResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppInstanceUsersRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppInstanceUsersRequest,
  output: ListAppInstanceUsersResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Sets the number of days before the `AppInstanceUser` is automatically deleted.
 *
 * A background process deletes expired `AppInstanceUsers` within 6 hours of expiration.
 * Actual deletion times may vary.
 *
 * Expired `AppInstanceUsers` that have not yet been deleted appear as active, and you can update
 * their expiration settings. The system honors the new settings.
 */
export const putAppInstanceUserExpirationSettings: (
  input: PutAppInstanceUserExpirationSettingsRequest,
) => Effect.Effect<
  PutAppInstanceUserExpirationSettingsResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAppInstanceUserExpirationSettingsRequest,
  output: PutAppInstanceUserExpirationSettingsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Gets the retention settings for an `AppInstance`.
 */
export const getAppInstanceRetentionSettings: (
  input: GetAppInstanceRetentionSettingsRequest,
) => Effect.Effect<
  GetAppInstanceRetentionSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppInstanceRetentionSettingsRequest,
  output: GetAppInstanceRetentionSettingsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Lists the tags applied to an Amazon Chime SDK identity resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deregisters an `AppInstanceUserEndpoint`.
 */
export const deregisterAppInstanceUserEndpoint: (
  input: DeregisterAppInstanceUserEndpointRequest,
) => Effect.Effect<
  DeregisterAppInstanceUserEndpointResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterAppInstanceUserEndpointRequest,
  output: DeregisterAppInstanceUserEndpointResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Removes the specified tags from the specified Amazon Chime SDK identity resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates `AppInstance` metadata.
 */
export const updateAppInstance: (
  input: UpdateAppInstanceRequest,
) => Effect.Effect<
  UpdateAppInstanceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppInstanceRequest,
  output: UpdateAppInstanceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the details of an `AppInstanceUserEndpoint`. You can update the name and `AllowMessage` values.
 */
export const updateAppInstanceUserEndpoint: (
  input: UpdateAppInstanceUserEndpointRequest,
) => Effect.Effect<
  UpdateAppInstanceUserEndpointResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppInstanceUserEndpointRequest,
  output: UpdateAppInstanceUserEndpointResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes an `AppInstance` and all associated data asynchronously.
 */
export const deleteAppInstance: (
  input: DeleteAppInstanceRequest,
) => Effect.Effect<
  DeleteAppInstanceResponse,
  | BadRequestException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppInstanceRequest,
  output: DeleteAppInstanceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a bot under an Amazon Chime `AppInstance`. The request consists of a
 * unique `Configuration` and `Name` for that bot.
 */
export const createAppInstanceBot: (
  input: CreateAppInstanceBotRequest,
) => Effect.Effect<
  CreateAppInstanceBotResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppInstanceBotRequest,
  output: CreateAppInstanceBotResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));

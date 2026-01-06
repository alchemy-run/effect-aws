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
const svc = T.AwsApiService({ sdkId: "OAM", serviceShapeName: "oamservice" });
const auth = T.AwsAuthSigv4({ name: "oam" });
const ver = T.ServiceVersion("2022-06-10");
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
                                url: "https://oam-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://oam-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://oam.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://oam.{Region}.{PartitionResult#dnsSuffix}",
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
export type LabelTemplate = string;
export type ResourceIdentifier = string;
export type SinkName = string;
export type ListAttachedLinksMaxResults = number;
export type NextToken = string;
export type ListLinksMaxResults = number;
export type ListSinksMaxResults = number;
export type Arn = string;
export type SinkPolicy = string;
export type TagKey = string;
export type TagValue = string;
export type LogsFilter = string;
export type MetricsFilter = string;

//# Schemas
export type ResourceTypesInput = string[];
export const ResourceTypesInput = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type TagMapInput = { [key: string]: string };
export const TagMapInput = S.Record({ key: S.String, value: S.String });
export interface CreateSinkInput {
  Name: string;
  Tags?: TagMapInput;
}
export const CreateSinkInput = S.suspend(() =>
  S.Struct({ Name: S.String, Tags: S.optional(TagMapInput) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateSink" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSinkInput",
}) as any as S.Schema<CreateSinkInput>;
export interface DeleteLinkInput {
  Identifier: string;
}
export const DeleteLinkInput = S.suspend(() =>
  S.Struct({ Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteLink" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLinkInput",
}) as any as S.Schema<DeleteLinkInput>;
export interface DeleteLinkOutput {}
export const DeleteLinkOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteLinkOutput",
}) as any as S.Schema<DeleteLinkOutput>;
export interface DeleteSinkInput {
  Identifier: string;
}
export const DeleteSinkInput = S.suspend(() =>
  S.Struct({ Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteSink" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSinkInput",
}) as any as S.Schema<DeleteSinkInput>;
export interface DeleteSinkOutput {}
export const DeleteSinkOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteSinkOutput",
}) as any as S.Schema<DeleteSinkOutput>;
export interface GetLinkInput {
  Identifier: string;
  IncludeTags?: boolean;
}
export const GetLinkInput = S.suspend(() =>
  S.Struct({ Identifier: S.String, IncludeTags: S.optional(S.Boolean) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetLink" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetLinkInput" }) as any as S.Schema<GetLinkInput>;
export interface GetSinkInput {
  Identifier: string;
  IncludeTags?: boolean;
}
export const GetSinkInput = S.suspend(() =>
  S.Struct({ Identifier: S.String, IncludeTags: S.optional(S.Boolean) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetSink" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetSinkInput" }) as any as S.Schema<GetSinkInput>;
export interface GetSinkPolicyInput {
  SinkIdentifier: string;
}
export const GetSinkPolicyInput = S.suspend(() =>
  S.Struct({ SinkIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetSinkPolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSinkPolicyInput",
}) as any as S.Schema<GetSinkPolicyInput>;
export interface ListAttachedLinksInput {
  MaxResults?: number;
  NextToken?: string;
  SinkIdentifier: string;
}
export const ListAttachedLinksInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    SinkIdentifier: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListAttachedLinks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAttachedLinksInput",
}) as any as S.Schema<ListAttachedLinksInput>;
export interface ListLinksInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListLinksInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListLinks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLinksInput",
}) as any as S.Schema<ListLinksInput>;
export interface ListSinksInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListSinksInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListSinks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSinksInput",
}) as any as S.Schema<ListSinksInput>;
export interface ListTagsForResourceInput {
  ResourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
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
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface PutSinkPolicyInput {
  SinkIdentifier: string;
  Policy: string;
}
export const PutSinkPolicyInput = S.suspend(() =>
  S.Struct({ SinkIdentifier: S.String, Policy: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutSinkPolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutSinkPolicyInput",
}) as any as S.Schema<PutSinkPolicyInput>;
export interface TagResourceInput {
  ResourceArn: string;
  Tags: TagMapInput;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMapInput,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface UntagResourceInput {
  ResourceArn: string;
  TagKeys: TagKeys;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface LogGroupConfiguration {
  Filter: string;
}
export const LogGroupConfiguration = S.suspend(() =>
  S.Struct({ Filter: S.String }),
).annotations({
  identifier: "LogGroupConfiguration",
}) as any as S.Schema<LogGroupConfiguration>;
export interface MetricConfiguration {
  Filter: string;
}
export const MetricConfiguration = S.suspend(() =>
  S.Struct({ Filter: S.String }),
).annotations({
  identifier: "MetricConfiguration",
}) as any as S.Schema<MetricConfiguration>;
export interface LinkConfiguration {
  LogGroupConfiguration?: LogGroupConfiguration;
  MetricConfiguration?: MetricConfiguration;
}
export const LinkConfiguration = S.suspend(() =>
  S.Struct({
    LogGroupConfiguration: S.optional(LogGroupConfiguration),
    MetricConfiguration: S.optional(MetricConfiguration),
  }),
).annotations({
  identifier: "LinkConfiguration",
}) as any as S.Schema<LinkConfiguration>;
export interface UpdateLinkInput {
  Identifier: string;
  ResourceTypes: ResourceTypesInput;
  LinkConfiguration?: LinkConfiguration;
  IncludeTags?: boolean;
}
export const UpdateLinkInput = S.suspend(() =>
  S.Struct({
    Identifier: S.String,
    ResourceTypes: ResourceTypesInput,
    LinkConfiguration: S.optional(LinkConfiguration),
    IncludeTags: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateLink" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLinkInput",
}) as any as S.Schema<UpdateLinkInput>;
export type ResourceTypesOutput = string[];
export const ResourceTypesOutput = S.Array(S.String);
export type TagMapOutput = { [key: string]: string };
export const TagMapOutput = S.Record({ key: S.String, value: S.String });
export interface GetLinkOutput {
  Arn?: string;
  Id?: string;
  Label?: string;
  LabelTemplate?: string;
  ResourceTypes?: ResourceTypesOutput;
  SinkArn?: string;
  Tags?: TagMapOutput;
  LinkConfiguration?: LinkConfiguration;
}
export const GetLinkOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Label: S.optional(S.String),
    LabelTemplate: S.optional(S.String),
    ResourceTypes: S.optional(ResourceTypesOutput),
    SinkArn: S.optional(S.String),
    Tags: S.optional(TagMapOutput),
    LinkConfiguration: S.optional(LinkConfiguration),
  }),
).annotations({
  identifier: "GetLinkOutput",
}) as any as S.Schema<GetLinkOutput>;
export interface GetSinkOutput {
  Arn?: string;
  Id?: string;
  Name?: string;
  Tags?: TagMapOutput;
}
export const GetSinkOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Tags: S.optional(TagMapOutput),
  }),
).annotations({
  identifier: "GetSinkOutput",
}) as any as S.Schema<GetSinkOutput>;
export interface GetSinkPolicyOutput {
  SinkArn?: string;
  SinkId?: string;
  Policy?: string;
}
export const GetSinkPolicyOutput = S.suspend(() =>
  S.Struct({
    SinkArn: S.optional(S.String),
    SinkId: S.optional(S.String),
    Policy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSinkPolicyOutput",
}) as any as S.Schema<GetSinkPolicyOutput>;
export interface ListTagsForResourceOutput {
  Tags?: TagMapOutput;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMapOutput) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface PutSinkPolicyOutput {
  SinkArn?: string;
  SinkId?: string;
  Policy?: string;
}
export const PutSinkPolicyOutput = S.suspend(() =>
  S.Struct({
    SinkArn: S.optional(S.String),
    SinkId: S.optional(S.String),
    Policy: S.optional(S.String),
  }),
).annotations({
  identifier: "PutSinkPolicyOutput",
}) as any as S.Schema<PutSinkPolicyOutput>;
export interface UpdateLinkOutput {
  Arn?: string;
  Id?: string;
  Label?: string;
  LabelTemplate?: string;
  ResourceTypes?: ResourceTypesOutput;
  SinkArn?: string;
  Tags?: TagMapOutput;
  LinkConfiguration?: LinkConfiguration;
}
export const UpdateLinkOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Label: S.optional(S.String),
    LabelTemplate: S.optional(S.String),
    ResourceTypes: S.optional(ResourceTypesOutput),
    SinkArn: S.optional(S.String),
    Tags: S.optional(TagMapOutput),
    LinkConfiguration: S.optional(LinkConfiguration),
  }),
).annotations({
  identifier: "UpdateLinkOutput",
}) as any as S.Schema<UpdateLinkOutput>;
export interface ListAttachedLinksItem {
  Label?: string;
  LinkArn?: string;
  ResourceTypes?: ResourceTypesOutput;
}
export const ListAttachedLinksItem = S.suspend(() =>
  S.Struct({
    Label: S.optional(S.String),
    LinkArn: S.optional(S.String),
    ResourceTypes: S.optional(ResourceTypesOutput),
  }),
).annotations({
  identifier: "ListAttachedLinksItem",
}) as any as S.Schema<ListAttachedLinksItem>;
export type ListAttachedLinksItems = ListAttachedLinksItem[];
export const ListAttachedLinksItems = S.Array(ListAttachedLinksItem);
export interface ListLinksItem {
  Arn?: string;
  Id?: string;
  Label?: string;
  ResourceTypes?: ResourceTypesOutput;
  SinkArn?: string;
}
export const ListLinksItem = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Label: S.optional(S.String),
    ResourceTypes: S.optional(ResourceTypesOutput),
    SinkArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLinksItem",
}) as any as S.Schema<ListLinksItem>;
export type ListLinksItems = ListLinksItem[];
export const ListLinksItems = S.Array(ListLinksItem);
export interface ListSinksItem {
  Arn?: string;
  Id?: string;
  Name?: string;
}
export const ListSinksItem = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSinksItem",
}) as any as S.Schema<ListSinksItem>;
export type ListSinksItems = ListSinksItem[];
export const ListSinksItems = S.Array(ListSinksItem);
export interface CreateLinkInput {
  LabelTemplate: string;
  ResourceTypes: ResourceTypesInput;
  SinkIdentifier: string;
  Tags?: TagMapInput;
  LinkConfiguration?: LinkConfiguration;
}
export const CreateLinkInput = S.suspend(() =>
  S.Struct({
    LabelTemplate: S.String,
    ResourceTypes: ResourceTypesInput,
    SinkIdentifier: S.String,
    Tags: S.optional(TagMapInput),
    LinkConfiguration: S.optional(LinkConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateLink" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLinkInput",
}) as any as S.Schema<CreateLinkInput>;
export interface CreateSinkOutput {
  Arn?: string;
  Id?: string;
  Name?: string;
  Tags?: TagMapOutput;
}
export const CreateSinkOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Tags: S.optional(TagMapOutput),
  }),
).annotations({
  identifier: "CreateSinkOutput",
}) as any as S.Schema<CreateSinkOutput>;
export interface ListAttachedLinksOutput {
  Items: ListAttachedLinksItems;
  NextToken?: string;
}
export const ListAttachedLinksOutput = S.suspend(() =>
  S.Struct({ Items: ListAttachedLinksItems, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAttachedLinksOutput",
}) as any as S.Schema<ListAttachedLinksOutput>;
export interface ListLinksOutput {
  Items: ListLinksItems;
  NextToken?: string;
}
export const ListLinksOutput = S.suspend(() =>
  S.Struct({ Items: ListLinksItems, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListLinksOutput",
}) as any as S.Schema<ListLinksOutput>;
export interface ListSinksOutput {
  Items: ListSinksItems;
  NextToken?: string;
}
export const ListSinksOutput = S.suspend(() =>
  S.Struct({ Items: ListSinksItems, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSinksOutput",
}) as any as S.Schema<ListSinksOutput>;
export interface CreateLinkOutput {
  Arn?: string;
  Id?: string;
  Label?: string;
  LabelTemplate?: string;
  ResourceTypes?: ResourceTypesOutput;
  SinkArn?: string;
  Tags?: TagMapOutput;
  LinkConfiguration?: LinkConfiguration;
}
export const CreateLinkOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Label: S.optional(S.String),
    LabelTemplate: S.optional(S.String),
    ResourceTypes: S.optional(ResourceTypesOutput),
    SinkArn: S.optional(S.String),
    Tags: S.optional(TagMapOutput),
    LinkConfiguration: S.optional(LinkConfiguration),
  }),
).annotations({
  identifier: "CreateLinkOutput",
}) as any as S.Schema<CreateLinkOutput>;

//# Errors
export class InternalServiceFault extends S.TaggedError<InternalServiceFault>()(
  "InternalServiceFault",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withBadRequestError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {
    message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MissingRequiredParameterException extends S.TaggedError<MissingRequiredParameterException>()(
  "MissingRequiredParameterException",
  {
    message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Use this operation in a source account to return a list of links to monitoring account sinks that this source account has.
 *
 * To find a list of links for one monitoring account sink, use ListAttachedLinks from within the monitoring account.
 */
export const listLinks: {
  (
    input: ListLinksInput,
  ): Effect.Effect<
    ListLinksOutput,
    | InternalServiceFault
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLinksInput,
  ) => Stream.Stream<
    ListLinksOutput,
    | InternalServiceFault
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLinksInput,
  ) => Stream.Stream<
    ListLinksItem,
    | InternalServiceFault
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLinksInput,
  output: ListLinksOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Use this operation in a monitoring account to return the list of sinks created in that account.
 */
export const listSinks: {
  (
    input: ListSinksInput,
  ): Effect.Effect<
    ListSinksOutput,
    | InternalServiceFault
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSinksInput,
  ) => Stream.Stream<
    ListSinksOutput,
    | InternalServiceFault
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSinksInput,
  ) => Stream.Stream<
    ListSinksItem,
    | InternalServiceFault
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSinksInput,
  output: ListSinksOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Removes one or more tags from the specified resource.
 *
 * Unlike tagging permissions in other Amazon Web Services services, to tag or untag links and sinks you must have the `oam:ResourceTag` permission. The `iam:TagResource` permission does not allow you to tag and untag links and sinks.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Displays the tags associated with a resource. Both sinks and links support tagging.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified resource. Both sinks and links can be tagged.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters.
 *
 * You can use the `TagResource` action with a resource that already has tags. If you specify a new tag key for the alarm, this tag is appended to the list of tags associated with the alarm. If you specify a tag key that is already associated with the alarm, the new tag value that you specify replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a resource.
 *
 * Unlike tagging permissions in other Amazon Web Services services, to tag or untag links and sinks you must have the `oam:ResourceTag` permission. The `iam:ResourceTag` permission does not allow you to tag and untag links and sinks.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | ResourceNotFoundException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    ResourceNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Deletes a link between a monitoring account sink and a source account. You must run this operation in the source account.
 */
export const deleteLink: (
  input: DeleteLinkInput,
) => Effect.Effect<
  DeleteLinkOutput,
  | InternalServiceFault
  | InvalidParameterException
  | MissingRequiredParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLinkInput,
  output: DeleteLinkOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterException,
    MissingRequiredParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of source account links that are linked to this monitoring account sink.
 *
 * To use this operation, provide the sink ARN. To retrieve a list of sink ARNs, use ListSinks.
 *
 * To find a list of links for one source account, use ListLinks.
 */
export const listAttachedLinks: {
  (
    input: ListAttachedLinksInput,
  ): Effect.Effect<
    ListAttachedLinksOutput,
    | InternalServiceFault
    | InvalidParameterException
    | MissingRequiredParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttachedLinksInput,
  ) => Stream.Stream<
    ListAttachedLinksOutput,
    | InternalServiceFault
    | InvalidParameterException
    | MissingRequiredParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttachedLinksInput,
  ) => Stream.Stream<
    ListAttachedLinksItem,
    | InternalServiceFault
    | InvalidParameterException
    | MissingRequiredParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAttachedLinksInput,
  output: ListAttachedLinksOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterException,
    MissingRequiredParameterException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes a sink. You must delete all links to a sink before you can delete that sink.
 */
export const deleteSink: (
  input: DeleteSinkInput,
) => Effect.Effect<
  DeleteSinkOutput,
  | ConflictException
  | InternalServiceFault
  | InvalidParameterException
  | MissingRequiredParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSinkInput,
  output: DeleteSinkOutput,
  errors: [
    ConflictException,
    InternalServiceFault,
    InvalidParameterException,
    MissingRequiredParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns complete information about one link.
 *
 * To use this operation, provide the link ARN. To retrieve a list of link ARNs, use ListLinks.
 */
export const getLink: (
  input: GetLinkInput,
) => Effect.Effect<
  GetLinkOutput,
  | InternalServiceFault
  | InvalidParameterException
  | MissingRequiredParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLinkInput,
  output: GetLinkOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterException,
    MissingRequiredParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns complete information about one monitoring account sink.
 *
 * To use this operation, provide the sink ARN. To retrieve a list of sink ARNs, use ListSinks.
 */
export const getSink: (
  input: GetSinkInput,
) => Effect.Effect<
  GetSinkOutput,
  | InternalServiceFault
  | InvalidParameterException
  | MissingRequiredParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSinkInput,
  output: GetSinkOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterException,
    MissingRequiredParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the current sink policy attached to this sink. The sink policy specifies what accounts can attach to this sink as source accounts, and what types of data they can share.
 */
export const getSinkPolicy: (
  input: GetSinkPolicyInput,
) => Effect.Effect<
  GetSinkPolicyOutput,
  | InternalServiceFault
  | InvalidParameterException
  | MissingRequiredParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSinkPolicyInput,
  output: GetSinkPolicyOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterException,
    MissingRequiredParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates or updates the resource policy that grants permissions to source accounts to link to the monitoring account sink. When you create a sink policy, you can grant permissions to all accounts in an organization or to individual accounts.
 *
 * You can also use a sink policy to limit the types of data that is shared. The six types of services with their respective resource types that you can allow or deny are:
 *
 * - **Metrics** - Specify with `AWS::CloudWatch::Metric`
 *
 * - **Log groups** - Specify with `AWS::Logs::LogGroup`
 *
 * - **Traces** - Specify with `AWS::XRay::Trace`
 *
 * - **Application Insights - Applications** - Specify with `AWS::ApplicationInsights::Application`
 *
 * - **Internet Monitor** - Specify with `AWS::InternetMonitor::Monitor`
 *
 * - **Application Signals** - Specify with `AWS::ApplicationSignals::Service` and `AWS::ApplicationSignals::ServiceLevelObjective`
 *
 * See the examples in this section to see how to specify permitted source accounts and data types.
 */
export const putSinkPolicy: (
  input: PutSinkPolicyInput,
) => Effect.Effect<
  PutSinkPolicyOutput,
  | InternalServiceFault
  | InvalidParameterException
  | MissingRequiredParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSinkPolicyInput,
  output: PutSinkPolicyOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterException,
    MissingRequiredParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Use this operation to change what types of data are shared from a source account to its linked monitoring account sink. You can't change the sink or change the monitoring account with this operation.
 *
 * When you update a link, you can optionally specify filters that specify which metric namespaces and which log groups are shared from the source account to the monitoring account.
 *
 * To update the list of tags associated with the sink, use TagResource.
 */
export const updateLink: (
  input: UpdateLinkInput,
) => Effect.Effect<
  UpdateLinkOutput,
  | InternalServiceFault
  | InvalidParameterException
  | MissingRequiredParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLinkInput,
  output: UpdateLinkOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterException,
    MissingRequiredParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Use this to create a *sink* in the current account, so that it can be used as a monitoring account in CloudWatch cross-account observability. A sink is a resource that represents an attachment point in a monitoring account. Source accounts can link to the sink to send observability data.
 *
 * After you create a sink, you must create a sink policy that allows source accounts to attach to it. For more information, see PutSinkPolicy.
 *
 * Each account can contain one sink per Region. If you delete a sink, you can then create a new one in that Region.
 */
export const createSink: (
  input: CreateSinkInput,
) => Effect.Effect<
  CreateSinkOutput,
  | ConflictException
  | InternalServiceFault
  | InvalidParameterException
  | MissingRequiredParameterException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSinkInput,
  output: CreateSinkOutput,
  errors: [
    ConflictException,
    InternalServiceFault,
    InvalidParameterException,
    MissingRequiredParameterException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Creates a link between a source account and a sink that you have created in a monitoring account. After the link is created, data is sent from the source account to the monitoring account. When you create a link, you can optionally specify filters that specify which metric namespaces and which log groups are shared from the source account to the monitoring account.
 *
 * Before you create a link, you must create a sink in the monitoring account and create a sink policy in that account. The sink policy must permit the source account to link to it. You can grant permission to source accounts by granting permission to an entire organization or to individual accounts.
 *
 * For more information, see CreateSink and PutSinkPolicy.
 *
 * Each monitoring account can be linked to as many as 100,000 source accounts.
 *
 * Each source account can be linked to as many as five monitoring accounts.
 */
export const createLink: (
  input: CreateLinkInput,
) => Effect.Effect<
  CreateLinkOutput,
  | ConflictException
  | InternalServiceFault
  | InvalidParameterException
  | MissingRequiredParameterException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLinkInput,
  output: CreateLinkOutput,
  errors: [
    ConflictException,
    InternalServiceFault,
    InvalidParameterException,
    MissingRequiredParameterException,
    ServiceQuotaExceededException,
  ],
}));

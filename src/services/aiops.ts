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
const svc = T.AwsApiService({ sdkId: "AIOps", serviceShapeName: "AIOps" });
const auth = T.AwsAuthSigv4({ name: "aiops" });
const ver = T.ServiceVersion("2018-05-10");
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
                                url: "https://aiops-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://aiops-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://aiops.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://aiops.{Region}.{PartitionResult#dnsSuffix}",
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
export type TagKey = string;
export type StringWithPatternAndLengthLimits = string;
export type RoleArn = string;
export type Retention = number;
export type InvestigationGroupIdentifier = string;
export type SensitiveStringWithLengthLimits =
  | string
  | Redacted.Redacted<string>;
export type InvestigationGroupPolicyDocument = string;
export type TagValue = string;
export type KmsKeyId = string;
export type SNSTopicArn = string;
export type ChatConfigurationArn = string;
export type IdentifierStringWithPatternAndLengthLimits = string;
export type InvestigationGroupArn = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type TagKeyBoundaries = string[];
export const TagKeyBoundaries = S.Array(S.String);
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface GetInvestigationGroupRequest {
  identifier: string;
}
export const GetInvestigationGroupRequest = S.suspend(() =>
  S.Struct({ identifier: S.String.pipe(T.HttpLabel("identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/investigationGroups/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInvestigationGroupRequest",
}) as any as S.Schema<GetInvestigationGroupRequest>;
export interface EncryptionConfiguration {
  type?: string;
  kmsKeyId?: string;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), kmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export type ChatConfigurationArns = string[];
export const ChatConfigurationArns = S.Array(S.String);
export type ChatbotNotificationChannel = {
  [key: string]: ChatConfigurationArns;
};
export const ChatbotNotificationChannel = S.Record({
  key: S.String,
  value: ChatConfigurationArns,
});
export interface CrossAccountConfiguration {
  sourceRoleArn?: string;
}
export const CrossAccountConfiguration = S.suspend(() =>
  S.Struct({ sourceRoleArn: S.optional(S.String) }),
).annotations({
  identifier: "CrossAccountConfiguration",
}) as any as S.Schema<CrossAccountConfiguration>;
export type CrossAccountConfigurations = CrossAccountConfiguration[];
export const CrossAccountConfigurations = S.Array(CrossAccountConfiguration);
export interface UpdateInvestigationGroupRequest {
  identifier: string;
  roleArn?: string;
  encryptionConfiguration?: EncryptionConfiguration;
  tagKeyBoundaries?: TagKeyBoundaries;
  chatbotNotificationChannel?: ChatbotNotificationChannel;
  isCloudTrailEventHistoryEnabled?: boolean;
  crossAccountConfigurations?: CrossAccountConfigurations;
}
export const UpdateInvestigationGroupRequest = S.suspend(() =>
  S.Struct({
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    roleArn: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tagKeyBoundaries: S.optional(TagKeyBoundaries),
    chatbotNotificationChannel: S.optional(ChatbotNotificationChannel),
    isCloudTrailEventHistoryEnabled: S.optional(S.Boolean),
    crossAccountConfigurations: S.optional(CrossAccountConfigurations),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/investigationGroups/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateInvestigationGroupRequest",
}) as any as S.Schema<UpdateInvestigationGroupRequest>;
export interface UpdateInvestigationGroupOutput {}
export const UpdateInvestigationGroupOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateInvestigationGroupOutput",
}) as any as S.Schema<UpdateInvestigationGroupOutput>;
export interface DeleteInvestigationGroupRequest {
  identifier: string;
}
export const DeleteInvestigationGroupRequest = S.suspend(() =>
  S.Struct({ identifier: S.String.pipe(T.HttpLabel("identifier")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/investigationGroups/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInvestigationGroupRequest",
}) as any as S.Schema<DeleteInvestigationGroupRequest>;
export interface DeleteInvestigationGroupResponse {}
export const DeleteInvestigationGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteInvestigationGroupResponse",
}) as any as S.Schema<DeleteInvestigationGroupResponse>;
export interface ListInvestigationGroupsInput {
  nextToken?: string | Redacted.Redacted<string>;
  maxResults?: number;
}
export const ListInvestigationGroupsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(SensitiveString).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/investigationGroups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInvestigationGroupsInput",
}) as any as S.Schema<ListInvestigationGroupsInput>;
export interface PutInvestigationGroupPolicyRequest {
  identifier: string;
  policy: string;
}
export const PutInvestigationGroupPolicyRequest = S.suspend(() =>
  S.Struct({
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    policy: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/investigationGroups/{identifier}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutInvestigationGroupPolicyRequest",
}) as any as S.Schema<PutInvestigationGroupPolicyRequest>;
export interface GetInvestigationGroupPolicyRequest {
  identifier: string;
}
export const GetInvestigationGroupPolicyRequest = S.suspend(() =>
  S.Struct({ identifier: S.String.pipe(T.HttpLabel("identifier")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/investigationGroups/{identifier}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInvestigationGroupPolicyRequest",
}) as any as S.Schema<GetInvestigationGroupPolicyRequest>;
export interface DeleteInvestigationGroupPolicyRequest {
  identifier: string;
}
export const DeleteInvestigationGroupPolicyRequest = S.suspend(() =>
  S.Struct({ identifier: S.String.pipe(T.HttpLabel("identifier")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/investigationGroups/{identifier}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInvestigationGroupPolicyRequest",
}) as any as S.Schema<DeleteInvestigationGroupPolicyRequest>;
export interface DeleteInvestigationGroupPolicyOutput {}
export const DeleteInvestigationGroupPolicyOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteInvestigationGroupPolicyOutput",
}) as any as S.Schema<DeleteInvestigationGroupPolicyOutput>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface ListTagsForResourceOutput {
  tags?: Tags;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface CreateInvestigationGroupInput {
  name: string;
  roleArn: string;
  encryptionConfiguration?: EncryptionConfiguration;
  retentionInDays?: number;
  tags?: Tags;
  tagKeyBoundaries?: TagKeyBoundaries;
  chatbotNotificationChannel?: ChatbotNotificationChannel;
  isCloudTrailEventHistoryEnabled?: boolean;
  crossAccountConfigurations?: CrossAccountConfigurations;
}
export const CreateInvestigationGroupInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    roleArn: S.String,
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    retentionInDays: S.optional(S.Number),
    tags: S.optional(Tags),
    tagKeyBoundaries: S.optional(TagKeyBoundaries),
    chatbotNotificationChannel: S.optional(ChatbotNotificationChannel),
    isCloudTrailEventHistoryEnabled: S.optional(S.Boolean),
    crossAccountConfigurations: S.optional(CrossAccountConfigurations),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/investigationGroups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInvestigationGroupInput",
}) as any as S.Schema<CreateInvestigationGroupInput>;
export interface GetInvestigationGroupResponse {
  createdBy?: string;
  createdAt?: number;
  lastModifiedBy?: string;
  lastModifiedAt?: number;
  name?: string;
  arn?: string;
  roleArn?: string;
  encryptionConfiguration?: EncryptionConfiguration;
  retentionInDays?: number;
  chatbotNotificationChannel?: ChatbotNotificationChannel;
  tagKeyBoundaries?: TagKeyBoundaries;
  isCloudTrailEventHistoryEnabled?: boolean;
  crossAccountConfigurations?: CrossAccountConfigurations;
}
export const GetInvestigationGroupResponse = S.suspend(() =>
  S.Struct({
    createdBy: S.optional(S.String),
    createdAt: S.optional(S.Number),
    lastModifiedBy: S.optional(S.String),
    lastModifiedAt: S.optional(S.Number),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    roleArn: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    retentionInDays: S.optional(S.Number),
    chatbotNotificationChannel: S.optional(ChatbotNotificationChannel),
    tagKeyBoundaries: S.optional(TagKeyBoundaries),
    isCloudTrailEventHistoryEnabled: S.optional(S.Boolean),
    crossAccountConfigurations: S.optional(CrossAccountConfigurations),
  }),
).annotations({
  identifier: "GetInvestigationGroupResponse",
}) as any as S.Schema<GetInvestigationGroupResponse>;
export interface PutInvestigationGroupPolicyResponse {
  investigationGroupArn?: string;
}
export const PutInvestigationGroupPolicyResponse = S.suspend(() =>
  S.Struct({ investigationGroupArn: S.optional(S.String) }),
).annotations({
  identifier: "PutInvestigationGroupPolicyResponse",
}) as any as S.Schema<PutInvestigationGroupPolicyResponse>;
export interface GetInvestigationGroupPolicyResponse {
  investigationGroupArn?: string;
  policy?: string;
}
export const GetInvestigationGroupPolicyResponse = S.suspend(() =>
  S.Struct({
    investigationGroupArn: S.optional(S.String),
    policy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetInvestigationGroupPolicyResponse",
}) as any as S.Schema<GetInvestigationGroupPolicyResponse>;
export interface ListInvestigationGroupsModel {
  arn?: string;
  name?: string;
}
export const ListInvestigationGroupsModel = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String), name: S.optional(S.String) }),
).annotations({
  identifier: "ListInvestigationGroupsModel",
}) as any as S.Schema<ListInvestigationGroupsModel>;
export type InvestigationGroups = ListInvestigationGroupsModel[];
export const InvestigationGroups = S.Array(ListInvestigationGroupsModel);
export interface CreateInvestigationGroupOutput {
  arn?: string;
}
export const CreateInvestigationGroupOutput = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateInvestigationGroupOutput",
}) as any as S.Schema<CreateInvestigationGroupOutput>;
export interface ListInvestigationGroupsOutput {
  nextToken?: string | Redacted.Redacted<string>;
  investigationGroups?: InvestigationGroups;
}
export const ListInvestigationGroupsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(SensitiveString),
    investigationGroups: S.optional(InvestigationGroups),
  }),
).annotations({
  identifier: "ListInvestigationGroupsOutput",
}) as any as S.Schema<ListInvestigationGroupsOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Returns the ARN and name of each investigation group in the account.
 */
export const listInvestigationGroups: {
  (
    input: ListInvestigationGroupsInput,
  ): Effect.Effect<
    ListInvestigationGroupsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvestigationGroupsInput,
  ) => Stream.Stream<
    ListInvestigationGroupsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvestigationGroupsInput,
  ) => Stream.Stream<
    ListInvestigationGroupsModel,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInvestigationGroupsInput,
  output: ListInvestigationGroupsOutput,
  errors: [AccessDeniedException, InternalServerException, ThrottlingException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "investigationGroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes the specified investigation group from your account. You can currently have one investigation group per Region in your account. After you delete an investigation group, you can later create a new investigation group in the same Region.
 */
export const deleteInvestigationGroup: (
  input: DeleteInvestigationGroupRequest,
) => Effect.Effect<
  DeleteInvestigationGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInvestigationGroupRequest,
  output: DeleteInvestigationGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the configuration information for the specified investigation group.
 */
export const getInvestigationGroup: (
  input: GetInvestigationGroupRequest,
) => Effect.Effect<
  GetInvestigationGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvestigationGroupRequest,
  output: GetInvestigationGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an IAM resource policy and assigns it to the specified investigation group.
 *
 * If you create your investigation group with `CreateInvestigationGroup` and you want to enable CloudWatch alarms to create investigations and add events to investigations, you must use this operation to create a policy similar to this example.
 *
 * ` { "Version": "2008-10-17", "Statement": [ { "Effect": "Allow", "Principal": { "Service": "aiops.alarms.cloudwatch.amazonaws.com" }, "Action": [ "aiops:CreateInvestigation", "aiops:CreateInvestigationEvent" ], "Resource": "*", "Condition": { "StringEquals": { "aws:SourceAccount": "account-id" }, "ArnLike": { "aws:SourceArn": "arn:aws:cloudwatch:region:account-id:alarm:*" } } } ] } `
 */
export const putInvestigationGroupPolicy: (
  input: PutInvestigationGroupPolicyRequest,
) => Effect.Effect<
  PutInvestigationGroupPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutInvestigationGroupPolicyRequest,
  output: PutInvestigationGroupPolicyResponse,
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
 * Creates an *investigation group* in your account. Creating an investigation group is a one-time setup task for each Region in your account. It is a necessary task to be able to perform investigations.
 *
 * Settings in the investigation group help you centrally manage the common properties of your investigations, such as the following:
 *
 * - Who can access the investigations
 *
 * - Whether investigation data is encrypted with a customer managed Key Management Service key.
 *
 * - How long investigations and their data are retained by default.
 *
 * Currently, you can have one investigation group in each Region in your account. Each investigation in a Region is a part of the investigation group in that Region
 *
 * To create an investigation group and set up CloudWatch investigations, you must be signed in to an IAM principal that has either the `AIOpsConsoleAdminPolicy` or the `AdministratorAccess` IAM policy attached, or to an account that has similar permissions.
 *
 * You can configure CloudWatch alarms to start investigations and add events to investigations. If you create your investigation group with `CreateInvestigationGroup` and you want to enable alarms to do this, you must use `PutInvestigationGroupPolicy` to create a resource policy that grants this permission to CloudWatch alarms.
 *
 * For more information about configuring CloudWatch alarms, see Using Amazon CloudWatch alarms
 */
export const createInvestigationGroup: (
  input: CreateInvestigationGroupInput,
) => Effect.Effect<
  CreateInvestigationGroupOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInvestigationGroupInput,
  output: CreateInvestigationGroupOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of the specified investigation group.
 */
export const updateInvestigationGroup: (
  input: UpdateInvestigationGroupRequest,
) => Effect.Effect<
  UpdateInvestigationGroupOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInvestigationGroupRequest,
  output: UpdateInvestigationGroupOutput,
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
 * Displays the tags associated with a CloudWatch investigations resource. Currently, investigation groups support tagging.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceOutput,
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
 * Assigns one or more tags (key-value pairs) to the specified resource.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters.
 *
 * You can associate as many as 50 tags with a resource.
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
 * Returns the JSON of the IAM resource policy associated with the specified investigation group in a string. For example, `{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"aiops.alarms.cloudwatch.amazonaws.com\"},\"Action\":[\"aiops:CreateInvestigation\",\"aiops:CreateInvestigationEvent\"],\"Resource\":\"*\",\"Condition\":{\"StringEquals\":{\"aws:SourceAccount\":\"111122223333\"},\"ArnLike\":{\"aws:SourceArn\":\"arn:aws:cloudwatch:us-east-1:111122223333:alarm:*\"}}}]}`.
 */
export const getInvestigationGroupPolicy: (
  input: GetInvestigationGroupPolicyRequest,
) => Effect.Effect<
  GetInvestigationGroupPolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvestigationGroupPolicyRequest,
  output: GetInvestigationGroupPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the IAM resource policy from being associated with the investigation group that you specify.
 */
export const deleteInvestigationGroupPolicy: (
  input: DeleteInvestigationGroupPolicyRequest,
) => Effect.Effect<
  DeleteInvestigationGroupPolicyOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInvestigationGroupPolicyRequest,
  output: DeleteInvestigationGroupPolicyOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ConflictException
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
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

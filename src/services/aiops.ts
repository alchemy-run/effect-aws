import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export const TagKeys = S.Array(S.String);
export const TagKeyBoundaries = S.Array(S.String);
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export class GetInvestigationGroupRequest extends S.Class<GetInvestigationGroupRequest>(
  "GetInvestigationGroupRequest",
)(
  { identifier: S.String.pipe(T.HttpLabel("identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/investigationGroups/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({ type: S.optional(S.String), kmsKeyId: S.optional(S.String) }) {}
export const ChatConfigurationArns = S.Array(S.String);
export const ChatbotNotificationChannel = S.Record({
  key: S.String,
  value: ChatConfigurationArns,
});
export class CrossAccountConfiguration extends S.Class<CrossAccountConfiguration>(
  "CrossAccountConfiguration",
)({ sourceRoleArn: S.optional(S.String) }) {}
export const CrossAccountConfigurations = S.Array(CrossAccountConfiguration);
export class UpdateInvestigationGroupRequest extends S.Class<UpdateInvestigationGroupRequest>(
  "UpdateInvestigationGroupRequest",
)(
  {
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    roleArn: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tagKeyBoundaries: S.optional(TagKeyBoundaries),
    chatbotNotificationChannel: S.optional(ChatbotNotificationChannel),
    isCloudTrailEventHistoryEnabled: S.optional(S.Boolean),
    crossAccountConfigurations: S.optional(CrossAccountConfigurations),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/investigationGroups/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateInvestigationGroupOutput extends S.Class<UpdateInvestigationGroupOutput>(
  "UpdateInvestigationGroupOutput",
)({}) {}
export class DeleteInvestigationGroupRequest extends S.Class<DeleteInvestigationGroupRequest>(
  "DeleteInvestigationGroupRequest",
)(
  { identifier: S.String.pipe(T.HttpLabel("identifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/investigationGroups/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInvestigationGroupResponse extends S.Class<DeleteInvestigationGroupResponse>(
  "DeleteInvestigationGroupResponse",
)({}) {}
export class ListInvestigationGroupsInput extends S.Class<ListInvestigationGroupsInput>(
  "ListInvestigationGroupsInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/investigationGroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutInvestigationGroupPolicyRequest extends S.Class<PutInvestigationGroupPolicyRequest>(
  "PutInvestigationGroupPolicyRequest",
)(
  { identifier: S.String.pipe(T.HttpLabel("identifier")), policy: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/investigationGroups/{identifier}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInvestigationGroupPolicyRequest extends S.Class<GetInvestigationGroupPolicyRequest>(
  "GetInvestigationGroupPolicyRequest",
)(
  { identifier: S.String.pipe(T.HttpLabel("identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/investigationGroups/{identifier}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInvestigationGroupPolicyRequest extends S.Class<DeleteInvestigationGroupPolicyRequest>(
  "DeleteInvestigationGroupPolicyRequest",
)(
  { identifier: S.String.pipe(T.HttpLabel("identifier")) },
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
) {}
export class DeleteInvestigationGroupPolicyOutput extends S.Class<DeleteInvestigationGroupPolicyOutput>(
  "DeleteInvestigationGroupPolicyOutput",
)({}) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: Tags },
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
export class CreateInvestigationGroupInput extends S.Class<CreateInvestigationGroupInput>(
  "CreateInvestigationGroupInput",
)(
  {
    name: S.String,
    roleArn: S.String,
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    retentionInDays: S.optional(S.Number),
    tags: S.optional(Tags),
    tagKeyBoundaries: S.optional(TagKeyBoundaries),
    chatbotNotificationChannel: S.optional(ChatbotNotificationChannel),
    isCloudTrailEventHistoryEnabled: S.optional(S.Boolean),
    crossAccountConfigurations: S.optional(CrossAccountConfigurations),
  },
  T.all(
    T.Http({ method: "POST", uri: "/investigationGroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInvestigationGroupResponse extends S.Class<GetInvestigationGroupResponse>(
  "GetInvestigationGroupResponse",
)({
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
}) {}
export class PutInvestigationGroupPolicyResponse extends S.Class<PutInvestigationGroupPolicyResponse>(
  "PutInvestigationGroupPolicyResponse",
)({ investigationGroupArn: S.optional(S.String) }) {}
export class GetInvestigationGroupPolicyResponse extends S.Class<GetInvestigationGroupPolicyResponse>(
  "GetInvestigationGroupPolicyResponse",
)({
  investigationGroupArn: S.optional(S.String),
  policy: S.optional(S.String),
}) {}
export class ListInvestigationGroupsModel extends S.Class<ListInvestigationGroupsModel>(
  "ListInvestigationGroupsModel",
)({ arn: S.optional(S.String), name: S.optional(S.String) }) {}
export const InvestigationGroups = S.Array(ListInvestigationGroupsModel);
export class CreateInvestigationGroupOutput extends S.Class<CreateInvestigationGroupOutput>(
  "CreateInvestigationGroupOutput",
)({ arn: S.optional(S.String) }) {}
export class ListInvestigationGroupsOutput extends S.Class<ListInvestigationGroupsOutput>(
  "ListInvestigationGroupsOutput",
)({
  nextToken: S.optional(S.String),
  investigationGroups: S.optional(InvestigationGroups),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
) {}

//# Operations
/**
 * Returns the ARN and name of each investigation group in the account.
 */
export const listInvestigationGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListInvestigationGroupsInput,
    output: ListInvestigationGroupsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
    ],
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
export const deleteInvestigationGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInvestigationGroupRequest,
    output: DeleteInvestigationGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the configuration information for the specified investigation group.
 */
export const getInvestigationGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetInvestigationGroupRequest,
    output: GetInvestigationGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates an IAM resource policy and assigns it to the specified investigation group.
 *
 * If you create your investigation group with `CreateInvestigationGroup` and you want to enable CloudWatch alarms to create investigations and add events to investigations, you must use this operation to create a policy similar to this example.
 *
 * ` { "Version": "2008-10-17", "Statement": [ { "Effect": "Allow", "Principal": { "Service": "aiops.alarms.cloudwatch.amazonaws.com" }, "Action": [ "aiops:CreateInvestigation", "aiops:CreateInvestigationEvent" ], "Resource": "*", "Condition": { "StringEquals": { "aws:SourceAccount": "account-id" }, "ArnLike": { "aws:SourceArn": "arn:aws:cloudwatch:region:account-id:alarm:*" } } } ] } `
 */
export const putInvestigationGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const createInvestigationGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the configuration of the specified investigation group.
 */
export const updateInvestigationGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Displays the tags associated with a CloudWatch investigations resource. Currently, investigation groups support tagging.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns the JSON of the IAM resource policy associated with the specified investigation group in a string. For example, `{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"aiops.alarms.cloudwatch.amazonaws.com\"},\"Action\":[\"aiops:CreateInvestigation\",\"aiops:CreateInvestigationEvent\"],\"Resource\":\"*\",\"Condition\":{\"StringEquals\":{\"aws:SourceAccount\":\"111122223333\"},\"ArnLike\":{\"aws:SourceArn\":\"arn:aws:cloudwatch:us-east-1:111122223333:alarm:*\"}}}]}`.
 */
export const getInvestigationGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetInvestigationGroupPolicyRequest,
    output: GetInvestigationGroupPolicyResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Removes the IAM resource policy from being associated with the investigation group that you specify.
 */
export const deleteInvestigationGroupPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

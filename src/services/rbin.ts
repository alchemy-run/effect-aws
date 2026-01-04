import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "rbin",
  serviceShapeName: "AmazonRecycleBin",
});
const auth = T.AwsAuthSigv4({ name: "rbin" });
const ver = T.ServiceVersion("2021-06-15");
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
                        url: "https://rbin-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://rbin-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://rbin.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://rbin.{Region}.{PartitionResult#dnsSuffix}",
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
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  ResourceTagKey: S.String,
  ResourceTagValue: S.optional(S.String),
}) {}
export const ExcludeResourceTags = S.Array(ResourceTag);
export const TagKeyList = S.Array(S.String);
export class DeleteRuleRequest extends S.Class<DeleteRuleRequest>(
  "DeleteRuleRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/rules/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRuleResponse extends S.Class<DeleteRuleResponse>(
  "DeleteRuleResponse",
)({}) {}
export class GetRuleRequest extends S.Class<GetRuleRequest>("GetRuleRequest")(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/rules/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ResourceTags = S.Array(ResourceTag);
export class ListRulesRequest extends S.Class<ListRulesRequest>(
  "ListRulesRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ResourceType: S.String,
    ResourceTags: S.optional(ResourceTags),
    LockState: S.optional(S.String),
    ExcludeResourceTags: S.optional(ExcludeResourceTags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-rules" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UnlockDelay extends S.Class<UnlockDelay>("UnlockDelay")({
  UnlockDelayValue: S.Number,
  UnlockDelayUnit: S.String,
}) {}
export class LockConfiguration extends S.Class<LockConfiguration>(
  "LockConfiguration",
)({ UnlockDelay: UnlockDelay }) {}
export class LockRuleRequest extends S.Class<LockRuleRequest>(
  "LockRuleRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    LockConfiguration: LockConfiguration,
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/rules/{Identifier}/lock" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export class UnlockRuleRequest extends S.Class<UnlockRuleRequest>(
  "UnlockRuleRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "PATCH", uri: "/rules/{Identifier}/unlock" }),
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
    ResourceArn: S.String.pipe(T.HttpLabel()),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export class RetentionPeriod extends S.Class<RetentionPeriod>(
  "RetentionPeriod",
)({ RetentionPeriodValue: S.Number, RetentionPeriodUnit: S.String }) {}
export class UpdateRuleRequest extends S.Class<UpdateRuleRequest>(
  "UpdateRuleRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    RetentionPeriod: S.optional(RetentionPeriod),
    Description: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceTags: S.optional(ResourceTags),
    ExcludeResourceTags: S.optional(ExcludeResourceTags),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/rules/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRuleResponse extends S.Class<GetRuleResponse>(
  "GetRuleResponse",
)({
  Identifier: S.optional(S.String),
  Description: S.optional(S.String),
  ResourceType: S.optional(S.String),
  RetentionPeriod: S.optional(RetentionPeriod),
  ResourceTags: S.optional(ResourceTags),
  Status: S.optional(S.String),
  LockConfiguration: S.optional(LockConfiguration),
  LockState: S.optional(S.String),
  LockEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RuleArn: S.optional(S.String),
  ExcludeResourceTags: S.optional(ExcludeResourceTags),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class LockRuleResponse extends S.Class<LockRuleResponse>(
  "LockRuleResponse",
)({
  Identifier: S.optional(S.String),
  Description: S.optional(S.String),
  ResourceType: S.optional(S.String),
  RetentionPeriod: S.optional(RetentionPeriod),
  ResourceTags: S.optional(ResourceTags),
  Status: S.optional(S.String),
  LockConfiguration: S.optional(LockConfiguration),
  LockState: S.optional(S.String),
  RuleArn: S.optional(S.String),
  ExcludeResourceTags: S.optional(ExcludeResourceTags),
}) {}
export class UnlockRuleResponse extends S.Class<UnlockRuleResponse>(
  "UnlockRuleResponse",
)({
  Identifier: S.optional(S.String),
  Description: S.optional(S.String),
  ResourceType: S.optional(S.String),
  RetentionPeriod: S.optional(RetentionPeriod),
  ResourceTags: S.optional(ResourceTags),
  Status: S.optional(S.String),
  LockConfiguration: S.optional(LockConfiguration),
  LockState: S.optional(S.String),
  LockEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RuleArn: S.optional(S.String),
  ExcludeResourceTags: S.optional(ExcludeResourceTags),
}) {}
export class UpdateRuleResponse extends S.Class<UpdateRuleResponse>(
  "UpdateRuleResponse",
)({
  Identifier: S.optional(S.String),
  RetentionPeriod: S.optional(RetentionPeriod),
  Description: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceTags: S.optional(ResourceTags),
  Status: S.optional(S.String),
  LockState: S.optional(S.String),
  LockEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RuleArn: S.optional(S.String),
  ExcludeResourceTags: S.optional(ExcludeResourceTags),
}) {}
export class RuleSummary extends S.Class<RuleSummary>("RuleSummary")({
  Identifier: S.optional(S.String),
  Description: S.optional(S.String),
  RetentionPeriod: S.optional(RetentionPeriod),
  LockState: S.optional(S.String),
  RuleArn: S.optional(S.String),
}) {}
export const RuleSummaryList = S.Array(RuleSummary);
export class CreateRuleRequest extends S.Class<CreateRuleRequest>(
  "CreateRuleRequest",
)(
  {
    RetentionPeriod: RetentionPeriod,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    ResourceType: S.String,
    ResourceTags: S.optional(ResourceTags),
    LockConfiguration: S.optional(LockConfiguration),
    ExcludeResourceTags: S.optional(ExcludeResourceTags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRulesResponse extends S.Class<ListRulesResponse>(
  "ListRulesResponse",
)({ Rules: S.optional(RuleSummaryList), NextToken: S.optional(S.String) }) {}
export class CreateRuleResponse extends S.Class<CreateRuleResponse>(
  "CreateRuleResponse",
)({
  Identifier: S.optional(S.String),
  RetentionPeriod: S.optional(RetentionPeriod),
  Description: S.optional(S.String),
  Tags: S.optional(TagList),
  ResourceType: S.optional(S.String),
  ResourceTags: S.optional(ResourceTags),
  Status: S.optional(S.String),
  LockConfiguration: S.optional(LockConfiguration),
  LockState: S.optional(S.String),
  RuleArn: S.optional(S.String),
  ExcludeResourceTags: S.optional(ExcludeResourceTags),
}) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}

//# Operations
/**
 * Gets information about a Recycle Bin retention rule.
 */
export const getRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRuleRequest,
  output: GetRuleResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the tags assigned to a retention rule.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Locks a Region-level retention rule. A locked retention rule can't be modified or
 * deleted.
 *
 * You can't lock tag-level retention rules, or Region-level retention rules that
 * have exclusion tags.
 */
export const lockRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: LockRuleRequest,
  output: LockRuleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Unlocks a retention rule. After a retention rule is unlocked, it can be modified or deleted
 * only after the unlock delay period expires.
 */
export const unlockRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnlockRuleRequest,
  output: UnlockRuleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Unassigns a tag from a retention rule.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates an existing Recycle Bin retention rule. You can update a retention rule's description,
 * resource tags, and retention period at any time after creation. You can't update a retention rule's
 * resource type after creation. For more information, see
 * Update Recycle Bin retention rules in the *Amazon Elastic Compute Cloud User Guide*.
 */
export const updateRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleRequest,
  output: UpdateRuleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Deletes a Recycle Bin retention rule. For more information, see
 * Delete Recycle Bin retention rules in the *Amazon Elastic Compute Cloud User Guide*.
 */
export const deleteRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the Recycle Bin retention rules in the Region.
 */
export const listRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRulesRequest,
  output: ListRulesResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Assigns tags to the specified retention rule.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a Recycle Bin retention rule. You can create two types of retention rules:
 *
 * - **Tag-level retention rules** - These retention rules use
 * resource tags to identify the resources to protect. For each retention rule, you specify one or
 * more tag key and value pairs. Resources (of the specified type) that have at least one of these
 * tag key and value pairs are automatically retained in the Recycle Bin upon deletion. Use this
 * type of retention rule to protect specific resources in your account based on their tags.
 *
 * - **Region-level retention rules** - These retention rules,
 * by default, apply to all of the resources (of the specified type) in the Region, even if the
 * resources are not tagged. However, you can specify exclusion tags to exclude resources that have
 * specific tags. Use this type of retention rule to protect all resources of a specific type in a
 * Region.
 *
 * For more information, see
 * Create Recycle Bin retention rules in the *Amazon EBS User Guide*.
 */
export const createRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleRequest,
  output: CreateRuleResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));

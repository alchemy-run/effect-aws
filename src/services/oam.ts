import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export const ResourceTypesInput = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export const TagMapInput = S.Record({ key: S.String, value: S.String });
export class CreateSinkInput extends S.Class<CreateSinkInput>(
  "CreateSinkInput",
)(
  { Name: S.String, Tags: S.optional(TagMapInput) },
  T.all(
    T.Http({ method: "POST", uri: "/CreateSink" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLinkInput extends S.Class<DeleteLinkInput>(
  "DeleteLinkInput",
)(
  { Identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteLink" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLinkOutput extends S.Class<DeleteLinkOutput>(
  "DeleteLinkOutput",
)({}) {}
export class DeleteSinkInput extends S.Class<DeleteSinkInput>(
  "DeleteSinkInput",
)(
  { Identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteSink" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSinkOutput extends S.Class<DeleteSinkOutput>(
  "DeleteSinkOutput",
)({}) {}
export class GetLinkInput extends S.Class<GetLinkInput>("GetLinkInput")(
  { Identifier: S.String, IncludeTags: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "POST", uri: "/GetLink" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSinkInput extends S.Class<GetSinkInput>("GetSinkInput")(
  { Identifier: S.String, IncludeTags: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "POST", uri: "/GetSink" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSinkPolicyInput extends S.Class<GetSinkPolicyInput>(
  "GetSinkPolicyInput",
)(
  { SinkIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetSinkPolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAttachedLinksInput extends S.Class<ListAttachedLinksInput>(
  "ListAttachedLinksInput",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    SinkIdentifier: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListAttachedLinks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLinksInput extends S.Class<ListLinksInput>("ListLinksInput")(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListLinks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSinksInput extends S.Class<ListSinksInput>("ListSinksInput")(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListSinks" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutSinkPolicyInput extends S.Class<PutSinkPolicyInput>(
  "PutSinkPolicyInput",
)(
  { SinkIdentifier: S.String, Policy: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/PutSinkPolicy" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagMapInput },
  T.all(
    T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class LogGroupConfiguration extends S.Class<LogGroupConfiguration>(
  "LogGroupConfiguration",
)({ Filter: S.String }) {}
export class MetricConfiguration extends S.Class<MetricConfiguration>(
  "MetricConfiguration",
)({ Filter: S.String }) {}
export class LinkConfiguration extends S.Class<LinkConfiguration>(
  "LinkConfiguration",
)({
  LogGroupConfiguration: S.optional(LogGroupConfiguration),
  MetricConfiguration: S.optional(MetricConfiguration),
}) {}
export class UpdateLinkInput extends S.Class<UpdateLinkInput>(
  "UpdateLinkInput",
)(
  {
    Identifier: S.String,
    ResourceTypes: ResourceTypesInput,
    LinkConfiguration: S.optional(LinkConfiguration),
    IncludeTags: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateLink" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ResourceTypesOutput = S.Array(S.String);
export const TagMapOutput = S.Record({ key: S.String, value: S.String });
export class GetLinkOutput extends S.Class<GetLinkOutput>("GetLinkOutput")({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Label: S.optional(S.String),
  LabelTemplate: S.optional(S.String),
  ResourceTypes: S.optional(ResourceTypesOutput),
  SinkArn: S.optional(S.String),
  Tags: S.optional(TagMapOutput),
  LinkConfiguration: S.optional(LinkConfiguration),
}) {}
export class GetSinkOutput extends S.Class<GetSinkOutput>("GetSinkOutput")({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Tags: S.optional(TagMapOutput),
}) {}
export class GetSinkPolicyOutput extends S.Class<GetSinkPolicyOutput>(
  "GetSinkPolicyOutput",
)({
  SinkArn: S.optional(S.String),
  SinkId: S.optional(S.String),
  Policy: S.optional(S.String),
}) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: S.optional(TagMapOutput) }) {}
export class PutSinkPolicyOutput extends S.Class<PutSinkPolicyOutput>(
  "PutSinkPolicyOutput",
)({
  SinkArn: S.optional(S.String),
  SinkId: S.optional(S.String),
  Policy: S.optional(S.String),
}) {}
export class UpdateLinkOutput extends S.Class<UpdateLinkOutput>(
  "UpdateLinkOutput",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Label: S.optional(S.String),
  LabelTemplate: S.optional(S.String),
  ResourceTypes: S.optional(ResourceTypesOutput),
  SinkArn: S.optional(S.String),
  Tags: S.optional(TagMapOutput),
  LinkConfiguration: S.optional(LinkConfiguration),
}) {}
export class ListAttachedLinksItem extends S.Class<ListAttachedLinksItem>(
  "ListAttachedLinksItem",
)({
  Label: S.optional(S.String),
  LinkArn: S.optional(S.String),
  ResourceTypes: S.optional(ResourceTypesOutput),
}) {}
export const ListAttachedLinksItems = S.Array(ListAttachedLinksItem);
export class ListLinksItem extends S.Class<ListLinksItem>("ListLinksItem")({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Label: S.optional(S.String),
  ResourceTypes: S.optional(ResourceTypesOutput),
  SinkArn: S.optional(S.String),
}) {}
export const ListLinksItems = S.Array(ListLinksItem);
export class ListSinksItem extends S.Class<ListSinksItem>("ListSinksItem")({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const ListSinksItems = S.Array(ListSinksItem);
export class CreateLinkInput extends S.Class<CreateLinkInput>(
  "CreateLinkInput",
)(
  {
    LabelTemplate: S.String,
    ResourceTypes: ResourceTypesInput,
    SinkIdentifier: S.String,
    Tags: S.optional(TagMapInput),
    LinkConfiguration: S.optional(LinkConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateLink" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSinkOutput extends S.Class<CreateSinkOutput>(
  "CreateSinkOutput",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Tags: S.optional(TagMapOutput),
}) {}
export class ListAttachedLinksOutput extends S.Class<ListAttachedLinksOutput>(
  "ListAttachedLinksOutput",
)({ Items: ListAttachedLinksItems, NextToken: S.optional(S.String) }) {}
export class ListLinksOutput extends S.Class<ListLinksOutput>(
  "ListLinksOutput",
)({ Items: ListLinksItems, NextToken: S.optional(S.String) }) {}
export class ListSinksOutput extends S.Class<ListSinksOutput>(
  "ListSinksOutput",
)({ Items: ListSinksItems, NextToken: S.optional(S.String) }) {}
export class CreateLinkOutput extends S.Class<CreateLinkOutput>(
  "CreateLinkOutput",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Label: S.optional(S.String),
  LabelTemplate: S.optional(S.String),
  ResourceTypes: S.optional(ResourceTypesOutput),
  SinkArn: S.optional(S.String),
  Tags: S.optional(TagMapOutput),
  LinkConfiguration: S.optional(LinkConfiguration),
}) {}

//# Errors
export class InternalServiceFault extends S.TaggedError<InternalServiceFault>()(
  "InternalServiceFault",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {
    message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class MissingRequiredParameterException extends S.TaggedError<MissingRequiredParameterException>()(
  "MissingRequiredParameterException",
  {
    message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Use this operation in a source account to return a list of links to monitoring account sinks that this source account has.
 *
 * To find a list of links for one monitoring account sink, use ListAttachedLinks from within the monitoring account.
 */
export const listLinks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSinks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Displays the tags associated with a resource. Both sinks and links support tagging.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAttachedLinks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Deletes a sink. You must delete all links to a sink before you can delete that sink.
 */
export const deleteSink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSinkPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putSinkPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

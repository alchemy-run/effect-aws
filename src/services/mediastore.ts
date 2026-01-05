import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("https://mediastore.amazonaws.com/doc/2017-09-01");
const svc = T.AwsApiService({
  sdkId: "MediaStore",
  serviceShapeName: "MediaStore_20170901",
});
const auth = T.AwsAuthSigv4({ name: "mediastore" });
const ver = T.ServiceVersion("2017-09-01");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://mediastore-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://mediastore-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://mediastore.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://mediastore.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class DeleteContainerInput extends S.Class<DeleteContainerInput>(
  "DeleteContainerInput",
)(
  { ContainerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteContainerOutput extends S.Class<DeleteContainerOutput>(
  "DeleteContainerOutput",
)({}, ns) {}
export class DeleteContainerPolicyInput extends S.Class<DeleteContainerPolicyInput>(
  "DeleteContainerPolicyInput",
)(
  { ContainerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteContainerPolicyOutput extends S.Class<DeleteContainerPolicyOutput>(
  "DeleteContainerPolicyOutput",
)({}, ns) {}
export class DeleteCorsPolicyInput extends S.Class<DeleteCorsPolicyInput>(
  "DeleteCorsPolicyInput",
)(
  { ContainerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCorsPolicyOutput extends S.Class<DeleteCorsPolicyOutput>(
  "DeleteCorsPolicyOutput",
)({}, ns) {}
export class DeleteLifecyclePolicyInput extends S.Class<DeleteLifecyclePolicyInput>(
  "DeleteLifecyclePolicyInput",
)(
  { ContainerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLifecyclePolicyOutput extends S.Class<DeleteLifecyclePolicyOutput>(
  "DeleteLifecyclePolicyOutput",
)({}, ns) {}
export class DeleteMetricPolicyInput extends S.Class<DeleteMetricPolicyInput>(
  "DeleteMetricPolicyInput",
)(
  { ContainerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMetricPolicyOutput extends S.Class<DeleteMetricPolicyOutput>(
  "DeleteMetricPolicyOutput",
)({}, ns) {}
export class DescribeContainerInput extends S.Class<DescribeContainerInput>(
  "DescribeContainerInput",
)(
  { ContainerName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetContainerPolicyInput extends S.Class<GetContainerPolicyInput>(
  "GetContainerPolicyInput",
)(
  { ContainerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCorsPolicyInput extends S.Class<GetCorsPolicyInput>(
  "GetCorsPolicyInput",
)(
  { ContainerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLifecyclePolicyInput extends S.Class<GetLifecyclePolicyInput>(
  "GetLifecyclePolicyInput",
)(
  { ContainerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMetricPolicyInput extends S.Class<GetMetricPolicyInput>(
  "GetMetricPolicyInput",
)(
  { ContainerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListContainersInput extends S.Class<ListContainersInput>(
  "ListContainersInput",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { Resource: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutContainerPolicyInput extends S.Class<PutContainerPolicyInput>(
  "PutContainerPolicyInput",
)(
  { ContainerName: S.String, Policy: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutContainerPolicyOutput extends S.Class<PutContainerPolicyOutput>(
  "PutContainerPolicyOutput",
)({}, ns) {}
export class PutLifecyclePolicyInput extends S.Class<PutLifecyclePolicyInput>(
  "PutLifecyclePolicyInput",
)(
  { ContainerName: S.String, LifecyclePolicy: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutLifecyclePolicyOutput extends S.Class<PutLifecyclePolicyOutput>(
  "PutLifecyclePolicyOutput",
)({}, ns) {}
export class StartAccessLoggingInput extends S.Class<StartAccessLoggingInput>(
  "StartAccessLoggingInput",
)(
  { ContainerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartAccessLoggingOutput extends S.Class<StartAccessLoggingOutput>(
  "StartAccessLoggingOutput",
)({}, ns) {}
export class StopAccessLoggingInput extends S.Class<StopAccessLoggingInput>(
  "StopAccessLoggingInput",
)(
  { ContainerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopAccessLoggingOutput extends S.Class<StopAccessLoggingOutput>(
  "StopAccessLoggingOutput",
)({}, ns) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { Resource: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}, ns) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { Resource: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}, ns) {}
export const AllowedOrigins = S.Array(S.String);
export const AllowedMethods = S.Array(S.String);
export const AllowedHeaders = S.Array(S.String);
export const ExposeHeaders = S.Array(S.String);
export class Container extends S.Class<Container>("Container")({
  Endpoint: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ARN: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  AccessLoggingEnabled: S.optional(S.Boolean),
}) {}
export const ContainerList = S.Array(Container);
export class CorsRule extends S.Class<CorsRule>("CorsRule")({
  AllowedOrigins: AllowedOrigins,
  AllowedMethods: S.optional(AllowedMethods),
  AllowedHeaders: AllowedHeaders,
  MaxAgeSeconds: S.optional(S.Number),
  ExposeHeaders: S.optional(ExposeHeaders),
}) {}
export const CorsPolicy = S.Array(CorsRule);
export class CreateContainerInput extends S.Class<CreateContainerInput>(
  "CreateContainerInput",
)(
  { ContainerName: S.String, Tags: S.optional(TagList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetContainerPolicyOutput extends S.Class<GetContainerPolicyOutput>(
  "GetContainerPolicyOutput",
)({ Policy: S.String }, ns) {}
export class GetCorsPolicyOutput extends S.Class<GetCorsPolicyOutput>(
  "GetCorsPolicyOutput",
)({ CorsPolicy: CorsPolicy }, ns) {}
export class GetLifecyclePolicyOutput extends S.Class<GetLifecyclePolicyOutput>(
  "GetLifecyclePolicyOutput",
)({ LifecyclePolicy: S.String }, ns) {}
export class MetricPolicyRule extends S.Class<MetricPolicyRule>(
  "MetricPolicyRule",
)({ ObjectGroup: S.String, ObjectGroupName: S.String }) {}
export const MetricPolicyRules = S.Array(MetricPolicyRule);
export class MetricPolicy extends S.Class<MetricPolicy>("MetricPolicy")({
  ContainerLevelMetrics: S.String,
  MetricPolicyRules: S.optional(MetricPolicyRules),
}) {}
export class GetMetricPolicyOutput extends S.Class<GetMetricPolicyOutput>(
  "GetMetricPolicyOutput",
)({ MetricPolicy: MetricPolicy }, ns) {}
export class ListContainersOutput extends S.Class<ListContainersOutput>(
  "ListContainersOutput",
)({ Containers: ContainerList, NextToken: S.optional(S.String) }, ns) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: S.optional(TagList) }, ns) {}
export class PutCorsPolicyInput extends S.Class<PutCorsPolicyInput>(
  "PutCorsPolicyInput",
)(
  { ContainerName: S.String, CorsPolicy: CorsPolicy },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutCorsPolicyOutput extends S.Class<PutCorsPolicyOutput>(
  "PutCorsPolicyOutput",
)({}, ns) {}
export class CreateContainerOutput extends S.Class<CreateContainerOutput>(
  "CreateContainerOutput",
)({ Container: Container }, ns) {}
export class DescribeContainerOutput extends S.Class<DescribeContainerOutput>(
  "DescribeContainerOutput",
)({ Container: S.optional(Container) }, ns) {}
export class PutMetricPolicyInput extends S.Class<PutMetricPolicyInput>(
  "PutMetricPolicyInput",
)(
  { ContainerName: S.String, MetricPolicy: MetricPolicy },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutMetricPolicyOutput extends S.Class<PutMetricPolicyOutput>(
  "PutMetricPolicyOutput",
)({}, ns) {}

//# Errors
export class ContainerInUseException extends S.TaggedError<ContainerInUseException>()(
  "ContainerInUseException",
  { Message: S.optional(S.String) },
) {}
export class ContainerNotFoundException extends S.TaggedError<ContainerNotFoundException>()(
  "ContainerNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { Message: S.optional(S.String) },
) {}
export class PolicyNotFoundException extends S.TaggedError<PolicyNotFoundException>()(
  "PolicyNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class CorsPolicyNotFoundException extends S.TaggedError<CorsPolicyNotFoundException>()(
  "CorsPolicyNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the properties of all containers in AWS Elemental MediaStore.
 *
 * You can query to receive all the containers in one response. Or you can include the
 * `MaxResults` parameter to receive a limited number of containers in each
 * response. In this case, the response includes a token. To get the next set of containers,
 * send the command again, this time with the `NextToken` parameter (with the
 * returned token as its value). The next set of responses appears, with a token if there are
 * still more containers to receive.
 *
 * See also DescribeContainer, which gets the properties of one
 * container.
 */
export const listContainers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListContainersInput,
    output: ListContainersOutput,
    errors: [InternalServerError],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * The metric policy that you want to add to the container. A metric policy allows AWS Elemental MediaStore to send metrics to Amazon CloudWatch. It takes up to 20 minutes for the new policy to take effect.
 */
export const putMetricPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMetricPolicyInput,
  output: PutMetricPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Returns a list of the tags assigned to the specified container.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Sets the cross-origin resource sharing (CORS) configuration on a container so that
 * the container can service cross-origin requests. For example, you might want to enable a
 * request whose origin is http://www.example.com to access your AWS Elemental MediaStore
 * container at my.example.container.com by using the browser's XMLHttpRequest
 * capability.
 *
 * To enable CORS on a container, you attach a CORS policy to the container. In the CORS
 * policy, you configure rules that identify origins and the HTTP methods that can be executed
 * on your container. The policy can contain up to 398,000 characters. You can add up to 100
 * rules to a CORS policy. If more than one rule applies, the service uses the first
 * applicable rule listed.
 *
 * To learn more about CORS, see Cross-Origin Resource Sharing (CORS) in AWS Elemental MediaStore.
 */
export const putCorsPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutCorsPolicyInput,
  output: PutCorsPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Creates an access policy for the specified container to restrict the users and
 * clients that can access it. For information about the data that is included in an access
 * policy, see the AWS Identity and
 * Access Management User Guide.
 *
 * For this release of the REST API, you can create only one policy for a container. If
 * you enter `PutContainerPolicy` twice, the second command modifies the existing
 * policy.
 */
export const putContainerPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutContainerPolicyInput,
  output: PutContainerPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Writes an object lifecycle policy to a container. If the container already has an object lifecycle policy, the service replaces the existing policy with the new policy. It takes up to 20 minutes for the change to take effect.
 *
 * For information about how to construct an object lifecycle policy, see Components of an Object Lifecycle Policy.
 */
export const putLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLifecyclePolicyInput,
  output: PutLifecyclePolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Starts access logging on the specified container. When you enable access logging on a container, MediaStore delivers access logs for objects stored in that container to Amazon CloudWatch Logs.
 */
export const startAccessLogging = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAccessLoggingInput,
  output: StartAccessLoggingOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Stops access logging on the specified container. When you stop access logging on a container, MediaStore stops sending access logs to Amazon CloudWatch Logs. These access logs are not saved and are not retrievable.
 */
export const stopAccessLogging = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopAccessLoggingInput,
  output: StopAccessLoggingOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Adds tags to the specified AWS Elemental MediaStore container. Tags are key:value pairs that you can associate with AWS resources. For example, the
 * tag key might be "customer" and the tag value might be "companyA." You can specify one or more tags to add to each container. You can add up to 50
 * tags to each container. For more information about tagging, including naming and usage conventions, see Tagging Resources in MediaStore.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Removes tags from the specified container. You can specify one or more tags to remove.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Deletes the specified container. Before you make a `DeleteContainer`
 * request, delete any objects in the container or in any folders in the container. You can
 * delete only empty containers.
 */
export const deleteContainer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContainerInput,
  output: DeleteContainerOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Retrieves the properties of the requested container. This request is commonly used to
 * retrieve the endpoint of a container. An endpoint is a value assigned by the service when a
 * new container is created. A container's endpoint does not change after it has been
 * assigned. The `DescribeContainer` request returns a single
 * `Container` object based on `ContainerName`. To return all
 * `Container` objects that are associated with a specified AWS account, use
 * ListContainers.
 */
export const describeContainer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeContainerInput,
  output: DescribeContainerOutput,
  errors: [ContainerNotFoundException, InternalServerError],
}));
/**
 * Retrieves the access policy for the specified container. For information about the
 * data that is included in an access policy, see the AWS Identity and Access Management User
 * Guide.
 */
export const getContainerPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerPolicyInput,
  output: GetContainerPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
    PolicyNotFoundException,
  ],
}));
/**
 * Returns the cross-origin resource sharing (CORS) configuration information that is
 * set for the container.
 *
 * To use this operation, you must have permission to perform the
 * `MediaStore:GetCorsPolicy` action. By default, the container owner has this
 * permission and can grant it to others.
 */
export const getCorsPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCorsPolicyInput,
  output: GetCorsPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    CorsPolicyNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Creates a storage container to hold objects. A container is similar to a bucket in
 * the Amazon S3 service.
 */
export const createContainer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContainerInput,
  output: CreateContainerOutput,
  errors: [
    ContainerInUseException,
    InternalServerError,
    LimitExceededException,
  ],
}));
/**
 * Retrieves the object lifecycle policy that is assigned to a container.
 */
export const getLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLifecyclePolicyInput,
  output: GetLifecyclePolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
    PolicyNotFoundException,
  ],
}));
/**
 * Returns the metric policy for the specified container.
 */
export const getMetricPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetricPolicyInput,
  output: GetMetricPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
    PolicyNotFoundException,
  ],
}));
/**
 * Deletes the access policy that is associated with the specified container.
 */
export const deleteContainerPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteContainerPolicyInput,
    output: DeleteContainerPolicyOutput,
    errors: [
      ContainerInUseException,
      ContainerNotFoundException,
      InternalServerError,
      PolicyNotFoundException,
    ],
  }),
);
/**
 * Removes an object lifecycle policy from a container. It takes up to 20 minutes for the change to take effect.
 */
export const deleteLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLifecyclePolicyInput,
    output: DeleteLifecyclePolicyOutput,
    errors: [
      ContainerInUseException,
      ContainerNotFoundException,
      InternalServerError,
      PolicyNotFoundException,
    ],
  }),
);
/**
 * Deletes the metric policy that is associated with the specified container. If there is no metric policy associated with the container, MediaStore doesn't send metrics to CloudWatch.
 */
export const deleteMetricPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMetricPolicyInput,
  output: DeleteMetricPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
    PolicyNotFoundException,
  ],
}));
/**
 * Deletes the cross-origin resource sharing (CORS) configuration information that is
 * set for the container.
 *
 * To use this operation, you must have permission to perform the
 * `MediaStore:DeleteCorsPolicy` action. The container owner has this permission
 * by default and can grant this permission to others.
 */
export const deleteCorsPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCorsPolicyInput,
  output: DeleteCorsPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    CorsPolicyNotFoundException,
    InternalServerError,
  ],
}));

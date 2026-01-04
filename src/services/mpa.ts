import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "MPA",
  serviceShapeName: "AWSFluffyCoreService",
});
const auth = T.AwsAuthSigv4({ name: "mpa" });
const ver = T.ServiceVersion("2022-07-26");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
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
                  ],
                  endpoint: {
                    url: "https://mpa-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://mpa.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeyList = S.Array(S.String);
export class GetPolicyVersionRequest extends S.Class<GetPolicyVersionRequest>(
  "GetPolicyVersionRequest",
)(
  { PolicyVersionArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/policy-versions/{PolicyVersionArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { ResourceArn: S.String, PolicyName: S.String, PolicyType: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetResourcePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPoliciesRequest extends S.Class<ListPoliciesRequest>(
  "ListPoliciesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policies/?List" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPolicyVersionsRequest extends S.Class<ListPolicyVersionsRequest>(
  "ListPolicyVersionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PolicyArn: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policies/{PolicyArn}/?List" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourcePoliciesRequest extends S.Class<ListResourcePoliciesRequest>(
  "ListResourcePoliciesRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/resource-policies/{ResourceArn}/?List" }),
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), TagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export const Tags = S.Record({ key: S.String, value: S.String });
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({
  ResourceArn: S.String,
  PolicyType: S.String,
  PolicyVersionArn: S.optional(S.String),
  PolicyName: S.String,
  PolicyDocument: S.String,
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: Tags },
  T.all(
    T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
export class PolicyVersion extends S.Class<PolicyVersion>("PolicyVersion")({
  Arn: S.String,
  PolicyArn: S.String,
  VersionId: S.Number,
  PolicyType: S.String,
  IsDefault: S.Boolean,
  Name: S.String,
  Status: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  LastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  Document: S.String,
}) {}
export class Policy extends S.Class<Policy>("Policy")({
  Arn: S.String,
  DefaultVersion: S.Number,
  PolicyType: S.String,
  Name: S.String,
}) {}
export const Policies = S.Array(Policy);
export class PolicyVersionSummary extends S.Class<PolicyVersionSummary>(
  "PolicyVersionSummary",
)({
  Arn: S.String,
  PolicyArn: S.String,
  VersionId: S.Number,
  PolicyType: S.String,
  IsDefault: S.Boolean,
  Name: S.String,
  Status: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  LastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const PolicyVersions = S.Array(PolicyVersionSummary);
export class ListResourcePoliciesResponseResourcePolicy extends S.Class<ListResourcePoliciesResponseResourcePolicy>(
  "ListResourcePoliciesResponseResourcePolicy",
)({
  PolicyArn: S.optional(S.String),
  PolicyType: S.optional(S.String),
  PolicyName: S.optional(S.String),
}) {}
export const ListResourcePoliciesResponseResourcePolicies = S.Array(
  ListResourcePoliciesResponseResourcePolicy,
);
export class GetPolicyVersionResponse extends S.Class<GetPolicyVersionResponse>(
  "GetPolicyVersionResponse",
)({ PolicyVersion: PolicyVersion }) {}
export class ListPoliciesResponse extends S.Class<ListPoliciesResponse>(
  "ListPoliciesResponse",
)({ NextToken: S.optional(S.String), Policies: S.optional(Policies) }) {}
export class ListPolicyVersionsResponse extends S.Class<ListPolicyVersionsResponse>(
  "ListPolicyVersionsResponse",
)({
  NextToken: S.optional(S.String),
  PolicyVersions: S.optional(PolicyVersions),
}) {}
export class ListResourcePoliciesResponse extends S.Class<ListResourcePoliciesResponse>(
  "ListResourcePoliciesResponse",
)({
  NextToken: S.optional(S.String),
  ResourcePolicies: S.optional(ListResourcePoliciesResponseResourcePolicies),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.String, ResourceName: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns details about a policy for a resource.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of policies. Policies define the permissions for team resources.
 *
 * The protected operation for a service integration might require specific permissions. For more information, see How other services work with Multi-party approval in the *Multi-party approval User Guide*.
 */
export const listPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPoliciesRequest,
  output: ListPoliciesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the versions for policies. Policies define the permissions for team resources.
 *
 * The protected operation for a service integration might require specific permissions. For more information, see How other services work with Multi-party approval in the *Multi-party approval User Guide*.
 */
export const listPolicyVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPolicyVersionsRequest,
  output: ListPolicyVersionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of policies for a resource.
 */
export const listResourcePolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourcePoliciesRequest,
    output: ListResourcePoliciesResponse,
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
 * Returns a list of the tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a resource tag. Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns details for the version of a policy. Policies define the permissions for team resources.
 *
 * The protected operation for a service integration might require specific permissions. For more information, see How other services work with Multi-party approval in the *Multi-party approval User Guide*.
 */
export const getPolicyVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyVersionRequest,
  output: GetPolicyVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a resource tag. Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));

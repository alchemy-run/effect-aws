import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Redshift Serverless",
  serviceShapeName: "RedshiftServerless",
});
const auth = T.AwsAuthSigv4({ name: "redshift-serverless" });
const ver = T.ServiceVersion("2021-04-21");
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
                        url: "https://redshift-serverless-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://redshift-serverless-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://redshift-serverless.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://redshift-serverless.{Region}.{PartitionResult#dnsSuffix}",
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
export const WorkgroupNameList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CreateCustomDomainAssociationRequest extends S.Class<CreateCustomDomainAssociationRequest>(
  "CreateCustomDomainAssociationRequest",
)(
  {
    workgroupName: S.String,
    customDomainName: S.String,
    customDomainCertificateArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCustomDomainAssociationRequest extends S.Class<DeleteCustomDomainAssociationRequest>(
  "DeleteCustomDomainAssociationRequest",
)(
  { workgroupName: S.String, customDomainName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCustomDomainAssociationResponse extends S.Class<DeleteCustomDomainAssociationResponse>(
  "DeleteCustomDomainAssociationResponse",
)({}) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}) {}
export class GetCredentialsRequest extends S.Class<GetCredentialsRequest>(
  "GetCredentialsRequest",
)(
  {
    dbName: S.optional(S.String),
    durationSeconds: S.optional(S.Number),
    workgroupName: S.optional(S.String),
    customDomainName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCustomDomainAssociationRequest extends S.Class<GetCustomDomainAssociationRequest>(
  "GetCustomDomainAssociationRequest",
)(
  { customDomainName: S.String, workgroupName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdentityCenterAuthTokenRequest extends S.Class<GetIdentityCenterAuthTokenRequest>(
  "GetIdentityCenterAuthTokenRequest",
)(
  { workgroupNames: WorkgroupNameList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTrackRequest extends S.Class<GetTrackRequest>(
  "GetTrackRequest",
)(
  { trackName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCustomDomainAssociationsRequest extends S.Class<ListCustomDomainAssociationsRequest>(
  "ListCustomDomainAssociationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    customDomainName: S.optional(S.String),
    customDomainCertificateArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTracksRequest extends S.Class<ListTracksRequest>(
  "ListTracksRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  { resourceArn: S.String, policy: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateCustomDomainAssociationRequest extends S.Class<UpdateCustomDomainAssociationRequest>(
  "UpdateCustomDomainAssociationRequest",
)(
  {
    workgroupName: S.String,
    customDomainName: S.String,
    customDomainCertificateArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTarget extends S.Class<UpdateTarget>("UpdateTarget")({
  trackName: S.optional(S.String),
  workgroupVersion: S.optional(S.String),
}) {}
export const UpdateTargetsList = S.Array(UpdateTarget);
export class ServerlessTrack extends S.Class<ServerlessTrack>(
  "ServerlessTrack",
)({
  trackName: S.optional(S.String),
  workgroupVersion: S.optional(S.String),
  updateTargets: S.optional(UpdateTargetsList),
}) {}
export const TrackList = S.Array(ServerlessTrack);
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateCustomDomainAssociationResponse extends S.Class<CreateCustomDomainAssociationResponse>(
  "CreateCustomDomainAssociationResponse",
)({
  customDomainName: S.optional(S.String),
  workgroupName: S.optional(S.String),
  customDomainCertificateArn: S.optional(S.String),
  customDomainCertificateExpiryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class GetCredentialsResponse extends S.Class<GetCredentialsResponse>(
  "GetCredentialsResponse",
)({
  dbUser: S.optional(S.String),
  dbPassword: S.optional(S.String),
  expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  nextRefreshTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetCustomDomainAssociationResponse extends S.Class<GetCustomDomainAssociationResponse>(
  "GetCustomDomainAssociationResponse",
)({
  customDomainName: S.optional(S.String),
  workgroupName: S.optional(S.String),
  customDomainCertificateArn: S.optional(S.String),
  customDomainCertificateExpiryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class GetIdentityCenterAuthTokenResponse extends S.Class<GetIdentityCenterAuthTokenResponse>(
  "GetIdentityCenterAuthTokenResponse",
)({
  token: S.optional(S.String).pipe(T.JsonName("Token")),
  expirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("ExpirationTime"),
  ),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class ListTracksResponse extends S.Class<ListTracksResponse>(
  "ListTracksResponse",
)({ tracks: S.optional(TrackList), nextToken: S.optional(S.String) }) {}
export class ResourcePolicy extends S.Class<ResourcePolicy>("ResourcePolicy")({
  resourceArn: S.optional(S.String),
  policy: S.optional(S.String),
}) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({ resourcePolicy: S.optional(ResourcePolicy) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UpdateCustomDomainAssociationResponse extends S.Class<UpdateCustomDomainAssociationResponse>(
  "UpdateCustomDomainAssociationResponse",
)({
  customDomainName: S.optional(S.String),
  workgroupName: S.optional(S.String),
  customDomainCertificateArn: S.optional(S.String),
  customDomainCertificateExpiryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class Association extends S.Class<Association>("Association")({
  customDomainCertificateArn: S.optional(S.String),
  customDomainCertificateExpiryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  customDomainName: S.optional(S.String),
  workgroupName: S.optional(S.String),
}) {}
export const AssociationList = S.Array(Association);
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({ resourcePolicy: S.optional(ResourcePolicy) }) {}
export class ListCustomDomainAssociationsResponse extends S.Class<ListCustomDomainAssociationsResponse>(
  "ListCustomDomainAssociationsResponse",
)({
  nextToken: S.optional(S.String),
  associations: S.optional(AssociationList),
}) {}
export class GetTrackResponse extends S.Class<GetTrackResponse>(
  "GetTrackResponse",
)({ track: S.optional(ServerlessTrack) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class DryRunException extends S.TaggedError<DryRunException>()(
  "DryRunException",
  { message: S.String },
) {}
export class InvalidPaginationException extends S.TaggedError<InvalidPaginationException>()(
  "InvalidPaginationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns a database user name and temporary password with temporary authorization to log in to Amazon Redshift Serverless.
 *
 * By default, the temporary credentials expire in 900 seconds. You can optionally specify a duration between 900 seconds (15 minutes) and 3600 seconds (60 minutes).
 *
 * The Identity and Access Management (IAM) user or role that runs GetCredentials must have an IAM policy attached that allows access to all necessary actions and resources.
 *
 * If the `DbName` parameter is specified, the IAM policy must allow access to the resource dbname for the specified database name.
 */
export const getCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCredentialsRequest,
  output: GetCredentialsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specific custom domain association.
 */
export const getCustomDomainAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCustomDomainAssociationRequest,
    output: GetCustomDomainAssociationResponse,
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
 * Lists the tags assigned to a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag or set of tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an Amazon Redshift Serverless certificate associated with a custom domain.
 */
export const updateCustomDomainAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCustomDomainAssociationRequest,
    output: UpdateCustomDomainAssociationResponse,
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
 * Creates a custom domain association for Amazon Redshift Serverless.
 */
export const createCustomDomainAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCustomDomainAssociationRequest,
    output: CreateCustomDomainAssociationResponse,
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
 * Deletes a custom domain association for Amazon Redshift Serverless.
 */
export const deleteCustomDomainAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCustomDomainAssociationRequest,
    output: DeleteCustomDomainAssociationResponse,
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
 * Deletes the specified resource policy.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns an Identity Center authentication token for accessing Amazon Redshift Serverless workgroups.
 *
 * The token provides secure access to data within the specified workgroups using Identity Center identity propagation. The token expires after a specified duration and must be refreshed for continued access.
 *
 * The Identity and Access Management (IAM) user or role that runs GetIdentityCenterAuthToken must have appropriate permissions to access the specified workgroups and Identity Center integration must be configured for the workgroups.
 */
export const getIdentityCenterAuthToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIdentityCenterAuthTokenRequest,
    output: GetIdentityCenterAuthTokenResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      DryRunException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a resource policy.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists custom domain associations for Amazon Redshift Serverless.
 */
export const listCustomDomainAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCustomDomainAssociationsRequest,
    output: ListCustomDomainAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidPaginationException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * List the Amazon Redshift Serverless versions.
 */
export const listTracks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTracksRequest,
  output: ListTracksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidPaginationException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a resource policy. Currently, you can use policies to share snapshots across Amazon Web Services accounts.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Assigns one or more tags to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Get the Redshift Serverless version for a specified track.
 */
export const getTrack = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrackRequest,
  output: GetTrackResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DryRunException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

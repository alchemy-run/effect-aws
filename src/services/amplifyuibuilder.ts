import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "AmplifyUIBuilder",
  serviceShapeName: "AmplifyUIBuilder",
});
const auth = T.AwsAuthSigv4({ name: "amplifyuibuilder" });
const ver = T.ServiceVersion("2021-08-11");
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
                        url: "https://amplifyuibuilder-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://amplifyuibuilder-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://amplifyuibuilder.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://amplifyuibuilder.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetMetadataRequest extends S.Class<GetMetadataRequest>(
  "GetMetadataRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel()),
    environmentName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app/{appId}/environment/{environmentName}/metadata",
    }),
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
  { resourceArn: S.String.pipe(T.HttpLabel()) },
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
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export class ExchangeCodeForTokenRequestBody extends S.Class<ExchangeCodeForTokenRequestBody>(
  "ExchangeCodeForTokenRequestBody",
)({ code: S.String, redirectUri: S.String, clientId: S.optional(S.String) }) {}
export class PutMetadataFlagBody extends S.Class<PutMetadataFlagBody>(
  "PutMetadataFlagBody",
)({ newValue: S.String }) {}
export class RefreshTokenRequestBody extends S.Class<RefreshTokenRequestBody>(
  "RefreshTokenRequestBody",
)({ token: S.String, clientId: S.optional(S.String) }) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class ExchangeCodeForTokenRequest extends S.Class<ExchangeCodeForTokenRequest>(
  "ExchangeCodeForTokenRequest",
)(
  {
    provider: S.String.pipe(T.HttpLabel()),
    request: ExchangeCodeForTokenRequestBody.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tokens/{provider}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: Tags }) {}
export class PutMetadataFlagRequest extends S.Class<PutMetadataFlagRequest>(
  "PutMetadataFlagRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel()),
    environmentName: S.String.pipe(T.HttpLabel()),
    featureName: S.String.pipe(T.HttpLabel()),
    body: PutMetadataFlagBody.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/app/{appId}/environment/{environmentName}/metadata/features/{featureName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutMetadataFlagResponse extends S.Class<PutMetadataFlagResponse>(
  "PutMetadataFlagResponse",
)({}) {}
export class RefreshTokenRequest extends S.Class<RefreshTokenRequest>(
  "RefreshTokenRequest",
)(
  {
    provider: S.String.pipe(T.HttpLabel()),
    refreshTokenBody: RefreshTokenRequestBody.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tokens/{provider}/refresh" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: Tags },
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
export const FeaturesMap = S.Record({ key: S.String, value: S.String });
export class ExchangeCodeForTokenResponse extends S.Class<ExchangeCodeForTokenResponse>(
  "ExchangeCodeForTokenResponse",
)({ accessToken: S.String, expiresIn: S.Number, refreshToken: S.String }) {}
export class GetMetadataResponse extends S.Class<GetMetadataResponse>(
  "GetMetadataResponse",
)({ features: FeaturesMap }) {}
export class RefreshTokenResponse extends S.Class<RefreshTokenResponse>(
  "RefreshTokenResponse",
)({ accessToken: S.String, expiresIn: S.Number }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}

//# Operations
/**
 * This is for internal use.
 *
 * Amplify uses this action to exchange an access code for a token.
 */
export const exchangeCodeForToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExchangeCodeForTokenRequest,
    output: ExchangeCodeForTokenResponse,
    errors: [InvalidParameterException],
  }),
);
/**
 * Returns existing metadata for an Amplify app.
 */
export const getMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetadataRequest,
  output: GetMetadataResponse,
  errors: [InvalidParameterException, UnauthorizedException],
}));
/**
 * Returns a list of tags for a specified Amazon Resource Name (ARN).
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Stores the metadata information about a feature on a form.
 */
export const putMetadataFlag = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMetadataFlagRequest,
  output: PutMetadataFlagResponse,
  errors: [InvalidParameterException, UnauthorizedException],
}));
/**
 * This is for internal use.
 *
 * Amplify uses this action to refresh a previously issued access token that might have expired.
 */
export const refreshToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RefreshTokenRequest,
  output: RefreshTokenResponse,
  errors: [InvalidParameterException],
}));
/**
 * Tags the resource with a tag key and value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Untags a resource with a specified Amazon Resource Name (ARN).
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));

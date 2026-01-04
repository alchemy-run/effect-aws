import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace(
  "http://cognito-identity.amazonaws.com/doc/2014-06-30/",
);
const svc = T.AwsApiService({
  sdkId: "Cognito Identity",
  serviceShapeName: "AWSCognitoIdentityService",
});
const auth = T.AwsAuthSigv4({ name: "cognito-identity" });
const ver = T.ServiceVersion("2014-06-30");
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-east-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://cognito-identity-fips.us-east-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-east-2"],
                        },
                      ],
                      endpoint: {
                        url: "https://cognito-identity-fips.us-east-2.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://cognito-identity-fips.us-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-west-2"],
                        },
                      ],
                      endpoint: {
                        url: "https://cognito-identity-fips.us-west-2.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://cognito-identity-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://cognito-identity-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://cognito-identity.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://cognito-identity.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://cognito-identity.{Region}.{PartitionResult#dnsSuffix}",
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
export const OIDCProviderList = S.Array(S.String);
export const SAMLProviderList = S.Array(S.String);
export const IdentityIdList = S.Array(S.String);
export const LoginsList = S.Array(S.String);
export const IdentityPoolTagsListType = S.Array(S.String);
export class DeleteIdentitiesInput extends S.Class<DeleteIdentitiesInput>(
  "DeleteIdentitiesInput",
)(
  { IdentityIdsToDelete: IdentityIdList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIdentityPoolInput extends S.Class<DeleteIdentityPoolInput>(
  "DeleteIdentityPoolInput",
)(
  { IdentityPoolId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIdentityPoolResponse extends S.Class<DeleteIdentityPoolResponse>(
  "DeleteIdentityPoolResponse",
)({}, ns) {}
export class DescribeIdentityInput extends S.Class<DescribeIdentityInput>(
  "DescribeIdentityInput",
)(
  { IdentityId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeIdentityPoolInput extends S.Class<DescribeIdentityPoolInput>(
  "DescribeIdentityPoolInput",
)(
  { IdentityPoolId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const LoginsMap = S.Record({ key: S.String, value: S.String });
export class GetIdInput extends S.Class<GetIdInput>("GetIdInput")(
  {
    AccountId: S.optional(S.String),
    IdentityPoolId: S.String,
    Logins: S.optional(LoginsMap),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdentityPoolRolesInput extends S.Class<GetIdentityPoolRolesInput>(
  "GetIdentityPoolRolesInput",
)(
  { IdentityPoolId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOpenIdTokenInput extends S.Class<GetOpenIdTokenInput>(
  "GetOpenIdTokenInput",
)(
  { IdentityId: S.String, Logins: S.optional(LoginsMap) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPrincipalTagAttributeMapInput extends S.Class<GetPrincipalTagAttributeMapInput>(
  "GetPrincipalTagAttributeMapInput",
)(
  { IdentityPoolId: S.String, IdentityProviderName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListIdentitiesInput extends S.Class<ListIdentitiesInput>(
  "ListIdentitiesInput",
)(
  {
    IdentityPoolId: S.String,
    MaxResults: S.Number,
    NextToken: S.optional(S.String),
    HideDisabled: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListIdentityPoolsInput extends S.Class<ListIdentityPoolsInput>(
  "ListIdentityPoolsInput",
)(
  { MaxResults: S.Number, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class LookupDeveloperIdentityInput extends S.Class<LookupDeveloperIdentityInput>(
  "LookupDeveloperIdentityInput",
)(
  {
    IdentityPoolId: S.String,
    IdentityId: S.optional(S.String),
    DeveloperUserIdentifier: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class MergeDeveloperIdentitiesInput extends S.Class<MergeDeveloperIdentitiesInput>(
  "MergeDeveloperIdentitiesInput",
)(
  {
    SourceUserIdentifier: S.String,
    DestinationUserIdentifier: S.String,
    DeveloperProviderName: S.String,
    IdentityPoolId: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const PrincipalTags = S.Record({ key: S.String, value: S.String });
export class SetPrincipalTagAttributeMapInput extends S.Class<SetPrincipalTagAttributeMapInput>(
  "SetPrincipalTagAttributeMapInput",
)(
  {
    IdentityPoolId: S.String,
    IdentityProviderName: S.String,
    UseDefaults: S.optional(S.Boolean),
    PrincipalTags: S.optional(PrincipalTags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const IdentityPoolTagsType = S.Record({
  key: S.String,
  value: S.String,
});
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceArn: S.String, Tags: IdentityPoolTagsType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UnlinkDeveloperIdentityInput extends S.Class<UnlinkDeveloperIdentityInput>(
  "UnlinkDeveloperIdentityInput",
)(
  {
    IdentityId: S.String,
    IdentityPoolId: S.String,
    DeveloperProviderName: S.String,
    DeveloperUserIdentifier: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UnlinkDeveloperIdentityResponse extends S.Class<UnlinkDeveloperIdentityResponse>(
  "UnlinkDeveloperIdentityResponse",
)({}, ns) {}
export class UnlinkIdentityInput extends S.Class<UnlinkIdentityInput>(
  "UnlinkIdentityInput",
)(
  { IdentityId: S.String, Logins: LoginsMap, LoginsToRemove: LoginsList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UnlinkIdentityResponse extends S.Class<UnlinkIdentityResponse>(
  "UnlinkIdentityResponse",
)({}, ns) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { ResourceArn: S.String, TagKeys: IdentityPoolTagsListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export const IdentityProviders = S.Record({ key: S.String, value: S.String });
export class CognitoIdentityProvider extends S.Class<CognitoIdentityProvider>(
  "CognitoIdentityProvider",
)({
  ProviderName: S.optional(S.String),
  ClientId: S.optional(S.String),
  ServerSideTokenCheck: S.optional(S.Boolean),
}) {}
export const CognitoIdentityProviderList = S.Array(CognitoIdentityProvider);
export class IdentityPool extends S.Class<IdentityPool>("IdentityPool")(
  {
    IdentityPoolId: S.String,
    IdentityPoolName: S.String,
    AllowUnauthenticatedIdentities: S.Boolean,
    AllowClassicFlow: S.optional(S.Boolean),
    SupportedLoginProviders: S.optional(IdentityProviders),
    DeveloperProviderName: S.optional(S.String),
    OpenIdConnectProviderARNs: S.optional(OIDCProviderList),
    CognitoIdentityProviders: S.optional(CognitoIdentityProviderList),
    SamlProviderARNs: S.optional(SAMLProviderList),
    IdentityPoolTags: S.optional(IdentityPoolTagsType),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IdentityDescription extends S.Class<IdentityDescription>(
  "IdentityDescription",
)(
  {
    IdentityId: S.optional(S.String),
    Logins: S.optional(LoginsList),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export const IdentitiesList = S.Array(IdentityDescription);
export const DeveloperUserIdentifierList = S.Array(S.String);
export const RolesMap = S.Record({ key: S.String, value: S.String });
export class CreateIdentityPoolInput extends S.Class<CreateIdentityPoolInput>(
  "CreateIdentityPoolInput",
)(
  {
    IdentityPoolName: S.String,
    AllowUnauthenticatedIdentities: S.Boolean,
    AllowClassicFlow: S.optional(S.Boolean),
    SupportedLoginProviders: S.optional(IdentityProviders),
    DeveloperProviderName: S.optional(S.String),
    OpenIdConnectProviderARNs: S.optional(OIDCProviderList),
    CognitoIdentityProviders: S.optional(CognitoIdentityProviderList),
    SamlProviderARNs: S.optional(SAMLProviderList),
    IdentityPoolTags: S.optional(IdentityPoolTagsType),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCredentialsForIdentityInput extends S.Class<GetCredentialsForIdentityInput>(
  "GetCredentialsForIdentityInput",
)(
  {
    IdentityId: S.String,
    Logins: S.optional(LoginsMap),
    CustomRoleArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdResponse extends S.Class<GetIdResponse>("GetIdResponse")(
  { IdentityId: S.optional(S.String) },
  ns,
) {}
export class MappingRule extends S.Class<MappingRule>("MappingRule")({
  Claim: S.String,
  MatchType: S.String,
  Value: S.String,
  RoleARN: S.String,
}) {}
export const MappingRulesList = S.Array(MappingRule);
export class RulesConfigurationType extends S.Class<RulesConfigurationType>(
  "RulesConfigurationType",
)({ Rules: MappingRulesList }) {}
export class RoleMapping extends S.Class<RoleMapping>("RoleMapping")({
  Type: S.String,
  AmbiguousRoleResolution: S.optional(S.String),
  RulesConfiguration: S.optional(RulesConfigurationType),
}) {}
export const RoleMappingMap = S.Record({ key: S.String, value: RoleMapping });
export class GetIdentityPoolRolesResponse extends S.Class<GetIdentityPoolRolesResponse>(
  "GetIdentityPoolRolesResponse",
)(
  {
    IdentityPoolId: S.optional(S.String),
    Roles: S.optional(RolesMap),
    RoleMappings: S.optional(RoleMappingMap),
  },
  ns,
) {}
export class GetOpenIdTokenResponse extends S.Class<GetOpenIdTokenResponse>(
  "GetOpenIdTokenResponse",
)({ IdentityId: S.optional(S.String), Token: S.optional(S.String) }, ns) {}
export class GetOpenIdTokenForDeveloperIdentityInput extends S.Class<GetOpenIdTokenForDeveloperIdentityInput>(
  "GetOpenIdTokenForDeveloperIdentityInput",
)(
  {
    IdentityPoolId: S.String,
    IdentityId: S.optional(S.String),
    Logins: LoginsMap,
    PrincipalTags: S.optional(PrincipalTags),
    TokenDuration: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPrincipalTagAttributeMapResponse extends S.Class<GetPrincipalTagAttributeMapResponse>(
  "GetPrincipalTagAttributeMapResponse",
)(
  {
    IdentityPoolId: S.optional(S.String),
    IdentityProviderName: S.optional(S.String),
    UseDefaults: S.optional(S.Boolean),
    PrincipalTags: S.optional(PrincipalTags),
  },
  ns,
) {}
export class ListIdentitiesResponse extends S.Class<ListIdentitiesResponse>(
  "ListIdentitiesResponse",
)(
  {
    IdentityPoolId: S.optional(S.String),
    Identities: S.optional(IdentitiesList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(IdentityPoolTagsType) }, ns) {}
export class LookupDeveloperIdentityResponse extends S.Class<LookupDeveloperIdentityResponse>(
  "LookupDeveloperIdentityResponse",
)(
  {
    IdentityId: S.optional(S.String),
    DeveloperUserIdentifierList: S.optional(DeveloperUserIdentifierList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class MergeDeveloperIdentitiesResponse extends S.Class<MergeDeveloperIdentitiesResponse>(
  "MergeDeveloperIdentitiesResponse",
)({ IdentityId: S.optional(S.String) }, ns) {}
export class SetPrincipalTagAttributeMapResponse extends S.Class<SetPrincipalTagAttributeMapResponse>(
  "SetPrincipalTagAttributeMapResponse",
)(
  {
    IdentityPoolId: S.optional(S.String),
    IdentityProviderName: S.optional(S.String),
    UseDefaults: S.optional(S.Boolean),
    PrincipalTags: S.optional(PrincipalTags),
  },
  ns,
) {}
export class UnprocessedIdentityId extends S.Class<UnprocessedIdentityId>(
  "UnprocessedIdentityId",
)({ IdentityId: S.optional(S.String), ErrorCode: S.optional(S.String) }) {}
export const UnprocessedIdentityIdList = S.Array(UnprocessedIdentityId);
export class IdentityPoolShortDescription extends S.Class<IdentityPoolShortDescription>(
  "IdentityPoolShortDescription",
)({
  IdentityPoolId: S.optional(S.String),
  IdentityPoolName: S.optional(S.String),
}) {}
export const IdentityPoolsList = S.Array(IdentityPoolShortDescription);
export class DeleteIdentitiesResponse extends S.Class<DeleteIdentitiesResponse>(
  "DeleteIdentitiesResponse",
)({ UnprocessedIdentityIds: S.optional(UnprocessedIdentityIdList) }, ns) {}
export class GetOpenIdTokenForDeveloperIdentityResponse extends S.Class<GetOpenIdTokenForDeveloperIdentityResponse>(
  "GetOpenIdTokenForDeveloperIdentityResponse",
)({ IdentityId: S.optional(S.String), Token: S.optional(S.String) }, ns) {}
export class ListIdentityPoolsResponse extends S.Class<ListIdentityPoolsResponse>(
  "ListIdentityPoolsResponse",
)(
  {
    IdentityPools: S.optional(IdentityPoolsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class Credentials extends S.Class<Credentials>("Credentials")({
  AccessKeyId: S.optional(S.String),
  SecretKey: S.optional(S.String),
  SessionToken: S.optional(S.String),
  Expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetCredentialsForIdentityResponse extends S.Class<GetCredentialsForIdentityResponse>(
  "GetCredentialsForIdentityResponse",
)(
  { IdentityId: S.optional(S.String), Credentials: S.optional(Credentials) },
  ns,
) {}
export class SetIdentityPoolRolesInput extends S.Class<SetIdentityPoolRolesInput>(
  "SetIdentityPoolRolesInput",
)(
  {
    IdentityPoolId: S.String,
    Roles: RolesMap,
    RoleMappings: S.optional(RoleMappingMap),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetIdentityPoolRolesResponse extends S.Class<SetIdentityPoolRolesResponse>(
  "SetIdentityPoolRolesResponse",
)({}, ns) {}

//# Errors
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  {},
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}
export class ExternalServiceException extends S.TaggedError<ExternalServiceException>()(
  "ExternalServiceException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  {},
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
) {}
export class DeveloperUserAlreadyRegisteredException extends S.TaggedError<DeveloperUserAlreadyRegisteredException>()(
  "DeveloperUserAlreadyRegisteredException",
  { message: S.optional(S.String) },
) {}
export class InvalidIdentityPoolConfigurationException extends S.TaggedError<InvalidIdentityPoolConfigurationException>()(
  "InvalidIdentityPoolConfigurationException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns metadata related to the given identity, including when the identity was
 * created and any associated linked logins.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const describeIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIdentityInput,
  output: IdentityDescription,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets details about a particular identity pool, including the pool name, ID
 * description, creation date, and current number of users.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const describeIdentityPool = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeIdentityPoolInput,
    output: IdentityPool,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Generates (or retrieves) IdentityID. Supplying multiple logins will create an
 * implicit linked account.
 *
 * This is a public API. You do not need any credentials to call this API.
 */
export const getId = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdInput,
  output: GetIdResponse,
  errors: [
    ExternalServiceException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the roles for an identity pool.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const getIdentityPoolRoles = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIdentityPoolRolesInput,
    output: GetIdentityPoolRolesResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceConflictException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets an OpenID token, using a known Cognito ID. This known Cognito ID is returned by
 * GetId. You can optionally add additional logins for the identity.
 * Supplying multiple logins creates an implicit link.
 *
 * The OpenID token is valid for 10 minutes.
 *
 * This is a public API. You do not need any credentials to call this API.
 */
export const getOpenIdToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOpenIdTokenInput,
  output: GetOpenIdTokenResponse,
  errors: [
    ExternalServiceException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Use `GetPrincipalTagAttributeMap` to list all mappings between
 * `PrincipalTags` and user attributes.
 */
export const getPrincipalTagAttributeMap = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPrincipalTagAttributeMapInput,
    output: GetPrincipalTagAttributeMapResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Lists the identities in an identity pool.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const listIdentities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIdentitiesInput,
  output: ListIdentitiesResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the tags that are assigned to an Amazon Cognito identity pool.
 *
 * A tag is a label that you can apply to identity pools to categorize and manage them in
 * different ways, such as by purpose, owner, environment, or other criteria.
 *
 * You can use this action up to 10 times per second, per account.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the `IdentityID` associated with a
 * `DeveloperUserIdentifier` or the list of `DeveloperUserIdentifier`
 * values associated with an `IdentityId` for an existing identity. Either
 * `IdentityID` or `DeveloperUserIdentifier` must not be null. If you
 * supply only one of these values, the other value will be searched in the database and
 * returned as a part of the response. If you supply both,
 * `DeveloperUserIdentifier` will be matched against `IdentityID`. If
 * the values are verified against the database, the response returns both values and is the
 * same as the request. Otherwise, a `ResourceConflictException` is
 * thrown.
 *
 * `LookupDeveloperIdentity` is intended for low-throughput control plane
 * operations: for example, to enable customer service to locate an identity ID by username.
 * If you are using it for higher-volume operations such as user authentication, your requests
 * are likely to be throttled. GetOpenIdTokenForDeveloperIdentity is a
 * better option for higher-volume operations for user authentication.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const lookupDeveloperIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: LookupDeveloperIdentityInput,
    output: LookupDeveloperIdentityResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceConflictException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Merges two users having different `IdentityId`s, existing in the same
 * identity pool, and identified by the same developer provider. You can use this action to
 * request that discrete users be merged and identified as a single user in the Cognito
 * environment. Cognito associates the given source user (`SourceUserIdentifier`)
 * with the `IdentityId` of the `DestinationUserIdentifier`. Only
 * developer-authenticated users can be merged. If the users to be merged are associated with
 * the same public provider, but as two different users, an exception will be
 * thrown.
 *
 * The number of linked logins is limited to 20. So, the number of linked logins for the
 * source user, `SourceUserIdentifier`, and the destination user,
 * `DestinationUserIdentifier`, together should not be larger than 20.
 * Otherwise, an exception will be thrown.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const mergeDeveloperIdentities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: MergeDeveloperIdentitiesInput,
    output: MergeDeveloperIdentitiesResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceConflictException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * You can use this operation to use default (username and clientID) attribute or custom
 * attribute mappings.
 */
export const setPrincipalTagAttributeMap = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetPrincipalTagAttributeMapInput,
    output: SetPrincipalTagAttributeMapResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Assigns a set of tags to the specified Amazon Cognito identity pool. A tag is a label
 * that you can use to categorize and manage identity pools in different ways, such as by
 * purpose, owner, environment, or other criteria.
 *
 * Each tag consists of a key and value, both of which you define. A key is a general
 * category for more specific values. For example, if you have two versions of an identity
 * pool, one for testing and another for production, you might assign an
 * `Environment` tag key to both identity pools. The value of this key might be
 * `Test` for one identity pool and `Production` for the
 * other.
 *
 * Tags are useful for cost tracking and access control. You can activate your tags so that
 * they appear on the Billing and Cost Management console, where you can track the costs
 * associated with your identity pools. In an IAM policy, you can constrain
 * permissions for identity pools based on specific tags or tag values.
 *
 * You can use this action up to 5 times per second, per account. An identity pool can have
 * as many as 50 tags.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Unlinks a `DeveloperUserIdentifier` from an existing identity. Unlinked
 * developer users will be considered new identities next time they are seen. If, for a given
 * Cognito identity, you remove all federated identities as well as the developer user
 * identifier, the Cognito identity becomes inaccessible.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const unlinkDeveloperIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UnlinkDeveloperIdentityInput,
    output: UnlinkDeveloperIdentityResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceConflictException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Unlinks a federated identity from an existing account. Unlinked logins will be
 * considered new identities next time they are seen. Removing the last linked login will make
 * this identity inaccessible.
 *
 * This is a public API. You do not need any credentials to call this API.
 */
export const unlinkIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnlinkIdentityInput,
  output: UnlinkIdentityResponse,
  errors: [
    ExternalServiceException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes the specified tags from the specified Amazon Cognito identity pool. You can use
 * this action up to 5 times per second, per account
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the configuration of an identity pool.
 *
 * If you don't provide a value for a parameter, Amazon Cognito sets it to its default value.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const updateIdentityPool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IdentityPool,
  output: IdentityPool,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new identity pool. The identity pool is a store of user identity
 * information that is specific to your Amazon Web Services account. The keys for
 * `SupportedLoginProviders` are as follows:
 *
 * - Facebook: `graph.facebook.com`
 *
 * - Google: `accounts.google.com`
 *
 * - Sign in With Apple: `appleid.apple.com`
 *
 * - Amazon: `www.amazon.com`
 *
 * - Twitter: `api.twitter.com`
 *
 * - Digits: `www.digits.com`
 *
 * If you don't provide a value for a parameter, Amazon Cognito sets it to its default value.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const createIdentityPool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIdentityPoolInput,
  output: IdentityPool,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceConflictException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes identities from an identity pool. You can specify a list of 1-60 identities
 * that you want to delete.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const deleteIdentities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentitiesInput,
  output: DeleteIdentitiesResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an identity pool. Once a pool is deleted, users will not be able to
 * authenticate with the pool.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const deleteIdentityPool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentityPoolInput,
  output: DeleteIdentityPoolResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists all of the Cognito identity pools registered for your account.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const listIdentityPools = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIdentityPoolsInput,
  output: ListIdentityPoolsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Registers (or retrieves) a Cognito `IdentityId` and an OpenID Connect
 * token for a user authenticated by your backend authentication process. Supplying multiple
 * logins will create an implicit linked account. You can only specify one developer provider
 * as part of the `Logins` map, which is linked to the identity pool. The developer
 * provider is the "domain" by which Cognito will refer to your users.
 *
 * You can use `GetOpenIdTokenForDeveloperIdentity` to create a new identity
 * and to link new logins (that is, user credentials issued by a public provider or developer
 * provider) to an existing identity. When you want to create a new identity, the
 * `IdentityId` should be null. When you want to associate a new login with an
 * existing authenticated/unauthenticated identity, you can do so by providing the existing
 * `IdentityId`. This API will create the identity in the specified
 * `IdentityPoolId`.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const getOpenIdTokenForDeveloperIdentity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetOpenIdTokenForDeveloperIdentityInput,
    output: GetOpenIdTokenForDeveloperIdentityResponse,
    errors: [
      DeveloperUserAlreadyRegisteredException,
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceConflictException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Returns credentials for the provided identity ID. Any provided logins will be
 * validated against supported login providers. If the token is for
 * `cognito-identity.amazonaws.com`, it will be passed through to Security Token Service with the appropriate role for the token.
 *
 * This is a public API. You do not need any credentials to call this API.
 */
export const getCredentialsForIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCredentialsForIdentityInput,
    output: GetCredentialsForIdentityResponse,
    errors: [
      ExternalServiceException,
      InternalErrorException,
      InvalidIdentityPoolConfigurationException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceConflictException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Sets the roles for an identity pool. These roles are used when making calls to GetCredentialsForIdentity action.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const setIdentityPoolRoles = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetIdentityPoolRolesInput,
    output: SetIdentityPoolRolesResponse,
    errors: [
      ConcurrentModificationException,
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceConflictException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);

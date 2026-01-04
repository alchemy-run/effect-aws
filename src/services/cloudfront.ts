import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://cloudfront.amazonaws.com/doc/2020-05-31/");
const svc = T.AwsApiService({
  sdkId: "CloudFront",
  serviceShapeName: "Cloudfront2020_05_31",
});
const auth = T.AwsAuthSigv4({ name: "cloudfront" });
const ver = T.ServiceVersion("2020-05-31");
const proto = T.AwsProtocolsRestXml();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://cloudfront.global.api.aws",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://cloudfront-fips.global.api.aws",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://cloudfront.cn-northwest-1.amazonaws.com.cn",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "cn-northwest-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://cloudfront-fips.cn-northwest-1.amazonaws.com.cn",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "cn-northwest-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                          endpoint: {
                            url: "https://cloudfront-fips.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
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
                          endpoint: {
                            url: "https://cloudfront-fips.{PartitionResult#dnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
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
                          endpoint: {
                            url: "https://cloudfront.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    url: "https://cloudfront.{PartitionResult#dnsSuffix}",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingRegion:
                            "{PartitionResult#implicitGlobalRegion}",
                        },
                      ],
                    },
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
export const FieldList = S.Array(S.String.pipe(T.XmlName("Field")));
export class AssociateAliasRequest extends S.Class<AssociateAliasRequest>(
  "AssociateAliasRequest",
)(
  {
    TargetDistributionId: S.String.pipe(T.HttpLabel()),
    Alias: S.String.pipe(T.HttpQuery("Alias")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/distribution/{TargetDistributionId}/associate-alias",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateAliasResponse extends S.Class<AssociateAliasResponse>(
  "AssociateAliasResponse",
)({}, ns) {}
export class AssociateDistributionTenantWebACLRequest extends S.Class<AssociateDistributionTenantWebACLRequest>(
  "AssociateDistributionTenantWebACLRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    WebACLArn: S.String,
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/distribution-tenant/{Id}/associate-web-acl",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateDistributionWebACLRequest extends S.Class<AssociateDistributionWebACLRequest>(
  "AssociateDistributionWebACLRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    WebACLArn: S.String,
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/distribution/{Id}/associate-web-acl",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CopyDistributionRequest extends S.Class<CopyDistributionRequest>(
  "CopyDistributionRequest",
)(
  {
    PrimaryDistributionId: S.String.pipe(T.HttpLabel()),
    Staging: S.optional(S.Boolean).pipe(T.HttpHeader("Staging")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    CallerReference: S.String,
    Enabled: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2020-05-31/distribution/{PrimaryDistributionId}/copy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag.pipe(T.XmlName("Tag")));
export class Tags extends S.Class<Tags>("Tags")({
  Items: S.optional(TagList),
}) {}
export class CreateConnectionGroupRequest extends S.Class<CreateConnectionGroupRequest>(
  "CreateConnectionGroupRequest",
)(
  {
    Name: S.String,
    Ipv6Enabled: S.optional(S.Boolean),
    Tags: S.optional(Tags),
    AnycastIpListId: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/connection-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class KeyValueStoreAssociation extends S.Class<KeyValueStoreAssociation>(
  "KeyValueStoreAssociation",
)({ KeyValueStoreARN: S.String }) {}
export const KeyValueStoreAssociationList = S.Array(
  KeyValueStoreAssociation.pipe(T.XmlName("KeyValueStoreAssociation")),
);
export class KeyValueStoreAssociations extends S.Class<KeyValueStoreAssociations>(
  "KeyValueStoreAssociations",
)({ Quantity: S.Number, Items: S.optional(KeyValueStoreAssociationList) }) {}
export class FunctionConfig extends S.Class<FunctionConfig>("FunctionConfig")({
  Comment: S.String,
  Runtime: S.String,
  KeyValueStoreAssociations: S.optional(KeyValueStoreAssociations),
}) {}
export class CreateFunctionRequest extends S.Class<CreateFunctionRequest>(
  "CreateFunctionRequest",
)(
  { Name: S.String, FunctionConfig: FunctionConfig, FunctionCode: T.Blob },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/function" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const PathList = S.Array(S.String.pipe(T.XmlName("Path")));
export class Paths extends S.Class<Paths>("Paths")({
  Quantity: S.Number,
  Items: S.optional(PathList),
}) {}
export class InvalidationBatch extends S.Class<InvalidationBatch>(
  "InvalidationBatch",
)({ Paths: Paths, CallerReference: S.String }) {}
export class CreateInvalidationForDistributionTenantRequest extends S.Class<CreateInvalidationForDistributionTenantRequest>(
  "CreateInvalidationForDistributionTenantRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    InvalidationBatch: InvalidationBatch.pipe(
      T.HttpPayload(),
      T.XmlName("InvalidationBatch"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2020-05-31/distribution-tenant/{Id}/invalidation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAnycastIpListRequest extends S.Class<DeleteAnycastIpListRequest>(
  "DeleteAnycastIpListRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/anycast-ip-list/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAnycastIpListResponse extends S.Class<DeleteAnycastIpListResponse>(
  "DeleteAnycastIpListResponse",
)({}, ns) {}
export class DeleteCachePolicyRequest extends S.Class<DeleteCachePolicyRequest>(
  "DeleteCachePolicyRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/cache-policy/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCachePolicyResponse extends S.Class<DeleteCachePolicyResponse>(
  "DeleteCachePolicyResponse",
)({}, ns) {}
export class DeleteCloudFrontOriginAccessIdentityRequest extends S.Class<DeleteCloudFrontOriginAccessIdentityRequest>(
  "DeleteCloudFrontOriginAccessIdentityRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2020-05-31/origin-access-identity/cloudfront/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCloudFrontOriginAccessIdentityResponse extends S.Class<DeleteCloudFrontOriginAccessIdentityResponse>(
  "DeleteCloudFrontOriginAccessIdentityResponse",
)({}, ns) {}
export class DeleteConnectionFunctionRequest extends S.Class<DeleteConnectionFunctionRequest>(
  "DeleteConnectionFunctionRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/connection-function/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectionFunctionResponse extends S.Class<DeleteConnectionFunctionResponse>(
  "DeleteConnectionFunctionResponse",
)({}, ns) {}
export class DeleteConnectionGroupRequest extends S.Class<DeleteConnectionGroupRequest>(
  "DeleteConnectionGroupRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/connection-group/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectionGroupResponse extends S.Class<DeleteConnectionGroupResponse>(
  "DeleteConnectionGroupResponse",
)({}, ns) {}
export class DeleteContinuousDeploymentPolicyRequest extends S.Class<DeleteContinuousDeploymentPolicyRequest>(
  "DeleteContinuousDeploymentPolicyRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2020-05-31/continuous-deployment-policy/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContinuousDeploymentPolicyResponse extends S.Class<DeleteContinuousDeploymentPolicyResponse>(
  "DeleteContinuousDeploymentPolicyResponse",
)({}, ns) {}
export class DeleteDistributionRequest extends S.Class<DeleteDistributionRequest>(
  "DeleteDistributionRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/distribution/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDistributionResponse extends S.Class<DeleteDistributionResponse>(
  "DeleteDistributionResponse",
)({}, ns) {}
export class DeleteDistributionTenantRequest extends S.Class<DeleteDistributionTenantRequest>(
  "DeleteDistributionTenantRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/distribution-tenant/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDistributionTenantResponse extends S.Class<DeleteDistributionTenantResponse>(
  "DeleteDistributionTenantResponse",
)({}, ns) {}
export class DeleteFieldLevelEncryptionConfigRequest extends S.Class<DeleteFieldLevelEncryptionConfigRequest>(
  "DeleteFieldLevelEncryptionConfigRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2020-05-31/field-level-encryption/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFieldLevelEncryptionConfigResponse extends S.Class<DeleteFieldLevelEncryptionConfigResponse>(
  "DeleteFieldLevelEncryptionConfigResponse",
)({}, ns) {}
export class DeleteFieldLevelEncryptionProfileRequest extends S.Class<DeleteFieldLevelEncryptionProfileRequest>(
  "DeleteFieldLevelEncryptionProfileRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2020-05-31/field-level-encryption-profile/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFieldLevelEncryptionProfileResponse extends S.Class<DeleteFieldLevelEncryptionProfileResponse>(
  "DeleteFieldLevelEncryptionProfileResponse",
)({}, ns) {}
export class DeleteFunctionRequest extends S.Class<DeleteFunctionRequest>(
  "DeleteFunctionRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/function/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFunctionResponse extends S.Class<DeleteFunctionResponse>(
  "DeleteFunctionResponse",
)({}, ns) {}
export class DeleteKeyGroupRequest extends S.Class<DeleteKeyGroupRequest>(
  "DeleteKeyGroupRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/key-group/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKeyGroupResponse extends S.Class<DeleteKeyGroupResponse>(
  "DeleteKeyGroupResponse",
)({}, ns) {}
export class DeleteKeyValueStoreRequest extends S.Class<DeleteKeyValueStoreRequest>(
  "DeleteKeyValueStoreRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/key-value-store/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKeyValueStoreResponse extends S.Class<DeleteKeyValueStoreResponse>(
  "DeleteKeyValueStoreResponse",
)({}, ns) {}
export class DeleteMonitoringSubscriptionRequest extends S.Class<DeleteMonitoringSubscriptionRequest>(
  "DeleteMonitoringSubscriptionRequest",
)(
  { DistributionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2020-05-31/distributions/{DistributionId}/monitoring-subscription",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMonitoringSubscriptionResult extends S.Class<DeleteMonitoringSubscriptionResult>(
  "DeleteMonitoringSubscriptionResult",
)({}, ns) {}
export class DeleteOriginAccessControlRequest extends S.Class<DeleteOriginAccessControlRequest>(
  "DeleteOriginAccessControlRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/origin-access-control/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteOriginAccessControlResponse extends S.Class<DeleteOriginAccessControlResponse>(
  "DeleteOriginAccessControlResponse",
)({}, ns) {}
export class DeleteOriginRequestPolicyRequest extends S.Class<DeleteOriginRequestPolicyRequest>(
  "DeleteOriginRequestPolicyRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/origin-request-policy/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteOriginRequestPolicyResponse extends S.Class<DeleteOriginRequestPolicyResponse>(
  "DeleteOriginRequestPolicyResponse",
)({}, ns) {}
export class DeletePublicKeyRequest extends S.Class<DeletePublicKeyRequest>(
  "DeletePublicKeyRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/public-key/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePublicKeyResponse extends S.Class<DeletePublicKeyResponse>(
  "DeletePublicKeyResponse",
)({}, ns) {}
export class DeleteRealtimeLogConfigRequest extends S.Class<DeleteRealtimeLogConfigRequest>(
  "DeleteRealtimeLogConfigRequest",
)(
  { Name: S.optional(S.String), ARN: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/delete-realtime-log-config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRealtimeLogConfigResponse extends S.Class<DeleteRealtimeLogConfigResponse>(
  "DeleteRealtimeLogConfigResponse",
)({}, ns) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/delete-resource-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}, ns) {}
export class DeleteResponseHeadersPolicyRequest extends S.Class<DeleteResponseHeadersPolicyRequest>(
  "DeleteResponseHeadersPolicyRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2020-05-31/response-headers-policy/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResponseHeadersPolicyResponse extends S.Class<DeleteResponseHeadersPolicyResponse>(
  "DeleteResponseHeadersPolicyResponse",
)({}, ns) {}
export class DeleteStreamingDistributionRequest extends S.Class<DeleteStreamingDistributionRequest>(
  "DeleteStreamingDistributionRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2020-05-31/streaming-distribution/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteStreamingDistributionResponse extends S.Class<DeleteStreamingDistributionResponse>(
  "DeleteStreamingDistributionResponse",
)({}, ns) {}
export class DeleteTrustStoreRequest extends S.Class<DeleteTrustStoreRequest>(
  "DeleteTrustStoreRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/trust-store/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTrustStoreResponse extends S.Class<DeleteTrustStoreResponse>(
  "DeleteTrustStoreResponse",
)({}, ns) {}
export class DeleteVpcOriginRequest extends S.Class<DeleteVpcOriginRequest>(
  "DeleteVpcOriginRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2020-05-31/vpc-origin/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConnectionFunctionRequest extends S.Class<DescribeConnectionFunctionRequest>(
  "DescribeConnectionFunctionRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    Stage: S.optional(S.String).pipe(T.HttpQuery("Stage")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/connection-function/{Identifier}/describe",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFunctionRequest extends S.Class<DescribeFunctionRequest>(
  "DescribeFunctionRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    Stage: S.optional(S.String).pipe(T.HttpQuery("Stage")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/function/{Name}/describe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeKeyValueStoreRequest extends S.Class<DescribeKeyValueStoreRequest>(
  "DescribeKeyValueStoreRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/key-value-store/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateDistributionTenantWebACLRequest extends S.Class<DisassociateDistributionTenantWebACLRequest>(
  "DisassociateDistributionTenantWebACLRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/distribution-tenant/{Id}/disassociate-web-acl",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateDistributionWebACLRequest extends S.Class<DisassociateDistributionWebACLRequest>(
  "DisassociateDistributionWebACLRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/distribution/{Id}/disassociate-web-acl",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAnycastIpListRequest extends S.Class<GetAnycastIpListRequest>(
  "GetAnycastIpListRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/anycast-ip-list/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCachePolicyRequest extends S.Class<GetCachePolicyRequest>(
  "GetCachePolicyRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/cache-policy/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCachePolicyConfigRequest extends S.Class<GetCachePolicyConfigRequest>(
  "GetCachePolicyConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/cache-policy/{Id}/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCloudFrontOriginAccessIdentityRequest extends S.Class<GetCloudFrontOriginAccessIdentityRequest>(
  "GetCloudFrontOriginAccessIdentityRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/origin-access-identity/cloudfront/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCloudFrontOriginAccessIdentityConfigRequest extends S.Class<GetCloudFrontOriginAccessIdentityConfigRequest>(
  "GetCloudFrontOriginAccessIdentityConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/origin-access-identity/cloudfront/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectionFunctionRequest extends S.Class<GetConnectionFunctionRequest>(
  "GetConnectionFunctionRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    Stage: S.optional(S.String).pipe(T.HttpQuery("Stage")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/connection-function/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectionGroupRequest extends S.Class<GetConnectionGroupRequest>(
  "GetConnectionGroupRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/connection-group/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectionGroupByRoutingEndpointRequest extends S.Class<GetConnectionGroupByRoutingEndpointRequest>(
  "GetConnectionGroupByRoutingEndpointRequest",
)(
  { RoutingEndpoint: S.String.pipe(T.HttpQuery("RoutingEndpoint")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/connection-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContinuousDeploymentPolicyRequest extends S.Class<GetContinuousDeploymentPolicyRequest>(
  "GetContinuousDeploymentPolicyRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/continuous-deployment-policy/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContinuousDeploymentPolicyConfigRequest extends S.Class<GetContinuousDeploymentPolicyConfigRequest>(
  "GetContinuousDeploymentPolicyConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/continuous-deployment-policy/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDistributionRequest extends S.Class<GetDistributionRequest>(
  "GetDistributionRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/distribution/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDistributionConfigRequest extends S.Class<GetDistributionConfigRequest>(
  "GetDistributionConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/distribution/{Id}/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDistributionTenantRequest extends S.Class<GetDistributionTenantRequest>(
  "GetDistributionTenantRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distribution-tenant/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDistributionTenantByDomainRequest extends S.Class<GetDistributionTenantByDomainRequest>(
  "GetDistributionTenantByDomainRequest",
)(
  { Domain: S.String.pipe(T.HttpQuery("domain")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/distribution-tenant" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFieldLevelEncryptionRequest extends S.Class<GetFieldLevelEncryptionRequest>(
  "GetFieldLevelEncryptionRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/field-level-encryption/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFieldLevelEncryptionConfigRequest extends S.Class<GetFieldLevelEncryptionConfigRequest>(
  "GetFieldLevelEncryptionConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/field-level-encryption/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFieldLevelEncryptionProfileRequest extends S.Class<GetFieldLevelEncryptionProfileRequest>(
  "GetFieldLevelEncryptionProfileRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/field-level-encryption-profile/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFieldLevelEncryptionProfileConfigRequest extends S.Class<GetFieldLevelEncryptionProfileConfigRequest>(
  "GetFieldLevelEncryptionProfileConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/field-level-encryption-profile/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFunctionRequest extends S.Class<GetFunctionRequest>(
  "GetFunctionRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    Stage: S.optional(S.String).pipe(T.HttpQuery("Stage")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/function/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInvalidationRequest extends S.Class<GetInvalidationRequest>(
  "GetInvalidationRequest",
)(
  {
    DistributionId: S.String.pipe(T.HttpLabel()),
    Id: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distribution/{DistributionId}/invalidation/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInvalidationForDistributionTenantRequest extends S.Class<GetInvalidationForDistributionTenantRequest>(
  "GetInvalidationForDistributionTenantRequest",
)(
  {
    DistributionTenantId: S.String.pipe(T.HttpLabel()),
    Id: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distribution-tenant/{DistributionTenantId}/invalidation/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKeyGroupRequest extends S.Class<GetKeyGroupRequest>(
  "GetKeyGroupRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/key-group/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKeyGroupConfigRequest extends S.Class<GetKeyGroupConfigRequest>(
  "GetKeyGroupConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/key-group/{Id}/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedCertificateDetailsRequest extends S.Class<GetManagedCertificateDetailsRequest>(
  "GetManagedCertificateDetailsRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/managed-certificate/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMonitoringSubscriptionRequest extends S.Class<GetMonitoringSubscriptionRequest>(
  "GetMonitoringSubscriptionRequest",
)(
  { DistributionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distributions/{DistributionId}/monitoring-subscription",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOriginAccessControlRequest extends S.Class<GetOriginAccessControlRequest>(
  "GetOriginAccessControlRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/origin-access-control/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOriginAccessControlConfigRequest extends S.Class<GetOriginAccessControlConfigRequest>(
  "GetOriginAccessControlConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/origin-access-control/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOriginRequestPolicyRequest extends S.Class<GetOriginRequestPolicyRequest>(
  "GetOriginRequestPolicyRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/origin-request-policy/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOriginRequestPolicyConfigRequest extends S.Class<GetOriginRequestPolicyConfigRequest>(
  "GetOriginRequestPolicyConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/origin-request-policy/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPublicKeyRequest extends S.Class<GetPublicKeyRequest>(
  "GetPublicKeyRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/public-key/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPublicKeyConfigRequest extends S.Class<GetPublicKeyConfigRequest>(
  "GetPublicKeyConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/public-key/{Id}/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRealtimeLogConfigRequest extends S.Class<GetRealtimeLogConfigRequest>(
  "GetRealtimeLogConfigRequest",
)(
  { Name: S.optional(S.String), ARN: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/get-realtime-log-config" }),
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
  { ResourceArn: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/get-resource-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResponseHeadersPolicyRequest extends S.Class<GetResponseHeadersPolicyRequest>(
  "GetResponseHeadersPolicyRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/response-headers-policy/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResponseHeadersPolicyConfigRequest extends S.Class<GetResponseHeadersPolicyConfigRequest>(
  "GetResponseHeadersPolicyConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/response-headers-policy/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStreamingDistributionRequest extends S.Class<GetStreamingDistributionRequest>(
  "GetStreamingDistributionRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/streaming-distribution/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStreamingDistributionConfigRequest extends S.Class<GetStreamingDistributionConfigRequest>(
  "GetStreamingDistributionConfigRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/streaming-distribution/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTrustStoreRequest extends S.Class<GetTrustStoreRequest>(
  "GetTrustStoreRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/trust-store/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVpcOriginRequest extends S.Class<GetVpcOriginRequest>(
  "GetVpcOriginRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/vpc-origin/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAnycastIpListsRequest extends S.Class<ListAnycastIpListsRequest>(
  "ListAnycastIpListsRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/anycast-ip-list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCachePoliciesRequest extends S.Class<ListCachePoliciesRequest>(
  "ListCachePoliciesRequest",
)(
  {
    Type: S.optional(S.String).pipe(T.HttpQuery("Type")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/cache-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCloudFrontOriginAccessIdentitiesRequest extends S.Class<ListCloudFrontOriginAccessIdentitiesRequest>(
  "ListCloudFrontOriginAccessIdentitiesRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/origin-access-identity/cloudfront",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConflictingAliasesRequest extends S.Class<ListConflictingAliasesRequest>(
  "ListConflictingAliasesRequest",
)(
  {
    DistributionId: S.String.pipe(T.HttpQuery("DistributionId")),
    Alias: S.String.pipe(T.HttpQuery("Alias")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/conflicting-alias" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConnectionFunctionsRequest extends S.Class<ListConnectionFunctionsRequest>(
  "ListConnectionFunctionsRequest",
)(
  {
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Stage: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/connection-functions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListContinuousDeploymentPoliciesRequest extends S.Class<ListContinuousDeploymentPoliciesRequest>(
  "ListContinuousDeploymentPoliciesRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/continuous-deployment-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsRequest extends S.Class<ListDistributionsRequest>(
  "ListDistributionsRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/distribution" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByAnycastIpListIdRequest extends S.Class<ListDistributionsByAnycastIpListIdRequest>(
  "ListDistributionsByAnycastIpListIdRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    AnycastIpListId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distributionsByAnycastIpListId/{AnycastIpListId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByCachePolicyIdRequest extends S.Class<ListDistributionsByCachePolicyIdRequest>(
  "ListDistributionsByCachePolicyIdRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    CachePolicyId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distributionsByCachePolicyId/{CachePolicyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByConnectionFunctionRequest extends S.Class<ListDistributionsByConnectionFunctionRequest>(
  "ListDistributionsByConnectionFunctionRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    ConnectionFunctionIdentifier: S.String.pipe(
      T.HttpQuery("ConnectionFunctionIdentifier"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distributionsByConnectionFunction",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByConnectionModeRequest extends S.Class<ListDistributionsByConnectionModeRequest>(
  "ListDistributionsByConnectionModeRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    ConnectionMode: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distributionsByConnectionMode/{ConnectionMode}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByKeyGroupRequest extends S.Class<ListDistributionsByKeyGroupRequest>(
  "ListDistributionsByKeyGroupRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    KeyGroupId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distributionsByKeyGroupId/{KeyGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByOriginRequestPolicyIdRequest extends S.Class<ListDistributionsByOriginRequestPolicyIdRequest>(
  "ListDistributionsByOriginRequestPolicyIdRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    OriginRequestPolicyId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distributionsByOriginRequestPolicyId/{OriginRequestPolicyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByOwnedResourceRequest extends S.Class<ListDistributionsByOwnedResourceRequest>(
  "ListDistributionsByOwnedResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distributionsByOwnedResource/{ResourceArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByRealtimeLogConfigRequest extends S.Class<ListDistributionsByRealtimeLogConfigRequest>(
  "ListDistributionsByRealtimeLogConfigRequest",
)(
  {
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    RealtimeLogConfigName: S.optional(S.String),
    RealtimeLogConfigArn: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2020-05-31/distributionsByRealtimeLogConfig",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByResponseHeadersPolicyIdRequest extends S.Class<ListDistributionsByResponseHeadersPolicyIdRequest>(
  "ListDistributionsByResponseHeadersPolicyIdRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    ResponseHeadersPolicyId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distributionsByResponseHeadersPolicyId/{ResponseHeadersPolicyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByTrustStoreRequest extends S.Class<ListDistributionsByTrustStoreRequest>(
  "ListDistributionsByTrustStoreRequest",
)(
  {
    TrustStoreIdentifier: S.String.pipe(T.HttpQuery("TrustStoreIdentifier")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/distributionsByTrustStore" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByVpcOriginIdRequest extends S.Class<ListDistributionsByVpcOriginIdRequest>(
  "ListDistributionsByVpcOriginIdRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    VpcOriginId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distributionsByVpcOriginId/{VpcOriginId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionsByWebACLIdRequest extends S.Class<ListDistributionsByWebACLIdRequest>(
  "ListDistributionsByWebACLIdRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    WebACLId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distributionsByWebACLId/{WebACLId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionTenantsByCustomizationRequest extends S.Class<ListDistributionTenantsByCustomizationRequest>(
  "ListDistributionTenantsByCustomizationRequest",
)(
  {
    WebACLArn: S.optional(S.String),
    CertificateArn: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2020-05-31/distribution-tenants-by-customization",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFieldLevelEncryptionConfigsRequest extends S.Class<ListFieldLevelEncryptionConfigsRequest>(
  "ListFieldLevelEncryptionConfigsRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/field-level-encryption" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFieldLevelEncryptionProfilesRequest extends S.Class<ListFieldLevelEncryptionProfilesRequest>(
  "ListFieldLevelEncryptionProfilesRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/field-level-encryption-profile",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFunctionsRequest extends S.Class<ListFunctionsRequest>(
  "ListFunctionsRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Stage: S.optional(S.String).pipe(T.HttpQuery("Stage")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/function" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInvalidationsRequest extends S.Class<ListInvalidationsRequest>(
  "ListInvalidationsRequest",
)(
  {
    DistributionId: S.String.pipe(T.HttpLabel()),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distribution/{DistributionId}/invalidation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInvalidationsForDistributionTenantRequest extends S.Class<ListInvalidationsForDistributionTenantRequest>(
  "ListInvalidationsForDistributionTenantRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2020-05-31/distribution-tenant/{Id}/invalidation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKeyGroupsRequest extends S.Class<ListKeyGroupsRequest>(
  "ListKeyGroupsRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/key-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKeyValueStoresRequest extends S.Class<ListKeyValueStoresRequest>(
  "ListKeyValueStoresRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Status: S.optional(S.String).pipe(T.HttpQuery("Status")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/key-value-store" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOriginAccessControlsRequest extends S.Class<ListOriginAccessControlsRequest>(
  "ListOriginAccessControlsRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/origin-access-control" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOriginRequestPoliciesRequest extends S.Class<ListOriginRequestPoliciesRequest>(
  "ListOriginRequestPoliciesRequest",
)(
  {
    Type: S.optional(S.String).pipe(T.HttpQuery("Type")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/origin-request-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPublicKeysRequest extends S.Class<ListPublicKeysRequest>(
  "ListPublicKeysRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/public-key" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRealtimeLogConfigsRequest extends S.Class<ListRealtimeLogConfigsRequest>(
  "ListRealtimeLogConfigsRequest",
)(
  {
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/realtime-log-config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResponseHeadersPoliciesRequest extends S.Class<ListResponseHeadersPoliciesRequest>(
  "ListResponseHeadersPoliciesRequest",
)(
  {
    Type: S.optional(S.String).pipe(T.HttpQuery("Type")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/response-headers-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStreamingDistributionsRequest extends S.Class<ListStreamingDistributionsRequest>(
  "ListStreamingDistributionsRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/streaming-distribution" }),
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
  { Resource: S.String.pipe(T.HttpQuery("Resource")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/tagging" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrustStoresRequest extends S.Class<ListTrustStoresRequest>(
  "ListTrustStoresRequest",
)(
  { Marker: S.optional(S.String), MaxItems: S.optional(S.Number) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/trust-stores" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVpcOriginsRequest extends S.Class<ListVpcOriginsRequest>(
  "ListVpcOriginsRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2020-05-31/vpc-origin" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublishConnectionFunctionRequest extends S.Class<PublishConnectionFunctionRequest>(
  "PublishConnectionFunctionRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2020-05-31/connection-function/{Id}/publish",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublishFunctionRequest extends S.Class<PublishFunctionRequest>(
  "PublishFunctionRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/function/{Name}/publish" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  { ResourceArn: S.String, PolicyDocument: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/put-resource-policy" }),
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
  {
    Resource: S.String.pipe(T.HttpQuery("Resource")),
    Tags: Tags.pipe(T.HttpPayload(), T.XmlName("Tags")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/tagging?Operation=Tag" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class TestConnectionFunctionRequest extends S.Class<TestConnectionFunctionRequest>(
  "TestConnectionFunctionRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    Stage: S.optional(S.String),
    ConnectionObject: T.Blob,
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2020-05-31/connection-function/{Id}/test",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TestFunctionRequest extends S.Class<TestFunctionRequest>(
  "TestFunctionRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    Stage: S.optional(S.String),
    EventObject: T.Blob,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/function/{Name}/test" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAnycastIpListRequest extends S.Class<UpdateAnycastIpListRequest>(
  "UpdateAnycastIpListRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IpAddressType: S.optional(S.String),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/anycast-ip-list/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const HeaderList = S.Array(S.String.pipe(T.XmlName("Name")));
export class Headers extends S.Class<Headers>("Headers")({
  Quantity: S.Number,
  Items: S.optional(HeaderList),
}) {}
export class CachePolicyHeadersConfig extends S.Class<CachePolicyHeadersConfig>(
  "CachePolicyHeadersConfig",
)({ HeaderBehavior: S.String, Headers: S.optional(Headers) }) {}
export const CookieNameList = S.Array(S.String.pipe(T.XmlName("Name")));
export class CookieNames extends S.Class<CookieNames>("CookieNames")({
  Quantity: S.Number,
  Items: S.optional(CookieNameList),
}) {}
export class CachePolicyCookiesConfig extends S.Class<CachePolicyCookiesConfig>(
  "CachePolicyCookiesConfig",
)({ CookieBehavior: S.String, Cookies: S.optional(CookieNames) }) {}
export const QueryStringNamesList = S.Array(S.String.pipe(T.XmlName("Name")));
export class QueryStringNames extends S.Class<QueryStringNames>(
  "QueryStringNames",
)({ Quantity: S.Number, Items: S.optional(QueryStringNamesList) }) {}
export class CachePolicyQueryStringsConfig extends S.Class<CachePolicyQueryStringsConfig>(
  "CachePolicyQueryStringsConfig",
)({
  QueryStringBehavior: S.String,
  QueryStrings: S.optional(QueryStringNames),
}) {}
export class ParametersInCacheKeyAndForwardedToOrigin extends S.Class<ParametersInCacheKeyAndForwardedToOrigin>(
  "ParametersInCacheKeyAndForwardedToOrigin",
)({
  EnableAcceptEncodingGzip: S.Boolean,
  EnableAcceptEncodingBrotli: S.optional(S.Boolean),
  HeadersConfig: CachePolicyHeadersConfig,
  CookiesConfig: CachePolicyCookiesConfig,
  QueryStringsConfig: CachePolicyQueryStringsConfig,
}) {}
export class CachePolicyConfig extends S.Class<CachePolicyConfig>(
  "CachePolicyConfig",
)({
  Comment: S.optional(S.String),
  Name: S.String,
  DefaultTTL: S.optional(S.Number),
  MaxTTL: S.optional(S.Number),
  MinTTL: S.Number,
  ParametersInCacheKeyAndForwardedToOrigin: S.optional(
    ParametersInCacheKeyAndForwardedToOrigin,
  ),
}) {}
export class UpdateCachePolicyRequest extends S.Class<UpdateCachePolicyRequest>(
  "UpdateCachePolicyRequest",
)(
  {
    CachePolicyConfig: CachePolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("CachePolicyConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/cache-policy/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CloudFrontOriginAccessIdentityConfig extends S.Class<CloudFrontOriginAccessIdentityConfig>(
  "CloudFrontOriginAccessIdentityConfig",
)({ CallerReference: S.String, Comment: S.String }) {}
export class UpdateCloudFrontOriginAccessIdentityRequest extends S.Class<UpdateCloudFrontOriginAccessIdentityRequest>(
  "UpdateCloudFrontOriginAccessIdentityRequest",
)(
  {
    CloudFrontOriginAccessIdentityConfig:
      CloudFrontOriginAccessIdentityConfig.pipe(
        T.HttpPayload(),
        T.XmlName("CloudFrontOriginAccessIdentityConfig"),
      ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/origin-access-identity/cloudfront/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConnectionFunctionRequest extends S.Class<UpdateConnectionFunctionRequest>(
  "UpdateConnectionFunctionRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    ConnectionFunctionConfig: FunctionConfig,
    ConnectionFunctionCode: T.Blob,
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/connection-function/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConnectionGroupRequest extends S.Class<UpdateConnectionGroupRequest>(
  "UpdateConnectionGroupRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    Ipv6Enabled: S.optional(S.Boolean),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    AnycastIpListId: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/connection-group/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StagingDistributionDnsNameList = S.Array(
  S.String.pipe(T.XmlName("DnsName")),
);
export class StagingDistributionDnsNames extends S.Class<StagingDistributionDnsNames>(
  "StagingDistributionDnsNames",
)({ Quantity: S.Number, Items: S.optional(StagingDistributionDnsNameList) }) {}
export class SessionStickinessConfig extends S.Class<SessionStickinessConfig>(
  "SessionStickinessConfig",
)({ IdleTTL: S.Number, MaximumTTL: S.Number }) {}
export class ContinuousDeploymentSingleWeightConfig extends S.Class<ContinuousDeploymentSingleWeightConfig>(
  "ContinuousDeploymentSingleWeightConfig",
)({
  Weight: S.Number,
  SessionStickinessConfig: S.optional(SessionStickinessConfig),
}) {}
export class ContinuousDeploymentSingleHeaderConfig extends S.Class<ContinuousDeploymentSingleHeaderConfig>(
  "ContinuousDeploymentSingleHeaderConfig",
)({ Header: S.String, Value: S.String }) {}
export class TrafficConfig extends S.Class<TrafficConfig>("TrafficConfig")({
  SingleWeightConfig: S.optional(ContinuousDeploymentSingleWeightConfig),
  SingleHeaderConfig: S.optional(ContinuousDeploymentSingleHeaderConfig),
  Type: S.String,
}) {}
export class ContinuousDeploymentPolicyConfig extends S.Class<ContinuousDeploymentPolicyConfig>(
  "ContinuousDeploymentPolicyConfig",
)({
  StagingDistributionDnsNames: StagingDistributionDnsNames,
  Enabled: S.Boolean,
  TrafficConfig: S.optional(TrafficConfig),
}) {}
export class UpdateContinuousDeploymentPolicyRequest extends S.Class<UpdateContinuousDeploymentPolicyRequest>(
  "UpdateContinuousDeploymentPolicyRequest",
)(
  {
    ContinuousDeploymentPolicyConfig: ContinuousDeploymentPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("ContinuousDeploymentPolicyConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/continuous-deployment-policy/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AliasList = S.Array(S.String.pipe(T.XmlName("CNAME")));
export class Aliases extends S.Class<Aliases>("Aliases")({
  Quantity: S.Number,
  Items: S.optional(AliasList),
}) {}
export class OriginCustomHeader extends S.Class<OriginCustomHeader>(
  "OriginCustomHeader",
)({ HeaderName: S.String, HeaderValue: S.String }) {}
export const OriginCustomHeadersList = S.Array(
  OriginCustomHeader.pipe(T.XmlName("OriginCustomHeader")),
);
export class CustomHeaders extends S.Class<CustomHeaders>("CustomHeaders")({
  Quantity: S.Number,
  Items: S.optional(OriginCustomHeadersList),
}) {}
export class S3OriginConfig extends S.Class<S3OriginConfig>("S3OriginConfig")({
  OriginAccessIdentity: S.String,
  OriginReadTimeout: S.optional(S.Number),
}) {}
export const SslProtocolsList = S.Array(
  S.String.pipe(T.XmlName("SslProtocol")),
);
export class OriginSslProtocols extends S.Class<OriginSslProtocols>(
  "OriginSslProtocols",
)({ Quantity: S.Number, Items: SslProtocolsList }) {}
export class CustomOriginConfig extends S.Class<CustomOriginConfig>(
  "CustomOriginConfig",
)({
  HTTPPort: S.Number,
  HTTPSPort: S.Number,
  OriginProtocolPolicy: S.String,
  OriginSslProtocols: S.optional(OriginSslProtocols),
  OriginReadTimeout: S.optional(S.Number),
  OriginKeepaliveTimeout: S.optional(S.Number),
  IpAddressType: S.optional(S.String),
}) {}
export class VpcOriginConfig extends S.Class<VpcOriginConfig>(
  "VpcOriginConfig",
)({
  VpcOriginId: S.String,
  OwnerAccountId: S.optional(S.String),
  OriginReadTimeout: S.optional(S.Number),
  OriginKeepaliveTimeout: S.optional(S.Number),
}) {}
export class OriginShield extends S.Class<OriginShield>("OriginShield")({
  Enabled: S.Boolean,
  OriginShieldRegion: S.optional(S.String),
}) {}
export class Origin extends S.Class<Origin>("Origin")({
  Id: S.String,
  DomainName: S.String,
  OriginPath: S.optional(S.String),
  CustomHeaders: S.optional(CustomHeaders),
  S3OriginConfig: S.optional(S3OriginConfig),
  CustomOriginConfig: S.optional(CustomOriginConfig),
  VpcOriginConfig: S.optional(VpcOriginConfig),
  ConnectionAttempts: S.optional(S.Number),
  ConnectionTimeout: S.optional(S.Number),
  ResponseCompletionTimeout: S.optional(S.Number),
  OriginShield: S.optional(OriginShield),
  OriginAccessControlId: S.optional(S.String),
}) {}
export const OriginList = S.Array(Origin.pipe(T.XmlName("Origin")));
export class Origins extends S.Class<Origins>("Origins")({
  Quantity: S.Number,
  Items: OriginList,
}) {}
export const StatusCodeList = S.Array(S.Number.pipe(T.XmlName("StatusCode")));
export class StatusCodes extends S.Class<StatusCodes>("StatusCodes")({
  Quantity: S.Number,
  Items: StatusCodeList,
}) {}
export class OriginGroupFailoverCriteria extends S.Class<OriginGroupFailoverCriteria>(
  "OriginGroupFailoverCriteria",
)({ StatusCodes: StatusCodes }) {}
export class OriginGroupMember extends S.Class<OriginGroupMember>(
  "OriginGroupMember",
)({ OriginId: S.String }) {}
export const OriginGroupMemberList = S.Array(
  OriginGroupMember.pipe(T.XmlName("OriginGroupMember")),
);
export class OriginGroupMembers extends S.Class<OriginGroupMembers>(
  "OriginGroupMembers",
)({ Quantity: S.Number, Items: OriginGroupMemberList }) {}
export class OriginGroup extends S.Class<OriginGroup>("OriginGroup")({
  Id: S.String,
  FailoverCriteria: OriginGroupFailoverCriteria,
  Members: OriginGroupMembers,
  SelectionCriteria: S.optional(S.String),
}) {}
export const OriginGroupList = S.Array(
  OriginGroup.pipe(T.XmlName("OriginGroup")),
);
export class OriginGroups extends S.Class<OriginGroups>("OriginGroups")({
  Quantity: S.Number,
  Items: S.optional(OriginGroupList),
}) {}
export const AwsAccountNumberList = S.Array(
  S.String.pipe(T.XmlName("AwsAccountNumber")),
);
export class TrustedSigners extends S.Class<TrustedSigners>("TrustedSigners")({
  Enabled: S.Boolean,
  Quantity: S.Number,
  Items: S.optional(AwsAccountNumberList),
}) {}
export const TrustedKeyGroupIdList = S.Array(
  S.String.pipe(T.XmlName("KeyGroup")),
);
export class TrustedKeyGroups extends S.Class<TrustedKeyGroups>(
  "TrustedKeyGroups",
)({
  Enabled: S.Boolean,
  Quantity: S.Number,
  Items: S.optional(TrustedKeyGroupIdList),
}) {}
export const MethodsList = S.Array(S.String.pipe(T.XmlName("Method")));
export class CachedMethods extends S.Class<CachedMethods>("CachedMethods")({
  Quantity: S.Number,
  Items: MethodsList,
}) {}
export class AllowedMethods extends S.Class<AllowedMethods>("AllowedMethods")({
  Quantity: S.Number,
  Items: MethodsList,
  CachedMethods: S.optional(CachedMethods),
}) {}
export class LambdaFunctionAssociation extends S.Class<LambdaFunctionAssociation>(
  "LambdaFunctionAssociation",
)({
  LambdaFunctionARN: S.String,
  EventType: S.String,
  IncludeBody: S.optional(S.Boolean),
}) {}
export const LambdaFunctionAssociationList = S.Array(
  LambdaFunctionAssociation.pipe(T.XmlName("LambdaFunctionAssociation")),
);
export class LambdaFunctionAssociations extends S.Class<LambdaFunctionAssociations>(
  "LambdaFunctionAssociations",
)({ Quantity: S.Number, Items: S.optional(LambdaFunctionAssociationList) }) {}
export class FunctionAssociation extends S.Class<FunctionAssociation>(
  "FunctionAssociation",
)({ FunctionARN: S.String, EventType: S.String }) {}
export const FunctionAssociationList = S.Array(
  FunctionAssociation.pipe(T.XmlName("FunctionAssociation")),
);
export class FunctionAssociations extends S.Class<FunctionAssociations>(
  "FunctionAssociations",
)({ Quantity: S.Number, Items: S.optional(FunctionAssociationList) }) {}
export class GrpcConfig extends S.Class<GrpcConfig>("GrpcConfig")({
  Enabled: S.Boolean,
}) {}
export class CookiePreference extends S.Class<CookiePreference>(
  "CookiePreference",
)({ Forward: S.String, WhitelistedNames: S.optional(CookieNames) }) {}
export const QueryStringCacheKeysList = S.Array(
  S.String.pipe(T.XmlName("Name")),
);
export class QueryStringCacheKeys extends S.Class<QueryStringCacheKeys>(
  "QueryStringCacheKeys",
)({ Quantity: S.Number, Items: S.optional(QueryStringCacheKeysList) }) {}
export class ForwardedValues extends S.Class<ForwardedValues>(
  "ForwardedValues",
)({
  QueryString: S.Boolean,
  Cookies: CookiePreference,
  Headers: S.optional(Headers),
  QueryStringCacheKeys: S.optional(QueryStringCacheKeys),
}) {}
export class DefaultCacheBehavior extends S.Class<DefaultCacheBehavior>(
  "DefaultCacheBehavior",
)({
  TargetOriginId: S.String,
  TrustedSigners: S.optional(TrustedSigners),
  TrustedKeyGroups: S.optional(TrustedKeyGroups),
  ViewerProtocolPolicy: S.String,
  AllowedMethods: S.optional(AllowedMethods),
  SmoothStreaming: S.optional(S.Boolean),
  Compress: S.optional(S.Boolean),
  LambdaFunctionAssociations: S.optional(LambdaFunctionAssociations),
  FunctionAssociations: S.optional(FunctionAssociations),
  FieldLevelEncryptionId: S.optional(S.String),
  RealtimeLogConfigArn: S.optional(S.String),
  CachePolicyId: S.optional(S.String),
  OriginRequestPolicyId: S.optional(S.String),
  ResponseHeadersPolicyId: S.optional(S.String),
  GrpcConfig: S.optional(GrpcConfig),
  ForwardedValues: S.optional(ForwardedValues),
  MinTTL: S.optional(S.Number),
  DefaultTTL: S.optional(S.Number),
  MaxTTL: S.optional(S.Number),
}) {}
export class CacheBehavior extends S.Class<CacheBehavior>("CacheBehavior")({
  PathPattern: S.String,
  TargetOriginId: S.String,
  TrustedSigners: S.optional(TrustedSigners),
  TrustedKeyGroups: S.optional(TrustedKeyGroups),
  ViewerProtocolPolicy: S.String,
  AllowedMethods: S.optional(AllowedMethods),
  SmoothStreaming: S.optional(S.Boolean),
  Compress: S.optional(S.Boolean),
  LambdaFunctionAssociations: S.optional(LambdaFunctionAssociations),
  FunctionAssociations: S.optional(FunctionAssociations),
  FieldLevelEncryptionId: S.optional(S.String),
  RealtimeLogConfigArn: S.optional(S.String),
  CachePolicyId: S.optional(S.String),
  OriginRequestPolicyId: S.optional(S.String),
  ResponseHeadersPolicyId: S.optional(S.String),
  GrpcConfig: S.optional(GrpcConfig),
  ForwardedValues: S.optional(ForwardedValues),
  MinTTL: S.optional(S.Number),
  DefaultTTL: S.optional(S.Number),
  MaxTTL: S.optional(S.Number),
}) {}
export const CacheBehaviorList = S.Array(
  CacheBehavior.pipe(T.XmlName("CacheBehavior")),
);
export class CacheBehaviors extends S.Class<CacheBehaviors>("CacheBehaviors")({
  Quantity: S.Number,
  Items: S.optional(CacheBehaviorList),
}) {}
export class CustomErrorResponse extends S.Class<CustomErrorResponse>(
  "CustomErrorResponse",
)({
  ErrorCode: S.Number,
  ResponsePagePath: S.optional(S.String),
  ResponseCode: S.optional(S.String),
  ErrorCachingMinTTL: S.optional(S.Number),
}) {}
export const CustomErrorResponseList = S.Array(
  CustomErrorResponse.pipe(T.XmlName("CustomErrorResponse")),
);
export class CustomErrorResponses extends S.Class<CustomErrorResponses>(
  "CustomErrorResponses",
)({ Quantity: S.Number, Items: S.optional(CustomErrorResponseList) }) {}
export class LoggingConfig extends S.Class<LoggingConfig>("LoggingConfig")({
  Enabled: S.optional(S.Boolean),
  IncludeCookies: S.optional(S.Boolean),
  Bucket: S.optional(S.String),
  Prefix: S.optional(S.String),
}) {}
export class ViewerCertificate extends S.Class<ViewerCertificate>(
  "ViewerCertificate",
)({
  CloudFrontDefaultCertificate: S.optional(S.Boolean),
  IAMCertificateId: S.optional(S.String),
  ACMCertificateArn: S.optional(S.String),
  SSLSupportMethod: S.optional(S.String),
  MinimumProtocolVersion: S.optional(S.String),
  Certificate: S.optional(S.String),
  CertificateSource: S.optional(S.String),
}) {}
export const LocationList = S.Array(S.String.pipe(T.XmlName("Location")));
export class GeoRestriction extends S.Class<GeoRestriction>("GeoRestriction")({
  RestrictionType: S.String,
  Quantity: S.Number,
  Items: S.optional(LocationList),
}) {}
export class Restrictions extends S.Class<Restrictions>("Restrictions")({
  GeoRestriction: GeoRestriction,
}) {}
export class StringSchemaConfig extends S.Class<StringSchemaConfig>(
  "StringSchemaConfig",
)({
  Comment: S.optional(S.String),
  DefaultValue: S.optional(S.String),
  Required: S.Boolean,
}) {}
export class ParameterDefinitionSchema extends S.Class<ParameterDefinitionSchema>(
  "ParameterDefinitionSchema",
)({ StringSchema: S.optional(StringSchemaConfig) }) {}
export class ParameterDefinition extends S.Class<ParameterDefinition>(
  "ParameterDefinition",
)({ Name: S.String, Definition: ParameterDefinitionSchema }) {}
export const ParameterDefinitions = S.Array(ParameterDefinition);
export class TenantConfig extends S.Class<TenantConfig>("TenantConfig")({
  ParameterDefinitions: S.optional(ParameterDefinitions),
}) {}
export class TrustStoreConfig extends S.Class<TrustStoreConfig>(
  "TrustStoreConfig",
)({
  TrustStoreId: S.String,
  AdvertiseTrustStoreCaNames: S.optional(S.Boolean),
  IgnoreCertificateExpiry: S.optional(S.Boolean),
}) {}
export class ViewerMtlsConfig extends S.Class<ViewerMtlsConfig>(
  "ViewerMtlsConfig",
)({
  Mode: S.optional(S.String),
  TrustStoreConfig: S.optional(TrustStoreConfig),
}) {}
export class ConnectionFunctionAssociation extends S.Class<ConnectionFunctionAssociation>(
  "ConnectionFunctionAssociation",
)({ Id: S.String }) {}
export class DistributionConfig extends S.Class<DistributionConfig>(
  "DistributionConfig",
)({
  CallerReference: S.String,
  Aliases: S.optional(Aliases),
  DefaultRootObject: S.optional(S.String),
  Origins: Origins,
  OriginGroups: S.optional(OriginGroups),
  DefaultCacheBehavior: DefaultCacheBehavior,
  CacheBehaviors: S.optional(CacheBehaviors),
  CustomErrorResponses: S.optional(CustomErrorResponses),
  Comment: S.String,
  Logging: S.optional(LoggingConfig),
  PriceClass: S.optional(S.String),
  Enabled: S.Boolean,
  ViewerCertificate: S.optional(ViewerCertificate),
  Restrictions: S.optional(Restrictions),
  WebACLId: S.optional(S.String),
  HttpVersion: S.optional(S.String),
  IsIPV6Enabled: S.optional(S.Boolean),
  ContinuousDeploymentPolicyId: S.optional(S.String),
  Staging: S.optional(S.Boolean),
  AnycastIpListId: S.optional(S.String),
  TenantConfig: S.optional(TenantConfig),
  ConnectionMode: S.optional(S.String),
  ViewerMtlsConfig: S.optional(ViewerMtlsConfig),
  ConnectionFunctionAssociation: S.optional(ConnectionFunctionAssociation),
}) {}
export class UpdateDistributionRequest extends S.Class<UpdateDistributionRequest>(
  "UpdateDistributionRequest",
)(
  {
    DistributionConfig: DistributionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("DistributionConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/distribution/{Id}/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DomainItem extends S.Class<DomainItem>("DomainItem")({
  Domain: S.String,
}) {}
export const DomainList = S.Array(DomainItem);
export class WebAclCustomization extends S.Class<WebAclCustomization>(
  "WebAclCustomization",
)({ Action: S.String, Arn: S.optional(S.String) }) {}
export class Certificate extends S.Class<Certificate>("Certificate")({
  Arn: S.String,
}) {}
export class GeoRestrictionCustomization extends S.Class<GeoRestrictionCustomization>(
  "GeoRestrictionCustomization",
)({ RestrictionType: S.String, Locations: S.optional(LocationList) }) {}
export class Customizations extends S.Class<Customizations>("Customizations")({
  WebAcl: S.optional(WebAclCustomization),
  Certificate: S.optional(Certificate),
  GeoRestrictions: S.optional(GeoRestrictionCustomization),
}) {}
export class Parameter extends S.Class<Parameter>("Parameter")({
  Name: S.String,
  Value: S.String,
}) {}
export const Parameters = S.Array(Parameter);
export class ManagedCertificateRequest extends S.Class<ManagedCertificateRequest>(
  "ManagedCertificateRequest",
)({
  ValidationTokenHost: S.String,
  PrimaryDomainName: S.optional(S.String),
  CertificateTransparencyLoggingPreference: S.optional(S.String),
}) {}
export class UpdateDistributionTenantRequest extends S.Class<UpdateDistributionTenantRequest>(
  "UpdateDistributionTenantRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    DistributionId: S.optional(S.String),
    Domains: S.optional(DomainList),
    Customizations: S.optional(Customizations),
    Parameters: S.optional(Parameters),
    ConnectionGroupId: S.optional(S.String),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    ManagedCertificateRequest: S.optional(ManagedCertificateRequest),
    Enabled: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/distribution-tenant/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDistributionWithStagingConfigRequest extends S.Class<UpdateDistributionWithStagingConfigRequest>(
  "UpdateDistributionWithStagingConfigRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    StagingDistributionId: S.optional(S.String).pipe(
      T.HttpQuery("StagingDistributionId"),
    ),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/distribution/{Id}/promote-staging-config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DistributionResourceId extends S.Class<DistributionResourceId>(
  "DistributionResourceId",
)({
  DistributionId: S.optional(S.String),
  DistributionTenantId: S.optional(S.String),
}) {}
export class UpdateDomainAssociationRequest extends S.Class<UpdateDomainAssociationRequest>(
  "UpdateDomainAssociationRequest",
)(
  {
    Domain: S.String,
    TargetResource: DistributionResourceId,
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/domain-association" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class QueryArgProfile extends S.Class<QueryArgProfile>(
  "QueryArgProfile",
)({ QueryArg: S.String, ProfileId: S.String }) {}
export const QueryArgProfileList = S.Array(
  QueryArgProfile.pipe(T.XmlName("QueryArgProfile")),
);
export class QueryArgProfiles extends S.Class<QueryArgProfiles>(
  "QueryArgProfiles",
)({ Quantity: S.Number, Items: S.optional(QueryArgProfileList) }) {}
export class QueryArgProfileConfig extends S.Class<QueryArgProfileConfig>(
  "QueryArgProfileConfig",
)({
  ForwardWhenQueryArgProfileIsUnknown: S.Boolean,
  QueryArgProfiles: S.optional(QueryArgProfiles),
}) {}
export class ContentTypeProfile extends S.Class<ContentTypeProfile>(
  "ContentTypeProfile",
)({
  Format: S.String,
  ProfileId: S.optional(S.String),
  ContentType: S.String,
}) {}
export const ContentTypeProfileList = S.Array(
  ContentTypeProfile.pipe(T.XmlName("ContentTypeProfile")),
);
export class ContentTypeProfiles extends S.Class<ContentTypeProfiles>(
  "ContentTypeProfiles",
)({ Quantity: S.Number, Items: S.optional(ContentTypeProfileList) }) {}
export class ContentTypeProfileConfig extends S.Class<ContentTypeProfileConfig>(
  "ContentTypeProfileConfig",
)({
  ForwardWhenContentTypeIsUnknown: S.Boolean,
  ContentTypeProfiles: S.optional(ContentTypeProfiles),
}) {}
export class FieldLevelEncryptionConfig extends S.Class<FieldLevelEncryptionConfig>(
  "FieldLevelEncryptionConfig",
)({
  CallerReference: S.String,
  Comment: S.optional(S.String),
  QueryArgProfileConfig: S.optional(QueryArgProfileConfig),
  ContentTypeProfileConfig: S.optional(ContentTypeProfileConfig),
}) {}
export class UpdateFieldLevelEncryptionConfigRequest extends S.Class<UpdateFieldLevelEncryptionConfigRequest>(
  "UpdateFieldLevelEncryptionConfigRequest",
)(
  {
    FieldLevelEncryptionConfig: FieldLevelEncryptionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("FieldLevelEncryptionConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/field-level-encryption/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FieldPatternList = S.Array(
  S.String.pipe(T.XmlName("FieldPattern")),
);
export class FieldPatterns extends S.Class<FieldPatterns>("FieldPatterns")({
  Quantity: S.Number,
  Items: S.optional(FieldPatternList),
}) {}
export class EncryptionEntity extends S.Class<EncryptionEntity>(
  "EncryptionEntity",
)({
  PublicKeyId: S.String,
  ProviderId: S.String,
  FieldPatterns: FieldPatterns,
}) {}
export const EncryptionEntityList = S.Array(
  EncryptionEntity.pipe(T.XmlName("EncryptionEntity")),
);
export class EncryptionEntities extends S.Class<EncryptionEntities>(
  "EncryptionEntities",
)({ Quantity: S.Number, Items: S.optional(EncryptionEntityList) }) {}
export class FieldLevelEncryptionProfileConfig extends S.Class<FieldLevelEncryptionProfileConfig>(
  "FieldLevelEncryptionProfileConfig",
)({
  Name: S.String,
  CallerReference: S.String,
  Comment: S.optional(S.String),
  EncryptionEntities: EncryptionEntities,
}) {}
export class UpdateFieldLevelEncryptionProfileRequest extends S.Class<UpdateFieldLevelEncryptionProfileRequest>(
  "UpdateFieldLevelEncryptionProfileRequest",
)(
  {
    FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig.pipe(
      T.HttpPayload(),
      T.XmlName("FieldLevelEncryptionProfileConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/field-level-encryption-profile/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFunctionRequest extends S.Class<UpdateFunctionRequest>(
  "UpdateFunctionRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    FunctionConfig: FunctionConfig,
    FunctionCode: T.Blob,
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/function/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const PublicKeyIdList = S.Array(S.String.pipe(T.XmlName("PublicKey")));
export class KeyGroupConfig extends S.Class<KeyGroupConfig>("KeyGroupConfig")({
  Name: S.String,
  Items: PublicKeyIdList,
  Comment: S.optional(S.String),
}) {}
export class UpdateKeyGroupRequest extends S.Class<UpdateKeyGroupRequest>(
  "UpdateKeyGroupRequest",
)(
  {
    KeyGroupConfig: KeyGroupConfig.pipe(
      T.HttpPayload(),
      T.XmlName("KeyGroupConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/key-group/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateKeyValueStoreRequest extends S.Class<UpdateKeyValueStoreRequest>(
  "UpdateKeyValueStoreRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    Comment: S.String,
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/key-value-store/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class OriginAccessControlConfig extends S.Class<OriginAccessControlConfig>(
  "OriginAccessControlConfig",
)({
  Name: S.String,
  Description: S.optional(S.String),
  SigningProtocol: S.String,
  SigningBehavior: S.String,
  OriginAccessControlOriginType: S.String,
}) {}
export class UpdateOriginAccessControlRequest extends S.Class<UpdateOriginAccessControlRequest>(
  "UpdateOriginAccessControlRequest",
)(
  {
    OriginAccessControlConfig: OriginAccessControlConfig.pipe(
      T.HttpPayload(),
      T.XmlName("OriginAccessControlConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/origin-access-control/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class OriginRequestPolicyHeadersConfig extends S.Class<OriginRequestPolicyHeadersConfig>(
  "OriginRequestPolicyHeadersConfig",
)({ HeaderBehavior: S.String, Headers: S.optional(Headers) }) {}
export class OriginRequestPolicyCookiesConfig extends S.Class<OriginRequestPolicyCookiesConfig>(
  "OriginRequestPolicyCookiesConfig",
)({ CookieBehavior: S.String, Cookies: S.optional(CookieNames) }) {}
export class OriginRequestPolicyQueryStringsConfig extends S.Class<OriginRequestPolicyQueryStringsConfig>(
  "OriginRequestPolicyQueryStringsConfig",
)({
  QueryStringBehavior: S.String,
  QueryStrings: S.optional(QueryStringNames),
}) {}
export class OriginRequestPolicyConfig extends S.Class<OriginRequestPolicyConfig>(
  "OriginRequestPolicyConfig",
)({
  Comment: S.optional(S.String),
  Name: S.String,
  HeadersConfig: OriginRequestPolicyHeadersConfig,
  CookiesConfig: OriginRequestPolicyCookiesConfig,
  QueryStringsConfig: OriginRequestPolicyQueryStringsConfig,
}) {}
export class UpdateOriginRequestPolicyRequest extends S.Class<UpdateOriginRequestPolicyRequest>(
  "UpdateOriginRequestPolicyRequest",
)(
  {
    OriginRequestPolicyConfig: OriginRequestPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("OriginRequestPolicyConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/origin-request-policy/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublicKeyConfig extends S.Class<PublicKeyConfig>(
  "PublicKeyConfig",
)({
  CallerReference: S.String,
  Name: S.String,
  EncodedKey: S.String,
  Comment: S.optional(S.String),
}) {}
export class UpdatePublicKeyRequest extends S.Class<UpdatePublicKeyRequest>(
  "UpdatePublicKeyRequest",
)(
  {
    PublicKeyConfig: PublicKeyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("PublicKeyConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/public-key/{Id}/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class KinesisStreamConfig extends S.Class<KinesisStreamConfig>(
  "KinesisStreamConfig",
)({ RoleARN: S.String, StreamARN: S.String }) {}
export class EndPoint extends S.Class<EndPoint>("EndPoint")({
  StreamType: S.String,
  KinesisStreamConfig: S.optional(KinesisStreamConfig),
}) {}
export const EndPointList = S.Array(EndPoint);
export class UpdateRealtimeLogConfigRequest extends S.Class<UpdateRealtimeLogConfigRequest>(
  "UpdateRealtimeLogConfigRequest",
)(
  {
    EndPoints: S.optional(EndPointList),
    Fields: S.optional(FieldList),
    Name: S.optional(S.String),
    ARN: S.optional(S.String),
    SamplingRate: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/realtime-log-config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AccessControlAllowOriginsList = S.Array(
  S.String.pipe(T.XmlName("Origin")),
);
export class ResponseHeadersPolicyAccessControlAllowOrigins extends S.Class<ResponseHeadersPolicyAccessControlAllowOrigins>(
  "ResponseHeadersPolicyAccessControlAllowOrigins",
)({ Quantity: S.Number, Items: AccessControlAllowOriginsList }) {}
export const AccessControlAllowHeadersList = S.Array(
  S.String.pipe(T.XmlName("Header")),
);
export class ResponseHeadersPolicyAccessControlAllowHeaders extends S.Class<ResponseHeadersPolicyAccessControlAllowHeaders>(
  "ResponseHeadersPolicyAccessControlAllowHeaders",
)({ Quantity: S.Number, Items: AccessControlAllowHeadersList }) {}
export const AccessControlAllowMethodsList = S.Array(
  S.String.pipe(T.XmlName("Method")),
);
export class ResponseHeadersPolicyAccessControlAllowMethods extends S.Class<ResponseHeadersPolicyAccessControlAllowMethods>(
  "ResponseHeadersPolicyAccessControlAllowMethods",
)({ Quantity: S.Number, Items: AccessControlAllowMethodsList }) {}
export const AccessControlExposeHeadersList = S.Array(
  S.String.pipe(T.XmlName("Header")),
);
export class ResponseHeadersPolicyAccessControlExposeHeaders extends S.Class<ResponseHeadersPolicyAccessControlExposeHeaders>(
  "ResponseHeadersPolicyAccessControlExposeHeaders",
)({ Quantity: S.Number, Items: S.optional(AccessControlExposeHeadersList) }) {}
export class ResponseHeadersPolicyCorsConfig extends S.Class<ResponseHeadersPolicyCorsConfig>(
  "ResponseHeadersPolicyCorsConfig",
)({
  AccessControlAllowOrigins: ResponseHeadersPolicyAccessControlAllowOrigins,
  AccessControlAllowHeaders: ResponseHeadersPolicyAccessControlAllowHeaders,
  AccessControlAllowMethods: ResponseHeadersPolicyAccessControlAllowMethods,
  AccessControlAllowCredentials: S.Boolean,
  AccessControlExposeHeaders: S.optional(
    ResponseHeadersPolicyAccessControlExposeHeaders,
  ),
  AccessControlMaxAgeSec: S.optional(S.Number),
  OriginOverride: S.Boolean,
}) {}
export class ResponseHeadersPolicyXSSProtection extends S.Class<ResponseHeadersPolicyXSSProtection>(
  "ResponseHeadersPolicyXSSProtection",
)({
  Override: S.Boolean,
  Protection: S.Boolean,
  ModeBlock: S.optional(S.Boolean),
  ReportUri: S.optional(S.String),
}) {}
export class ResponseHeadersPolicyFrameOptions extends S.Class<ResponseHeadersPolicyFrameOptions>(
  "ResponseHeadersPolicyFrameOptions",
)({ Override: S.Boolean, FrameOption: S.String }) {}
export class ResponseHeadersPolicyReferrerPolicy extends S.Class<ResponseHeadersPolicyReferrerPolicy>(
  "ResponseHeadersPolicyReferrerPolicy",
)({ Override: S.Boolean, ReferrerPolicy: S.String }) {}
export class ResponseHeadersPolicyContentSecurityPolicy extends S.Class<ResponseHeadersPolicyContentSecurityPolicy>(
  "ResponseHeadersPolicyContentSecurityPolicy",
)({ Override: S.Boolean, ContentSecurityPolicy: S.String }) {}
export class ResponseHeadersPolicyContentTypeOptions extends S.Class<ResponseHeadersPolicyContentTypeOptions>(
  "ResponseHeadersPolicyContentTypeOptions",
)({ Override: S.Boolean }) {}
export class ResponseHeadersPolicyStrictTransportSecurity extends S.Class<ResponseHeadersPolicyStrictTransportSecurity>(
  "ResponseHeadersPolicyStrictTransportSecurity",
)({
  Override: S.Boolean,
  IncludeSubdomains: S.optional(S.Boolean),
  Preload: S.optional(S.Boolean),
  AccessControlMaxAgeSec: S.Number,
}) {}
export class ResponseHeadersPolicySecurityHeadersConfig extends S.Class<ResponseHeadersPolicySecurityHeadersConfig>(
  "ResponseHeadersPolicySecurityHeadersConfig",
)({
  XSSProtection: S.optional(ResponseHeadersPolicyXSSProtection),
  FrameOptions: S.optional(ResponseHeadersPolicyFrameOptions),
  ReferrerPolicy: S.optional(ResponseHeadersPolicyReferrerPolicy),
  ContentSecurityPolicy: S.optional(ResponseHeadersPolicyContentSecurityPolicy),
  ContentTypeOptions: S.optional(ResponseHeadersPolicyContentTypeOptions),
  StrictTransportSecurity: S.optional(
    ResponseHeadersPolicyStrictTransportSecurity,
  ),
}) {}
export class ResponseHeadersPolicyServerTimingHeadersConfig extends S.Class<ResponseHeadersPolicyServerTimingHeadersConfig>(
  "ResponseHeadersPolicyServerTimingHeadersConfig",
)({ Enabled: S.Boolean, SamplingRate: S.optional(S.Number) }) {}
export class ResponseHeadersPolicyCustomHeader extends S.Class<ResponseHeadersPolicyCustomHeader>(
  "ResponseHeadersPolicyCustomHeader",
)({ Header: S.String, Value: S.String, Override: S.Boolean }) {}
export const ResponseHeadersPolicyCustomHeaderList = S.Array(
  ResponseHeadersPolicyCustomHeader.pipe(
    T.XmlName("ResponseHeadersPolicyCustomHeader"),
  ),
);
export class ResponseHeadersPolicyCustomHeadersConfig extends S.Class<ResponseHeadersPolicyCustomHeadersConfig>(
  "ResponseHeadersPolicyCustomHeadersConfig",
)({
  Quantity: S.Number,
  Items: S.optional(ResponseHeadersPolicyCustomHeaderList),
}) {}
export class ResponseHeadersPolicyRemoveHeader extends S.Class<ResponseHeadersPolicyRemoveHeader>(
  "ResponseHeadersPolicyRemoveHeader",
)({ Header: S.String }) {}
export const ResponseHeadersPolicyRemoveHeaderList = S.Array(
  ResponseHeadersPolicyRemoveHeader.pipe(
    T.XmlName("ResponseHeadersPolicyRemoveHeader"),
  ),
);
export class ResponseHeadersPolicyRemoveHeadersConfig extends S.Class<ResponseHeadersPolicyRemoveHeadersConfig>(
  "ResponseHeadersPolicyRemoveHeadersConfig",
)({
  Quantity: S.Number,
  Items: S.optional(ResponseHeadersPolicyRemoveHeaderList),
}) {}
export class ResponseHeadersPolicyConfig extends S.Class<ResponseHeadersPolicyConfig>(
  "ResponseHeadersPolicyConfig",
)({
  Comment: S.optional(S.String),
  Name: S.String,
  CorsConfig: S.optional(ResponseHeadersPolicyCorsConfig),
  SecurityHeadersConfig: S.optional(ResponseHeadersPolicySecurityHeadersConfig),
  ServerTimingHeadersConfig: S.optional(
    ResponseHeadersPolicyServerTimingHeadersConfig,
  ),
  CustomHeadersConfig: S.optional(ResponseHeadersPolicyCustomHeadersConfig),
  RemoveHeadersConfig: S.optional(ResponseHeadersPolicyRemoveHeadersConfig),
}) {}
export class UpdateResponseHeadersPolicyRequest extends S.Class<UpdateResponseHeadersPolicyRequest>(
  "UpdateResponseHeadersPolicyRequest",
)(
  {
    ResponseHeadersPolicyConfig: ResponseHeadersPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("ResponseHeadersPolicyConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/response-headers-policy/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3Origin extends S.Class<S3Origin>("S3Origin")({
  DomainName: S.String,
  OriginAccessIdentity: S.String,
}) {}
export class StreamingLoggingConfig extends S.Class<StreamingLoggingConfig>(
  "StreamingLoggingConfig",
)({ Enabled: S.Boolean, Bucket: S.String, Prefix: S.String }) {}
export class StreamingDistributionConfig extends S.Class<StreamingDistributionConfig>(
  "StreamingDistributionConfig",
)({
  CallerReference: S.String,
  S3Origin: S3Origin,
  Aliases: S.optional(Aliases),
  Comment: S.String,
  Logging: S.optional(StreamingLoggingConfig),
  TrustedSigners: TrustedSigners,
  PriceClass: S.optional(S.String),
  Enabled: S.Boolean,
}) {}
export class UpdateStreamingDistributionRequest extends S.Class<UpdateStreamingDistributionRequest>(
  "UpdateStreamingDistributionRequest",
)(
  {
    StreamingDistributionConfig: StreamingDistributionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("StreamingDistributionConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2020-05-31/streaming-distribution/{Id}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CaCertificatesBundleS3Location extends S.Class<CaCertificatesBundleS3Location>(
  "CaCertificatesBundleS3Location",
)({
  Bucket: S.String,
  Key: S.String,
  Region: S.String,
  Version: S.optional(S.String),
}) {}
export const CaCertificatesBundleSource = S.Union(
  S.Struct({ CaCertificatesBundleS3Location: CaCertificatesBundleS3Location }),
);
export class UpdateTrustStoreRequest extends S.Class<UpdateTrustStoreRequest>(
  "UpdateTrustStoreRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    CaCertificatesBundleSource: CaCertificatesBundleSource.pipe(
      T.HttpPayload(),
    ),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/trust-store/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VpcOriginEndpointConfig extends S.Class<VpcOriginEndpointConfig>(
  "VpcOriginEndpointConfig",
)({
  Name: S.String,
  Arn: S.String,
  HTTPPort: S.Number,
  HTTPSPort: S.Number,
  OriginProtocolPolicy: S.String,
  OriginSslProtocols: S.optional(OriginSslProtocols),
}) {}
export class UpdateVpcOriginRequest extends S.Class<UpdateVpcOriginRequest>(
  "UpdateVpcOriginRequest",
)(
  {
    VpcOriginEndpointConfig: VpcOriginEndpointConfig.pipe(
      T.HttpPayload(),
      T.XmlName("VpcOriginEndpointConfig"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2020-05-31/vpc-origin/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VerifyDnsConfigurationRequest extends S.Class<VerifyDnsConfigurationRequest>(
  "VerifyDnsConfigurationRequest",
)(
  { Domain: S.optional(S.String), Identifier: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/verify-dns-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagKeyList = S.Array(S.String.pipe(T.XmlName("Key")));
export class IpamCidrConfig extends S.Class<IpamCidrConfig>("IpamCidrConfig")({
  Cidr: S.String,
  IpamPoolArn: S.String,
  AnycastIp: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const IpamCidrConfigList = S.Array(
  IpamCidrConfig.pipe(T.XmlName("IpamCidrConfig")),
);
export class DistributionConfigWithTags extends S.Class<DistributionConfigWithTags>(
  "DistributionConfigWithTags",
)({ DistributionConfig: DistributionConfig, Tags: Tags }) {}
export class ImportSource extends S.Class<ImportSource>("ImportSource")({
  SourceType: S.String,
  SourceARN: S.String,
}) {}
export class StreamingDistributionConfigWithTags extends S.Class<StreamingDistributionConfigWithTags>(
  "StreamingDistributionConfigWithTags",
)({ StreamingDistributionConfig: StreamingDistributionConfig, Tags: Tags }) {}
export class ConnectionFunctionSummary extends S.Class<ConnectionFunctionSummary>(
  "ConnectionFunctionSummary",
)({
  Name: S.String,
  Id: S.String,
  ConnectionFunctionConfig: FunctionConfig,
  ConnectionFunctionArn: S.String,
  Status: S.String,
  Stage: S.String,
  CreatedTime: S.Date,
  LastModifiedTime: S.Date,
}) {}
export const ConnectionFunctionSummaryList = S.Array(
  ConnectionFunctionSummary.pipe(T.XmlName("ConnectionFunctionSummary")),
);
export class ConnectionGroupAssociationFilter extends S.Class<ConnectionGroupAssociationFilter>(
  "ConnectionGroupAssociationFilter",
)({ AnycastIpListId: S.optional(S.String) }) {}
export class DistributionTenantAssociationFilter extends S.Class<DistributionTenantAssociationFilter>(
  "DistributionTenantAssociationFilter",
)({
  DistributionId: S.optional(S.String),
  ConnectionGroupId: S.optional(S.String),
}) {}
export class TagKeys extends S.Class<TagKeys>("TagKeys")({
  Items: S.optional(TagKeyList),
}) {}
export class AssociateDistributionTenantWebACLResult extends S.Class<AssociateDistributionTenantWebACLResult>(
  "AssociateDistributionTenantWebACLResult",
)(
  {
    Id: S.optional(S.String),
    WebACLArn: S.optional(S.String),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class AssociateDistributionWebACLResult extends S.Class<AssociateDistributionWebACLResult>(
  "AssociateDistributionWebACLResult",
)(
  {
    Id: S.optional(S.String),
    WebACLArn: S.optional(S.String),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateCloudFrontOriginAccessIdentityRequest extends S.Class<CreateCloudFrontOriginAccessIdentityRequest>(
  "CreateCloudFrontOriginAccessIdentityRequest",
)(
  {
    CloudFrontOriginAccessIdentityConfig:
      CloudFrontOriginAccessIdentityConfig.pipe(
        T.HttpPayload(),
        T.XmlName("CloudFrontOriginAccessIdentityConfig"),
      ),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2020-05-31/origin-access-identity/cloudfront",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDistributionWithTagsRequest extends S.Class<CreateDistributionWithTagsRequest>(
  "CreateDistributionWithTagsRequest",
)(
  {
    DistributionConfigWithTags: DistributionConfigWithTags.pipe(
      T.HttpPayload(),
      T.XmlName("DistributionConfigWithTags"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/distribution?WithTags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKeyGroupRequest extends S.Class<CreateKeyGroupRequest>(
  "CreateKeyGroupRequest",
)(
  {
    KeyGroupConfig: KeyGroupConfig.pipe(
      T.HttpPayload(),
      T.XmlName("KeyGroupConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/key-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKeyValueStoreRequest extends S.Class<CreateKeyValueStoreRequest>(
  "CreateKeyValueStoreRequest",
)(
  {
    Name: S.String,
    Comment: S.optional(S.String),
    ImportSource: S.optional(ImportSource),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/key-value-store" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateOriginAccessControlRequest extends S.Class<CreateOriginAccessControlRequest>(
  "CreateOriginAccessControlRequest",
)(
  {
    OriginAccessControlConfig: OriginAccessControlConfig.pipe(
      T.HttpPayload(),
      T.XmlName("OriginAccessControlConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/origin-access-control" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePublicKeyRequest extends S.Class<CreatePublicKeyRequest>(
  "CreatePublicKeyRequest",
)(
  {
    PublicKeyConfig: PublicKeyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("PublicKeyConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/public-key" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateStreamingDistributionWithTagsRequest extends S.Class<CreateStreamingDistributionWithTagsRequest>(
  "CreateStreamingDistributionWithTagsRequest",
)(
  {
    StreamingDistributionConfigWithTags:
      StreamingDistributionConfigWithTags.pipe(
        T.HttpPayload(),
        T.XmlName("StreamingDistributionConfigWithTags"),
      ),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2020-05-31/streaming-distribution?WithTags",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class FunctionMetadata extends S.Class<FunctionMetadata>(
  "FunctionMetadata",
)({
  FunctionARN: S.String,
  Stage: S.optional(S.String),
  CreatedTime: S.optional(S.Date),
  LastModifiedTime: S.Date,
}) {}
export class FunctionSummary extends S.Class<FunctionSummary>(
  "FunctionSummary",
)({
  Name: S.String,
  Status: S.optional(S.String),
  FunctionConfig: FunctionConfig,
  FunctionMetadata: FunctionMetadata,
}) {}
export class DescribeFunctionResult extends S.Class<DescribeFunctionResult>(
  "DescribeFunctionResult",
)(
  {
    FunctionSummary: S.optional(FunctionSummary).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class DisassociateDistributionTenantWebACLResult extends S.Class<DisassociateDistributionTenantWebACLResult>(
  "DisassociateDistributionTenantWebACLResult",
)(
  {
    Id: S.optional(S.String),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class DisassociateDistributionWebACLResult extends S.Class<DisassociateDistributionWebACLResult>(
  "DisassociateDistributionWebACLResult",
)(
  {
    Id: S.optional(S.String),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetCachePolicyConfigResult extends S.Class<GetCachePolicyConfigResult>(
  "GetCachePolicyConfigResult",
)(
  {
    CachePolicyConfig: S.optional(CachePolicyConfig).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetCloudFrontOriginAccessIdentityConfigResult extends S.Class<GetCloudFrontOriginAccessIdentityConfigResult>(
  "GetCloudFrontOriginAccessIdentityConfigResult",
)(
  {
    CloudFrontOriginAccessIdentityConfig: S.optional(
      CloudFrontOriginAccessIdentityConfig,
    ).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetConnectionFunctionResult extends S.Class<GetConnectionFunctionResult>(
  "GetConnectionFunctionResult",
)(
  {
    ConnectionFunctionCode: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  },
  ns,
) {}
export class ConnectionGroup extends S.Class<ConnectionGroup>(
  "ConnectionGroup",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  CreatedTime: S.optional(S.Date),
  LastModifiedTime: S.optional(S.Date),
  Tags: S.optional(Tags),
  Ipv6Enabled: S.optional(S.Boolean),
  RoutingEndpoint: S.optional(S.String),
  AnycastIpListId: S.optional(S.String),
  Status: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  IsDefault: S.optional(S.Boolean),
}) {}
export class GetConnectionGroupResult extends S.Class<GetConnectionGroupResult>(
  "GetConnectionGroupResult",
)(
  {
    ConnectionGroup: S.optional(ConnectionGroup).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetConnectionGroupByRoutingEndpointResult extends S.Class<GetConnectionGroupByRoutingEndpointResult>(
  "GetConnectionGroupByRoutingEndpointResult",
)(
  {
    ConnectionGroup: S.optional(ConnectionGroup).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetContinuousDeploymentPolicyConfigResult extends S.Class<GetContinuousDeploymentPolicyConfigResult>(
  "GetContinuousDeploymentPolicyConfigResult",
)(
  {
    ContinuousDeploymentPolicyConfig: S.optional(
      ContinuousDeploymentPolicyConfig,
    ).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export const KeyPairIdList = S.Array(S.String.pipe(T.XmlName("KeyPairId")));
export class KeyPairIds extends S.Class<KeyPairIds>("KeyPairIds")({
  Quantity: S.Number,
  Items: S.optional(KeyPairIdList),
}) {}
export class Signer extends S.Class<Signer>("Signer")({
  AwsAccountNumber: S.optional(S.String),
  KeyPairIds: S.optional(KeyPairIds),
}) {}
export const SignerList = S.Array(Signer.pipe(T.XmlName("Signer")));
export class ActiveTrustedSigners extends S.Class<ActiveTrustedSigners>(
  "ActiveTrustedSigners",
)({ Enabled: S.Boolean, Quantity: S.Number, Items: S.optional(SignerList) }) {}
export class KGKeyPairIds extends S.Class<KGKeyPairIds>("KGKeyPairIds")({
  KeyGroupId: S.optional(S.String),
  KeyPairIds: S.optional(KeyPairIds),
}) {}
export const KGKeyPairIdsList = S.Array(
  KGKeyPairIds.pipe(T.XmlName("KeyGroup")),
);
export class ActiveTrustedKeyGroups extends S.Class<ActiveTrustedKeyGroups>(
  "ActiveTrustedKeyGroups",
)({
  Enabled: S.Boolean,
  Quantity: S.Number,
  Items: S.optional(KGKeyPairIdsList),
}) {}
export class AliasICPRecordal extends S.Class<AliasICPRecordal>(
  "AliasICPRecordal",
)({ CNAME: S.optional(S.String), ICPRecordalStatus: S.optional(S.String) }) {}
export const AliasICPRecordals = S.Array(
  AliasICPRecordal.pipe(T.XmlName("AliasICPRecordal")),
);
export class Distribution extends S.Class<Distribution>("Distribution")({
  Id: S.String,
  ARN: S.String,
  Status: S.String,
  LastModifiedTime: S.Date,
  InProgressInvalidationBatches: S.Number,
  DomainName: S.String,
  ActiveTrustedSigners: S.optional(ActiveTrustedSigners),
  ActiveTrustedKeyGroups: S.optional(ActiveTrustedKeyGroups),
  DistributionConfig: DistributionConfig,
  AliasICPRecordals: S.optional(AliasICPRecordals),
}) {}
export class GetDistributionResult extends S.Class<GetDistributionResult>(
  "GetDistributionResult",
)(
  {
    Distribution: S.optional(Distribution).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetDistributionConfigResult extends S.Class<GetDistributionConfigResult>(
  "GetDistributionConfigResult",
)(
  {
    DistributionConfig: S.optional(DistributionConfig).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class DomainResult extends S.Class<DomainResult>("DomainResult")({
  Domain: S.String,
  Status: S.optional(S.String),
}) {}
export const DomainResultList = S.Array(DomainResult);
export class DistributionTenant extends S.Class<DistributionTenant>(
  "DistributionTenant",
)({
  Id: S.optional(S.String),
  DistributionId: S.optional(S.String),
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  Domains: S.optional(DomainResultList),
  Tags: S.optional(Tags),
  Customizations: S.optional(Customizations),
  Parameters: S.optional(Parameters),
  ConnectionGroupId: S.optional(S.String),
  CreatedTime: S.optional(S.Date),
  LastModifiedTime: S.optional(S.Date),
  Enabled: S.optional(S.Boolean),
  Status: S.optional(S.String),
}) {}
export class GetDistributionTenantByDomainResult extends S.Class<GetDistributionTenantByDomainResult>(
  "GetDistributionTenantByDomainResult",
)(
  {
    DistributionTenant: S.optional(DistributionTenant).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetFieldLevelEncryptionConfigResult extends S.Class<GetFieldLevelEncryptionConfigResult>(
  "GetFieldLevelEncryptionConfigResult",
)(
  {
    FieldLevelEncryptionConfig: S.optional(FieldLevelEncryptionConfig).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetFieldLevelEncryptionProfileConfigResult extends S.Class<GetFieldLevelEncryptionProfileConfigResult>(
  "GetFieldLevelEncryptionProfileConfigResult",
)(
  {
    FieldLevelEncryptionProfileConfig: S.optional(
      FieldLevelEncryptionProfileConfig,
    ).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetFunctionResult extends S.Class<GetFunctionResult>(
  "GetFunctionResult",
)(
  {
    FunctionCode: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  },
  ns,
) {}
export class Invalidation extends S.Class<Invalidation>("Invalidation")({
  Id: S.String,
  Status: S.String,
  CreateTime: S.Date,
  InvalidationBatch: InvalidationBatch,
}) {}
export class GetInvalidationResult extends S.Class<GetInvalidationResult>(
  "GetInvalidationResult",
)({ Invalidation: S.optional(Invalidation).pipe(T.HttpPayload()) }, ns) {}
export class GetInvalidationForDistributionTenantResult extends S.Class<GetInvalidationForDistributionTenantResult>(
  "GetInvalidationForDistributionTenantResult",
)({ Invalidation: S.optional(Invalidation).pipe(T.HttpPayload()) }, ns) {}
export class GetKeyGroupConfigResult extends S.Class<GetKeyGroupConfigResult>(
  "GetKeyGroupConfigResult",
)(
  {
    KeyGroupConfig: S.optional(KeyGroupConfig).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class RealtimeMetricsSubscriptionConfig extends S.Class<RealtimeMetricsSubscriptionConfig>(
  "RealtimeMetricsSubscriptionConfig",
)({ RealtimeMetricsSubscriptionStatus: S.String }) {}
export class MonitoringSubscription extends S.Class<MonitoringSubscription>(
  "MonitoringSubscription",
)({
  RealtimeMetricsSubscriptionConfig: S.optional(
    RealtimeMetricsSubscriptionConfig,
  ),
}) {}
export class GetMonitoringSubscriptionResult extends S.Class<GetMonitoringSubscriptionResult>(
  "GetMonitoringSubscriptionResult",
)(
  {
    MonitoringSubscription: S.optional(MonitoringSubscription).pipe(
      T.HttpPayload(),
    ),
  },
  ns,
) {}
export class GetOriginAccessControlConfigResult extends S.Class<GetOriginAccessControlConfigResult>(
  "GetOriginAccessControlConfigResult",
)(
  {
    OriginAccessControlConfig: S.optional(OriginAccessControlConfig).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetOriginRequestPolicyConfigResult extends S.Class<GetOriginRequestPolicyConfigResult>(
  "GetOriginRequestPolicyConfigResult",
)(
  {
    OriginRequestPolicyConfig: S.optional(OriginRequestPolicyConfig).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetPublicKeyConfigResult extends S.Class<GetPublicKeyConfigResult>(
  "GetPublicKeyConfigResult",
)(
  {
    PublicKeyConfig: S.optional(PublicKeyConfig).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetResourcePolicyResult extends S.Class<GetResourcePolicyResult>(
  "GetResourcePolicyResult",
)(
  { ResourceArn: S.optional(S.String), PolicyDocument: S.optional(S.String) },
  ns,
) {}
export class GetResponseHeadersPolicyConfigResult extends S.Class<GetResponseHeadersPolicyConfigResult>(
  "GetResponseHeadersPolicyConfigResult",
)(
  {
    ResponseHeadersPolicyConfig: S.optional(ResponseHeadersPolicyConfig).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetStreamingDistributionConfigResult extends S.Class<GetStreamingDistributionConfigResult>(
  "GetStreamingDistributionConfigResult",
)(
  {
    StreamingDistributionConfig: S.optional(StreamingDistributionConfig).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class VpcOrigin extends S.Class<VpcOrigin>("VpcOrigin")({
  Id: S.String,
  Arn: S.String,
  AccountId: S.optional(S.String),
  Status: S.String,
  CreatedTime: S.Date,
  LastModifiedTime: S.Date,
  VpcOriginEndpointConfig: VpcOriginEndpointConfig,
}) {}
export class GetVpcOriginResult extends S.Class<GetVpcOriginResult>(
  "GetVpcOriginResult",
)(
  {
    VpcOrigin: S.optional(VpcOrigin).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class ListConnectionFunctionsResult extends S.Class<ListConnectionFunctionsResult>(
  "ListConnectionFunctionsResult",
)(
  {
    NextMarker: S.optional(S.String),
    ConnectionFunctions: S.optional(ConnectionFunctionSummaryList),
  },
  ns,
) {}
export class ListConnectionGroupsRequest extends S.Class<ListConnectionGroupsRequest>(
  "ListConnectionGroupsRequest",
)(
  {
    AssociationFilter: S.optional(ConnectionGroupAssociationFilter),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/connection-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DistributionSummary extends S.Class<DistributionSummary>(
  "DistributionSummary",
)({
  Id: S.String,
  ARN: S.String,
  ETag: S.optional(S.String),
  Status: S.String,
  LastModifiedTime: S.Date,
  DomainName: S.String,
  Aliases: Aliases,
  Origins: Origins,
  OriginGroups: S.optional(OriginGroups),
  DefaultCacheBehavior: DefaultCacheBehavior,
  CacheBehaviors: CacheBehaviors,
  CustomErrorResponses: CustomErrorResponses,
  Comment: S.String,
  PriceClass: S.String,
  Enabled: S.Boolean,
  ViewerCertificate: ViewerCertificate,
  Restrictions: Restrictions,
  WebACLId: S.String,
  HttpVersion: S.String,
  IsIPV6Enabled: S.Boolean,
  AliasICPRecordals: S.optional(AliasICPRecordals),
  Staging: S.Boolean,
  ConnectionMode: S.optional(S.String),
  AnycastIpListId: S.optional(S.String),
  ViewerMtlsConfig: S.optional(ViewerMtlsConfig),
  ConnectionFunctionAssociation: S.optional(ConnectionFunctionAssociation),
}) {}
export const DistributionSummaryList = S.Array(
  DistributionSummary.pipe(T.XmlName("DistributionSummary")),
);
export class DistributionList extends S.Class<DistributionList>(
  "DistributionList",
)({
  Marker: S.String,
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  IsTruncated: S.Boolean,
  Quantity: S.Number,
  Items: S.optional(DistributionSummaryList),
}) {}
export class ListDistributionsByAnycastIpListIdResult extends S.Class<ListDistributionsByAnycastIpListIdResult>(
  "ListDistributionsByAnycastIpListIdResult",
)(
  { DistributionList: S.optional(DistributionList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListDistributionsByConnectionFunctionResult extends S.Class<ListDistributionsByConnectionFunctionResult>(
  "ListDistributionsByConnectionFunctionResult",
)(
  { DistributionList: S.optional(DistributionList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListDistributionsByConnectionModeResult extends S.Class<ListDistributionsByConnectionModeResult>(
  "ListDistributionsByConnectionModeResult",
)(
  { DistributionList: S.optional(DistributionList).pipe(T.HttpPayload()) },
  ns,
) {}
export const DistributionIdListSummary = S.Array(
  S.String.pipe(T.XmlName("DistributionId")),
);
export class DistributionIdList extends S.Class<DistributionIdList>(
  "DistributionIdList",
)({
  Marker: S.String,
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  IsTruncated: S.Boolean,
  Quantity: S.Number,
  Items: S.optional(DistributionIdListSummary),
}) {}
export class ListDistributionsByKeyGroupResult extends S.Class<ListDistributionsByKeyGroupResult>(
  "ListDistributionsByKeyGroupResult",
)(
  { DistributionIdList: S.optional(DistributionIdList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListDistributionsByOriginRequestPolicyIdResult extends S.Class<ListDistributionsByOriginRequestPolicyIdResult>(
  "ListDistributionsByOriginRequestPolicyIdResult",
)(
  { DistributionIdList: S.optional(DistributionIdList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListDistributionsByRealtimeLogConfigResult extends S.Class<ListDistributionsByRealtimeLogConfigResult>(
  "ListDistributionsByRealtimeLogConfigResult",
)(
  { DistributionList: S.optional(DistributionList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListDistributionsByResponseHeadersPolicyIdResult extends S.Class<ListDistributionsByResponseHeadersPolicyIdResult>(
  "ListDistributionsByResponseHeadersPolicyIdResult",
)(
  { DistributionIdList: S.optional(DistributionIdList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListDistributionsByTrustStoreResult extends S.Class<ListDistributionsByTrustStoreResult>(
  "ListDistributionsByTrustStoreResult",
)(
  { DistributionList: S.optional(DistributionList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListDistributionsByVpcOriginIdResult extends S.Class<ListDistributionsByVpcOriginIdResult>(
  "ListDistributionsByVpcOriginIdResult",
)(
  { DistributionIdList: S.optional(DistributionIdList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListDistributionsByWebACLIdResult extends S.Class<ListDistributionsByWebACLIdResult>(
  "ListDistributionsByWebACLIdResult",
)(
  { DistributionList: S.optional(DistributionList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListDistributionTenantsRequest extends S.Class<ListDistributionTenantsRequest>(
  "ListDistributionTenantsRequest",
)(
  {
    AssociationFilter: S.optional(DistributionTenantAssociationFilter),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/distribution-tenants" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainConflictsRequest extends S.Class<ListDomainConflictsRequest>(
  "ListDomainConflictsRequest",
)(
  {
    Domain: S.String,
    DomainControlValidationResource: DistributionResourceId,
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/domain-conflicts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvalidationSummary extends S.Class<InvalidationSummary>(
  "InvalidationSummary",
)({ Id: S.String, CreateTime: S.Date, Status: S.String }) {}
export const InvalidationSummaryList = S.Array(
  InvalidationSummary.pipe(T.XmlName("InvalidationSummary")),
);
export class InvalidationList extends S.Class<InvalidationList>(
  "InvalidationList",
)({
  Marker: S.String,
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  IsTruncated: S.Boolean,
  Quantity: S.Number,
  Items: S.optional(InvalidationSummaryList),
}) {}
export class ListInvalidationsForDistributionTenantResult extends S.Class<ListInvalidationsForDistributionTenantResult>(
  "ListInvalidationsForDistributionTenantResult",
)(
  { InvalidationList: S.optional(InvalidationList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListTagsForResourceResult extends S.Class<ListTagsForResourceResult>(
  "ListTagsForResourceResult",
)({ Tags: Tags.pipe(T.HttpPayload()) }, ns) {}
export class PublishConnectionFunctionResult extends S.Class<PublishConnectionFunctionResult>(
  "PublishConnectionFunctionResult",
)(
  {
    ConnectionFunctionSummary: S.optional(ConnectionFunctionSummary).pipe(
      T.HttpPayload(),
    ),
  },
  ns,
) {}
export class PublishFunctionResult extends S.Class<PublishFunctionResult>(
  "PublishFunctionResult",
)({ FunctionSummary: S.optional(FunctionSummary).pipe(T.HttpPayload()) }, ns) {}
export class PutResourcePolicyResult extends S.Class<PutResourcePolicyResult>(
  "PutResourcePolicyResult",
)({ ResourceArn: S.optional(S.String) }, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    Resource: S.String.pipe(T.HttpQuery("Resource")),
    TagKeys: TagKeys.pipe(T.HttpPayload(), T.XmlName("TagKeys")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/tagging?Operation=Untag" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class IpamConfig extends S.Class<IpamConfig>("IpamConfig")({
  Quantity: S.Number,
  IpamCidrConfigs: IpamCidrConfigList,
}) {}
export const AnycastIps = S.Array(S.String.pipe(T.XmlName("AnycastIp")));
export class AnycastIpList extends S.Class<AnycastIpList>("AnycastIpList")({
  Id: S.String,
  Name: S.String,
  Status: S.String,
  Arn: S.String,
  IpAddressType: S.optional(S.String),
  IpamConfig: S.optional(IpamConfig),
  AnycastIps: AnycastIps,
  IpCount: S.Number,
  LastModifiedTime: S.Date,
}) {}
export class UpdateAnycastIpListResult extends S.Class<UpdateAnycastIpListResult>(
  "UpdateAnycastIpListResult",
)(
  {
    AnycastIpList: S.optional(AnycastIpList).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CachePolicy extends S.Class<CachePolicy>("CachePolicy")({
  Id: S.String,
  LastModifiedTime: S.Date,
  CachePolicyConfig: CachePolicyConfig,
}) {}
export class UpdateCachePolicyResult extends S.Class<UpdateCachePolicyResult>(
  "UpdateCachePolicyResult",
)(
  {
    CachePolicy: S.optional(CachePolicy).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CloudFrontOriginAccessIdentity extends S.Class<CloudFrontOriginAccessIdentity>(
  "CloudFrontOriginAccessIdentity",
)({
  Id: S.String,
  S3CanonicalUserId: S.String,
  CloudFrontOriginAccessIdentityConfig: S.optional(
    CloudFrontOriginAccessIdentityConfig,
  ),
}) {}
export class UpdateCloudFrontOriginAccessIdentityResult extends S.Class<UpdateCloudFrontOriginAccessIdentityResult>(
  "UpdateCloudFrontOriginAccessIdentityResult",
)(
  {
    CloudFrontOriginAccessIdentity: S.optional(
      CloudFrontOriginAccessIdentity,
    ).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class UpdateConnectionFunctionResult extends S.Class<UpdateConnectionFunctionResult>(
  "UpdateConnectionFunctionResult",
)(
  {
    ConnectionFunctionSummary: S.optional(ConnectionFunctionSummary).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class UpdateConnectionGroupResult extends S.Class<UpdateConnectionGroupResult>(
  "UpdateConnectionGroupResult",
)(
  {
    ConnectionGroup: S.optional(ConnectionGroup).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class ContinuousDeploymentPolicy extends S.Class<ContinuousDeploymentPolicy>(
  "ContinuousDeploymentPolicy",
)({
  Id: S.String,
  LastModifiedTime: S.Date,
  ContinuousDeploymentPolicyConfig: ContinuousDeploymentPolicyConfig,
}) {}
export class UpdateContinuousDeploymentPolicyResult extends S.Class<UpdateContinuousDeploymentPolicyResult>(
  "UpdateContinuousDeploymentPolicyResult",
)(
  {
    ContinuousDeploymentPolicy: S.optional(ContinuousDeploymentPolicy).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class UpdateDistributionResult extends S.Class<UpdateDistributionResult>(
  "UpdateDistributionResult",
)(
  {
    Distribution: S.optional(Distribution).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class UpdateDistributionTenantResult extends S.Class<UpdateDistributionTenantResult>(
  "UpdateDistributionTenantResult",
)(
  {
    DistributionTenant: S.optional(DistributionTenant).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class UpdateDistributionWithStagingConfigResult extends S.Class<UpdateDistributionWithStagingConfigResult>(
  "UpdateDistributionWithStagingConfigResult",
)(
  {
    Distribution: S.optional(Distribution).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class UpdateDomainAssociationResult extends S.Class<UpdateDomainAssociationResult>(
  "UpdateDomainAssociationResult",
)(
  {
    Domain: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class FieldLevelEncryption extends S.Class<FieldLevelEncryption>(
  "FieldLevelEncryption",
)({
  Id: S.String,
  LastModifiedTime: S.Date,
  FieldLevelEncryptionConfig: FieldLevelEncryptionConfig,
}) {}
export class UpdateFieldLevelEncryptionConfigResult extends S.Class<UpdateFieldLevelEncryptionConfigResult>(
  "UpdateFieldLevelEncryptionConfigResult",
)(
  {
    FieldLevelEncryption: S.optional(FieldLevelEncryption).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class FieldLevelEncryptionProfile extends S.Class<FieldLevelEncryptionProfile>(
  "FieldLevelEncryptionProfile",
)({
  Id: S.String,
  LastModifiedTime: S.Date,
  FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig,
}) {}
export class UpdateFieldLevelEncryptionProfileResult extends S.Class<UpdateFieldLevelEncryptionProfileResult>(
  "UpdateFieldLevelEncryptionProfileResult",
)(
  {
    FieldLevelEncryptionProfile: S.optional(FieldLevelEncryptionProfile).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class UpdateFunctionResult extends S.Class<UpdateFunctionResult>(
  "UpdateFunctionResult",
)(
  {
    FunctionSummary: S.optional(FunctionSummary).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETtag")),
  },
  ns,
) {}
export class KeyGroup extends S.Class<KeyGroup>("KeyGroup")({
  Id: S.String,
  LastModifiedTime: S.Date,
  KeyGroupConfig: KeyGroupConfig,
}) {}
export class UpdateKeyGroupResult extends S.Class<UpdateKeyGroupResult>(
  "UpdateKeyGroupResult",
)(
  {
    KeyGroup: S.optional(KeyGroup).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class KeyValueStore extends S.Class<KeyValueStore>("KeyValueStore")({
  Name: S.String,
  Id: S.String,
  Comment: S.String,
  ARN: S.String,
  Status: S.optional(S.String),
  LastModifiedTime: S.Date,
}) {}
export class UpdateKeyValueStoreResult extends S.Class<UpdateKeyValueStoreResult>(
  "UpdateKeyValueStoreResult",
)(
  {
    KeyValueStore: S.optional(KeyValueStore).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class OriginAccessControl extends S.Class<OriginAccessControl>(
  "OriginAccessControl",
)({
  Id: S.String,
  OriginAccessControlConfig: S.optional(OriginAccessControlConfig),
}) {}
export class UpdateOriginAccessControlResult extends S.Class<UpdateOriginAccessControlResult>(
  "UpdateOriginAccessControlResult",
)(
  {
    OriginAccessControl: S.optional(OriginAccessControl).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class OriginRequestPolicy extends S.Class<OriginRequestPolicy>(
  "OriginRequestPolicy",
)({
  Id: S.String,
  LastModifiedTime: S.Date,
  OriginRequestPolicyConfig: OriginRequestPolicyConfig,
}) {}
export class UpdateOriginRequestPolicyResult extends S.Class<UpdateOriginRequestPolicyResult>(
  "UpdateOriginRequestPolicyResult",
)(
  {
    OriginRequestPolicy: S.optional(OriginRequestPolicy).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class PublicKey extends S.Class<PublicKey>("PublicKey")({
  Id: S.String,
  CreatedTime: S.Date,
  PublicKeyConfig: PublicKeyConfig,
}) {}
export class UpdatePublicKeyResult extends S.Class<UpdatePublicKeyResult>(
  "UpdatePublicKeyResult",
)(
  {
    PublicKey: S.optional(PublicKey).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class RealtimeLogConfig extends S.Class<RealtimeLogConfig>(
  "RealtimeLogConfig",
)({
  ARN: S.String,
  Name: S.String,
  SamplingRate: S.Number,
  EndPoints: EndPointList,
  Fields: FieldList,
}) {}
export class UpdateRealtimeLogConfigResult extends S.Class<UpdateRealtimeLogConfigResult>(
  "UpdateRealtimeLogConfigResult",
)({ RealtimeLogConfig: S.optional(RealtimeLogConfig) }, ns) {}
export class ResponseHeadersPolicy extends S.Class<ResponseHeadersPolicy>(
  "ResponseHeadersPolicy",
)({
  Id: S.String,
  LastModifiedTime: S.Date,
  ResponseHeadersPolicyConfig: ResponseHeadersPolicyConfig,
}) {}
export class UpdateResponseHeadersPolicyResult extends S.Class<UpdateResponseHeadersPolicyResult>(
  "UpdateResponseHeadersPolicyResult",
)(
  {
    ResponseHeadersPolicy: S.optional(ResponseHeadersPolicy).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class StreamingDistribution extends S.Class<StreamingDistribution>(
  "StreamingDistribution",
)({
  Id: S.String,
  ARN: S.String,
  Status: S.String,
  LastModifiedTime: S.optional(S.Date),
  DomainName: S.String,
  ActiveTrustedSigners: ActiveTrustedSigners,
  StreamingDistributionConfig: StreamingDistributionConfig,
}) {}
export class UpdateStreamingDistributionResult extends S.Class<UpdateStreamingDistributionResult>(
  "UpdateStreamingDistributionResult",
)(
  {
    StreamingDistribution: S.optional(StreamingDistribution).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class TrustStore extends S.Class<TrustStore>("TrustStore")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  NumberOfCaCertificates: S.optional(S.Number),
  LastModifiedTime: S.optional(S.Date),
  Reason: S.optional(S.String),
}) {}
export class UpdateTrustStoreResult extends S.Class<UpdateTrustStoreResult>(
  "UpdateTrustStoreResult",
)(
  {
    TrustStore: S.optional(TrustStore).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class UpdateVpcOriginResult extends S.Class<UpdateVpcOriginResult>(
  "UpdateVpcOriginResult",
)(
  {
    VpcOrigin: S.optional(VpcOrigin).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export const FunctionSummaryList = S.Array(
  FunctionSummary.pipe(T.XmlName("FunctionSummary")),
);
export const KeyValueStoreSummaryList = S.Array(
  KeyValueStore.pipe(T.XmlName("KeyValueStore")),
);
export const RealtimeLogConfigList = S.Array(RealtimeLogConfig);
export const FunctionExecutionLogList = S.Array(S.String);
export class DistributionTenantSummary extends S.Class<DistributionTenantSummary>(
  "DistributionTenantSummary",
)({
  Id: S.String,
  DistributionId: S.String,
  Name: S.String,
  Arn: S.String,
  Domains: DomainResultList,
  ConnectionGroupId: S.optional(S.String),
  Customizations: S.optional(Customizations),
  CreatedTime: S.Date,
  LastModifiedTime: S.Date,
  ETag: S.String,
  Enabled: S.optional(S.Boolean),
  Status: S.optional(S.String),
}) {}
export const DistributionTenantList = S.Array(
  DistributionTenantSummary.pipe(T.XmlName("DistributionTenantSummary")),
);
export class FunctionList extends S.Class<FunctionList>("FunctionList")({
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  Quantity: S.Number,
  Items: S.optional(FunctionSummaryList),
}) {}
export class KeyValueStoreList extends S.Class<KeyValueStoreList>(
  "KeyValueStoreList",
)({
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  Quantity: S.Number,
  Items: S.optional(KeyValueStoreSummaryList),
}) {}
export class RealtimeLogConfigs extends S.Class<RealtimeLogConfigs>(
  "RealtimeLogConfigs",
)({
  MaxItems: S.Number,
  Items: S.optional(RealtimeLogConfigList),
  IsTruncated: S.Boolean,
  Marker: S.String,
  NextMarker: S.optional(S.String),
}) {}
export class TrustStoreSummary extends S.Class<TrustStoreSummary>(
  "TrustStoreSummary",
)({
  Id: S.String,
  Arn: S.String,
  Name: S.String,
  Status: S.String,
  NumberOfCaCertificates: S.Number,
  LastModifiedTime: S.Date,
  Reason: S.optional(S.String),
  ETag: S.String,
}) {}
export const TrustStoreList = S.Array(
  TrustStoreSummary.pipe(T.XmlName("TrustStoreSummary")),
);
export class ConnectionFunctionTestResult extends S.Class<ConnectionFunctionTestResult>(
  "ConnectionFunctionTestResult",
)({
  ConnectionFunctionSummary: S.optional(ConnectionFunctionSummary),
  ComputeUtilization: S.optional(S.String),
  ConnectionFunctionExecutionLogs: S.optional(FunctionExecutionLogList),
  ConnectionFunctionErrorMessage: S.optional(S.String),
  ConnectionFunctionOutput: S.optional(S.String),
}) {}
export class TestResult extends S.Class<TestResult>("TestResult")({
  FunctionSummary: S.optional(FunctionSummary),
  ComputeUtilization: S.optional(S.String),
  FunctionExecutionLogs: S.optional(FunctionExecutionLogList),
  FunctionErrorMessage: S.optional(S.String),
  FunctionOutput: S.optional(S.String),
}) {}
export class DnsConfiguration extends S.Class<DnsConfiguration>(
  "DnsConfiguration",
)({ Domain: S.String, Status: S.String, Reason: S.optional(S.String) }) {}
export const DnsConfigurationList = S.Array(
  DnsConfiguration.pipe(T.XmlName("DnsConfiguration")),
);
export class CreateAnycastIpListRequest extends S.Class<CreateAnycastIpListRequest>(
  "CreateAnycastIpListRequest",
)(
  {
    Name: S.String,
    IpCount: S.Number,
    Tags: S.optional(Tags),
    IpAddressType: S.optional(S.String),
    IpamCidrConfigs: S.optional(IpamCidrConfigList),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/anycast-ip-list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCloudFrontOriginAccessIdentityResult extends S.Class<CreateCloudFrontOriginAccessIdentityResult>(
  "CreateCloudFrontOriginAccessIdentityResult",
)(
  {
    CloudFrontOriginAccessIdentity: S.optional(
      CloudFrontOriginAccessIdentity,
    ).pipe(T.HttpPayload()),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateConnectionGroupResult extends S.Class<CreateConnectionGroupResult>(
  "CreateConnectionGroupResult",
)(
  {
    ConnectionGroup: S.optional(ConnectionGroup).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateDistributionTenantRequest extends S.Class<CreateDistributionTenantRequest>(
  "CreateDistributionTenantRequest",
)(
  {
    DistributionId: S.String,
    Name: S.String,
    Domains: DomainList,
    Tags: S.optional(Tags),
    Customizations: S.optional(Customizations),
    Parameters: S.optional(Parameters),
    ConnectionGroupId: S.optional(S.String),
    ManagedCertificateRequest: S.optional(ManagedCertificateRequest),
    Enabled: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/distribution-tenant" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDistributionWithTagsResult extends S.Class<CreateDistributionWithTagsResult>(
  "CreateDistributionWithTagsResult",
)(
  {
    Distribution: S.optional(Distribution).pipe(T.HttpPayload()),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateInvalidationRequest extends S.Class<CreateInvalidationRequest>(
  "CreateInvalidationRequest",
)(
  {
    DistributionId: S.String.pipe(T.HttpLabel()),
    InvalidationBatch: InvalidationBatch.pipe(
      T.HttpPayload(),
      T.XmlName("InvalidationBatch"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2020-05-31/distribution/{DistributionId}/invalidation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateInvalidationForDistributionTenantResult extends S.Class<CreateInvalidationForDistributionTenantResult>(
  "CreateInvalidationForDistributionTenantResult",
)(
  {
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    Invalidation: S.optional(Invalidation).pipe(T.HttpPayload()),
  },
  ns,
) {}
export class CreateKeyGroupResult extends S.Class<CreateKeyGroupResult>(
  "CreateKeyGroupResult",
)(
  {
    KeyGroup: S.optional(KeyGroup).pipe(T.HttpPayload()),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateKeyValueStoreResult extends S.Class<CreateKeyValueStoreResult>(
  "CreateKeyValueStoreResult",
)(
  {
    KeyValueStore: S.optional(KeyValueStore).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
  },
  ns,
) {}
export class CreateMonitoringSubscriptionRequest extends S.Class<CreateMonitoringSubscriptionRequest>(
  "CreateMonitoringSubscriptionRequest",
)(
  {
    DistributionId: S.String.pipe(T.HttpLabel()),
    MonitoringSubscription: MonitoringSubscription.pipe(
      T.HttpPayload(),
      T.XmlName("MonitoringSubscription"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2020-05-31/distributions/{DistributionId}/monitoring-subscription",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateOriginAccessControlResult extends S.Class<CreateOriginAccessControlResult>(
  "CreateOriginAccessControlResult",
)(
  {
    OriginAccessControl: S.optional(OriginAccessControl).pipe(T.HttpPayload()),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreatePublicKeyResult extends S.Class<CreatePublicKeyResult>(
  "CreatePublicKeyResult",
)(
  {
    PublicKey: S.optional(PublicKey).pipe(T.HttpPayload()),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateRealtimeLogConfigRequest extends S.Class<CreateRealtimeLogConfigRequest>(
  "CreateRealtimeLogConfigRequest",
)(
  {
    EndPoints: EndPointList,
    Fields: FieldList,
    Name: S.String,
    SamplingRate: S.Number,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/realtime-log-config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateStreamingDistributionRequest extends S.Class<CreateStreamingDistributionRequest>(
  "CreateStreamingDistributionRequest",
)(
  {
    StreamingDistributionConfig: StreamingDistributionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("StreamingDistributionConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/streaming-distribution" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateStreamingDistributionWithTagsResult extends S.Class<CreateStreamingDistributionWithTagsResult>(
  "CreateStreamingDistributionWithTagsResult",
)(
  {
    StreamingDistribution: S.optional(StreamingDistribution).pipe(
      T.HttpPayload(),
    ),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateTrustStoreRequest extends S.Class<CreateTrustStoreRequest>(
  "CreateTrustStoreRequest",
)(
  {
    Name: S.String,
    CaCertificatesBundleSource: CaCertificatesBundleSource,
    Tags: S.optional(Tags),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/trust-store" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVpcOriginRequest extends S.Class<CreateVpcOriginRequest>(
  "CreateVpcOriginRequest",
)(
  { VpcOriginEndpointConfig: VpcOriginEndpointConfig, Tags: S.optional(Tags) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/vpc-origin" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVpcOriginResult extends S.Class<DeleteVpcOriginResult>(
  "DeleteVpcOriginResult",
)(
  {
    VpcOrigin: S.optional(VpcOrigin).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class DescribeConnectionFunctionResult extends S.Class<DescribeConnectionFunctionResult>(
  "DescribeConnectionFunctionResult",
)(
  {
    ConnectionFunctionSummary: S.optional(ConnectionFunctionSummary).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class DescribeKeyValueStoreResult extends S.Class<DescribeKeyValueStoreResult>(
  "DescribeKeyValueStoreResult",
)(
  {
    KeyValueStore: S.optional(KeyValueStore).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetCachePolicyResult extends S.Class<GetCachePolicyResult>(
  "GetCachePolicyResult",
)(
  {
    CachePolicy: S.optional(CachePolicy).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetCloudFrontOriginAccessIdentityResult extends S.Class<GetCloudFrontOriginAccessIdentityResult>(
  "GetCloudFrontOriginAccessIdentityResult",
)(
  {
    CloudFrontOriginAccessIdentity: S.optional(
      CloudFrontOriginAccessIdentity,
    ).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetContinuousDeploymentPolicyResult extends S.Class<GetContinuousDeploymentPolicyResult>(
  "GetContinuousDeploymentPolicyResult",
)(
  {
    ContinuousDeploymentPolicy: S.optional(ContinuousDeploymentPolicy).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetFieldLevelEncryptionResult extends S.Class<GetFieldLevelEncryptionResult>(
  "GetFieldLevelEncryptionResult",
)(
  {
    FieldLevelEncryption: S.optional(FieldLevelEncryption).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetFieldLevelEncryptionProfileResult extends S.Class<GetFieldLevelEncryptionProfileResult>(
  "GetFieldLevelEncryptionProfileResult",
)(
  {
    FieldLevelEncryptionProfile: S.optional(FieldLevelEncryptionProfile).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetKeyGroupResult extends S.Class<GetKeyGroupResult>(
  "GetKeyGroupResult",
)(
  {
    KeyGroup: S.optional(KeyGroup).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetOriginAccessControlResult extends S.Class<GetOriginAccessControlResult>(
  "GetOriginAccessControlResult",
)(
  {
    OriginAccessControl: S.optional(OriginAccessControl).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetOriginRequestPolicyResult extends S.Class<GetOriginRequestPolicyResult>(
  "GetOriginRequestPolicyResult",
)(
  {
    OriginRequestPolicy: S.optional(OriginRequestPolicy).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetPublicKeyResult extends S.Class<GetPublicKeyResult>(
  "GetPublicKeyResult",
)(
  {
    PublicKey: S.optional(PublicKey).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetRealtimeLogConfigResult extends S.Class<GetRealtimeLogConfigResult>(
  "GetRealtimeLogConfigResult",
)({ RealtimeLogConfig: S.optional(RealtimeLogConfig) }, ns) {}
export class GetResponseHeadersPolicyResult extends S.Class<GetResponseHeadersPolicyResult>(
  "GetResponseHeadersPolicyResult",
)(
  {
    ResponseHeadersPolicy: S.optional(ResponseHeadersPolicy).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetStreamingDistributionResult extends S.Class<GetStreamingDistributionResult>(
  "GetStreamingDistributionResult",
)(
  {
    StreamingDistribution: S.optional(StreamingDistribution).pipe(
      T.HttpPayload(),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetTrustStoreResult extends S.Class<GetTrustStoreResult>(
  "GetTrustStoreResult",
)(
  {
    TrustStore: S.optional(TrustStore).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class ListDistributionsByCachePolicyIdResult extends S.Class<ListDistributionsByCachePolicyIdResult>(
  "ListDistributionsByCachePolicyIdResult",
)(
  { DistributionIdList: S.optional(DistributionIdList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListDistributionTenantsResult extends S.Class<ListDistributionTenantsResult>(
  "ListDistributionTenantsResult",
)(
  {
    NextMarker: S.optional(S.String),
    DistributionTenantList: S.optional(DistributionTenantList),
  },
  ns,
) {}
export class ListDistributionTenantsByCustomizationResult extends S.Class<ListDistributionTenantsByCustomizationResult>(
  "ListDistributionTenantsByCustomizationResult",
)(
  {
    NextMarker: S.optional(S.String),
    DistributionTenantList: S.optional(DistributionTenantList),
  },
  ns,
) {}
export class ListFunctionsResult extends S.Class<ListFunctionsResult>(
  "ListFunctionsResult",
)({ FunctionList: S.optional(FunctionList).pipe(T.HttpPayload()) }, ns) {}
export class ListKeyValueStoresResult extends S.Class<ListKeyValueStoresResult>(
  "ListKeyValueStoresResult",
)(
  { KeyValueStoreList: S.optional(KeyValueStoreList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListRealtimeLogConfigsResult extends S.Class<ListRealtimeLogConfigsResult>(
  "ListRealtimeLogConfigsResult",
)(
  { RealtimeLogConfigs: S.optional(RealtimeLogConfigs).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListTrustStoresResult extends S.Class<ListTrustStoresResult>(
  "ListTrustStoresResult",
)(
  {
    NextMarker: S.optional(S.String),
    TrustStoreList: S.optional(TrustStoreList),
  },
  ns,
) {}
export class TestConnectionFunctionResult extends S.Class<TestConnectionFunctionResult>(
  "TestConnectionFunctionResult",
)(
  {
    ConnectionFunctionTestResult: S.optional(ConnectionFunctionTestResult).pipe(
      T.HttpPayload(),
    ),
  },
  ns,
) {}
export class TestFunctionResult extends S.Class<TestFunctionResult>(
  "TestFunctionResult",
)({ TestResult: S.optional(TestResult).pipe(T.HttpPayload()) }, ns) {}
export class VerifyDnsConfigurationResult extends S.Class<VerifyDnsConfigurationResult>(
  "VerifyDnsConfigurationResult",
)({ DnsConfigurationList: S.optional(DnsConfigurationList) }, ns) {}
export class ValidationTokenDetail extends S.Class<ValidationTokenDetail>(
  "ValidationTokenDetail",
)({
  Domain: S.String,
  RedirectTo: S.optional(S.String),
  RedirectFrom: S.optional(S.String),
}) {}
export const ValidationTokenDetailList = S.Array(ValidationTokenDetail);
export class AnycastIpListSummary extends S.Class<AnycastIpListSummary>(
  "AnycastIpListSummary",
)({
  Id: S.String,
  Name: S.String,
  Status: S.String,
  Arn: S.String,
  IpCount: S.Number,
  LastModifiedTime: S.Date,
  IpAddressType: S.optional(S.String),
  ETag: S.optional(S.String),
  IpamConfig: S.optional(IpamConfig),
}) {}
export const AnycastIpListSummaries = S.Array(
  AnycastIpListSummary.pipe(T.XmlName("AnycastIpListSummary")),
);
export class CachePolicySummary extends S.Class<CachePolicySummary>(
  "CachePolicySummary",
)({ Type: S.String, CachePolicy: CachePolicy }) {}
export const CachePolicySummaryList = S.Array(
  CachePolicySummary.pipe(T.XmlName("CachePolicySummary")),
);
export class CloudFrontOriginAccessIdentitySummary extends S.Class<CloudFrontOriginAccessIdentitySummary>(
  "CloudFrontOriginAccessIdentitySummary",
)({ Id: S.String, S3CanonicalUserId: S.String, Comment: S.String }) {}
export const CloudFrontOriginAccessIdentitySummaryList = S.Array(
  CloudFrontOriginAccessIdentitySummary.pipe(
    T.XmlName("CloudFrontOriginAccessIdentitySummary"),
  ),
);
export class ConflictingAlias extends S.Class<ConflictingAlias>(
  "ConflictingAlias",
)({
  Alias: S.optional(S.String),
  DistributionId: S.optional(S.String),
  AccountId: S.optional(S.String),
}) {}
export const ConflictingAliases = S.Array(
  ConflictingAlias.pipe(T.XmlName("ConflictingAlias")),
);
export class ContinuousDeploymentPolicySummary extends S.Class<ContinuousDeploymentPolicySummary>(
  "ContinuousDeploymentPolicySummary",
)({ ContinuousDeploymentPolicy: ContinuousDeploymentPolicy }) {}
export const ContinuousDeploymentPolicySummaryList = S.Array(
  ContinuousDeploymentPolicySummary.pipe(
    T.XmlName("ContinuousDeploymentPolicySummary"),
  ),
);
export class DistributionIdOwner extends S.Class<DistributionIdOwner>(
  "DistributionIdOwner",
)({ DistributionId: S.String, OwnerAccountId: S.String }) {}
export const DistributionIdOwnerItemList = S.Array(
  DistributionIdOwner.pipe(T.XmlName("DistributionIdOwner")),
);
export class FieldLevelEncryptionSummary extends S.Class<FieldLevelEncryptionSummary>(
  "FieldLevelEncryptionSummary",
)({
  Id: S.String,
  LastModifiedTime: S.Date,
  Comment: S.optional(S.String),
  QueryArgProfileConfig: S.optional(QueryArgProfileConfig),
  ContentTypeProfileConfig: S.optional(ContentTypeProfileConfig),
}) {}
export const FieldLevelEncryptionSummaryList = S.Array(
  FieldLevelEncryptionSummary.pipe(T.XmlName("FieldLevelEncryptionSummary")),
);
export class FieldLevelEncryptionProfileSummary extends S.Class<FieldLevelEncryptionProfileSummary>(
  "FieldLevelEncryptionProfileSummary",
)({
  Id: S.String,
  LastModifiedTime: S.Date,
  Name: S.String,
  EncryptionEntities: EncryptionEntities,
  Comment: S.optional(S.String),
}) {}
export const FieldLevelEncryptionProfileSummaryList = S.Array(
  FieldLevelEncryptionProfileSummary.pipe(
    T.XmlName("FieldLevelEncryptionProfileSummary"),
  ),
);
export class KeyGroupSummary extends S.Class<KeyGroupSummary>(
  "KeyGroupSummary",
)({ KeyGroup: KeyGroup }) {}
export const KeyGroupSummaryList = S.Array(
  KeyGroupSummary.pipe(T.XmlName("KeyGroupSummary")),
);
export class OriginAccessControlSummary extends S.Class<OriginAccessControlSummary>(
  "OriginAccessControlSummary",
)({
  Id: S.String,
  Description: S.String,
  Name: S.String,
  SigningProtocol: S.String,
  SigningBehavior: S.String,
  OriginAccessControlOriginType: S.String,
}) {}
export const OriginAccessControlSummaryList = S.Array(
  OriginAccessControlSummary.pipe(T.XmlName("OriginAccessControlSummary")),
);
export class OriginRequestPolicySummary extends S.Class<OriginRequestPolicySummary>(
  "OriginRequestPolicySummary",
)({ Type: S.String, OriginRequestPolicy: OriginRequestPolicy }) {}
export const OriginRequestPolicySummaryList = S.Array(
  OriginRequestPolicySummary.pipe(T.XmlName("OriginRequestPolicySummary")),
);
export class PublicKeySummary extends S.Class<PublicKeySummary>(
  "PublicKeySummary",
)({
  Id: S.String,
  Name: S.String,
  CreatedTime: S.Date,
  EncodedKey: S.String,
  Comment: S.optional(S.String),
}) {}
export const PublicKeySummaryList = S.Array(
  PublicKeySummary.pipe(T.XmlName("PublicKeySummary")),
);
export class ResponseHeadersPolicySummary extends S.Class<ResponseHeadersPolicySummary>(
  "ResponseHeadersPolicySummary",
)({ Type: S.String, ResponseHeadersPolicy: ResponseHeadersPolicy }) {}
export const ResponseHeadersPolicySummaryList = S.Array(
  ResponseHeadersPolicySummary.pipe(T.XmlName("ResponseHeadersPolicySummary")),
);
export class StreamingDistributionSummary extends S.Class<StreamingDistributionSummary>(
  "StreamingDistributionSummary",
)({
  Id: S.String,
  ARN: S.String,
  Status: S.String,
  LastModifiedTime: S.Date,
  DomainName: S.String,
  S3Origin: S3Origin,
  Aliases: Aliases,
  TrustedSigners: TrustedSigners,
  Comment: S.String,
  PriceClass: S.String,
  Enabled: S.Boolean,
}) {}
export const StreamingDistributionSummaryList = S.Array(
  StreamingDistributionSummary.pipe(T.XmlName("StreamingDistributionSummary")),
);
export class VpcOriginSummary extends S.Class<VpcOriginSummary>(
  "VpcOriginSummary",
)({
  Id: S.String,
  Name: S.String,
  Status: S.String,
  CreatedTime: S.Date,
  LastModifiedTime: S.Date,
  Arn: S.String,
  AccountId: S.optional(S.String),
  OriginEndpointArn: S.String,
}) {}
export const VpcOriginSummaryList = S.Array(
  VpcOriginSummary.pipe(T.XmlName("VpcOriginSummary")),
);
export class ManagedCertificateDetails extends S.Class<ManagedCertificateDetails>(
  "ManagedCertificateDetails",
)({
  CertificateArn: S.optional(S.String),
  CertificateStatus: S.optional(S.String),
  ValidationTokenHost: S.optional(S.String),
  ValidationTokenDetails: S.optional(ValidationTokenDetailList),
}) {}
export class AnycastIpListCollection extends S.Class<AnycastIpListCollection>(
  "AnycastIpListCollection",
)({
  Items: S.optional(AnycastIpListSummaries),
  Marker: S.String,
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  IsTruncated: S.Boolean,
  Quantity: S.Number,
}) {}
export class CachePolicyList extends S.Class<CachePolicyList>(
  "CachePolicyList",
)({
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  Quantity: S.Number,
  Items: S.optional(CachePolicySummaryList),
}) {}
export class CloudFrontOriginAccessIdentityList extends S.Class<CloudFrontOriginAccessIdentityList>(
  "CloudFrontOriginAccessIdentityList",
)({
  Marker: S.String,
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  IsTruncated: S.Boolean,
  Quantity: S.Number,
  Items: S.optional(CloudFrontOriginAccessIdentitySummaryList),
}) {}
export class ConflictingAliasesList extends S.Class<ConflictingAliasesList>(
  "ConflictingAliasesList",
)({
  NextMarker: S.optional(S.String),
  MaxItems: S.optional(S.Number),
  Quantity: S.optional(S.Number),
  Items: S.optional(ConflictingAliases),
}) {}
export class ConnectionGroupSummary extends S.Class<ConnectionGroupSummary>(
  "ConnectionGroupSummary",
)({
  Id: S.String,
  Name: S.String,
  Arn: S.String,
  RoutingEndpoint: S.String,
  CreatedTime: S.Date,
  LastModifiedTime: S.Date,
  ETag: S.String,
  AnycastIpListId: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  Status: S.optional(S.String),
  IsDefault: S.optional(S.Boolean),
}) {}
export const ConnectionGroupSummaryList = S.Array(
  ConnectionGroupSummary.pipe(T.XmlName("ConnectionGroupSummary")),
);
export class ContinuousDeploymentPolicyList extends S.Class<ContinuousDeploymentPolicyList>(
  "ContinuousDeploymentPolicyList",
)({
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  Quantity: S.Number,
  Items: S.optional(ContinuousDeploymentPolicySummaryList),
}) {}
export class DistributionIdOwnerList extends S.Class<DistributionIdOwnerList>(
  "DistributionIdOwnerList",
)({
  Marker: S.String,
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  IsTruncated: S.Boolean,
  Quantity: S.Number,
  Items: S.optional(DistributionIdOwnerItemList),
}) {}
export class DomainConflict extends S.Class<DomainConflict>("DomainConflict")({
  Domain: S.String,
  ResourceType: S.String,
  ResourceId: S.String,
  AccountId: S.String,
}) {}
export const DomainConflictsList = S.Array(
  DomainConflict.pipe(T.XmlName("DomainConflicts")),
);
export class FieldLevelEncryptionList extends S.Class<FieldLevelEncryptionList>(
  "FieldLevelEncryptionList",
)({
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  Quantity: S.Number,
  Items: S.optional(FieldLevelEncryptionSummaryList),
}) {}
export class FieldLevelEncryptionProfileList extends S.Class<FieldLevelEncryptionProfileList>(
  "FieldLevelEncryptionProfileList",
)({
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  Quantity: S.Number,
  Items: S.optional(FieldLevelEncryptionProfileSummaryList),
}) {}
export class KeyGroupList extends S.Class<KeyGroupList>("KeyGroupList")({
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  Quantity: S.Number,
  Items: S.optional(KeyGroupSummaryList),
}) {}
export class OriginAccessControlList extends S.Class<OriginAccessControlList>(
  "OriginAccessControlList",
)({
  Marker: S.String,
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  IsTruncated: S.Boolean,
  Quantity: S.Number,
  Items: S.optional(OriginAccessControlSummaryList),
}) {}
export class OriginRequestPolicyList extends S.Class<OriginRequestPolicyList>(
  "OriginRequestPolicyList",
)({
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  Quantity: S.Number,
  Items: S.optional(OriginRequestPolicySummaryList),
}) {}
export class PublicKeyList extends S.Class<PublicKeyList>("PublicKeyList")({
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  Quantity: S.Number,
  Items: S.optional(PublicKeySummaryList),
}) {}
export class ResponseHeadersPolicyList extends S.Class<ResponseHeadersPolicyList>(
  "ResponseHeadersPolicyList",
)({
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  Quantity: S.Number,
  Items: S.optional(ResponseHeadersPolicySummaryList),
}) {}
export class StreamingDistributionList extends S.Class<StreamingDistributionList>(
  "StreamingDistributionList",
)({
  Marker: S.String,
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  IsTruncated: S.Boolean,
  Quantity: S.Number,
  Items: S.optional(StreamingDistributionSummaryList),
}) {}
export class VpcOriginList extends S.Class<VpcOriginList>("VpcOriginList")({
  Marker: S.String,
  NextMarker: S.optional(S.String),
  MaxItems: S.Number,
  IsTruncated: S.Boolean,
  Quantity: S.Number,
  Items: S.optional(VpcOriginSummaryList),
}) {}
export class CreateAnycastIpListResult extends S.Class<CreateAnycastIpListResult>(
  "CreateAnycastIpListResult",
)(
  {
    AnycastIpList: S.optional(AnycastIpList).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateCachePolicyRequest extends S.Class<CreateCachePolicyRequest>(
  "CreateCachePolicyRequest",
)(
  {
    CachePolicyConfig: CachePolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("CachePolicyConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/cache-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConnectionFunctionRequest extends S.Class<CreateConnectionFunctionRequest>(
  "CreateConnectionFunctionRequest",
)(
  {
    Name: S.String,
    ConnectionFunctionConfig: FunctionConfig,
    ConnectionFunctionCode: T.Blob,
    Tags: S.optional(Tags),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/connection-function" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDistributionTenantResult extends S.Class<CreateDistributionTenantResult>(
  "CreateDistributionTenantResult",
)(
  {
    DistributionTenant: S.optional(DistributionTenant).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateFunctionResult extends S.Class<CreateFunctionResult>(
  "CreateFunctionResult",
)(
  {
    FunctionSummary: S.optional(FunctionSummary).pipe(T.HttpPayload()),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateInvalidationResult extends S.Class<CreateInvalidationResult>(
  "CreateInvalidationResult",
)(
  {
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    Invalidation: S.optional(Invalidation).pipe(T.HttpPayload()),
  },
  ns,
) {}
export class CreateMonitoringSubscriptionResult extends S.Class<CreateMonitoringSubscriptionResult>(
  "CreateMonitoringSubscriptionResult",
)(
  {
    MonitoringSubscription: S.optional(MonitoringSubscription).pipe(
      T.HttpPayload(),
    ),
  },
  ns,
) {}
export class CreateOriginRequestPolicyRequest extends S.Class<CreateOriginRequestPolicyRequest>(
  "CreateOriginRequestPolicyRequest",
)(
  {
    OriginRequestPolicyConfig: OriginRequestPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("OriginRequestPolicyConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/origin-request-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRealtimeLogConfigResult extends S.Class<CreateRealtimeLogConfigResult>(
  "CreateRealtimeLogConfigResult",
)({ RealtimeLogConfig: S.optional(RealtimeLogConfig) }, ns) {}
export class CreateResponseHeadersPolicyRequest extends S.Class<CreateResponseHeadersPolicyRequest>(
  "CreateResponseHeadersPolicyRequest",
)(
  {
    ResponseHeadersPolicyConfig: ResponseHeadersPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("ResponseHeadersPolicyConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/response-headers-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateStreamingDistributionResult extends S.Class<CreateStreamingDistributionResult>(
  "CreateStreamingDistributionResult",
)(
  {
    StreamingDistribution: S.optional(StreamingDistribution).pipe(
      T.HttpPayload(),
    ),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateTrustStoreResult extends S.Class<CreateTrustStoreResult>(
  "CreateTrustStoreResult",
)(
  {
    TrustStore: S.optional(TrustStore).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateVpcOriginResult extends S.Class<CreateVpcOriginResult>(
  "CreateVpcOriginResult",
)(
  {
    VpcOrigin: S.optional(VpcOrigin).pipe(T.HttpPayload()),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetAnycastIpListResult extends S.Class<GetAnycastIpListResult>(
  "GetAnycastIpListResult",
)(
  {
    AnycastIpList: S.optional(AnycastIpList).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetDistributionTenantResult extends S.Class<GetDistributionTenantResult>(
  "GetDistributionTenantResult",
)(
  {
    DistributionTenant: S.optional(DistributionTenant).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class GetManagedCertificateDetailsResult extends S.Class<GetManagedCertificateDetailsResult>(
  "GetManagedCertificateDetailsResult",
)(
  {
    ManagedCertificateDetails: S.optional(ManagedCertificateDetails).pipe(
      T.HttpPayload(),
    ),
  },
  ns,
) {}
export class ListAnycastIpListsResult extends S.Class<ListAnycastIpListsResult>(
  "ListAnycastIpListsResult",
)(
  {
    AnycastIpLists: S.optional(AnycastIpListCollection).pipe(
      T.HttpPayload(),
      T.XmlName("AnycastIpListCollection"),
    ),
  },
  ns,
) {}
export class ListCachePoliciesResult extends S.Class<ListCachePoliciesResult>(
  "ListCachePoliciesResult",
)({ CachePolicyList: S.optional(CachePolicyList).pipe(T.HttpPayload()) }, ns) {}
export class ListCloudFrontOriginAccessIdentitiesResult extends S.Class<ListCloudFrontOriginAccessIdentitiesResult>(
  "ListCloudFrontOriginAccessIdentitiesResult",
)(
  {
    CloudFrontOriginAccessIdentityList: S.optional(
      CloudFrontOriginAccessIdentityList,
    ).pipe(T.HttpPayload()),
  },
  ns,
) {}
export class ListConflictingAliasesResult extends S.Class<ListConflictingAliasesResult>(
  "ListConflictingAliasesResult",
)(
  {
    ConflictingAliasesList: S.optional(ConflictingAliasesList).pipe(
      T.HttpPayload(),
    ),
  },
  ns,
) {}
export class ListConnectionGroupsResult extends S.Class<ListConnectionGroupsResult>(
  "ListConnectionGroupsResult",
)(
  {
    NextMarker: S.optional(S.String),
    ConnectionGroups: S.optional(ConnectionGroupSummaryList),
  },
  ns,
) {}
export class ListContinuousDeploymentPoliciesResult extends S.Class<ListContinuousDeploymentPoliciesResult>(
  "ListContinuousDeploymentPoliciesResult",
)(
  {
    ContinuousDeploymentPolicyList: S.optional(
      ContinuousDeploymentPolicyList,
    ).pipe(T.HttpPayload()),
  },
  ns,
) {}
export class ListDistributionsResult extends S.Class<ListDistributionsResult>(
  "ListDistributionsResult",
)(
  { DistributionList: S.optional(DistributionList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListDistributionsByOwnedResourceResult extends S.Class<ListDistributionsByOwnedResourceResult>(
  "ListDistributionsByOwnedResourceResult",
)(
  {
    DistributionList: S.optional(DistributionIdOwnerList).pipe(T.HttpPayload()),
  },
  ns,
) {}
export class ListDomainConflictsResult extends S.Class<ListDomainConflictsResult>(
  "ListDomainConflictsResult",
)(
  {
    DomainConflicts: S.optional(DomainConflictsList),
    NextMarker: S.optional(S.String),
  },
  ns,
) {}
export class ListFieldLevelEncryptionConfigsResult extends S.Class<ListFieldLevelEncryptionConfigsResult>(
  "ListFieldLevelEncryptionConfigsResult",
)(
  {
    FieldLevelEncryptionList: S.optional(FieldLevelEncryptionList).pipe(
      T.HttpPayload(),
    ),
  },
  ns,
) {}
export class ListFieldLevelEncryptionProfilesResult extends S.Class<ListFieldLevelEncryptionProfilesResult>(
  "ListFieldLevelEncryptionProfilesResult",
)(
  {
    FieldLevelEncryptionProfileList: S.optional(
      FieldLevelEncryptionProfileList,
    ).pipe(T.HttpPayload()),
  },
  ns,
) {}
export class ListInvalidationsResult extends S.Class<ListInvalidationsResult>(
  "ListInvalidationsResult",
)(
  { InvalidationList: S.optional(InvalidationList).pipe(T.HttpPayload()) },
  ns,
) {}
export class ListKeyGroupsResult extends S.Class<ListKeyGroupsResult>(
  "ListKeyGroupsResult",
)({ KeyGroupList: S.optional(KeyGroupList).pipe(T.HttpPayload()) }, ns) {}
export class ListOriginAccessControlsResult extends S.Class<ListOriginAccessControlsResult>(
  "ListOriginAccessControlsResult",
)(
  {
    OriginAccessControlList: S.optional(OriginAccessControlList).pipe(
      T.HttpPayload(),
    ),
  },
  ns,
) {}
export class ListOriginRequestPoliciesResult extends S.Class<ListOriginRequestPoliciesResult>(
  "ListOriginRequestPoliciesResult",
)(
  {
    OriginRequestPolicyList: S.optional(OriginRequestPolicyList).pipe(
      T.HttpPayload(),
    ),
  },
  ns,
) {}
export class ListPublicKeysResult extends S.Class<ListPublicKeysResult>(
  "ListPublicKeysResult",
)({ PublicKeyList: S.optional(PublicKeyList).pipe(T.HttpPayload()) }, ns) {}
export class ListResponseHeadersPoliciesResult extends S.Class<ListResponseHeadersPoliciesResult>(
  "ListResponseHeadersPoliciesResult",
)(
  {
    ResponseHeadersPolicyList: S.optional(ResponseHeadersPolicyList).pipe(
      T.HttpPayload(),
    ),
  },
  ns,
) {}
export class ListStreamingDistributionsResult extends S.Class<ListStreamingDistributionsResult>(
  "ListStreamingDistributionsResult",
)(
  {
    StreamingDistributionList: S.optional(StreamingDistributionList).pipe(
      T.HttpPayload(),
    ),
  },
  ns,
) {}
export class ListVpcOriginsResult extends S.Class<ListVpcOriginsResult>(
  "ListVpcOriginsResult",
)({ VpcOriginList: S.optional(VpcOriginList).pipe(T.HttpPayload()) }, ns) {}
export class CreateCachePolicyResult extends S.Class<CreateCachePolicyResult>(
  "CreateCachePolicyResult",
)(
  {
    CachePolicy: S.optional(CachePolicy).pipe(T.HttpPayload()),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateConnectionFunctionResult extends S.Class<CreateConnectionFunctionResult>(
  "CreateConnectionFunctionResult",
)(
  {
    ConnectionFunctionSummary: S.optional(ConnectionFunctionSummary).pipe(
      T.HttpPayload(),
    ),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateContinuousDeploymentPolicyRequest extends S.Class<CreateContinuousDeploymentPolicyRequest>(
  "CreateContinuousDeploymentPolicyRequest",
)(
  {
    ContinuousDeploymentPolicyConfig: ContinuousDeploymentPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("ContinuousDeploymentPolicyConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/continuous-deployment-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFieldLevelEncryptionConfigRequest extends S.Class<CreateFieldLevelEncryptionConfigRequest>(
  "CreateFieldLevelEncryptionConfigRequest",
)(
  {
    FieldLevelEncryptionConfig: FieldLevelEncryptionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("FieldLevelEncryptionConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/field-level-encryption" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFieldLevelEncryptionProfileRequest extends S.Class<CreateFieldLevelEncryptionProfileRequest>(
  "CreateFieldLevelEncryptionProfileRequest",
)(
  {
    FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig.pipe(
      T.HttpPayload(),
      T.XmlName("FieldLevelEncryptionProfileConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2020-05-31/field-level-encryption-profile",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateOriginRequestPolicyResult extends S.Class<CreateOriginRequestPolicyResult>(
  "CreateOriginRequestPolicyResult",
)(
  {
    OriginRequestPolicy: S.optional(OriginRequestPolicy).pipe(T.HttpPayload()),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateResponseHeadersPolicyResult extends S.Class<CreateResponseHeadersPolicyResult>(
  "CreateResponseHeadersPolicyResult",
)(
  {
    ResponseHeadersPolicy: S.optional(ResponseHeadersPolicy).pipe(
      T.HttpPayload(),
    ),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CopyDistributionResult extends S.Class<CopyDistributionResult>(
  "CopyDistributionResult",
)(
  {
    Distribution: S.optional(Distribution).pipe(T.HttpPayload()),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateContinuousDeploymentPolicyResult extends S.Class<CreateContinuousDeploymentPolicyResult>(
  "CreateContinuousDeploymentPolicyResult",
)(
  {
    ContinuousDeploymentPolicy: S.optional(ContinuousDeploymentPolicy).pipe(
      T.HttpPayload(),
    ),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateDistributionRequest extends S.Class<CreateDistributionRequest>(
  "CreateDistributionRequest",
)(
  {
    DistributionConfig: DistributionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("DistributionConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2020-05-31/distribution" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFieldLevelEncryptionConfigResult extends S.Class<CreateFieldLevelEncryptionConfigResult>(
  "CreateFieldLevelEncryptionConfigResult",
)(
  {
    FieldLevelEncryption: S.optional(FieldLevelEncryption).pipe(
      T.HttpPayload(),
    ),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateFieldLevelEncryptionProfileResult extends S.Class<CreateFieldLevelEncryptionProfileResult>(
  "CreateFieldLevelEncryptionProfileResult",
)(
  {
    FieldLevelEncryptionProfile: S.optional(FieldLevelEncryptionProfile).pipe(
      T.HttpPayload(),
    ),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}
export class CreateDistributionResult extends S.Class<CreateDistributionResult>(
  "CreateDistributionResult",
)(
  {
    Distribution: S.optional(Distribution).pipe(T.HttpPayload()),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  },
  ns,
) {}

//# Errors
export class AccessDenied extends S.TaggedError<AccessDenied>()(
  "AccessDenied",
  {},
) {}
export class CannotDeleteEntityWhileInUse extends S.TaggedError<CannotDeleteEntityWhileInUse>()(
  "CannotDeleteEntityWhileInUse",
  {},
) {}
export class EntityNotFound extends S.TaggedError<EntityNotFound>()(
  "EntityNotFound",
  {},
) {}
export class InvalidIfMatchVersion extends S.TaggedError<InvalidIfMatchVersion>()(
  "InvalidIfMatchVersion",
  {},
) {}
export class PreconditionFailed extends S.TaggedError<PreconditionFailed>()(
  "PreconditionFailed",
  {},
) {}
export class IllegalDelete extends S.TaggedError<IllegalDelete>()(
  "IllegalDelete",
  {},
) {}
export class InvalidArgument extends S.TaggedError<InvalidArgument>()(
  "InvalidArgument",
  {},
) {}
export class UnsupportedOperation extends S.TaggedError<UnsupportedOperation>()(
  "UnsupportedOperation",
  {},
) {}
export class CachePolicyInUse extends S.TaggedError<CachePolicyInUse>()(
  "CachePolicyInUse",
  { Message: S.optional(S.String) },
) {}
export class CloudFrontOriginAccessIdentityInUse extends S.TaggedError<CloudFrontOriginAccessIdentityInUse>()(
  "CloudFrontOriginAccessIdentityInUse",
  { Message: S.optional(S.String) },
) {}
export class ContinuousDeploymentPolicyInUse extends S.TaggedError<ContinuousDeploymentPolicyInUse>()(
  "ContinuousDeploymentPolicyInUse",
  { Message: S.optional(S.String) },
) {}
export class DistributionNotDisabled extends S.TaggedError<DistributionNotDisabled>()(
  "DistributionNotDisabled",
  { Message: S.optional(S.String) },
) {}
export class NoSuchDistribution extends S.TaggedError<NoSuchDistribution>()(
  "NoSuchDistribution",
  {},
) {}
export class ResourceNotDisabled extends S.TaggedError<ResourceNotDisabled>()(
  "ResourceNotDisabled",
  {},
) {}
export class FieldLevelEncryptionConfigInUse extends S.TaggedError<FieldLevelEncryptionConfigInUse>()(
  "FieldLevelEncryptionConfigInUse",
  { Message: S.optional(S.String) },
) {}
export class FieldLevelEncryptionProfileInUse extends S.TaggedError<FieldLevelEncryptionProfileInUse>()(
  "FieldLevelEncryptionProfileInUse",
  { Message: S.optional(S.String) },
) {}
export class FunctionInUse extends S.TaggedError<FunctionInUse>()(
  "FunctionInUse",
  { Message: S.optional(S.String) },
) {}
export class NoSuchResource extends S.TaggedError<NoSuchResource>()(
  "NoSuchResource",
  { Message: S.optional(S.String) },
) {}
export class ResourceInUse extends S.TaggedError<ResourceInUse>()(
  "ResourceInUse",
  {},
) {}
export class NoSuchOriginAccessControl extends S.TaggedError<NoSuchOriginAccessControl>()(
  "NoSuchOriginAccessControl",
  { Message: S.optional(S.String) },
) {}
export class NoSuchPublicKey extends S.TaggedError<NoSuchPublicKey>()(
  "NoSuchPublicKey",
  { Message: S.optional(S.String) },
) {}
export class NoSuchResponseHeadersPolicy extends S.TaggedError<NoSuchResponseHeadersPolicy>()(
  "NoSuchResponseHeadersPolicy",
  { Message: S.optional(S.String) },
) {}
export class NoSuchStreamingDistribution extends S.TaggedError<NoSuchStreamingDistribution>()(
  "NoSuchStreamingDistribution",
  { Message: S.optional(S.String) },
) {}
export class NoSuchFunctionExists extends S.TaggedError<NoSuchFunctionExists>()(
  "NoSuchFunctionExists",
  {},
) {}
export class NoSuchCachePolicy extends S.TaggedError<NoSuchCachePolicy>()(
  "NoSuchCachePolicy",
  {},
) {}
export class NoSuchCloudFrontOriginAccessIdentity extends S.TaggedError<NoSuchCloudFrontOriginAccessIdentity>()(
  "NoSuchCloudFrontOriginAccessIdentity",
  {},
) {}
export class NoSuchContinuousDeploymentPolicy extends S.TaggedError<NoSuchContinuousDeploymentPolicy>()(
  "NoSuchContinuousDeploymentPolicy",
  {},
) {}
export class NoSuchFieldLevelEncryptionConfig extends S.TaggedError<NoSuchFieldLevelEncryptionConfig>()(
  "NoSuchFieldLevelEncryptionConfig",
  {},
) {}
export class NoSuchFieldLevelEncryptionProfile extends S.TaggedError<NoSuchFieldLevelEncryptionProfile>()(
  "NoSuchFieldLevelEncryptionProfile",
  {},
) {}
export class NoSuchInvalidation extends S.TaggedError<NoSuchInvalidation>()(
  "NoSuchInvalidation",
  {},
) {}
export class NoSuchMonitoringSubscription extends S.TaggedError<NoSuchMonitoringSubscription>()(
  "NoSuchMonitoringSubscription",
  {},
) {}
export class NoSuchOriginRequestPolicy extends S.TaggedError<NoSuchOriginRequestPolicy>()(
  "NoSuchOriginRequestPolicy",
  {},
) {}
export class InvalidTagging extends S.TaggedError<InvalidTagging>()(
  "InvalidTagging",
  {},
) {}
export class IllegalUpdate extends S.TaggedError<IllegalUpdate>()(
  "IllegalUpdate",
  {},
) {}
export class InconsistentQuantities extends S.TaggedError<InconsistentQuantities>()(
  "InconsistentQuantities",
  {},
) {}
export class CNAMEAlreadyExists extends S.TaggedError<CNAMEAlreadyExists>()(
  "CNAMEAlreadyExists",
  {},
) {}
export class EntityAlreadyExists extends S.TaggedError<EntityAlreadyExists>()(
  "EntityAlreadyExists",
  {},
) {}
export class NoSuchRealtimeLogConfig extends S.TaggedError<NoSuchRealtimeLogConfig>()(
  "NoSuchRealtimeLogConfig",
  {},
) {}
export class EntityLimitExceeded extends S.TaggedError<EntityLimitExceeded>()(
  "EntityLimitExceeded",
  {},
) {}
export class KeyGroupAlreadyExists extends S.TaggedError<KeyGroupAlreadyExists>()(
  "KeyGroupAlreadyExists",
  {},
) {}
export class EntitySizeLimitExceeded extends S.TaggedError<EntitySizeLimitExceeded>()(
  "EntitySizeLimitExceeded",
  {},
) {}
export class OriginAccessControlAlreadyExists extends S.TaggedError<OriginAccessControlAlreadyExists>()(
  "OriginAccessControlAlreadyExists",
  {},
) {}
export class OriginAccessControlInUse extends S.TaggedError<OriginAccessControlInUse>()(
  "OriginAccessControlInUse",
  { Message: S.optional(S.String) },
) {}
export class PublicKeyInUse extends S.TaggedError<PublicKeyInUse>()(
  "PublicKeyInUse",
  { Message: S.optional(S.String) },
) {}
export class ResponseHeadersPolicyInUse extends S.TaggedError<ResponseHeadersPolicyInUse>()(
  "ResponseHeadersPolicyInUse",
  { Message: S.optional(S.String) },
) {}
export class StreamingDistributionNotDisabled extends S.TaggedError<StreamingDistributionNotDisabled>()(
  "StreamingDistributionNotDisabled",
  { Message: S.optional(S.String) },
) {}
export class InvalidWebACLId extends S.TaggedError<InvalidWebACLId>()(
  "InvalidWebACLId",
  { Message: S.optional(S.String) },
) {}
export class TestFunctionFailed extends S.TaggedError<TestFunctionFailed>()(
  "TestFunctionFailed",
  {},
) {}
export class CachePolicyAlreadyExists extends S.TaggedError<CachePolicyAlreadyExists>()(
  "CachePolicyAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class StagingDistributionInUse extends S.TaggedError<StagingDistributionInUse>()(
  "StagingDistributionInUse",
  { Message: S.optional(S.String) },
) {}
export class IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior extends S.TaggedError<IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior>()(
  "IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior",
  {},
) {}
export class QueryArgProfileEmpty extends S.TaggedError<QueryArgProfileEmpty>()(
  "QueryArgProfileEmpty",
  { Message: S.optional(S.String) },
) {}
export class FieldLevelEncryptionProfileAlreadyExists extends S.TaggedError<FieldLevelEncryptionProfileAlreadyExists>()(
  "FieldLevelEncryptionProfileAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class FunctionSizeLimitExceeded extends S.TaggedError<FunctionSizeLimitExceeded>()(
  "FunctionSizeLimitExceeded",
  { Message: S.optional(S.String) },
) {}
export class OriginRequestPolicyAlreadyExists extends S.TaggedError<OriginRequestPolicyAlreadyExists>()(
  "OriginRequestPolicyAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class CannotChangeImmutablePublicKeyFields extends S.TaggedError<CannotChangeImmutablePublicKeyFields>()(
  "CannotChangeImmutablePublicKeyFields",
  { Message: S.optional(S.String) },
) {}
export class ResponseHeadersPolicyAlreadyExists extends S.TaggedError<ResponseHeadersPolicyAlreadyExists>()(
  "ResponseHeadersPolicyAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class InvalidOriginAccessControl extends S.TaggedError<InvalidOriginAccessControl>()(
  "InvalidOriginAccessControl",
  { Message: S.optional(S.String) },
) {}
export class CannotUpdateEntityWhileInUse extends S.TaggedError<CannotUpdateEntityWhileInUse>()(
  "CannotUpdateEntityWhileInUse",
  { Message: S.optional(S.String) },
) {}
export class TooManyDistributionCNAMEs extends S.TaggedError<TooManyDistributionCNAMEs>()(
  "TooManyDistributionCNAMEs",
  { Message: S.optional(S.String) },
) {}
export class CloudFrontOriginAccessIdentityAlreadyExists extends S.TaggedError<CloudFrontOriginAccessIdentityAlreadyExists>()(
  "CloudFrontOriginAccessIdentityAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class MissingBody extends S.TaggedError<MissingBody>()(
  "MissingBody",
  {},
) {}
export class InvalidAssociation extends S.TaggedError<InvalidAssociation>()(
  "InvalidAssociation",
  {},
) {}
export class DistributionAlreadyExists extends S.TaggedError<DistributionAlreadyExists>()(
  "DistributionAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class IllegalOriginAccessConfiguration extends S.TaggedError<IllegalOriginAccessConfiguration>()(
  "IllegalOriginAccessConfiguration",
  {},
) {}
export class InvalidDefaultRootObject extends S.TaggedError<InvalidDefaultRootObject>()(
  "InvalidDefaultRootObject",
  {},
) {}
export class BatchTooLarge extends S.TaggedError<BatchTooLarge>()(
  "BatchTooLarge",
  {},
) {}
export class TooManyInvalidationsInProgress extends S.TaggedError<TooManyInvalidationsInProgress>()(
  "TooManyInvalidationsInProgress",
  {},
) {}
export class TooManyKeyGroups extends S.TaggedError<TooManyKeyGroups>()(
  "TooManyKeyGroups",
  { Message: S.optional(S.String) },
) {}
export class TooManyPublicKeysInKeyGroup extends S.TaggedError<TooManyPublicKeysInKeyGroup>()(
  "TooManyPublicKeysInKeyGroup",
  {},
) {}
export class TooManyOriginAccessControls extends S.TaggedError<TooManyOriginAccessControls>()(
  "TooManyOriginAccessControls",
  { Message: S.optional(S.String) },
) {}
export class PublicKeyAlreadyExists extends S.TaggedError<PublicKeyAlreadyExists>()(
  "PublicKeyAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class InvalidOrigin extends S.TaggedError<InvalidOrigin>()(
  "InvalidOrigin",
  {},
) {}
export class InvalidOriginAccessIdentity extends S.TaggedError<InvalidOriginAccessIdentity>()(
  "InvalidOriginAccessIdentity",
  {},
) {}
export class StreamingDistributionAlreadyExists extends S.TaggedError<StreamingDistributionAlreadyExists>()(
  "StreamingDistributionAlreadyExists",
  {},
) {}
export class OriginRequestPolicyInUse extends S.TaggedError<OriginRequestPolicyInUse>()(
  "OriginRequestPolicyInUse",
  { Message: S.optional(S.String) },
) {}
export class RealtimeLogConfigInUse extends S.TaggedError<RealtimeLogConfigInUse>()(
  "RealtimeLogConfigInUse",
  { Message: S.optional(S.String) },
) {}
export class TooManyCookiesInCachePolicy extends S.TaggedError<TooManyCookiesInCachePolicy>()(
  "TooManyCookiesInCachePolicy",
  { Message: S.optional(S.String) },
) {}
export class InvalidDomainNameForOriginAccessControl extends S.TaggedError<InvalidDomainNameForOriginAccessControl>()(
  "InvalidDomainNameForOriginAccessControl",
  {},
) {}
export class InvalidErrorCode extends S.TaggedError<InvalidErrorCode>()(
  "InvalidErrorCode",
  {},
) {}
export class TooManyFieldLevelEncryptionContentTypeProfiles extends S.TaggedError<TooManyFieldLevelEncryptionContentTypeProfiles>()(
  "TooManyFieldLevelEncryptionContentTypeProfiles",
  { Message: S.optional(S.String) },
) {}
export class FieldLevelEncryptionProfileSizeExceeded extends S.TaggedError<FieldLevelEncryptionProfileSizeExceeded>()(
  "FieldLevelEncryptionProfileSizeExceeded",
  { Message: S.optional(S.String) },
) {}
export class TooManyCookiesInOriginRequestPolicy extends S.TaggedError<TooManyCookiesInOriginRequestPolicy>()(
  "TooManyCookiesInOriginRequestPolicy",
  { Message: S.optional(S.String) },
) {}
export class TooLongCSPInResponseHeadersPolicy extends S.TaggedError<TooLongCSPInResponseHeadersPolicy>()(
  "TooLongCSPInResponseHeadersPolicy",
  { Message: S.optional(S.String) },
) {}
export class TooManyStreamingDistributionCNAMEs extends S.TaggedError<TooManyStreamingDistributionCNAMEs>()(
  "TooManyStreamingDistributionCNAMEs",
  {},
) {}
export class TooManyCloudFrontOriginAccessIdentities extends S.TaggedError<TooManyCloudFrontOriginAccessIdentities>()(
  "TooManyCloudFrontOriginAccessIdentities",
  { Message: S.optional(S.String) },
) {}
export class InvalidForwardCookies extends S.TaggedError<InvalidForwardCookies>()(
  "InvalidForwardCookies",
  {},
) {}
export class FunctionAlreadyExists extends S.TaggedError<FunctionAlreadyExists>()(
  "FunctionAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class MonitoringSubscriptionAlreadyExists extends S.TaggedError<MonitoringSubscriptionAlreadyExists>()(
  "MonitoringSubscriptionAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class TooManyHeadersInOriginRequestPolicy extends S.TaggedError<TooManyHeadersInOriginRequestPolicy>()(
  "TooManyHeadersInOriginRequestPolicy",
  {},
) {}
export class TooManyPublicKeys extends S.TaggedError<TooManyPublicKeys>()(
  "TooManyPublicKeys",
  { Message: S.optional(S.String) },
) {}
export class RealtimeLogConfigAlreadyExists extends S.TaggedError<RealtimeLogConfigAlreadyExists>()(
  "RealtimeLogConfigAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class TooManyCustomHeadersInResponseHeadersPolicy extends S.TaggedError<TooManyCustomHeadersInResponseHeadersPolicy>()(
  "TooManyCustomHeadersInResponseHeadersPolicy",
  {},
) {}
export class TooManyStreamingDistributions extends S.TaggedError<TooManyStreamingDistributions>()(
  "TooManyStreamingDistributions",
  {},
) {}
export class TooManyTrustedSigners extends S.TaggedError<TooManyTrustedSigners>()(
  "TooManyTrustedSigners",
  {},
) {}
export class TooManyHeadersInCachePolicy extends S.TaggedError<TooManyHeadersInCachePolicy>()(
  "TooManyHeadersInCachePolicy",
  { Message: S.optional(S.String) },
) {}
export class InvalidFunctionAssociation extends S.TaggedError<InvalidFunctionAssociation>()(
  "InvalidFunctionAssociation",
  {},
) {}
export class InvalidGeoRestrictionParameter extends S.TaggedError<InvalidGeoRestrictionParameter>()(
  "InvalidGeoRestrictionParameter",
  {},
) {}
export class TooManyFieldLevelEncryptionQueryArgProfiles extends S.TaggedError<TooManyFieldLevelEncryptionQueryArgProfiles>()(
  "TooManyFieldLevelEncryptionQueryArgProfiles",
  { Message: S.optional(S.String) },
) {}
export class TooManyFieldLevelEncryptionEncryptionEntities extends S.TaggedError<TooManyFieldLevelEncryptionEncryptionEntities>()(
  "TooManyFieldLevelEncryptionEncryptionEntities",
  { Message: S.optional(S.String) },
) {}
export class TooManyRemoveHeadersInResponseHeadersPolicy extends S.TaggedError<TooManyRemoveHeadersInResponseHeadersPolicy>()(
  "TooManyRemoveHeadersInResponseHeadersPolicy",
  {},
) {}
export class TrustedSignerDoesNotExist extends S.TaggedError<TrustedSignerDoesNotExist>()(
  "TrustedSignerDoesNotExist",
  {},
) {}
export class InvalidHeadersForS3Origin extends S.TaggedError<InvalidHeadersForS3Origin>()(
  "InvalidHeadersForS3Origin",
  {},
) {}
export class TooManyCachePolicies extends S.TaggedError<TooManyCachePolicies>()(
  "TooManyCachePolicies",
  { Message: S.optional(S.String) },
) {}
export class TooManyQueryStringsInCachePolicy extends S.TaggedError<TooManyQueryStringsInCachePolicy>()(
  "TooManyQueryStringsInCachePolicy",
  {},
) {}
export class InvalidLambdaFunctionAssociation extends S.TaggedError<InvalidLambdaFunctionAssociation>()(
  "InvalidLambdaFunctionAssociation",
  {},
) {}
export class TooManyFieldLevelEncryptionFieldPatterns extends S.TaggedError<TooManyFieldLevelEncryptionFieldPatterns>()(
  "TooManyFieldLevelEncryptionFieldPatterns",
  {},
) {}
export class TooManyFunctions extends S.TaggedError<TooManyFunctions>()(
  "TooManyFunctions",
  { Message: S.optional(S.String) },
) {}
export class TooManyOriginRequestPolicies extends S.TaggedError<TooManyOriginRequestPolicies>()(
  "TooManyOriginRequestPolicies",
  { Message: S.optional(S.String) },
) {}
export class TooManyQueryStringsInOriginRequestPolicy extends S.TaggedError<TooManyQueryStringsInOriginRequestPolicy>()(
  "TooManyQueryStringsInOriginRequestPolicy",
  {},
) {}
export class TooManyRealtimeLogConfigs extends S.TaggedError<TooManyRealtimeLogConfigs>()(
  "TooManyRealtimeLogConfigs",
  { Message: S.optional(S.String) },
) {}
export class InvalidLocationCode extends S.TaggedError<InvalidLocationCode>()(
  "InvalidLocationCode",
  {},
) {}
export class InvalidMinimumProtocolVersion extends S.TaggedError<InvalidMinimumProtocolVersion>()(
  "InvalidMinimumProtocolVersion",
  {},
) {}
export class InvalidOriginKeepaliveTimeout extends S.TaggedError<InvalidOriginKeepaliveTimeout>()(
  "InvalidOriginKeepaliveTimeout",
  {},
) {}
export class ContinuousDeploymentPolicyAlreadyExists extends S.TaggedError<ContinuousDeploymentPolicyAlreadyExists>()(
  "ContinuousDeploymentPolicyAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class InvalidOriginReadTimeout extends S.TaggedError<InvalidOriginReadTimeout>()(
  "InvalidOriginReadTimeout",
  {},
) {}
export class InvalidProtocolSettings extends S.TaggedError<InvalidProtocolSettings>()(
  "InvalidProtocolSettings",
  {},
) {}
export class FieldLevelEncryptionConfigAlreadyExists extends S.TaggedError<FieldLevelEncryptionConfigAlreadyExists>()(
  "FieldLevelEncryptionConfigAlreadyExists",
  { Message: S.optional(S.String) },
) {}
export class TooManyFieldLevelEncryptionProfiles extends S.TaggedError<TooManyFieldLevelEncryptionProfiles>()(
  "TooManyFieldLevelEncryptionProfiles",
  { Message: S.optional(S.String) },
) {}
export class TooManyResponseHeadersPolicies extends S.TaggedError<TooManyResponseHeadersPolicies>()(
  "TooManyResponseHeadersPolicies",
  { Message: S.optional(S.String) },
) {}
export class InvalidQueryStringParameters extends S.TaggedError<InvalidQueryStringParameters>()(
  "InvalidQueryStringParameters",
  {},
) {}
export class InvalidRelativePath extends S.TaggedError<InvalidRelativePath>()(
  "InvalidRelativePath",
  {},
) {}
export class InvalidRequiredProtocol extends S.TaggedError<InvalidRequiredProtocol>()(
  "InvalidRequiredProtocol",
  {},
) {}
export class TooManyContinuousDeploymentPolicies extends S.TaggedError<TooManyContinuousDeploymentPolicies>()(
  "TooManyContinuousDeploymentPolicies",
  { Message: S.optional(S.String) },
) {}
export class InvalidResponseCode extends S.TaggedError<InvalidResponseCode>()(
  "InvalidResponseCode",
  {},
) {}
export class InvalidTTLOrder extends S.TaggedError<InvalidTTLOrder>()(
  "InvalidTTLOrder",
  {},
) {}
export class TooManyFieldLevelEncryptionConfigs extends S.TaggedError<TooManyFieldLevelEncryptionConfigs>()(
  "TooManyFieldLevelEncryptionConfigs",
  { Message: S.optional(S.String) },
) {}
export class InvalidViewerCertificate extends S.TaggedError<InvalidViewerCertificate>()(
  "InvalidViewerCertificate",
  {},
) {}
export class NoSuchOrigin extends S.TaggedError<NoSuchOrigin>()(
  "NoSuchOrigin",
  {},
) {}
export class RealtimeLogConfigOwnerMismatch extends S.TaggedError<RealtimeLogConfigOwnerMismatch>()(
  "RealtimeLogConfigOwnerMismatch",
  {},
) {}
export class TooManyCacheBehaviors extends S.TaggedError<TooManyCacheBehaviors>()(
  "TooManyCacheBehaviors",
  {},
) {}
export class TooManyCertificates extends S.TaggedError<TooManyCertificates>()(
  "TooManyCertificates",
  {},
) {}
export class TooManyCookieNamesInWhiteList extends S.TaggedError<TooManyCookieNamesInWhiteList>()(
  "TooManyCookieNamesInWhiteList",
  {},
) {}
export class TooManyDistributionsAssociatedToCachePolicy extends S.TaggedError<TooManyDistributionsAssociatedToCachePolicy>()(
  "TooManyDistributionsAssociatedToCachePolicy",
  {},
) {}
export class TooManyDistributions extends S.TaggedError<TooManyDistributions>()(
  "TooManyDistributions",
  {},
) {}
export class TooManyDistributionsAssociatedToFieldLevelEncryptionConfig extends S.TaggedError<TooManyDistributionsAssociatedToFieldLevelEncryptionConfig>()(
  "TooManyDistributionsAssociatedToFieldLevelEncryptionConfig",
  {},
) {}
export class TooManyDistributionsAssociatedToKeyGroup extends S.TaggedError<TooManyDistributionsAssociatedToKeyGroup>()(
  "TooManyDistributionsAssociatedToKeyGroup",
  {},
) {}
export class TooManyDistributionsAssociatedToOriginAccessControl extends S.TaggedError<TooManyDistributionsAssociatedToOriginAccessControl>()(
  "TooManyDistributionsAssociatedToOriginAccessControl",
  {},
) {}
export class TooManyDistributionsAssociatedToOriginRequestPolicy extends S.TaggedError<TooManyDistributionsAssociatedToOriginRequestPolicy>()(
  "TooManyDistributionsAssociatedToOriginRequestPolicy",
  {},
) {}
export class TooManyDistributionsAssociatedToResponseHeadersPolicy extends S.TaggedError<TooManyDistributionsAssociatedToResponseHeadersPolicy>()(
  "TooManyDistributionsAssociatedToResponseHeadersPolicy",
  {},
) {}
export class TooManyDistributionsWithFunctionAssociations extends S.TaggedError<TooManyDistributionsWithFunctionAssociations>()(
  "TooManyDistributionsWithFunctionAssociations",
  {},
) {}
export class TooManyDistributionsWithLambdaAssociations extends S.TaggedError<TooManyDistributionsWithLambdaAssociations>()(
  "TooManyDistributionsWithLambdaAssociations",
  {},
) {}
export class TooManyDistributionsWithSingleFunctionARN extends S.TaggedError<TooManyDistributionsWithSingleFunctionARN>()(
  "TooManyDistributionsWithSingleFunctionARN",
  {},
) {}
export class TooManyFunctionAssociations extends S.TaggedError<TooManyFunctionAssociations>()(
  "TooManyFunctionAssociations",
  {},
) {}
export class TooManyHeadersInForwardedValues extends S.TaggedError<TooManyHeadersInForwardedValues>()(
  "TooManyHeadersInForwardedValues",
  {},
) {}
export class TooManyKeyGroupsAssociatedToDistribution extends S.TaggedError<TooManyKeyGroupsAssociatedToDistribution>()(
  "TooManyKeyGroupsAssociatedToDistribution",
  {},
) {}
export class TooManyLambdaFunctionAssociations extends S.TaggedError<TooManyLambdaFunctionAssociations>()(
  "TooManyLambdaFunctionAssociations",
  {},
) {}
export class TooManyOriginCustomHeaders extends S.TaggedError<TooManyOriginCustomHeaders>()(
  "TooManyOriginCustomHeaders",
  {},
) {}
export class TooManyOriginGroupsPerDistribution extends S.TaggedError<TooManyOriginGroupsPerDistribution>()(
  "TooManyOriginGroupsPerDistribution",
  {},
) {}
export class TooManyOrigins extends S.TaggedError<TooManyOrigins>()(
  "TooManyOrigins",
  {},
) {}
export class TooManyQueryStringParameters extends S.TaggedError<TooManyQueryStringParameters>()(
  "TooManyQueryStringParameters",
  {},
) {}
export class TrustedKeyGroupDoesNotExist extends S.TaggedError<TrustedKeyGroupDoesNotExist>()(
  "TrustedKeyGroupDoesNotExist",
  {},
) {}

//# Operations
/**
 * Deletes the resource policy attached to the CloudFront resource.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      AccessDenied,
      EntityNotFound,
      IllegalDelete,
      InvalidArgument,
      PreconditionFailed,
      UnsupportedOperation,
    ],
  }),
);
/**
 * Deletes a trust store.
 */
export const deleteTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrustStoreRequest,
  output: DeleteTrustStoreResponse,
  errors: [
    AccessDenied,
    CannotDeleteEntityWhileInUse,
    EntityNotFound,
    InvalidArgument,
    InvalidIfMatchVersion,
    PreconditionFailed,
  ],
}));
/**
 * Associates the WAF web ACL with a distribution tenant.
 */
export const associateDistributionTenantWebACL =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateDistributionTenantWebACLRequest,
    output: AssociateDistributionTenantWebACLResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      InvalidArgument,
      InvalidIfMatchVersion,
      PreconditionFailed,
    ],
  }));
/**
 * Associates the WAF web ACL with a distribution.
 */
export const associateDistributionWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateDistributionWebACLRequest,
    output: AssociateDistributionWebACLResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      InvalidArgument,
      InvalidIfMatchVersion,
      PreconditionFailed,
    ],
  }),
);
/**
 * Deletes an Anycast static IP list.
 */
export const deleteAnycastIpList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAnycastIpListRequest,
  output: DeleteAnycastIpListResponse,
  errors: [
    AccessDenied,
    CannotDeleteEntityWhileInUse,
    EntityNotFound,
    IllegalDelete,
    InvalidArgument,
    InvalidIfMatchVersion,
    PreconditionFailed,
    UnsupportedOperation,
  ],
}));
/**
 * Deletes a connection function.
 */
export const deleteConnectionFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConnectionFunctionRequest,
    output: DeleteConnectionFunctionResponse,
    errors: [
      AccessDenied,
      CannotDeleteEntityWhileInUse,
      EntityNotFound,
      InvalidArgument,
      InvalidIfMatchVersion,
      PreconditionFailed,
      UnsupportedOperation,
    ],
  }),
);
/**
 * Deletes a distribution tenant. If you use this API operation to delete a distribution tenant that is currently enabled, the request will fail.
 *
 * To delete a distribution tenant, you must first disable the distribution tenant by using the `UpdateDistributionTenant` API operation.
 */
export const deleteDistributionTenant = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDistributionTenantRequest,
    output: DeleteDistributionTenantResponse,
    errors: [
      AccessDenied,
      EntityNotFound,
      InvalidIfMatchVersion,
      PreconditionFailed,
      ResourceNotDisabled,
    ],
  }),
);
/**
 * Deletes a key group.
 *
 * You cannot delete a key group that is referenced in a cache behavior. First update your distributions to remove the key group from all cache behaviors, then delete the key group.
 *
 * To delete a key group, you must provide the key group's identifier and version. To get these values, use `ListKeyGroups` followed by `GetKeyGroup` or `GetKeyGroupConfig`.
 */
export const deleteKeyGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKeyGroupRequest,
  output: DeleteKeyGroupResponse,
  errors: [
    InvalidIfMatchVersion,
    NoSuchResource,
    PreconditionFailed,
    ResourceInUse,
  ],
}));
/**
 * Specifies the key value store to delete.
 */
export const deleteKeyValueStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKeyValueStoreRequest,
  output: DeleteKeyValueStoreResponse,
  errors: [
    AccessDenied,
    CannotDeleteEntityWhileInUse,
    EntityNotFound,
    InvalidIfMatchVersion,
    PreconditionFailed,
    UnsupportedOperation,
  ],
}));
/**
 * Gets configuration information and metadata about a CloudFront function, but not the function's code. To get a function's code, use `GetFunction`.
 *
 * To get configuration information and metadata about a function, you must provide the function's name and stage. To get these values, you can use `ListFunctions`.
 */
export const describeFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFunctionRequest,
  output: DescribeFunctionResult,
  errors: [NoSuchFunctionExists, UnsupportedOperation],
}));
/**
 * Disassociates a distribution tenant from the WAF web ACL.
 */
export const disassociateDistributionTenantWebACL =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateDistributionTenantWebACLRequest,
    output: DisassociateDistributionTenantWebACLResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      InvalidArgument,
      InvalidIfMatchVersion,
      PreconditionFailed,
    ],
  }));
/**
 * Disassociates a distribution from the WAF web ACL.
 */
export const disassociateDistributionWebACL =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateDistributionWebACLRequest,
    output: DisassociateDistributionWebACLResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      InvalidArgument,
      InvalidIfMatchVersion,
      PreconditionFailed,
    ],
  }));
/**
 * Gets a cache policy configuration.
 *
 * To get a cache policy configuration, you must provide the policy's identifier. If the cache policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the cache policy is not attached to a cache behavior, you can get the identifier using `ListCachePolicies`.
 */
export const getCachePolicyConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCachePolicyConfigRequest,
    output: GetCachePolicyConfigResult,
    errors: [AccessDenied, NoSuchCachePolicy],
  }),
);
/**
 * Get the configuration information about an origin access identity.
 */
export const getCloudFrontOriginAccessIdentityConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCloudFrontOriginAccessIdentityConfigRequest,
    output: GetCloudFrontOriginAccessIdentityConfigResult,
    errors: [AccessDenied, NoSuchCloudFrontOriginAccessIdentity],
  }));
/**
 * Gets a connection function.
 */
export const getConnectionFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConnectionFunctionRequest,
    output: GetConnectionFunctionResult,
    errors: [AccessDenied, EntityNotFound, UnsupportedOperation],
  }),
);
/**
 * Gets information about a connection group.
 */
export const getConnectionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionGroupRequest,
  output: GetConnectionGroupResult,
  errors: [AccessDenied, EntityNotFound],
}));
/**
 * Gets information about a connection group by using the endpoint that you specify.
 */
export const getConnectionGroupByRoutingEndpoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConnectionGroupByRoutingEndpointRequest,
    output: GetConnectionGroupByRoutingEndpointResult,
    errors: [AccessDenied, EntityNotFound],
  }));
/**
 * Gets configuration information about a continuous deployment policy.
 */
export const getContinuousDeploymentPolicyConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetContinuousDeploymentPolicyConfigRequest,
    output: GetContinuousDeploymentPolicyConfigResult,
    errors: [AccessDenied, NoSuchContinuousDeploymentPolicy],
  }));
/**
 * Get the information about a distribution.
 */
export const getDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDistributionRequest,
  output: GetDistributionResult,
  errors: [AccessDenied, NoSuchDistribution],
}));
/**
 * Get the configuration information about a distribution.
 */
export const getDistributionConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDistributionConfigRequest,
    output: GetDistributionConfigResult,
    errors: [AccessDenied, NoSuchDistribution],
  }),
);
/**
 * Gets information about a distribution tenant by the associated domain.
 */
export const getDistributionTenantByDomain =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDistributionTenantByDomainRequest,
    output: GetDistributionTenantByDomainResult,
    errors: [AccessDenied, EntityNotFound],
  }));
/**
 * Get the field-level encryption configuration information.
 */
export const getFieldLevelEncryptionConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetFieldLevelEncryptionConfigRequest,
    output: GetFieldLevelEncryptionConfigResult,
    errors: [AccessDenied, NoSuchFieldLevelEncryptionConfig],
  }));
/**
 * Get the field-level encryption profile configuration information.
 */
export const getFieldLevelEncryptionProfileConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetFieldLevelEncryptionProfileConfigRequest,
    output: GetFieldLevelEncryptionProfileConfigResult,
    errors: [AccessDenied, NoSuchFieldLevelEncryptionProfile],
  }));
/**
 * Gets the code of a CloudFront function. To get configuration information and metadata about a function, use `DescribeFunction`.
 *
 * To get a function's code, you must provide the function's name and stage. To get these values, you can use `ListFunctions`.
 */
export const getFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionRequest,
  output: GetFunctionResult,
  errors: [NoSuchFunctionExists, UnsupportedOperation],
}));
/**
 * Gets information about a specific invalidation for a distribution tenant.
 */
export const getInvalidationForDistributionTenant =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetInvalidationForDistributionTenantRequest,
    output: GetInvalidationForDistributionTenantResult,
    errors: [AccessDenied, EntityNotFound, NoSuchInvalidation],
  }));
/**
 * Gets a key group configuration.
 *
 * To get a key group configuration, you must provide the key group's identifier. If the key group is referenced in a distribution's cache behavior, you can get the key group's identifier using `ListDistributions` or `GetDistribution`. If the key group is not referenced in a cache behavior, you can get the identifier using `ListKeyGroups`.
 */
export const getKeyGroupConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyGroupConfigRequest,
  output: GetKeyGroupConfigResult,
  errors: [NoSuchResource],
}));
/**
 * Gets information about whether additional CloudWatch metrics are enabled for the specified CloudFront distribution.
 */
export const getMonitoringSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMonitoringSubscriptionRequest,
    output: GetMonitoringSubscriptionResult,
    errors: [
      AccessDenied,
      NoSuchDistribution,
      NoSuchMonitoringSubscription,
      UnsupportedOperation,
    ],
  }),
);
/**
 * Gets a CloudFront origin access control configuration.
 */
export const getOriginAccessControlConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetOriginAccessControlConfigRequest,
    output: GetOriginAccessControlConfigResult,
    errors: [AccessDenied, NoSuchOriginAccessControl],
  }));
/**
 * Gets an origin request policy configuration.
 *
 * To get an origin request policy configuration, you must provide the policy's identifier. If the origin request policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the origin request policy is not attached to a cache behavior, you can get the identifier using `ListOriginRequestPolicies`.
 */
export const getOriginRequestPolicyConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetOriginRequestPolicyConfigRequest,
    output: GetOriginRequestPolicyConfigResult,
    errors: [AccessDenied, NoSuchOriginRequestPolicy],
  }));
/**
 * Gets a public key configuration.
 */
export const getPublicKeyConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPublicKeyConfigRequest,
  output: GetPublicKeyConfigResult,
  errors: [AccessDenied, NoSuchPublicKey],
}));
/**
 * Retrieves the resource policy for the specified CloudFront resource that you own and have shared.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Gets a response headers policy configuration.
 *
 * To get a response headers policy configuration, you must provide the policy's identifier. If the response headers policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the response headers policy is not attached to a cache behavior, you can get the identifier using `ListResponseHeadersPolicies`.
 */
export const getResponseHeadersPolicyConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetResponseHeadersPolicyConfigRequest,
    output: GetResponseHeadersPolicyConfigResult,
    errors: [AccessDenied, NoSuchResponseHeadersPolicy],
  }));
/**
 * Get the configuration information about a streaming distribution.
 */
export const getStreamingDistributionConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetStreamingDistributionConfigRequest,
    output: GetStreamingDistributionConfigResult,
    errors: [AccessDenied, NoSuchStreamingDistribution],
  }));
/**
 * Get the details of an Amazon CloudFront VPC origin.
 */
export const getVpcOrigin = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVpcOriginRequest,
  output: GetVpcOriginResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Lists connection functions.
 */
export const listConnectionFunctions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConnectionFunctionsRequest,
    output: ListConnectionFunctionsResult,
    errors: [AccessDenied, InvalidArgument, UnsupportedOperation],
  }),
);
/**
 * Lists the distributions in your account that are associated with the specified `AnycastIpListId`.
 */
export const listDistributionsByAnycastIpListId =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDistributionsByAnycastIpListIdRequest,
    output: ListDistributionsByAnycastIpListIdResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      InvalidArgument,
      UnsupportedOperation,
    ],
  }));
/**
 * Lists distributions by connection function.
 */
export const listDistributionsByConnectionFunction =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDistributionsByConnectionFunctionRequest,
    output: ListDistributionsByConnectionFunctionResult,
    errors: [AccessDenied, EntityNotFound, InvalidArgument],
  }));
/**
 * Lists the distributions by the connection mode that you specify.
 */
export const listDistributionsByConnectionMode =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDistributionsByConnectionModeRequest,
    output: ListDistributionsByConnectionModeResult,
    errors: [AccessDenied, InvalidArgument],
  }));
/**
 * Gets a list of distribution IDs for distributions that have a cache behavior that references the specified key group.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listDistributionsByKeyGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDistributionsByKeyGroupRequest,
    output: ListDistributionsByKeyGroupResult,
    errors: [InvalidArgument, NoSuchResource],
  }),
);
/**
 * Gets a list of distribution IDs for distributions that have a cache behavior that's associated with the specified origin request policy.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listDistributionsByOriginRequestPolicyId =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDistributionsByOriginRequestPolicyIdRequest,
    output: ListDistributionsByOriginRequestPolicyIdResult,
    errors: [AccessDenied, InvalidArgument, NoSuchOriginRequestPolicy],
  }));
/**
 * Gets a list of distributions that have a cache behavior that's associated with the specified real-time log configuration.
 *
 * You can specify the real-time log configuration by its name or its Amazon Resource Name (ARN). You must provide at least one. If you provide both, CloudFront uses the name to identify the real-time log configuration to list distributions for.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listDistributionsByRealtimeLogConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDistributionsByRealtimeLogConfigRequest,
    output: ListDistributionsByRealtimeLogConfigResult,
    errors: [InvalidArgument],
  }));
/**
 * Gets a list of distribution IDs for distributions that have a cache behavior that's associated with the specified response headers policy.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listDistributionsByResponseHeadersPolicyId =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDistributionsByResponseHeadersPolicyIdRequest,
    output: ListDistributionsByResponseHeadersPolicyIdResult,
    errors: [AccessDenied, InvalidArgument, NoSuchResponseHeadersPolicy],
  }));
/**
 * Lists distributions by trust store.
 */
export const listDistributionsByTrustStore =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDistributionsByTrustStoreRequest,
    output: ListDistributionsByTrustStoreResult,
    errors: [AccessDenied, EntityNotFound, InvalidArgument],
  }));
/**
 * List CloudFront distributions by their VPC origin ID.
 */
export const listDistributionsByVpcOriginId =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDistributionsByVpcOriginIdRequest,
    output: ListDistributionsByVpcOriginIdResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      InvalidArgument,
      UnsupportedOperation,
    ],
  }));
/**
 * Lists the invalidations for a distribution tenant.
 */
export const listInvalidationsForDistributionTenant =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListInvalidationsForDistributionTenantRequest,
    output: ListInvalidationsForDistributionTenantResult,
    errors: [AccessDenied, EntityNotFound, InvalidArgument],
  }));
/**
 * List tags for a CloudFront resource. For more information, see Tagging a distribution in the *Amazon CloudFront Developer Guide*.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [AccessDenied, InvalidArgument, InvalidTagging, NoSuchResource],
}));
/**
 * Publishes a connection function.
 */
export const publishConnectionFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PublishConnectionFunctionRequest,
    output: PublishConnectionFunctionResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      InvalidArgument,
      InvalidIfMatchVersion,
      PreconditionFailed,
      UnsupportedOperation,
    ],
  }),
);
/**
 * Publishes a CloudFront function by copying the function code from the `DEVELOPMENT` stage to `LIVE`. This automatically updates all cache behaviors that are using this function to use the newly published copy in the `LIVE` stage.
 *
 * When a function is published to the `LIVE` stage, you can attach the function to a distribution's cache behavior, using the function's Amazon Resource Name (ARN).
 *
 * To publish a function, you must provide the function's name and version (`ETag` value). To get these values, you can use `ListFunctions` and `DescribeFunction`.
 */
export const publishFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishFunctionRequest,
  output: PublishFunctionResult,
  errors: [
    InvalidArgument,
    InvalidIfMatchVersion,
    NoSuchFunctionExists,
    PreconditionFailed,
    UnsupportedOperation,
  ],
}));
/**
 * Creates a resource control policy for a given CloudFront resource.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResult,
  errors: [
    AccessDenied,
    EntityNotFound,
    IllegalUpdate,
    InvalidArgument,
    PreconditionFailed,
    UnsupportedOperation,
  ],
}));
/**
 * Add tags to a CloudFront resource. For more information, see Tagging a distribution in the *Amazon CloudFront Developer Guide*.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [AccessDenied, InvalidArgument, InvalidTagging, NoSuchResource],
}));
/**
 * Remove tags from a CloudFront resource. For more information, see Tagging a distribution in the *Amazon CloudFront Developer Guide*.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [AccessDenied, InvalidArgument, InvalidTagging, NoSuchResource],
}));
/**
 * Updates an Anycast static IP list.
 */
export const updateAnycastIpList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAnycastIpListRequest,
  output: UpdateAnycastIpListResult,
  errors: [
    AccessDenied,
    EntityNotFound,
    InvalidArgument,
    InvalidIfMatchVersion,
    PreconditionFailed,
    UnsupportedOperation,
  ],
}));
/**
 * We recommend that you use the `UpdateDomainAssociation` API operation to move a domain association, as it supports both standard distributions and distribution tenants. AssociateAlias performs similar checks but only supports standard distributions.
 *
 * Moves a domain from its current standard distribution or distribution tenant to another one.
 *
 * You must first disable the source distribution (standard distribution or distribution tenant) and then separately call this operation to move the domain to another target distribution (standard distribution or distribution tenant).
 *
 * To use this operation, specify the domain and the ID of the target resource (standard distribution or distribution tenant). For more information, including how to set up the target resource, prerequisites that you must complete, and other restrictions, see Moving an alternate domain name to a different standard distribution or distribution tenant in the *Amazon CloudFront Developer Guide*.
 */
export const updateDomainAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDomainAssociationRequest,
    output: UpdateDomainAssociationResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      IllegalUpdate,
      InvalidArgument,
      InvalidIfMatchVersion,
      PreconditionFailed,
    ],
  }),
);
/**
 * Specifies the key value store to update.
 */
export const updateKeyValueStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKeyValueStoreRequest,
  output: UpdateKeyValueStoreResult,
  errors: [
    AccessDenied,
    EntityNotFound,
    InvalidArgument,
    InvalidIfMatchVersion,
    PreconditionFailed,
    UnsupportedOperation,
  ],
}));
/**
 * Updates a real-time log configuration.
 *
 * When you update a real-time log configuration, all the parameters are updated with the values provided in the request. You cannot update some parameters independent of others. To update a real-time log configuration:
 *
 * - Call `GetRealtimeLogConfig` to get the current real-time log configuration.
 *
 * - Locally modify the parameters in the real-time log configuration that you want to update.
 *
 * - Call this API (`UpdateRealtimeLogConfig`) by providing the entire real-time log configuration, including the parameters that you modified and those that you didn't.
 *
 * You cannot update a real-time log configuration's `Name` or `ARN`.
 */
export const updateRealtimeLogConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRealtimeLogConfigRequest,
    output: UpdateRealtimeLogConfigResult,
    errors: [AccessDenied, InvalidArgument, NoSuchRealtimeLogConfig],
  }),
);
/**
 * Updates a trust store.
 */
export const updateTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrustStoreRequest,
  output: UpdateTrustStoreResult,
  errors: [
    AccessDenied,
    EntityNotFound,
    InvalidArgument,
    InvalidIfMatchVersion,
    PreconditionFailed,
  ],
}));
/**
 * Creates a connection group.
 */
export const createConnectionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConnectionGroupRequest,
    output: CreateConnectionGroupResult,
    errors: [
      AccessDenied,
      EntityAlreadyExists,
      EntityLimitExceeded,
      EntityNotFound,
      InvalidArgument,
      InvalidTagging,
    ],
  }),
);
/**
 * Specifies the key value store resource to add to your account. In your account, the key value store names must be unique. You can also import key value store data in JSON format from an S3 bucket by providing a valid `ImportSource` that you own.
 */
export const createKeyValueStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKeyValueStoreRequest,
  output: CreateKeyValueStoreResult,
  errors: [
    AccessDenied,
    EntityAlreadyExists,
    EntityLimitExceeded,
    EntitySizeLimitExceeded,
    InvalidArgument,
    UnsupportedOperation,
  ],
}));
/**
 * Deletes a cache policy.
 *
 * You cannot delete a cache policy if it's attached to a cache behavior. First update your distributions to remove the cache policy from all cache behaviors, then delete the cache policy.
 *
 * To delete a cache policy, you must provide the policy's identifier and version. To get these values, you can use `ListCachePolicies` or `GetCachePolicy`.
 */
export const deleteCachePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCachePolicyRequest,
  output: DeleteCachePolicyResponse,
  errors: [
    AccessDenied,
    CachePolicyInUse,
    IllegalDelete,
    InvalidIfMatchVersion,
    NoSuchCachePolicy,
    PreconditionFailed,
  ],
}));
/**
 * Delete an origin access identity.
 */
export const deleteCloudFrontOriginAccessIdentity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCloudFrontOriginAccessIdentityRequest,
    output: DeleteCloudFrontOriginAccessIdentityResponse,
    errors: [
      AccessDenied,
      CloudFrontOriginAccessIdentityInUse,
      InvalidIfMatchVersion,
      NoSuchCloudFrontOriginAccessIdentity,
      PreconditionFailed,
    ],
  }));
/**
 * Deletes a connection group.
 */
export const deleteConnectionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConnectionGroupRequest,
    output: DeleteConnectionGroupResponse,
    errors: [
      AccessDenied,
      CannotDeleteEntityWhileInUse,
      EntityNotFound,
      InvalidIfMatchVersion,
      PreconditionFailed,
      ResourceNotDisabled,
    ],
  }),
);
/**
 * Deletes a continuous deployment policy.
 *
 * You cannot delete a continuous deployment policy that's attached to a primary distribution. First update your distribution to remove the continuous deployment policy, then you can delete the policy.
 */
export const deleteContinuousDeploymentPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteContinuousDeploymentPolicyRequest,
    output: DeleteContinuousDeploymentPolicyResponse,
    errors: [
      AccessDenied,
      ContinuousDeploymentPolicyInUse,
      InvalidArgument,
      InvalidIfMatchVersion,
      NoSuchContinuousDeploymentPolicy,
      PreconditionFailed,
    ],
  }));
/**
 * Delete a distribution.
 *
 * Before you can delete a distribution, you must disable it, which requires permission to update the distribution. Once deleted, a distribution cannot be recovered.
 */
export const deleteDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDistributionRequest,
  output: DeleteDistributionResponse,
  errors: [
    AccessDenied,
    DistributionNotDisabled,
    InvalidIfMatchVersion,
    NoSuchDistribution,
    PreconditionFailed,
    ResourceInUse,
  ],
}));
/**
 * Remove a field-level encryption configuration.
 */
export const deleteFieldLevelEncryptionConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteFieldLevelEncryptionConfigRequest,
    output: DeleteFieldLevelEncryptionConfigResponse,
    errors: [
      AccessDenied,
      FieldLevelEncryptionConfigInUse,
      InvalidIfMatchVersion,
      NoSuchFieldLevelEncryptionConfig,
      PreconditionFailed,
    ],
  }));
/**
 * Remove a field-level encryption profile.
 */
export const deleteFieldLevelEncryptionProfile =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteFieldLevelEncryptionProfileRequest,
    output: DeleteFieldLevelEncryptionProfileResponse,
    errors: [
      AccessDenied,
      FieldLevelEncryptionProfileInUse,
      InvalidIfMatchVersion,
      NoSuchFieldLevelEncryptionProfile,
      PreconditionFailed,
    ],
  }));
/**
 * Deletes a CloudFront function.
 *
 * You cannot delete a function if it's associated with a cache behavior. First, update your distributions to remove the function association from all cache behaviors, then delete the function.
 *
 * To delete a function, you must provide the function's name and version (`ETag` value). To get these values, you can use `ListFunctions` and `DescribeFunction`.
 */
export const deleteFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFunctionRequest,
  output: DeleteFunctionResponse,
  errors: [
    FunctionInUse,
    InvalidIfMatchVersion,
    NoSuchFunctionExists,
    PreconditionFailed,
    UnsupportedOperation,
  ],
}));
/**
 * Disables additional CloudWatch metrics for the specified CloudFront distribution.
 */
export const deleteMonitoringSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteMonitoringSubscriptionRequest,
    output: DeleteMonitoringSubscriptionResult,
    errors: [
      AccessDenied,
      NoSuchDistribution,
      NoSuchMonitoringSubscription,
      UnsupportedOperation,
    ],
  }));
/**
 * Deletes a CloudFront origin access control.
 *
 * You cannot delete an origin access control if it's in use. First, update all distributions to remove the origin access control from all origins, then delete the origin access control.
 */
export const deleteOriginAccessControl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteOriginAccessControlRequest,
    output: DeleteOriginAccessControlResponse,
    errors: [
      AccessDenied,
      InvalidIfMatchVersion,
      NoSuchOriginAccessControl,
      OriginAccessControlInUse,
      PreconditionFailed,
    ],
  }),
);
/**
 * Remove a public key you previously added to CloudFront.
 */
export const deletePublicKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePublicKeyRequest,
  output: DeletePublicKeyResponse,
  errors: [
    AccessDenied,
    InvalidIfMatchVersion,
    NoSuchPublicKey,
    PreconditionFailed,
    PublicKeyInUse,
  ],
}));
/**
 * Deletes a response headers policy.
 *
 * You cannot delete a response headers policy if it's attached to a cache behavior. First update your distributions to remove the response headers policy from all cache behaviors, then delete the response headers policy.
 *
 * To delete a response headers policy, you must provide the policy's identifier and version. To get these values, you can use `ListResponseHeadersPolicies` or `GetResponseHeadersPolicy`.
 */
export const deleteResponseHeadersPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResponseHeadersPolicyRequest,
    output: DeleteResponseHeadersPolicyResponse,
    errors: [
      AccessDenied,
      IllegalDelete,
      InvalidIfMatchVersion,
      NoSuchResponseHeadersPolicy,
      PreconditionFailed,
      ResponseHeadersPolicyInUse,
    ],
  }),
);
/**
 * Delete a streaming distribution. To delete an RTMP distribution using the CloudFront API, perform the following steps.
 *
 * **To delete an RTMP distribution using the CloudFront API**:
 *
 * - Disable the RTMP distribution.
 *
 * - Submit a `GET Streaming Distribution Config` request to get the current configuration and the `Etag` header for the distribution.
 *
 * - Update the XML document that was returned in the response to your `GET Streaming Distribution Config` request to change the value of `Enabled` to `false`.
 *
 * - Submit a `PUT Streaming Distribution Config` request to update the configuration for your distribution. In the request body, include the XML document that you updated in Step 3. Then set the value of the HTTP `If-Match` header to the value of the `ETag` header that CloudFront returned when you submitted the `GET Streaming Distribution Config` request in Step 2.
 *
 * - Review the response to the `PUT Streaming Distribution Config` request to confirm that the distribution was successfully disabled.
 *
 * - Submit a `GET Streaming Distribution Config` request to confirm that your changes have propagated. When propagation is complete, the value of `Status` is `Deployed`.
 *
 * - Submit a `DELETE Streaming Distribution` request. Set the value of the HTTP `If-Match` header to the value of the `ETag` header that CloudFront returned when you submitted the `GET Streaming Distribution Config` request in Step 2.
 *
 * - Review the response to your `DELETE Streaming Distribution` request to confirm that the distribution was successfully deleted.
 *
 * For information about deleting a distribution using the CloudFront console, see Deleting a Distribution in the *Amazon CloudFront Developer Guide*.
 */
export const deleteStreamingDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteStreamingDistributionRequest,
    output: DeleteStreamingDistributionResponse,
    errors: [
      AccessDenied,
      InvalidIfMatchVersion,
      NoSuchStreamingDistribution,
      PreconditionFailed,
      StreamingDistributionNotDisabled,
    ],
  }),
);
/**
 * Delete an Amazon CloudFront VPC origin.
 */
export const deleteVpcOrigin = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVpcOriginRequest,
  output: DeleteVpcOriginResult,
  errors: [
    AccessDenied,
    CannotDeleteEntityWhileInUse,
    EntityNotFound,
    IllegalDelete,
    InvalidArgument,
    InvalidIfMatchVersion,
    PreconditionFailed,
    UnsupportedOperation,
  ],
}));
/**
 * Describes a connection function.
 */
export const describeConnectionFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConnectionFunctionRequest,
    output: DescribeConnectionFunctionResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      InvalidArgument,
      UnsupportedOperation,
    ],
  }),
);
/**
 * Specifies the key value store and its configuration.
 */
export const describeKeyValueStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeKeyValueStoreRequest,
    output: DescribeKeyValueStoreResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      InvalidArgument,
      UnsupportedOperation,
    ],
  }),
);
/**
 * Gets a cache policy, including the following metadata:
 *
 * - The policy's identifier.
 *
 * - The date and time when the policy was last modified.
 *
 * To get a cache policy, you must provide the policy's identifier. If the cache policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the cache policy is not attached to a cache behavior, you can get the identifier using `ListCachePolicies`.
 */
export const getCachePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCachePolicyRequest,
  output: GetCachePolicyResult,
  errors: [AccessDenied, NoSuchCachePolicy],
}));
/**
 * Get the information about an origin access identity.
 */
export const getCloudFrontOriginAccessIdentity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCloudFrontOriginAccessIdentityRequest,
    output: GetCloudFrontOriginAccessIdentityResult,
    errors: [AccessDenied, NoSuchCloudFrontOriginAccessIdentity],
  }));
/**
 * Gets a continuous deployment policy, including metadata (the policy's identifier and the date and time when the policy was last modified).
 */
export const getContinuousDeploymentPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetContinuousDeploymentPolicyRequest,
    output: GetContinuousDeploymentPolicyResult,
    errors: [AccessDenied, NoSuchContinuousDeploymentPolicy],
  }));
/**
 * Get the field-level encryption configuration information.
 */
export const getFieldLevelEncryption = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFieldLevelEncryptionRequest,
    output: GetFieldLevelEncryptionResult,
    errors: [AccessDenied, NoSuchFieldLevelEncryptionConfig],
  }),
);
/**
 * Get the field-level encryption profile information.
 */
export const getFieldLevelEncryptionProfile =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetFieldLevelEncryptionProfileRequest,
    output: GetFieldLevelEncryptionProfileResult,
    errors: [AccessDenied, NoSuchFieldLevelEncryptionProfile],
  }));
/**
 * Get the information about an invalidation.
 */
export const getInvalidation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvalidationRequest,
  output: GetInvalidationResult,
  errors: [AccessDenied, NoSuchDistribution, NoSuchInvalidation],
}));
/**
 * Gets a key group, including the date and time when the key group was last modified.
 *
 * To get a key group, you must provide the key group's identifier. If the key group is referenced in a distribution's cache behavior, you can get the key group's identifier using `ListDistributions` or `GetDistribution`. If the key group is not referenced in a cache behavior, you can get the identifier using `ListKeyGroups`.
 */
export const getKeyGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyGroupRequest,
  output: GetKeyGroupResult,
  errors: [NoSuchResource],
}));
/**
 * Gets a CloudFront origin access control, including its unique identifier.
 */
export const getOriginAccessControl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOriginAccessControlRequest,
    output: GetOriginAccessControlResult,
    errors: [AccessDenied, NoSuchOriginAccessControl],
  }),
);
/**
 * Gets an origin request policy, including the following metadata:
 *
 * - The policy's identifier.
 *
 * - The date and time when the policy was last modified.
 *
 * To get an origin request policy, you must provide the policy's identifier. If the origin request policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the origin request policy is not attached to a cache behavior, you can get the identifier using `ListOriginRequestPolicies`.
 */
export const getOriginRequestPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOriginRequestPolicyRequest,
    output: GetOriginRequestPolicyResult,
    errors: [AccessDenied, NoSuchOriginRequestPolicy],
  }),
);
/**
 * Gets a public key.
 */
export const getPublicKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPublicKeyRequest,
  output: GetPublicKeyResult,
  errors: [AccessDenied, NoSuchPublicKey],
}));
/**
 * Gets a real-time log configuration.
 *
 * To get a real-time log configuration, you can provide the configuration's name or its Amazon Resource Name (ARN). You must provide at least one. If you provide both, CloudFront uses the name to identify the real-time log configuration to get.
 */
export const getRealtimeLogConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRealtimeLogConfigRequest,
    output: GetRealtimeLogConfigResult,
    errors: [AccessDenied, InvalidArgument, NoSuchRealtimeLogConfig],
  }),
);
/**
 * Gets a response headers policy, including metadata (the policy's identifier and the date and time when the policy was last modified).
 *
 * To get a response headers policy, you must provide the policy's identifier. If the response headers policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the response headers policy is not attached to a cache behavior, you can get the identifier using `ListResponseHeadersPolicies`.
 */
export const getResponseHeadersPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResponseHeadersPolicyRequest,
    output: GetResponseHeadersPolicyResult,
    errors: [AccessDenied, NoSuchResponseHeadersPolicy],
  }),
);
/**
 * Gets information about a specified RTMP distribution, including the distribution configuration.
 */
export const getStreamingDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetStreamingDistributionRequest,
    output: GetStreamingDistributionResult,
    errors: [AccessDenied, NoSuchStreamingDistribution],
  }),
);
/**
 * Gets a trust store.
 */
export const getTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrustStoreRequest,
  output: GetTrustStoreResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
}));
/**
 * Gets a list of distribution IDs for distributions that have a cache behavior that's associated with the specified cache policy.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listDistributionsByCachePolicyId =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDistributionsByCachePolicyIdRequest,
    output: ListDistributionsByCachePolicyIdResult,
    errors: [AccessDenied, InvalidArgument, NoSuchCachePolicy],
  }));
/**
 * List the distributions that are associated with a specified WAF web ACL.
 */
export const listDistributionsByWebACLId = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDistributionsByWebACLIdRequest,
    output: ListDistributionsByWebACLIdResult,
    errors: [InvalidArgument, InvalidWebACLId],
  }),
);
/**
 * Lists the distribution tenants in your Amazon Web Services account.
 */
export const listDistributionTenants = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDistributionTenantsRequest,
    output: ListDistributionTenantsResult,
    errors: [AccessDenied, EntityNotFound, InvalidArgument],
  }),
);
/**
 * Lists distribution tenants by the customization that you specify.
 *
 * You must specify either the `CertificateArn` parameter or `WebACLArn` parameter, but not both in the same request.
 */
export const listDistributionTenantsByCustomization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDistributionTenantsByCustomizationRequest,
    output: ListDistributionTenantsByCustomizationResult,
    errors: [AccessDenied, EntityNotFound, InvalidArgument],
  }));
/**
 * Gets a list of all CloudFront functions in your Amazon Web Services account.
 *
 * You can optionally apply a filter to return only the functions that are in the specified stage, either `DEVELOPMENT` or `LIVE`.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listFunctions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFunctionsRequest,
  output: ListFunctionsResult,
  errors: [InvalidArgument, UnsupportedOperation],
}));
/**
 * Specifies the key value stores to list.
 */
export const listKeyValueStores = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListKeyValueStoresRequest,
  output: ListKeyValueStoresResult,
  errors: [AccessDenied, InvalidArgument, UnsupportedOperation],
}));
/**
 * Gets a list of real-time log configurations.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listRealtimeLogConfigs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRealtimeLogConfigsRequest,
    output: ListRealtimeLogConfigsResult,
    errors: [AccessDenied, InvalidArgument, NoSuchRealtimeLogConfig],
  }),
);
/**
 * Lists trust stores.
 */
export const listTrustStores = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrustStoresRequest,
  output: ListTrustStoresResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
}));
/**
 * Tests a CloudFront function.
 *
 * To test a function, you provide an *event object* that represents an HTTP request or response that your CloudFront distribution could receive in production. CloudFront runs the function, passing it the event object that you provided, and returns the function's result (the modified event object) in the response. The response also contains function logs and error messages, if any exist. For more information about testing functions, see Testing functions in the *Amazon CloudFront Developer Guide*.
 *
 * To test a function, you provide the function's name and version (`ETag` value) along with the event object. To get the function's name and version, you can use `ListFunctions` and `DescribeFunction`.
 */
export const testFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestFunctionRequest,
  output: TestFunctionResult,
  errors: [
    InvalidArgument,
    InvalidIfMatchVersion,
    NoSuchFunctionExists,
    TestFunctionFailed,
    UnsupportedOperation,
  ],
}));
/**
 * Updates a connection function.
 */
export const updateConnectionFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConnectionFunctionRequest,
    output: UpdateConnectionFunctionResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      EntitySizeLimitExceeded,
      InvalidArgument,
      InvalidIfMatchVersion,
      PreconditionFailed,
      UnsupportedOperation,
    ],
  }),
);
/**
 * Updates a connection group.
 */
export const updateConnectionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConnectionGroupRequest,
    output: UpdateConnectionGroupResult,
    errors: [
      AccessDenied,
      EntityAlreadyExists,
      EntityLimitExceeded,
      EntityNotFound,
      InvalidArgument,
      InvalidIfMatchVersion,
      PreconditionFailed,
      ResourceInUse,
    ],
  }),
);
/**
 * Updates a continuous deployment policy. You can update a continuous deployment policy to enable or disable it, to change the percentage of traffic that it sends to the staging distribution, or to change the staging distribution that it sends traffic to.
 *
 * When you update a continuous deployment policy configuration, all the fields are updated with the values that are provided in the request. You cannot update some fields independent of others. To update a continuous deployment policy configuration:
 *
 * - Use `GetContinuousDeploymentPolicyConfig` to get the current configuration.
 *
 * - Locally modify the fields in the continuous deployment policy configuration that you want to update.
 *
 * - Use `UpdateContinuousDeploymentPolicy`, providing the entire continuous deployment policy configuration, including the fields that you modified and those that you didn't.
 */
export const updateContinuousDeploymentPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateContinuousDeploymentPolicyRequest,
    output: UpdateContinuousDeploymentPolicyResult,
    errors: [
      AccessDenied,
      InconsistentQuantities,
      InvalidArgument,
      InvalidIfMatchVersion,
      NoSuchContinuousDeploymentPolicy,
      PreconditionFailed,
      StagingDistributionInUse,
    ],
  }));
/**
 * Updates a CloudFront function.
 *
 * You can update a function's code or the comment that describes the function. You cannot update a function's name.
 *
 * To update a function, you provide the function's name and version (`ETag` value) along with the updated function code. To get the name and version, you can use `ListFunctions` and `DescribeFunction`.
 */
export const updateFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFunctionRequest,
  output: UpdateFunctionResult,
  errors: [
    FunctionSizeLimitExceeded,
    InvalidArgument,
    InvalidIfMatchVersion,
    NoSuchFunctionExists,
    PreconditionFailed,
    UnsupportedOperation,
  ],
}));
/**
 * Updates a CloudFront origin access control.
 */
export const updateOriginAccessControl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateOriginAccessControlRequest,
    output: UpdateOriginAccessControlResult,
    errors: [
      AccessDenied,
      IllegalUpdate,
      InvalidArgument,
      InvalidIfMatchVersion,
      NoSuchOriginAccessControl,
      OriginAccessControlAlreadyExists,
      PreconditionFailed,
    ],
  }),
);
/**
 * Update public key information. Note that the only value you can change is the comment.
 */
export const updatePublicKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePublicKeyRequest,
  output: UpdatePublicKeyResult,
  errors: [
    AccessDenied,
    CannotChangeImmutablePublicKeyFields,
    IllegalUpdate,
    InvalidArgument,
    InvalidIfMatchVersion,
    NoSuchPublicKey,
    PreconditionFailed,
  ],
}));
/**
 * Update an Amazon CloudFront VPC origin in your account.
 */
export const updateVpcOrigin = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVpcOriginRequest,
  output: UpdateVpcOriginResult,
  errors: [
    AccessDenied,
    CannotUpdateEntityWhileInUse,
    EntityAlreadyExists,
    EntityLimitExceeded,
    EntityNotFound,
    IllegalUpdate,
    InconsistentQuantities,
    InvalidArgument,
    InvalidIfMatchVersion,
    PreconditionFailed,
    UnsupportedOperation,
  ],
}));
/**
 * Verify the DNS configuration for your domain names. This API operation checks whether your domain name points to the correct routing endpoint of the connection group, such as d111111abcdef8.cloudfront.net. You can use this API operation to troubleshoot and resolve DNS configuration issues.
 */
export const verifyDnsConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: VerifyDnsConfigurationRequest,
    output: VerifyDnsConfigurationResult,
    errors: [AccessDenied, EntityNotFound, InvalidArgument],
  }),
);
/**
 * The `AssociateAlias` API operation only supports standard distributions. To move domains between distribution tenants and/or standard distributions, we recommend that you use the UpdateDomainAssociation API operation instead.
 *
 * Associates an alias with a CloudFront standard distribution. An alias is commonly known as a custom domain or vanity domain. It can also be called a CNAME or alternate domain name.
 *
 * With this operation, you can move an alias that's already used for a standard distribution to a different standard distribution. This prevents the downtime that could occur if you first remove the alias from one standard distribution and then separately add the alias to another standard distribution.
 *
 * To use this operation, specify the alias and the ID of the target standard distribution.
 *
 * For more information, including how to set up the target standard distribution, prerequisites that you must complete, and other restrictions, see Moving an alternate domain name to a different standard distribution or distribution tenant in the *Amazon CloudFront Developer Guide*.
 */
export const associateAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAliasRequest,
  output: AssociateAliasResponse,
  errors: [
    AccessDenied,
    IllegalUpdate,
    InvalidArgument,
    NoSuchDistribution,
    TooManyDistributionCNAMEs,
  ],
}));
/**
 * Creates an Anycast static IP list.
 */
export const createAnycastIpList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAnycastIpListRequest,
  output: CreateAnycastIpListResult,
  errors: [
    AccessDenied,
    EntityAlreadyExists,
    EntityLimitExceeded,
    InvalidArgument,
    InvalidTagging,
    UnsupportedOperation,
  ],
}));
/**
 * Creates a distribution tenant.
 */
export const createDistributionTenant = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDistributionTenantRequest,
    output: CreateDistributionTenantResult,
    errors: [
      AccessDenied,
      CNAMEAlreadyExists,
      EntityAlreadyExists,
      EntityLimitExceeded,
      EntityNotFound,
      InvalidArgument,
      InvalidAssociation,
      InvalidTagging,
    ],
  }),
);
/**
 * Creates an invalidation for a distribution tenant. For more information, see Invalidating files in the *Amazon CloudFront Developer Guide*.
 */
export const createInvalidationForDistributionTenant =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateInvalidationForDistributionTenantRequest,
    output: CreateInvalidationForDistributionTenantResult,
    errors: [
      AccessDenied,
      BatchTooLarge,
      EntityNotFound,
      InconsistentQuantities,
      InvalidArgument,
      MissingBody,
      TooManyInvalidationsInProgress,
    ],
  }));
/**
 * Creates a key group that you can use with CloudFront signed URLs and signed cookies.
 *
 * To create a key group, you must specify at least one public key for the key group. After you create a key group, you can reference it from one or more cache behaviors. When you reference a key group in a cache behavior, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with a private key whose corresponding public key is in the key group. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see Serving private content in the *Amazon CloudFront Developer Guide*.
 */
export const createKeyGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKeyGroupRequest,
  output: CreateKeyGroupResult,
  errors: [
    InvalidArgument,
    KeyGroupAlreadyExists,
    TooManyKeyGroups,
    TooManyPublicKeysInKeyGroup,
  ],
}));
/**
 * Creates a new origin access control in CloudFront. After you create an origin access control, you can add it to an origin in a CloudFront distribution so that CloudFront sends authenticated (signed) requests to the origin.
 *
 * This makes it possible to block public access to the origin, allowing viewers (users) to access the origin's content only through CloudFront.
 *
 * For more information about using a CloudFront origin access control, see Restricting access to an Amazon Web Services origin in the *Amazon CloudFront Developer Guide*.
 */
export const createOriginAccessControl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateOriginAccessControlRequest,
    output: CreateOriginAccessControlResult,
    errors: [
      InvalidArgument,
      OriginAccessControlAlreadyExists,
      TooManyOriginAccessControls,
    ],
  }),
);
/**
 * Creates a trust store.
 */
export const createTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrustStoreRequest,
  output: CreateTrustStoreResult,
  errors: [
    AccessDenied,
    EntityAlreadyExists,
    EntityLimitExceeded,
    EntityNotFound,
    InvalidArgument,
    InvalidTagging,
  ],
}));
/**
 * Create an Amazon CloudFront VPC origin.
 */
export const createVpcOrigin = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcOriginRequest,
  output: CreateVpcOriginResult,
  errors: [
    AccessDenied,
    EntityAlreadyExists,
    EntityLimitExceeded,
    InconsistentQuantities,
    InvalidArgument,
    InvalidTagging,
    UnsupportedOperation,
  ],
}));
/**
 * Deletes an origin request policy.
 *
 * You cannot delete an origin request policy if it's attached to any cache behaviors. First update your distributions to remove the origin request policy from all cache behaviors, then delete the origin request policy.
 *
 * To delete an origin request policy, you must provide the policy's identifier and version. To get the identifier, you can use `ListOriginRequestPolicies` or `GetOriginRequestPolicy`.
 */
export const deleteOriginRequestPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteOriginRequestPolicyRequest,
    output: DeleteOriginRequestPolicyResponse,
    errors: [
      AccessDenied,
      IllegalDelete,
      InvalidIfMatchVersion,
      NoSuchOriginRequestPolicy,
      OriginRequestPolicyInUse,
      PreconditionFailed,
    ],
  }),
);
/**
 * Deletes a real-time log configuration.
 *
 * You cannot delete a real-time log configuration if it's attached to a cache behavior. First update your distributions to remove the real-time log configuration from all cache behaviors, then delete the real-time log configuration.
 *
 * To delete a real-time log configuration, you can provide the configuration's name or its Amazon Resource Name (ARN). You must provide at least one. If you provide both, CloudFront uses the name to identify the real-time log configuration to delete.
 */
export const deleteRealtimeLogConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRealtimeLogConfigRequest,
    output: DeleteRealtimeLogConfigResponse,
    errors: [
      AccessDenied,
      InvalidArgument,
      NoSuchRealtimeLogConfig,
      RealtimeLogConfigInUse,
    ],
  }),
);
/**
 * Gets an Anycast static IP list.
 */
export const getAnycastIpList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAnycastIpListRequest,
  output: GetAnycastIpListResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Gets information about a distribution tenant.
 */
export const getDistributionTenant = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDistributionTenantRequest,
    output: GetDistributionTenantResult,
    errors: [AccessDenied, EntityNotFound],
  }),
);
/**
 * Gets details about the CloudFront managed ACM certificate.
 */
export const getManagedCertificateDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetManagedCertificateDetailsRequest,
    output: GetManagedCertificateDetailsResult,
    errors: [AccessDenied, EntityNotFound],
  }));
/**
 * Lists your Anycast static IP lists.
 */
export const listAnycastIpLists = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAnycastIpListsRequest,
  output: ListAnycastIpListsResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Gets a list of cache policies.
 *
 * You can optionally apply a filter to return only the managed policies created by Amazon Web Services, or only the custom policies created in your Amazon Web Services account.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listCachePolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCachePoliciesRequest,
  output: ListCachePoliciesResult,
  errors: [AccessDenied, InvalidArgument, NoSuchCachePolicy],
}));
/**
 * Lists origin access identities.
 */
export const listCloudFrontOriginAccessIdentities =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCloudFrontOriginAccessIdentitiesRequest,
    output: ListCloudFrontOriginAccessIdentitiesResult,
    errors: [InvalidArgument],
  }));
/**
 * The `ListConflictingAliases` API operation only supports standard distributions. To list domain conflicts for both standard distributions and distribution tenants, we recommend that you use the ListDomainConflicts API operation instead.
 *
 * Gets a list of aliases that conflict or overlap with the provided alias, and the associated CloudFront standard distribution and Amazon Web Services accounts for each conflicting alias. An alias is commonly known as a custom domain or vanity domain. It can also be called a CNAME or alternate domain name.
 *
 * In the returned list, the standard distribution and account IDs are partially hidden, which allows you to identify the standard distribution and accounts that you own, and helps to protect the information of ones that you don't own.
 *
 * Use this operation to find aliases that are in use in CloudFront that conflict or overlap with the provided alias. For example, if you provide `www.example.com` as input, the returned list can include `www.example.com` and the overlapping wildcard alternate domain name (`*.example.com`), if they exist. If you provide `*.example.com` as input, the returned list can include `*.example.com` and any alternate domain names covered by that wildcard (for example, `www.example.com`, `test.example.com`, `dev.example.com`, and so on), if they exist.
 *
 * To list conflicting aliases, specify the alias to search and the ID of a standard distribution in your account that has an attached TLS certificate that includes the provided alias. For more information, including how to set up the standard distribution and certificate, see Moving an alternate domain name to a different standard distribution or distribution tenant in the *Amazon CloudFront Developer Guide*.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listConflictingAliases = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConflictingAliasesRequest,
    output: ListConflictingAliasesResult,
    errors: [InvalidArgument, NoSuchDistribution],
  }),
);
/**
 * Lists the connection groups in your Amazon Web Services account.
 */
export const listConnectionGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConnectionGroupsRequest,
    output: ListConnectionGroupsResult,
    errors: [AccessDenied, EntityNotFound, InvalidArgument],
  }),
);
/**
 * Gets a list of the continuous deployment policies in your Amazon Web Services account.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listContinuousDeploymentPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListContinuousDeploymentPoliciesRequest,
    output: ListContinuousDeploymentPoliciesResult,
    errors: [AccessDenied, InvalidArgument, NoSuchContinuousDeploymentPolicy],
  }));
/**
 * List CloudFront distributions.
 */
export const listDistributions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDistributionsRequest,
  output: ListDistributionsResult,
  errors: [InvalidArgument],
}));
/**
 * Lists the CloudFront distributions that are associated with the specified resource that you own.
 */
export const listDistributionsByOwnedResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDistributionsByOwnedResourceRequest,
    output: ListDistributionsByOwnedResourceResult,
    errors: [
      AccessDenied,
      EntityNotFound,
      InvalidArgument,
      UnsupportedOperation,
    ],
  }));
/**
 * We recommend that you use the `ListDomainConflicts` API operation to check for domain conflicts, as it supports both standard distributions and distribution tenants. ListConflictingAliases performs similar checks but only supports standard distributions.
 *
 * Lists existing domain associations that conflict with the domain that you specify.
 *
 * You can use this API operation to identify potential domain conflicts when moving domains between standard distributions and/or distribution tenants. Domain conflicts must be resolved first before they can be moved.
 *
 * For example, if you provide `www.example.com` as input, the returned list can include `www.example.com` and the overlapping wildcard alternate domain name (`*.example.com`), if they exist. If you provide `*.example.com` as input, the returned list can include `*.example.com` and any alternate domain names covered by that wildcard (for example, `www.example.com`, `test.example.com`, `dev.example.com`, and so on), if they exist.
 *
 * To list conflicting domains, specify the following:
 *
 * - The domain to search for
 *
 * - The ID of a standard distribution or distribution tenant in your account that has an attached TLS certificate, which covers the specified domain
 *
 * For more information, including how to set up the standard distribution or distribution tenant, and the certificate, see Moving an alternate domain name to a different standard distribution or distribution tenant in the *Amazon CloudFront Developer Guide*.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listDomainConflicts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDomainConflictsRequest,
  output: ListDomainConflictsResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
}));
/**
 * List all field-level encryption configurations that have been created in CloudFront for this account.
 */
export const listFieldLevelEncryptionConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListFieldLevelEncryptionConfigsRequest,
    output: ListFieldLevelEncryptionConfigsResult,
    errors: [InvalidArgument],
  }));
/**
 * Request a list of field-level encryption profiles that have been created in CloudFront for this account.
 */
export const listFieldLevelEncryptionProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListFieldLevelEncryptionProfilesRequest,
    output: ListFieldLevelEncryptionProfilesResult,
    errors: [InvalidArgument],
  }));
/**
 * Lists invalidation batches.
 */
export const listInvalidations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInvalidationsRequest,
  output: ListInvalidationsResult,
  errors: [AccessDenied, InvalidArgument, NoSuchDistribution],
}));
/**
 * Gets a list of key groups.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listKeyGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListKeyGroupsRequest,
  output: ListKeyGroupsResult,
  errors: [InvalidArgument],
}));
/**
 * Gets the list of CloudFront origin access controls (OACs) in this Amazon Web Services account.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send another request that specifies the `NextMarker` value from the current response as the `Marker` value in the next request.
 *
 * If you're not using origin access controls for your Amazon Web Services account, the `ListOriginAccessControls` operation doesn't return the `Items` element in the response.
 */
export const listOriginAccessControls = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListOriginAccessControlsRequest,
    output: ListOriginAccessControlsResult,
    errors: [InvalidArgument],
  }),
);
/**
 * Gets a list of origin request policies.
 *
 * You can optionally apply a filter to return only the managed policies created by Amazon Web Services, or only the custom policies created in your Amazon Web Services account.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listOriginRequestPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListOriginRequestPoliciesRequest,
    output: ListOriginRequestPoliciesResult,
    errors: [AccessDenied, InvalidArgument, NoSuchOriginRequestPolicy],
  }),
);
/**
 * List all public keys that have been added to CloudFront for this account.
 */
export const listPublicKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPublicKeysRequest,
  output: ListPublicKeysResult,
  errors: [InvalidArgument],
}));
/**
 * Gets a list of response headers policies.
 *
 * You can optionally apply a filter to get only the managed policies created by Amazon Web Services, or only the custom policies created in your Amazon Web Services account.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listResponseHeadersPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResponseHeadersPoliciesRequest,
    output: ListResponseHeadersPoliciesResult,
    errors: [AccessDenied, InvalidArgument, NoSuchResponseHeadersPolicy],
  }),
);
/**
 * List streaming distributions.
 */
export const listStreamingDistributions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListStreamingDistributionsRequest,
    output: ListStreamingDistributionsResult,
    errors: [InvalidArgument],
  }),
);
/**
 * List the CloudFront VPC origins in your account.
 */
export const listVpcOrigins = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVpcOriginsRequest,
  output: ListVpcOriginsResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Tests a connection function.
 */
export const testConnectionFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TestConnectionFunctionRequest,
    output: TestConnectionFunctionResult,
    errors: [
      EntityNotFound,
      InvalidArgument,
      InvalidIfMatchVersion,
      PreconditionFailed,
      TestFunctionFailed,
      UnsupportedOperation,
    ],
  }),
);
/**
 * Update an origin access identity.
 */
export const updateCloudFrontOriginAccessIdentity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCloudFrontOriginAccessIdentityRequest,
    output: UpdateCloudFrontOriginAccessIdentityResult,
    errors: [
      AccessDenied,
      IllegalUpdate,
      InconsistentQuantities,
      InvalidArgument,
      InvalidIfMatchVersion,
      MissingBody,
      NoSuchCloudFrontOriginAccessIdentity,
      PreconditionFailed,
    ],
  }));
/**
 * Updates a distribution tenant.
 */
export const updateDistributionTenant = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDistributionTenantRequest,
    output: UpdateDistributionTenantResult,
    errors: [
      AccessDenied,
      CNAMEAlreadyExists,
      EntityAlreadyExists,
      EntityLimitExceeded,
      EntityNotFound,
      InvalidArgument,
      InvalidAssociation,
      InvalidIfMatchVersion,
      PreconditionFailed,
    ],
  }),
);
/**
 * Updates a key group.
 *
 * When you update a key group, all the fields are updated with the values provided in the request. You cannot update some fields independent of others. To update a key group:
 *
 * - Get the current key group with `GetKeyGroup` or `GetKeyGroupConfig`.
 *
 * - Locally modify the fields in the key group that you want to update. For example, add or remove public key IDs.
 *
 * - Call `UpdateKeyGroup` with the entire key group object, including the fields that you modified and those that you didn't.
 */
export const updateKeyGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKeyGroupRequest,
  output: UpdateKeyGroupResult,
  errors: [
    InvalidArgument,
    InvalidIfMatchVersion,
    KeyGroupAlreadyExists,
    NoSuchResource,
    PreconditionFailed,
    TooManyPublicKeysInKeyGroup,
  ],
}));
/**
 * Creates a new origin access identity. If you're using Amazon S3 for your origin, you can use an origin access identity to require users to access your content using a CloudFront URL instead of the Amazon S3 URL. For more information about how to use origin access identities, see Serving Private Content through CloudFront in the *Amazon CloudFront Developer Guide*.
 */
export const createCloudFrontOriginAccessIdentity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCloudFrontOriginAccessIdentityRequest,
    output: CreateCloudFrontOriginAccessIdentityResult,
    errors: [
      CloudFrontOriginAccessIdentityAlreadyExists,
      InconsistentQuantities,
      InvalidArgument,
      MissingBody,
      TooManyCloudFrontOriginAccessIdentities,
    ],
  }));
/**
 * Creates a connection function.
 */
export const createConnectionFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConnectionFunctionRequest,
    output: CreateConnectionFunctionResult,
    errors: [
      AccessDenied,
      EntityAlreadyExists,
      EntityLimitExceeded,
      EntitySizeLimitExceeded,
      InvalidArgument,
      InvalidTagging,
      UnsupportedOperation,
    ],
  }),
);
/**
 * Create a new invalidation. For more information, see Invalidating files in the *Amazon CloudFront Developer Guide*.
 */
export const createInvalidation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInvalidationRequest,
  output: CreateInvalidationResult,
  errors: [
    AccessDenied,
    BatchTooLarge,
    InconsistentQuantities,
    InvalidArgument,
    MissingBody,
    NoSuchDistribution,
    TooManyInvalidationsInProgress,
  ],
}));
/**
 * Enables or disables additional Amazon CloudWatch metrics for the specified CloudFront distribution. The additional metrics incur an additional cost.
 *
 * For more information, see Viewing additional CloudFront distribution metrics in the *Amazon CloudFront Developer Guide*.
 */
export const createMonitoringSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateMonitoringSubscriptionRequest,
    output: CreateMonitoringSubscriptionResult,
    errors: [
      AccessDenied,
      MonitoringSubscriptionAlreadyExists,
      NoSuchDistribution,
      UnsupportedOperation,
    ],
  }));
/**
 * Uploads a public key to CloudFront that you can use with signed URLs and signed cookies, or with field-level encryption.
 */
export const createPublicKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePublicKeyRequest,
  output: CreatePublicKeyResult,
  errors: [InvalidArgument, PublicKeyAlreadyExists, TooManyPublicKeys],
}));
/**
 * Update a field-level encryption configuration.
 */
export const updateFieldLevelEncryptionConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateFieldLevelEncryptionConfigRequest,
    output: UpdateFieldLevelEncryptionConfigResult,
    errors: [
      AccessDenied,
      IllegalUpdate,
      InconsistentQuantities,
      InvalidArgument,
      InvalidIfMatchVersion,
      NoSuchFieldLevelEncryptionConfig,
      NoSuchFieldLevelEncryptionProfile,
      PreconditionFailed,
      QueryArgProfileEmpty,
      TooManyFieldLevelEncryptionContentTypeProfiles,
      TooManyFieldLevelEncryptionQueryArgProfiles,
    ],
  }));
/**
 * Updates a response headers policy.
 *
 * When you update a response headers policy, the entire policy is replaced. You cannot update some policy fields independent of others. To update a response headers policy configuration:
 *
 * - Use `GetResponseHeadersPolicyConfig` to get the current policy's configuration.
 *
 * - Modify the fields in the response headers policy configuration that you want to update.
 *
 * - Call `UpdateResponseHeadersPolicy`, providing the entire response headers policy configuration, including the fields that you modified and those that you didn't.
 */
export const updateResponseHeadersPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateResponseHeadersPolicyRequest,
    output: UpdateResponseHeadersPolicyResult,
    errors: [
      AccessDenied,
      IllegalUpdate,
      InconsistentQuantities,
      InvalidArgument,
      InvalidIfMatchVersion,
      NoSuchResponseHeadersPolicy,
      PreconditionFailed,
      ResponseHeadersPolicyAlreadyExists,
      TooLongCSPInResponseHeadersPolicy,
      TooManyCustomHeadersInResponseHeadersPolicy,
      TooManyRemoveHeadersInResponseHeadersPolicy,
    ],
  }),
);
/**
 * Update a streaming distribution.
 */
export const updateStreamingDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateStreamingDistributionRequest,
    output: UpdateStreamingDistributionResult,
    errors: [
      AccessDenied,
      CNAMEAlreadyExists,
      IllegalUpdate,
      InconsistentQuantities,
      InvalidArgument,
      InvalidIfMatchVersion,
      InvalidOriginAccessControl,
      InvalidOriginAccessIdentity,
      MissingBody,
      NoSuchStreamingDistribution,
      PreconditionFailed,
      TooManyStreamingDistributionCNAMEs,
      TooManyTrustedSigners,
      TrustedSignerDoesNotExist,
    ],
  }),
);
/**
 * Creates a cache policy.
 *
 * After you create a cache policy, you can attach it to one or more cache behaviors. When it's attached to a cache behavior, the cache policy determines the following:
 *
 * - The values that CloudFront includes in the *cache key*. These values can include HTTP headers, cookies, and URL query strings. CloudFront uses the cache key to find an object in its cache that it can return to the viewer.
 *
 * - The default, minimum, and maximum time to live (TTL) values that you want objects to stay in the CloudFront cache.
 *
 * If your minimum TTL is greater than 0, CloudFront will cache content for at least the duration specified in the cache policy's minimum TTL, even if the `Cache-Control: no-cache`, `no-store`, or `private` directives are present in the origin headers.
 *
 * The headers, cookies, and query strings that are included in the cache key are also included in requests that CloudFront sends to the origin. CloudFront sends a request when it can't find an object in its cache that matches the request's cache key. If you want to send values to the origin but *not* include them in the cache key, use `OriginRequestPolicy`.
 *
 * For more information about cache policies, see Controlling the cache key in the *Amazon CloudFront Developer Guide*.
 */
export const createCachePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCachePolicyRequest,
  output: CreateCachePolicyResult,
  errors: [
    AccessDenied,
    CachePolicyAlreadyExists,
    InconsistentQuantities,
    InvalidArgument,
    TooManyCachePolicies,
    TooManyCookiesInCachePolicy,
    TooManyHeadersInCachePolicy,
    TooManyQueryStringsInCachePolicy,
  ],
}));
/**
 * Creates a CloudFront function.
 *
 * To create a function, you provide the function code and some configuration information about the function. The response contains an Amazon Resource Name (ARN) that uniquely identifies the function.
 *
 * When you create a function, it's in the `DEVELOPMENT` stage. In this stage, you can test the function with `TestFunction`, and update it with `UpdateFunction`.
 *
 * When you're ready to use your function with a CloudFront distribution, use `PublishFunction` to copy the function from the `DEVELOPMENT` stage to `LIVE`. When it's live, you can attach the function to a distribution's cache behavior, using the function's ARN.
 */
export const createFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFunctionRequest,
  output: CreateFunctionResult,
  errors: [
    FunctionAlreadyExists,
    FunctionSizeLimitExceeded,
    InvalidArgument,
    TooManyFunctions,
    UnsupportedOperation,
  ],
}));
/**
 * Creates an origin request policy.
 *
 * After you create an origin request policy, you can attach it to one or more cache behaviors. When it's attached to a cache behavior, the origin request policy determines the values that CloudFront includes in requests that it sends to the origin. Each request that CloudFront sends to the origin includes the following:
 *
 * - The request body and the URL path (without the domain name) from the viewer request.
 *
 * - The headers that CloudFront automatically includes in every origin request, including `Host`, `User-Agent`, and `X-Amz-Cf-Id`.
 *
 * - All HTTP headers, cookies, and URL query strings that are specified in the cache policy or the origin request policy. These can include items from the viewer request and, in the case of headers, additional ones that are added by CloudFront.
 *
 * CloudFront sends a request when it can't find a valid object in its cache that matches the request. If you want to send values to the origin and also include them in the cache key, use `CachePolicy`.
 *
 * For more information about origin request policies, see Controlling origin requests in the *Amazon CloudFront Developer Guide*.
 */
export const createOriginRequestPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateOriginRequestPolicyRequest,
    output: CreateOriginRequestPolicyResult,
    errors: [
      AccessDenied,
      InconsistentQuantities,
      InvalidArgument,
      OriginRequestPolicyAlreadyExists,
      TooManyCookiesInOriginRequestPolicy,
      TooManyHeadersInOriginRequestPolicy,
      TooManyOriginRequestPolicies,
      TooManyQueryStringsInOriginRequestPolicy,
    ],
  }),
);
/**
 * Creates a real-time log configuration.
 *
 * After you create a real-time log configuration, you can attach it to one or more cache behaviors to send real-time log data to the specified Amazon Kinesis data stream.
 *
 * For more information about real-time log configurations, see Real-time logs in the *Amazon CloudFront Developer Guide*.
 */
export const createRealtimeLogConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRealtimeLogConfigRequest,
    output: CreateRealtimeLogConfigResult,
    errors: [
      AccessDenied,
      InvalidArgument,
      RealtimeLogConfigAlreadyExists,
      TooManyRealtimeLogConfigs,
    ],
  }),
);
/**
 * This API is deprecated. Amazon CloudFront is deprecating real-time messaging protocol (RTMP) distributions on December 31, 2020. For more information, read the announcement on the Amazon CloudFront discussion forum.
 */
export const createStreamingDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateStreamingDistributionRequest,
    output: CreateStreamingDistributionResult,
    errors: [
      AccessDenied,
      CNAMEAlreadyExists,
      InconsistentQuantities,
      InvalidArgument,
      InvalidOrigin,
      InvalidOriginAccessControl,
      InvalidOriginAccessIdentity,
      MissingBody,
      StreamingDistributionAlreadyExists,
      TooManyStreamingDistributionCNAMEs,
      TooManyStreamingDistributions,
      TooManyTrustedSigners,
      TrustedSignerDoesNotExist,
    ],
  }),
);
/**
 * This API is deprecated. Amazon CloudFront is deprecating real-time messaging protocol (RTMP) distributions on December 31, 2020. For more information, read the announcement on the Amazon CloudFront discussion forum.
 */
export const createStreamingDistributionWithTags =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateStreamingDistributionWithTagsRequest,
    output: CreateStreamingDistributionWithTagsResult,
    errors: [
      AccessDenied,
      CNAMEAlreadyExists,
      InconsistentQuantities,
      InvalidArgument,
      InvalidOrigin,
      InvalidOriginAccessControl,
      InvalidOriginAccessIdentity,
      InvalidTagging,
      MissingBody,
      StreamingDistributionAlreadyExists,
      TooManyStreamingDistributionCNAMEs,
      TooManyStreamingDistributions,
      TooManyTrustedSigners,
      TrustedSignerDoesNotExist,
    ],
  }));
/**
 * Updates a cache policy configuration.
 *
 * When you update a cache policy configuration, all the fields are updated with the values provided in the request. You cannot update some fields independent of others. To update a cache policy configuration:
 *
 * - Use `GetCachePolicyConfig` to get the current configuration.
 *
 * - Locally modify the fields in the cache policy configuration that you want to update.
 *
 * - Call `UpdateCachePolicy` by providing the entire cache policy configuration, including the fields that you modified and those that you didn't.
 *
 * If your minimum TTL is greater than 0, CloudFront will cache content for at least the duration specified in the cache policy's minimum TTL, even if the `Cache-Control: no-cache`, `no-store`, or `private` directives are present in the origin headers.
 */
export const updateCachePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCachePolicyRequest,
  output: UpdateCachePolicyResult,
  errors: [
    AccessDenied,
    CachePolicyAlreadyExists,
    IllegalUpdate,
    InconsistentQuantities,
    InvalidArgument,
    InvalidIfMatchVersion,
    NoSuchCachePolicy,
    PreconditionFailed,
    TooManyCookiesInCachePolicy,
    TooManyHeadersInCachePolicy,
    TooManyQueryStringsInCachePolicy,
  ],
}));
/**
 * Update a field-level encryption profile.
 */
export const updateFieldLevelEncryptionProfile =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateFieldLevelEncryptionProfileRequest,
    output: UpdateFieldLevelEncryptionProfileResult,
    errors: [
      AccessDenied,
      FieldLevelEncryptionProfileAlreadyExists,
      FieldLevelEncryptionProfileSizeExceeded,
      IllegalUpdate,
      InconsistentQuantities,
      InvalidArgument,
      InvalidIfMatchVersion,
      NoSuchFieldLevelEncryptionProfile,
      NoSuchPublicKey,
      PreconditionFailed,
      TooManyFieldLevelEncryptionEncryptionEntities,
      TooManyFieldLevelEncryptionFieldPatterns,
    ],
  }));
/**
 * Updates an origin request policy configuration.
 *
 * When you update an origin request policy configuration, all the fields are updated with the values provided in the request. You cannot update some fields independent of others. To update an origin request policy configuration:
 *
 * - Use `GetOriginRequestPolicyConfig` to get the current configuration.
 *
 * - Locally modify the fields in the origin request policy configuration that you want to update.
 *
 * - Call `UpdateOriginRequestPolicy` by providing the entire origin request policy configuration, including the fields that you modified and those that you didn't.
 */
export const updateOriginRequestPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateOriginRequestPolicyRequest,
    output: UpdateOriginRequestPolicyResult,
    errors: [
      AccessDenied,
      IllegalUpdate,
      InconsistentQuantities,
      InvalidArgument,
      InvalidIfMatchVersion,
      NoSuchOriginRequestPolicy,
      OriginRequestPolicyAlreadyExists,
      PreconditionFailed,
      TooManyCookiesInOriginRequestPolicy,
      TooManyHeadersInOriginRequestPolicy,
      TooManyQueryStringsInOriginRequestPolicy,
    ],
  }),
);
/**
 * Create a field-level encryption profile.
 */
export const createFieldLevelEncryptionProfile =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateFieldLevelEncryptionProfileRequest,
    output: CreateFieldLevelEncryptionProfileResult,
    errors: [
      FieldLevelEncryptionProfileAlreadyExists,
      FieldLevelEncryptionProfileSizeExceeded,
      InconsistentQuantities,
      InvalidArgument,
      NoSuchPublicKey,
      TooManyFieldLevelEncryptionEncryptionEntities,
      TooManyFieldLevelEncryptionFieldPatterns,
      TooManyFieldLevelEncryptionProfiles,
    ],
  }));
/**
 * Creates a response headers policy.
 *
 * A response headers policy contains information about a set of HTTP headers. To create a response headers policy, you provide some metadata about the policy and a set of configurations that specify the headers.
 *
 * After you create a response headers policy, you can use its ID to attach it to one or more cache behaviors in a CloudFront distribution. When it's attached to a cache behavior, the response headers policy affects the HTTP headers that CloudFront includes in HTTP responses to requests that match the cache behavior. CloudFront adds or removes response headers according to the configuration of the response headers policy.
 *
 * For more information, see Adding or removing HTTP headers in CloudFront responses in the *Amazon CloudFront Developer Guide*.
 */
export const createResponseHeadersPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateResponseHeadersPolicyRequest,
    output: CreateResponseHeadersPolicyResult,
    errors: [
      AccessDenied,
      InconsistentQuantities,
      InvalidArgument,
      ResponseHeadersPolicyAlreadyExists,
      TooLongCSPInResponseHeadersPolicy,
      TooManyCustomHeadersInResponseHeadersPolicy,
      TooManyRemoveHeadersInResponseHeadersPolicy,
      TooManyResponseHeadersPolicies,
    ],
  }),
);
/**
 * Creates a continuous deployment policy that distributes traffic for a custom domain name to two different CloudFront distributions.
 *
 * To use a continuous deployment policy, first use `CopyDistribution` to create a staging distribution, then use `UpdateDistribution` to modify the staging distribution's configuration.
 *
 * After you create and update a staging distribution, you can use a continuous deployment policy to incrementally move traffic to the staging distribution. This workflow enables you to test changes to a distribution's configuration before moving all of your domain's production traffic to the new configuration.
 */
export const createContinuousDeploymentPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateContinuousDeploymentPolicyRequest,
    output: CreateContinuousDeploymentPolicyResult,
    errors: [
      AccessDenied,
      ContinuousDeploymentPolicyAlreadyExists,
      InconsistentQuantities,
      InvalidArgument,
      StagingDistributionInUse,
      TooManyContinuousDeploymentPolicies,
    ],
  }));
/**
 * Create a new field-level encryption configuration.
 */
export const createFieldLevelEncryptionConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateFieldLevelEncryptionConfigRequest,
    output: CreateFieldLevelEncryptionConfigResult,
    errors: [
      FieldLevelEncryptionConfigAlreadyExists,
      InconsistentQuantities,
      InvalidArgument,
      NoSuchFieldLevelEncryptionProfile,
      QueryArgProfileEmpty,
      TooManyFieldLevelEncryptionConfigs,
      TooManyFieldLevelEncryptionContentTypeProfiles,
      TooManyFieldLevelEncryptionQueryArgProfiles,
    ],
  }));
/**
 * Create a new distribution with tags. This API operation requires the following IAM permissions:
 *
 * - CreateDistribution
 *
 * - TagResource
 */
export const createDistributionWithTags = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDistributionWithTagsRequest,
    output: CreateDistributionWithTagsResult,
    errors: [
      AccessDenied,
      CNAMEAlreadyExists,
      ContinuousDeploymentPolicyInUse,
      DistributionAlreadyExists,
      EntityNotFound,
      IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior,
      IllegalOriginAccessConfiguration,
      InconsistentQuantities,
      InvalidArgument,
      InvalidDefaultRootObject,
      InvalidDomainNameForOriginAccessControl,
      InvalidErrorCode,
      InvalidForwardCookies,
      InvalidFunctionAssociation,
      InvalidGeoRestrictionParameter,
      InvalidHeadersForS3Origin,
      InvalidLambdaFunctionAssociation,
      InvalidLocationCode,
      InvalidMinimumProtocolVersion,
      InvalidOrigin,
      InvalidOriginAccessControl,
      InvalidOriginAccessIdentity,
      InvalidOriginKeepaliveTimeout,
      InvalidOriginReadTimeout,
      InvalidProtocolSettings,
      InvalidQueryStringParameters,
      InvalidRelativePath,
      InvalidRequiredProtocol,
      InvalidResponseCode,
      InvalidTagging,
      InvalidTTLOrder,
      InvalidViewerCertificate,
      InvalidWebACLId,
      MissingBody,
      NoSuchCachePolicy,
      NoSuchContinuousDeploymentPolicy,
      NoSuchFieldLevelEncryptionConfig,
      NoSuchOrigin,
      NoSuchOriginRequestPolicy,
      NoSuchRealtimeLogConfig,
      NoSuchResponseHeadersPolicy,
      RealtimeLogConfigOwnerMismatch,
      TooManyCacheBehaviors,
      TooManyCertificates,
      TooManyCookieNamesInWhiteList,
      TooManyDistributionCNAMEs,
      TooManyDistributions,
      TooManyDistributionsAssociatedToCachePolicy,
      TooManyDistributionsAssociatedToFieldLevelEncryptionConfig,
      TooManyDistributionsAssociatedToKeyGroup,
      TooManyDistributionsAssociatedToOriginAccessControl,
      TooManyDistributionsAssociatedToOriginRequestPolicy,
      TooManyDistributionsAssociatedToResponseHeadersPolicy,
      TooManyDistributionsWithFunctionAssociations,
      TooManyDistributionsWithLambdaAssociations,
      TooManyDistributionsWithSingleFunctionARN,
      TooManyFunctionAssociations,
      TooManyHeadersInForwardedValues,
      TooManyKeyGroupsAssociatedToDistribution,
      TooManyLambdaFunctionAssociations,
      TooManyOriginCustomHeaders,
      TooManyOriginGroupsPerDistribution,
      TooManyOrigins,
      TooManyQueryStringParameters,
      TooManyTrustedSigners,
      TrustedKeyGroupDoesNotExist,
      TrustedSignerDoesNotExist,
    ],
  }),
);
/**
 * Updates the configuration for a CloudFront distribution.
 *
 * The update process includes getting the current distribution configuration, updating it to make your changes, and then submitting an `UpdateDistribution` request to make the updates.
 *
 * **To update a web distribution using the CloudFront API**
 *
 * - Use `GetDistributionConfig` to get the current configuration, including the version identifier (`ETag`).
 *
 * - Update the distribution configuration that was returned in the response. Note the following important requirements and restrictions:
 *
 * - You must copy the `ETag` field value from the response. (You'll use it for the `IfMatch` parameter in your request.) Then, remove the `ETag` field from the distribution configuration.
 *
 * - You can't change the value of `CallerReference`.
 *
 * - Submit an `UpdateDistribution` request, providing the updated distribution configuration. The new configuration replaces the existing configuration. The values that you specify in an `UpdateDistribution` request are not merged into your existing configuration. Make sure to include all fields: the ones that you modified and also the ones that you didn't.
 */
export const updateDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDistributionRequest,
  output: UpdateDistributionResult,
  errors: [
    AccessDenied,
    CNAMEAlreadyExists,
    ContinuousDeploymentPolicyInUse,
    EntityNotFound,
    IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior,
    IllegalOriginAccessConfiguration,
    IllegalUpdate,
    InconsistentQuantities,
    InvalidArgument,
    InvalidDefaultRootObject,
    InvalidDomainNameForOriginAccessControl,
    InvalidErrorCode,
    InvalidForwardCookies,
    InvalidFunctionAssociation,
    InvalidGeoRestrictionParameter,
    InvalidHeadersForS3Origin,
    InvalidIfMatchVersion,
    InvalidLambdaFunctionAssociation,
    InvalidLocationCode,
    InvalidMinimumProtocolVersion,
    InvalidOriginAccessControl,
    InvalidOriginAccessIdentity,
    InvalidOriginKeepaliveTimeout,
    InvalidOriginReadTimeout,
    InvalidQueryStringParameters,
    InvalidRelativePath,
    InvalidRequiredProtocol,
    InvalidResponseCode,
    InvalidTTLOrder,
    InvalidViewerCertificate,
    InvalidWebACLId,
    MissingBody,
    NoSuchCachePolicy,
    NoSuchContinuousDeploymentPolicy,
    NoSuchDistribution,
    NoSuchFieldLevelEncryptionConfig,
    NoSuchOrigin,
    NoSuchOriginRequestPolicy,
    NoSuchRealtimeLogConfig,
    NoSuchResponseHeadersPolicy,
    PreconditionFailed,
    RealtimeLogConfigOwnerMismatch,
    StagingDistributionInUse,
    TooManyCacheBehaviors,
    TooManyCertificates,
    TooManyCookieNamesInWhiteList,
    TooManyDistributionCNAMEs,
    TooManyDistributionsAssociatedToCachePolicy,
    TooManyDistributionsAssociatedToFieldLevelEncryptionConfig,
    TooManyDistributionsAssociatedToKeyGroup,
    TooManyDistributionsAssociatedToOriginAccessControl,
    TooManyDistributionsAssociatedToOriginRequestPolicy,
    TooManyDistributionsAssociatedToResponseHeadersPolicy,
    TooManyDistributionsWithFunctionAssociations,
    TooManyDistributionsWithLambdaAssociations,
    TooManyDistributionsWithSingleFunctionARN,
    TooManyFunctionAssociations,
    TooManyHeadersInForwardedValues,
    TooManyKeyGroupsAssociatedToDistribution,
    TooManyLambdaFunctionAssociations,
    TooManyOriginCustomHeaders,
    TooManyOriginGroupsPerDistribution,
    TooManyOrigins,
    TooManyQueryStringParameters,
    TooManyTrustedSigners,
    TrustedKeyGroupDoesNotExist,
    TrustedSignerDoesNotExist,
  ],
}));
/**
 * Copies the staging distribution's configuration to its corresponding primary distribution. The primary distribution retains its `Aliases` (also known as alternate domain names or CNAMEs) and `ContinuousDeploymentPolicyId` value, but otherwise its configuration is overwritten to match the staging distribution.
 *
 * You can use this operation in a continuous deployment workflow after you have tested configuration changes on the staging distribution. After using a continuous deployment policy to move a portion of your domain name's traffic to the staging distribution and verifying that it works as intended, you can use this operation to copy the staging distribution's configuration to the primary distribution. This action will disable the continuous deployment policy and move your domain's traffic back to the primary distribution.
 *
 * This API operation requires the following IAM permissions:
 *
 * - GetDistribution
 *
 * - UpdateDistribution
 */
export const updateDistributionWithStagingConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDistributionWithStagingConfigRequest,
    output: UpdateDistributionWithStagingConfigResult,
    errors: [
      AccessDenied,
      CNAMEAlreadyExists,
      EntityNotFound,
      IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior,
      IllegalUpdate,
      InconsistentQuantities,
      InvalidArgument,
      InvalidDefaultRootObject,
      InvalidErrorCode,
      InvalidForwardCookies,
      InvalidFunctionAssociation,
      InvalidGeoRestrictionParameter,
      InvalidHeadersForS3Origin,
      InvalidIfMatchVersion,
      InvalidLambdaFunctionAssociation,
      InvalidLocationCode,
      InvalidMinimumProtocolVersion,
      InvalidOriginAccessControl,
      InvalidOriginAccessIdentity,
      InvalidOriginKeepaliveTimeout,
      InvalidOriginReadTimeout,
      InvalidQueryStringParameters,
      InvalidRelativePath,
      InvalidRequiredProtocol,
      InvalidResponseCode,
      InvalidTTLOrder,
      InvalidViewerCertificate,
      InvalidWebACLId,
      MissingBody,
      NoSuchCachePolicy,
      NoSuchDistribution,
      NoSuchFieldLevelEncryptionConfig,
      NoSuchOrigin,
      NoSuchOriginRequestPolicy,
      NoSuchRealtimeLogConfig,
      NoSuchResponseHeadersPolicy,
      PreconditionFailed,
      RealtimeLogConfigOwnerMismatch,
      TooManyCacheBehaviors,
      TooManyCertificates,
      TooManyCookieNamesInWhiteList,
      TooManyDistributionCNAMEs,
      TooManyDistributionsAssociatedToCachePolicy,
      TooManyDistributionsAssociatedToFieldLevelEncryptionConfig,
      TooManyDistributionsAssociatedToKeyGroup,
      TooManyDistributionsAssociatedToOriginAccessControl,
      TooManyDistributionsAssociatedToOriginRequestPolicy,
      TooManyDistributionsAssociatedToResponseHeadersPolicy,
      TooManyDistributionsWithFunctionAssociations,
      TooManyDistributionsWithLambdaAssociations,
      TooManyDistributionsWithSingleFunctionARN,
      TooManyFunctionAssociations,
      TooManyHeadersInForwardedValues,
      TooManyKeyGroupsAssociatedToDistribution,
      TooManyLambdaFunctionAssociations,
      TooManyOriginCustomHeaders,
      TooManyOriginGroupsPerDistribution,
      TooManyOrigins,
      TooManyQueryStringParameters,
      TooManyTrustedSigners,
      TrustedKeyGroupDoesNotExist,
      TrustedSignerDoesNotExist,
    ],
  }));
/**
 * Creates a staging distribution using the configuration of the provided primary distribution. A staging distribution is a copy of an existing distribution (called the primary distribution) that you can use in a continuous deployment workflow.
 *
 * After you create a staging distribution, you can use `UpdateDistribution` to modify the staging distribution's configuration. Then you can use `CreateContinuousDeploymentPolicy` to incrementally move traffic to the staging distribution.
 *
 * This API operation requires the following IAM permissions:
 *
 * - GetDistribution
 *
 * - CreateDistribution
 *
 * - CopyDistribution
 */
export const copyDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyDistributionRequest,
  output: CopyDistributionResult,
  errors: [
    AccessDenied,
    CNAMEAlreadyExists,
    DistributionAlreadyExists,
    IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior,
    InconsistentQuantities,
    InvalidArgument,
    InvalidDefaultRootObject,
    InvalidErrorCode,
    InvalidForwardCookies,
    InvalidFunctionAssociation,
    InvalidGeoRestrictionParameter,
    InvalidHeadersForS3Origin,
    InvalidIfMatchVersion,
    InvalidLambdaFunctionAssociation,
    InvalidLocationCode,
    InvalidMinimumProtocolVersion,
    InvalidOrigin,
    InvalidOriginAccessControl,
    InvalidOriginAccessIdentity,
    InvalidOriginKeepaliveTimeout,
    InvalidOriginReadTimeout,
    InvalidProtocolSettings,
    InvalidQueryStringParameters,
    InvalidRelativePath,
    InvalidRequiredProtocol,
    InvalidResponseCode,
    InvalidTTLOrder,
    InvalidViewerCertificate,
    InvalidWebACLId,
    MissingBody,
    NoSuchCachePolicy,
    NoSuchDistribution,
    NoSuchFieldLevelEncryptionConfig,
    NoSuchOrigin,
    NoSuchOriginRequestPolicy,
    NoSuchRealtimeLogConfig,
    NoSuchResponseHeadersPolicy,
    PreconditionFailed,
    RealtimeLogConfigOwnerMismatch,
    TooManyCacheBehaviors,
    TooManyCertificates,
    TooManyCookieNamesInWhiteList,
    TooManyDistributionCNAMEs,
    TooManyDistributions,
    TooManyDistributionsAssociatedToCachePolicy,
    TooManyDistributionsAssociatedToFieldLevelEncryptionConfig,
    TooManyDistributionsAssociatedToKeyGroup,
    TooManyDistributionsAssociatedToOriginAccessControl,
    TooManyDistributionsAssociatedToOriginRequestPolicy,
    TooManyDistributionsAssociatedToResponseHeadersPolicy,
    TooManyDistributionsWithFunctionAssociations,
    TooManyDistributionsWithLambdaAssociations,
    TooManyDistributionsWithSingleFunctionARN,
    TooManyFunctionAssociations,
    TooManyHeadersInForwardedValues,
    TooManyKeyGroupsAssociatedToDistribution,
    TooManyLambdaFunctionAssociations,
    TooManyOriginCustomHeaders,
    TooManyOriginGroupsPerDistribution,
    TooManyOrigins,
    TooManyQueryStringParameters,
    TooManyTrustedSigners,
    TrustedKeyGroupDoesNotExist,
    TrustedSignerDoesNotExist,
  ],
}));
/**
 * Creates a CloudFront distribution.
 */
export const createDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDistributionRequest,
  output: CreateDistributionResult,
  errors: [
    AccessDenied,
    CNAMEAlreadyExists,
    ContinuousDeploymentPolicyInUse,
    DistributionAlreadyExists,
    EntityLimitExceeded,
    EntityNotFound,
    IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior,
    IllegalOriginAccessConfiguration,
    InconsistentQuantities,
    InvalidArgument,
    InvalidDefaultRootObject,
    InvalidDomainNameForOriginAccessControl,
    InvalidErrorCode,
    InvalidForwardCookies,
    InvalidFunctionAssociation,
    InvalidGeoRestrictionParameter,
    InvalidHeadersForS3Origin,
    InvalidLambdaFunctionAssociation,
    InvalidLocationCode,
    InvalidMinimumProtocolVersion,
    InvalidOrigin,
    InvalidOriginAccessControl,
    InvalidOriginAccessIdentity,
    InvalidOriginKeepaliveTimeout,
    InvalidOriginReadTimeout,
    InvalidProtocolSettings,
    InvalidQueryStringParameters,
    InvalidRelativePath,
    InvalidRequiredProtocol,
    InvalidResponseCode,
    InvalidTTLOrder,
    InvalidViewerCertificate,
    InvalidWebACLId,
    MissingBody,
    NoSuchCachePolicy,
    NoSuchContinuousDeploymentPolicy,
    NoSuchFieldLevelEncryptionConfig,
    NoSuchOrigin,
    NoSuchOriginRequestPolicy,
    NoSuchRealtimeLogConfig,
    NoSuchResponseHeadersPolicy,
    RealtimeLogConfigOwnerMismatch,
    TooManyCacheBehaviors,
    TooManyCertificates,
    TooManyCookieNamesInWhiteList,
    TooManyDistributionCNAMEs,
    TooManyDistributions,
    TooManyDistributionsAssociatedToCachePolicy,
    TooManyDistributionsAssociatedToFieldLevelEncryptionConfig,
    TooManyDistributionsAssociatedToKeyGroup,
    TooManyDistributionsAssociatedToOriginAccessControl,
    TooManyDistributionsAssociatedToOriginRequestPolicy,
    TooManyDistributionsAssociatedToResponseHeadersPolicy,
    TooManyDistributionsWithFunctionAssociations,
    TooManyDistributionsWithLambdaAssociations,
    TooManyDistributionsWithSingleFunctionARN,
    TooManyFunctionAssociations,
    TooManyHeadersInForwardedValues,
    TooManyKeyGroupsAssociatedToDistribution,
    TooManyLambdaFunctionAssociations,
    TooManyOriginCustomHeaders,
    TooManyOriginGroupsPerDistribution,
    TooManyOrigins,
    TooManyQueryStringParameters,
    TooManyTrustedSigners,
    TrustedKeyGroupDoesNotExist,
    TrustedSignerDoesNotExist,
  ],
}));

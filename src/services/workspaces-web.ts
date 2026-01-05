import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "WorkSpaces Web",
  serviceShapeName: "AWSErmineControlPlaneService",
});
const auth = T.AwsAuthSigv4({ name: "workspaces-web" });
const ver = T.ServiceVersion("2020-07-08");
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
                        url: "https://workspaces-web-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://workspaces-web-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://workspaces-web.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://workspaces-web.{Region}.{PartitionResult#dnsSuffix}",
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
export const SubnetIdList = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export const CertificateList = S.Array(T.Blob);
export const CertificateThumbprintList = S.Array(S.String);
export class ExpireSessionRequest extends S.Class<ExpireSessionRequest>(
  "ExpireSessionRequest",
)(
  {
    portalId: S.String.pipe(T.HttpLabel("portalId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/portals/{portalId}/sessions/{sessionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExpireSessionResponse extends S.Class<ExpireSessionResponse>(
  "ExpireSessionResponse",
)({}) {}
export class GetSessionRequest extends S.Class<GetSessionRequest>(
  "GetSessionRequest",
)(
  {
    portalId: S.String.pipe(T.HttpLabel("portalId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/portals/{portalId}/sessions/{sessionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSessionsRequest extends S.Class<ListSessionsRequest>(
  "ListSessionsRequest",
)(
  {
    portalId: S.String.pipe(T.HttpLabel("portalId")),
    username: S.optional(S.String).pipe(T.HttpQuery("username")),
    sessionId: S.optional(S.String).pipe(T.HttpQuery("sessionId")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/portals/{portalId}/sessions" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn+}" }),
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
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn+}" }),
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
export class GetBrowserSettingsRequest extends S.Class<GetBrowserSettingsRequest>(
  "GetBrowserSettingsRequest",
)(
  { browserSettingsArn: S.String.pipe(T.HttpLabel("browserSettingsArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/browserSettings/{browserSettingsArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const BlockedCategories = S.Array(S.String);
export const UrlPatternList = S.Array(S.String);
export class WebContentFilteringPolicy extends S.Class<WebContentFilteringPolicy>(
  "WebContentFilteringPolicy",
)({
  blockedCategories: S.optional(BlockedCategories),
  allowedUrls: S.optional(UrlPatternList),
  blockedUrls: S.optional(UrlPatternList),
}) {}
export class UpdateBrowserSettingsRequest extends S.Class<UpdateBrowserSettingsRequest>(
  "UpdateBrowserSettingsRequest",
)(
  {
    browserSettingsArn: S.String.pipe(T.HttpLabel("browserSettingsArn")),
    browserPolicy: S.optional(S.String),
    clientToken: S.optional(S.String),
    webContentFilteringPolicy: S.optional(WebContentFilteringPolicy),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/browserSettings/{browserSettingsArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBrowserSettingsRequest extends S.Class<DeleteBrowserSettingsRequest>(
  "DeleteBrowserSettingsRequest",
)(
  { browserSettingsArn: S.String.pipe(T.HttpLabel("browserSettingsArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/browserSettings/{browserSettingsArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBrowserSettingsResponse extends S.Class<DeleteBrowserSettingsResponse>(
  "DeleteBrowserSettingsResponse",
)({}) {}
export class ListBrowserSettingsRequest extends S.Class<ListBrowserSettingsRequest>(
  "ListBrowserSettingsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/browserSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataProtectionSettingsRequest extends S.Class<GetDataProtectionSettingsRequest>(
  "GetDataProtectionSettingsRequest",
)(
  {
    dataProtectionSettingsArn: S.String.pipe(
      T.HttpLabel("dataProtectionSettingsArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/dataProtectionSettings/{dataProtectionSettingsArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CustomPattern extends S.Class<CustomPattern>("CustomPattern")({
  patternName: S.String,
  patternRegex: S.String,
  patternDescription: S.optional(S.String),
  keywordRegex: S.optional(S.String),
}) {}
export class RedactionPlaceHolder extends S.Class<RedactionPlaceHolder>(
  "RedactionPlaceHolder",
)({
  redactionPlaceHolderType: S.String,
  redactionPlaceHolderText: S.optional(S.String),
}) {}
export const InlineRedactionUrls = S.Array(S.String);
export class InlineRedactionPattern extends S.Class<InlineRedactionPattern>(
  "InlineRedactionPattern",
)({
  builtInPatternId: S.optional(S.String),
  customPattern: S.optional(CustomPattern),
  redactionPlaceHolder: RedactionPlaceHolder,
  enforcedUrls: S.optional(InlineRedactionUrls),
  exemptUrls: S.optional(InlineRedactionUrls),
  confidenceLevel: S.optional(S.Number),
}) {}
export const InlineRedactionPatterns = S.Array(InlineRedactionPattern);
export const GlobalInlineRedactionUrls = S.Array(S.String);
export class InlineRedactionConfiguration extends S.Class<InlineRedactionConfiguration>(
  "InlineRedactionConfiguration",
)({
  inlineRedactionPatterns: InlineRedactionPatterns,
  globalEnforcedUrls: S.optional(GlobalInlineRedactionUrls),
  globalExemptUrls: S.optional(GlobalInlineRedactionUrls),
  globalConfidenceLevel: S.optional(S.Number),
}) {}
export class UpdateDataProtectionSettingsRequest extends S.Class<UpdateDataProtectionSettingsRequest>(
  "UpdateDataProtectionSettingsRequest",
)(
  {
    dataProtectionSettingsArn: S.String.pipe(
      T.HttpLabel("dataProtectionSettingsArn"),
    ),
    inlineRedactionConfiguration: S.optional(InlineRedactionConfiguration),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/dataProtectionSettings/{dataProtectionSettingsArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataProtectionSettingsRequest extends S.Class<DeleteDataProtectionSettingsRequest>(
  "DeleteDataProtectionSettingsRequest",
)(
  {
    dataProtectionSettingsArn: S.String.pipe(
      T.HttpLabel("dataProtectionSettingsArn"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/dataProtectionSettings/{dataProtectionSettingsArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataProtectionSettingsResponse extends S.Class<DeleteDataProtectionSettingsResponse>(
  "DeleteDataProtectionSettingsResponse",
)({}) {}
export class ListDataProtectionSettingsRequest extends S.Class<ListDataProtectionSettingsRequest>(
  "ListDataProtectionSettingsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/dataProtectionSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIdentityProviderRequest extends S.Class<GetIdentityProviderRequest>(
  "GetIdentityProviderRequest",
)(
  { identityProviderArn: S.String.pipe(T.HttpLabel("identityProviderArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/identityProviders/{identityProviderArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const IdentityProviderDetails = S.Record({
  key: S.String,
  value: S.String,
});
export class UpdateIdentityProviderRequest extends S.Class<UpdateIdentityProviderRequest>(
  "UpdateIdentityProviderRequest",
)(
  {
    identityProviderArn: S.String.pipe(T.HttpLabel("identityProviderArn")),
    identityProviderName: S.optional(S.String),
    identityProviderType: S.optional(S.String),
    identityProviderDetails: S.optional(IdentityProviderDetails),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/identityProviders/{identityProviderArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdentityProviderRequest extends S.Class<DeleteIdentityProviderRequest>(
  "DeleteIdentityProviderRequest",
)(
  { identityProviderArn: S.String.pipe(T.HttpLabel("identityProviderArn")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/identityProviders/{identityProviderArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdentityProviderResponse extends S.Class<DeleteIdentityProviderResponse>(
  "DeleteIdentityProviderResponse",
)({}) {}
export class ListIdentityProvidersRequest extends S.Class<ListIdentityProvidersRequest>(
  "ListIdentityProvidersRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/portals/{portalArn+}/identityProviders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIpAccessSettingsRequest extends S.Class<GetIpAccessSettingsRequest>(
  "GetIpAccessSettingsRequest",
)(
  { ipAccessSettingsArn: S.String.pipe(T.HttpLabel("ipAccessSettingsArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/ipAccessSettings/{ipAccessSettingsArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IpRule extends S.Class<IpRule>("IpRule")({
  ipRange: S.String,
  description: S.optional(S.String),
}) {}
export const IpRuleList = S.Array(IpRule);
export class UpdateIpAccessSettingsRequest extends S.Class<UpdateIpAccessSettingsRequest>(
  "UpdateIpAccessSettingsRequest",
)(
  {
    ipAccessSettingsArn: S.String.pipe(T.HttpLabel("ipAccessSettingsArn")),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    ipRules: S.optional(IpRuleList),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/ipAccessSettings/{ipAccessSettingsArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIpAccessSettingsRequest extends S.Class<DeleteIpAccessSettingsRequest>(
  "DeleteIpAccessSettingsRequest",
)(
  { ipAccessSettingsArn: S.String.pipe(T.HttpLabel("ipAccessSettingsArn")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/ipAccessSettings/{ipAccessSettingsArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIpAccessSettingsResponse extends S.Class<DeleteIpAccessSettingsResponse>(
  "DeleteIpAccessSettingsResponse",
)({}) {}
export class ListIpAccessSettingsRequest extends S.Class<ListIpAccessSettingsRequest>(
  "ListIpAccessSettingsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ipAccessSettings" }),
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
export class CreateNetworkSettingsRequest extends S.Class<CreateNetworkSettingsRequest>(
  "CreateNetworkSettingsRequest",
)(
  {
    vpcId: S.String,
    subnetIds: SubnetIdList,
    securityGroupIds: SecurityGroupIdList,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/networkSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNetworkSettingsRequest extends S.Class<GetNetworkSettingsRequest>(
  "GetNetworkSettingsRequest",
)(
  { networkSettingsArn: S.String.pipe(T.HttpLabel("networkSettingsArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/networkSettings/{networkSettingsArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNetworkSettingsRequest extends S.Class<UpdateNetworkSettingsRequest>(
  "UpdateNetworkSettingsRequest",
)(
  {
    networkSettingsArn: S.String.pipe(T.HttpLabel("networkSettingsArn")),
    vpcId: S.optional(S.String),
    subnetIds: S.optional(SubnetIdList),
    securityGroupIds: S.optional(SecurityGroupIdList),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/networkSettings/{networkSettingsArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNetworkSettingsRequest extends S.Class<DeleteNetworkSettingsRequest>(
  "DeleteNetworkSettingsRequest",
)(
  { networkSettingsArn: S.String.pipe(T.HttpLabel("networkSettingsArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/networkSettings/{networkSettingsArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNetworkSettingsResponse extends S.Class<DeleteNetworkSettingsResponse>(
  "DeleteNetworkSettingsResponse",
)({}) {}
export class ListNetworkSettingsRequest extends S.Class<ListNetworkSettingsRequest>(
  "ListNetworkSettingsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networkSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const EncryptionContextMap = S.Record({
  key: S.String,
  value: S.String,
});
export class CreatePortalRequest extends S.Class<CreatePortalRequest>(
  "CreatePortalRequest",
)(
  {
    displayName: S.optional(S.String),
    tags: S.optional(TagList),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    clientToken: S.optional(S.String),
    authenticationType: S.optional(S.String),
    instanceType: S.optional(S.String),
    maxConcurrentSessions: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/portals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPortalRequest extends S.Class<GetPortalRequest>(
  "GetPortalRequest",
)(
  { portalArn: S.String.pipe(T.HttpLabel("portalArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/portals/{portalArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePortalRequest extends S.Class<UpdatePortalRequest>(
  "UpdatePortalRequest",
)(
  {
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    displayName: S.optional(S.String),
    authenticationType: S.optional(S.String),
    instanceType: S.optional(S.String),
    maxConcurrentSessions: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/portals/{portalArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePortalRequest extends S.Class<DeletePortalRequest>(
  "DeletePortalRequest",
)(
  { portalArn: S.String.pipe(T.HttpLabel("portalArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/portals/{portalArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePortalResponse extends S.Class<DeletePortalResponse>(
  "DeletePortalResponse",
)({}) {}
export class ListPortalsRequest extends S.Class<ListPortalsRequest>(
  "ListPortalsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/portals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateBrowserSettingsRequest extends S.Class<AssociateBrowserSettingsRequest>(
  "AssociateBrowserSettingsRequest",
)(
  {
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    browserSettingsArn: S.String.pipe(T.HttpQuery("browserSettingsArn")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/portals/{portalArn+}/browserSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateDataProtectionSettingsRequest extends S.Class<AssociateDataProtectionSettingsRequest>(
  "AssociateDataProtectionSettingsRequest",
)(
  {
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    dataProtectionSettingsArn: S.String.pipe(
      T.HttpQuery("dataProtectionSettingsArn"),
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/portals/{portalArn+}/dataProtectionSettings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateIpAccessSettingsRequest extends S.Class<AssociateIpAccessSettingsRequest>(
  "AssociateIpAccessSettingsRequest",
)(
  {
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    ipAccessSettingsArn: S.String.pipe(T.HttpQuery("ipAccessSettingsArn")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/portals/{portalArn+}/ipAccessSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateNetworkSettingsRequest extends S.Class<AssociateNetworkSettingsRequest>(
  "AssociateNetworkSettingsRequest",
)(
  {
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    networkSettingsArn: S.String.pipe(T.HttpQuery("networkSettingsArn")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/portals/{portalArn+}/networkSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateSessionLoggerRequest extends S.Class<AssociateSessionLoggerRequest>(
  "AssociateSessionLoggerRequest",
)(
  {
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    sessionLoggerArn: S.String.pipe(T.HttpQuery("sessionLoggerArn")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/portals/{portalArn+}/sessionLogger" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateTrustStoreRequest extends S.Class<AssociateTrustStoreRequest>(
  "AssociateTrustStoreRequest",
)(
  {
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    trustStoreArn: S.String.pipe(T.HttpQuery("trustStoreArn")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/portals/{portalArn+}/trustStores" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateUserAccessLoggingSettingsRequest extends S.Class<AssociateUserAccessLoggingSettingsRequest>(
  "AssociateUserAccessLoggingSettingsRequest",
)(
  {
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    userAccessLoggingSettingsArn: S.String.pipe(
      T.HttpQuery("userAccessLoggingSettingsArn"),
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/portals/{portalArn+}/userAccessLoggingSettings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateUserSettingsRequest extends S.Class<AssociateUserSettingsRequest>(
  "AssociateUserSettingsRequest",
)(
  {
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    userSettingsArn: S.String.pipe(T.HttpQuery("userSettingsArn")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/portals/{portalArn+}/userSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateBrowserSettingsRequest extends S.Class<DisassociateBrowserSettingsRequest>(
  "DisassociateBrowserSettingsRequest",
)(
  { portalArn: S.String.pipe(T.HttpLabel("portalArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/portals/{portalArn+}/browserSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateBrowserSettingsResponse extends S.Class<DisassociateBrowserSettingsResponse>(
  "DisassociateBrowserSettingsResponse",
)({}) {}
export class DisassociateDataProtectionSettingsRequest extends S.Class<DisassociateDataProtectionSettingsRequest>(
  "DisassociateDataProtectionSettingsRequest",
)(
  { portalArn: S.String.pipe(T.HttpLabel("portalArn")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/portals/{portalArn+}/dataProtectionSettings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateDataProtectionSettingsResponse extends S.Class<DisassociateDataProtectionSettingsResponse>(
  "DisassociateDataProtectionSettingsResponse",
)({}) {}
export class DisassociateIpAccessSettingsRequest extends S.Class<DisassociateIpAccessSettingsRequest>(
  "DisassociateIpAccessSettingsRequest",
)(
  { portalArn: S.String.pipe(T.HttpLabel("portalArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/portals/{portalArn+}/ipAccessSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateIpAccessSettingsResponse extends S.Class<DisassociateIpAccessSettingsResponse>(
  "DisassociateIpAccessSettingsResponse",
)({}) {}
export class DisassociateNetworkSettingsRequest extends S.Class<DisassociateNetworkSettingsRequest>(
  "DisassociateNetworkSettingsRequest",
)(
  { portalArn: S.String.pipe(T.HttpLabel("portalArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/portals/{portalArn+}/networkSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateNetworkSettingsResponse extends S.Class<DisassociateNetworkSettingsResponse>(
  "DisassociateNetworkSettingsResponse",
)({}) {}
export class DisassociateSessionLoggerRequest extends S.Class<DisassociateSessionLoggerRequest>(
  "DisassociateSessionLoggerRequest",
)(
  { portalArn: S.String.pipe(T.HttpLabel("portalArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/portals/{portalArn+}/sessionLogger" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateSessionLoggerResponse extends S.Class<DisassociateSessionLoggerResponse>(
  "DisassociateSessionLoggerResponse",
)({}) {}
export class DisassociateTrustStoreRequest extends S.Class<DisassociateTrustStoreRequest>(
  "DisassociateTrustStoreRequest",
)(
  { portalArn: S.String.pipe(T.HttpLabel("portalArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/portals/{portalArn+}/trustStores" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateTrustStoreResponse extends S.Class<DisassociateTrustStoreResponse>(
  "DisassociateTrustStoreResponse",
)({}) {}
export class DisassociateUserAccessLoggingSettingsRequest extends S.Class<DisassociateUserAccessLoggingSettingsRequest>(
  "DisassociateUserAccessLoggingSettingsRequest",
)(
  { portalArn: S.String.pipe(T.HttpLabel("portalArn")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/portals/{portalArn+}/userAccessLoggingSettings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateUserAccessLoggingSettingsResponse extends S.Class<DisassociateUserAccessLoggingSettingsResponse>(
  "DisassociateUserAccessLoggingSettingsResponse",
)({}) {}
export class DisassociateUserSettingsRequest extends S.Class<DisassociateUserSettingsRequest>(
  "DisassociateUserSettingsRequest",
)(
  { portalArn: S.String.pipe(T.HttpLabel("portalArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/portals/{portalArn+}/userSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateUserSettingsResponse extends S.Class<DisassociateUserSettingsResponse>(
  "DisassociateUserSettingsResponse",
)({}) {}
export class GetPortalServiceProviderMetadataRequest extends S.Class<GetPortalServiceProviderMetadataRequest>(
  "GetPortalServiceProviderMetadataRequest",
)(
  { portalArn: S.String.pipe(T.HttpLabel("portalArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/portalIdp/{portalArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionLoggerRequest extends S.Class<GetSessionLoggerRequest>(
  "GetSessionLoggerRequest",
)(
  { sessionLoggerArn: S.String.pipe(T.HttpLabel("sessionLoggerArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/sessionLoggers/{sessionLoggerArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Events = S.Array(S.String);
export const EventFilter = S.Union(
  S.Struct({ all: S.Struct({}) }),
  S.Struct({ include: Events }),
);
export class S3LogConfiguration extends S.Class<S3LogConfiguration>(
  "S3LogConfiguration",
)({
  bucket: S.String,
  keyPrefix: S.optional(S.String),
  bucketOwner: S.optional(S.String),
  logFileFormat: S.String,
  folderStructure: S.String,
}) {}
export class LogConfiguration extends S.Class<LogConfiguration>(
  "LogConfiguration",
)({ s3: S.optional(S3LogConfiguration) }) {}
export class UpdateSessionLoggerRequest extends S.Class<UpdateSessionLoggerRequest>(
  "UpdateSessionLoggerRequest",
)(
  {
    sessionLoggerArn: S.String.pipe(T.HttpLabel("sessionLoggerArn")),
    eventFilter: S.optional(EventFilter),
    logConfiguration: S.optional(LogConfiguration),
    displayName: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sessionLoggers/{sessionLoggerArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSessionLoggerRequest extends S.Class<DeleteSessionLoggerRequest>(
  "DeleteSessionLoggerRequest",
)(
  { sessionLoggerArn: S.String.pipe(T.HttpLabel("sessionLoggerArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/sessionLoggers/{sessionLoggerArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSessionLoggerResponse extends S.Class<DeleteSessionLoggerResponse>(
  "DeleteSessionLoggerResponse",
)({}) {}
export class ListSessionLoggersRequest extends S.Class<ListSessionLoggersRequest>(
  "ListSessionLoggersRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sessionLoggers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTrustStoreRequest extends S.Class<CreateTrustStoreRequest>(
  "CreateTrustStoreRequest",
)(
  {
    certificateList: CertificateList,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/trustStores" }),
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
  { trustStoreArn: S.String.pipe(T.HttpLabel("trustStoreArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/trustStores/{trustStoreArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTrustStoreRequest extends S.Class<UpdateTrustStoreRequest>(
  "UpdateTrustStoreRequest",
)(
  {
    trustStoreArn: S.String.pipe(T.HttpLabel("trustStoreArn")),
    certificatesToAdd: S.optional(CertificateList),
    certificatesToDelete: S.optional(CertificateThumbprintList),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/trustStores/{trustStoreArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTrustStoreRequest extends S.Class<DeleteTrustStoreRequest>(
  "DeleteTrustStoreRequest",
)(
  { trustStoreArn: S.String.pipe(T.HttpLabel("trustStoreArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/trustStores/{trustStoreArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTrustStoreResponse extends S.Class<DeleteTrustStoreResponse>(
  "DeleteTrustStoreResponse",
)({}) {}
export class ListTrustStoresRequest extends S.Class<ListTrustStoresRequest>(
  "ListTrustStoresRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/trustStores" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTrustStoreCertificateRequest extends S.Class<GetTrustStoreCertificateRequest>(
  "GetTrustStoreCertificateRequest",
)(
  {
    trustStoreArn: S.String.pipe(T.HttpLabel("trustStoreArn")),
    thumbprint: S.String.pipe(T.HttpQuery("thumbprint")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/trustStores/{trustStoreArn+}/certificate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrustStoreCertificatesRequest extends S.Class<ListTrustStoreCertificatesRequest>(
  "ListTrustStoreCertificatesRequest",
)(
  {
    trustStoreArn: S.String.pipe(T.HttpLabel("trustStoreArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/trustStores/{trustStoreArn+}/certificates",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateUserAccessLoggingSettingsRequest extends S.Class<CreateUserAccessLoggingSettingsRequest>(
  "CreateUserAccessLoggingSettingsRequest",
)(
  {
    kinesisStreamArn: S.String,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/userAccessLoggingSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUserAccessLoggingSettingsRequest extends S.Class<GetUserAccessLoggingSettingsRequest>(
  "GetUserAccessLoggingSettingsRequest",
)(
  {
    userAccessLoggingSettingsArn: S.String.pipe(
      T.HttpLabel("userAccessLoggingSettingsArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/userAccessLoggingSettings/{userAccessLoggingSettingsArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserAccessLoggingSettingsRequest extends S.Class<UpdateUserAccessLoggingSettingsRequest>(
  "UpdateUserAccessLoggingSettingsRequest",
)(
  {
    userAccessLoggingSettingsArn: S.String.pipe(
      T.HttpLabel("userAccessLoggingSettingsArn"),
    ),
    kinesisStreamArn: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/userAccessLoggingSettings/{userAccessLoggingSettingsArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserAccessLoggingSettingsRequest extends S.Class<DeleteUserAccessLoggingSettingsRequest>(
  "DeleteUserAccessLoggingSettingsRequest",
)(
  {
    userAccessLoggingSettingsArn: S.String.pipe(
      T.HttpLabel("userAccessLoggingSettingsArn"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/userAccessLoggingSettings/{userAccessLoggingSettingsArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserAccessLoggingSettingsResponse extends S.Class<DeleteUserAccessLoggingSettingsResponse>(
  "DeleteUserAccessLoggingSettingsResponse",
)({}) {}
export class ListUserAccessLoggingSettingsRequest extends S.Class<ListUserAccessLoggingSettingsRequest>(
  "ListUserAccessLoggingSettingsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/userAccessLoggingSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUserSettingsRequest extends S.Class<GetUserSettingsRequest>(
  "GetUserSettingsRequest",
)(
  { userSettingsArn: S.String.pipe(T.HttpLabel("userSettingsArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/userSettings/{userSettingsArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserSettingsRequest extends S.Class<DeleteUserSettingsRequest>(
  "DeleteUserSettingsRequest",
)(
  { userSettingsArn: S.String.pipe(T.HttpLabel("userSettingsArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/userSettings/{userSettingsArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserSettingsResponse extends S.Class<DeleteUserSettingsResponse>(
  "DeleteUserSettingsResponse",
)({}) {}
export class ListUserSettingsRequest extends S.Class<ListUserSettingsRequest>(
  "ListUserSettingsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/userSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const HiddenToolbarItemList = S.Array(S.String);
export class ToolbarConfiguration extends S.Class<ToolbarConfiguration>(
  "ToolbarConfiguration",
)({
  toolbarType: S.optional(S.String),
  visualMode: S.optional(S.String),
  hiddenToolbarItems: S.optional(HiddenToolbarItemList),
  maxDisplayResolution: S.optional(S.String),
}) {}
export const IconImageInput = S.Union(
  S.Struct({ blob: T.Blob }),
  S.Struct({ s3Uri: S.String }),
);
export const WallpaperImageInput = S.Union(
  S.Struct({ blob: T.Blob }),
  S.Struct({ s3Uri: S.String }),
);
export class LocalizedBrandingStrings extends S.Class<LocalizedBrandingStrings>(
  "LocalizedBrandingStrings",
)({
  browserTabTitle: S.String,
  welcomeText: S.String,
  loginTitle: S.optional(S.String),
  loginDescription: S.optional(S.String),
  loginButtonText: S.optional(S.String),
  contactLink: S.optional(S.String),
  contactButtonText: S.optional(S.String),
  loadingText: S.optional(S.String),
}) {}
export const LocalizedBrandingStringMap = S.Record({
  key: S.String,
  value: LocalizedBrandingStrings,
});
export class BrandingConfigurationUpdateInput extends S.Class<BrandingConfigurationUpdateInput>(
  "BrandingConfigurationUpdateInput",
)({
  logo: S.optional(IconImageInput),
  wallpaper: S.optional(WallpaperImageInput),
  favicon: S.optional(IconImageInput),
  localizedStrings: S.optional(LocalizedBrandingStringMap),
  colorTheme: S.optional(S.String),
  termsOfService: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagList,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn+}" }),
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
export class CreateBrowserSettingsRequest extends S.Class<CreateBrowserSettingsRequest>(
  "CreateBrowserSettingsRequest",
)(
  {
    tags: S.optional(TagList),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    browserPolicy: S.optional(S.String),
    clientToken: S.optional(S.String),
    webContentFilteringPolicy: S.optional(WebContentFilteringPolicy),
  },
  T.all(
    T.Http({ method: "POST", uri: "/browserSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ArnList = S.Array(S.String);
export class BrowserSettings extends S.Class<BrowserSettings>(
  "BrowserSettings",
)({
  browserSettingsArn: S.String,
  associatedPortalArns: S.optional(ArnList),
  browserPolicy: S.optional(S.String),
  customerManagedKey: S.optional(S.String),
  additionalEncryptionContext: S.optional(EncryptionContextMap),
  webContentFilteringPolicy: S.optional(WebContentFilteringPolicy),
}) {}
export class UpdateBrowserSettingsResponse extends S.Class<UpdateBrowserSettingsResponse>(
  "UpdateBrowserSettingsResponse",
)({ browserSettings: BrowserSettings }) {}
export class DataProtectionSettings extends S.Class<DataProtectionSettings>(
  "DataProtectionSettings",
)({
  dataProtectionSettingsArn: S.String,
  inlineRedactionConfiguration: S.optional(InlineRedactionConfiguration),
  associatedPortalArns: S.optional(ArnList),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  customerManagedKey: S.optional(S.String),
  additionalEncryptionContext: S.optional(EncryptionContextMap),
}) {}
export class UpdateDataProtectionSettingsResponse extends S.Class<UpdateDataProtectionSettingsResponse>(
  "UpdateDataProtectionSettingsResponse",
)({ dataProtectionSettings: DataProtectionSettings }) {}
export class CreateIdentityProviderRequest extends S.Class<CreateIdentityProviderRequest>(
  "CreateIdentityProviderRequest",
)(
  {
    portalArn: S.String,
    identityProviderName: S.String,
    identityProviderType: S.String,
    identityProviderDetails: IdentityProviderDetails,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/identityProviders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IdentityProvider extends S.Class<IdentityProvider>(
  "IdentityProvider",
)({
  identityProviderArn: S.String,
  identityProviderName: S.optional(S.String),
  identityProviderType: S.optional(S.String),
  identityProviderDetails: S.optional(IdentityProviderDetails),
}) {}
export class UpdateIdentityProviderResponse extends S.Class<UpdateIdentityProviderResponse>(
  "UpdateIdentityProviderResponse",
)({ identityProvider: IdentityProvider }) {}
export class CreateIpAccessSettingsRequest extends S.Class<CreateIpAccessSettingsRequest>(
  "CreateIpAccessSettingsRequest",
)(
  {
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(TagList),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    ipRules: IpRuleList,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ipAccessSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IpAccessSettings extends S.Class<IpAccessSettings>(
  "IpAccessSettings",
)({
  ipAccessSettingsArn: S.String,
  associatedPortalArns: S.optional(ArnList),
  ipRules: S.optional(IpRuleList),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  customerManagedKey: S.optional(S.String),
  additionalEncryptionContext: S.optional(EncryptionContextMap),
}) {}
export class UpdateIpAccessSettingsResponse extends S.Class<UpdateIpAccessSettingsResponse>(
  "UpdateIpAccessSettingsResponse",
)({ ipAccessSettings: IpAccessSettings }) {}
export class CreateNetworkSettingsResponse extends S.Class<CreateNetworkSettingsResponse>(
  "CreateNetworkSettingsResponse",
)({ networkSettingsArn: S.String }) {}
export class NetworkSettings extends S.Class<NetworkSettings>(
  "NetworkSettings",
)({
  networkSettingsArn: S.String,
  associatedPortalArns: S.optional(ArnList),
  vpcId: S.optional(S.String),
  subnetIds: S.optional(SubnetIdList),
  securityGroupIds: S.optional(SecurityGroupIdList),
}) {}
export class UpdateNetworkSettingsResponse extends S.Class<UpdateNetworkSettingsResponse>(
  "UpdateNetworkSettingsResponse",
)({ networkSettings: NetworkSettings }) {}
export class CreatePortalResponse extends S.Class<CreatePortalResponse>(
  "CreatePortalResponse",
)({ portalArn: S.String, portalEndpoint: S.String }) {}
export class Portal extends S.Class<Portal>("Portal")({
  portalArn: S.String,
  rendererType: S.optional(S.String),
  browserType: S.optional(S.String),
  portalStatus: S.optional(S.String),
  portalEndpoint: S.optional(S.String),
  displayName: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  browserSettingsArn: S.optional(S.String),
  dataProtectionSettingsArn: S.optional(S.String),
  userSettingsArn: S.optional(S.String),
  networkSettingsArn: S.optional(S.String),
  sessionLoggerArn: S.optional(S.String),
  trustStoreArn: S.optional(S.String),
  statusReason: S.optional(S.String),
  userAccessLoggingSettingsArn: S.optional(S.String),
  authenticationType: S.optional(S.String),
  ipAccessSettingsArn: S.optional(S.String),
  customerManagedKey: S.optional(S.String),
  additionalEncryptionContext: S.optional(EncryptionContextMap),
  instanceType: S.optional(S.String),
  maxConcurrentSessions: S.optional(S.Number),
}) {}
export class UpdatePortalResponse extends S.Class<UpdatePortalResponse>(
  "UpdatePortalResponse",
)({ portal: S.optional(Portal) }) {}
export class AssociateBrowserSettingsResponse extends S.Class<AssociateBrowserSettingsResponse>(
  "AssociateBrowserSettingsResponse",
)({ portalArn: S.String, browserSettingsArn: S.String }) {}
export class AssociateDataProtectionSettingsResponse extends S.Class<AssociateDataProtectionSettingsResponse>(
  "AssociateDataProtectionSettingsResponse",
)({ portalArn: S.String, dataProtectionSettingsArn: S.String }) {}
export class AssociateIpAccessSettingsResponse extends S.Class<AssociateIpAccessSettingsResponse>(
  "AssociateIpAccessSettingsResponse",
)({ portalArn: S.String, ipAccessSettingsArn: S.String }) {}
export class AssociateNetworkSettingsResponse extends S.Class<AssociateNetworkSettingsResponse>(
  "AssociateNetworkSettingsResponse",
)({ portalArn: S.String, networkSettingsArn: S.String }) {}
export class AssociateSessionLoggerResponse extends S.Class<AssociateSessionLoggerResponse>(
  "AssociateSessionLoggerResponse",
)({ portalArn: S.String, sessionLoggerArn: S.String }) {}
export class AssociateTrustStoreResponse extends S.Class<AssociateTrustStoreResponse>(
  "AssociateTrustStoreResponse",
)({ portalArn: S.String, trustStoreArn: S.String }) {}
export class AssociateUserAccessLoggingSettingsResponse extends S.Class<AssociateUserAccessLoggingSettingsResponse>(
  "AssociateUserAccessLoggingSettingsResponse",
)({ portalArn: S.String, userAccessLoggingSettingsArn: S.String }) {}
export class AssociateUserSettingsResponse extends S.Class<AssociateUserSettingsResponse>(
  "AssociateUserSettingsResponse",
)({ portalArn: S.String, userSettingsArn: S.String }) {}
export class GetPortalServiceProviderMetadataResponse extends S.Class<GetPortalServiceProviderMetadataResponse>(
  "GetPortalServiceProviderMetadataResponse",
)({ portalArn: S.String, serviceProviderSamlMetadata: S.optional(S.String) }) {}
export class SessionLogger extends S.Class<SessionLogger>("SessionLogger")({
  sessionLoggerArn: S.String,
  eventFilter: S.optional(EventFilter),
  logConfiguration: S.optional(LogConfiguration),
  customerManagedKey: S.optional(S.String),
  additionalEncryptionContext: S.optional(EncryptionContextMap),
  associatedPortalArns: S.optional(ArnList),
  displayName: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class UpdateSessionLoggerResponse extends S.Class<UpdateSessionLoggerResponse>(
  "UpdateSessionLoggerResponse",
)({ sessionLogger: SessionLogger }) {}
export class CreateTrustStoreResponse extends S.Class<CreateTrustStoreResponse>(
  "CreateTrustStoreResponse",
)({ trustStoreArn: S.String }) {}
export class UpdateTrustStoreResponse extends S.Class<UpdateTrustStoreResponse>(
  "UpdateTrustStoreResponse",
)({ trustStoreArn: S.String }) {}
export class CreateUserAccessLoggingSettingsResponse extends S.Class<CreateUserAccessLoggingSettingsResponse>(
  "CreateUserAccessLoggingSettingsResponse",
)({ userAccessLoggingSettingsArn: S.String }) {}
export class UserAccessLoggingSettings extends S.Class<UserAccessLoggingSettings>(
  "UserAccessLoggingSettings",
)({
  userAccessLoggingSettingsArn: S.String,
  associatedPortalArns: S.optional(ArnList),
  kinesisStreamArn: S.optional(S.String),
}) {}
export class UpdateUserAccessLoggingSettingsResponse extends S.Class<UpdateUserAccessLoggingSettingsResponse>(
  "UpdateUserAccessLoggingSettingsResponse",
)({ userAccessLoggingSettings: UserAccessLoggingSettings }) {}
export class CookieSpecification extends S.Class<CookieSpecification>(
  "CookieSpecification",
)({
  domain: S.String,
  name: S.optional(S.String),
  path: S.optional(S.String),
}) {}
export const CookieSpecifications = S.Array(CookieSpecification);
export class CookieSynchronizationConfiguration extends S.Class<CookieSynchronizationConfiguration>(
  "CookieSynchronizationConfiguration",
)({
  allowlist: CookieSpecifications,
  blocklist: S.optional(CookieSpecifications),
}) {}
export class UpdateUserSettingsRequest extends S.Class<UpdateUserSettingsRequest>(
  "UpdateUserSettingsRequest",
)(
  {
    userSettingsArn: S.String.pipe(T.HttpLabel("userSettingsArn")),
    copyAllowed: S.optional(S.String),
    pasteAllowed: S.optional(S.String),
    downloadAllowed: S.optional(S.String),
    uploadAllowed: S.optional(S.String),
    printAllowed: S.optional(S.String),
    disconnectTimeoutInMinutes: S.optional(S.Number),
    idleDisconnectTimeoutInMinutes: S.optional(S.Number),
    clientToken: S.optional(S.String),
    cookieSynchronizationConfiguration: S.optional(
      CookieSynchronizationConfiguration,
    ),
    deepLinkAllowed: S.optional(S.String),
    toolbarConfiguration: S.optional(ToolbarConfiguration),
    brandingConfigurationInput: S.optional(BrandingConfigurationUpdateInput),
    webAuthnAllowed: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/userSettings/{userSettingsArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const IpAddressList = S.Array(S.String);
export class Session extends S.Class<Session>("Session")({
  portalArn: S.optional(S.String),
  sessionId: S.optional(S.String),
  username: S.optional(S.String),
  clientIpAddresses: S.optional(IpAddressList),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class SessionSummary extends S.Class<SessionSummary>("SessionSummary")({
  portalArn: S.optional(S.String),
  sessionId: S.optional(S.String),
  username: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const SessionSummaryList = S.Array(SessionSummary);
export class BrowserSettingsSummary extends S.Class<BrowserSettingsSummary>(
  "BrowserSettingsSummary",
)({ browserSettingsArn: S.String }) {}
export const BrowserSettingsList = S.Array(BrowserSettingsSummary);
export class DataProtectionSettingsSummary extends S.Class<DataProtectionSettingsSummary>(
  "DataProtectionSettingsSummary",
)({
  dataProtectionSettingsArn: S.String,
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DataProtectionSettingsList = S.Array(
  DataProtectionSettingsSummary,
);
export class IdentityProviderSummary extends S.Class<IdentityProviderSummary>(
  "IdentityProviderSummary",
)({
  identityProviderArn: S.String,
  identityProviderName: S.optional(S.String),
  identityProviderType: S.optional(S.String),
}) {}
export const IdentityProviderList = S.Array(IdentityProviderSummary);
export class IpAccessSettingsSummary extends S.Class<IpAccessSettingsSummary>(
  "IpAccessSettingsSummary",
)({
  ipAccessSettingsArn: S.String,
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const IpAccessSettingsList = S.Array(IpAccessSettingsSummary);
export class NetworkSettingsSummary extends S.Class<NetworkSettingsSummary>(
  "NetworkSettingsSummary",
)({ networkSettingsArn: S.String, vpcId: S.optional(S.String) }) {}
export const NetworkSettingsList = S.Array(NetworkSettingsSummary);
export class PortalSummary extends S.Class<PortalSummary>("PortalSummary")({
  portalArn: S.String,
  rendererType: S.optional(S.String),
  browserType: S.optional(S.String),
  portalStatus: S.optional(S.String),
  portalEndpoint: S.optional(S.String),
  displayName: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  browserSettingsArn: S.optional(S.String),
  dataProtectionSettingsArn: S.optional(S.String),
  userSettingsArn: S.optional(S.String),
  networkSettingsArn: S.optional(S.String),
  sessionLoggerArn: S.optional(S.String),
  trustStoreArn: S.optional(S.String),
  userAccessLoggingSettingsArn: S.optional(S.String),
  authenticationType: S.optional(S.String),
  ipAccessSettingsArn: S.optional(S.String),
  instanceType: S.optional(S.String),
  maxConcurrentSessions: S.optional(S.Number),
}) {}
export const PortalList = S.Array(PortalSummary);
export class SessionLoggerSummary extends S.Class<SessionLoggerSummary>(
  "SessionLoggerSummary",
)({
  sessionLoggerArn: S.String,
  logConfiguration: S.optional(LogConfiguration),
  displayName: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const SessionLoggerList = S.Array(SessionLoggerSummary);
export class TrustStore extends S.Class<TrustStore>("TrustStore")({
  associatedPortalArns: S.optional(ArnList),
  trustStoreArn: S.String,
}) {}
export class TrustStoreSummary extends S.Class<TrustStoreSummary>(
  "TrustStoreSummary",
)({ trustStoreArn: S.optional(S.String) }) {}
export const TrustStoreSummaryList = S.Array(TrustStoreSummary);
export class Certificate extends S.Class<Certificate>("Certificate")({
  thumbprint: S.optional(S.String),
  subject: S.optional(S.String),
  issuer: S.optional(S.String),
  notValidBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  notValidAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  body: S.optional(T.Blob),
}) {}
export class CertificateSummary extends S.Class<CertificateSummary>(
  "CertificateSummary",
)({
  thumbprint: S.optional(S.String),
  subject: S.optional(S.String),
  issuer: S.optional(S.String),
  notValidBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  notValidAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const CertificateSummaryList = S.Array(CertificateSummary);
export class UserAccessLoggingSettingsSummary extends S.Class<UserAccessLoggingSettingsSummary>(
  "UserAccessLoggingSettingsSummary",
)({
  userAccessLoggingSettingsArn: S.String,
  kinesisStreamArn: S.optional(S.String),
}) {}
export const UserAccessLoggingSettingsList = S.Array(
  UserAccessLoggingSettingsSummary,
);
export class ImageMetadata extends S.Class<ImageMetadata>("ImageMetadata")({
  mimeType: S.String,
  fileExtension: S.String,
  lastUploadTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class BrandingConfiguration extends S.Class<BrandingConfiguration>(
  "BrandingConfiguration",
)({
  logo: ImageMetadata,
  wallpaper: ImageMetadata,
  favicon: ImageMetadata,
  localizedStrings: LocalizedBrandingStringMap,
  colorTheme: S.String,
  termsOfService: S.optional(S.String),
}) {}
export class UserSettingsSummary extends S.Class<UserSettingsSummary>(
  "UserSettingsSummary",
)({
  userSettingsArn: S.String,
  copyAllowed: S.optional(S.String),
  pasteAllowed: S.optional(S.String),
  downloadAllowed: S.optional(S.String),
  uploadAllowed: S.optional(S.String),
  printAllowed: S.optional(S.String),
  disconnectTimeoutInMinutes: S.optional(S.Number),
  idleDisconnectTimeoutInMinutes: S.optional(S.Number),
  cookieSynchronizationConfiguration: S.optional(
    CookieSynchronizationConfiguration,
  ),
  deepLinkAllowed: S.optional(S.String),
  toolbarConfiguration: S.optional(ToolbarConfiguration),
  brandingConfiguration: S.optional(BrandingConfiguration),
  webAuthnAllowed: S.optional(S.String),
}) {}
export const UserSettingsList = S.Array(UserSettingsSummary);
export class GetSessionResponse extends S.Class<GetSessionResponse>(
  "GetSessionResponse",
)({ session: S.optional(Session) }) {}
export class ListSessionsResponse extends S.Class<ListSessionsResponse>(
  "ListSessionsResponse",
)({ sessions: SessionSummaryList, nextToken: S.optional(S.String) }) {}
export class CreateBrowserSettingsResponse extends S.Class<CreateBrowserSettingsResponse>(
  "CreateBrowserSettingsResponse",
)({ browserSettingsArn: S.String }) {}
export class GetBrowserSettingsResponse extends S.Class<GetBrowserSettingsResponse>(
  "GetBrowserSettingsResponse",
)({ browserSettings: S.optional(BrowserSettings) }) {}
export class ListBrowserSettingsResponse extends S.Class<ListBrowserSettingsResponse>(
  "ListBrowserSettingsResponse",
)({
  browserSettings: S.optional(BrowserSettingsList),
  nextToken: S.optional(S.String),
}) {}
export class GetDataProtectionSettingsResponse extends S.Class<GetDataProtectionSettingsResponse>(
  "GetDataProtectionSettingsResponse",
)({ dataProtectionSettings: S.optional(DataProtectionSettings) }) {}
export class ListDataProtectionSettingsResponse extends S.Class<ListDataProtectionSettingsResponse>(
  "ListDataProtectionSettingsResponse",
)({
  dataProtectionSettings: S.optional(DataProtectionSettingsList),
  nextToken: S.optional(S.String),
}) {}
export class CreateIdentityProviderResponse extends S.Class<CreateIdentityProviderResponse>(
  "CreateIdentityProviderResponse",
)({ identityProviderArn: S.String }) {}
export class GetIdentityProviderResponse extends S.Class<GetIdentityProviderResponse>(
  "GetIdentityProviderResponse",
)({ identityProvider: S.optional(IdentityProvider) }) {}
export class ListIdentityProvidersResponse extends S.Class<ListIdentityProvidersResponse>(
  "ListIdentityProvidersResponse",
)({
  nextToken: S.optional(S.String),
  identityProviders: S.optional(IdentityProviderList),
}) {}
export class CreateIpAccessSettingsResponse extends S.Class<CreateIpAccessSettingsResponse>(
  "CreateIpAccessSettingsResponse",
)({ ipAccessSettingsArn: S.String }) {}
export class GetIpAccessSettingsResponse extends S.Class<GetIpAccessSettingsResponse>(
  "GetIpAccessSettingsResponse",
)({ ipAccessSettings: S.optional(IpAccessSettings) }) {}
export class ListIpAccessSettingsResponse extends S.Class<ListIpAccessSettingsResponse>(
  "ListIpAccessSettingsResponse",
)({
  ipAccessSettings: S.optional(IpAccessSettingsList),
  nextToken: S.optional(S.String),
}) {}
export class GetNetworkSettingsResponse extends S.Class<GetNetworkSettingsResponse>(
  "GetNetworkSettingsResponse",
)({ networkSettings: S.optional(NetworkSettings) }) {}
export class ListNetworkSettingsResponse extends S.Class<ListNetworkSettingsResponse>(
  "ListNetworkSettingsResponse",
)({
  networkSettings: S.optional(NetworkSettingsList),
  nextToken: S.optional(S.String),
}) {}
export class GetPortalResponse extends S.Class<GetPortalResponse>(
  "GetPortalResponse",
)({ portal: S.optional(Portal) }) {}
export class ListPortalsResponse extends S.Class<ListPortalsResponse>(
  "ListPortalsResponse",
)({ portals: S.optional(PortalList), nextToken: S.optional(S.String) }) {}
export class CreateSessionLoggerRequest extends S.Class<CreateSessionLoggerRequest>(
  "CreateSessionLoggerRequest",
)(
  {
    eventFilter: EventFilter,
    logConfiguration: LogConfiguration,
    displayName: S.optional(S.String),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sessionLoggers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionLoggerResponse extends S.Class<GetSessionLoggerResponse>(
  "GetSessionLoggerResponse",
)({ sessionLogger: S.optional(SessionLogger) }) {}
export class ListSessionLoggersResponse extends S.Class<ListSessionLoggersResponse>(
  "ListSessionLoggersResponse",
)({
  sessionLoggers: S.optional(SessionLoggerList),
  nextToken: S.optional(S.String),
}) {}
export class GetTrustStoreResponse extends S.Class<GetTrustStoreResponse>(
  "GetTrustStoreResponse",
)({ trustStore: S.optional(TrustStore) }) {}
export class ListTrustStoresResponse extends S.Class<ListTrustStoresResponse>(
  "ListTrustStoresResponse",
)({
  trustStores: S.optional(TrustStoreSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class GetTrustStoreCertificateResponse extends S.Class<GetTrustStoreCertificateResponse>(
  "GetTrustStoreCertificateResponse",
)({ trustStoreArn: S.String, certificate: S.optional(Certificate) }) {}
export class ListTrustStoreCertificatesResponse extends S.Class<ListTrustStoreCertificatesResponse>(
  "ListTrustStoreCertificatesResponse",
)({
  certificateList: S.optional(CertificateSummaryList),
  trustStoreArn: S.String,
  nextToken: S.optional(S.String),
}) {}
export class GetUserAccessLoggingSettingsResponse extends S.Class<GetUserAccessLoggingSettingsResponse>(
  "GetUserAccessLoggingSettingsResponse",
)({ userAccessLoggingSettings: S.optional(UserAccessLoggingSettings) }) {}
export class ListUserAccessLoggingSettingsResponse extends S.Class<ListUserAccessLoggingSettingsResponse>(
  "ListUserAccessLoggingSettingsResponse",
)({
  userAccessLoggingSettings: S.optional(UserAccessLoggingSettingsList),
  nextToken: S.optional(S.String),
}) {}
export class UserSettings extends S.Class<UserSettings>("UserSettings")({
  userSettingsArn: S.String,
  associatedPortalArns: S.optional(ArnList),
  copyAllowed: S.optional(S.String),
  pasteAllowed: S.optional(S.String),
  downloadAllowed: S.optional(S.String),
  uploadAllowed: S.optional(S.String),
  printAllowed: S.optional(S.String),
  disconnectTimeoutInMinutes: S.optional(S.Number),
  idleDisconnectTimeoutInMinutes: S.optional(S.Number),
  cookieSynchronizationConfiguration: S.optional(
    CookieSynchronizationConfiguration,
  ),
  customerManagedKey: S.optional(S.String),
  additionalEncryptionContext: S.optional(EncryptionContextMap),
  deepLinkAllowed: S.optional(S.String),
  toolbarConfiguration: S.optional(ToolbarConfiguration),
  brandingConfiguration: S.optional(BrandingConfiguration),
  webAuthnAllowed: S.optional(S.String),
}) {}
export class UpdateUserSettingsResponse extends S.Class<UpdateUserSettingsResponse>(
  "UpdateUserSettingsResponse",
)({ userSettings: UserSettings }) {}
export class ListUserSettingsResponse extends S.Class<ListUserSettingsResponse>(
  "ListUserSettingsResponse",
)({
  userSettings: S.optional(UserSettingsList),
  nextToken: S.optional(S.String),
}) {}
export class BrandingConfigurationCreateInput extends S.Class<BrandingConfigurationCreateInput>(
  "BrandingConfigurationCreateInput",
)({
  logo: IconImageInput,
  wallpaper: WallpaperImageInput,
  favicon: IconImageInput,
  localizedStrings: LocalizedBrandingStringMap,
  colorTheme: S.String,
  termsOfService: S.optional(S.String),
}) {}
export class CreateDataProtectionSettingsRequest extends S.Class<CreateDataProtectionSettingsRequest>(
  "CreateDataProtectionSettingsRequest",
)(
  {
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(TagList),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    inlineRedactionConfiguration: S.optional(InlineRedactionConfiguration),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/dataProtectionSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSessionLoggerResponse extends S.Class<CreateSessionLoggerResponse>(
  "CreateSessionLoggerResponse",
)({ sessionLoggerArn: S.String }) {}
export class CreateUserSettingsRequest extends S.Class<CreateUserSettingsRequest>(
  "CreateUserSettingsRequest",
)(
  {
    copyAllowed: S.String,
    pasteAllowed: S.String,
    downloadAllowed: S.String,
    uploadAllowed: S.String,
    printAllowed: S.String,
    tags: S.optional(TagList),
    disconnectTimeoutInMinutes: S.optional(S.Number),
    idleDisconnectTimeoutInMinutes: S.optional(S.Number),
    clientToken: S.optional(S.String),
    cookieSynchronizationConfiguration: S.optional(
      CookieSynchronizationConfiguration,
    ),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    deepLinkAllowed: S.optional(S.String),
    toolbarConfiguration: S.optional(ToolbarConfiguration),
    brandingConfigurationInput: S.optional(BrandingConfigurationCreateInput),
    webAuthnAllowed: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/userSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataProtectionSettingsResponse extends S.Class<CreateDataProtectionSettingsResponse>(
  "CreateDataProtectionSettingsResponse",
)({ dataProtectionSettingsArn: S.String }) {}
export class CreateUserSettingsResponse extends S.Class<CreateUserSettingsResponse>(
  "CreateUserSettingsResponse",
)({ userSettingsArn: S.String }) {}
export class GetUserSettingsResponse extends S.Class<GetUserSettingsResponse>(
  "GetUserSettingsResponse",
)({ userSettings: S.optional(UserSettings) }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
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
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Retrieves a list of browser settings.
 */
export const listBrowserSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBrowserSettingsRequest,
    output: ListBrowserSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a network settings resource that can be associated with a web portal. Once associated with a web portal, network settings define how streaming instances will connect with your specified VPC.
 */
export const createNetworkSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateNetworkSettingsRequest,
    output: CreateNetworkSettingsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a session logger.
 */
export const createSessionLogger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSessionLoggerRequest,
  output: CreateSessionLoggerResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information for a secure browser session.
 */
export const getSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionRequest,
  output: GetSessionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists information for multiple secure browser sessions from a specific portal.
 */
export const listSessions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSessionsRequest,
    output: ListSessionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "sessions",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets browser settings.
 */
export const getBrowserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBrowserSettingsRequest,
  output: GetBrowserSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the data protection settings.
 */
export const getDataProtectionSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataProtectionSettingsRequest,
    output: GetDataProtectionSettingsResponse,
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
 * Gets the identity provider.
 */
export const getIdentityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentityProviderRequest,
  output: GetIdentityProviderResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the IP access settings.
 */
export const getIpAccessSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIpAccessSettingsRequest,
  output: GetIpAccessSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the network settings.
 */
export const getNetworkSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNetworkSettingsRequest,
  output: GetNetworkSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the web portal.
 */
export const getPortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPortalRequest,
  output: GetPortalResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets details about a specific session logger resource.
 */
export const getSessionLogger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionLoggerRequest,
  output: GetSessionLoggerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the trust store.
 */
export const getTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrustStoreRequest,
  output: GetTrustStoreResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the trust store certificate.
 */
export const getTrustStoreCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTrustStoreCertificateRequest,
    output: GetTrustStoreCertificateResponse,
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
 * Retrieves a list of trust store certificates.
 */
export const listTrustStoreCertificates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTrustStoreCertificatesRequest,
    output: ListTrustStoreCertificatesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets user access logging settings.
 */
export const getUserAccessLoggingSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetUserAccessLoggingSettingsRequest,
    output: GetUserAccessLoggingSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates the user settings.
 */
export const updateUserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserSettingsRequest,
  output: UpdateUserSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of tags for a resource.
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
 * Updates browser settings.
 */
export const updateBrowserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateBrowserSettingsRequest,
    output: UpdateBrowserSettingsResponse,
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
 * Updates data protection settings.
 */
export const updateDataProtectionSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDataProtectionSettingsRequest,
    output: UpdateDataProtectionSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates the identity provider.
 */
export const updateIdentityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateIdentityProviderRequest,
    output: UpdateIdentityProviderResponse,
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
 * Updates IP access settings.
 */
export const updateIpAccessSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateIpAccessSettingsRequest,
    output: UpdateIpAccessSettingsResponse,
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
 * Updates network settings.
 */
export const updateNetworkSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateNetworkSettingsRequest,
    output: UpdateNetworkSettingsResponse,
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
 * Gets the service provider metadata.
 */
export const getPortalServiceProviderMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetPortalServiceProviderMetadataRequest,
    output: GetPortalServiceProviderMetadataResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates the details of a session logger.
 */
export const updateSessionLogger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSessionLoggerRequest,
  output: UpdateSessionLoggerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the trust store.
 */
export const updateTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrustStoreRequest,
  output: UpdateTrustStoreResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the user access logging settings.
 */
export const updateUserAccessLoggingSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateUserAccessLoggingSettingsRequest,
    output: UpdateUserAccessLoggingSettingsResponse,
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a session logger from a portal.
 */
export const disassociateSessionLogger = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateSessionLoggerRequest,
    output: DisassociateSessionLoggerResponse,
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
 * Creates a web portal.
 */
export const createPortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePortalRequest,
  output: CreatePortalResponse,
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
 * Updates a web portal.
 */
export const updatePortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePortalRequest,
  output: UpdatePortalResponse,
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
 * Associates a browser settings resource with a web portal.
 */
export const associateBrowserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateBrowserSettingsRequest,
    output: AssociateBrowserSettingsResponse,
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
 * Associates a data protection settings resource with a web portal.
 */
export const associateDataProtectionSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateDataProtectionSettingsRequest,
    output: AssociateDataProtectionSettingsResponse,
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
 * Associates an IP access settings resource with a web portal.
 */
export const associateIpAccessSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateIpAccessSettingsRequest,
    output: AssociateIpAccessSettingsResponse,
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
 * Associates a network settings resource with a web portal.
 */
export const associateNetworkSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateNetworkSettingsRequest,
    output: AssociateNetworkSettingsResponse,
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
 * Associates a session logger with a portal.
 */
export const associateSessionLogger = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateSessionLoggerRequest,
    output: AssociateSessionLoggerResponse,
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
 * Associates a trust store with a web portal.
 */
export const associateTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateTrustStoreRequest,
  output: AssociateTrustStoreResponse,
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
 * Associates a user access logging settings resource with a web portal.
 */
export const associateUserAccessLoggingSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateUserAccessLoggingSettingsRequest,
    output: AssociateUserAccessLoggingSettingsResponse,
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
 * Associates a user settings resource with a web portal.
 */
export const associateUserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateUserSettingsRequest,
    output: AssociateUserSettingsResponse,
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
 * Disassociates browser settings from a web portal.
 */
export const disassociateBrowserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateBrowserSettingsRequest,
    output: DisassociateBrowserSettingsResponse,
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
 * Disassociates data protection settings from a web portal.
 */
export const disassociateDataProtectionSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateDataProtectionSettingsRequest,
    output: DisassociateDataProtectionSettingsResponse,
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
 * Disassociates IP access settings from a web portal.
 */
export const disassociateIpAccessSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateIpAccessSettingsRequest,
    output: DisassociateIpAccessSettingsResponse,
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
 * Disassociates network settings from a web portal.
 */
export const disassociateNetworkSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateNetworkSettingsRequest,
    output: DisassociateNetworkSettingsResponse,
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
 * Disassociates a trust store from a web portal.
 */
export const disassociateTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateTrustStoreRequest,
    output: DisassociateTrustStoreResponse,
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
 * Disassociates user access logging settings from a web portal.
 */
export const disassociateUserAccessLoggingSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateUserAccessLoggingSettingsRequest,
    output: DisassociateUserAccessLoggingSettingsResponse,
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
 * Disassociates user settings from a web portal.
 */
export const disassociateUserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateUserSettingsRequest,
    output: DisassociateUserSettingsResponse,
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
 * Creates a browser settings resource that can be associated with a web portal. Once associated with a web portal, browser settings control how the browser will behave once a user starts a streaming session for the web portal.
 */
export const createBrowserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateBrowserSettingsRequest,
    output: CreateBrowserSettingsResponse,
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
 * Creates an identity provider resource that is then associated with a web portal.
 */
export const createIdentityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateIdentityProviderRequest,
    output: CreateIdentityProviderResponse,
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
 * Retrieves a list of data protection settings.
 */
export const listDataProtectionSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataProtectionSettingsRequest,
    output: ListDataProtectionSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "dataProtectionSettings",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a list of identity providers for a specific web portal.
 */
export const listIdentityProviders =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListIdentityProvidersRequest,
    output: ListIdentityProvidersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a list of IP access settings.
 */
export const listIpAccessSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListIpAccessSettingsRequest,
    output: ListIpAccessSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a list of network settings.
 */
export const listNetworkSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListNetworkSettingsRequest,
    output: ListNetworkSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a list or web portals.
 */
export const listPortals = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPortalsRequest,
    output: ListPortalsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all available session logger resources.
 */
export const listSessionLoggers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSessionLoggersRequest,
    output: ListSessionLoggersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "sessionLoggers",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves a list of trust stores.
 */
export const listTrustStores = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTrustStoresRequest,
    output: ListTrustStoresResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves a list of user access logging settings.
 */
export const listUserAccessLoggingSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListUserAccessLoggingSettingsRequest,
    output: ListUserAccessLoggingSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a list of user settings.
 */
export const listUserSettings = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListUserSettingsRequest,
    output: ListUserSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Deletes browser settings.
 */
export const deleteBrowserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBrowserSettingsRequest,
    output: DeleteBrowserSettingsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes data protection settings.
 */
export const deleteDataProtectionSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDataProtectionSettingsRequest,
    output: DeleteDataProtectionSettingsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes the identity provider.
 */
export const deleteIdentityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIdentityProviderRequest,
    output: DeleteIdentityProviderResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes IP access settings.
 */
export const deleteIpAccessSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIpAccessSettingsRequest,
    output: DeleteIpAccessSettingsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes network settings.
 */
export const deleteNetworkSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteNetworkSettingsRequest,
    output: DeleteNetworkSettingsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a web portal.
 */
export const deletePortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePortalRequest,
  output: DeletePortalResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a session logger resource.
 */
export const deleteSessionLogger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSessionLoggerRequest,
  output: DeleteSessionLoggerResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the trust store.
 */
export const deleteTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrustStoreRequest,
  output: DeleteTrustStoreResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes user access logging settings.
 */
export const deleteUserAccessLoggingSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteUserAccessLoggingSettingsRequest,
    output: DeleteUserAccessLoggingSettingsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes user settings.
 */
export const deleteUserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserSettingsRequest,
  output: DeleteUserSettingsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Expires an active secure browser session.
 */
export const expireSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExpireSessionRequest,
  output: ExpireSessionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a trust store that can be associated with a web portal. A trust store contains certificate authority (CA) certificates. Once associated with a web portal, the browser in a streaming session will recognize certificates that have been issued using any of the CAs in the trust store. If your organization has internal websites that use certificates issued by private CAs, you should add the private CA certificate to the trust store.
 */
export const createTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrustStoreRequest,
  output: CreateTrustStoreResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a user access logging settings resource that can be associated with a web portal.
 */
export const createUserAccessLoggingSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateUserAccessLoggingSettingsRequest,
    output: CreateUserAccessLoggingSettingsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates an IP access settings resource that can be associated with a web portal.
 */
export const createIpAccessSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateIpAccessSettingsRequest,
    output: CreateIpAccessSettingsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a data protection settings resource that can be associated with a web portal.
 */
export const createDataProtectionSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDataProtectionSettingsRequest,
    output: CreateDataProtectionSettingsResponse,
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
 * Creates a user settings resource that can be associated with a web portal. Once associated with a web portal, user settings control how users can transfer data between a streaming session and the their local devices.
 */
export const createUserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserSettingsRequest,
  output: CreateUserSettingsResponse,
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
 * Gets user settings.
 */
export const getUserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserSettingsRequest,
  output: GetUserSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds or overwrites one or more tags for the specified resource.
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

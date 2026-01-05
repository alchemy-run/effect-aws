import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "codeartifact",
  serviceShapeName: "CodeArtifactControlPlaneService",
});
const auth = T.AwsAuthSigv4({ name: "codeartifact" });
const ver = T.ServiceVersion("2018-09-22");
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
                        url: "https://codeartifact-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://codeartifact-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://codeartifact.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://codeartifact.{Region}.{PartitionResult#dnsSuffix}",
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
export const PackageVersionList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateExternalConnectionRequest extends S.Class<AssociateExternalConnectionRequest>(
  "AssociateExternalConnectionRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    externalConnection: S.String.pipe(T.HttpQuery("external-connection")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/repository/external-connection" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreatePackageGroupRequest extends S.Class<CreatePackageGroupRequest>(
  "CreatePackageGroupRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String,
    contactInfo: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainRequest extends S.Class<DeleteDomainRequest>(
  "DeleteDomainRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/domain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainPermissionsPolicyRequest extends S.Class<DeleteDomainPermissionsPolicyRequest>(
  "DeleteDomainPermissionsPolicyRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    policyRevision: S.optional(S.String).pipe(T.HttpQuery("policy-revision")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/domain/permissions/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePackageRequest extends S.Class<DeletePackageRequest>(
  "DeletePackageRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/package" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePackageGroupRequest extends S.Class<DeletePackageGroupRequest>(
  "DeletePackageGroupRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/package-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePackageVersionsRequest extends S.Class<DeletePackageVersionsRequest>(
  "DeletePackageVersionsRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    versions: PackageVersionList,
    expectedStatus: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package/versions/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRepositoryRequest extends S.Class<DeleteRepositoryRequest>(
  "DeleteRepositoryRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/repository" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRepositoryPermissionsPolicyRequest extends S.Class<DeleteRepositoryPermissionsPolicyRequest>(
  "DeleteRepositoryPermissionsPolicyRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    policyRevision: S.optional(S.String).pipe(T.HttpQuery("policy-revision")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/repository/permissions/policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDomainRequest extends S.Class<DescribeDomainRequest>(
  "DescribeDomainRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/domain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePackageRequest extends S.Class<DescribePackageRequest>(
  "DescribePackageRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/package" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePackageGroupRequest extends S.Class<DescribePackageGroupRequest>(
  "DescribePackageGroupRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/package-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePackageVersionRequest extends S.Class<DescribePackageVersionRequest>(
  "DescribePackageVersionRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    packageVersion: S.String.pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/package/version" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRepositoryRequest extends S.Class<DescribeRepositoryRequest>(
  "DescribeRepositoryRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/repository" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateExternalConnectionRequest extends S.Class<DisassociateExternalConnectionRequest>(
  "DisassociateExternalConnectionRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    externalConnection: S.String.pipe(T.HttpQuery("external-connection")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/repository/external-connection" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const PackageVersionRevisionMap = S.Record({
  key: S.String,
  value: S.String,
});
export class DisposePackageVersionsRequest extends S.Class<DisposePackageVersionsRequest>(
  "DisposePackageVersionsRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    versions: PackageVersionList,
    versionRevisions: S.optional(PackageVersionRevisionMap),
    expectedStatus: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package/versions/dispose" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssociatedPackageGroupRequest extends S.Class<GetAssociatedPackageGroupRequest>(
  "GetAssociatedPackageGroupRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/get-associated-package-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAuthorizationTokenRequest extends S.Class<GetAuthorizationTokenRequest>(
  "GetAuthorizationTokenRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    durationSeconds: S.optional(S.Number).pipe(T.HttpQuery("duration")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/authorization-token" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainPermissionsPolicyRequest extends S.Class<GetDomainPermissionsPolicyRequest>(
  "GetDomainPermissionsPolicyRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/domain/permissions/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPackageVersionAssetRequest extends S.Class<GetPackageVersionAssetRequest>(
  "GetPackageVersionAssetRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    packageVersion: S.String.pipe(T.HttpQuery("version")),
    asset: S.String.pipe(T.HttpQuery("asset")),
    packageVersionRevision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/package/version/asset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPackageVersionReadmeRequest extends S.Class<GetPackageVersionReadmeRequest>(
  "GetPackageVersionReadmeRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    packageVersion: S.String.pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/package/version/readme" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRepositoryEndpointRequest extends S.Class<GetRepositoryEndpointRequest>(
  "GetRepositoryEndpointRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    endpointType: S.optional(S.String).pipe(T.HttpQuery("endpointType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/repository/endpoint" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRepositoryPermissionsPolicyRequest extends S.Class<GetRepositoryPermissionsPolicyRequest>(
  "GetRepositoryPermissionsPolicyRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/repository/permissions/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAllowedRepositoriesForGroupRequest extends S.Class<ListAllowedRepositoriesForGroupRequest>(
  "ListAllowedRepositoriesForGroupRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
    originRestrictionType: S.String.pipe(T.HttpQuery("originRestrictionType")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/package-group-allowed-repositories" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssociatedPackagesRequest extends S.Class<ListAssociatedPackagesRequest>(
  "ListAssociatedPackagesRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    preview: S.optional(S.Boolean).pipe(T.HttpQuery("preview")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/list-associated-packages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainsRequest extends S.Class<ListDomainsRequest>(
  "ListDomainsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPackageGroupsRequest extends S.Class<ListPackageGroupsRequest>(
  "ListPackageGroupsRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPackagesRequest extends S.Class<ListPackagesRequest>(
  "ListPackagesRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.optional(S.String).pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    packagePrefix: S.optional(S.String).pipe(T.HttpQuery("package-prefix")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    publish: S.optional(S.String).pipe(T.HttpQuery("publish")),
    upstream: S.optional(S.String).pipe(T.HttpQuery("upstream")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/packages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPackageVersionAssetsRequest extends S.Class<ListPackageVersionAssetsRequest>(
  "ListPackageVersionAssetsRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    packageVersion: S.String.pipe(T.HttpQuery("version")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package/version/assets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPackageVersionDependenciesRequest extends S.Class<ListPackageVersionDependenciesRequest>(
  "ListPackageVersionDependenciesRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    packageVersion: S.String.pipe(T.HttpQuery("version")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package/version/dependencies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPackageVersionsRequest extends S.Class<ListPackageVersionsRequest>(
  "ListPackageVersionsRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    originType: S.optional(S.String).pipe(T.HttpQuery("originType")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRepositoriesRequest extends S.Class<ListRepositoriesRequest>(
  "ListRepositoriesRequest",
)(
  {
    repositoryPrefix: S.optional(S.String).pipe(
      T.HttpQuery("repository-prefix"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/repositories" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRepositoriesInDomainRequest extends S.Class<ListRepositoriesInDomainRequest>(
  "ListRepositoriesInDomainRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    administratorAccount: S.optional(S.String).pipe(
      T.HttpQuery("administrator-account"),
    ),
    repositoryPrefix: S.optional(S.String).pipe(
      T.HttpQuery("repository-prefix"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/domain/repositories" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSubPackageGroupsRequest extends S.Class<ListSubPackageGroupsRequest>(
  "ListSubPackageGroupsRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package-groups/sub-groups" }),
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
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublishPackageVersionRequest extends S.Class<PublishPackageVersionRequest>(
  "PublishPackageVersionRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    packageVersion: S.String.pipe(T.HttpQuery("version")),
    assetContent: T.StreamingInput.pipe(T.HttpPayload()),
    assetName: S.String.pipe(T.HttpQuery("asset")),
    assetSHA256: S.String.pipe(T.HttpHeader("x-amz-content-sha256")),
    unfinished: S.optional(S.Boolean).pipe(T.HttpQuery("unfinished")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package/version/publish" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDomainPermissionsPolicyRequest extends S.Class<PutDomainPermissionsPolicyRequest>(
  "PutDomainPermissionsPolicyRequest",
)(
  {
    domain: S.String,
    domainOwner: S.optional(S.String),
    policyRevision: S.optional(S.String),
    policyDocument: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/domain/permissions/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutRepositoryPermissionsPolicyRequest extends S.Class<PutRepositoryPermissionsPolicyRequest>(
  "PutRepositoryPermissionsPolicyRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    policyRevision: S.optional(S.String),
    policyDocument: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/repository/permissions/policy" }),
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
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")), tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/v1/tag" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResult extends S.Class<TagResourceResult>(
  "TagResourceResult",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tagKeys: TagKeyList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/untag" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResult extends S.Class<UntagResourceResult>(
  "UntagResourceResult",
)({}) {}
export class UpdatePackageGroupRequest extends S.Class<UpdatePackageGroupRequest>(
  "UpdatePackageGroupRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String,
    contactInfo: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/package-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePackageVersionsStatusRequest extends S.Class<UpdatePackageVersionsStatusRequest>(
  "UpdatePackageVersionsStatusRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    versions: PackageVersionList,
    versionRevisions: S.optional(PackageVersionRevisionMap),
    expectedStatus: S.optional(S.String),
    targetStatus: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package/versions/update_status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpstreamRepository extends S.Class<UpstreamRepository>(
  "UpstreamRepository",
)({ repositoryName: S.String }) {}
export const UpstreamRepositoryList = S.Array(UpstreamRepository);
export class UpdateRepositoryRequest extends S.Class<UpdateRepositoryRequest>(
  "UpdateRepositoryRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    description: S.optional(S.String),
    upstreams: S.optional(UpstreamRepositoryList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/repository" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const RepositoryNameList = S.Array(S.String);
export class PackageOriginRestrictions extends S.Class<PackageOriginRestrictions>(
  "PackageOriginRestrictions",
)({ publish: S.String, upstream: S.String }) {}
export class PackageOriginConfiguration extends S.Class<PackageOriginConfiguration>(
  "PackageOriginConfiguration",
)({ restrictions: S.optional(PackageOriginRestrictions) }) {}
export class PackageSummary extends S.Class<PackageSummary>("PackageSummary")({
  format: S.optional(S.String),
  namespace: S.optional(S.String),
  package: S.optional(S.String),
  originConfiguration: S.optional(PackageOriginConfiguration),
}) {}
export const PackageSummaryList = S.Array(PackageSummary);
export const OriginRestrictions = S.Record({ key: S.String, value: S.String });
export class PackageGroupAllowedRepository extends S.Class<PackageGroupAllowedRepository>(
  "PackageGroupAllowedRepository",
)({
  repositoryName: S.optional(S.String),
  originRestrictionType: S.optional(S.String),
}) {}
export const PackageGroupAllowedRepositoryList = S.Array(
  PackageGroupAllowedRepository,
);
export class CopyPackageVersionsRequest extends S.Class<CopyPackageVersionsRequest>(
  "CopyPackageVersionsRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    sourceRepository: S.String.pipe(T.HttpQuery("source-repository")),
    destinationRepository: S.String.pipe(T.HttpQuery("destination-repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    versions: S.optional(PackageVersionList),
    versionRevisions: S.optional(PackageVersionRevisionMap),
    allowOverwrite: S.optional(S.Boolean),
    includeFromUpstream: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package/versions/copy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDomainRequest extends S.Class<CreateDomainRequest>(
  "CreateDomainRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    encryptionKey: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/domain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRepositoryRequest extends S.Class<CreateRepositoryRequest>(
  "CreateRepositoryRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    description: S.optional(S.String),
    upstreams: S.optional(UpstreamRepositoryList),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/repository" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PackageGroupReference extends S.Class<PackageGroupReference>(
  "PackageGroupReference",
)({ arn: S.optional(S.String), pattern: S.optional(S.String) }) {}
export class PackageGroupOriginRestriction extends S.Class<PackageGroupOriginRestriction>(
  "PackageGroupOriginRestriction",
)({
  mode: S.optional(S.String),
  effectiveMode: S.optional(S.String),
  inheritedFrom: S.optional(PackageGroupReference),
  repositoriesCount: S.optional(S.Number),
}) {}
export const PackageGroupOriginRestrictions = S.Record({
  key: S.String,
  value: PackageGroupOriginRestriction,
});
export class PackageGroupOriginConfiguration extends S.Class<PackageGroupOriginConfiguration>(
  "PackageGroupOriginConfiguration",
)({ restrictions: S.optional(PackageGroupOriginRestrictions) }) {}
export class PackageGroupDescription extends S.Class<PackageGroupDescription>(
  "PackageGroupDescription",
)({
  arn: S.optional(S.String),
  pattern: S.optional(S.String),
  domainName: S.optional(S.String),
  domainOwner: S.optional(S.String),
  createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  contactInfo: S.optional(S.String),
  description: S.optional(S.String),
  originConfiguration: S.optional(PackageGroupOriginConfiguration),
  parent: S.optional(PackageGroupReference),
}) {}
export class DeletePackageGroupResult extends S.Class<DeletePackageGroupResult>(
  "DeletePackageGroupResult",
)({ packageGroup: S.optional(PackageGroupDescription) }) {}
export class UpstreamRepositoryInfo extends S.Class<UpstreamRepositoryInfo>(
  "UpstreamRepositoryInfo",
)({ repositoryName: S.optional(S.String) }) {}
export const UpstreamRepositoryInfoList = S.Array(UpstreamRepositoryInfo);
export class RepositoryExternalConnectionInfo extends S.Class<RepositoryExternalConnectionInfo>(
  "RepositoryExternalConnectionInfo",
)({
  externalConnectionName: S.optional(S.String),
  packageFormat: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export const RepositoryExternalConnectionInfoList = S.Array(
  RepositoryExternalConnectionInfo,
);
export class RepositoryDescription extends S.Class<RepositoryDescription>(
  "RepositoryDescription",
)({
  name: S.optional(S.String),
  administratorAccount: S.optional(S.String),
  domainName: S.optional(S.String),
  domainOwner: S.optional(S.String),
  arn: S.optional(S.String),
  description: S.optional(S.String),
  upstreams: S.optional(UpstreamRepositoryInfoList),
  externalConnections: S.optional(RepositoryExternalConnectionInfoList),
  createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeleteRepositoryResult extends S.Class<DeleteRepositoryResult>(
  "DeleteRepositoryResult",
)({ repository: S.optional(RepositoryDescription) }) {}
export class ResourcePolicy extends S.Class<ResourcePolicy>("ResourcePolicy")({
  resourceArn: S.optional(S.String),
  revision: S.optional(S.String),
  document: S.optional(S.String),
}) {}
export class DeleteRepositoryPermissionsPolicyResult extends S.Class<DeleteRepositoryPermissionsPolicyResult>(
  "DeleteRepositoryPermissionsPolicyResult",
)({ policy: S.optional(ResourcePolicy) }) {}
export class DomainDescription extends S.Class<DomainDescription>(
  "DomainDescription",
)({
  name: S.optional(S.String),
  owner: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  encryptionKey: S.optional(S.String),
  repositoryCount: S.optional(S.Number),
  assetSizeBytes: S.optional(S.Number),
  s3BucketArn: S.optional(S.String),
}) {}
export class DescribeDomainResult extends S.Class<DescribeDomainResult>(
  "DescribeDomainResult",
)({ domain: S.optional(DomainDescription) }) {}
export class DescribePackageGroupResult extends S.Class<DescribePackageGroupResult>(
  "DescribePackageGroupResult",
)({ packageGroup: S.optional(PackageGroupDescription) }) {}
export class DescribeRepositoryResult extends S.Class<DescribeRepositoryResult>(
  "DescribeRepositoryResult",
)({ repository: S.optional(RepositoryDescription) }) {}
export class DisassociateExternalConnectionResult extends S.Class<DisassociateExternalConnectionResult>(
  "DisassociateExternalConnectionResult",
)({ repository: S.optional(RepositoryDescription) }) {}
export class SuccessfulPackageVersionInfo extends S.Class<SuccessfulPackageVersionInfo>(
  "SuccessfulPackageVersionInfo",
)({ revision: S.optional(S.String), status: S.optional(S.String) }) {}
export const SuccessfulPackageVersionInfoMap = S.Record({
  key: S.String,
  value: SuccessfulPackageVersionInfo,
});
export class PackageVersionError extends S.Class<PackageVersionError>(
  "PackageVersionError",
)({ errorCode: S.optional(S.String), errorMessage: S.optional(S.String) }) {}
export const PackageVersionErrorMap = S.Record({
  key: S.String,
  value: PackageVersionError,
});
export class DisposePackageVersionsResult extends S.Class<DisposePackageVersionsResult>(
  "DisposePackageVersionsResult",
)({
  successfulVersions: S.optional(SuccessfulPackageVersionInfoMap),
  failedVersions: S.optional(PackageVersionErrorMap),
}) {}
export class GetAssociatedPackageGroupResult extends S.Class<GetAssociatedPackageGroupResult>(
  "GetAssociatedPackageGroupResult",
)({
  packageGroup: S.optional(PackageGroupDescription),
  associationType: S.optional(S.String),
}) {}
export class GetAuthorizationTokenResult extends S.Class<GetAuthorizationTokenResult>(
  "GetAuthorizationTokenResult",
)({
  authorizationToken: S.optional(S.String),
  expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetDomainPermissionsPolicyResult extends S.Class<GetDomainPermissionsPolicyResult>(
  "GetDomainPermissionsPolicyResult",
)({ policy: S.optional(ResourcePolicy) }) {}
export class GetPackageVersionAssetResult extends S.Class<GetPackageVersionAssetResult>(
  "GetPackageVersionAssetResult",
)({
  asset: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  assetName: S.optional(S.String).pipe(T.HttpHeader("X-AssetName")),
  packageVersion: S.optional(S.String).pipe(T.HttpHeader("X-PackageVersion")),
  packageVersionRevision: S.optional(S.String).pipe(
    T.HttpHeader("X-PackageVersionRevision"),
  ),
}) {}
export class GetPackageVersionReadmeResult extends S.Class<GetPackageVersionReadmeResult>(
  "GetPackageVersionReadmeResult",
)({
  format: S.optional(S.String),
  namespace: S.optional(S.String),
  package: S.optional(S.String),
  version: S.optional(S.String),
  versionRevision: S.optional(S.String),
  readme: S.optional(S.String),
}) {}
export class GetRepositoryEndpointResult extends S.Class<GetRepositoryEndpointResult>(
  "GetRepositoryEndpointResult",
)({ repositoryEndpoint: S.optional(S.String) }) {}
export class GetRepositoryPermissionsPolicyResult extends S.Class<GetRepositoryPermissionsPolicyResult>(
  "GetRepositoryPermissionsPolicyResult",
)({ policy: S.optional(ResourcePolicy) }) {}
export class ListAllowedRepositoriesForGroupResult extends S.Class<ListAllowedRepositoriesForGroupResult>(
  "ListAllowedRepositoriesForGroupResult",
)({
  allowedRepositories: S.optional(RepositoryNameList),
  nextToken: S.optional(S.String),
}) {}
export class ListPackagesResult extends S.Class<ListPackagesResult>(
  "ListPackagesResult",
)({
  packages: S.optional(PackageSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class RepositorySummary extends S.Class<RepositorySummary>(
  "RepositorySummary",
)({
  name: S.optional(S.String),
  administratorAccount: S.optional(S.String),
  domainName: S.optional(S.String),
  domainOwner: S.optional(S.String),
  arn: S.optional(S.String),
  description: S.optional(S.String),
  createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const RepositorySummaryList = S.Array(RepositorySummary);
export class ListRepositoriesInDomainResult extends S.Class<ListRepositoriesInDomainResult>(
  "ListRepositoriesInDomainResult",
)({
  repositories: S.optional(RepositorySummaryList),
  nextToken: S.optional(S.String),
}) {}
export class PackageGroupSummary extends S.Class<PackageGroupSummary>(
  "PackageGroupSummary",
)({
  arn: S.optional(S.String),
  pattern: S.optional(S.String),
  domainName: S.optional(S.String),
  domainOwner: S.optional(S.String),
  createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  contactInfo: S.optional(S.String),
  description: S.optional(S.String),
  originConfiguration: S.optional(PackageGroupOriginConfiguration),
  parent: S.optional(PackageGroupReference),
}) {}
export const PackageGroupSummaryList = S.Array(PackageGroupSummary);
export class ListSubPackageGroupsResult extends S.Class<ListSubPackageGroupsResult>(
  "ListSubPackageGroupsResult",
)({
  packageGroups: S.optional(PackageGroupSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResult extends S.Class<ListTagsForResourceResult>(
  "ListTagsForResourceResult",
)({ tags: S.optional(TagList) }) {}
export const AssetHashes = S.Record({ key: S.String, value: S.String });
export class AssetSummary extends S.Class<AssetSummary>("AssetSummary")({
  name: S.String,
  size: S.optional(S.Number),
  hashes: S.optional(AssetHashes),
}) {}
export class PublishPackageVersionResult extends S.Class<PublishPackageVersionResult>(
  "PublishPackageVersionResult",
)({
  format: S.optional(S.String),
  namespace: S.optional(S.String),
  package: S.optional(S.String),
  version: S.optional(S.String),
  versionRevision: S.optional(S.String),
  status: S.optional(S.String),
  asset: S.optional(AssetSummary),
}) {}
export class PutDomainPermissionsPolicyResult extends S.Class<PutDomainPermissionsPolicyResult>(
  "PutDomainPermissionsPolicyResult",
)({ policy: S.optional(ResourcePolicy) }) {}
export class PutPackageOriginConfigurationRequest extends S.Class<PutPackageOriginConfigurationRequest>(
  "PutPackageOriginConfigurationRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    restrictions: PackageOriginRestrictions,
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/package" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutRepositoryPermissionsPolicyResult extends S.Class<PutRepositoryPermissionsPolicyResult>(
  "PutRepositoryPermissionsPolicyResult",
)({ policy: S.optional(ResourcePolicy) }) {}
export class UpdatePackageGroupResult extends S.Class<UpdatePackageGroupResult>(
  "UpdatePackageGroupResult",
)({ packageGroup: S.optional(PackageGroupDescription) }) {}
export class UpdatePackageGroupOriginConfigurationRequest extends S.Class<UpdatePackageGroupOriginConfigurationRequest>(
  "UpdatePackageGroupOriginConfigurationRequest",
)(
  {
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
    restrictions: S.optional(OriginRestrictions),
    addAllowedRepositories: S.optional(PackageGroupAllowedRepositoryList),
    removeAllowedRepositories: S.optional(PackageGroupAllowedRepositoryList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/package-group-origin-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePackageVersionsStatusResult extends S.Class<UpdatePackageVersionsStatusResult>(
  "UpdatePackageVersionsStatusResult",
)({
  successfulVersions: S.optional(SuccessfulPackageVersionInfoMap),
  failedVersions: S.optional(PackageVersionErrorMap),
}) {}
export class UpdateRepositoryResult extends S.Class<UpdateRepositoryResult>(
  "UpdateRepositoryResult",
)({ repository: S.optional(RepositoryDescription) }) {}
export class PackageDescription extends S.Class<PackageDescription>(
  "PackageDescription",
)({
  format: S.optional(S.String),
  namespace: S.optional(S.String),
  name: S.optional(S.String),
  originConfiguration: S.optional(PackageOriginConfiguration),
}) {}
export class AssociatedPackage extends S.Class<AssociatedPackage>(
  "AssociatedPackage",
)({
  format: S.optional(S.String),
  namespace: S.optional(S.String),
  package: S.optional(S.String),
  associationType: S.optional(S.String),
}) {}
export const AssociatedPackageList = S.Array(AssociatedPackage);
export class DomainSummary extends S.Class<DomainSummary>("DomainSummary")({
  name: S.optional(S.String),
  owner: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  encryptionKey: S.optional(S.String),
}) {}
export const DomainSummaryList = S.Array(DomainSummary);
export class PackageDependency extends S.Class<PackageDependency>(
  "PackageDependency",
)({
  namespace: S.optional(S.String),
  package: S.optional(S.String),
  dependencyType: S.optional(S.String),
  versionRequirement: S.optional(S.String),
}) {}
export const PackageDependencyList = S.Array(PackageDependency);
export class DomainEntryPoint extends S.Class<DomainEntryPoint>(
  "DomainEntryPoint",
)({
  repositoryName: S.optional(S.String),
  externalConnectionName: S.optional(S.String),
}) {}
export class PackageVersionOrigin extends S.Class<PackageVersionOrigin>(
  "PackageVersionOrigin",
)({
  domainEntryPoint: S.optional(DomainEntryPoint),
  originType: S.optional(S.String),
}) {}
export class PackageVersionSummary extends S.Class<PackageVersionSummary>(
  "PackageVersionSummary",
)({
  version: S.String,
  revision: S.optional(S.String),
  status: S.String,
  origin: S.optional(PackageVersionOrigin),
}) {}
export const PackageVersionSummaryList = S.Array(PackageVersionSummary);
export class CopyPackageVersionsResult extends S.Class<CopyPackageVersionsResult>(
  "CopyPackageVersionsResult",
)({
  successfulVersions: S.optional(SuccessfulPackageVersionInfoMap),
  failedVersions: S.optional(PackageVersionErrorMap),
}) {}
export class CreateDomainResult extends S.Class<CreateDomainResult>(
  "CreateDomainResult",
)({ domain: S.optional(DomainDescription) }) {}
export class CreateRepositoryResult extends S.Class<CreateRepositoryResult>(
  "CreateRepositoryResult",
)({ repository: S.optional(RepositoryDescription) }) {}
export class DeleteDomainResult extends S.Class<DeleteDomainResult>(
  "DeleteDomainResult",
)({ domain: S.optional(DomainDescription) }) {}
export class DeleteDomainPermissionsPolicyResult extends S.Class<DeleteDomainPermissionsPolicyResult>(
  "DeleteDomainPermissionsPolicyResult",
)({ policy: S.optional(ResourcePolicy) }) {}
export class DescribePackageResult extends S.Class<DescribePackageResult>(
  "DescribePackageResult",
)({ package: PackageDescription }) {}
export class ListAssociatedPackagesResult extends S.Class<ListAssociatedPackagesResult>(
  "ListAssociatedPackagesResult",
)({
  packages: S.optional(AssociatedPackageList),
  nextToken: S.optional(S.String),
}) {}
export class ListDomainsResult extends S.Class<ListDomainsResult>(
  "ListDomainsResult",
)({
  domains: S.optional(DomainSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListPackageGroupsResult extends S.Class<ListPackageGroupsResult>(
  "ListPackageGroupsResult",
)({
  packageGroups: S.optional(PackageGroupSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListPackageVersionDependenciesResult extends S.Class<ListPackageVersionDependenciesResult>(
  "ListPackageVersionDependenciesResult",
)({
  format: S.optional(S.String),
  namespace: S.optional(S.String),
  package: S.optional(S.String),
  version: S.optional(S.String),
  versionRevision: S.optional(S.String),
  nextToken: S.optional(S.String),
  dependencies: S.optional(PackageDependencyList),
}) {}
export class ListPackageVersionsResult extends S.Class<ListPackageVersionsResult>(
  "ListPackageVersionsResult",
)({
  defaultDisplayVersion: S.optional(S.String),
  format: S.optional(S.String),
  namespace: S.optional(S.String),
  package: S.optional(S.String),
  versions: S.optional(PackageVersionSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListRepositoriesResult extends S.Class<ListRepositoriesResult>(
  "ListRepositoriesResult",
)({
  repositories: S.optional(RepositorySummaryList),
  nextToken: S.optional(S.String),
}) {}
export class PutPackageOriginConfigurationResult extends S.Class<PutPackageOriginConfigurationResult>(
  "PutPackageOriginConfigurationResult",
)({ originConfiguration: S.optional(PackageOriginConfiguration) }) {}
export class LicenseInfo extends S.Class<LicenseInfo>("LicenseInfo")({
  name: S.optional(S.String),
  url: S.optional(S.String),
}) {}
export const LicenseInfoList = S.Array(LicenseInfo);
export const AssetSummaryList = S.Array(AssetSummary);
export class AssociateExternalConnectionResult extends S.Class<AssociateExternalConnectionResult>(
  "AssociateExternalConnectionResult",
)({ repository: S.optional(RepositoryDescription) }) {}
export class DeletePackageResult extends S.Class<DeletePackageResult>(
  "DeletePackageResult",
)({ deletedPackage: S.optional(PackageSummary) }) {}
export class DeletePackageVersionsResult extends S.Class<DeletePackageVersionsResult>(
  "DeletePackageVersionsResult",
)({
  successfulVersions: S.optional(SuccessfulPackageVersionInfoMap),
  failedVersions: S.optional(PackageVersionErrorMap),
}) {}
export class ListPackageVersionAssetsResult extends S.Class<ListPackageVersionAssetsResult>(
  "ListPackageVersionAssetsResult",
)({
  format: S.optional(S.String),
  namespace: S.optional(S.String),
  package: S.optional(S.String),
  version: S.optional(S.String),
  versionRevision: S.optional(S.String),
  nextToken: S.optional(S.String),
  assets: S.optional(AssetSummaryList),
}) {}
export const PackageGroupAllowedRepositoryUpdate = S.Record({
  key: S.String,
  value: RepositoryNameList,
});
export class PackageVersionDescription extends S.Class<PackageVersionDescription>(
  "PackageVersionDescription",
)({
  format: S.optional(S.String),
  namespace: S.optional(S.String),
  packageName: S.optional(S.String),
  displayName: S.optional(S.String),
  version: S.optional(S.String),
  summary: S.optional(S.String),
  homePage: S.optional(S.String),
  sourceCodeRepository: S.optional(S.String),
  publishedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  licenses: S.optional(LicenseInfoList),
  revision: S.optional(S.String),
  status: S.optional(S.String),
  origin: S.optional(PackageVersionOrigin),
}) {}
export const PackageGroupAllowedRepositoryUpdates = S.Record({
  key: S.String,
  value: PackageGroupAllowedRepositoryUpdate,
});
export class DescribePackageVersionResult extends S.Class<DescribePackageVersionResult>(
  "DescribePackageVersionResult",
)({ packageVersion: PackageVersionDescription }) {}
export class UpdatePackageGroupOriginConfigurationResult extends S.Class<UpdatePackageGroupOriginConfigurationResult>(
  "UpdatePackageGroupOriginConfigurationResult",
)({
  packageGroup: S.optional(PackageGroupDescription),
  allowedRepositoryUpdates: S.optional(PackageGroupAllowedRepositoryUpdates),
}) {}
export class CreatePackageGroupResult extends S.Class<CreatePackageGroupResult>(
  "CreatePackageGroupResult",
)({ packageGroup: S.optional(PackageGroupDescription) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String, reason: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns the most closely associated package group to the specified package. This API does not require that the package exist
 * in any repository in the domain. As such, `GetAssociatedPackageGroup` can be used to see which package group's origin configuration
 * applies to a package before that package is in a repository. This can be helpful to check if public packages are blocked without ingesting them.
 *
 * For information package group association and matching, see
 * Package group
 * definition syntax and matching behavior in the *CodeArtifact User Guide*.
 */
export const getAssociatedPackageGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAssociatedPackageGroupRequest,
    output: GetAssociatedPackageGroupResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Removes tags from a resource in CodeArtifact.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResult,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about Amazon Web Services tags for a specified Amazon Resource Name (ARN) in CodeArtifact.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a
 * DomainDescription
 * object that contains information about the requested domain.
 */
export const describeDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainRequest,
  output: DescribeDomainResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a PackageGroupDescription object that
 * contains information about the requested package group.
 */
export const describePackageGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePackageGroupRequest,
    output: DescribePackageGroupResult,
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
 * Returns a `RepositoryDescription` object that contains detailed information
 * about the requested repository.
 */
export const describeRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRepositoryRequest,
  output: DescribeRepositoryResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Generates a temporary authorization token for accessing repositories in the domain.
 * This API requires the `codeartifact:GetAuthorizationToken` and `sts:GetServiceBearerToken` permissions.
 * For more information about authorization tokens, see
 * CodeArtifact authentication and tokens.
 *
 * CodeArtifact authorization tokens are valid for a period of 12 hours when created with the `login` command.
 * You can call `login` periodically to refresh the token. When
 * you create an authorization token with the `GetAuthorizationToken` API, you can set a custom authorization period,
 * up to a maximum of 12 hours, with the `durationSeconds` parameter.
 *
 * The authorization period begins after `login`
 * or `GetAuthorizationToken` is called. If `login` or `GetAuthorizationToken` is called while
 * assuming a role, the token lifetime is independent of the maximum session duration
 * of the role. For example, if you call `sts assume-role` and specify a session duration of 15 minutes, then
 * generate a CodeArtifact authorization token, the token will be valid for the full authorization period
 * even though this is longer than the 15-minute session duration.
 *
 * See
 * Using IAM Roles
 * for more information on controlling session duration.
 */
export const getAuthorizationToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAuthorizationTokenRequest,
    output: GetAuthorizationTokenResult,
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
 * Returns the resource policy attached to the specified domain.
 *
 * The policy is a resource-based policy, not an identity-based policy. For more information, see
 * Identity-based policies
 * and resource-based policies in the *IAM User Guide*.
 */
export const getDomainPermissionsPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDomainPermissionsPolicyRequest,
    output: GetDomainPermissionsPolicyResult,
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
 * Gets the readme file or descriptive text for a package version.
 *
 * The returned text might contain formatting. For example, it might contain formatting for Markdown or reStructuredText.
 */
export const getPackageVersionReadme = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPackageVersionReadmeRequest,
    output: GetPackageVersionReadmeResult,
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
 * Returns the endpoint of a repository for a specific package format. A repository has one endpoint for each
 * package format:
 *
 * - `cargo`
 *
 * - `generic`
 *
 * - `maven`
 *
 * - `npm`
 *
 * - `nuget`
 *
 * - `pypi`
 *
 * - `ruby`
 *
 * - `swift`
 */
export const getRepositoryEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRepositoryEndpointRequest,
    output: GetRepositoryEndpointResult,
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
 * Returns the resource policy that is set on a repository.
 */
export const getRepositoryPermissionsPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRepositoryPermissionsPolicyRequest,
    output: GetRepositoryPermissionsPolicyResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of
 * PackageSummary
 * objects for packages in a repository that match the request parameters.
 */
export const listPackages = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPackagesRequest,
    output: ListPackagesResult,
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
      items: "packages",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of
 * RepositorySummary
 * objects. Each `RepositorySummary` contains information about a repository in the specified domain and that matches the input
 * parameters.
 */
export const listRepositoriesInDomain =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRepositoriesInDomainRequest,
    output: ListRepositoriesInDomainResult,
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
      items: "repositories",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of direct children of the specified package group.
 *
 * For information package group hierarchy, see
 * Package group
 * definition syntax and matching behavior in the *CodeArtifact User Guide*.
 */
export const listSubPackageGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSubPackageGroupsRequest,
    output: ListSubPackageGroupsResult,
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
      items: "packageGroups",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a
 * PackageDescription
 * object that contains information about the requested package.
 */
export const describePackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePackageRequest,
  output: DescribePackageResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of DomainSummary objects for all domains owned by the Amazon Web Services account that makes
 * this call. Each returned `DomainSummary` object contains information about a
 * domain.
 */
export const listDomains = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDomainsRequest,
    output: ListDomainsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "domains",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of package groups in the requested domain.
 */
export const listPackageGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPackageGroupsRequest,
    output: ListPackageGroupsResult,
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
      items: "packageGroups",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns the direct dependencies for a package version. The dependencies are returned as
 * PackageDependency
 * objects. CodeArtifact extracts the dependencies for a package version from the metadata file for the package
 * format (for example, the `package.json` file for npm packages and the `pom.xml` file
 * for Maven). Any package version dependencies that are not listed in the configuration file are not returned.
 */
export const listPackageVersionDependencies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListPackageVersionDependenciesRequest,
    output: ListPackageVersionDependenciesResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of
 * PackageVersionSummary
 * objects for package versions in a repository that match the request parameters. Package versions of all statuses will be returned by default when calling `list-package-versions` with no `--status` parameter.
 */
export const listPackageVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPackageVersionsRequest,
    output: ListPackageVersionsResult,
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
      items: "versions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of
 * RepositorySummary
 * objects. Each `RepositorySummary` contains information about a repository in the specified Amazon Web Services account and that matches the input
 * parameters.
 */
export const listRepositories = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRepositoriesRequest,
    output: ListRepositoriesResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "repositories",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Sets the package origin configuration for a package.
 *
 * The package origin configuration determines how new versions of a package can be added to a repository. You can allow or block direct
 * publishing of new package versions, or ingestion and retaining of new package versions from an external connection or upstream source.
 * For more information about package origin controls and configuration, see Editing package origin controls in the *CodeArtifact User Guide*.
 *
 * `PutPackageOriginConfiguration` can be called on a package that doesn't yet exist in the repository. When called
 * on a package that does not exist, a package is created in the repository with no versions and the requested restrictions are set on the package.
 * This can be used to preemptively block ingesting or retaining any versions from external connections or upstream repositories, or to block
 * publishing any versions of the package into the repository before connecting any package managers or publishers to the repository.
 */
export const putPackageOriginConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutPackageOriginConfigurationRequest,
    output: PutPackageOriginConfigurationResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes a repository.
 */
export const deleteRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRepositoryRequest,
  output: DeleteRepositoryResult,
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
 * Deletes the resource policy that is set on a repository. After a resource policy is deleted, the
 * permissions allowed and denied by the deleted policy are removed. The effect of deleting a resource policy might not be immediate.
 *
 * Use `DeleteRepositoryPermissionsPolicy` with caution. After a policy is deleted, Amazon Web Services users, roles, and accounts lose permissions to perform
 * the repository actions granted by the deleted policy.
 */
export const deleteRepositoryPermissionsPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRepositoryPermissionsPolicyRequest,
    output: DeleteRepositoryPermissionsPolicyResult,
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
 * Deletes the assets in package versions and sets the package versions' status to `Disposed`.
 * A disposed package version cannot be restored in your repository because its assets are deleted.
 *
 * To view all disposed package versions in a repository, use ListPackageVersions and set the
 * status parameter
 * to `Disposed`.
 *
 * To view information about a disposed package version, use DescribePackageVersion.
 */
export const disposePackageVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisposePackageVersionsRequest,
    output: DisposePackageVersionsResult,
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
 * Returns an asset (or file) that is in a package. For example, for a Maven package version, use
 * `GetPackageVersionAsset` to download a `JAR` file, a `POM` file,
 * or any other assets in the package version.
 */
export const getPackageVersionAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPackageVersionAssetRequest,
    output: GetPackageVersionAssetResult,
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
 * Deletes a domain. You cannot delete a domain that contains repositories. If you want to delete a domain
 * with repositories, first delete its repositories.
 */
export const deleteDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the resource policy set on a domain.
 */
export const deleteDomainPermissionsPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDomainPermissionsPolicyRequest,
    output: DeleteDomainPermissionsPolicyResult,
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
 * Deletes a package and all associated package versions. A deleted package cannot be restored. To delete one or more package versions, use the
 * DeletePackageVersions API.
 */
export const deletePackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePackageRequest,
  output: DeletePackageResult,
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
 * Deletes one or more versions of a package. A deleted package version cannot be restored
 * in your repository. If you want to remove a package version from your repository and be able
 * to restore it later, set its status to `Archived`. Archived packages cannot be
 * downloaded from a repository and don't show up with list package APIs (for example,
 * ListPackageVersions), but you can restore them using UpdatePackageVersionsStatus.
 */
export const deletePackageVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePackageVersionsRequest,
    output: DeletePackageVersionsResult,
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
 * Returns a list of
 * AssetSummary
 * objects for assets in a package version.
 */
export const listPackageVersionAssets =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPackageVersionAssetsRequest,
    output: ListPackageVersionAssetsResult,
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
      items: "assets",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Adds or updates tags for a resource in CodeArtifact.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResult,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of packages associated with the requested package group. For information package group association and matching, see
 * Package group
 * definition syntax and matching behavior in the *CodeArtifact User Guide*.
 */
export const listAssociatedPackages =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAssociatedPackagesRequest,
    output: ListAssociatedPackagesResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "packages",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Updates the status of one or more versions of a package. Using `UpdatePackageVersionsStatus`,
 * you can update the status of package versions to `Archived`, `Published`, or `Unlisted`.
 * To set the status of a package version to `Disposed`, use
 * DisposePackageVersions.
 */
export const updatePackageVersionsStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePackageVersionsStatusRequest,
    output: UpdatePackageVersionsStatusResult,
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
 * Updates a package group. This API cannot be used to update a package group's origin configuration or pattern. To update a
 * package group's origin configuration, use UpdatePackageGroupOriginConfiguration.
 */
export const updatePackageGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePackageGroupRequest,
  output: UpdatePackageGroupResult,
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
 * Lists the repositories in the added repositories list of the specified restriction type for a package group. For more information about restriction types
 * and added repository lists, see Package group origin controls in the *CodeArtifact User Guide*.
 */
export const listAllowedRepositoriesForGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAllowedRepositoriesForGroupRequest,
    output: ListAllowedRepositoriesForGroupResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "allowedRepositories",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Update the properties of a repository.
 */
export const updateRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRepositoryRequest,
  output: UpdateRepositoryResult,
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
 * Deletes a package group.
 * Deleting a package group does not delete packages or package versions associated with the package group.
 * When a package group is deleted, the direct child package groups will become children of the package
 * group's direct parent package group. Therefore, if any of the child groups are inheriting any settings
 * from the parent, those settings could change.
 */
export const deletePackageGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePackageGroupRequest,
  output: DeletePackageGroupResult,
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
 * Removes an existing external connection from a repository.
 */
export const disassociateExternalConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateExternalConnectionRequest,
    output: DisassociateExternalConnectionResult,
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
 * Creates a new package version containing one or more assets (or files).
 *
 * The `unfinished` flag can be used to keep the package version in the
 * `Unfinished` state until all of its assets have been uploaded (see Package version status in the *CodeArtifact user guide*). To set
 * the package version’s status to `Published`, omit the `unfinished` flag
 * when uploading the final asset, or set the status using UpdatePackageVersionStatus. Once a package version’s status is set to
 * `Published`, it cannot change back to `Unfinished`.
 *
 * Only generic packages can be published using this API. For more information, see Using generic
 * packages in the *CodeArtifact User Guide*.
 */
export const publishPackageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PublishPackageVersionRequest,
    output: PublishPackageVersionResult,
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
 * Sets a resource policy on a domain that specifies permissions to access it.
 *
 * When you call `PutDomainPermissionsPolicy`, the resource policy on the domain is ignored when evaluting permissions.
 * This ensures that the owner of a domain cannot lock themselves out of the domain, which would prevent them from being
 * able to update the resource policy.
 */
export const putDomainPermissionsPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutDomainPermissionsPolicyRequest,
    output: PutDomainPermissionsPolicyResult,
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
 * Sets the resource policy on a repository that specifies permissions to access it.
 *
 * When you call `PutRepositoryPermissionsPolicy`, the resource policy on the repository is ignored when evaluting permissions.
 * This ensures that the owner of a repository cannot lock themselves out of the repository, which would prevent them from being
 * able to update the resource policy.
 */
export const putRepositoryPermissionsPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutRepositoryPermissionsPolicyRequest,
    output: PutRepositoryPermissionsPolicyResult,
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
 * Copies package versions from one repository to another repository in the same domain.
 *
 * You must specify `versions` or `versionRevisions`. You cannot specify both.
 */
export const copyPackageVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyPackageVersionsRequest,
  output: CopyPackageVersionsResult,
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
 * Creates a domain. CodeArtifact *domains* make it easier to manage multiple repositories across an
 * organization. You can use a domain to apply permissions across many
 * repositories owned by different Amazon Web Services accounts. An asset is stored only once
 * in a domain, even if it's in multiple repositories.
 *
 * Although you can have multiple domains, we recommend a single production domain that contains all
 * published artifacts so that your development teams can find and share packages. You can use a second
 * pre-production domain to test changes to the production domain configuration.
 */
export const createDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainRequest,
  output: CreateDomainResult,
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
 * Creates a repository.
 */
export const createRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRepositoryRequest,
  output: CreateRepositoryResult,
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
 * Adds an existing external connection to a repository. One external connection is allowed
 * per repository.
 *
 * A repository can have one or more upstream repositories, or an external connection.
 */
export const associateExternalConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateExternalConnectionRequest,
    output: AssociateExternalConnectionResult,
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
 * Returns a
 * PackageVersionDescription
 * object that contains information about the requested package version.
 */
export const describePackageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePackageVersionRequest,
    output: DescribePackageVersionResult,
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
 * Updates the package origin configuration for a package group.
 *
 * The package origin configuration determines how new versions of a package can be added to a repository. You can allow or block direct
 * publishing of new package versions, or ingestion and retaining of new package versions from an external connection or upstream source.
 * For more information about package group origin controls and configuration, see
 * Package group origin controls
 * in the *CodeArtifact User Guide*.
 */
export const updatePackageGroupOriginConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdatePackageGroupOriginConfigurationRequest,
    output: UpdatePackageGroupOriginConfigurationResult,
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
 * Creates a package group. For more information about creating package groups, including example CLI commands, see Create a package group in the *CodeArtifact User Guide*.
 */
export const createPackageGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePackageGroupRequest,
  output: CreatePackageGroupResult,
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

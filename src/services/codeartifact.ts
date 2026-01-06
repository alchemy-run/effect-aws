import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
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

//# Newtypes
export type DomainName = string;
export type AccountId = string;
export type RepositoryName = string;
export type ExternalConnectionName = string;
export type PackageNamespace = string;
export type PackageName = string;
export type PackageVersion = string;
export type Arn = string;
export type PackageGroupPattern = string;
export type PackageGroupContactInfo = string;
export type Description = string;
export type PolicyRevision = string;
export type AuthorizationTokenDurationSeconds = number;
export type AssetName = string;
export type PackageVersionRevision = string;
export type ListAllowedRepositoriesForGroupMaxResults = number;
export type PaginationToken = string;
export type ListPackagesMaxResults = number;
export type ListDomainsMaxResults = number;
export type ListPackageGroupsMaxResults = number;
export type PackageGroupPatternPrefix = string;
export type ListPackageVersionAssetsMaxResults = number;
export type ListPackageVersionsMaxResults = number;
export type ListRepositoriesMaxResults = number;
export type ListRepositoriesInDomainMaxResults = number;
export type SHA256 = string;
export type PolicyDocument = string;
export type TagKey = string;
export type TagValue = string;
export type Integer = number;
export type Long = number;
export type String255 = string;
export type LongOptional = number;
export type ErrorMessage = string;
export type HashValue = string;
export type RetryAfterSeconds = number;

//# Schemas
export type PackageVersionList = string[];
export const PackageVersionList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateExternalConnectionRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  externalConnection: string;
}
export const AssociateExternalConnectionRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    externalConnection: S.String.pipe(T.HttpQuery("external-connection")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/repository/external-connection" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateExternalConnectionRequest",
}) as any as S.Schema<AssociateExternalConnectionRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreatePackageGroupRequest {
  domain: string;
  domainOwner?: string;
  packageGroup: string;
  contactInfo?: string;
  description?: string;
  tags?: TagList;
}
export const CreatePackageGroupRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String,
    contactInfo: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePackageGroupRequest",
}) as any as S.Schema<CreatePackageGroupRequest>;
export interface DeleteDomainRequest {
  domain: string;
  domainOwner?: string;
}
export const DeleteDomainRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/domain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainRequest",
}) as any as S.Schema<DeleteDomainRequest>;
export interface DeleteDomainPermissionsPolicyRequest {
  domain: string;
  domainOwner?: string;
  policyRevision?: string;
}
export const DeleteDomainPermissionsPolicyRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    policyRevision: S.optional(S.String).pipe(T.HttpQuery("policy-revision")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/domain/permissions/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainPermissionsPolicyRequest",
}) as any as S.Schema<DeleteDomainPermissionsPolicyRequest>;
export interface DeletePackageRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
}
export const DeletePackageRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/package" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePackageRequest",
}) as any as S.Schema<DeletePackageRequest>;
export interface DeletePackageGroupRequest {
  domain: string;
  domainOwner?: string;
  packageGroup: string;
}
export const DeletePackageGroupRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/package-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePackageGroupRequest",
}) as any as S.Schema<DeletePackageGroupRequest>;
export interface DeletePackageVersionsRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
  versions: PackageVersionList;
  expectedStatus?: string;
}
export const DeletePackageVersionsRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    versions: PackageVersionList,
    expectedStatus: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package/versions/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePackageVersionsRequest",
}) as any as S.Schema<DeletePackageVersionsRequest>;
export interface DeleteRepositoryRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
}
export const DeleteRepositoryRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/repository" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRepositoryRequest",
}) as any as S.Schema<DeleteRepositoryRequest>;
export interface DeleteRepositoryPermissionsPolicyRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  policyRevision?: string;
}
export const DeleteRepositoryPermissionsPolicyRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    policyRevision: S.optional(S.String).pipe(T.HttpQuery("policy-revision")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/repository/permissions/policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRepositoryPermissionsPolicyRequest",
}) as any as S.Schema<DeleteRepositoryPermissionsPolicyRequest>;
export interface DescribeDomainRequest {
  domain: string;
  domainOwner?: string;
}
export const DescribeDomainRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/domain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDomainRequest",
}) as any as S.Schema<DescribeDomainRequest>;
export interface DescribePackageRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
}
export const DescribePackageRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/package" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePackageRequest",
}) as any as S.Schema<DescribePackageRequest>;
export interface DescribePackageGroupRequest {
  domain: string;
  domainOwner?: string;
  packageGroup: string;
}
export const DescribePackageGroupRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/package-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePackageGroupRequest",
}) as any as S.Schema<DescribePackageGroupRequest>;
export interface DescribePackageVersionRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
  packageVersion: string;
}
export const DescribePackageVersionRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    packageVersion: S.String.pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/package/version" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePackageVersionRequest",
}) as any as S.Schema<DescribePackageVersionRequest>;
export interface DescribeRepositoryRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
}
export const DescribeRepositoryRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/repository" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRepositoryRequest",
}) as any as S.Schema<DescribeRepositoryRequest>;
export interface DisassociateExternalConnectionRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  externalConnection: string;
}
export const DisassociateExternalConnectionRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    externalConnection: S.String.pipe(T.HttpQuery("external-connection")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/repository/external-connection" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateExternalConnectionRequest",
}) as any as S.Schema<DisassociateExternalConnectionRequest>;
export type PackageVersionRevisionMap = { [key: string]: string };
export const PackageVersionRevisionMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface DisposePackageVersionsRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
  versions: PackageVersionList;
  versionRevisions?: PackageVersionRevisionMap;
  expectedStatus?: string;
}
export const DisposePackageVersionsRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    versions: PackageVersionList,
    versionRevisions: S.optional(PackageVersionRevisionMap),
    expectedStatus: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package/versions/dispose" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisposePackageVersionsRequest",
}) as any as S.Schema<DisposePackageVersionsRequest>;
export interface GetAssociatedPackageGroupRequest {
  domain: string;
  domainOwner?: string;
  format: string;
  namespace?: string;
  package: string;
}
export const GetAssociatedPackageGroupRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/get-associated-package-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssociatedPackageGroupRequest",
}) as any as S.Schema<GetAssociatedPackageGroupRequest>;
export interface GetAuthorizationTokenRequest {
  domain: string;
  domainOwner?: string;
  durationSeconds?: number;
}
export const GetAuthorizationTokenRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    durationSeconds: S.optional(S.Number).pipe(T.HttpQuery("duration")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/authorization-token" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAuthorizationTokenRequest",
}) as any as S.Schema<GetAuthorizationTokenRequest>;
export interface GetDomainPermissionsPolicyRequest {
  domain: string;
  domainOwner?: string;
}
export const GetDomainPermissionsPolicyRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/domain/permissions/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainPermissionsPolicyRequest",
}) as any as S.Schema<GetDomainPermissionsPolicyRequest>;
export interface GetPackageVersionAssetRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
  packageVersion: string;
  asset: string;
  packageVersionRevision?: string;
}
export const GetPackageVersionAssetRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    packageVersion: S.String.pipe(T.HttpQuery("version")),
    asset: S.String.pipe(T.HttpQuery("asset")),
    packageVersionRevision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/package/version/asset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPackageVersionAssetRequest",
}) as any as S.Schema<GetPackageVersionAssetRequest>;
export interface GetPackageVersionReadmeRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
  packageVersion: string;
}
export const GetPackageVersionReadmeRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    packageVersion: S.String.pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/package/version/readme" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPackageVersionReadmeRequest",
}) as any as S.Schema<GetPackageVersionReadmeRequest>;
export interface GetRepositoryEndpointRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  endpointType?: string;
}
export const GetRepositoryEndpointRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    endpointType: S.optional(S.String).pipe(T.HttpQuery("endpointType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/repository/endpoint" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRepositoryEndpointRequest",
}) as any as S.Schema<GetRepositoryEndpointRequest>;
export interface GetRepositoryPermissionsPolicyRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
}
export const GetRepositoryPermissionsPolicyRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/repository/permissions/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRepositoryPermissionsPolicyRequest",
}) as any as S.Schema<GetRepositoryPermissionsPolicyRequest>;
export interface ListAllowedRepositoriesForGroupRequest {
  domain: string;
  domainOwner?: string;
  packageGroup: string;
  originRestrictionType: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAllowedRepositoriesForGroupRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
    originRestrictionType: S.String.pipe(T.HttpQuery("originRestrictionType")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/package-group-allowed-repositories" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAllowedRepositoriesForGroupRequest",
}) as any as S.Schema<ListAllowedRepositoriesForGroupRequest>;
export interface ListAssociatedPackagesRequest {
  domain: string;
  domainOwner?: string;
  packageGroup: string;
  maxResults?: number;
  nextToken?: string;
  preview?: boolean;
}
export const ListAssociatedPackagesRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    preview: S.optional(S.Boolean).pipe(T.HttpQuery("preview")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/list-associated-packages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssociatedPackagesRequest",
}) as any as S.Schema<ListAssociatedPackagesRequest>;
export interface ListDomainsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListDomainsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/domains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainsRequest",
}) as any as S.Schema<ListDomainsRequest>;
export interface ListPackageGroupsRequest {
  domain: string;
  domainOwner?: string;
  maxResults?: number;
  nextToken?: string;
  prefix?: string;
}
export const ListPackageGroupsRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackageGroupsRequest",
}) as any as S.Schema<ListPackageGroupsRequest>;
export interface ListPackagesRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format?: string;
  namespace?: string;
  packagePrefix?: string;
  maxResults?: number;
  nextToken?: string;
  publish?: string;
  upstream?: string;
}
export const ListPackagesRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/packages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackagesRequest",
}) as any as S.Schema<ListPackagesRequest>;
export interface ListPackageVersionAssetsRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
  packageVersion: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListPackageVersionAssetsRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    packageVersion: S.String.pipe(T.HttpQuery("version")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package/version/assets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackageVersionAssetsRequest",
}) as any as S.Schema<ListPackageVersionAssetsRequest>;
export interface ListPackageVersionDependenciesRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
  packageVersion: string;
  nextToken?: string;
}
export const ListPackageVersionDependenciesRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    packageVersion: S.String.pipe(T.HttpQuery("version")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package/version/dependencies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackageVersionDependenciesRequest",
}) as any as S.Schema<ListPackageVersionDependenciesRequest>;
export interface ListPackageVersionsRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
  status?: string;
  sortBy?: string;
  maxResults?: number;
  nextToken?: string;
  originType?: string;
}
export const ListPackageVersionsRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackageVersionsRequest",
}) as any as S.Schema<ListPackageVersionsRequest>;
export interface ListRepositoriesRequest {
  repositoryPrefix?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListRepositoriesRequest = S.suspend(() =>
  S.Struct({
    repositoryPrefix: S.optional(S.String).pipe(
      T.HttpQuery("repository-prefix"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/repositories" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRepositoriesRequest",
}) as any as S.Schema<ListRepositoriesRequest>;
export interface ListRepositoriesInDomainRequest {
  domain: string;
  domainOwner?: string;
  administratorAccount?: string;
  repositoryPrefix?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListRepositoriesInDomainRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/domain/repositories" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRepositoriesInDomainRequest",
}) as any as S.Schema<ListRepositoriesInDomainRequest>;
export interface ListSubPackageGroupsRequest {
  domain: string;
  domainOwner?: string;
  packageGroup: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSubPackageGroupsRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package-groups/sub-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSubPackageGroupsRequest",
}) as any as S.Schema<ListSubPackageGroupsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/tags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface PublishPackageVersionRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
  packageVersion: string;
  assetContent: T.StreamingInputBody;
  assetName: string;
  assetSHA256: string;
  unfinished?: boolean;
}
export const PublishPackageVersionRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package/version/publish" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PublishPackageVersionRequest",
}) as any as S.Schema<PublishPackageVersionRequest>;
export interface PutDomainPermissionsPolicyRequest {
  domain: string;
  domainOwner?: string;
  policyRevision?: string;
  policyDocument: string;
}
export const PutDomainPermissionsPolicyRequest = S.suspend(() =>
  S.Struct({
    domain: S.String,
    domainOwner: S.optional(S.String),
    policyRevision: S.optional(S.String),
    policyDocument: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/domain/permissions/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDomainPermissionsPolicyRequest",
}) as any as S.Schema<PutDomainPermissionsPolicyRequest>;
export interface PutRepositoryPermissionsPolicyRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  policyRevision?: string;
  policyDocument: string;
}
export const PutRepositoryPermissionsPolicyRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    policyRevision: S.optional(S.String),
    policyDocument: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/repository/permissions/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRepositoryPermissionsPolicyRequest",
}) as any as S.Schema<PutRepositoryPermissionsPolicyRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tags: TagList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/tag" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResult {}
export const TagResourceResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResult",
}) as any as S.Schema<TagResourceResult>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tagKeys: TagKeyList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/untag" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResult {}
export const UntagResourceResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResult",
}) as any as S.Schema<UntagResourceResult>;
export interface UpdatePackageGroupRequest {
  domain: string;
  domainOwner?: string;
  packageGroup: string;
  contactInfo?: string;
  description?: string;
}
export const UpdatePackageGroupRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String,
    contactInfo: S.optional(S.String),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/package-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePackageGroupRequest",
}) as any as S.Schema<UpdatePackageGroupRequest>;
export interface UpdatePackageVersionsStatusRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
  versions: PackageVersionList;
  versionRevisions?: PackageVersionRevisionMap;
  expectedStatus?: string;
  targetStatus: string;
}
export const UpdatePackageVersionsStatusRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package/versions/update_status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePackageVersionsStatusRequest",
}) as any as S.Schema<UpdatePackageVersionsStatusRequest>;
export interface UpstreamRepository {
  repositoryName: string;
}
export const UpstreamRepository = S.suspend(() =>
  S.Struct({ repositoryName: S.String }),
).annotations({
  identifier: "UpstreamRepository",
}) as any as S.Schema<UpstreamRepository>;
export type UpstreamRepositoryList = UpstreamRepository[];
export const UpstreamRepositoryList = S.Array(UpstreamRepository);
export interface UpdateRepositoryRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  description?: string;
  upstreams?: UpstreamRepositoryList;
}
export const UpdateRepositoryRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    description: S.optional(S.String),
    upstreams: S.optional(UpstreamRepositoryList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/repository" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRepositoryRequest",
}) as any as S.Schema<UpdateRepositoryRequest>;
export type RepositoryNameList = string[];
export const RepositoryNameList = S.Array(S.String);
export interface PackageOriginRestrictions {
  publish: string;
  upstream: string;
}
export const PackageOriginRestrictions = S.suspend(() =>
  S.Struct({ publish: S.String, upstream: S.String }),
).annotations({
  identifier: "PackageOriginRestrictions",
}) as any as S.Schema<PackageOriginRestrictions>;
export interface PackageOriginConfiguration {
  restrictions?: PackageOriginRestrictions;
}
export const PackageOriginConfiguration = S.suspend(() =>
  S.Struct({ restrictions: S.optional(PackageOriginRestrictions) }),
).annotations({
  identifier: "PackageOriginConfiguration",
}) as any as S.Schema<PackageOriginConfiguration>;
export interface PackageSummary {
  format?: string;
  namespace?: string;
  package?: string;
  originConfiguration?: PackageOriginConfiguration;
}
export const PackageSummary = S.suspend(() =>
  S.Struct({
    format: S.optional(S.String),
    namespace: S.optional(S.String),
    package: S.optional(S.String),
    originConfiguration: S.optional(PackageOriginConfiguration),
  }),
).annotations({
  identifier: "PackageSummary",
}) as any as S.Schema<PackageSummary>;
export type PackageSummaryList = PackageSummary[];
export const PackageSummaryList = S.Array(PackageSummary);
export type OriginRestrictions = { [key: string]: string };
export const OriginRestrictions = S.Record({ key: S.String, value: S.String });
export interface PackageGroupAllowedRepository {
  repositoryName?: string;
  originRestrictionType?: string;
}
export const PackageGroupAllowedRepository = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    originRestrictionType: S.optional(S.String),
  }),
).annotations({
  identifier: "PackageGroupAllowedRepository",
}) as any as S.Schema<PackageGroupAllowedRepository>;
export type PackageGroupAllowedRepositoryList = PackageGroupAllowedRepository[];
export const PackageGroupAllowedRepositoryList = S.Array(
  PackageGroupAllowedRepository,
);
export interface CopyPackageVersionsRequest {
  domain: string;
  domainOwner?: string;
  sourceRepository: string;
  destinationRepository: string;
  format: string;
  namespace?: string;
  package: string;
  versions?: PackageVersionList;
  versionRevisions?: PackageVersionRevisionMap;
  allowOverwrite?: boolean;
  includeFromUpstream?: boolean;
}
export const CopyPackageVersionsRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package/versions/copy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CopyPackageVersionsRequest",
}) as any as S.Schema<CopyPackageVersionsRequest>;
export interface CreateDomainRequest {
  domain: string;
  encryptionKey?: string;
  tags?: TagList;
}
export const CreateDomainRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    encryptionKey: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/domain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainRequest",
}) as any as S.Schema<CreateDomainRequest>;
export interface CreateRepositoryRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  description?: string;
  upstreams?: UpstreamRepositoryList;
  tags?: TagList;
}
export const CreateRepositoryRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    description: S.optional(S.String),
    upstreams: S.optional(UpstreamRepositoryList),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/repository" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRepositoryRequest",
}) as any as S.Schema<CreateRepositoryRequest>;
export interface PackageGroupReference {
  arn?: string;
  pattern?: string;
}
export const PackageGroupReference = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String), pattern: S.optional(S.String) }),
).annotations({
  identifier: "PackageGroupReference",
}) as any as S.Schema<PackageGroupReference>;
export interface PackageGroupOriginRestriction {
  mode?: string;
  effectiveMode?: string;
  inheritedFrom?: PackageGroupReference;
  repositoriesCount?: number;
}
export const PackageGroupOriginRestriction = S.suspend(() =>
  S.Struct({
    mode: S.optional(S.String),
    effectiveMode: S.optional(S.String),
    inheritedFrom: S.optional(PackageGroupReference),
    repositoriesCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "PackageGroupOriginRestriction",
}) as any as S.Schema<PackageGroupOriginRestriction>;
export type PackageGroupOriginRestrictions = {
  [key: string]: PackageGroupOriginRestriction;
};
export const PackageGroupOriginRestrictions = S.Record({
  key: S.String,
  value: PackageGroupOriginRestriction,
});
export interface PackageGroupOriginConfiguration {
  restrictions?: PackageGroupOriginRestrictions;
}
export const PackageGroupOriginConfiguration = S.suspend(() =>
  S.Struct({ restrictions: S.optional(PackageGroupOriginRestrictions) }),
).annotations({
  identifier: "PackageGroupOriginConfiguration",
}) as any as S.Schema<PackageGroupOriginConfiguration>;
export interface PackageGroupDescription {
  arn?: string;
  pattern?: string;
  domainName?: string;
  domainOwner?: string;
  createdTime?: Date;
  contactInfo?: string;
  description?: string;
  originConfiguration?: PackageGroupOriginConfiguration;
  parent?: PackageGroupReference;
}
export const PackageGroupDescription = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    pattern: S.optional(S.String),
    domainName: S.optional(S.String),
    domainOwner: S.optional(S.String),
    createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    contactInfo: S.optional(S.String),
    description: S.optional(S.String),
    originConfiguration: S.optional(PackageGroupOriginConfiguration),
    parent: S.optional(PackageGroupReference),
  }),
).annotations({
  identifier: "PackageGroupDescription",
}) as any as S.Schema<PackageGroupDescription>;
export interface DeletePackageGroupResult {
  packageGroup?: PackageGroupDescription;
}
export const DeletePackageGroupResult = S.suspend(() =>
  S.Struct({ packageGroup: S.optional(PackageGroupDescription) }),
).annotations({
  identifier: "DeletePackageGroupResult",
}) as any as S.Schema<DeletePackageGroupResult>;
export interface UpstreamRepositoryInfo {
  repositoryName?: string;
}
export const UpstreamRepositoryInfo = S.suspend(() =>
  S.Struct({ repositoryName: S.optional(S.String) }),
).annotations({
  identifier: "UpstreamRepositoryInfo",
}) as any as S.Schema<UpstreamRepositoryInfo>;
export type UpstreamRepositoryInfoList = UpstreamRepositoryInfo[];
export const UpstreamRepositoryInfoList = S.Array(UpstreamRepositoryInfo);
export interface RepositoryExternalConnectionInfo {
  externalConnectionName?: string;
  packageFormat?: string;
  status?: string;
}
export const RepositoryExternalConnectionInfo = S.suspend(() =>
  S.Struct({
    externalConnectionName: S.optional(S.String),
    packageFormat: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "RepositoryExternalConnectionInfo",
}) as any as S.Schema<RepositoryExternalConnectionInfo>;
export type RepositoryExternalConnectionInfoList =
  RepositoryExternalConnectionInfo[];
export const RepositoryExternalConnectionInfoList = S.Array(
  RepositoryExternalConnectionInfo,
);
export interface RepositoryDescription {
  name?: string;
  administratorAccount?: string;
  domainName?: string;
  domainOwner?: string;
  arn?: string;
  description?: string;
  upstreams?: UpstreamRepositoryInfoList;
  externalConnections?: RepositoryExternalConnectionInfoList;
  createdTime?: Date;
}
export const RepositoryDescription = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    administratorAccount: S.optional(S.String),
    domainName: S.optional(S.String),
    domainOwner: S.optional(S.String),
    arn: S.optional(S.String),
    description: S.optional(S.String),
    upstreams: S.optional(UpstreamRepositoryInfoList),
    externalConnections: S.optional(RepositoryExternalConnectionInfoList),
    createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "RepositoryDescription",
}) as any as S.Schema<RepositoryDescription>;
export interface DeleteRepositoryResult {
  repository?: RepositoryDescription;
}
export const DeleteRepositoryResult = S.suspend(() =>
  S.Struct({ repository: S.optional(RepositoryDescription) }),
).annotations({
  identifier: "DeleteRepositoryResult",
}) as any as S.Schema<DeleteRepositoryResult>;
export interface ResourcePolicy {
  resourceArn?: string;
  revision?: string;
  document?: string;
}
export const ResourcePolicy = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    revision: S.optional(S.String),
    document: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourcePolicy",
}) as any as S.Schema<ResourcePolicy>;
export interface DeleteRepositoryPermissionsPolicyResult {
  policy?: ResourcePolicy;
}
export const DeleteRepositoryPermissionsPolicyResult = S.suspend(() =>
  S.Struct({ policy: S.optional(ResourcePolicy) }),
).annotations({
  identifier: "DeleteRepositoryPermissionsPolicyResult",
}) as any as S.Schema<DeleteRepositoryPermissionsPolicyResult>;
export interface DomainDescription {
  name?: string;
  owner?: string;
  arn?: string;
  status?: string;
  createdTime?: Date;
  encryptionKey?: string;
  repositoryCount?: number;
  assetSizeBytes?: number;
  s3BucketArn?: string;
}
export const DomainDescription = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    owner: S.optional(S.String),
    arn: S.optional(S.String),
    status: S.optional(S.String),
    createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    encryptionKey: S.optional(S.String),
    repositoryCount: S.optional(S.Number),
    assetSizeBytes: S.optional(S.Number),
    s3BucketArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DomainDescription",
}) as any as S.Schema<DomainDescription>;
export interface DescribeDomainResult {
  domain?: DomainDescription;
}
export const DescribeDomainResult = S.suspend(() =>
  S.Struct({ domain: S.optional(DomainDescription) }),
).annotations({
  identifier: "DescribeDomainResult",
}) as any as S.Schema<DescribeDomainResult>;
export interface DescribePackageGroupResult {
  packageGroup?: PackageGroupDescription;
}
export const DescribePackageGroupResult = S.suspend(() =>
  S.Struct({ packageGroup: S.optional(PackageGroupDescription) }),
).annotations({
  identifier: "DescribePackageGroupResult",
}) as any as S.Schema<DescribePackageGroupResult>;
export interface DescribeRepositoryResult {
  repository?: RepositoryDescription;
}
export const DescribeRepositoryResult = S.suspend(() =>
  S.Struct({ repository: S.optional(RepositoryDescription) }),
).annotations({
  identifier: "DescribeRepositoryResult",
}) as any as S.Schema<DescribeRepositoryResult>;
export interface DisassociateExternalConnectionResult {
  repository?: RepositoryDescription;
}
export const DisassociateExternalConnectionResult = S.suspend(() =>
  S.Struct({ repository: S.optional(RepositoryDescription) }),
).annotations({
  identifier: "DisassociateExternalConnectionResult",
}) as any as S.Schema<DisassociateExternalConnectionResult>;
export interface SuccessfulPackageVersionInfo {
  revision?: string;
  status?: string;
}
export const SuccessfulPackageVersionInfo = S.suspend(() =>
  S.Struct({ revision: S.optional(S.String), status: S.optional(S.String) }),
).annotations({
  identifier: "SuccessfulPackageVersionInfo",
}) as any as S.Schema<SuccessfulPackageVersionInfo>;
export type SuccessfulPackageVersionInfoMap = {
  [key: string]: SuccessfulPackageVersionInfo;
};
export const SuccessfulPackageVersionInfoMap = S.Record({
  key: S.String,
  value: SuccessfulPackageVersionInfo,
});
export interface PackageVersionError {
  errorCode?: string;
  errorMessage?: string;
}
export const PackageVersionError = S.suspend(() =>
  S.Struct({
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "PackageVersionError",
}) as any as S.Schema<PackageVersionError>;
export type PackageVersionErrorMap = { [key: string]: PackageVersionError };
export const PackageVersionErrorMap = S.Record({
  key: S.String,
  value: PackageVersionError,
});
export interface DisposePackageVersionsResult {
  successfulVersions?: SuccessfulPackageVersionInfoMap;
  failedVersions?: PackageVersionErrorMap;
}
export const DisposePackageVersionsResult = S.suspend(() =>
  S.Struct({
    successfulVersions: S.optional(SuccessfulPackageVersionInfoMap),
    failedVersions: S.optional(PackageVersionErrorMap),
  }),
).annotations({
  identifier: "DisposePackageVersionsResult",
}) as any as S.Schema<DisposePackageVersionsResult>;
export interface GetAssociatedPackageGroupResult {
  packageGroup?: PackageGroupDescription;
  associationType?: string;
}
export const GetAssociatedPackageGroupResult = S.suspend(() =>
  S.Struct({
    packageGroup: S.optional(PackageGroupDescription),
    associationType: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAssociatedPackageGroupResult",
}) as any as S.Schema<GetAssociatedPackageGroupResult>;
export interface GetAuthorizationTokenResult {
  authorizationToken?: string;
  expiration?: Date;
}
export const GetAuthorizationTokenResult = S.suspend(() =>
  S.Struct({
    authorizationToken: S.optional(S.String),
    expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetAuthorizationTokenResult",
}) as any as S.Schema<GetAuthorizationTokenResult>;
export interface GetDomainPermissionsPolicyResult {
  policy?: ResourcePolicy;
}
export const GetDomainPermissionsPolicyResult = S.suspend(() =>
  S.Struct({ policy: S.optional(ResourcePolicy) }),
).annotations({
  identifier: "GetDomainPermissionsPolicyResult",
}) as any as S.Schema<GetDomainPermissionsPolicyResult>;
export interface GetPackageVersionAssetResult {
  asset?: T.StreamingOutputBody;
  assetName?: string;
  packageVersion?: string;
  packageVersionRevision?: string;
}
export const GetPackageVersionAssetResult = S.suspend(() =>
  S.Struct({
    asset: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    assetName: S.optional(S.String).pipe(T.HttpHeader("X-AssetName")),
    packageVersion: S.optional(S.String).pipe(T.HttpHeader("X-PackageVersion")),
    packageVersionRevision: S.optional(S.String).pipe(
      T.HttpHeader("X-PackageVersionRevision"),
    ),
  }),
).annotations({
  identifier: "GetPackageVersionAssetResult",
}) as any as S.Schema<GetPackageVersionAssetResult>;
export interface GetPackageVersionReadmeResult {
  format?: string;
  namespace?: string;
  package?: string;
  version?: string;
  versionRevision?: string;
  readme?: string;
}
export const GetPackageVersionReadmeResult = S.suspend(() =>
  S.Struct({
    format: S.optional(S.String),
    namespace: S.optional(S.String),
    package: S.optional(S.String),
    version: S.optional(S.String),
    versionRevision: S.optional(S.String),
    readme: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPackageVersionReadmeResult",
}) as any as S.Schema<GetPackageVersionReadmeResult>;
export interface GetRepositoryEndpointResult {
  repositoryEndpoint?: string;
}
export const GetRepositoryEndpointResult = S.suspend(() =>
  S.Struct({ repositoryEndpoint: S.optional(S.String) }),
).annotations({
  identifier: "GetRepositoryEndpointResult",
}) as any as S.Schema<GetRepositoryEndpointResult>;
export interface GetRepositoryPermissionsPolicyResult {
  policy?: ResourcePolicy;
}
export const GetRepositoryPermissionsPolicyResult = S.suspend(() =>
  S.Struct({ policy: S.optional(ResourcePolicy) }),
).annotations({
  identifier: "GetRepositoryPermissionsPolicyResult",
}) as any as S.Schema<GetRepositoryPermissionsPolicyResult>;
export interface ListAllowedRepositoriesForGroupResult {
  allowedRepositories?: RepositoryNameList;
  nextToken?: string;
}
export const ListAllowedRepositoriesForGroupResult = S.suspend(() =>
  S.Struct({
    allowedRepositories: S.optional(RepositoryNameList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAllowedRepositoriesForGroupResult",
}) as any as S.Schema<ListAllowedRepositoriesForGroupResult>;
export interface ListPackagesResult {
  packages?: PackageSummaryList;
  nextToken?: string;
}
export const ListPackagesResult = S.suspend(() =>
  S.Struct({
    packages: S.optional(PackageSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPackagesResult",
}) as any as S.Schema<ListPackagesResult>;
export interface RepositorySummary {
  name?: string;
  administratorAccount?: string;
  domainName?: string;
  domainOwner?: string;
  arn?: string;
  description?: string;
  createdTime?: Date;
}
export const RepositorySummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    administratorAccount: S.optional(S.String),
    domainName: S.optional(S.String),
    domainOwner: S.optional(S.String),
    arn: S.optional(S.String),
    description: S.optional(S.String),
    createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "RepositorySummary",
}) as any as S.Schema<RepositorySummary>;
export type RepositorySummaryList = RepositorySummary[];
export const RepositorySummaryList = S.Array(RepositorySummary);
export interface ListRepositoriesInDomainResult {
  repositories?: RepositorySummaryList;
  nextToken?: string;
}
export const ListRepositoriesInDomainResult = S.suspend(() =>
  S.Struct({
    repositories: S.optional(RepositorySummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRepositoriesInDomainResult",
}) as any as S.Schema<ListRepositoriesInDomainResult>;
export interface PackageGroupSummary {
  arn?: string;
  pattern?: string;
  domainName?: string;
  domainOwner?: string;
  createdTime?: Date;
  contactInfo?: string;
  description?: string;
  originConfiguration?: PackageGroupOriginConfiguration;
  parent?: PackageGroupReference;
}
export const PackageGroupSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    pattern: S.optional(S.String),
    domainName: S.optional(S.String),
    domainOwner: S.optional(S.String),
    createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    contactInfo: S.optional(S.String),
    description: S.optional(S.String),
    originConfiguration: S.optional(PackageGroupOriginConfiguration),
    parent: S.optional(PackageGroupReference),
  }),
).annotations({
  identifier: "PackageGroupSummary",
}) as any as S.Schema<PackageGroupSummary>;
export type PackageGroupSummaryList = PackageGroupSummary[];
export const PackageGroupSummaryList = S.Array(PackageGroupSummary);
export interface ListSubPackageGroupsResult {
  packageGroups?: PackageGroupSummaryList;
  nextToken?: string;
}
export const ListSubPackageGroupsResult = S.suspend(() =>
  S.Struct({
    packageGroups: S.optional(PackageGroupSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSubPackageGroupsResult",
}) as any as S.Schema<ListSubPackageGroupsResult>;
export interface ListTagsForResourceResult {
  tags?: TagList;
}
export const ListTagsForResourceResult = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResult",
}) as any as S.Schema<ListTagsForResourceResult>;
export type AssetHashes = { [key: string]: string };
export const AssetHashes = S.Record({ key: S.String, value: S.String });
export interface AssetSummary {
  name: string;
  size?: number;
  hashes?: AssetHashes;
}
export const AssetSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    size: S.optional(S.Number),
    hashes: S.optional(AssetHashes),
  }),
).annotations({ identifier: "AssetSummary" }) as any as S.Schema<AssetSummary>;
export interface PublishPackageVersionResult {
  format?: string;
  namespace?: string;
  package?: string;
  version?: string;
  versionRevision?: string;
  status?: string;
  asset?: AssetSummary;
}
export const PublishPackageVersionResult = S.suspend(() =>
  S.Struct({
    format: S.optional(S.String),
    namespace: S.optional(S.String),
    package: S.optional(S.String),
    version: S.optional(S.String),
    versionRevision: S.optional(S.String),
    status: S.optional(S.String),
    asset: S.optional(AssetSummary),
  }),
).annotations({
  identifier: "PublishPackageVersionResult",
}) as any as S.Schema<PublishPackageVersionResult>;
export interface PutDomainPermissionsPolicyResult {
  policy?: ResourcePolicy;
}
export const PutDomainPermissionsPolicyResult = S.suspend(() =>
  S.Struct({ policy: S.optional(ResourcePolicy) }),
).annotations({
  identifier: "PutDomainPermissionsPolicyResult",
}) as any as S.Schema<PutDomainPermissionsPolicyResult>;
export interface PutPackageOriginConfigurationRequest {
  domain: string;
  domainOwner?: string;
  repository: string;
  format: string;
  namespace?: string;
  package: string;
  restrictions: PackageOriginRestrictions;
}
export const PutPackageOriginConfigurationRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    repository: S.String.pipe(T.HttpQuery("repository")),
    format: S.String.pipe(T.HttpQuery("format")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    package: S.String.pipe(T.HttpQuery("package")),
    restrictions: PackageOriginRestrictions,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/package" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutPackageOriginConfigurationRequest",
}) as any as S.Schema<PutPackageOriginConfigurationRequest>;
export interface PutRepositoryPermissionsPolicyResult {
  policy?: ResourcePolicy;
}
export const PutRepositoryPermissionsPolicyResult = S.suspend(() =>
  S.Struct({ policy: S.optional(ResourcePolicy) }),
).annotations({
  identifier: "PutRepositoryPermissionsPolicyResult",
}) as any as S.Schema<PutRepositoryPermissionsPolicyResult>;
export interface UpdatePackageGroupResult {
  packageGroup?: PackageGroupDescription;
}
export const UpdatePackageGroupResult = S.suspend(() =>
  S.Struct({ packageGroup: S.optional(PackageGroupDescription) }),
).annotations({
  identifier: "UpdatePackageGroupResult",
}) as any as S.Schema<UpdatePackageGroupResult>;
export interface UpdatePackageGroupOriginConfigurationRequest {
  domain: string;
  domainOwner?: string;
  packageGroup: string;
  restrictions?: OriginRestrictions;
  addAllowedRepositories?: PackageGroupAllowedRepositoryList;
  removeAllowedRepositories?: PackageGroupAllowedRepositoryList;
}
export const UpdatePackageGroupOriginConfigurationRequest = S.suspend(() =>
  S.Struct({
    domain: S.String.pipe(T.HttpQuery("domain")),
    domainOwner: S.optional(S.String).pipe(T.HttpQuery("domain-owner")),
    packageGroup: S.String.pipe(T.HttpQuery("package-group")),
    restrictions: S.optional(OriginRestrictions),
    addAllowedRepositories: S.optional(PackageGroupAllowedRepositoryList),
    removeAllowedRepositories: S.optional(PackageGroupAllowedRepositoryList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/package-group-origin-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePackageGroupOriginConfigurationRequest",
}) as any as S.Schema<UpdatePackageGroupOriginConfigurationRequest>;
export interface UpdatePackageVersionsStatusResult {
  successfulVersions?: SuccessfulPackageVersionInfoMap;
  failedVersions?: PackageVersionErrorMap;
}
export const UpdatePackageVersionsStatusResult = S.suspend(() =>
  S.Struct({
    successfulVersions: S.optional(SuccessfulPackageVersionInfoMap),
    failedVersions: S.optional(PackageVersionErrorMap),
  }),
).annotations({
  identifier: "UpdatePackageVersionsStatusResult",
}) as any as S.Schema<UpdatePackageVersionsStatusResult>;
export interface UpdateRepositoryResult {
  repository?: RepositoryDescription;
}
export const UpdateRepositoryResult = S.suspend(() =>
  S.Struct({ repository: S.optional(RepositoryDescription) }),
).annotations({
  identifier: "UpdateRepositoryResult",
}) as any as S.Schema<UpdateRepositoryResult>;
export interface PackageDescription {
  format?: string;
  namespace?: string;
  name?: string;
  originConfiguration?: PackageOriginConfiguration;
}
export const PackageDescription = S.suspend(() =>
  S.Struct({
    format: S.optional(S.String),
    namespace: S.optional(S.String),
    name: S.optional(S.String),
    originConfiguration: S.optional(PackageOriginConfiguration),
  }),
).annotations({
  identifier: "PackageDescription",
}) as any as S.Schema<PackageDescription>;
export interface AssociatedPackage {
  format?: string;
  namespace?: string;
  package?: string;
  associationType?: string;
}
export const AssociatedPackage = S.suspend(() =>
  S.Struct({
    format: S.optional(S.String),
    namespace: S.optional(S.String),
    package: S.optional(S.String),
    associationType: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociatedPackage",
}) as any as S.Schema<AssociatedPackage>;
export type AssociatedPackageList = AssociatedPackage[];
export const AssociatedPackageList = S.Array(AssociatedPackage);
export interface DomainSummary {
  name?: string;
  owner?: string;
  arn?: string;
  status?: string;
  createdTime?: Date;
  encryptionKey?: string;
}
export const DomainSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    owner: S.optional(S.String),
    arn: S.optional(S.String),
    status: S.optional(S.String),
    createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    encryptionKey: S.optional(S.String),
  }),
).annotations({
  identifier: "DomainSummary",
}) as any as S.Schema<DomainSummary>;
export type DomainSummaryList = DomainSummary[];
export const DomainSummaryList = S.Array(DomainSummary);
export interface PackageDependency {
  namespace?: string;
  package?: string;
  dependencyType?: string;
  versionRequirement?: string;
}
export const PackageDependency = S.suspend(() =>
  S.Struct({
    namespace: S.optional(S.String),
    package: S.optional(S.String),
    dependencyType: S.optional(S.String),
    versionRequirement: S.optional(S.String),
  }),
).annotations({
  identifier: "PackageDependency",
}) as any as S.Schema<PackageDependency>;
export type PackageDependencyList = PackageDependency[];
export const PackageDependencyList = S.Array(PackageDependency);
export interface DomainEntryPoint {
  repositoryName?: string;
  externalConnectionName?: string;
}
export const DomainEntryPoint = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    externalConnectionName: S.optional(S.String),
  }),
).annotations({
  identifier: "DomainEntryPoint",
}) as any as S.Schema<DomainEntryPoint>;
export interface PackageVersionOrigin {
  domainEntryPoint?: DomainEntryPoint;
  originType?: string;
}
export const PackageVersionOrigin = S.suspend(() =>
  S.Struct({
    domainEntryPoint: S.optional(DomainEntryPoint),
    originType: S.optional(S.String),
  }),
).annotations({
  identifier: "PackageVersionOrigin",
}) as any as S.Schema<PackageVersionOrigin>;
export interface PackageVersionSummary {
  version: string;
  revision?: string;
  status: string;
  origin?: PackageVersionOrigin;
}
export const PackageVersionSummary = S.suspend(() =>
  S.Struct({
    version: S.String,
    revision: S.optional(S.String),
    status: S.String,
    origin: S.optional(PackageVersionOrigin),
  }),
).annotations({
  identifier: "PackageVersionSummary",
}) as any as S.Schema<PackageVersionSummary>;
export type PackageVersionSummaryList = PackageVersionSummary[];
export const PackageVersionSummaryList = S.Array(PackageVersionSummary);
export interface CopyPackageVersionsResult {
  successfulVersions?: SuccessfulPackageVersionInfoMap;
  failedVersions?: PackageVersionErrorMap;
}
export const CopyPackageVersionsResult = S.suspend(() =>
  S.Struct({
    successfulVersions: S.optional(SuccessfulPackageVersionInfoMap),
    failedVersions: S.optional(PackageVersionErrorMap),
  }),
).annotations({
  identifier: "CopyPackageVersionsResult",
}) as any as S.Schema<CopyPackageVersionsResult>;
export interface CreateDomainResult {
  domain?: DomainDescription;
}
export const CreateDomainResult = S.suspend(() =>
  S.Struct({ domain: S.optional(DomainDescription) }),
).annotations({
  identifier: "CreateDomainResult",
}) as any as S.Schema<CreateDomainResult>;
export interface CreateRepositoryResult {
  repository?: RepositoryDescription;
}
export const CreateRepositoryResult = S.suspend(() =>
  S.Struct({ repository: S.optional(RepositoryDescription) }),
).annotations({
  identifier: "CreateRepositoryResult",
}) as any as S.Schema<CreateRepositoryResult>;
export interface DeleteDomainResult {
  domain?: DomainDescription;
}
export const DeleteDomainResult = S.suspend(() =>
  S.Struct({ domain: S.optional(DomainDescription) }),
).annotations({
  identifier: "DeleteDomainResult",
}) as any as S.Schema<DeleteDomainResult>;
export interface DeleteDomainPermissionsPolicyResult {
  policy?: ResourcePolicy;
}
export const DeleteDomainPermissionsPolicyResult = S.suspend(() =>
  S.Struct({ policy: S.optional(ResourcePolicy) }),
).annotations({
  identifier: "DeleteDomainPermissionsPolicyResult",
}) as any as S.Schema<DeleteDomainPermissionsPolicyResult>;
export interface DescribePackageResult {
  package: PackageDescription;
}
export const DescribePackageResult = S.suspend(() =>
  S.Struct({ package: PackageDescription }),
).annotations({
  identifier: "DescribePackageResult",
}) as any as S.Schema<DescribePackageResult>;
export interface ListAssociatedPackagesResult {
  packages?: AssociatedPackageList;
  nextToken?: string;
}
export const ListAssociatedPackagesResult = S.suspend(() =>
  S.Struct({
    packages: S.optional(AssociatedPackageList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssociatedPackagesResult",
}) as any as S.Schema<ListAssociatedPackagesResult>;
export interface ListDomainsResult {
  domains?: DomainSummaryList;
  nextToken?: string;
}
export const ListDomainsResult = S.suspend(() =>
  S.Struct({
    domains: S.optional(DomainSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDomainsResult",
}) as any as S.Schema<ListDomainsResult>;
export interface ListPackageGroupsResult {
  packageGroups?: PackageGroupSummaryList;
  nextToken?: string;
}
export const ListPackageGroupsResult = S.suspend(() =>
  S.Struct({
    packageGroups: S.optional(PackageGroupSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPackageGroupsResult",
}) as any as S.Schema<ListPackageGroupsResult>;
export interface ListPackageVersionDependenciesResult {
  format?: string;
  namespace?: string;
  package?: string;
  version?: string;
  versionRevision?: string;
  nextToken?: string;
  dependencies?: PackageDependencyList;
}
export const ListPackageVersionDependenciesResult = S.suspend(() =>
  S.Struct({
    format: S.optional(S.String),
    namespace: S.optional(S.String),
    package: S.optional(S.String),
    version: S.optional(S.String),
    versionRevision: S.optional(S.String),
    nextToken: S.optional(S.String),
    dependencies: S.optional(PackageDependencyList),
  }),
).annotations({
  identifier: "ListPackageVersionDependenciesResult",
}) as any as S.Schema<ListPackageVersionDependenciesResult>;
export interface ListPackageVersionsResult {
  defaultDisplayVersion?: string;
  format?: string;
  namespace?: string;
  package?: string;
  versions?: PackageVersionSummaryList;
  nextToken?: string;
}
export const ListPackageVersionsResult = S.suspend(() =>
  S.Struct({
    defaultDisplayVersion: S.optional(S.String),
    format: S.optional(S.String),
    namespace: S.optional(S.String),
    package: S.optional(S.String),
    versions: S.optional(PackageVersionSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPackageVersionsResult",
}) as any as S.Schema<ListPackageVersionsResult>;
export interface ListRepositoriesResult {
  repositories?: RepositorySummaryList;
  nextToken?: string;
}
export const ListRepositoriesResult = S.suspend(() =>
  S.Struct({
    repositories: S.optional(RepositorySummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRepositoriesResult",
}) as any as S.Schema<ListRepositoriesResult>;
export interface PutPackageOriginConfigurationResult {
  originConfiguration?: PackageOriginConfiguration;
}
export const PutPackageOriginConfigurationResult = S.suspend(() =>
  S.Struct({ originConfiguration: S.optional(PackageOriginConfiguration) }),
).annotations({
  identifier: "PutPackageOriginConfigurationResult",
}) as any as S.Schema<PutPackageOriginConfigurationResult>;
export interface LicenseInfo {
  name?: string;
  url?: string;
}
export const LicenseInfo = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), url: S.optional(S.String) }),
).annotations({ identifier: "LicenseInfo" }) as any as S.Schema<LicenseInfo>;
export type LicenseInfoList = LicenseInfo[];
export const LicenseInfoList = S.Array(LicenseInfo);
export type AssetSummaryList = AssetSummary[];
export const AssetSummaryList = S.Array(AssetSummary);
export interface AssociateExternalConnectionResult {
  repository?: RepositoryDescription;
}
export const AssociateExternalConnectionResult = S.suspend(() =>
  S.Struct({ repository: S.optional(RepositoryDescription) }),
).annotations({
  identifier: "AssociateExternalConnectionResult",
}) as any as S.Schema<AssociateExternalConnectionResult>;
export interface DeletePackageResult {
  deletedPackage?: PackageSummary;
}
export const DeletePackageResult = S.suspend(() =>
  S.Struct({ deletedPackage: S.optional(PackageSummary) }),
).annotations({
  identifier: "DeletePackageResult",
}) as any as S.Schema<DeletePackageResult>;
export interface DeletePackageVersionsResult {
  successfulVersions?: SuccessfulPackageVersionInfoMap;
  failedVersions?: PackageVersionErrorMap;
}
export const DeletePackageVersionsResult = S.suspend(() =>
  S.Struct({
    successfulVersions: S.optional(SuccessfulPackageVersionInfoMap),
    failedVersions: S.optional(PackageVersionErrorMap),
  }),
).annotations({
  identifier: "DeletePackageVersionsResult",
}) as any as S.Schema<DeletePackageVersionsResult>;
export interface ListPackageVersionAssetsResult {
  format?: string;
  namespace?: string;
  package?: string;
  version?: string;
  versionRevision?: string;
  nextToken?: string;
  assets?: AssetSummaryList;
}
export const ListPackageVersionAssetsResult = S.suspend(() =>
  S.Struct({
    format: S.optional(S.String),
    namespace: S.optional(S.String),
    package: S.optional(S.String),
    version: S.optional(S.String),
    versionRevision: S.optional(S.String),
    nextToken: S.optional(S.String),
    assets: S.optional(AssetSummaryList),
  }),
).annotations({
  identifier: "ListPackageVersionAssetsResult",
}) as any as S.Schema<ListPackageVersionAssetsResult>;
export type PackageGroupAllowedRepositoryUpdate = {
  [key: string]: RepositoryNameList;
};
export const PackageGroupAllowedRepositoryUpdate = S.Record({
  key: S.String,
  value: RepositoryNameList,
});
export interface PackageVersionDescription {
  format?: string;
  namespace?: string;
  packageName?: string;
  displayName?: string;
  version?: string;
  summary?: string;
  homePage?: string;
  sourceCodeRepository?: string;
  publishedTime?: Date;
  licenses?: LicenseInfoList;
  revision?: string;
  status?: string;
  origin?: PackageVersionOrigin;
}
export const PackageVersionDescription = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "PackageVersionDescription",
}) as any as S.Schema<PackageVersionDescription>;
export type PackageGroupAllowedRepositoryUpdates = {
  [key: string]: PackageGroupAllowedRepositoryUpdate;
};
export const PackageGroupAllowedRepositoryUpdates = S.Record({
  key: S.String,
  value: PackageGroupAllowedRepositoryUpdate,
});
export interface DescribePackageVersionResult {
  packageVersion: PackageVersionDescription;
}
export const DescribePackageVersionResult = S.suspend(() =>
  S.Struct({ packageVersion: PackageVersionDescription }),
).annotations({
  identifier: "DescribePackageVersionResult",
}) as any as S.Schema<DescribePackageVersionResult>;
export interface UpdatePackageGroupOriginConfigurationResult {
  packageGroup?: PackageGroupDescription;
  allowedRepositoryUpdates?: PackageGroupAllowedRepositoryUpdates;
}
export const UpdatePackageGroupOriginConfigurationResult = S.suspend(() =>
  S.Struct({
    packageGroup: S.optional(PackageGroupDescription),
    allowedRepositoryUpdates: S.optional(PackageGroupAllowedRepositoryUpdates),
  }),
).annotations({
  identifier: "UpdatePackageGroupOriginConfigurationResult",
}) as any as S.Schema<UpdatePackageGroupOriginConfigurationResult>;
export interface CreatePackageGroupResult {
  packageGroup?: PackageGroupDescription;
}
export const CreatePackageGroupResult = S.suspend(() =>
  S.Struct({ packageGroup: S.optional(PackageGroupDescription) }),
).annotations({
  identifier: "CreatePackageGroupResult",
}) as any as S.Schema<CreatePackageGroupResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String, reason: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

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
export const getAssociatedPackageGroup: (
  input: GetAssociatedPackageGroupRequest,
) => Effect.Effect<
  GetAssociatedPackageGroupResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssociatedPackageGroupRequest,
  output: GetAssociatedPackageGroupResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes tags from a resource in CodeArtifact.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResult,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResult,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeDomain: (
  input: DescribeDomainRequest,
) => Effect.Effect<
  DescribeDomainResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describePackageGroup: (
  input: DescribePackageGroupRequest,
) => Effect.Effect<
  DescribePackageGroupResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePackageGroupRequest,
  output: DescribePackageGroupResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a `RepositoryDescription` object that contains detailed information
 * about the requested repository.
 */
export const describeRepository: (
  input: DescribeRepositoryRequest,
) => Effect.Effect<
  DescribeRepositoryResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAuthorizationToken: (
  input: GetAuthorizationTokenRequest,
) => Effect.Effect<
  GetAuthorizationTokenResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAuthorizationTokenRequest,
  output: GetAuthorizationTokenResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the resource policy attached to the specified domain.
 *
 * The policy is a resource-based policy, not an identity-based policy. For more information, see
 * Identity-based policies
 * and resource-based policies in the *IAM User Guide*.
 */
export const getDomainPermissionsPolicy: (
  input: GetDomainPermissionsPolicyRequest,
) => Effect.Effect<
  GetDomainPermissionsPolicyResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainPermissionsPolicyRequest,
  output: GetDomainPermissionsPolicyResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the readme file or descriptive text for a package version.
 *
 * The returned text might contain formatting. For example, it might contain formatting for Markdown or reStructuredText.
 */
export const getPackageVersionReadme: (
  input: GetPackageVersionReadmeRequest,
) => Effect.Effect<
  GetPackageVersionReadmeResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPackageVersionReadmeRequest,
  output: GetPackageVersionReadmeResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
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
export const getRepositoryEndpoint: (
  input: GetRepositoryEndpointRequest,
) => Effect.Effect<
  GetRepositoryEndpointResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRepositoryEndpointRequest,
  output: GetRepositoryEndpointResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the resource policy that is set on a repository.
 */
export const getRepositoryPermissionsPolicy: (
  input: GetRepositoryPermissionsPolicyRequest,
) => Effect.Effect<
  GetRepositoryPermissionsPolicyResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPackages: {
  (
    input: ListPackagesRequest,
  ): Effect.Effect<
    ListPackagesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPackagesRequest,
  ) => Stream.Stream<
    ListPackagesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPackagesRequest,
  ) => Stream.Stream<
    PackageSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns a list of
 * RepositorySummary
 * objects. Each `RepositorySummary` contains information about a repository in the specified domain and that matches the input
 * parameters.
 */
export const listRepositoriesInDomain: {
  (
    input: ListRepositoriesInDomainRequest,
  ): Effect.Effect<
    ListRepositoriesInDomainResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRepositoriesInDomainRequest,
  ) => Stream.Stream<
    ListRepositoriesInDomainResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRepositoriesInDomainRequest,
  ) => Stream.Stream<
    RepositorySummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSubPackageGroups: {
  (
    input: ListSubPackageGroupsRequest,
  ): Effect.Effect<
    ListSubPackageGroupsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubPackageGroupsRequest,
  ) => Stream.Stream<
    ListSubPackageGroupsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSubPackageGroupsRequest,
  ) => Stream.Stream<
    PackageGroupSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describePackage: (
  input: DescribePackageRequest,
) => Effect.Effect<
  DescribePackageResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDomains: {
  (
    input: ListDomainsRequest,
  ): Effect.Effect<
    ListDomainsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainsRequest,
  ) => Stream.Stream<
    ListDomainsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainsRequest,
  ) => Stream.Stream<
    DomainSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns a list of package groups in the requested domain.
 */
export const listPackageGroups: {
  (
    input: ListPackageGroupsRequest,
  ): Effect.Effect<
    ListPackageGroupsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPackageGroupsRequest,
  ) => Stream.Stream<
    ListPackageGroupsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPackageGroupsRequest,
  ) => Stream.Stream<
    PackageGroupSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns the direct dependencies for a package version. The dependencies are returned as
 * PackageDependency
 * objects. CodeArtifact extracts the dependencies for a package version from the metadata file for the package
 * format (for example, the `package.json` file for npm packages and the `pom.xml` file
 * for Maven). Any package version dependencies that are not listed in the configuration file are not returned.
 */
export const listPackageVersionDependencies: (
  input: ListPackageVersionDependenciesRequest,
) => Effect.Effect<
  ListPackageVersionDependenciesResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPackageVersions: {
  (
    input: ListPackageVersionsRequest,
  ): Effect.Effect<
    ListPackageVersionsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPackageVersionsRequest,
  ) => Stream.Stream<
    ListPackageVersionsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPackageVersionsRequest,
  ) => Stream.Stream<
    PackageVersionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listRepositories: {
  (
    input: ListRepositoriesRequest,
  ): Effect.Effect<
    ListRepositoriesResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRepositoriesRequest,
  ) => Stream.Stream<
    ListRepositoriesResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRepositoriesRequest,
  ) => Stream.Stream<
    RepositorySummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
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
export const putPackageOriginConfiguration: (
  input: PutPackageOriginConfigurationRequest,
) => Effect.Effect<
  PutPackageOriginConfigurationResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRepository: (
  input: DeleteRepositoryRequest,
) => Effect.Effect<
  DeleteRepositoryResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRepositoryPermissionsPolicy: (
  input: DeleteRepositoryPermissionsPolicyRequest,
) => Effect.Effect<
  DeleteRepositoryPermissionsPolicyResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disposePackageVersions: (
  input: DisposePackageVersionsRequest,
) => Effect.Effect<
  DisposePackageVersionsResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns an asset (or file) that is in a package. For example, for a Maven package version, use
 * `GetPackageVersionAsset` to download a `JAR` file, a `POM` file,
 * or any other assets in the package version.
 */
export const getPackageVersionAsset: (
  input: GetPackageVersionAssetRequest,
) => Effect.Effect<
  GetPackageVersionAssetResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a domain. You cannot delete a domain that contains repositories. If you want to delete a domain
 * with repositories, first delete its repositories.
 */
export const deleteDomain: (
  input: DeleteDomainRequest,
) => Effect.Effect<
  DeleteDomainResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDomainPermissionsPolicy: (
  input: DeleteDomainPermissionsPolicyRequest,
) => Effect.Effect<
  DeleteDomainPermissionsPolicyResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePackage: (
  input: DeletePackageRequest,
) => Effect.Effect<
  DeletePackageResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePackageVersions: (
  input: DeletePackageVersionsRequest,
) => Effect.Effect<
  DeletePackageVersionsResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a list of
 * AssetSummary
 * objects for assets in a package version.
 */
export const listPackageVersionAssets: {
  (
    input: ListPackageVersionAssetsRequest,
  ): Effect.Effect<
    ListPackageVersionAssetsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPackageVersionAssetsRequest,
  ) => Stream.Stream<
    ListPackageVersionAssetsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPackageVersionAssetsRequest,
  ) => Stream.Stream<
    AssetSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResult,
  | AccessDeniedException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAssociatedPackages: {
  (
    input: ListAssociatedPackagesRequest,
  ): Effect.Effect<
    ListAssociatedPackagesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssociatedPackagesRequest,
  ) => Stream.Stream<
    ListAssociatedPackagesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssociatedPackagesRequest,
  ) => Stream.Stream<
    AssociatedPackage,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updatePackageVersionsStatus: (
  input: UpdatePackageVersionsStatusRequest,
) => Effect.Effect<
  UpdatePackageVersionsStatusResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates a package group. This API cannot be used to update a package group's origin configuration or pattern. To update a
 * package group's origin configuration, use UpdatePackageGroupOriginConfiguration.
 */
export const updatePackageGroup: (
  input: UpdatePackageGroupRequest,
) => Effect.Effect<
  UpdatePackageGroupResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAllowedRepositoriesForGroup: {
  (
    input: ListAllowedRepositoriesForGroupRequest,
  ): Effect.Effect<
    ListAllowedRepositoriesForGroupResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAllowedRepositoriesForGroupRequest,
  ) => Stream.Stream<
    ListAllowedRepositoriesForGroupResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAllowedRepositoriesForGroupRequest,
  ) => Stream.Stream<
    RepositoryName,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateRepository: (
  input: UpdateRepositoryRequest,
) => Effect.Effect<
  UpdateRepositoryResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePackageGroup: (
  input: DeletePackageGroupRequest,
) => Effect.Effect<
  DeletePackageGroupResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateExternalConnection: (
  input: DisassociateExternalConnectionRequest,
) => Effect.Effect<
  DisassociateExternalConnectionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const publishPackageVersion: (
  input: PublishPackageVersionRequest,
) => Effect.Effect<
  PublishPackageVersionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Sets a resource policy on a domain that specifies permissions to access it.
 *
 * When you call `PutDomainPermissionsPolicy`, the resource policy on the domain is ignored when evaluting permissions.
 * This ensures that the owner of a domain cannot lock themselves out of the domain, which would prevent them from being
 * able to update the resource policy.
 */
export const putDomainPermissionsPolicy: (
  input: PutDomainPermissionsPolicyRequest,
) => Effect.Effect<
  PutDomainPermissionsPolicyResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Sets the resource policy on a repository that specifies permissions to access it.
 *
 * When you call `PutRepositoryPermissionsPolicy`, the resource policy on the repository is ignored when evaluting permissions.
 * This ensures that the owner of a repository cannot lock themselves out of the repository, which would prevent them from being
 * able to update the resource policy.
 */
export const putRepositoryPermissionsPolicy: (
  input: PutRepositoryPermissionsPolicyRequest,
) => Effect.Effect<
  PutRepositoryPermissionsPolicyResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const copyPackageVersions: (
  input: CopyPackageVersionsRequest,
) => Effect.Effect<
  CopyPackageVersionsResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDomain: (
  input: CreateDomainRequest,
) => Effect.Effect<
  CreateDomainResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRepository: (
  input: CreateRepositoryRequest,
) => Effect.Effect<
  CreateRepositoryResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateExternalConnection: (
  input: AssociateExternalConnectionRequest,
) => Effect.Effect<
  AssociateExternalConnectionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a
 * PackageVersionDescription
 * object that contains information about the requested package version.
 */
export const describePackageVersion: (
  input: DescribePackageVersionRequest,
) => Effect.Effect<
  DescribePackageVersionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the package origin configuration for a package group.
 *
 * The package origin configuration determines how new versions of a package can be added to a repository. You can allow or block direct
 * publishing of new package versions, or ingestion and retaining of new package versions from an external connection or upstream source.
 * For more information about package group origin controls and configuration, see
 * Package group origin controls
 * in the *CodeArtifact User Guide*.
 */
export const updatePackageGroupOriginConfiguration: (
  input: UpdatePackageGroupOriginConfigurationRequest,
) => Effect.Effect<
  UpdatePackageGroupOriginConfigurationResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPackageGroup: (
  input: CreatePackageGroupRequest,
) => Effect.Effect<
  CreatePackageGroupResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

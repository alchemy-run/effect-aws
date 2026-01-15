import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://cloudfront.amazonaws.com/doc/2020-05-31/");
const svc = T.AwsApiService({
  sdkId: "CloudFront",
  serviceShapeName: "Cloudfront2020_05_31",
});
const auth = T.AwsAuthSigv4({ name: "cloudfront" });
const ver = T.ServiceVersion("2020-05-31");
const proto = T.AwsProtocolsRestXml();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "us-east-1" }],
  });
  const _p1 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "cn-northwest-1" }],
  });
  const _p2 = (_0: unknown) => ({
    authSchemes: [
      {
        name: "sigv4",
        signingRegion: `${_.getAttr(_0, "implicitGlobalRegion")}`,
      },
    ],
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e("https://cloudfront.global.api.aws", _p0(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e("https://cloudfront-fips.global.api.aws", _p0(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://cloudfront.cn-northwest-1.amazonaws.com.cn",
            _p1(),
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            "https://cloudfront-fips.cn-northwest-1.amazonaws.com.cn",
            _p1(),
            {},
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://cloudfront-fips.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p2(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://cloudfront-fips.${_.getAttr(PartitionResult, "dnsSuffix")}`,
              _p2(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://cloudfront.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p2(PartitionResult),
              {},
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cloudfront.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          _p2(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AnycastIpListName = string;
export type FunctionName = string;
export type FunctionBlob = Uint8Array | redacted.Redacted<Uint8Array>;
export type KeyValueStoreName = string;
export type KeyValueStoreComment = string;
export type ResourceId = string;
export type DistributionIdString = string;
export type AliasString = string;
export type ListConflictingAliasesMaxItemsInteger = number;
export type ResourceARN = string;
export type FunctionEventObject = Uint8Array | redacted.Redacted<Uint8Array>;
export type CommentType = string | redacted.Redacted<string>;
export type ParameterName = string;
export type ParameterValue = string;
export type TagKey = string;
export type TagValue = string;
export type ServerCertificateId = string;
export type SamplingRate = number;
export type SensitiveStringType = string | redacted.Redacted<string>;
export type KeyValueStoreARN = string;
export type OriginShieldRegion = string;
export type LambdaFunctionARN = string;
export type FunctionARN = string;

//# Schemas
export type IpAddressType = "ipv4" | "ipv6" | "dualstack" | (string & {});
export const IpAddressType = S.String;
export type FieldList = string[];
export const FieldList = S.Array(S.String.pipe(T.XmlName("Field")));
export type FunctionStage = "DEVELOPMENT" | "LIVE" | (string & {});
export const FunctionStage = S.String;
export type CachePolicyType = "managed" | "custom" | (string & {});
export const CachePolicyType = S.String;
export type ConnectionMode = "direct" | "tenant-only" | (string & {});
export const ConnectionMode = S.String;
export type OriginRequestPolicyType = "managed" | "custom" | (string & {});
export const OriginRequestPolicyType = S.String;
export type ResponseHeadersPolicyType = "managed" | "custom" | (string & {});
export const ResponseHeadersPolicyType = S.String;
export interface AssociateAliasRequest {
  TargetDistributionId: string;
  Alias: string;
}
export const AssociateAliasRequest = S.suspend(() =>
  S.Struct({
    TargetDistributionId: S.String.pipe(T.HttpLabel("TargetDistributionId")),
    Alias: S.String.pipe(T.HttpQuery("Alias")),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateAliasRequest",
}) as any as S.Schema<AssociateAliasRequest>;
export interface AssociateAliasResponse {}
export const AssociateAliasResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateAliasResponse",
}) as any as S.Schema<AssociateAliasResponse>;
export interface AssociateDistributionTenantWebACLRequest {
  Id: string;
  WebACLArn: string;
  IfMatch?: string;
}
export const AssociateDistributionTenantWebACLRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    WebACLArn: S.String,
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateDistributionTenantWebACLRequest",
}) as any as S.Schema<AssociateDistributionTenantWebACLRequest>;
export interface AssociateDistributionWebACLRequest {
  Id: string;
  WebACLArn: string;
  IfMatch?: string;
}
export const AssociateDistributionWebACLRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    WebACLArn: S.String,
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateDistributionWebACLRequest",
}) as any as S.Schema<AssociateDistributionWebACLRequest>;
export interface CopyDistributionRequest {
  PrimaryDistributionId: string;
  Staging?: boolean;
  IfMatch?: string;
  CallerReference: string;
  Enabled?: boolean;
}
export const CopyDistributionRequest = S.suspend(() =>
  S.Struct({
    PrimaryDistributionId: S.String.pipe(T.HttpLabel("PrimaryDistributionId")),
    Staging: S.optional(S.Boolean).pipe(T.HttpHeader("Staging")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    CallerReference: S.String,
    Enabled: S.optional(S.Boolean),
  }).pipe(
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
  ),
).annotations({
  identifier: "CopyDistributionRequest",
}) as any as S.Schema<CopyDistributionRequest>;
export interface Tag {
  Key: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(
  Tag.pipe(T.XmlName("Tag")).annotations({ identifier: "Tag" }),
);
export interface Tags {
  Items?: Tag[];
}
export const Tags = S.suspend(() =>
  S.Struct({ Items: S.optional(TagList) }),
).annotations({ identifier: "Tags" }) as any as S.Schema<Tags>;
export interface CreateConnectionGroupRequest {
  Name: string;
  Ipv6Enabled?: boolean;
  Tags?: Tags;
  AnycastIpListId?: string;
  Enabled?: boolean;
}
export const CreateConnectionGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Ipv6Enabled: S.optional(S.Boolean),
    Tags: S.optional(Tags),
    AnycastIpListId: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/connection-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectionGroupRequest",
}) as any as S.Schema<CreateConnectionGroupRequest>;
export type FunctionRuntime =
  | "cloudfront-js-1.0"
  | "cloudfront-js-2.0"
  | (string & {});
export const FunctionRuntime = S.String;
export interface KeyValueStoreAssociation {
  KeyValueStoreARN: string;
}
export const KeyValueStoreAssociation = S.suspend(() =>
  S.Struct({ KeyValueStoreARN: S.String }),
).annotations({
  identifier: "KeyValueStoreAssociation",
}) as any as S.Schema<KeyValueStoreAssociation>;
export type KeyValueStoreAssociationList = KeyValueStoreAssociation[];
export const KeyValueStoreAssociationList = S.Array(
  KeyValueStoreAssociation.pipe(
    T.XmlName("KeyValueStoreAssociation"),
  ).annotations({ identifier: "KeyValueStoreAssociation" }),
);
export interface KeyValueStoreAssociations {
  Quantity: number;
  Items?: KeyValueStoreAssociation[];
}
export const KeyValueStoreAssociations = S.suspend(() =>
  S.Struct({
    Quantity: S.Number,
    Items: S.optional(KeyValueStoreAssociationList),
  }),
).annotations({
  identifier: "KeyValueStoreAssociations",
}) as any as S.Schema<KeyValueStoreAssociations>;
export interface FunctionConfig {
  Comment: string;
  Runtime: FunctionRuntime;
  KeyValueStoreAssociations?: KeyValueStoreAssociations;
}
export const FunctionConfig = S.suspend(() =>
  S.Struct({
    Comment: S.String,
    Runtime: FunctionRuntime,
    KeyValueStoreAssociations: S.optional(KeyValueStoreAssociations),
  }),
).annotations({
  identifier: "FunctionConfig",
}) as any as S.Schema<FunctionConfig>;
export interface CreateFunctionRequest {
  Name: string;
  FunctionConfig: FunctionConfig;
  FunctionCode: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const CreateFunctionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    FunctionConfig: FunctionConfig,
    FunctionCode: SensitiveBlob,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/function" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFunctionRequest",
}) as any as S.Schema<CreateFunctionRequest>;
export type PathList = string[];
export const PathList = S.Array(S.String.pipe(T.XmlName("Path")));
export interface Paths {
  Quantity: number;
  Items?: string[];
}
export const Paths = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(PathList) }),
).annotations({ identifier: "Paths" }) as any as S.Schema<Paths>;
export interface InvalidationBatch {
  Paths: Paths;
  CallerReference: string;
}
export const InvalidationBatch = S.suspend(() =>
  S.Struct({ Paths: Paths, CallerReference: S.String }),
).annotations({
  identifier: "InvalidationBatch",
}) as any as S.Schema<InvalidationBatch>;
export interface CreateInvalidationForDistributionTenantRequest {
  Id: string;
  InvalidationBatch: InvalidationBatch;
}
export const CreateInvalidationForDistributionTenantRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    InvalidationBatch: InvalidationBatch.pipe(
      T.HttpPayload(),
      T.XmlName("InvalidationBatch"),
    ).annotations({ identifier: "InvalidationBatch" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateInvalidationForDistributionTenantRequest",
}) as any as S.Schema<CreateInvalidationForDistributionTenantRequest>;
export interface DeleteAnycastIpListRequest {
  Id: string;
  IfMatch: string;
}
export const DeleteAnycastIpListRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/anycast-ip-list/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAnycastIpListRequest",
}) as any as S.Schema<DeleteAnycastIpListRequest>;
export interface DeleteAnycastIpListResponse {}
export const DeleteAnycastIpListResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAnycastIpListResponse",
}) as any as S.Schema<DeleteAnycastIpListResponse>;
export interface DeleteCachePolicyRequest {
  Id: string;
  IfMatch?: string;
}
export const DeleteCachePolicyRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/cache-policy/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCachePolicyRequest",
}) as any as S.Schema<DeleteCachePolicyRequest>;
export interface DeleteCachePolicyResponse {}
export const DeleteCachePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCachePolicyResponse",
}) as any as S.Schema<DeleteCachePolicyResponse>;
export interface DeleteCloudFrontOriginAccessIdentityRequest {
  Id: string;
  IfMatch?: string;
}
export const DeleteCloudFrontOriginAccessIdentityRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteCloudFrontOriginAccessIdentityRequest",
}) as any as S.Schema<DeleteCloudFrontOriginAccessIdentityRequest>;
export interface DeleteCloudFrontOriginAccessIdentityResponse {}
export const DeleteCloudFrontOriginAccessIdentityResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCloudFrontOriginAccessIdentityResponse",
}) as any as S.Schema<DeleteCloudFrontOriginAccessIdentityResponse>;
export interface DeleteConnectionFunctionRequest {
  Id: string;
  IfMatch: string;
}
export const DeleteConnectionFunctionRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/connection-function/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectionFunctionRequest",
}) as any as S.Schema<DeleteConnectionFunctionRequest>;
export interface DeleteConnectionFunctionResponse {}
export const DeleteConnectionFunctionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConnectionFunctionResponse",
}) as any as S.Schema<DeleteConnectionFunctionResponse>;
export interface DeleteConnectionGroupRequest {
  Id: string;
  IfMatch: string;
}
export const DeleteConnectionGroupRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/connection-group/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectionGroupRequest",
}) as any as S.Schema<DeleteConnectionGroupRequest>;
export interface DeleteConnectionGroupResponse {}
export const DeleteConnectionGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConnectionGroupResponse",
}) as any as S.Schema<DeleteConnectionGroupResponse>;
export interface DeleteContinuousDeploymentPolicyRequest {
  Id: string;
  IfMatch?: string;
}
export const DeleteContinuousDeploymentPolicyRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteContinuousDeploymentPolicyRequest",
}) as any as S.Schema<DeleteContinuousDeploymentPolicyRequest>;
export interface DeleteContinuousDeploymentPolicyResponse {}
export const DeleteContinuousDeploymentPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteContinuousDeploymentPolicyResponse",
}) as any as S.Schema<DeleteContinuousDeploymentPolicyResponse>;
export interface DeleteDistributionRequest {
  Id: string;
  IfMatch?: string;
}
export const DeleteDistributionRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/distribution/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDistributionRequest",
}) as any as S.Schema<DeleteDistributionRequest>;
export interface DeleteDistributionResponse {}
export const DeleteDistributionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDistributionResponse",
}) as any as S.Schema<DeleteDistributionResponse>;
export interface DeleteDistributionTenantRequest {
  Id: string;
  IfMatch: string;
}
export const DeleteDistributionTenantRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/distribution-tenant/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDistributionTenantRequest",
}) as any as S.Schema<DeleteDistributionTenantRequest>;
export interface DeleteDistributionTenantResponse {}
export const DeleteDistributionTenantResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDistributionTenantResponse",
}) as any as S.Schema<DeleteDistributionTenantResponse>;
export interface DeleteFieldLevelEncryptionConfigRequest {
  Id: string;
  IfMatch?: string;
}
export const DeleteFieldLevelEncryptionConfigRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteFieldLevelEncryptionConfigRequest",
}) as any as S.Schema<DeleteFieldLevelEncryptionConfigRequest>;
export interface DeleteFieldLevelEncryptionConfigResponse {}
export const DeleteFieldLevelEncryptionConfigResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteFieldLevelEncryptionConfigResponse",
}) as any as S.Schema<DeleteFieldLevelEncryptionConfigResponse>;
export interface DeleteFieldLevelEncryptionProfileRequest {
  Id: string;
  IfMatch?: string;
}
export const DeleteFieldLevelEncryptionProfileRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteFieldLevelEncryptionProfileRequest",
}) as any as S.Schema<DeleteFieldLevelEncryptionProfileRequest>;
export interface DeleteFieldLevelEncryptionProfileResponse {}
export const DeleteFieldLevelEncryptionProfileResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteFieldLevelEncryptionProfileResponse",
}) as any as S.Schema<DeleteFieldLevelEncryptionProfileResponse>;
export interface DeleteFunctionRequest {
  Name: string;
  IfMatch: string;
}
export const DeleteFunctionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/function/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFunctionRequest",
}) as any as S.Schema<DeleteFunctionRequest>;
export interface DeleteFunctionResponse {}
export const DeleteFunctionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteFunctionResponse",
}) as any as S.Schema<DeleteFunctionResponse>;
export interface DeleteKeyGroupRequest {
  Id: string;
  IfMatch?: string;
}
export const DeleteKeyGroupRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/key-group/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKeyGroupRequest",
}) as any as S.Schema<DeleteKeyGroupRequest>;
export interface DeleteKeyGroupResponse {}
export const DeleteKeyGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteKeyGroupResponse",
}) as any as S.Schema<DeleteKeyGroupResponse>;
export interface DeleteKeyValueStoreRequest {
  Name: string;
  IfMatch: string;
}
export const DeleteKeyValueStoreRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/key-value-store/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKeyValueStoreRequest",
}) as any as S.Schema<DeleteKeyValueStoreRequest>;
export interface DeleteKeyValueStoreResponse {}
export const DeleteKeyValueStoreResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteKeyValueStoreResponse",
}) as any as S.Schema<DeleteKeyValueStoreResponse>;
export interface DeleteMonitoringSubscriptionRequest {
  DistributionId: string;
}
export const DeleteMonitoringSubscriptionRequest = S.suspend(() =>
  S.Struct({
    DistributionId: S.String.pipe(T.HttpLabel("DistributionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteMonitoringSubscriptionRequest",
}) as any as S.Schema<DeleteMonitoringSubscriptionRequest>;
export interface DeleteMonitoringSubscriptionResult {}
export const DeleteMonitoringSubscriptionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteMonitoringSubscriptionResult",
}) as any as S.Schema<DeleteMonitoringSubscriptionResult>;
export interface DeleteOriginAccessControlRequest {
  Id: string;
  IfMatch?: string;
}
export const DeleteOriginAccessControlRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2020-05-31/origin-access-control/{Id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOriginAccessControlRequest",
}) as any as S.Schema<DeleteOriginAccessControlRequest>;
export interface DeleteOriginAccessControlResponse {}
export const DeleteOriginAccessControlResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteOriginAccessControlResponse",
}) as any as S.Schema<DeleteOriginAccessControlResponse>;
export interface DeleteOriginRequestPolicyRequest {
  Id: string;
  IfMatch?: string;
}
export const DeleteOriginRequestPolicyRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2020-05-31/origin-request-policy/{Id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOriginRequestPolicyRequest",
}) as any as S.Schema<DeleteOriginRequestPolicyRequest>;
export interface DeleteOriginRequestPolicyResponse {}
export const DeleteOriginRequestPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteOriginRequestPolicyResponse",
}) as any as S.Schema<DeleteOriginRequestPolicyResponse>;
export interface DeletePublicKeyRequest {
  Id: string;
  IfMatch?: string;
}
export const DeletePublicKeyRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/public-key/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePublicKeyRequest",
}) as any as S.Schema<DeletePublicKeyRequest>;
export interface DeletePublicKeyResponse {}
export const DeletePublicKeyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePublicKeyResponse",
}) as any as S.Schema<DeletePublicKeyResponse>;
export interface DeleteRealtimeLogConfigRequest {
  Name?: string;
  ARN?: string;
}
export const DeleteRealtimeLogConfigRequest = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), ARN: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/delete-realtime-log-config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRealtimeLogConfigRequest",
}) as any as S.Schema<DeleteRealtimeLogConfigRequest>;
export interface DeleteRealtimeLogConfigResponse {}
export const DeleteRealtimeLogConfigResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRealtimeLogConfigResponse",
}) as any as S.Schema<DeleteRealtimeLogConfigResponse>;
export interface DeleteResourcePolicyRequest {
  ResourceArn: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/delete-resource-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteResponseHeadersPolicyRequest {
  Id: string;
  IfMatch?: string;
}
export const DeleteResponseHeadersPolicyRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteResponseHeadersPolicyRequest",
}) as any as S.Schema<DeleteResponseHeadersPolicyRequest>;
export interface DeleteResponseHeadersPolicyResponse {}
export const DeleteResponseHeadersPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResponseHeadersPolicyResponse",
}) as any as S.Schema<DeleteResponseHeadersPolicyResponse>;
export interface DeleteStreamingDistributionRequest {
  Id: string;
  IfMatch?: string;
}
export const DeleteStreamingDistributionRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteStreamingDistributionRequest",
}) as any as S.Schema<DeleteStreamingDistributionRequest>;
export interface DeleteStreamingDistributionResponse {}
export const DeleteStreamingDistributionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteStreamingDistributionResponse",
}) as any as S.Schema<DeleteStreamingDistributionResponse>;
export interface DeleteTrustStoreRequest {
  Id: string;
  IfMatch: string;
}
export const DeleteTrustStoreRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/trust-store/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTrustStoreRequest",
}) as any as S.Schema<DeleteTrustStoreRequest>;
export interface DeleteTrustStoreResponse {}
export const DeleteTrustStoreResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTrustStoreResponse",
}) as any as S.Schema<DeleteTrustStoreResponse>;
export interface DeleteVpcOriginRequest {
  Id: string;
  IfMatch: string;
}
export const DeleteVpcOriginRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2020-05-31/vpc-origin/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVpcOriginRequest",
}) as any as S.Schema<DeleteVpcOriginRequest>;
export interface DescribeConnectionFunctionRequest {
  Identifier: string;
  Stage?: FunctionStage;
}
export const DescribeConnectionFunctionRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Stage: S.optional(FunctionStage).pipe(T.HttpQuery("Stage")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeConnectionFunctionRequest",
}) as any as S.Schema<DescribeConnectionFunctionRequest>;
export interface DescribeFunctionRequest {
  Name: string;
  Stage?: FunctionStage;
}
export const DescribeFunctionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Stage: S.optional(FunctionStage).pipe(T.HttpQuery("Stage")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/function/{Name}/describe" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFunctionRequest",
}) as any as S.Schema<DescribeFunctionRequest>;
export interface DescribeKeyValueStoreRequest {
  Name: string;
}
export const DescribeKeyValueStoreRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/key-value-store/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeKeyValueStoreRequest",
}) as any as S.Schema<DescribeKeyValueStoreRequest>;
export interface DisassociateDistributionTenantWebACLRequest {
  Id: string;
  IfMatch?: string;
}
export const DisassociateDistributionTenantWebACLRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateDistributionTenantWebACLRequest",
}) as any as S.Schema<DisassociateDistributionTenantWebACLRequest>;
export interface DisassociateDistributionWebACLRequest {
  Id: string;
  IfMatch?: string;
}
export const DisassociateDistributionWebACLRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateDistributionWebACLRequest",
}) as any as S.Schema<DisassociateDistributionWebACLRequest>;
export interface GetAnycastIpListRequest {
  Id: string;
}
export const GetAnycastIpListRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/anycast-ip-list/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAnycastIpListRequest",
}) as any as S.Schema<GetAnycastIpListRequest>;
export interface GetCachePolicyRequest {
  Id: string;
}
export const GetCachePolicyRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/cache-policy/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCachePolicyRequest",
}) as any as S.Schema<GetCachePolicyRequest>;
export interface GetCachePolicyConfigRequest {
  Id: string;
}
export const GetCachePolicyConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/cache-policy/{Id}/config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCachePolicyConfigRequest",
}) as any as S.Schema<GetCachePolicyConfigRequest>;
export interface GetCloudFrontOriginAccessIdentityRequest {
  Id: string;
}
export const GetCloudFrontOriginAccessIdentityRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
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
  ),
).annotations({
  identifier: "GetCloudFrontOriginAccessIdentityRequest",
}) as any as S.Schema<GetCloudFrontOriginAccessIdentityRequest>;
export interface GetCloudFrontOriginAccessIdentityConfigRequest {
  Id: string;
}
export const GetCloudFrontOriginAccessIdentityConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
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
  ),
).annotations({
  identifier: "GetCloudFrontOriginAccessIdentityConfigRequest",
}) as any as S.Schema<GetCloudFrontOriginAccessIdentityConfigRequest>;
export interface GetConnectionFunctionRequest {
  Identifier: string;
  Stage?: FunctionStage;
}
export const GetConnectionFunctionRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Stage: S.optional(FunctionStage).pipe(T.HttpQuery("Stage")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetConnectionFunctionRequest",
}) as any as S.Schema<GetConnectionFunctionRequest>;
export interface GetConnectionGroupRequest {
  Identifier: string;
}
export const GetConnectionGroupRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2020-05-31/connection-group/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectionGroupRequest",
}) as any as S.Schema<GetConnectionGroupRequest>;
export interface GetConnectionGroupByRoutingEndpointRequest {
  RoutingEndpoint: string;
}
export const GetConnectionGroupByRoutingEndpointRequest = S.suspend(() =>
  S.Struct({
    RoutingEndpoint: S.String.pipe(T.HttpQuery("RoutingEndpoint")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/connection-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectionGroupByRoutingEndpointRequest",
}) as any as S.Schema<GetConnectionGroupByRoutingEndpointRequest>;
export interface GetContinuousDeploymentPolicyRequest {
  Id: string;
}
export const GetContinuousDeploymentPolicyRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
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
  ),
).annotations({
  identifier: "GetContinuousDeploymentPolicyRequest",
}) as any as S.Schema<GetContinuousDeploymentPolicyRequest>;
export interface GetContinuousDeploymentPolicyConfigRequest {
  Id: string;
}
export const GetContinuousDeploymentPolicyConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
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
  ),
).annotations({
  identifier: "GetContinuousDeploymentPolicyConfigRequest",
}) as any as S.Schema<GetContinuousDeploymentPolicyConfigRequest>;
export interface GetDistributionRequest {
  Id: string;
}
export const GetDistributionRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/distribution/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDistributionRequest",
}) as any as S.Schema<GetDistributionRequest>;
export interface GetDistributionConfigRequest {
  Id: string;
}
export const GetDistributionConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/distribution/{Id}/config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDistributionConfigRequest",
}) as any as S.Schema<GetDistributionConfigRequest>;
export interface GetDistributionTenantRequest {
  Identifier: string;
}
export const GetDistributionTenantRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
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
  ),
).annotations({
  identifier: "GetDistributionTenantRequest",
}) as any as S.Schema<GetDistributionTenantRequest>;
export interface GetDistributionTenantByDomainRequest {
  Domain: string;
}
export const GetDistributionTenantByDomainRequest = S.suspend(() =>
  S.Struct({ Domain: S.String.pipe(T.HttpQuery("domain")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/distribution-tenant" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDistributionTenantByDomainRequest",
}) as any as S.Schema<GetDistributionTenantByDomainRequest>;
export interface GetFieldLevelEncryptionRequest {
  Id: string;
}
export const GetFieldLevelEncryptionRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/field-level-encryption/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFieldLevelEncryptionRequest",
}) as any as S.Schema<GetFieldLevelEncryptionRequest>;
export interface GetFieldLevelEncryptionConfigRequest {
  Id: string;
}
export const GetFieldLevelEncryptionConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
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
  ),
).annotations({
  identifier: "GetFieldLevelEncryptionConfigRequest",
}) as any as S.Schema<GetFieldLevelEncryptionConfigRequest>;
export interface GetFieldLevelEncryptionProfileRequest {
  Id: string;
}
export const GetFieldLevelEncryptionProfileRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
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
  ),
).annotations({
  identifier: "GetFieldLevelEncryptionProfileRequest",
}) as any as S.Schema<GetFieldLevelEncryptionProfileRequest>;
export interface GetFieldLevelEncryptionProfileConfigRequest {
  Id: string;
}
export const GetFieldLevelEncryptionProfileConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
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
  ),
).annotations({
  identifier: "GetFieldLevelEncryptionProfileConfigRequest",
}) as any as S.Schema<GetFieldLevelEncryptionProfileConfigRequest>;
export interface GetFunctionRequest {
  Name: string;
  Stage?: FunctionStage;
}
export const GetFunctionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Stage: S.optional(FunctionStage).pipe(T.HttpQuery("Stage")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/function/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFunctionRequest",
}) as any as S.Schema<GetFunctionRequest>;
export interface GetInvalidationRequest {
  DistributionId: string;
  Id: string;
}
export const GetInvalidationRequest = S.suspend(() =>
  S.Struct({
    DistributionId: S.String.pipe(T.HttpLabel("DistributionId")),
    Id: S.String.pipe(T.HttpLabel("Id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetInvalidationRequest",
}) as any as S.Schema<GetInvalidationRequest>;
export interface GetInvalidationForDistributionTenantRequest {
  DistributionTenantId: string;
  Id: string;
}
export const GetInvalidationForDistributionTenantRequest = S.suspend(() =>
  S.Struct({
    DistributionTenantId: S.String.pipe(T.HttpLabel("DistributionTenantId")),
    Id: S.String.pipe(T.HttpLabel("Id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetInvalidationForDistributionTenantRequest",
}) as any as S.Schema<GetInvalidationForDistributionTenantRequest>;
export interface GetKeyGroupRequest {
  Id: string;
}
export const GetKeyGroupRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/key-group/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKeyGroupRequest",
}) as any as S.Schema<GetKeyGroupRequest>;
export interface GetKeyGroupConfigRequest {
  Id: string;
}
export const GetKeyGroupConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/key-group/{Id}/config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKeyGroupConfigRequest",
}) as any as S.Schema<GetKeyGroupConfigRequest>;
export interface GetManagedCertificateDetailsRequest {
  Identifier: string;
}
export const GetManagedCertificateDetailsRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
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
  ),
).annotations({
  identifier: "GetManagedCertificateDetailsRequest",
}) as any as S.Schema<GetManagedCertificateDetailsRequest>;
export interface GetMonitoringSubscriptionRequest {
  DistributionId: string;
}
export const GetMonitoringSubscriptionRequest = S.suspend(() =>
  S.Struct({
    DistributionId: S.String.pipe(T.HttpLabel("DistributionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetMonitoringSubscriptionRequest",
}) as any as S.Schema<GetMonitoringSubscriptionRequest>;
export interface GetOriginAccessControlRequest {
  Id: string;
}
export const GetOriginAccessControlRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/origin-access-control/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOriginAccessControlRequest",
}) as any as S.Schema<GetOriginAccessControlRequest>;
export interface GetOriginAccessControlConfigRequest {
  Id: string;
}
export const GetOriginAccessControlConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
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
  ),
).annotations({
  identifier: "GetOriginAccessControlConfigRequest",
}) as any as S.Schema<GetOriginAccessControlConfigRequest>;
export interface GetOriginRequestPolicyRequest {
  Id: string;
}
export const GetOriginRequestPolicyRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/origin-request-policy/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOriginRequestPolicyRequest",
}) as any as S.Schema<GetOriginRequestPolicyRequest>;
export interface GetOriginRequestPolicyConfigRequest {
  Id: string;
}
export const GetOriginRequestPolicyConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
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
  ),
).annotations({
  identifier: "GetOriginRequestPolicyConfigRequest",
}) as any as S.Schema<GetOriginRequestPolicyConfigRequest>;
export interface GetPublicKeyRequest {
  Id: string;
}
export const GetPublicKeyRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/public-key/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPublicKeyRequest",
}) as any as S.Schema<GetPublicKeyRequest>;
export interface GetPublicKeyConfigRequest {
  Id: string;
}
export const GetPublicKeyConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/public-key/{Id}/config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPublicKeyConfigRequest",
}) as any as S.Schema<GetPublicKeyConfigRequest>;
export interface GetRealtimeLogConfigRequest {
  Name?: string;
  ARN?: string;
}
export const GetRealtimeLogConfigRequest = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), ARN: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/get-realtime-log-config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRealtimeLogConfigRequest",
}) as any as S.Schema<GetRealtimeLogConfigRequest>;
export interface GetResourcePolicyRequest {
  ResourceArn: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/get-resource-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface GetResponseHeadersPolicyRequest {
  Id: string;
}
export const GetResponseHeadersPolicyRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2020-05-31/response-headers-policy/{Id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResponseHeadersPolicyRequest",
}) as any as S.Schema<GetResponseHeadersPolicyRequest>;
export interface GetResponseHeadersPolicyConfigRequest {
  Id: string;
}
export const GetResponseHeadersPolicyConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
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
  ),
).annotations({
  identifier: "GetResponseHeadersPolicyConfigRequest",
}) as any as S.Schema<GetResponseHeadersPolicyConfigRequest>;
export interface GetStreamingDistributionRequest {
  Id: string;
}
export const GetStreamingDistributionRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/streaming-distribution/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStreamingDistributionRequest",
}) as any as S.Schema<GetStreamingDistributionRequest>;
export interface GetStreamingDistributionConfigRequest {
  Id: string;
}
export const GetStreamingDistributionConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
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
  ),
).annotations({
  identifier: "GetStreamingDistributionConfigRequest",
}) as any as S.Schema<GetStreamingDistributionConfigRequest>;
export interface GetTrustStoreRequest {
  Identifier: string;
}
export const GetTrustStoreRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/trust-store/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrustStoreRequest",
}) as any as S.Schema<GetTrustStoreRequest>;
export interface GetVpcOriginRequest {
  Id: string;
}
export const GetVpcOriginRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/vpc-origin/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVpcOriginRequest",
}) as any as S.Schema<GetVpcOriginRequest>;
export interface ListAnycastIpListsRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListAnycastIpListsRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/anycast-ip-list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAnycastIpListsRequest",
}) as any as S.Schema<ListAnycastIpListsRequest>;
export interface ListCachePoliciesRequest {
  Type?: CachePolicyType;
  Marker?: string;
  MaxItems?: number;
}
export const ListCachePoliciesRequest = S.suspend(() =>
  S.Struct({
    Type: S.optional(CachePolicyType).pipe(T.HttpQuery("Type")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/cache-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCachePoliciesRequest",
}) as any as S.Schema<ListCachePoliciesRequest>;
export interface ListCloudFrontOriginAccessIdentitiesRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListCloudFrontOriginAccessIdentitiesRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListCloudFrontOriginAccessIdentitiesRequest",
}) as any as S.Schema<ListCloudFrontOriginAccessIdentitiesRequest>;
export interface ListConflictingAliasesRequest {
  DistributionId: string;
  Alias: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListConflictingAliasesRequest = S.suspend(() =>
  S.Struct({
    DistributionId: S.String.pipe(T.HttpQuery("DistributionId")),
    Alias: S.String.pipe(T.HttpQuery("Alias")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/conflicting-alias" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConflictingAliasesRequest",
}) as any as S.Schema<ListConflictingAliasesRequest>;
export interface ListConnectionFunctionsRequest {
  Marker?: string;
  MaxItems?: number;
  Stage?: FunctionStage;
}
export const ListConnectionFunctionsRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Stage: S.optional(FunctionStage),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/connection-functions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectionFunctionsRequest",
}) as any as S.Schema<ListConnectionFunctionsRequest>;
export interface ListContinuousDeploymentPoliciesRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListContinuousDeploymentPoliciesRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2020-05-31/continuous-deployment-policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListContinuousDeploymentPoliciesRequest",
}) as any as S.Schema<ListContinuousDeploymentPoliciesRequest>;
export interface ListDistributionsRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListDistributionsRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/distribution" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDistributionsRequest",
}) as any as S.Schema<ListDistributionsRequest>;
export interface ListDistributionsByAnycastIpListIdRequest {
  Marker?: string;
  MaxItems?: number;
  AnycastIpListId: string;
}
export const ListDistributionsByAnycastIpListIdRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    AnycastIpListId: S.String.pipe(T.HttpLabel("AnycastIpListId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionsByAnycastIpListIdRequest",
}) as any as S.Schema<ListDistributionsByAnycastIpListIdRequest>;
export interface ListDistributionsByCachePolicyIdRequest {
  Marker?: string;
  MaxItems?: number;
  CachePolicyId: string;
}
export const ListDistributionsByCachePolicyIdRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    CachePolicyId: S.String.pipe(T.HttpLabel("CachePolicyId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionsByCachePolicyIdRequest",
}) as any as S.Schema<ListDistributionsByCachePolicyIdRequest>;
export interface ListDistributionsByConnectionFunctionRequest {
  Marker?: string;
  MaxItems?: number;
  ConnectionFunctionIdentifier: string;
}
export const ListDistributionsByConnectionFunctionRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    ConnectionFunctionIdentifier: S.String.pipe(
      T.HttpQuery("ConnectionFunctionIdentifier"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionsByConnectionFunctionRequest",
}) as any as S.Schema<ListDistributionsByConnectionFunctionRequest>;
export interface ListDistributionsByConnectionModeRequest {
  Marker?: string;
  MaxItems?: number;
  ConnectionMode: ConnectionMode;
}
export const ListDistributionsByConnectionModeRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    ConnectionMode: ConnectionMode.pipe(T.HttpLabel("ConnectionMode")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionsByConnectionModeRequest",
}) as any as S.Schema<ListDistributionsByConnectionModeRequest>;
export interface ListDistributionsByKeyGroupRequest {
  Marker?: string;
  MaxItems?: number;
  KeyGroupId: string;
}
export const ListDistributionsByKeyGroupRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    KeyGroupId: S.String.pipe(T.HttpLabel("KeyGroupId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionsByKeyGroupRequest",
}) as any as S.Schema<ListDistributionsByKeyGroupRequest>;
export interface ListDistributionsByOriginRequestPolicyIdRequest {
  Marker?: string;
  MaxItems?: number;
  OriginRequestPolicyId: string;
}
export const ListDistributionsByOriginRequestPolicyIdRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    OriginRequestPolicyId: S.String.pipe(T.HttpLabel("OriginRequestPolicyId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionsByOriginRequestPolicyIdRequest",
}) as any as S.Schema<ListDistributionsByOriginRequestPolicyIdRequest>;
export interface ListDistributionsByOwnedResourceRequest {
  ResourceArn: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListDistributionsByOwnedResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionsByOwnedResourceRequest",
}) as any as S.Schema<ListDistributionsByOwnedResourceRequest>;
export interface ListDistributionsByRealtimeLogConfigRequest {
  Marker?: string;
  MaxItems?: number;
  RealtimeLogConfigName?: string;
  RealtimeLogConfigArn?: string;
}
export const ListDistributionsByRealtimeLogConfigRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    RealtimeLogConfigName: S.optional(S.String),
    RealtimeLogConfigArn: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionsByRealtimeLogConfigRequest",
}) as any as S.Schema<ListDistributionsByRealtimeLogConfigRequest>;
export interface ListDistributionsByResponseHeadersPolicyIdRequest {
  Marker?: string;
  MaxItems?: number;
  ResponseHeadersPolicyId: string;
}
export const ListDistributionsByResponseHeadersPolicyIdRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    ResponseHeadersPolicyId: S.String.pipe(
      T.HttpLabel("ResponseHeadersPolicyId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionsByResponseHeadersPolicyIdRequest",
}) as any as S.Schema<ListDistributionsByResponseHeadersPolicyIdRequest>;
export interface ListDistributionsByTrustStoreRequest {
  TrustStoreIdentifier: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListDistributionsByTrustStoreRequest = S.suspend(() =>
  S.Struct({
    TrustStoreIdentifier: S.String.pipe(T.HttpQuery("TrustStoreIdentifier")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/distributionsByTrustStore" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDistributionsByTrustStoreRequest",
}) as any as S.Schema<ListDistributionsByTrustStoreRequest>;
export interface ListDistributionsByVpcOriginIdRequest {
  Marker?: string;
  MaxItems?: number;
  VpcOriginId: string;
}
export const ListDistributionsByVpcOriginIdRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    VpcOriginId: S.String.pipe(T.HttpLabel("VpcOriginId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionsByVpcOriginIdRequest",
}) as any as S.Schema<ListDistributionsByVpcOriginIdRequest>;
export interface ListDistributionsByWebACLIdRequest {
  Marker?: string;
  MaxItems?: number;
  WebACLId: string;
}
export const ListDistributionsByWebACLIdRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    WebACLId: S.String.pipe(T.HttpLabel("WebACLId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionsByWebACLIdRequest",
}) as any as S.Schema<ListDistributionsByWebACLIdRequest>;
export interface ListDistributionTenantsByCustomizationRequest {
  WebACLArn?: string;
  CertificateArn?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListDistributionTenantsByCustomizationRequest = S.suspend(() =>
  S.Struct({
    WebACLArn: S.optional(S.String),
    CertificateArn: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDistributionTenantsByCustomizationRequest",
}) as any as S.Schema<ListDistributionTenantsByCustomizationRequest>;
export interface ListFieldLevelEncryptionConfigsRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListFieldLevelEncryptionConfigsRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/field-level-encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFieldLevelEncryptionConfigsRequest",
}) as any as S.Schema<ListFieldLevelEncryptionConfigsRequest>;
export interface ListFieldLevelEncryptionProfilesRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListFieldLevelEncryptionProfilesRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListFieldLevelEncryptionProfilesRequest",
}) as any as S.Schema<ListFieldLevelEncryptionProfilesRequest>;
export interface ListFunctionsRequest {
  Marker?: string;
  MaxItems?: number;
  Stage?: FunctionStage;
}
export const ListFunctionsRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Stage: S.optional(FunctionStage).pipe(T.HttpQuery("Stage")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/function" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFunctionsRequest",
}) as any as S.Schema<ListFunctionsRequest>;
export interface ListInvalidationsRequest {
  DistributionId: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListInvalidationsRequest = S.suspend(() =>
  S.Struct({
    DistributionId: S.String.pipe(T.HttpLabel("DistributionId")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListInvalidationsRequest",
}) as any as S.Schema<ListInvalidationsRequest>;
export interface ListInvalidationsForDistributionTenantRequest {
  Id: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListInvalidationsForDistributionTenantRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListInvalidationsForDistributionTenantRequest",
}) as any as S.Schema<ListInvalidationsForDistributionTenantRequest>;
export interface ListKeyGroupsRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListKeyGroupsRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/key-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKeyGroupsRequest",
}) as any as S.Schema<ListKeyGroupsRequest>;
export interface ListKeyValueStoresRequest {
  Marker?: string;
  MaxItems?: number;
  Status?: string;
}
export const ListKeyValueStoresRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Status: S.optional(S.String).pipe(T.HttpQuery("Status")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/key-value-store" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKeyValueStoresRequest",
}) as any as S.Schema<ListKeyValueStoresRequest>;
export interface ListOriginAccessControlsRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListOriginAccessControlsRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/origin-access-control" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOriginAccessControlsRequest",
}) as any as S.Schema<ListOriginAccessControlsRequest>;
export interface ListOriginRequestPoliciesRequest {
  Type?: OriginRequestPolicyType;
  Marker?: string;
  MaxItems?: number;
}
export const ListOriginRequestPoliciesRequest = S.suspend(() =>
  S.Struct({
    Type: S.optional(OriginRequestPolicyType).pipe(T.HttpQuery("Type")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/origin-request-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOriginRequestPoliciesRequest",
}) as any as S.Schema<ListOriginRequestPoliciesRequest>;
export interface ListPublicKeysRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListPublicKeysRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/public-key" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPublicKeysRequest",
}) as any as S.Schema<ListPublicKeysRequest>;
export interface ListRealtimeLogConfigsRequest {
  MaxItems?: number;
  Marker?: string;
}
export const ListRealtimeLogConfigsRequest = S.suspend(() =>
  S.Struct({
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/realtime-log-config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRealtimeLogConfigsRequest",
}) as any as S.Schema<ListRealtimeLogConfigsRequest>;
export interface ListResponseHeadersPoliciesRequest {
  Type?: ResponseHeadersPolicyType;
  Marker?: string;
  MaxItems?: number;
}
export const ListResponseHeadersPoliciesRequest = S.suspend(() =>
  S.Struct({
    Type: S.optional(ResponseHeadersPolicyType).pipe(T.HttpQuery("Type")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/response-headers-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResponseHeadersPoliciesRequest",
}) as any as S.Schema<ListResponseHeadersPoliciesRequest>;
export interface ListStreamingDistributionsRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListStreamingDistributionsRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/streaming-distribution" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStreamingDistributionsRequest",
}) as any as S.Schema<ListStreamingDistributionsRequest>;
export interface ListTagsForResourceRequest {
  Resource: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ Resource: S.String.pipe(T.HttpQuery("Resource")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/tagging" }),
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
export interface ListTrustStoresRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListTrustStoresRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/trust-stores" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrustStoresRequest",
}) as any as S.Schema<ListTrustStoresRequest>;
export interface ListVpcOriginsRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListVpcOriginsRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2020-05-31/vpc-origin" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVpcOriginsRequest",
}) as any as S.Schema<ListVpcOriginsRequest>;
export interface PublishConnectionFunctionRequest {
  Id: string;
  IfMatch: string;
}
export const PublishConnectionFunctionRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "PublishConnectionFunctionRequest",
}) as any as S.Schema<PublishConnectionFunctionRequest>;
export interface PublishFunctionRequest {
  Name: string;
  IfMatch: string;
}
export const PublishFunctionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/function/{Name}/publish" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PublishFunctionRequest",
}) as any as S.Schema<PublishFunctionRequest>;
export interface PutResourcePolicyRequest {
  ResourceArn: string;
  PolicyDocument: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, PolicyDocument: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/put-resource-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface TagResourceRequest {
  Resource: string;
  Tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    Resource: S.String.pipe(T.HttpQuery("Resource")),
    Tags: Tags.pipe(T.HttpPayload(), T.XmlName("Tags")).annotations({
      identifier: "Tags",
    }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/tagging?Operation=Tag" }),
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
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface TestConnectionFunctionRequest {
  Id: string;
  IfMatch: string;
  Stage?: FunctionStage;
  ConnectionObject: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const TestConnectionFunctionRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    Stage: S.optional(FunctionStage),
    ConnectionObject: SensitiveBlob,
  }).pipe(
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
  ),
).annotations({
  identifier: "TestConnectionFunctionRequest",
}) as any as S.Schema<TestConnectionFunctionRequest>;
export interface TestFunctionRequest {
  Name: string;
  IfMatch: string;
  Stage?: FunctionStage;
  EventObject: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const TestFunctionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    Stage: S.optional(FunctionStage),
    EventObject: SensitiveBlob,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/function/{Name}/test" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestFunctionRequest",
}) as any as S.Schema<TestFunctionRequest>;
export interface UpdateAnycastIpListRequest {
  Id: string;
  IpAddressType?: IpAddressType;
  IfMatch: string;
}
export const UpdateAnycastIpListRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IpAddressType: S.optional(IpAddressType),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/anycast-ip-list/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAnycastIpListRequest",
}) as any as S.Schema<UpdateAnycastIpListRequest>;
export type CachePolicyHeaderBehavior = "none" | "whitelist" | (string & {});
export const CachePolicyHeaderBehavior = S.String;
export type HeaderList = string[];
export const HeaderList = S.Array(S.String.pipe(T.XmlName("Name")));
export interface Headers {
  Quantity: number;
  Items?: string[];
}
export const Headers = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(HeaderList) }),
).annotations({ identifier: "Headers" }) as any as S.Schema<Headers>;
export interface CachePolicyHeadersConfig {
  HeaderBehavior: CachePolicyHeaderBehavior;
  Headers?: Headers;
}
export const CachePolicyHeadersConfig = S.suspend(() =>
  S.Struct({
    HeaderBehavior: CachePolicyHeaderBehavior,
    Headers: S.optional(Headers),
  }),
).annotations({
  identifier: "CachePolicyHeadersConfig",
}) as any as S.Schema<CachePolicyHeadersConfig>;
export type CachePolicyCookieBehavior =
  | "none"
  | "whitelist"
  | "allExcept"
  | "all"
  | (string & {});
export const CachePolicyCookieBehavior = S.String;
export type CookieNameList = string[];
export const CookieNameList = S.Array(S.String.pipe(T.XmlName("Name")));
export interface CookieNames {
  Quantity: number;
  Items?: string[];
}
export const CookieNames = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(CookieNameList) }),
).annotations({ identifier: "CookieNames" }) as any as S.Schema<CookieNames>;
export interface CachePolicyCookiesConfig {
  CookieBehavior: CachePolicyCookieBehavior;
  Cookies?: CookieNames;
}
export const CachePolicyCookiesConfig = S.suspend(() =>
  S.Struct({
    CookieBehavior: CachePolicyCookieBehavior,
    Cookies: S.optional(CookieNames),
  }),
).annotations({
  identifier: "CachePolicyCookiesConfig",
}) as any as S.Schema<CachePolicyCookiesConfig>;
export type CachePolicyQueryStringBehavior =
  | "none"
  | "whitelist"
  | "allExcept"
  | "all"
  | (string & {});
export const CachePolicyQueryStringBehavior = S.String;
export type QueryStringNamesList = string[];
export const QueryStringNamesList = S.Array(S.String.pipe(T.XmlName("Name")));
export interface QueryStringNames {
  Quantity: number;
  Items?: string[];
}
export const QueryStringNames = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(QueryStringNamesList) }),
).annotations({
  identifier: "QueryStringNames",
}) as any as S.Schema<QueryStringNames>;
export interface CachePolicyQueryStringsConfig {
  QueryStringBehavior: CachePolicyQueryStringBehavior;
  QueryStrings?: QueryStringNames;
}
export const CachePolicyQueryStringsConfig = S.suspend(() =>
  S.Struct({
    QueryStringBehavior: CachePolicyQueryStringBehavior,
    QueryStrings: S.optional(QueryStringNames),
  }),
).annotations({
  identifier: "CachePolicyQueryStringsConfig",
}) as any as S.Schema<CachePolicyQueryStringsConfig>;
export interface ParametersInCacheKeyAndForwardedToOrigin {
  EnableAcceptEncodingGzip: boolean;
  EnableAcceptEncodingBrotli?: boolean;
  HeadersConfig: CachePolicyHeadersConfig;
  CookiesConfig: CachePolicyCookiesConfig;
  QueryStringsConfig: CachePolicyQueryStringsConfig;
}
export const ParametersInCacheKeyAndForwardedToOrigin = S.suspend(() =>
  S.Struct({
    EnableAcceptEncodingGzip: S.Boolean,
    EnableAcceptEncodingBrotli: S.optional(S.Boolean),
    HeadersConfig: CachePolicyHeadersConfig,
    CookiesConfig: CachePolicyCookiesConfig,
    QueryStringsConfig: CachePolicyQueryStringsConfig,
  }),
).annotations({
  identifier: "ParametersInCacheKeyAndForwardedToOrigin",
}) as any as S.Schema<ParametersInCacheKeyAndForwardedToOrigin>;
export interface CachePolicyConfig {
  Comment?: string;
  Name: string;
  DefaultTTL?: number;
  MaxTTL?: number;
  MinTTL: number;
  ParametersInCacheKeyAndForwardedToOrigin?: ParametersInCacheKeyAndForwardedToOrigin;
}
export const CachePolicyConfig = S.suspend(() =>
  S.Struct({
    Comment: S.optional(S.String),
    Name: S.String,
    DefaultTTL: S.optional(S.Number),
    MaxTTL: S.optional(S.Number),
    MinTTL: S.Number,
    ParametersInCacheKeyAndForwardedToOrigin: S.optional(
      ParametersInCacheKeyAndForwardedToOrigin,
    ),
  }),
).annotations({
  identifier: "CachePolicyConfig",
}) as any as S.Schema<CachePolicyConfig>;
export interface UpdateCachePolicyRequest {
  CachePolicyConfig: CachePolicyConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdateCachePolicyRequest = S.suspend(() =>
  S.Struct({
    CachePolicyConfig: CachePolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("CachePolicyConfig"),
    ).annotations({ identifier: "CachePolicyConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/cache-policy/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCachePolicyRequest",
}) as any as S.Schema<UpdateCachePolicyRequest>;
export interface CloudFrontOriginAccessIdentityConfig {
  CallerReference: string;
  Comment: string;
}
export const CloudFrontOriginAccessIdentityConfig = S.suspend(() =>
  S.Struct({ CallerReference: S.String, Comment: S.String }),
).annotations({
  identifier: "CloudFrontOriginAccessIdentityConfig",
}) as any as S.Schema<CloudFrontOriginAccessIdentityConfig>;
export interface UpdateCloudFrontOriginAccessIdentityRequest {
  CloudFrontOriginAccessIdentityConfig: CloudFrontOriginAccessIdentityConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdateCloudFrontOriginAccessIdentityRequest = S.suspend(() =>
  S.Struct({
    CloudFrontOriginAccessIdentityConfig:
      CloudFrontOriginAccessIdentityConfig.pipe(
        T.HttpPayload(),
        T.XmlName("CloudFrontOriginAccessIdentityConfig"),
      ).annotations({ identifier: "CloudFrontOriginAccessIdentityConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateCloudFrontOriginAccessIdentityRequest",
}) as any as S.Schema<UpdateCloudFrontOriginAccessIdentityRequest>;
export interface UpdateConnectionFunctionRequest {
  Id: string;
  IfMatch: string;
  ConnectionFunctionConfig: FunctionConfig;
  ConnectionFunctionCode: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const UpdateConnectionFunctionRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    ConnectionFunctionConfig: FunctionConfig,
    ConnectionFunctionCode: SensitiveBlob,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/connection-function/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConnectionFunctionRequest",
}) as any as S.Schema<UpdateConnectionFunctionRequest>;
export interface UpdateConnectionGroupRequest {
  Id: string;
  Ipv6Enabled?: boolean;
  IfMatch: string;
  AnycastIpListId?: string;
  Enabled?: boolean;
}
export const UpdateConnectionGroupRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Ipv6Enabled: S.optional(S.Boolean),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    AnycastIpListId: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/connection-group/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConnectionGroupRequest",
}) as any as S.Schema<UpdateConnectionGroupRequest>;
export type StagingDistributionDnsNameList = string[];
export const StagingDistributionDnsNameList = S.Array(
  S.String.pipe(T.XmlName("DnsName")),
);
export interface StagingDistributionDnsNames {
  Quantity: number;
  Items?: string[];
}
export const StagingDistributionDnsNames = S.suspend(() =>
  S.Struct({
    Quantity: S.Number,
    Items: S.optional(StagingDistributionDnsNameList),
  }),
).annotations({
  identifier: "StagingDistributionDnsNames",
}) as any as S.Schema<StagingDistributionDnsNames>;
export interface SessionStickinessConfig {
  IdleTTL: number;
  MaximumTTL: number;
}
export const SessionStickinessConfig = S.suspend(() =>
  S.Struct({ IdleTTL: S.Number, MaximumTTL: S.Number }),
).annotations({
  identifier: "SessionStickinessConfig",
}) as any as S.Schema<SessionStickinessConfig>;
export interface ContinuousDeploymentSingleWeightConfig {
  Weight: number;
  SessionStickinessConfig?: SessionStickinessConfig;
}
export const ContinuousDeploymentSingleWeightConfig = S.suspend(() =>
  S.Struct({
    Weight: S.Number,
    SessionStickinessConfig: S.optional(SessionStickinessConfig),
  }),
).annotations({
  identifier: "ContinuousDeploymentSingleWeightConfig",
}) as any as S.Schema<ContinuousDeploymentSingleWeightConfig>;
export interface ContinuousDeploymentSingleHeaderConfig {
  Header: string;
  Value: string;
}
export const ContinuousDeploymentSingleHeaderConfig = S.suspend(() =>
  S.Struct({ Header: S.String, Value: S.String }),
).annotations({
  identifier: "ContinuousDeploymentSingleHeaderConfig",
}) as any as S.Schema<ContinuousDeploymentSingleHeaderConfig>;
export type ContinuousDeploymentPolicyType =
  | "SingleWeight"
  | "SingleHeader"
  | (string & {});
export const ContinuousDeploymentPolicyType = S.String;
export interface TrafficConfig {
  SingleWeightConfig?: ContinuousDeploymentSingleWeightConfig;
  SingleHeaderConfig?: ContinuousDeploymentSingleHeaderConfig;
  Type: ContinuousDeploymentPolicyType;
}
export const TrafficConfig = S.suspend(() =>
  S.Struct({
    SingleWeightConfig: S.optional(ContinuousDeploymentSingleWeightConfig),
    SingleHeaderConfig: S.optional(ContinuousDeploymentSingleHeaderConfig),
    Type: ContinuousDeploymentPolicyType,
  }),
).annotations({
  identifier: "TrafficConfig",
}) as any as S.Schema<TrafficConfig>;
export interface ContinuousDeploymentPolicyConfig {
  StagingDistributionDnsNames: StagingDistributionDnsNames;
  Enabled: boolean;
  TrafficConfig?: TrafficConfig;
}
export const ContinuousDeploymentPolicyConfig = S.suspend(() =>
  S.Struct({
    StagingDistributionDnsNames: StagingDistributionDnsNames,
    Enabled: S.Boolean,
    TrafficConfig: S.optional(TrafficConfig),
  }),
).annotations({
  identifier: "ContinuousDeploymentPolicyConfig",
}) as any as S.Schema<ContinuousDeploymentPolicyConfig>;
export interface UpdateContinuousDeploymentPolicyRequest {
  ContinuousDeploymentPolicyConfig: ContinuousDeploymentPolicyConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdateContinuousDeploymentPolicyRequest = S.suspend(() =>
  S.Struct({
    ContinuousDeploymentPolicyConfig: ContinuousDeploymentPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("ContinuousDeploymentPolicyConfig"),
    ).annotations({ identifier: "ContinuousDeploymentPolicyConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateContinuousDeploymentPolicyRequest",
}) as any as S.Schema<UpdateContinuousDeploymentPolicyRequest>;
export type AliasList = string[];
export const AliasList = S.Array(S.String.pipe(T.XmlName("CNAME")));
export interface Aliases {
  Quantity: number;
  Items?: string[];
}
export const Aliases = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(AliasList) }),
).annotations({ identifier: "Aliases" }) as any as S.Schema<Aliases>;
export interface OriginCustomHeader {
  HeaderName: string;
  HeaderValue: string | redacted.Redacted<string>;
}
export const OriginCustomHeader = S.suspend(() =>
  S.Struct({ HeaderName: S.String, HeaderValue: SensitiveString }),
).annotations({
  identifier: "OriginCustomHeader",
}) as any as S.Schema<OriginCustomHeader>;
export type OriginCustomHeadersList = OriginCustomHeader[];
export const OriginCustomHeadersList = S.Array(
  OriginCustomHeader.pipe(T.XmlName("OriginCustomHeader")).annotations({
    identifier: "OriginCustomHeader",
  }),
);
export interface CustomHeaders {
  Quantity: number;
  Items?: OriginCustomHeader[];
}
export const CustomHeaders = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(OriginCustomHeadersList) }),
).annotations({
  identifier: "CustomHeaders",
}) as any as S.Schema<CustomHeaders>;
export interface S3OriginConfig {
  OriginAccessIdentity?: string;
  OriginReadTimeout?: number;
}
export const S3OriginConfig = S.suspend(() =>
  S.Struct({
    OriginAccessIdentity: S.optional(S.String),
    OriginReadTimeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "S3OriginConfig",
}) as any as S.Schema<S3OriginConfig>;
export type OriginProtocolPolicy =
  | "http-only"
  | "match-viewer"
  | "https-only"
  | (string & {});
export const OriginProtocolPolicy = S.String;
export type SslProtocol =
  | "SSLv3"
  | "TLSv1"
  | "TLSv1.1"
  | "TLSv1.2"
  | (string & {});
export const SslProtocol = S.String;
export type SslProtocolsList = SslProtocol[];
export const SslProtocolsList = S.Array(
  SslProtocol.pipe(T.XmlName("SslProtocol")),
);
export interface OriginSslProtocols {
  Quantity: number;
  Items: SslProtocol[];
}
export const OriginSslProtocols = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: SslProtocolsList }),
).annotations({
  identifier: "OriginSslProtocols",
}) as any as S.Schema<OriginSslProtocols>;
export interface CustomOriginConfig {
  HTTPPort: number;
  HTTPSPort: number;
  OriginProtocolPolicy: OriginProtocolPolicy;
  OriginSslProtocols?: OriginSslProtocols;
  OriginReadTimeout?: number;
  OriginKeepaliveTimeout?: number;
  IpAddressType?: IpAddressType;
}
export const CustomOriginConfig = S.suspend(() =>
  S.Struct({
    HTTPPort: S.Number,
    HTTPSPort: S.Number,
    OriginProtocolPolicy: OriginProtocolPolicy,
    OriginSslProtocols: S.optional(OriginSslProtocols),
    OriginReadTimeout: S.optional(S.Number),
    OriginKeepaliveTimeout: S.optional(S.Number),
    IpAddressType: S.optional(IpAddressType),
  }),
).annotations({
  identifier: "CustomOriginConfig",
}) as any as S.Schema<CustomOriginConfig>;
export interface VpcOriginConfig {
  VpcOriginId: string;
  OwnerAccountId?: string;
  OriginReadTimeout?: number;
  OriginKeepaliveTimeout?: number;
}
export const VpcOriginConfig = S.suspend(() =>
  S.Struct({
    VpcOriginId: S.String,
    OwnerAccountId: S.optional(S.String),
    OriginReadTimeout: S.optional(S.Number),
    OriginKeepaliveTimeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "VpcOriginConfig",
}) as any as S.Schema<VpcOriginConfig>;
export interface OriginShield {
  Enabled: boolean;
  OriginShieldRegion?: string;
}
export const OriginShield = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean, OriginShieldRegion: S.optional(S.String) }),
).annotations({ identifier: "OriginShield" }) as any as S.Schema<OriginShield>;
export interface Origin {
  Id: string;
  DomainName: string;
  OriginPath?: string;
  CustomHeaders?: CustomHeaders;
  S3OriginConfig?: S3OriginConfig;
  CustomOriginConfig?: CustomOriginConfig;
  VpcOriginConfig?: VpcOriginConfig;
  ConnectionAttempts?: number;
  ConnectionTimeout?: number;
  ResponseCompletionTimeout?: number;
  OriginShield?: OriginShield;
  OriginAccessControlId?: string;
}
export const Origin = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Origin" }) as any as S.Schema<Origin>;
export type OriginList = Origin[];
export const OriginList = S.Array(
  Origin.pipe(T.XmlName("Origin")).annotations({ identifier: "Origin" }),
);
export interface Origins {
  Quantity: number;
  Items: Origin[];
}
export const Origins = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: OriginList }),
).annotations({ identifier: "Origins" }) as any as S.Schema<Origins>;
export type StatusCodeList = number[];
export const StatusCodeList = S.Array(S.Number.pipe(T.XmlName("StatusCode")));
export interface StatusCodes {
  Quantity: number;
  Items: number[];
}
export const StatusCodes = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: StatusCodeList }),
).annotations({ identifier: "StatusCodes" }) as any as S.Schema<StatusCodes>;
export interface OriginGroupFailoverCriteria {
  StatusCodes: StatusCodes;
}
export const OriginGroupFailoverCriteria = S.suspend(() =>
  S.Struct({ StatusCodes: StatusCodes }),
).annotations({
  identifier: "OriginGroupFailoverCriteria",
}) as any as S.Schema<OriginGroupFailoverCriteria>;
export interface OriginGroupMember {
  OriginId: string;
}
export const OriginGroupMember = S.suspend(() =>
  S.Struct({ OriginId: S.String }),
).annotations({
  identifier: "OriginGroupMember",
}) as any as S.Schema<OriginGroupMember>;
export type OriginGroupMemberList = OriginGroupMember[];
export const OriginGroupMemberList = S.Array(
  OriginGroupMember.pipe(T.XmlName("OriginGroupMember")).annotations({
    identifier: "OriginGroupMember",
  }),
);
export interface OriginGroupMembers {
  Quantity: number;
  Items: OriginGroupMember[];
}
export const OriginGroupMembers = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: OriginGroupMemberList }),
).annotations({
  identifier: "OriginGroupMembers",
}) as any as S.Schema<OriginGroupMembers>;
export type OriginGroupSelectionCriteria =
  | "default"
  | "media-quality-based"
  | (string & {});
export const OriginGroupSelectionCriteria = S.String;
export interface OriginGroup {
  Id: string;
  FailoverCriteria: OriginGroupFailoverCriteria;
  Members: OriginGroupMembers;
  SelectionCriteria?: OriginGroupSelectionCriteria;
}
export const OriginGroup = S.suspend(() =>
  S.Struct({
    Id: S.String,
    FailoverCriteria: OriginGroupFailoverCriteria,
    Members: OriginGroupMembers,
    SelectionCriteria: S.optional(OriginGroupSelectionCriteria),
  }),
).annotations({ identifier: "OriginGroup" }) as any as S.Schema<OriginGroup>;
export type OriginGroupList = OriginGroup[];
export const OriginGroupList = S.Array(
  OriginGroup.pipe(T.XmlName("OriginGroup")).annotations({
    identifier: "OriginGroup",
  }),
);
export interface OriginGroups {
  Quantity: number;
  Items?: OriginGroup[];
}
export const OriginGroups = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(OriginGroupList) }),
).annotations({ identifier: "OriginGroups" }) as any as S.Schema<OriginGroups>;
export type AwsAccountNumberList = string[];
export const AwsAccountNumberList = S.Array(
  S.String.pipe(T.XmlName("AwsAccountNumber")),
);
export interface TrustedSigners {
  Enabled: boolean;
  Quantity: number;
  Items?: string[];
}
export const TrustedSigners = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(AwsAccountNumberList),
  }),
).annotations({
  identifier: "TrustedSigners",
}) as any as S.Schema<TrustedSigners>;
export type TrustedKeyGroupIdList = string[];
export const TrustedKeyGroupIdList = S.Array(
  S.String.pipe(T.XmlName("KeyGroup")),
);
export interface TrustedKeyGroups {
  Enabled: boolean;
  Quantity: number;
  Items?: string[];
}
export const TrustedKeyGroups = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(TrustedKeyGroupIdList),
  }),
).annotations({
  identifier: "TrustedKeyGroups",
}) as any as S.Schema<TrustedKeyGroups>;
export type ViewerProtocolPolicy =
  | "allow-all"
  | "https-only"
  | "redirect-to-https"
  | (string & {});
export const ViewerProtocolPolicy = S.String;
export type Method =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "PATCH"
  | "OPTIONS"
  | "DELETE"
  | (string & {});
export const Method = S.String;
export type MethodsList = Method[];
export const MethodsList = S.Array(Method.pipe(T.XmlName("Method")));
export interface CachedMethods {
  Quantity: number;
  Items: Method[];
}
export const CachedMethods = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: MethodsList }),
).annotations({
  identifier: "CachedMethods",
}) as any as S.Schema<CachedMethods>;
export interface AllowedMethods {
  Quantity: number;
  Items: Method[];
  CachedMethods?: CachedMethods;
}
export const AllowedMethods = S.suspend(() =>
  S.Struct({
    Quantity: S.Number,
    Items: MethodsList,
    CachedMethods: S.optional(CachedMethods),
  }),
).annotations({
  identifier: "AllowedMethods",
}) as any as S.Schema<AllowedMethods>;
export type EventType =
  | "viewer-request"
  | "viewer-response"
  | "origin-request"
  | "origin-response"
  | (string & {});
export const EventType = S.String;
export interface LambdaFunctionAssociation {
  LambdaFunctionARN: string;
  EventType: EventType;
  IncludeBody?: boolean;
}
export const LambdaFunctionAssociation = S.suspend(() =>
  S.Struct({
    LambdaFunctionARN: S.String,
    EventType: EventType,
    IncludeBody: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LambdaFunctionAssociation",
}) as any as S.Schema<LambdaFunctionAssociation>;
export type LambdaFunctionAssociationList = LambdaFunctionAssociation[];
export const LambdaFunctionAssociationList = S.Array(
  LambdaFunctionAssociation.pipe(
    T.XmlName("LambdaFunctionAssociation"),
  ).annotations({ identifier: "LambdaFunctionAssociation" }),
);
export interface LambdaFunctionAssociations {
  Quantity: number;
  Items?: LambdaFunctionAssociation[];
}
export const LambdaFunctionAssociations = S.suspend(() =>
  S.Struct({
    Quantity: S.Number,
    Items: S.optional(LambdaFunctionAssociationList),
  }),
).annotations({
  identifier: "LambdaFunctionAssociations",
}) as any as S.Schema<LambdaFunctionAssociations>;
export interface FunctionAssociation {
  FunctionARN: string;
  EventType: EventType;
}
export const FunctionAssociation = S.suspend(() =>
  S.Struct({ FunctionARN: S.String, EventType: EventType }),
).annotations({
  identifier: "FunctionAssociation",
}) as any as S.Schema<FunctionAssociation>;
export type FunctionAssociationList = FunctionAssociation[];
export const FunctionAssociationList = S.Array(
  FunctionAssociation.pipe(T.XmlName("FunctionAssociation")).annotations({
    identifier: "FunctionAssociation",
  }),
);
export interface FunctionAssociations {
  Quantity: number;
  Items?: FunctionAssociation[];
}
export const FunctionAssociations = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(FunctionAssociationList) }),
).annotations({
  identifier: "FunctionAssociations",
}) as any as S.Schema<FunctionAssociations>;
export interface GrpcConfig {
  Enabled: boolean;
}
export const GrpcConfig = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean }),
).annotations({ identifier: "GrpcConfig" }) as any as S.Schema<GrpcConfig>;
export type ItemSelection = "none" | "whitelist" | "all" | (string & {});
export const ItemSelection = S.String;
export interface CookiePreference {
  Forward: ItemSelection;
  WhitelistedNames?: CookieNames;
}
export const CookiePreference = S.suspend(() =>
  S.Struct({
    Forward: ItemSelection,
    WhitelistedNames: S.optional(CookieNames),
  }),
).annotations({
  identifier: "CookiePreference",
}) as any as S.Schema<CookiePreference>;
export type QueryStringCacheKeysList = string[];
export const QueryStringCacheKeysList = S.Array(
  S.String.pipe(T.XmlName("Name")),
);
export interface QueryStringCacheKeys {
  Quantity: number;
  Items?: string[];
}
export const QueryStringCacheKeys = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(QueryStringCacheKeysList) }),
).annotations({
  identifier: "QueryStringCacheKeys",
}) as any as S.Schema<QueryStringCacheKeys>;
export interface ForwardedValues {
  QueryString: boolean;
  Cookies: CookiePreference;
  Headers?: Headers;
  QueryStringCacheKeys?: QueryStringCacheKeys;
}
export const ForwardedValues = S.suspend(() =>
  S.Struct({
    QueryString: S.Boolean,
    Cookies: CookiePreference,
    Headers: S.optional(Headers),
    QueryStringCacheKeys: S.optional(QueryStringCacheKeys),
  }),
).annotations({
  identifier: "ForwardedValues",
}) as any as S.Schema<ForwardedValues>;
export interface DefaultCacheBehavior {
  TargetOriginId: string;
  TrustedSigners?: TrustedSigners;
  TrustedKeyGroups?: TrustedKeyGroups;
  ViewerProtocolPolicy: ViewerProtocolPolicy;
  AllowedMethods?: AllowedMethods;
  SmoothStreaming?: boolean;
  Compress?: boolean;
  LambdaFunctionAssociations?: LambdaFunctionAssociations;
  FunctionAssociations?: FunctionAssociations;
  FieldLevelEncryptionId?: string;
  RealtimeLogConfigArn?: string;
  CachePolicyId?: string;
  OriginRequestPolicyId?: string;
  ResponseHeadersPolicyId?: string;
  GrpcConfig?: GrpcConfig;
  ForwardedValues?: ForwardedValues;
  MinTTL?: number;
  DefaultTTL?: number;
  MaxTTL?: number;
}
export const DefaultCacheBehavior = S.suspend(() =>
  S.Struct({
    TargetOriginId: S.String,
    TrustedSigners: S.optional(TrustedSigners),
    TrustedKeyGroups: S.optional(TrustedKeyGroups),
    ViewerProtocolPolicy: ViewerProtocolPolicy,
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
  }),
).annotations({
  identifier: "DefaultCacheBehavior",
}) as any as S.Schema<DefaultCacheBehavior>;
export interface CacheBehavior {
  PathPattern: string;
  TargetOriginId: string;
  TrustedSigners?: TrustedSigners;
  TrustedKeyGroups?: TrustedKeyGroups;
  ViewerProtocolPolicy: ViewerProtocolPolicy;
  AllowedMethods?: AllowedMethods;
  SmoothStreaming?: boolean;
  Compress?: boolean;
  LambdaFunctionAssociations?: LambdaFunctionAssociations;
  FunctionAssociations?: FunctionAssociations;
  FieldLevelEncryptionId?: string;
  RealtimeLogConfigArn?: string;
  CachePolicyId?: string;
  OriginRequestPolicyId?: string;
  ResponseHeadersPolicyId?: string;
  GrpcConfig?: GrpcConfig;
  ForwardedValues?: ForwardedValues;
  MinTTL?: number;
  DefaultTTL?: number;
  MaxTTL?: number;
}
export const CacheBehavior = S.suspend(() =>
  S.Struct({
    PathPattern: S.String,
    TargetOriginId: S.String,
    TrustedSigners: S.optional(TrustedSigners),
    TrustedKeyGroups: S.optional(TrustedKeyGroups),
    ViewerProtocolPolicy: ViewerProtocolPolicy,
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
  }),
).annotations({
  identifier: "CacheBehavior",
}) as any as S.Schema<CacheBehavior>;
export type CacheBehaviorList = CacheBehavior[];
export const CacheBehaviorList = S.Array(
  CacheBehavior.pipe(T.XmlName("CacheBehavior")).annotations({
    identifier: "CacheBehavior",
  }),
);
export interface CacheBehaviors {
  Quantity: number;
  Items?: CacheBehavior[];
}
export const CacheBehaviors = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(CacheBehaviorList) }),
).annotations({
  identifier: "CacheBehaviors",
}) as any as S.Schema<CacheBehaviors>;
export interface CustomErrorResponse {
  ErrorCode: number;
  ResponsePagePath?: string;
  ResponseCode?: string;
  ErrorCachingMinTTL?: number;
}
export const CustomErrorResponse = S.suspend(() =>
  S.Struct({
    ErrorCode: S.Number,
    ResponsePagePath: S.optional(S.String),
    ResponseCode: S.optional(S.String),
    ErrorCachingMinTTL: S.optional(S.Number),
  }),
).annotations({
  identifier: "CustomErrorResponse",
}) as any as S.Schema<CustomErrorResponse>;
export type CustomErrorResponseList = CustomErrorResponse[];
export const CustomErrorResponseList = S.Array(
  CustomErrorResponse.pipe(T.XmlName("CustomErrorResponse")).annotations({
    identifier: "CustomErrorResponse",
  }),
);
export interface CustomErrorResponses {
  Quantity: number;
  Items?: CustomErrorResponse[];
}
export const CustomErrorResponses = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(CustomErrorResponseList) }),
).annotations({
  identifier: "CustomErrorResponses",
}) as any as S.Schema<CustomErrorResponses>;
export interface LoggingConfig {
  Enabled?: boolean;
  IncludeCookies?: boolean;
  Bucket?: string;
  Prefix?: string;
}
export const LoggingConfig = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    IncludeCookies: S.optional(S.Boolean),
    Bucket: S.optional(S.String),
    Prefix: S.optional(S.String),
  }),
).annotations({
  identifier: "LoggingConfig",
}) as any as S.Schema<LoggingConfig>;
export type PriceClass =
  | "PriceClass_100"
  | "PriceClass_200"
  | "PriceClass_All"
  | "None"
  | (string & {});
export const PriceClass = S.String;
export type SSLSupportMethod = "sni-only" | "vip" | "static-ip" | (string & {});
export const SSLSupportMethod = S.String;
export type MinimumProtocolVersion =
  | "SSLv3"
  | "TLSv1"
  | "TLSv1_2016"
  | "TLSv1.1_2016"
  | "TLSv1.2_2018"
  | "TLSv1.2_2019"
  | "TLSv1.2_2021"
  | "TLSv1.3_2025"
  | "TLSv1.2_2025"
  | (string & {});
export const MinimumProtocolVersion = S.String;
export type CertificateSource = "cloudfront" | "iam" | "acm" | (string & {});
export const CertificateSource = S.String;
export interface ViewerCertificate {
  CloudFrontDefaultCertificate?: boolean;
  IAMCertificateId?: string;
  ACMCertificateArn?: string;
  SSLSupportMethod?: SSLSupportMethod;
  MinimumProtocolVersion?: MinimumProtocolVersion;
  Certificate?: string;
  CertificateSource?: CertificateSource;
}
export const ViewerCertificate = S.suspend(() =>
  S.Struct({
    CloudFrontDefaultCertificate: S.optional(S.Boolean),
    IAMCertificateId: S.optional(S.String),
    ACMCertificateArn: S.optional(S.String),
    SSLSupportMethod: S.optional(SSLSupportMethod),
    MinimumProtocolVersion: S.optional(MinimumProtocolVersion),
    Certificate: S.optional(S.String),
    CertificateSource: S.optional(CertificateSource),
  }),
).annotations({
  identifier: "ViewerCertificate",
}) as any as S.Schema<ViewerCertificate>;
export type GeoRestrictionType =
  | "blacklist"
  | "whitelist"
  | "none"
  | (string & {});
export const GeoRestrictionType = S.String;
export type LocationList = string[];
export const LocationList = S.Array(S.String.pipe(T.XmlName("Location")));
export interface GeoRestriction {
  RestrictionType: GeoRestrictionType;
  Quantity: number;
  Items?: string[];
}
export const GeoRestriction = S.suspend(() =>
  S.Struct({
    RestrictionType: GeoRestrictionType,
    Quantity: S.Number,
    Items: S.optional(LocationList),
  }),
).annotations({
  identifier: "GeoRestriction",
}) as any as S.Schema<GeoRestriction>;
export interface Restrictions {
  GeoRestriction: GeoRestriction;
}
export const Restrictions = S.suspend(() =>
  S.Struct({ GeoRestriction: GeoRestriction }),
).annotations({ identifier: "Restrictions" }) as any as S.Schema<Restrictions>;
export type HttpVersion =
  | "http1.1"
  | "http2"
  | "http3"
  | "http2and3"
  | "HTTP1.1"
  | "HTTP2"
  | "HTTP3"
  | "HTTP2AND3"
  | (string & {});
export const HttpVersion = S.String;
export interface StringSchemaConfig {
  Comment?: string | redacted.Redacted<string>;
  DefaultValue?: string;
  Required: boolean;
}
export const StringSchemaConfig = S.suspend(() =>
  S.Struct({
    Comment: S.optional(SensitiveString),
    DefaultValue: S.optional(S.String),
    Required: S.Boolean,
  }),
).annotations({
  identifier: "StringSchemaConfig",
}) as any as S.Schema<StringSchemaConfig>;
export interface ParameterDefinitionSchema {
  StringSchema?: StringSchemaConfig;
}
export const ParameterDefinitionSchema = S.suspend(() =>
  S.Struct({ StringSchema: S.optional(StringSchemaConfig) }),
).annotations({
  identifier: "ParameterDefinitionSchema",
}) as any as S.Schema<ParameterDefinitionSchema>;
export interface ParameterDefinition {
  Name: string;
  Definition: ParameterDefinitionSchema;
}
export const ParameterDefinition = S.suspend(() =>
  S.Struct({ Name: S.String, Definition: ParameterDefinitionSchema }),
).annotations({
  identifier: "ParameterDefinition",
}) as any as S.Schema<ParameterDefinition>;
export type ParameterDefinitions = ParameterDefinition[];
export const ParameterDefinitions = S.Array(ParameterDefinition);
export interface TenantConfig {
  ParameterDefinitions?: ParameterDefinition[];
}
export const TenantConfig = S.suspend(() =>
  S.Struct({ ParameterDefinitions: S.optional(ParameterDefinitions) }),
).annotations({ identifier: "TenantConfig" }) as any as S.Schema<TenantConfig>;
export type ViewerMtlsMode = "required" | "optional" | (string & {});
export const ViewerMtlsMode = S.String;
export interface TrustStoreConfig {
  TrustStoreId: string;
  AdvertiseTrustStoreCaNames?: boolean;
  IgnoreCertificateExpiry?: boolean;
}
export const TrustStoreConfig = S.suspend(() =>
  S.Struct({
    TrustStoreId: S.String,
    AdvertiseTrustStoreCaNames: S.optional(S.Boolean),
    IgnoreCertificateExpiry: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TrustStoreConfig",
}) as any as S.Schema<TrustStoreConfig>;
export interface ViewerMtlsConfig {
  Mode?: ViewerMtlsMode;
  TrustStoreConfig?: TrustStoreConfig;
}
export const ViewerMtlsConfig = S.suspend(() =>
  S.Struct({
    Mode: S.optional(ViewerMtlsMode),
    TrustStoreConfig: S.optional(TrustStoreConfig),
  }),
).annotations({
  identifier: "ViewerMtlsConfig",
}) as any as S.Schema<ViewerMtlsConfig>;
export interface ConnectionFunctionAssociation {
  Id: string;
}
export const ConnectionFunctionAssociation = S.suspend(() =>
  S.Struct({ Id: S.String }),
).annotations({
  identifier: "ConnectionFunctionAssociation",
}) as any as S.Schema<ConnectionFunctionAssociation>;
export interface DistributionConfig {
  CallerReference: string;
  Aliases?: Aliases;
  DefaultRootObject?: string;
  Origins: Origins;
  OriginGroups?: OriginGroups;
  DefaultCacheBehavior: DefaultCacheBehavior;
  CacheBehaviors?: CacheBehaviors;
  CustomErrorResponses?: CustomErrorResponses;
  Comment: string | redacted.Redacted<string>;
  Logging?: LoggingConfig;
  PriceClass?: PriceClass;
  Enabled: boolean;
  ViewerCertificate?: ViewerCertificate;
  Restrictions?: Restrictions;
  WebACLId?: string;
  HttpVersion?: HttpVersion;
  IsIPV6Enabled?: boolean;
  ContinuousDeploymentPolicyId?: string;
  Staging?: boolean;
  AnycastIpListId?: string;
  TenantConfig?: TenantConfig;
  ConnectionMode?: ConnectionMode;
  ViewerMtlsConfig?: ViewerMtlsConfig;
  ConnectionFunctionAssociation?: ConnectionFunctionAssociation;
}
export const DistributionConfig = S.suspend(() =>
  S.Struct({
    CallerReference: S.String,
    Aliases: S.optional(Aliases),
    DefaultRootObject: S.optional(S.String),
    Origins: Origins,
    OriginGroups: S.optional(OriginGroups),
    DefaultCacheBehavior: DefaultCacheBehavior,
    CacheBehaviors: S.optional(CacheBehaviors),
    CustomErrorResponses: S.optional(CustomErrorResponses),
    Comment: SensitiveString,
    Logging: S.optional(LoggingConfig),
    PriceClass: S.optional(PriceClass),
    Enabled: S.Boolean,
    ViewerCertificate: S.optional(ViewerCertificate),
    Restrictions: S.optional(Restrictions),
    WebACLId: S.optional(S.String),
    HttpVersion: S.optional(HttpVersion),
    IsIPV6Enabled: S.optional(S.Boolean),
    ContinuousDeploymentPolicyId: S.optional(S.String),
    Staging: S.optional(S.Boolean),
    AnycastIpListId: S.optional(S.String),
    TenantConfig: S.optional(TenantConfig),
    ConnectionMode: S.optional(ConnectionMode),
    ViewerMtlsConfig: S.optional(ViewerMtlsConfig),
    ConnectionFunctionAssociation: S.optional(ConnectionFunctionAssociation),
  }),
).annotations({
  identifier: "DistributionConfig",
}) as any as S.Schema<DistributionConfig>;
export interface UpdateDistributionRequest {
  DistributionConfig: DistributionConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdateDistributionRequest = S.suspend(() =>
  S.Struct({
    DistributionConfig: DistributionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("DistributionConfig"),
    ).annotations({ identifier: "DistributionConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/distribution/{Id}/config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDistributionRequest",
}) as any as S.Schema<UpdateDistributionRequest>;
export interface DomainItem {
  Domain: string;
}
export const DomainItem = S.suspend(() =>
  S.Struct({ Domain: S.String }),
).annotations({ identifier: "DomainItem" }) as any as S.Schema<DomainItem>;
export type DomainList = DomainItem[];
export const DomainList = S.Array(DomainItem);
export type CustomizationActionType = "override" | "disable" | (string & {});
export const CustomizationActionType = S.String;
export interface WebAclCustomization {
  Action: CustomizationActionType;
  Arn?: string;
}
export const WebAclCustomization = S.suspend(() =>
  S.Struct({ Action: CustomizationActionType, Arn: S.optional(S.String) }),
).annotations({
  identifier: "WebAclCustomization",
}) as any as S.Schema<WebAclCustomization>;
export interface Certificate {
  Arn: string;
}
export const Certificate = S.suspend(() =>
  S.Struct({ Arn: S.String }),
).annotations({ identifier: "Certificate" }) as any as S.Schema<Certificate>;
export interface GeoRestrictionCustomization {
  RestrictionType: GeoRestrictionType;
  Locations?: string[];
}
export const GeoRestrictionCustomization = S.suspend(() =>
  S.Struct({
    RestrictionType: GeoRestrictionType,
    Locations: S.optional(LocationList),
  }),
).annotations({
  identifier: "GeoRestrictionCustomization",
}) as any as S.Schema<GeoRestrictionCustomization>;
export interface Customizations {
  WebAcl?: WebAclCustomization;
  Certificate?: Certificate;
  GeoRestrictions?: GeoRestrictionCustomization;
}
export const Customizations = S.suspend(() =>
  S.Struct({
    WebAcl: S.optional(WebAclCustomization),
    Certificate: S.optional(Certificate),
    GeoRestrictions: S.optional(GeoRestrictionCustomization),
  }),
).annotations({
  identifier: "Customizations",
}) as any as S.Schema<Customizations>;
export interface Parameter {
  Name: string;
  Value: string;
}
export const Parameter = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({ identifier: "Parameter" }) as any as S.Schema<Parameter>;
export type Parameters = Parameter[];
export const Parameters = S.Array(Parameter);
export type ValidationTokenHost = "cloudfront" | "self-hosted" | (string & {});
export const ValidationTokenHost = S.String;
export type CertificateTransparencyLoggingPreference =
  | "enabled"
  | "disabled"
  | (string & {});
export const CertificateTransparencyLoggingPreference = S.String;
export interface ManagedCertificateRequest {
  ValidationTokenHost: ValidationTokenHost;
  PrimaryDomainName?: string;
  CertificateTransparencyLoggingPreference?: CertificateTransparencyLoggingPreference;
}
export const ManagedCertificateRequest = S.suspend(() =>
  S.Struct({
    ValidationTokenHost: ValidationTokenHost,
    PrimaryDomainName: S.optional(S.String),
    CertificateTransparencyLoggingPreference: S.optional(
      CertificateTransparencyLoggingPreference,
    ),
  }),
).annotations({
  identifier: "ManagedCertificateRequest",
}) as any as S.Schema<ManagedCertificateRequest>;
export interface UpdateDistributionTenantRequest {
  Id: string;
  DistributionId?: string;
  Domains?: DomainItem[];
  Customizations?: Customizations;
  Parameters?: Parameter[];
  ConnectionGroupId?: string;
  IfMatch: string;
  ManagedCertificateRequest?: ManagedCertificateRequest;
  Enabled?: boolean;
}
export const UpdateDistributionTenantRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    DistributionId: S.optional(S.String),
    Domains: S.optional(DomainList),
    Customizations: S.optional(Customizations),
    Parameters: S.optional(Parameters),
    ConnectionGroupId: S.optional(S.String),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    ManagedCertificateRequest: S.optional(ManagedCertificateRequest),
    Enabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/distribution-tenant/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDistributionTenantRequest",
}) as any as S.Schema<UpdateDistributionTenantRequest>;
export interface UpdateDistributionWithStagingConfigRequest {
  Id: string;
  StagingDistributionId?: string;
  IfMatch?: string;
}
export const UpdateDistributionWithStagingConfigRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    StagingDistributionId: S.optional(S.String).pipe(
      T.HttpQuery("StagingDistributionId"),
    ),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateDistributionWithStagingConfigRequest",
}) as any as S.Schema<UpdateDistributionWithStagingConfigRequest>;
export interface DistributionResourceId {
  DistributionId?: string;
  DistributionTenantId?: string;
}
export const DistributionResourceId = S.suspend(() =>
  S.Struct({
    DistributionId: S.optional(S.String),
    DistributionTenantId: S.optional(S.String),
  }),
).annotations({
  identifier: "DistributionResourceId",
}) as any as S.Schema<DistributionResourceId>;
export interface UpdateDomainAssociationRequest {
  Domain: string;
  TargetResource: DistributionResourceId;
  IfMatch?: string;
}
export const UpdateDomainAssociationRequest = S.suspend(() =>
  S.Struct({
    Domain: S.String,
    TargetResource: DistributionResourceId,
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/domain-association" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDomainAssociationRequest",
}) as any as S.Schema<UpdateDomainAssociationRequest>;
export interface QueryArgProfile {
  QueryArg: string;
  ProfileId: string;
}
export const QueryArgProfile = S.suspend(() =>
  S.Struct({ QueryArg: S.String, ProfileId: S.String }),
).annotations({
  identifier: "QueryArgProfile",
}) as any as S.Schema<QueryArgProfile>;
export type QueryArgProfileList = QueryArgProfile[];
export const QueryArgProfileList = S.Array(
  QueryArgProfile.pipe(T.XmlName("QueryArgProfile")).annotations({
    identifier: "QueryArgProfile",
  }),
);
export interface QueryArgProfiles {
  Quantity: number;
  Items?: QueryArgProfile[];
}
export const QueryArgProfiles = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(QueryArgProfileList) }),
).annotations({
  identifier: "QueryArgProfiles",
}) as any as S.Schema<QueryArgProfiles>;
export interface QueryArgProfileConfig {
  ForwardWhenQueryArgProfileIsUnknown: boolean;
  QueryArgProfiles?: QueryArgProfiles;
}
export const QueryArgProfileConfig = S.suspend(() =>
  S.Struct({
    ForwardWhenQueryArgProfileIsUnknown: S.Boolean,
    QueryArgProfiles: S.optional(QueryArgProfiles),
  }),
).annotations({
  identifier: "QueryArgProfileConfig",
}) as any as S.Schema<QueryArgProfileConfig>;
export type Format = "URLEncoded" | (string & {});
export const Format = S.String;
export interface ContentTypeProfile {
  Format: Format;
  ProfileId?: string;
  ContentType: string;
}
export const ContentTypeProfile = S.suspend(() =>
  S.Struct({
    Format: Format,
    ProfileId: S.optional(S.String),
    ContentType: S.String,
  }),
).annotations({
  identifier: "ContentTypeProfile",
}) as any as S.Schema<ContentTypeProfile>;
export type ContentTypeProfileList = ContentTypeProfile[];
export const ContentTypeProfileList = S.Array(
  ContentTypeProfile.pipe(T.XmlName("ContentTypeProfile")).annotations({
    identifier: "ContentTypeProfile",
  }),
);
export interface ContentTypeProfiles {
  Quantity: number;
  Items?: ContentTypeProfile[];
}
export const ContentTypeProfiles = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(ContentTypeProfileList) }),
).annotations({
  identifier: "ContentTypeProfiles",
}) as any as S.Schema<ContentTypeProfiles>;
export interface ContentTypeProfileConfig {
  ForwardWhenContentTypeIsUnknown: boolean;
  ContentTypeProfiles?: ContentTypeProfiles;
}
export const ContentTypeProfileConfig = S.suspend(() =>
  S.Struct({
    ForwardWhenContentTypeIsUnknown: S.Boolean,
    ContentTypeProfiles: S.optional(ContentTypeProfiles),
  }),
).annotations({
  identifier: "ContentTypeProfileConfig",
}) as any as S.Schema<ContentTypeProfileConfig>;
export interface FieldLevelEncryptionConfig {
  CallerReference: string;
  Comment?: string;
  QueryArgProfileConfig?: QueryArgProfileConfig;
  ContentTypeProfileConfig?: ContentTypeProfileConfig;
}
export const FieldLevelEncryptionConfig = S.suspend(() =>
  S.Struct({
    CallerReference: S.String,
    Comment: S.optional(S.String),
    QueryArgProfileConfig: S.optional(QueryArgProfileConfig),
    ContentTypeProfileConfig: S.optional(ContentTypeProfileConfig),
  }),
).annotations({
  identifier: "FieldLevelEncryptionConfig",
}) as any as S.Schema<FieldLevelEncryptionConfig>;
export interface UpdateFieldLevelEncryptionConfigRequest {
  FieldLevelEncryptionConfig: FieldLevelEncryptionConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdateFieldLevelEncryptionConfigRequest = S.suspend(() =>
  S.Struct({
    FieldLevelEncryptionConfig: FieldLevelEncryptionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("FieldLevelEncryptionConfig"),
    ).annotations({ identifier: "FieldLevelEncryptionConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateFieldLevelEncryptionConfigRequest",
}) as any as S.Schema<UpdateFieldLevelEncryptionConfigRequest>;
export type FieldPatternList = string[];
export const FieldPatternList = S.Array(
  S.String.pipe(T.XmlName("FieldPattern")),
);
export interface FieldPatterns {
  Quantity: number;
  Items?: string[];
}
export const FieldPatterns = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(FieldPatternList) }),
).annotations({
  identifier: "FieldPatterns",
}) as any as S.Schema<FieldPatterns>;
export interface EncryptionEntity {
  PublicKeyId: string;
  ProviderId: string;
  FieldPatterns: FieldPatterns;
}
export const EncryptionEntity = S.suspend(() =>
  S.Struct({
    PublicKeyId: S.String,
    ProviderId: S.String,
    FieldPatterns: FieldPatterns,
  }),
).annotations({
  identifier: "EncryptionEntity",
}) as any as S.Schema<EncryptionEntity>;
export type EncryptionEntityList = EncryptionEntity[];
export const EncryptionEntityList = S.Array(
  EncryptionEntity.pipe(T.XmlName("EncryptionEntity")).annotations({
    identifier: "EncryptionEntity",
  }),
);
export interface EncryptionEntities {
  Quantity: number;
  Items?: EncryptionEntity[];
}
export const EncryptionEntities = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(EncryptionEntityList) }),
).annotations({
  identifier: "EncryptionEntities",
}) as any as S.Schema<EncryptionEntities>;
export interface FieldLevelEncryptionProfileConfig {
  Name: string;
  CallerReference: string;
  Comment?: string;
  EncryptionEntities: EncryptionEntities;
}
export const FieldLevelEncryptionProfileConfig = S.suspend(() =>
  S.Struct({
    Name: S.String,
    CallerReference: S.String,
    Comment: S.optional(S.String),
    EncryptionEntities: EncryptionEntities,
  }),
).annotations({
  identifier: "FieldLevelEncryptionProfileConfig",
}) as any as S.Schema<FieldLevelEncryptionProfileConfig>;
export interface UpdateFieldLevelEncryptionProfileRequest {
  FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdateFieldLevelEncryptionProfileRequest = S.suspend(() =>
  S.Struct({
    FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig.pipe(
      T.HttpPayload(),
      T.XmlName("FieldLevelEncryptionProfileConfig"),
    ).annotations({ identifier: "FieldLevelEncryptionProfileConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateFieldLevelEncryptionProfileRequest",
}) as any as S.Schema<UpdateFieldLevelEncryptionProfileRequest>;
export interface UpdateFunctionRequest {
  Name: string;
  IfMatch: string;
  FunctionConfig: FunctionConfig;
  FunctionCode: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const UpdateFunctionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    FunctionConfig: FunctionConfig,
    FunctionCode: SensitiveBlob,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/function/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFunctionRequest",
}) as any as S.Schema<UpdateFunctionRequest>;
export type PublicKeyIdList = string[];
export const PublicKeyIdList = S.Array(S.String.pipe(T.XmlName("PublicKey")));
export interface KeyGroupConfig {
  Name: string;
  Items: string[];
  Comment?: string;
}
export const KeyGroupConfig = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Items: PublicKeyIdList,
    Comment: S.optional(S.String),
  }),
).annotations({
  identifier: "KeyGroupConfig",
}) as any as S.Schema<KeyGroupConfig>;
export interface UpdateKeyGroupRequest {
  KeyGroupConfig: KeyGroupConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdateKeyGroupRequest = S.suspend(() =>
  S.Struct({
    KeyGroupConfig: KeyGroupConfig.pipe(
      T.HttpPayload(),
      T.XmlName("KeyGroupConfig"),
    ).annotations({ identifier: "KeyGroupConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/key-group/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKeyGroupRequest",
}) as any as S.Schema<UpdateKeyGroupRequest>;
export interface UpdateKeyValueStoreRequest {
  Name: string;
  Comment: string;
  IfMatch: string;
}
export const UpdateKeyValueStoreRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Comment: S.String,
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/key-value-store/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKeyValueStoreRequest",
}) as any as S.Schema<UpdateKeyValueStoreRequest>;
export type OriginAccessControlSigningProtocols = "sigv4" | (string & {});
export const OriginAccessControlSigningProtocols = S.String;
export type OriginAccessControlSigningBehaviors =
  | "never"
  | "always"
  | "no-override"
  | (string & {});
export const OriginAccessControlSigningBehaviors = S.String;
export type OriginAccessControlOriginTypes =
  | "s3"
  | "mediastore"
  | "mediapackagev2"
  | "lambda"
  | (string & {});
export const OriginAccessControlOriginTypes = S.String;
export interface OriginAccessControlConfig {
  Name: string;
  Description?: string;
  SigningProtocol: OriginAccessControlSigningProtocols;
  SigningBehavior: OriginAccessControlSigningBehaviors;
  OriginAccessControlOriginType: OriginAccessControlOriginTypes;
}
export const OriginAccessControlConfig = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    SigningProtocol: OriginAccessControlSigningProtocols,
    SigningBehavior: OriginAccessControlSigningBehaviors,
    OriginAccessControlOriginType: OriginAccessControlOriginTypes,
  }),
).annotations({
  identifier: "OriginAccessControlConfig",
}) as any as S.Schema<OriginAccessControlConfig>;
export interface UpdateOriginAccessControlRequest {
  OriginAccessControlConfig: OriginAccessControlConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdateOriginAccessControlRequest = S.suspend(() =>
  S.Struct({
    OriginAccessControlConfig: OriginAccessControlConfig.pipe(
      T.HttpPayload(),
      T.XmlName("OriginAccessControlConfig"),
    ).annotations({ identifier: "OriginAccessControlConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateOriginAccessControlRequest",
}) as any as S.Schema<UpdateOriginAccessControlRequest>;
export type OriginRequestPolicyHeaderBehavior =
  | "none"
  | "whitelist"
  | "allViewer"
  | "allViewerAndWhitelistCloudFront"
  | "allExcept"
  | (string & {});
export const OriginRequestPolicyHeaderBehavior = S.String;
export interface OriginRequestPolicyHeadersConfig {
  HeaderBehavior: OriginRequestPolicyHeaderBehavior;
  Headers?: Headers;
}
export const OriginRequestPolicyHeadersConfig = S.suspend(() =>
  S.Struct({
    HeaderBehavior: OriginRequestPolicyHeaderBehavior,
    Headers: S.optional(Headers),
  }),
).annotations({
  identifier: "OriginRequestPolicyHeadersConfig",
}) as any as S.Schema<OriginRequestPolicyHeadersConfig>;
export type OriginRequestPolicyCookieBehavior =
  | "none"
  | "whitelist"
  | "all"
  | "allExcept"
  | (string & {});
export const OriginRequestPolicyCookieBehavior = S.String;
export interface OriginRequestPolicyCookiesConfig {
  CookieBehavior: OriginRequestPolicyCookieBehavior;
  Cookies?: CookieNames;
}
export const OriginRequestPolicyCookiesConfig = S.suspend(() =>
  S.Struct({
    CookieBehavior: OriginRequestPolicyCookieBehavior,
    Cookies: S.optional(CookieNames),
  }),
).annotations({
  identifier: "OriginRequestPolicyCookiesConfig",
}) as any as S.Schema<OriginRequestPolicyCookiesConfig>;
export type OriginRequestPolicyQueryStringBehavior =
  | "none"
  | "whitelist"
  | "all"
  | "allExcept"
  | (string & {});
export const OriginRequestPolicyQueryStringBehavior = S.String;
export interface OriginRequestPolicyQueryStringsConfig {
  QueryStringBehavior: OriginRequestPolicyQueryStringBehavior;
  QueryStrings?: QueryStringNames;
}
export const OriginRequestPolicyQueryStringsConfig = S.suspend(() =>
  S.Struct({
    QueryStringBehavior: OriginRequestPolicyQueryStringBehavior,
    QueryStrings: S.optional(QueryStringNames),
  }),
).annotations({
  identifier: "OriginRequestPolicyQueryStringsConfig",
}) as any as S.Schema<OriginRequestPolicyQueryStringsConfig>;
export interface OriginRequestPolicyConfig {
  Comment?: string;
  Name: string;
  HeadersConfig: OriginRequestPolicyHeadersConfig;
  CookiesConfig: OriginRequestPolicyCookiesConfig;
  QueryStringsConfig: OriginRequestPolicyQueryStringsConfig;
}
export const OriginRequestPolicyConfig = S.suspend(() =>
  S.Struct({
    Comment: S.optional(S.String),
    Name: S.String,
    HeadersConfig: OriginRequestPolicyHeadersConfig,
    CookiesConfig: OriginRequestPolicyCookiesConfig,
    QueryStringsConfig: OriginRequestPolicyQueryStringsConfig,
  }),
).annotations({
  identifier: "OriginRequestPolicyConfig",
}) as any as S.Schema<OriginRequestPolicyConfig>;
export interface UpdateOriginRequestPolicyRequest {
  OriginRequestPolicyConfig: OriginRequestPolicyConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdateOriginRequestPolicyRequest = S.suspend(() =>
  S.Struct({
    OriginRequestPolicyConfig: OriginRequestPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("OriginRequestPolicyConfig"),
    ).annotations({ identifier: "OriginRequestPolicyConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/origin-request-policy/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateOriginRequestPolicyRequest",
}) as any as S.Schema<UpdateOriginRequestPolicyRequest>;
export interface PublicKeyConfig {
  CallerReference: string;
  Name: string;
  EncodedKey: string;
  Comment?: string;
}
export const PublicKeyConfig = S.suspend(() =>
  S.Struct({
    CallerReference: S.String,
    Name: S.String,
    EncodedKey: S.String,
    Comment: S.optional(S.String),
  }),
).annotations({
  identifier: "PublicKeyConfig",
}) as any as S.Schema<PublicKeyConfig>;
export interface UpdatePublicKeyRequest {
  PublicKeyConfig: PublicKeyConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdatePublicKeyRequest = S.suspend(() =>
  S.Struct({
    PublicKeyConfig: PublicKeyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("PublicKeyConfig"),
    ).annotations({ identifier: "PublicKeyConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/public-key/{Id}/config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePublicKeyRequest",
}) as any as S.Schema<UpdatePublicKeyRequest>;
export interface KinesisStreamConfig {
  RoleARN: string;
  StreamARN: string;
}
export const KinesisStreamConfig = S.suspend(() =>
  S.Struct({ RoleARN: S.String, StreamARN: S.String }),
).annotations({
  identifier: "KinesisStreamConfig",
}) as any as S.Schema<KinesisStreamConfig>;
export interface EndPoint {
  StreamType: string;
  KinesisStreamConfig?: KinesisStreamConfig;
}
export const EndPoint = S.suspend(() =>
  S.Struct({
    StreamType: S.String,
    KinesisStreamConfig: S.optional(KinesisStreamConfig),
  }),
).annotations({ identifier: "EndPoint" }) as any as S.Schema<EndPoint>;
export type EndPointList = EndPoint[];
export const EndPointList = S.Array(EndPoint);
export interface UpdateRealtimeLogConfigRequest {
  EndPoints?: EndPoint[];
  Fields?: string[];
  Name?: string;
  ARN?: string;
  SamplingRate?: number;
}
export const UpdateRealtimeLogConfigRequest = S.suspend(() =>
  S.Struct({
    EndPoints: S.optional(EndPointList),
    Fields: S.optional(FieldList),
    Name: S.optional(S.String),
    ARN: S.optional(S.String),
    SamplingRate: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/realtime-log-config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRealtimeLogConfigRequest",
}) as any as S.Schema<UpdateRealtimeLogConfigRequest>;
export type AccessControlAllowOriginsList = string[];
export const AccessControlAllowOriginsList = S.Array(
  S.String.pipe(T.XmlName("Origin")),
);
export interface ResponseHeadersPolicyAccessControlAllowOrigins {
  Quantity: number;
  Items: string[];
}
export const ResponseHeadersPolicyAccessControlAllowOrigins = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: AccessControlAllowOriginsList }),
).annotations({
  identifier: "ResponseHeadersPolicyAccessControlAllowOrigins",
}) as any as S.Schema<ResponseHeadersPolicyAccessControlAllowOrigins>;
export type AccessControlAllowHeadersList = string[];
export const AccessControlAllowHeadersList = S.Array(
  S.String.pipe(T.XmlName("Header")),
);
export interface ResponseHeadersPolicyAccessControlAllowHeaders {
  Quantity: number;
  Items: string[];
}
export const ResponseHeadersPolicyAccessControlAllowHeaders = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: AccessControlAllowHeadersList }),
).annotations({
  identifier: "ResponseHeadersPolicyAccessControlAllowHeaders",
}) as any as S.Schema<ResponseHeadersPolicyAccessControlAllowHeaders>;
export type ResponseHeadersPolicyAccessControlAllowMethodsValues =
  | "GET"
  | "POST"
  | "OPTIONS"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "ALL"
  | (string & {});
export const ResponseHeadersPolicyAccessControlAllowMethodsValues = S.String;
export type AccessControlAllowMethodsList =
  ResponseHeadersPolicyAccessControlAllowMethodsValues[];
export const AccessControlAllowMethodsList = S.Array(
  ResponseHeadersPolicyAccessControlAllowMethodsValues.pipe(
    T.XmlName("Method"),
  ),
);
export interface ResponseHeadersPolicyAccessControlAllowMethods {
  Quantity: number;
  Items: ResponseHeadersPolicyAccessControlAllowMethodsValues[];
}
export const ResponseHeadersPolicyAccessControlAllowMethods = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: AccessControlAllowMethodsList }),
).annotations({
  identifier: "ResponseHeadersPolicyAccessControlAllowMethods",
}) as any as S.Schema<ResponseHeadersPolicyAccessControlAllowMethods>;
export type AccessControlExposeHeadersList = string[];
export const AccessControlExposeHeadersList = S.Array(
  S.String.pipe(T.XmlName("Header")),
);
export interface ResponseHeadersPolicyAccessControlExposeHeaders {
  Quantity: number;
  Items?: string[];
}
export const ResponseHeadersPolicyAccessControlExposeHeaders = S.suspend(() =>
  S.Struct({
    Quantity: S.Number,
    Items: S.optional(AccessControlExposeHeadersList),
  }),
).annotations({
  identifier: "ResponseHeadersPolicyAccessControlExposeHeaders",
}) as any as S.Schema<ResponseHeadersPolicyAccessControlExposeHeaders>;
export interface ResponseHeadersPolicyCorsConfig {
  AccessControlAllowOrigins: ResponseHeadersPolicyAccessControlAllowOrigins;
  AccessControlAllowHeaders: ResponseHeadersPolicyAccessControlAllowHeaders;
  AccessControlAllowMethods: ResponseHeadersPolicyAccessControlAllowMethods;
  AccessControlAllowCredentials: boolean;
  AccessControlExposeHeaders?: ResponseHeadersPolicyAccessControlExposeHeaders;
  AccessControlMaxAgeSec?: number;
  OriginOverride: boolean;
}
export const ResponseHeadersPolicyCorsConfig = S.suspend(() =>
  S.Struct({
    AccessControlAllowOrigins: ResponseHeadersPolicyAccessControlAllowOrigins,
    AccessControlAllowHeaders: ResponseHeadersPolicyAccessControlAllowHeaders,
    AccessControlAllowMethods: ResponseHeadersPolicyAccessControlAllowMethods,
    AccessControlAllowCredentials: S.Boolean,
    AccessControlExposeHeaders: S.optional(
      ResponseHeadersPolicyAccessControlExposeHeaders,
    ),
    AccessControlMaxAgeSec: S.optional(S.Number),
    OriginOverride: S.Boolean,
  }),
).annotations({
  identifier: "ResponseHeadersPolicyCorsConfig",
}) as any as S.Schema<ResponseHeadersPolicyCorsConfig>;
export interface ResponseHeadersPolicyXSSProtection {
  Override: boolean;
  Protection: boolean;
  ModeBlock?: boolean;
  ReportUri?: string;
}
export const ResponseHeadersPolicyXSSProtection = S.suspend(() =>
  S.Struct({
    Override: S.Boolean,
    Protection: S.Boolean,
    ModeBlock: S.optional(S.Boolean),
    ReportUri: S.optional(S.String),
  }),
).annotations({
  identifier: "ResponseHeadersPolicyXSSProtection",
}) as any as S.Schema<ResponseHeadersPolicyXSSProtection>;
export type FrameOptionsList = "DENY" | "SAMEORIGIN" | (string & {});
export const FrameOptionsList = S.String;
export interface ResponseHeadersPolicyFrameOptions {
  Override: boolean;
  FrameOption: FrameOptionsList;
}
export const ResponseHeadersPolicyFrameOptions = S.suspend(() =>
  S.Struct({ Override: S.Boolean, FrameOption: FrameOptionsList }),
).annotations({
  identifier: "ResponseHeadersPolicyFrameOptions",
}) as any as S.Schema<ResponseHeadersPolicyFrameOptions>;
export type ReferrerPolicyList =
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url"
  | (string & {});
export const ReferrerPolicyList = S.String;
export interface ResponseHeadersPolicyReferrerPolicy {
  Override: boolean;
  ReferrerPolicy: ReferrerPolicyList;
}
export const ResponseHeadersPolicyReferrerPolicy = S.suspend(() =>
  S.Struct({ Override: S.Boolean, ReferrerPolicy: ReferrerPolicyList }),
).annotations({
  identifier: "ResponseHeadersPolicyReferrerPolicy",
}) as any as S.Schema<ResponseHeadersPolicyReferrerPolicy>;
export interface ResponseHeadersPolicyContentSecurityPolicy {
  Override: boolean;
  ContentSecurityPolicy: string;
}
export const ResponseHeadersPolicyContentSecurityPolicy = S.suspend(() =>
  S.Struct({ Override: S.Boolean, ContentSecurityPolicy: S.String }),
).annotations({
  identifier: "ResponseHeadersPolicyContentSecurityPolicy",
}) as any as S.Schema<ResponseHeadersPolicyContentSecurityPolicy>;
export interface ResponseHeadersPolicyContentTypeOptions {
  Override: boolean;
}
export const ResponseHeadersPolicyContentTypeOptions = S.suspend(() =>
  S.Struct({ Override: S.Boolean }),
).annotations({
  identifier: "ResponseHeadersPolicyContentTypeOptions",
}) as any as S.Schema<ResponseHeadersPolicyContentTypeOptions>;
export interface ResponseHeadersPolicyStrictTransportSecurity {
  Override: boolean;
  IncludeSubdomains?: boolean;
  Preload?: boolean;
  AccessControlMaxAgeSec: number;
}
export const ResponseHeadersPolicyStrictTransportSecurity = S.suspend(() =>
  S.Struct({
    Override: S.Boolean,
    IncludeSubdomains: S.optional(S.Boolean),
    Preload: S.optional(S.Boolean),
    AccessControlMaxAgeSec: S.Number,
  }),
).annotations({
  identifier: "ResponseHeadersPolicyStrictTransportSecurity",
}) as any as S.Schema<ResponseHeadersPolicyStrictTransportSecurity>;
export interface ResponseHeadersPolicySecurityHeadersConfig {
  XSSProtection?: ResponseHeadersPolicyXSSProtection;
  FrameOptions?: ResponseHeadersPolicyFrameOptions;
  ReferrerPolicy?: ResponseHeadersPolicyReferrerPolicy;
  ContentSecurityPolicy?: ResponseHeadersPolicyContentSecurityPolicy;
  ContentTypeOptions?: ResponseHeadersPolicyContentTypeOptions;
  StrictTransportSecurity?: ResponseHeadersPolicyStrictTransportSecurity;
}
export const ResponseHeadersPolicySecurityHeadersConfig = S.suspend(() =>
  S.Struct({
    XSSProtection: S.optional(ResponseHeadersPolicyXSSProtection),
    FrameOptions: S.optional(ResponseHeadersPolicyFrameOptions),
    ReferrerPolicy: S.optional(ResponseHeadersPolicyReferrerPolicy),
    ContentSecurityPolicy: S.optional(
      ResponseHeadersPolicyContentSecurityPolicy,
    ),
    ContentTypeOptions: S.optional(ResponseHeadersPolicyContentTypeOptions),
    StrictTransportSecurity: S.optional(
      ResponseHeadersPolicyStrictTransportSecurity,
    ),
  }),
).annotations({
  identifier: "ResponseHeadersPolicySecurityHeadersConfig",
}) as any as S.Schema<ResponseHeadersPolicySecurityHeadersConfig>;
export interface ResponseHeadersPolicyServerTimingHeadersConfig {
  Enabled: boolean;
  SamplingRate?: number;
}
export const ResponseHeadersPolicyServerTimingHeadersConfig = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean, SamplingRate: S.optional(S.Number) }),
).annotations({
  identifier: "ResponseHeadersPolicyServerTimingHeadersConfig",
}) as any as S.Schema<ResponseHeadersPolicyServerTimingHeadersConfig>;
export interface ResponseHeadersPolicyCustomHeader {
  Header: string;
  Value: string;
  Override: boolean;
}
export const ResponseHeadersPolicyCustomHeader = S.suspend(() =>
  S.Struct({ Header: S.String, Value: S.String, Override: S.Boolean }),
).annotations({
  identifier: "ResponseHeadersPolicyCustomHeader",
}) as any as S.Schema<ResponseHeadersPolicyCustomHeader>;
export type ResponseHeadersPolicyCustomHeaderList =
  ResponseHeadersPolicyCustomHeader[];
export const ResponseHeadersPolicyCustomHeaderList = S.Array(
  ResponseHeadersPolicyCustomHeader.pipe(
    T.XmlName("ResponseHeadersPolicyCustomHeader"),
  ).annotations({ identifier: "ResponseHeadersPolicyCustomHeader" }),
);
export interface ResponseHeadersPolicyCustomHeadersConfig {
  Quantity: number;
  Items?: ResponseHeadersPolicyCustomHeader[];
}
export const ResponseHeadersPolicyCustomHeadersConfig = S.suspend(() =>
  S.Struct({
    Quantity: S.Number,
    Items: S.optional(ResponseHeadersPolicyCustomHeaderList),
  }),
).annotations({
  identifier: "ResponseHeadersPolicyCustomHeadersConfig",
}) as any as S.Schema<ResponseHeadersPolicyCustomHeadersConfig>;
export interface ResponseHeadersPolicyRemoveHeader {
  Header: string;
}
export const ResponseHeadersPolicyRemoveHeader = S.suspend(() =>
  S.Struct({ Header: S.String }),
).annotations({
  identifier: "ResponseHeadersPolicyRemoveHeader",
}) as any as S.Schema<ResponseHeadersPolicyRemoveHeader>;
export type ResponseHeadersPolicyRemoveHeaderList =
  ResponseHeadersPolicyRemoveHeader[];
export const ResponseHeadersPolicyRemoveHeaderList = S.Array(
  ResponseHeadersPolicyRemoveHeader.pipe(
    T.XmlName("ResponseHeadersPolicyRemoveHeader"),
  ).annotations({ identifier: "ResponseHeadersPolicyRemoveHeader" }),
);
export interface ResponseHeadersPolicyRemoveHeadersConfig {
  Quantity: number;
  Items?: ResponseHeadersPolicyRemoveHeader[];
}
export const ResponseHeadersPolicyRemoveHeadersConfig = S.suspend(() =>
  S.Struct({
    Quantity: S.Number,
    Items: S.optional(ResponseHeadersPolicyRemoveHeaderList),
  }),
).annotations({
  identifier: "ResponseHeadersPolicyRemoveHeadersConfig",
}) as any as S.Schema<ResponseHeadersPolicyRemoveHeadersConfig>;
export interface ResponseHeadersPolicyConfig {
  Comment?: string;
  Name: string;
  CorsConfig?: ResponseHeadersPolicyCorsConfig;
  SecurityHeadersConfig?: ResponseHeadersPolicySecurityHeadersConfig;
  ServerTimingHeadersConfig?: ResponseHeadersPolicyServerTimingHeadersConfig;
  CustomHeadersConfig?: ResponseHeadersPolicyCustomHeadersConfig;
  RemoveHeadersConfig?: ResponseHeadersPolicyRemoveHeadersConfig;
}
export const ResponseHeadersPolicyConfig = S.suspend(() =>
  S.Struct({
    Comment: S.optional(S.String),
    Name: S.String,
    CorsConfig: S.optional(ResponseHeadersPolicyCorsConfig),
    SecurityHeadersConfig: S.optional(
      ResponseHeadersPolicySecurityHeadersConfig,
    ),
    ServerTimingHeadersConfig: S.optional(
      ResponseHeadersPolicyServerTimingHeadersConfig,
    ),
    CustomHeadersConfig: S.optional(ResponseHeadersPolicyCustomHeadersConfig),
    RemoveHeadersConfig: S.optional(ResponseHeadersPolicyRemoveHeadersConfig),
  }),
).annotations({
  identifier: "ResponseHeadersPolicyConfig",
}) as any as S.Schema<ResponseHeadersPolicyConfig>;
export interface UpdateResponseHeadersPolicyRequest {
  ResponseHeadersPolicyConfig: ResponseHeadersPolicyConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdateResponseHeadersPolicyRequest = S.suspend(() =>
  S.Struct({
    ResponseHeadersPolicyConfig: ResponseHeadersPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("ResponseHeadersPolicyConfig"),
    ).annotations({ identifier: "ResponseHeadersPolicyConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/2020-05-31/response-headers-policy/{Id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResponseHeadersPolicyRequest",
}) as any as S.Schema<UpdateResponseHeadersPolicyRequest>;
export interface S3Origin {
  DomainName: string;
  OriginAccessIdentity: string;
}
export const S3Origin = S.suspend(() =>
  S.Struct({ DomainName: S.String, OriginAccessIdentity: S.String }),
).annotations({ identifier: "S3Origin" }) as any as S.Schema<S3Origin>;
export interface StreamingLoggingConfig {
  Enabled: boolean;
  Bucket: string;
  Prefix: string;
}
export const StreamingLoggingConfig = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean, Bucket: S.String, Prefix: S.String }),
).annotations({
  identifier: "StreamingLoggingConfig",
}) as any as S.Schema<StreamingLoggingConfig>;
export interface StreamingDistributionConfig {
  CallerReference: string;
  S3Origin: S3Origin;
  Aliases?: Aliases;
  Comment: string;
  Logging?: StreamingLoggingConfig;
  TrustedSigners: TrustedSigners;
  PriceClass?: PriceClass;
  Enabled: boolean;
}
export const StreamingDistributionConfig = S.suspend(() =>
  S.Struct({
    CallerReference: S.String,
    S3Origin: S3Origin,
    Aliases: S.optional(Aliases),
    Comment: S.String,
    Logging: S.optional(StreamingLoggingConfig),
    TrustedSigners: TrustedSigners,
    PriceClass: S.optional(PriceClass),
    Enabled: S.Boolean,
  }),
).annotations({
  identifier: "StreamingDistributionConfig",
}) as any as S.Schema<StreamingDistributionConfig>;
export interface UpdateStreamingDistributionRequest {
  StreamingDistributionConfig: StreamingDistributionConfig;
  Id: string;
  IfMatch?: string;
}
export const UpdateStreamingDistributionRequest = S.suspend(() =>
  S.Struct({
    StreamingDistributionConfig: StreamingDistributionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("StreamingDistributionConfig"),
    ).annotations({ identifier: "StreamingDistributionConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateStreamingDistributionRequest",
}) as any as S.Schema<UpdateStreamingDistributionRequest>;
export interface CaCertificatesBundleS3Location {
  Bucket: string;
  Key: string;
  Region: string;
  Version?: string;
}
export const CaCertificatesBundleS3Location = S.suspend(() =>
  S.Struct({
    Bucket: S.String,
    Key: S.String,
    Region: S.String,
    Version: S.optional(S.String),
  }),
).annotations({
  identifier: "CaCertificatesBundleS3Location",
}) as any as S.Schema<CaCertificatesBundleS3Location>;
export type CaCertificatesBundleSource = {
  CaCertificatesBundleS3Location: CaCertificatesBundleS3Location;
};
export const CaCertificatesBundleSource = S.Union(
  S.Struct({ CaCertificatesBundleS3Location: CaCertificatesBundleS3Location }),
);
export interface UpdateTrustStoreRequest {
  Id: string;
  CaCertificatesBundleSource: CaCertificatesBundleSource;
  IfMatch: string;
}
export const UpdateTrustStoreRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    CaCertificatesBundleSource: CaCertificatesBundleSource.pipe(
      T.HttpPayload(),
    ),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/trust-store/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTrustStoreRequest",
}) as any as S.Schema<UpdateTrustStoreRequest>;
export interface VpcOriginEndpointConfig {
  Name: string;
  Arn: string;
  HTTPPort: number;
  HTTPSPort: number;
  OriginProtocolPolicy: OriginProtocolPolicy;
  OriginSslProtocols?: OriginSslProtocols;
}
export const VpcOriginEndpointConfig = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Arn: S.String,
    HTTPPort: S.Number,
    HTTPSPort: S.Number,
    OriginProtocolPolicy: OriginProtocolPolicy,
    OriginSslProtocols: S.optional(OriginSslProtocols),
  }),
).annotations({
  identifier: "VpcOriginEndpointConfig",
}) as any as S.Schema<VpcOriginEndpointConfig>;
export interface UpdateVpcOriginRequest {
  VpcOriginEndpointConfig: VpcOriginEndpointConfig;
  Id: string;
  IfMatch: string;
}
export const UpdateVpcOriginRequest = S.suspend(() =>
  S.Struct({
    VpcOriginEndpointConfig: VpcOriginEndpointConfig.pipe(
      T.HttpPayload(),
      T.XmlName("VpcOriginEndpointConfig"),
    ).annotations({ identifier: "VpcOriginEndpointConfig" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2020-05-31/vpc-origin/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVpcOriginRequest",
}) as any as S.Schema<UpdateVpcOriginRequest>;
export interface VerifyDnsConfigurationRequest {
  Domain?: string;
  Identifier: string;
}
export const VerifyDnsConfigurationRequest = S.suspend(() =>
  S.Struct({ Domain: S.optional(S.String), Identifier: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/verify-dns-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyDnsConfigurationRequest",
}) as any as S.Schema<VerifyDnsConfigurationRequest>;
export type IpamCidrStatus =
  | "provisioned"
  | "failed-provision"
  | "provisioning"
  | "deprovisioned"
  | "failed-deprovision"
  | "deprovisioning"
  | "advertised"
  | "failed-advertise"
  | "advertising"
  | "withdrawn"
  | "failed-withdraw"
  | "withdrawing"
  | (string & {});
export const IpamCidrStatus = S.String;
export type ImportSourceType = "S3" | (string & {});
export const ImportSourceType = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String.pipe(T.XmlName("Key")));
export interface IpamCidrConfig {
  Cidr: string;
  IpamPoolArn: string;
  AnycastIp?: string;
  Status?: IpamCidrStatus;
}
export const IpamCidrConfig = S.suspend(() =>
  S.Struct({
    Cidr: S.String,
    IpamPoolArn: S.String,
    AnycastIp: S.optional(S.String),
    Status: S.optional(IpamCidrStatus),
  }),
).annotations({
  identifier: "IpamCidrConfig",
}) as any as S.Schema<IpamCidrConfig>;
export type IpamCidrConfigList = IpamCidrConfig[];
export const IpamCidrConfigList = S.Array(
  IpamCidrConfig.pipe(T.XmlName("IpamCidrConfig")).annotations({
    identifier: "IpamCidrConfig",
  }),
);
export interface DistributionConfigWithTags {
  DistributionConfig: DistributionConfig;
  Tags: Tags;
}
export const DistributionConfigWithTags = S.suspend(() =>
  S.Struct({ DistributionConfig: DistributionConfig, Tags: Tags }),
).annotations({
  identifier: "DistributionConfigWithTags",
}) as any as S.Schema<DistributionConfigWithTags>;
export interface ImportSource {
  SourceType: ImportSourceType;
  SourceARN: string;
}
export const ImportSource = S.suspend(() =>
  S.Struct({ SourceType: ImportSourceType, SourceARN: S.String }),
).annotations({ identifier: "ImportSource" }) as any as S.Schema<ImportSource>;
export interface StreamingDistributionConfigWithTags {
  StreamingDistributionConfig: StreamingDistributionConfig;
  Tags: Tags;
}
export const StreamingDistributionConfigWithTags = S.suspend(() =>
  S.Struct({
    StreamingDistributionConfig: StreamingDistributionConfig,
    Tags: Tags,
  }),
).annotations({
  identifier: "StreamingDistributionConfigWithTags",
}) as any as S.Schema<StreamingDistributionConfigWithTags>;
export interface ConnectionFunctionSummary {
  Name: string;
  Id: string;
  ConnectionFunctionConfig: FunctionConfig;
  ConnectionFunctionArn: string;
  Status: string;
  Stage: FunctionStage;
  CreatedTime: Date;
  LastModifiedTime: Date;
}
export const ConnectionFunctionSummary = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Id: S.String,
    ConnectionFunctionConfig: FunctionConfig,
    ConnectionFunctionArn: S.String,
    Status: S.String,
    Stage: FunctionStage,
    CreatedTime: S.Date,
    LastModifiedTime: S.Date,
  }),
).annotations({
  identifier: "ConnectionFunctionSummary",
}) as any as S.Schema<ConnectionFunctionSummary>;
export type ConnectionFunctionSummaryList = ConnectionFunctionSummary[];
export const ConnectionFunctionSummaryList = S.Array(
  ConnectionFunctionSummary.pipe(
    T.XmlName("ConnectionFunctionSummary"),
  ).annotations({ identifier: "ConnectionFunctionSummary" }),
);
export interface ConnectionGroupAssociationFilter {
  AnycastIpListId?: string;
}
export const ConnectionGroupAssociationFilter = S.suspend(() =>
  S.Struct({ AnycastIpListId: S.optional(S.String) }),
).annotations({
  identifier: "ConnectionGroupAssociationFilter",
}) as any as S.Schema<ConnectionGroupAssociationFilter>;
export interface DistributionTenantAssociationFilter {
  DistributionId?: string;
  ConnectionGroupId?: string;
}
export const DistributionTenantAssociationFilter = S.suspend(() =>
  S.Struct({
    DistributionId: S.optional(S.String),
    ConnectionGroupId: S.optional(S.String),
  }),
).annotations({
  identifier: "DistributionTenantAssociationFilter",
}) as any as S.Schema<DistributionTenantAssociationFilter>;
export interface TagKeys {
  Items?: string[];
}
export const TagKeys = S.suspend(() =>
  S.Struct({ Items: S.optional(TagKeyList) }),
).annotations({ identifier: "TagKeys" }) as any as S.Schema<TagKeys>;
export type RealtimeMetricsSubscriptionStatus =
  | "Enabled"
  | "Disabled"
  | (string & {});
export const RealtimeMetricsSubscriptionStatus = S.String;
export interface AssociateDistributionTenantWebACLResult {
  Id?: string;
  WebACLArn?: string;
  ETag?: string;
}
export const AssociateDistributionTenantWebACLResult = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    WebACLArn: S.optional(S.String),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "AssociateDistributionTenantWebACLResult",
}) as any as S.Schema<AssociateDistributionTenantWebACLResult>;
export interface AssociateDistributionWebACLResult {
  Id?: string;
  WebACLArn?: string;
  ETag?: string;
}
export const AssociateDistributionWebACLResult = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    WebACLArn: S.optional(S.String),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "AssociateDistributionWebACLResult",
}) as any as S.Schema<AssociateDistributionWebACLResult>;
export interface CreateCloudFrontOriginAccessIdentityRequest {
  CloudFrontOriginAccessIdentityConfig: CloudFrontOriginAccessIdentityConfig;
}
export const CreateCloudFrontOriginAccessIdentityRequest = S.suspend(() =>
  S.Struct({
    CloudFrontOriginAccessIdentityConfig:
      CloudFrontOriginAccessIdentityConfig.pipe(
        T.HttpPayload(),
        T.XmlName("CloudFrontOriginAccessIdentityConfig"),
      ).annotations({ identifier: "CloudFrontOriginAccessIdentityConfig" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateCloudFrontOriginAccessIdentityRequest",
}) as any as S.Schema<CreateCloudFrontOriginAccessIdentityRequest>;
export interface CreateDistributionWithTagsRequest {
  DistributionConfigWithTags: DistributionConfigWithTags;
}
export const CreateDistributionWithTagsRequest = S.suspend(() =>
  S.Struct({
    DistributionConfigWithTags: DistributionConfigWithTags.pipe(
      T.HttpPayload(),
      T.XmlName("DistributionConfigWithTags"),
    ).annotations({ identifier: "DistributionConfigWithTags" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/distribution?WithTags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDistributionWithTagsRequest",
}) as any as S.Schema<CreateDistributionWithTagsRequest>;
export interface CreateKeyGroupRequest {
  KeyGroupConfig: KeyGroupConfig;
}
export const CreateKeyGroupRequest = S.suspend(() =>
  S.Struct({
    KeyGroupConfig: KeyGroupConfig.pipe(
      T.HttpPayload(),
      T.XmlName("KeyGroupConfig"),
    ).annotations({ identifier: "KeyGroupConfig" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/key-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKeyGroupRequest",
}) as any as S.Schema<CreateKeyGroupRequest>;
export interface CreateKeyValueStoreRequest {
  Name: string;
  Comment?: string;
  ImportSource?: ImportSource;
}
export const CreateKeyValueStoreRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Comment: S.optional(S.String),
    ImportSource: S.optional(ImportSource),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/key-value-store" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKeyValueStoreRequest",
}) as any as S.Schema<CreateKeyValueStoreRequest>;
export interface CreateOriginAccessControlRequest {
  OriginAccessControlConfig: OriginAccessControlConfig;
}
export const CreateOriginAccessControlRequest = S.suspend(() =>
  S.Struct({
    OriginAccessControlConfig: OriginAccessControlConfig.pipe(
      T.HttpPayload(),
      T.XmlName("OriginAccessControlConfig"),
    ).annotations({ identifier: "OriginAccessControlConfig" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/origin-access-control" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOriginAccessControlRequest",
}) as any as S.Schema<CreateOriginAccessControlRequest>;
export interface CreatePublicKeyRequest {
  PublicKeyConfig: PublicKeyConfig;
}
export const CreatePublicKeyRequest = S.suspend(() =>
  S.Struct({
    PublicKeyConfig: PublicKeyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("PublicKeyConfig"),
    ).annotations({ identifier: "PublicKeyConfig" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/public-key" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePublicKeyRequest",
}) as any as S.Schema<CreatePublicKeyRequest>;
export interface CreateStreamingDistributionWithTagsRequest {
  StreamingDistributionConfigWithTags: StreamingDistributionConfigWithTags;
}
export const CreateStreamingDistributionWithTagsRequest = S.suspend(() =>
  S.Struct({
    StreamingDistributionConfigWithTags:
      StreamingDistributionConfigWithTags.pipe(
        T.HttpPayload(),
        T.XmlName("StreamingDistributionConfigWithTags"),
      ).annotations({ identifier: "StreamingDistributionConfigWithTags" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateStreamingDistributionWithTagsRequest",
}) as any as S.Schema<CreateStreamingDistributionWithTagsRequest>;
export interface FunctionMetadata {
  FunctionARN: string;
  Stage?: FunctionStage;
  CreatedTime?: Date;
  LastModifiedTime: Date;
}
export const FunctionMetadata = S.suspend(() =>
  S.Struct({
    FunctionARN: S.String,
    Stage: S.optional(FunctionStage),
    CreatedTime: S.optional(S.Date),
    LastModifiedTime: S.Date,
  }),
).annotations({
  identifier: "FunctionMetadata",
}) as any as S.Schema<FunctionMetadata>;
export interface FunctionSummary {
  Name: string;
  Status?: string;
  FunctionConfig: FunctionConfig;
  FunctionMetadata: FunctionMetadata;
}
export const FunctionSummary = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Status: S.optional(S.String),
    FunctionConfig: FunctionConfig,
    FunctionMetadata: FunctionMetadata,
  }),
).annotations({
  identifier: "FunctionSummary",
}) as any as S.Schema<FunctionSummary>;
export interface DescribeFunctionResult {
  FunctionSummary?: FunctionSummary;
  ETag?: string;
}
export const DescribeFunctionResult = S.suspend(() =>
  S.Struct({
    FunctionSummary: S.optional(FunctionSummary)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FunctionSummary" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "DescribeFunctionResult",
}) as any as S.Schema<DescribeFunctionResult>;
export interface DisassociateDistributionTenantWebACLResult {
  Id?: string;
  ETag?: string;
}
export const DisassociateDistributionTenantWebACLResult = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "DisassociateDistributionTenantWebACLResult",
}) as any as S.Schema<DisassociateDistributionTenantWebACLResult>;
export interface DisassociateDistributionWebACLResult {
  Id?: string;
  ETag?: string;
}
export const DisassociateDistributionWebACLResult = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "DisassociateDistributionWebACLResult",
}) as any as S.Schema<DisassociateDistributionWebACLResult>;
export interface GetCachePolicyConfigResult {
  CachePolicyConfig?: CachePolicyConfig;
  ETag?: string;
}
export const GetCachePolicyConfigResult = S.suspend(() =>
  S.Struct({
    CachePolicyConfig: S.optional(CachePolicyConfig)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CachePolicyConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetCachePolicyConfigResult",
}) as any as S.Schema<GetCachePolicyConfigResult>;
export interface GetCloudFrontOriginAccessIdentityConfigResult {
  CloudFrontOriginAccessIdentityConfig?: CloudFrontOriginAccessIdentityConfig;
  ETag?: string;
}
export const GetCloudFrontOriginAccessIdentityConfigResult = S.suspend(() =>
  S.Struct({
    CloudFrontOriginAccessIdentityConfig: S.optional(
      CloudFrontOriginAccessIdentityConfig,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CloudFrontOriginAccessIdentityConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetCloudFrontOriginAccessIdentityConfigResult",
}) as any as S.Schema<GetCloudFrontOriginAccessIdentityConfigResult>;
export interface GetConnectionFunctionResult {
  ConnectionFunctionCode?: T.StreamingOutputBody;
  ETag?: string;
  ContentType?: string;
}
export const GetConnectionFunctionResult = S.suspend(() =>
  S.Struct({
    ConnectionFunctionCode: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  }).pipe(ns),
).annotations({
  identifier: "GetConnectionFunctionResult",
}) as any as S.Schema<GetConnectionFunctionResult>;
export interface ConnectionGroup {
  Id?: string;
  Name?: string;
  Arn?: string;
  CreatedTime?: Date;
  LastModifiedTime?: Date;
  Tags?: Tags;
  Ipv6Enabled?: boolean;
  RoutingEndpoint?: string;
  AnycastIpListId?: string;
  Status?: string;
  Enabled?: boolean;
  IsDefault?: boolean;
}
export const ConnectionGroup = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ConnectionGroup",
}) as any as S.Schema<ConnectionGroup>;
export interface GetConnectionGroupResult {
  ConnectionGroup?: ConnectionGroup;
  ETag?: string;
}
export const GetConnectionGroupResult = S.suspend(() =>
  S.Struct({
    ConnectionGroup: S.optional(ConnectionGroup)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ConnectionGroup" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetConnectionGroupResult",
}) as any as S.Schema<GetConnectionGroupResult>;
export interface GetConnectionGroupByRoutingEndpointResult {
  ConnectionGroup?: ConnectionGroup;
  ETag?: string;
}
export const GetConnectionGroupByRoutingEndpointResult = S.suspend(() =>
  S.Struct({
    ConnectionGroup: S.optional(ConnectionGroup)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ConnectionGroup" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetConnectionGroupByRoutingEndpointResult",
}) as any as S.Schema<GetConnectionGroupByRoutingEndpointResult>;
export interface GetContinuousDeploymentPolicyConfigResult {
  ContinuousDeploymentPolicyConfig?: ContinuousDeploymentPolicyConfig;
  ETag?: string;
}
export const GetContinuousDeploymentPolicyConfigResult = S.suspend(() =>
  S.Struct({
    ContinuousDeploymentPolicyConfig: S.optional(
      ContinuousDeploymentPolicyConfig,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ContinuousDeploymentPolicyConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetContinuousDeploymentPolicyConfigResult",
}) as any as S.Schema<GetContinuousDeploymentPolicyConfigResult>;
export type KeyPairIdList = string[];
export const KeyPairIdList = S.Array(S.String.pipe(T.XmlName("KeyPairId")));
export interface KeyPairIds {
  Quantity: number;
  Items?: string[];
}
export const KeyPairIds = S.suspend(() =>
  S.Struct({ Quantity: S.Number, Items: S.optional(KeyPairIdList) }),
).annotations({ identifier: "KeyPairIds" }) as any as S.Schema<KeyPairIds>;
export interface Signer {
  AwsAccountNumber?: string;
  KeyPairIds?: KeyPairIds;
}
export const Signer = S.suspend(() =>
  S.Struct({
    AwsAccountNumber: S.optional(S.String),
    KeyPairIds: S.optional(KeyPairIds),
  }),
).annotations({ identifier: "Signer" }) as any as S.Schema<Signer>;
export type SignerList = Signer[];
export const SignerList = S.Array(
  Signer.pipe(T.XmlName("Signer")).annotations({ identifier: "Signer" }),
);
export interface ActiveTrustedSigners {
  Enabled: boolean;
  Quantity: number;
  Items?: Signer[];
}
export const ActiveTrustedSigners = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(SignerList),
  }),
).annotations({
  identifier: "ActiveTrustedSigners",
}) as any as S.Schema<ActiveTrustedSigners>;
export interface KGKeyPairIds {
  KeyGroupId?: string;
  KeyPairIds?: KeyPairIds;
}
export const KGKeyPairIds = S.suspend(() =>
  S.Struct({
    KeyGroupId: S.optional(S.String),
    KeyPairIds: S.optional(KeyPairIds),
  }),
).annotations({ identifier: "KGKeyPairIds" }) as any as S.Schema<KGKeyPairIds>;
export type KGKeyPairIdsList = KGKeyPairIds[];
export const KGKeyPairIdsList = S.Array(
  KGKeyPairIds.pipe(T.XmlName("KeyGroup")).annotations({
    identifier: "KGKeyPairIds",
  }),
);
export interface ActiveTrustedKeyGroups {
  Enabled: boolean;
  Quantity: number;
  Items?: KGKeyPairIds[];
}
export const ActiveTrustedKeyGroups = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(KGKeyPairIdsList),
  }),
).annotations({
  identifier: "ActiveTrustedKeyGroups",
}) as any as S.Schema<ActiveTrustedKeyGroups>;
export type ICPRecordalStatus =
  | "APPROVED"
  | "SUSPENDED"
  | "PENDING"
  | (string & {});
export const ICPRecordalStatus = S.String;
export interface AliasICPRecordal {
  CNAME?: string;
  ICPRecordalStatus?: ICPRecordalStatus;
}
export const AliasICPRecordal = S.suspend(() =>
  S.Struct({
    CNAME: S.optional(S.String),
    ICPRecordalStatus: S.optional(ICPRecordalStatus),
  }),
).annotations({
  identifier: "AliasICPRecordal",
}) as any as S.Schema<AliasICPRecordal>;
export type AliasICPRecordals = AliasICPRecordal[];
export const AliasICPRecordals = S.Array(
  AliasICPRecordal.pipe(T.XmlName("AliasICPRecordal")).annotations({
    identifier: "AliasICPRecordal",
  }),
);
export interface Distribution {
  Id: string;
  ARN: string;
  Status: string;
  LastModifiedTime: Date;
  InProgressInvalidationBatches: number;
  DomainName: string;
  ActiveTrustedSigners?: ActiveTrustedSigners;
  ActiveTrustedKeyGroups?: ActiveTrustedKeyGroups;
  DistributionConfig: DistributionConfig;
  AliasICPRecordals?: AliasICPRecordal[];
}
export const Distribution = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Distribution" }) as any as S.Schema<Distribution>;
export interface GetDistributionResult {
  Distribution?: Distribution;
  ETag?: string;
}
export const GetDistributionResult = S.suspend(() =>
  S.Struct({
    Distribution: S.optional(Distribution)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Distribution" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetDistributionResult",
}) as any as S.Schema<GetDistributionResult>;
export interface GetDistributionConfigResult {
  DistributionConfig?: DistributionConfig;
  ETag?: string;
}
export const GetDistributionConfigResult = S.suspend(() =>
  S.Struct({
    DistributionConfig: S.optional(DistributionConfig)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetDistributionConfigResult",
}) as any as S.Schema<GetDistributionConfigResult>;
export type DomainStatus = "active" | "inactive" | (string & {});
export const DomainStatus = S.String;
export interface DomainResult {
  Domain: string;
  Status?: DomainStatus;
}
export const DomainResult = S.suspend(() =>
  S.Struct({ Domain: S.String, Status: S.optional(DomainStatus) }),
).annotations({ identifier: "DomainResult" }) as any as S.Schema<DomainResult>;
export type DomainResultList = DomainResult[];
export const DomainResultList = S.Array(DomainResult);
export interface DistributionTenant {
  Id?: string;
  DistributionId?: string;
  Name?: string;
  Arn?: string;
  Domains?: DomainResult[];
  Tags?: Tags;
  Customizations?: Customizations;
  Parameters?: Parameter[];
  ConnectionGroupId?: string;
  CreatedTime?: Date;
  LastModifiedTime?: Date;
  Enabled?: boolean;
  Status?: string;
}
export const DistributionTenant = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DistributionTenant",
}) as any as S.Schema<DistributionTenant>;
export interface GetDistributionTenantByDomainResult {
  DistributionTenant?: DistributionTenant;
  ETag?: string;
}
export const GetDistributionTenantByDomainResult = S.suspend(() =>
  S.Struct({
    DistributionTenant: S.optional(DistributionTenant)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionTenant" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetDistributionTenantByDomainResult",
}) as any as S.Schema<GetDistributionTenantByDomainResult>;
export interface GetFieldLevelEncryptionConfigResult {
  FieldLevelEncryptionConfig?: FieldLevelEncryptionConfig;
  ETag?: string;
}
export const GetFieldLevelEncryptionConfigResult = S.suspend(() =>
  S.Struct({
    FieldLevelEncryptionConfig: S.optional(FieldLevelEncryptionConfig)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FieldLevelEncryptionConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetFieldLevelEncryptionConfigResult",
}) as any as S.Schema<GetFieldLevelEncryptionConfigResult>;
export interface GetFieldLevelEncryptionProfileConfigResult {
  FieldLevelEncryptionProfileConfig?: FieldLevelEncryptionProfileConfig;
  ETag?: string;
}
export const GetFieldLevelEncryptionProfileConfigResult = S.suspend(() =>
  S.Struct({
    FieldLevelEncryptionProfileConfig: S.optional(
      FieldLevelEncryptionProfileConfig,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FieldLevelEncryptionProfileConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetFieldLevelEncryptionProfileConfigResult",
}) as any as S.Schema<GetFieldLevelEncryptionProfileConfigResult>;
export interface GetFunctionResult {
  FunctionCode?: T.StreamingOutputBody;
  ETag?: string;
  ContentType?: string;
}
export const GetFunctionResult = S.suspend(() =>
  S.Struct({
    FunctionCode: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  }).pipe(ns),
).annotations({
  identifier: "GetFunctionResult",
}) as any as S.Schema<GetFunctionResult>;
export interface Invalidation {
  Id: string;
  Status: string;
  CreateTime: Date;
  InvalidationBatch: InvalidationBatch;
}
export const Invalidation = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Status: S.String,
    CreateTime: S.Date,
    InvalidationBatch: InvalidationBatch,
  }),
).annotations({ identifier: "Invalidation" }) as any as S.Schema<Invalidation>;
export interface GetInvalidationResult {
  Invalidation?: Invalidation;
}
export const GetInvalidationResult = S.suspend(() =>
  S.Struct({
    Invalidation: S.optional(Invalidation)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Invalidation" }),
  }).pipe(ns),
).annotations({
  identifier: "GetInvalidationResult",
}) as any as S.Schema<GetInvalidationResult>;
export interface GetInvalidationForDistributionTenantResult {
  Invalidation?: Invalidation;
}
export const GetInvalidationForDistributionTenantResult = S.suspend(() =>
  S.Struct({
    Invalidation: S.optional(Invalidation)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Invalidation" }),
  }).pipe(ns),
).annotations({
  identifier: "GetInvalidationForDistributionTenantResult",
}) as any as S.Schema<GetInvalidationForDistributionTenantResult>;
export interface GetKeyGroupConfigResult {
  KeyGroupConfig?: KeyGroupConfig;
  ETag?: string;
}
export const GetKeyGroupConfigResult = S.suspend(() =>
  S.Struct({
    KeyGroupConfig: S.optional(KeyGroupConfig)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "KeyGroupConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetKeyGroupConfigResult",
}) as any as S.Schema<GetKeyGroupConfigResult>;
export interface RealtimeMetricsSubscriptionConfig {
  RealtimeMetricsSubscriptionStatus: RealtimeMetricsSubscriptionStatus;
}
export const RealtimeMetricsSubscriptionConfig = S.suspend(() =>
  S.Struct({
    RealtimeMetricsSubscriptionStatus: RealtimeMetricsSubscriptionStatus,
  }),
).annotations({
  identifier: "RealtimeMetricsSubscriptionConfig",
}) as any as S.Schema<RealtimeMetricsSubscriptionConfig>;
export interface MonitoringSubscription {
  RealtimeMetricsSubscriptionConfig?: RealtimeMetricsSubscriptionConfig;
}
export const MonitoringSubscription = S.suspend(() =>
  S.Struct({
    RealtimeMetricsSubscriptionConfig: S.optional(
      RealtimeMetricsSubscriptionConfig,
    ),
  }),
).annotations({
  identifier: "MonitoringSubscription",
}) as any as S.Schema<MonitoringSubscription>;
export interface GetMonitoringSubscriptionResult {
  MonitoringSubscription?: MonitoringSubscription;
}
export const GetMonitoringSubscriptionResult = S.suspend(() =>
  S.Struct({
    MonitoringSubscription: S.optional(MonitoringSubscription)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MonitoringSubscription" }),
  }).pipe(ns),
).annotations({
  identifier: "GetMonitoringSubscriptionResult",
}) as any as S.Schema<GetMonitoringSubscriptionResult>;
export interface GetOriginAccessControlConfigResult {
  OriginAccessControlConfig?: OriginAccessControlConfig;
  ETag?: string;
}
export const GetOriginAccessControlConfigResult = S.suspend(() =>
  S.Struct({
    OriginAccessControlConfig: S.optional(OriginAccessControlConfig)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "OriginAccessControlConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetOriginAccessControlConfigResult",
}) as any as S.Schema<GetOriginAccessControlConfigResult>;
export interface GetOriginRequestPolicyConfigResult {
  OriginRequestPolicyConfig?: OriginRequestPolicyConfig;
  ETag?: string;
}
export const GetOriginRequestPolicyConfigResult = S.suspend(() =>
  S.Struct({
    OriginRequestPolicyConfig: S.optional(OriginRequestPolicyConfig)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "OriginRequestPolicyConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetOriginRequestPolicyConfigResult",
}) as any as S.Schema<GetOriginRequestPolicyConfigResult>;
export interface GetPublicKeyConfigResult {
  PublicKeyConfig?: PublicKeyConfig;
  ETag?: string;
}
export const GetPublicKeyConfigResult = S.suspend(() =>
  S.Struct({
    PublicKeyConfig: S.optional(PublicKeyConfig)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "PublicKeyConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetPublicKeyConfigResult",
}) as any as S.Schema<GetPublicKeyConfigResult>;
export interface GetResourcePolicyResult {
  ResourceArn?: string;
  PolicyDocument?: string;
}
export const GetResourcePolicyResult = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    PolicyDocument: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetResourcePolicyResult",
}) as any as S.Schema<GetResourcePolicyResult>;
export interface GetResponseHeadersPolicyConfigResult {
  ResponseHeadersPolicyConfig?: ResponseHeadersPolicyConfig;
  ETag?: string;
}
export const GetResponseHeadersPolicyConfigResult = S.suspend(() =>
  S.Struct({
    ResponseHeadersPolicyConfig: S.optional(ResponseHeadersPolicyConfig)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ResponseHeadersPolicyConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetResponseHeadersPolicyConfigResult",
}) as any as S.Schema<GetResponseHeadersPolicyConfigResult>;
export interface GetStreamingDistributionConfigResult {
  StreamingDistributionConfig?: StreamingDistributionConfig;
  ETag?: string;
}
export const GetStreamingDistributionConfigResult = S.suspend(() =>
  S.Struct({
    StreamingDistributionConfig: S.optional(StreamingDistributionConfig)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "StreamingDistributionConfig" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetStreamingDistributionConfigResult",
}) as any as S.Schema<GetStreamingDistributionConfigResult>;
export interface VpcOrigin {
  Id: string;
  Arn: string;
  AccountId?: string;
  Status: string;
  CreatedTime: Date;
  LastModifiedTime: Date;
  VpcOriginEndpointConfig: VpcOriginEndpointConfig;
}
export const VpcOrigin = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Arn: S.String,
    AccountId: S.optional(S.String),
    Status: S.String,
    CreatedTime: S.Date,
    LastModifiedTime: S.Date,
    VpcOriginEndpointConfig: VpcOriginEndpointConfig,
  }),
).annotations({ identifier: "VpcOrigin" }) as any as S.Schema<VpcOrigin>;
export interface GetVpcOriginResult {
  VpcOrigin?: VpcOrigin;
  ETag?: string;
}
export const GetVpcOriginResult = S.suspend(() =>
  S.Struct({
    VpcOrigin: S.optional(VpcOrigin)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VpcOrigin" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetVpcOriginResult",
}) as any as S.Schema<GetVpcOriginResult>;
export interface ListConnectionFunctionsResult {
  NextMarker?: string;
  ConnectionFunctions?: ConnectionFunctionSummary[];
}
export const ListConnectionFunctionsResult = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    ConnectionFunctions: S.optional(ConnectionFunctionSummaryList),
  }).pipe(ns),
).annotations({
  identifier: "ListConnectionFunctionsResult",
}) as any as S.Schema<ListConnectionFunctionsResult>;
export interface ListConnectionGroupsRequest {
  AssociationFilter?: ConnectionGroupAssociationFilter;
  Marker?: string;
  MaxItems?: number;
}
export const ListConnectionGroupsRequest = S.suspend(() =>
  S.Struct({
    AssociationFilter: S.optional(ConnectionGroupAssociationFilter),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/connection-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectionGroupsRequest",
}) as any as S.Schema<ListConnectionGroupsRequest>;
export interface DistributionSummary {
  Id: string;
  ARN: string;
  ETag?: string;
  Status: string;
  LastModifiedTime: Date;
  DomainName: string;
  Aliases: Aliases;
  Origins: Origins;
  OriginGroups?: OriginGroups;
  DefaultCacheBehavior: DefaultCacheBehavior;
  CacheBehaviors: CacheBehaviors;
  CustomErrorResponses: CustomErrorResponses;
  Comment: string | redacted.Redacted<string>;
  PriceClass: PriceClass;
  Enabled: boolean;
  ViewerCertificate: ViewerCertificate;
  Restrictions: Restrictions;
  WebACLId?: string;
  HttpVersion: HttpVersion;
  IsIPV6Enabled: boolean;
  AliasICPRecordals?: AliasICPRecordal[];
  Staging: boolean;
  ConnectionMode?: ConnectionMode;
  AnycastIpListId?: string;
  ViewerMtlsConfig?: ViewerMtlsConfig;
  ConnectionFunctionAssociation?: ConnectionFunctionAssociation;
}
export const DistributionSummary = S.suspend(() =>
  S.Struct({
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
    Comment: SensitiveString,
    PriceClass: PriceClass,
    Enabled: S.Boolean,
    ViewerCertificate: ViewerCertificate,
    Restrictions: Restrictions,
    WebACLId: S.optional(S.String),
    HttpVersion: HttpVersion,
    IsIPV6Enabled: S.Boolean,
    AliasICPRecordals: S.optional(AliasICPRecordals),
    Staging: S.Boolean,
    ConnectionMode: S.optional(ConnectionMode),
    AnycastIpListId: S.optional(S.String),
    ViewerMtlsConfig: S.optional(ViewerMtlsConfig),
    ConnectionFunctionAssociation: S.optional(ConnectionFunctionAssociation),
  }),
).annotations({
  identifier: "DistributionSummary",
}) as any as S.Schema<DistributionSummary>;
export type DistributionSummaryList = DistributionSummary[];
export const DistributionSummaryList = S.Array(
  DistributionSummary.pipe(T.XmlName("DistributionSummary")).annotations({
    identifier: "DistributionSummary",
  }),
);
export interface DistributionList {
  Marker?: string;
  NextMarker?: string;
  MaxItems: number;
  IsTruncated: boolean;
  Quantity: number;
  Items?: DistributionSummary[];
}
export const DistributionList = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    IsTruncated: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(DistributionSummaryList),
  }),
).annotations({
  identifier: "DistributionList",
}) as any as S.Schema<DistributionList>;
export interface ListDistributionsByAnycastIpListIdResult {
  DistributionList?: DistributionList;
}
export const ListDistributionsByAnycastIpListIdResult = S.suspend(() =>
  S.Struct({
    DistributionList: S.optional(DistributionList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByAnycastIpListIdResult",
}) as any as S.Schema<ListDistributionsByAnycastIpListIdResult>;
export interface ListDistributionsByConnectionFunctionResult {
  DistributionList?: DistributionList;
}
export const ListDistributionsByConnectionFunctionResult = S.suspend(() =>
  S.Struct({
    DistributionList: S.optional(DistributionList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByConnectionFunctionResult",
}) as any as S.Schema<ListDistributionsByConnectionFunctionResult>;
export interface ListDistributionsByConnectionModeResult {
  DistributionList?: DistributionList;
}
export const ListDistributionsByConnectionModeResult = S.suspend(() =>
  S.Struct({
    DistributionList: S.optional(DistributionList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByConnectionModeResult",
}) as any as S.Schema<ListDistributionsByConnectionModeResult>;
export type DistributionIdListSummary = string[];
export const DistributionIdListSummary = S.Array(
  S.String.pipe(T.XmlName("DistributionId")),
);
export interface DistributionIdList {
  Marker?: string;
  NextMarker?: string;
  MaxItems: number;
  IsTruncated: boolean;
  Quantity: number;
  Items?: string[];
}
export const DistributionIdList = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    IsTruncated: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(DistributionIdListSummary),
  }),
).annotations({
  identifier: "DistributionIdList",
}) as any as S.Schema<DistributionIdList>;
export interface ListDistributionsByKeyGroupResult {
  DistributionIdList?: DistributionIdList;
}
export const ListDistributionsByKeyGroupResult = S.suspend(() =>
  S.Struct({
    DistributionIdList: S.optional(DistributionIdList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionIdList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByKeyGroupResult",
}) as any as S.Schema<ListDistributionsByKeyGroupResult>;
export interface ListDistributionsByOriginRequestPolicyIdResult {
  DistributionIdList?: DistributionIdList;
}
export const ListDistributionsByOriginRequestPolicyIdResult = S.suspend(() =>
  S.Struct({
    DistributionIdList: S.optional(DistributionIdList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionIdList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByOriginRequestPolicyIdResult",
}) as any as S.Schema<ListDistributionsByOriginRequestPolicyIdResult>;
export interface ListDistributionsByRealtimeLogConfigResult {
  DistributionList?: DistributionList;
}
export const ListDistributionsByRealtimeLogConfigResult = S.suspend(() =>
  S.Struct({
    DistributionList: S.optional(DistributionList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByRealtimeLogConfigResult",
}) as any as S.Schema<ListDistributionsByRealtimeLogConfigResult>;
export interface ListDistributionsByResponseHeadersPolicyIdResult {
  DistributionIdList?: DistributionIdList;
}
export const ListDistributionsByResponseHeadersPolicyIdResult = S.suspend(() =>
  S.Struct({
    DistributionIdList: S.optional(DistributionIdList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionIdList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByResponseHeadersPolicyIdResult",
}) as any as S.Schema<ListDistributionsByResponseHeadersPolicyIdResult>;
export interface ListDistributionsByTrustStoreResult {
  DistributionList?: DistributionList;
}
export const ListDistributionsByTrustStoreResult = S.suspend(() =>
  S.Struct({
    DistributionList: S.optional(DistributionList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByTrustStoreResult",
}) as any as S.Schema<ListDistributionsByTrustStoreResult>;
export interface ListDistributionsByVpcOriginIdResult {
  DistributionIdList?: DistributionIdList;
}
export const ListDistributionsByVpcOriginIdResult = S.suspend(() =>
  S.Struct({
    DistributionIdList: S.optional(DistributionIdList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionIdList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByVpcOriginIdResult",
}) as any as S.Schema<ListDistributionsByVpcOriginIdResult>;
export interface ListDistributionsByWebACLIdResult {
  DistributionList?: DistributionList;
}
export const ListDistributionsByWebACLIdResult = S.suspend(() =>
  S.Struct({
    DistributionList: S.optional(DistributionList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByWebACLIdResult",
}) as any as S.Schema<ListDistributionsByWebACLIdResult>;
export interface ListDistributionTenantsRequest {
  AssociationFilter?: DistributionTenantAssociationFilter;
  Marker?: string;
  MaxItems?: number;
}
export const ListDistributionTenantsRequest = S.suspend(() =>
  S.Struct({
    AssociationFilter: S.optional(DistributionTenantAssociationFilter),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/distribution-tenants" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDistributionTenantsRequest",
}) as any as S.Schema<ListDistributionTenantsRequest>;
export interface ListDomainConflictsRequest {
  Domain: string;
  DomainControlValidationResource: DistributionResourceId;
  MaxItems?: number;
  Marker?: string;
}
export const ListDomainConflictsRequest = S.suspend(() =>
  S.Struct({
    Domain: S.String,
    DomainControlValidationResource: DistributionResourceId,
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/domain-conflicts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainConflictsRequest",
}) as any as S.Schema<ListDomainConflictsRequest>;
export interface InvalidationSummary {
  Id: string;
  CreateTime: Date;
  Status: string;
}
export const InvalidationSummary = S.suspend(() =>
  S.Struct({ Id: S.String, CreateTime: S.Date, Status: S.String }),
).annotations({
  identifier: "InvalidationSummary",
}) as any as S.Schema<InvalidationSummary>;
export type InvalidationSummaryList = InvalidationSummary[];
export const InvalidationSummaryList = S.Array(
  InvalidationSummary.pipe(T.XmlName("InvalidationSummary")).annotations({
    identifier: "InvalidationSummary",
  }),
);
export interface InvalidationList {
  Marker?: string;
  NextMarker?: string;
  MaxItems: number;
  IsTruncated: boolean;
  Quantity: number;
  Items?: InvalidationSummary[];
}
export const InvalidationList = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    IsTruncated: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(InvalidationSummaryList),
  }),
).annotations({
  identifier: "InvalidationList",
}) as any as S.Schema<InvalidationList>;
export interface ListInvalidationsForDistributionTenantResult {
  InvalidationList?: InvalidationList;
}
export const ListInvalidationsForDistributionTenantResult = S.suspend(() =>
  S.Struct({
    InvalidationList: S.optional(InvalidationList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "InvalidationList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListInvalidationsForDistributionTenantResult",
}) as any as S.Schema<ListInvalidationsForDistributionTenantResult>;
export interface ListTagsForResourceResult {
  Tags: Tags;
}
export const ListTagsForResourceResult = S.suspend(() =>
  S.Struct({
    Tags: Tags.pipe(T.HttpPayload()).annotations({ identifier: "Tags" }),
  }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResult",
}) as any as S.Schema<ListTagsForResourceResult>;
export interface PublishConnectionFunctionResult {
  ConnectionFunctionSummary?: ConnectionFunctionSummary;
}
export const PublishConnectionFunctionResult = S.suspend(() =>
  S.Struct({
    ConnectionFunctionSummary: S.optional(ConnectionFunctionSummary)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ConnectionFunctionSummary" }),
  }).pipe(ns),
).annotations({
  identifier: "PublishConnectionFunctionResult",
}) as any as S.Schema<PublishConnectionFunctionResult>;
export interface PublishFunctionResult {
  FunctionSummary?: FunctionSummary;
}
export const PublishFunctionResult = S.suspend(() =>
  S.Struct({
    FunctionSummary: S.optional(FunctionSummary)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FunctionSummary" }),
  }).pipe(ns),
).annotations({
  identifier: "PublishFunctionResult",
}) as any as S.Schema<PublishFunctionResult>;
export interface PutResourcePolicyResult {
  ResourceArn?: string;
}
export const PutResourcePolicyResult = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutResourcePolicyResult",
}) as any as S.Schema<PutResourcePolicyResult>;
export interface UntagResourceRequest {
  Resource: string;
  TagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    Resource: S.String.pipe(T.HttpQuery("Resource")),
    TagKeys: TagKeys.pipe(T.HttpPayload(), T.XmlName("TagKeys")).annotations({
      identifier: "TagKeys",
    }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/tagging?Operation=Untag" }),
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
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface IpamConfig {
  Quantity: number;
  IpamCidrConfigs: IpamCidrConfig[];
}
export const IpamConfig = S.suspend(() =>
  S.Struct({ Quantity: S.Number, IpamCidrConfigs: IpamCidrConfigList }),
).annotations({ identifier: "IpamConfig" }) as any as S.Schema<IpamConfig>;
export type AnycastIps = string[];
export const AnycastIps = S.Array(S.String.pipe(T.XmlName("AnycastIp")));
export interface AnycastIpList {
  Id: string;
  Name: string;
  Status: string;
  Arn: string;
  IpAddressType?: IpAddressType;
  IpamConfig?: IpamConfig;
  AnycastIps: string[];
  IpCount: number;
  LastModifiedTime: Date;
}
export const AnycastIpList = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Name: S.String,
    Status: S.String,
    Arn: S.String,
    IpAddressType: S.optional(IpAddressType),
    IpamConfig: S.optional(IpamConfig),
    AnycastIps: AnycastIps,
    IpCount: S.Number,
    LastModifiedTime: S.Date,
  }),
).annotations({
  identifier: "AnycastIpList",
}) as any as S.Schema<AnycastIpList>;
export interface UpdateAnycastIpListResult {
  AnycastIpList?: AnycastIpList;
  ETag?: string;
}
export const UpdateAnycastIpListResult = S.suspend(() =>
  S.Struct({
    AnycastIpList: S.optional(AnycastIpList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "AnycastIpList" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateAnycastIpListResult",
}) as any as S.Schema<UpdateAnycastIpListResult>;
export interface CachePolicy {
  Id: string;
  LastModifiedTime: Date;
  CachePolicyConfig: CachePolicyConfig;
}
export const CachePolicy = S.suspend(() =>
  S.Struct({
    Id: S.String,
    LastModifiedTime: S.Date,
    CachePolicyConfig: CachePolicyConfig,
  }),
).annotations({ identifier: "CachePolicy" }) as any as S.Schema<CachePolicy>;
export interface UpdateCachePolicyResult {
  CachePolicy?: CachePolicy;
  ETag?: string;
}
export const UpdateCachePolicyResult = S.suspend(() =>
  S.Struct({
    CachePolicy: S.optional(CachePolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CachePolicy" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateCachePolicyResult",
}) as any as S.Schema<UpdateCachePolicyResult>;
export interface CloudFrontOriginAccessIdentity {
  Id: string;
  S3CanonicalUserId: string;
  CloudFrontOriginAccessIdentityConfig?: CloudFrontOriginAccessIdentityConfig;
}
export const CloudFrontOriginAccessIdentity = S.suspend(() =>
  S.Struct({
    Id: S.String,
    S3CanonicalUserId: S.String,
    CloudFrontOriginAccessIdentityConfig: S.optional(
      CloudFrontOriginAccessIdentityConfig,
    ),
  }),
).annotations({
  identifier: "CloudFrontOriginAccessIdentity",
}) as any as S.Schema<CloudFrontOriginAccessIdentity>;
export interface UpdateCloudFrontOriginAccessIdentityResult {
  CloudFrontOriginAccessIdentity?: CloudFrontOriginAccessIdentity;
  ETag?: string;
}
export const UpdateCloudFrontOriginAccessIdentityResult = S.suspend(() =>
  S.Struct({
    CloudFrontOriginAccessIdentity: S.optional(CloudFrontOriginAccessIdentity)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CloudFrontOriginAccessIdentity" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateCloudFrontOriginAccessIdentityResult",
}) as any as S.Schema<UpdateCloudFrontOriginAccessIdentityResult>;
export interface UpdateConnectionFunctionResult {
  ConnectionFunctionSummary?: ConnectionFunctionSummary;
  ETag?: string;
}
export const UpdateConnectionFunctionResult = S.suspend(() =>
  S.Struct({
    ConnectionFunctionSummary: S.optional(ConnectionFunctionSummary)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ConnectionFunctionSummary" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateConnectionFunctionResult",
}) as any as S.Schema<UpdateConnectionFunctionResult>;
export interface UpdateConnectionGroupResult {
  ConnectionGroup?: ConnectionGroup;
  ETag?: string;
}
export const UpdateConnectionGroupResult = S.suspend(() =>
  S.Struct({
    ConnectionGroup: S.optional(ConnectionGroup)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ConnectionGroup" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateConnectionGroupResult",
}) as any as S.Schema<UpdateConnectionGroupResult>;
export interface ContinuousDeploymentPolicy {
  Id: string;
  LastModifiedTime: Date;
  ContinuousDeploymentPolicyConfig: ContinuousDeploymentPolicyConfig;
}
export const ContinuousDeploymentPolicy = S.suspend(() =>
  S.Struct({
    Id: S.String,
    LastModifiedTime: S.Date,
    ContinuousDeploymentPolicyConfig: ContinuousDeploymentPolicyConfig,
  }),
).annotations({
  identifier: "ContinuousDeploymentPolicy",
}) as any as S.Schema<ContinuousDeploymentPolicy>;
export interface UpdateContinuousDeploymentPolicyResult {
  ContinuousDeploymentPolicy?: ContinuousDeploymentPolicy;
  ETag?: string;
}
export const UpdateContinuousDeploymentPolicyResult = S.suspend(() =>
  S.Struct({
    ContinuousDeploymentPolicy: S.optional(ContinuousDeploymentPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ContinuousDeploymentPolicy" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateContinuousDeploymentPolicyResult",
}) as any as S.Schema<UpdateContinuousDeploymentPolicyResult>;
export interface UpdateDistributionResult {
  Distribution?: Distribution;
  ETag?: string;
}
export const UpdateDistributionResult = S.suspend(() =>
  S.Struct({
    Distribution: S.optional(Distribution)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Distribution" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateDistributionResult",
}) as any as S.Schema<UpdateDistributionResult>;
export interface UpdateDistributionTenantResult {
  DistributionTenant?: DistributionTenant;
  ETag?: string;
}
export const UpdateDistributionTenantResult = S.suspend(() =>
  S.Struct({
    DistributionTenant: S.optional(DistributionTenant)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionTenant" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateDistributionTenantResult",
}) as any as S.Schema<UpdateDistributionTenantResult>;
export interface UpdateDistributionWithStagingConfigResult {
  Distribution?: Distribution;
  ETag?: string;
}
export const UpdateDistributionWithStagingConfigResult = S.suspend(() =>
  S.Struct({
    Distribution: S.optional(Distribution)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Distribution" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateDistributionWithStagingConfigResult",
}) as any as S.Schema<UpdateDistributionWithStagingConfigResult>;
export interface UpdateDomainAssociationResult {
  Domain?: string;
  ResourceId?: string;
  ETag?: string;
}
export const UpdateDomainAssociationResult = S.suspend(() =>
  S.Struct({
    Domain: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateDomainAssociationResult",
}) as any as S.Schema<UpdateDomainAssociationResult>;
export interface FieldLevelEncryption {
  Id: string;
  LastModifiedTime: Date;
  FieldLevelEncryptionConfig: FieldLevelEncryptionConfig;
}
export const FieldLevelEncryption = S.suspend(() =>
  S.Struct({
    Id: S.String,
    LastModifiedTime: S.Date,
    FieldLevelEncryptionConfig: FieldLevelEncryptionConfig,
  }),
).annotations({
  identifier: "FieldLevelEncryption",
}) as any as S.Schema<FieldLevelEncryption>;
export interface UpdateFieldLevelEncryptionConfigResult {
  FieldLevelEncryption?: FieldLevelEncryption;
  ETag?: string;
}
export const UpdateFieldLevelEncryptionConfigResult = S.suspend(() =>
  S.Struct({
    FieldLevelEncryption: S.optional(FieldLevelEncryption)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FieldLevelEncryption" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateFieldLevelEncryptionConfigResult",
}) as any as S.Schema<UpdateFieldLevelEncryptionConfigResult>;
export interface FieldLevelEncryptionProfile {
  Id: string;
  LastModifiedTime: Date;
  FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig;
}
export const FieldLevelEncryptionProfile = S.suspend(() =>
  S.Struct({
    Id: S.String,
    LastModifiedTime: S.Date,
    FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig,
  }),
).annotations({
  identifier: "FieldLevelEncryptionProfile",
}) as any as S.Schema<FieldLevelEncryptionProfile>;
export interface UpdateFieldLevelEncryptionProfileResult {
  FieldLevelEncryptionProfile?: FieldLevelEncryptionProfile;
  ETag?: string;
}
export const UpdateFieldLevelEncryptionProfileResult = S.suspend(() =>
  S.Struct({
    FieldLevelEncryptionProfile: S.optional(FieldLevelEncryptionProfile)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FieldLevelEncryptionProfile" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateFieldLevelEncryptionProfileResult",
}) as any as S.Schema<UpdateFieldLevelEncryptionProfileResult>;
export interface UpdateFunctionResult {
  FunctionSummary?: FunctionSummary;
  ETag?: string;
}
export const UpdateFunctionResult = S.suspend(() =>
  S.Struct({
    FunctionSummary: S.optional(FunctionSummary)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FunctionSummary" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETtag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateFunctionResult",
}) as any as S.Schema<UpdateFunctionResult>;
export interface KeyGroup {
  Id: string;
  LastModifiedTime: Date;
  KeyGroupConfig: KeyGroupConfig;
}
export const KeyGroup = S.suspend(() =>
  S.Struct({
    Id: S.String,
    LastModifiedTime: S.Date,
    KeyGroupConfig: KeyGroupConfig,
  }),
).annotations({ identifier: "KeyGroup" }) as any as S.Schema<KeyGroup>;
export interface UpdateKeyGroupResult {
  KeyGroup?: KeyGroup;
  ETag?: string;
}
export const UpdateKeyGroupResult = S.suspend(() =>
  S.Struct({
    KeyGroup: S.optional(KeyGroup)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "KeyGroup" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateKeyGroupResult",
}) as any as S.Schema<UpdateKeyGroupResult>;
export interface KeyValueStore {
  Name: string;
  Id: string;
  Comment: string;
  ARN: string;
  Status?: string;
  LastModifiedTime: Date;
}
export const KeyValueStore = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Id: S.String,
    Comment: S.String,
    ARN: S.String,
    Status: S.optional(S.String),
    LastModifiedTime: S.Date,
  }),
).annotations({
  identifier: "KeyValueStore",
}) as any as S.Schema<KeyValueStore>;
export interface UpdateKeyValueStoreResult {
  KeyValueStore?: KeyValueStore;
  ETag?: string;
}
export const UpdateKeyValueStoreResult = S.suspend(() =>
  S.Struct({
    KeyValueStore: S.optional(KeyValueStore)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "KeyValueStore" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateKeyValueStoreResult",
}) as any as S.Schema<UpdateKeyValueStoreResult>;
export interface OriginAccessControl {
  Id: string;
  OriginAccessControlConfig?: OriginAccessControlConfig;
}
export const OriginAccessControl = S.suspend(() =>
  S.Struct({
    Id: S.String,
    OriginAccessControlConfig: S.optional(OriginAccessControlConfig),
  }),
).annotations({
  identifier: "OriginAccessControl",
}) as any as S.Schema<OriginAccessControl>;
export interface UpdateOriginAccessControlResult {
  OriginAccessControl?: OriginAccessControl;
  ETag?: string;
}
export const UpdateOriginAccessControlResult = S.suspend(() =>
  S.Struct({
    OriginAccessControl: S.optional(OriginAccessControl)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "OriginAccessControl" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateOriginAccessControlResult",
}) as any as S.Schema<UpdateOriginAccessControlResult>;
export interface OriginRequestPolicy {
  Id: string;
  LastModifiedTime: Date;
  OriginRequestPolicyConfig: OriginRequestPolicyConfig;
}
export const OriginRequestPolicy = S.suspend(() =>
  S.Struct({
    Id: S.String,
    LastModifiedTime: S.Date,
    OriginRequestPolicyConfig: OriginRequestPolicyConfig,
  }),
).annotations({
  identifier: "OriginRequestPolicy",
}) as any as S.Schema<OriginRequestPolicy>;
export interface UpdateOriginRequestPolicyResult {
  OriginRequestPolicy?: OriginRequestPolicy;
  ETag?: string;
}
export const UpdateOriginRequestPolicyResult = S.suspend(() =>
  S.Struct({
    OriginRequestPolicy: S.optional(OriginRequestPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "OriginRequestPolicy" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateOriginRequestPolicyResult",
}) as any as S.Schema<UpdateOriginRequestPolicyResult>;
export interface PublicKey {
  Id: string;
  CreatedTime: Date;
  PublicKeyConfig: PublicKeyConfig;
}
export const PublicKey = S.suspend(() =>
  S.Struct({
    Id: S.String,
    CreatedTime: S.Date,
    PublicKeyConfig: PublicKeyConfig,
  }),
).annotations({ identifier: "PublicKey" }) as any as S.Schema<PublicKey>;
export interface UpdatePublicKeyResult {
  PublicKey?: PublicKey;
  ETag?: string;
}
export const UpdatePublicKeyResult = S.suspend(() =>
  S.Struct({
    PublicKey: S.optional(PublicKey)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "PublicKey" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdatePublicKeyResult",
}) as any as S.Schema<UpdatePublicKeyResult>;
export interface RealtimeLogConfig {
  ARN: string;
  Name: string;
  SamplingRate: number;
  EndPoints: EndPoint[];
  Fields: string[];
}
export const RealtimeLogConfig = S.suspend(() =>
  S.Struct({
    ARN: S.String,
    Name: S.String,
    SamplingRate: S.Number,
    EndPoints: EndPointList,
    Fields: FieldList,
  }),
).annotations({
  identifier: "RealtimeLogConfig",
}) as any as S.Schema<RealtimeLogConfig>;
export interface UpdateRealtimeLogConfigResult {
  RealtimeLogConfig?: RealtimeLogConfig;
}
export const UpdateRealtimeLogConfigResult = S.suspend(() =>
  S.Struct({ RealtimeLogConfig: S.optional(RealtimeLogConfig) }).pipe(ns),
).annotations({
  identifier: "UpdateRealtimeLogConfigResult",
}) as any as S.Schema<UpdateRealtimeLogConfigResult>;
export interface ResponseHeadersPolicy {
  Id: string;
  LastModifiedTime: Date;
  ResponseHeadersPolicyConfig: ResponseHeadersPolicyConfig;
}
export const ResponseHeadersPolicy = S.suspend(() =>
  S.Struct({
    Id: S.String,
    LastModifiedTime: S.Date,
    ResponseHeadersPolicyConfig: ResponseHeadersPolicyConfig,
  }),
).annotations({
  identifier: "ResponseHeadersPolicy",
}) as any as S.Schema<ResponseHeadersPolicy>;
export interface UpdateResponseHeadersPolicyResult {
  ResponseHeadersPolicy?: ResponseHeadersPolicy;
  ETag?: string;
}
export const UpdateResponseHeadersPolicyResult = S.suspend(() =>
  S.Struct({
    ResponseHeadersPolicy: S.optional(ResponseHeadersPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ResponseHeadersPolicy" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateResponseHeadersPolicyResult",
}) as any as S.Schema<UpdateResponseHeadersPolicyResult>;
export interface StreamingDistribution {
  Id: string;
  ARN: string;
  Status: string;
  LastModifiedTime?: Date;
  DomainName: string;
  ActiveTrustedSigners: ActiveTrustedSigners;
  StreamingDistributionConfig: StreamingDistributionConfig;
}
export const StreamingDistribution = S.suspend(() =>
  S.Struct({
    Id: S.String,
    ARN: S.String,
    Status: S.String,
    LastModifiedTime: S.optional(S.Date),
    DomainName: S.String,
    ActiveTrustedSigners: ActiveTrustedSigners,
    StreamingDistributionConfig: StreamingDistributionConfig,
  }),
).annotations({
  identifier: "StreamingDistribution",
}) as any as S.Schema<StreamingDistribution>;
export interface UpdateStreamingDistributionResult {
  StreamingDistribution?: StreamingDistribution;
  ETag?: string;
}
export const UpdateStreamingDistributionResult = S.suspend(() =>
  S.Struct({
    StreamingDistribution: S.optional(StreamingDistribution)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "StreamingDistribution" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateStreamingDistributionResult",
}) as any as S.Schema<UpdateStreamingDistributionResult>;
export type TrustStoreStatus = "pending" | "active" | "failed" | (string & {});
export const TrustStoreStatus = S.String;
export interface TrustStore {
  Id?: string;
  Arn?: string;
  Name?: string;
  Status?: TrustStoreStatus;
  NumberOfCaCertificates?: number;
  LastModifiedTime?: Date;
  Reason?: string;
}
export const TrustStore = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(TrustStoreStatus),
    NumberOfCaCertificates: S.optional(S.Number),
    LastModifiedTime: S.optional(S.Date),
    Reason: S.optional(S.String),
  }),
).annotations({ identifier: "TrustStore" }) as any as S.Schema<TrustStore>;
export interface UpdateTrustStoreResult {
  TrustStore?: TrustStore;
  ETag?: string;
}
export const UpdateTrustStoreResult = S.suspend(() =>
  S.Struct({
    TrustStore: S.optional(TrustStore)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "TrustStore" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateTrustStoreResult",
}) as any as S.Schema<UpdateTrustStoreResult>;
export interface UpdateVpcOriginResult {
  VpcOrigin?: VpcOrigin;
  ETag?: string;
}
export const UpdateVpcOriginResult = S.suspend(() =>
  S.Struct({
    VpcOrigin: S.optional(VpcOrigin)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VpcOrigin" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "UpdateVpcOriginResult",
}) as any as S.Schema<UpdateVpcOriginResult>;
export type ManagedCertificateStatus =
  | "pending-validation"
  | "issued"
  | "inactive"
  | "expired"
  | "validation-timed-out"
  | "revoked"
  | "failed"
  | (string & {});
export const ManagedCertificateStatus = S.String;
export type FunctionSummaryList = FunctionSummary[];
export const FunctionSummaryList = S.Array(
  FunctionSummary.pipe(T.XmlName("FunctionSummary")).annotations({
    identifier: "FunctionSummary",
  }),
);
export type KeyValueStoreSummaryList = KeyValueStore[];
export const KeyValueStoreSummaryList = S.Array(
  KeyValueStore.pipe(T.XmlName("KeyValueStore")).annotations({
    identifier: "KeyValueStore",
  }),
);
export type RealtimeLogConfigList = RealtimeLogConfig[];
export const RealtimeLogConfigList = S.Array(RealtimeLogConfig);
export type FunctionExecutionLogList = string[];
export const FunctionExecutionLogList = S.Array(S.String);
export type DnsConfigurationStatus =
  | "valid-configuration"
  | "invalid-configuration"
  | "unknown-configuration"
  | (string & {});
export const DnsConfigurationStatus = S.String;
export interface DistributionTenantSummary {
  Id: string;
  DistributionId: string;
  Name: string;
  Arn: string;
  Domains: DomainResult[];
  ConnectionGroupId?: string;
  Customizations?: Customizations;
  CreatedTime: Date;
  LastModifiedTime: Date;
  ETag: string;
  Enabled?: boolean;
  Status?: string;
}
export const DistributionTenantSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DistributionTenantSummary",
}) as any as S.Schema<DistributionTenantSummary>;
export type DistributionTenantList = DistributionTenantSummary[];
export const DistributionTenantList = S.Array(
  DistributionTenantSummary.pipe(
    T.XmlName("DistributionTenantSummary"),
  ).annotations({ identifier: "DistributionTenantSummary" }),
);
export interface FunctionList {
  NextMarker?: string;
  MaxItems: number;
  Quantity: number;
  Items?: FunctionSummary[];
}
export const FunctionList = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    Quantity: S.Number,
    Items: S.optional(FunctionSummaryList),
  }),
).annotations({ identifier: "FunctionList" }) as any as S.Schema<FunctionList>;
export interface KeyValueStoreList {
  NextMarker?: string;
  MaxItems: number;
  Quantity: number;
  Items?: KeyValueStore[];
}
export const KeyValueStoreList = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    Quantity: S.Number,
    Items: S.optional(KeyValueStoreSummaryList),
  }),
).annotations({
  identifier: "KeyValueStoreList",
}) as any as S.Schema<KeyValueStoreList>;
export interface RealtimeLogConfigs {
  MaxItems: number;
  Items?: RealtimeLogConfig[];
  IsTruncated: boolean;
  Marker?: string;
  NextMarker?: string;
}
export const RealtimeLogConfigs = S.suspend(() =>
  S.Struct({
    MaxItems: S.Number,
    Items: S.optional(RealtimeLogConfigList),
    IsTruncated: S.Boolean,
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "RealtimeLogConfigs",
}) as any as S.Schema<RealtimeLogConfigs>;
export interface TrustStoreSummary {
  Id: string;
  Arn: string;
  Name: string;
  Status: TrustStoreStatus;
  NumberOfCaCertificates: number;
  LastModifiedTime: Date;
  Reason?: string;
  ETag: string;
}
export const TrustStoreSummary = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Arn: S.String,
    Name: S.String,
    Status: TrustStoreStatus,
    NumberOfCaCertificates: S.Number,
    LastModifiedTime: S.Date,
    Reason: S.optional(S.String),
    ETag: S.String,
  }),
).annotations({
  identifier: "TrustStoreSummary",
}) as any as S.Schema<TrustStoreSummary>;
export type TrustStoreList = TrustStoreSummary[];
export const TrustStoreList = S.Array(
  TrustStoreSummary.pipe(T.XmlName("TrustStoreSummary")).annotations({
    identifier: "TrustStoreSummary",
  }),
);
export interface ConnectionFunctionTestResult {
  ConnectionFunctionSummary?: ConnectionFunctionSummary;
  ComputeUtilization?: string;
  ConnectionFunctionExecutionLogs?: string[];
  ConnectionFunctionErrorMessage?: string | redacted.Redacted<string>;
  ConnectionFunctionOutput?: string | redacted.Redacted<string>;
}
export const ConnectionFunctionTestResult = S.suspend(() =>
  S.Struct({
    ConnectionFunctionSummary: S.optional(ConnectionFunctionSummary),
    ComputeUtilization: S.optional(S.String),
    ConnectionFunctionExecutionLogs: S.optional(FunctionExecutionLogList),
    ConnectionFunctionErrorMessage: S.optional(SensitiveString),
    ConnectionFunctionOutput: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ConnectionFunctionTestResult",
}) as any as S.Schema<ConnectionFunctionTestResult>;
export interface TestResult {
  FunctionSummary?: FunctionSummary;
  ComputeUtilization?: string;
  FunctionExecutionLogs?: string[];
  FunctionErrorMessage?: string | redacted.Redacted<string>;
  FunctionOutput?: string | redacted.Redacted<string>;
}
export const TestResult = S.suspend(() =>
  S.Struct({
    FunctionSummary: S.optional(FunctionSummary),
    ComputeUtilization: S.optional(S.String),
    FunctionExecutionLogs: S.optional(FunctionExecutionLogList),
    FunctionErrorMessage: S.optional(SensitiveString),
    FunctionOutput: S.optional(SensitiveString),
  }),
).annotations({ identifier: "TestResult" }) as any as S.Schema<TestResult>;
export interface DnsConfiguration {
  Domain: string;
  Status: DnsConfigurationStatus;
  Reason?: string;
}
export const DnsConfiguration = S.suspend(() =>
  S.Struct({
    Domain: S.String,
    Status: DnsConfigurationStatus,
    Reason: S.optional(S.String),
  }),
).annotations({
  identifier: "DnsConfiguration",
}) as any as S.Schema<DnsConfiguration>;
export type DnsConfigurationList = DnsConfiguration[];
export const DnsConfigurationList = S.Array(
  DnsConfiguration.pipe(T.XmlName("DnsConfiguration")).annotations({
    identifier: "DnsConfiguration",
  }),
);
export interface CreateAnycastIpListRequest {
  Name: string;
  IpCount: number;
  Tags?: Tags;
  IpAddressType?: IpAddressType;
  IpamCidrConfigs?: IpamCidrConfig[];
}
export const CreateAnycastIpListRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    IpCount: S.Number,
    Tags: S.optional(Tags),
    IpAddressType: S.optional(IpAddressType),
    IpamCidrConfigs: S.optional(IpamCidrConfigList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/anycast-ip-list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAnycastIpListRequest",
}) as any as S.Schema<CreateAnycastIpListRequest>;
export interface CreateCloudFrontOriginAccessIdentityResult {
  CloudFrontOriginAccessIdentity?: CloudFrontOriginAccessIdentity;
  Location?: string;
  ETag?: string;
}
export const CreateCloudFrontOriginAccessIdentityResult = S.suspend(() =>
  S.Struct({
    CloudFrontOriginAccessIdentity: S.optional(CloudFrontOriginAccessIdentity)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CloudFrontOriginAccessIdentity" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateCloudFrontOriginAccessIdentityResult",
}) as any as S.Schema<CreateCloudFrontOriginAccessIdentityResult>;
export interface CreateConnectionGroupResult {
  ConnectionGroup?: ConnectionGroup;
  ETag?: string;
}
export const CreateConnectionGroupResult = S.suspend(() =>
  S.Struct({
    ConnectionGroup: S.optional(ConnectionGroup)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ConnectionGroup" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateConnectionGroupResult",
}) as any as S.Schema<CreateConnectionGroupResult>;
export interface CreateDistributionTenantRequest {
  DistributionId: string;
  Name: string;
  Domains: DomainItem[];
  Tags?: Tags;
  Customizations?: Customizations;
  Parameters?: Parameter[];
  ConnectionGroupId?: string;
  ManagedCertificateRequest?: ManagedCertificateRequest;
  Enabled?: boolean;
}
export const CreateDistributionTenantRequest = S.suspend(() =>
  S.Struct({
    DistributionId: S.String,
    Name: S.String,
    Domains: DomainList,
    Tags: S.optional(Tags),
    Customizations: S.optional(Customizations),
    Parameters: S.optional(Parameters),
    ConnectionGroupId: S.optional(S.String),
    ManagedCertificateRequest: S.optional(ManagedCertificateRequest),
    Enabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/distribution-tenant" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDistributionTenantRequest",
}) as any as S.Schema<CreateDistributionTenantRequest>;
export interface CreateDistributionWithTagsResult {
  Distribution?: Distribution;
  Location?: string;
  ETag?: string;
}
export const CreateDistributionWithTagsResult = S.suspend(() =>
  S.Struct({
    Distribution: S.optional(Distribution)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Distribution" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateDistributionWithTagsResult",
}) as any as S.Schema<CreateDistributionWithTagsResult>;
export interface CreateInvalidationRequest {
  DistributionId: string;
  InvalidationBatch: InvalidationBatch;
}
export const CreateInvalidationRequest = S.suspend(() =>
  S.Struct({
    DistributionId: S.String.pipe(T.HttpLabel("DistributionId")),
    InvalidationBatch: InvalidationBatch.pipe(
      T.HttpPayload(),
      T.XmlName("InvalidationBatch"),
    ).annotations({ identifier: "InvalidationBatch" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateInvalidationRequest",
}) as any as S.Schema<CreateInvalidationRequest>;
export interface CreateInvalidationForDistributionTenantResult {
  Location?: string;
  Invalidation?: Invalidation;
}
export const CreateInvalidationForDistributionTenantResult = S.suspend(() =>
  S.Struct({
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    Invalidation: S.optional(Invalidation)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Invalidation" }),
  }).pipe(ns),
).annotations({
  identifier: "CreateInvalidationForDistributionTenantResult",
}) as any as S.Schema<CreateInvalidationForDistributionTenantResult>;
export interface CreateKeyGroupResult {
  KeyGroup?: KeyGroup;
  Location?: string;
  ETag?: string;
}
export const CreateKeyGroupResult = S.suspend(() =>
  S.Struct({
    KeyGroup: S.optional(KeyGroup)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "KeyGroup" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateKeyGroupResult",
}) as any as S.Schema<CreateKeyGroupResult>;
export interface CreateKeyValueStoreResult {
  KeyValueStore?: KeyValueStore;
  ETag?: string;
  Location?: string;
}
export const CreateKeyValueStoreResult = S.suspend(() =>
  S.Struct({
    KeyValueStore: S.optional(KeyValueStore)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "KeyValueStore" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
  }).pipe(ns),
).annotations({
  identifier: "CreateKeyValueStoreResult",
}) as any as S.Schema<CreateKeyValueStoreResult>;
export interface CreateMonitoringSubscriptionRequest {
  DistributionId: string;
  MonitoringSubscription: MonitoringSubscription;
}
export const CreateMonitoringSubscriptionRequest = S.suspend(() =>
  S.Struct({
    DistributionId: S.String.pipe(T.HttpLabel("DistributionId")),
    MonitoringSubscription: MonitoringSubscription.pipe(
      T.HttpPayload(),
      T.XmlName("MonitoringSubscription"),
    ).annotations({ identifier: "MonitoringSubscription" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateMonitoringSubscriptionRequest",
}) as any as S.Schema<CreateMonitoringSubscriptionRequest>;
export interface CreateOriginAccessControlResult {
  OriginAccessControl?: OriginAccessControl;
  Location?: string;
  ETag?: string;
}
export const CreateOriginAccessControlResult = S.suspend(() =>
  S.Struct({
    OriginAccessControl: S.optional(OriginAccessControl)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "OriginAccessControl" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateOriginAccessControlResult",
}) as any as S.Schema<CreateOriginAccessControlResult>;
export interface CreatePublicKeyResult {
  PublicKey?: PublicKey;
  Location?: string;
  ETag?: string;
}
export const CreatePublicKeyResult = S.suspend(() =>
  S.Struct({
    PublicKey: S.optional(PublicKey)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "PublicKey" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreatePublicKeyResult",
}) as any as S.Schema<CreatePublicKeyResult>;
export interface CreateRealtimeLogConfigRequest {
  EndPoints: EndPoint[];
  Fields: string[];
  Name: string;
  SamplingRate: number;
}
export const CreateRealtimeLogConfigRequest = S.suspend(() =>
  S.Struct({
    EndPoints: EndPointList,
    Fields: FieldList,
    Name: S.String,
    SamplingRate: S.Number,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/realtime-log-config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRealtimeLogConfigRequest",
}) as any as S.Schema<CreateRealtimeLogConfigRequest>;
export interface CreateStreamingDistributionRequest {
  StreamingDistributionConfig: StreamingDistributionConfig;
}
export const CreateStreamingDistributionRequest = S.suspend(() =>
  S.Struct({
    StreamingDistributionConfig: StreamingDistributionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("StreamingDistributionConfig"),
    ).annotations({ identifier: "StreamingDistributionConfig" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/streaming-distribution" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateStreamingDistributionRequest",
}) as any as S.Schema<CreateStreamingDistributionRequest>;
export interface CreateStreamingDistributionWithTagsResult {
  StreamingDistribution?: StreamingDistribution;
  Location?: string;
  ETag?: string;
}
export const CreateStreamingDistributionWithTagsResult = S.suspend(() =>
  S.Struct({
    StreamingDistribution: S.optional(StreamingDistribution)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "StreamingDistribution" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateStreamingDistributionWithTagsResult",
}) as any as S.Schema<CreateStreamingDistributionWithTagsResult>;
export interface CreateTrustStoreRequest {
  Name: string;
  CaCertificatesBundleSource: CaCertificatesBundleSource;
  Tags?: Tags;
}
export const CreateTrustStoreRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    CaCertificatesBundleSource: CaCertificatesBundleSource,
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/trust-store" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTrustStoreRequest",
}) as any as S.Schema<CreateTrustStoreRequest>;
export interface CreateVpcOriginRequest {
  VpcOriginEndpointConfig: VpcOriginEndpointConfig;
  Tags?: Tags;
}
export const CreateVpcOriginRequest = S.suspend(() =>
  S.Struct({
    VpcOriginEndpointConfig: VpcOriginEndpointConfig,
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/vpc-origin" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVpcOriginRequest",
}) as any as S.Schema<CreateVpcOriginRequest>;
export interface DeleteVpcOriginResult {
  VpcOrigin?: VpcOrigin;
  ETag?: string;
}
export const DeleteVpcOriginResult = S.suspend(() =>
  S.Struct({
    VpcOrigin: S.optional(VpcOrigin)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VpcOrigin" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "DeleteVpcOriginResult",
}) as any as S.Schema<DeleteVpcOriginResult>;
export interface DescribeConnectionFunctionResult {
  ConnectionFunctionSummary?: ConnectionFunctionSummary;
  ETag?: string;
}
export const DescribeConnectionFunctionResult = S.suspend(() =>
  S.Struct({
    ConnectionFunctionSummary: S.optional(ConnectionFunctionSummary)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ConnectionFunctionSummary" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConnectionFunctionResult",
}) as any as S.Schema<DescribeConnectionFunctionResult>;
export interface DescribeKeyValueStoreResult {
  KeyValueStore?: KeyValueStore;
  ETag?: string;
}
export const DescribeKeyValueStoreResult = S.suspend(() =>
  S.Struct({
    KeyValueStore: S.optional(KeyValueStore)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "KeyValueStore" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "DescribeKeyValueStoreResult",
}) as any as S.Schema<DescribeKeyValueStoreResult>;
export interface GetCachePolicyResult {
  CachePolicy?: CachePolicy;
  ETag?: string;
}
export const GetCachePolicyResult = S.suspend(() =>
  S.Struct({
    CachePolicy: S.optional(CachePolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CachePolicy" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetCachePolicyResult",
}) as any as S.Schema<GetCachePolicyResult>;
export interface GetCloudFrontOriginAccessIdentityResult {
  CloudFrontOriginAccessIdentity?: CloudFrontOriginAccessIdentity;
  ETag?: string;
}
export const GetCloudFrontOriginAccessIdentityResult = S.suspend(() =>
  S.Struct({
    CloudFrontOriginAccessIdentity: S.optional(CloudFrontOriginAccessIdentity)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CloudFrontOriginAccessIdentity" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetCloudFrontOriginAccessIdentityResult",
}) as any as S.Schema<GetCloudFrontOriginAccessIdentityResult>;
export interface GetContinuousDeploymentPolicyResult {
  ContinuousDeploymentPolicy?: ContinuousDeploymentPolicy;
  ETag?: string;
}
export const GetContinuousDeploymentPolicyResult = S.suspend(() =>
  S.Struct({
    ContinuousDeploymentPolicy: S.optional(ContinuousDeploymentPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ContinuousDeploymentPolicy" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetContinuousDeploymentPolicyResult",
}) as any as S.Schema<GetContinuousDeploymentPolicyResult>;
export interface GetFieldLevelEncryptionResult {
  FieldLevelEncryption?: FieldLevelEncryption;
  ETag?: string;
}
export const GetFieldLevelEncryptionResult = S.suspend(() =>
  S.Struct({
    FieldLevelEncryption: S.optional(FieldLevelEncryption)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FieldLevelEncryption" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetFieldLevelEncryptionResult",
}) as any as S.Schema<GetFieldLevelEncryptionResult>;
export interface GetFieldLevelEncryptionProfileResult {
  FieldLevelEncryptionProfile?: FieldLevelEncryptionProfile;
  ETag?: string;
}
export const GetFieldLevelEncryptionProfileResult = S.suspend(() =>
  S.Struct({
    FieldLevelEncryptionProfile: S.optional(FieldLevelEncryptionProfile)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FieldLevelEncryptionProfile" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetFieldLevelEncryptionProfileResult",
}) as any as S.Schema<GetFieldLevelEncryptionProfileResult>;
export interface GetKeyGroupResult {
  KeyGroup?: KeyGroup;
  ETag?: string;
}
export const GetKeyGroupResult = S.suspend(() =>
  S.Struct({
    KeyGroup: S.optional(KeyGroup)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "KeyGroup" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetKeyGroupResult",
}) as any as S.Schema<GetKeyGroupResult>;
export interface GetOriginAccessControlResult {
  OriginAccessControl?: OriginAccessControl;
  ETag?: string;
}
export const GetOriginAccessControlResult = S.suspend(() =>
  S.Struct({
    OriginAccessControl: S.optional(OriginAccessControl)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "OriginAccessControl" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetOriginAccessControlResult",
}) as any as S.Schema<GetOriginAccessControlResult>;
export interface GetOriginRequestPolicyResult {
  OriginRequestPolicy?: OriginRequestPolicy;
  ETag?: string;
}
export const GetOriginRequestPolicyResult = S.suspend(() =>
  S.Struct({
    OriginRequestPolicy: S.optional(OriginRequestPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "OriginRequestPolicy" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetOriginRequestPolicyResult",
}) as any as S.Schema<GetOriginRequestPolicyResult>;
export interface GetPublicKeyResult {
  PublicKey?: PublicKey;
  ETag?: string;
}
export const GetPublicKeyResult = S.suspend(() =>
  S.Struct({
    PublicKey: S.optional(PublicKey)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "PublicKey" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetPublicKeyResult",
}) as any as S.Schema<GetPublicKeyResult>;
export interface GetRealtimeLogConfigResult {
  RealtimeLogConfig?: RealtimeLogConfig;
}
export const GetRealtimeLogConfigResult = S.suspend(() =>
  S.Struct({ RealtimeLogConfig: S.optional(RealtimeLogConfig) }).pipe(ns),
).annotations({
  identifier: "GetRealtimeLogConfigResult",
}) as any as S.Schema<GetRealtimeLogConfigResult>;
export interface GetResponseHeadersPolicyResult {
  ResponseHeadersPolicy?: ResponseHeadersPolicy;
  ETag?: string;
}
export const GetResponseHeadersPolicyResult = S.suspend(() =>
  S.Struct({
    ResponseHeadersPolicy: S.optional(ResponseHeadersPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ResponseHeadersPolicy" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetResponseHeadersPolicyResult",
}) as any as S.Schema<GetResponseHeadersPolicyResult>;
export interface GetStreamingDistributionResult {
  StreamingDistribution?: StreamingDistribution;
  ETag?: string;
}
export const GetStreamingDistributionResult = S.suspend(() =>
  S.Struct({
    StreamingDistribution: S.optional(StreamingDistribution)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "StreamingDistribution" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetStreamingDistributionResult",
}) as any as S.Schema<GetStreamingDistributionResult>;
export interface GetTrustStoreResult {
  TrustStore?: TrustStore;
  ETag?: string;
}
export const GetTrustStoreResult = S.suspend(() =>
  S.Struct({
    TrustStore: S.optional(TrustStore)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "TrustStore" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetTrustStoreResult",
}) as any as S.Schema<GetTrustStoreResult>;
export interface ListDistributionsByCachePolicyIdResult {
  DistributionIdList?: DistributionIdList;
}
export const ListDistributionsByCachePolicyIdResult = S.suspend(() =>
  S.Struct({
    DistributionIdList: S.optional(DistributionIdList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionIdList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByCachePolicyIdResult",
}) as any as S.Schema<ListDistributionsByCachePolicyIdResult>;
export interface ListDistributionTenantsResult {
  NextMarker?: string;
  DistributionTenantList?: DistributionTenantSummary[];
}
export const ListDistributionTenantsResult = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    DistributionTenantList: S.optional(DistributionTenantList),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionTenantsResult",
}) as any as S.Schema<ListDistributionTenantsResult>;
export interface ListDistributionTenantsByCustomizationResult {
  NextMarker?: string;
  DistributionTenantList?: DistributionTenantSummary[];
}
export const ListDistributionTenantsByCustomizationResult = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    DistributionTenantList: S.optional(DistributionTenantList),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionTenantsByCustomizationResult",
}) as any as S.Schema<ListDistributionTenantsByCustomizationResult>;
export interface ListFunctionsResult {
  FunctionList?: FunctionList;
}
export const ListFunctionsResult = S.suspend(() =>
  S.Struct({
    FunctionList: S.optional(FunctionList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FunctionList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListFunctionsResult",
}) as any as S.Schema<ListFunctionsResult>;
export interface ListKeyValueStoresResult {
  KeyValueStoreList?: KeyValueStoreList;
}
export const ListKeyValueStoresResult = S.suspend(() =>
  S.Struct({
    KeyValueStoreList: S.optional(KeyValueStoreList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "KeyValueStoreList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListKeyValueStoresResult",
}) as any as S.Schema<ListKeyValueStoresResult>;
export interface ListRealtimeLogConfigsResult {
  RealtimeLogConfigs?: RealtimeLogConfigs;
}
export const ListRealtimeLogConfigsResult = S.suspend(() =>
  S.Struct({
    RealtimeLogConfigs: S.optional(RealtimeLogConfigs)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "RealtimeLogConfigs" }),
  }).pipe(ns),
).annotations({
  identifier: "ListRealtimeLogConfigsResult",
}) as any as S.Schema<ListRealtimeLogConfigsResult>;
export interface ListTrustStoresResult {
  NextMarker?: string;
  TrustStoreList?: TrustStoreSummary[];
}
export const ListTrustStoresResult = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    TrustStoreList: S.optional(TrustStoreList),
  }).pipe(ns),
).annotations({
  identifier: "ListTrustStoresResult",
}) as any as S.Schema<ListTrustStoresResult>;
export interface TestConnectionFunctionResult {
  ConnectionFunctionTestResult?: ConnectionFunctionTestResult;
}
export const TestConnectionFunctionResult = S.suspend(() =>
  S.Struct({
    ConnectionFunctionTestResult: S.optional(ConnectionFunctionTestResult)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ConnectionFunctionTestResult" }),
  }).pipe(ns),
).annotations({
  identifier: "TestConnectionFunctionResult",
}) as any as S.Schema<TestConnectionFunctionResult>;
export interface TestFunctionResult {
  TestResult?: TestResult;
}
export const TestFunctionResult = S.suspend(() =>
  S.Struct({
    TestResult: S.optional(TestResult)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "TestResult" }),
  }).pipe(ns),
).annotations({
  identifier: "TestFunctionResult",
}) as any as S.Schema<TestFunctionResult>;
export interface VerifyDnsConfigurationResult {
  DnsConfigurationList?: DnsConfiguration[];
}
export const VerifyDnsConfigurationResult = S.suspend(() =>
  S.Struct({ DnsConfigurationList: S.optional(DnsConfigurationList) }).pipe(ns),
).annotations({
  identifier: "VerifyDnsConfigurationResult",
}) as any as S.Schema<VerifyDnsConfigurationResult>;
export interface ValidationTokenDetail {
  Domain: string;
  RedirectTo?: string;
  RedirectFrom?: string;
}
export const ValidationTokenDetail = S.suspend(() =>
  S.Struct({
    Domain: S.String,
    RedirectTo: S.optional(S.String),
    RedirectFrom: S.optional(S.String),
  }),
).annotations({
  identifier: "ValidationTokenDetail",
}) as any as S.Schema<ValidationTokenDetail>;
export type ValidationTokenDetailList = ValidationTokenDetail[];
export const ValidationTokenDetailList = S.Array(ValidationTokenDetail);
export interface AnycastIpListSummary {
  Id: string;
  Name: string;
  Status: string;
  Arn: string;
  IpCount: number;
  LastModifiedTime: Date;
  IpAddressType?: IpAddressType;
  ETag?: string;
  IpamConfig?: IpamConfig;
}
export const AnycastIpListSummary = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Name: S.String,
    Status: S.String,
    Arn: S.String,
    IpCount: S.Number,
    LastModifiedTime: S.Date,
    IpAddressType: S.optional(IpAddressType),
    ETag: S.optional(S.String),
    IpamConfig: S.optional(IpamConfig),
  }),
).annotations({
  identifier: "AnycastIpListSummary",
}) as any as S.Schema<AnycastIpListSummary>;
export type AnycastIpListSummaries = AnycastIpListSummary[];
export const AnycastIpListSummaries = S.Array(
  AnycastIpListSummary.pipe(T.XmlName("AnycastIpListSummary")).annotations({
    identifier: "AnycastIpListSummary",
  }),
);
export interface CachePolicySummary {
  Type: CachePolicyType;
  CachePolicy: CachePolicy;
}
export const CachePolicySummary = S.suspend(() =>
  S.Struct({ Type: CachePolicyType, CachePolicy: CachePolicy }),
).annotations({
  identifier: "CachePolicySummary",
}) as any as S.Schema<CachePolicySummary>;
export type CachePolicySummaryList = CachePolicySummary[];
export const CachePolicySummaryList = S.Array(
  CachePolicySummary.pipe(T.XmlName("CachePolicySummary")).annotations({
    identifier: "CachePolicySummary",
  }),
);
export interface CloudFrontOriginAccessIdentitySummary {
  Id: string;
  S3CanonicalUserId: string;
  Comment: string;
}
export const CloudFrontOriginAccessIdentitySummary = S.suspend(() =>
  S.Struct({ Id: S.String, S3CanonicalUserId: S.String, Comment: S.String }),
).annotations({
  identifier: "CloudFrontOriginAccessIdentitySummary",
}) as any as S.Schema<CloudFrontOriginAccessIdentitySummary>;
export type CloudFrontOriginAccessIdentitySummaryList =
  CloudFrontOriginAccessIdentitySummary[];
export const CloudFrontOriginAccessIdentitySummaryList = S.Array(
  CloudFrontOriginAccessIdentitySummary.pipe(
    T.XmlName("CloudFrontOriginAccessIdentitySummary"),
  ).annotations({ identifier: "CloudFrontOriginAccessIdentitySummary" }),
);
export interface ConflictingAlias {
  Alias?: string;
  DistributionId?: string;
  AccountId?: string;
}
export const ConflictingAlias = S.suspend(() =>
  S.Struct({
    Alias: S.optional(S.String),
    DistributionId: S.optional(S.String),
    AccountId: S.optional(S.String),
  }),
).annotations({
  identifier: "ConflictingAlias",
}) as any as S.Schema<ConflictingAlias>;
export type ConflictingAliases = ConflictingAlias[];
export const ConflictingAliases = S.Array(
  ConflictingAlias.pipe(T.XmlName("ConflictingAlias")).annotations({
    identifier: "ConflictingAlias",
  }),
);
export interface ContinuousDeploymentPolicySummary {
  ContinuousDeploymentPolicy: ContinuousDeploymentPolicy;
}
export const ContinuousDeploymentPolicySummary = S.suspend(() =>
  S.Struct({ ContinuousDeploymentPolicy: ContinuousDeploymentPolicy }),
).annotations({
  identifier: "ContinuousDeploymentPolicySummary",
}) as any as S.Schema<ContinuousDeploymentPolicySummary>;
export type ContinuousDeploymentPolicySummaryList =
  ContinuousDeploymentPolicySummary[];
export const ContinuousDeploymentPolicySummaryList = S.Array(
  ContinuousDeploymentPolicySummary.pipe(
    T.XmlName("ContinuousDeploymentPolicySummary"),
  ).annotations({ identifier: "ContinuousDeploymentPolicySummary" }),
);
export interface DistributionIdOwner {
  DistributionId: string;
  OwnerAccountId: string;
}
export const DistributionIdOwner = S.suspend(() =>
  S.Struct({ DistributionId: S.String, OwnerAccountId: S.String }),
).annotations({
  identifier: "DistributionIdOwner",
}) as any as S.Schema<DistributionIdOwner>;
export type DistributionIdOwnerItemList = DistributionIdOwner[];
export const DistributionIdOwnerItemList = S.Array(
  DistributionIdOwner.pipe(T.XmlName("DistributionIdOwner")).annotations({
    identifier: "DistributionIdOwner",
  }),
);
export type DistributionResourceType =
  | "distribution"
  | "distribution-tenant"
  | (string & {});
export const DistributionResourceType = S.String;
export interface FieldLevelEncryptionSummary {
  Id: string;
  LastModifiedTime: Date;
  Comment?: string;
  QueryArgProfileConfig?: QueryArgProfileConfig;
  ContentTypeProfileConfig?: ContentTypeProfileConfig;
}
export const FieldLevelEncryptionSummary = S.suspend(() =>
  S.Struct({
    Id: S.String,
    LastModifiedTime: S.Date,
    Comment: S.optional(S.String),
    QueryArgProfileConfig: S.optional(QueryArgProfileConfig),
    ContentTypeProfileConfig: S.optional(ContentTypeProfileConfig),
  }),
).annotations({
  identifier: "FieldLevelEncryptionSummary",
}) as any as S.Schema<FieldLevelEncryptionSummary>;
export type FieldLevelEncryptionSummaryList = FieldLevelEncryptionSummary[];
export const FieldLevelEncryptionSummaryList = S.Array(
  FieldLevelEncryptionSummary.pipe(
    T.XmlName("FieldLevelEncryptionSummary"),
  ).annotations({ identifier: "FieldLevelEncryptionSummary" }),
);
export interface FieldLevelEncryptionProfileSummary {
  Id: string;
  LastModifiedTime: Date;
  Name: string;
  EncryptionEntities: EncryptionEntities;
  Comment?: string;
}
export const FieldLevelEncryptionProfileSummary = S.suspend(() =>
  S.Struct({
    Id: S.String,
    LastModifiedTime: S.Date,
    Name: S.String,
    EncryptionEntities: EncryptionEntities,
    Comment: S.optional(S.String),
  }),
).annotations({
  identifier: "FieldLevelEncryptionProfileSummary",
}) as any as S.Schema<FieldLevelEncryptionProfileSummary>;
export type FieldLevelEncryptionProfileSummaryList =
  FieldLevelEncryptionProfileSummary[];
export const FieldLevelEncryptionProfileSummaryList = S.Array(
  FieldLevelEncryptionProfileSummary.pipe(
    T.XmlName("FieldLevelEncryptionProfileSummary"),
  ).annotations({ identifier: "FieldLevelEncryptionProfileSummary" }),
);
export interface KeyGroupSummary {
  KeyGroup: KeyGroup;
}
export const KeyGroupSummary = S.suspend(() =>
  S.Struct({ KeyGroup: KeyGroup }),
).annotations({
  identifier: "KeyGroupSummary",
}) as any as S.Schema<KeyGroupSummary>;
export type KeyGroupSummaryList = KeyGroupSummary[];
export const KeyGroupSummaryList = S.Array(
  KeyGroupSummary.pipe(T.XmlName("KeyGroupSummary")).annotations({
    identifier: "KeyGroupSummary",
  }),
);
export interface OriginAccessControlSummary {
  Id: string;
  Description: string;
  Name: string;
  SigningProtocol: OriginAccessControlSigningProtocols;
  SigningBehavior: OriginAccessControlSigningBehaviors;
  OriginAccessControlOriginType: OriginAccessControlOriginTypes;
}
export const OriginAccessControlSummary = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Description: S.String,
    Name: S.String,
    SigningProtocol: OriginAccessControlSigningProtocols,
    SigningBehavior: OriginAccessControlSigningBehaviors,
    OriginAccessControlOriginType: OriginAccessControlOriginTypes,
  }),
).annotations({
  identifier: "OriginAccessControlSummary",
}) as any as S.Schema<OriginAccessControlSummary>;
export type OriginAccessControlSummaryList = OriginAccessControlSummary[];
export const OriginAccessControlSummaryList = S.Array(
  OriginAccessControlSummary.pipe(
    T.XmlName("OriginAccessControlSummary"),
  ).annotations({ identifier: "OriginAccessControlSummary" }),
);
export interface OriginRequestPolicySummary {
  Type: OriginRequestPolicyType;
  OriginRequestPolicy: OriginRequestPolicy;
}
export const OriginRequestPolicySummary = S.suspend(() =>
  S.Struct({
    Type: OriginRequestPolicyType,
    OriginRequestPolicy: OriginRequestPolicy,
  }),
).annotations({
  identifier: "OriginRequestPolicySummary",
}) as any as S.Schema<OriginRequestPolicySummary>;
export type OriginRequestPolicySummaryList = OriginRequestPolicySummary[];
export const OriginRequestPolicySummaryList = S.Array(
  OriginRequestPolicySummary.pipe(
    T.XmlName("OriginRequestPolicySummary"),
  ).annotations({ identifier: "OriginRequestPolicySummary" }),
);
export interface PublicKeySummary {
  Id: string;
  Name: string;
  CreatedTime: Date;
  EncodedKey: string;
  Comment?: string;
}
export const PublicKeySummary = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Name: S.String,
    CreatedTime: S.Date,
    EncodedKey: S.String,
    Comment: S.optional(S.String),
  }),
).annotations({
  identifier: "PublicKeySummary",
}) as any as S.Schema<PublicKeySummary>;
export type PublicKeySummaryList = PublicKeySummary[];
export const PublicKeySummaryList = S.Array(
  PublicKeySummary.pipe(T.XmlName("PublicKeySummary")).annotations({
    identifier: "PublicKeySummary",
  }),
);
export interface ResponseHeadersPolicySummary {
  Type: ResponseHeadersPolicyType;
  ResponseHeadersPolicy: ResponseHeadersPolicy;
}
export const ResponseHeadersPolicySummary = S.suspend(() =>
  S.Struct({
    Type: ResponseHeadersPolicyType,
    ResponseHeadersPolicy: ResponseHeadersPolicy,
  }),
).annotations({
  identifier: "ResponseHeadersPolicySummary",
}) as any as S.Schema<ResponseHeadersPolicySummary>;
export type ResponseHeadersPolicySummaryList = ResponseHeadersPolicySummary[];
export const ResponseHeadersPolicySummaryList = S.Array(
  ResponseHeadersPolicySummary.pipe(
    T.XmlName("ResponseHeadersPolicySummary"),
  ).annotations({ identifier: "ResponseHeadersPolicySummary" }),
);
export interface StreamingDistributionSummary {
  Id: string;
  ARN: string;
  Status: string;
  LastModifiedTime: Date;
  DomainName: string;
  S3Origin: S3Origin;
  Aliases: Aliases;
  TrustedSigners: TrustedSigners;
  Comment: string;
  PriceClass: PriceClass;
  Enabled: boolean;
}
export const StreamingDistributionSummary = S.suspend(() =>
  S.Struct({
    Id: S.String,
    ARN: S.String,
    Status: S.String,
    LastModifiedTime: S.Date,
    DomainName: S.String,
    S3Origin: S3Origin,
    Aliases: Aliases,
    TrustedSigners: TrustedSigners,
    Comment: S.String,
    PriceClass: PriceClass,
    Enabled: S.Boolean,
  }),
).annotations({
  identifier: "StreamingDistributionSummary",
}) as any as S.Schema<StreamingDistributionSummary>;
export type StreamingDistributionSummaryList = StreamingDistributionSummary[];
export const StreamingDistributionSummaryList = S.Array(
  StreamingDistributionSummary.pipe(
    T.XmlName("StreamingDistributionSummary"),
  ).annotations({ identifier: "StreamingDistributionSummary" }),
);
export interface VpcOriginSummary {
  Id: string;
  Name: string;
  Status: string;
  CreatedTime: Date;
  LastModifiedTime: Date;
  Arn: string;
  AccountId?: string;
  OriginEndpointArn: string;
}
export const VpcOriginSummary = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Name: S.String,
    Status: S.String,
    CreatedTime: S.Date,
    LastModifiedTime: S.Date,
    Arn: S.String,
    AccountId: S.optional(S.String),
    OriginEndpointArn: S.String,
  }),
).annotations({
  identifier: "VpcOriginSummary",
}) as any as S.Schema<VpcOriginSummary>;
export type VpcOriginSummaryList = VpcOriginSummary[];
export const VpcOriginSummaryList = S.Array(
  VpcOriginSummary.pipe(T.XmlName("VpcOriginSummary")).annotations({
    identifier: "VpcOriginSummary",
  }),
);
export interface ManagedCertificateDetails {
  CertificateArn?: string;
  CertificateStatus?: ManagedCertificateStatus;
  ValidationTokenHost?: ValidationTokenHost;
  ValidationTokenDetails?: ValidationTokenDetail[];
}
export const ManagedCertificateDetails = S.suspend(() =>
  S.Struct({
    CertificateArn: S.optional(S.String),
    CertificateStatus: S.optional(ManagedCertificateStatus),
    ValidationTokenHost: S.optional(ValidationTokenHost),
    ValidationTokenDetails: S.optional(ValidationTokenDetailList),
  }),
).annotations({
  identifier: "ManagedCertificateDetails",
}) as any as S.Schema<ManagedCertificateDetails>;
export interface AnycastIpListCollection {
  Items?: AnycastIpListSummary[];
  Marker?: string;
  NextMarker?: string;
  MaxItems: number;
  IsTruncated: boolean;
  Quantity: number;
}
export const AnycastIpListCollection = S.suspend(() =>
  S.Struct({
    Items: S.optional(AnycastIpListSummaries),
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    IsTruncated: S.Boolean,
    Quantity: S.Number,
  }),
).annotations({
  identifier: "AnycastIpListCollection",
}) as any as S.Schema<AnycastIpListCollection>;
export interface CachePolicyList {
  NextMarker?: string;
  MaxItems: number;
  Quantity: number;
  Items?: CachePolicySummary[];
}
export const CachePolicyList = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    Quantity: S.Number,
    Items: S.optional(CachePolicySummaryList),
  }),
).annotations({
  identifier: "CachePolicyList",
}) as any as S.Schema<CachePolicyList>;
export interface CloudFrontOriginAccessIdentityList {
  Marker?: string;
  NextMarker?: string;
  MaxItems: number;
  IsTruncated: boolean;
  Quantity: number;
  Items?: CloudFrontOriginAccessIdentitySummary[];
}
export const CloudFrontOriginAccessIdentityList = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    IsTruncated: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(CloudFrontOriginAccessIdentitySummaryList),
  }),
).annotations({
  identifier: "CloudFrontOriginAccessIdentityList",
}) as any as S.Schema<CloudFrontOriginAccessIdentityList>;
export interface ConflictingAliasesList {
  NextMarker?: string;
  MaxItems?: number;
  Quantity?: number;
  Items?: ConflictingAlias[];
}
export const ConflictingAliasesList = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Quantity: S.optional(S.Number),
    Items: S.optional(ConflictingAliases),
  }),
).annotations({
  identifier: "ConflictingAliasesList",
}) as any as S.Schema<ConflictingAliasesList>;
export interface ConnectionGroupSummary {
  Id: string;
  Name: string;
  Arn: string;
  RoutingEndpoint: string;
  CreatedTime: Date;
  LastModifiedTime: Date;
  ETag: string;
  AnycastIpListId?: string;
  Enabled?: boolean;
  Status?: string;
  IsDefault?: boolean;
}
export const ConnectionGroupSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ConnectionGroupSummary",
}) as any as S.Schema<ConnectionGroupSummary>;
export type ConnectionGroupSummaryList = ConnectionGroupSummary[];
export const ConnectionGroupSummaryList = S.Array(
  ConnectionGroupSummary.pipe(T.XmlName("ConnectionGroupSummary")).annotations({
    identifier: "ConnectionGroupSummary",
  }),
);
export interface ContinuousDeploymentPolicyList {
  NextMarker?: string;
  MaxItems: number;
  Quantity: number;
  Items?: ContinuousDeploymentPolicySummary[];
}
export const ContinuousDeploymentPolicyList = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    Quantity: S.Number,
    Items: S.optional(ContinuousDeploymentPolicySummaryList),
  }),
).annotations({
  identifier: "ContinuousDeploymentPolicyList",
}) as any as S.Schema<ContinuousDeploymentPolicyList>;
export interface DistributionIdOwnerList {
  Marker?: string;
  NextMarker?: string;
  MaxItems: number;
  IsTruncated: boolean;
  Quantity: number;
  Items?: DistributionIdOwner[];
}
export const DistributionIdOwnerList = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    IsTruncated: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(DistributionIdOwnerItemList),
  }),
).annotations({
  identifier: "DistributionIdOwnerList",
}) as any as S.Schema<DistributionIdOwnerList>;
export interface DomainConflict {
  Domain: string;
  ResourceType: DistributionResourceType;
  ResourceId: string;
  AccountId: string;
}
export const DomainConflict = S.suspend(() =>
  S.Struct({
    Domain: S.String,
    ResourceType: DistributionResourceType,
    ResourceId: S.String,
    AccountId: S.String,
  }),
).annotations({
  identifier: "DomainConflict",
}) as any as S.Schema<DomainConflict>;
export type DomainConflictsList = DomainConflict[];
export const DomainConflictsList = S.Array(
  DomainConflict.pipe(T.XmlName("DomainConflicts")).annotations({
    identifier: "DomainConflict",
  }),
);
export interface FieldLevelEncryptionList {
  NextMarker?: string;
  MaxItems: number;
  Quantity: number;
  Items?: FieldLevelEncryptionSummary[];
}
export const FieldLevelEncryptionList = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    Quantity: S.Number,
    Items: S.optional(FieldLevelEncryptionSummaryList),
  }),
).annotations({
  identifier: "FieldLevelEncryptionList",
}) as any as S.Schema<FieldLevelEncryptionList>;
export interface FieldLevelEncryptionProfileList {
  NextMarker?: string;
  MaxItems: number;
  Quantity: number;
  Items?: FieldLevelEncryptionProfileSummary[];
}
export const FieldLevelEncryptionProfileList = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    Quantity: S.Number,
    Items: S.optional(FieldLevelEncryptionProfileSummaryList),
  }),
).annotations({
  identifier: "FieldLevelEncryptionProfileList",
}) as any as S.Schema<FieldLevelEncryptionProfileList>;
export interface KeyGroupList {
  NextMarker?: string;
  MaxItems: number;
  Quantity: number;
  Items?: KeyGroupSummary[];
}
export const KeyGroupList = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    Quantity: S.Number,
    Items: S.optional(KeyGroupSummaryList),
  }),
).annotations({ identifier: "KeyGroupList" }) as any as S.Schema<KeyGroupList>;
export interface OriginAccessControlList {
  Marker?: string;
  NextMarker?: string;
  MaxItems: number;
  IsTruncated: boolean;
  Quantity: number;
  Items?: OriginAccessControlSummary[];
}
export const OriginAccessControlList = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    IsTruncated: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(OriginAccessControlSummaryList),
  }),
).annotations({
  identifier: "OriginAccessControlList",
}) as any as S.Schema<OriginAccessControlList>;
export interface OriginRequestPolicyList {
  NextMarker?: string;
  MaxItems: number;
  Quantity: number;
  Items?: OriginRequestPolicySummary[];
}
export const OriginRequestPolicyList = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    Quantity: S.Number,
    Items: S.optional(OriginRequestPolicySummaryList),
  }),
).annotations({
  identifier: "OriginRequestPolicyList",
}) as any as S.Schema<OriginRequestPolicyList>;
export interface PublicKeyList {
  NextMarker?: string;
  MaxItems: number;
  Quantity: number;
  Items?: PublicKeySummary[];
}
export const PublicKeyList = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    Quantity: S.Number,
    Items: S.optional(PublicKeySummaryList),
  }),
).annotations({
  identifier: "PublicKeyList",
}) as any as S.Schema<PublicKeyList>;
export interface ResponseHeadersPolicyList {
  NextMarker?: string;
  MaxItems: number;
  Quantity: number;
  Items?: ResponseHeadersPolicySummary[];
}
export const ResponseHeadersPolicyList = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    Quantity: S.Number,
    Items: S.optional(ResponseHeadersPolicySummaryList),
  }),
).annotations({
  identifier: "ResponseHeadersPolicyList",
}) as any as S.Schema<ResponseHeadersPolicyList>;
export interface StreamingDistributionList {
  Marker?: string;
  NextMarker?: string;
  MaxItems: number;
  IsTruncated: boolean;
  Quantity: number;
  Items?: StreamingDistributionSummary[];
}
export const StreamingDistributionList = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    IsTruncated: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(StreamingDistributionSummaryList),
  }),
).annotations({
  identifier: "StreamingDistributionList",
}) as any as S.Schema<StreamingDistributionList>;
export interface VpcOriginList {
  Marker?: string;
  NextMarker?: string;
  MaxItems: number;
  IsTruncated: boolean;
  Quantity: number;
  Items?: VpcOriginSummary[];
}
export const VpcOriginList = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
    IsTruncated: S.Boolean,
    Quantity: S.Number,
    Items: S.optional(VpcOriginSummaryList),
  }),
).annotations({
  identifier: "VpcOriginList",
}) as any as S.Schema<VpcOriginList>;
export interface CreateAnycastIpListResult {
  AnycastIpList?: AnycastIpList;
  ETag?: string;
}
export const CreateAnycastIpListResult = S.suspend(() =>
  S.Struct({
    AnycastIpList: S.optional(AnycastIpList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "AnycastIpList" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateAnycastIpListResult",
}) as any as S.Schema<CreateAnycastIpListResult>;
export interface CreateCachePolicyRequest {
  CachePolicyConfig: CachePolicyConfig;
}
export const CreateCachePolicyRequest = S.suspend(() =>
  S.Struct({
    CachePolicyConfig: CachePolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("CachePolicyConfig"),
    ).annotations({ identifier: "CachePolicyConfig" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/cache-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCachePolicyRequest",
}) as any as S.Schema<CreateCachePolicyRequest>;
export interface CreateConnectionFunctionRequest {
  Name: string;
  ConnectionFunctionConfig: FunctionConfig;
  ConnectionFunctionCode: Uint8Array | redacted.Redacted<Uint8Array>;
  Tags?: Tags;
}
export const CreateConnectionFunctionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ConnectionFunctionConfig: FunctionConfig,
    ConnectionFunctionCode: SensitiveBlob,
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/connection-function" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectionFunctionRequest",
}) as any as S.Schema<CreateConnectionFunctionRequest>;
export interface CreateDistributionTenantResult {
  DistributionTenant?: DistributionTenant;
  ETag?: string;
}
export const CreateDistributionTenantResult = S.suspend(() =>
  S.Struct({
    DistributionTenant: S.optional(DistributionTenant)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionTenant" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateDistributionTenantResult",
}) as any as S.Schema<CreateDistributionTenantResult>;
export interface CreateFunctionResult {
  FunctionSummary?: FunctionSummary;
  Location?: string;
  ETag?: string;
}
export const CreateFunctionResult = S.suspend(() =>
  S.Struct({
    FunctionSummary: S.optional(FunctionSummary)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FunctionSummary" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateFunctionResult",
}) as any as S.Schema<CreateFunctionResult>;
export interface CreateInvalidationResult {
  Location?: string;
  Invalidation?: Invalidation;
}
export const CreateInvalidationResult = S.suspend(() =>
  S.Struct({
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    Invalidation: S.optional(Invalidation)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Invalidation" }),
  }).pipe(ns),
).annotations({
  identifier: "CreateInvalidationResult",
}) as any as S.Schema<CreateInvalidationResult>;
export interface CreateMonitoringSubscriptionResult {
  MonitoringSubscription?: MonitoringSubscription;
}
export const CreateMonitoringSubscriptionResult = S.suspend(() =>
  S.Struct({
    MonitoringSubscription: S.optional(MonitoringSubscription)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MonitoringSubscription" }),
  }).pipe(ns),
).annotations({
  identifier: "CreateMonitoringSubscriptionResult",
}) as any as S.Schema<CreateMonitoringSubscriptionResult>;
export interface CreateOriginRequestPolicyRequest {
  OriginRequestPolicyConfig: OriginRequestPolicyConfig;
}
export const CreateOriginRequestPolicyRequest = S.suspend(() =>
  S.Struct({
    OriginRequestPolicyConfig: OriginRequestPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("OriginRequestPolicyConfig"),
    ).annotations({ identifier: "OriginRequestPolicyConfig" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/origin-request-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOriginRequestPolicyRequest",
}) as any as S.Schema<CreateOriginRequestPolicyRequest>;
export interface CreateRealtimeLogConfigResult {
  RealtimeLogConfig?: RealtimeLogConfig;
}
export const CreateRealtimeLogConfigResult = S.suspend(() =>
  S.Struct({ RealtimeLogConfig: S.optional(RealtimeLogConfig) }).pipe(ns),
).annotations({
  identifier: "CreateRealtimeLogConfigResult",
}) as any as S.Schema<CreateRealtimeLogConfigResult>;
export interface CreateResponseHeadersPolicyRequest {
  ResponseHeadersPolicyConfig: ResponseHeadersPolicyConfig;
}
export const CreateResponseHeadersPolicyRequest = S.suspend(() =>
  S.Struct({
    ResponseHeadersPolicyConfig: ResponseHeadersPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("ResponseHeadersPolicyConfig"),
    ).annotations({ identifier: "ResponseHeadersPolicyConfig" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/response-headers-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResponseHeadersPolicyRequest",
}) as any as S.Schema<CreateResponseHeadersPolicyRequest>;
export interface CreateStreamingDistributionResult {
  StreamingDistribution?: StreamingDistribution;
  Location?: string;
  ETag?: string;
}
export const CreateStreamingDistributionResult = S.suspend(() =>
  S.Struct({
    StreamingDistribution: S.optional(StreamingDistribution)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "StreamingDistribution" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateStreamingDistributionResult",
}) as any as S.Schema<CreateStreamingDistributionResult>;
export interface CreateTrustStoreResult {
  TrustStore?: TrustStore;
  ETag?: string;
}
export const CreateTrustStoreResult = S.suspend(() =>
  S.Struct({
    TrustStore: S.optional(TrustStore)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "TrustStore" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateTrustStoreResult",
}) as any as S.Schema<CreateTrustStoreResult>;
export interface CreateVpcOriginResult {
  VpcOrigin?: VpcOrigin;
  Location?: string;
  ETag?: string;
}
export const CreateVpcOriginResult = S.suspend(() =>
  S.Struct({
    VpcOrigin: S.optional(VpcOrigin)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VpcOrigin" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateVpcOriginResult",
}) as any as S.Schema<CreateVpcOriginResult>;
export interface GetAnycastIpListResult {
  AnycastIpList?: AnycastIpList;
  ETag?: string;
}
export const GetAnycastIpListResult = S.suspend(() =>
  S.Struct({
    AnycastIpList: S.optional(AnycastIpList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "AnycastIpList" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetAnycastIpListResult",
}) as any as S.Schema<GetAnycastIpListResult>;
export interface GetDistributionTenantResult {
  DistributionTenant?: DistributionTenant;
  ETag?: string;
}
export const GetDistributionTenantResult = S.suspend(() =>
  S.Struct({
    DistributionTenant: S.optional(DistributionTenant)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionTenant" }),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "GetDistributionTenantResult",
}) as any as S.Schema<GetDistributionTenantResult>;
export interface GetManagedCertificateDetailsResult {
  ManagedCertificateDetails?: ManagedCertificateDetails;
}
export const GetManagedCertificateDetailsResult = S.suspend(() =>
  S.Struct({
    ManagedCertificateDetails: S.optional(ManagedCertificateDetails)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ManagedCertificateDetails" }),
  }).pipe(ns),
).annotations({
  identifier: "GetManagedCertificateDetailsResult",
}) as any as S.Schema<GetManagedCertificateDetailsResult>;
export interface ListAnycastIpListsResult {
  AnycastIpLists?: AnycastIpListCollection;
}
export const ListAnycastIpListsResult = S.suspend(() =>
  S.Struct({
    AnycastIpLists: S.optional(AnycastIpListCollection)
      .pipe(T.HttpPayload(), T.XmlName("AnycastIpListCollection"))
      .annotations({ identifier: "AnycastIpListCollection" }),
  }).pipe(ns),
).annotations({
  identifier: "ListAnycastIpListsResult",
}) as any as S.Schema<ListAnycastIpListsResult>;
export interface ListCachePoliciesResult {
  CachePolicyList?: CachePolicyList;
}
export const ListCachePoliciesResult = S.suspend(() =>
  S.Struct({
    CachePolicyList: S.optional(CachePolicyList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CachePolicyList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListCachePoliciesResult",
}) as any as S.Schema<ListCachePoliciesResult>;
export interface ListCloudFrontOriginAccessIdentitiesResult {
  CloudFrontOriginAccessIdentityList?: CloudFrontOriginAccessIdentityList;
}
export const ListCloudFrontOriginAccessIdentitiesResult = S.suspend(() =>
  S.Struct({
    CloudFrontOriginAccessIdentityList: S.optional(
      CloudFrontOriginAccessIdentityList,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CloudFrontOriginAccessIdentityList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListCloudFrontOriginAccessIdentitiesResult",
}) as any as S.Schema<ListCloudFrontOriginAccessIdentitiesResult>;
export interface ListConflictingAliasesResult {
  ConflictingAliasesList?: ConflictingAliasesList;
}
export const ListConflictingAliasesResult = S.suspend(() =>
  S.Struct({
    ConflictingAliasesList: S.optional(ConflictingAliasesList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ConflictingAliasesList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListConflictingAliasesResult",
}) as any as S.Schema<ListConflictingAliasesResult>;
export interface ListConnectionGroupsResult {
  NextMarker?: string;
  ConnectionGroups?: ConnectionGroupSummary[];
}
export const ListConnectionGroupsResult = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    ConnectionGroups: S.optional(ConnectionGroupSummaryList),
  }).pipe(ns),
).annotations({
  identifier: "ListConnectionGroupsResult",
}) as any as S.Schema<ListConnectionGroupsResult>;
export interface ListContinuousDeploymentPoliciesResult {
  ContinuousDeploymentPolicyList?: ContinuousDeploymentPolicyList;
}
export const ListContinuousDeploymentPoliciesResult = S.suspend(() =>
  S.Struct({
    ContinuousDeploymentPolicyList: S.optional(ContinuousDeploymentPolicyList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ContinuousDeploymentPolicyList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListContinuousDeploymentPoliciesResult",
}) as any as S.Schema<ListContinuousDeploymentPoliciesResult>;
export interface ListDistributionsResult {
  DistributionList?: DistributionList;
}
export const ListDistributionsResult = S.suspend(() =>
  S.Struct({
    DistributionList: S.optional(DistributionList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsResult",
}) as any as S.Schema<ListDistributionsResult>;
export interface ListDistributionsByOwnedResourceResult {
  DistributionList?: DistributionIdOwnerList;
}
export const ListDistributionsByOwnedResourceResult = S.suspend(() =>
  S.Struct({
    DistributionList: S.optional(DistributionIdOwnerList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "DistributionIdOwnerList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributionsByOwnedResourceResult",
}) as any as S.Schema<ListDistributionsByOwnedResourceResult>;
export interface ListDomainConflictsResult {
  DomainConflicts?: DomainConflict[];
  NextMarker?: string;
}
export const ListDomainConflictsResult = S.suspend(() =>
  S.Struct({
    DomainConflicts: S.optional(DomainConflictsList),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDomainConflictsResult",
}) as any as S.Schema<ListDomainConflictsResult>;
export interface ListFieldLevelEncryptionConfigsResult {
  FieldLevelEncryptionList?: FieldLevelEncryptionList;
}
export const ListFieldLevelEncryptionConfigsResult = S.suspend(() =>
  S.Struct({
    FieldLevelEncryptionList: S.optional(FieldLevelEncryptionList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FieldLevelEncryptionList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListFieldLevelEncryptionConfigsResult",
}) as any as S.Schema<ListFieldLevelEncryptionConfigsResult>;
export interface ListFieldLevelEncryptionProfilesResult {
  FieldLevelEncryptionProfileList?: FieldLevelEncryptionProfileList;
}
export const ListFieldLevelEncryptionProfilesResult = S.suspend(() =>
  S.Struct({
    FieldLevelEncryptionProfileList: S.optional(FieldLevelEncryptionProfileList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FieldLevelEncryptionProfileList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListFieldLevelEncryptionProfilesResult",
}) as any as S.Schema<ListFieldLevelEncryptionProfilesResult>;
export interface ListInvalidationsResult {
  InvalidationList?: InvalidationList;
}
export const ListInvalidationsResult = S.suspend(() =>
  S.Struct({
    InvalidationList: S.optional(InvalidationList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "InvalidationList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListInvalidationsResult",
}) as any as S.Schema<ListInvalidationsResult>;
export interface ListKeyGroupsResult {
  KeyGroupList?: KeyGroupList;
}
export const ListKeyGroupsResult = S.suspend(() =>
  S.Struct({
    KeyGroupList: S.optional(KeyGroupList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "KeyGroupList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListKeyGroupsResult",
}) as any as S.Schema<ListKeyGroupsResult>;
export interface ListOriginAccessControlsResult {
  OriginAccessControlList?: OriginAccessControlList;
}
export const ListOriginAccessControlsResult = S.suspend(() =>
  S.Struct({
    OriginAccessControlList: S.optional(OriginAccessControlList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "OriginAccessControlList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListOriginAccessControlsResult",
}) as any as S.Schema<ListOriginAccessControlsResult>;
export interface ListOriginRequestPoliciesResult {
  OriginRequestPolicyList?: OriginRequestPolicyList;
}
export const ListOriginRequestPoliciesResult = S.suspend(() =>
  S.Struct({
    OriginRequestPolicyList: S.optional(OriginRequestPolicyList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "OriginRequestPolicyList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListOriginRequestPoliciesResult",
}) as any as S.Schema<ListOriginRequestPoliciesResult>;
export interface ListPublicKeysResult {
  PublicKeyList?: PublicKeyList;
}
export const ListPublicKeysResult = S.suspend(() =>
  S.Struct({
    PublicKeyList: S.optional(PublicKeyList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "PublicKeyList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListPublicKeysResult",
}) as any as S.Schema<ListPublicKeysResult>;
export interface ListResponseHeadersPoliciesResult {
  ResponseHeadersPolicyList?: ResponseHeadersPolicyList;
}
export const ListResponseHeadersPoliciesResult = S.suspend(() =>
  S.Struct({
    ResponseHeadersPolicyList: S.optional(ResponseHeadersPolicyList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ResponseHeadersPolicyList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListResponseHeadersPoliciesResult",
}) as any as S.Schema<ListResponseHeadersPoliciesResult>;
export interface ListStreamingDistributionsResult {
  StreamingDistributionList?: StreamingDistributionList;
}
export const ListStreamingDistributionsResult = S.suspend(() =>
  S.Struct({
    StreamingDistributionList: S.optional(StreamingDistributionList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "StreamingDistributionList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListStreamingDistributionsResult",
}) as any as S.Schema<ListStreamingDistributionsResult>;
export interface ListVpcOriginsResult {
  VpcOriginList?: VpcOriginList;
}
export const ListVpcOriginsResult = S.suspend(() =>
  S.Struct({
    VpcOriginList: S.optional(VpcOriginList)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VpcOriginList" }),
  }).pipe(ns),
).annotations({
  identifier: "ListVpcOriginsResult",
}) as any as S.Schema<ListVpcOriginsResult>;
export interface CreateCachePolicyResult {
  CachePolicy?: CachePolicy;
  Location?: string;
  ETag?: string;
}
export const CreateCachePolicyResult = S.suspend(() =>
  S.Struct({
    CachePolicy: S.optional(CachePolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CachePolicy" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateCachePolicyResult",
}) as any as S.Schema<CreateCachePolicyResult>;
export interface CreateConnectionFunctionResult {
  ConnectionFunctionSummary?: ConnectionFunctionSummary;
  Location?: string;
  ETag?: string;
}
export const CreateConnectionFunctionResult = S.suspend(() =>
  S.Struct({
    ConnectionFunctionSummary: S.optional(ConnectionFunctionSummary)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ConnectionFunctionSummary" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateConnectionFunctionResult",
}) as any as S.Schema<CreateConnectionFunctionResult>;
export interface CreateContinuousDeploymentPolicyRequest {
  ContinuousDeploymentPolicyConfig: ContinuousDeploymentPolicyConfig;
}
export const CreateContinuousDeploymentPolicyRequest = S.suspend(() =>
  S.Struct({
    ContinuousDeploymentPolicyConfig: ContinuousDeploymentPolicyConfig.pipe(
      T.HttpPayload(),
      T.XmlName("ContinuousDeploymentPolicyConfig"),
    ).annotations({ identifier: "ContinuousDeploymentPolicyConfig" }),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2020-05-31/continuous-deployment-policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateContinuousDeploymentPolicyRequest",
}) as any as S.Schema<CreateContinuousDeploymentPolicyRequest>;
export interface CreateFieldLevelEncryptionConfigRequest {
  FieldLevelEncryptionConfig: FieldLevelEncryptionConfig;
}
export const CreateFieldLevelEncryptionConfigRequest = S.suspend(() =>
  S.Struct({
    FieldLevelEncryptionConfig: FieldLevelEncryptionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("FieldLevelEncryptionConfig"),
    ).annotations({ identifier: "FieldLevelEncryptionConfig" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/field-level-encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFieldLevelEncryptionConfigRequest",
}) as any as S.Schema<CreateFieldLevelEncryptionConfigRequest>;
export interface CreateFieldLevelEncryptionProfileRequest {
  FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig;
}
export const CreateFieldLevelEncryptionProfileRequest = S.suspend(() =>
  S.Struct({
    FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig.pipe(
      T.HttpPayload(),
      T.XmlName("FieldLevelEncryptionProfileConfig"),
    ).annotations({ identifier: "FieldLevelEncryptionProfileConfig" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateFieldLevelEncryptionProfileRequest",
}) as any as S.Schema<CreateFieldLevelEncryptionProfileRequest>;
export interface CreateOriginRequestPolicyResult {
  OriginRequestPolicy?: OriginRequestPolicy;
  Location?: string;
  ETag?: string;
}
export const CreateOriginRequestPolicyResult = S.suspend(() =>
  S.Struct({
    OriginRequestPolicy: S.optional(OriginRequestPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "OriginRequestPolicy" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateOriginRequestPolicyResult",
}) as any as S.Schema<CreateOriginRequestPolicyResult>;
export interface CreateResponseHeadersPolicyResult {
  ResponseHeadersPolicy?: ResponseHeadersPolicy;
  Location?: string;
  ETag?: string;
}
export const CreateResponseHeadersPolicyResult = S.suspend(() =>
  S.Struct({
    ResponseHeadersPolicy: S.optional(ResponseHeadersPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ResponseHeadersPolicy" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateResponseHeadersPolicyResult",
}) as any as S.Schema<CreateResponseHeadersPolicyResult>;
export interface CopyDistributionResult {
  Distribution?: Distribution;
  Location?: string;
  ETag?: string;
}
export const CopyDistributionResult = S.suspend(() =>
  S.Struct({
    Distribution: S.optional(Distribution)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Distribution" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CopyDistributionResult",
}) as any as S.Schema<CopyDistributionResult>;
export interface CreateContinuousDeploymentPolicyResult {
  ContinuousDeploymentPolicy?: ContinuousDeploymentPolicy;
  Location?: string;
  ETag?: string;
}
export const CreateContinuousDeploymentPolicyResult = S.suspend(() =>
  S.Struct({
    ContinuousDeploymentPolicy: S.optional(ContinuousDeploymentPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ContinuousDeploymentPolicy" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateContinuousDeploymentPolicyResult",
}) as any as S.Schema<CreateContinuousDeploymentPolicyResult>;
export interface CreateDistributionRequest {
  DistributionConfig: DistributionConfig;
}
export const CreateDistributionRequest = S.suspend(() =>
  S.Struct({
    DistributionConfig: DistributionConfig.pipe(
      T.HttpPayload(),
      T.XmlName("DistributionConfig"),
    ).annotations({ identifier: "DistributionConfig" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2020-05-31/distribution" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDistributionRequest",
}) as any as S.Schema<CreateDistributionRequest>;
export interface CreateFieldLevelEncryptionConfigResult {
  FieldLevelEncryption?: FieldLevelEncryption;
  Location?: string;
  ETag?: string;
}
export const CreateFieldLevelEncryptionConfigResult = S.suspend(() =>
  S.Struct({
    FieldLevelEncryption: S.optional(FieldLevelEncryption)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FieldLevelEncryption" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateFieldLevelEncryptionConfigResult",
}) as any as S.Schema<CreateFieldLevelEncryptionConfigResult>;
export interface CreateFieldLevelEncryptionProfileResult {
  FieldLevelEncryptionProfile?: FieldLevelEncryptionProfile;
  Location?: string;
  ETag?: string;
}
export const CreateFieldLevelEncryptionProfileResult = S.suspend(() =>
  S.Struct({
    FieldLevelEncryptionProfile: S.optional(FieldLevelEncryptionProfile)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "FieldLevelEncryptionProfile" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateFieldLevelEncryptionProfileResult",
}) as any as S.Schema<CreateFieldLevelEncryptionProfileResult>;
export interface CreateDistributionResult {
  Distribution?: Distribution;
  Location?: string;
  ETag?: string;
}
export const CreateDistributionResult = S.suspend(() =>
  S.Struct({
    Distribution: S.optional(Distribution)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "Distribution" }),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }).pipe(ns),
).annotations({
  identifier: "CreateDistributionResult",
}) as any as S.Schema<CreateDistributionResult>;

//# Errors
export class AccessDenied extends S.TaggedError<AccessDenied>()(
  "AccessDenied",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class FunctionInUse extends S.TaggedError<FunctionInUse>()(
  "FunctionInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class InvalidIfMatchVersion extends S.TaggedError<InvalidIfMatchVersion>()(
  "InvalidIfMatchVersion",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class IllegalUpdate extends S.TaggedError<IllegalUpdate>()(
  "IllegalUpdate",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EntityLimitExceeded extends S.TaggedError<EntityLimitExceeded>()(
  "EntityLimitExceeded",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError, C.withThrottlingError) {}
export class NoSuchResource extends S.TaggedError<NoSuchResource>()(
  "NoSuchResource",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchFunctionExists extends S.TaggedError<NoSuchFunctionExists>()(
  "NoSuchFunctionExists",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EntityNotFound extends S.TaggedError<EntityNotFound>()(
  "EntityNotFound",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchCachePolicy extends S.TaggedError<NoSuchCachePolicy>()(
  "NoSuchCachePolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchCloudFrontOriginAccessIdentity extends S.TaggedError<NoSuchCloudFrontOriginAccessIdentity>()(
  "NoSuchCloudFrontOriginAccessIdentity",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchContinuousDeploymentPolicy extends S.TaggedError<NoSuchContinuousDeploymentPolicy>()(
  "NoSuchContinuousDeploymentPolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchDistribution extends S.TaggedError<NoSuchDistribution>()(
  "NoSuchDistribution",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchFieldLevelEncryptionConfig extends S.TaggedError<NoSuchFieldLevelEncryptionConfig>()(
  "NoSuchFieldLevelEncryptionConfig",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchFieldLevelEncryptionProfile extends S.TaggedError<NoSuchFieldLevelEncryptionProfile>()(
  "NoSuchFieldLevelEncryptionProfile",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchOriginAccessControl extends S.TaggedError<NoSuchOriginAccessControl>()(
  "NoSuchOriginAccessControl",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchOriginRequestPolicy extends S.TaggedError<NoSuchOriginRequestPolicy>()(
  "NoSuchOriginRequestPolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchPublicKey extends S.TaggedError<NoSuchPublicKey>()(
  "NoSuchPublicKey",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchResponseHeadersPolicy extends S.TaggedError<NoSuchResponseHeadersPolicy>()(
  "NoSuchResponseHeadersPolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchStreamingDistribution extends S.TaggedError<NoSuchStreamingDistribution>()(
  "NoSuchStreamingDistribution",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidArgument extends S.TaggedError<InvalidArgument>()(
  "InvalidArgument",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CachePolicyAlreadyExists extends S.TaggedError<CachePolicyAlreadyExists>()(
  "CachePolicyAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class EntityAlreadyExists extends S.TaggedError<EntityAlreadyExists>()(
  "EntityAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class InconsistentQuantities extends S.TaggedError<InconsistentQuantities>()(
  "InconsistentQuantities",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CNAMEAlreadyExists extends S.TaggedError<CNAMEAlreadyExists>()(
  "CNAMEAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class FieldLevelEncryptionProfileAlreadyExists extends S.TaggedError<FieldLevelEncryptionProfileAlreadyExists>()(
  "FieldLevelEncryptionProfileAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class FunctionSizeLimitExceeded extends S.TaggedError<FunctionSizeLimitExceeded>()(
  "FunctionSizeLimitExceeded",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError, C.withThrottlingError) {}
export class CannotChangeImmutablePublicKeyFields extends S.TaggedError<CannotChangeImmutablePublicKeyFields>()(
  "CannotChangeImmutablePublicKeyFields",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CannotUpdateEntityWhileInUse extends S.TaggedError<CannotUpdateEntityWhileInUse>()(
  "CannotUpdateEntityWhileInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class CannotDeleteEntityWhileInUse extends S.TaggedError<CannotDeleteEntityWhileInUse>()(
  "CannotDeleteEntityWhileInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class CachePolicyInUse extends S.TaggedError<CachePolicyInUse>()(
  "CachePolicyInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class CloudFrontOriginAccessIdentityInUse extends S.TaggedError<CloudFrontOriginAccessIdentityInUse>()(
  "CloudFrontOriginAccessIdentityInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class ContinuousDeploymentPolicyInUse extends S.TaggedError<ContinuousDeploymentPolicyInUse>()(
  "ContinuousDeploymentPolicyInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class DistributionNotDisabled extends S.TaggedError<DistributionNotDisabled>()(
  "DistributionNotDisabled",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class FieldLevelEncryptionConfigInUse extends S.TaggedError<FieldLevelEncryptionConfigInUse>()(
  "FieldLevelEncryptionConfigInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class FieldLevelEncryptionProfileInUse extends S.TaggedError<FieldLevelEncryptionProfileInUse>()(
  "FieldLevelEncryptionProfileInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class IllegalDelete extends S.TaggedError<IllegalDelete>()(
  "IllegalDelete",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CloudFrontOriginAccessIdentityAlreadyExists extends S.TaggedError<CloudFrontOriginAccessIdentityAlreadyExists>()(
  "CloudFrontOriginAccessIdentityAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class BatchTooLarge extends S.TaggedError<BatchTooLarge>()(
  "BatchTooLarge",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PreconditionFailed extends S.TaggedError<PreconditionFailed>()(
  "PreconditionFailed",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedOperation extends S.TaggedError<UnsupportedOperation>()(
  "UnsupportedOperation",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchRealtimeLogConfig extends S.TaggedError<NoSuchRealtimeLogConfig>()(
  "NoSuchRealtimeLogConfig",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TestFunctionFailed extends S.TaggedError<TestFunctionFailed>()(
  "TestFunctionFailed",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class FieldLevelEncryptionProfileSizeExceeded extends S.TaggedError<FieldLevelEncryptionProfileSizeExceeded>()(
  "FieldLevelEncryptionProfileSizeExceeded",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class OriginRequestPolicyInUse extends S.TaggedError<OriginRequestPolicyInUse>()(
  "OriginRequestPolicyInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class MissingBody extends S.TaggedError<MissingBody>()("MissingBody", {
  Message: S.optional(S.String),
}).pipe(C.withBadRequestError) {}
export class OriginAccessControlAlreadyExists extends S.TaggedError<OriginAccessControlAlreadyExists>()(
  "OriginAccessControlAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class OriginRequestPolicyAlreadyExists extends S.TaggedError<OriginRequestPolicyAlreadyExists>()(
  "OriginRequestPolicyAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class NoSuchInvalidation extends S.TaggedError<NoSuchInvalidation>()(
  "NoSuchInvalidation",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EntitySizeLimitExceeded extends S.TaggedError<EntitySizeLimitExceeded>()(
  "EntitySizeLimitExceeded",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError, C.withThrottlingError) {}
export class NoSuchMonitoringSubscription extends S.TaggedError<NoSuchMonitoringSubscription>()(
  "NoSuchMonitoringSubscription",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class OriginAccessControlInUse extends S.TaggedError<OriginAccessControlInUse>()(
  "OriginAccessControlInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class InvalidWebACLId extends S.TaggedError<InvalidWebACLId>()(
  "InvalidWebACLId",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidTagging extends S.TaggedError<InvalidTagging>()(
  "InvalidTagging",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class KeyGroupAlreadyExists extends S.TaggedError<KeyGroupAlreadyExists>()(
  "KeyGroupAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class TooManyDistributionCNAMEs extends S.TaggedError<TooManyDistributionCNAMEs>()(
  "TooManyDistributionCNAMEs",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PublicKeyAlreadyExists extends S.TaggedError<PublicKeyAlreadyExists>()(
  "PublicKeyAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class InvalidAssociation extends S.TaggedError<InvalidAssociation>()(
  "InvalidAssociation",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior extends S.TaggedError<IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior>()(
  "IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidOriginAccessControl extends S.TaggedError<InvalidOriginAccessControl>()(
  "InvalidOriginAccessControl",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DistributionAlreadyExists extends S.TaggedError<DistributionAlreadyExists>()(
  "DistributionAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class InvalidOrigin extends S.TaggedError<InvalidOrigin>()(
  "InvalidOrigin",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FunctionAlreadyExists extends S.TaggedError<FunctionAlreadyExists>()(
  "FunctionAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class MonitoringSubscriptionAlreadyExists extends S.TaggedError<MonitoringSubscriptionAlreadyExists>()(
  "MonitoringSubscriptionAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class RealtimeLogConfigAlreadyExists extends S.TaggedError<RealtimeLogConfigAlreadyExists>()(
  "RealtimeLogConfigAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class ResourceInUse extends S.TaggedError<ResourceInUse>()(
  "ResourceInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class TooManyFieldLevelEncryptionEncryptionEntities extends S.TaggedError<TooManyFieldLevelEncryptionEncryptionEntities>()(
  "TooManyFieldLevelEncryptionEncryptionEntities",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyCookiesInOriginRequestPolicy extends S.TaggedError<TooManyCookiesInOriginRequestPolicy>()(
  "TooManyCookiesInOriginRequestPolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyInvalidationsInProgress extends S.TaggedError<TooManyInvalidationsInProgress>()(
  "TooManyInvalidationsInProgress",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class StagingDistributionInUse extends S.TaggedError<StagingDistributionInUse>()(
  "StagingDistributionInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class QueryArgProfileEmpty extends S.TaggedError<QueryArgProfileEmpty>()(
  "QueryArgProfileEmpty",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResponseHeadersPolicyAlreadyExists extends S.TaggedError<ResponseHeadersPolicyAlreadyExists>()(
  "ResponseHeadersPolicyAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class ResourceNotDisabled extends S.TaggedError<ResourceNotDisabled>()(
  "ResourceNotDisabled",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class PublicKeyInUse extends S.TaggedError<PublicKeyInUse>()(
  "PublicKeyInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class StreamingDistributionNotDisabled extends S.TaggedError<StreamingDistributionNotDisabled>()(
  "StreamingDistributionNotDisabled",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class TooManyCookiesInCachePolicy extends S.TaggedError<TooManyCookiesInCachePolicy>()(
  "TooManyCookiesInCachePolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResponseHeadersPolicyInUse extends S.TaggedError<ResponseHeadersPolicyInUse>()(
  "ResponseHeadersPolicyInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class TooManyPublicKeysInKeyGroup extends S.TaggedError<TooManyPublicKeysInKeyGroup>()(
  "TooManyPublicKeysInKeyGroup",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyPublicKeys extends S.TaggedError<TooManyPublicKeys>()(
  "TooManyPublicKeys",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RealtimeLogConfigInUse extends S.TaggedError<RealtimeLogConfigInUse>()(
  "RealtimeLogConfigInUse",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError, C.withDependencyViolationError) {}
export class InvalidDefaultRootObject extends S.TaggedError<InvalidDefaultRootObject>()(
  "InvalidDefaultRootObject",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidOriginAccessIdentity extends S.TaggedError<InvalidOriginAccessIdentity>()(
  "InvalidOriginAccessIdentity",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class IllegalOriginAccessConfiguration extends S.TaggedError<IllegalOriginAccessConfiguration>()(
  "IllegalOriginAccessConfiguration",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyCloudFrontOriginAccessIdentities extends S.TaggedError<TooManyCloudFrontOriginAccessIdentities>()(
  "TooManyCloudFrontOriginAccessIdentities",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyOriginAccessControls extends S.TaggedError<TooManyOriginAccessControls>()(
  "TooManyOriginAccessControls",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyKeyGroups extends S.TaggedError<TooManyKeyGroups>()(
  "TooManyKeyGroups",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyCachePolicies extends S.TaggedError<TooManyCachePolicies>()(
  "TooManyCachePolicies",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyFunctions extends S.TaggedError<TooManyFunctions>()(
  "TooManyFunctions",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRealtimeLogConfigs extends S.TaggedError<TooManyRealtimeLogConfigs>()(
  "TooManyRealtimeLogConfigs",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyFieldLevelEncryptionFieldPatterns extends S.TaggedError<TooManyFieldLevelEncryptionFieldPatterns>()(
  "TooManyFieldLevelEncryptionFieldPatterns",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyHeadersInOriginRequestPolicy extends S.TaggedError<TooManyHeadersInOriginRequestPolicy>()(
  "TooManyHeadersInOriginRequestPolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyFieldLevelEncryptionContentTypeProfiles extends S.TaggedError<TooManyFieldLevelEncryptionContentTypeProfiles>()(
  "TooManyFieldLevelEncryptionContentTypeProfiles",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooLongCSPInResponseHeadersPolicy extends S.TaggedError<TooLongCSPInResponseHeadersPolicy>()(
  "TooLongCSPInResponseHeadersPolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyHeadersInCachePolicy extends S.TaggedError<TooManyHeadersInCachePolicy>()(
  "TooManyHeadersInCachePolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidErrorCode extends S.TaggedError<InvalidErrorCode>()(
  "InvalidErrorCode",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyStreamingDistributionCNAMEs extends S.TaggedError<TooManyStreamingDistributionCNAMEs>()(
  "TooManyStreamingDistributionCNAMEs",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidDomainNameForOriginAccessControl extends S.TaggedError<InvalidDomainNameForOriginAccessControl>()(
  "InvalidDomainNameForOriginAccessControl",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class StreamingDistributionAlreadyExists extends S.TaggedError<StreamingDistributionAlreadyExists>()(
  "StreamingDistributionAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class ContinuousDeploymentPolicyAlreadyExists extends S.TaggedError<ContinuousDeploymentPolicyAlreadyExists>()(
  "ContinuousDeploymentPolicyAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class FieldLevelEncryptionConfigAlreadyExists extends S.TaggedError<FieldLevelEncryptionConfigAlreadyExists>()(
  "FieldLevelEncryptionConfigAlreadyExists",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class TooManyQueryStringsInOriginRequestPolicy extends S.TaggedError<TooManyQueryStringsInOriginRequestPolicy>()(
  "TooManyQueryStringsInOriginRequestPolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyFieldLevelEncryptionQueryArgProfiles extends S.TaggedError<TooManyFieldLevelEncryptionQueryArgProfiles>()(
  "TooManyFieldLevelEncryptionQueryArgProfiles",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyCustomHeadersInResponseHeadersPolicy extends S.TaggedError<TooManyCustomHeadersInResponseHeadersPolicy>()(
  "TooManyCustomHeadersInResponseHeadersPolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyQueryStringsInCachePolicy extends S.TaggedError<TooManyQueryStringsInCachePolicy>()(
  "TooManyQueryStringsInCachePolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidForwardCookies extends S.TaggedError<InvalidForwardCookies>()(
  "InvalidForwardCookies",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyTrustedSigners extends S.TaggedError<TooManyTrustedSigners>()(
  "TooManyTrustedSigners",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyFieldLevelEncryptionProfiles extends S.TaggedError<TooManyFieldLevelEncryptionProfiles>()(
  "TooManyFieldLevelEncryptionProfiles",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyOriginRequestPolicies extends S.TaggedError<TooManyOriginRequestPolicies>()(
  "TooManyOriginRequestPolicies",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyStreamingDistributions extends S.TaggedError<TooManyStreamingDistributions>()(
  "TooManyStreamingDistributions",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyContinuousDeploymentPolicies extends S.TaggedError<TooManyContinuousDeploymentPolicies>()(
  "TooManyContinuousDeploymentPolicies",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyFieldLevelEncryptionConfigs extends S.TaggedError<TooManyFieldLevelEncryptionConfigs>()(
  "TooManyFieldLevelEncryptionConfigs",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRemoveHeadersInResponseHeadersPolicy extends S.TaggedError<TooManyRemoveHeadersInResponseHeadersPolicy>()(
  "TooManyRemoveHeadersInResponseHeadersPolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidFunctionAssociation extends S.TaggedError<InvalidFunctionAssociation>()(
  "InvalidFunctionAssociation",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TrustedSignerDoesNotExist extends S.TaggedError<TrustedSignerDoesNotExist>()(
  "TrustedSignerDoesNotExist",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidGeoRestrictionParameter extends S.TaggedError<InvalidGeoRestrictionParameter>()(
  "InvalidGeoRestrictionParameter",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyResponseHeadersPolicies extends S.TaggedError<TooManyResponseHeadersPolicies>()(
  "TooManyResponseHeadersPolicies",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidHeadersForS3Origin extends S.TaggedError<InvalidHeadersForS3Origin>()(
  "InvalidHeadersForS3Origin",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidLambdaFunctionAssociation extends S.TaggedError<InvalidLambdaFunctionAssociation>()(
  "InvalidLambdaFunctionAssociation",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidLocationCode extends S.TaggedError<InvalidLocationCode>()(
  "InvalidLocationCode",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidMinimumProtocolVersion extends S.TaggedError<InvalidMinimumProtocolVersion>()(
  "InvalidMinimumProtocolVersion",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidOriginKeepaliveTimeout extends S.TaggedError<InvalidOriginKeepaliveTimeout>()(
  "InvalidOriginKeepaliveTimeout",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidOriginReadTimeout extends S.TaggedError<InvalidOriginReadTimeout>()(
  "InvalidOriginReadTimeout",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidQueryStringParameters extends S.TaggedError<InvalidQueryStringParameters>()(
  "InvalidQueryStringParameters",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidProtocolSettings extends S.TaggedError<InvalidProtocolSettings>()(
  "InvalidProtocolSettings",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidRelativePath extends S.TaggedError<InvalidRelativePath>()(
  "InvalidRelativePath",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidRequiredProtocol extends S.TaggedError<InvalidRequiredProtocol>()(
  "InvalidRequiredProtocol",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidResponseCode extends S.TaggedError<InvalidResponseCode>()(
  "InvalidResponseCode",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidTTLOrder extends S.TaggedError<InvalidTTLOrder>()(
  "InvalidTTLOrder",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidViewerCertificate extends S.TaggedError<InvalidViewerCertificate>()(
  "InvalidViewerCertificate",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchOrigin extends S.TaggedError<NoSuchOrigin>()(
  "NoSuchOrigin",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RealtimeLogConfigOwnerMismatch extends S.TaggedError<RealtimeLogConfigOwnerMismatch>()(
  "RealtimeLogConfigOwnerMismatch",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class TooManyCacheBehaviors extends S.TaggedError<TooManyCacheBehaviors>()(
  "TooManyCacheBehaviors",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyCertificates extends S.TaggedError<TooManyCertificates>()(
  "TooManyCertificates",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyCookieNamesInWhiteList extends S.TaggedError<TooManyCookieNamesInWhiteList>()(
  "TooManyCookieNamesInWhiteList",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyDistributionsAssociatedToCachePolicy extends S.TaggedError<TooManyDistributionsAssociatedToCachePolicy>()(
  "TooManyDistributionsAssociatedToCachePolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyDistributions extends S.TaggedError<TooManyDistributions>()(
  "TooManyDistributions",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyDistributionsAssociatedToFieldLevelEncryptionConfig extends S.TaggedError<TooManyDistributionsAssociatedToFieldLevelEncryptionConfig>()(
  "TooManyDistributionsAssociatedToFieldLevelEncryptionConfig",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyDistributionsAssociatedToKeyGroup extends S.TaggedError<TooManyDistributionsAssociatedToKeyGroup>()(
  "TooManyDistributionsAssociatedToKeyGroup",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyDistributionsAssociatedToOriginAccessControl extends S.TaggedError<TooManyDistributionsAssociatedToOriginAccessControl>()(
  "TooManyDistributionsAssociatedToOriginAccessControl",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyDistributionsAssociatedToOriginRequestPolicy extends S.TaggedError<TooManyDistributionsAssociatedToOriginRequestPolicy>()(
  "TooManyDistributionsAssociatedToOriginRequestPolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyDistributionsAssociatedToResponseHeadersPolicy extends S.TaggedError<TooManyDistributionsAssociatedToResponseHeadersPolicy>()(
  "TooManyDistributionsAssociatedToResponseHeadersPolicy",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyDistributionsWithFunctionAssociations extends S.TaggedError<TooManyDistributionsWithFunctionAssociations>()(
  "TooManyDistributionsWithFunctionAssociations",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyDistributionsWithLambdaAssociations extends S.TaggedError<TooManyDistributionsWithLambdaAssociations>()(
  "TooManyDistributionsWithLambdaAssociations",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyDistributionsWithSingleFunctionARN extends S.TaggedError<TooManyDistributionsWithSingleFunctionARN>()(
  "TooManyDistributionsWithSingleFunctionARN",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyFunctionAssociations extends S.TaggedError<TooManyFunctionAssociations>()(
  "TooManyFunctionAssociations",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyHeadersInForwardedValues extends S.TaggedError<TooManyHeadersInForwardedValues>()(
  "TooManyHeadersInForwardedValues",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyKeyGroupsAssociatedToDistribution extends S.TaggedError<TooManyKeyGroupsAssociatedToDistribution>()(
  "TooManyKeyGroupsAssociatedToDistribution",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyLambdaFunctionAssociations extends S.TaggedError<TooManyLambdaFunctionAssociations>()(
  "TooManyLambdaFunctionAssociations",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyOriginCustomHeaders extends S.TaggedError<TooManyOriginCustomHeaders>()(
  "TooManyOriginCustomHeaders",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyOriginGroupsPerDistribution extends S.TaggedError<TooManyOriginGroupsPerDistribution>()(
  "TooManyOriginGroupsPerDistribution",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyOrigins extends S.TaggedError<TooManyOrigins>()(
  "TooManyOrigins",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyQueryStringParameters extends S.TaggedError<TooManyQueryStringParameters>()(
  "TooManyQueryStringParameters",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TrustedKeyGroupDoesNotExist extends S.TaggedError<TrustedKeyGroupDoesNotExist>()(
  "TrustedKeyGroupDoesNotExist",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Gets a cache policy configuration.
 *
 * To get a cache policy configuration, you must provide the policy's identifier. If the cache policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the cache policy is not attached to a cache behavior, you can get the identifier using `ListCachePolicies`.
 */
export const getCachePolicyConfig: (
  input: GetCachePolicyConfigRequest,
) => effect.Effect<
  GetCachePolicyConfigResult,
  AccessDenied | NoSuchCachePolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCachePolicyConfigRequest,
  output: GetCachePolicyConfigResult,
  errors: [AccessDenied, NoSuchCachePolicy],
}));
/**
 * Get the configuration information about an origin access identity.
 */
export const getCloudFrontOriginAccessIdentityConfig: (
  input: GetCloudFrontOriginAccessIdentityConfigRequest,
) => effect.Effect<
  GetCloudFrontOriginAccessIdentityConfigResult,
  AccessDenied | NoSuchCloudFrontOriginAccessIdentity | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCloudFrontOriginAccessIdentityConfigRequest,
  output: GetCloudFrontOriginAccessIdentityConfigResult,
  errors: [AccessDenied, NoSuchCloudFrontOriginAccessIdentity],
}));
/**
 * Gets configuration information about a continuous deployment policy.
 */
export const getContinuousDeploymentPolicyConfig: (
  input: GetContinuousDeploymentPolicyConfigRequest,
) => effect.Effect<
  GetContinuousDeploymentPolicyConfigResult,
  AccessDenied | NoSuchContinuousDeploymentPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContinuousDeploymentPolicyConfigRequest,
  output: GetContinuousDeploymentPolicyConfigResult,
  errors: [AccessDenied, NoSuchContinuousDeploymentPolicy],
}));
/**
 * Get the information about a distribution.
 */
export const getDistribution: (
  input: GetDistributionRequest,
) => effect.Effect<
  GetDistributionResult,
  AccessDenied | NoSuchDistribution | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDistributionRequest,
  output: GetDistributionResult,
  errors: [AccessDenied, NoSuchDistribution],
}));
/**
 * Get the field-level encryption configuration information.
 */
export const getFieldLevelEncryptionConfig: (
  input: GetFieldLevelEncryptionConfigRequest,
) => effect.Effect<
  GetFieldLevelEncryptionConfigResult,
  AccessDenied | NoSuchFieldLevelEncryptionConfig | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFieldLevelEncryptionConfigRequest,
  output: GetFieldLevelEncryptionConfigResult,
  errors: [AccessDenied, NoSuchFieldLevelEncryptionConfig],
}));
/**
 * Get the field-level encryption profile configuration information.
 */
export const getFieldLevelEncryptionProfileConfig: (
  input: GetFieldLevelEncryptionProfileConfigRequest,
) => effect.Effect<
  GetFieldLevelEncryptionProfileConfigResult,
  AccessDenied | NoSuchFieldLevelEncryptionProfile | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFieldLevelEncryptionProfileConfigRequest,
  output: GetFieldLevelEncryptionProfileConfigResult,
  errors: [AccessDenied, NoSuchFieldLevelEncryptionProfile],
}));
/**
 * Gets a key group, including the date and time when the key group was last modified.
 *
 * To get a key group, you must provide the key group's identifier. If the key group is referenced in a distribution's cache behavior, you can get the key group's identifier using `ListDistributions` or `GetDistribution`. If the key group is not referenced in a cache behavior, you can get the identifier using `ListKeyGroups`.
 */
export const getKeyGroup: (
  input: GetKeyGroupRequest,
) => effect.Effect<
  GetKeyGroupResult,
  NoSuchResource | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyGroupRequest,
  output: GetKeyGroupResult,
  errors: [NoSuchResource],
}));
/**
 * Gets a CloudFront origin access control configuration.
 */
export const getOriginAccessControlConfig: (
  input: GetOriginAccessControlConfigRequest,
) => effect.Effect<
  GetOriginAccessControlConfigResult,
  AccessDenied | NoSuchOriginAccessControl | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOriginAccessControlConfigRequest,
  output: GetOriginAccessControlConfigResult,
  errors: [AccessDenied, NoSuchOriginAccessControl],
}));
/**
 * Gets an origin request policy configuration.
 *
 * To get an origin request policy configuration, you must provide the policy's identifier. If the origin request policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the origin request policy is not attached to a cache behavior, you can get the identifier using `ListOriginRequestPolicies`.
 */
export const getOriginRequestPolicyConfig: (
  input: GetOriginRequestPolicyConfigRequest,
) => effect.Effect<
  GetOriginRequestPolicyConfigResult,
  AccessDenied | NoSuchOriginRequestPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOriginRequestPolicyConfigRequest,
  output: GetOriginRequestPolicyConfigResult,
  errors: [AccessDenied, NoSuchOriginRequestPolicy],
}));
/**
 * Gets a public key configuration.
 */
export const getPublicKeyConfig: (
  input: GetPublicKeyConfigRequest,
) => effect.Effect<
  GetPublicKeyConfigResult,
  AccessDenied | NoSuchPublicKey | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPublicKeyConfigRequest,
  output: GetPublicKeyConfigResult,
  errors: [AccessDenied, NoSuchPublicKey],
}));
/**
 * Gets a response headers policy configuration.
 *
 * To get a response headers policy configuration, you must provide the policy's identifier. If the response headers policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the response headers policy is not attached to a cache behavior, you can get the identifier using `ListResponseHeadersPolicies`.
 */
export const getResponseHeadersPolicyConfig: (
  input: GetResponseHeadersPolicyConfigRequest,
) => effect.Effect<
  GetResponseHeadersPolicyConfigResult,
  AccessDenied | NoSuchResponseHeadersPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResponseHeadersPolicyConfigRequest,
  output: GetResponseHeadersPolicyConfigResult,
  errors: [AccessDenied, NoSuchResponseHeadersPolicy],
}));
/**
 * Get the configuration information about a streaming distribution.
 */
export const getStreamingDistributionConfig: (
  input: GetStreamingDistributionConfigRequest,
) => effect.Effect<
  GetStreamingDistributionConfigResult,
  AccessDenied | NoSuchStreamingDistribution | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStreamingDistributionConfigRequest,
  output: GetStreamingDistributionConfigResult,
  errors: [AccessDenied, NoSuchStreamingDistribution],
}));
/**
 * Gets a list of distribution IDs for distributions that have a cache behavior that's associated with the specified cache policy.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listDistributionsByCachePolicyId: (
  input: ListDistributionsByCachePolicyIdRequest,
) => effect.Effect<
  ListDistributionsByCachePolicyIdResult,
  AccessDenied | InvalidArgument | NoSuchCachePolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDistributionsByCachePolicyIdRequest,
  output: ListDistributionsByCachePolicyIdResult,
  errors: [AccessDenied, InvalidArgument, NoSuchCachePolicy],
}));
/**
 * Lists the distribution tenants in your Amazon Web Services account.
 */
export const listDistributionTenants: {
  (
    input: ListDistributionTenantsRequest,
  ): effect.Effect<
    ListDistributionTenantsResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDistributionTenantsRequest,
  ) => stream.Stream<
    ListDistributionTenantsResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDistributionTenantsRequest,
  ) => stream.Stream<
    DistributionTenantSummary,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDistributionTenantsRequest,
  output: ListDistributionTenantsResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "DistributionTenantList",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists distribution tenants by the customization that you specify.
 *
 * You must specify either the `CertificateArn` parameter or `WebACLArn` parameter, but not both in the same request.
 */
export const listDistributionTenantsByCustomization: {
  (
    input: ListDistributionTenantsByCustomizationRequest,
  ): effect.Effect<
    ListDistributionTenantsByCustomizationResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDistributionTenantsByCustomizationRequest,
  ) => stream.Stream<
    ListDistributionTenantsByCustomizationResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDistributionTenantsByCustomizationRequest,
  ) => stream.Stream<
    DistributionTenantSummary,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDistributionTenantsByCustomizationRequest,
  output: ListDistributionTenantsByCustomizationResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "DistributionTenantList",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists trust stores.
 */
export const listTrustStores: {
  (
    input: ListTrustStoresRequest,
  ): effect.Effect<
    ListTrustStoresResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrustStoresRequest,
  ) => stream.Stream<
    ListTrustStoresResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrustStoresRequest,
  ) => stream.Stream<
    TrustStoreSummary,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTrustStoresRequest,
  output: ListTrustStoresResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "TrustStoreList",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Verify the DNS configuration for your domain names. This API operation checks whether your domain name points to the correct routing endpoint of the connection group, such as d111111abcdef8.cloudfront.net. You can use this API operation to troubleshoot and resolve DNS configuration issues.
 */
export const verifyDnsConfiguration: (
  input: VerifyDnsConfigurationRequest,
) => effect.Effect<
  VerifyDnsConfigurationResult,
  AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyDnsConfigurationRequest,
  output: VerifyDnsConfigurationResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
}));
/**
 * Gets a key group configuration.
 *
 * To get a key group configuration, you must provide the key group's identifier. If the key group is referenced in a distribution's cache behavior, you can get the key group's identifier using `ListDistributions` or `GetDistribution`. If the key group is not referenced in a cache behavior, you can get the identifier using `ListKeyGroups`.
 */
export const getKeyGroupConfig: (
  input: GetKeyGroupConfigRequest,
) => effect.Effect<
  GetKeyGroupConfigResult,
  NoSuchResource | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyGroupConfigRequest,
  output: GetKeyGroupConfigResult,
  errors: [NoSuchResource],
}));
/**
 * Gets information about a connection group.
 */
export const getConnectionGroup: (
  input: GetConnectionGroupRequest,
) => effect.Effect<
  GetConnectionGroupResult,
  AccessDenied | EntityNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionGroupRequest,
  output: GetConnectionGroupResult,
  errors: [AccessDenied, EntityNotFound],
}));
/**
 * Gets information about a connection group by using the endpoint that you specify.
 */
export const getConnectionGroupByRoutingEndpoint: (
  input: GetConnectionGroupByRoutingEndpointRequest,
) => effect.Effect<
  GetConnectionGroupByRoutingEndpointResult,
  AccessDenied | EntityNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionGroupByRoutingEndpointRequest,
  output: GetConnectionGroupByRoutingEndpointResult,
  errors: [AccessDenied, EntityNotFound],
}));
/**
 * Gets information about a distribution tenant by the associated domain.
 */
export const getDistributionTenantByDomain: (
  input: GetDistributionTenantByDomainRequest,
) => effect.Effect<
  GetDistributionTenantByDomainResult,
  AccessDenied | EntityNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDistributionTenantByDomainRequest,
  output: GetDistributionTenantByDomainResult,
  errors: [AccessDenied, EntityNotFound],
}));
/**
 * Lists distributions by connection function.
 */
export const listDistributionsByConnectionFunction: {
  (
    input: ListDistributionsByConnectionFunctionRequest,
  ): effect.Effect<
    ListDistributionsByConnectionFunctionResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDistributionsByConnectionFunctionRequest,
  ) => stream.Stream<
    ListDistributionsByConnectionFunctionResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDistributionsByConnectionFunctionRequest,
  ) => stream.Stream<
    unknown,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDistributionsByConnectionFunctionRequest,
  output: ListDistributionsByConnectionFunctionResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "DistributionList.NextMarker",
    items: "DistributionList.Items",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists distributions by trust store.
 */
export const listDistributionsByTrustStore: {
  (
    input: ListDistributionsByTrustStoreRequest,
  ): effect.Effect<
    ListDistributionsByTrustStoreResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDistributionsByTrustStoreRequest,
  ) => stream.Stream<
    ListDistributionsByTrustStoreResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDistributionsByTrustStoreRequest,
  ) => stream.Stream<
    unknown,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDistributionsByTrustStoreRequest,
  output: ListDistributionsByTrustStoreResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "DistributionList.NextMarker",
    items: "DistributionList.Items",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the invalidations for a distribution tenant.
 */
export const listInvalidationsForDistributionTenant: {
  (
    input: ListInvalidationsForDistributionTenantRequest,
  ): effect.Effect<
    ListInvalidationsForDistributionTenantResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvalidationsForDistributionTenantRequest,
  ) => stream.Stream<
    ListInvalidationsForDistributionTenantResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvalidationsForDistributionTenantRequest,
  ) => stream.Stream<
    unknown,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInvalidationsForDistributionTenantRequest,
  output: ListInvalidationsForDistributionTenantResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "InvalidationList.NextMarker",
    items: "InvalidationList.Items",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Gets a cache policy, including the following metadata:
 *
 * - The policy's identifier.
 *
 * - The date and time when the policy was last modified.
 *
 * To get a cache policy, you must provide the policy's identifier. If the cache policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the cache policy is not attached to a cache behavior, you can get the identifier using `ListCachePolicies`.
 */
export const getCachePolicy: (
  input: GetCachePolicyRequest,
) => effect.Effect<
  GetCachePolicyResult,
  AccessDenied | NoSuchCachePolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCachePolicyRequest,
  output: GetCachePolicyResult,
  errors: [AccessDenied, NoSuchCachePolicy],
}));
/**
 * Get the information about an origin access identity.
 */
export const getCloudFrontOriginAccessIdentity: (
  input: GetCloudFrontOriginAccessIdentityRequest,
) => effect.Effect<
  GetCloudFrontOriginAccessIdentityResult,
  AccessDenied | NoSuchCloudFrontOriginAccessIdentity | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCloudFrontOriginAccessIdentityRequest,
  output: GetCloudFrontOriginAccessIdentityResult,
  errors: [AccessDenied, NoSuchCloudFrontOriginAccessIdentity],
}));
/**
 * Gets a continuous deployment policy, including metadata (the policy's identifier and the date and time when the policy was last modified).
 */
export const getContinuousDeploymentPolicy: (
  input: GetContinuousDeploymentPolicyRequest,
) => effect.Effect<
  GetContinuousDeploymentPolicyResult,
  AccessDenied | NoSuchContinuousDeploymentPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContinuousDeploymentPolicyRequest,
  output: GetContinuousDeploymentPolicyResult,
  errors: [AccessDenied, NoSuchContinuousDeploymentPolicy],
}));
/**
 * Get the configuration information about a distribution.
 */
export const getDistributionConfig: (
  input: GetDistributionConfigRequest,
) => effect.Effect<
  GetDistributionConfigResult,
  AccessDenied | NoSuchDistribution | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDistributionConfigRequest,
  output: GetDistributionConfigResult,
  errors: [AccessDenied, NoSuchDistribution],
}));
/**
 * Get the field-level encryption configuration information.
 */
export const getFieldLevelEncryption: (
  input: GetFieldLevelEncryptionRequest,
) => effect.Effect<
  GetFieldLevelEncryptionResult,
  AccessDenied | NoSuchFieldLevelEncryptionConfig | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFieldLevelEncryptionRequest,
  output: GetFieldLevelEncryptionResult,
  errors: [AccessDenied, NoSuchFieldLevelEncryptionConfig],
}));
/**
 * Get the field-level encryption profile information.
 */
export const getFieldLevelEncryptionProfile: (
  input: GetFieldLevelEncryptionProfileRequest,
) => effect.Effect<
  GetFieldLevelEncryptionProfileResult,
  AccessDenied | NoSuchFieldLevelEncryptionProfile | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFieldLevelEncryptionProfileRequest,
  output: GetFieldLevelEncryptionProfileResult,
  errors: [AccessDenied, NoSuchFieldLevelEncryptionProfile],
}));
/**
 * Gets a CloudFront origin access control, including its unique identifier.
 */
export const getOriginAccessControl: (
  input: GetOriginAccessControlRequest,
) => effect.Effect<
  GetOriginAccessControlResult,
  AccessDenied | NoSuchOriginAccessControl | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOriginAccessControlRequest,
  output: GetOriginAccessControlResult,
  errors: [AccessDenied, NoSuchOriginAccessControl],
}));
/**
 * Gets an origin request policy, including the following metadata:
 *
 * - The policy's identifier.
 *
 * - The date and time when the policy was last modified.
 *
 * To get an origin request policy, you must provide the policy's identifier. If the origin request policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the origin request policy is not attached to a cache behavior, you can get the identifier using `ListOriginRequestPolicies`.
 */
export const getOriginRequestPolicy: (
  input: GetOriginRequestPolicyRequest,
) => effect.Effect<
  GetOriginRequestPolicyResult,
  AccessDenied | NoSuchOriginRequestPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOriginRequestPolicyRequest,
  output: GetOriginRequestPolicyResult,
  errors: [AccessDenied, NoSuchOriginRequestPolicy],
}));
/**
 * Gets a public key.
 */
export const getPublicKey: (
  input: GetPublicKeyRequest,
) => effect.Effect<
  GetPublicKeyResult,
  AccessDenied | NoSuchPublicKey | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPublicKeyRequest,
  output: GetPublicKeyResult,
  errors: [AccessDenied, NoSuchPublicKey],
}));
/**
 * Gets a response headers policy, including metadata (the policy's identifier and the date and time when the policy was last modified).
 *
 * To get a response headers policy, you must provide the policy's identifier. If the response headers policy is attached to a distribution's cache behavior, you can get the policy's identifier using `ListDistributions` or `GetDistribution`. If the response headers policy is not attached to a cache behavior, you can get the identifier using `ListResponseHeadersPolicies`.
 */
export const getResponseHeadersPolicy: (
  input: GetResponseHeadersPolicyRequest,
) => effect.Effect<
  GetResponseHeadersPolicyResult,
  AccessDenied | NoSuchResponseHeadersPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResponseHeadersPolicyRequest,
  output: GetResponseHeadersPolicyResult,
  errors: [AccessDenied, NoSuchResponseHeadersPolicy],
}));
/**
 * Gets information about a specified RTMP distribution, including the distribution configuration.
 */
export const getStreamingDistribution: (
  input: GetStreamingDistributionRequest,
) => effect.Effect<
  GetStreamingDistributionResult,
  AccessDenied | NoSuchStreamingDistribution | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStreamingDistributionRequest,
  output: GetStreamingDistributionResult,
  errors: [AccessDenied, NoSuchStreamingDistribution],
}));
/**
 * Lists the distributions by the connection mode that you specify.
 */
export const listDistributionsByConnectionMode: {
  (
    input: ListDistributionsByConnectionModeRequest,
  ): effect.Effect<
    ListDistributionsByConnectionModeResult,
    AccessDenied | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDistributionsByConnectionModeRequest,
  ) => stream.Stream<
    ListDistributionsByConnectionModeResult,
    AccessDenied | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDistributionsByConnectionModeRequest,
  ) => stream.Stream<
    unknown,
    AccessDenied | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDistributionsByConnectionModeRequest,
  output: ListDistributionsByConnectionModeResult,
  errors: [AccessDenied, InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "DistributionList.NextMarker",
    items: "DistributionList.Items",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Gets a list of distribution IDs for distributions that have a cache behavior that references the specified key group.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listDistributionsByKeyGroup: (
  input: ListDistributionsByKeyGroupRequest,
) => effect.Effect<
  ListDistributionsByKeyGroupResult,
  InvalidArgument | NoSuchResource | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDistributionsByKeyGroupRequest,
  output: ListDistributionsByKeyGroupResult,
  errors: [InvalidArgument, NoSuchResource],
}));
/**
 * Gets a list of distribution IDs for distributions that have a cache behavior that's associated with the specified origin request policy.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listDistributionsByOriginRequestPolicyId: (
  input: ListDistributionsByOriginRequestPolicyIdRequest,
) => effect.Effect<
  ListDistributionsByOriginRequestPolicyIdResult,
  AccessDenied | InvalidArgument | NoSuchOriginRequestPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDistributionsByRealtimeLogConfig: (
  input: ListDistributionsByRealtimeLogConfigRequest,
) => effect.Effect<
  ListDistributionsByRealtimeLogConfigResult,
  InvalidArgument | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDistributionsByRealtimeLogConfigRequest,
  output: ListDistributionsByRealtimeLogConfigResult,
  errors: [InvalidArgument],
}));
/**
 * Gets a list of distribution IDs for distributions that have a cache behavior that's associated with the specified response headers policy.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listDistributionsByResponseHeadersPolicyId: (
  input: ListDistributionsByResponseHeadersPolicyIdRequest,
) => effect.Effect<
  ListDistributionsByResponseHeadersPolicyIdResult,
  AccessDenied | InvalidArgument | NoSuchResponseHeadersPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDistributionsByResponseHeadersPolicyIdRequest,
  output: ListDistributionsByResponseHeadersPolicyIdResult,
  errors: [AccessDenied, InvalidArgument, NoSuchResponseHeadersPolicy],
}));
/**
 * Gets a trust store.
 */
export const getTrustStore: (
  input: GetTrustStoreRequest,
) => effect.Effect<
  GetTrustStoreResult,
  AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrustStoreRequest,
  output: GetTrustStoreResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
}));
/**
 * Gets configuration information and metadata about a CloudFront function, but not the function's code. To get a function's code, use `GetFunction`.
 *
 * To get configuration information and metadata about a function, you must provide the function's name and stage. To get these values, you can use `ListFunctions`.
 */
export const describeFunction: (
  input: DescribeFunctionRequest,
) => effect.Effect<
  DescribeFunctionResult,
  NoSuchFunctionExists | UnsupportedOperation | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFunctionRequest,
  output: DescribeFunctionResult,
  errors: [NoSuchFunctionExists, UnsupportedOperation],
}));
/**
 * Gets an Anycast static IP list.
 */
export const getAnycastIpList: (
  input: GetAnycastIpListRequest,
) => effect.Effect<
  GetAnycastIpListResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAnycastIpListRequest,
  output: GetAnycastIpListResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Gets information about a distribution tenant.
 */
export const getDistributionTenant: (
  input: GetDistributionTenantRequest,
) => effect.Effect<
  GetDistributionTenantResult,
  AccessDenied | EntityNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDistributionTenantRequest,
  output: GetDistributionTenantResult,
  errors: [AccessDenied, EntityNotFound],
}));
/**
 * Gets details about the CloudFront managed ACM certificate.
 */
export const getManagedCertificateDetails: (
  input: GetManagedCertificateDetailsRequest,
) => effect.Effect<
  GetManagedCertificateDetailsResult,
  AccessDenied | EntityNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetManagedCertificateDetailsRequest,
  output: GetManagedCertificateDetailsResult,
  errors: [AccessDenied, EntityNotFound],
}));
/**
 * Lists your Anycast static IP lists.
 */
export const listAnycastIpLists: (
  input: ListAnycastIpListsRequest,
) => effect.Effect<
  ListAnycastIpListsResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCachePolicies: (
  input: ListCachePoliciesRequest,
) => effect.Effect<
  ListCachePoliciesResult,
  AccessDenied | InvalidArgument | NoSuchCachePolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCachePoliciesRequest,
  output: ListCachePoliciesResult,
  errors: [AccessDenied, InvalidArgument, NoSuchCachePolicy],
}));
/**
 * Lists origin access identities.
 */
export const listCloudFrontOriginAccessIdentities: {
  (
    input: ListCloudFrontOriginAccessIdentitiesRequest,
  ): effect.Effect<
    ListCloudFrontOriginAccessIdentitiesResult,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCloudFrontOriginAccessIdentitiesRequest,
  ) => stream.Stream<
    ListCloudFrontOriginAccessIdentitiesResult,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCloudFrontOriginAccessIdentitiesRequest,
  ) => stream.Stream<
    unknown,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCloudFrontOriginAccessIdentitiesRequest,
  output: ListCloudFrontOriginAccessIdentitiesResult,
  errors: [InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "CloudFrontOriginAccessIdentityList.NextMarker",
    items: "CloudFrontOriginAccessIdentityList.Items",
    pageSize: "MaxItems",
  } as const,
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
export const listConflictingAliases: (
  input: ListConflictingAliasesRequest,
) => effect.Effect<
  ListConflictingAliasesResult,
  InvalidArgument | NoSuchDistribution | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConflictingAliasesRequest,
  output: ListConflictingAliasesResult,
  errors: [InvalidArgument, NoSuchDistribution],
}));
/**
 * Lists the connection groups in your Amazon Web Services account.
 */
export const listConnectionGroups: {
  (
    input: ListConnectionGroupsRequest,
  ): effect.Effect<
    ListConnectionGroupsResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectionGroupsRequest,
  ) => stream.Stream<
    ListConnectionGroupsResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectionGroupsRequest,
  ) => stream.Stream<
    ConnectionGroupSummary,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectionGroupsRequest,
  output: ListConnectionGroupsResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "ConnectionGroups",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Gets a list of the continuous deployment policies in your Amazon Web Services account.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listContinuousDeploymentPolicies: (
  input: ListContinuousDeploymentPoliciesRequest,
) => effect.Effect<
  ListContinuousDeploymentPoliciesResult,
  | AccessDenied
  | InvalidArgument
  | NoSuchContinuousDeploymentPolicy
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListContinuousDeploymentPoliciesRequest,
  output: ListContinuousDeploymentPoliciesResult,
  errors: [AccessDenied, InvalidArgument, NoSuchContinuousDeploymentPolicy],
}));
/**
 * List CloudFront distributions.
 */
export const listDistributions: {
  (
    input: ListDistributionsRequest,
  ): effect.Effect<
    ListDistributionsResult,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDistributionsRequest,
  ) => stream.Stream<
    ListDistributionsResult,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDistributionsRequest,
  ) => stream.Stream<
    unknown,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDistributionsRequest,
  output: ListDistributionsResult,
  errors: [InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "DistributionList.NextMarker",
    items: "DistributionList.Items",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the CloudFront distributions that are associated with the specified resource that you own.
 */
export const listDistributionsByOwnedResource: (
  input: ListDistributionsByOwnedResourceRequest,
) => effect.Effect<
  ListDistributionsByOwnedResourceResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDistributionsByOwnedResourceRequest,
  output: ListDistributionsByOwnedResourceResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
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
export const listDomainConflicts: {
  (
    input: ListDomainConflictsRequest,
  ): effect.Effect<
    ListDomainConflictsResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainConflictsRequest,
  ) => stream.Stream<
    ListDomainConflictsResult,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainConflictsRequest,
  ) => stream.Stream<
    DomainConflict,
    AccessDenied | EntityNotFound | InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDomainConflictsRequest,
  output: ListDomainConflictsResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "DomainConflicts",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * List all field-level encryption configurations that have been created in CloudFront for this account.
 */
export const listFieldLevelEncryptionConfigs: (
  input: ListFieldLevelEncryptionConfigsRequest,
) => effect.Effect<
  ListFieldLevelEncryptionConfigsResult,
  InvalidArgument | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFieldLevelEncryptionConfigsRequest,
  output: ListFieldLevelEncryptionConfigsResult,
  errors: [InvalidArgument],
}));
/**
 * Request a list of field-level encryption profiles that have been created in CloudFront for this account.
 */
export const listFieldLevelEncryptionProfiles: (
  input: ListFieldLevelEncryptionProfilesRequest,
) => effect.Effect<
  ListFieldLevelEncryptionProfilesResult,
  InvalidArgument | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFieldLevelEncryptionProfilesRequest,
  output: ListFieldLevelEncryptionProfilesResult,
  errors: [InvalidArgument],
}));
/**
 * Lists invalidation batches.
 */
export const listInvalidations: {
  (
    input: ListInvalidationsRequest,
  ): effect.Effect<
    ListInvalidationsResult,
    AccessDenied | InvalidArgument | NoSuchDistribution | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvalidationsRequest,
  ) => stream.Stream<
    ListInvalidationsResult,
    AccessDenied | InvalidArgument | NoSuchDistribution | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvalidationsRequest,
  ) => stream.Stream<
    unknown,
    AccessDenied | InvalidArgument | NoSuchDistribution | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInvalidationsRequest,
  output: ListInvalidationsResult,
  errors: [AccessDenied, InvalidArgument, NoSuchDistribution],
  pagination: {
    inputToken: "Marker",
    outputToken: "InvalidationList.NextMarker",
    items: "InvalidationList.Items",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Gets a list of key groups.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listKeyGroups: (
  input: ListKeyGroupsRequest,
) => effect.Effect<
  ListKeyGroupsResult,
  InvalidArgument | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listOriginAccessControls: {
  (
    input: ListOriginAccessControlsRequest,
  ): effect.Effect<
    ListOriginAccessControlsResult,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOriginAccessControlsRequest,
  ) => stream.Stream<
    ListOriginAccessControlsResult,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOriginAccessControlsRequest,
  ) => stream.Stream<
    unknown,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOriginAccessControlsRequest,
  output: ListOriginAccessControlsResult,
  errors: [InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "OriginAccessControlList.NextMarker",
    items: "OriginAccessControlList.Items",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Gets a list of origin request policies.
 *
 * You can optionally apply a filter to return only the managed policies created by Amazon Web Services, or only the custom policies created in your Amazon Web Services account.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listOriginRequestPolicies: (
  input: ListOriginRequestPoliciesRequest,
) => effect.Effect<
  ListOriginRequestPoliciesResult,
  AccessDenied | InvalidArgument | NoSuchOriginRequestPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOriginRequestPoliciesRequest,
  output: ListOriginRequestPoliciesResult,
  errors: [AccessDenied, InvalidArgument, NoSuchOriginRequestPolicy],
}));
/**
 * List all public keys that have been added to CloudFront for this account.
 */
export const listPublicKeys: {
  (
    input: ListPublicKeysRequest,
  ): effect.Effect<
    ListPublicKeysResult,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPublicKeysRequest,
  ) => stream.Stream<
    ListPublicKeysResult,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPublicKeysRequest,
  ) => stream.Stream<
    unknown,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPublicKeysRequest,
  output: ListPublicKeysResult,
  errors: [InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "PublicKeyList.NextMarker",
    items: "PublicKeyList.Items",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Gets a list of real-time log configurations.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listRealtimeLogConfigs: (
  input: ListRealtimeLogConfigsRequest,
) => effect.Effect<
  ListRealtimeLogConfigsResult,
  AccessDenied | InvalidArgument | NoSuchRealtimeLogConfig | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRealtimeLogConfigsRequest,
  output: ListRealtimeLogConfigsResult,
  errors: [AccessDenied, InvalidArgument, NoSuchRealtimeLogConfig],
}));
/**
 * Gets a list of response headers policies.
 *
 * You can optionally apply a filter to get only the managed policies created by Amazon Web Services, or only the custom policies created in your Amazon Web Services account.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listResponseHeadersPolicies: (
  input: ListResponseHeadersPoliciesRequest,
) => effect.Effect<
  ListResponseHeadersPoliciesResult,
  AccessDenied | InvalidArgument | NoSuchResponseHeadersPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListResponseHeadersPoliciesRequest,
  output: ListResponseHeadersPoliciesResult,
  errors: [AccessDenied, InvalidArgument, NoSuchResponseHeadersPolicy],
}));
/**
 * List streaming distributions.
 */
export const listStreamingDistributions: {
  (
    input: ListStreamingDistributionsRequest,
  ): effect.Effect<
    ListStreamingDistributionsResult,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStreamingDistributionsRequest,
  ) => stream.Stream<
    ListStreamingDistributionsResult,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStreamingDistributionsRequest,
  ) => stream.Stream<
    unknown,
    InvalidArgument | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStreamingDistributionsRequest,
  output: ListStreamingDistributionsResult,
  errors: [InvalidArgument],
  pagination: {
    inputToken: "Marker",
    outputToken: "StreamingDistributionList.NextMarker",
    items: "StreamingDistributionList.Items",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * List the CloudFront VPC origins in your account.
 */
export const listVpcOrigins: (
  input: ListVpcOriginsRequest,
) => effect.Effect<
  ListVpcOriginsResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVpcOriginsRequest,
  output: ListVpcOriginsResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Tests a CloudFront function.
 *
 * To test a function, you provide an *event object* that represents an HTTP request or response that your CloudFront distribution could receive in production. CloudFront runs the function, passing it the event object that you provided, and returns the function's result (the modified event object) in the response. The response also contains function logs and error messages, if any exist. For more information about testing functions, see Testing functions in the *Amazon CloudFront Developer Guide*.
 *
 * To test a function, you provide the function's name and version (`ETag` value) along with the event object. To get the function's name and version, you can use `ListFunctions` and `DescribeFunction`.
 */
export const testFunction: (
  input: TestFunctionRequest,
) => effect.Effect<
  TestFunctionResult,
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchFunctionExists
  | TestFunctionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an origin request policy.
 *
 * You cannot delete an origin request policy if it's attached to any cache behaviors. First update your distributions to remove the origin request policy from all cache behaviors, then delete the origin request policy.
 *
 * To delete an origin request policy, you must provide the policy's identifier and version. To get the identifier, you can use `ListOriginRequestPolicies` or `GetOriginRequestPolicy`.
 */
export const deleteOriginRequestPolicy: (
  input: DeleteOriginRequestPolicyRequest,
) => effect.Effect<
  DeleteOriginRequestPolicyResponse,
  | AccessDenied
  | IllegalDelete
  | InvalidIfMatchVersion
  | NoSuchOriginRequestPolicy
  | OriginRequestPolicyInUse
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Update an origin access identity.
 */
export const updateCloudFrontOriginAccessIdentity: (
  input: UpdateCloudFrontOriginAccessIdentityRequest,
) => effect.Effect<
  UpdateCloudFrontOriginAccessIdentityResult,
  | AccessDenied
  | IllegalUpdate
  | InconsistentQuantities
  | InvalidArgument
  | InvalidIfMatchVersion
  | MissingBody
  | NoSuchCloudFrontOriginAccessIdentity
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates a CloudFront origin access control.
 */
export const updateOriginAccessControl: (
  input: UpdateOriginAccessControlRequest,
) => effect.Effect<
  UpdateOriginAccessControlResult,
  | AccessDenied
  | IllegalUpdate
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchOriginAccessControl
  | OriginAccessControlAlreadyExists
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Tests a connection function.
 */
export const testConnectionFunction: (
  input: TestConnectionFunctionRequest,
) => effect.Effect<
  TestConnectionFunctionResult,
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | TestFunctionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates a CloudFront function.
 *
 * You can update a function's code or the comment that describes the function. You cannot update a function's name.
 *
 * To update a function, you provide the function's name and version (`ETag` value) along with the updated function code. To get the name and version, you can use `ListFunctions` and `DescribeFunction`.
 */
export const updateFunction: (
  input: UpdateFunctionRequest,
) => effect.Effect<
  UpdateFunctionResult,
  | FunctionSizeLimitExceeded
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchFunctionExists
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Update public key information. Note that the only value you can change is the comment.
 */
export const updatePublicKey: (
  input: UpdatePublicKeyRequest,
) => effect.Effect<
  UpdatePublicKeyResult,
  | AccessDenied
  | CannotChangeImmutablePublicKeyFields
  | IllegalUpdate
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchPublicKey
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVpcOrigin: (
  input: UpdateVpcOriginRequest,
) => effect.Effect<
  UpdateVpcOriginResult,
  | AccessDenied
  | CannotUpdateEntityWhileInUse
  | EntityAlreadyExists
  | EntityLimitExceeded
  | EntityNotFound
  | IllegalUpdate
  | InconsistentQuantities
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Delete an origin access identity.
 */
export const deleteCloudFrontOriginAccessIdentity: (
  input: DeleteCloudFrontOriginAccessIdentityRequest,
) => effect.Effect<
  DeleteCloudFrontOriginAccessIdentityResponse,
  | AccessDenied
  | CloudFrontOriginAccessIdentityInUse
  | InvalidIfMatchVersion
  | NoSuchCloudFrontOriginAccessIdentity
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a continuous deployment policy.
 *
 * You cannot delete a continuous deployment policy that's attached to a primary distribution. First update your distribution to remove the continuous deployment policy, then you can delete the policy.
 */
export const deleteContinuousDeploymentPolicy: (
  input: DeleteContinuousDeploymentPolicyRequest,
) => effect.Effect<
  DeleteContinuousDeploymentPolicyResponse,
  | AccessDenied
  | ContinuousDeploymentPolicyInUse
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchContinuousDeploymentPolicy
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Remove a field-level encryption configuration.
 */
export const deleteFieldLevelEncryptionConfig: (
  input: DeleteFieldLevelEncryptionConfigRequest,
) => effect.Effect<
  DeleteFieldLevelEncryptionConfigResponse,
  | AccessDenied
  | FieldLevelEncryptionConfigInUse
  | InvalidIfMatchVersion
  | NoSuchFieldLevelEncryptionConfig
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFieldLevelEncryptionProfile: (
  input: DeleteFieldLevelEncryptionProfileRequest,
) => effect.Effect<
  DeleteFieldLevelEncryptionProfileResponse,
  | AccessDenied
  | FieldLevelEncryptionProfileInUse
  | InvalidIfMatchVersion
  | NoSuchFieldLevelEncryptionProfile
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Associates the WAF web ACL with a distribution.
 */
export const associateDistributionWebACL: (
  input: AssociateDistributionWebACLRequest,
) => effect.Effect<
  AssociateDistributionWebACLResult,
  | AccessDenied
  | EntityLimitExceeded
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateDistributionWebACLRequest,
  output: AssociateDistributionWebACLResult,
  errors: [
    AccessDenied,
    EntityLimitExceeded,
    EntityNotFound,
    InvalidArgument,
    InvalidIfMatchVersion,
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
export const deleteFunction: (
  input: DeleteFunctionRequest,
) => effect.Effect<
  DeleteFunctionResponse,
  | FunctionInUse
  | InvalidIfMatchVersion
  | NoSuchFunctionExists
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Disassociates a distribution from the WAF web ACL.
 */
export const disassociateDistributionWebACL: (
  input: DisassociateDistributionWebACLRequest,
) => effect.Effect<
  DisassociateDistributionWebACLResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Publishes a connection function.
 */
export const publishConnectionFunction: (
  input: PublishConnectionFunctionRequest,
) => effect.Effect<
  PublishConnectionFunctionResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a resource control policy for a given CloudFront resource.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResult,
  | AccessDenied
  | EntityNotFound
  | IllegalUpdate
  | InvalidArgument
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an Anycast static IP list.
 */
export const updateAnycastIpList: (
  input: UpdateAnycastIpListRequest,
) => effect.Effect<
  UpdateAnycastIpListResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDomainAssociation: (
  input: UpdateDomainAssociationRequest,
) => effect.Effect<
  UpdateDomainAssociationResult,
  | AccessDenied
  | EntityNotFound
  | IllegalUpdate
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Specifies the key value store to update.
 */
export const updateKeyValueStore: (
  input: UpdateKeyValueStoreRequest,
) => effect.Effect<
  UpdateKeyValueStoreResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates a trust store.
 */
export const updateTrustStore: (
  input: UpdateTrustStoreRequest,
) => effect.Effect<
  UpdateTrustStoreResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the resource policy attached to the CloudFront resource.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | AccessDenied
  | EntityNotFound
  | IllegalDelete
  | InvalidArgument
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Associates the WAF web ACL with a distribution tenant.
 */
export const associateDistributionTenantWebACL: (
  input: AssociateDistributionTenantWebACLRequest,
) => effect.Effect<
  AssociateDistributionTenantWebACLResult,
  | AccessDenied
  | EntityLimitExceeded
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateDistributionTenantWebACLRequest,
  output: AssociateDistributionTenantWebACLResult,
  errors: [
    AccessDenied,
    EntityLimitExceeded,
    EntityNotFound,
    InvalidArgument,
    InvalidIfMatchVersion,
    PreconditionFailed,
  ],
}));
/**
 * Publishes a CloudFront function by copying the function code from the `DEVELOPMENT` stage to `LIVE`. This automatically updates all cache behaviors that are using this function to use the newly published copy in the `LIVE` stage.
 *
 * When a function is published to the `LIVE` stage, you can attach the function to a distribution's cache behavior, using the function's Amazon Resource Name (ARN).
 *
 * To publish a function, you must provide the function's name and version (`ETag` value). To get these values, you can use `ListFunctions` and `DescribeFunction`.
 */
export const publishFunction: (
  input: PublishFunctionRequest,
) => effect.Effect<
  PublishFunctionResult,
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchFunctionExists
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Disassociates a distribution tenant from the WAF web ACL.
 */
export const disassociateDistributionTenantWebACL: (
  input: DisassociateDistributionTenantWebACLRequest,
) => effect.Effect<
  DisassociateDistributionTenantWebACLResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a connection function.
 */
export const deleteConnectionFunction: (
  input: DeleteConnectionFunctionRequest,
) => effect.Effect<
  DeleteConnectionFunctionResponse,
  | AccessDenied
  | CannotDeleteEntityWhileInUse
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Specifies the key value store to delete.
 */
export const deleteKeyValueStore: (
  input: DeleteKeyValueStoreRequest,
) => effect.Effect<
  DeleteKeyValueStoreResponse,
  | AccessDenied
  | CannotDeleteEntityWhileInUse
  | EntityNotFound
  | InvalidIfMatchVersion
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a trust store.
 */
export const deleteTrustStore: (
  input: DeleteTrustStoreRequest,
) => effect.Effect<
  DeleteTrustStoreResponse,
  | AccessDenied
  | CannotDeleteEntityWhileInUse
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Delete an Amazon CloudFront VPC origin.
 */
export const deleteVpcOrigin: (
  input: DeleteVpcOriginRequest,
) => effect.Effect<
  DeleteVpcOriginResult,
  | AccessDenied
  | CannotDeleteEntityWhileInUse
  | EntityNotFound
  | IllegalDelete
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an Anycast static IP list.
 */
export const deleteAnycastIpList: (
  input: DeleteAnycastIpListRequest,
) => effect.Effect<
  DeleteAnycastIpListResponse,
  | AccessDenied
  | CannotDeleteEntityWhileInUse
  | EntityNotFound
  | IllegalDelete
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a cache policy.
 *
 * You cannot delete a cache policy if it's attached to a cache behavior. First update your distributions to remove the cache policy from all cache behaviors, then delete the cache policy.
 *
 * To delete a cache policy, you must provide the policy's identifier and version. To get these values, you can use `ListCachePolicies` or `GetCachePolicy`.
 */
export const deleteCachePolicy: (
  input: DeleteCachePolicyRequest,
) => effect.Effect<
  DeleteCachePolicyResponse,
  | AccessDenied
  | CachePolicyInUse
  | IllegalDelete
  | InvalidIfMatchVersion
  | NoSuchCachePolicy
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists connection functions.
 */
export const listConnectionFunctions: {
  (
    input: ListConnectionFunctionsRequest,
  ): effect.Effect<
    ListConnectionFunctionsResult,
    AccessDenied | InvalidArgument | UnsupportedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectionFunctionsRequest,
  ) => stream.Stream<
    ListConnectionFunctionsResult,
    AccessDenied | InvalidArgument | UnsupportedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectionFunctionsRequest,
  ) => stream.Stream<
    ConnectionFunctionSummary,
    AccessDenied | InvalidArgument | UnsupportedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectionFunctionsRequest,
  output: ListConnectionFunctionsResult,
  errors: [AccessDenied, InvalidArgument, UnsupportedOperation],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "ConnectionFunctions",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Gets a list of all CloudFront functions in your Amazon Web Services account.
 *
 * You can optionally apply a filter to return only the functions that are in the specified stage, either `DEVELOPMENT` or `LIVE`.
 *
 * You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the `NextMarker` value from the current response as the `Marker` value in the subsequent request.
 */
export const listFunctions: (
  input: ListFunctionsRequest,
) => effect.Effect<
  ListFunctionsResult,
  InvalidArgument | UnsupportedOperation | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFunctionsRequest,
  output: ListFunctionsResult,
  errors: [InvalidArgument, UnsupportedOperation],
}));
/**
 * Specifies the key value stores to list.
 */
export const listKeyValueStores: {
  (
    input: ListKeyValueStoresRequest,
  ): effect.Effect<
    ListKeyValueStoresResult,
    AccessDenied | InvalidArgument | UnsupportedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKeyValueStoresRequest,
  ) => stream.Stream<
    ListKeyValueStoresResult,
    AccessDenied | InvalidArgument | UnsupportedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKeyValueStoresRequest,
  ) => stream.Stream<
    unknown,
    AccessDenied | InvalidArgument | UnsupportedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKeyValueStoresRequest,
  output: ListKeyValueStoresResult,
  errors: [AccessDenied, InvalidArgument, UnsupportedOperation],
  pagination: {
    inputToken: "Marker",
    outputToken: "KeyValueStoreList.NextMarker",
    items: "KeyValueStoreList.Items",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Gets the code of a CloudFront function. To get configuration information and metadata about a function, use `DescribeFunction`.
 *
 * To get a function's code, you must provide the function's name and stage. To get these values, you can use `ListFunctions`.
 */
export const getFunction: (
  input: GetFunctionRequest,
) => effect.Effect<
  GetFunctionResult,
  NoSuchFunctionExists | UnsupportedOperation | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionRequest,
  output: GetFunctionResult,
  errors: [NoSuchFunctionExists, UnsupportedOperation],
}));
/**
 * Gets a connection function.
 */
export const getConnectionFunction: (
  input: GetConnectionFunctionRequest,
) => effect.Effect<
  GetConnectionFunctionResult,
  AccessDenied | EntityNotFound | UnsupportedOperation | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionFunctionRequest,
  output: GetConnectionFunctionResult,
  errors: [AccessDenied, EntityNotFound, UnsupportedOperation],
}));
/**
 * Retrieves the resource policy for the specified CloudFront resource that you own and have shared.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => effect.Effect<
  GetResourcePolicyResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Get the details of an Amazon CloudFront VPC origin.
 */
export const getVpcOrigin: (
  input: GetVpcOriginRequest,
) => effect.Effect<
  GetVpcOriginResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVpcOriginRequest,
  output: GetVpcOriginResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Lists the distributions in your account that are associated with the specified `AnycastIpListId`.
 */
export const listDistributionsByAnycastIpListId: (
  input: ListDistributionsByAnycastIpListIdRequest,
) => effect.Effect<
  ListDistributionsByAnycastIpListIdResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDistributionsByAnycastIpListIdRequest,
  output: ListDistributionsByAnycastIpListIdResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * List CloudFront distributions by their VPC origin ID.
 */
export const listDistributionsByVpcOriginId: (
  input: ListDistributionsByVpcOriginIdRequest,
) => effect.Effect<
  ListDistributionsByVpcOriginIdResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDistributionsByVpcOriginIdRequest,
  output: ListDistributionsByVpcOriginIdResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Describes a connection function.
 */
export const describeConnectionFunction: (
  input: DescribeConnectionFunctionRequest,
) => effect.Effect<
  DescribeConnectionFunctionResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectionFunctionRequest,
  output: DescribeConnectionFunctionResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Specifies the key value store and its configuration.
 */
export const describeKeyValueStore: (
  input: DescribeKeyValueStoreRequest,
) => effect.Effect<
  DescribeKeyValueStoreResult,
  | AccessDenied
  | EntityNotFound
  | InvalidArgument
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeKeyValueStoreRequest,
  output: DescribeKeyValueStoreResult,
  errors: [AccessDenied, EntityNotFound, InvalidArgument, UnsupportedOperation],
}));
/**
 * Gets information about a specific invalidation for a distribution tenant.
 */
export const getInvalidationForDistributionTenant: (
  input: GetInvalidationForDistributionTenantRequest,
) => effect.Effect<
  GetInvalidationForDistributionTenantResult,
  AccessDenied | EntityNotFound | NoSuchInvalidation | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvalidationForDistributionTenantRequest,
  output: GetInvalidationForDistributionTenantResult,
  errors: [AccessDenied, EntityNotFound, NoSuchInvalidation],
}));
/**
 * Updates a connection function.
 */
export const updateConnectionFunction: (
  input: UpdateConnectionFunctionRequest,
) => effect.Effect<
  UpdateConnectionFunctionResult,
  | AccessDenied
  | EntityNotFound
  | EntitySizeLimitExceeded
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets information about whether additional CloudWatch metrics are enabled for the specified CloudFront distribution.
 */
export const getMonitoringSubscription: (
  input: GetMonitoringSubscriptionRequest,
) => effect.Effect<
  GetMonitoringSubscriptionResult,
  | AccessDenied
  | NoSuchDistribution
  | NoSuchMonitoringSubscription
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMonitoringSubscriptionRequest,
  output: GetMonitoringSubscriptionResult,
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
export const deleteOriginAccessControl: (
  input: DeleteOriginAccessControlRequest,
) => effect.Effect<
  DeleteOriginAccessControlResponse,
  | AccessDenied
  | InvalidIfMatchVersion
  | NoSuchOriginAccessControl
  | OriginAccessControlInUse
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOriginAccessControlRequest,
  output: DeleteOriginAccessControlResponse,
  errors: [
    AccessDenied,
    InvalidIfMatchVersion,
    NoSuchOriginAccessControl,
    OriginAccessControlInUse,
    PreconditionFailed,
  ],
}));
/**
 * List the distributions that are associated with a specified WAF web ACL.
 */
export const listDistributionsByWebACLId: (
  input: ListDistributionsByWebACLIdRequest,
) => effect.Effect<
  ListDistributionsByWebACLIdResult,
  InvalidArgument | InvalidWebACLId | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDistributionsByWebACLIdRequest,
  output: ListDistributionsByWebACLIdResult,
  errors: [InvalidArgument, InvalidWebACLId],
}));
/**
 * List tags for a CloudFront resource. For more information, see Tagging a distribution in the *Amazon CloudFront Developer Guide*.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResult,
  | AccessDenied
  | InvalidArgument
  | InvalidTagging
  | NoSuchResource
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [AccessDenied, InvalidArgument, InvalidTagging, NoSuchResource],
}));
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
export const associateAlias: (
  input: AssociateAliasRequest,
) => effect.Effect<
  AssociateAliasResponse,
  | AccessDenied
  | IllegalUpdate
  | InvalidArgument
  | NoSuchDistribution
  | TooManyDistributionCNAMEs
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRealtimeLogConfig: (
  input: UpdateRealtimeLogConfigRequest,
) => effect.Effect<
  UpdateRealtimeLogConfigResult,
  AccessDenied | InvalidArgument | NoSuchRealtimeLogConfig | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRealtimeLogConfigRequest,
  output: UpdateRealtimeLogConfigResult,
  errors: [AccessDenied, InvalidArgument, NoSuchRealtimeLogConfig],
}));
/**
 * Gets a real-time log configuration.
 *
 * To get a real-time log configuration, you can provide the configuration's name or its Amazon Resource Name (ARN). You must provide at least one. If you provide both, CloudFront uses the name to identify the real-time log configuration to get.
 */
export const getRealtimeLogConfig: (
  input: GetRealtimeLogConfigRequest,
) => effect.Effect<
  GetRealtimeLogConfigResult,
  AccessDenied | InvalidArgument | NoSuchRealtimeLogConfig | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRealtimeLogConfigRequest,
  output: GetRealtimeLogConfigResult,
  errors: [AccessDenied, InvalidArgument, NoSuchRealtimeLogConfig],
}));
/**
 * Updates a distribution tenant.
 */
export const updateDistributionTenant: (
  input: UpdateDistributionTenantRequest,
) => effect.Effect<
  UpdateDistributionTenantResult,
  | AccessDenied
  | CNAMEAlreadyExists
  | EntityAlreadyExists
  | EntityLimitExceeded
  | EntityNotFound
  | InvalidArgument
  | InvalidAssociation
  | InvalidIfMatchVersion
  | PreconditionFailed
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Get the information about an invalidation.
 */
export const getInvalidation: (
  input: GetInvalidationRequest,
) => effect.Effect<
  GetInvalidationResult,
  AccessDenied | NoSuchDistribution | NoSuchInvalidation | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvalidationRequest,
  output: GetInvalidationResult,
  errors: [AccessDenied, NoSuchDistribution, NoSuchInvalidation],
}));
/**
 * Specifies the key value store resource to add to your account. In your account, the key value store names must be unique. You can also import key value store data in JSON format from an S3 bucket by providing a valid `ImportSource` that you own.
 */
export const createKeyValueStore: (
  input: CreateKeyValueStoreRequest,
) => effect.Effect<
  CreateKeyValueStoreResult,
  | AccessDenied
  | EntityAlreadyExists
  | EntityLimitExceeded
  | EntitySizeLimitExceeded
  | InvalidArgument
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Disables additional CloudWatch metrics for the specified CloudFront distribution.
 */
export const deleteMonitoringSubscription: (
  input: DeleteMonitoringSubscriptionRequest,
) => effect.Effect<
  DeleteMonitoringSubscriptionResult,
  | AccessDenied
  | NoSuchDistribution
  | NoSuchMonitoringSubscription
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Remove tags from a CloudFront resource. For more information, see Tagging a distribution in the *Amazon CloudFront Developer Guide*.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDenied
  | InvalidArgument
  | InvalidTagging
  | NoSuchResource
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [AccessDenied, InvalidArgument, InvalidTagging, NoSuchResource],
}));
/**
 * Add tags to a CloudFront resource. For more information, see Tagging a distribution in the *Amazon CloudFront Developer Guide*.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDenied
  | InvalidArgument
  | InvalidTagging
  | NoSuchResource
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [AccessDenied, InvalidArgument, InvalidTagging, NoSuchResource],
}));
/**
 * Creates a connection group.
 */
export const createConnectionGroup: (
  input: CreateConnectionGroupRequest,
) => effect.Effect<
  CreateConnectionGroupResult,
  | AccessDenied
  | EntityAlreadyExists
  | EntityLimitExceeded
  | EntityNotFound
  | InvalidArgument
  | InvalidTagging
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates an Anycast static IP list.
 */
export const createAnycastIpList: (
  input: CreateAnycastIpListRequest,
) => effect.Effect<
  CreateAnycastIpListResult,
  | AccessDenied
  | EntityAlreadyExists
  | EntityLimitExceeded
  | InvalidArgument
  | InvalidTagging
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a trust store.
 */
export const createTrustStore: (
  input: CreateTrustStoreRequest,
) => effect.Effect<
  CreateTrustStoreResult,
  | AccessDenied
  | EntityAlreadyExists
  | EntityLimitExceeded
  | EntityNotFound
  | InvalidArgument
  | InvalidTagging
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVpcOrigin: (
  input: CreateVpcOriginRequest,
) => effect.Effect<
  CreateVpcOriginResult,
  | AccessDenied
  | EntityAlreadyExists
  | EntityLimitExceeded
  | InconsistentQuantities
  | InvalidArgument
  | InvalidTagging
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a distribution tenant.
 */
export const createDistributionTenant: (
  input: CreateDistributionTenantRequest,
) => effect.Effect<
  CreateDistributionTenantResult,
  | AccessDenied
  | CNAMEAlreadyExists
  | EntityAlreadyExists
  | EntityLimitExceeded
  | EntityNotFound
  | InvalidArgument
  | InvalidAssociation
  | InvalidTagging
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a connection function.
 */
export const createConnectionFunction: (
  input: CreateConnectionFunctionRequest,
) => effect.Effect<
  CreateConnectionFunctionResult,
  | AccessDenied
  | EntityAlreadyExists
  | EntityLimitExceeded
  | EntitySizeLimitExceeded
  | InvalidArgument
  | InvalidTagging
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Enables or disables additional Amazon CloudWatch metrics for the specified CloudFront distribution. The additional metrics incur an additional cost.
 *
 * For more information, see Viewing additional CloudFront distribution metrics in the *Amazon CloudFront Developer Guide*.
 */
export const createMonitoringSubscription: (
  input: CreateMonitoringSubscriptionRequest,
) => effect.Effect<
  CreateMonitoringSubscriptionResult,
  | AccessDenied
  | MonitoringSubscriptionAlreadyExists
  | NoSuchDistribution
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a key group.
 *
 * You cannot delete a key group that is referenced in a cache behavior. First update your distributions to remove the key group from all cache behaviors, then delete the key group.
 *
 * To delete a key group, you must provide the key group's identifier and version. To get these values, use `ListKeyGroups` followed by `GetKeyGroup` or `GetKeyGroupConfig`.
 */
export const deleteKeyGroup: (
  input: DeleteKeyGroupRequest,
) => effect.Effect<
  DeleteKeyGroupResponse,
  | InvalidIfMatchVersion
  | NoSuchResource
  | PreconditionFailed
  | ResourceInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Create a new invalidation. For more information, see Invalidating files in the *Amazon CloudFront Developer Guide*.
 */
export const createInvalidation: (
  input: CreateInvalidationRequest,
) => effect.Effect<
  CreateInvalidationResult,
  | AccessDenied
  | BatchTooLarge
  | InconsistentQuantities
  | InvalidArgument
  | MissingBody
  | NoSuchDistribution
  | TooManyInvalidationsInProgress
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateContinuousDeploymentPolicy: (
  input: UpdateContinuousDeploymentPolicyRequest,
) => effect.Effect<
  UpdateContinuousDeploymentPolicyResult,
  | AccessDenied
  | InconsistentQuantities
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchContinuousDeploymentPolicy
  | PreconditionFailed
  | StagingDistributionInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a distribution tenant. If you use this API operation to delete a distribution tenant that is currently enabled, the request will fail.
 *
 * To delete a distribution tenant, you must first disable the distribution tenant by using the `UpdateDistributionTenant` API operation.
 */
export const deleteDistributionTenant: (
  input: DeleteDistributionTenantRequest,
) => effect.Effect<
  DeleteDistributionTenantResponse,
  | AccessDenied
  | EntityNotFound
  | InvalidIfMatchVersion
  | PreconditionFailed
  | ResourceNotDisabled
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDistributionTenantRequest,
  output: DeleteDistributionTenantResponse,
  errors: [
    AccessDenied,
    EntityNotFound,
    InvalidIfMatchVersion,
    PreconditionFailed,
    ResourceNotDisabled,
  ],
}));
/**
 * Remove a public key you previously added to CloudFront.
 */
export const deletePublicKey: (
  input: DeletePublicKeyRequest,
) => effect.Effect<
  DeletePublicKeyResponse,
  | AccessDenied
  | InvalidIfMatchVersion
  | NoSuchPublicKey
  | PreconditionFailed
  | PublicKeyInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteStreamingDistribution: (
  input: DeleteStreamingDistributionRequest,
) => effect.Effect<
  DeleteStreamingDistributionResponse,
  | AccessDenied
  | InvalidIfMatchVersion
  | NoSuchStreamingDistribution
  | PreconditionFailed
  | StreamingDistributionNotDisabled
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStreamingDistributionRequest,
  output: DeleteStreamingDistributionResponse,
  errors: [
    AccessDenied,
    InvalidIfMatchVersion,
    NoSuchStreamingDistribution,
    PreconditionFailed,
    StreamingDistributionNotDisabled,
  ],
}));
/**
 * Deletes a response headers policy.
 *
 * You cannot delete a response headers policy if it's attached to a cache behavior. First update your distributions to remove the response headers policy from all cache behaviors, then delete the response headers policy.
 *
 * To delete a response headers policy, you must provide the policy's identifier and version. To get these values, you can use `ListResponseHeadersPolicies` or `GetResponseHeadersPolicy`.
 */
export const deleteResponseHeadersPolicy: (
  input: DeleteResponseHeadersPolicyRequest,
) => effect.Effect<
  DeleteResponseHeadersPolicyResponse,
  | AccessDenied
  | IllegalDelete
  | InvalidIfMatchVersion
  | NoSuchResponseHeadersPolicy
  | PreconditionFailed
  | ResponseHeadersPolicyInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates a connection group.
 */
export const updateConnectionGroup: (
  input: UpdateConnectionGroupRequest,
) => effect.Effect<
  UpdateConnectionGroupResult,
  | AccessDenied
  | EntityAlreadyExists
  | EntityLimitExceeded
  | EntityNotFound
  | InvalidArgument
  | InvalidIfMatchVersion
  | PreconditionFailed
  | ResourceInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Delete a distribution.
 *
 * Before you can delete a distribution, you must disable it, which requires permission to update the distribution. Once deleted, a distribution cannot be recovered.
 */
export const deleteDistribution: (
  input: DeleteDistributionRequest,
) => effect.Effect<
  DeleteDistributionResponse,
  | AccessDenied
  | DistributionNotDisabled
  | InvalidIfMatchVersion
  | NoSuchDistribution
  | PreconditionFailed
  | ResourceInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateKeyGroup: (
  input: UpdateKeyGroupRequest,
) => effect.Effect<
  UpdateKeyGroupResult,
  | InvalidArgument
  | InvalidIfMatchVersion
  | KeyGroupAlreadyExists
  | NoSuchResource
  | PreconditionFailed
  | TooManyPublicKeysInKeyGroup
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Uploads a public key to CloudFront that you can use with signed URLs and signed cookies, or with field-level encryption.
 */
export const createPublicKey: (
  input: CreatePublicKeyRequest,
) => effect.Effect<
  CreatePublicKeyResult,
  InvalidArgument | PublicKeyAlreadyExists | TooManyPublicKeys | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePublicKeyRequest,
  output: CreatePublicKeyResult,
  errors: [InvalidArgument, PublicKeyAlreadyExists, TooManyPublicKeys],
}));
/**
 * Deletes a real-time log configuration.
 *
 * You cannot delete a real-time log configuration if it's attached to a cache behavior. First update your distributions to remove the real-time log configuration from all cache behaviors, then delete the real-time log configuration.
 *
 * To delete a real-time log configuration, you can provide the configuration's name or its Amazon Resource Name (ARN). You must provide at least one. If you provide both, CloudFront uses the name to identify the real-time log configuration to delete.
 */
export const deleteRealtimeLogConfig: (
  input: DeleteRealtimeLogConfigRequest,
) => effect.Effect<
  DeleteRealtimeLogConfigResponse,
  | AccessDenied
  | InvalidArgument
  | NoSuchRealtimeLogConfig
  | RealtimeLogConfigInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRealtimeLogConfigRequest,
  output: DeleteRealtimeLogConfigResponse,
  errors: [
    AccessDenied,
    InvalidArgument,
    NoSuchRealtimeLogConfig,
    RealtimeLogConfigInUse,
  ],
}));
/**
 * Creates a new origin access identity. If you're using Amazon S3 for your origin, you can use an origin access identity to require users to access your content using a CloudFront URL instead of the Amazon S3 URL. For more information about how to use origin access identities, see Serving Private Content through CloudFront in the *Amazon CloudFront Developer Guide*.
 */
export const createCloudFrontOriginAccessIdentity: (
  input: CreateCloudFrontOriginAccessIdentityRequest,
) => effect.Effect<
  CreateCloudFrontOriginAccessIdentityResult,
  | CloudFrontOriginAccessIdentityAlreadyExists
  | InconsistentQuantities
  | InvalidArgument
  | MissingBody
  | TooManyCloudFrontOriginAccessIdentities
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new origin access control in CloudFront. After you create an origin access control, you can add it to an origin in a CloudFront distribution so that CloudFront sends authenticated (signed) requests to the origin.
 *
 * This makes it possible to block public access to the origin, allowing viewers (users) to access the origin's content only through CloudFront.
 *
 * For more information about using a CloudFront origin access control, see Restricting access to an Amazon Web Services origin in the *Amazon CloudFront Developer Guide*.
 */
export const createOriginAccessControl: (
  input: CreateOriginAccessControlRequest,
) => effect.Effect<
  CreateOriginAccessControlResult,
  | InvalidArgument
  | OriginAccessControlAlreadyExists
  | TooManyOriginAccessControls
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOriginAccessControlRequest,
  output: CreateOriginAccessControlResult,
  errors: [
    InvalidArgument,
    OriginAccessControlAlreadyExists,
    TooManyOriginAccessControls,
  ],
}));
/**
 * Creates an invalidation for a distribution tenant. For more information, see Invalidating files in the *Amazon CloudFront Developer Guide*.
 */
export const createInvalidationForDistributionTenant: (
  input: CreateInvalidationForDistributionTenantRequest,
) => effect.Effect<
  CreateInvalidationForDistributionTenantResult,
  | AccessDenied
  | BatchTooLarge
  | EntityNotFound
  | InconsistentQuantities
  | InvalidArgument
  | MissingBody
  | TooManyInvalidationsInProgress
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a connection group.
 */
export const deleteConnectionGroup: (
  input: DeleteConnectionGroupRequest,
) => effect.Effect<
  DeleteConnectionGroupResponse,
  | AccessDenied
  | CannotDeleteEntityWhileInUse
  | EntityNotFound
  | InvalidIfMatchVersion
  | PreconditionFailed
  | ResourceNotDisabled
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a key group that you can use with CloudFront signed URLs and signed cookies.
 *
 * To create a key group, you must specify at least one public key for the key group. After you create a key group, you can reference it from one or more cache behaviors. When you reference a key group in a cache behavior, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with a private key whose corresponding public key is in the key group. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see Serving private content in the *Amazon CloudFront Developer Guide*.
 */
export const createKeyGroup: (
  input: CreateKeyGroupRequest,
) => effect.Effect<
  CreateKeyGroupResult,
  | InvalidArgument
  | KeyGroupAlreadyExists
  | TooManyKeyGroups
  | TooManyPublicKeysInKeyGroup
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a CloudFront function.
 *
 * To create a function, you provide the function code and some configuration information about the function. The response contains an Amazon Resource Name (ARN) that uniquely identifies the function.
 *
 * When you create a function, it's in the `DEVELOPMENT` stage. In this stage, you can test the function with `TestFunction`, and update it with `UpdateFunction`.
 *
 * When you're ready to use your function with a CloudFront distribution, use `PublishFunction` to copy the function from the `DEVELOPMENT` stage to `LIVE`. When it's live, you can attach the function to a distribution's cache behavior, using the function's ARN.
 */
export const createFunction: (
  input: CreateFunctionRequest,
) => effect.Effect<
  CreateFunctionResult,
  | FunctionAlreadyExists
  | FunctionSizeLimitExceeded
  | InvalidArgument
  | TooManyFunctions
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a real-time log configuration.
 *
 * After you create a real-time log configuration, you can attach it to one or more cache behaviors to send real-time log data to the specified Amazon Kinesis data stream.
 *
 * For more information about real-time log configurations, see Real-time logs in the *Amazon CloudFront Developer Guide*.
 */
export const createRealtimeLogConfig: (
  input: CreateRealtimeLogConfigRequest,
) => effect.Effect<
  CreateRealtimeLogConfigResult,
  | AccessDenied
  | InvalidArgument
  | RealtimeLogConfigAlreadyExists
  | TooManyRealtimeLogConfigs
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRealtimeLogConfigRequest,
  output: CreateRealtimeLogConfigResult,
  errors: [
    AccessDenied,
    InvalidArgument,
    RealtimeLogConfigAlreadyExists,
    TooManyRealtimeLogConfigs,
  ],
}));
/**
 * Update a field-level encryption profile.
 */
export const updateFieldLevelEncryptionProfile: (
  input: UpdateFieldLevelEncryptionProfileRequest,
) => effect.Effect<
  UpdateFieldLevelEncryptionProfileResult,
  | AccessDenied
  | FieldLevelEncryptionProfileAlreadyExists
  | FieldLevelEncryptionProfileSizeExceeded
  | IllegalUpdate
  | InconsistentQuantities
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchFieldLevelEncryptionProfile
  | NoSuchPublicKey
  | PreconditionFailed
  | TooManyFieldLevelEncryptionEncryptionEntities
  | TooManyFieldLevelEncryptionFieldPatterns
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateOriginRequestPolicy: (
  input: UpdateOriginRequestPolicyRequest,
) => effect.Effect<
  UpdateOriginRequestPolicyResult,
  | AccessDenied
  | IllegalUpdate
  | InconsistentQuantities
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchOriginRequestPolicy
  | OriginRequestPolicyAlreadyExists
  | PreconditionFailed
  | TooManyCookiesInOriginRequestPolicy
  | TooManyHeadersInOriginRequestPolicy
  | TooManyQueryStringsInOriginRequestPolicy
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Update a field-level encryption configuration.
 */
export const updateFieldLevelEncryptionConfig: (
  input: UpdateFieldLevelEncryptionConfigRequest,
) => effect.Effect<
  UpdateFieldLevelEncryptionConfigResult,
  | AccessDenied
  | IllegalUpdate
  | InconsistentQuantities
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchFieldLevelEncryptionConfig
  | NoSuchFieldLevelEncryptionProfile
  | PreconditionFailed
  | QueryArgProfileEmpty
  | TooManyFieldLevelEncryptionContentTypeProfiles
  | TooManyFieldLevelEncryptionQueryArgProfiles
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCachePolicy: (
  input: UpdateCachePolicyRequest,
) => effect.Effect<
  UpdateCachePolicyResult,
  | AccessDenied
  | CachePolicyAlreadyExists
  | IllegalUpdate
  | InconsistentQuantities
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchCachePolicy
  | PreconditionFailed
  | TooManyCookiesInCachePolicy
  | TooManyHeadersInCachePolicy
  | TooManyQueryStringsInCachePolicy
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Create a field-level encryption profile.
 */
export const createFieldLevelEncryptionProfile: (
  input: CreateFieldLevelEncryptionProfileRequest,
) => effect.Effect<
  CreateFieldLevelEncryptionProfileResult,
  | FieldLevelEncryptionProfileAlreadyExists
  | FieldLevelEncryptionProfileSizeExceeded
  | InconsistentQuantities
  | InvalidArgument
  | NoSuchPublicKey
  | TooManyFieldLevelEncryptionEncryptionEntities
  | TooManyFieldLevelEncryptionFieldPatterns
  | TooManyFieldLevelEncryptionProfiles
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createOriginRequestPolicy: (
  input: CreateOriginRequestPolicyRequest,
) => effect.Effect<
  CreateOriginRequestPolicyResult,
  | AccessDenied
  | InconsistentQuantities
  | InvalidArgument
  | OriginRequestPolicyAlreadyExists
  | TooManyCookiesInOriginRequestPolicy
  | TooManyHeadersInOriginRequestPolicy
  | TooManyOriginRequestPolicies
  | TooManyQueryStringsInOriginRequestPolicy
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const createCachePolicy: (
  input: CreateCachePolicyRequest,
) => effect.Effect<
  CreateCachePolicyResult,
  | AccessDenied
  | CachePolicyAlreadyExists
  | InconsistentQuantities
  | InvalidArgument
  | TooManyCachePolicies
  | TooManyCookiesInCachePolicy
  | TooManyHeadersInCachePolicy
  | TooManyQueryStringsInCachePolicy
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a continuous deployment policy that distributes traffic for a custom domain name to two different CloudFront distributions.
 *
 * To use a continuous deployment policy, first use `CopyDistribution` to create a staging distribution, then use `UpdateDistribution` to modify the staging distribution's configuration.
 *
 * After you create and update a staging distribution, you can use a continuous deployment policy to incrementally move traffic to the staging distribution. This workflow enables you to test changes to a distribution's configuration before moving all of your domain's production traffic to the new configuration.
 */
export const createContinuousDeploymentPolicy: (
  input: CreateContinuousDeploymentPolicyRequest,
) => effect.Effect<
  CreateContinuousDeploymentPolicyResult,
  | AccessDenied
  | ContinuousDeploymentPolicyAlreadyExists
  | InconsistentQuantities
  | InvalidArgument
  | StagingDistributionInUse
  | TooManyContinuousDeploymentPolicies
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFieldLevelEncryptionConfig: (
  input: CreateFieldLevelEncryptionConfigRequest,
) => effect.Effect<
  CreateFieldLevelEncryptionConfigResult,
  | FieldLevelEncryptionConfigAlreadyExists
  | InconsistentQuantities
  | InvalidArgument
  | NoSuchFieldLevelEncryptionProfile
  | QueryArgProfileEmpty
  | TooManyFieldLevelEncryptionConfigs
  | TooManyFieldLevelEncryptionContentTypeProfiles
  | TooManyFieldLevelEncryptionQueryArgProfiles
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateResponseHeadersPolicy: (
  input: UpdateResponseHeadersPolicyRequest,
) => effect.Effect<
  UpdateResponseHeadersPolicyResult,
  | AccessDenied
  | IllegalUpdate
  | InconsistentQuantities
  | InvalidArgument
  | InvalidIfMatchVersion
  | NoSuchResponseHeadersPolicy
  | PreconditionFailed
  | ResponseHeadersPolicyAlreadyExists
  | TooLongCSPInResponseHeadersPolicy
  | TooManyCustomHeadersInResponseHeadersPolicy
  | TooManyRemoveHeadersInResponseHeadersPolicy
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Update a streaming distribution.
 */
export const updateStreamingDistribution: (
  input: UpdateStreamingDistributionRequest,
) => effect.Effect<
  UpdateStreamingDistributionResult,
  | AccessDenied
  | CNAMEAlreadyExists
  | IllegalUpdate
  | InconsistentQuantities
  | InvalidArgument
  | InvalidIfMatchVersion
  | InvalidOriginAccessControl
  | InvalidOriginAccessIdentity
  | MissingBody
  | NoSuchStreamingDistribution
  | PreconditionFailed
  | TooManyStreamingDistributionCNAMEs
  | TooManyTrustedSigners
  | TrustedSignerDoesNotExist
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * This API is deprecated. Amazon CloudFront is deprecating real-time messaging protocol (RTMP) distributions on December 31, 2020. For more information, read the announcement on the Amazon CloudFront discussion forum.
 */
export const createStreamingDistributionWithTags: (
  input: CreateStreamingDistributionWithTagsRequest,
) => effect.Effect<
  CreateStreamingDistributionWithTagsResult,
  | AccessDenied
  | CNAMEAlreadyExists
  | InconsistentQuantities
  | InvalidArgument
  | InvalidOrigin
  | InvalidOriginAccessControl
  | InvalidOriginAccessIdentity
  | InvalidTagging
  | MissingBody
  | StreamingDistributionAlreadyExists
  | TooManyStreamingDistributionCNAMEs
  | TooManyStreamingDistributions
  | TooManyTrustedSigners
  | TrustedSignerDoesNotExist
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * This API is deprecated. Amazon CloudFront is deprecating real-time messaging protocol (RTMP) distributions on December 31, 2020. For more information, read the announcement on the Amazon CloudFront discussion forum.
 */
export const createStreamingDistribution: (
  input: CreateStreamingDistributionRequest,
) => effect.Effect<
  CreateStreamingDistributionResult,
  | AccessDenied
  | CNAMEAlreadyExists
  | InconsistentQuantities
  | InvalidArgument
  | InvalidOrigin
  | InvalidOriginAccessControl
  | InvalidOriginAccessIdentity
  | MissingBody
  | StreamingDistributionAlreadyExists
  | TooManyStreamingDistributionCNAMEs
  | TooManyStreamingDistributions
  | TooManyTrustedSigners
  | TrustedSignerDoesNotExist
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createResponseHeadersPolicy: (
  input: CreateResponseHeadersPolicyRequest,
) => effect.Effect<
  CreateResponseHeadersPolicyResult,
  | AccessDenied
  | InconsistentQuantities
  | InvalidArgument
  | ResponseHeadersPolicyAlreadyExists
  | TooLongCSPInResponseHeadersPolicy
  | TooManyCustomHeadersInResponseHeadersPolicy
  | TooManyRemoveHeadersInResponseHeadersPolicy
  | TooManyResponseHeadersPolicies
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDistributionWithStagingConfig: (
  input: UpdateDistributionWithStagingConfigRequest,
) => effect.Effect<
  UpdateDistributionWithStagingConfigResult,
  | AccessDenied
  | CNAMEAlreadyExists
  | EntityLimitExceeded
  | EntityNotFound
  | IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior
  | IllegalUpdate
  | InconsistentQuantities
  | InvalidArgument
  | InvalidDefaultRootObject
  | InvalidErrorCode
  | InvalidForwardCookies
  | InvalidFunctionAssociation
  | InvalidGeoRestrictionParameter
  | InvalidHeadersForS3Origin
  | InvalidIfMatchVersion
  | InvalidLambdaFunctionAssociation
  | InvalidLocationCode
  | InvalidMinimumProtocolVersion
  | InvalidOriginAccessControl
  | InvalidOriginAccessIdentity
  | InvalidOriginKeepaliveTimeout
  | InvalidOriginReadTimeout
  | InvalidQueryStringParameters
  | InvalidRelativePath
  | InvalidRequiredProtocol
  | InvalidResponseCode
  | InvalidTTLOrder
  | InvalidViewerCertificate
  | InvalidWebACLId
  | MissingBody
  | NoSuchCachePolicy
  | NoSuchDistribution
  | NoSuchFieldLevelEncryptionConfig
  | NoSuchOrigin
  | NoSuchOriginRequestPolicy
  | NoSuchRealtimeLogConfig
  | NoSuchResponseHeadersPolicy
  | PreconditionFailed
  | RealtimeLogConfigOwnerMismatch
  | TooManyCacheBehaviors
  | TooManyCertificates
  | TooManyCookieNamesInWhiteList
  | TooManyDistributionCNAMEs
  | TooManyDistributionsAssociatedToCachePolicy
  | TooManyDistributionsAssociatedToFieldLevelEncryptionConfig
  | TooManyDistributionsAssociatedToKeyGroup
  | TooManyDistributionsAssociatedToOriginAccessControl
  | TooManyDistributionsAssociatedToOriginRequestPolicy
  | TooManyDistributionsAssociatedToResponseHeadersPolicy
  | TooManyDistributionsWithFunctionAssociations
  | TooManyDistributionsWithLambdaAssociations
  | TooManyDistributionsWithSingleFunctionARN
  | TooManyFunctionAssociations
  | TooManyHeadersInForwardedValues
  | TooManyKeyGroupsAssociatedToDistribution
  | TooManyLambdaFunctionAssociations
  | TooManyOriginCustomHeaders
  | TooManyOriginGroupsPerDistribution
  | TooManyOrigins
  | TooManyQueryStringParameters
  | TooManyTrustedSigners
  | TrustedKeyGroupDoesNotExist
  | TrustedSignerDoesNotExist
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDistributionWithStagingConfigRequest,
  output: UpdateDistributionWithStagingConfigResult,
  errors: [
    AccessDenied,
    CNAMEAlreadyExists,
    EntityLimitExceeded,
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
 * Create a new distribution with tags. This API operation requires the following IAM permissions:
 *
 * - CreateDistribution
 *
 * - TagResource
 */
export const createDistributionWithTags: (
  input: CreateDistributionWithTagsRequest,
) => effect.Effect<
  CreateDistributionWithTagsResult,
  | AccessDenied
  | CNAMEAlreadyExists
  | ContinuousDeploymentPolicyInUse
  | DistributionAlreadyExists
  | EntityNotFound
  | IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior
  | IllegalOriginAccessConfiguration
  | InconsistentQuantities
  | InvalidArgument
  | InvalidDefaultRootObject
  | InvalidDomainNameForOriginAccessControl
  | InvalidErrorCode
  | InvalidForwardCookies
  | InvalidFunctionAssociation
  | InvalidGeoRestrictionParameter
  | InvalidHeadersForS3Origin
  | InvalidLambdaFunctionAssociation
  | InvalidLocationCode
  | InvalidMinimumProtocolVersion
  | InvalidOrigin
  | InvalidOriginAccessControl
  | InvalidOriginAccessIdentity
  | InvalidOriginKeepaliveTimeout
  | InvalidOriginReadTimeout
  | InvalidProtocolSettings
  | InvalidQueryStringParameters
  | InvalidRelativePath
  | InvalidRequiredProtocol
  | InvalidResponseCode
  | InvalidTagging
  | InvalidTTLOrder
  | InvalidViewerCertificate
  | InvalidWebACLId
  | MissingBody
  | NoSuchCachePolicy
  | NoSuchContinuousDeploymentPolicy
  | NoSuchFieldLevelEncryptionConfig
  | NoSuchOrigin
  | NoSuchOriginRequestPolicy
  | NoSuchRealtimeLogConfig
  | NoSuchResponseHeadersPolicy
  | RealtimeLogConfigOwnerMismatch
  | TooManyCacheBehaviors
  | TooManyCertificates
  | TooManyCookieNamesInWhiteList
  | TooManyDistributionCNAMEs
  | TooManyDistributions
  | TooManyDistributionsAssociatedToCachePolicy
  | TooManyDistributionsAssociatedToFieldLevelEncryptionConfig
  | TooManyDistributionsAssociatedToKeyGroup
  | TooManyDistributionsAssociatedToOriginAccessControl
  | TooManyDistributionsAssociatedToOriginRequestPolicy
  | TooManyDistributionsAssociatedToResponseHeadersPolicy
  | TooManyDistributionsWithFunctionAssociations
  | TooManyDistributionsWithLambdaAssociations
  | TooManyDistributionsWithSingleFunctionARN
  | TooManyFunctionAssociations
  | TooManyHeadersInForwardedValues
  | TooManyKeyGroupsAssociatedToDistribution
  | TooManyLambdaFunctionAssociations
  | TooManyOriginCustomHeaders
  | TooManyOriginGroupsPerDistribution
  | TooManyOrigins
  | TooManyQueryStringParameters
  | TooManyTrustedSigners
  | TrustedKeyGroupDoesNotExist
  | TrustedSignerDoesNotExist
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const updateDistribution: (
  input: UpdateDistributionRequest,
) => effect.Effect<
  UpdateDistributionResult,
  | AccessDenied
  | CNAMEAlreadyExists
  | ContinuousDeploymentPolicyInUse
  | EntityNotFound
  | IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior
  | IllegalOriginAccessConfiguration
  | IllegalUpdate
  | InconsistentQuantities
  | InvalidArgument
  | InvalidDefaultRootObject
  | InvalidDomainNameForOriginAccessControl
  | InvalidErrorCode
  | InvalidForwardCookies
  | InvalidFunctionAssociation
  | InvalidGeoRestrictionParameter
  | InvalidHeadersForS3Origin
  | InvalidIfMatchVersion
  | InvalidLambdaFunctionAssociation
  | InvalidLocationCode
  | InvalidMinimumProtocolVersion
  | InvalidOriginAccessControl
  | InvalidOriginAccessIdentity
  | InvalidOriginKeepaliveTimeout
  | InvalidOriginReadTimeout
  | InvalidQueryStringParameters
  | InvalidRelativePath
  | InvalidRequiredProtocol
  | InvalidResponseCode
  | InvalidTTLOrder
  | InvalidViewerCertificate
  | InvalidWebACLId
  | MissingBody
  | NoSuchCachePolicy
  | NoSuchContinuousDeploymentPolicy
  | NoSuchDistribution
  | NoSuchFieldLevelEncryptionConfig
  | NoSuchOrigin
  | NoSuchOriginRequestPolicy
  | NoSuchRealtimeLogConfig
  | NoSuchResponseHeadersPolicy
  | PreconditionFailed
  | RealtimeLogConfigOwnerMismatch
  | StagingDistributionInUse
  | TooManyCacheBehaviors
  | TooManyCertificates
  | TooManyCookieNamesInWhiteList
  | TooManyDistributionCNAMEs
  | TooManyDistributionsAssociatedToCachePolicy
  | TooManyDistributionsAssociatedToFieldLevelEncryptionConfig
  | TooManyDistributionsAssociatedToKeyGroup
  | TooManyDistributionsAssociatedToOriginAccessControl
  | TooManyDistributionsAssociatedToOriginRequestPolicy
  | TooManyDistributionsAssociatedToResponseHeadersPolicy
  | TooManyDistributionsWithFunctionAssociations
  | TooManyDistributionsWithLambdaAssociations
  | TooManyDistributionsWithSingleFunctionARN
  | TooManyFunctionAssociations
  | TooManyHeadersInForwardedValues
  | TooManyKeyGroupsAssociatedToDistribution
  | TooManyLambdaFunctionAssociations
  | TooManyOriginCustomHeaders
  | TooManyOriginGroupsPerDistribution
  | TooManyOrigins
  | TooManyQueryStringParameters
  | TooManyTrustedSigners
  | TrustedKeyGroupDoesNotExist
  | TrustedSignerDoesNotExist
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const copyDistribution: (
  input: CopyDistributionRequest,
) => effect.Effect<
  CopyDistributionResult,
  | AccessDenied
  | CNAMEAlreadyExists
  | DistributionAlreadyExists
  | IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior
  | InconsistentQuantities
  | InvalidArgument
  | InvalidDefaultRootObject
  | InvalidErrorCode
  | InvalidForwardCookies
  | InvalidFunctionAssociation
  | InvalidGeoRestrictionParameter
  | InvalidHeadersForS3Origin
  | InvalidIfMatchVersion
  | InvalidLambdaFunctionAssociation
  | InvalidLocationCode
  | InvalidMinimumProtocolVersion
  | InvalidOrigin
  | InvalidOriginAccessControl
  | InvalidOriginAccessIdentity
  | InvalidOriginKeepaliveTimeout
  | InvalidOriginReadTimeout
  | InvalidProtocolSettings
  | InvalidQueryStringParameters
  | InvalidRelativePath
  | InvalidRequiredProtocol
  | InvalidResponseCode
  | InvalidTTLOrder
  | InvalidViewerCertificate
  | InvalidWebACLId
  | MissingBody
  | NoSuchCachePolicy
  | NoSuchDistribution
  | NoSuchFieldLevelEncryptionConfig
  | NoSuchOrigin
  | NoSuchOriginRequestPolicy
  | NoSuchRealtimeLogConfig
  | NoSuchResponseHeadersPolicy
  | PreconditionFailed
  | RealtimeLogConfigOwnerMismatch
  | TooManyCacheBehaviors
  | TooManyCertificates
  | TooManyCookieNamesInWhiteList
  | TooManyDistributionCNAMEs
  | TooManyDistributions
  | TooManyDistributionsAssociatedToCachePolicy
  | TooManyDistributionsAssociatedToFieldLevelEncryptionConfig
  | TooManyDistributionsAssociatedToKeyGroup
  | TooManyDistributionsAssociatedToOriginAccessControl
  | TooManyDistributionsAssociatedToOriginRequestPolicy
  | TooManyDistributionsAssociatedToResponseHeadersPolicy
  | TooManyDistributionsWithFunctionAssociations
  | TooManyDistributionsWithLambdaAssociations
  | TooManyDistributionsWithSingleFunctionARN
  | TooManyFunctionAssociations
  | TooManyHeadersInForwardedValues
  | TooManyKeyGroupsAssociatedToDistribution
  | TooManyLambdaFunctionAssociations
  | TooManyOriginCustomHeaders
  | TooManyOriginGroupsPerDistribution
  | TooManyOrigins
  | TooManyQueryStringParameters
  | TooManyTrustedSigners
  | TrustedKeyGroupDoesNotExist
  | TrustedSignerDoesNotExist
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDistribution: (
  input: CreateDistributionRequest,
) => effect.Effect<
  CreateDistributionResult,
  | AccessDenied
  | CNAMEAlreadyExists
  | ContinuousDeploymentPolicyInUse
  | DistributionAlreadyExists
  | EntityLimitExceeded
  | EntityNotFound
  | IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior
  | IllegalOriginAccessConfiguration
  | InconsistentQuantities
  | InvalidArgument
  | InvalidDefaultRootObject
  | InvalidDomainNameForOriginAccessControl
  | InvalidErrorCode
  | InvalidForwardCookies
  | InvalidFunctionAssociation
  | InvalidGeoRestrictionParameter
  | InvalidHeadersForS3Origin
  | InvalidLambdaFunctionAssociation
  | InvalidLocationCode
  | InvalidMinimumProtocolVersion
  | InvalidOrigin
  | InvalidOriginAccessControl
  | InvalidOriginAccessIdentity
  | InvalidOriginKeepaliveTimeout
  | InvalidOriginReadTimeout
  | InvalidProtocolSettings
  | InvalidQueryStringParameters
  | InvalidRelativePath
  | InvalidRequiredProtocol
  | InvalidResponseCode
  | InvalidTTLOrder
  | InvalidViewerCertificate
  | InvalidWebACLId
  | MissingBody
  | NoSuchCachePolicy
  | NoSuchContinuousDeploymentPolicy
  | NoSuchFieldLevelEncryptionConfig
  | NoSuchOrigin
  | NoSuchOriginRequestPolicy
  | NoSuchRealtimeLogConfig
  | NoSuchResponseHeadersPolicy
  | RealtimeLogConfigOwnerMismatch
  | TooManyCacheBehaviors
  | TooManyCertificates
  | TooManyCookieNamesInWhiteList
  | TooManyDistributionCNAMEs
  | TooManyDistributions
  | TooManyDistributionsAssociatedToCachePolicy
  | TooManyDistributionsAssociatedToFieldLevelEncryptionConfig
  | TooManyDistributionsAssociatedToKeyGroup
  | TooManyDistributionsAssociatedToOriginAccessControl
  | TooManyDistributionsAssociatedToOriginRequestPolicy
  | TooManyDistributionsAssociatedToResponseHeadersPolicy
  | TooManyDistributionsWithFunctionAssociations
  | TooManyDistributionsWithLambdaAssociations
  | TooManyDistributionsWithSingleFunctionARN
  | TooManyFunctionAssociations
  | TooManyHeadersInForwardedValues
  | TooManyKeyGroupsAssociatedToDistribution
  | TooManyLambdaFunctionAssociations
  | TooManyOriginCustomHeaders
  | TooManyOriginGroupsPerDistribution
  | TooManyOrigins
  | TooManyQueryStringParameters
  | TooManyTrustedSigners
  | TrustedKeyGroupDoesNotExist
  | TrustedSignerDoesNotExist
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

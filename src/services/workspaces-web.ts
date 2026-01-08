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
const svc = T.AwsApiService({
  sdkId: "WorkSpaces Web",
  serviceShapeName: "AWSErmineControlPlaneService",
});
const auth = T.AwsAuthSigv4({ name: "workspaces-web" });
const ver = T.ServiceVersion("2020-07-08");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
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
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://workspaces-web-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://workspaces-web-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://workspaces-web.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://workspaces-web.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type PortalId = string;
export type SessionId = string;
export type Username = string | redacted.Redacted<string>;
export type MaxResults = number;
export type PaginationToken = string;
export type ARN = string;
export type ClientToken = string;
export type TagKey = string | redacted.Redacted<string>;
export type keyArn = string;
export type BrowserPolicy = string | redacted.Redacted<string>;
export type DisplayNameSafe = string | redacted.Redacted<string>;
export type DescriptionSafe = string | redacted.Redacted<string>;
export type IdentityProviderName = string | redacted.Redacted<string>;
export type IdentityProviderType = string;
export type SubresourceARN = string;
export type DisplayName = string | redacted.Redacted<string>;
export type Description = string | redacted.Redacted<string>;
export type VpcId = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type AuthenticationType = string;
export type InstanceType = string;
export type MaxConcurrentSessions = number;
export type CertificateAuthorityBody = Uint8Array;
export type CertificateThumbprint = string;
export type KinesisStreamArn = string;
export type EnabledType = string;
export type DisconnectTimeoutInMinutes = number;
export type IdleDisconnectTimeoutInMinutes = number;
export type TagValue = string | redacted.Redacted<string>;
export type StringType = string;
export type UrlPattern = string | redacted.Redacted<string>;
export type InlineRedactionUrl = string | redacted.Redacted<string>;
export type ConfidenceLevel = number;
export type IpRange = string | redacted.Redacted<string>;
export type ToolbarType = string;
export type VisualMode = string;
export type ToolbarItem = string;
export type MaxDisplayResolution = string;
export type Markdown = string | redacted.Redacted<string>;
export type ExceptionMessage = string;
export type PortalEndpoint = string;
export type SamlMetadata = string;
export type BuiltInPatternId = string | redacted.Redacted<string>;
export type S3Bucket = string | redacted.Redacted<string>;
export type S3KeyPrefix = string | redacted.Redacted<string>;
export type S3BucketOwner = string;
export type CookieDomain = string | redacted.Redacted<string>;
export type CookieName = string | redacted.Redacted<string>;
export type CookiePath = string | redacted.Redacted<string>;
export type IconImage = Uint8Array;
export type S3Uri = string;
export type WallpaperImage = Uint8Array;
export type IpAddress = string | redacted.Redacted<string>;
export type RendererType = string;
export type BrowserType = string;
export type PortalStatus = string;
export type StatusReason = string;
export type CertificatePrincipal = string;
export type PatternName = string | redacted.Redacted<string>;
export type Regex = string | redacted.Redacted<string>;
export type RedactionPlaceHolderType = string;
export type RedactionPlaceHolderText = string | redacted.Redacted<string>;
export type BrandingSafeStringType = string;
export type ContactLinkUrl = string;
export type RetryAfterSeconds = number;
export type ResourceId = string;
export type ResourceType = string;
export type ServiceCode = string;
export type QuotaCode = string;
export type ValidationExceptionReason = string;
export type TagExceptionMessage = string;
export type FieldName = string;

//# Schemas
export type SessionSortBy = "StartTimeAscending" | "StartTimeDescending";
export const SessionSortBy = S.Literal(
  "StartTimeAscending",
  "StartTimeDescending",
);
export type SessionStatus = "Active" | "Terminated";
export const SessionStatus = S.Literal("Active", "Terminated");
export type TagKeyList = string | redacted.Redacted<string>[];
export const TagKeyList = S.Array(SensitiveString);
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export type CertificateList = Uint8Array[];
export const CertificateList = S.Array(T.Blob);
export type CertificateThumbprintList = string[];
export const CertificateThumbprintList = S.Array(S.String);
export interface ExpireSessionRequest {
  portalId: string;
  sessionId: string;
}
export const ExpireSessionRequest = S.suspend(() =>
  S.Struct({
    portalId: S.String.pipe(T.HttpLabel("portalId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ExpireSessionRequest",
}) as any as S.Schema<ExpireSessionRequest>;
export interface ExpireSessionResponse {}
export const ExpireSessionResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "ExpireSessionResponse",
}) as any as S.Schema<ExpireSessionResponse>;
export interface GetSessionRequest {
  portalId: string;
  sessionId: string;
}
export const GetSessionRequest = S.suspend(() =>
  S.Struct({
    portalId: S.String.pipe(T.HttpLabel("portalId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/portals/{portalId}/sessions/{sessionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSessionRequest",
}) as any as S.Schema<GetSessionRequest>;
export interface ListSessionsRequest {
  portalId: string;
  username?: string | redacted.Redacted<string>;
  sessionId?: string;
  sortBy?: SessionSortBy;
  status?: SessionStatus;
  maxResults?: number;
  nextToken?: string;
}
export const ListSessionsRequest = S.suspend(() =>
  S.Struct({
    portalId: S.String.pipe(T.HttpLabel("portalId")),
    username: S.optional(SensitiveString).pipe(T.HttpQuery("username")),
    sessionId: S.optional(S.String).pipe(T.HttpQuery("sessionId")),
    sortBy: S.optional(SessionSortBy).pipe(T.HttpQuery("sortBy")),
    status: S.optional(SessionStatus).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/portals/{portalId}/sessions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSessionsRequest",
}) as any as S.Schema<ListSessionsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn+}" }),
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
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string | redacted.Redacted<string>[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn+}" }),
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
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface GetBrowserSettingsRequest {
  browserSettingsArn: string;
}
export const GetBrowserSettingsRequest = S.suspend(() =>
  S.Struct({
    browserSettingsArn: S.String.pipe(T.HttpLabel("browserSettingsArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/browserSettings/{browserSettingsArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBrowserSettingsRequest",
}) as any as S.Schema<GetBrowserSettingsRequest>;
export type Category =
  | "Cults"
  | "Gambling"
  | "Nudity"
  | "Pornography"
  | "SexEducation"
  | "Tasteless"
  | "Violence"
  | "DownloadSites"
  | "ImageSharing"
  | "PeerToPeer"
  | "StreamingMediaAndDownloads"
  | "GenerativeAI"
  | "CriminalActivity"
  | "Hacking"
  | "HateAndIntolerance"
  | "IllegalDrug"
  | "IllegalSoftware"
  | "SchoolCheating"
  | "SelfHarm"
  | "Weapons"
  | "Chat"
  | "Games"
  | "InstantMessaging"
  | "ProfessionalNetwork"
  | "SocialNetworking"
  | "WebBasedEmail"
  | "ParkedDomains";
export const Category = S.Literal(
  "Cults",
  "Gambling",
  "Nudity",
  "Pornography",
  "SexEducation",
  "Tasteless",
  "Violence",
  "DownloadSites",
  "ImageSharing",
  "PeerToPeer",
  "StreamingMediaAndDownloads",
  "GenerativeAI",
  "CriminalActivity",
  "Hacking",
  "HateAndIntolerance",
  "IllegalDrug",
  "IllegalSoftware",
  "SchoolCheating",
  "SelfHarm",
  "Weapons",
  "Chat",
  "Games",
  "InstantMessaging",
  "ProfessionalNetwork",
  "SocialNetworking",
  "WebBasedEmail",
  "ParkedDomains",
);
export type BlockedCategories = Category[];
export const BlockedCategories = S.Array(Category);
export type UrlPatternList = string | redacted.Redacted<string>[];
export const UrlPatternList = S.Array(SensitiveString);
export interface WebContentFilteringPolicy {
  blockedCategories?: Category[];
  allowedUrls?: string | redacted.Redacted<string>[];
  blockedUrls?: string | redacted.Redacted<string>[];
}
export const WebContentFilteringPolicy = S.suspend(() =>
  S.Struct({
    blockedCategories: S.optional(BlockedCategories),
    allowedUrls: S.optional(UrlPatternList),
    blockedUrls: S.optional(UrlPatternList),
  }),
).annotations({
  identifier: "WebContentFilteringPolicy",
}) as any as S.Schema<WebContentFilteringPolicy>;
export interface UpdateBrowserSettingsRequest {
  browserSettingsArn: string;
  browserPolicy?: string | redacted.Redacted<string>;
  clientToken?: string;
  webContentFilteringPolicy?: WebContentFilteringPolicy;
}
export const UpdateBrowserSettingsRequest = S.suspend(() =>
  S.Struct({
    browserSettingsArn: S.String.pipe(T.HttpLabel("browserSettingsArn")),
    browserPolicy: S.optional(SensitiveString),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    webContentFilteringPolicy: S.optional(WebContentFilteringPolicy),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/browserSettings/{browserSettingsArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBrowserSettingsRequest",
}) as any as S.Schema<UpdateBrowserSettingsRequest>;
export interface DeleteBrowserSettingsRequest {
  browserSettingsArn: string;
}
export const DeleteBrowserSettingsRequest = S.suspend(() =>
  S.Struct({
    browserSettingsArn: S.String.pipe(T.HttpLabel("browserSettingsArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/browserSettings/{browserSettingsArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBrowserSettingsRequest",
}) as any as S.Schema<DeleteBrowserSettingsRequest>;
export interface DeleteBrowserSettingsResponse {}
export const DeleteBrowserSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteBrowserSettingsResponse",
}) as any as S.Schema<DeleteBrowserSettingsResponse>;
export interface ListBrowserSettingsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListBrowserSettingsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/browserSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBrowserSettingsRequest",
}) as any as S.Schema<ListBrowserSettingsRequest>;
export interface GetDataProtectionSettingsRequest {
  dataProtectionSettingsArn: string;
}
export const GetDataProtectionSettingsRequest = S.suspend(() =>
  S.Struct({
    dataProtectionSettingsArn: S.String.pipe(
      T.HttpLabel("dataProtectionSettingsArn"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDataProtectionSettingsRequest",
}) as any as S.Schema<GetDataProtectionSettingsRequest>;
export interface CustomPattern {
  patternName: string | redacted.Redacted<string>;
  patternRegex: string | redacted.Redacted<string>;
  patternDescription?: string | redacted.Redacted<string>;
  keywordRegex?: string | redacted.Redacted<string>;
}
export const CustomPattern = S.suspend(() =>
  S.Struct({
    patternName: SensitiveString,
    patternRegex: SensitiveString,
    patternDescription: S.optional(SensitiveString),
    keywordRegex: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "CustomPattern",
}) as any as S.Schema<CustomPattern>;
export interface RedactionPlaceHolder {
  redactionPlaceHolderType: string;
  redactionPlaceHolderText?: string | redacted.Redacted<string>;
}
export const RedactionPlaceHolder = S.suspend(() =>
  S.Struct({
    redactionPlaceHolderType: S.String,
    redactionPlaceHolderText: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RedactionPlaceHolder",
}) as any as S.Schema<RedactionPlaceHolder>;
export type InlineRedactionUrls = string | redacted.Redacted<string>[];
export const InlineRedactionUrls = S.Array(SensitiveString);
export interface InlineRedactionPattern {
  builtInPatternId?: string | redacted.Redacted<string>;
  customPattern?: CustomPattern;
  redactionPlaceHolder: RedactionPlaceHolder;
  enforcedUrls?: string | redacted.Redacted<string>[];
  exemptUrls?: string | redacted.Redacted<string>[];
  confidenceLevel?: number;
}
export const InlineRedactionPattern = S.suspend(() =>
  S.Struct({
    builtInPatternId: S.optional(SensitiveString),
    customPattern: S.optional(CustomPattern),
    redactionPlaceHolder: RedactionPlaceHolder,
    enforcedUrls: S.optional(InlineRedactionUrls),
    exemptUrls: S.optional(InlineRedactionUrls),
    confidenceLevel: S.optional(S.Number),
  }),
).annotations({
  identifier: "InlineRedactionPattern",
}) as any as S.Schema<InlineRedactionPattern>;
export type InlineRedactionPatterns = InlineRedactionPattern[];
export const InlineRedactionPatterns = S.Array(InlineRedactionPattern);
export type GlobalInlineRedactionUrls = string | redacted.Redacted<string>[];
export const GlobalInlineRedactionUrls = S.Array(SensitiveString);
export interface InlineRedactionConfiguration {
  inlineRedactionPatterns: InlineRedactionPattern[];
  globalEnforcedUrls?: string | redacted.Redacted<string>[];
  globalExemptUrls?: string | redacted.Redacted<string>[];
  globalConfidenceLevel?: number;
}
export const InlineRedactionConfiguration = S.suspend(() =>
  S.Struct({
    inlineRedactionPatterns: InlineRedactionPatterns,
    globalEnforcedUrls: S.optional(GlobalInlineRedactionUrls),
    globalExemptUrls: S.optional(GlobalInlineRedactionUrls),
    globalConfidenceLevel: S.optional(S.Number),
  }),
).annotations({
  identifier: "InlineRedactionConfiguration",
}) as any as S.Schema<InlineRedactionConfiguration>;
export interface UpdateDataProtectionSettingsRequest {
  dataProtectionSettingsArn: string;
  inlineRedactionConfiguration?: InlineRedactionConfiguration;
  displayName?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  clientToken?: string;
}
export const UpdateDataProtectionSettingsRequest = S.suspend(() =>
  S.Struct({
    dataProtectionSettingsArn: S.String.pipe(
      T.HttpLabel("dataProtectionSettingsArn"),
    ),
    inlineRedactionConfiguration: S.optional(InlineRedactionConfiguration),
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateDataProtectionSettingsRequest",
}) as any as S.Schema<UpdateDataProtectionSettingsRequest>;
export interface DeleteDataProtectionSettingsRequest {
  dataProtectionSettingsArn: string;
}
export const DeleteDataProtectionSettingsRequest = S.suspend(() =>
  S.Struct({
    dataProtectionSettingsArn: S.String.pipe(
      T.HttpLabel("dataProtectionSettingsArn"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDataProtectionSettingsRequest",
}) as any as S.Schema<DeleteDataProtectionSettingsRequest>;
export interface DeleteDataProtectionSettingsResponse {}
export const DeleteDataProtectionSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDataProtectionSettingsResponse",
}) as any as S.Schema<DeleteDataProtectionSettingsResponse>;
export interface ListDataProtectionSettingsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListDataProtectionSettingsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/dataProtectionSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataProtectionSettingsRequest",
}) as any as S.Schema<ListDataProtectionSettingsRequest>;
export interface GetIdentityProviderRequest {
  identityProviderArn: string;
}
export const GetIdentityProviderRequest = S.suspend(() =>
  S.Struct({
    identityProviderArn: S.String.pipe(T.HttpLabel("identityProviderArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/identityProviders/{identityProviderArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdentityProviderRequest",
}) as any as S.Schema<GetIdentityProviderRequest>;
export type IdentityProviderDetails = { [key: string]: string };
export const IdentityProviderDetails = S.Record({
  key: S.String,
  value: S.String,
});
export interface UpdateIdentityProviderRequest {
  identityProviderArn: string;
  identityProviderName?: string | redacted.Redacted<string>;
  identityProviderType?: string;
  identityProviderDetails?: { [key: string]: string };
  clientToken?: string;
}
export const UpdateIdentityProviderRequest = S.suspend(() =>
  S.Struct({
    identityProviderArn: S.String.pipe(T.HttpLabel("identityProviderArn")),
    identityProviderName: S.optional(SensitiveString),
    identityProviderType: S.optional(S.String),
    identityProviderDetails: S.optional(IdentityProviderDetails),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateIdentityProviderRequest",
}) as any as S.Schema<UpdateIdentityProviderRequest>;
export interface DeleteIdentityProviderRequest {
  identityProviderArn: string;
}
export const DeleteIdentityProviderRequest = S.suspend(() =>
  S.Struct({
    identityProviderArn: S.String.pipe(T.HttpLabel("identityProviderArn")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteIdentityProviderRequest",
}) as any as S.Schema<DeleteIdentityProviderRequest>;
export interface DeleteIdentityProviderResponse {}
export const DeleteIdentityProviderResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIdentityProviderResponse",
}) as any as S.Schema<DeleteIdentityProviderResponse>;
export interface ListIdentityProvidersRequest {
  nextToken?: string;
  maxResults?: number;
  portalArn: string;
}
export const ListIdentityProvidersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/portals/{portalArn+}/identityProviders" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdentityProvidersRequest",
}) as any as S.Schema<ListIdentityProvidersRequest>;
export interface GetIpAccessSettingsRequest {
  ipAccessSettingsArn: string;
}
export const GetIpAccessSettingsRequest = S.suspend(() =>
  S.Struct({
    ipAccessSettingsArn: S.String.pipe(T.HttpLabel("ipAccessSettingsArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/ipAccessSettings/{ipAccessSettingsArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIpAccessSettingsRequest",
}) as any as S.Schema<GetIpAccessSettingsRequest>;
export interface IpRule {
  ipRange: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
}
export const IpRule = S.suspend(() =>
  S.Struct({
    ipRange: SensitiveString,
    description: S.optional(SensitiveString),
  }),
).annotations({ identifier: "IpRule" }) as any as S.Schema<IpRule>;
export type IpRuleList = IpRule[];
export const IpRuleList = S.Array(IpRule);
export interface UpdateIpAccessSettingsRequest {
  ipAccessSettingsArn: string;
  displayName?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  ipRules?: IpRule[];
  clientToken?: string;
}
export const UpdateIpAccessSettingsRequest = S.suspend(() =>
  S.Struct({
    ipAccessSettingsArn: S.String.pipe(T.HttpLabel("ipAccessSettingsArn")),
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    ipRules: S.optional(IpRuleList),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateIpAccessSettingsRequest",
}) as any as S.Schema<UpdateIpAccessSettingsRequest>;
export interface DeleteIpAccessSettingsRequest {
  ipAccessSettingsArn: string;
}
export const DeleteIpAccessSettingsRequest = S.suspend(() =>
  S.Struct({
    ipAccessSettingsArn: S.String.pipe(T.HttpLabel("ipAccessSettingsArn")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteIpAccessSettingsRequest",
}) as any as S.Schema<DeleteIpAccessSettingsRequest>;
export interface DeleteIpAccessSettingsResponse {}
export const DeleteIpAccessSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIpAccessSettingsResponse",
}) as any as S.Schema<DeleteIpAccessSettingsResponse>;
export interface ListIpAccessSettingsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListIpAccessSettingsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ipAccessSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIpAccessSettingsRequest",
}) as any as S.Schema<ListIpAccessSettingsRequest>;
export interface Tag {
  Key: string | redacted.Redacted<string>;
  Value: string | redacted.Redacted<string>;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: SensitiveString, Value: SensitiveString }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateNetworkSettingsRequest {
  vpcId: string;
  subnetIds: string[];
  securityGroupIds: string[];
  tags?: Tag[];
  clientToken?: string;
}
export const CreateNetworkSettingsRequest = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIdList,
    securityGroupIds: SecurityGroupIdList,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/networkSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNetworkSettingsRequest",
}) as any as S.Schema<CreateNetworkSettingsRequest>;
export interface GetNetworkSettingsRequest {
  networkSettingsArn: string;
}
export const GetNetworkSettingsRequest = S.suspend(() =>
  S.Struct({
    networkSettingsArn: S.String.pipe(T.HttpLabel("networkSettingsArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networkSettings/{networkSettingsArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetNetworkSettingsRequest",
}) as any as S.Schema<GetNetworkSettingsRequest>;
export interface UpdateNetworkSettingsRequest {
  networkSettingsArn: string;
  vpcId?: string;
  subnetIds?: string[];
  securityGroupIds?: string[];
  clientToken?: string;
}
export const UpdateNetworkSettingsRequest = S.suspend(() =>
  S.Struct({
    networkSettingsArn: S.String.pipe(T.HttpLabel("networkSettingsArn")),
    vpcId: S.optional(S.String),
    subnetIds: S.optional(SubnetIdList),
    securityGroupIds: S.optional(SecurityGroupIdList),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/networkSettings/{networkSettingsArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNetworkSettingsRequest",
}) as any as S.Schema<UpdateNetworkSettingsRequest>;
export interface DeleteNetworkSettingsRequest {
  networkSettingsArn: string;
}
export const DeleteNetworkSettingsRequest = S.suspend(() =>
  S.Struct({
    networkSettingsArn: S.String.pipe(T.HttpLabel("networkSettingsArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/networkSettings/{networkSettingsArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteNetworkSettingsRequest",
}) as any as S.Schema<DeleteNetworkSettingsRequest>;
export interface DeleteNetworkSettingsResponse {}
export const DeleteNetworkSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteNetworkSettingsResponse",
}) as any as S.Schema<DeleteNetworkSettingsResponse>;
export interface ListNetworkSettingsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListNetworkSettingsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networkSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNetworkSettingsRequest",
}) as any as S.Schema<ListNetworkSettingsRequest>;
export type EncryptionContextMap = { [key: string]: string };
export const EncryptionContextMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface CreatePortalRequest {
  displayName?: string | redacted.Redacted<string>;
  tags?: Tag[];
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
  clientToken?: string;
  authenticationType?: string;
  instanceType?: string;
  maxConcurrentSessions?: number;
}
export const CreatePortalRequest = S.suspend(() =>
  S.Struct({
    displayName: S.optional(SensitiveString),
    tags: S.optional(TagList),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    authenticationType: S.optional(S.String),
    instanceType: S.optional(S.String),
    maxConcurrentSessions: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/portals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePortalRequest",
}) as any as S.Schema<CreatePortalRequest>;
export interface GetPortalRequest {
  portalArn: string;
}
export const GetPortalRequest = S.suspend(() =>
  S.Struct({ portalArn: S.String.pipe(T.HttpLabel("portalArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/portals/{portalArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPortalRequest",
}) as any as S.Schema<GetPortalRequest>;
export interface UpdatePortalRequest {
  portalArn: string;
  displayName?: string | redacted.Redacted<string>;
  authenticationType?: string;
  instanceType?: string;
  maxConcurrentSessions?: number;
}
export const UpdatePortalRequest = S.suspend(() =>
  S.Struct({
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    displayName: S.optional(SensitiveString),
    authenticationType: S.optional(S.String),
    instanceType: S.optional(S.String),
    maxConcurrentSessions: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/portals/{portalArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePortalRequest",
}) as any as S.Schema<UpdatePortalRequest>;
export interface DeletePortalRequest {
  portalArn: string;
}
export const DeletePortalRequest = S.suspend(() =>
  S.Struct({ portalArn: S.String.pipe(T.HttpLabel("portalArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/portals/{portalArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePortalRequest",
}) as any as S.Schema<DeletePortalRequest>;
export interface DeletePortalResponse {}
export const DeletePortalResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePortalResponse",
}) as any as S.Schema<DeletePortalResponse>;
export interface ListPortalsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListPortalsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/portals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPortalsRequest",
}) as any as S.Schema<ListPortalsRequest>;
export interface AssociateBrowserSettingsRequest {
  portalArn: string;
  browserSettingsArn: string;
}
export const AssociateBrowserSettingsRequest = S.suspend(() =>
  S.Struct({
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    browserSettingsArn: S.String.pipe(T.HttpQuery("browserSettingsArn")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/portals/{portalArn+}/browserSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateBrowserSettingsRequest",
}) as any as S.Schema<AssociateBrowserSettingsRequest>;
export interface AssociateDataProtectionSettingsRequest {
  portalArn: string;
  dataProtectionSettingsArn: string;
}
export const AssociateDataProtectionSettingsRequest = S.suspend(() =>
  S.Struct({
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    dataProtectionSettingsArn: S.String.pipe(
      T.HttpQuery("dataProtectionSettingsArn"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateDataProtectionSettingsRequest",
}) as any as S.Schema<AssociateDataProtectionSettingsRequest>;
export interface AssociateIpAccessSettingsRequest {
  portalArn: string;
  ipAccessSettingsArn: string;
}
export const AssociateIpAccessSettingsRequest = S.suspend(() =>
  S.Struct({
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    ipAccessSettingsArn: S.String.pipe(T.HttpQuery("ipAccessSettingsArn")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/portals/{portalArn+}/ipAccessSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateIpAccessSettingsRequest",
}) as any as S.Schema<AssociateIpAccessSettingsRequest>;
export interface AssociateNetworkSettingsRequest {
  portalArn: string;
  networkSettingsArn: string;
}
export const AssociateNetworkSettingsRequest = S.suspend(() =>
  S.Struct({
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    networkSettingsArn: S.String.pipe(T.HttpQuery("networkSettingsArn")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/portals/{portalArn+}/networkSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateNetworkSettingsRequest",
}) as any as S.Schema<AssociateNetworkSettingsRequest>;
export interface AssociateSessionLoggerRequest {
  portalArn: string;
  sessionLoggerArn: string;
}
export const AssociateSessionLoggerRequest = S.suspend(() =>
  S.Struct({
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    sessionLoggerArn: S.String.pipe(T.HttpQuery("sessionLoggerArn")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/portals/{portalArn+}/sessionLogger" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateSessionLoggerRequest",
}) as any as S.Schema<AssociateSessionLoggerRequest>;
export interface AssociateTrustStoreRequest {
  portalArn: string;
  trustStoreArn: string;
}
export const AssociateTrustStoreRequest = S.suspend(() =>
  S.Struct({
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    trustStoreArn: S.String.pipe(T.HttpQuery("trustStoreArn")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/portals/{portalArn+}/trustStores" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateTrustStoreRequest",
}) as any as S.Schema<AssociateTrustStoreRequest>;
export interface AssociateUserAccessLoggingSettingsRequest {
  portalArn: string;
  userAccessLoggingSettingsArn: string;
}
export const AssociateUserAccessLoggingSettingsRequest = S.suspend(() =>
  S.Struct({
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    userAccessLoggingSettingsArn: S.String.pipe(
      T.HttpQuery("userAccessLoggingSettingsArn"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateUserAccessLoggingSettingsRequest",
}) as any as S.Schema<AssociateUserAccessLoggingSettingsRequest>;
export interface AssociateUserSettingsRequest {
  portalArn: string;
  userSettingsArn: string;
}
export const AssociateUserSettingsRequest = S.suspend(() =>
  S.Struct({
    portalArn: S.String.pipe(T.HttpLabel("portalArn")),
    userSettingsArn: S.String.pipe(T.HttpQuery("userSettingsArn")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/portals/{portalArn+}/userSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateUserSettingsRequest",
}) as any as S.Schema<AssociateUserSettingsRequest>;
export interface DisassociateBrowserSettingsRequest {
  portalArn: string;
}
export const DisassociateBrowserSettingsRequest = S.suspend(() =>
  S.Struct({ portalArn: S.String.pipe(T.HttpLabel("portalArn")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/portals/{portalArn+}/browserSettings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateBrowserSettingsRequest",
}) as any as S.Schema<DisassociateBrowserSettingsRequest>;
export interface DisassociateBrowserSettingsResponse {}
export const DisassociateBrowserSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateBrowserSettingsResponse",
}) as any as S.Schema<DisassociateBrowserSettingsResponse>;
export interface DisassociateDataProtectionSettingsRequest {
  portalArn: string;
}
export const DisassociateDataProtectionSettingsRequest = S.suspend(() =>
  S.Struct({ portalArn: S.String.pipe(T.HttpLabel("portalArn")) }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateDataProtectionSettingsRequest",
}) as any as S.Schema<DisassociateDataProtectionSettingsRequest>;
export interface DisassociateDataProtectionSettingsResponse {}
export const DisassociateDataProtectionSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateDataProtectionSettingsResponse",
}) as any as S.Schema<DisassociateDataProtectionSettingsResponse>;
export interface DisassociateIpAccessSettingsRequest {
  portalArn: string;
}
export const DisassociateIpAccessSettingsRequest = S.suspend(() =>
  S.Struct({ portalArn: S.String.pipe(T.HttpLabel("portalArn")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/portals/{portalArn+}/ipAccessSettings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateIpAccessSettingsRequest",
}) as any as S.Schema<DisassociateIpAccessSettingsRequest>;
export interface DisassociateIpAccessSettingsResponse {}
export const DisassociateIpAccessSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateIpAccessSettingsResponse",
}) as any as S.Schema<DisassociateIpAccessSettingsResponse>;
export interface DisassociateNetworkSettingsRequest {
  portalArn: string;
}
export const DisassociateNetworkSettingsRequest = S.suspend(() =>
  S.Struct({ portalArn: S.String.pipe(T.HttpLabel("portalArn")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/portals/{portalArn+}/networkSettings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateNetworkSettingsRequest",
}) as any as S.Schema<DisassociateNetworkSettingsRequest>;
export interface DisassociateNetworkSettingsResponse {}
export const DisassociateNetworkSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateNetworkSettingsResponse",
}) as any as S.Schema<DisassociateNetworkSettingsResponse>;
export interface DisassociateSessionLoggerRequest {
  portalArn: string;
}
export const DisassociateSessionLoggerRequest = S.suspend(() =>
  S.Struct({ portalArn: S.String.pipe(T.HttpLabel("portalArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/portals/{portalArn+}/sessionLogger" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateSessionLoggerRequest",
}) as any as S.Schema<DisassociateSessionLoggerRequest>;
export interface DisassociateSessionLoggerResponse {}
export const DisassociateSessionLoggerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateSessionLoggerResponse",
}) as any as S.Schema<DisassociateSessionLoggerResponse>;
export interface DisassociateTrustStoreRequest {
  portalArn: string;
}
export const DisassociateTrustStoreRequest = S.suspend(() =>
  S.Struct({ portalArn: S.String.pipe(T.HttpLabel("portalArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/portals/{portalArn+}/trustStores" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateTrustStoreRequest",
}) as any as S.Schema<DisassociateTrustStoreRequest>;
export interface DisassociateTrustStoreResponse {}
export const DisassociateTrustStoreResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateTrustStoreResponse",
}) as any as S.Schema<DisassociateTrustStoreResponse>;
export interface DisassociateUserAccessLoggingSettingsRequest {
  portalArn: string;
}
export const DisassociateUserAccessLoggingSettingsRequest = S.suspend(() =>
  S.Struct({ portalArn: S.String.pipe(T.HttpLabel("portalArn")) }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateUserAccessLoggingSettingsRequest",
}) as any as S.Schema<DisassociateUserAccessLoggingSettingsRequest>;
export interface DisassociateUserAccessLoggingSettingsResponse {}
export const DisassociateUserAccessLoggingSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateUserAccessLoggingSettingsResponse",
}) as any as S.Schema<DisassociateUserAccessLoggingSettingsResponse>;
export interface DisassociateUserSettingsRequest {
  portalArn: string;
}
export const DisassociateUserSettingsRequest = S.suspend(() =>
  S.Struct({ portalArn: S.String.pipe(T.HttpLabel("portalArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/portals/{portalArn+}/userSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateUserSettingsRequest",
}) as any as S.Schema<DisassociateUserSettingsRequest>;
export interface DisassociateUserSettingsResponse {}
export const DisassociateUserSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateUserSettingsResponse",
}) as any as S.Schema<DisassociateUserSettingsResponse>;
export interface GetPortalServiceProviderMetadataRequest {
  portalArn: string;
}
export const GetPortalServiceProviderMetadataRequest = S.suspend(() =>
  S.Struct({ portalArn: S.String.pipe(T.HttpLabel("portalArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/portalIdp/{portalArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPortalServiceProviderMetadataRequest",
}) as any as S.Schema<GetPortalServiceProviderMetadataRequest>;
export interface GetSessionLoggerRequest {
  sessionLoggerArn: string;
}
export const GetSessionLoggerRequest = S.suspend(() =>
  S.Struct({
    sessionLoggerArn: S.String.pipe(T.HttpLabel("sessionLoggerArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sessionLoggers/{sessionLoggerArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSessionLoggerRequest",
}) as any as S.Schema<GetSessionLoggerRequest>;
export type Event =
  | "WebsiteInteract"
  | "FileDownloadFromSecureBrowserToRemoteDisk"
  | "FileTransferFromRemoteToLocalDisk"
  | "FileTransferFromLocalToRemoteDisk"
  | "FileUploadFromRemoteDiskToSecureBrowser"
  | "ContentPasteToWebsite"
  | "ContentTransferFromLocalToRemoteClipboard"
  | "ContentCopyFromWebsite"
  | "UrlLoad"
  | "TabOpen"
  | "TabClose"
  | "PrintJobSubmit"
  | "SessionConnect"
  | "SessionStart"
  | "SessionDisconnect"
  | "SessionEnd"
  | "UrlBlockByContentFilter";
export const Event = S.Literal(
  "WebsiteInteract",
  "FileDownloadFromSecureBrowserToRemoteDisk",
  "FileTransferFromRemoteToLocalDisk",
  "FileTransferFromLocalToRemoteDisk",
  "FileUploadFromRemoteDiskToSecureBrowser",
  "ContentPasteToWebsite",
  "ContentTransferFromLocalToRemoteClipboard",
  "ContentCopyFromWebsite",
  "UrlLoad",
  "TabOpen",
  "TabClose",
  "PrintJobSubmit",
  "SessionConnect",
  "SessionStart",
  "SessionDisconnect",
  "SessionEnd",
  "UrlBlockByContentFilter",
);
export type Events = Event[];
export const Events = S.Array(Event);
export type EventFilter = { all: Record<string, never> } | { include: Event[] };
export const EventFilter = S.Union(
  S.Struct({ all: S.Struct({}) }),
  S.Struct({ include: Events }),
);
export type LogFileFormat = "JSONLines" | "Json";
export const LogFileFormat = S.Literal("JSONLines", "Json");
export type FolderStructure = "Flat" | "NestedByDate";
export const FolderStructure = S.Literal("Flat", "NestedByDate");
export interface S3LogConfiguration {
  bucket: string | redacted.Redacted<string>;
  keyPrefix?: string | redacted.Redacted<string>;
  bucketOwner?: string;
  logFileFormat: LogFileFormat;
  folderStructure: FolderStructure;
}
export const S3LogConfiguration = S.suspend(() =>
  S.Struct({
    bucket: SensitiveString,
    keyPrefix: S.optional(SensitiveString),
    bucketOwner: S.optional(S.String),
    logFileFormat: LogFileFormat,
    folderStructure: FolderStructure,
  }),
).annotations({
  identifier: "S3LogConfiguration",
}) as any as S.Schema<S3LogConfiguration>;
export interface LogConfiguration {
  s3?: S3LogConfiguration;
}
export const LogConfiguration = S.suspend(() =>
  S.Struct({ s3: S.optional(S3LogConfiguration) }),
).annotations({
  identifier: "LogConfiguration",
}) as any as S.Schema<LogConfiguration>;
export interface UpdateSessionLoggerRequest {
  sessionLoggerArn: string;
  eventFilter?: EventFilter;
  logConfiguration?: LogConfiguration;
  displayName?: string | redacted.Redacted<string>;
}
export const UpdateSessionLoggerRequest = S.suspend(() =>
  S.Struct({
    sessionLoggerArn: S.String.pipe(T.HttpLabel("sessionLoggerArn")),
    eventFilter: S.optional(EventFilter),
    logConfiguration: S.optional(LogConfiguration),
    displayName: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/sessionLoggers/{sessionLoggerArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSessionLoggerRequest",
}) as any as S.Schema<UpdateSessionLoggerRequest>;
export interface DeleteSessionLoggerRequest {
  sessionLoggerArn: string;
}
export const DeleteSessionLoggerRequest = S.suspend(() =>
  S.Struct({
    sessionLoggerArn: S.String.pipe(T.HttpLabel("sessionLoggerArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/sessionLoggers/{sessionLoggerArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSessionLoggerRequest",
}) as any as S.Schema<DeleteSessionLoggerRequest>;
export interface DeleteSessionLoggerResponse {}
export const DeleteSessionLoggerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSessionLoggerResponse",
}) as any as S.Schema<DeleteSessionLoggerResponse>;
export interface ListSessionLoggersRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListSessionLoggersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sessionLoggers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSessionLoggersRequest",
}) as any as S.Schema<ListSessionLoggersRequest>;
export interface CreateTrustStoreRequest {
  certificateList: Uint8Array[];
  tags?: Tag[];
  clientToken?: string;
}
export const CreateTrustStoreRequest = S.suspend(() =>
  S.Struct({
    certificateList: CertificateList,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/trustStores" }),
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
export interface GetTrustStoreRequest {
  trustStoreArn: string;
}
export const GetTrustStoreRequest = S.suspend(() =>
  S.Struct({ trustStoreArn: S.String.pipe(T.HttpLabel("trustStoreArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/trustStores/{trustStoreArn+}" }),
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
export interface UpdateTrustStoreRequest {
  trustStoreArn: string;
  certificatesToAdd?: Uint8Array[];
  certificatesToDelete?: string[];
  clientToken?: string;
}
export const UpdateTrustStoreRequest = S.suspend(() =>
  S.Struct({
    trustStoreArn: S.String.pipe(T.HttpLabel("trustStoreArn")),
    certificatesToAdd: S.optional(CertificateList),
    certificatesToDelete: S.optional(CertificateThumbprintList),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/trustStores/{trustStoreArn+}" }),
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
export interface DeleteTrustStoreRequest {
  trustStoreArn: string;
}
export const DeleteTrustStoreRequest = S.suspend(() =>
  S.Struct({ trustStoreArn: S.String.pipe(T.HttpLabel("trustStoreArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/trustStores/{trustStoreArn+}" }),
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
  S.Struct({}),
).annotations({
  identifier: "DeleteTrustStoreResponse",
}) as any as S.Schema<DeleteTrustStoreResponse>;
export interface ListTrustStoresRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListTrustStoresRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/trustStores" }),
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
export interface GetTrustStoreCertificateRequest {
  trustStoreArn: string;
  thumbprint: string;
}
export const GetTrustStoreCertificateRequest = S.suspend(() =>
  S.Struct({
    trustStoreArn: S.String.pipe(T.HttpLabel("trustStoreArn")),
    thumbprint: S.String.pipe(T.HttpQuery("thumbprint")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/trustStores/{trustStoreArn+}/certificate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrustStoreCertificateRequest",
}) as any as S.Schema<GetTrustStoreCertificateRequest>;
export interface ListTrustStoreCertificatesRequest {
  trustStoreArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListTrustStoreCertificatesRequest = S.suspend(() =>
  S.Struct({
    trustStoreArn: S.String.pipe(T.HttpLabel("trustStoreArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListTrustStoreCertificatesRequest",
}) as any as S.Schema<ListTrustStoreCertificatesRequest>;
export interface CreateUserAccessLoggingSettingsRequest {
  kinesisStreamArn: string;
  tags?: Tag[];
  clientToken?: string;
}
export const CreateUserAccessLoggingSettingsRequest = S.suspend(() =>
  S.Struct({
    kinesisStreamArn: S.String,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/userAccessLoggingSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUserAccessLoggingSettingsRequest",
}) as any as S.Schema<CreateUserAccessLoggingSettingsRequest>;
export interface GetUserAccessLoggingSettingsRequest {
  userAccessLoggingSettingsArn: string;
}
export const GetUserAccessLoggingSettingsRequest = S.suspend(() =>
  S.Struct({
    userAccessLoggingSettingsArn: S.String.pipe(
      T.HttpLabel("userAccessLoggingSettingsArn"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetUserAccessLoggingSettingsRequest",
}) as any as S.Schema<GetUserAccessLoggingSettingsRequest>;
export interface UpdateUserAccessLoggingSettingsRequest {
  userAccessLoggingSettingsArn: string;
  kinesisStreamArn?: string;
  clientToken?: string;
}
export const UpdateUserAccessLoggingSettingsRequest = S.suspend(() =>
  S.Struct({
    userAccessLoggingSettingsArn: S.String.pipe(
      T.HttpLabel("userAccessLoggingSettingsArn"),
    ),
    kinesisStreamArn: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateUserAccessLoggingSettingsRequest",
}) as any as S.Schema<UpdateUserAccessLoggingSettingsRequest>;
export interface DeleteUserAccessLoggingSettingsRequest {
  userAccessLoggingSettingsArn: string;
}
export const DeleteUserAccessLoggingSettingsRequest = S.suspend(() =>
  S.Struct({
    userAccessLoggingSettingsArn: S.String.pipe(
      T.HttpLabel("userAccessLoggingSettingsArn"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteUserAccessLoggingSettingsRequest",
}) as any as S.Schema<DeleteUserAccessLoggingSettingsRequest>;
export interface DeleteUserAccessLoggingSettingsResponse {}
export const DeleteUserAccessLoggingSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteUserAccessLoggingSettingsResponse",
}) as any as S.Schema<DeleteUserAccessLoggingSettingsResponse>;
export interface ListUserAccessLoggingSettingsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListUserAccessLoggingSettingsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/userAccessLoggingSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUserAccessLoggingSettingsRequest",
}) as any as S.Schema<ListUserAccessLoggingSettingsRequest>;
export interface GetUserSettingsRequest {
  userSettingsArn: string;
}
export const GetUserSettingsRequest = S.suspend(() =>
  S.Struct({
    userSettingsArn: S.String.pipe(T.HttpLabel("userSettingsArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/userSettings/{userSettingsArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUserSettingsRequest",
}) as any as S.Schema<GetUserSettingsRequest>;
export interface DeleteUserSettingsRequest {
  userSettingsArn: string;
}
export const DeleteUserSettingsRequest = S.suspend(() =>
  S.Struct({
    userSettingsArn: S.String.pipe(T.HttpLabel("userSettingsArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/userSettings/{userSettingsArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUserSettingsRequest",
}) as any as S.Schema<DeleteUserSettingsRequest>;
export interface DeleteUserSettingsResponse {}
export const DeleteUserSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteUserSettingsResponse",
}) as any as S.Schema<DeleteUserSettingsResponse>;
export interface ListUserSettingsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListUserSettingsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/userSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUserSettingsRequest",
}) as any as S.Schema<ListUserSettingsRequest>;
export type HiddenToolbarItemList = string[];
export const HiddenToolbarItemList = S.Array(S.String);
export type ColorTheme = "Light" | "Dark";
export const ColorTheme = S.Literal("Light", "Dark");
export interface ToolbarConfiguration {
  toolbarType?: string;
  visualMode?: string;
  hiddenToolbarItems?: string[];
  maxDisplayResolution?: string;
}
export const ToolbarConfiguration = S.suspend(() =>
  S.Struct({
    toolbarType: S.optional(S.String),
    visualMode: S.optional(S.String),
    hiddenToolbarItems: S.optional(HiddenToolbarItemList),
    maxDisplayResolution: S.optional(S.String),
  }),
).annotations({
  identifier: "ToolbarConfiguration",
}) as any as S.Schema<ToolbarConfiguration>;
export type IconImageInput = { blob: Uint8Array } | { s3Uri: string };
export const IconImageInput = S.Union(
  S.Struct({ blob: T.Blob }),
  S.Struct({ s3Uri: S.String }),
);
export type WallpaperImageInput = { blob: Uint8Array } | { s3Uri: string };
export const WallpaperImageInput = S.Union(
  S.Struct({ blob: T.Blob }),
  S.Struct({ s3Uri: S.String }),
);
export type Locale =
  | "de-DE"
  | "en-US"
  | "es-ES"
  | "fr-FR"
  | "id-ID"
  | "it-IT"
  | "ja-JP"
  | "ko-KR"
  | "pt-BR"
  | "zh-CN"
  | "zh-TW";
export const Locale = S.Literal(
  "de-DE",
  "en-US",
  "es-ES",
  "fr-FR",
  "id-ID",
  "it-IT",
  "ja-JP",
  "ko-KR",
  "pt-BR",
  "zh-CN",
  "zh-TW",
);
export interface LocalizedBrandingStrings {
  browserTabTitle: string;
  welcomeText: string;
  loginTitle?: string;
  loginDescription?: string;
  loginButtonText?: string;
  contactLink?: string;
  contactButtonText?: string;
  loadingText?: string;
}
export const LocalizedBrandingStrings = S.suspend(() =>
  S.Struct({
    browserTabTitle: S.String,
    welcomeText: S.String,
    loginTitle: S.optional(S.String),
    loginDescription: S.optional(S.String),
    loginButtonText: S.optional(S.String),
    contactLink: S.optional(S.String),
    contactButtonText: S.optional(S.String),
    loadingText: S.optional(S.String),
  }),
).annotations({
  identifier: "LocalizedBrandingStrings",
}) as any as S.Schema<LocalizedBrandingStrings>;
export type LocalizedBrandingStringMap = {
  [key in Locale]?: LocalizedBrandingStrings;
};
export const LocalizedBrandingStringMap = S.partial(
  S.Record({ key: Locale, value: LocalizedBrandingStrings }),
);
export interface BrandingConfigurationUpdateInput {
  logo?: IconImageInput;
  wallpaper?: WallpaperImageInput;
  favicon?: IconImageInput;
  localizedStrings?: { [key: string]: LocalizedBrandingStrings };
  colorTheme?: ColorTheme;
  termsOfService?: string | redacted.Redacted<string>;
}
export const BrandingConfigurationUpdateInput = S.suspend(() =>
  S.Struct({
    logo: S.optional(IconImageInput),
    wallpaper: S.optional(WallpaperImageInput),
    favicon: S.optional(IconImageInput),
    localizedStrings: S.optional(LocalizedBrandingStringMap),
    colorTheme: S.optional(ColorTheme),
    termsOfService: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "BrandingConfigurationUpdateInput",
}) as any as S.Schema<BrandingConfigurationUpdateInput>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tag[];
  clientToken?: string;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagList,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn+}" }),
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
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface CreateBrowserSettingsRequest {
  tags?: Tag[];
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
  browserPolicy?: string | redacted.Redacted<string>;
  clientToken?: string;
  webContentFilteringPolicy?: WebContentFilteringPolicy;
}
export const CreateBrowserSettingsRequest = S.suspend(() =>
  S.Struct({
    tags: S.optional(TagList),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    browserPolicy: S.optional(SensitiveString),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    webContentFilteringPolicy: S.optional(WebContentFilteringPolicy),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/browserSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBrowserSettingsRequest",
}) as any as S.Schema<CreateBrowserSettingsRequest>;
export type ArnList = string[];
export const ArnList = S.Array(S.String);
export interface BrowserSettings {
  browserSettingsArn: string;
  associatedPortalArns?: string[];
  browserPolicy?: string | redacted.Redacted<string>;
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
  webContentFilteringPolicy?: WebContentFilteringPolicy;
}
export const BrowserSettings = S.suspend(() =>
  S.Struct({
    browserSettingsArn: S.String,
    associatedPortalArns: S.optional(ArnList),
    browserPolicy: S.optional(SensitiveString),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    webContentFilteringPolicy: S.optional(WebContentFilteringPolicy),
  }),
).annotations({
  identifier: "BrowserSettings",
}) as any as S.Schema<BrowserSettings>;
export interface UpdateBrowserSettingsResponse {
  browserSettings: BrowserSettings;
}
export const UpdateBrowserSettingsResponse = S.suspend(() =>
  S.Struct({ browserSettings: BrowserSettings }),
).annotations({
  identifier: "UpdateBrowserSettingsResponse",
}) as any as S.Schema<UpdateBrowserSettingsResponse>;
export interface DataProtectionSettings {
  dataProtectionSettingsArn: string;
  inlineRedactionConfiguration?: InlineRedactionConfiguration;
  associatedPortalArns?: string[];
  displayName?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  creationDate?: Date;
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
}
export const DataProtectionSettings = S.suspend(() =>
  S.Struct({
    dataProtectionSettingsArn: S.String,
    inlineRedactionConfiguration: S.optional(InlineRedactionConfiguration),
    associatedPortalArns: S.optional(ArnList),
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
  }),
).annotations({
  identifier: "DataProtectionSettings",
}) as any as S.Schema<DataProtectionSettings>;
export interface UpdateDataProtectionSettingsResponse {
  dataProtectionSettings: DataProtectionSettings;
}
export const UpdateDataProtectionSettingsResponse = S.suspend(() =>
  S.Struct({ dataProtectionSettings: DataProtectionSettings }),
).annotations({
  identifier: "UpdateDataProtectionSettingsResponse",
}) as any as S.Schema<UpdateDataProtectionSettingsResponse>;
export interface CreateIdentityProviderRequest {
  portalArn: string;
  identityProviderName: string | redacted.Redacted<string>;
  identityProviderType: string;
  identityProviderDetails: { [key: string]: string };
  clientToken?: string;
  tags?: Tag[];
}
export const CreateIdentityProviderRequest = S.suspend(() =>
  S.Struct({
    portalArn: S.String,
    identityProviderName: SensitiveString,
    identityProviderType: S.String,
    identityProviderDetails: IdentityProviderDetails,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identityProviders" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIdentityProviderRequest",
}) as any as S.Schema<CreateIdentityProviderRequest>;
export interface IdentityProvider {
  identityProviderArn: string;
  identityProviderName?: string | redacted.Redacted<string>;
  identityProviderType?: string;
  identityProviderDetails?: { [key: string]: string };
}
export const IdentityProvider = S.suspend(() =>
  S.Struct({
    identityProviderArn: S.String,
    identityProviderName: S.optional(SensitiveString),
    identityProviderType: S.optional(S.String),
    identityProviderDetails: S.optional(IdentityProviderDetails),
  }),
).annotations({
  identifier: "IdentityProvider",
}) as any as S.Schema<IdentityProvider>;
export interface UpdateIdentityProviderResponse {
  identityProvider: IdentityProvider;
}
export const UpdateIdentityProviderResponse = S.suspend(() =>
  S.Struct({ identityProvider: IdentityProvider }),
).annotations({
  identifier: "UpdateIdentityProviderResponse",
}) as any as S.Schema<UpdateIdentityProviderResponse>;
export interface CreateIpAccessSettingsRequest {
  displayName?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  tags?: Tag[];
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
  ipRules: IpRule[];
  clientToken?: string;
}
export const CreateIpAccessSettingsRequest = S.suspend(() =>
  S.Struct({
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    tags: S.optional(TagList),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    ipRules: IpRuleList,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ipAccessSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIpAccessSettingsRequest",
}) as any as S.Schema<CreateIpAccessSettingsRequest>;
export interface IpAccessSettings {
  ipAccessSettingsArn: string;
  associatedPortalArns?: string[];
  ipRules?: IpRule[];
  displayName?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  creationDate?: Date;
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
}
export const IpAccessSettings = S.suspend(() =>
  S.Struct({
    ipAccessSettingsArn: S.String,
    associatedPortalArns: S.optional(ArnList),
    ipRules: S.optional(IpRuleList),
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
  }),
).annotations({
  identifier: "IpAccessSettings",
}) as any as S.Schema<IpAccessSettings>;
export interface UpdateIpAccessSettingsResponse {
  ipAccessSettings: IpAccessSettings;
}
export const UpdateIpAccessSettingsResponse = S.suspend(() =>
  S.Struct({ ipAccessSettings: IpAccessSettings }),
).annotations({
  identifier: "UpdateIpAccessSettingsResponse",
}) as any as S.Schema<UpdateIpAccessSettingsResponse>;
export interface CreateNetworkSettingsResponse {
  networkSettingsArn: string;
}
export const CreateNetworkSettingsResponse = S.suspend(() =>
  S.Struct({ networkSettingsArn: S.String }),
).annotations({
  identifier: "CreateNetworkSettingsResponse",
}) as any as S.Schema<CreateNetworkSettingsResponse>;
export interface NetworkSettings {
  networkSettingsArn: string;
  associatedPortalArns?: string[];
  vpcId?: string;
  subnetIds?: string[];
  securityGroupIds?: string[];
}
export const NetworkSettings = S.suspend(() =>
  S.Struct({
    networkSettingsArn: S.String,
    associatedPortalArns: S.optional(ArnList),
    vpcId: S.optional(S.String),
    subnetIds: S.optional(SubnetIdList),
    securityGroupIds: S.optional(SecurityGroupIdList),
  }),
).annotations({
  identifier: "NetworkSettings",
}) as any as S.Schema<NetworkSettings>;
export interface UpdateNetworkSettingsResponse {
  networkSettings: NetworkSettings;
}
export const UpdateNetworkSettingsResponse = S.suspend(() =>
  S.Struct({ networkSettings: NetworkSettings }),
).annotations({
  identifier: "UpdateNetworkSettingsResponse",
}) as any as S.Schema<UpdateNetworkSettingsResponse>;
export interface CreatePortalResponse {
  portalArn: string;
  portalEndpoint: string;
}
export const CreatePortalResponse = S.suspend(() =>
  S.Struct({ portalArn: S.String, portalEndpoint: S.String }),
).annotations({
  identifier: "CreatePortalResponse",
}) as any as S.Schema<CreatePortalResponse>;
export interface Portal {
  portalArn: string;
  rendererType?: string;
  browserType?: string;
  portalStatus?: string;
  portalEndpoint?: string;
  displayName?: string | redacted.Redacted<string>;
  creationDate?: Date;
  browserSettingsArn?: string;
  dataProtectionSettingsArn?: string;
  userSettingsArn?: string;
  networkSettingsArn?: string;
  sessionLoggerArn?: string;
  trustStoreArn?: string;
  statusReason?: string;
  userAccessLoggingSettingsArn?: string;
  authenticationType?: string;
  ipAccessSettingsArn?: string;
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
  instanceType?: string;
  maxConcurrentSessions?: number;
}
export const Portal = S.suspend(() =>
  S.Struct({
    portalArn: S.String,
    rendererType: S.optional(S.String),
    browserType: S.optional(S.String),
    portalStatus: S.optional(S.String),
    portalEndpoint: S.optional(S.String),
    displayName: S.optional(SensitiveString),
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
  }),
).annotations({ identifier: "Portal" }) as any as S.Schema<Portal>;
export interface UpdatePortalResponse {
  portal?: Portal;
}
export const UpdatePortalResponse = S.suspend(() =>
  S.Struct({ portal: S.optional(Portal) }),
).annotations({
  identifier: "UpdatePortalResponse",
}) as any as S.Schema<UpdatePortalResponse>;
export interface AssociateBrowserSettingsResponse {
  portalArn: string;
  browserSettingsArn: string;
}
export const AssociateBrowserSettingsResponse = S.suspend(() =>
  S.Struct({ portalArn: S.String, browserSettingsArn: S.String }),
).annotations({
  identifier: "AssociateBrowserSettingsResponse",
}) as any as S.Schema<AssociateBrowserSettingsResponse>;
export interface AssociateDataProtectionSettingsResponse {
  portalArn: string;
  dataProtectionSettingsArn: string;
}
export const AssociateDataProtectionSettingsResponse = S.suspend(() =>
  S.Struct({ portalArn: S.String, dataProtectionSettingsArn: S.String }),
).annotations({
  identifier: "AssociateDataProtectionSettingsResponse",
}) as any as S.Schema<AssociateDataProtectionSettingsResponse>;
export interface AssociateIpAccessSettingsResponse {
  portalArn: string;
  ipAccessSettingsArn: string;
}
export const AssociateIpAccessSettingsResponse = S.suspend(() =>
  S.Struct({ portalArn: S.String, ipAccessSettingsArn: S.String }),
).annotations({
  identifier: "AssociateIpAccessSettingsResponse",
}) as any as S.Schema<AssociateIpAccessSettingsResponse>;
export interface AssociateNetworkSettingsResponse {
  portalArn: string;
  networkSettingsArn: string;
}
export const AssociateNetworkSettingsResponse = S.suspend(() =>
  S.Struct({ portalArn: S.String, networkSettingsArn: S.String }),
).annotations({
  identifier: "AssociateNetworkSettingsResponse",
}) as any as S.Schema<AssociateNetworkSettingsResponse>;
export interface AssociateSessionLoggerResponse {
  portalArn: string;
  sessionLoggerArn: string;
}
export const AssociateSessionLoggerResponse = S.suspend(() =>
  S.Struct({ portalArn: S.String, sessionLoggerArn: S.String }),
).annotations({
  identifier: "AssociateSessionLoggerResponse",
}) as any as S.Schema<AssociateSessionLoggerResponse>;
export interface AssociateTrustStoreResponse {
  portalArn: string;
  trustStoreArn: string;
}
export const AssociateTrustStoreResponse = S.suspend(() =>
  S.Struct({ portalArn: S.String, trustStoreArn: S.String }),
).annotations({
  identifier: "AssociateTrustStoreResponse",
}) as any as S.Schema<AssociateTrustStoreResponse>;
export interface AssociateUserAccessLoggingSettingsResponse {
  portalArn: string;
  userAccessLoggingSettingsArn: string;
}
export const AssociateUserAccessLoggingSettingsResponse = S.suspend(() =>
  S.Struct({ portalArn: S.String, userAccessLoggingSettingsArn: S.String }),
).annotations({
  identifier: "AssociateUserAccessLoggingSettingsResponse",
}) as any as S.Schema<AssociateUserAccessLoggingSettingsResponse>;
export interface AssociateUserSettingsResponse {
  portalArn: string;
  userSettingsArn: string;
}
export const AssociateUserSettingsResponse = S.suspend(() =>
  S.Struct({ portalArn: S.String, userSettingsArn: S.String }),
).annotations({
  identifier: "AssociateUserSettingsResponse",
}) as any as S.Schema<AssociateUserSettingsResponse>;
export interface GetPortalServiceProviderMetadataResponse {
  portalArn: string;
  serviceProviderSamlMetadata?: string;
}
export const GetPortalServiceProviderMetadataResponse = S.suspend(() =>
  S.Struct({
    portalArn: S.String,
    serviceProviderSamlMetadata: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPortalServiceProviderMetadataResponse",
}) as any as S.Schema<GetPortalServiceProviderMetadataResponse>;
export interface SessionLogger {
  sessionLoggerArn: string;
  eventFilter?: EventFilter;
  logConfiguration?: LogConfiguration;
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
  associatedPortalArns?: string[];
  displayName?: string | redacted.Redacted<string>;
  creationDate?: Date;
}
export const SessionLogger = S.suspend(() =>
  S.Struct({
    sessionLoggerArn: S.String,
    eventFilter: S.optional(EventFilter),
    logConfiguration: S.optional(LogConfiguration),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    associatedPortalArns: S.optional(ArnList),
    displayName: S.optional(SensitiveString),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SessionLogger",
}) as any as S.Schema<SessionLogger>;
export interface UpdateSessionLoggerResponse {
  sessionLogger: SessionLogger;
}
export const UpdateSessionLoggerResponse = S.suspend(() =>
  S.Struct({ sessionLogger: SessionLogger }),
).annotations({
  identifier: "UpdateSessionLoggerResponse",
}) as any as S.Schema<UpdateSessionLoggerResponse>;
export interface CreateTrustStoreResponse {
  trustStoreArn: string;
}
export const CreateTrustStoreResponse = S.suspend(() =>
  S.Struct({ trustStoreArn: S.String }),
).annotations({
  identifier: "CreateTrustStoreResponse",
}) as any as S.Schema<CreateTrustStoreResponse>;
export interface UpdateTrustStoreResponse {
  trustStoreArn: string;
}
export const UpdateTrustStoreResponse = S.suspend(() =>
  S.Struct({ trustStoreArn: S.String }),
).annotations({
  identifier: "UpdateTrustStoreResponse",
}) as any as S.Schema<UpdateTrustStoreResponse>;
export interface CreateUserAccessLoggingSettingsResponse {
  userAccessLoggingSettingsArn: string;
}
export const CreateUserAccessLoggingSettingsResponse = S.suspend(() =>
  S.Struct({ userAccessLoggingSettingsArn: S.String }),
).annotations({
  identifier: "CreateUserAccessLoggingSettingsResponse",
}) as any as S.Schema<CreateUserAccessLoggingSettingsResponse>;
export interface UserAccessLoggingSettings {
  userAccessLoggingSettingsArn: string;
  associatedPortalArns?: string[];
  kinesisStreamArn?: string;
}
export const UserAccessLoggingSettings = S.suspend(() =>
  S.Struct({
    userAccessLoggingSettingsArn: S.String,
    associatedPortalArns: S.optional(ArnList),
    kinesisStreamArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UserAccessLoggingSettings",
}) as any as S.Schema<UserAccessLoggingSettings>;
export interface UpdateUserAccessLoggingSettingsResponse {
  userAccessLoggingSettings: UserAccessLoggingSettings;
}
export const UpdateUserAccessLoggingSettingsResponse = S.suspend(() =>
  S.Struct({ userAccessLoggingSettings: UserAccessLoggingSettings }),
).annotations({
  identifier: "UpdateUserAccessLoggingSettingsResponse",
}) as any as S.Schema<UpdateUserAccessLoggingSettingsResponse>;
export interface CookieSpecification {
  domain: string | redacted.Redacted<string>;
  name?: string | redacted.Redacted<string>;
  path?: string | redacted.Redacted<string>;
}
export const CookieSpecification = S.suspend(() =>
  S.Struct({
    domain: SensitiveString,
    name: S.optional(SensitiveString),
    path: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "CookieSpecification",
}) as any as S.Schema<CookieSpecification>;
export type CookieSpecifications = CookieSpecification[];
export const CookieSpecifications = S.Array(CookieSpecification);
export interface CookieSynchronizationConfiguration {
  allowlist: CookieSpecification[];
  blocklist?: CookieSpecification[];
}
export const CookieSynchronizationConfiguration = S.suspend(() =>
  S.Struct({
    allowlist: CookieSpecifications,
    blocklist: S.optional(CookieSpecifications),
  }),
).annotations({
  identifier: "CookieSynchronizationConfiguration",
}) as any as S.Schema<CookieSynchronizationConfiguration>;
export interface UpdateUserSettingsRequest {
  userSettingsArn: string;
  copyAllowed?: string;
  pasteAllowed?: string;
  downloadAllowed?: string;
  uploadAllowed?: string;
  printAllowed?: string;
  disconnectTimeoutInMinutes?: number;
  idleDisconnectTimeoutInMinutes?: number;
  clientToken?: string;
  cookieSynchronizationConfiguration?: CookieSynchronizationConfiguration;
  deepLinkAllowed?: string;
  toolbarConfiguration?: ToolbarConfiguration;
  brandingConfigurationInput?: BrandingConfigurationUpdateInput;
  webAuthnAllowed?: string;
}
export const UpdateUserSettingsRequest = S.suspend(() =>
  S.Struct({
    userSettingsArn: S.String.pipe(T.HttpLabel("userSettingsArn")),
    copyAllowed: S.optional(S.String),
    pasteAllowed: S.optional(S.String),
    downloadAllowed: S.optional(S.String),
    uploadAllowed: S.optional(S.String),
    printAllowed: S.optional(S.String),
    disconnectTimeoutInMinutes: S.optional(S.Number),
    idleDisconnectTimeoutInMinutes: S.optional(S.Number),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    cookieSynchronizationConfiguration: S.optional(
      CookieSynchronizationConfiguration,
    ),
    deepLinkAllowed: S.optional(S.String),
    toolbarConfiguration: S.optional(ToolbarConfiguration),
    brandingConfigurationInput: S.optional(BrandingConfigurationUpdateInput),
    webAuthnAllowed: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/userSettings/{userSettingsArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateUserSettingsRequest",
}) as any as S.Schema<UpdateUserSettingsRequest>;
export type IpAddressList = string | redacted.Redacted<string>[];
export const IpAddressList = S.Array(SensitiveString);
export interface Session {
  portalArn?: string;
  sessionId?: string;
  username?: string | redacted.Redacted<string>;
  clientIpAddresses?: string | redacted.Redacted<string>[];
  status?: SessionStatus;
  startTime?: Date;
  endTime?: Date;
}
export const Session = S.suspend(() =>
  S.Struct({
    portalArn: S.optional(S.String),
    sessionId: S.optional(S.String),
    username: S.optional(SensitiveString),
    clientIpAddresses: S.optional(IpAddressList),
    status: S.optional(SessionStatus),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Session" }) as any as S.Schema<Session>;
export interface SessionSummary {
  portalArn?: string;
  sessionId?: string;
  username?: string | redacted.Redacted<string>;
  status?: SessionStatus;
  startTime?: Date;
  endTime?: Date;
}
export const SessionSummary = S.suspend(() =>
  S.Struct({
    portalArn: S.optional(S.String),
    sessionId: S.optional(S.String),
    username: S.optional(SensitiveString),
    status: S.optional(SessionStatus),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SessionSummary",
}) as any as S.Schema<SessionSummary>;
export type SessionSummaryList = SessionSummary[];
export const SessionSummaryList = S.Array(SessionSummary);
export interface BrowserSettingsSummary {
  browserSettingsArn: string;
}
export const BrowserSettingsSummary = S.suspend(() =>
  S.Struct({ browserSettingsArn: S.String }),
).annotations({
  identifier: "BrowserSettingsSummary",
}) as any as S.Schema<BrowserSettingsSummary>;
export type BrowserSettingsList = BrowserSettingsSummary[];
export const BrowserSettingsList = S.Array(BrowserSettingsSummary);
export interface DataProtectionSettingsSummary {
  dataProtectionSettingsArn: string;
  displayName?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  creationDate?: Date;
}
export const DataProtectionSettingsSummary = S.suspend(() =>
  S.Struct({
    dataProtectionSettingsArn: S.String,
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DataProtectionSettingsSummary",
}) as any as S.Schema<DataProtectionSettingsSummary>;
export type DataProtectionSettingsList = DataProtectionSettingsSummary[];
export const DataProtectionSettingsList = S.Array(
  DataProtectionSettingsSummary,
);
export interface IdentityProviderSummary {
  identityProviderArn: string;
  identityProviderName?: string | redacted.Redacted<string>;
  identityProviderType?: string;
}
export const IdentityProviderSummary = S.suspend(() =>
  S.Struct({
    identityProviderArn: S.String,
    identityProviderName: S.optional(SensitiveString),
    identityProviderType: S.optional(S.String),
  }),
).annotations({
  identifier: "IdentityProviderSummary",
}) as any as S.Schema<IdentityProviderSummary>;
export type IdentityProviderList = IdentityProviderSummary[];
export const IdentityProviderList = S.Array(IdentityProviderSummary);
export interface IpAccessSettingsSummary {
  ipAccessSettingsArn: string;
  displayName?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  creationDate?: Date;
}
export const IpAccessSettingsSummary = S.suspend(() =>
  S.Struct({
    ipAccessSettingsArn: S.String,
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "IpAccessSettingsSummary",
}) as any as S.Schema<IpAccessSettingsSummary>;
export type IpAccessSettingsList = IpAccessSettingsSummary[];
export const IpAccessSettingsList = S.Array(IpAccessSettingsSummary);
export interface NetworkSettingsSummary {
  networkSettingsArn: string;
  vpcId?: string;
}
export const NetworkSettingsSummary = S.suspend(() =>
  S.Struct({ networkSettingsArn: S.String, vpcId: S.optional(S.String) }),
).annotations({
  identifier: "NetworkSettingsSummary",
}) as any as S.Schema<NetworkSettingsSummary>;
export type NetworkSettingsList = NetworkSettingsSummary[];
export const NetworkSettingsList = S.Array(NetworkSettingsSummary);
export interface PortalSummary {
  portalArn: string;
  rendererType?: string;
  browserType?: string;
  portalStatus?: string;
  portalEndpoint?: string;
  displayName?: string | redacted.Redacted<string>;
  creationDate?: Date;
  browserSettingsArn?: string;
  dataProtectionSettingsArn?: string;
  userSettingsArn?: string;
  networkSettingsArn?: string;
  sessionLoggerArn?: string;
  trustStoreArn?: string;
  userAccessLoggingSettingsArn?: string;
  authenticationType?: string;
  ipAccessSettingsArn?: string;
  instanceType?: string;
  maxConcurrentSessions?: number;
}
export const PortalSummary = S.suspend(() =>
  S.Struct({
    portalArn: S.String,
    rendererType: S.optional(S.String),
    browserType: S.optional(S.String),
    portalStatus: S.optional(S.String),
    portalEndpoint: S.optional(S.String),
    displayName: S.optional(SensitiveString),
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
  }),
).annotations({
  identifier: "PortalSummary",
}) as any as S.Schema<PortalSummary>;
export type PortalList = PortalSummary[];
export const PortalList = S.Array(PortalSummary);
export interface SessionLoggerSummary {
  sessionLoggerArn: string;
  logConfiguration?: LogConfiguration;
  displayName?: string | redacted.Redacted<string>;
  creationDate?: Date;
}
export const SessionLoggerSummary = S.suspend(() =>
  S.Struct({
    sessionLoggerArn: S.String,
    logConfiguration: S.optional(LogConfiguration),
    displayName: S.optional(SensitiveString),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SessionLoggerSummary",
}) as any as S.Schema<SessionLoggerSummary>;
export type SessionLoggerList = SessionLoggerSummary[];
export const SessionLoggerList = S.Array(SessionLoggerSummary);
export interface TrustStore {
  associatedPortalArns?: string[];
  trustStoreArn: string;
}
export const TrustStore = S.suspend(() =>
  S.Struct({
    associatedPortalArns: S.optional(ArnList),
    trustStoreArn: S.String,
  }),
).annotations({ identifier: "TrustStore" }) as any as S.Schema<TrustStore>;
export interface TrustStoreSummary {
  trustStoreArn?: string;
}
export const TrustStoreSummary = S.suspend(() =>
  S.Struct({ trustStoreArn: S.optional(S.String) }),
).annotations({
  identifier: "TrustStoreSummary",
}) as any as S.Schema<TrustStoreSummary>;
export type TrustStoreSummaryList = TrustStoreSummary[];
export const TrustStoreSummaryList = S.Array(TrustStoreSummary);
export interface Certificate {
  thumbprint?: string;
  subject?: string;
  issuer?: string;
  notValidBefore?: Date;
  notValidAfter?: Date;
  body?: Uint8Array;
}
export const Certificate = S.suspend(() =>
  S.Struct({
    thumbprint: S.optional(S.String),
    subject: S.optional(S.String),
    issuer: S.optional(S.String),
    notValidBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    notValidAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    body: S.optional(T.Blob),
  }),
).annotations({ identifier: "Certificate" }) as any as S.Schema<Certificate>;
export interface CertificateSummary {
  thumbprint?: string;
  subject?: string;
  issuer?: string;
  notValidBefore?: Date;
  notValidAfter?: Date;
}
export const CertificateSummary = S.suspend(() =>
  S.Struct({
    thumbprint: S.optional(S.String),
    subject: S.optional(S.String),
    issuer: S.optional(S.String),
    notValidBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    notValidAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CertificateSummary",
}) as any as S.Schema<CertificateSummary>;
export type CertificateSummaryList = CertificateSummary[];
export const CertificateSummaryList = S.Array(CertificateSummary);
export interface UserAccessLoggingSettingsSummary {
  userAccessLoggingSettingsArn: string;
  kinesisStreamArn?: string;
}
export const UserAccessLoggingSettingsSummary = S.suspend(() =>
  S.Struct({
    userAccessLoggingSettingsArn: S.String,
    kinesisStreamArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UserAccessLoggingSettingsSummary",
}) as any as S.Schema<UserAccessLoggingSettingsSummary>;
export type UserAccessLoggingSettingsList = UserAccessLoggingSettingsSummary[];
export const UserAccessLoggingSettingsList = S.Array(
  UserAccessLoggingSettingsSummary,
);
export type MimeType = "image/png" | "image/jpeg" | "image/x-icon";
export const MimeType = S.Literal("image/png", "image/jpeg", "image/x-icon");
export interface ImageMetadata {
  mimeType: MimeType;
  fileExtension: string;
  lastUploadTimestamp: Date;
}
export const ImageMetadata = S.suspend(() =>
  S.Struct({
    mimeType: MimeType,
    fileExtension: S.String,
    lastUploadTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ImageMetadata",
}) as any as S.Schema<ImageMetadata>;
export interface BrandingConfiguration {
  logo: ImageMetadata;
  wallpaper: ImageMetadata;
  favicon: ImageMetadata;
  localizedStrings: { [key: string]: LocalizedBrandingStrings };
  colorTheme: ColorTheme;
  termsOfService?: string | redacted.Redacted<string>;
}
export const BrandingConfiguration = S.suspend(() =>
  S.Struct({
    logo: ImageMetadata,
    wallpaper: ImageMetadata,
    favicon: ImageMetadata,
    localizedStrings: LocalizedBrandingStringMap,
    colorTheme: ColorTheme,
    termsOfService: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "BrandingConfiguration",
}) as any as S.Schema<BrandingConfiguration>;
export interface UserSettingsSummary {
  userSettingsArn: string;
  copyAllowed?: string;
  pasteAllowed?: string;
  downloadAllowed?: string;
  uploadAllowed?: string;
  printAllowed?: string;
  disconnectTimeoutInMinutes?: number;
  idleDisconnectTimeoutInMinutes?: number;
  cookieSynchronizationConfiguration?: CookieSynchronizationConfiguration;
  deepLinkAllowed?: string;
  toolbarConfiguration?: ToolbarConfiguration;
  brandingConfiguration?: BrandingConfiguration;
  webAuthnAllowed?: string;
}
export const UserSettingsSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "UserSettingsSummary",
}) as any as S.Schema<UserSettingsSummary>;
export type UserSettingsList = UserSettingsSummary[];
export const UserSettingsList = S.Array(UserSettingsSummary);
export interface GetSessionResponse {
  session?: Session;
}
export const GetSessionResponse = S.suspend(() =>
  S.Struct({ session: S.optional(Session) }),
).annotations({
  identifier: "GetSessionResponse",
}) as any as S.Schema<GetSessionResponse>;
export interface ListSessionsResponse {
  sessions: SessionSummary[];
  nextToken?: string;
}
export const ListSessionsResponse = S.suspend(() =>
  S.Struct({ sessions: SessionSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSessionsResponse",
}) as any as S.Schema<ListSessionsResponse>;
export interface CreateBrowserSettingsResponse {
  browserSettingsArn: string;
}
export const CreateBrowserSettingsResponse = S.suspend(() =>
  S.Struct({ browserSettingsArn: S.String }),
).annotations({
  identifier: "CreateBrowserSettingsResponse",
}) as any as S.Schema<CreateBrowserSettingsResponse>;
export interface GetBrowserSettingsResponse {
  browserSettings?: BrowserSettings;
}
export const GetBrowserSettingsResponse = S.suspend(() =>
  S.Struct({ browserSettings: S.optional(BrowserSettings) }),
).annotations({
  identifier: "GetBrowserSettingsResponse",
}) as any as S.Schema<GetBrowserSettingsResponse>;
export interface ListBrowserSettingsResponse {
  browserSettings?: BrowserSettingsSummary[];
  nextToken?: string;
}
export const ListBrowserSettingsResponse = S.suspend(() =>
  S.Struct({
    browserSettings: S.optional(BrowserSettingsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBrowserSettingsResponse",
}) as any as S.Schema<ListBrowserSettingsResponse>;
export interface GetDataProtectionSettingsResponse {
  dataProtectionSettings?: DataProtectionSettings;
}
export const GetDataProtectionSettingsResponse = S.suspend(() =>
  S.Struct({ dataProtectionSettings: S.optional(DataProtectionSettings) }),
).annotations({
  identifier: "GetDataProtectionSettingsResponse",
}) as any as S.Schema<GetDataProtectionSettingsResponse>;
export interface ListDataProtectionSettingsResponse {
  dataProtectionSettings?: DataProtectionSettingsSummary[];
  nextToken?: string;
}
export const ListDataProtectionSettingsResponse = S.suspend(() =>
  S.Struct({
    dataProtectionSettings: S.optional(DataProtectionSettingsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataProtectionSettingsResponse",
}) as any as S.Schema<ListDataProtectionSettingsResponse>;
export interface CreateIdentityProviderResponse {
  identityProviderArn: string;
}
export const CreateIdentityProviderResponse = S.suspend(() =>
  S.Struct({ identityProviderArn: S.String }),
).annotations({
  identifier: "CreateIdentityProviderResponse",
}) as any as S.Schema<CreateIdentityProviderResponse>;
export interface GetIdentityProviderResponse {
  identityProvider?: IdentityProvider;
}
export const GetIdentityProviderResponse = S.suspend(() =>
  S.Struct({ identityProvider: S.optional(IdentityProvider) }),
).annotations({
  identifier: "GetIdentityProviderResponse",
}) as any as S.Schema<GetIdentityProviderResponse>;
export interface ListIdentityProvidersResponse {
  nextToken?: string;
  identityProviders?: IdentityProviderSummary[];
}
export const ListIdentityProvidersResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    identityProviders: S.optional(IdentityProviderList),
  }),
).annotations({
  identifier: "ListIdentityProvidersResponse",
}) as any as S.Schema<ListIdentityProvidersResponse>;
export interface CreateIpAccessSettingsResponse {
  ipAccessSettingsArn: string;
}
export const CreateIpAccessSettingsResponse = S.suspend(() =>
  S.Struct({ ipAccessSettingsArn: S.String }),
).annotations({
  identifier: "CreateIpAccessSettingsResponse",
}) as any as S.Schema<CreateIpAccessSettingsResponse>;
export interface GetIpAccessSettingsResponse {
  ipAccessSettings?: IpAccessSettings;
}
export const GetIpAccessSettingsResponse = S.suspend(() =>
  S.Struct({ ipAccessSettings: S.optional(IpAccessSettings) }),
).annotations({
  identifier: "GetIpAccessSettingsResponse",
}) as any as S.Schema<GetIpAccessSettingsResponse>;
export interface ListIpAccessSettingsResponse {
  ipAccessSettings?: IpAccessSettingsSummary[];
  nextToken?: string;
}
export const ListIpAccessSettingsResponse = S.suspend(() =>
  S.Struct({
    ipAccessSettings: S.optional(IpAccessSettingsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIpAccessSettingsResponse",
}) as any as S.Schema<ListIpAccessSettingsResponse>;
export interface GetNetworkSettingsResponse {
  networkSettings?: NetworkSettings;
}
export const GetNetworkSettingsResponse = S.suspend(() =>
  S.Struct({ networkSettings: S.optional(NetworkSettings) }),
).annotations({
  identifier: "GetNetworkSettingsResponse",
}) as any as S.Schema<GetNetworkSettingsResponse>;
export interface ListNetworkSettingsResponse {
  networkSettings?: NetworkSettingsSummary[];
  nextToken?: string;
}
export const ListNetworkSettingsResponse = S.suspend(() =>
  S.Struct({
    networkSettings: S.optional(NetworkSettingsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNetworkSettingsResponse",
}) as any as S.Schema<ListNetworkSettingsResponse>;
export interface GetPortalResponse {
  portal?: Portal;
}
export const GetPortalResponse = S.suspend(() =>
  S.Struct({ portal: S.optional(Portal) }),
).annotations({
  identifier: "GetPortalResponse",
}) as any as S.Schema<GetPortalResponse>;
export interface ListPortalsResponse {
  portals?: PortalSummary[];
  nextToken?: string;
}
export const ListPortalsResponse = S.suspend(() =>
  S.Struct({
    portals: S.optional(PortalList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPortalsResponse",
}) as any as S.Schema<ListPortalsResponse>;
export interface CreateSessionLoggerRequest {
  eventFilter: EventFilter;
  logConfiguration: LogConfiguration;
  displayName?: string | redacted.Redacted<string>;
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
  tags?: Tag[];
  clientToken?: string;
}
export const CreateSessionLoggerRequest = S.suspend(() =>
  S.Struct({
    eventFilter: EventFilter,
    logConfiguration: LogConfiguration,
    displayName: S.optional(SensitiveString),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    tags: S.optional(TagList),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/sessionLoggers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSessionLoggerRequest",
}) as any as S.Schema<CreateSessionLoggerRequest>;
export interface GetSessionLoggerResponse {
  sessionLogger?: SessionLogger;
}
export const GetSessionLoggerResponse = S.suspend(() =>
  S.Struct({ sessionLogger: S.optional(SessionLogger) }),
).annotations({
  identifier: "GetSessionLoggerResponse",
}) as any as S.Schema<GetSessionLoggerResponse>;
export interface ListSessionLoggersResponse {
  sessionLoggers?: SessionLoggerSummary[];
  nextToken?: string;
}
export const ListSessionLoggersResponse = S.suspend(() =>
  S.Struct({
    sessionLoggers: S.optional(SessionLoggerList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSessionLoggersResponse",
}) as any as S.Schema<ListSessionLoggersResponse>;
export interface GetTrustStoreResponse {
  trustStore?: TrustStore;
}
export const GetTrustStoreResponse = S.suspend(() =>
  S.Struct({ trustStore: S.optional(TrustStore) }),
).annotations({
  identifier: "GetTrustStoreResponse",
}) as any as S.Schema<GetTrustStoreResponse>;
export interface ListTrustStoresResponse {
  trustStores?: TrustStoreSummary[];
  nextToken?: string;
}
export const ListTrustStoresResponse = S.suspend(() =>
  S.Struct({
    trustStores: S.optional(TrustStoreSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTrustStoresResponse",
}) as any as S.Schema<ListTrustStoresResponse>;
export interface GetTrustStoreCertificateResponse {
  trustStoreArn: string;
  certificate?: Certificate;
}
export const GetTrustStoreCertificateResponse = S.suspend(() =>
  S.Struct({ trustStoreArn: S.String, certificate: S.optional(Certificate) }),
).annotations({
  identifier: "GetTrustStoreCertificateResponse",
}) as any as S.Schema<GetTrustStoreCertificateResponse>;
export interface ListTrustStoreCertificatesResponse {
  certificateList?: CertificateSummary[];
  trustStoreArn: string;
  nextToken?: string;
}
export const ListTrustStoreCertificatesResponse = S.suspend(() =>
  S.Struct({
    certificateList: S.optional(CertificateSummaryList),
    trustStoreArn: S.String,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTrustStoreCertificatesResponse",
}) as any as S.Schema<ListTrustStoreCertificatesResponse>;
export interface GetUserAccessLoggingSettingsResponse {
  userAccessLoggingSettings?: UserAccessLoggingSettings;
}
export const GetUserAccessLoggingSettingsResponse = S.suspend(() =>
  S.Struct({
    userAccessLoggingSettings: S.optional(UserAccessLoggingSettings),
  }),
).annotations({
  identifier: "GetUserAccessLoggingSettingsResponse",
}) as any as S.Schema<GetUserAccessLoggingSettingsResponse>;
export interface ListUserAccessLoggingSettingsResponse {
  userAccessLoggingSettings?: UserAccessLoggingSettingsSummary[];
  nextToken?: string;
}
export const ListUserAccessLoggingSettingsResponse = S.suspend(() =>
  S.Struct({
    userAccessLoggingSettings: S.optional(UserAccessLoggingSettingsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListUserAccessLoggingSettingsResponse",
}) as any as S.Schema<ListUserAccessLoggingSettingsResponse>;
export interface UserSettings {
  userSettingsArn: string;
  associatedPortalArns?: string[];
  copyAllowed?: string;
  pasteAllowed?: string;
  downloadAllowed?: string;
  uploadAllowed?: string;
  printAllowed?: string;
  disconnectTimeoutInMinutes?: number;
  idleDisconnectTimeoutInMinutes?: number;
  cookieSynchronizationConfiguration?: CookieSynchronizationConfiguration;
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
  deepLinkAllowed?: string;
  toolbarConfiguration?: ToolbarConfiguration;
  brandingConfiguration?: BrandingConfiguration;
  webAuthnAllowed?: string;
}
export const UserSettings = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "UserSettings" }) as any as S.Schema<UserSettings>;
export interface UpdateUserSettingsResponse {
  userSettings: UserSettings;
}
export const UpdateUserSettingsResponse = S.suspend(() =>
  S.Struct({ userSettings: UserSettings }),
).annotations({
  identifier: "UpdateUserSettingsResponse",
}) as any as S.Schema<UpdateUserSettingsResponse>;
export interface ListUserSettingsResponse {
  userSettings?: UserSettingsSummary[];
  nextToken?: string;
}
export const ListUserSettingsResponse = S.suspend(() =>
  S.Struct({
    userSettings: S.optional(UserSettingsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListUserSettingsResponse",
}) as any as S.Schema<ListUserSettingsResponse>;
export interface BrandingConfigurationCreateInput {
  logo: IconImageInput;
  wallpaper?: WallpaperImageInput;
  favicon: IconImageInput;
  localizedStrings: { [key: string]: LocalizedBrandingStrings };
  colorTheme: ColorTheme;
  termsOfService?: string | redacted.Redacted<string>;
}
export const BrandingConfigurationCreateInput = S.suspend(() =>
  S.Struct({
    logo: IconImageInput,
    wallpaper: S.optional(WallpaperImageInput),
    favicon: IconImageInput,
    localizedStrings: LocalizedBrandingStringMap,
    colorTheme: ColorTheme,
    termsOfService: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "BrandingConfigurationCreateInput",
}) as any as S.Schema<BrandingConfigurationCreateInput>;
export interface CreateDataProtectionSettingsRequest {
  displayName?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  tags?: Tag[];
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
  inlineRedactionConfiguration?: InlineRedactionConfiguration;
  clientToken?: string;
}
export const CreateDataProtectionSettingsRequest = S.suspend(() =>
  S.Struct({
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    tags: S.optional(TagList),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    inlineRedactionConfiguration: S.optional(InlineRedactionConfiguration),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/dataProtectionSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataProtectionSettingsRequest",
}) as any as S.Schema<CreateDataProtectionSettingsRequest>;
export interface CreateSessionLoggerResponse {
  sessionLoggerArn: string;
}
export const CreateSessionLoggerResponse = S.suspend(() =>
  S.Struct({ sessionLoggerArn: S.String }),
).annotations({
  identifier: "CreateSessionLoggerResponse",
}) as any as S.Schema<CreateSessionLoggerResponse>;
export interface CreateUserSettingsRequest {
  copyAllowed: string;
  pasteAllowed: string;
  downloadAllowed: string;
  uploadAllowed: string;
  printAllowed: string;
  tags?: Tag[];
  disconnectTimeoutInMinutes?: number;
  idleDisconnectTimeoutInMinutes?: number;
  clientToken?: string;
  cookieSynchronizationConfiguration?: CookieSynchronizationConfiguration;
  customerManagedKey?: string;
  additionalEncryptionContext?: { [key: string]: string };
  deepLinkAllowed?: string;
  toolbarConfiguration?: ToolbarConfiguration;
  brandingConfigurationInput?: BrandingConfigurationCreateInput;
  webAuthnAllowed?: string;
}
export const CreateUserSettingsRequest = S.suspend(() =>
  S.Struct({
    copyAllowed: S.String,
    pasteAllowed: S.String,
    downloadAllowed: S.String,
    uploadAllowed: S.String,
    printAllowed: S.String,
    tags: S.optional(TagList),
    disconnectTimeoutInMinutes: S.optional(S.Number),
    idleDisconnectTimeoutInMinutes: S.optional(S.Number),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    cookieSynchronizationConfiguration: S.optional(
      CookieSynchronizationConfiguration,
    ),
    customerManagedKey: S.optional(S.String),
    additionalEncryptionContext: S.optional(EncryptionContextMap),
    deepLinkAllowed: S.optional(S.String),
    toolbarConfiguration: S.optional(ToolbarConfiguration),
    brandingConfigurationInput: S.optional(BrandingConfigurationCreateInput),
    webAuthnAllowed: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/userSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUserSettingsRequest",
}) as any as S.Schema<CreateUserSettingsRequest>;
export interface CreateDataProtectionSettingsResponse {
  dataProtectionSettingsArn: string;
}
export const CreateDataProtectionSettingsResponse = S.suspend(() =>
  S.Struct({ dataProtectionSettingsArn: S.String }),
).annotations({
  identifier: "CreateDataProtectionSettingsResponse",
}) as any as S.Schema<CreateDataProtectionSettingsResponse>;
export interface CreateUserSettingsResponse {
  userSettingsArn: string;
}
export const CreateUserSettingsResponse = S.suspend(() =>
  S.Struct({ userSettingsArn: S.String }),
).annotations({
  identifier: "CreateUserSettingsResponse",
}) as any as S.Schema<CreateUserSettingsResponse>;
export interface GetUserSettingsResponse {
  userSettings?: UserSettings;
}
export const GetUserSettingsResponse = S.suspend(() =>
  S.Struct({ userSettings: S.optional(UserSettings) }),
).annotations({
  identifier: "GetUserSettingsResponse",
}) as any as S.Schema<GetUserSettingsResponse>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Retrieves a list of browser settings.
 */
export const listBrowserSettings: {
  (
    input: ListBrowserSettingsRequest,
  ): effect.Effect<
    ListBrowserSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBrowserSettingsRequest,
  ) => stream.Stream<
    ListBrowserSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBrowserSettingsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createNetworkSettings: (
  input: CreateNetworkSettingsRequest,
) => effect.Effect<
  CreateNetworkSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a session logger.
 */
export const createSessionLogger: (
  input: CreateSessionLoggerRequest,
) => effect.Effect<
  CreateSessionLoggerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSession: (
  input: GetSessionRequest,
) => effect.Effect<
  GetSessionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSessions: {
  (
    input: ListSessionsRequest,
  ): effect.Effect<
    ListSessionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionsRequest,
  ) => stream.Stream<
    ListSessionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionsRequest,
  ) => stream.Stream<
    SessionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Gets browser settings.
 */
export const getBrowserSettings: (
  input: GetBrowserSettingsRequest,
) => effect.Effect<
  GetBrowserSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataProtectionSettings: (
  input: GetDataProtectionSettingsRequest,
) => effect.Effect<
  GetDataProtectionSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataProtectionSettingsRequest,
  output: GetDataProtectionSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the identity provider.
 */
export const getIdentityProvider: (
  input: GetIdentityProviderRequest,
) => effect.Effect<
  GetIdentityProviderResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getIpAccessSettings: (
  input: GetIpAccessSettingsRequest,
) => effect.Effect<
  GetIpAccessSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getNetworkSettings: (
  input: GetNetworkSettingsRequest,
) => effect.Effect<
  GetNetworkSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPortal: (
  input: GetPortalRequest,
) => effect.Effect<
  GetPortalResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSessionLogger: (
  input: GetSessionLoggerRequest,
) => effect.Effect<
  GetSessionLoggerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTrustStore: (
  input: GetTrustStoreRequest,
) => effect.Effect<
  GetTrustStoreResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTrustStoreCertificate: (
  input: GetTrustStoreCertificateRequest,
) => effect.Effect<
  GetTrustStoreCertificateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrustStoreCertificateRequest,
  output: GetTrustStoreCertificateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of trust store certificates.
 */
export const listTrustStoreCertificates: {
  (
    input: ListTrustStoreCertificatesRequest,
  ): effect.Effect<
    ListTrustStoreCertificatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrustStoreCertificatesRequest,
  ) => stream.Stream<
    ListTrustStoreCertificatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrustStoreCertificatesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getUserAccessLoggingSettings: (
  input: GetUserAccessLoggingSettingsRequest,
) => effect.Effect<
  GetUserAccessLoggingSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateUserSettings: (
  input: UpdateUserSettingsRequest,
) => effect.Effect<
  UpdateUserSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBrowserSettings: (
  input: UpdateBrowserSettingsRequest,
) => effect.Effect<
  UpdateBrowserSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBrowserSettingsRequest,
  output: UpdateBrowserSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates data protection settings.
 */
export const updateDataProtectionSettings: (
  input: UpdateDataProtectionSettingsRequest,
) => effect.Effect<
  UpdateDataProtectionSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateIdentityProvider: (
  input: UpdateIdentityProviderRequest,
) => effect.Effect<
  UpdateIdentityProviderResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIdentityProviderRequest,
  output: UpdateIdentityProviderResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates IP access settings.
 */
export const updateIpAccessSettings: (
  input: UpdateIpAccessSettingsRequest,
) => effect.Effect<
  UpdateIpAccessSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIpAccessSettingsRequest,
  output: UpdateIpAccessSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates network settings.
 */
export const updateNetworkSettings: (
  input: UpdateNetworkSettingsRequest,
) => effect.Effect<
  UpdateNetworkSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNetworkSettingsRequest,
  output: UpdateNetworkSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the service provider metadata.
 */
export const getPortalServiceProviderMetadata: (
  input: GetPortalServiceProviderMetadataRequest,
) => effect.Effect<
  GetPortalServiceProviderMetadataResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSessionLogger: (
  input: UpdateSessionLoggerRequest,
) => effect.Effect<
  UpdateSessionLoggerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTrustStore: (
  input: UpdateTrustStoreRequest,
) => effect.Effect<
  UpdateTrustStoreResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateUserAccessLoggingSettings: (
  input: UpdateUserAccessLoggingSettingsRequest,
) => effect.Effect<
  UpdateUserAccessLoggingSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateSessionLogger: (
  input: DisassociateSessionLoggerRequest,
) => effect.Effect<
  DisassociateSessionLoggerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateSessionLoggerRequest,
  output: DisassociateSessionLoggerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a web portal.
 */
export const createPortal: (
  input: CreatePortalRequest,
) => effect.Effect<
  CreatePortalResponse,
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
export const updatePortal: (
  input: UpdatePortalRequest,
) => effect.Effect<
  UpdatePortalResponse,
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
export const associateBrowserSettings: (
  input: AssociateBrowserSettingsRequest,
) => effect.Effect<
  AssociateBrowserSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Associates a data protection settings resource with a web portal.
 */
export const associateDataProtectionSettings: (
  input: AssociateDataProtectionSettingsRequest,
) => effect.Effect<
  AssociateDataProtectionSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateIpAccessSettings: (
  input: AssociateIpAccessSettingsRequest,
) => effect.Effect<
  AssociateIpAccessSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Associates a network settings resource with a web portal.
 */
export const associateNetworkSettings: (
  input: AssociateNetworkSettingsRequest,
) => effect.Effect<
  AssociateNetworkSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Associates a session logger with a portal.
 */
export const associateSessionLogger: (
  input: AssociateSessionLoggerRequest,
) => effect.Effect<
  AssociateSessionLoggerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Associates a trust store with a web portal.
 */
export const associateTrustStore: (
  input: AssociateTrustStoreRequest,
) => effect.Effect<
  AssociateTrustStoreResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateUserAccessLoggingSettings: (
  input: AssociateUserAccessLoggingSettingsRequest,
) => effect.Effect<
  AssociateUserAccessLoggingSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateUserSettings: (
  input: AssociateUserSettingsRequest,
) => effect.Effect<
  AssociateUserSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disassociates browser settings from a web portal.
 */
export const disassociateBrowserSettings: (
  input: DisassociateBrowserSettingsRequest,
) => effect.Effect<
  DisassociateBrowserSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disassociates data protection settings from a web portal.
 */
export const disassociateDataProtectionSettings: (
  input: DisassociateDataProtectionSettingsRequest,
) => effect.Effect<
  DisassociateDataProtectionSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateIpAccessSettings: (
  input: DisassociateIpAccessSettingsRequest,
) => effect.Effect<
  DisassociateIpAccessSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateNetworkSettings: (
  input: DisassociateNetworkSettingsRequest,
) => effect.Effect<
  DisassociateNetworkSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disassociates a trust store from a web portal.
 */
export const disassociateTrustStore: (
  input: DisassociateTrustStoreRequest,
) => effect.Effect<
  DisassociateTrustStoreResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disassociates user access logging settings from a web portal.
 */
export const disassociateUserAccessLoggingSettings: (
  input: DisassociateUserAccessLoggingSettingsRequest,
) => effect.Effect<
  DisassociateUserAccessLoggingSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateUserSettings: (
  input: DisassociateUserSettingsRequest,
) => effect.Effect<
  DisassociateUserSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a browser settings resource that can be associated with a web portal. Once associated with a web portal, browser settings control how the browser will behave once a user starts a streaming session for the web portal.
 */
export const createBrowserSettings: (
  input: CreateBrowserSettingsRequest,
) => effect.Effect<
  CreateBrowserSettingsResponse,
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
}));
/**
 * Creates an identity provider resource that is then associated with a web portal.
 */
export const createIdentityProvider: (
  input: CreateIdentityProviderRequest,
) => effect.Effect<
  CreateIdentityProviderResponse,
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
}));
/**
 * Retrieves a list of data protection settings.
 */
export const listDataProtectionSettings: {
  (
    input: ListDataProtectionSettingsRequest,
  ): effect.Effect<
    ListDataProtectionSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataProtectionSettingsRequest,
  ) => stream.Stream<
    ListDataProtectionSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataProtectionSettingsRequest,
  ) => stream.Stream<
    DataProtectionSettingsSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listIdentityProviders: {
  (
    input: ListIdentityProvidersRequest,
  ): effect.Effect<
    ListIdentityProvidersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdentityProvidersRequest,
  ) => stream.Stream<
    ListIdentityProvidersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdentityProvidersRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listIpAccessSettings: {
  (
    input: ListIpAccessSettingsRequest,
  ): effect.Effect<
    ListIpAccessSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIpAccessSettingsRequest,
  ) => stream.Stream<
    ListIpAccessSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIpAccessSettingsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listNetworkSettings: {
  (
    input: ListNetworkSettingsRequest,
  ): effect.Effect<
    ListNetworkSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNetworkSettingsRequest,
  ) => stream.Stream<
    ListNetworkSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNetworkSettingsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPortals: {
  (
    input: ListPortalsRequest,
  ): effect.Effect<
    ListPortalsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPortalsRequest,
  ) => stream.Stream<
    ListPortalsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPortalsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all available session logger resources.
 */
export const listSessionLoggers: {
  (
    input: ListSessionLoggersRequest,
  ): effect.Effect<
    ListSessionLoggersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionLoggersRequest,
  ) => stream.Stream<
    ListSessionLoggersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionLoggersRequest,
  ) => stream.Stream<
    SessionLoggerSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Retrieves a list of trust stores.
 */
export const listTrustStores: {
  (
    input: ListTrustStoresRequest,
  ): effect.Effect<
    ListTrustStoresResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrustStoresRequest,
  ) => stream.Stream<
    ListTrustStoresResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrustStoresRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Retrieves a list of user access logging settings.
 */
export const listUserAccessLoggingSettings: {
  (
    input: ListUserAccessLoggingSettingsRequest,
  ): effect.Effect<
    ListUserAccessLoggingSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUserAccessLoggingSettingsRequest,
  ) => stream.Stream<
    ListUserAccessLoggingSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUserAccessLoggingSettingsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listUserSettings: {
  (
    input: ListUserSettingsRequest,
  ): effect.Effect<
    ListUserSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUserSettingsRequest,
  ) => stream.Stream<
    ListUserSettingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUserSettingsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Deletes browser settings.
 */
export const deleteBrowserSettings: (
  input: DeleteBrowserSettingsRequest,
) => effect.Effect<
  DeleteBrowserSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBrowserSettingsRequest,
  output: DeleteBrowserSettingsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes data protection settings.
 */
export const deleteDataProtectionSettings: (
  input: DeleteDataProtectionSettingsRequest,
) => effect.Effect<
  DeleteDataProtectionSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteIdentityProvider: (
  input: DeleteIdentityProviderRequest,
) => effect.Effect<
  DeleteIdentityProviderResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentityProviderRequest,
  output: DeleteIdentityProviderResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes IP access settings.
 */
export const deleteIpAccessSettings: (
  input: DeleteIpAccessSettingsRequest,
) => effect.Effect<
  DeleteIpAccessSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIpAccessSettingsRequest,
  output: DeleteIpAccessSettingsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes network settings.
 */
export const deleteNetworkSettings: (
  input: DeleteNetworkSettingsRequest,
) => effect.Effect<
  DeleteNetworkSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNetworkSettingsRequest,
  output: DeleteNetworkSettingsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a web portal.
 */
export const deletePortal: (
  input: DeletePortalRequest,
) => effect.Effect<
  DeletePortalResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSessionLogger: (
  input: DeleteSessionLoggerRequest,
) => effect.Effect<
  DeleteSessionLoggerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTrustStore: (
  input: DeleteTrustStoreRequest,
) => effect.Effect<
  DeleteTrustStoreResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteUserAccessLoggingSettings: (
  input: DeleteUserAccessLoggingSettingsRequest,
) => effect.Effect<
  DeleteUserAccessLoggingSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteUserSettings: (
  input: DeleteUserSettingsRequest,
) => effect.Effect<
  DeleteUserSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const expireSession: (
  input: ExpireSessionRequest,
) => effect.Effect<
  ExpireSessionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTrustStore: (
  input: CreateTrustStoreRequest,
) => effect.Effect<
  CreateTrustStoreResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createUserAccessLoggingSettings: (
  input: CreateUserAccessLoggingSettingsRequest,
) => effect.Effect<
  CreateUserAccessLoggingSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createIpAccessSettings: (
  input: CreateIpAccessSettingsRequest,
) => effect.Effect<
  CreateIpAccessSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a data protection settings resource that can be associated with a web portal.
 */
export const createDataProtectionSettings: (
  input: CreateDataProtectionSettingsRequest,
) => effect.Effect<
  CreateDataProtectionSettingsResponse,
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
export const createUserSettings: (
  input: CreateUserSettingsRequest,
) => effect.Effect<
  CreateUserSettingsResponse,
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
export const getUserSettings: (
  input: GetUserSettingsRequest,
) => effect.Effect<
  GetUserSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

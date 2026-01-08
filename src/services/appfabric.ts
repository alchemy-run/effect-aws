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
  sdkId: "AppFabric",
  serviceShapeName: "FabricFrontEndService",
});
const auth = T.AwsAuthSigv4({ name: "appfabric" });
const ver = T.ServiceVersion("2023-05-19");
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
              `https://appfabric-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://appfabric-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://appfabric.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://appfabric.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Identifier = string;
export type UUID = string;
export type String255 = string;
export type TenantIdentifier = string;
export type MaxResults = number;
export type String2048 = string;
export type Arn = string;
export type Email = string | Redacted.Redacted<string>;
export type TagKey = string;
export type RedirectUri = string;
export type SensitiveString2048 = string | Redacted.Redacted<string>;
export type TagValue = string;
export type Integer = number;
export type String63 = string;
export type String120 = string;
export type String64 = string;

//# Schemas
export type TaskIdList = string[];
export const TaskIdList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface BatchGetUserAccessTasksRequest {
  appBundleIdentifier: string;
  taskIdList: TaskIdList;
}
export const BatchGetUserAccessTasksRequest = S.suspend(() =>
  S.Struct({ appBundleIdentifier: S.String, taskIdList: TaskIdList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/useraccess/batchget" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetUserAccessTasksRequest",
}) as any as S.Schema<BatchGetUserAccessTasksRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateAppBundleRequest {
  clientToken?: string;
  customerManagedKeyIdentifier?: string;
  tags?: TagList;
}
export const CreateAppBundleRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    customerManagedKeyIdentifier: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/appbundles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppBundleRequest",
}) as any as S.Schema<CreateAppBundleRequest>;
export interface CreateIngestionRequest {
  appBundleIdentifier: string;
  app: string;
  tenantId: string;
  ingestionType: string;
  clientToken?: string;
  tags?: TagList;
}
export const CreateIngestionRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    app: S.String,
    tenantId: S.String,
    ingestionType: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/appbundles/{appBundleIdentifier}/ingestions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIngestionRequest",
}) as any as S.Schema<CreateIngestionRequest>;
export interface DeleteAppAuthorizationRequest {
  appBundleIdentifier: string;
  appAuthorizationIdentifier: string;
}
export const DeleteAppAuthorizationRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    appAuthorizationIdentifier: S.String.pipe(
      T.HttpLabel("appAuthorizationIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/appbundles/{appBundleIdentifier}/appauthorizations/{appAuthorizationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppAuthorizationRequest",
}) as any as S.Schema<DeleteAppAuthorizationRequest>;
export interface DeleteAppAuthorizationResponse {}
export const DeleteAppAuthorizationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAppAuthorizationResponse",
}) as any as S.Schema<DeleteAppAuthorizationResponse>;
export interface DeleteAppBundleRequest {
  appBundleIdentifier: string;
}
export const DeleteAppBundleRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/appbundles/{appBundleIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppBundleRequest",
}) as any as S.Schema<DeleteAppBundleRequest>;
export interface DeleteAppBundleResponse {}
export const DeleteAppBundleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAppBundleResponse",
}) as any as S.Schema<DeleteAppBundleResponse>;
export interface DeleteIngestionRequest {
  appBundleIdentifier: string;
  ingestionIdentifier: string;
}
export const DeleteIngestionRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIngestionRequest",
}) as any as S.Schema<DeleteIngestionRequest>;
export interface DeleteIngestionResponse {}
export const DeleteIngestionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIngestionResponse",
}) as any as S.Schema<DeleteIngestionResponse>;
export interface DeleteIngestionDestinationRequest {
  appBundleIdentifier: string;
  ingestionIdentifier: string;
  ingestionDestinationIdentifier: string;
}
export const DeleteIngestionDestinationRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    ingestionDestinationIdentifier: S.String.pipe(
      T.HttpLabel("ingestionDestinationIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/ingestiondestinations/{ingestionDestinationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIngestionDestinationRequest",
}) as any as S.Schema<DeleteIngestionDestinationRequest>;
export interface DeleteIngestionDestinationResponse {}
export const DeleteIngestionDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIngestionDestinationResponse",
}) as any as S.Schema<DeleteIngestionDestinationResponse>;
export interface GetAppAuthorizationRequest {
  appBundleIdentifier: string;
  appAuthorizationIdentifier: string;
}
export const GetAppAuthorizationRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    appAuthorizationIdentifier: S.String.pipe(
      T.HttpLabel("appAuthorizationIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/appbundles/{appBundleIdentifier}/appauthorizations/{appAuthorizationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAppAuthorizationRequest",
}) as any as S.Schema<GetAppAuthorizationRequest>;
export interface GetAppBundleRequest {
  appBundleIdentifier: string;
}
export const GetAppBundleRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/appbundles/{appBundleIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAppBundleRequest",
}) as any as S.Schema<GetAppBundleRequest>;
export interface GetIngestionRequest {
  appBundleIdentifier: string;
  ingestionIdentifier: string;
}
export const GetIngestionRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIngestionRequest",
}) as any as S.Schema<GetIngestionRequest>;
export interface GetIngestionDestinationRequest {
  appBundleIdentifier: string;
  ingestionIdentifier: string;
  ingestionDestinationIdentifier: string;
}
export const GetIngestionDestinationRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    ingestionDestinationIdentifier: S.String.pipe(
      T.HttpLabel("ingestionDestinationIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/ingestiondestinations/{ingestionDestinationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIngestionDestinationRequest",
}) as any as S.Schema<GetIngestionDestinationRequest>;
export interface ListAppAuthorizationsRequest {
  appBundleIdentifier: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAppAuthorizationsRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/appbundles/{appBundleIdentifier}/appauthorizations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppAuthorizationsRequest",
}) as any as S.Schema<ListAppAuthorizationsRequest>;
export interface ListAppBundlesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListAppBundlesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/appbundles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppBundlesRequest",
}) as any as S.Schema<ListAppBundlesRequest>;
export interface ListIngestionDestinationsRequest {
  appBundleIdentifier: string;
  ingestionIdentifier: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListIngestionDestinationsRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/ingestiondestinations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIngestionDestinationsRequest",
}) as any as S.Schema<ListIngestionDestinationsRequest>;
export interface ListIngestionsRequest {
  appBundleIdentifier: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListIngestionsRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/appbundles/{appBundleIdentifier}/ingestions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIngestionsRequest",
}) as any as S.Schema<ListIngestionsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface StartIngestionRequest {
  ingestionIdentifier: string;
  appBundleIdentifier: string;
}
export const StartIngestionRequest = S.suspend(() =>
  S.Struct({
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/start",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartIngestionRequest",
}) as any as S.Schema<StartIngestionRequest>;
export interface StartIngestionResponse {}
export const StartIngestionResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "StartIngestionResponse" },
) as any as S.Schema<StartIngestionResponse>;
export interface StartUserAccessTasksRequest {
  appBundleIdentifier: string;
  email: string | Redacted.Redacted<string>;
}
export const StartUserAccessTasksRequest = S.suspend(() =>
  S.Struct({ appBundleIdentifier: S.String, email: SensitiveString }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/useraccess/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartUserAccessTasksRequest",
}) as any as S.Schema<StartUserAccessTasksRequest>;
export interface StopIngestionRequest {
  ingestionIdentifier: string;
  appBundleIdentifier: string;
}
export const StopIngestionRequest = S.suspend(() =>
  S.Struct({
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/stop",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopIngestionRequest",
}) as any as S.Schema<StopIngestionRequest>;
export interface StopIngestionResponse {}
export const StopIngestionResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopIngestionResponse",
}) as any as S.Schema<StopIngestionResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface Oauth2Credential {
  clientId: string;
  clientSecret: string | Redacted.Redacted<string>;
}
export const Oauth2Credential = S.suspend(() =>
  S.Struct({ clientId: S.String, clientSecret: SensitiveString }),
).annotations({
  identifier: "Oauth2Credential",
}) as any as S.Schema<Oauth2Credential>;
export interface ApiKeyCredential {
  apiKey: string | Redacted.Redacted<string>;
}
export const ApiKeyCredential = S.suspend(() =>
  S.Struct({ apiKey: SensitiveString }),
).annotations({
  identifier: "ApiKeyCredential",
}) as any as S.Schema<ApiKeyCredential>;
export type Credential =
  | { oauth2Credential: Oauth2Credential }
  | { apiKeyCredential: ApiKeyCredential };
export const Credential = S.Union(
  S.Struct({ oauth2Credential: Oauth2Credential }),
  S.Struct({ apiKeyCredential: ApiKeyCredential }),
);
export interface Tenant {
  tenantIdentifier: string;
  tenantDisplayName: string;
}
export const Tenant = S.suspend(() =>
  S.Struct({ tenantIdentifier: S.String, tenantDisplayName: S.String }),
).annotations({ identifier: "Tenant" }) as any as S.Schema<Tenant>;
export interface UpdateAppAuthorizationRequest {
  appBundleIdentifier: string;
  appAuthorizationIdentifier: string;
  credential?: (typeof Credential)["Type"];
  tenant?: Tenant;
}
export const UpdateAppAuthorizationRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    appAuthorizationIdentifier: S.String.pipe(
      T.HttpLabel("appAuthorizationIdentifier"),
    ),
    credential: S.optional(Credential),
    tenant: S.optional(Tenant),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/appbundles/{appBundleIdentifier}/appauthorizations/{appAuthorizationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAppAuthorizationRequest",
}) as any as S.Schema<UpdateAppAuthorizationRequest>;
export interface S3Bucket {
  bucketName: string;
  prefix?: string;
}
export const S3Bucket = S.suspend(() =>
  S.Struct({ bucketName: S.String, prefix: S.optional(S.String) }),
).annotations({ identifier: "S3Bucket" }) as any as S.Schema<S3Bucket>;
export interface FirehoseStream {
  streamName: string;
}
export const FirehoseStream = S.suspend(() =>
  S.Struct({ streamName: S.String }),
).annotations({
  identifier: "FirehoseStream",
}) as any as S.Schema<FirehoseStream>;
export type Destination =
  | { s3Bucket: S3Bucket }
  | { firehoseStream: FirehoseStream };
export const Destination = S.Union(
  S.Struct({ s3Bucket: S3Bucket }),
  S.Struct({ firehoseStream: FirehoseStream }),
);
export interface AuditLogDestinationConfiguration {
  destination: (typeof Destination)["Type"];
}
export const AuditLogDestinationConfiguration = S.suspend(() =>
  S.Struct({ destination: Destination }),
).annotations({
  identifier: "AuditLogDestinationConfiguration",
}) as any as S.Schema<AuditLogDestinationConfiguration>;
export type DestinationConfiguration = {
  auditLog: AuditLogDestinationConfiguration;
};
export const DestinationConfiguration = S.Union(
  S.Struct({ auditLog: AuditLogDestinationConfiguration }),
);
export interface UpdateIngestionDestinationRequest {
  appBundleIdentifier: string;
  ingestionIdentifier: string;
  ingestionDestinationIdentifier: string;
  destinationConfiguration: (typeof DestinationConfiguration)["Type"];
}
export const UpdateIngestionDestinationRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    ingestionDestinationIdentifier: S.String.pipe(
      T.HttpLabel("ingestionDestinationIdentifier"),
    ),
    destinationConfiguration: DestinationConfiguration,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/ingestiondestinations/{ingestionDestinationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIngestionDestinationRequest",
}) as any as S.Schema<UpdateIngestionDestinationRequest>;
export interface AuthRequest {
  redirectUri: string;
  code: string | Redacted.Redacted<string>;
}
export const AuthRequest = S.suspend(() =>
  S.Struct({ redirectUri: S.String, code: SensitiveString }),
).annotations({ identifier: "AuthRequest" }) as any as S.Schema<AuthRequest>;
export interface ConnectAppAuthorizationRequest {
  appBundleIdentifier: string;
  appAuthorizationIdentifier: string;
  authRequest?: AuthRequest;
}
export const ConnectAppAuthorizationRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    appAuthorizationIdentifier: S.String.pipe(
      T.HttpLabel("appAuthorizationIdentifier"),
    ),
    authRequest: S.optional(AuthRequest),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/appbundles/{appBundleIdentifier}/appauthorizations/{appAuthorizationIdentifier}/connect",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ConnectAppAuthorizationRequest",
}) as any as S.Schema<ConnectAppAuthorizationRequest>;
export interface AppBundle {
  arn: string;
  customerManagedKeyArn?: string;
}
export const AppBundle = S.suspend(() =>
  S.Struct({ arn: S.String, customerManagedKeyArn: S.optional(S.String) }),
).annotations({ identifier: "AppBundle" }) as any as S.Schema<AppBundle>;
export interface GetAppBundleResponse {
  appBundle: AppBundle;
}
export const GetAppBundleResponse = S.suspend(() =>
  S.Struct({ appBundle: AppBundle }),
).annotations({
  identifier: "GetAppBundleResponse",
}) as any as S.Schema<GetAppBundleResponse>;
export interface Ingestion {
  arn: string;
  appBundleArn: string;
  app: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  state: string;
  ingestionType: string;
}
export const Ingestion = S.suspend(() =>
  S.Struct({
    arn: S.String,
    appBundleArn: S.String,
    app: S.String,
    tenantId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    state: S.String,
    ingestionType: S.String,
  }),
).annotations({ identifier: "Ingestion" }) as any as S.Schema<Ingestion>;
export interface GetIngestionResponse {
  ingestion: Ingestion;
}
export const GetIngestionResponse = S.suspend(() =>
  S.Struct({ ingestion: Ingestion }),
).annotations({
  identifier: "GetIngestionResponse",
}) as any as S.Schema<GetIngestionResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface AppAuthorization {
  appAuthorizationArn: string;
  appBundleArn: string;
  app: string;
  tenant: Tenant;
  authType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  persona?: string;
  authUrl?: string;
}
export const AppAuthorization = S.suspend(() =>
  S.Struct({
    appAuthorizationArn: S.String,
    appBundleArn: S.String,
    app: S.String,
    tenant: Tenant,
    authType: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    persona: S.optional(S.String),
    authUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "AppAuthorization",
}) as any as S.Schema<AppAuthorization>;
export interface UpdateAppAuthorizationResponse {
  appAuthorization: AppAuthorization;
}
export const UpdateAppAuthorizationResponse = S.suspend(() =>
  S.Struct({ appAuthorization: AppAuthorization }),
).annotations({
  identifier: "UpdateAppAuthorizationResponse",
}) as any as S.Schema<UpdateAppAuthorizationResponse>;
export interface AuditLogProcessingConfiguration {
  schema: string;
  format: string;
}
export const AuditLogProcessingConfiguration = S.suspend(() =>
  S.Struct({ schema: S.String, format: S.String }),
).annotations({
  identifier: "AuditLogProcessingConfiguration",
}) as any as S.Schema<AuditLogProcessingConfiguration>;
export type ProcessingConfiguration = {
  auditLog: AuditLogProcessingConfiguration;
};
export const ProcessingConfiguration = S.Union(
  S.Struct({ auditLog: AuditLogProcessingConfiguration }),
);
export interface IngestionDestination {
  arn: string;
  ingestionArn: string;
  processingConfiguration: (typeof ProcessingConfiguration)["Type"];
  destinationConfiguration: (typeof DestinationConfiguration)["Type"];
  status?: string;
  statusReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const IngestionDestination = S.suspend(() =>
  S.Struct({
    arn: S.String,
    ingestionArn: S.String,
    processingConfiguration: ProcessingConfiguration,
    destinationConfiguration: DestinationConfiguration,
    status: S.optional(S.String),
    statusReason: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "IngestionDestination",
}) as any as S.Schema<IngestionDestination>;
export interface UpdateIngestionDestinationResponse {
  ingestionDestination: IngestionDestination;
}
export const UpdateIngestionDestinationResponse = S.suspend(() =>
  S.Struct({ ingestionDestination: IngestionDestination }),
).annotations({
  identifier: "UpdateIngestionDestinationResponse",
}) as any as S.Schema<UpdateIngestionDestinationResponse>;
export interface AppAuthorizationSummary {
  appAuthorizationArn: string;
  appBundleArn: string;
  app: string;
  tenant: Tenant;
  status: string;
  updatedAt: Date;
}
export const AppAuthorizationSummary = S.suspend(() =>
  S.Struct({
    appAuthorizationArn: S.String,
    appBundleArn: S.String,
    app: S.String,
    tenant: Tenant,
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "AppAuthorizationSummary",
}) as any as S.Schema<AppAuthorizationSummary>;
export type AppAuthorizationSummaryList = AppAuthorizationSummary[];
export const AppAuthorizationSummaryList = S.Array(AppAuthorizationSummary);
export interface AppBundleSummary {
  arn: string;
}
export const AppBundleSummary = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "AppBundleSummary",
}) as any as S.Schema<AppBundleSummary>;
export type AppBundleSummaryList = AppBundleSummary[];
export const AppBundleSummaryList = S.Array(AppBundleSummary);
export interface IngestionDestinationSummary {
  arn: string;
}
export const IngestionDestinationSummary = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "IngestionDestinationSummary",
}) as any as S.Schema<IngestionDestinationSummary>;
export type IngestionDestinationList = IngestionDestinationSummary[];
export const IngestionDestinationList = S.Array(IngestionDestinationSummary);
export interface IngestionSummary {
  arn: string;
  app: string;
  tenantId: string;
  state: string;
}
export const IngestionSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    app: S.String,
    tenantId: S.String,
    state: S.String,
  }),
).annotations({
  identifier: "IngestionSummary",
}) as any as S.Schema<IngestionSummary>;
export type IngestionList = IngestionSummary[];
export const IngestionList = S.Array(IngestionSummary);
export interface TaskError {
  errorCode?: string;
  errorMessage?: string;
}
export const TaskError = S.suspend(() =>
  S.Struct({
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "TaskError" }) as any as S.Schema<TaskError>;
export interface UserAccessTaskItem {
  app: string;
  tenantId: string;
  taskId?: string;
  error?: TaskError;
}
export const UserAccessTaskItem = S.suspend(() =>
  S.Struct({
    app: S.String,
    tenantId: S.String,
    taskId: S.optional(S.String),
    error: S.optional(TaskError),
  }),
).annotations({
  identifier: "UserAccessTaskItem",
}) as any as S.Schema<UserAccessTaskItem>;
export type UserAccessTasksList = UserAccessTaskItem[];
export const UserAccessTasksList = S.Array(UserAccessTaskItem);
export interface ConnectAppAuthorizationResponse {
  appAuthorizationSummary: AppAuthorizationSummary;
}
export const ConnectAppAuthorizationResponse = S.suspend(() =>
  S.Struct({ appAuthorizationSummary: AppAuthorizationSummary }),
).annotations({
  identifier: "ConnectAppAuthorizationResponse",
}) as any as S.Schema<ConnectAppAuthorizationResponse>;
export interface CreateAppAuthorizationRequest {
  appBundleIdentifier: string;
  app: string;
  credential: (typeof Credential)["Type"];
  tenant: Tenant;
  authType: string;
  clientToken?: string;
  tags?: TagList;
}
export const CreateAppAuthorizationRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    app: S.String,
    credential: Credential,
    tenant: Tenant,
    authType: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/appbundles/{appBundleIdentifier}/appauthorizations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppAuthorizationRequest",
}) as any as S.Schema<CreateAppAuthorizationRequest>;
export interface CreateAppBundleResponse {
  appBundle: AppBundle;
}
export const CreateAppBundleResponse = S.suspend(() =>
  S.Struct({ appBundle: AppBundle }),
).annotations({
  identifier: "CreateAppBundleResponse",
}) as any as S.Schema<CreateAppBundleResponse>;
export interface CreateIngestionResponse {
  ingestion: Ingestion;
}
export const CreateIngestionResponse = S.suspend(() =>
  S.Struct({ ingestion: Ingestion }),
).annotations({
  identifier: "CreateIngestionResponse",
}) as any as S.Schema<CreateIngestionResponse>;
export interface GetAppAuthorizationResponse {
  appAuthorization: AppAuthorization;
}
export const GetAppAuthorizationResponse = S.suspend(() =>
  S.Struct({ appAuthorization: AppAuthorization }),
).annotations({
  identifier: "GetAppAuthorizationResponse",
}) as any as S.Schema<GetAppAuthorizationResponse>;
export interface GetIngestionDestinationResponse {
  ingestionDestination: IngestionDestination;
}
export const GetIngestionDestinationResponse = S.suspend(() =>
  S.Struct({ ingestionDestination: IngestionDestination }),
).annotations({
  identifier: "GetIngestionDestinationResponse",
}) as any as S.Schema<GetIngestionDestinationResponse>;
export interface ListAppAuthorizationsResponse {
  appAuthorizationSummaryList: AppAuthorizationSummaryList;
  nextToken?: string;
}
export const ListAppAuthorizationsResponse = S.suspend(() =>
  S.Struct({
    appAuthorizationSummaryList: AppAuthorizationSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAppAuthorizationsResponse",
}) as any as S.Schema<ListAppAuthorizationsResponse>;
export interface ListAppBundlesResponse {
  appBundleSummaryList: AppBundleSummaryList;
  nextToken?: string;
}
export const ListAppBundlesResponse = S.suspend(() =>
  S.Struct({
    appBundleSummaryList: AppBundleSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAppBundlesResponse",
}) as any as S.Schema<ListAppBundlesResponse>;
export interface ListIngestionDestinationsResponse {
  ingestionDestinations: IngestionDestinationList;
  nextToken?: string;
}
export const ListIngestionDestinationsResponse = S.suspend(() =>
  S.Struct({
    ingestionDestinations: IngestionDestinationList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIngestionDestinationsResponse",
}) as any as S.Schema<ListIngestionDestinationsResponse>;
export interface ListIngestionsResponse {
  ingestions: IngestionList;
  nextToken?: string;
}
export const ListIngestionsResponse = S.suspend(() =>
  S.Struct({ ingestions: IngestionList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListIngestionsResponse",
}) as any as S.Schema<ListIngestionsResponse>;
export interface StartUserAccessTasksResponse {
  userAccessTasksList?: UserAccessTasksList;
}
export const StartUserAccessTasksResponse = S.suspend(() =>
  S.Struct({ userAccessTasksList: S.optional(UserAccessTasksList) }),
).annotations({
  identifier: "StartUserAccessTasksResponse",
}) as any as S.Schema<StartUserAccessTasksResponse>;
export interface UserAccessResultItem {
  app?: string;
  tenantId?: string;
  tenantDisplayName?: string;
  taskId?: string;
  resultStatus?: string;
  email?: string | Redacted.Redacted<string>;
  userId?: string | Redacted.Redacted<string>;
  userFullName?: string | Redacted.Redacted<string>;
  userFirstName?: string | Redacted.Redacted<string>;
  userLastName?: string | Redacted.Redacted<string>;
  userStatus?: string;
  taskError?: TaskError;
}
export const UserAccessResultItem = S.suspend(() =>
  S.Struct({
    app: S.optional(S.String),
    tenantId: S.optional(S.String),
    tenantDisplayName: S.optional(S.String),
    taskId: S.optional(S.String),
    resultStatus: S.optional(S.String),
    email: S.optional(SensitiveString),
    userId: S.optional(SensitiveString),
    userFullName: S.optional(SensitiveString),
    userFirstName: S.optional(SensitiveString),
    userLastName: S.optional(SensitiveString),
    userStatus: S.optional(S.String),
    taskError: S.optional(TaskError),
  }),
).annotations({
  identifier: "UserAccessResultItem",
}) as any as S.Schema<UserAccessResultItem>;
export type UserAccessResultsList = UserAccessResultItem[];
export const UserAccessResultsList = S.Array(UserAccessResultItem);
export interface BatchGetUserAccessTasksResponse {
  userAccessResultsList?: UserAccessResultsList;
}
export const BatchGetUserAccessTasksResponse = S.suspend(() =>
  S.Struct({ userAccessResultsList: S.optional(UserAccessResultsList) }),
).annotations({
  identifier: "BatchGetUserAccessTasksResponse",
}) as any as S.Schema<BatchGetUserAccessTasksResponse>;
export interface CreateAppAuthorizationResponse {
  appAuthorization: AppAuthorization;
}
export const CreateAppAuthorizationResponse = S.suspend(() =>
  S.Struct({ appAuthorization: AppAuthorization }),
).annotations({
  identifier: "CreateAppAuthorizationResponse",
}) as any as S.Schema<CreateAppAuthorizationResponse>;
export interface CreateIngestionDestinationRequest {
  appBundleIdentifier: string;
  ingestionIdentifier: string;
  processingConfiguration: (typeof ProcessingConfiguration)["Type"];
  destinationConfiguration: (typeof DestinationConfiguration)["Type"];
  clientToken?: string;
  tags?: TagList;
}
export const CreateIngestionDestinationRequest = S.suspend(() =>
  S.Struct({
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    processingConfiguration: ProcessingConfiguration,
    destinationConfiguration: DestinationConfiguration,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/ingestiondestinations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIngestionDestinationRequest",
}) as any as S.Schema<CreateIngestionDestinationRequest>;
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
export interface CreateIngestionDestinationResponse {
  ingestionDestination: IngestionDestination;
}
export const CreateIngestionDestinationResponse = S.suspend(() =>
  S.Struct({ ingestionDestination: IngestionDestination }),
).annotations({
  identifier: "CreateIngestionDestinationResponse",
}) as any as S.Schema<CreateIngestionDestinationResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of app bundles.
 */
export const listAppBundles: {
  (
    input: ListAppBundlesRequest,
  ): Effect.Effect<
    ListAppBundlesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppBundlesRequest,
  ) => Stream.Stream<
    ListAppBundlesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppBundlesRequest,
  ) => Stream.Stream<
    AppBundleSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppBundlesRequest,
  output: ListAppBundlesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "appBundleSummaryList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about an app authorization.
 */
export const getAppAuthorization: (
  input: GetAppAuthorizationRequest,
) => Effect.Effect<
  GetAppAuthorizationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppAuthorizationRequest,
  output: GetAppAuthorizationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about an ingestion destination.
 */
export const getIngestionDestination: (
  input: GetIngestionDestinationRequest,
) => Effect.Effect<
  GetIngestionDestinationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIngestionDestinationRequest,
  output: GetIngestionDestinationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all app authorizations configured for an app bundle.
 */
export const listAppAuthorizations: {
  (
    input: ListAppAuthorizationsRequest,
  ): Effect.Effect<
    ListAppAuthorizationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppAuthorizationsRequest,
  ) => Stream.Stream<
    ListAppAuthorizationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppAuthorizationsRequest,
  ) => Stream.Stream<
    AppAuthorizationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppAuthorizationsRequest,
  output: ListAppAuthorizationsResponse,
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
    items: "appAuthorizationSummaryList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all ingestion destinations configured for an ingestion.
 */
export const listIngestionDestinations: {
  (
    input: ListIngestionDestinationsRequest,
  ): Effect.Effect<
    ListIngestionDestinationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIngestionDestinationsRequest,
  ) => Stream.Stream<
    ListIngestionDestinationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIngestionDestinationsRequest,
  ) => Stream.Stream<
    IngestionDestinationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIngestionDestinationsRequest,
  output: ListIngestionDestinationsResponse,
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
    items: "ingestionDestinations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all ingestions configured for an app bundle.
 */
export const listIngestions: {
  (
    input: ListIngestionsRequest,
  ): Effect.Effect<
    ListIngestionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIngestionsRequest,
  ) => Stream.Stream<
    ListIngestionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIngestionsRequest,
  ) => Stream.Stream<
    IngestionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIngestionsRequest,
  output: ListIngestionsResponse,
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
    items: "ingestions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts the tasks to search user access status for a specific email address.
 *
 * The tasks are stopped when the user access status data is found. The tasks are
 * terminated when the API calls to the application time out.
 */
export const startUserAccessTasks: (
  input: StartUserAccessTasksRequest,
) => Effect.Effect<
  StartUserAccessTasksResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartUserAccessTasksRequest,
  output: StartUserAccessTasksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about an app bundle.
 */
export const getAppBundle: (
  input: GetAppBundleRequest,
) => Effect.Effect<
  GetAppBundleResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppBundleRequest,
  output: GetAppBundleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about an ingestion.
 */
export const getIngestion: (
  input: GetIngestionRequest,
) => Effect.Effect<
  GetIngestionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIngestionRequest,
  output: GetIngestionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tags for a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
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
 * Updates an app authorization within an app bundle, which allows AppFabric to connect to an
 * application.
 *
 * If the app authorization was in a `connected` state, updating the app
 * authorization will set it back to a `PendingConnect` state.
 */
export const updateAppAuthorization: (
  input: UpdateAppAuthorizationRequest,
) => Effect.Effect<
  UpdateAppAuthorizationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppAuthorizationRequest,
  output: UpdateAppAuthorizationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an ingestion. You must stop (disable) the ingestion and you must delete all
 * associated ingestion destinations before you can delete an app ingestion.
 */
export const deleteIngestion: (
  input: DeleteIngestionRequest,
) => Effect.Effect<
  DeleteIngestionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIngestionRequest,
  output: DeleteIngestionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an ingestion destination.
 *
 * This deletes the association between an ingestion and it's destination. It doesn't
 * delete previously ingested data or the storage destination, such as the Amazon S3
 * bucket where the data is delivered. If the ingestion destination is deleted while the
 * associated ingestion is enabled, the ingestion will fail and is eventually disabled.
 */
export const deleteIngestionDestination: (
  input: DeleteIngestionDestinationRequest,
) => Effect.Effect<
  DeleteIngestionDestinationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIngestionDestinationRequest,
  output: DeleteIngestionDestinationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
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
    ValidationException,
  ],
}));
/**
 * Removes a tag or tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
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
 * Establishes a connection between Amazon Web Services AppFabric and an application, which allows AppFabric to
 * call the APIs of the application.
 */
export const connectAppAuthorization: (
  input: ConnectAppAuthorizationRequest,
) => Effect.Effect<
  ConnectAppAuthorizationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConnectAppAuthorizationRequest,
  output: ConnectAppAuthorizationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts (enables) an ingestion, which collects data from an application.
 */
export const startIngestion: (
  input: StartIngestionRequest,
) => Effect.Effect<
  StartIngestionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartIngestionRequest,
  output: StartIngestionResponse,
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
 * Stops (disables) an ingestion.
 */
export const stopIngestion: (
  input: StopIngestionRequest,
) => Effect.Effect<
  StopIngestionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopIngestionRequest,
  output: StopIngestionResponse,
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
 * Gets user access details in a batch request.
 *
 * This action polls data from the tasks that are kicked off by the
 * `StartUserAccessTasks` action.
 */
export const batchGetUserAccessTasks: (
  input: BatchGetUserAccessTasksRequest,
) => Effect.Effect<
  BatchGetUserAccessTasksResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetUserAccessTasksRequest,
  output: BatchGetUserAccessTasksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an app bundle. You must delete all associated app authorizations before you can
 * delete an app bundle.
 */
export const deleteAppBundle: (
  input: DeleteAppBundleRequest,
) => Effect.Effect<
  DeleteAppBundleResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppBundleRequest,
  output: DeleteAppBundleResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an app authorization. You must delete the associated ingestion before you can
 * delete an app authorization.
 */
export const deleteAppAuthorization: (
  input: DeleteAppAuthorizationRequest,
) => Effect.Effect<
  DeleteAppAuthorizationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppAuthorizationRequest,
  output: DeleteAppAuthorizationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an app bundle to collect data from an application using AppFabric.
 */
export const createAppBundle: (
  input: CreateAppBundleRequest,
) => Effect.Effect<
  CreateAppBundleResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppBundleRequest,
  output: CreateAppBundleResponse,
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
 * Creates a data ingestion for an application.
 */
export const createIngestion: (
  input: CreateIngestionRequest,
) => Effect.Effect<
  CreateIngestionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIngestionRequest,
  output: CreateIngestionResponse,
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
 * Updates an ingestion destination, which specifies how an application's ingested data is
 * processed by Amazon Web Services AppFabric and where it's delivered.
 */
export const updateIngestionDestination: (
  input: UpdateIngestionDestinationRequest,
) => Effect.Effect<
  UpdateIngestionDestinationResponse,
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
  input: UpdateIngestionDestinationRequest,
  output: UpdateIngestionDestinationResponse,
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
 * Creates an app authorization within an app bundle, which allows AppFabric to connect to an
 * application.
 */
export const createAppAuthorization: (
  input: CreateAppAuthorizationRequest,
) => Effect.Effect<
  CreateAppAuthorizationResponse,
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
  input: CreateAppAuthorizationRequest,
  output: CreateAppAuthorizationResponse,
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
 * Creates an ingestion destination, which specifies how an application's ingested data is
 * processed by Amazon Web Services AppFabric and where it's delivered.
 */
export const createIngestionDestination: (
  input: CreateIngestionDestinationRequest,
) => Effect.Effect<
  CreateIngestionDestinationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIngestionDestinationRequest,
  output: CreateIngestionDestinationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

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
  sdkId: "AppIntegrations",
  serviceShapeName: "AmazonAppIntegrationService",
});
const auth = T.AwsAuthSigv4({ name: "app-integrations" });
const ver = T.ServiceVersion("2020-07-29");
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
              `https://app-integrations-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://app-integrations-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://app-integrations.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://app-integrations.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ApplicationName = string;
export type ApplicationNamespace = string;
export type Description = string;
export type IdempotencyToken = string;
export type Permission = string;
export type InitializationTimeout = number;
export type Name = string;
export type NonBlankString = string;
export type SourceURI = string;
export type Identifier = string;
export type ClientId = string;
export type DestinationURI = string;
export type EventBridgeBus = string;
export type ArnOrUUID = string;
export type NextToken = string;
export type MaxResults = number;
export type Arn = string;
export type TagKey = string;
export type EventName = string;
export type EventDefinitionSchema = string;
export type TagValue = string;
export type IframePermission = string;
export type NonBlankLongString = string;
export type Source = string;
export type Message = string;
export type UUID = string;
export type URL = string;
export type ApplicationTrustedSource = string;
export type Fields = string;
export type EventBridgeRuleName = string;

//# Schemas
export type PermissionList = string[];
export const PermissionList = S.Array(S.String);
export type ApplicationType = "STANDARD" | "SERVICE" | "MCP_SERVER";
export const ApplicationType = S.Literal("STANDARD", "SERVICE", "MCP_SERVER");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteApplicationRequest {
  Arn: string;
}
export const DeleteApplicationRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/applications/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApplicationRequest",
}) as any as S.Schema<DeleteApplicationRequest>;
export interface DeleteApplicationResponse {}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface DeleteDataIntegrationRequest {
  DataIntegrationIdentifier: string;
}
export const DeleteDataIntegrationRequest = S.suspend(() =>
  S.Struct({
    DataIntegrationIdentifier: S.String.pipe(
      T.HttpLabel("DataIntegrationIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/dataIntegrations/{DataIntegrationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataIntegrationRequest",
}) as any as S.Schema<DeleteDataIntegrationRequest>;
export interface DeleteDataIntegrationResponse {}
export const DeleteDataIntegrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDataIntegrationResponse",
}) as any as S.Schema<DeleteDataIntegrationResponse>;
export interface DeleteEventIntegrationRequest {
  Name: string;
}
export const DeleteEventIntegrationRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/eventIntegrations/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventIntegrationRequest",
}) as any as S.Schema<DeleteEventIntegrationRequest>;
export interface DeleteEventIntegrationResponse {}
export const DeleteEventIntegrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEventIntegrationResponse",
}) as any as S.Schema<DeleteEventIntegrationResponse>;
export interface GetApplicationRequest {
  Arn: string;
}
export const GetApplicationRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApplicationRequest",
}) as any as S.Schema<GetApplicationRequest>;
export interface GetDataIntegrationRequest {
  Identifier: string;
}
export const GetDataIntegrationRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/dataIntegrations/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataIntegrationRequest",
}) as any as S.Schema<GetDataIntegrationRequest>;
export interface GetEventIntegrationRequest {
  Name: string;
}
export const GetEventIntegrationRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/eventIntegrations/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventIntegrationRequest",
}) as any as S.Schema<GetEventIntegrationRequest>;
export interface ListApplicationAssociationsRequest {
  ApplicationId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListApplicationAssociationsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{ApplicationId}/associations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationAssociationsRequest",
}) as any as S.Schema<ListApplicationAssociationsRequest>;
export interface ListApplicationsRequest {
  NextToken?: string;
  MaxResults?: number;
  ApplicationType?: ApplicationType;
}
export const ListApplicationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ApplicationType: S.optional(ApplicationType).pipe(
      T.HttpQuery("applicationType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationsRequest",
}) as any as S.Schema<ListApplicationsRequest>;
export interface ListDataIntegrationAssociationsRequest {
  DataIntegrationIdentifier: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDataIntegrationAssociationsRequest = S.suspend(() =>
  S.Struct({
    DataIntegrationIdentifier: S.String.pipe(
      T.HttpLabel("DataIntegrationIdentifier"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/dataIntegrations/{DataIntegrationIdentifier}/associations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataIntegrationAssociationsRequest",
}) as any as S.Schema<ListDataIntegrationAssociationsRequest>;
export interface ListDataIntegrationsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListDataIntegrationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/dataIntegrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataIntegrationsRequest",
}) as any as S.Schema<ListDataIntegrationsRequest>;
export interface ListEventIntegrationAssociationsRequest {
  EventIntegrationName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListEventIntegrationAssociationsRequest = S.suspend(() =>
  S.Struct({
    EventIntegrationName: S.String.pipe(T.HttpLabel("EventIntegrationName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/eventIntegrations/{EventIntegrationName}/associations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventIntegrationAssociationsRequest",
}) as any as S.Schema<ListEventIntegrationAssociationsRequest>;
export interface ListEventIntegrationsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListEventIntegrationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/eventIntegrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventIntegrationsRequest",
}) as any as S.Schema<ListEventIntegrationsRequest>;
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
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
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
  tagKeys: string[];
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
export type ApplicationApprovedOrigins = string[];
export const ApplicationApprovedOrigins = S.Array(S.String);
export interface ExternalUrlConfig {
  AccessUrl: string;
  ApprovedOrigins?: string[];
}
export const ExternalUrlConfig = S.suspend(() =>
  S.Struct({
    AccessUrl: S.String,
    ApprovedOrigins: S.optional(ApplicationApprovedOrigins),
  }),
).annotations({
  identifier: "ExternalUrlConfig",
}) as any as S.Schema<ExternalUrlConfig>;
export interface ApplicationSourceConfig {
  ExternalUrlConfig?: ExternalUrlConfig;
}
export const ApplicationSourceConfig = S.suspend(() =>
  S.Struct({ ExternalUrlConfig: S.optional(ExternalUrlConfig) }),
).annotations({
  identifier: "ApplicationSourceConfig",
}) as any as S.Schema<ApplicationSourceConfig>;
export interface Subscription {
  Event: string;
  Description?: string;
}
export const Subscription = S.suspend(() =>
  S.Struct({ Event: S.String, Description: S.optional(S.String) }),
).annotations({ identifier: "Subscription" }) as any as S.Schema<Subscription>;
export type SubscriptionList = Subscription[];
export const SubscriptionList = S.Array(Subscription);
export interface Publication {
  Event: string;
  Schema: string;
  Description?: string;
}
export const Publication = S.suspend(() =>
  S.Struct({
    Event: S.String,
    Schema: S.String,
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "Publication" }) as any as S.Schema<Publication>;
export type PublicationList = Publication[];
export const PublicationList = S.Array(Publication);
export type ContactHandlingScope = "CROSS_CONTACTS" | "PER_CONTACT";
export const ContactHandlingScope = S.Literal("CROSS_CONTACTS", "PER_CONTACT");
export interface ContactHandling {
  Scope?: ContactHandlingScope;
}
export const ContactHandling = S.suspend(() =>
  S.Struct({ Scope: S.optional(ContactHandlingScope) }),
).annotations({
  identifier: "ContactHandling",
}) as any as S.Schema<ContactHandling>;
export interface ApplicationConfig {
  ContactHandling?: ContactHandling;
}
export const ApplicationConfig = S.suspend(() =>
  S.Struct({ ContactHandling: S.optional(ContactHandling) }),
).annotations({
  identifier: "ApplicationConfig",
}) as any as S.Schema<ApplicationConfig>;
export type IframePermissionList = string[];
export const IframePermissionList = S.Array(S.String);
export interface IframeConfig {
  Allow?: string[];
  Sandbox?: string[];
}
export const IframeConfig = S.suspend(() =>
  S.Struct({
    Allow: S.optional(IframePermissionList),
    Sandbox: S.optional(IframePermissionList),
  }),
).annotations({ identifier: "IframeConfig" }) as any as S.Schema<IframeConfig>;
export interface UpdateApplicationRequest {
  Arn: string;
  Name?: string;
  Description?: string;
  ApplicationSourceConfig?: ApplicationSourceConfig;
  Subscriptions?: Subscription[];
  Publications?: Publication[];
  Permissions?: string[];
  IsService?: boolean;
  InitializationTimeout?: number;
  ApplicationConfig?: ApplicationConfig;
  IframeConfig?: IframeConfig;
  ApplicationType?: ApplicationType;
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ApplicationSourceConfig: S.optional(ApplicationSourceConfig),
    Subscriptions: S.optional(SubscriptionList),
    Publications: S.optional(PublicationList),
    Permissions: S.optional(PermissionList),
    IsService: S.optional(S.Boolean),
    InitializationTimeout: S.optional(S.Number),
    ApplicationConfig: S.optional(ApplicationConfig),
    IframeConfig: S.optional(IframeConfig),
    ApplicationType: S.optional(ApplicationType),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/applications/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationRequest",
}) as any as S.Schema<UpdateApplicationRequest>;
export interface UpdateApplicationResponse {}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;
export interface UpdateDataIntegrationRequest {
  Identifier: string;
  Name?: string;
  Description?: string;
}
export const UpdateDataIntegrationRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/dataIntegrations/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataIntegrationRequest",
}) as any as S.Schema<UpdateDataIntegrationRequest>;
export interface UpdateDataIntegrationResponse {}
export const UpdateDataIntegrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDataIntegrationResponse",
}) as any as S.Schema<UpdateDataIntegrationResponse>;
export type ExecutionMode = "ON_DEMAND" | "SCHEDULED";
export const ExecutionMode = S.Literal("ON_DEMAND", "SCHEDULED");
export interface OnDemandConfiguration {
  StartTime: string;
  EndTime?: string;
}
export const OnDemandConfiguration = S.suspend(() =>
  S.Struct({ StartTime: S.String, EndTime: S.optional(S.String) }),
).annotations({
  identifier: "OnDemandConfiguration",
}) as any as S.Schema<OnDemandConfiguration>;
export interface ScheduleConfiguration {
  FirstExecutionFrom?: string;
  Object?: string;
  ScheduleExpression: string;
}
export const ScheduleConfiguration = S.suspend(() =>
  S.Struct({
    FirstExecutionFrom: S.optional(S.String),
    Object: S.optional(S.String),
    ScheduleExpression: S.String,
  }),
).annotations({
  identifier: "ScheduleConfiguration",
}) as any as S.Schema<ScheduleConfiguration>;
export interface ExecutionConfiguration {
  ExecutionMode: ExecutionMode;
  OnDemandConfiguration?: OnDemandConfiguration;
  ScheduleConfiguration?: ScheduleConfiguration;
}
export const ExecutionConfiguration = S.suspend(() =>
  S.Struct({
    ExecutionMode: ExecutionMode,
    OnDemandConfiguration: S.optional(OnDemandConfiguration),
    ScheduleConfiguration: S.optional(ScheduleConfiguration),
  }),
).annotations({
  identifier: "ExecutionConfiguration",
}) as any as S.Schema<ExecutionConfiguration>;
export interface UpdateDataIntegrationAssociationRequest {
  DataIntegrationIdentifier: string;
  DataIntegrationAssociationIdentifier: string;
  ExecutionConfiguration: ExecutionConfiguration;
}
export const UpdateDataIntegrationAssociationRequest = S.suspend(() =>
  S.Struct({
    DataIntegrationIdentifier: S.String.pipe(
      T.HttpLabel("DataIntegrationIdentifier"),
    ),
    DataIntegrationAssociationIdentifier: S.String.pipe(
      T.HttpLabel("DataIntegrationAssociationIdentifier"),
    ),
    ExecutionConfiguration: ExecutionConfiguration,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/dataIntegrations/{DataIntegrationIdentifier}/associations/{DataIntegrationAssociationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataIntegrationAssociationRequest",
}) as any as S.Schema<UpdateDataIntegrationAssociationRequest>;
export interface UpdateDataIntegrationAssociationResponse {}
export const UpdateDataIntegrationAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDataIntegrationAssociationResponse",
}) as any as S.Schema<UpdateDataIntegrationAssociationResponse>;
export interface UpdateEventIntegrationRequest {
  Name: string;
  Description?: string;
}
export const UpdateEventIntegrationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/eventIntegrations/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEventIntegrationRequest",
}) as any as S.Schema<UpdateEventIntegrationRequest>;
export interface UpdateEventIntegrationResponse {}
export const UpdateEventIntegrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateEventIntegrationResponse",
}) as any as S.Schema<UpdateEventIntegrationResponse>;
export type FolderList = string[];
export const FolderList = S.Array(S.String);
export type FieldsList = string[];
export const FieldsList = S.Array(S.String);
export type FieldsMap = { [key: string]: string[] };
export const FieldsMap = S.Record({ key: S.String, value: FieldsList });
export type ObjectConfiguration = {
  [key: string]: { [key: string]: string[] };
};
export const ObjectConfiguration = S.Record({
  key: S.String,
  value: FieldsMap,
});
export type ClientAssociationMetadata = { [key: string]: string };
export const ClientAssociationMetadata = S.Record({
  key: S.String,
  value: S.String,
});
export interface EventFilter {
  Source: string;
}
export const EventFilter = S.suspend(() =>
  S.Struct({ Source: S.String }),
).annotations({ identifier: "EventFilter" }) as any as S.Schema<EventFilter>;
export interface CreateEventIntegrationRequest {
  Name: string;
  Description?: string;
  EventFilter: EventFilter;
  EventBridgeBus: string;
  ClientToken?: string;
  Tags?: { [key: string]: string };
}
export const CreateEventIntegrationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    EventFilter: EventFilter,
    EventBridgeBus: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/eventIntegrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEventIntegrationRequest",
}) as any as S.Schema<CreateEventIntegrationRequest>;
export interface GetApplicationResponse {
  Arn?: string;
  Id?: string;
  Name?: string;
  Namespace?: string;
  Description?: string;
  ApplicationSourceConfig?: ApplicationSourceConfig;
  Subscriptions?: Subscription[];
  Publications?: Publication[];
  CreatedTime?: Date;
  LastModifiedTime?: Date;
  Tags?: { [key: string]: string };
  Permissions?: string[];
  IsService?: boolean;
  InitializationTimeout?: number;
  ApplicationConfig?: ApplicationConfig;
  IframeConfig?: IframeConfig;
  ApplicationType?: ApplicationType;
}
export const GetApplicationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Namespace: S.optional(S.String),
    Description: S.optional(S.String),
    ApplicationSourceConfig: S.optional(ApplicationSourceConfig),
    Subscriptions: S.optional(SubscriptionList),
    Publications: S.optional(PublicationList),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Tags: S.optional(TagMap),
    Permissions: S.optional(PermissionList),
    IsService: S.optional(S.Boolean),
    InitializationTimeout: S.optional(S.Number),
    ApplicationConfig: S.optional(ApplicationConfig),
    IframeConfig: S.optional(IframeConfig),
    ApplicationType: S.optional(ApplicationType),
  }),
).annotations({
  identifier: "GetApplicationResponse",
}) as any as S.Schema<GetApplicationResponse>;
export interface FileConfiguration {
  Folders: string[];
  Filters?: { [key: string]: string[] };
}
export const FileConfiguration = S.suspend(() =>
  S.Struct({ Folders: FolderList, Filters: S.optional(FieldsMap) }),
).annotations({
  identifier: "FileConfiguration",
}) as any as S.Schema<FileConfiguration>;
export interface GetDataIntegrationResponse {
  Arn?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  KmsKey?: string;
  SourceURI?: string;
  ScheduleConfiguration?: ScheduleConfiguration;
  Tags?: { [key: string]: string };
  FileConfiguration?: FileConfiguration;
  ObjectConfiguration?: { [key: string]: { [key: string]: string[] } };
}
export const GetDataIntegrationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    KmsKey: S.optional(S.String),
    SourceURI: S.optional(S.String),
    ScheduleConfiguration: S.optional(ScheduleConfiguration),
    Tags: S.optional(TagMap),
    FileConfiguration: S.optional(FileConfiguration),
    ObjectConfiguration: S.optional(ObjectConfiguration),
  }),
).annotations({
  identifier: "GetDataIntegrationResponse",
}) as any as S.Schema<GetDataIntegrationResponse>;
export interface GetEventIntegrationResponse {
  Name?: string;
  Description?: string;
  EventIntegrationArn?: string;
  EventBridgeBus?: string;
  EventFilter?: EventFilter;
  Tags?: { [key: string]: string };
}
export const GetEventIntegrationResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    EventIntegrationArn: S.optional(S.String),
    EventBridgeBus: S.optional(S.String),
    EventFilter: S.optional(EventFilter),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetEventIntegrationResponse",
}) as any as S.Schema<GetEventIntegrationResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ApplicationAssociationSummary {
  ApplicationAssociationArn?: string;
  ApplicationArn?: string;
  ClientId?: string;
}
export const ApplicationAssociationSummary = S.suspend(() =>
  S.Struct({
    ApplicationAssociationArn: S.optional(S.String),
    ApplicationArn: S.optional(S.String),
    ClientId: S.optional(S.String),
  }),
).annotations({
  identifier: "ApplicationAssociationSummary",
}) as any as S.Schema<ApplicationAssociationSummary>;
export type ApplicationAssociationsList = ApplicationAssociationSummary[];
export const ApplicationAssociationsList = S.Array(
  ApplicationAssociationSummary,
);
export interface ApplicationSummary {
  Arn?: string;
  Id?: string;
  Name?: string;
  Namespace?: string;
  CreatedTime?: Date;
  LastModifiedTime?: Date;
  IsService?: boolean;
  ApplicationType?: ApplicationType;
}
export const ApplicationSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Namespace: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    IsService: S.optional(S.Boolean),
    ApplicationType: S.optional(ApplicationType),
  }),
).annotations({
  identifier: "ApplicationSummary",
}) as any as S.Schema<ApplicationSummary>;
export type ApplicationsList = ApplicationSummary[];
export const ApplicationsList = S.Array(ApplicationSummary);
export interface DataIntegrationSummary {
  Arn?: string;
  Name?: string;
  SourceURI?: string;
}
export const DataIntegrationSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    SourceURI: S.optional(S.String),
  }),
).annotations({
  identifier: "DataIntegrationSummary",
}) as any as S.Schema<DataIntegrationSummary>;
export type DataIntegrationsList = DataIntegrationSummary[];
export const DataIntegrationsList = S.Array(DataIntegrationSummary);
export interface EventIntegrationAssociation {
  EventIntegrationAssociationArn?: string;
  EventIntegrationAssociationId?: string;
  EventIntegrationName?: string;
  ClientId?: string;
  EventBridgeRuleName?: string;
  ClientAssociationMetadata?: { [key: string]: string };
}
export const EventIntegrationAssociation = S.suspend(() =>
  S.Struct({
    EventIntegrationAssociationArn: S.optional(S.String),
    EventIntegrationAssociationId: S.optional(S.String),
    EventIntegrationName: S.optional(S.String),
    ClientId: S.optional(S.String),
    EventBridgeRuleName: S.optional(S.String),
    ClientAssociationMetadata: S.optional(ClientAssociationMetadata),
  }),
).annotations({
  identifier: "EventIntegrationAssociation",
}) as any as S.Schema<EventIntegrationAssociation>;
export type EventIntegrationAssociationsList = EventIntegrationAssociation[];
export const EventIntegrationAssociationsList = S.Array(
  EventIntegrationAssociation,
);
export interface EventIntegration {
  EventIntegrationArn?: string;
  Name?: string;
  Description?: string;
  EventFilter?: EventFilter;
  EventBridgeBus?: string;
  Tags?: { [key: string]: string };
}
export const EventIntegration = S.suspend(() =>
  S.Struct({
    EventIntegrationArn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    EventFilter: S.optional(EventFilter),
    EventBridgeBus: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "EventIntegration",
}) as any as S.Schema<EventIntegration>;
export type EventIntegrationsList = EventIntegration[];
export const EventIntegrationsList = S.Array(EventIntegration);
export type ExecutionStatus = "COMPLETED" | "IN_PROGRESS" | "FAILED";
export const ExecutionStatus = S.Literal("COMPLETED", "IN_PROGRESS", "FAILED");
export interface CreateApplicationRequest {
  Name: string;
  Namespace: string;
  Description?: string;
  ApplicationSourceConfig: ApplicationSourceConfig;
  Subscriptions?: Subscription[];
  Publications?: Publication[];
  ClientToken?: string;
  Tags?: { [key: string]: string };
  Permissions?: string[];
  IsService?: boolean;
  InitializationTimeout?: number;
  ApplicationConfig?: ApplicationConfig;
  IframeConfig?: IframeConfig;
  ApplicationType?: ApplicationType;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Namespace: S.String,
    Description: S.optional(S.String),
    ApplicationSourceConfig: ApplicationSourceConfig,
    Subscriptions: S.optional(SubscriptionList),
    Publications: S.optional(PublicationList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Tags: S.optional(TagMap),
    Permissions: S.optional(PermissionList),
    IsService: S.optional(S.Boolean),
    InitializationTimeout: S.optional(S.Number),
    ApplicationConfig: S.optional(ApplicationConfig),
    IframeConfig: S.optional(IframeConfig),
    ApplicationType: S.optional(ApplicationType),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface CreateDataIntegrationRequest {
  Name: string;
  Description?: string;
  KmsKey: string;
  SourceURI?: string;
  ScheduleConfig?: ScheduleConfiguration;
  Tags?: { [key: string]: string };
  ClientToken?: string;
  FileConfiguration?: FileConfiguration;
  ObjectConfiguration?: { [key: string]: { [key: string]: string[] } };
}
export const CreateDataIntegrationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    KmsKey: S.String,
    SourceURI: S.optional(S.String),
    ScheduleConfig: S.optional(ScheduleConfiguration),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    FileConfiguration: S.optional(FileConfiguration),
    ObjectConfiguration: S.optional(ObjectConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/dataIntegrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataIntegrationRequest",
}) as any as S.Schema<CreateDataIntegrationRequest>;
export interface CreateDataIntegrationAssociationRequest {
  DataIntegrationIdentifier: string;
  ClientId?: string;
  ObjectConfiguration?: { [key: string]: { [key: string]: string[] } };
  DestinationURI?: string;
  ClientAssociationMetadata?: { [key: string]: string };
  ClientToken?: string;
  ExecutionConfiguration?: ExecutionConfiguration;
}
export const CreateDataIntegrationAssociationRequest = S.suspend(() =>
  S.Struct({
    DataIntegrationIdentifier: S.String.pipe(
      T.HttpLabel("DataIntegrationIdentifier"),
    ),
    ClientId: S.optional(S.String),
    ObjectConfiguration: S.optional(ObjectConfiguration),
    DestinationURI: S.optional(S.String),
    ClientAssociationMetadata: S.optional(ClientAssociationMetadata),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ExecutionConfiguration: S.optional(ExecutionConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/dataIntegrations/{DataIntegrationIdentifier}/associations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataIntegrationAssociationRequest",
}) as any as S.Schema<CreateDataIntegrationAssociationRequest>;
export interface CreateEventIntegrationResponse {
  EventIntegrationArn?: string;
}
export const CreateEventIntegrationResponse = S.suspend(() =>
  S.Struct({ EventIntegrationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateEventIntegrationResponse",
}) as any as S.Schema<CreateEventIntegrationResponse>;
export interface ListApplicationAssociationsResponse {
  ApplicationAssociations?: ApplicationAssociationSummary[];
  NextToken?: string;
}
export const ListApplicationAssociationsResponse = S.suspend(() =>
  S.Struct({
    ApplicationAssociations: S.optional(ApplicationAssociationsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationAssociationsResponse",
}) as any as S.Schema<ListApplicationAssociationsResponse>;
export interface ListApplicationsResponse {
  Applications?: ApplicationSummary[];
  NextToken?: string;
}
export const ListApplicationsResponse = S.suspend(() =>
  S.Struct({
    Applications: S.optional(ApplicationsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationsResponse",
}) as any as S.Schema<ListApplicationsResponse>;
export interface ListDataIntegrationsResponse {
  DataIntegrations?: DataIntegrationSummary[];
  NextToken?: string;
}
export const ListDataIntegrationsResponse = S.suspend(() =>
  S.Struct({
    DataIntegrations: S.optional(DataIntegrationsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataIntegrationsResponse",
}) as any as S.Schema<ListDataIntegrationsResponse>;
export interface ListEventIntegrationAssociationsResponse {
  EventIntegrationAssociations?: EventIntegrationAssociation[];
  NextToken?: string;
}
export const ListEventIntegrationAssociationsResponse = S.suspend(() =>
  S.Struct({
    EventIntegrationAssociations: S.optional(EventIntegrationAssociationsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEventIntegrationAssociationsResponse",
}) as any as S.Schema<ListEventIntegrationAssociationsResponse>;
export interface ListEventIntegrationsResponse {
  EventIntegrations?: EventIntegration[];
  NextToken?: string;
}
export const ListEventIntegrationsResponse = S.suspend(() =>
  S.Struct({
    EventIntegrations: S.optional(EventIntegrationsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEventIntegrationsResponse",
}) as any as S.Schema<ListEventIntegrationsResponse>;
export interface LastExecutionStatus {
  ExecutionStatus?: ExecutionStatus;
  StatusMessage?: string;
}
export const LastExecutionStatus = S.suspend(() =>
  S.Struct({
    ExecutionStatus: S.optional(ExecutionStatus),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "LastExecutionStatus",
}) as any as S.Schema<LastExecutionStatus>;
export interface DataIntegrationAssociationSummary {
  DataIntegrationAssociationArn?: string;
  DataIntegrationArn?: string;
  ClientId?: string;
  DestinationURI?: string;
  LastExecutionStatus?: LastExecutionStatus;
  ExecutionConfiguration?: ExecutionConfiguration;
}
export const DataIntegrationAssociationSummary = S.suspend(() =>
  S.Struct({
    DataIntegrationAssociationArn: S.optional(S.String),
    DataIntegrationArn: S.optional(S.String),
    ClientId: S.optional(S.String),
    DestinationURI: S.optional(S.String),
    LastExecutionStatus: S.optional(LastExecutionStatus),
    ExecutionConfiguration: S.optional(ExecutionConfiguration),
  }),
).annotations({
  identifier: "DataIntegrationAssociationSummary",
}) as any as S.Schema<DataIntegrationAssociationSummary>;
export type DataIntegrationAssociationsList =
  DataIntegrationAssociationSummary[];
export const DataIntegrationAssociationsList = S.Array(
  DataIntegrationAssociationSummary,
);
export interface CreateApplicationResponse {
  Arn?: string;
  Id?: string;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface CreateDataIntegrationResponse {
  Arn?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  KmsKey?: string;
  SourceURI?: string;
  ScheduleConfiguration?: ScheduleConfiguration;
  Tags?: { [key: string]: string };
  ClientToken?: string;
  FileConfiguration?: FileConfiguration;
  ObjectConfiguration?: { [key: string]: { [key: string]: string[] } };
}
export const CreateDataIntegrationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    KmsKey: S.optional(S.String),
    SourceURI: S.optional(S.String),
    ScheduleConfiguration: S.optional(ScheduleConfiguration),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
    FileConfiguration: S.optional(FileConfiguration),
    ObjectConfiguration: S.optional(ObjectConfiguration),
  }),
).annotations({
  identifier: "CreateDataIntegrationResponse",
}) as any as S.Schema<CreateDataIntegrationResponse>;
export interface CreateDataIntegrationAssociationResponse {
  DataIntegrationAssociationId?: string;
  DataIntegrationArn?: string;
}
export const CreateDataIntegrationAssociationResponse = S.suspend(() =>
  S.Struct({
    DataIntegrationAssociationId: S.optional(S.String),
    DataIntegrationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateDataIntegrationAssociationResponse",
}) as any as S.Schema<CreateDataIntegrationAssociationResponse>;
export interface ListDataIntegrationAssociationsResponse {
  DataIntegrationAssociations?: DataIntegrationAssociationSummary[];
  NextToken?: string;
}
export const ListDataIntegrationAssociationsResponse = S.suspend(() =>
  S.Struct({
    DataIntegrationAssociations: S.optional(DataIntegrationAssociationsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataIntegrationAssociationsResponse",
}) as any as S.Schema<ListDataIntegrationAssociationsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServiceError extends S.TaggedError<InternalServiceError>()(
  "InternalServiceError",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DuplicateResourceException extends S.TaggedError<DuplicateResourceException>()(
  "DuplicateResourceException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceQuotaExceededException extends S.TaggedError<ResourceQuotaExceededException>()(
  "ResourceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists applications in the account.
 */
export const listApplications: {
  (
    input: ListApplicationsRequest,
  ): effect.Effect<
    ListApplicationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsRequest,
  ) => stream.Stream<
    ListApplicationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsRequest,
  ) => stream.Stream<
    ApplicationSummary,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Applications",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes the DataIntegration. Only DataIntegrations that don't have any
 * DataIntegrationAssociations can be deleted. Deleting a DataIntegration also deletes the
 * underlying Amazon AppFlow flow and service linked role.
 *
 * You cannot create a DataIntegration association for a DataIntegration that has been previously associated.
 * Use a different DataIntegration, or recreate the DataIntegration using the
 * CreateDataIntegration API.
 */
export const deleteDataIntegration: (
  input: DeleteDataIntegrationRequest,
) => effect.Effect<
  DeleteDataIntegrationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataIntegrationRequest,
  output: DeleteDataIntegrationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified existing event integration. If the event integration is associated
 * with clients, the request is rejected.
 */
export const deleteEventIntegration: (
  input: DeleteEventIntegrationRequest,
) => effect.Effect<
  DeleteEventIntegrationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventIntegrationRequest,
  output: DeleteEventIntegrationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the description of a DataIntegration.
 *
 * You cannot create a DataIntegration association for a DataIntegration that has been previously associated.
 * Use a different DataIntegration, or recreate the DataIntegration using the
 * CreateDataIntegration API.
 */
export const updateDataIntegration: (
  input: UpdateDataIntegrationRequest,
) => effect.Effect<
  UpdateDataIntegrationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataIntegrationRequest,
  output: UpdateDataIntegrationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates and persists a DataIntegrationAssociation resource.
 *
 * Updating a DataIntegrationAssociation with ExecutionConfiguration will rerun the on-demand job.
 */
export const updateDataIntegrationAssociation: (
  input: UpdateDataIntegrationAssociationRequest,
) => effect.Effect<
  UpdateDataIntegrationAssociationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataIntegrationAssociationRequest,
  output: UpdateDataIntegrationAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the description of an event integration.
 */
export const updateEventIntegration: (
  input: UpdateEventIntegrationRequest,
) => effect.Effect<
  UpdateEventIntegrationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventIntegrationRequest,
  output: UpdateEventIntegrationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the Application. Only Applications that don't have any Application Associations
 * can be deleted.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => effect.Effect<
  DeleteApplicationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Get an Application resource.
 */
export const getApplication: (
  input: GetApplicationRequest,
) => effect.Effect<
  GetApplicationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationRequest,
  output: GetApplicationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns information about the DataIntegration.
 *
 * You cannot create a DataIntegration association for a DataIntegration that has been previously associated.
 * Use a different DataIntegration, or recreate the DataIntegration using the
 * CreateDataIntegration API.
 */
export const getDataIntegration: (
  input: GetDataIntegrationRequest,
) => effect.Effect<
  GetDataIntegrationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataIntegrationRequest,
  output: GetDataIntegrationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns information about the event integration.
 */
export const getEventIntegration: (
  input: GetEventIntegrationRequest,
) => effect.Effect<
  GetEventIntegrationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventIntegrationRequest,
  output: GetEventIntegrationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a paginated list of application associations for an application.
 */
export const listApplicationAssociations: {
  (
    input: ListApplicationAssociationsRequest,
  ): effect.Effect<
    ListApplicationAssociationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationAssociationsRequest,
  ) => stream.Stream<
    ListApplicationAssociationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationAssociationsRequest,
  ) => stream.Stream<
    ApplicationAssociationSummary,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationAssociationsRequest,
  output: ListApplicationAssociationsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ApplicationAssociations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a paginated list of event integration associations in the account.
 */
export const listEventIntegrationAssociations: {
  (
    input: ListEventIntegrationAssociationsRequest,
  ): effect.Effect<
    ListEventIntegrationAssociationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventIntegrationAssociationsRequest,
  ) => stream.Stream<
    ListEventIntegrationAssociationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventIntegrationAssociationsRequest,
  ) => stream.Stream<
    EventIntegrationAssociation,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventIntegrationAssociationsRequest,
  output: ListEventIntegrationAssociationsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EventIntegrationAssociations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a paginated list of DataIntegration associations in the account.
 *
 * You cannot create a DataIntegration association for a DataIntegration that has been previously associated.
 * Use a different DataIntegration, or recreate the DataIntegration using the
 * CreateDataIntegration API.
 */
export const listDataIntegrationAssociations: {
  (
    input: ListDataIntegrationAssociationsRequest,
  ): effect.Effect<
    ListDataIntegrationAssociationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataIntegrationAssociationsRequest,
  ) => stream.Stream<
    ListDataIntegrationAssociationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataIntegrationAssociationsRequest,
  ) => stream.Stream<
    DataIntegrationAssociationSummary,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataIntegrationAssociationsRequest,
  output: ListDataIntegrationAssociationsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DataIntegrationAssociations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a paginated list of DataIntegrations in the account.
 *
 * You cannot create a DataIntegration association for a DataIntegration that has been previously associated.
 * Use a different DataIntegration, or recreate the DataIntegration using the
 * CreateDataIntegration API.
 */
export const listDataIntegrations: {
  (
    input: ListDataIntegrationsRequest,
  ): effect.Effect<
    ListDataIntegrationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataIntegrationsRequest,
  ) => stream.Stream<
    ListDataIntegrationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataIntegrationsRequest,
  ) => stream.Stream<
    DataIntegrationSummary,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataIntegrationsRequest,
  output: ListDataIntegrationsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DataIntegrations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a paginated list of event integrations in the account.
 */
export const listEventIntegrations: {
  (
    input: ListEventIntegrationsRequest,
  ): effect.Effect<
    ListEventIntegrationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventIntegrationsRequest,
  ) => stream.Stream<
    ListEventIntegrationsResponse,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventIntegrationsRequest,
  ) => stream.Stream<
    EventIntegration,
    | AccessDeniedException
    | InternalServiceError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventIntegrationsRequest,
  output: ListEventIntegrationsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EventIntegrations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Adds the specified tags to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an EventIntegration, given a specified name, description, and a reference to an
 * Amazon EventBridge bus in your account and a partner event source that pushes events to
 * that bus. No objects are created in the your account, only metadata that is persisted on the
 * EventIntegration control plane.
 */
export const createEventIntegration: (
  input: CreateEventIntegrationRequest,
) => effect.Effect<
  CreateEventIntegrationResponse,
  | AccessDeniedException
  | DuplicateResourceException
  | InternalServiceError
  | InvalidRequestException
  | ResourceQuotaExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventIntegrationRequest,
  output: CreateEventIntegrationResponse,
  errors: [
    AccessDeniedException,
    DuplicateResourceException,
    InternalServiceError,
    InvalidRequestException,
    ResourceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates and persists a DataIntegration resource.
 *
 * You cannot create a DataIntegration association for a DataIntegration that has been
 * previously associated. Use a different DataIntegration, or recreate the DataIntegration
 * using the `CreateDataIntegration` API.
 */
export const createDataIntegration: (
  input: CreateDataIntegrationRequest,
) => effect.Effect<
  CreateDataIntegrationResponse,
  | AccessDeniedException
  | DuplicateResourceException
  | InternalServiceError
  | InvalidRequestException
  | ResourceQuotaExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataIntegrationRequest,
  output: CreateDataIntegrationResponse,
  errors: [
    AccessDeniedException,
    DuplicateResourceException,
    InternalServiceError,
    InvalidRequestException,
    ResourceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates and persists a DataIntegrationAssociation resource.
 */
export const createDataIntegrationAssociation: (
  input: CreateDataIntegrationAssociationRequest,
) => effect.Effect<
  CreateDataIntegrationAssociationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ResourceQuotaExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataIntegrationAssociationRequest,
  output: CreateDataIntegrationAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ResourceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Updates and persists an Application resource.
 */
export const updateApplication: (
  input: UpdateApplicationRequest,
) => effect.Effect<
  UpdateApplicationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates and persists an Application resource.
 */
export const createApplication: (
  input: CreateApplicationRequest,
) => effect.Effect<
  CreateApplicationResponse,
  | AccessDeniedException
  | DuplicateResourceException
  | InternalServiceError
  | InvalidRequestException
  | ResourceQuotaExceededException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    AccessDeniedException,
    DuplicateResourceException,
    InternalServiceError,
    InvalidRequestException,
    ResourceQuotaExceededException,
    ThrottlingException,
    UnsupportedOperationException,
  ],
}));

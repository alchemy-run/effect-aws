import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "AppIntegrations",
  serviceShapeName: "AmazonAppIntegrationService",
});
const auth = T.AwsAuthSigv4({ name: "app-integrations" });
const ver = T.ServiceVersion("2020-07-29");
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
                        url: "https://app-integrations-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://app-integrations-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://app-integrations.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://app-integrations.{Region}.{PartitionResult#dnsSuffix}",
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
export const PermissionList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeleteApplicationRequest extends S.Class<DeleteApplicationRequest>(
  "DeleteApplicationRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/applications/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({}) {}
export class DeleteDataIntegrationRequest extends S.Class<DeleteDataIntegrationRequest>(
  "DeleteDataIntegrationRequest",
)(
  { DataIntegrationIdentifier: S.String.pipe(T.HttpLabel()) },
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
) {}
export class DeleteDataIntegrationResponse extends S.Class<DeleteDataIntegrationResponse>(
  "DeleteDataIntegrationResponse",
)({}) {}
export class DeleteEventIntegrationRequest extends S.Class<DeleteEventIntegrationRequest>(
  "DeleteEventIntegrationRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/eventIntegrations/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventIntegrationResponse extends S.Class<DeleteEventIntegrationResponse>(
  "DeleteEventIntegrationResponse",
)({}) {}
export class GetApplicationRequest extends S.Class<GetApplicationRequest>(
  "GetApplicationRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataIntegrationRequest extends S.Class<GetDataIntegrationRequest>(
  "GetDataIntegrationRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/dataIntegrations/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEventIntegrationRequest extends S.Class<GetEventIntegrationRequest>(
  "GetEventIntegrationRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/eventIntegrations/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListApplicationAssociationsRequest extends S.Class<ListApplicationAssociationsRequest>(
  "ListApplicationAssociationsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ApplicationType: S.optional(S.String).pipe(T.HttpQuery("applicationType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataIntegrationAssociationsRequest extends S.Class<ListDataIntegrationAssociationsRequest>(
  "ListDataIntegrationAssociationsRequest",
)(
  {
    DataIntegrationIdentifier: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListDataIntegrationsRequest extends S.Class<ListDataIntegrationsRequest>(
  "ListDataIntegrationsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/dataIntegrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEventIntegrationAssociationsRequest extends S.Class<ListEventIntegrationAssociationsRequest>(
  "ListEventIntegrationAssociationsRequest",
)(
  {
    EventIntegrationName: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListEventIntegrationsRequest extends S.Class<ListEventIntegrationsRequest>(
  "ListEventIntegrationsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/eventIntegrations" }),
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
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
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
export const ApplicationApprovedOrigins = S.Array(S.String);
export class ExternalUrlConfig extends S.Class<ExternalUrlConfig>(
  "ExternalUrlConfig",
)({
  AccessUrl: S.String,
  ApprovedOrigins: S.optional(ApplicationApprovedOrigins),
}) {}
export class ApplicationSourceConfig extends S.Class<ApplicationSourceConfig>(
  "ApplicationSourceConfig",
)({ ExternalUrlConfig: S.optional(ExternalUrlConfig) }) {}
export class Subscription extends S.Class<Subscription>("Subscription")({
  Event: S.String,
  Description: S.optional(S.String),
}) {}
export const SubscriptionList = S.Array(Subscription);
export class Publication extends S.Class<Publication>("Publication")({
  Event: S.String,
  Schema: S.String,
  Description: S.optional(S.String),
}) {}
export const PublicationList = S.Array(Publication);
export class ContactHandling extends S.Class<ContactHandling>(
  "ContactHandling",
)({ Scope: S.optional(S.String) }) {}
export class ApplicationConfig extends S.Class<ApplicationConfig>(
  "ApplicationConfig",
)({ ContactHandling: S.optional(ContactHandling) }) {}
export const IframePermissionList = S.Array(S.String);
export class IframeConfig extends S.Class<IframeConfig>("IframeConfig")({
  Allow: S.optional(IframePermissionList),
  Sandbox: S.optional(IframePermissionList),
}) {}
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    Arn: S.String.pipe(T.HttpLabel()),
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
    ApplicationType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/applications/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)({}) {}
export class UpdateDataIntegrationRequest extends S.Class<UpdateDataIntegrationRequest>(
  "UpdateDataIntegrationRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/dataIntegrations/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataIntegrationResponse extends S.Class<UpdateDataIntegrationResponse>(
  "UpdateDataIntegrationResponse",
)({}) {}
export class OnDemandConfiguration extends S.Class<OnDemandConfiguration>(
  "OnDemandConfiguration",
)({ StartTime: S.String, EndTime: S.optional(S.String) }) {}
export class ScheduleConfiguration extends S.Class<ScheduleConfiguration>(
  "ScheduleConfiguration",
)({
  FirstExecutionFrom: S.optional(S.String),
  Object: S.optional(S.String),
  ScheduleExpression: S.String,
}) {}
export class ExecutionConfiguration extends S.Class<ExecutionConfiguration>(
  "ExecutionConfiguration",
)({
  ExecutionMode: S.String,
  OnDemandConfiguration: S.optional(OnDemandConfiguration),
  ScheduleConfiguration: S.optional(ScheduleConfiguration),
}) {}
export class UpdateDataIntegrationAssociationRequest extends S.Class<UpdateDataIntegrationAssociationRequest>(
  "UpdateDataIntegrationAssociationRequest",
)(
  {
    DataIntegrationIdentifier: S.String.pipe(T.HttpLabel()),
    DataIntegrationAssociationIdentifier: S.String.pipe(T.HttpLabel()),
    ExecutionConfiguration: ExecutionConfiguration,
  },
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
) {}
export class UpdateDataIntegrationAssociationResponse extends S.Class<UpdateDataIntegrationAssociationResponse>(
  "UpdateDataIntegrationAssociationResponse",
)({}) {}
export class UpdateEventIntegrationRequest extends S.Class<UpdateEventIntegrationRequest>(
  "UpdateEventIntegrationRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()), Description: S.optional(S.String) },
  T.all(
    T.Http({ method: "PATCH", uri: "/eventIntegrations/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEventIntegrationResponse extends S.Class<UpdateEventIntegrationResponse>(
  "UpdateEventIntegrationResponse",
)({}) {}
export const FolderList = S.Array(S.String);
export const FieldsList = S.Array(S.String);
export const FieldsMap = S.Record({ key: S.String, value: FieldsList });
export const ObjectConfiguration = S.Record({
  key: S.String,
  value: FieldsMap,
});
export const ClientAssociationMetadata = S.Record({
  key: S.String,
  value: S.String,
});
export class EventFilter extends S.Class<EventFilter>("EventFilter")({
  Source: S.String,
}) {}
export class CreateEventIntegrationRequest extends S.Class<CreateEventIntegrationRequest>(
  "CreateEventIntegrationRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    EventFilter: EventFilter,
    EventBridgeBus: S.String,
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/eventIntegrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApplicationResponse extends S.Class<GetApplicationResponse>(
  "GetApplicationResponse",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Namespace: S.optional(S.String),
  Description: S.optional(S.String),
  ApplicationSourceConfig: S.optional(ApplicationSourceConfig),
  Subscriptions: S.optional(SubscriptionList),
  Publications: S.optional(PublicationList),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
  Permissions: S.optional(PermissionList),
  IsService: S.optional(S.Boolean),
  InitializationTimeout: S.optional(S.Number),
  ApplicationConfig: S.optional(ApplicationConfig),
  IframeConfig: S.optional(IframeConfig),
  ApplicationType: S.optional(S.String),
}) {}
export class FileConfiguration extends S.Class<FileConfiguration>(
  "FileConfiguration",
)({ Folders: FolderList, Filters: S.optional(FieldsMap) }) {}
export class GetDataIntegrationResponse extends S.Class<GetDataIntegrationResponse>(
  "GetDataIntegrationResponse",
)({
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
}) {}
export class GetEventIntegrationResponse extends S.Class<GetEventIntegrationResponse>(
  "GetEventIntegrationResponse",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  EventIntegrationArn: S.optional(S.String),
  EventBridgeBus: S.optional(S.String),
  EventFilter: S.optional(EventFilter),
  Tags: S.optional(TagMap),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class ApplicationAssociationSummary extends S.Class<ApplicationAssociationSummary>(
  "ApplicationAssociationSummary",
)({
  ApplicationAssociationArn: S.optional(S.String),
  ApplicationArn: S.optional(S.String),
  ClientId: S.optional(S.String),
}) {}
export const ApplicationAssociationsList = S.Array(
  ApplicationAssociationSummary,
);
export class ApplicationSummary extends S.Class<ApplicationSummary>(
  "ApplicationSummary",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Namespace: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IsService: S.optional(S.Boolean),
  ApplicationType: S.optional(S.String),
}) {}
export const ApplicationsList = S.Array(ApplicationSummary);
export class DataIntegrationSummary extends S.Class<DataIntegrationSummary>(
  "DataIntegrationSummary",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  SourceURI: S.optional(S.String),
}) {}
export const DataIntegrationsList = S.Array(DataIntegrationSummary);
export class EventIntegrationAssociation extends S.Class<EventIntegrationAssociation>(
  "EventIntegrationAssociation",
)({
  EventIntegrationAssociationArn: S.optional(S.String),
  EventIntegrationAssociationId: S.optional(S.String),
  EventIntegrationName: S.optional(S.String),
  ClientId: S.optional(S.String),
  EventBridgeRuleName: S.optional(S.String),
  ClientAssociationMetadata: S.optional(ClientAssociationMetadata),
}) {}
export const EventIntegrationAssociationsList = S.Array(
  EventIntegrationAssociation,
);
export class EventIntegration extends S.Class<EventIntegration>(
  "EventIntegration",
)({
  EventIntegrationArn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  EventFilter: S.optional(EventFilter),
  EventBridgeBus: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export const EventIntegrationsList = S.Array(EventIntegration);
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    Name: S.String,
    Namespace: S.String,
    Description: S.optional(S.String),
    ApplicationSourceConfig: ApplicationSourceConfig,
    Subscriptions: S.optional(SubscriptionList),
    Publications: S.optional(PublicationList),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagMap),
    Permissions: S.optional(PermissionList),
    IsService: S.optional(S.Boolean),
    InitializationTimeout: S.optional(S.Number),
    ApplicationConfig: S.optional(ApplicationConfig),
    IframeConfig: S.optional(IframeConfig),
    ApplicationType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataIntegrationRequest extends S.Class<CreateDataIntegrationRequest>(
  "CreateDataIntegrationRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    KmsKey: S.String,
    SourceURI: S.optional(S.String),
    ScheduleConfig: S.optional(ScheduleConfiguration),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
    FileConfiguration: S.optional(FileConfiguration),
    ObjectConfiguration: S.optional(ObjectConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/dataIntegrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataIntegrationAssociationRequest extends S.Class<CreateDataIntegrationAssociationRequest>(
  "CreateDataIntegrationAssociationRequest",
)(
  {
    DataIntegrationIdentifier: S.String.pipe(T.HttpLabel()),
    ClientId: S.optional(S.String),
    ObjectConfiguration: S.optional(ObjectConfiguration),
    DestinationURI: S.optional(S.String),
    ClientAssociationMetadata: S.optional(ClientAssociationMetadata),
    ClientToken: S.optional(S.String),
    ExecutionConfiguration: S.optional(ExecutionConfiguration),
  },
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
) {}
export class CreateEventIntegrationResponse extends S.Class<CreateEventIntegrationResponse>(
  "CreateEventIntegrationResponse",
)({ EventIntegrationArn: S.optional(S.String) }) {}
export class ListApplicationAssociationsResponse extends S.Class<ListApplicationAssociationsResponse>(
  "ListApplicationAssociationsResponse",
)({
  ApplicationAssociations: S.optional(ApplicationAssociationsList),
  NextToken: S.optional(S.String),
}) {}
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)({
  Applications: S.optional(ApplicationsList),
  NextToken: S.optional(S.String),
}) {}
export class ListDataIntegrationsResponse extends S.Class<ListDataIntegrationsResponse>(
  "ListDataIntegrationsResponse",
)({
  DataIntegrations: S.optional(DataIntegrationsList),
  NextToken: S.optional(S.String),
}) {}
export class ListEventIntegrationAssociationsResponse extends S.Class<ListEventIntegrationAssociationsResponse>(
  "ListEventIntegrationAssociationsResponse",
)({
  EventIntegrationAssociations: S.optional(EventIntegrationAssociationsList),
  NextToken: S.optional(S.String),
}) {}
export class ListEventIntegrationsResponse extends S.Class<ListEventIntegrationsResponse>(
  "ListEventIntegrationsResponse",
)({
  EventIntegrations: S.optional(EventIntegrationsList),
  NextToken: S.optional(S.String),
}) {}
export class LastExecutionStatus extends S.Class<LastExecutionStatus>(
  "LastExecutionStatus",
)({
  ExecutionStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export class DataIntegrationAssociationSummary extends S.Class<DataIntegrationAssociationSummary>(
  "DataIntegrationAssociationSummary",
)({
  DataIntegrationAssociationArn: S.optional(S.String),
  DataIntegrationArn: S.optional(S.String),
  ClientId: S.optional(S.String),
  DestinationURI: S.optional(S.String),
  LastExecutionStatus: S.optional(LastExecutionStatus),
  ExecutionConfiguration: S.optional(ExecutionConfiguration),
}) {}
export const DataIntegrationAssociationsList = S.Array(
  DataIntegrationAssociationSummary,
);
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)({ Arn: S.optional(S.String), Id: S.optional(S.String) }) {}
export class CreateDataIntegrationResponse extends S.Class<CreateDataIntegrationResponse>(
  "CreateDataIntegrationResponse",
)({
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
}) {}
export class CreateDataIntegrationAssociationResponse extends S.Class<CreateDataIntegrationAssociationResponse>(
  "CreateDataIntegrationAssociationResponse",
)({
  DataIntegrationAssociationId: S.optional(S.String),
  DataIntegrationArn: S.optional(S.String),
}) {}
export class ListDataIntegrationAssociationsResponse extends S.Class<ListDataIntegrationAssociationsResponse>(
  "ListDataIntegrationAssociationsResponse",
)({
  DataIntegrationAssociations: S.optional(DataIntegrationAssociationsList),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServiceError extends S.TaggedError<InternalServiceError>()(
  "InternalServiceError",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String) },
) {}
export class DuplicateResourceException extends S.TaggedError<DuplicateResourceException>()(
  "DuplicateResourceException",
  {},
) {}
export class ResourceQuotaExceededException extends S.TaggedError<ResourceQuotaExceededException>()(
  "ResourceQuotaExceededException",
  {},
) {}

//# Operations
/**
 * Updates the description of a DataIntegration.
 *
 * You cannot create a DataIntegration association for a DataIntegration that has been previously associated.
 * Use a different DataIntegration, or recreate the DataIntegration using the
 * CreateDataIntegration API.
 */
export const updateDataIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDataIntegrationRequest,
    output: UpdateDataIntegrationResponse,
    errors: [
      AccessDeniedException,
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates and persists a DataIntegrationAssociation resource.
 *
 * Updating a DataIntegrationAssociation with ExecutionConfiguration will rerun the on-demand job.
 */
export const updateDataIntegrationAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateEventIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEventIntegrationRequest,
    output: UpdateEventIntegrationResponse,
    errors: [
      AccessDeniedException,
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes the Application. Only Applications that don't have any Application Associations
 * can be deleted.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the DataIntegration. Only DataIntegrations that don't have any
 * DataIntegrationAssociations can be deleted. Deleting a DataIntegration also deletes the
 * underlying Amazon AppFlow flow and service linked role.
 *
 * You cannot create a DataIntegration association for a DataIntegration that has been previously associated.
 * Use a different DataIntegration, or recreate the DataIntegration using the
 * CreateDataIntegration API.
 */
export const deleteDataIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDataIntegrationRequest,
    output: DeleteDataIntegrationResponse,
    errors: [
      AccessDeniedException,
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes the specified existing event integration. If the event integration is associated
 * with clients, the request is rejected.
 */
export const deleteEventIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEventIntegrationRequest,
    output: DeleteEventIntegrationResponse,
    errors: [
      AccessDeniedException,
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Get an Application resource.
 */
export const getApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getEventIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds the specified tags to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes the specified tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates and persists an Application resource.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a paginated list of application associations for an application.
 */
export const listApplicationAssociations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListApplicationAssociationsRequest,
    output: ListApplicationAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists applications in the account.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Returns a paginated list of DataIntegrations in the account.
 *
 * You cannot create a DataIntegration association for a DataIntegration that has been previously associated.
 * Use a different DataIntegration, or recreate the DataIntegration using the
 * CreateDataIntegration API.
 */
export const listDataIntegrations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDataIntegrationsRequest,
    output: ListDataIntegrationsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceError,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns a paginated list of event integration associations in the account.
 */
export const listEventIntegrationAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListEventIntegrationAssociationsRequest,
    output: ListEventIntegrationAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Returns a paginated list of event integrations in the account.
 */
export const listEventIntegrations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEventIntegrationsRequest,
    output: ListEventIntegrationsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceError,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates and persists a DataIntegration resource.
 *
 * You cannot create a DataIntegration association for a DataIntegration that has been
 * previously associated. Use a different DataIntegration, or recreate the DataIntegration
 * using the `CreateDataIntegration` API.
 */
export const createDataIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates and persists a DataIntegrationAssociation resource.
 */
export const createDataIntegrationAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an EventIntegration, given a specified name, description, and a reference to an
 * Amazon EventBridge bus in your account and a partner event source that pushes events to
 * that bus. No objects are created in the your account, only metadata that is persisted on the
 * EventIntegration control plane.
 */
export const createEventIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns a paginated list of DataIntegration associations in the account.
 *
 * You cannot create a DataIntegration association for a DataIntegration that has been previously associated.
 * Use a different DataIntegration, or recreate the DataIntegration using the
 * CreateDataIntegration API.
 */
export const listDataIntegrationAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDataIntegrationAssociationsRequest,
    output: ListDataIntegrationAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Creates and persists an Application resource.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

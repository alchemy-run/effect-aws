import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Notifications",
  serviceShapeName: "Notifications",
});
const auth = T.AwsAuthSigv4({ name: "notifications" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                  ],
                  endpoint: {
                    url: "https://notifications-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://notifications.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export class EnableNotificationsAccessForOrganizationRequest extends S.Class<EnableNotificationsAccessForOrganizationRequest>(
  "EnableNotificationsAccessForOrganizationRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/organization/access" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableNotificationsAccessForOrganizationResponse extends S.Class<EnableNotificationsAccessForOrganizationResponse>(
  "EnableNotificationsAccessForOrganizationResponse",
)({}) {}
export class GetNotificationsAccessForOrganizationRequest extends S.Class<GetNotificationsAccessForOrganizationRequest>(
  "GetNotificationsAccessForOrganizationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/organization/access" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableNotificationsAccessForOrganizationRequest extends S.Class<DisableNotificationsAccessForOrganizationRequest>(
  "DisableNotificationsAccessForOrganizationRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/organization/access" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableNotificationsAccessForOrganizationResponse extends S.Class<DisableNotificationsAccessForOrganizationResponse>(
  "DisableNotificationsAccessForOrganizationResponse",
)({}) {}
export const TagKeys = S.Array(S.String);
export const Regions = S.Array(S.String);
export class ListManagedNotificationChannelAssociationsRequest extends S.Class<ListManagedNotificationChannelAssociationsRequest>(
  "ListManagedNotificationChannelAssociationsRequest",
)(
  {
    managedNotificationConfigurationArn: S.String.pipe(
      T.HttpQuery("managedNotificationConfigurationArn"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/channels/list-managed-notification-channel-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMemberAccountsRequest extends S.Class<ListMemberAccountsRequest>(
  "ListMemberAccountsRequest",
)(
  {
    notificationConfigurationArn: S.String.pipe(
      T.HttpQuery("notificationConfigurationArn"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    memberAccount: S.optional(S.String).pipe(T.HttpQuery("memberAccount")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    organizationalUnitId: S.optional(S.String).pipe(
      T.HttpQuery("organizationalUnitId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/list-member-accounts" }),
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
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{arn}" }),
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
    arn: S.String.pipe(T.HttpLabel("arn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{arn}" }),
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
export class AssociateChannelRequest extends S.Class<AssociateChannelRequest>(
  "AssociateChannelRequest",
)(
  {
    arn: S.String.pipe(T.HttpLabel("arn")),
    notificationConfigurationArn: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/channels/associate/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateChannelResponse extends S.Class<AssociateChannelResponse>(
  "AssociateChannelResponse",
)({}) {}
export class DisassociateChannelRequest extends S.Class<DisassociateChannelRequest>(
  "DisassociateChannelRequest",
)(
  {
    arn: S.String.pipe(T.HttpLabel("arn")),
    notificationConfigurationArn: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/channels/disassociate/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateChannelResponse extends S.Class<DisassociateChannelResponse>(
  "DisassociateChannelResponse",
)({}) {}
export class ListChannelsRequest extends S.Class<ListChannelsRequest>(
  "ListChannelsRequest",
)(
  {
    notificationConfigurationArn: S.String.pipe(
      T.HttpQuery("notificationConfigurationArn"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/channels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEventRuleRequest extends S.Class<CreateEventRuleRequest>(
  "CreateEventRuleRequest",
)(
  {
    notificationConfigurationArn: S.String,
    source: S.String,
    eventType: S.String,
    eventPattern: S.optional(S.String),
    regions: Regions,
  },
  T.all(
    T.Http({ method: "POST", uri: "/event-rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEventRuleRequest extends S.Class<UpdateEventRuleRequest>(
  "UpdateEventRuleRequest",
)(
  {
    arn: S.String.pipe(T.HttpLabel("arn")),
    eventPattern: S.optional(S.String),
    regions: S.optional(Regions),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/event-rules/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEventRuleRequest extends S.Class<GetEventRuleRequest>(
  "GetEventRuleRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/event-rules/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventRuleRequest extends S.Class<DeleteEventRuleRequest>(
  "DeleteEventRuleRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/event-rules/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventRuleResponse extends S.Class<DeleteEventRuleResponse>(
  "DeleteEventRuleResponse",
)({}) {}
export class ListEventRulesRequest extends S.Class<ListEventRulesRequest>(
  "ListEventRulesRequest",
)(
  {
    notificationConfigurationArn: S.String.pipe(
      T.HttpQuery("notificationConfigurationArn"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/event-rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateManagedNotificationAccountContactRequest extends S.Class<AssociateManagedNotificationAccountContactRequest>(
  "AssociateManagedNotificationAccountContactRequest",
)(
  {
    contactIdentifier: S.String.pipe(T.HttpLabel("contactIdentifier")),
    managedNotificationConfigurationArn: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/contacts/associate-managed-notification/{contactIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateManagedNotificationAccountContactResponse extends S.Class<AssociateManagedNotificationAccountContactResponse>(
  "AssociateManagedNotificationAccountContactResponse",
)({}) {}
export class DisassociateManagedNotificationAccountContactRequest extends S.Class<DisassociateManagedNotificationAccountContactRequest>(
  "DisassociateManagedNotificationAccountContactRequest",
)(
  {
    contactIdentifier: S.String.pipe(T.HttpLabel("contactIdentifier")),
    managedNotificationConfigurationArn: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/contacts/disassociate-managed-notification/{contactIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateManagedNotificationAccountContactResponse extends S.Class<DisassociateManagedNotificationAccountContactResponse>(
  "DisassociateManagedNotificationAccountContactResponse",
)({}) {}
export class AssociateManagedNotificationAdditionalChannelRequest extends S.Class<AssociateManagedNotificationAdditionalChannelRequest>(
  "AssociateManagedNotificationAdditionalChannelRequest",
)(
  {
    channelArn: S.String.pipe(T.HttpLabel("channelArn")),
    managedNotificationConfigurationArn: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/channels/associate-managed-notification/{channelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateManagedNotificationAdditionalChannelResponse extends S.Class<AssociateManagedNotificationAdditionalChannelResponse>(
  "AssociateManagedNotificationAdditionalChannelResponse",
)({}) {}
export class DisassociateManagedNotificationAdditionalChannelRequest extends S.Class<DisassociateManagedNotificationAdditionalChannelRequest>(
  "DisassociateManagedNotificationAdditionalChannelRequest",
)(
  {
    channelArn: S.String.pipe(T.HttpLabel("channelArn")),
    managedNotificationConfigurationArn: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/channels/disassociate-managed-notification/{channelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateManagedNotificationAdditionalChannelResponse extends S.Class<DisassociateManagedNotificationAdditionalChannelResponse>(
  "DisassociateManagedNotificationAdditionalChannelResponse",
)({}) {}
export class GetManagedNotificationChildEventRequest extends S.Class<GetManagedNotificationChildEventRequest>(
  "GetManagedNotificationChildEventRequest",
)(
  {
    arn: S.String.pipe(T.HttpLabel("arn")),
    locale: S.optional(S.String).pipe(T.HttpQuery("locale")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/managed-notification-child-events/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListManagedNotificationChildEventsRequest extends S.Class<ListManagedNotificationChildEventsRequest>(
  "ListManagedNotificationChildEventsRequest",
)(
  {
    aggregateManagedNotificationEventArn: S.String.pipe(
      T.HttpLabel("aggregateManagedNotificationEventArn"),
    ),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("endTime"),
    ),
    locale: S.optional(S.String).pipe(T.HttpQuery("locale")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    relatedAccount: S.optional(S.String).pipe(T.HttpQuery("relatedAccount")),
    organizationalUnitId: S.optional(S.String).pipe(
      T.HttpQuery("organizationalUnitId"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/list-managed-notification-child-events/{aggregateManagedNotificationEventArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedNotificationConfigurationRequest extends S.Class<GetManagedNotificationConfigurationRequest>(
  "GetManagedNotificationConfigurationRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/managed-notification-configurations/{arn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListManagedNotificationConfigurationsRequest extends S.Class<ListManagedNotificationConfigurationsRequest>(
  "ListManagedNotificationConfigurationsRequest",
)(
  {
    channelIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("channelIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/managed-notification-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedNotificationEventRequest extends S.Class<GetManagedNotificationEventRequest>(
  "GetManagedNotificationEventRequest",
)(
  {
    arn: S.String.pipe(T.HttpLabel("arn")),
    locale: S.optional(S.String).pipe(T.HttpQuery("locale")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/managed-notification-events/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListManagedNotificationEventsRequest extends S.Class<ListManagedNotificationEventsRequest>(
  "ListManagedNotificationEventsRequest",
)(
  {
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("endTime"),
    ),
    locale: S.optional(S.String).pipe(T.HttpQuery("locale")),
    source: S.optional(S.String).pipe(T.HttpQuery("source")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    organizationalUnitId: S.optional(S.String).pipe(
      T.HttpQuery("organizationalUnitId"),
    ),
    relatedAccount: S.optional(S.String).pipe(T.HttpQuery("relatedAccount")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/managed-notification-events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateNotificationConfigurationRequest extends S.Class<CreateNotificationConfigurationRequest>(
  "CreateNotificationConfigurationRequest",
)(
  {
    name: S.String,
    description: S.String,
    aggregationDuration: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/notification-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNotificationConfigurationRequest extends S.Class<UpdateNotificationConfigurationRequest>(
  "UpdateNotificationConfigurationRequest",
)(
  {
    arn: S.String.pipe(T.HttpLabel("arn")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    aggregationDuration: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/notification-configurations/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNotificationConfigurationRequest extends S.Class<GetNotificationConfigurationRequest>(
  "GetNotificationConfigurationRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/notification-configurations/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNotificationConfigurationRequest extends S.Class<DeleteNotificationConfigurationRequest>(
  "DeleteNotificationConfigurationRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/notification-configurations/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNotificationConfigurationResponse extends S.Class<DeleteNotificationConfigurationResponse>(
  "DeleteNotificationConfigurationResponse",
)({}) {}
export class ListNotificationConfigurationsRequest extends S.Class<ListNotificationConfigurationsRequest>(
  "ListNotificationConfigurationsRequest",
)(
  {
    eventRuleSource: S.optional(S.String).pipe(T.HttpQuery("eventRuleSource")),
    channelArn: S.optional(S.String).pipe(T.HttpQuery("channelArn")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    subtype: S.optional(S.String).pipe(T.HttpQuery("subtype")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/notification-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNotificationEventRequest extends S.Class<GetNotificationEventRequest>(
  "GetNotificationEventRequest",
)(
  {
    arn: S.String.pipe(T.HttpLabel("arn")),
    locale: S.optional(S.String).pipe(T.HttpQuery("locale")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/notification-events/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNotificationEventsRequest extends S.Class<ListNotificationEventsRequest>(
  "ListNotificationEventsRequest",
)(
  {
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("endTime"),
    ),
    locale: S.optional(S.String).pipe(T.HttpQuery("locale")),
    source: S.optional(S.String).pipe(T.HttpQuery("source")),
    includeChildEvents: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeChildEvents"),
    ),
    aggregateNotificationEventArn: S.optional(S.String).pipe(
      T.HttpQuery("aggregateNotificationEventArn"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    organizationalUnitId: S.optional(S.String).pipe(
      T.HttpQuery("organizationalUnitId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/notification-events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterNotificationHubRequest extends S.Class<RegisterNotificationHubRequest>(
  "RegisterNotificationHubRequest",
)(
  { notificationHubRegion: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/notification-hubs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterNotificationHubRequest extends S.Class<DeregisterNotificationHubRequest>(
  "DeregisterNotificationHubRequest",
)(
  {
    notificationHubRegion: S.String.pipe(T.HttpLabel("notificationHubRegion")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/notification-hubs/{notificationHubRegion}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNotificationHubsRequest extends S.Class<ListNotificationHubsRequest>(
  "ListNotificationHubsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/notification-hubs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateOrganizationalUnitRequest extends S.Class<AssociateOrganizationalUnitRequest>(
  "AssociateOrganizationalUnitRequest",
)(
  {
    organizationalUnitId: S.String.pipe(T.HttpLabel("organizationalUnitId")),
    notificationConfigurationArn: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/organizational-units/associate/{organizationalUnitId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateOrganizationalUnitResponse extends S.Class<AssociateOrganizationalUnitResponse>(
  "AssociateOrganizationalUnitResponse",
)({}) {}
export class DisassociateOrganizationalUnitRequest extends S.Class<DisassociateOrganizationalUnitRequest>(
  "DisassociateOrganizationalUnitRequest",
)(
  {
    organizationalUnitId: S.String.pipe(T.HttpLabel("organizationalUnitId")),
    notificationConfigurationArn: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/organizational-units/disassociate/{organizationalUnitId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateOrganizationalUnitResponse extends S.Class<DisassociateOrganizationalUnitResponse>(
  "DisassociateOrganizationalUnitResponse",
)({}) {}
export class ListOrganizationalUnitsRequest extends S.Class<ListOrganizationalUnitsRequest>(
  "ListOrganizationalUnitsRequest",
)(
  {
    notificationConfigurationArn: S.String.pipe(
      T.HttpQuery("notificationConfigurationArn"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/organizational-units" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Channels = S.Array(S.String);
export const ManagedRuleArns = S.Array(S.String);
export class NotificationsAccessForOrganization extends S.Class<NotificationsAccessForOrganization>(
  "NotificationsAccessForOrganization",
)({ accessStatus: S.String }) {}
export const OrganizationalUnits = S.Array(S.String);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{arn}" }),
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
export class ListChannelsResponse extends S.Class<ListChannelsResponse>(
  "ListChannelsResponse",
)({ nextToken: S.optional(S.String), channels: Channels }) {}
export class EventRuleStatusSummary extends S.Class<EventRuleStatusSummary>(
  "EventRuleStatusSummary",
)({ status: S.String, reason: S.String }) {}
export const StatusSummaryByRegion = S.Record({
  key: S.String,
  value: EventRuleStatusSummary,
});
export class UpdateEventRuleResponse extends S.Class<UpdateEventRuleResponse>(
  "UpdateEventRuleResponse",
)({
  arn: S.String,
  notificationConfigurationArn: S.String,
  statusSummaryByRegion: StatusSummaryByRegion,
}) {}
export class GetEventRuleResponse extends S.Class<GetEventRuleResponse>(
  "GetEventRuleResponse",
)({
  arn: S.String,
  notificationConfigurationArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  source: S.String,
  eventType: S.String,
  eventPattern: S.String,
  regions: Regions,
  managedRules: ManagedRuleArns,
  statusSummaryByRegion: StatusSummaryByRegion,
}) {}
export class GetManagedNotificationConfigurationResponse extends S.Class<GetManagedNotificationConfigurationResponse>(
  "GetManagedNotificationConfigurationResponse",
)({
  arn: S.String,
  name: S.String,
  description: S.String,
  category: S.String,
  subCategory: S.String,
}) {}
export class CreateNotificationConfigurationResponse extends S.Class<CreateNotificationConfigurationResponse>(
  "CreateNotificationConfigurationResponse",
)({ arn: S.String, status: S.String }) {}
export class UpdateNotificationConfigurationResponse extends S.Class<UpdateNotificationConfigurationResponse>(
  "UpdateNotificationConfigurationResponse",
)({ arn: S.String }) {}
export class GetNotificationConfigurationResponse extends S.Class<GetNotificationConfigurationResponse>(
  "GetNotificationConfigurationResponse",
)({
  arn: S.String,
  name: S.String,
  description: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  aggregationDuration: S.optional(S.String),
  subtype: S.optional(S.String),
}) {}
export class NotificationHubStatusSummary extends S.Class<NotificationHubStatusSummary>(
  "NotificationHubStatusSummary",
)({ status: S.String, reason: S.String }) {}
export class DeregisterNotificationHubResponse extends S.Class<DeregisterNotificationHubResponse>(
  "DeregisterNotificationHubResponse",
)({
  notificationHubRegion: S.String,
  statusSummary: NotificationHubStatusSummary,
}) {}
export class GetNotificationsAccessForOrganizationResponse extends S.Class<GetNotificationsAccessForOrganizationResponse>(
  "GetNotificationsAccessForOrganizationResponse",
)({ notificationsAccessForOrganization: NotificationsAccessForOrganization }) {}
export class ListOrganizationalUnitsResponse extends S.Class<ListOrganizationalUnitsResponse>(
  "ListOrganizationalUnitsResponse",
)({
  organizationalUnits: OrganizationalUnits,
  nextToken: S.optional(S.String),
}) {}
export const AggregatedNotificationRegions = S.Array(S.String);
export class ManagedNotificationChannelAssociationSummary extends S.Class<ManagedNotificationChannelAssociationSummary>(
  "ManagedNotificationChannelAssociationSummary",
)({
  channelIdentifier: S.String,
  channelType: S.String,
  overrideOption: S.optional(S.String),
}) {}
export const ManagedNotificationChannelAssociations = S.Array(
  ManagedNotificationChannelAssociationSummary,
);
export class MemberAccount extends S.Class<MemberAccount>("MemberAccount")({
  notificationConfigurationArn: S.optional(S.String),
  accountId: S.String,
  status: S.String,
  statusReason: S.String,
  organizationalUnitId: S.String,
}) {}
export const MemberAccounts = S.Array(MemberAccount);
export class EventRuleStructure extends S.Class<EventRuleStructure>(
  "EventRuleStructure",
)({
  arn: S.String,
  notificationConfigurationArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  source: S.String,
  eventType: S.String,
  eventPattern: S.String,
  regions: Regions,
  managedRules: ManagedRuleArns,
  statusSummaryByRegion: StatusSummaryByRegion,
}) {}
export const EventRules = S.Array(EventRuleStructure);
export class ManagedNotificationConfigurationStructure extends S.Class<ManagedNotificationConfigurationStructure>(
  "ManagedNotificationConfigurationStructure",
)({ arn: S.String, name: S.String, description: S.String }) {}
export const ManagedNotificationConfigurations = S.Array(
  ManagedNotificationConfigurationStructure,
);
export class NotificationConfigurationStructure extends S.Class<NotificationConfigurationStructure>(
  "NotificationConfigurationStructure",
)({
  arn: S.String,
  name: S.String,
  description: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  aggregationDuration: S.optional(S.String),
  subtype: S.optional(S.String),
}) {}
export const NotificationConfigurations = S.Array(
  NotificationConfigurationStructure,
);
export class NotificationHubOverview extends S.Class<NotificationHubOverview>(
  "NotificationHubOverview",
)({
  notificationHubRegion: S.String,
  statusSummary: NotificationHubStatusSummary,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastActivationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const NotificationHubs = S.Array(NotificationHubOverview);
export const SampleAggregationDimensionValues = S.Array(S.String);
export class SummarizationDimensionOverview extends S.Class<SummarizationDimensionOverview>(
  "SummarizationDimensionOverview",
)({
  name: S.String,
  count: S.Number,
  sampleValues: S.optional(SampleAggregationDimensionValues),
}) {}
export const SummarizationDimensionOverviews = S.Array(
  SummarizationDimensionOverview,
);
export class ListManagedNotificationChannelAssociationsResponse extends S.Class<ListManagedNotificationChannelAssociationsResponse>(
  "ListManagedNotificationChannelAssociationsResponse",
)({
  nextToken: S.optional(S.String),
  channelAssociations: ManagedNotificationChannelAssociations,
}) {}
export class ListMemberAccountsResponse extends S.Class<ListMemberAccountsResponse>(
  "ListMemberAccountsResponse",
)({ memberAccounts: MemberAccounts, nextToken: S.optional(S.String) }) {}
export class ListEventRulesResponse extends S.Class<ListEventRulesResponse>(
  "ListEventRulesResponse",
)({ nextToken: S.optional(S.String), eventRules: EventRules }) {}
export class ListManagedNotificationConfigurationsResponse extends S.Class<ListManagedNotificationConfigurationsResponse>(
  "ListManagedNotificationConfigurationsResponse",
)({
  nextToken: S.optional(S.String),
  managedNotificationConfigurations: ManagedNotificationConfigurations,
}) {}
export class ListNotificationConfigurationsResponse extends S.Class<ListNotificationConfigurationsResponse>(
  "ListNotificationConfigurationsResponse",
)({
  nextToken: S.optional(S.String),
  notificationConfigurations: NotificationConfigurations,
}) {}
export class RegisterNotificationHubResponse extends S.Class<RegisterNotificationHubResponse>(
  "RegisterNotificationHubResponse",
)({
  notificationHubRegion: S.String,
  statusSummary: NotificationHubStatusSummary,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastActivationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ListNotificationHubsResponse extends S.Class<ListNotificationHubsResponse>(
  "ListNotificationHubsResponse",
)({ notificationHubs: NotificationHubs, nextToken: S.optional(S.String) }) {}
export class ManagedSourceEventMetadataSummary extends S.Class<ManagedSourceEventMetadataSummary>(
  "ManagedSourceEventMetadataSummary",
)({
  eventOriginRegion: S.optional(S.String),
  source: S.String,
  eventType: S.String,
}) {}
export class MessageComponentsSummary extends S.Class<MessageComponentsSummary>(
  "MessageComponentsSummary",
)({ headline: S.String }) {}
export class ManagedNotificationEventSummary extends S.Class<ManagedNotificationEventSummary>(
  "ManagedNotificationEventSummary",
)({
  schemaVersion: S.String,
  sourceEventMetadata: ManagedSourceEventMetadataSummary,
  messageComponents: MessageComponentsSummary,
  eventStatus: S.String,
  notificationType: S.String,
}) {}
export class MediaElement extends S.Class<MediaElement>("MediaElement")({
  mediaId: S.String,
  type: S.String,
  url: S.String,
  caption: S.String,
}) {}
export const Media = S.Array(MediaElement);
export const Tags = S.Array(S.String);
export class AggregationKey extends S.Class<AggregationKey>("AggregationKey")({
  name: S.String,
  value: S.String,
}) {}
export const AggregationKeys = S.Array(AggregationKey);
export class AggregationSummary extends S.Class<AggregationSummary>(
  "AggregationSummary",
)({
  eventCount: S.Number,
  aggregatedBy: AggregationKeys,
  aggregatedAccounts: SummarizationDimensionOverview,
  aggregatedRegions: SummarizationDimensionOverview,
  aggregatedOrganizationalUnits: S.optional(SummarizationDimensionOverview),
  additionalSummarizationDimensions: S.optional(
    SummarizationDimensionOverviews,
  ),
}) {}
export class ManagedNotificationEventOverview extends S.Class<ManagedNotificationEventOverview>(
  "ManagedNotificationEventOverview",
)({
  arn: S.String,
  managedNotificationConfigurationArn: S.String,
  relatedAccount: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  notificationEvent: ManagedNotificationEventSummary,
  aggregationEventType: S.optional(S.String),
  organizationalUnitId: S.optional(S.String),
  aggregationSummary: S.optional(AggregationSummary),
  aggregatedNotificationRegions: S.optional(AggregatedNotificationRegions),
}) {}
export const ManagedNotificationEvents = S.Array(
  ManagedNotificationEventOverview,
);
export class Dimension extends S.Class<Dimension>("Dimension")({
  name: S.String,
  value: S.String,
}) {}
export const Dimensions = S.Array(Dimension);
export class SummarizationDimensionDetail extends S.Class<SummarizationDimensionDetail>(
  "SummarizationDimensionDetail",
)({ name: S.String, value: S.String }) {}
export const SummarizationDimensionDetails = S.Array(
  SummarizationDimensionDetail,
);
export class Resource extends S.Class<Resource>("Resource")({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  detailUrl: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export const Resources = S.Array(Resource);
export class SourceEventMetadataSummary extends S.Class<SourceEventMetadataSummary>(
  "SourceEventMetadataSummary",
)({
  eventOriginRegion: S.optional(S.String),
  source: S.String,
  eventType: S.String,
}) {}
export class CreateEventRuleResponse extends S.Class<CreateEventRuleResponse>(
  "CreateEventRuleResponse",
)({
  arn: S.String,
  notificationConfigurationArn: S.String,
  statusSummaryByRegion: StatusSummaryByRegion,
}) {}
export class ListManagedNotificationEventsResponse extends S.Class<ListManagedNotificationEventsResponse>(
  "ListManagedNotificationEventsResponse",
)({
  nextToken: S.optional(S.String),
  managedNotificationEvents: ManagedNotificationEvents,
}) {}
export class MessageComponents extends S.Class<MessageComponents>(
  "MessageComponents",
)({
  headline: S.optional(S.String),
  paragraphSummary: S.optional(S.String),
  completeDescription: S.optional(S.String),
  dimensions: S.optional(Dimensions),
}) {}
export class AggregationDetail extends S.Class<AggregationDetail>(
  "AggregationDetail",
)({ summarizationDimensions: S.optional(SummarizationDimensionDetails) }) {}
export class ManagedNotificationChildEventSummary extends S.Class<ManagedNotificationChildEventSummary>(
  "ManagedNotificationChildEventSummary",
)({
  schemaVersion: S.String,
  sourceEventMetadata: ManagedSourceEventMetadataSummary,
  messageComponents: MessageComponentsSummary,
  aggregationDetail: AggregationDetail,
  eventStatus: S.String,
  notificationType: S.String,
}) {}
export class SourceEventMetadata extends S.Class<SourceEventMetadata>(
  "SourceEventMetadata",
)({
  eventTypeVersion: S.String,
  sourceEventId: S.String,
  eventOriginRegion: S.optional(S.String),
  relatedAccount: S.String,
  source: S.String,
  eventOccurrenceTime: S.Date.pipe(T.TimestampFormat("date-time")),
  eventType: S.String,
  relatedResources: Resources,
}) {}
export class NotificationEventSummary extends S.Class<NotificationEventSummary>(
  "NotificationEventSummary",
)({
  schemaVersion: S.String,
  sourceEventMetadata: SourceEventMetadataSummary,
  messageComponents: MessageComponentsSummary,
  eventStatus: S.String,
  notificationType: S.String,
}) {}
export const TextByLocale = S.Record({ key: S.String, value: S.String });
export class ManagedNotificationChildEventOverview extends S.Class<ManagedNotificationChildEventOverview>(
  "ManagedNotificationChildEventOverview",
)({
  arn: S.String,
  managedNotificationConfigurationArn: S.String,
  relatedAccount: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  childEvent: ManagedNotificationChildEventSummary,
  aggregateManagedNotificationEventArn: S.String,
  organizationalUnitId: S.optional(S.String),
}) {}
export const ManagedNotificationChildEvents = S.Array(
  ManagedNotificationChildEventOverview,
);
export class TextPartValue extends S.Class<TextPartValue>("TextPartValue")({
  type: S.String,
  displayText: S.optional(S.String),
  textByLocale: S.optional(TextByLocale),
  url: S.optional(S.String),
}) {}
export const TextParts = S.Record({ key: S.String, value: TextPartValue });
export class ManagedNotificationEvent extends S.Class<ManagedNotificationEvent>(
  "ManagedNotificationEvent",
)({
  schemaVersion: S.String,
  id: S.String,
  messageComponents: MessageComponents,
  sourceEventDetailUrl: S.optional(S.String),
  sourceEventDetailUrlDisplayText: S.optional(S.String),
  notificationType: S.String,
  eventStatus: S.optional(S.String),
  aggregationEventType: S.optional(S.String),
  aggregationSummary: S.optional(AggregationSummary),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  textParts: TextParts,
  organizationalUnitId: S.optional(S.String),
}) {}
export class NotificationEventSchema extends S.Class<NotificationEventSchema>(
  "NotificationEventSchema",
)({
  schemaVersion: S.String,
  id: S.String,
  sourceEventMetadata: SourceEventMetadata,
  messageComponents: MessageComponents,
  sourceEventDetailUrl: S.optional(S.String),
  sourceEventDetailUrlDisplayText: S.optional(S.String),
  notificationType: S.String,
  eventStatus: S.optional(S.String),
  aggregationEventType: S.optional(S.String),
  aggregateNotificationEventArn: S.optional(S.String),
  aggregationSummary: S.optional(AggregationSummary),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  textParts: TextParts,
  media: Media,
  organizationalUnitId: S.optional(S.String),
}) {}
export class NotificationEventOverview extends S.Class<NotificationEventOverview>(
  "NotificationEventOverview",
)({
  arn: S.String,
  notificationConfigurationArn: S.String,
  relatedAccount: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  notificationEvent: NotificationEventSummary,
  aggregationEventType: S.optional(S.String),
  aggregateNotificationEventArn: S.optional(S.String),
  aggregationSummary: S.optional(AggregationSummary),
  organizationalUnitId: S.optional(S.String),
}) {}
export const NotificationEvents = S.Array(NotificationEventOverview);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class ListManagedNotificationChildEventsResponse extends S.Class<ListManagedNotificationChildEventsResponse>(
  "ListManagedNotificationChildEventsResponse",
)({
  nextToken: S.optional(S.String),
  managedNotificationChildEvents: ManagedNotificationChildEvents,
}) {}
export class GetManagedNotificationEventResponse extends S.Class<GetManagedNotificationEventResponse>(
  "GetManagedNotificationEventResponse",
)({
  arn: S.String,
  managedNotificationConfigurationArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  content: ManagedNotificationEvent,
}) {}
export class GetNotificationEventResponse extends S.Class<GetNotificationEventResponse>(
  "GetNotificationEventResponse",
)({
  arn: S.String,
  notificationConfigurationArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  content: NotificationEventSchema,
}) {}
export class ListNotificationEventsResponse extends S.Class<ListNotificationEventsResponse>(
  "ListNotificationEventsResponse",
)({
  nextToken: S.optional(S.String),
  notificationEvents: NotificationEvents,
}) {}
export class ManagedNotificationChildEvent extends S.Class<ManagedNotificationChildEvent>(
  "ManagedNotificationChildEvent",
)({
  schemaVersion: S.String,
  id: S.String,
  messageComponents: MessageComponents,
  sourceEventDetailUrl: S.optional(S.String),
  sourceEventDetailUrlDisplayText: S.optional(S.String),
  notificationType: S.String,
  eventStatus: S.optional(S.String),
  aggregateManagedNotificationEventArn: S.String,
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  textParts: TextParts,
  organizationalUnitId: S.optional(S.String),
  aggregationDetail: S.optional(AggregationDetail),
}) {}
export class GetManagedNotificationChildEventResponse extends S.Class<GetManagedNotificationChildEventResponse>(
  "GetManagedNotificationChildEventResponse",
)({
  arn: S.String,
  managedNotificationConfigurationArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  content: ManagedNotificationChildEvent,
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceType: S.String,
    resourceId: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Returns the AccessStatus of Service Trust Enablement for User Notifications and Amazon Web Services Organizations.
 */
export const getNotificationsAccessForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetNotificationsAccessForOrganizationRequest,
    output: GetNotificationsAccessForOrganizationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of organizational units associated with a notification configuration.
 */
export const listOrganizationalUnits =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListOrganizationalUnitsRequest,
    output: ListOrganizationalUnitsResponse,
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
      items: "organizationalUnits",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Associates an organizational unit with a notification configuration.
 */
export const associateOrganizationalUnit = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateOrganizationalUnitRequest,
    output: AssociateOrganizationalUnitResponse,
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
 * Disables service trust between User Notifications and Amazon Web Services Organizations.
 */
export const disableNotificationsAccessForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableNotificationsAccessForOrganizationRequest,
    output: DisableNotificationsAccessForOrganizationResponse,
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
 * Associates a delivery Channel with a particular `NotificationConfiguration`. Supported Channels include Amazon Q Developer in chat applications, the Console Mobile Application, and emails (notifications-contacts).
 */
export const associateChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateChannelRequest,
  output: AssociateChannelResponse,
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
 * Deletes an `EventRule`.
 */
export const deleteEventRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventRuleRequest,
  output: DeleteEventRuleResponse,
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
 * Associates an Account Contact with a particular `ManagedNotificationConfiguration`.
 */
export const associateManagedNotificationAccountContact =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateManagedNotificationAccountContactRequest,
    output: AssociateManagedNotificationAccountContactResponse,
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
 * Disassociates an Account Contact with a particular `ManagedNotificationConfiguration`.
 */
export const disassociateManagedNotificationAccountContact =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateManagedNotificationAccountContactRequest,
    output: DisassociateManagedNotificationAccountContactResponse,
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
 * Associates an additional Channel with a particular `ManagedNotificationConfiguration`.
 *
 * Supported Channels include Amazon Q Developer in chat applications, the Console Mobile Application, and emails (notifications-contacts).
 */
export const associateManagedNotificationAdditionalChannel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateManagedNotificationAdditionalChannelRequest,
    output: AssociateManagedNotificationAdditionalChannelResponse,
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
 * Deletes a `NotificationConfiguration`.
 */
export const deleteNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteNotificationConfigurationRequest,
    output: DeleteNotificationConfigurationResponse,
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
 * Updates an existing `EventRule`.
 */
export const updateEventRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventRuleRequest,
  output: UpdateEventRuleResponse,
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
 * Updates a `NotificationConfiguration`.
 */
export const updateNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateNotificationConfigurationRequest,
    output: UpdateNotificationConfigurationResponse,
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
 * Deregisters a `NotificationConfiguration` in the specified Region.
 *
 * You can't deregister the last `NotificationHub` in the account. `NotificationEvents` stored in the deregistered `NotificationConfiguration` are no longer be visible. Recreating a new `NotificationConfiguration` in the same Region restores access to those `NotificationEvents`.
 */
export const deregisterNotificationHub = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterNotificationHubRequest,
    output: DeregisterNotificationHubResponse,
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
 * Untags a resource with a specified Amazon Resource Name (ARN).
 *
 * For more information, see Tagging your Amazon Web Services resources in the *Tagging Amazon Web Services Resources User Guide*.
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
 * Disassociates a Channel from a specified `NotificationConfiguration`. Supported Channels include Amazon Q Developer in chat applications, the Console Mobile Application, and emails (notifications-contacts).
 */
export const disassociateChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateChannelRequest,
  output: DisassociateChannelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates an additional Channel from a particular `ManagedNotificationConfiguration`.
 *
 * Supported Channels include Amazon Q Developer in chat applications, the Console Mobile Application, and emails (notifications-contacts).
 */
export const disassociateManagedNotificationAdditionalChannel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateManagedNotificationAdditionalChannelRequest,
    output: DisassociateManagedNotificationAdditionalChannelResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of tags for a specified Amazon Resource Name (ARN).
 *
 * For more information, see Tagging your Amazon Web Services resources in the *Tagging Amazon Web Services Resources User Guide*.
 *
 * This is only supported for `NotificationConfigurations`.
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
 * Tags the resource with a tag key and value.
 *
 * For more information, see Tagging your Amazon Web Services resources in the *Tagging Amazon Web Services Resources User Guide*.
 *
 * This is only supported for `NotificationConfigurations`.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of Channels for a `NotificationConfiguration`.
 */
export const listChannels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListChannelsRequest,
    output: ListChannelsResponse,
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
      items: "channels",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a specified `EventRule`.
 */
export const getEventRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventRuleRequest,
  output: GetEventRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a specified `ManagedNotificationConfiguration`.
 */
export const getManagedNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetManagedNotificationConfigurationRequest,
    output: GetManagedNotificationConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a specified `NotificationConfiguration`.
 */
export const getNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetNotificationConfigurationRequest,
    output: GetNotificationConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Enables service trust between User Notifications and Amazon Web Services Organizations.
 */
export const enableNotificationsAccessForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableNotificationsAccessForOrganizationRequest,
    output: EnableNotificationsAccessForOrganizationResponse,
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
 * Returns a list of Account contacts and Channels associated with a `ManagedNotificationConfiguration`, in paginated format.
 */
export const listManagedNotificationChannelAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListManagedNotificationChannelAssociationsRequest,
    output: ListManagedNotificationChannelAssociationsResponse,
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
      items: "channelAssociations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of member accounts associated with a notification configuration.
 */
export const listMemberAccounts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMemberAccountsRequest,
    output: ListMemberAccountsResponse,
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
      items: "memberAccounts",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of `EventRules` according to specified filters, in reverse chronological order (newest first).
 */
export const listEventRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEventRulesRequest,
    output: ListEventRulesResponse,
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
      items: "eventRules",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Registers a `NotificationConfiguration` in the specified Region.
 *
 * There is a maximum of one `NotificationConfiguration` per Region. You can have a maximum of 3 `NotificationHub` resources at a time.
 */
export const registerNotificationHub = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterNotificationHubRequest,
    output: RegisterNotificationHubResponse,
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
 * Returns a list of Managed Notification Configurations according to specified filters, ordered by creation time in reverse chronological order (newest first).
 */
export const listManagedNotificationConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListManagedNotificationConfigurationsRequest,
    output: ListManagedNotificationConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "managedNotificationConfigurations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of abbreviated `NotificationConfigurations` according to specified filters, in reverse chronological order (newest first).
 */
export const listNotificationConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListNotificationConfigurationsRequest,
    output: ListNotificationConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "notificationConfigurations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of `NotificationHubs`.
 */
export const listNotificationHubs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListNotificationHubsRequest,
    output: ListNotificationHubsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "notificationHubs",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Removes the association between an organizational unit and a notification configuration.
 */
export const disassociateOrganizationalUnit =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateOrganizationalUnitRequest,
    output: DisassociateOrganizationalUnitResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a new `NotificationConfiguration`.
 */
export const createNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateNotificationConfigurationRequest,
    output: CreateNotificationConfigurationResponse,
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
 * Creates an `EventRule` that is associated with a specified `NotificationConfiguration`.
 */
export const createEventRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventRuleRequest,
  output: CreateEventRuleResponse,
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
 * Returns a list of Managed Notification Events according to specified filters, ordered by creation time in reverse chronological order (newest first).
 */
export const listManagedNotificationEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListManagedNotificationEventsRequest,
    output: ListManagedNotificationEventsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "managedNotificationEvents",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of `ManagedNotificationChildEvents` for a specified aggregate `ManagedNotificationEvent`, ordered by creation time in reverse chronological order (newest first).
 */
export const listManagedNotificationChildEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListManagedNotificationChildEventsRequest,
    output: ListManagedNotificationChildEventsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "managedNotificationChildEvents",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a specified `ManagedNotificationEvent`.
 */
export const getManagedNotificationEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetManagedNotificationEventRequest,
    output: GetManagedNotificationEventResponse,
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
 * Returns a specified `NotificationEvent`.
 *
 * User Notifications stores notifications in the individual Regions you register as notification hubs and the Region of the source event rule. `GetNotificationEvent` only returns notifications stored in the same Region in which the action is called. User Notifications doesn't backfill notifications to new Regions selected as notification hubs. For this reason, we recommend that you make calls in your oldest registered notification hub. For more information, see Notification hubs in the *Amazon Web Services User Notifications User Guide*.
 */
export const getNotificationEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetNotificationEventRequest,
    output: GetNotificationEventResponse,
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
 * Returns a list of `NotificationEvents` according to specified filters, in reverse chronological order (newest first).
 *
 * User Notifications stores notifications in the individual Regions you register as notification hubs and the Region of the source event rule. ListNotificationEvents only returns notifications stored in the same Region in which the action is called. User Notifications doesn't backfill notifications to new Regions selected as notification hubs. For this reason, we recommend that you make calls in your oldest registered notification hub. For more information, see Notification hubs in the *Amazon Web Services User Notifications User Guide*.
 */
export const listNotificationEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListNotificationEventsRequest,
    output: ListNotificationEventsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "notificationEvents",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns the child event of a specific given `ManagedNotificationEvent`.
 */
export const getManagedNotificationChildEvent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetManagedNotificationChildEventRequest,
    output: GetManagedNotificationChildEventResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));

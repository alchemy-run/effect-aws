/**
 * Cloudflare ALERTING API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service alerting
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// AvailableAlert
// =============================================================================

export interface ListAvailableAlertsRequest {
  /** The account id */
  accountId: string;
}

export const ListAvailableAlertsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/alerting/v3/available_alerts" }),
) as unknown as Schema.Schema<ListAvailableAlertsRequest>;

export type ListAvailableAlertsResponse = Record<string, unknown>;

export const ListAvailableAlertsResponse = Schema.Struct(
  {},
) as unknown as Schema.Schema<ListAvailableAlertsResponse>;

export const listAvailableAlerts = API.make(() => ({
  input: ListAvailableAlertsRequest,
  output: ListAvailableAlertsResponse,
  errors: [],
}));

// =============================================================================
// DestinationEligible
// =============================================================================

export interface GetDestinationEligibleRequest {
  /** The account id */
  accountId: string;
}

export const GetDestinationEligibleRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/alerting/v3/destinations/eligible" }),
) as unknown as Schema.Schema<GetDestinationEligibleRequest>;

export type GetDestinationEligibleResponse = Record<string, unknown>;

export const GetDestinationEligibleResponse = Schema.Struct(
  {},
) as unknown as Schema.Schema<GetDestinationEligibleResponse>;

export const getDestinationEligible = API.make(() => ({
  input: GetDestinationEligibleRequest,
  output: GetDestinationEligibleResponse,
  errors: [],
}));

// =============================================================================
// DestinationPagerduty
// =============================================================================

export interface CreateDestinationPagerdutyRequest {
  /** The account id */
  accountId: string;
}

export const CreateDestinationPagerdutyRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/alerting/v3/destinations/pagerduty/connect",
  }),
) as unknown as Schema.Schema<CreateDestinationPagerdutyRequest>;

export interface CreateDestinationPagerdutyResponse {
  /** token in form of UUID */
  id?: string;
}

export const CreateDestinationPagerdutyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateDestinationPagerdutyResponse>;

export const createDestinationPagerduty = API.make(() => ({
  input: CreateDestinationPagerdutyRequest,
  output: CreateDestinationPagerdutyResponse,
  errors: [],
}));

export interface DeleteDestinationPagerdutyRequest {
  /** The account id */
  accountId: string;
}

export const DeleteDestinationPagerdutyRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/alerting/v3/destinations/pagerduty" }),
) as unknown as Schema.Schema<DeleteDestinationPagerdutyRequest>;

export interface DeleteDestinationPagerdutyResponse {
  errors: { message: string; code?: number }[];
  messages: { message: string; code?: number }[];
  /** Whether the API call was successful */
  success: true;
}

export const DeleteDestinationPagerdutyResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      message: Schema.String,
      code: Schema.optional(Schema.Number),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      message: Schema.String,
      code: Schema.optional(Schema.Number),
    }),
  ),
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<DeleteDestinationPagerdutyResponse>;

export const deleteDestinationPagerduty = API.make(() => ({
  input: DeleteDestinationPagerdutyRequest,
  output: DeleteDestinationPagerdutyResponse,
  errors: [],
}));

export interface LinkDestinationPagerdutyRequest {
  tokenId: string;
  /** The account id */
  accountId: string;
}

export const LinkDestinationPagerdutyRequest = Schema.Struct({
  tokenId: Schema.String.pipe(T.HttpPath("tokenId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/alerting/v3/destinations/pagerduty/connect/{tokenId}",
  }),
) as unknown as Schema.Schema<LinkDestinationPagerdutyRequest>;

export interface LinkDestinationPagerdutyResponse {
  /** UUID */
  id?: string;
}

export const LinkDestinationPagerdutyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<LinkDestinationPagerdutyResponse>;

export const linkDestinationPagerduty = API.make(() => ({
  input: LinkDestinationPagerdutyRequest,
  output: LinkDestinationPagerdutyResponse,
  errors: [],
}));

// =============================================================================
// DestinationWebhook
// =============================================================================

export interface GetDestinationWebhookRequest {
  webhookId: string;
  /** The account id */
  accountId: string;
}

export const GetDestinationWebhookRequest = Schema.Struct({
  webhookId: Schema.String.pipe(T.HttpPath("webhookId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/alerting/v3/destinations/webhooks/{webhookId}",
  }),
) as unknown as Schema.Schema<GetDestinationWebhookRequest>;

export interface GetDestinationWebhookResponse {
  /** The unique identifier of a webhook */
  id?: string;
  /** Timestamp of when the webhook destination was created. */
  createdAt?: string;
  /** Timestamp of the last time an attempt to dispatch a notification to this webhook failed. */
  lastFailure?: string;
  /** Timestamp of the last time Cloudflare was able to successfully dispatch a notification using this webhook. */
  lastSuccess?: string;
  /** The name of the webhook destination. This will be included in the request body when you receive a webhook notification. */
  name?: string;
  /** Type of webhook endpoint. */
  type?: "datadog" | "discord" | "feishu" | "gchat" | "generic" | "opsgenie" | "slack" | "splunk";
  /** The POST endpoint to call when dispatching a notification. */
  url?: string;
}

export const GetDestinationWebhookResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  lastFailure: Schema.optional(Schema.String).pipe(T.JsonName("last_failure")),
  lastSuccess: Schema.optional(Schema.String).pipe(T.JsonName("last_success")),
  name: Schema.optional(Schema.String),
  type: Schema.optional(
    Schema.Literal(
      "datadog",
      "discord",
      "feishu",
      "gchat",
      "generic",
      "opsgenie",
      "slack",
      "splunk",
    ),
  ),
  url: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetDestinationWebhookResponse>;

export const getDestinationWebhook = API.make(() => ({
  input: GetDestinationWebhookRequest,
  output: GetDestinationWebhookResponse,
  errors: [],
}));

export interface CreateDestinationWebhookRequest {
  /** Path param: The account id */
  accountId: string;
  /** Body param: The name of the webhook destination. This will be included in the request body when you receive a webhook notification. */
  name: string;
  /** Body param: The POST endpoint to call when dispatching a notification. */
  url: string;
  /** Body param: Optional secret that will be passed in the `cf-webhook-auth` header when dispatching generic webhook notifications or formatted for supported destinations. Secrets are not returned in any  */
  secret?: string;
}

export const CreateDestinationWebhookRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  url: Schema.String,
  secret: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/alerting/v3/destinations/webhooks" }),
) as unknown as Schema.Schema<CreateDestinationWebhookRequest>;

export interface CreateDestinationWebhookResponse {
  /** UUID */
  id?: string;
}

export const CreateDestinationWebhookResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateDestinationWebhookResponse>;

export const createDestinationWebhook = API.make(() => ({
  input: CreateDestinationWebhookRequest,
  output: CreateDestinationWebhookResponse,
  errors: [],
}));

export interface UpdateDestinationWebhookRequest {
  webhookId: string;
  /** Path param: The account id */
  accountId: string;
  /** Body param: The name of the webhook destination. This will be included in the request body when you receive a webhook notification. */
  name: string;
  /** Body param: The POST endpoint to call when dispatching a notification. */
  url: string;
  /** Body param: Optional secret that will be passed in the `cf-webhook-auth` header when dispatching generic webhook notifications or formatted for supported destinations. Secrets are not returned in any  */
  secret?: string;
}

export const UpdateDestinationWebhookRequest = Schema.Struct({
  webhookId: Schema.String.pipe(T.HttpPath("webhookId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  url: Schema.String,
  secret: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/alerting/v3/destinations/webhooks/{webhookId}",
  }),
) as unknown as Schema.Schema<UpdateDestinationWebhookRequest>;

export interface UpdateDestinationWebhookResponse {
  /** UUID */
  id?: string;
}

export const UpdateDestinationWebhookResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateDestinationWebhookResponse>;

export const updateDestinationWebhook = API.make(() => ({
  input: UpdateDestinationWebhookRequest,
  output: UpdateDestinationWebhookResponse,
  errors: [],
}));

export interface DeleteDestinationWebhookRequest {
  webhookId: string;
  /** The account id */
  accountId: string;
}

export const DeleteDestinationWebhookRequest = Schema.Struct({
  webhookId: Schema.String.pipe(T.HttpPath("webhookId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/alerting/v3/destinations/webhooks/{webhookId}",
  }),
) as unknown as Schema.Schema<DeleteDestinationWebhookRequest>;

export interface DeleteDestinationWebhookResponse {
  errors: { message: string; code?: number }[];
  messages: { message: string; code?: number }[];
  /** Whether the API call was successful */
  success: true;
}

export const DeleteDestinationWebhookResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      message: Schema.String,
      code: Schema.optional(Schema.Number),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      message: Schema.String,
      code: Schema.optional(Schema.Number),
    }),
  ),
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<DeleteDestinationWebhookResponse>;

export const deleteDestinationWebhook = API.make(() => ({
  input: DeleteDestinationWebhookRequest,
  output: DeleteDestinationWebhookResponse,
  errors: [],
}));

// =============================================================================
// Policy
// =============================================================================

export interface GetPolicyRequest {
  policyId: string;
  /** The account id */
  accountId: string;
}

export const GetPolicyRequest = Schema.Struct({
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/alerting/v3/policies/{policyId}" }),
) as unknown as Schema.Schema<GetPolicyRequest>;

export interface GetPolicyResponse {
  /** The unique identifier of a notification policy */
  id?: string;
  /** Optional specification of how often to re-alert from the same incident, not support on all alert types. */
  alertInterval?: string;
  /** Refers to which event will trigger a Notification dispatch. You can use the endpoint to get available alert types which then will give you a list of possible values. */
  alertType?:
    | "access_custom_certificate_expiration_type"
    | "advanced_ddos_attack_l4_alert"
    | "advanced_ddos_attack_l7_alert"
    | "advanced_http_alert_error"
    | "bgp_hijack_notification"
    | "billing_usage_alert"
    | "block_notification_block_removed"
    | "block_notification_new_block"
    | "block_notification_review_rejected"
    | "bot_traffic_basic_alert"
    | "brand_protection_alert"
    | "brand_protection_digest"
    | "clickhouse_alert_fw_anomaly"
    | "clickhouse_alert_fw_ent_anomaly"
    | "cloudforce_one_request_notification"
    | "custom_analytics"
    | "custom_bot_detection_alert"
    | "custom_ssl_certificate_event_type"
    | "dedicated_ssl_certificate_event_type"
    | "device_connectivity_anomaly_alert"
    | "dos_attack_l4"
    | "dos_attack_l7"
    | "expiring_service_token_alert"
    | "failing_logpush_job_disabled_alert"
    | "fbm_auto_advertisement"
    | "fbm_dosd_attack"
    | "fbm_volumetric_attack"
    | "health_check_status_notification"
    | "hostname_aop_custom_certificate_expiration_type"
    | "http_alert_edge_error"
    | "http_alert_origin_error"
    | "image_notification"
    | "image_resizing_notification"
    | "incident_alert"
    | "load_balancing_health_alert"
    | "load_balancing_pool_enablement_alert"
    | "logo_match_alert"
    | "magic_tunnel_health_check_event"
    | "magic_wan_tunnel_health"
    | "maintenance_event_notification"
    | "mtls_certificate_store_certificate_expiration_type"
    | "pages_event_alert"
    | "radar_notification"
    | "real_origin_monitoring"
    | "scriptmonitor_alert_new_code_change_detections"
    | "scriptmonitor_alert_new_hosts"
    | "scriptmonitor_alert_new_malicious_hosts"
    | "scriptmonitor_alert_new_malicious_scripts"
    | "scriptmonitor_alert_new_malicious_url"
    | "scriptmonitor_alert_new_max_length_resource_url"
    | "scriptmonitor_alert_new_resources"
    | "secondary_dns_all_primaries_failing"
    | "secondary_dns_primaries_failing"
    | "secondary_dns_warning"
    | "secondary_dns_zone_successfully_updated"
    | "secondary_dns_zone_validation_warning"
    | "security_insights_alert"
    | "sentinel_alert"
    | "stream_live_notifications"
    | "synthetic_test_latency_alert"
    | "synthetic_test_low_availability_alert"
    | "traffic_anomalies_alert"
    | "tunnel_health_event"
    | "tunnel_update_event"
    | "universal_ssl_event_type"
    | "web_analytics_metrics_update"
    | "zone_aop_custom_certificate_expiration_type";
  created?: string;
  /** Optional description for the Notification policy. */
  description?: string;
  /** Whether or not the Notification policy is enabled. */
  enabled?: boolean;
  /** Optional filters that allow you to be alerted only on a subset of events for that alert type based on some criteria. This is only available for select alert types. See alert type documentation for mor */
  filters?: {
    actions?: string[];
    affectedAsns?: string[];
    affectedComponents?: string[];
    affectedLocations?: string[];
    airportCode?: string[];
    alertTriggerPreferences?: string[];
    alertTriggerPreferencesValue?: string[];
    enabled?: string[];
    environment?: string[];
    event?: string[];
    eventSource?: string[];
    eventType?: string[];
    groupBy?: string[];
    healthCheckId?: string[];
    incidentImpact?: (
      | "INCIDENT_IMPACT_NONE"
      | "INCIDENT_IMPACT_MINOR"
      | "INCIDENT_IMPACT_MAJOR"
      | "INCIDENT_IMPACT_CRITICAL"
    )[];
    inputId?: string[];
    insightClass?: string[];
    limit?: string[];
    logoTag?: string[];
    megabitsPerSecond?: string[];
    newHealth?: string[];
    newStatus?: string[];
    packetsPerSecond?: string[];
    poolId?: string[];
    popNames?: string[];
    product?: string[];
    projectId?: string[];
    protocol?: string[];
    queryTag?: string[];
    requestsPerSecond?: string[];
    selectors?: string[];
    services?: string[];
    slo?: string[];
    status?: string[];
    targetHostname?: string[];
    targetIp?: string[];
    targetZoneName?: string[];
    trafficExclusions?: "security_events"[];
    tunnelId?: string[];
    tunnelName?: string[];
    where?: string[];
    zones?: string[];
  };
  /** List of IDs that will be used when dispatching a notification. IDs for email type will be the email address. */
  mechanisms?: {
    email?: { id?: string }[];
    pagerduty?: { id?: string }[];
    webhooks?: { id?: string }[];
  };
  modified?: string;
  /** Name of the policy. */
  name?: string;
}

export const GetPolicyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  alertInterval: Schema.optional(Schema.String).pipe(T.JsonName("alert_interval")),
  alertType: Schema.optional(
    Schema.Literal(
      "access_custom_certificate_expiration_type",
      "advanced_ddos_attack_l4_alert",
      "advanced_ddos_attack_l7_alert",
      "advanced_http_alert_error",
      "bgp_hijack_notification",
      "billing_usage_alert",
      "block_notification_block_removed",
      "block_notification_new_block",
      "block_notification_review_rejected",
      "bot_traffic_basic_alert",
      "brand_protection_alert",
      "brand_protection_digest",
      "clickhouse_alert_fw_anomaly",
      "clickhouse_alert_fw_ent_anomaly",
      "cloudforce_one_request_notification",
      "custom_analytics",
      "custom_bot_detection_alert",
      "custom_ssl_certificate_event_type",
      "dedicated_ssl_certificate_event_type",
      "device_connectivity_anomaly_alert",
      "dos_attack_l4",
      "dos_attack_l7",
      "expiring_service_token_alert",
      "failing_logpush_job_disabled_alert",
      "fbm_auto_advertisement",
      "fbm_dosd_attack",
      "fbm_volumetric_attack",
      "health_check_status_notification",
      "hostname_aop_custom_certificate_expiration_type",
      "http_alert_edge_error",
      "http_alert_origin_error",
      "image_notification",
      "image_resizing_notification",
      "incident_alert",
      "load_balancing_health_alert",
      "load_balancing_pool_enablement_alert",
      "logo_match_alert",
      "magic_tunnel_health_check_event",
      "magic_wan_tunnel_health",
      "maintenance_event_notification",
      "mtls_certificate_store_certificate_expiration_type",
      "pages_event_alert",
      "radar_notification",
      "real_origin_monitoring",
      "scriptmonitor_alert_new_code_change_detections",
      "scriptmonitor_alert_new_hosts",
      "scriptmonitor_alert_new_malicious_hosts",
      "scriptmonitor_alert_new_malicious_scripts",
      "scriptmonitor_alert_new_malicious_url",
      "scriptmonitor_alert_new_max_length_resource_url",
      "scriptmonitor_alert_new_resources",
      "secondary_dns_all_primaries_failing",
      "secondary_dns_primaries_failing",
      "secondary_dns_warning",
      "secondary_dns_zone_successfully_updated",
      "secondary_dns_zone_validation_warning",
      "security_insights_alert",
      "sentinel_alert",
      "stream_live_notifications",
      "synthetic_test_latency_alert",
      "synthetic_test_low_availability_alert",
      "traffic_anomalies_alert",
      "tunnel_health_event",
      "tunnel_update_event",
      "universal_ssl_event_type",
      "web_analytics_metrics_update",
      "zone_aop_custom_certificate_expiration_type",
    ),
  ).pipe(T.JsonName("alert_type")),
  created: Schema.optional(Schema.String),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  filters: Schema.optional(
    Schema.Struct({
      actions: Schema.optional(Schema.Array(Schema.String)),
      affectedAsns: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("affected_asns")),
      affectedComponents: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("affected_components"),
      ),
      affectedLocations: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("affected_locations"),
      ),
      airportCode: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("airport_code")),
      alertTriggerPreferences: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("alert_trigger_preferences"),
      ),
      alertTriggerPreferencesValue: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("alert_trigger_preferences_value"),
      ),
      enabled: Schema.optional(Schema.Array(Schema.String)),
      environment: Schema.optional(Schema.Array(Schema.String)),
      event: Schema.optional(Schema.Array(Schema.String)),
      eventSource: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("event_source")),
      eventType: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("event_type")),
      groupBy: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("group_by")),
      healthCheckId: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("health_check_id"),
      ),
      incidentImpact: Schema.optional(
        Schema.Array(
          Schema.Literal(
            "INCIDENT_IMPACT_NONE",
            "INCIDENT_IMPACT_MINOR",
            "INCIDENT_IMPACT_MAJOR",
            "INCIDENT_IMPACT_CRITICAL",
          ),
        ),
      ).pipe(T.JsonName("incident_impact")),
      inputId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("input_id")),
      insightClass: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("insight_class")),
      limit: Schema.optional(Schema.Array(Schema.String)),
      logoTag: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("logo_tag")),
      megabitsPerSecond: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("megabits_per_second"),
      ),
      newHealth: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("new_health")),
      newStatus: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("new_status")),
      packetsPerSecond: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("packets_per_second"),
      ),
      poolId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("pool_id")),
      popNames: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("pop_names")),
      product: Schema.optional(Schema.Array(Schema.String)),
      projectId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("project_id")),
      protocol: Schema.optional(Schema.Array(Schema.String)),
      queryTag: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("query_tag")),
      requestsPerSecond: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("requests_per_second"),
      ),
      selectors: Schema.optional(Schema.Array(Schema.String)),
      services: Schema.optional(Schema.Array(Schema.String)),
      slo: Schema.optional(Schema.Array(Schema.String)),
      status: Schema.optional(Schema.Array(Schema.String)),
      targetHostname: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("target_hostname"),
      ),
      targetIp: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("target_ip")),
      targetZoneName: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("target_zone_name"),
      ),
      trafficExclusions: Schema.optional(Schema.Array(Schema.Literal("security_events"))).pipe(
        T.JsonName("traffic_exclusions"),
      ),
      tunnelId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("tunnel_id")),
      tunnelName: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("tunnel_name")),
      where: Schema.optional(Schema.Array(Schema.String)),
      zones: Schema.optional(Schema.Array(Schema.String)),
    }),
  ),
  mechanisms: Schema.optional(
    Schema.Struct({
      email: Schema.optional(
        Schema.Array(
          Schema.Struct({
            id: Schema.optional(Schema.String),
          }),
        ),
      ),
      pagerduty: Schema.optional(
        Schema.Array(
          Schema.Struct({
            id: Schema.optional(Schema.String),
          }),
        ),
      ),
      webhooks: Schema.optional(
        Schema.Array(
          Schema.Struct({
            id: Schema.optional(Schema.String),
          }),
        ),
      ),
    }),
  ),
  modified: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetPolicyResponse>;

export const getPolicy = API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [],
}));

export interface CreatePolicyRequest {
  /** Path param: The account id */
  accountId: string;
  /** Body param: Refers to which event will trigger a Notification dispatch. You can use the endpoint to get available alert types which then will give you a list of possible values. */
  alertType:
    | "access_custom_certificate_expiration_type"
    | "advanced_ddos_attack_l4_alert"
    | "advanced_ddos_attack_l7_alert"
    | "advanced_http_alert_error"
    | "bgp_hijack_notification"
    | "billing_usage_alert"
    | "block_notification_block_removed"
    | "block_notification_new_block"
    | "block_notification_review_rejected"
    | "bot_traffic_basic_alert"
    | "brand_protection_alert"
    | "brand_protection_digest"
    | "clickhouse_alert_fw_anomaly"
    | "clickhouse_alert_fw_ent_anomaly"
    | "cloudforce_one_request_notification"
    | "custom_analytics"
    | "custom_bot_detection_alert"
    | "custom_ssl_certificate_event_type"
    | "dedicated_ssl_certificate_event_type"
    | "device_connectivity_anomaly_alert"
    | "dos_attack_l4"
    | "dos_attack_l7"
    | "expiring_service_token_alert"
    | "failing_logpush_job_disabled_alert"
    | "fbm_auto_advertisement"
    | "fbm_dosd_attack"
    | "fbm_volumetric_attack"
    | "health_check_status_notification"
    | "hostname_aop_custom_certificate_expiration_type"
    | "http_alert_edge_error"
    | "http_alert_origin_error"
    | "image_notification"
    | "image_resizing_notification"
    | "incident_alert"
    | "load_balancing_health_alert"
    | "load_balancing_pool_enablement_alert"
    | "logo_match_alert"
    | "magic_tunnel_health_check_event"
    | "magic_wan_tunnel_health"
    | "maintenance_event_notification"
    | "mtls_certificate_store_certificate_expiration_type"
    | "pages_event_alert"
    | "radar_notification"
    | "real_origin_monitoring"
    | "scriptmonitor_alert_new_code_change_detections"
    | "scriptmonitor_alert_new_hosts"
    | "scriptmonitor_alert_new_malicious_hosts"
    | "scriptmonitor_alert_new_malicious_scripts"
    | "scriptmonitor_alert_new_malicious_url"
    | "scriptmonitor_alert_new_max_length_resource_url"
    | "scriptmonitor_alert_new_resources"
    | "secondary_dns_all_primaries_failing"
    | "secondary_dns_primaries_failing"
    | "secondary_dns_warning"
    | "secondary_dns_zone_successfully_updated"
    | "secondary_dns_zone_validation_warning"
    | "security_insights_alert"
    | "sentinel_alert"
    | "stream_live_notifications"
    | "synthetic_test_latency_alert"
    | "synthetic_test_low_availability_alert"
    | "traffic_anomalies_alert"
    | "tunnel_health_event"
    | "tunnel_update_event"
    | "universal_ssl_event_type"
    | "web_analytics_metrics_update"
    | "zone_aop_custom_certificate_expiration_type";
  /** Body param: Whether or not the Notification policy is enabled. */
  enabled: boolean;
  /** Body param: List of IDs that will be used when dispatching a notification. IDs for email type will be the email address. */
  mechanisms: {
    email?: { id?: string }[];
    pagerduty?: { id?: string }[];
    webhooks?: { id?: string }[];
  };
  /** Body param: Name of the policy. */
  name: string;
  /** Body param: Optional specification of how often to re-alert from the same incident, not support on all alert types. */
  alertInterval?: string;
  /** Body param: Optional description for the Notification policy. */
  description?: string;
  /** Body param: Optional filters that allow you to be alerted only on a subset of events for that alert type based on some criteria. This is only available for select alert types. See alert type documenta */
  filters?: {
    actions?: string[];
    affectedAsns?: string[];
    affectedComponents?: string[];
    affectedLocations?: string[];
    airportCode?: string[];
    alertTriggerPreferences?: string[];
    alertTriggerPreferencesValue?: string[];
    enabled?: string[];
    environment?: string[];
    event?: string[];
    eventSource?: string[];
    eventType?: string[];
    groupBy?: string[];
    healthCheckId?: string[];
    incidentImpact?: (
      | "INCIDENT_IMPACT_NONE"
      | "INCIDENT_IMPACT_MINOR"
      | "INCIDENT_IMPACT_MAJOR"
      | "INCIDENT_IMPACT_CRITICAL"
    )[];
    inputId?: string[];
    insightClass?: string[];
    limit?: string[];
    logoTag?: string[];
    megabitsPerSecond?: string[];
    newHealth?: string[];
    newStatus?: string[];
    packetsPerSecond?: string[];
    poolId?: string[];
    popNames?: string[];
    product?: string[];
    projectId?: string[];
    protocol?: string[];
    queryTag?: string[];
    requestsPerSecond?: string[];
    selectors?: string[];
    services?: string[];
    slo?: string[];
    status?: string[];
    targetHostname?: string[];
    targetIp?: string[];
    targetZoneName?: string[];
    trafficExclusions?: "security_events"[];
    tunnelId?: string[];
    tunnelName?: string[];
    where?: string[];
    zones?: string[];
  };
}

export const CreatePolicyRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  alertType: Schema.Literal(
    "access_custom_certificate_expiration_type",
    "advanced_ddos_attack_l4_alert",
    "advanced_ddos_attack_l7_alert",
    "advanced_http_alert_error",
    "bgp_hijack_notification",
    "billing_usage_alert",
    "block_notification_block_removed",
    "block_notification_new_block",
    "block_notification_review_rejected",
    "bot_traffic_basic_alert",
    "brand_protection_alert",
    "brand_protection_digest",
    "clickhouse_alert_fw_anomaly",
    "clickhouse_alert_fw_ent_anomaly",
    "cloudforce_one_request_notification",
    "custom_analytics",
    "custom_bot_detection_alert",
    "custom_ssl_certificate_event_type",
    "dedicated_ssl_certificate_event_type",
    "device_connectivity_anomaly_alert",
    "dos_attack_l4",
    "dos_attack_l7",
    "expiring_service_token_alert",
    "failing_logpush_job_disabled_alert",
    "fbm_auto_advertisement",
    "fbm_dosd_attack",
    "fbm_volumetric_attack",
    "health_check_status_notification",
    "hostname_aop_custom_certificate_expiration_type",
    "http_alert_edge_error",
    "http_alert_origin_error",
    "image_notification",
    "image_resizing_notification",
    "incident_alert",
    "load_balancing_health_alert",
    "load_balancing_pool_enablement_alert",
    "logo_match_alert",
    "magic_tunnel_health_check_event",
    "magic_wan_tunnel_health",
    "maintenance_event_notification",
    "mtls_certificate_store_certificate_expiration_type",
    "pages_event_alert",
    "radar_notification",
    "real_origin_monitoring",
    "scriptmonitor_alert_new_code_change_detections",
    "scriptmonitor_alert_new_hosts",
    "scriptmonitor_alert_new_malicious_hosts",
    "scriptmonitor_alert_new_malicious_scripts",
    "scriptmonitor_alert_new_malicious_url",
    "scriptmonitor_alert_new_max_length_resource_url",
    "scriptmonitor_alert_new_resources",
    "secondary_dns_all_primaries_failing",
    "secondary_dns_primaries_failing",
    "secondary_dns_warning",
    "secondary_dns_zone_successfully_updated",
    "secondary_dns_zone_validation_warning",
    "security_insights_alert",
    "sentinel_alert",
    "stream_live_notifications",
    "synthetic_test_latency_alert",
    "synthetic_test_low_availability_alert",
    "traffic_anomalies_alert",
    "tunnel_health_event",
    "tunnel_update_event",
    "universal_ssl_event_type",
    "web_analytics_metrics_update",
    "zone_aop_custom_certificate_expiration_type",
  ).pipe(T.JsonName("alert_type")),
  enabled: Schema.Boolean,
  mechanisms: Schema.Struct({
    email: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
        }),
      ),
    ),
    pagerduty: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
        }),
      ),
    ),
    webhooks: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
        }),
      ),
    ),
  }),
  name: Schema.String,
  alertInterval: Schema.optional(Schema.String).pipe(T.JsonName("alert_interval")),
  description: Schema.optional(Schema.String),
  filters: Schema.optional(
    Schema.Struct({
      actions: Schema.optional(Schema.Array(Schema.String)),
      affectedAsns: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("affected_asns")),
      affectedComponents: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("affected_components"),
      ),
      affectedLocations: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("affected_locations"),
      ),
      airportCode: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("airport_code")),
      alertTriggerPreferences: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("alert_trigger_preferences"),
      ),
      alertTriggerPreferencesValue: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("alert_trigger_preferences_value"),
      ),
      enabled: Schema.optional(Schema.Array(Schema.String)),
      environment: Schema.optional(Schema.Array(Schema.String)),
      event: Schema.optional(Schema.Array(Schema.String)),
      eventSource: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("event_source")),
      eventType: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("event_type")),
      groupBy: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("group_by")),
      healthCheckId: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("health_check_id"),
      ),
      incidentImpact: Schema.optional(
        Schema.Array(
          Schema.Literal(
            "INCIDENT_IMPACT_NONE",
            "INCIDENT_IMPACT_MINOR",
            "INCIDENT_IMPACT_MAJOR",
            "INCIDENT_IMPACT_CRITICAL",
          ),
        ),
      ).pipe(T.JsonName("incident_impact")),
      inputId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("input_id")),
      insightClass: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("insight_class")),
      limit: Schema.optional(Schema.Array(Schema.String)),
      logoTag: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("logo_tag")),
      megabitsPerSecond: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("megabits_per_second"),
      ),
      newHealth: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("new_health")),
      newStatus: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("new_status")),
      packetsPerSecond: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("packets_per_second"),
      ),
      poolId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("pool_id")),
      popNames: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("pop_names")),
      product: Schema.optional(Schema.Array(Schema.String)),
      projectId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("project_id")),
      protocol: Schema.optional(Schema.Array(Schema.String)),
      queryTag: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("query_tag")),
      requestsPerSecond: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("requests_per_second"),
      ),
      selectors: Schema.optional(Schema.Array(Schema.String)),
      services: Schema.optional(Schema.Array(Schema.String)),
      slo: Schema.optional(Schema.Array(Schema.String)),
      status: Schema.optional(Schema.Array(Schema.String)),
      targetHostname: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("target_hostname"),
      ),
      targetIp: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("target_ip")),
      targetZoneName: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("target_zone_name"),
      ),
      trafficExclusions: Schema.optional(Schema.Array(Schema.Literal("security_events"))).pipe(
        T.JsonName("traffic_exclusions"),
      ),
      tunnelId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("tunnel_id")),
      tunnelName: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("tunnel_name")),
      where: Schema.optional(Schema.Array(Schema.String)),
      zones: Schema.optional(Schema.Array(Schema.String)),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/alerting/v3/policies" }),
) as unknown as Schema.Schema<CreatePolicyRequest>;

export interface CreatePolicyResponse {
  /** UUID */
  id?: string;
}

export const CreatePolicyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreatePolicyResponse>;

export const createPolicy = API.make(() => ({
  input: CreatePolicyRequest,
  output: CreatePolicyResponse,
  errors: [],
}));

export interface UpdatePolicyRequest {
  policyId: string;
  /** Path param: The account id */
  accountId: string;
  /** Body param: Optional specification of how often to re-alert from the same incident, not support on all alert types. */
  alertInterval?: string;
  /** Body param: Refers to which event will trigger a Notification dispatch. You can use the endpoint to get available alert types which then will give you a list of possible values. */
  alertType?:
    | "access_custom_certificate_expiration_type"
    | "advanced_ddos_attack_l4_alert"
    | "advanced_ddos_attack_l7_alert"
    | "advanced_http_alert_error"
    | "bgp_hijack_notification"
    | "billing_usage_alert"
    | "block_notification_block_removed"
    | "block_notification_new_block"
    | "block_notification_review_rejected"
    | "bot_traffic_basic_alert"
    | "brand_protection_alert"
    | "brand_protection_digest"
    | "clickhouse_alert_fw_anomaly"
    | "clickhouse_alert_fw_ent_anomaly"
    | "cloudforce_one_request_notification"
    | "custom_analytics"
    | "custom_bot_detection_alert"
    | "custom_ssl_certificate_event_type"
    | "dedicated_ssl_certificate_event_type"
    | "device_connectivity_anomaly_alert"
    | "dos_attack_l4"
    | "dos_attack_l7"
    | "expiring_service_token_alert"
    | "failing_logpush_job_disabled_alert"
    | "fbm_auto_advertisement"
    | "fbm_dosd_attack"
    | "fbm_volumetric_attack"
    | "health_check_status_notification"
    | "hostname_aop_custom_certificate_expiration_type"
    | "http_alert_edge_error"
    | "http_alert_origin_error"
    | "image_notification"
    | "image_resizing_notification"
    | "incident_alert"
    | "load_balancing_health_alert"
    | "load_balancing_pool_enablement_alert"
    | "logo_match_alert"
    | "magic_tunnel_health_check_event"
    | "magic_wan_tunnel_health"
    | "maintenance_event_notification"
    | "mtls_certificate_store_certificate_expiration_type"
    | "pages_event_alert"
    | "radar_notification"
    | "real_origin_monitoring"
    | "scriptmonitor_alert_new_code_change_detections"
    | "scriptmonitor_alert_new_hosts"
    | "scriptmonitor_alert_new_malicious_hosts"
    | "scriptmonitor_alert_new_malicious_scripts"
    | "scriptmonitor_alert_new_malicious_url"
    | "scriptmonitor_alert_new_max_length_resource_url"
    | "scriptmonitor_alert_new_resources"
    | "secondary_dns_all_primaries_failing"
    | "secondary_dns_primaries_failing"
    | "secondary_dns_warning"
    | "secondary_dns_zone_successfully_updated"
    | "secondary_dns_zone_validation_warning"
    | "security_insights_alert"
    | "sentinel_alert"
    | "stream_live_notifications"
    | "synthetic_test_latency_alert"
    | "synthetic_test_low_availability_alert"
    | "traffic_anomalies_alert"
    | "tunnel_health_event"
    | "tunnel_update_event"
    | "universal_ssl_event_type"
    | "web_analytics_metrics_update"
    | "zone_aop_custom_certificate_expiration_type";
  /** Body param: Optional description for the Notification policy. */
  description?: string;
  /** Body param: Whether or not the Notification policy is enabled. */
  enabled?: boolean;
  /** Body param: Optional filters that allow you to be alerted only on a subset of events for that alert type based on some criteria. This is only available for select alert types. See alert type documenta */
  filters?: {
    actions?: string[];
    affectedAsns?: string[];
    affectedComponents?: string[];
    affectedLocations?: string[];
    airportCode?: string[];
    alertTriggerPreferences?: string[];
    alertTriggerPreferencesValue?: string[];
    enabled?: string[];
    environment?: string[];
    event?: string[];
    eventSource?: string[];
    eventType?: string[];
    groupBy?: string[];
    healthCheckId?: string[];
    incidentImpact?: (
      | "INCIDENT_IMPACT_NONE"
      | "INCIDENT_IMPACT_MINOR"
      | "INCIDENT_IMPACT_MAJOR"
      | "INCIDENT_IMPACT_CRITICAL"
    )[];
    inputId?: string[];
    insightClass?: string[];
    limit?: string[];
    logoTag?: string[];
    megabitsPerSecond?: string[];
    newHealth?: string[];
    newStatus?: string[];
    packetsPerSecond?: string[];
    poolId?: string[];
    popNames?: string[];
    product?: string[];
    projectId?: string[];
    protocol?: string[];
    queryTag?: string[];
    requestsPerSecond?: string[];
    selectors?: string[];
    services?: string[];
    slo?: string[];
    status?: string[];
    targetHostname?: string[];
    targetIp?: string[];
    targetZoneName?: string[];
    trafficExclusions?: "security_events"[];
    tunnelId?: string[];
    tunnelName?: string[];
    where?: string[];
    zones?: string[];
  };
  /** Body param: List of IDs that will be used when dispatching a notification. IDs for email type will be the email address. */
  mechanisms?: {
    email?: { id?: string }[];
    pagerduty?: { id?: string }[];
    webhooks?: { id?: string }[];
  };
  /** Body param: Name of the policy. */
  name?: string;
}

export const UpdatePolicyRequest = Schema.Struct({
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  alertInterval: Schema.optional(Schema.String).pipe(T.JsonName("alert_interval")),
  alertType: Schema.optional(
    Schema.Literal(
      "access_custom_certificate_expiration_type",
      "advanced_ddos_attack_l4_alert",
      "advanced_ddos_attack_l7_alert",
      "advanced_http_alert_error",
      "bgp_hijack_notification",
      "billing_usage_alert",
      "block_notification_block_removed",
      "block_notification_new_block",
      "block_notification_review_rejected",
      "bot_traffic_basic_alert",
      "brand_protection_alert",
      "brand_protection_digest",
      "clickhouse_alert_fw_anomaly",
      "clickhouse_alert_fw_ent_anomaly",
      "cloudforce_one_request_notification",
      "custom_analytics",
      "custom_bot_detection_alert",
      "custom_ssl_certificate_event_type",
      "dedicated_ssl_certificate_event_type",
      "device_connectivity_anomaly_alert",
      "dos_attack_l4",
      "dos_attack_l7",
      "expiring_service_token_alert",
      "failing_logpush_job_disabled_alert",
      "fbm_auto_advertisement",
      "fbm_dosd_attack",
      "fbm_volumetric_attack",
      "health_check_status_notification",
      "hostname_aop_custom_certificate_expiration_type",
      "http_alert_edge_error",
      "http_alert_origin_error",
      "image_notification",
      "image_resizing_notification",
      "incident_alert",
      "load_balancing_health_alert",
      "load_balancing_pool_enablement_alert",
      "logo_match_alert",
      "magic_tunnel_health_check_event",
      "magic_wan_tunnel_health",
      "maintenance_event_notification",
      "mtls_certificate_store_certificate_expiration_type",
      "pages_event_alert",
      "radar_notification",
      "real_origin_monitoring",
      "scriptmonitor_alert_new_code_change_detections",
      "scriptmonitor_alert_new_hosts",
      "scriptmonitor_alert_new_malicious_hosts",
      "scriptmonitor_alert_new_malicious_scripts",
      "scriptmonitor_alert_new_malicious_url",
      "scriptmonitor_alert_new_max_length_resource_url",
      "scriptmonitor_alert_new_resources",
      "secondary_dns_all_primaries_failing",
      "secondary_dns_primaries_failing",
      "secondary_dns_warning",
      "secondary_dns_zone_successfully_updated",
      "secondary_dns_zone_validation_warning",
      "security_insights_alert",
      "sentinel_alert",
      "stream_live_notifications",
      "synthetic_test_latency_alert",
      "synthetic_test_low_availability_alert",
      "traffic_anomalies_alert",
      "tunnel_health_event",
      "tunnel_update_event",
      "universal_ssl_event_type",
      "web_analytics_metrics_update",
      "zone_aop_custom_certificate_expiration_type",
    ),
  ).pipe(T.JsonName("alert_type")),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  filters: Schema.optional(
    Schema.Struct({
      actions: Schema.optional(Schema.Array(Schema.String)),
      affectedAsns: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("affected_asns")),
      affectedComponents: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("affected_components"),
      ),
      affectedLocations: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("affected_locations"),
      ),
      airportCode: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("airport_code")),
      alertTriggerPreferences: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("alert_trigger_preferences"),
      ),
      alertTriggerPreferencesValue: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("alert_trigger_preferences_value"),
      ),
      enabled: Schema.optional(Schema.Array(Schema.String)),
      environment: Schema.optional(Schema.Array(Schema.String)),
      event: Schema.optional(Schema.Array(Schema.String)),
      eventSource: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("event_source")),
      eventType: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("event_type")),
      groupBy: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("group_by")),
      healthCheckId: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("health_check_id"),
      ),
      incidentImpact: Schema.optional(
        Schema.Array(
          Schema.Literal(
            "INCIDENT_IMPACT_NONE",
            "INCIDENT_IMPACT_MINOR",
            "INCIDENT_IMPACT_MAJOR",
            "INCIDENT_IMPACT_CRITICAL",
          ),
        ),
      ).pipe(T.JsonName("incident_impact")),
      inputId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("input_id")),
      insightClass: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("insight_class")),
      limit: Schema.optional(Schema.Array(Schema.String)),
      logoTag: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("logo_tag")),
      megabitsPerSecond: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("megabits_per_second"),
      ),
      newHealth: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("new_health")),
      newStatus: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("new_status")),
      packetsPerSecond: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("packets_per_second"),
      ),
      poolId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("pool_id")),
      popNames: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("pop_names")),
      product: Schema.optional(Schema.Array(Schema.String)),
      projectId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("project_id")),
      protocol: Schema.optional(Schema.Array(Schema.String)),
      queryTag: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("query_tag")),
      requestsPerSecond: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("requests_per_second"),
      ),
      selectors: Schema.optional(Schema.Array(Schema.String)),
      services: Schema.optional(Schema.Array(Schema.String)),
      slo: Schema.optional(Schema.Array(Schema.String)),
      status: Schema.optional(Schema.Array(Schema.String)),
      targetHostname: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("target_hostname"),
      ),
      targetIp: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("target_ip")),
      targetZoneName: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("target_zone_name"),
      ),
      trafficExclusions: Schema.optional(Schema.Array(Schema.Literal("security_events"))).pipe(
        T.JsonName("traffic_exclusions"),
      ),
      tunnelId: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("tunnel_id")),
      tunnelName: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("tunnel_name")),
      where: Schema.optional(Schema.Array(Schema.String)),
      zones: Schema.optional(Schema.Array(Schema.String)),
    }),
  ),
  mechanisms: Schema.optional(
    Schema.Struct({
      email: Schema.optional(
        Schema.Array(
          Schema.Struct({
            id: Schema.optional(Schema.String),
          }),
        ),
      ),
      pagerduty: Schema.optional(
        Schema.Array(
          Schema.Struct({
            id: Schema.optional(Schema.String),
          }),
        ),
      ),
      webhooks: Schema.optional(
        Schema.Array(
          Schema.Struct({
            id: Schema.optional(Schema.String),
          }),
        ),
      ),
    }),
  ),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/alerting/v3/policies/{policyId}" }),
) as unknown as Schema.Schema<UpdatePolicyRequest>;

export interface UpdatePolicyResponse {
  /** UUID */
  id?: string;
}

export const UpdatePolicyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdatePolicyResponse>;

export const updatePolicy = API.make(() => ({
  input: UpdatePolicyRequest,
  output: UpdatePolicyResponse,
  errors: [],
}));

export interface DeletePolicyRequest {
  policyId: string;
  /** The account id */
  accountId: string;
}

export const DeletePolicyRequest = Schema.Struct({
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/alerting/v3/policies/{policyId}" }),
) as unknown as Schema.Schema<DeletePolicyRequest>;

export interface DeletePolicyResponse {
  errors: { message: string; code?: number }[];
  messages: { message: string; code?: number }[];
  /** Whether the API call was successful */
  success: true;
  resultInfo?: { count?: number; page?: number; perPage?: number; totalCount?: number };
}

export const DeletePolicyResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      message: Schema.String,
      code: Schema.optional(Schema.Number),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      message: Schema.String,
      code: Schema.optional(Schema.Number),
    }),
  ),
  success: Schema.Literal(true),
  resultInfo: Schema.optional(
    Schema.Struct({
      count: Schema.optional(Schema.Number),
      page: Schema.optional(Schema.Number),
      perPage: Schema.optional(Schema.Number).pipe(T.JsonName("per_page")),
      totalCount: Schema.optional(Schema.Number).pipe(T.JsonName("total_count")),
    }),
  ).pipe(T.JsonName("result_info")),
}) as unknown as Schema.Schema<DeletePolicyResponse>;

export const deletePolicy = API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [],
}));

/**
 * Cloudflare LOAD-BALANCERS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service load-balancers
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// LoadBalancer
// =============================================================================

export interface GetLoadBalancerRequest {
  loadBalancerId: string;
  zoneId: string;
}

export const GetLoadBalancerRequest = Schema.Struct({
  loadBalancerId: Schema.String.pipe(T.HttpPath("loadBalancerId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/load_balancers/{loadBalancerId}" }),
) as unknown as Schema.Schema<GetLoadBalancerRequest>;

export interface GetLoadBalancerResponse {
  id?: string;
  /** Controls features that modify the routing of requests to pools and origins in response to dynamic conditions, such as during the interval between active health monitoring requests. For example, zero-d */
  adaptiveRouting?: { failoverAcrossPools?: boolean };
  /** A mapping of country codes to a list of pool IDs (ordered by their failover priority) for the given country. Any country not explicitly defined will fall back to using the corresponding region_pool ma */
  countryPools?: Record<string, unknown>;
  createdOn?: string;
  /** A list of pool IDs ordered by their failover priority. Pools defined here are used by default, or when region_pools are not configured for a given region. */
  defaultPools?: string[];
  /** Object description. */
  description?: string;
  /** Whether to enable (the default) this load balancer. */
  enabled?: boolean;
  /** The pool ID to use when all other pools are detected as unhealthy. */
  fallbackPool?: string;
  /** Controls location-based steering for non-proxied requests. See `steering_policy` to learn how steering is affected. */
  locationStrategy?: {
    mode?: "pop" | "resolver_ip";
    preferEcs?: "always" | "never" | "proximity" | "geo";
  };
  modifiedOn?: string;
  /** The DNS hostname to associate with your Load Balancer. If this hostname already exists as a DNS record in Cloudflare's DNS, the Load Balancer will take precedence and the DNS record will not be used. */
  name?: string;
  /** List of networks where Load Balancer or Pool is enabled. */
  networks?: string[];
  /** Enterprise only: A mapping of Cloudflare PoP identifiers to a list of pool IDs (ordered by their failover priority) for the PoP (datacenter). Any PoPs not explicitly defined will fall back to using th */
  popPools?: Record<string, unknown>;
  /** Whether the hostname should be gray clouded (false) or orange clouded (true). */
  proxied?: boolean;
  /** Configures pool weights.  - `steering_policy="random"`: A random pool is selected with probability proportional to pool weights. - `steering_policy="least_outstanding_requests"`: Use pool weights to s */
  randomSteering?: { defaultWeight?: number; poolWeights?: Record<string, unknown> };
  /** A mapping of region codes to a list of pool IDs (ordered by their failover priority) for the given region. Any regions not explicitly defined will fall back to using default_pools. */
  regionPools?: Record<string, unknown>;
  /** BETA Field Not General Access: A list of rules for this load balancer to execute. */
  rules?: {
    condition?: string;
    disabled?: boolean;
    fixedResponse?: {
      contentType?: string;
      location?: string;
      messageBody?: string;
      statusCode?: number;
    };
    name?: string;
    overrides?: {
      adaptiveRouting?: unknown;
      countryPools?: Record<string, unknown>;
      defaultPools?: string[];
      fallbackPool?: string;
      locationStrategy?: unknown;
      popPools?: Record<string, unknown>;
      randomSteering?: unknown;
      regionPools?: Record<string, unknown>;
      sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
      sessionAffinityAttributes?: unknown;
      sessionAffinityTtl?: number;
      steeringPolicy?:
        | ""
        | "off"
        | "geo"
        | "random"
        | "dynamic_latency"
        | "proximity"
        | "least_outstanding_requests"
        | "least_connections";
      ttl?: number;
    };
    priority?: number;
    terminates?: boolean;
  }[];
  /** Specifies the type of session affinity the load balancer should use unless specified as `"none"`. The supported types are: - `"cookie"`: On the first request to a proxied load balancer, a cookie is ge */
  sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
  /** Configures attributes for session affinity. */
  sessionAffinityAttributes?: {
    drainDuration?: number;
    headers?: string[];
    requireAllHeaders?: boolean;
    samesite?: "Auto" | "Lax" | "None" | "Strict";
    secure?: "Auto" | "Always" | "Never";
    zeroDowntimeFailover?: "none" | "temporary" | "sticky";
  };
  /** Time, in seconds, until a client's session expires after being created. Once the expiry time has been reached, subsequent requests may get sent to a different origin server. The accepted ranges per `s */
  sessionAffinityTtl?: number;
  /** Steering Policy for this load balancer.  - `"off"`: Use `default_pools`. - `"geo"`: Use `region_pools`/`country_pools`/`pop_pools`. For non-proxied requests, the country for `country_pools` is determi */
  steeringPolicy?:
    | ""
    | "off"
    | "geo"
    | "random"
    | "dynamic_latency"
    | "proximity"
    | "least_outstanding_requests"
    | "least_connections";
  /** Time to live (TTL) of the DNS entry for the IP address returned by this load balancer. This only applies to gray-clouded (unproxied) load balancers. */
  ttl?: number;
  zoneName?: string;
}

export const GetLoadBalancerResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  adaptiveRouting: Schema.optional(
    Schema.Struct({
      failoverAcrossPools: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("failover_across_pools"),
      ),
    }),
  ).pipe(T.JsonName("adaptive_routing")),
  countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("default_pools")),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
  locationStrategy: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("pop", "resolver_ip")),
      preferEcs: Schema.optional(Schema.Literal("always", "never", "proximity", "geo")).pipe(
        T.JsonName("prefer_ecs"),
      ),
    }),
  ).pipe(T.JsonName("location_strategy")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  networks: Schema.optional(Schema.Array(Schema.String)),
  popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
  proxied: Schema.optional(Schema.Boolean),
  randomSteering: Schema.optional(
    Schema.Struct({
      defaultWeight: Schema.optional(Schema.Number).pipe(T.JsonName("default_weight")),
      poolWeights: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pool_weights")),
    }),
  ).pipe(T.JsonName("random_steering")),
  regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        condition: Schema.optional(Schema.String),
        disabled: Schema.optional(Schema.Boolean),
        fixedResponse: Schema.optional(
          Schema.Struct({
            contentType: Schema.optional(Schema.String).pipe(T.JsonName("content_type")),
            location: Schema.optional(Schema.String),
            messageBody: Schema.optional(Schema.String).pipe(T.JsonName("message_body")),
            statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
          }),
        ).pipe(T.JsonName("fixed_response")),
        name: Schema.optional(Schema.String),
        overrides: Schema.optional(
          Schema.Struct({
            adaptiveRouting: Schema.optional(Schema.Unknown).pipe(T.JsonName("adaptive_routing")),
            countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
            defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(
              T.JsonName("default_pools"),
            ),
            fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
            locationStrategy: Schema.optional(Schema.Unknown).pipe(T.JsonName("location_strategy")),
            popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
            randomSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("random_steering")),
            regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
            sessionAffinity: Schema.optional(
              Schema.Literal("none", "cookie", "ip_cookie", "header"),
            ).pipe(T.JsonName("session_affinity")),
            sessionAffinityAttributes: Schema.optional(Schema.Unknown).pipe(
              T.JsonName("session_affinity_attributes"),
            ),
            sessionAffinityTtl: Schema.optional(Schema.Number).pipe(
              T.JsonName("session_affinity_ttl"),
            ),
            steeringPolicy: Schema.optional(
              Schema.Literal(
                "",
                "off",
                "geo",
                "random",
                "dynamic_latency",
                "proximity",
                "least_outstanding_requests",
                "least_connections",
              ),
            ).pipe(T.JsonName("steering_policy")),
            ttl: Schema.optional(Schema.Number),
          }),
        ),
        priority: Schema.optional(Schema.Number),
        terminates: Schema.optional(Schema.Boolean),
      }),
    ),
  ),
  sessionAffinity: Schema.optional(Schema.Literal("none", "cookie", "ip_cookie", "header")).pipe(
    T.JsonName("session_affinity"),
  ),
  sessionAffinityAttributes: Schema.optional(
    Schema.Struct({
      drainDuration: Schema.optional(Schema.Number).pipe(T.JsonName("drain_duration")),
      headers: Schema.optional(Schema.Array(Schema.String)),
      requireAllHeaders: Schema.optional(Schema.Boolean).pipe(T.JsonName("require_all_headers")),
      samesite: Schema.optional(Schema.Literal("Auto", "Lax", "None", "Strict")),
      secure: Schema.optional(Schema.Literal("Auto", "Always", "Never")),
      zeroDowntimeFailover: Schema.optional(Schema.Literal("none", "temporary", "sticky")).pipe(
        T.JsonName("zero_downtime_failover"),
      ),
    }),
  ).pipe(T.JsonName("session_affinity_attributes")),
  sessionAffinityTtl: Schema.optional(Schema.Number).pipe(T.JsonName("session_affinity_ttl")),
  steeringPolicy: Schema.optional(
    Schema.Literal(
      "",
      "off",
      "geo",
      "random",
      "dynamic_latency",
      "proximity",
      "least_outstanding_requests",
      "least_connections",
    ),
  ).pipe(T.JsonName("steering_policy")),
  ttl: Schema.optional(Schema.Number),
  zoneName: Schema.optional(Schema.String).pipe(T.JsonName("zone_name")),
}) as unknown as Schema.Schema<GetLoadBalancerResponse>;

export const getLoadBalancer = API.make(() => ({
  input: GetLoadBalancerRequest,
  output: GetLoadBalancerResponse,
  errors: [],
}));

export interface CreateLoadBalancerRequest {
  /** Path param: */
  zoneId: string;
  /** Body param: A list of pool IDs ordered by their failover priority. Pools defined here are used by default, or when region_pools are not configured for a given region. */
  defaultPools: string[];
  /** Body param: The pool ID to use when all other pools are detected as unhealthy. */
  fallbackPool: string;
  /** Body param: The DNS hostname to associate with your Load Balancer. If this hostname already exists as a DNS record in Cloudflare's DNS, the Load Balancer will take precedence and the DNS record will n */
  name: string;
  /** Body param: Controls features that modify the routing of requests to pools and origins in response to dynamic conditions, such as during the interval between active health monitoring requests. For exa */
  adaptiveRouting?: { failoverAcrossPools?: boolean };
  /** Body param: A mapping of country codes to a list of pool IDs (ordered by their failover priority) for the given country. Any country not explicitly defined will fall back to using the corresponding re */
  countryPools?: Record<string, unknown>;
  /** Body param: Object description. */
  description?: string;
  /** Body param: Controls location-based steering for non-proxied requests. See `steering_policy` to learn how steering is affected. */
  locationStrategy?: {
    mode?: "pop" | "resolver_ip";
    preferEcs?: "always" | "never" | "proximity" | "geo";
  };
  /** Body param: List of networks where Load Balancer or Pool is enabled. */
  networks?: string[];
  /** Body param: Enterprise only: A mapping of Cloudflare PoP identifiers to a list of pool IDs (ordered by their failover priority) for the PoP (datacenter). Any PoPs not explicitly defined will fall back */
  popPools?: Record<string, unknown>;
  /** Body param: Whether the hostname should be gray clouded (false) or orange clouded (true). */
  proxied?: boolean;
  /** Body param: Configures pool weights.  - `steering_policy="random"`: A random pool is selected with probability proportional to pool weights. - `steering_policy="least_outstanding_requests"`: Use pool  */
  randomSteering?: { defaultWeight?: number; poolWeights?: Record<string, unknown> };
  /** Body param: A mapping of region codes to a list of pool IDs (ordered by their failover priority) for the given region. Any regions not explicitly defined will fall back to using default_pools. */
  regionPools?: Record<string, unknown>;
  /** Body param: BETA Field Not General Access: A list of rules for this load balancer to execute. */
  rules?: {
    condition?: string;
    disabled?: boolean;
    fixedResponse?: {
      contentType?: string;
      location?: string;
      messageBody?: string;
      statusCode?: number;
    };
    name?: string;
    overrides?: {
      adaptiveRouting?: unknown;
      countryPools?: Record<string, unknown>;
      defaultPools?: string[];
      fallbackPool?: string;
      locationStrategy?: unknown;
      popPools?: Record<string, unknown>;
      randomSteering?: unknown;
      regionPools?: Record<string, unknown>;
      sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
      sessionAffinityAttributes?: unknown;
      sessionAffinityTtl?: number;
      steeringPolicy?:
        | ""
        | "off"
        | "geo"
        | "random"
        | "dynamic_latency"
        | "proximity"
        | "least_outstanding_requests"
        | "least_connections";
      ttl?: number;
    };
    priority?: number;
    terminates?: boolean;
  }[];
  /** Body param: Specifies the type of session affinity the load balancer should use unless specified as `"none"`. The supported types are: - `"cookie"`: On the first request to a proxied load balancer, a  */
  sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
  /** Body param: Configures attributes for session affinity. */
  sessionAffinityAttributes?: {
    drainDuration?: number;
    headers?: string[];
    requireAllHeaders?: boolean;
    samesite?: "Auto" | "Lax" | "None" | "Strict";
    secure?: "Auto" | "Always" | "Never";
    zeroDowntimeFailover?: "none" | "temporary" | "sticky";
  };
  /** Body param: Time, in seconds, until a client's session expires after being created. Once the expiry time has been reached, subsequent requests may get sent to a different origin server. The accepted r */
  sessionAffinityTtl?: number;
  /** Body param: Steering Policy for this load balancer.  - `"off"`: Use `default_pools`. - `"geo"`: Use `region_pools`/`country_pools`/`pop_pools`. For non-proxied requests, the country for `country_pools */
  steeringPolicy?:
    | ""
    | "off"
    | "geo"
    | "random"
    | "dynamic_latency"
    | "proximity"
    | "least_outstanding_requests"
    | "least_connections";
  /** Body param: Time to live (TTL) of the DNS entry for the IP address returned by this load balancer. This only applies to gray-clouded (unproxied) load balancers. */
  ttl?: number;
}

export const CreateLoadBalancerRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  defaultPools: Schema.Array(Schema.String).pipe(T.JsonName("default_pools")),
  fallbackPool: Schema.String.pipe(T.JsonName("fallback_pool")),
  name: Schema.String,
  adaptiveRouting: Schema.optional(
    Schema.Struct({
      failoverAcrossPools: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("failover_across_pools"),
      ),
    }),
  ).pipe(T.JsonName("adaptive_routing")),
  countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
  description: Schema.optional(Schema.String),
  locationStrategy: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("pop", "resolver_ip")),
      preferEcs: Schema.optional(Schema.Literal("always", "never", "proximity", "geo")).pipe(
        T.JsonName("prefer_ecs"),
      ),
    }),
  ).pipe(T.JsonName("location_strategy")),
  networks: Schema.optional(Schema.Array(Schema.String)),
  popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
  proxied: Schema.optional(Schema.Boolean),
  randomSteering: Schema.optional(
    Schema.Struct({
      defaultWeight: Schema.optional(Schema.Number).pipe(T.JsonName("default_weight")),
      poolWeights: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pool_weights")),
    }),
  ).pipe(T.JsonName("random_steering")),
  regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        condition: Schema.optional(Schema.String),
        disabled: Schema.optional(Schema.Boolean),
        fixedResponse: Schema.optional(
          Schema.Struct({
            contentType: Schema.optional(Schema.String).pipe(T.JsonName("content_type")),
            location: Schema.optional(Schema.String),
            messageBody: Schema.optional(Schema.String).pipe(T.JsonName("message_body")),
            statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
          }),
        ).pipe(T.JsonName("fixed_response")),
        name: Schema.optional(Schema.String),
        overrides: Schema.optional(
          Schema.Struct({
            adaptiveRouting: Schema.optional(Schema.Unknown).pipe(T.JsonName("adaptive_routing")),
            countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
            defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(
              T.JsonName("default_pools"),
            ),
            fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
            locationStrategy: Schema.optional(Schema.Unknown).pipe(T.JsonName("location_strategy")),
            popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
            randomSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("random_steering")),
            regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
            sessionAffinity: Schema.optional(
              Schema.Literal("none", "cookie", "ip_cookie", "header"),
            ).pipe(T.JsonName("session_affinity")),
            sessionAffinityAttributes: Schema.optional(Schema.Unknown).pipe(
              T.JsonName("session_affinity_attributes"),
            ),
            sessionAffinityTtl: Schema.optional(Schema.Number).pipe(
              T.JsonName("session_affinity_ttl"),
            ),
            steeringPolicy: Schema.optional(
              Schema.Literal(
                "",
                "off",
                "geo",
                "random",
                "dynamic_latency",
                "proximity",
                "least_outstanding_requests",
                "least_connections",
              ),
            ).pipe(T.JsonName("steering_policy")),
            ttl: Schema.optional(Schema.Number),
          }),
        ),
        priority: Schema.optional(Schema.Number),
        terminates: Schema.optional(Schema.Boolean),
      }),
    ),
  ),
  sessionAffinity: Schema.optional(Schema.Literal("none", "cookie", "ip_cookie", "header")).pipe(
    T.JsonName("session_affinity"),
  ),
  sessionAffinityAttributes: Schema.optional(
    Schema.Struct({
      drainDuration: Schema.optional(Schema.Number).pipe(T.JsonName("drain_duration")),
      headers: Schema.optional(Schema.Array(Schema.String)),
      requireAllHeaders: Schema.optional(Schema.Boolean).pipe(T.JsonName("require_all_headers")),
      samesite: Schema.optional(Schema.Literal("Auto", "Lax", "None", "Strict")),
      secure: Schema.optional(Schema.Literal("Auto", "Always", "Never")),
      zeroDowntimeFailover: Schema.optional(Schema.Literal("none", "temporary", "sticky")).pipe(
        T.JsonName("zero_downtime_failover"),
      ),
    }),
  ).pipe(T.JsonName("session_affinity_attributes")),
  sessionAffinityTtl: Schema.optional(Schema.Number).pipe(T.JsonName("session_affinity_ttl")),
  steeringPolicy: Schema.optional(
    Schema.Literal(
      "",
      "off",
      "geo",
      "random",
      "dynamic_latency",
      "proximity",
      "least_outstanding_requests",
      "least_connections",
    ),
  ).pipe(T.JsonName("steering_policy")),
  ttl: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/load_balancers" }),
) as unknown as Schema.Schema<CreateLoadBalancerRequest>;

export interface CreateLoadBalancerResponse {
  id?: string;
  /** Controls features that modify the routing of requests to pools and origins in response to dynamic conditions, such as during the interval between active health monitoring requests. For example, zero-d */
  adaptiveRouting?: { failoverAcrossPools?: boolean };
  /** A mapping of country codes to a list of pool IDs (ordered by their failover priority) for the given country. Any country not explicitly defined will fall back to using the corresponding region_pool ma */
  countryPools?: Record<string, unknown>;
  createdOn?: string;
  /** A list of pool IDs ordered by their failover priority. Pools defined here are used by default, or when region_pools are not configured for a given region. */
  defaultPools?: string[];
  /** Object description. */
  description?: string;
  /** Whether to enable (the default) this load balancer. */
  enabled?: boolean;
  /** The pool ID to use when all other pools are detected as unhealthy. */
  fallbackPool?: string;
  /** Controls location-based steering for non-proxied requests. See `steering_policy` to learn how steering is affected. */
  locationStrategy?: {
    mode?: "pop" | "resolver_ip";
    preferEcs?: "always" | "never" | "proximity" | "geo";
  };
  modifiedOn?: string;
  /** The DNS hostname to associate with your Load Balancer. If this hostname already exists as a DNS record in Cloudflare's DNS, the Load Balancer will take precedence and the DNS record will not be used. */
  name?: string;
  /** List of networks where Load Balancer or Pool is enabled. */
  networks?: string[];
  /** Enterprise only: A mapping of Cloudflare PoP identifiers to a list of pool IDs (ordered by their failover priority) for the PoP (datacenter). Any PoPs not explicitly defined will fall back to using th */
  popPools?: Record<string, unknown>;
  /** Whether the hostname should be gray clouded (false) or orange clouded (true). */
  proxied?: boolean;
  /** Configures pool weights.  - `steering_policy="random"`: A random pool is selected with probability proportional to pool weights. - `steering_policy="least_outstanding_requests"`: Use pool weights to s */
  randomSteering?: { defaultWeight?: number; poolWeights?: Record<string, unknown> };
  /** A mapping of region codes to a list of pool IDs (ordered by their failover priority) for the given region. Any regions not explicitly defined will fall back to using default_pools. */
  regionPools?: Record<string, unknown>;
  /** BETA Field Not General Access: A list of rules for this load balancer to execute. */
  rules?: {
    condition?: string;
    disabled?: boolean;
    fixedResponse?: {
      contentType?: string;
      location?: string;
      messageBody?: string;
      statusCode?: number;
    };
    name?: string;
    overrides?: {
      adaptiveRouting?: unknown;
      countryPools?: Record<string, unknown>;
      defaultPools?: string[];
      fallbackPool?: string;
      locationStrategy?: unknown;
      popPools?: Record<string, unknown>;
      randomSteering?: unknown;
      regionPools?: Record<string, unknown>;
      sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
      sessionAffinityAttributes?: unknown;
      sessionAffinityTtl?: number;
      steeringPolicy?:
        | ""
        | "off"
        | "geo"
        | "random"
        | "dynamic_latency"
        | "proximity"
        | "least_outstanding_requests"
        | "least_connections";
      ttl?: number;
    };
    priority?: number;
    terminates?: boolean;
  }[];
  /** Specifies the type of session affinity the load balancer should use unless specified as `"none"`. The supported types are: - `"cookie"`: On the first request to a proxied load balancer, a cookie is ge */
  sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
  /** Configures attributes for session affinity. */
  sessionAffinityAttributes?: {
    drainDuration?: number;
    headers?: string[];
    requireAllHeaders?: boolean;
    samesite?: "Auto" | "Lax" | "None" | "Strict";
    secure?: "Auto" | "Always" | "Never";
    zeroDowntimeFailover?: "none" | "temporary" | "sticky";
  };
  /** Time, in seconds, until a client's session expires after being created. Once the expiry time has been reached, subsequent requests may get sent to a different origin server. The accepted ranges per `s */
  sessionAffinityTtl?: number;
  /** Steering Policy for this load balancer.  - `"off"`: Use `default_pools`. - `"geo"`: Use `region_pools`/`country_pools`/`pop_pools`. For non-proxied requests, the country for `country_pools` is determi */
  steeringPolicy?:
    | ""
    | "off"
    | "geo"
    | "random"
    | "dynamic_latency"
    | "proximity"
    | "least_outstanding_requests"
    | "least_connections";
  /** Time to live (TTL) of the DNS entry for the IP address returned by this load balancer. This only applies to gray-clouded (unproxied) load balancers. */
  ttl?: number;
  zoneName?: string;
}

export const CreateLoadBalancerResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  adaptiveRouting: Schema.optional(
    Schema.Struct({
      failoverAcrossPools: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("failover_across_pools"),
      ),
    }),
  ).pipe(T.JsonName("adaptive_routing")),
  countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("default_pools")),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
  locationStrategy: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("pop", "resolver_ip")),
      preferEcs: Schema.optional(Schema.Literal("always", "never", "proximity", "geo")).pipe(
        T.JsonName("prefer_ecs"),
      ),
    }),
  ).pipe(T.JsonName("location_strategy")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  networks: Schema.optional(Schema.Array(Schema.String)),
  popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
  proxied: Schema.optional(Schema.Boolean),
  randomSteering: Schema.optional(
    Schema.Struct({
      defaultWeight: Schema.optional(Schema.Number).pipe(T.JsonName("default_weight")),
      poolWeights: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pool_weights")),
    }),
  ).pipe(T.JsonName("random_steering")),
  regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        condition: Schema.optional(Schema.String),
        disabled: Schema.optional(Schema.Boolean),
        fixedResponse: Schema.optional(
          Schema.Struct({
            contentType: Schema.optional(Schema.String).pipe(T.JsonName("content_type")),
            location: Schema.optional(Schema.String),
            messageBody: Schema.optional(Schema.String).pipe(T.JsonName("message_body")),
            statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
          }),
        ).pipe(T.JsonName("fixed_response")),
        name: Schema.optional(Schema.String),
        overrides: Schema.optional(
          Schema.Struct({
            adaptiveRouting: Schema.optional(Schema.Unknown).pipe(T.JsonName("adaptive_routing")),
            countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
            defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(
              T.JsonName("default_pools"),
            ),
            fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
            locationStrategy: Schema.optional(Schema.Unknown).pipe(T.JsonName("location_strategy")),
            popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
            randomSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("random_steering")),
            regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
            sessionAffinity: Schema.optional(
              Schema.Literal("none", "cookie", "ip_cookie", "header"),
            ).pipe(T.JsonName("session_affinity")),
            sessionAffinityAttributes: Schema.optional(Schema.Unknown).pipe(
              T.JsonName("session_affinity_attributes"),
            ),
            sessionAffinityTtl: Schema.optional(Schema.Number).pipe(
              T.JsonName("session_affinity_ttl"),
            ),
            steeringPolicy: Schema.optional(
              Schema.Literal(
                "",
                "off",
                "geo",
                "random",
                "dynamic_latency",
                "proximity",
                "least_outstanding_requests",
                "least_connections",
              ),
            ).pipe(T.JsonName("steering_policy")),
            ttl: Schema.optional(Schema.Number),
          }),
        ),
        priority: Schema.optional(Schema.Number),
        terminates: Schema.optional(Schema.Boolean),
      }),
    ),
  ),
  sessionAffinity: Schema.optional(Schema.Literal("none", "cookie", "ip_cookie", "header")).pipe(
    T.JsonName("session_affinity"),
  ),
  sessionAffinityAttributes: Schema.optional(
    Schema.Struct({
      drainDuration: Schema.optional(Schema.Number).pipe(T.JsonName("drain_duration")),
      headers: Schema.optional(Schema.Array(Schema.String)),
      requireAllHeaders: Schema.optional(Schema.Boolean).pipe(T.JsonName("require_all_headers")),
      samesite: Schema.optional(Schema.Literal("Auto", "Lax", "None", "Strict")),
      secure: Schema.optional(Schema.Literal("Auto", "Always", "Never")),
      zeroDowntimeFailover: Schema.optional(Schema.Literal("none", "temporary", "sticky")).pipe(
        T.JsonName("zero_downtime_failover"),
      ),
    }),
  ).pipe(T.JsonName("session_affinity_attributes")),
  sessionAffinityTtl: Schema.optional(Schema.Number).pipe(T.JsonName("session_affinity_ttl")),
  steeringPolicy: Schema.optional(
    Schema.Literal(
      "",
      "off",
      "geo",
      "random",
      "dynamic_latency",
      "proximity",
      "least_outstanding_requests",
      "least_connections",
    ),
  ).pipe(T.JsonName("steering_policy")),
  ttl: Schema.optional(Schema.Number),
  zoneName: Schema.optional(Schema.String).pipe(T.JsonName("zone_name")),
}) as unknown as Schema.Schema<CreateLoadBalancerResponse>;

export const createLoadBalancer = API.make(() => ({
  input: CreateLoadBalancerRequest,
  output: CreateLoadBalancerResponse,
  errors: [],
}));

export interface UpdateLoadBalancerRequest {
  loadBalancerId: string;
  /** Path param: */
  zoneId: string;
  /** Body param: A list of pool IDs ordered by their failover priority. Pools defined here are used by default, or when region_pools are not configured for a given region. */
  defaultPools: string[];
  /** Body param: The pool ID to use when all other pools are detected as unhealthy. */
  fallbackPool: string;
  /** Body param: The DNS hostname to associate with your Load Balancer. If this hostname already exists as a DNS record in Cloudflare's DNS, the Load Balancer will take precedence and the DNS record will n */
  name: string;
  /** Body param: Controls features that modify the routing of requests to pools and origins in response to dynamic conditions, such as during the interval between active health monitoring requests. For exa */
  adaptiveRouting?: { failoverAcrossPools?: boolean };
  /** Body param: A mapping of country codes to a list of pool IDs (ordered by their failover priority) for the given country. Any country not explicitly defined will fall back to using the corresponding re */
  countryPools?: Record<string, unknown>;
  /** Body param: Object description. */
  description?: string;
  /** Body param: Whether to enable (the default) this load balancer. */
  enabled?: boolean;
  /** Body param: Controls location-based steering for non-proxied requests. See `steering_policy` to learn how steering is affected. */
  locationStrategy?: {
    mode?: "pop" | "resolver_ip";
    preferEcs?: "always" | "never" | "proximity" | "geo";
  };
  /** Body param: List of networks where Load Balancer or Pool is enabled. */
  networks?: string[];
  /** Body param: Enterprise only: A mapping of Cloudflare PoP identifiers to a list of pool IDs (ordered by their failover priority) for the PoP (datacenter). Any PoPs not explicitly defined will fall back */
  popPools?: Record<string, unknown>;
  /** Body param: Whether the hostname should be gray clouded (false) or orange clouded (true). */
  proxied?: boolean;
  /** Body param: Configures pool weights.  - `steering_policy="random"`: A random pool is selected with probability proportional to pool weights. - `steering_policy="least_outstanding_requests"`: Use pool  */
  randomSteering?: { defaultWeight?: number; poolWeights?: Record<string, unknown> };
  /** Body param: A mapping of region codes to a list of pool IDs (ordered by their failover priority) for the given region. Any regions not explicitly defined will fall back to using default_pools. */
  regionPools?: Record<string, unknown>;
  /** Body param: BETA Field Not General Access: A list of rules for this load balancer to execute. */
  rules?: {
    condition?: string;
    disabled?: boolean;
    fixedResponse?: {
      contentType?: string;
      location?: string;
      messageBody?: string;
      statusCode?: number;
    };
    name?: string;
    overrides?: {
      adaptiveRouting?: unknown;
      countryPools?: Record<string, unknown>;
      defaultPools?: string[];
      fallbackPool?: string;
      locationStrategy?: unknown;
      popPools?: Record<string, unknown>;
      randomSteering?: unknown;
      regionPools?: Record<string, unknown>;
      sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
      sessionAffinityAttributes?: unknown;
      sessionAffinityTtl?: number;
      steeringPolicy?:
        | ""
        | "off"
        | "geo"
        | "random"
        | "dynamic_latency"
        | "proximity"
        | "least_outstanding_requests"
        | "least_connections";
      ttl?: number;
    };
    priority?: number;
    terminates?: boolean;
  }[];
  /** Body param: Specifies the type of session affinity the load balancer should use unless specified as `"none"`. The supported types are: - `"cookie"`: On the first request to a proxied load balancer, a  */
  sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
  /** Body param: Configures attributes for session affinity. */
  sessionAffinityAttributes?: {
    drainDuration?: number;
    headers?: string[];
    requireAllHeaders?: boolean;
    samesite?: "Auto" | "Lax" | "None" | "Strict";
    secure?: "Auto" | "Always" | "Never";
    zeroDowntimeFailover?: "none" | "temporary" | "sticky";
  };
  /** Body param: Time, in seconds, until a client's session expires after being created. Once the expiry time has been reached, subsequent requests may get sent to a different origin server. The accepted r */
  sessionAffinityTtl?: number;
  /** Body param: Steering Policy for this load balancer.  - `"off"`: Use `default_pools`. - `"geo"`: Use `region_pools`/`country_pools`/`pop_pools`. For non-proxied requests, the country for `country_pools */
  steeringPolicy?:
    | ""
    | "off"
    | "geo"
    | "random"
    | "dynamic_latency"
    | "proximity"
    | "least_outstanding_requests"
    | "least_connections";
  /** Body param: Time to live (TTL) of the DNS entry for the IP address returned by this load balancer. This only applies to gray-clouded (unproxied) load balancers. */
  ttl?: number;
}

export const UpdateLoadBalancerRequest = Schema.Struct({
  loadBalancerId: Schema.String.pipe(T.HttpPath("loadBalancerId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  defaultPools: Schema.Array(Schema.String).pipe(T.JsonName("default_pools")),
  fallbackPool: Schema.String.pipe(T.JsonName("fallback_pool")),
  name: Schema.String,
  adaptiveRouting: Schema.optional(
    Schema.Struct({
      failoverAcrossPools: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("failover_across_pools"),
      ),
    }),
  ).pipe(T.JsonName("adaptive_routing")),
  countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  locationStrategy: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("pop", "resolver_ip")),
      preferEcs: Schema.optional(Schema.Literal("always", "never", "proximity", "geo")).pipe(
        T.JsonName("prefer_ecs"),
      ),
    }),
  ).pipe(T.JsonName("location_strategy")),
  networks: Schema.optional(Schema.Array(Schema.String)),
  popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
  proxied: Schema.optional(Schema.Boolean),
  randomSteering: Schema.optional(
    Schema.Struct({
      defaultWeight: Schema.optional(Schema.Number).pipe(T.JsonName("default_weight")),
      poolWeights: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pool_weights")),
    }),
  ).pipe(T.JsonName("random_steering")),
  regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        condition: Schema.optional(Schema.String),
        disabled: Schema.optional(Schema.Boolean),
        fixedResponse: Schema.optional(
          Schema.Struct({
            contentType: Schema.optional(Schema.String).pipe(T.JsonName("content_type")),
            location: Schema.optional(Schema.String),
            messageBody: Schema.optional(Schema.String).pipe(T.JsonName("message_body")),
            statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
          }),
        ).pipe(T.JsonName("fixed_response")),
        name: Schema.optional(Schema.String),
        overrides: Schema.optional(
          Schema.Struct({
            adaptiveRouting: Schema.optional(Schema.Unknown).pipe(T.JsonName("adaptive_routing")),
            countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
            defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(
              T.JsonName("default_pools"),
            ),
            fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
            locationStrategy: Schema.optional(Schema.Unknown).pipe(T.JsonName("location_strategy")),
            popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
            randomSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("random_steering")),
            regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
            sessionAffinity: Schema.optional(
              Schema.Literal("none", "cookie", "ip_cookie", "header"),
            ).pipe(T.JsonName("session_affinity")),
            sessionAffinityAttributes: Schema.optional(Schema.Unknown).pipe(
              T.JsonName("session_affinity_attributes"),
            ),
            sessionAffinityTtl: Schema.optional(Schema.Number).pipe(
              T.JsonName("session_affinity_ttl"),
            ),
            steeringPolicy: Schema.optional(
              Schema.Literal(
                "",
                "off",
                "geo",
                "random",
                "dynamic_latency",
                "proximity",
                "least_outstanding_requests",
                "least_connections",
              ),
            ).pipe(T.JsonName("steering_policy")),
            ttl: Schema.optional(Schema.Number),
          }),
        ),
        priority: Schema.optional(Schema.Number),
        terminates: Schema.optional(Schema.Boolean),
      }),
    ),
  ),
  sessionAffinity: Schema.optional(Schema.Literal("none", "cookie", "ip_cookie", "header")).pipe(
    T.JsonName("session_affinity"),
  ),
  sessionAffinityAttributes: Schema.optional(
    Schema.Struct({
      drainDuration: Schema.optional(Schema.Number).pipe(T.JsonName("drain_duration")),
      headers: Schema.optional(Schema.Array(Schema.String)),
      requireAllHeaders: Schema.optional(Schema.Boolean).pipe(T.JsonName("require_all_headers")),
      samesite: Schema.optional(Schema.Literal("Auto", "Lax", "None", "Strict")),
      secure: Schema.optional(Schema.Literal("Auto", "Always", "Never")),
      zeroDowntimeFailover: Schema.optional(Schema.Literal("none", "temporary", "sticky")).pipe(
        T.JsonName("zero_downtime_failover"),
      ),
    }),
  ).pipe(T.JsonName("session_affinity_attributes")),
  sessionAffinityTtl: Schema.optional(Schema.Number).pipe(T.JsonName("session_affinity_ttl")),
  steeringPolicy: Schema.optional(
    Schema.Literal(
      "",
      "off",
      "geo",
      "random",
      "dynamic_latency",
      "proximity",
      "least_outstanding_requests",
      "least_connections",
    ),
  ).pipe(T.JsonName("steering_policy")),
  ttl: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/load_balancers/{loadBalancerId}" }),
) as unknown as Schema.Schema<UpdateLoadBalancerRequest>;

export interface UpdateLoadBalancerResponse {
  id?: string;
  /** Controls features that modify the routing of requests to pools and origins in response to dynamic conditions, such as during the interval between active health monitoring requests. For example, zero-d */
  adaptiveRouting?: { failoverAcrossPools?: boolean };
  /** A mapping of country codes to a list of pool IDs (ordered by their failover priority) for the given country. Any country not explicitly defined will fall back to using the corresponding region_pool ma */
  countryPools?: Record<string, unknown>;
  createdOn?: string;
  /** A list of pool IDs ordered by their failover priority. Pools defined here are used by default, or when region_pools are not configured for a given region. */
  defaultPools?: string[];
  /** Object description. */
  description?: string;
  /** Whether to enable (the default) this load balancer. */
  enabled?: boolean;
  /** The pool ID to use when all other pools are detected as unhealthy. */
  fallbackPool?: string;
  /** Controls location-based steering for non-proxied requests. See `steering_policy` to learn how steering is affected. */
  locationStrategy?: {
    mode?: "pop" | "resolver_ip";
    preferEcs?: "always" | "never" | "proximity" | "geo";
  };
  modifiedOn?: string;
  /** The DNS hostname to associate with your Load Balancer. If this hostname already exists as a DNS record in Cloudflare's DNS, the Load Balancer will take precedence and the DNS record will not be used. */
  name?: string;
  /** List of networks where Load Balancer or Pool is enabled. */
  networks?: string[];
  /** Enterprise only: A mapping of Cloudflare PoP identifiers to a list of pool IDs (ordered by their failover priority) for the PoP (datacenter). Any PoPs not explicitly defined will fall back to using th */
  popPools?: Record<string, unknown>;
  /** Whether the hostname should be gray clouded (false) or orange clouded (true). */
  proxied?: boolean;
  /** Configures pool weights.  - `steering_policy="random"`: A random pool is selected with probability proportional to pool weights. - `steering_policy="least_outstanding_requests"`: Use pool weights to s */
  randomSteering?: { defaultWeight?: number; poolWeights?: Record<string, unknown> };
  /** A mapping of region codes to a list of pool IDs (ordered by their failover priority) for the given region. Any regions not explicitly defined will fall back to using default_pools. */
  regionPools?: Record<string, unknown>;
  /** BETA Field Not General Access: A list of rules for this load balancer to execute. */
  rules?: {
    condition?: string;
    disabled?: boolean;
    fixedResponse?: {
      contentType?: string;
      location?: string;
      messageBody?: string;
      statusCode?: number;
    };
    name?: string;
    overrides?: {
      adaptiveRouting?: unknown;
      countryPools?: Record<string, unknown>;
      defaultPools?: string[];
      fallbackPool?: string;
      locationStrategy?: unknown;
      popPools?: Record<string, unknown>;
      randomSteering?: unknown;
      regionPools?: Record<string, unknown>;
      sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
      sessionAffinityAttributes?: unknown;
      sessionAffinityTtl?: number;
      steeringPolicy?:
        | ""
        | "off"
        | "geo"
        | "random"
        | "dynamic_latency"
        | "proximity"
        | "least_outstanding_requests"
        | "least_connections";
      ttl?: number;
    };
    priority?: number;
    terminates?: boolean;
  }[];
  /** Specifies the type of session affinity the load balancer should use unless specified as `"none"`. The supported types are: - `"cookie"`: On the first request to a proxied load balancer, a cookie is ge */
  sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
  /** Configures attributes for session affinity. */
  sessionAffinityAttributes?: {
    drainDuration?: number;
    headers?: string[];
    requireAllHeaders?: boolean;
    samesite?: "Auto" | "Lax" | "None" | "Strict";
    secure?: "Auto" | "Always" | "Never";
    zeroDowntimeFailover?: "none" | "temporary" | "sticky";
  };
  /** Time, in seconds, until a client's session expires after being created. Once the expiry time has been reached, subsequent requests may get sent to a different origin server. The accepted ranges per `s */
  sessionAffinityTtl?: number;
  /** Steering Policy for this load balancer.  - `"off"`: Use `default_pools`. - `"geo"`: Use `region_pools`/`country_pools`/`pop_pools`. For non-proxied requests, the country for `country_pools` is determi */
  steeringPolicy?:
    | ""
    | "off"
    | "geo"
    | "random"
    | "dynamic_latency"
    | "proximity"
    | "least_outstanding_requests"
    | "least_connections";
  /** Time to live (TTL) of the DNS entry for the IP address returned by this load balancer. This only applies to gray-clouded (unproxied) load balancers. */
  ttl?: number;
  zoneName?: string;
}

export const UpdateLoadBalancerResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  adaptiveRouting: Schema.optional(
    Schema.Struct({
      failoverAcrossPools: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("failover_across_pools"),
      ),
    }),
  ).pipe(T.JsonName("adaptive_routing")),
  countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("default_pools")),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
  locationStrategy: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("pop", "resolver_ip")),
      preferEcs: Schema.optional(Schema.Literal("always", "never", "proximity", "geo")).pipe(
        T.JsonName("prefer_ecs"),
      ),
    }),
  ).pipe(T.JsonName("location_strategy")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  networks: Schema.optional(Schema.Array(Schema.String)),
  popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
  proxied: Schema.optional(Schema.Boolean),
  randomSteering: Schema.optional(
    Schema.Struct({
      defaultWeight: Schema.optional(Schema.Number).pipe(T.JsonName("default_weight")),
      poolWeights: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pool_weights")),
    }),
  ).pipe(T.JsonName("random_steering")),
  regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        condition: Schema.optional(Schema.String),
        disabled: Schema.optional(Schema.Boolean),
        fixedResponse: Schema.optional(
          Schema.Struct({
            contentType: Schema.optional(Schema.String).pipe(T.JsonName("content_type")),
            location: Schema.optional(Schema.String),
            messageBody: Schema.optional(Schema.String).pipe(T.JsonName("message_body")),
            statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
          }),
        ).pipe(T.JsonName("fixed_response")),
        name: Schema.optional(Schema.String),
        overrides: Schema.optional(
          Schema.Struct({
            adaptiveRouting: Schema.optional(Schema.Unknown).pipe(T.JsonName("adaptive_routing")),
            countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
            defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(
              T.JsonName("default_pools"),
            ),
            fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
            locationStrategy: Schema.optional(Schema.Unknown).pipe(T.JsonName("location_strategy")),
            popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
            randomSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("random_steering")),
            regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
            sessionAffinity: Schema.optional(
              Schema.Literal("none", "cookie", "ip_cookie", "header"),
            ).pipe(T.JsonName("session_affinity")),
            sessionAffinityAttributes: Schema.optional(Schema.Unknown).pipe(
              T.JsonName("session_affinity_attributes"),
            ),
            sessionAffinityTtl: Schema.optional(Schema.Number).pipe(
              T.JsonName("session_affinity_ttl"),
            ),
            steeringPolicy: Schema.optional(
              Schema.Literal(
                "",
                "off",
                "geo",
                "random",
                "dynamic_latency",
                "proximity",
                "least_outstanding_requests",
                "least_connections",
              ),
            ).pipe(T.JsonName("steering_policy")),
            ttl: Schema.optional(Schema.Number),
          }),
        ),
        priority: Schema.optional(Schema.Number),
        terminates: Schema.optional(Schema.Boolean),
      }),
    ),
  ),
  sessionAffinity: Schema.optional(Schema.Literal("none", "cookie", "ip_cookie", "header")).pipe(
    T.JsonName("session_affinity"),
  ),
  sessionAffinityAttributes: Schema.optional(
    Schema.Struct({
      drainDuration: Schema.optional(Schema.Number).pipe(T.JsonName("drain_duration")),
      headers: Schema.optional(Schema.Array(Schema.String)),
      requireAllHeaders: Schema.optional(Schema.Boolean).pipe(T.JsonName("require_all_headers")),
      samesite: Schema.optional(Schema.Literal("Auto", "Lax", "None", "Strict")),
      secure: Schema.optional(Schema.Literal("Auto", "Always", "Never")),
      zeroDowntimeFailover: Schema.optional(Schema.Literal("none", "temporary", "sticky")).pipe(
        T.JsonName("zero_downtime_failover"),
      ),
    }),
  ).pipe(T.JsonName("session_affinity_attributes")),
  sessionAffinityTtl: Schema.optional(Schema.Number).pipe(T.JsonName("session_affinity_ttl")),
  steeringPolicy: Schema.optional(
    Schema.Literal(
      "",
      "off",
      "geo",
      "random",
      "dynamic_latency",
      "proximity",
      "least_outstanding_requests",
      "least_connections",
    ),
  ).pipe(T.JsonName("steering_policy")),
  ttl: Schema.optional(Schema.Number),
  zoneName: Schema.optional(Schema.String).pipe(T.JsonName("zone_name")),
}) as unknown as Schema.Schema<UpdateLoadBalancerResponse>;

export const updateLoadBalancer = API.make(() => ({
  input: UpdateLoadBalancerRequest,
  output: UpdateLoadBalancerResponse,
  errors: [],
}));

export interface PatchLoadBalancerRequest {
  loadBalancerId: string;
  /** Path param: */
  zoneId: string;
  /** Body param: Controls features that modify the routing of requests to pools and origins in response to dynamic conditions, such as during the interval between active health monitoring requests. For exa */
  adaptiveRouting?: { failoverAcrossPools?: boolean };
  /** Body param: A mapping of country codes to a list of pool IDs (ordered by their failover priority) for the given country. Any country not explicitly defined will fall back to using the corresponding re */
  countryPools?: Record<string, unknown>;
  /** Body param: A list of pool IDs ordered by their failover priority. Pools defined here are used by default, or when region_pools are not configured for a given region. */
  defaultPools?: string[];
  /** Body param: Object description. */
  description?: string;
  /** Body param: Whether to enable (the default) this load balancer. */
  enabled?: boolean;
  /** Body param: The pool ID to use when all other pools are detected as unhealthy. */
  fallbackPool?: string;
  /** Body param: Controls location-based steering for non-proxied requests. See `steering_policy` to learn how steering is affected. */
  locationStrategy?: {
    mode?: "pop" | "resolver_ip";
    preferEcs?: "always" | "never" | "proximity" | "geo";
  };
  /** Body param: The DNS hostname to associate with your Load Balancer. If this hostname already exists as a DNS record in Cloudflare's DNS, the Load Balancer will take precedence and the DNS record will n */
  name?: string;
  /** Body param: Enterprise only: A mapping of Cloudflare PoP identifiers to a list of pool IDs (ordered by their failover priority) for the PoP (datacenter). Any PoPs not explicitly defined will fall back */
  popPools?: Record<string, unknown>;
  /** Body param: Whether the hostname should be gray clouded (false) or orange clouded (true). */
  proxied?: boolean;
  /** Body param: Configures pool weights.  - `steering_policy="random"`: A random pool is selected with probability proportional to pool weights. - `steering_policy="least_outstanding_requests"`: Use pool  */
  randomSteering?: { defaultWeight?: number; poolWeights?: Record<string, unknown> };
  /** Body param: A mapping of region codes to a list of pool IDs (ordered by their failover priority) for the given region. Any regions not explicitly defined will fall back to using default_pools. */
  regionPools?: Record<string, unknown>;
  /** Body param: BETA Field Not General Access: A list of rules for this load balancer to execute. */
  rules?: {
    condition?: string;
    disabled?: boolean;
    fixedResponse?: {
      contentType?: string;
      location?: string;
      messageBody?: string;
      statusCode?: number;
    };
    name?: string;
    overrides?: {
      adaptiveRouting?: unknown;
      countryPools?: Record<string, unknown>;
      defaultPools?: string[];
      fallbackPool?: string;
      locationStrategy?: unknown;
      popPools?: Record<string, unknown>;
      randomSteering?: unknown;
      regionPools?: Record<string, unknown>;
      sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
      sessionAffinityAttributes?: unknown;
      sessionAffinityTtl?: number;
      steeringPolicy?:
        | ""
        | "off"
        | "geo"
        | "random"
        | "dynamic_latency"
        | "proximity"
        | "least_outstanding_requests"
        | "least_connections";
      ttl?: number;
    };
    priority?: number;
    terminates?: boolean;
  }[];
  /** Body param: Specifies the type of session affinity the load balancer should use unless specified as `"none"`. The supported types are: - `"cookie"`: On the first request to a proxied load balancer, a  */
  sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
  /** Body param: Configures attributes for session affinity. */
  sessionAffinityAttributes?: {
    drainDuration?: number;
    headers?: string[];
    requireAllHeaders?: boolean;
    samesite?: "Auto" | "Lax" | "None" | "Strict";
    secure?: "Auto" | "Always" | "Never";
    zeroDowntimeFailover?: "none" | "temporary" | "sticky";
  };
  /** Body param: Time, in seconds, until a client's session expires after being created. Once the expiry time has been reached, subsequent requests may get sent to a different origin server. The accepted r */
  sessionAffinityTtl?: number;
  /** Body param: Steering Policy for this load balancer.  - `"off"`: Use `default_pools`. - `"geo"`: Use `region_pools`/`country_pools`/`pop_pools`. For non-proxied requests, the country for `country_pools */
  steeringPolicy?:
    | ""
    | "off"
    | "geo"
    | "random"
    | "dynamic_latency"
    | "proximity"
    | "least_outstanding_requests"
    | "least_connections";
  /** Body param: Time to live (TTL) of the DNS entry for the IP address returned by this load balancer. This only applies to gray-clouded (unproxied) load balancers. */
  ttl?: number;
}

export const PatchLoadBalancerRequest = Schema.Struct({
  loadBalancerId: Schema.String.pipe(T.HttpPath("loadBalancerId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  adaptiveRouting: Schema.optional(
    Schema.Struct({
      failoverAcrossPools: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("failover_across_pools"),
      ),
    }),
  ).pipe(T.JsonName("adaptive_routing")),
  countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
  defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("default_pools")),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
  locationStrategy: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("pop", "resolver_ip")),
      preferEcs: Schema.optional(Schema.Literal("always", "never", "proximity", "geo")).pipe(
        T.JsonName("prefer_ecs"),
      ),
    }),
  ).pipe(T.JsonName("location_strategy")),
  name: Schema.optional(Schema.String),
  popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
  proxied: Schema.optional(Schema.Boolean),
  randomSteering: Schema.optional(
    Schema.Struct({
      defaultWeight: Schema.optional(Schema.Number).pipe(T.JsonName("default_weight")),
      poolWeights: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pool_weights")),
    }),
  ).pipe(T.JsonName("random_steering")),
  regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        condition: Schema.optional(Schema.String),
        disabled: Schema.optional(Schema.Boolean),
        fixedResponse: Schema.optional(
          Schema.Struct({
            contentType: Schema.optional(Schema.String).pipe(T.JsonName("content_type")),
            location: Schema.optional(Schema.String),
            messageBody: Schema.optional(Schema.String).pipe(T.JsonName("message_body")),
            statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
          }),
        ).pipe(T.JsonName("fixed_response")),
        name: Schema.optional(Schema.String),
        overrides: Schema.optional(
          Schema.Struct({
            adaptiveRouting: Schema.optional(Schema.Unknown).pipe(T.JsonName("adaptive_routing")),
            countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
            defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(
              T.JsonName("default_pools"),
            ),
            fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
            locationStrategy: Schema.optional(Schema.Unknown).pipe(T.JsonName("location_strategy")),
            popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
            randomSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("random_steering")),
            regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
            sessionAffinity: Schema.optional(
              Schema.Literal("none", "cookie", "ip_cookie", "header"),
            ).pipe(T.JsonName("session_affinity")),
            sessionAffinityAttributes: Schema.optional(Schema.Unknown).pipe(
              T.JsonName("session_affinity_attributes"),
            ),
            sessionAffinityTtl: Schema.optional(Schema.Number).pipe(
              T.JsonName("session_affinity_ttl"),
            ),
            steeringPolicy: Schema.optional(
              Schema.Literal(
                "",
                "off",
                "geo",
                "random",
                "dynamic_latency",
                "proximity",
                "least_outstanding_requests",
                "least_connections",
              ),
            ).pipe(T.JsonName("steering_policy")),
            ttl: Schema.optional(Schema.Number),
          }),
        ),
        priority: Schema.optional(Schema.Number),
        terminates: Schema.optional(Schema.Boolean),
      }),
    ),
  ),
  sessionAffinity: Schema.optional(Schema.Literal("none", "cookie", "ip_cookie", "header")).pipe(
    T.JsonName("session_affinity"),
  ),
  sessionAffinityAttributes: Schema.optional(
    Schema.Struct({
      drainDuration: Schema.optional(Schema.Number).pipe(T.JsonName("drain_duration")),
      headers: Schema.optional(Schema.Array(Schema.String)),
      requireAllHeaders: Schema.optional(Schema.Boolean).pipe(T.JsonName("require_all_headers")),
      samesite: Schema.optional(Schema.Literal("Auto", "Lax", "None", "Strict")),
      secure: Schema.optional(Schema.Literal("Auto", "Always", "Never")),
      zeroDowntimeFailover: Schema.optional(Schema.Literal("none", "temporary", "sticky")).pipe(
        T.JsonName("zero_downtime_failover"),
      ),
    }),
  ).pipe(T.JsonName("session_affinity_attributes")),
  sessionAffinityTtl: Schema.optional(Schema.Number).pipe(T.JsonName("session_affinity_ttl")),
  steeringPolicy: Schema.optional(
    Schema.Literal(
      "",
      "off",
      "geo",
      "random",
      "dynamic_latency",
      "proximity",
      "least_outstanding_requests",
      "least_connections",
    ),
  ).pipe(T.JsonName("steering_policy")),
  ttl: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/load_balancers/{loadBalancerId}" }),
) as unknown as Schema.Schema<PatchLoadBalancerRequest>;

export interface PatchLoadBalancerResponse {
  id?: string;
  /** Controls features that modify the routing of requests to pools and origins in response to dynamic conditions, such as during the interval between active health monitoring requests. For example, zero-d */
  adaptiveRouting?: { failoverAcrossPools?: boolean };
  /** A mapping of country codes to a list of pool IDs (ordered by their failover priority) for the given country. Any country not explicitly defined will fall back to using the corresponding region_pool ma */
  countryPools?: Record<string, unknown>;
  createdOn?: string;
  /** A list of pool IDs ordered by their failover priority. Pools defined here are used by default, or when region_pools are not configured for a given region. */
  defaultPools?: string[];
  /** Object description. */
  description?: string;
  /** Whether to enable (the default) this load balancer. */
  enabled?: boolean;
  /** The pool ID to use when all other pools are detected as unhealthy. */
  fallbackPool?: string;
  /** Controls location-based steering for non-proxied requests. See `steering_policy` to learn how steering is affected. */
  locationStrategy?: {
    mode?: "pop" | "resolver_ip";
    preferEcs?: "always" | "never" | "proximity" | "geo";
  };
  modifiedOn?: string;
  /** The DNS hostname to associate with your Load Balancer. If this hostname already exists as a DNS record in Cloudflare's DNS, the Load Balancer will take precedence and the DNS record will not be used. */
  name?: string;
  /** List of networks where Load Balancer or Pool is enabled. */
  networks?: string[];
  /** Enterprise only: A mapping of Cloudflare PoP identifiers to a list of pool IDs (ordered by their failover priority) for the PoP (datacenter). Any PoPs not explicitly defined will fall back to using th */
  popPools?: Record<string, unknown>;
  /** Whether the hostname should be gray clouded (false) or orange clouded (true). */
  proxied?: boolean;
  /** Configures pool weights.  - `steering_policy="random"`: A random pool is selected with probability proportional to pool weights. - `steering_policy="least_outstanding_requests"`: Use pool weights to s */
  randomSteering?: { defaultWeight?: number; poolWeights?: Record<string, unknown> };
  /** A mapping of region codes to a list of pool IDs (ordered by their failover priority) for the given region. Any regions not explicitly defined will fall back to using default_pools. */
  regionPools?: Record<string, unknown>;
  /** BETA Field Not General Access: A list of rules for this load balancer to execute. */
  rules?: {
    condition?: string;
    disabled?: boolean;
    fixedResponse?: {
      contentType?: string;
      location?: string;
      messageBody?: string;
      statusCode?: number;
    };
    name?: string;
    overrides?: {
      adaptiveRouting?: unknown;
      countryPools?: Record<string, unknown>;
      defaultPools?: string[];
      fallbackPool?: string;
      locationStrategy?: unknown;
      popPools?: Record<string, unknown>;
      randomSteering?: unknown;
      regionPools?: Record<string, unknown>;
      sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
      sessionAffinityAttributes?: unknown;
      sessionAffinityTtl?: number;
      steeringPolicy?:
        | ""
        | "off"
        | "geo"
        | "random"
        | "dynamic_latency"
        | "proximity"
        | "least_outstanding_requests"
        | "least_connections";
      ttl?: number;
    };
    priority?: number;
    terminates?: boolean;
  }[];
  /** Specifies the type of session affinity the load balancer should use unless specified as `"none"`. The supported types are: - `"cookie"`: On the first request to a proxied load balancer, a cookie is ge */
  sessionAffinity?: "none" | "cookie" | "ip_cookie" | "header";
  /** Configures attributes for session affinity. */
  sessionAffinityAttributes?: {
    drainDuration?: number;
    headers?: string[];
    requireAllHeaders?: boolean;
    samesite?: "Auto" | "Lax" | "None" | "Strict";
    secure?: "Auto" | "Always" | "Never";
    zeroDowntimeFailover?: "none" | "temporary" | "sticky";
  };
  /** Time, in seconds, until a client's session expires after being created. Once the expiry time has been reached, subsequent requests may get sent to a different origin server. The accepted ranges per `s */
  sessionAffinityTtl?: number;
  /** Steering Policy for this load balancer.  - `"off"`: Use `default_pools`. - `"geo"`: Use `region_pools`/`country_pools`/`pop_pools`. For non-proxied requests, the country for `country_pools` is determi */
  steeringPolicy?:
    | ""
    | "off"
    | "geo"
    | "random"
    | "dynamic_latency"
    | "proximity"
    | "least_outstanding_requests"
    | "least_connections";
  /** Time to live (TTL) of the DNS entry for the IP address returned by this load balancer. This only applies to gray-clouded (unproxied) load balancers. */
  ttl?: number;
  zoneName?: string;
}

export const PatchLoadBalancerResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  adaptiveRouting: Schema.optional(
    Schema.Struct({
      failoverAcrossPools: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("failover_across_pools"),
      ),
    }),
  ).pipe(T.JsonName("adaptive_routing")),
  countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("default_pools")),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
  locationStrategy: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("pop", "resolver_ip")),
      preferEcs: Schema.optional(Schema.Literal("always", "never", "proximity", "geo")).pipe(
        T.JsonName("prefer_ecs"),
      ),
    }),
  ).pipe(T.JsonName("location_strategy")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  networks: Schema.optional(Schema.Array(Schema.String)),
  popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
  proxied: Schema.optional(Schema.Boolean),
  randomSteering: Schema.optional(
    Schema.Struct({
      defaultWeight: Schema.optional(Schema.Number).pipe(T.JsonName("default_weight")),
      poolWeights: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pool_weights")),
    }),
  ).pipe(T.JsonName("random_steering")),
  regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        condition: Schema.optional(Schema.String),
        disabled: Schema.optional(Schema.Boolean),
        fixedResponse: Schema.optional(
          Schema.Struct({
            contentType: Schema.optional(Schema.String).pipe(T.JsonName("content_type")),
            location: Schema.optional(Schema.String),
            messageBody: Schema.optional(Schema.String).pipe(T.JsonName("message_body")),
            statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
          }),
        ).pipe(T.JsonName("fixed_response")),
        name: Schema.optional(Schema.String),
        overrides: Schema.optional(
          Schema.Struct({
            adaptiveRouting: Schema.optional(Schema.Unknown).pipe(T.JsonName("adaptive_routing")),
            countryPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("country_pools")),
            defaultPools: Schema.optional(Schema.Array(Schema.String)).pipe(
              T.JsonName("default_pools"),
            ),
            fallbackPool: Schema.optional(Schema.String).pipe(T.JsonName("fallback_pool")),
            locationStrategy: Schema.optional(Schema.Unknown).pipe(T.JsonName("location_strategy")),
            popPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("pop_pools")),
            randomSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("random_steering")),
            regionPools: Schema.optional(Schema.Struct({})).pipe(T.JsonName("region_pools")),
            sessionAffinity: Schema.optional(
              Schema.Literal("none", "cookie", "ip_cookie", "header"),
            ).pipe(T.JsonName("session_affinity")),
            sessionAffinityAttributes: Schema.optional(Schema.Unknown).pipe(
              T.JsonName("session_affinity_attributes"),
            ),
            sessionAffinityTtl: Schema.optional(Schema.Number).pipe(
              T.JsonName("session_affinity_ttl"),
            ),
            steeringPolicy: Schema.optional(
              Schema.Literal(
                "",
                "off",
                "geo",
                "random",
                "dynamic_latency",
                "proximity",
                "least_outstanding_requests",
                "least_connections",
              ),
            ).pipe(T.JsonName("steering_policy")),
            ttl: Schema.optional(Schema.Number),
          }),
        ),
        priority: Schema.optional(Schema.Number),
        terminates: Schema.optional(Schema.Boolean),
      }),
    ),
  ),
  sessionAffinity: Schema.optional(Schema.Literal("none", "cookie", "ip_cookie", "header")).pipe(
    T.JsonName("session_affinity"),
  ),
  sessionAffinityAttributes: Schema.optional(
    Schema.Struct({
      drainDuration: Schema.optional(Schema.Number).pipe(T.JsonName("drain_duration")),
      headers: Schema.optional(Schema.Array(Schema.String)),
      requireAllHeaders: Schema.optional(Schema.Boolean).pipe(T.JsonName("require_all_headers")),
      samesite: Schema.optional(Schema.Literal("Auto", "Lax", "None", "Strict")),
      secure: Schema.optional(Schema.Literal("Auto", "Always", "Never")),
      zeroDowntimeFailover: Schema.optional(Schema.Literal("none", "temporary", "sticky")).pipe(
        T.JsonName("zero_downtime_failover"),
      ),
    }),
  ).pipe(T.JsonName("session_affinity_attributes")),
  sessionAffinityTtl: Schema.optional(Schema.Number).pipe(T.JsonName("session_affinity_ttl")),
  steeringPolicy: Schema.optional(
    Schema.Literal(
      "",
      "off",
      "geo",
      "random",
      "dynamic_latency",
      "proximity",
      "least_outstanding_requests",
      "least_connections",
    ),
  ).pipe(T.JsonName("steering_policy")),
  ttl: Schema.optional(Schema.Number),
  zoneName: Schema.optional(Schema.String).pipe(T.JsonName("zone_name")),
}) as unknown as Schema.Schema<PatchLoadBalancerResponse>;

export const patchLoadBalancer = API.make(() => ({
  input: PatchLoadBalancerRequest,
  output: PatchLoadBalancerResponse,
  errors: [],
}));

export interface DeleteLoadBalancerRequest {
  loadBalancerId: string;
  zoneId: string;
}

export const DeleteLoadBalancerRequest = Schema.Struct({
  loadBalancerId: Schema.String.pipe(T.HttpPath("loadBalancerId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/load_balancers/{loadBalancerId}" }),
) as unknown as Schema.Schema<DeleteLoadBalancerRequest>;

export interface DeleteLoadBalancerResponse {
  id?: string;
}

export const DeleteLoadBalancerResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteLoadBalancerResponse>;

export const deleteLoadBalancer = API.make(() => ({
  input: DeleteLoadBalancerRequest,
  output: DeleteLoadBalancerResponse,
  errors: [],
}));

// =============================================================================
// Monitor
// =============================================================================

export interface GetMonitorRequest {
  monitorId: string;
  /** Identifier. */
  accountId: string;
}

export const GetMonitorRequest = Schema.Struct({
  monitorId: Schema.String.pipe(T.HttpPath("monitorId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/load_balancers/monitors/{monitorId}" }),
) as unknown as Schema.Schema<GetMonitorRequest>;

export interface GetMonitorResponse {
  id?: string;
  /** Do not validate the certificate when monitor use HTTPS. This parameter is currently only valid for HTTP and HTTPS monitors. */
  allowInsecure?: boolean;
  /** To be marked unhealthy the monitored origin must fail this healthcheck N consecutive times. */
  consecutiveDown?: number;
  /** To be marked healthy the monitored origin must pass this healthcheck N consecutive times. */
  consecutiveUp?: number;
  createdOn?: string;
  /** Object description. */
  description?: string;
  /** A case-insensitive sub-string to look for in the response body. If this string is not found, the origin will be marked as unhealthy. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedBody?: string;
  /** The expected HTTP response code or code range of the health check. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedCodes?: string;
  /** Follow redirects if returned by the origin. This parameter is only valid for HTTP and HTTPS monitors. */
  followRedirects?: boolean;
  /** The HTTP request headers to send in the health check. It is recommended you set a Host header by default. The User-Agent header cannot be overridden. This parameter is only valid for HTTP and HTTPS mo */
  header?: Record<string, unknown>;
  /** The interval between each health check. Shorter intervals may improve failover time, but will increase load on the origins as we check from multiple locations. */
  interval?: number;
  /** The method to use for the health check. This defaults to 'GET' for HTTP/HTTPS based checks and 'connection_established' for TCP based health checks. */
  method?: string;
  modifiedOn?: string;
  /** The endpoint path you want to conduct a health check against. This parameter is only valid for HTTP and HTTPS monitors. */
  path?: string;
  /** The port number to connect to for the health check. Required for TCP, UDP, and SMTP checks. HTTP and HTTPS checks should only define the port when using a non-standard port (HTTP: default 80, HTTPS: d */
  port?: number;
  /** Assign this monitor to emulate the specified zone while probing. This parameter is only valid for HTTP and HTTPS monitors. */
  probeZone?: string;
  /** The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** The protocol to use for the health check. Currently supported protocols are 'HTTP','HTTPS', 'TCP', 'ICMP-PING', 'UDP-ICMP', and 'SMTP'. */
  type?: "http" | "https" | "tcp" | "udp_icmp" | "icmp_ping" | "smtp";
}

export const GetMonitorResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
  consecutiveDown: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_down")),
  consecutiveUp: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_up")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
  expectedCodes: Schema.optional(Schema.String).pipe(T.JsonName("expected_codes")),
  followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
  header: Schema.optional(Schema.Struct({})),
  interval: Schema.optional(Schema.Number),
  method: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  path: Schema.optional(Schema.String),
  port: Schema.optional(Schema.Number),
  probeZone: Schema.optional(Schema.String).pipe(T.JsonName("probe_zone")),
  retries: Schema.optional(Schema.Number),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.Literal("http", "https", "tcp", "udp_icmp", "icmp_ping", "smtp")),
}) as unknown as Schema.Schema<GetMonitorResponse>;

export const getMonitor = API.make(() => ({
  input: GetMonitorRequest,
  output: GetMonitorResponse,
  errors: [],
}));

export interface CreateMonitorRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Do not validate the certificate when monitor use HTTPS. This parameter is currently only valid for HTTP and HTTPS monitors. */
  allowInsecure?: boolean;
  /** Body param: To be marked unhealthy the monitored origin must fail this healthcheck N consecutive times. */
  consecutiveDown?: number;
  /** Body param: To be marked healthy the monitored origin must pass this healthcheck N consecutive times. */
  consecutiveUp?: number;
  /** Body param: Object description. */
  description?: string;
  /** Body param: A case-insensitive sub-string to look for in the response body. If this string is not found, the origin will be marked as unhealthy. This parameter is only valid for HTTP and HTTPS monitor */
  expectedBody?: string;
  /** Body param: The expected HTTP response code or code range of the health check. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedCodes?: string;
  /** Body param: Follow redirects if returned by the origin. This parameter is only valid for HTTP and HTTPS monitors. */
  followRedirects?: boolean;
  /** Body param: The HTTP request headers to send in the health check. It is recommended you set a Host header by default. The User-Agent header cannot be overridden. This parameter is only valid for HTTP  */
  header?: Record<string, unknown>;
  /** Body param: The interval between each health check. Shorter intervals may improve failover time, but will increase load on the origins as we check from multiple locations. */
  interval?: number;
  /** Body param: The method to use for the health check. This defaults to 'GET' for HTTP/HTTPS based checks and 'connection_established' for TCP based health checks. */
  method?: string;
  /** Body param: The endpoint path you want to conduct a health check against. This parameter is only valid for HTTP and HTTPS monitors. */
  path?: string;
  /** Body param: The port number to connect to for the health check. Required for TCP, UDP, and SMTP checks. HTTP and HTTPS checks should only define the port when using a non-standard port (HTTP: default  */
  port?: number;
  /** Body param: Assign this monitor to emulate the specified zone while probing. This parameter is only valid for HTTP and HTTPS monitors. */
  probeZone?: string;
  /** Body param: The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** Body param: The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** Body param: The protocol to use for the health check. Currently supported protocols are 'HTTP','HTTPS', 'TCP', 'ICMP-PING', 'UDP-ICMP', and 'SMTP'. */
  type?: "http" | "https" | "tcp" | "udp_icmp" | "icmp_ping" | "smtp";
}

export const CreateMonitorRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
  consecutiveDown: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_down")),
  consecutiveUp: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_up")),
  description: Schema.optional(Schema.String),
  expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
  expectedCodes: Schema.optional(Schema.String).pipe(T.JsonName("expected_codes")),
  followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
  header: Schema.optional(Schema.Struct({})),
  interval: Schema.optional(Schema.Number),
  method: Schema.optional(Schema.String),
  path: Schema.optional(Schema.String),
  port: Schema.optional(Schema.Number),
  probeZone: Schema.optional(Schema.String).pipe(T.JsonName("probe_zone")),
  retries: Schema.optional(Schema.Number),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.Literal("http", "https", "tcp", "udp_icmp", "icmp_ping", "smtp")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/load_balancers/monitors" }),
) as unknown as Schema.Schema<CreateMonitorRequest>;

export interface CreateMonitorResponse {
  id?: string;
  /** Do not validate the certificate when monitor use HTTPS. This parameter is currently only valid for HTTP and HTTPS monitors. */
  allowInsecure?: boolean;
  /** To be marked unhealthy the monitored origin must fail this healthcheck N consecutive times. */
  consecutiveDown?: number;
  /** To be marked healthy the monitored origin must pass this healthcheck N consecutive times. */
  consecutiveUp?: number;
  createdOn?: string;
  /** Object description. */
  description?: string;
  /** A case-insensitive sub-string to look for in the response body. If this string is not found, the origin will be marked as unhealthy. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedBody?: string;
  /** The expected HTTP response code or code range of the health check. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedCodes?: string;
  /** Follow redirects if returned by the origin. This parameter is only valid for HTTP and HTTPS monitors. */
  followRedirects?: boolean;
  /** The HTTP request headers to send in the health check. It is recommended you set a Host header by default. The User-Agent header cannot be overridden. This parameter is only valid for HTTP and HTTPS mo */
  header?: Record<string, unknown>;
  /** The interval between each health check. Shorter intervals may improve failover time, but will increase load on the origins as we check from multiple locations. */
  interval?: number;
  /** The method to use for the health check. This defaults to 'GET' for HTTP/HTTPS based checks and 'connection_established' for TCP based health checks. */
  method?: string;
  modifiedOn?: string;
  /** The endpoint path you want to conduct a health check against. This parameter is only valid for HTTP and HTTPS monitors. */
  path?: string;
  /** The port number to connect to for the health check. Required for TCP, UDP, and SMTP checks. HTTP and HTTPS checks should only define the port when using a non-standard port (HTTP: default 80, HTTPS: d */
  port?: number;
  /** Assign this monitor to emulate the specified zone while probing. This parameter is only valid for HTTP and HTTPS monitors. */
  probeZone?: string;
  /** The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** The protocol to use for the health check. Currently supported protocols are 'HTTP','HTTPS', 'TCP', 'ICMP-PING', 'UDP-ICMP', and 'SMTP'. */
  type?: "http" | "https" | "tcp" | "udp_icmp" | "icmp_ping" | "smtp";
}

export const CreateMonitorResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
  consecutiveDown: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_down")),
  consecutiveUp: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_up")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
  expectedCodes: Schema.optional(Schema.String).pipe(T.JsonName("expected_codes")),
  followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
  header: Schema.optional(Schema.Struct({})),
  interval: Schema.optional(Schema.Number),
  method: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  path: Schema.optional(Schema.String),
  port: Schema.optional(Schema.Number),
  probeZone: Schema.optional(Schema.String).pipe(T.JsonName("probe_zone")),
  retries: Schema.optional(Schema.Number),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.Literal("http", "https", "tcp", "udp_icmp", "icmp_ping", "smtp")),
}) as unknown as Schema.Schema<CreateMonitorResponse>;

export const createMonitor = API.make(() => ({
  input: CreateMonitorRequest,
  output: CreateMonitorResponse,
  errors: [],
}));

export interface UpdateMonitorRequest {
  monitorId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Do not validate the certificate when monitor use HTTPS. This parameter is currently only valid for HTTP and HTTPS monitors. */
  allowInsecure?: boolean;
  /** Body param: To be marked unhealthy the monitored origin must fail this healthcheck N consecutive times. */
  consecutiveDown?: number;
  /** Body param: To be marked healthy the monitored origin must pass this healthcheck N consecutive times. */
  consecutiveUp?: number;
  /** Body param: Object description. */
  description?: string;
  /** Body param: A case-insensitive sub-string to look for in the response body. If this string is not found, the origin will be marked as unhealthy. This parameter is only valid for HTTP and HTTPS monitor */
  expectedBody?: string;
  /** Body param: The expected HTTP response code or code range of the health check. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedCodes?: string;
  /** Body param: Follow redirects if returned by the origin. This parameter is only valid for HTTP and HTTPS monitors. */
  followRedirects?: boolean;
  /** Body param: The HTTP request headers to send in the health check. It is recommended you set a Host header by default. The User-Agent header cannot be overridden. This parameter is only valid for HTTP  */
  header?: Record<string, unknown>;
  /** Body param: The interval between each health check. Shorter intervals may improve failover time, but will increase load on the origins as we check from multiple locations. */
  interval?: number;
  /** Body param: The method to use for the health check. This defaults to 'GET' for HTTP/HTTPS based checks and 'connection_established' for TCP based health checks. */
  method?: string;
  /** Body param: The endpoint path you want to conduct a health check against. This parameter is only valid for HTTP and HTTPS monitors. */
  path?: string;
  /** Body param: The port number to connect to for the health check. Required for TCP, UDP, and SMTP checks. HTTP and HTTPS checks should only define the port when using a non-standard port (HTTP: default  */
  port?: number;
  /** Body param: Assign this monitor to emulate the specified zone while probing. This parameter is only valid for HTTP and HTTPS monitors. */
  probeZone?: string;
  /** Body param: The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** Body param: The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** Body param: The protocol to use for the health check. Currently supported protocols are 'HTTP','HTTPS', 'TCP', 'ICMP-PING', 'UDP-ICMP', and 'SMTP'. */
  type?: "http" | "https" | "tcp" | "udp_icmp" | "icmp_ping" | "smtp";
}

export const UpdateMonitorRequest = Schema.Struct({
  monitorId: Schema.String.pipe(T.HttpPath("monitorId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
  consecutiveDown: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_down")),
  consecutiveUp: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_up")),
  description: Schema.optional(Schema.String),
  expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
  expectedCodes: Schema.optional(Schema.String).pipe(T.JsonName("expected_codes")),
  followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
  header: Schema.optional(Schema.Struct({})),
  interval: Schema.optional(Schema.Number),
  method: Schema.optional(Schema.String),
  path: Schema.optional(Schema.String),
  port: Schema.optional(Schema.Number),
  probeZone: Schema.optional(Schema.String).pipe(T.JsonName("probe_zone")),
  retries: Schema.optional(Schema.Number),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.Literal("http", "https", "tcp", "udp_icmp", "icmp_ping", "smtp")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/load_balancers/monitors/{monitorId}" }),
) as unknown as Schema.Schema<UpdateMonitorRequest>;

export interface UpdateMonitorResponse {
  id?: string;
  /** Do not validate the certificate when monitor use HTTPS. This parameter is currently only valid for HTTP and HTTPS monitors. */
  allowInsecure?: boolean;
  /** To be marked unhealthy the monitored origin must fail this healthcheck N consecutive times. */
  consecutiveDown?: number;
  /** To be marked healthy the monitored origin must pass this healthcheck N consecutive times. */
  consecutiveUp?: number;
  createdOn?: string;
  /** Object description. */
  description?: string;
  /** A case-insensitive sub-string to look for in the response body. If this string is not found, the origin will be marked as unhealthy. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedBody?: string;
  /** The expected HTTP response code or code range of the health check. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedCodes?: string;
  /** Follow redirects if returned by the origin. This parameter is only valid for HTTP and HTTPS monitors. */
  followRedirects?: boolean;
  /** The HTTP request headers to send in the health check. It is recommended you set a Host header by default. The User-Agent header cannot be overridden. This parameter is only valid for HTTP and HTTPS mo */
  header?: Record<string, unknown>;
  /** The interval between each health check. Shorter intervals may improve failover time, but will increase load on the origins as we check from multiple locations. */
  interval?: number;
  /** The method to use for the health check. This defaults to 'GET' for HTTP/HTTPS based checks and 'connection_established' for TCP based health checks. */
  method?: string;
  modifiedOn?: string;
  /** The endpoint path you want to conduct a health check against. This parameter is only valid for HTTP and HTTPS monitors. */
  path?: string;
  /** The port number to connect to for the health check. Required for TCP, UDP, and SMTP checks. HTTP and HTTPS checks should only define the port when using a non-standard port (HTTP: default 80, HTTPS: d */
  port?: number;
  /** Assign this monitor to emulate the specified zone while probing. This parameter is only valid for HTTP and HTTPS monitors. */
  probeZone?: string;
  /** The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** The protocol to use for the health check. Currently supported protocols are 'HTTP','HTTPS', 'TCP', 'ICMP-PING', 'UDP-ICMP', and 'SMTP'. */
  type?: "http" | "https" | "tcp" | "udp_icmp" | "icmp_ping" | "smtp";
}

export const UpdateMonitorResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
  consecutiveDown: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_down")),
  consecutiveUp: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_up")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
  expectedCodes: Schema.optional(Schema.String).pipe(T.JsonName("expected_codes")),
  followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
  header: Schema.optional(Schema.Struct({})),
  interval: Schema.optional(Schema.Number),
  method: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  path: Schema.optional(Schema.String),
  port: Schema.optional(Schema.Number),
  probeZone: Schema.optional(Schema.String).pipe(T.JsonName("probe_zone")),
  retries: Schema.optional(Schema.Number),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.Literal("http", "https", "tcp", "udp_icmp", "icmp_ping", "smtp")),
}) as unknown as Schema.Schema<UpdateMonitorResponse>;

export const updateMonitor = API.make(() => ({
  input: UpdateMonitorRequest,
  output: UpdateMonitorResponse,
  errors: [],
}));

export interface PatchMonitorRequest {
  monitorId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Do not validate the certificate when monitor use HTTPS. This parameter is currently only valid for HTTP and HTTPS monitors. */
  allowInsecure?: boolean;
  /** Body param: To be marked unhealthy the monitored origin must fail this healthcheck N consecutive times. */
  consecutiveDown?: number;
  /** Body param: To be marked healthy the monitored origin must pass this healthcheck N consecutive times. */
  consecutiveUp?: number;
  /** Body param: Object description. */
  description?: string;
  /** Body param: A case-insensitive sub-string to look for in the response body. If this string is not found, the origin will be marked as unhealthy. This parameter is only valid for HTTP and HTTPS monitor */
  expectedBody?: string;
  /** Body param: The expected HTTP response code or code range of the health check. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedCodes?: string;
  /** Body param: Follow redirects if returned by the origin. This parameter is only valid for HTTP and HTTPS monitors. */
  followRedirects?: boolean;
  /** Body param: The HTTP request headers to send in the health check. It is recommended you set a Host header by default. The User-Agent header cannot be overridden. This parameter is only valid for HTTP  */
  header?: Record<string, unknown>;
  /** Body param: The interval between each health check. Shorter intervals may improve failover time, but will increase load on the origins as we check from multiple locations. */
  interval?: number;
  /** Body param: The method to use for the health check. This defaults to 'GET' for HTTP/HTTPS based checks and 'connection_established' for TCP based health checks. */
  method?: string;
  /** Body param: The endpoint path you want to conduct a health check against. This parameter is only valid for HTTP and HTTPS monitors. */
  path?: string;
  /** Body param: The port number to connect to for the health check. Required for TCP, UDP, and SMTP checks. HTTP and HTTPS checks should only define the port when using a non-standard port (HTTP: default  */
  port?: number;
  /** Body param: Assign this monitor to emulate the specified zone while probing. This parameter is only valid for HTTP and HTTPS monitors. */
  probeZone?: string;
  /** Body param: The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** Body param: The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** Body param: The protocol to use for the health check. Currently supported protocols are 'HTTP','HTTPS', 'TCP', 'ICMP-PING', 'UDP-ICMP', and 'SMTP'. */
  type?: "http" | "https" | "tcp" | "udp_icmp" | "icmp_ping" | "smtp";
}

export const PatchMonitorRequest = Schema.Struct({
  monitorId: Schema.String.pipe(T.HttpPath("monitorId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
  consecutiveDown: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_down")),
  consecutiveUp: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_up")),
  description: Schema.optional(Schema.String),
  expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
  expectedCodes: Schema.optional(Schema.String).pipe(T.JsonName("expected_codes")),
  followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
  header: Schema.optional(Schema.Struct({})),
  interval: Schema.optional(Schema.Number),
  method: Schema.optional(Schema.String),
  path: Schema.optional(Schema.String),
  port: Schema.optional(Schema.Number),
  probeZone: Schema.optional(Schema.String).pipe(T.JsonName("probe_zone")),
  retries: Schema.optional(Schema.Number),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.Literal("http", "https", "tcp", "udp_icmp", "icmp_ping", "smtp")),
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/load_balancers/monitors/{monitorId}" }),
) as unknown as Schema.Schema<PatchMonitorRequest>;

export interface PatchMonitorResponse {
  id?: string;
  /** Do not validate the certificate when monitor use HTTPS. This parameter is currently only valid for HTTP and HTTPS monitors. */
  allowInsecure?: boolean;
  /** To be marked unhealthy the monitored origin must fail this healthcheck N consecutive times. */
  consecutiveDown?: number;
  /** To be marked healthy the monitored origin must pass this healthcheck N consecutive times. */
  consecutiveUp?: number;
  createdOn?: string;
  /** Object description. */
  description?: string;
  /** A case-insensitive sub-string to look for in the response body. If this string is not found, the origin will be marked as unhealthy. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedBody?: string;
  /** The expected HTTP response code or code range of the health check. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedCodes?: string;
  /** Follow redirects if returned by the origin. This parameter is only valid for HTTP and HTTPS monitors. */
  followRedirects?: boolean;
  /** The HTTP request headers to send in the health check. It is recommended you set a Host header by default. The User-Agent header cannot be overridden. This parameter is only valid for HTTP and HTTPS mo */
  header?: Record<string, unknown>;
  /** The interval between each health check. Shorter intervals may improve failover time, but will increase load on the origins as we check from multiple locations. */
  interval?: number;
  /** The method to use for the health check. This defaults to 'GET' for HTTP/HTTPS based checks and 'connection_established' for TCP based health checks. */
  method?: string;
  modifiedOn?: string;
  /** The endpoint path you want to conduct a health check against. This parameter is only valid for HTTP and HTTPS monitors. */
  path?: string;
  /** The port number to connect to for the health check. Required for TCP, UDP, and SMTP checks. HTTP and HTTPS checks should only define the port when using a non-standard port (HTTP: default 80, HTTPS: d */
  port?: number;
  /** Assign this monitor to emulate the specified zone while probing. This parameter is only valid for HTTP and HTTPS monitors. */
  probeZone?: string;
  /** The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** The protocol to use for the health check. Currently supported protocols are 'HTTP','HTTPS', 'TCP', 'ICMP-PING', 'UDP-ICMP', and 'SMTP'. */
  type?: "http" | "https" | "tcp" | "udp_icmp" | "icmp_ping" | "smtp";
}

export const PatchMonitorResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
  consecutiveDown: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_down")),
  consecutiveUp: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_up")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
  expectedCodes: Schema.optional(Schema.String).pipe(T.JsonName("expected_codes")),
  followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
  header: Schema.optional(Schema.Struct({})),
  interval: Schema.optional(Schema.Number),
  method: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  path: Schema.optional(Schema.String),
  port: Schema.optional(Schema.Number),
  probeZone: Schema.optional(Schema.String).pipe(T.JsonName("probe_zone")),
  retries: Schema.optional(Schema.Number),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.Literal("http", "https", "tcp", "udp_icmp", "icmp_ping", "smtp")),
}) as unknown as Schema.Schema<PatchMonitorResponse>;

export const patchMonitor = API.make(() => ({
  input: PatchMonitorRequest,
  output: PatchMonitorResponse,
  errors: [],
}));

export interface DeleteMonitorRequest {
  monitorId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteMonitorRequest = Schema.Struct({
  monitorId: Schema.String.pipe(T.HttpPath("monitorId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/load_balancers/monitors/{monitorId}" }),
) as unknown as Schema.Schema<DeleteMonitorRequest>;

export interface DeleteMonitorResponse {
  id?: string;
}

export const DeleteMonitorResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteMonitorResponse>;

export const deleteMonitor = API.make(() => ({
  input: DeleteMonitorRequest,
  output: DeleteMonitorResponse,
  errors: [],
}));

// =============================================================================
// MonitorGroup
// =============================================================================

export interface GetMonitorGroupRequest {
  monitorGroupId: string;
  /** Identifier. */
  accountId: string;
}

export const GetMonitorGroupRequest = Schema.Struct({
  monitorGroupId: Schema.String.pipe(T.HttpPath("monitorGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/load_balancers/monitor_groups/{monitorGroupId}",
  }),
) as unknown as Schema.Schema<GetMonitorGroupRequest>;

export interface GetMonitorGroupResponse {
  /** The ID of the Monitor Group to use for checking the health of origins within this pool. */
  id: string;
  /** A short description of the monitor group */
  description: string;
  /** List of monitors in this group */
  members: {
    enabled: boolean;
    monitorId: string;
    monitoringOnly: boolean;
    mustBeHealthy: boolean;
    createdAt?: string;
    updatedAt?: string;
  }[];
  /** The timestamp of when the monitor group was created */
  createdAt?: string;
  /** The timestamp of when the monitor group was last updated */
  updatedAt?: string;
}

export const GetMonitorGroupResponse = Schema.Struct({
  id: Schema.String,
  description: Schema.String,
  members: Schema.Array(
    Schema.Struct({
      enabled: Schema.Boolean,
      monitorId: Schema.String.pipe(T.JsonName("monitor_id")),
      monitoringOnly: Schema.Boolean.pipe(T.JsonName("monitoring_only")),
      mustBeHealthy: Schema.Boolean.pipe(T.JsonName("must_be_healthy")),
      createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
      updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
    }),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<GetMonitorGroupResponse>;

export const getMonitorGroup = API.make(() => ({
  input: GetMonitorGroupRequest,
  output: GetMonitorGroupResponse,
  errors: [],
}));

export interface CreateMonitorGroupRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The ID of the Monitor Group to use for checking the health of origins within this pool. */
  id: string;
  /** Body param: A short description of the monitor group */
  description: string;
  /** Body param: List of monitors in this group */
  members: {
    enabled: boolean;
    monitorId: string;
    monitoringOnly: boolean;
    mustBeHealthy: boolean;
  }[];
}

export const CreateMonitorGroupRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.String,
  description: Schema.String,
  members: Schema.Array(
    Schema.Struct({
      enabled: Schema.Boolean,
      monitorId: Schema.String.pipe(T.JsonName("monitor_id")),
      monitoringOnly: Schema.Boolean.pipe(T.JsonName("monitoring_only")),
      mustBeHealthy: Schema.Boolean.pipe(T.JsonName("must_be_healthy")),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/load_balancers/monitor_groups" }),
) as unknown as Schema.Schema<CreateMonitorGroupRequest>;

export interface CreateMonitorGroupResponse {
  /** The ID of the Monitor Group to use for checking the health of origins within this pool. */
  id: string;
  /** A short description of the monitor group */
  description: string;
  /** List of monitors in this group */
  members: {
    enabled: boolean;
    monitorId: string;
    monitoringOnly: boolean;
    mustBeHealthy: boolean;
    createdAt?: string;
    updatedAt?: string;
  }[];
  /** The timestamp of when the monitor group was created */
  createdAt?: string;
  /** The timestamp of when the monitor group was last updated */
  updatedAt?: string;
}

export const CreateMonitorGroupResponse = Schema.Struct({
  id: Schema.String,
  description: Schema.String,
  members: Schema.Array(
    Schema.Struct({
      enabled: Schema.Boolean,
      monitorId: Schema.String.pipe(T.JsonName("monitor_id")),
      monitoringOnly: Schema.Boolean.pipe(T.JsonName("monitoring_only")),
      mustBeHealthy: Schema.Boolean.pipe(T.JsonName("must_be_healthy")),
      createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
      updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
    }),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<CreateMonitorGroupResponse>;

export const createMonitorGroup = API.make(() => ({
  input: CreateMonitorGroupRequest,
  output: CreateMonitorGroupResponse,
  errors: [],
}));

export interface UpdateMonitorGroupRequest {
  monitorGroupId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The ID of the Monitor Group to use for checking the health of origins within this pool. */
  id: string;
  /** Body param: A short description of the monitor group */
  description: string;
  /** Body param: List of monitors in this group */
  members: {
    enabled: boolean;
    monitorId: string;
    monitoringOnly: boolean;
    mustBeHealthy: boolean;
  }[];
}

export const UpdateMonitorGroupRequest = Schema.Struct({
  monitorGroupId: Schema.String.pipe(T.HttpPath("monitorGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.String,
  description: Schema.String,
  members: Schema.Array(
    Schema.Struct({
      enabled: Schema.Boolean,
      monitorId: Schema.String.pipe(T.JsonName("monitor_id")),
      monitoringOnly: Schema.Boolean.pipe(T.JsonName("monitoring_only")),
      mustBeHealthy: Schema.Boolean.pipe(T.JsonName("must_be_healthy")),
    }),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/load_balancers/monitor_groups/{monitorGroupId}",
  }),
) as unknown as Schema.Schema<UpdateMonitorGroupRequest>;

export interface UpdateMonitorGroupResponse {
  /** The ID of the Monitor Group to use for checking the health of origins within this pool. */
  id: string;
  /** A short description of the monitor group */
  description: string;
  /** List of monitors in this group */
  members: {
    enabled: boolean;
    monitorId: string;
    monitoringOnly: boolean;
    mustBeHealthy: boolean;
    createdAt?: string;
    updatedAt?: string;
  }[];
  /** The timestamp of when the monitor group was created */
  createdAt?: string;
  /** The timestamp of when the monitor group was last updated */
  updatedAt?: string;
}

export const UpdateMonitorGroupResponse = Schema.Struct({
  id: Schema.String,
  description: Schema.String,
  members: Schema.Array(
    Schema.Struct({
      enabled: Schema.Boolean,
      monitorId: Schema.String.pipe(T.JsonName("monitor_id")),
      monitoringOnly: Schema.Boolean.pipe(T.JsonName("monitoring_only")),
      mustBeHealthy: Schema.Boolean.pipe(T.JsonName("must_be_healthy")),
      createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
      updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
    }),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<UpdateMonitorGroupResponse>;

export const updateMonitorGroup = API.make(() => ({
  input: UpdateMonitorGroupRequest,
  output: UpdateMonitorGroupResponse,
  errors: [],
}));

export interface PatchMonitorGroupRequest {
  monitorGroupId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The ID of the Monitor Group to use for checking the health of origins within this pool. */
  id: string;
  /** Body param: A short description of the monitor group */
  description: string;
  /** Body param: List of monitors in this group */
  members: {
    enabled: boolean;
    monitorId: string;
    monitoringOnly: boolean;
    mustBeHealthy: boolean;
  }[];
}

export const PatchMonitorGroupRequest = Schema.Struct({
  monitorGroupId: Schema.String.pipe(T.HttpPath("monitorGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.String,
  description: Schema.String,
  members: Schema.Array(
    Schema.Struct({
      enabled: Schema.Boolean,
      monitorId: Schema.String.pipe(T.JsonName("monitor_id")),
      monitoringOnly: Schema.Boolean.pipe(T.JsonName("monitoring_only")),
      mustBeHealthy: Schema.Boolean.pipe(T.JsonName("must_be_healthy")),
    }),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/load_balancers/monitor_groups/{monitorGroupId}",
  }),
) as unknown as Schema.Schema<PatchMonitorGroupRequest>;

export interface PatchMonitorGroupResponse {
  /** The ID of the Monitor Group to use for checking the health of origins within this pool. */
  id: string;
  /** A short description of the monitor group */
  description: string;
  /** List of monitors in this group */
  members: {
    enabled: boolean;
    monitorId: string;
    monitoringOnly: boolean;
    mustBeHealthy: boolean;
    createdAt?: string;
    updatedAt?: string;
  }[];
  /** The timestamp of when the monitor group was created */
  createdAt?: string;
  /** The timestamp of when the monitor group was last updated */
  updatedAt?: string;
}

export const PatchMonitorGroupResponse = Schema.Struct({
  id: Schema.String,
  description: Schema.String,
  members: Schema.Array(
    Schema.Struct({
      enabled: Schema.Boolean,
      monitorId: Schema.String.pipe(T.JsonName("monitor_id")),
      monitoringOnly: Schema.Boolean.pipe(T.JsonName("monitoring_only")),
      mustBeHealthy: Schema.Boolean.pipe(T.JsonName("must_be_healthy")),
      createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
      updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
    }),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<PatchMonitorGroupResponse>;

export const patchMonitorGroup = API.make(() => ({
  input: PatchMonitorGroupRequest,
  output: PatchMonitorGroupResponse,
  errors: [],
}));

export interface DeleteMonitorGroupRequest {
  monitorGroupId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteMonitorGroupRequest = Schema.Struct({
  monitorGroupId: Schema.String.pipe(T.HttpPath("monitorGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/load_balancers/monitor_groups/{monitorGroupId}",
  }),
) as unknown as Schema.Schema<DeleteMonitorGroupRequest>;

export interface DeleteMonitorGroupResponse {
  /** The ID of the Monitor Group to use for checking the health of origins within this pool. */
  id: string;
  /** A short description of the monitor group */
  description: string;
  /** List of monitors in this group */
  members: {
    enabled: boolean;
    monitorId: string;
    monitoringOnly: boolean;
    mustBeHealthy: boolean;
    createdAt?: string;
    updatedAt?: string;
  }[];
  /** The timestamp of when the monitor group was created */
  createdAt?: string;
  /** The timestamp of when the monitor group was last updated */
  updatedAt?: string;
}

export const DeleteMonitorGroupResponse = Schema.Struct({
  id: Schema.String,
  description: Schema.String,
  members: Schema.Array(
    Schema.Struct({
      enabled: Schema.Boolean,
      monitorId: Schema.String.pipe(T.JsonName("monitor_id")),
      monitoringOnly: Schema.Boolean.pipe(T.JsonName("monitoring_only")),
      mustBeHealthy: Schema.Boolean.pipe(T.JsonName("must_be_healthy")),
      createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
      updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
    }),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<DeleteMonitorGroupResponse>;

export const deleteMonitorGroup = API.make(() => ({
  input: DeleteMonitorGroupRequest,
  output: DeleteMonitorGroupResponse,
  errors: [],
}));

// =============================================================================
// MonitorPreview
// =============================================================================

export interface CreateMonitorPreviewRequest {
  monitorId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Do not validate the certificate when monitor use HTTPS. This parameter is currently only valid for HTTP and HTTPS monitors. */
  allowInsecure?: boolean;
  /** Body param: To be marked unhealthy the monitored origin must fail this healthcheck N consecutive times. */
  consecutiveDown?: number;
  /** Body param: To be marked healthy the monitored origin must pass this healthcheck N consecutive times. */
  consecutiveUp?: number;
  /** Body param: Object description. */
  description?: string;
  /** Body param: A case-insensitive sub-string to look for in the response body. If this string is not found, the origin will be marked as unhealthy. This parameter is only valid for HTTP and HTTPS monitor */
  expectedBody?: string;
  /** Body param: The expected HTTP response code or code range of the health check. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedCodes?: string;
  /** Body param: Follow redirects if returned by the origin. This parameter is only valid for HTTP and HTTPS monitors. */
  followRedirects?: boolean;
  /** Body param: The HTTP request headers to send in the health check. It is recommended you set a Host header by default. The User-Agent header cannot be overridden. This parameter is only valid for HTTP  */
  header?: Record<string, unknown>;
  /** Body param: The interval between each health check. Shorter intervals may improve failover time, but will increase load on the origins as we check from multiple locations. */
  interval?: number;
  /** Body param: The method to use for the health check. This defaults to 'GET' for HTTP/HTTPS based checks and 'connection_established' for TCP based health checks. */
  method?: string;
  /** Body param: The endpoint path you want to conduct a health check against. This parameter is only valid for HTTP and HTTPS monitors. */
  path?: string;
  /** Body param: The port number to connect to for the health check. Required for TCP, UDP, and SMTP checks. HTTP and HTTPS checks should only define the port when using a non-standard port (HTTP: default  */
  port?: number;
  /** Body param: Assign this monitor to emulate the specified zone while probing. This parameter is only valid for HTTP and HTTPS monitors. */
  probeZone?: string;
  /** Body param: The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** Body param: The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** Body param: The protocol to use for the health check. Currently supported protocols are 'HTTP','HTTPS', 'TCP', 'ICMP-PING', 'UDP-ICMP', and 'SMTP'. */
  type?: "http" | "https" | "tcp" | "udp_icmp" | "icmp_ping" | "smtp";
}

export const CreateMonitorPreviewRequest = Schema.Struct({
  monitorId: Schema.String.pipe(T.HttpPath("monitorId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
  consecutiveDown: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_down")),
  consecutiveUp: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_up")),
  description: Schema.optional(Schema.String),
  expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
  expectedCodes: Schema.optional(Schema.String).pipe(T.JsonName("expected_codes")),
  followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
  header: Schema.optional(Schema.Struct({})),
  interval: Schema.optional(Schema.Number),
  method: Schema.optional(Schema.String),
  path: Schema.optional(Schema.String),
  port: Schema.optional(Schema.Number),
  probeZone: Schema.optional(Schema.String).pipe(T.JsonName("probe_zone")),
  retries: Schema.optional(Schema.Number),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.Literal("http", "https", "tcp", "udp_icmp", "icmp_ping", "smtp")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/load_balancers/monitors/{monitorId}/preview",
  }),
) as unknown as Schema.Schema<CreateMonitorPreviewRequest>;

export interface CreateMonitorPreviewResponse {
  /** Monitored pool IDs mapped to their respective names. */
  pools?: Record<string, unknown>;
  previewId?: string;
}

export const CreateMonitorPreviewResponse = Schema.Struct({
  pools: Schema.optional(Schema.Struct({})),
  previewId: Schema.optional(Schema.String).pipe(T.JsonName("preview_id")),
}) as unknown as Schema.Schema<CreateMonitorPreviewResponse>;

export const createMonitorPreview = API.make(() => ({
  input: CreateMonitorPreviewRequest,
  output: CreateMonitorPreviewResponse,
  errors: [],
}));

// =============================================================================
// Pool
// =============================================================================

export interface GetPoolRequest {
  poolId: string;
  /** Identifier. */
  accountId: string;
}

export const GetPoolRequest = Schema.Struct({
  poolId: Schema.String.pipe(T.HttpPath("poolId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/load_balancers/pools/{poolId}" }),
) as unknown as Schema.Schema<GetPoolRequest>;

export interface GetPoolResponse {
  id?: string;
  /** A list of regions from which to run health checks. Null means every Cloudflare data center. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
        | "SAS"
      )[]
    | null;
  createdOn?: string;
  /** A human-readable description of the pool. */
  description?: string;
  /** This field shows up only if the pool is disabled. This field is set with the time the pool was disabled at. */
  disabledAt?: string;
  /** Whether to enable (the default) or disable this pool. Disabled pools will not receive traffic and are excluded from health checks. Disabling a pool will cause any load balancers using it to failover t */
  enabled?: boolean;
  /** The latitude of the data center containing the origins used in this pool in decimal degrees. If this is set, longitude must also be set. */
  latitude?: number;
  /** Configures load shedding policies and percentages for the pool. */
  loadShedding?: unknown;
  /** The longitude of the data center containing the origins used in this pool in decimal degrees. If this is set, latitude must also be set. */
  longitude?: number;
  /** The minimum number of origins that must be healthy for this pool to serve traffic. If the number of healthy origins falls below this number, the pool will be marked unhealthy and will failover to the  */
  minimumOrigins?: number;
  modifiedOn?: string;
  /** The ID of the Monitor to use for checking the health of origins within this pool. */
  monitor?: string;
  /** The ID of the Monitor Group to use for checking the health of origins within this pool. */
  monitorGroup?: string;
  /** A short name (tag) for the pool. Only alphanumeric characters, hyphens, and underscores are allowed. */
  name?: string;
  /** List of networks where Load Balancer or Pool is enabled. */
  networks?: string[];
  /** This field is now deprecated. It has been moved to Cloudflare's Centralized Notification service https://developers.cloudflare.com/fundamentals/notifications/. The email address to send health status  */
  notificationEmail?: string;
  /** Filter pool and origin health notifications by resource type or health status. Use null to reset. */
  notificationFilter?: unknown | null;
  /** Configures origin steering for the pool. Controls how origins are selected for new sessions and traffic without session affinity. */
  originSteering?: unknown;
  /** The list of origins within this pool. Traffic directed at this pool is balanced across all currently healthy origins, provided the pool itself is healthy. */
  origins?: unknown[];
}

export const GetPoolResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
          "SAS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  disabledAt: Schema.optional(Schema.String).pipe(T.JsonName("disabled_at")),
  enabled: Schema.optional(Schema.Boolean),
  latitude: Schema.optional(Schema.Number),
  loadShedding: Schema.optional(Schema.Unknown).pipe(T.JsonName("load_shedding")),
  longitude: Schema.optional(Schema.Number),
  minimumOrigins: Schema.optional(Schema.Number).pipe(T.JsonName("minimum_origins")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  monitor: Schema.optional(Schema.String),
  monitorGroup: Schema.optional(Schema.String).pipe(T.JsonName("monitor_group")),
  name: Schema.optional(Schema.String),
  networks: Schema.optional(Schema.Array(Schema.String)),
  notificationEmail: Schema.optional(Schema.String).pipe(T.JsonName("notification_email")),
  notificationFilter: Schema.optional(Schema.Union(Schema.Unknown, Schema.Null)).pipe(
    T.JsonName("notification_filter"),
  ),
  originSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("origin_steering")),
  origins: Schema.optional(Schema.Array(Schema.Unknown)),
}) as unknown as Schema.Schema<GetPoolResponse>;

export const getPool = API.make(() => ({
  input: GetPoolRequest,
  output: GetPoolResponse,
  errors: [],
}));

export interface CreatePoolRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: A short name (tag) for the pool. Only alphanumeric characters, hyphens, and underscores are allowed. */
  name: string;
  /** Body param: The list of origins within this pool. Traffic directed at this pool is balanced across all currently healthy origins, provided the pool itself is healthy. */
  origins: unknown[];
  /** Body param: A human-readable description of the pool. */
  description?: string;
  /** Body param: Whether to enable (the default) or disable this pool. Disabled pools will not receive traffic and are excluded from health checks. Disabling a pool will cause any load balancers using it t */
  enabled?: boolean;
  /** Body param: The latitude of the data center containing the origins used in this pool in decimal degrees. If this is set, longitude must also be set. */
  latitude?: number;
  /** Body param: Configures load shedding policies and percentages for the pool. */
  loadShedding?: unknown;
  /** Body param: The longitude of the data center containing the origins used in this pool in decimal degrees. If this is set, latitude must also be set. */
  longitude?: number;
  /** Body param: The minimum number of origins that must be healthy for this pool to serve traffic. If the number of healthy origins falls below this number, the pool will be marked unhealthy and will fail */
  minimumOrigins?: number;
  /** Body param: The ID of the Monitor to use for checking the health of origins within this pool. */
  monitor?: string;
  /** Body param: The ID of the Monitor Group to use for checking the health of origins within this pool. */
  monitorGroup?: string;
  /** Body param: This field is now deprecated. It has been moved to Cloudflare's Centralized Notification service https://developers.cloudflare.com/fundamentals/notifications/. The email address to send he */
  notificationEmail?: string;
  /** Body param: Filter pool and origin health notifications by resource type or health status. Use null to reset. */
  notificationFilter?: unknown | null;
  /** Body param: Configures origin steering for the pool. Controls how origins are selected for new sessions and traffic without session affinity. */
  originSteering?: unknown;
}

export const CreatePoolRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  origins: Schema.Array(Schema.Unknown),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  latitude: Schema.optional(Schema.Number),
  loadShedding: Schema.optional(Schema.Unknown).pipe(T.JsonName("load_shedding")),
  longitude: Schema.optional(Schema.Number),
  minimumOrigins: Schema.optional(Schema.Number).pipe(T.JsonName("minimum_origins")),
  monitor: Schema.optional(Schema.String),
  monitorGroup: Schema.optional(Schema.String).pipe(T.JsonName("monitor_group")),
  notificationEmail: Schema.optional(Schema.String).pipe(T.JsonName("notification_email")),
  notificationFilter: Schema.optional(Schema.Union(Schema.Unknown, Schema.Null)).pipe(
    T.JsonName("notification_filter"),
  ),
  originSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("origin_steering")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/load_balancers/pools" }),
) as unknown as Schema.Schema<CreatePoolRequest>;

export interface CreatePoolResponse {
  id?: string;
  /** A list of regions from which to run health checks. Null means every Cloudflare data center. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
        | "SAS"
      )[]
    | null;
  createdOn?: string;
  /** A human-readable description of the pool. */
  description?: string;
  /** This field shows up only if the pool is disabled. This field is set with the time the pool was disabled at. */
  disabledAt?: string;
  /** Whether to enable (the default) or disable this pool. Disabled pools will not receive traffic and are excluded from health checks. Disabling a pool will cause any load balancers using it to failover t */
  enabled?: boolean;
  /** The latitude of the data center containing the origins used in this pool in decimal degrees. If this is set, longitude must also be set. */
  latitude?: number;
  /** Configures load shedding policies and percentages for the pool. */
  loadShedding?: unknown;
  /** The longitude of the data center containing the origins used in this pool in decimal degrees. If this is set, latitude must also be set. */
  longitude?: number;
  /** The minimum number of origins that must be healthy for this pool to serve traffic. If the number of healthy origins falls below this number, the pool will be marked unhealthy and will failover to the  */
  minimumOrigins?: number;
  modifiedOn?: string;
  /** The ID of the Monitor to use for checking the health of origins within this pool. */
  monitor?: string;
  /** The ID of the Monitor Group to use for checking the health of origins within this pool. */
  monitorGroup?: string;
  /** A short name (tag) for the pool. Only alphanumeric characters, hyphens, and underscores are allowed. */
  name?: string;
  /** List of networks where Load Balancer or Pool is enabled. */
  networks?: string[];
  /** This field is now deprecated. It has been moved to Cloudflare's Centralized Notification service https://developers.cloudflare.com/fundamentals/notifications/. The email address to send health status  */
  notificationEmail?: string;
  /** Filter pool and origin health notifications by resource type or health status. Use null to reset. */
  notificationFilter?: unknown | null;
  /** Configures origin steering for the pool. Controls how origins are selected for new sessions and traffic without session affinity. */
  originSteering?: unknown;
  /** The list of origins within this pool. Traffic directed at this pool is balanced across all currently healthy origins, provided the pool itself is healthy. */
  origins?: unknown[];
}

export const CreatePoolResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
          "SAS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  disabledAt: Schema.optional(Schema.String).pipe(T.JsonName("disabled_at")),
  enabled: Schema.optional(Schema.Boolean),
  latitude: Schema.optional(Schema.Number),
  loadShedding: Schema.optional(Schema.Unknown).pipe(T.JsonName("load_shedding")),
  longitude: Schema.optional(Schema.Number),
  minimumOrigins: Schema.optional(Schema.Number).pipe(T.JsonName("minimum_origins")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  monitor: Schema.optional(Schema.String),
  monitorGroup: Schema.optional(Schema.String).pipe(T.JsonName("monitor_group")),
  name: Schema.optional(Schema.String),
  networks: Schema.optional(Schema.Array(Schema.String)),
  notificationEmail: Schema.optional(Schema.String).pipe(T.JsonName("notification_email")),
  notificationFilter: Schema.optional(Schema.Union(Schema.Unknown, Schema.Null)).pipe(
    T.JsonName("notification_filter"),
  ),
  originSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("origin_steering")),
  origins: Schema.optional(Schema.Array(Schema.Unknown)),
}) as unknown as Schema.Schema<CreatePoolResponse>;

export const createPool = API.make(() => ({
  input: CreatePoolRequest,
  output: CreatePoolResponse,
  errors: [],
}));

export interface UpdatePoolRequest {
  poolId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: A short name (tag) for the pool. Only alphanumeric characters, hyphens, and underscores are allowed. */
  name: string;
  /** Body param: The list of origins within this pool. Traffic directed at this pool is balanced across all currently healthy origins, provided the pool itself is healthy. */
  origins: unknown[];
  /** Body param: A list of regions from which to run health checks. Null means every Cloudflare data center. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
        | "SAS"
      )[]
    | null;
  /** Body param: A human-readable description of the pool. */
  description?: string;
  /** Body param: Whether to enable (the default) or disable this pool. Disabled pools will not receive traffic and are excluded from health checks. Disabling a pool will cause any load balancers using it t */
  enabled?: boolean;
  /** Body param: The latitude of the data center containing the origins used in this pool in decimal degrees. If this is set, longitude must also be set. */
  latitude?: number;
  /** Body param: Configures load shedding policies and percentages for the pool. */
  loadShedding?: unknown;
  /** Body param: The longitude of the data center containing the origins used in this pool in decimal degrees. If this is set, latitude must also be set. */
  longitude?: number;
  /** Body param: The minimum number of origins that must be healthy for this pool to serve traffic. If the number of healthy origins falls below this number, the pool will be marked unhealthy and will fail */
  minimumOrigins?: number;
  /** Body param: The ID of the Monitor to use for checking the health of origins within this pool. */
  monitor?: string;
  /** Body param: The ID of the Monitor Group to use for checking the health of origins within this pool. */
  monitorGroup?: string;
  /** Body param: This field is now deprecated. It has been moved to Cloudflare's Centralized Notification service https://developers.cloudflare.com/fundamentals/notifications/. The email address to send he */
  notificationEmail?: string;
  /** Body param: Filter pool and origin health notifications by resource type or health status. Use null to reset. */
  notificationFilter?: unknown | null;
  /** Body param: Configures origin steering for the pool. Controls how origins are selected for new sessions and traffic without session affinity. */
  originSteering?: unknown;
}

export const UpdatePoolRequest = Schema.Struct({
  poolId: Schema.String.pipe(T.HttpPath("poolId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  origins: Schema.Array(Schema.Unknown),
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
          "SAS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  latitude: Schema.optional(Schema.Number),
  loadShedding: Schema.optional(Schema.Unknown).pipe(T.JsonName("load_shedding")),
  longitude: Schema.optional(Schema.Number),
  minimumOrigins: Schema.optional(Schema.Number).pipe(T.JsonName("minimum_origins")),
  monitor: Schema.optional(Schema.String),
  monitorGroup: Schema.optional(Schema.String).pipe(T.JsonName("monitor_group")),
  notificationEmail: Schema.optional(Schema.String).pipe(T.JsonName("notification_email")),
  notificationFilter: Schema.optional(Schema.Union(Schema.Unknown, Schema.Null)).pipe(
    T.JsonName("notification_filter"),
  ),
  originSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("origin_steering")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/load_balancers/pools/{poolId}" }),
) as unknown as Schema.Schema<UpdatePoolRequest>;

export interface UpdatePoolResponse {
  id?: string;
  /** A list of regions from which to run health checks. Null means every Cloudflare data center. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
        | "SAS"
      )[]
    | null;
  createdOn?: string;
  /** A human-readable description of the pool. */
  description?: string;
  /** This field shows up only if the pool is disabled. This field is set with the time the pool was disabled at. */
  disabledAt?: string;
  /** Whether to enable (the default) or disable this pool. Disabled pools will not receive traffic and are excluded from health checks. Disabling a pool will cause any load balancers using it to failover t */
  enabled?: boolean;
  /** The latitude of the data center containing the origins used in this pool in decimal degrees. If this is set, longitude must also be set. */
  latitude?: number;
  /** Configures load shedding policies and percentages for the pool. */
  loadShedding?: unknown;
  /** The longitude of the data center containing the origins used in this pool in decimal degrees. If this is set, latitude must also be set. */
  longitude?: number;
  /** The minimum number of origins that must be healthy for this pool to serve traffic. If the number of healthy origins falls below this number, the pool will be marked unhealthy and will failover to the  */
  minimumOrigins?: number;
  modifiedOn?: string;
  /** The ID of the Monitor to use for checking the health of origins within this pool. */
  monitor?: string;
  /** The ID of the Monitor Group to use for checking the health of origins within this pool. */
  monitorGroup?: string;
  /** A short name (tag) for the pool. Only alphanumeric characters, hyphens, and underscores are allowed. */
  name?: string;
  /** List of networks where Load Balancer or Pool is enabled. */
  networks?: string[];
  /** This field is now deprecated. It has been moved to Cloudflare's Centralized Notification service https://developers.cloudflare.com/fundamentals/notifications/. The email address to send health status  */
  notificationEmail?: string;
  /** Filter pool and origin health notifications by resource type or health status. Use null to reset. */
  notificationFilter?: unknown | null;
  /** Configures origin steering for the pool. Controls how origins are selected for new sessions and traffic without session affinity. */
  originSteering?: unknown;
  /** The list of origins within this pool. Traffic directed at this pool is balanced across all currently healthy origins, provided the pool itself is healthy. */
  origins?: unknown[];
}

export const UpdatePoolResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
          "SAS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  disabledAt: Schema.optional(Schema.String).pipe(T.JsonName("disabled_at")),
  enabled: Schema.optional(Schema.Boolean),
  latitude: Schema.optional(Schema.Number),
  loadShedding: Schema.optional(Schema.Unknown).pipe(T.JsonName("load_shedding")),
  longitude: Schema.optional(Schema.Number),
  minimumOrigins: Schema.optional(Schema.Number).pipe(T.JsonName("minimum_origins")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  monitor: Schema.optional(Schema.String),
  monitorGroup: Schema.optional(Schema.String).pipe(T.JsonName("monitor_group")),
  name: Schema.optional(Schema.String),
  networks: Schema.optional(Schema.Array(Schema.String)),
  notificationEmail: Schema.optional(Schema.String).pipe(T.JsonName("notification_email")),
  notificationFilter: Schema.optional(Schema.Union(Schema.Unknown, Schema.Null)).pipe(
    T.JsonName("notification_filter"),
  ),
  originSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("origin_steering")),
  origins: Schema.optional(Schema.Array(Schema.Unknown)),
}) as unknown as Schema.Schema<UpdatePoolResponse>;

export const updatePool = API.make(() => ({
  input: UpdatePoolRequest,
  output: UpdatePoolResponse,
  errors: [],
}));

export interface PatchPoolRequest {
  poolId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: A list of regions from which to run health checks. Null means every Cloudflare data center. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
        | "SAS"
      )[]
    | null;
  /** Body param: A human-readable description of the pool. */
  description?: string;
  /** Body param: Whether to enable (the default) or disable this pool. Disabled pools will not receive traffic and are excluded from health checks. Disabling a pool will cause any load balancers using it t */
  enabled?: boolean;
  /** Body param: The latitude of the data center containing the origins used in this pool in decimal degrees. If this is set, longitude must also be set. */
  latitude?: number;
  /** Body param: Configures load shedding policies and percentages for the pool. */
  loadShedding?: unknown;
  /** Body param: The longitude of the data center containing the origins used in this pool in decimal degrees. If this is set, latitude must also be set. */
  longitude?: number;
  /** Body param: The minimum number of origins that must be healthy for this pool to serve traffic. If the number of healthy origins falls below this number, the pool will be marked unhealthy and will fail */
  minimumOrigins?: number;
  /** Body param: The ID of the Monitor to use for checking the health of origins within this pool. */
  monitor?: string;
  /** Body param: The ID of the Monitor Group to use for checking the health of origins within this pool. */
  monitorGroup?: string;
  /** Body param: A short name (tag) for the pool. Only alphanumeric characters, hyphens, and underscores are allowed. */
  name?: string;
  /** Body param: This field is now deprecated. It has been moved to Cloudflare's Centralized Notification service https://developers.cloudflare.com/fundamentals/notifications/. The email address to send he */
  notificationEmail?: string;
  /** Body param: Filter pool and origin health notifications by resource type or health status. Use null to reset. */
  notificationFilter?: unknown | null;
  /** Body param: Configures origin steering for the pool. Controls how origins are selected for new sessions and traffic without session affinity. */
  originSteering?: unknown;
  /** Body param: The list of origins within this pool. Traffic directed at this pool is balanced across all currently healthy origins, provided the pool itself is healthy. */
  origins?: unknown[];
}

export const PatchPoolRequest = Schema.Struct({
  poolId: Schema.String.pipe(T.HttpPath("poolId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
          "SAS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  latitude: Schema.optional(Schema.Number),
  loadShedding: Schema.optional(Schema.Unknown).pipe(T.JsonName("load_shedding")),
  longitude: Schema.optional(Schema.Number),
  minimumOrigins: Schema.optional(Schema.Number).pipe(T.JsonName("minimum_origins")),
  monitor: Schema.optional(Schema.String),
  monitorGroup: Schema.optional(Schema.String).pipe(T.JsonName("monitor_group")),
  name: Schema.optional(Schema.String),
  notificationEmail: Schema.optional(Schema.String).pipe(T.JsonName("notification_email")),
  notificationFilter: Schema.optional(Schema.Union(Schema.Unknown, Schema.Null)).pipe(
    T.JsonName("notification_filter"),
  ),
  originSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("origin_steering")),
  origins: Schema.optional(Schema.Array(Schema.Unknown)),
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/load_balancers/pools/{poolId}" }),
) as unknown as Schema.Schema<PatchPoolRequest>;

export interface PatchPoolResponse {
  id?: string;
  /** A list of regions from which to run health checks. Null means every Cloudflare data center. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
        | "SAS"
      )[]
    | null;
  createdOn?: string;
  /** A human-readable description of the pool. */
  description?: string;
  /** This field shows up only if the pool is disabled. This field is set with the time the pool was disabled at. */
  disabledAt?: string;
  /** Whether to enable (the default) or disable this pool. Disabled pools will not receive traffic and are excluded from health checks. Disabling a pool will cause any load balancers using it to failover t */
  enabled?: boolean;
  /** The latitude of the data center containing the origins used in this pool in decimal degrees. If this is set, longitude must also be set. */
  latitude?: number;
  /** Configures load shedding policies and percentages for the pool. */
  loadShedding?: unknown;
  /** The longitude of the data center containing the origins used in this pool in decimal degrees. If this is set, latitude must also be set. */
  longitude?: number;
  /** The minimum number of origins that must be healthy for this pool to serve traffic. If the number of healthy origins falls below this number, the pool will be marked unhealthy and will failover to the  */
  minimumOrigins?: number;
  modifiedOn?: string;
  /** The ID of the Monitor to use for checking the health of origins within this pool. */
  monitor?: string;
  /** The ID of the Monitor Group to use for checking the health of origins within this pool. */
  monitorGroup?: string;
  /** A short name (tag) for the pool. Only alphanumeric characters, hyphens, and underscores are allowed. */
  name?: string;
  /** List of networks where Load Balancer or Pool is enabled. */
  networks?: string[];
  /** This field is now deprecated. It has been moved to Cloudflare's Centralized Notification service https://developers.cloudflare.com/fundamentals/notifications/. The email address to send health status  */
  notificationEmail?: string;
  /** Filter pool and origin health notifications by resource type or health status. Use null to reset. */
  notificationFilter?: unknown | null;
  /** Configures origin steering for the pool. Controls how origins are selected for new sessions and traffic without session affinity. */
  originSteering?: unknown;
  /** The list of origins within this pool. Traffic directed at this pool is balanced across all currently healthy origins, provided the pool itself is healthy. */
  origins?: unknown[];
}

export const PatchPoolResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
          "SAS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  disabledAt: Schema.optional(Schema.String).pipe(T.JsonName("disabled_at")),
  enabled: Schema.optional(Schema.Boolean),
  latitude: Schema.optional(Schema.Number),
  loadShedding: Schema.optional(Schema.Unknown).pipe(T.JsonName("load_shedding")),
  longitude: Schema.optional(Schema.Number),
  minimumOrigins: Schema.optional(Schema.Number).pipe(T.JsonName("minimum_origins")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  monitor: Schema.optional(Schema.String),
  monitorGroup: Schema.optional(Schema.String).pipe(T.JsonName("monitor_group")),
  name: Schema.optional(Schema.String),
  networks: Schema.optional(Schema.Array(Schema.String)),
  notificationEmail: Schema.optional(Schema.String).pipe(T.JsonName("notification_email")),
  notificationFilter: Schema.optional(Schema.Union(Schema.Unknown, Schema.Null)).pipe(
    T.JsonName("notification_filter"),
  ),
  originSteering: Schema.optional(Schema.Unknown).pipe(T.JsonName("origin_steering")),
  origins: Schema.optional(Schema.Array(Schema.Unknown)),
}) as unknown as Schema.Schema<PatchPoolResponse>;

export const patchPool = API.make(() => ({
  input: PatchPoolRequest,
  output: PatchPoolResponse,
  errors: [],
}));

export interface DeletePoolRequest {
  poolId: string;
  /** Identifier. */
  accountId: string;
}

export const DeletePoolRequest = Schema.Struct({
  poolId: Schema.String.pipe(T.HttpPath("poolId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/load_balancers/pools/{poolId}" }),
) as unknown as Schema.Schema<DeletePoolRequest>;

export interface DeletePoolResponse {
  id?: string;
}

export const DeletePoolResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeletePoolResponse>;

export const deletePool = API.make(() => ({
  input: DeletePoolRequest,
  output: DeletePoolResponse,
  errors: [],
}));

// =============================================================================
// PoolHealth
// =============================================================================

export interface GetPoolHealthRequest {
  poolId: string;
  /** Identifier. */
  accountId: string;
}

export const GetPoolHealthRequest = Schema.Struct({
  poolId: Schema.String.pipe(T.HttpPath("poolId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/load_balancers/pools/{poolId}/health" }),
) as unknown as Schema.Schema<GetPoolHealthRequest>;

export interface GetPoolHealthResponse {
  /** Pool ID. */
  poolId?: string;
  /** List of regions and associated health status. */
  popHealth?: {
    healthy?: boolean;
    origins?: {
      ip?: { failureReason?: string; healthy?: boolean; responseCode?: number; rtt?: string };
    }[];
  };
}

export const GetPoolHealthResponse = Schema.Struct({
  poolId: Schema.optional(Schema.String).pipe(T.JsonName("pool_id")),
  popHealth: Schema.optional(
    Schema.Struct({
      healthy: Schema.optional(Schema.Boolean),
      origins: Schema.optional(
        Schema.Array(
          Schema.Struct({
            ip: Schema.optional(
              Schema.Struct({
                failureReason: Schema.optional(Schema.String).pipe(T.JsonName("failure_reason")),
                healthy: Schema.optional(Schema.Boolean),
                responseCode: Schema.optional(Schema.Number).pipe(T.JsonName("response_code")),
                rtt: Schema.optional(Schema.String),
              }),
            ),
          }),
        ),
      ),
    }),
  ).pipe(T.JsonName("pop_health")),
}) as unknown as Schema.Schema<GetPoolHealthResponse>;

export const getPoolHealth = API.make(() => ({
  input: GetPoolHealthRequest,
  output: GetPoolHealthResponse,
  errors: [],
}));

export interface CreatePoolHealthRequest {
  poolId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Do not validate the certificate when monitor use HTTPS. This parameter is currently only valid for HTTP and HTTPS monitors. */
  allowInsecure?: boolean;
  /** Body param: To be marked unhealthy the monitored origin must fail this healthcheck N consecutive times. */
  consecutiveDown?: number;
  /** Body param: To be marked healthy the monitored origin must pass this healthcheck N consecutive times. */
  consecutiveUp?: number;
  /** Body param: Object description. */
  description?: string;
  /** Body param: A case-insensitive sub-string to look for in the response body. If this string is not found, the origin will be marked as unhealthy. This parameter is only valid for HTTP and HTTPS monitor */
  expectedBody?: string;
  /** Body param: The expected HTTP response code or code range of the health check. This parameter is only valid for HTTP and HTTPS monitors. */
  expectedCodes?: string;
  /** Body param: Follow redirects if returned by the origin. This parameter is only valid for HTTP and HTTPS monitors. */
  followRedirects?: boolean;
  /** Body param: The HTTP request headers to send in the health check. It is recommended you set a Host header by default. The User-Agent header cannot be overridden. This parameter is only valid for HTTP  */
  header?: Record<string, unknown>;
  /** Body param: The interval between each health check. Shorter intervals may improve failover time, but will increase load on the origins as we check from multiple locations. */
  interval?: number;
  /** Body param: The method to use for the health check. This defaults to 'GET' for HTTP/HTTPS based checks and 'connection_established' for TCP based health checks. */
  method?: string;
  /** Body param: The endpoint path you want to conduct a health check against. This parameter is only valid for HTTP and HTTPS monitors. */
  path?: string;
  /** Body param: The port number to connect to for the health check. Required for TCP, UDP, and SMTP checks. HTTP and HTTPS checks should only define the port when using a non-standard port (HTTP: default  */
  port?: number;
  /** Body param: Assign this monitor to emulate the specified zone while probing. This parameter is only valid for HTTP and HTTPS monitors. */
  probeZone?: string;
  /** Body param: The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** Body param: The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** Body param: The protocol to use for the health check. Currently supported protocols are 'HTTP','HTTPS', 'TCP', 'ICMP-PING', 'UDP-ICMP', and 'SMTP'. */
  type?: "http" | "https" | "tcp" | "udp_icmp" | "icmp_ping" | "smtp";
}

export const CreatePoolHealthRequest = Schema.Struct({
  poolId: Schema.String.pipe(T.HttpPath("poolId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
  consecutiveDown: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_down")),
  consecutiveUp: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_up")),
  description: Schema.optional(Schema.String),
  expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
  expectedCodes: Schema.optional(Schema.String).pipe(T.JsonName("expected_codes")),
  followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
  header: Schema.optional(Schema.Struct({})),
  interval: Schema.optional(Schema.Number),
  method: Schema.optional(Schema.String),
  path: Schema.optional(Schema.String),
  port: Schema.optional(Schema.Number),
  probeZone: Schema.optional(Schema.String).pipe(T.JsonName("probe_zone")),
  retries: Schema.optional(Schema.Number),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.Literal("http", "https", "tcp", "udp_icmp", "icmp_ping", "smtp")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/load_balancers/pools/{poolId}/preview" }),
) as unknown as Schema.Schema<CreatePoolHealthRequest>;

export interface CreatePoolHealthResponse {
  /** Monitored pool IDs mapped to their respective names. */
  pools?: Record<string, unknown>;
  previewId?: string;
}

export const CreatePoolHealthResponse = Schema.Struct({
  pools: Schema.optional(Schema.Struct({})),
  previewId: Schema.optional(Schema.String).pipe(T.JsonName("preview_id")),
}) as unknown as Schema.Schema<CreatePoolHealthResponse>;

export const createPoolHealth = API.make(() => ({
  input: CreatePoolHealthRequest,
  output: CreatePoolHealthResponse,
  errors: [],
}));

// =============================================================================
// Preview
// =============================================================================

export interface GetPreviewRequest {
  previewId: string;
  /** Identifier. */
  accountId: string;
}

export const GetPreviewRequest = Schema.Struct({
  previewId: Schema.String.pipe(T.HttpPath("previewId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/load_balancers/preview/{previewId}" }),
) as unknown as Schema.Schema<GetPreviewRequest>;

export type GetPreviewResponse = Record<string, unknown>;

export const GetPreviewResponse = Schema.Struct({}) as unknown as Schema.Schema<GetPreviewResponse>;

export const getPreview = API.make(() => ({
  input: GetPreviewRequest,
  output: GetPreviewResponse,
  errors: [],
}));

// =============================================================================
// Region
// =============================================================================

export interface GetRegionRequest {
  regionId:
    | "WNAM"
    | "ENAM"
    | "WEU"
    | "EEU"
    | "NSAM"
    | "SSAM"
    | "OC"
    | "ME"
    | "NAF"
    | "SAF"
    | "SAS"
    | "SEAS"
    | "NEAS";
  /** Identifier. */
  accountId: string;
}

export const GetRegionRequest = Schema.Struct({
  regionId: Schema.Literal(
    "WNAM",
    "ENAM",
    "WEU",
    "EEU",
    "NSAM",
    "SSAM",
    "OC",
    "ME",
    "NAF",
    "SAF",
    "SAS",
    "SEAS",
    "NEAS",
  ).pipe(T.HttpPath("regionId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/load_balancers/regions/{regionId}" }),
) as unknown as Schema.Schema<GetRegionRequest>;

export type GetRegionResponse = string | null;

export const GetRegionResponse = Schema.Union(
  Schema.String,
  Schema.Null,
) as unknown as Schema.Schema<GetRegionResponse>;

export const getRegion = API.make(() => ({
  input: GetRegionRequest,
  output: GetRegionResponse,
  errors: [],
}));

export interface ListRegionsRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: Two-letter alpha-2 country code followed in ISO 3166-1. */
  countryCodeA2?: string;
  /** Query param: Two-letter subdivision code followed in ISO 3166-2. */
  subdivisionCode?: string;
  /** Query param: Two-letter subdivision code followed in ISO 3166-2. */
  subdivisionCodeA2?: string;
}

export const ListRegionsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  countryCodeA2: Schema.optional(Schema.String).pipe(T.HttpQuery("country_code_a2")),
  subdivisionCode: Schema.optional(Schema.String).pipe(T.HttpQuery("subdivision_code")),
  subdivisionCodeA2: Schema.optional(Schema.String).pipe(T.HttpQuery("subdivision_code_a2")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/load_balancers/regions" }),
) as unknown as Schema.Schema<ListRegionsRequest>;

export type ListRegionsResponse = string | null;

export const ListRegionsResponse = Schema.Union(
  Schema.String,
  Schema.Null,
) as unknown as Schema.Schema<ListRegionsResponse>;

export const listRegions = API.make(() => ({
  input: ListRegionsRequest,
  output: ListRegionsResponse,
  errors: [],
}));

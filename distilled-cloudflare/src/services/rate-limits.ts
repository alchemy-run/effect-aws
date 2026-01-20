/**
 * Cloudflare RATE-LIMITS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service rate-limits
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import {
  type CommonErrors,
  UnknownCloudflareError,
  CloudflareNetworkError,
  CloudflareHttpError,
} from "../errors.ts";

// =============================================================================
// RateLimit
// =============================================================================

export interface GetRateLimitRequest {
  rateLimitId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const GetRateLimitRequest = Schema.Struct({
  rateLimitId: Schema.String.pipe(T.HttpPath("rateLimitId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/rate_limits/{rateLimitId}" }),
) as unknown as Schema.Schema<GetRateLimitRequest>;

export interface GetRateLimitResponse {
  /** The unique identifier of the rate limit. */
  id?: string;
  /** The action to perform when the threshold of matched traffic within the configured period is exceeded. */
  action?: {
    mode?:
      | "simulate"
      | "ban"
      | "challenge"
      | "js_challenge"
      | "managed_challenge";
    response?: { body?: string; contentType?: string };
    timeout?: number;
  };
  /** Criteria specifying when the current rate limit should be bypassed. You can specify that the rate limit should not apply to one or more URLs. */
  bypass?: { name?: "url"; value?: string }[];
  /** An informative summary of the rule. This value is sanitized and any tags will be removed. */
  description?: string;
  /** When true, indicates that the rate limit is currently disabled. */
  disabled?: boolean;
  /** Determines which traffic the rate limit counts towards the threshold. */
  match?: {
    headers?: { name?: string; op?: "eq" | "ne"; value?: string }[];
    request?: {
      methods?: (
        | "GET"
        | "POST"
        | "PUT"
        | "DELETE"
        | "PATCH"
        | "HEAD"
        | "_ALL_"
      )[];
      schemes?: string[];
      url?: string;
    };
    response?: { originTraffic?: boolean };
  };
  /** The time in seconds (an integer value) to count matching traffic. If the count exceeds the configured threshold within this period, Cloudflare will perform the configured action. */
  period?: number;
  /** The threshold that will trigger the configured mitigation action. Configure this value along with the `period` property to establish a threshold per period. */
  threshold?: number;
}

export const GetRateLimitResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  action: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(
        Schema.Literal(
          "simulate",
          "ban",
          "challenge",
          "js_challenge",
          "managed_challenge",
        ),
      ),
      response: Schema.optional(
        Schema.Struct({
          body: Schema.optional(Schema.String),
          contentType: Schema.optional(Schema.String).pipe(
            T.JsonName("content_type"),
          ),
        }),
      ),
      timeout: Schema.optional(Schema.Number),
    }),
  ),
  bypass: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.optional(Schema.Literal("url")),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
  description: Schema.optional(Schema.String),
  disabled: Schema.optional(Schema.Boolean),
  match: Schema.optional(
    Schema.Struct({
      headers: Schema.optional(
        Schema.Array(
          Schema.Struct({
            name: Schema.optional(Schema.String),
            op: Schema.optional(Schema.Literal("eq", "ne")),
            value: Schema.optional(Schema.String),
          }),
        ),
      ),
      request: Schema.optional(
        Schema.Struct({
          methods: Schema.optional(
            Schema.Array(
              Schema.Literal(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "HEAD",
                "_ALL_",
              ),
            ),
          ),
          schemes: Schema.optional(Schema.Array(Schema.String)),
          url: Schema.optional(Schema.String),
        }),
      ),
      response: Schema.optional(
        Schema.Struct({
          originTraffic: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("origin_traffic"),
          ),
        }),
      ),
    }),
  ),
  period: Schema.optional(Schema.Number),
  threshold: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetRateLimitResponse>;

export const getRateLimit: (
  input: GetRateLimitRequest,
) => Effect.Effect<
  GetRateLimitResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRateLimitRequest,
  output: GetRateLimitResponse,
  errors: [],
}));

export interface CreateRateLimitRequest {
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: The action to perform when the threshold of matched traffic within the configured period is exceeded. */
  action: {
    mode?:
      | "simulate"
      | "ban"
      | "challenge"
      | "js_challenge"
      | "managed_challenge";
    response?: { body?: string; contentType?: string };
    timeout?: number;
  };
  /** Body param: Determines which traffic the rate limit counts towards the threshold. */
  match: {
    headers?: { name?: string; op?: "eq" | "ne"; value?: string }[];
    request?: {
      methods?: (
        | "GET"
        | "POST"
        | "PUT"
        | "DELETE"
        | "PATCH"
        | "HEAD"
        | "_ALL_"
      )[];
      schemes?: string[];
      url?: string;
    };
    response?: { originTraffic?: boolean };
  };
  /** Body param: The time in seconds (an integer value) to count matching traffic. If the count exceeds the configured threshold within this period, Cloudflare will perform the configured action. */
  period: number;
  /** Body param: The threshold that will trigger the configured mitigation action. Configure this value along with the `period` property to establish a threshold per period. */
  threshold: number;
}

export const CreateRateLimitRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  action: Schema.Struct({
    mode: Schema.optional(
      Schema.Literal(
        "simulate",
        "ban",
        "challenge",
        "js_challenge",
        "managed_challenge",
      ),
    ),
    response: Schema.optional(
      Schema.Struct({
        body: Schema.optional(Schema.String),
        contentType: Schema.optional(Schema.String).pipe(
          T.JsonName("content_type"),
        ),
      }),
    ),
    timeout: Schema.optional(Schema.Number),
  }),
  match: Schema.Struct({
    headers: Schema.optional(
      Schema.Array(
        Schema.Struct({
          name: Schema.optional(Schema.String),
          op: Schema.optional(Schema.Literal("eq", "ne")),
          value: Schema.optional(Schema.String),
        }),
      ),
    ),
    request: Schema.optional(
      Schema.Struct({
        methods: Schema.optional(
          Schema.Array(
            Schema.Literal(
              "GET",
              "POST",
              "PUT",
              "DELETE",
              "PATCH",
              "HEAD",
              "_ALL_",
            ),
          ),
        ),
        schemes: Schema.optional(Schema.Array(Schema.String)),
        url: Schema.optional(Schema.String),
      }),
    ),
    response: Schema.optional(
      Schema.Struct({
        originTraffic: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("origin_traffic"),
        ),
      }),
    ),
  }),
  period: Schema.Number,
  threshold: Schema.Number,
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/rate_limits" }),
) as unknown as Schema.Schema<CreateRateLimitRequest>;

export interface CreateRateLimitResponse {
  /** The unique identifier of the rate limit. */
  id?: string;
  /** The action to perform when the threshold of matched traffic within the configured period is exceeded. */
  action?: {
    mode?:
      | "simulate"
      | "ban"
      | "challenge"
      | "js_challenge"
      | "managed_challenge";
    response?: { body?: string; contentType?: string };
    timeout?: number;
  };
  /** Criteria specifying when the current rate limit should be bypassed. You can specify that the rate limit should not apply to one or more URLs. */
  bypass?: { name?: "url"; value?: string }[];
  /** An informative summary of the rule. This value is sanitized and any tags will be removed. */
  description?: string;
  /** When true, indicates that the rate limit is currently disabled. */
  disabled?: boolean;
  /** Determines which traffic the rate limit counts towards the threshold. */
  match?: {
    headers?: { name?: string; op?: "eq" | "ne"; value?: string }[];
    request?: {
      methods?: (
        | "GET"
        | "POST"
        | "PUT"
        | "DELETE"
        | "PATCH"
        | "HEAD"
        | "_ALL_"
      )[];
      schemes?: string[];
      url?: string;
    };
    response?: { originTraffic?: boolean };
  };
  /** The time in seconds (an integer value) to count matching traffic. If the count exceeds the configured threshold within this period, Cloudflare will perform the configured action. */
  period?: number;
  /** The threshold that will trigger the configured mitigation action. Configure this value along with the `period` property to establish a threshold per period. */
  threshold?: number;
}

export const CreateRateLimitResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  action: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(
        Schema.Literal(
          "simulate",
          "ban",
          "challenge",
          "js_challenge",
          "managed_challenge",
        ),
      ),
      response: Schema.optional(
        Schema.Struct({
          body: Schema.optional(Schema.String),
          contentType: Schema.optional(Schema.String).pipe(
            T.JsonName("content_type"),
          ),
        }),
      ),
      timeout: Schema.optional(Schema.Number),
    }),
  ),
  bypass: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.optional(Schema.Literal("url")),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
  description: Schema.optional(Schema.String),
  disabled: Schema.optional(Schema.Boolean),
  match: Schema.optional(
    Schema.Struct({
      headers: Schema.optional(
        Schema.Array(
          Schema.Struct({
            name: Schema.optional(Schema.String),
            op: Schema.optional(Schema.Literal("eq", "ne")),
            value: Schema.optional(Schema.String),
          }),
        ),
      ),
      request: Schema.optional(
        Schema.Struct({
          methods: Schema.optional(
            Schema.Array(
              Schema.Literal(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "HEAD",
                "_ALL_",
              ),
            ),
          ),
          schemes: Schema.optional(Schema.Array(Schema.String)),
          url: Schema.optional(Schema.String),
        }),
      ),
      response: Schema.optional(
        Schema.Struct({
          originTraffic: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("origin_traffic"),
          ),
        }),
      ),
    }),
  ),
  period: Schema.optional(Schema.Number),
  threshold: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<CreateRateLimitResponse>;

export const createRateLimit: (
  input: CreateRateLimitRequest,
) => Effect.Effect<
  CreateRateLimitResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateRateLimitRequest,
  output: CreateRateLimitResponse,
  errors: [],
}));

export interface DeleteRateLimitRequest {
  rateLimitId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const DeleteRateLimitRequest = Schema.Struct({
  rateLimitId: Schema.String.pipe(T.HttpPath("rateLimitId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/rate_limits/{rateLimitId}",
  }),
) as unknown as Schema.Schema<DeleteRateLimitRequest>;

export interface DeleteRateLimitResponse {
  /** The unique identifier of the rate limit. */
  id?: string;
  /** The action to perform when the threshold of matched traffic within the configured period is exceeded. */
  action?: {
    mode?:
      | "simulate"
      | "ban"
      | "challenge"
      | "js_challenge"
      | "managed_challenge";
    response?: { body?: string; contentType?: string };
    timeout?: number;
  };
  /** Criteria specifying when the current rate limit should be bypassed. You can specify that the rate limit should not apply to one or more URLs. */
  bypass?: { name?: "url"; value?: string }[];
  /** An informative summary of the rule. This value is sanitized and any tags will be removed. */
  description?: string;
  /** When true, indicates that the rate limit is currently disabled. */
  disabled?: boolean;
  /** Determines which traffic the rate limit counts towards the threshold. */
  match?: {
    headers?: { name?: string; op?: "eq" | "ne"; value?: string }[];
    request?: {
      methods?: (
        | "GET"
        | "POST"
        | "PUT"
        | "DELETE"
        | "PATCH"
        | "HEAD"
        | "_ALL_"
      )[];
      schemes?: string[];
      url?: string;
    };
    response?: { originTraffic?: boolean };
  };
  /** The time in seconds (an integer value) to count matching traffic. If the count exceeds the configured threshold within this period, Cloudflare will perform the configured action. */
  period?: number;
  /** The threshold that will trigger the configured mitigation action. Configure this value along with the `period` property to establish a threshold per period. */
  threshold?: number;
}

export const DeleteRateLimitResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  action: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(
        Schema.Literal(
          "simulate",
          "ban",
          "challenge",
          "js_challenge",
          "managed_challenge",
        ),
      ),
      response: Schema.optional(
        Schema.Struct({
          body: Schema.optional(Schema.String),
          contentType: Schema.optional(Schema.String).pipe(
            T.JsonName("content_type"),
          ),
        }),
      ),
      timeout: Schema.optional(Schema.Number),
    }),
  ),
  bypass: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.optional(Schema.Literal("url")),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
  description: Schema.optional(Schema.String),
  disabled: Schema.optional(Schema.Boolean),
  match: Schema.optional(
    Schema.Struct({
      headers: Schema.optional(
        Schema.Array(
          Schema.Struct({
            name: Schema.optional(Schema.String),
            op: Schema.optional(Schema.Literal("eq", "ne")),
            value: Schema.optional(Schema.String),
          }),
        ),
      ),
      request: Schema.optional(
        Schema.Struct({
          methods: Schema.optional(
            Schema.Array(
              Schema.Literal(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "HEAD",
                "_ALL_",
              ),
            ),
          ),
          schemes: Schema.optional(Schema.Array(Schema.String)),
          url: Schema.optional(Schema.String),
        }),
      ),
      response: Schema.optional(
        Schema.Struct({
          originTraffic: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("origin_traffic"),
          ),
        }),
      ),
    }),
  ),
  period: Schema.optional(Schema.Number),
  threshold: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<DeleteRateLimitResponse>;

export const deleteRateLimit: (
  input: DeleteRateLimitRequest,
) => Effect.Effect<
  DeleteRateLimitResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteRateLimitRequest,
  output: DeleteRateLimitResponse,
  errors: [],
}));

export interface EditRateLimitRequest {
  rateLimitId: string;
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: The action to perform when the threshold of matched traffic within the configured period is exceeded. */
  action: {
    mode?:
      | "simulate"
      | "ban"
      | "challenge"
      | "js_challenge"
      | "managed_challenge";
    response?: { body?: string; contentType?: string };
    timeout?: number;
  };
  /** Body param: Determines which traffic the rate limit counts towards the threshold. */
  match: {
    headers?: { name?: string; op?: "eq" | "ne"; value?: string }[];
    request?: {
      methods?: (
        | "GET"
        | "POST"
        | "PUT"
        | "DELETE"
        | "PATCH"
        | "HEAD"
        | "_ALL_"
      )[];
      schemes?: string[];
      url?: string;
    };
    response?: { originTraffic?: boolean };
  };
  /** Body param: The time in seconds (an integer value) to count matching traffic. If the count exceeds the configured threshold within this period, Cloudflare will perform the configured action. */
  period: number;
  /** Body param: The threshold that will trigger the configured mitigation action. Configure this value along with the `period` property to establish a threshold per period. */
  threshold: number;
}

export const EditRateLimitRequest = Schema.Struct({
  rateLimitId: Schema.String.pipe(T.HttpPath("rateLimitId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  action: Schema.Struct({
    mode: Schema.optional(
      Schema.Literal(
        "simulate",
        "ban",
        "challenge",
        "js_challenge",
        "managed_challenge",
      ),
    ),
    response: Schema.optional(
      Schema.Struct({
        body: Schema.optional(Schema.String),
        contentType: Schema.optional(Schema.String).pipe(
          T.JsonName("content_type"),
        ),
      }),
    ),
    timeout: Schema.optional(Schema.Number),
  }),
  match: Schema.Struct({
    headers: Schema.optional(
      Schema.Array(
        Schema.Struct({
          name: Schema.optional(Schema.String),
          op: Schema.optional(Schema.Literal("eq", "ne")),
          value: Schema.optional(Schema.String),
        }),
      ),
    ),
    request: Schema.optional(
      Schema.Struct({
        methods: Schema.optional(
          Schema.Array(
            Schema.Literal(
              "GET",
              "POST",
              "PUT",
              "DELETE",
              "PATCH",
              "HEAD",
              "_ALL_",
            ),
          ),
        ),
        schemes: Schema.optional(Schema.Array(Schema.String)),
        url: Schema.optional(Schema.String),
      }),
    ),
    response: Schema.optional(
      Schema.Struct({
        originTraffic: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("origin_traffic"),
        ),
      }),
    ),
  }),
  period: Schema.Number,
  threshold: Schema.Number,
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/rate_limits/{rateLimitId}" }),
) as unknown as Schema.Schema<EditRateLimitRequest>;

export interface EditRateLimitResponse {
  /** The unique identifier of the rate limit. */
  id?: string;
  /** The action to perform when the threshold of matched traffic within the configured period is exceeded. */
  action?: {
    mode?:
      | "simulate"
      | "ban"
      | "challenge"
      | "js_challenge"
      | "managed_challenge";
    response?: { body?: string; contentType?: string };
    timeout?: number;
  };
  /** Criteria specifying when the current rate limit should be bypassed. You can specify that the rate limit should not apply to one or more URLs. */
  bypass?: { name?: "url"; value?: string }[];
  /** An informative summary of the rule. This value is sanitized and any tags will be removed. */
  description?: string;
  /** When true, indicates that the rate limit is currently disabled. */
  disabled?: boolean;
  /** Determines which traffic the rate limit counts towards the threshold. */
  match?: {
    headers?: { name?: string; op?: "eq" | "ne"; value?: string }[];
    request?: {
      methods?: (
        | "GET"
        | "POST"
        | "PUT"
        | "DELETE"
        | "PATCH"
        | "HEAD"
        | "_ALL_"
      )[];
      schemes?: string[];
      url?: string;
    };
    response?: { originTraffic?: boolean };
  };
  /** The time in seconds (an integer value) to count matching traffic. If the count exceeds the configured threshold within this period, Cloudflare will perform the configured action. */
  period?: number;
  /** The threshold that will trigger the configured mitigation action. Configure this value along with the `period` property to establish a threshold per period. */
  threshold?: number;
}

export const EditRateLimitResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  action: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(
        Schema.Literal(
          "simulate",
          "ban",
          "challenge",
          "js_challenge",
          "managed_challenge",
        ),
      ),
      response: Schema.optional(
        Schema.Struct({
          body: Schema.optional(Schema.String),
          contentType: Schema.optional(Schema.String).pipe(
            T.JsonName("content_type"),
          ),
        }),
      ),
      timeout: Schema.optional(Schema.Number),
    }),
  ),
  bypass: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.optional(Schema.Literal("url")),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
  description: Schema.optional(Schema.String),
  disabled: Schema.optional(Schema.Boolean),
  match: Schema.optional(
    Schema.Struct({
      headers: Schema.optional(
        Schema.Array(
          Schema.Struct({
            name: Schema.optional(Schema.String),
            op: Schema.optional(Schema.Literal("eq", "ne")),
            value: Schema.optional(Schema.String),
          }),
        ),
      ),
      request: Schema.optional(
        Schema.Struct({
          methods: Schema.optional(
            Schema.Array(
              Schema.Literal(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "HEAD",
                "_ALL_",
              ),
            ),
          ),
          schemes: Schema.optional(Schema.Array(Schema.String)),
          url: Schema.optional(Schema.String),
        }),
      ),
      response: Schema.optional(
        Schema.Struct({
          originTraffic: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("origin_traffic"),
          ),
        }),
      ),
    }),
  ),
  period: Schema.optional(Schema.Number),
  threshold: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<EditRateLimitResponse>;

export const editRateLimit: (
  input: EditRateLimitRequest,
) => Effect.Effect<
  EditRateLimitResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: EditRateLimitRequest,
  output: EditRateLimitResponse,
  errors: [],
}));

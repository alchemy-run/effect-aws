/**
 * Cloudflare RADAR API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service radar
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
// AgentAiBotSummary
// =============================================================================

export interface UserAgentAiBotSummaryRequest {}

export const UserAgentAiBotSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/ai/bots/summary/user_agent" }),
) as unknown as Schema.Schema<UserAgentAiBotSummaryRequest>;

export interface UserAgentAiBotSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const UserAgentAiBotSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<UserAgentAiBotSummaryResponse>;

export const userAgentAiBotSummary: (
  input: UserAgentAiBotSummaryRequest,
) => Effect.Effect<
  UserAgentAiBotSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UserAgentAiBotSummaryRequest,
  output: UserAgentAiBotSummaryResponse,
  errors: [],
}));

// =============================================================================
// AgentAiTimeseriesGroup
// =============================================================================

export interface UserAgentAiTimeseriesGroupRequest {}

export const UserAgentAiTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/ai/bots/timeseries_groups/user_agent",
  }),
) as unknown as Schema.Schema<UserAgentAiTimeseriesGroupRequest>;

export interface UserAgentAiTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const UserAgentAiTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<UserAgentAiTimeseriesGroupResponse>;

export const userAgentAiTimeseriesGroup: (
  input: UserAgentAiTimeseriesGroupRequest,
) => Effect.Effect<
  UserAgentAiTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UserAgentAiTimeseriesGroupRequest,
  output: UserAgentAiTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// AiInferenceSummary
// =============================================================================

export interface ModelAiInferenceSummaryRequest {}

export const ModelAiInferenceSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/ai/inference/summary/model" }),
) as unknown as Schema.Schema<ModelAiInferenceSummaryRequest>;

export interface ModelAiInferenceSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const ModelAiInferenceSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<ModelAiInferenceSummaryResponse>;

export const modelAiInferenceSummary: (
  input: ModelAiInferenceSummaryRequest,
) => Effect.Effect<
  ModelAiInferenceSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ModelAiInferenceSummaryRequest,
  output: ModelAiInferenceSummaryResponse,
  errors: [],
}));

export interface TaskAiInferenceSummaryRequest {}

export const TaskAiInferenceSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/ai/inference/summary/task" }),
) as unknown as Schema.Schema<TaskAiInferenceSummaryRequest>;

export interface TaskAiInferenceSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const TaskAiInferenceSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<TaskAiInferenceSummaryResponse>;

export const taskAiInferenceSummary: (
  input: TaskAiInferenceSummaryRequest,
) => Effect.Effect<
  TaskAiInferenceSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TaskAiInferenceSummaryRequest,
  output: TaskAiInferenceSummaryResponse,
  errors: [],
}));

// =============================================================================
// AiInferenceTimeseriesGroupSummary
// =============================================================================

export interface ModelAiInferenceTimeseriesGroupSummaryRequest {}

export const ModelAiInferenceTimeseriesGroupSummaryRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/ai/inference/timeseries_groups/model",
  }),
) as unknown as Schema.Schema<ModelAiInferenceTimeseriesGroupSummaryRequest>;

export interface ModelAiInferenceTimeseriesGroupSummaryResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const ModelAiInferenceTimeseriesGroupSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<ModelAiInferenceTimeseriesGroupSummaryResponse>;

export const modelAiInferenceTimeseriesGroupSummary: (
  input: ModelAiInferenceTimeseriesGroupSummaryRequest,
) => Effect.Effect<
  ModelAiInferenceTimeseriesGroupSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ModelAiInferenceTimeseriesGroupSummaryRequest,
  output: ModelAiInferenceTimeseriesGroupSummaryResponse,
  errors: [],
}));

export interface TaskAiInferenceTimeseriesGroupSummaryRequest {}

export const TaskAiInferenceTimeseriesGroupSummaryRequest = Schema.Struct(
  {},
).pipe(
  T.Http({ method: "GET", path: "/radar/ai/inference/timeseries_groups/task" }),
) as unknown as Schema.Schema<TaskAiInferenceTimeseriesGroupSummaryRequest>;

export interface TaskAiInferenceTimeseriesGroupSummaryResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const TaskAiInferenceTimeseriesGroupSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TaskAiInferenceTimeseriesGroupSummaryResponse>;

export const taskAiInferenceTimeseriesGroupSummary: (
  input: TaskAiInferenceTimeseriesGroupSummaryRequest,
) => Effect.Effect<
  TaskAiInferenceTimeseriesGroupSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TaskAiInferenceTimeseriesGroupSummaryRequest,
  output: TaskAiInferenceTimeseriesGroupSummaryResponse,
  errors: [],
}));

// =============================================================================
// AiTimeseriesGroup
// =============================================================================

export interface SummaryAiTimeseriesGroupRequest {
  dimension: "USER_AGENT" | "CRAWL_PURPOSE" | "INDUSTRY" | "VERTICAL";
}

export const SummaryAiTimeseriesGroupRequest = Schema.Struct({
  dimension: Schema.Literal(
    "USER_AGENT",
    "CRAWL_PURPOSE",
    "INDUSTRY",
    "VERTICAL",
  ).pipe(T.HttpPath("dimension")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/ai/bots/summary/{dimension}" }),
) as unknown as Schema.Schema<SummaryAiTimeseriesGroupRequest>;

export interface SummaryAiTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const SummaryAiTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<SummaryAiTimeseriesGroupResponse>;

export const summaryAiTimeseriesGroup: (
  input: SummaryAiTimeseriesGroupRequest,
) => Effect.Effect<
  SummaryAiTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SummaryAiTimeseriesGroupRequest,
  output: SummaryAiTimeseriesGroupResponse,
  errors: [],
}));

export interface TimeseriesAiTimeseriesGroupRequest {}

export const TimeseriesAiTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/ai/bots/timeseries" }),
) as unknown as Schema.Schema<TimeseriesAiTimeseriesGroupRequest>;

export interface TimeseriesAiTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
}

export const TimeseriesAiTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
}) as unknown as Schema.Schema<TimeseriesAiTimeseriesGroupResponse>;

export const timeseriesAiTimeseriesGroup: (
  input: TimeseriesAiTimeseriesGroupRequest,
) => Effect.Effect<
  TimeseriesAiTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesAiTimeseriesGroupRequest,
  output: TimeseriesAiTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// Annotation
// =============================================================================

export interface ListAnnotationsRequest {}

export const ListAnnotationsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/annotations" }),
) as unknown as Schema.Schema<ListAnnotationsRequest>;

export interface ListAnnotationsResponse {
  annotations: {
    id: string;
    asns: number[];
    asnsDetails: {
      asn: string;
      name: string;
      locations?: { code: string; name: string };
    }[];
    dataSource: string;
    eventType: string;
    locations: string[];
    locationsDetails: { code: string; name: string }[];
    outage: { outageCause: string; outageType: string };
    startDate: string;
    description?: string;
    endDate?: string;
    linkedUrl?: string;
    scope?: string;
  }[];
}

export const ListAnnotationsResponse = Schema.Struct({
  annotations: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      asns: Schema.Array(Schema.Number),
      asnsDetails: Schema.Array(
        Schema.Struct({
          asn: Schema.String,
          name: Schema.String,
          locations: Schema.optional(
            Schema.Struct({
              code: Schema.String,
              name: Schema.String,
            }),
          ),
        }),
      ),
      dataSource: Schema.String,
      eventType: Schema.String,
      locations: Schema.Array(Schema.String),
      locationsDetails: Schema.Array(
        Schema.Struct({
          code: Schema.String,
          name: Schema.String,
        }),
      ),
      outage: Schema.Struct({
        outageCause: Schema.String,
        outageType: Schema.String,
      }),
      startDate: Schema.String,
      description: Schema.optional(Schema.String),
      endDate: Schema.optional(Schema.String),
      linkedUrl: Schema.optional(Schema.String),
      scope: Schema.optional(Schema.String),
    }),
  ),
}) as unknown as Schema.Schema<ListAnnotationsResponse>;

export const listAnnotations: (
  input: ListAnnotationsRequest,
) => Effect.Effect<
  ListAnnotationsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListAnnotationsRequest,
  output: ListAnnotationsResponse,
  errors: [],
}));

// =============================================================================
// AnnotationOutage
// =============================================================================

export interface GetAnnotationOutageRequest {}

export const GetAnnotationOutageRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/annotations/outages" }),
) as unknown as Schema.Schema<GetAnnotationOutageRequest>;

export interface GetAnnotationOutageResponse {
  annotations: {
    id: string;
    asns: number[];
    asnsDetails: {
      asn: string;
      name: string;
      locations?: { code: string; name: string };
    }[];
    dataSource: string;
    eventType: string;
    locations: string[];
    locationsDetails: { code: string; name: string }[];
    outage: { outageCause: string; outageType: string };
    startDate: string;
    description?: string;
    endDate?: string;
    linkedUrl?: string;
    scope?: string;
  }[];
}

export const GetAnnotationOutageResponse = Schema.Struct({
  annotations: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      asns: Schema.Array(Schema.Number),
      asnsDetails: Schema.Array(
        Schema.Struct({
          asn: Schema.String,
          name: Schema.String,
          locations: Schema.optional(
            Schema.Struct({
              code: Schema.String,
              name: Schema.String,
            }),
          ),
        }),
      ),
      dataSource: Schema.String,
      eventType: Schema.String,
      locations: Schema.Array(Schema.String),
      locationsDetails: Schema.Array(
        Schema.Struct({
          code: Schema.String,
          name: Schema.String,
        }),
      ),
      outage: Schema.Struct({
        outageCause: Schema.String,
        outageType: Schema.String,
      }),
      startDate: Schema.String,
      description: Schema.optional(Schema.String),
      endDate: Schema.optional(Schema.String),
      linkedUrl: Schema.optional(Schema.String),
      scope: Schema.optional(Schema.String),
    }),
  ),
}) as unknown as Schema.Schema<GetAnnotationOutageResponse>;

export const getAnnotationOutage: (
  input: GetAnnotationOutageRequest,
) => Effect.Effect<
  GetAnnotationOutageResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAnnotationOutageRequest,
  output: GetAnnotationOutageResponse,
  errors: [],
}));

export interface LocationsAnnotationOutageRequest {}

export const LocationsAnnotationOutageRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/annotations/outages/locations" }),
) as unknown as Schema.Schema<LocationsAnnotationOutageRequest>;

export interface LocationsAnnotationOutageResponse {
  annotations: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const LocationsAnnotationOutageResponse = Schema.Struct({
  annotations: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<LocationsAnnotationOutageResponse>;

export const locationsAnnotationOutage: (
  input: LocationsAnnotationOutageRequest,
) => Effect.Effect<
  LocationsAnnotationOutageResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: LocationsAnnotationOutageRequest,
  output: LocationsAnnotationOutageResponse,
  errors: [],
}));

// =============================================================================
// AnswerDnsSummary
// =============================================================================

export interface MatchingAnswerDnsSummaryRequest {}

export const MatchingAnswerDnsSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/summary/matching_answer" }),
) as unknown as Schema.Schema<MatchingAnswerDnsSummaryRequest>;

export interface MatchingAnswerDnsSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { nEGATIVE: string; pOSITIVE: string };
}

export const MatchingAnswerDnsSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    nEGATIVE: Schema.String.pipe(T.JsonName("NEGATIVE")),
    pOSITIVE: Schema.String.pipe(T.JsonName("POSITIVE")),
  }),
}) as unknown as Schema.Schema<MatchingAnswerDnsSummaryResponse>;

export const matchingAnswerDnsSummary: (
  input: MatchingAnswerDnsSummaryRequest,
) => Effect.Effect<
  MatchingAnswerDnsSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: MatchingAnswerDnsSummaryRequest,
  output: MatchingAnswerDnsSummaryResponse,
  errors: [],
}));

// =============================================================================
// AnswerDnsTimeseriesGroup
// =============================================================================

export interface MatchingAnswerDnsTimeseriesGroupRequest {}

export const MatchingAnswerDnsTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/dns/timeseries_groups/matching_answer",
  }),
) as unknown as Schema.Schema<MatchingAnswerDnsTimeseriesGroupRequest>;

export interface MatchingAnswerDnsTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { nEGATIVE: string[]; pOSITIVE: string[] };
}

export const MatchingAnswerDnsTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    nEGATIVE: Schema.Array(Schema.String).pipe(T.JsonName("NEGATIVE")),
    pOSITIVE: Schema.Array(Schema.String).pipe(T.JsonName("POSITIVE")),
  }),
}) as unknown as Schema.Schema<MatchingAnswerDnsTimeseriesGroupResponse>;

export const matchingAnswerDnsTimeseriesGroup: (
  input: MatchingAnswerDnsTimeseriesGroupRequest,
) => Effect.Effect<
  MatchingAnswerDnsTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: MatchingAnswerDnsTimeseriesGroupRequest,
  output: MatchingAnswerDnsTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// As112
// =============================================================================

export interface TimeseriesAs112Request {}

export const TimeseriesAs112Request = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/timeseries" }),
) as unknown as Schema.Schema<TimeseriesAs112Request>;

export interface TimeseriesAs112Response {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
}

export const TimeseriesAs112Response = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
}) as unknown as Schema.Schema<TimeseriesAs112Response>;

export const timeseriesAs112: (
  input: TimeseriesAs112Request,
) => Effect.Effect<
  TimeseriesAs112Response,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesAs112Request,
  output: TimeseriesAs112Response,
  errors: [],
}));

// =============================================================================
// As112Summary
// =============================================================================

export interface DnssecAs112SummaryRequest {}

export const DnssecAs112SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/summary/dnssec" }),
) as unknown as Schema.Schema<DnssecAs112SummaryRequest>;

export interface DnssecAs112SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { nOT_SUPPORTED: string; sUPPORTED: string };
}

export const DnssecAs112SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    nOT_SUPPORTED: Schema.String.pipe(T.JsonName("NOT_SUPPORTED")),
    sUPPORTED: Schema.String.pipe(T.JsonName("SUPPORTED")),
  }),
}) as unknown as Schema.Schema<DnssecAs112SummaryResponse>;

export const dnssecAs112Summary: (
  input: DnssecAs112SummaryRequest,
) => Effect.Effect<
  DnssecAs112SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DnssecAs112SummaryRequest,
  output: DnssecAs112SummaryResponse,
  errors: [],
}));

export interface EdnsAs112SummaryRequest {}

export const EdnsAs112SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/summary/edns" }),
) as unknown as Schema.Schema<EdnsAs112SummaryRequest>;

export interface EdnsAs112SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { nOT_SUPPORTED: string; sUPPORTED: string };
}

export const EdnsAs112SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    nOT_SUPPORTED: Schema.String.pipe(T.JsonName("NOT_SUPPORTED")),
    sUPPORTED: Schema.String.pipe(T.JsonName("SUPPORTED")),
  }),
}) as unknown as Schema.Schema<EdnsAs112SummaryResponse>;

export const ednsAs112Summary: (
  input: EdnsAs112SummaryRequest,
) => Effect.Effect<
  EdnsAs112SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: EdnsAs112SummaryRequest,
  output: EdnsAs112SummaryResponse,
  errors: [],
}));

export interface ProtocolAs112SummaryRequest {}

export const ProtocolAs112SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/summary/protocol" }),
) as unknown as Schema.Schema<ProtocolAs112SummaryRequest>;

export interface ProtocolAs112SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { hTTPS: string; tCP: string; tLS: string; uDP: string };
}

export const ProtocolAs112SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    hTTPS: Schema.String.pipe(T.JsonName("HTTPS")),
    tCP: Schema.String.pipe(T.JsonName("TCP")),
    tLS: Schema.String.pipe(T.JsonName("TLS")),
    uDP: Schema.String.pipe(T.JsonName("UDP")),
  }),
}) as unknown as Schema.Schema<ProtocolAs112SummaryResponse>;

export const protocolAs112Summary: (
  input: ProtocolAs112SummaryRequest,
) => Effect.Effect<
  ProtocolAs112SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ProtocolAs112SummaryRequest,
  output: ProtocolAs112SummaryResponse,
  errors: [],
}));

// =============================================================================
// As112TimeseriesGroup
// =============================================================================

export interface DnssecAs112TimeseriesGroupRequest {}

export const DnssecAs112TimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/timeseries_groups/dnssec" }),
) as unknown as Schema.Schema<DnssecAs112TimeseriesGroupRequest>;

export interface DnssecAs112TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { nOT_SUPPORTED: string[]; sUPPORTED: string[] };
}

export const DnssecAs112TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    nOT_SUPPORTED: Schema.Array(Schema.String).pipe(
      T.JsonName("NOT_SUPPORTED"),
    ),
    sUPPORTED: Schema.Array(Schema.String).pipe(T.JsonName("SUPPORTED")),
  }),
}) as unknown as Schema.Schema<DnssecAs112TimeseriesGroupResponse>;

export const dnssecAs112TimeseriesGroup: (
  input: DnssecAs112TimeseriesGroupRequest,
) => Effect.Effect<
  DnssecAs112TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DnssecAs112TimeseriesGroupRequest,
  output: DnssecAs112TimeseriesGroupResponse,
  errors: [],
}));

export interface EdnsAs112TimeseriesGroupRequest {}

export const EdnsAs112TimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/timeseries_groups/edns" }),
) as unknown as Schema.Schema<EdnsAs112TimeseriesGroupRequest>;

export interface EdnsAs112TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { nOT_SUPPORTED: string[]; sUPPORTED: string[] };
}

export const EdnsAs112TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    nOT_SUPPORTED: Schema.Array(Schema.String).pipe(
      T.JsonName("NOT_SUPPORTED"),
    ),
    sUPPORTED: Schema.Array(Schema.String).pipe(T.JsonName("SUPPORTED")),
  }),
}) as unknown as Schema.Schema<EdnsAs112TimeseriesGroupResponse>;

export const ednsAs112TimeseriesGroup: (
  input: EdnsAs112TimeseriesGroupRequest,
) => Effect.Effect<
  EdnsAs112TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: EdnsAs112TimeseriesGroupRequest,
  output: EdnsAs112TimeseriesGroupResponse,
  errors: [],
}));

export interface ProtocolAs112TimeseriesGroupRequest {}

export const ProtocolAs112TimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/timeseries_groups/protocol" }),
) as unknown as Schema.Schema<ProtocolAs112TimeseriesGroupRequest>;

export interface ProtocolAs112TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { hTTPS: string[]; tCP: string[]; tLS: string[]; uDP: string[] };
}

export const ProtocolAs112TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    hTTPS: Schema.Array(Schema.String).pipe(T.JsonName("HTTPS")),
    tCP: Schema.Array(Schema.String).pipe(T.JsonName("TCP")),
    tLS: Schema.Array(Schema.String).pipe(T.JsonName("TLS")),
    uDP: Schema.Array(Schema.String).pipe(T.JsonName("UDP")),
  }),
}) as unknown as Schema.Schema<ProtocolAs112TimeseriesGroupResponse>;

export const protocolAs112TimeseriesGroup: (
  input: ProtocolAs112TimeseriesGroupRequest,
) => Effect.Effect<
  ProtocolAs112TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ProtocolAs112TimeseriesGroupRequest,
  output: ProtocolAs112TimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// As112Top
// =============================================================================

export interface DnssecAs112TopRequest {
  dnssec: "SUPPORTED" | "NOT_SUPPORTED";
}

export const DnssecAs112TopRequest = Schema.Struct({
  dnssec: Schema.Literal("SUPPORTED", "NOT_SUPPORTED").pipe(
    T.HttpPath("dnssec"),
  ),
}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/top/locations/dnssec/{dnssec}" }),
) as unknown as Schema.Schema<DnssecAs112TopRequest>;

export interface DnssecAs112TopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const DnssecAs112TopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<DnssecAs112TopResponse>;

export const dnssecAs112Top: (
  input: DnssecAs112TopRequest,
) => Effect.Effect<
  DnssecAs112TopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DnssecAs112TopRequest,
  output: DnssecAs112TopResponse,
  errors: [],
}));

export interface EdnsAs112TopRequest {
  edns: "SUPPORTED" | "NOT_SUPPORTED";
}

export const EdnsAs112TopRequest = Schema.Struct({
  edns: Schema.Literal("SUPPORTED", "NOT_SUPPORTED").pipe(T.HttpPath("edns")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/top/locations/edns/{edns}" }),
) as unknown as Schema.Schema<EdnsAs112TopRequest>;

export interface EdnsAs112TopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const EdnsAs112TopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<EdnsAs112TopResponse>;

export const ednsAs112Top: (
  input: EdnsAs112TopRequest,
) => Effect.Effect<
  EdnsAs112TopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: EdnsAs112TopRequest,
  output: EdnsAs112TopResponse,
  errors: [],
}));

export interface LocationsAs112TopRequest {}

export const LocationsAs112TopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/top/locations" }),
) as unknown as Schema.Schema<LocationsAs112TopRequest>;

export interface LocationsAs112TopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const LocationsAs112TopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<LocationsAs112TopResponse>;

export const locationsAs112Top: (
  input: LocationsAs112TopRequest,
) => Effect.Effect<
  LocationsAs112TopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: LocationsAs112TopRequest,
  output: LocationsAs112TopResponse,
  errors: [],
}));

// =============================================================================
// AttackLayer3
// =============================================================================

export interface TimeseriesAttackLayer3Request {}

export const TimeseriesAttackLayer3Request = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/timeseries" }),
) as unknown as Schema.Schema<TimeseriesAttackLayer3Request>;

export interface TimeseriesAttackLayer3Response {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
}

export const TimeseriesAttackLayer3Response = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
}) as unknown as Schema.Schema<TimeseriesAttackLayer3Response>;

export const timeseriesAttackLayer3: (
  input: TimeseriesAttackLayer3Request,
) => Effect.Effect<
  TimeseriesAttackLayer3Response,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesAttackLayer3Request,
  output: TimeseriesAttackLayer3Response,
  errors: [],
}));

// =============================================================================
// AttackLayer3Summary
// =============================================================================

export interface BitrateAttackLayer3SummaryRequest {}

export const BitrateAttackLayer3SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/summary/bitrate" }),
) as unknown as Schema.Schema<BitrateAttackLayer3SummaryRequest>;

export interface BitrateAttackLayer3SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: {
    _1_GBPS_TO_10_GBPS: string;
    _10_GBPS_TO_100_GBPS: string;
    _500_MBPS_TO_1_GBPS: string;
    oVER_100_GBPS: string;
    uNDER_500_MBPS: string;
  };
}

export const BitrateAttackLayer3SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    _1_GBPS_TO_10_GBPS: Schema.String,
    _10_GBPS_TO_100_GBPS: Schema.String,
    _500_MBPS_TO_1_GBPS: Schema.String,
    oVER_100_GBPS: Schema.String.pipe(T.JsonName("OVER_100_GBPS")),
    uNDER_500_MBPS: Schema.String.pipe(T.JsonName("UNDER_500_MBPS")),
  }),
}) as unknown as Schema.Schema<BitrateAttackLayer3SummaryResponse>;

export const bitrateAttackLayer3Summary: (
  input: BitrateAttackLayer3SummaryRequest,
) => Effect.Effect<
  BitrateAttackLayer3SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BitrateAttackLayer3SummaryRequest,
  output: BitrateAttackLayer3SummaryResponse,
  errors: [],
}));

export interface DurationAttackLayer3SummaryRequest {}

export const DurationAttackLayer3SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/summary/duration" }),
) as unknown as Schema.Schema<DurationAttackLayer3SummaryRequest>;

export interface DurationAttackLayer3SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: {
    _1_HOUR_TO_3_HOURS: string;
    _10_MINS_TO_20_MINS: string;
    _20_MINS_TO_40_MINS: string;
    _40_MINS_TO_1_HOUR: string;
    oVER_3_HOURS: string;
    uNDER_10_MINS: string;
  };
}

export const DurationAttackLayer3SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    _1_HOUR_TO_3_HOURS: Schema.String,
    _10_MINS_TO_20_MINS: Schema.String,
    _20_MINS_TO_40_MINS: Schema.String,
    _40_MINS_TO_1_HOUR: Schema.String,
    oVER_3_HOURS: Schema.String.pipe(T.JsonName("OVER_3_HOURS")),
    uNDER_10_MINS: Schema.String.pipe(T.JsonName("UNDER_10_MINS")),
  }),
}) as unknown as Schema.Schema<DurationAttackLayer3SummaryResponse>;

export const durationAttackLayer3Summary: (
  input: DurationAttackLayer3SummaryRequest,
) => Effect.Effect<
  DurationAttackLayer3SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DurationAttackLayer3SummaryRequest,
  output: DurationAttackLayer3SummaryResponse,
  errors: [],
}));

export interface IndustryAttackLayer3SummaryRequest {}

export const IndustryAttackLayer3SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/summary/industry" }),
) as unknown as Schema.Schema<IndustryAttackLayer3SummaryRequest>;

export interface IndustryAttackLayer3SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const IndustryAttackLayer3SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<IndustryAttackLayer3SummaryResponse>;

export const industryAttackLayer3Summary: (
  input: IndustryAttackLayer3SummaryRequest,
) => Effect.Effect<
  IndustryAttackLayer3SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IndustryAttackLayer3SummaryRequest,
  output: IndustryAttackLayer3SummaryResponse,
  errors: [],
}));

export interface ProtocolAttackLayer3SummaryRequest {}

export const ProtocolAttackLayer3SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/summary/protocol" }),
) as unknown as Schema.Schema<ProtocolAttackLayer3SummaryRequest>;

export interface ProtocolAttackLayer3SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { gRE: string; iCMP: string; tCP: string; uDP: string };
}

export const ProtocolAttackLayer3SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    gRE: Schema.String.pipe(T.JsonName("GRE")),
    iCMP: Schema.String.pipe(T.JsonName("ICMP")),
    tCP: Schema.String.pipe(T.JsonName("TCP")),
    uDP: Schema.String.pipe(T.JsonName("UDP")),
  }),
}) as unknown as Schema.Schema<ProtocolAttackLayer3SummaryResponse>;

export const protocolAttackLayer3Summary: (
  input: ProtocolAttackLayer3SummaryRequest,
) => Effect.Effect<
  ProtocolAttackLayer3SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ProtocolAttackLayer3SummaryRequest,
  output: ProtocolAttackLayer3SummaryResponse,
  errors: [],
}));

export interface VectorAttackLayer3SummaryRequest {}

export const VectorAttackLayer3SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/summary/vector" }),
) as unknown as Schema.Schema<VectorAttackLayer3SummaryRequest>;

export interface VectorAttackLayer3SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const VectorAttackLayer3SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<VectorAttackLayer3SummaryResponse>;

export const vectorAttackLayer3Summary: (
  input: VectorAttackLayer3SummaryRequest,
) => Effect.Effect<
  VectorAttackLayer3SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: VectorAttackLayer3SummaryRequest,
  output: VectorAttackLayer3SummaryResponse,
  errors: [],
}));

export interface VerticalAttackLayer3SummaryRequest {}

export const VerticalAttackLayer3SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/summary/vertical" }),
) as unknown as Schema.Schema<VerticalAttackLayer3SummaryRequest>;

export interface VerticalAttackLayer3SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const VerticalAttackLayer3SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<VerticalAttackLayer3SummaryResponse>;

export const verticalAttackLayer3Summary: (
  input: VerticalAttackLayer3SummaryRequest,
) => Effect.Effect<
  VerticalAttackLayer3SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: VerticalAttackLayer3SummaryRequest,
  output: VerticalAttackLayer3SummaryResponse,
  errors: [],
}));

// =============================================================================
// AttackLayer3TimeseriesGroup
// =============================================================================

export interface BitrateAttackLayer3TimeseriesGroupRequest {}

export const BitrateAttackLayer3TimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer3/timeseries_groups/bitrate",
  }),
) as unknown as Schema.Schema<BitrateAttackLayer3TimeseriesGroupRequest>;

export interface BitrateAttackLayer3TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    _1_GBPS_TO_10_GBPS: string[];
    _10_GBPS_TO_100_GBPS: string[];
    _500_MBPS_TO_1_GBPS: string[];
    oVER_100_GBPS: string[];
    timestamps: string[];
    uNDER_500_MBPS: string[];
  };
}

export const BitrateAttackLayer3TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    _1_GBPS_TO_10_GBPS: Schema.Array(Schema.String),
    _10_GBPS_TO_100_GBPS: Schema.Array(Schema.String),
    _500_MBPS_TO_1_GBPS: Schema.Array(Schema.String),
    oVER_100_GBPS: Schema.Array(Schema.String).pipe(
      T.JsonName("OVER_100_GBPS"),
    ),
    timestamps: Schema.Array(Schema.String),
    uNDER_500_MBPS: Schema.Array(Schema.String).pipe(
      T.JsonName("UNDER_500_MBPS"),
    ),
  }),
}) as unknown as Schema.Schema<BitrateAttackLayer3TimeseriesGroupResponse>;

export const bitrateAttackLayer3TimeseriesGroup: (
  input: BitrateAttackLayer3TimeseriesGroupRequest,
) => Effect.Effect<
  BitrateAttackLayer3TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BitrateAttackLayer3TimeseriesGroupRequest,
  output: BitrateAttackLayer3TimeseriesGroupResponse,
  errors: [],
}));

export interface DurationAttackLayer3TimeseriesGroupRequest {}

export const DurationAttackLayer3TimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer3/timeseries_groups/duration",
  }),
) as unknown as Schema.Schema<DurationAttackLayer3TimeseriesGroupRequest>;

export interface DurationAttackLayer3TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    _1_HOUR_TO_3_HOURS: string[];
    _10_MINS_TO_20_MINS: string[];
    _20_MINS_TO_40_MINS: string[];
    _40_MINS_TO_1_HOUR: string[];
    oVER_3_HOURS: string[];
    timestamps: string[];
    uNDER_10_MINS: string[];
  };
}

export const DurationAttackLayer3TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    _1_HOUR_TO_3_HOURS: Schema.Array(Schema.String),
    _10_MINS_TO_20_MINS: Schema.Array(Schema.String),
    _20_MINS_TO_40_MINS: Schema.Array(Schema.String),
    _40_MINS_TO_1_HOUR: Schema.Array(Schema.String),
    oVER_3_HOURS: Schema.Array(Schema.String).pipe(T.JsonName("OVER_3_HOURS")),
    timestamps: Schema.Array(Schema.String),
    uNDER_10_MINS: Schema.Array(Schema.String).pipe(
      T.JsonName("UNDER_10_MINS"),
    ),
  }),
}) as unknown as Schema.Schema<DurationAttackLayer3TimeseriesGroupResponse>;

export const durationAttackLayer3TimeseriesGroup: (
  input: DurationAttackLayer3TimeseriesGroupRequest,
) => Effect.Effect<
  DurationAttackLayer3TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DurationAttackLayer3TimeseriesGroupRequest,
  output: DurationAttackLayer3TimeseriesGroupResponse,
  errors: [],
}));

export interface IndustryAttackLayer3TimeseriesGroupRequest {}

export const IndustryAttackLayer3TimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer3/timeseries_groups/industry",
  }),
) as unknown as Schema.Schema<IndustryAttackLayer3TimeseriesGroupRequest>;

export interface IndustryAttackLayer3TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const IndustryAttackLayer3TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<IndustryAttackLayer3TimeseriesGroupResponse>;

export const industryAttackLayer3TimeseriesGroup: (
  input: IndustryAttackLayer3TimeseriesGroupRequest,
) => Effect.Effect<
  IndustryAttackLayer3TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IndustryAttackLayer3TimeseriesGroupRequest,
  output: IndustryAttackLayer3TimeseriesGroupResponse,
  errors: [],
}));

export interface ProtocolAttackLayer3TimeseriesGroupRequest {}

export const ProtocolAttackLayer3TimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer3/timeseries_groups/protocol",
  }),
) as unknown as Schema.Schema<ProtocolAttackLayer3TimeseriesGroupRequest>;

export interface ProtocolAttackLayer3TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    gRE: string[];
    iCMP: string[];
    tCP: string[];
    timestamps: string[];
    uDP: string[];
  };
}

export const ProtocolAttackLayer3TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    gRE: Schema.Array(Schema.String).pipe(T.JsonName("GRE")),
    iCMP: Schema.Array(Schema.String).pipe(T.JsonName("ICMP")),
    tCP: Schema.Array(Schema.String).pipe(T.JsonName("TCP")),
    timestamps: Schema.Array(Schema.String),
    uDP: Schema.Array(Schema.String).pipe(T.JsonName("UDP")),
  }),
}) as unknown as Schema.Schema<ProtocolAttackLayer3TimeseriesGroupResponse>;

export const protocolAttackLayer3TimeseriesGroup: (
  input: ProtocolAttackLayer3TimeseriesGroupRequest,
) => Effect.Effect<
  ProtocolAttackLayer3TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ProtocolAttackLayer3TimeseriesGroupRequest,
  output: ProtocolAttackLayer3TimeseriesGroupResponse,
  errors: [],
}));

export interface VectorAttackLayer3TimeseriesGroupRequest {}

export const VectorAttackLayer3TimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer3/timeseries_groups/vector",
  }),
) as unknown as Schema.Schema<VectorAttackLayer3TimeseriesGroupRequest>;

export interface VectorAttackLayer3TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const VectorAttackLayer3TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<VectorAttackLayer3TimeseriesGroupResponse>;

export const vectorAttackLayer3TimeseriesGroup: (
  input: VectorAttackLayer3TimeseriesGroupRequest,
) => Effect.Effect<
  VectorAttackLayer3TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: VectorAttackLayer3TimeseriesGroupRequest,
  output: VectorAttackLayer3TimeseriesGroupResponse,
  errors: [],
}));

export interface VerticalAttackLayer3TimeseriesGroupRequest {}

export const VerticalAttackLayer3TimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer3/timeseries_groups/vertical",
  }),
) as unknown as Schema.Schema<VerticalAttackLayer3TimeseriesGroupRequest>;

export interface VerticalAttackLayer3TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const VerticalAttackLayer3TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<VerticalAttackLayer3TimeseriesGroupResponse>;

export const verticalAttackLayer3TimeseriesGroup: (
  input: VerticalAttackLayer3TimeseriesGroupRequest,
) => Effect.Effect<
  VerticalAttackLayer3TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: VerticalAttackLayer3TimeseriesGroupRequest,
  output: VerticalAttackLayer3TimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// AttackLayer3Top
// =============================================================================

export interface AttacksAttackLayer3TopRequest {}

export const AttacksAttackLayer3TopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/top/attacks" }),
) as unknown as Schema.Schema<AttacksAttackLayer3TopRequest>;

export interface AttacksAttackLayer3TopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    originCountryAlpha2: string;
    originCountryName: string;
    value: string;
  }[];
}

export const AttacksAttackLayer3TopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      originCountryAlpha2: Schema.String,
      originCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<AttacksAttackLayer3TopResponse>;

export const attacksAttackLayer3Top: (
  input: AttacksAttackLayer3TopRequest,
) => Effect.Effect<
  AttacksAttackLayer3TopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: AttacksAttackLayer3TopRequest,
  output: AttacksAttackLayer3TopResponse,
  errors: [],
}));

export interface IndustryAttackLayer3TopRequest {}

export const IndustryAttackLayer3TopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/top/industry" }),
) as unknown as Schema.Schema<IndustryAttackLayer3TopRequest>;

export interface IndustryAttackLayer3TopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: string }[];
}

export const IndustryAttackLayer3TopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<IndustryAttackLayer3TopResponse>;

export const industryAttackLayer3Top: (
  input: IndustryAttackLayer3TopRequest,
) => Effect.Effect<
  IndustryAttackLayer3TopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IndustryAttackLayer3TopRequest,
  output: IndustryAttackLayer3TopResponse,
  errors: [],
}));

export interface VerticalAttackLayer3TopRequest {}

export const VerticalAttackLayer3TopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/top/vertical" }),
) as unknown as Schema.Schema<VerticalAttackLayer3TopRequest>;

export interface VerticalAttackLayer3TopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: string }[];
}

export const VerticalAttackLayer3TopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<VerticalAttackLayer3TopResponse>;

export const verticalAttackLayer3Top: (
  input: VerticalAttackLayer3TopRequest,
) => Effect.Effect<
  VerticalAttackLayer3TopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: VerticalAttackLayer3TopRequest,
  output: VerticalAttackLayer3TopResponse,
  errors: [],
}));

// =============================================================================
// AttackLayer3TopLocation
// =============================================================================

export interface OriginAttackLayer3TopLocationRequest {}

export const OriginAttackLayer3TopLocationRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/top/locations/origin" }),
) as unknown as Schema.Schema<OriginAttackLayer3TopLocationRequest>;

export interface OriginAttackLayer3TopLocationResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    originCountryAlpha2: string;
    originCountryName: string;
    rank: number;
    value: string;
  }[];
}

export const OriginAttackLayer3TopLocationResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      originCountryAlpha2: Schema.String,
      originCountryName: Schema.String,
      rank: Schema.Number,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<OriginAttackLayer3TopLocationResponse>;

export const originAttackLayer3TopLocation: (
  input: OriginAttackLayer3TopLocationRequest,
) => Effect.Effect<
  OriginAttackLayer3TopLocationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: OriginAttackLayer3TopLocationRequest,
  output: OriginAttackLayer3TopLocationResponse,
  errors: [],
}));

export interface TargetAttackLayer3TopLocationRequest {}

export const TargetAttackLayer3TopLocationRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/top/locations/target" }),
) as unknown as Schema.Schema<TargetAttackLayer3TopLocationRequest>;

export interface TargetAttackLayer3TopLocationResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    rank: number;
    targetCountryAlpha2: string;
    targetCountryName: string;
    value: string;
  }[];
}

export const TargetAttackLayer3TopLocationResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      rank: Schema.Number,
      targetCountryAlpha2: Schema.String,
      targetCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<TargetAttackLayer3TopLocationResponse>;

export const targetAttackLayer3TopLocation: (
  input: TargetAttackLayer3TopLocationRequest,
) => Effect.Effect<
  TargetAttackLayer3TopLocationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TargetAttackLayer3TopLocationRequest,
  output: TargetAttackLayer3TopLocationResponse,
  errors: [],
}));

// =============================================================================
// AttackLayer7
// =============================================================================

export interface TimeseriesAttackLayer7Request {}

export const TimeseriesAttackLayer7Request = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/timeseries" }),
) as unknown as Schema.Schema<TimeseriesAttackLayer7Request>;

export interface TimeseriesAttackLayer7Response {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[]; values: string[] };
}

export const TimeseriesAttackLayer7Response = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
    values: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TimeseriesAttackLayer7Response>;

export const timeseriesAttackLayer7: (
  input: TimeseriesAttackLayer7Request,
) => Effect.Effect<
  TimeseriesAttackLayer7Response,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesAttackLayer7Request,
  output: TimeseriesAttackLayer7Response,
  errors: [],
}));

// =============================================================================
// AttackLayer7Summary
// =============================================================================

export interface IndustryAttackLayer7SummaryRequest {}

export const IndustryAttackLayer7SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/summary/industry" }),
) as unknown as Schema.Schema<IndustryAttackLayer7SummaryRequest>;

export interface IndustryAttackLayer7SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const IndustryAttackLayer7SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<IndustryAttackLayer7SummaryResponse>;

export const industryAttackLayer7Summary: (
  input: IndustryAttackLayer7SummaryRequest,
) => Effect.Effect<
  IndustryAttackLayer7SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IndustryAttackLayer7SummaryRequest,
  output: IndustryAttackLayer7SummaryResponse,
  errors: [],
}));

export interface VerticalAttackLayer7SummaryRequest {}

export const VerticalAttackLayer7SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/summary/vertical" }),
) as unknown as Schema.Schema<VerticalAttackLayer7SummaryRequest>;

export interface VerticalAttackLayer7SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const VerticalAttackLayer7SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<VerticalAttackLayer7SummaryResponse>;

export const verticalAttackLayer7Summary: (
  input: VerticalAttackLayer7SummaryRequest,
) => Effect.Effect<
  VerticalAttackLayer7SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: VerticalAttackLayer7SummaryRequest,
  output: VerticalAttackLayer7SummaryResponse,
  errors: [],
}));

// =============================================================================
// AttackLayer7TimeseriesGroup
// =============================================================================

export interface IndustryAttackLayer7TimeseriesGroupRequest {}

export const IndustryAttackLayer7TimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer7/timeseries_groups/industry",
  }),
) as unknown as Schema.Schema<IndustryAttackLayer7TimeseriesGroupRequest>;

export interface IndustryAttackLayer7TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const IndustryAttackLayer7TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<IndustryAttackLayer7TimeseriesGroupResponse>;

export const industryAttackLayer7TimeseriesGroup: (
  input: IndustryAttackLayer7TimeseriesGroupRequest,
) => Effect.Effect<
  IndustryAttackLayer7TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IndustryAttackLayer7TimeseriesGroupRequest,
  output: IndustryAttackLayer7TimeseriesGroupResponse,
  errors: [],
}));

export interface VerticalAttackLayer7TimeseriesGroupRequest {}

export const VerticalAttackLayer7TimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer7/timeseries_groups/vertical",
  }),
) as unknown as Schema.Schema<VerticalAttackLayer7TimeseriesGroupRequest>;

export interface VerticalAttackLayer7TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const VerticalAttackLayer7TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<VerticalAttackLayer7TimeseriesGroupResponse>;

export const verticalAttackLayer7TimeseriesGroup: (
  input: VerticalAttackLayer7TimeseriesGroupRequest,
) => Effect.Effect<
  VerticalAttackLayer7TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: VerticalAttackLayer7TimeseriesGroupRequest,
  output: VerticalAttackLayer7TimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// AttackLayer7Top
// =============================================================================

export interface AttacksAttackLayer7TopRequest {}

export const AttacksAttackLayer7TopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/top/attacks" }),
) as unknown as Schema.Schema<AttacksAttackLayer7TopRequest>;

export interface AttacksAttackLayer7TopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    originCountryAlpha2: string;
    originCountryName: string;
    targetCountryAlpha2: string;
    targetCountryName: string;
    value: string;
  }[];
}

export const AttacksAttackLayer7TopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      originCountryAlpha2: Schema.String,
      originCountryName: Schema.String,
      targetCountryAlpha2: Schema.String,
      targetCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<AttacksAttackLayer7TopResponse>;

export const attacksAttackLayer7Top: (
  input: AttacksAttackLayer7TopRequest,
) => Effect.Effect<
  AttacksAttackLayer7TopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: AttacksAttackLayer7TopRequest,
  output: AttacksAttackLayer7TopResponse,
  errors: [],
}));

export interface IndustryAttackLayer7TopRequest {}

export const IndustryAttackLayer7TopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/top/industry" }),
) as unknown as Schema.Schema<IndustryAttackLayer7TopRequest>;

export interface IndustryAttackLayer7TopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: string }[];
}

export const IndustryAttackLayer7TopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<IndustryAttackLayer7TopResponse>;

export const industryAttackLayer7Top: (
  input: IndustryAttackLayer7TopRequest,
) => Effect.Effect<
  IndustryAttackLayer7TopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IndustryAttackLayer7TopRequest,
  output: IndustryAttackLayer7TopResponse,
  errors: [],
}));

export interface VerticalAttackLayer7TopRequest {}

export const VerticalAttackLayer7TopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/top/vertical" }),
) as unknown as Schema.Schema<VerticalAttackLayer7TopRequest>;

export interface VerticalAttackLayer7TopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: string }[];
}

export const VerticalAttackLayer7TopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<VerticalAttackLayer7TopResponse>;

export const verticalAttackLayer7Top: (
  input: VerticalAttackLayer7TopRequest,
) => Effect.Effect<
  VerticalAttackLayer7TopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: VerticalAttackLayer7TopRequest,
  output: VerticalAttackLayer7TopResponse,
  errors: [],
}));

// =============================================================================
// AttackLayer7TopA
// =============================================================================

export interface OriginAttackLayer7TopAsRequest {}

export const OriginAttackLayer7TopAsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/top/ases/origin" }),
) as unknown as Schema.Schema<OriginAttackLayer7TopAsRequest>;

export interface OriginAttackLayer7TopAsResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    originAsn: string;
    originAsnName: string;
    rank: number;
    value: string;
  }[];
}

export const OriginAttackLayer7TopAsResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      originAsn: Schema.String,
      originAsnName: Schema.String,
      rank: Schema.Number,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<OriginAttackLayer7TopAsResponse>;

export const originAttackLayer7TopAs: (
  input: OriginAttackLayer7TopAsRequest,
) => Effect.Effect<
  OriginAttackLayer7TopAsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: OriginAttackLayer7TopAsRequest,
  output: OriginAttackLayer7TopAsResponse,
  errors: [],
}));

// =============================================================================
// AttackLayer7TopLocation
// =============================================================================

export interface OriginAttackLayer7TopLocationRequest {}

export const OriginAttackLayer7TopLocationRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/top/locations/origin" }),
) as unknown as Schema.Schema<OriginAttackLayer7TopLocationRequest>;

export interface OriginAttackLayer7TopLocationResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    originCountryAlpha2: string;
    originCountryName: string;
    rank: number;
    value: string;
  }[];
}

export const OriginAttackLayer7TopLocationResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      originCountryAlpha2: Schema.String,
      originCountryName: Schema.String,
      rank: Schema.Number,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<OriginAttackLayer7TopLocationResponse>;

export const originAttackLayer7TopLocation: (
  input: OriginAttackLayer7TopLocationRequest,
) => Effect.Effect<
  OriginAttackLayer7TopLocationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: OriginAttackLayer7TopLocationRequest,
  output: OriginAttackLayer7TopLocationResponse,
  errors: [],
}));

export interface TargetAttackLayer7TopLocationRequest {}

export const TargetAttackLayer7TopLocationRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/top/locations/target" }),
) as unknown as Schema.Schema<TargetAttackLayer7TopLocationRequest>;

export interface TargetAttackLayer7TopLocationResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    rank: number;
    targetCountryAlpha2: string;
    targetCountryName: string;
    value: string;
  }[];
}

export const TargetAttackLayer7TopLocationResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      rank: Schema.Number,
      targetCountryAlpha2: Schema.String,
      targetCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<TargetAttackLayer7TopLocationResponse>;

export const targetAttackLayer7TopLocation: (
  input: TargetAttackLayer7TopLocationRequest,
) => Effect.Effect<
  TargetAttackLayer7TopLocationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TargetAttackLayer7TopLocationRequest,
  output: TargetAttackLayer7TopLocationResponse,
  errors: [],
}));

// =============================================================================
// AwareDnsSummary
// =============================================================================

export interface DnssecAwareDnsSummaryRequest {}

export const DnssecAwareDnsSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/summary/dnssec_aware" }),
) as unknown as Schema.Schema<DnssecAwareDnsSummaryRequest>;

export interface DnssecAwareDnsSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { nOT_SUPPORTED: string; sUPPORTED: string };
}

export const DnssecAwareDnsSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    nOT_SUPPORTED: Schema.String.pipe(T.JsonName("NOT_SUPPORTED")),
    sUPPORTED: Schema.String.pipe(T.JsonName("SUPPORTED")),
  }),
}) as unknown as Schema.Schema<DnssecAwareDnsSummaryResponse>;

export const dnssecAwareDnsSummary: (
  input: DnssecAwareDnsSummaryRequest,
) => Effect.Effect<
  DnssecAwareDnsSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DnssecAwareDnsSummaryRequest,
  output: DnssecAwareDnsSummaryResponse,
  errors: [],
}));

// =============================================================================
// AwareDnsTimeseriesGroup
// =============================================================================

export interface DnssecAwareDnsTimeseriesGroupRequest {}

export const DnssecAwareDnsTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/timeseries_groups/dnssec_aware" }),
) as unknown as Schema.Schema<DnssecAwareDnsTimeseriesGroupRequest>;

export interface DnssecAwareDnsTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { nOT_SUPPORTED: string[]; sUPPORTED: string[] };
}

export const DnssecAwareDnsTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    nOT_SUPPORTED: Schema.Array(Schema.String).pipe(
      T.JsonName("NOT_SUPPORTED"),
    ),
    sUPPORTED: Schema.Array(Schema.String).pipe(T.JsonName("SUPPORTED")),
  }),
}) as unknown as Schema.Schema<DnssecAwareDnsTimeseriesGroupResponse>;

export const dnssecAwareDnsTimeseriesGroup: (
  input: DnssecAwareDnsTimeseriesGroupRequest,
) => Effect.Effect<
  DnssecAwareDnsTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DnssecAwareDnsTimeseriesGroupRequest,
  output: DnssecAwareDnsTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// Bgp
// =============================================================================

export interface TimeseriesBgpRequest {}

export const TimeseriesBgpRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bgp/timeseries" }),
) as unknown as Schema.Schema<TimeseriesBgpRequest>;

export interface TimeseriesBgpResponse {
  meta: {
    aggInterval: "15m" | "1h" | "1d" | "1w";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
  };
  serie_0: { timestamps: string[]; values: string[] };
}

export const TimeseriesBgpResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal("15m", "1h", "1d", "1w"),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
    values: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TimeseriesBgpResponse>;

export const timeseriesBgp: (
  input: TimeseriesBgpRequest,
) => Effect.Effect<
  TimeseriesBgpResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesBgpRequest,
  output: TimeseriesBgpResponse,
  errors: [],
}));

// =============================================================================
// BgpIp
// =============================================================================

export interface TimeseriesBgpIpRequest {}

export const TimeseriesBgpIpRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bgp/ips/timeseries" }),
) as unknown as Schema.Schema<TimeseriesBgpIpRequest>;

export interface TimeseriesBgpIpResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
    delay?: {
      asnData: {
        delaySecs: number;
        delayStr: string;
        healthy: boolean;
        latest: { entriesCount: number; path: string; timestamp: number };
      };
      countryData: {
        delaySecs: number;
        delayStr: string;
        healthy: boolean;
        latest: { count: number; timestamp: number };
      };
      healthy: boolean;
      nowTs: number;
    };
  };
  serie_0: { ipv4: string[]; ipv6: string[]; timestamps: string[] };
}

export const TimeseriesBgpIpResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
    delay: Schema.optional(
      Schema.Struct({
        asnData: Schema.Struct({
          delaySecs: Schema.Number,
          delayStr: Schema.String,
          healthy: Schema.Boolean,
          latest: Schema.Struct({
            entriesCount: Schema.Number.pipe(T.JsonName("entries_count")),
            path: Schema.String,
            timestamp: Schema.Number,
          }),
        }).pipe(T.JsonName("asn_data")),
        countryData: Schema.Struct({
          delaySecs: Schema.Number,
          delayStr: Schema.String,
          healthy: Schema.Boolean,
          latest: Schema.Struct({
            count: Schema.Number,
            timestamp: Schema.Number,
          }),
        }).pipe(T.JsonName("country_data")),
        healthy: Schema.Boolean,
        nowTs: Schema.Number,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    ipv4: Schema.Array(Schema.String),
    ipv6: Schema.Array(Schema.String),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TimeseriesBgpIpResponse>;

export const timeseriesBgpIp: (
  input: TimeseriesBgpIpRequest,
) => Effect.Effect<
  TimeseriesBgpIpResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesBgpIpRequest,
  output: TimeseriesBgpIpResponse,
  errors: [],
}));

// =============================================================================
// BgpRoute
// =============================================================================

export interface AsesBgpRouteRequest {}

export const AsesBgpRouteRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bgp/routes/ases" }),
) as unknown as Schema.Schema<AsesBgpRouteRequest>;

export interface AsesBgpRouteResponse {
  asns: {
    asn: number;
    coneSize: number;
    country: string;
    ipv4Count: number;
    ipv6Count: string;
    name: string;
    pfxsCount: number;
    rpkiInvalid: number;
    rpkiUnknown: number;
    rpkiValid: number;
  }[];
  meta: { dataTime: string; queryTime: string; totalPeers: number };
}

export const AsesBgpRouteResponse = Schema.Struct({
  asns: Schema.Array(
    Schema.Struct({
      asn: Schema.Number,
      coneSize: Schema.Number,
      country: Schema.String,
      ipv4Count: Schema.Number,
      ipv6Count: Schema.String,
      name: Schema.String,
      pfxsCount: Schema.Number,
      rpkiInvalid: Schema.Number,
      rpkiUnknown: Schema.Number,
      rpkiValid: Schema.Number,
    }),
  ),
  meta: Schema.Struct({
    dataTime: Schema.String,
    queryTime: Schema.String,
    totalPeers: Schema.Number,
  }),
}) as unknown as Schema.Schema<AsesBgpRouteResponse>;

export const asesBgpRoute: (
  input: AsesBgpRouteRequest,
) => Effect.Effect<
  AsesBgpRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: AsesBgpRouteRequest,
  output: AsesBgpRouteResponse,
  errors: [],
}));

export interface MoasBgpRouteRequest {}

export const MoasBgpRouteRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bgp/routes/moas" }),
) as unknown as Schema.Schema<MoasBgpRouteRequest>;

export interface MoasBgpRouteResponse {
  meta: { dataTime: string; queryTime: string; totalPeers: number };
  moas: {
    origins: { origin: number; peerCount: number; rpkiValidation: string }[];
    prefix: string;
  }[];
}

export const MoasBgpRouteResponse = Schema.Struct({
  meta: Schema.Struct({
    dataTime: Schema.String.pipe(T.JsonName("data_time")),
    queryTime: Schema.String.pipe(T.JsonName("query_time")),
    totalPeers: Schema.Number.pipe(T.JsonName("total_peers")),
  }),
  moas: Schema.Array(
    Schema.Struct({
      origins: Schema.Array(
        Schema.Struct({
          origin: Schema.Number,
          peerCount: Schema.Number.pipe(T.JsonName("peer_count")),
          rpkiValidation: Schema.String.pipe(T.JsonName("rpki_validation")),
        }),
      ),
      prefix: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<MoasBgpRouteResponse>;

export const moasBgpRoute: (
  input: MoasBgpRouteRequest,
) => Effect.Effect<
  MoasBgpRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: MoasBgpRouteRequest,
  output: MoasBgpRouteResponse,
  errors: [],
}));

export interface Pfx2asBgpRouteRequest {}

export const Pfx2asBgpRouteRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bgp/routes/pfx2as" }),
) as unknown as Schema.Schema<Pfx2asBgpRouteRequest>;

export interface Pfx2asBgpRouteResponse {
  meta: { dataTime: string; queryTime: string; totalPeers: number };
  prefixOrigins: {
    origin: number;
    peerCount: number;
    prefix: string;
    rpkiValidation: string;
  }[];
}

export const Pfx2asBgpRouteResponse = Schema.Struct({
  meta: Schema.Struct({
    dataTime: Schema.String.pipe(T.JsonName("data_time")),
    queryTime: Schema.String.pipe(T.JsonName("query_time")),
    totalPeers: Schema.Number.pipe(T.JsonName("total_peers")),
  }),
  prefixOrigins: Schema.Array(
    Schema.Struct({
      origin: Schema.Number,
      peerCount: Schema.Number.pipe(T.JsonName("peer_count")),
      prefix: Schema.String,
      rpkiValidation: Schema.String.pipe(T.JsonName("rpki_validation")),
    }),
  ).pipe(T.JsonName("prefix_origins")),
}) as unknown as Schema.Schema<Pfx2asBgpRouteResponse>;

export const pfx2asBgpRoute: (
  input: Pfx2asBgpRouteRequest,
) => Effect.Effect<
  Pfx2asBgpRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: Pfx2asBgpRouteRequest,
  output: Pfx2asBgpRouteResponse,
  errors: [],
}));

export interface RealtimeBgpRouteRequest {}

export const RealtimeBgpRouteRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bgp/routes/realtime" }),
) as unknown as Schema.Schema<RealtimeBgpRouteRequest>;

export interface RealtimeBgpRouteResponse {
  meta: {
    asnInfo: {
      asName: string;
      asn: number;
      countryCode: string;
      orgId: string;
      orgName: string;
    }[];
    collectors: {
      collector: string;
      latestRealtimeTs: string;
      latestRibTs: string;
      latestUpdatesTs: string;
      peersCount: number;
      peersV4Count: number;
      peersV6Count: number;
    }[];
    dataTime: string;
    prefixOrigins: {
      origin: number;
      prefix: string;
      rpkiValidation: string;
      totalPeers: number;
      totalVisible: number;
      visibility: number;
    }[];
    queryTime: string;
  };
  routes: {
    asPath: number[];
    collector: string;
    communities: string[];
    prefix: string;
    timestamp: string;
  }[];
}

export const RealtimeBgpRouteResponse = Schema.Struct({
  meta: Schema.Struct({
    asnInfo: Schema.Array(
      Schema.Struct({
        asName: Schema.String.pipe(T.JsonName("as_name")),
        asn: Schema.Number,
        countryCode: Schema.String.pipe(T.JsonName("country_code")),
        orgId: Schema.String.pipe(T.JsonName("org_id")),
        orgName: Schema.String.pipe(T.JsonName("org_name")),
      }),
    ).pipe(T.JsonName("asn_info")),
    collectors: Schema.Array(
      Schema.Struct({
        collector: Schema.String,
        latestRealtimeTs: Schema.String.pipe(T.JsonName("latest_realtime_ts")),
        latestRibTs: Schema.String.pipe(T.JsonName("latest_rib_ts")),
        latestUpdatesTs: Schema.String.pipe(T.JsonName("latest_updates_ts")),
        peersCount: Schema.Number.pipe(T.JsonName("peers_count")),
        peersV4Count: Schema.Number.pipe(T.JsonName("peers_v4_count")),
        peersV6Count: Schema.Number.pipe(T.JsonName("peers_v6_count")),
      }),
    ),
    dataTime: Schema.String.pipe(T.JsonName("data_time")),
    prefixOrigins: Schema.Array(
      Schema.Struct({
        origin: Schema.Number,
        prefix: Schema.String,
        rpkiValidation: Schema.String.pipe(T.JsonName("rpki_validation")),
        totalPeers: Schema.Number.pipe(T.JsonName("total_peers")),
        totalVisible: Schema.Number.pipe(T.JsonName("total_visible")),
        visibility: Schema.Number,
      }),
    ).pipe(T.JsonName("prefix_origins")),
    queryTime: Schema.String.pipe(T.JsonName("query_time")),
  }),
  routes: Schema.Array(
    Schema.Struct({
      asPath: Schema.Array(Schema.Number).pipe(T.JsonName("as_path")),
      collector: Schema.String,
      communities: Schema.Array(Schema.String),
      prefix: Schema.String,
      timestamp: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<RealtimeBgpRouteResponse>;

export const realtimeBgpRoute: (
  input: RealtimeBgpRouteRequest,
) => Effect.Effect<
  RealtimeBgpRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RealtimeBgpRouteRequest,
  output: RealtimeBgpRouteResponse,
  errors: [],
}));

export interface StatsBgpRouteRequest {}

export const StatsBgpRouteRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bgp/routes/stats" }),
) as unknown as Schema.Schema<StatsBgpRouteRequest>;

export interface StatsBgpRouteResponse {
  meta: { dataTime: string; queryTime: string; totalPeers: number };
  stats: {
    distinctOrigins: number;
    distinctOriginsIpv4: number;
    distinctOriginsIpv6: number;
    distinctPrefixes: number;
    distinctPrefixesIpv4: number;
    distinctPrefixesIpv6: number;
    routesInvalid: number;
    routesInvalidIpv4: number;
    routesInvalidIpv6: number;
    routesTotal: number;
    routesTotalIpv4: number;
    routesTotalIpv6: number;
    routesUnknown: number;
    routesUnknownIpv4: number;
    routesUnknownIpv6: number;
    routesValid: number;
    routesValidIpv4: number;
    routesValidIpv6: number;
  };
}

export const StatsBgpRouteResponse = Schema.Struct({
  meta: Schema.Struct({
    dataTime: Schema.String.pipe(T.JsonName("data_time")),
    queryTime: Schema.String.pipe(T.JsonName("query_time")),
    totalPeers: Schema.Number.pipe(T.JsonName("total_peers")),
  }),
  stats: Schema.Struct({
    distinctOrigins: Schema.Number.pipe(T.JsonName("distinct_origins")),
    distinctOriginsIpv4: Schema.Number.pipe(
      T.JsonName("distinct_origins_ipv4"),
    ),
    distinctOriginsIpv6: Schema.Number.pipe(
      T.JsonName("distinct_origins_ipv6"),
    ),
    distinctPrefixes: Schema.Number.pipe(T.JsonName("distinct_prefixes")),
    distinctPrefixesIpv4: Schema.Number.pipe(
      T.JsonName("distinct_prefixes_ipv4"),
    ),
    distinctPrefixesIpv6: Schema.Number.pipe(
      T.JsonName("distinct_prefixes_ipv6"),
    ),
    routesInvalid: Schema.Number.pipe(T.JsonName("routes_invalid")),
    routesInvalidIpv4: Schema.Number.pipe(T.JsonName("routes_invalid_ipv4")),
    routesInvalidIpv6: Schema.Number.pipe(T.JsonName("routes_invalid_ipv6")),
    routesTotal: Schema.Number.pipe(T.JsonName("routes_total")),
    routesTotalIpv4: Schema.Number.pipe(T.JsonName("routes_total_ipv4")),
    routesTotalIpv6: Schema.Number.pipe(T.JsonName("routes_total_ipv6")),
    routesUnknown: Schema.Number.pipe(T.JsonName("routes_unknown")),
    routesUnknownIpv4: Schema.Number.pipe(T.JsonName("routes_unknown_ipv4")),
    routesUnknownIpv6: Schema.Number.pipe(T.JsonName("routes_unknown_ipv6")),
    routesValid: Schema.Number.pipe(T.JsonName("routes_valid")),
    routesValidIpv4: Schema.Number.pipe(T.JsonName("routes_valid_ipv4")),
    routesValidIpv6: Schema.Number.pipe(T.JsonName("routes_valid_ipv6")),
  }),
}) as unknown as Schema.Schema<StatsBgpRouteResponse>;

export const statsBgpRoute: (
  input: StatsBgpRouteRequest,
) => Effect.Effect<
  StatsBgpRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: StatsBgpRouteRequest,
  output: StatsBgpRouteResponse,
  errors: [],
}));

// =============================================================================
// BgpTop
// =============================================================================

export interface PrefixesBgpTopRequest {}

export const PrefixesBgpTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bgp/top/prefixes" }),
) as unknown as Schema.Schema<PrefixesBgpTopRequest>;

export interface PrefixesBgpTopResponse {
  meta: { dateRange: { endTime: string; startTime: string }[] };
  top_0: { prefix: string; value: string }[];
}

export const PrefixesBgpTopResponse = Schema.Struct({
  meta: Schema.Struct({
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      prefix: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<PrefixesBgpTopResponse>;

export const prefixesBgpTop: (
  input: PrefixesBgpTopRequest,
) => Effect.Effect<
  PrefixesBgpTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PrefixesBgpTopRequest,
  output: PrefixesBgpTopResponse,
  errors: [],
}));

// =============================================================================
// BgpTopA
// =============================================================================

export interface GetBgpTopAsRequest {}

export const GetBgpTopAsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bgp/top/ases" }),
) as unknown as Schema.Schema<GetBgpTopAsRequest>;

export interface GetBgpTopAsResponse {
  meta: { dateRange: { endTime: string; startTime: string }[] };
  top_0: { asn: number; aSName: string; value: string }[];
}

export const GetBgpTopAsResponse = Schema.Struct({
  meta: Schema.Struct({
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      asn: Schema.Number,
      aSName: Schema.String.pipe(T.JsonName("ASName")),
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetBgpTopAsResponse>;

export const getBgpTopAs: (
  input: GetBgpTopAsRequest,
) => Effect.Effect<
  GetBgpTopAsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBgpTopAsRequest,
  output: GetBgpTopAsResponse,
  errors: [],
}));

export interface PrefixesBgpTopAsRequest {}

export const PrefixesBgpTopAsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bgp/top/ases/prefixes" }),
) as unknown as Schema.Schema<PrefixesBgpTopAsRequest>;

export interface PrefixesBgpTopAsResponse {
  asns: { asn: number; country: string; name: string; pfxsCount: number }[];
  meta: { dataTime: string; queryTime: string; totalPeers: number };
}

export const PrefixesBgpTopAsResponse = Schema.Struct({
  asns: Schema.Array(
    Schema.Struct({
      asn: Schema.Number,
      country: Schema.String,
      name: Schema.String,
      pfxsCount: Schema.Number.pipe(T.JsonName("pfxs_count")),
    }),
  ),
  meta: Schema.Struct({
    dataTime: Schema.String.pipe(T.JsonName("data_time")),
    queryTime: Schema.String.pipe(T.JsonName("query_time")),
    totalPeers: Schema.Number.pipe(T.JsonName("total_peers")),
  }),
}) as unknown as Schema.Schema<PrefixesBgpTopAsResponse>;

export const prefixesBgpTopAs: (
  input: PrefixesBgpTopAsRequest,
) => Effect.Effect<
  PrefixesBgpTopAsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PrefixesBgpTopAsRequest,
  output: PrefixesBgpTopAsResponse,
  errors: [],
}));

// =============================================================================
// Bot
// =============================================================================

export interface GetBotRequest {
  botSlug: string;
}

export const GetBotRequest = Schema.Struct({
  botSlug: Schema.String.pipe(T.HttpPath("botSlug")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/bots/{botSlug}" }),
) as unknown as Schema.Schema<GetBotRequest>;

export interface GetBotResponse {
  bot: {
    category: string;
    description: string;
    kind: string;
    name: string;
    operator: string;
    operatorUrl: string;
    slug: string;
    userAgentPatterns: string[];
    userAgents: string[];
  };
}

export const GetBotResponse = Schema.Struct({
  bot: Schema.Struct({
    category: Schema.String,
    description: Schema.String,
    kind: Schema.String,
    name: Schema.String,
    operator: Schema.String,
    operatorUrl: Schema.String,
    slug: Schema.String,
    userAgentPatterns: Schema.Array(Schema.String),
    userAgents: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<GetBotResponse>;

export const getBot: (
  input: GetBotRequest,
) => Effect.Effect<
  GetBotResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBotRequest,
  output: GetBotResponse,
  errors: [],
}));

export interface ListBotsRequest {}

export const ListBotsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bots" }),
) as unknown as Schema.Schema<ListBotsRequest>;

export interface ListBotsResponse {
  bots: {
    category: string;
    description: string;
    kind: string;
    name: string;
    operator: string;
    slug: string;
    userAgentPatterns: string[];
  }[];
}

export const ListBotsResponse = Schema.Struct({
  bots: Schema.Array(
    Schema.Struct({
      category: Schema.String,
      description: Schema.String,
      kind: Schema.String,
      name: Schema.String,
      operator: Schema.String,
      slug: Schema.String,
      userAgentPatterns: Schema.Array(Schema.String),
    }),
  ),
}) as unknown as Schema.Schema<ListBotsResponse>;

export const listBots: (
  input: ListBotsRequest,
) => Effect.Effect<
  ListBotsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListBotsRequest,
  output: ListBotsResponse,
  errors: [],
}));

export interface SummaryBotRequest {
  dimension: "BOT" | "BOT_KIND" | "BOT_OPERATOR" | "BOT_CATEGORY";
}

export const SummaryBotRequest = Schema.Struct({
  dimension: Schema.Literal(
    "BOT",
    "BOT_KIND",
    "BOT_OPERATOR",
    "BOT_CATEGORY",
  ).pipe(T.HttpPath("dimension")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/bots/summary/{dimension}" }),
) as unknown as Schema.Schema<SummaryBotRequest>;

export interface SummaryBotResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const SummaryBotResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<SummaryBotResponse>;

export const summaryBot: (
  input: SummaryBotRequest,
) => Effect.Effect<
  SummaryBotResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SummaryBotRequest,
  output: SummaryBotResponse,
  errors: [],
}));

export interface TimeseriesBotRequest {}

export const TimeseriesBotRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/bots/timeseries" }),
) as unknown as Schema.Schema<TimeseriesBotRequest>;

export interface TimeseriesBotResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
}

export const TimeseriesBotResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
}) as unknown as Schema.Schema<TimeseriesBotResponse>;

export const timeseriesBot: (
  input: TimeseriesBotRequest,
) => Effect.Effect<
  TimeseriesBotResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesBotRequest,
  output: TimeseriesBotResponse,
  errors: [],
}));

// =============================================================================
// BotWebCrawler
// =============================================================================

export interface SummaryBotWebCrawlerRequest {
  dimension:
    | "USER_AGENT"
    | "REFERER"
    | "CRAWL_REFER_RATIO"
    | "VERTICAL"
    | "INDUSTRY";
}

export const SummaryBotWebCrawlerRequest = Schema.Struct({
  dimension: Schema.Literal(
    "USER_AGENT",
    "REFERER",
    "CRAWL_REFER_RATIO",
    "VERTICAL",
    "INDUSTRY",
  ).pipe(T.HttpPath("dimension")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/bots/crawlers/summary/{dimension}" }),
) as unknown as Schema.Schema<SummaryBotWebCrawlerRequest>;

export interface SummaryBotWebCrawlerResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const SummaryBotWebCrawlerResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<SummaryBotWebCrawlerResponse>;

export const summaryBotWebCrawler: (
  input: SummaryBotWebCrawlerRequest,
) => Effect.Effect<
  SummaryBotWebCrawlerResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SummaryBotWebCrawlerRequest,
  output: SummaryBotWebCrawlerResponse,
  errors: [],
}));

// =============================================================================
// CategoriesRobotsTxtTop
// =============================================================================

export interface DomainCategoriesRobotsTxtTopRequest {}

export const DomainCategoriesRobotsTxtTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/robots_txt/top/domain_categories" }),
) as unknown as Schema.Schema<DomainCategoriesRobotsTxtTopRequest>;

export interface DomainCategoriesRobotsTxtTopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: number }[];
}

export const DomainCategoriesRobotsTxtTopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.Number,
    }),
  ),
}) as unknown as Schema.Schema<DomainCategoriesRobotsTxtTopResponse>;

export const domainCategoriesRobotsTxtTop: (
  input: DomainCategoriesRobotsTxtTopRequest,
) => Effect.Effect<
  DomainCategoriesRobotsTxtTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DomainCategoriesRobotsTxtTopRequest,
  output: DomainCategoriesRobotsTxtTopResponse,
  errors: [],
}));

// =============================================================================
// CategoryEmailSecuritySummary
// =============================================================================

export interface ThreatCategoryEmailSecuritySummaryRequest {}

export const ThreatCategoryEmailSecuritySummaryRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/summary/threat_category",
  }),
) as unknown as Schema.Schema<ThreatCategoryEmailSecuritySummaryRequest>;

export interface ThreatCategoryEmailSecuritySummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: {
    brandImpersonation: string;
    credentialHarvester: string;
    identityDeception: string;
    link: string;
  };
}

export const ThreatCategoryEmailSecuritySummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    brandImpersonation: Schema.String.pipe(T.JsonName("BrandImpersonation")),
    credentialHarvester: Schema.String.pipe(T.JsonName("CredentialHarvester")),
    identityDeception: Schema.String.pipe(T.JsonName("IdentityDeception")),
    link: Schema.String.pipe(T.JsonName("Link")),
  }),
}) as unknown as Schema.Schema<ThreatCategoryEmailSecuritySummaryResponse>;

export const threatCategoryEmailSecuritySummary: (
  input: ThreatCategoryEmailSecuritySummaryRequest,
) => Effect.Effect<
  ThreatCategoryEmailSecuritySummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ThreatCategoryEmailSecuritySummaryRequest,
  output: ThreatCategoryEmailSecuritySummaryResponse,
  errors: [],
}));

// =============================================================================
// CategoryEmailSecurityTimeseriesGroup
// =============================================================================

export interface ThreatCategoryEmailSecurityTimeseriesGroupRequest {}

export const ThreatCategoryEmailSecurityTimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/timeseries_groups/threat_category",
  }),
) as unknown as Schema.Schema<ThreatCategoryEmailSecurityTimeseriesGroupRequest>;

export interface ThreatCategoryEmailSecurityTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    brandImpersonation: string[];
    credentialHarvester: string[];
    identityDeception: string[];
    link: string[];
  };
}

export const ThreatCategoryEmailSecurityTimeseriesGroupResponse = Schema.Struct(
  {
    meta: Schema.Struct({
      aggInterval: Schema.Literal(
        "FIFTEEN_MINUTES",
        "ONE_HOUR",
        "ONE_DAY",
        "ONE_WEEK",
        "ONE_MONTH",
      ),
      confidenceInfo: Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      dateRange: Schema.Array(
        Schema.Struct({
          endTime: Schema.String,
          startTime: Schema.String,
        }),
      ),
      lastUpdated: Schema.String,
      normalization: Schema.Literal(
        "PERCENTAGE",
        "MIN0_MAX",
        "MIN_MAX",
        "RAW_VALUES",
        "PERCENTAGE_CHANGE",
        "ROLLING_AVERAGE",
        "OVERLAPPED_PERCENTAGE",
        "RATIO",
      ),
      units: Schema.Array(
        Schema.Struct({
          name: Schema.String,
          value: Schema.String,
        }),
      ),
    }),
    serie_0: Schema.Struct({
      brandImpersonation: Schema.Array(Schema.String).pipe(
        T.JsonName("BrandImpersonation"),
      ),
      credentialHarvester: Schema.Array(Schema.String).pipe(
        T.JsonName("CredentialHarvester"),
      ),
      identityDeception: Schema.Array(Schema.String).pipe(
        T.JsonName("IdentityDeception"),
      ),
      link: Schema.Array(Schema.String).pipe(T.JsonName("Link")),
    }),
  },
) as unknown as Schema.Schema<ThreatCategoryEmailSecurityTimeseriesGroupResponse>;

export const threatCategoryEmailSecurityTimeseriesGroup: (
  input: ThreatCategoryEmailSecurityTimeseriesGroupRequest,
) => Effect.Effect<
  ThreatCategoryEmailSecurityTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ThreatCategoryEmailSecurityTimeseriesGroupRequest,
  output: ThreatCategoryEmailSecurityTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// ClassHttpSummary
// =============================================================================

export interface BotClassHttpSummaryRequest {}

export const BotClassHttpSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/summary/bot_class" }),
) as unknown as Schema.Schema<BotClassHttpSummaryRequest>;

export interface BotClassHttpSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { bot: string; human: string };
}

export const BotClassHttpSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    bot: Schema.String,
    human: Schema.String,
  }),
}) as unknown as Schema.Schema<BotClassHttpSummaryResponse>;

export const botClassHttpSummary: (
  input: BotClassHttpSummaryRequest,
) => Effect.Effect<
  BotClassHttpSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BotClassHttpSummaryRequest,
  output: BotClassHttpSummaryResponse,
  errors: [],
}));

// =============================================================================
// ClassHttpTimeseriesGroup
// =============================================================================

export interface BotClassHttpTimeseriesGroupRequest {}

export const BotClassHttpTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/timeseries_groups/bot_class" }),
) as unknown as Schema.Schema<BotClassHttpTimeseriesGroupRequest>;

export interface BotClassHttpTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { bot: string[]; human: string[]; timestamps: string[] };
}

export const BotClassHttpTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    bot: Schema.Array(Schema.String),
    human: Schema.Array(Schema.String),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<BotClassHttpTimeseriesGroupResponse>;

export const botClassHttpTimeseriesGroup: (
  input: BotClassHttpTimeseriesGroupRequest,
) => Effect.Effect<
  BotClassHttpTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BotClassHttpTimeseriesGroupRequest,
  output: BotClassHttpTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// ClassLeakedCredentialSummary
// =============================================================================

export interface BotClassLeakedCredentialSummaryRequest {}

export const BotClassLeakedCredentialSummaryRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/leaked_credential_checks/summary/bot_class",
  }),
) as unknown as Schema.Schema<BotClassLeakedCredentialSummaryRequest>;

export interface BotClassLeakedCredentialSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { bot: string; human: string };
}

export const BotClassLeakedCredentialSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    bot: Schema.String,
    human: Schema.String,
  }),
}) as unknown as Schema.Schema<BotClassLeakedCredentialSummaryResponse>;

export const botClassLeakedCredentialSummary: (
  input: BotClassLeakedCredentialSummaryRequest,
) => Effect.Effect<
  BotClassLeakedCredentialSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BotClassLeakedCredentialSummaryRequest,
  output: BotClassLeakedCredentialSummaryResponse,
  errors: [],
}));

// =============================================================================
// ClassLeakedCredentialTimeseriesGroup
// =============================================================================

export interface BotClassLeakedCredentialTimeseriesGroupRequest {}

export const BotClassLeakedCredentialTimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/leaked_credential_checks/timeseries_groups/bot_class",
  }),
) as unknown as Schema.Schema<BotClassLeakedCredentialTimeseriesGroupRequest>;

export interface BotClassLeakedCredentialTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { bot: string[]; human: string[]; timestamps: string[] };
}

export const BotClassLeakedCredentialTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    bot: Schema.Array(Schema.String),
    human: Schema.Array(Schema.String),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<BotClassLeakedCredentialTimeseriesGroupResponse>;

export const botClassLeakedCredentialTimeseriesGroup: (
  input: BotClassLeakedCredentialTimeseriesGroupRequest,
) => Effect.Effect<
  BotClassLeakedCredentialTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BotClassLeakedCredentialTimeseriesGroupRequest,
  output: BotClassLeakedCredentialTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// CodeDnsSummary
// =============================================================================

export interface ResponseCodeDnsSummaryRequest {}

export const ResponseCodeDnsSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/summary/response_code" }),
) as unknown as Schema.Schema<ResponseCodeDnsSummaryRequest>;

export interface ResponseCodeDnsSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const ResponseCodeDnsSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<ResponseCodeDnsSummaryResponse>;

export const responseCodeDnsSummary: (
  input: ResponseCodeDnsSummaryRequest,
) => Effect.Effect<
  ResponseCodeDnsSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ResponseCodeDnsSummaryRequest,
  output: ResponseCodeDnsSummaryResponse,
  errors: [],
}));

// =============================================================================
// CodeDnsTimeseriesGroup
// =============================================================================

export interface ResponseCodeDnsTimeseriesGroupRequest {}

export const ResponseCodeDnsTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/timeseries_groups/response_code" }),
) as unknown as Schema.Schema<ResponseCodeDnsTimeseriesGroupRequest>;

export interface ResponseCodeDnsTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const ResponseCodeDnsTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<ResponseCodeDnsTimeseriesGroupResponse>;

export const responseCodeDnsTimeseriesGroup: (
  input: ResponseCodeDnsTimeseriesGroupRequest,
) => Effect.Effect<
  ResponseCodeDnsTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ResponseCodeDnsTimeseriesGroupRequest,
  output: ResponseCodeDnsTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// CodesAs112Summary
// =============================================================================

export interface ResponseCodesAs112SummaryRequest {}

export const ResponseCodesAs112SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/summary/response_codes" }),
) as unknown as Schema.Schema<ResponseCodesAs112SummaryRequest>;

export interface ResponseCodesAs112SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const ResponseCodesAs112SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<ResponseCodesAs112SummaryResponse>;

export const responseCodesAs112Summary: (
  input: ResponseCodesAs112SummaryRequest,
) => Effect.Effect<
  ResponseCodesAs112SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ResponseCodesAs112SummaryRequest,
  output: ResponseCodesAs112SummaryResponse,
  errors: [],
}));

// =============================================================================
// CodesAs112TimeseriesGroup
// =============================================================================

export interface ResponseCodesAs112TimeseriesGroupRequest {}

export const ResponseCodesAs112TimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/as112/timeseries_groups/response_codes",
  }),
) as unknown as Schema.Schema<ResponseCodesAs112TimeseriesGroupRequest>;

export interface ResponseCodesAs112TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const ResponseCodesAs112TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<ResponseCodesAs112TimeseriesGroupResponse>;

export const responseCodesAs112TimeseriesGroup: (
  input: ResponseCodesAs112TimeseriesGroupRequest,
) => Effect.Effect<
  ResponseCodesAs112TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ResponseCodesAs112TimeseriesGroupRequest,
  output: ResponseCodesAs112TimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// Ct
// =============================================================================

export interface SummaryCtRequest {
  dimension:
    | "CA"
    | "CA_OWNER"
    | "DURATION"
    | "ENTRY_TYPE"
    | "EXPIRATION_STATUS"
    | "HAS_IPS"
    | "HAS_WILDCARDS"
    | "LOG"
    | "LOG_API"
    | "LOG_OPERATOR"
    | "PUBLIC_KEY_ALGORITHM"
    | "SIGNATURE_ALGORITHM"
    | "TLD"
    | "VALIDATION_LEVEL";
}

export const SummaryCtRequest = Schema.Struct({
  dimension: Schema.Literal(
    "CA",
    "CA_OWNER",
    "DURATION",
    "ENTRY_TYPE",
    "EXPIRATION_STATUS",
    "HAS_IPS",
    "HAS_WILDCARDS",
    "LOG",
    "LOG_API",
    "LOG_OPERATOR",
    "PUBLIC_KEY_ALGORITHM",
    "SIGNATURE_ALGORITHM",
    "TLD",
    "VALIDATION_LEVEL",
  ).pipe(T.HttpPath("dimension")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/ct/summary/{dimension}" }),
) as unknown as Schema.Schema<SummaryCtRequest>;

export interface SummaryCtResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0:
    | Record<string, unknown>
    | { rfc6962: string; static: string }
    | {
        gt_121d: string;
        gt_16dLte_31d: string;
        gt_31dLte_91d: string;
        gt_3dLte_16d: string;
        gt_91dLte_121d: string;
        lte_3d: string;
      }
    | { cERTIFICATE: string; pRECERTIFICATE: string }
    | { eXPIRED: string; vALID: string }
    | { nEGATIVE: string; pOSITIVE: string }
    | { dSA: string; eCDSA: string; rSA: string }
    | {
        domain: string;
        extended: string;
        organization: string;
        unknown: string;
      };
}

export const SummaryCtResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Union(
    Schema.Struct({}),
    Schema.Struct({
      rfc6962: Schema.String,
      static: Schema.String,
    }),
    Schema.Struct({
      gt_121d: Schema.String,
      gt_16dLte_31d: Schema.String.pipe(T.JsonName("gt_16d_lte_31d")),
      gt_31dLte_91d: Schema.String.pipe(T.JsonName("gt_31d_lte_91d")),
      gt_3dLte_16d: Schema.String.pipe(T.JsonName("gt_3d_lte_16d")),
      gt_91dLte_121d: Schema.String.pipe(T.JsonName("gt_91d_lte_121d")),
      lte_3d: Schema.String,
    }),
    Schema.Struct({
      cERTIFICATE: Schema.String.pipe(T.JsonName("CERTIFICATE")),
      pRECERTIFICATE: Schema.String.pipe(T.JsonName("PRECERTIFICATE")),
    }),
    Schema.Struct({
      eXPIRED: Schema.String.pipe(T.JsonName("EXPIRED")),
      vALID: Schema.String.pipe(T.JsonName("VALID")),
    }),
    Schema.Struct({
      nEGATIVE: Schema.String.pipe(T.JsonName("NEGATIVE")),
      pOSITIVE: Schema.String.pipe(T.JsonName("POSITIVE")),
    }),
    Schema.Struct({
      dSA: Schema.String.pipe(T.JsonName("DSA")),
      eCDSA: Schema.String.pipe(T.JsonName("ECDSA")),
      rSA: Schema.String.pipe(T.JsonName("RSA")),
    }),
    Schema.Struct({
      domain: Schema.String,
      extended: Schema.String,
      organization: Schema.String,
      unknown: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<SummaryCtResponse>;

export const summaryCt: (
  input: SummaryCtRequest,
) => Effect.Effect<
  SummaryCtResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SummaryCtRequest,
  output: SummaryCtResponse,
  errors: [],
}));

export interface TimeseriesCtRequest {}

export const TimeseriesCtRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/ct/timeseries" }),
) as unknown as Schema.Schema<TimeseriesCtRequest>;

export interface TimeseriesCtResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
}

export const TimeseriesCtResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
}) as unknown as Schema.Schema<TimeseriesCtResponse>;

export const timeseriesCt: (
  input: TimeseriesCtRequest,
) => Effect.Effect<
  TimeseriesCtResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesCtRequest,
  output: TimeseriesCtResponse,
  errors: [],
}));

// =============================================================================
// CtAuthority
// =============================================================================

export interface GetCtAuthorityRequest {
  caSlug: string;
}

export const GetCtAuthorityRequest = Schema.Struct({
  caSlug: Schema.String.pipe(T.HttpPath("caSlug")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/ct/authorities/{caSlug}" }),
) as unknown as Schema.Schema<GetCtAuthorityRequest>;

export interface GetCtAuthorityResponse {
  certificateAuthority: {
    appleStatus:
      | "INCLUDED"
      | "NOT_YET_INCLUDED"
      | "NOT_INCLUDED"
      | "NOT_BEFORE"
      | "REMOVED"
      | "DISABLED"
      | "BLOCKED";
    authorityKeyIdentifier: string;
    certificateRecordType: "ROOT_CERTIFICATE" | "INTERMEDIATE_CERTIFICATE";
    chromeStatus:
      | "INCLUDED"
      | "NOT_YET_INCLUDED"
      | "NOT_INCLUDED"
      | "NOT_BEFORE"
      | "REMOVED"
      | "DISABLED"
      | "BLOCKED";
    country: string;
    countryName: string;
    microsoftStatus:
      | "INCLUDED"
      | "NOT_YET_INCLUDED"
      | "NOT_INCLUDED"
      | "NOT_BEFORE"
      | "REMOVED"
      | "DISABLED"
      | "BLOCKED";
    mozillaStatus:
      | "INCLUDED"
      | "NOT_YET_INCLUDED"
      | "NOT_INCLUDED"
      | "NOT_BEFORE"
      | "REMOVED"
      | "DISABLED"
      | "BLOCKED";
    name: string;
    owner: string;
    parentName: string;
    parentSha256Fingerprint: string;
    related: {
      certificateRecordType: "ROOT_CERTIFICATE" | "INTERMEDIATE_CERTIFICATE";
      name: string;
      revocationStatus: "NOT_REVOKED" | "REVOKED" | "PARENT_CERT_REVOKED";
      sha256Fingerprint: string;
    }[];
    revocationStatus: "NOT_REVOKED" | "REVOKED" | "PARENT_CERT_REVOKED";
    sha256Fingerprint: string;
    subjectKeyIdentifier: string;
    validFrom: string;
    validTo: string;
  };
}

export const GetCtAuthorityResponse = Schema.Struct({
  certificateAuthority: Schema.Struct({
    appleStatus: Schema.Literal(
      "INCLUDED",
      "NOT_YET_INCLUDED",
      "NOT_INCLUDED",
      "NOT_BEFORE",
      "REMOVED",
      "DISABLED",
      "BLOCKED",
    ),
    authorityKeyIdentifier: Schema.String,
    certificateRecordType: Schema.Literal(
      "ROOT_CERTIFICATE",
      "INTERMEDIATE_CERTIFICATE",
    ),
    chromeStatus: Schema.Literal(
      "INCLUDED",
      "NOT_YET_INCLUDED",
      "NOT_INCLUDED",
      "NOT_BEFORE",
      "REMOVED",
      "DISABLED",
      "BLOCKED",
    ),
    country: Schema.String,
    countryName: Schema.String,
    microsoftStatus: Schema.Literal(
      "INCLUDED",
      "NOT_YET_INCLUDED",
      "NOT_INCLUDED",
      "NOT_BEFORE",
      "REMOVED",
      "DISABLED",
      "BLOCKED",
    ),
    mozillaStatus: Schema.Literal(
      "INCLUDED",
      "NOT_YET_INCLUDED",
      "NOT_INCLUDED",
      "NOT_BEFORE",
      "REMOVED",
      "DISABLED",
      "BLOCKED",
    ),
    name: Schema.String,
    owner: Schema.String,
    parentName: Schema.String,
    parentSha256Fingerprint: Schema.String,
    related: Schema.Array(
      Schema.Struct({
        certificateRecordType: Schema.Literal(
          "ROOT_CERTIFICATE",
          "INTERMEDIATE_CERTIFICATE",
        ),
        name: Schema.String,
        revocationStatus: Schema.Literal(
          "NOT_REVOKED",
          "REVOKED",
          "PARENT_CERT_REVOKED",
        ),
        sha256Fingerprint: Schema.String,
      }),
    ),
    revocationStatus: Schema.Literal(
      "NOT_REVOKED",
      "REVOKED",
      "PARENT_CERT_REVOKED",
    ),
    sha256Fingerprint: Schema.String,
    subjectKeyIdentifier: Schema.String,
    validFrom: Schema.String,
    validTo: Schema.String,
  }),
}) as unknown as Schema.Schema<GetCtAuthorityResponse>;

export const getCtAuthority: (
  input: GetCtAuthorityRequest,
) => Effect.Effect<
  GetCtAuthorityResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetCtAuthorityRequest,
  output: GetCtAuthorityResponse,
  errors: [],
}));

export interface ListCtAuthoritiesRequest {}

export const ListCtAuthoritiesRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/ct/authorities" }),
) as unknown as Schema.Schema<ListCtAuthoritiesRequest>;

export interface ListCtAuthoritiesResponse {
  certificateAuthorities: {
    certificateRecordType: "ROOT_CERTIFICATE" | "INTERMEDIATE_CERTIFICATE";
    country: string;
    countryName: string;
    name: string;
    owner: string;
    parentName: string;
    parentSha256Fingerprint: string;
    revocationStatus: "NOT_REVOKED" | "REVOKED" | "PARENT_CERT_REVOKED";
    sha256Fingerprint: string;
  }[];
}

export const ListCtAuthoritiesResponse = Schema.Struct({
  certificateAuthorities: Schema.Array(
    Schema.Struct({
      certificateRecordType: Schema.Literal(
        "ROOT_CERTIFICATE",
        "INTERMEDIATE_CERTIFICATE",
      ),
      country: Schema.String,
      countryName: Schema.String,
      name: Schema.String,
      owner: Schema.String,
      parentName: Schema.String,
      parentSha256Fingerprint: Schema.String,
      revocationStatus: Schema.Literal(
        "NOT_REVOKED",
        "REVOKED",
        "PARENT_CERT_REVOKED",
      ),
      sha256Fingerprint: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<ListCtAuthoritiesResponse>;

export const listCtAuthorities: (
  input: ListCtAuthoritiesRequest,
) => Effect.Effect<
  ListCtAuthoritiesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListCtAuthoritiesRequest,
  output: ListCtAuthoritiesResponse,
  errors: [],
}));

// =============================================================================
// CtLog
// =============================================================================

export interface GetCtLogRequest {
  logSlug: string;
}

export const GetCtLogRequest = Schema.Struct({
  logSlug: Schema.String.pipe(T.HttpPath("logSlug")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/ct/logs/{logSlug}" }),
) as unknown as Schema.Schema<GetCtLogRequest>;

export interface GetCtLogResponse {
  certificateLog: {
    api: "RFC6962" | "STATIC";
    description: string;
    endExclusive: string;
    operator: string;
    performance: {
      endpoints: {
        endpoint:
          | "add-chain (new)"
          | "add-chain (old)"
          | "add-pre-chain (new)"
          | "add-pre-chain (old)"
          | "get-entries"
          | "get-roots"
          | "get-sth";
        responseTime: number;
        uptime: number;
      }[];
      responseTime: number;
      uptime: number;
    } | null;
    related: {
      description: string;
      endExclusive: string;
      slug: string;
      startInclusive: string;
      state:
        | "USABLE"
        | "PENDING"
        | "QUALIFIED"
        | "READ_ONLY"
        | "RETIRED"
        | "REJECTED";
    }[];
    slug: string;
    startInclusive: string;
    state:
      | "USABLE"
      | "PENDING"
      | "QUALIFIED"
      | "READ_ONLY"
      | "RETIRED"
      | "REJECTED";
    stateTimestamp: string;
    url: string;
  };
}

export const GetCtLogResponse = Schema.Struct({
  certificateLog: Schema.Struct({
    api: Schema.Literal("RFC6962", "STATIC"),
    description: Schema.String,
    endExclusive: Schema.String,
    operator: Schema.String,
    performance: Schema.Union(
      Schema.Struct({
        endpoints: Schema.Array(
          Schema.Struct({
            endpoint: Schema.Literal(
              "add-chain (new)",
              "add-chain (old)",
              "add-pre-chain (new)",
              "add-pre-chain (old)",
              "get-entries",
              "get-roots",
              "get-sth",
            ),
            responseTime: Schema.Number,
            uptime: Schema.Number,
          }),
        ),
        responseTime: Schema.Number,
        uptime: Schema.Number,
      }),
      Schema.Null,
    ),
    related: Schema.Array(
      Schema.Struct({
        description: Schema.String,
        endExclusive: Schema.String,
        slug: Schema.String,
        startInclusive: Schema.String,
        state: Schema.Literal(
          "USABLE",
          "PENDING",
          "QUALIFIED",
          "READ_ONLY",
          "RETIRED",
          "REJECTED",
        ),
      }),
    ),
    slug: Schema.String,
    startInclusive: Schema.String,
    state: Schema.Literal(
      "USABLE",
      "PENDING",
      "QUALIFIED",
      "READ_ONLY",
      "RETIRED",
      "REJECTED",
    ),
    stateTimestamp: Schema.String,
    url: Schema.String,
  }),
}) as unknown as Schema.Schema<GetCtLogResponse>;

export const getCtLog: (
  input: GetCtLogRequest,
) => Effect.Effect<
  GetCtLogResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetCtLogRequest,
  output: GetCtLogResponse,
  errors: [],
}));

export interface ListCtLogsRequest {}

export const ListCtLogsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/ct/logs" }),
) as unknown as Schema.Schema<ListCtLogsRequest>;

export interface ListCtLogsResponse {
  certificateLogs: {
    api: "RFC6962" | "STATIC";
    description: string;
    endExclusive: string;
    operator: string;
    slug: string;
    startInclusive: string;
    state:
      | "USABLE"
      | "PENDING"
      | "QUALIFIED"
      | "READ_ONLY"
      | "RETIRED"
      | "REJECTED";
    stateTimestamp: string;
    url: string;
  }[];
}

export const ListCtLogsResponse = Schema.Struct({
  certificateLogs: Schema.Array(
    Schema.Struct({
      api: Schema.Literal("RFC6962", "STATIC"),
      description: Schema.String,
      endExclusive: Schema.String,
      operator: Schema.String,
      slug: Schema.String,
      startInclusive: Schema.String,
      state: Schema.Literal(
        "USABLE",
        "PENDING",
        "QUALIFIED",
        "READ_ONLY",
        "RETIRED",
        "REJECTED",
      ),
      stateTimestamp: Schema.String,
      url: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<ListCtLogsResponse>;

export const listCtLogs: (
  input: ListCtLogsRequest,
) => Effect.Effect<
  ListCtLogsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListCtLogsRequest,
  output: ListCtLogsResponse,
  errors: [],
}));

// =============================================================================
// Dataset
// =============================================================================

export interface GetDatasetRequest {
  alias: string;
}

export const GetDatasetRequest = Schema.Struct({
  alias: Schema.String.pipe(T.HttpPath("alias")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/datasets/{alias}" }),
) as unknown as Schema.Schema<GetDatasetRequest>;

export type GetDatasetResponse = unknown;

export const GetDatasetResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDatasetResponse>;

export const getDataset: (
  input: GetDatasetRequest,
) => Effect.Effect<
  GetDatasetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDatasetRequest,
  output: GetDatasetResponse,
  errors: [],
}));

export interface ListDatasetsRequest {}

export const ListDatasetsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/datasets" }),
) as unknown as Schema.Schema<ListDatasetsRequest>;

export interface ListDatasetsResponse {
  datasets: {
    id: number;
    description: string;
    meta: unknown;
    tags: string[];
    title: string;
    type: string;
  }[];
}

export const ListDatasetsResponse = Schema.Struct({
  datasets: Schema.Array(
    Schema.Struct({
      id: Schema.Number,
      description: Schema.String,
      meta: Schema.Unknown,
      tags: Schema.Array(Schema.String),
      title: Schema.String,
      type: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<ListDatasetsResponse>;

export const listDatasets: (
  input: ListDatasetsRequest,
) => Effect.Effect<
  ListDatasetsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [],
}));

export interface DownloadDatasetRequest {
  /** Query param: Format in which results will be returned. */
  format?: "JSON" | "CSV";
  /** Body param: */
  datasetId: number;
}

export const DownloadDatasetRequest = Schema.Struct({
  format: Schema.optional(Schema.Literal("JSON", "CSV")).pipe(
    T.HttpQuery("format"),
  ),
  datasetId: Schema.Number,
}).pipe(
  T.Http({ method: "POST", path: "/radar/datasets/download" }),
) as unknown as Schema.Schema<DownloadDatasetRequest>;

export interface DownloadDatasetResponse {
  dataset: { url: string };
}

export const DownloadDatasetResponse = Schema.Struct({
  dataset: Schema.Struct({
    url: Schema.String,
  }),
}) as unknown as Schema.Schema<DownloadDatasetResponse>;

export const downloadDataset: (
  input: DownloadDatasetRequest,
) => Effect.Effect<
  DownloadDatasetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DownloadDatasetRequest,
  output: DownloadDatasetResponse,
  errors: [],
}));

// =============================================================================
// Dns
// =============================================================================

export interface TimeseriesDnsRequest {}

export const TimeseriesDnsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/timeseries" }),
) as unknown as Schema.Schema<TimeseriesDnsRequest>;

export interface TimeseriesDnsResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
}

export const TimeseriesDnsResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
}) as unknown as Schema.Schema<TimeseriesDnsResponse>;

export const timeseriesDns: (
  input: TimeseriesDnsRequest,
) => Effect.Effect<
  TimeseriesDnsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesDnsRequest,
  output: TimeseriesDnsResponse,
  errors: [],
}));

// =============================================================================
// DnsSummary
// =============================================================================

export interface DnssecDnsSummaryRequest {}

export const DnssecDnsSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/summary/dnssec" }),
) as unknown as Schema.Schema<DnssecDnsSummaryRequest>;

export interface DnssecDnsSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: {
    iNSECURE: string;
    iNVALID: string;
    oTHER: string;
    sECURE: string;
  };
}

export const DnssecDnsSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    iNSECURE: Schema.String.pipe(T.JsonName("INSECURE")),
    iNVALID: Schema.String.pipe(T.JsonName("INVALID")),
    oTHER: Schema.String.pipe(T.JsonName("OTHER")),
    sECURE: Schema.String.pipe(T.JsonName("SECURE")),
  }),
}) as unknown as Schema.Schema<DnssecDnsSummaryResponse>;

export const dnssecDnsSummary: (
  input: DnssecDnsSummaryRequest,
) => Effect.Effect<
  DnssecDnsSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DnssecDnsSummaryRequest,
  output: DnssecDnsSummaryResponse,
  errors: [],
}));

export interface ProtocolDnsSummaryRequest {}

export const ProtocolDnsSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/summary/protocol" }),
) as unknown as Schema.Schema<ProtocolDnsSummaryRequest>;

export interface ProtocolDnsSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { hTTPS: string; tCP: string; tLS: string; uDP: string };
}

export const ProtocolDnsSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    hTTPS: Schema.String.pipe(T.JsonName("HTTPS")),
    tCP: Schema.String.pipe(T.JsonName("TCP")),
    tLS: Schema.String.pipe(T.JsonName("TLS")),
    uDP: Schema.String.pipe(T.JsonName("UDP")),
  }),
}) as unknown as Schema.Schema<ProtocolDnsSummaryResponse>;

export const protocolDnsSummary: (
  input: ProtocolDnsSummaryRequest,
) => Effect.Effect<
  ProtocolDnsSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ProtocolDnsSummaryRequest,
  output: ProtocolDnsSummaryResponse,
  errors: [],
}));

// =============================================================================
// DnsTimeseriesGroup
// =============================================================================

export interface DnssecDnsTimeseriesGroupRequest {}

export const DnssecDnsTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/timeseries_groups/dnssec" }),
) as unknown as Schema.Schema<DnssecDnsTimeseriesGroupRequest>;

export interface DnssecDnsTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    iNSECURE: string[];
    iNVALID: string[];
    oTHER: string[];
    sECURE: string[];
  };
}

export const DnssecDnsTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    iNSECURE: Schema.Array(Schema.String).pipe(T.JsonName("INSECURE")),
    iNVALID: Schema.Array(Schema.String).pipe(T.JsonName("INVALID")),
    oTHER: Schema.Array(Schema.String).pipe(T.JsonName("OTHER")),
    sECURE: Schema.Array(Schema.String).pipe(T.JsonName("SECURE")),
  }),
}) as unknown as Schema.Schema<DnssecDnsTimeseriesGroupResponse>;

export const dnssecDnsTimeseriesGroup: (
  input: DnssecDnsTimeseriesGroupRequest,
) => Effect.Effect<
  DnssecDnsTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DnssecDnsTimeseriesGroupRequest,
  output: DnssecDnsTimeseriesGroupResponse,
  errors: [],
}));

export interface ProtocolDnsTimeseriesGroupRequest {}

export const ProtocolDnsTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/timeseries_groups/protocol" }),
) as unknown as Schema.Schema<ProtocolDnsTimeseriesGroupRequest>;

export interface ProtocolDnsTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { hTTPS: string[]; tCP: string[]; tLS: string[]; uDP: string[] };
}

export const ProtocolDnsTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    hTTPS: Schema.Array(Schema.String).pipe(T.JsonName("HTTPS")),
    tCP: Schema.Array(Schema.String).pipe(T.JsonName("TCP")),
    tLS: Schema.Array(Schema.String).pipe(T.JsonName("TLS")),
    uDP: Schema.Array(Schema.String).pipe(T.JsonName("UDP")),
  }),
}) as unknown as Schema.Schema<ProtocolDnsTimeseriesGroupResponse>;

export const protocolDnsTimeseriesGroup: (
  input: ProtocolDnsTimeseriesGroupRequest,
) => Effect.Effect<
  ProtocolDnsTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ProtocolDnsTimeseriesGroupRequest,
  output: ProtocolDnsTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// DnsTop
// =============================================================================

export interface AsesDnsTopRequest {}

export const AsesDnsTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/top/ases" }),
) as unknown as Schema.Schema<AsesDnsTopRequest>;

export interface AsesDnsTopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { clientASN: number; clientASName: string; value: string }[];
}

export const AsesDnsTopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientASN: Schema.Number,
      clientASName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<AsesDnsTopResponse>;

export const asesDnsTop: (
  input: AsesDnsTopRequest,
) => Effect.Effect<
  AsesDnsTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: AsesDnsTopRequest,
  output: AsesDnsTopResponse,
  errors: [],
}));

export interface LocationsDnsTopRequest {}

export const LocationsDnsTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/top/locations" }),
) as unknown as Schema.Schema<LocationsDnsTopRequest>;

export interface LocationsDnsTopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const LocationsDnsTopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<LocationsDnsTopResponse>;

export const locationsDnsTop: (
  input: LocationsDnsTopRequest,
) => Effect.Effect<
  LocationsDnsTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: LocationsDnsTopRequest,
  output: LocationsDnsTopResponse,
  errors: [],
}));

// =============================================================================
// E2EDnsSummary
// =============================================================================

export interface DnssecE2EDnsSummaryRequest {}

export const DnssecE2EDnsSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/summary/dnssec_e2e" }),
) as unknown as Schema.Schema<DnssecE2EDnsSummaryRequest>;

export interface DnssecE2EDnsSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { nEGATIVE: string; pOSITIVE: string };
}

export const DnssecE2EDnsSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    nEGATIVE: Schema.String.pipe(T.JsonName("NEGATIVE")),
    pOSITIVE: Schema.String.pipe(T.JsonName("POSITIVE")),
  }),
}) as unknown as Schema.Schema<DnssecE2EDnsSummaryResponse>;

export const dnssecE2EDnsSummary: (
  input: DnssecE2EDnsSummaryRequest,
) => Effect.Effect<
  DnssecE2EDnsSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DnssecE2EDnsSummaryRequest,
  output: DnssecE2EDnsSummaryResponse,
  errors: [],
}));

// =============================================================================
// E2EDnsTimeseriesGroup
// =============================================================================

export interface DnssecE2EDnsTimeseriesGroupRequest {}

export const DnssecE2EDnsTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/timeseries_groups/dnssec_e2e" }),
) as unknown as Schema.Schema<DnssecE2EDnsTimeseriesGroupRequest>;

export interface DnssecE2EDnsTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { nEGATIVE: string[]; pOSITIVE: string[] };
}

export const DnssecE2EDnsTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    nEGATIVE: Schema.Array(Schema.String).pipe(T.JsonName("NEGATIVE")),
    pOSITIVE: Schema.Array(Schema.String).pipe(T.JsonName("POSITIVE")),
  }),
}) as unknown as Schema.Schema<DnssecE2EDnsTimeseriesGroupResponse>;

export const dnssecE2EDnsTimeseriesGroup: (
  input: DnssecE2EDnsTimeseriesGroupRequest,
) => Effect.Effect<
  DnssecE2EDnsTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DnssecE2EDnsTimeseriesGroupRequest,
  output: DnssecE2EDnsTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// EmailRoutingSummary
// =============================================================================

export interface ArcEmailRoutingSummaryRequest {}

export const ArcEmailRoutingSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/routing/summary/arc" }),
) as unknown as Schema.Schema<ArcEmailRoutingSummaryRequest>;

export interface ArcEmailRoutingSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: unknown;
}

export const ArcEmailRoutingSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Unknown,
}) as unknown as Schema.Schema<ArcEmailRoutingSummaryResponse>;

export const arcEmailRoutingSummary: (
  input: ArcEmailRoutingSummaryRequest,
) => Effect.Effect<
  ArcEmailRoutingSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ArcEmailRoutingSummaryRequest,
  output: ArcEmailRoutingSummaryResponse,
  errors: [],
}));

export interface DkimEmailRoutingSummaryRequest {}

export const DkimEmailRoutingSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/routing/summary/dkim" }),
) as unknown as Schema.Schema<DkimEmailRoutingSummaryRequest>;

export interface DkimEmailRoutingSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: unknown;
}

export const DkimEmailRoutingSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Unknown,
}) as unknown as Schema.Schema<DkimEmailRoutingSummaryResponse>;

export const dkimEmailRoutingSummary: (
  input: DkimEmailRoutingSummaryRequest,
) => Effect.Effect<
  DkimEmailRoutingSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DkimEmailRoutingSummaryRequest,
  output: DkimEmailRoutingSummaryResponse,
  errors: [],
}));

export interface DmarcEmailRoutingSummaryRequest {}

export const DmarcEmailRoutingSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/routing/summary/dmarc" }),
) as unknown as Schema.Schema<DmarcEmailRoutingSummaryRequest>;

export interface DmarcEmailRoutingSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: unknown;
}

export const DmarcEmailRoutingSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Unknown,
}) as unknown as Schema.Schema<DmarcEmailRoutingSummaryResponse>;

export const dmarcEmailRoutingSummary: (
  input: DmarcEmailRoutingSummaryRequest,
) => Effect.Effect<
  DmarcEmailRoutingSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DmarcEmailRoutingSummaryRequest,
  output: DmarcEmailRoutingSummaryResponse,
  errors: [],
}));

export interface EncryptedEmailRoutingSummaryRequest {}

export const EncryptedEmailRoutingSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/routing/summary/encrypted" }),
) as unknown as Schema.Schema<EncryptedEmailRoutingSummaryRequest>;

export interface EncryptedEmailRoutingSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { eNCRYPTED: string; nOT_ENCRYPTED: string };
}

export const EncryptedEmailRoutingSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    eNCRYPTED: Schema.String.pipe(T.JsonName("ENCRYPTED")),
    nOT_ENCRYPTED: Schema.String.pipe(T.JsonName("NOT_ENCRYPTED")),
  }),
}) as unknown as Schema.Schema<EncryptedEmailRoutingSummaryResponse>;

export const encryptedEmailRoutingSummary: (
  input: EncryptedEmailRoutingSummaryRequest,
) => Effect.Effect<
  EncryptedEmailRoutingSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: EncryptedEmailRoutingSummaryRequest,
  output: EncryptedEmailRoutingSummaryResponse,
  errors: [],
}));

export interface SpfEmailRoutingSummaryRequest {}

export const SpfEmailRoutingSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/routing/summary/spf" }),
) as unknown as Schema.Schema<SpfEmailRoutingSummaryRequest>;

export interface SpfEmailRoutingSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: unknown;
}

export const SpfEmailRoutingSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Unknown,
}) as unknown as Schema.Schema<SpfEmailRoutingSummaryResponse>;

export const spfEmailRoutingSummary: (
  input: SpfEmailRoutingSummaryRequest,
) => Effect.Effect<
  SpfEmailRoutingSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SpfEmailRoutingSummaryRequest,
  output: SpfEmailRoutingSummaryResponse,
  errors: [],
}));

// =============================================================================
// EmailRoutingTimeseriesGroup
// =============================================================================

export interface ArcEmailRoutingTimeseriesGroupRequest {}

export const ArcEmailRoutingTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/routing/timeseries_groups/arc" }),
) as unknown as Schema.Schema<ArcEmailRoutingTimeseriesGroupRequest>;

export interface ArcEmailRoutingTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: unknown;
}

export const ArcEmailRoutingTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Unknown,
}) as unknown as Schema.Schema<ArcEmailRoutingTimeseriesGroupResponse>;

export const arcEmailRoutingTimeseriesGroup: (
  input: ArcEmailRoutingTimeseriesGroupRequest,
) => Effect.Effect<
  ArcEmailRoutingTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ArcEmailRoutingTimeseriesGroupRequest,
  output: ArcEmailRoutingTimeseriesGroupResponse,
  errors: [],
}));

export interface DkimEmailRoutingTimeseriesGroupRequest {}

export const DkimEmailRoutingTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/routing/timeseries_groups/dkim",
  }),
) as unknown as Schema.Schema<DkimEmailRoutingTimeseriesGroupRequest>;

export interface DkimEmailRoutingTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: unknown;
}

export const DkimEmailRoutingTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Unknown,
}) as unknown as Schema.Schema<DkimEmailRoutingTimeseriesGroupResponse>;

export const dkimEmailRoutingTimeseriesGroup: (
  input: DkimEmailRoutingTimeseriesGroupRequest,
) => Effect.Effect<
  DkimEmailRoutingTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DkimEmailRoutingTimeseriesGroupRequest,
  output: DkimEmailRoutingTimeseriesGroupResponse,
  errors: [],
}));

export interface DmarcEmailRoutingTimeseriesGroupRequest {}

export const DmarcEmailRoutingTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/routing/timeseries_groups/dmarc",
  }),
) as unknown as Schema.Schema<DmarcEmailRoutingTimeseriesGroupRequest>;

export interface DmarcEmailRoutingTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: unknown;
}

export const DmarcEmailRoutingTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Unknown,
}) as unknown as Schema.Schema<DmarcEmailRoutingTimeseriesGroupResponse>;

export const dmarcEmailRoutingTimeseriesGroup: (
  input: DmarcEmailRoutingTimeseriesGroupRequest,
) => Effect.Effect<
  DmarcEmailRoutingTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DmarcEmailRoutingTimeseriesGroupRequest,
  output: DmarcEmailRoutingTimeseriesGroupResponse,
  errors: [],
}));

export interface EncryptedEmailRoutingTimeseriesGroupRequest {}

export const EncryptedEmailRoutingTimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/routing/timeseries_groups/encrypted",
  }),
) as unknown as Schema.Schema<EncryptedEmailRoutingTimeseriesGroupRequest>;

export interface EncryptedEmailRoutingTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { eNCRYPTED: string[]; nOT_ENCRYPTED: string[] };
}

export const EncryptedEmailRoutingTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    eNCRYPTED: Schema.Array(Schema.String).pipe(T.JsonName("ENCRYPTED")),
    nOT_ENCRYPTED: Schema.Array(Schema.String).pipe(
      T.JsonName("NOT_ENCRYPTED"),
    ),
  }),
}) as unknown as Schema.Schema<EncryptedEmailRoutingTimeseriesGroupResponse>;

export const encryptedEmailRoutingTimeseriesGroup: (
  input: EncryptedEmailRoutingTimeseriesGroupRequest,
) => Effect.Effect<
  EncryptedEmailRoutingTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: EncryptedEmailRoutingTimeseriesGroupRequest,
  output: EncryptedEmailRoutingTimeseriesGroupResponse,
  errors: [],
}));

export interface SpfEmailRoutingTimeseriesGroupRequest {}

export const SpfEmailRoutingTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/routing/timeseries_groups/spf" }),
) as unknown as Schema.Schema<SpfEmailRoutingTimeseriesGroupRequest>;

export interface SpfEmailRoutingTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: unknown;
}

export const SpfEmailRoutingTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Unknown,
}) as unknown as Schema.Schema<SpfEmailRoutingTimeseriesGroupResponse>;

export const spfEmailRoutingTimeseriesGroup: (
  input: SpfEmailRoutingTimeseriesGroupRequest,
) => Effect.Effect<
  SpfEmailRoutingTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SpfEmailRoutingTimeseriesGroupRequest,
  output: SpfEmailRoutingTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// EmailSecuritySummary
// =============================================================================

export interface ArcEmailSecuritySummaryRequest {}

export const ArcEmailSecuritySummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/security/summary/arc" }),
) as unknown as Schema.Schema<ArcEmailSecuritySummaryRequest>;

export interface ArcEmailSecuritySummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: unknown;
}

export const ArcEmailSecuritySummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Unknown,
}) as unknown as Schema.Schema<ArcEmailSecuritySummaryResponse>;

export const arcEmailSecuritySummary: (
  input: ArcEmailSecuritySummaryRequest,
) => Effect.Effect<
  ArcEmailSecuritySummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ArcEmailSecuritySummaryRequest,
  output: ArcEmailSecuritySummaryResponse,
  errors: [],
}));

export interface DkimEmailSecuritySummaryRequest {}

export const DkimEmailSecuritySummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/security/summary/dkim" }),
) as unknown as Schema.Schema<DkimEmailSecuritySummaryRequest>;

export interface DkimEmailSecuritySummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: unknown;
}

export const DkimEmailSecuritySummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Unknown,
}) as unknown as Schema.Schema<DkimEmailSecuritySummaryResponse>;

export const dkimEmailSecuritySummary: (
  input: DkimEmailSecuritySummaryRequest,
) => Effect.Effect<
  DkimEmailSecuritySummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DkimEmailSecuritySummaryRequest,
  output: DkimEmailSecuritySummaryResponse,
  errors: [],
}));

export interface DmarcEmailSecuritySummaryRequest {}

export const DmarcEmailSecuritySummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/security/summary/dmarc" }),
) as unknown as Schema.Schema<DmarcEmailSecuritySummaryRequest>;

export interface DmarcEmailSecuritySummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: unknown;
}

export const DmarcEmailSecuritySummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Unknown,
}) as unknown as Schema.Schema<DmarcEmailSecuritySummaryResponse>;

export const dmarcEmailSecuritySummary: (
  input: DmarcEmailSecuritySummaryRequest,
) => Effect.Effect<
  DmarcEmailSecuritySummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DmarcEmailSecuritySummaryRequest,
  output: DmarcEmailSecuritySummaryResponse,
  errors: [],
}));

export interface MaliciousEmailSecuritySummaryRequest {}

export const MaliciousEmailSecuritySummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/security/summary/malicious" }),
) as unknown as Schema.Schema<MaliciousEmailSecuritySummaryRequest>;

export interface MaliciousEmailSecuritySummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { mALICIOUS: string; nOT_MALICIOUS: string };
}

export const MaliciousEmailSecuritySummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    mALICIOUS: Schema.String.pipe(T.JsonName("MALICIOUS")),
    nOT_MALICIOUS: Schema.String.pipe(T.JsonName("NOT_MALICIOUS")),
  }),
}) as unknown as Schema.Schema<MaliciousEmailSecuritySummaryResponse>;

export const maliciousEmailSecuritySummary: (
  input: MaliciousEmailSecuritySummaryRequest,
) => Effect.Effect<
  MaliciousEmailSecuritySummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: MaliciousEmailSecuritySummaryRequest,
  output: MaliciousEmailSecuritySummaryResponse,
  errors: [],
}));

export interface SpamEmailSecuritySummaryRequest {}

export const SpamEmailSecuritySummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/security/summary/spam" }),
) as unknown as Schema.Schema<SpamEmailSecuritySummaryRequest>;

export interface SpamEmailSecuritySummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { nOT_SPAM: string; sPAM: string };
}

export const SpamEmailSecuritySummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    nOT_SPAM: Schema.String.pipe(T.JsonName("NOT_SPAM")),
    sPAM: Schema.String.pipe(T.JsonName("SPAM")),
  }),
}) as unknown as Schema.Schema<SpamEmailSecuritySummaryResponse>;

export const spamEmailSecuritySummary: (
  input: SpamEmailSecuritySummaryRequest,
) => Effect.Effect<
  SpamEmailSecuritySummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SpamEmailSecuritySummaryRequest,
  output: SpamEmailSecuritySummaryResponse,
  errors: [],
}));

export interface SpfEmailSecuritySummaryRequest {}

export const SpfEmailSecuritySummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/security/summary/spf" }),
) as unknown as Schema.Schema<SpfEmailSecuritySummaryRequest>;

export interface SpfEmailSecuritySummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: unknown;
}

export const SpfEmailSecuritySummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Unknown,
}) as unknown as Schema.Schema<SpfEmailSecuritySummaryResponse>;

export const spfEmailSecuritySummary: (
  input: SpfEmailSecuritySummaryRequest,
) => Effect.Effect<
  SpfEmailSecuritySummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SpfEmailSecuritySummaryRequest,
  output: SpfEmailSecuritySummaryResponse,
  errors: [],
}));

export interface SpoofEmailSecuritySummaryRequest {}

export const SpoofEmailSecuritySummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/security/summary/spoof" }),
) as unknown as Schema.Schema<SpoofEmailSecuritySummaryRequest>;

export interface SpoofEmailSecuritySummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { nOT_SPOOF: string; sPOOF: string };
}

export const SpoofEmailSecuritySummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    nOT_SPOOF: Schema.String.pipe(T.JsonName("NOT_SPOOF")),
    sPOOF: Schema.String.pipe(T.JsonName("SPOOF")),
  }),
}) as unknown as Schema.Schema<SpoofEmailSecuritySummaryResponse>;

export const spoofEmailSecuritySummary: (
  input: SpoofEmailSecuritySummaryRequest,
) => Effect.Effect<
  SpoofEmailSecuritySummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SpoofEmailSecuritySummaryRequest,
  output: SpoofEmailSecuritySummaryResponse,
  errors: [],
}));

// =============================================================================
// EmailSecurityTimeseriesGroup
// =============================================================================

export interface ArcEmailSecurityTimeseriesGroupRequest {}

export const ArcEmailSecurityTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/timeseries_groups/arc",
  }),
) as unknown as Schema.Schema<ArcEmailSecurityTimeseriesGroupRequest>;

export interface ArcEmailSecurityTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: unknown;
}

export const ArcEmailSecurityTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Unknown,
}) as unknown as Schema.Schema<ArcEmailSecurityTimeseriesGroupResponse>;

export const arcEmailSecurityTimeseriesGroup: (
  input: ArcEmailSecurityTimeseriesGroupRequest,
) => Effect.Effect<
  ArcEmailSecurityTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ArcEmailSecurityTimeseriesGroupRequest,
  output: ArcEmailSecurityTimeseriesGroupResponse,
  errors: [],
}));

export interface DkimEmailSecurityTimeseriesGroupRequest {}

export const DkimEmailSecurityTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/timeseries_groups/dkim",
  }),
) as unknown as Schema.Schema<DkimEmailSecurityTimeseriesGroupRequest>;

export interface DkimEmailSecurityTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: unknown;
}

export const DkimEmailSecurityTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Unknown,
}) as unknown as Schema.Schema<DkimEmailSecurityTimeseriesGroupResponse>;

export const dkimEmailSecurityTimeseriesGroup: (
  input: DkimEmailSecurityTimeseriesGroupRequest,
) => Effect.Effect<
  DkimEmailSecurityTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DkimEmailSecurityTimeseriesGroupRequest,
  output: DkimEmailSecurityTimeseriesGroupResponse,
  errors: [],
}));

export interface DmarcEmailSecurityTimeseriesGroupRequest {}

export const DmarcEmailSecurityTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/timeseries_groups/dmarc",
  }),
) as unknown as Schema.Schema<DmarcEmailSecurityTimeseriesGroupRequest>;

export interface DmarcEmailSecurityTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: unknown;
}

export const DmarcEmailSecurityTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Unknown,
}) as unknown as Schema.Schema<DmarcEmailSecurityTimeseriesGroupResponse>;

export const dmarcEmailSecurityTimeseriesGroup: (
  input: DmarcEmailSecurityTimeseriesGroupRequest,
) => Effect.Effect<
  DmarcEmailSecurityTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DmarcEmailSecurityTimeseriesGroupRequest,
  output: DmarcEmailSecurityTimeseriesGroupResponse,
  errors: [],
}));

export interface MaliciousEmailSecurityTimeseriesGroupRequest {}

export const MaliciousEmailSecurityTimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/timeseries_groups/malicious",
  }),
) as unknown as Schema.Schema<MaliciousEmailSecurityTimeseriesGroupRequest>;

export interface MaliciousEmailSecurityTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { mALICIOUS: string[]; nOT_MALICIOUS: string[] };
}

export const MaliciousEmailSecurityTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    mALICIOUS: Schema.Array(Schema.String).pipe(T.JsonName("MALICIOUS")),
    nOT_MALICIOUS: Schema.Array(Schema.String).pipe(
      T.JsonName("NOT_MALICIOUS"),
    ),
  }),
}) as unknown as Schema.Schema<MaliciousEmailSecurityTimeseriesGroupResponse>;

export const maliciousEmailSecurityTimeseriesGroup: (
  input: MaliciousEmailSecurityTimeseriesGroupRequest,
) => Effect.Effect<
  MaliciousEmailSecurityTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: MaliciousEmailSecurityTimeseriesGroupRequest,
  output: MaliciousEmailSecurityTimeseriesGroupResponse,
  errors: [],
}));

export interface SpamEmailSecurityTimeseriesGroupRequest {}

export const SpamEmailSecurityTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/timeseries_groups/spam",
  }),
) as unknown as Schema.Schema<SpamEmailSecurityTimeseriesGroupRequest>;

export interface SpamEmailSecurityTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { nOT_SPAM: string[]; sPAM: string[] };
}

export const SpamEmailSecurityTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    nOT_SPAM: Schema.Array(Schema.String).pipe(T.JsonName("NOT_SPAM")),
    sPAM: Schema.Array(Schema.String).pipe(T.JsonName("SPAM")),
  }),
}) as unknown as Schema.Schema<SpamEmailSecurityTimeseriesGroupResponse>;

export const spamEmailSecurityTimeseriesGroup: (
  input: SpamEmailSecurityTimeseriesGroupRequest,
) => Effect.Effect<
  SpamEmailSecurityTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SpamEmailSecurityTimeseriesGroupRequest,
  output: SpamEmailSecurityTimeseriesGroupResponse,
  errors: [],
}));

export interface SpfEmailSecurityTimeseriesGroupRequest {}

export const SpfEmailSecurityTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/timeseries_groups/spf",
  }),
) as unknown as Schema.Schema<SpfEmailSecurityTimeseriesGroupRequest>;

export interface SpfEmailSecurityTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: unknown;
}

export const SpfEmailSecurityTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Unknown,
}) as unknown as Schema.Schema<SpfEmailSecurityTimeseriesGroupResponse>;

export const spfEmailSecurityTimeseriesGroup: (
  input: SpfEmailSecurityTimeseriesGroupRequest,
) => Effect.Effect<
  SpfEmailSecurityTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SpfEmailSecurityTimeseriesGroupRequest,
  output: SpfEmailSecurityTimeseriesGroupResponse,
  errors: [],
}));

export interface SpoofEmailSecurityTimeseriesGroupRequest {}

export const SpoofEmailSecurityTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/timeseries_groups/spoof",
  }),
) as unknown as Schema.Schema<SpoofEmailSecurityTimeseriesGroupRequest>;

export interface SpoofEmailSecurityTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { nOT_SPOOF: string[]; sPOOF: string[] };
}

export const SpoofEmailSecurityTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    nOT_SPOOF: Schema.Array(Schema.String).pipe(T.JsonName("NOT_SPOOF")),
    sPOOF: Schema.Array(Schema.String).pipe(T.JsonName("SPOOF")),
  }),
}) as unknown as Schema.Schema<SpoofEmailSecurityTimeseriesGroupResponse>;

export const spoofEmailSecurityTimeseriesGroup: (
  input: SpoofEmailSecurityTimeseriesGroupRequest,
) => Effect.Effect<
  SpoofEmailSecurityTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SpoofEmailSecurityTimeseriesGroupRequest,
  output: SpoofEmailSecurityTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// EmailSecurityTopTld
// =============================================================================

export interface GetEmailSecurityTopTldRequest {}

export const GetEmailSecurityTopTldRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/security/top/tlds" }),
) as unknown as Schema.Schema<GetEmailSecurityTopTldRequest>;

export interface GetEmailSecurityTopTldResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: string }[];
}

export const GetEmailSecurityTopTldResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetEmailSecurityTopTldResponse>;

export const getEmailSecurityTopTld: (
  input: GetEmailSecurityTopTldRequest,
) => Effect.Effect<
  GetEmailSecurityTopTldResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetEmailSecurityTopTldRequest,
  output: GetEmailSecurityTopTldResponse,
  errors: [],
}));

// =============================================================================
// EmailSecurityTopTldMalicious
// =============================================================================

export interface GetEmailSecurityTopTldMaliciousRequest {
  malicious: "MALICIOUS" | "NOT_MALICIOUS";
}

export const GetEmailSecurityTopTldMaliciousRequest = Schema.Struct({
  malicious: Schema.Literal("MALICIOUS", "NOT_MALICIOUS").pipe(
    T.HttpPath("malicious"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/top/tlds/malicious/{malicious}",
  }),
) as unknown as Schema.Schema<GetEmailSecurityTopTldMaliciousRequest>;

export interface GetEmailSecurityTopTldMaliciousResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: string }[];
}

export const GetEmailSecurityTopTldMaliciousResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetEmailSecurityTopTldMaliciousResponse>;

export const getEmailSecurityTopTldMalicious: (
  input: GetEmailSecurityTopTldMaliciousRequest,
) => Effect.Effect<
  GetEmailSecurityTopTldMaliciousResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetEmailSecurityTopTldMaliciousRequest,
  output: GetEmailSecurityTopTldMaliciousResponse,
  errors: [],
}));

// =============================================================================
// EmailSecurityTopTldSpam
// =============================================================================

export interface GetEmailSecurityTopTldSpamRequest {
  spam: "SPAM" | "NOT_SPAM";
}

export const GetEmailSecurityTopTldSpamRequest = Schema.Struct({
  spam: Schema.Literal("SPAM", "NOT_SPAM").pipe(T.HttpPath("spam")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/email/security/top/tlds/spam/{spam}" }),
) as unknown as Schema.Schema<GetEmailSecurityTopTldSpamRequest>;

export interface GetEmailSecurityTopTldSpamResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: string }[];
}

export const GetEmailSecurityTopTldSpamResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetEmailSecurityTopTldSpamResponse>;

export const getEmailSecurityTopTldSpam: (
  input: GetEmailSecurityTopTldSpamRequest,
) => Effect.Effect<
  GetEmailSecurityTopTldSpamResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetEmailSecurityTopTldSpamRequest,
  output: GetEmailSecurityTopTldSpamResponse,
  errors: [],
}));

// =============================================================================
// EmailSecurityTopTldSpoof
// =============================================================================

export interface GetEmailSecurityTopTldSpoofRequest {
  spoof: "SPOOF" | "NOT_SPOOF";
}

export const GetEmailSecurityTopTldSpoofRequest = Schema.Struct({
  spoof: Schema.Literal("SPOOF", "NOT_SPOOF").pipe(T.HttpPath("spoof")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/top/tlds/spoof/{spoof}",
  }),
) as unknown as Schema.Schema<GetEmailSecurityTopTldSpoofRequest>;

export interface GetEmailSecurityTopTldSpoofResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: string }[];
}

export const GetEmailSecurityTopTldSpoofResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetEmailSecurityTopTldSpoofResponse>;

export const getEmailSecurityTopTldSpoof: (
  input: GetEmailSecurityTopTldSpoofRequest,
) => Effect.Effect<
  GetEmailSecurityTopTldSpoofResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetEmailSecurityTopTldSpoofRequest,
  output: GetEmailSecurityTopTldSpoofResponse,
  errors: [],
}));

// =============================================================================
// Entity
// =============================================================================

export interface GetEntityRequest {
  /** IP address. */
  ip: string;
  /** Format in which results will be returned. */
  format?: "JSON" | "CSV";
}

export const GetEntityRequest = Schema.Struct({
  ip: Schema.String,
  format: Schema.optional(Schema.Literal("JSON", "CSV")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/entities/ip" }),
) as unknown as Schema.Schema<GetEntityRequest>;

export interface GetEntityResponse {
  ip: {
    asn: string;
    asnLocation: string;
    asnName: string;
    asnOrgName: string;
    ip: string;
    ipVersion: string;
    location: string;
    locationName: string;
  };
}

export const GetEntityResponse = Schema.Struct({
  ip: Schema.Struct({
    asn: Schema.String,
    asnLocation: Schema.String,
    asnName: Schema.String,
    asnOrgName: Schema.String,
    ip: Schema.String,
    ipVersion: Schema.String,
    location: Schema.String,
    locationName: Schema.String,
  }),
}) as unknown as Schema.Schema<GetEntityResponse>;

export const getEntity: (
  input: GetEntityRequest,
) => Effect.Effect<
  GetEntityResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetEntityRequest,
  output: GetEntityResponse,
  errors: [],
}));

// =============================================================================
// EntityAsn
// =============================================================================

export interface GetEntityAsnRequest {
  asn: number;
}

export const GetEntityAsnRequest = Schema.Struct({
  asn: Schema.Number.pipe(T.HttpPath("asn")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/entities/asns/{asn}" }),
) as unknown as Schema.Schema<GetEntityAsnRequest>;

export interface GetEntityAsnResponse {
  asn: {
    asn: number;
    confidenceLevel: number;
    country: string;
    countryName: string;
    estimatedUsers: {
      locations: {
        locationAlpha2: string;
        locationName: string;
        estimatedUsers?: number;
      }[];
      estimatedUsers?: number;
    };
    name: string;
    orgName: string;
    related: {
      asn: number;
      name: string;
      aka?: string;
      estimatedUsers?: number;
    }[];
    source: string;
    website: string;
    aka?: string;
  };
}

export const GetEntityAsnResponse = Schema.Struct({
  asn: Schema.Struct({
    asn: Schema.Number,
    confidenceLevel: Schema.Number,
    country: Schema.String,
    countryName: Schema.String,
    estimatedUsers: Schema.Struct({
      locations: Schema.Array(
        Schema.Struct({
          locationAlpha2: Schema.String,
          locationName: Schema.String,
          estimatedUsers: Schema.optional(Schema.Number),
        }),
      ),
      estimatedUsers: Schema.optional(Schema.Number),
    }),
    name: Schema.String,
    orgName: Schema.String,
    related: Schema.Array(
      Schema.Struct({
        asn: Schema.Number,
        name: Schema.String,
        aka: Schema.optional(Schema.String),
        estimatedUsers: Schema.optional(Schema.Number),
      }),
    ),
    source: Schema.String,
    website: Schema.String,
    aka: Schema.optional(Schema.String),
  }),
}) as unknown as Schema.Schema<GetEntityAsnResponse>;

export const getEntityAsn: (
  input: GetEntityAsnRequest,
) => Effect.Effect<
  GetEntityAsnResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetEntityAsnRequest,
  output: GetEntityAsnResponse,
  errors: [],
}));

export interface ListEntityAsnsRequest {}

export const ListEntityAsnsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/entities/asns" }),
) as unknown as Schema.Schema<ListEntityAsnsRequest>;

export interface ListEntityAsnsResponse {
  asns: {
    asn: number;
    country: string;
    countryName: string;
    name: string;
    aka?: string;
    orgName?: string;
    website?: string;
  }[];
}

export const ListEntityAsnsResponse = Schema.Struct({
  asns: Schema.Array(
    Schema.Struct({
      asn: Schema.Number,
      country: Schema.String,
      countryName: Schema.String,
      name: Schema.String,
      aka: Schema.optional(Schema.String),
      orgName: Schema.optional(Schema.String),
      website: Schema.optional(Schema.String),
    }),
  ),
}) as unknown as Schema.Schema<ListEntityAsnsResponse>;

export const listEntityAsns: (
  input: ListEntityAsnsRequest,
) => Effect.Effect<
  ListEntityAsnsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListEntityAsnsRequest,
  output: ListEntityAsnsResponse,
  errors: [],
}));

export interface IpEntityAsnRequest {
  /** IP address. */
  ip: string;
  /** Format in which results will be returned. */
  format?: "JSON" | "CSV";
}

export const IpEntityAsnRequest = Schema.Struct({
  ip: Schema.String,
  format: Schema.optional(Schema.Literal("JSON", "CSV")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/entities/asns/ip" }),
) as unknown as Schema.Schema<IpEntityAsnRequest>;

export interface IpEntityAsnResponse {
  asn: {
    asn: number;
    country: string;
    countryName: string;
    estimatedUsers: {
      locations: {
        locationAlpha2: string;
        locationName: string;
        estimatedUsers?: number;
      }[];
      estimatedUsers?: number;
    };
    name: string;
    orgName: string;
    related: {
      asn: number;
      name: string;
      aka?: string;
      estimatedUsers?: number;
    }[];
    source: string;
    website: string;
    aka?: string;
  };
}

export const IpEntityAsnResponse = Schema.Struct({
  asn: Schema.Struct({
    asn: Schema.Number,
    country: Schema.String,
    countryName: Schema.String,
    estimatedUsers: Schema.Struct({
      locations: Schema.Array(
        Schema.Struct({
          locationAlpha2: Schema.String,
          locationName: Schema.String,
          estimatedUsers: Schema.optional(Schema.Number),
        }),
      ),
      estimatedUsers: Schema.optional(Schema.Number),
    }),
    name: Schema.String,
    orgName: Schema.String,
    related: Schema.Array(
      Schema.Struct({
        asn: Schema.Number,
        name: Schema.String,
        aka: Schema.optional(Schema.String),
        estimatedUsers: Schema.optional(Schema.Number),
      }),
    ),
    source: Schema.String,
    website: Schema.String,
    aka: Schema.optional(Schema.String),
  }),
}) as unknown as Schema.Schema<IpEntityAsnResponse>;

export const ipEntityAsn: (
  input: IpEntityAsnRequest,
) => Effect.Effect<
  IpEntityAsnResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpEntityAsnRequest,
  output: IpEntityAsnResponse,
  errors: [],
}));

export interface RelEntityAsnRequest {
  asn: number;
}

export const RelEntityAsnRequest = Schema.Struct({
  asn: Schema.Number.pipe(T.HttpPath("asn")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/entities/asns/{asn}/rel" }),
) as unknown as Schema.Schema<RelEntityAsnRequest>;

export interface RelEntityAsnResponse {
  meta: { dataTime: string; queryTime: string; totalPeers: number };
  rels: {
    asn1: number;
    asn1Country: string;
    asn1Name: string;
    asn2: number;
    asn2Country: string;
    asn2Name: string;
    rel: string;
  }[];
}

export const RelEntityAsnResponse = Schema.Struct({
  meta: Schema.Struct({
    dataTime: Schema.String.pipe(T.JsonName("data_time")),
    queryTime: Schema.String.pipe(T.JsonName("query_time")),
    totalPeers: Schema.Number.pipe(T.JsonName("total_peers")),
  }),
  rels: Schema.Array(
    Schema.Struct({
      asn1: Schema.Number,
      asn1Country: Schema.String.pipe(T.JsonName("asn1_country")),
      asn1Name: Schema.String.pipe(T.JsonName("asn1_name")),
      asn2: Schema.Number,
      asn2Country: Schema.String.pipe(T.JsonName("asn2_country")),
      asn2Name: Schema.String.pipe(T.JsonName("asn2_name")),
      rel: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<RelEntityAsnResponse>;

export const relEntityAsn: (
  input: RelEntityAsnRequest,
) => Effect.Effect<
  RelEntityAsnResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RelEntityAsnRequest,
  output: RelEntityAsnResponse,
  errors: [],
}));

// =============================================================================
// EntityLocation
// =============================================================================

export interface GetEntityLocationRequest {
  location: string;
}

export const GetEntityLocationRequest = Schema.Struct({
  location: Schema.String.pipe(T.HttpPath("location")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/entities/locations/{location}" }),
) as unknown as Schema.Schema<GetEntityLocationRequest>;

export interface GetEntityLocationResponse {
  location: {
    alpha2: string;
    confidenceLevel: number;
    latitude: string;
    longitude: string;
    name: string;
    region: string;
    subregion: string;
  };
}

export const GetEntityLocationResponse = Schema.Struct({
  location: Schema.Struct({
    alpha2: Schema.String,
    confidenceLevel: Schema.Number,
    latitude: Schema.String,
    longitude: Schema.String,
    name: Schema.String,
    region: Schema.String,
    subregion: Schema.String,
  }),
}) as unknown as Schema.Schema<GetEntityLocationResponse>;

export const getEntityLocation: (
  input: GetEntityLocationRequest,
) => Effect.Effect<
  GetEntityLocationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetEntityLocationRequest,
  output: GetEntityLocationResponse,
  errors: [],
}));

export interface ListEntityLocationsRequest {}

export const ListEntityLocationsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/entities/locations" }),
) as unknown as Schema.Schema<ListEntityLocationsRequest>;

export interface ListEntityLocationsResponse {
  locations: {
    alpha2: string;
    latitude: string;
    longitude: string;
    name: string;
  }[];
}

export const ListEntityLocationsResponse = Schema.Struct({
  locations: Schema.Array(
    Schema.Struct({
      alpha2: Schema.String,
      latitude: Schema.String,
      longitude: Schema.String,
      name: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<ListEntityLocationsResponse>;

export const listEntityLocations: (
  input: ListEntityLocationsRequest,
) => Effect.Effect<
  ListEntityLocationsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListEntityLocationsRequest,
  output: ListEntityLocationsResponse,
  errors: [],
}));

// =============================================================================
// FamilyHttpTimeseriesGroup
// =============================================================================

export interface BrowserFamilyHttpTimeseriesGroupRequest {}

export const BrowserFamilyHttpTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/timeseries_groups/browser_family",
  }),
) as unknown as Schema.Schema<BrowserFamilyHttpTimeseriesGroupRequest>;

export interface BrowserFamilyHttpTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const BrowserFamilyHttpTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<BrowserFamilyHttpTimeseriesGroupResponse>;

export const browserFamilyHttpTimeseriesGroup: (
  input: BrowserFamilyHttpTimeseriesGroupRequest,
) => Effect.Effect<
  BrowserFamilyHttpTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BrowserFamilyHttpTimeseriesGroupRequest,
  output: BrowserFamilyHttpTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// FamilyHttpTop
// =============================================================================

export interface BrowserFamilyHttpTopRequest {}

export const BrowserFamilyHttpTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/top/browser_family" }),
) as unknown as Schema.Schema<BrowserFamilyHttpTopRequest>;

export interface BrowserFamilyHttpTopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: string }[];
}

export const BrowserFamilyHttpTopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<BrowserFamilyHttpTopResponse>;

export const browserFamilyHttpTop: (
  input: BrowserFamilyHttpTopRequest,
) => Effect.Effect<
  BrowserFamilyHttpTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BrowserFamilyHttpTopRequest,
  output: BrowserFamilyHttpTopResponse,
  errors: [],
}));

// =============================================================================
// GroupsAiTimeseriesGroup
// =============================================================================

export interface TimeseriesGroupsAiTimeseriesGroupRequest {
  dimension: "USER_AGENT" | "CRAWL_PURPOSE" | "INDUSTRY" | "VERTICAL";
}

export const TimeseriesGroupsAiTimeseriesGroupRequest = Schema.Struct({
  dimension: Schema.Literal(
    "USER_AGENT",
    "CRAWL_PURPOSE",
    "INDUSTRY",
    "VERTICAL",
  ).pipe(T.HttpPath("dimension")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/ai/bots/timeseries_groups/{dimension}",
  }),
) as unknown as Schema.Schema<TimeseriesGroupsAiTimeseriesGroupRequest>;

export interface TimeseriesGroupsAiTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const TimeseriesGroupsAiTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TimeseriesGroupsAiTimeseriesGroupResponse>;

export const timeseriesGroupsAiTimeseriesGroup: (
  input: TimeseriesGroupsAiTimeseriesGroupRequest,
) => Effect.Effect<
  TimeseriesGroupsAiTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesGroupsAiTimeseriesGroupRequest,
  output: TimeseriesGroupsAiTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// GroupsBot
// =============================================================================

export interface TimeseriesGroupsBotRequest {
  dimension: "BOT" | "BOT_KIND" | "BOT_OPERATOR" | "BOT_CATEGORY";
}

export const TimeseriesGroupsBotRequest = Schema.Struct({
  dimension: Schema.Literal(
    "BOT",
    "BOT_KIND",
    "BOT_OPERATOR",
    "BOT_CATEGORY",
  ).pipe(T.HttpPath("dimension")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/bots/timeseries_groups/{dimension}" }),
) as unknown as Schema.Schema<TimeseriesGroupsBotRequest>;

export interface TimeseriesGroupsBotResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const TimeseriesGroupsBotResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TimeseriesGroupsBotResponse>;

export const timeseriesGroupsBot: (
  input: TimeseriesGroupsBotRequest,
) => Effect.Effect<
  TimeseriesGroupsBotResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesGroupsBotRequest,
  output: TimeseriesGroupsBotResponse,
  errors: [],
}));

// =============================================================================
// GroupsBotWebCrawler
// =============================================================================

export interface TimeseriesGroupsBotWebCrawlerRequest {
  dimension:
    | "USER_AGENT"
    | "REFERER"
    | "CRAWL_REFER_RATIO"
    | "VERTICAL"
    | "INDUSTRY";
}

export const TimeseriesGroupsBotWebCrawlerRequest = Schema.Struct({
  dimension: Schema.Literal(
    "USER_AGENT",
    "REFERER",
    "CRAWL_REFER_RATIO",
    "VERTICAL",
    "INDUSTRY",
  ).pipe(T.HttpPath("dimension")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/bots/crawlers/timeseries_groups/{dimension}",
  }),
) as unknown as Schema.Schema<TimeseriesGroupsBotWebCrawlerRequest>;

export interface TimeseriesGroupsBotWebCrawlerResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const TimeseriesGroupsBotWebCrawlerResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TimeseriesGroupsBotWebCrawlerResponse>;

export const timeseriesGroupsBotWebCrawler: (
  input: TimeseriesGroupsBotWebCrawlerRequest,
) => Effect.Effect<
  TimeseriesGroupsBotWebCrawlerResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesGroupsBotWebCrawlerRequest,
  output: TimeseriesGroupsBotWebCrawlerResponse,
  errors: [],
}));

// =============================================================================
// GroupsCt
// =============================================================================

export interface TimeseriesGroupsCtRequest {
  dimension:
    | "CA"
    | "CA_OWNER"
    | "DURATION"
    | "ENTRY_TYPE"
    | "EXPIRATION_STATUS"
    | "HAS_IPS"
    | "HAS_WILDCARDS"
    | "LOG"
    | "LOG_API"
    | "LOG_OPERATOR"
    | "PUBLIC_KEY_ALGORITHM"
    | "SIGNATURE_ALGORITHM"
    | "TLD"
    | "VALIDATION_LEVEL";
}

export const TimeseriesGroupsCtRequest = Schema.Struct({
  dimension: Schema.Literal(
    "CA",
    "CA_OWNER",
    "DURATION",
    "ENTRY_TYPE",
    "EXPIRATION_STATUS",
    "HAS_IPS",
    "HAS_WILDCARDS",
    "LOG",
    "LOG_API",
    "LOG_OPERATOR",
    "PUBLIC_KEY_ALGORITHM",
    "SIGNATURE_ALGORITHM",
    "TLD",
    "VALIDATION_LEVEL",
  ).pipe(T.HttpPath("dimension")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/ct/timeseries_groups/{dimension}" }),
) as unknown as Schema.Schema<TimeseriesGroupsCtRequest>;

export interface TimeseriesGroupsCtResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0:
    | { timestamps: string[] }
    | { rfc6962: string[]; static: string[] }
    | {
        gt_121d: string[];
        gt_16dLte_31d: string[];
        gt_31dLte_91d: string[];
        gt_3dLte_16d: string[];
        gt_91dLte_121d: string[];
        lte_3d: string[];
      }
    | { cERTIFICATE: string[]; pRECERTIFICATE: string[] }
    | { eXPIRED: string[]; vALID: string[] }
    | { nEGATIVE: string[]; pOSITIVE: string[] }
    | { dSA: string[]; eCDSA: string[]; rSA: string[] }
    | {
        domain: string[];
        extended: string[];
        organization: string[];
        unknown: string[];
      };
}

export const TimeseriesGroupsCtResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Union(
    Schema.Struct({
      timestamps: Schema.Array(Schema.String),
    }),
    Schema.Struct({
      rfc6962: Schema.Array(Schema.String),
      static: Schema.Array(Schema.String),
    }),
    Schema.Struct({
      gt_121d: Schema.Array(Schema.String),
      gt_16dLte_31d: Schema.Array(Schema.String).pipe(
        T.JsonName("gt_16d_lte_31d"),
      ),
      gt_31dLte_91d: Schema.Array(Schema.String).pipe(
        T.JsonName("gt_31d_lte_91d"),
      ),
      gt_3dLte_16d: Schema.Array(Schema.String).pipe(
        T.JsonName("gt_3d_lte_16d"),
      ),
      gt_91dLte_121d: Schema.Array(Schema.String).pipe(
        T.JsonName("gt_91d_lte_121d"),
      ),
      lte_3d: Schema.Array(Schema.String),
    }),
    Schema.Struct({
      cERTIFICATE: Schema.Array(Schema.String).pipe(T.JsonName("CERTIFICATE")),
      pRECERTIFICATE: Schema.Array(Schema.String).pipe(
        T.JsonName("PRECERTIFICATE"),
      ),
    }),
    Schema.Struct({
      eXPIRED: Schema.Array(Schema.String).pipe(T.JsonName("EXPIRED")),
      vALID: Schema.Array(Schema.String).pipe(T.JsonName("VALID")),
    }),
    Schema.Struct({
      nEGATIVE: Schema.Array(Schema.String).pipe(T.JsonName("NEGATIVE")),
      pOSITIVE: Schema.Array(Schema.String).pipe(T.JsonName("POSITIVE")),
    }),
    Schema.Struct({
      dSA: Schema.Array(Schema.String).pipe(T.JsonName("DSA")),
      eCDSA: Schema.Array(Schema.String).pipe(T.JsonName("ECDSA")),
      rSA: Schema.Array(Schema.String).pipe(T.JsonName("RSA")),
    }),
    Schema.Struct({
      domain: Schema.Array(Schema.String),
      extended: Schema.Array(Schema.String),
      organization: Schema.Array(Schema.String),
      unknown: Schema.Array(Schema.String),
    }),
  ),
}) as unknown as Schema.Schema<TimeseriesGroupsCtResponse>;

export const timeseriesGroupsCt: (
  input: TimeseriesGroupsCtRequest,
) => Effect.Effect<
  TimeseriesGroupsCtResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesGroupsCtRequest,
  output: TimeseriesGroupsCtResponse,
  errors: [],
}));

// =============================================================================
// GroupsQualityIqi
// =============================================================================

export interface TimeseriesGroupsQualityIqiRequest {
  /** Defines which metric to return (bandwidth, latency, or DNS response time). */
  metric: "BANDWIDTH" | "DNS" | "LATENCY";
  /** Aggregation interval of the results (e.g., in 15 minutes or 1 hour intervals). Refer to [Aggregation intervals](https://developers.cloudflare.com/radar/concepts/aggregation-intervals/). */
  aggInterval?: "15m" | "1h" | "1d" | "1w";
  /** Filters results by Autonomous System. Specify one or more Autonomous System Numbers (ASNs) as a comma-separated list. Prefix with `-` to exclude ASNs from results. For example, `-174, 3356` excludes r */
  asn?: string[];
  /** Filters results by continent. Specify a comma-separated list of alpha-2 codes. Prefix with `-` to exclude continents from results. For example, `-EU,NA` excludes results from EU, but includes results  */
  continent?: string[];
  /** End of the date range (inclusive). */
  dateEnd?: string[];
  /** Filters results by date range. For example, use `7d` and `7dcontrol` to compare this week with the previous week. Use this parameter or set specific start and end dates (`dateStart` and `dateEnd` para */
  dateRange?: string[];
  /** Start of the date range. */
  dateStart?: string[];
  /** Format in which results will be returned. */
  format?: "JSON" | "CSV";
  /** Enables interpolation for all series (using the average). */
  interpolation?: boolean;
  /** Filters results by location. Specify a comma-separated list of alpha-2 codes. Prefix with `-` to exclude locations from results. For example, `-US,PT` excludes results from the US, but includes result */
  location?: string[];
  /** Array of names used to label the series in the response. */
  name?: string[];
}

export const TimeseriesGroupsQualityIqiRequest = Schema.Struct({
  metric: Schema.Literal("BANDWIDTH", "DNS", "LATENCY"),
  aggInterval: Schema.optional(Schema.Literal("15m", "1h", "1d", "1w")),
  asn: Schema.optional(Schema.Array(Schema.String)),
  continent: Schema.optional(Schema.Array(Schema.String)),
  dateEnd: Schema.optional(Schema.Array(Schema.String)),
  dateRange: Schema.optional(Schema.Array(Schema.String)),
  dateStart: Schema.optional(Schema.Array(Schema.String)),
  format: Schema.optional(Schema.Literal("JSON", "CSV")),
  interpolation: Schema.optional(Schema.Boolean),
  location: Schema.optional(Schema.Array(Schema.String)),
  name: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({ method: "GET", path: "/radar/quality/iqi/timeseries_groups" }),
) as unknown as Schema.Schema<TimeseriesGroupsQualityIqiRequest>;

export interface TimeseriesGroupsQualityIqiResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    p25: string[];
    p50: string[];
    p75: string[];
    timestamps: string[];
  };
}

export const TimeseriesGroupsQualityIqiResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    p25: Schema.Array(Schema.String),
    p50: Schema.Array(Schema.String),
    p75: Schema.Array(Schema.String),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TimeseriesGroupsQualityIqiResponse>;

export const timeseriesGroupsQualityIqi: (
  input: TimeseriesGroupsQualityIqiRequest,
) => Effect.Effect<
  TimeseriesGroupsQualityIqiResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesGroupsQualityIqiRequest,
  output: TimeseriesGroupsQualityIqiResponse,
  errors: [],
}));

// =============================================================================
// GroupsRanking
// =============================================================================

export interface TimeseriesGroupsRankingRequest {}

export const TimeseriesGroupsRankingRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/ranking/timeseries_groups" }),
) as unknown as Schema.Schema<TimeseriesGroupsRankingRequest>;

export interface TimeseriesGroupsRankingResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const TimeseriesGroupsRankingResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TimeseriesGroupsRankingResponse>;

export const timeseriesGroupsRanking: (
  input: TimeseriesGroupsRankingRequest,
) => Effect.Effect<
  TimeseriesGroupsRankingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesGroupsRankingRequest,
  output: TimeseriesGroupsRankingResponse,
  errors: [],
}));

// =============================================================================
// GroupsRankingInternetService
// =============================================================================

export interface TimeseriesGroupsRankingInternetServiceRequest {}

export const TimeseriesGroupsRankingInternetServiceRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/ranking/internet_services/timeseries_groups",
  }),
) as unknown as Schema.Schema<TimeseriesGroupsRankingInternetServiceRequest>;

export interface TimeseriesGroupsRankingInternetServiceResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const TimeseriesGroupsRankingInternetServiceResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TimeseriesGroupsRankingInternetServiceResponse>;

export const timeseriesGroupsRankingInternetService: (
  input: TimeseriesGroupsRankingInternetServiceRequest,
) => Effect.Effect<
  TimeseriesGroupsRankingInternetServiceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesGroupsRankingInternetServiceRequest,
  output: TimeseriesGroupsRankingInternetServiceResponse,
  errors: [],
}));

// =============================================================================
// GroupsTcpResetsTimeout
// =============================================================================

export interface TimeseriesGroupsTcpResetsTimeoutRequest {}

export const TimeseriesGroupsTcpResetsTimeoutRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/tcp_resets_timeouts/timeseries_groups",
  }),
) as unknown as Schema.Schema<TimeseriesGroupsTcpResetsTimeoutRequest>;

export interface TimeseriesGroupsTcpResetsTimeoutResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    laterInFlow: string[];
    noMatch: string[];
    postAck: string[];
    postPsh: string[];
    postSyn: string[];
    timestamps: string[];
  };
}

export const TimeseriesGroupsTcpResetsTimeoutResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    laterInFlow: Schema.Array(Schema.String).pipe(T.JsonName("later_in_flow")),
    noMatch: Schema.Array(Schema.String).pipe(T.JsonName("no_match")),
    postAck: Schema.Array(Schema.String).pipe(T.JsonName("post_ack")),
    postPsh: Schema.Array(Schema.String).pipe(T.JsonName("post_psh")),
    postSyn: Schema.Array(Schema.String).pipe(T.JsonName("post_syn")),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TimeseriesGroupsTcpResetsTimeoutResponse>;

export const timeseriesGroupsTcpResetsTimeout: (
  input: TimeseriesGroupsTcpResetsTimeoutRequest,
) => Effect.Effect<
  TimeseriesGroupsTcpResetsTimeoutResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesGroupsTcpResetsTimeoutRequest,
  output: TimeseriesGroupsTcpResetsTimeoutResponse,
  errors: [],
}));

// =============================================================================
// HitDnsSummary
// =============================================================================

export interface CacheHitDnsSummaryRequest {}

export const CacheHitDnsSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/summary/cache_hit" }),
) as unknown as Schema.Schema<CacheHitDnsSummaryRequest>;

export interface CacheHitDnsSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { nEGATIVE: string; pOSITIVE: string };
}

export const CacheHitDnsSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    nEGATIVE: Schema.String.pipe(T.JsonName("NEGATIVE")),
    pOSITIVE: Schema.String.pipe(T.JsonName("POSITIVE")),
  }),
}) as unknown as Schema.Schema<CacheHitDnsSummaryResponse>;

export const cacheHitDnsSummary: (
  input: CacheHitDnsSummaryRequest,
) => Effect.Effect<
  CacheHitDnsSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CacheHitDnsSummaryRequest,
  output: CacheHitDnsSummaryResponse,
  errors: [],
}));

// =============================================================================
// HitDnsTimeseriesGroup
// =============================================================================

export interface CacheHitDnsTimeseriesGroupRequest {}

export const CacheHitDnsTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/timeseries_groups/cache_hit" }),
) as unknown as Schema.Schema<CacheHitDnsTimeseriesGroupRequest>;

export interface CacheHitDnsTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { nEGATIVE: string[]; pOSITIVE: string[] };
}

export const CacheHitDnsTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    nEGATIVE: Schema.Array(Schema.String).pipe(T.JsonName("NEGATIVE")),
    pOSITIVE: Schema.Array(Schema.String).pipe(T.JsonName("POSITIVE")),
  }),
}) as unknown as Schema.Schema<CacheHitDnsTimeseriesGroupResponse>;

export const cacheHitDnsTimeseriesGroup: (
  input: CacheHitDnsTimeseriesGroupRequest,
) => Effect.Effect<
  CacheHitDnsTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CacheHitDnsTimeseriesGroupRequest,
  output: CacheHitDnsTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// Http
// =============================================================================

export interface TimeseriesHttpRequest {}

export const TimeseriesHttpRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/timeseries" }),
) as unknown as Schema.Schema<TimeseriesHttpRequest>;

export interface TimeseriesHttpResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
}

export const TimeseriesHttpResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
}) as unknown as Schema.Schema<TimeseriesHttpResponse>;

export const timeseriesHttp: (
  input: TimeseriesHttpRequest,
) => Effect.Effect<
  TimeseriesHttpResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesHttpRequest,
  output: TimeseriesHttpResponse,
  errors: [],
}));

// =============================================================================
// HttpA
// =============================================================================

export interface GetHttpAsRequest {}

export const GetHttpAsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/top/ases" }),
) as unknown as Schema.Schema<GetHttpAsRequest>;

export interface GetHttpAsResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { clientASN: number; clientASName: string; value: string }[];
}

export const GetHttpAsResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientASN: Schema.Number,
      clientASName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpAsResponse>;

export const getHttpAs: (
  input: GetHttpAsRequest,
) => Effect.Effect<
  GetHttpAsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpAsRequest,
  output: GetHttpAsResponse,
  errors: [],
}));

// =============================================================================
// HttpAsBotClass
// =============================================================================

export interface GetHttpAsBotClassRequest {
  botClass: "LIKELY_AUTOMATED" | "LIKELY_HUMAN";
}

export const GetHttpAsBotClassRequest = Schema.Struct({
  botClass: Schema.Literal("LIKELY_AUTOMATED", "LIKELY_HUMAN").pipe(
    T.HttpPath("botClass"),
  ),
}).pipe(
  T.Http({ method: "GET", path: "/radar/http/top/ases/bot_class/{botClass}" }),
) as unknown as Schema.Schema<GetHttpAsBotClassRequest>;

export interface GetHttpAsBotClassResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { clientASN: number; clientASName: string; value: string }[];
}

export const GetHttpAsBotClassResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientASN: Schema.Number,
      clientASName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpAsBotClassResponse>;

export const getHttpAsBotClass: (
  input: GetHttpAsBotClassRequest,
) => Effect.Effect<
  GetHttpAsBotClassResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpAsBotClassRequest,
  output: GetHttpAsBotClassResponse,
  errors: [],
}));

// =============================================================================
// HttpAsBrowserFamily
// =============================================================================

export interface GetHttpAsBrowserFamilyRequest {
  browserFamily: "CHROME" | "EDGE" | "FIREFOX" | "SAFARI";
}

export const GetHttpAsBrowserFamilyRequest = Schema.Struct({
  browserFamily: Schema.Literal("CHROME", "EDGE", "FIREFOX", "SAFARI").pipe(
    T.HttpPath("browserFamily"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/ases/browser_family/{browserFamily}",
  }),
) as unknown as Schema.Schema<GetHttpAsBrowserFamilyRequest>;

export interface GetHttpAsBrowserFamilyResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { clientASN: number; clientASName: string; value: string }[];
}

export const GetHttpAsBrowserFamilyResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientASN: Schema.Number,
      clientASName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpAsBrowserFamilyResponse>;

export const getHttpAsBrowserFamily: (
  input: GetHttpAsBrowserFamilyRequest,
) => Effect.Effect<
  GetHttpAsBrowserFamilyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpAsBrowserFamilyRequest,
  output: GetHttpAsBrowserFamilyResponse,
  errors: [],
}));

// =============================================================================
// HttpAsDeviceType
// =============================================================================

export interface GetHttpAsDeviceTypeRequest {
  deviceType: "DESKTOP" | "MOBILE" | "OTHER";
}

export const GetHttpAsDeviceTypeRequest = Schema.Struct({
  deviceType: Schema.Literal("DESKTOP", "MOBILE", "OTHER").pipe(
    T.HttpPath("deviceType"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/ases/device_type/{deviceType}",
  }),
) as unknown as Schema.Schema<GetHttpAsDeviceTypeRequest>;

export interface GetHttpAsDeviceTypeResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { clientASN: number; clientASName: string; value: string }[];
}

export const GetHttpAsDeviceTypeResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientASN: Schema.Number,
      clientASName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpAsDeviceTypeResponse>;

export const getHttpAsDeviceType: (
  input: GetHttpAsDeviceTypeRequest,
) => Effect.Effect<
  GetHttpAsDeviceTypeResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpAsDeviceTypeRequest,
  output: GetHttpAsDeviceTypeResponse,
  errors: [],
}));

// =============================================================================
// HttpAsHttpMethod
// =============================================================================

export interface GetHttpAsHttpMethodRequest {
  httpVersion: "HTTPv1" | "HTTPv2" | "HTTPv3";
}

export const GetHttpAsHttpMethodRequest = Schema.Struct({
  httpVersion: Schema.Literal("HTTPv1", "HTTPv2", "HTTPv3").pipe(
    T.HttpPath("httpVersion"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/ases/http_version/{httpVersion}",
  }),
) as unknown as Schema.Schema<GetHttpAsHttpMethodRequest>;

export interface GetHttpAsHttpMethodResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { clientASN: number; clientASName: string; value: string }[];
}

export const GetHttpAsHttpMethodResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientASN: Schema.Number,
      clientASName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpAsHttpMethodResponse>;

export const getHttpAsHttpMethod: (
  input: GetHttpAsHttpMethodRequest,
) => Effect.Effect<
  GetHttpAsHttpMethodResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpAsHttpMethodRequest,
  output: GetHttpAsHttpMethodResponse,
  errors: [],
}));

// =============================================================================
// HttpAsHttpProtocol
// =============================================================================

export interface GetHttpAsHttpProtocolRequest {
  httpProtocol: "HTTP" | "HTTPS";
}

export const GetHttpAsHttpProtocolRequest = Schema.Struct({
  httpProtocol: Schema.Literal("HTTP", "HTTPS").pipe(
    T.HttpPath("httpProtocol"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/ases/http_protocol/{httpProtocol}",
  }),
) as unknown as Schema.Schema<GetHttpAsHttpProtocolRequest>;

export interface GetHttpAsHttpProtocolResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { clientASN: number; clientASName: string; value: string }[];
}

export const GetHttpAsHttpProtocolResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientASN: Schema.Number,
      clientASName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpAsHttpProtocolResponse>;

export const getHttpAsHttpProtocol: (
  input: GetHttpAsHttpProtocolRequest,
) => Effect.Effect<
  GetHttpAsHttpProtocolResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpAsHttpProtocolRequest,
  output: GetHttpAsHttpProtocolResponse,
  errors: [],
}));

// =============================================================================
// HttpAsIpVersion
// =============================================================================

export interface GetHttpAsIpVersionRequest {
  ipVersion: "IPv4" | "IPv6";
}

export const GetHttpAsIpVersionRequest = Schema.Struct({
  ipVersion: Schema.Literal("IPv4", "IPv6").pipe(T.HttpPath("ipVersion")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/ases/ip_version/{ipVersion}",
  }),
) as unknown as Schema.Schema<GetHttpAsIpVersionRequest>;

export interface GetHttpAsIpVersionResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { clientASN: number; clientASName: string; value: string }[];
}

export const GetHttpAsIpVersionResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientASN: Schema.Number,
      clientASName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpAsIpVersionResponse>;

export const getHttpAsIpVersion: (
  input: GetHttpAsIpVersionRequest,
) => Effect.Effect<
  GetHttpAsIpVersionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpAsIpVersionRequest,
  output: GetHttpAsIpVersionResponse,
  errors: [],
}));

// =============================================================================
// HttpAsO
// =============================================================================

export interface GetHttpAsOsRequest {
  os:
    | "WINDOWS"
    | "MACOSX"
    | "IOS"
    | "ANDROID"
    | "CHROMEOS"
    | "LINUX"
    | "SMART_TV";
}

export const GetHttpAsOsRequest = Schema.Struct({
  os: Schema.Literal(
    "WINDOWS",
    "MACOSX",
    "IOS",
    "ANDROID",
    "CHROMEOS",
    "LINUX",
    "SMART_TV",
  ).pipe(T.HttpPath("os")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/http/top/ases/os/{os}" }),
) as unknown as Schema.Schema<GetHttpAsOsRequest>;

export interface GetHttpAsOsResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { clientASN: number; clientASName: string; value: string }[];
}

export const GetHttpAsOsResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientASN: Schema.Number,
      clientASName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpAsOsResponse>;

export const getHttpAsOs: (
  input: GetHttpAsOsRequest,
) => Effect.Effect<
  GetHttpAsOsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpAsOsRequest,
  output: GetHttpAsOsResponse,
  errors: [],
}));

// =============================================================================
// HttpAsTlsVersion
// =============================================================================

export interface GetHttpAsTlsVersionRequest {
  tlsVersion: "TLSv1_0" | "TLSv1_1" | "TLSv1_2" | "TLSv1_3" | "TLSvQUIC";
}

export const GetHttpAsTlsVersionRequest = Schema.Struct({
  tlsVersion: Schema.Literal(
    "TLSv1_0",
    "TLSv1_1",
    "TLSv1_2",
    "TLSv1_3",
    "TLSvQUIC",
  ).pipe(T.HttpPath("tlsVersion")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/ases/tls_version/{tlsVersion}",
  }),
) as unknown as Schema.Schema<GetHttpAsTlsVersionRequest>;

export interface GetHttpAsTlsVersionResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { clientASN: number; clientASName: string; value: string }[];
}

export const GetHttpAsTlsVersionResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientASN: Schema.Number,
      clientASName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpAsTlsVersionResponse>;

export const getHttpAsTlsVersion: (
  input: GetHttpAsTlsVersionRequest,
) => Effect.Effect<
  GetHttpAsTlsVersionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpAsTlsVersionRequest,
  output: GetHttpAsTlsVersionResponse,
  errors: [],
}));

// =============================================================================
// HttpLocation
// =============================================================================

export interface GetHttpLocationRequest {}

export const GetHttpLocationRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/top/locations" }),
) as unknown as Schema.Schema<GetHttpLocationRequest>;

export interface GetHttpLocationResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const GetHttpLocationResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpLocationResponse>;

export const getHttpLocation: (
  input: GetHttpLocationRequest,
) => Effect.Effect<
  GetHttpLocationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpLocationRequest,
  output: GetHttpLocationResponse,
  errors: [],
}));

// =============================================================================
// HttpLocationBotClass
// =============================================================================

export interface GetHttpLocationBotClassRequest {
  botClass: "LIKELY_AUTOMATED" | "LIKELY_HUMAN";
}

export const GetHttpLocationBotClassRequest = Schema.Struct({
  botClass: Schema.Literal("LIKELY_AUTOMATED", "LIKELY_HUMAN").pipe(
    T.HttpPath("botClass"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/locations/bot_class/{botClass}",
  }),
) as unknown as Schema.Schema<GetHttpLocationBotClassRequest>;

export interface GetHttpLocationBotClassResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const GetHttpLocationBotClassResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpLocationBotClassResponse>;

export const getHttpLocationBotClass: (
  input: GetHttpLocationBotClassRequest,
) => Effect.Effect<
  GetHttpLocationBotClassResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpLocationBotClassRequest,
  output: GetHttpLocationBotClassResponse,
  errors: [],
}));

// =============================================================================
// HttpLocationBrowserFamily
// =============================================================================

export interface GetHttpLocationBrowserFamilyRequest {
  browserFamily: "CHROME" | "EDGE" | "FIREFOX" | "SAFARI";
}

export const GetHttpLocationBrowserFamilyRequest = Schema.Struct({
  browserFamily: Schema.Literal("CHROME", "EDGE", "FIREFOX", "SAFARI").pipe(
    T.HttpPath("browserFamily"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/locations/browser_family/{browserFamily}",
  }),
) as unknown as Schema.Schema<GetHttpLocationBrowserFamilyRequest>;

export interface GetHttpLocationBrowserFamilyResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const GetHttpLocationBrowserFamilyResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpLocationBrowserFamilyResponse>;

export const getHttpLocationBrowserFamily: (
  input: GetHttpLocationBrowserFamilyRequest,
) => Effect.Effect<
  GetHttpLocationBrowserFamilyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpLocationBrowserFamilyRequest,
  output: GetHttpLocationBrowserFamilyResponse,
  errors: [],
}));

// =============================================================================
// HttpLocationDeviceType
// =============================================================================

export interface GetHttpLocationDeviceTypeRequest {
  deviceType: "DESKTOP" | "MOBILE" | "OTHER";
}

export const GetHttpLocationDeviceTypeRequest = Schema.Struct({
  deviceType: Schema.Literal("DESKTOP", "MOBILE", "OTHER").pipe(
    T.HttpPath("deviceType"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/locations/device_type/{deviceType}",
  }),
) as unknown as Schema.Schema<GetHttpLocationDeviceTypeRequest>;

export interface GetHttpLocationDeviceTypeResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const GetHttpLocationDeviceTypeResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpLocationDeviceTypeResponse>;

export const getHttpLocationDeviceType: (
  input: GetHttpLocationDeviceTypeRequest,
) => Effect.Effect<
  GetHttpLocationDeviceTypeResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpLocationDeviceTypeRequest,
  output: GetHttpLocationDeviceTypeResponse,
  errors: [],
}));

// =============================================================================
// HttpLocationHttpMethod
// =============================================================================

export interface GetHttpLocationHttpMethodRequest {
  httpVersion: "HTTPv1" | "HTTPv2" | "HTTPv3";
}

export const GetHttpLocationHttpMethodRequest = Schema.Struct({
  httpVersion: Schema.Literal("HTTPv1", "HTTPv2", "HTTPv3").pipe(
    T.HttpPath("httpVersion"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/locations/http_version/{httpVersion}",
  }),
) as unknown as Schema.Schema<GetHttpLocationHttpMethodRequest>;

export interface GetHttpLocationHttpMethodResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const GetHttpLocationHttpMethodResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpLocationHttpMethodResponse>;

export const getHttpLocationHttpMethod: (
  input: GetHttpLocationHttpMethodRequest,
) => Effect.Effect<
  GetHttpLocationHttpMethodResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpLocationHttpMethodRequest,
  output: GetHttpLocationHttpMethodResponse,
  errors: [],
}));

// =============================================================================
// HttpLocationHttpProtocol
// =============================================================================

export interface GetHttpLocationHttpProtocolRequest {
  httpProtocol: "HTTP" | "HTTPS";
}

export const GetHttpLocationHttpProtocolRequest = Schema.Struct({
  httpProtocol: Schema.Literal("HTTP", "HTTPS").pipe(
    T.HttpPath("httpProtocol"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/locations/http_protocol/{httpProtocol}",
  }),
) as unknown as Schema.Schema<GetHttpLocationHttpProtocolRequest>;

export interface GetHttpLocationHttpProtocolResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const GetHttpLocationHttpProtocolResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpLocationHttpProtocolResponse>;

export const getHttpLocationHttpProtocol: (
  input: GetHttpLocationHttpProtocolRequest,
) => Effect.Effect<
  GetHttpLocationHttpProtocolResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpLocationHttpProtocolRequest,
  output: GetHttpLocationHttpProtocolResponse,
  errors: [],
}));

// =============================================================================
// HttpLocationIpVersion
// =============================================================================

export interface GetHttpLocationIpVersionRequest {
  ipVersion: "IPv4" | "IPv6";
}

export const GetHttpLocationIpVersionRequest = Schema.Struct({
  ipVersion: Schema.Literal("IPv4", "IPv6").pipe(T.HttpPath("ipVersion")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/locations/ip_version/{ipVersion}",
  }),
) as unknown as Schema.Schema<GetHttpLocationIpVersionRequest>;

export interface GetHttpLocationIpVersionResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const GetHttpLocationIpVersionResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpLocationIpVersionResponse>;

export const getHttpLocationIpVersion: (
  input: GetHttpLocationIpVersionRequest,
) => Effect.Effect<
  GetHttpLocationIpVersionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpLocationIpVersionRequest,
  output: GetHttpLocationIpVersionResponse,
  errors: [],
}));

// =============================================================================
// HttpLocationO
// =============================================================================

export interface GetHttpLocationOsRequest {
  os:
    | "WINDOWS"
    | "MACOSX"
    | "IOS"
    | "ANDROID"
    | "CHROMEOS"
    | "LINUX"
    | "SMART_TV";
}

export const GetHttpLocationOsRequest = Schema.Struct({
  os: Schema.Literal(
    "WINDOWS",
    "MACOSX",
    "IOS",
    "ANDROID",
    "CHROMEOS",
    "LINUX",
    "SMART_TV",
  ).pipe(T.HttpPath("os")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/http/top/locations/os/{os}" }),
) as unknown as Schema.Schema<GetHttpLocationOsRequest>;

export interface GetHttpLocationOsResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const GetHttpLocationOsResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpLocationOsResponse>;

export const getHttpLocationOs: (
  input: GetHttpLocationOsRequest,
) => Effect.Effect<
  GetHttpLocationOsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpLocationOsRequest,
  output: GetHttpLocationOsResponse,
  errors: [],
}));

// =============================================================================
// HttpLocationTlsVersion
// =============================================================================

export interface GetHttpLocationTlsVersionRequest {
  tlsVersion: "TLSv1_0" | "TLSv1_1" | "TLSv1_2" | "TLSv1_3" | "TLSvQUIC";
}

export const GetHttpLocationTlsVersionRequest = Schema.Struct({
  tlsVersion: Schema.Literal(
    "TLSv1_0",
    "TLSv1_1",
    "TLSv1_2",
    "TLSv1_3",
    "TLSvQUIC",
  ).pipe(T.HttpPath("tlsVersion")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/top/locations/tls_version/{tlsVersion}",
  }),
) as unknown as Schema.Schema<GetHttpLocationTlsVersionRequest>;

export interface GetHttpLocationTlsVersionResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const GetHttpLocationTlsVersionResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetHttpLocationTlsVersionResponse>;

export const getHttpLocationTlsVersion: (
  input: GetHttpLocationTlsVersionRequest,
) => Effect.Effect<
  GetHttpLocationTlsVersionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHttpLocationTlsVersionRequest,
  output: GetHttpLocationTlsVersionResponse,
  errors: [],
}));

// =============================================================================
// HttpSummary
// =============================================================================

export interface OsHttpSummaryRequest {}

export const OsHttpSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/summary/os" }),
) as unknown as Schema.Schema<OsHttpSummaryRequest>;

export interface OsHttpSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { aNDROID: string; iOS: string };
}

export const OsHttpSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    aNDROID: Schema.String.pipe(T.JsonName("ANDROID")),
    iOS: Schema.String.pipe(T.JsonName("IOS")),
  }),
}) as unknown as Schema.Schema<OsHttpSummaryResponse>;

export const osHttpSummary: (
  input: OsHttpSummaryRequest,
) => Effect.Effect<
  OsHttpSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: OsHttpSummaryRequest,
  output: OsHttpSummaryResponse,
  errors: [],
}));

// =============================================================================
// HttpTimeseriesGroup
// =============================================================================

export interface BrowserHttpTimeseriesGroupRequest {}

export const BrowserHttpTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/timeseries_groups/browser" }),
) as unknown as Schema.Schema<BrowserHttpTimeseriesGroupRequest>;

export interface BrowserHttpTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const BrowserHttpTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<BrowserHttpTimeseriesGroupResponse>;

export const browserHttpTimeseriesGroup: (
  input: BrowserHttpTimeseriesGroupRequest,
) => Effect.Effect<
  BrowserHttpTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BrowserHttpTimeseriesGroupRequest,
  output: BrowserHttpTimeseriesGroupResponse,
  errors: [],
}));

export interface OsHttpTimeseriesGroupRequest {}

export const OsHttpTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/timeseries_groups/os" }),
) as unknown as Schema.Schema<OsHttpTimeseriesGroupRequest>;

export interface OsHttpTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const OsHttpTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<OsHttpTimeseriesGroupResponse>;

export const osHttpTimeseriesGroup: (
  input: OsHttpTimeseriesGroupRequest,
) => Effect.Effect<
  OsHttpTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: OsHttpTimeseriesGroupRequest,
  output: OsHttpTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// HttpTop
// =============================================================================

export interface BrowserHttpTopRequest {}

export const BrowserHttpTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/top/browser" }),
) as unknown as Schema.Schema<BrowserHttpTopRequest>;

export interface BrowserHttpTopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: string }[];
}

export const BrowserHttpTopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<BrowserHttpTopResponse>;

export const browserHttpTop: (
  input: BrowserHttpTopRequest,
) => Effect.Effect<
  BrowserHttpTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BrowserHttpTopRequest,
  output: BrowserHttpTopResponse,
  errors: [],
}));

// =============================================================================
// LeakedCredentialSummary
// =============================================================================

export interface CompromisedLeakedCredentialSummaryRequest {}

export const CompromisedLeakedCredentialSummaryRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/leaked_credential_checks/summary/compromised",
  }),
) as unknown as Schema.Schema<CompromisedLeakedCredentialSummaryRequest>;

export interface CompromisedLeakedCredentialSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { cLEAN: string; cOMPROMISED: string };
}

export const CompromisedLeakedCredentialSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    cLEAN: Schema.String.pipe(T.JsonName("CLEAN")),
    cOMPROMISED: Schema.String.pipe(T.JsonName("COMPROMISED")),
  }),
}) as unknown as Schema.Schema<CompromisedLeakedCredentialSummaryResponse>;

export const compromisedLeakedCredentialSummary: (
  input: CompromisedLeakedCredentialSummaryRequest,
) => Effect.Effect<
  CompromisedLeakedCredentialSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CompromisedLeakedCredentialSummaryRequest,
  output: CompromisedLeakedCredentialSummaryResponse,
  errors: [],
}));

// =============================================================================
// LeakedCredentialTimeseriesGroup
// =============================================================================

export interface CompromisedLeakedCredentialTimeseriesGroupRequest {}

export const CompromisedLeakedCredentialTimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/leaked_credential_checks/timeseries_groups/compromised",
  }),
) as unknown as Schema.Schema<CompromisedLeakedCredentialTimeseriesGroupRequest>;

export interface CompromisedLeakedCredentialTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { cLEAN: string[]; cOMPROMISED: string[]; timestamps: string[] };
}

export const CompromisedLeakedCredentialTimeseriesGroupResponse = Schema.Struct(
  {
    meta: Schema.Struct({
      aggInterval: Schema.Literal(
        "FIFTEEN_MINUTES",
        "ONE_HOUR",
        "ONE_DAY",
        "ONE_WEEK",
        "ONE_MONTH",
      ),
      confidenceInfo: Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      dateRange: Schema.Array(
        Schema.Struct({
          endTime: Schema.String,
          startTime: Schema.String,
        }),
      ),
      lastUpdated: Schema.String,
      normalization: Schema.Literal(
        "PERCENTAGE",
        "MIN0_MAX",
        "MIN_MAX",
        "RAW_VALUES",
        "PERCENTAGE_CHANGE",
        "ROLLING_AVERAGE",
        "OVERLAPPED_PERCENTAGE",
        "RATIO",
      ),
      units: Schema.Array(
        Schema.Struct({
          name: Schema.String,
          value: Schema.String,
        }),
      ),
    }),
    serie_0: Schema.Struct({
      cLEAN: Schema.Array(Schema.String).pipe(T.JsonName("CLEAN")),
      cOMPROMISED: Schema.Array(Schema.String).pipe(T.JsonName("COMPROMISED")),
      timestamps: Schema.Array(Schema.String),
    }),
  },
) as unknown as Schema.Schema<CompromisedLeakedCredentialTimeseriesGroupResponse>;

export const compromisedLeakedCredentialTimeseriesGroup: (
  input: CompromisedLeakedCredentialTimeseriesGroupRequest,
) => Effect.Effect<
  CompromisedLeakedCredentialTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CompromisedLeakedCredentialTimeseriesGroupRequest,
  output: CompromisedLeakedCredentialTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// MethodAttackLayer7Summary
// =============================================================================

export interface HttpMethodAttackLayer7SummaryRequest {}

export const HttpMethodAttackLayer7SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/summary/http_method" }),
) as unknown as Schema.Schema<HttpMethodAttackLayer7SummaryRequest>;

export interface HttpMethodAttackLayer7SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const HttpMethodAttackLayer7SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<HttpMethodAttackLayer7SummaryResponse>;

export const httpMethodAttackLayer7Summary: (
  input: HttpMethodAttackLayer7SummaryRequest,
) => Effect.Effect<
  HttpMethodAttackLayer7SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: HttpMethodAttackLayer7SummaryRequest,
  output: HttpMethodAttackLayer7SummaryResponse,
  errors: [],
}));

// =============================================================================
// MethodAttackLayer7TimeseriesGroup
// =============================================================================

export interface HttpMethodAttackLayer7TimeseriesGroupRequest {}

export const HttpMethodAttackLayer7TimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer7/timeseries_groups/http_method",
  }),
) as unknown as Schema.Schema<HttpMethodAttackLayer7TimeseriesGroupRequest>;

export interface HttpMethodAttackLayer7TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const HttpMethodAttackLayer7TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<HttpMethodAttackLayer7TimeseriesGroupResponse>;

export const httpMethodAttackLayer7TimeseriesGroup: (
  input: HttpMethodAttackLayer7TimeseriesGroupRequest,
) => Effect.Effect<
  HttpMethodAttackLayer7TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: HttpMethodAttackLayer7TimeseriesGroupRequest,
  output: HttpMethodAttackLayer7TimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// Netflow
// =============================================================================

export interface SummaryNetflowRequest {}

export const SummaryNetflowRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/netflows/summary" }),
) as unknown as Schema.Schema<SummaryNetflowRequest>;

export interface SummaryNetflowResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { hTTP: string; oTHER: string };
}

export const SummaryNetflowResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    hTTP: Schema.String.pipe(T.JsonName("HTTP")),
    oTHER: Schema.String.pipe(T.JsonName("OTHER")),
  }),
}) as unknown as Schema.Schema<SummaryNetflowResponse>;

export const summaryNetflow: (
  input: SummaryNetflowRequest,
) => Effect.Effect<
  SummaryNetflowResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SummaryNetflowRequest,
  output: SummaryNetflowResponse,
  errors: [],
}));

export interface TimeseriesNetflowRequest {}

export const TimeseriesNetflowRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/netflows/timeseries" }),
) as unknown as Schema.Schema<TimeseriesNetflowRequest>;

export interface TimeseriesNetflowResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[]; values: string[] };
}

export const TimeseriesNetflowResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
    values: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TimeseriesNetflowResponse>;

export const timeseriesNetflow: (
  input: TimeseriesNetflowRequest,
) => Effect.Effect<
  TimeseriesNetflowResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TimeseriesNetflowRequest,
  output: TimeseriesNetflowResponse,
  errors: [],
}));

// =============================================================================
// NetflowTop
// =============================================================================

export interface AsesNetflowTopRequest {}

export const AsesNetflowTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/netflows/top/ases" }),
) as unknown as Schema.Schema<AsesNetflowTopRequest>;

export interface AsesNetflowTopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { clientASN: number; clientASName: string; value: string }[];
}

export const AsesNetflowTopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientASN: Schema.Number,
      clientASName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<AsesNetflowTopResponse>;

export const asesNetflowTop: (
  input: AsesNetflowTopRequest,
) => Effect.Effect<
  AsesNetflowTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: AsesNetflowTopRequest,
  output: AsesNetflowTopResponse,
  errors: [],
}));

export interface LocationsNetflowTopRequest {}

export const LocationsNetflowTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/netflows/top/locations" }),
) as unknown as Schema.Schema<LocationsNetflowTopRequest>;

export interface LocationsNetflowTopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const LocationsNetflowTopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<LocationsNetflowTopResponse>;

export const locationsNetflowTop: (
  input: LocationsNetflowTopRequest,
) => Effect.Effect<
  LocationsNetflowTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: LocationsNetflowTopRequest,
  output: LocationsNetflowTopResponse,
  errors: [],
}));

// =============================================================================
// ProductAttackLayer7Summary
// =============================================================================

export interface MitigationProductAttackLayer7SummaryRequest {}

export const MitigationProductAttackLayer7SummaryRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer7/summary/mitigation_product",
  }),
) as unknown as Schema.Schema<MitigationProductAttackLayer7SummaryRequest>;

export interface MitigationProductAttackLayer7SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const MitigationProductAttackLayer7SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<MitigationProductAttackLayer7SummaryResponse>;

export const mitigationProductAttackLayer7Summary: (
  input: MitigationProductAttackLayer7SummaryRequest,
) => Effect.Effect<
  MitigationProductAttackLayer7SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: MitigationProductAttackLayer7SummaryRequest,
  output: MitigationProductAttackLayer7SummaryResponse,
  errors: [],
}));

// =============================================================================
// ProductAttackLayer7TimeseriesGroup
// =============================================================================

export interface MitigationProductAttackLayer7TimeseriesGroupRequest {}

export const MitigationProductAttackLayer7TimeseriesGroupRequest =
  Schema.Struct({}).pipe(
    T.Http({
      method: "GET",
      path: "/radar/attacks/layer7/timeseries_groups/mitigation_product",
    }),
  ) as unknown as Schema.Schema<MitigationProductAttackLayer7TimeseriesGroupRequest>;

export interface MitigationProductAttackLayer7TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const MitigationProductAttackLayer7TimeseriesGroupResponse =
  Schema.Struct({
    meta: Schema.Struct({
      aggInterval: Schema.Literal(
        "FIFTEEN_MINUTES",
        "ONE_HOUR",
        "ONE_DAY",
        "ONE_WEEK",
        "ONE_MONTH",
      ),
      confidenceInfo: Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      dateRange: Schema.Array(
        Schema.Struct({
          endTime: Schema.String,
          startTime: Schema.String,
        }),
      ),
      lastUpdated: Schema.String,
      normalization: Schema.Literal(
        "PERCENTAGE",
        "MIN0_MAX",
        "MIN_MAX",
        "RAW_VALUES",
        "PERCENTAGE_CHANGE",
        "ROLLING_AVERAGE",
        "OVERLAPPED_PERCENTAGE",
        "RATIO",
      ),
      units: Schema.Array(
        Schema.Struct({
          name: Schema.String,
          value: Schema.String,
        }),
      ),
    }),
    serie_0: Schema.Struct({
      timestamps: Schema.Array(Schema.String),
    }),
  }) as unknown as Schema.Schema<MitigationProductAttackLayer7TimeseriesGroupResponse>;

export const mitigationProductAttackLayer7TimeseriesGroup: (
  input: MitigationProductAttackLayer7TimeseriesGroupRequest,
) => Effect.Effect<
  MitigationProductAttackLayer7TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: MitigationProductAttackLayer7TimeseriesGroupRequest,
  output: MitigationProductAttackLayer7TimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// ProtocolHttpSummary
// =============================================================================

export interface HttpProtocolHttpSummaryRequest {}

export const HttpProtocolHttpSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/summary/http_protocol" }),
) as unknown as Schema.Schema<HttpProtocolHttpSummaryRequest>;

export interface HttpProtocolHttpSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { http: string; https: string };
}

export const HttpProtocolHttpSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    http: Schema.String,
    https: Schema.String,
  }),
}) as unknown as Schema.Schema<HttpProtocolHttpSummaryResponse>;

export const httpProtocolHttpSummary: (
  input: HttpProtocolHttpSummaryRequest,
) => Effect.Effect<
  HttpProtocolHttpSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: HttpProtocolHttpSummaryRequest,
  output: HttpProtocolHttpSummaryResponse,
  errors: [],
}));

// =============================================================================
// ProtocolHttpTimeseriesGroup
// =============================================================================

export interface HttpProtocolHttpTimeseriesGroupRequest {}

export const HttpProtocolHttpTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/http/timeseries_groups/http_protocol",
  }),
) as unknown as Schema.Schema<HttpProtocolHttpTimeseriesGroupRequest>;

export interface HttpProtocolHttpTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { http: string[]; https: string[]; timestamps: string[] };
}

export const HttpProtocolHttpTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    http: Schema.Array(Schema.String),
    https: Schema.Array(Schema.String),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<HttpProtocolHttpTimeseriesGroupResponse>;

export const httpProtocolHttpTimeseriesGroup: (
  input: HttpProtocolHttpTimeseriesGroupRequest,
) => Effect.Effect<
  HttpProtocolHttpTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: HttpProtocolHttpTimeseriesGroupRequest,
  output: HttpProtocolHttpTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// QualityIqi
// =============================================================================

export interface SummaryQualityIqiRequest {
  /** Defines which metric to return (bandwidth, latency, or DNS response time). */
  metric: "BANDWIDTH" | "DNS" | "LATENCY";
  /** Filters results by Autonomous System. Specify one or more Autonomous System Numbers (ASNs) as a comma-separated list. Prefix with `-` to exclude ASNs from results. For example, `-174, 3356` excludes r */
  asn?: string[];
  /** Filters results by continent. Specify a comma-separated list of alpha-2 codes. Prefix with `-` to exclude continents from results. For example, `-EU,NA` excludes results from EU, but includes results  */
  continent?: string[];
  /** End of the date range (inclusive). */
  dateEnd?: string[];
  /** Filters results by date range. For example, use `7d` and `7dcontrol` to compare this week with the previous week. Use this parameter or set specific start and end dates (`dateStart` and `dateEnd` para */
  dateRange?: string[];
  /** Start of the date range. */
  dateStart?: string[];
  /** Format in which results will be returned. */
  format?: "JSON" | "CSV";
  /** Filters results by location. Specify a comma-separated list of alpha-2 codes. Prefix with `-` to exclude locations from results. For example, `-US,PT` excludes results from the US, but includes result */
  location?: string[];
  /** Array of names used to label the series in the response. */
  name?: string[];
}

export const SummaryQualityIqiRequest = Schema.Struct({
  metric: Schema.Literal("BANDWIDTH", "DNS", "LATENCY"),
  asn: Schema.optional(Schema.Array(Schema.String)),
  continent: Schema.optional(Schema.Array(Schema.String)),
  dateEnd: Schema.optional(Schema.Array(Schema.String)),
  dateRange: Schema.optional(Schema.Array(Schema.String)),
  dateStart: Schema.optional(Schema.Array(Schema.String)),
  format: Schema.optional(Schema.Literal("JSON", "CSV")),
  location: Schema.optional(Schema.Array(Schema.String)),
  name: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({ method: "GET", path: "/radar/quality/iqi/summary" }),
) as unknown as Schema.Schema<SummaryQualityIqiRequest>;

export interface SummaryQualityIqiResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { p25: string; p50: string; p75: string };
}

export const SummaryQualityIqiResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    p25: Schema.String,
    p50: Schema.String,
    p75: Schema.String,
  }),
}) as unknown as Schema.Schema<SummaryQualityIqiResponse>;

export const summaryQualityIqi: (
  input: SummaryQualityIqiRequest,
) => Effect.Effect<
  SummaryQualityIqiResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SummaryQualityIqiRequest,
  output: SummaryQualityIqiResponse,
  errors: [],
}));

// =============================================================================
// QualitySpeed
// =============================================================================

export interface HistogramQualitySpeedRequest {}

export const HistogramQualitySpeedRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/quality/speed/histogram" }),
) as unknown as Schema.Schema<HistogramQualitySpeedRequest>;

export interface HistogramQualitySpeedResponse {
  histogram_0: {
    bandwidthDownload: string[];
    bandwidthUpload: string[];
    bucketMin: string[];
  };
  /** Metadata for the results. */
  meta: {
    bucketSize: number;
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    totalTests: number[];
    units: { name: string; value: string }[];
  };
}

export const HistogramQualitySpeedResponse = Schema.Struct({
  histogram_0: Schema.Struct({
    bandwidthDownload: Schema.Array(Schema.String),
    bandwidthUpload: Schema.Array(Schema.String),
    bucketMin: Schema.Array(Schema.String),
  }),
  meta: Schema.Struct({
    bucketSize: Schema.Number,
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    totalTests: Schema.Array(Schema.Number),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
}) as unknown as Schema.Schema<HistogramQualitySpeedResponse>;

export const histogramQualitySpeed: (
  input: HistogramQualitySpeedRequest,
) => Effect.Effect<
  HistogramQualitySpeedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: HistogramQualitySpeedRequest,
  output: HistogramQualitySpeedResponse,
  errors: [],
}));

export interface SummaryQualitySpeedRequest {}

export const SummaryQualitySpeedRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/quality/speed/summary" }),
) as unknown as Schema.Schema<SummaryQualitySpeedRequest>;

export interface SummaryQualitySpeedResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: {
    bandwidthDownload: string;
    bandwidthUpload: string;
    jitterIdle: string;
    jitterLoaded: string;
    latencyIdle: string;
    latencyLoaded: string;
    packetLoss: string;
  };
}

export const SummaryQualitySpeedResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    bandwidthDownload: Schema.String,
    bandwidthUpload: Schema.String,
    jitterIdle: Schema.String,
    jitterLoaded: Schema.String,
    latencyIdle: Schema.String,
    latencyLoaded: Schema.String,
    packetLoss: Schema.String,
  }),
}) as unknown as Schema.Schema<SummaryQualitySpeedResponse>;

export const summaryQualitySpeed: (
  input: SummaryQualitySpeedRequest,
) => Effect.Effect<
  SummaryQualitySpeedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SummaryQualitySpeedRequest,
  output: SummaryQualitySpeedResponse,
  errors: [],
}));

// =============================================================================
// QualitySpeedTop
// =============================================================================

export interface AsesQualitySpeedTopRequest {}

export const AsesQualitySpeedTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/quality/speed/top/ases" }),
) as unknown as Schema.Schema<AsesQualitySpeedTopRequest>;

export interface AsesQualitySpeedTopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    bandwidthDownload: string;
    bandwidthUpload: string;
    clientASN: number;
    clientASName: string;
    jitterIdle: string;
    jitterLoaded: string;
    latencyIdle: string;
    latencyLoaded: string;
    numTests: number;
    rankPower: number;
  }[];
}

export const AsesQualitySpeedTopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      bandwidthDownload: Schema.String,
      bandwidthUpload: Schema.String,
      clientASN: Schema.Number,
      clientASName: Schema.String,
      jitterIdle: Schema.String,
      jitterLoaded: Schema.String,
      latencyIdle: Schema.String,
      latencyLoaded: Schema.String,
      numTests: Schema.Number,
      rankPower: Schema.Number,
    }),
  ),
}) as unknown as Schema.Schema<AsesQualitySpeedTopResponse>;

export const asesQualitySpeedTop: (
  input: AsesQualitySpeedTopRequest,
) => Effect.Effect<
  AsesQualitySpeedTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: AsesQualitySpeedTopRequest,
  output: AsesQualitySpeedTopResponse,
  errors: [],
}));

export interface LocationsQualitySpeedTopRequest {}

export const LocationsQualitySpeedTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/quality/speed/top/locations" }),
) as unknown as Schema.Schema<LocationsQualitySpeedTopRequest>;

export interface LocationsQualitySpeedTopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    bandwidthDownload: string;
    bandwidthUpload: string;
    clientCountryAlpha2: string;
    clientCountryName: string;
    jitterIdle: string;
    jitterLoaded: string;
    latencyIdle: string;
    latencyLoaded: string;
    numTests: number;
    rankPower: number;
  }[];
}

export const LocationsQualitySpeedTopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      bandwidthDownload: Schema.String,
      bandwidthUpload: Schema.String,
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      jitterIdle: Schema.String,
      jitterLoaded: Schema.String,
      latencyIdle: Schema.String,
      latencyLoaded: Schema.String,
      numTests: Schema.Number,
      rankPower: Schema.Number,
    }),
  ),
}) as unknown as Schema.Schema<LocationsQualitySpeedTopResponse>;

export const locationsQualitySpeedTop: (
  input: LocationsQualitySpeedTopRequest,
) => Effect.Effect<
  LocationsQualitySpeedTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: LocationsQualitySpeedTopRequest,
  output: LocationsQualitySpeedTopResponse,
  errors: [],
}));

// =============================================================================
// QuantumHttpSummary
// =============================================================================

export interface PostQuantumHttpSummaryRequest {}

export const PostQuantumHttpSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/summary/post_quantum" }),
) as unknown as Schema.Schema<PostQuantumHttpSummaryRequest>;

export interface PostQuantumHttpSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { nOT_SUPPORTED: string; sUPPORTED: string };
}

export const PostQuantumHttpSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    nOT_SUPPORTED: Schema.String.pipe(T.JsonName("NOT_SUPPORTED")),
    sUPPORTED: Schema.String.pipe(T.JsonName("SUPPORTED")),
  }),
}) as unknown as Schema.Schema<PostQuantumHttpSummaryResponse>;

export const postQuantumHttpSummary: (
  input: PostQuantumHttpSummaryRequest,
) => Effect.Effect<
  PostQuantumHttpSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PostQuantumHttpSummaryRequest,
  output: PostQuantumHttpSummaryResponse,
  errors: [],
}));

// =============================================================================
// QuantumHttpTimeseriesGroup
// =============================================================================

export interface PostQuantumHttpTimeseriesGroupRequest {}

export const PostQuantumHttpTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/timeseries_groups/post_quantum" }),
) as unknown as Schema.Schema<PostQuantumHttpTimeseriesGroupRequest>;

export interface PostQuantumHttpTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    nOT_SUPPORTED: string[];
    sUPPORTED: string[];
    timestamps: string[];
  };
}

export const PostQuantumHttpTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    nOT_SUPPORTED: Schema.Array(Schema.String).pipe(
      T.JsonName("NOT_SUPPORTED"),
    ),
    sUPPORTED: Schema.Array(Schema.String).pipe(T.JsonName("SUPPORTED")),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<PostQuantumHttpTimeseriesGroupResponse>;

export const postQuantumHttpTimeseriesGroup: (
  input: PostQuantumHttpTimeseriesGroupRequest,
) => Effect.Effect<
  PostQuantumHttpTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PostQuantumHttpTimeseriesGroupRequest,
  output: PostQuantumHttpTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// Ranking
// =============================================================================

export interface TopRankingRequest {}

export const TopRankingRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/ranking/top" }),
) as unknown as Schema.Schema<TopRankingRequest>;

export interface TopRankingResponse {
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    categories: { id: number; name: string; superCategoryId: number }[];
    domain: string;
    rank: number;
    pctRankChange?: number;
  }[];
}

export const TopRankingResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      categories: Schema.Array(
        Schema.Struct({
          id: Schema.Number,
          name: Schema.String,
          superCategoryId: Schema.Number,
        }),
      ),
      domain: Schema.String,
      rank: Schema.Number,
      pctRankChange: Schema.optional(Schema.Number),
    }),
  ),
}) as unknown as Schema.Schema<TopRankingResponse>;

export const topRanking: (
  input: TopRankingRequest,
) => Effect.Effect<
  TopRankingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TopRankingRequest,
  output: TopRankingResponse,
  errors: [],
}));

// =============================================================================
// RankingDomain
// =============================================================================

export interface GetRankingDomainRequest {
  domain: string;
}

export const GetRankingDomainRequest = Schema.Struct({
  domain: Schema.String.pipe(T.HttpPath("domain")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/ranking/domain/{domain}" }),
) as unknown as Schema.Schema<GetRankingDomainRequest>;

export interface GetRankingDomainResponse {
  details_0: {
    categories: { id: number; name: string; superCategoryId: number }[];
    bucket?: string;
    rank?: number;
    topLocations?: {
      locationCode: string;
      locationName: string;
      rank: number;
    }[];
  };
  meta: { dateRange: { endTime: string; startTime: string }[] };
}

export const GetRankingDomainResponse = Schema.Struct({
  details_0: Schema.Struct({
    categories: Schema.Array(
      Schema.Struct({
        id: Schema.Number,
        name: Schema.String,
        superCategoryId: Schema.Number,
      }),
    ),
    bucket: Schema.optional(Schema.String),
    rank: Schema.optional(Schema.Number),
    topLocations: Schema.optional(
      Schema.Array(
        Schema.Struct({
          locationCode: Schema.String,
          locationName: Schema.String,
          rank: Schema.Number,
        }),
      ),
    ).pipe(T.JsonName("top_locations")),
  }),
  meta: Schema.Struct({
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
  }),
}) as unknown as Schema.Schema<GetRankingDomainResponse>;

export const getRankingDomain: (
  input: GetRankingDomainRequest,
) => Effect.Effect<
  GetRankingDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRankingDomainRequest,
  output: GetRankingDomainResponse,
  errors: [],
}));

// =============================================================================
// RankingInternetService
// =============================================================================

export interface CategoriesRankingInternetServiceRequest {}

export const CategoriesRankingInternetServiceRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/ranking/internet_services/categories",
  }),
) as unknown as Schema.Schema<CategoriesRankingInternetServiceRequest>;

export interface CategoriesRankingInternetServiceResponse {
  categories_0: { name: string }[];
}

export const CategoriesRankingInternetServiceResponse = Schema.Struct({
  categories_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<CategoriesRankingInternetServiceResponse>;

export const categoriesRankingInternetService: (
  input: CategoriesRankingInternetServiceRequest,
) => Effect.Effect<
  CategoriesRankingInternetServiceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CategoriesRankingInternetServiceRequest,
  output: CategoriesRankingInternetServiceResponse,
  errors: [],
}));

export interface TopRankingInternetServiceRequest {}

export const TopRankingInternetServiceRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/ranking/internet_services/top" }),
) as unknown as Schema.Schema<TopRankingInternetServiceRequest>;

export interface TopRankingInternetServiceResponse {
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { rank: number; service: string }[];
}

export const TopRankingInternetServiceResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      rank: Schema.Number,
      service: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<TopRankingInternetServiceResponse>;

export const topRankingInternetService: (
  input: TopRankingInternetServiceRequest,
) => Effect.Effect<
  TopRankingInternetServiceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TopRankingInternetServiceRequest,
  output: TopRankingInternetServiceResponse,
  errors: [],
}));

// =============================================================================
// RobotsTxtTopUserAgent
// =============================================================================

export interface DirectiveRobotsTxtTopUserAgentRequest {}

export const DirectiveRobotsTxtTopUserAgentRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/robots_txt/top/user_agents/directive",
  }),
) as unknown as Schema.Schema<DirectiveRobotsTxtTopUserAgentRequest>;

export interface DirectiveRobotsTxtTopUserAgentResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { name: string; value: number; fully?: number; partially?: number }[];
}

export const DirectiveRobotsTxtTopUserAgentResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.Number,
      fully: Schema.optional(Schema.Number),
      partially: Schema.optional(Schema.Number),
    }),
  ),
}) as unknown as Schema.Schema<DirectiveRobotsTxtTopUserAgentResponse>;

export const directiveRobotsTxtTopUserAgent: (
  input: DirectiveRobotsTxtTopUserAgentRequest,
) => Effect.Effect<
  DirectiveRobotsTxtTopUserAgentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DirectiveRobotsTxtTopUserAgentRequest,
  output: DirectiveRobotsTxtTopUserAgentResponse,
  errors: [],
}));

// =============================================================================
// RulesAttackLayer7Summary
// =============================================================================

export interface ManagedRulesAttackLayer7SummaryRequest {}

export const ManagedRulesAttackLayer7SummaryRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer7/summary/managed_rules",
  }),
) as unknown as Schema.Schema<ManagedRulesAttackLayer7SummaryRequest>;

export interface ManagedRulesAttackLayer7SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const ManagedRulesAttackLayer7SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<ManagedRulesAttackLayer7SummaryResponse>;

export const managedRulesAttackLayer7Summary: (
  input: ManagedRulesAttackLayer7SummaryRequest,
) => Effect.Effect<
  ManagedRulesAttackLayer7SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ManagedRulesAttackLayer7SummaryRequest,
  output: ManagedRulesAttackLayer7SummaryResponse,
  errors: [],
}));

// =============================================================================
// RulesAttackLayer7TimeseriesGroup
// =============================================================================

export interface ManagedRulesAttackLayer7TimeseriesGroupRequest {}

export const ManagedRulesAttackLayer7TimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer7/timeseries_groups/managed_rules",
  }),
) as unknown as Schema.Schema<ManagedRulesAttackLayer7TimeseriesGroupRequest>;

export interface ManagedRulesAttackLayer7TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const ManagedRulesAttackLayer7TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<ManagedRulesAttackLayer7TimeseriesGroupResponse>;

export const managedRulesAttackLayer7TimeseriesGroup: (
  input: ManagedRulesAttackLayer7TimeseriesGroupRequest,
) => Effect.Effect<
  ManagedRulesAttackLayer7TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ManagedRulesAttackLayer7TimeseriesGroupRequest,
  output: ManagedRulesAttackLayer7TimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// Search
// =============================================================================

export interface GlobalSearchRequest {
  /** String used to perform the search operation. */
  query: string;
  /** Search types excluded from results. */
  exclude?: (
    | "ADM1S"
    | "ASNS"
    | "BOTS"
    | "CERTIFICATE_AUTHORITIES"
    | "CERTIFICATE_LOGS"
    | "INDUSTRIES"
    | "LOCATIONS"
    | "NOTEBOOKS"
    | "TLDS"
    | "VERTICALS"
  )[];
  /** Format in which results will be returned. */
  format?: "JSON" | "CSV";
  /** Search types included in results. */
  include?: (
    | "ADM1S"
    | "ASNS"
    | "BOTS"
    | "CERTIFICATE_AUTHORITIES"
    | "CERTIFICATE_LOGS"
    | "INDUSTRIES"
    | "LOCATIONS"
    | "NOTEBOOKS"
    | "TLDS"
    | "VERTICALS"
  )[];
  /** Limits the number of objects returned in the response. */
  limit?: number;
  /** Limits the number of objects per search category. */
  limitPerGroup?: number;
}

export const GlobalSearchRequest = Schema.Struct({
  query: Schema.String,
  exclude: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "ADM1S",
        "ASNS",
        "BOTS",
        "CERTIFICATE_AUTHORITIES",
        "CERTIFICATE_LOGS",
        "INDUSTRIES",
        "LOCATIONS",
        "NOTEBOOKS",
        "TLDS",
        "VERTICALS",
      ),
    ),
  ),
  format: Schema.optional(Schema.Literal("JSON", "CSV")),
  include: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "ADM1S",
        "ASNS",
        "BOTS",
        "CERTIFICATE_AUTHORITIES",
        "CERTIFICATE_LOGS",
        "INDUSTRIES",
        "LOCATIONS",
        "NOTEBOOKS",
        "TLDS",
        "VERTICALS",
      ),
    ),
  ),
  limit: Schema.optional(Schema.Number),
  limitPerGroup: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "GET", path: "/radar/search/global" }),
) as unknown as Schema.Schema<GlobalSearchRequest>;

export interface GlobalSearchResponse {
  search: { code: string; name: string; type: string }[];
}

export const GlobalSearchResponse = Schema.Struct({
  search: Schema.Array(
    Schema.Struct({
      code: Schema.String,
      name: Schema.String,
      type: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GlobalSearchResponse>;

export const globalSearch: (
  input: GlobalSearchRequest,
) => Effect.Effect<
  GlobalSearchResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GlobalSearchRequest,
  output: GlobalSearchResponse,
  errors: [],
}));

// =============================================================================
// SetEntityAsn
// =============================================================================

export interface AsSetEntityAsnRequest {
  asn: number;
}

export const AsSetEntityAsnRequest = Schema.Struct({
  asn: Schema.Number.pipe(T.HttpPath("asn")),
}).pipe(
  T.Http({ method: "GET", path: "/radar/entities/asns/{asn}/as_set" }),
) as unknown as Schema.Schema<AsSetEntityAsnRequest>;

export interface AsSetEntityAsnResponse {
  asSets: {
    asMembersCount: number;
    asSetMembersCount: number;
    asSetUpstreamsCount: number;
    asnConeSize: number;
    irrSources: string[];
    name: string;
    asn?: number;
  }[];
  /** Paths from the AS-SET that include the given AS to its upstreams recursively */
  paths: string[][];
}

export const AsSetEntityAsnResponse = Schema.Struct({
  asSets: Schema.Array(
    Schema.Struct({
      asMembersCount: Schema.Number.pipe(T.JsonName("as_members_count")),
      asSetMembersCount: Schema.Number.pipe(T.JsonName("as_set_members_count")),
      asSetUpstreamsCount: Schema.Number.pipe(
        T.JsonName("as_set_upstreams_count"),
      ),
      asnConeSize: Schema.Number.pipe(T.JsonName("asn_cone_size")),
      irrSources: Schema.Array(Schema.String).pipe(T.JsonName("irr_sources")),
      name: Schema.String,
      asn: Schema.optional(Schema.Number),
    }),
  ).pipe(T.JsonName("as_sets")),
  paths: Schema.Array(Schema.Array(Schema.String)),
}) as unknown as Schema.Schema<AsSetEntityAsnResponse>;

export const asSetEntityAsn: (
  input: AsSetEntityAsnRequest,
) => Effect.Effect<
  AsSetEntityAsnResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: AsSetEntityAsnRequest,
  output: AsSetEntityAsnResponse,
  errors: [],
}));

// =============================================================================
// TcpResetsTimeout
// =============================================================================

export interface SummaryTcpResetsTimeoutRequest {}

export const SummaryTcpResetsTimeoutRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/tcp_resets_timeouts/summary" }),
) as unknown as Schema.Schema<SummaryTcpResetsTimeoutRequest>;

export interface SummaryTcpResetsTimeoutResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: {
    laterInFlow: string;
    noMatch: string;
    postAck: string;
    postPsh: string;
    postSyn: string;
  };
}

export const SummaryTcpResetsTimeoutResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    laterInFlow: Schema.String.pipe(T.JsonName("later_in_flow")),
    noMatch: Schema.String.pipe(T.JsonName("no_match")),
    postAck: Schema.String.pipe(T.JsonName("post_ack")),
    postPsh: Schema.String.pipe(T.JsonName("post_psh")),
    postSyn: Schema.String.pipe(T.JsonName("post_syn")),
  }),
}) as unknown as Schema.Schema<SummaryTcpResetsTimeoutResponse>;

export const summaryTcpResetsTimeout: (
  input: SummaryTcpResetsTimeoutRequest,
) => Effect.Effect<
  SummaryTcpResetsTimeoutResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SummaryTcpResetsTimeoutRequest,
  output: SummaryTcpResetsTimeoutResponse,
  errors: [],
}));

// =============================================================================
// TrafficAnomaly
// =============================================================================

export interface GetTrafficAnomalyRequest {}

export const GetTrafficAnomalyRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/traffic_anomalies" }),
) as unknown as Schema.Schema<GetTrafficAnomalyRequest>;

export interface GetTrafficAnomalyResponse {
  trafficAnomalies: {
    startDate: string;
    status: string;
    type: string;
    uuid: string;
    asnDetails?: {
      asn: string;
      name: string;
      locations?: { code: string; name: string };
    };
    endDate?: string;
    locationDetails?: { code: string; name: string };
    visibleInDataSources?: string[];
  }[];
}

export const GetTrafficAnomalyResponse = Schema.Struct({
  trafficAnomalies: Schema.Array(
    Schema.Struct({
      startDate: Schema.String,
      status: Schema.String,
      type: Schema.String,
      uuid: Schema.String,
      asnDetails: Schema.optional(
        Schema.Struct({
          asn: Schema.String,
          name: Schema.String,
          locations: Schema.optional(
            Schema.Struct({
              code: Schema.String,
              name: Schema.String,
            }),
          ),
        }),
      ),
      endDate: Schema.optional(Schema.String),
      locationDetails: Schema.optional(
        Schema.Struct({
          code: Schema.String,
          name: Schema.String,
        }),
      ),
      visibleInDataSources: Schema.optional(Schema.Array(Schema.String)),
    }),
  ),
}) as unknown as Schema.Schema<GetTrafficAnomalyResponse>;

export const getTrafficAnomaly: (
  input: GetTrafficAnomalyRequest,
) => Effect.Effect<
  GetTrafficAnomalyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetTrafficAnomalyRequest,
  output: GetTrafficAnomalyResponse,
  errors: [],
}));

// =============================================================================
// TrafficAnomalyLocation
// =============================================================================

export interface GetTrafficAnomalyLocationRequest {}

export const GetTrafficAnomalyLocationRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/traffic_anomalies/locations" }),
) as unknown as Schema.Schema<GetTrafficAnomalyLocationRequest>;

export interface GetTrafficAnomalyLocationResponse {
  trafficAnomalies: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const GetTrafficAnomalyLocationResponse = Schema.Struct({
  trafficAnomalies: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<GetTrafficAnomalyLocationResponse>;

export const getTrafficAnomalyLocation: (
  input: GetTrafficAnomalyLocationRequest,
) => Effect.Effect<
  GetTrafficAnomalyLocationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetTrafficAnomalyLocationRequest,
  output: GetTrafficAnomalyLocationResponse,
  errors: [],
}));

// =============================================================================
// TTLDnsSummary
// =============================================================================

export interface ResponseTTLDnsSummaryRequest {}

export const ResponseTTLDnsSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/summary/response_ttl" }),
) as unknown as Schema.Schema<ResponseTTLDnsSummaryRequest>;

export interface ResponseTTLDnsSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: {
    gt_15mLte_1h: string;
    gt_1dLte_1w: string;
    gt_1hLte_1d: string;
    gt_1mLte_5m: string;
    gt_1w: string;
    gt_5mLte_15m: string;
    lte_1m: string;
  };
}

export const ResponseTTLDnsSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    gt_15mLte_1h: Schema.String.pipe(T.JsonName("gt_15m_lte_1h")),
    gt_1dLte_1w: Schema.String.pipe(T.JsonName("gt_1d_lte_1w")),
    gt_1hLte_1d: Schema.String.pipe(T.JsonName("gt_1h_lte_1d")),
    gt_1mLte_5m: Schema.String.pipe(T.JsonName("gt_1m_lte_5m")),
    gt_1w: Schema.String,
    gt_5mLte_15m: Schema.String.pipe(T.JsonName("gt_5m_lte_15m")),
    lte_1m: Schema.String,
  }),
}) as unknown as Schema.Schema<ResponseTTLDnsSummaryResponse>;

export const responseTTLDnsSummary: (
  input: ResponseTTLDnsSummaryRequest,
) => Effect.Effect<
  ResponseTTLDnsSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ResponseTTLDnsSummaryRequest,
  output: ResponseTTLDnsSummaryResponse,
  errors: [],
}));

// =============================================================================
// TTLDnsTimeseriesGroup
// =============================================================================

export interface ResponseTTLDnsTimeseriesGroupRequest {}

export const ResponseTTLDnsTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/timeseries_groups/response_ttl" }),
) as unknown as Schema.Schema<ResponseTTLDnsTimeseriesGroupRequest>;

export interface ResponseTTLDnsTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    gt_15mLte_1h: string[];
    gt_1dLte_1w: string[];
    gt_1hLte_1d: string[];
    gt_1mLte_5m: string[];
    gt_1w: string[];
    gt_5mLte_15m: string[];
    lte_1m: string[];
  };
}

export const ResponseTTLDnsTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    gt_15mLte_1h: Schema.Array(Schema.String).pipe(T.JsonName("gt_15m_lte_1h")),
    gt_1dLte_1w: Schema.Array(Schema.String).pipe(T.JsonName("gt_1d_lte_1w")),
    gt_1hLte_1d: Schema.Array(Schema.String).pipe(T.JsonName("gt_1h_lte_1d")),
    gt_1mLte_5m: Schema.Array(Schema.String).pipe(T.JsonName("gt_1m_lte_5m")),
    gt_1w: Schema.Array(Schema.String),
    gt_5mLte_15m: Schema.Array(Schema.String).pipe(T.JsonName("gt_5m_lte_15m")),
    lte_1m: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<ResponseTTLDnsTimeseriesGroupResponse>;

export const responseTTLDnsTimeseriesGroup: (
  input: ResponseTTLDnsTimeseriesGroupRequest,
) => Effect.Effect<
  ResponseTTLDnsTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ResponseTTLDnsTimeseriesGroupRequest,
  output: ResponseTTLDnsTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// TypeAs112Summary
// =============================================================================

export interface QueryTypeAs112SummaryRequest {}

export const QueryTypeAs112SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/summary/query_type" }),
) as unknown as Schema.Schema<QueryTypeAs112SummaryRequest>;

export interface QueryTypeAs112SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const QueryTypeAs112SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<QueryTypeAs112SummaryResponse>;

export const queryTypeAs112Summary: (
  input: QueryTypeAs112SummaryRequest,
) => Effect.Effect<
  QueryTypeAs112SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: QueryTypeAs112SummaryRequest,
  output: QueryTypeAs112SummaryResponse,
  errors: [],
}));

// =============================================================================
// TypeAs112TimeseriesGroup
// =============================================================================

export interface QueryTypeAs112TimeseriesGroupRequest {}

export const QueryTypeAs112TimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/timeseries_groups/query_type" }),
) as unknown as Schema.Schema<QueryTypeAs112TimeseriesGroupRequest>;

export interface QueryTypeAs112TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const QueryTypeAs112TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<QueryTypeAs112TimeseriesGroupResponse>;

export const queryTypeAs112TimeseriesGroup: (
  input: QueryTypeAs112TimeseriesGroupRequest,
) => Effect.Effect<
  QueryTypeAs112TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: QueryTypeAs112TimeseriesGroupRequest,
  output: QueryTypeAs112TimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// TypeDnsSummary
// =============================================================================

export interface QueryTypeDnsSummaryRequest {}

export const QueryTypeDnsSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/summary/query_type" }),
) as unknown as Schema.Schema<QueryTypeDnsSummaryRequest>;

export interface QueryTypeDnsSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: Record<string, unknown>;
}

export const QueryTypeDnsSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({}),
}) as unknown as Schema.Schema<QueryTypeDnsSummaryResponse>;

export const queryTypeDnsSummary: (
  input: QueryTypeDnsSummaryRequest,
) => Effect.Effect<
  QueryTypeDnsSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: QueryTypeDnsSummaryRequest,
  output: QueryTypeDnsSummaryResponse,
  errors: [],
}));

// =============================================================================
// TypeDnsTimeseriesGroup
// =============================================================================

export interface QueryTypeDnsTimeseriesGroupRequest {}

export const QueryTypeDnsTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/timeseries_groups/query_type" }),
) as unknown as Schema.Schema<QueryTypeDnsTimeseriesGroupRequest>;

export interface QueryTypeDnsTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { timestamps: string[] };
}

export const QueryTypeDnsTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<QueryTypeDnsTimeseriesGroupResponse>;

export const queryTypeDnsTimeseriesGroup: (
  input: QueryTypeDnsTimeseriesGroupRequest,
) => Effect.Effect<
  QueryTypeDnsTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: QueryTypeDnsTimeseriesGroupRequest,
  output: QueryTypeDnsTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// TypeHttpSummary
// =============================================================================

export interface DeviceTypeHttpSummaryRequest {}

export const DeviceTypeHttpSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/summary/device_type" }),
) as unknown as Schema.Schema<DeviceTypeHttpSummaryRequest>;

export interface DeviceTypeHttpSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { desktop: string; mobile: string; other: string };
}

export const DeviceTypeHttpSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    desktop: Schema.String,
    mobile: Schema.String,
    other: Schema.String,
  }),
}) as unknown as Schema.Schema<DeviceTypeHttpSummaryResponse>;

export const deviceTypeHttpSummary: (
  input: DeviceTypeHttpSummaryRequest,
) => Effect.Effect<
  DeviceTypeHttpSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeviceTypeHttpSummaryRequest,
  output: DeviceTypeHttpSummaryResponse,
  errors: [],
}));

// =============================================================================
// TypeHttpTimeseriesGroup
// =============================================================================

export interface DeviceTypeHttpTimeseriesGroupRequest {}

export const DeviceTypeHttpTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/timeseries_groups/device_type" }),
) as unknown as Schema.Schema<DeviceTypeHttpTimeseriesGroupRequest>;

export interface DeviceTypeHttpTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    desktop: string[];
    mobile: string[];
    other: string[];
    timestamps: string[];
  };
}

export const DeviceTypeHttpTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    desktop: Schema.Array(Schema.String),
    mobile: Schema.Array(Schema.String),
    other: Schema.Array(Schema.String),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<DeviceTypeHttpTimeseriesGroupResponse>;

export const deviceTypeHttpTimeseriesGroup: (
  input: DeviceTypeHttpTimeseriesGroupRequest,
) => Effect.Effect<
  DeviceTypeHttpTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeviceTypeHttpTimeseriesGroupRequest,
  output: DeviceTypeHttpTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// VerifiedBotTop
// =============================================================================

export interface BotsVerifiedBotTopRequest {}

export const BotsVerifiedBotTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/verified_bots/top/bots" }),
) as unknown as Schema.Schema<BotsVerifiedBotTopRequest>;

export interface BotsVerifiedBotTopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    botCategory: string;
    botName: string;
    botOwner: string;
    value: string;
  }[];
}

export const BotsVerifiedBotTopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      botCategory: Schema.String,
      botName: Schema.String,
      botOwner: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<BotsVerifiedBotTopResponse>;

export const botsVerifiedBotTop: (
  input: BotsVerifiedBotTopRequest,
) => Effect.Effect<
  BotsVerifiedBotTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BotsVerifiedBotTopRequest,
  output: BotsVerifiedBotTopResponse,
  errors: [],
}));

export interface CategoriesVerifiedBotTopRequest {}

export const CategoriesVerifiedBotTopRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/verified_bots/top/categories" }),
) as unknown as Schema.Schema<CategoriesVerifiedBotTopRequest>;

export interface CategoriesVerifiedBotTopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: { botCategory: string; value: string }[];
}

export const CategoriesVerifiedBotTopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      botCategory: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<CategoriesVerifiedBotTopResponse>;

export const categoriesVerifiedBotTop: (
  input: CategoriesVerifiedBotTopRequest,
) => Effect.Effect<
  CategoriesVerifiedBotTopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CategoriesVerifiedBotTopRequest,
  output: CategoriesVerifiedBotTopResponse,
  errors: [],
}));

// =============================================================================
// VersionAs112Summary
// =============================================================================

export interface IpVersionAs112SummaryRequest {}

export const IpVersionAs112SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/summary/ip_version" }),
) as unknown as Schema.Schema<IpVersionAs112SummaryRequest>;

export interface IpVersionAs112SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { iPv4: string; iPv6: string };
}

export const IpVersionAs112SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    iPv4: Schema.String.pipe(T.JsonName("IPv4")),
    iPv6: Schema.String.pipe(T.JsonName("IPv6")),
  }),
}) as unknown as Schema.Schema<IpVersionAs112SummaryResponse>;

export const ipVersionAs112Summary: (
  input: IpVersionAs112SummaryRequest,
) => Effect.Effect<
  IpVersionAs112SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionAs112SummaryRequest,
  output: IpVersionAs112SummaryResponse,
  errors: [],
}));

// =============================================================================
// VersionAs112TimeseriesGroup
// =============================================================================

export interface IpVersionAs112TimeseriesGroupRequest {}

export const IpVersionAs112TimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/as112/timeseries_groups/ip_version" }),
) as unknown as Schema.Schema<IpVersionAs112TimeseriesGroupRequest>;

export interface IpVersionAs112TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { iPv4: string[]; iPv6: string[] };
}

export const IpVersionAs112TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    iPv4: Schema.Array(Schema.String).pipe(T.JsonName("IPv4")),
    iPv6: Schema.Array(Schema.String).pipe(T.JsonName("IPv6")),
  }),
}) as unknown as Schema.Schema<IpVersionAs112TimeseriesGroupResponse>;

export const ipVersionAs112TimeseriesGroup: (
  input: IpVersionAs112TimeseriesGroupRequest,
) => Effect.Effect<
  IpVersionAs112TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionAs112TimeseriesGroupRequest,
  output: IpVersionAs112TimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// VersionAs112Top
// =============================================================================

export interface IpVersionAs112TopRequest {
  ipVersion: "IPv4" | "IPv6";
}

export const IpVersionAs112TopRequest = Schema.Struct({
  ipVersion: Schema.Literal("IPv4", "IPv6").pipe(T.HttpPath("ipVersion")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/radar/as112/top/locations/ip_version/{ipVersion}",
  }),
) as unknown as Schema.Schema<IpVersionAs112TopRequest>;

export interface IpVersionAs112TopResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    } | null;
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  top_0: {
    clientCountryAlpha2: string;
    clientCountryName: string;
    value: string;
  }[];
}

export const IpVersionAs112TopResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Union(
      Schema.Struct({
        annotations: Schema.Array(
          Schema.Struct({
            dataSource: Schema.String,
            description: Schema.String,
            endDate: Schema.String,
            eventType: Schema.String,
            isInstantaneous: Schema.Boolean,
            linkedUrl: Schema.String,
            startDate: Schema.String,
          }),
        ),
        level: Schema.Number,
      }),
      Schema.Null,
    ),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  top_0: Schema.Array(
    Schema.Struct({
      clientCountryAlpha2: Schema.String,
      clientCountryName: Schema.String,
      value: Schema.String,
    }),
  ),
}) as unknown as Schema.Schema<IpVersionAs112TopResponse>;

export const ipVersionAs112Top: (
  input: IpVersionAs112TopRequest,
) => Effect.Effect<
  IpVersionAs112TopResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionAs112TopRequest,
  output: IpVersionAs112TopResponse,
  errors: [],
}));

// =============================================================================
// VersionAttackLayer3Summary
// =============================================================================

export interface IpVersionAttackLayer3SummaryRequest {}

export const IpVersionAttackLayer3SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer3/summary/ip_version" }),
) as unknown as Schema.Schema<IpVersionAttackLayer3SummaryRequest>;

export interface IpVersionAttackLayer3SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { iPv4: string; iPv6: string };
}

export const IpVersionAttackLayer3SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    iPv4: Schema.String.pipe(T.JsonName("IPv4")),
    iPv6: Schema.String.pipe(T.JsonName("IPv6")),
  }),
}) as unknown as Schema.Schema<IpVersionAttackLayer3SummaryResponse>;

export const ipVersionAttackLayer3Summary: (
  input: IpVersionAttackLayer3SummaryRequest,
) => Effect.Effect<
  IpVersionAttackLayer3SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionAttackLayer3SummaryRequest,
  output: IpVersionAttackLayer3SummaryResponse,
  errors: [],
}));

// =============================================================================
// VersionAttackLayer3TimeseriesGroup
// =============================================================================

export interface IpVersionAttackLayer3TimeseriesGroupRequest {}

export const IpVersionAttackLayer3TimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer3/timeseries_groups/ip_version",
  }),
) as unknown as Schema.Schema<IpVersionAttackLayer3TimeseriesGroupRequest>;

export interface IpVersionAttackLayer3TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { iPv4: string[]; iPv6: string[]; timestamps: string[] };
}

export const IpVersionAttackLayer3TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    iPv4: Schema.Array(Schema.String).pipe(T.JsonName("IPv4")),
    iPv6: Schema.Array(Schema.String).pipe(T.JsonName("IPv6")),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<IpVersionAttackLayer3TimeseriesGroupResponse>;

export const ipVersionAttackLayer3TimeseriesGroup: (
  input: IpVersionAttackLayer3TimeseriesGroupRequest,
) => Effect.Effect<
  IpVersionAttackLayer3TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionAttackLayer3TimeseriesGroupRequest,
  output: IpVersionAttackLayer3TimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// VersionAttackLayer7Summary
// =============================================================================

export interface HttpVersionAttackLayer7SummaryRequest {}

export const HttpVersionAttackLayer7SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/summary/http_version" }),
) as unknown as Schema.Schema<HttpVersionAttackLayer7SummaryRequest>;

export interface HttpVersionAttackLayer7SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { "HTTP/1.x": string; "HTTP/2": string; "HTTP/3": string };
}

export const HttpVersionAttackLayer7SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    "HTTP/1.x": Schema.String,
    "HTTP/2": Schema.String,
    "HTTP/3": Schema.String,
  }),
}) as unknown as Schema.Schema<HttpVersionAttackLayer7SummaryResponse>;

export const httpVersionAttackLayer7Summary: (
  input: HttpVersionAttackLayer7SummaryRequest,
) => Effect.Effect<
  HttpVersionAttackLayer7SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: HttpVersionAttackLayer7SummaryRequest,
  output: HttpVersionAttackLayer7SummaryResponse,
  errors: [],
}));

export interface IpVersionAttackLayer7SummaryRequest {}

export const IpVersionAttackLayer7SummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/attacks/layer7/summary/ip_version" }),
) as unknown as Schema.Schema<IpVersionAttackLayer7SummaryRequest>;

export interface IpVersionAttackLayer7SummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { iPv4: string; iPv6: string };
}

export const IpVersionAttackLayer7SummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    iPv4: Schema.String.pipe(T.JsonName("IPv4")),
    iPv6: Schema.String.pipe(T.JsonName("IPv6")),
  }),
}) as unknown as Schema.Schema<IpVersionAttackLayer7SummaryResponse>;

export const ipVersionAttackLayer7Summary: (
  input: IpVersionAttackLayer7SummaryRequest,
) => Effect.Effect<
  IpVersionAttackLayer7SummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionAttackLayer7SummaryRequest,
  output: IpVersionAttackLayer7SummaryResponse,
  errors: [],
}));

// =============================================================================
// VersionAttackLayer7TimeseriesGroup
// =============================================================================

export interface HttpVersionAttackLayer7TimeseriesGroupRequest {}

export const HttpVersionAttackLayer7TimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer7/timeseries_groups/http_version",
  }),
) as unknown as Schema.Schema<HttpVersionAttackLayer7TimeseriesGroupRequest>;

export interface HttpVersionAttackLayer7TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    "HTTP/1.x": string[];
    "HTTP/2": string[];
    "HTTP/3": string[];
    timestamps: string[];
  };
}

export const HttpVersionAttackLayer7TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    "HTTP/1.x": Schema.Array(Schema.String),
    "HTTP/2": Schema.Array(Schema.String),
    "HTTP/3": Schema.Array(Schema.String),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<HttpVersionAttackLayer7TimeseriesGroupResponse>;

export const httpVersionAttackLayer7TimeseriesGroup: (
  input: HttpVersionAttackLayer7TimeseriesGroupRequest,
) => Effect.Effect<
  HttpVersionAttackLayer7TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: HttpVersionAttackLayer7TimeseriesGroupRequest,
  output: HttpVersionAttackLayer7TimeseriesGroupResponse,
  errors: [],
}));

export interface IpVersionAttackLayer7TimeseriesGroupRequest {}

export const IpVersionAttackLayer7TimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/attacks/layer7/timeseries_groups/ip_version",
  }),
) as unknown as Schema.Schema<IpVersionAttackLayer7TimeseriesGroupRequest>;

export interface IpVersionAttackLayer7TimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { iPv4: string[]; iPv6: string[]; timestamps: string[] };
}

export const IpVersionAttackLayer7TimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    iPv4: Schema.Array(Schema.String).pipe(T.JsonName("IPv4")),
    iPv6: Schema.Array(Schema.String).pipe(T.JsonName("IPv6")),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<IpVersionAttackLayer7TimeseriesGroupResponse>;

export const ipVersionAttackLayer7TimeseriesGroup: (
  input: IpVersionAttackLayer7TimeseriesGroupRequest,
) => Effect.Effect<
  IpVersionAttackLayer7TimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionAttackLayer7TimeseriesGroupRequest,
  output: IpVersionAttackLayer7TimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// VersionDnsSummary
// =============================================================================

export interface IpVersionDnsSummaryRequest {}

export const IpVersionDnsSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/summary/ip_version" }),
) as unknown as Schema.Schema<IpVersionDnsSummaryRequest>;

export interface IpVersionDnsSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { iPv4: string; iPv6: string };
}

export const IpVersionDnsSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    iPv4: Schema.String.pipe(T.JsonName("IPv4")),
    iPv6: Schema.String.pipe(T.JsonName("IPv6")),
  }),
}) as unknown as Schema.Schema<IpVersionDnsSummaryResponse>;

export const ipVersionDnsSummary: (
  input: IpVersionDnsSummaryRequest,
) => Effect.Effect<
  IpVersionDnsSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionDnsSummaryRequest,
  output: IpVersionDnsSummaryResponse,
  errors: [],
}));

// =============================================================================
// VersionDnsTimeseriesGroup
// =============================================================================

export interface IpVersionDnsTimeseriesGroupRequest {}

export const IpVersionDnsTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/dns/timeseries_groups/ip_version" }),
) as unknown as Schema.Schema<IpVersionDnsTimeseriesGroupRequest>;

export interface IpVersionDnsTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { iPv4: string[]; iPv6: string[] };
}

export const IpVersionDnsTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    iPv4: Schema.Array(Schema.String).pipe(T.JsonName("IPv4")),
    iPv6: Schema.Array(Schema.String).pipe(T.JsonName("IPv6")),
  }),
}) as unknown as Schema.Schema<IpVersionDnsTimeseriesGroupResponse>;

export const ipVersionDnsTimeseriesGroup: (
  input: IpVersionDnsTimeseriesGroupRequest,
) => Effect.Effect<
  IpVersionDnsTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionDnsTimeseriesGroupRequest,
  output: IpVersionDnsTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// VersionEmailRoutingSummary
// =============================================================================

export interface IpVersionEmailRoutingSummaryRequest {}

export const IpVersionEmailRoutingSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/routing/summary/ip_version" }),
) as unknown as Schema.Schema<IpVersionEmailRoutingSummaryRequest>;

export interface IpVersionEmailRoutingSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { iPv4: string; iPv6: string };
}

export const IpVersionEmailRoutingSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    iPv4: Schema.String.pipe(T.JsonName("IPv4")),
    iPv6: Schema.String.pipe(T.JsonName("IPv6")),
  }),
}) as unknown as Schema.Schema<IpVersionEmailRoutingSummaryResponse>;

export const ipVersionEmailRoutingSummary: (
  input: IpVersionEmailRoutingSummaryRequest,
) => Effect.Effect<
  IpVersionEmailRoutingSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionEmailRoutingSummaryRequest,
  output: IpVersionEmailRoutingSummaryResponse,
  errors: [],
}));

// =============================================================================
// VersionEmailRoutingTimeseriesGroup
// =============================================================================

export interface IpVersionEmailRoutingTimeseriesGroupRequest {}

export const IpVersionEmailRoutingTimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/routing/timeseries_groups/ip_version",
  }),
) as unknown as Schema.Schema<IpVersionEmailRoutingTimeseriesGroupRequest>;

export interface IpVersionEmailRoutingTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { iPv4: string[]; iPv6: string[] };
}

export const IpVersionEmailRoutingTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    iPv4: Schema.Array(Schema.String).pipe(T.JsonName("IPv4")),
    iPv6: Schema.Array(Schema.String).pipe(T.JsonName("IPv6")),
  }),
}) as unknown as Schema.Schema<IpVersionEmailRoutingTimeseriesGroupResponse>;

export const ipVersionEmailRoutingTimeseriesGroup: (
  input: IpVersionEmailRoutingTimeseriesGroupRequest,
) => Effect.Effect<
  IpVersionEmailRoutingTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionEmailRoutingTimeseriesGroupRequest,
  output: IpVersionEmailRoutingTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// VersionEmailSecuritySummary
// =============================================================================

export interface TlsVersionEmailSecuritySummaryRequest {}

export const TlsVersionEmailSecuritySummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/email/security/summary/tls_version" }),
) as unknown as Schema.Schema<TlsVersionEmailSecuritySummaryRequest>;

export interface TlsVersionEmailSecuritySummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: {
    "TLS 1.0": string;
    "TLS 1.1": string;
    "TLS 1.2": string;
    "TLS 1.3": string;
  };
}

export const TlsVersionEmailSecuritySummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    "TLS 1.0": Schema.String,
    "TLS 1.1": Schema.String,
    "TLS 1.2": Schema.String,
    "TLS 1.3": Schema.String,
  }),
}) as unknown as Schema.Schema<TlsVersionEmailSecuritySummaryResponse>;

export const tlsVersionEmailSecuritySummary: (
  input: TlsVersionEmailSecuritySummaryRequest,
) => Effect.Effect<
  TlsVersionEmailSecuritySummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TlsVersionEmailSecuritySummaryRequest,
  output: TlsVersionEmailSecuritySummaryResponse,
  errors: [],
}));

// =============================================================================
// VersionEmailSecurityTimeseriesGroup
// =============================================================================

export interface TlsVersionEmailSecurityTimeseriesGroupRequest {}

export const TlsVersionEmailSecurityTimeseriesGroupRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/radar/email/security/timeseries_groups/tls_version",
  }),
) as unknown as Schema.Schema<TlsVersionEmailSecurityTimeseriesGroupRequest>;

export interface TlsVersionEmailSecurityTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    "TLS 1.0": string[];
    "TLS 1.1": string[];
    "TLS 1.2": string[];
    "TLS 1.3": string[];
  };
}

export const TlsVersionEmailSecurityTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    "TLS 1.0": Schema.Array(Schema.String),
    "TLS 1.1": Schema.Array(Schema.String),
    "TLS 1.2": Schema.Array(Schema.String),
    "TLS 1.3": Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TlsVersionEmailSecurityTimeseriesGroupResponse>;

export const tlsVersionEmailSecurityTimeseriesGroup: (
  input: TlsVersionEmailSecurityTimeseriesGroupRequest,
) => Effect.Effect<
  TlsVersionEmailSecurityTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TlsVersionEmailSecurityTimeseriesGroupRequest,
  output: TlsVersionEmailSecurityTimeseriesGroupResponse,
  errors: [],
}));

// =============================================================================
// VersionHttpSummary
// =============================================================================

export interface HttpVersionHttpSummaryRequest {}

export const HttpVersionHttpSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/summary/http_version" }),
) as unknown as Schema.Schema<HttpVersionHttpSummaryRequest>;

export interface HttpVersionHttpSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { "HTTP/1.x": string; "HTTP/2": string; "HTTP/3": string };
}

export const HttpVersionHttpSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    "HTTP/1.x": Schema.String,
    "HTTP/2": Schema.String,
    "HTTP/3": Schema.String,
  }),
}) as unknown as Schema.Schema<HttpVersionHttpSummaryResponse>;

export const httpVersionHttpSummary: (
  input: HttpVersionHttpSummaryRequest,
) => Effect.Effect<
  HttpVersionHttpSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: HttpVersionHttpSummaryRequest,
  output: HttpVersionHttpSummaryResponse,
  errors: [],
}));

export interface IpVersionHttpSummaryRequest {}

export const IpVersionHttpSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/summary/ip_version" }),
) as unknown as Schema.Schema<IpVersionHttpSummaryRequest>;

export interface IpVersionHttpSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: { iPv4: string; iPv6: string };
}

export const IpVersionHttpSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    iPv4: Schema.String.pipe(T.JsonName("IPv4")),
    iPv6: Schema.String.pipe(T.JsonName("IPv6")),
  }),
}) as unknown as Schema.Schema<IpVersionHttpSummaryResponse>;

export const ipVersionHttpSummary: (
  input: IpVersionHttpSummaryRequest,
) => Effect.Effect<
  IpVersionHttpSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionHttpSummaryRequest,
  output: IpVersionHttpSummaryResponse,
  errors: [],
}));

export interface TlsVersionHttpSummaryRequest {}

export const TlsVersionHttpSummaryRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/summary/tls_version" }),
) as unknown as Schema.Schema<TlsVersionHttpSummaryRequest>;

export interface TlsVersionHttpSummaryResponse {
  /** Metadata for the results. */
  meta: {
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  summary_0: {
    "TLS 1.0": string;
    "TLS 1.1": string;
    "TLS 1.2": string;
    "TLS 1.3": string;
    "TLS QUIC": string;
  };
}

export const TlsVersionHttpSummaryResponse = Schema.Struct({
  meta: Schema.Struct({
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  summary_0: Schema.Struct({
    "TLS 1.0": Schema.String,
    "TLS 1.1": Schema.String,
    "TLS 1.2": Schema.String,
    "TLS 1.3": Schema.String,
    "TLS QUIC": Schema.String,
  }),
}) as unknown as Schema.Schema<TlsVersionHttpSummaryResponse>;

export const tlsVersionHttpSummary: (
  input: TlsVersionHttpSummaryRequest,
) => Effect.Effect<
  TlsVersionHttpSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TlsVersionHttpSummaryRequest,
  output: TlsVersionHttpSummaryResponse,
  errors: [],
}));

// =============================================================================
// VersionHttpTimeseriesGroup
// =============================================================================

export interface HttpVersionHttpTimeseriesGroupRequest {}

export const HttpVersionHttpTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/timeseries_groups/http_version" }),
) as unknown as Schema.Schema<HttpVersionHttpTimeseriesGroupRequest>;

export interface HttpVersionHttpTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    "HTTP/1.x": string[];
    "HTTP/2": string[];
    "HTTP/3": string[];
    timestamps: string[];
  };
}

export const HttpVersionHttpTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    "HTTP/1.x": Schema.Array(Schema.String),
    "HTTP/2": Schema.Array(Schema.String),
    "HTTP/3": Schema.Array(Schema.String),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<HttpVersionHttpTimeseriesGroupResponse>;

export const httpVersionHttpTimeseriesGroup: (
  input: HttpVersionHttpTimeseriesGroupRequest,
) => Effect.Effect<
  HttpVersionHttpTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: HttpVersionHttpTimeseriesGroupRequest,
  output: HttpVersionHttpTimeseriesGroupResponse,
  errors: [],
}));

export interface IpVersionHttpTimeseriesGroupRequest {}

export const IpVersionHttpTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/timeseries_groups/ip_version" }),
) as unknown as Schema.Schema<IpVersionHttpTimeseriesGroupRequest>;

export interface IpVersionHttpTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: { iPv4: string[]; iPv6: string[]; timestamps: string[] };
}

export const IpVersionHttpTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    iPv4: Schema.Array(Schema.String).pipe(T.JsonName("IPv4")),
    iPv6: Schema.Array(Schema.String).pipe(T.JsonName("IPv6")),
    timestamps: Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<IpVersionHttpTimeseriesGroupResponse>;

export const ipVersionHttpTimeseriesGroup: (
  input: IpVersionHttpTimeseriesGroupRequest,
) => Effect.Effect<
  IpVersionHttpTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: IpVersionHttpTimeseriesGroupRequest,
  output: IpVersionHttpTimeseriesGroupResponse,
  errors: [],
}));

export interface TlsVersionHttpTimeseriesGroupRequest {}

export const TlsVersionHttpTimeseriesGroupRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/radar/http/timeseries_groups/tls_version" }),
) as unknown as Schema.Schema<TlsVersionHttpTimeseriesGroupRequest>;

export interface TlsVersionHttpTimeseriesGroupResponse {
  /** Metadata for the results. */
  meta: {
    aggInterval:
      | "FIFTEEN_MINUTES"
      | "ONE_HOUR"
      | "ONE_DAY"
      | "ONE_WEEK"
      | "ONE_MONTH";
    confidenceInfo: {
      annotations: {
        dataSource: string;
        description: string;
        endDate: string;
        eventType: string;
        isInstantaneous: boolean;
        linkedUrl: string;
        startDate: string;
      }[];
      level: number;
    };
    dateRange: { endTime: string; startTime: string }[];
    lastUpdated: string;
    normalization:
      | "PERCENTAGE"
      | "MIN0_MAX"
      | "MIN_MAX"
      | "RAW_VALUES"
      | "PERCENTAGE_CHANGE"
      | "ROLLING_AVERAGE"
      | "OVERLAPPED_PERCENTAGE"
      | "RATIO";
    units: { name: string; value: string }[];
  };
  serie_0: {
    timestamps: string[];
    "TLS 1.0": string[];
    "TLS 1.1": string[];
    "TLS 1.2": string[];
    "TLS 1.3": string[];
    "TLS QUIC": string[];
  };
}

export const TlsVersionHttpTimeseriesGroupResponse = Schema.Struct({
  meta: Schema.Struct({
    aggInterval: Schema.Literal(
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "ONE_DAY",
      "ONE_WEEK",
      "ONE_MONTH",
    ),
    confidenceInfo: Schema.Struct({
      annotations: Schema.Array(
        Schema.Struct({
          dataSource: Schema.String,
          description: Schema.String,
          endDate: Schema.String,
          eventType: Schema.String,
          isInstantaneous: Schema.Boolean,
          linkedUrl: Schema.String,
          startDate: Schema.String,
        }),
      ),
      level: Schema.Number,
    }),
    dateRange: Schema.Array(
      Schema.Struct({
        endTime: Schema.String,
        startTime: Schema.String,
      }),
    ),
    lastUpdated: Schema.String,
    normalization: Schema.Literal(
      "PERCENTAGE",
      "MIN0_MAX",
      "MIN_MAX",
      "RAW_VALUES",
      "PERCENTAGE_CHANGE",
      "ROLLING_AVERAGE",
      "OVERLAPPED_PERCENTAGE",
      "RATIO",
    ),
    units: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
      }),
    ),
  }),
  serie_0: Schema.Struct({
    timestamps: Schema.Array(Schema.String),
    "TLS 1.0": Schema.Array(Schema.String),
    "TLS 1.1": Schema.Array(Schema.String),
    "TLS 1.2": Schema.Array(Schema.String),
    "TLS 1.3": Schema.Array(Schema.String),
    "TLS QUIC": Schema.Array(Schema.String),
  }),
}) as unknown as Schema.Schema<TlsVersionHttpTimeseriesGroupResponse>;

export const tlsVersionHttpTimeseriesGroup: (
  input: TlsVersionHttpTimeseriesGroupRequest,
) => Effect.Effect<
  TlsVersionHttpTimeseriesGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TlsVersionHttpTimeseriesGroupRequest,
  output: TlsVersionHttpTimeseriesGroupResponse,
  errors: [],
}));

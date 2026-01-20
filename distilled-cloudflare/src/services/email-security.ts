/**
 * Cloudflare EMAIL-SECURITY API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service email-security
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
// Investigate
// =============================================================================

export interface GetInvestigateRequest {
  postfixId: string;
  /** Account Identifier */
  accountId: string;
}

export const GetInvestigateRequest = Schema.Struct({
  postfixId: Schema.String.pipe(T.HttpPath("postfixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/email-security/investigate/{postfixId}",
  }),
) as unknown as Schema.Schema<GetInvestigateRequest>;

export interface GetInvestigateResponse {
  id: string;
  actionLog: unknown;
  clientRecipients: string[];
  detectionReasons: string[];
  isPhishSubmission: boolean;
  isQuarantined: boolean;
  /** The identifier of the message. */
  postfixId: string;
  properties: {
    allowlistedPattern?: string;
    allowlistedPatternType?:
      | "quarantine_release"
      | "acceptable_sender"
      | "allowed_sender"
      | "allowed_recipient"
      | "domain_similarity"
      | "domain_recency"
      | "managed_acceptable_sender";
    blocklistedMessage?: boolean;
    blocklistedPattern?: string;
    whitelistedPatternType?:
      | "quarantine_release"
      | "acceptable_sender"
      | "allowed_sender"
      | "allowed_recipient"
      | "domain_similarity"
      | "domain_recency"
      | "managed_acceptable_sender";
  };
  ts: string;
  alertId?: string | null;
  deliveryMode?:
    | "DIRECT"
    | "BCC"
    | "JOURNAL"
    | "REVIEW_SUBMISSION"
    | "DMARC_UNVERIFIED"
    | "DMARC_FAILURE_REPORT"
    | "DMARC_AGGREGATE_REPORT"
    | "THREAT_INTEL_SUBMISSION"
    | "SIMULATION_SUBMISSION"
    | "API"
    | "RETRO_SCAN"
    | null;
  edfHash?: string | null;
  finalDisposition?:
    | "MALICIOUS"
    | "MALICIOUS-BEC"
    | "SUSPICIOUS"
    | "SPOOF"
    | "SPAM"
    | "BULK"
    | "ENCRYPTED"
    | "EXTERNAL"
    | "UNKNOWN"
    | "NONE"
    | null;
  findings?:
    | { detail?: string | null; name?: string | null; value?: string | null }[]
    | null;
  from?: string | null;
  fromName?: string | null;
  htmltextStructureHash?: string | null;
  messageId?: string | null;
  sentDate?: string | null;
  subject?: string | null;
  threatCategories?: string[] | null;
  to?: string[] | null;
  toName?: string[] | null;
  validation?: {
    comment?: string | null;
    dkim?: "pass" | "neutral" | "fail" | "error" | "none" | null;
    dmarc?: "pass" | "neutral" | "fail" | "error" | "none" | null;
    spf?: "pass" | "neutral" | "fail" | "error" | "none" | null;
  } | null;
}

export const GetInvestigateResponse = Schema.Struct({
  id: Schema.String,
  actionLog: Schema.Unknown.pipe(T.JsonName("action_log")),
  clientRecipients: Schema.Array(Schema.String).pipe(
    T.JsonName("client_recipients"),
  ),
  detectionReasons: Schema.Array(Schema.String).pipe(
    T.JsonName("detection_reasons"),
  ),
  isPhishSubmission: Schema.Boolean.pipe(T.JsonName("is_phish_submission")),
  isQuarantined: Schema.Boolean.pipe(T.JsonName("is_quarantined")),
  postfixId: Schema.String.pipe(T.JsonName("postfix_id")),
  properties: Schema.Struct({
    allowlistedPattern: Schema.optional(Schema.String).pipe(
      T.JsonName("allowlisted_pattern"),
    ),
    allowlistedPatternType: Schema.optional(
      Schema.Literal(
        "quarantine_release",
        "acceptable_sender",
        "allowed_sender",
        "allowed_recipient",
        "domain_similarity",
        "domain_recency",
        "managed_acceptable_sender",
      ),
    ).pipe(T.JsonName("allowlisted_pattern_type")),
    blocklistedMessage: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("blocklisted_message"),
    ),
    blocklistedPattern: Schema.optional(Schema.String).pipe(
      T.JsonName("blocklisted_pattern"),
    ),
    whitelistedPatternType: Schema.optional(
      Schema.Literal(
        "quarantine_release",
        "acceptable_sender",
        "allowed_sender",
        "allowed_recipient",
        "domain_similarity",
        "domain_recency",
        "managed_acceptable_sender",
      ),
    ).pipe(T.JsonName("whitelisted_pattern_type")),
  }),
  ts: Schema.String,
  alertId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("alert_id"),
  ),
  deliveryMode: Schema.optional(
    Schema.Union(
      Schema.Literal("DIRECT"),
      Schema.Literal("BCC"),
      Schema.Literal("JOURNAL"),
      Schema.Literal("REVIEW_SUBMISSION"),
      Schema.Literal("DMARC_UNVERIFIED"),
      Schema.Literal("DMARC_FAILURE_REPORT"),
      Schema.Literal("DMARC_AGGREGATE_REPORT"),
      Schema.Literal("THREAT_INTEL_SUBMISSION"),
      Schema.Literal("SIMULATION_SUBMISSION"),
      Schema.Literal("API"),
      Schema.Literal("RETRO_SCAN"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("delivery_mode")),
  edfHash: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("edf_hash"),
  ),
  finalDisposition: Schema.optional(
    Schema.Union(
      Schema.Literal("MALICIOUS"),
      Schema.Literal("MALICIOUS-BEC"),
      Schema.Literal("SUSPICIOUS"),
      Schema.Literal("SPOOF"),
      Schema.Literal("SPAM"),
      Schema.Literal("BULK"),
      Schema.Literal("ENCRYPTED"),
      Schema.Literal("EXTERNAL"),
      Schema.Literal("UNKNOWN"),
      Schema.Literal("NONE"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("final_disposition")),
  findings: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Struct({
          detail: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
          name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
          value: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        }),
      ),
      Schema.Null,
    ),
  ),
  from: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  fromName: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("from_name"),
  ),
  htmltextStructureHash: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("htmltext_structure_hash")),
  messageId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("message_id"),
  ),
  sentDate: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("sent_date"),
  ),
  subject: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  threatCategories: Schema.optional(
    Schema.Union(Schema.Array(Schema.String), Schema.Null),
  ).pipe(T.JsonName("threat_categories")),
  to: Schema.optional(Schema.Union(Schema.Array(Schema.String), Schema.Null)),
  toName: Schema.optional(
    Schema.Union(Schema.Array(Schema.String), Schema.Null),
  ).pipe(T.JsonName("to_name")),
  validation: Schema.optional(
    Schema.Union(
      Schema.Struct({
        comment: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        dkim: Schema.optional(
          Schema.Union(
            Schema.Literal("pass"),
            Schema.Literal("neutral"),
            Schema.Literal("fail"),
            Schema.Literal("error"),
            Schema.Literal("none"),
            Schema.Null,
          ),
        ),
        dmarc: Schema.optional(
          Schema.Union(
            Schema.Literal("pass"),
            Schema.Literal("neutral"),
            Schema.Literal("fail"),
            Schema.Literal("error"),
            Schema.Literal("none"),
            Schema.Null,
          ),
        ),
        spf: Schema.optional(
          Schema.Union(
            Schema.Literal("pass"),
            Schema.Literal("neutral"),
            Schema.Literal("fail"),
            Schema.Literal("error"),
            Schema.Literal("none"),
            Schema.Null,
          ),
        ),
      }),
      Schema.Null,
    ),
  ),
}) as unknown as Schema.Schema<GetInvestigateResponse>;

export const getInvestigate: (
  input: GetInvestigateRequest,
) => Effect.Effect<
  GetInvestigateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetInvestigateRequest,
  output: GetInvestigateResponse,
  errors: [],
}));

// =============================================================================
// InvestigateDetection
// =============================================================================

export interface GetInvestigateDetectionRequest {
  postfixId: string;
  /** Account Identifier */
  accountId: string;
}

export const GetInvestigateDetectionRequest = Schema.Struct({
  postfixId: Schema.String.pipe(T.HttpPath("postfixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/email-security/investigate/{postfixId}/detections",
  }),
) as unknown as Schema.Schema<GetInvestigateDetectionRequest>;

export interface GetInvestigateDetectionResponse {
  action: string;
  attachments: {
    size: number;
    contentType?: string | null;
    detection?:
      | "MALICIOUS"
      | "MALICIOUS-BEC"
      | "SUSPICIOUS"
      | "SPOOF"
      | "SPAM"
      | "BULK"
      | "ENCRYPTED"
      | "EXTERNAL"
      | "UNKNOWN"
      | "NONE"
      | null;
    encrypted?: boolean | null;
    name?: string | null;
  }[];
  headers: { name: string; value: string }[];
  links: { href: string; text?: string | null }[];
  senderInfo: {
    asName?: string | null;
    asNumber?: number | null;
    geo?: string | null;
    ip?: string | null;
    pld?: string | null;
  };
  threatCategories: {
    id: number;
    description?: string | null;
    name?: string | null;
  }[];
  validation: {
    comment?: string | null;
    dkim?: "pass" | "neutral" | "fail" | "error" | "none" | null;
    dmarc?: "pass" | "neutral" | "fail" | "error" | "none" | null;
    spf?: "pass" | "neutral" | "fail" | "error" | "none" | null;
  };
  finalDisposition?:
    | "MALICIOUS"
    | "MALICIOUS-BEC"
    | "SUSPICIOUS"
    | "SPOOF"
    | "SPAM"
    | "BULK"
    | "ENCRYPTED"
    | "EXTERNAL"
    | "UNKNOWN"
    | "NONE"
    | null;
}

export const GetInvestigateDetectionResponse = Schema.Struct({
  action: Schema.String,
  attachments: Schema.Array(
    Schema.Struct({
      size: Schema.Number,
      contentType: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("content_type")),
      detection: Schema.optional(
        Schema.Union(
          Schema.Literal("MALICIOUS"),
          Schema.Literal("MALICIOUS-BEC"),
          Schema.Literal("SUSPICIOUS"),
          Schema.Literal("SPOOF"),
          Schema.Literal("SPAM"),
          Schema.Literal("BULK"),
          Schema.Literal("ENCRYPTED"),
          Schema.Literal("EXTERNAL"),
          Schema.Literal("UNKNOWN"),
          Schema.Literal("NONE"),
          Schema.Null,
        ),
      ),
      encrypted: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
      name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
  headers: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      value: Schema.String,
    }),
  ),
  links: Schema.Array(
    Schema.Struct({
      href: Schema.String,
      text: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
  senderInfo: Schema.Struct({
    asName: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("as_name"),
    ),
    asNumber: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
      T.JsonName("as_number"),
    ),
    geo: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    ip: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    pld: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }).pipe(T.JsonName("sender_info")),
  threatCategories: Schema.Array(
    Schema.Struct({
      id: Schema.Number,
      description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ).pipe(T.JsonName("threat_categories")),
  validation: Schema.Struct({
    comment: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    dkim: Schema.optional(
      Schema.Union(
        Schema.Literal("pass"),
        Schema.Literal("neutral"),
        Schema.Literal("fail"),
        Schema.Literal("error"),
        Schema.Literal("none"),
        Schema.Null,
      ),
    ),
    dmarc: Schema.optional(
      Schema.Union(
        Schema.Literal("pass"),
        Schema.Literal("neutral"),
        Schema.Literal("fail"),
        Schema.Literal("error"),
        Schema.Literal("none"),
        Schema.Null,
      ),
    ),
    spf: Schema.optional(
      Schema.Union(
        Schema.Literal("pass"),
        Schema.Literal("neutral"),
        Schema.Literal("fail"),
        Schema.Literal("error"),
        Schema.Literal("none"),
        Schema.Null,
      ),
    ),
  }),
  finalDisposition: Schema.optional(
    Schema.Union(
      Schema.Literal("MALICIOUS"),
      Schema.Literal("MALICIOUS-BEC"),
      Schema.Literal("SUSPICIOUS"),
      Schema.Literal("SPOOF"),
      Schema.Literal("SPAM"),
      Schema.Literal("BULK"),
      Schema.Literal("ENCRYPTED"),
      Schema.Literal("EXTERNAL"),
      Schema.Literal("UNKNOWN"),
      Schema.Literal("NONE"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("final_disposition")),
}) as unknown as Schema.Schema<GetInvestigateDetectionResponse>;

export const getInvestigateDetection: (
  input: GetInvestigateDetectionRequest,
) => Effect.Effect<
  GetInvestigateDetectionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetInvestigateDetectionRequest,
  output: GetInvestigateDetectionResponse,
  errors: [],
}));

// =============================================================================
// InvestigatePreview
// =============================================================================

export interface GetInvestigatePreviewRequest {
  postfixId: string;
  /** Account Identifier */
  accountId: string;
}

export const GetInvestigatePreviewRequest = Schema.Struct({
  postfixId: Schema.String.pipe(T.HttpPath("postfixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/email-security/investigate/{postfixId}/preview",
  }),
) as unknown as Schema.Schema<GetInvestigatePreviewRequest>;

export interface GetInvestigatePreviewResponse {
  /** A base64 encoded PNG image of the email. */
  screenshot: string;
}

export const GetInvestigatePreviewResponse = Schema.Struct({
  screenshot: Schema.String,
}) as unknown as Schema.Schema<GetInvestigatePreviewResponse>;

export const getInvestigatePreview: (
  input: GetInvestigatePreviewRequest,
) => Effect.Effect<
  GetInvestigatePreviewResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetInvestigatePreviewRequest,
  output: GetInvestigatePreviewResponse,
  errors: [],
}));

export interface CreateInvestigatePreviewRequest {
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: The identifier of the message. */
  postfixId: string;
}

export const CreateInvestigatePreviewRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  postfixId: Schema.String.pipe(T.JsonName("postfix_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/email-security/investigate/preview",
  }),
) as unknown as Schema.Schema<CreateInvestigatePreviewRequest>;

export interface CreateInvestigatePreviewResponse {
  /** A base64 encoded PNG image of the email. */
  screenshot: string;
}

export const CreateInvestigatePreviewResponse = Schema.Struct({
  screenshot: Schema.String,
}) as unknown as Schema.Schema<CreateInvestigatePreviewResponse>;

export const createInvestigatePreview: (
  input: CreateInvestigatePreviewRequest,
) => Effect.Effect<
  CreateInvestigatePreviewResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateInvestigatePreviewRequest,
  output: CreateInvestigatePreviewResponse,
  errors: [],
}));

// =============================================================================
// InvestigateRaw
// =============================================================================

export interface GetInvestigateRawRequest {
  postfixId: string;
  /** Account Identifier */
  accountId: string;
}

export const GetInvestigateRawRequest = Schema.Struct({
  postfixId: Schema.String.pipe(T.HttpPath("postfixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/email-security/investigate/{postfixId}/raw",
  }),
) as unknown as Schema.Schema<GetInvestigateRawRequest>;

export interface GetInvestigateRawResponse {
  /** A UTF-8 encoded eml file of the email. */
  raw: string;
}

export const GetInvestigateRawResponse = Schema.Struct({
  raw: Schema.String,
}) as unknown as Schema.Schema<GetInvestigateRawResponse>;

export const getInvestigateRaw: (
  input: GetInvestigateRawRequest,
) => Effect.Effect<
  GetInvestigateRawResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetInvestigateRawRequest,
  output: GetInvestigateRawResponse,
  errors: [],
}));

// =============================================================================
// InvestigateReclassify
// =============================================================================

export interface CreateInvestigateReclassifyRequest {
  postfixId: string;
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: */
  expectedDisposition:
    | "NONE"
    | "BULK"
    | "MALICIOUS"
    | "SPAM"
    | "SPOOF"
    | "SUSPICIOUS";
  /** Body param: Base64 encoded content of the EML file */
  emlContent?: string;
  /** Body param: */
  escalatedSubmissionId?: string;
}

export const CreateInvestigateReclassifyRequest = Schema.Struct({
  postfixId: Schema.String.pipe(T.HttpPath("postfixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  expectedDisposition: Schema.Literal(
    "NONE",
    "BULK",
    "MALICIOUS",
    "SPAM",
    "SPOOF",
    "SUSPICIOUS",
  ).pipe(T.JsonName("expected_disposition")),
  emlContent: Schema.optional(Schema.String).pipe(T.JsonName("eml_content")),
  escalatedSubmissionId: Schema.optional(Schema.String).pipe(
    T.JsonName("escalated_submission_id"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/email-security/investigate/{postfixId}/reclassify",
  }),
) as unknown as Schema.Schema<CreateInvestigateReclassifyRequest>;

export type CreateInvestigateReclassifyResponse = unknown;

export const CreateInvestigateReclassifyResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateInvestigateReclassifyResponse>;

export const createInvestigateReclassify: (
  input: CreateInvestigateReclassifyRequest,
) => Effect.Effect<
  CreateInvestigateReclassifyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateInvestigateReclassifyRequest,
  output: CreateInvestigateReclassifyResponse,
  errors: [],
}));

// =============================================================================
// InvestigateTrace
// =============================================================================

export interface GetInvestigateTraceRequest {
  postfixId: string;
  /** Account Identifier */
  accountId: string;
}

export const GetInvestigateTraceRequest = Schema.Struct({
  postfixId: Schema.String.pipe(T.HttpPath("postfixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/email-security/investigate/{postfixId}/trace",
  }),
) as unknown as Schema.Schema<GetInvestigateTraceRequest>;

export interface GetInvestigateTraceResponse {
  inbound: {
    lines?: { lineno: number; message: string; ts: string }[] | null;
    pending?: boolean | null;
  };
  outbound: {
    lines?: { lineno: number; message: string; ts: string }[] | null;
    pending?: boolean | null;
  };
}

export const GetInvestigateTraceResponse = Schema.Struct({
  inbound: Schema.Struct({
    lines: Schema.optional(
      Schema.Union(
        Schema.Array(
          Schema.Struct({
            lineno: Schema.Number,
            message: Schema.String,
            ts: Schema.String,
          }),
        ),
        Schema.Null,
      ),
    ),
    pending: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  }),
  outbound: Schema.Struct({
    lines: Schema.optional(
      Schema.Union(
        Schema.Array(
          Schema.Struct({
            lineno: Schema.Number,
            message: Schema.String,
            ts: Schema.String,
          }),
        ),
        Schema.Null,
      ),
    ),
    pending: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  }),
}) as unknown as Schema.Schema<GetInvestigateTraceResponse>;

export const getInvestigateTrace: (
  input: GetInvestigateTraceRequest,
) => Effect.Effect<
  GetInvestigateTraceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetInvestigateTraceRequest,
  output: GetInvestigateTraceResponse,
  errors: [],
}));

// =============================================================================
// SettingAllowPolicy
// =============================================================================

export interface GetSettingAllowPolicyRequest {
  policyId: number;
  /** Account Identifier */
  accountId: string;
}

export const GetSettingAllowPolicyRequest = Schema.Struct({
  policyId: Schema.Number.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/email-security/settings/allow_policies/{policyId}",
  }),
) as unknown as Schema.Schema<GetSettingAllowPolicyRequest>;

export interface GetSettingAllowPolicyResponse {
  /** The unique identifier for the allow policy. */
  id: number;
  createdAt: string;
  /** Messages from this sender will be exempted from Spam, Spoof and Bulk dispositions. Note: This will not exempt messages with Malicious or Suspicious dispositions. */
  isAcceptableSender: boolean;
  /** Messages to this recipient will bypass all detections. */
  isExemptRecipient: boolean;
  isRegex: boolean;
  /** Messages from this sender will bypass all detections and link following. */
  isTrustedSender: boolean;
  lastModified: string;
  pattern: string;
  patternType: "EMAIL" | "DOMAIN" | "IP" | "UNKNOWN";
  /** Enforce DMARC, SPF or DKIM authentication. When on, Email Security only honors policies that pass authentication. */
  verifySender: boolean;
  comments?: string | null;
  /** @deprecated */
  isRecipient?: boolean;
  /** @deprecated */
  isSender?: boolean;
  /** @deprecated */
  isSpoof?: boolean;
}

export const GetSettingAllowPolicyResponse = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isAcceptableSender: Schema.Boolean.pipe(T.JsonName("is_acceptable_sender")),
  isExemptRecipient: Schema.Boolean.pipe(T.JsonName("is_exempt_recipient")),
  isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
  isTrustedSender: Schema.Boolean.pipe(T.JsonName("is_trusted_sender")),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  pattern: Schema.String,
  patternType: Schema.Literal("EMAIL", "DOMAIN", "IP", "UNKNOWN").pipe(
    T.JsonName("pattern_type"),
  ),
  verifySender: Schema.Boolean.pipe(T.JsonName("verify_sender")),
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  isRecipient: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_recipient")),
  isSender: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_sender")),
  isSpoof: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_spoof")),
}) as unknown as Schema.Schema<GetSettingAllowPolicyResponse>;

export const getSettingAllowPolicy: (
  input: GetSettingAllowPolicyRequest,
) => Effect.Effect<
  GetSettingAllowPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSettingAllowPolicyRequest,
  output: GetSettingAllowPolicyResponse,
  errors: [],
}));

export interface CreateSettingAllowPolicyRequest {
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: Messages from this sender will be exempted from Spam, Spoof and Bulk dispositions. Note: This will not exempt messages with Malicious or Suspicious dispositions. */
  isAcceptableSender: boolean;
  /** Body param: Messages to this recipient will bypass all detections. */
  isExemptRecipient: boolean;
  /** Body param: */
  isRegex: boolean;
  /** Body param: Messages from this sender will bypass all detections and link following. */
  isTrustedSender: boolean;
  /** Body param: */
  pattern: string;
  /** Body param: */
  patternType: "EMAIL" | "DOMAIN" | "IP" | "UNKNOWN";
  /** Body param: Enforce DMARC, SPF or DKIM authentication. When on, Email Security only honors policies that pass authentication. */
  verifySender: boolean;
  /** Body param: */
  comments?: string | null;
  /** @deprecated Body param: */
  isRecipient?: boolean;
  /** @deprecated Body param: */
  isSender?: boolean;
  /** @deprecated Body param: */
  isSpoof?: boolean;
}

export const CreateSettingAllowPolicyRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  isAcceptableSender: Schema.Boolean.pipe(T.JsonName("is_acceptable_sender")),
  isExemptRecipient: Schema.Boolean.pipe(T.JsonName("is_exempt_recipient")),
  isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
  isTrustedSender: Schema.Boolean.pipe(T.JsonName("is_trusted_sender")),
  pattern: Schema.String,
  patternType: Schema.Literal("EMAIL", "DOMAIN", "IP", "UNKNOWN").pipe(
    T.JsonName("pattern_type"),
  ),
  verifySender: Schema.Boolean.pipe(T.JsonName("verify_sender")),
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  isRecipient: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_recipient")),
  isSender: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_sender")),
  isSpoof: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_spoof")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/email-security/settings/allow_policies",
  }),
) as unknown as Schema.Schema<CreateSettingAllowPolicyRequest>;

export interface CreateSettingAllowPolicyResponse {
  /** The unique identifier for the allow policy. */
  id: number;
  createdAt: string;
  /** Messages from this sender will be exempted from Spam, Spoof and Bulk dispositions. Note: This will not exempt messages with Malicious or Suspicious dispositions. */
  isAcceptableSender: boolean;
  /** Messages to this recipient will bypass all detections. */
  isExemptRecipient: boolean;
  isRegex: boolean;
  /** Messages from this sender will bypass all detections and link following. */
  isTrustedSender: boolean;
  lastModified: string;
  pattern: string;
  patternType: "EMAIL" | "DOMAIN" | "IP" | "UNKNOWN";
  /** Enforce DMARC, SPF or DKIM authentication. When on, Email Security only honors policies that pass authentication. */
  verifySender: boolean;
  comments?: string | null;
  /** @deprecated */
  isRecipient?: boolean;
  /** @deprecated */
  isSender?: boolean;
  /** @deprecated */
  isSpoof?: boolean;
}

export const CreateSettingAllowPolicyResponse = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isAcceptableSender: Schema.Boolean.pipe(T.JsonName("is_acceptable_sender")),
  isExemptRecipient: Schema.Boolean.pipe(T.JsonName("is_exempt_recipient")),
  isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
  isTrustedSender: Schema.Boolean.pipe(T.JsonName("is_trusted_sender")),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  pattern: Schema.String,
  patternType: Schema.Literal("EMAIL", "DOMAIN", "IP", "UNKNOWN").pipe(
    T.JsonName("pattern_type"),
  ),
  verifySender: Schema.Boolean.pipe(T.JsonName("verify_sender")),
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  isRecipient: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_recipient")),
  isSender: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_sender")),
  isSpoof: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_spoof")),
}) as unknown as Schema.Schema<CreateSettingAllowPolicyResponse>;

export const createSettingAllowPolicy: (
  input: CreateSettingAllowPolicyRequest,
) => Effect.Effect<
  CreateSettingAllowPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateSettingAllowPolicyRequest,
  output: CreateSettingAllowPolicyResponse,
  errors: [],
}));

export interface PatchSettingAllowPolicyRequest {
  policyId: number;
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: */
  comments?: string | null;
  /** Body param: Messages from this sender will be exempted from Spam, Spoof and Bulk dispositions. Note: This will not exempt messages with Malicious or Suspicious dispositions. */
  isAcceptableSender?: boolean | null;
  /** Body param: Messages to this recipient will bypass all detections. */
  isExemptRecipient?: boolean | null;
  /** Body param: */
  isRegex?: boolean | null;
  /** Body param: Messages from this sender will bypass all detections and link following. */
  isTrustedSender?: boolean | null;
  /** Body param: */
  pattern?: string | null;
  /** Body param: */
  patternType?: "EMAIL" | "DOMAIN" | "IP" | "UNKNOWN" | null;
  /** Body param: Enforce DMARC, SPF or DKIM authentication. When on, Email Security only honors policies that pass authentication. */
  verifySender?: boolean | null;
}

export const PatchSettingAllowPolicyRequest = Schema.Struct({
  policyId: Schema.Number.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  isAcceptableSender: Schema.optional(
    Schema.Union(Schema.Boolean, Schema.Null),
  ).pipe(T.JsonName("is_acceptable_sender")),
  isExemptRecipient: Schema.optional(
    Schema.Union(Schema.Boolean, Schema.Null),
  ).pipe(T.JsonName("is_exempt_recipient")),
  isRegex: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)).pipe(
    T.JsonName("is_regex"),
  ),
  isTrustedSender: Schema.optional(
    Schema.Union(Schema.Boolean, Schema.Null),
  ).pipe(T.JsonName("is_trusted_sender")),
  pattern: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  patternType: Schema.optional(
    Schema.Union(
      Schema.Literal("EMAIL"),
      Schema.Literal("DOMAIN"),
      Schema.Literal("IP"),
      Schema.Literal("UNKNOWN"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("pattern_type")),
  verifySender: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)).pipe(
    T.JsonName("verify_sender"),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/email-security/settings/allow_policies/{policyId}",
  }),
) as unknown as Schema.Schema<PatchSettingAllowPolicyRequest>;

export interface PatchSettingAllowPolicyResponse {
  /** The unique identifier for the allow policy. */
  id: number;
  createdAt: string;
  /** Messages from this sender will be exempted from Spam, Spoof and Bulk dispositions. Note: This will not exempt messages with Malicious or Suspicious dispositions. */
  isAcceptableSender: boolean;
  /** Messages to this recipient will bypass all detections. */
  isExemptRecipient: boolean;
  isRegex: boolean;
  /** Messages from this sender will bypass all detections and link following. */
  isTrustedSender: boolean;
  lastModified: string;
  pattern: string;
  patternType: "EMAIL" | "DOMAIN" | "IP" | "UNKNOWN";
  /** Enforce DMARC, SPF or DKIM authentication. When on, Email Security only honors policies that pass authentication. */
  verifySender: boolean;
  comments?: string | null;
  /** @deprecated */
  isRecipient?: boolean;
  /** @deprecated */
  isSender?: boolean;
  /** @deprecated */
  isSpoof?: boolean;
}

export const PatchSettingAllowPolicyResponse = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isAcceptableSender: Schema.Boolean.pipe(T.JsonName("is_acceptable_sender")),
  isExemptRecipient: Schema.Boolean.pipe(T.JsonName("is_exempt_recipient")),
  isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
  isTrustedSender: Schema.Boolean.pipe(T.JsonName("is_trusted_sender")),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  pattern: Schema.String,
  patternType: Schema.Literal("EMAIL", "DOMAIN", "IP", "UNKNOWN").pipe(
    T.JsonName("pattern_type"),
  ),
  verifySender: Schema.Boolean.pipe(T.JsonName("verify_sender")),
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  isRecipient: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_recipient")),
  isSender: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_sender")),
  isSpoof: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_spoof")),
}) as unknown as Schema.Schema<PatchSettingAllowPolicyResponse>;

export const patchSettingAllowPolicy: (
  input: PatchSettingAllowPolicyRequest,
) => Effect.Effect<
  PatchSettingAllowPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchSettingAllowPolicyRequest,
  output: PatchSettingAllowPolicyResponse,
  errors: [],
}));

export interface DeleteSettingAllowPolicyRequest {
  policyId: number;
  /** Account Identifier */
  accountId: string;
}

export const DeleteSettingAllowPolicyRequest = Schema.Struct({
  policyId: Schema.Number.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/email-security/settings/allow_policies/{policyId}",
  }),
) as unknown as Schema.Schema<DeleteSettingAllowPolicyRequest>;

export interface DeleteSettingAllowPolicyResponse {
  /** The unique identifier for the allow policy. */
  id: number;
}

export const DeleteSettingAllowPolicyResponse = Schema.Struct({
  id: Schema.Number,
}) as unknown as Schema.Schema<DeleteSettingAllowPolicyResponse>;

export const deleteSettingAllowPolicy: (
  input: DeleteSettingAllowPolicyRequest,
) => Effect.Effect<
  DeleteSettingAllowPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteSettingAllowPolicyRequest,
  output: DeleteSettingAllowPolicyResponse,
  errors: [],
}));

// =============================================================================
// SettingBlockSender
// =============================================================================

export interface GetSettingBlockSenderRequest {
  patternId: number;
  /** Account Identifier */
  accountId: string;
}

export const GetSettingBlockSenderRequest = Schema.Struct({
  patternId: Schema.Number.pipe(T.HttpPath("patternId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/email-security/settings/block_senders/{patternId}",
  }),
) as unknown as Schema.Schema<GetSettingBlockSenderRequest>;

export interface GetSettingBlockSenderResponse {
  /** The unique identifier for the allow policy. */
  id: number;
  createdAt: string;
  isRegex: boolean;
  lastModified: string;
  pattern: string;
  patternType: "EMAIL" | "DOMAIN" | "IP" | "UNKNOWN";
  comments?: string | null;
}

export const GetSettingBlockSenderResponse = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  pattern: Schema.String,
  patternType: Schema.Literal("EMAIL", "DOMAIN", "IP", "UNKNOWN").pipe(
    T.JsonName("pattern_type"),
  ),
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<GetSettingBlockSenderResponse>;

export const getSettingBlockSender: (
  input: GetSettingBlockSenderRequest,
) => Effect.Effect<
  GetSettingBlockSenderResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSettingBlockSenderRequest,
  output: GetSettingBlockSenderResponse,
  errors: [],
}));

export interface CreateSettingBlockSenderRequest {
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: */
  isRegex: boolean;
  /** Body param: */
  pattern: string;
  /** Body param: */
  patternType: "EMAIL" | "DOMAIN" | "IP" | "UNKNOWN";
  /** Body param: */
  comments?: string | null;
}

export const CreateSettingBlockSenderRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
  pattern: Schema.String,
  patternType: Schema.Literal("EMAIL", "DOMAIN", "IP", "UNKNOWN").pipe(
    T.JsonName("pattern_type"),
  ),
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/email-security/settings/block_senders",
  }),
) as unknown as Schema.Schema<CreateSettingBlockSenderRequest>;

export interface CreateSettingBlockSenderResponse {
  /** The unique identifier for the allow policy. */
  id: number;
  createdAt: string;
  isRegex: boolean;
  lastModified: string;
  pattern: string;
  patternType: "EMAIL" | "DOMAIN" | "IP" | "UNKNOWN";
  comments?: string | null;
}

export const CreateSettingBlockSenderResponse = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  pattern: Schema.String,
  patternType: Schema.Literal("EMAIL", "DOMAIN", "IP", "UNKNOWN").pipe(
    T.JsonName("pattern_type"),
  ),
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<CreateSettingBlockSenderResponse>;

export const createSettingBlockSender: (
  input: CreateSettingBlockSenderRequest,
) => Effect.Effect<
  CreateSettingBlockSenderResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateSettingBlockSenderRequest,
  output: CreateSettingBlockSenderResponse,
  errors: [],
}));

export interface PatchSettingBlockSenderRequest {
  patternId: number;
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: */
  comments?: string | null;
  /** Body param: */
  isRegex?: boolean | null;
  /** Body param: */
  pattern?: string | null;
  /** Body param: */
  patternType?: "EMAIL" | "DOMAIN" | "IP" | "UNKNOWN" | null;
}

export const PatchSettingBlockSenderRequest = Schema.Struct({
  patternId: Schema.Number.pipe(T.HttpPath("patternId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  isRegex: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)).pipe(
    T.JsonName("is_regex"),
  ),
  pattern: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  patternType: Schema.optional(
    Schema.Union(
      Schema.Literal("EMAIL"),
      Schema.Literal("DOMAIN"),
      Schema.Literal("IP"),
      Schema.Literal("UNKNOWN"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("pattern_type")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/email-security/settings/block_senders/{patternId}",
  }),
) as unknown as Schema.Schema<PatchSettingBlockSenderRequest>;

export interface PatchSettingBlockSenderResponse {
  /** The unique identifier for the allow policy. */
  id: number;
  createdAt: string;
  isRegex: boolean;
  lastModified: string;
  pattern: string;
  patternType: "EMAIL" | "DOMAIN" | "IP" | "UNKNOWN";
  comments?: string | null;
}

export const PatchSettingBlockSenderResponse = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  pattern: Schema.String,
  patternType: Schema.Literal("EMAIL", "DOMAIN", "IP", "UNKNOWN").pipe(
    T.JsonName("pattern_type"),
  ),
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<PatchSettingBlockSenderResponse>;

export const patchSettingBlockSender: (
  input: PatchSettingBlockSenderRequest,
) => Effect.Effect<
  PatchSettingBlockSenderResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchSettingBlockSenderRequest,
  output: PatchSettingBlockSenderResponse,
  errors: [],
}));

export interface DeleteSettingBlockSenderRequest {
  patternId: number;
  /** Account Identifier */
  accountId: string;
}

export const DeleteSettingBlockSenderRequest = Schema.Struct({
  patternId: Schema.Number.pipe(T.HttpPath("patternId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/email-security/settings/block_senders/{patternId}",
  }),
) as unknown as Schema.Schema<DeleteSettingBlockSenderRequest>;

export interface DeleteSettingBlockSenderResponse {
  /** The unique identifier for the allow policy. */
  id: number;
}

export const DeleteSettingBlockSenderResponse = Schema.Struct({
  id: Schema.Number,
}) as unknown as Schema.Schema<DeleteSettingBlockSenderResponse>;

export const deleteSettingBlockSender: (
  input: DeleteSettingBlockSenderRequest,
) => Effect.Effect<
  DeleteSettingBlockSenderResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteSettingBlockSenderRequest,
  output: DeleteSettingBlockSenderResponse,
  errors: [],
}));

// =============================================================================
// SettingDomain
// =============================================================================

export interface GetSettingDomainRequest {
  domainId: number;
  /** Account Identifier */
  accountId: string;
}

export const GetSettingDomainRequest = Schema.Struct({
  domainId: Schema.Number.pipe(T.HttpPath("domainId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/email-security/settings/domains/{domainId}",
  }),
) as unknown as Schema.Schema<GetSettingDomainRequest>;

export interface GetSettingDomainResponse {
  /** The unique identifier for the domain. */
  id: number;
  allowedDeliveryModes: ("DIRECT" | "BCC" | "JOURNAL" | "API" | "RETRO_SCAN")[];
  createdAt: string;
  domain: string;
  dropDispositions: (
    | "MALICIOUS"
    | "MALICIOUS-BEC"
    | "SUSPICIOUS"
    | "SPOOF"
    | "SPAM"
    | "BULK"
    | "ENCRYPTED"
    | "EXTERNAL"
    | "UNKNOWN"
    | "NONE"
  )[];
  ipRestrictions: string[];
  lastModified: string;
  lookbackHops: number;
  regions: ("GLOBAL" | "AU" | "DE" | "IN" | "US")[];
  transport: string;
  authorization?: {
    authorized: boolean;
    timestamp: string;
    statusMessage?: string | null;
  } | null;
  dmarcStatus?: "none" | "good" | "invalid" | null;
  emailsProcessed?: {
    timestamp: string;
    totalEmailsProcessed: number;
    totalEmailsProcessedPrevious: number;
  } | null;
  folder?: "AllItems" | "Inbox" | null;
  inboxProvider?: "Microsoft" | "Google" | null;
  integrationId?: string | null;
  o365TenantId?: string | null;
  requireTlsInbound?: boolean | null;
  requireTlsOutbound?: boolean | null;
  spfStatus?: "none" | "good" | "neutral" | "open" | "invalid" | null;
}

export const GetSettingDomainResponse = Schema.Struct({
  id: Schema.Number,
  allowedDeliveryModes: Schema.Array(
    Schema.Literal("DIRECT", "BCC", "JOURNAL", "API", "RETRO_SCAN"),
  ).pipe(T.JsonName("allowed_delivery_modes")),
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  domain: Schema.String,
  dropDispositions: Schema.Array(
    Schema.Literal(
      "MALICIOUS",
      "MALICIOUS-BEC",
      "SUSPICIOUS",
      "SPOOF",
      "SPAM",
      "BULK",
      "ENCRYPTED",
      "EXTERNAL",
      "UNKNOWN",
      "NONE",
    ),
  ).pipe(T.JsonName("drop_dispositions")),
  ipRestrictions: Schema.Array(Schema.String).pipe(
    T.JsonName("ip_restrictions"),
  ),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  lookbackHops: Schema.Number.pipe(T.JsonName("lookback_hops")),
  regions: Schema.Array(Schema.Literal("GLOBAL", "AU", "DE", "IN", "US")),
  transport: Schema.String,
  authorization: Schema.optional(
    Schema.Union(
      Schema.Struct({
        authorized: Schema.Boolean,
        timestamp: Schema.String,
        statusMessage: Schema.optional(
          Schema.Union(Schema.String, Schema.Null),
        ).pipe(T.JsonName("status_message")),
      }),
      Schema.Null,
    ),
  ),
  dmarcStatus: Schema.optional(
    Schema.Union(
      Schema.Literal("none"),
      Schema.Literal("good"),
      Schema.Literal("invalid"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("dmarc_status")),
  emailsProcessed: Schema.optional(
    Schema.Union(
      Schema.Struct({
        timestamp: Schema.String,
        totalEmailsProcessed: Schema.Number.pipe(
          T.JsonName("total_emails_processed"),
        ),
        totalEmailsProcessedPrevious: Schema.Number.pipe(
          T.JsonName("total_emails_processed_previous"),
        ),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("emails_processed")),
  folder: Schema.optional(
    Schema.Union(
      Schema.Literal("AllItems"),
      Schema.Literal("Inbox"),
      Schema.Null,
    ),
  ),
  inboxProvider: Schema.optional(
    Schema.Union(
      Schema.Literal("Microsoft"),
      Schema.Literal("Google"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("inbox_provider")),
  integrationId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("integration_id"),
  ),
  o365TenantId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("o365_tenant_id"),
  ),
  requireTlsInbound: Schema.optional(
    Schema.Union(Schema.Boolean, Schema.Null),
  ).pipe(T.JsonName("require_tls_inbound")),
  requireTlsOutbound: Schema.optional(
    Schema.Union(Schema.Boolean, Schema.Null),
  ).pipe(T.JsonName("require_tls_outbound")),
  spfStatus: Schema.optional(
    Schema.Union(
      Schema.Literal("none"),
      Schema.Literal("good"),
      Schema.Literal("neutral"),
      Schema.Literal("open"),
      Schema.Literal("invalid"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("spf_status")),
}) as unknown as Schema.Schema<GetSettingDomainResponse>;

export const getSettingDomain: (
  input: GetSettingDomainRequest,
) => Effect.Effect<
  GetSettingDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSettingDomainRequest,
  output: GetSettingDomainResponse,
  errors: [],
}));

export interface PatchSettingDomainRequest {
  domainId: number;
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: */
  ipRestrictions: string[];
  /** Body param: */
  allowedDeliveryModes?: (
    | "DIRECT"
    | "BCC"
    | "JOURNAL"
    | "API"
    | "RETRO_SCAN"
  )[];
  /** Body param: */
  domain?: string;
  /** Body param: */
  dropDispositions?: (
    | "MALICIOUS"
    | "MALICIOUS-BEC"
    | "SUSPICIOUS"
    | "SPOOF"
    | "SPAM"
    | "BULK"
    | "ENCRYPTED"
    | "EXTERNAL"
    | "UNKNOWN"
    | "NONE"
  )[];
  /** Body param: */
  folder?: "AllItems" | "Inbox";
  /** Body param: */
  integrationId?: string;
  /** Body param: */
  lookbackHops?: number;
  /** Body param: */
  regions?: ("GLOBAL" | "AU" | "DE" | "IN" | "US")[];
  /** Body param: */
  requireTlsInbound?: boolean;
  /** Body param: */
  requireTlsOutbound?: boolean;
  /** Body param: */
  transport?: string;
}

export const PatchSettingDomainRequest = Schema.Struct({
  domainId: Schema.Number.pipe(T.HttpPath("domainId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  ipRestrictions: Schema.Array(Schema.String).pipe(
    T.JsonName("ip_restrictions"),
  ),
  allowedDeliveryModes: Schema.optional(
    Schema.Array(
      Schema.Literal("DIRECT", "BCC", "JOURNAL", "API", "RETRO_SCAN"),
    ),
  ).pipe(T.JsonName("allowed_delivery_modes")),
  domain: Schema.optional(Schema.String),
  dropDispositions: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "MALICIOUS",
        "MALICIOUS-BEC",
        "SUSPICIOUS",
        "SPOOF",
        "SPAM",
        "BULK",
        "ENCRYPTED",
        "EXTERNAL",
        "UNKNOWN",
        "NONE",
      ),
    ),
  ).pipe(T.JsonName("drop_dispositions")),
  folder: Schema.optional(Schema.Literal("AllItems", "Inbox")),
  integrationId: Schema.optional(Schema.String).pipe(
    T.JsonName("integration_id"),
  ),
  lookbackHops: Schema.optional(Schema.Number).pipe(
    T.JsonName("lookback_hops"),
  ),
  regions: Schema.optional(
    Schema.Array(Schema.Literal("GLOBAL", "AU", "DE", "IN", "US")),
  ),
  requireTlsInbound: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("require_tls_inbound"),
  ),
  requireTlsOutbound: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("require_tls_outbound"),
  ),
  transport: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/email-security/settings/domains/{domainId}",
  }),
) as unknown as Schema.Schema<PatchSettingDomainRequest>;

export interface PatchSettingDomainResponse {
  /** The unique identifier for the domain. */
  id: number;
  allowedDeliveryModes: ("DIRECT" | "BCC" | "JOURNAL" | "API" | "RETRO_SCAN")[];
  createdAt: string;
  domain: string;
  dropDispositions: (
    | "MALICIOUS"
    | "MALICIOUS-BEC"
    | "SUSPICIOUS"
    | "SPOOF"
    | "SPAM"
    | "BULK"
    | "ENCRYPTED"
    | "EXTERNAL"
    | "UNKNOWN"
    | "NONE"
  )[];
  ipRestrictions: string[];
  lastModified: string;
  lookbackHops: number;
  regions: ("GLOBAL" | "AU" | "DE" | "IN" | "US")[];
  transport: string;
  authorization?: {
    authorized: boolean;
    timestamp: string;
    statusMessage?: string | null;
  } | null;
  dmarcStatus?: "none" | "good" | "invalid" | null;
  emailsProcessed?: {
    timestamp: string;
    totalEmailsProcessed: number;
    totalEmailsProcessedPrevious: number;
  } | null;
  folder?: "AllItems" | "Inbox" | null;
  inboxProvider?: "Microsoft" | "Google" | null;
  integrationId?: string | null;
  o365TenantId?: string | null;
  requireTlsInbound?: boolean | null;
  requireTlsOutbound?: boolean | null;
  spfStatus?: "none" | "good" | "neutral" | "open" | "invalid" | null;
}

export const PatchSettingDomainResponse = Schema.Struct({
  id: Schema.Number,
  allowedDeliveryModes: Schema.Array(
    Schema.Literal("DIRECT", "BCC", "JOURNAL", "API", "RETRO_SCAN"),
  ).pipe(T.JsonName("allowed_delivery_modes")),
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  domain: Schema.String,
  dropDispositions: Schema.Array(
    Schema.Literal(
      "MALICIOUS",
      "MALICIOUS-BEC",
      "SUSPICIOUS",
      "SPOOF",
      "SPAM",
      "BULK",
      "ENCRYPTED",
      "EXTERNAL",
      "UNKNOWN",
      "NONE",
    ),
  ).pipe(T.JsonName("drop_dispositions")),
  ipRestrictions: Schema.Array(Schema.String).pipe(
    T.JsonName("ip_restrictions"),
  ),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  lookbackHops: Schema.Number.pipe(T.JsonName("lookback_hops")),
  regions: Schema.Array(Schema.Literal("GLOBAL", "AU", "DE", "IN", "US")),
  transport: Schema.String,
  authorization: Schema.optional(
    Schema.Union(
      Schema.Struct({
        authorized: Schema.Boolean,
        timestamp: Schema.String,
        statusMessage: Schema.optional(
          Schema.Union(Schema.String, Schema.Null),
        ).pipe(T.JsonName("status_message")),
      }),
      Schema.Null,
    ),
  ),
  dmarcStatus: Schema.optional(
    Schema.Union(
      Schema.Literal("none"),
      Schema.Literal("good"),
      Schema.Literal("invalid"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("dmarc_status")),
  emailsProcessed: Schema.optional(
    Schema.Union(
      Schema.Struct({
        timestamp: Schema.String,
        totalEmailsProcessed: Schema.Number.pipe(
          T.JsonName("total_emails_processed"),
        ),
        totalEmailsProcessedPrevious: Schema.Number.pipe(
          T.JsonName("total_emails_processed_previous"),
        ),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("emails_processed")),
  folder: Schema.optional(
    Schema.Union(
      Schema.Literal("AllItems"),
      Schema.Literal("Inbox"),
      Schema.Null,
    ),
  ),
  inboxProvider: Schema.optional(
    Schema.Union(
      Schema.Literal("Microsoft"),
      Schema.Literal("Google"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("inbox_provider")),
  integrationId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("integration_id"),
  ),
  o365TenantId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("o365_tenant_id"),
  ),
  requireTlsInbound: Schema.optional(
    Schema.Union(Schema.Boolean, Schema.Null),
  ).pipe(T.JsonName("require_tls_inbound")),
  requireTlsOutbound: Schema.optional(
    Schema.Union(Schema.Boolean, Schema.Null),
  ).pipe(T.JsonName("require_tls_outbound")),
  spfStatus: Schema.optional(
    Schema.Union(
      Schema.Literal("none"),
      Schema.Literal("good"),
      Schema.Literal("neutral"),
      Schema.Literal("open"),
      Schema.Literal("invalid"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("spf_status")),
}) as unknown as Schema.Schema<PatchSettingDomainResponse>;

export const patchSettingDomain: (
  input: PatchSettingDomainRequest,
) => Effect.Effect<
  PatchSettingDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchSettingDomainRequest,
  output: PatchSettingDomainResponse,
  errors: [],
}));

export interface DeleteSettingDomainRequest {
  domainId: number;
  /** Account Identifier */
  accountId: string;
}

export const DeleteSettingDomainRequest = Schema.Struct({
  domainId: Schema.Number.pipe(T.HttpPath("domainId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/email-security/settings/domains/{domainId}",
  }),
) as unknown as Schema.Schema<DeleteSettingDomainRequest>;

export interface DeleteSettingDomainResponse {
  /** The unique identifier for the domain. */
  id: number;
}

export const DeleteSettingDomainResponse = Schema.Struct({
  id: Schema.Number,
}) as unknown as Schema.Schema<DeleteSettingDomainResponse>;

export const deleteSettingDomain: (
  input: DeleteSettingDomainRequest,
) => Effect.Effect<
  DeleteSettingDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteSettingDomainRequest,
  output: DeleteSettingDomainResponse,
  errors: [],
}));

// =============================================================================
// SettingImpersonationRegistry
// =============================================================================

export interface GetSettingImpersonationRegistryRequest {
  displayNameId: number;
  /** Account Identifier */
  accountId: string;
}

export const GetSettingImpersonationRegistryRequest = Schema.Struct({
  displayNameId: Schema.Number.pipe(T.HttpPath("displayNameId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/email-security/settings/impersonation_registry/{displayNameId}",
  }),
) as unknown as Schema.Schema<GetSettingImpersonationRegistryRequest>;

export interface GetSettingImpersonationRegistryResponse {
  id: number;
  createdAt: string;
  email: string;
  isEmailRegex: boolean;
  lastModified: string;
  name: string;
  comments?: string | null;
  directoryId?: number | null;
  directoryNodeId?: number | null;
  /** @deprecated */
  externalDirectoryNodeId?: string | null;
  provenance?: string | null;
}

export const GetSettingImpersonationRegistryResponse = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  email: Schema.String,
  isEmailRegex: Schema.Boolean.pipe(T.JsonName("is_email_regex")),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  name: Schema.String,
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  directoryId: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.JsonName("directory_id"),
  ),
  directoryNodeId: Schema.optional(
    Schema.Union(Schema.Number, Schema.Null),
  ).pipe(T.JsonName("directory_node_id")),
  externalDirectoryNodeId: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("external_directory_node_id")),
  provenance: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<GetSettingImpersonationRegistryResponse>;

export const getSettingImpersonationRegistry: (
  input: GetSettingImpersonationRegistryRequest,
) => Effect.Effect<
  GetSettingImpersonationRegistryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSettingImpersonationRegistryRequest,
  output: GetSettingImpersonationRegistryResponse,
  errors: [],
}));

export interface CreateSettingImpersonationRegistryRequest {
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: */
  email: string;
  /** Body param: */
  isEmailRegex: boolean;
  /** Body param: */
  name: string;
}

export const CreateSettingImpersonationRegistryRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  email: Schema.String,
  isEmailRegex: Schema.Boolean.pipe(T.JsonName("is_email_regex")),
  name: Schema.String,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/email-security/settings/impersonation_registry",
  }),
) as unknown as Schema.Schema<CreateSettingImpersonationRegistryRequest>;

export interface CreateSettingImpersonationRegistryResponse {
  id: number;
  createdAt: string;
  email: string;
  isEmailRegex: boolean;
  lastModified: string;
  name: string;
  comments?: string | null;
  directoryId?: number | null;
  directoryNodeId?: number | null;
  /** @deprecated */
  externalDirectoryNodeId?: string | null;
  provenance?: string | null;
}

export const CreateSettingImpersonationRegistryResponse = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  email: Schema.String,
  isEmailRegex: Schema.Boolean.pipe(T.JsonName("is_email_regex")),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  name: Schema.String,
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  directoryId: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.JsonName("directory_id"),
  ),
  directoryNodeId: Schema.optional(
    Schema.Union(Schema.Number, Schema.Null),
  ).pipe(T.JsonName("directory_node_id")),
  externalDirectoryNodeId: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("external_directory_node_id")),
  provenance: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<CreateSettingImpersonationRegistryResponse>;

export const createSettingImpersonationRegistry: (
  input: CreateSettingImpersonationRegistryRequest,
) => Effect.Effect<
  CreateSettingImpersonationRegistryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateSettingImpersonationRegistryRequest,
  output: CreateSettingImpersonationRegistryResponse,
  errors: [],
}));

export interface PatchSettingImpersonationRegistryRequest {
  displayNameId: number;
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: */
  email?: string | null;
  /** Body param: */
  isEmailRegex?: boolean | null;
  /** Body param: */
  name?: string | null;
}

export const PatchSettingImpersonationRegistryRequest = Schema.Struct({
  displayNameId: Schema.Number.pipe(T.HttpPath("displayNameId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  email: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  isEmailRegex: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)).pipe(
    T.JsonName("is_email_regex"),
  ),
  name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/email-security/settings/impersonation_registry/{displayNameId}",
  }),
) as unknown as Schema.Schema<PatchSettingImpersonationRegistryRequest>;

export interface PatchSettingImpersonationRegistryResponse {
  id: number;
  createdAt: string;
  email: string;
  isEmailRegex: boolean;
  lastModified: string;
  name: string;
  comments?: string | null;
  directoryId?: number | null;
  directoryNodeId?: number | null;
  /** @deprecated */
  externalDirectoryNodeId?: string | null;
  provenance?: string | null;
}

export const PatchSettingImpersonationRegistryResponse = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  email: Schema.String,
  isEmailRegex: Schema.Boolean.pipe(T.JsonName("is_email_regex")),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  name: Schema.String,
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  directoryId: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.JsonName("directory_id"),
  ),
  directoryNodeId: Schema.optional(
    Schema.Union(Schema.Number, Schema.Null),
  ).pipe(T.JsonName("directory_node_id")),
  externalDirectoryNodeId: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("external_directory_node_id")),
  provenance: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<PatchSettingImpersonationRegistryResponse>;

export const patchSettingImpersonationRegistry: (
  input: PatchSettingImpersonationRegistryRequest,
) => Effect.Effect<
  PatchSettingImpersonationRegistryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchSettingImpersonationRegistryRequest,
  output: PatchSettingImpersonationRegistryResponse,
  errors: [],
}));

export interface DeleteSettingImpersonationRegistryRequest {
  displayNameId: number;
  /** Account Identifier */
  accountId: string;
}

export const DeleteSettingImpersonationRegistryRequest = Schema.Struct({
  displayNameId: Schema.Number.pipe(T.HttpPath("displayNameId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/email-security/settings/impersonation_registry/{displayNameId}",
  }),
) as unknown as Schema.Schema<DeleteSettingImpersonationRegistryRequest>;

export interface DeleteSettingImpersonationRegistryResponse {
  id: number;
}

export const DeleteSettingImpersonationRegistryResponse = Schema.Struct({
  id: Schema.Number,
}) as unknown as Schema.Schema<DeleteSettingImpersonationRegistryResponse>;

export const deleteSettingImpersonationRegistry: (
  input: DeleteSettingImpersonationRegistryRequest,
) => Effect.Effect<
  DeleteSettingImpersonationRegistryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteSettingImpersonationRegistryRequest,
  output: DeleteSettingImpersonationRegistryResponse,
  errors: [],
}));

// =============================================================================
// SettingTrustedDomain
// =============================================================================

export interface GetSettingTrustedDomainRequest {
  trustedDomainId: number;
  /** Account Identifier */
  accountId: string;
}

export const GetSettingTrustedDomainRequest = Schema.Struct({
  trustedDomainId: Schema.Number.pipe(T.HttpPath("trustedDomainId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/email-security/settings/trusted_domains/{trustedDomainId}",
  }),
) as unknown as Schema.Schema<GetSettingTrustedDomainRequest>;

export interface GetSettingTrustedDomainResponse {
  /** The unique identifier for the trusted domain. */
  id: number;
  createdAt: string;
  /** Select to prevent recently registered domains from triggering a Suspicious or Malicious disposition. */
  isRecent: boolean;
  isRegex: boolean;
  /** Select for partner or other approved domains that have similar spelling to your connected domains. Prevents listed domains from triggering a Spoof disposition. */
  isSimilarity: boolean;
  lastModified: string;
  pattern: string;
  comments?: string | null;
}

export const GetSettingTrustedDomainResponse = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isRecent: Schema.Boolean.pipe(T.JsonName("is_recent")),
  isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
  isSimilarity: Schema.Boolean.pipe(T.JsonName("is_similarity")),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  pattern: Schema.String,
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<GetSettingTrustedDomainResponse>;

export const getSettingTrustedDomain: (
  input: GetSettingTrustedDomainRequest,
) => Effect.Effect<
  GetSettingTrustedDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSettingTrustedDomainRequest,
  output: GetSettingTrustedDomainResponse,
  errors: [],
}));

export interface CreateSettingTrustedDomainRequest {}

export const CreateSettingTrustedDomainRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/email-security/settings/trusted_domains",
  }),
) as unknown as Schema.Schema<CreateSettingTrustedDomainRequest>;

export type CreateSettingTrustedDomainResponse =
  | {
      id: number;
      createdAt: string;
      isRecent: boolean;
      isRegex: boolean;
      isSimilarity: boolean;
      lastModified: string;
      pattern: string;
      comments?: string | null;
    }
  | {
      id: number;
      createdAt: string;
      isRecent: boolean;
      isRegex: boolean;
      isSimilarity: boolean;
      lastModified: string;
      pattern: string;
      comments?: string | null;
    }[];

export const CreateSettingTrustedDomainResponse = Schema.Union(
  Schema.Struct({
    id: Schema.Number,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    isRecent: Schema.Boolean.pipe(T.JsonName("is_recent")),
    isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
    isSimilarity: Schema.Boolean.pipe(T.JsonName("is_similarity")),
    lastModified: Schema.String.pipe(T.JsonName("last_modified")),
    pattern: Schema.String,
    comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
  Schema.Array(
    Schema.Struct({
      id: Schema.Number,
      createdAt: Schema.String.pipe(T.JsonName("created_at")),
      isRecent: Schema.Boolean.pipe(T.JsonName("is_recent")),
      isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
      isSimilarity: Schema.Boolean.pipe(T.JsonName("is_similarity")),
      lastModified: Schema.String.pipe(T.JsonName("last_modified")),
      pattern: Schema.String,
      comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
) as unknown as Schema.Schema<CreateSettingTrustedDomainResponse>;

export const createSettingTrustedDomain: (
  input: CreateSettingTrustedDomainRequest,
) => Effect.Effect<
  CreateSettingTrustedDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateSettingTrustedDomainRequest,
  output: CreateSettingTrustedDomainResponse,
  errors: [],
}));

export interface PatchSettingTrustedDomainRequest {
  trustedDomainId: number;
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: */
  comments?: string;
  /** Body param: Select to prevent recently registered domains from triggering a Suspicious or Malicious disposition. */
  isRecent?: boolean;
  /** Body param: */
  isRegex?: boolean;
  /** Body param: Select for partner or other approved domains that have similar spelling to your connected domains. Prevents listed domains from triggering a Spoof disposition. */
  isSimilarity?: boolean;
  /** Body param: */
  pattern?: string;
}

export const PatchSettingTrustedDomainRequest = Schema.Struct({
  trustedDomainId: Schema.Number.pipe(T.HttpPath("trustedDomainId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  comments: Schema.optional(Schema.String),
  isRecent: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_recent")),
  isRegex: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_regex")),
  isSimilarity: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("is_similarity"),
  ),
  pattern: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/email-security/settings/trusted_domains/{trustedDomainId}",
  }),
) as unknown as Schema.Schema<PatchSettingTrustedDomainRequest>;

export interface PatchSettingTrustedDomainResponse {
  /** The unique identifier for the trusted domain. */
  id: number;
  createdAt: string;
  /** Select to prevent recently registered domains from triggering a Suspicious or Malicious disposition. */
  isRecent: boolean;
  isRegex: boolean;
  /** Select for partner or other approved domains that have similar spelling to your connected domains. Prevents listed domains from triggering a Spoof disposition. */
  isSimilarity: boolean;
  lastModified: string;
  pattern: string;
  comments?: string | null;
}

export const PatchSettingTrustedDomainResponse = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isRecent: Schema.Boolean.pipe(T.JsonName("is_recent")),
  isRegex: Schema.Boolean.pipe(T.JsonName("is_regex")),
  isSimilarity: Schema.Boolean.pipe(T.JsonName("is_similarity")),
  lastModified: Schema.String.pipe(T.JsonName("last_modified")),
  pattern: Schema.String,
  comments: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<PatchSettingTrustedDomainResponse>;

export const patchSettingTrustedDomain: (
  input: PatchSettingTrustedDomainRequest,
) => Effect.Effect<
  PatchSettingTrustedDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchSettingTrustedDomainRequest,
  output: PatchSettingTrustedDomainResponse,
  errors: [],
}));

export interface DeleteSettingTrustedDomainRequest {
  trustedDomainId: number;
  /** Account Identifier */
  accountId: string;
}

export const DeleteSettingTrustedDomainRequest = Schema.Struct({
  trustedDomainId: Schema.Number.pipe(T.HttpPath("trustedDomainId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/email-security/settings/trusted_domains/{trustedDomainId}",
  }),
) as unknown as Schema.Schema<DeleteSettingTrustedDomainRequest>;

export interface DeleteSettingTrustedDomainResponse {
  /** The unique identifier for the trusted domain. */
  id: number;
}

export const DeleteSettingTrustedDomainResponse = Schema.Struct({
  id: Schema.Number,
}) as unknown as Schema.Schema<DeleteSettingTrustedDomainResponse>;

export const deleteSettingTrustedDomain: (
  input: DeleteSettingTrustedDomainRequest,
) => Effect.Effect<
  DeleteSettingTrustedDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteSettingTrustedDomainRequest,
  output: DeleteSettingTrustedDomainResponse,
  errors: [],
}));

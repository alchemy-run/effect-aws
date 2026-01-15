/**
 * Cloudflare WORKERS-FOR-PLATFORMS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service workers-for-platforms
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// DispatchNamespace
// =============================================================================

export interface GetDispatchNamespaceRequest {
  dispatchNamespace: string;
  /** Identifier. */
  accountId: string;
}

export const GetDispatchNamespaceRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}",
  }),
) as unknown as Schema.Schema<GetDispatchNamespaceRequest>;

export interface GetDispatchNamespaceResponse {
  /** Identifier. */
  createdBy?: string;
  /** When the script was created. */
  createdOn?: string;
  /** Identifier. */
  modifiedBy?: string;
  /** When the script was last modified. */
  modifiedOn?: string;
  /** API Resource UUID tag. */
  namespaceId?: string;
  /** Name of the Workers for Platforms dispatch namespace. */
  namespaceName?: string;
  /** The current number of scripts in this Dispatch Namespace. */
  scriptCount?: number;
  /** Whether the Workers in the namespace are executed in a "trusted" manner. When a Worker is trusted, it has access to the shared caches for the zone in the Cache API, and has access to the `request.cf`  */
  trustedWorkers?: boolean;
}

export const GetDispatchNamespaceResponse = Schema.Struct({
  createdBy: Schema.optional(Schema.String).pipe(T.JsonName("created_by")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  modifiedBy: Schema.optional(Schema.String).pipe(T.JsonName("modified_by")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  namespaceId: Schema.optional(Schema.String).pipe(T.JsonName("namespace_id")),
  namespaceName: Schema.optional(Schema.String).pipe(T.JsonName("namespace_name")),
  scriptCount: Schema.optional(Schema.Number).pipe(T.JsonName("script_count")),
  trustedWorkers: Schema.optional(Schema.Boolean).pipe(T.JsonName("trusted_workers")),
}) as unknown as Schema.Schema<GetDispatchNamespaceResponse>;

export const getDispatchNamespace = API.make(() => ({
  input: GetDispatchNamespaceRequest,
  output: GetDispatchNamespaceResponse,
  errors: [],
}));

export interface CreateDispatchNamespaceRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The name of the dispatch namespace. */
  name?: string;
}

export const CreateDispatchNamespaceRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/workers/dispatch/namespaces" }),
) as unknown as Schema.Schema<CreateDispatchNamespaceRequest>;

export interface CreateDispatchNamespaceResponse {
  /** Identifier. */
  createdBy?: string;
  /** When the script was created. */
  createdOn?: string;
  /** Identifier. */
  modifiedBy?: string;
  /** When the script was last modified. */
  modifiedOn?: string;
  /** API Resource UUID tag. */
  namespaceId?: string;
  /** Name of the Workers for Platforms dispatch namespace. */
  namespaceName?: string;
  /** The current number of scripts in this Dispatch Namespace. */
  scriptCount?: number;
  /** Whether the Workers in the namespace are executed in a "trusted" manner. When a Worker is trusted, it has access to the shared caches for the zone in the Cache API, and has access to the `request.cf`  */
  trustedWorkers?: boolean;
}

export const CreateDispatchNamespaceResponse = Schema.Struct({
  createdBy: Schema.optional(Schema.String).pipe(T.JsonName("created_by")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  modifiedBy: Schema.optional(Schema.String).pipe(T.JsonName("modified_by")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  namespaceId: Schema.optional(Schema.String).pipe(T.JsonName("namespace_id")),
  namespaceName: Schema.optional(Schema.String).pipe(T.JsonName("namespace_name")),
  scriptCount: Schema.optional(Schema.Number).pipe(T.JsonName("script_count")),
  trustedWorkers: Schema.optional(Schema.Boolean).pipe(T.JsonName("trusted_workers")),
}) as unknown as Schema.Schema<CreateDispatchNamespaceResponse>;

export const createDispatchNamespace = API.make(() => ({
  input: CreateDispatchNamespaceRequest,
  output: CreateDispatchNamespaceResponse,
  errors: [],
}));

export interface DeleteDispatchNamespaceRequest {
  dispatchNamespace: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteDispatchNamespaceRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}",
  }),
) as unknown as Schema.Schema<DeleteDispatchNamespaceRequest>;

export type DeleteDispatchNamespaceResponse = unknown;

export const DeleteDispatchNamespaceResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDispatchNamespaceResponse>;

export const deleteDispatchNamespace = API.make(() => ({
  input: DeleteDispatchNamespaceRequest,
  output: DeleteDispatchNamespaceResponse,
  errors: [],
}));

// =============================================================================
// DispatchNamespaceScript
// =============================================================================

export interface GetDispatchNamespaceScriptRequest {
  dispatchNamespace: string;
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const GetDispatchNamespaceScriptRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}",
  }),
) as unknown as Schema.Schema<GetDispatchNamespaceScriptRequest>;

export interface GetDispatchNamespaceScriptResponse {
  /** When the script was created. */
  createdOn?: string;
  /** Name of the Workers for Platforms dispatch namespace. */
  dispatchNamespace?: string;
  /** When the script was last modified. */
  modifiedOn?: string;
  script?: unknown;
}

export const GetDispatchNamespaceScriptResponse = Schema.Struct({
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  dispatchNamespace: Schema.optional(Schema.String).pipe(T.JsonName("dispatch_namespace")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  script: Schema.optional(Schema.Unknown),
}) as unknown as Schema.Schema<GetDispatchNamespaceScriptResponse>;

export const getDispatchNamespaceScript = API.make(() => ({
  input: GetDispatchNamespaceScriptRequest,
  output: GetDispatchNamespaceScriptResponse,
  errors: [],
}));

export interface PutDispatchNamespaceScriptRequest {
  dispatchNamespace: string;
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: JSON-encoded metadata about the uploaded parts and Worker configuration. */
  metadata: {
    assets?: {
      config?: {
        headers?: string;
        redirects?: string;
        htmlHandling?:
          | "auto-trailing-slash"
          | "force-trailing-slash"
          | "drop-trailing-slash"
          | "none";
        notFoundHandling?: "none" | "404-page" | "single-page-application";
        runWorkerFirst?: string[] | boolean;
        serveDirectly?: boolean;
      };
      jwt?: string;
    };
    bindings?: (
      | { name: string; type: "ai" }
      | { dataset: string; name: string; type: "analytics_engine" }
      | { name: string; type: "assets" }
      | { name: string; type: "browser" }
      | { id: string; name: string; type: "d1" }
      | { name: string; part: string; type: "data_blob" }
      | {
          name: string;
          namespace: string;
          type: "dispatch_namespace";
          outbound?: { params?: string[]; worker?: { environment?: string; service?: string } };
        }
      | {
          name: string;
          type: "durable_object_namespace";
          className?: string;
          environment?: string;
          namespaceId?: string;
          scriptName?: string;
        }
      | { id: string; name: string; type: "hyperdrive" }
      | { name: string; type: "inherit"; oldName?: string; versionId?: string }
      | { name: string; type: "images" }
      | { json: string; name: string; type: "json" }
      | { name: string; namespaceId: string; type: "kv_namespace" }
      | { certificateId: string; name: string; type: "mtls_certificate" }
      | { name: string; text: string; type: "plain_text" }
      | { name: string; pipeline: string; type: "pipelines" }
      | { name: string; queueName: string; type: "queue" }
      | { bucketName: string; name: string; type: "r2_bucket"; jurisdiction?: "eu" | "fedramp" }
      | { name: string; text: string; type: "secret_text" }
      | {
          name: string;
          type: "send_email";
          allowedDestinationAddresses?: string[];
          allowedSenderAddresses?: string[];
          destinationAddress?: string;
        }
      | { name: string; service: string; type: "service"; environment?: string }
      | { name: string; service: string; type: "tail_consumer" }
      | { name: string; part: string; type: "text_blob" }
      | { indexName: string; name: string; type: "vectorize" }
      | { name: string; type: "version_metadata" }
      | { name: string; secretName: string; storeId: string; type: "secrets_store_secret" }
      | {
          algorithm: unknown;
          format: "raw" | "pkcs8" | "spki" | "jwk";
          name: string;
          type: "secret_key";
          usages: (
            | "encrypt"
            | "decrypt"
            | "sign"
            | "verify"
            | "deriveKey"
            | "deriveBits"
            | "wrapKey"
            | "unwrapKey"
          )[];
          keyBase64?: string;
          keyJwk?: unknown;
        }
      | {
          name: string;
          type: "workflow";
          workflowName: string;
          className?: string;
          scriptName?: string;
        }
      | { name: string; part: string; type: "wasm_module" }
    )[];
    bodyPart?: string;
    compatibilityDate?: string;
    compatibilityFlags?: string[];
    keepAssets?: boolean;
    keepBindings?: string[];
    limits?: { cpuMs?: number };
    logpush?: boolean;
    mainModule?: string;
    migrations?: unknown | { newTag?: string; oldTag?: string; steps?: unknown[] };
    observability?: {
      enabled: boolean;
      headSamplingRate?: number | null;
      logs?: {
        enabled: boolean;
        invocationLogs: boolean;
        destinations?: string[];
        headSamplingRate?: number | null;
        persist?: boolean;
      } | null;
    };
    placement?: { mode?: "smart" };
    tags?: string[];
    tailConsumers?: unknown[];
    usageModel?: "standard" | "bundled" | "unbound";
  };
  /** Body param: An array of modules (often JavaScript files) comprising a Worker script. At least one module must be present and referenced in the metadata as `main_module` or `body_part` by filename.<br/ */
  files?: unknown[];
}

export const PutDispatchNamespaceScriptRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  metadata: Schema.Struct({
    assets: Schema.optional(
      Schema.Struct({
        config: Schema.optional(
          Schema.Struct({
            headers: Schema.optional(Schema.String).pipe(T.JsonName("_headers")),
            redirects: Schema.optional(Schema.String).pipe(T.JsonName("_redirects")),
            htmlHandling: Schema.optional(
              Schema.Literal(
                "auto-trailing-slash",
                "force-trailing-slash",
                "drop-trailing-slash",
                "none",
              ),
            ).pipe(T.JsonName("html_handling")),
            notFoundHandling: Schema.optional(
              Schema.Literal("none", "404-page", "single-page-application"),
            ).pipe(T.JsonName("not_found_handling")),
            runWorkerFirst: Schema.optional(
              Schema.Union(Schema.Array(Schema.String), Schema.Boolean),
            ).pipe(T.JsonName("run_worker_first")),
            serveDirectly: Schema.optional(Schema.Boolean).pipe(T.JsonName("serve_directly")),
          }),
        ),
        jwt: Schema.optional(Schema.String),
      }),
    ),
    bindings: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("ai"),
          }),
          Schema.Struct({
            dataset: Schema.String,
            name: Schema.String,
            type: Schema.Literal("analytics_engine"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("assets"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("browser"),
          }),
          Schema.Struct({
            id: Schema.String,
            name: Schema.String,
            type: Schema.Literal("d1"),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("data_blob"),
          }),
          Schema.Struct({
            name: Schema.String,
            namespace: Schema.String,
            type: Schema.Literal("dispatch_namespace"),
            outbound: Schema.optional(
              Schema.Struct({
                params: Schema.optional(Schema.Array(Schema.String)),
                worker: Schema.optional(
                  Schema.Struct({
                    environment: Schema.optional(Schema.String),
                    service: Schema.optional(Schema.String),
                  }),
                ),
              }),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("durable_object_namespace"),
            className: Schema.optional(Schema.String).pipe(T.JsonName("class_name")),
            environment: Schema.optional(Schema.String),
            namespaceId: Schema.optional(Schema.String).pipe(T.JsonName("namespace_id")),
            scriptName: Schema.optional(Schema.String).pipe(T.JsonName("script_name")),
          }),
          Schema.Struct({
            id: Schema.String,
            name: Schema.String,
            type: Schema.Literal("hyperdrive"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("inherit"),
            oldName: Schema.optional(Schema.String).pipe(T.JsonName("old_name")),
            versionId: Schema.optional(Schema.String).pipe(T.JsonName("version_id")),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("images"),
          }),
          Schema.Struct({
            json: Schema.String,
            name: Schema.String,
            type: Schema.Literal("json"),
          }),
          Schema.Struct({
            name: Schema.String,
            namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
            type: Schema.Literal("kv_namespace"),
          }),
          Schema.Struct({
            certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
            name: Schema.String,
            type: Schema.Literal("mtls_certificate"),
          }),
          Schema.Struct({
            name: Schema.String,
            text: Schema.String,
            type: Schema.Literal("plain_text"),
          }),
          Schema.Struct({
            name: Schema.String,
            pipeline: Schema.String,
            type: Schema.Literal("pipelines"),
          }),
          Schema.Struct({
            name: Schema.String,
            queueName: Schema.String.pipe(T.JsonName("queue_name")),
            type: Schema.Literal("queue"),
          }),
          Schema.Struct({
            bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
            name: Schema.String,
            type: Schema.Literal("r2_bucket"),
            jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
          }),
          Schema.Struct({
            name: Schema.String,
            text: Schema.String,
            type: Schema.Literal("secret_text"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("send_email"),
            allowedDestinationAddresses: Schema.optional(Schema.Array(Schema.String)).pipe(
              T.JsonName("allowed_destination_addresses"),
            ),
            allowedSenderAddresses: Schema.optional(Schema.Array(Schema.String)).pipe(
              T.JsonName("allowed_sender_addresses"),
            ),
            destinationAddress: Schema.optional(Schema.String).pipe(
              T.JsonName("destination_address"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            service: Schema.String,
            type: Schema.Literal("service"),
            environment: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            name: Schema.String,
            service: Schema.String,
            type: Schema.Literal("tail_consumer"),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("text_blob"),
          }),
          Schema.Struct({
            indexName: Schema.String.pipe(T.JsonName("index_name")),
            name: Schema.String,
            type: Schema.Literal("vectorize"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("version_metadata"),
          }),
          Schema.Struct({
            name: Schema.String,
            secretName: Schema.String.pipe(T.JsonName("secret_name")),
            storeId: Schema.String.pipe(T.JsonName("store_id")),
            type: Schema.Literal("secrets_store_secret"),
          }),
          Schema.Struct({
            algorithm: Schema.Unknown,
            format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
            name: Schema.String,
            type: Schema.Literal("secret_key"),
            usages: Schema.Array(
              Schema.Literal(
                "encrypt",
                "decrypt",
                "sign",
                "verify",
                "deriveKey",
                "deriveBits",
                "wrapKey",
                "unwrapKey",
              ),
            ),
            keyBase64: Schema.optional(Schema.String).pipe(T.JsonName("key_base64")),
            keyJwk: Schema.optional(Schema.Unknown).pipe(T.JsonName("key_jwk")),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("workflow"),
            workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
            className: Schema.optional(Schema.String).pipe(T.JsonName("class_name")),
            scriptName: Schema.optional(Schema.String).pipe(T.JsonName("script_name")),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("wasm_module"),
          }),
        ),
      ),
    ),
    bodyPart: Schema.optional(Schema.String).pipe(T.JsonName("body_part")),
    compatibilityDate: Schema.optional(Schema.String).pipe(T.JsonName("compatibility_date")),
    compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("compatibility_flags"),
    ),
    keepAssets: Schema.optional(Schema.Boolean).pipe(T.JsonName("keep_assets")),
    keepBindings: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("keep_bindings")),
    limits: Schema.optional(
      Schema.Struct({
        cpuMs: Schema.optional(Schema.Number).pipe(T.JsonName("cpu_ms")),
      }),
    ),
    logpush: Schema.optional(Schema.Boolean),
    mainModule: Schema.optional(Schema.String).pipe(T.JsonName("main_module")),
    migrations: Schema.optional(
      Schema.Union(
        Schema.Unknown,
        Schema.Struct({
          newTag: Schema.optional(Schema.String).pipe(T.JsonName("new_tag")),
          oldTag: Schema.optional(Schema.String).pipe(T.JsonName("old_tag")),
          steps: Schema.optional(Schema.Array(Schema.Unknown)),
        }),
      ),
    ),
    observability: Schema.optional(
      Schema.Struct({
        enabled: Schema.Boolean,
        headSamplingRate: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
          T.JsonName("head_sampling_rate"),
        ),
        logs: Schema.optional(
          Schema.Union(
            Schema.Struct({
              enabled: Schema.Boolean,
              invocationLogs: Schema.Boolean.pipe(T.JsonName("invocation_logs")),
              destinations: Schema.optional(Schema.Array(Schema.String)),
              headSamplingRate: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
                T.JsonName("head_sampling_rate"),
              ),
              persist: Schema.optional(Schema.Boolean),
            }),
            Schema.Null,
          ),
        ),
      }),
    ),
    placement: Schema.optional(
      Schema.Struct({
        mode: Schema.optional(Schema.Literal("smart")),
      }),
    ),
    tags: Schema.optional(Schema.Array(Schema.String)),
    tailConsumers: Schema.optional(Schema.Array(Schema.Unknown)).pipe(T.JsonName("tail_consumers")),
    usageModel: Schema.optional(Schema.Literal("standard", "bundled", "unbound")).pipe(
      T.JsonName("usage_model"),
    ),
  }),
  files: Schema.optional(Schema.Array(Schema.Unknown)),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}",
  }),
) as unknown as Schema.Schema<PutDispatchNamespaceScriptRequest>;

export interface PutDispatchNamespaceScriptResponse {
  startupTimeMs: number;
  /** The id of the script in the Workers system. Usually the script name. */
  id?: string;
  /** Date indicating targeted support in the Workers runtime. Backwards incompatible fixes to the runtime following this date will not affect this Worker. */
  compatibilityDate?: string;
  /** Flags that enable or disable certain features in the Workers runtime. Used to enable upcoming features or opt in or out of specific changes not included in a `compatibility_date`. */
  compatibilityFlags?: string[];
  /** When the script was created. */
  createdOn?: string;
  /** Hashed script content, can be used in a If-None-Match header when updating. */
  etag?: string;
  /** The names of handlers exported as part of the default export. */
  handlers?: string[];
  /** Whether a Worker contains assets. */
  hasAssets?: boolean;
  /** Whether a Worker contains modules. */
  hasModules?: boolean;
  /** The client most recently used to deploy this Worker. */
  lastDeployedFrom?: string;
  /** Whether Logpush is turned on for the Worker. */
  logpush?: boolean;
  /** The tag of the Durable Object migration that was most recently applied for this Worker. */
  migrationTag?: string;
  /** When the script was last modified. */
  modifiedOn?: string;
  /** Named exports, such as Durable Object class implementations and named entrypoints. */
  namedHandlers?: { handlers?: string[]; name?: string }[];
  /** Configuration for [Smart Placement](https://developers.cloudflare.com/workers/configuration/smart-placement). */
  placement?: {
    lastAnalyzedAt?: string;
    mode?: "smart";
    status?: "SUCCESS" | "UNSUPPORTED_APPLICATION" | "INSUFFICIENT_INVOCATIONS";
  };
  /** @deprecated */
  placementMode?: "smart";
  /** @deprecated */
  placementStatus?: "SUCCESS" | "UNSUPPORTED_APPLICATION" | "INSUFFICIENT_INVOCATIONS";
  /** List of Workers that will consume logs from the attached Worker. */
  tailConsumers?: unknown[];
  /** Usage model for the Worker invocations. */
  usageModel?: "standard" | "bundled" | "unbound";
}

export const PutDispatchNamespaceScriptResponse = Schema.Struct({
  startupTimeMs: Schema.Number.pipe(T.JsonName("startup_time_ms")),
  id: Schema.optional(Schema.String),
  compatibilityDate: Schema.optional(Schema.String).pipe(T.JsonName("compatibility_date")),
  compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("compatibility_flags"),
  ),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  etag: Schema.optional(Schema.String),
  handlers: Schema.optional(Schema.Array(Schema.String)),
  hasAssets: Schema.optional(Schema.Boolean).pipe(T.JsonName("has_assets")),
  hasModules: Schema.optional(Schema.Boolean).pipe(T.JsonName("has_modules")),
  lastDeployedFrom: Schema.optional(Schema.String).pipe(T.JsonName("last_deployed_from")),
  logpush: Schema.optional(Schema.Boolean),
  migrationTag: Schema.optional(Schema.String).pipe(T.JsonName("migration_tag")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  namedHandlers: Schema.optional(
    Schema.Array(
      Schema.Struct({
        handlers: Schema.optional(Schema.Array(Schema.String)),
        name: Schema.optional(Schema.String),
      }),
    ),
  ).pipe(T.JsonName("named_handlers")),
  placement: Schema.optional(
    Schema.Struct({
      lastAnalyzedAt: Schema.optional(Schema.String).pipe(T.JsonName("last_analyzed_at")),
      mode: Schema.optional(Schema.Literal("smart")),
      status: Schema.optional(
        Schema.Literal("SUCCESS", "UNSUPPORTED_APPLICATION", "INSUFFICIENT_INVOCATIONS"),
      ),
    }),
  ),
  placementMode: Schema.optional(Schema.Literal("smart")).pipe(T.JsonName("placement_mode")),
  placementStatus: Schema.optional(
    Schema.Literal("SUCCESS", "UNSUPPORTED_APPLICATION", "INSUFFICIENT_INVOCATIONS"),
  ).pipe(T.JsonName("placement_status")),
  tailConsumers: Schema.optional(Schema.Array(Schema.Unknown)).pipe(T.JsonName("tail_consumers")),
  usageModel: Schema.optional(Schema.Literal("standard", "bundled", "unbound")).pipe(
    T.JsonName("usage_model"),
  ),
}) as unknown as Schema.Schema<PutDispatchNamespaceScriptResponse>;

export const putDispatchNamespaceScript = API.make(() => ({
  input: PutDispatchNamespaceScriptRequest,
  output: PutDispatchNamespaceScriptResponse,
  errors: [],
}));

export interface DeleteDispatchNamespaceScriptRequest {
  dispatchNamespace: string;
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: If set to true, delete will not be stopped by associated service binding, durable object, or other binding. Any of these associated bindings/durable objects will be deleted along with the */
  force?: boolean;
}

export const DeleteDispatchNamespaceScriptRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  force: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("force")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}",
  }),
) as unknown as Schema.Schema<DeleteDispatchNamespaceScriptRequest>;

export type DeleteDispatchNamespaceScriptResponse = unknown;

export const DeleteDispatchNamespaceScriptResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDispatchNamespaceScriptResponse>;

export const deleteDispatchNamespaceScript = API.make(() => ({
  input: DeleteDispatchNamespaceScriptRequest,
  output: DeleteDispatchNamespaceScriptResponse,
  errors: [],
}));

// =============================================================================
// DispatchNamespaceScriptAssetUpload
// =============================================================================

export interface CreateDispatchNamespaceScriptAssetUploadRequest {
  dispatchNamespace: string;
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: A manifest ([path]: {hash, size}) map of files to upload. As an example, `/blog/hello-world.html` would be a valid path key. */
  manifest: Record<string, unknown>;
}

export const CreateDispatchNamespaceScriptAssetUploadRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  manifest: Schema.Struct({}),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}/assets-upload-session",
  }),
) as unknown as Schema.Schema<CreateDispatchNamespaceScriptAssetUploadRequest>;

export interface CreateDispatchNamespaceScriptAssetUploadResponse {
  /** The requests to make to upload assets. */
  buckets?: string[][];
  /** A JWT to use as authentication for uploading assets. */
  jwt?: string;
}

export const CreateDispatchNamespaceScriptAssetUploadResponse = Schema.Struct({
  buckets: Schema.optional(Schema.Array(Schema.Array(Schema.String))),
  jwt: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateDispatchNamespaceScriptAssetUploadResponse>;

export const createDispatchNamespaceScriptAssetUpload = API.make(() => ({
  input: CreateDispatchNamespaceScriptAssetUploadRequest,
  output: CreateDispatchNamespaceScriptAssetUploadResponse,
  errors: [],
}));

// =============================================================================
// DispatchNamespaceScriptContent
// =============================================================================

export interface GetDispatchNamespaceScriptContentRequest {
  dispatchNamespace: string;
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const GetDispatchNamespaceScriptContentRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}/content",
  }),
) as unknown as Schema.Schema<GetDispatchNamespaceScriptContentRequest>;

export type GetDispatchNamespaceScriptContentResponse = unknown;

export const GetDispatchNamespaceScriptContentResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDispatchNamespaceScriptContentResponse>;

export const getDispatchNamespaceScriptContent = API.make(() => ({
  input: GetDispatchNamespaceScriptContentRequest,
  output: GetDispatchNamespaceScriptContentResponse,
  errors: [],
}));

export interface PutDispatchNamespaceScriptContentRequest {
  dispatchNamespace: string;
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Header param: The multipart name of a script upload part containing script content in service worker format. Alternative to including in a metadata part. */
  "CF-WORKER-BODY-PART"?: string;
  /** Header param: The multipart name of a script upload part containing script content in es module format. Alternative to including in a metadata part. */
  "CF-WORKER-MAIN-MODULE-PART"?: string;
  /** Body param: JSON-encoded metadata about the uploaded parts and Worker configuration. */
  metadata: unknown;
  /** Body param: An array of modules (often JavaScript files) comprising a Worker script. At least one module must be present and referenced in the metadata as `main_module` or `body_part` by filename.<br/ */
  files?: unknown[];
}

export const PutDispatchNamespaceScriptContentRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  "CF-WORKER-BODY-PART": Schema.optional(Schema.String).pipe(T.HttpHeader("'CF-WORKER-BODY-PART'")),
  "CF-WORKER-MAIN-MODULE-PART": Schema.optional(Schema.String).pipe(
    T.HttpHeader("'CF-WORKER-MAIN-MODULE-PART'"),
  ),
  metadata: Schema.Unknown,
  files: Schema.optional(Schema.Array(Schema.Unknown)),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}/content",
  }),
) as unknown as Schema.Schema<PutDispatchNamespaceScriptContentRequest>;

export type PutDispatchNamespaceScriptContentResponse = unknown;

export const PutDispatchNamespaceScriptContentResponse =
  Schema.Unknown as unknown as Schema.Schema<PutDispatchNamespaceScriptContentResponse>;

export const putDispatchNamespaceScriptContent = API.make(() => ({
  input: PutDispatchNamespaceScriptContentRequest,
  output: PutDispatchNamespaceScriptContentResponse,
  errors: [],
}));

// =============================================================================
// DispatchNamespaceScriptSecret
// =============================================================================

export interface GetDispatchNamespaceScriptSecretRequest {
  dispatchNamespace: string;
  scriptName: string;
  secretName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: Flag that indicates whether the secret name is URL encoded. */
  urlEncoded?: boolean;
}

export const GetDispatchNamespaceScriptSecretRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  secretName: Schema.String.pipe(T.HttpPath("secretName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  urlEncoded: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("url_encoded")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}/secrets/{secretName}",
  }),
) as unknown as Schema.Schema<GetDispatchNamespaceScriptSecretRequest>;

export type GetDispatchNamespaceScriptSecretResponse =
  | { name: string; type: "secret_text" }
  | {
      algorithm: unknown;
      format: "raw" | "pkcs8" | "spki" | "jwk";
      name: string;
      type: "secret_key";
      usages: (
        | "encrypt"
        | "decrypt"
        | "sign"
        | "verify"
        | "deriveKey"
        | "deriveBits"
        | "wrapKey"
        | "unwrapKey"
      )[];
    };

export const GetDispatchNamespaceScriptSecretResponse = Schema.Union(
  Schema.Struct({
    name: Schema.String,
    type: Schema.Literal("secret_text"),
  }),
  Schema.Struct({
    algorithm: Schema.Unknown,
    format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
    name: Schema.String,
    type: Schema.Literal("secret_key"),
    usages: Schema.Array(
      Schema.Literal(
        "encrypt",
        "decrypt",
        "sign",
        "verify",
        "deriveKey",
        "deriveBits",
        "wrapKey",
        "unwrapKey",
      ),
    ),
  }),
) as unknown as Schema.Schema<GetDispatchNamespaceScriptSecretResponse>;

export const getDispatchNamespaceScriptSecret = API.make(() => ({
  input: GetDispatchNamespaceScriptSecretRequest,
  output: GetDispatchNamespaceScriptSecretResponse,
  errors: [],
}));

export interface PutDispatchNamespaceScriptSecretRequest {
  dispatchNamespace: string;
  scriptName: string;
}

export const PutDispatchNamespaceScriptSecretRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}/secrets",
  }),
) as unknown as Schema.Schema<PutDispatchNamespaceScriptSecretRequest>;

export type PutDispatchNamespaceScriptSecretResponse =
  | { name: string; type: "secret_text" }
  | {
      algorithm: unknown;
      format: "raw" | "pkcs8" | "spki" | "jwk";
      name: string;
      type: "secret_key";
      usages: (
        | "encrypt"
        | "decrypt"
        | "sign"
        | "verify"
        | "deriveKey"
        | "deriveBits"
        | "wrapKey"
        | "unwrapKey"
      )[];
    };

export const PutDispatchNamespaceScriptSecretResponse = Schema.Union(
  Schema.Struct({
    name: Schema.String,
    type: Schema.Literal("secret_text"),
  }),
  Schema.Struct({
    algorithm: Schema.Unknown,
    format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
    name: Schema.String,
    type: Schema.Literal("secret_key"),
    usages: Schema.Array(
      Schema.Literal(
        "encrypt",
        "decrypt",
        "sign",
        "verify",
        "deriveKey",
        "deriveBits",
        "wrapKey",
        "unwrapKey",
      ),
    ),
  }),
) as unknown as Schema.Schema<PutDispatchNamespaceScriptSecretResponse>;

export const putDispatchNamespaceScriptSecret = API.make(() => ({
  input: PutDispatchNamespaceScriptSecretRequest,
  output: PutDispatchNamespaceScriptSecretResponse,
  errors: [],
}));

export interface DeleteDispatchNamespaceScriptSecretRequest {
  dispatchNamespace: string;
  scriptName: string;
  secretName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: Flag that indicates whether the secret name is URL encoded. */
  urlEncoded?: boolean;
}

export const DeleteDispatchNamespaceScriptSecretRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  secretName: Schema.String.pipe(T.HttpPath("secretName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  urlEncoded: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("url_encoded")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}/secrets/{secretName}",
  }),
) as unknown as Schema.Schema<DeleteDispatchNamespaceScriptSecretRequest>;

export type DeleteDispatchNamespaceScriptSecretResponse = unknown;

export const DeleteDispatchNamespaceScriptSecretResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDispatchNamespaceScriptSecretResponse>;

export const deleteDispatchNamespaceScriptSecret = API.make(() => ({
  input: DeleteDispatchNamespaceScriptSecretRequest,
  output: DeleteDispatchNamespaceScriptSecretResponse,
  errors: [],
}));

// =============================================================================
// DispatchNamespaceScriptSetting
// =============================================================================

export interface GetDispatchNamespaceScriptSettingRequest {
  dispatchNamespace: string;
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const GetDispatchNamespaceScriptSettingRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}/settings",
  }),
) as unknown as Schema.Schema<GetDispatchNamespaceScriptSettingRequest>;

export interface GetDispatchNamespaceScriptSettingResponse {
  /** List of bindings attached to a Worker. You can find more about bindings on our docs: https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/#bindings. */
  bindings?: (
    | { name: string; type: "ai" }
    | { dataset: string; name: string; type: "analytics_engine" }
    | { name: string; type: "assets" }
    | { name: string; type: "browser" }
    | { id: string; name: string; type: "d1" }
    | { name: string; part: string; type: "data_blob" }
    | {
        name: string;
        namespace: string;
        type: "dispatch_namespace";
        outbound?: { params?: string[]; worker?: { environment?: string; service?: string } };
      }
    | {
        name: string;
        type: "durable_object_namespace";
        className?: string;
        environment?: string;
        namespaceId?: string;
        scriptName?: string;
      }
    | { id: string; name: string; type: "hyperdrive" }
    | { name: string; type: "inherit"; oldName?: string; versionId?: string }
    | { name: string; type: "images" }
    | { json: string; name: string; type: "json" }
    | { name: string; namespaceId: string; type: "kv_namespace" }
    | { certificateId: string; name: string; type: "mtls_certificate" }
    | { name: string; text: string; type: "plain_text" }
    | { name: string; pipeline: string; type: "pipelines" }
    | { name: string; queueName: string; type: "queue" }
    | { bucketName: string; name: string; type: "r2_bucket"; jurisdiction?: "eu" | "fedramp" }
    | { name: string; type: "secret_text" }
    | {
        name: string;
        type: "send_email";
        allowedDestinationAddresses?: string[];
        allowedSenderAddresses?: string[];
        destinationAddress?: string;
      }
    | { name: string; service: string; type: "service"; environment?: string }
    | { name: string; service: string; type: "tail_consumer" }
    | { name: string; part: string; type: "text_blob" }
    | { indexName: string; name: string; type: "vectorize" }
    | { name: string; type: "version_metadata" }
    | { name: string; secretName: string; storeId: string; type: "secrets_store_secret" }
    | {
        algorithm: unknown;
        format: "raw" | "pkcs8" | "spki" | "jwk";
        name: string;
        type: "secret_key";
        usages: (
          | "encrypt"
          | "decrypt"
          | "sign"
          | "verify"
          | "deriveKey"
          | "deriveBits"
          | "wrapKey"
          | "unwrapKey"
        )[];
      }
    | {
        name: string;
        type: "workflow";
        workflowName: string;
        className?: string;
        scriptName?: string;
      }
    | { name: string; part: string; type: "wasm_module" }
  )[];
  /** Date indicating targeted support in the Workers runtime. Backwards incompatible fixes to the runtime following this date will not affect this Worker. */
  compatibilityDate?: string;
  /** Flags that enable or disable certain features in the Workers runtime. Used to enable upcoming features or opt in or out of specific changes not included in a `compatibility_date`. */
  compatibilityFlags?: string[];
  /** Limits to apply for this Worker. */
  limits?: { cpuMs?: number };
  /** Whether Logpush is turned on for the Worker. */
  logpush?: boolean;
  /** Observability settings for the Worker. */
  observability?: {
    enabled: boolean;
    headSamplingRate?: number | null;
    logs?: {
      enabled: boolean;
      invocationLogs: boolean;
      destinations?: string[];
      headSamplingRate?: number | null;
      persist?: boolean;
    } | null;
  };
  /** Configuration for [Smart Placement](https://developers.cloudflare.com/workers/configuration/smart-placement). */
  placement?: { mode?: "smart" };
  /** Tags associated with the Worker. */
  tags?: string[];
  /** List of Workers that will consume logs from the attached Worker. */
  tailConsumers?: unknown[];
  /** Usage model for the Worker invocations. */
  usageModel?: "standard" | "bundled" | "unbound";
}

export const GetDispatchNamespaceScriptSettingResponse = Schema.Struct({
  bindings: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("ai"),
        }),
        Schema.Struct({
          dataset: Schema.String,
          name: Schema.String,
          type: Schema.Literal("analytics_engine"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("assets"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("browser"),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("d1"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("data_blob"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespace: Schema.String,
          type: Schema.Literal("dispatch_namespace"),
          outbound: Schema.optional(
            Schema.Struct({
              params: Schema.optional(Schema.Array(Schema.String)),
              worker: Schema.optional(
                Schema.Struct({
                  environment: Schema.optional(Schema.String),
                  service: Schema.optional(Schema.String),
                }),
              ),
            }),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("durable_object_namespace"),
          className: Schema.optional(Schema.String).pipe(T.JsonName("class_name")),
          environment: Schema.optional(Schema.String),
          namespaceId: Schema.optional(Schema.String).pipe(T.JsonName("namespace_id")),
          scriptName: Schema.optional(Schema.String).pipe(T.JsonName("script_name")),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("hyperdrive"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("inherit"),
          oldName: Schema.optional(Schema.String).pipe(T.JsonName("old_name")),
          versionId: Schema.optional(Schema.String).pipe(T.JsonName("version_id")),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("images"),
        }),
        Schema.Struct({
          json: Schema.String,
          name: Schema.String,
          type: Schema.Literal("json"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
          type: Schema.Literal("kv_namespace"),
        }),
        Schema.Struct({
          certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
          name: Schema.String,
          type: Schema.Literal("mtls_certificate"),
        }),
        Schema.Struct({
          name: Schema.String,
          text: Schema.String,
          type: Schema.Literal("plain_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          pipeline: Schema.String,
          type: Schema.Literal("pipelines"),
        }),
        Schema.Struct({
          name: Schema.String,
          queueName: Schema.String.pipe(T.JsonName("queue_name")),
          type: Schema.Literal("queue"),
        }),
        Schema.Struct({
          bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
          name: Schema.String,
          type: Schema.Literal("r2_bucket"),
          jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("secret_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("send_email"),
          allowedDestinationAddresses: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("allowed_destination_addresses"),
          ),
          allowedSenderAddresses: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("allowed_sender_addresses"),
          ),
          destinationAddress: Schema.optional(Schema.String).pipe(
            T.JsonName("destination_address"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("service"),
          environment: Schema.optional(Schema.String),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("tail_consumer"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("text_blob"),
        }),
        Schema.Struct({
          indexName: Schema.String.pipe(T.JsonName("index_name")),
          name: Schema.String,
          type: Schema.Literal("vectorize"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("version_metadata"),
        }),
        Schema.Struct({
          name: Schema.String,
          secretName: Schema.String.pipe(T.JsonName("secret_name")),
          storeId: Schema.String.pipe(T.JsonName("store_id")),
          type: Schema.Literal("secrets_store_secret"),
        }),
        Schema.Struct({
          algorithm: Schema.Unknown,
          format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
          name: Schema.String,
          type: Schema.Literal("secret_key"),
          usages: Schema.Array(
            Schema.Literal(
              "encrypt",
              "decrypt",
              "sign",
              "verify",
              "deriveKey",
              "deriveBits",
              "wrapKey",
              "unwrapKey",
            ),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("workflow"),
          workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
          className: Schema.optional(Schema.String).pipe(T.JsonName("class_name")),
          scriptName: Schema.optional(Schema.String).pipe(T.JsonName("script_name")),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("wasm_module"),
        }),
      ),
    ),
  ),
  compatibilityDate: Schema.optional(Schema.String).pipe(T.JsonName("compatibility_date")),
  compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("compatibility_flags"),
  ),
  limits: Schema.optional(
    Schema.Struct({
      cpuMs: Schema.optional(Schema.Number).pipe(T.JsonName("cpu_ms")),
    }),
  ),
  logpush: Schema.optional(Schema.Boolean),
  observability: Schema.optional(
    Schema.Struct({
      enabled: Schema.Boolean,
      headSamplingRate: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
        T.JsonName("head_sampling_rate"),
      ),
      logs: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.Boolean,
            invocationLogs: Schema.Boolean.pipe(T.JsonName("invocation_logs")),
            destinations: Schema.optional(Schema.Array(Schema.String)),
            headSamplingRate: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
              T.JsonName("head_sampling_rate"),
            ),
            persist: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ),
    }),
  ),
  placement: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("smart")),
    }),
  ),
  tags: Schema.optional(Schema.Array(Schema.String)),
  tailConsumers: Schema.optional(Schema.Array(Schema.Unknown)).pipe(T.JsonName("tail_consumers")),
  usageModel: Schema.optional(Schema.Literal("standard", "bundled", "unbound")).pipe(
    T.JsonName("usage_model"),
  ),
}) as unknown as Schema.Schema<GetDispatchNamespaceScriptSettingResponse>;

export const getDispatchNamespaceScriptSetting = API.make(() => ({
  input: GetDispatchNamespaceScriptSettingRequest,
  output: GetDispatchNamespaceScriptSettingResponse,
  errors: [],
}));

export interface PatchDispatchNamespaceScriptSettingRequest {
  dispatchNamespace: string;
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  settings?: {
    bindings?: (
      | { name: string; type: "ai" }
      | { dataset: string; name: string; type: "analytics_engine" }
      | { name: string; type: "assets" }
      | { name: string; type: "browser" }
      | { id: string; name: string; type: "d1" }
      | { name: string; part: string; type: "data_blob" }
      | {
          name: string;
          namespace: string;
          type: "dispatch_namespace";
          outbound?: { params?: string[]; worker?: { environment?: string; service?: string } };
        }
      | {
          name: string;
          type: "durable_object_namespace";
          className?: string;
          environment?: string;
          namespaceId?: string;
          scriptName?: string;
        }
      | { id: string; name: string; type: "hyperdrive" }
      | { name: string; type: "inherit"; oldName?: string; versionId?: string }
      | { name: string; type: "images" }
      | { json: string; name: string; type: "json" }
      | { name: string; namespaceId: string; type: "kv_namespace" }
      | { certificateId: string; name: string; type: "mtls_certificate" }
      | { name: string; text: string; type: "plain_text" }
      | { name: string; pipeline: string; type: "pipelines" }
      | { name: string; queueName: string; type: "queue" }
      | { bucketName: string; name: string; type: "r2_bucket"; jurisdiction?: "eu" | "fedramp" }
      | { name: string; text: string; type: "secret_text" }
      | {
          name: string;
          type: "send_email";
          allowedDestinationAddresses?: string[];
          allowedSenderAddresses?: string[];
          destinationAddress?: string;
        }
      | { name: string; service: string; type: "service"; environment?: string }
      | { name: string; service: string; type: "tail_consumer" }
      | { name: string; part: string; type: "text_blob" }
      | { indexName: string; name: string; type: "vectorize" }
      | { name: string; type: "version_metadata" }
      | { name: string; secretName: string; storeId: string; type: "secrets_store_secret" }
      | {
          algorithm: unknown;
          format: "raw" | "pkcs8" | "spki" | "jwk";
          name: string;
          type: "secret_key";
          usages: (
            | "encrypt"
            | "decrypt"
            | "sign"
            | "verify"
            | "deriveKey"
            | "deriveBits"
            | "wrapKey"
            | "unwrapKey"
          )[];
          keyBase64?: string;
          keyJwk?: unknown;
        }
      | {
          name: string;
          type: "workflow";
          workflowName: string;
          className?: string;
          scriptName?: string;
        }
      | { name: string; part: string; type: "wasm_module" }
    )[];
    compatibilityDate?: string;
    compatibilityFlags?: string[];
    limits?: { cpuMs?: number };
    logpush?: boolean;
    migrations?: unknown | { newTag?: string; oldTag?: string; steps?: unknown[] };
    observability?: {
      enabled: boolean;
      headSamplingRate?: number | null;
      logs?: {
        enabled: boolean;
        invocationLogs: boolean;
        destinations?: string[];
        headSamplingRate?: number | null;
        persist?: boolean;
      } | null;
    };
    placement?: { mode?: "smart" };
    tags?: string[];
    tailConsumers?: unknown[];
    usageModel?: "standard" | "bundled" | "unbound";
  };
}

export const PatchDispatchNamespaceScriptSettingRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  settings: Schema.optional(
    Schema.Struct({
      bindings: Schema.optional(
        Schema.Array(
          Schema.Union(
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("ai"),
            }),
            Schema.Struct({
              dataset: Schema.String,
              name: Schema.String,
              type: Schema.Literal("analytics_engine"),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("assets"),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("browser"),
            }),
            Schema.Struct({
              id: Schema.String,
              name: Schema.String,
              type: Schema.Literal("d1"),
            }),
            Schema.Struct({
              name: Schema.String,
              part: Schema.String,
              type: Schema.Literal("data_blob"),
            }),
            Schema.Struct({
              name: Schema.String,
              namespace: Schema.String,
              type: Schema.Literal("dispatch_namespace"),
              outbound: Schema.optional(
                Schema.Struct({
                  params: Schema.optional(Schema.Array(Schema.String)),
                  worker: Schema.optional(
                    Schema.Struct({
                      environment: Schema.optional(Schema.String),
                      service: Schema.optional(Schema.String),
                    }),
                  ),
                }),
              ),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("durable_object_namespace"),
              className: Schema.optional(Schema.String).pipe(T.JsonName("class_name")),
              environment: Schema.optional(Schema.String),
              namespaceId: Schema.optional(Schema.String).pipe(T.JsonName("namespace_id")),
              scriptName: Schema.optional(Schema.String).pipe(T.JsonName("script_name")),
            }),
            Schema.Struct({
              id: Schema.String,
              name: Schema.String,
              type: Schema.Literal("hyperdrive"),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("inherit"),
              oldName: Schema.optional(Schema.String).pipe(T.JsonName("old_name")),
              versionId: Schema.optional(Schema.String).pipe(T.JsonName("version_id")),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("images"),
            }),
            Schema.Struct({
              json: Schema.String,
              name: Schema.String,
              type: Schema.Literal("json"),
            }),
            Schema.Struct({
              name: Schema.String,
              namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
              type: Schema.Literal("kv_namespace"),
            }),
            Schema.Struct({
              certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
              name: Schema.String,
              type: Schema.Literal("mtls_certificate"),
            }),
            Schema.Struct({
              name: Schema.String,
              text: Schema.String,
              type: Schema.Literal("plain_text"),
            }),
            Schema.Struct({
              name: Schema.String,
              pipeline: Schema.String,
              type: Schema.Literal("pipelines"),
            }),
            Schema.Struct({
              name: Schema.String,
              queueName: Schema.String.pipe(T.JsonName("queue_name")),
              type: Schema.Literal("queue"),
            }),
            Schema.Struct({
              bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
              name: Schema.String,
              type: Schema.Literal("r2_bucket"),
              jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
            }),
            Schema.Struct({
              name: Schema.String,
              text: Schema.String,
              type: Schema.Literal("secret_text"),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("send_email"),
              allowedDestinationAddresses: Schema.optional(Schema.Array(Schema.String)).pipe(
                T.JsonName("allowed_destination_addresses"),
              ),
              allowedSenderAddresses: Schema.optional(Schema.Array(Schema.String)).pipe(
                T.JsonName("allowed_sender_addresses"),
              ),
              destinationAddress: Schema.optional(Schema.String).pipe(
                T.JsonName("destination_address"),
              ),
            }),
            Schema.Struct({
              name: Schema.String,
              service: Schema.String,
              type: Schema.Literal("service"),
              environment: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              name: Schema.String,
              service: Schema.String,
              type: Schema.Literal("tail_consumer"),
            }),
            Schema.Struct({
              name: Schema.String,
              part: Schema.String,
              type: Schema.Literal("text_blob"),
            }),
            Schema.Struct({
              indexName: Schema.String.pipe(T.JsonName("index_name")),
              name: Schema.String,
              type: Schema.Literal("vectorize"),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("version_metadata"),
            }),
            Schema.Struct({
              name: Schema.String,
              secretName: Schema.String.pipe(T.JsonName("secret_name")),
              storeId: Schema.String.pipe(T.JsonName("store_id")),
              type: Schema.Literal("secrets_store_secret"),
            }),
            Schema.Struct({
              algorithm: Schema.Unknown,
              format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
              name: Schema.String,
              type: Schema.Literal("secret_key"),
              usages: Schema.Array(
                Schema.Literal(
                  "encrypt",
                  "decrypt",
                  "sign",
                  "verify",
                  "deriveKey",
                  "deriveBits",
                  "wrapKey",
                  "unwrapKey",
                ),
              ),
              keyBase64: Schema.optional(Schema.String).pipe(T.JsonName("key_base64")),
              keyJwk: Schema.optional(Schema.Unknown).pipe(T.JsonName("key_jwk")),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("workflow"),
              workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
              className: Schema.optional(Schema.String).pipe(T.JsonName("class_name")),
              scriptName: Schema.optional(Schema.String).pipe(T.JsonName("script_name")),
            }),
            Schema.Struct({
              name: Schema.String,
              part: Schema.String,
              type: Schema.Literal("wasm_module"),
            }),
          ),
        ),
      ),
      compatibilityDate: Schema.optional(Schema.String).pipe(T.JsonName("compatibility_date")),
      compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("compatibility_flags"),
      ),
      limits: Schema.optional(
        Schema.Struct({
          cpuMs: Schema.optional(Schema.Number).pipe(T.JsonName("cpu_ms")),
        }),
      ),
      logpush: Schema.optional(Schema.Boolean),
      migrations: Schema.optional(
        Schema.Union(
          Schema.Unknown,
          Schema.Struct({
            newTag: Schema.optional(Schema.String).pipe(T.JsonName("new_tag")),
            oldTag: Schema.optional(Schema.String).pipe(T.JsonName("old_tag")),
            steps: Schema.optional(Schema.Array(Schema.Unknown)),
          }),
        ),
      ),
      observability: Schema.optional(
        Schema.Struct({
          enabled: Schema.Boolean,
          headSamplingRate: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
            T.JsonName("head_sampling_rate"),
          ),
          logs: Schema.optional(
            Schema.Union(
              Schema.Struct({
                enabled: Schema.Boolean,
                invocationLogs: Schema.Boolean.pipe(T.JsonName("invocation_logs")),
                destinations: Schema.optional(Schema.Array(Schema.String)),
                headSamplingRate: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
                  T.JsonName("head_sampling_rate"),
                ),
                persist: Schema.optional(Schema.Boolean),
              }),
              Schema.Null,
            ),
          ),
        }),
      ),
      placement: Schema.optional(
        Schema.Struct({
          mode: Schema.optional(Schema.Literal("smart")),
        }),
      ),
      tags: Schema.optional(Schema.Array(Schema.String)),
      tailConsumers: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
        T.JsonName("tail_consumers"),
      ),
      usageModel: Schema.optional(Schema.Literal("standard", "bundled", "unbound")).pipe(
        T.JsonName("usage_model"),
      ),
    }),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}/settings",
  }),
) as unknown as Schema.Schema<PatchDispatchNamespaceScriptSettingRequest>;

export interface PatchDispatchNamespaceScriptSettingResponse {
  /** List of bindings attached to a Worker. You can find more about bindings on our docs: https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/#bindings. */
  bindings?: (
    | { name: string; type: "ai" }
    | { dataset: string; name: string; type: "analytics_engine" }
    | { name: string; type: "assets" }
    | { name: string; type: "browser" }
    | { id: string; name: string; type: "d1" }
    | { name: string; part: string; type: "data_blob" }
    | {
        name: string;
        namespace: string;
        type: "dispatch_namespace";
        outbound?: { params?: string[]; worker?: { environment?: string; service?: string } };
      }
    | {
        name: string;
        type: "durable_object_namespace";
        className?: string;
        environment?: string;
        namespaceId?: string;
        scriptName?: string;
      }
    | { id: string; name: string; type: "hyperdrive" }
    | { name: string; type: "inherit"; oldName?: string; versionId?: string }
    | { name: string; type: "images" }
    | { json: string; name: string; type: "json" }
    | { name: string; namespaceId: string; type: "kv_namespace" }
    | { certificateId: string; name: string; type: "mtls_certificate" }
    | { name: string; text: string; type: "plain_text" }
    | { name: string; pipeline: string; type: "pipelines" }
    | { name: string; queueName: string; type: "queue" }
    | { bucketName: string; name: string; type: "r2_bucket"; jurisdiction?: "eu" | "fedramp" }
    | { name: string; type: "secret_text" }
    | {
        name: string;
        type: "send_email";
        allowedDestinationAddresses?: string[];
        allowedSenderAddresses?: string[];
        destinationAddress?: string;
      }
    | { name: string; service: string; type: "service"; environment?: string }
    | { name: string; service: string; type: "tail_consumer" }
    | { name: string; part: string; type: "text_blob" }
    | { indexName: string; name: string; type: "vectorize" }
    | { name: string; type: "version_metadata" }
    | { name: string; secretName: string; storeId: string; type: "secrets_store_secret" }
    | {
        algorithm: unknown;
        format: "raw" | "pkcs8" | "spki" | "jwk";
        name: string;
        type: "secret_key";
        usages: (
          | "encrypt"
          | "decrypt"
          | "sign"
          | "verify"
          | "deriveKey"
          | "deriveBits"
          | "wrapKey"
          | "unwrapKey"
        )[];
      }
    | {
        name: string;
        type: "workflow";
        workflowName: string;
        className?: string;
        scriptName?: string;
      }
    | { name: string; part: string; type: "wasm_module" }
  )[];
  /** Date indicating targeted support in the Workers runtime. Backwards incompatible fixes to the runtime following this date will not affect this Worker. */
  compatibilityDate?: string;
  /** Flags that enable or disable certain features in the Workers runtime. Used to enable upcoming features or opt in or out of specific changes not included in a `compatibility_date`. */
  compatibilityFlags?: string[];
  /** Limits to apply for this Worker. */
  limits?: { cpuMs?: number };
  /** Whether Logpush is turned on for the Worker. */
  logpush?: boolean;
  /** Observability settings for the Worker. */
  observability?: {
    enabled: boolean;
    headSamplingRate?: number | null;
    logs?: {
      enabled: boolean;
      invocationLogs: boolean;
      destinations?: string[];
      headSamplingRate?: number | null;
      persist?: boolean;
    } | null;
  };
  /** Configuration for [Smart Placement](https://developers.cloudflare.com/workers/configuration/smart-placement). */
  placement?: { mode?: "smart" };
  /** Tags associated with the Worker. */
  tags?: string[];
  /** List of Workers that will consume logs from the attached Worker. */
  tailConsumers?: unknown[];
  /** Usage model for the Worker invocations. */
  usageModel?: "standard" | "bundled" | "unbound";
}

export const PatchDispatchNamespaceScriptSettingResponse = Schema.Struct({
  bindings: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("ai"),
        }),
        Schema.Struct({
          dataset: Schema.String,
          name: Schema.String,
          type: Schema.Literal("analytics_engine"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("assets"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("browser"),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("d1"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("data_blob"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespace: Schema.String,
          type: Schema.Literal("dispatch_namespace"),
          outbound: Schema.optional(
            Schema.Struct({
              params: Schema.optional(Schema.Array(Schema.String)),
              worker: Schema.optional(
                Schema.Struct({
                  environment: Schema.optional(Schema.String),
                  service: Schema.optional(Schema.String),
                }),
              ),
            }),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("durable_object_namespace"),
          className: Schema.optional(Schema.String).pipe(T.JsonName("class_name")),
          environment: Schema.optional(Schema.String),
          namespaceId: Schema.optional(Schema.String).pipe(T.JsonName("namespace_id")),
          scriptName: Schema.optional(Schema.String).pipe(T.JsonName("script_name")),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("hyperdrive"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("inherit"),
          oldName: Schema.optional(Schema.String).pipe(T.JsonName("old_name")),
          versionId: Schema.optional(Schema.String).pipe(T.JsonName("version_id")),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("images"),
        }),
        Schema.Struct({
          json: Schema.String,
          name: Schema.String,
          type: Schema.Literal("json"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
          type: Schema.Literal("kv_namespace"),
        }),
        Schema.Struct({
          certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
          name: Schema.String,
          type: Schema.Literal("mtls_certificate"),
        }),
        Schema.Struct({
          name: Schema.String,
          text: Schema.String,
          type: Schema.Literal("plain_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          pipeline: Schema.String,
          type: Schema.Literal("pipelines"),
        }),
        Schema.Struct({
          name: Schema.String,
          queueName: Schema.String.pipe(T.JsonName("queue_name")),
          type: Schema.Literal("queue"),
        }),
        Schema.Struct({
          bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
          name: Schema.String,
          type: Schema.Literal("r2_bucket"),
          jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("secret_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("send_email"),
          allowedDestinationAddresses: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("allowed_destination_addresses"),
          ),
          allowedSenderAddresses: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("allowed_sender_addresses"),
          ),
          destinationAddress: Schema.optional(Schema.String).pipe(
            T.JsonName("destination_address"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("service"),
          environment: Schema.optional(Schema.String),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("tail_consumer"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("text_blob"),
        }),
        Schema.Struct({
          indexName: Schema.String.pipe(T.JsonName("index_name")),
          name: Schema.String,
          type: Schema.Literal("vectorize"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("version_metadata"),
        }),
        Schema.Struct({
          name: Schema.String,
          secretName: Schema.String.pipe(T.JsonName("secret_name")),
          storeId: Schema.String.pipe(T.JsonName("store_id")),
          type: Schema.Literal("secrets_store_secret"),
        }),
        Schema.Struct({
          algorithm: Schema.Unknown,
          format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
          name: Schema.String,
          type: Schema.Literal("secret_key"),
          usages: Schema.Array(
            Schema.Literal(
              "encrypt",
              "decrypt",
              "sign",
              "verify",
              "deriveKey",
              "deriveBits",
              "wrapKey",
              "unwrapKey",
            ),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("workflow"),
          workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
          className: Schema.optional(Schema.String).pipe(T.JsonName("class_name")),
          scriptName: Schema.optional(Schema.String).pipe(T.JsonName("script_name")),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("wasm_module"),
        }),
      ),
    ),
  ),
  compatibilityDate: Schema.optional(Schema.String).pipe(T.JsonName("compatibility_date")),
  compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("compatibility_flags"),
  ),
  limits: Schema.optional(
    Schema.Struct({
      cpuMs: Schema.optional(Schema.Number).pipe(T.JsonName("cpu_ms")),
    }),
  ),
  logpush: Schema.optional(Schema.Boolean),
  observability: Schema.optional(
    Schema.Struct({
      enabled: Schema.Boolean,
      headSamplingRate: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
        T.JsonName("head_sampling_rate"),
      ),
      logs: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.Boolean,
            invocationLogs: Schema.Boolean.pipe(T.JsonName("invocation_logs")),
            destinations: Schema.optional(Schema.Array(Schema.String)),
            headSamplingRate: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
              T.JsonName("head_sampling_rate"),
            ),
            persist: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ),
    }),
  ),
  placement: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("smart")),
    }),
  ),
  tags: Schema.optional(Schema.Array(Schema.String)),
  tailConsumers: Schema.optional(Schema.Array(Schema.Unknown)).pipe(T.JsonName("tail_consumers")),
  usageModel: Schema.optional(Schema.Literal("standard", "bundled", "unbound")).pipe(
    T.JsonName("usage_model"),
  ),
}) as unknown as Schema.Schema<PatchDispatchNamespaceScriptSettingResponse>;

export const patchDispatchNamespaceScriptSetting = API.make(() => ({
  input: PatchDispatchNamespaceScriptSettingRequest,
  output: PatchDispatchNamespaceScriptSettingResponse,
  errors: [],
}));

// =============================================================================
// DispatchNamespaceScriptTag
// =============================================================================

export interface DeleteDispatchNamespaceScriptTagRequest {
  dispatchNamespace: string;
  scriptName: string;
  tag: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteDispatchNamespaceScriptTagRequest = Schema.Struct({
  dispatchNamespace: Schema.String.pipe(T.HttpPath("dispatchNamespace")),
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  tag: Schema.String.pipe(T.HttpPath("tag")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/dispatch/namespaces/{dispatchNamespace}/scripts/{scriptName}/tags/{tag}",
  }),
) as unknown as Schema.Schema<DeleteDispatchNamespaceScriptTagRequest>;

export type DeleteDispatchNamespaceScriptTagResponse = unknown;

export const DeleteDispatchNamespaceScriptTagResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDispatchNamespaceScriptTagResponse>;

export const deleteDispatchNamespaceScriptTag = API.make(() => ({
  input: DeleteDispatchNamespaceScriptTagRequest,
  output: DeleteDispatchNamespaceScriptTagResponse,
  errors: [],
}));

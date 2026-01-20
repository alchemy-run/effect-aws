/**
 * Cloudflare PAGES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service pages
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
// BuildCacheProject
// =============================================================================

export interface PurgeBuildCacheProjectRequest {
  projectName: string;
  /** Identifier */
  accountId: string;
}

export const PurgeBuildCacheProjectRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/pages/projects/{projectName}/purge_build_cache",
  }),
) as unknown as Schema.Schema<PurgeBuildCacheProjectRequest>;

export type PurgeBuildCacheProjectResponse = unknown;

export const PurgeBuildCacheProjectResponse =
  Schema.Unknown as unknown as Schema.Schema<PurgeBuildCacheProjectResponse>;

export const purgeBuildCacheProject: (
  input: PurgeBuildCacheProjectRequest,
) => Effect.Effect<
  PurgeBuildCacheProjectResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PurgeBuildCacheProjectRequest,
  output: PurgeBuildCacheProjectResponse,
  errors: [],
}));

// =============================================================================
// Project
// =============================================================================

export interface GetProjectRequest {
  projectName: string;
  /** Identifier */
  accountId: string;
}

export const GetProjectRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/pages/projects/{projectName}",
  }),
) as unknown as Schema.Schema<GetProjectRequest>;

export interface GetProjectResponse {
  /** Id of the project. */
  id?: string;
  /** Configs for the project build process. */
  buildConfig?: {
    buildCaching?: boolean | null;
    buildCommand?: string | null;
    destinationDir?: string | null;
    rootDir?: string | null;
    webAnalyticsTag?: string | null;
    webAnalyticsToken?: string | null;
  };
  /** Most recent deployment to the repo. */
  canonicalDeployment?: {
    id?: string;
    aliases?: string[] | null;
    buildConfig?: {
      buildCaching?: boolean | null;
      buildCommand?: string | null;
      destinationDir?: string | null;
      rootDir?: string | null;
      webAnalyticsTag?: string | null;
      webAnalyticsToken?: string | null;
    };
    createdOn?: string;
    deploymentTrigger?: {
      metadata?: {
        branch?: string;
        commitHash?: string;
        commitMessage?: string;
      };
      type?: "push" | "ad_hoc";
    };
    envVars?: Record<string, unknown>;
    environment?: "preview" | "production";
    isSkipped?: boolean;
    latestStage?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    };
    modifiedOn?: string;
    projectId?: string;
    projectName?: string;
    shortId?: string;
    source?: {
      config?: {
        deploymentsEnabled?: boolean;
        owner?: string;
        pathExcludes?: string[];
        pathIncludes?: string[];
        prCommentsEnabled?: boolean;
        previewBranchExcludes?: string[];
        previewBranchIncludes?: string[];
        previewDeploymentSetting?: "all" | "none" | "custom";
        productionBranch?: string;
        productionDeploymentsEnabled?: boolean;
        repoName?: string;
      };
      type?: string;
    };
    stages?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    }[];
    url?: string;
  } | null;
  /** When the project was created. */
  createdOn?: string;
  /** Configs for deployments in a project. */
  deploymentConfigs?: {
    preview?: {
      aiBindings?: Record<string, unknown> | null;
      analyticsEngineDatasets?: Record<string, unknown> | null;
      browsers?: Record<string, unknown> | null;
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      d1Databases?: Record<string, unknown> | null;
      durableObjectNamespaces?: Record<string, unknown> | null;
      envVars?: Record<string, unknown>;
      hyperdriveBindings?: Record<string, unknown> | null;
      kvNamespaces?: Record<string, unknown> | null;
      mtlsCertificates?: Record<string, unknown> | null;
      placement?: { mode?: string } | null;
      queueProducers?: Record<string, unknown> | null;
      r2Buckets?: Record<string, unknown> | null;
      services?: Record<string, unknown> | null;
      vectorizeBindings?: Record<string, unknown> | null;
    };
    production?: {
      aiBindings?: Record<string, unknown> | null;
      analyticsEngineDatasets?: Record<string, unknown> | null;
      browsers?: Record<string, unknown> | null;
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      d1Databases?: Record<string, unknown> | null;
      durableObjectNamespaces?: Record<string, unknown> | null;
      envVars?: Record<string, unknown>;
      hyperdriveBindings?: Record<string, unknown> | null;
      kvNamespaces?: Record<string, unknown> | null;
      mtlsCertificates?: Record<string, unknown> | null;
      placement?: { mode?: string } | null;
      queueProducers?: Record<string, unknown> | null;
      r2Buckets?: Record<string, unknown> | null;
      services?: Record<string, unknown> | null;
      vectorizeBindings?: Record<string, unknown> | null;
    };
  };
  /** A list of associated custom domains for the project. */
  domains?: string[];
  /** Most recent deployment to the repo. */
  latestDeployment?: {
    id?: string;
    aliases?: string[] | null;
    buildConfig?: {
      buildCaching?: boolean | null;
      buildCommand?: string | null;
      destinationDir?: string | null;
      rootDir?: string | null;
      webAnalyticsTag?: string | null;
      webAnalyticsToken?: string | null;
    };
    createdOn?: string;
    deploymentTrigger?: {
      metadata?: {
        branch?: string;
        commitHash?: string;
        commitMessage?: string;
      };
      type?: "push" | "ad_hoc";
    };
    envVars?: Record<string, unknown>;
    environment?: "preview" | "production";
    isSkipped?: boolean;
    latestStage?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    };
    modifiedOn?: string;
    projectId?: string;
    projectName?: string;
    shortId?: string;
    source?: {
      config?: {
        deploymentsEnabled?: boolean;
        owner?: string;
        pathExcludes?: string[];
        pathIncludes?: string[];
        prCommentsEnabled?: boolean;
        previewBranchExcludes?: string[];
        previewBranchIncludes?: string[];
        previewDeploymentSetting?: "all" | "none" | "custom";
        productionBranch?: string;
        productionDeploymentsEnabled?: boolean;
        repoName?: string;
      };
      type?: string;
    };
    stages?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    }[];
    url?: string;
  } | null;
  /** Name of the project. */
  name?: string;
  /** Production branch of the project. Used to identify production deployments. */
  productionBranch?: string;
  source?: {
    config?: {
      deploymentsEnabled?: boolean;
      owner?: string;
      pathExcludes?: string[];
      pathIncludes?: string[];
      prCommentsEnabled?: boolean;
      previewBranchExcludes?: string[];
      previewBranchIncludes?: string[];
      previewDeploymentSetting?: "all" | "none" | "custom";
      productionBranch?: string;
      productionDeploymentsEnabled?: boolean;
      repoName?: string;
    };
    type?: string;
  };
  /** The Cloudflare subdomain associated with the project. */
  subdomain?: string;
}

export const GetProjectResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  buildConfig: Schema.optional(
    Schema.Struct({
      buildCaching: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("build_caching")),
      buildCommand: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("build_command")),
      destinationDir: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("destination_dir")),
      rootDir: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("root_dir"),
      ),
      webAnalyticsTag: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("web_analytics_tag")),
      webAnalyticsToken: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("web_analytics_token")),
    }),
  ).pipe(T.JsonName("build_config")),
  canonicalDeployment: Schema.optional(
    Schema.Union(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        aliases: Schema.optional(
          Schema.Union(Schema.Array(Schema.String), Schema.Null),
        ),
        buildConfig: Schema.optional(
          Schema.Struct({
            buildCaching: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("build_caching")),
            buildCommand: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("build_command")),
            destinationDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("destination_dir")),
            rootDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("root_dir")),
            webAnalyticsTag: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_tag")),
            webAnalyticsToken: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_token")),
          }),
        ).pipe(T.JsonName("build_config")),
        createdOn: Schema.optional(Schema.String).pipe(
          T.JsonName("created_on"),
        ),
        deploymentTrigger: Schema.optional(
          Schema.Struct({
            metadata: Schema.optional(
              Schema.Struct({
                branch: Schema.optional(Schema.String),
                commitHash: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_hash"),
                ),
                commitMessage: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_message"),
                ),
              }),
            ),
            type: Schema.optional(Schema.Literal("push", "ad_hoc")),
          }),
        ).pipe(T.JsonName("deployment_trigger")),
        envVars: Schema.optional(Schema.Struct({})).pipe(
          T.JsonName("env_vars"),
        ),
        environment: Schema.optional(Schema.Literal("preview", "production")),
        isSkipped: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("is_skipped"),
        ),
        latestStage: Schema.optional(
          Schema.Struct({
            endedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("ended_on")),
            name: Schema.optional(
              Schema.Literal(
                "queued",
                "initialize",
                "clone_repo",
                "build",
                "deploy",
              ),
            ),
            startedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("started_on")),
            status: Schema.optional(
              Schema.Literal(
                "success",
                "idle",
                "active",
                "failure",
                "canceled",
              ),
            ),
          }),
        ).pipe(T.JsonName("latest_stage")),
        modifiedOn: Schema.optional(Schema.String).pipe(
          T.JsonName("modified_on"),
        ),
        projectId: Schema.optional(Schema.String).pipe(
          T.JsonName("project_id"),
        ),
        projectName: Schema.optional(Schema.String).pipe(
          T.JsonName("project_name"),
        ),
        shortId: Schema.optional(Schema.String).pipe(T.JsonName("short_id")),
        source: Schema.optional(
          Schema.Struct({
            config: Schema.optional(
              Schema.Struct({
                deploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("deployments_enabled"),
                ),
                owner: Schema.optional(Schema.String),
                pathExcludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_excludes"),
                ),
                pathIncludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_includes"),
                ),
                prCommentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("pr_comments_enabled"),
                ),
                previewBranchExcludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_excludes")),
                previewBranchIncludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_includes")),
                previewDeploymentSetting: Schema.optional(
                  Schema.Literal("all", "none", "custom"),
                ).pipe(T.JsonName("preview_deployment_setting")),
                productionBranch: Schema.optional(Schema.String).pipe(
                  T.JsonName("production_branch"),
                ),
                productionDeploymentsEnabled: Schema.optional(
                  Schema.Boolean,
                ).pipe(T.JsonName("production_deployments_enabled")),
                repoName: Schema.optional(Schema.String).pipe(
                  T.JsonName("repo_name"),
                ),
              }),
            ),
            type: Schema.optional(Schema.String),
          }),
        ),
        stages: Schema.optional(
          Schema.Array(
            Schema.Struct({
              endedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("ended_on")),
              name: Schema.optional(
                Schema.Literal(
                  "queued",
                  "initialize",
                  "clone_repo",
                  "build",
                  "deploy",
                ),
              ),
              startedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("started_on")),
              status: Schema.optional(
                Schema.Literal(
                  "success",
                  "idle",
                  "active",
                  "failure",
                  "canceled",
                ),
              ),
            }),
          ),
        ),
        url: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("canonical_deployment")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  deploymentConfigs: Schema.optional(
    Schema.Struct({
      preview: Schema.optional(
        Schema.Struct({
          aiBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("ai_bindings")),
          analyticsEngineDatasets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("analytics_engine_datasets")),
          browsers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          compatibilityDate: Schema.optional(Schema.String).pipe(
            T.JsonName("compatibility_date"),
          ),
          compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("compatibility_flags"),
          ),
          d1Databases: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("d1_databases")),
          durableObjectNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("durable_object_namespaces")),
          envVars: Schema.optional(Schema.Struct({})).pipe(
            T.JsonName("env_vars"),
          ),
          hyperdriveBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("hyperdrive_bindings")),
          kvNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("kv_namespaces")),
          mtlsCertificates: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("mtls_certificates")),
          placement: Schema.optional(
            Schema.Union(
              Schema.Struct({
                mode: Schema.optional(Schema.String),
              }),
              Schema.Null,
            ),
          ),
          queueProducers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("queue_producers")),
          r2Buckets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("r2_buckets")),
          services: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          vectorizeBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("vectorize_bindings")),
        }),
      ),
      production: Schema.optional(
        Schema.Struct({
          aiBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("ai_bindings")),
          analyticsEngineDatasets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("analytics_engine_datasets")),
          browsers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          compatibilityDate: Schema.optional(Schema.String).pipe(
            T.JsonName("compatibility_date"),
          ),
          compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("compatibility_flags"),
          ),
          d1Databases: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("d1_databases")),
          durableObjectNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("durable_object_namespaces")),
          envVars: Schema.optional(Schema.Struct({})).pipe(
            T.JsonName("env_vars"),
          ),
          hyperdriveBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("hyperdrive_bindings")),
          kvNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("kv_namespaces")),
          mtlsCertificates: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("mtls_certificates")),
          placement: Schema.optional(
            Schema.Union(
              Schema.Struct({
                mode: Schema.optional(Schema.String),
              }),
              Schema.Null,
            ),
          ),
          queueProducers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("queue_producers")),
          r2Buckets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("r2_buckets")),
          services: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          vectorizeBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("vectorize_bindings")),
        }),
      ),
    }),
  ).pipe(T.JsonName("deployment_configs")),
  domains: Schema.optional(Schema.Array(Schema.String)),
  latestDeployment: Schema.optional(
    Schema.Union(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        aliases: Schema.optional(
          Schema.Union(Schema.Array(Schema.String), Schema.Null),
        ),
        buildConfig: Schema.optional(
          Schema.Struct({
            buildCaching: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("build_caching")),
            buildCommand: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("build_command")),
            destinationDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("destination_dir")),
            rootDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("root_dir")),
            webAnalyticsTag: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_tag")),
            webAnalyticsToken: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_token")),
          }),
        ).pipe(T.JsonName("build_config")),
        createdOn: Schema.optional(Schema.String).pipe(
          T.JsonName("created_on"),
        ),
        deploymentTrigger: Schema.optional(
          Schema.Struct({
            metadata: Schema.optional(
              Schema.Struct({
                branch: Schema.optional(Schema.String),
                commitHash: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_hash"),
                ),
                commitMessage: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_message"),
                ),
              }),
            ),
            type: Schema.optional(Schema.Literal("push", "ad_hoc")),
          }),
        ).pipe(T.JsonName("deployment_trigger")),
        envVars: Schema.optional(Schema.Struct({})).pipe(
          T.JsonName("env_vars"),
        ),
        environment: Schema.optional(Schema.Literal("preview", "production")),
        isSkipped: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("is_skipped"),
        ),
        latestStage: Schema.optional(
          Schema.Struct({
            endedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("ended_on")),
            name: Schema.optional(
              Schema.Literal(
                "queued",
                "initialize",
                "clone_repo",
                "build",
                "deploy",
              ),
            ),
            startedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("started_on")),
            status: Schema.optional(
              Schema.Literal(
                "success",
                "idle",
                "active",
                "failure",
                "canceled",
              ),
            ),
          }),
        ).pipe(T.JsonName("latest_stage")),
        modifiedOn: Schema.optional(Schema.String).pipe(
          T.JsonName("modified_on"),
        ),
        projectId: Schema.optional(Schema.String).pipe(
          T.JsonName("project_id"),
        ),
        projectName: Schema.optional(Schema.String).pipe(
          T.JsonName("project_name"),
        ),
        shortId: Schema.optional(Schema.String).pipe(T.JsonName("short_id")),
        source: Schema.optional(
          Schema.Struct({
            config: Schema.optional(
              Schema.Struct({
                deploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("deployments_enabled"),
                ),
                owner: Schema.optional(Schema.String),
                pathExcludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_excludes"),
                ),
                pathIncludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_includes"),
                ),
                prCommentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("pr_comments_enabled"),
                ),
                previewBranchExcludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_excludes")),
                previewBranchIncludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_includes")),
                previewDeploymentSetting: Schema.optional(
                  Schema.Literal("all", "none", "custom"),
                ).pipe(T.JsonName("preview_deployment_setting")),
                productionBranch: Schema.optional(Schema.String).pipe(
                  T.JsonName("production_branch"),
                ),
                productionDeploymentsEnabled: Schema.optional(
                  Schema.Boolean,
                ).pipe(T.JsonName("production_deployments_enabled")),
                repoName: Schema.optional(Schema.String).pipe(
                  T.JsonName("repo_name"),
                ),
              }),
            ),
            type: Schema.optional(Schema.String),
          }),
        ),
        stages: Schema.optional(
          Schema.Array(
            Schema.Struct({
              endedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("ended_on")),
              name: Schema.optional(
                Schema.Literal(
                  "queued",
                  "initialize",
                  "clone_repo",
                  "build",
                  "deploy",
                ),
              ),
              startedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("started_on")),
              status: Schema.optional(
                Schema.Literal(
                  "success",
                  "idle",
                  "active",
                  "failure",
                  "canceled",
                ),
              ),
            }),
          ),
        ),
        url: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("latest_deployment")),
  name: Schema.optional(Schema.String),
  productionBranch: Schema.optional(Schema.String).pipe(
    T.JsonName("production_branch"),
  ),
  source: Schema.optional(
    Schema.Struct({
      config: Schema.optional(
        Schema.Struct({
          deploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("deployments_enabled"),
          ),
          owner: Schema.optional(Schema.String),
          pathExcludes: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("path_excludes"),
          ),
          pathIncludes: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("path_includes"),
          ),
          prCommentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("pr_comments_enabled"),
          ),
          previewBranchExcludes: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("preview_branch_excludes")),
          previewBranchIncludes: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("preview_branch_includes")),
          previewDeploymentSetting: Schema.optional(
            Schema.Literal("all", "none", "custom"),
          ).pipe(T.JsonName("preview_deployment_setting")),
          productionBranch: Schema.optional(Schema.String).pipe(
            T.JsonName("production_branch"),
          ),
          productionDeploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("production_deployments_enabled"),
          ),
          repoName: Schema.optional(Schema.String).pipe(
            T.JsonName("repo_name"),
          ),
        }),
      ),
      type: Schema.optional(Schema.String),
    }),
  ),
  subdomain: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetProjectResponse>;

export const getProject: (
  input: GetProjectRequest,
) => Effect.Effect<
  GetProjectResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetProjectRequest,
  output: GetProjectResponse,
  errors: [],
}));

export interface CreateProjectRequest {
  /** Path param: Identifier */
  accountId: string;
  /** Body param: Configs for the project build process. */
  buildConfig?: {
    buildCaching?: boolean | null;
    buildCommand?: string | null;
    destinationDir?: string | null;
    rootDir?: string | null;
    webAnalyticsTag?: string | null;
    webAnalyticsToken?: string | null;
  };
  /** Body param: Configs for deployments in a project. */
  deploymentConfigs?: {
    preview?: {
      aiBindings?: Record<string, unknown> | null;
      analyticsEngineDatasets?: Record<string, unknown> | null;
      browsers?: Record<string, unknown> | null;
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      d1Databases?: Record<string, unknown> | null;
      durableObjectNamespaces?: Record<string, unknown> | null;
      envVars?: Record<string, unknown>;
      hyperdriveBindings?: Record<string, unknown> | null;
      kvNamespaces?: Record<string, unknown> | null;
      mtlsCertificates?: Record<string, unknown> | null;
      placement?: { mode?: string } | null;
      queueProducers?: Record<string, unknown> | null;
      r2Buckets?: Record<string, unknown> | null;
      services?: Record<string, unknown> | null;
      vectorizeBindings?: Record<string, unknown> | null;
    };
    production?: {
      aiBindings?: Record<string, unknown> | null;
      analyticsEngineDatasets?: Record<string, unknown> | null;
      browsers?: Record<string, unknown> | null;
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      d1Databases?: Record<string, unknown> | null;
      durableObjectNamespaces?: Record<string, unknown> | null;
      envVars?: Record<string, unknown>;
      hyperdriveBindings?: Record<string, unknown> | null;
      kvNamespaces?: Record<string, unknown> | null;
      mtlsCertificates?: Record<string, unknown> | null;
      placement?: { mode?: string } | null;
      queueProducers?: Record<string, unknown> | null;
      r2Buckets?: Record<string, unknown> | null;
      services?: Record<string, unknown> | null;
      vectorizeBindings?: Record<string, unknown> | null;
    };
  };
  /** Body param: Name of the project. */
  name?: string;
  /** Body param: Production branch of the project. Used to identify production deployments. */
  productionBranch?: string;
  /** Body param: */
  source?: {
    config?: {
      deploymentsEnabled?: boolean;
      owner?: string;
      pathExcludes?: string[];
      pathIncludes?: string[];
      prCommentsEnabled?: boolean;
      previewBranchExcludes?: string[];
      previewBranchIncludes?: string[];
      previewDeploymentSetting?: "all" | "none" | "custom";
      productionBranch?: string;
      productionDeploymentsEnabled?: boolean;
      repoName?: string;
    };
    type?: string;
  };
}

export const CreateProjectRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  buildConfig: Schema.optional(
    Schema.Struct({
      buildCaching: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("build_caching")),
      buildCommand: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("build_command")),
      destinationDir: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("destination_dir")),
      rootDir: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("root_dir"),
      ),
      webAnalyticsTag: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("web_analytics_tag")),
      webAnalyticsToken: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("web_analytics_token")),
    }),
  ).pipe(T.JsonName("build_config")),
  deploymentConfigs: Schema.optional(
    Schema.Struct({
      preview: Schema.optional(
        Schema.Struct({
          aiBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("ai_bindings")),
          analyticsEngineDatasets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("analytics_engine_datasets")),
          browsers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          compatibilityDate: Schema.optional(Schema.String).pipe(
            T.JsonName("compatibility_date"),
          ),
          compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("compatibility_flags"),
          ),
          d1Databases: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("d1_databases")),
          durableObjectNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("durable_object_namespaces")),
          envVars: Schema.optional(Schema.Struct({})).pipe(
            T.JsonName("env_vars"),
          ),
          hyperdriveBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("hyperdrive_bindings")),
          kvNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("kv_namespaces")),
          mtlsCertificates: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("mtls_certificates")),
          placement: Schema.optional(
            Schema.Union(
              Schema.Struct({
                mode: Schema.optional(Schema.String),
              }),
              Schema.Null,
            ),
          ),
          queueProducers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("queue_producers")),
          r2Buckets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("r2_buckets")),
          services: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          vectorizeBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("vectorize_bindings")),
        }),
      ),
      production: Schema.optional(
        Schema.Struct({
          aiBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("ai_bindings")),
          analyticsEngineDatasets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("analytics_engine_datasets")),
          browsers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          compatibilityDate: Schema.optional(Schema.String).pipe(
            T.JsonName("compatibility_date"),
          ),
          compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("compatibility_flags"),
          ),
          d1Databases: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("d1_databases")),
          durableObjectNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("durable_object_namespaces")),
          envVars: Schema.optional(Schema.Struct({})).pipe(
            T.JsonName("env_vars"),
          ),
          hyperdriveBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("hyperdrive_bindings")),
          kvNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("kv_namespaces")),
          mtlsCertificates: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("mtls_certificates")),
          placement: Schema.optional(
            Schema.Union(
              Schema.Struct({
                mode: Schema.optional(Schema.String),
              }),
              Schema.Null,
            ),
          ),
          queueProducers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("queue_producers")),
          r2Buckets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("r2_buckets")),
          services: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          vectorizeBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("vectorize_bindings")),
        }),
      ),
    }),
  ).pipe(T.JsonName("deployment_configs")),
  name: Schema.optional(Schema.String),
  productionBranch: Schema.optional(Schema.String).pipe(
    T.JsonName("production_branch"),
  ),
  source: Schema.optional(
    Schema.Struct({
      config: Schema.optional(
        Schema.Struct({
          deploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("deployments_enabled"),
          ),
          owner: Schema.optional(Schema.String),
          pathExcludes: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("path_excludes"),
          ),
          pathIncludes: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("path_includes"),
          ),
          prCommentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("pr_comments_enabled"),
          ),
          previewBranchExcludes: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("preview_branch_excludes")),
          previewBranchIncludes: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("preview_branch_includes")),
          previewDeploymentSetting: Schema.optional(
            Schema.Literal("all", "none", "custom"),
          ).pipe(T.JsonName("preview_deployment_setting")),
          productionBranch: Schema.optional(Schema.String).pipe(
            T.JsonName("production_branch"),
          ),
          productionDeploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("production_deployments_enabled"),
          ),
          repoName: Schema.optional(Schema.String).pipe(
            T.JsonName("repo_name"),
          ),
        }),
      ),
      type: Schema.optional(Schema.String),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/pages/projects" }),
) as unknown as Schema.Schema<CreateProjectRequest>;

export interface CreateProjectResponse {
  /** Id of the project. */
  id?: string;
  /** Configs for the project build process. */
  buildConfig?: {
    buildCaching?: boolean | null;
    buildCommand?: string | null;
    destinationDir?: string | null;
    rootDir?: string | null;
    webAnalyticsTag?: string | null;
    webAnalyticsToken?: string | null;
  };
  /** Most recent deployment to the repo. */
  canonicalDeployment?: {
    id?: string;
    aliases?: string[] | null;
    buildConfig?: {
      buildCaching?: boolean | null;
      buildCommand?: string | null;
      destinationDir?: string | null;
      rootDir?: string | null;
      webAnalyticsTag?: string | null;
      webAnalyticsToken?: string | null;
    };
    createdOn?: string;
    deploymentTrigger?: {
      metadata?: {
        branch?: string;
        commitHash?: string;
        commitMessage?: string;
      };
      type?: "push" | "ad_hoc";
    };
    envVars?: Record<string, unknown>;
    environment?: "preview" | "production";
    isSkipped?: boolean;
    latestStage?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    };
    modifiedOn?: string;
    projectId?: string;
    projectName?: string;
    shortId?: string;
    source?: {
      config?: {
        deploymentsEnabled?: boolean;
        owner?: string;
        pathExcludes?: string[];
        pathIncludes?: string[];
        prCommentsEnabled?: boolean;
        previewBranchExcludes?: string[];
        previewBranchIncludes?: string[];
        previewDeploymentSetting?: "all" | "none" | "custom";
        productionBranch?: string;
        productionDeploymentsEnabled?: boolean;
        repoName?: string;
      };
      type?: string;
    };
    stages?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    }[];
    url?: string;
  } | null;
  /** When the project was created. */
  createdOn?: string;
  /** Configs for deployments in a project. */
  deploymentConfigs?: {
    preview?: {
      aiBindings?: Record<string, unknown> | null;
      analyticsEngineDatasets?: Record<string, unknown> | null;
      browsers?: Record<string, unknown> | null;
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      d1Databases?: Record<string, unknown> | null;
      durableObjectNamespaces?: Record<string, unknown> | null;
      envVars?: Record<string, unknown>;
      hyperdriveBindings?: Record<string, unknown> | null;
      kvNamespaces?: Record<string, unknown> | null;
      mtlsCertificates?: Record<string, unknown> | null;
      placement?: { mode?: string } | null;
      queueProducers?: Record<string, unknown> | null;
      r2Buckets?: Record<string, unknown> | null;
      services?: Record<string, unknown> | null;
      vectorizeBindings?: Record<string, unknown> | null;
    };
    production?: {
      aiBindings?: Record<string, unknown> | null;
      analyticsEngineDatasets?: Record<string, unknown> | null;
      browsers?: Record<string, unknown> | null;
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      d1Databases?: Record<string, unknown> | null;
      durableObjectNamespaces?: Record<string, unknown> | null;
      envVars?: Record<string, unknown>;
      hyperdriveBindings?: Record<string, unknown> | null;
      kvNamespaces?: Record<string, unknown> | null;
      mtlsCertificates?: Record<string, unknown> | null;
      placement?: { mode?: string } | null;
      queueProducers?: Record<string, unknown> | null;
      r2Buckets?: Record<string, unknown> | null;
      services?: Record<string, unknown> | null;
      vectorizeBindings?: Record<string, unknown> | null;
    };
  };
  /** A list of associated custom domains for the project. */
  domains?: string[];
  /** Most recent deployment to the repo. */
  latestDeployment?: {
    id?: string;
    aliases?: string[] | null;
    buildConfig?: {
      buildCaching?: boolean | null;
      buildCommand?: string | null;
      destinationDir?: string | null;
      rootDir?: string | null;
      webAnalyticsTag?: string | null;
      webAnalyticsToken?: string | null;
    };
    createdOn?: string;
    deploymentTrigger?: {
      metadata?: {
        branch?: string;
        commitHash?: string;
        commitMessage?: string;
      };
      type?: "push" | "ad_hoc";
    };
    envVars?: Record<string, unknown>;
    environment?: "preview" | "production";
    isSkipped?: boolean;
    latestStage?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    };
    modifiedOn?: string;
    projectId?: string;
    projectName?: string;
    shortId?: string;
    source?: {
      config?: {
        deploymentsEnabled?: boolean;
        owner?: string;
        pathExcludes?: string[];
        pathIncludes?: string[];
        prCommentsEnabled?: boolean;
        previewBranchExcludes?: string[];
        previewBranchIncludes?: string[];
        previewDeploymentSetting?: "all" | "none" | "custom";
        productionBranch?: string;
        productionDeploymentsEnabled?: boolean;
        repoName?: string;
      };
      type?: string;
    };
    stages?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    }[];
    url?: string;
  } | null;
  /** Name of the project. */
  name?: string;
  /** Production branch of the project. Used to identify production deployments. */
  productionBranch?: string;
  source?: {
    config?: {
      deploymentsEnabled?: boolean;
      owner?: string;
      pathExcludes?: string[];
      pathIncludes?: string[];
      prCommentsEnabled?: boolean;
      previewBranchExcludes?: string[];
      previewBranchIncludes?: string[];
      previewDeploymentSetting?: "all" | "none" | "custom";
      productionBranch?: string;
      productionDeploymentsEnabled?: boolean;
      repoName?: string;
    };
    type?: string;
  };
  /** The Cloudflare subdomain associated with the project. */
  subdomain?: string;
}

export const CreateProjectResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  buildConfig: Schema.optional(
    Schema.Struct({
      buildCaching: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("build_caching")),
      buildCommand: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("build_command")),
      destinationDir: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("destination_dir")),
      rootDir: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("root_dir"),
      ),
      webAnalyticsTag: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("web_analytics_tag")),
      webAnalyticsToken: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("web_analytics_token")),
    }),
  ).pipe(T.JsonName("build_config")),
  canonicalDeployment: Schema.optional(
    Schema.Union(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        aliases: Schema.optional(
          Schema.Union(Schema.Array(Schema.String), Schema.Null),
        ),
        buildConfig: Schema.optional(
          Schema.Struct({
            buildCaching: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("build_caching")),
            buildCommand: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("build_command")),
            destinationDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("destination_dir")),
            rootDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("root_dir")),
            webAnalyticsTag: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_tag")),
            webAnalyticsToken: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_token")),
          }),
        ).pipe(T.JsonName("build_config")),
        createdOn: Schema.optional(Schema.String).pipe(
          T.JsonName("created_on"),
        ),
        deploymentTrigger: Schema.optional(
          Schema.Struct({
            metadata: Schema.optional(
              Schema.Struct({
                branch: Schema.optional(Schema.String),
                commitHash: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_hash"),
                ),
                commitMessage: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_message"),
                ),
              }),
            ),
            type: Schema.optional(Schema.Literal("push", "ad_hoc")),
          }),
        ).pipe(T.JsonName("deployment_trigger")),
        envVars: Schema.optional(Schema.Struct({})).pipe(
          T.JsonName("env_vars"),
        ),
        environment: Schema.optional(Schema.Literal("preview", "production")),
        isSkipped: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("is_skipped"),
        ),
        latestStage: Schema.optional(
          Schema.Struct({
            endedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("ended_on")),
            name: Schema.optional(
              Schema.Literal(
                "queued",
                "initialize",
                "clone_repo",
                "build",
                "deploy",
              ),
            ),
            startedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("started_on")),
            status: Schema.optional(
              Schema.Literal(
                "success",
                "idle",
                "active",
                "failure",
                "canceled",
              ),
            ),
          }),
        ).pipe(T.JsonName("latest_stage")),
        modifiedOn: Schema.optional(Schema.String).pipe(
          T.JsonName("modified_on"),
        ),
        projectId: Schema.optional(Schema.String).pipe(
          T.JsonName("project_id"),
        ),
        projectName: Schema.optional(Schema.String).pipe(
          T.JsonName("project_name"),
        ),
        shortId: Schema.optional(Schema.String).pipe(T.JsonName("short_id")),
        source: Schema.optional(
          Schema.Struct({
            config: Schema.optional(
              Schema.Struct({
                deploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("deployments_enabled"),
                ),
                owner: Schema.optional(Schema.String),
                pathExcludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_excludes"),
                ),
                pathIncludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_includes"),
                ),
                prCommentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("pr_comments_enabled"),
                ),
                previewBranchExcludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_excludes")),
                previewBranchIncludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_includes")),
                previewDeploymentSetting: Schema.optional(
                  Schema.Literal("all", "none", "custom"),
                ).pipe(T.JsonName("preview_deployment_setting")),
                productionBranch: Schema.optional(Schema.String).pipe(
                  T.JsonName("production_branch"),
                ),
                productionDeploymentsEnabled: Schema.optional(
                  Schema.Boolean,
                ).pipe(T.JsonName("production_deployments_enabled")),
                repoName: Schema.optional(Schema.String).pipe(
                  T.JsonName("repo_name"),
                ),
              }),
            ),
            type: Schema.optional(Schema.String),
          }),
        ),
        stages: Schema.optional(
          Schema.Array(
            Schema.Struct({
              endedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("ended_on")),
              name: Schema.optional(
                Schema.Literal(
                  "queued",
                  "initialize",
                  "clone_repo",
                  "build",
                  "deploy",
                ),
              ),
              startedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("started_on")),
              status: Schema.optional(
                Schema.Literal(
                  "success",
                  "idle",
                  "active",
                  "failure",
                  "canceled",
                ),
              ),
            }),
          ),
        ),
        url: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("canonical_deployment")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  deploymentConfigs: Schema.optional(
    Schema.Struct({
      preview: Schema.optional(
        Schema.Struct({
          aiBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("ai_bindings")),
          analyticsEngineDatasets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("analytics_engine_datasets")),
          browsers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          compatibilityDate: Schema.optional(Schema.String).pipe(
            T.JsonName("compatibility_date"),
          ),
          compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("compatibility_flags"),
          ),
          d1Databases: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("d1_databases")),
          durableObjectNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("durable_object_namespaces")),
          envVars: Schema.optional(Schema.Struct({})).pipe(
            T.JsonName("env_vars"),
          ),
          hyperdriveBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("hyperdrive_bindings")),
          kvNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("kv_namespaces")),
          mtlsCertificates: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("mtls_certificates")),
          placement: Schema.optional(
            Schema.Union(
              Schema.Struct({
                mode: Schema.optional(Schema.String),
              }),
              Schema.Null,
            ),
          ),
          queueProducers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("queue_producers")),
          r2Buckets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("r2_buckets")),
          services: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          vectorizeBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("vectorize_bindings")),
        }),
      ),
      production: Schema.optional(
        Schema.Struct({
          aiBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("ai_bindings")),
          analyticsEngineDatasets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("analytics_engine_datasets")),
          browsers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          compatibilityDate: Schema.optional(Schema.String).pipe(
            T.JsonName("compatibility_date"),
          ),
          compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("compatibility_flags"),
          ),
          d1Databases: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("d1_databases")),
          durableObjectNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("durable_object_namespaces")),
          envVars: Schema.optional(Schema.Struct({})).pipe(
            T.JsonName("env_vars"),
          ),
          hyperdriveBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("hyperdrive_bindings")),
          kvNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("kv_namespaces")),
          mtlsCertificates: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("mtls_certificates")),
          placement: Schema.optional(
            Schema.Union(
              Schema.Struct({
                mode: Schema.optional(Schema.String),
              }),
              Schema.Null,
            ),
          ),
          queueProducers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("queue_producers")),
          r2Buckets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("r2_buckets")),
          services: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          vectorizeBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("vectorize_bindings")),
        }),
      ),
    }),
  ).pipe(T.JsonName("deployment_configs")),
  domains: Schema.optional(Schema.Array(Schema.String)),
  latestDeployment: Schema.optional(
    Schema.Union(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        aliases: Schema.optional(
          Schema.Union(Schema.Array(Schema.String), Schema.Null),
        ),
        buildConfig: Schema.optional(
          Schema.Struct({
            buildCaching: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("build_caching")),
            buildCommand: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("build_command")),
            destinationDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("destination_dir")),
            rootDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("root_dir")),
            webAnalyticsTag: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_tag")),
            webAnalyticsToken: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_token")),
          }),
        ).pipe(T.JsonName("build_config")),
        createdOn: Schema.optional(Schema.String).pipe(
          T.JsonName("created_on"),
        ),
        deploymentTrigger: Schema.optional(
          Schema.Struct({
            metadata: Schema.optional(
              Schema.Struct({
                branch: Schema.optional(Schema.String),
                commitHash: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_hash"),
                ),
                commitMessage: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_message"),
                ),
              }),
            ),
            type: Schema.optional(Schema.Literal("push", "ad_hoc")),
          }),
        ).pipe(T.JsonName("deployment_trigger")),
        envVars: Schema.optional(Schema.Struct({})).pipe(
          T.JsonName("env_vars"),
        ),
        environment: Schema.optional(Schema.Literal("preview", "production")),
        isSkipped: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("is_skipped"),
        ),
        latestStage: Schema.optional(
          Schema.Struct({
            endedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("ended_on")),
            name: Schema.optional(
              Schema.Literal(
                "queued",
                "initialize",
                "clone_repo",
                "build",
                "deploy",
              ),
            ),
            startedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("started_on")),
            status: Schema.optional(
              Schema.Literal(
                "success",
                "idle",
                "active",
                "failure",
                "canceled",
              ),
            ),
          }),
        ).pipe(T.JsonName("latest_stage")),
        modifiedOn: Schema.optional(Schema.String).pipe(
          T.JsonName("modified_on"),
        ),
        projectId: Schema.optional(Schema.String).pipe(
          T.JsonName("project_id"),
        ),
        projectName: Schema.optional(Schema.String).pipe(
          T.JsonName("project_name"),
        ),
        shortId: Schema.optional(Schema.String).pipe(T.JsonName("short_id")),
        source: Schema.optional(
          Schema.Struct({
            config: Schema.optional(
              Schema.Struct({
                deploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("deployments_enabled"),
                ),
                owner: Schema.optional(Schema.String),
                pathExcludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_excludes"),
                ),
                pathIncludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_includes"),
                ),
                prCommentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("pr_comments_enabled"),
                ),
                previewBranchExcludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_excludes")),
                previewBranchIncludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_includes")),
                previewDeploymentSetting: Schema.optional(
                  Schema.Literal("all", "none", "custom"),
                ).pipe(T.JsonName("preview_deployment_setting")),
                productionBranch: Schema.optional(Schema.String).pipe(
                  T.JsonName("production_branch"),
                ),
                productionDeploymentsEnabled: Schema.optional(
                  Schema.Boolean,
                ).pipe(T.JsonName("production_deployments_enabled")),
                repoName: Schema.optional(Schema.String).pipe(
                  T.JsonName("repo_name"),
                ),
              }),
            ),
            type: Schema.optional(Schema.String),
          }),
        ),
        stages: Schema.optional(
          Schema.Array(
            Schema.Struct({
              endedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("ended_on")),
              name: Schema.optional(
                Schema.Literal(
                  "queued",
                  "initialize",
                  "clone_repo",
                  "build",
                  "deploy",
                ),
              ),
              startedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("started_on")),
              status: Schema.optional(
                Schema.Literal(
                  "success",
                  "idle",
                  "active",
                  "failure",
                  "canceled",
                ),
              ),
            }),
          ),
        ),
        url: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("latest_deployment")),
  name: Schema.optional(Schema.String),
  productionBranch: Schema.optional(Schema.String).pipe(
    T.JsonName("production_branch"),
  ),
  source: Schema.optional(
    Schema.Struct({
      config: Schema.optional(
        Schema.Struct({
          deploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("deployments_enabled"),
          ),
          owner: Schema.optional(Schema.String),
          pathExcludes: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("path_excludes"),
          ),
          pathIncludes: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("path_includes"),
          ),
          prCommentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("pr_comments_enabled"),
          ),
          previewBranchExcludes: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("preview_branch_excludes")),
          previewBranchIncludes: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("preview_branch_includes")),
          previewDeploymentSetting: Schema.optional(
            Schema.Literal("all", "none", "custom"),
          ).pipe(T.JsonName("preview_deployment_setting")),
          productionBranch: Schema.optional(Schema.String).pipe(
            T.JsonName("production_branch"),
          ),
          productionDeploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("production_deployments_enabled"),
          ),
          repoName: Schema.optional(Schema.String).pipe(
            T.JsonName("repo_name"),
          ),
        }),
      ),
      type: Schema.optional(Schema.String),
    }),
  ),
  subdomain: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateProjectResponse>;

export const createProject: (
  input: CreateProjectRequest,
) => Effect.Effect<
  CreateProjectResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateProjectRequest,
  output: CreateProjectResponse,
  errors: [],
}));

export interface PatchProjectRequest {
  projectName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: Configs for the project build process. */
  buildConfig?: {
    buildCaching?: boolean | null;
    buildCommand?: string | null;
    destinationDir?: string | null;
    rootDir?: string | null;
    webAnalyticsTag?: string | null;
    webAnalyticsToken?: string | null;
  };
  /** Body param: Configs for deployments in a project. */
  deploymentConfigs?: {
    preview?: {
      aiBindings?: Record<string, unknown> | null;
      analyticsEngineDatasets?: Record<string, unknown> | null;
      browsers?: Record<string, unknown> | null;
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      d1Databases?: Record<string, unknown> | null;
      durableObjectNamespaces?: Record<string, unknown> | null;
      envVars?: Record<string, unknown>;
      hyperdriveBindings?: Record<string, unknown> | null;
      kvNamespaces?: Record<string, unknown> | null;
      mtlsCertificates?: Record<string, unknown> | null;
      placement?: { mode?: string } | null;
      queueProducers?: Record<string, unknown> | null;
      r2Buckets?: Record<string, unknown> | null;
      services?: Record<string, unknown> | null;
      vectorizeBindings?: Record<string, unknown> | null;
    };
    production?: {
      aiBindings?: Record<string, unknown> | null;
      analyticsEngineDatasets?: Record<string, unknown> | null;
      browsers?: Record<string, unknown> | null;
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      d1Databases?: Record<string, unknown> | null;
      durableObjectNamespaces?: Record<string, unknown> | null;
      envVars?: Record<string, unknown>;
      hyperdriveBindings?: Record<string, unknown> | null;
      kvNamespaces?: Record<string, unknown> | null;
      mtlsCertificates?: Record<string, unknown> | null;
      placement?: { mode?: string } | null;
      queueProducers?: Record<string, unknown> | null;
      r2Buckets?: Record<string, unknown> | null;
      services?: Record<string, unknown> | null;
      vectorizeBindings?: Record<string, unknown> | null;
    };
  };
  /** Body param: Name of the project. */
  name?: string;
  /** Body param: Production branch of the project. Used to identify production deployments. */
  productionBranch?: string;
  /** Body param: */
  source?: {
    config?: {
      deploymentsEnabled?: boolean;
      owner?: string;
      pathExcludes?: string[];
      pathIncludes?: string[];
      prCommentsEnabled?: boolean;
      previewBranchExcludes?: string[];
      previewBranchIncludes?: string[];
      previewDeploymentSetting?: "all" | "none" | "custom";
      productionBranch?: string;
      productionDeploymentsEnabled?: boolean;
      repoName?: string;
    };
    type?: string;
  };
}

export const PatchProjectRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  buildConfig: Schema.optional(
    Schema.Struct({
      buildCaching: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("build_caching")),
      buildCommand: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("build_command")),
      destinationDir: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("destination_dir")),
      rootDir: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("root_dir"),
      ),
      webAnalyticsTag: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("web_analytics_tag")),
      webAnalyticsToken: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("web_analytics_token")),
    }),
  ).pipe(T.JsonName("build_config")),
  deploymentConfigs: Schema.optional(
    Schema.Struct({
      preview: Schema.optional(
        Schema.Struct({
          aiBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("ai_bindings")),
          analyticsEngineDatasets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("analytics_engine_datasets")),
          browsers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          compatibilityDate: Schema.optional(Schema.String).pipe(
            T.JsonName("compatibility_date"),
          ),
          compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("compatibility_flags"),
          ),
          d1Databases: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("d1_databases")),
          durableObjectNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("durable_object_namespaces")),
          envVars: Schema.optional(Schema.Struct({})).pipe(
            T.JsonName("env_vars"),
          ),
          hyperdriveBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("hyperdrive_bindings")),
          kvNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("kv_namespaces")),
          mtlsCertificates: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("mtls_certificates")),
          placement: Schema.optional(
            Schema.Union(
              Schema.Struct({
                mode: Schema.optional(Schema.String),
              }),
              Schema.Null,
            ),
          ),
          queueProducers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("queue_producers")),
          r2Buckets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("r2_buckets")),
          services: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          vectorizeBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("vectorize_bindings")),
        }),
      ),
      production: Schema.optional(
        Schema.Struct({
          aiBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("ai_bindings")),
          analyticsEngineDatasets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("analytics_engine_datasets")),
          browsers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          compatibilityDate: Schema.optional(Schema.String).pipe(
            T.JsonName("compatibility_date"),
          ),
          compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("compatibility_flags"),
          ),
          d1Databases: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("d1_databases")),
          durableObjectNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("durable_object_namespaces")),
          envVars: Schema.optional(Schema.Struct({})).pipe(
            T.JsonName("env_vars"),
          ),
          hyperdriveBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("hyperdrive_bindings")),
          kvNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("kv_namespaces")),
          mtlsCertificates: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("mtls_certificates")),
          placement: Schema.optional(
            Schema.Union(
              Schema.Struct({
                mode: Schema.optional(Schema.String),
              }),
              Schema.Null,
            ),
          ),
          queueProducers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("queue_producers")),
          r2Buckets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("r2_buckets")),
          services: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          vectorizeBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("vectorize_bindings")),
        }),
      ),
    }),
  ).pipe(T.JsonName("deployment_configs")),
  name: Schema.optional(Schema.String),
  productionBranch: Schema.optional(Schema.String).pipe(
    T.JsonName("production_branch"),
  ),
  source: Schema.optional(
    Schema.Struct({
      config: Schema.optional(
        Schema.Struct({
          deploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("deployments_enabled"),
          ),
          owner: Schema.optional(Schema.String),
          pathExcludes: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("path_excludes"),
          ),
          pathIncludes: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("path_includes"),
          ),
          prCommentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("pr_comments_enabled"),
          ),
          previewBranchExcludes: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("preview_branch_excludes")),
          previewBranchIncludes: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("preview_branch_includes")),
          previewDeploymentSetting: Schema.optional(
            Schema.Literal("all", "none", "custom"),
          ).pipe(T.JsonName("preview_deployment_setting")),
          productionBranch: Schema.optional(Schema.String).pipe(
            T.JsonName("production_branch"),
          ),
          productionDeploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("production_deployments_enabled"),
          ),
          repoName: Schema.optional(Schema.String).pipe(
            T.JsonName("repo_name"),
          ),
        }),
      ),
      type: Schema.optional(Schema.String),
    }),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/pages/projects/{projectName}",
  }),
) as unknown as Schema.Schema<PatchProjectRequest>;

export interface PatchProjectResponse {
  /** Id of the project. */
  id?: string;
  /** Configs for the project build process. */
  buildConfig?: {
    buildCaching?: boolean | null;
    buildCommand?: string | null;
    destinationDir?: string | null;
    rootDir?: string | null;
    webAnalyticsTag?: string | null;
    webAnalyticsToken?: string | null;
  };
  /** Most recent deployment to the repo. */
  canonicalDeployment?: {
    id?: string;
    aliases?: string[] | null;
    buildConfig?: {
      buildCaching?: boolean | null;
      buildCommand?: string | null;
      destinationDir?: string | null;
      rootDir?: string | null;
      webAnalyticsTag?: string | null;
      webAnalyticsToken?: string | null;
    };
    createdOn?: string;
    deploymentTrigger?: {
      metadata?: {
        branch?: string;
        commitHash?: string;
        commitMessage?: string;
      };
      type?: "push" | "ad_hoc";
    };
    envVars?: Record<string, unknown>;
    environment?: "preview" | "production";
    isSkipped?: boolean;
    latestStage?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    };
    modifiedOn?: string;
    projectId?: string;
    projectName?: string;
    shortId?: string;
    source?: {
      config?: {
        deploymentsEnabled?: boolean;
        owner?: string;
        pathExcludes?: string[];
        pathIncludes?: string[];
        prCommentsEnabled?: boolean;
        previewBranchExcludes?: string[];
        previewBranchIncludes?: string[];
        previewDeploymentSetting?: "all" | "none" | "custom";
        productionBranch?: string;
        productionDeploymentsEnabled?: boolean;
        repoName?: string;
      };
      type?: string;
    };
    stages?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    }[];
    url?: string;
  } | null;
  /** When the project was created. */
  createdOn?: string;
  /** Configs for deployments in a project. */
  deploymentConfigs?: {
    preview?: {
      aiBindings?: Record<string, unknown> | null;
      analyticsEngineDatasets?: Record<string, unknown> | null;
      browsers?: Record<string, unknown> | null;
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      d1Databases?: Record<string, unknown> | null;
      durableObjectNamespaces?: Record<string, unknown> | null;
      envVars?: Record<string, unknown>;
      hyperdriveBindings?: Record<string, unknown> | null;
      kvNamespaces?: Record<string, unknown> | null;
      mtlsCertificates?: Record<string, unknown> | null;
      placement?: { mode?: string } | null;
      queueProducers?: Record<string, unknown> | null;
      r2Buckets?: Record<string, unknown> | null;
      services?: Record<string, unknown> | null;
      vectorizeBindings?: Record<string, unknown> | null;
    };
    production?: {
      aiBindings?: Record<string, unknown> | null;
      analyticsEngineDatasets?: Record<string, unknown> | null;
      browsers?: Record<string, unknown> | null;
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      d1Databases?: Record<string, unknown> | null;
      durableObjectNamespaces?: Record<string, unknown> | null;
      envVars?: Record<string, unknown>;
      hyperdriveBindings?: Record<string, unknown> | null;
      kvNamespaces?: Record<string, unknown> | null;
      mtlsCertificates?: Record<string, unknown> | null;
      placement?: { mode?: string } | null;
      queueProducers?: Record<string, unknown> | null;
      r2Buckets?: Record<string, unknown> | null;
      services?: Record<string, unknown> | null;
      vectorizeBindings?: Record<string, unknown> | null;
    };
  };
  /** A list of associated custom domains for the project. */
  domains?: string[];
  /** Most recent deployment to the repo. */
  latestDeployment?: {
    id?: string;
    aliases?: string[] | null;
    buildConfig?: {
      buildCaching?: boolean | null;
      buildCommand?: string | null;
      destinationDir?: string | null;
      rootDir?: string | null;
      webAnalyticsTag?: string | null;
      webAnalyticsToken?: string | null;
    };
    createdOn?: string;
    deploymentTrigger?: {
      metadata?: {
        branch?: string;
        commitHash?: string;
        commitMessage?: string;
      };
      type?: "push" | "ad_hoc";
    };
    envVars?: Record<string, unknown>;
    environment?: "preview" | "production";
    isSkipped?: boolean;
    latestStage?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    };
    modifiedOn?: string;
    projectId?: string;
    projectName?: string;
    shortId?: string;
    source?: {
      config?: {
        deploymentsEnabled?: boolean;
        owner?: string;
        pathExcludes?: string[];
        pathIncludes?: string[];
        prCommentsEnabled?: boolean;
        previewBranchExcludes?: string[];
        previewBranchIncludes?: string[];
        previewDeploymentSetting?: "all" | "none" | "custom";
        productionBranch?: string;
        productionDeploymentsEnabled?: boolean;
        repoName?: string;
      };
      type?: string;
    };
    stages?: {
      endedOn?: string | null;
      name?: "queued" | "initialize" | "clone_repo" | "build" | "deploy";
      startedOn?: string | null;
      status?: "success" | "idle" | "active" | "failure" | "canceled";
    }[];
    url?: string;
  } | null;
  /** Name of the project. */
  name?: string;
  /** Production branch of the project. Used to identify production deployments. */
  productionBranch?: string;
  source?: {
    config?: {
      deploymentsEnabled?: boolean;
      owner?: string;
      pathExcludes?: string[];
      pathIncludes?: string[];
      prCommentsEnabled?: boolean;
      previewBranchExcludes?: string[];
      previewBranchIncludes?: string[];
      previewDeploymentSetting?: "all" | "none" | "custom";
      productionBranch?: string;
      productionDeploymentsEnabled?: boolean;
      repoName?: string;
    };
    type?: string;
  };
  /** The Cloudflare subdomain associated with the project. */
  subdomain?: string;
}

export const PatchProjectResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  buildConfig: Schema.optional(
    Schema.Struct({
      buildCaching: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("build_caching")),
      buildCommand: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("build_command")),
      destinationDir: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("destination_dir")),
      rootDir: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("root_dir"),
      ),
      webAnalyticsTag: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("web_analytics_tag")),
      webAnalyticsToken: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("web_analytics_token")),
    }),
  ).pipe(T.JsonName("build_config")),
  canonicalDeployment: Schema.optional(
    Schema.Union(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        aliases: Schema.optional(
          Schema.Union(Schema.Array(Schema.String), Schema.Null),
        ),
        buildConfig: Schema.optional(
          Schema.Struct({
            buildCaching: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("build_caching")),
            buildCommand: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("build_command")),
            destinationDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("destination_dir")),
            rootDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("root_dir")),
            webAnalyticsTag: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_tag")),
            webAnalyticsToken: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_token")),
          }),
        ).pipe(T.JsonName("build_config")),
        createdOn: Schema.optional(Schema.String).pipe(
          T.JsonName("created_on"),
        ),
        deploymentTrigger: Schema.optional(
          Schema.Struct({
            metadata: Schema.optional(
              Schema.Struct({
                branch: Schema.optional(Schema.String),
                commitHash: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_hash"),
                ),
                commitMessage: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_message"),
                ),
              }),
            ),
            type: Schema.optional(Schema.Literal("push", "ad_hoc")),
          }),
        ).pipe(T.JsonName("deployment_trigger")),
        envVars: Schema.optional(Schema.Struct({})).pipe(
          T.JsonName("env_vars"),
        ),
        environment: Schema.optional(Schema.Literal("preview", "production")),
        isSkipped: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("is_skipped"),
        ),
        latestStage: Schema.optional(
          Schema.Struct({
            endedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("ended_on")),
            name: Schema.optional(
              Schema.Literal(
                "queued",
                "initialize",
                "clone_repo",
                "build",
                "deploy",
              ),
            ),
            startedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("started_on")),
            status: Schema.optional(
              Schema.Literal(
                "success",
                "idle",
                "active",
                "failure",
                "canceled",
              ),
            ),
          }),
        ).pipe(T.JsonName("latest_stage")),
        modifiedOn: Schema.optional(Schema.String).pipe(
          T.JsonName("modified_on"),
        ),
        projectId: Schema.optional(Schema.String).pipe(
          T.JsonName("project_id"),
        ),
        projectName: Schema.optional(Schema.String).pipe(
          T.JsonName("project_name"),
        ),
        shortId: Schema.optional(Schema.String).pipe(T.JsonName("short_id")),
        source: Schema.optional(
          Schema.Struct({
            config: Schema.optional(
              Schema.Struct({
                deploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("deployments_enabled"),
                ),
                owner: Schema.optional(Schema.String),
                pathExcludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_excludes"),
                ),
                pathIncludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_includes"),
                ),
                prCommentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("pr_comments_enabled"),
                ),
                previewBranchExcludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_excludes")),
                previewBranchIncludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_includes")),
                previewDeploymentSetting: Schema.optional(
                  Schema.Literal("all", "none", "custom"),
                ).pipe(T.JsonName("preview_deployment_setting")),
                productionBranch: Schema.optional(Schema.String).pipe(
                  T.JsonName("production_branch"),
                ),
                productionDeploymentsEnabled: Schema.optional(
                  Schema.Boolean,
                ).pipe(T.JsonName("production_deployments_enabled")),
                repoName: Schema.optional(Schema.String).pipe(
                  T.JsonName("repo_name"),
                ),
              }),
            ),
            type: Schema.optional(Schema.String),
          }),
        ),
        stages: Schema.optional(
          Schema.Array(
            Schema.Struct({
              endedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("ended_on")),
              name: Schema.optional(
                Schema.Literal(
                  "queued",
                  "initialize",
                  "clone_repo",
                  "build",
                  "deploy",
                ),
              ),
              startedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("started_on")),
              status: Schema.optional(
                Schema.Literal(
                  "success",
                  "idle",
                  "active",
                  "failure",
                  "canceled",
                ),
              ),
            }),
          ),
        ),
        url: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("canonical_deployment")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  deploymentConfigs: Schema.optional(
    Schema.Struct({
      preview: Schema.optional(
        Schema.Struct({
          aiBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("ai_bindings")),
          analyticsEngineDatasets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("analytics_engine_datasets")),
          browsers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          compatibilityDate: Schema.optional(Schema.String).pipe(
            T.JsonName("compatibility_date"),
          ),
          compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("compatibility_flags"),
          ),
          d1Databases: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("d1_databases")),
          durableObjectNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("durable_object_namespaces")),
          envVars: Schema.optional(Schema.Struct({})).pipe(
            T.JsonName("env_vars"),
          ),
          hyperdriveBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("hyperdrive_bindings")),
          kvNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("kv_namespaces")),
          mtlsCertificates: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("mtls_certificates")),
          placement: Schema.optional(
            Schema.Union(
              Schema.Struct({
                mode: Schema.optional(Schema.String),
              }),
              Schema.Null,
            ),
          ),
          queueProducers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("queue_producers")),
          r2Buckets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("r2_buckets")),
          services: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          vectorizeBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("vectorize_bindings")),
        }),
      ),
      production: Schema.optional(
        Schema.Struct({
          aiBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("ai_bindings")),
          analyticsEngineDatasets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("analytics_engine_datasets")),
          browsers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          compatibilityDate: Schema.optional(Schema.String).pipe(
            T.JsonName("compatibility_date"),
          ),
          compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("compatibility_flags"),
          ),
          d1Databases: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("d1_databases")),
          durableObjectNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("durable_object_namespaces")),
          envVars: Schema.optional(Schema.Struct({})).pipe(
            T.JsonName("env_vars"),
          ),
          hyperdriveBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("hyperdrive_bindings")),
          kvNamespaces: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("kv_namespaces")),
          mtlsCertificates: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("mtls_certificates")),
          placement: Schema.optional(
            Schema.Union(
              Schema.Struct({
                mode: Schema.optional(Schema.String),
              }),
              Schema.Null,
            ),
          ),
          queueProducers: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("queue_producers")),
          r2Buckets: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("r2_buckets")),
          services: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ),
          vectorizeBindings: Schema.optional(
            Schema.Union(Schema.Struct({}), Schema.Null),
          ).pipe(T.JsonName("vectorize_bindings")),
        }),
      ),
    }),
  ).pipe(T.JsonName("deployment_configs")),
  domains: Schema.optional(Schema.Array(Schema.String)),
  latestDeployment: Schema.optional(
    Schema.Union(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        aliases: Schema.optional(
          Schema.Union(Schema.Array(Schema.String), Schema.Null),
        ),
        buildConfig: Schema.optional(
          Schema.Struct({
            buildCaching: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("build_caching")),
            buildCommand: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("build_command")),
            destinationDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("destination_dir")),
            rootDir: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("root_dir")),
            webAnalyticsTag: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_tag")),
            webAnalyticsToken: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("web_analytics_token")),
          }),
        ).pipe(T.JsonName("build_config")),
        createdOn: Schema.optional(Schema.String).pipe(
          T.JsonName("created_on"),
        ),
        deploymentTrigger: Schema.optional(
          Schema.Struct({
            metadata: Schema.optional(
              Schema.Struct({
                branch: Schema.optional(Schema.String),
                commitHash: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_hash"),
                ),
                commitMessage: Schema.optional(Schema.String).pipe(
                  T.JsonName("commit_message"),
                ),
              }),
            ),
            type: Schema.optional(Schema.Literal("push", "ad_hoc")),
          }),
        ).pipe(T.JsonName("deployment_trigger")),
        envVars: Schema.optional(Schema.Struct({})).pipe(
          T.JsonName("env_vars"),
        ),
        environment: Schema.optional(Schema.Literal("preview", "production")),
        isSkipped: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("is_skipped"),
        ),
        latestStage: Schema.optional(
          Schema.Struct({
            endedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("ended_on")),
            name: Schema.optional(
              Schema.Literal(
                "queued",
                "initialize",
                "clone_repo",
                "build",
                "deploy",
              ),
            ),
            startedOn: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("started_on")),
            status: Schema.optional(
              Schema.Literal(
                "success",
                "idle",
                "active",
                "failure",
                "canceled",
              ),
            ),
          }),
        ).pipe(T.JsonName("latest_stage")),
        modifiedOn: Schema.optional(Schema.String).pipe(
          T.JsonName("modified_on"),
        ),
        projectId: Schema.optional(Schema.String).pipe(
          T.JsonName("project_id"),
        ),
        projectName: Schema.optional(Schema.String).pipe(
          T.JsonName("project_name"),
        ),
        shortId: Schema.optional(Schema.String).pipe(T.JsonName("short_id")),
        source: Schema.optional(
          Schema.Struct({
            config: Schema.optional(
              Schema.Struct({
                deploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("deployments_enabled"),
                ),
                owner: Schema.optional(Schema.String),
                pathExcludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_excludes"),
                ),
                pathIncludes: Schema.optional(Schema.Array(Schema.String)).pipe(
                  T.JsonName("path_includes"),
                ),
                prCommentsEnabled: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("pr_comments_enabled"),
                ),
                previewBranchExcludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_excludes")),
                previewBranchIncludes: Schema.optional(
                  Schema.Array(Schema.String),
                ).pipe(T.JsonName("preview_branch_includes")),
                previewDeploymentSetting: Schema.optional(
                  Schema.Literal("all", "none", "custom"),
                ).pipe(T.JsonName("preview_deployment_setting")),
                productionBranch: Schema.optional(Schema.String).pipe(
                  T.JsonName("production_branch"),
                ),
                productionDeploymentsEnabled: Schema.optional(
                  Schema.Boolean,
                ).pipe(T.JsonName("production_deployments_enabled")),
                repoName: Schema.optional(Schema.String).pipe(
                  T.JsonName("repo_name"),
                ),
              }),
            ),
            type: Schema.optional(Schema.String),
          }),
        ),
        stages: Schema.optional(
          Schema.Array(
            Schema.Struct({
              endedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("ended_on")),
              name: Schema.optional(
                Schema.Literal(
                  "queued",
                  "initialize",
                  "clone_repo",
                  "build",
                  "deploy",
                ),
              ),
              startedOn: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ).pipe(T.JsonName("started_on")),
              status: Schema.optional(
                Schema.Literal(
                  "success",
                  "idle",
                  "active",
                  "failure",
                  "canceled",
                ),
              ),
            }),
          ),
        ),
        url: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("latest_deployment")),
  name: Schema.optional(Schema.String),
  productionBranch: Schema.optional(Schema.String).pipe(
    T.JsonName("production_branch"),
  ),
  source: Schema.optional(
    Schema.Struct({
      config: Schema.optional(
        Schema.Struct({
          deploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("deployments_enabled"),
          ),
          owner: Schema.optional(Schema.String),
          pathExcludes: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("path_excludes"),
          ),
          pathIncludes: Schema.optional(Schema.Array(Schema.String)).pipe(
            T.JsonName("path_includes"),
          ),
          prCommentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("pr_comments_enabled"),
          ),
          previewBranchExcludes: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("preview_branch_excludes")),
          previewBranchIncludes: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("preview_branch_includes")),
          previewDeploymentSetting: Schema.optional(
            Schema.Literal("all", "none", "custom"),
          ).pipe(T.JsonName("preview_deployment_setting")),
          productionBranch: Schema.optional(Schema.String).pipe(
            T.JsonName("production_branch"),
          ),
          productionDeploymentsEnabled: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("production_deployments_enabled"),
          ),
          repoName: Schema.optional(Schema.String).pipe(
            T.JsonName("repo_name"),
          ),
        }),
      ),
      type: Schema.optional(Schema.String),
    }),
  ),
  subdomain: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PatchProjectResponse>;

export const patchProject: (
  input: PatchProjectRequest,
) => Effect.Effect<
  PatchProjectResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchProjectRequest,
  output: PatchProjectResponse,
  errors: [],
}));

export interface DeleteProjectRequest {
  projectName: string;
  /** Identifier */
  accountId: string;
}

export const DeleteProjectRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/pages/projects/{projectName}",
  }),
) as unknown as Schema.Schema<DeleteProjectRequest>;

export type DeleteProjectResponse = unknown;

export const DeleteProjectResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteProjectResponse>;

export const deleteProject: (
  input: DeleteProjectRequest,
) => Effect.Effect<
  DeleteProjectResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResponse,
  errors: [],
}));

// =============================================================================
// ProjectDeployment
// =============================================================================

export interface GetProjectDeploymentRequest {
  projectName: string;
  deploymentId: string;
  /** Identifier */
  accountId: string;
}

export const GetProjectDeploymentRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  deploymentId: Schema.String.pipe(T.HttpPath("deploymentId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/pages/projects/{projectName}/deployments/{deploymentId}",
  }),
) as unknown as Schema.Schema<GetProjectDeploymentRequest>;

export type GetProjectDeploymentResponse = unknown;

export const GetProjectDeploymentResponse =
  Schema.Unknown as unknown as Schema.Schema<GetProjectDeploymentResponse>;

export const getProjectDeployment: (
  input: GetProjectDeploymentRequest,
) => Effect.Effect<
  GetProjectDeploymentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetProjectDeploymentRequest,
  output: GetProjectDeploymentResponse,
  errors: [],
}));

export interface CreateProjectDeploymentRequest {
  projectName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: The branch to build the new deployment from. The `HEAD` of the branch will be used. If omitted, the production branch will be used by default. */
  branch?: string;
}

export const CreateProjectDeploymentRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  branch: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/pages/projects/{projectName}/deployments",
  }),
) as unknown as Schema.Schema<CreateProjectDeploymentRequest>;

export type CreateProjectDeploymentResponse = unknown;

export const CreateProjectDeploymentResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateProjectDeploymentResponse>;

export const createProjectDeployment: (
  input: CreateProjectDeploymentRequest,
) => Effect.Effect<
  CreateProjectDeploymentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateProjectDeploymentRequest,
  output: CreateProjectDeploymentResponse,
  errors: [],
}));

export interface DeleteProjectDeploymentRequest {
  projectName: string;
  deploymentId: string;
  /** Identifier */
  accountId: string;
}

export const DeleteProjectDeploymentRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  deploymentId: Schema.String.pipe(T.HttpPath("deploymentId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/pages/projects/{projectName}/deployments/{deploymentId}",
  }),
) as unknown as Schema.Schema<DeleteProjectDeploymentRequest>;

export type DeleteProjectDeploymentResponse = unknown;

export const DeleteProjectDeploymentResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteProjectDeploymentResponse>;

export const deleteProjectDeployment: (
  input: DeleteProjectDeploymentRequest,
) => Effect.Effect<
  DeleteProjectDeploymentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteProjectDeploymentRequest,
  output: DeleteProjectDeploymentResponse,
  errors: [],
}));

export interface RetryProjectDeploymentRequest {
  projectName: string;
  deploymentId: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const RetryProjectDeploymentRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  deploymentId: Schema.String.pipe(T.HttpPath("deploymentId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/pages/projects/{projectName}/deployments/{deploymentId}/retry",
  }),
) as unknown as Schema.Schema<RetryProjectDeploymentRequest>;

export type RetryProjectDeploymentResponse = unknown;

export const RetryProjectDeploymentResponse =
  Schema.Unknown as unknown as Schema.Schema<RetryProjectDeploymentResponse>;

export const retryProjectDeployment: (
  input: RetryProjectDeploymentRequest,
) => Effect.Effect<
  RetryProjectDeploymentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RetryProjectDeploymentRequest,
  output: RetryProjectDeploymentResponse,
  errors: [],
}));

export interface RollbackProjectDeploymentRequest {
  projectName: string;
  deploymentId: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const RollbackProjectDeploymentRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  deploymentId: Schema.String.pipe(T.HttpPath("deploymentId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/pages/projects/{projectName}/deployments/{deploymentId}/rollback",
  }),
) as unknown as Schema.Schema<RollbackProjectDeploymentRequest>;

export type RollbackProjectDeploymentResponse = unknown;

export const RollbackProjectDeploymentResponse =
  Schema.Unknown as unknown as Schema.Schema<RollbackProjectDeploymentResponse>;

export const rollbackProjectDeployment: (
  input: RollbackProjectDeploymentRequest,
) => Effect.Effect<
  RollbackProjectDeploymentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RollbackProjectDeploymentRequest,
  output: RollbackProjectDeploymentResponse,
  errors: [],
}));

// =============================================================================
// ProjectDeploymentHistoryLog
// =============================================================================

export interface GetProjectDeploymentHistoryLogRequest {
  projectName: string;
  deploymentId: string;
  /** Identifier */
  accountId: string;
}

export const GetProjectDeploymentHistoryLogRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  deploymentId: Schema.String.pipe(T.HttpPath("deploymentId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/pages/projects/{projectName}/deployments/{deploymentId}/history/logs",
  }),
) as unknown as Schema.Schema<GetProjectDeploymentHistoryLogRequest>;

export interface GetProjectDeploymentHistoryLogResponse {
  data?: { line?: string; ts?: string }[];
  includesContainerLogs?: boolean;
  total?: number;
}

export const GetProjectDeploymentHistoryLogResponse = Schema.Struct({
  data: Schema.optional(
    Schema.Array(
      Schema.Struct({
        line: Schema.optional(Schema.String),
        ts: Schema.optional(Schema.String),
      }),
    ),
  ),
  includesContainerLogs: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("includes_container_logs"),
  ),
  total: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetProjectDeploymentHistoryLogResponse>;

export const getProjectDeploymentHistoryLog: (
  input: GetProjectDeploymentHistoryLogRequest,
) => Effect.Effect<
  GetProjectDeploymentHistoryLogResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetProjectDeploymentHistoryLogRequest,
  output: GetProjectDeploymentHistoryLogResponse,
  errors: [],
}));

// =============================================================================
// ProjectDomain
// =============================================================================

export interface GetProjectDomainRequest {
  projectName: string;
  domainName: string;
  /** Identifier */
  accountId: string;
}

export const GetProjectDomainRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  domainName: Schema.String.pipe(T.HttpPath("domainName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/pages/projects/{projectName}/domains/{domainName}",
  }),
) as unknown as Schema.Schema<GetProjectDomainRequest>;

export type GetProjectDomainResponse = unknown;

export const GetProjectDomainResponse =
  Schema.Unknown as unknown as Schema.Schema<GetProjectDomainResponse>;

export const getProjectDomain: (
  input: GetProjectDomainRequest,
) => Effect.Effect<
  GetProjectDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetProjectDomainRequest,
  output: GetProjectDomainResponse,
  errors: [],
}));

export interface CreateProjectDomainRequest {
  projectName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: */
  name?: string;
}

export const CreateProjectDomainRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/pages/projects/{projectName}/domains",
  }),
) as unknown as Schema.Schema<CreateProjectDomainRequest>;

export type CreateProjectDomainResponse = unknown;

export const CreateProjectDomainResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateProjectDomainResponse>;

export const createProjectDomain: (
  input: CreateProjectDomainRequest,
) => Effect.Effect<
  CreateProjectDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateProjectDomainRequest,
  output: CreateProjectDomainResponse,
  errors: [],
}));

export interface PatchProjectDomainRequest {
  projectName: string;
  domainName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const PatchProjectDomainRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  domainName: Schema.String.pipe(T.HttpPath("domainName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/pages/projects/{projectName}/domains/{domainName}",
  }),
) as unknown as Schema.Schema<PatchProjectDomainRequest>;

export type PatchProjectDomainResponse = unknown;

export const PatchProjectDomainResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchProjectDomainResponse>;

export const patchProjectDomain: (
  input: PatchProjectDomainRequest,
) => Effect.Effect<
  PatchProjectDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchProjectDomainRequest,
  output: PatchProjectDomainResponse,
  errors: [],
}));

export interface DeleteProjectDomainRequest {
  projectName: string;
  domainName: string;
  /** Identifier */
  accountId: string;
}

export const DeleteProjectDomainRequest = Schema.Struct({
  projectName: Schema.String.pipe(T.HttpPath("projectName")),
  domainName: Schema.String.pipe(T.HttpPath("domainName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/pages/projects/{projectName}/domains/{domainName}",
  }),
) as unknown as Schema.Schema<DeleteProjectDomainRequest>;

export type DeleteProjectDomainResponse = unknown;

export const DeleteProjectDomainResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteProjectDomainResponse>;

export const deleteProjectDomain: (
  input: DeleteProjectDomainRequest,
) => Effect.Effect<
  DeleteProjectDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteProjectDomainRequest,
  output: DeleteProjectDomainResponse,
  errors: [],
}));

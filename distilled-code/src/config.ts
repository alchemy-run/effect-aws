/**
 * Configuration types and helpers for distilled-code
 */

import * as Effect from "effect/Effect";
import type { LeafAgent, WorkflowAgent } from "./agent.ts";
import type { ServerConfig } from "./lsp/servers.ts";

export { agent, AgentScope } from "./agent.ts";
export type {
  Agent,
  AgentScope as AgentScopeType,
  LeafAgent,
  LeafAgentOptions,
  ToolkitType,
  WorkflowAgent,
  WorkflowFn,
  WorkflowOptions,
} from "./agent.ts";
export type { ServerConfig } from "./lsp/servers.ts";

/**
 * Any agent type that can be returned from config.
 */
export type AnyAgent = LeafAgent | WorkflowAgent;

export interface DistilledConfig<E = never, R = never> {
  name?: string;
  model?: string;
  /**
   * Effect that yields all top-level agents.
   * Each agent must have a send() method.
   */
  agents?: Effect.Effect<AnyAgent[], E, R>;
  lsp?: { servers?: ServerConfig[] };
}

export const defineConfig = <E = unknown, R = unknown>(
  config: DistilledConfig<E, R>,
): DistilledConfig<E, R> => config;

export const loadConfig = async (
  configPath: string,
): Promise<DistilledConfig> => {
  const configModule = await import(configPath);
  return configModule.default as DistilledConfig;
};

/**
 * Get agents from config, returning empty array if not defined.
 */
export const getAgents = <E, R>(
  config: DistilledConfig<E, R>,
): Effect.Effect<AnyAgent[], E, R> => config.agents ?? Effect.succeed([]);

/** Filter agents by tag */
export const byTag = (agents: AnyAgent[], tag: string): AnyAgent[] =>
  agents.filter((a) => a.tags?.includes(tag));

/** Filter agents by key prefix */
export const byPrefix = (agents: AnyAgent[], prefix: string): AnyAgent[] =>
  agents.filter((a) => a.key.startsWith(prefix));

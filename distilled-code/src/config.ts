/**
 * Configuration types and helpers for distilled-code
 */

import * as Effect from "effect/Effect";
import type { AgentDefinition } from "./agent.ts";

export { agent } from "./agent.ts";
export type { AgentDefinition, AgentMetadata } from "./agent.ts";

/**
 * Type for agents configuration - can be a static array or an Effect.
 *
 * Using Effect allows dynamic agent generation based on:
 * - Parsing source files
 * - Reading configuration
 * - Generating skeleton files before agent runs
 */
export type AgentsConfig<E = unknown, R = unknown> =
  | AgentDefinition<any>[]
  | Effect.Effect<AgentDefinition<any>[], E, R>;

export interface DistilledConfig<E = unknown, R = unknown> {
  /**
   * Name of this project/workspace
   */
  name?: string;

  /**
   * List of agent definitions, or an Effect that resolves to them.
   *
   * When an Effect is provided, it will be run before spawning agents.
   * This allows for dynamic agent generation, such as:
   * - Parsing source files to discover operations
   * - Generating skeleton files before agents run
   * - Loading configuration from external sources
   *
   * @example
   * ```typescript
   * // Static agents
   * agents: [
   *   agent("api/getTodo", { toolkit: Toolkit.Coding }),
   * ]
   *
   * // Dynamic agents using Effect
   * agents: Effect.gen(function* () {
   *   const services = yield* parseCode({ basePath: "./src" });
   *   return services.flatMap(s =>
   *     s.operations.map(op => agent(`${s.name}/${op.name}`, { ... }))
   *   );
   * })
   * ```
   */
  agents?: AgentsConfig<E, R>;

  /**
   * Default model to use
   */
  model?: string;
}

/**
 * Define a distilled configuration.
 */
export const defineConfig = <E = unknown, R = unknown>(
  config: DistilledConfig<E, R>,
): DistilledConfig<E, R> => config;

/**
 * Load a configuration file.
 */
export const loadConfig = async (
  configPath: string,
): Promise<DistilledConfig> => {
  const configModule = await import(configPath);
  return configModule.default as DistilledConfig;
};

/**
 * Resolve agents from a config, handling both static arrays and Effects.
 *
 * @param config - The distilled configuration
 * @returns An Effect that resolves to the array of agent definitions
 */
export const resolveAgents = <E, R>(
  config: DistilledConfig<E, R>,
): Effect.Effect<AgentDefinition<any>[], E, R> => {
  if (!config.agents) {
    return Effect.succeed([]);
  }

  if (Array.isArray(config.agents)) {
    return Effect.succeed(config.agents);
  }

  // It's an Effect - return it directly
  return config.agents;
};

/**
 * Filter agents by tag.
 */
export const byTag = (
  agents: AgentDefinition[],
  tag: string,
): AgentDefinition[] => agents.filter((a) => a.metadata?.tags?.includes(tag));

/**
 * Filter agents by key prefix.
 */
export const byPrefix = (
  agents: AgentDefinition[],
  prefix: string,
): AgentDefinition[] => agents.filter((a) => a.key.startsWith(prefix));

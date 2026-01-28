/**
 * Utility to recursively discover all agents from a root agent or list of agents.
 *
 * Walks the entire reference graph to find all Agent entities.
 */

import { isAgent, type Agent } from "../../agent.ts";
import { isChannel } from "../../chat/channel.ts";
import { isGroup } from "../../chat/group.ts";
import type { Fragment } from "../../fragment.ts";

/**
 * Resolve a potential thunk to its value
 */
function resolveThunk<T>(value: T | (() => T)): T {
  return typeof value === "function" && !isFragment(value)
    ? (value as () => T)()
    : (value as T);
}

/**
 * Check if something is a Fragment (Agent, Channel, Group, File, etc.)
 */
function isFragment(value: unknown): value is Fragment<string, string, any[]> {
  return (
    typeof value === "function" &&
    "type" in value &&
    typeof value.type === "string" &&
    "id" in value &&
    "template" in value &&
    "references" in value
  );
}

/**
 * Recursively discover all agents starting from a root agent or list of agents.
 *
 * This walks the entire reference graph (including through Channels, Groups,
 * Files, and any other Fragment types) to find all Agent entities.
 *
 * @example
 * ```typescript
 * import { discoverAgents } from "distilled-code/tui";
 *
 * class CEO extends Agent("ceo")`Reports: ${() => CTO}, ${() => VPE}` {}
 * class CTO extends Agent("cto")`Tech lead` {}
 * class VPE extends Agent("vpe")`Delivery` {}
 *
 * const allAgents = discoverAgents([CEO]);
 * // Returns [CEO, CTO, VPE]
 * ```
 */
export function discoverAgents(roots: Agent | Agent[]): Agent[] {
  const agents = new Map<string, Agent>();
  const visited = new Set<unknown>();

  const queue: unknown[] = Array.isArray(roots) ? [...roots] : [roots];

  while (queue.length > 0) {
    const item = queue.shift()!;

    // Resolve thunks first
    const resolved = resolveThunk(item);
    if (resolved === undefined || resolved === null) {
      continue;
    }

    // Skip if we've already processed this resolved value
    if (visited.has(resolved)) {
      continue;
    }
    visited.add(resolved);

    // If it's an agent, add it and queue its references
    if (isAgent(resolved)) {
      if (!agents.has(resolved.id)) {
        agents.set(resolved.id, resolved);
      }
      // Queue all references for processing
      for (const ref of resolved.references) {
        queue.push(ref);
      }
      continue;
    }

    // If it's a Channel or Group, queue their references (they may contain agents)
    if (isChannel(resolved) || isGroup(resolved)) {
      for (const ref of resolved.references) {
        queue.push(ref);
      }
      continue;
    }

    // If it's any other Fragment, queue its references
    if (isFragment(resolved)) {
      for (const ref of resolved.references) {
        queue.push(ref);
      }
      continue;
    }

    // If it's an array, queue all items
    if (Array.isArray(resolved)) {
      for (const ref of resolved) {
        queue.push(ref);
      }
      continue;
    }

    // If it's a plain object, queue all values
    if (typeof resolved === "object" && resolved !== null) {
      for (const value of Object.values(resolved)) {
        queue.push(value);
      }
    }
  }

  // Return agents in a stable order (sorted by ID)
  return Array.from(agents.values()).sort((a, b) => a.id.localeCompare(b.id));
}

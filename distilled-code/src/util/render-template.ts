/**
 * Template rendering utilities for displaying agent context.
 *
 * Extracted from context.ts for reuse in UI components.
 */

import * as S from "effect/Schema";
import * as yaml from "yaml";
import { isAgent, type Agent } from "../agent.ts";
import { isFile, type File } from "../file/file.ts";
import { isInput } from "../input.ts";
import { isOutput } from "../output.ts";
import { isTool, type Tool } from "../tool/tool.ts";
import { isToolkit, type Toolkit } from "../toolkit/toolkit.ts";

/**
 * A thunk is a function that returns a reference, enabling forward references.
 */
export type Thunk<T = unknown> = () => T;

/**
 * Checks if a value is a thunk (a function that returns a reference).
 * Thunks are zero-argument arrow functions that return references.
 * They are distinguished from other function-like constructs by:
 * - Not being agents, files, toolkits, tools, inputs, outputs, or Effect Schemas
 * - Having no arguments (length === 0)
 */
export const isThunk = (value: unknown): value is Thunk =>
  typeof value === "function" &&
  (value as Function).length === 0 &&
  !isAgent(value) &&
  !isFile(value) &&
  !isToolkit(value) &&
  !isTool(value) &&
  !isInput(value) &&
  !isOutput(value) &&
  !S.isSchema(value);

/**
 * Resolves a value that may be a thunk to its actual value.
 */
export const resolveThunk = <T>(value: T | Thunk<T>): T =>
  isThunk(value) ? value() : value;

/**
 * Recursively serialize a value, replacing references with their string representations.
 * This produces a plain JSON-serializable object that can be passed to yaml.stringify.
 */
export function serialize(rawValue: unknown): unknown {
  // Resolve thunks first to get the actual value
  const value = resolveThunk(rawValue);

  // Handle Agent, File, Toolkit, Tool, Input, Output references
  // These can be classes (functions) so check before typeof checks
  if (isAgent(value)) return `@${value.id}`;
  if (isFile(value)) {
    const filename = value.id.split("/").pop() || value.id;
    return `[${filename}](${value.id})`;
  }
  if (isToolkit(value)) return `🧰${value.id}`;
  if (isTool(value)) return `🛠️${value.id}`;
  if (isInput(value)) return `\${${value.id}}`;
  if (isOutput(value)) return `^{${value.id}}`;

  // Handle primitives and functions
  if (value === null || value === undefined) return value;
  if (typeof value === "function") return String(value);
  if (typeof value !== "object") return value;

  // Handle Set - convert to array
  if (value instanceof Set) return Array.from(value).map(serialize);

  // Handle Array
  if (Array.isArray(value)) return value.map(serialize);

  // Handle plain objects only - for other object types (classes, Schemas, etc.),
  // fall back to string representation to avoid YAML serialization issues
  const proto = Object.getPrototypeOf(value);
  if (proto !== null && proto !== Object.prototype) {
    return String(value);
  }

  // Handle plain Object
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, serialize(v)]),
  );
}

/**
 * Stringifies a value for use in agent context.
 * - Primitives: converted to string
 * - Arrays/Sets/Objects: serialized to YAML
 * - Agent: @{id} reference link
 * - File: [filename](path) markdown link
 * - Toolkit: 🧰{id}
 * - Tool: 🛠️{id}
 * - Input: ${id}
 * - Output: ^{id}
 * - Thunk: resolved to its actual value first
 */
export function stringify(rawValue: unknown): string {
  // Resolve thunks first to get the actual value
  const value = resolveThunk(rawValue);

  // Handle Agent, File, Toolkit, Tool, Input, Output references
  if (isAgent(value)) return `@${value.id}`;
  if (isFile(value)) {
    const filename = value.id.split("/").pop() || value.id;
    return `[${filename}](${value.id})`;
  }
  if (isToolkit(value)) return `🧰${value.id}`;
  if (isTool(value)) return `🛠️${value.id}`;
  if (isInput(value)) return `\${${value.id}}`;
  if (isOutput(value)) return `^{${value.id}}`;

  // Handle primitives
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);

  // Handle complex types with YAML
  const serialized = serialize(value);
  return "\n" + yaml.stringify(serialized).trimEnd();
}

/**
 * Renders a template string array with its references, replacing references with stringified values.
 */
export function renderTemplate(
  template: TemplateStringsArray,
  references: any[],
): string {
  let result = template[0];
  for (let i = 0; i < references.length; i++) {
    const ref = references[i];
    result += stringify(ref) + template[i + 1];
  }
  return result;
}

/**
 * Renders an agent's template to a displayable string.
 */
export function renderAgentTemplate(agent: Agent): string {
  return renderTemplate(agent.template, agent.references);
}

/**
 * Generic service cleaner using topology.
 *
 * Uses the dependency graph to:
 * 1. List all resources in a service
 * 2. Delete them in the correct order (children before parents)
 */

import * as Effect from "effect/Effect";
import {
  buildDependencyGraph,
  type DependencyGraph,
  type Resource,
} from "./topology.ts";

/**
 * A resource instance that can be deleted.
 */
export interface ResourceInstance {
  resource: string;
  identifier: string;
  value: unknown;
}

/**
 * Result of listing resources.
 */
export interface ListResult {
  resource: string;
  instances: ResourceInstance[];
  error?: unknown;
}

/**
 * Result of deleting a resource.
 */
export interface DeleteResult {
  resource: string;
  identifier: string;
  success: boolean;
  error?: unknown;
}

/**
 * Options for the service cleaner.
 */
export interface CleanerOptions {
  /** Only show what would be deleted, don't actually delete */
  dryRun?: boolean;
  /** Filter resources by prefix */
  prefix?: string;
  /** Log function */
  log?: (message: string) => Effect.Effect<void>;
}

/**
 * Compute the deletion order for resources.
 * Children (dependents) must be deleted before parents.
 */
export const computeDeletionOrder = (graph: DependencyGraph): string[] => {
  const order: string[] = [];
  const visited = new Set<string>();

  // Build reverse dependency map: parent -> children that depend on it
  const dependents = new Map<string, Set<string>>();

  for (const [opName, op] of Object.entries(graph.operations)) {
    if (op.type !== "create") continue;

    for (const input of Object.values(op.inputs)) {
      if (input.references) {
        const parent = input.references;
        const child = op.resource;
        if (!dependents.has(parent)) {
          dependents.set(parent, new Set());
        }
        dependents.get(parent)!.add(child);
      }
    }
  }

  // DFS to get topological order (children first)
  const visit = (resource: string) => {
    if (visited.has(resource)) return;
    visited.add(resource);

    // Visit all children (dependents) first
    const children = dependents.get(resource);
    if (children) {
      for (const child of children) {
        visit(child);
      }
    }

    order.push(resource);
  };

  // Visit all resources
  for (const resource of Object.keys(graph.resources)) {
    visit(resource);
  }

  return order;
};

/**
 * Get resources that can be cleaned (have both list and delete operations).
 */
export const getCleanableResources = (
  graph: DependencyGraph,
): Array<{
  name: string;
  resource: Resource;
  listOp: string;
  deleteOp: string;
}> => {
  const cleanable: Array<{
    name: string;
    resource: Resource;
    listOp: string;
    deleteOp: string;
  }> = [];

  for (const [name, resource] of Object.entries(graph.resources)) {
    const listOp = resource.operations.list ?? resource.operations.read;
    const deleteOp = resource.operations.delete;

    if (listOp && deleteOp) {
      cleanable.push({ name, resource, listOp, deleteOp });
    }
  }

  return cleanable;
};

/**
 * Create a service cleaner for the given service.
 *
 * @param serviceName - The service name (e.g., "ec2", "s3")
 * @returns Effect that cleans all resources in the service
 */
export const cleanService = (
  serviceName: string,
  serviceModule: Record<string, unknown>,
  options: CleanerOptions = {},
) =>
  Effect.gen(function* () {
    const log = options.log ?? ((msg: string) => Effect.log(msg));
    const dryRun = options.dryRun ?? false;
    const prefix = options.prefix;

    yield* log(`Building topology for ${serviceName}...`);
    const graph = yield* buildDependencyGraph(serviceName);

    // Get cleanable resources and sort by deletion order
    const cleanable = getCleanableResources(graph);
    const deletionOrder = computeDeletionOrder(graph);

    // Sort cleanable resources by deletion order
    const sorted = cleanable.sort((a, b) => {
      const aIndex = deletionOrder.indexOf(a.name);
      const bIndex = deletionOrder.indexOf(b.name);
      return aIndex - bIndex;
    });

    yield* log(`Found ${sorted.length} cleanable resources in deletion order`);

    const results: {
      listed: ListResult[];
      deleted: DeleteResult[];
    } = {
      listed: [],
      deleted: [],
    };

    // Process each resource type
    for (const { name, resource, listOp, deleteOp } of sorted) {
      yield* log(`\n📋 Listing ${name} via ${listOp}...`);

      // Get the list function from the service module
      const listFn = serviceModule[listOp];
      if (typeof listFn !== "function") {
        yield* log(`  ⚠️ List function ${listOp} not found, skipping`);
        continue;
      }

      // Try to list resources
      const listResult = yield* Effect.tryPromise({
        try: async () => {
          // Call the list function - it returns an Effect, so we need to run it
          const effect = listFn({}) as Effect.Effect<unknown, unknown, unknown>;
          // This won't work directly - we need to yield* it
          return effect;
        },
        catch: (error) => error,
      }).pipe(
        Effect.flatMap((effect) =>
          Effect.isEffect(effect)
            ? (effect as Effect.Effect<unknown, unknown, never>)
            : Effect.succeed(effect),
        ),
        Effect.catchAll((error) => {
          return Effect.succeed({ _error: error });
        }),
      );

      if (
        listResult &&
        typeof listResult === "object" &&
        "_error" in listResult
      ) {
        yield* log(`  ❌ Failed to list: ${String(listResult._error)}`);
        results.listed.push({
          resource: name,
          instances: [],
          error: listResult._error,
        });
        continue;
      }

      // Extract instances from the result
      // This is tricky because different APIs return results differently
      const instances = extractInstances(
        name,
        resource.identifier,
        listResult,
        prefix,
      );

      yield* log(`  Found ${instances.length} instances`);
      results.listed.push({ resource: name, instances });

      if (instances.length === 0) continue;

      // Get the delete function
      const deleteFn = serviceModule[deleteOp];
      if (typeof deleteFn !== "function") {
        yield* log(`  ⚠️ Delete function ${deleteOp} not found, skipping`);
        continue;
      }

      // Delete each instance
      for (const instance of instances) {
        if (dryRun) {
          yield* log(
            `  🔍 Would delete ${name} ${instance.identifier}=${String(instance.value)}`,
          );
          results.deleted.push({
            resource: name,
            identifier: String(instance.value),
            success: true,
          });
          continue;
        }

        yield* log(
          `  🗑️ Deleting ${name} ${instance.identifier}=${String(instance.value)}...`,
        );

        const deleteResult = yield* Effect.tryPromise({
          try: async () => {
            const effect = deleteFn({
              [instance.identifier]: instance.value,
            }) as Effect.Effect<unknown, unknown, unknown>;
            return effect;
          },
          catch: (error) => error,
        }).pipe(
          Effect.flatMap((effect) =>
            Effect.isEffect(effect)
              ? (effect as Effect.Effect<unknown, unknown, never>)
              : Effect.succeed(effect),
          ),
          Effect.map(() => ({ success: true as const })),
          Effect.catchAll((error) => {
            return Effect.succeed({ success: false as const, error });
          }),
        );

        if (deleteResult.success) {
          yield* log(`    ✅ Deleted`);
        } else {
          yield* log(`    ❌ Failed: ${String(deleteResult.error)}`);
        }

        results.deleted.push({
          resource: name,
          identifier: String(instance.value),
          ...deleteResult,
        });
      }
    }

    return results;
  });

/**
 * Extract resource instances from a list API response.
 * Handles various AWS response patterns.
 */
const extractInstances = (
  resourceName: string,
  identifier: string | null,
  response: unknown,
  prefix?: string,
): ResourceInstance[] => {
  if (!response || typeof response !== "object") return [];
  if (!identifier) return [];

  const instances: ResourceInstance[] = [];

  // Common patterns for list responses
  const pluralName = resourceName + "s";
  const possibleKeys = [
    pluralName,
    resourceName + "List",
    resourceName + "Set",
    "Items",
    "Contents",
    resourceName + "Summaries",
    // EC2 patterns
    resourceName + "Set",
    "Reservations", // EC2 instances
  ];

  const resp = response as Record<string, unknown>;

  for (const key of possibleKeys) {
    const items = resp[key];
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item && typeof item === "object") {
          const value = (item as Record<string, unknown>)[identifier];
          if (value !== undefined) {
            // Check prefix filter
            if (
              prefix &&
              typeof value === "string" &&
              !value.includes(prefix)
            ) {
              continue;
            }
            instances.push({
              resource: resourceName,
              identifier,
              value,
            });
          }
        }
      }
      break;
    }
  }

  return instances;
};

/**
 * Generate a cleanup plan without executing it.
 * Useful for previewing what would be deleted.
 */
export const generateCleanupPlan = (serviceName: string) =>
  Effect.gen(function* () {
    const graph = yield* buildDependencyGraph(serviceName);
    const cleanable = getCleanableResources(graph);
    const deletionOrder = computeDeletionOrder(graph);

    // Sort by deletion order
    const sorted = cleanable.sort((a, b) => {
      const aIndex = deletionOrder.indexOf(a.name);
      const bIndex = deletionOrder.indexOf(b.name);
      return aIndex - bIndex;
    });

    return sorted.map(({ name, listOp, deleteOp, resource }) => ({
      resource: name,
      identifier: resource.identifier,
      listOperation: listOp,
      deleteOperation: deleteOp,
    }));
  });

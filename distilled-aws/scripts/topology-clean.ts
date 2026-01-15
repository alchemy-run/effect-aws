#!/usr/bin/env bun
/**
 * Generic service cleanup using topology.
 *
 * Lists and deletes all resources for a service in dependency order.
 *
 * Usage:
 *   bun scripts/topology-clean.ts ec2              # Delete all EC2 resources
 *   bun scripts/topology-clean.ts ec2 --dry-run    # Show what would be deleted
 */

import { FetchHttpClient } from "@effect/platform";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Layer } from "effect";
import * as Credentials from "../src/credentials.ts";
import {
  computeDeletionOrder,
  getCleanableResources,
} from "./find-errors/cleaner.ts";
import { buildDependencyGraph } from "./find-errors/topology.ts";
import { Region } from "../src/region.ts";

const args = process.argv.slice(2);
const serviceName = args.find((a) => !a.startsWith("--")) ?? "ec2";
const dryRun = args.includes("--dry-run");

/**
 * Resources to skip because they include public/shared data.
 */
const SKIP_RESOURCES = new Set([
  "Snapshot", // describeSnapshots includes public snapshots
  "Image", // describeImages includes public AMIs
  "FpgaImage", // includes AWS marketplace images
  "SpotPrice", // pricing data, not a resource
  "InstanceTypeOffering", // availability data
  "AvailabilityZone", // AWS infrastructure
  "Region", // AWS infrastructure
  "PrefixList", // includes AWS-managed prefix lists
]);

/**
 * Extract resource instances from a list API response.
 */
const extractInstances = (
  resourceName: string,
  identifier: string | null,
  response: unknown,
): Array<{ identifier: string; value: unknown; raw: unknown }> => {
  if (!response || typeof response !== "object") return [];
  if (!identifier) return [];

  const instances: Array<{ identifier: string; value: unknown; raw: unknown }> =
    [];

  // Common AWS response patterns
  const pluralName = resourceName + "s";
  const possibleKeys = [
    pluralName,
    resourceName + "List",
    resourceName + "Set",
    "Items",
    "Contents",
    resourceName + "Summaries",
    resourceName,
    // EC2 specific
    "Reservations",
    "Addresses",
    "Images",
    "Snapshots",
    "Volumes",
    "KeyPairs",
    "SecurityGroups",
    "Instances",
  ];

  const resp = response as Record<string, unknown>;

  for (const key of possibleKeys) {
    const items = resp[key];
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item && typeof item === "object") {
          const value = (item as Record<string, unknown>)[identifier];
          if (value !== undefined) {
            instances.push({ identifier, value, raw: item });
          }
        }
      }
      if (instances.length > 0) break;
    }
  }

  return instances;
};

const main = Effect.gen(function* () {
  yield* Console.log(`\n🧹 Topology-based cleanup for ${serviceName}`);
  yield* Console.log(`   Dry run: ${dryRun}\n`);

  // Build topology
  yield* Console.log("📊 Building topology...");
  const graph = yield* buildDependencyGraph(serviceName);

  const cleanable = getCleanableResources(graph);
  const deletionOrder = computeDeletionOrder(graph);

  // Sort by deletion order (children first)
  const sorted = cleanable.sort((a, b) => {
    const aIndex = deletionOrder.indexOf(a.name);
    const bIndex = deletionOrder.indexOf(b.name);
    return aIndex - bIndex;
  });

  yield* Console.log(`   Found ${sorted.length} resource types to clean\n`);

  // Load service module
  yield* Console.log("📦 Loading service module...");
  const serviceModule = (yield* Effect.tryPromise({
    try: () => import(`../src/services/${serviceName}.ts`),
    catch: (e) => new Error(`Failed to load service: ${e}`),
  })) as Record<string, unknown>;

  let totalFound = 0;
  let totalDeleted = 0;
  let totalFailed = 0;

  yield* Console.log("\n🔍 Scanning resources...\n");

  for (const { name, listOp, deleteOp, resource } of sorted) {
    // Skip resources that include public/shared data
    if (SKIP_RESOURCES.has(name)) {
      continue;
    }
    const listFn = serviceModule[listOp];
    const deleteFn = serviceModule[deleteOp];

    if (typeof listFn !== "function") {
      continue;
    }

    // Try to list
    const listResult = yield* Effect.try({
      try: () => listFn({}) as Effect.Effect<unknown, unknown, unknown>,
      catch: (e) => e,
    }).pipe(
      Effect.flatMap((effect) =>
        Effect.isEffect(effect)
          ? (effect as Effect.Effect<unknown, unknown, never>)
          : Effect.succeed(effect),
      ),
      Effect.catchAll(() => Effect.succeed(null)),
    );

    if (!listResult) continue;

    // Extract instances
    const instances = extractInstances(name, resource.identifier, listResult);

    if (instances.length === 0) continue;

    totalFound += instances.length;
    yield* Console.log(`📋 ${name}: ${instances.length} found`);

    for (const instance of instances) {
      const displayValue =
        typeof instance.value === "string"
          ? instance.value
          : JSON.stringify(instance.value);

      if (dryRun) {
        yield* Console.log(`   🔍 Would delete: ${displayValue}`);
        continue;
      }

      if (typeof deleteFn !== "function") {
        yield* Console.log(`   ⚠️  No delete function for ${name}`);
        continue;
      }

      yield* Console.log(`   🗑️  Deleting: ${displayValue}...`);

      const deleteResult = yield* Effect.try({
        try: () =>
          deleteFn({
            [instance.identifier]: instance.value,
          }) as Effect.Effect<unknown, unknown, unknown>,
        catch: (e) => e,
      }).pipe(
        Effect.flatMap((effect) =>
          Effect.isEffect(effect)
            ? (effect as Effect.Effect<unknown, unknown, never>)
            : Effect.succeed(effect),
        ),
        Effect.map(() => ({ success: true as const })),
        Effect.catchAll((error) => {
          const err = error as { _tag?: string; errorTag?: string };
          return Effect.succeed({
            success: false as const,
            error: err.errorTag ?? err._tag ?? "Unknown",
          });
        }),
      );

      if (deleteResult.success) {
        yield* Console.log(`      ✅ Deleted`);
        totalDeleted++;
      } else {
        yield* Console.log(`      ❌ Failed: ${deleteResult.error}`);
        totalFailed++;
      }
    }
  }

  yield* Console.log("\n📊 Summary:");
  yield* Console.log(`   Resources found: ${totalFound}`);
  if (dryRun) {
    yield* Console.log(`   Would delete: ${totalFound}`);
  } else {
    yield* Console.log(`   Deleted: ${totalDeleted}`);
    yield* Console.log(`   Failed: ${totalFailed}`);
  }

  yield* Console.log("\n✨ Done!\n");
});

// Build layers
const platform = Layer.mergeAll(NodeContext.layer, FetchHttpClient.layer);
const awsLayer = Credentials.fromChain();

main.pipe(
  Effect.provide(platform),
  Effect.provide(awsLayer),
  Effect.provideService(Region, "us-east-1"),
  NodeRuntime.runMain,
);

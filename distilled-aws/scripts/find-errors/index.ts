#!/usr/bin/env bun
/**
 * Find missing errors in AWS services.
 *
 * This tool discovers undocumented errors by calling AWS APIs with fake inputs.
 * Discovered errors are automatically recorded to spec/{service}.json.
 *
 * Usage:
 *   bun find ec2                          # Find errors for EC2
 *   bun find ec2 --type delete            # Only test delete operations
 *   bun find ec2 --resource Vpc           # Only test Vpc-related operations
 *   bun find ec2 --filter "describe*"     # Only test operations matching pattern
 *   bun find ec2 --limit 50               # Limit to 50 operations
 *   bun find ec2 --dry-run                # Show what would be tested
 *   bun find ec2 --no-skip                # Don't skip already-satisfied operations
 *
 * After discovering errors:
 *   bun generate --sdk {service}          # Regenerate SDK with new errors
 */

import { Args, Command, Options } from "@effect/cli";
import { FetchHttpClient } from "@effect/platform";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Layer, Logger, LogLevel } from "effect";
import * as Credentials from "../../src/credentials.ts";
import { Region } from "../../src/region.ts";
import { generateFakeInputs } from "./id-generator.ts";
import {
  callOperation,
  createErrorTracker,
  loadSpec,
  shouldSkipOperation,
} from "./runner.ts";
import { buildDependencyGraph, type OperationType } from "./topology.ts";

// ============================================================================
// CLI Options
// ============================================================================

const serviceArg = Args.text({ name: "service" }).pipe(
  Args.withDescription("The AWS service to find errors for (e.g., ec2, s3)"),
);

const typeOption = Options.text("type").pipe(
  Options.withDescription(
    "Filter by operation type: create, read, list, update, delete, detach, action",
  ),
  Options.optional,
);

const resourceOption = Options.text("resource").pipe(
  Options.withDescription(
    "Filter by resource name (e.g., Vpc, Subnet). Comma-separated for multiple.",
  ),
  Options.optional,
);

const filterOption = Options.text("filter").pipe(
  Options.withDescription(
    "Filter operations by name pattern (e.g., 'describe*', '*Vpc*')",
  ),
  Options.optional,
);

const limitOption = Options.integer("limit").pipe(
  Options.withDescription("Maximum number of operations to test"),
  Options.withDefault(999),
);

const dryRunOption = Options.boolean("dry-run").pipe(
  Options.withDescription("Show what would be tested without calling APIs"),
  Options.withDefault(false),
);

const noSkipOption = Options.boolean("no-skip").pipe(
  Options.withDescription(
    "Don't skip operations that already have expected errors",
  ),
  Options.withDefault(false),
);

// ============================================================================
// Pattern Matching
// ============================================================================

/**
 * Match a string against a glob-like pattern.
 * Supports * as wildcard.
 */
const matchPattern = (pattern: string, value: string): boolean => {
  const regex = new RegExp(
    "^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$",
    "i",
  );
  return regex.test(value);
};

// ============================================================================
// Main Command
// ============================================================================

const findCommand = Command.make(
  "find",
  {
    service: serviceArg,
    type: typeOption,
    resource: resourceOption,
    filter: filterOption,
    limit: limitOption,
    dryRun: dryRunOption,
    noSkip: noSkipOption,
  },
  ({ service, type, resource, filter, limit, dryRun, noSkip }) =>
    Effect.gen(function* () {
      yield* Console.log(`\n🔍 Finding errors for ${service}\n`);

      // Build topology
      yield* Console.log("📊 Building topology...");
      const graph = yield* buildDependencyGraph(service);

      const totalOps = Object.keys(graph.operations).length;
      const totalResources = Object.keys(graph.resources).length;
      yield* Console.log(
        `   Found ${totalOps} operations across ${totalResources} resources`,
      );

      // Load spec to check existing errors
      yield* Console.log("📂 Loading spec...");
      const spec = yield* loadSpec(service);
      const specOpCount = Object.keys(spec.operations).length;
      yield* Console.log(
        `   Found ${specOpCount} operations with patched errors`,
      );

      // Load service module
      yield* Console.log("📦 Loading service module...");
      const serviceModule = yield* Effect.tryPromise({
        try: () => import(`../../src/services/${service}.ts`),
        catch: (e) => new Error(`Failed to load service: ${e}`),
      });

      // Filter operations
      let ops = Object.entries(graph.operations);

      // Filter by type
      if (type._tag === "Some") {
        const typeValue = type.value as OperationType;
        ops = ops.filter(([_, op]) => op.type === typeValue);
        yield* Console.log(
          `   Filtered to ${ops.length} ${typeValue} operations`,
        );
      }

      // Filter by resource
      if (resource._tag === "Some") {
        const resources = resource.value.split(",").map((r) => r.trim());
        ops = ops.filter(([_, op]) =>
          resources.some((r) => op.resource.toLowerCase() === r.toLowerCase()),
        );
        yield* Console.log(
          `   Filtered to ${ops.length} operations for resources: ${resources.join(", ")}`,
        );
      }

      // Filter by pattern
      if (filter._tag === "Some") {
        const pattern = filter.value;
        ops = ops.filter(([name]) => matchPattern(pattern, name));
        yield* Console.log(
          `   Filtered to ${ops.length} operations matching "${pattern}"`,
        );
      }

      // Apply limit
      const toTest = ops.slice(0, limit);
      yield* Console.log(`\n🔬 Testing ${toTest.length} operations...\n`);

      if (dryRun) {
        yield* Console.log("📋 DRY RUN - Operations that would be tested:\n");
        for (const [opName, op] of toTest) {
          const opErrors = spec.operations[opName]?.errors ?? [];
          const skipReason = noSkip
            ? undefined
            : shouldSkipOperation(opName, op.type, opErrors);
          if (skipReason) {
            yield* Console.log(
              `   ⏭️  ${op.type.padEnd(8)} ${opName} (skip: ${skipReason})`,
            );
          } else {
            const inputs = generateFakeInputs(graph, opName);
            yield* Console.log(
              `   ${op.type.padEnd(8)} ${opName} ${inputs ? JSON.stringify(inputs) : "{}"}`,
            );
          }
        }
        yield* Console.log(`\n   Total: ${toTest.length} operations`);
        return;
      }

      // Run tests
      const tracker = createErrorTracker();
      let tested = 0;
      let skipped = 0;
      let errorsFound = 0;

      for (const [opName, op] of toTest) {
        // Check skip rules (unless --no-skip)
        if (!noSkip) {
          const opErrors = spec.operations[opName]?.errors ?? [];
          const skipReason = shouldSkipOperation(opName, op.type, opErrors);
          if (skipReason) {
            skipped++;
            tracker.skipped.push({ operation: opName, reason: skipReason });
            continue;
          }
        }

        const inputs = generateFakeInputs(graph, opName);
        if (!inputs) continue;

        const result = yield* callOperation(
          service,
          opName,
          inputs,
          serviceModule as Record<string, unknown>,
          tracker,
        );

        tested++;

        if (!result.success) {
          errorsFound++;
          const errorTag = result.errorTag ?? result.error ?? "Unknown";

          // Log interesting errors
          if (
            result.isNew ||
            errorTag.includes("NotFound") ||
            errorTag.includes("NoSuch") ||
            errorTag.includes("Malformed")
          ) {
            const prefix = result.isNew ? "🆕" : "✓";
            yield* Console.log(`   ${prefix} ${opName} → ${errorTag}`);
          }
        }
      }

      // Summary
      yield* Console.log(`\n📊 Summary:`);
      yield* Console.log(`   Operations tested: ${tested}`);
      yield* Console.log(`   Operations skipped: ${skipped}`);
      yield* Console.log(`   Errors encountered: ${errorsFound}`);
      yield* Console.log(
        `   New errors discovered: ${tracker.newErrors.length}`,
      );

      if (tracker.newErrors.length > 0) {
        yield* Console.log(`\n🆕 NEW errors recorded to spec/${service}.json:`);
        const unique = new Map<string, string[]>();
        for (const err of tracker.newErrors) {
          if (!unique.has(err.error)) unique.set(err.error, []);
          unique.get(err.error)!.push(err.operation);
        }
        for (const [error, operations] of unique) {
          yield* Console.log(
            `   ${error}: ${operations.slice(0, 5).join(", ")}${operations.length > 5 ? ` (+${operations.length - 5} more)` : ""}`,
          );
        }
        yield* Console.log(
          `\n   Run 'bun generate --sdk ${service}' to regenerate the SDK with these errors.`,
        );
      }

      if (skipped > 0) {
        yield* Console.log(
          `\n⏭️  Skipped ${skipped} operations (already have expected errors in spec)`,
        );
        yield* Console.log(`   Use --no-skip to test these anyway`);
      }

      yield* Console.log("");
    }),
);

// ============================================================================
// CLI Setup
// ============================================================================

const cli = Command.run(findCommand, {
  name: "find",
  version: "1.0.0",
});

// ============================================================================
// Platform and Credentials Layers
// ============================================================================

const platform = Layer.mergeAll(
  NodeContext.layer,
  FetchHttpClient.layer,
  Logger.pretty,
);

const awsLayer = Credentials.fromChain();

// ============================================================================
// Run
// ============================================================================

cli(process.argv).pipe(
  Effect.provide(platform),
  Effect.provide(awsLayer),
  Effect.provideService(Region, "us-east-1"),
  Logger.withMinimumLogLevel(
    process.env.DEBUG ? LogLevel.Debug : LogLevel.Info,
  ),
  NodeRuntime.runMain,
);

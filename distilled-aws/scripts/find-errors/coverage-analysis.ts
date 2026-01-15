#!/usr/bin/env bun
import { NodeContext } from "@effect/platform-node";
import { Effect } from "effect";
import { buildDependencyGraph } from "./topology.ts";

const spec = await Bun.file("spec/ec2.json").json();
const patchedOps = new Set(Object.keys(spec.operations || {}));

const program = Effect.gen(function* () {
  const graph = yield* buildDependencyGraph("ec2");
  const allOps = Object.keys(graph.operations);

  console.log("=== EC2 Coverage Analysis ===\n");
  console.log(`Total operations: ${allOps.length}`);
  console.log(`Patched operations: ${patchedOps.size}`);
  console.log(`Unpatched: ${allOps.length - patchedOps.size}\n`);

  // Analyze unpatched operations
  const unpatched = allOps.filter((op) => !patchedOps.has(op));

  // Group by type
  const byType: Record<string, string[]> = {};
  for (const op of unpatched) {
    const type = graph.operations[op].type;
    if (!byType[type]) byType[type] = [];
    byType[type].push(op);
  }

  console.log("Unpatched operations by type:");
  for (const [type, ops] of Object.entries(byType)) {
    console.log(`  ${type}: ${ops.length}`);
    if (ops.length <= 10) {
      ops.forEach((op) => console.log(`    - ${op}`));
    } else {
      ops.slice(0, 5).forEach((op) => console.log(`    - ${op}`));
      console.log(`    ... and ${ops.length - 5} more`);
    }
  }

  // Check what errors patched delete ops have
  console.log("\n=== Delete operation error coverage ===");
  const deleteOps = allOps.filter(
    (op) => graph.operations[op].type === "delete",
  );
  let withNotFound = 0,
    withMalformed = 0,
    withDepViolation = 0,
    withAny = 0;

  for (const op of deleteOps) {
    const errors = (spec.operations[op]?.errors as string[]) || [];
    if (errors.length > 0) withAny++;
    if (errors.some((e) => e.includes("NotFound") || e.includes("NoSuch")))
      withNotFound++;
    if (errors.some((e) => e.includes("Malformed"))) withMalformed++;
    if (errors.some((e) => e.includes("Dependency") || e.includes("InUse")))
      withDepViolation++;
  }

  console.log(`Total delete operations: ${deleteOps.length}`);
  console.log(
    `With any error: ${withAny} (${Math.round((withAny / deleteOps.length) * 100)}%)`,
  );
  console.log(`With NotFound: ${withNotFound}`);
  console.log(`With Malformed: ${withMalformed}`);
  console.log(`With DependencyViolation: ${withDepViolation}`);

  // How many delete ops are missing BOTH NotFound AND DependencyViolation?
  const deleteMissingBoth = deleteOps.filter((op) => {
    const errors = (spec.operations[op]?.errors as string[]) || [];
    const hasNotFound = errors.some(
      (e) =>
        e.includes("NotFound") ||
        e.includes("NoSuch") ||
        e.includes("Malformed"),
    );
    const hasDepViolation = errors.some(
      (e) => e.includes("Dependency") || e.includes("InUse"),
    );
    return !hasNotFound && !hasDepViolation;
  });

  console.log(
    `\nDelete ops missing both NotFound AND DependencyViolation: ${deleteMissingBoth.length}`,
  );
  deleteMissingBoth.slice(0, 15).forEach((op) => {
    const errors = (spec.operations[op]?.errors as string[]) || [];
    console.log(`  ${op}: [${errors.join(", ")}]`);
  });

  // Analyze what "100% coverage" would mean
  console.log("\n=== What would 100% coverage mean? ===");
  console.log("For each operation type, the expected errors are:");
  console.log(
    "  delete: NotFound OR Malformed + optionally DependencyViolation",
  );
  console.log("  read/describe: NotFound OR Malformed");
  console.log("  create: Various validation errors (harder to define 100%)");
  console.log("  update: NotFound + validation errors");
  console.log("  list: Usually no errors (returns empty)");

  // Count truly "complete" delete operations
  const completeDelete = deleteOps.filter((op) => {
    const errors = (spec.operations[op]?.errors as string[]) || [];
    return errors.some(
      (e) =>
        e.includes("NotFound") ||
        e.includes("NoSuch") ||
        e.includes("Malformed"),
    );
  });

  console.log(
    `\nDelete operations with NotFound/Malformed: ${completeDelete.length}/${deleteOps.length} (${Math.round((completeDelete.length / deleteOps.length) * 100)}%)`,
  );
});

program.pipe(Effect.provide(NodeContext.layer), Effect.runPromise);

#!/usr/bin/env bun
import { NodeContext } from "@effect/platform-node";
import { Effect } from "effect";
import {
  buildDependencyGraph,
  getCreationOrder,
  getDependents,
} from "./topology.ts";

const program = Effect.gen(function* () {
  const graph = yield* buildDependencyGraph("ec2");

  // Show some key resources and their dependencies
  const keyResources = [
    "Vpc",
    "Subnet",
    "InternetGateway",
    "RouteTable",
    "SecurityGroup",
    "Instance",
    "NetworkInterface",
    "NatGateway",
  ];

  console.log("=== EC2 Resource Dependencies ===\n");

  for (const res of keyResources) {
    const resource = graph.resources[res];
    if (!resource) continue;

    const createOp = resource.operations.create;
    const deleteOp = resource.operations.delete;
    const op = createOp ? graph.operations[createOp] : null;

    const refs = op
      ? Object.entries(op.inputs)
          .filter(([_, v]) => v.references && v.required)
          .map(([k, v]) => `${k} -> ${v.references}`)
      : [];

    const dependents = getDependents(graph, res);

    console.log(`${res}:`);
    console.log(`  Create: ${createOp || "N/A"}`);
    console.log(`  Delete: ${deleteOp || "N/A"}`);
    console.log(`  Required refs: ${refs.length ? refs.join(", ") : "none"}`);
    console.log(
      `  Depended on by: ${dependents.length ? dependents.join(", ") : "none"}`,
    );
    console.log("");
  }

  // Show creation order
  const order = getCreationOrder(graph).filter((r) => keyResources.includes(r));
  console.log("Creation order:", order.join(" → "));
  console.log("Deletion order (reverse):", [...order].reverse().join(" → "));
});

program.pipe(Effect.provide(NodeContext.layer), Effect.runPromise);

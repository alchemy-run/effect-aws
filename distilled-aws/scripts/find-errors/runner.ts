/**
 * API execution and error recording.
 *
 * Calls AWS operations and records discovered errors to spec files.
 * Supports skip rules to avoid redundant checks.
 */

import { FileSystem } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import type { OperationType } from "./topology.ts";

/**
 * Schema for service error patches.
 * Mirrors the schema in src/patch/spec-schema.ts
 */
const OperationPatch = S.Struct({
  errors: S.optional(S.Array(S.String)),
  aliases: S.optional(
    S.Array(
      S.Struct({
        from: S.String,
        to: S.String,
      }),
    ),
  ),
});

const ServiceSpec = S.Struct({
  operations: S.Record({ key: S.String, value: OperationPatch }),
  structures: S.optional(S.Record({ key: S.String, value: S.Unknown })),
  enums: S.optional(S.Record({ key: S.String, value: S.Unknown })),
  errors: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

type ServiceSpec = typeof ServiceSpec.Type;

/**
 * Result of calling an operation.
 */
export interface CallResult {
  success: boolean;
  error?: string;
  errorTag?: string;
  message?: string;
  isNew?: boolean;
  skipped?: boolean;
  skipReason?: string;
}

/**
 * Error tracking state.
 */
export interface ErrorTracker {
  newErrors: Array<{ operation: string; error: string }>;
  allErrors: Array<{ operation: string; error: string }>;
  skipped: Array<{ operation: string; reason: string }>;
}

/**
 * Create a new error tracker.
 */
export const createErrorTracker = (): ErrorTracker => ({
  newErrors: [],
  allErrors: [],
  skipped: [],
});

/**
 * Skip rules determine if an operation should be skipped based on existing spec data.
 * Each rule checks for a specific error pattern that we expect to find.
 *
 * Add new rules here as you discover patterns:
 * - Delete operations expect *.NotFound errors
 * - Create operations with FK refs expect *.NotFound for the FK
 * - etc.
 */
export interface SkipRule {
  /** Human-readable name for this rule */
  name: string;
  /** Which operation types this rule applies to */
  operationTypes: OperationType[];
  /** Error pattern to check (supports * wildcard) */
  errorPattern: string;
  /** Check if the operation has already satisfied this rule */
  isSatisfied: (
    opErrors: readonly string[],
    opName: string,
    opType: OperationType,
  ) => boolean;
}

/**
 * Default skip rules.
 * Add more rules here as patterns are discovered.
 */
export const DEFAULT_SKIP_RULES: SkipRule[] = [
  {
    name: "NotFound for delete",
    operationTypes: ["delete"],
    errorPattern: "*.NotFound",
    isSatisfied: (opErrors) =>
      opErrors.some((e) => e.includes("NotFound") || e.includes("NoSuch")),
  },
  {
    name: "NotFound for read",
    operationTypes: ["read"],
    errorPattern: "*.NotFound",
    isSatisfied: (opErrors) =>
      opErrors.some((e) => e.includes("NotFound") || e.includes("NoSuch")),
  },
  {
    name: "Malformed for delete",
    operationTypes: ["delete"],
    errorPattern: "*.Malformed",
    isSatisfied: (opErrors) => opErrors.some((e) => e.includes("Malformed")),
  },
];

/**
 * Check if an operation should be skipped based on skip rules.
 * Returns the rule name if skipped, undefined if not.
 */
export const shouldSkipOperation = (
  opName: string,
  opType: OperationType,
  opErrors: readonly string[],
  rules: SkipRule[] = DEFAULT_SKIP_RULES,
): string | undefined => {
  for (const rule of rules) {
    if (!rule.operationTypes.includes(opType)) continue;
    if (rule.isSatisfied(opErrors, opName, opType)) {
      return rule.name;
    }
  }
  return undefined;
};

/**
 * Get the spec file path for a service.
 */
const getSpecPath = (service: string) => `spec/${service.toLowerCase()}.json`;

/**
 * Load the spec file for a service.
 */
export const loadSpec = (service: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const specPath = getSpecPath(service);
    return yield* fs.readFileString(specPath).pipe(
      Effect.flatMap(S.decodeUnknown(S.parseJson(ServiceSpec))),
      Effect.catchAll(() => Effect.succeed({ operations: {} } as ServiceSpec)),
    );
  });

/**
 * Save the spec file for a service.
 */
export const saveSpec = (service: string, spec: ServiceSpec) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const specPath = getSpecPath(service);
    yield* fs.makeDirectory("spec", { recursive: true });
    yield* fs.writeFileString(specPath, JSON.stringify(spec, null, 2) + "\n");
  });

/**
 * Record a discovered error to the spec file for a service.
 */
export const recordError = (
  service: string,
  operation: string,
  errorTag: string,
) =>
  Effect.gen(function* () {
    const existingSpec = yield* loadSpec(service);
    const opErrors = existingSpec.operations[operation]?.errors ?? [];

    if (!opErrors.includes(errorTag)) {
      yield* saveSpec(service, {
        ...existingSpec,
        operations: {
          ...existingSpec.operations,
          [operation]: {
            ...existingSpec.operations[operation],
            errors: [...opErrors, errorTag].sort(),
          },
        },
      });
      return true; // New error recorded
    }
    return false; // Error already known
  });

/**
 * Call an operation and track any errors.
 */
export const callOperation = (
  service: string,
  opName: string,
  inputs: Record<string, unknown>,
  serviceModule: Record<string, unknown>,
  tracker: ErrorTracker,
) =>
  Effect.gen(function* () {
    const fn = serviceModule[opName];
    if (typeof fn !== "function") {
      return { success: false, error: "function not found" } as CallResult;
    }

    const result = yield* Effect.try({
      try: () => fn(inputs) as Effect.Effect<unknown, unknown, unknown>,
      catch: (e) => e,
    }).pipe(
      Effect.flatMap((effect) =>
        Effect.isEffect(effect)
          ? (effect as Effect.Effect<unknown, unknown, never>)
          : Effect.succeed(effect),
      ),
      Effect.map(() => ({ success: true as const })),
      Effect.catchAll((error) => {
        const err = error as {
          _tag?: string;
          errorTag?: string;
          message?: string;
        };
        return Effect.succeed({
          success: false as const,
          error: err._tag ?? "Unknown",
          errorTag: err.errorTag,
          message: err.message,
        });
      }),
    );

    if (!result.success) {
      const errorName = result.errorTag ?? result.error ?? "Unknown";
      tracker.allErrors.push({ operation: opName, error: errorName });

      // UnknownAwsError means it's not in the SDK - truly new!
      if (result.error === "UnknownAwsError" && result.errorTag) {
        tracker.newErrors.push({ operation: opName, error: result.errorTag });
        yield* recordError(service, opName, result.errorTag);
        return { ...result, isNew: true } as CallResult;
      }
    }

    return result as CallResult;
  });

/**
 * Print summary of discovered errors.
 */
export const printSummary = (tracker: ErrorTracker) =>
  Effect.gen(function* () {
    if (tracker.newErrors.length > 0) {
      yield* Effect.log(
        `\n🆕 NEW errors recorded to spec (${tracker.newErrors.length}):`,
      );
      const unique = new Map<string, string[]>();
      for (const err of tracker.newErrors) {
        if (!unique.has(err.error)) unique.set(err.error, []);
        unique.get(err.error)!.push(err.operation);
      }
      for (const [error, ops] of unique) {
        yield* Effect.log(
          `   ${error}: ${ops.slice(0, 5).join(", ")}${ops.length > 5 ? ` (+${ops.length - 5} more)` : ""}`,
        );
      }
    } else {
      yield* Effect.log(
        "\n   No new errors discovered (all errors already known)",
      );
    }

    // Show all NotFound/Malformed errors encountered
    const notFoundErrors = tracker.allErrors.filter(
      (e) =>
        e.error.includes("NotFound") ||
        e.error.includes("NoSuch") ||
        e.error.includes("Malformed"),
    );
    if (notFoundErrors.length > 0) {
      yield* Effect.log(
        `\n📋 NotFound/Malformed errors (${notFoundErrors.length}):`,
      );
      const unique = new Map<string, number>();
      for (const err of notFoundErrors) {
        unique.set(err.error, (unique.get(err.error) ?? 0) + 1);
      }
      const sorted = [...unique.entries()].sort((a, b) => b[1] - a[1]);
      for (const [error, count] of sorted.slice(0, 20)) {
        yield* Effect.log(`   ${error}: ${count}x`);
      }
    }
  });

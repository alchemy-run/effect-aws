/**
 * Schema for per-service error patches.
 *
 * These are stored in spec/{service}.json and specify which errors
 * can be returned by each operation in the service.
 */

import * as Schema from "effect/Schema";
import * as Effect from "effect/Effect";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";

/**
 * Error alias - maps an error code to an alternative name.
 */
export const ErrorAlias = Schema.Struct({
  from: Schema.Number,
  to: Schema.String,
});
export type ErrorAlias = typeof ErrorAlias.Type;

/**
 * Patches for a single operation.
 */
export const OperationPatch = Schema.Struct({
  /**
   * Error names that can be returned by this operation.
   * These are semantic names from the error catalog.
   */
  errors: Schema.optional(Schema.Array(Schema.String)),
  /**
   * Error code aliases for this operation.
   */
  aliases: Schema.optional(Schema.Array(ErrorAlias)),
});
export type OperationPatch = typeof OperationPatch.Type;

/**
 * All patches for a service.
 */
export const ServiceSpec = Schema.Struct({
  /**
   * Map of operation names to their patches.
   */
  operations: Schema.Record({ key: Schema.String, value: OperationPatch }),
});
export type ServiceSpec = typeof ServiceSpec.Type;

/**
 * Load spec patches for a service from spec/{service}.json
 */
export const loadServiceSpec = (serviceName: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    const specPath = path.join("spec", `${serviceName}.json`);
    const content = yield* fs.readFileString(specPath);
    const data = yield* Schema.decodeUnknown(Schema.parseJson(ServiceSpec))(content);

    return data;
  }).pipe(Effect.catchAll(() => Effect.succeed<ServiceSpec>({ operations: {} })));

/**
 * Save spec patches for a service to spec/{service}.json
 */
export const saveServiceSpec = (serviceName: string, spec: ServiceSpec) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    yield* fs.makeDirectory("spec", { recursive: true });

    const specPath = path.join("spec", `${serviceName}.json`);
    const content = JSON.stringify(spec, null, 2) + "\n";
    yield* fs.writeFileString(specPath, content);
  });

/**
 * Record an error for an operation.
 */
export const recordError = (serviceName: string, operationName: string, errorName: string) =>
  Effect.gen(function* () {
    const spec = yield* loadServiceSpec(serviceName);
    const opPatch = spec.operations[operationName] ?? {};
    const errors = opPatch.errors ?? [];

    if (!errors.includes(errorName)) {
      const updatedSpec: ServiceSpec = {
        ...spec,
        operations: {
          ...spec.operations,
          [operationName]: {
            ...opPatch,
            errors: [...errors, errorName].sort(),
          },
        },
      };

      yield* saveServiceSpec(serviceName, updatedSpec);
      return true; // New error recorded
    }

    return false; // Error already known
  });

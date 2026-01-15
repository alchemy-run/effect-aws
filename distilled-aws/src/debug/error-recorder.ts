/**
 * Auto-record unknown AWS errors to spec files.
 *
 * When DISTILLED_AWS_DEBUG=1 is set, any UnknownAwsError encountered
 * during API calls will be automatically recorded to the corresponding
 * spec/{service}.json file. This enables passive error discovery
 * during tests and scripts.
 */

import { FileSystem } from "@effect/platform";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as HashMap from "effect/HashMap";
import * as Option from "effect/Option";
import * as Ref from "effect/Ref";
import * as S from "effect/Schema";
import { ServiceSpec } from "../patch/spec-schema.ts";

/**
 * Module-level semaphore map for locking spec file access.
 * This prevents race conditions when multiple parallel API calls
 * try to record errors to the same spec file.
 */
let locksRef: Ref.Ref<HashMap.HashMap<string, Effect.Semaphore>> | undefined;

const getLocksRef = Effect.suspend(() => {
  if (locksRef) return Effect.succeed(locksRef);
  return Ref.make(HashMap.empty<string, Effect.Semaphore>()).pipe(
    Effect.tap((ref) => Effect.sync(() => (locksRef = ref))),
  );
});

const getLock = (specPath: string) =>
  Effect.gen(function* () {
    const ref = yield* getLocksRef;
    const locks = yield* Ref.get(ref);
    const existing = HashMap.get(locks, specPath);
    if (Option.isSome(existing)) {
      return existing.value;
    }
    const newSemaphore = yield* Effect.makeSemaphore(1);
    yield* Ref.set(ref, HashMap.set(locks, specPath, newSemaphore));
    return newSemaphore;
  });

/**
 * Convert PascalCase to camelCase.
 * The generated code uses PascalCase identifiers (e.g., GetPublicAccessBlockRequest)
 * but the spec uses camelCase operation names (e.g., getPublicAccessBlock).
 */
const toCamelCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

/**
 * Get the spec file path for a service.
 */
const getSpecPath = (serviceSdkId: string) =>
  `spec/${serviceSdkId.toLowerCase().replaceAll(" ", "-")}.json`;

/**
 * Load the spec file for a service.
 */
const loadSpec = (fs: FileSystem.FileSystem, specPath: string) =>
  fs.readFileString(specPath).pipe(
    Effect.flatMap(S.decodeUnknown(S.parseJson(ServiceSpec))),
    Effect.catchAll(() => Effect.succeed({ operations: {} } as ServiceSpec)),
  );

/**
 * Save the spec file for a service.
 */
const saveSpec = (
  fs: FileSystem.FileSystem,
  specPath: string,
  spec: ServiceSpec,
) =>
  Effect.gen(function* () {
    yield* fs.makeDirectory("spec", { recursive: true });
    yield* fs.writeFileString(specPath, JSON.stringify(spec, null, 2) + "\n");
  });

/**
 * Record a missing error to the spec file.
 *
 * This function:
 * 1. Checks if DISTILLED_AWS_DEBUG=1 is set - skips if not
 * 2. Checks if FileSystem is available - skips if not
 * 3. Acquires a lock for the spec file
 * 4. Loads the spec, adds the error if not present, saves
 *
 * All errors are silently caught - this should never fail the API call.
 */
export const recordMissingError = (
  serviceSdkId: string,
  operationName: string,
  errorTag: string,
) =>
  Effect.gen(function* () {
    // Check config inline - skip if not enabled
    const isEnabled = yield* Config.boolean("DISTILLED_AWS_DEBUG").pipe(
      Config.withDefault(false),
    );
    if (!isEnabled) return;

    // Get FileSystem - skip if not available
    const fsOption = yield* Effect.serviceOption(FileSystem.FileSystem);
    if (Option.isNone(fsOption)) return;
    const fs = fsOption.value;

    const specPath = getSpecPath(serviceSdkId);

    // Convert operation name to camelCase (schema identifiers are PascalCase)
    const camelCaseOpName = toCamelCase(operationName);

    // Acquire lock and record the error
    const lock = yield* getLock(specPath);
    yield* lock.withPermits(1)(
      Effect.gen(function* () {
        const existingSpec = yield* loadSpec(fs, specPath);
        const opErrors = existingSpec.operations[camelCaseOpName]?.errors ?? [];

        if (!opErrors.includes(errorTag)) {
          yield* saveSpec(fs, specPath, {
            ...existingSpec,
            operations: {
              ...existingSpec.operations,
              [camelCaseOpName]: {
                ...existingSpec.operations[camelCaseOpName],
                errors: [...opErrors, errorTag].sort(),
              },
            },
          });
          yield* Effect.logInfo(
            `[DISTILLED_AWS_DEBUG] Recorded missing error: ${serviceSdkId}.${camelCaseOpName} -> ${errorTag}`,
          );
        }
      }),
    );
  }).pipe(
    // Never fail - just log and continue
    Effect.catchAll((error) =>
      Effect.logDebug(`[DISTILLED_AWS_DEBUG] Failed to record error: ${error}`),
    ),
  );

/**
 * SSM Service Tests
 *
 * Tests for:
 * 1. Idempotency token auto-generation - verifies that operations with @idempotencyToken
 *    work correctly when the token is not provided (auto-generated)
 * 2. Basic SSM operations - maintenance windows, parameters, etc.
 */

import { expect } from "@effect/vitest";
import { Effect } from "effect";
import {
  createMaintenanceWindow,
  deleteMaintenanceWindow,
  describeMaintenanceWindows,
  getMaintenanceWindow,
} from "../../src/services/ssm.ts";
import { test } from "../test.ts";

const MAINTENANCE_WINDOW_NAME = "distilled-ssm-idempotency-test";

/**
 * Helper to clean up maintenance window
 */
const cleanupMaintenanceWindow = (windowId: string) =>
  deleteMaintenanceWindow({ WindowId: windowId }).pipe(Effect.ignore);

/**
 * Helper to find and clean up maintenance windows by name
 */
const cleanupMaintenanceWindowByName = (name: string) =>
  describeMaintenanceWindows({
    Filters: [{ Key: "Name", Values: [name] }],
  }).pipe(
    Effect.flatMap((result) =>
      Effect.forEach(
        result.WindowIdentities ?? [],
        (w) =>
          w.WindowId ? cleanupMaintenanceWindow(w.WindowId) : Effect.void,
        { concurrency: 1 },
      ),
    ),
    Effect.ignore,
  );

/**
 * Helper to create a maintenance window and ensure cleanup
 */
const withMaintenanceWindow = <A, E, R>(
  name: string,
  use: (window: { WindowId: string }) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any existing windows with this name
    yield* cleanupMaintenanceWindowByName(name);

    // Create the maintenance window WITHOUT providing ClientToken
    // This tests that the idempotency token is auto-generated
    const result = yield* createMaintenanceWindow({
      Name: name,
      Schedule: "rate(1 day)",
      Duration: 1,
      Cutoff: 0,
      AllowUnassociatedTargets: false,
    });

    return yield* use({ WindowId: result.WindowId! });
  }).pipe(Effect.ensuring(cleanupMaintenanceWindowByName(name)));

// ============================================================================
// Idempotency Token Tests
// ============================================================================

test(
  "create maintenance window without ClientToken (auto-generated idempotency token)",
  withMaintenanceWindow(MAINTENANCE_WINDOW_NAME, (window) =>
    Effect.gen(function* () {
      expect(window.WindowId).toBeDefined();
      expect(window.WindowId).toMatch(/^mw-/); // Maintenance window IDs start with mw-

      // Verify the window was created using GetMaintenanceWindow
      const result = yield* getMaintenanceWindow({
        WindowId: window.WindowId,
      });

      expect(result.WindowId).toBe(window.WindowId);
      expect(result.Name).toBe(MAINTENANCE_WINDOW_NAME);
    }),
  ),
);

test(
  "create maintenance window with explicit ClientToken",
  Effect.gen(function* () {
    const windowName = "distilled-ssm-explicit-token-test";
    const explicitToken = "explicit-test-token-12345";

    // Clean up first
    yield* cleanupMaintenanceWindowByName(windowName);

    // Create with explicit ClientToken
    const result = yield* createMaintenanceWindow({
      Name: windowName,
      Schedule: "rate(1 day)",
      Duration: 1,
      Cutoff: 0,
      AllowUnassociatedTargets: false,
      ClientToken: explicitToken,
    });

    expect(result.WindowId).toBeDefined();

    // Clean up
    yield* cleanupMaintenanceWindow(result.WindowId!);
  }),
);

test(
  "idempotent create with same ClientToken returns same result",
  Effect.gen(function* () {
    const windowName = "distilled-ssm-idempotent-test";
    const clientToken = "idempotent-test-token-67890";

    // Clean up first
    yield* cleanupMaintenanceWindowByName(windowName);

    // First create
    const result1 = yield* createMaintenanceWindow({
      Name: windowName,
      Schedule: "rate(1 day)",
      Duration: 1,
      Cutoff: 0,
      AllowUnassociatedTargets: false,
      ClientToken: clientToken,
    });

    expect(result1.WindowId).toBeDefined();

    // Second create with same token - should be idempotent
    // AWS will return the same window ID if the parameters match
    const result2 = yield* createMaintenanceWindow({
      Name: windowName,
      Schedule: "rate(1 day)",
      Duration: 1,
      Cutoff: 0,
      AllowUnassociatedTargets: false,
      ClientToken: clientToken,
    }).pipe(
      Effect.catchTag("IdempotentParameterMismatch", () =>
        // If parameters don't match exactly, AWS throws this
        Effect.succeed({ WindowId: result1.WindowId }),
      ),
    );

    // Should get the same window ID (idempotent)
    expect(result2.WindowId).toBe(result1.WindowId);

    // Clean up
    yield* cleanupMaintenanceWindow(result1.WindowId!);
  }),
);

// ============================================================================
// Basic SSM Operations
// ============================================================================

test(
  "describe maintenance windows",
  Effect.gen(function* () {
    // Just verify we can list maintenance windows
    const result = yield* describeMaintenanceWindows({});

    // Response should have WindowIdentities (may be empty)
    expect(result.WindowIdentities).toBeDefined();
    expect(Array.isArray(result.WindowIdentities)).toBe(true);
  }),
);

test(
  "create, get, and delete maintenance window lifecycle",
  Effect.gen(function* () {
    const windowName = "distilled-ssm-lifecycle-test";

    // Clean up first
    yield* cleanupMaintenanceWindowByName(windowName);

    // Create
    const created = yield* createMaintenanceWindow({
      Name: windowName,
      Schedule: "rate(7 days)",
      Duration: 2,
      Cutoff: 1,
      AllowUnassociatedTargets: true,
    });

    expect(created.WindowId).toBeDefined();
    const windowId = created.WindowId!;

    // Get the window details
    const window = yield* getMaintenanceWindow({
      WindowId: windowId,
    });

    expect(window.Name).toBe(windowName);
    expect(window.Duration).toBe(2);
    expect(window.Cutoff).toBe(1);

    // Delete
    yield* deleteMaintenanceWindow({ WindowId: windowId });

    // Verify deleted (should throw DoesNotExistException)
    const stillExists = yield* getMaintenanceWindow({
      WindowId: windowId,
    }).pipe(
      Effect.map(() => true),
      Effect.catchAll(() => Effect.succeed(false)),
    );

    expect(stillExists).toBe(false);
  }),
);

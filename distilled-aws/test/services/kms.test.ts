import { expect } from "@effect/vitest";
import { Effect, Redacted, Schedule, Stream } from "effect";
import {
  cancelKeyDeletion,
  createAlias,
  createKey,
  decrypt,
  deleteAlias,
  describeKey,
  encrypt,
  listAliases,
  listKeys,
  scheduleKeyDeletion,
} from "../../src/services/kms.ts";
import { beforeAll, test } from "../test.ts";

const TEST_ALIAS = "alias/itty-aws-test";

// Clean up all keys before running tests
beforeAll(
  Effect.gen(function* () {
    // Collect all keys first
    const allKeys: string[] = [];
    let marker: string | undefined;
    do {
      const result = yield* listKeys({ Marker: marker });
      for (const key of result.Keys ?? []) {
        if (key.KeyId) {
          allKeys.push(key.KeyId);
        }
      }
      marker = result.Truncated ? result.NextMarker : undefined;
    } while (marker);

    // Schedule deletion for keys not already pending (in parallel)
    yield* Effect.all(
      allKeys.map((keyId) =>
        Effect.gen(function* () {
          const keyInfo = yield* describeKey({ KeyId: keyId }).pipe(
            Effect.retry({
              while: (err) => err._tag === "ThrottlingException",
              schedule: Schedule.exponential("1 second"),
            }),
            Effect.catchAll(() => Effect.succeed(null)),
          );
          if (
            keyInfo?.KeyMetadata?.KeyState === "Enabled" ||
            keyInfo?.KeyMetadata?.KeyState === "Disabled"
          ) {
            yield* scheduleKeyDeletion({
              KeyId: keyId,
              PendingWindowInDays: 7,
            }).pipe(Effect.ignore);
          }
        }),
      ),
      { concurrency: "unbounded" },
    );
  }),
);

// ============================================================================
// Key Management Tests
// ============================================================================

test(
  "create key, describe key, list keys, and schedule deletion",
  { timeout: 300_000 },
  Effect.gen(function* () {
    // Create a symmetric encryption key
    const createResult = yield* createKey({
      Description: "Test key for itty-aws",
      KeyUsage: "ENCRYPT_DECRYPT",
      KeySpec: "SYMMETRIC_DEFAULT",
    });

    const keyId = createResult.KeyMetadata?.KeyId;
    expect(keyId).toBeDefined();

    try {
      // Describe the key
      const describeResult = yield* describeKey({ KeyId: keyId! });
      expect(describeResult.KeyMetadata?.KeyId).toEqual(keyId);
      expect(describeResult.KeyMetadata?.KeyState).toEqual("Enabled");

      // List keys and verify our key is in the list (paginate through all)
      let foundKey = false;
      let marker: string | undefined;
      do {
        const listResult = yield* listKeys({ Marker: marker });
        if (listResult.Keys?.some((k) => k.KeyId === keyId)) {
          foundKey = true;
          break;
        }
        marker = listResult.Truncated ? listResult.NextMarker : undefined;
      } while (marker);

      expect(foundKey).toBe(true);
    } finally {
      // Schedule key deletion (minimum 7 days in AWS, but LocalStack may allow less)
      yield* scheduleKeyDeletion({
        KeyId: keyId!,
        PendingWindowInDays: 7,
      }).pipe(Effect.ignore);
    }
  }),
);

test(
  "create key and cancel key deletion",
  { timeout: 300_000 },
  Effect.gen(function* () {
    // Create a key
    const createResult = yield* createKey({
      Description: "Test key for cancellation",
      KeyUsage: "ENCRYPT_DECRYPT",
    });

    const keyId = createResult.KeyMetadata?.KeyId;
    expect(keyId).toBeDefined();

    try {
      // Schedule deletion
      yield* scheduleKeyDeletion({
        KeyId: keyId!,
        PendingWindowInDays: 7,
      });

      // Verify key is pending deletion
      const describePending = yield* describeKey({ KeyId: keyId! });
      expect(describePending.KeyMetadata?.KeyState).toEqual("PendingDeletion");

      // Cancel deletion
      yield* cancelKeyDeletion({ KeyId: keyId! });

      // Wait for key state to transition from PendingDeletion to Disabled/Enabled
      // AWS may take a moment to update the state after cancellation
      yield* describeKey({ KeyId: keyId! }).pipe(
        Effect.flatMap((result) => {
          const state = result.KeyMetadata?.KeyState;
          if (state === "Disabled" || state === "Enabled") {
            return Effect.succeed(result);
          }
          return Effect.fail(
            new Error(
              `Key still in state ${state}, waiting for Disabled/Enabled`,
            ),
          );
        }),
        Effect.retry({
          schedule: Schedule.spaced("1 second").pipe(
            Schedule.intersect(Schedule.recurs(30)),
          ),
        }),
      );
    } finally {
      // Clean up - schedule deletion again
      yield* scheduleKeyDeletion({
        KeyId: keyId!,
        PendingWindowInDays: 7,
      }).pipe(Effect.ignore);
    }
  }),
);

// ============================================================================
// Alias Tests
// ============================================================================

const retrySchedule = Schedule.spaced("1 second").pipe(
  Schedule.intersect(Schedule.recurs(30)),
);

const waitForAlias = (keyId: string, aliasName: string) =>
  listAliases({ KeyId: keyId }).pipe(
    Effect.flatMap((result) => {
      const alias = result.Aliases?.find((a) => a.AliasName === aliasName);
      return alias
        ? Effect.succeed(alias)
        : Effect.fail(new Error("Alias not yet visible"));
    }),
    Effect.retry({ schedule: retrySchedule }),
  );

const waitForAliasDeleted = (keyId: string, aliasName: string) =>
  listAliases({ KeyId: keyId }).pipe(
    Effect.flatMap((result) => {
      const alias = result.Aliases?.find((a) => a.AliasName === aliasName);
      return alias
        ? Effect.fail(new Error("Alias still visible after deletion"))
        : Effect.succeed(undefined);
    }),
    Effect.retry({ schedule: retrySchedule }),
  );

test(
  "create alias, list aliases, and delete alias",
  { timeout: 300_000 },
  Effect.gen(function* () {
    // First create a key to alias
    const createKeyResult = yield* createKey({
      Description: "Test key for alias test",
      KeyUsage: "ENCRYPT_DECRYPT",
    });

    const keyId = createKeyResult.KeyMetadata?.KeyId;
    expect(keyId).toBeDefined();

    const aliasName = TEST_ALIAS;

    try {
      // Create alias
      yield* createAlias({
        AliasName: aliasName,
        TargetKeyId: keyId!,
      });

      // Wait for alias to appear (eventual consistency)
      const foundAlias = yield* waitForAlias(keyId!, aliasName);
      expect(foundAlias).toBeDefined();
      expect(foundAlias?.TargetKeyId).toEqual(keyId);

      // Can describe key by alias
      const describeByAlias = yield* describeKey({ KeyId: aliasName });
      expect(describeByAlias.KeyMetadata?.KeyId).toEqual(keyId);

      // Delete alias
      yield* deleteAlias({ AliasName: aliasName });

      // Wait for alias to disappear (eventual consistency)
      yield* waitForAliasDeleted(keyId!, aliasName);
    } finally {
      // Clean up alias if it still exists
      yield* deleteAlias({ AliasName: aliasName }).pipe(Effect.ignore);
      // Clean up key
      yield* scheduleKeyDeletion({
        KeyId: keyId!,
        PendingWindowInDays: 7,
      }).pipe(Effect.ignore);
    }
  }),
);

// ============================================================================
// Encrypt/Decrypt Tests
// ============================================================================

test(
  "encrypt and decrypt data with symmetric key",
  { timeout: 300_000 },
  Effect.gen(function* () {
    // Create a symmetric encryption key
    const createResult = yield* createKey({
      Description: "Test key for encrypt/decrypt",
      KeyUsage: "ENCRYPT_DECRYPT",
      KeySpec: "SYMMETRIC_DEFAULT",
    });

    const keyId = createResult.KeyMetadata?.KeyId;
    expect(keyId).toBeDefined();

    try {
      // Test data
      const plaintext = new TextEncoder().encode("Hello, KMS encryption test!");

      // Encrypt
      const encryptResult = yield* encrypt({
        KeyId: keyId!,
        Plaintext: plaintext,
      });

      expect(encryptResult.CiphertextBlob).toBeDefined();

      // Verify ciphertext is different from plaintext
      const ciphertextStr = new TextDecoder().decode(
        encryptResult.CiphertextBlob!,
      );
      const plaintextStr = new TextDecoder().decode(plaintext);
      expect(ciphertextStr).not.toEqual(plaintextStr);

      // Decrypt
      const decryptResult = yield* decrypt({
        KeyId: keyId!,
        CiphertextBlob: encryptResult.CiphertextBlob!,
      });

      expect(decryptResult.Plaintext).toBeDefined();

      // Verify decrypted data matches original
      // Plaintext is a sensitive field, extract from Redacted
      const decryptedBytes = Redacted.isRedacted(decryptResult.Plaintext!)
        ? Redacted.value(decryptResult.Plaintext!)
        : decryptResult.Plaintext!;
      const decryptedStr = new TextDecoder().decode(decryptedBytes);
      expect(decryptedStr).toEqual(plaintextStr);
    } finally {
      // Clean up key
      yield* scheduleKeyDeletion({
        KeyId: keyId!,
        PendingWindowInDays: 7,
      }).pipe(Effect.ignore);
    }
  }),
);

test(
  "encrypt with encryption context",
  { timeout: 300_000 },
  Effect.gen(function* () {
    // Create a key
    const createResult = yield* createKey({
      Description: "Test key for encryption context",
      KeyUsage: "ENCRYPT_DECRYPT",
    });

    const keyId = createResult.KeyMetadata?.KeyId;
    expect(keyId).toBeDefined();

    try {
      const plaintext = new TextEncoder().encode("Secret data");
      const encryptionContext = {
        purpose: "testing",
        environment: "local",
      };

      // Encrypt with context
      const encryptResult = yield* encrypt({
        KeyId: keyId!,
        Plaintext: plaintext,
        EncryptionContext: encryptionContext,
      });

      expect(encryptResult.CiphertextBlob).toBeDefined();

      // Decrypt with same context should succeed
      const decryptResult = yield* decrypt({
        KeyId: keyId!,
        CiphertextBlob: encryptResult.CiphertextBlob!,
        EncryptionContext: encryptionContext,
      });

      expect(decryptResult.Plaintext).toBeDefined();

      // Verify content - Plaintext is a sensitive field, extract from Redacted
      const decryptedBytes = Redacted.isRedacted(decryptResult.Plaintext!)
        ? Redacted.value(decryptResult.Plaintext!)
        : decryptResult.Plaintext!;
      const decryptedStr = new TextDecoder().decode(decryptedBytes);
      const originalStr = new TextDecoder().decode(plaintext);
      expect(decryptedStr).toEqual(originalStr);

      // Decrypt with wrong context should fail
      const wrongContextResult = yield* decrypt({
        KeyId: keyId!,
        CiphertextBlob: encryptResult.CiphertextBlob!,
        EncryptionContext: {
          purpose: "wrong",
          environment: "wrong",
        },
      }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );

      expect(wrongContextResult).toEqual("error");
    } finally {
      yield* scheduleKeyDeletion({
        KeyId: keyId!,
        PendingWindowInDays: 7,
      }).pipe(Effect.ignore);
    }
  }),
);

// ============================================================================
// Pagination Stream Tests
// ============================================================================

test(
  "listKeys.pages() streams full response pages",
  Effect.gen(function* () {
    // Stream all pages of keys
    const pages = yield* listKeys.pages({ Limit: 10 }).pipe(Stream.runCollect);

    const pagesArray = Array.from(pages);
    expect(pagesArray.length).toBeGreaterThanOrEqual(1);
  }),
);

test(
  "listKeys.items() streams KeyListEntry objects directly",
  Effect.gen(function* () {
    // Stream all keys using .items()
    const keys = yield* listKeys.items({ Limit: 10 }).pipe(Stream.runCollect);

    const keysArray = Array.from(keys);

    // Each item should be a KeyListEntry with KeyId
    for (const key of keysArray) {
      expect(key.KeyId).toBeDefined();
    }
  }),
);

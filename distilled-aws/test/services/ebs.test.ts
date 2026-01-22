import { expect } from "@effect/vitest";
import { Effect, Schedule, Stream } from "effect";
import {
  completeSnapshot,
  getSnapshotBlock,
  listChangedBlocks,
  listSnapshotBlocks,
  putSnapshotBlock,
  startSnapshot,
} from "../../src/services/ebs.ts";
import { deleteSnapshot } from "../../src/services/ec2.ts";
import { test } from "../test.ts";

// ============================================================================
// Constants
// ============================================================================

// EBS block size is 512 KiB (524,288 bytes)
const BLOCK_SIZE = 524_288;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate SHA256 checksum and return as Base64-encoded string.
 * Required for putSnapshotBlock operations.
 */
const sha256Base64 = (data: Uint8Array): Effect.Effect<string> =>
  Effect.promise(async () => {
    // Copy to a new ArrayBuffer to satisfy TypeScript's BufferSource type
    const buffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(buffer).set(data);
    const hash = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hash));
    return btoa(String.fromCharCode(...hashArray));
  });

/**
 * Cleanup helper - delete snapshot using EC2 API.
 * EBS Direct API doesn't have deleteSnapshot, must use EC2.
 */
const cleanupSnapshot = (snapshotId: string) =>
  deleteSnapshot({ SnapshotId: snapshotId }).pipe(Effect.ignore);

/**
 * Wait for snapshot to be readable (completed state).
 * Snapshots transition from pending to completed asynchronously.
 * We poll until we can successfully list blocks.
 */
const waitForSnapshotReady = (snapshotId: string) =>
  listSnapshotBlocks({
    SnapshotId: snapshotId,
    MaxResults: 1,
  }).pipe(
    Effect.retry(Schedule.spaced("2 seconds").pipe(Schedule.upTo("2 minutes"))),
  );

/**
 * Resource lifecycle wrapper for snapshots.
 * Cleans up snapshot after test completes (success or failure).
 */
const withSnapshot = <A, E, R>(
  description: string,
  testFn: (snapshotId: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Start a new snapshot (1 GiB minimum size)
    const startResult = yield* startSnapshot({
      VolumeSize: 1,
      Description: description,
      Tags: [{ Key: "distilled-test", Value: "ebs" }],
    });

    const snapshotId = startResult.SnapshotId!;

    // Run the test and ensure cleanup
    return yield* testFn(snapshotId).pipe(
      Effect.ensuring(cleanupSnapshot(snapshotId)),
    );
  });

// ============================================================================
// Snapshot Lifecycle Tests
// ============================================================================

test(
  "start snapshot, write block, and complete",
  { timeout: 30_000 },
  withSnapshot("distilled-ebs-lifecycle", (snapshotId) =>
    Effect.gen(function* () {
      // Generate test block data (512 KiB filled with 0x42 = 'B')
      const testData = new Uint8Array(BLOCK_SIZE).fill(0x42);

      // Calculate SHA256 checksum for the block
      const checksum = yield* sha256Base64(testData);

      // Write block 0 to the snapshot
      const putResult = yield* putSnapshotBlock({
        SnapshotId: snapshotId,
        BlockIndex: 0,
        BlockData: testData,
        DataLength: BLOCK_SIZE,
        Checksum: checksum,
        ChecksumAlgorithm: "SHA256",
      });

      expect(putResult.Checksum).toBeDefined();
      expect(putResult.ChecksumAlgorithm).toEqual("SHA256");

      // Complete the snapshot
      const completeResult = yield* completeSnapshot({
        SnapshotId: snapshotId,
        ChangedBlocksCount: 1,
        Checksum: checksum,
        ChecksumAlgorithm: "SHA256",
        ChecksumAggregationMethod: "LINEAR",
      });

      expect(completeResult.Status).toBeDefined();
      // Status will be "pending" initially - snapshot completion is async
    }),
  ),
);

// This test requires waiting for snapshot completion which can take minutes
// Skip by default but can be enabled for full integration testing
test.skip(
  "full lifecycle: write, complete, wait, and read snapshot",
  { timeout: 300_000 },
  withSnapshot("distilled-ebs-full-lifecycle", (snapshotId) =>
    Effect.gen(function* () {
      const testData = new Uint8Array(BLOCK_SIZE).fill(0x42);
      const checksum = yield* sha256Base64(testData);

      yield* putSnapshotBlock({
        SnapshotId: snapshotId,
        BlockIndex: 0,
        BlockData: testData,
        DataLength: BLOCK_SIZE,
        Checksum: checksum,
        ChecksumAlgorithm: "SHA256",
      });

      yield* completeSnapshot({
        SnapshotId: snapshotId,
        ChangedBlocksCount: 1,
        Checksum: checksum,
        ChecksumAlgorithm: "SHA256",
        ChecksumAggregationMethod: "LINEAR",
      });

      // Wait for snapshot to be readable (can take 1-5 minutes)
      yield* waitForSnapshotReady(snapshotId);

      // List and read blocks
      const listResult = yield* listSnapshotBlocks({ SnapshotId: snapshotId });
      expect(listResult.Blocks).toBeDefined();
      expect(listResult.Blocks!.length).toBeGreaterThan(0);

      const block0 = listResult.Blocks!.find((b) => b.BlockIndex === 0)!;
      const getResult = yield* getSnapshotBlock({
        SnapshotId: snapshotId,
        BlockIndex: 0,
        BlockToken: block0.BlockToken!,
      });

      expect(getResult.DataLength).toEqual(BLOCK_SIZE);
    }),
  ),
);

// ============================================================================
// Error Handling Tests
// ============================================================================

test(
  "ValidationException for invalid snapshot ID",
  Effect.gen(function* () {
    // EBS returns ValidationException for invalid snapshot IDs
    const result = yield* listSnapshotBlocks({
      SnapshotId: "snap-00000000000000000",
    }).pipe(
      Effect.map(() => "success" as const),
      Effect.catchAll((err) => {
        const tag = (err as { _tag?: string })._tag;
        return Effect.succeed({ tag: "error" as const, errorTag: tag });
      }),
    );

    expect(result).not.toEqual("success");
    if (result !== "success") {
      expect(result.tag).toEqual("error");
      // EBS returns ValidationException with reason INVALID_SNAPSHOT_ID
      expect(result.errorTag).toEqual("ValidationException");
    }
  }),
);

// ============================================================================
// Pagination Tests
// ============================================================================

// These tests require waiting for snapshot completion which takes minutes
// Skip by default - run manually for full integration testing

test.skip(
  "listSnapshotBlocks.pages() streams full response pages",
  { timeout: 300_000 },
  withSnapshot("distilled-ebs-pagination", (snapshotId) =>
    Effect.gen(function* () {
      // Write multiple blocks to test pagination
      const blocksToWrite = 3;
      const testData = new Uint8Array(BLOCK_SIZE).fill(0x41); // 'A'
      const checksum = yield* sha256Base64(testData);

      // Write blocks 0, 1, 2
      for (let i = 0; i < blocksToWrite; i++) {
        yield* putSnapshotBlock({
          SnapshotId: snapshotId,
          BlockIndex: i,
          BlockData: testData,
          DataLength: BLOCK_SIZE,
          Checksum: checksum,
          ChecksumAlgorithm: "SHA256",
        });
      }

      // Complete the snapshot
      yield* completeSnapshot({
        SnapshotId: snapshotId,
        ChangedBlocksCount: blocksToWrite,
      });

      // Wait for snapshot to be readable (can take 1-5 minutes)
      yield* waitForSnapshotReady(snapshotId);

      // Use .pages() to iterate with small page size
      const allBlocks = yield* listSnapshotBlocks
        .pages({ SnapshotId: snapshotId, MaxResults: 1 })
        .pipe(
          Stream.flatMap((page) => Stream.fromIterable(page.Blocks ?? [])),
          Stream.runCollect,
        );

      const blocksArray = Array.from(allBlocks);
      expect(blocksArray.length).toEqual(blocksToWrite);

      // Verify all block indices are present
      const indices = blocksArray.map((b) => b.BlockIndex).sort();
      expect(indices).toEqual([0, 1, 2]);
    }),
  ),
);

test.skip(
  "listChangedBlocks between parent and child snapshot",
  { timeout: 600_000 },
  Effect.gen(function* () {
    // Create first (parent) snapshot with block 0
    const parentResult = yield* startSnapshot({
      VolumeSize: 1,
      Description: "distilled-ebs-parent",
      Tags: [{ Key: "distilled-test", Value: "ebs" }],
    });
    const parentId = parentResult.SnapshotId!;

    try {
      const testDataA = new Uint8Array(BLOCK_SIZE).fill(0x41); // 'A'
      const checksumA = yield* sha256Base64(testDataA);

      yield* putSnapshotBlock({
        SnapshotId: parentId,
        BlockIndex: 0,
        BlockData: testDataA,
        DataLength: BLOCK_SIZE,
        Checksum: checksumA,
        ChecksumAlgorithm: "SHA256",
      });

      yield* completeSnapshot({
        SnapshotId: parentId,
        ChangedBlocksCount: 1,
      });

      yield* waitForSnapshotReady(parentId);

      // Create child snapshot based on parent, with different block 0
      const childResult = yield* startSnapshot({
        VolumeSize: 1,
        ParentSnapshotId: parentId,
        Description: "distilled-ebs-child",
        Tags: [{ Key: "distilled-test", Value: "ebs" }],
      });
      const childId = childResult.SnapshotId!;

      try {
        const testDataB = new Uint8Array(BLOCK_SIZE).fill(0x42); // 'B'
        const checksumB = yield* sha256Base64(testDataB);

        yield* putSnapshotBlock({
          SnapshotId: childId,
          BlockIndex: 0,
          BlockData: testDataB,
          DataLength: BLOCK_SIZE,
          Checksum: checksumB,
          ChecksumAlgorithm: "SHA256",
        });

        yield* completeSnapshot({
          SnapshotId: childId,
          ChangedBlocksCount: 1,
        });

        yield* waitForSnapshotReady(childId);

        // List changed blocks between parent and child
        const changedResult = yield* listChangedBlocks({
          FirstSnapshotId: parentId,
          SecondSnapshotId: childId,
        });

        expect(changedResult.ChangedBlocks).toBeDefined();
        expect(changedResult.ChangedBlocks!.length).toBeGreaterThan(0);

        // Block 0 should be in the changed list
        const changedBlock0 = changedResult.ChangedBlocks!.find(
          (b) => b.BlockIndex === 0,
        );
        expect(changedBlock0).toBeDefined();
        expect(changedBlock0!.FirstBlockToken).toBeDefined();
        expect(changedBlock0!.SecondBlockToken).toBeDefined();
      } finally {
        yield* cleanupSnapshot(childId);
      }
    } finally {
      yield* cleanupSnapshot(parentId);
    }
  }),
);

// ============================================================================
// Streaming Tests
// ============================================================================

test(
  "putSnapshotBlock with Effect Stream body",
  { timeout: 30_000 },
  withSnapshot("distilled-ebs-streaming-put", (snapshotId) =>
    Effect.gen(function* () {
      // Create test data as multiple chunks
      const chunkSize = 65_536; // 64 KiB chunks
      const numChunks = BLOCK_SIZE / chunkSize; // 8 chunks
      const chunks: Uint8Array[] = [];

      for (let i = 0; i < numChunks; i++) {
        chunks.push(new Uint8Array(chunkSize).fill(0x43)); // 'C'
      }

      // Calculate checksum of full block
      const fullBlock = new Uint8Array(BLOCK_SIZE);
      let offset = 0;
      for (const chunk of chunks) {
        fullBlock.set(chunk, offset);
        offset += chunk.length;
      }
      const checksum = yield* sha256Base64(fullBlock);

      // Create Effect Stream from chunks
      const inputStream = Stream.fromIterable(chunks);

      // Write using streaming body
      const putResult = yield* putSnapshotBlock({
        SnapshotId: snapshotId,
        BlockIndex: 0,
        BlockData: inputStream,
        DataLength: BLOCK_SIZE,
        Checksum: checksum,
        ChecksumAlgorithm: "SHA256",
      });

      expect(putResult.Checksum).toBeDefined();

      // Complete the snapshot (don't wait for it to be readable)
      const completeResult = yield* completeSnapshot({
        SnapshotId: snapshotId,
        ChangedBlocksCount: 1,
      });

      expect(completeResult.Status).toBeDefined();
    }),
  ),
);

// This test requires waiting for snapshot completion - skip by default
test.skip(
  "getSnapshotBlock streams output correctly",
  { timeout: 300_000 },
  withSnapshot("distilled-ebs-streaming-get", (snapshotId) =>
    Effect.gen(function* () {
      // Write a block with pattern data
      const testData = new Uint8Array(BLOCK_SIZE);
      // Fill with pattern: byte value = index % 256
      for (let i = 0; i < BLOCK_SIZE; i++) {
        testData[i] = i % 256;
      }

      const checksum = yield* sha256Base64(testData);

      yield* putSnapshotBlock({
        SnapshotId: snapshotId,
        BlockIndex: 0,
        BlockData: testData,
        DataLength: BLOCK_SIZE,
        Checksum: checksum,
        ChecksumAlgorithm: "SHA256",
      });

      yield* completeSnapshot({
        SnapshotId: snapshotId,
        ChangedBlocksCount: 1,
      });

      yield* waitForSnapshotReady(snapshotId);

      // Get block token
      const listResult = yield* listSnapshotBlocks({
        SnapshotId: snapshotId,
      });
      const block0 = listResult.Blocks!.find((b) => b.BlockIndex === 0)!;

      // Get block with streaming response
      const getResult = yield* getSnapshotBlock({
        SnapshotId: snapshotId,
        BlockIndex: 0,
        BlockToken: block0.BlockToken!,
      });

      expect(getResult.BlockData).toBeDefined();
      expect(getResult.DataLength).toEqual(BLOCK_SIZE);

      // Stream and verify pattern
      const receivedData = yield* getResult.BlockData!.pipe(
        Stream.runCollect,
        Effect.map((chunks) => {
          const total = Array.from(chunks).reduce(
            (acc, c) => acc + c.length,
            0,
          );
          const result = new Uint8Array(total);
          let off = 0;
          for (const chunk of chunks) {
            result.set(chunk, off);
            off += chunk.length;
          }
          return result;
        }),
      );

      expect(receivedData.length).toEqual(BLOCK_SIZE);

      // Verify pattern at various positions
      expect(receivedData[0]).toEqual(0);
      expect(receivedData[1]).toEqual(1);
      expect(receivedData[255]).toEqual(255);
      expect(receivedData[256]).toEqual(0); // Wraps around
      expect(receivedData[257]).toEqual(1);
    }),
  ),
);

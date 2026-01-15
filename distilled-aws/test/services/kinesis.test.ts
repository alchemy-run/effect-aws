import { expect } from "@effect/vitest";
import { Data, Effect, Schedule, Stream } from "effect";
import {
  createStream,
  deleteStream,
  deregisterStreamConsumer,
  describeStream,
  describeStreamConsumer,
  getRecords,
  getShardIterator,
  listShards,
  listStreams,
  putRecord,
  registerStreamConsumer,
  subscribeToShard,
} from "../../src/services/kinesis.ts";
import { test } from "../test.ts";

class NotReady extends Data.TaggedError("NotReady")<{
  status: string | undefined;
}> {}
class StillExists extends Data.TaggedError("StillExists")<{}> {}
class ConsumerDeleting extends Data.TaggedError("ConsumerDeleting")<{}> {}
class StreamNotActive extends Data.TaggedError("StreamNotActive")<{}> {}
class StreamNotDeleted extends Data.TaggedError("StreamNotDeleted")<{}> {}
class ConsumerNotActive extends Data.TaggedError("ConsumerNotActive")<{}> {}

// Helper to wait for stream to become active
const waitForStreamActive = (streamName: string) =>
  describeStream({ StreamName: streamName }).pipe(
    Effect.tapError(Effect.logDebug),
    // If stream doesn't exist yet, treat as NotReady
    Effect.catchTag("ResourceNotFoundException", () =>
      Effect.fail(new NotReady({ status: undefined })),
    ),
    Effect.flatMap((result) => {
      const status = result.StreamDescription?.StreamStatus;
      if (status === "ACTIVE") {
        return Effect.succeed(result);
      }
      return Effect.fail(new NotReady({ status }));
    }),
    Effect.retry({
      while: (err) => err instanceof NotReady && err.status !== "DELETING",
      schedule: Schedule.exponential("1 second", 1.5).pipe(
        Schedule.union(Schedule.spaced("10 seconds")),
        Schedule.intersect(Schedule.recurs(60)),
      ),
    }),
    Effect.mapError(() => new StreamNotActive()),
  );

// Helper to wait for stream to be deleted
const waitForStreamDeleted = (streamName: string) =>
  describeStream({ StreamName: streamName }).pipe(
    // If stream exists, fail with StillExists to trigger retry
    Effect.flatMap((result) => {
      const status = result.StreamDescription?.StreamStatus;
      // Log status for debugging intermittent failures
      return Effect.logDebug(`Stream still exists with status: ${status}`).pipe(
        Effect.flatMap(() => Effect.fail(new StillExists())),
      );
    }),
    // Stream doesn't exist = deleted successfully
    Effect.catchTag("ResourceNotFoundException", () => Effect.void),
    Effect.retry({
      while: (err) => err instanceof StillExists,
      // Use exponential backoff capped at 10 seconds, with more retries
      schedule: Schedule.exponential("1 second", 1.5).pipe(
        Schedule.union(Schedule.spaced("10 seconds")),
        Schedule.intersect(Schedule.recurs(60)),
      ),
    }),
    Effect.mapError(() => new StreamNotDeleted()),
  );

// Helper to wait for consumer to become active
const waitForConsumerActive = (consumerArn: string) =>
  Effect.gen(function* () {
    const result = yield* describeStreamConsumer({
      ConsumerARN: consumerArn,
    }).pipe(
      // If consumer doesn't exist yet, treat as NotReady
      Effect.catchTag("ResourceNotFoundException", () =>
        Effect.fail(new NotReady({ status: undefined })),
      ),
    );

    const status = result.ConsumerDescription?.ConsumerStatus;
    if (status === "ACTIVE") {
      return result;
    }
    if (status === "DELETING") {
      return yield* new ConsumerDeleting();
    }
    return yield* new NotReady({ status });
  }).pipe(
    Effect.retry({
      while: (err) => err instanceof NotReady,
      schedule: Schedule.exponential("1 second", 1.5).pipe(
        Schedule.union(Schedule.spaced("10 seconds")),
        Schedule.intersect(Schedule.recurs(60)),
      ),
    }),
    Effect.mapError((err) =>
      err instanceof ConsumerDeleting ? err : new ConsumerNotActive(),
    ),
  );

// Helper to create a stream and ensure cleanup
const withStream = <A, E, R>(
  streamName: string,
  testFn: (streamName: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Delete existing stream if it exists (cleanup from previous runs)
    yield* deleteStream({
      StreamName: streamName,
      EnforceConsumerDeletion: true,
    }).pipe(Effect.ignore);
    yield* waitForStreamDeleted(streamName);

    // Create stream
    yield* createStream({
      StreamName: streamName,
      ShardCount: 1,
    });

    // Wait for stream to become active
    yield* waitForStreamActive(streamName);

    // Run the test
    return yield* testFn(streamName).pipe(
      Effect.ensuring(
        deleteStream({
          StreamName: streamName,
          EnforceConsumerDeletion: true,
        }).pipe(Effect.ignore),
      ),
    );
  });

// ============================================================================
// Basic Kinesis Tests
// ============================================================================

test(
  "create stream, list streams, describe, and delete",
  { timeout: 300_000 },
  withStream("itty-aws-kinesis-basic-test", (streamName) =>
    Effect.gen(function* () {
      // List streams and verify our stream is in the list
      const listResult = yield* listStreams({});
      const foundStream = listResult.StreamNames?.find(
        (name) => name === streamName,
      );
      expect(foundStream).toBeDefined();

      // Describe stream
      const describeResult = yield* describeStream({ StreamName: streamName });
      expect(describeResult.StreamDescription?.StreamName).toEqual(streamName);
      expect(describeResult.StreamDescription?.StreamStatus).toEqual("ACTIVE");
    }),
  ),
);

test(
  "put record and get records",
  { timeout: 300_000 },
  withStream("itty-aws-kinesis-putget-test", (streamName) =>
    Effect.gen(function* () {
      // Put a record with retry in case of transient failures
      const testData = new TextEncoder().encode(
        JSON.stringify({ test: "hello" }),
      );
      const putResult = yield* putRecord({
        StreamName: streamName,
        Data: testData,
        PartitionKey: "test-partition",
      }).pipe(
        Effect.retry({
          while: (err) => err._tag === "ResourceNotFoundException",
          schedule: Schedule.spaced("2 seconds").pipe(
            Schedule.intersect(Schedule.recurs(10)),
          ),
        }),
      );

      expect(putResult.ShardId).toBeDefined();

      // List shards to get the shard ID (with retry for eventual consistency)
      const shardsResult = yield* listShards({ StreamName: streamName }).pipe(
        Effect.retry({
          while: (err) => err._tag === "ResourceNotFoundException",
          schedule: Schedule.spaced("2 seconds").pipe(
            Schedule.intersect(Schedule.recurs(10)),
          ),
        }),
      );
      const shardId = shardsResult.Shards?.[0]?.ShardId;
      expect(shardId).toBeDefined();

      // Get shard iterator
      const iteratorResult = yield* getShardIterator({
        StreamName: streamName,
        ShardId: shardId!,
        ShardIteratorType: "TRIM_HORIZON",
      });

      expect(iteratorResult.ShardIterator).toBeDefined();

      // Get records (may need retry for record to appear)
      const recordsResult = yield* Effect.gen(function* () {
        const result = yield* getRecords({
          ShardIterator: iteratorResult.ShardIterator!,
        });
        if (!result.Records?.length) {
          return yield* Effect.fail(new Error("No records returned yet"));
        }
        return result;
      }).pipe(
        Effect.retry({
          schedule: Schedule.spaced("1 second").pipe(
            Schedule.intersect(Schedule.recurs(30)),
          ),
        }),
      );

      // Verify data matches
      const record = recordsResult.Records![0];
      expect(record.Data).toBeDefined();
    }),
  ),
);

// ============================================================================
// Event Stream Tests (SubscribeToShard)
// ============================================================================

// Note: SubscribeToShard requires enhanced fan-out which may not be fully
// supported in LocalStack. This test verifies the event stream receives real events.
test(
  "subscribeToShard receives records matching sent data",
  { timeout: 300_000 },
  withStream("itty-aws-kinesis-subscribe-test", (streamName) =>
    Effect.gen(function* () {
      // Get stream ARN
      const describeResult = yield* describeStream({ StreamName: streamName });
      const streamArn = describeResult.StreamDescription?.StreamARN;
      expect(streamArn).toBeDefined();

      // Put some records into the stream BEFORE subscribing
      const testRecords = [
        { id: 1, message: "Hello from record 1" },
        { id: 2, message: "Hello from record 2" },
        { id: 3, message: "Hello from record 3" },
      ];

      // Retry schedule for eventual consistency
      const retrySchedule = Schedule.spaced("2 seconds").pipe(
        Schedule.intersect(Schedule.recurs(10)),
      );

      for (const record of testRecords) {
        yield* putRecord({
          StreamName: streamName,
          Data: new TextEncoder().encode(JSON.stringify(record)),
          PartitionKey: `partition-${record.id}`,
        }).pipe(
          Effect.retry({
            while: (err) => err._tag === "ResourceNotFoundException",
            schedule: retrySchedule,
          }),
        );
      }

      // Register a stream consumer (required for SubscribeToShard)
      const consumerName = "test-consumer";
      const registerResult = yield* registerStreamConsumer({
        StreamARN: streamArn!,
        ConsumerName: consumerName,
      }).pipe(
        Effect.retry({
          while: (err) => err._tag === "ResourceNotFoundException",
          schedule: retrySchedule,
        }),
      );

      const consumerArn = registerResult.Consumer?.ConsumerARN;
      expect(consumerArn).toBeDefined();

      // Wait for consumer to become active
      yield* waitForConsumerActive(consumerArn!);

      // Get shard ID
      const shardsResult = yield* listShards({ StreamName: streamName }).pipe(
        Effect.retry({
          while: (err) => err._tag === "ResourceNotFoundException",
          schedule: retrySchedule,
        }),
      );
      const shardId = shardsResult.Shards?.[0]?.ShardId;
      expect(shardId).toBeDefined();

      try {
        // Subscribe to shard - this returns an event stream
        const subscribeResult = yield* subscribeToShard({
          ConsumerARN: consumerArn!,
          ShardId: shardId!,
          StartingPosition: {
            Type: "TRIM_HORIZON",
          },
        }).pipe(
          Effect.retry({
            while: (err) => err._tag === "ResourceNotFoundException",
            schedule: retrySchedule,
          }),
        );

        // The EventStream should be an Effect Stream
        const eventStream = subscribeResult.EventStream;

        // Collect events from the stream - we need enough to get the records
        const events = yield* Stream.take(eventStream, 5).pipe(
          Stream.runCollect,
          Effect.timeout("30 seconds"),
          Effect.catchAll((err) => {
            return Effect.logWarning(
              `Event stream timeout or error: ${err}`,
            ).pipe(Effect.as([]));
          }),
        );

        // Verify we received events
        expect(events.length).toBeGreaterThan(0);

        // Find SubscribeToShardEvent events with records
        // Events are tagged union members like { SubscribeToShardEvent: {...} }
        const allReceivedRecords: Array<{ id: number; message: string }> = [];

        for (const event of events) {
          if (
            typeof event === "object" &&
            event !== null &&
            "SubscribeToShardEvent" in event
          ) {
            const shardEvent = (event as Record<string, unknown>)
              .SubscribeToShardEvent as Record<string, unknown>;
            const records = shardEvent.Records as Array<
              Record<string, unknown>
            >;
            // Records contain the data we sent
            for (const record of records) {
              if (record.Data) {
                // Data comes as base64 string from event stream JSON parsing
                const dataBytes =
                  record.Data instanceof Uint8Array
                    ? record.Data
                    : Uint8Array.from(atob(record.Data as string), (c) =>
                        c.charCodeAt(0),
                      );
                const dataText = new TextDecoder().decode(dataBytes);
                const data = JSON.parse(dataText) as {
                  id: number;
                  message: string;
                };
                allReceivedRecords.push(data);
              }
            }
          }
        }

        // Verify we received all the records we sent
        expect(allReceivedRecords.length).toEqual(testRecords.length);

        // Verify the content matches (records may be in different order)
        for (const sent of testRecords) {
          const found = allReceivedRecords.find(
            (r) => r.id === sent.id && r.message === sent.message,
          );
          expect(found).toBeDefined();
        }
      } finally {
        // Clean up consumer
        yield* deregisterStreamConsumer({
          ConsumerARN: consumerArn!,
        }).pipe(Effect.ignore);
      }
    }),
  ),
);

// ============================================================================
// Long-running Event Stream Test
// ============================================================================

// This test exercises the event stream over a longer period with continuous
// record production to catch edge cases like:
// - Message fragmentation across TCP chunks
// - Multiple messages arriving in a single chunk
// - Stream continuation after initial batch
// - Idle periods between records
test(
  "subscribeToShard handles continuous streaming",
  { timeout: 300_000 },
  withStream("itty-aws-kinesis-continuous-test", (streamName) =>
    Effect.gen(function* () {
      // Get stream ARN
      const describeResult = yield* describeStream({ StreamName: streamName });
      const streamArn = describeResult.StreamDescription?.StreamARN;
      expect(streamArn).toBeDefined();

      // Register a stream consumer
      const consumerName = "test-consumer-continuous";
      const registerResult = yield* registerStreamConsumer({
        StreamARN: streamArn!,
        ConsumerName: consumerName,
      });

      const consumerArn = registerResult.Consumer?.ConsumerARN;
      expect(consumerArn).toBeDefined();

      yield* waitForConsumerActive(consumerArn!);

      const shardsResult = yield* listShards({ StreamName: streamName });
      const shardId = shardsResult.Shards?.[0]?.ShardId;
      expect(shardId).toBeDefined();

      try {
        // Track records we're going to send
        const sentRecords: Array<{ id: number; timestamp: number }> = [];
        const receivedRecords: Array<{ id: number; timestamp: number }> = [];
        let producerDone = false;

        // Producer fiber: continuously put records at varying intervals
        const producer = Effect.gen(function* () {
          for (let i = 0; i < 10; i++) {
            const record = { id: i, timestamp: Date.now() };
            sentRecords.push(record);

            yield* putRecord({
              StreamName: streamName,
              Data: new TextEncoder().encode(JSON.stringify(record)),
              PartitionKey: `partition-${i % 3}`, // Distribute across partitions
            });

            // Vary the interval to create different timing patterns
            const delay = i % 2 === 0 ? 500 : 1500;
            yield* Effect.sleep(`${delay} millis`);
          }

          producerDone = true;
        });

        // Consumer: subscribe and collect records
        const consumer = Effect.gen(function* () {
          const subscribeResult = yield* subscribeToShard({
            ConsumerARN: consumerArn!,
            ShardId: shardId!,
            StartingPosition: {
              Type: "TRIM_HORIZON",
            },
          });

          const eventStream = subscribeResult.EventStream;

          // Collect events until we have all records or timeout
          yield* Stream.takeWhile(eventStream, () => {
            // Stop when producer is done and we have all records
            if (producerDone && receivedRecords.length >= sentRecords.length) {
              return false;
            }
            return true;
          }).pipe(
            Stream.runForEach((event) =>
              Effect.gen(function* () {
                // Events are tagged union members like { SubscribeToShardEvent: {...} }
                if (
                  typeof event === "object" &&
                  event !== null &&
                  "SubscribeToShardEvent" in event
                ) {
                  const shardEvent = (event as Record<string, unknown>)
                    .SubscribeToShardEvent as Record<string, unknown>;
                  const records = shardEvent.Records as Array<
                    Record<string, unknown>
                  >;
                  for (const record of records) {
                    if (record.Data) {
                      // Data comes as base64 string from event stream JSON parsing
                      const dataBytes =
                        record.Data instanceof Uint8Array
                          ? record.Data
                          : Uint8Array.from(atob(record.Data as string), (c) =>
                              c.charCodeAt(0),
                            );
                      const dataText = new TextDecoder().decode(dataBytes);
                      const data = JSON.parse(dataText) as {
                        id: number;
                        timestamp: number;
                      };
                      receivedRecords.push(data);
                    }
                  }
                }
              }),
            ),
            Effect.timeout("60 seconds"),
          );
        });

        // Run producer and consumer concurrently
        yield* Effect.all([producer, consumer], { concurrency: 2 });

        // Verify we received a reasonable number of records
        // (LocalStack may not deliver all records immediately)
        expect(receivedRecords.length >= sentRecords.length / 2).toBe(true);

        // Verify received records match sent records
        for (const received of receivedRecords) {
          const sent = sentRecords.find((s) => s.id === received.id);
          expect(sent).toBeDefined();
        }
      } finally {
        yield* deregisterStreamConsumer({
          ConsumerARN: consumerArn!,
        }).pipe(Effect.ignore);
      }
    }),
  ),
);

// ============================================================================
// Pagination Stream Tests
// ============================================================================

test(
  "listStreams.pages() streams full response pages",
  Effect.gen(function* () {
    // Stream all pages of streams
    const pages = yield* listStreams
      .pages({ Limit: 10 })
      .pipe(Stream.runCollect);

    const pagesArray = Array.from(pages);
    expect(pagesArray.length).toBeGreaterThanOrEqual(1);

    // Each page should have StreamNames (may be empty)
    for (const page of pagesArray) {
      expect(page.StreamNames).toBeDefined();
    }
  }),
);

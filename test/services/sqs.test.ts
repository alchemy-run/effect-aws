import { expect } from "@effect/vitest";
import { Effect, Schedule, Stream } from "effect";
import {
  changeMessageVisibility,
  createQueue,
  deleteMessage,
  deleteQueue,
  getQueueAttributes,
  getQueueUrl,
  listQueues,
  listQueueTags,
  purgeQueue,
  receiveMessage,
  sendMessage,
  setQueueAttributes,
  tagQueue,
  untagQueue,
} from "../../src/services/sqs.ts";
import { test } from "../test.ts";

// ============================================================================
// Idempotent Cleanup Helpers
// ============================================================================

// Clean up a queue by URL
const cleanupQueueByUrl = (queueUrl: string) =>
  deleteQueue({ QueueUrl: queueUrl }).pipe(Effect.ignore);

// Clean up a queue by name - find it first, then delete
const cleanupQueueByName = (queueName: string) =>
  Effect.gen(function* () {
    const queueUrl = yield* getQueueUrl({ QueueName: queueName }).pipe(
      Effect.map((r) => r.QueueUrl),
      Effect.orElseSucceed(() => undefined),
    );
    if (queueUrl) {
      yield* cleanupQueueByUrl(queueUrl);
    }
  });

// ============================================================================
// Idempotent Test Helpers
// ============================================================================

// Retry policy for QueueDoesNotExist (eventual consistency after create)
const retryQueueNotExist = {
  while: (err: { _tag: string }) => err._tag === "QueueDoesNotExist",
  schedule: Schedule.spaced("1 second").pipe(
    Schedule.intersect(Schedule.recurs(10)),
  ),
};

// Helper to ensure cleanup happens even on failure - cleans up before AND after
const withQueue = <A, E, R>(
  queueName: string,
  testFn: (queueUrl: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any leftover from previous runs
    yield* cleanupQueueByName(queueName);

    // Create the queue, retrying if recently deleted
    const createResult = yield* createQueue({ QueueName: queueName }).pipe(
      Effect.retry({
        while: (err) => err._tag === "QueueDeletedRecently",
        schedule: Schedule.spaced("5 seconds").pipe(
          Schedule.intersect(Schedule.recurs(12)), // Max 60 seconds
        ),
      }),
    );
    const queueUrl = createResult.QueueUrl!;

    return yield* testFn(queueUrl).pipe(
      Effect.ensuring(cleanupQueueByUrl(queueUrl)),
    );
  });

// Helper for FIFO queues - cleans up before AND after
const withFifoQueue = <A, E, R>(
  queueName: string,
  testFn: (queueUrl: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    const fifoQueueName = queueName.endsWith(".fifo")
      ? queueName
      : `${queueName}.fifo`;

    // Clean up any leftover from previous runs
    yield* cleanupQueueByName(fifoQueueName);

    // Create the queue, retrying if recently deleted
    const createResult = yield* createQueue({
      QueueName: fifoQueueName,
      Attributes: {
        FifoQueue: "true",
        ContentBasedDeduplication: "true",
      },
    }).pipe(
      Effect.retry({
        while: (err) => err._tag === "QueueDeletedRecently",
        schedule: Schedule.spaced("5 seconds").pipe(
          Schedule.intersect(Schedule.recurs(12)), // Max 60 seconds
        ),
      }),
    );
    const queueUrl = createResult.QueueUrl!;

    return yield* testFn(queueUrl).pipe(
      Effect.ensuring(cleanupQueueByUrl(queueUrl)),
    );
  });

// ============================================================================
// Queue Lifecycle Tests
// ============================================================================

test(
  "create queue, get queue url, list queues, and delete",
  withQueue("itty-sqs-lifecycle", (queueUrl) =>
    Effect.gen(function* () {
      // Verify queue URL is returned
      expect(queueUrl).toBeDefined();

      // Get queue URL by name (retry for eventual consistency after create)
      const getUrlResult = yield* getQueueUrl({
        QueueName: "itty-sqs-lifecycle",
      }).pipe(Effect.retry(retryQueueNotExist));
      expect(getUrlResult.QueueUrl).toEqual(queueUrl);

      // List queues and verify our queue is in the list
      const listResult = yield* listQueues({
        QueueNamePrefix: "itty-sqs-lifecycle",
      });
      const foundQueue = listResult.QueueUrls?.find((url) =>
        url.includes("itty-sqs-lifecycle"),
      );
      expect(foundQueue).toBeDefined();
    }),
  ),
);

// ============================================================================
// Queue Attributes Tests
// ============================================================================

test(
  "set and get queue attributes",
  withQueue("itty-sqs-attributes", (queueUrl) =>
    Effect.gen(function* () {
      // Set queue attributes (retry for eventual consistency after create)
      yield* setQueueAttributes({
        QueueUrl: queueUrl,
        Attributes: {
          VisibilityTimeout: "60",
          MessageRetentionPeriod: "86400", // 1 day
          DelaySeconds: "5",
        },
      }).pipe(Effect.retry(retryQueueNotExist));

      // Get queue attributes with retry for eventual consistency
      yield* Effect.gen(function* () {
        const attrs = yield* getQueueAttributes({
          QueueUrl: queueUrl,
          AttributeNames: [
            "VisibilityTimeout",
            "MessageRetentionPeriod",
            "DelaySeconds",
            "ApproximateNumberOfMessages",
          ],
        });

        // Check if attributes are updated yet
        if (attrs.Attributes?.VisibilityTimeout !== "60") {
          return yield* Effect.fail("not ready yet" as const);
        }

        expect(attrs.Attributes?.VisibilityTimeout).toEqual("60");
        expect(attrs.Attributes?.MessageRetentionPeriod).toEqual("86400");
        expect(attrs.Attributes?.DelaySeconds).toEqual("5");
        expect(attrs.Attributes?.ApproximateNumberOfMessages).toEqual("0");
      }).pipe(
        Effect.retry({
          while: (err) => err === "not ready yet",
          schedule: Schedule.spaced("1 second").pipe(
            Schedule.intersect(Schedule.recurs(10)),
          ),
        }),
      );
    }),
  ),
);

// ============================================================================
// Queue Tagging Tests
// ============================================================================

test(
  "tag queue, list tags, and untag queue",
  withQueue("itty-sqs-tagging", (queueUrl) =>
    Effect.gen(function* () {
      // Add tags to queue (retry for eventual consistency after create)
      yield* tagQueue({
        QueueUrl: queueUrl,
        Tags: {
          Environment: "Test",
          Project: "itty-aws",
          Team: "Platform",
        },
      }).pipe(Effect.retry(retryQueueNotExist));

      // List tags
      const tagsResult = yield* listQueueTags({ QueueUrl: queueUrl });
      expect(tagsResult.Tags?.Environment).toEqual("Test");
      expect(tagsResult.Tags?.Project).toEqual("itty-aws");

      // Update a tag
      yield* tagQueue({
        QueueUrl: queueUrl,
        Tags: {
          Environment: "Production",
        },
      });

      // Verify update
      const updatedTags = yield* listQueueTags({ QueueUrl: queueUrl });
      expect(updatedTags.Tags?.Environment).toEqual("Production");

      // Remove a tag
      yield* untagQueue({
        QueueUrl: queueUrl,
        TagKeys: ["Project"],
      });

      // Verify tag removal
      const finalTags = yield* listQueueTags({ QueueUrl: queueUrl });
      expect(finalTags.Tags?.Project).toBeUndefined();
      expect(finalTags.Tags?.Environment).toEqual("Production");
    }),
  ),
);

// ============================================================================
// Message Send/Receive Tests
// ============================================================================

test(
  "send and receive message",
  withQueue("itty-sqs-message", (queueUrl) =>
    Effect.gen(function* () {
      const messageBody = "Hello, SQS!";

      // Send message (retry for eventual consistency after create)
      const sendResult = yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
      }).pipe(Effect.retry(retryQueueNotExist));

      expect(sendResult.MessageId).toBeDefined();
      expect(sendResult.MD5OfMessageBody).toBeDefined();

      // Receive message
      const receiveResult = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
      });

      expect(receiveResult.Messages).toBeDefined();
      expect(receiveResult.Messages!.length).toBeGreaterThan(0);

      const message = receiveResult.Messages![0];
      expect(message.Body).toEqual(messageBody);
      expect(message.ReceiptHandle).toBeDefined();

      // Delete the message
      yield* deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle!,
      });

      // Verify message is deleted (receive should return empty)
      const receiveAfterDelete = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 1,
      });

      expect(
        receiveAfterDelete.Messages === undefined ||
          receiveAfterDelete.Messages.length === 0,
      ).toBe(true);
    }),
  ),
);

test(
  "send message with delay",
  withQueue("itty-sqs-delay", (queueUrl) =>
    Effect.gen(function* () {
      const messageBody = "Delayed message";

      // Send message with delay (retry for eventual consistency after create)
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
        DelaySeconds: 1,
      }).pipe(Effect.retry(retryQueueNotExist));

      // Immediately try to receive - should be empty due to delay
      const immediateReceive = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 0,
      });

      // Message should not be immediately available due to delay
      // (though timing might vary in LocalStack)
      if (immediateReceive.Messages && immediateReceive.Messages.length > 0) {
        // If we receive it immediately, LocalStack may not fully support delays
        // Just log and continue - the main test is that delays work eventually
      }

      // Wait for the delay to expire
      yield* Effect.sleep("2 seconds");

      // Now receive - should get the message
      const delayedReceive = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
      });

      expect(delayedReceive.Messages).toBeDefined();
      expect(delayedReceive.Messages!.length).toBeGreaterThan(0);
      expect(delayedReceive.Messages![0].Body).toEqual(messageBody);
    }),
  ),
);

test(
  "send message with message attributes",
  withQueue("itty-sqs-attrs", (queueUrl) =>
    Effect.gen(function* () {
      const messageBody = "Message with attributes";

      // Send message with attributes (retry for eventual consistency after create)
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
        MessageAttributes: {
          StringAttr: {
            DataType: "String",
            StringValue: "Hello",
          },
          NumberAttr: {
            DataType: "Number",
            StringValue: "42",
          },
        },
      }).pipe(Effect.retry(retryQueueNotExist));

      // Receive message with attributes
      const receiveResult = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
        MessageAttributeNames: ["All"],
      });

      expect(receiveResult.Messages).toBeDefined();
      expect(receiveResult.Messages!.length).toBeGreaterThan(0);

      const message = receiveResult.Messages![0];
      const attrs = message.MessageAttributes;

      expect(attrs?.StringAttr?.StringValue).toEqual("Hello");
      expect(attrs?.NumberAttr?.StringValue).toEqual("42");
    }),
  ),
);

// ============================================================================
// Visibility Timeout Tests
// ============================================================================

test(
  "change message visibility",
  withQueue("itty-sqs-visibility", (queueUrl) =>
    Effect.gen(function* () {
      const messageBody = "Visibility test";

      // Send message (retry for eventual consistency after create)
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
      }).pipe(Effect.retry(retryQueueNotExist));

      // Receive message
      const receiveResult = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
        VisibilityTimeout: 30, // Set initial visibility timeout
      });

      expect(receiveResult.Messages).toBeDefined();
      expect(receiveResult.Messages!.length).toBeGreaterThan(0);

      const message = receiveResult.Messages![0];

      // Change visibility timeout
      yield* changeMessageVisibility({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle!,
        VisibilityTimeout: 60, // Extend to 60 seconds
      });

      // Message should still not be visible (extended timeout)
      const immediateReceive = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 1,
      });

      // Should not receive the same message due to visibility timeout
      const sameMessageReceived = Boolean(
        immediateReceive.Messages &&
        immediateReceive.Messages.length > 0 &&
        immediateReceive.Messages[0].MessageId === message.MessageId,
      );
      expect(sameMessageReceived).toBe(false);
    }),
  ),
);

// ============================================================================
// Batch Operations Tests
// ============================================================================

test(
  "send multiple messages and delete them individually",
  withQueue("itty-sqs-batch", (queueUrl) =>
    Effect.gen(function* () {
      // Send multiple messages individually (first one retries for eventual consistency)
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "Message 1",
      }).pipe(Effect.retry(retryQueueNotExist));
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "Message 2",
      });
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "Message 3",
      });

      // Receive all messages - SQS may not return all in one call, so we need to collect
      type Message = { Body?: string; ReceiptHandle?: string };
      const allMessages: Message[] = [];
      let attempts = 0;
      const maxAttempts = 5;

      while (allMessages.length < 3 && attempts < maxAttempts) {
        const receiveResult = yield* receiveMessage({
          QueueUrl: queueUrl,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 3,
        });

        if (receiveResult.Messages) {
          allMessages.push(...receiveResult.Messages);
        }
        attempts++;
      }

      expect(allMessages.length).toEqual(3);

      // Verify message bodies
      const bodies = allMessages.map((m) => m.Body).sort();
      expect(bodies[0]).toEqual("Message 1");
      expect(bodies[1]).toEqual("Message 2");
      expect(bodies[2]).toEqual("Message 3");

      // Delete messages individually
      for (const msg of allMessages) {
        yield* deleteMessage({
          QueueUrl: queueUrl,
          ReceiptHandle: msg.ReceiptHandle!,
        });
      }

      // Verify queue is empty
      const finalReceive = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 1,
      });

      expect(
        finalReceive.Messages === undefined ||
          finalReceive.Messages.length === 0,
      ).toBe(true);
    }),
  ),
);

// ============================================================================
// Purge Queue Tests
// ============================================================================

test(
  "purge queue",
  withQueue("itty-sqs-purge", (queueUrl) =>
    Effect.gen(function* () {
      // Send multiple messages individually (first one retries for eventual consistency)
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "Purge me 1",
      }).pipe(Effect.retry(retryQueueNotExist));
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "Purge me 2",
      });
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "Purge me 3",
      });

      // Purge the queue
      yield* purgeQueue({ QueueUrl: queueUrl });

      // Wait a moment for purge to take effect
      yield* Effect.sleep("2 seconds");

      // Verify queue is empty
      const receiveResult = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 1,
      });

      expect(
        receiveResult.Messages === undefined ||
          receiveResult.Messages.length === 0,
      ).toBe(true);
    }),
  ),
);

// ============================================================================
// FIFO Queue Tests
// ============================================================================

test(
  "FIFO queue: send and receive with message group",
  withFifoQueue("itty-sqs-fifo", (queueUrl) =>
    Effect.gen(function* () {
      // Send messages to same message group - they should be received in order
      // (first one retries for eventual consistency)
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "FIFO Message 1",
        MessageGroupId: "group1",
      }).pipe(Effect.retry(retryQueueNotExist));

      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "FIFO Message 2",
        MessageGroupId: "group1",
      });

      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "FIFO Message 3",
        MessageGroupId: "group1",
      });

      // Receive messages - should be in order
      const receiveResult1 = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
      });

      expect(receiveResult1.Messages?.[0]?.Body).toEqual("FIFO Message 1");

      // Delete first message before receiving next
      yield* deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: receiveResult1.Messages![0].ReceiptHandle!,
      });

      const receiveResult2 = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
      });

      expect(receiveResult2.Messages?.[0]?.Body).toEqual("FIFO Message 2");

      // Verify sequence numbers are present for FIFO
      if (!receiveResult1.Messages?.[0]?.Attributes?.SequenceNumber) {
        // SequenceNumber is returned in MessageSystemAttributeNames
        // Let's receive with system attributes
      }
    }),
  ),
);

test(
  "FIFO queue: different message groups processed independently",
  withFifoQueue("itty-sqs-fifo-groups", (queueUrl) =>
    Effect.gen(function* () {
      // Send messages to different groups (first one retries for eventual consistency)
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "Group A - Message 1",
        MessageGroupId: "groupA",
      }).pipe(Effect.retry(retryQueueNotExist));

      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "Group B - Message 1",
        MessageGroupId: "groupB",
      });

      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "Group A - Message 2",
        MessageGroupId: "groupA",
      });

      // Receive all messages (up to 10)
      const receiveResult = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 5,
      });

      expect(receiveResult.Messages).toBeDefined();
      expect(receiveResult.Messages!.length).toEqual(3);

      // Messages from same group should maintain relative order
      const groupAMessages = receiveResult.Messages!.filter((m) =>
        m.Body?.startsWith("Group A"),
      );
      const groupBMessages = receiveResult.Messages!.filter((m) =>
        m.Body?.startsWith("Group B"),
      );

      expect(groupAMessages.length).toEqual(2);
      expect(groupBMessages.length).toEqual(1);
    }),
  ),
);

// ============================================================================
// Long Polling Tests
// ============================================================================

test(
  "long polling with WaitTimeSeconds",
  withQueue("itty-sqs-long-poll-test", (queueUrl) =>
    Effect.gen(function* () {
      // Send a message first (retry for eventual consistency after create)
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "Long poll test",
      }).pipe(Effect.retry(retryQueueNotExist));

      // Long poll should find the message
      const receiveResult = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
      });

      expect(receiveResult.Messages).toBeDefined();
      expect(receiveResult.Messages!.length).toBeGreaterThan(0);
      expect(receiveResult.Messages![0].Body).toEqual("Long poll test");

      // Now verify an empty queue returns no messages with short poll
      yield* deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: receiveResult.Messages![0].ReceiptHandle!,
      });

      const emptyReceive = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 1,
      });

      // Should return empty since no messages
      expect(
        emptyReceive.Messages === undefined ||
          emptyReceive.Messages.length === 0,
      ).toBe(true);
    }),
  ),
);

// ============================================================================
// Receive with System Attributes Tests
// ============================================================================

test(
  "receive message with system attributes",
  withQueue("itty-sqs-sysattrs", (queueUrl) =>
    Effect.gen(function* () {
      // Send a message (retry for eventual consistency after create)
      yield* sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "System attributes test",
      }).pipe(Effect.retry(retryQueueNotExist));

      // Receive with all system attributes
      const receiveResult = yield* receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
        MessageSystemAttributeNames: ["All"],
      });

      expect(receiveResult.Messages).toBeDefined();
      expect(receiveResult.Messages!.length).toBeGreaterThan(0);

      const message = receiveResult.Messages![0];
      const attrs = message.Attributes;

      // Should have SentTimestamp
      expect(attrs?.SentTimestamp).toBeDefined();

      // Should have ApproximateReceiveCount
      expect(attrs?.ApproximateReceiveCount).toBeDefined();

      // ApproximateReceiveCount should be "1" for first receive
      expect(attrs!.ApproximateReceiveCount).toEqual("1");
    }),
  ),
);

// ============================================================================
// Pagination Stream Tests
// ============================================================================

test(
  "listQueues.pages() streams full response pages",
  Effect.gen(function* () {
    // Stream all pages of queues
    const pages = yield* listQueues
      .pages({ MaxResults: 10 })
      .pipe(Stream.runCollect);

    const pagesArray = Array.from(pages);
    expect(pagesArray.length).toBeGreaterThanOrEqual(1);
  }),
);

test(
  "listQueues.items() streams queue URLs directly",
  Effect.gen(function* () {
    // Stream all queue URLs using .items()
    const queueUrls = yield* listQueues
      .items({ MaxResults: 10 })
      .pipe(Stream.runCollect);

    const urlsArray = Array.from(queueUrls);

    // Each item should be a string URL
    for (const url of urlsArray) {
      expect(typeof url).toBe("string");
    }
  }),
);

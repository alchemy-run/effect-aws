import { expect } from "@effect/vitest";
import { Effect, Schedule, Stream } from "effect";
import {
  // Permissions
  addPermission,
  // Topic operations
  createTopic,
  deleteTopic,
  getSubscriptionAttributes,
  getTopicAttributes,
  listSubscriptionsByTopic,
  listTagsForResource,
  listTopics,
  // Publishing
  publish,
  publishBatch,
  removePermission,
  setSubscriptionAttributes,
  setTopicAttributes,
  // Subscription operations
  subscribe,
  // Tagging
  tagResource,
  unsubscribe,
  untagResource,
} from "../../src/services/sns.ts";
import { test } from "../test.ts";

// ============================================================================
// Idempotent Cleanup Helpers
// ============================================================================

// Clean up all subscriptions for a topic
const cleanupTopicSubscriptions = (topicArn: string) =>
  Effect.gen(function* () {
    const subs = yield* listSubscriptionsByTopic({ TopicArn: topicArn }).pipe(
      Effect.orElseSucceed(() => ({ Subscriptions: [] })),
    );

    for (const sub of subs.Subscriptions ?? []) {
      // Only unsubscribe confirmed subscriptions (not pending)
      if (
        sub.SubscriptionArn &&
        !sub.SubscriptionArn.includes("pending") &&
        sub.SubscriptionArn !== "pending confirmation" &&
        sub.SubscriptionArn !== "PendingConfirmation"
      ) {
        yield* unsubscribe({ SubscriptionArn: sub.SubscriptionArn }).pipe(
          Effect.ignore,
        );
      }
    }
  });

// Clean up a topic by ARN - unsubscribe all, then delete
const cleanupTopicByArn = (topicArn: string) =>
  Effect.gen(function* () {
    yield* cleanupTopicSubscriptions(topicArn);
    yield* deleteTopic({ TopicArn: topicArn }).pipe(Effect.ignore);
  });

// Clean up a topic by name - find it first, then delete
const cleanupTopicByName = (topicName: string) =>
  Effect.gen(function* () {
    // List all topics and find the one with matching name
    const topics = yield* listTopics({}).pipe(
      Effect.orElseSucceed(() => ({ Topics: [] })),
    );

    // Topic ARN format: arn:aws:sns:region:account-id:topic-name
    const matchingTopic = topics.Topics?.find((t) =>
      t.TopicArn?.endsWith(`:${topicName}`),
    );

    if (matchingTopic?.TopicArn) {
      yield* cleanupTopicByArn(matchingTopic.TopicArn);
    }
  });

// ============================================================================
// Idempotent Test Helpers
// ============================================================================

// Helper to ensure cleanup happens even on failure - cleans up before AND after
const withTopic = <A, E, R>(
  name: string,
  testFn: (topicArn: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any leftover from previous runs
    yield* cleanupTopicByName(name);

    const result = yield* createTopic({ Name: name });
    const topicArn = result.TopicArn!;
    return yield* testFn(topicArn).pipe(
      Effect.ensuring(cleanupTopicByArn(topicArn)),
    );
  });

// ============================================================================
// Topic Lifecycle Tests
// ============================================================================

test(
  "create topic, get attributes, list topics, and delete",
  withTopic("itty-sns-lifecycle", (topicArn) =>
    Effect.gen(function* () {
      // Get topic attributes
      const attributes = yield* getTopicAttributes({ TopicArn: topicArn });
      expect(attributes.Attributes).toBeDefined();

      // TopicArn should match
      expect(attributes.Attributes!.TopicArn).toEqual(topicArn);

      // List topics and verify our topic is in the list
      const listResult = yield* listTopics({});
      const foundTopic = listResult.Topics?.find(
        (t) => t.TopicArn === topicArn,
      );
      expect(foundTopic).toBeDefined();
    }),
  ),
);

test(
  "set topic attributes",
  withTopic("itty-sns-attributes", (topicArn) =>
    Effect.gen(function* () {
      // Set DisplayName attribute
      yield* setTopicAttributes({
        TopicArn: topicArn,
        AttributeName: "DisplayName",
        AttributeValue: "My Test Topic",
      });

      // Verify the attribute was set
      const attributes = yield* getTopicAttributes({ TopicArn: topicArn });
      expect(attributes.Attributes?.DisplayName).toEqual("My Test Topic");

      // Update the attribute
      yield* setTopicAttributes({
        TopicArn: topicArn,
        AttributeName: "DisplayName",
        AttributeValue: "Updated Topic Name",
      });

      // Verify the update
      const updatedAttributes = yield* getTopicAttributes({
        TopicArn: topicArn,
      });
      expect(updatedAttributes.Attributes?.DisplayName).toEqual(
        "Updated Topic Name",
      );
    }),
  ),
);

// ============================================================================
// Tagging Tests
// ============================================================================

test(
  "topic tagging: add, list, and remove tags",
  withTopic("itty-sns-tagging", (topicArn) =>
    Effect.gen(function* () {
      // Add tags
      yield* tagResource({
        ResourceArn: topicArn,
        Tags: [
          { Key: "Environment", Value: "Test" },
          { Key: "Project", Value: "itty-aws" },
          { Key: "Team", Value: "Platform" },
        ],
      });

      // List and verify tags
      const tags = yield* listTagsForResource({ ResourceArn: topicArn });
      expect(tags.Tags?.length).toEqual(3);

      const envTag = tags.Tags?.find((t) => t.Key === "Environment");
      expect(envTag?.Value).toEqual("Test");

      // Remove one tag
      yield* untagResource({
        ResourceArn: topicArn,
        TagKeys: ["Team"],
      });

      // Verify removal
      const updatedTags = yield* listTagsForResource({ ResourceArn: topicArn });
      expect(updatedTags.Tags?.length).toEqual(2);

      const teamTag = updatedTags.Tags?.find((t) => t.Key === "Team");
      expect(teamTag).toBeUndefined();

      // Remove remaining tags
      yield* untagResource({
        ResourceArn: topicArn,
        TagKeys: ["Environment", "Project"],
      });

      // Verify all tags removed
      const finalTags = yield* listTagsForResource({ ResourceArn: topicArn });
      expect(finalTags.Tags === undefined || finalTags.Tags.length === 0).toBe(
        true,
      );
    }),
  ),
);

// ============================================================================
// Subscription Tests
// ============================================================================

test(
  "subscribe, list subscriptions, and unsubscribe",
  withTopic("itty-sns-subscription", (topicArn) =>
    Effect.gen(function* () {
      // Create a subscription using HTTPS endpoint
      // In real AWS, HTTPS subscriptions require confirmation so will be pending
      const subscribeResult = yield* subscribe({
        TopicArn: topicArn,
        Protocol: "https",
        Endpoint: "https://example.com/sns-endpoint",
        ReturnSubscriptionArn: true,
      });

      // Verify we got an ARN back (even if subscription is pending)
      const subscriptionArn = subscribeResult.SubscriptionArn;
      expect(subscriptionArn).toBeDefined();

      // Note: HTTPS subscriptions without endpoint confirmation are "pending"
      // AWS may or may not list pending subscriptions consistently due to eventual consistency
      // We just verify the subscribe call succeeded by checking we got an ARN
      // The subscription will be cleaned up when the topic is deleted
    }),
  ),
);

test(
  "subscription attributes: get and set",
  withTopic("itty-sns-sub-attributes", (topicArn) =>
    Effect.gen(function* () {
      // Create a subscription with HTTPS endpoint
      // Note: In real AWS, HTTPS subscriptions require confirmation so will be pending
      const subscribeResult = yield* subscribe({
        TopicArn: topicArn,
        Protocol: "https",
        Endpoint: "https://example.com/sns-attrs-test",
        ReturnSubscriptionArn: true,
      });

      const subscriptionArn = subscribeResult.SubscriptionArn;
      if (
        !subscriptionArn ||
        subscriptionArn.includes("pending") ||
        subscriptionArn === "pending confirmation"
      ) {
        // Skip attribute tests if subscription is pending (expected in live AWS for HTTPS)
        // We can still verify the subscription was created with retry for eventual consistency
        yield* Effect.gen(function* () {
          const topicSubs = yield* listSubscriptionsByTopic({
            TopicArn: topicArn,
          });
          const foundSub = topicSubs.Subscriptions?.find(
            (s) => s.Endpoint === "https://example.com/sns-attrs-test",
          );
          if (!foundSub) {
            return yield* Effect.fail("not found yet" as const);
          }
        }).pipe(
          Effect.retry({
            while: (err) => err === "not found yet",
            schedule: Schedule.spaced("1 second").pipe(
              Schedule.intersect(Schedule.recurs(10)),
            ),
          }),
        );
        // Test passes - subscription created, just can't test attributes without confirmation
        return;
      }

      // Get subscription attributes (only reached in LocalStack or with confirmed subscriptions)
      const attributes = yield* getSubscriptionAttributes({
        SubscriptionArn: subscriptionArn,
      });

      expect(attributes.Attributes).toBeDefined();

      // Set RawMessageDelivery attribute (only works on confirmed HTTP/HTTPS/SQS/Lambda)
      yield* setSubscriptionAttributes({
        SubscriptionArn: subscriptionArn,
        AttributeName: "RawMessageDelivery",
        AttributeValue: "true",
      });

      // Verify the attribute was set
      const updatedAttributes = yield* getSubscriptionAttributes({
        SubscriptionArn: subscriptionArn,
      });

      expect(updatedAttributes.Attributes?.RawMessageDelivery).toEqual("true");

      // Cleanup - ignore errors since pending subscriptions can't be unsubscribed
      yield* unsubscribe({ SubscriptionArn: subscriptionArn }).pipe(
        Effect.ignore,
      );
    }),
  ),
);

// ============================================================================
// Publishing Tests
// ============================================================================

test(
  "publish message to topic",
  withTopic("itty-sns-publish", (topicArn) =>
    Effect.gen(function* () {
      // Publish a simple message
      const result = yield* publish({
        TopicArn: topicArn,
        Message: "Hello from itty-aws!",
        Subject: "Test Subject",
      });

      expect(result.MessageId).toBeDefined();
    }),
  ),
);

test(
  "publish message with message attributes",
  withTopic("itty-sns-publish-attributes", (topicArn) =>
    Effect.gen(function* () {
      // Publish a message with attributes
      const result = yield* publish({
        TopicArn: topicArn,
        Message: "Message with attributes",
        MessageAttributes: {
          "custom-attribute": {
            DataType: "String",
            StringValue: "custom-value",
          },
          "number-attribute": {
            DataType: "Number",
            StringValue: "42",
          },
        },
      });

      expect(result.MessageId).toBeDefined();
    }),
  ),
);

test(
  "publish batch messages",
  withTopic("itty-sns-publish-batch", (topicArn) =>
    Effect.gen(function* () {
      // Publish multiple messages in a batch
      const result = yield* publishBatch({
        TopicArn: topicArn,
        PublishBatchRequestEntries: [
          { Id: "msg-1", Message: "First batch message" },
          { Id: "msg-2", Message: "Second batch message" },
          { Id: "msg-3", Message: "Third batch message" },
        ],
      });

      // Check for successful entries
      expect(result.Successful).toBeDefined();
      expect(result.Successful!.length).toEqual(3);

      // Verify each message has a MessageId
      for (const entry of result.Successful!) {
        expect(entry.MessageId).toBeDefined();
      }

      // Should have no failed entries
      expect(result.Failed === undefined || result.Failed.length === 0).toBe(
        true,
      );
    }),
  ),
);

test(
  "publish structured message (JSON)",
  withTopic("itty-sns-publish-structured", (topicArn) =>
    Effect.gen(function* () {
      // Publish a structured message for different protocols
      const messageStructure = JSON.stringify({
        default: "Default message for all protocols",
        email: "Message specifically for email subscribers",
        sqs: "Message specifically for SQS subscribers",
      });

      const result = yield* publish({
        TopicArn: topicArn,
        Message: messageStructure,
        MessageStructure: "json",
      });

      expect(result.MessageId).toBeDefined();
    }),
  ),
);

// ============================================================================
// Permission Tests
// ============================================================================

test(
  "topic permissions: add and remove",
  withTopic("itty-sns-permissions", (topicArn) =>
    Effect.gen(function* () {
      // Extract account ID from the topic ARN (format: arn:aws:sns:region:account-id:topic-name)
      const arnParts = topicArn.split(":");
      const accountId = arnParts[4]; // Account ID is the 5th element

      // Add permission using the actual account ID from the topic ARN
      yield* addPermission({
        TopicArn: topicArn,
        Label: "TestPermission",
        AWSAccountId: [accountId],
        ActionName: ["Publish", "Subscribe"],
      });

      // Verify permission was added by checking topic attributes
      const attributes = yield* getTopicAttributes({ TopicArn: topicArn });
      const policy = attributes.Attributes?.Policy;
      expect(policy).toBeDefined();

      const parsedPolicy = JSON.parse(policy!);
      const statement = parsedPolicy.Statement?.find(
        (s: { Sid?: string }) => s.Sid === "TestPermission",
      );
      expect(statement).toBeDefined();

      // Remove permission
      yield* removePermission({
        TopicArn: topicArn,
        Label: "TestPermission",
      });

      // Verify permission was removed
      const updatedAttributes = yield* getTopicAttributes({
        TopicArn: topicArn,
      });
      const updatedPolicy = updatedAttributes.Attributes?.Policy;
      if (updatedPolicy) {
        const parsedUpdatedPolicy = JSON.parse(updatedPolicy);
        const removedStatement = parsedUpdatedPolicy.Statement?.find(
          (s: { Sid?: string }) => s.Sid === "TestPermission",
        );
        expect(removedStatement).toBeUndefined();
      }
    }),
  ),
);

// ============================================================================
// Lambda Event Source Tests
// ============================================================================

test(
  "subscribe Lambda function to SNS topic (event source)",
  withTopic("itty-sns-lambda-source", (topicArn) =>
    Effect.gen(function* () {
      // Extract account ID and region from the topic ARN
      const arnParts = topicArn.split(":");
      const region = arnParts[3];
      const accountId = arnParts[4];

      // Use an ARN that matches our account (will still be pending without Lambda permissions)
      const lambdaArn = `arn:aws:lambda:${region}:${accountId}:function:itty-sns-test-lambda`;

      // Subscribe the Lambda function to the SNS topic
      const subscribeResult = yield* subscribe({
        TopicArn: topicArn,
        Protocol: "lambda",
        Endpoint: lambdaArn,
        ReturnSubscriptionArn: true,
      });

      // Verify we got an ARN back (subscription created, even if pending)
      expect(subscribeResult.SubscriptionArn).toBeDefined();

      // Publish a message to the topic (would trigger Lambda if subscription was confirmed)
      const publishResult = yield* publish({
        TopicArn: topicArn,
        Message: JSON.stringify({ action: "test", data: "Hello Lambda!" }),
        MessageAttributes: {
          eventType: {
            DataType: "String",
            StringValue: "test-event",
          },
        },
      });

      expect(publishResult.MessageId).toBeDefined();

      // Subscriptions will be cleaned up when the topic is deleted
    }),
  ),
);

test(
  "subscribe SQS queue to SNS topic (fanout pattern)",
  withTopic("itty-sns-sqs-fanout", (topicArn) =>
    Effect.gen(function* () {
      // Extract account ID and region from the topic ARN
      const arnParts = topicArn.split(":");
      const region = arnParts[3];
      const accountId = arnParts[4];

      // Use an ARN that matches our account
      const sqsArn = `arn:aws:sqs:${region}:${accountId}:itty-sns-test-queue`;

      // Subscribe the SQS queue to the SNS topic
      // Note: In real AWS without proper permissions, subscription will be pending
      const subscribeResult = yield* subscribe({
        TopicArn: topicArn,
        Protocol: "sqs",
        Endpoint: sqsArn,
        ReturnSubscriptionArn: true,
        // Common attributes for SQS subscriptions
        Attributes: {
          RawMessageDelivery: "true",
        },
      });

      // Verify we got an ARN back (subscription created, even if pending)
      expect(subscribeResult.SubscriptionArn).toBeDefined();

      const subscriptionArn = subscribeResult.SubscriptionArn!;

      // Check if subscription is confirmed (not pending)
      const isConfirmed =
        !subscriptionArn.includes("pending") &&
        subscriptionArn !== "pending confirmation" &&
        subscriptionArn !== "PendingConfirmation";

      // If we got a confirmed subscription ARN, check attributes
      if (isConfirmed) {
        const attrs = yield* getSubscriptionAttributes({
          SubscriptionArn: subscriptionArn,
        });

        // RawMessageDelivery should be set
        expect(attrs.Attributes?.RawMessageDelivery).toEqual("true");

        // Cleanup - ignore errors since pending subscriptions can't be unsubscribed
        yield* unsubscribe({ SubscriptionArn: subscriptionArn }).pipe(
          Effect.ignore,
        );
      }
      // Note: Pending subscriptions will be cleaned up when the topic is deleted
    }),
  ),
);

// ============================================================================
// Multiple Operations Combined Test
// ============================================================================

test(
  "combined topic operations workflow",
  withTopic("itty-sns-combined", (topicArn) =>
    Effect.gen(function* () {
      // 1. Set topic attributes
      yield* setTopicAttributes({
        TopicArn: topicArn,
        AttributeName: "DisplayName",
        AttributeValue: "Combined Test Topic",
      });

      // 2. Add tags
      yield* tagResource({
        ResourceArn: topicArn,
        Tags: [
          { Key: "Environment", Value: "Integration" },
          { Key: "CostCenter", Value: "12345" },
        ],
      });

      // 3. Create a subscription using HTTPS (email requires confirmation in real AWS)
      const subscribeResult = yield* subscribe({
        TopicArn: topicArn,
        Protocol: "https",
        Endpoint: "https://example.com/sns-combined-test",
        ReturnSubscriptionArn: true,
      });

      // 4. Publish a message
      const publishResult = yield* publish({
        TopicArn: topicArn,
        Message: "Test message for combined workflow",
      });

      // 5. Verify attributes and tags (these are consistent)
      const [attributes, tags] = yield* Effect.all([
        getTopicAttributes({ TopicArn: topicArn }),
        listTagsForResource({ ResourceArn: topicArn }),
      ]);

      // Verify attributes
      expect(attributes.Attributes?.DisplayName).toEqual("Combined Test Topic");

      // Verify tags
      expect(tags.Tags?.length).toEqual(2);

      // Verify subscription was created (even if pending)
      expect(subscribeResult.SubscriptionArn).toBeDefined();

      // Verify publish result
      expect(publishResult.MessageId).toBeDefined();

      // Subscriptions will be cleaned up when the topic is deleted
    }),
  ),
);

// ============================================================================
// Pagination Stream Tests
// ============================================================================

test(
  "listTopics.pages() streams full response pages",
  Effect.gen(function* () {
    // Stream all pages of topics
    const pages = yield* listTopics.pages({}).pipe(Stream.runCollect);

    const pagesArray = Array.from(pages);
    expect(pagesArray.length).toBeGreaterThanOrEqual(1);
  }),
);

test(
  "listTopics.items() streams Topic objects directly",
  Effect.gen(function* () {
    // Stream all topics using .items()
    const topics = yield* listTopics.items({}).pipe(Stream.runCollect);

    const topicsArray = Array.from(topics);

    // Each item should be a Topic with TopicArn
    for (const topic of topicsArray) {
      expect(topic.TopicArn).toBeDefined();
    }
  }),
);

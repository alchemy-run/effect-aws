import { expect } from "@effect/vitest";
import { Effect, Schedule } from "effect";
import {
  // Event Bus operations
  createEventBus,
  deleteEventBus,
  deleteRule,
  describeEventBus,
  describeRule,
  disableRule,
  enableRule,
  listEventBuses,
  listRules,
  listTagsForResource,
  listTargetsByRule,
  // Events
  putEvents,
  // Rule operations
  putRule,
  // Target operations
  putTargets,
  removeTargets,
  // Tagging
  tagResource,
  untagResource,
} from "../../src/services/eventbridge.ts";
import {
  createQueue,
  deleteQueue,
  getQueueAttributes,
} from "../../src/services/sqs.ts";
import { test } from "../test.ts";

// ============================================================================
// Idempotent Cleanup Helpers
// ============================================================================

// Clean up rule by removing all targets first
const cleanupRule = (ruleName: string, eventBusName?: string) =>
  Effect.gen(function* () {
    // Try to get and remove all targets
    const targets = yield* listTargetsByRule({
      Rule: ruleName,
      EventBusName: eventBusName,
    }).pipe(Effect.orElseSucceed(() => ({ Targets: [] })));

    if (targets.Targets && targets.Targets.length > 0) {
      yield* removeTargets({
        Rule: ruleName,
        EventBusName: eventBusName,
        Ids: targets.Targets.map((t) => t.Id!),
      }).pipe(Effect.ignore);
    }

    // Now delete the rule
    yield* deleteRule({
      Name: ruleName,
      EventBusName: eventBusName,
    }).pipe(Effect.ignore);
  });

// Clean up event bus by removing all rules first
const cleanupEventBus = (eventBusName: string) =>
  Effect.gen(function* () {
    // List and delete all rules on this event bus
    const rules = yield* listRules({ EventBusName: eventBusName }).pipe(
      Effect.orElseSucceed(() => ({ Rules: [] })),
    );

    for (const rule of rules.Rules ?? []) {
      yield* cleanupRule(rule.Name!, eventBusName);
    }

    // Now delete the event bus
    yield* deleteEventBus({ Name: eventBusName }).pipe(Effect.ignore);
  });

// Clean up SQS queue
const cleanupQueue = (queueUrl: string) =>
  deleteQueue({ QueueUrl: queueUrl }).pipe(Effect.ignore);

// ============================================================================
// Idempotent Test Helpers
// ============================================================================

// Helper to ensure cleanup happens even on failure - cleans up before AND after
const withEventBus = <A, E, R>(
  name: string,
  testFn: (eventBusArn: string, eventBusName: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any leftover from previous runs
    yield* cleanupEventBus(name);

    const result = yield* createEventBus({ Name: name });
    const eventBusArn = result.EventBusArn!;
    return yield* testFn(eventBusArn, name).pipe(
      Effect.ensuring(cleanupEventBus(name)),
    );
  });

// Helper for rules with cleanup - cleans up before AND after
const withRule = <A, E, R>(
  ruleName: string,
  eventBusName: string | undefined,
  eventPattern: string,
  testFn: (ruleArn: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any leftover from previous runs
    yield* cleanupRule(ruleName, eventBusName);

    const result = yield* putRule({
      Name: ruleName,
      EventPattern: eventPattern,
      EventBusName: eventBusName,
      State: "ENABLED",
    });
    const ruleArn = result.RuleArn!;
    return yield* testFn(ruleArn).pipe(
      Effect.ensuring(cleanupRule(ruleName, eventBusName)),
    );
  });

// Helper for SQS queue with cleanup
const withQueue = <A, E, R>(
  queueName: string,
  testFn: (queueUrl: string, queueArn: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Try to create the queue, retry if recently deleted
    const createResult = yield* createQueue({ QueueName: queueName }).pipe(
      Effect.retry({
        while: (err) => err._tag === "QueueDeletedRecently",
        schedule: Schedule.spaced("5 seconds"),
      }),
    );
    const queueUrl = createResult.QueueUrl!;

    // Get the queue ARN for use as EventBridge target
    const attrs = yield* getQueueAttributes({
      QueueUrl: queueUrl,
      AttributeNames: ["QueueArn"],
    });
    const queueArn = attrs.Attributes!.QueueArn!;

    return yield* testFn(queueUrl, queueArn).pipe(
      Effect.ensuring(cleanupQueue(queueUrl)),
    );
  });

// ============================================================================
// Event Bus Lifecycle Tests
// ============================================================================

test(
  "create event bus, describe, list, and delete",
  withEventBus("distilled-eventbridge-lifecycle", (eventBusArn, eventBusName) =>
    Effect.gen(function* () {
      // Verify event bus ARN is returned
      expect(eventBusArn).toBeDefined();
      expect(eventBusArn).toContain("distilled-eventbridge-lifecycle");

      // Describe the event bus
      const describeResult = yield* describeEventBus({ Name: eventBusName });
      expect(describeResult.Name).toEqual(eventBusName);
      expect(describeResult.Arn).toEqual(eventBusArn);

      // List event buses and verify our bus is in the list
      const listResult = yield* listEventBuses({
        NamePrefix: "distilled-eventbridge",
      });
      const foundBus = listResult.EventBuses?.find(
        (bus) => bus.Name === eventBusName,
      );
      expect(foundBus).toBeDefined();
      expect(foundBus?.Arn).toEqual(eventBusArn);
    }),
  ),
);

// ============================================================================
// Rule Lifecycle Tests
// ============================================================================

test(
  "create rule, describe, list, and delete on default event bus",
  withRule(
    "distilled-eventbridge-rule-lifecycle",
    undefined,
    JSON.stringify({ source: ["distilled-aws.test"] }),
    (ruleArn) =>
      Effect.gen(function* () {
        expect(ruleArn).toBeDefined();

        // Describe the rule
        const describeResult = yield* describeRule({
          Name: "distilled-eventbridge-rule-lifecycle",
        });
        expect(describeResult.Name).toEqual(
          "distilled-eventbridge-rule-lifecycle",
        );
        expect(describeResult.Arn).toEqual(ruleArn);
        expect(describeResult.State).toEqual("ENABLED");
        expect(describeResult.EventPattern).toBeDefined();

        // List rules and verify our rule is present
        const listResult = yield* listRules({
          NamePrefix: "distilled-eventbridge",
        });
        const foundRule = listResult.Rules?.find(
          (r) => r.Name === "distilled-eventbridge-rule-lifecycle",
        );
        expect(foundRule).toBeDefined();
        expect(foundRule?.Arn).toEqual(ruleArn);
      }),
  ),
);

test(
  "enable and disable rule",
  withRule(
    "distilled-eventbridge-rule-toggle",
    undefined,
    JSON.stringify({ source: ["distilled-aws.test"] }),
    (_ruleArn) =>
      Effect.gen(function* () {
        const ruleName = "distilled-eventbridge-rule-toggle";

        // Verify initially enabled
        const initialState = yield* describeRule({ Name: ruleName });
        expect(initialState.State).toEqual("ENABLED");

        // Disable the rule
        yield* disableRule({ Name: ruleName });

        // Verify disabled
        const disabledState = yield* describeRule({ Name: ruleName });
        expect(disabledState.State).toEqual("DISABLED");

        // Re-enable the rule
        yield* enableRule({ Name: ruleName });

        // Verify enabled again
        const enabledState = yield* describeRule({ Name: ruleName });
        expect(enabledState.State).toEqual("ENABLED");
      }),
  ),
);

test(
  "create rule on custom event bus",
  withEventBus(
    "distilled-eventbridge-custom-bus",
    (_eventBusArn, eventBusName) =>
      withRule(
        "distilled-eventbridge-custom-rule",
        eventBusName,
        JSON.stringify({ source: ["distilled-aws.custom"] }),
        (ruleArn) =>
          Effect.gen(function* () {
            expect(ruleArn).toBeDefined();

            // Describe rule on custom bus
            const describeResult = yield* describeRule({
              Name: "distilled-eventbridge-custom-rule",
              EventBusName: eventBusName,
            });
            expect(describeResult.Name).toEqual(
              "distilled-eventbridge-custom-rule",
            );
            expect(describeResult.EventBusName).toEqual(eventBusName);

            // List rules on custom bus
            const listResult = yield* listRules({ EventBusName: eventBusName });
            const foundRule = listResult.Rules?.find(
              (r) => r.Name === "distilled-eventbridge-custom-rule",
            );
            expect(foundRule).toBeDefined();
          }),
      ),
  ),
);

// ============================================================================
// Rule with Targets Tests
// ============================================================================

test(
  "put targets, list targets, and remove targets",
  withQueue("distilled-eventbridge-target-queue", (queueUrl, queueArn) =>
    withRule(
      "distilled-eventbridge-targets",
      undefined,
      JSON.stringify({ source: ["distilled-aws.test"] }),
      (_ruleArn) =>
        Effect.gen(function* () {
          const ruleName = "distilled-eventbridge-targets";

          // Put targets using SQS queue
          const putResult = yield* putTargets({
            Rule: ruleName,
            Targets: [
              {
                Id: "target-1",
                Arn: queueArn,
              },
            ],
          });

          // Check for successful entries
          expect(
            putResult.FailedEntryCount === undefined ||
              putResult.FailedEntryCount === 0,
          ).toBe(true);

          // List targets
          const listResult = yield* listTargetsByRule({ Rule: ruleName });
          expect(listResult.Targets).toBeDefined();
          expect(listResult.Targets!.length).toEqual(1);
          expect(listResult.Targets![0].Id).toEqual("target-1");
          expect(listResult.Targets![0].Arn).toEqual(queueArn);

          // Remove target
          const removeResult = yield* removeTargets({
            Rule: ruleName,
            Ids: ["target-1"],
          });

          expect(
            removeResult.FailedEntryCount === undefined ||
              removeResult.FailedEntryCount === 0,
          ).toBe(true);

          // Verify target is removed
          const listAfterRemove = yield* listTargetsByRule({ Rule: ruleName });
          expect(
            listAfterRemove.Targets === undefined ||
              listAfterRemove.Targets.length === 0,
          ).toBe(true);

          // Keep queueUrl reference to avoid unused variable warning
          void queueUrl;
        }),
    ),
  ),
);

// ============================================================================
// Put Events Tests
// ============================================================================

test(
  "put events to default event bus",
  Effect.gen(function* () {
    // Send events to the default event bus
    const result = yield* putEvents({
      Entries: [
        {
          Source: "distilled-aws.test",
          DetailType: "TestEvent",
          Detail: JSON.stringify({
            action: "test",
            data: "Hello from distilled-aws!",
          }),
        },
      ],
    });

    expect(
      result.FailedEntryCount === undefined || result.FailedEntryCount === 0,
    ).toBe(true);
    expect(result.Entries).toBeDefined();
    expect(result.Entries!.length).toEqual(1);
    expect(result.Entries![0].EventId).toBeDefined();
  }),
);

test(
  "put multiple events in batch",
  Effect.gen(function* () {
    // Send multiple events in one call
    const result = yield* putEvents({
      Entries: [
        {
          Source: "distilled-aws.test",
          DetailType: "BatchEvent",
          Detail: JSON.stringify({ message: "Event 1" }),
        },
        {
          Source: "distilled-aws.test",
          DetailType: "BatchEvent",
          Detail: JSON.stringify({ message: "Event 2" }),
        },
        {
          Source: "distilled-aws.test",
          DetailType: "BatchEvent",
          Detail: JSON.stringify({ message: "Event 3" }),
        },
      ],
    });

    expect(
      result.FailedEntryCount === undefined || result.FailedEntryCount === 0,
    ).toBe(true);
    expect(result.Entries).toBeDefined();
    expect(result.Entries!.length).toEqual(3);

    // Each entry should have an EventId
    for (const entry of result.Entries!) {
      expect(entry.EventId).toBeDefined();
    }
  }),
);

test(
  "put events to custom event bus",
  withEventBus("distilled-eventbridge-events", (_eventBusArn, eventBusName) =>
    Effect.gen(function* () {
      // Send event to custom event bus
      const result = yield* putEvents({
        Entries: [
          {
            Source: "distilled-aws.custom",
            DetailType: "CustomBusEvent",
            Detail: JSON.stringify({ target: "custom-bus" }),
            EventBusName: eventBusName,
          },
        ],
      });

      expect(
        result.FailedEntryCount === undefined || result.FailedEntryCount === 0,
      ).toBe(true);
      expect(result.Entries).toBeDefined();
      expect(result.Entries!.length).toEqual(1);
      expect(result.Entries![0].EventId).toBeDefined();
    }),
  ),
);

test(
  "put events with resources",
  Effect.gen(function* () {
    // Send event with resource ARNs
    const result = yield* putEvents({
      Entries: [
        {
          Source: "distilled-aws.test",
          DetailType: "ResourceEvent",
          Detail: JSON.stringify({ action: "update" }),
          Resources: [
            "arn:aws:s3:::my-bucket",
            "arn:aws:dynamodb:us-east-1:000000000000:table/my-table",
          ],
        },
      ],
    });

    expect(
      result.FailedEntryCount === undefined || result.FailedEntryCount === 0,
    ).toBe(true);
    expect(result.Entries![0].EventId).toBeDefined();
  }),
);

// ============================================================================
// Tagging Tests
// ============================================================================

test(
  "tag event bus, list tags, and untag",
  withEventBus("distilled-eventbridge-tagging", (eventBusArn, _eventBusName) =>
    Effect.gen(function* () {
      // Add tags
      yield* tagResource({
        ResourceARN: eventBusArn,
        Tags: [
          { Key: "Environment", Value: "Test" },
          { Key: "Project", Value: "distilled-aws" },
          { Key: "Team", Value: "Platform" },
        ],
      });

      // List tags
      const tagsResult = yield* listTagsForResource({
        ResourceARN: eventBusArn,
      });
      expect(tagsResult.Tags).toBeDefined();
      expect(tagsResult.Tags!.length).toEqual(3);

      const envTag = tagsResult.Tags?.find((t) => t.Key === "Environment");
      expect(envTag?.Value).toEqual("Test");

      // Update a tag
      yield* tagResource({
        ResourceARN: eventBusArn,
        Tags: [{ Key: "Environment", Value: "Production" }],
      });

      // Verify update
      const updatedTags = yield* listTagsForResource({
        ResourceARN: eventBusArn,
      });
      const updatedEnvTag = updatedTags.Tags?.find(
        (t) => t.Key === "Environment",
      );
      expect(updatedEnvTag?.Value).toEqual("Production");

      // Remove a tag
      yield* untagResource({
        ResourceARN: eventBusArn,
        TagKeys: ["Team"],
      });

      // Verify removal
      const finalTags = yield* listTagsForResource({
        ResourceARN: eventBusArn,
      });
      const teamTag = finalTags.Tags?.find((t) => t.Key === "Team");
      expect(teamTag).toBeUndefined();
      expect(finalTags.Tags!.length).toEqual(2);
    }),
  ),
);

test(
  "tag rule, list tags, and untag",
  withRule(
    "distilled-eventbridge-rule-tagging",
    undefined,
    JSON.stringify({ source: ["distilled-aws.test"] }),
    (ruleArn) =>
      Effect.gen(function* () {
        // Add tags to rule
        yield* tagResource({
          ResourceARN: ruleArn,
          Tags: [
            { Key: "Environment", Value: "Test" },
            { Key: "CostCenter", Value: "12345" },
          ],
        });

        // List tags
        const tagsResult = yield* listTagsForResource({ ResourceARN: ruleArn });
        expect(tagsResult.Tags).toBeDefined();
        expect(tagsResult.Tags!.length).toEqual(2);

        // Remove all tags
        yield* untagResource({
          ResourceARN: ruleArn,
          TagKeys: ["Environment", "CostCenter"],
        });

        // Verify all removed
        const finalTags = yield* listTagsForResource({ ResourceARN: ruleArn });
        expect(
          finalTags.Tags === undefined || finalTags.Tags.length === 0,
        ).toBe(true);
      }),
  ),
);

// ============================================================================
// Schedule Expression Tests
// ============================================================================

test(
  "create rule with schedule expression",
  Effect.gen(function* () {
    const ruleName = "distilled-eventbridge-scheduled";

    // Clean up any leftover from previous runs
    yield* cleanupRule(ruleName, undefined);

    // Create rule with schedule (runs every 5 minutes)
    const result = yield* putRule({
      Name: ruleName,
      ScheduleExpression: "rate(5 minutes)",
      Description: "Scheduled rule for testing",
      State: "DISABLED", // Keep disabled so it doesn't actually run
    });

    expect(result.RuleArn).toBeDefined();

    yield* Effect.ensuring(
      Effect.gen(function* () {
        // Describe the scheduled rule
        const describeResult = yield* describeRule({ Name: ruleName });
        expect(describeResult.ScheduleExpression).toEqual("rate(5 minutes)");
        expect(describeResult.State).toEqual("DISABLED");

        // Update to cron expression
        yield* putRule({
          Name: ruleName,
          ScheduleExpression: "cron(0 12 * * ? *)", // Every day at noon
          State: "DISABLED",
        });

        // Verify update
        const updatedResult = yield* describeRule({ Name: ruleName });
        expect(updatedResult.ScheduleExpression).toEqual("cron(0 12 * * ? *)");
      }),
      cleanupRule(ruleName, undefined),
    );
  }),
);

// ============================================================================
// Combined Workflow Test
// ============================================================================

test(
  "complete eventbridge workflow: bus, rule, targets, events",
  withQueue("distilled-eventbridge-workflow-queue", (queueUrl, queueArn) =>
    withEventBus(
      "distilled-eventbridge-workflow",
      (eventBusArn, eventBusName) =>
        Effect.gen(function* () {
          const ruleName = "distilled-workflow-rule";
          const eventPattern = JSON.stringify({
            source: ["distilled-aws.workflow"],
            "detail-type": ["WorkflowEvent"],
          });

          // 1. Tag the event bus
          yield* tagResource({
            ResourceARN: eventBusArn,
            Tags: [{ Key: "Workflow", Value: "Complete" }],
          });

          // 2. Create a rule on the custom bus
          const ruleResult = yield* putRule({
            Name: ruleName,
            EventPattern: eventPattern,
            EventBusName: eventBusName,
            Description: "Workflow test rule",
            State: "ENABLED",
          });

          const ruleArn = ruleResult.RuleArn!;

          yield* Effect.ensuring(
            Effect.gen(function* () {
              // 3. Add a target to the rule using SQS queue
              yield* putTargets({
                Rule: ruleName,
                EventBusName: eventBusName,
                Targets: [
                  {
                    Id: "workflow-target",
                    Arn: queueArn,
                  },
                ],
              });

              // 4. Tag the rule
              yield* tagResource({
                ResourceARN: ruleArn,
                Tags: [{ Key: "Type", Value: "Workflow" }],
              });

              // 5. Send an event to the custom bus
              const putResult = yield* putEvents({
                Entries: [
                  {
                    Source: "distilled-aws.workflow",
                    DetailType: "WorkflowEvent",
                    Detail: JSON.stringify({
                      step: "complete",
                      timestamp: new Date().toISOString(),
                    }),
                    EventBusName: eventBusName,
                  },
                ],
              });

              expect(putResult.Entries![0].EventId).toBeDefined();

              // 6. Verify everything is set up correctly
              const [busDesc, ruleDesc, targets, busTags, ruleTags] =
                yield* Effect.all([
                  describeEventBus({ Name: eventBusName }),
                  describeRule({ Name: ruleName, EventBusName: eventBusName }),
                  listTargetsByRule({
                    Rule: ruleName,
                    EventBusName: eventBusName,
                  }),
                  listTagsForResource({ ResourceARN: eventBusArn }),
                  listTagsForResource({ ResourceARN: ruleArn }),
                ]);

              expect(busDesc.Name).toEqual(eventBusName);
              expect(ruleDesc.Name).toEqual(ruleName);
              expect(targets.Targets!.length).toEqual(1);
              expect(
                busTags.Tags!.find((t) => t.Key === "Workflow"),
              ).toBeDefined();
              expect(
                ruleTags.Tags!.find((t) => t.Key === "Type"),
              ).toBeDefined();

              // Cleanup targets before rule deletion
              yield* removeTargets({
                Rule: ruleName,
                EventBusName: eventBusName,
                Ids: ["workflow-target"],
              });
            }),
            cleanupRule(ruleName, eventBusName),
          );

          // Keep queueUrl reference to avoid unused variable warning
          void queueUrl;
        }),
    ),
  ),
);

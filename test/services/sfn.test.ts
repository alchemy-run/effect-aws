import { expect } from "@effect/vitest";
import { Effect, Schedule } from "effect";
import {
  attachRolePolicy,
  createRole,
  deleteRole,
  detachRolePolicy,
  listAttachedRolePolicies,
} from "../../src/services/iam.ts";
import {
  createActivity,
  createStateMachine,
  deleteActivity,
  deleteStateMachine,
  describeActivity,
  describeExecution,
  describeStateMachine,
  listActivities,
  listExecutions,
  listStateMachines,
  startExecution,
  stopExecution,
} from "../../src/services/sfn.ts";
import { test } from "../test.ts";

// Simple pass state machine definition
const PASS_STATE_MACHINE_DEFINITION = JSON.stringify({
  Comment: "A simple pass state machine for testing",
  StartAt: "Pass",
  States: {
    Pass: {
      Type: "Pass",
      End: true,
    },
  },
});

// Wait state machine definition (for testing stop)
const WAIT_STATE_MACHINE_DEFINITION = JSON.stringify({
  Comment: "A state machine that waits",
  StartAt: "Wait",
  States: {
    Wait: {
      Type: "Wait",
      Seconds: 300,
      End: true,
    },
  },
});

// Trust policy that allows Step Functions to assume the role
const STEP_FUNCTIONS_TRUST_POLICY = JSON.stringify({
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: {
        Service: "states.amazonaws.com",
      },
      Action: "sts:AssumeRole",
    },
  ],
});

// ============================================================================
// Idempotent Cleanup Helpers
// ============================================================================

// Clean up a role by detaching all policies first
const cleanupRole = (roleName: string) =>
  Effect.gen(function* () {
    // Detach all managed policies
    const attachedPolicies = yield* listAttachedRolePolicies({
      RoleName: roleName,
    }).pipe(Effect.orElseSucceed(() => ({ AttachedPolicies: [] })));

    for (const policy of attachedPolicies.AttachedPolicies ?? []) {
      yield* detachRolePolicy({
        RoleName: roleName,
        PolicyArn: policy.PolicyArn!,
      }).pipe(Effect.ignore);
    }

    // Delete the role
    yield* deleteRole({ RoleName: roleName }).pipe(Effect.ignore);
  });

// Clean up an activity
const cleanupActivity = (activityArn: string) =>
  deleteActivity({ activityArn }).pipe(Effect.ignore);

// Clean up a state machine - must wait for it to be fully deleted
const cleanupStateMachine = (stateMachineArn: string) =>
  Effect.gen(function* () {
    // Try to delete the state machine
    yield* deleteStateMachine({ stateMachineArn }).pipe(Effect.ignore);

    // Wait for it to be fully deleted (not in DELETING state)
    yield* describeStateMachine({ stateMachineArn }).pipe(
      Effect.flatMap((result) =>
        result.status === "DELETING"
          ? Effect.fail("still deleting" as const)
          : Effect.fail("still exists" as const),
      ),
      Effect.catchTag("StateMachineDoesNotExist", () => Effect.void),
      Effect.retry({
        while: (err) => err === "still deleting" || err === "still exists",
        schedule: Schedule.spaced("1 second").pipe(
          Schedule.intersect(Schedule.recurs(30)),
        ),
      }),
      Effect.ignore,
    );
  });

// Wait for a state machine to become available (not in DELETING state from previous run)
const waitForStateMachineAvailable = (stateMachineName: string) =>
  Effect.gen(function* () {
    // List state machines to find if one with this name exists
    const list = yield* listStateMachines({});
    const existing = list.stateMachines?.find(
      (sm) => sm.name === stateMachineName,
    );

    if (existing) {
      // Clean it up and wait
      yield* cleanupStateMachine(existing.stateMachineArn!);
    }
  });

// ============================================================================
// Idempotent Test Helpers
// ============================================================================

// Helper for IAM role with cleanup - cleans up before AND after
const withRole = <A, E, R>(
  roleName: string,
  testFn: (roleArn: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any leftover from previous runs
    yield* cleanupRole(roleName);

    // Create the role
    const result = yield* createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: STEP_FUNCTIONS_TRUST_POLICY,
      Description: "Test role for itty-aws Step Functions tests",
    });

    const roleArn = result.Role!.Arn!;

    // Attach the basic execution policy for Step Functions
    yield* attachRolePolicy({
      RoleName: roleName,
      PolicyArn:
        "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    }).pipe(Effect.ignore);

    // Wait for IAM to propagate
    yield* Effect.sleep("2 seconds");

    return yield* testFn(roleArn).pipe(Effect.ensuring(cleanupRole(roleName)));
  });

// Helper for activity with cleanup
const withActivity = <A, E, R>(
  activityName: string,
  testFn: (activityArn: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Check if activity exists and clean up
    const existing = yield* listActivities({}).pipe(
      Effect.map(
        (result) =>
          result.activities?.find((a) => a.name === activityName)?.activityArn,
      ),
      Effect.orElseSucceed(() => undefined),
    );

    if (existing) {
      yield* cleanupActivity(existing);
    }

    // Create the activity
    const result = yield* createActivity({ name: activityName });
    const activityArn = result.activityArn!;

    return yield* testFn(activityArn).pipe(
      Effect.ensuring(cleanupActivity(activityArn)),
    );
  });

// Helper for state machine with cleanup - includes role creation
const withStateMachine = <A, E, R>(
  stateMachineName: string,
  roleName: string,
  definition: string,
  testFn: (stateMachineArn: string) => Effect.Effect<A, E, R>,
) =>
  withRole(roleName, (roleArn) =>
    Effect.gen(function* () {
      // Wait for any existing state machine with this name to be fully deleted
      yield* waitForStateMachineAvailable(stateMachineName);

      // Create the state machine, retrying if still being deleted
      const result = yield* createStateMachine({
        name: stateMachineName,
        definition,
        roleArn,
        type: "STANDARD",
      }).pipe(
        Effect.retry({
          while: (err) => err._tag === "StateMachineDeleting",
          schedule: Schedule.spaced("2 seconds").pipe(
            Schedule.intersect(Schedule.recurs(30)),
          ),
        }),
      );

      const stateMachineArn = result.stateMachineArn!;

      return yield* testFn(stateMachineArn).pipe(
        Effect.ensuring(cleanupStateMachine(stateMachineArn)),
      );
    }),
  );

// ============================================================================
// Activity Tests
// ============================================================================

test(
  "create activity, describe activity, list activities, and delete activity",
  withActivity("itty-sfn-activity-lifecycle", (activityArn) =>
    Effect.gen(function* () {
      expect(activityArn).toBeDefined();

      // Describe activity
      const describeResult = yield* describeActivity({ activityArn });
      expect(describeResult.name).toEqual("itty-sfn-activity-lifecycle");
      expect(describeResult.creationDate).toBeDefined();

      // List activities with retry for eventual consistency
      yield* Effect.gen(function* () {
        const listResult = yield* listActivities({});
        const foundActivity = listResult.activities?.find(
          (a) => a.activityArn === activityArn,
        );
        if (!foundActivity) {
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
    }),
  ),
);

// ============================================================================
// State Machine Tests
// ============================================================================

test(
  "create state machine, describe, list, and delete",
  withStateMachine(
    "itty-sfn-sm-lifecycle",
    "itty-sfn-role-lifecycle",
    PASS_STATE_MACHINE_DEFINITION,
    (stateMachineArn) =>
      Effect.gen(function* () {
        expect(stateMachineArn).toBeDefined();

        // Describe state machine
        const describeResult = yield* describeStateMachine({ stateMachineArn });
        expect(describeResult.name).toEqual("itty-sfn-sm-lifecycle");
        expect(describeResult.status).toEqual("ACTIVE");

        // Verify definition matches
        const returnedDef = JSON.parse(describeResult.definition || "{}");
        const expectedDef = JSON.parse(PASS_STATE_MACHINE_DEFINITION);
        expect(returnedDef.StartAt).toEqual(expectedDef.StartAt);

        // List state machines with retry for eventual consistency
        yield* Effect.gen(function* () {
          const listResult = yield* listStateMachines({});
          const foundSm = listResult.stateMachines?.find(
            (sm) => sm.stateMachineArn === stateMachineArn,
          );
          if (!foundSm) {
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
      }),
  ),
);

// ============================================================================
// Execution Tests
// ============================================================================

test(
  "start execution, describe execution, and list executions",
  withStateMachine(
    "itty-sfn-exec-sm",
    "itty-sfn-role-exec",
    PASS_STATE_MACHINE_DEFINITION,
    (stateMachineArn) =>
      Effect.gen(function* () {
        const inputData = JSON.stringify({ message: "Hello from itty-aws" });

        // Start execution (let AWS generate a unique name)
        const startResult = yield* startExecution({
          stateMachineArn,
          input: inputData,
        });

        const executionArn = startResult.executionArn!;
        expect(executionArn).toBeDefined();

        // Describe execution
        const describeResult = yield* describeExecution({ executionArn });
        expect(describeResult.name).toBeDefined();
        expect(describeResult.input).toEqual(inputData);

        // Status should be RUNNING or SUCCEEDED (pass state is fast)
        const status = describeResult.status;
        expect(["RUNNING", "SUCCEEDED"]).toContain(status);

        // List executions
        const listResult = yield* listExecutions({ stateMachineArn });
        const foundExec = listResult.executions?.find(
          (e) => e.executionArn === executionArn,
        );
        expect(foundExec).toBeDefined();

        // Wait for execution to complete (pass state is fast)
        yield* Effect.sleep("2 seconds");

        // Verify execution succeeded
        const finalDescribe = yield* describeExecution({ executionArn });
        expect(finalDescribe.status).toEqual("SUCCEEDED");

        // Output should match input for pass state
        expect(finalDescribe.output).toEqual(inputData);
      }),
  ),
);

test(
  "start execution and stop execution",
  withStateMachine(
    "itty-sfn-stop-sm",
    "itty-sfn-role-stop",
    WAIT_STATE_MACHINE_DEFINITION,
    (stateMachineArn) =>
      Effect.gen(function* () {
        // Start execution
        const startResult = yield* startExecution({
          stateMachineArn,
          input: JSON.stringify({}),
        });

        const executionArn = startResult.executionArn!;
        expect(executionArn).toBeDefined();

        // Verify execution is running
        const runningDescribe = yield* describeExecution({ executionArn });
        expect(runningDescribe.status).toEqual("RUNNING");

        // Stop execution
        yield* stopExecution({
          executionArn,
          error: "TestError",
          cause: "Stopped by itty-aws test",
        });

        // Give it a moment to stop
        yield* Effect.sleep("1 second");

        // Verify execution is stopped (ABORTED)
        const stoppedDescribe = yield* describeExecution({ executionArn });
        expect(stoppedDescribe.status).toEqual("ABORTED");
      }),
  ),
);

// ============================================================================
// Multiple Executions Test
// ============================================================================

test(
  "run multiple executions of the same state machine",
  withStateMachine(
    "itty-sfn-multi-sm",
    "itty-sfn-role-multi",
    PASS_STATE_MACHINE_DEFINITION,
    (stateMachineArn) =>
      Effect.gen(function* () {
        // Start 3 executions in parallel (let AWS generate unique names)
        const executions = yield* Effect.all(
          [
            startExecution({
              stateMachineArn,
              input: JSON.stringify({ id: 1 }),
            }),
            startExecution({
              stateMachineArn,
              input: JSON.stringify({ id: 2 }),
            }),
            startExecution({
              stateMachineArn,
              input: JSON.stringify({ id: 3 }),
            }),
          ],
          { concurrency: 3 },
        );

        // Verify all have execution ARNs
        for (const exec of executions) {
          expect(exec.executionArn).toBeDefined();
        }

        // Wait for executions to complete
        yield* Effect.sleep("3 seconds");

        // Verify all succeeded
        for (const exec of executions) {
          const describe = yield* describeExecution({
            executionArn: exec.executionArn!,
          });
          expect(describe.status).toEqual("SUCCEEDED");
        }

        // List executions and verify count
        const listResult = yield* listExecutions({ stateMachineArn });
        expect(listResult.executions).toBeDefined();
        expect(listResult.executions!.length >= 3).toBe(true);
      }),
  ),
);

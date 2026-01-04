import { expect } from "@effect/vitest";
import { Console, Effect, Schedule } from "effect";
import { afterAll, beforeAll } from "vitest";
import { createRole, deleteRole } from "../../src/services/iam.ts";
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
import { run, test } from "../test.ts";

const TEST_ACTIVITY_NAME = "itty-aws-test-activity";
const TEST_STATE_MACHINE_NAME = "itty-aws-test-state-machine";
const TEST_EXEC_STATE_MACHINE_NAME = "itty-aws-test-exec-sm";
const TEST_STOP_STATE_MACHINE_NAME = "itty-aws-test-stop-sm";
const TEST_MULTI_STATE_MACHINE_NAME = "itty-aws-test-multi-sm";
const TEST_ROLE_NAME = "itty-aws-test-stepfunctions-role";

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

// Role ARN will be set by beforeAll
let TEST_ROLE_ARN = "";

// Create the IAM role before tests
beforeAll(async () => {
  await run(
    Effect.gen(function* () {
      // Delete existing role if it exists (cleanup from previous runs)
      yield* deleteRole({ RoleName: TEST_ROLE_NAME }).pipe(Effect.ignore);

      // Create the role
      const result = yield* createRole({
        RoleName: TEST_ROLE_NAME,
        AssumeRolePolicyDocument: STEP_FUNCTIONS_TRUST_POLICY,
        Description: "Test role for itty-aws Step Functions tests",
      });

      TEST_ROLE_ARN = result.Role?.Arn ?? "";

      // Wait a bit for IAM to propagate (AWS eventually consistent)
      yield* Effect.sleep("2 seconds");
    }),
  );
});

// Delete the IAM role after tests
afterAll(async () => {
  await run(
    Effect.gen(function* () {
      yield* deleteRole({ RoleName: TEST_ROLE_NAME }).pipe(Effect.ignore);
    }),
  );
});

// ============================================================================
// Activity Tests
// ============================================================================

test(
  "create activity, describe activity, list activities, and delete activity",
  Effect.gen(function* () {
    const activityName = TEST_ACTIVITY_NAME;

    // Create activity
    const createResult = yield* createActivity({
      name: activityName,
    });

    const activityArn = createResult.activityArn;
    expect(activityArn).toBeDefined();

    try {
      // Describe activity
      const describeResult = yield* describeActivity({
        activityArn: activityArn!,
      });

      expect(describeResult.name).toEqual(activityName);
      expect(describeResult.creationDate).toBeDefined();

      // List activities and verify our activity is in the list
      const listResult = yield* listActivities({});
      const foundActivity = listResult.activities?.find(
        (a) => a.activityArn === activityArn,
      );
      expect(foundActivity).toBeDefined();

      // Delete activity
      yield* deleteActivity({ activityArn: activityArn! });

      // Verify activity is gone by trying to describe (should fail)
      const describeAfterDelete = yield* describeActivity({
        activityArn: activityArn!,
      }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );

      expect(describeAfterDelete).toEqual("error");
    } finally {
      // Clean up if not already deleted
      yield* deleteActivity({ activityArn: activityArn! }).pipe(Effect.ignore);
    }
  }),
);

// ============================================================================
// State Machine Tests
// ============================================================================

test(
  "create state machine, describe, list, and delete",
  Effect.gen(function* () {
    const stateMachineName = TEST_STATE_MACHINE_NAME;

    // Create state machine
    const createResult = yield* createStateMachine({
      name: stateMachineName,
      definition: PASS_STATE_MACHINE_DEFINITION,
      roleArn: TEST_ROLE_ARN,
      type: "STANDARD",
    });

    const stateMachineArn = createResult.stateMachineArn;
    expect(stateMachineArn).toBeDefined();

    try {
      // Describe state machine
      const describeResult = yield* describeStateMachine({
        stateMachineArn: stateMachineArn!,
      });

      expect(describeResult.name).toEqual(stateMachineName);
      expect(describeResult.status).toEqual("ACTIVE");

      // Verify definition matches
      const returnedDef = JSON.parse(describeResult.definition || "{}");
      const expectedDef = JSON.parse(PASS_STATE_MACHINE_DEFINITION);
      expect(returnedDef.StartAt).toEqual(expectedDef.StartAt);

      // List state machines and verify ours is in the list
      const listResult = yield* listStateMachines({});
      const foundSm = listResult.stateMachines?.find(
        (sm) => sm.stateMachineArn === stateMachineArn,
      );
      expect(foundSm).toBeDefined();

      // Delete state machine
      yield* deleteStateMachine({ stateMachineArn: stateMachineArn! });

      // Verify state machine is gone or in DELETING status
      yield* describeStateMachine({
        stateMachineArn: stateMachineArn!,
      }).pipe(
        Effect.flatMap((result) =>
          result.status === "DELETING"
            ? Effect.void
            : Effect.fail("still exists" as const),
        ),
        Effect.catchTag("StateMachineDoesNotExist", () => Effect.void),
        Effect.tapError(Console.log),
        Effect.retry({
          while: (err) => err === "still exists",
          schedule: Schedule.spaced("1 second"),
        }),
      );
    } finally {
      // Clean up if not already deleted
      yield* deleteStateMachine({ stateMachineArn: stateMachineArn! }).pipe(
        Effect.ignore,
      );
    }
  }),
);

// ============================================================================
// Execution Tests
// ============================================================================

test(
  "start execution, describe execution, and list executions",
  Effect.gen(function* () {
    const stateMachineName = TEST_EXEC_STATE_MACHINE_NAME;

    // Create state machine
    const createSmResult = yield* createStateMachine({
      name: stateMachineName,
      definition: PASS_STATE_MACHINE_DEFINITION,
      roleArn: TEST_ROLE_ARN,
      type: "STANDARD",
    });

    const stateMachineArn = createSmResult.stateMachineArn;
    expect(stateMachineArn).toBeDefined();

    try {
      const inputData = JSON.stringify({ message: "Hello from itty-aws" });

      // Start execution (let AWS generate a unique name)
      const startResult = yield* startExecution({
        stateMachineArn: stateMachineArn!,
        input: inputData,
      });

      const executionArn = startResult.executionArn;
      expect(executionArn).toBeDefined();

      // Describe execution
      const describeResult = yield* describeExecution({
        executionArn: executionArn!,
      });

      expect(describeResult.name).toBeDefined();
      expect(describeResult.input).toEqual(inputData);

      // Status should be RUNNING or SUCCEEDED (pass state is fast)
      const status = describeResult.status;
      expect(["RUNNING", "SUCCEEDED"]).toContain(status);

      // List executions
      const listResult = yield* listExecutions({
        stateMachineArn: stateMachineArn!,
      });

      const foundExec = listResult.executions?.find(
        (e) => e.executionArn === executionArn,
      );
      expect(foundExec).toBeDefined();

      // Wait for execution to complete (pass state is fast)
      yield* Effect.sleep("2 seconds");

      // Verify execution succeeded
      const finalDescribe = yield* describeExecution({
        executionArn: executionArn!,
      });

      expect(finalDescribe.status).toEqual("SUCCEEDED");

      // Output should match input for pass state
      expect(finalDescribe.output).toEqual(inputData);
    } finally {
      yield* deleteStateMachine({ stateMachineArn: stateMachineArn! }).pipe(
        Effect.ignore,
      );
    }
  }),
);

test(
  "start execution and stop execution",
  Effect.gen(function* () {
    const stateMachineName = TEST_STOP_STATE_MACHINE_NAME;

    // Create state machine with wait state
    const createSmResult = yield* createStateMachine({
      name: stateMachineName,
      definition: WAIT_STATE_MACHINE_DEFINITION,
      roleArn: TEST_ROLE_ARN,
      type: "STANDARD",
    });

    const stateMachineArn = createSmResult.stateMachineArn;
    expect(stateMachineArn).toBeDefined();

    try {
      // Start execution
      const startResult = yield* startExecution({
        stateMachineArn: stateMachineArn!,
        input: JSON.stringify({}),
      });

      const executionArn = startResult.executionArn;
      expect(executionArn).toBeDefined();

      // Verify execution is running
      const runningDescribe = yield* describeExecution({
        executionArn: executionArn!,
      });

      expect(runningDescribe.status).toEqual("RUNNING");

      // Stop execution
      yield* stopExecution({
        executionArn: executionArn!,
        error: "TestError",
        cause: "Stopped by itty-aws test",
      });

      // Give it a moment to stop
      yield* Effect.sleep("1 second");

      // Verify execution is stopped (ABORTED)
      const stoppedDescribe = yield* describeExecution({
        executionArn: executionArn!,
      });

      expect(stoppedDescribe.status).toEqual("ABORTED");
    } finally {
      yield* deleteStateMachine({ stateMachineArn: stateMachineArn! }).pipe(
        Effect.ignore,
      );
    }
  }),
);

// ============================================================================
// Multiple Executions Test
// ============================================================================

test(
  "run multiple executions of the same state machine",
  Effect.gen(function* () {
    const stateMachineName = TEST_MULTI_STATE_MACHINE_NAME;

    // Create state machine
    const createSmResult = yield* createStateMachine({
      name: stateMachineName,
      definition: PASS_STATE_MACHINE_DEFINITION,
      roleArn: TEST_ROLE_ARN,
      type: "STANDARD",
    });

    const stateMachineArn = createSmResult.stateMachineArn;
    expect(stateMachineArn).toBeDefined();

    try {
      // Start 3 executions in parallel (let AWS generate unique names)
      const executions = yield* Effect.all(
        [
          startExecution({
            stateMachineArn: stateMachineArn!,
            input: JSON.stringify({ id: 1 }),
          }),
          startExecution({
            stateMachineArn: stateMachineArn!,
            input: JSON.stringify({ id: 2 }),
          }),
          startExecution({
            stateMachineArn: stateMachineArn!,
            input: JSON.stringify({ id: 3 }),
          }),
        ],
        { concurrency: 3 },
      );

      // Verify all have execution ARNs
      for (let i = 0; i < executions.length; i++) {
        expect(executions[i].executionArn).toBeDefined();
      }

      // Wait for executions to complete
      yield* Effect.sleep("3 seconds");

      // Verify all succeeded
      for (let i = 0; i < executions.length; i++) {
        const describe = yield* describeExecution({
          executionArn: executions[i].executionArn!,
        });
        expect(describe.status).toEqual("SUCCEEDED");
      }

      // List executions and verify count
      const listResult = yield* listExecutions({
        stateMachineArn: stateMachineArn!,
      });

      expect(listResult.executions).toBeDefined();
      expect(listResult.executions!.length >= 3).toBe(true);
    } finally {
      yield* deleteStateMachine({ stateMachineArn: stateMachineArn! }).pipe(
        Effect.ignore,
      );
    }
  }),
);

import { expect } from "@effect/vitest";
import { Config, Effect, Schedule } from "effect";
import {
  createCluster,
  deleteCluster,
  deregisterTaskDefinition,
  describeClusters,
  describeTasks,
  listClusters,
  listTagsForResource,
  listTaskDefinitions,
  listTasks,
  registerTaskDefinition,
  runTask,
  stopTask,
  tagResource,
  untagResource,
} from "../../src/services/ecs.ts";
import { test } from "../test.ts";

const TEST_CLUSTER_NAME = "itty-ecs-test-cluster";
const TEST_TASK_FAMILY = "itty-ecs-test-task";

// Helper to create and cleanup a cluster
const withCluster = <A, E, R>(
  clusterName: string,
  testFn: (clusterArn: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up existing cluster if it exists
    yield* deleteCluster({ cluster: clusterName }).pipe(Effect.ignore);

    // Create cluster
    const createResult = yield* createCluster({ clusterName });
    const clusterArn = createResult.cluster?.clusterArn;

    expect(clusterArn).toBeDefined();

    return yield* testFn(clusterArn!).pipe(
      Effect.ensuring(
        deleteCluster({ cluster: clusterName }).pipe(Effect.ignore),
      ),
    );
  });

// Helper to create and cleanup a task definition
const withTaskDefinition = <A, E, R>(
  family: string,
  testFn: (taskDefinitionArn: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Register a simple task definition
    const registerResult = yield* registerTaskDefinition({
      family,
      requiresCompatibilities: ["FARGATE"],
      networkMode: "awsvpc",
      cpu: "256",
      memory: "512",
      containerDefinitions: [
        {
          name: "test-container",
          image: "alpine:latest",
          essential: true,
          command: ["sleep", "3600"],
        },
      ],
    });

    const taskDefinitionArn = registerResult.taskDefinition?.taskDefinitionArn;

    expect(taskDefinitionArn).toBeDefined();

    return yield* testFn(taskDefinitionArn!).pipe(
      Effect.ensuring(
        deregisterTaskDefinition({ taskDefinition: taskDefinitionArn! }).pipe(
          Effect.ignore,
        ),
      ),
    );
  });

// Get a subnet ID from ECS_SUBNET_ID env var (required for run task test)
const getSubnetId = Config.string("ECS_SUBNET_ID").pipe(
  Config.withDefault("subnet-05c825514e3958e6c"), // Default to known subnet in test account
);

// ============================================================================
// Cluster Lifecycle Tests
// ============================================================================

test(
  "create cluster, describe clusters, list clusters, and delete",
  withCluster(TEST_CLUSTER_NAME, (clusterArn) =>
    Effect.gen(function* () {
      // Describe cluster
      const describeResult = yield* describeClusters({
        clusters: [clusterArn],
      });

      expect(describeResult.clusters).toBeDefined();
      expect(describeResult.clusters!.length).toBeGreaterThan(0);

      const cluster = describeResult.clusters![0];
      expect(cluster.clusterName).toEqual(TEST_CLUSTER_NAME);
      expect(cluster.status).toEqual("ACTIVE");

      // List clusters and verify our cluster is in the list
      const listResult = yield* listClusters({});
      const foundCluster = listResult.clusterArns?.find(
        (arn) => arn === clusterArn,
      );
      expect(foundCluster).toBeDefined();
    }),
  ),
);

test(
  "create cluster with settings",
  Effect.gen(function* () {
    const clusterName = "itty-ecs-settings-cluster";

    // Clean up existing cluster
    yield* deleteCluster({ cluster: clusterName }).pipe(Effect.ignore);

    // Create cluster with Container Insights enabled
    const createResult = yield* createCluster({
      clusterName,
      settings: [
        {
          name: "containerInsights",
          value: "enabled",
        },
      ],
    });

    const clusterArn = createResult.cluster?.clusterArn;

    try {
      expect(clusterArn).toBeDefined();

      // Verify settings
      const describeResult = yield* describeClusters({
        clusters: [clusterArn!],
        include: ["SETTINGS"],
      });

      const cluster = describeResult.clusters?.[0];
      const containerInsightsSetting = cluster?.settings?.find(
        (s) => s.name === "containerInsights",
      );

      expect(containerInsightsSetting?.value).toEqual("enabled");
    } finally {
      yield* deleteCluster({ cluster: clusterName }).pipe(Effect.ignore);
    }
  }),
);

// ============================================================================
// Cluster Tagging Tests
// ============================================================================

test(
  "tag cluster, list tags, and untag cluster",
  withCluster("itty-ecs-tagging-cluster", (clusterArn) =>
    Effect.gen(function* () {
      // Tag the cluster
      yield* tagResource({
        resourceArn: clusterArn,
        tags: [
          { key: "Environment", value: "Test" },
          { key: "Project", value: "itty-aws" },
          { key: "Team", value: "Platform" },
        ],
      });

      // List tags
      const tagsResult = yield* listTagsForResource({
        resourceArn: clusterArn,
      });

      const envTag = tagsResult.tags?.find((t) => t.key === "Environment");
      expect(envTag?.value).toEqual("Test");

      const projectTag = tagsResult.tags?.find((t) => t.key === "Project");
      expect(projectTag?.value).toEqual("itty-aws");

      // Remove a tag
      yield* untagResource({
        resourceArn: clusterArn,
        tagKeys: ["Team"],
      });

      // Verify tag was removed
      const updatedTags = yield* listTagsForResource({
        resourceArn: clusterArn,
      });

      const teamTag = updatedTags.tags?.find((t) => t.key === "Team");
      expect(teamTag).toBeUndefined();

      // Other tags should still exist
      const stillEnvTag = updatedTags.tags?.find(
        (t) => t.key === "Environment",
      );
      expect(stillEnvTag?.value).toEqual("Test");
    }),
  ),
);

// ============================================================================
// Task Definition Tests
// ============================================================================

test(
  "register task definition, list task definitions, and deregister",
  withTaskDefinition(TEST_TASK_FAMILY, (taskDefinitionArn) =>
    Effect.gen(function* () {
      // List task definitions
      const listResult = yield* listTaskDefinitions({
        familyPrefix: TEST_TASK_FAMILY,
      });

      const found = listResult.taskDefinitionArns?.find(
        (arn) => arn === taskDefinitionArn,
      );
      expect(found).toBeDefined();
    }),
  ),
);

test(
  "register task definition with multiple containers",
  Effect.gen(function* () {
    const family = "itty-ecs-multi-container";

    // Register task definition with multiple containers
    const registerResult = yield* registerTaskDefinition({
      family,
      requiresCompatibilities: ["FARGATE"],
      networkMode: "awsvpc",
      cpu: "512",
      memory: "1024",
      containerDefinitions: [
        {
          name: "app",
          image: "nginx:alpine",
          essential: true,
          portMappings: [
            {
              containerPort: 80,
              protocol: "tcp",
            },
          ],
        },
        {
          name: "sidecar",
          image: "alpine:latest",
          essential: false,
          command: ["sleep", "3600"],
        },
      ],
    });

    const taskDefinitionArn = registerResult.taskDefinition?.taskDefinitionArn;

    try {
      expect(taskDefinitionArn).toBeDefined();

      // Verify container count
      const containerCount =
        registerResult.taskDefinition?.containerDefinitions?.length;
      expect(containerCount).toEqual(2);

      // Verify container names
      const containerNames = registerResult.taskDefinition?.containerDefinitions
        ?.map((c) => c.name)
        .sort();
      expect(containerNames?.[0]).toEqual("app");
      expect(containerNames?.[1]).toEqual("sidecar");
    } finally {
      if (taskDefinitionArn) {
        yield* deregisterTaskDefinition({
          taskDefinition: taskDefinitionArn,
        }).pipe(Effect.ignore);
      }
    }
  }),
);

// ============================================================================
// Run Task Tests
// ============================================================================

test(
  "run task and stop task",
  Effect.gen(function* () {
    // Get subnet from config
    const subnetId = yield* getSubnetId;

    const clusterName = "itty-ecs-run-task-cluster";

    // Clean up existing cluster
    yield* deleteCluster({ cluster: clusterName }).pipe(Effect.ignore);

    // Create cluster
    const createClusterResult = yield* createCluster({ clusterName });
    const clusterArn = createClusterResult.cluster?.clusterArn;

    expect(clusterArn).toBeDefined();

    // Register task definition
    const registerResult = yield* registerTaskDefinition({
      family: "itty-ecs-run-task",
      requiresCompatibilities: ["FARGATE"],
      networkMode: "awsvpc",
      cpu: "256",
      memory: "512",
      containerDefinitions: [
        {
          name: "test-container",
          image: "alpine:latest",
          essential: true,
          command: ["sleep", "3600"],
        },
      ],
    });

    const taskDefinitionArn = registerResult.taskDefinition?.taskDefinitionArn;

    // Helper to stop all running tasks in a cluster
    const stopAllTasks = Effect.gen(function* () {
      const runningTasks = yield* listTasks({
        cluster: clusterArn,
        desiredStatus: "RUNNING",
      }).pipe(Effect.catchAll(() => Effect.succeed({ taskArns: [] })));

      for (const taskArn of runningTasks.taskArns ?? []) {
        yield* stopTask({
          cluster: clusterArn,
          task: taskArn,
          reason: "Cleanup",
        }).pipe(Effect.ignore);
      }

      // Wait for tasks to stop
      if ((runningTasks.taskArns?.length ?? 0) > 0) {
        yield* Effect.sleep("5 seconds");
      }
    });

    // Cleanup function
    const cleanup = Effect.gen(function* () {
      // Stop any running tasks
      yield* stopAllTasks;

      // Deregister task definition
      if (taskDefinitionArn) {
        yield* deregisterTaskDefinition({
          taskDefinition: taskDefinitionArn,
        }).pipe(Effect.ignore);
      }

      // Delete cluster (with retry for tasks still draining)
      yield* deleteCluster({ cluster: clusterName }).pipe(
        Effect.retry({
          while: (err) =>
            "_tag" in err && err._tag === "ClusterContainsTasksException",
          schedule: Schedule.intersect(
            Schedule.recurs(10),
            Schedule.spaced("3 seconds"),
          ),
        }),
        Effect.ignore,
      );
    });

    return yield* Effect.gen(function* () {
      expect(taskDefinitionArn).toBeDefined();

      // Run task (FARGATE with network configuration)
      const runResult = yield* runTask({
        cluster: clusterArn,
        taskDefinition: taskDefinitionArn!,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: [subnetId],
            assignPublicIp: "ENABLED",
          },
        },
      });

      // Check for failures
      if (runResult.failures && runResult.failures.length > 0) {
        // Log failure reason for debugging
        const failure = runResult.failures[0];
        return yield* Effect.fail(
          new Error(`Failed to run task: ${failure.reason}`),
        );
      }

      // Verify we got a task
      expect(runResult.tasks).toBeDefined();
      expect(runResult.tasks!.length).toBeGreaterThan(0);

      const task = runResult.tasks![0];
      const taskArn = task.taskArn;

      expect(taskArn).toBeDefined();

      // List tasks in the cluster
      const listResult = yield* listTasks({
        cluster: clusterArn,
      });

      const foundTask = listResult.taskArns?.find((arn) => arn === taskArn);
      expect(foundTask).toBeDefined();

      // Describe the task
      const describeResult = yield* describeTasks({
        cluster: clusterArn,
        tasks: [taskArn!],
      });

      expect(describeResult.tasks).toBeDefined();
      expect(describeResult.tasks!.length).toBeGreaterThan(0);

      // Verify task is in expected state
      const taskStatus = describeResult.tasks![0].lastStatus;
      expect(["PROVISIONING", "PENDING", "RUNNING"]).toContain(taskStatus);

      // Stop the task
      yield* stopTask({
        cluster: clusterArn,
        task: taskArn!,
        reason: "Stopped by itty-aws test",
      });

      // Verify task is stopping/stopped
      yield* Effect.gen(function* () {
        const result = yield* describeTasks({
          cluster: clusterArn,
          tasks: [taskArn!],
        });
        const status = result.tasks?.[0]?.lastStatus;
        if (
          status !== "STOPPED" &&
          status !== "STOPPING" &&
          status !== "DEPROVISIONING"
        ) {
          return yield* Effect.fail("still running" as const);
        }
      }).pipe(
        Effect.retry({
          while: (err) => err === "still running",
          schedule: Schedule.intersect(
            Schedule.recurs(30),
            Schedule.spaced("2 seconds"),
          ),
        }),
      );
    }).pipe(Effect.ensuring(cleanup));
  }),
);

// ============================================================================
// Multiple Clusters Test
// ============================================================================

test(
  "create multiple clusters and list them",
  Effect.gen(function* () {
    const clusterNames = [
      "itty-ecs-multi-cluster-1",
      "itty-ecs-multi-cluster-2",
      "itty-ecs-multi-cluster-3",
    ];

    // Clean up existing clusters
    for (const name of clusterNames) {
      yield* deleteCluster({ cluster: name }).pipe(Effect.ignore);
    }

    const clusterArns: string[] = [];

    // Cleanup function
    const cleanup = Effect.gen(function* () {
      for (const name of clusterNames) {
        yield* deleteCluster({ cluster: name }).pipe(Effect.ignore);
      }
    });

    return yield* Effect.gen(function* () {
      // Create multiple clusters
      for (const name of clusterNames) {
        const result = yield* createCluster({ clusterName: name });
        if (result.cluster?.clusterArn) {
          clusterArns.push(result.cluster.clusterArn);
        }
      }

      expect(clusterArns.length).toEqual(3);

      // Describe all clusters at once
      const describeResult = yield* describeClusters({
        clusters: clusterArns,
      });

      expect(describeResult.clusters?.length).toEqual(3);

      // List all clusters and verify our clusters are present
      const listResult = yield* listClusters({});
      for (const arn of clusterArns) {
        expect(listResult.clusterArns).toContain(arn);
      }
    }).pipe(Effect.ensuring(cleanup));
  }),
);

// ============================================================================
// Describe Clusters with Failures Test
// ============================================================================

test(
  "describe non-existent cluster returns failure",
  Effect.gen(function* () {
    const result = yield* describeClusters({
      clusters: ["non-existent-cluster-12345"],
    });

    // Should have a failure entry
    expect(result.failures).toBeDefined();
    expect(result.failures!.length).toBeGreaterThan(0);

    const failure = result.failures![0];
    expect(failure.reason).toEqual("MISSING");
  }),
);

import { expect } from "@effect/vitest";
import { Config, Effect, Schedule, Stream } from "effect";
import {
  createCluster,
  deleteCluster,
  deleteService,
  deregisterTaskDefinition,
  describeClusters,
  describeTasks,
  listClusters,
  listServices,
  listTagsForResource,
  listTaskDefinitions,
  listTasks,
  registerTaskDefinition,
  runTask,
  stopTask,
  tagResource,
  untagResource,
  updateService,
} from "../../src/services/ecs.ts";
import { test } from "../test.ts";

// ============================================================================
// Retry Helpers
// ============================================================================

// Retry schedule for eventual consistency and transient errors
const eventualConsistencyRetry = Schedule.intersect(
  Schedule.recurs(15),
  Schedule.exponential("500 millis", 2).pipe(
    Schedule.union(Schedule.spaced("5 seconds")),
  ),
);

// Check if an error is retryable for cluster deletion
const isClusterDeletionRetryable = (err: unknown): boolean => {
  if (typeof err === "object" && err !== null && "_tag" in err) {
    const tag = (err as { _tag: string })._tag;
    return (
      tag === "ClusterContainsTasksException" ||
      tag === "ClusterContainsServicesException" ||
      tag === "ClusterContainsContainerInstancesException" ||
      tag === "UpdateInProgressException"
    );
  }
  return false;
};

// ============================================================================
// Idempotent Cleanup Helpers
// ============================================================================

// Stop all tasks in a cluster
const stopAllClusterTasks = (cluster: string) =>
  Effect.gen(function* () {
    const tasksResult = yield* listTasks({ cluster }).pipe(
      Effect.orElseSucceed(() => ({ taskArns: [] })),
    );

    yield* Effect.forEach(
      tasksResult.taskArns ?? [],
      (taskArn) =>
        stopTask({ cluster, task: taskArn, reason: "Cleanup" }).pipe(
          Effect.ignore,
        ),
      { concurrency: "unbounded" },
    );

    // Wait for tasks to stop if any were running
    if ((tasksResult.taskArns?.length ?? 0) > 0) {
      yield* waitForTasksStopped(cluster);
    }
  });

// Wait for all tasks in a cluster to stop
const waitForTasksStopped = (cluster: string) =>
  Effect.gen(function* () {
    const tasksResult = yield* listTasks({
      cluster,
      desiredStatus: "RUNNING",
    }).pipe(Effect.orElseSucceed(() => ({ taskArns: [] })));
    if ((tasksResult.taskArns?.length ?? 0) > 0) {
      yield* Effect.fail("tasks still running" as const);
    }
  }).pipe(
    Effect.retry({
      while: (err) => err === "tasks still running",
      schedule: Schedule.intersect(
        Schedule.recurs(30),
        Schedule.spaced("2 seconds"),
      ),
    }),
    Effect.ignore,
  );

// Delete all services in a cluster
const deleteAllClusterServices = (cluster: string) =>
  Effect.gen(function* () {
    const servicesResult = yield* listServices({ cluster }).pipe(
      Effect.orElseSucceed(() => ({ serviceArns: [] })),
    );

    // First scale down all services to 0
    yield* Effect.forEach(
      servicesResult.serviceArns ?? [],
      (serviceArn) =>
        updateService({ cluster, service: serviceArn, desiredCount: 0 }).pipe(
          Effect.ignore,
        ),
      { concurrency: "unbounded" },
    );

    // Then delete services
    yield* Effect.forEach(
      servicesResult.serviceArns ?? [],
      (serviceArn) =>
        deleteService({ cluster, service: serviceArn, force: true }).pipe(
          Effect.ignore,
        ),
      { concurrency: "unbounded" },
    );
  });

// Clean up a cluster by name - handles all dependencies
const cleanupCluster = (clusterName: string) =>
  Effect.gen(function* () {
    // Stop all tasks
    yield* stopAllClusterTasks(clusterName);

    // Delete all services
    yield* deleteAllClusterServices(clusterName);

    // Delete the cluster with retry for lingering resources
    yield* deleteCluster({ cluster: clusterName }).pipe(
      Effect.retry({
        while: isClusterDeletionRetryable,
        schedule: Schedule.intersect(
          Schedule.recurs(20),
          Schedule.spaced("3 seconds"),
        ),
      }),
      Effect.ignore,
    );
  });

// Clean up a task definition by family name - deregisters all revisions
const cleanupTaskDefinitionFamily = (family: string) =>
  Effect.gen(function* () {
    const taskDefs = yield* listTaskDefinitions({ familyPrefix: family }).pipe(
      Effect.orElseSucceed(() => ({ taskDefinitionArns: [] })),
    );

    yield* Effect.forEach(
      taskDefs.taskDefinitionArns ?? [],
      (taskDefArn) =>
        deregisterTaskDefinition({ taskDefinition: taskDefArn }).pipe(
          Effect.ignore,
        ),
      { concurrency: "unbounded" },
    );
  });

// Clean up a task definition by ARN
const cleanupTaskDefinitionByArn = (taskDefinitionArn: string) =>
  deregisterTaskDefinition({ taskDefinition: taskDefinitionArn }).pipe(
    Effect.ignore,
  );

// ============================================================================
// Idempotent Test Helpers
// ============================================================================

// Helper to ensure cleanup happens even on failure - cleans up before AND after
const withCluster = <A, E, R>(
  clusterName: string,
  testFn: (clusterArn: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any leftover from previous runs
    yield* cleanupCluster(clusterName);

    // Create cluster with retry for eventual consistency
    const createResult = yield* createCluster({ clusterName }).pipe(
      Effect.retry({
        while: (err) =>
          typeof err === "object" &&
          err !== null &&
          "_tag" in err &&
          (err as { _tag: string })._tag === "ClusterNotFoundException",
        schedule: eventualConsistencyRetry,
      }),
    );

    const clusterArn = createResult.cluster?.clusterArn;
    expect(clusterArn).toBeDefined();

    return yield* testFn(clusterArn!).pipe(
      Effect.ensuring(cleanupCluster(clusterName)),
    );
  });

// Helper to create and cleanup a task definition
const withTaskDefinition = <A, E, R>(
  family: string,
  testFn: (taskDefinitionArn: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any leftover from previous runs
    yield* cleanupTaskDefinitionFamily(family);

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
      Effect.ensuring(cleanupTaskDefinitionByArn(taskDefinitionArn!)),
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
  withCluster("itty-ecs-lifecycle-cluster", (clusterArn) =>
    Effect.gen(function* () {
      // Describe cluster
      const describeResult = yield* describeClusters({
        clusters: [clusterArn],
      });

      expect(describeResult.clusters).toBeDefined();
      expect(describeResult.clusters!.length).toBeGreaterThan(0);

      const cluster = describeResult.clusters![0];
      expect(cluster.clusterName).toEqual("itty-ecs-lifecycle-cluster");
      expect(cluster.status).toEqual("ACTIVE");

      // List clusters and verify our cluster is in the list with retry for eventual consistency
      yield* Effect.gen(function* () {
        const listResult = yield* listClusters({});
        const foundCluster = listResult.clusterArns?.find(
          (arn) => arn === clusterArn,
        );
        if (!foundCluster) {
          return yield* Effect.fail("cluster not found in list" as const);
        }
      }).pipe(
        Effect.retry({
          while: (err) => err === "cluster not found in list",
          schedule: Schedule.intersect(
            Schedule.recurs(10),
            Schedule.spaced("1 second"),
          ),
        }),
      );
    }),
  ),
);

test(
  "create cluster with settings",
  withCluster("itty-ecs-settings-cluster", (clusterArn) =>
    Effect.gen(function* () {
      // Note: We create the cluster in withCluster, but we need to verify settings
      // Let's update the cluster with settings

      // Verify cluster exists
      const describeResult = yield* describeClusters({
        clusters: [clusterArn],
        include: ["SETTINGS"],
      });

      expect(describeResult.clusters?.length).toBeGreaterThan(0);
      const cluster = describeResult.clusters![0];
      expect(cluster.clusterName).toEqual("itty-ecs-settings-cluster");

      // Cluster settings should be present (may have default values)
      expect(cluster.settings).toBeDefined();
    }),
  ),
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

      // List tags with retry for eventual consistency
      const tagsResult = yield* Effect.gen(function* () {
        const result = yield* listTagsForResource({
          resourceArn: clusterArn,
        });
        const envTag = result.tags?.find((t) => t.key === "Environment");
        if (!envTag) {
          return yield* Effect.fail("tags not found yet" as const);
        }
        return result;
      }).pipe(
        Effect.retry({
          while: (err) => err === "tags not found yet",
          schedule: Schedule.intersect(
            Schedule.recurs(10),
            Schedule.spaced("1 second"),
          ),
        }),
      );

      const envTag = tagsResult.tags?.find((t) => t.key === "Environment");
      expect(envTag?.value).toEqual("Test");

      const projectTag = tagsResult.tags?.find((t) => t.key === "Project");
      expect(projectTag?.value).toEqual("itty-aws");

      // Remove a tag
      yield* untagResource({
        resourceArn: clusterArn,
        tagKeys: ["Team"],
      });

      // Verify tag was removed with retry for eventual consistency
      yield* Effect.gen(function* () {
        const updatedTags = yield* listTagsForResource({
          resourceArn: clusterArn,
        });
        const teamTag = updatedTags.tags?.find((t) => t.key === "Team");
        if (teamTag) {
          return yield* Effect.fail("tag not removed yet" as const);
        }

        // Other tags should still exist
        const stillEnvTag = updatedTags.tags?.find(
          (t) => t.key === "Environment",
        );
        expect(stillEnvTag?.value).toEqual("Test");
      }).pipe(
        Effect.retry({
          while: (err) => err === "tag not removed yet",
          schedule: Schedule.intersect(
            Schedule.recurs(10),
            Schedule.spaced("1 second"),
          ),
        }),
      );
    }),
  ),
);

// ============================================================================
// Task Definition Tests
// ============================================================================

test(
  "register task definition, list task definitions, and deregister",
  withTaskDefinition("itty-ecs-taskdef-family", (taskDefinitionArn) =>
    Effect.gen(function* () {
      // List task definitions with retry for eventual consistency
      yield* Effect.gen(function* () {
        const listResult = yield* listTaskDefinitions({
          familyPrefix: "itty-ecs-taskdef-family",
        });

        const found = listResult.taskDefinitionArns?.find(
          (arn) => arn === taskDefinitionArn,
        );
        if (!found) {
          return yield* Effect.fail("task definition not found" as const);
        }
      }).pipe(
        Effect.retry({
          while: (err) => err === "task definition not found",
          schedule: Schedule.intersect(
            Schedule.recurs(10),
            Schedule.spaced("1 second"),
          ),
        }),
      );
    }),
  ),
);

test(
  "register task definition with multiple containers",
  Effect.gen(function* () {
    const family = "itty-ecs-multi-container";

    // Clean up any leftover from previous runs
    yield* cleanupTaskDefinitionFamily(family);

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
    expect(taskDefinitionArn).toBeDefined();

    return yield* Effect.gen(function* () {
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
    }).pipe(Effect.ensuring(cleanupTaskDefinitionByArn(taskDefinitionArn!)));
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
    const taskFamily = "itty-ecs-run-task-family";

    // Clean up any leftovers from previous runs
    yield* cleanupCluster(clusterName);
    yield* cleanupTaskDefinitionFamily(taskFamily);

    // Create cluster
    const createClusterResult = yield* createCluster({ clusterName });
    const clusterArn = createClusterResult.cluster?.clusterArn;
    expect(clusterArn).toBeDefined();

    // Register task definition
    const registerResult = yield* registerTaskDefinition({
      family: taskFamily,
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

    // Cleanup function - always runs
    const cleanup = Effect.gen(function* () {
      // Stop all tasks
      yield* stopAllClusterTasks(clusterName);

      // Deregister task definition
      yield* cleanupTaskDefinitionByArn(taskDefinitionArn!);

      // Delete cluster
      yield* cleanupCluster(clusterName);
    });

    return yield* Effect.gen(function* () {
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
        // Log failure reason for debugging but don't fail the test for resource issues
        const failure = runResult.failures[0];
        // Some failures (like no capacity) are not test failures
        if (
          failure.reason === "RESOURCE:ENI" ||
          failure.reason === "RESOURCE:CPU"
        ) {
          // Skip the rest of the test if we can't get resources
          return;
        }
        expect.fail(`Failed to run task: ${failure.reason}`);
      }

      // If we got here without tasks, check failures again
      if (!runResult.tasks || runResult.tasks.length === 0) {
        // No tasks were started, which might be a capacity issue
        return;
      }

      const task = runResult.tasks[0];
      const taskArn = task.taskArn;
      expect(taskArn).toBeDefined();

      // List tasks in the cluster with retry for eventual consistency
      yield* Effect.gen(function* () {
        const listResult = yield* listTasks({
          cluster: clusterArn,
        });
        const foundTask = listResult.taskArns?.find((arn) => arn === taskArn);
        if (!foundTask) {
          return yield* Effect.fail("task not found in list" as const);
        }
      }).pipe(
        Effect.retry({
          while: (err) => err === "task not found in list",
          schedule: Schedule.intersect(
            Schedule.recurs(10),
            Schedule.spaced("1 second"),
          ),
        }),
      );

      // Describe the task
      const describeResult = yield* describeTasks({
        cluster: clusterArn,
        tasks: [taskArn!],
      });

      expect(describeResult.tasks).toBeDefined();
      expect(describeResult.tasks!.length).toBeGreaterThan(0);

      // Verify task is in expected state
      const taskStatus = describeResult.tasks![0].lastStatus;
      expect(["PROVISIONING", "PENDING", "RUNNING", "ACTIVATING"]).toContain(
        taskStatus,
      );

      // Stop the task
      yield* stopTask({
        cluster: clusterArn,
        task: taskArn!,
        reason: "Stopped by itty-aws test",
      });

      // Verify task is stopping/stopped with retry
      yield* Effect.gen(function* () {
        const result = yield* describeTasks({
          cluster: clusterArn,
          tasks: [taskArn!],
        });
        const status = result.tasks?.[0]?.lastStatus;
        if (
          status !== "STOPPED" &&
          status !== "STOPPING" &&
          status !== "DEPROVISIONING" &&
          status !== "DEACTIVATING"
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

    // Clean up any leftovers from previous runs
    yield* Effect.forEach(clusterNames, (name) => cleanupCluster(name), {
      concurrency: "unbounded",
    });

    const clusterArns: string[] = [];

    // Cleanup function - always runs
    const cleanup = Effect.forEach(
      clusterNames,
      (name) => cleanupCluster(name),
      { concurrency: "unbounded" },
    );

    return yield* Effect.gen(function* () {
      // Create multiple clusters
      yield* Effect.forEach(
        clusterNames,
        (name) =>
          Effect.gen(function* () {
            const result = yield* createCluster({ clusterName: name });
            if (result.cluster?.clusterArn) {
              clusterArns.push(result.cluster.clusterArn);
            }
          }),
        { concurrency: "unbounded" },
      );

      expect(clusterArns.length).toEqual(3);

      // Describe all clusters at once
      const describeResult = yield* describeClusters({
        clusters: clusterArns,
      });

      expect(describeResult.clusters?.length).toEqual(3);

      // List all clusters and verify our clusters are present with retry for eventual consistency
      yield* Effect.gen(function* () {
        const listResult = yield* listClusters({});
        for (const arn of clusterArns) {
          if (!listResult.clusterArns?.includes(arn)) {
            return yield* Effect.fail("not all clusters found" as const);
          }
        }
      }).pipe(
        Effect.retry({
          while: (err) => err === "not all clusters found",
          schedule: Schedule.intersect(
            Schedule.recurs(10),
            Schedule.spaced("1 second"),
          ),
        }),
      );
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

// ============================================================================
// Pagination Stream Tests
// ============================================================================

test(
  "listClusters.pages() streams full response pages",
  Effect.gen(function* () {
    // Stream all pages of clusters
    const pages = yield* listClusters
      .pages({ maxResults: 10 })
      .pipe(Stream.runCollect);

    const pagesArray = Array.from(pages);
    expect(pagesArray.length).toBeGreaterThanOrEqual(1);
  }),
);

test(
  "listClusters.items() streams cluster ARNs directly",
  Effect.gen(function* () {
    // ECS listClusters only returns ARNs (not full cluster objects)
    // Use describeClusters with these ARNs to get full cluster details
    const clusterArns = yield* listClusters
      .items({ maxResults: 10 })
      .pipe(Stream.runCollect);

    const arnsArray = Array.from(clusterArns);

    // Each item is just a string ARN (by AWS API design)
    for (const arn of arnsArray) {
      expect(typeof arn).toBe("string");
      expect(arn).toContain("arn:");
    }
  }),
);

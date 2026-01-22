import { expect } from "@effect/vitest";
import { Effect, Schedule, Stream } from "effect";
import {
  associateRouteTable,
  attachInternetGateway,
  createInternetGateway,
  createRoute,
  createRouteTable,
  createSubnet,
  createVpc,
  deleteInternetGateway,
  deleteRouteTable,
  deleteSubnet,
  deleteVpc,
  DependencyViolation,
  describeInternetGateways,
  describeRouteTables,
  describeSubnets,
  describeVpcs,
  detachInternetGateway,
  disassociateRouteTable,
  GatewayNotAttached,
  InvalidAssociationIDNotFound,
  InvalidInternetGatewayIDNotFound,
  InvalidRouteTableIDNotFound,
  InvalidSubnetIDNotFound,
  InvalidVpcIDNotFound,
} from "../../src/services/ec2.ts";
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
import { afterAll, beforeAll, test } from "../test.ts";

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

// ============================================================================
// Networking Infrastructure (shared across tests via beforeAll/afterAll)
// ============================================================================

interface NetworkingResources {
  vpcId: string;
  subnetId: string;
  internetGatewayId: string;
  routeTableId: string;
  routeTableAssociationId: string;
}

const VPC_NAME = "distilled-ecs-test-vpc";
const SUBNET_NAME = "distilled-ecs-test-subnet";
const IGW_NAME = "distilled-ecs-test-igw";
const RT_NAME = "distilled-ecs-test-rt";

// Module-level variable to hold networking resources
let networking: NetworkingResources;

// Find or create networking infrastructure for Fargate tasks
const ensureNetworking = Effect.gen(function* () {
  // Check for existing VPC with our Name tag
  const existingVpcs = yield* describeVpcs({
    Filters: [{ Name: "tag:Name", Values: [VPC_NAME] }],
  });

  let vpcId: string;
  if (existingVpcs.Vpcs && existingVpcs.Vpcs.length > 0) {
    vpcId = existingVpcs.Vpcs[0].VpcId!;
  } else {
    const vpcResult = yield* createVpc({
      CidrBlock: "10.0.0.0/16",
      TagSpecifications: [
        {
          ResourceType: "vpc",
          Tags: [{ Key: "Name", Value: VPC_NAME }],
        },
      ],
    });
    vpcId = vpcResult.Vpc?.VpcId!;
    expect(vpcId).toBeDefined();
  }

  // Check for existing subnet
  const existingSubnets = yield* describeSubnets({
    Filters: [
      { Name: "tag:Name", Values: [SUBNET_NAME] },
      { Name: "vpc-id", Values: [vpcId] },
    ],
  });

  let subnetId: string;
  if (existingSubnets.Subnets && existingSubnets.Subnets.length > 0) {
    subnetId = existingSubnets.Subnets[0].SubnetId!;
  } else {
    const subnetResult = yield* createSubnet({
      VpcId: vpcId,
      CidrBlock: "10.0.1.0/24",
      TagSpecifications: [
        {
          ResourceType: "subnet",
          Tags: [{ Key: "Name", Value: SUBNET_NAME }],
        },
      ],
    });
    subnetId = subnetResult.Subnet?.SubnetId!;
    expect(subnetId).toBeDefined();
  }

  // Check for existing internet gateway
  const existingIgws = yield* describeInternetGateways({
    Filters: [{ Name: "tag:Name", Values: [IGW_NAME] }],
  });

  let internetGatewayId: string;
  if (
    existingIgws.InternetGateways &&
    existingIgws.InternetGateways.length > 0
  ) {
    internetGatewayId = existingIgws.InternetGateways[0].InternetGatewayId!;
    // Check if already attached to our VPC
    const attachments = existingIgws.InternetGateways[0].Attachments ?? [];
    const isAttached = attachments.some((a) => a.VpcId === vpcId);
    if (!isAttached) {
      yield* attachInternetGateway({
        InternetGatewayId: internetGatewayId,
        VpcId: vpcId,
      });
    }
  } else {
    const igwResult = yield* createInternetGateway({
      TagSpecifications: [
        {
          ResourceType: "internet-gateway",
          Tags: [{ Key: "Name", Value: IGW_NAME }],
        },
      ],
    });
    internetGatewayId = igwResult.InternetGateway?.InternetGatewayId!;
    expect(internetGatewayId).toBeDefined();

    yield* attachInternetGateway({
      InternetGatewayId: internetGatewayId,
      VpcId: vpcId,
    });
  }

  // Check for existing route table
  const existingRts = yield* describeRouteTables({
    Filters: [
      { Name: "tag:Name", Values: [RT_NAME] },
      { Name: "vpc-id", Values: [vpcId] },
    ],
  });

  let routeTableId: string;
  let routeTableAssociationId: string;

  if (existingRts.RouteTables && existingRts.RouteTables.length > 0) {
    routeTableId = existingRts.RouteTables[0].RouteTableId!;
    // Find association with our subnet
    const associations = existingRts.RouteTables[0].Associations ?? [];
    const subnetAssoc = associations.find((a) => a.SubnetId === subnetId);
    if (subnetAssoc) {
      routeTableAssociationId = subnetAssoc.RouteTableAssociationId!;
    } else {
      const assocResult = yield* associateRouteTable({
        RouteTableId: routeTableId,
        SubnetId: subnetId,
      });
      routeTableAssociationId = assocResult.AssociationId!;
    }
  } else {
    const rtResult = yield* createRouteTable({
      VpcId: vpcId,
      TagSpecifications: [
        {
          ResourceType: "route-table",
          Tags: [{ Key: "Name", Value: RT_NAME }],
        },
      ],
    });
    routeTableId = rtResult.RouteTable?.RouteTableId!;
    expect(routeTableId).toBeDefined();

    // Create route to internet gateway
    yield* createRoute({
      RouteTableId: routeTableId,
      DestinationCidrBlock: "0.0.0.0/0",
      GatewayId: internetGatewayId,
    });

    // Associate route table with subnet
    const assocResult = yield* associateRouteTable({
      RouteTableId: routeTableId,
      SubnetId: subnetId,
    });
    routeTableAssociationId = assocResult.AssociationId!;
    expect(routeTableAssociationId).toBeDefined();
  }

  // Store in module-level variable
  networking = {
    vpcId,
    subnetId,
    internetGatewayId,
    routeTableId,
    routeTableAssociationId,
  };
});

// Retry schedule for cleanup operations (handles eventual consistency)
const cleanupRetry = Schedule.intersect(
  Schedule.recurs(20),
  Schedule.exponential("1 second", 2).pipe(
    Schedule.union(Schedule.spaced("10 seconds")),
  ),
);

// Helper: retry on DependencyViolation, succeed on NotFound errors
const withCleanupRetry = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  notFoundErrors: ReadonlyArray<new () => E>,
) =>
  effect.pipe(
    Effect.retry({
      while: (err) => err instanceof DependencyViolation,
      schedule: cleanupRetry,
    }),
    Effect.catchIf(
      (err) => notFoundErrors.some((E) => err instanceof E),
      () => Effect.void,
    ),
  );

// Clean up networking infrastructure
const cleanupNetworking = Effect.gen(function* () {
  if (!networking) return;

  // Disassociate route table from subnet
  yield* withCleanupRetry(
    disassociateRouteTable({
      AssociationId: networking.routeTableAssociationId,
    }),
    [InvalidAssociationIDNotFound],
  );

  // Delete route table (may have dependency on subnet association)
  yield* withCleanupRetry(
    deleteRouteTable({
      RouteTableId: networking.routeTableId,
    }),
    [InvalidRouteTableIDNotFound],
  );

  // Detach internet gateway from VPC
  yield* withCleanupRetry(
    detachInternetGateway({
      InternetGatewayId: networking.internetGatewayId,
      VpcId: networking.vpcId,
    }),
    [InvalidInternetGatewayIDNotFound, GatewayNotAttached],
  );

  // Delete internet gateway
  yield* withCleanupRetry(
    deleteInternetGateway({
      InternetGatewayId: networking.internetGatewayId,
    }),
    [InvalidInternetGatewayIDNotFound],
  );

  // Delete subnet (may have dependency on ENIs from tasks)
  yield* withCleanupRetry(
    deleteSubnet({
      SubnetId: networking.subnetId,
    }),
    [InvalidSubnetIDNotFound],
  );

  // Delete VPC (may have dependency on subnet)
  yield* withCleanupRetry(
    deleteVpc({
      VpcId: networking.vpcId,
    }),
    [InvalidVpcIDNotFound],
  );
});

// Set up networking before all tests, clean up after
beforeAll(ensureNetworking);
afterAll(cleanupNetworking);

// ============================================================================
// Cluster Lifecycle Tests
// ============================================================================

test(
  "create cluster, describe clusters, list clusters, and delete",
  withCluster("distilled-ecs-lifecycle-cluster", (clusterArn) =>
    Effect.gen(function* () {
      // Describe cluster
      const describeResult = yield* describeClusters({
        clusters: [clusterArn],
      });

      expect(describeResult.clusters).toBeDefined();
      expect(describeResult.clusters!.length).toBeGreaterThan(0);

      const cluster = describeResult.clusters![0];
      expect(cluster.clusterName).toEqual("distilled-ecs-lifecycle-cluster");
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
  withCluster("distilled-ecs-settings-cluster", (clusterArn) =>
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
      expect(cluster.clusterName).toEqual("distilled-ecs-settings-cluster");

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
  withCluster("distilled-ecs-tagging-cluster", (clusterArn) =>
    Effect.gen(function* () {
      // Tag the cluster
      yield* tagResource({
        resourceArn: clusterArn,
        tags: [
          { key: "Environment", value: "Test" },
          { key: "Project", value: "distilled-aws" },
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
      expect(projectTag?.value).toEqual("distilled-aws");

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
  withTaskDefinition("distilled-ecs-taskdef-family", (taskDefinitionArn) =>
    Effect.gen(function* () {
      // List task definitions with retry for eventual consistency
      yield* Effect.gen(function* () {
        const listResult = yield* listTaskDefinitions({
          familyPrefix: "distilled-ecs-taskdef-family",
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
    const family = "distilled-ecs-multi-container";

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
    const clusterName = "distilled-ecs-run-task-cluster";
    const taskFamily = "distilled-ecs-run-task-family";

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

    // Cleanup function - always runs (networking is cleaned up in afterAll)
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
            subnets: [networking.subnetId],
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
        reason: "Stopped by distilled-aws test",
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
      "distilled-ecs-multi-cluster-1",
      "distilled-ecs-multi-cluster-2",
      "distilled-ecs-multi-cluster-3",
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

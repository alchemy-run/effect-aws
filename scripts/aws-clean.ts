#!/usr/bin/env bun
/**
 * AWS Account Cleanup Script
 *
 * Finds and deletes AWS resources across multiple services:
 * - S3 buckets (empties them first)
 * - Lambda functions
 * - ECS clusters (with services and tasks)
 * - SQS queues
 * - SNS topics
 * - DynamoDB tables
 * - API Gateway REST APIs
 * - API Gateway V2 HTTP/WebSocket APIs
 * - AppSync GraphQL APIs (with resolvers and data sources)
 * - EC2 instances
 * - Elastic IPs
 * - Network interfaces
 * - VPCs (with dependencies in correct deletion order):
 *   - VPC Endpoints
 *   - NAT Gateways (waits for deletion)
 *   - VPN Connections
 *   - VPN Gateways (detach + delete)
 *   - VPC Peering Connections
 *   - Transit Gateway VPC Attachments
 *   - Internet Gateways (detach + delete)
 *   - Egress-Only Internet Gateways
 *   - Carrier Gateways (Wavelength zones)
 *   - Network Interfaces
 *   - Subnets
 *   - Route Tables (except main)
 *   - Network ACLs (except default)
 *   - Security Groups (except default)
 * - IAM roles (optionally, with --iam flag)
 *
 * Cleans resources in: us-east-1, us-west-2
 * IAM is global and cleaned once.
 *
 * Usage:
 *   bun aws:clean                    # Clean against real AWS
 *   LOCAL=1 bun aws:clean            # Clean against LocalStack
 *   bun aws:clean --dry-run          # Show what would be deleted
 *   bun aws:clean --iam              # Also clean IAM roles (dangerous!)
 *   bun aws:clean --prefix itty      # Only delete resources with this prefix
 */

import { Command, Options } from "@effect/cli";
import { FetchHttpClient } from "@effect/platform";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import {
  Chunk,
  Console,
  Effect,
  Layer,
  Logger,
  LogLevel,
  Option,
  Ref,
  Schedule,
  Stream,
} from "effect";
import * as Credentials from "../src/credentials.ts";
import { Endpoint } from "../src/endpoint.ts";
import { Region } from "../src/region.ts";
import * as Retry from "../src/retry.ts";

// Service imports
import { deleteRestApi, getRestApis } from "../src/services/api-gateway.ts";
import {
  deleteApi as deleteApiV2,
  getApis as getApisV2,
} from "../src/services/apigatewayv2.ts";
import {
  deleteDataSource,
  deleteGraphqlApi,
  deleteResolver,
  listDataSources,
  listGraphqlApis,
  listResolvers,
  listTypes,
} from "../src/services/appsync.ts";
import { deleteTable, listTables } from "../src/services/dynamodb.ts";
import {
  deleteCarrierGateway,
  deleteEgressOnlyInternetGateway,
  deleteInternetGateway,
  deleteNatGateway,
  deleteNetworkAcl,
  deleteNetworkInterface,
  deleteRouteTable,
  deleteSecurityGroup,
  deleteSubnet,
  deleteTransitGatewayVpcAttachment,
  deleteVpc,
  deleteVpcEndpoints,
  deleteVpcPeeringConnection,
  deleteVpnConnection,
  deleteVpnGateway,
  describeAddresses,
  describeCarrierGateways,
  describeEgressOnlyInternetGateways,
  describeInstances,
  describeInternetGateways,
  describeNatGateways,
  describeNetworkAcls,
  describeNetworkInterfaces,
  describeRouteTables,
  describeSecurityGroups,
  describeSubnets,
  describeTransitGatewayVpcAttachments,
  describeVpcEndpoints,
  describeVpcPeeringConnections,
  describeVpcs,
  describeVpnConnections,
  describeVpnGateways,
  detachInternetGateway,
  detachVpnGateway,
  disassociateRouteTable,
  releaseAddress,
  terminateInstances,
} from "../src/services/ec2.ts";
import {
  deleteCluster,
  deleteService,
  deregisterTaskDefinition,
  listClusters,
  listServices,
  listTaskDefinitions,
  listTasks,
  stopTask,
  updateService,
} from "../src/services/ecs.ts";
import {
  deleteRole,
  deleteRolePolicy,
  detachRolePolicy,
  listAttachedRolePolicies,
  listRolePolicies,
  listRoles,
} from "../src/services/iam.ts";
import { deleteFunction, listFunctions } from "../src/services/lambda.ts";
import {
  deleteBucket,
  deleteObject,
  deleteObjects,
  listBuckets,
  listObjectsV2,
  listObjectVersions,
} from "../src/services/s3.ts";
import { deleteTopic, listTopics } from "../src/services/sns.ts";
import { deleteQueue, listQueues } from "../src/services/sqs.ts";

// ============================================================================
// CLI Options
// ============================================================================

const dryRunOption = Options.boolean("dry-run").pipe(
  Options.withDescription(
    "Show what would be deleted without actually deleting",
  ),
  Options.withDefault(false),
);

const iamOption = Options.boolean("iam").pipe(
  Options.withDescription("Also delete IAM roles (use with caution!)"),
  Options.withDefault(false),
);

const prefixOption = Options.text("prefix").pipe(
  Options.withDescription(
    "Only delete resources with names starting with this prefix",
  ),
  Options.optional,
);

// ============================================================================
// Configuration Context
// ============================================================================

interface CleanupConfig {
  readonly dryRun: boolean;
  readonly cleanIam: boolean;
  readonly prefix: string;
}

const CleanupConfig = Ref.unsafeMake<CleanupConfig>({
  dryRun: false,
  cleanIam: false,
  prefix: "",
});

const getConfig = Ref.get(CleanupConfig);

// ============================================================================
// Helper functions
// ============================================================================

const log = (emoji: string, message: string) =>
  Console.log(`${emoji} ${message}`);

const warn = (message: string) => Console.warn(`⚠️  ${message}`);

const matchesPrefix = (prefix: string, name: string | undefined): boolean => {
  if (!prefix) return true;
  return name?.startsWith(prefix) ?? false;
};

// ============================================================================
// S3 Cleanup
// ============================================================================

const emptyBucket = (bucket: string) =>
  Effect.gen(function* () {
    // Delete all object versions (for versioned buckets)
    let versionKeyMarker: string | undefined;
    let versionIdMarker: string | undefined;
    do {
      const versions = yield* listObjectVersions({
        Bucket: bucket,
        KeyMarker: versionKeyMarker,
        VersionIdMarker: versionIdMarker,
      });

      const toDelete = [
        ...(versions.Versions ?? []).map((v) => ({
          Key: v.Key!,
          VersionId: v.VersionId,
        })),
        ...(versions.DeleteMarkers ?? []).map((d) => ({
          Key: d.Key!,
          VersionId: d.VersionId,
        })),
      ];

      if (toDelete.length > 0) {
        yield* deleteObjects({
          Bucket: bucket,
          Delete: { Objects: toDelete },
        });
        yield* log("  🗑️", `Deleted ${toDelete.length} object versions`);
      }

      versionKeyMarker = versions.NextKeyMarker;
      versionIdMarker = versions.NextVersionIdMarker;
    } while (versionKeyMarker);

    // Delete regular objects (for non-versioned buckets) using pagination stream
    const objects = yield* listObjectsV2.pages({ Bucket: bucket }).pipe(
      Stream.flatMap((page) => Stream.fromIterable(page.Contents ?? [])),
      Stream.runCollect,
    );

    for (const obj of objects) {
      if (obj.Key) {
        yield* deleteObject({ Bucket: bucket, Key: obj.Key });
      }
    }

    if (objects.length > 0) {
      yield* log("  🗑️", `Deleted ${objects.length} objects`);
    }
  });

/**
 * Process a single bucket, handling cross-region redirects.
 * If PermanentRedirect is received, retry with the correct region.
 */
const processBucket = (bucket: string) =>
  Effect.gen(function* () {
    yield* emptyBucket(bucket);
    yield* deleteBucket({ Bucket: bucket });
  }).pipe(
    Effect.catchTag("PermanentRedirect", (err) =>
      Effect.gen(function* () {
        if (!err.BucketRegion) {
          return yield* Effect.fail(err);
        }
        yield* warn(
          `Bucket ${bucket} is in region ${err.BucketRegion}, retrying...`,
        );
        yield* emptyBucket(bucket).pipe(
          Effect.provideService(Region, err.BucketRegion),
        );
        yield* deleteBucket({ Bucket: bucket }).pipe(
          Effect.provideService(Region, err.BucketRegion),
        );
      }),
    ),
  );

const cleanS3 = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("📦", "Cleaning S3 buckets...");

  const buckets = yield* listBuckets({});
  const toDelete = (buckets.Buckets ?? []).filter((b) =>
    matchesPrefix(prefix, b.Name),
  );

  if (toDelete.length === 0) {
    yield* log("  ✓", "No S3 buckets to delete");
    return;
  }

  for (const bucket of toDelete) {
    if (!bucket.Name) continue;

    if (dryRun) {
      yield* log("  📋", `Would delete bucket: ${bucket.Name}`);
    } else {
      yield* log("  🗑️", `Deleting bucket: ${bucket.Name}`);
      yield* processBucket(bucket.Name);
    }
  }

  yield* log("  ✓", `Processed ${toDelete.length} S3 buckets`);
});

// ============================================================================
// API Gateway Cleanup
// ============================================================================

const cleanAPIGateway = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("🌐", "Cleaning API Gateway REST APIs...");

  // Collect all APIs using pagination stream
  const toDelete = yield* getRestApis.pages({}).pipe(
    Stream.flatMap((page) => Stream.fromIterable(page.items ?? [])),
    Stream.filter(
      (api) => !!api.id && !!api.name && matchesPrefix(prefix, api.name),
    ),
    Stream.map((api) => ({ id: api.id!, name: api.name! })),
    Stream.runCollect,
  );

  if (toDelete.length === 0) {
    yield* log("  ✓", "No API Gateway REST APIs to delete");
    return;
  }

  // Delete all collected APIs
  for (const api of toDelete) {
    if (dryRun) {
      yield* log("  📋", `Would delete REST API: ${api.name} (${api.id})`);
    } else {
      yield* log("  🗑️", `Deleting REST API: ${api.name} (${api.id})`);
      yield* deleteRestApi({ restApiId: api.id });
    }
  }

  yield* log("  ✓", `Processed ${toDelete.length} API Gateway REST APIs`);
});

// ============================================================================
// API Gateway V2 Cleanup (HTTP and WebSocket APIs)
// ============================================================================

const cleanAPIGatewayV2 = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("🌐", "Cleaning API Gateway V2 (HTTP/WebSocket) APIs...");

  // Collect all APIs (manual pagination - no paginated trait)
  const toDelete: Array<{ id: string; name: string }> = [];
  let nextToken: string | undefined;

  do {
    const apis = yield* getApisV2({ NextToken: nextToken });

    for (const api of apis.Items ?? []) {
      if (!api.ApiId || !api.Name) continue;
      if (!matchesPrefix(prefix, api.Name)) continue;
      toDelete.push({ id: api.ApiId, name: api.Name });
    }

    nextToken = apis.NextToken;
  } while (nextToken);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No API Gateway V2 APIs to delete");
    return;
  }

  // Delete all collected APIs
  for (const api of toDelete) {
    if (dryRun) {
      yield* log("  📋", `Would delete API: ${api.name} (${api.id})`);
    } else {
      yield* log("  🗑️", `Deleting API: ${api.name} (${api.id})`);
      yield* deleteApiV2({ ApiId: api.id });
    }
  }

  yield* log("  ✓", `Processed ${toDelete.length} API Gateway V2 APIs`);
});

// ============================================================================
// AppSync Cleanup
// ============================================================================

const cleanAppSync = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("📊", "Cleaning AppSync GraphQL APIs...");

  // Collect all APIs (manual pagination - no paginated trait)
  const toDelete: Array<{ apiId: string; name: string }> = [];
  let nextToken: string | undefined;

  do {
    const apis = yield* listGraphqlApis({ nextToken });

    for (const api of apis.graphqlApis ?? []) {
      if (!api.apiId || !api.name) continue;
      if (!matchesPrefix(prefix, api.name)) continue;
      toDelete.push({ apiId: api.apiId, name: api.name });
    }

    nextToken = apis.nextToken;
  } while (nextToken);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No AppSync GraphQL APIs to delete");
    return;
  }

  // Delete all collected APIs
  for (const api of toDelete) {
    if (dryRun) {
      yield* log(
        "  📋",
        `Would delete GraphQL API: ${api.name} (${api.apiId})`,
      );
      continue;
    }

    yield* log("  🗑️", `Deleting GraphQL API: ${api.name} (${api.apiId})`);

    // 1. Delete resolvers for each type
    const types = yield* listTypes({ apiId: api.apiId, format: "SDL" });

    for (const type of types.types ?? []) {
      if (!type.name) continue;

      const resolvers = yield* listResolvers({
        apiId: api.apiId,
        typeName: type.name,
      });

      for (const resolver of resolvers.resolvers ?? []) {
        if (resolver.fieldName) {
          yield* deleteResolver({
            apiId: api.apiId,
            typeName: type.name,
            fieldName: resolver.fieldName,
          });
        }
      }
    }

    // 2. Delete all data sources
    const dataSources = yield* listDataSources({ apiId: api.apiId });

    for (const ds of dataSources.dataSources ?? []) {
      if (ds.name) {
        yield* log("    🗑️", `Deleting data source: ${ds.name}`);
        yield* deleteDataSource({ apiId: api.apiId, name: ds.name });
      }
    }

    // 3. Delete the GraphQL API
    yield* deleteGraphqlApi({ apiId: api.apiId });
  }

  yield* log("  ✓", `Processed ${toDelete.length} AppSync GraphQL APIs`);
});

// ============================================================================
// Lambda Cleanup
// ============================================================================

const cleanLambda = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("λ", "Cleaning Lambda functions...");

  // Collect all functions using pagination stream
  const toDelete = yield* listFunctions.pages({}).pipe(
    Stream.flatMap((page) => Stream.fromIterable(page.Functions ?? [])),
    Stream.filter(
      (fn) => !!fn.FunctionName && matchesPrefix(prefix, fn.FunctionName),
    ),
    Stream.map((fn) => fn.FunctionName!),
    Stream.runCollect,
  );

  if (toDelete.length === 0) {
    yield* log("  ✓", "No Lambda functions to delete");
    return;
  }

  // Delete all collected functions
  for (const functionName of toDelete) {
    if (dryRun) {
      yield* log("  📋", `Would delete function: ${functionName}`);
    } else {
      yield* log("  🗑️", `Deleting function: ${functionName}`);
      yield* deleteFunction({ FunctionName: functionName });
    }
  }

  yield* log("  ✓", `Processed ${toDelete.length} Lambda functions`);
});

// ============================================================================
// ECS Cleanup
// ============================================================================

const cleanECSTaskDefinitions = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("📋", "Cleaning ECS task definitions...");

  // Collect all task definitions using pagination stream
  const toDelete = yield* listTaskDefinitions.pages({}).pipe(
    Stream.flatMap((page) =>
      Stream.fromIterable(page.taskDefinitionArns ?? []),
    ),
    Stream.map((taskDefArn) => {
      // Extract family name from ARN: arn:aws:ecs:region:account:task-definition/family:revision
      const familyWithRevision = taskDefArn.split("/").pop() ?? "";
      const family = familyWithRevision.split(":")[0];
      return { arn: taskDefArn, display: familyWithRevision, family };
    }),
    Stream.filter(({ family }) => matchesPrefix(prefix, family)),
    Stream.runCollect,
  );

  if (toDelete.length === 0) {
    yield* log("  ✓", "No ECS task definitions to delete");
    return;
  }

  // Delete all collected task definitions
  for (const taskDef of toDelete) {
    if (dryRun) {
      yield* log(
        "  📋",
        `Would deregister task definition: ${taskDef.display}`,
      );
    } else {
      yield* log("  🗑️", `Deregistering task definition: ${taskDef.display}`);
      yield* deregisterTaskDefinition({ taskDefinition: taskDef.arn });
    }
  }

  yield* log("  ✓", `Processed ${toDelete.length} ECS task definitions`);
});

const cleanECSClusters = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("🐳", "Cleaning ECS clusters...");

  // Collect all clusters using pagination stream
  const toDelete = yield* listClusters.pages({}).pipe(
    Stream.flatMap((page) => Stream.fromIterable(page.clusterArns ?? [])),
    Stream.map((clusterArn) => ({
      arn: clusterArn,
      name: clusterArn.split("/").pop() ?? "",
    })),
    Stream.filter(({ name }) => matchesPrefix(prefix, name)),
    Stream.runCollect,
  );

  if (toDelete.length === 0) {
    yield* log("  ✓", "No ECS clusters to delete");
    return;
  }

  // Delete all collected clusters
  for (const cluster of toDelete) {
    if (dryRun) {
      yield* log("  📋", `Would delete cluster: ${cluster.name}`);
      continue;
    }

    yield* log("  🗑️", `Deleting cluster: ${cluster.name}`);

    // Stop all running tasks using pagination stream
    const tasks = yield* listTasks.pages({ cluster: cluster.arn }).pipe(
      Stream.flatMap((page) => Stream.fromIterable(page.taskArns ?? [])),
      Stream.runCollect,
    );

    for (const taskArn of tasks) {
      yield* stopTask({
        cluster: cluster.arn,
        task: taskArn,
        reason: "Cleanup script",
      });
    }

    // Delete all services using pagination stream
    const services = yield* listServices.pages({ cluster: cluster.arn }).pipe(
      Stream.flatMap((page) => Stream.fromIterable(page.serviceArns ?? [])),
      Stream.runCollect,
    );

    for (const serviceArn of services) {
      // Scale down to 0 first
      yield* updateService({
        cluster: cluster.arn,
        service: serviceArn,
        desiredCount: 0,
      });

      yield* deleteService({
        cluster: cluster.arn,
        service: serviceArn,
        force: true,
      });
    }

    // Delete the cluster
    yield* deleteCluster({ cluster: cluster.arn });
  }

  yield* log("  ✓", `Processed ${toDelete.length} ECS clusters`);
});

const cleanECS = Effect.gen(function* () {
  yield* cleanECSClusters;
  yield* cleanECSTaskDefinitions;
});

// ============================================================================
// SQS Cleanup
// ============================================================================

const cleanSQS = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("📨", "Cleaning SQS queues...");

  // Collect all queues using pagination stream
  const toDelete = yield* listQueues
    .pages({ QueueNamePrefix: prefix || undefined })
    .pipe(
      Stream.flatMap((page) => Stream.fromIterable(page.QueueUrls ?? [])),
      Stream.map((queueUrl) => ({
        url: queueUrl,
        name: queueUrl.split("/").pop() ?? "",
      })),
      Stream.runCollect,
    );

  if (toDelete.length === 0) {
    yield* log("  ✓", "No SQS queues to delete");
    return;
  }

  // Delete all collected queues
  for (const queue of toDelete) {
    if (dryRun) {
      yield* log("  📋", `Would delete queue: ${queue.name}`);
    } else {
      yield* log("  🗑️", `Deleting queue: ${queue.name}`);
      yield* deleteQueue({ QueueUrl: queue.url });
    }
  }

  yield* log("  ✓", `Processed ${toDelete.length} SQS queues`);
});

// ============================================================================
// SNS Cleanup
// ============================================================================

const cleanSNS = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("📢", "Cleaning SNS topics...");

  // Collect all topics using pagination stream
  const toDelete = yield* listTopics.pages({}).pipe(
    Stream.flatMap((page) => Stream.fromIterable(page.Topics ?? [])),
    Stream.filter((topic) => !!topic.TopicArn),
    Stream.map((topic) => ({
      arn: topic.TopicArn!,
      name: topic.TopicArn!.split(":").pop() ?? "",
    })),
    Stream.filter(({ name }) => matchesPrefix(prefix, name)),
    Stream.runCollect,
  );

  if (toDelete.length === 0) {
    yield* log("  ✓", "No SNS topics to delete");
    return;
  }

  // Delete all collected topics
  for (const topic of toDelete) {
    if (dryRun) {
      yield* log("  📋", `Would delete topic: ${topic.name}`);
    } else {
      yield* log("  🗑️", `Deleting topic: ${topic.name}`);
      yield* deleteTopic({ TopicArn: topic.arn });
    }
  }

  yield* log("  ✓", `Processed ${toDelete.length} SNS topics`);
});

// ============================================================================
// DynamoDB Cleanup
// ============================================================================

const cleanDynamoDB = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("🗃️", "Cleaning DynamoDB tables...");

  // Collect all tables using pagination stream
  const toDelete = yield* listTables.pages({}).pipe(
    Stream.flatMap((page) => Stream.fromIterable(page.TableNames ?? [])),
    Stream.filter((tableName) => matchesPrefix(prefix, tableName)),
    Stream.runCollect,
  );

  if (toDelete.length === 0) {
    yield* log("  ✓", "No DynamoDB tables to delete");
    return;
  }

  // Delete all collected tables
  for (const tableName of toDelete) {
    if (dryRun) {
      yield* log("  📋", `Would delete table: ${tableName}`);
    } else {
      yield* log("  🗑️", `Deleting table: ${tableName}`);
      yield* deleteTable({ TableName: tableName });
    }
  }

  yield* log("  ✓", `Processed ${toDelete.length} DynamoDB tables`);
});

// ============================================================================
// EC2 Instances Cleanup
// ============================================================================

const cleanEC2Instances = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("💻", "Cleaning EC2 instances...");

  // Collect all instances (manual pagination)
  const toTerminate: Array<{ instanceId: string; nameTag: string }> = [];
  let nextToken: string | undefined;

  do {
    const result = yield* describeInstances({ NextToken: nextToken });

    for (const reservation of result.Reservations ?? []) {
      for (const instance of reservation.Instances ?? []) {
        if (!instance.InstanceId) continue;

        // Skip terminated instances
        if (instance.State?.Name === "terminated") continue;

        // Check prefix against instance name tag
        const nameTag =
          instance.Tags?.find((t) => t.Key === "Name")?.Value ?? "";
        if (
          !matchesPrefix(prefix, nameTag) &&
          !matchesPrefix(prefix, instance.InstanceId)
        )
          continue;

        toTerminate.push({ instanceId: instance.InstanceId, nameTag });
      }
    }

    nextToken = result.NextToken;
  } while (nextToken);

  if (toTerminate.length === 0) {
    yield* log("  ✓", "No EC2 instances to terminate");
    return;
  }

  // Terminate all collected instances
  const instanceIds = toTerminate.map((i) => i.instanceId);

  if (dryRun) {
    for (const instance of toTerminate) {
      yield* log(
        "  📋",
        `Would terminate instance: ${instance.instanceId} (${instance.nameTag})`,
      );
    }
  } else {
    yield* log(
      "  🗑️",
      `Terminating ${instanceIds.length} instances: ${instanceIds.join(", ")}`,
    );
    yield* terminateInstances({ InstanceIds: instanceIds });
  }

  yield* log("  ✓", `Processed ${toTerminate.length} EC2 instances`);
});

// ============================================================================
// Elastic IPs Cleanup
// ============================================================================

const cleanElasticIPs = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("🌐", "Cleaning Elastic IPs...");

  // Get all addresses (no pagination for DescribeAddresses)
  const result = yield* describeAddresses({});

  const toRelease = (result.Addresses ?? []).filter((addr) => {
    if (!addr.AllocationId) return false;

    // Check prefix against name tag or allocation ID
    const nameTag = addr.Tags?.find((t) => t.Key === "Name")?.Value ?? "";
    return (
      matchesPrefix(prefix, nameTag) ||
      matchesPrefix(prefix, addr.AllocationId) ||
      matchesPrefix(prefix, addr.PublicIp)
    );
  });

  if (toRelease.length === 0) {
    yield* log("  ✓", "No Elastic IPs to release");
    return;
  }

  // Release all collected addresses
  for (const addr of toRelease) {
    if (!addr.AllocationId) continue;

    const nameTag = addr.Tags?.find((t) => t.Key === "Name")?.Value ?? "";
    const display = nameTag || addr.PublicIp || addr.AllocationId;

    if (dryRun) {
      yield* log("  📋", `Would release Elastic IP: ${display}`);
    } else {
      yield* log("  🗑️", `Releasing Elastic IP: ${display}`);
      yield* releaseAddress({ AllocationId: addr.AllocationId });
    }
  }

  yield* log("  ✓", `Processed ${toRelease.length} Elastic IPs`);
});

// ============================================================================
// Network Interfaces Cleanup
// ============================================================================

const cleanNetworkInterfaces = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("🔌", "Cleaning Network Interfaces...");

  // Collect all network interfaces (manual pagination)
  const toDelete: Array<{ networkInterfaceId: string; description: string }> =
    [];
  let nextToken: string | undefined;

  do {
    const result = yield* describeNetworkInterfaces({ NextToken: nextToken });

    for (const eni of result.NetworkInterfaces ?? []) {
      if (!eni.NetworkInterfaceId) continue;

      // Skip attached interfaces (can't delete while attached)
      if (eni.Attachment?.Status === "attached") continue;

      // Check prefix against name tag or description
      const nameTag = eni.TagSet?.find((t) => t.Key === "Name")?.Value ?? "";
      const description = eni.Description ?? "";

      if (
        !matchesPrefix(prefix, nameTag) &&
        !matchesPrefix(prefix, description) &&
        !matchesPrefix(prefix, eni.NetworkInterfaceId)
      )
        continue;

      toDelete.push({
        networkInterfaceId: eni.NetworkInterfaceId,
        description: nameTag || description || eni.NetworkInterfaceId,
      });
    }

    nextToken = result.NextToken;
  } while (nextToken);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No Network Interfaces to delete");
    return;
  }

  // Delete all collected network interfaces
  for (const eni of toDelete) {
    if (dryRun) {
      yield* log(
        "  📋",
        `Would delete Network Interface: ${eni.networkInterfaceId} (${eni.description})`,
      );
    } else {
      yield* log(
        "  🗑️",
        `Deleting Network Interface: ${eni.networkInterfaceId} (${eni.description})`,
      );
      yield* deleteNetworkInterface({
        NetworkInterfaceId: eni.networkInterfaceId,
      });
    }
  }

  yield* log("  ✓", `Processed ${toDelete.length} Network Interfaces`);
});

// ============================================================================
// VPC Cleanup (most complex due to dependencies)
// ============================================================================

/**
 * Wait for all NAT Gateways in a VPC to be deleted.
 * NAT Gateways take time to delete (can take several minutes).
 */
const waitForNatGatewaysDeletion = (vpcId: string) =>
  Effect.gen(function* () {
    const checkDeleted = Effect.gen(function* () {
      const natGateways = yield* describeNatGateways({
        Filter: [
          { Name: "vpc-id", Values: [vpcId] },
          { Name: "state", Values: ["pending", "available", "deleting"] },
        ],
      });

      const pending = (natGateways.NatGateways ?? []).filter(
        (nat) => nat.State !== "deleted",
      );

      if (pending.length > 0) {
        yield* Effect.fail(
          new Error(`Waiting for ${pending.length} NAT Gateways to delete`),
        );
      }
    });

    yield* checkDeleted.pipe(
      Effect.retry(
        Schedule.exponential("2 seconds").pipe(
          Schedule.union(Schedule.spaced("30 seconds")),
          Schedule.intersect(Schedule.recurs(20)), // Max ~5 minutes
        ),
      ),
      Effect.catchAll(() =>
        warn("NAT Gateways still deleting, continuing anyway..."),
      ),
    );
  });

/**
 * Delete a single VPC and all its dependencies in the correct order.
 * Handles DependencyViolation with retries.
 */
const deleteVpcWithDependencies = (vpcId: string, nameTag: string) =>
  Effect.gen(function* () {
    yield* log("  🗑️", `Deleting VPC: ${vpcId} (${nameTag})`);

    // 1. Delete VPC Endpoints
    const vpcEndpoints = yield* describeVpcEndpoints
      .pages({
        Filters: [{ Name: "vpc-id", Values: [vpcId] }],
      })
      .pipe(
        Stream.flatMap((page) => Stream.fromIterable(page.VpcEndpoints ?? [])),
        Stream.runCollect,
        Effect.map(Chunk.toArray),
      );

    const endpointIds = vpcEndpoints
      .map((ep) => ep.VpcEndpointId)
      .filter((id): id is string => !!id);

    if (endpointIds.length > 0) {
      yield* log("    🗑️", `Deleting ${endpointIds.length} VPC Endpoints...`);
      yield* deleteVpcEndpoints({ VpcEndpointIds: endpointIds });
    }

    // 2. Delete NAT Gateways (initiate deletion)
    const natGateways = yield* describeNatGateways({
      Filter: [{ Name: "vpc-id", Values: [vpcId] }],
    });

    for (const nat of natGateways.NatGateways ?? []) {
      if (nat.NatGatewayId && nat.State !== "deleted") {
        yield* log("    🗑️", `Deleting NAT Gateway: ${nat.NatGatewayId}`);
        yield* deleteNatGateway({ NatGatewayId: nat.NatGatewayId });
      }
    }

    // 3. Wait for NAT Gateways to be fully deleted (they block subnet deletion)
    if ((natGateways.NatGateways ?? []).length > 0) {
      yield* log("    ⏳", "Waiting for NAT Gateways to be deleted...");
      yield* waitForNatGatewaysDeletion(vpcId);
    }

    // 4. Get VPN Gateways attached to this VPC (exclude deleted ones)
    const vpnGateways = yield* describeVpnGateways({
      Filters: [
        { Name: "attachment.vpc-id", Values: [vpcId] },
        { Name: "state", Values: ["pending", "available"] },
      ],
    });

    // 5. Delete VPN Connections for each VPN Gateway (must be done before detaching)
    for (const vgw of vpnGateways.VpnGateways ?? []) {
      if (!vgw.VpnGatewayId) continue;

      const vpnConnections = yield* describeVpnConnections({
        Filters: [{ Name: "vpn-gateway-id", Values: [vgw.VpnGatewayId] }],
      });

      for (const vpnConn of vpnConnections.VpnConnections ?? []) {
        if (vpnConn.VpnConnectionId && vpnConn.State !== "deleted") {
          yield* log(
            "    🗑️",
            `Deleting VPN Connection: ${vpnConn.VpnConnectionId}`,
          );
          yield* deleteVpnConnection({
            VpnConnectionId: vpnConn.VpnConnectionId,
          });
        }
      }
    }

    // 6. Detach and delete VPN Gateways
    for (const vgw of vpnGateways.VpnGateways ?? []) {
      if (!vgw.VpnGatewayId) continue;

      // Skip deleted/deleting gateways
      if (vgw.State === "deleted" || vgw.State === "deleting") {
        yield* log(
          "    ⚠️",
          `VPN Gateway ${vgw.VpnGatewayId} already ${vgw.State}, skipping`,
        );
        continue;
      }

      // Check if actually attached to this VPC
      const attachment = vgw.VpcAttachments?.find((a) => a.VpcId === vpcId);
      if (attachment?.State === "attached") {
        yield* log("    🗑️", `Detaching VPN Gateway: ${vgw.VpnGatewayId}`);
        yield* detachVpnGateway({
          VpnGatewayId: vgw.VpnGatewayId,
          VpcId: vpcId,
        }).pipe(
          Effect.catchTag("IncorrectState", () =>
            log(
              "    ⚠️",
              `VPN Gateway ${vgw.VpnGatewayId} not in attachable state, skipping detach`,
            ),
          ),
          Effect.catchTag("DependencyViolation", () =>
            log(
              "    ⚠️",
              `VPN Gateway ${vgw.VpnGatewayId} has dependencies, skipping detach`,
            ),
          ),
          Effect.catchTag("InvalidVpnGatewayID.NotFound", () =>
            log(
              "    ⚠️",
              `VPN Gateway ${vgw.VpnGatewayId} not found, already deleted`,
            ),
          ),
        );
      } else {
        yield* log(
          "    ⚠️",
          `VPN Gateway ${vgw.VpnGatewayId} not attached (state: ${attachment?.State ?? "none"})`,
        );
      }

      yield* deleteVpnGateway({ VpnGatewayId: vgw.VpnGatewayId }).pipe(
        Effect.catchTag("IncorrectState", () =>
          log(
            "    ⚠️",
            `VPN Gateway ${vgw.VpnGatewayId} not in deletable state, skipping`,
          ),
        ),
        Effect.catchTag("InvalidVpnGatewayID.NotFound", () =>
          log(
            "    ⚠️",
            `VPN Gateway ${vgw.VpnGatewayId} not found, already deleted`,
          ),
        ),
      );
    }

    // 7. Delete VPC Peering Connections (as requester)
    const peeringAsRequester = yield* describeVpcPeeringConnections
      .pages({
        Filters: [{ Name: "requester-vpc-info.vpc-id", Values: [vpcId] }],
      })
      .pipe(
        Stream.flatMap((page) =>
          Stream.fromIterable(page.VpcPeeringConnections ?? []),
        ),
        Stream.runCollect,
      );

    for (const peering of peeringAsRequester) {
      if (
        peering.VpcPeeringConnectionId &&
        peering.Status?.Code !== "deleted"
      ) {
        yield* log(
          "    🗑️",
          `Deleting VPC Peering: ${peering.VpcPeeringConnectionId}`,
        );
        yield* deleteVpcPeeringConnection({
          VpcPeeringConnectionId: peering.VpcPeeringConnectionId,
        });
      }
    }

    // 7. Delete VPC Peering Connections (as accepter)
    const peeringAsAccepter = yield* describeVpcPeeringConnections
      .pages({
        Filters: [{ Name: "accepter-vpc-info.vpc-id", Values: [vpcId] }],
      })
      .pipe(
        Stream.flatMap((page) =>
          Stream.fromIterable(page.VpcPeeringConnections ?? []),
        ),
        Stream.runCollect,
      );

    for (const peering of peeringAsAccepter) {
      if (
        peering.VpcPeeringConnectionId &&
        peering.Status?.Code !== "deleted"
      ) {
        yield* log(
          "    🗑️",
          `Deleting VPC Peering: ${peering.VpcPeeringConnectionId}`,
        );
        yield* deleteVpcPeeringConnection({
          VpcPeeringConnectionId: peering.VpcPeeringConnectionId,
        });
      }
    }

    // 8. Delete Transit Gateway VPC Attachments
    const tgwAttachments = yield* describeTransitGatewayVpcAttachments
      .pages({
        Filters: [{ Name: "vpc-id", Values: [vpcId] }],
      })
      .pipe(
        Stream.flatMap((page) =>
          Stream.fromIterable(page.TransitGatewayVpcAttachments ?? []),
        ),
        Stream.runCollect,
        Effect.map(Chunk.toArray),
      );

    for (const attachment of tgwAttachments) {
      if (
        attachment.TransitGatewayAttachmentId &&
        attachment.State !== "deleted" &&
        attachment.State !== "deleting"
      ) {
        yield* log(
          "    🗑️",
          `Deleting Transit Gateway Attachment: ${attachment.TransitGatewayAttachmentId}`,
        );
        yield* deleteTransitGatewayVpcAttachment({
          TransitGatewayAttachmentId: attachment.TransitGatewayAttachmentId,
        });
      }
    }

    // 9. Detach and delete Internet Gateways
    const igws = yield* describeInternetGateways({
      Filters: [{ Name: "attachment.vpc-id", Values: [vpcId] }],
    });

    yield* log(
      "    ℹ️",
      `Found ${igws.InternetGateways?.length ?? 0} internet gateways`,
    );

    for (const igw of igws.InternetGateways ?? []) {
      if (igw.InternetGatewayId) {
        yield* log("    🗑️", `Detaching IGW: ${igw.InternetGatewayId}`);
        yield* detachInternetGateway({
          InternetGatewayId: igw.InternetGatewayId,
          VpcId: vpcId,
        });
        yield* deleteInternetGateway({
          InternetGatewayId: igw.InternetGatewayId,
        });
      }
    }

    // 9. Delete Egress-Only Internet Gateways (IPv6)
    const eigws = yield* describeEgressOnlyInternetGateways.pages({}).pipe(
      Stream.flatMap((page) =>
        Stream.fromIterable(page.EgressOnlyInternetGateways ?? []),
      ),
      Stream.filter((eigw) => eigw.Attachments?.some((a) => a.VpcId === vpcId)),
      Stream.runCollect,
      Effect.map(Chunk.toArray),
    );

    for (const eigw of eigws) {
      if (eigw.EgressOnlyInternetGatewayId) {
        yield* log(
          "    🗑️",
          `Deleting Egress-Only IGW: ${eigw.EgressOnlyInternetGatewayId}`,
        );
        yield* deleteEgressOnlyInternetGateway({
          EgressOnlyInternetGatewayId: eigw.EgressOnlyInternetGatewayId,
        });
      }
    }

    // 10. Delete Carrier Gateways (Wavelength zones)
    const carrierGateways = yield* describeCarrierGateways
      .pages({
        Filters: [{ Name: "vpc-id", Values: [vpcId] }],
      })
      .pipe(
        Stream.flatMap((page) =>
          Stream.fromIterable(page.CarrierGateways ?? []),
        ),
        Stream.runCollect,
        Effect.map(Chunk.toArray),
      );

    yield* log("    ℹ️", `Found ${carrierGateways.length} carrier gateways`);

    for (const cgw of carrierGateways) {
      if (cgw.CarrierGatewayId) {
        yield* log(
          "    🗑️",
          `Deleting Carrier Gateway: ${cgw.CarrierGatewayId}`,
        );
        yield* deleteCarrierGateway({
          CarrierGatewayId: cgw.CarrierGatewayId,
        });
      }
    }

    // 11. Delete Network Interfaces (detached ones only)
    const enis = yield* describeNetworkInterfaces
      .pages({
        Filters: [{ Name: "vpc-id", Values: [vpcId] }],
      })
      .pipe(
        Stream.flatMap((page) =>
          Stream.fromIterable(page.NetworkInterfaces ?? []),
        ),
        Stream.runCollect,
      );

    yield* log("    ℹ️", `Found ${enis.length} network interfaces`);

    for (const eni of enis) {
      if (!eni.NetworkInterfaceId) continue;
      // Skip attached interfaces (can't delete while attached)
      if (eni.Attachment?.Status === "attached") {
        yield* log(
          "    ⚠️",
          `Skipping attached ENI: ${eni.NetworkInterfaceId} (${eni.Description ?? "no description"})`,
        );
        continue;
      }

      yield* log(
        "    🗑️",
        `Deleting Network Interface: ${eni.NetworkInterfaceId}`,
      );
      yield* deleteNetworkInterface({
        NetworkInterfaceId: eni.NetworkInterfaceId,
      });
    }

    // 10. Delete Subnets (with retry for DependencyViolation)
    const subnets = yield* describeSubnets({
      Filters: [{ Name: "vpc-id", Values: [vpcId] }],
    });

    yield* log("    ℹ️", `Found ${subnets.Subnets?.length ?? 0} subnets`);

    for (const subnet of subnets.Subnets ?? []) {
      if (subnet.SubnetId) {
        yield* log("    🗑️", `Deleting Subnet: ${subnet.SubnetId}`);
        yield* deleteSubnet({ SubnetId: subnet.SubnetId }).pipe(
          Effect.retry(
            Schedule.exponential("1 second").pipe(
              Schedule.intersect(Schedule.recurs(5)),
              Schedule.whileInput(
                (err: { _tag?: string }) => err._tag === "DependencyViolation",
              ),
            ),
          ),
          Effect.catchTag("DependencyViolation", () =>
            log(
              "    ⚠️",
              `Subnet ${subnet.SubnetId} has dependencies, skipping`,
            ),
          ),
        );
      }
    }

    // 11. Delete Route Tables (except main)
    const routeTables = yield* describeRouteTables({
      Filters: [{ Name: "vpc-id", Values: [vpcId] }],
    });

    yield* log(
      "    ℹ️",
      `Found ${routeTables.RouteTables?.length ?? 0} route tables`,
    );

    for (const rt of routeTables.RouteTables ?? []) {
      if (!rt.RouteTableId) continue;

      // Skip main route table (gets deleted with VPC)
      const isMain = rt.Associations?.some((a) => a.Main);
      if (isMain) {
        yield* log("    ℹ️", `Skipping main route table: ${rt.RouteTableId}`);
        continue;
      }

      // Disassociate from subnets first
      for (const assoc of rt.Associations ?? []) {
        if (assoc.RouteTableAssociationId && !assoc.Main) {
          yield* disassociateRouteTable({
            AssociationId: assoc.RouteTableAssociationId,
          });
        }
      }

      yield* log("    🗑️", `Deleting Route Table: ${rt.RouteTableId}`);
      yield* deleteRouteTable({ RouteTableId: rt.RouteTableId });
    }

    // 12. Delete Network ACLs (except default)
    const networkAcls = yield* describeNetworkAcls
      .pages({
        Filters: [{ Name: "vpc-id", Values: [vpcId] }],
      })
      .pipe(
        Stream.flatMap((page) => Stream.fromIterable(page.NetworkAcls ?? [])),
        Stream.runCollect,
        Effect.map(Chunk.toArray),
      );

    yield* log("    ℹ️", `Found ${networkAcls.length} network ACLs`);

    for (const acl of networkAcls) {
      if (!acl.NetworkAclId) continue;
      if (acl.IsDefault) {
        yield* log(
          "    ℹ️",
          `Skipping default network ACL: ${acl.NetworkAclId}`,
        );
        continue;
      }

      yield* log("    🗑️", `Deleting Network ACL: ${acl.NetworkAclId}`);
      yield* deleteNetworkAcl({ NetworkAclId: acl.NetworkAclId });
    }

    // 13. Delete Security Groups (except default) with retry for cross-references
    const securityGroups = yield* describeSecurityGroups({
      Filters: [{ Name: "vpc-id", Values: [vpcId] }],
    });

    yield* log(
      "    ℹ️",
      `Found ${securityGroups.SecurityGroups?.length ?? 0} security groups`,
    );

    const sgsToDelete = (securityGroups.SecurityGroups ?? []).filter(
      (sg) => sg.GroupId && sg.GroupName !== "default",
    );

    // Log skipped default security groups
    for (const sg of securityGroups.SecurityGroups ?? []) {
      if (sg.GroupName === "default") {
        yield* log("    ℹ️", `Skipping default security group: ${sg.GroupId}`);
      }
    }

    for (const sg of sgsToDelete) {
      if (!sg.GroupId) continue;

      yield* log("    🗑️", `Deleting Security Group: ${sg.GroupId}`);
      yield* deleteSecurityGroup({ GroupId: sg.GroupId }).pipe(
        Effect.retry(
          Schedule.exponential("1 second").pipe(
            Schedule.intersect(Schedule.recurs(5)),
            Schedule.whileInput(
              (err: { _tag?: string }) => err._tag === "DependencyViolation",
            ),
          ),
        ),
        Effect.catchTag("DependencyViolation", () =>
          log(
            "    ⚠️",
            `Security Group ${sg.GroupId} has dependencies, skipping`,
          ),
        ),
      );
    }

    // 14. Finally delete the VPC
    yield* deleteVpc({ VpcId: vpcId }).pipe(
      Effect.retry(
        Schedule.exponential("1 second").pipe(
          Schedule.intersect(Schedule.recurs(5)),
          Schedule.whileInput(
            (err: { _tag?: string }) => err._tag === "DependencyViolation",
          ),
        ),
      ),
      Effect.catchTag("DependencyViolation", () =>
        log("    ⚠️", `VPC ${vpcId} has remaining dependencies, skipping`),
      ),
    );
  });

const cleanVPC = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("🌐", "Cleaning VPCs...");

  // Collect all VPCs (manual pagination - no paginated trait on EC2 describe operations)
  const toDelete: Array<{ vpcId: string; nameTag: string }> = [];
  let nextToken: string | undefined;

  do {
    const vpcs = yield* describeVpcs({ NextToken: nextToken });

    for (const vpc of vpcs.Vpcs ?? []) {
      if (!vpc.VpcId) continue;

      // Skip default VPC
      if (vpc.IsDefault) {
        yield* log("  ℹ️", `Skipping default VPC: ${vpc.VpcId}`);
        continue;
      }

      // Check prefix against VPC name tag
      const nameTag = vpc.Tags?.find((t) => t.Key === "Name")?.Value ?? "";
      if (!matchesPrefix(prefix, nameTag) && !matchesPrefix(prefix, vpc.VpcId))
        continue;

      toDelete.push({ vpcId: vpc.VpcId, nameTag });
    }

    nextToken = vpcs.NextToken;
  } while (nextToken);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No VPCs to delete (excluding default VPC)");
    return;
  }

  // Delete all collected VPCs
  for (const vpc of toDelete) {
    if (dryRun) {
      yield* log("  📋", `Would delete VPC: ${vpc.vpcId} (${vpc.nameTag})`);
      continue;
    }

    yield* deleteVpcWithDependencies(vpc.vpcId, vpc.nameTag);
  }

  yield* log("  ✓", `Processed ${toDelete.length} VPCs`);
});

// ============================================================================
// IAM Cleanup (optional, dangerous)
// ============================================================================

const cleanIAM = Effect.gen(function* () {
  const { dryRun, prefix, cleanIam } = yield* getConfig;

  if (!cleanIam) {
    yield* log("🔐", "Skipping IAM roles (use --iam to enable)");
    return;
  }

  yield* warn("Cleaning IAM roles - this is dangerous!");
  yield* log("🔐", "Cleaning IAM roles...");

  // Collect all roles using pagination stream
  const toDelete = yield* listRoles.pages({}).pipe(
    Stream.flatMap((page) => Stream.fromIterable(page.Roles ?? [])),
    Stream.filter(
      (role) =>
        !!role.RoleName &&
        matchesPrefix(prefix, role.RoleName) &&
        !role.Path?.startsWith("/aws-service-role/"),
    ),
    Stream.map((role) => role.RoleName!),
    Stream.runCollect,
  );

  if (toDelete.length === 0) {
    yield* log("  ✓", "No IAM roles to delete");
    return;
  }

  // Delete all collected roles
  for (const roleName of toDelete) {
    if (dryRun) {
      yield* log("  📋", `Would delete role: ${roleName}`);
      continue;
    }

    yield* log("  🗑️", `Deleting role: ${roleName}`);

    // Detach managed policies using pagination stream
    const attachedPolicies = yield* listAttachedRolePolicies
      .pages({
        RoleName: roleName,
      })
      .pipe(
        Stream.flatMap((page) =>
          Stream.fromIterable(page.AttachedPolicies ?? []),
        ),
        Stream.runCollect,
      );

    for (const policy of attachedPolicies) {
      if (policy.PolicyArn) {
        yield* detachRolePolicy({
          RoleName: roleName,
          PolicyArn: policy.PolicyArn,
        });
      }
    }

    // Delete inline policies using pagination stream
    const inlinePolicies = yield* listRolePolicies
      .pages({
        RoleName: roleName,
      })
      .pipe(
        Stream.flatMap((page) => Stream.fromIterable(page.PolicyNames ?? [])),
        Stream.runCollect,
      );

    for (const policyName of inlinePolicies) {
      yield* deleteRolePolicy({
        RoleName: roleName,
        PolicyName: policyName,
      });
    }

    // Delete the role
    yield* deleteRole({ RoleName: roleName });
  }

  yield* log("  ✓", `Processed ${toDelete.length} IAM roles`);
});

// ============================================================================
// Main Command
// ============================================================================

const cleanCommand = Command.make(
  "clean",
  { dryRun: dryRunOption, iam: iamOption, prefix: prefixOption },
  ({ dryRun, iam, prefix }) =>
    Effect.gen(function* () {
      const prefixValue = Option.getOrElse(prefix, () => "");

      // Set config
      yield* Ref.set(CleanupConfig, {
        dryRun,
        cleanIam: iam,
        prefix: prefixValue,
      });

      yield* Console.log("🧹 AWS Account Cleanup Script");
      yield* Console.log("============================");

      if (dryRun) {
        yield* Console.log("🔍 DRY RUN MODE - No resources will be deleted\n");
      }

      if (prefixValue) {
        yield* Console.log(
          `🔍 Only cleaning resources with prefix: ${prefixValue}\n`,
        );
      }

      if (process.env.LOCAL) {
        yield* Console.log("🏠 Running against LocalStack\n");
      } else {
        yield* Console.log("☁️  Running against real AWS\n");
      }

      // Regions to clean
      const regions = ["us-east-1", "us-west-2"];

      const cleanRegion = Effect.fnUntraced(function* (region: string) {
        yield* Console.log(`\n🌍 Cleaning region: ${region}\n`);
        yield* Console.log("─".repeat(40));

        yield* cleanS3;
        yield* cleanLambda;
        yield* cleanECS;
        yield* cleanSQS;
        yield* cleanSNS;
        yield* cleanDynamoDB;
        yield* cleanAPIGateway;
        yield* cleanAPIGatewayV2;
        yield* cleanAppSync;
        // EC2 resources must be cleaned before VPC
        yield* cleanEC2Instances;
        yield* cleanElasticIPs;
        yield* cleanNetworkInterfaces;
        yield* cleanVPC;
      });

      for (const region of regions) {
        yield* cleanRegion(region).pipe(Effect.provideService(Region, region));
      }

      // IAM is global, only run once
      yield* Console.log("\n🌍 Cleaning global resources (IAM)\n");
      yield* Console.log("─".repeat(40));
      yield* cleanIAM.pipe(Effect.provideService(Region, "us-east-1"));

      yield* Console.log("\n✨ Cleanup complete!");
    }),
);

// ============================================================================
// CLI Setup
// ============================================================================

const cli = Command.run(cleanCommand, {
  name: "aws-clean",
  version: "1.0.0",
});

// ============================================================================
// Platform and Credentials Layers
// ============================================================================

const platform = Layer.mergeAll(
  NodeContext.layer,
  FetchHttpClient.layer,
  Logger.pretty,
);

const awsLayer = process.env.LOCAL
  ? Layer.mergeAll(
      Layer.succeed(
        Endpoint,
        process.env.LOCALSTACK_HOST ?? "http://localhost:4566",
      ),
      Credentials.mock,
    )
  : Credentials.fromChain();

// ============================================================================
// Run
// ============================================================================

cli(process.argv).pipe(
  Retry.transient,
  Effect.provide(platform),
  Effect.provide(awsLayer),
  Logger.withMinimumLogLevel(
    process.env.DEBUG ? LogLevel.Debug : LogLevel.Info,
  ),
  NodeRuntime.runMain,
);

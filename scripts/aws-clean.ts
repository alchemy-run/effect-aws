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
 * - VPCs (with dependencies: subnets, internet gateways, NAT gateways, route tables, security groups)
 * - IAM roles (optionally, with --iam flag)
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
  Console,
  Effect,
  Layer,
  Logger,
  LogLevel,
  Option,
  Ref,
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
  deleteInternetGateway,
  deleteNatGateway,
  deleteRouteTable,
  deleteSecurityGroup,
  deleteSubnet,
  deleteVpc,
  describeInternetGateways,
  describeNatGateways,
  describeRouteTables,
  describeSecurityGroups,
  describeSubnets,
  describeVpcs,
  detachInternetGateway,
  disassociateRouteTable,
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
      yield* emptyBucket(bucket.Name);
      yield* deleteBucket({ Bucket: bucket.Name });
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
// VPC Cleanup (most complex due to dependencies)
// ============================================================================

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
      if (vpc.IsDefault) continue;

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

    yield* log("  🗑️", `Deleting VPC: ${vpc.vpcId} (${vpc.nameTag})`);

    // 1. Delete NAT Gateways
    const natGateways = yield* describeNatGateways({
      Filter: [{ Name: "vpc-id", Values: [vpc.vpcId] }],
    });

    for (const nat of natGateways.NatGateways ?? []) {
      if (nat.NatGatewayId && nat.State !== "deleted") {
        yield* log("    🗑️", `Deleting NAT Gateway: ${nat.NatGatewayId}`);
        yield* deleteNatGateway({ NatGatewayId: nat.NatGatewayId });
      }
    }

    // 2. Detach and delete Internet Gateways
    const igws = yield* describeInternetGateways({
      Filters: [{ Name: "attachment.vpc-id", Values: [vpc.vpcId] }],
    });

    for (const igw of igws.InternetGateways ?? []) {
      if (igw.InternetGatewayId) {
        yield* log("    🗑️", `Detaching IGW: ${igw.InternetGatewayId}`);
        yield* detachInternetGateway({
          InternetGatewayId: igw.InternetGatewayId,
          VpcId: vpc.vpcId,
        });
        yield* deleteInternetGateway({
          InternetGatewayId: igw.InternetGatewayId,
        });
      }
    }

    // 3. Delete Subnets
    const subnets = yield* describeSubnets({
      Filters: [{ Name: "vpc-id", Values: [vpc.vpcId] }],
    });

    for (const subnet of subnets.Subnets ?? []) {
      if (subnet.SubnetId) {
        yield* log("    🗑️", `Deleting Subnet: ${subnet.SubnetId}`);
        yield* deleteSubnet({ SubnetId: subnet.SubnetId });
      }
    }

    // 4. Delete Route Tables (except main)
    const routeTables = yield* describeRouteTables({
      Filters: [{ Name: "vpc-id", Values: [vpc.vpcId] }],
    });

    for (const rt of routeTables.RouteTables ?? []) {
      if (!rt.RouteTableId) continue;

      // Skip main route table
      const isMain = rt.Associations?.some((a) => a.Main);
      if (isMain) continue;

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

    // 5. Delete Security Groups (except default)
    const securityGroups = yield* describeSecurityGroups({
      Filters: [{ Name: "vpc-id", Values: [vpc.vpcId] }],
    });

    for (const sg of securityGroups.SecurityGroups ?? []) {
      if (!sg.GroupId || sg.GroupName === "default") continue;

      yield* log("    🗑️", `Deleting Security Group: ${sg.GroupId}`);
      yield* deleteSecurityGroup({ GroupId: sg.GroupId });
    }

    // 6. Finally delete the VPC
    yield* deleteVpc({ VpcId: vpc.vpcId });
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

      // Run all cleanups
      yield* cleanS3;
      yield* cleanLambda;
      yield* cleanECS;
      yield* cleanSQS;
      yield* cleanSNS;
      yield* cleanDynamoDB;
      yield* cleanAPIGateway;
      yield* cleanAPIGatewayV2;
      yield* cleanAppSync;
      yield* cleanVPC;
      yield* cleanIAM;

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
  Effect.provideService(Region, "us-east-1"),
  Logger.withMinimumLogLevel(
    process.env.DEBUG ? LogLevel.Debug : LogLevel.Info,
  ),
  NodeRuntime.runMain,
);

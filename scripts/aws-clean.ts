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
import { Console, Effect, Layer, Logger, LogLevel, Option, Ref } from "effect";
import * as Credentials from "../src/aws/credentials.ts";
import { Endpoint } from "../src/aws/endpoint.ts";
import { Region } from "../src/aws/region.ts";
import * as Retry from "../src/retry-policy.ts";

// Service imports
import { deleteRestApi, getRestApis } from "../src/services/api-gateway.ts";
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

    // Delete regular objects (for non-versioned buckets)
    let continuationToken: string | undefined;
    do {
      const objects = yield* listObjectsV2({
        Bucket: bucket,
        ContinuationToken: continuationToken,
      });

      for (const obj of objects.Contents ?? []) {
        if (obj.Key) {
          yield* deleteObject({ Bucket: bucket, Key: obj.Key });
        }
      }

      if ((objects.Contents?.length ?? 0) > 0) {
        yield* log("  🗑️", `Deleted ${objects.Contents?.length} objects`);
      }

      continuationToken = objects.NextContinuationToken;
    } while (continuationToken);
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

  // First, collect all APIs to delete (pagination completes before any deletions)
  const toDelete: Array<{ id: string; name: string }> = [];
  let position: string | undefined;

  do {
    const apis = yield* getRestApis({ position });

    for (const api of apis.items ?? []) {
      if (!api.id || !api.name) continue;
      if (!matchesPrefix(prefix, api.name)) continue;
      toDelete.push({ id: api.id, name: api.name });
    }

    position = apis.position;
  } while (position);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No API Gateway REST APIs to delete");
    return;
  }

  // Now delete all collected APIs
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
// AppSync Cleanup
// ============================================================================

const cleanAppSync = Effect.gen(function* () {
  const { dryRun, prefix } = yield* getConfig;
  yield* log("📊", "Cleaning AppSync GraphQL APIs...");

  // First collect all APIs to delete
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

  // Now delete all collected APIs
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

  // First collect all functions to delete
  const toDelete: string[] = [];
  let marker: string | undefined;

  do {
    const functions = yield* listFunctions({ Marker: marker });

    for (const fn of functions.Functions ?? []) {
      if (!fn.FunctionName) continue;
      if (!matchesPrefix(prefix, fn.FunctionName)) continue;
      toDelete.push(fn.FunctionName);
    }

    marker = functions.NextMarker;
  } while (marker);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No Lambda functions to delete");
    return;
  }

  // Now delete all collected functions
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

  // First collect all task definitions to delete
  const toDelete: Array<{ arn: string; display: string }> = [];
  let nextToken: string | undefined;

  do {
    const taskDefs = yield* listTaskDefinitions({ nextToken });

    for (const taskDefArn of taskDefs.taskDefinitionArns ?? []) {
      // Extract family name from ARN: arn:aws:ecs:region:account:task-definition/family:revision
      const familyWithRevision = taskDefArn.split("/").pop() ?? "";
      const family = familyWithRevision.split(":")[0];

      if (!matchesPrefix(prefix, family)) continue;
      toDelete.push({ arn: taskDefArn, display: familyWithRevision });
    }

    nextToken = taskDefs.nextToken;
  } while (nextToken);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No ECS task definitions to delete");
    return;
  }

  // Now delete all collected task definitions
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

  // First collect all clusters to delete
  const toDelete: Array<{ arn: string; name: string }> = [];
  let nextToken: string | undefined;

  do {
    const clusters = yield* listClusters({ nextToken });

    for (const clusterArn of clusters.clusterArns ?? []) {
      const clusterName = clusterArn.split("/").pop() ?? "";
      if (!matchesPrefix(prefix, clusterName)) continue;
      toDelete.push({ arn: clusterArn, name: clusterName });
    }

    nextToken = clusters.nextToken;
  } while (nextToken);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No ECS clusters to delete");
    return;
  }

  // Now delete all collected clusters
  for (const cluster of toDelete) {
    if (dryRun) {
      yield* log("  📋", `Would delete cluster: ${cluster.name}`);
      continue;
    }

    yield* log("  🗑️", `Deleting cluster: ${cluster.name}`);

    // Stop all running tasks
    let tasksNextToken: string | undefined;
    do {
      const tasks = yield* listTasks({
        cluster: cluster.arn,
        nextToken: tasksNextToken,
      });

      for (const taskArn of tasks.taskArns ?? []) {
        yield* stopTask({
          cluster: cluster.arn,
          task: taskArn,
          reason: "Cleanup script",
        });
      }

      tasksNextToken = tasks.nextToken;
    } while (tasksNextToken);

    // Delete all services
    let servicesNextToken: string | undefined;
    do {
      const services = yield* listServices({
        cluster: cluster.arn,
        nextToken: servicesNextToken,
      });

      for (const serviceArn of services.serviceArns ?? []) {
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

      servicesNextToken = services.nextToken;
    } while (servicesNextToken);

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

  // First collect all queues to delete
  const toDelete: Array<{ url: string; name: string }> = [];
  let nextToken: string | undefined;

  do {
    const queues = yield* listQueues({
      NextToken: nextToken,
      QueueNamePrefix: prefix || undefined,
    });

    for (const queueUrl of queues.QueueUrls ?? []) {
      const queueName = queueUrl.split("/").pop() ?? "";
      toDelete.push({ url: queueUrl, name: queueName });
    }

    nextToken = queues.NextToken;
  } while (nextToken);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No SQS queues to delete");
    return;
  }

  // Now delete all collected queues
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

  // First collect all topics to delete
  const toDelete: Array<{ arn: string; name: string }> = [];
  let nextToken: string | undefined;

  do {
    const topics = yield* listTopics({ NextToken: nextToken });

    for (const topic of topics.Topics ?? []) {
      if (!topic.TopicArn) continue;

      const topicName = topic.TopicArn.split(":").pop() ?? "";
      if (!matchesPrefix(prefix, topicName)) continue;
      toDelete.push({ arn: topic.TopicArn, name: topicName });
    }

    nextToken = topics.NextToken;
  } while (nextToken);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No SNS topics to delete");
    return;
  }

  // Now delete all collected topics
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

  // First collect all tables to delete
  const toDelete: string[] = [];
  let lastEvaluatedTableName: string | undefined;

  do {
    const tables = yield* listTables({
      ExclusiveStartTableName: lastEvaluatedTableName,
    });

    for (const tableName of tables.TableNames ?? []) {
      if (!matchesPrefix(prefix, tableName)) continue;
      toDelete.push(tableName);
    }

    lastEvaluatedTableName = tables.LastEvaluatedTableName;
  } while (lastEvaluatedTableName);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No DynamoDB tables to delete");
    return;
  }

  // Now delete all collected tables
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

  // First collect all VPCs to delete
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

  // Now delete all collected VPCs
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

  // First collect all roles to delete
  const toDelete: string[] = [];
  let marker: string | undefined;

  do {
    const roles = yield* listRoles({ Marker: marker });

    for (const role of roles.Roles ?? []) {
      if (!role.RoleName) continue;
      if (!matchesPrefix(prefix, role.RoleName)) continue;

      // Skip AWS service-linked roles
      if (role.Path?.startsWith("/aws-service-role/")) continue;

      toDelete.push(role.RoleName);
    }

    marker = roles.Marker;
  } while (marker);

  if (toDelete.length === 0) {
    yield* log("  ✓", "No IAM roles to delete");
    return;
  }

  // Now delete all collected roles
  for (const roleName of toDelete) {
    if (dryRun) {
      yield* log("  📋", `Would delete role: ${roleName}`);
      continue;
    }

    yield* log("  🗑️", `Deleting role: ${roleName}`);

    // Detach managed policies
    const attachedPolicies = yield* listAttachedRolePolicies({
      RoleName: roleName,
    });

    for (const policy of attachedPolicies.AttachedPolicies ?? []) {
      if (policy.PolicyArn) {
        yield* detachRolePolicy({
          RoleName: roleName,
          PolicyArn: policy.PolicyArn,
        });
      }
    }

    // Delete inline policies
    const inlinePolicies = yield* listRolePolicies({
      RoleName: roleName,
    });

    for (const policyName of inlinePolicies.PolicyNames ?? []) {
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

#!/usr/bin/env bun
// @ts-nocheck
/**
 * Generic Dependency Conflict Discovery
 *
 * Uses topology analysis to automatically:
 * 1. Build a resource dependency graph from Smithy models
 * 2. Create resources in dependency order
 * 3. Attempt wrong-order deletions to trigger DependencyViolation errors
 * 4. Clean up in correct order
 *
 * No hardcoded recipes - everything is derived from the topology.
 */

import { Args, Command, Options } from "@effect/cli";
import { FetchHttpClient } from "@effect/platform";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Layer, Logger, LogLevel } from "effect";
import * as Credentials from "../../src/credentials.ts";
import { Region } from "../../src/region.ts";
import { generateFakeId } from "./id-generator.ts";
import { createErrorTracker, loadSpec, recordError } from "./runner.ts";
import {
  buildDependencyGraph,
  getDependents,
  type DependencyGraph,
  type Operation,
} from "./topology.ts";

// ============================================================================
// Types
// ============================================================================

interface CreatedResource {
  resourceType: string;
  id: string;
  createOp: string;
  deleteOp: string | null;
  /** IDs of parent resources this depends on */
  parentIds: Record<string, string>;
}

interface ResourceGraph {
  resources: Map<string, CreatedResource>;
  /** Order resources were created (for reverse deletion) */
  creationOrder: string[];
}

// ============================================================================
// Input Generation - Derive inputs from topology
// ============================================================================

/**
 * Common input patterns and their default values.
 * These are patterns that appear across many AWS services.
 */
const COMMON_INPUT_DEFAULTS: Record<string, unknown> = {
  // CIDR blocks
  CidrBlock: "10.0.0.0/16",
  Cidr: "10.0.0.0/16",
  DestinationCidrBlock: "0.0.0.0/0",

  // Sizes and counts
  Size: 1,
  MaxEntries: 10,
  MaxSize: 1,
  MinSize: 0,
  DesiredCapacity: 0,
  SessionNumber: 1,

  // Types
  Type: "ipsec.1",
  VpcEndpointType: "Gateway",
  VolumeType: "gp3",
  InstanceType: "t2.micro",
  KeyType: "ed25519",
  AddressFamily: "IPv4",
  Strategy: "cluster",
  ConnectivityType: "private",
  Domain: "vpc",
  Protocol: "tcp",

  // Ports
  FromPort: 0,
  ToPort: 65535,
  Port: 443,

  // Booleans
  DryRun: false,
  Force: false,

  // Availability zones
  AvailabilityZone: "us-east-1a",
};

/**
 * Service-specific input defaults that override common patterns.
 */
const SERVICE_INPUT_DEFAULTS: Record<string, Record<string, unknown>> = {
  ec2: {
    // VPC-specific
    CidrBlock: "10.0.0.0/16",
    // S3 endpoint for VPC endpoints
    ServiceName: "com.amazonaws.us-east-1.s3",
    // BGP ASN for customer gateways
    BgpAsn: 65000,
    // Example IP for customer gateways
    IpAddress: "198.51.100.1",
    // Instance type
    InstanceType: "t2.micro",
    // Volume
    VolumeType: "gp3",
    // DHCP Options
    DhcpConfigurations: [
      { Key: "domain-name", Values: ["itty.test"] },
      { Key: "domain-name-servers", Values: ["10.0.0.2"] },
    ],
    // Security Group
    GroupDescription: "Dependency test security group",
    // Route
    DestinationCidrBlock: "0.0.0.0/0",
    // Customer Gateway
    Type: "ipsec.1",
    // Managed Prefix List
    AddressFamily: "IPv4",
    MaxEntries: 10,
    Entries: [{ Cidr: "10.0.0.0/8", Description: "Test entry" }],
  },
};

/**
 * Resources that require a second resource of the same type (peer relationship).
 * For these, we create two resources and link them.
 */
const PEER_RESOURCES = new Set([
  "TransitGatewayPeeringAttachment",
  "VpcPeeringConnection",
]);

/**
 * Resources that have external dependencies we can't easily satisfy.
 * We still try to create them, but log why they might fail.
 */
const EXTERNAL_DEPENDENCIES: Record<string, string> = {
  ClientVpnTargetNetwork: "ClientVpnEndpoint",
  ClientVpnRoute: "ClientVpnEndpoint",
  ClientVpnAuthorizationRule: "ClientVpnEndpoint",
  EnclaveCertificateIamRole: "Enclave",
  IamInstanceProfile: "IAM role",
  SpotFleetRequest: "LaunchSpecification",
  Fleet: "LaunchTemplateConfig",
  ByoipCidr: "Real IP block",
};

/**
 * Generate a unique name/description for a resource.
 */
const generateResourceName = (resourceType: string): string => {
  return `itty-dep-${resourceType.toLowerCase()}-${Date.now()}`;
};

/**
 * Generate TagSpecifications for EC2 resources.
 */
const generateTagSpecs = (resourceType: string): unknown[] => {
  // Map resource types to EC2 tag resource types
  const tagResourceTypes: Record<string, string> = {
    Vpc: "vpc",
    Subnet: "subnet",
    InternetGateway: "internet-gateway",
    RouteTable: "route-table",
    SecurityGroup: "security-group",
    NetworkAcl: "network-acl",
    NetworkInterface: "network-interface",
    NatGateway: "natgateway",
    Volume: "volume",
    Snapshot: "snapshot",
    LaunchTemplate: "launch-template",
    CustomerGateway: "customer-gateway",
    VpnGateway: "vpn-gateway",
    VpnConnection: "vpn-connection",
    TransitGateway: "transit-gateway",
    VpcEndpoint: "vpc-endpoint",
    EgressOnlyInternetGateway: "egress-only-internet-gateway",
    PrefixList: "prefix-list",
    PlacementGroup: "placement-group",
    KeyPair: "key-pair",
    TrafficMirrorFilter: "traffic-mirror-filter",
    TrafficMirrorTarget: "traffic-mirror-target",
    TrafficMirrorSession: "traffic-mirror-session",
    DhcpOptions: "dhcp-options",
    ElasticIp: "elastic-ip",
    Address: "elastic-ip",
  };

  const tagType = tagResourceTypes[resourceType];
  if (!tagType) return [];

  return [
    {
      ResourceType: tagType,
      Tags: [{ Key: "Name", Value: `itty-dep-${resourceType.toLowerCase()}` }],
    },
  ];
};

/**
 * Special input generators for specific resource types.
 * These handle resources that need non-obvious input structures.
 */
const SPECIAL_INPUTS: Record<
  string,
  (parents: Map<string, CreatedResource>) => Record<string, unknown>
> = {
  // Security Group needs both GroupName and Description
  SecurityGroupVpc: (parents) => ({
    GroupName: `itty-dep-sg-${Date.now()}`,
    Description: "Dependency test security group",
    VpcId: parents.get("Vpc")?.id,
  }),
  // Address (Elastic IP) needs Domain
  Address: () => ({
    Domain: "vpc",
  }),
  // NatGateway can work with just SubnetId if ConnectivityType is private
  NatGateway: (parents) => ({
    SubnetId: parents.get("Subnet")?.id,
    ConnectivityType: "private",
  }),
  // Volume needs AvailabilityZone
  Volume: () => ({
    AvailabilityZone: "us-east-1a",
    Size: 1,
    VolumeType: "gp3",
  }),
  // IpamPool needs AddressFamily
  IpamPool: (parents) => ({
    IpamScopeId: parents.get("IpamScope")?.id,
    AddressFamily: "ipv4",
  }),
  // LaunchTemplate needs LaunchTemplateData
  LaunchTemplate: () => ({
    LaunchTemplateName: `itty-dep-lt-${Date.now()}`,
    LaunchTemplateData: {
      InstanceType: "t2.micro",
    },
  }),
  // CustomerGateway needs specific fields
  CustomerGateway: () => ({
    Type: "ipsec.1",
    BgpAsn: 65000,
    IpAddress: "198.51.100.1",
  }),
  // VpnGateway just needs Type
  VpnGateway: () => ({
    Type: "ipsec.1",
  }),
  // VpnConnection needs both customer and vpn gateway
  VpnConnection: (parents) => ({
    CustomerGatewayId: parents.get("CustomerGateway")?.id,
    VpnGatewayId: parents.get("VpnGateway")?.id,
    Type: "ipsec.1",
    Options: { StaticRoutesOnly: true },
  }),
  // DhcpOptions needs DhcpConfigurations
  DhcpOptions: () => ({
    DhcpConfigurations: [
      { Key: "domain-name", Values: ["itty.test"] },
      { Key: "domain-name-servers", Values: ["10.0.0.2"] },
    ],
  }),
  // ManagedPrefixList needs specific structure
  ManagedPrefixList: () => ({
    PrefixListName: `itty-dep-pl-${Date.now()}`,
    MaxEntries: 10,
    AddressFamily: "IPv4",
    Entries: [{ Cidr: "10.0.0.0/8", Description: "Test entry" }],
  }),
  // PlacementGroup needs GroupName and Strategy
  PlacementGroup: () => ({
    GroupName: `itty-dep-pg-${Date.now()}`,
    Strategy: "cluster",
  }),
  // KeyPair needs KeyName
  KeyPair: () => ({
    KeyName: `itty-dep-kp-${Date.now()}`,
    KeyType: "ed25519",
  }),
  // NetworkInterface needs SubnetId
  NetworkInterface: (parents) => ({
    SubnetId: parents.get("Subnet")?.id,
    Description: "Dependency test ENI",
  }),
  // TrafficMirrorFilter just needs Description
  TrafficMirrorFilter: () => ({
    Description: "Dependency test traffic mirror filter",
  }),
  // TrafficMirrorTarget needs NetworkInterfaceId
  TrafficMirrorTarget: (parents) => ({
    NetworkInterfaceId: parents.get("NetworkInterface")?.id,
    Description: "Dependency test traffic mirror target",
  }),
  // TrafficMirrorSession needs filter, target, and source ENI
  TrafficMirrorSession: (parents) => ({
    NetworkInterfaceId: parents.get("NetworkInterface")?.id,
    TrafficMirrorTargetId: parents.get("TrafficMirrorTarget")?.id,
    TrafficMirrorFilterId: parents.get("TrafficMirrorFilter")?.id,
    SessionNumber: 1,
  }),
  // EgressOnlyInternetGateway needs VpcId
  EgressOnlyInternetGateway: (parents) => ({
    VpcId: parents.get("Vpc")?.id,
  }),
  // VpcEndpoint for gateway type
  VpcEndpoint: (parents) => ({
    VpcId: parents.get("Vpc")?.id,
    ServiceName: "com.amazonaws.us-east-1.s3",
    VpcEndpointType: "Gateway",
  }),
  // Hosts needs specific config
  Hosts: () => ({
    AvailabilityZone: "us-east-1a",
    InstanceType: "c5.large",
    AutoPlacement: "on",
    Quantity: 1,
  }),
  // CapacityReservation needs specific config
  CapacityReservation: () => ({
    InstanceType: "t2.micro",
    InstancePlatform: "Linux/UNIX",
    AvailabilityZone: "us-east-1a",
    InstanceCount: 1,
  }),
};

/**
 * Build inputs for a create operation using topology information.
 */
const buildCreateInputs = (
  service: string,
  graph: DependencyGraph,
  operation: Operation,
  createdResources: Map<string, CreatedResource>,
): Record<string, unknown> => {
  // Check for special input generator first
  const specialGenerator = SPECIAL_INPUTS[operation.resource];
  if (specialGenerator) {
    const specialInputs = specialGenerator(createdResources);
    // Add tags if not present
    if (!specialInputs.TagSpecifications) {
      const tags = generateTagSpecs(operation.resource);
      if (tags.length > 0) {
        specialInputs.TagSpecifications = tags;
      }
    }
    return specialInputs;
  }

  const inputs: Record<string, unknown> = {};
  const serviceDefaults = SERVICE_INPUT_DEFAULTS[service] || {};

  for (const [fieldName, fieldInfo] of Object.entries(operation.inputs)) {
    // Skip optional fields unless we have a default
    if (!fieldInfo.required) {
      // Check if we have a sensible default
      if (fieldName in serviceDefaults) {
        inputs[fieldName] = serviceDefaults[fieldName];
      } else if (fieldName in COMMON_INPUT_DEFAULTS) {
        inputs[fieldName] = COMMON_INPUT_DEFAULTS[fieldName];
      } else if (fieldName === "TagSpecifications") {
        const tags = generateTagSpecs(operation.resource);
        if (tags.length > 0) {
          inputs[fieldName] = tags;
        }
      } else if (fieldName === "Description") {
        inputs[fieldName] = `Dependency test ${operation.resource}`;
      }
      continue;
    }

    // Handle foreign key references
    if (fieldInfo.references) {
      const refResource = createdResources.get(fieldInfo.references);
      if (refResource) {
        // Use the created resource's ID
        if (fieldName.endsWith("Ids") || fieldName.endsWith("s")) {
          inputs[fieldName] = [refResource.id];
        } else {
          inputs[fieldName] = refResource.id;
        }
        continue;
      }
      // If we don't have the referenced resource, generate a fake ID
      inputs[fieldName] = generateFakeId(fieldInfo.references);
      continue;
    }

    // Check service-specific defaults first
    if (fieldName in serviceDefaults) {
      inputs[fieldName] = serviceDefaults[fieldName];
      continue;
    }

    // Check common defaults
    if (fieldName in COMMON_INPUT_DEFAULTS) {
      inputs[fieldName] = COMMON_INPUT_DEFAULTS[fieldName];
      continue;
    }

    // Generate based on field name patterns
    if (fieldName.endsWith("Name") || fieldName === "GroupName") {
      inputs[fieldName] = generateResourceName(operation.resource);
      continue;
    }

    if (fieldName.endsWith("Id") || fieldName.endsWith("Arn")) {
      // Generate a fake ID for this resource type
      const resourceType = fieldName.replace(/(Id|Arn)$/, "");
      inputs[fieldName] = generateFakeId(resourceType);
      continue;
    }

    // Default: generate based on type
    switch (fieldInfo.type) {
      case "String":
        inputs[fieldName] = generateResourceName(operation.resource);
        break;
      case "Integer":
      case "Long":
        inputs[fieldName] = 1;
        break;
      case "Boolean":
        inputs[fieldName] = false;
        break;
      default:
        // Skip complex types we don't know how to generate
        break;
    }
  }

  return inputs;
};

/**
 * Build inputs for a delete operation using topology information.
 */
const buildDeleteInputs = (
  graph: DependencyGraph,
  operation: Operation,
  resourceId: string,
): Record<string, unknown> => {
  const inputs: Record<string, unknown> = {};

  for (const [fieldName, fieldInfo] of Object.entries(operation.inputs)) {
    if (!fieldInfo.required) continue;

    // The main identifier field
    if (
      fieldName.endsWith("Id") ||
      fieldName.endsWith("Ids") ||
      fieldName === operation.resource ||
      fieldName === `${operation.resource}s`
    ) {
      if (fieldName.endsWith("Ids") || fieldName.endsWith("s")) {
        inputs[fieldName] = [resourceId];
      } else {
        inputs[fieldName] = resourceId;
      }
      continue;
    }

    // Generate other required fields
    if (fieldInfo.type === "String") {
      inputs[fieldName] = resourceId;
    } else if (fieldInfo.type === "Boolean") {
      inputs[fieldName] = false;
    } else if (fieldInfo.type === "Integer" || fieldInfo.type === "Long") {
      inputs[fieldName] = 1;
    }
  }

  return inputs;
};

// ============================================================================
// Helpers
// ============================================================================

/**
 * State-related errors that indicate we should wait and retry.
 */
const STATE_ERROR_PATTERNS = [
  "IncorrectState",
  "InvalidState",
  "ResourceNotReady",
  "Pending",
  "InProgress",
  "NotReady",
  "Busy",
];

/**
 * Check if an error indicates a state issue that might resolve with waiting.
 */
const isStateError = (errorTag: string | undefined): boolean => {
  if (!errorTag) return false;
  return STATE_ERROR_PATTERNS.some((pattern) =>
    errorTag.toLowerCase().includes(pattern.toLowerCase()),
  );
};

/**
 * Call an operation with automatic retry on state errors.
 */
const callOp = (
  module: Record<string, unknown>,
  opName: string,
  inputs: Record<string, unknown>,
  options: { maxRetries?: number; retryDelayMs?: number } = {},
) =>
  Effect.gen(function* () {
    const { maxRetries = 0, retryDelayMs = 5000 } = options;
    const fn = module[opName];
    if (typeof fn !== "function") {
      return {
        success: false,
        error: "FunctionNotFound",
        errorTag: undefined,
        result: undefined,
      };
    }

    let lastError: { error: string; errorTag?: string } | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        yield* Effect.sleep(`${retryDelayMs} millis`);
      }

      const effect = fn(inputs) as Effect.Effect<unknown, unknown, never>;
      const result = yield* effect.pipe(
        Effect.map((result) => ({
          success: true as const,
          result,
          error: undefined,
          errorTag: undefined,
        })),
        Effect.catchAll((error: any) =>
          Effect.succeed({
            success: false as const,
            result: undefined,
            error: error._tag || "Unknown",
            errorTag: error.errorTag as string | undefined,
          }),
        ),
      );

      if (result.success) {
        return result;
      }

      lastError = { error: result.error!, errorTag: result.errorTag };

      // Only retry on state errors
      if (!isStateError(result.errorTag) || attempt === maxRetries) {
        return result;
      }

      yield* Console.log(
        `      ⏳ State error (${result.errorTag}), retrying in ${retryDelayMs / 1000}s...`,
      );
    }

    return {
      success: false as const,
      result: undefined,
      error: lastError?.error || "Unknown",
      errorTag: lastError?.errorTag,
    };
  });

/**
 * Call an operation with retries for async resources.
 */
const callOpWithRetry = (
  module: Record<string, unknown>,
  opName: string,
  inputs: Record<string, unknown>,
) => callOp(module, opName, inputs, { maxRetries: 30, retryDelayMs: 5000 });

/**
 * Extract the resource ID from a create operation response.
 */
const extractResourceId = (
  resourceType: string,
  response: unknown,
): string | null => {
  if (!response || typeof response !== "object") return null;
  const r = response as Record<string, unknown>;

  // Common patterns for extracting IDs
  const patterns = [
    // Direct ID field
    `${resourceType}Id`,
    // Nested in resource object
    [resourceType, `${resourceType}Id`],
    // Common variations
    "GroupId",
    "AllocationId",
    "SnapshotId",
    "VolumeId",
    "KeyPairId",
    // Nested patterns
    [resourceType, "Id"],
    ["Vpc", "VpcId"],
    ["Subnet", "SubnetId"],
    ["InternetGateway", "InternetGatewayId"],
    ["NatGateway", "NatGatewayId"],
    ["RouteTable", "RouteTableId"],
    ["SecurityGroup", "GroupId"],
    ["NetworkInterface", "NetworkInterfaceId"],
    ["NetworkAcl", "NetworkAclId"],
    ["LaunchTemplate", "LaunchTemplateId"],
    ["TransitGateway", "TransitGatewayId"],
    ["VpnGateway", "VpnGatewayId"],
    ["VpnConnection", "VpnConnectionId"],
    ["CustomerGateway", "CustomerGatewayId"],
    ["VpcEndpoint", "VpcEndpointId"],
    ["EgressOnlyInternetGateway", "EgressOnlyInternetGatewayId"],
    ["TrafficMirrorFilter", "TrafficMirrorFilterId"],
    ["TrafficMirrorTarget", "TrafficMirrorTargetId"],
    ["TrafficMirrorSession", "TrafficMirrorSessionId"],
    ["DhcpOptions", "DhcpOptionsId"],
    ["PlacementGroup", "GroupId"],
    ["PrefixList", "PrefixListId"],
    ["TransitGatewayVpcAttachment", "TransitGatewayAttachmentId"],
  ];

  // Try direct patterns
  for (const pattern of patterns) {
    if (typeof pattern === "string") {
      if (pattern in r && typeof r[pattern] === "string") {
        return r[pattern] as string;
      }
    } else if (Array.isArray(pattern) && pattern.length === 2) {
      const [key, idField] = pattern;
      if (key in r && typeof r[key] === "object" && r[key] !== null) {
        const nested = r[key] as Record<string, unknown>;
        if (idField in nested && typeof nested[idField] === "string") {
          return nested[idField] as string;
        }
      }
    }
  }

  // Generic fallback: look for any field ending in "Id"
  for (const [key, value] of Object.entries(r)) {
    if (key.endsWith("Id") && typeof value === "string") {
      return value;
    }
    // Check nested objects
    if (typeof value === "object" && value !== null) {
      const nested = value as Record<string, unknown>;
      for (const [nestedKey, nestedValue] of Object.entries(nested)) {
        if (nestedKey.endsWith("Id") && typeof nestedValue === "string") {
          return nestedValue;
        }
      }
    }
  }

  return null;
};

// ============================================================================
// Core Algorithm
// ============================================================================

/**
 * Analyze the topology to find resources that can be created.
 * A resource can be created if:
 * 1. It has a create operation
 * 2. All its required references can be satisfied
 */
const findCreatableResources = (
  graph: DependencyGraph,
): { resource: string; createOp: string; dependencies: string[] }[] => {
  const creatable: {
    resource: string;
    createOp: string;
    dependencies: string[];
  }[] = [];

  for (const [resourceName, resource] of Object.entries(graph.resources)) {
    const createOpName = resource.operations.create;
    if (!createOpName) continue;

    const createOp = graph.operations[createOpName];
    if (!createOp) continue;

    // Find required dependencies
    const dependencies: string[] = [];

    for (const [fieldName, fieldInfo] of Object.entries(createOp.inputs)) {
      if (!fieldInfo.required) continue;
      if (!fieldInfo.references) continue;

      // Check if the referenced resource exists and can be created
      const refResource = graph.resources[fieldInfo.references];
      if (!refResource) {
        // Reference to unknown resource - might still work with fake IDs
        continue;
      }

      // Only add as dependency if it has a create operation
      if (refResource.operations.create) {
        dependencies.push(fieldInfo.references);
      }
    }

    creatable.push({
      resource: resourceName,
      createOp: createOpName,
      dependencies,
    });
  }

  return creatable;
};

/**
 * Topologically sort resources for creation.
 */
const sortForCreation = (
  creatable: { resource: string; createOp: string; dependencies: string[] }[],
): string[] => {
  const order: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const resourceMap = new Map(creatable.map((c) => [c.resource, c]));

  const visit = (resource: string): boolean => {
    if (visited.has(resource)) return true;
    if (visiting.has(resource)) return false; // Cycle detected

    const info = resourceMap.get(resource);
    if (!info) return true; // Not in our creatable list

    visiting.add(resource);

    for (const dep of info.dependencies) {
      if (!visit(dep)) return false;
    }

    visiting.delete(resource);
    visited.add(resource);
    order.push(resource);
    return true;
  };

  for (const { resource } of creatable) {
    visit(resource);
  }

  return order;
};

/**
 * Create resources in dependency order.
 */
const createResources = (
  service: string,
  module: Record<string, unknown>,
  graph: DependencyGraph,
  resourceTypes: string[],
) =>
  Effect.gen(function* () {
    const resourceGraph: ResourceGraph = {
      resources: new Map(),
      creationOrder: [],
    };

    yield* Console.log("📦 Creating resources in dependency order...\n");

    for (const resourceType of resourceTypes) {
      const resource = graph.resources[resourceType];
      if (!resource?.operations.create) continue;

      const createOpName = resource.operations.create;
      const createOp = graph.operations[createOpName];
      if (!createOp) continue;

      // Check if dependencies are satisfied
      let canCreate = true;
      for (const [, fieldInfo] of Object.entries(createOp.inputs)) {
        if (!fieldInfo.required || !fieldInfo.references) continue;
        if (!resourceGraph.resources.has(fieldInfo.references)) {
          // Check if it's in our list to create
          if (resourceTypes.includes(fieldInfo.references)) {
            canCreate = false;
            break;
          }
        }
      }

      if (!canCreate) {
        yield* Console.log(
          `   ⏭️  Skip ${resourceType} (missing dependencies)`,
        );
        continue;
      }

      yield* Console.log(`   📦 Creating ${resourceType}...`);

      const inputs = buildCreateInputs(
        service,
        graph,
        createOp,
        resourceGraph.resources,
      );
      const result = yield* callOp(module, createOpName, inputs);

      if (!result.success) {
        yield* Console.log(
          `      ❌ Failed: ${result.errorTag || result.error}`,
        );
        continue;
      }

      const id = extractResourceId(resourceType, result.result);
      if (!id) {
        yield* Console.log(`      ❌ Could not extract ID from response`);
        yield* Console.log(
          `      Response: ${JSON.stringify(result.result, null, 2).slice(0, 500)}`,
        );
        continue;
      }

      yield* Console.log(`      ✅ Created: ${id}`);

      // Collect parent IDs for this resource
      const parentIds: Record<string, string> = {};
      for (const [, fieldInfo] of Object.entries(createOp.inputs)) {
        if (fieldInfo.references) {
          const parent = resourceGraph.resources.get(fieldInfo.references);
          if (parent) {
            parentIds[fieldInfo.references] = parent.id;
          }
        }
      }

      resourceGraph.resources.set(resourceType, {
        resourceType,
        id,
        createOp: createOpName,
        deleteOp: resource.operations.delete,
        parentIds,
      });
      resourceGraph.creationOrder.push(resourceType);
    }

    return resourceGraph;
  });

/**
 * Try to delete resources in wrong order (parents before children).
 * This should trigger DependencyViolation errors.
 */
const tryWrongOrderDeletion = (
  service: string,
  module: Record<string, unknown>,
  graph: DependencyGraph,
  resourceGraph: ResourceGraph,
  tracker: ReturnType<typeof createErrorTracker>,
) =>
  Effect.gen(function* () {
    yield* Console.log(
      "\n🔥 Attempting wrong-order deletion (parents first)...\n",
    );

    // Try to delete in creation order (wrong - should be reverse)
    for (const resourceType of resourceGraph.creationOrder) {
      const resource = resourceGraph.resources.get(resourceType);
      if (!resource || !resource.deleteOp) continue;

      const deleteOp = graph.operations[resource.deleteOp];
      if (!deleteOp) continue;

      // Check if this resource has children still in the graph
      const hasChildren = [...resourceGraph.resources.values()].some((r) =>
        Object.keys(r.parentIds).includes(resourceType),
      );

      if (!hasChildren) {
        yield* Console.log(
          `   ⏭️  Skip ${resourceType} (no children to cause conflict)`,
        );
        continue;
      }

      yield* Console.log(
        `   🗑️  Trying to delete ${resourceType} (${resource.id})...`,
      );

      const inputs = buildDeleteInputs(graph, deleteOp, resource.id);
      const result = yield* callOp(module, resource.deleteOp, inputs);

      if (!result.success) {
        const errorTag = result.errorTag || result.error || "Unknown";
        const isDependencyError =
          errorTag.includes("Dependency") ||
          errorTag.includes("InUse") ||
          errorTag.includes("HasAttachments") ||
          errorTag.includes("Attached") ||
          errorTag.includes("Associated");

        if (isDependencyError) {
          yield* Console.log(`      🆕 DependencyViolation: ${errorTag}`);
          tracker.newErrors.push({
            operation: resource.deleteOp,
            error: errorTag,
          });
          yield* recordError(service, resource.deleteOp, errorTag);
        } else {
          yield* Console.log(`      ❌ Other error: ${errorTag}`);
        }
      } else {
        yield* Console.log(
          `      ⚠️ Unexpectedly succeeded - removing from graph`,
        );
        resourceGraph.resources.delete(resourceType);
      }
    }
  });

/**
 * Get the proper deletion order based on actual tracked dependencies.
 * Resources with no parents should be deleted first (they're leaves).
 * Then work backwards to roots.
 */
const getProperDeletionOrder = (resourceGraph: ResourceGraph): string[] => {
  const remaining = new Set(resourceGraph.creationOrder);
  const order: string[] = [];

  while (remaining.size > 0) {
    // Find resources that have no children remaining
    const deletable: string[] = [];

    for (const resourceType of remaining) {
      const resource = resourceGraph.resources.get(resourceType);
      if (!resource) continue;

      // Check if any remaining resource depends on this one
      const hasRemainingChildren = [...resourceGraph.resources.values()].some(
        (r) =>
          remaining.has(r.resourceType) &&
          r.resourceType !== resourceType &&
          Object.keys(r.parentIds).includes(resourceType),
      );

      if (!hasRemainingChildren) {
        deletable.push(resourceType);
      }
    }

    // If we couldn't find any deletable resources, we have a cycle or other issue
    // Just take the last created resource
    if (deletable.length === 0 && remaining.size > 0) {
      const last = [...remaining].pop()!;
      deletable.push(last);
    }

    for (const type of deletable) {
      order.push(type);
      remaining.delete(type);
    }
  }

  return order;
};

/**
 * Delete implicit children that AWS creates automatically.
 * For example, IPAM creates default scopes that must be deleted first.
 */
const deleteImplicitChildren = (
  module: Record<string, unknown>,
  resourceType: string,
  resourceId: string,
) =>
  Effect.gen(function* () {
    // IPAM creates default scopes automatically
    if (resourceType === "Ipam") {
      const describeScopes = module["describeIpamScopes"];
      if (typeof describeScopes === "function") {
        const result = yield* (
          describeScopes({ IpamId: resourceId }) as Effect.Effect<any, any, any>
        ).pipe(Effect.catchAll(() => Effect.succeed({ IpamScopes: [] })));
        const scopes = result?.IpamScopes || [];
        const deleteScope = module["deleteIpamScope"];
        if (typeof deleteScope === "function") {
          for (const scope of scopes) {
            if (scope.IpamScopeId && !scope.IsDefault) {
              yield* Console.log(
                `      🔍 Deleting implicit IpamScope: ${scope.IpamScopeId}`,
              );
              yield* (
                deleteScope({
                  IpamScopeId: scope.IpamScopeId,
                }) as Effect.Effect<any, any, any>
              ).pipe(Effect.catchAll(() => Effect.succeed(null)));
            }
          }
        }
      }
    }

    // IpamScope may have pools
    if (resourceType === "IpamScope") {
      const describePools = module["describeIpamPools"];
      if (typeof describePools === "function") {
        const result = yield* (
          describePools({}) as Effect.Effect<any, any, any>
        ).pipe(Effect.catchAll(() => Effect.succeed({ IpamPools: [] })));
        const pools = (result?.IpamPools || []).filter(
          (p: any) => p.IpamScopeId === resourceId,
        );
        const deletePool = module["deleteIpamPool"];
        if (typeof deletePool === "function") {
          for (const pool of pools) {
            if (pool.IpamPoolId) {
              yield* Console.log(
                `      🔍 Deleting implicit IpamPool: ${pool.IpamPoolId}`,
              );
              yield* (
                deletePool({ IpamPoolId: pool.IpamPoolId }) as Effect.Effect<
                  any,
                  any,
                  any
                >
              ).pipe(Effect.catchAll(() => Effect.succeed(null)));
            }
          }
        }
      }
    }
  });

/**
 * Clean up resources in correct order (children before parents).
 * Makes multiple passes to handle async state issues.
 */
const cleanupResources = (
  module: Record<string, unknown>,
  graph: DependencyGraph,
  resourceGraph: ResourceGraph,
) =>
  Effect.gen(function* () {
    yield* Console.log("\n🧹 Cleaning up (children first, then parents)...\n");

    const maxPasses = 5;

    for (let pass = 1; pass <= maxPasses; pass++) {
      if (resourceGraph.resources.size === 0) break;

      if (pass > 1) {
        yield* Console.log(`\n   🔄 Cleanup pass ${pass}...\n`);
        yield* Effect.sleep("10 seconds"); // Wait for async state transitions
      }

      // Compute deletion order based on tracked dependencies
      const deletionOrder = getProperDeletionOrder(resourceGraph);

      for (const resourceType of deletionOrder) {
        const resource = resourceGraph.resources.get(resourceType);
        if (!resource || !resource.deleteOp) continue;

        const deleteOp = graph.operations[resource.deleteOp];
        if (!deleteOp) continue;

        // First, try to delete any implicit children
        yield* deleteImplicitChildren(module, resourceType, resource.id);

        yield* Console.log(
          `   🗑️  Deleting ${resourceType} (${resource.id})...`,
        );

        const inputs = buildDeleteInputs(graph, deleteOp, resource.id);
        const result = yield* callOpWithRetry(
          module,
          resource.deleteOp,
          inputs,
        );

        if (!result.success) {
          const errorTag = result.errorTag || result.error;
          // If it's a dependency error, we'll try again in the next pass
          if (
            errorTag?.includes("Dependency") ||
            errorTag?.includes("InUse") ||
            errorTag?.includes("IncorrectState")
          ) {
            yield* Console.log(`      ⏳ Deferred: ${errorTag}`);
          } else {
            yield* Console.log(`      ❌ Failed: ${errorTag}`);
          }
        } else {
          yield* Console.log(`      ✅ Deleted`);
          resourceGraph.resources.delete(resourceType);
        }
      }
    }

    // Report any remaining resources
    if (resourceGraph.resources.size > 0) {
      yield* Console.log(
        `\n   ⚠️ ${resourceGraph.resources.size} resources could not be deleted:`,
      );
      for (const [type, resource] of resourceGraph.resources) {
        yield* Console.log(`      - ${type}: ${resource.id}`);
      }
    }
  });

// ============================================================================
// Analysis
// ============================================================================

const analyzeTopology = (service: string) =>
  Effect.gen(function* () {
    const graph = yield* buildDependencyGraph(service);
    const spec = yield* loadSpec(service);

    yield* Console.log(`\n📊 Topology Analysis for ${service}\n`);

    // Find all creatable resources
    const creatable = findCreatableResources(graph);
    const creationOrder = sortForCreation(creatable);

    yield* Console.log(`Resources with create operations: ${creatable.length}`);
    yield* Console.log(`Creation order (topologically sorted):`);

    for (const resourceType of creationOrder.slice(0, 20)) {
      const info = creatable.find((c) => c.resource === resourceType)!;
      const deps =
        info.dependencies.length > 0
          ? ` (depends: ${info.dependencies.join(", ")})`
          : "";
      const deleteOp = graph.resources[resourceType]?.operations.delete;
      const hasDelete = deleteOp ? "✓" : "✗";
      yield* Console.log(`  ${hasDelete} ${resourceType}${deps}`);
    }

    if (creationOrder.length > 20) {
      yield* Console.log(`  ... and ${creationOrder.length - 20} more`);
    }

    // Analyze dependency violation coverage
    yield* Console.log(`\n📊 DependencyViolation Coverage:`);

    let expectedDepViolation = 0;
    let hasDepViolation = 0;
    const missingDepViolation: string[] = [];

    for (const resourceType of creationOrder) {
      const resource = graph.resources[resourceType];
      if (!resource?.operations.delete) continue;

      const deleteOpName = resource.operations.delete;
      const dependents = getDependents(graph, resourceType);

      if (dependents.length > 0) {
        expectedDepViolation++;
        const errors =
          (spec.operations[deleteOpName]?.errors as string[]) || [];
        const hasDep = errors.some(
          (e) => e.includes("Dependency") || e.includes("InUse"),
        );

        if (hasDep) {
          hasDepViolation++;
        } else {
          missingDepViolation.push(
            `${deleteOpName} (dependents: ${dependents.join(", ")})`,
          );
        }
      }
    }

    yield* Console.log(
      `  Expected to have DependencyViolation: ${expectedDepViolation}`,
    );
    yield* Console.log(
      `  Actually have DependencyViolation: ${hasDepViolation}`,
    );
    yield* Console.log(`  Missing: ${missingDepViolation.length}`);

    if (missingDepViolation.length > 0) {
      yield* Console.log(`\nOperations missing DependencyViolation:`);
      for (const op of missingDepViolation.slice(0, 15)) {
        yield* Console.log(`  ${op}`);
      }
      if (missingDepViolation.length > 15) {
        yield* Console.log(`  ... and ${missingDepViolation.length - 15} more`);
      }
    }
  });

// ============================================================================
// CLI
// ============================================================================

const serviceArg = Args.text({ name: "service" }).pipe(
  Args.withDescription("The AWS service to walk"),
);

const dryRunOption = Options.boolean("dry-run").pipe(
  Options.withAlias("d"),
  Options.withDescription("Show what would be created/tested"),
  Options.withDefault(false),
);

const noCleanupOption = Options.boolean("no-cleanup").pipe(
  Options.withAlias("n"),
  Options.withDescription("Don't clean up resources after testing"),
  Options.withDefault(false),
);

const analyzeOption = Options.boolean("analyze").pipe(
  Options.withAlias("a"),
  Options.withDescription("Analyze topology without creating resources"),
  Options.withDefault(false),
);

const limitOption = Options.integer("limit").pipe(
  Options.withAlias("l"),
  Options.withDescription("Limit number of resources to create"),
  Options.withDefault(20),
);

const focusOption = Options.text("focus").pipe(
  Options.withAlias("f"),
  Options.withDescription(
    "Focus on specific parent resources (comma-separated)",
  ),
  Options.optional,
);

const walkCommand = Command.make(
  "walk",
  {
    service: serviceArg,
    dryRun: dryRunOption,
    noCleanup: noCleanupOption,
    analyze: analyzeOption,
    limit: limitOption,
  },
  ({ service, dryRun, noCleanup, analyze, limit }) =>
    Effect.gen(function* () {
      yield* Console.log(`\n🚶 Dependency Conflict Discovery for ${service}\n`);

      if (analyze) {
        yield* analyzeTopology(service);
        return;
      }

      // Build topology
      yield* Console.log("📊 Building topology...");
      const graph = yield* buildDependencyGraph(service);

      // Find creatable resources
      const creatable = findCreatableResources(graph);
      const creationOrder = sortForCreation(creatable);

      yield* Console.log(`   Found ${creatable.length} creatable resources`);

      if (dryRun) {
        yield* Console.log("\n📋 DRY RUN - Would create in this order:\n");
        for (const resourceType of creationOrder.slice(0, limit)) {
          const info = creatable.find((c) => c.resource === resourceType)!;
          const deps =
            info.dependencies.length > 0
              ? ` → ${info.dependencies.join(", ")}`
              : "";
          yield* Console.log(`  ${resourceType}${deps}`);
        }
        yield* Console.log("\nThen would try wrong-order deletion:");
        yield* Console.log("  Parents before children → DependencyViolation");
        return;
      }

      // Load service module
      yield* Console.log("📦 Loading service module...");
      const serviceModule = yield* Effect.tryPromise({
        try: () => import(`../../src/services/${service}.ts`),
        catch: (e) => new Error(`Failed to load service: ${e}`),
      });

      const tracker = createErrorTracker();

      // Limit resources to create
      const resourcesToCreate = creationOrder.slice(0, limit);

      // Phase 1: Create
      const resourceGraph = yield* createResources(
        service,
        serviceModule as Record<string, unknown>,
        graph,
        resourcesToCreate,
      );

      // Phase 2: Wrong-order deletion
      yield* tryWrongOrderDeletion(
        service,
        serviceModule as Record<string, unknown>,
        graph,
        resourceGraph,
        tracker,
      );

      // Phase 3: Cleanup
      if (!noCleanup) {
        yield* cleanupResources(
          serviceModule as Record<string, unknown>,
          graph,
          resourceGraph,
        );
      } else {
        yield* Console.log("\n⚠️ Skipping cleanup (--no-cleanup)");
      }

      // Summary
      yield* Console.log(`\n📊 Summary:`);
      yield* Console.log(
        `   Resources created: ${resourceGraph.creationOrder.length}`,
      );
      yield* Console.log(
        `   New dependency errors: ${tracker.newErrors.length}`,
      );

      if (tracker.newErrors.length > 0) {
        const byError = new Map<string, string[]>();
        for (const { operation, error } of tracker.newErrors) {
          if (!byError.has(error)) byError.set(error, []);
          byError.get(error)!.push(operation);
        }
        for (const [error, ops] of byError) {
          yield* Console.log(`   🆕 ${error}: ${ops.join(", ")}`);
        }
        yield* Console.log(
          `\n   Run 'bun generate --sdk ${service}' to regenerate SDK`,
        );
      }
      yield* Console.log("");
    }),
);

// ============================================================================
// Run
// ============================================================================

const cli = Command.run(walkCommand, {
  name: "walk",
  version: "1.0.0",
});

const platform = Layer.mergeAll(
  NodeContext.layer,
  FetchHttpClient.layer,
  Logger.pretty,
);

const awsLayer = Credentials.fromChain();

cli(process.argv).pipe(
  Effect.provide(platform),
  Effect.provide(awsLayer),
  Effect.provideService(Region, "us-east-1"),
  // ts-expect-error
  Logger.withMinimumLogLevel(
    process.env.DEBUG ? LogLevel.Debug : LogLevel.Info,
  ),
  NodeRuntime.runMain,
);

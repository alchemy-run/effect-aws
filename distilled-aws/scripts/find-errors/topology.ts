/**
 * Dependency graph builder for AWS services.
 *
 * Analyzes Smithy models to identify resources and their relationships,
 * enabling systematic exploration of the API space to discover missing errors.
 */

import { FileSystem, Path } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";

/**
 * Convert PascalCase to camelCase.
 * This matches how our SDK exports operation functions.
 */
const toCamelCase = (s: string): string =>
  s.charAt(0).toLowerCase() + s.slice(1);

/** Operation types */
export type OperationType =
  | "create"
  | "read"
  | "list"
  | "update"
  | "detach" // Disassociate/Detach (run before delete)
  | "delete"
  | "action" // Invokes something but doesn't persist CRUD state
  | "other";

/**
 * A resource in the service (e.g., Vpc, Subnet, Bucket).
 */
export interface Resource {
  /** The primary identifier field name (e.g., "VpcId") */
  identifier: string | null;
  /** CRUD operations for this resource */
  operations: {
    create: string | null;
    read: string | null;
    list: string | null;
    update: string[];
    /** Operations that detach/disassociate before deletion (run these first) */
    detach: string[];
    /** The actual delete operation (run after detach) */
    delete: string | null;
  };
}

/**
 * An input property for an operation.
 */
export interface OperationInput {
  /** Whether this input is required */
  required: boolean;
  /** The Smithy type (e.g., "String", "Integer", "Boolean") */
  type: string;
  /** If this references another resource, the resource name */
  references?: string;
}

/**
 * An operation in the service (e.g., CreateVpc, DeleteSubnet).
 */
export interface Operation {
  /** The resource this operation targets */
  resource: string;
  /** The type of operation */
  type: OperationType;
  /** All input properties for this operation */
  inputs: Record<string, OperationInput>;
  /** Output properties returned by this operation */
  outputs: string[];
}

/**
 * The complete dependency graph for a service.
 */
export interface DependencyGraph {
  /** All resources in the service */
  resources: Record<string, Resource>;
  /** All operations in the service */
  operations: Record<string, Operation>;
}

/**
 * Minimal Smithy model types for parsing.
 * We use a simplified schema since we only need operation and structure shapes.
 */
const SmithyMember = S.Struct({
  target: S.String,
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

const SmithyShape = S.Struct({
  type: S.String,
  input: S.optional(S.Struct({ target: S.String })),
  output: S.optional(S.Struct({ target: S.String })),
  members: S.optional(S.Record({ key: S.String, value: SmithyMember })),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

const SmithyModel = S.Struct({
  shapes: S.Record({ key: S.String, value: SmithyShape }),
});

type SmithyModelType = typeof SmithyModel.Type;

/**
 * Fields to skip when detecting foreign key references.
 * These are common fields that look like FKs but aren't resource references.
 */
const SKIP_FK_PATTERNS = [
  "Client",
  "Idempotency",
  "Account",
  "Owner",
  "Availability",
  "Zone",
  "Kms",
  "Request",
  "Dry",
];

/** Prefixes that indicate a create operation */
export const CREATE_PREFIXES = [
  // Primary create patterns
  "Create", // 1993 ops
  "Run", // 7 ops - RunJobFlow, RunInstances
  "Allocate", // 9 ops - AllocateStaticIp
  "Register", // 75 ops - RegisterStreamConsumer
  "Import", // 53 ops - creates from external source
  "Copy", // 33 ops - creates a copy
  "Clone", // 2 ops
  "Provision", // 8 ops
  "Purchase", // 15 ops - creates reservation
  "Start", // 427 ops - starts a job/task (creates resource)
  "Initiate", // 7 ops - InitiateJob
  "Open", // 2 ops - OpenTunnel
  "Launch", // 1 op - LaunchInstances
  "Deploy", // 2 ops
  "Install", // 1 op
  "Instantiate", // 1 op
  "Bundle", // 1 op
  "Issue", // 1 op - IssueCertificate
  "Compose", // 1 op - ComposeEnvironments
  // Relationship creation
  "Associate", // 197 ops - creates association
  "Attach", // 33 ops - creates attachment
  "Link", // implicit in some services
  "Subscribe", // 5 ops - creates subscription
  "Add", // 89 ops - adds to collection (creates relationship)
  "Connect", // 3 ops - ConnectDirectory
  "Peer", // 1 op - PeerVpc
  "Join", // 3 ops - JoinDomain
  "Group", // 1 op - GroupResources
  // Permission creation
  "Authorize", // 12 ops - creates permission
  "Grant", // 2 ops - creates grant
  "Invite", // 5 ops - creates invitation
  "Share", // 1 op - creates share
  "Allow", // 1 op
];

/** Prefixes that indicate a detach/disassociate operation (run before delete) */
export const DETACH_PREFIXES = [
  // Relationship removal (run these before delete)
  "Disassociate", // 192 ops - removes association
  "Dissociate", // 5 ops - DissociatePackage
  "Detach", // 33 ops - removes attachment
  "Disconnect", // 7 ops - DisconnectParticipant
  "Unlink", // 2 ops
  "Unsubscribe", // 4 ops - removes subscription
  "Unpeer", // 1 op - UnpeerVpc
  "Ungroup", // 1 op - UngroupResources
  "Unregister", // 1 op - UnregisterConnector
  "Unmonitor", // 1 op - UnmonitorInstances
  // Permission removal
  "Revoke", // 23 ops - removes permission
  "Deauthorize", // 3 ops
  "Unshare", // 2 ops
];

/** Prefixes that indicate a delete operation (actual resource deletion) */
export const DELETE_PREFIXES = [
  // Primary delete patterns
  "Delete", // 2182 ops
  "Cancel", // 126 ops - CancelCapacityReservation
  "Release", // 8 ops - ReleaseStaticIp
  "Terminate", // 20 ops - TerminateInstances
  "Deregister", // 52 ops
  "Remove", // 86 ops
  "Deprovision", // 5 ops
  "Abort", // 6 ops - AbortMultipartUpload
  "Expire", // 2 ops
  "Retire", // 1 op
  "Stop", // 192 ops - stops a job/task (deletes resource)
  "Close", // 4 ops
  "Purge", // 1 op
  "Dispose", // 1 op
  "Discard", // 1 op
  "Forget", // 1 op
  "Shutdown", // 1 op - ShutdownGateway
  "Undeploy", // 1 op - UndeploySystemInstance
  "Evict", // 1 op - EvictFilesFailingUpload
  "Return", // 1 op - ReturnSavingsPlan
  "Leave", // 1 op - LeaveOrganization
  // Terminal state changes
  "Reject", // 34 ops - often terminates a pending resource
  "Decline", // 4 ops
  "Deny", // 1 op
  "Dismiss", // 1 op - DismissUserContact
  "Invalidate", // 1 op - InvalidateProjectCache
  "Withdraw", // 2 ops - WithdrawByoipCidr
];

/** Prefixes that indicate an update operation */
export const UPDATE_PREFIXES = [
  // Primary update patterns
  "Update", // 1676 ops
  "Put", // 465 ops
  "Modify", // 189 ops
  "Set", // 69 ops
  "Replace", // 10 ops
  "Reset", // 38 ops
  "Configure", // 6 ops
  "Rotate", // 6 ops
  "Change", // 8 ops
  "Rename", // 2 ops
  "Apply", // 11 ops
  "Define", // 4 ops - DefineAnalysisScheme
  "Initialize", // 4 ops - InitializeCluster
  "Setup", // 1 op - SetupInstanceHttps
  "Populate", // 1 op - PopulateIdMappingTable
  // State changes
  "Enable", // 84 ops
  "Disable", // 82 ops
  "Activate", // 12 ops
  "Deactivate", // 11 ops
  "Suspend", // 3 ops
  "Resume", // 13 ops
  "Pause", // 6 ops
  "Lock", // 2 ops
  "Unlock", // 2 ops
  "Flush", // 3 ops - FlushStageCache
  "Clear", // 2 ops - ClearDefaultAuthorizer
  // Lifecycle state changes
  "Accept", // 45 ops - accepts pending resource
  "Confirm", // 11 ops
  "Approve", // 2 ops
  "Complete", // 13 ops
  // Recovery/restore
  "Restore", // 41 ops
  "Recover", // implicit
  "Rollback", // 6 ops
  "Backtrack", // 1 op - BacktrackDBCluster
  "Reboot", // 19 ops
  "Restart", // 4 ops
  "Refresh", // 4 ops
  "Rebuild", // 2 ops
  "Resize", // 1 op
  "Upgrade", // 8 ops
  "Migrate", // 1 op
  "Convert", // 1 op - ConvertRecoveryPointToSnapshot
  // Reorganization
  "Failover", // 9 ops
  "Switchover", // 5 ops
  "Promote", // 6 ops
  "Move", // 5 ops
  "Transfer", // 5 ops
  "Merge", // 9 ops
  "Rebalance", // 1 op
  "Reorder", // 1 op
  "Split", // 1 op - SplitShard
  "Swap", // 1 op - SwapEnvironmentCNAMEs
  "Reverse", // 2 ops - ReverseReplication
  // Scaling
  "Increase", // 4 ops - IncreaseReplicationFactor
  "Decrease", // 4 ops - DecreaseReplicationFactor
  // Archive
  "Archive", // 3 ops
  "Unarchive", // 3 ops
  // Other modifications
  "Mark", // 1 op
  "Override", // 2 ops
  "Assign", // 5 ops
  "Unassign", // 3 ops
  "Deprecate", // 6 ops
  "Undeprecate", // 3 ops
  "Label", // 1 op - LabelParameterVersion
  "Unlabel", // 1 op - UnlabelParameterVersion
  "Redact", // 3 ops - RedactConversationMessage
  "Manage", // 2 ops - ManagePropertygraphStatistics
  "Amend", // 1 op - AmendBenefitApplication
  "Recall", // 1 op - RecallBenefitApplication
  "Replicate", // 3 ops - ReplicateInstance
  "Advertise", // 2 ops - AdvertiseByoipCidr
  "Regenerate", // 1 op - RegenerateSecurityToken
  "Opt", // 2 ops - OptInPhoneNumber
];

/** Prefixes that indicate a read (single resource) operation */
export const READ_PREFIXES = [
  "Get", // 2598 ops
  "Describe", // 1721 ops
  "Head", // 2 ops - metadata only
  "Lookup", // 3 ops
  "Check", // 11 ops
  "Retrieve", // 10 ops
  "Download", // 2 ops
  "View", // 1 op
  "Is", // 4 ops - IsVpcPeered, etc.
  "Carrier", // 1 op - CarrierLookup
  "Phone", // 1 op - PhoneNumberValidate
];

/** Prefixes that indicate a list (multiple resources) operation */
export const LIST_PREFIXES = [
  "List", // 3028 ops
  "Search", // 106 ops
  "Query", // 11 ops
  "Scan", // 3 ops
  "Discover", // 5 ops
  "Count", // 5 ops
  "Filter", // 1 op
  "Select", // 3 ops
];

/** Prefixes that indicate an action operation (invokes something, no persistent CRUD) */
export const ACTION_PREFIXES = [
  // Invocation
  "Send", // 66 ops
  "Invoke", // 21 ops
  "Execute", // 24 ops
  "Notify", // 10 ops
  "Publish", // 15 ops
  "Submit", // 12 ops
  "Post", // 10 ops
  "Push", // 1 op
  "Deliver", // 1 op
  "Channel", // 1 op - ChannelFlowCallback
  "Receive", // 1 op - ReceiveMessage
  // Testing/validation
  "Test", // 32 ops
  "Validate", // 17 ops
  "Verify", // 19 ops
  "Simulate", // 2 ops
  "Preview", // 3 ops
  "Probe", // 1 op
  // Generation/computation
  "Generate", // 28 ops
  "Detect", // 22 ops
  "Predict", // 3 ops
  "Analyze", // 3 ops
  "Recognize", // 3 ops
  "Classify", // 1 op
  "Calculate", // 5 ops
  "Estimate", // 1 op
  "Compare", // 1 op
  "Infer", // 3 ops
  "Evaluate", // 8 ops
  "Resolve", // 5 ops
  "Synthesize", // 1 op
  "Render", // 2 ops
  "Optimize", // 2 ops
  "Translate", // 4 ops - TranslateDocument
  "Forecast", // 1 op - ForecastGeofenceEvents
  "Rerank", // 1 op
  "Rescore", // 1 op
  "Contains", // 1 op - ContainsPiiEntities
  "Suggest", // 2 ops
  "Autocomplete", // 1 op
  // Geospatial
  "Geocode", // 1 op
  "Snap", // 1 op - SnapToRoads
  // Polling/acknowledgment
  "Poll", // 5 ops
  "Respond", // 5 ops
  "Acknowledge", // 2 ops
  "Record", // 3 ops
  "Report", // 3 ops
  "Signal", // 3 ops
  "Provide", // 1 op - ProvideAnomalyFeedback
  "Vote", // 1 op - VoteOnProposal
  // Retry/redo
  "Retry", // 8 ops
  "Redrive", // 1 op
  "Resend", // 4 ops
  "Resync", // 1 op
  "Reload", // 2 ops
  "Synchronize", // 1 op - SynchronizeGatewayTargets
  "Sync", // 1 op - SyncResource
  // Encryption
  "Encrypt", // 2 ops
  "Decrypt", // 2 ops
  "Re", // 2 ops - ReEncrypt
  "Sign", // 3 ops
  "Derive", // 1 op
  "Decode", // 1 op - DecodeAuthorizationMessage
  // Conversation/streaming
  "Converse", // 2 ops
  "Chat", // 2 ops
  // Auth
  "Logout", // 2 ops
  "Forgot", // 1 op - ForgotPassword
  "Global", // 1 op - GlobalSignOut
  "Exchange", // 1 op - ExchangeCodeForToken
  // State transitions
  "Enter", // 1 op - EnterStandby
  "Exit", // 1 op - ExitStandby
  "Skip", // 1 op - SkipWaitTimeForInstanceTermination
  "Take", // 1 op - TakeRouterInput
  "Monitor", // 2 ops - MonitorInstances
  "Checkpoint", // 1 op - CheckpointDurableExecution
  // Other actions
  "Export", // 34 ops
  "Upload", // 12 ops
  "Write", // 2 ops
  "Sample", // 1 op
  "Meter", // 1 op
  "Checkout", // 2 ops
  "Index", // 2 ops
  "Build", // 2 ops
  "Prepare", // 3 ops
  "Finalize", // 1 op
  "Continue", // 2 ops
  "Request", // 9 ops
  "Claim", // 3 ops
  "Reserve", // 1 op
  "Renew", // 3 ops
  "Extend", // 2 ops
  "Schedule", // 2 ops
  "Assume", // 12 ops
  "Transact", // 2 ops
  "Commit", // 2 ops
  "Begin", // 1 op
  "End", // 1 op
  "Bulk", // 1 op - BulkPublish
  "Distribute", // 2 ops - DistributeImage
  "Ingest", // 1 op - IngestKnowledgeBaseDocuments
  "Reimport", // 1 op - ReimportApi
];

/** Prefixes we intentionally skip (metadata operations, batch wrappers, etc.) */
export const SKIPPED_PREFIXES = [
  "Tag", // 295 ops - metadata, not resource
  "Untag", // 295 ops - metadata
  "Batch", // 267 ops - composite wrapper
  "Admin", // 26 ops - admin variants of other ops
];

/** All prefixes that indicate resource operations */
const RESOURCE_PREFIXES = [
  ...CREATE_PREFIXES,
  ...DETACH_PREFIXES,
  ...DELETE_PREFIXES,
  ...UPDATE_PREFIXES,
  ...READ_PREFIXES,
  ...LIST_PREFIXES,
  ...ACTION_PREFIXES,
];

/** All known prefixes */
export const ALL_KNOWN_PREFIXES = [...RESOURCE_PREFIXES, ...SKIPPED_PREFIXES];

/**
 * Extract resource name from an operation name.
 * CreateVpc -> Vpc, DeleteBucket -> Bucket, CancelCapacityReservation -> CapacityReservation
 */
const extractResourceName = (opName: string): string | null => {
  for (const prefix of RESOURCE_PREFIXES) {
    if (opName.startsWith(prefix)) {
      return opName.slice(prefix.length);
    }
  }
  return null;
};

/**
 * Normalize a field name to extract the referenced resource.
 * VpcId -> Vpc, SubnetIds -> Subnet, Bucket -> Bucket
 */
const normalizeResourceRef = (fieldName: string): string => {
  let resource = fieldName.replace(/(Id|Ids|Arn|Arns)$/, "").replace(/s$/, ""); // Remove trailing 's' for plurals
  // Handle edge case where field ends in 'ss'
  if (fieldName.endsWith("ss")) {
    resource = fieldName.replace(/(Id|Ids|Arn|Arns)$/, "");
  }
  return resource;
};

/**
 * Check if a field should be skipped as a foreign key.
 */
const shouldSkipField = (fieldName: string): boolean => {
  const lower = fieldName.toLowerCase();
  return SKIP_FK_PATTERNS.some((pattern) =>
    lower.includes(pattern.toLowerCase()),
  );
};

/**
 * Check if a field looks like a foreign key reference.
 */
const isForeignKeyField = (fieldName: string): boolean => {
  return (
    fieldName.endsWith("Id") ||
    fieldName.endsWith("Ids") ||
    fieldName.endsWith("Arn") ||
    fieldName.endsWith("Arns") ||
    fieldName.endsWith("Name")
  );
};

/**
 * Determine the operation type from its name.
 */
export const getOperationType = (opName: string): OperationType => {
  for (const prefix of CREATE_PREFIXES) {
    if (opName.startsWith(prefix)) return "create";
  }
  // Check detach BEFORE delete (Disassociate comes before Delete alphabetically too)
  for (const prefix of DETACH_PREFIXES) {
    if (opName.startsWith(prefix)) return "detach";
  }
  for (const prefix of DELETE_PREFIXES) {
    if (opName.startsWith(prefix)) return "delete";
  }
  for (const prefix of UPDATE_PREFIXES) {
    if (opName.startsWith(prefix)) return "update";
  }
  for (const prefix of READ_PREFIXES) {
    if (opName.startsWith(prefix)) return "read";
  }
  for (const prefix of LIST_PREFIXES) {
    if (opName.startsWith(prefix)) return "list";
  }
  for (const prefix of ACTION_PREFIXES) {
    if (opName.startsWith(prefix)) return "action";
  }
  return "other";
};

/**
 * Build the dependency graph from a parsed Smithy model.
 */
const buildGraphFromModel = (model: SmithyModelType): DependencyGraph => {
  const resources: Record<string, Resource> = {};
  const operations: Record<string, Operation> = {};

  // Build a set of known resource names (lowercase for case-insensitive matching)
  const knownResources = new Set<string>();

  // First pass: collect all resource names from operation names
  for (const [shapeId, shape] of Object.entries(model.shapes)) {
    if (shape.type !== "operation") continue;
    const opNamePascal = shapeId.split("#")[1];
    if (!opNamePascal) continue;
    const resourceName = extractResourceName(opNamePascal);
    if (resourceName) {
      knownResources.add(resourceName.toLowerCase());
    }
  }

  /**
   * Check if a field references a known resource.
   * Returns the resource name if found, undefined otherwise.
   */
  const findResourceReference = (
    fieldName: string,
    resourceName: string,
    opType: OperationType,
  ): string | undefined => {
    if (shouldSkipField(fieldName)) return undefined;

    // Check traditional FK patterns (VpcId, SubnetIds, etc.)
    if (isForeignKeyField(fieldName)) {
      const refResource = normalizeResourceRef(fieldName);
      // Skip self-references for create operations
      if (
        opType === "create" &&
        refResource.toLowerCase() === resourceName.toLowerCase()
      ) {
        return undefined;
      }
      return refResource;
    }

    // Check if field name exactly matches a known resource name
    const fieldLower = fieldName.toLowerCase();
    if (knownResources.has(fieldLower)) {
      // Skip self-references for create operations
      if (opType === "create" && fieldLower === resourceName.toLowerCase()) {
        return undefined;
      }
      // Return the properly cased resource name
      // Find the original casing from the set (we'll use PascalCase convention)
      return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }

    return undefined;
  };

  // Second pass: process all operations
  for (const [shapeId, shape] of Object.entries(model.shapes)) {
    if (shape.type !== "operation") continue;

    const opNamePascal = shapeId.split("#")[1];
    if (!opNamePascal) continue;

    // Convert to camelCase to match SDK export names
    const opName = toCamelCase(opNamePascal);

    const resourceName = extractResourceName(opNamePascal);
    if (!resourceName) continue;

    // Skip non-resource operations (Tags, Messages, etc.)
    if (
      ["Tags", "Tag", "Message", "Messages", "Item", "Items"].includes(
        resourceName,
      )
    ) {
      continue;
    }

    // Ensure resource exists
    if (!resources[resourceName]) {
      resources[resourceName] = {
        identifier: null,
        operations: {
          create: null,
          read: null,
          list: null,
          update: [],
          detach: [],
          delete: null,
        },
      };
    }

    const opType = getOperationType(opNamePascal);

    // Update resource's CRUD operations
    switch (opType) {
      case "create":
        resources[resourceName].operations.create = opName;
        break;
      case "read":
        // Prefer Get/Describe over Head for the primary read operation
        if (
          !resources[resourceName].operations.read ||
          opNamePascal.startsWith("Get") ||
          opNamePascal.startsWith("Describe")
        ) {
          resources[resourceName].operations.read = opName;
        }
        break;
      case "list":
        // Prefer List over Search/Query for the primary list operation
        if (
          !resources[resourceName].operations.list ||
          opNamePascal.startsWith("List")
        ) {
          resources[resourceName].operations.list = opName;
        }
        break;
      case "update":
        resources[resourceName].operations.update.push(opName);
        break;
      case "detach":
        // Collect all detach operations (run before delete)
        resources[resourceName].operations.detach.push(opName);
        break;
      case "delete":
        // Prefer Delete* for the primary delete operation
        if (
          !resources[resourceName].operations.delete ||
          opNamePascal.startsWith("Delete")
        ) {
          resources[resourceName].operations.delete = opName;
        }
        break;
    }

    // Build operation entry with ALL inputs
    const inputs: Operation["inputs"] = {};
    const inputTarget = shape.input?.target;
    if (inputTarget) {
      const inputShape = model.shapes[inputTarget];
      if (inputShape?.members) {
        for (const [memberName, member] of Object.entries(inputShape.members)) {
          const isRequired = "smithy.api#required" in (member.traits ?? {});

          // Extract type from target (e.g., "smithy.api#String" -> "String")
          const targetType = member.target.split("#").pop() ?? "Unknown";

          // Check if this is a FK reference to another resource
          const references = findResourceReference(
            memberName,
            resourceName,
            opType,
          );

          inputs[memberName] = {
            required: isRequired,
            type: targetType,
            ...(references && { references }),
          };
        }
      }
    }

    // Extract output properties
    const outputs: string[] = [];
    const outputTarget = shape.output?.target;
    if (outputTarget && outputTarget !== "smithy.api#Unit") {
      const outputShape = model.shapes[outputTarget];
      if (outputShape?.members) {
        outputs.push(...Object.keys(outputShape.members));
      }
    }

    operations[opName] = {
      resource: resourceName,
      type: opType,
      inputs,
      outputs,
    };

    // Try to infer identifier from delete operation input
    if (opType === "delete" && inputTarget) {
      const inputShape = model.shapes[inputTarget];
      if (inputShape?.members) {
        // Look for a required field that matches the resource name
        for (const [memberName, member] of Object.entries(inputShape.members)) {
          const isRequired = "smithy.api#required" in (member.traits ?? {});
          if (!isRequired) continue;

          // Check if field name matches pattern like "VpcId" for "Vpc" resource
          const expectedId = `${resourceName}Id`;
          const expectedIds = `${resourceName}Ids`;
          if (memberName === expectedId || memberName === expectedIds) {
            resources[resourceName].identifier = memberName;
            break;
          }

          // Also check if field name exactly matches resource name (e.g., "Bucket" for Bucket)
          if (memberName.toLowerCase() === resourceName.toLowerCase()) {
            resources[resourceName].identifier = memberName;
            break;
          }
        }
      }
    }
  }

  // Merge plural/singular resource pairs (e.g., Vpc and Vpcs)
  // Only merge if we have evidence of both: singular has create/delete, plural has describe
  const resourceNames = Object.keys(resources);
  for (const plural of resourceNames) {
    if (!plural.endsWith("s")) continue;
    const singular = plural.slice(0, -1);
    if (!resources[singular]) continue;

    // Merge plural into singular
    const singularRes = resources[singular];
    const pluralRes = resources[plural];

    // Copy read/list from plural to singular if singular doesn't have them
    if (!singularRes.operations.read && pluralRes.operations.read) {
      singularRes.operations.read = pluralRes.operations.read;
    }
    if (!singularRes.operations.list && pluralRes.operations.list) {
      singularRes.operations.list = pluralRes.operations.list;
    }
    // Copy identifier if needed
    if (!singularRes.identifier && pluralRes.identifier) {
      singularRes.identifier = pluralRes.identifier;
    }
    // Merge detach operations
    for (const detachOp of pluralRes.operations.detach) {
      if (!singularRes.operations.detach.includes(detachOp)) {
        singularRes.operations.detach.push(detachOp);
      }
    }

    // Update operations to point to singular resource
    for (const opName of [
      pluralRes.operations.read,
      pluralRes.operations.list,
      ...pluralRes.operations.detach,
    ]) {
      if (opName && operations[opName]) {
        operations[opName].resource = singular;
      }
    }

    // Delete the plural resource
    delete resources[plural];
  }

  return { resources, operations };
};

/**
 * Get resources that depend on a given resource.
 * Useful for finding what would break if you delete a resource.
 */
export const getDependents = (
  graph: DependencyGraph,
  resourceName: string,
): string[] => {
  const dependents: string[] = [];

  for (const [opName, op] of Object.entries(graph.operations)) {
    if (op.type !== "create") continue;

    for (const [_field, ref] of Object.entries(op.inputs)) {
      if (ref.references === resourceName && ref.required) {
        dependents.push(op.resource);
        break;
      }
    }
  }

  return dependents;
};

/**
 * Get the creation order for resources (topologically sorted).
 */
export const getCreationOrder = (graph: DependencyGraph): string[] => {
  const order: string[] = [];
  const visited = new Set<string>();

  const visit = (resource: string) => {
    if (visited.has(resource)) return;
    visited.add(resource);

    // Find the create operation for this resource
    const createOp = graph.resources[resource]?.operations.create;
    if (createOp) {
      const op = graph.operations[createOp];
      if (op) {
        // Visit all dependencies first
        for (const ref of Object.values(op.inputs)) {
          if (ref.references && graph.resources[ref.references]) {
            visit(ref.references);
          }
        }
      }
    }
    order.push(resource);
  };

  for (const resource of Object.keys(graph.resources)) {
    visit(resource);
  }

  return order;
};

/**
 * Load a Smithy model for a service.
 * Searches in aws-models/models/{service}/service/{version}/{service}-{version}.json
 */
export const loadSmithyModel = (serviceName: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const p = yield* Path.Path;

    const baseModelPath = p.join(
      "aws-models",
      "models",
      serviceName,
      "service",
    );

    // Find the version folder (e.g., "2016-11-15" for EC2)
    const versions = yield* fs.readDirectory(baseModelPath);
    const version = versions[0];
    if (!version) {
      return yield* Effect.fail(
        new Error(`No version found for service: ${serviceName}`),
      );
    }

    const modelPath = p.join(
      baseModelPath,
      version,
      `${serviceName}-${version}.json`,
    );

    const content = yield* fs.readFileString(modelPath);
    return yield* S.decodeUnknown(S.parseJson(SmithyModel))(content);
  });

/**
 * Build a dependency graph for a service.
 * This is the main entry point for the topology analysis.
 */
export const buildDependencyGraph = (serviceName: string) =>
  Effect.gen(function* () {
    const model = yield* loadSmithyModel(serviceName);
    return buildGraphFromModel(model);
  });

/**
 * Synchronous version of buildGraphFromModel for testing.
 * Takes an already-loaded model object.
 */
export const buildDependencyGraphFromModel = buildGraphFromModel;

/**
 * Result of scanning all service models for operation prefixes.
 */
export interface PrefixScanResult {
  /** All prefixes found with their counts and examples */
  prefixes: Record<string, { count: number; examples: string[] }>;
  /** Prefixes that are not in ALL_KNOWN_PREFIXES */
  unknown: string[];
  /** Total number of operations scanned */
  totalOperations: number;
  /** Number of services scanned */
  servicesScanned: number;
}

/**
 * Extract the prefix from an operation name.
 * E.g., "CreateVpc" -> "Create", "DescribeInstances" -> "Describe"
 */
const extractPrefix = (opName: string): string | null => {
  const match = opName.match(/^([A-Z][a-z]+)/);
  return match ? match[1] : null;
};

/**
 * Scan all AWS service models to find all operation prefixes.
 * Returns statistics about prefixes and identifies any unknown prefixes.
 */
export const scanAllPrefixes = () =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const p = yield* Path.Path;

    const modelsDir = "aws-models/models";
    const services = yield* fs.readDirectory(modelsDir);

    const prefixes: Record<string, { count: number; examples: string[] }> = {};
    let totalOperations = 0;
    let servicesScanned = 0;

    for (const service of services) {
      const serviceDir = p.join(modelsDir, service, "service");

      // Check if service directory exists
      if (!(yield* fs.exists(serviceDir))) continue;

      const versions = yield* fs.readDirectory(serviceDir);
      if (!versions.length) continue;

      const version = versions[0];
      const modelPath = p.join(
        serviceDir,
        version,
        `${service}-${version}.json`,
      );

      if (!(yield* fs.exists(modelPath))) continue;

      const content = yield* fs.readFileString(modelPath);
      const model = yield* S.decodeUnknown(S.parseJson(SmithyModel))(content);

      servicesScanned++;

      for (const [shapeId, shape] of Object.entries(model.shapes)) {
        if (shape.type !== "operation") continue;

        const opName = shapeId.split("#")[1];
        if (!opName) continue;

        totalOperations++;

        const prefix = extractPrefix(opName);
        if (!prefix) continue;

        if (!prefixes[prefix]) {
          prefixes[prefix] = { count: 0, examples: [] };
        }
        prefixes[prefix].count++;
        if (prefixes[prefix].examples.length < 3) {
          prefixes[prefix].examples.push(opName);
        }
      }
    }

    // Find unknown prefixes
    const knownSet = new Set(ALL_KNOWN_PREFIXES);
    const unknown = Object.keys(prefixes)
      .filter((p) => !knownSet.has(p))
      .sort((a, b) => prefixes[b].count - prefixes[a].count);

    return {
      prefixes,
      unknown,
      totalOperations,
      servicesScanned,
    } satisfies PrefixScanResult;
  });

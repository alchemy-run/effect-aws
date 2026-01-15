/**
 * Heuristics for determining which errors an operation is likely to throw.
 *
 * This helps focus discovery efforts on operations that actually throw
 * NotFound, Malformed, or DependencyViolation errors.
 */

import type { OperationType } from "./topology.ts";

/**
 * Expected error categories for an operation.
 */
export interface ExpectedErrors {
  /** Can throw NotFound/NoSuch/DoesNotExist when resource doesn't exist */
  notFound: boolean;
  /** Can throw Malformed when ID format is wrong */
  malformed: boolean;
  /** Can throw DependencyViolation/InUse when resource has dependents */
  dependencyViolation: boolean;
  /** Reason for the classification */
  reason: string;
}

/**
 * Determine expected errors based on operation type and name.
 */
export function getExpectedErrors(
  opName: string,
  opType: OperationType,
): ExpectedErrors {
  const lowerName = opName.toLowerCase();

  // List operations - return empty results, don't throw NotFound
  if (opType === "list") {
    return {
      notFound: false,
      malformed: false,
      dependencyViolation: false,
      reason: "List operations return empty results instead of throwing",
    };
  }

  // Describe operations - depends on whether they take specific IDs
  if (opType === "read") {
    // Describe with plural name usually returns empty (e.g., describeVpcs with no filter)
    // But describe with specific ID throws NotFound
    const takesSingleId =
      lowerName.includes("status") ||
      lowerName.includes("attribute") ||
      lowerName.includes("history") ||
      lowerName.startsWith("get");

    if (takesSingleId) {
      return {
        notFound: true,
        malformed: true,
        dependencyViolation: false,
        reason: "Read operation that takes specific resource ID",
      };
    }

    // Check if it's a describe that filters by IDs
    const describesSpecific =
      !lowerName.endsWith("s") || // describeVpc vs describeVpcs
      lowerName.includes("fleet") ||
      lowerName.includes("instance");

    return {
      notFound: describesSpecific,
      malformed: describesSpecific,
      dependencyViolation: false,
      reason: describesSpecific
        ? "Describe with ID filter can throw NotFound"
        : "Describe without filter returns empty",
    };
  }

  // Delete operations - can throw NotFound AND DependencyViolation
  if (opType === "delete") {
    // Some delete operations are more likely to have dependencies
    const likelyHasDependencies =
      lowerName.includes("vpc") ||
      lowerName.includes("subnet") ||
      lowerName.includes("securitygroup") ||
      lowerName.includes("internetgateway") ||
      lowerName.includes("natgateway") ||
      lowerName.includes("routetable") ||
      lowerName.includes("networkacl") ||
      lowerName.includes("volume") ||
      lowerName.includes("snapshot") ||
      lowerName.includes("image") ||
      lowerName.includes("launchtemplate") ||
      lowerName.includes("ipam");

    return {
      notFound: true,
      malformed: true,
      dependencyViolation: likelyHasDependencies,
      reason: likelyHasDependencies
        ? "Delete of parent resource - likely has DependencyViolation"
        : "Delete operation - throws NotFound, unlikely to have dependencies",
    };
  }

  // Detach operations - need the resource to exist, may have order dependencies
  if (opType === "detach") {
    return {
      notFound: true,
      malformed: true,
      dependencyViolation: false,
      reason: "Detach requires resource to exist",
    };
  }

  // Update operations - need resource to exist
  if (opType === "update") {
    return {
      notFound: true,
      malformed: true,
      dependencyViolation: false,
      reason: "Update requires resource to exist",
    };
  }

  // Create operations - don't throw NotFound (they create the resource)
  if (opType === "create") {
    // But attach/associate operations DO throw NotFound for the target
    const isAttach =
      lowerName.startsWith("attach") ||
      lowerName.startsWith("associate") ||
      lowerName.startsWith("authorize");

    if (isAttach) {
      return {
        notFound: true,
        malformed: true,
        dependencyViolation: false,
        reason: "Attach/Associate requires target resource to exist",
      };
    }

    return {
      notFound: false,
      malformed: false,
      dependencyViolation: false,
      reason: "Create operations throw validation errors, not NotFound",
    };
  }

  // Action operations - usually don't throw NotFound
  if (opType === "action") {
    const targetsSingleResource =
      lowerName.includes("instance") ||
      lowerName.includes("volume") ||
      lowerName.includes("snapshot");

    return {
      notFound: targetsSingleResource,
      malformed: targetsSingleResource,
      dependencyViolation: false,
      reason: targetsSingleResource
        ? "Action targeting specific resource"
        : "Action operations usually don't throw NotFound",
    };
  }

  return {
    notFound: false,
    malformed: false,
    dependencyViolation: false,
    reason: "Unknown operation type",
  };
}

/**
 * Check if an operation should have a specific error type based on heuristics.
 */
export function shouldHaveError(
  opName: string,
  opType: OperationType,
  errorType: "notFound" | "malformed" | "dependencyViolation",
): boolean {
  const expected = getExpectedErrors(opName, opType);
  return expected[errorType];
}

/**
 * Get all delete operations that should have DependencyViolation errors.
 */
export function getOperationsLikelyToHaveDependencyViolation(
  operations: Record<string, { type: OperationType }>,
): string[] {
  return Object.entries(operations)
    .filter(([name, op]) => {
      const expected = getExpectedErrors(name, op.type);
      return expected.dependencyViolation;
    })
    .map(([name]) => name);
}

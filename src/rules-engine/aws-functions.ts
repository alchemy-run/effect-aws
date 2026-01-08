/**
 * AWS-Specific Rules Engine Functions
 *
 * Implementation of AWS extension functions for the rules engine.
 * @see https://smithy.io/2.0/aws/rules-engine/library-functions.html
 */

import type { ParsedArn, PartitionInfo, RulesValue } from "./expression.ts";
// NOTE: partitions.json is copied from smithy during client generation (see scripts/generate-clients.ts)
import partitionsData from "./partitions.json" with { type: "json" };
import { isIpAddress, isValidHostLabel } from "./standard-functions.ts";

interface PartitionOutputs {
  dnsSuffix: string;
  dualStackDnsSuffix: string;
  implicitGlobalRegion: string;
  name: string;
  supportsDualStack: boolean;
  supportsFIPS: boolean;
}

interface PartitionDefinition {
  id: string;
  outputs: PartitionOutputs;
  regionRegex: string;
  regions: Record<string, { description?: string } | undefined>;
}

interface PartitionsInfo {
  partitions: PartitionDefinition[];
  version: string;
}

const partitions: PartitionsInfo = partitionsData as PartitionsInfo;

const toPartitionInfo = (o: PartitionOutputs): PartitionInfo => ({
  name: o.name,
  dnsSuffix: o.dnsSuffix,
  dualStackDnsSuffix: o.dualStackDnsSuffix,
  supportsFIPS: o.supportsFIPS,
  supportsDualStack: o.supportsDualStack,
  implicitGlobalRegion: o.implicitGlobalRegion,
});

/** Returns partition information for a given region. */
export function partition(region: RulesValue): PartitionInfo | undefined {
  if (typeof region !== "string") return undefined;

  // Check for explicit region listed in the regions array
  for (const { regions, outputs } of partitions.partitions) {
    if (region in regions) {
      return { ...toPartitionInfo(outputs), ...regions[region] };
    }
  }

  // Check for region that matches a regionRegex pattern
  for (const { regionRegex, outputs } of partitions.partitions) {
    if (new RegExp(regionRegex).test(region)) {
      return toPartitionInfo(outputs);
    }
  }

  // Return the default partition (aws)
  const defaultPartition = partitions.partitions.find((p) => p.id === "aws");
  return defaultPartition
    ? toPartitionInfo(defaultPartition.outputs)
    : undefined;
}

/** Parses an ARN string into its components. */
export function parseArn(value: RulesValue): ParsedArn | undefined {
  if (typeof value !== "string") return undefined;

  const segments = value.split(":");
  if (segments.length < 6) return undefined;

  const [arn, arnPartition, service, region, accountId, ...resourcePath] =
    segments;
  if (arn !== "arn" || !arnPartition || !service || !resourcePath.join(":")) {
    return undefined;
  }

  return {
    partition: arnPartition,
    service,
    region,
    accountId,
    resourceId: resourcePath.flatMap((r) => r.split("/")),
  };
}

/** Checks if a string is a valid virtual-hostable S3 bucket name. */
export function isVirtualHostableS3Bucket(
  value: RulesValue,
  allowSubDomains: RulesValue = false,
): boolean {
  if (typeof value !== "string") {
    return false;
  }

  if (allowSubDomains) {
    // Split by dots and validate each label
    for (const label of value.split(".")) {
      if (!isVirtualHostableS3Bucket(label, false)) {
        return false;
      }
    }
    return true;
  }

  // Value must be a valid host label
  if (!isValidHostLabel(value, false)) {
    return false;
  }

  // Value must be between 3 and 63 characters long
  if (value.length < 3 || value.length > 63) {
    return false;
  }

  // Value must not contain upper case characters
  if (value !== value.toLowerCase()) {
    return false;
  }

  // Value must not be an IP address
  if (isIpAddress(value)) {
    return false;
  }

  return true;
}

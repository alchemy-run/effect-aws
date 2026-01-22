// =============================================================================
// Naming Constants
// =============================================================================

/** Common irregular plurals */
export const PLURALS: Record<string, string> = {
  indices: "Index",
  indexes: "Index",
  keys: "Key",
  addresses: "Address",
  aliases: "Alias",
  entries: "Entry",
  policies: "Policy",
  histories: "History",
  properties: "Property",
  queries: "Query",
  statuses: "Status",
};

/** Words to preserve as-is (acronyms, special terms) */
export const PRESERVE_WORDS = new Set([
  "cors",
  "dns",
  "ssl",
  "tls",
  "api",
  "kv",
  "r2",
  "d1",
]);

// =============================================================================
// Naming Functions
// =============================================================================

/**
 * Singularize a word
 */
export function singularize(word: string): string {
  const lower = word.toLowerCase();

  // Preserve acronyms and special words
  if (PRESERVE_WORDS.has(lower)) {
    return word;
  }

  // Check for special cases
  if (PLURALS[lower]) {
    return PLURALS[lower];
  }

  // Common patterns
  if (word.endsWith("ies")) {
    return word.slice(0, -3) + "y";
  }
  if (word.endsWith("ses") && word.length > 4) {
    return word.slice(0, -2);
  }
  if (word.endsWith("es") && !word.endsWith("ves") && word.length > 3) {
    // Don't singularize short words like "types" -> "typ"
    const base = word.slice(0, -2);
    if (
      base.endsWith("s") ||
      base.endsWith("x") ||
      base.endsWith("z") ||
      base.endsWith("ch") ||
      base.endsWith("sh")
    ) {
      return base;
    }
    return word.slice(0, -1); // Just remove 's'
  }
  if (
    word.endsWith("s") &&
    !word.endsWith("ss") &&
    !word.endsWith("us") &&
    word.length > 2
  ) {
    return word.slice(0, -1);
  }

  return word;
}

/**
 * Convert singular to plural form
 */
export function pluralize(word: string): string {
  // Already plural
  if (word.endsWith("s") && !word.endsWith("ss")) {
    return word;
  }

  // Words ending in consonant + y -> ies
  // e.g., Query -> Queries, Policy -> Policies
  if (word.endsWith("y") && word.length > 1) {
    const beforeY = word[word.length - 2].toLowerCase();
    const vowels = ["a", "e", "i", "o", "u"];
    if (!vowels.includes(beforeY)) {
      return word.slice(0, -1) + "ies";
    }
  }

  // Words ending in s, x, z, ch, sh -> es
  if (
    word.endsWith("s") ||
    word.endsWith("x") ||
    word.endsWith("z") ||
    word.endsWith("ch") ||
    word.endsWith("sh")
  ) {
    return word + "es";
  }

  // Default: just add s
  return word + "s";
}

/**
 * Convert kebab-case or snake_case to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^([A-Z])/, (_, letter) => letter.toLowerCase());
}

/**
 * Convert to PascalCase
 */
export function toPascalCase(str: string): string {
  // First convert kebab/snake to camelCase
  const camel = toCamelCase(str);
  // Then capitalize first letter
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Build resource name from path
 * e.g., ["r2", "buckets", "lifecycle"] -> "BucketLifecycle"
 * e.g., ["r2", "buckets"] -> "Bucket" (for the main resource, class="Buckets")
 */
export function buildResourceName(
  resourcePath: string[],
  className: string,
): string {
  // Skip the service name (first element)
  const parts = resourcePath.slice(1);

  if (parts.length === 0) {
    // Top-level resource - use class name
    return singularize(className);
  }

  // Singularize and convert to PascalCase
  const singularizedParts = parts.map((part) =>
    toPascalCase(singularize(part)),
  );

  // De-duplicate consecutive identical segments
  // e.g., ["Operation", "Operation"] -> ["Operation"]
  const dedupedParts: string[] = [];
  for (const part of singularizedParts) {
    if (
      dedupedParts.length === 0 ||
      dedupedParts[dedupedParts.length - 1] !== part
    ) {
      dedupedParts.push(part);
    }
  }

  return dedupedParts.join("");
}

/**
 * Map verb to standard CRUD naming
 */
export function mapVerb(methodName: string, httpMethod?: string): string {
  const verbMap: Record<string, string> = {
    create: "create",
    list: "list",
    get: "get",
    update: "update",
    put: "put", // Explicit put verb (used when update has no corresponding create)
    bulkUpdate: "bulkUpdate",
    bulkPut: "bulkPut", // Explicit bulkPut verb (used when bulkUpdate has no corresponding bulkCreate)
    delete: "delete_", // Will be fixed in final name
    retrieve: "get",
    remove: "delete_",
  };

  // For PATCH methods, preserve specific method names like "bulkEdit", "edit"
  // Only use "patch" verb for generic "edit" or "update" method names
  if (httpMethod === "PATCH") {
    // Preserve bulkEdit as-is for specificity
    if (methodName === "bulkEdit") {
      return "bulkPatch";
    }
    // Map edit -> patch for single-resource PATCH
    if (methodName === "edit" || methodName === "update") {
      return "patch";
    }
    // For other method names, use them directly
    return methodName;
  }

  return verbMap[methodName] || methodName;
}

/**
 * Compute operation name from raw parts (used during parsing).
 * Returns camelCase name suitable for code, e.g., "createBucket", "listQueues"
 */
export function computeOperationName(
  methodName: string,
  httpMethod: string,
  resourcePath: string[],
  className: string,
): string {
  const verb = mapVerb(methodName, httpMethod);
  const resource = buildResourceName(resourcePath, className);
  const pluralResource = pluralize(resource);

  let rawName: string;
  if (verb === "list") {
    rawName = `list${pluralResource}`;
  } else if (verb === "bulk") {
    rawName = `${verb}${resource}`;
  } else if (verb.startsWith("bulk")) {
    rawName = `${verb}${pluralResource}`;
  } else if (verb === "delete_") {
    rawName = `delete${resource}`;
  } else {
    rawName = `${verb}${resource}`;
  }

  return toCamelCase(rawName.replace(/-/g, "_"));
}

/**
 * Normalize operations for a service.
 *
 * This applies post-processing that requires knowledge of ALL operations:
 * - Renames "update" to "put" for resources without a "create" operation
 * - Renames "bulkUpdate" to "bulkPut" for resources without a "bulkCreate"
 * - Recomputes operationName after renaming
 */
export function normalizeOperations(
  operations: ParsedOperation[],
): ParsedOperation[] {
  // Group operations by resource name
  const resourceOps = new Map<string, ParsedOperation[]>();
  for (const op of operations) {
    const resource = op.resourceName;
    if (!resourceOps.has(resource)) {
      resourceOps.set(resource, []);
    }
    resourceOps.get(resource)!.push(op);
  }

  // Find resources with create operations
  const resourcesWithCreate = new Set<string>();
  const resourcesWithBulkCreate = new Set<string>();
  for (const [resource, ops] of resourceOps) {
    const hasCreate = ops.some(
      (op) =>
        op.httpMethod === "POST" &&
        (op.methodName === "create" || op.methodName === "add"),
    );
    if (hasCreate) {
      resourcesWithCreate.add(resource);
    }

    const hasBulkCreate = ops.some(
      (op) =>
        op.httpMethod === "POST" &&
        (op.methodName === "bulkCreate" ||
          op.methodName === "bulkAdd" ||
          (op.methodName.startsWith("bulk") &&
            op.methodName.toLowerCase().includes("create"))),
    );
    if (hasBulkCreate) {
      resourcesWithBulkCreate.add(resource);
    }
  }

  // Apply renaming and recompute operationName
  return operations.map((op) => {
    let newMethodName = op.methodName;

    // Single update -> put (if no create)
    if (
      op.httpMethod === "PUT" &&
      op.methodName === "update" &&
      !resourcesWithCreate.has(op.resourceName)
    ) {
      newMethodName = "put";
    }

    // Bulk update -> bulkPut (if no bulkCreate)
    if (
      op.httpMethod === "PUT" &&
      op.methodName === "bulkUpdate" &&
      !resourcesWithBulkCreate.has(op.resourceName)
    ) {
      newMethodName = "bulkPut";
    }

    // If renamed, recompute operationName
    if (newMethodName !== op.methodName) {
      const newOperationName = computeOperationName(
        newMethodName,
        op.httpMethod,
        op.resourcePath,
        op.className,
      );
      return {
        ...op,
        methodName: newMethodName,
        operationName: newOperationName,
      };
    }

    return op;
  });
}

/**
 * Compute resources from path params (used during parsing).
 * Returns PascalCase resource names extracted from path params.
 */
export function computeResources(
  pathParams: Array<{ name: string }>,
): string[] {
  return pathParams
    .filter((p) => p.name !== "account_id" && p.name !== "zone_id")
    .map((p) => p.name.replace(/(_id|Id|_name|Name)$/, ""))
    .map((p) => toPascalCase(p));
}

// =============================================================================
// Type Definitions
// =============================================================================

export interface ParamInfo {
  name: string;
  type: TypeInfo;
  location: "path" | "query" | "body" | "header";
  required: boolean;
  description?: string;
  headerName?: string; // For headers with custom names like 'cf-r2-jurisdiction'
}

export interface TypeInfo {
  kind:
    | "primitive"
    | "literal"
    | "union"
    | "array"
    | "object"
    | "null"
    | "unknown"
    | "file";
  value?: string; // For primitives and literals
  values?: TypeInfo[]; // For unions
  elementType?: TypeInfo; // For arrays
  properties?: PropertyInfo[]; // For objects
  name?: string; // For named types/interfaces
}

export interface PropertyInfo {
  name: string;
  type: TypeInfo;
  required: boolean;
  description?: string;
}

export interface ParsedOperation {
  // =========================================================================
  // Computed identifiers (resolved in parse.ts)
  // =========================================================================

  /** Normalized operation name in camelCase, e.g., "createBucket", "listQueues" */
  operationName: string;

  /** Resource name in PascalCase, e.g., "Bucket", "Queue" */
  resourceName: string;

  /** Resources extracted from path params (excluding account_id/zone_id), e.g., ["Bucket"] */
  resources: string[];

  // =========================================================================
  // From method signature
  // =========================================================================
  methodName: string; // e.g., "create", "list", "get"
  resourcePath: string[]; // e.g., ["r2", "buckets"]
  className: string; // e.g., "Buckets"

  // =========================================================================
  // From method body
  // =========================================================================
  httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  urlTemplate: string; // e.g., "/accounts/${account_id}/r2/buckets"
  urlPathParams: string[]; // Path parameters from URL, e.g., ["account_id", "bucketName"]

  // =========================================================================
  // From params interface
  // =========================================================================
  pathParams: ParamInfo[];
  queryParams: ParamInfo[];
  headerParams: ParamInfo[];
  bodyParams: ParamInfo[];

  // =========================================================================
  // Response type
  // =========================================================================
  responseType: TypeInfo;
  responseTypeName?: string; // Original type name from SDK

  // =========================================================================
  // Source info
  // =========================================================================
  sourceFile: string;

  // Type registry for this source file
  registry: TypeRegistry;
}

export interface ServiceInfo {
  name: string;
  operations: ParsedOperation[];
}

// Type registry to store all parsed interfaces including nested ones
export interface TypeRegistry {
  // Maps qualified names like "CORSUpdateParams.Rule" to their parsed interface
  types: Map<string, ParsedInterface>;
  // Maps type alias names to their resolved TypeInfo (e.g., "CORSUpdateResponse" -> { kind: "unknown" })
  typeAliases: Map<string, TypeInfo>;
}

export interface ParsedInterface {
  name: string;
  properties: ParsedProperty[];
  namespace?: string; // For nested interfaces
}

export interface ParsedProperty {
  name: string;
  type: TypeInfo;
  location?: "path" | "query" | "body" | "header";
  required: boolean;
  description?: string;
}

/**
 * Recursively resolve a TypeInfo using the registry
 * This is called during schema/type generation, after all interfaces are parsed
 */
export function resolveTypeInfoDeep(
  type: TypeInfo,
  registry: TypeRegistry,
  depth: number = 0,
): TypeInfo {
  // Prevent infinite recursion
  if (depth > 10) {
    return type;
  }

  switch (type.kind) {
    case "array":
      if (type.elementType) {
        return {
          ...type,
          elementType: resolveTypeInfoDeep(
            type.elementType,
            registry,
            depth + 1,
          ),
        };
      }
      return type;

    case "union":
      if (type.values) {
        const resolvedValues = type.values.map((v) =>
          resolveTypeInfoDeep(v, registry, depth + 1),
        );

        // If all values are unknown, collapse to single unknown
        if (resolvedValues.every((v) => v.kind === "unknown")) {
          return { kind: "unknown" };
        }

        // Filter out unknowns if there are known types, and de-duplicate
        const knownValues = resolvedValues.filter((v) => v.kind !== "unknown");
        if (knownValues.length > 0) {
          const seen = new Set<string>();
          const dedupedValues = knownValues.filter((v) => {
            const key = JSON.stringify(v);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          if (dedupedValues.length === 1) {
            return dedupedValues[0];
          }
          return { ...type, values: dedupedValues };
        }

        return { ...type, values: resolvedValues };
      }
      return type;

    case "object":
      // If it's a named type reference, try to resolve it
      if (type.name && (!type.properties || type.properties.length === 0)) {
        const resolved = registry.types.get(type.name);
        if (resolved) {
          // Convert ParsedInterface to TypeInfo with resolved properties
          // IMPORTANT: Preserve the name so we can reference shared types later
          const resolvedProps = resolved.properties.map((p) => ({
            ...p,
            type: resolveTypeInfoDeep(p.type, registry, depth + 1),
          }));
          return {
            kind: "object",
            properties: resolvedProps,
            name: type.name, // Preserve the name for shared type lookup
          };
        }
      }
      // Resolve nested properties
      if (type.properties) {
        return {
          ...type,
          properties: type.properties.map((p) => ({
            ...p,
            type: resolveTypeInfoDeep(p.type, registry, depth + 1),
          })),
        };
      }
      return type;

    default:
      return type;
  }
}

/**
 * Resolve a type reference to its full TypeInfo using the type registry
 */
export function resolveTypeReference(
  typeName: string,
  registry: TypeRegistry,
): TypeInfo | undefined {
  const parsed = registry.types.get(typeName);
  if (!parsed) {
    return undefined;
  }

  // Convert ParsedInterface to TypeInfo, preserving the name for shared type lookup
  const properties: PropertyInfo[] = parsed.properties.map((p) => ({
    name: p.name,
    type: p.type,
    required: p.required,
    description: p.description,
  }));

  return {
    kind: "object",
    properties,
    name: typeName, // Preserve the qualified name for shared type references
  };
}

#!/usr/bin/env bun
/**
 * Generate Effect SDK clients from Cloudflare TypeScript SDK source.
 *
 * Usage:
 *   bun scripts/generate-from-sdk.ts                    # Generate all services
 *   bun scripts/generate-from-sdk.ts --service r2       # Generate single service
 *
 * The generator:
 * 1. Walks the cloudflare-typescript/src/resources directory
 * 2. Parses TypeScript AST to extract operations from APIResource classes
 * 3. Extracts JSDoc annotations for parameter locations (path/query/body/header)
 * 4. Generates Effect Schema types with trait annotations
 * 5. Outputs to src/services/{service}.ts
 */

import { Command as CliCommand, Options } from "@effect/cli";
import { Command, FileSystem } from "@effect/platform";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Logger, LogLevel } from "effect";
import * as path from "node:path";
import {
  type ParsedOperation,
  type ServiceInfo,
  type TypeInfo,
  resolveTypeInfoDeep,
  // Naming functions (still needed for some transformations)
  buildResourceName,
  singularize,
  toCamelCase,
  toPascalCase,
} from "./model.ts";
import { parseCode } from "./parse.ts";

/**
 * Patch file structure (mirrors src/expr.ts OperationPatch).
 * Defined here to avoid cross-project imports.
 */
interface OperationPatch {
  errors: Record<
    string,
    Array<{
      code: number;
      status?: number;
      message?: { includes?: string; matches?: string };
    }>
  >;
}

const SDK_PATH = "../../cloudflare-typescript/src/resources";
const OUTPUT_PATH = "./src/services";
const PATCH_PATH = "./patch";

/**
 * Load a patch file for an operation if it exists.
 * Returns undefined if no patch file exists.
 */
const loadOperationPatch = (
  serviceName: string,
  operationName: string,
): Effect.Effect<OperationPatch | undefined, never, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const patchFile = path.join(
      PATCH_PATH,
      serviceName,
      `${operationName}.json`,
    );

    const exists = yield* fs
      .exists(patchFile)
      .pipe(Effect.catchAll(() => Effect.succeed(false)));
    if (!exists) {
      return undefined;
    }

    const content = yield* fs
      .readFileString(patchFile)
      .pipe(Effect.catchAll(() => Effect.succeed(undefined)));
    if (!content) {
      return undefined;
    }

    try {
      return JSON.parse(content) as OperationPatch;
    } catch {
      yield* Console.warn(`Failed to parse patch file: ${patchFile}`);
      return undefined;
    }
  });

/**
 * Load all patches for a service.
 * Returns a map from operation name to patch.
 */
const loadServicePatches = (
  serviceName: string,
  operations: ParsedOperation[],
): Effect.Effect<Map<string, OperationPatch>, never, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const patches = new Map<string, OperationPatch>();

    for (const op of operations) {
      const patch = yield* loadOperationPatch(serviceName, op.operationName);
      if (patch) {
        patches.set(op.operationName, patch);
      }
    }

    return patches;
  });

// CLI Options
const serviceOption = Options.text("service").pipe(
  Options.withDescription("Generate only this service (e.g., r2, workers)"),
  Options.optional,
);

const debugOption = Options.boolean("debug").pipe(
  Options.withDescription("Enable debug logging"),
  Options.withDefault(false),
);

/**
 * Convert TypeInfo to Effect Schema code
 */
function typeInfoToSchema(
  type: TypeInfo,
  indent: string = "",
  depth: number = 0,
): string {
  // Prevent infinite recursion
  if (depth > 10) {
    return "Schema.Unknown";
  }

  switch (type.kind) {
    case "primitive":
      switch (type.value) {
        case "string":
          return "Schema.String";
        case "number":
          return "Schema.Number";
        case "boolean":
          return "Schema.Boolean";
        default:
          return "Schema.Unknown";
      }

    case "literal":
      if (type.value === "true" || type.value === "false") {
        return `Schema.Literal(${type.value})`;
      }
      // String literal
      return `Schema.Literal("${type.value}")`;

    case "null":
      return "Schema.Null";

    case "union":
      if (!type.values || type.values.length === 0) {
        return "Schema.Unknown";
      }
      // Collapse all-unknown unions to single unknown
      if (type.values.every((v) => v.kind === "unknown")) {
        return "Schema.Unknown";
      }
      // Check if all values are literals
      const allLiterals = type.values.every((v) => v.kind === "literal");
      if (allLiterals) {
        const literals = type.values.map((v) => {
          if (v.value === "true" || v.value === "false") {
            return v.value;
          }
          return `"${v.value}"`;
        });
        return `Schema.Literal(${literals.join(", ")})`;
      }
      // General union - de-duplicate and filter unknowns
      const unionParts = type.values
        .filter((v) => v.kind !== "unknown")
        .map((v) => typeInfoToSchema(v, indent, depth + 1));
      const uniqueUnionParts = [...new Set(unionParts)];
      if (uniqueUnionParts.length === 0) {
        return "Schema.Unknown";
      }
      if (uniqueUnionParts.length === 1) {
        return uniqueUnionParts[0];
      }
      return `Schema.Union(${uniqueUnionParts.join(", ")})`;

    case "array":
      if (!type.elementType) {
        return "Schema.Array(Schema.Unknown)";
      }
      const elementSchema = typeInfoToSchema(
        type.elementType,
        indent,
        depth + 1,
      );
      return `Schema.Array(${elementSchema})`;

    case "object":
      // If it has a name but no resolved properties, use Unknown
      if (type.name && (!type.properties || type.properties.length === 0)) {
        return "Schema.Unknown";
      }
      if (type.properties && type.properties.length > 0) {
        const props = type.properties
          .map((p) => {
            const wireName = p.name;
            const propName = toCamelCase(wireName);
            let propSchema = typeInfoToSchema(p.type, indent + "  ", depth + 1);
            if (!p.required) {
              propSchema = `Schema.optional(${propSchema})`;
            }
            // Add JsonName if property name differs from wire name (for JSON serialization)
            if (propName !== wireName) {
              return `${indent}  ${propName}: ${propSchema}.pipe(T.JsonName("${wireName}"))`;
            }
            return `${indent}  ${propName}: ${propSchema}`;
          })
          .join(",\n");
        return `Schema.Struct({\n${props}\n${indent}})`;
      }
      return "Schema.Struct({})";

    case "file":
      // File upload schema with trait annotation
      return "UploadableSchema.pipe(T.HttpFormDataFile())";

    case "unknown":
    default:
      return "Schema.Unknown";
  }
}

/**
 * Convert TypeInfo to TypeScript type string for interfaces
 */
function typeInfoToTsType(type: TypeInfo, depth: number = 0): string {
  // Prevent infinite recursion
  if (depth > 10) {
    return "unknown";
  }

  switch (type.kind) {
    case "primitive":
      return type.value || "unknown";

    case "literal":
      if (type.value === "true" || type.value === "false") {
        return type.value;
      }
      return `"${type.value}"`;

    case "null":
      return "null";

    case "union":
      if (!type.values || type.values.length === 0) {
        return "unknown";
      }
      // Collapse all-unknown unions to single unknown
      if (type.values.every((v) => v.kind === "unknown")) {
        return "unknown";
      }
      // De-duplicate and filter unknowns
      const values = type.values;
      const tsTypes = values
        .filter(
          (v) =>
            v.kind !== "unknown" || values.every((t) => t.kind === "unknown"),
        )
        .map((v) => typeInfoToTsType(v, depth + 1));
      const uniqueTsTypes = [...new Set(tsTypes)];
      if (uniqueTsTypes.length === 1) {
        return uniqueTsTypes[0];
      }
      return uniqueTsTypes.join(" | ");

    case "array":
      if (!type.elementType) {
        return "unknown[]";
      }
      const elementType = typeInfoToTsType(type.elementType, depth + 1);
      // Wrap union types in parentheses
      if (elementType.includes("|")) {
        return `(${elementType})[]`;
      }
      return `${elementType}[]`;

    case "object":
      // If it has a name but no properties, it wasn't resolved - use unknown
      if (type.name && (!type.properties || type.properties.length === 0)) {
        return "unknown";
      }
      if (type.properties && type.properties.length > 0) {
        const props = type.properties
          .map((p) => {
            const propName = toCamelCase(p.name);
            const optMark = p.required ? "" : "?";
            return `${propName}${optMark}: ${typeInfoToTsType(p.type, depth + 1)}`;
          })
          .join("; ");
        return `{ ${props} }`;
      }
      return "Record<string, unknown>";

    case "file":
      return "File | Blob";

    case "unknown":
    default:
      return "unknown";
  }
}

/**
 * Generate Effect Schema code for an operation
 */
function generateOperationSchema(
  op: ParsedOperation,
  patch?: OperationPatch,
): string {
  // Use pre-computed operation name from the model
  const normalizedOpName = op.operationName;
  const pascalOpName = toPascalCase(normalizedOpName);
  const requestTypeName = pascalOpName + "Request";
  const responseTypeName = pascalOpName + "Response";

  const lines: string[] = [];

  // Generate error classes from patch if present
  const errorClassNames: string[] = [];
  if (patch?.errors) {
    for (const [errorTag, matchers] of Object.entries(patch.errors)) {
      errorClassNames.push(errorTag);

      // Generate the error class with HttpErrorMatchers trait
      lines.push(`export class ${errorTag} extends Schema.TaggedError<${errorTag}>()(
  "${errorTag}",
  { code: Schema.Number, message: Schema.String }
).pipe(T.HttpErrorMatchers(${JSON.stringify(matchers)})) {}`);
      lines.push("");
    }
  }

  // Collect property names from path/query/header params to avoid duplicates with body params
  const nonBodyParamNames = new Set([
    ...op.pathParams.map((p) => toCamelCase(p.name)),
    ...op.queryParams.map((p) => toCamelCase(p.name)),
    ...op.headerParams.map((p) => toCamelCase(p.name)),
  ]);

  // Filter body params to exclude those that conflict with path/query/header params
  const filteredBodyParams = op.bodyParams.filter(
    (p) => !nonBodyParamNames.has(toCamelCase(p.name)),
  );

  // Collect all params and resolve their types
  const allParams = [
    ...op.pathParams,
    ...op.queryParams,
    ...op.headerParams,
    ...filteredBodyParams,
  ].map((param) => ({
    ...param,
    type: resolveTypeInfoDeep(param.type, op.registry),
  }));

  // Also create resolved versions for each param category
  const resolvedPathParams = op.pathParams.map((p) => ({
    ...p,
    type: resolveTypeInfoDeep(p.type, op.registry),
  }));
  const resolvedQueryParams = op.queryParams.map((p) => ({
    ...p,
    type: resolveTypeInfoDeep(p.type, op.registry),
  }));
  const resolvedHeaderParams = op.headerParams.map((p) => ({
    ...p,
    type: resolveTypeInfoDeep(p.type, op.registry),
  }));
  const resolvedBodyParams = filteredBodyParams.map((p) => ({
    ...p,
    type: resolveTypeInfoDeep(p.type, op.registry),
  }));

  // Generate request interface
  lines.push(`export interface ${requestTypeName} {`);
  for (const param of allParams) {
    const propName = toCamelCase(param.name); // Use camelCase in interface
    const tsType = typeInfoToTsType(param.type);
    const optMark = param.required ? "" : "?";
    if (param.description) {
      lines.push(
        `  /** ${param.description.replace(/\n/g, " ").slice(0, 200)} */`,
      );
    }
    lines.push(`  ${propName}${optMark}: ${tsType};`);
  }
  lines.push(`}`);
  lines.push("");

  // Generate request schema
  const requestProps: string[] = [];

  // Add path params
  for (const param of resolvedPathParams) {
    const propName = toCamelCase(param.name);
    const wireName = param.name;
    const schema = typeInfoToSchema(param.type);
    requestProps.push(
      `  ${propName}: ${schema}.pipe(T.HttpPath("${wireName}"))`,
    );
  }

  // Add query params
  for (const param of resolvedQueryParams) {
    const propName = toCamelCase(param.name);
    const wireName = param.name;
    let schema = typeInfoToSchema(param.type);
    if (!param.required) {
      schema = `Schema.optional(${schema})`;
    }
    requestProps.push(
      `  ${propName}: ${schema}.pipe(T.HttpQuery("${wireName}"))`,
    );
  }

  // Add header params
  for (const param of resolvedHeaderParams) {
    const propName = toCamelCase(param.name);
    let schema = typeInfoToSchema(param.type);
    if (!param.required) {
      schema = `Schema.optional(${schema})`;
    }
    const headerName = param.headerName || param.name;
    requestProps.push(
      `  ${propName}: ${schema}.pipe(T.HttpHeader("${headerName}"))`,
    );
  }

  // Add body params
  for (const param of resolvedBodyParams) {
    const propName = toCamelCase(param.name);
    const wireName = param.name;
    let schema = typeInfoToSchema(param.type);
    if (!param.required) {
      schema = `Schema.optional(${schema})`;
    }
    // Add JsonName if property name differs from wire name (for JSON body serialization)
    if (propName !== wireName) {
      requestProps.push(
        `  ${propName}: ${schema}.pipe(T.JsonName("${wireName}"))`,
      );
    } else {
      requestProps.push(`  ${propName}: ${schema}`);
    }
  }

  // Convert URL template to OpenAPI style
  const openApiPath = op.urlTemplate.replace(/\{(\w+)\}/g, "{$1}");

  lines.push(`export const ${requestTypeName} = Schema.Struct({`);
  if (requestProps.length > 0) {
    lines.push(requestProps.join(",\n"));
  }
  lines.push(`})`);
  // Add contentType: "multipart" when operation has file uploads
  const hasFiles = operationHasFiles(op);
  const httpTrait = hasFiles
    ? `T.Http({ method: "${op.httpMethod}", path: "${openApiPath}", contentType: "multipart" })`
    : `T.Http({ method: "${op.httpMethod}", path: "${openApiPath}" })`;
  lines.push(
    `  .pipe(${httpTrait}) as unknown as Schema.Schema<${requestTypeName}>;`,
  );
  lines.push("");

  // Generate response interface and schema
  // Try to resolve the response type from the SDK registry
  let resolvedResponseType: TypeInfo | undefined;
  let isTypeAlias = false;

  if (op.responseTypeName) {
    // First check interfaces
    const responseInterface = op.registry.types.get(op.responseTypeName);
    if (responseInterface) {
      resolvedResponseType = resolveTypeInfoDeep(
        { kind: "object", properties: responseInterface.properties },
        op.registry,
      );
    } else {
      // Check type aliases
      const typeAlias = op.registry.typeAliases.get(op.responseTypeName);
      if (typeAlias) {
        // Resolve nested types in the type alias
        resolvedResponseType = resolveTypeInfoDeep(typeAlias, op.registry);
        isTypeAlias = true;
      }
    }
  }

  if (isTypeAlias && resolvedResponseType) {
    // Type alias response (e.g., `type Response = string` or `type Response = unknown`)
    const tsType = typeInfoToTsType(resolvedResponseType);
    const schema = typeInfoToSchema(resolvedResponseType);

    lines.push(`export type ${responseTypeName} = ${tsType};`);
    lines.push("");
    lines.push(
      `export const ${responseTypeName} = ${schema} as unknown as Schema.Schema<${responseTypeName}>;`,
    );
    lines.push("");
  } else if (
    resolvedResponseType &&
    resolvedResponseType.kind === "object" &&
    resolvedResponseType.properties
  ) {
    // Generate interface with resolved types
    lines.push(`export interface ${responseTypeName} {`);
    for (const prop of resolvedResponseType.properties) {
      const propName = toCamelCase(prop.name);
      const tsType = typeInfoToTsType(prop.type);
      const optMark = prop.required ? "" : "?";
      if (prop.description) {
        lines.push(
          `  /** ${prop.description.replace(/\n/g, " ").slice(0, 200)} */`,
        );
      }
      lines.push(`  ${propName}${optMark}: ${tsType};`);
    }
    lines.push(`}`);
    lines.push("");

    // Generate schema with resolved types
    const responseProps = resolvedResponseType.properties.map((prop) => {
      const wireName = prop.name;
      const propName = toCamelCase(wireName);
      let schema = typeInfoToSchema(prop.type);
      if (!prop.required) {
        schema = `Schema.optional(${schema})`;
      }
      // Add JsonName if property name differs from wire name
      if (propName !== wireName) {
        return `  ${propName}: ${schema}.pipe(T.JsonName("${wireName}"))`;
      }
      return `  ${propName}: ${schema}`;
    });

    lines.push(`export const ${responseTypeName} = Schema.Struct({`);
    if (responseProps.length > 0) {
      lines.push(responseProps.join(",\n"));
    }
    lines.push(`}) as unknown as Schema.Schema<${responseTypeName}>;`);
    lines.push("");
  } else {
    // Fallback to unknown if we can't resolve the response type
    lines.push(`export type ${responseTypeName} = unknown;`);
    lines.push("");
    lines.push(
      `export const ${responseTypeName} = Schema.Unknown as unknown as Schema.Schema<${responseTypeName}>;`,
    );
    lines.push("");
  }

  // Generate explicitly typed API function
  const errorsArray =
    errorClassNames.length > 0 ? `[${errorClassNames.join(", ")}]` : "[]";
  lines.push(`export const ${normalizedOpName} = API.make(() => ({`);
  lines.push(`  input: ${requestTypeName},`);
  lines.push(`  output: ${responseTypeName},`);
  lines.push(`  errors: ${errorsArray},`);
  lines.push(`}));`);
  lines.push("");

  return lines.join("\n");
}

/**
 * Extract the resource name from an operation name by stripping verb prefixes.
 * Uses camelCase boundary detection - the resource starts at the first uppercase letter
 * after the verb prefix.
 * Returns singularized resource name for grouping.
 */
function extractResourceFromOperationName(operationName: string): string {
  // Bulk verbs need special handling (compound verbs like bulkDelete)
  const bulkVerbs = [
    "bulkCreate",
    "bulkUpdate",
    "bulkDelete",
    "bulkPatch",
    "bulkGet",
    "bulkPush",
    "bulk",
  ];

  for (const verb of bulkVerbs) {
    if (operationName.startsWith(verb) && operationName.length > verb.length) {
      const resource = operationName.slice(verb.length);
      return singularize(resource);
    }
  }

  // For non-bulk operations, find the first uppercase letter after position 0
  // This handles any verb: get, list, create, ack, pull, push, start, status, etc.
  for (let i = 1; i < operationName.length; i++) {
    const char = operationName[i];
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      const resource = operationName.slice(i);
      return singularize(resource);
    }
  }

  // No uppercase found, return the whole thing singularized
  return singularize(operationName);
}

/**
 * Extract the verb from an operation name.
 */
function extractVerbFromOperationName(operationName: string): string {
  // Check bulk verbs first
  const bulkVerbs = [
    "bulkCreate",
    "bulkUpdate",
    "bulkDelete",
    "bulkPatch",
    "bulkGet",
    "bulkPush",
    "bulk",
  ];
  for (const verb of bulkVerbs) {
    if (operationName.startsWith(verb) && operationName.length > verb.length) {
      const nextChar = operationName[verb.length];
      if (
        nextChar === nextChar.toUpperCase() &&
        nextChar !== nextChar.toLowerCase()
      ) {
        return verb;
      }
    }
  }

  // For non-bulk, extract everything before the first uppercase letter
  for (let i = 1; i < operationName.length; i++) {
    const char = operationName[i];
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      return operationName.slice(0, i);
    }
  }

  return operationName;
}

/**
 * Get the sort order for a verb within a resource group.
 * Lower number = comes first.
 */
function getVerbSortOrder(operationName: string): number {
  const verb = extractVerbFromOperationName(operationName);

  const order: Record<string, number> = {
    // Read operations first
    get: 1,
    list: 2,
    // Create/write operations
    create: 3,
    put: 4, // put = create-or-update (used when no separate create exists)
    update: 5,
    patch: 6,
    // Delete
    delete: 7,
    // Bulk operations (in same order as single operations)
    bulkGet: 10,
    bulkCreate: 11,
    bulkPut: 12,
    bulkUpdate: 13,
    bulkPatch: 14,
    bulkDelete: 15,
    bulkPush: 16,
    bulk: 17,
    // Other common operations
    pull: 20,
    push: 21,
    ack: 22,
    start: 23,
    status: 24,
    stop: 25,
    enable: 26,
    disable: 27,
    verify: 28,
    download: 29,
    upload: 30,
  };

  return order[verb] ?? 100;
}

/**
 * Sort operations by resource name, then by verb order within each resource.
 */
function sortOperations(operations: ParsedOperation[]): ParsedOperation[] {
  return [...operations].sort((a, b) => {
    const resourceA = extractResourceFromOperationName(a.operationName);
    const resourceB = extractResourceFromOperationName(b.operationName);

    // First, sort by resource name (case-insensitive)
    const resourceCompare = resourceA
      .toLowerCase()
      .localeCompare(resourceB.toLowerCase());
    if (resourceCompare !== 0) {
      return resourceCompare;
    }

    // Within the same resource, sort by verb order
    const orderA = getVerbSortOrder(a.operationName);
    const orderB = getVerbSortOrder(b.operationName);
    return orderA - orderB;
  });
}

/**
 * Generate a complete service file
 */
/**
 * Check if a TypeInfo contains file types (recursively)
 */
function hasFileType(type: TypeInfo): boolean {
  if (type.kind === "file") return true;
  if (type.kind === "array" && type.elementType) {
    return hasFileType(type.elementType);
  }
  if (type.kind === "union" && type.values) {
    return type.values.some(hasFileType);
  }
  if (type.kind === "object" && type.properties) {
    return type.properties.some((p) => hasFileType(p.type));
  }
  return false;
}

/**
 * Check if an operation has file parameters
 */
function operationHasFiles(op: ParsedOperation): boolean {
  return op.bodyParams.some((p) => hasFileType(p.type));
}

function generateServiceFile(
  service: ServiceInfo,
  patches: Map<string, OperationPatch>,
): string {
  const lines: string[] = [];

  // Check if any operation has file uploads
  const hasFileUploads = service.operations.some(operationHasFiles);

  // Header
  lines.push(`/**`);
  lines.push(` * Cloudflare ${service.name.toUpperCase()} API`);
  lines.push(` *`);
  lines.push(` * Generated from Cloudflare TypeScript SDK.`);
  lines.push(
    ` * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service ${service.name}`,
  );
  lines.push(` */`);
  lines.push("");

  // Imports
  lines.push(`import * as Effect from "effect/Effect";`);
  lines.push(`import * as Schema from "effect/Schema";`);
  lines.push(`import type { HttpClient } from "@effect/platform";`);
  lines.push(`import * as API from "../client/api.ts";`);
  lines.push(`import * as T from "../traits.ts";`);
  lines.push(`import type { ApiToken } from "../auth.ts";`);
  lines.push(`import {`);
  lines.push(`  UnknownCloudflareError,`);
  lines.push(`  CloudflareNetworkError,`);
  lines.push(`  CloudflareHttpError,`);
  lines.push(`} from "../errors.ts";`);
  // Conditionally import UploadableSchema for file uploads
  if (hasFileUploads) {
    lines.push(`import { UploadableSchema } from "../schemas.ts";`);
  }
  lines.push("");

  // Operations are already normalized by parse.ts (update -> put renaming, etc.)
  // Sort operations by resource, then by verb order
  const sortedOperations = sortOperations(service.operations);

  // Generate each operation with inlined types, adding resource group separators
  let currentResource: string | null = null;
  for (const op of sortedOperations) {
    const resource = extractResourceFromOperationName(op.operationName);

    // Add separator comment when resource changes
    if (resource !== currentResource) {
      if (currentResource !== null) {
        lines.push(""); // Extra blank line between groups
      }
      lines.push(`// ${"=".repeat(77)}`);
      lines.push(`// ${resource}`);
      lines.push(`// ${"=".repeat(77)}`);
      lines.push("");
      currentResource = resource;
    }

    // Get patch for this operation
    const patch = patches.get(op.operationName);
    lines.push(generateOperationSchema(op, patch));
  }

  return lines.join("\n");
}

interface GenerateOptions {
  outputPath: string;
  debug?: boolean;
}

const generateCode = (services: ServiceInfo[], options: GenerateOptions) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const { outputPath, debug } = options;
    yield* Console.log(`Found ${services.length} services`);

    // Create output directory
    yield* fs.makeDirectory(outputPath, { recursive: true });

    // Generate files
    for (const svc of services) {
      if (svc.operations.length === 0) {
        yield* Console.log(`Skipping ${svc.name} (no operations)`);
        continue;
      }

      yield* Console.log(
        `Generating ${svc.name} (${svc.operations.length} operations)`,
      );

      // Load patches for this service
      const patches = yield* loadServicePatches(svc.name, svc.operations);
      if (patches.size > 0) {
        yield* Console.log(`  Loaded ${patches.size} patch file(s)`);
      }

      if (debug) {
        for (const op of svc.operations) {
          yield* Console.log(
            `  ${op.operationName}: ${op.httpMethod} ${op.urlTemplate}`,
          );
        }
      }

      const code = generateServiceFile(svc, patches);
      const outputFile = path.join(outputPath, `${svc.name}.ts`);

      yield* fs.writeFileString(outputFile, code);
      yield* Console.log(`  -> ${outputFile}`);
    }

    // Format generated files
    yield* Console.log("Formatting generated files...");
    yield* Command.make("bun", "oxfmt", outputPath).pipe(Command.string);

    yield* Console.log("Done!");
  });

const command = CliCommand.make(
  "generate-from-sdk",
  { service: serviceOption, debug: debugOption },
  ({ service, debug }) =>
    Effect.gen(function* () {
      const basePath = path.resolve(SDK_PATH);

      yield* Console.log(`Parsing SDK from: ${basePath}`);

      if (service._tag === "Some") {
        yield* Console.log(`Filtering to service: ${service.value}`);
      }

      // Parse all services
      const services = yield* parseCode({
        basePath,
        serviceFilter: service._tag === "Some" ? service.value : undefined,
      });

      const outputPath = path.resolve(OUTPUT_PATH);
      yield* generateCode(services, { outputPath, debug });
    }),
);

// Run the command
const cli = CliCommand.run(command, {
  name: "generate-from-sdk",
  version: "1.0.0",
});

Effect.suspend(() => cli(process.argv)).pipe(
  Effect.provide(NodeContext.layer),
  Logger.withMinimumLogLevel(LogLevel.Info),
  NodeRuntime.runMain,
);

import { Command, FileSystem } from "@effect/platform";
import { NodeContext } from "@effect/platform-node";
import { Effect } from "effect";
import * as path from "node:path";
import * as ts from "typescript";
import {
  type ParamInfo,
  type ParsedInterface,
  type ParsedOperation,
  type ParsedProperty,
  type ServiceInfo,
  type TypeInfo,
  type TypeRegistry,
  // Naming functions for computing operation metadata
  buildResourceName,
  computeOperationName,
  computeResources,
  normalizeOperations,
  resolveTypeReference,
} from "./model.ts";

interface ParseOptions {
  basePath: string;
  serviceFilter?: string;
  /**
   * Force re-parsing even if a cached model exists
   * @default false
   */
  force?: boolean;
}

// =============================================================================
// Cache Serialization
// =============================================================================

interface SerializedTypeRegistry {
  types: Array<[string, ParsedInterface]>;
  typeAliases: Array<[string, TypeInfo]>;
}

interface SerializedOperation extends Omit<ParsedOperation, "registry"> {
  registry: SerializedTypeRegistry;
}

interface SerializedServiceInfo {
  name: string;
  operations: SerializedOperation[];
}

interface CacheData {
  version: 1;
  hash: string;
  timestamp: number;
  services: SerializedServiceInfo[];
}

function serializeRegistry(registry: TypeRegistry): SerializedTypeRegistry {
  return {
    types: Array.from(registry.types.entries()),
    typeAliases: Array.from(registry.typeAliases.entries()),
  };
}

function deserializeRegistry(data: SerializedTypeRegistry): TypeRegistry {
  return {
    types: new Map(data.types),
    typeAliases: new Map(data.typeAliases),
  };
}

function serializeServices(services: ServiceInfo[]): SerializedServiceInfo[] {
  return services.map((service) => ({
    name: service.name,
    operations: service.operations.map((op) => ({
      ...op,
      registry: serializeRegistry(op.registry),
    })),
  }));
}

function deserializeServices(data: SerializedServiceInfo[]): ServiceInfo[] {
  return data.map((service) => ({
    name: service.name,
    operations: service.operations.map((op) => ({
      ...op,
      registry: deserializeRegistry(op.registry),
    })),
  }));
}

// =============================================================================
// Git Hash & Caching
// =============================================================================

const CACHE_DIR = ".distilled/cache";

/**
 * Get the git commit hash of the cloudflare-typescript repo
 */
const getGitHash = (repoPath: string) =>
  Command.make("git", "rev-parse", "HEAD").pipe(
    Command.workingDirectory(repoPath),
    Command.string,
    Effect.map((s) => s.trim()),
    Effect.catchAll(() => Effect.succeed("")),
  );

/**
 * Try to load cached model for the given git hash
 */
const loadCache = (hash: string) =>
  Effect.gen(function* () {
    if (!hash) return undefined;

    const fs = yield* FileSystem.FileSystem;
    const cachePath = path.join(CACHE_DIR, `${hash}.json`);

    const exists = yield* fs.exists(cachePath);
    if (!exists) return undefined;

    const content = yield* fs.readFileString(cachePath);
    const data = JSON.parse(content) as CacheData;

    if (data.version !== 1 || data.hash !== hash) {
      return undefined;
    }

    return deserializeServices(data.services);
  }).pipe(
    Effect.catchAll(() => Effect.succeed(undefined)),
  );

/**
 * Save parsed model to cache
 */
const saveCache = (hash: string, services: ServiceInfo[]) =>
  Effect.gen(function* () {
    if (!hash) return;

    const fs = yield* FileSystem.FileSystem;
    const cachePath = path.join(CACHE_DIR, `${hash}.json`);

    // Ensure cache directory exists
    yield* fs.makeDirectory(CACHE_DIR, { recursive: true });

    const data: CacheData = {
      version: 1,
      hash,
      timestamp: Date.now(),
      services: serializeServices(services),
    };

    yield* fs.writeFileString(cachePath, JSON.stringify(data));
  }).pipe(
    Effect.catchAll((e) => Effect.logWarning(`Failed to save cache: ${e}`)),
  );

/**
 * Create a type registry from a source file
 *
 * Two phases:
 * 1. First pass: collect all interface AST nodes with their qualified names
 * 2. Second pass: parse all interfaces without resolution (store primitives and type names)
 *
 * Resolution happens lazily during schema generation using resolveTypeInfoDeep()
 */
function createTypeRegistry(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
): TypeRegistry {
  const types = new Map<string, ParsedInterface>();
  const typeAliases = new Map<string, TypeInfo>();
  const nodeMap = new Map<string, ts.InterfaceDeclaration>();

  // First pass: collect all interface declarations and type aliases with qualified names
  function collectInterface(
    node: ts.InterfaceDeclaration,
    prefix: string = "",
  ) {
    const name = node.name.getText();
    const qualifiedName = prefix ? `${prefix}.${name}` : name;
    nodeMap.set(qualifiedName, node);
  }

  function collectTypeAlias(
    node: ts.TypeAliasDeclaration,
    prefix: string = "",
  ) {
    const name = node.name.getText();
    const qualifiedName = prefix ? `${prefix}.${name}` : name;
    // Parse the type alias's type
    const typeInfo = typeNodeToTypeInfo(node.type, checker, undefined);
    typeAliases.set(qualifiedName, typeInfo);
  }

  function collectFromNamespace(
    node: ts.ModuleDeclaration,
    prefix: string = "",
  ) {
    const name = node.name.getText();
    const qualifiedName = prefix ? `${prefix}.${name}` : name;

    if (node.body && ts.isModuleBlock(node.body)) {
      for (const stmt of node.body.statements) {
        if (ts.isInterfaceDeclaration(stmt)) {
          collectInterface(stmt, qualifiedName);
        } else if (ts.isTypeAliasDeclaration(stmt)) {
          collectTypeAlias(stmt, qualifiedName);
        } else if (ts.isModuleDeclaration(stmt)) {
          collectFromNamespace(stmt, qualifiedName);
        }
      }
    }
  }

  function collectAll(node: ts.Node) {
    if (ts.isInterfaceDeclaration(node)) {
      collectInterface(node);
    } else if (ts.isTypeAliasDeclaration(node)) {
      collectTypeAlias(node);
    } else if (ts.isModuleDeclaration(node)) {
      collectFromNamespace(node);
    }
    ts.forEachChild(node, collectAll);
  }

  collectAll(sourceFile);

  // Create the registry object
  const registry: TypeRegistry = { types, typeAliases };

  // Second pass: parse all interfaces (without resolution - just capture type names)
  for (const [qualifiedName, node] of nodeMap) {
    // Parse without registry to avoid resolution
    const parsed = parseInterface(node, checker, undefined);
    types.set(qualifiedName, parsed);
  }

  return registry;
}

function createProgram(files: string[]): ts.Program {
  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    skipLibCheck: true,
    strict: true,
  };

  return ts.createProgram(files, options);
}

/**
 * Extract JSDoc comment text from a node
 */
function getJsDocComment(node: ts.Node): string | undefined {
  const comments: string[] = [];

  // Get the leading comment
  const fullText = node.getSourceFile().getFullText();
  const nodeStart = node.getFullStart();
  const leadingComments = ts.getLeadingCommentRanges(fullText, nodeStart);

  if (leadingComments) {
    for (const comment of leadingComments) {
      const text = fullText.slice(comment.pos, comment.end);
      // Extract JSDoc content
      const match = text.match(/\/\*\*\s*([\s\S]*?)\s*\*\//);
      if (match) {
        comments.push(match[1].replace(/\s*\*\s*/g, " ").trim());
      }
    }
  }

  return comments.length > 0 ? comments.join(" ") : undefined;
}

/**
 * Parse parameter location from JSDoc comment
 */
function parseParamLocation(
  comment: string | undefined,
): "path" | "query" | "body" | "header" | undefined {
  if (!comment) return undefined;

  const normalized = comment.toLowerCase();
  if (normalized.includes("path param")) return "path";
  if (normalized.includes("query param")) return "query";
  if (normalized.includes("body param")) return "body";
  if (normalized.includes("header param")) return "header";

  return undefined;
}

/**
 * Convert TypeScript type node to TypeInfo
 */
function typeNodeToTypeInfo(
  typeNode: ts.TypeNode | undefined,
  checker: ts.TypeChecker,
  registry?: TypeRegistry,
): TypeInfo {
  if (!typeNode) {
    return { kind: "unknown" };
  }

  // String
  if (ts.isToken(typeNode) && typeNode.kind === ts.SyntaxKind.StringKeyword) {
    return { kind: "primitive", value: "string" };
  }

  // Number
  if (ts.isToken(typeNode) && typeNode.kind === ts.SyntaxKind.NumberKeyword) {
    return { kind: "primitive", value: "number" };
  }

  // Boolean
  if (ts.isToken(typeNode) && typeNode.kind === ts.SyntaxKind.BooleanKeyword) {
    return { kind: "primitive", value: "boolean" };
  }

  // Null keyword
  if (ts.isToken(typeNode) && typeNode.kind === ts.SyntaxKind.NullKeyword) {
    return { kind: "null" };
  }

  // Literal type (string literal, number literal, etc.)
  if (ts.isLiteralTypeNode(typeNode)) {
    if (ts.isStringLiteral(typeNode.literal)) {
      return { kind: "literal", value: typeNode.literal.text };
    }
    if (ts.isNumericLiteral(typeNode.literal)) {
      return { kind: "literal", value: typeNode.literal.text };
    }
    if (typeNode.literal.kind === ts.SyntaxKind.TrueKeyword) {
      return { kind: "literal", value: "true" };
    }
    if (typeNode.literal.kind === ts.SyntaxKind.FalseKeyword) {
      return { kind: "literal", value: "false" };
    }
    if (typeNode.literal.kind === ts.SyntaxKind.NullKeyword) {
      return { kind: "null" };
    }
  }

  // Union type
  if (ts.isUnionTypeNode(typeNode)) {
    const values = typeNode.types.map((t) =>
      typeNodeToTypeInfo(t, checker, registry),
    );

    // De-duplicate and simplify unions
    // Filter out unknown types if there are known types
    const knownValues = values.filter((v) => v.kind !== "unknown");
    if (knownValues.length > 0) {
      // If we have known types, use only those (deduplicated)
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
      return { kind: "union", values: dedupedValues };
    }

    // All unknowns - collapse to single unknown
    if (values.every((v) => v.kind === "unknown")) {
      return { kind: "unknown" };
    }

    return { kind: "union", values };
  }

  // Array type
  if (ts.isArrayTypeNode(typeNode)) {
    return {
      kind: "array",
      elementType: typeNodeToTypeInfo(typeNode.elementType, checker, registry),
    };
  }

  // Type reference (named types, Array<T>, etc.)
  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = typeNode.typeName.getText();

    // Handle Array<T>
    if (typeName === "Array" && typeNode.typeArguments?.[0]) {
      return {
        kind: "array",
        elementType: typeNodeToTypeInfo(
          typeNode.typeArguments[0],
          checker,
          registry,
        ),
      };
    }

    // Handle Core.Uploadable - file uploads for multipart form-data
    if (typeName === "Core.Uploadable" || typeName === "Uploadable") {
      return { kind: "file" };
    }

    // Handle Record<K, V>
    if (typeName === "Record") {
      return { kind: "object", name: "Record" };
    }

    // Try to resolve from registry if available
    if (registry) {
      const resolved = resolveTypeReference(typeName, registry);
      if (resolved) {
        return resolved;
      }
    }

    // Use TypeChecker to resolve type aliases (like SippyAPI.Provider = 'r2')
    const type = checker.getTypeAtLocation(typeNode);
    if (type) {
      // Check if it's a string literal type
      if (type.isStringLiteral()) {
        return { kind: "literal", value: type.value };
      }
      // Check if it's a union of literals
      if (type.isUnion()) {
        const unionTypes = type.types.map((t): TypeInfo => {
          if (t.isStringLiteral()) {
            return { kind: "literal" as const, value: t.value };
          }
          if (t.isNumberLiteral()) {
            return { kind: "literal" as const, value: String(t.value) };
          }
          // Check for null/undefined in union
          const flags = t.getFlags();
          if (flags & ts.TypeFlags.Null) {
            return { kind: "null" as const };
          }
          if (flags & ts.TypeFlags.Undefined) {
            return { kind: "null" as const }; // treat undefined as null for schema purposes
          }
          if (flags & ts.TypeFlags.String) {
            return { kind: "primitive" as const, value: "string" };
          }
          if (flags & ts.TypeFlags.Number) {
            return { kind: "primitive" as const, value: "number" };
          }
          if (flags & ts.TypeFlags.Boolean) {
            return { kind: "primitive" as const, value: "boolean" };
          }
          // Check for object/interface types - get the type name
          if (flags & ts.TypeFlags.Object) {
            const typeName = checker.typeToString(t);
            // Skip anonymous types like __type or { ... }
            if (
              typeName &&
              !typeName.startsWith("{") &&
              !typeName.startsWith("__")
            ) {
              return { kind: "object" as const, name: typeName };
            }
          }
          return { kind: "unknown" as const };
        });
        // Filter out unknowns if we have other types
        const knownTypes = unionTypes.filter((t) => t.kind !== "unknown");
        if (knownTypes.length > 0) {
          return { kind: "union", values: knownTypes };
        }
      }
      // Check if it's a primitive type
      const flags = type.getFlags();
      if (flags & ts.TypeFlags.String) {
        return { kind: "primitive", value: "string" };
      }
      if (flags & ts.TypeFlags.Number) {
        return { kind: "primitive", value: "number" };
      }
      if (flags & ts.TypeFlags.Boolean) {
        return { kind: "primitive", value: "boolean" };
      }
    }

    // Named type reference (will be resolved later)
    return { kind: "object", name: typeName };
  }

  // Type literal (inline object type)
  if (ts.isTypeLiteralNode(typeNode)) {
    const properties: ParsedProperty[] = [];

    for (const member of typeNode.members) {
      if (ts.isPropertySignature(member) && member.name) {
        const name = member.name.getText();
        const type = typeNodeToTypeInfo(member.type, checker, registry);
        const required = !member.questionToken;
        const comment = getJsDocComment(member);

        properties.push({ name, type, required, description: comment });
      }
    }

    return { kind: "object", properties };
  }

  // Fallback
  return { kind: "unknown" };
}

/**
 * Extract HTTP method from method body
 */
function extractHttpMethod(
  methodBody: ts.Block,
): "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | undefined {
  let httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | undefined;

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const expr = node.expression;

      // Look for this._client.get/post/put/patch/delete
      if (
        ts.isPropertyAccessExpression(expr) &&
        ts.isPropertyAccessExpression(expr.expression)
      ) {
        const methodName = expr.name.getText().toUpperCase();
        if (["GET", "POST", "PUT", "PATCH", "DELETE"].includes(methodName)) {
          httpMethod = methodName as typeof httpMethod;
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(methodBody);
  return httpMethod;
}

/**
 * Extract URL template from method body
 */
function extractUrlTemplate(methodBody: ts.Block): string | undefined {
  let urlTemplate: string | undefined;

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const expr = node.expression;

      // Look for this._client.get/post/put/patch/delete calls
      if (ts.isPropertyAccessExpression(expr)) {
        const methodName = expr.name.getText().toLowerCase();
        if (["get", "post", "put", "patch", "delete"].includes(methodName)) {
          // First argument is the URL
          const urlArg = node.arguments[0];
          if (urlArg) {
            if (ts.isTemplateExpression(urlArg)) {
              // Template literal: `/accounts/${account_id}/r2/buckets`
              urlTemplate = reconstructTemplateString(urlArg);
            } else if (ts.isStringLiteral(urlArg)) {
              // Simple string literal
              urlTemplate = urlArg.text;
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(methodBody);
  return urlTemplate;
}

/**
 * Reconstruct a template string from a template expression
 */
function reconstructTemplateString(template: ts.TemplateExpression): string {
  let result = template.head.text;

  for (const span of template.templateSpans) {
    // Get the variable name from the span
    const varName = span.expression.getText();
    result += `{${varName}}`;
    result += span.literal.text;
  }

  return result;
}

/**
 * Extract path parameters from URL template
 */
function extractPathParamsFromUrl(urlTemplate: string): string[] {
  const params: string[] = [];
  const regex = /\{(\w+)\}/g;
  let match;

  while ((match = regex.exec(urlTemplate)) !== null) {
    params.push(match[1]);
  }

  return params;
}

/**
 * Extract custom header name from method body
 */
function extractHeaderNames(methodBody: ts.Block): Map<string, string> {
  const headerMap = new Map<string, string>();

  function visit(node: ts.Node) {
    // Look for object literals with header assignments
    if (ts.isObjectLiteralExpression(node)) {
      for (const prop of node.properties) {
        if (ts.isPropertyAssignment(prop)) {
          const name = prop.name;
          if (ts.isStringLiteral(name)) {
            // Found a header like 'cf-r2-jurisdiction': value
            const headerName = name.text;

            // Try to find the variable being assigned
            const init = prop.initializer;
            if (ts.isPropertyAccessExpression(init)) {
              // jurisdiction?.toString()
              const varName = init.expression.getText().replace(/\?$/, "");
              headerMap.set(varName, headerName);
            } else if (ts.isCallExpression(init)) {
              // jurisdiction?.toString()
              const callExpr = init.expression;
              if (ts.isPropertyAccessExpression(callExpr)) {
                const varName = callExpr.expression
                  .getText()
                  .replace(/\?$/, "");
                headerMap.set(varName, headerName);
              }
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(methodBody);
  return headerMap;
}

/**
 * Parse an interface declaration to extract properties and their metadata
 */
function parseInterface(
  node: ts.InterfaceDeclaration,
  checker: ts.TypeChecker,
  registry?: TypeRegistry,
): ParsedInterface {
  const name = node.name.getText();
  const properties: ParsedProperty[] = [];

  for (const member of node.members) {
    if (ts.isPropertySignature(member) && member.name) {
      const propName = member.name.getText();
      const type = typeNodeToTypeInfo(member.type, checker, registry);
      const required = !member.questionToken;
      const comment = getJsDocComment(member);
      const location = parseParamLocation(comment);

      properties.push({
        name: propName,
        type,
        location,
        required,
        description: comment,
      });
    }
  }

  return { name, properties };
}

/**
 * Find and parse a params interface by name in a source file
 */
function findParamsInterface(
  sourceFile: ts.SourceFile,
  paramsTypeName: string,
  checker: ts.TypeChecker,
  registry: TypeRegistry,
): ParsedInterface | undefined {
  // First try to get from registry
  const fromRegistry = registry.types.get(paramsTypeName);
  if (fromRegistry) {
    return fromRegistry;
  }

  let result: ParsedInterface | undefined;

  function visit(node: ts.Node) {
    if (
      ts.isInterfaceDeclaration(node) &&
      node.name.getText() === paramsTypeName
    ) {
      result = parseInterface(node, checker, registry);
    }

    // Also check module declarations (for nested namespaces)
    if (ts.isModuleDeclaration(node)) {
      ts.forEachChild(node, visit);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return result;
}

/**
 * Parse a class method declaration to extract operation info
 */
function parseMethod(
  method: ts.MethodDeclaration,
  className: string,
  resourcePath: string[],
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  registry: TypeRegistry,
): ParsedOperation | undefined {
  const methodName = method.name.getText();

  // Skip getters and private methods
  if (
    method.modifiers?.some((m) => m.kind === ts.SyntaxKind.PrivateKeyword) ||
    methodName.startsWith("_")
  ) {
    return undefined;
  }

  // Get method body
  const body = method.body;
  if (!body) {
    return undefined;
  }

  // Extract HTTP method
  const httpMethod = extractHttpMethod(body);
  if (!httpMethod) {
    return undefined;
  }

  // Extract URL template
  const urlTemplate = extractUrlTemplate(body);
  if (!urlTemplate) {
    return undefined;
  }

  // Extract path params from URL
  const urlPathParams = extractPathParamsFromUrl(urlTemplate);

  // Extract header name mappings
  const headerNames = extractHeaderNames(body);

  // Find the params type from method signature
  // Also extract leading positional parameters (like `bucketName: string`)
  let paramsTypeName: string | undefined;
  let responseTypeName: string | undefined;
  const leadingPathParams: ParamInfo[] = [];

  for (const param of method.parameters) {
    const paramName = param.name.getText();
    const paramType = param.type;

    if (paramType && ts.isTypeReferenceNode(paramType)) {
      const typeName = paramType.typeName.getText();
      if (typeName.endsWith("Params")) {
        paramsTypeName = typeName;
      }
    } else if (paramType) {
      // This is a positional parameter like `bucketName: string`
      // Check if it's used in the URL template
      if (urlPathParams.includes(paramName)) {
        leadingPathParams.push({
          name: paramName,
          type: typeNodeToTypeInfo(paramType, checker, registry),
          location: "path",
          required: !param.questionToken,
        });
      }
    }
  }

  // Get return type
  const returnType = method.type;
  if (returnType && ts.isTypeReferenceNode(returnType)) {
    // Extract the inner type from Core.APIPromise<T>
    if (returnType.typeArguments?.[0]) {
      const innerType = returnType.typeArguments[0];
      if (ts.isTypeReferenceNode(innerType)) {
        responseTypeName = innerType.typeName.getText();
      }
    }
  }

  // Parse params interface
  const pathParams: ParamInfo[] = [...leadingPathParams];
  const queryParams: ParamInfo[] = [];
  const headerParams: ParamInfo[] = [];
  const bodyParams: ParamInfo[] = [];

  // Track which path params we've already added from leading params
  const addedPathParams = new Set(leadingPathParams.map((p) => p.name));

  if (paramsTypeName) {
    const paramsInterface = findParamsInterface(
      sourceFile,
      paramsTypeName,
      checker,
      registry,
    );

    if (paramsInterface) {
      for (const prop of paramsInterface.properties) {
        const paramInfo: ParamInfo = {
          name: prop.name,
          type: prop.type,
          location: prop.location || "body", // Default to body if not specified
          required: prop.required,
          description: prop.description,
        };

        // Check if this is a path param from URL
        if (urlPathParams.includes(prop.name)) {
          paramInfo.location = "path";
        }

        // Add header name if found
        if (headerNames.has(prop.name)) {
          paramInfo.headerName = headerNames.get(prop.name);
        }

        // Skip if already added as a leading param
        if (addedPathParams.has(prop.name)) {
          continue;
        }

        switch (paramInfo.location) {
          case "path":
            pathParams.push(paramInfo);
            break;
          case "query":
            queryParams.push(paramInfo);
            break;
          case "header":
            headerParams.push(paramInfo);
            break;
          case "body":
          default:
            bodyParams.push(paramInfo);
            break;
        }
      }
    }
  }

  // Parse response type
  const responseType: TypeInfo = responseTypeName
    ? { kind: "object", name: responseTypeName }
    : { kind: "unknown" };

  // Compute derived identifiers
  const operationName = computeOperationName(
    methodName,
    httpMethod,
    resourcePath,
    className,
  );
  const resourceName = buildResourceName(resourcePath, className);
  const resources = computeResources(pathParams);

  return {
    // Computed identifiers
    operationName,
    resourceName,
    resources,
    // Raw parsed data
    methodName,
    resourcePath,
    className,
    httpMethod,
    urlTemplate,
    urlPathParams,
    pathParams,
    queryParams,
    headerParams,
    bodyParams,
    responseType,
    responseTypeName,
    sourceFile: sourceFile.fileName,
    registry,
  };
}

/**
 * Parse an APIResource class to extract all operations
 */
function parseApiResourceClass(
  classDecl: ts.ClassDeclaration,
  resourcePath: string[],
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
): ParsedOperation[] {
  const operations: ParsedOperation[] = [];
  const className = classDecl.name?.getText() || "Unknown";

  // Check if it extends APIResource
  if (!classDecl.heritageClauses) {
    return operations;
  }

  const extendsApiResource = classDecl.heritageClauses.some(
    (clause) =>
      clause.token === ts.SyntaxKind.ExtendsKeyword &&
      clause.types.some((t) => t.expression.getText() === "APIResource"),
  );

  if (!extendsApiResource) {
    return operations;
  }

  // Create type registry for this source file
  const registry = createTypeRegistry(sourceFile, checker);

  // Parse all methods
  for (const member of classDecl.members) {
    if (ts.isMethodDeclaration(member)) {
      const operation = parseMethod(
        member,
        className,
        resourcePath,
        sourceFile,
        checker,
        registry,
      );
      if (operation) {
        operations.push(operation);
      }
    }
  }

  return operations;
}

/**
 * Discover the resource path from a file path
 * e.g., "r2/buckets/lifecycle.ts" -> ["r2", "buckets", "lifecycle"]
 */
function getResourcePath(filePath: string, basePath: string): string[] {
  const relative = path.relative(basePath, filePath);
  const parts = relative.replace(/\.ts$/, "").split(path.sep);

  // Filter out "index" files
  return parts.filter((p) => p !== "index");
}

/**
 * Get the service name from a resource path
 */
function getServiceName(resourcePath: string[]): string {
  return resourcePath[0];
}

/**
 * Parse all TypeScript files in a directory
 */
const collectTypeScriptFiles = (
  fs: FileSystem.FileSystem,
  directory: string,
): Effect.Effect<string[], unknown> =>
  Effect.gen(function* () {
    const entries = yield* fs.readDirectory(directory).pipe(Effect.orDie);

    const nested = yield* Effect.forEach(
      entries,
      (entry) => {
        const fullPath = path.join(directory, entry);
        return fs.stat(fullPath).pipe(
          Effect.orDie,
          Effect.flatMap((stat) => {
            if (stat.type === "Directory") {
              return collectTypeScriptFiles(fs, fullPath);
            }
            if (stat.type === "File" && fullPath.endsWith(".ts")) {
              return Effect.succeed([fullPath]);
            }
            return Effect.succeed([]);
          }),
        );
      },
      { concurrency: "unbounded" },
    );

    return nested.flat();
  });

const parseServiceFilesCore = (basePath: string, serviceFilter?: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    // Find all TypeScript files
    const searchRoot = serviceFilter
      ? path.join(basePath, serviceFilter)
      : basePath;
    const files = yield* collectTypeScriptFiles(fs, searchRoot);

    // Filter out index files and test files
    const sourceFiles = files.filter(
      (f) =>
        !f.endsWith("/index.ts") &&
        !f.includes(".test.") &&
        !f.includes(".spec."),
    );

    if (sourceFiles.length === 0) {
      return yield* Effect.die("No source files found");
    }
    // Create TypeScript program
    const program = createProgram(sourceFiles);
    const checker = program.getTypeChecker();

    // Group operations by service
    const serviceMap = new Map<string, ParsedOperation[]>();

    for (const file of sourceFiles) {
      const sourceFile = program.getSourceFile(file);
      if (!sourceFile) continue;

      const resourcePath = getResourcePath(file, basePath);
      if (resourcePath.length === 0) continue;

      const serviceName = getServiceName(resourcePath);

      // Parse all class declarations
      ts.forEachChild(sourceFile, (node) => {
        if (ts.isClassDeclaration(node)) {
          const operations = parseApiResourceClass(
            node,
            resourcePath,
            sourceFile,
            checker,
          );

          for (const op of operations) {
            const existing = serviceMap.get(serviceName) || [];
            existing.push(op);
            serviceMap.set(serviceName, existing);
          }
        }
      });
    }

    // Convert to ServiceInfo array, applying normalization
    const services: ServiceInfo[] = [];
    for (const [name, operations] of serviceMap) {
      // Normalize operations (update -> put renaming, etc.)
      const normalizedOps = normalizeOperations(operations);
      services.push({ name, operations: normalizedOps });
    }

    return services;
  });

const parseServiceFiles = (
  basePath: string,
  serviceFilter?: string,
  force?: boolean,
) =>
  Effect.gen(function* () {
    // Resolve the repo root (basePath is like "../../cloudflare-typescript/src/resources")
    const repoRoot = path.resolve(basePath, "../..");

    // Get git hash for caching
    const hash = yield* getGitHash(repoRoot);

    // Try to load from cache (unless force is true or filtering by service)
    if (!force && !serviceFilter && hash) {
      const cached = yield* loadCache(hash);
      if (cached) {
        yield* Effect.logInfo(`Using cached model for ${hash.slice(0, 8)}`);
        return cached;
      }
    }

    // Parse the SDK
    yield* Effect.logInfo(
      `Parsing cloudflare-typescript${serviceFilter ? ` (${serviceFilter})` : ""}...`,
    );
    const services = yield* parseServiceFilesCore(basePath, serviceFilter);

    // Save to cache (only if not filtering by service)
    if (!serviceFilter && hash) {
      yield* saveCache(hash, services);
      yield* Effect.logInfo(`Cached model for ${hash.slice(0, 8)}`);
    }

    return services;
  });

export const parseCode = (options: ParseOptions) => {
  const { basePath, serviceFilter, force } = options;
  return parseServiceFiles(basePath, serviceFilter, force);
};

export const loadModel = (options: ParseOptions) =>
  parseCode(options).pipe(Effect.provide(NodeContext.layer), Effect.runPromise);

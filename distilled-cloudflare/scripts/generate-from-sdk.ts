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

import { Command, Options } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Logger, LogLevel } from "effect";
import * as ts from "typescript";
import { glob } from "glob";
import * as path from "node:path";
import * as fs from "node:fs/promises";

// =============================================================================
// Configuration
// =============================================================================

const SDK_PATH = "../cloudflare-typescript/src/resources";
const OUTPUT_PATH = "./src/services";

// CLI Options
const serviceOption = Options.text("service").pipe(
  Options.withDescription("Generate only this service (e.g., r2, workers)"),
  Options.optional,
);

const debugOption = Options.boolean("debug").pipe(
  Options.withDescription("Enable debug logging"),
  Options.withDefault(false),
);

// =============================================================================
// Types
// =============================================================================

interface ParamInfo {
  name: string;
  type: TypeInfo;
  location: "path" | "query" | "body" | "header";
  required: boolean;
  description?: string;
  headerName?: string; // For headers with custom names like 'cf-r2-jurisdiction'
}

interface TypeInfo {
  kind: "primitive" | "literal" | "union" | "array" | "object" | "null" | "unknown" | "file";
  value?: string; // For primitives and literals
  values?: TypeInfo[]; // For unions
  elementType?: TypeInfo; // For arrays
  properties?: PropertyInfo[]; // For objects
  name?: string; // For named types/interfaces
}

interface PropertyInfo {
  name: string;
  type: TypeInfo;
  required: boolean;
  description?: string;
}

interface ParsedOperation {
  // From method signature
  methodName: string; // e.g., "create", "list", "get"
  resourcePath: string[]; // e.g., ["r2", "buckets"]
  className: string; // e.g., "Buckets"

  // From method body
  httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  urlTemplate: string; // e.g., "/accounts/${account_id}/r2/buckets"
  urlPathParams: string[]; // Path parameters from URL, e.g., ["account_id", "bucketName"]

  // From params interface
  pathParams: ParamInfo[];
  queryParams: ParamInfo[];
  headerParams: ParamInfo[];
  bodyParams: ParamInfo[];

  // Response type
  responseType: TypeInfo;
  responseTypeName?: string; // Original type name from SDK

  // Source info
  sourceFile: string;

  // Type registry for this source file
  registry: TypeRegistry;
}

interface ServiceInfo {
  name: string;
  operations: ParsedOperation[];
}

// Type registry to store all parsed interfaces including nested ones
interface TypeRegistry {
  // Maps qualified names like "CORSUpdateParams.Rule" to their parsed interface
  types: Map<string, ParsedInterface>;
  // Maps type alias names to their resolved TypeInfo (e.g., "CORSUpdateResponse" -> { kind: "unknown" })
  typeAliases: Map<string, TypeInfo>;
}

/**
 * Create a type registry from a source file
 *
 * Two phases:
 * 1. First pass: collect all interface AST nodes with their qualified names
 * 2. Second pass: parse all interfaces without resolution (store primitives and type names)
 *
 * Resolution happens lazily during schema generation using resolveTypeInfo()
 */
function createTypeRegistry(sourceFile: ts.SourceFile, checker: ts.TypeChecker): TypeRegistry {
  const types = new Map<string, ParsedInterface>();
  const typeAliases = new Map<string, TypeInfo>();
  const nodeMap = new Map<string, ts.InterfaceDeclaration>();

  // First pass: collect all interface declarations and type aliases with qualified names
  function collectInterface(node: ts.InterfaceDeclaration, prefix: string = "") {
    const name = node.name.getText();
    const qualifiedName = prefix ? `${prefix}.${name}` : name;
    nodeMap.set(qualifiedName, node);
  }

  function collectTypeAlias(node: ts.TypeAliasDeclaration, prefix: string = "") {
    const name = node.name.getText();
    const qualifiedName = prefix ? `${prefix}.${name}` : name;
    // Parse the type alias's type
    const typeInfo = typeNodeToTypeInfo(node.type, checker, undefined);
    typeAliases.set(qualifiedName, typeInfo);
  }

  function collectFromNamespace(node: ts.ModuleDeclaration, prefix: string = "") {
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

/**
 * Recursively resolve a TypeInfo using the registry
 * This is called during schema/type generation, after all interfaces are parsed
 */
function resolveTypeInfoDeep(type: TypeInfo, registry: TypeRegistry, depth: number = 0): TypeInfo {
  // Prevent infinite recursion
  if (depth > 10) {
    return type;
  }

  switch (type.kind) {
    case "array":
      if (type.elementType) {
        return {
          ...type,
          elementType: resolveTypeInfoDeep(type.elementType, registry, depth + 1),
        };
      }
      return type;

    case "union":
      if (type.values) {
        const resolvedValues = type.values.map((v) => resolveTypeInfoDeep(v, registry, depth + 1));

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
function resolveTypeReference(typeName: string, registry: TypeRegistry): TypeInfo | undefined {
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

// =============================================================================
// TypeScript Parser Utilities
// =============================================================================

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
  const jsDocTags = ts.getJSDocTags(node);
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
    const values = typeNode.types.map((t) => typeNodeToTypeInfo(t, checker, registry));

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
        elementType: typeNodeToTypeInfo(typeNode.typeArguments[0], checker, registry),
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
            if (typeName && !typeName.startsWith("{") && !typeName.startsWith("__")) {
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
    const properties: PropertyInfo[] = [];

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
      if (ts.isPropertyAccessExpression(expr) && ts.isPropertyAccessExpression(expr.expression)) {
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
                const varName = callExpr.expression.getText().replace(/\?$/, "");
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

// =============================================================================
// Interface Parser
// =============================================================================

interface ParsedInterface {
  name: string;
  properties: ParsedProperty[];
  namespace?: string; // For nested interfaces
}

interface ParsedProperty {
  name: string;
  type: TypeInfo;
  location?: "path" | "query" | "body" | "header";
  required: boolean;
  description?: string;
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
    if (ts.isInterfaceDeclaration(node) && node.name.getText() === paramsTypeName) {
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

// =============================================================================
// Method Parser
// =============================================================================

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
    const paramsInterface = findParamsInterface(sourceFile, paramsTypeName, checker, registry);

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

  return {
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

// =============================================================================
// Class Parser
// =============================================================================

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
      const operation = parseMethod(member, className, resourcePath, sourceFile, checker, registry);
      if (operation) {
        operations.push(operation);
      }
    }
  }

  return operations;
}

// =============================================================================
// Name Transformation
// =============================================================================

const PLURALS: Record<string, string> = {
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

// Words that should NOT be singularized (acronyms, proper nouns, etc.)
const PRESERVE_WORDS = new Set(["cors", "dns", "ssl", "tls", "api", "kv", "r2", "d1"]);

/**
 * Singularize a word
 */
function singularize(word: string): string {
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
  if (word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us") && word.length > 2) {
    return word.slice(0, -1);
  }

  return word;
}

/**
 * Convert singular to plural form
 */
function pluralize(word: string): string {
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
function toCamelCase(str: string): string {
  return str
    .replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^([A-Z])/, (_, letter) => letter.toLowerCase());
}

/**
 * Convert to PascalCase
 */
function toPascalCase(str: string): string {
  // First convert kebab/snake to camelCase
  const camel = toCamelCase(str);
  // Then capitalize first letter
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Normalize a name to valid JavaScript identifier
 * Removes hyphens and converts to PascalCase
 */
function normalizeIdentifier(str: string): string {
  return toPascalCase(str.replace(/-/g, "_"));
}

/**
 * Build resource name from path
 * e.g., ["r2", "buckets", "lifecycle"] -> "BucketLifecycle"
 * e.g., ["r2", "buckets"] -> "Bucket" (for the main resource, class="Buckets")
 */
function buildResourceName(resourcePath: string[], className: string): string {
  // Skip the service name (first element)
  const parts = resourcePath.slice(1);

  if (parts.length === 0) {
    // Top-level resource - use class name
    return singularize(className);
  }

  // Singularize and convert to PascalCase
  const singularizedParts = parts.map((part) => toPascalCase(singularize(part)));

  // De-duplicate consecutive identical segments
  // e.g., ["Operation", "Operation"] -> ["Operation"]
  const dedupedParts: string[] = [];
  for (const part of singularizedParts) {
    if (dedupedParts.length === 0 || dedupedParts[dedupedParts.length - 1] !== part) {
      dedupedParts.push(part);
    }
  }

  return dedupedParts.join("");
}

/**
 * Map verb to standard CRUD naming
 */
function mapVerb(methodName: string, httpMethod?: string): string {
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
 * Pre-process operations to rename "update" to "put" for resources that have no "create" operation.
 * This makes the API more honest - PUT operations that create-or-update should be called "put", not "update".
 *
 * The logic:
 * 1. Group operations by resource (using buildResourceName)
 * 2. For each resource, check if there's a "create" operation (POST)
 * 3. For resources without "create", rename any "update" (PUT) operations to "put"
 * 4. Same logic applies to bulk operations: bulkUpdate -> bulkPut if no bulkCreate
 */
function renameUpdateToPutForUpserts(operations: ParsedOperation[]): ParsedOperation[] {
  // Group operations by resource name
  const resourceOps = new Map<string, ParsedOperation[]>();
  for (const op of operations) {
    const resource = buildResourceName(op.resourcePath, op.className);
    if (!resourceOps.has(resource)) {
      resourceOps.set(resource, []);
    }
    resourceOps.get(resource)!.push(op);
  }

  // For each resource, check if there's a "create" (POST) operation
  const resourcesWithCreate = new Set<string>();
  const resourcesWithBulkCreate = new Set<string>();
  for (const [resource, ops] of resourceOps) {
    // Check for single create
    const hasCreate = ops.some(
      (op) =>
        op.httpMethod === "POST" && (op.methodName === "create" || op.methodName === "add"),
    );
    if (hasCreate) {
      resourcesWithCreate.add(resource);
    }

    // Check for bulk create
    const hasBulkCreate = ops.some(
      (op) =>
        op.httpMethod === "POST" &&
        (op.methodName === "bulkCreate" ||
          op.methodName === "bulkAdd" ||
          op.methodName.startsWith("bulk") && op.methodName.toLowerCase().includes("create")),
    );
    if (hasBulkCreate) {
      resourcesWithBulkCreate.add(resource);
    }
  }

  // Return modified operations - rename "update" to "put" for resources without "create"
  return operations.map((op) => {
    const resource = buildResourceName(op.resourcePath, op.className);

    // Single update -> put (if no create)
    if (
      op.httpMethod === "PUT" &&
      op.methodName === "update" &&
      !resourcesWithCreate.has(resource)
    ) {
      return { ...op, methodName: "put" };
    }

    // Bulk update -> bulkPut (if no bulkCreate)
    if (
      op.httpMethod === "PUT" &&
      op.methodName === "bulkUpdate" &&
      !resourcesWithBulkCreate.has(resource)
    ) {
      return { ...op, methodName: "bulkPut" };
    }

    return op;
  });
}

/**
 * Convert SDK method to operation name
 * e.g., r2.buckets.create -> createBucket
 */
function toOperationName(
  resourcePath: string[],
  methodName: string,
  className: string,
  httpMethod?: string,
): string {
  const verb = mapVerb(methodName, httpMethod);
  const resource = buildResourceName(resourcePath, className);

  // Pluralize resource name for bulk and list operations
  const pluralResource = pluralize(resource);

  // Handle list -> plural naming
  if (verb === "list") {
    return `list${pluralResource}`;
  }

  // Handle bulk operations -> plural naming
  // But if verb is just "bulk" (not "bulkDelete", "bulkPatch", etc.),
  // keep singular since the resource completes the verb: "bulk query" = "to query in bulk"
  if (verb === "bulk") {
    return `${verb}${resource}`;
  }
  if (verb.startsWith("bulk")) {
    return `${verb}${pluralResource}`;
  }

  // Handle delete (reserved word)
  if (verb === "delete_") {
    return `delete${resource}`;
  }

  return `${verb}${resource}`;
}

// =============================================================================
// Schema Generator
// =============================================================================

/**
 * Convert TypeInfo to Effect Schema code
 */
function typeInfoToSchema(type: TypeInfo, indent: string = "", depth: number = 0): string {
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
      const elementSchema = typeInfoToSchema(type.elementType, indent, depth + 1);
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
        .filter((v) => v.kind !== "unknown" || values.every((t) => t.kind === "unknown"))
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
function generateOperationSchema(op: ParsedOperation): string {
  const operationName = toOperationName(
    op.resourcePath,
    op.methodName,
    op.className,
    op.httpMethod,
  );
  // Normalize the name to be a valid identifier
  const normalizedOpName = toCamelCase(operationName.replace(/-/g, "_"));
  const pascalOpName = toPascalCase(normalizedOpName);
  const requestTypeName = pascalOpName + "Request";
  const responseTypeName = pascalOpName + "Response";

  const lines: string[] = [];

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
  const allParams = [...op.pathParams, ...op.queryParams, ...op.headerParams, ...filteredBodyParams].map(
    (param) => ({
      ...param,
      type: resolveTypeInfoDeep(param.type, op.registry),
    }),
  );

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
      lines.push(`  /** ${param.description.replace(/\n/g, " ").slice(0, 200)} */`);
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
    requestProps.push(`  ${propName}: ${schema}.pipe(T.HttpPath("${wireName}"))`);
  }

  // Add query params
  for (const param of resolvedQueryParams) {
    const propName = toCamelCase(param.name);
    const wireName = param.name;
    let schema = typeInfoToSchema(param.type);
    if (!param.required) {
      schema = `Schema.optional(${schema})`;
    }
    requestProps.push(`  ${propName}: ${schema}.pipe(T.HttpQuery("${wireName}"))`);
  }

  // Add header params
  for (const param of resolvedHeaderParams) {
    const propName = toCamelCase(param.name);
    let schema = typeInfoToSchema(param.type);
    if (!param.required) {
      schema = `Schema.optional(${schema})`;
    }
    const headerName = param.headerName || param.name;
    requestProps.push(`  ${propName}: ${schema}.pipe(T.HttpHeader("${headerName}"))`);
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
  lines.push(`  .pipe(${httpTrait}) as unknown as Schema.Schema<${requestTypeName}>;`);
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
        lines.push(`  /** ${prop.description.replace(/\n/g, " ").slice(0, 200)} */`);
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
    lines.push(
      `}) as unknown as Schema.Schema<${responseTypeName}>;`,
    );
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
  lines.push(`export const ${normalizedOpName} = API.make(() => ({`);
  lines.push(`  input: ${requestTypeName},`);
  lines.push(`  output: ${responseTypeName},`);
  lines.push(`  errors: [],`);
  lines.push(`}));`);
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate Effect Schema code for an operation, using named shared types
 */
function generateOperationSchemaNamed(
  op: ParsedOperation,
  sharedTypes: Map<
    string,
    { parsed: ParsedInterface; registry: TypeRegistry; qualifiedName: string }
  >,
): string {
  const operationName = toOperationName(
    op.resourcePath,
    op.methodName,
    op.className,
    op.httpMethod,
  );
  const normalizedOpName = toCamelCase(operationName.replace(/-/g, "_"));
  const pascalOpName = toPascalCase(normalizedOpName);
  const requestTypeName = pascalOpName + "Request";
  const responseTypeName = pascalOpName + "Response";

  const lines: string[] = [];

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
  const allParams = [...op.pathParams, ...op.queryParams, ...op.headerParams, ...filteredBodyParams].map(
    (param) => ({
      ...param,
      type: resolveTypeInfoDeep(param.type, op.registry),
    }),
  );

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

  // Generate request interface using named types
  lines.push(`export interface ${requestTypeName} {`);
  for (const param of allParams) {
    const propName = toCamelCase(param.name);
    const tsType = typeInfoToTsTypeNamed(param.type, sharedTypes);
    const optMark = param.required ? "" : "?";
    if (param.description) {
      lines.push(`  /** ${param.description.replace(/\n/g, " ").slice(0, 200)} */`);
    }
    lines.push(`  ${propName}${optMark}: ${tsType};`);
  }
  lines.push(`}`);
  lines.push("");

  // Generate request schema using named types
  const requestProps: string[] = [];

  for (const param of resolvedPathParams) {
    const schema = typeInfoToSchemaNamed(param.type, sharedTypes);
    requestProps.push(`  ${param.name}: ${schema}.pipe(T.HttpPath("${param.name}"))`);
  }

  for (const param of resolvedQueryParams) {
    let schema = typeInfoToSchemaNamed(param.type, sharedTypes);
    if (!param.required) {
      schema = `Schema.optional(${schema})`;
    }
    requestProps.push(`  ${param.name}: ${schema}.pipe(T.HttpQuery("${param.name}"))`);
  }

  for (const param of resolvedHeaderParams) {
    let schema = typeInfoToSchemaNamed(param.type, sharedTypes);
    if (!param.required) {
      schema = `Schema.optional(${schema})`;
    }
    const headerName = param.headerName || param.name;
    requestProps.push(`  ${param.name}: ${schema}.pipe(T.HttpHeader("${headerName}"))`);
  }

  for (const param of resolvedBodyParams) {
    let schema = typeInfoToSchemaNamed(param.type, sharedTypes);
    if (!param.required) {
      schema = `Schema.optional(${schema})`;
    }
    requestProps.push(`  ${param.name}: ${schema}`);
  }

  const openApiPath = op.urlTemplate.replace(/\{(\w+)\}/g, "{$1}");

  lines.push(`export const ${requestTypeName} = Schema.Struct({`);
  if (requestProps.length > 0) {
    lines.push(requestProps.join(",\n"));
  }
  lines.push(`})`);
  // Add contentType: "multipart" when operation has file uploads
  const hasFilesAlt = operationHasFiles(op);
  const httpTraitAlt = hasFilesAlt
    ? `T.Http({ method: "${op.httpMethod}", path: "${openApiPath}", contentType: "multipart" })`
    : `T.Http({ method: "${op.httpMethod}", path: "${openApiPath}" })`;
  lines.push(`  .pipe(${httpTraitAlt}) as unknown as Schema.Schema<${requestTypeName}>;`);
  lines.push("");

  // Generate response interface and schema
  let resolvedResponseType: TypeInfo | undefined;
  let isTypeAlias = false;

  if (op.responseTypeName) {
    const responseInterface = op.registry.types.get(op.responseTypeName);
    if (responseInterface) {
      resolvedResponseType = resolveTypeInfoDeep(
        { kind: "object", properties: responseInterface.properties },
        op.registry,
      );
    } else {
      const typeAlias = op.registry.typeAliases.get(op.responseTypeName);
      if (typeAlias) {
        // Resolve nested types in the type alias
        resolvedResponseType = resolveTypeInfoDeep(typeAlias, op.registry);
        isTypeAlias = true;
      }
    }
  }

  if (isTypeAlias && resolvedResponseType) {
    const tsType = typeInfoToTsTypeNamed(resolvedResponseType, sharedTypes);
    const schema = typeInfoToSchemaNamed(resolvedResponseType, sharedTypes);
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
    lines.push(`export interface ${responseTypeName} {`);
    for (const prop of resolvedResponseType.properties) {
      const propName = toCamelCase(prop.name);
      const tsType = typeInfoToTsTypeNamed(prop.type, sharedTypes);
      const optMark = prop.required ? "" : "?";
      if (prop.description) {
        lines.push(`  /** ${prop.description.replace(/\n/g, " ").slice(0, 200)} */`);
      }
      lines.push(`  ${propName}${optMark}: ${tsType};`);
    }
    lines.push(`}`);
    lines.push("");

    const responseProps = resolvedResponseType.properties.map((prop) => {
      const wireName = prop.name;
      const propName = toCamelCase(wireName);
      let schema = typeInfoToSchemaNamed(prop.type, sharedTypes);
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
    lines.push(
      `}) as unknown as Schema.Schema<${responseTypeName}>;`,
    );
    lines.push("");
  } else {
    lines.push(`export type ${responseTypeName} = unknown;`);
    lines.push("");
    lines.push(
      `export const ${responseTypeName} = Schema.Unknown as unknown as Schema.Schema<${responseTypeName}>;`,
    );
    lines.push("");
  }

  lines.push(`export const ${normalizedOpName} = API.make(() => ({`);
  lines.push(`  input: ${requestTypeName},`);
  lines.push(`  output: ${responseTypeName},`);
  lines.push(`  errors: [],`);
  lines.push(`}));`);
  lines.push("");

  return lines.join("\n");
}

/**
 * Flatten a qualified name by removing dots and cleaning up noisy prefixes.
 *
 * Examples:
 * - "Sippy.Destination" -> "SippyDestination"
 * - "R2EnableSippyAws.Source" -> "SippyAwsSource"
 * - "SippyUpdateParams.R2EnableSippyAws.Source" -> "SippyUpdateParamsSippyAwsSource"
 * - "LifecycleGetResponse.Rule" -> "LifecycleGetResponseRule"
 */
function flattenTypeName(qualifiedName: string): string {
  return qualifiedName
    .replace(/\./g, "") // Remove dots
    .replace(/R2Enable/g, ""); // Strip all R2Enable occurrences
}

/**
 * Check if two ParsedInterface objects are structurally identical
 */
function areInterfacesEqual(a: ParsedInterface, b: ParsedInterface): boolean {
  if (a.properties.length !== b.properties.length) return false;

  for (let i = 0; i < a.properties.length; i++) {
    const propA = a.properties[i];
    const propB = b.properties.find((p) => p.name === propA.name);
    if (!propB) return false;
    if (propA.required !== propB.required) return false;
    if (!areTypesEqual(propA.type, propB.type)) return false;
  }

  return true;
}

/**
 * Check if two TypeInfo objects are structurally identical
 */
function areTypesEqual(a: TypeInfo, b: TypeInfo): boolean {
  if (a.kind !== b.kind) return false;
  if (a.value !== b.value) return false;
  if (a.name !== b.name) return false;

  // Check arrays
  if (a.elementType && b.elementType) {
    if (!areTypesEqual(a.elementType, b.elementType)) return false;
  } else if (a.elementType || b.elementType) {
    return false;
  }

  // Check unions
  if (a.values && b.values) {
    if (a.values.length !== b.values.length) return false;
    for (let i = 0; i < a.values.length; i++) {
      if (!areTypesEqual(a.values[i], b.values[i])) return false;
    }
  } else if (a.values || b.values) {
    return false;
  }

  // Check object properties
  if (a.properties && b.properties) {
    if (a.properties.length !== b.properties.length) return false;
    for (let i = 0; i < a.properties.length; i++) {
      const propA = a.properties[i];
      const propB = b.properties.find((p) => p.name === propA.name);
      if (!propB) return false;
      if (propA.required !== propB.required) return false;
      if (!areTypesEqual(propA.type, propB.type)) return false;
    }
  } else if (a.properties || b.properties) {
    return false;
  }

  return true;
}

/**
 * Collect all shared types from all operation registries
 * Returns a map of flattened name -> ParsedInterface
 * Deduplicates structurally identical types, throws on real conflicts
 */
function collectSharedTypes(
  service: ServiceInfo,
): Map<string, { parsed: ParsedInterface; registry: TypeRegistry; qualifiedName: string }> {
  const sharedTypes = new Map<
    string,
    { parsed: ParsedInterface; registry: TypeRegistry; qualifiedName: string }
  >();
  // Track all entries that map to each flat name for conflict detection
  const entriesByFlat = new Map<
    string,
    Array<{ qualifiedName: string; parsed: ParsedInterface; registry: TypeRegistry }>
  >();

  for (const op of service.operations) {
    for (const [qualifiedName, parsed] of op.registry.types) {
      const flatName = flattenTypeName(qualifiedName);

      const existing = entriesByFlat.get(flatName) || [];
      // Only add if we haven't seen this exact qualified name
      if (!existing.some((e) => e.qualifiedName === qualifiedName)) {
        existing.push({ qualifiedName, parsed, registry: op.registry });
        entriesByFlat.set(flatName, existing);
      }
    }
  }

  // Check for conflicts - multiple qualified names mapping to same flat name
  // but allow if they're structurally identical
  const conflicts: string[] = [];

  for (const [flatName, entries] of entriesByFlat) {
    if (entries.length === 1) {
      // No conflict, just add it
      sharedTypes.set(flatName, entries[0]);
      continue;
    }

    // Multiple entries - check if they're all structurally identical
    const first = entries[0];
    let allIdentical = true;

    for (let i = 1; i < entries.length; i++) {
      if (!areInterfacesEqual(first.parsed, entries[i].parsed)) {
        allIdentical = false;
        break;
      }
    }

    if (allIdentical) {
      // All identical, use the first one
      sharedTypes.set(flatName, first);
    } else {
      // Real conflict - different structures
      conflicts.push(
        `"${flatName}" conflicts: ${entries.map((e) => `"${e.qualifiedName}"`).join(", ")}`,
      );
    }
  }

  if (conflicts.length > 0) {
    throw new Error(
      `Type naming conflicts detected after flattening namespaces:\n${conflicts.join("\n")}\n\n` +
        `The generator does not support namespaces. These types have different qualified names ` +
        `that flatten to the same identifier and have DIFFERENT structures.`,
    );
  }

  return sharedTypes;
}

/**
 * Generate a named type (interface + schema) for a shared type
 */
function generateNamedType(
  flatName: string,
  parsed: ParsedInterface,
  registry: TypeRegistry,
  allSharedTypes: Map<
    string,
    { parsed: ParsedInterface; registry: TypeRegistry; qualifiedName: string }
  >,
): string {
  const lines: string[] = [];

  // Resolve properties deeply
  const resolvedProps = parsed.properties.map((prop) => ({
    ...prop,
    type: resolveTypeInfoDeep(prop.type, registry),
  }));

  // Generate interface
  lines.push(`export interface ${flatName} {`);
  for (const prop of resolvedProps) {
    const tsType = typeInfoToTsTypeNamed(prop.type, allSharedTypes);
    const optMark = prop.required ? "" : "?";
    if (prop.description) {
      lines.push(`  /** ${prop.description.replace(/\n/g, " ").slice(0, 200)} */`);
    }
    lines.push(`  ${prop.name}${optMark}: ${tsType};`);
  }
  lines.push(`}`);
  lines.push("");

  // Generate schema
  const schemaProps = resolvedProps.map((prop) => {
    let schema = typeInfoToSchemaNamed(prop.type, allSharedTypes);
    if (!prop.required) {
      schema = `Schema.optional(${schema})`;
    }
    return `  ${prop.name}: ${schema}`;
  });

  lines.push(`export const ${flatName} = Schema.Struct({`);
  if (schemaProps.length > 0) {
    lines.push(schemaProps.join(",\n"));
  }
  lines.push(`});`);
  lines.push("");

  return lines.join("\n");
}

/**
 * Convert TypeInfo to TypeScript type string, using named references
 */
function typeInfoToTsTypeNamed(
  type: TypeInfo,
  sharedTypes: Map<
    string,
    { parsed: ParsedInterface; registry: TypeRegistry; qualifiedName: string }
  >,
  depth: number = 0,
): string {
  if (depth > 10) return "unknown";

  // If this type has a name that matches a shared type, reference it
  if (type.kind === "object" && type.name) {
    const flatName = flattenTypeName(type.name);
    if (sharedTypes.has(flatName)) {
      return flatName;
    }
  }

  // Fall back to regular type generation
  switch (type.kind) {
    case "primitive":
      return type.value || "unknown";
    case "literal":
      if (type.value === "true" || type.value === "false") return type.value;
      return `"${type.value}"`;
    case "null":
      return "null";
    case "union":
      if (!type.values || type.values.length === 0) return "unknown";
      return type.values.map((v) => typeInfoToTsTypeNamed(v, sharedTypes, depth + 1)).join(" | ");
    case "array":
      if (!type.elementType) return "unknown[]";
      const elementType = typeInfoToTsTypeNamed(type.elementType, sharedTypes, depth + 1);
      if (elementType.includes("|")) return `(${elementType})[]`;
      return `${elementType}[]`;
    case "object":
      if (type.properties && type.properties.length > 0) {
        const props = type.properties
          .map((p) => {
            const propType = typeInfoToTsTypeNamed(p.type, sharedTypes, depth + 1);
            const optMark = p.required ? "" : "?";
            return `${p.name}${optMark}: ${propType}`;
          })
          .join("; ");
        return `{ ${props} }`;
      }
      return "unknown";
    case "unknown":
    default:
      return "unknown";
  }
}

/**
 * Convert TypeInfo to Effect Schema code, using named references
 */
function typeInfoToSchemaNamed(
  type: TypeInfo,
  sharedTypes: Map<
    string,
    { parsed: ParsedInterface; registry: TypeRegistry; qualifiedName: string }
  >,
  depth: number = 0,
): string {
  if (depth > 10) return "Schema.Unknown";

  // If this type has a name that matches a shared type, reference it
  if (type.kind === "object" && type.name) {
    const flatName = flattenTypeName(type.name);
    if (sharedTypes.has(flatName)) {
      return flatName;
    }
  }

  // Fall back to regular schema generation
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
      return `Schema.Literal("${type.value}")`;
    case "null":
      return "Schema.Null";
    case "union":
      if (!type.values || type.values.length === 0) return "Schema.Unknown";
      const allLiterals = type.values.every((v) => v.kind === "literal");
      if (allLiterals) {
        const literals = type.values.map((v) => {
          if (v.value === "true" || v.value === "false") return v.value;
          return `"${v.value}"`;
        });
        return `Schema.Literal(${literals.join(", ")})`;
      }
      const unionParts = type.values.map((v) => typeInfoToSchemaNamed(v, sharedTypes, depth + 1));
      return `Schema.Union(${unionParts.join(", ")})`;
    case "array":
      if (!type.elementType) return "Schema.Array(Schema.Unknown)";
      const elementSchema = typeInfoToSchemaNamed(type.elementType, sharedTypes, depth + 1);
      return `Schema.Array(${elementSchema})`;
    case "object":
      if (type.properties && type.properties.length > 0) {
        const propSchemas = type.properties.map((p) => {
          let schema = typeInfoToSchemaNamed(p.type, sharedTypes, depth + 1);
          if (!p.required) schema = `Schema.optional(${schema})`;
          return `${p.name}: ${schema}`;
        });
        return `Schema.Struct({ ${propSchemas.join(", ")} })`;
      }
      return "Schema.Unknown";
    case "unknown":
    default:
      return "Schema.Unknown";
  }
}

/**
 * Extract the resource name from an operation name by stripping verb prefixes.
 * Uses camelCase boundary detection - the resource starts at the first uppercase letter
 * after the verb prefix.
 * Returns singularized resource name for grouping.
 */
function extractResourceFromOperationName(operationName: string): string {
  // Bulk verbs need special handling (compound verbs like bulkDelete)
  const bulkVerbs = ["bulkCreate", "bulkUpdate", "bulkDelete", "bulkPatch", "bulkGet", "bulkPush", "bulk"];

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
  const bulkVerbs = ["bulkCreate", "bulkUpdate", "bulkDelete", "bulkPatch", "bulkGet", "bulkPush", "bulk"];
  for (const verb of bulkVerbs) {
    if (operationName.startsWith(verb) && operationName.length > verb.length) {
      const nextChar = operationName[verb.length];
      if (nextChar === nextChar.toUpperCase() && nextChar !== nextChar.toLowerCase()) {
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
 * Get the computed operation name for a ParsedOperation.
 */
function getOperationName(op: ParsedOperation): string {
  return toOperationName(op.resourcePath, op.methodName, op.className, op.httpMethod);
}

/**
 * Sort operations by resource name, then by verb order within each resource.
 */
function sortOperations(operations: ParsedOperation[]): ParsedOperation[] {
  return [...operations].sort((a, b) => {
    const opNameA = getOperationName(a);
    const opNameB = getOperationName(b);

    const resourceA = extractResourceFromOperationName(opNameA);
    const resourceB = extractResourceFromOperationName(opNameB);

    // First, sort by resource name (case-insensitive)
    const resourceCompare = resourceA.toLowerCase().localeCompare(resourceB.toLowerCase());
    if (resourceCompare !== 0) {
      return resourceCompare;
    }

    // Within the same resource, sort by verb order
    const orderA = getVerbSortOrder(opNameA);
    const orderB = getVerbSortOrder(opNameB);
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

function generateServiceFile(service: ServiceInfo): string {
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

  // Pre-process: rename "update" to "put" for resources that have no "create" operation
  const processedOperations = renameUpdateToPutForUpserts(service.operations);

  // Sort operations by resource, then by verb order
  const sortedOperations = sortOperations(processedOperations);

  // Generate each operation with inlined types, adding resource group separators
  let currentResource: string | null = null;
  for (const op of sortedOperations) {
    const opName = getOperationName(op);
    const resource = extractResourceFromOperationName(opName);

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

    lines.push(generateOperationSchema(op));
  }

  return lines.join("\n");
}

// =============================================================================
// Service Discovery
// =============================================================================

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
async function parseServiceFiles(basePath: string, serviceFilter?: string): Promise<ServiceInfo[]> {
  // Find all TypeScript files
  const pattern = serviceFilter ? `${basePath}/${serviceFilter}/**/*.ts` : `${basePath}/**/*.ts`;

  const files = await glob(pattern);

  // Filter out index files and test files
  const sourceFiles = files.filter(
    (f) => !f.endsWith("/index.ts") && !f.includes(".test.") && !f.includes(".spec."),
  );

  if (sourceFiles.length === 0) {
    console.log("No source files found");
    return [];
  }

  console.log(`Found ${sourceFiles.length} source files`);

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
        const operations = parseApiResourceClass(node, resourcePath, sourceFile, checker);

        for (const op of operations) {
          const existing = serviceMap.get(serviceName) || [];
          existing.push(op);
          serviceMap.set(serviceName, existing);
        }
      }
    });
  }

  // Convert to ServiceInfo array
  const services: ServiceInfo[] = [];
  for (const [name, operations] of serviceMap) {
    services.push({ name, operations });
  }

  return services;
}

// =============================================================================
// Main Command
// =============================================================================

const command = Command.make(
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
      const services = yield* Effect.promise(() =>
        parseServiceFiles(basePath, service._tag === "Some" ? service.value : undefined),
      );

      yield* Console.log(`Found ${services.length} services`);

      // Create output directory
      const outputPath = path.resolve(OUTPUT_PATH);
      yield* Effect.promise(() => fs.mkdir(outputPath, { recursive: true }));

      // Generate files
      for (const svc of services) {
        if (svc.operations.length === 0) {
          yield* Console.log(`Skipping ${svc.name} (no operations)`);
          continue;
        }

        yield* Console.log(`Generating ${svc.name} (${svc.operations.length} operations)`);

        if (debug) {
          for (const op of svc.operations) {
            const opName = toOperationName(
              op.resourcePath,
              op.methodName,
              op.className,
              op.httpMethod,
            );
            const normalizedOpName = toCamelCase(opName.replace(/-/g, "_"));
            yield* Console.log(`  ${normalizedOpName}: ${op.httpMethod} ${op.urlTemplate}`);
          }
        }

        const code = generateServiceFile(svc);
        const outputFile = path.join(outputPath, `${svc.name}.ts`);

        yield* Effect.promise(() => fs.writeFile(outputFile, code));
        yield* Console.log(`  -> ${outputFile}`);
      }

      // Format generated files
      yield* Console.log("Formatting generated files...");
      yield* Effect.promise(async () => {
        const proc = Bun.spawn(["bun", "oxfmt", outputPath], {
          cwd: process.cwd(),
          stdout: "inherit",
          stderr: "inherit",
        });
        await proc.exited;
      });

      yield* Console.log("Done!");
    }),
);

// Run the command
const cli = Command.run(command, {
  name: "generate-from-sdk",
  version: "1.0.0",
});

Effect.suspend(() => cli(process.argv)).pipe(
  Effect.provide(NodeContext.layer),
  Logger.withMinimumLogLevel(LogLevel.Info),
  NodeRuntime.runMain,
);

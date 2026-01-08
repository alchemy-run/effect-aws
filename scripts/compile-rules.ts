/**
 * Smithy Rules Engine Compiler
 *
 * Compiles endpoint rule sets to JavaScript functions at code generation time,
 * eliminating the need for runtime interpretation.
 *
 * This module provides two modes:
 * 1. JIT compilation for testing (compileRuleSet) - returns an executable function
 * 2. AOT code generation (generateRuleSetCode) - returns TypeScript source code
 */

import type {
  ConditionObject,
  EndpointObject,
  EndpointParams,
  Expression,
  ResolvedEndpoint,
  RuleObject,
  RuleSetObject,
  RulesValue,
} from "../src/rules-engine/expression.ts";

// Re-export types for consumers
export type { EndpointParams, ResolvedEndpoint, RuleSetObject };

/**
 * Result of endpoint resolution - either success or error
 */
export type CompiledResult =
  | { type: "endpoint"; endpoint: ResolvedEndpoint }
  | { type: "error"; message: string };

/**
 * Compiled resolver function signature
 */
export type CompiledResolver = (params: EndpointParams) => CompiledResult;

/**
 * Helper functions available at runtime for compiled resolvers
 */
export interface RuntimeHelpers {
  partition: (region: RulesValue) => RulesValue;
  parseArn: (value: RulesValue) => RulesValue;
  isVirtualHostableS3Bucket: (
    value: RulesValue,
    allowSubDomains?: RulesValue,
  ) => boolean;
  parseURL: (url: RulesValue) => RulesValue;
  substring: (
    input: RulesValue,
    start: RulesValue,
    stop: RulesValue,
    reverse: RulesValue,
  ) => RulesValue;
  uriEncode: (value: RulesValue) => RulesValue;
  isValidHostLabel: (value: RulesValue, allowSubDomains: RulesValue) => boolean;
  getAttr: (value: RulesValue, path: string) => RulesValue;
  /** Recursively resolve template values in nested objects/arrays */
  resolveTemplates: <T>(value: T) => T;
}

// =============================================================================
// Property Hoisting Optimization
// =============================================================================

/**
 * Represents a collected property pattern with its normalized form and occurrences
 */
interface PropertyPattern {
  /** Original compiled code for the properties */
  originalCode: string;
  /** Normalized code with template vars replaced by placeholders */
  normalizedCode: string;
  /** Template variables found in order (e.g., ["Region"]) */
  templateVars: string[];
  /** Number of times this pattern appears */
  count: number;
}

/**
 * Context for property hoisting optimization
 */
interface HoistingContext {
  /** Map from normalized code to pattern info */
  patterns: Map<string, PropertyPattern>;
  /** Map from original code to factory name (for patterns that should be hoisted) */
  hoistedFactories: Map<string, { factoryName: string; args: string[] }>;
  /** Counter for generating unique factory names */
  factoryCounter: number;
}

/**
 * Normalize property code by replacing template variables with numbered placeholders.
 * Returns the normalized code and the list of template variables in order.
 *
 * Handles both simple references like `${Region}` and complex expressions like
 * `${_.getAttr(bucketArn, "region")}` by extracting all variable references.
 */
const normalizeForHashing = (
  code: string,
): { normalized: string; templateVars: string[] } => {
  const templateVars: string[] = [];
  let varIndex = 0;

  // Helper to get or create placeholder for a variable
  const getPlaceholder = (varName: string): string => {
    const existingIndex = templateVars.indexOf(varName);
    if (existingIndex >= 0) {
      return `__p${existingIndex}`;
    }
    templateVars.push(varName);
    return `__p${varIndex++}`;
  };

  // Replace all template expressions, handling both simple and complex cases
  const normalized = code.replace(
    /\$\{([^}]+)\}/g,
    (fullMatch, exprContent: string) => {
      // Check if it's a simple variable reference
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(exprContent)) {
        return `\${${getPlaceholder(exprContent)}}`;
      }

      // Handle _.getAttr(varName, "path") - extract the variable reference
      const getAttrMatch = exprContent.match(
        /^_\.getAttr\(([a-zA-Z_][a-zA-Z0-9_]*),\s*"([^"]+)"\)$/,
      );
      if (getAttrMatch) {
        const [, varName, path] = getAttrMatch;
        return `\${_.getAttr(${getPlaceholder(varName)}, "${path}")}`;
      }

      // For other complex expressions, extract all identifiers that look like variables
      // and aren't known keywords/helpers
      let modifiedExpr = exprContent;
      const varMatches = exprContent.matchAll(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g);
      for (const match of varMatches) {
        const name = match[0];
        // Skip known non-variables (helpers, keywords, etc.)
        if (
          name === "_" ||
          name === "getAttr" ||
          name === "true" ||
          name === "false"
        ) {
          continue;
        }
        // Replace this variable with its placeholder
        const placeholder = getPlaceholder(name);
        modifiedExpr = modifiedExpr.replace(
          new RegExp(`\\b${name}\\b`, "g"),
          placeholder,
        );
      }
      return `\${${modifiedExpr}}`;
    },
  );

  return { normalized, templateVars };
};

/**
 * Compute whether hoisting a pattern saves characters.
 * Returns true if factory + N calls is smaller than N inline occurrences.
 */
const shouldHoist = (
  inlineSize: number,
  count: number,
  numArgs: number,
): boolean => {
  // Factory overhead: "const _pN = " + args + " => " + body
  // For 0 args: "const _pN = () => {...}" ~= 18 chars overhead
  // For 1 arg: "const _pN = (a) => {...}" ~= 20 chars overhead
  // For N args: increases slightly
  const factoryOverhead = 18 + numArgs * 3;

  // Call size: "_pN()" for 0 args, "_pN(Region)" for 1 arg, etc
  // Approximate: 4 + 7*numArgs (assuming avg var name of 6 chars + comma)
  const callSize = 4 + numArgs * 7;

  // Inline cost: count * inlineSize
  const inlineCost = count * inlineSize;

  // Factory cost: factoryOverhead + inlineSize + count * callSize
  const factoryCost = factoryOverhead + inlineSize + count * callSize;

  return factoryCost < inlineCost;
};

/**
 * Recursively collect all endpoint property objects from a rule tree.
 */
const collectEndpointProperties = (
  rules: RuleObject[],
  collector: (endpoint: EndpointObject) => void,
): void => {
  for (const rule of rules) {
    if (rule.type === "endpoint") {
      collector(rule.endpoint);
    } else if (rule.type === "tree") {
      collectEndpointProperties(rule.rules, collector);
    }
  }
};

/**
 * Build the hoisting context by analyzing all endpoint properties in a rule set.
 */
const buildHoistingContext = (rules: RuleObject[]): HoistingContext => {
  const context: HoistingContext = {
    patterns: new Map(),
    hoistedFactories: new Map(),
    factoryCounter: 0,
  };

  // First pass: collect all property patterns
  collectEndpointProperties(rules, (endpoint) => {
    if (!endpoint.properties || Object.keys(endpoint.properties).length === 0) {
      return;
    }

    // Compile properties to get the original code
    const entries = Object.entries(endpoint.properties)
      .map(([key, value]) => {
        const compiled = compileExpressionWithTemplateResolve(
          value as Expression,
        );
        return `${JSON.stringify(key)}: ${compiled}`;
      })
      .join(", ");
    const originalCode = `{${entries}}`;

    // Normalize to find duplicates
    const { normalized, templateVars } = normalizeForHashing(originalCode);

    // Update pattern count
    const existing = context.patterns.get(normalized);
    if (existing) {
      existing.count++;
    } else {
      context.patterns.set(normalized, {
        originalCode,
        normalizedCode: normalized,
        templateVars,
        count: 1,
      });
    }
  });

  // Second pass: decide which patterns to hoist
  for (const [normalized, pattern] of context.patterns) {
    const inlineSize = pattern.originalCode.length;
    if (shouldHoist(inlineSize, pattern.count, pattern.templateVars.length)) {
      const factoryName = `_p${context.factoryCounter++}`;
      context.hoistedFactories.set(normalized, {
        factoryName,
        args: pattern.templateVars,
      });
    }
  }

  return context;
};

/**
 * Generate factory function declarations for hoisted patterns.
 */
const emitHoistedFactories = (
  context: HoistingContext,
  typed: boolean,
): string[] => {
  const lines: string[] = [];

  for (const [normalized, { factoryName, args }] of context.hoistedFactories) {
    const pattern = context.patterns.get(normalized)!;

    // Build the factory body by replacing all variable references with parameter names
    // We need to replace variables wherever they appear (simple refs and inside expressions)
    let body = pattern.originalCode;
    for (let i = 0; i < args.length; i++) {
      const originalVar = args[i];
      const paramName = `_${i}`;
      // Replace all word-boundary occurrences of the variable with the parameter
      // This handles both ${Region} and ${_.getAttr(bucketArn, "region")}
      body = body.replace(new RegExp(`\\b${originalVar}\\b`, "g"), paramName);
    }

    // Build parameter list
    const params = args.map((_, i) => `_${i}`).join(", ");

    if (typed) {
      if (args.length === 0) {
        lines.push(`  const ${factoryName} = () => (${body});`);
      } else {
        lines.push(
          `  const ${factoryName} = (${params}: unknown) => (${body});`,
        );
      }
    } else {
      if (args.length === 0) {
        lines.push(`  const ${factoryName} = () => (${body});`);
      } else {
        lines.push(`  const ${factoryName} = (${params}) => (${body});`);
      }
    }
  }

  return lines;
};

// =============================================================================
// Code Generation
// =============================================================================

/**
 * Generate a valid JavaScript identifier from a variable name.
 * Some rule sets use names with dots or other invalid characters.
 */
const sanitizeVarName = (name: string): string =>
  name.replace(/[^a-zA-Z0-9_$]/g, "_");

/**
 * Compile an expression to JavaScript code.
 */
const compileExpression = (expr: Expression): string => {
  // Null/undefined literals
  if (expr === null) return "null";
  if (expr === undefined) return "undefined";

  // String literals - check for template interpolation
  if (typeof expr === "string") {
    return compileTemplateString(expr);
  }

  // Number/boolean literals
  if (typeof expr === "number" || typeof expr === "boolean") {
    return JSON.stringify(expr);
  }

  // Reference: { ref: "Region" }
  if (isReference(expr)) {
    return sanitizeVarName(expr.ref);
  }

  // Function call: { fn: "isSet", argv: [...] }
  if (isFunction(expr)) {
    return compileFunctionCall(expr.fn, expr.argv);
  }

  // Array literal
  if (Array.isArray(expr)) {
    const elements = expr.map(compileExpression).join(", ");
    return `[${elements}]`;
  }

  // Object literal
  if (typeof expr === "object") {
    const entries = Object.entries(expr)
      .map(
        ([key, value]) =>
          `${JSON.stringify(key)}: ${compileExpression(value as Expression)}`,
      )
      .join(", ");
    return `{${entries}}`;
  }

  return "undefined";
};

/**
 * Check if expression is a reference
 */
const isReference = (expr: Expression): expr is { ref: string } =>
  typeof expr === "object" &&
  expr !== null &&
  "ref" in expr &&
  typeof (expr as { ref: string }).ref === "string";

/**
 * Check if expression is a function call
 */
const isFunction = (
  expr: Expression,
): expr is { fn: string; argv: Expression[]; assign?: string } =>
  typeof expr === "object" &&
  expr !== null &&
  "fn" in expr &&
  typeof (expr as { fn: string }).fn === "string";

/**
 * Compile a template string like "{Region}.{PartitionResult#dnsSuffix}" to a JS template literal.
 */
const compileTemplateString = (template: string): string => {
  // If no interpolation needed, return as regular string
  if (!template.includes("{")) {
    return JSON.stringify(template);
  }

  // Escape backticks in the template before converting to JS template literal
  // Also escape backslashes to prevent them from escaping our escapes
  let escaped = template.replace(/\\/g, "\\\\").replace(/`/g, "\\`");

  // Replace {var} and {var#prop} patterns with ${...} expressions
  const compiled = escaped.replace(/\{([^}]+)\}/g, (_, expr) => {
    const parts = expr.split("#");
    if (parts.length === 1) {
      // Simple reference: {Region} -> ${Region}
      return `\${${sanitizeVarName(parts[0])}}`;
    } else {
      // Property access: {PartitionResult#dnsSuffix} -> ${PartitionResult.dnsSuffix}
      const [refName, ...pathParts] = parts;
      const path = pathParts.join(".");
      return `\${_.getAttr(${sanitizeVarName(refName)}, "${path}")}`;
    }
  });

  return "`" + compiled + "`";
};

/**
 * Compile a function call to JavaScript code.
 */
const compileFunctionCall = (fn: string, argv: Expression[]): string => {
  const args = argv.map(compileExpression);

  switch (fn) {
    // Standard functions that compile to inline expressions
    case "isSet":
      return `(${args[0]} != null)`;

    case "not":
      return `!(${args[0]})`;

    case "booleanEquals":
    case "stringEquals":
      return `(${args[0]} === ${args[1]})`;

    // Functions that need runtime helpers
    case "aws.partition":
      return `_.partition(${args[0]})`;

    case "aws.parseArn":
      return `_.parseArn(${args[0]})`;

    case "aws.isVirtualHostableS3Bucket":
      return `_.isVirtualHostableS3Bucket(${args.join(", ")})`;

    case "parseURL":
      return `_.parseURL(${args[0]})`;

    case "substring":
      return `_.substring(${args.join(", ")})`;

    case "uriEncode":
      return `_.uriEncode(${args[0]})`;

    case "isValidHostLabel":
      return `_.isValidHostLabel(${args.join(", ")})`;

    case "getAttr":
      // getAttr(ref, "path") -> _.getAttr(ref, "path")
      return `_.getAttr(${args.join(", ")})`;

    default:
      // Unknown function - call through helper
      throw new Error(`Unknown rules engine function: ${fn}`);
  }
};

/**
 * Compile a condition to JavaScript code.
 * Returns { code: string, varName?: string } where varName is set if assign is used.
 */
const compileCondition = (
  condition: ConditionObject,
): { code: string; varName?: string } => {
  const fnCall = compileFunctionCall(condition.fn, condition.argv);

  if (condition.assign) {
    const varName = sanitizeVarName(condition.assign);
    // Assign and check truthy: const x = fn(); if (x == null || x === false) fail
    return {
      code: fnCall,
      varName,
    };
  }

  return { code: fnCall };
};

/**
 * Compile an endpoint object to JavaScript code that returns a ResolvedEndpoint.
 * Uses shorthand: e(url) or e(url, props, headers)
 * If hoistingContext is provided, will use hoisted factory functions for repeated patterns.
 */
const compileEndpoint = (
  endpoint: EndpointObject,
  indent: string,
  hoistingContext?: HoistingContext,
): string => {
  const url = compileExpression(endpoint.url);

  const hasProperties =
    endpoint.properties && Object.keys(endpoint.properties).length > 0;
  const hasHeaders =
    endpoint.headers && Object.keys(endpoint.headers).length > 0;

  if (!hasProperties && !hasHeaders) {
    return `${indent}return e(${url});`;
  }

  // Compile properties with template interpolation
  let propertiesCode = "{}";
  if (hasProperties) {
    const entries = Object.entries(endpoint.properties!)
      .map(([key, value]) => {
        const compiled = compileExpressionWithTemplateResolve(
          value as Expression,
        );
        return `${JSON.stringify(key)}: ${compiled}`;
      })
      .join(`, `);
    const originalCode = `{${entries}}`;

    // Check if this pattern should be hoisted
    if (hoistingContext) {
      const { normalized, templateVars } = normalizeForHashing(originalCode);
      const factory = hoistingContext.hoistedFactories.get(normalized);
      if (factory) {
        // Use the hoisted factory function
        const args = templateVars.join(", ");
        propertiesCode = args
          ? `${factory.factoryName}(${args})`
          : `${factory.factoryName}()`;
      } else {
        propertiesCode = originalCode;
      }
    } else {
      propertiesCode = originalCode;
    }
  }

  // Compile headers
  let headersCode = "{}";
  if (hasHeaders) {
    const entries = Object.entries(endpoint.headers!)
      .map(([key, values]) => {
        const compiledValues = values.map(compileExpression).join(", ");
        return `${JSON.stringify(key)}: [${compiledValues}]`;
      })
      .join(`, `);
    headersCode = `{${entries}}`;
  }

  return `${indent}return e(${url}, ${propertiesCode}, ${headersCode});`;
};

/**
 * Compile an expression that may contain nested template strings in objects/arrays.
 * This recursively resolves templates in the output.
 */
const compileExpressionWithTemplateResolve = (expr: Expression): string => {
  if (expr === null) return "null";
  if (expr === undefined) return "undefined";

  if (typeof expr === "string") {
    return compileTemplateString(expr);
  }

  if (typeof expr === "number" || typeof expr === "boolean") {
    return JSON.stringify(expr);
  }

  if (isReference(expr)) {
    // For references in properties, we need to resolve any nested templates
    return `_.resolveTemplates(${sanitizeVarName(expr.ref)})`;
  }

  if (isFunction(expr)) {
    // Function results may contain templates
    return `_.resolveTemplates(${compileFunctionCall(expr.fn, expr.argv)})`;
  }

  if (Array.isArray(expr)) {
    const elements = expr.map(compileExpressionWithTemplateResolve).join(", ");
    return `[${elements}]`;
  }

  if (typeof expr === "object") {
    const entries = Object.entries(expr)
      .map(
        ([key, value]) =>
          `${JSON.stringify(key)}: ${compileExpressionWithTemplateResolve(value as Expression)}`,
      )
      .join(", ");
    return `{${entries}}`;
  }

  return "undefined";
};

/**
 * Compile a rule to JavaScript code.
 */
const compileRule = (
  rule: RuleObject,
  indent: string,
  hoistingContext?: HoistingContext,
): string => {
  const lines: string[] = [];
  const nextIndent = indent + "  ";

  // Build condition chain
  const conditionChecks: string[] = [];
  const assignments: Array<{ varName: string; code: string }> = [];

  for (const condition of rule.conditions) {
    const compiled = compileCondition(condition);
    if (compiled.varName) {
      assignments.push({ varName: compiled.varName, code: compiled.code });
      // After assignment, check truthy (rules engine semantics: null/undefined/false = falsy)
      conditionChecks.push(
        `${compiled.varName} != null && ${compiled.varName} !== false`,
      );
    } else {
      conditionChecks.push(compiled.code);
    }
  }

  // Generate the if block
  if (assignments.length > 0 || conditionChecks.length > 0) {
    // Handle assignments that need to be evaluated before the condition check
    if (assignments.length > 0) {
      // We need a block to declare variables
      lines.push(`${indent}{`);
      for (const { varName, code } of assignments) {
        lines.push(`${nextIndent}const ${varName} = ${code};`);
      }

      if (conditionChecks.length > 0) {
        lines.push(`${nextIndent}if (${conditionChecks.join(" && ")}) {`);
        lines.push(compileRuleBody(rule, nextIndent + "  ", hoistingContext));
        lines.push(`${nextIndent}}`);
      } else {
        lines.push(compileRuleBody(rule, nextIndent, hoistingContext));
      }
      lines.push(`${indent}}`);
    } else {
      lines.push(`${indent}if (${conditionChecks.join(" && ")}) {`);
      lines.push(compileRuleBody(rule, nextIndent, hoistingContext));
      lines.push(`${indent}}`);
    }
  } else {
    // No conditions - always execute (fallback rule)
    lines.push(compileRuleBody(rule, indent, hoistingContext));
  }

  return lines.join("\n");
};

/**
 * Compile the body of a rule (after conditions are checked).
 */
const compileRuleBody = (
  rule: RuleObject,
  indent: string,
  hoistingContext?: HoistingContext,
): string => {
  if (rule.type === "tree") {
    // Tree rule - compile child rules
    return rule.rules
      .map((child) => compileRule(child, indent, hoistingContext))
      .join("\n");
  }

  if (rule.type === "endpoint") {
    return compileEndpoint(rule.endpoint, indent, hoistingContext);
  }

  if (rule.type === "error") {
    const message = compileExpression(rule.error);
    return `${indent}return err(${message});`;
  }

  return "";
};

/**
 * Check if a rule set has an unconditional terminal rule (always returns).
 */
const hasUnconditionalReturn = (rules: RuleObject[]): boolean => {
  for (const rule of rules) {
    if (rule.conditions.length === 0) {
      if (rule.type === "endpoint" || rule.type === "error") return true;
      if (rule.type === "tree") return hasUnconditionalReturn(rule.rules);
    }
  }
  return false;
};

export interface GenerateOptions {
  /** Include TypeScript type annotations (for AOT codegen) */
  typed?: boolean;
}

/**
 * Generate the complete function code for a rule set.
 */
export const generateRuleSetCode = (
  ruleSet: RuleSetObject,
  options: GenerateOptions = {},
): string => {
  const { typed = false } = options;
  const lines: string[] = [];

  // Build hoisting context for property deduplication
  const hoistingContext = buildHoistingContext(ruleSet.rules);

  // Generate parameter destructuring with defaults
  const paramEntries = Object.entries(ruleSet.parameters);
  const paramDestructure = paramEntries
    .map(([name, param]) => {
      const varName = sanitizeVarName(name);
      if (param.default !== undefined) {
        return `${varName} = ${JSON.stringify(param.default)}`;
      }
      return varName;
    })
    .join(", ");

  lines.push(`(p, _) => {`);
  lines.push(`  const { ${paramDestructure} } = p;`);
  // Helper functions for compact output
  // Use `unknown` for url/message since params are destructured as unknown
  if (typed) {
    lines.push(
      `  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({ type: "endpoint" as const, endpoint: { url: u as string, properties: p, headers: h } });`,
    );
    lines.push(
      `  const err = (m: unknown): T.EndpointResolverResult => ({ type: "error" as const, message: m as string });`,
    );
  } else {
    lines.push(
      `  const e = (u, p = {}, h = {}) => ({ type: "endpoint", endpoint: { url: u, properties: p, headers: h } });`,
    );
    lines.push(`  const err = (m) => ({ type: "error", message: m });`);
  }

  // Emit hoisted factory functions for repeated property patterns
  const factoryLines = emitHoistedFactories(hoistingContext, typed);
  lines.push(...factoryLines);

  // Compile all rules with hoisting context
  for (const rule of ruleSet.rules) {
    lines.push(compileRule(rule, "  ", hoistingContext));
  }

  // Only add fallback if there's no unconditional return
  if (!hasUnconditionalReturn(ruleSet.rules)) {
    lines.push(`  return err("No matching endpoint rule");`);
  }
  lines.push(`}`);

  return lines.join("\n");
};

/**
 * Generate TypeScript source code for a rule set resolver function.
 * This is used by the code generator to emit compiled functions.
 */
export const generateRuleSetTypeScript = (ruleSet: RuleSetObject): string => {
  // Generate the function body
  const functionBody = generateRuleSetCode(ruleSet);

  return functionBody;
};

// =============================================================================
// JIT Compilation (for testing)
// =============================================================================

// Import runtime helpers for JIT mode
import {
  isVirtualHostableS3Bucket,
  parseArn,
  partition,
} from "../src/rules-engine/aws-functions.ts";
import {
  getAttr,
  isValidHostLabel,
  parseURL,
  substring,
  uriEncode,
} from "../src/rules-engine/standard-functions.ts";

/**
 * Recursively resolve template values in nested objects/arrays
 */
const resolveTemplates = <T>(value: T): T => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(resolveTemplates) as T;
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = resolveTemplates(v);
    }
    return result as T;
  }
  return value;
};

/**
 * Runtime helpers bundle for JIT-compiled functions
 */
const runtimeHelpers: RuntimeHelpers = {
  partition,
  parseArn,
  isVirtualHostableS3Bucket,
  parseURL,
  substring,
  uriEncode,
  isValidHostLabel,
  getAttr,
  resolveTemplates,
} as any;

/**
 * JIT compile a rule set to an executable function.
 * Used for testing to validate compiled output matches interpreter.
 */
export const compileRuleSet = (ruleSet: RuleSetObject): CompiledResolver => {
  const code = generateRuleSetCode(ruleSet);

  // Create a function from the generated code
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function("p", "_", `return (${code})(p, _);`);

  return (params: EndpointParams): CompiledResult => {
    return fn(params, runtimeHelpers) as CompiledResult;
  };
};

/**
 * Resolve an endpoint using a JIT-compiled function.
 * Throws on error (like resolveEndpointSync).
 */
export const resolveEndpointCompiled = (
  ruleSet: RuleSetObject,
  params: EndpointParams,
): ResolvedEndpoint => {
  const resolver = compileRuleSet(ruleSet);
  const result = resolver(params);

  if (result.type === "error") {
    throw new Error(result.message);
  }

  return result.endpoint;
};

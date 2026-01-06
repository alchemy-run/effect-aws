/**
 * Smithy Rules Engine Evaluator
 *
 * Evaluates endpoint rule sets to resolve endpoints dynamically.
 */

import { Effect } from "effect";
import { EndpointError, NoMatchingRuleError } from "../errors.ts";
import {
  isVirtualHostableS3Bucket,
  parseArn,
  partition,
} from "./aws-functions.ts";
import {
  type ConditionObject,
  type EndpointObject,
  type EndpointParams,
  type EndpointResolverOptions,
  type EvaluationScope,
  type Expression,
  type FunctionObject,
  isEndpointRule,
  isErrorRule,
  isFunction,
  isReference,
  isTreeRule,
  type ReferenceObject,
  type ResolvedEndpoint,
  type RuleObject,
  type RuleSetObject,
  type RulesValue,
} from "./model.ts";
import {
  booleanEquals,
  getAttr,
  isSet,
  isValidHostLabel,
  not,
  parseURL,
  substring,
  uriEncode,
} from "./standard-functions.ts";

// Registry uses loose typing since dispatch inherently loses type info
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const functionRegistry: Record<string, (...args: any[]) => unknown> = {
  isSet,
  not,
  booleanEquals,
  stringEquals: booleanEquals,
  getAttr,
  substring,
  parseURL,
  uriEncode,
  isValidHostLabel,
  "aws.partition": partition,
  "aws.parseArn": parseArn,
  "aws.isVirtualHostableS3Bucket": isVirtualHostableS3Bucket,
};

const dispatchFunction = (name: string, args: RulesValue[]): RulesValue =>
  functionRegistry[name]?.(...args) as RulesValue;

/** Evaluate an expression in the given scope. */
function evaluateExpression(
  expr: Expression,
  scope: EvaluationScope,
): RulesValue {
  // Literal values
  if (expr === null || expr === undefined) {
    return expr;
  }

  if (typeof expr === "string") {
    // Interpolate template strings like "{arn#partition}"
    return interpolateTemplate(expr, scope);
  }

  if (typeof expr === "number" || typeof expr === "boolean") {
    return expr;
  }

  // Reference
  if (isReference(expr)) {
    return evaluateReference(expr, scope);
  }

  // Function call
  if (isFunction(expr)) {
    return evaluateFunctionCall(expr, scope);
  }

  // Array literal
  if (Array.isArray(expr)) {
    return expr.map((e) => evaluateExpression(e, scope));
  }

  // Object literal
  if (typeof expr === "object") {
    const result: Record<string, RulesValue> = {};
    for (const [key, value] of Object.entries(expr)) {
      result[key] = evaluateExpression(value as Expression, scope);
    }
    return result;
  }

  return undefined;
}

const evaluateReference = (
  ref: ReferenceObject,
  scope: EvaluationScope,
): RulesValue => scope.get(ref.ref);

function evaluateFunctionCall(
  fn: FunctionObject,
  scope: EvaluationScope,
): RulesValue {
  const args = fn.argv.map((arg) => evaluateExpression(arg, scope));
  return dispatchFunction(fn.fn, args);
}

/** Evaluate a condition and optionally assign the result. */
function evaluateCondition(
  condition: ConditionObject,
  scope: EvaluationScope,
): boolean {
  // Evaluate arguments
  const args = condition.argv.map((arg) => evaluateExpression(arg, scope));

  // Dispatch the function call
  const result = dispatchFunction(condition.fn, args);

  // Assign result if specified
  if (condition.assign && result !== undefined && result !== null) {
    scope.set(condition.assign, result);
  }

  // Check if result is truthy
  return isTruthy(result);
}

/**
 * Check if a value is truthy in the rules engine sense.
 * - null/undefined -> false
 * - false -> false
 * - empty string -> truthy (unlike JS!)
 * - Everything else -> true
 */
function isTruthy(value: RulesValue): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (value === false) {
    return false;
  }
  return true;
}

/** Interpolate template strings like "{Region}" or "{url#scheme}". */
function interpolateTemplate(template: string, scope: EvaluationScope): string {
  return template.replace(/\{([^}]+)\}/g, (_, expr) => {
    // Handle property access with # (e.g., "url#scheme")
    const parts = expr.split("#");
    let value: RulesValue;

    if (parts.length === 1) {
      // Simple reference
      value = scope.get(parts[0]);
    } else {
      // Property access
      const [refName, ...pathParts] = parts;
      const ref = scope.get(refName);
      if (ref && typeof ref === "object") {
        value = getAttr(ref, pathParts.join("."));
      } else {
        value = undefined;
      }
    }

    return value !== undefined && value !== null ? String(value) : "";
  });
}

function resolveExpressionToString(
  expr: Expression,
  scope: EvaluationScope,
): string {
  const value = evaluateExpression(expr, scope);
  return typeof value === "string"
    ? interpolateTemplate(value, scope)
    : String(value ?? "");
}

/** Recursively resolve template strings in a value. */
function resolveValueWithTemplates(
  value: RulesValue,
  scope: EvaluationScope,
): RulesValue {
  if (typeof value === "string") {
    return interpolateTemplate(value, scope);
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveValueWithTemplates(item, scope));
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, RulesValue> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = resolveValueWithTemplates(val as RulesValue, scope);
    }
    return result;
  }

  return value;
}

function resolveEndpointObject(
  endpoint: EndpointObject,
  scope: EvaluationScope,
): ResolvedEndpoint {
  // Resolve URL
  const url = resolveExpressionToString(endpoint.url, scope);

  // Resolve properties (with recursive template interpolation)
  const properties: Record<string, RulesValue> = {};
  if (endpoint.properties) {
    for (const [key, value] of Object.entries(endpoint.properties)) {
      const evaluated = evaluateExpression(value, scope);
      properties[key] = resolveValueWithTemplates(evaluated, scope);
    }
  }

  // Resolve headers
  const headers: Record<string, string[]> = {};
  if (endpoint.headers) {
    for (const [key, values] of Object.entries(endpoint.headers)) {
      headers[key] = values.map((v) => resolveExpressionToString(v, scope));
    }
  }

  return { url, properties, headers };
}

type RuleResult =
  | { type: "endpoint"; endpoint: ResolvedEndpoint }
  | { type: "error"; message: string }
  | { type: "none" };

function evaluateRule(rule: RuleObject, scope: EvaluationScope): RuleResult {
  // Create a new scope for this rule (inherit from parent)
  const ruleScope = new Map(scope);

  // Evaluate all conditions
  for (const condition of rule.conditions) {
    if (!evaluateCondition(condition, ruleScope)) {
      return { type: "none" };
    }
  }

  // All conditions passed - handle rule type
  if (isTreeRule(rule)) {
    // Evaluate child rules
    for (const childRule of rule.rules) {
      const result = evaluateRule(childRule, ruleScope);
      if (result.type !== "none") {
        return result;
      }
    }
    return { type: "none" };
  }

  if (isEndpointRule(rule)) {
    const endpoint = resolveEndpointObject(rule.endpoint, ruleScope);
    return { type: "endpoint", endpoint };
  }

  if (isErrorRule(rule)) {
    const message = resolveExpressionToString(rule.error, ruleScope);
    return { type: "error", message };
  }

  return { type: "none" };
}

/** Resolve an endpoint using the given ruleset and parameters. */
export function resolveEndpoint(
  ruleSet: RuleSetObject,
  options: EndpointResolverOptions,
): Effect.Effect<ResolvedEndpoint, EndpointError | NoMatchingRuleError> {
  return Effect.gen(function* () {
    const { endpointParams } = options;

    // Initialize scope with parameter defaults
    const scope: EvaluationScope = new Map();

    for (const [name, param] of Object.entries(ruleSet.parameters)) {
      if (param.default !== undefined) {
        scope.set(name, param.default);
      }
    }

    // Override with provided parameters
    for (const [name, value] of Object.entries(endpointParams)) {
      if (value !== undefined) {
        scope.set(name, value);
      }
    }

    // Evaluate rules
    for (const rule of ruleSet.rules) {
      const result = evaluateRule(rule, scope);

      if (result.type === "endpoint") {
        return result.endpoint;
      }

      if (result.type === "error") {
        return yield* new EndpointError({ message: result.message });
      }
    }

    return yield* new NoMatchingRuleError();
  });
}

/** Resolve an endpoint synchronously (throws on error). */
export const resolveEndpointSync = (
  ruleSet: RuleSetObject,
  endpointParams: EndpointParams,
) => Effect.runSync(resolveEndpoint(ruleSet, { endpointParams }));

/**
 * Smithy Rules Engine Types
 *
 * TypeScript types matching the Smithy rules engine specification for endpoint resolution.
 * @see https://smithy.io/2.0/additional-specs/rules-engine/index.html
 */

/** An expression is either a literal, reference, or function call */
export type Expression = RulesValue | ReferenceObject | FunctionObject;

/** Primitive values that can appear in rules engine expressions */
export type RulesValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | RulesValue[]
  | Record<string, unknown>;

/** Reference to a parameter or assigned variable */
export interface ReferenceObject {
  ref: string;
}

/** Function invocation */
export interface FunctionObject {
  fn: string;
  argv: Expression[];
  assign?: string;
}

/** A condition is a function call that may assign its result to a variable */
export interface ConditionObject {
  fn: string;
  argv: Expression[];
  assign?: string;
}

/** Base fields shared by all rule types */
interface RuleBase {
  conditions: ConditionObject[];
  documentation?: string;
}

/** Tree rule - contains nested rules evaluated if conditions pass */
export interface TreeRuleObject extends RuleBase {
  type: "tree";
  rules: RuleObject[];
}

/** Endpoint rule - returns an endpoint if conditions pass */
export interface EndpointRuleObject extends RuleBase {
  type: "endpoint";
  endpoint: EndpointObject;
}

/** Error rule - returns an error if conditions pass */
export interface ErrorRuleObject extends RuleBase {
  type: "error";
  error: Expression;
}

/** Union of all rule types */
export type RuleObject = TreeRuleObject | EndpointRuleObject | ErrorRuleObject;

/** Authentication scheme configuration */
export interface AuthSchemeObject {
  name: string;
  signingName?: string;
  signingRegion?: string;
  signingRegionSet?: string[];
  disableDoubleEncoding?: boolean;
  disableNormalizePath?: boolean;
}

/** Resolved endpoint URL and configuration */
export interface EndpointObject {
  url: Expression;
  properties?: Record<string, Expression>;
  headers?: Record<string, Expression[]>;
}

/** Resolved endpoint after evaluation */
export interface ResolvedEndpoint {
  url: string;
  properties: Record<string, RulesValue>;
  headers: Record<string, string[]>;
}

/** Parameter type definitions */
export type ParameterType = "string" | "boolean" | "stringArray";

/** Parameter definition in a ruleset */
export interface ParameterObject {
  type: ParameterType;
  required?: boolean;
  default?: RulesValue;
  documentation?: string;
  builtIn?: string;
  deprecated?: {
    message?: string;
    since?: string;
  };
}

/** Top-level ruleset definition */
export interface RuleSetObject {
  version: string;
  parameters: Record<string, ParameterObject>;
  rules: RuleObject[];
}

/** Endpoint parameters passed to the resolver */
export type EndpointParams = Record<string, RulesValue>;

/** Scope for variable storage during evaluation */
export type EvaluationScope = Map<string, RulesValue>;

/** Options for endpoint resolution */
export interface EndpointResolverOptions {
  endpointParams: EndpointParams;
  logger?: {
    debug?: (...args: unknown[]) => void;
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
  };
}

/** Partition information returned by aws.partition */
export interface PartitionInfo {
  name: string;
  dnsSuffix: string;
  dualStackDnsSuffix: string;
  supportsFIPS: boolean;
  supportsDualStack: boolean;
  implicitGlobalRegion: string;
}

/** Parsed ARN structure returned by aws.parseArn */
export interface ParsedArn {
  partition: string;
  service: string;
  region: string;
  accountId: string;
  resourceId: string[];
}

/** Parsed URL structure returned by parseURL */
export interface ParsedUrl {
  scheme: string;
  authority: string;
  path: string;
  normalizedPath: string;
  isIp: boolean;
}

/** Function implementation signature */
export type RulesFunction = (...args: RulesValue[]) => RulesValue;

/** Function registry for standard and AWS functions */
export interface FunctionRegistry {
  [name: string]: RulesFunction;
}

/** Check if expression is a reference */
export function isReference(expr: Expression): expr is ReferenceObject {
  return (
    typeof expr === "object" &&
    expr !== null &&
    "ref" in expr &&
    typeof (expr as ReferenceObject).ref === "string"
  );
}

/** Check if expression is a function call */
export function isFunction(expr: Expression): expr is FunctionObject {
  return (
    typeof expr === "object" &&
    expr !== null &&
    "fn" in expr &&
    typeof (expr as FunctionObject).fn === "string"
  );
}

/** Check if rule is a tree rule */
export function isTreeRule(rule: RuleObject): rule is TreeRuleObject {
  return rule.type === "tree";
}

/** Check if rule is an endpoint rule */
export function isEndpointRule(rule: RuleObject): rule is EndpointRuleObject {
  return rule.type === "endpoint";
}

/** Check if rule is an error rule */
export function isErrorRule(rule: RuleObject): rule is ErrorRuleObject {
  return rule.type === "error";
}

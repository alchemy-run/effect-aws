/**
 * Rules Resolver - resolves endpoints using Smithy rules engine.
 *
 * This layer:
 * 1. Extracts endpoint rule set from schema annotations
 * 2. Builds endpoint parameters from input and region
 * 3. Evaluates rules to resolve endpoint URL, headers, and auth schemes
 * 4. Adjusts request path when context params are moved to hostname
 *
 * This is independently testable without making HTTP requests.
 */

import * as Effect from "effect/Effect";
import * as AST from "effect/SchemaAST";
import type { Operation } from "../client/operation.ts";
import type { Request } from "../client/request.ts";
import {
  getContextParam,
  getEndpointRuleSet,
  getStaticContextParams,
  hasHttpLabel,
} from "../traits.ts";
import { getPropertySignatures } from "../util/ast.ts";
import { resolveEndpoint } from "./evaluator.ts";
import type { EndpointParams, ResolvedEndpoint, RulesValue } from "./model.ts";

export interface RulesResolverInput {
  /** The operation input payload */
  input: unknown;
  /** The AWS region */
  region: string;
  /** The serialized request (path may be adjusted based on endpoint resolution) */
  request: Request;
}

export interface RulesResolverOutput {
  /** The resolved endpoint */
  endpoint: ResolvedEndpoint;
  /** The request with path adjusted if needed */
  request: Request;
}

/**
 * Create a rules resolver for a given operation.
 *
 * Expensive work (rule set discovery, context param extraction) is done once at creation time.
 *
 * @param operation - The operation (with input schema containing endpoint rule set annotations)
 * @param options - Optional overrides
 * @returns A function that resolves endpoints from input values and region
 */
export const makeRulesResolver = (operation: Operation) => {
  const inputAst = operation.input.ast;

  // Extract rule set from annotations or use override (done once)
  const ruleSet = getEndpointRuleSet(inputAst);

  // If no rule set is available, return null
  if (!ruleSet) {
    return undefined;
  }

  // Extract context param mappings (done once)
  const contextParamMappings = extractContextParamMappings(inputAst);

  // Extract static context params (done once)
  const staticContextParams = getStaticContextParams(inputAst);

  // Return a function that resolves endpoints and adjusts request
  return Effect.fn(function* (resolverInput: RulesResolverInput) {
    const { input, region, request } = resolverInput;

    // Build endpoint params from input + region
    const endpointParams: EndpointParams = {
      Region: region,
    };

    // Apply static context params first (operation-level fixed values)
    if (staticContextParams) {
      for (const [paramName, paramDef] of Object.entries(staticContextParams)) {
        endpointParams[paramName] = paramDef.value as RulesValue;
      }
    }

    // Extract context parameters from the payload
    const payloadObj = input as Record<string, RulesValue>;
    for (const [propName, info] of contextParamMappings) {
      if (payloadObj[propName] !== undefined) {
        endpointParams[info.paramName] = payloadObj[propName];
      }
    }

    // Resolve endpoint using the rules engine
    const endpoint = yield* resolveEndpoint(ruleSet, { endpointParams });

    // Adjust request path if context params were moved to hostname
    // This handles S3 virtual-hosted style where Bucket is in the hostname
    const adjustedRequest = adjustRequestPath(
      request,
      endpoint.url,
      contextParamMappings,
      payloadObj,
    );

    return { endpoint, request: adjustedRequest };
  });
};

interface ContextParamInfo {
  /** The endpoint param name (e.g., "Bucket") */
  paramName: string;
  /** Whether this param is also an HTTP label in the path */
  isHttpLabel: boolean;
}

/**
 * Extract context parameter mappings from an input schema.
 * Maps property names to their context parameter info.
 */
function extractContextParamMappings(
  ast: AST.AST,
): Map<string, ContextParamInfo> {
  const mappings = new Map<string, ContextParamInfo>();
  const props = getPropertySignatures(ast);

  for (const prop of props) {
    const contextParam = getContextParam(prop);
    if (contextParam) {
      mappings.set(String(prop.name), {
        paramName: contextParam,
        isHttpLabel: hasHttpLabel(prop),
      });
    }
  }

  return mappings;
}

/**
 * Adjust request path when context params are moved to the endpoint hostname.
 *
 * When endpoint rules use virtual-hosted style (e.g., S3), context params like
 * Bucket are moved to the hostname. But the protocol serializer already put
 * them in the path based on @httpLabel. This function strips the duplicated
 * prefix from the path.
 */
function adjustRequestPath(
  request: Request,
  endpointUrl: string,
  contextParamMappings: Map<string, ContextParamInfo>,
  input: Record<string, unknown>,
): Request {
  try {
    const url = new URL(endpointUrl);
    const hostname = url.hostname;

    // Check each context param that is also an HTTP label
    for (const [propName, info] of contextParamMappings) {
      if (!info.isHttpLabel) continue;

      const value = input[propName];
      if (typeof value !== "string") continue;

      // Check if the hostname starts with this value (virtual-hosted style)
      // e.g., "mybucket.s3.us-east-1.amazonaws.com" starts with "mybucket."
      if (hostname.startsWith(`${value}.`)) {
        // The HTTP label would have been serialized as "/{value}" in the path
        const pathPrefix = `/${encodeURIComponent(value)}`;

        if (request.path.startsWith(pathPrefix)) {
          let adjustedPath = request.path.slice(pathPrefix.length);
          // Normalize empty path
          if (adjustedPath === "" || adjustedPath === "/") {
            adjustedPath = "";
          }
          return { ...request, path: adjustedPath };
        }
      }
    }
  } catch {
    // URL parsing failed, return original request
  }

  return request;
}

/**
 * Endpoint Resolver - resolves endpoints using compiled Smithy rules.
 *
 * This layer:
 * 1. Extracts the endpoint resolver function from schema annotations
 * 2. Builds endpoint parameters from input and region
 * 3. Calls the resolver to get endpoint URL, headers, and auth schemes
 * 4. Adjusts request path when context params are moved to hostname
 *
 * The resolver function is compiled at code generation time from the Smithy
 * rule set, eliminating the need for runtime interpretation.
 *
 * This is independently testable without making HTTP requests.
 */

import * as Effect from "effect/Effect";
import * as AST from "effect/SchemaAST";
import type { Operation } from "../client/operation.ts";
import type { Request } from "../client/request.ts";
import {
  type EndpointResolverHelpers,
  getContextParam,
  getEndpointResolver,
  getStaticContextParams,
  hasHttpLabel,
} from "../traits.ts";
import { getPropertySignatures } from "../util/ast.ts";
import {
  isVirtualHostableS3Bucket,
  parseArn,
  partition,
} from "./aws-functions.ts";
import type {
  EndpointParams,
  ResolvedEndpoint,
  RulesValue,
} from "./expression.ts";
import {
  getAttr,
  isValidHostLabel,
  parseURL,
  substring,
  uriEncode,
} from "./standard-functions.ts";

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

/** Runtime helpers for compiled endpoint resolvers */
const endpointResolverHelpers = {
  partition,
  parseArn,
  isVirtualHostableS3Bucket,
  parseURL,
  substring,
  uriEncode,
  isValidHostLabel,
  getAttr,
  resolveTemplates,
} as EndpointResolverHelpers;

export interface EndpointResolverInput {
  /** The operation input payload */
  input: unknown;
  /** The AWS region */
  region: string;
  /** The serialized request (path may be adjusted based on endpoint resolution) */
  request: Request;
}

export interface EndpointResolverOutput {
  /** The resolved endpoint */
  endpoint: ResolvedEndpoint;
  /** The request with path adjusted if needed */
  request: Request;
}

/**
 * Create an endpoint resolver for a given operation.
 *
 * Expensive work (resolver discovery, context param extraction) is done once at creation time.
 *
 * @param operation - The operation (with input schema containing endpoint resolver annotation)
 * @returns A function that resolves endpoints from input values and region
 */
export const makeEndpointResolver = (operation: Operation) => {
  const inputAst = operation.input.ast;

  // Extract compiled endpoint resolver from annotations (done once)
  const resolver = getEndpointResolver(inputAst);

  // If no resolver is available, return undefined
  if (!resolver) {
    return undefined;
  }

  // Extract context param mappings (done once)
  const contextParamMappings = extractContextParamMappings(inputAst);

  // Extract static context params (done once)
  const staticContextParams = getStaticContextParams(inputAst);

  // Return a function that resolves endpoints and adjusts request
  return Effect.fn(function* (resolverInput: EndpointResolverInput) {
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

    // Resolve endpoint using the compiled resolver
    const result = resolver(
      endpointParams as Record<string, unknown>,
      endpointResolverHelpers,
    );

    if (result.type === "error") {
      return yield* Effect.fail(new Error(result.message));
    }

    const endpoint: ResolvedEndpoint = {
      url: result.endpoint.url,
      properties: result.endpoint.properties as Record<string, RulesValue>,
      headers: result.endpoint.headers,
    };

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

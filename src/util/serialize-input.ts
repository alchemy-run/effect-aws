/**
 * Input Serialization
 *
 * Binds input values to HTTP request parts (headers, path labels, query params)
 * based on Smithy HTTP trait annotations.
 */

import type * as AST from "effect/SchemaAST";
import type { Request } from "../request.ts";
import {
  getHttpHeader,
  getHttpLabelName,
  getHttpPrefixHeaders,
  getHttpQuery,
  getHttpTrait,
  hasHttpLabel,
  hasHttpPayload,
  hasHttpQueryParams,
} from "../traits.ts";
import { getEncodedPropertySignatures } from "./ast.ts";

/**
 * Apply the @http trait (method, uri) to the request.
 */
export function applyHttpTrait(ast: AST.AST, request: Request): void {
  const httpTrait = getHttpTrait(ast);
  if (httpTrait) {
    request.method = httpTrait.method;
    request.path = httpTrait.uri;
  }
}

/**
 * Bind input values to HTTP request based on trait annotations.
 *
 * This processes each input member and:
 * - Adds @httpHeader values to request.headers
 * - Substitutes @httpLabel values in request.path
 * - Adds @httpQuery values to request.query
 * - Adds @httpPrefixHeaders values to request.headers
 * - Collects @httpPayload for body serialization
 * - Collects remaining members as body content
 */
export function bindInputToRequest(
  ast: AST.AST,
  input: Record<string, unknown>,
  request: Request,
) {
  // Use encoded property signatures - these have wire format keys matching the encoded input
  const props = getEncodedPropertySignatures(ast);

  let payloadValue: unknown = undefined;
  let payloadAst: AST.AST | undefined = undefined;
  const bodyMembers: Record<string, unknown> = {};
  let hasBodyMembers = false;

  for (const prop of props) {
    const name = prop.name as string;
    const value = input[name];
    if (value === undefined) continue;

    const header = getHttpHeader(prop);
    const label = hasHttpLabel(prop);
    const queryParam = getHttpQuery(prop);
    const queryParams = hasHttpQueryParams(prop);
    const prefixHeaders = getHttpPrefixHeaders(prop);
    const isPayload = hasHttpPayload(prop);

    if (header !== undefined) {
      // Value should already be encoded (dates as formatted strings, etc.)
      request.headers[header] = String(value);
    } else if (label) {
      // Use explicit label name if provided (needed when JsonName differs from URI template placeholder)
      const labelName = getHttpLabelName(prop) ?? name;
      request.path = request.path.replace(
        new RegExp(`\\{${labelName}\\+?\\}`),
        encodeURIComponent(String(value)),
      );
    } else if (queryParam !== undefined) {
      // Handle arrays as repeated query parameters (e.g., tagKeys=A&tagKeys=B)
      if (Array.isArray(value)) {
        request.query[queryParam] = value.map(String);
      } else {
        request.query[queryParam] = String(value);
      }
    } else if (queryParams && typeof value === "object") {
      Object.assign(request.query, value);
    } else if (prefixHeaders !== undefined && typeof value === "object") {
      for (const [k, v] of Object.entries(value as Record<string, string>)) {
        request.headers[`${prefixHeaders}${k}`] = v;
      }
    } else if (isPayload) {
      payloadValue = value;
      payloadAst = prop.type;
    } else {
      bodyMembers[name] = value;
      hasBodyMembers = true;
    }
  }

  return { payloadValue, payloadAst, bodyMembers, hasBodyMembers };
}

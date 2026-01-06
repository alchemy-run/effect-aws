/**
 * Query Parameter Utilities
 *
 * Handles extraction and parsing of query parameters from URI paths.
 */

import type { Request } from "../client/request.ts";

/**
 * Extract static query params from the URI path (e.g., "/{Bucket}?tagging").
 * Modifies request.path to remove the query part and adds params to request.query.
 */
export function extractStaticQueryParams(request: Request): void {
  const [pathPart, queryPart] = request.path.split("?");
  request.path = pathPart;
  if (queryPart) {
    for (const param of queryPart.split("&")) {
      const [k, v] = param.split("=");
      if (k && !(k in request.query)) {
        request.query[k] = v ?? "";
      }
    }
  }
}

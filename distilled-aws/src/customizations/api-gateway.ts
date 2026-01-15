/**
 * Amazon API Gateway Customizations
 *
 * https://smithy.io/2.0/aws/customizations/apigateway-customizations.html
 *
 * A client for Amazon API Gateway MUST set the Accept header to
 * the string literal value of "application/json" for all requests.
 */

import type { Request } from "../client/request.ts";

/**
 * Apply API Gateway specific customizations to a request.
 *
 * @param request - The request to customize
 * @returns The request with API Gateway customizations applied
 */
export function applyApiGatewayCustomizations(request: Request): Request {
  return {
    ...request,
    headers: {
      ...request.headers,
      Accept: "application/json",
    },
  };
}

/**
 * Check if a service is Amazon API Gateway based on its SDK ID.
 *
 * @param sdkId - The SDK ID from the aws.api#service trait
 * @returns true if the service is API Gateway
 */
export function isApiGateway(sdkId: string | undefined): boolean {
  return sdkId === "API Gateway";
}

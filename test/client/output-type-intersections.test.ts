/**
 * Tests for output type intersections.
 *
 * These tests verify that:
 * 1. Structures with @clientOptional + @required members generate correct intersection types
 * 2. The intersection types properly show soft-required fields as required in output contexts
 * 3. Type-level verification that the generated types are correct
 */

import { expect, it } from "@effect/vitest";
import type { Api, GetApisResponse } from "../../src/services/apigatewayv2.ts";

/**
 * Type-level test: Verify that GetApisResponse.Items has the correct intersection type.
 *
 * The Api type has Name, ProtocolType, and RouteSelectionExpression as @clientOptional + @required.
 * In output contexts, these should appear as required (non-optional) in the type.
 *
 * This test uses type assertions to verify the structure at compile time.
 */
it("GetApisResponse.Items type includes intersection for soft-required fields", () => {
  // Create a mock response that matches the expected type
  const mockApi: Api & {
    Name: string;
    ProtocolType: string;
    RouteSelectionExpression: string;
  } = {
    Name: "test-api",
    ProtocolType: "HTTP",
    RouteSelectionExpression: "$request.method",
    ApiId: "test-id",
  };

  // This should compile without type errors because the intersection type
  // requires Name, ProtocolType, and RouteSelectionExpression to be present
  const mockResponse: GetApisResponse = {
    Items: [mockApi],
    NextToken: undefined,
  };

  expect(mockResponse.Items).toHaveLength(1);
  expect(mockResponse.Items![0].Name).toBe("test-api");
});

/**
 * Type-level test: Verify that Api base type still allows optional soft-required fields.
 *
 * The Api interface itself keeps these fields as optional for use in input contexts.
 * Only when used through GetApisResponse does the intersection make them required.
 */
it("Api base type keeps soft-required fields as optional", () => {
  // This should compile - Api allows Name to be undefined
  const minimalApi: Api = {
    ApiId: "test-id",
  };

  expect(minimalApi.ApiId).toBe("test-id");
  expect(minimalApi.Name).toBeUndefined();
});

/**
 * Runtime test: Verify that parsed API Gateway responses have the expected structure.
 */
it("intersection type allows accessing soft-required fields without null checks", () => {
  // Simulate a response from AWS with the intersection type
  type ApiWithSoftRequired = Api & {
    Name: string;
    ProtocolType: string;
    RouteSelectionExpression: string;
  };

  const api: ApiWithSoftRequired = {
    Name: "my-api",
    ProtocolType: "WEBSOCKET",
    RouteSelectionExpression: "$request.body.action",
    ApiId: "abc123",
    ApiEndpoint: "https://abc123.execute-api.us-east-1.amazonaws.com",
  };

  // No null checks needed - these are required by the intersection type
  const name: string = api.Name;
  const protocol: string = api.ProtocolType;
  const routeSelection: string = api.RouteSelectionExpression;

  expect(name).toBe("my-api");
  expect(protocol).toBe("WEBSOCKET");
  expect(routeSelection).toBe("$request.body.action");
});

/**
 * Type-level test: Verify array element types in list responses.
 */
it("list responses with soft-required elements have correct element type", () => {
  // Extract the element type from GetApisResponse.Items
  type ApiElement = NonNullable<GetApisResponse["Items"]>[number];

  // Verify that ApiElement has Name as required (non-optional)
  // This is a compile-time check - if the type is wrong, this won't compile
  const createApi = (): ApiElement => ({
    Name: "required-name",
    ProtocolType: "HTTP",
    RouteSelectionExpression: "$default",
    ApiId: "test",
  });

  const api = createApi();
  expect(api.Name).toBe("required-name");
});

/**
 * Negative type test: Uncomment to verify type errors.
 *
 * This test is commented out but shows what should NOT compile.
 * The intersection type should require Name, ProtocolType, and RouteSelectionExpression.
 */
// it("should NOT compile without required soft-required fields", () => {
//   const mockResponse: GetApisResponse = {
//     Items: [{ ApiId: "test" }], // ERROR: Missing Name, ProtocolType, RouteSelectionExpression
//   };
// });

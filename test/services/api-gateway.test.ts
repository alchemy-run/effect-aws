import { describe, expect } from "@effect/vitest";
import { Effect } from "effect";
import {
  createApiKey,
  createDeployment,
  createResource,
  createRestApi,
  createStage,
  deleteApiKey,
  deleteDeployment,
  deleteMethod,
  deleteResource,
  deleteRestApi,
  deleteStage,
  getApiKey,
  getApiKeys,
  getDeployment,
  getDeployments,
  getResource,
  getResources,
  getRestApi,
  getRestApis,
  getStage,
  getStages,
  NotFoundException,
  putIntegration,
  putIntegrationResponse,
  putMethod,
  putMethodResponse,
} from "../../src/services/api-gateway.ts";
import { afterAll, beforeAll, test } from "../test.ts";

// ============================================================================
// Pagination Helpers
// ============================================================================

// Find a REST API by ID, paginating through all pages
const findRestApiById = (id: string) =>
  Effect.gen(function* () {
    let position: string | undefined;
    do {
      const response = yield* getRestApis({ position });
      const found = response.items?.find((a) => a.id === id);
      if (found) return found;
      position = response.position;
    } while (position);
    return yield* Effect.fail(new NotFoundException());
  });

// Find and delete any existing REST API with the given name
// API Gateway names are NOT unique, so we need to clean up duplicates
const deleteExistingApiByName = (name: string) =>
  Effect.gen(function* () {
    // First collect all matching APIs (pagination completes before deletions)
    const toDelete: string[] = [];
    let position: string | undefined;

    do {
      const response = yield* getRestApis({ position });
      for (const api of response.items ?? []) {
        if (api.name === name && api.id) {
          toDelete.push(api.id);
        }
      }
      position = response.position;
    } while (position);

    // Then delete them
    for (const id of toDelete) {
      yield* deleteRestApi({ restApiId: id }).pipe(Effect.ignore);
    }
  });

// Shared REST API for all tests
let sharedRestApiId: string;
let rootResourceId: string;

beforeAll(
  Effect.gen(function* () {
    // API Gateway names aren't unique - delete any existing API with the same name
    // to prevent accumulation from failed test runs
    yield* deleteExistingApiByName("itty-apigw-shared");

    const api = yield* createRestApi({ name: "itty-apigw-shared" });
    sharedRestApiId = api.id!;

    // Get root resource
    const resources = yield* getResources({ restApiId: sharedRestApiId });
    const rootResource = resources.items?.find((r) => r.path === "/");
    rootResourceId = rootResource!.id!;
  }),
);

afterAll(deleteRestApi({ restApiId: sharedRestApiId! }).pipe(Effect.ignore));

// ============================================================================
// REST API Lifecycle Tests
// ============================================================================

// API Gateway has terrible rate limiting issues, so we need to run tests sequentially
describe.sequential("API Gateway", () => {
  test(
    "get and list REST API",
    Effect.gen(function* () {
      // Get REST API
      const api = yield* getRestApi({ restApiId: sharedRestApiId });
      expect(api.id).toBeDefined();
      expect(api.name).toEqual("itty-apigw-shared");

      // List REST APIs (with pagination)
      const foundApi = yield* findRestApiById(sharedRestApiId);
      expect(foundApi).toBeDefined();
      expect(foundApi.id).toEqual(sharedRestApiId);
    }),
  );

  // ============================================================================
  // Resource Management Tests
  // ============================================================================

  test(
    "create and manage resources",
    Effect.gen(function* () {
      // Create child resource
      const childResource = yield* createResource({
        restApiId: sharedRestApiId,
        parentId: rootResourceId,
        pathPart: "users",
      });

      expect(childResource.id).toBeDefined();
      expect(childResource.pathPart).toEqual("users");
      expect(childResource.path).toEqual("/users");

      return yield* Effect.gen(function* () {
        // Get the resource
        const fetchedResource = yield* getResource({
          restApiId: sharedRestApiId,
          resourceId: childResource.id!,
        });
        expect(fetchedResource.pathPart).toEqual("users");

        // Create nested resource
        const nestedResource = yield* createResource({
          restApiId: sharedRestApiId,
          parentId: childResource.id!,
          pathPart: "{userId}",
        });

        expect(nestedResource.path).toEqual("/users/{userId}");

        // List all resources
        const allResources = yield* getResources({
          restApiId: sharedRestApiId,
        });
        expect(allResources.items).toBeDefined();
        expect(allResources.items!.length >= 3).toBe(true);

        // Clean up nested resource first (must delete children before parent)
        yield* deleteResource({
          restApiId: sharedRestApiId,
          resourceId: nestedResource.id!,
        }).pipe(Effect.ignore);
      }).pipe(
        Effect.ensuring(
          deleteResource({
            restApiId: sharedRestApiId,
            resourceId: childResource.id!,
          }).pipe(Effect.ignore),
        ),
      );
    }),
  );

  // ============================================================================
  // Method Tests
  // ============================================================================

  test(
    "create methods on resources",
    Effect.gen(function* () {
      // Create a dedicated resource for method tests
      const methodResource = yield* createResource({
        restApiId: sharedRestApiId,
        parentId: rootResourceId,
        pathPart: "method-test",
      });
      const resourceId = methodResource.id!;

      return yield* Effect.gen(function* () {
        // Create GET method
        const method = yield* putMethod({
          restApiId: sharedRestApiId,
          resourceId,
          httpMethod: "GET",
          authorizationType: "NONE",
        });

        expect(method.httpMethod).toEqual("GET");
        expect(method.authorizationType).toEqual("NONE");

        // Create POST method
        const postMethod = yield* putMethod({
          restApiId: sharedRestApiId,
          resourceId,
          httpMethod: "POST",
          authorizationType: "NONE",
        });

        expect(postMethod.httpMethod).toEqual("POST");

        // Clean up methods
        yield* deleteMethod({
          restApiId: sharedRestApiId,
          resourceId,
          httpMethod: "GET",
        }).pipe(Effect.ignore);
        yield* deleteMethod({
          restApiId: sharedRestApiId,
          resourceId,
          httpMethod: "POST",
        }).pipe(Effect.ignore);
      }).pipe(
        Effect.ensuring(
          deleteResource({
            restApiId: sharedRestApiId,
            resourceId: methodResource.id!,
          }).pipe(Effect.ignore),
        ),
      );
    }),
  );

  // ============================================================================
  // Deployment and Stage Tests
  // ============================================================================

  test(
    "create methods with integrations, deploy, and manage stages",
    Effect.gen(function* () {
      // Create a resource for this test
      const testResource = yield* createResource({
        restApiId: sharedRestApiId,
        parentId: rootResourceId,
        pathPart: "deploy-test",
      });
      const resourceId = testResource.id!;

      return yield* Effect.gen(function* () {
        // Create GET method
        yield* putMethod({
          restApiId: sharedRestApiId,
          resourceId,
          httpMethod: "GET",
          authorizationType: "NONE",
        });

        // Add MOCK integration (required for deployment)
        yield* putIntegration({
          restApiId: sharedRestApiId,
          resourceId,
          httpMethod: "GET",
          type: "MOCK",
          requestTemplates: { "application/json": '{"statusCode": 200}' },
        });

        // Add method response
        yield* putMethodResponse({
          restApiId: sharedRestApiId,
          resourceId,
          httpMethod: "GET",
          statusCode: "200",
        });

        // Add integration response
        yield* putIntegrationResponse({
          restApiId: sharedRestApiId,
          resourceId,
          httpMethod: "GET",
          statusCode: "200",
          responseTemplates: { "application/json": '{"message": "Hello!"}' },
        });

        // Create deployment
        const deployment = yield* createDeployment({
          restApiId: sharedRestApiId,
          description: "Test deployment",
        });

        expect(deployment.id).toBeDefined();

        // Get deployment
        const fetchedDeployment = yield* getDeployment({
          restApiId: sharedRestApiId,
          deploymentId: deployment.id!,
        });

        expect(fetchedDeployment.id).toEqual(deployment.id);

        // List deployments
        const deployments = yield* getDeployments({
          restApiId: sharedRestApiId,
        });
        const foundDeployment = deployments.items?.find(
          (d) => d.id === deployment.id,
        );
        expect(foundDeployment).toBeDefined();

        // Create stage
        const stage = yield* createStage({
          restApiId: sharedRestApiId,
          stageName: "dev",
          deploymentId: deployment.id!,
          description: "Development stage",
        });

        expect(stage.stageName).toEqual("dev");

        return yield* Effect.gen(function* () {
          // Get stage
          const fetchedStage = yield* getStage({
            restApiId: sharedRestApiId,
            stageName: "dev",
          });

          expect(fetchedStage.stageName).toEqual("dev");

          // List stages
          const stages = yield* getStages({ restApiId: sharedRestApiId });
          const foundStage = stages.item?.find((s) => s.stageName === "dev");
          expect(foundStage).toBeDefined();
        }).pipe(
          // Clean up stage and deployment
          Effect.ensuring(
            Effect.gen(function* () {
              yield* deleteStage({
                restApiId: sharedRestApiId,
                stageName: "dev",
              }).pipe(Effect.ignore);
              yield* deleteDeployment({
                restApiId: sharedRestApiId,
                deploymentId: deployment.id!,
              }).pipe(Effect.ignore);
            }),
          ),
        );
      }).pipe(
        Effect.ensuring(
          deleteResource({
            restApiId: sharedRestApiId,
            resourceId: testResource.id!,
          }).pipe(Effect.ignore),
        ),
      );
    }),
  );

  // ============================================================================
  // API Key Tests
  // ============================================================================

  test(
    "create, get, list, and delete API key",
    Effect.gen(function* () {
      // Create API key
      const apiKey = yield* createApiKey({
        name: "itty-apigw-apikey",
        description: "Test API key",
        enabled: true,
      });

      expect(apiKey.id).toBeDefined();

      return yield* Effect.gen(function* () {
        // Get API key
        const fetchedKey = yield* getApiKey({ apiKey: apiKey.id! });
        expect(fetchedKey.name).toEqual("itty-apigw-apikey");
        expect(fetchedKey.enabled).toBe(true);

        // List API keys
        const apiKeys = yield* getApiKeys({});
        const foundKey = apiKeys.items?.find((k) => k.id === apiKey.id);
        expect(foundKey).toBeDefined();
      }).pipe(
        Effect.ensuring(
          deleteApiKey({ apiKey: apiKey.id! }).pipe(Effect.ignore),
        ),
      );
    }),
  );
});

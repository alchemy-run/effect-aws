import { expect } from "@effect/vitest";
import { Effect } from "effect";
import {
  createApiKey,
  createDeployment,
  createResource,
  createRestApi,
  createStage,
  deleteApiKey,
  deleteDeployment,
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
  putIntegration,
  putIntegrationResponse,
  putMethod,
  putMethodResponse,
} from "../../src/services/api-gateway.ts";
import { test } from "../test.ts";

// Helper to ensure cleanup happens even on failure
const withRestApi = <A, E, R>(
  apiName: string,
  testFn: (restApiId: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    const api = yield* createRestApi({ name: apiName });
    const restApiId = api.id!;
    return yield* testFn(restApiId).pipe(
      Effect.ensuring(deleteRestApi({ restApiId }).pipe(Effect.ignore)),
    );
  });

// ============================================================================
// REST API Lifecycle Tests
// ============================================================================

test(
  "create REST API, get, list, and delete",
  withRestApi("itty-apigw-lifecycle", (restApiId) =>
    Effect.gen(function* () {
      // Get REST API
      const api = yield* getRestApi({ restApiId });
      expect(api.id).toBeDefined();
      expect(api.name).toEqual("itty-apigw-lifecycle");

      // List REST APIs
      const apis = yield* getRestApis({});
      const foundApi = apis.items?.find((a) => a.id === restApiId);
      expect(foundApi).toBeDefined();
    }),
  ),
);

// ============================================================================
// Resource Management Tests
// ============================================================================

test(
  "create and manage resources",
  withRestApi("itty-apigw-resources", (restApiId) =>
    Effect.gen(function* () {
      // Get root resource
      const resources = yield* getResources({ restApiId });
      const rootResource = resources.items?.find((r) => r.path === "/");
      expect(rootResource).toBeDefined();

      // Create child resource
      const childResource = yield* createResource({
        restApiId,
        parentId: rootResource!.id!,
        pathPart: "users",
      });

      expect(childResource.id).toBeDefined();
      expect(childResource.pathPart).toEqual("users");
      expect(childResource.path).toEqual("/users");

      // Get the resource
      const fetchedResource = yield* getResource({
        restApiId,
        resourceId: childResource.id!,
      });
      expect(fetchedResource.pathPart).toEqual("users");

      // Create nested resource
      const nestedResource = yield* createResource({
        restApiId,
        parentId: childResource.id!,
        pathPart: "{userId}",
      });

      expect(nestedResource.path).toEqual("/users/{userId}");

      // List all resources
      const allResources = yield* getResources({ restApiId });
      expect(allResources.items).toBeDefined();
      expect(allResources.items!.length >= 3).toBe(true);
    }),
  ),
);

// ============================================================================
// Method Tests
// ============================================================================

test(
  "create methods on resources",
  withRestApi("itty-apigw-methods", (restApiId) =>
    Effect.gen(function* () {
      // Get root resource
      const resources = yield* getResources({ restApiId });
      const rootResource = resources.items?.find((r) => r.path === "/");
      const resourceId = rootResource!.id!;

      // Create GET method
      const method = yield* putMethod({
        restApiId,
        resourceId,
        httpMethod: "GET",
        authorizationType: "NONE",
      });

      expect(method.httpMethod).toEqual("GET");
      expect(method.authorizationType).toEqual("NONE");

      // Create POST method
      const postMethod = yield* putMethod({
        restApiId,
        resourceId,
        httpMethod: "POST",
        authorizationType: "NONE",
      });

      expect(postMethod.httpMethod).toEqual("POST");
    }),
  ),
);

// ============================================================================
// Deployment and Stage Tests
// ============================================================================

test(
  "create methods with integrations, deploy, and manage stages",
  withRestApi("itty-apigw-deploy", (restApiId) =>
    Effect.gen(function* () {
      // Get root resource
      const resources = yield* getResources({ restApiId });
      const rootResource = resources.items?.find((r) => r.path === "/");
      const resourceId = rootResource!.id!;

      // Create GET method
      yield* putMethod({
        restApiId,
        resourceId,
        httpMethod: "GET",
        authorizationType: "NONE",
      });

      // Add MOCK integration (required for deployment)
      yield* putIntegration({
        restApiId,
        resourceId,
        httpMethod: "GET",
        type: "MOCK",
        requestTemplates: { "application/json": '{"statusCode": 200}' },
      });

      // Add method response
      yield* putMethodResponse({
        restApiId,
        resourceId,
        httpMethod: "GET",
        statusCode: "200",
      });

      // Add integration response
      yield* putIntegrationResponse({
        restApiId,
        resourceId,
        httpMethod: "GET",
        statusCode: "200",
        responseTemplates: { "application/json": '{"message": "Hello!"}' },
      });

      // Create deployment
      const deployment = yield* createDeployment({
        restApiId,
        description: "Test deployment",
      });

      expect(deployment.id).toBeDefined();

      // Get deployment
      const fetchedDeployment = yield* getDeployment({
        restApiId,
        deploymentId: deployment.id!,
      });

      expect(fetchedDeployment.id).toEqual(deployment.id);

      // List deployments
      const deployments = yield* getDeployments({ restApiId });
      const foundDeployment = deployments.items?.find(
        (d) => d.id === deployment.id,
      );
      expect(foundDeployment).toBeDefined();

      // Create stage
      const stage = yield* createStage({
        restApiId,
        stageName: "dev",
        deploymentId: deployment.id!,
        description: "Development stage",
      });

      expect(stage.stageName).toEqual("dev");

      return yield* Effect.gen(function* () {
        // Get stage
        const fetchedStage = yield* getStage({
          restApiId,
          stageName: "dev",
        });

        expect(fetchedStage.stageName).toEqual("dev");

        // List stages
        const stages = yield* getStages({ restApiId });
        const foundStage = stages.item?.find((s) => s.stageName === "dev");
        expect(foundStage).toBeDefined();
      }).pipe(
        // Clean up stage and deployment
        Effect.ensuring(
          Effect.gen(function* () {
            yield* deleteStage({ restApiId, stageName: "dev" }).pipe(
              Effect.ignore,
            );
            yield* deleteDeployment({
              restApiId,
              deploymentId: deployment.id!,
            }).pipe(Effect.ignore);
          }),
        ),
      );
    }),
  ),
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
      Effect.ensuring(deleteApiKey({ apiKey: apiKey.id! }).pipe(Effect.ignore)),
    );
  }),
);

// ============================================================================
// Full API Lifecycle Test
// ============================================================================

test(
  "full API lifecycle: create API with resources and methods",
  withRestApi("itty-apigw-full-lifecycle", (restApiId) =>
    Effect.gen(function* () {
      // Get root resource
      const resources = yield* getResources({ restApiId });
      const rootResource = resources.items?.find((r) => r.path === "/");
      const rootResourceId = rootResource!.id!;

      // Create /hello resource
      const helloResource = yield* createResource({
        restApiId,
        parentId: rootResourceId,
        pathPart: "hello",
      });

      // Add GET method to /hello
      yield* putMethod({
        restApiId,
        resourceId: helloResource.id!,
        httpMethod: "GET",
        authorizationType: "NONE",
      });

      // Create /hello/{name} resource
      const nameResource = yield* createResource({
        restApiId,
        parentId: helloResource.id!,
        pathPart: "{name}",
      });

      // Add GET method to /hello/{name}
      yield* putMethod({
        restApiId,
        resourceId: nameResource.id!,
        httpMethod: "GET",
        authorizationType: "NONE",
      });

      // Verify all resources are set up correctly
      const allResources = yield* getResources({ restApiId });
      expect(allResources.items).toBeDefined();
      expect(allResources.items!.length >= 3).toBe(true);

      const helloPath = allResources.items?.find((r) => r.path === "/hello");
      expect(helloPath).toBeDefined();

      const namePath = allResources.items?.find(
        (r) => r.path === "/hello/{name}",
      );
      expect(namePath).toBeDefined();
    }),
  ),
);

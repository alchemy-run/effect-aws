import { describe, expect } from "@effect/vitest";
import { Effect } from "effect";
import {
  createApi,
  createDeployment,
  createIntegration,
  createRoute,
  createStage,
  deleteApi,
  deleteDeployment,
  deleteRoute,
  deleteStage,
  getApi,
  getApis,
  getDeployment,
  getDeployments,
  getIntegration,
  getIntegrations,
  getRoute,
  getRoutes,
  getStage,
  getStages,
  getTags,
  tagResource,
  untagResource,
} from "../../src/services/apigatewayv2.ts";
import { test } from "../test.ts";

// ============================================================================
// Cleanup Helpers
// ============================================================================

// Find and delete any existing API with the given name
// API Gateway v2 names are NOT unique, so we need to clean up duplicates
const deleteExistingApiByName = (name: string) =>
  Effect.gen(function* () {
    // First collect all matching APIs (pagination completes before deletions)
    const toDelete: string[] = [];
    let nextToken: string | undefined;

    do {
      const response = yield* getApis({ NextToken: nextToken });
      for (const api of response.Items ?? []) {
        if (api.Name === name && api.ApiId) {
          toDelete.push(api.ApiId);
        }
      }
      nextToken = response.NextToken;
    } while (nextToken);

    // Then delete them
    for (const id of toDelete) {
      yield* deleteApi({ ApiId: id }).pipe(Effect.ignore);
    }
  });

// Helper to ensure cleanup happens even on failure
const withApi = <A, E, R>(
  apiName: string,
  protocolType: "HTTP" | "WEBSOCKET",
  testFn: (apiId: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any existing API with the same name from failed test runs
    yield* deleteExistingApiByName(apiName);

    const api = yield* createApi({
      Name: apiName,
      ProtocolType: protocolType,
      // WebSocket APIs require RouteSelectionExpression
      ...(protocolType === "WEBSOCKET"
        ? { RouteSelectionExpression: "$request.body.action" }
        : {}),
    });
    const apiId = api.ApiId!;
    return yield* testFn(apiId).pipe(
      Effect.ensuring(deleteApi({ ApiId: apiId }).pipe(Effect.ignore)),
    );
  });

// ============================================================================
// API Lifecycle Tests
// ============================================================================

// API Gateway v2 has terrible rate limiting issues, so we need to run tests sequentially
describe.sequential("API Gateway v2", () => {
  test(
    "create HTTP API, get, list, and delete",
    withApi("itty-apigwv2-http", "HTTP", (apiId) =>
      Effect.gen(function* () {
        // Get API
        const api = yield* getApi({ ApiId: apiId });
        expect(api.ApiId).toBeDefined();
        expect(api.Name).toEqual("itty-apigwv2-http");
        expect(api.ProtocolType).toEqual("HTTP");

        // List APIs
        const apis = yield* getApis({});
        const foundApi = apis.Items?.find((a) => a.ApiId === apiId);
        expect(foundApi).toBeDefined();
      }),
    ),
  );

  test(
    "create WebSocket API",
    withApi("itty-apigwv2-ws", "WEBSOCKET", (apiId) =>
      Effect.gen(function* () {
        // Get API
        const api = yield* getApi({ ApiId: apiId });
        expect(api.ApiId).toBeDefined();
        expect(api.Name).toEqual("itty-apigwv2-ws");
        expect(api.ProtocolType).toEqual("WEBSOCKET");
      }),
    ),
  );

  // ============================================================================
  // Integration Tests
  // ============================================================================

  test(
    "create and manage integrations",
    withApi("itty-apigwv2-integrations", "HTTP", (apiId) =>
      Effect.gen(function* () {
        // Create HTTP_PROXY integration (HTTP APIs only support proxy integrations)
        const integration = yield* createIntegration({
          ApiId: apiId,
          IntegrationType: "HTTP_PROXY",
          IntegrationMethod: "GET",
          IntegrationUri: "https://httpbin.org/get",
          PayloadFormatVersion: "1.0",
          Description: "Test HTTP proxy integration",
        });

        expect(integration.IntegrationId).toBeDefined();
        expect(integration.IntegrationType).toEqual("HTTP_PROXY");

        // Get integration
        const fetchedIntegration = yield* getIntegration({
          ApiId: apiId,
          IntegrationId: integration.IntegrationId!,
        });
        expect(fetchedIntegration.IntegrationType).toEqual("HTTP_PROXY");

        // List integrations
        const integrations = yield* getIntegrations({ ApiId: apiId });
        const foundIntegration = integrations.Items?.find(
          (i) => i.IntegrationId === integration.IntegrationId,
        );
        expect(foundIntegration).toBeDefined();
      }),
    ),
  );

  // ============================================================================
  // Route Tests
  // ============================================================================

  test(
    "create and manage routes",
    withApi("itty-apigwv2-routes", "HTTP", (apiId) =>
      Effect.gen(function* () {
        // Create route
        const route = yield* createRoute({
          ApiId: apiId,
          RouteKey: "GET /hello",
        });

        expect(route.RouteId).toBeDefined();
        expect(route.RouteKey).toEqual("GET /hello");

        return yield* Effect.gen(function* () {
          // Get route
          const fetchedRoute = yield* getRoute({
            ApiId: apiId,
            RouteId: route.RouteId!,
          });
          expect(fetchedRoute.RouteKey).toEqual("GET /hello");

          // List routes
          const routes = yield* getRoutes({ ApiId: apiId });
          const foundRoute = routes.Items?.find(
            (r) => r.RouteId === route.RouteId,
          );
          expect(foundRoute).toBeDefined();

          // Create another route
          const postRoute = yield* createRoute({
            ApiId: apiId,
            RouteKey: "POST /hello",
          });
          expect(postRoute.RouteKey).toEqual("POST /hello");

          // Verify both routes exist
          const allRoutes = yield* getRoutes({ ApiId: apiId });
          expect(allRoutes.Items?.length).toBeGreaterThanOrEqual(2);

          // Clean up the second route
          yield* deleteRoute({
            ApiId: apiId,
            RouteId: postRoute.RouteId!,
          });
        }).pipe(
          Effect.ensuring(
            deleteRoute({ ApiId: apiId, RouteId: route.RouteId! }).pipe(
              Effect.ignore,
            ),
          ),
        );
      }),
    ),
  );

  // ============================================================================
  // Route with Integration Tests
  // ============================================================================

  test(
    "create route with integration target",
    withApi("itty-apigwv2-route-integration", "HTTP", (apiId) =>
      Effect.gen(function* () {
        // Create HTTP_PROXY integration (HTTP APIs only support proxy integrations)
        const integration = yield* createIntegration({
          ApiId: apiId,
          IntegrationType: "HTTP_PROXY",
          IntegrationMethod: "GET",
          IntegrationUri: "https://httpbin.org/get",
          PayloadFormatVersion: "1.0",
        });

        // Create route with integration target
        const route = yield* createRoute({
          ApiId: apiId,
          RouteKey: "GET /api",
          Target: `integrations/${integration.IntegrationId}`,
        });

        expect(route.RouteId).toBeDefined();
        expect(route.Target).toEqual(
          `integrations/${integration.IntegrationId}`,
        );

        // Clean up
        yield* deleteRoute({ ApiId: apiId, RouteId: route.RouteId! }).pipe(
          Effect.ignore,
        );
      }),
    ),
  );

  // ============================================================================
  // Deployment and Stage Tests
  // ============================================================================

  test(
    "create deployment and manage stages",
    withApi("itty-apigwv2-deploy", "HTTP", (apiId) =>
      Effect.gen(function* () {
        // Create integration and route first (required for deployment)
        const integration = yield* createIntegration({
          ApiId: apiId,
          IntegrationType: "HTTP_PROXY",
          IntegrationMethod: "GET",
          IntegrationUri: "https://httpbin.org/get",
          PayloadFormatVersion: "1.0",
        });

        const route = yield* createRoute({
          ApiId: apiId,
          RouteKey: "GET /test",
          Target: `integrations/${integration.IntegrationId}`,
        });

        // Create deployment
        const deployment = yield* createDeployment({
          ApiId: apiId,
          Description: "Test deployment",
        });

        expect(deployment.DeploymentId).toBeDefined();

        // Get deployment
        const fetchedDeployment = yield* getDeployment({
          ApiId: apiId,
          DeploymentId: deployment.DeploymentId!,
        });
        expect(fetchedDeployment.DeploymentId).toEqual(deployment.DeploymentId);

        // List deployments
        const deployments = yield* getDeployments({ ApiId: apiId });
        const foundDeployment = deployments.Items?.find(
          (d) => d.DeploymentId === deployment.DeploymentId,
        );
        expect(foundDeployment).toBeDefined();

        // Create stage
        const stage = yield* createStage({
          ApiId: apiId,
          StageName: "dev",
          DeploymentId: deployment.DeploymentId,
          Description: "Development stage",
        });

        expect(stage.StageName).toEqual("dev");

        return yield* Effect.gen(function* () {
          // Get stage
          const fetchedStage = yield* getStage({
            ApiId: apiId,
            StageName: "dev",
          });
          expect(fetchedStage.StageName).toEqual("dev");

          // List stages
          const stages = yield* getStages({ ApiId: apiId });
          const foundStage = stages.Items?.find((s) => s.StageName === "dev");
          expect(foundStage).toBeDefined();
        }).pipe(
          Effect.ensuring(
            Effect.gen(function* () {
              yield* deleteStage({ ApiId: apiId, StageName: "dev" }).pipe(
                Effect.ignore,
              );
              yield* deleteDeployment({
                ApiId: apiId,
                DeploymentId: deployment.DeploymentId!,
              }).pipe(Effect.ignore);
              yield* deleteRoute({
                ApiId: apiId,
                RouteId: route.RouteId!,
              }).pipe(Effect.ignore);
            }),
          ),
        );
      }),
    ),
  );

  // ============================================================================
  // Auto-Deploy Stage Tests
  // ============================================================================

  test(
    "create stage with auto-deploy enabled",
    withApi("itty-apigwv2-autodeploy", "HTTP", (apiId) =>
      Effect.gen(function* () {
        // Create stage with auto-deploy
        const stage = yield* createStage({
          ApiId: apiId,
          StageName: "prod",
          AutoDeploy: true,
          Description: "Production stage with auto-deploy",
        });

        expect(stage.StageName).toEqual("prod");
        expect(stage.AutoDeploy).toBe(true);

        return yield* Effect.gen(function* () {
          // Verify auto-deploy setting
          const fetchedStage = yield* getStage({
            ApiId: apiId,
            StageName: "prod",
          });
          expect(fetchedStage.AutoDeploy).toBe(true);
        }).pipe(
          Effect.ensuring(
            deleteStage({ ApiId: apiId, StageName: "prod" }).pipe(
              Effect.ignore,
            ),
          ),
        );
      }),
    ),
  );

  // ============================================================================
  // Tagging Tests
  // ============================================================================

  test(
    "tag and untag API resources",
    withApi("itty-apigwv2-tags", "HTTP", (apiId) =>
      Effect.gen(function* () {
        // Get the API to get its ARN
        const _api = yield* getApi({ ApiId: apiId });

        // Tag the resource - construct the ARN manually for API Gateway V2
        // Format: arn:aws:apigateway:{region}::/apis/{api-id}
        const resourceArn = `arn:aws:apigateway:us-east-1::/apis/${apiId}`;

        yield* tagResource({
          ResourceArn: resourceArn,
          Tags: {
            Environment: "Test",
            Project: "itty-aws",
          },
        });

        // Get tags
        const tags = yield* getTags({ ResourceArn: resourceArn });
        expect(tags.Tags?.Environment).toEqual("Test");
        expect(tags.Tags?.Project).toEqual("itty-aws");

        // Untag resource
        yield* untagResource({
          ResourceArn: resourceArn,
          TagKeys: ["Project"],
        });

        // Verify tag was removed
        const updatedTags = yield* getTags({ ResourceArn: resourceArn });
        expect(updatedTags.Tags?.Environment).toEqual("Test");
        expect(updatedTags.Tags?.Project).toBeUndefined();
      }),
    ),
  );

  // ============================================================================
  // Full API Lifecycle Test
  // ============================================================================

  test(
    "full API lifecycle: create API with routes, integrations, and stages",
    withApi("itty-apigwv2-full-lifecycle", "HTTP", (apiId) =>
      Effect.gen(function* () {
        // Create HTTP_PROXY integration (HTTP APIs only support proxy integrations)
        const integration = yield* createIntegration({
          ApiId: apiId,
          IntegrationType: "HTTP_PROXY",
          IntegrationMethod: "ANY",
          IntegrationUri: "https://httpbin.org/anything",
          PayloadFormatVersion: "1.0",
          Description: "Main HTTP proxy integration",
        });

        // Create routes
        const helloRoute = yield* createRoute({
          ApiId: apiId,
          RouteKey: "GET /hello",
          Target: `integrations/${integration.IntegrationId}`,
        });

        const greetRoute = yield* createRoute({
          ApiId: apiId,
          RouteKey: "GET /hello/{name}",
          Target: `integrations/${integration.IntegrationId}`,
        });

        const postRoute = yield* createRoute({
          ApiId: apiId,
          RouteKey: "POST /hello",
          Target: `integrations/${integration.IntegrationId}`,
        });

        // Verify all routes are set up
        const allRoutes = yield* getRoutes({ ApiId: apiId });
        expect(allRoutes.Items).toBeDefined();
        expect(allRoutes.Items!.length).toBeGreaterThanOrEqual(3);

        const helloPath = allRoutes.Items?.find(
          (r) => r.RouteKey === "GET /hello",
        );
        expect(helloPath).toBeDefined();

        const greetPath = allRoutes.Items?.find(
          (r) => r.RouteKey === "GET /hello/{name}",
        );
        expect(greetPath).toBeDefined();

        const postPath = allRoutes.Items?.find(
          (r) => r.RouteKey === "POST /hello",
        );
        expect(postPath).toBeDefined();

        // Create deployment and stage
        const deployment = yield* createDeployment({
          ApiId: apiId,
          Description: "Initial deployment",
        });

        yield* createStage({
          ApiId: apiId,
          StageName: "v1",
          DeploymentId: deployment.DeploymentId,
          Description: "Version 1 stage",
        });

        // Verify stage was created
        const stages = yield* getStages({ ApiId: apiId });
        expect(stages.Items?.find((s) => s.StageName === "v1")).toBeDefined();

        // Clean up
        yield* deleteStage({ ApiId: apiId, StageName: "v1" }).pipe(
          Effect.ignore,
        );
        yield* deleteDeployment({
          ApiId: apiId,
          DeploymentId: deployment.DeploymentId!,
        }).pipe(Effect.ignore);
        yield* deleteRoute({ ApiId: apiId, RouteId: helloRoute.RouteId! }).pipe(
          Effect.ignore,
        );
        yield* deleteRoute({ ApiId: apiId, RouteId: greetRoute.RouteId! }).pipe(
          Effect.ignore,
        );
        yield* deleteRoute({ ApiId: apiId, RouteId: postRoute.RouteId! }).pipe(
          Effect.ignore,
        );
      }),
    ),
  );

  // ============================================================================
  // WebSocket API Tests
  // ============================================================================

  test(
    "WebSocket API with routes",
    withApi("itty-apigwv2-websocket", "WEBSOCKET", (apiId) =>
      Effect.gen(function* () {
        // Create $connect route
        const connectRoute = yield* createRoute({
          ApiId: apiId,
          RouteKey: "$connect",
        });
        expect(connectRoute.RouteKey).toEqual("$connect");

        // Create $disconnect route
        const disconnectRoute = yield* createRoute({
          ApiId: apiId,
          RouteKey: "$disconnect",
        });
        expect(disconnectRoute.RouteKey).toEqual("$disconnect");

        // Create $default route
        const defaultRoute = yield* createRoute({
          ApiId: apiId,
          RouteKey: "$default",
        });
        expect(defaultRoute.RouteKey).toEqual("$default");

        // Create custom action route
        const sendMessageRoute = yield* createRoute({
          ApiId: apiId,
          RouteKey: "sendMessage",
        });
        expect(sendMessageRoute.RouteKey).toEqual("sendMessage");

        // Verify all routes
        const allRoutes = yield* getRoutes({ ApiId: apiId });
        expect(allRoutes.Items).toBeDefined();
        expect(allRoutes.Items!.length).toBeGreaterThanOrEqual(4);

        // Clean up
        yield* deleteRoute({
          ApiId: apiId,
          RouteId: connectRoute.RouteId!,
        }).pipe(Effect.ignore);
        yield* deleteRoute({
          ApiId: apiId,
          RouteId: disconnectRoute.RouteId!,
        }).pipe(Effect.ignore);
        yield* deleteRoute({
          ApiId: apiId,
          RouteId: defaultRoute.RouteId!,
        }).pipe(Effect.ignore);
        yield* deleteRoute({
          ApiId: apiId,
          RouteId: sendMessageRoute.RouteId!,
        }).pipe(Effect.ignore);
      }),
    ),
  );
});

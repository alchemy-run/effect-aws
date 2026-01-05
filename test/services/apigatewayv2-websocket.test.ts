import { expect } from "@effect/vitest";
import { Effect } from "effect";
import { describe } from "vitest";
import {
  createApi,
  createDeployment,
  createIntegration,
  createRoute,
  createStage,
  deleteApi,
  deleteStage,
  getApi,
  getApis,
  getIntegration,
  getIntegrations,
  getRoute,
  getRoutes,
  getStage,
  getStages,
} from "../../src/services/apigatewayv2.ts";
import { test } from "../test.ts";

// LocalStack community edition has limited API Gateway v2 support
const isLocalStack = process.env.LOCAL === "true" || process.env.LOCAL === "1";

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
const withWebSocketApi = <A, E, R>(
  apiName: string,
  testFn: (apiId: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any existing API with the same name from failed test runs
    yield* deleteExistingApiByName(apiName);

    const api = yield* createApi({
      Name: apiName,
      ProtocolType: "WEBSOCKET",
      RouteSelectionExpression: "$request.body.action",
    });
    const apiId = api.ApiId!;
    return yield* testFn(apiId).pipe(
      Effect.ensuring(deleteApi({ ApiId: apiId }).pipe(Effect.ignore)),
    );
  });

// Skip tests in LocalStack - API Gateway v2 WebSocket APIs are not fully supported
(isLocalStack ? describe.skip : describe.sequential)(
  "API Gateway v2 WebSocket",
  () => {
    // ============================================================================
    // WebSocket API Lifecycle Tests
    // ============================================================================

    test(
      "create WebSocket API, get, list, and delete",
      withWebSocketApi("itty-ws-lifecycle", (apiId) =>
        Effect.gen(function* () {
          // Get WebSocket API
          const api = yield* getApi({ ApiId: apiId });
          expect(api.ApiId).toBeDefined();
          expect(api.Name).toEqual("itty-ws-lifecycle");
          expect(api.ProtocolType).toEqual("WEBSOCKET");
          expect(api.RouteSelectionExpression).toEqual("$request.body.action");

          // List WebSocket APIs
          const apis = yield* getApis({});
          const foundApi = apis.Items?.find((a) => a.ApiId === apiId);
          expect(foundApi).toBeDefined();
        }),
      ),
    );

    // ============================================================================
    // Route Tests
    // ============================================================================

    test(
      "create and manage WebSocket routes",
      withWebSocketApi("itty-ws-routes", (apiId) =>
        Effect.gen(function* () {
          // Create $connect route
          const connectRoute = yield* createRoute({
            ApiId: apiId,
            RouteKey: "$connect",
          });
          expect(connectRoute.RouteId).toBeDefined();
          expect(connectRoute.RouteKey).toEqual("$connect");

          // Create $disconnect route
          const disconnectRoute = yield* createRoute({
            ApiId: apiId,
            RouteKey: "$disconnect",
          });
          expect(disconnectRoute.RouteId).toBeDefined();
          expect(disconnectRoute.RouteKey).toEqual("$disconnect");

          // Create $default route
          const defaultRoute = yield* createRoute({
            ApiId: apiId,
            RouteKey: "$default",
          });
          expect(defaultRoute.RouteId).toBeDefined();
          expect(defaultRoute.RouteKey).toEqual("$default");

          // Create custom action route
          const customRoute = yield* createRoute({
            ApiId: apiId,
            RouteKey: "sendMessage",
          });
          expect(customRoute.RouteId).toBeDefined();
          expect(customRoute.RouteKey).toEqual("sendMessage");

          // Get a specific route
          const fetchedRoute = yield* getRoute({
            ApiId: apiId,
            RouteId: connectRoute.RouteId!,
          });
          expect(fetchedRoute.RouteKey).toEqual("$connect");

          // List all routes
          const routes = yield* getRoutes({ ApiId: apiId });
          expect(routes.Items).toBeDefined();
          expect(routes.Items!.length >= 4).toBe(true);

          const routeKeys = routes.Items!.map((r) => r.RouteKey);
          expect(routeKeys).toContain("$connect");
          expect(routeKeys).toContain("$disconnect");
          expect(routeKeys).toContain("$default");
          expect(routeKeys).toContain("sendMessage");
        }),
      ),
    );

    // ============================================================================
    // Integration Tests
    // ============================================================================

    test(
      "create and manage WebSocket integrations",
      withWebSocketApi("itty-ws-integrations", (apiId) =>
        Effect.gen(function* () {
          // Create MOCK integration
          const integration = yield* createIntegration({
            ApiId: apiId,
            IntegrationType: "MOCK",
            RequestTemplates: {
              "200": '{"statusCode": 200}',
            },
          });
          expect(integration.IntegrationId).toBeDefined();
          expect(integration.IntegrationType).toEqual("MOCK");

          // Get integration
          const fetchedIntegration = yield* getIntegration({
            ApiId: apiId,
            IntegrationId: integration.IntegrationId!,
          });
          expect(fetchedIntegration.IntegrationType).toEqual("MOCK");

          // List integrations
          const integrations = yield* getIntegrations({ ApiId: apiId });
          expect(integrations.Items).toBeDefined();
          expect(integrations.Items!.length >= 1).toBe(true);
        }),
      ),
    );

    // ============================================================================
    // Stage and Deployment Tests
    // ============================================================================

    test(
      "create deployment and stage for WebSocket API",
      withWebSocketApi("itty-ws-deploy", (apiId) =>
        Effect.gen(function* () {
          // Create a route first (required for deployment)
          yield* createRoute({
            ApiId: apiId,
            RouteKey: "$connect",
          });

          // Create integration
          const integration = yield* createIntegration({
            ApiId: apiId,
            IntegrationType: "MOCK",
            RequestTemplates: {
              "200": '{"statusCode": 200}',
            },
          });

          // Update route with integration target
          yield* createRoute({
            ApiId: apiId,
            RouteKey: "$default",
            Target: `integrations/${integration.IntegrationId}`,
          });

          // Create deployment
          const deployment = yield* createDeployment({
            ApiId: apiId,
            Description: "Test WebSocket deployment",
          });
          expect(deployment.DeploymentId).toBeDefined();

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
            expect(fetchedStage.DeploymentId).toEqual(deployment.DeploymentId);

            // List stages
            const stages = yield* getStages({ ApiId: apiId });
            expect(stages.Items).toBeDefined();
            const foundStage = stages.Items!.find((s) => s.StageName === "dev");
            expect(foundStage).toBeDefined();
          }).pipe(
            Effect.ensuring(
              deleteStage({ ApiId: apiId, StageName: "dev" }).pipe(
                Effect.ignore,
              ),
            ),
          );
        }),
      ),
    );

    // ============================================================================
    // Full WebSocket API Lifecycle Test
    // ============================================================================

    test(
      "full WebSocket API lifecycle with routes and integrations",
      withWebSocketApi("itty-ws-full-lifecycle", (apiId) =>
        Effect.gen(function* () {
          // Create MOCK integration for all routes
          const integration = yield* createIntegration({
            ApiId: apiId,
            IntegrationType: "MOCK",
            RequestTemplates: {
              "200": '{"statusCode": 200}',
            },
          });

          const integrationTarget = `integrations/${integration.IntegrationId}`;

          // Create standard WebSocket routes with integration
          const connectRoute = yield* createRoute({
            ApiId: apiId,
            RouteKey: "$connect",
            Target: integrationTarget,
          });
          expect(connectRoute.RouteKey).toEqual("$connect");
          expect(connectRoute.Target).toEqual(integrationTarget);

          const disconnectRoute = yield* createRoute({
            ApiId: apiId,
            RouteKey: "$disconnect",
            Target: integrationTarget,
          });
          expect(disconnectRoute.RouteKey).toEqual("$disconnect");

          const defaultRoute = yield* createRoute({
            ApiId: apiId,
            RouteKey: "$default",
            Target: integrationTarget,
          });
          expect(defaultRoute.RouteKey).toEqual("$default");

          // Create custom action routes
          const sendMessageRoute = yield* createRoute({
            ApiId: apiId,
            RouteKey: "sendMessage",
            Target: integrationTarget,
          });
          expect(sendMessageRoute.RouteKey).toEqual("sendMessage");

          const joinRoomRoute = yield* createRoute({
            ApiId: apiId,
            RouteKey: "joinRoom",
            Target: integrationTarget,
          });
          expect(joinRoomRoute.RouteKey).toEqual("joinRoom");

          // Create deployment
          const deployment = yield* createDeployment({
            ApiId: apiId,
            Description: "Full lifecycle deployment",
          });
          expect(deployment.DeploymentId).toBeDefined();

          // Create production stage
          const prodStage = yield* createStage({
            ApiId: apiId,
            StageName: "prod",
            DeploymentId: deployment.DeploymentId,
            Description: "Production stage",
          });

          return yield* Effect.gen(function* () {
            expect(prodStage.StageName).toEqual("prod");

            // Verify all resources
            const routes = yield* getRoutes({ ApiId: apiId });
            expect(routes.Items!.length).toEqual(5);

            const integrations = yield* getIntegrations({ ApiId: apiId });
            expect(integrations.Items!.length).toEqual(1);

            const stages = yield* getStages({ ApiId: apiId });
            expect(stages.Items!.length).toEqual(1);
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
  },
);

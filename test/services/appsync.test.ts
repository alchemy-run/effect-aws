/**
 * AppSync Service Tests
 *
 * IMPORTANT: These tests require a real AWS account with AppSync support.
 * LocalStack community edition does not properly support AppSync.
 *
 * To run these tests:
 *   bun vitest run ./test/services/appsync.test.ts
 */

import { expect } from "@effect/vitest";
import { Effect, Schedule } from "effect";
import { describe } from "vitest";
import {
  createDataSource,
  createGraphqlApi,
  createResolver,
  createType,
  deleteDataSource,
  deleteGraphqlApi,
  deleteResolver,
  deleteType,
  getDataSource,
  getGraphqlApi,
  getResolver,
  getType,
  listDataSources,
  listGraphqlApis,
  listResolvers,
  listTagsForResource,
  listTypes,
  startSchemaCreation,
  tagResource,
  untagResource,
} from "../../src/services/appsync.ts";
import { test } from "../test.ts";

// Skip all tests in LocalStack - AppSync is not supported in community edition
const isLocalStack = process.env.LOCAL === "true" || process.env.LOCAL === "1";

const retrySchedule = Schedule.intersect(
  Schedule.recurs(10),
  Schedule.spaced("1 second"),
);

// Simple GraphQL schema for testing
const TEST_SCHEMA = `
type Query {
  getItem(id: ID!): Item
  listItems: [Item]
}

type Mutation {
  createItem(input: CreateItemInput!): Item
  deleteItem(id: ID!): Item
}

type Item {
  id: ID!
  name: String!
  description: String
  createdAt: String
}

input CreateItemInput {
  name: String!
  description: String
}
`;

// ============================================================================
// Idempotent Cleanup Helpers
// ============================================================================

// Clean up all resolvers for a type in an API
const cleanupResolversForType = (apiId: string, typeName: string) =>
  Effect.gen(function* () {
    const resolvers = yield* listResolvers({ apiId, typeName }).pipe(
      Effect.orElseSucceed(() => ({ resolvers: [] })),
    );

    for (const resolver of resolvers.resolvers ?? []) {
      if (resolver.fieldName) {
        yield* deleteResolver({
          apiId,
          typeName,
          fieldName: resolver.fieldName,
        }).pipe(Effect.ignore);
      }
    }
  });

// Clean up all data sources for an API
const cleanupDataSources = (apiId: string) =>
  Effect.gen(function* () {
    const dataSources = yield* listDataSources({ apiId }).pipe(
      Effect.orElseSucceed(() => ({ dataSources: [] })),
    );

    for (const ds of dataSources.dataSources ?? []) {
      if (ds.name) {
        yield* deleteDataSource({ apiId, name: ds.name }).pipe(Effect.ignore);
      }
    }
  });

// Clean up all custom types for an API (not built-in types)
const cleanupTypes = (apiId: string) =>
  Effect.gen(function* () {
    const types = yield* listTypes({ apiId, format: "SDL" }).pipe(
      Effect.orElseSucceed(() => ({ types: [] })),
    );

    // Only delete custom types, not built-in ones
    const builtInTypes = new Set([
      "Query",
      "Mutation",
      "Subscription",
      "Item",
      "CreateItemInput",
      "String",
      "Int",
      "Float",
      "Boolean",
      "ID",
      "AWSDate",
      "AWSTime",
      "AWSDateTime",
      "AWSTimestamp",
      "AWSEmail",
      "AWSJSON",
      "AWSURL",
      "AWSPhone",
      "AWSIPAddress",
    ]);

    for (const type of types.types ?? []) {
      if (type.name && !builtInTypes.has(type.name)) {
        yield* deleteType({ apiId, typeName: type.name }).pipe(Effect.ignore);
      }
    }
  });

// Clean up a GraphQL API by ID - remove all dependencies first
const cleanupGraphqlApiById = (apiId: string) =>
  Effect.gen(function* () {
    // First clean up resolvers for Query and Mutation types
    yield* cleanupResolversForType(apiId, "Query");
    yield* cleanupResolversForType(apiId, "Mutation");

    // Clean up data sources
    yield* cleanupDataSources(apiId);

    // Clean up custom types
    yield* cleanupTypes(apiId);

    // Delete the API
    yield* deleteGraphqlApi({ apiId }).pipe(Effect.ignore);
  });

// Clean up a GraphQL API by name - find it first, then delete
const cleanupGraphqlApiByName = (apiName: string) =>
  Effect.gen(function* () {
    const apis = yield* listGraphqlApis({}).pipe(
      Effect.orElseSucceed(() => ({ graphqlApis: [] })),
    );

    for (const api of apis.graphqlApis ?? []) {
      if (api.name === apiName && api.apiId) {
        yield* cleanupGraphqlApiById(api.apiId);
      }
    }
  });

// ============================================================================
// Idempotent Test Helpers
// ============================================================================

// Helper to ensure cleanup happens even on failure - cleans up before AND after
const withGraphqlApi = <A, E, R>(
  apiName: string,
  options: { withSchema?: boolean } = {},
  testFn: (api: { apiId: string; arn: string }) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any leftover from previous runs
    yield* cleanupGraphqlApiByName(apiName);

    // Create the API
    const createResult = yield* createGraphqlApi({
      name: apiName,
      authenticationType: "API_KEY",
      tags: {
        Environment: "test",
        Project: "itty-aws",
      },
    }).pipe(Effect.retry(retrySchedule));

    const apiId = createResult.graphqlApi?.apiId ?? "";
    const arn = createResult.graphqlApi?.arn ?? "";

    // Optionally create schema
    if (options.withSchema) {
      yield* startSchemaCreation({
        apiId,
        definition: new TextEncoder().encode(TEST_SCHEMA),
      }).pipe(Effect.retry(retrySchedule));

      // Wait for schema to be processed
      yield* Effect.sleep("2 seconds");
    }

    return yield* testFn({ apiId, arn }).pipe(
      Effect.ensuring(cleanupGraphqlApiById(apiId)),
    );
  });

// Helper for tests that need an API with a data source
const withDataSource = <A, E, R>(
  apiId: string,
  dataSourceName: string,
  testFn: (dataSourceName: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any leftover data source
    yield* deleteDataSource({ apiId, name: dataSourceName }).pipe(
      Effect.ignore,
    );

    // Create the data source
    yield* createDataSource({
      apiId,
      name: dataSourceName,
      type: "NONE",
      description: "Test NONE data source for itty-aws",
    }).pipe(Effect.retry(retrySchedule));

    return yield* testFn(dataSourceName).pipe(
      Effect.ensuring(
        deleteDataSource({ apiId, name: dataSourceName }).pipe(Effect.ignore),
      ),
    );
  });

// Wrap all tests in describe block that skips in LocalStack
(isLocalStack ? describe.skip : describe)("AppSync", () => {
  // ============================================================================
  // GraphQL API Management Tests
  // ============================================================================

  test(
    "create, get, list, and delete a GraphQL API",
    withGraphqlApi("itty-appsync-lifecycle", {}, ({ apiId }) =>
      Effect.gen(function* () {
        // Get API details
        const result = yield* getGraphqlApi({ apiId });

        expect(result.graphqlApi).toBeDefined();
        expect(result.graphqlApi?.name).toEqual("itty-appsync-lifecycle");
        expect(result.graphqlApi?.authenticationType).toEqual("API_KEY");

        // List APIs and verify our API is included
        const listResult = yield* listGraphqlApis({});

        expect(listResult.graphqlApis).toBeDefined();
        const found = listResult.graphqlApis?.find(
          (api) => api.apiId === apiId,
        );
        expect(found).toBeDefined();
        expect(found?.name).toEqual("itty-appsync-lifecycle");
      }),
    ),
  );

  // ============================================================================
  // Data Source Tests
  // ============================================================================

  test(
    "create, get, list, and delete a NONE data source",
    withGraphqlApi("itty-appsync-datasource", {}, ({ apiId }) =>
      withDataSource(apiId, "itty_aws_test_datasource", (dataSourceName) =>
        Effect.gen(function* () {
          // Get the data source
          const getResult = yield* getDataSource({
            apiId,
            name: dataSourceName,
          });

          expect(getResult.dataSource?.name).toEqual(dataSourceName);
          expect(getResult.dataSource?.type).toEqual("NONE");

          // List data sources
          const listResult = yield* listDataSources({ apiId });

          expect(listResult.dataSources).toBeDefined();
          const found = listResult.dataSources?.find(
            (ds) => ds.name === dataSourceName,
          );
          expect(found).toBeDefined();
        }),
      ),
    ),
  );

  // ============================================================================
  // Type Tests
  // ============================================================================

  test(
    "create, get, list, and delete a type",
    withGraphqlApi("itty-appsync-types", { withSchema: true }, ({ apiId }) =>
      Effect.gen(function* () {
        const typeName = "TestCustomType";
        const typeDefinition = `
        type ${typeName} {
          id: ID!
          value: String!
        }
      `;

        // Create a type
        const createResult = yield* createType({
          apiId,
          definition: typeDefinition,
          format: "SDL",
        }).pipe(Effect.retry(retrySchedule));

        expect(createResult.type).toBeDefined();

        try {
          // Get the type
          const getResult = yield* getType({
            apiId,
            typeName,
            format: "SDL",
          });

          expect(getResult.type?.name).toEqual(typeName);

          // List types
          const listResult = yield* listTypes({
            apiId,
            format: "SDL",
          });

          expect(listResult.types).toBeDefined();
          const found = listResult.types?.find((t) => t.name === typeName);
          expect(found).toBeDefined();
        } finally {
          // Delete the type
          yield* deleteType({
            apiId,
            typeName,
          }).pipe(Effect.ignore);
        }
      }),
    ),
  );

  // ============================================================================
  // Resolver Tests
  // ============================================================================

  test(
    "create, get, list, and delete a resolver",
    withGraphqlApi(
      "itty-appsync-resolvers",
      { withSchema: true },
      ({ apiId }) =>
        withDataSource(apiId, "itty_resolver_test_ds", (dataSourceName) =>
          Effect.gen(function* () {
            const typeName = "Query";
            const fieldName = "getItem";

            // Create a resolver with VTL templates
            const createResult = yield* createResolver({
              apiId,
              typeName,
              fieldName,
              dataSourceName,
              requestMappingTemplate: `{
            "version": "2017-02-28",
            "payload": {
              "id": $util.toJson($ctx.args.id)
            }
          }`,
              responseMappingTemplate: "$util.toJson($ctx.result)",
            }).pipe(Effect.retry(retrySchedule));

            expect(createResult.resolver).toBeDefined();
            expect(createResult.resolver?.typeName).toEqual(typeName);
            expect(createResult.resolver?.fieldName).toEqual(fieldName);

            try {
              // Get the resolver
              const getResult = yield* getResolver({
                apiId,
                typeName,
                fieldName,
              });

              expect(getResult.resolver?.typeName).toEqual(typeName);
              expect(getResult.resolver?.fieldName).toEqual(fieldName);
              expect(getResult.resolver?.dataSourceName).toEqual(
                dataSourceName,
              );

              // List resolvers
              const listResult = yield* listResolvers({
                apiId,
                typeName,
              });

              expect(listResult.resolvers).toBeDefined();
              const found = listResult.resolvers?.find(
                (r) => r.fieldName === fieldName,
              );
              expect(found).toBeDefined();
            } finally {
              // Delete the resolver
              yield* deleteResolver({
                apiId,
                typeName,
                fieldName,
              }).pipe(Effect.ignore);
            }

            // Verify resolver is deleted
            const resolverExists = yield* getResolver({
              apiId,
              typeName,
              fieldName,
            }).pipe(
              Effect.map(() => true),
              Effect.catchAll(() => Effect.succeed(false)),
            );

            expect(resolverExists).toEqual(false);
          }),
        ),
    ),
  );

  // ============================================================================
  // Tagging Tests
  // ============================================================================

  test(
    "tag and untag GraphQL API",
    withGraphqlApi("itty-appsync-tagging", {}, ({ arn }) =>
      Effect.gen(function* () {
        // List current tags (should have the initial tags from creation)
        const initialTags = yield* listTagsForResource({
          resourceArn: arn,
        });

        expect(initialTags.tags).toBeDefined();
        expect(initialTags.tags?.["Environment"]).toEqual("test");
        expect(initialTags.tags?.["Project"]).toEqual("itty-aws");

        // Add new tags
        yield* tagResource({
          resourceArn: arn,
          tags: {
            Team: "Platform",
            Version: "1.0",
          },
        });

        // Verify new tags
        const updatedTags = yield* listTagsForResource({
          resourceArn: arn,
        });

        expect(updatedTags.tags?.["Team"]).toEqual("Platform");
        expect(updatedTags.tags?.["Version"]).toEqual("1.0");
        expect(updatedTags.tags?.["Environment"]).toEqual("test");

        // Remove a tag
        yield* untagResource({
          resourceArn: arn,
          tagKeys: ["Version"],
        });

        // Verify tag was removed
        const finalTags = yield* listTagsForResource({
          resourceArn: arn,
        });

        expect(finalTags.tags?.["Version"]).toBeUndefined();
        expect(finalTags.tags?.["Team"]).toEqual("Platform");

        // Clean up added tag
        yield* untagResource({
          resourceArn: arn,
          tagKeys: ["Team"],
        }).pipe(Effect.ignore);
      }),
    ),
  );

  // ============================================================================
  // Schema Tests
  // ============================================================================

  test(
    "create schema for GraphQL API",
    withGraphqlApi("itty-appsync-schema", {}, ({ apiId }) =>
      Effect.gen(function* () {
        // Start schema creation
        const result = yield* startSchemaCreation({
          apiId,
          definition: new TextEncoder().encode(TEST_SCHEMA),
        }).pipe(Effect.retry(retrySchedule));

        expect(result.status).toBeDefined();

        // Wait for schema to be processed
        yield* Effect.sleep("2 seconds");

        // Verify types were created by listing them
        const types = yield* listTypes({
          apiId,
          format: "SDL",
        });

        expect(types.types).toBeDefined();

        // Should have Query type
        const queryType = types.types?.find((t) => t.name === "Query");
        expect(queryType).toBeDefined();

        // Should have Item type
        const itemType = types.types?.find((t) => t.name === "Item");
        expect(itemType).toBeDefined();
      }),
    ),
  );
});

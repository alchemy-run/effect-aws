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
import { afterAll, beforeAll, describe } from "vitest";
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
import { run, test } from "../test.ts";

// Skip all tests in LocalStack - AppSync is not supported in community edition
const isLocalStack = process.env.LOCAL === "true" || process.env.LOCAL === "1";

const retrySchedule = Schedule.intersect(
  Schedule.recurs(10),
  Schedule.spaced("1 second"),
);

const TEST_API_NAME = "itty-aws-test-graphql-api";
const TEST_DATA_SOURCE_NAME = "itty_aws_test_datasource";

// API ID will be set by beforeAll
let TEST_API_ID = "";
let TEST_API_ARN = "";

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

// Helper to wait for schema creation to complete
const waitForSchemaCreation = (_apiId: string) =>
  Effect.gen(function* () {
    // Schema creation is async - poll for completion
    // Just wait a bit for the schema to be processed
    yield* Effect.sleep("2 seconds");
  });

// Wrap all tests in describe block that skips in LocalStack
(isLocalStack ? describe.skip : describe)("AppSync", () => {
  // Create the GraphQL API before all tests
  beforeAll(async () => {
    await run(
      Effect.gen(function* () {
        // Delete existing API if it exists (cleanup from previous runs)
        const existingApis = yield* listGraphqlApis({}).pipe(
          Effect.catchAll(() => Effect.succeed({ graphqlApis: [] })),
        );
        for (const api of existingApis.graphqlApis ?? []) {
          if (api.name === TEST_API_NAME) {
            yield* deleteGraphqlApi({ apiId: api.apiId! }).pipe(Effect.ignore);
          }
        }

        // Create a new GraphQL API with API_KEY authentication
        const createResult = yield* createGraphqlApi({
          name: TEST_API_NAME,
          authenticationType: "API_KEY",
          tags: {
            Environment: "test",
            Project: "itty-aws",
          },
        }).pipe(Effect.retry(retrySchedule));

        TEST_API_ID = createResult.graphqlApi?.apiId ?? "";
        TEST_API_ARN = createResult.graphqlApi?.arn ?? "";

        yield* Effect.logInfo(`Created GraphQL API: ${TEST_API_ID}`);

        // Start schema creation
        yield* startSchemaCreation({
          apiId: TEST_API_ID,
          definition: new TextEncoder().encode(TEST_SCHEMA),
        }).pipe(Effect.retry(retrySchedule));

        // Wait for schema to be created
        yield* waitForSchemaCreation(TEST_API_ID);
      }),
    );
  }, 120_000);

  // Delete the GraphQL API after all tests
  afterAll(async () => {
    await run(
      Effect.gen(function* () {
        if (TEST_API_ID) {
          yield* deleteGraphqlApi({
            apiId: TEST_API_ID,
          }).pipe(Effect.ignore);
          yield* Effect.logInfo(`Deleted GraphQL API: ${TEST_API_ID}`);
        }
      }),
    );
  });

  // ============================================================================
  // GraphQL API Management Tests
  // ============================================================================

  test(
    "getGraphqlApi returns API details",
    Effect.gen(function* () {
      const result = yield* getGraphqlApi({
        apiId: TEST_API_ID,
      });

      expect(result.graphqlApi).toBeDefined();
      expect(result.graphqlApi?.name).toEqual(TEST_API_NAME);
      expect(result.graphqlApi?.authenticationType).toEqual("API_KEY");
    }),
  );

  test(
    "listGraphqlApis includes our test API",
    Effect.gen(function* () {
      const result = yield* listGraphqlApis({});

      expect(result.graphqlApis).toBeDefined();

      const found = result.graphqlApis?.find(
        (api) => api.apiId === TEST_API_ID,
      );
      expect(found).toBeDefined();
      expect(found?.name).toEqual(TEST_API_NAME);
    }),
  );

  // ============================================================================
  // Data Source Tests
  // ============================================================================

  test(
    "create, get, list, and delete a NONE data source",
    Effect.gen(function* () {
      const dataSourceName = TEST_DATA_SOURCE_NAME;

      // Create a NONE data source (doesn't need external resources)
      const createResult = yield* createDataSource({
        apiId: TEST_API_ID,
        name: dataSourceName,
        type: "NONE",
        description: "Test NONE data source for itty-aws",
      });

      expect(createResult.dataSource).toBeDefined();
      expect(createResult.dataSource?.name).toEqual(dataSourceName);
      expect(createResult.dataSource?.type).toEqual("NONE");

      try {
        // Get the data source
        const getResult = yield* getDataSource({
          apiId: TEST_API_ID,
          name: dataSourceName,
        });

        expect(getResult.dataSource?.name).toEqual(dataSourceName);
        expect(getResult.dataSource?.type).toEqual("NONE");

        // List data sources
        const listResult = yield* listDataSources({
          apiId: TEST_API_ID,
        });

        expect(listResult.dataSources).toBeDefined();
        const found = listResult.dataSources?.find(
          (ds) => ds.name === dataSourceName,
        );
        expect(found).toBeDefined();
      } finally {
        // Delete the data source
        yield* deleteDataSource({
          apiId: TEST_API_ID,
          name: dataSourceName,
        }).pipe(Effect.ignore);
      }

      // Verify it's deleted
      const exists = yield* getDataSource({
        apiId: TEST_API_ID,
        name: dataSourceName,
      }).pipe(
        Effect.map(() => true),
        Effect.catchAll(() => Effect.succeed(false)),
      );

      expect(exists).toEqual(false);
    }),
  );

  // ============================================================================
  // Type Tests
  // ============================================================================

  test(
    "create, get, list, and delete a type",
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
        apiId: TEST_API_ID,
        definition: typeDefinition,
        format: "SDL",
      }).pipe(Effect.retry(retrySchedule));

      expect(createResult.type).toBeDefined();

      try {
        // Get the type
        const getResult = yield* getType({
          apiId: TEST_API_ID,
          typeName,
          format: "SDL",
        });

        expect(getResult.type?.name).toEqual(typeName);

        // List types
        const listResult = yield* listTypes({
          apiId: TEST_API_ID,
          format: "SDL",
        });

        expect(listResult.types).toBeDefined();
        const found = listResult.types?.find((t) => t.name === typeName);
        expect(found).toBeDefined();
      } finally {
        // Delete the type
        yield* deleteType({
          apiId: TEST_API_ID,
          typeName,
        }).pipe(Effect.ignore);
      }
    }),
  );

  // ============================================================================
  // Resolver Tests
  // ============================================================================

  test(
    "create, get, list, and delete a resolver",
    Effect.gen(function* () {
      const dataSourceName = "itty_resolver_test_ds";
      const typeName = "Query";
      const fieldName = "getItem";

      // First create a NONE data source for the resolver
      yield* createDataSource({
        apiId: TEST_API_ID,
        name: dataSourceName,
        type: "NONE",
        description: "Data source for resolver test",
      }).pipe(Effect.retry(retrySchedule));

      try {
        // Create a resolver with VTL templates
        const createResult = yield* createResolver({
          apiId: TEST_API_ID,
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
            apiId: TEST_API_ID,
            typeName,
            fieldName,
          });

          expect(getResult.resolver?.typeName).toEqual(typeName);
          expect(getResult.resolver?.fieldName).toEqual(fieldName);
          expect(getResult.resolver?.dataSourceName).toEqual(dataSourceName);

          // List resolvers
          const listResult = yield* listResolvers({
            apiId: TEST_API_ID,
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
            apiId: TEST_API_ID,
            typeName,
            fieldName,
          }).pipe(Effect.ignore);
        }

        // Verify resolver is deleted
        const resolverExists = yield* getResolver({
          apiId: TEST_API_ID,
          typeName,
          fieldName,
        }).pipe(
          Effect.map(() => true),
          Effect.catchAll(() => Effect.succeed(false)),
        );

        expect(resolverExists).toEqual(false);
      } finally {
        // Clean up data source
        yield* deleteDataSource({
          apiId: TEST_API_ID,
          name: dataSourceName,
        }).pipe(Effect.ignore);
      }
    }),
  );

  // ============================================================================
  // Tagging Tests
  // ============================================================================

  test(
    "tag and untag GraphQL API",
    Effect.gen(function* () {
      // List current tags
      const initialTags = yield* listTagsForResource({
        resourceArn: TEST_API_ARN,
      });

      expect(initialTags.tags).toBeDefined();
      // Should have the tags we created with
      expect(initialTags.tags?.["Environment"]).toEqual("test");
      expect(initialTags.tags?.["Project"]).toEqual("itty-aws");

      // Add a new tag
      yield* tagResource({
        resourceArn: TEST_API_ARN,
        tags: {
          Team: "Platform",
          Version: "1.0",
        },
      });

      // Verify new tags
      const updatedTags = yield* listTagsForResource({
        resourceArn: TEST_API_ARN,
      });

      expect(updatedTags.tags?.["Team"]).toEqual("Platform");
      expect(updatedTags.tags?.["Version"]).toEqual("1.0");
      expect(updatedTags.tags?.["Environment"]).toEqual("test");

      // Remove a tag
      yield* untagResource({
        resourceArn: TEST_API_ARN,
        tagKeys: ["Version"],
      });

      // Verify tag was removed
      const finalTags = yield* listTagsForResource({
        resourceArn: TEST_API_ARN,
      });

      expect(finalTags.tags?.["Version"]).toBeUndefined();
      expect(finalTags.tags?.["Team"]).toEqual("Platform");

      // Clean up added tag
      yield* untagResource({
        resourceArn: TEST_API_ARN,
        tagKeys: ["Team"],
      }).pipe(Effect.ignore);
    }),
  );

  // ============================================================================
  // Create and Delete API Test
  // ============================================================================

  test(
    "create and delete a GraphQL API",
    Effect.gen(function* () {
      const tempApiName = "itty-aws-temp-api";

      // Create a temporary API
      const created = yield* createGraphqlApi({
        name: tempApiName,
        authenticationType: "API_KEY",
      });

      expect(created.graphqlApi).toBeDefined();
      expect(created.graphqlApi?.name).toEqual(tempApiName);

      const tempApiId = created.graphqlApi?.apiId!;

      try {
        // Verify it exists
        const getResult = yield* getGraphqlApi({
          apiId: tempApiId,
        });

        expect(getResult.graphqlApi?.name).toEqual(tempApiName);
      } finally {
        // Delete the API
        yield* deleteGraphqlApi({
          apiId: tempApiId,
        });
      }

      // Verify it's gone
      const exists = yield* getGraphqlApi({
        apiId: tempApiId,
      }).pipe(
        Effect.map(() => true),
        Effect.catchAll(() => Effect.succeed(false)),
      );

      expect(exists).toEqual(false);
    }),
  );
});

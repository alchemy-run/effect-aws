import { expect } from "@effect/vitest";
import { Console, Effect, Schedule } from "effect";
import { afterAll, beforeAll } from "vitest";
import {
  createTable,
  deleteItem,
  deleteTable,
  describeTable,
  getItem,
  listTables,
  putItem,
  query,
  scan,
  updateItem,
} from "../../src/services/dynamodb.ts";
import { run, test } from "../test.ts";

const TEST_TABLE_NAME = "itty-aws-test-table";

const retrySchedule = Schedule.intersect(
  Schedule.recurs(30),
  Schedule.spaced("1 second"),
);

// Helper to wait for table to become active
const waitForTableActive = (tableName: string) =>
  describeTable({ TableName: tableName }).pipe(
    Effect.flatMap((result) =>
      result.Table?.TableStatus === "ACTIVE"
        ? Effect.succeed(result)
        : Effect.fail(
            new Error(`Table status is ${result.Table?.TableStatus}`),
          ),
    ),
    Effect.retry(retrySchedule),
    Effect.mapError(() => new Error("Table did not become active")),
  );

// Helper to wait for table to be deleted
const waitForTableDeleted = (tableName: string) =>
  describeTable({ TableName: tableName }).pipe(
    Effect.flatMap(() => Effect.fail(new Error("Table still exists"))),
    Effect.catchAll((error) =>
      error instanceof Error && error.message === "Table still exists"
        ? Effect.fail(error)
        : Effect.void,
    ),
    Effect.retry(retrySchedule),
    Effect.mapError(() => new Error("Table was not deleted")),
  );

// Create the table before all tests
beforeAll(async () => {
  await run(
    Effect.gen(function* () {
      // Delete existing table if it exists (cleanup from previous runs)
      yield* deleteTable({ TableName: TEST_TABLE_NAME }).pipe(Effect.ignore);
      yield* waitForTableDeleted(TEST_TABLE_NAME);

      // Create table with simple key schema
      yield* createTable({
        TableName: TEST_TABLE_NAME,
        KeySchema: [
          { AttributeName: "pk", KeyType: "HASH" },
          { AttributeName: "sk", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
          { AttributeName: "pk", AttributeType: "S" },
          { AttributeName: "sk", AttributeType: "S" },
        ],
        BillingMode: "PAY_PER_REQUEST",
      });

      // Wait for table to become active
      yield* waitForTableActive(TEST_TABLE_NAME);
    }),
  );
}, 60_000);

// Delete the table after all tests
afterAll(async () => {
  await run(
    Effect.gen(function* () {
      yield* deleteTable({ TableName: TEST_TABLE_NAME }).pipe(Effect.ignore);
      yield* Console.log(`Deleted table ${TEST_TABLE_NAME}`);
    }),
  );
});

// ============================================================================
// Table Management Tests
// ============================================================================

test(
  "create table, describe table, list tables, and delete table",
  Effect.gen(function* () {
    const tableName = TEST_TABLE_NAME;

    // Describe table
    const describeResult = yield* describeTable({ TableName: tableName });

    expect(describeResult.Table?.TableName).toEqual(tableName);
    expect(describeResult.Table?.TableStatus).toEqual("ACTIVE");

    // Verify key schema
    const keySchema = describeResult.Table?.KeySchema;
    expect(keySchema).toBeDefined();
    expect(keySchema!.length).toEqual(2);

    const hashKey = keySchema!.find((k) => k.KeyType === "HASH");
    expect(hashKey?.AttributeName).toEqual("pk");

    // List tables and verify our table is in the list
    const listResult = yield* listTables({});
    const foundTable = listResult.TableNames?.find((t) => t === tableName);
    expect(foundTable).toBeDefined();
  }),
);

// ============================================================================
// Item CRUD Tests
// ============================================================================

test(
  "putItem and getItem",
  Effect.gen(function* () {
    const tableName = TEST_TABLE_NAME;

    // DynamoDB uses AttributeValue tagged union - { S: string }, { N: string }, { BOOL: boolean }, etc.
    const item = {
      pk: { S: "user#123" },
      sk: { S: "profile" },
      name: { S: "John Doe" },
      email: { S: "john@example.com" },
      age: { N: "30" }, // Numbers are sent as strings in DynamoDB
      active: { BOOL: true },
    };

    // Put item
    yield* putItem({
      TableName: tableName,
      Item: item,
    });

    // Get item
    const getResult = yield* getItem({
      TableName: tableName,
      Key: {
        pk: { S: "user#123" },
        sk: { S: "profile" },
      },
    });

    expect(getResult.Item).toBeDefined();

    // Verify item attributes - DynamoDB returns AttributeValue tagged union
    const resultPk = getResult.Item!.pk as { S: string };
    const resultSk = getResult.Item!.sk as { S: string };
    const resultName = getResult.Item!.name as { S: string };
    const resultEmail = getResult.Item!.email as { S: string };

    expect(resultPk.S).toEqual("user#123");
    expect(resultSk.S).toEqual("profile");
    expect(resultName.S).toEqual("John Doe");
    expect(resultEmail.S).toEqual("john@example.com");
  }),
);

test(
  "putItem with condition expression",
  Effect.gen(function* () {
    const tableName = TEST_TABLE_NAME;

    const item = {
      pk: { S: "user#456" },
      sk: { S: "profile" },
      name: { S: "Jane Doe" },
      version: { N: "1" },
    };

    // Put item
    yield* putItem({
      TableName: tableName,
      Item: item,
    });

    // Try to put with condition that item doesn't exist (should fail)
    const conditionalPutResult = yield* putItem({
      TableName: tableName,
      Item: {
        ...item,
        version: { N: "2" },
      },
      ConditionExpression: "attribute_not_exists(pk)",
    }).pipe(
      Effect.map(() => "success" as const),
      Effect.catchAll(() => Effect.succeed("error" as const)),
    );

    expect(conditionalPutResult).toEqual("error");

    // Conditional put with correct condition should succeed
    yield* putItem({
      TableName: tableName,
      Item: { ...item, version: { N: "2" } },
      ConditionExpression: "attribute_exists(pk)",
    });

    // Verify update
    const getResult = yield* getItem({
      TableName: tableName,
      Key: { pk: { S: "user#456" }, sk: { S: "profile" } },
    });

    const version = getResult.Item?.version as { N: string } | undefined;
    expect(version?.N).toEqual("2");
  }),
);

test(
  "updateItem",
  Effect.gen(function* () {
    const tableName = TEST_TABLE_NAME;

    const item = {
      pk: { S: "user#789" },
      sk: { S: "profile" },
      name: { S: "Bob Smith" },
      count: { N: "0" },
    };

    // Put initial item
    yield* putItem({
      TableName: tableName,
      Item: item,
    });

    // Update item
    yield* updateItem({
      TableName: tableName,
      Key: { pk: { S: "user#789" }, sk: { S: "profile" } },
      UpdateExpression: "SET #name = :newName, #count = #count + :inc",
      ExpressionAttributeNames: {
        "#name": "name",
        "#count": "count",
      },
      ExpressionAttributeValues: {
        ":newName": { S: "Robert Smith" },
        ":inc": { N: "1" },
      },
    });

    // Verify update
    const getResult = yield* getItem({
      TableName: tableName,
      Key: { pk: { S: "user#789" }, sk: { S: "profile" } },
    });

    const name = getResult.Item?.name as { S: string } | undefined;
    expect(name?.S).toEqual("Robert Smith");

    // DynamoDB returns numbers as strings in the N field
    const count = getResult.Item?.count as { N: string } | undefined;
    expect(count?.N).toEqual("1");
  }),
);

test(
  "deleteItem",
  Effect.gen(function* () {
    const tableName = TEST_TABLE_NAME;

    const item = {
      pk: { S: "user#delete" },
      sk: { S: "profile" },
      name: { S: "Delete Me" },
    };

    // Put item
    yield* putItem({
      TableName: tableName,
      Item: item,
    });

    // Verify item exists
    const getBeforeDelete = yield* getItem({
      TableName: tableName,
      Key: { pk: { S: "user#delete" }, sk: { S: "profile" } },
    });

    expect(getBeforeDelete.Item).toBeDefined();

    // Delete item
    yield* deleteItem({
      TableName: tableName,
      Key: { pk: { S: "user#delete" }, sk: { S: "profile" } },
    });

    // Verify item is gone
    const getAfterDelete = yield* getItem({
      TableName: tableName,
      Key: { pk: { S: "user#delete" }, sk: { S: "profile" } },
    });

    expect(getAfterDelete.Item).toBeUndefined();
  }),
);

// ============================================================================
// Query and Scan Tests
// ============================================================================

test(
  "query items by partition key",
  Effect.gen(function* () {
    const tableName = TEST_TABLE_NAME;

    // Insert multiple items with same partition key
    const items = [
      {
        pk: { S: "order#100" },
        sk: { S: "item#1" },
        product: { S: "Widget" },
        quantity: { N: "2" },
      },
      {
        pk: { S: "order#100" },
        sk: { S: "item#2" },
        product: { S: "Gadget" },
        quantity: { N: "1" },
      },
      {
        pk: { S: "order#100" },
        sk: { S: "item#3" },
        product: { S: "Gizmo" },
        quantity: { N: "5" },
      },
      {
        pk: { S: "order#101" },
        sk: { S: "item#1" },
        product: { S: "Other" },
        quantity: { N: "1" },
      },
    ];

    for (const item of items) {
      yield* putItem({
        TableName: tableName,
        Item: item,
      });
    }

    // Query by partition key
    const queryResult = yield* query({
      TableName: tableName,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: "order#100" },
      },
    });

    expect(queryResult.Count).toEqual(3);
    expect(queryResult.Items).toBeDefined();
    expect(queryResult.Items!.length).toEqual(3);

    // Verify items are sorted by sort key
    const sortKeys = queryResult.Items!.map(
      (item) => (item.sk as { S: string }).S,
    );
    const expectedSortKeys = ["item#1", "item#2", "item#3"];
    for (let i = 0; i < expectedSortKeys.length; i++) {
      expect(sortKeys[i]).toEqual(expectedSortKeys[i]);
    }
  }),
);

test(
  "query with sort key condition",
  Effect.gen(function* () {
    const tableName = TEST_TABLE_NAME;

    // Insert items
    const items = [
      {
        pk: { S: "user#1" },
        sk: { S: "order#2023-01-01" },
        total: { N: "100" },
      },
      {
        pk: { S: "user#1" },
        sk: { S: "order#2023-06-15" },
        total: { N: "250" },
      },
      {
        pk: { S: "user#1" },
        sk: { S: "order#2024-01-01" },
        total: { N: "175" },
      },
      { pk: { S: "user#1" }, sk: { S: "profile" }, name: { S: "User One" } },
    ] as const;

    for (const item of items) {
      yield* putItem({
        TableName: tableName,
        Item: item,
      });
    }

    // Query orders in 2023 using begins_with
    const queryResult = yield* query({
      TableName: tableName,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": { S: "user#1" },
        ":skPrefix": { S: "order#2023" },
      },
    });

    expect(queryResult.Count).toEqual(2);

    // Query with ScanIndexForward = false (descending order)
    const queryDescResult = yield* query({
      TableName: tableName,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": { S: "user#1" },
        ":skPrefix": { S: "order#" },
      },
      ScanIndexForward: false,
    });

    expect(queryDescResult.Items).toBeDefined();
    expect(queryDescResult.Items!.length).toEqual(3);

    // First item should be the latest order
    const firstSk = (queryDescResult.Items![0].sk as { S: string }).S;
    expect(firstSk).toEqual("order#2024-01-01");
  }),
);

test(
  "scan with filter expression",
  Effect.gen(function* () {
    const tableName = TEST_TABLE_NAME;

    // Insert items
    const items = [
      {
        pk: { S: "product#1" },
        sk: { S: "info" },
        name: { S: "Widget" },
        price: { N: "10" },
        inStock: { BOOL: true },
      },
      {
        pk: { S: "product#2" },
        sk: { S: "info" },
        name: { S: "Gadget" },
        price: { N: "25" },
        inStock: { BOOL: false },
      },
      {
        pk: { S: "product#3" },
        sk: { S: "info" },
        name: { S: "Gizmo" },
        price: { N: "15" },
        inStock: { BOOL: true },
      },
      {
        pk: { S: "product#4" },
        sk: { S: "info" },
        name: { S: "Thing" },
        price: { N: "50" },
        inStock: { BOOL: true },
      },
    ];

    for (const item of items) {
      yield* putItem({
        TableName: tableName,
        Item: item,
      });
    }

    // Scan all product items (filter to avoid items from other tests)
    const scanAllResult = yield* scan({
      TableName: tableName,
      FilterExpression: "begins_with(pk, :prefix)",
      ExpressionAttributeValues: {
        ":prefix": { S: "product#" },
      },
    });

    expect(scanAllResult.Count).toEqual(4);

    // Scan with filter for inStock = true
    const scanFilteredResult = yield* scan({
      TableName: tableName,
      FilterExpression: "inStock = :inStock",
      ExpressionAttributeValues: {
        ":inStock": { BOOL: true },
      },
    });

    expect(scanFilteredResult.Count).toEqual(3);

    // Scan with filter for price > 20
    const scanPriceResult = yield* scan({
      TableName: tableName,
      FilterExpression: "price > :minPrice",
      ExpressionAttributeValues: {
        ":minPrice": { N: "20" },
      },
    });

    expect(scanPriceResult.Count).toEqual(2);
  }),
);

// ============================================================================
// Projection Expression Tests
// ============================================================================

test(
  "getItem with projection expression",
  Effect.gen(function* () {
    const tableName = TEST_TABLE_NAME;

    const item = {
      pk: { S: "user#proj" },
      sk: { S: "profile" },
      name: { S: "Projection Test" },
      email: { S: "proj@test.com" },
      password: { S: "secret" },
      age: { N: "25" },
    };

    yield* putItem({
      TableName: tableName,
      Item: item,
    });

    // Get with projection - only retrieve specific attributes
    const getResult = yield* getItem({
      TableName: tableName,
      Key: { pk: { S: "user#proj" }, sk: { S: "profile" } },
      ProjectionExpression: "#name, email",
      ExpressionAttributeNames: {
        "#name": "name",
      },
    });

    expect(getResult.Item).toBeDefined();

    // Should have name and email
    const name = getResult.Item!.name as { S: string } | undefined;
    const email = getResult.Item!.email as { S: string } | undefined;
    expect(name?.S).toEqual("Projection Test");
    expect(email?.S).toEqual("proj@test.com");

    // Should NOT have password (not in projection)
    expect(getResult.Item!.password).toBeUndefined();
  }),
);

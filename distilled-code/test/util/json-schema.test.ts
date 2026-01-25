import { JSONSchema, Schema } from "effect";
import { describe, expect, it } from "vitest";
import { schemaFromJsonSchema } from "../../src/util/json-schema.ts";

/**
 * Helper to test round-trip conversion:
 * 1. Define a schema with Effect Schema (with description annotations)
 * 2. Convert to JSON Schema
 * 3. Reverse it back using schemaFromJsonSchema
 * 4. Convert the reversed schema back to JSON Schema
 * 5. Assert the JSON Schemas match
 */
function testRoundTrip(
  name: string,
  schema: Schema.Schema.All,
  options?: { target?: "jsonSchema7" | "jsonSchema2019-09" | "openApi3.1" },
) {
  it(name, () => {
    // Step 1 & 2: Convert original schema to JSON Schema
    const originalJsonSchema = JSONSchema.make(
      schema as Schema.Schema<unknown, unknown, never>,
      options,
    );

    // Step 3: Convert JSON Schema back to Effect Schema
    const reversedSchema = schemaFromJsonSchema(originalJsonSchema);

    // Step 4: Convert reversed schema back to JSON Schema
    const reversedJsonSchema = JSONSchema.make(
      reversedSchema as Schema.Schema<unknown, unknown, never>,
      options,
    );

    // Step 5: Assert they match
    expect(reversedJsonSchema).toEqual(originalJsonSchema);
  });
}

describe("schemaFromJsonSchema", () => {
  describe("primitive types", () => {
    testRoundTrip(
      "string with description",
      Schema.String.annotations({ description: "A user name" }),
    );

    testRoundTrip(
      "number with description",
      Schema.Number.annotations({ description: "User age" }),
    );

    testRoundTrip(
      "boolean with description",
      Schema.Boolean.annotations({ description: "Is active" }),
    );

    testRoundTrip("null", Schema.Null);

    testRoundTrip(
      "integer (number with int filter)",
      Schema.Number.pipe(Schema.int()).annotations({
        description: "An integer value",
      }),
    );
  });

  describe("literal types", () => {
    testRoundTrip(
      "string literal",
      Schema.Literal("hello").annotations({ description: "A greeting" }),
    );

    testRoundTrip(
      "number literal",
      Schema.Literal(42).annotations({ description: "The answer" }),
    );

    testRoundTrip(
      "boolean literal true",
      Schema.Literal(true).annotations({ description: "Always true" }),
    );

    testRoundTrip(
      "boolean literal false",
      Schema.Literal(false).annotations({ description: "Always false" }),
    );
  });

  describe("union types", () => {
    testRoundTrip(
      "union of literals",
      Schema.Union(
        Schema.Literal("a"),
        Schema.Literal("b"),
        Schema.Literal("c"),
      ).annotations({ description: "One of a, b, or c" }),
    );

    testRoundTrip(
      "nullable string (NullOr)",
      Schema.NullOr(Schema.String).annotations({
        description: "Optional name",
      }),
    );

    testRoundTrip(
      "union of string and number",
      Schema.Union(Schema.String, Schema.Number).annotations({
        description: "String or number",
      }),
    );
  });

  describe("array types", () => {
    testRoundTrip(
      "array of strings",
      Schema.Array(Schema.String).annotations({ description: "List of names" }),
    );

    testRoundTrip(
      "array of numbers with description on items",
      Schema.Array(
        Schema.Number.annotations({ description: "A score" }),
      ).annotations({ description: "List of scores" }),
    );

    testRoundTrip(
      "array of objects",
      Schema.Array(
        Schema.Struct({
          id: Schema.Number.annotations({ description: "Item ID" }),
          name: Schema.String.annotations({ description: "Item name" }),
        }),
      ).annotations({ description: "List of items" }),
    );
  });

  describe("object types (Struct)", () => {
    testRoundTrip(
      "simple struct with required fields",
      Schema.Struct({
        name: Schema.String.annotations({ description: "User name" }),
        age: Schema.Number.annotations({ description: "User age" }),
      }).annotations({ description: "A user object" }),
    );

    testRoundTrip(
      "struct with optional fields",
      Schema.Struct({
        name: Schema.String.annotations({ description: "User name" }),
        nickname: Schema.optional(
          Schema.String.annotations({ description: "Optional nickname" }),
        ),
      }).annotations({ description: "User with optional nickname" }),
    );

    testRoundTrip(
      "nested struct",
      Schema.Struct({
        user: Schema.Struct({
          name: Schema.String.annotations({ description: "Name" }),
          email: Schema.String.annotations({ description: "Email" }),
        }).annotations({ description: "User info" }),
        metadata: Schema.Struct({
          createdAt: Schema.String.annotations({
            description: "Creation date",
          }),
        }).annotations({ description: "Metadata" }),
      }).annotations({ description: "User with metadata" }),
    );

    testRoundTrip(
      "struct with array field",
      Schema.Struct({
        tags: Schema.Array(Schema.String).annotations({
          description: "List of tags",
        }),
      }).annotations({ description: "Tagged entity" }),
    );
  });

  describe("complex types", () => {
    testRoundTrip(
      "struct with union field",
      Schema.Struct({
        value: Schema.Union(Schema.String, Schema.Number).annotations({
          description: "String or number value",
        }),
      }).annotations({ description: "Flexible value container" }),
    );

    testRoundTrip(
      "struct with nullable field",
      Schema.Struct({
        name: Schema.String.annotations({ description: "Name" }),
        description: Schema.NullOr(Schema.String).annotations({
          description: "Optional description",
        }),
      }).annotations({ description: "Entity with optional description" }),
    );

    testRoundTrip(
      "array of unions",
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            type: Schema.Literal("text"),
            content: Schema.String,
          }),
          Schema.Struct({ type: Schema.Literal("image"), url: Schema.String }),
        ),
      ).annotations({ description: "Mixed content blocks" }),
    );
  });

  describe("special types", () => {
    testRoundTrip("Any", Schema.Any);
    testRoundTrip("Unknown", Schema.Unknown);
    testRoundTrip("Never", Schema.Never);
    testRoundTrip("Void", Schema.Void);
  });

  describe("annotations preservation", () => {
    testRoundTrip(
      "title annotation",
      Schema.String.annotations({
        title: "UserName",
        description: "The user's display name",
      }),
    );

    testRoundTrip(
      "examples annotation",
      Schema.String.annotations({
        description: "A color value",
        examples: ["red", "green", "blue"],
      }),
    );

    testRoundTrip(
      "default annotation",
      Schema.String.annotations({
        description: "Status field",
        default: "active",
      }),
    );

    testRoundTrip(
      "all annotations together",
      Schema.Struct({
        status: Schema.String.annotations({
          title: "Status",
          description: "Current status",
          default: "pending",
          examples: ["pending", "active", "completed"],
        }),
      }).annotations({
        title: "StatusContainer",
        description: "Contains a status field",
      }),
    );
  });

  describe("edge cases", () => {
    testRoundTrip("empty struct", Schema.Struct({}));

    testRoundTrip(
      "deeply nested structure",
      Schema.Struct({
        level1: Schema.Struct({
          level2: Schema.Struct({
            level3: Schema.Struct({
              value: Schema.String.annotations({ description: "Deep value" }),
            }).annotations({ description: "Level 3" }),
          }).annotations({ description: "Level 2" }),
        }).annotations({ description: "Level 1" }),
      }).annotations({ description: "Root" }),
    );

    testRoundTrip(
      "array of arrays",
      Schema.Array(
        Schema.Array(Schema.Number).annotations({ description: "Inner array" }),
      ).annotations({ description: "Matrix" }),
    );
  });

  describe("direct JSON Schema input", () => {
    testRoundTrip(
      "parses a raw JSON Schema object",
      schemaFromJsonSchema({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object" as const,
        properties: {
          name: { type: "string" as const, description: "User name" },
          age: { type: "number" as const, description: "User age" },
        },
        required: ["name"],
        additionalProperties: false,
      }),
    );

    testRoundTrip(
      "handles $defs references",
      schemaFromJsonSchema({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object" as const,
        properties: {
          user: { $ref: "#/$defs/User" },
        },
        required: ["user"],
        additionalProperties: false,
        $defs: {
          User: {
            type: "object" as const,
            properties: {
              name: { type: "string" as const },
            },
            required: ["name"],
            additionalProperties: false,
          },
        },
      }),
    );
    // it("handles $defs references", () => {
    // const roundTripJsonSchema = JSONSchema.make(schema as Schema.Schema<unknown, unknown, never>);

    // expect((roundTripJsonSchema as { type?: string }).type).toBe("object");
    // });
  });
});

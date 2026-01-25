/**
 * Converts a JSON Schema to an Effect Schema.
 *
 * This is the inverse of `JSONSchema.make` from Effect.
 * It supports a subset of JSON Schema features commonly used with Effect Schema.
 */
import type { JSONSchema } from "effect";
import * as Schema from "effect/Schema";

/**
 * JSON Schema 7 type representation (subset of what Effect generates)
 */
export type JsonSchema7 = JSONSchema.JsonSchema7;

/**
 * JSON Schema 7 Root with $defs
 */
export type JsonSchema7Root = JSONSchema.JsonSchema7Root;

/**
 * Convert a JSON Schema to an Effect Schema.
 *
 * @param jsonSchema - The JSON Schema to convert
 * @returns An Effect Schema that matches the JSON Schema structure
 *
 * @example
 * ```ts
 * const jsonSchema = {
 *   type: "object",
 *   properties: {
 *     name: { type: "string", description: "User name" },
 *     age: { type: "number" }
 *   },
 *   required: ["name"]
 * };
 *
 * const schema = schemaFromJsonSchema(jsonSchema);
 * ```
 */
export function schemaFromJsonSchema(
  jsonSchema: JsonSchema7Root,
): Schema.Schema.Any {
  const defs = jsonSchema.$defs ?? {};
  return fromJsonSchemaInternal(jsonSchema, defs);
}

// Use Schema.Schema.Any as internal return type since it's more permissive
function fromJsonSchemaInternal(
  jsonSchema: JsonSchema7,
  defs: Record<string, JsonSchema7>,
): Schema.Schema.Any {
  // Handle annotations
  const annotations: Record<string, unknown> = {};
  if ("description" in jsonSchema && jsonSchema.description) {
    annotations.description = jsonSchema.description;
  }
  if ("title" in jsonSchema && jsonSchema.title) {
    annotations.title = jsonSchema.title;
  }
  if ("default" in jsonSchema && jsonSchema.default !== undefined) {
    annotations.default = jsonSchema.default;
  }
  if ("examples" in jsonSchema && jsonSchema.examples) {
    annotations.examples = jsonSchema.examples;
  }

  const applyAnnotations = <S extends Schema.Schema.Any>(schema: S): S => {
    if (Object.keys(annotations).length > 0) {
      return schema.annotations(annotations) as S;
    }
    return schema;
  };

  // Handle $ref
  if ("$ref" in jsonSchema && jsonSchema.$ref) {
    const refPath = jsonSchema.$ref;
    // Extract definition name from $ref like "#/$defs/MyType"
    const match = refPath.match(/^#\/\$defs\/(.+)$/);
    if (match && match[1]) {
      const defName = match[1];
      const def = defs[defName];
      if (def) {
        return applyAnnotations(fromJsonSchemaInternal(def, defs));
      }
    }
    throw new Error(`Unable to resolve $ref: ${refPath}`);
  }

  // Handle special $id schemas (never, any, unknown, void, object, empty)
  if ("$id" in jsonSchema) {
    switch (jsonSchema.$id) {
      case "/schemas/never":
        // Schema.Never doesn't support annotations due to its type
        return Schema.Never as unknown as Schema.Schema.Any;
      case "/schemas/any":
        return applyAnnotations(Schema.Any);
      case "/schemas/unknown":
        return applyAnnotations(Schema.Unknown);
      case "/schemas/void":
        return applyAnnotations(Schema.Void);
      case "/schemas/object":
        return applyAnnotations(Schema.Object);
      case "/schemas/%7B%7D":
        // Empty struct - use Struct({}) not Object
        return applyAnnotations(Schema.Struct({}));
    }
  }

  // Handle enum
  if ("enum" in jsonSchema && jsonSchema.enum) {
    const values = jsonSchema.enum as readonly (string | number | boolean)[];
    if (values.length === 1) {
      return applyAnnotations(Schema.Literal(values[0]));
    }
    const literals = values.map((v) => Schema.Literal(v));
    if (literals.length >= 2) {
      return applyAnnotations(
        Schema.Union(literals[0], literals[1], ...literals.slice(2)),
      );
    }
    // Schema.Never doesn't support annotations due to its type
    return Schema.Never as unknown as Schema.Schema.Any;
  }

  // Handle anyOf (union)
  if ("anyOf" in jsonSchema && jsonSchema.anyOf) {
    const members = jsonSchema.anyOf.map((m) =>
      fromJsonSchemaInternal(m, defs),
    );
    if (members.length === 0) {
      // Schema.Never doesn't support annotations due to its type
      return Schema.Never as unknown as Schema.Schema.Any;
    }
    if (members.length === 1) {
      return applyAnnotations(members[0]);
    }
    return applyAnnotations(
      Schema.Union(members[0], members[1], ...members.slice(2)),
    );
  }

  // Handle type-based schemas
  if ("type" in jsonSchema) {
    switch (jsonSchema.type) {
      case "null":
        return applyAnnotations(Schema.Null);

      case "boolean":
        return applyAnnotations(Schema.Boolean);

      case "string":
        return applyAnnotations(Schema.String);

      case "number":
        return applyAnnotations(Schema.Number);

      case "integer":
        return applyAnnotations(Schema.Number.pipe(Schema.int()));

      case "array": {
        const items = "items" in jsonSchema ? jsonSchema.items : undefined;
        if (items !== undefined && items !== false) {
          if (Array.isArray(items)) {
            // Tuple
            const elements = items.map((item) =>
              fromJsonSchemaInternal(item as JsonSchema7, defs),
            );
            if (elements.length >= 1) {
              return applyAnnotations(
                Schema.Tuple(elements[0], ...elements.slice(1)),
              );
            }
            return applyAnnotations(Schema.Tuple());
          }
          // Regular array with items schema
          const itemSchema = fromJsonSchemaInternal(items as JsonSchema7, defs);
          return applyAnnotations(Schema.Array(itemSchema));
        }
        if (items === false) {
          // Empty tuple
          return applyAnnotations(Schema.Tuple());
        }
        // Array without items - any array
        return applyAnnotations(Schema.Array(Schema.Unknown));
      }

      case "object": {
        if ("properties" in jsonSchema && jsonSchema.properties) {
          const required = new Set(jsonSchema.required ?? []);
          const fields: Record<
            string,
            Schema.Schema.Any | Schema.PropertySignature.Any
          > = {};

          for (const [key, propSchema] of Object.entries(
            jsonSchema.properties,
          )) {
            const fieldSchema = fromJsonSchemaInternal(propSchema, defs);
            if (required.has(key)) {
              fields[key] = fieldSchema;
            } else {
              fields[key] = Schema.optional(fieldSchema);
            }
          }

          // Handle additionalProperties
          if (
            "additionalProperties" in jsonSchema &&
            jsonSchema.additionalProperties === true
          ) {
            // Allow any additional properties
            return applyAnnotations(
              Schema.Struct(fields as Schema.Struct.Fields).pipe(
                Schema.extend(
                  Schema.Record({ key: Schema.String, value: Schema.Unknown }),
                ),
              ),
            );
          }

          return applyAnnotations(
            Schema.Struct(fields as Schema.Struct.Fields),
          );
        }

        // Object without properties - record or empty struct
        if (
          "additionalProperties" in jsonSchema &&
          jsonSchema.additionalProperties
        ) {
          if (typeof jsonSchema.additionalProperties === "object") {
            const valueSchema = fromJsonSchemaInternal(
              jsonSchema.additionalProperties,
              defs,
            );
            return applyAnnotations(
              Schema.Record({ key: Schema.String, value: valueSchema }),
            );
          }
          return applyAnnotations(
            Schema.Record({ key: Schema.String, value: Schema.Unknown }),
          );
        }

        return applyAnnotations(Schema.Struct({}));
      }
    }
  }

  // Fallback for unknown schemas
  return applyAnnotations(Schema.Unknown);
}

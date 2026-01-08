import { Command, FileSystem, Path } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import dedent from "dedent";
import {
  Console,
  Context,
  Data,
  Deferred,
  Effect,
  Logger,
  LogLevel,
  Match,
  MutableHashMap,
  Option,
  Ref,
  Schema as S,
} from "effect";
import { loadServiceSpecPatch, ServiceSpec } from "../src/patch/spec-schema.ts";
import type { RuleSetObject } from "../src/rules-engine/expression.ts";
import { generateRuleSetCode } from "./compile-rules.ts";
import {
  GenericShape,
  ServiceShape,
  SmithyModel,
  type ShapeTypeMap,
} from "./model-schema.ts";
//todo(pear): swap out for effect platform path
import path from "pathe";

class SdkFile extends Context.Tag("SdkFile")<
  SdkFile,
  {
    map: MutableHashMap.MutableHashMap<
      string,
      Deferred.Deferred<string, never>
    >;
    schemas: Ref.Ref<
      Array<{ name: string; definition: string; deps: string[] }>
    >;
    errors: Ref.Ref<Array<{ name: string; definition: string }>>;
    operations: Ref.Ref<string>;
    // Set of schema names that are part of a cycle (populated before generation)
    cyclicSchemas: Set<string>;
    // Set of schema names that are cyclic AND are structs (will become classes)
    cyclicClasses: Set<string>;
    // Set of ALL struct names (interfaces can be used directly as types)
    allStructNames: Set<string>;
    // Set of ALL array names (type aliases can be used directly as types)
    allArrayNames: Set<string>;
    // Set of ALL map names (type aliases can be used directly as types)
    allMapNames: Set<string>;
    // Set of ALL union names
    allUnionNames: Set<string>;
    // Set of ALL schema names (for conflict detection)
    allSchemaNames: Set<string>;
    // Import reference names (resolved based on conflicts)
    credsRef: string;
    rgnRef: string;
    commonErrorsRef: string;
    streamRef: string;
    // Map of newtype names to their underlying TypeScript type (e.g., PhoneNumber -> string)
    newtypes: Ref.Ref<Map<string, string>>;
    // Map of error shape IDs to their error traits (for TaggedError generation)
    errorShapeIds: Map<string, ErrorShapeTraits>;
    // Map of error shape names to their inline fields definition
    errorFields: Ref.Ref<Map<string, string>>;
    // Track if middleware import is needed
    usesMiddleware: Ref.Ref<boolean>;
    // Service-level XML namespace (applies to all structures)
    serviceXmlNamespace: string | undefined;
    // Map of input schema names to their operation traits
    operationInputTraits: Map<string, OperationInputTraits>;
    // Map of output schema names to their operation traits
    operationOutputTraits: Map<string, OperationOutputTraits>;
    // Service-level traits (applied to all request schemas)
    serviceTraits: {
      sdkId: string;
      sigV4ServiceName: string;
      version: string;
      protocol: string;
      /** The service shape name from the Smithy model (e.g., "TrentService" for KMS) */
      serviceShapeName: string;
    };
    // Set of shape IDs that are input event streams (vs output event streams)
    inputEventStreamShapeIds: Set<string>;
    // Set of shape IDs that have @sensitive trait
    sensitiveShapeIds: Set<string>;
    // Endpoint rule set for dynamic endpoint resolution
    endpointRuleSet: unknown | undefined;
    // Client context parameters for endpoint resolution
    clientContextParams:
      | Record<string, { type: string; documentation?: string }>
      | undefined;
    // Spec patches from spec/{service}.json for additional errors
    serviceSpec: ServiceSpec;
  }
>() {}

class ModelService extends Context.Tag("ModelService")<
  ModelService,
  SmithyModel
>() {}

function getSdkFlag(): Option.Option<string> {
  const idx = process.argv.indexOf("--sdk");
  const arg = process.argv[idx + 1];
  return idx !== -1 && arg !== undefined ? Option.some(arg) : Option.none();
}

//todo(pear): add this to a category
//todo(pear): add details about the root error to this
class ShapeNotFound extends Data.TaggedError("ShapeNotFound")<{
  message: string;
}> {}
class ProtocolNotFound extends Data.TaggedError("ProtocolNotFound")<{}> {}

//* todo(pear): better error here - most of these need to be handled
class UnableToTransformShapeToSchema extends Data.TaggedError(
  "UnableToTransformShapeToSchema",
)<{
  message: string;
}> {}

class ProtocolNotImplemented extends Data.TaggedError(
  "ProtocolNotImplemented",
)<{
  message: string;
}> {}

// =============================================================================
// Unified Trait Collection
// =============================================================================

/**
 * Smithy traits object type - a record of trait names to their values
 */
type SmithyTraits = Record<string, unknown> | undefined;

/**
 * Collect serialization-relevant trait annotations from a Smithy traits object.
 * This provides a single, reusable function for collecting traits from:
 * - Structure members
 * - List members
 * - Map key/value
 *
 * @param traits - The Smithy traits object
 * @param memberName - Optional. The original Smithy member name. Used for @httpLabel
 *                     to ensure path substitution uses the correct placeholder name
 *                     (URI templates use member names, not encoded property keys).
 *
 * Returns an array of annotation strings like 'T.XmlName("foo")'
 */
function collectSerializationTraits(
  traits: SmithyTraits,
  memberName?: string,
): string[] {
  if (!traits) return [];

  const pipes: string[] = [];

  // smithy.api#httpHeader
  if (traits["smithy.api#httpHeader"] != null) {
    pipes.push(`T.HttpHeader("${traits["smithy.api#httpHeader"]}")`);
  }

  // smithy.api#httpPayload
  if (traits["smithy.api#httpPayload"] != null) {
    pipes.push(`T.HttpPayload()`);
  }

  // smithy.api#httpLabel
  // Always store the original member name for path substitution.
  // The URI template uses the Smithy member name (e.g., {httpMethod}), but after
  // Schema.encode(), the property key may be different (e.g., if JsonName is applied).
  // By always storing the member name, path substitution works correctly regardless
  // of any key transformations.
  if (traits["smithy.api#httpLabel"] != null) {
    if (memberName) {
      pipes.push(`T.HttpLabel("${memberName}")`);
    } else {
      pipes.push(`T.HttpLabel()`);
    }
  }

  // smithy.api#httpQuery
  if (traits["smithy.api#httpQuery"] != null) {
    pipes.push(`T.HttpQuery("${traits["smithy.api#httpQuery"]}")`);
  }

  // smithy.api#httpQueryParams
  if (traits["smithy.api#httpQueryParams"] != null) {
    pipes.push(`T.HttpQueryParams()`);
  }

  // smithy.api#httpPrefixHeaders
  if (traits["smithy.api#httpPrefixHeaders"] != null) {
    pipes.push(
      `T.HttpPrefixHeaders("${traits["smithy.api#httpPrefixHeaders"]}")`,
    );
  }

  // smithy.api#httpResponseCode
  if (traits["smithy.api#httpResponseCode"] != null) {
    pipes.push(`T.HttpResponseCode()`);
  }

  // smithy.api#xmlName
  if (traits["smithy.api#xmlName"] != null) {
    pipes.push(`T.XmlName("${traits["smithy.api#xmlName"]}")`);
  }

  // smithy.api#xmlFlattened
  if (traits["smithy.api#xmlFlattened"] != null) {
    pipes.push(`T.XmlFlattened()`);
  }

  // smithy.api#xmlAttribute
  if (traits["smithy.api#xmlAttribute"] != null) {
    pipes.push(`T.XmlAttribute()`);
  }

  // smithy.api#jsonName
  if (traits["smithy.api#jsonName"] != null) {
    pipes.push(`T.JsonName("${traits["smithy.api#jsonName"]}")`);
  }

  // Note: timestampFormat is NOT handled here - it's applied directly to S.Date
  // in the structure member processing code, since it needs to be on the inner
  // type, not as an outer pipe on optional wrappers.

  // smithy.rules#contextParam
  if (traits["smithy.rules#contextParam"] != null) {
    const contextParam = traits["smithy.rules#contextParam"] as {
      name: string;
    };
    pipes.push(`T.ContextParam("${contextParam.name}")`);
  }

  // smithy.api#hostLabel
  if (traits["smithy.api#hostLabel"] != null) {
    pipes.push(`T.HostLabel()`);
  }

  // aws.protocols#ec2QueryName
  if (traits["aws.protocols#ec2QueryName"] != null) {
    pipes.push(`T.Ec2QueryName("${traits["aws.protocols#ec2QueryName"]}")`);
  }

  // smithy.api#eventPayload - marks member as the event payload
  if (traits["smithy.api#eventPayload"] != null) {
    pipes.push(`T.EventPayload()`);
  }

  // smithy.api#eventHeader - marks member as an event header
  if (traits["smithy.api#eventHeader"] != null) {
    pipes.push(`T.EventHeader()`);
  }

  return pipes;
}

/**
 * Apply collected traits to a schema expression.
 * Returns the schema with .pipe(...traits) appended if there are any traits.
 *
 * @param schema - The schema expression to annotate
 * @param traits - The Smithy traits object
 * @param memberName - Optional. The original Smithy member name. Passed through to
 *                     collectSerializationTraits for httpLabel+jsonName handling.
 * @param identifier - Optional. If provided and traits are applied via .pipe(),
 *                     re-adds the identifier annotation. This is needed because
 *                     .pipe() creates a wrapper schema that doesn't preserve the
 *                     identifier from the inner suspended schema.
 */
function applyTraitsToSchema(
  schema: string,
  traits: SmithyTraits,
  memberName?: string,
  identifier?: string,
): string {
  const pipes = collectSerializationTraits(traits, memberName);
  if (pipes.length > 0) {
    let result = `${schema}.pipe(${pipes.join(", ")})`;
    // Re-apply identifier after .pipe() for suspended schemas (needed for JSONSchema)
    if (identifier) {
      result = `${result}.annotations({ identifier: "${identifier}" })`;
    }
    return result;
  }
  return schema;
}

const findServiceShape = Effect.gen(function* () {
  const model = yield* ModelService;
  const serviceEntry = Object.entries(model.shapes).find(
    ([_, shape]) => shape.type === "service",
  );

  return serviceEntry
    ? (serviceEntry as [string, ServiceShape])
    : yield* Effect.fail(
        new ShapeNotFound({ message: "service shape not found" }),
      );
});

//todo(pear): cache this
function findShape<T extends keyof ShapeTypeMap>(
  shapeId: string,
  type: T,
): Effect.Effect<[string, ShapeTypeMap[T]], ShapeNotFound, ModelService>;
function findShape(
  shapeId: string,
  type?: string,
): Effect.Effect<[string, GenericShape], ShapeNotFound, ModelService>;
function findShape(
  shapeId: string,
  type?: string,
): Effect.Effect<[string, GenericShape], ShapeNotFound, ModelService> {
  const effect = Effect.gen(function* () {
    yield* Effect.logDebug(
      `finding shape: \`${shapeId}\` of type: ${type ?? "any"}`,
    );
    const model = yield* ModelService;
    const entry = Object.entries(model.shapes).find(
      ([id, shape]) =>
        (type == null ? true : shape.type === type) && id === shapeId,
    );

    return entry
      ? (entry as any)
      : yield* Effect.fail(
          new ShapeNotFound({
            message: `unable to find ${type ?? "unknown"}: ${shapeId}`,
          }),
        );
  });

  return effect;
}

//todo(pear): move this to a ref
const aliasMappings: Record<string, string> = {};

function formatName(shapeId: string, lowercase = false) {
  let name = shapeId.split("#")[1] ?? "";
  // Apply alias mappings for reserved names
  name = aliasMappings[name] ?? name;
  if (lowercase) {
    name = name.charAt(0).toLowerCase() + name.slice(1);
  }
  return name;
}

// Helper to sanitize error names by removing dots (e.g., "InvalidVpcID.NotFound" -> "InvalidVpcIDNotFound")
function sanitizeErrorName(name: string): string {
  return name.replace(/\./g, "");
}

// Helper to convert schema expression to TypeScript type for interface generation
// - allStructNames: set of all struct names that have explicit interfaces
// - allArrayNames: set of all array names that have explicit type aliases
// - allMapNames: set of all map names that have explicit type aliases
// - cyclicSchemas: set of cyclic schemas that have explicit type aliases
function schemaExprToTsType(
  schemaExpr: string,
  allStructNames: Set<string>,
  allArrayNames: Set<string>,
  allMapNames: Set<string>,
  cyclicSchemas: Set<string>,
): string {
  // Strip .pipe(...) suffix to get base schema
  const baseExpr = schemaExpr.replace(/\.pipe\([^)]+\)$/, "");

  // Handle base primitive types
  switch (baseExpr) {
    case "S.String":
      return "string";
    case "S.Boolean":
      return "boolean";
    case "S.Number":
      return "number";
    case "S.Date":
      return "Date";
    case "S.Any":
      return "any";
    case "T.StreamBody()":
      return "T.StreamBody";
    case "T.StreamingInput":
      return "T.StreamingInputBody";
    case "T.StreamingOutput":
      return "T.StreamingOutputBody";
    case "T.Blob":
      return "Uint8Array";
    case "SensitiveString":
      return "string | Redacted.Redacted<string>";
    case "SensitiveBlob":
      return "Uint8Array | Redacted.Redacted<Uint8Array>";
    case "S.Struct({})":
      return "Record<string, never>";
  }

  // Handle S.Date.pipe(...) patterns - still a Date
  if (baseExpr.startsWith("S.Date")) {
    return "Date";
  }

  // Handle T.StreamingInput.pipe(...) patterns
  if (baseExpr.startsWith("T.StreamingInput")) {
    return "T.StreamingInputBody";
  }

  // Handle T.StreamingOutput.pipe(...) patterns
  if (baseExpr.startsWith("T.StreamingOutput")) {
    return "T.StreamingOutputBody";
  }

  // Handle T.StreamBody().pipe(...) patterns
  if (baseExpr.startsWith("T.StreamBody")) {
    return "T.StreamBody";
  }

  // Named schemas with explicit type aliases can be used directly:
  // - Structs have interfaces
  // - Arrays and maps have type aliases
  // - Cyclic schemas have type aliases
  if (
    allStructNames.has(baseExpr) ||
    allArrayNames.has(baseExpr) ||
    allMapNames.has(baseExpr) ||
    cyclicSchemas.has(baseExpr)
  ) {
    return baseExpr;
  }

  // For other named schemas (unions), extract type
  return `typeof ${baseExpr}["Type"]`;
}

// Topological sort for schema definitions to ensure dependencies come before dependents
// Handles cycles by treating cyclic schemas specially (they will use S.Class and S.suspend)
function topologicalSortWithCycles(
  schemas: Array<{ name: string; definition: string; deps: string[] }>,
  cyclicSchemas: Set<string>,
): Array<{ name: string; definition: string; deps: string[] }> {
  const schemaMap = new Map(schemas.map((s) => [s.name, s]));
  const visited = new Set<string>();
  const result: Array<{ name: string; definition: string; deps: string[] }> =
    [];

  //todo(pear): rewrite this as an effect
  function visit(name: string) {
    if (visited.has(name)) return;
    visited.add(name);

    const schema = schemaMap.get(name);
    if (schema) {
      // For cyclic schemas, only require non-cyclic dependencies to be visited first
      // Cyclic dependencies will use S.suspend so order among them doesn't matter
      const effectiveDeps = cyclicSchemas.has(name)
        ? schema.deps.filter((dep) => !cyclicSchemas.has(dep))
        : schema.deps;

      for (const dep of effectiveDeps) {
        if (schemaMap.has(dep)) {
          visit(dep);
        }
      }
      result.push(schema);
    }
  }

  // Visit all schemas
  for (const schema of schemas) {
    visit(schema.name);
  }

  return result;
}

//todo(pear): rewrite as effect
// Collect all shape dependencies from the model to compute cycles before generation
function collectShapeDependencies(
  model: SmithyModel,
): Map<string, { deps: string[]; type: string }> {
  const shapeDeps = new Map<string, { deps: string[]; type: string }>();

  for (const [shapeId, shape] of Object.entries(model.shapes)) {
    const name = formatName(shapeId);
    if (!name) continue;

    const deps: string[] = [];

    if (shape.type === "structure") {
      for (const member of Object.values(shape.members)) {
        const depName = formatName(member.target);
        if (depName) deps.push(depName);
      }
    } else if (shape.type === "union") {
      for (const member of Object.values(shape.members)) {
        const depName = formatName(member.target);
        if (depName) deps.push(depName);
      }
    } else if (shape.type === "list") {
      const depName = formatName(shape.member.target);
      if (depName) deps.push(depName);
    } else if (shape.type === "map") {
      const keyName = formatName(shape.key.target);
      const valueName = formatName(shape.value.target);
      if (keyName) deps.push(keyName);
      if (valueName) deps.push(valueName);
    }

    shapeDeps.set(name, { deps, type: shape.type });
  }

  return shapeDeps;
}

//todo(pear): rewrite as effect
// Find all schemas that are part of a cycle using the pre-collected dependencies
function findCyclicSchemasFromDeps(
  shapeDeps: Map<string, { deps: string[]; type: string }>,
): {
  cyclicSchemas: Set<string>;
  cyclicClasses: Set<string>;
  allStructNames: Set<string>;
  allArrayNames: Set<string>;
  allMapNames: Set<string>;
  allUnionNames: Set<string>;
  allSchemaNames: Set<string>;
} {
  const cyclicSchemas = new Set<string>();

  let index = 0;
  const stack: string[] = [];
  const onStack = new Set<string>();
  const indices = new Map<string, number>();
  const lowlinks = new Map<string, number>();

  function strongConnect(name: string) {
    indices.set(name, index);
    lowlinks.set(name, index);
    index++;
    stack.push(name);
    onStack.add(name);

    const shapeInfo = shapeDeps.get(name);
    if (shapeInfo) {
      for (const dep of shapeInfo.deps) {
        if (shapeDeps.has(dep)) {
          if (!indices.has(dep)) {
            strongConnect(dep);
            lowlinks.set(
              name,
              Math.min(lowlinks.get(name)!, lowlinks.get(dep)!),
            );
          } else if (onStack.has(dep)) {
            lowlinks.set(
              name,
              Math.min(lowlinks.get(name)!, indices.get(dep)!),
            );
          }
        }
      }
    }

    if (lowlinks.get(name) === indices.get(name)) {
      const scc: string[] = [];
      let w: string;
      do {
        w = stack.pop()!;
        onStack.delete(w);
        scc.push(w);
      } while (w !== name);

      // If SCC has more than one node, mark all as cyclic
      if (scc.length > 1) {
        for (const node of scc) {
          cyclicSchemas.add(node);
        }
      } else {
        // Check for self-loop
        const info = shapeDeps.get(name);
        if (info && info.deps.includes(name)) {
          cyclicSchemas.add(name);
        }
      }
    }
  }

  for (const name of shapeDeps.keys()) {
    if (!indices.has(name)) {
      strongConnect(name);
    }
  }

  // Determine which cyclic schemas will become classes (structs only)
  const cyclicClasses = new Set<string>();
  // Collect ALL struct names (interfaces can be used directly as types)
  const allStructNames = new Set<string>();
  // Collect ALL array and map names (type aliases can be used directly as types)
  const allArrayNames = new Set<string>();
  const allMapNames = new Set<string>();
  const allUnionNames = new Set<string>();
  // Collect ALL newtype names (type aliases for primitive types like string/number)
  const allNewtypeNames = new Set<string>();
  for (const [name, info] of shapeDeps) {
    if (info.type === "structure") {
      allStructNames.add(name);
      if (cyclicSchemas.has(name)) {
        cyclicClasses.add(name);
      }
    } else if (info.type === "list") {
      allArrayNames.add(name);
    } else if (info.type === "map") {
      allMapNames.add(name);
    } else if (info.type === "union") {
      allUnionNames.add(name);
    } else if (
      info.type === "string" ||
      info.type === "integer" ||
      info.type === "long" ||
      info.type === "double" ||
      info.type === "float"
    ) {
      // These generate type aliases (newtypes) like `type Region = string`
      allNewtypeNames.add(name);
    }
  }

  // Combine all schema names for conflict detection
  const allSchemaNames = new Set<string>([
    ...allStructNames,
    ...allArrayNames,
    ...allMapNames,
    ...allUnionNames,
    ...allNewtypeNames,
  ]);

  return {
    cyclicSchemas,
    cyclicClasses,
    allStructNames,
    allArrayNames,
    allMapNames,
    allUnionNames,
    allSchemaNames,
  };
}

// Error shape traits collected from the model
interface ErrorShapeTraits {
  httpError?: number;
  awsQueryError?: {
    code: string;
    httpResponseCode: number;
  };
  retryable?: {
    throttling?: boolean;
  };
}

//todo(pear): is this redundant over error in the file
// Collect all error shape IDs from operation definitions, along with their error traits
function collectErrorShapeIds(
  model: SmithyModel,
): Map<string, ErrorShapeTraits> {
  const errorShapeIds = new Map<string, ErrorShapeTraits>();

  for (const [shapeId, shape] of Object.entries(model.shapes)) {
    if (shape.type === "operation" && shape.errors) {
      for (const error of shape.errors) {
        const errorShape = model.shapes[error.target];
        const httpError = errorShape?.traits?.["smithy.api#httpError"] as
          | number
          | undefined;
        const awsQueryError = errorShape?.traits?.[
          "aws.protocols#awsQueryError"
        ] as { code: string; httpResponseCode: number } | undefined;
        const retryable = errorShape?.traits?.["smithy.api#retryable"] as
          | { throttling?: boolean }
          | undefined;
        errorShapeIds.set(error.target, {
          httpError,
          awsQueryError,
          retryable,
        });
      }
    }
  }

  return errorShapeIds;
}

// Operation traits collected for input schemas
interface OperationInputTraits {
  method: string;
  uri: string;
  httpChecksum?: {
    requestAlgorithmMember?: string;
    requestChecksumRequired?: boolean;
    responseAlgorithms?: string[];
  };
  httpChecksumRequired?: boolean;
  staticContextParams?: Record<string, { value: unknown }>;
}

// Collect operation traits for input schemas
function collectOperationInputTraits(
  model: SmithyModel,
): Map<string, OperationInputTraits> {
  const inputTraits = new Map<string, OperationInputTraits>();

  for (const [_shapeId, shape] of Object.entries(model.shapes)) {
    if (shape.type === "operation" && shape.input) {
      const httpTrait = (shape.traits?.["smithy.api#http"] as {
        method?: string;
        uri?: string;
      }) ?? {
        method: "POST",
        uri: "/",
      };
      const httpChecksumTrait = shape.traits?.["aws.protocols#httpChecksum"] as
        | {
            requestAlgorithmMember?: string;
            requestChecksumRequired?: boolean;
            responseAlgorithms?: string[];
          }
        | undefined;
      const staticContextParamsTrait = shape.traits?.[
        "smithy.rules#staticContextParams"
      ] as Record<string, { value: unknown }> | undefined;

      const inputName = formatName(shape.input.target);
      inputTraits.set(inputName, {
        method: httpTrait.method ?? "POST",
        uri: httpTrait.uri ?? "/",
        httpChecksum: httpChecksumTrait,
        staticContextParams: staticContextParamsTrait,
      });
    }
  }

  return inputTraits;
}

interface OperationOutputTraits {
  s3UnwrappedXmlOutput?: boolean;
}

// Collect operation output schema names and their traits
function collectOperationOutputTraits(
  model: SmithyModel,
): Map<string, OperationOutputTraits> {
  const outputTraits = new Map<string, OperationOutputTraits>();

  for (const [_shapeId, shape] of Object.entries(model.shapes)) {
    if (shape.type === "operation" && shape.output) {
      const outputName = formatName(shape.output.target);
      const s3UnwrappedXmlOutput =
        shape.traits?.["aws.customizations#s3UnwrappedXmlOutput"] != null;

      outputTraits.set(outputName, {
        s3UnwrappedXmlOutput: s3UnwrappedXmlOutput || undefined,
      });
    }
  }

  return outputTraits;
}

// Collect event stream shape IDs that are used as input vs output
// This traverses operation input/output shapes to find streaming union members
function collectInputEventStreamShapeIds(model: SmithyModel): Set<string> {
  const inputEventStreams = new Set<string>();

  for (const [_shapeId, shape] of Object.entries(model.shapes)) {
    if (shape.type === "operation" && shape.input) {
      // Get the input shape
      const inputShape = model.shapes[shape.input.target];
      if (inputShape?.type === "structure" && inputShape.members) {
        // Look for streaming union members in the input
        for (const member of Object.values(inputShape.members)) {
          const memberTarget = member.target;
          const memberShape = model.shapes[memberTarget];
          if (
            memberShape?.type === "union" &&
            memberShape.traits?.["smithy.api#streaming"]
          ) {
            inputEventStreams.add(memberTarget);
          }
        }
      }
    }
  }

  return inputEventStreams;
}

// Collect shape IDs that have the @sensitive trait
function collectSensitiveShapeIds(model: SmithyModel): Set<string> {
  const sensitiveShapeIds = new Set<string>();
  for (const [shapeId, shape] of Object.entries(model.shapes)) {
    if (shape.traits?.["smithy.api#sensitive"]) {
      sensitiveShapeIds.add(shapeId);
    }
  }
  return sensitiveShapeIds;
}

const convertShapeToSchema: (
  args_0: string,
) => Effect.Effect<
  Deferred.Deferred<string, never>,
  UnableToTransformShapeToSchema | ShapeNotFound,
  ModelService | SdkFile
> = Effect.fn(function* (target: string) {
  const sdkFile = yield* SdkFile;
  const cachedResult = Option.getOrNull(
    MutableHashMap.get(sdkFile.map, target),
  );
  const deferredValue = yield* Deferred.make<string, never>();
  if (cachedResult != null) {
    return cachedResult;
  } else {
    MutableHashMap.set(sdkFile.map, target, deferredValue);
  }

  //todo(pear): this is stupid
  // Helper to get the schema name for this target
  const getSchemaName = () => formatName(target);

  const addAlias = Effect.fn(function* (
    definitionEffect: Effect.Effect<
      string,
      ShapeNotFound | UnableToTransformShapeToSchema,
      ModelService | SdkFile
    >,
    deps: string[],
  ) {
    const tsName = getSchemaName();
    yield* Deferred.succeed(deferredValue, tsName);
    const definition = yield* definitionEffect;

    yield* Ref.update(sdkFile.schemas, (arr) => [
      ...arr,
      { name: tsName, definition, deps },
    ]);
    return tsName;
  });

  const result = yield* Effect.if(target.startsWith("smithy.api"), {
    onTrue: () =>
      Match.value(target).pipe(
        Match.when(
          (s) => s === "smithy.api#String",
          () => Effect.succeed("S.String"),
        ),
        Match.when(
          (s) =>
            s === "smithy.api#Integer" ||
            s === "smithy.api#Double" ||
            s === "smithy.api#Long" ||
            s === "smithy.api#Float" ||
            s === "smithy.api#PrimitiveLong",
          () => Effect.succeed("S.Number"),
        ),
        Match.when(
          (s) =>
            s === "smithy.api#Boolean" || s === "smithy.api#PrimitiveBoolean",
          () => Effect.succeed("S.Boolean"),
        ),
        Match.when(
          (s) => s === "smithy.api#Timestamp",
          () =>
            Effect.gen(function* () {
              const sdkFile = yield* SdkFile;
              // Use epoch-seconds for restJson1 and awsJson1_0/1_1, otherwise standard S.Date
              if (
                sdkFile.serviceTraits.protocol === "aws.protocols#restJson1" ||
                sdkFile.serviceTraits.protocol === "aws.protocols#awsJson1_0" ||
                sdkFile.serviceTraits.protocol === "aws.protocols#awsJson1_1"
              ) {
                return `S.Date.pipe(T.TimestampFormat("epoch-seconds"))`;
              }
              return "S.Date";
            }),
        ),
        Match.when(
          (s) => s === "smithy.api#Blob",
          // Primitive blob - not streaming, so use base64 encoded Blob type
          () => Effect.succeed("T.Blob"),
        ),
        Match.when(
          //todo(pear): should this be S.Never?
          (s) => s === "smithy.api#Unit",
          () => Effect.succeed("S.Struct({})"),
        ),
        Match.when(
          (s) => s === "smithy.api#Document",
          // TODO(sam): should we add our own JsonValue schema to handle documents? What are Documents?
          () => Effect.succeed("S.Any"),
        ),
        Match.orElse(() =>
          Effect.fail(
            new UnableToTransformShapeToSchema({
              message: `type ${target}`,
            }),
          ),
        ),
      ),
    onFalse: () =>
      Effect.gen(function* () {
        const [targetShapeId, targetShape] = yield* findShape(target);
        return yield* Match.value(targetShape).pipe(
          Match.when(
            (s) =>
              s.type === "integer" ||
              s.type === "long" ||
              s.type === "double" ||
              s.type === "float",
            () =>
              Effect.gen(function* () {
                // Track this as a newtype (e.g., type Count = number)
                // Only for non-Smithy primitives (service-defined newtypes)
                if (!targetShapeId.startsWith("smithy.api#")) {
                  const sdkFile = yield* SdkFile;
                  const name = formatName(targetShapeId);
                  yield* Ref.update(sdkFile.newtypes, (m) =>
                    new Map(m).set(name, "number"),
                  );
                }
                return "S.Number";
              }),
          ),
          Match.when(
            (s) => s.type === "string",
            () =>
              Effect.gen(function* () {
                // Track this as a newtype (e.g., type PhoneNumber = string)
                // Only for non-Smithy primitives (service-defined newtypes)
                if (!targetShapeId.startsWith("smithy.api#")) {
                  const sdkFile = yield* SdkFile;
                  const name = formatName(targetShapeId);
                  // Check if this shape has @sensitive trait
                  const isSensitive =
                    sdkFile.sensitiveShapeIds.has(targetShapeId);
                  yield* Ref.update(sdkFile.newtypes, (m) =>
                    new Map(m).set(
                      name,
                      isSensitive
                        ? "string | Redacted.Redacted<string>"
                        : "string",
                    ),
                  );
                  if (isSensitive) {
                    return "SensitiveString";
                  }
                }
                return "S.String";
              }),
          ),
          Match.when(
            (s) => s.type === "blob",
            (s) =>
              Effect.gen(function* () {
                // Check for @streaming trait
                if (s.traits?.["smithy.api#streaming"] != null) {
                  // Streaming blob - used for large payloads like S3 objects
                  // NOTE: Context-specific types (StreamingInput/StreamingOutput) are
                  // handled at the member level. This fallback is for direct references.
                  // Check for @requiresLength trait - indicates Content-Length is required
                  if (s.traits?.["smithy.api#requiresLength"] != null) {
                    return "T.StreamBody().pipe(T.RequiresLength())";
                  }
                  return "T.StreamBody()";
                }
                // Non-streaming blob - base64 encoded in body
                // Check if this shape has @sensitive trait
                const sdkFile = yield* SdkFile;
                const isSensitive =
                  sdkFile.sensitiveShapeIds.has(targetShapeId);
                if (isSensitive) {
                  return "SensitiveBlob";
                }
                return "T.Blob";
              }),
          ),
          Match.when(
            (s) => s.type === "boolean",
            () => Effect.succeed("S.Boolean"),
          ),
          Match.when(
            (s) => s.type === "timestamp",
            (s) =>
              Effect.gen(function* () {
                const sdkFile = yield* SdkFile;
                // Check for timestampFormat trait on the timestamp shape itself
                const format = s.traits?.["smithy.api#timestampFormat"] as
                  | string
                  | undefined;
                if (format) {
                  return `S.Date.pipe(T.TimestampFormat("${format}"))`;
                }
                // Default based on protocol
                if (
                  sdkFile.serviceTraits.protocol ===
                    "aws.protocols#restJson1" ||
                  sdkFile.serviceTraits.protocol ===
                    "aws.protocols#awsJson1_0" ||
                  sdkFile.serviceTraits.protocol === "aws.protocols#awsJson1_1"
                ) {
                  return `S.Date.pipe(T.TimestampFormat("epoch-seconds"))`;
                }
                // aws-query and ec2-query use date-time (ISO 8601) by default
                if (
                  sdkFile.serviceTraits.protocol === "aws.protocols#awsQuery" ||
                  sdkFile.serviceTraits.protocol === "aws.protocols#ec2Query"
                ) {
                  return `S.Date.pipe(T.TimestampFormat("date-time"))`;
                }
                return "S.Date";
              }),
          ),
          Match.when(
            (s) => s.type === "document",
            // TODO(sam): should we add our own JsonValue schema to handle documents? What are Documents?
            () => Effect.succeed("S.Any"),
          ),
          Match.when(
            (s) => s.type === "enum",
            (s) =>
              Effect.succeed(
                Object.values(s.members).map(
                  ({ traits }) =>
                    `S.Literal("${traits["smithy.api#enumValue"]}")`,
                ),
                //todo(pear): figure our a more typesafe way of doing this
                // ).pipe(Effect.map((members) => `S.Union(${members.join(", ")})`)),
              ).pipe(Effect.map(() => `S.String`)),
          ),
          Match.when(
            (s) => s.type === "intEnum",
            (s) =>
              Effect.succeed(
                Object.values(s.members).map(
                  ({ traits }) =>
                    `S.Literal("${traits["smithy.api#enumValue"]}")`,
                ),
                //todo(pear): figure our a more typesafe way of doing this
                // ).pipe(Effect.map((members) => `S.Union(${members.join(", ")})`)),
              ).pipe(Effect.map(() => `S.Number`)),
          ),
          Match.when(
            (s) => s.type === "list",
            (s) => {
              const memberName = formatName(s.member.target);
              const schemaName = getSchemaName();
              const isCyclic = sdkFile.cyclicSchemas.has(schemaName);
              const isMemberErrorShape = sdkFile.errorShapeIds.has(
                s.member.target,
              );
              // Check for @sparse trait on the list
              const isSparse = s.traits?.["smithy.api#sparse"] != null;
              return addAlias(
                convertShapeToSchema(s.member.target).pipe(
                  Effect.flatMap(Deferred.await),
                  Effect.map((type) => {
                    //todo(pear): rewrite this in a more effectful way
                    // Wrap error shape references in S.suspend (they're defined after schemas)
                    // Add identifier annotation for JSONSchema generation
                    let innerType = type;
                    if (isMemberErrorShape) {
                      innerType = `S.suspend(() => ${type}).annotations({ identifier: "${type}" })`;
                    }
                    // Wrap cyclic references in S.suspend with identifier for JSONSchema
                    else if (sdkFile.cyclicSchemas.has(memberName)) {
                      innerType = sdkFile.cyclicClasses.has(memberName)
                        ? // TODO(sam): I had to add the any here because encoded type was creting circular errors. hopefully OK since we don't really need it
                          `S.suspend((): S.Schema<${type}, any> => ${type}).annotations({ identifier: "${type}" })`
                        : `S.suspend(() => ${type}).annotations({ identifier: "${type}" })`;
                    }

                    // Apply serialization traits (xmlName, timestampFormat, etc.) using unified function
                    // Pass identifier for struct schemas so it's preserved after .pipe()
                    innerType = applyTraitsToSchema(
                      innerType,
                      s.member.traits,
                      undefined,
                      sdkFile.allStructNames.has(memberName)
                        ? memberName
                        : undefined,
                    );

                    // Build the array schema with optional sparse annotation
                    const sparsePipe = isSparse ? ".pipe(T.Sparse())" : "";

                    // Always generate explicit type alias for arrays
                    const memberTsType = schemaExprToTsType(
                      type,
                      sdkFile.allStructNames,
                      sdkFile.allArrayNames,
                      sdkFile.allMapNames,
                      sdkFile.cyclicSchemas,
                    );
                    const typeAlias = `export type ${schemaName} = ${memberTsType}[];`;
                    const schemaDef = isCyclic
                      ? `export const ${schemaName} = S.Array(${innerType})${sparsePipe} as any as S.Schema<${schemaName}>;`
                      : `export const ${schemaName} = S.Array(${innerType})${sparsePipe};`;
                    return `${typeAlias}\n${schemaDef}`;
                  }),
                ),
                [memberName],
              );
            },
          ),
          Match.when(
            (s) => s.type === "structure",
            (s) => {
              const memberTargets = Object.values(s.members).map((m) =>
                formatName(m.target),
              );
              const currentSchemaName = getSchemaName();
              const isCurrentCyclic =
                sdkFile.cyclicSchemas.has(currentSchemaName);
              const isErrorShape = sdkFile.errorShapeIds.has(target);

              // Check if this structure is an operation input or output FIRST (needed for member processing)
              const opTraits =
                sdkFile.operationInputTraits.get(currentSchemaName);
              const isOperationInput = opTraits !== undefined;
              const opOutputTraits =
                sdkFile.operationOutputTraits.get(currentSchemaName);
              const isOperationOutput = opOutputTraits !== undefined;

              // Member info type for generating both interface and schema
              interface MemberInfo {
                name: string;
                schemaExpr: string;
                tsType: string;
                isOptional: boolean;
              }

              const membersEffect = Effect.all(
                Object.entries(s.members).map(([memberName, member]) =>
                  Effect.gen(function* () {
                    const memberTargetName = formatName(member.target);
                    const isMemberErrorShape = sdkFile.errorShapeIds.has(
                      member.target,
                    );

                    // Check if this member has HTTP binding traits that affect timestamp format
                    const hasHttpHeader =
                      member.traits?.["smithy.api#httpHeader"] != null;
                    const hasHttpPayload =
                      member.traits?.["smithy.api#httpPayload"] != null;
                    const explicitFormat = member.traits?.[
                      "smithy.api#timestampFormat"
                    ] as string | undefined;

                    // Check if member target is a blob or event stream - streaming types need special handling
                    const model = yield* ModelService;
                    const memberTargetShape = model.shapes[member.target] as
                      | GenericShape
                      | undefined;
                    const isBlob = memberTargetShape?.type === "blob";
                    const isStreamingBlob =
                      isBlob &&
                      memberTargetShape?.traits?.["smithy.api#streaming"] !=
                        null;
                    // Check for @requiresLength trait - indicates Content-Length is required
                    const hasRequiresLength =
                      memberTargetShape?.traits?.[
                        "smithy.api#requiresLength"
                      ] != null;
                    // Non-streaming blob with httpPayload should also use raw bytes (not base64)
                    const isBlobPayload =
                      isBlob && hasHttpPayload && !isStreamingBlob;
                    // Check if member target is an event stream (streaming union)
                    const isEventStream =
                      memberTargetShape?.type === "union" &&
                      memberTargetShape?.traits?.["smithy.api#streaming"] !=
                        null;

                    let baseSchema: string;
                    let baseTsType: string;
                    if (isStreamingBlob || isBlobPayload) {
                      // Use different schema based on input vs output context
                      // Both streaming blobs and httpPayload blobs need raw bytes (not base64)
                      if (isOperationOutput) {
                        baseSchema = "T.StreamingOutput";
                        baseTsType = "T.StreamingOutputBody";
                      } else if (isOperationInput) {
                        // Add RequiresLength trait if present on the target shape
                        baseSchema = hasRequiresLength
                          ? "T.StreamingInput.pipe(T.RequiresLength())"
                          : "T.StreamingInput";
                        baseTsType = "T.StreamingInputBody";
                      } else {
                        // Nested structure - fallback to general StreamBody
                        baseSchema = hasRequiresLength
                          ? "T.StreamBody().pipe(T.RequiresLength())"
                          : "T.StreamBody()";
                        baseTsType = "T.StreamBody";
                      }
                    } else if (isEventStream) {
                      // Event stream member - get the union schema and note it's a stream
                      // The actual schema is the union type, but we need to wrap it for
                      // proper stream handling in the API
                      baseSchema = yield* convertShapeToSchema(
                        member.target,
                      ).pipe(Effect.flatMap(Deferred.await));
                      baseTsType = schemaExprToTsType(
                        baseSchema,
                        sdkFile.allStructNames,
                        sdkFile.allArrayNames,
                        sdkFile.allMapNames,
                        sdkFile.cyclicSchemas,
                      );
                      // Add httpPayload annotation since event streams are the body
                      if (!hasHttpPayload) {
                        // Event stream members implicitly act as httpPayload
                      }
                    } else {
                      baseSchema = yield* convertShapeToSchema(
                        member.target,
                      ).pipe(Effect.flatMap(Deferred.await));
                      baseTsType = schemaExprToTsType(
                        baseSchema,
                        sdkFile.allStructNames,
                        sdkFile.allArrayNames,
                        sdkFile.allMapNames,
                        sdkFile.cyclicSchemas,
                      );
                    }

                    let schema = baseSchema;
                    let tsType = baseTsType;

                    // Check if base schema is a timestamp (contains S.Date or TimestampFormat)
                    const isTimestampSchema =
                      baseSchema.includes("S.Date") ||
                      baseSchema.includes("TimestampFormat") ||
                      member.target === "smithy.api#Timestamp";

                    // Override timestamp schema for HTTP header bindings
                    if (isTimestampSchema && hasHttpHeader && !explicitFormat) {
                      // HTTP headers default to http-date format
                      schema = `S.Date.pipe(T.TimestampFormat("http-date"))`;
                      tsType = "Date";
                    } else if (isTimestampSchema && explicitFormat) {
                      // Explicit format on member overrides target
                      schema = `S.Date.pipe(T.TimestampFormat("${explicitFormat}"))`;
                      tsType = "Date";
                    }

                    // Wrap error shape references in S.suspend (they're defined after schemas)
                    // Add identifier annotation for JSONSchema generation
                    if (isMemberErrorShape) {
                      schema = `S.suspend(() => ${schema}).annotations({ identifier: "${schema}" })`;
                    }
                    // Wrap cyclic references in S.suspend with identifier for JSONSchema (only if current schema is also cyclic)
                    else if (
                      isCurrentCyclic &&
                      sdkFile.cyclicSchemas.has(memberTargetName)
                    ) {
                      if (sdkFile.cyclicClasses.has(memberTargetName)) {
                        // TODO(sam): I had to add the any here because encoded type was creting circular errors. hopefully OK since we don't really need it
                        schema = `S.suspend((): S.Schema<${schema}, any> => ${schema}).annotations({ identifier: "${schema}" })`;
                      } else {
                        schema = `S.suspend(() => ${schema}).annotations({ identifier: "${schema}" })`;
                      }
                    }

                    // Determine if optional - Check for member override from spec patches first
                    const structureOverride =
                      sdkFile.serviceSpec.structures?.[currentSchemaName];
                    const memberOverride =
                      structureOverride?.members?.[memberName];
                    // Override takes precedence, then fall back to Smithy model
                    const isOptional =
                      memberOverride?.optional ??
                      member.traits?.["smithy.api#required"] == null;
                    if (isOptional) {
                      schema = `S.optional(${schema})`;
                    }

                    // Apply serialization traits using unified function
                    // Pass memberName so httpLabel can use it for path substitution when jsonName differs
                    // Pass identifier for struct schemas so it's preserved after .pipe()
                    schema = applyTraitsToSchema(
                      schema,
                      member.traits,
                      memberName,
                      sdkFile.allStructNames.has(memberTargetName)
                        ? memberTargetName
                        : undefined,
                    );

                    return {
                      name: memberName,
                      schemaExpr: schema,
                      tsType,
                      isOptional,
                    };
                  }),
                ),
                { concurrency: "unbounded" },
              );

              // For error shapes, store the fields separately and don't generate a class
              if (isErrorShape) {
                return Effect.gen(function* () {
                  const tsName = currentSchemaName;
                  const members = yield* membersEffect;
                  // Build schema fields from member info
                  const schemaFields = members
                    .map((m) => `${m.name}: ${m.schemaExpr}`)
                    .join(", ");
                  const fields = `{${schemaFields}}`;
                  // Store the fields for later use in TaggedError generation
                  yield* Ref.update(sdkFile.errorFields, (map) => {
                    map.set(tsName, fields);
                    return map;
                  });
                  // Succeed the deferred AFTER storing fields, so addError can access them
                  yield* Deferred.succeed(deferredValue, tsName);
                  return tsName;
                });
              }

              // Check for xmlName trait on the structure (class-level annotation)
              const xmlName = s.traits?.["smithy.api#xmlName"] as
                | string
                | undefined;
              // Check for structure-level xmlNamespace (overrides service-level)
              const structXmlNamespace = s.traits?.[
                "smithy.api#xmlNamespace"
              ] as { uri: string } | undefined;

              // Only apply service-level namespace to operation input/output schemas, not nested structures
              const xmlNamespaceRef = structXmlNamespace
                ? `T.XmlNamespace("${structXmlNamespace.uri}")`
                : sdkFile.serviceXmlNamespace &&
                    (isOperationInput || isOperationOutput)
                  ? "ns"
                  : undefined;

              return addAlias(
                membersEffect.pipe(
                  Effect.map((members) => {
                    // Build interface fields: name?: Type
                    const interfaceFields = members
                      .map(
                        (m) =>
                          `${m.name}${m.isOptional ? "?" : ""}: ${m.tsType}`,
                      )
                      .join("; ");

                    // Build schema struct fields: name: schemaExpr
                    const schemaFields = members
                      .map((m) => `${m.name}: ${m.schemaExpr}`)
                      .join(", ");

                    // Build annotations array
                    const classAnnotations: string[] = [];
                    if (xmlName) {
                      classAnnotations.push(`T.XmlName("${xmlName}")`);
                    }
                    if (xmlNamespaceRef) {
                      classAnnotations.push(xmlNamespaceRef);
                    }
                    // Add operation-level annotations for request schemas
                    if (isOperationInput) {
                      // Add HTTP trait (method, uri)
                      classAnnotations.push(
                        `T.Http({ method: "${opTraits.method}", uri: "${opTraits.uri}" })`,
                      );
                      // Add service-level traits using pre-defined constants
                      classAnnotations.push("svc");
                      classAnnotations.push("auth");
                      classAnnotations.push("proto");
                      classAnnotations.push("ver");
                      // Add endpoint rule set if available
                      if (sdkFile.endpointRuleSet) {
                        classAnnotations.push("rules");
                      }
                      // Add httpChecksum trait if present
                      if (opTraits.httpChecksum) {
                        const checksumParts: string[] = [];
                        if (opTraits.httpChecksum.requestAlgorithmMember) {
                          checksumParts.push(
                            `requestAlgorithmMember: "${opTraits.httpChecksum.requestAlgorithmMember}"`,
                          );
                        }
                        if (opTraits.httpChecksum.requestChecksumRequired) {
                          checksumParts.push(`requestChecksumRequired: true`);
                        }
                        if (opTraits.httpChecksum.responseAlgorithms) {
                          checksumParts.push(
                            `responseAlgorithms: [${opTraits.httpChecksum.responseAlgorithms.map((a) => `"${a}"`).join(", ")}]`,
                          );
                        }
                        classAnnotations.push(
                          `T.AwsProtocolsHttpChecksum({ ${checksumParts.join(", ")} })`,
                        );
                      }
                      // Add staticContextParams trait if present
                      if (opTraits.staticContextParams) {
                        classAnnotations.push(
                          `T.StaticContextParams(${JSON.stringify(opTraits.staticContextParams)})`,
                        );
                      }
                    }
                    // Add operation-level annotations for response schemas
                    if (isOperationOutput && opOutputTraits) {
                      // Add S3UnwrappedXmlOutput trait if present
                      if (opOutputTraits.s3UnwrappedXmlOutput) {
                        classAnnotations.push("T.S3UnwrappedXmlOutput()");
                      }
                    }

                    // Build annotation pipe for schema - trait annotations go inside the suspend closure,
                    // but identifier goes OUTSIDE on the suspend itself for JSON Schema generation
                    let innerPipe = "";
                    if (classAnnotations.length === 1) {
                      innerPipe = `.pipe(${classAnnotations[0]})`;
                    } else if (classAnnotations.length > 1) {
                      innerPipe = `.pipe(T.all(${classAnnotations.join(", ")}))`;
                    }
                    // identifier annotation must be on the suspend, not inside it, for JSONSchema.make() to work
                    const outerAnnotation = `.annotations({ identifier: "${currentSchemaName}" })`;

                    // Generate interface + suspend(struct) pattern
                    // Trait annotations inside suspend, identifier outside
                    const interfaceDef = `export interface ${currentSchemaName} { ${interfaceFields} }`;
                    const schemaDef = `export const ${currentSchemaName} = S.suspend(() => S.Struct({${schemaFields}})${innerPipe})${outerAnnotation} as any as S.Schema<${currentSchemaName}>;`;

                    return `${interfaceDef}\n${schemaDef}`;
                  }),
                ),
                memberTargets,
              );
            },
          ),
          Match.when(
            (s) => s.type === "union",
            (s) => {
              const memberTargets = Object.values(s.members).map((m) =>
                formatName(m.target),
              );
              const schemaName = getSchemaName();
              const isCurrentCyclic = sdkFile.cyclicSchemas.has(schemaName);
              // Check if this is a streaming union (event stream)
              const isEventStream = s.traits?.["smithy.api#streaming"] != null;

              return addAlias(
                Effect.all(
                  Object.entries(s.members).map(([memberName, member]) => {
                    const memberTargetName = formatName(member.target);
                    const isMemberErrorShape = sdkFile.errorShapeIds.has(
                      member.target,
                    );
                    return convertShapeToSchema(member.target).pipe(
                      Effect.flatMap(Deferred.await),
                      Effect.map((schema) => {
                        // Track both raw schema (for type alias) and wrapped schema (for schema definition)
                        let wrappedSchema = schema;
                        // Wrap error shape references in S.suspend (they're defined after schemas)
                        // Add identifier annotation for JSONSchema generation
                        if (isMemberErrorShape) {
                          wrappedSchema = `S.suspend(() => ${schema}).annotations({ identifier: "${schema}" })`;
                        }
                        // Wrap cyclic references in S.suspend with identifier for JSONSchema
                        else if (
                          isCurrentCyclic &&
                          sdkFile.cyclicSchemas.has(memberTargetName)
                        ) {
                          if (sdkFile.cyclicClasses.has(memberTargetName)) {
                            // TODO(sam): I had to add the any here because encoded type was creting circular errors. hopefully OK since we don't really need it
                            wrappedSchema = `S.suspend((): S.Schema<${schema}, any> => ${schema}).annotations({ identifier: "${schema}" })`;
                          } else {
                            wrappedSchema = `S.suspend(() => ${schema}).annotations({ identifier: "${schema}" })`;
                          }
                        }

                        // Apply serialization traits (jsonName, xmlName, etc.) to the inner schema
                        // Pass identifier for struct schemas so it's preserved after .pipe()
                        wrappedSchema = applyTraitsToSchema(
                          wrappedSchema,
                          member.traits,
                          undefined,
                          sdkFile.allStructNames.has(memberTargetName)
                            ? memberTargetName
                            : undefined,
                        );

                        // Wrap in a struct with the member name as the key (Smithy unions are tagged)
                        const structWrapped = `S.Struct({ ${memberName}: ${wrappedSchema} })`;

                        return {
                          name: memberName,
                          raw: schema,
                          wrapped: structWrapped,
                          isError: isMemberErrorShape,
                        };
                      }),
                    );
                  }),
                  { concurrency: "unbounded" },
                ).pipe(
                  Effect.flatMap((members) =>
                    Effect.gen(function* () {
                      const sdkFile = yield* SdkFile;
                      const wrappedMembers = members.map((m) => m.wrapped);

                      // Event stream unions use T.EventStream() or T.InputEventStream() based on direction
                      if (isEventStream) {
                        // Check if this is an input event stream by checking the original shape target
                        const isInputEventStream =
                          sdkFile.inputEventStreamShapeIds.has(target);
                        if (isInputEventStream) {
                          return `export const ${schemaName} = T.InputEventStream(S.Union(${wrappedMembers.join(", ")}));`;
                        }
                        return `export const ${schemaName} = T.EventStream(S.Union(${wrappedMembers.join(", ")}));`;
                      }

                      // Generate explicit type alias for unions (needed for pagination item types)
                      // Each member is now a struct { memberName: type }, so the TS types need to reflect that
                      const memberTsTypes = members.map((m) => {
                        const innerType = schemaExprToTsType(
                          m.raw,
                          sdkFile.allStructNames,
                          sdkFile.allArrayNames,
                          sdkFile.allMapNames,
                          sdkFile.cyclicSchemas,
                        );
                        return `{ ${m.name}: ${innerType} }`;
                      });
                      const typeAlias = `export type ${schemaName} = ${memberTsTypes.join(" | ")};`;

                      if (isCurrentCyclic) {
                        return `${typeAlias}\nexport const ${schemaName} = S.Union(${wrappedMembers.join(", ")}) as any as S.Schema<${schemaName}>;`;
                      }

                      return `${typeAlias}\nexport const ${schemaName} = S.Union(${wrappedMembers.join(", ")});`;
                    }),
                  ),
                ),
                memberTargets,
              );
            },
          ),
          Match.when(
            (s) => s.type === "map",
            (s) => {
              const schemaName = getSchemaName();
              const isCyclic = sdkFile.cyclicSchemas.has(schemaName);
              const keyTargetName = formatName(s.key.target);
              const valueTargetName = formatName(s.value.target);
              const isKeyErrorShape = sdkFile.errorShapeIds.has(s.key.target);
              const isValueErrorShape = sdkFile.errorShapeIds.has(
                s.value.target,
              );
              // Check for @sparse trait on the map
              const isSparse = s.traits?.["smithy.api#sparse"] != null;
              return addAlias(
                Effect.all(
                  [
                    convertShapeToSchema(s.key.target).pipe(
                      Effect.flatMap(Deferred.await),
                    ),
                    convertShapeToSchema(s.value.target).pipe(
                      Effect.flatMap(Deferred.await),
                    ),
                  ],
                  { concurrency: "unbounded" },
                ).pipe(
                  Effect.map(([keySchema, valueSchema]) => {
                    // S.Record keys cannot be transformation schemas, so strip sensitive wrappers
                    // Map keys with @sensitive will use plain string (sensitive trait is for logging, not type safety on keys)
                    let wrappedKey =
                      keySchema === "SensitiveString"
                        ? "S.String"
                        : keySchema === "SensitiveBlob"
                          ? "T.Blob"
                          : keySchema;
                    let wrappedValue = valueSchema;

                    if (isKeyErrorShape) {
                      wrappedKey = `S.suspend(() => ${keySchema}).annotations({ identifier: "${keySchema}" })`;
                    } else if (sdkFile.cyclicSchemas.has(keyTargetName)) {
                      wrappedKey = sdkFile.cyclicClasses.has(keyTargetName)
                        ? `S.suspend((): S.Schema<${keySchema}, any> => ${keySchema}).annotations({ identifier: "${keySchema}" })`
                        : `S.suspend(() => ${keySchema}).annotations({ identifier: "${keySchema}" })`;
                    }

                    if (isValueErrorShape) {
                      wrappedValue = `S.suspend(() => ${valueSchema}).annotations({ identifier: "${valueSchema}" })`;
                    } else if (sdkFile.cyclicSchemas.has(valueTargetName)) {
                      wrappedValue = sdkFile.cyclicClasses.has(valueTargetName)
                        ? `S.suspend((): S.Schema<${valueSchema}, any> => ${valueSchema}).annotations({ identifier: "${valueSchema}" })`
                        : `S.suspend(() => ${valueSchema}).annotations({ identifier: "${valueSchema}" })`;
                    }

                    // Apply serialization traits (xmlName, etc.) using unified function
                    // Pass identifier for struct schemas so it's preserved after .pipe()
                    wrappedKey = applyTraitsToSchema(
                      wrappedKey,
                      s.key.traits,
                      undefined,
                      sdkFile.allStructNames.has(keyTargetName)
                        ? keyTargetName
                        : undefined,
                    );
                    wrappedValue = applyTraitsToSchema(
                      wrappedValue,
                      s.value.traits,
                      undefined,
                      sdkFile.allStructNames.has(valueTargetName)
                        ? valueTargetName
                        : undefined,
                    );

                    // Build the record schema with optional sparse annotation
                    const sparsePipe = isSparse ? ".pipe(T.Sparse())" : "";

                    // Always generate explicit type alias for records/maps
                    // Use index signature syntax to avoid conflicts with local Record schema
                    const valueTsType = schemaExprToTsType(
                      valueSchema,
                      sdkFile.allStructNames,
                      sdkFile.allArrayNames,
                      sdkFile.allMapNames,
                      sdkFile.cyclicSchemas,
                    );
                    const typeAlias = `export type ${schemaName} = { [key: string]: ${valueTsType} };`;
                    const schemaDef = isCyclic
                      ? `export const ${schemaName} = S.Record({key: ${wrappedKey}, value: ${wrappedValue}})${sparsePipe} as any as S.Schema<${schemaName}>;`
                      : `export const ${schemaName} = S.Record({key: ${wrappedKey}, value: ${wrappedValue}})${sparsePipe};`;
                    return `${typeAlias}\n${schemaDef}`;
                  }),
                ),
                [keyTargetName, valueTargetName],
              );
            },
          ),
          Match.orElse((s) =>
            Effect.fail(
              new UnableToTransformShapeToSchema({
                message: `type ${s.type} at ${targetShapeId}`,
              }),
            ),
          ),
          // Match.orElse(() => Effect.succeed("$$TEMP_SCHEMA")),
          // Match.exhaustive,
        );
      }),
  });

  yield* Deferred.succeed(deferredValue, result);
  yield* Effect.logDebug(`Converted shape: \`${target}\` to ${result}`);
  return deferredValue;
});

const addError = Effect.fn(function* (error: {
  name: string;
  shapeId: string;
}) {
  const sdkFile = yield* SdkFile;
  const existingErrors = yield* Ref.get(sdkFile.errors);
  if (!existingErrors.some((e) => e.name === error.name)) {
    // Get the inline fields from errorFields map
    const errorFieldsMap = yield* Ref.get(sdkFile.errorFields);
    const fields = errorFieldsMap.get(error.name) ?? "{}";

    // Get error traits for annotations
    const errorTraits = sdkFile.errorShapeIds.get(error.shapeId);
    const annotations: string[] = [];
    const categories: string[] = [];

    // Add awsQueryError annotation if present
    if (errorTraits?.awsQueryError) {
      annotations.push(
        `T.AwsQueryError({ code: "${errorTraits.awsQueryError.code}", httpResponseCode: ${errorTraits.awsQueryError.httpResponseCode} })`,
      );
    }

    // Add retryable annotation if present (smithy.api#retryable)
    if (errorTraits?.retryable) {
      if (errorTraits.retryable.throttling) {
        annotations.push(`T.Retryable({ throttling: true })`);
      } else {
        annotations.push(`T.Retryable()`);
      }
    }

    // Map HTTP status codes to categories
    if (errorTraits?.httpError) {
      const code = errorTraits.httpError;
      if (code === 401 || code === 403) {
        categories.push("C.withAuthError");
      } else if (code === 402) {
        categories.push("C.withQuotaError");
      } else if (
        code === 400 ||
        code === 404 ||
        code === 405 ||
        code === 406 ||
        code === 410 ||
        code === 413 ||
        code === 415 ||
        code === 422
      ) {
        categories.push("C.withBadRequestError");
      } else if (code === 408 || code === 504) {
        categories.push("C.withTimeoutError");
      } else if (code === 409) {
        categories.push("C.withConflictError");
      } else if (code === 429) {
        categories.push("C.withThrottlingError");
      } else if (code >= 500 && code < 600) {
        categories.push("C.withServerError");
      }
    }

    // Add retryableError if Smithy @retryable trait is present
    if (errorTraits?.retryable) {
      categories.push("C.withRetryableError");
      // Also add throttlingError if throttling flag is set
      if (
        errorTraits.retryable.throttling &&
        !categories.includes("C.withThrottlingError")
      ) {
        categories.push("C.withThrottlingError");
      }
    }

    // Build the annotations argument (supports multiple via T.all)
    let annotationsArg = "";
    if (annotations.length === 1) {
      annotationsArg = `, ${annotations[0]}`;
    } else if (annotations.length > 1) {
      annotationsArg = `, T.all(${annotations.join(", ")})`;
    }

    // Build category pipe only if we have categories
    const categoryPipe =
      categories.length > 0 ? `.pipe(${categories.join(", ")})` : "";

    yield* Ref.update(sdkFile.errors, (errors) => [
      ...errors,
      {
        name: error.name,
        definition: `export class ${error.name} extends S.TaggedError<${error.name}>()("${error.name}", ${fields}${annotationsArg})${categoryPipe} {}`,
      },
    ]);
  }
  return error.name;
});

const generateClient = Effect.fn(function* (
  modelPath: string,
  outputRootPath: string,
) {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;

  const model = yield* fs
    .readFileString(modelPath)
    .pipe(Effect.flatMap(S.decodeUnknown(S.parseJson(SmithyModel))));

  const client = Effect.gen(function* () {
    const [serviceShapeName, serviceShape] = yield* findServiceShape;

    const serviceName = serviceShapeName.split("#")[1];

    const protocol = Object.keys(serviceShape.traits).find((key) =>
      key.startsWith("aws.protocols#"),
    );

    if (protocol == null) {
      return yield* Effect.fail(new ProtocolNotFound());
    }

    const sdkFile = yield* SdkFile;

    // Collect all operation IDs from service and resources (recursively)
    const allOperationIds: string[] = [];

    // Add direct service operations
    for (const op of serviceShape.operations ?? []) {
      allOperationIds.push(op.target);
    }

    // Recursively collect operations from resources
    const collectResourceOperations = (resourceTarget: string) => {
      const resourceShape = model.shapes[resourceTarget];
      if (!resourceShape || resourceShape.type !== "resource") return;

      const resource =
        resourceShape as typeof import("./model-schema.ts").ResourceShape.Type;

      // Lifecycle operations
      if (resource.create) allOperationIds.push(resource.create.target);
      if (resource.put) allOperationIds.push(resource.put.target);
      if (resource.read) allOperationIds.push(resource.read.target);
      if (resource.update) allOperationIds.push(resource.update.target);
      if (resource.delete) allOperationIds.push(resource.delete.target);
      if (resource.list) allOperationIds.push(resource.list.target);

      // Instance operations
      for (const op of resource.operations ?? []) {
        allOperationIds.push(op.target);
      }

      // Collection operations
      for (const op of resource.collectionOperations ?? []) {
        allOperationIds.push(op.target);
      }

      // Recursively process nested resources
      for (const nestedResource of resource.resources ?? []) {
        collectResourceOperations(nestedResource.target);
      }
    };

    // Process all top-level resources
    for (const resource of serviceShape.resources ?? []) {
      collectResourceOperations(resource.target);
    }

    yield* Effect.forEach(
      [...new Set(allOperationIds)].map((target) => ({ target })),
      Effect.fn(function* ({ target: operationId }: { target: string }) {
        const [operationShapeName, operationShape] = yield* findShape(
          operationId,
          "operation",
        );

        //todo(pear): we shouldn't default sigv4 to serviceName here, we should do that in client.ts so we don't take up as much space
        const operationName = `${serviceName}.${operationShapeName.split("#")[1]}`;
        const operationComment = htmlToJsdoc(
          operationShape["traits"]["smithy.api#documentation"] ?? "",
        );

        // Get operation name for generating Unit type class names
        const opName = operationShapeName.split("#")[1];

        // Handle smithy.api#Unit specially - generate interface + suspend(struct) with protocol annotations
        const input = yield* Effect.gen(function* () {
          if (operationShape.input.target === "smithy.api#Unit") {
            // Generate an interface + schema for Unit inputs with proper annotations
            const className = `${opName}Request`;
            const opTraits = sdkFile.operationInputTraits.get(className);
            const classAnnotations: string[] = [];

            // Add XML namespace if service has one
            if (sdkFile.serviceXmlNamespace) {
              classAnnotations.push("ns");
            }
            // Add HTTP trait
            if (opTraits) {
              classAnnotations.push(
                `T.Http({ method: "${opTraits.method}", uri: "${opTraits.uri}" })`,
              );
            } else {
              classAnnotations.push(`T.Http({ method: "POST", uri: "/" })`);
            }
            // Add service-level traits
            classAnnotations.push("svc", "auth", "proto", "ver");
            // Add endpoint rule set if available
            if (sdkFile.endpointRuleSet) {
              classAnnotations.push("rules");
            }

            // Build annotation pipe - trait annotations go inside the suspend closure,
            // but identifier goes OUTSIDE on the suspend itself for JSON Schema generation
            let innerPipe = "";
            if (classAnnotations.length === 1) {
              innerPipe = `.pipe(${classAnnotations[0]})`;
            } else if (classAnnotations.length > 1) {
              innerPipe = `.pipe(T.all(${classAnnotations.join(", ")}))`;
            }
            // identifier annotation must be on the suspend, not inside it, for JSONSchema.make() to work
            const outerAnnotation = `.annotations({ identifier: "${className}" })`;

            const interfaceDef = `export interface ${className} {}`;
            const schemaDef = `export const ${className} = S.suspend(() => S.Struct({})${innerPipe})${outerAnnotation} as any as S.Schema<${className}>;`;
            const definition = `${interfaceDef}\n${schemaDef}`;
            yield* Ref.update(sdkFile.schemas, (arr) => [
              ...arr,
              { name: className, definition, deps: [] },
            ]);
            return className;
          }
          return yield* convertShapeToSchema(operationShape.input.target).pipe(
            Effect.flatMap(Deferred.await),
          );
        });

        const output = yield* Effect.gen(function* () {
          if (operationShape.output.target === "smithy.api#Unit") {
            // Generate an interface + schema for Unit outputs
            const className = `${opName}Response`;
            const classAnnotations: string[] = [];
            if (sdkFile.serviceXmlNamespace) {
              classAnnotations.push("ns");
            }

            // Build annotation pipe - trait annotations go inside the suspend closure,
            // but identifier goes OUTSIDE on the suspend itself for JSON Schema generation
            let innerPipe = "";
            if (classAnnotations.length === 1) {
              innerPipe = `.pipe(${classAnnotations[0]})`;
            } else if (classAnnotations.length > 1) {
              innerPipe = `.pipe(T.all(${classAnnotations.join(", ")}))`;
            }
            // identifier annotation must be on the suspend, not inside it, for JSONSchema.make() to work
            const outerAnnotation = `.annotations({ identifier: "${className}" })`;

            const interfaceDef = `export interface ${className} {}`;
            const schemaDef = `export const ${className} = S.suspend(() => S.Struct({})${innerPipe})${outerAnnotation} as any as S.Schema<${className}>;`;
            const definition = `${interfaceDef}\n${schemaDef}`;
            yield* Ref.update(sdkFile.schemas, (arr) => [
              ...arr,
              { name: className, definition, deps: [] },
            ]);
            return className;
          }
          return yield* convertShapeToSchema(operationShape.output.target).pipe(
            Effect.flatMap(Deferred.await),
          );
        });

        // Get patched errors from spec file for this operation
        // Use lowercase operation name to match spec file format
        const patchedErrors =
          sdkFile.serviceSpec.operations[formatName(operationShapeName, true)]
            ?.errors ?? [];

        // Collect error names for both the runtime array and the type annotation
        const errorNames = yield* Effect.gen(function* () {
          // Process model-defined errors
          const modelErrors =
            operationShape.errors == null || operationShape.errors.length === 0
              ? []
              : yield* Effect.forEach(
                  operationShape.errors,
                  ({ target: errorShapeReference }) =>
                    convertShapeToSchema(errorShapeReference).pipe(
                      Effect.flatMap(Deferred.await),
                      Effect.flatMap(() =>
                        addError({
                          name: formatName(errorShapeReference),
                          shapeId: errorShapeReference,
                        }),
                      ),
                    ),
                );

          // Process patched errors (these are just error names, not shape IDs)
          // They will be generated as simple TaggedErrors
          // Sanitize names to remove dots (e.g., "InvalidVpcID.NotFound" -> "InvalidVpcIDNotFound")
          const patchErrors = yield* Effect.forEach(
            patchedErrors,
            (errorName) =>
              addError({
                name: sanitizeErrorName(errorName),
                shapeId: `patched#${errorName}`, // Synthetic shape ID for patched errors
              }),
          );

          // Combine and deduplicate
          return [...new Set([...modelErrors, ...patchErrors])];
        });

        // Build the errors array string for runtime
        const operationErrors =
          errorNames.length === 0 ? "[]" : `[${errorNames.join(", ")}]`;

        // Extract pagination trait from operation (smithy.api#paginated)
        // Operations may only specify partial pagination (e.g., just `items`)
        // and inherit inputToken/outputToken from service-level pagination
        const operationPaginatedTrait = operationShape.traits?.[
          "smithy.api#paginated"
        ] as
          | {
              inputToken?: string;
              outputToken?: string;
              items?: string;
              pageSize?: string;
            }
          | undefined;

        // Get service-level pagination trait for merging
        const servicePaginatedTrait = serviceShape.traits?.[
          "smithy.api#paginated"
        ] as
          | {
              inputToken?: string;
              outputToken?: string;
              items?: string;
              pageSize?: string;
            }
          | undefined;

        // Merge operation pagination with service-level pagination
        // Operation-level traits override service-level traits
        const paginatedTrait = operationPaginatedTrait
          ? {
              inputToken:
                operationPaginatedTrait.inputToken ??
                servicePaginatedTrait?.inputToken,
              outputToken:
                operationPaginatedTrait.outputToken ??
                servicePaginatedTrait?.outputToken,
              items: operationPaginatedTrait.items,
              pageSize:
                operationPaginatedTrait.pageSize ??
                servicePaginatedTrait?.pageSize,
            }
          : undefined;

        // Build operation object - include pagination metadata if present
        // Use 'as const' on pagination to preserve literal types for type inference
        const exportedName = formatName(operationShapeName, true);
        const metaObject = paginatedTrait
          ? `{ input: ${input}, output: ${output}, errors: ${operationErrors}, pagination: ${JSON.stringify(paginatedTrait)} as const }`
          : `{ input: ${input}, output: ${output}, errors: ${operationErrors} }`;

        // Build the error union type for the function signature
        // Errors include operation-specific errors plus common API errors
        const errorUnion =
          errorNames.length > 0
            ? `${errorNames.join(" | ")} | ${sdkFile.commonErrorsRef}`
            : `${sdkFile.commonErrorsRef}`;

        // Explicit type annotations are required to avoid TypeScript resolving internal imports
        // in emitted .d.ts files, which would break type portability for consumers
        const apiFn = paginatedTrait ? "API.makePaginated" : "API.make";

        // Dependencies type for operations
        const depsType = `${sdkFile.credsRef} | ${sdkFile.rgnRef} | HttpClient.HttpClient`;

        // Map Smithy primitives to TypeScript types
        const smithyPrimitiveToTs: Record<string, string> = {
          "smithy.api#String": "string",
          "smithy.api#Boolean": "boolean",
          "smithy.api#Integer": "number",
          "smithy.api#Long": "number",
          "smithy.api#Float": "number",
          "smithy.api#Double": "number",
          "smithy.api#Byte": "number",
          "smithy.api#Short": "number",
          "smithy.api#BigInteger": "bigint",
          "smithy.api#BigDecimal": "number",
          "smithy.api#Blob": "Uint8Array",
          "smithy.api#Timestamp": "Date",
          "smithy.api#Document": "unknown",
        };

        // Generate the explicit function type signature
        let typeAnnotation: string;
        if (paginatedTrait) {
          // For paginated operations, resolve the item type from the output shape
          // paginatedTrait.items points to a member name in the output (e.g., "Subscriptions")
          let itemType = "unknown";
          if (paginatedTrait.items) {
            // Look up the output shape to find the items member
            const [, outputShape] = yield* findShape(
              operationShape.output.target,
            );
            if (outputShape.type === "structure" && outputShape.members) {
              const itemsMember = outputShape.members[paginatedTrait.items];
              if (itemsMember) {
                // Look up the list shape to get its element type
                const [, listShape] = yield* findShape(itemsMember.target);
                if (listShape.type === "list" && listShape.member) {
                  const memberTarget = listShape.member.target;
                  // Check if it's a Smithy primitive
                  if (smithyPrimitiveToTs[memberTarget]) {
                    itemType = smithyPrimitiveToTs[memberTarget];
                  } else {
                    // Look up the member shape to determine how to reference the type
                    const [, memberShape] = yield* findShape(memberTarget);
                    const memberName = formatName(memberTarget);
                    // Structures have generated interfaces
                    if (memberShape.type === "structure") {
                      itemType = memberName;
                    } else if (sdkFile.allUnionNames.has(memberName)) {
                      // Unions have generated type aliases
                      itemType = memberName;
                    } else if (
                      memberShape.type === "string" ||
                      memberShape.type === "boolean" ||
                      memberShape.type === "integer" ||
                      memberShape.type === "long" ||
                      memberShape.type === "float" ||
                      memberShape.type === "double"
                    ) {
                      // Simple type newtypes - we generate type aliases for these
                      itemType = memberName;
                    } else if (memberShape.type === "enum") {
                      // Enums are generated as literal unions with type aliases
                      itemType = memberName;
                    } else if (memberShape.type === "document") {
                      // Document types are converted to S.Any -> unknown
                      itemType = "unknown";
                    } else {
                      // Fallback: use the schema type extraction
                      itemType = `S.Schema.Type<typeof ${memberName}>`;
                    }
                  }
                }
              }
            }
          }
          typeAnnotation = `{
  (input: ${input}): Effect.Effect<${output}, ${errorUnion}, ${depsType}>;
  pages: (input: ${input}) => ${sdkFile.streamRef}.Stream<${output}, ${errorUnion}, ${depsType}>;
  items: (input: ${input}) => ${sdkFile.streamRef}.Stream<${itemType}, ${errorUnion}, ${depsType}>;
}`;
        } else {
          typeAnnotation = `(input: ${input}) => Effect.Effect<${output}, ${errorUnion}, ${depsType}>`;
        }

        yield* sdkFile.operations.pipe(
          Ref.update(
            (c) =>
              c +
              operationComment +
              `export const ${exportedName}: ${typeAnnotation} = /*@__PURE__*/ /*#__PURE__*/ ${apiFn}(() => (${metaObject}));\n`,
          ),
        );
      }),
      {
        concurrency: "unbounded",
      },
    );

    // Get schemas and sort them topologically
    // Cycles were already computed before generation, so just sort
    const schemas = yield* Ref.get(sdkFile.schemas);
    const sortedSchemas = topologicalSortWithCycles(
      schemas,
      sdkFile.cyclicSchemas,
    );
    const schemaDefinitions = sortedSchemas.map((s) => s.definition).join("\n");

    const errors = yield* Ref.get(sdkFile.errors);
    const errorDefinitions = errors.map((s) => s.definition).join("\n");

    // Generate type aliases for newtypes (e.g., type PhoneNumber = string)
    // Skip names that would shadow built-in types or TypeScript keywords
    const reservedNames = new Set([
      "String",
      "Number",
      "Boolean",
      "Object",
      "Array",
      "Date",
      "Error",
      "Function",
      "Symbol",
      "BigInt",
      // Lowercase primitives (TypeScript keywords)
      "string",
      "number",
      "boolean",
      "object",
      "symbol",
      "bigint",
      "undefined",
      "null",
      "never",
      "unknown",
      "any",
      "void",
    ]);
    const newtypes = yield* Ref.get(sdkFile.newtypes);
    const newtypeDefinitions = [...newtypes.entries()]
      .filter(([name]) => !reservedNames.has(name))
      .map(([name, tsType]) => `export type ${name} = ${tsType};`)
      .join("\n");

    const operations = yield* Ref.get(sdkFile.operations);

    // Build imports with aliases only where conflicts exist (detected upfront)
    // Use type-only imports since these are only used in type annotations
    const credentialsImport =
      sdkFile.credsRef === "Creds"
        ? 'import type { Credentials as Creds } from "../credentials.ts";'
        : 'import type { Credentials } from "../credentials.ts";';
    const regionImport =
      sdkFile.rgnRef === "Rgn"
        ? 'import type { Region as Rgn } from "../region.ts";'
        : 'import type { Region } from "../region.ts";';
    const commonErrorsImport =
      sdkFile.commonErrorsRef === "CommonErr"
        ? 'import type { CommonErrors as CommonErr } from "../errors.ts";'
        : 'import type { CommonErrors } from "../errors.ts";';
    const streamImport =
      sdkFile.streamRef === "Strm"
        ? 'import * as Strm from "effect/Stream";'
        : 'import * as Stream from "effect/Stream";';

    // Import sensitive schemas directly to avoid circular import issues
    // (traits.ts has circular deps with protocols, but sensitive.ts doesn't)
    const imports = dedent`
      import { HttpClient } from "@effect/platform";
      import * as Effect from "effect/Effect";
      import * as Redacted from "effect/Redacted";
      import * as S from "effect/Schema";
      ${streamImport}
      import * as API from "../client/api.ts";
      import * as T from "../traits.ts";
      import * as C from "../category.ts";
      ${credentialsImport}
      ${commonErrorsImport}
      ${regionImport}
      import { SensitiveString, SensitiveBlob } from "../sensitive.ts";`;

    // Define service-level constants
    const serviceConstants: string[] = [];

    // XML namespace constant if service has one
    if (sdkFile.serviceXmlNamespace) {
      serviceConstants.push(
        `const ns = T.XmlNamespace("${sdkFile.serviceXmlNamespace}");`,
      );
    }

    // Service trait constants (for operation input schemas)
    const {
      sdkId,
      sigV4ServiceName,
      version,
      protocol: svcProtocol,
      serviceShapeName: svcShapeName,
    } = sdkFile.serviceTraits;
    serviceConstants.push(
      `const svc = T.AwsApiService({ sdkId: "${sdkId}", serviceShapeName: "${svcShapeName}" });`,
    );
    serviceConstants.push(
      `const auth = T.AwsAuthSigv4({ name: "${sigV4ServiceName}" });`,
    );
    serviceConstants.push(`const ver = T.ServiceVersion("${version}");`);

    // Protocol constant
    const protoAnnotation = Match.value(svcProtocol).pipe(
      Match.when("aws.protocols#restXml", () => "T.AwsProtocolsRestXml()"),
      Match.when("aws.protocols#restJson1", () => "T.AwsProtocolsRestJson1()"),
      Match.when(
        "aws.protocols#awsJson1_0",
        () => "T.AwsProtocolsAwsJson1_0()",
      ),
      Match.when(
        "aws.protocols#awsJson1_1",
        () => "T.AwsProtocolsAwsJson1_1()",
      ),
      Match.when("aws.protocols#awsQuery", () => "T.AwsProtocolsAwsQuery()"),
      Match.when("aws.protocols#ec2Query", () => "T.AwsProtocolsEc2Query()"),
      Match.orElse(() => "T.AwsProtocolsRestXml()"),
    );
    serviceConstants.push(`const proto = ${protoAnnotation};`);

    // Compiled endpoint resolver function (if rule set available)
    if (sdkFile.endpointRuleSet) {
      const compiledCode = generateRuleSetCode(
        sdkFile.endpointRuleSet as RuleSetObject,
        { typed: true },
      );
      serviceConstants.push(
        `const rules = T.EndpointResolver(${compiledCode});`,
      );
    }

    const serviceConstantsBlock =
      serviceConstants.length > 0 ? `\n${serviceConstants.join("\n")}` : "";

    const newtypesBlock = newtypeDefinitions
      ? `\n\n//# Newtypes\n${newtypeDefinitions}`
      : "";

    const fileContents = `${imports}${serviceConstantsBlock}${newtypesBlock}\n\n//# Schemas\n${schemaDefinitions}\n\n//# Errors\n${errorDefinitions}\n\n//# Operations\n${operations}`;

    yield* fs.writeFileString(
      path.join(
        outputRootPath,
        `${serviceShape.traits["aws.api#service"].sdkId.toLowerCase().replaceAll(" ", "-")}.ts`,
      ),
      fileContents,
    );
  });

  // Pre-compute cyclic schemas from the model before generation
  const shapeDeps = collectShapeDependencies(model);
  const {
    cyclicSchemas,
    cyclicClasses,
    allStructNames,
    allArrayNames,
    allMapNames,
    allUnionNames,
    allSchemaNames,
  } = findCyclicSchemasFromDeps(shapeDeps);

  // Pre-compute conflict resolution for imports
  const hasCredentialsConflict = allSchemaNames.has("Credentials");
  const hasRegionConflict = allSchemaNames.has("Region");
  const hasCommonErrorsConflict = allSchemaNames.has("CommonErrors");
  const hasStreamConflict = allSchemaNames.has("Stream");

  const credsRef = hasCredentialsConflict ? "Creds" : "Credentials";
  const rgnRef = hasRegionConflict ? "Rgn" : "Region";
  const commonErrorsRef = hasCommonErrorsConflict
    ? "CommonErr"
    : "CommonErrors";
  const streamRef = hasStreamConflict ? "Strm" : "Stream";

  // Pre-collect error shape IDs so we can inline their fields in TaggedError
  const errorShapeIds = collectErrorShapeIds(model);

  // Pre-collect operation input traits and output traits
  const operationInputTraits = collectOperationInputTraits(model);
  const operationOutputTraits = collectOperationOutputTraits(model);
  const inputEventStreamShapeIds = collectInputEventStreamShapeIds(model);
  const sensitiveShapeIds = collectSensitiveShapeIds(model);

  // Extract service-level information
  const serviceShape = Object.values(model.shapes).find(
    (s) => s.type === "service",
  ) as ServiceShape | undefined;
  const serviceXmlNamespace = (
    serviceShape?.traits?.["smithy.api#xmlNamespace"] as
      | { uri: string }
      | undefined
  )?.uri;

  // Extract service-level traits
  const serviceNameForTraits =
    Object.entries(model.shapes)
      .find(([_, s]) => s.type === "service")?.[0]
      ?.split("#")[1] ?? "";
  const serviceProtocol = serviceShape
    ? (Object.keys(serviceShape.traits).find((key) =>
        key.startsWith("aws.protocols#"),
      ) ?? "")
    : "";
  const serviceTraits = {
    sdkId: serviceShape?.traits?.["aws.api#service"]?.sdkId ?? "",
    sigV4ServiceName:
      (
        serviceShape?.traits?.["aws.auth#sigv4"] as
          | { name?: string }
          | undefined
      )?.name ?? serviceNameForTraits,
    version: serviceShape?.version ?? "",
    protocol: serviceProtocol,
    serviceShapeName: serviceNameForTraits,
  };

  // Extract endpoint rule set and client context params
  const endpointRuleSet =
    serviceShape?.traits?.["smithy.rules#endpointRuleSet"];
  const clientContextParams = serviceShape?.traits?.[
    "smithy.rules#clientContextParams"
  ] as Record<string, { type: string; documentation?: string }> | undefined;

  // Load spec patches for this service
  const serviceSpec = yield* loadServiceSpecPatch(serviceTraits.sdkId);

  return yield* client.pipe(
    Effect.provideService(SdkFile, {
      schemas: yield* Ref.make<
        Array<{ name: string; definition: string; deps: string[] }>
      >([]),
      errors: yield* Ref.make<Array<{ name: string; definition: string }>>([]),
      operations: yield* Ref.make(""),
      map: MutableHashMap.empty<string, Deferred.Deferred<string, never>>(),
      cyclicSchemas,
      cyclicClasses,
      allStructNames,
      allArrayNames,
      allMapNames,
      allUnionNames,
      allSchemaNames,
      credsRef,
      rgnRef,
      commonErrorsRef,
      streamRef,
      newtypes: yield* Ref.make<Map<string, string>>(new Map()),
      errorShapeIds,
      errorFields: yield* Ref.make<Map<string, string>>(new Map()),
      usesMiddleware: yield* Ref.make<boolean>(false),
      serviceXmlNamespace,
      operationInputTraits,
      operationOutputTraits,
      serviceTraits,
      endpointRuleSet,
      clientContextParams,
      serviceSpec,
      inputEventStreamShapeIds,
      sensitiveShapeIds,
    }),
    Effect.provideService(ModelService, model),
  );
});

const AWS_MODELS_PATH = "aws-models";
const RESULT_ROOT_PATH = path.resolve("src", "services");

BunRuntime.runMain(
  // generateClient(TEST_MODAL_PATH, TEST_OUTPUT_PATH)
  Effect.gen(function* () {
    const path = yield* Path.Path;
    const fs = yield* FileSystem.FileSystem;

    // Copy partitions.json from Smithy to rules-engine
    const partitionsSrc = path.join(
      "smithy",
      "smithy-aws-endpoints",
      "src",
      "main",
      "resources",
      "software",
      "amazon",
      "smithy",
      "rulesengine",
      "aws",
      "language",
      "functions",
      "partition",
      "partitions.json",
    );
    const partitionsDest = path.join("src", "rules-engine", "partitions.json");
    yield* fs.copyFile(partitionsSrc, partitionsDest);
    yield* Console.log("✅ partitions.json");

    const rootModelsPath = path.join(AWS_MODELS_PATH, "models");
    const folders = yield* fs.readDirectory(rootModelsPath);

    yield* fs.makeDirectory(RESULT_ROOT_PATH, {
      recursive: true,
    });

    const sdkFlag = Option.getOrNull(getSdkFlag());

    yield* Effect.forEach(
      folders.filter((service) => sdkFlag == null || sdkFlag === service),
      (service) =>
        Effect.gen(function* () {
          const baseModelPath = path.join(rootModelsPath, service, "service");
          const folder = (yield* fs.readDirectory(baseModelPath))[0]!;
          const modelPath = path.join(
            baseModelPath,
            folder,
            `${service}-${folder}.json`,
          );
          yield* generateClient(modelPath, RESULT_ROOT_PATH);
        }).pipe(
          Effect.andThen(() => Console.log(`✅ ${service}`)),
          Effect.catchAll(
            (error) =>
              Console.error(
                `❌ ${service}\n\tUnable to generate client: ${error}`,
              ), //.pipe(Effect.andThen(() => Effect.die(error))),
          ),
        ),
    );

    // Generate index.ts with exports for all generated services
    const generatedFiles = yield* fs.readDirectory(RESULT_ROOT_PATH);
    const serviceFiles = generatedFiles
      .filter((f) => f.endsWith(".ts") && f !== "index.ts")
      .sort();

    const indexExports = serviceFiles
      .map((file) => {
        const baseName = file.replace(/\.ts$/, "");
        // Convert file name to valid JS identifier (e.g., "amazon-s3" -> "S3", "api-gateway" -> "APIGateway")
        const exportName = baseName
          .replace(/^amazon-/, "") // Remove "amazon-" prefix
          .replace(/^aws-/, "") // Remove "aws-" prefix
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("");
        return `export * as ${exportName} from "./${baseName}.ts";`;
      })
      .join("\n");

    yield* fs.writeFileString(
      path.join(RESULT_ROOT_PATH, "index.ts"),
      indexExports + "\n",
    );

    yield* Command.make("bun", "format").pipe(Command.string);
  }).pipe(
    Logger.withMinimumLogLevel(LogLevel.Error),
    Effect.provide(BunContext.layer),
  ),
);

export function htmlToJsdoc(html: string): string {
  let text = html
    // Remove opening JSDoc comment if present
    .replace(/^\/\*\*\s*/, "")
    .replace(/\s*\*\/$/, "")
    // Convert common HTML elements
    .replace(/<\/?p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?note>/gi, "\n")
    .replace(/<\/?important>/gi, "\n")
    .replace(/<li>\s*/gi, "\n- ")
    .replace(/<\/li>/gi, "")
    .replace(/<\/ul>/gi, "\n")
    .replace(/<ul>/gi, "")
    .replace(/<dt>(.*?)<\/dt>/gi, "\n### $1\n")
    .replace(/<dd>/gi, "")
    .replace(/<\/dd>/gi, "\n")
    .replace(/<dl>/gi, "")
    .replace(/<\/dl>/gi, "")
    // Handle code blocks
    .replace(/<code>(.*?)<\/code>/gi, "`$1`")
    // Handle links - extract text only
    .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
    // Handle bold/emphasis
    .replace(/<b>(.*?)<\/b>/gi, "**$1**")
    .replace(/<i>(.*?)<\/i>/gi, "*$1*")
    // Remove any remaining HTML tags
    .replace(/<[^>]+>/g, "")
    // Decode HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Clean up whitespace
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    // Escape */ to prevent premature closing of JSDoc comment
    .replace(/\*\//g, "*\\/")
    .trim();

  // Format as JSDoc
  const lines = text.split("\n").map((line) => ` * ${line.trim()}`);
  const dedupedLines = lines.filter(
    (line, i) => !(line === " * " && lines[i - 1] === " * "),
  );
  return `/**\n${dedupedLines.join("\n")}\n */\n`;
}

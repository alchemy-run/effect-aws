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
    // Set of ALL struct names (classes can be used directly as types)
    allStructNames: Set<string>;
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
 */
function applyTraitsToSchema(
  schema: string,
  traits: SmithyTraits,
  memberName?: string,
): string {
  const pipes = collectSerializationTraits(traits, memberName);
  if (pipes.length > 0) {
    return `${schema}.pipe(${pipes.join(", ")})`;
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

// Helper to convert schema expression to TypeScript type for type aliases
// - allStructNames: set of all struct (class) names that can be used directly as types
// - cyclicSchemas: set of cyclic schemas that have explicit type aliases
function schemaExprToTsType(
  schemaExpr: string,
  allStructNames: Set<string>,
  cyclicSchemas: Set<string>,
): string {
  //todo(pear): move this to an effect matcher
  switch (schemaExpr) {
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
    case "S.Struct({})":
      return "Record<string, never>";
    default:
      // Named schemas:
      // - Structs (classes) can be used directly as types
      // - Cyclic arrays/unions have explicit type aliases, so can be used directly
      // - Non-cyclic arrays/unions/maps are just const, so need typeof extraction
      if (allStructNames.has(schemaExpr) || cyclicSchemas.has(schemaExpr)) {
        return schemaExpr;
      }
      return `typeof ${schemaExpr}["Type"]`;
  }
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
  // Collect ALL struct names (classes can be used directly as types)
  const allStructNames = new Set<string>();
  for (const [name, info] of shapeDeps) {
    if (info.type === "structure") {
      allStructNames.add(name);
      if (cyclicSchemas.has(name)) {
        cyclicClasses.add(name);
      }
    }
  }

  return { cyclicSchemas, cyclicClasses, allStructNames };
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
            () => Effect.succeed("S.Number"),
          ),
          Match.when(
            (s) => s.type === "string",
            () => Effect.succeed("S.String"),
          ),
          Match.when(
            (s) => s.type === "blob",
            (s) => {
              // Check for @streaming trait
              if (s.traits?.["smithy.api#streaming"] != null) {
                // Streaming blob - used for large payloads like S3 objects
                // NOTE: Context-specific types (StreamingInput/StreamingOutput) are
                // handled at the member level. This fallback is for direct references.
                // Check for @requiresLength trait - indicates Content-Length is required
                if (s.traits?.["smithy.api#requiresLength"] != null) {
                  return Effect.succeed(
                    "T.StreamBody().pipe(T.RequiresLength())",
                  );
                }
                return Effect.succeed("T.StreamBody()");
              }
              // Non-streaming blob - base64 encoded in body
              return Effect.succeed("T.Blob");
            },
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
                    let innerType = type;
                    if (isMemberErrorShape) {
                      innerType = `S.suspend(() => ${type})`;
                    }
                    // Wrap cyclic references in S.suspend
                    else if (sdkFile.cyclicSchemas.has(memberName)) {
                      innerType = sdkFile.cyclicClasses.has(memberName)
                        ? // TODO(sam): I had to add the any here because encoded type was creting circular errors. hopefully OK since we don't really need it
                          `S.suspend((): S.Schema<${type}, any> => ${type})`
                        : `S.suspend(() => ${type})`;
                    }

                    // Apply serialization traits (xmlName, timestampFormat, etc.) using unified function
                    innerType = applyTraitsToSchema(innerType, s.member.traits);

                    // Build the array schema with optional sparse annotation
                    const sparsePipe = isSparse ? ".pipe(T.Sparse())" : "";

                    if (isCyclic) {
                      // For cyclic arrays, generate explicit type alias to help TypeScript inference
                      const memberTsType = schemaExprToTsType(
                        type,
                        sdkFile.allStructNames,
                        sdkFile.cyclicSchemas,
                      );
                      return `export type ${schemaName} = ${memberTsType}[];\nexport const ${schemaName} = S.Array(${innerType})${sparsePipe} as any as S.Schema<${schemaName}>;`;
                    }

                    return `export const ${schemaName} = S.Array(${innerType})${sparsePipe};`;
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
                    if (isStreamingBlob || isBlobPayload) {
                      // Use different schema based on input vs output context
                      // Both streaming blobs and httpPayload blobs need raw bytes (not base64)
                      if (isOperationOutput) {
                        baseSchema = "T.StreamingOutput";
                      } else if (isOperationInput) {
                        // Add RequiresLength trait if present on the target shape
                        baseSchema = hasRequiresLength
                          ? "T.StreamingInput.pipe(T.RequiresLength())"
                          : "T.StreamingInput";
                      } else {
                        // Nested structure - fallback to general StreamBody
                        baseSchema = hasRequiresLength
                          ? "T.StreamBody().pipe(T.RequiresLength())"
                          : "T.StreamBody()";
                      }
                    } else if (isEventStream) {
                      // Event stream member - get the union schema and note it's a stream
                      // The actual schema is the union type, but we need to wrap it for
                      // proper stream handling in the API
                      baseSchema = yield* convertShapeToSchema(
                        member.target,
                      ).pipe(Effect.flatMap(Deferred.await));
                      // Add httpPayload annotation since event streams are the body
                      if (!hasHttpPayload) {
                        // Event stream members implicitly act as httpPayload
                      }
                    } else {
                      baseSchema = yield* convertShapeToSchema(
                        member.target,
                      ).pipe(Effect.flatMap(Deferred.await));
                    }

                    let schema = baseSchema;

                    // Check if base schema is a timestamp (contains S.Date or TimestampFormat)
                    const isTimestampSchema =
                      baseSchema.includes("S.Date") ||
                      baseSchema.includes("TimestampFormat") ||
                      member.target === "smithy.api#Timestamp";

                    // Override timestamp schema for HTTP header bindings
                    if (isTimestampSchema && hasHttpHeader && !explicitFormat) {
                      // HTTP headers default to http-date format
                      schema = `S.Date.pipe(T.TimestampFormat("http-date"))`;
                    } else if (isTimestampSchema && explicitFormat) {
                      // Explicit format on member overrides target
                      schema = `S.Date.pipe(T.TimestampFormat("${explicitFormat}"))`;
                    }

                    // Wrap error shape references in S.suspend (they're defined after schemas)
                    if (isMemberErrorShape) {
                      schema = `S.suspend(() => ${schema})`;
                    }
                    // Wrap cyclic references in S.suspend (only if current schema is also cyclic)
                    else if (
                      isCurrentCyclic &&
                      sdkFile.cyclicSchemas.has(memberTargetName)
                    ) {
                      if (sdkFile.cyclicClasses.has(memberTargetName)) {
                        // TODO(sam): I had to add the any here because encoded type was creting circular errors. hopefully OK since we don't really need it
                        schema = `S.suspend((): S.Schema<${schema}, any> => ${schema})`;
                      } else {
                        schema = `S.suspend(() => ${schema})`;
                      }
                    }

                    // Wrap in S.optional first (if not required)
                    // Check for member override from spec patches first
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
                    schema = applyTraitsToSchema(
                      schema,
                      member.traits,
                      memberName,
                    );

                    return `${memberName}: ${schema}`;
                  }),
                ),
                { concurrency: "unbounded" },
              );

              // For error shapes, store the fields separately and don't generate a class
              if (isErrorShape) {
                return Effect.gen(function* () {
                  const tsName = currentSchemaName;
                  const members = yield* membersEffect;
                  const fields = `{${members.join(", ")}}`;
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
                    const fields = `{${members.join(", ")}}`;
                    // Build class-level annotations array
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
                    // Only use T.all() when there are multiple annotations
                    let annotations = "";
                    if (classAnnotations.length === 1) {
                      annotations = `, ${classAnnotations[0]}`;
                    } else if (classAnnotations.length > 1) {
                      annotations = `, T.all(${classAnnotations.join(", ")})`;
                    }
                    return `export class ${currentSchemaName} extends S.Class<${currentSchemaName}>("${currentSchemaName}")(${fields}${annotations}) {}`;
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
                        if (isMemberErrorShape) {
                          wrappedSchema = `S.suspend(() => ${schema})`;
                        }
                        // Wrap cyclic references in S.suspend
                        else if (
                          isCurrentCyclic &&
                          sdkFile.cyclicSchemas.has(memberTargetName)
                        ) {
                          if (sdkFile.cyclicClasses.has(memberTargetName)) {
                            // TODO(sam): I had to add the any here because encoded type was creting circular errors. hopefully OK since we don't really need it
                            wrappedSchema = `S.suspend((): S.Schema<${schema}, any> => ${schema})`;
                          } else {
                            wrappedSchema = `S.suspend(() => ${schema})`;
                          }
                        }

                        // Apply serialization traits (jsonName, xmlName, etc.) to the inner schema
                        wrappedSchema = applyTraitsToSchema(
                          wrappedSchema,
                          member.traits,
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

                      if (isCurrentCyclic) {
                        // For cyclic unions, generate explicit type alias to help TypeScript inference
                        // Each member is now a struct { memberName: type }, so the TS types need to reflect that
                        const memberTsTypes = members.map((m) => {
                          const innerType = schemaExprToTsType(
                            m.raw,
                            sdkFile.allStructNames,
                            sdkFile.cyclicSchemas,
                          );
                          return `{ ${m.name}: ${innerType} }`;
                        });
                        const typeAlias = `export type ${schemaName} = ${memberTsTypes.join(" | ")};`;
                        return `${typeAlias}\nexport const ${schemaName} = S.Union(${wrappedMembers.join(", ")}) as any as S.Schema<${schemaName}>;`;
                      }

                      return `export const ${schemaName} = S.Union(${wrappedMembers.join(", ")});`;
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
                    // Wrap error shape or cyclic references in S.suspend
                    let wrappedKey = keySchema;
                    let wrappedValue = valueSchema;

                    if (isKeyErrorShape) {
                      wrappedKey = `S.suspend(() => ${keySchema})`;
                    } else if (sdkFile.cyclicSchemas.has(keyTargetName)) {
                      wrappedKey = sdkFile.cyclicClasses.has(keyTargetName)
                        ? `S.suspend((): S.Schema<${keySchema}, any> => ${keySchema})`
                        : `S.suspend(() => ${keySchema})`;
                    }

                    if (isValueErrorShape) {
                      wrappedValue = `S.suspend(() => ${valueSchema})`;
                    } else if (sdkFile.cyclicSchemas.has(valueTargetName)) {
                      wrappedValue = sdkFile.cyclicClasses.has(valueTargetName)
                        ? `S.suspend((): S.Schema<${valueSchema}, any> => ${valueSchema})`
                        : `S.suspend(() => ${valueSchema})`;
                    }

                    // Apply serialization traits (xmlName, etc.) using unified function
                    wrappedKey = applyTraitsToSchema(wrappedKey, s.key.traits);
                    wrappedValue = applyTraitsToSchema(
                      wrappedValue,
                      s.value.traits,
                    );

                    // Build the record schema with optional sparse annotation
                    const sparsePipe = isSparse ? ".pipe(T.Sparse())" : "";

                    if (isCyclic) {
                      // For cyclic maps, generate explicit type alias to help TypeScript inference
                      const keyTsType = schemaExprToTsType(
                        keySchema,
                        sdkFile.allStructNames,
                        sdkFile.cyclicSchemas,
                      );
                      const valueTsType = schemaExprToTsType(
                        valueSchema,
                        sdkFile.allStructNames,
                        sdkFile.cyclicSchemas,
                      );
                      return `export type ${schemaName} = { [key: ${keyTsType}]: ${valueTsType} };\nexport const ${schemaName} = S.Record({key: ${wrappedKey}, value: ${wrappedValue}})${sparsePipe} as any as S.Schema<${schemaName}>;`;
                    }

                    return `export const ${schemaName} = S.Record({key: ${wrappedKey}, value: ${wrappedValue}})${sparsePipe};`;
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

    // Add error categories based on HTTP status code
    if (errorTraits?.httpError) {
      if (errorTraits.httpError === 429) {
        categories.push("ERROR_CATEGORIES.THROTTLING_ERROR");
      } else if (errorTraits.httpError >= 500 && errorTraits.httpError < 600) {
        categories.push("ERROR_CATEGORIES.SERVER_ERROR");
      }
    }

    // Build the annotations argument (supports multiple via T.all)
    let annotationsArg = "";
    if (annotations.length === 1) {
      annotationsArg = `, ${annotations[0]}`;
    } else if (annotations.length > 1) {
      annotationsArg = `, T.all(${annotations.join(", ")})`;
    }

    // Build the category pipe if needed
    const categoryPipe =
      categories.length > 0
        ? `.pipe(withCategory(${categories.join(", ")}))`
        : "";

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

        // Handle smithy.api#Unit specially - generate a proper class with protocol annotations
        const input = yield* Effect.gen(function* () {
          if (operationShape.input.target === "smithy.api#Unit") {
            // Generate a Request class for Unit inputs with proper annotations
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

            const annotations =
              classAnnotations.length === 1
                ? `, ${classAnnotations[0]}`
                : `, T.all(${classAnnotations.join(", ")})`;
            const definition = `export class ${className} extends S.Class<${className}>("${className}")({}${annotations}) {}`;
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
            // Generate a Response class for Unit outputs
            const className = `${opName}Response`;
            const classAnnotations: string[] = [];
            if (sdkFile.serviceXmlNamespace) {
              classAnnotations.push("ns");
            }
            const annotations =
              classAnnotations.length === 1
                ? `, ${classAnnotations[0]}`
                : classAnnotations.length > 0
                  ? `, T.all(${classAnnotations.join(", ")})`
                  : "";
            const definition = `export class ${className} extends S.Class<${className}>("${className}")({}${annotations}) {}`;
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

        const operationErrors = yield* Effect.gen(function* () {
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
          const allErrors = [...new Set([...modelErrors, ...patchErrors])];
          return allErrors.length === 0 ? "[]" : `[${allErrors.join(", ")}]`;
        });

        // Build simplified operation object - metadata comes from annotations on input schema
        const metaObject = `{ input: ${input}, output: ${output}, errors: ${operationErrors} }`;

        yield* sdkFile.operations.pipe(
          Ref.update(
            (c) =>
              c +
              operationComment +
              `export const ${formatName(operationShapeName, true)} = /*@__PURE__*/ /*#__PURE__*/ API.make(() => (${metaObject}));\n`,
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

    const operations = yield* Ref.get(sdkFile.operations);

    const imports = dedent`
      import * as S from "effect/Schema";
      import * as API from "../api.ts";
      import * as T from "../traits.ts";
      import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";`;

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

    // Endpoint rule set constant (if available)
    if (sdkFile.endpointRuleSet) {
      serviceConstants.push(
        `const rules = T.EndpointRuleSet(${JSON.stringify(sdkFile.endpointRuleSet)});`,
      );
    }

    const serviceConstantsBlock =
      serviceConstants.length > 0 ? `\n${serviceConstants.join("\n")}` : "";

    const fileContents = `${imports}${serviceConstantsBlock}\n\n//# Schemas\n${schemaDefinitions}\n\n//# Errors\n${errorDefinitions}\n\n//# Operations\n${operations}`;

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
  const { cyclicSchemas, cyclicClasses, allStructNames } =
    findCyclicSchemasFromDeps(shapeDeps);

  // Pre-collect error shape IDs so we can inline their fields in TaggedError
  const errorShapeIds = collectErrorShapeIds(model);

  // Pre-collect operation input traits and output traits
  const operationInputTraits = collectOperationInputTraits(model);
  const operationOutputTraits = collectOperationOutputTraits(model);
  const inputEventStreamShapeIds = collectInputEventStreamShapeIds(model);

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

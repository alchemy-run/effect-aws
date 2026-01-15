import type * as AST from "effect/SchemaAST";
import { xmlNamespaceSymbol, xmlNameSymbol } from "../traits.ts";

const Identifier = Symbol.for("effect/annotation/Identifier");
const Surrogate = Symbol.for("effect/annotation/Surrogate");

/**
 * Unwrap Union types to get to the actual type (handles S.optional)
 * Does NOT unwrap Suspend - callers should handle Suspend separately to preserve annotations
 */
export function unwrapUnion(ast: AST.AST): AST.AST {
  if (ast._tag === "Union") {
    const nonNullish = ast.types.filter(
      (t) =>
        t._tag !== "UndefinedKeyword" &&
        !(t._tag === "Literal" && t.literal === null),
    );
    if (nonNullish.length === 1) {
      return unwrapUnion(nonNullish[0]);
    }
  }
  return ast;
}

/**
 * Get the identifier (class name) from an AST node
 */
export function getIdentifier(ast: AST.AST): string | undefined {
  // Check annotations on current node FIRST (handles S.suspend with .annotations())
  const directId = ast.annotations?.[Identifier];
  if (typeof directId === "string") return directId;

  // Handle S.suspend - check the inner AST
  if (ast._tag === "Suspend") {
    return getIdentifier(ast.f());
  }

  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return getIdentifier(unwrapped);

  if (unwrapped._tag === "Transformation" && unwrapped.to) {
    const id = unwrapped.to.annotations?.[Identifier];
    if (typeof id === "string") return id;
  }
  if (unwrapped._tag === "Declaration") {
    const id = unwrapped.annotations?.[Identifier];
    if (typeof id === "string") return id;
  }
  return undefined;
}

/**
 * Get property signatures from a schema AST
 */
export function getPropertySignatures(
  ast: AST.AST,
): readonly AST.PropertySignature[] {
  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return getPropertySignatures(unwrapped);

  // Handle S.suspend - call the thunk to get the actual AST
  if (unwrapped._tag === "Suspend") {
    return getPropertySignatures(unwrapped.f());
  }

  if (unwrapped._tag === "Transformation" && unwrapped.to) {
    const surrogate = unwrapped.to.annotations?.[Surrogate] as
      | AST.AST
      | undefined;
    if (surrogate && surrogate._tag === "TypeLiteral") {
      return surrogate.propertySignatures;
    }
  }
  if (unwrapped._tag === "Declaration") {
    const surrogate = unwrapped.annotations?.[Surrogate] as AST.AST | undefined;
    if (surrogate && surrogate._tag === "TypeLiteral") {
      return surrogate.propertySignatures;
    }
  }
  if (unwrapped._tag === "TypeLiteral") {
    return unwrapped.propertySignatures;
  }
  return [];
}

/**
 * Recursively find the TypeLiteral on the "from" (encoded/wire) side of transformations.
 * S.Class + S.fromKey (JsonName) creates nested transformation layers.
 * S.suspend is also handled by calling the thunk to get the actual AST.
 */
function findEncodedTypeLiteral(ast: AST.AST): AST.TypeLiteral | undefined {
  if (ast._tag === "TypeLiteral") return ast;
  if (ast._tag === "Transformation") {
    // Prioritize the "from" side (encoded/wire format)
    const fromResult = findEncodedTypeLiteral(ast.from);
    if (fromResult) return fromResult;
    // Fall back to "to" side
    return findEncodedTypeLiteral(ast.to);
  }
  // Handle S.suspend - call the thunk to get the actual AST
  if (ast._tag === "Suspend") {
    return findEncodedTypeLiteral(ast.f());
  }
  return undefined;
}

/**
 * Get encoded property signatures (from side of Transformation)
 */
export function getEncodedPropertySignatures(
  ast: AST.AST,
): readonly AST.PropertySignature[] {
  // First unwrap Union (handles S.optional)
  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return getEncodedPropertySignatures(unwrapped);

  // Recursively find TypeLiteral through nested transformations
  const typeLiteral = findEncodedTypeLiteral(unwrapped);
  if (typeLiteral) {
    return typeLiteral.propertySignatures;
  }
  return getPropertySignatures(unwrapped);
}

/**
 * Get element AST from array/tuple type
 */
export function getArrayElementAST(ast: AST.AST): AST.AST | undefined {
  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return getArrayElementAST(unwrapped);

  if (unwrapped._tag === "TupleType" && unwrapped.rest?.[0]) {
    return unwrapped.rest[0].type;
  }
  if (unwrapped._tag === "Transformation") {
    return getArrayElementAST(unwrapped.from);
  }
  return undefined;
}

/**
 * Check if AST represents an array type
 */
export function isArrayAST(ast: AST.AST): boolean {
  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return isArrayAST(unwrapped);

  if (unwrapped._tag === "TupleType" && unwrapped.rest?.[0]) return true;
  if (unwrapped._tag === "Transformation") return isArrayAST(unwrapped.from);
  return false;
}

/**
 * Check if AST represents a number type
 */
export function isNumberAST(ast: AST.AST): boolean {
  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return isNumberAST(unwrapped);

  if (unwrapped._tag === "NumberKeyword") return true;
  if (unwrapped._tag === "Transformation") return isNumberAST(unwrapped.from);
  return false;
}

/**
 * Check if AST represents a boolean type
 */
export function isBooleanAST(ast: AST.AST): boolean {
  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return isBooleanAST(unwrapped);

  if (unwrapped._tag === "BooleanKeyword") return true;
  if (unwrapped._tag === "Transformation") return isBooleanAST(unwrapped.from);
  return false;
}

/**
 * Check if AST represents a Date type (DateFromString transformation)
 */
export function isDateAST(ast: AST.AST): boolean {
  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return isDateAST(unwrapped);

  // S.Date is wrapped in a Refinement that contains a Transformation
  if (unwrapped._tag === "Refinement") {
    return isDateAST(unwrapped.from);
  }

  // S.Date is a Transformation from string to Date (DateFromSelf)
  if (
    unwrapped._tag === "Transformation" &&
    unwrapped.to?._tag === "Declaration"
  ) {
    const id = unwrapped.to.annotations?.[Identifier];
    if (id === "Date" || id === "DateFromSelf") return true;
  }
  return false;
}

/**
 * Get xmlNamespace annotation from AST
 */
export function getXmlNamespace(ast: AST.AST): string | undefined {
  // Check annotations on the current node first (handles S.suspend with .pipe())
  const directNs = ast.annotations?.[xmlNamespaceSymbol] as string | undefined;
  if (directNs) return directNs;

  // Handle S.suspend - check the inner AST but preserve outer annotations
  if (ast._tag === "Suspend") {
    return getXmlNamespace(ast.f());
  }

  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return getXmlNamespace(unwrapped);

  if (unwrapped._tag === "Transformation" && unwrapped.to) {
    const ns = unwrapped.to.annotations?.[xmlNamespaceSymbol] as
      | string
      | undefined;
    if (ns) return ns;
  }
  return unwrapped.annotations?.[xmlNamespaceSymbol] as string | undefined;
}

/**
 * Get xmlName annotation from AST (class-level)
 */
export function getXmlNameFromAST(ast: AST.AST): string | undefined {
  // Check annotations on the current node first (handles S.suspend with .pipe())
  const directName = ast.annotations?.[xmlNameSymbol] as string | undefined;
  if (directName) return directName;

  // Handle S.suspend - check the inner AST but preserve outer annotations
  if (ast._tag === "Suspend") {
    return getXmlNameFromAST(ast.f());
  }

  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return getXmlNameFromAST(unwrapped);

  if (unwrapped._tag === "Transformation" && unwrapped.to) {
    const name = unwrapped.to.annotations?.[xmlNameSymbol] as
      | string
      | undefined;
    if (name) return name;
  }
  return unwrapped.annotations?.[xmlNameSymbol] as string | undefined;
}

/**
 * Check if AST represents a map/record type
 */
export function isMapAST(ast: AST.AST): boolean {
  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return isMapAST(unwrapped);

  if (unwrapped._tag === "TypeLiteral" && unwrapped.indexSignatures?.length > 0)
    return true;
  if (unwrapped._tag === "Transformation") return isMapAST(unwrapped.from);
  return false;
}

/**
 * Get key and value AST from map/record type
 */
export function getMapKeyValueAST(
  ast: AST.AST,
): { keyAST: AST.AST; valueAST: AST.AST } | undefined {
  const unwrapped = unwrapUnion(ast);
  if (unwrapped !== ast) return getMapKeyValueAST(unwrapped);

  if (
    unwrapped._tag === "TypeLiteral" &&
    unwrapped.indexSignatures?.length > 0
  ) {
    const indexSig = unwrapped.indexSignatures[0];
    return {
      keyAST: indexSig.parameter,
      valueAST: indexSig.type,
    };
  }
  if (unwrapped._tag === "Transformation")
    return getMapKeyValueAST(unwrapped.from);
  return undefined;
}

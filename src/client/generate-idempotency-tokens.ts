/**
 * Idempotency Token Generation - auto-fills @idempotencyToken fields with UUIDs.
 *
 * The AWS SDK automatically generates UUIDs for fields marked with @idempotencyToken
 * when the user doesn't provide a value. This ensures request retry safety.
 */

import * as S from "effect/Schema";
import * as AST from "effect/SchemaAST";
import * as crypto from "node:crypto";
import { hasIdempotencyToken } from "../traits.ts";

/**
 * Find property names that have the @idempotencyToken annotation.
 * This is done once at request builder creation time.
 */
export const findIdempotencyTokenProps = (
  schema: S.Schema.AnyNoContext,
): string[] => {
  const ast = schema.ast;

  // Only process struct schemas (structures)
  if (ast._tag !== "TypeLiteral" && ast._tag !== "Suspend") {
    return [];
  }

  // Unwrap Suspend if needed
  const unwrapped = ast._tag === "Suspend" ? ast.f() : ast;
  if (unwrapped._tag !== "TypeLiteral") {
    return [];
  }

  const props: string[] = [];

  // Check each property signature for idempotencyToken annotation
  for (const prop of unwrapped.propertySignatures) {
    const propName = prop.name;
    if (typeof propName !== "string") continue;

    if (hasIdempotencyToken(prop as AST.PropertySignature)) {
      props.push(propName);
    }
  }

  return props;
};

/**
 * Fill in undefined idempotency tokens with generated UUIDs.
 * Uses pre-computed property names for efficiency.
 */
export const fillIdempotencyTokens = (
  input: unknown,
  idempotencyTokenProps: string[],
): unknown => {
  // Fast path: no idempotency tokens to fill
  if (idempotencyTokenProps.length === 0) {
    return input;
  }

  // Check if input is an object
  if (input === null || typeof input !== "object") {
    return input;
  }

  const inputObj = input as Record<string, unknown>;
  let modified = false;
  let result: Record<string, unknown> | undefined;

  // Only check the pre-computed properties
  for (const propName of idempotencyTokenProps) {
    if (inputObj[propName] === undefined) {
      if (!result) {
        result = { ...inputObj };
      }
      result[propName] = crypto.randomUUID();
      modified = true;
    }
  }

  return modified ? result : input;
};

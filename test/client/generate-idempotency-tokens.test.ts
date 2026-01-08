/**
 * Unit tests for idempotency token generation.
 *
 * These tests verify that:
 * 1. Idempotency token properties are correctly identified in schemas
 * 2. Undefined idempotency tokens are filled with UUIDs
 * 3. Provided tokens are preserved
 */

import { expect, it } from "@effect/vitest";
import * as S from "effect/Schema";
import {
  fillIdempotencyTokens,
  findIdempotencyTokenProps,
} from "../../src/client/generate-idempotency-tokens.ts";
import * as T from "../../src/traits.ts";

// Test schema with idempotency token
const CreateRequestSchema = S.Struct({
  Name: S.String,
  ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  Description: S.optional(S.String),
});

// Test schema without idempotency token
const SimpleRequestSchema = S.Struct({
  Name: S.String,
  Value: S.optional(S.String),
});

// Test schema with multiple idempotency tokens (unusual but possible)
const MultiTokenSchema = S.Struct({
  Token1: S.optional(S.String).pipe(T.IdempotencyToken()),
  Token2: S.optional(S.String).pipe(T.IdempotencyToken()),
  Data: S.String,
});

// UUID regex pattern
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

it("findIdempotencyTokenProps finds properties with IdempotencyToken annotation", () => {
  const props = findIdempotencyTokenProps(CreateRequestSchema);

  expect(props).toEqual(["ClientToken"]);
});

it("findIdempotencyTokenProps returns empty array for schemas without idempotency tokens", () => {
  const props = findIdempotencyTokenProps(SimpleRequestSchema);

  expect(props).toEqual([]);
});

it("findIdempotencyTokenProps finds multiple idempotency tokens", () => {
  const props = findIdempotencyTokenProps(MultiTokenSchema);

  expect(props).toHaveLength(2);
  expect(props).toContain("Token1");
  expect(props).toContain("Token2");
});

it("fillIdempotencyTokens generates UUID for undefined token", () => {
  const props = findIdempotencyTokenProps(CreateRequestSchema);
  const input = { Name: "test" };

  const result = fillIdempotencyTokens(input, props) as Record<string, unknown>;

  expect(result.Name).toBe("test");
  expect(typeof result.ClientToken).toBe("string");
  expect(result.ClientToken).toMatch(UUID_REGEX);
});

it("fillIdempotencyTokens preserves provided token", () => {
  const props = findIdempotencyTokenProps(CreateRequestSchema);
  const input = { Name: "test", ClientToken: "my-custom-token" };

  const result = fillIdempotencyTokens(input, props);

  expect(result).toEqual({
    Name: "test",
    ClientToken: "my-custom-token",
  });
});

it("fillIdempotencyTokens returns same object if no tokens need filling", () => {
  const props = findIdempotencyTokenProps(CreateRequestSchema);
  const input = { Name: "test", ClientToken: "provided" };

  const result = fillIdempotencyTokens(input, props);

  // Should return the exact same object (no mutation)
  expect(result).toBe(input);
});

it("fillIdempotencyTokens handles null/undefined input gracefully", () => {
  const props = ["ClientToken"];

  expect(fillIdempotencyTokens(null, props)).toBe(null);
  expect(fillIdempotencyTokens(undefined, props)).toBe(undefined);
});

it("fillIdempotencyTokens is a no-op for schemas without idempotency tokens", () => {
  const props = findIdempotencyTokenProps(SimpleRequestSchema);
  const input = { Name: "test" };

  const result = fillIdempotencyTokens(input, props);

  // Should return the exact same object
  expect(result).toBe(input);
});

it("fillIdempotencyTokens generates unique UUIDs for multiple tokens", () => {
  const props = findIdempotencyTokenProps(MultiTokenSchema);
  const input = { Data: "test" };

  const result = fillIdempotencyTokens(input, props) as Record<string, unknown>;

  expect(result.Token1).toMatch(UUID_REGEX);
  expect(result.Token2).toMatch(UUID_REGEX);
  // UUIDs should be different
  expect(result.Token1).not.toBe(result.Token2);
});

it("fillIdempotencyTokens only fills undefined tokens, not provided ones", () => {
  const props = findIdempotencyTokenProps(MultiTokenSchema);
  const input = { Data: "test", Token1: "provided" };

  const result = fillIdempotencyTokens(input, props) as Record<string, unknown>;

  expect(result.Token1).toBe("provided");
  expect(result.Token2).toMatch(UUID_REGEX);
});

it("generated UUIDs are valid v4 format", () => {
  const props = findIdempotencyTokenProps(CreateRequestSchema);

  // Generate multiple to ensure consistency
  for (let i = 0; i < 10; i++) {
    const input = { Name: "test" };
    const result = fillIdempotencyTokens(input, props) as Record<
      string,
      unknown
    >;
    expect(result.ClientToken).toMatch(UUID_REGEX);
  }
});

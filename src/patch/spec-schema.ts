import { FileSystem, Path } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";

/**
 * Schema for service error patches discovered by the AI agent.
 * These are stored in spec/{service}.json and applied during client generation.
 */

/**
 * Error alias - maps an error tag to an alternative name
 */
export const ErrorAlias = S.Struct({
  /**
   * The original error tag (e.g., "NotFound")
   */
  from: S.String,
  /**
   * The canonical error tag it should be aliased to (e.g., "NoSuchBucket")
   */
  to: S.String,
});
export type ErrorAlias = typeof ErrorAlias.Type;

/**
 * Patches for a single operation
 */
export const OperationPatch = S.Struct({
  /**
   * Additional error types that should be included in this operation's error union.
   * These are error shape names (not full shape IDs).
   */
  errors: S.optional(S.Array(S.String)),
  /**
   * Error aliases - when AWS returns an error with one name that should be treated as another.
   * Useful for deduplicating errors like "Error" vs "ErrorException".
   */
  aliases: S.optional(S.Array(ErrorAlias)),
});
export type OperationPatch = typeof OperationPatch.Type;

/**
 * Member override - specifies that a structure member should be treated differently
 * than what the Smithy model says (e.g., making a required field optional)
 */
export const MemberOverride = S.Struct({
  /**
   * Whether the field should be optional (true) or required (false).
   * If specified, overrides the Smithy model's required trait.
   */
  optional: S.optional(S.Boolean),
});
export type MemberOverride = typeof MemberOverride.Type;

/**
 * Enum override - specifies additional or replacement values for an enum.
 * Use this when AWS returns values not in the Smithy model, or with different casing.
 */
export const EnumOverride = S.Struct({
  /**
   * Additional values to add to the enum (merged with existing values).
   * Use this when AWS returns values not documented in the Smithy model.
   */
  add: S.optional(S.Array(S.String)),
  /**
   * Completely replace the enum values with these.
   * Use this when the Smithy model is wrong and you need full control.
   */
  replace: S.optional(S.Array(S.String)),
});
export type EnumOverride = typeof EnumOverride.Type;

/**
 * Structure override - specifies member overrides for a specific structure
 */
export const StructureOverride = S.Struct({
  /**
   * Map of member names to their overrides
   */
  members: S.Record({ key: S.String, value: MemberOverride }),
});
export type StructureOverride = typeof StructureOverride.Type;

/**
 * Error member patch - adds a member to an error schema.
 * Use this for errors not fully documented in Smithy (e.g., PermanentRedirect).
 */
export const ErrorMemberPatch = S.Struct({
  /**
   * The type of the member (e.g., "string", "boolean", "number")
   */
  type: S.String,
  /**
   * Whether the field is optional (default: true)
   */
  optional: S.optional(S.Boolean),
  /**
   * HTTP header to extract this value from (e.g., "x-amz-bucket-region")
   */
  httpHeader: S.optional(S.String),
});
export type ErrorMemberPatch = typeof ErrorMemberPatch.Type;

/**
 * Error override - specifies members to add to an error schema
 */
export const ErrorOverride = S.Record({
  key: S.String,
  value: ErrorMemberPatch,
});
export type ErrorOverride = typeof ErrorOverride.Type;

/**
 * All patches for a service
 */
export const ServiceSpec = S.Struct({
  /**
   * Map of operation names to their patches
   */
  operations: S.Record({ key: S.String, value: OperationPatch }),
  /**
   * Map of structure names to their member overrides.
   * Use this to fix discrepancies between AWS Smithy models and actual API behavior.
   * For example, when AWS returns undefined for a field marked as required.
   */
  structures: S.optional(S.Record({ key: S.String, value: StructureOverride })),
  /**
   * Map of enum names to their value overrides.
   * Use this to fix enums where AWS returns values not in the Smithy model,
   * or with different casing than documented.
   */
  enums: S.optional(S.Record({ key: S.String, value: EnumOverride })),
  /**
   * Map of error names to their member patches.
   * Use this for errors not fully documented in Smithy models (e.g., PermanentRedirect).
   * Members can include traits like httpHeader to extract values from response headers.
   */
  errors: S.optional(S.Record({ key: S.String, value: ErrorOverride })),
});
export type ServiceSpec = typeof ServiceSpec.Type;

/**
 * Load spec patches for a service from spec/{service}.json
 */
export const loadServiceSpecPatch = Effect.fn(function* (serviceSdkId: string) {
  const fs = yield* FileSystem.FileSystem;
  const p = yield* Path.Path;
  const specPath = p.join(
    "spec",
    `${serviceSdkId.toLowerCase().replaceAll(" ", "-")}.json`,
  );
  return yield* fs.readFileString(specPath).pipe(
    Effect.flatMap(S.decodeUnknown(S.parseJson(ServiceSpec))),
    Effect.catchAll(() => Effect.succeed({ operations: {} } as ServiceSpec)),
  );
});

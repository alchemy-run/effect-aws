/**
 * Path utilities for code generation
 */
import * as Effect from "effect/Effect";
import * as path from "path";

const projectRoot = process.cwd();

export const sourcePath = (service: string, file: string) =>
  Effect.succeed(path.join(projectRoot, "src", "services", service, file));

export const testPath = (service: string, file: string) =>
  Effect.succeed(path.join(projectRoot, "test", "services", service, file));

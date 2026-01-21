import { Tool, Toolkit } from "@effect/ai";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import {
  formatDiagnostics,
  getDiagnosticsIfAvailable,
} from "../services/diagnostics.ts";
import { AgentState } from "../services/state.ts";

export const write = Tool.make("write", {
  description: `Writes a file to the local filesystem.

Usage:
- Use relative paths from the current working directory (e.g., "src/index.ts", "test/fixtures/math.test.ts")
- Do NOT use paths starting with "/" - use relative paths instead
- This tool will overwrite the existing file if there is one at the provided path.
- Parent directories are created automatically if they don't exist.
`,
  parameters: {
    filePath: S.String.annotations({
      description: "The path to the file to write",
    }),
    content: S.String.annotations({
      description: "The content to write to the file",
    }),
  },
  success: S.String,
  failure: S.Never,
});

export const writeTooklit = Toolkit.make(write);

export const writeTooklitLayer = (agentKey: string) =>
  writeTooklit.toLayer(
    Effect.gen(function* () {
      const path = yield* Path.Path;
      const fs = yield* FileSystem.FileSystem;
      const state = yield* AgentState;
      return {
        write: Effect.fn(function* ({ filePath: _filePath, content }) {
          yield* Effect.logDebug(
            `[write] filePath=${_filePath} content.length=${content.length}`,
          );

          const filePath = path.isAbsolute(_filePath)
            ? _filePath
            : path.join(process.cwd(), _filePath);

          // Ensure parent directory exists
          const dir = path.dirname(filePath);
          yield* fs
            .makeDirectory(dir, { recursive: true })
            .pipe(Effect.catchAll(() => Effect.void));

          const writeResult = yield* fs
            .writeFileString(filePath, content)
            .pipe(
              Effect.catchAll((e) =>
                Effect.succeed(`Failed to write file ${filePath}: ${e}`),
              ),
            );

          if (typeof writeResult === "string") {
            yield* Effect.logDebug(`[write] ${writeResult}`);
            return writeResult;
          }

          // Track file in agent state
          yield* state
            .trackFileCreated(agentKey, filePath)
            .pipe(Effect.catchAll(() => Effect.void));

          // Get diagnostics from LSP servers
          const diagnostics = yield* getDiagnosticsIfAvailable(
            filePath,
            content,
          );
          const formatted = formatDiagnostics(diagnostics);

          yield* Effect.logDebug(
            `[write] diagnostics for ${filePath}: ${formatted || "(none)"}`,
          );

          return formatted
            ? `Wrote file: ${filePath}\n\n${formatted}`
            : `Wrote file: ${filePath}`;
        }),
      };
    }),
  );

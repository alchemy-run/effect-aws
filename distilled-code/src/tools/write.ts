import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import { input } from "../input.ts";
import {
  formatDiagnostics,
  getDiagnosticsIfAvailable,
} from "../lsp/diagnostics.ts";
import { output } from "../output.ts";
import { AgentState } from "../state.ts";
import { tool } from "../tool.ts";

export const filePath = input(
  "filePath",
)`The path to the file to write. Use relative paths from the current working directory (e.g., "src/index.ts", "test/fixtures/math.test.ts"). Do NOT use paths starting with "/" - use relative paths instead.`;

export const content = input("content")`The content to write to the file.`;

export const result = output(
  "result",
)`The result of the write operation, including any diagnostics from LSP.`;

export const write = tool("write")`Writes a file to the local filesystem.
Returns the ${result} of the operation.

Given a ${filePath} and ${content}:
- Use relative paths from the current working directory (e.g., "src/index.ts", "test/fixtures/math.test.ts")
- Do NOT use paths starting with "/" - use relative paths instead
- This tool will overwrite the existing file if there is one at the provided path.
- Parent directories are created automatically if they don't exist.
`(function* ({ filePath: _filePath, content }) {
  yield* Effect.logDebug(
    `[write] filePath=${_filePath} content.length=${content.length}`,
  );

  const path = yield* Path.Path;
  const fs = yield* FileSystem.FileSystem;
  const stateOption = yield* Effect.serviceOption(AgentState).pipe(
    Effect.map(Option.getOrUndefined),
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
    return { result: writeResult };
  }

  // Track file in agent state if available
  if (stateOption) {
    const agentKey = "default";
    yield* stateOption
      .trackFileCreated(agentKey, filePath)
      .pipe(Effect.catchAll(() => Effect.void));
  }

  // Get diagnostics from LSP servers
  const diagnostics = yield* getDiagnosticsIfAvailable(filePath, content);
  const formatted = formatDiagnostics(diagnostics);

  yield* Effect.logDebug(
    `[write] diagnostics for ${filePath}: ${formatted || "(none)"}`,
  );

  return {
    result: formatted
      ? `Wrote file: ${filePath}\n\n${formatted}`
      : `Wrote file: ${filePath}`,
  };
});

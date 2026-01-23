import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { input } from "../input.ts";
import {
  formatDiagnostics,
  getDiagnosticsIfAvailable,
} from "../lsp/diagnostics.ts";
import { output } from "../output.ts";
import { tool } from "../tool.ts";
import { replace } from "../util/replace.ts";

export const filePath = input(
  "filePath",
)`The absolute path to the file to modify`;

export const oldString = input(
  "oldString",
)`The text to replace. Use an empty string "" to create a new file.`;

export const newString = input(
  "newString",
)`The text to replace it with (must be different from oldString)`;

export const replaceAll = input(
  "replaceAll",
  S.optional(S.Boolean),
)`Replace all occurrences of oldString (default false). Use this when renaming variables or updating repeated patterns.`;

export const result = output(
  "result",
)`The result of the edit operation, including any diagnostics from LSP.`;

export const edit = tool("edit")`Performs exact string replacements in files.
Returns the ${result} of the operation.

Given a ${filePath}, ${oldString}, and ${newString}:
- Replaces the first occurrence of oldString with newString
- Use ${replaceAll} to replace all occurrences
- Use empty oldString ("") to create a new file with newString as content

Usage:
- You must use your \`Read\` tool at least once in the conversation before editing. This tool will error if you attempt an edit without reading the file.
- When editing text from Read tool output, ensure you preserve the exact indentation (tabs/spaces) as it appears AFTER the line number prefix. The line number prefix format is: spaces + line number + tab. Everything after that tab is the actual file content to match. Never include any part of the line number prefix in the oldString or newString.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- Only use emojis if the user explicitly requests it. Avoid adding emojis to files unless asked.
- The edit will FAIL if \`oldString\` is not found in the file with an error "oldString not found in content".
- The edit will FAIL if \`oldString\` is found multiple times in the file with an error "oldString found multiple times and requires more code context to uniquely identify the intended match". Either provide a larger string with more surrounding context to make it unique or use \`replaceAll\` to change every instance of \`oldString\`.
- Use \`replaceAll\` for replacing and renaming strings across the file. This parameter is useful if you want to rename a variable for instance.
`(function* ({
  filePath: _filePath,
  oldString,
  newString,
  replaceAll: doReplaceAll,
}) {
  yield* Effect.logDebug(
    `[edit] filePath=${_filePath} oldString.length=${oldString.length} newString.length=${newString.length} replaceAll=${doReplaceAll}`,
  );

  const pathService = yield* Path.Path;
  const fs = yield* FileSystem.FileSystem;

  const filePath = pathService.isAbsolute(_filePath)
    ? _filePath
    : pathService.join(process.cwd(), _filePath);

  // Determine new content and whether this is a create operation
  let newContent: string;

  if (oldString === "") {
    // Create new file
    newContent = newString;
  } else {
    // Edit existing file - validate it exists
    const stat = yield* fs
      .stat(filePath)
      .pipe(Effect.catchAll(() => Effect.succeed(null)));

    if (!stat) {
      return { result: `File not found: ${filePath}` };
    }
    if (stat.type === "Directory") {
      return { result: `Path is a directory, not a file: ${filePath}` };
    }

    // Read existing content
    const oldContent = yield* fs
      .readFileString(filePath)
      .pipe(
        Effect.catchAll((e) => Effect.succeed(`Failed to read file: ${e}`)),
      );
    if (oldContent.startsWith("Failed to read")) {
      return { result: oldContent };
    }

    // Perform replacement
    const replaceResult = yield* replace(
      oldContent,
      oldString,
      newString,
      doReplaceAll ?? false,
    ).pipe(
      Effect.catchTag("ReplaceSameStringError", () =>
        Effect.succeed("oldString and newString must be different"),
      ),
      Effect.catchTag("ReplaceNotFoundError", (e) =>
        Effect.succeed(
          `Could not find oldString in file. The text "${e.oldString.slice(0, 100)}${e.oldString.length > 100 ? "..." : ""}" was not found in ${filePath}.`,
        ),
      ),
      Effect.catchTag("ReplaceMultipleMatchesError", (e) =>
        Effect.succeed(
          `Found multiple matches for oldString "${e.oldString.slice(0, 50)}${e.oldString.length > 50 ? "..." : ""}". Provide more surrounding context to identify the correct match, or use replaceAll=true to replace all occurrences.`,
        ),
      ),
    );

    // Check for replace errors
    if (
      replaceResult.startsWith("Could not find") ||
      replaceResult.startsWith("Found multiple") ||
      replaceResult.startsWith("oldString and newString")
    ) {
      yield* Effect.logDebug(`[edit] ${replaceResult}`);
      return { result: replaceResult };
    }
    newContent = replaceResult;
  }

  const isCreate = oldString === "";

  // Write file
  const writeResult = yield* fs
    .writeFileString(filePath, newContent)
    .pipe(
      Effect.catchAll((e) =>
        Effect.succeed(
          `Failed to ${isCreate ? "create" : "write"} file: ${e.message}`,
        ),
      ),
    );
  if (typeof writeResult === "string") {
    yield* Effect.logDebug(`[edit] ${writeResult}`);
    return { result: writeResult };
  }

  // Get diagnostics from LSP servers
  const diagnostics = yield* getDiagnosticsIfAvailable(filePath, newContent);
  const formatted = formatDiagnostics(diagnostics);

  yield* Effect.logDebug(
    `[edit] diagnostics for ${filePath}: ${formatted || "(none)"}`,
  );

  const action = isCreate ? "Created" : "Edited";
  return {
    result: formatted
      ? `${action} file: ${filePath}\n\n${formatted}`
      : `${action} file: ${filePath}`,
  };
});

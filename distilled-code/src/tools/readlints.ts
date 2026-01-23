import * as Path from "@effect/platform/Path";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { input } from "../input.ts";
import { formatDiagnostic } from "../lsp/diagnostics.ts";
import { LSPManager } from "../lsp/index.ts";
import { output } from "../output.ts";
import { tool } from "../tool.ts";

export const paths = input(
  "paths",
  S.optional(S.Array(S.String)),
)`Optional array of paths to files or directories to read linter errors for. If not provided, returns diagnostics for all files in the workspace.`;

export const diagnostics = output(
  "diagnostics",
)`The linter errors and diagnostics for the specified paths.`;

export const readlints = tool(
  "readlints",
)`Read and display linter errors from the workspace.
Returns ${diagnostics} for the specified files.

Given optional ${paths}:
- If a file path is provided, returns diagnostics for that file only
- If a directory path is provided, returns diagnostics for all files within that directory
- If no paths are provided, returns diagnostics for all files in the workspace
- This tool can return linter errors that were already present before your edits, so avoid calling it with a very wide scope of files
- NEVER call this tool on a file unless you've edited it or are about to edit it
`(function* ({ paths: inputPaths }) {
  yield* Effect.logDebug(`[readlints] paths=${JSON.stringify(inputPaths)}`);

  const pathService = yield* Path.Path;
  const lspManager = yield* LSPManager;

  const resolvedPaths = (inputPaths ?? []).map((p) =>
    pathService.isAbsolute(p) ? p : pathService.join(process.cwd(), p),
  );

  // Get diagnostics for each path
  const allDiagnostics = yield* Effect.forEach(
    resolvedPaths,
    (filePath) =>
      lspManager
        .getDiagnostics(filePath)
        .pipe(Effect.map((diags) => ({ filePath, diags }))),
    { concurrency: "unbounded" },
  );

  // Format output grouped by file
  const results: string[] = [];
  for (const { filePath, diags } of allDiagnostics) {
    if (diags.length > 0) {
      results.push(`${filePath}:`);
      for (const d of diags) {
        results.push(`  ${formatDiagnostic(d)}`);
      }
    }
  }

  yield* Effect.logDebug(
    `[readlints] found ${results.length} files with diagnostics`,
  );

  if (results.length === 0) {
    return {
      diagnostics:
        resolvedPaths.length > 0
          ? `No linter errors found in specified paths`
          : `No linter errors found`,
    };
  }

  return { diagnostics: results.join("\n") };
});

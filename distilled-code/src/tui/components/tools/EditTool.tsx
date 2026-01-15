/**
 * EditTool - File editing with diff display
 */
import { Show, Switch, Match, createMemo, For } from "solid-js";
import { useTheme } from "../../context/theme.tsx";
import { InlineTool } from "./InlineTool.tsx";
import { BlockTool } from "./BlockTool.tsx";
import type { ToolPart, EditMetadata } from "../../types.ts";
import { normalizePath, formatInput } from "./utils.ts";

export interface EditToolProps {
  part: ToolPart;
}

interface DiagnosticEntry {
  severity: number;
  message: string;
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
}

export function EditTool(props: EditToolProps) {
  const { theme } = useTheme();

  const input = createMemo(() => props.part.state.input ?? {});
  const metadata = createMemo(
    () => (props.part.state.metadata ?? {}) as EditMetadata
  );

  const filePath = createMemo(() => (input().filePath as string) ?? "");
  const diff = createMemo(() => metadata().diff ?? "");

  const diagnostics = createMemo(() => {
    const diag = metadata().diagnostics;
    if (!diag) return [];
    const normalized = normalizePath(filePath());
    // Try to find diagnostics for this file
    for (const [path, errors] of Object.entries(diag)) {
      if (path.includes(normalized) || normalized.includes(path)) {
        return (errors as DiagnosticEntry[])
          .filter((e) => e.severity === 1)
          .slice(0, 3);
      }
    }
    return [];
  });

  // Simple diff display - show added/removed lines
  const diffLines = createMemo(() => {
    const lines = diff().split("\n");
    return lines.slice(0, 20); // Limit to 20 lines
  });

  return (
    <Switch>
      <Match when={metadata().diff !== undefined}>
        <BlockTool title={"← Edit " + normalizePath(filePath())} part={props.part}>
          <box paddingLeft={1}>
            <For each={diffLines()}>
              {(line) => (
                <text
                  color={
                    line.startsWith("+")
                      ? theme.diffAdded
                      : line.startsWith("-")
                      ? theme.diffRemoved
                      : theme.text
                  }
                >
                  {line}
                </text>
              )}
            </For>
            <Show when={diff().split("\n").length > 20}>
              <text color={theme.textMuted}>
                ... ({diff().split("\n").length - 20} more lines)
              </text>
            </Show>
          </box>
          <Show when={diagnostics().length > 0}>
            <box>
              <For each={diagnostics()}>
                {(diagnostic) => (
                  <text color={theme.error}>
                    Error [{diagnostic.range.start.line + 1}:
                    {diagnostic.range.start.character + 1}] {diagnostic.message}
                  </text>
                )}
              </For>
            </box>
          </Show>
        </BlockTool>
      </Match>
      <Match when={true}>
        <InlineTool
          icon="←"
          pending="Preparing edit..."
          complete={filePath()}
          part={props.part}
        >
          Edit {normalizePath(filePath())}{" "}
          {formatInput({ replaceAll: input().replaceAll })}
        </InlineTool>
      </Match>
    </Switch>
  );
}

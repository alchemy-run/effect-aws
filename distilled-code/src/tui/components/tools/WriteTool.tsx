/**
 * WriteTool - File writing display
 */
import { Show, Switch, Match, createMemo, For } from "solid-js";
import { useTheme } from "../../context/theme.tsx";
import { InlineTool } from "./InlineTool.tsx";
import { BlockTool } from "./BlockTool.tsx";
import type { ToolPart, WriteMetadata } from "../../types.ts";
import { normalizePath } from "./utils.ts";

export interface WriteToolProps {
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

export function WriteTool(props: WriteToolProps) {
  const { theme } = useTheme();

  const input = createMemo(() => props.part.state.input ?? {});
  const metadata = createMemo(
    () => (props.part.state.metadata ?? {}) as WriteMetadata
  );

  const filePath = createMemo(() => (input().filePath as string) ?? "");
  const content = createMemo(() => (input().content as string) ?? "");

  const diagnostics = createMemo(() => {
    const diag = metadata().diagnostics;
    if (!diag) return [];
    const normalized = normalizePath(filePath());
    for (const [path, errors] of Object.entries(diag)) {
      if (path.includes(normalized) || normalized.includes(path)) {
        return (errors as DiagnosticEntry[])
          .filter((e) => e.severity === 1)
          .slice(0, 3);
      }
    }
    return [];
  });

  // Show first few lines of content
  const preview = createMemo(() => {
    const lines = content().split("\n").slice(0, 10);
    return lines.join("\n");
  });

  return (
    <Switch>
      <Match when={metadata().diagnostics !== undefined || props.part.state.status === "completed"}>
        <BlockTool title={"# Wrote " + normalizePath(filePath())} part={props.part}>
          <box>
            <text color={theme.text}>{preview()}</text>
            <Show when={content().split("\n").length > 10}>
              <text color={theme.textMuted}>
                ... ({content().split("\n").length - 10} more lines)
              </text>
            </Show>
          </box>
          <Show when={diagnostics().length > 0}>
            <For each={diagnostics()}>
              {(diagnostic) => (
                <text color={theme.error}>
                  Error [{diagnostic.range.start.line}:
                  {diagnostic.range.start.character}]: {diagnostic.message}
                </text>
              )}
            </For>
          </Show>
        </BlockTool>
      </Match>
      <Match when={true}>
        <InlineTool
          icon="←"
          pending="Preparing write..."
          complete={filePath()}
          part={props.part}
        >
          Write {normalizePath(filePath())}
        </InlineTool>
      </Match>
    </Switch>
  );
}

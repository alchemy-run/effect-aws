/**
 * BashTool - Shell command execution display
 */
import { Show, Switch, Match, createMemo, createSignal } from "solid-js";
import { useTheme } from "../../context/theme.tsx";
import { InlineTool } from "./InlineTool.tsx";
import { BlockTool } from "./BlockTool.tsx";
import type { ToolPart, BashMetadata } from "../../types.ts";

export interface BashToolProps {
  part: ToolPart;
}

export function BashTool(props: BashToolProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = createSignal(false);

  const input = createMemo(() => props.part.state.input ?? {});
  const metadata = createMemo(
    () => (props.part.state.metadata ?? {}) as BashMetadata
  );

  const command = createMemo(() => (input().command as string) ?? "");
  const description = createMemo(() => (input().description as string) ?? "Shell");
  const output = createMemo(() => {
    const out = metadata().output?.trim() ?? "";
    // Strip ANSI codes
    return out.replace(/\x1B\[[0-9;]*[A-Za-z]/g, "");
  });

  const lines = createMemo(() => output().split("\n"));
  const overflow = createMemo(() => lines().length > 10);
  const limited = createMemo(() => {
    if (expanded() || !overflow()) return output();
    return [...lines().slice(0, 10), "…"].join("\n");
  });

  return (
    <Switch>
      <Match when={metadata().output !== undefined}>
        <BlockTool
          title={"# " + description()}
          part={props.part}
          onClick={overflow() ? () => setExpanded((prev) => !prev) : undefined}
        >
          <box gap={1}>
            <text color={theme.text}>$ {command()}</text>
            <text color={theme.text}>{limited()}</text>
            <Show when={overflow()}>
              <text color={theme.textMuted}>
                {expanded() ? "Click to collapse" : "Click to expand"}
              </text>
            </Show>
          </box>
        </BlockTool>
      </Match>
      <Match when={true}>
        <InlineTool
          icon="$"
          pending="Writing command..."
          complete={command()}
          part={props.part}
        >
          {command()}
        </InlineTool>
      </Match>
    </Switch>
  );
}

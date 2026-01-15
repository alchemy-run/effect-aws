/**
 * SpawnTool - Sub-agent task display
 */
import { Show, Switch, Match, createMemo } from "solid-js";
import { useTheme } from "../../context/theme.tsx";
import { InlineTool } from "./InlineTool.tsx";
import { BlockTool } from "./BlockTool.tsx";
import type { ToolPart, SpawnMetadata, ToolState } from "../../types.ts";

export interface SpawnToolProps {
  part: ToolPart;
  onNavigate?: (sessionID: string) => void;
}

function titlecase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

interface SummaryItem {
  tool: string;
  state: ToolState;
  title?: string;
}

export function SpawnTool(props: SpawnToolProps) {
  const { theme } = useTheme();

  const input = createMemo(() => props.part.state.input ?? {});
  const metadata = createMemo(
    () => (props.part.state.metadata ?? {}) as SpawnMetadata
  );

  const description = createMemo(() => (input().description as string) ?? "");
  const subagentType = createMemo(
    () => (input().subagent_type as string) ?? "task"
  );
  const summary = createMemo(() => (metadata().summary ?? []) as SummaryItem[]);
  const sessionID = createMemo(() => metadata().sessionID);

  const current = createMemo(() => {
    const items = summary();
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].state.status !== "pending") {
        return items[i];
      }
    }
    return undefined;
  });

  const handleClick = () => {
    const sid = sessionID();
    if (sid && props.onNavigate) {
      props.onNavigate(sid);
    }
  };

  return (
    <Switch>
      <Match when={summary().length > 0}>
        <BlockTool
          title={"# " + titlecase(subagentType()) + " Task"}
          onClick={sessionID() ? handleClick : undefined}
          part={props.part}
        >
          <box>
            <text style={{ color: theme.textMuted }}>
              {description()} ({summary().length} toolcalls)
            </text>
            <Show when={current()}>
              <text
                style={{
                  color:
                    current()!.state.status === "error"
                      ? theme.error
                      : theme.textMuted,
                }}
              >
                └ {titlecase(current()!.tool)}{" "}
                {current()!.state.status === "completed" ? current()!.title : ""}
              </text>
            </Show>
          </box>
          <Show when={sessionID()}>
            <text color={theme.text}>
              <span style={{ color: theme.textMuted }}>Click to view subagent</span>
            </text>
          </Show>
        </BlockTool>
      </Match>
      <Match when={true}>
        <InlineTool
          icon="◉"
          iconColor={theme.secondary}
          pending="Delegating..."
          complete={subagentType() || description()}
          part={props.part}
        >
          <span style={{ color: theme.text }}>{titlecase(subagentType())}</span> Task
          "{description()}"
        </InlineTool>
      </Match>
    </Switch>
  );
}

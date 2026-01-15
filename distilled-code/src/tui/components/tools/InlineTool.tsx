/**
 * InlineTool - Single line tool display
 * Used for simple tools like Read, Glob, Grep
 */
import { Show, createMemo, type JSX } from "solid-js";
import { useTheme } from "../../context/theme.tsx";
import type { ToolPart } from "../../types.ts";

export interface InlineToolProps {
  icon: string;
  iconColor?: string;
  pending: string;
  complete: unknown; // Truthy when tool has completed
  children: JSX.Element;
  part?: ToolPart;
}

export function InlineTool(props: InlineToolProps) {
  const { theme } = useTheme();

  const error = createMemo(() =>
    props.part?.state.status === "error" ? props.part.state.error : undefined
  );

  const denied = createMemo(() =>
    error()?.includes("rejected") || error()?.includes("denied")
  );

  const fg = createMemo(() => {
    if (props.complete) return theme.textMuted;
    return theme.text;
  });

  return (
    <box paddingLeft={3}>
      <text color={fg()}>
        <Show fallback={<>~ {props.pending}</>} when={props.complete}>
          <span style={{ color: props.iconColor ?? theme.textMuted }}>
            {props.icon}
          </span>{" "}
          {props.children}
        </Show>
      </text>
      <Show when={error() && !denied()}>
        <text color={theme.error}>{error()}</text>
      </Show>
    </box>
  );
}

/**
 * BlockTool - Expandable block tool display
 * Used for complex tools like Bash, Edit, Write, Task
 */
import { Show, createMemo, createSignal, type JSX } from "solid-js";
import { useTheme } from "../../context/theme.tsx";
import { SplitBorder } from "../Border.tsx";
import type { ToolPart } from "../../types.ts";

export interface BlockToolProps {
  title: string;
  children: JSX.Element;
  onClick?: () => void;
  part?: ToolPart;
}

export function BlockTool(props: BlockToolProps) {
  const { theme } = useTheme();
  const [hover, setHover] = createSignal(false);

  const error = createMemo(() =>
    props.part?.state.status === "error" ? props.part.state.error : undefined
  );

  return (
    <box
      border={["left"]}
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={2}
      marginTop={1}
      gap={1}
      backgroundColor={hover() ? theme.backgroundMenu : theme.backgroundPanel}
      customBorderChars={SplitBorder.customBorderChars}
      borderColor={theme.background}
      onMouseOver={() => props.onClick && setHover(true)}
      onMouseOut={() => setHover(false)}
      onMouseUp={() => props.onClick?.()}
    >
      <text paddingLeft={3} color={theme.textMuted}>
        {props.title}
      </text>
      {props.children}
      <Show when={error()}>
        <text color={theme.error}>{error()}</text>
      </Show>
    </box>
  );
}

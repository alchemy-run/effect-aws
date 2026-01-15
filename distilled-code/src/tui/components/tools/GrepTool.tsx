/**
 * GrepTool - Content search display
 */
import { Show, createMemo } from "solid-js";
import { InlineTool } from "./InlineTool.tsx";
import type { ToolPart, GrepMetadata } from "../../types.ts";
import { normalizePath } from "./utils.ts";

export interface GrepToolProps {
  part: ToolPart;
}

export function GrepTool(props: GrepToolProps) {
  const input = createMemo(() => props.part.state.input ?? {});
  const metadata = createMemo(
    () => (props.part.state.metadata ?? {}) as GrepMetadata
  );

  const pattern = createMemo(() => (input().pattern as string) ?? "");
  const path = createMemo(() => (input().path as string) ?? "");
  const matches = createMemo(() => metadata().matches);

  return (
    <InlineTool
      icon="✱"
      pending="Searching content..."
      complete={pattern()}
      part={props.part}
    >
      Grep "{pattern()}"
      <Show when={path()}> in {normalizePath(path())} </Show>
      <Show when={matches() !== undefined}>({matches()} matches)</Show>
    </InlineTool>
  );
}

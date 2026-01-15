/**
 * GlobTool - File pattern matching display
 */
import { Show, createMemo } from "solid-js";
import { InlineTool } from "./InlineTool.tsx";
import type { ToolPart, GlobMetadata } from "../../types.ts";
import { normalizePath } from "./utils.ts";

export interface GlobToolProps {
  part: ToolPart;
}

export function GlobTool(props: GlobToolProps) {
  const input = createMemo(() => props.part.state.input ?? {});
  const metadata = createMemo(
    () => (props.part.state.metadata ?? {}) as GlobMetadata
  );

  const pattern = createMemo(() => (input().pattern as string) ?? "");
  const path = createMemo(() => (input().path as string) ?? "");
  const count = createMemo(() => metadata().count);

  return (
    <InlineTool
      icon="✱"
      pending="Finding files..."
      complete={pattern()}
      part={props.part}
    >
      Glob "{pattern()}"
      <Show when={path()}> in {normalizePath(path())} </Show>
      <Show when={count() !== undefined}>({count()} matches)</Show>
    </InlineTool>
  );
}

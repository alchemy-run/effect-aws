/**
 * ReadTool - File reading display
 */
import { createMemo } from "solid-js";
import { InlineTool } from "./InlineTool.tsx";
import type { ToolPart } from "../../types.ts";
import { normalizePath, formatInput } from "./utils.ts";

export interface ReadToolProps {
  part: ToolPart;
}

export function ReadTool(props: ReadToolProps) {
  const input = createMemo(() => props.part.state.input ?? {});
  const filePath = createMemo(() => (input().filePath as string) ?? "");

  return (
    <InlineTool
      icon="→"
      pending="Reading file..."
      complete={filePath()}
      part={props.part}
    >
      Read {normalizePath(filePath())} {formatInput(input(), ["filePath"])}
    </InlineTool>
  );
}

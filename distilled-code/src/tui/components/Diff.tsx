import { For, Show } from "solid-js";
import { computeDiff, DiffLine } from "../util/diff.ts";

export interface DiffProps {
  filePath: string;
  oldContent: string;
  newContent: string;
  contextLines?: number;
}

export function Diff(props: DiffProps) {
  const lines = () => computeDiff(props.oldContent, props.newContent);
  
  const hasChanges = () => lines().some(l => l.type !== "unchanged");
  
  // Filter to show only changes with minimal context
  const visibleLines = () => {
    const all = lines();
    const contextSize = props.contextLines ?? 2;
    const result: (DiffLine & { showEllipsis?: boolean })[] = [];
    
    // Find indices of changed lines
    const changedIndices = new Set<number>();
    all.forEach((line, i) => {
      if (line.type !== "unchanged") {
        for (let j = Math.max(0, i - contextSize); j <= Math.min(all.length - 1, i + contextSize); j++) {
          changedIndices.add(j);
        }
      }
    });
    
    let lastIncluded = -1;
    for (let i = 0; i < all.length; i++) {
      if (changedIndices.has(i)) {
        if (lastIncluded !== -1 && i > lastIncluded + 1) {
          result.push({ type: "unchanged", content: "...", showEllipsis: true });
        }
        result.push(all[i]);
        lastIncluded = i;
      }
    }
    
    return result;
  };

  return (
    <box flexDirection="column" paddingLeft={1}>
      <text bold color="cyan">
        {props.filePath}
      </text>
      <Show when={hasChanges()} fallback={<text dimmed>(no changes)</text>}>
        <box flexDirection="column" marginTop={1}>
          <For each={visibleLines()}>
            {(line) => (
              <Show
                when={!line.showEllipsis}
                fallback={<text dimmed>  ...</text>}
              >
                <DiffLineView line={line} />
              </Show>
            )}
          </For>
        </box>
      </Show>
    </box>
  );
}

function DiffLineView(props: { line: DiffLine }) {
  const prefix = () => {
    switch (props.line.type) {
      case "added": return "+";
      case "removed": return "-";
      default: return " ";
    }
  };
  
  const color = () => {
    switch (props.line.type) {
      case "added": return "green";
      case "removed": return "red";
      default: return undefined;
    }
  };

  return (
    <text color={color()} dimmed={props.line.type === "unchanged"}>
      {prefix()}{props.line.content}
    </text>
  );
}

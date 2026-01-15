import { For, Show, createSignal } from "solid-js";
import { Spinner } from "./Spinner.tsx";
import { SubAgentTask } from "../types.ts";

export interface SubAgentViewProps {
  tasks: SubAgentTask[];
  collapsed?: boolean;
  onToggle?: () => void;
}

export function SubAgentView(props: SubAgentViewProps) {
  const [collapsed, setCollapsed] = createSignal(props.collapsed ?? false);

  const completedCount = () => 
    props.tasks.filter(t => t.status === "completed").length;
  
  const runningCount = () =>
    props.tasks.filter(t => t.status === "running").length;

  const hasError = () =>
    props.tasks.some(t => t.status === "error");

  const statusColor = () => {
    if (hasError()) return "red";
    if (runningCount() > 0) return "yellow";
    if (completedCount() === props.tasks.length) return "green";
    return "gray";
  };

  const toggle = () => {
    setCollapsed(!collapsed());
    props.onToggle?.();
  };

  return (
    <box flexDirection="column" marginTop={1} marginBottom={1}>
      <box>
        <text 
          color={statusColor()} 
          bold
          onClick={toggle}
        >
          {collapsed() ? "▶" : "▼"} Sub-agents ({completedCount()}/{props.tasks.length})
        </text>
        <Show when={runningCount() > 0}>
          <text color="yellow"> ({runningCount()} running)</text>
        </Show>
      </box>
      
      <Show when={!collapsed()}>
        <box flexDirection="column" paddingLeft={2} marginTop={1}>
          <For each={props.tasks}>
            {(task) => <SubAgentTaskView task={task} />}
          </For>
        </box>
      </Show>
    </box>
  );
}

function SubAgentTaskView(props: { task: SubAgentTask }) {
  const statusIcon = () => {
    switch (props.task.status) {
      case "pending": return "○";
      case "running": return "◐";
      case "completed": return "●";
      case "error": return "✗";
    }
  };

  const statusColor = () => {
    switch (props.task.status) {
      case "pending": return "gray";
      case "running": return "yellow";
      case "completed": return "green";
      case "error": return "red";
    }
  };

  // Truncate prompt for display
  const displayPrompt = () => {
    const maxLen = 60;
    if (props.task.prompt.length <= maxLen) return props.task.prompt;
    return props.task.prompt.slice(0, maxLen - 3) + "...";
  };

  return (
    <box flexDirection="column" marginBottom={1}>
      <box>
        <text color={statusColor()}>
          {statusIcon()} [{props.task.id}]
        </text>
        <text> {displayPrompt()}</text>
      </box>
      
      <Show when={props.task.status === "running"}>
        <box paddingLeft={2}>
          <Spinner label="Working..." />
        </box>
      </Show>
      
      <Show when={props.task.status === "completed" && props.task.result}>
        <box paddingLeft={2}>
          <text dimmed>{truncateResult(props.task.result!)}</text>
        </box>
      </Show>
      
      <Show when={props.task.status === "error" && props.task.error}>
        <box paddingLeft={2}>
          <text color="red">{props.task.error}</text>
        </box>
      </Show>
    </box>
  );
}

function truncateResult(result: string, maxLen: number = 100): string {
  const firstLine = result.split("\n")[0];
  if (firstLine.length <= maxLen) return firstLine;
  return firstLine.slice(0, maxLen - 3) + "...";
}

/**
 * MessageStream Component
 *
 * Scrollable list of display events from the backend.
 * Now simplified to just render DisplayEvents - no transformation or buffering needed.
 * All processing is done by MessagingService on the backend.
 */

import { TextAttributes } from "@opentui/core";
import { For, Match, Show, Switch } from "solid-js";
import type { DisplayEvent } from "../../state/index.ts";
import { useTheme } from "../context/theme.tsx";
import { MarkdownContent } from "./markdown-content.tsx";
import { ToolPart } from "./tool-parts.tsx";

/**
 * Props for MessageStream
 */
export interface MessageStreamProps {
  /**
   * Display events from MessagingService - the single source of truth.
   * Already transformed and buffered by the backend.
   */
  events: () => DisplayEvent[];

  /**
   * Height of the message area
   */
  height: number;
}

/**
 * Render a user message
 */
function UserMessage(props: { content: string }) {
  const { theme } = useTheme();

  return (
    <box flexDirection="column" marginBottom={1}>
      <box flexDirection="row" gap={1}>
        <text fg={theme.warning} attributes={TextAttributes.BOLD}>
          You
        </text>
      </box>
      <box paddingLeft={2}>
        <text fg={theme.text}>{props.content}</text>
      </box>
    </box>
  );
}

/**
 * Render an assistant message (streaming or complete)
 */
function AssistantMessage(props: {
  agentId: string;
  content: string;
  isStreaming?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <box flexDirection="column" marginBottom={1}>
      <box flexDirection="row" gap={1}>
        <text fg={theme.success} attributes={TextAttributes.BOLD}>
          @{props.agentId}
        </text>
        <Show when={props.isStreaming}>
          <text fg={theme.textMuted}>●</text>
        </Show>
      </box>
      <box paddingLeft={2}>
        <MarkdownContent content={props.content} streaming={props.isStreaming} />
      </box>
    </box>
  );
}

/**
 * Render a streaming text delta (for DMs)
 */
function StreamingDelta(props: { agentId: string; delta: string }) {
  const { theme } = useTheme();

  return (
    <box flexDirection="column" marginBottom={1}>
      <box flexDirection="row" gap={1}>
        <text fg={theme.success} attributes={TextAttributes.BOLD}>
          @{props.agentId}
        </text>
        <text fg={theme.textMuted}>●</text>
      </box>
      <box paddingLeft={2}>
        <text fg={theme.text}>{props.delta}</text>
      </box>
    </box>
  );
}

/**
 * Render coordinator thinking indicator
 */
function CoordinatorThinking() {
  const { theme } = useTheme();

  return (
    <box flexDirection="row" gap={1} marginBottom={1} paddingLeft={1}>
      <text fg={theme.textMuted}>●</text>
      <text fg={theme.textMuted}>Thinking...</text>
    </box>
  );
}

/**
 * Render coordinator invoke indicator
 */
function CoordinatorInvoke(props: { agents: readonly string[] }) {
  const { theme } = useTheme();

  return (
    <box flexDirection="column" marginBottom={1} paddingLeft={1}>
      <For each={props.agents}>
        {(agentId) => (
          <box flexDirection="row" gap={1}>
            <text fg={theme.textMuted}>●</text>
            <text fg={theme.textMuted}>Invoking @{agentId}...</text>
          </box>
        )}
      </For>
    </box>
  );
}

/**
 * Render a tool call
 */
function ToolCall(props: {
  toolId: string;
  toolName: string;
  params: Record<string, unknown>;
  result?: unknown;
  error?: string;
  isComplete: boolean;
}) {
  return (
    <ToolPart
      tool={{
        id: props.toolId,
        name: props.toolName,
        params: props.params,
        result: props.result,
        error: props.error,
        isComplete: props.isComplete,
      }}
    />
  );
}

/**
 * Render a single display event
 */
function DisplayEventRenderer(props: { event: DisplayEvent }) {
  return (
    <Switch>
      <Match when={props.event.type === "display-user-message"}>
        <UserMessage
          content={(props.event as { content: string }).content}
        />
      </Match>

      <Match when={props.event.type === "display-assistant-start"}>
        <AssistantMessage
          agentId={(props.event as { agentId: string }).agentId}
          content="..."
          isStreaming={true}
        />
      </Match>

      <Match when={props.event.type === "display-assistant-delta"}>
        <StreamingDelta
          agentId={(props.event as { agentId: string }).agentId}
          delta={(props.event as { delta: string }).delta}
        />
      </Match>

      <Match when={props.event.type === "display-assistant-complete"}>
        <AssistantMessage
          agentId={(props.event as { agentId: string }).agentId}
          content={(props.event as { content: string }).content}
          isStreaming={false}
        />
      </Match>

      <Match when={props.event.type === "display-tool-call"}>
        <ToolCall
          toolId={(props.event as { toolId: string }).toolId}
          toolName={(props.event as { toolName: string }).toolName}
          params={(props.event as { params: Record<string, unknown> }).params}
          isComplete={false}
        />
      </Match>

      <Match when={props.event.type === "display-tool-result"}>
        <ToolCall
          toolId={(props.event as { toolId: string }).toolId}
          toolName="tool"
          params={{}}
          result={(props.event as { result: unknown }).result}
          error={(props.event as { error?: string }).error}
          isComplete={true}
        />
      </Match>

      <Match when={props.event.type === "display-coordinator-thinking"}>
        <CoordinatorThinking />
      </Match>

      <Match when={props.event.type === "display-coordinator-invoke"}>
        <CoordinatorInvoke
          agents={(props.event as { agents: readonly string[] }).agents}
        />
      </Match>

      <Match when={props.event.type === "display-coordinator-complete"}>
        {/* Completion events don't render anything visible - they just remove indicators */}
        {null}
      </Match>
    </Switch>
  );
}

/**
 * Scrollable message stream component
 *
 * Now simplified: just renders DisplayEvents from the backend.
 * No transformation, buffering, or channel-type logic needed.
 */
export function MessageStream(props: MessageStreamProps) {
  const { theme } = useTheme();

  // Filter out events that shouldn't be rendered (like coordinator-complete)
  // and handle streaming deltas by accumulating them
  const renderableEvents = () => {
    const events = props.events();
    const result: DisplayEvent[] = [];
    const streamingText = new Map<string, string>();

    // First pass: collect all completed agents
    const completedAgents = new Set<string>();
    for (const event of events) {
      if (event.type === "display-coordinator-complete") {
        completedAgents.add(event.agentId);
      } else if (event.type === "display-assistant-complete") {
        completedAgents.add(event.agentId);
      }
    }

    // Second pass: build renderable events
    for (const event of events) {
      switch (event.type) {
        case "display-assistant-delta": {
          // Accumulate streaming deltas per agent
          const current = streamingText.get(event.agentId) ?? "";
          streamingText.set(event.agentId, current + event.delta);
          // Don't add individual deltas - we'll add accumulated text
          break;
        }

        case "display-assistant-complete":
        case "display-assistant-start": {
          // Clear any accumulated streaming text for this agent
          streamingText.delete(event.agentId);
          result.push(event);
          break;
        }

        case "display-coordinator-complete":
        case "display-coordinator-thinking":
          // Don't render these coordinator events
          break;

        case "display-coordinator-invoke": {
          // Only show invoke for agents that haven't completed yet
          const pendingAgents = event.agents.filter(
            (agentId) => !completedAgents.has(agentId),
          );
          if (pendingAgents.length > 0) {
            result.push({
              ...event,
              agents: pendingAgents,
            });
          }
          break;
        }

        default:
          result.push(event);
      }
    }

    // Add any still-streaming agents
    for (const [agentId, text] of streamingText) {
      if (text) {
        result.push({
          type: "display-assistant-complete",
          agentId,
          content: text,
          timestamp: Date.now(),
        });
      }
    }

    return result;
  };

  return (
    <scrollbox height={props.height} stickyScroll={true} stickyStart="bottom">
      <box flexDirection="column" padding={1}>
        <Show
          when={renderableEvents().length > 0}
          fallback={
            <box justifyContent="center" alignItems="center" height="100%">
              <text fg={theme.textMuted}>
                No messages yet. Start a conversation!
              </text>
            </box>
          }
        >
          <For each={renderableEvents()}>
            {(event) => <DisplayEventRenderer event={event} />}
          </For>
        </Show>
      </box>
    </scrollbox>
  );
}

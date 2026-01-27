/**
 * MessageStream Component
 *
 * Scrollable list of messages with streaming support.
 */

import { createMemo, For, Show } from "solid-js";
import { TextAttributes } from "@opentui/core";
import type { MessagePart } from "../../state/index.ts";

/**
 * Props for MessageStream
 */
export interface MessageStreamProps {
  /**
   * Message parts to render
   */
  parts: () => MessagePart[];

  /**
   * Height of the message area
   */
  height: number;
}

/**
 * Accumulated message from parts
 */
interface AccumulatedMessage {
  role: "user" | "assistant" | "tool";
  content: string;
  toolName?: string;
  isStreaming?: boolean;
}

/**
 * Convert message parts to accumulated messages for display
 */
function accumulateMessages(parts: MessagePart[]): AccumulatedMessage[] {
  const messages: AccumulatedMessage[] = [];
  let currentAssistantText = "";
  let isStreaming = false;

  for (const part of parts) {
    switch (part.type) {
      case "user-input":
        // Flush any pending assistant text
        if (currentAssistantText) {
          messages.push({
            role: "assistant",
            content: currentAssistantText,
            isStreaming: false,
          });
          currentAssistantText = "";
        }
        messages.push({
          role: "user",
          content: part.content,
        });
        break;

      case "text-start":
        isStreaming = true;
        break;

      case "text-delta":
        currentAssistantText += (part as any).delta || "";
        break;

      case "text-end":
        if (currentAssistantText) {
          messages.push({
            role: "assistant",
            content: currentAssistantText,
            isStreaming: false,
          });
          currentAssistantText = "";
        }
        isStreaming = false;
        break;

      case "tool-call":
        messages.push({
          role: "tool",
          content: `Calling: ${(part as any).name || "tool"}`,
          toolName: (part as any).name,
        });
        break;

      case "tool-result":
        messages.push({
          role: "tool",
          content: `Result: ${JSON.stringify((part as any).value || (part as any).result).slice(0, 100)}...`,
        });
        break;
    }
  }

  // Add any pending streaming text
  if (currentAssistantText || isStreaming) {
    messages.push({
      role: "assistant",
      content: currentAssistantText || "...",
      isStreaming: true,
    });
  }

  return messages;
}

/**
 * Render a single message
 */
function Message(props: { message: AccumulatedMessage }) {
  const roleColor = () => {
    switch (props.message.role) {
      case "user":
        return "#fab283";
      case "assistant":
        return "#83fab2";
      case "tool":
        return "#8383fa";
    }
  };

  const roleLabel = () => {
    switch (props.message.role) {
      case "user":
        return "You";
      case "assistant":
        return "Assistant";
      case "tool":
        return "Tool";
    }
  };

  return (
    <box flexDirection="column" marginBottom={1}>
      <box flexDirection="row" gap={1}>
        <text fg={roleColor()} attributes={TextAttributes.BOLD}>
          {roleLabel()}
        </text>
        <Show when={props.message.isStreaming}>
          <text fg="#6a6a6a">●</text>
        </Show>
      </box>
      <box paddingLeft={2}>
        <text fg="#d0d0d0">{props.message.content}</text>
      </box>
    </box>
  );
}

/**
 * Scrollable message stream component
 */
export function MessageStream(props: MessageStreamProps) {
  const messages = createMemo(() => accumulateMessages(props.parts()));

  return (
    <scrollbox height={props.height} stickyScroll={true} stickyStart="bottom">
      <box flexDirection="column" padding={1}>
        <Show
          when={messages().length > 0}
          fallback={
            <box justifyContent="center" alignItems="center" height="100%">
              <text fg="#6a6a6a">No messages yet. Start a conversation!</text>
            </box>
          }
        >
          <For each={messages()}>{(msg) => <Message message={msg} />}</For>
        </Show>
      </box>
    </scrollbox>
  );
}

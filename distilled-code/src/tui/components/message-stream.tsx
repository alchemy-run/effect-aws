/**
 * MessageStream Component
 *
 * Scrollable list of messages with streaming support.
 * Uses createStore for fine-grained reactivity to avoid flickering.
 */

import { createEffect, For, on, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { TextAttributes } from "@opentui/core";
import type { MessagePart } from "../../state/index.ts";
import { useTheme } from "../context/theme.tsx";

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
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  toolName?: string;
  isStreaming: boolean;
}

/**
 * Render a single message
 */
function Message(props: { message: AccumulatedMessage }) {
  const { theme, syntax } = useTheme();

  const roleColor = () => {
    switch (props.message.role) {
      case "user":
        return theme.warning;
      case "assistant":
        return theme.success;
      case "tool":
        return theme.accent;
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
          <text fg={theme.textMuted}>●</text>
        </Show>
      </box>
      <box paddingLeft={2}>
        <Show
          when={props.message.role === "assistant"}
          fallback={<text fg={theme.text}>{props.message.content}</text>}
        >
          <code
            filetype="markdown"
            streaming={props.message.isStreaming}
            syntaxStyle={syntax()}
            content={props.message.content}
            conceal={false}
            fg={theme.text}
          />
        </Show>
      </box>
    </box>
  );
}

/**
 * Scrollable message stream component
 * Uses a store to enable fine-grained updates without full re-renders
 */
export function MessageStream(props: MessageStreamProps) {
  const { theme } = useTheme();
  
  // Use a store for fine-grained reactivity
  const [messages, setMessages] = createStore<AccumulatedMessage[]>([]);

  // Process parts into messages, updating the store incrementally
  createEffect(
    on(
      () => props.parts(),
      (parts) => {
        const newMessages: AccumulatedMessage[] = [];
        let currentAssistantText = "";
        let isStreaming = false;
        let userCount = 0;
        let assistantCount = 0;
        let toolCount = 0;

        for (const part of parts) {
          switch (part.type) {
            case "user-input":
              // Flush any pending assistant text
              if (currentAssistantText) {
                newMessages.push({
                  id: `assistant-${assistantCount++}`,
                  role: "assistant",
                  content: currentAssistantText,
                  isStreaming: false,
                });
                currentAssistantText = "";
              }
              newMessages.push({
                id: `user-${userCount++}`,
                role: "user",
                content: part.content,
                isStreaming: false,
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
                newMessages.push({
                  id: `assistant-${assistantCount++}`,
                  role: "assistant",
                  content: currentAssistantText,
                  isStreaming: false,
                });
                currentAssistantText = "";
              }
              isStreaming = false;
              break;

            case "tool-call":
              newMessages.push({
                id: `tool-${toolCount++}`,
                role: "tool",
                content: `Calling: ${(part as any).name || "tool"}`,
                toolName: (part as any).name,
                isStreaming: false,
              });
              break;

            case "tool-result":
              newMessages.push({
                id: `tool-${toolCount++}`,
                role: "tool",
                content: `Result: ${JSON.stringify((part as any).value || (part as any).result).slice(0, 100)}...`,
                isStreaming: false,
              });
              break;
          }
        }

        // Add any pending streaming text
        if (currentAssistantText || isStreaming) {
          newMessages.push({
            id: `assistant-${assistantCount}`,
            role: "assistant",
            content: currentAssistantText || "...",
            isStreaming: true,
          });
        }

        // Update store using produce for fine-grained updates
        setMessages(
          produce((draft) => {
            // Update existing messages in-place where possible
            for (let i = 0; i < newMessages.length; i++) {
              if (i < draft.length) {
                // Update existing message in-place
                const existing = draft[i];
                const updated = newMessages[i];
                if (existing.id === updated.id) {
                  // Same message, update properties
                  existing.content = updated.content;
                  existing.isStreaming = updated.isStreaming;
                } else {
                  // Different message, replace
                  draft[i] = updated;
                }
              } else {
                // Add new message
                draft.push(newMessages[i]);
              }
            }
            // Remove extra messages
            if (draft.length > newMessages.length) {
              draft.splice(newMessages.length);
            }
          }),
        );
      },
    ),
  );

  return (
    <scrollbox height={props.height} stickyScroll={true} stickyStart="bottom">
      <box flexDirection="column" padding={1}>
        <Show
          when={messages.length > 0}
          fallback={
            <box justifyContent="center" alignItems="center" height="100%">
              <text fg={theme.textMuted}>No messages yet. Start a conversation!</text>
            </box>
          }
        >
          <For each={messages}>{(msg) => <Message message={msg} />}</For>
        </Show>
      </box>
    </scrollbox>
  );
}

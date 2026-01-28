/**
 * MessageStream Component
 *
 * Scrollable list of messages with streaming support.
 * Uses createStore for fine-grained reactivity to avoid flickering.
 */

import type { MessageEncoded } from "@effect/ai/Prompt";
import { TextAttributes } from "@opentui/core";
import { createEffect, createMemo, For, on, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { MessagePart } from "../../state/index.ts";
import { useTheme } from "../context/theme.tsx";
import { MarkdownContent } from "./markdown-content.tsx";
import { ToolPart } from "./tool-parts.tsx";

/**
 * Props for MessageStream
 */
export interface MessageStreamProps {
  /**
   * Historical messages from the messages table
   */
  messages: () => readonly MessageEncoded[];

  /**
   * Streaming parts for the current turn
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
  toolParams?: Record<string, unknown>;
  toolResult?: unknown;
  toolError?: string;
  isComplete?: boolean;
  isStreaming: boolean;
}

/**
 * Convert historical MessageEncoded[] to AccumulatedMessage[]
 */
function messagesToAccumulated(
  messages: readonly MessageEncoded[],
): AccumulatedMessage[] {
  const result: AccumulatedMessage[] = [];
  let userCount = 0;
  let assistantCount = 0;

  // Debug: log raw messages structure
  if (messages.length > 0) {
    console.log("[MessageStream] Loading", messages.length, "historical messages");
    for (const msg of messages) {
      console.log("[MessageStream] Message:", msg.role, "content type:", typeof msg.content, Array.isArray(msg.content) ? `array(${msg.content.length})` : "");
      if (Array.isArray(msg.content)) {
        for (const block of msg.content) {
          console.log("[MessageStream]   Block:", JSON.stringify(block).slice(0, 200));
        }
      }
    }
  }

  for (const msg of messages) {
    if (msg.role === "user") {
      const content =
        typeof msg.content === "string"
          ? msg.content
          : Array.isArray(msg.content)
            ? msg.content
                .filter(
                  (b): b is { type: "text"; text: string } =>
                    typeof b === "object" && b !== null && "type" in b && b.type === "text",
                )
                .map((b) => b.text)
                .join("")
            : "";
      result.push({
        id: `hist-user-${userCount++}`,
        role: "user",
        content,
        isStreaming: false,
      });
    } else if (msg.role === "assistant") {
      // Handle assistant messages - content can be string or array
      if (typeof msg.content === "string") {
        // Simple text response
        if (msg.content) {
          result.push({
            id: `hist-assistant-${assistantCount++}`,
            role: "assistant",
            content: msg.content,
            isStreaming: false,
          });
        }
      } else if (Array.isArray(msg.content)) {
        // Complex response with potential tool calls
        let textContent = "";
        for (const block of msg.content) {
          if (typeof block === "object" && block !== null && "type" in block) {
            if (block.type === "text" && "text" in block) {
              textContent += block.text;
            } else if (block.type === "tool-call" && "id" in block && "name" in block) {
              // Flush text before tool
              if (textContent) {
                result.push({
                  id: `hist-assistant-${assistantCount++}`,
                  role: "assistant",
                  content: textContent,
                  isStreaming: false,
                });
                textContent = "";
              }
              result.push({
                id: `hist-tool-call-${block.id}`,
                role: "tool",
                content: String(block.name),
                toolName: String(block.name),
                toolParams: (block as any).params || {},
                isComplete: false,
                isStreaming: false,
              });
            } else if (block.type === "tool-result" && "id" in block) {
              // Find and update matching tool-call
              const matchIdx = result.findIndex(
                (m) => m.id === `hist-tool-call-${block.id}`,
              );
              if (matchIdx >= 0) {
                result[matchIdx].toolResult = (block as any).value;
                result[matchIdx].isComplete = true;
              }
            }
          }
        }
        if (textContent) {
          result.push({
            id: `hist-assistant-${assistantCount++}`,
            role: "assistant",
            content: textContent,
            isStreaming: false,
          });
        }
      }
    }
  }
  
  // Debug: log what we produced
  if (result.length > 0) {
    console.log("[MessageStream] Produced", result.length, "accumulated messages");
    for (const msg of result) {
      console.log("[MessageStream]   Result:", msg.role, msg.id, msg.content?.slice(0, 50));
    }
  }
  
  return result;
}

/**
 * Convert streaming MessagePart[] to AccumulatedMessage[]
 */
function partsToAccumulated(parts: MessagePart[]): AccumulatedMessage[] {
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
            id: `stream-assistant-${assistantCount++}`,
            role: "assistant",
            content: currentAssistantText,
            isStreaming: false,
          });
          currentAssistantText = "";
        }
        newMessages.push({
          id: `stream-user-${userCount++}`,
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
            id: `stream-assistant-${assistantCount++}`,
            role: "assistant",
            content: currentAssistantText,
            isStreaming: false,
          });
          currentAssistantText = "";
        }
        isStreaming = false;
        break;

      case "tool-call": {
        const toolPart = part as any;
        newMessages.push({
          id: `stream-tool-call-${toolPart.id || toolCount++}`,
          role: "tool",
          content: toolPart.name || "tool",
          toolName: toolPart.name,
          toolParams: toolPart.params || {},
          isComplete: false,
          isStreaming: false,
        });
        break;
      }

      case "tool-result": {
        const resultPart = part as any;
        // Find matching tool-call and update it, or create standalone result
        const matchingIdx = newMessages.findIndex(
          (m) =>
            m.role === "tool" &&
            m.id === `stream-tool-call-${resultPart.id}` &&
            !m.isComplete,
        );
        if (matchingIdx >= 0) {
          // Update the existing tool-call with its result
          newMessages[matchingIdx] = {
            ...newMessages[matchingIdx],
            toolResult: resultPart.value ?? resultPart.result,
            toolError: resultPart.error ? String(resultPart.error) : undefined,
            isComplete: true,
          };
        } else {
          // Standalone result (shouldn't normally happen)
          newMessages.push({
            id: `stream-tool-result-${resultPart.id || toolCount++}`,
            role: "tool",
            content: "unknown",
            toolName: "unknown",
            toolResult: resultPart.value ?? resultPart.result,
            toolError: resultPart.error ? String(resultPart.error) : undefined,
            isComplete: true,
            isStreaming: false,
          });
        }
        break;
      }
    }
  }

  // Add any pending streaming text
  if (currentAssistantText || isStreaming) {
    newMessages.push({
      id: `stream-assistant-${assistantCount}`,
      role: "assistant",
      content: currentAssistantText || "...",
      isStreaming: true,
    });
  }

  return newMessages;
}

/**
 * Render a single message
 */
function Message(props: { message: AccumulatedMessage }) {
  const { theme } = useTheme();

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

  // Render tool messages with specialized tool rendering
  if (props.message.role === "tool") {
    return (
      <ToolPart
        tool={{
          id: props.message.id,
          name: props.message.toolName || "unknown",
          params: props.message.toolParams || {},
          result: props.message.toolResult,
          error: props.message.toolError,
          isComplete: props.message.isComplete ?? false,
        }}
      />
    );
  }

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
          <MarkdownContent
            content={props.message.content}
            streaming={props.message.isStreaming}
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

  // Memoize conversions - only recompute when source changes
  const historicalMessages = createMemo(() =>
    messagesToAccumulated(props.messages()),
  );
  const streamingMessages = createMemo(() =>
    partsToAccumulated(props.parts()),
  );

  // Combine historical + streaming, updating the store incrementally
  createEffect(
    on(
      () => [historicalMessages(), streamingMessages()] as const,
      ([history, streaming]) => {
        const combined = [...history, ...streaming];

        // Update store using produce for fine-grained updates
        setMessages(
          produce((draft) => {
            // Update existing messages in-place where possible
            for (let i = 0; i < combined.length; i++) {
              if (i < draft.length) {
                // Update existing message in-place
                const existing = draft[i];
                const updated = combined[i];
                if (existing.id === updated.id) {
                  // Same message, update properties
                  existing.content = updated.content;
                  existing.isStreaming = updated.isStreaming;
                  // Update tool-specific properties
                  if (updated.role === "tool") {
                    existing.toolResult = updated.toolResult;
                    existing.toolError = updated.toolError;
                    existing.isComplete = updated.isComplete;
                  }
                } else {
                  // Different message, replace
                  draft[i] = updated;
                }
              } else {
                // Add new message
                draft.push(combined[i]);
              }
            }
            // Remove extra messages
            if (draft.length > combined.length) {
              draft.splice(combined.length);
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

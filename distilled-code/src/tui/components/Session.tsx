/**
 * Session component - Main chat session view with message list and prompt
 * Based on OpenCode's session/index.tsx patterns
 */
import {
  createMemo,
  createSignal,
  For,
  Show,
  Switch,
  Match,
} from "solid-js";
import { useTheme } from "../context/theme.tsx";
import { useSync } from "../context/sync.tsx";
import { SplitBorder } from "./Border.tsx";
import { Prompt, type PromptRef } from "./Prompt.tsx";
import { UserMessage, AssistantMessage } from "./Message.tsx";
import type {
  Message,
  UserMessage as UserMessageType,
  AssistantMessage as AssistantMessageType,
} from "../types.ts";

// =============================================================================
// Types
// =============================================================================

export interface SessionProps {
  sessionID?: string;
  agentName?: string;
  modelName?: string;
  onSubmit?: (message: string) => void;
  onInterrupt?: () => void;
  onNavigateSubAgent?: (sessionID: string) => void;
}

// =============================================================================
// Header Component
// =============================================================================

function Header(props: { title?: string; context?: string; cost?: string }) {
  const { theme } = useTheme();

  return (
    <box flexShrink={0}>
      <box
        paddingTop={1}
        paddingBottom={1}
        paddingLeft={2}
        paddingRight={1}
        {...SplitBorder}
        border={["left"]}
        borderColor={theme.border}
        flexShrink={0}
        backgroundColor={theme.backgroundPanel}
      >
        <box flexDirection="row" justifyContent="space-between" gap={1}>
          <text color={theme.text}>
            <span style={{ bold: true }}>#</span>{" "}
            <span style={{ bold: true }}>{props.title ?? "New Session"}</span>
          </text>
          <Show when={props.context}>
            <text color={theme.textMuted} wrapMode="none" flexShrink={0}>
              {props.context}
              <Show when={props.cost}> ({props.cost})</Show>
            </text>
          </Show>
        </box>
      </box>
    </box>
  );
}

// =============================================================================
// Session Component
// =============================================================================

export function Session(props: SessionProps) {
  const { theme } = useTheme();
  const sync = useSync();

  // Local state
  const [interruptCount, setInterruptCount] = createSignal(0);
  let promptRef: PromptRef | undefined;
  let scrollRef: { scrollTo: (height: number) => void; scrollHeight: number } | undefined;

  // Get messages from sync context
  const messages = createMemo(() => sync.data.messages);
  const parts = createMemo(() => sync.data.parts);
  const status = createMemo(() => sync.data.sessionStatus);
  const session = createMemo(() => sync.data.session);

  // Find last assistant message
  const lastAssistant = createMemo(() => {
    const msgs = messages();
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "assistant") {
        return msgs[i];
      }
    }
    return undefined;
  });

  // Scroll to bottom helper
  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef) {
        scrollRef.scrollTo(scrollRef.scrollHeight);
      }
    }, 50);
  };

  // Handle message submit
  const handleSubmit = (message: string) => {
    props.onSubmit?.(message);
    scrollToBottom();
  };

  // Handle interrupt with double-ESC pattern
  const handleInterrupt = () => {
    setInterruptCount((prev) => prev + 1);

    // Reset interrupt count after 5 seconds
    setTimeout(() => {
      setInterruptCount(0);
    }, 5000);

    // Interrupt on second press
    if (interruptCount() >= 1) {
      props.onInterrupt?.();
      setInterruptCount(0);
    }
  };

  return (
    <box flexGrow={1} paddingBottom={1} paddingTop={1} paddingLeft={2} paddingRight={2} gap={1}>
      <Show when={session()}>
        <Header title={session()?.title} />
      </Show>

      {/* Message list */}
      <scrollbox
        ref={(r: typeof scrollRef) => { scrollRef = r; }}
        stickyScroll={true}
        stickyStart="bottom"
        flexGrow={1}
      >
        <Show
          when={messages().length > 0}
          fallback={
            <box
              flexGrow={1}
              justifyContent="center"
              alignItems="center"
              paddingTop={2}
            >
              <text color={theme.textMuted}>
                Start a conversation by typing below...
              </text>
            </box>
          }
        >
          <For each={messages()}>
            {(message, index) => (
              <Switch>
                <Match when={message.role === "user"}>
                  <UserMessage
                    message={message as UserMessageType}
                    parts={parts()[message.id] ?? []}
                    index={index()}
                  />
                </Match>
                <Match when={message.role === "assistant"}>
                  <AssistantMessage
                    message={message as AssistantMessageType}
                    parts={parts()[message.id] ?? []}
                    isLast={lastAssistant()?.id === message.id}
                    onNavigateSubAgent={props.onNavigateSubAgent}
                  />
                </Match>
              </Switch>
            )}
          </For>
        </Show>
      </scrollbox>

      {/* Prompt */}
      <box flexShrink={0}>
        <Prompt
          ref={(r: PromptRef) => { promptRef = r; }}
          status={status()}
          interruptCount={interruptCount()}
          agentName={props.agentName}
          modelName={props.modelName}
          onSubmit={handleSubmit}
          onInterrupt={handleInterrupt}
          disabled={status().type === "running"}
        />
      </box>
    </box>
  );
}

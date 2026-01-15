/**
 * Main App component
 * Renders the session view with all OpenCode-inspired UI patterns
 */
import { createSignal, Show, For } from "solid-js";
import { useTheme } from "./context/theme.tsx";
import { Session, Spinner, Message, SplitBorder } from "./components/index.ts";
import type { MessageData, SubAgentTask } from "./types.ts";
import { log } from "../util/log.ts";

// =============================================================================
// Key Bindings - Enter submits, Shift+Enter adds newline
// =============================================================================

type TextareaAction = "move-left" | "move-right" | "move-up" | "move-down" | "select-left" | "select-right" | "select-up" | "select-down" | "line-home" | "line-end" | "select-line-home" | "select-line-end" | "visual-line-home" | "visual-line-end" | "select-visual-line-home" | "select-visual-line-end" | "buffer-home" | "buffer-end" | "select-buffer-home" | "select-buffer-end" | "delete-line" | "delete-to-line-end" | "delete-to-line-start" | "backspace" | "delete" | "newline" | "undo" | "redo" | "word-forward" | "word-backward" | "select-word-forward" | "select-word-backward" | "delete-word-forward" | "delete-word-backward" | "submit";

interface KeyBinding {
  name: string;
  ctrl?: boolean;
  shift?: boolean;
  meta?: boolean;
  super?: boolean;
  action: TextareaAction;
}

const promptKeyBindings: KeyBinding[] = [
  // Enter submits the message
  { name: "return", action: "submit" },
  // Shift+Enter adds a new line (using meta/option on Mac)
  { name: "return", shift: true, action: "newline" },
  { name: "return", meta: true, action: "newline" },
];

// =============================================================================
// Props
// =============================================================================

export interface AppProps {
  onMessage: (message: string) => void;
  onInterrupt: () => void;
  messages: () => MessageData[];
  subAgents: () => SubAgentTask[];
  isProcessing: () => boolean;
}

// =============================================================================
// App Component
// =============================================================================

export function App(props: AppProps) {
  const { theme } = useTheme();
  const [interruptCount, setInterruptCount] = createSignal(0);
  let textareaRef: { plainText: string; clear: () => void } | undefined;

  // Handle interrupt with double-ESC pattern
  const handleInterrupt = () => {
    setInterruptCount((prev) => prev + 1);

    // Reset after 5 seconds
    setTimeout(() => setInterruptCount(0), 5000);

    // Interrupt on second press
    if (interruptCount() >= 1) {
      props.onInterrupt();
      setInterruptCount(0);
    }
  };

  // Handle message submit - get value from textarea ref
  const handleSubmit = () => {
    log("App", "handleSubmit called");
    
    if (!textareaRef) {
      log("App", "handleSubmit: no textareaRef");
      return;
    }
    const value = textareaRef.plainText.trim();
    log("App", "handleSubmit value", { value });
    if (!value) return;
    props.onMessage(value);
    textareaRef.clear();
  };

  return (
    <box
      flexDirection="column"
      height="100%"
      backgroundColor={theme.background}
    >
      {/* Header */}
      <box
        flexShrink={0}
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
        backgroundColor={theme.backgroundPanel}
        border={["bottom"]}
        borderColor={theme.border}
      >
        <text fg={theme.text} bold>
          Effect Code
        </text>
        <text fg={theme.textMuted}> - AI Coding Agent</text>
      </box>

      {/* Main content area with messages */}
      <scrollbox
        flexGrow={1}
        stickyScroll={true}
        stickyStart="bottom"
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
      >
        <Show
          when={props.messages().length > 0}
          fallback={
            <box
              flexGrow={1}
              justifyContent="center"
              alignItems="center"
              paddingTop={4}
            >
              <text fg={theme.textMuted}>
                Start a conversation by typing below...
              </text>
            </box>
          }
        >
          <For each={props.messages()}>
            {(message) => (
              <Message message={message} parts={message.parts} />
            )}
          </For>
        </Show>
      </scrollbox>

      {/* Sub-agents display */}
      <Show when={props.subAgents().length > 0}>
        <box
          flexShrink={0}
          paddingLeft={2}
          paddingRight={2}
          paddingTop={1}
          backgroundColor={theme.backgroundPanel}
          border={["top"]}
          borderColor={theme.border}
        >
          <text fg={theme.textMuted}>Sub-agents:</text>
          <For each={props.subAgents()}>
            {(agent) => (
              <box flexDirection="row" gap={1} paddingLeft={1}>
                <text
                  fg={
                    agent.status === "completed"
                      ? theme.success
                      : agent.status === "error"
                      ? theme.error
                      : agent.status === "running"
                      ? theme.warning
                      : theme.textMuted
                  }
                >
                  {agent.status === "running" ? "⏳" : agent.status === "completed" ? "✓" : agent.status === "error" ? "✗" : "○"}
                </text>
                <text fg={theme.text}>{agent.description || agent.prompt}</text>
              </box>
            )}
          </For>
        </box>
      </Show>

      {/* Input area */}
      <box flexShrink={0} paddingLeft={2} paddingRight={2} paddingBottom={1}>
        <box
          border={["left"]}
          borderColor={props.isProcessing() ? theme.warning : theme.primary}
          customBorderChars={{
            ...SplitBorder.customBorderChars,
            bottomLeft: "╹",
          }}
        >
          <box
            paddingLeft={2}
            paddingRight={2}
            paddingTop={1}
            paddingBottom={1}
            backgroundColor={theme.backgroundElement}
          >
            <textarea
              placeholder="Ask anything..."
              textColor={theme.text}
              focusedTextColor={theme.text}
              minHeight={1}
              maxHeight={6}
              focused={!props.isProcessing()}
              keyBindings={promptKeyBindings}
              ref={(r: typeof textareaRef) => { textareaRef = r; }}
              onSubmit={handleSubmit}
              onKeyDown={(e: { name: string; preventDefault: () => void }) => {
                if (e.name === "escape") {
                  e.preventDefault();
                  handleInterrupt();
                }
              }}
              focusedBackgroundColor={theme.backgroundElement}
              cursorColor={theme.text}
            />
            <box flexDirection="row" flexShrink={0} paddingTop={1} gap={2}>
              <text fg={theme.primary}>Agent</text>
              <text fg={theme.textMuted}>claude-sonnet</text>
            </box>
          </box>
        </box>
      </box>

      {/* Status bar */}
      <box
        flexShrink={0}
        paddingLeft={2}
        paddingRight={2}
        paddingBottom={1}
        flexDirection="row"
        justifyContent="space-between"
      >
        <Show when={props.isProcessing()}>
          <box flexDirection="row" gap={1}>
            <Spinner style="braille" />
            <text fg={interruptCount() > 0 ? theme.primary : theme.text}>
              esc{" "}
              <span
                style={{
                  fg: interruptCount() > 0 ? theme.primary : theme.textMuted,
                }}
              >
                {interruptCount() > 0 ? "again to interrupt" : "interrupt"}
              </span>
            </text>
          </box>
        </Show>
        <Show when={!props.isProcessing()}>
          <text fg={theme.textMuted}>Ready</text>
        </Show>
        <text fg={theme.textMuted}>
          ctrl+x <span style={{ fg: theme.text }}>commands</span>
        </text>
      </box>
    </box>
  );
}

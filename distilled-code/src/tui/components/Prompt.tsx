/**
 * Prompt component - Enhanced input with status display
 * Based on OpenCode's Prompt component patterns
 */
import { createSignal, createMemo, Show, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { useTheme } from "../context/theme.tsx";
import { useSync } from "../context/sync.tsx";
import { EmptyBorder } from "./Border.tsx";
import { Spinner } from "./Spinner.tsx";
import type { SessionStatus } from "../types.ts";

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
// Types
// =============================================================================

export interface PromptRef {
  focused: boolean;
  value: string;
  set: (value: string) => void;
  reset: () => void;
  blur: () => void;
  focus: () => void;
  submit: () => void;
}

export interface PromptProps {
  visible?: boolean;
  disabled?: boolean;
  placeholder?: string;
  status?: SessionStatus;
  interruptCount?: number;
  onSubmit?: (value: string) => void;
  onInterrupt?: () => void;
  ref?: (ref: PromptRef) => void;
  hint?: JSX.Element;
  agentName?: string;
  modelName?: string;
}

// =============================================================================
// Component
// =============================================================================

export function Prompt(props: PromptProps) {
  let input: { clear: () => void; setText: (text: string) => void; blur: () => void; focus: () => void; plainText: string; cursorColor?: unknown } | undefined;
  const { theme } = useTheme();
  const sync = useSync();

  const [store, setStore] = createStore({
    value: "",
    focused: true,
  });

  // Status from props or sync context
  const status = createMemo(() => props.status ?? sync.data.sessionStatus);
  const isRunning = createMemo(() => status().type === "running");
  const isRetry = createMemo(() => status().type === "retry");
  const interruptCount = createMemo(() => props.interruptCount ?? 0);

  // Highlight color for the input border
  const highlight = createMemo(() => {
    if (isRunning()) return theme.warning;
    return theme.primary;
  });

  // Handle submit
  const handleSubmit = () => {
    const value = store.value.trim();
    if (!value || props.disabled) return;
    
    // Check for exit commands
    if (value === "exit" || value === "quit" || value === ":q") {
      // Could trigger exit here
      return;
    }

    props.onSubmit?.(value);
    setStore("value", "");
    if (input) input.clear();
  };

  // Expose ref
  if (props.ref) {
    props.ref({
      get focused() {
        return store.focused;
      },
      get value() {
        return store.value;
      },
      set(value: string) {
        setStore("value", value);
        if (input) input.setText(value);
      },
      reset() {
        setStore("value", "");
        if (input) input.clear();
      },
      blur() {
        input?.blur();
        setStore("focused", false);
      },
      focus() {
        input?.focus();
        setStore("focused", true);
      },
      submit: handleSubmit,
    });
  }

  return (
    <box visible={props.visible !== false}>
      {/* Main input area */}
      <box
        border={["left"]}
        borderColor={highlight()}
        customBorderChars={{
          ...EmptyBorder,
          vertical: "┃",
          bottomLeft: "╹",
        }}
      >
        <box
          paddingLeft={2}
          paddingRight={2}
          paddingTop={1}
          flexShrink={0}
          backgroundColor={theme.backgroundElement}
          flexGrow={1}
        >
          <textarea
            placeholder={props.placeholder ?? "Ask anything..."}
            textColor={theme.text}
            focusedTextColor={theme.text}
            minHeight={1}
            maxHeight={6}
            focused={!props.disabled}
            keyBindings={promptKeyBindings}
            onContentChange={() => {
              if (input) {
                setStore("value", input.plainText);
              }
            }}
            onSubmit={handleSubmit}
            onKeyDown={(e: { name: string; preventDefault: () => void }) => {
              if (props.disabled) {
                e.preventDefault();
                return;
              }
              // Handle ESC for interrupt
              if (e.name === "escape" && props.onInterrupt) {
                e.preventDefault();
                props.onInterrupt();
                return;
              }
            }}
            ref={(r: typeof input) => {
              input = r;
              setTimeout(() => {
                if (input) input.cursorColor = theme.text;
              }, 0);
            }}
            focusedBackgroundColor={theme.backgroundElement}
            cursorColor={theme.text}
          />
          
          {/* Agent and model info */}
          <box flexDirection="row" flexShrink={0} paddingTop={1} gap={1}>
            <text color={highlight()}>
              {props.agentName ?? "Agent"}{" "}
            </text>
            <box flexDirection="row" gap={1}>
              <text flexShrink={0} color={theme.text}>
                {props.modelName ?? "claude-sonnet"}
              </text>
            </box>
          </box>
        </box>
      </box>

      {/* Status bar */}
      <box flexDirection="row" justifyContent="space-between" paddingTop={1}>
        <Show when={isRunning()} fallback={<text />}>
          <box
            flexDirection="row"
            gap={1}
            flexGrow={1}
            justifyContent="space-between"
          >
            <box flexShrink={0} flexDirection="row" gap={1}>
              <box marginLeft={1}>
                <Spinner label="" />
              </box>
              <Show when={isRetry()}>
                {(() => {
                  const retryStatus = status() as { type: "retry"; message: string; attempt: number };
                  return (
                    <text color={theme.error}>
                      {retryStatus.message} [retry #{retryStatus.attempt}]
                    </text>
                  );
                })()}
              </Show>
            </box>
            <text color={interruptCount() > 0 ? theme.primary : theme.text}>
              esc{" "}
              <span style={{ color: interruptCount() > 0 ? theme.primary : theme.textMuted }}>
                {interruptCount() > 0 ? "again to interrupt" : "interrupt"}
              </span>
            </text>
          </box>
        </Show>
        <Show when={!isRunning()}>
          <box gap={2} flexDirection="row">
            <text color={theme.text}>
              ctrl+x{" "}
              <span style={{ color: theme.textMuted }}>commands</span>
            </text>
          </box>
        </Show>
      </box>

      {/* Optional hint */}
      <Show when={props.hint}>
        <box paddingTop={1}>{props.hint}</box>
      </Show>
    </box>
  );
}

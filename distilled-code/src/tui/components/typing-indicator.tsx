/**
 * TypingIndicator Component
 *
 * Displays which agents are currently typing/thinking in a channel or group chat.
 * Similar to Slack/Discord's "X is typing..." indicator.
 */

import { For, Show } from "solid-js";
import { useTheme } from "../context/theme.tsx";

/**
 * Props for TypingIndicator
 */
export interface TypingIndicatorProps {
  /**
   * List of agent IDs that are currently typing
   */
  agents: readonly string[];
}

/**
 * Typing indicator component that shows which agents are thinking
 */
export function TypingIndicator(props: TypingIndicatorProps) {
  const { theme } = useTheme();

  return (
    <Show when={props.agents.length > 0}>
      <box
        flexDirection="column"
        paddingLeft={1}
        paddingTop={1}
        paddingBottom={1}
      >
        <For each={props.agents}>
          {(agent) => (
            <box flexDirection="row" gap={1}>
              <text fg={theme.warning}>@{agent}</text>
              <text fg={theme.textMuted}>is thinking...</text>
              <text fg={theme.accent}>●</text>
            </box>
          )}
        </For>
      </box>
    </Show>
  );
}

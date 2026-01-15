import { For, Show } from "solid-js";
import { MessageData } from "../types.ts";

export interface ChatProps {
  messages: MessageData[];
  isLoading?: boolean;
}

export function Chat(props: ChatProps) {
  // Simple message rendering - avoid complex nesting
  if (props.messages.length === 0) {
    return (
      <box flexDirection="column" flexGrow={1}>
        <text dimmed wrapMode="word">Start a conversation by typing below...</text>
      </box>
    );
  }
  
  return (
    <box flexDirection="column" flexGrow={1}>
      <For each={props.messages}>
        {(message) => (
          <box flexDirection="column" marginBottom={1}>
            <text bold color={message.role === "user" ? "blue" : "green"}>
              {message.role === "user" ? "You" : "Agent"}
            </text>
            <box paddingLeft={2} flexDirection="column">
              <text wrapMode="word">{message.content || (message.isStreaming ? "Thinking..." : "")}</text>
            </box>
          </box>
        )}
      </For>
    </box>
  );
}

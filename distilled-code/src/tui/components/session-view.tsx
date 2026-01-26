/**
 * SessionView Component
 *
 * Chat view for a selected agent/thread with message stream and input.
 */

import { TextAttributes } from "@opentui/core";
import { useTerminalDimensions } from "@opentui/solid";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import { createSignal, Show } from "solid-js";
import { spawn } from "../../agent.ts";
import { StateStore, type MessagePart } from "../../state/index.ts";
import { useRegistry } from "../context/registry.tsx";
import {
  createEffectEffect,
  useEffectCallback,
} from "../hooks/use-effect.ts";
import { InputBox } from "./input-box.tsx";
import { MessageStream } from "./message-stream.tsx";

/**
 * Props for SessionView
 */
export interface SessionViewProps {
  /**
   * Agent ID for this session
   */
  agentId: string;

  /**
   * Thread ID (optional, defaults to agentId)
   */
  threadId?: string;

  /**
   * Whether the input is focused
   */
  inputFocused: boolean;
}

/**
 * Session view with message stream and input
 */
export function SessionView(props: SessionViewProps) {
  const dimensions = useTerminalDimensions();
  const registry = useRegistry();

  const [parts, setParts] = createSignal<MessagePart[]>([]);
  const [error, setError] = createSignal<string>();

  const threadId = () => props.threadId || props.agentId;

  // Subscribe to thread parts - Effect-native!
  createEffectEffect(() =>
    Effect.gen(function* () {
      const agentId = props.agentId;
      const tid = threadId();

      const stateStore = yield* StateStore;

      // Read existing parts
      const existingParts = yield* stateStore.readThreadParts(agentId, tid);
      setParts(existingParts);

      // Subscribe to new parts
      const stream = yield* stateStore.subscribeThread(agentId, tid);

      yield* stream.pipe(
        Stream.runForEach((part) =>
          Effect.sync(() => {
            setParts((prev) => [...prev, part]);
          }),
        ),
      );
    }).pipe(Effect.catchAll((e) => Effect.sync(() => setError(String(e))))),
  );

  // Handle sending messages - Effect-native!
  const sendMessage = useEffectCallback(
    Effect.fnUntraced(function* (message: string) {
      const agent = registry.getAgent(props.agentId);
      if (!agent) {
        return yield* Effect.fail(`Agent "${props.agentId}" not found`);
      }

      // Spawn the agent
      const instance = yield* spawn(agent, threadId());

      // Send the message and consume the stream
      yield* instance.send(message).pipe(
        Stream.runForEach(() =>
          Effect.sync(() => {
            // Parts are automatically persisted by the agent
            // We'll receive them via our subscription
          }),
        ),
      );
    }),
  );

  const handleSubmit = (message: string) => {
    setError(undefined);
    sendMessage.trigger(message);
  };

  // Calculate heights
  const headerHeight = 3;
  const inputHeight = 3;
  const messageHeight = () =>
    dimensions().height - headerHeight - inputHeight - 2;

  return (
    <box
      width={dimensions().width}
      height={dimensions().height}
      flexDirection="column"
      backgroundColor="#0f0f1a"
    >
      {/* Header */}
      <box
        height={headerHeight}
        padding={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        borderStyle="single"
        borderColor="#3a3a3a"
      >
        <box flexDirection="row" gap={2}>
          <text fg="#fab283" attributes={TextAttributes.BOLD}>
            {props.agentId}
          </text>
          <Show when={props.threadId && props.threadId !== props.agentId}>
            <text fg="#6a6a6a">/</text>
            <text fg="#8383fa">{props.threadId}</text>
          </Show>
        </box>
        <box>
          <Show when={sendMessage.loading()}>
            <text fg="#fab283">● streaming...</text>
          </Show>
        </box>
      </box>

      {/* Message stream */}
      <MessageStream parts={parts} height={messageHeight()} />

      {/* Error display */}
      <Show when={error() || sendMessage.error()}>
        <box padding={1} backgroundColor="#4a1a1a">
          <text fg="#fa8383">
            Error: {error() || String(sendMessage.error())}
          </text>
        </box>
      </Show>

      {/* Input */}
      <InputBox
        onSubmit={handleSubmit}
        disabled={sendMessage.loading()}
        focused={props.inputFocused}
        placeholder={
          sendMessage.loading() ? "Waiting for response..." : "Type a message..."
        }
      />
    </box>
  );
}

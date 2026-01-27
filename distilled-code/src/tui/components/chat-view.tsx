/**
 * ChatView Component
 *
 * Chat view for a selected agent/thread with message stream and input.
 */

import { TextAttributes } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/solid";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Stream from "effect/Stream";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { spawn } from "../../agent.ts";
import { StateStore, type MessagePart } from "../../state/index.ts";
import { useRegistry } from "../context/registry.tsx";
import { useStore } from "../context/store.tsx";
import { InputBox } from "./input-box.tsx";
import { MessageStream } from "./message-stream.tsx";

/**
 * Props for ChatView
 */
export interface ChatViewProps {
  /**
   * Agent ID for this session
   */
  agentId: string;

  /**
   * Thread ID (optional, defaults to agentId)
   */
  threadId?: string;

  /**
   * Callback to go back to agent picker
   */
  onBack: () => void;

  /**
   * Callback to exit the app
   */
  onExit: () => void;
}

/**
 * Chat view with message stream and input
 */
export function ChatView(props: ChatViewProps) {
  const dimensions = useTerminalDimensions();
  const registry = useRegistry();
  const store = useStore();

  const [parts, setParts] = createSignal<MessagePart[]>([]);
  const [error, setError] = createSignal<string>();
  const [loading, setLoading] = createSignal(false);

  const threadId = () => props.threadId || props.agentId;

  // Track subscription fiber for cleanup
  let subscriptionFiber: Fiber.RuntimeFiber<void, unknown> | undefined;

  // Load existing parts and subscribe to new ones
  onMount(() => {
    // Load and subscribe in one effect
    const effect = Effect.gen(function* () {
      const stateStore = yield* StateStore;

      // Read existing parts
      const existingParts = yield* stateStore.readThreadParts(props.agentId, threadId());
      setParts(existingParts);

      // Subscribe to new parts
      const stream = yield* stateStore.subscribeThread(props.agentId, threadId());

      yield* stream.pipe(
        Stream.runForEach((part) =>
          Effect.sync(() => {
            setParts((prev) => [...prev, part]);
          }),
        ),
      );
    }).pipe(
      Effect.catchAll((e) =>
        Effect.sync(() => {
          setError(String(e));
        }),
      ),
    );

    subscriptionFiber = store.runtime.runFork(effect);
  });

  // Cleanup on unmount
  onCleanup(() => {
    if (subscriptionFiber) {
      Effect.runFork(Fiber.interrupt(subscriptionFiber));
    }
  });

  // Handle keyboard
  useKeyboard((evt) => {
    // Ctrl+C: Exit
    if (evt.ctrl && evt.name === "c") {
      evt.preventDefault();
      evt.stopPropagation();
      props.onExit();
      return;
    }

    // Escape: Go back to picker
    if (evt.name === "escape") {
      evt.preventDefault();
      evt.stopPropagation();
      props.onBack();
      return;
    }
  });

  // Handle sending messages
  const handleSubmit = (message: string) => {
    setError(undefined);
    setLoading(true);

    const agent = registry.getAgent(props.agentId);
    if (!agent) {
      setError(`Agent "${props.agentId}" not found`);
      setLoading(false);
      return;
    }

    const sendEffect = Effect.gen(function* () {
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
    }).pipe(
      Effect.catchAll((e) =>
        Effect.sync(() => {
          setError(String(e));
        }),
      ),
      Effect.ensuring(Effect.sync(() => setLoading(false))),
    );

    store.runtime.runFork(sendEffect);
  };

  // Calculate heights
  const headerHeight = 3;
  const inputHeight = 5;
  const messageHeight = () => dimensions().height - headerHeight - inputHeight - 2;

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
        <box flexDirection="row" gap={2}>
          <Show when={loading()}>
            <text fg="#fab283">● streaming...</text>
          </Show>
          <text fg="#6a6a6a">esc back</text>
        </box>
      </box>

      {/* Message stream */}
      <MessageStream parts={parts} height={messageHeight()} />

      {/* Error display */}
      <Show when={error()}>
        <box padding={1} backgroundColor="#4a1a1a">
          <text fg="#fa8383">Error: {error()}</text>
        </box>
      </Show>

      {/* Input */}
      <InputBox
        onSubmit={handleSubmit}
        disabled={loading()}
        focused={true}
        placeholder={loading() ? "Waiting for response..." : "Type a message..."}
      />
    </box>
  );
}

/**
 * ChatView Component
 *
 * Chat view for a selected agent/thread with message stream and input.
 */

import type { MessageEncoded } from "@effect/ai/Prompt";
import { TextAttributes } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/solid";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Fiber from "effect/Fiber";
import * as Stream from "effect/Stream";
import { createEffect, createSignal, on, onCleanup, Show } from "solid-js";
import { spawn } from "../../agent.ts";
import { StateStore, type MessagePart } from "../../state/index.ts";
import { logError } from "../../util/log.ts";
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
   * Whether the chat view is focused (vs sidebar)
   */
  focused?: boolean;

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

  // Historical messages from the messages table (permanent storage)
  const [messages, setMessages] = createSignal<readonly MessageEncoded[]>([]);
  // Streaming parts for the current turn (temporary buffer)
  const [parts, setParts] = createSignal<MessagePart[]>([]);
  const [error, setError] = createSignal<string>();
  const [loading, setLoading] = createSignal(false);

  const threadId = () => props.threadId || props.agentId;

  // Track subscription fiber for cleanup
  let subscriptionFiber: Fiber.RuntimeFiber<void, unknown> | undefined;

  // Helper to cleanup current subscription
  const cleanupSubscription = () => {
    if (subscriptionFiber) {
      Effect.runFork(Fiber.interrupt(subscriptionFiber));
      subscriptionFiber = undefined;
    }
  };

  // Load existing messages/parts and subscribe to new ones when agent/thread changes
  createEffect(
    on(
      () => [props.agentId, threadId()] as const,
      ([agentId, currentThreadId]) => {
        // Cleanup previous subscription
        cleanupSubscription();

        // Clear previous state
        setMessages([]);
        setParts([]);
        setError(undefined);

        // Load and subscribe in one effect
        const effect = Effect.gen(function* () {
          const stateStore = yield* StateStore;

          // Read historical messages (permanent storage)
          const storedMessages = yield* stateStore.readThreadMessages(
            agentId,
            currentThreadId,
          );
          setMessages(storedMessages);

          // Read pending parts (in-progress conversation, not yet flushed)
          const pendingParts = yield* stateStore.readThreadParts(
            agentId,
            currentThreadId,
          );
          setParts(pendingParts);

          // Subscribe to new streaming parts
          const stream = yield* stateStore.subscribeThread(
            agentId,
            currentThreadId,
          );

          yield* stream.pipe(
            Stream.runForEach((part) =>
              Effect.sync(() => {
                setParts((prev) => [...prev, part]);
              }),
            ),
          );
        }).pipe(
          Effect.catchAllCause((cause) =>
            Effect.sync(() => {
              // Only log if it's not an interruption (normal cleanup)
              if (!Cause.isInterruptedOnly(cause)) {
                logError("ChatView", "subscription stream error", cause);
                setError(Cause.pretty(cause));
              }
            }),
          ),
        );

        subscriptionFiber = store.runtime.runFork(effect);

        // Observe the fiber for errors (e.g., layer initialization failures)
        // Use Fiber.await to get an Exit which provides proper error details
        Effect.runPromise(Fiber.await(subscriptionFiber)).then((exit) => {
          if (Exit.isFailure(exit)) {
            const cause = exit.cause;
            // Only log if it's not an interruption (normal cleanup)
            if (!Cause.isInterruptedOnly(cause)) {
              const prettyError = Cause.pretty(cause);
              logError("ChatView", "fiber error", cause);
              setError(prettyError);
            }
          }
        });
      },
    ),
  );

  // Cleanup on unmount
  onCleanup(cleanupSubscription);

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
      const errorMsg = `Agent "${props.agentId}" not found`;
      logError("ChatView", "agent not found", new Error(errorMsg));
      setError(errorMsg);
      setLoading(false);
      return;
    }

    const sendEffect = Effect.gen(function* () {
      // Spawn the agent
      const instance = yield* spawn(agent, threadId());

      // Send the message and consume the stream
      // Parts are automatically persisted by the agent
      // We receive them via our subscription
      yield* instance.send(message).pipe(Stream.runDrain);
    }).pipe(
      Effect.catchAllCause((cause) =>
        Effect.sync(() => {
          logError("ChatView", "send message error", cause);
          setError(Cause.pretty(cause));
        }),
      ),
      Effect.ensuring(Effect.sync(() => setLoading(false))),
    );

    // Use runPromise to catch any layer initialization errors
    store.runtime.runPromise(sendEffect).catch((err) => {
      logError("ChatView", "layer initialization error", err);
      // Format the error properly for display
      const errorStr = err instanceof Error ? err.message : String(err);
      setError(errorStr);
      setLoading(false);
    });
  };

  // Calculate heights
  const headerHeight = 3;
  const inputHeight = 5;
  const messageHeight = () => dimensions().height - headerHeight - inputHeight - 2;

  return (
    <box
      width="100%"
      height="100%"
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
      <MessageStream messages={messages} parts={parts} height={messageHeight()} />

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
        focused={props.focused ?? true}
        placeholder={loading() ? "Waiting for response..." : "Type a message..."}
      />
    </box>
  );
}

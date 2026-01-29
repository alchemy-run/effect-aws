/**
 * ChatView Component
 *
 * Chat view for a selected agent/channel/group with message stream and input.
 * Now simplified to just subscribe to MessagingService and render DisplayEvents.
 */

import { TextAttributes } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/solid";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Fiber from "effect/Fiber";
import * as Stream from "effect/Stream";
import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import {
  createMessagingService,
  type MessagingService,
} from "../../messaging-service.ts";
import type { ChannelType, DisplayEvent } from "../../state/thread.ts";
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
   * Type of the selected item (dm, channel, or group)
   */
  type: ChannelType;

  /**
   * ID of the agent, channel, or group
   */
  id: string;

  /**
   * Thread ID (optional, defaults to id)
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

  // Display events from MessagingService - the single source of truth
  // No more separate messages/parts - just display events
  const [displayEvents, setDisplayEvents] = createSignal<DisplayEvent[]>([]);
  const [error, setError] = createSignal<string>();
  const [loading, setLoading] = createSignal(false);

  // Cache the MessagingService - created once on mount, reused for all operations
  const [messagingService, setMessagingService] = createSignal<
    MessagingService | undefined
  >();

  onMount(() => {
    // Create the MessagingService once when the component mounts
    const effect = createMessagingService(registry);
    store.runtime.runPromise(effect).then(
      (service) => setMessagingService(service),
      (err) => {
        logError("ChatView", "failed to create messaging service", err);
        setError(err instanceof Error ? err.message : String(err));
      },
    );
  });

  const threadId = () => props.threadId || props.id;

  // Get the display prefix based on type
  const displayPrefix = () => {
    switch (props.type) {
      case "channel":
        return "#";
      case "group":
        return "&";
      default:
        return "@";
    }
  };

  // Track subscription fiber for cleanup
  let subscriptionFiber: Fiber.RuntimeFiber<void, unknown> | undefined;

  // Helper to cleanup current subscription
  const cleanupSubscription = () => {
    if (subscriptionFiber) {
      Effect.runFork(Fiber.interrupt(subscriptionFiber));
      subscriptionFiber = undefined;
    }
  };

  // Subscribe to display events when selection or service changes
  createEffect(
    on(
      () => [props.type, props.id, threadId(), messagingService()] as const,
      ([channelType, _id, currentThreadId, service]) => {
        // Cleanup previous subscription
        cleanupSubscription();

        // Clear previous state
        setDisplayEvents([]);
        setError(undefined);

        // Need service to subscribe
        if (!service) {
          return;
        }

        // Subscribe to display events from MessagingService
        // This is the single source of truth - no direct StateStore access
        const effect = Effect.gen(function* () {
          // MessagingService.subscribe() returns a stream that:
          // - Loads historical messages and converts to display events
          // - Subscribes to raw parts and transforms based on channel type
          // - For DMs: streams text deltas in real-time
          // - For channels/groups: buffers text, emits complete messages only
          const stream = yield* service.subscribe(channelType, currentThreadId);

          yield* stream.pipe(
            Stream.runForEach((event) =>
              Effect.sync(() => {
                // Just accumulate display events - all processing is done by backend
                setDisplayEvents((prev) => [...prev, event]);
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
  // ChatView is now thin - it just calls MessagingService.send()
  // Display updates come from the subscription
  const handleSubmit = (message: string) => {
    const service = messagingService();
    if (!service) {
      setError("MessagingService not ready yet");
      return;
    }

    setError(undefined);
    setLoading(true);

    // MessagingService.send() now returns Effect<void>
    // It writes user message to DB, publishes to stream, and spawns agents
    // Display updates come from our subscription to service.subscribe()
    const sendEffect = service
      .send(props.type, props.id, threadId(), message)
      .pipe(
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
            {displayPrefix()}{props.id}
          </text>
          <Show when={props.threadId && props.threadId !== props.id}>
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

      {/* Message stream - just renders DisplayEvents, no processing needed */}
      <MessageStream
        events={displayEvents}
        height={messageHeight()}
      />

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

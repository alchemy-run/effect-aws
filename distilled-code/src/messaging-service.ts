/**
 * MessagingService
 *
 * Service layer that encapsulates all message routing, coordination, and agent lifecycle.
 * The UI should only call this service - it should not know about spawn(), coordinators, etc.
 *
 * Key responsibilities:
 * - Route messages to appropriate agents/coordinators
 * - Transform raw parts into display-ready events
 * - Buffer output for channels/groups (multiple agents)
 * - Emit streaming output for DMs (single agent)
 */

import type { AiError } from "@effect/ai/AiError";
import type { LanguageModel } from "@effect/ai/LanguageModel";
import type { Handler } from "@effect/ai/Tool";
import type { FileSystem } from "@effect/platform/FileSystem";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as Stream from "effect/Stream";
import { spawn, type Agent } from "./agent.ts";
import type { Channel } from "./chat/channel.ts";
import type { GroupChat } from "./chat/group-chat.ts";
import {
  StateStore,
  type MessagePart,
  type MessageWithSender,
  type StateStoreError,
} from "./state/index.ts";
import type {
  ChannelType,
  DisplayAssistantComplete,
  DisplayAssistantDelta,
  DisplayAssistantStart,
  DisplayCoordinatorComplete,
  DisplayCoordinatorInvoke,
  DisplayCoordinatorThinking,
  DisplayEvent,
  DisplayToolCall,
  DisplayToolResult,
  DisplayUserMessage,
} from "./state/thread.ts";
import { createThreadCoordinator } from "./thread.ts";

// =============================================================================
// Registry Interface
// =============================================================================

/**
 * Registry for looking up agents, channels, and groups by ID.
 * This is a subset of the RegistryContextValue from the TUI.
 */
export interface Registry {
  getAgent: (id: string) => Agent | undefined;
  getChannel: (id: string) => Channel | undefined;
  getGroupChat: (id: string) => GroupChat | undefined;
}

// =============================================================================
// Types
// =============================================================================

/**
 * Error returned by the MessagingService
 */
export type MessagingError = AiError | StateStoreError | MessagingNotFoundError;

/**
 * Error when a channel, agent, or group is not found
 */
export class MessagingNotFoundError extends Error {
  readonly _tag = "MessagingNotFoundError";
  constructor(
    readonly entityType: "agent" | "channel" | "group",
    readonly entityId: string,
  ) {
    super(`${entityType} "${entityId}" not found`);
  }
}

/**
 * MessagingService interface - the only thing the UI needs to know about
 */
export interface MessagingService {
  /**
   * Send a message to a channel/thread.
   * The service handles:
   * - Writing user message to permanent storage
   * - Publishing user-input to stream (without persisting to parts table)
   * - Routing to appropriate handler (single agent or coordinator)
   * - Agent lifecycle management
   *
   * Returns void - the UI should use subscribe() to get display events.
   */
  send(
    channelType: ChannelType,
    channelId: string,
    threadId: string,
    message: string,
  ): Effect.Effect<
    void,
    MessagingError,
    LanguageModel | Handler<string> | StateStore | FileSystem
  >;

  /**
   * Subscribe to display events for a thread.
   * The stream is already buffered based on channel type:
   * - DM: Real-time streaming (DisplayAssistantDelta for each text chunk)
   * - Channel/Group: Buffered (DisplayAssistantComplete only after text-end)
   *
   * The UI just renders these events - no processing needed.
   */
  subscribe(
    channelType: ChannelType,
    threadId: string,
  ): Effect.Effect<
    Stream.Stream<DisplayEvent, never, never>,
    StateStoreError,
    StateStore
  >;
}

/**
 * Context tag for MessagingService
 */
export const MessagingService =
  Context.GenericTag<MessagingService>("MessagingService");

// =============================================================================
// Implementation
// =============================================================================

/**
 * Transform raw MessagePart to DisplayEvent.
 * For DMs: emit streaming deltas
 * For channels/groups: buffer text, emit only complete messages
 */
function transformPartToDisplayEvent(
  part: MessagePart,
  channelType: ChannelType,
  textBuffer: Map<string, string>,
): DisplayEvent | null {
  const sender = (part as any).sender as string | undefined;
  const agentId = sender ?? "assistant";
  const timestamp = Date.now();

  switch (part.type) {
    case "user-input":
      return {
        type: "display-user-message",
        content: part.content,
        timestamp: part.timestamp,
      } satisfies DisplayUserMessage;

    case "coordinator-thinking":
      return {
        type: "display-coordinator-thinking",
        timestamp: part.timestamp,
      } satisfies DisplayCoordinatorThinking;

    case "coordinator-invoke":
      return {
        type: "display-coordinator-invoke",
        agents: part.agents,
        timestamp: part.timestamp,
      } satisfies DisplayCoordinatorInvoke;

    case "coordinator-invoke-complete":
      return {
        type: "display-coordinator-complete",
        agentId: part.agentId,
        timestamp: part.timestamp,
      } satisfies DisplayCoordinatorComplete;

    case "text-start":
      // Initialize buffer for this agent
      textBuffer.set(agentId, "");
      if (channelType === "dm") {
        return {
          type: "display-assistant-start",
          agentId,
          timestamp,
        } satisfies DisplayAssistantStart;
      }
      return null; // Buffered for channels/groups

    case "text-delta": {
      const delta = (part as any).delta as string;
      if (channelType === "dm") {
        // Streaming: emit delta immediately
        return {
          type: "display-assistant-delta",
          agentId,
          delta,
        } satisfies DisplayAssistantDelta;
      }
      // Buffered: accumulate text
      const current = textBuffer.get(agentId) ?? "";
      textBuffer.set(agentId, current + delta);
      return null;
    }

    case "text-end": {
      const content = textBuffer.get(agentId) ?? "";
      textBuffer.delete(agentId);
      return {
        type: "display-assistant-complete",
        agentId,
        content,
        timestamp,
      } satisfies DisplayAssistantComplete;
    }

    case "tool-call": {
      const toolPart = part as any;
      return {
        type: "display-tool-call",
        agentId,
        toolId: toolPart.id ?? "",
        toolName: toolPart.name ?? "unknown",
        params: toolPart.params ?? {},
        timestamp,
      } satisfies DisplayToolCall;
    }

    case "tool-result": {
      const resultPart = part as any;
      return {
        type: "display-tool-result",
        agentId,
        toolId: resultPart.id ?? "",
        result: resultPart.value ?? resultPart.result,
        error: resultPart.error ? String(resultPart.error) : undefined,
        timestamp,
      } satisfies DisplayToolResult;
    }

    default:
      return null;
  }
}

/**
 * Convert historical messages to display events.
 */
function messagesToDisplayEvents(
  messages: readonly MessageWithSender[],
): DisplayEvent[] {
  const events: DisplayEvent[] = [];
  const timestamp = Date.now();

  for (const msg of messages) {
    if (msg.role === "user") {
      const content =
        typeof msg.content === "string"
          ? msg.content
          : Array.isArray(msg.content)
            ? msg.content
                .filter(
                  (b): b is { type: "text"; text: string } =>
                    typeof b === "object" &&
                    b !== null &&
                    "type" in b &&
                    b.type === "text",
                )
                .map((b) => b.text)
                .join("")
            : "";
      events.push({
        type: "display-user-message",
        content,
        timestamp,
      });
    } else if (msg.role === "assistant") {
      const agentId = msg.sender ?? "assistant";
      // Extract text content - handle both string and array formats
      let textContent = "";
      if (typeof msg.content === "string") {
        textContent = msg.content;
      } else if (Array.isArray(msg.content)) {
        for (const block of msg.content) {
          if (
            typeof block === "object" &&
            block !== null &&
            "type" in block &&
            block.type === "text" &&
            "text" in block
          ) {
            textContent += (block as any).text;
          }
        }
      }
      if (textContent) {
        events.push({
          type: "display-assistant-complete",
          agentId,
          content: textContent,
          timestamp,
        });
      }
      // Handle tool calls in content
      if (Array.isArray(msg.content)) {
        for (const block of msg.content) {
          if (
            typeof block === "object" &&
            block !== null &&
            "type" in block &&
            block.type === "tool-call"
          ) {
            const toolBlock = block as any;
            events.push({
              type: "display-tool-call",
              agentId,
              toolId: toolBlock.id ?? "",
              toolName: toolBlock.name ?? "unknown",
              params: toolBlock.params ?? {},
              timestamp,
            });
          } else if (
            typeof block === "object" &&
            block !== null &&
            "type" in block &&
            block.type === "tool-result"
          ) {
            const resultBlock = block as any;
            events.push({
              type: "display-tool-result",
              agentId,
              toolId: resultBlock.id ?? "",
              result: resultBlock.value ?? resultBlock.result,
              error: resultBlock.error ? String(resultBlock.error) : undefined,
              timestamp,
            });
          }
        }
      }
    }
  }

  return events;
}

/**
 * Create a MessagingService that encapsulates all message routing logic.
 *
 * @param registry - The registry containing agents, channels, and groups
 */
export const createMessagingService = (
  registry: Registry,
): Effect.Effect<MessagingService, never, StateStore> =>
  Effect.gen(function* () {
    const store = yield* StateStore;

    return {
      send: (
        channelType: ChannelType,
        channelId: string,
        threadId: string,
        message: string,
      ) =>
        Effect.gen(function* () {
          // Write user message directly to messages table (for persistence)
          const currentMessages =
            yield* store.readThreadMessagesWithSender(threadId);

          console.log(
            `[MessagingService.send] Writing user message to thread "${threadId}". Current messages: ${currentMessages.length}`,
          );

          yield* store.writeThreadMessagesWithSender(threadId, [
            ...currentMessages,
            {
              role: "user" as const,
              content: message,
              sender: undefined, // User messages don't have a sender
            },
          ]);

          console.log(
            `[MessagingService.send] User message written successfully. Total messages now: ${currentMessages.length + 1}`,
          );

          // Publish to PubSub for real-time UI (WITHOUT persisting to parts table)
          // This fixes duplicate display: user input is in messages (persist) + PubSub (stream),
          // never in parts table (which caused duplicates on reload).
          yield* store.publishThreadPart(threadId, {
            type: "user-input",
            content: message,
            timestamp: Date.now(),
            sender: undefined,
          });

          if (channelType === "dm") {
            // DM: spawn single agent
            const agent = registry.getAgent(channelId);
            if (!agent) {
              return yield* Effect.fail(
                new MessagingNotFoundError("agent", channelId),
              );
            }
            // skipUserInput: true because we already stored it above
            const instance = yield* spawn(agent, {
              threadId,
              skipUserInput: true,
            });
            // Fire and forget - UI subscribes separately
            yield* instance.send(message).pipe(Stream.runDrain);
          } else {
            // Channel or Group: use coordinator
            const fragment: Channel | GroupChat | undefined =
              channelType === "channel"
                ? registry.getChannel(channelId)
                : registry.getGroupChat(channelId);

            if (!fragment) {
              return yield* Effect.fail(
                new MessagingNotFoundError(
                  channelType === "channel" ? "channel" : "group",
                  channelId,
                ),
              );
            }

            const coordinator = yield* createThreadCoordinator(
              fragment,
              threadId,
            );
            // Fire and forget - UI subscribes separately
            yield* coordinator.process(message).pipe(Stream.runDrain);
          }
        }),

      subscribe: (channelType: ChannelType, threadId: string) =>
        Effect.gen(function* () {
          // Load historical messages and convert to display events
          const historicalMessages =
            yield* store.readThreadMessagesWithSender(threadId);

          // Debug: log what we loaded from the database
          console.log(
            `[MessagingService.subscribe] Loaded ${historicalMessages.length} messages from DB for thread "${threadId}"`,
          );
          if (historicalMessages.length > 0) {
            console.log(
              `[MessagingService.subscribe] Messages:`,
              historicalMessages.map((m) => ({
                role: m.role,
                sender: m.sender,
                contentPreview:
                  typeof m.content === "string"
                    ? m.content.slice(0, 50)
                    : `[${Array.isArray(m.content) ? m.content.length : 0} blocks]`,
              })),
            );
          }

          const historicalEvents = messagesToDisplayEvents(historicalMessages);

          // Also load pending parts (unflushed agent responses)
          // This ensures we don't lose content when switching chats or restarting
          const pendingParts = yield* store.readThreadParts(threadId);
          console.log(
            `[MessagingService.subscribe] Loaded ${pendingParts.length} pending parts from DB`,
          );

          // Buffer for converting pending parts to display events
          const pendingBuffer = new Map<string, string>();
          const pendingEvents: DisplayEvent[] = [];

          for (const part of pendingParts) {
            const event = transformPartToDisplayEvent(
              part,
              channelType,
              pendingBuffer,
            );
            if (event) {
              pendingEvents.push(event);
            }
          }

          // For any agents that have accumulated text but no text-end,
          // emit a complete event with what we have
          for (const [agentId, text] of pendingBuffer) {
            if (text) {
              pendingEvents.push({
                type: "display-assistant-complete",
                agentId,
                content: text,
                timestamp: Date.now(),
              });
            }
          }

          console.log(
            `[MessagingService.subscribe] Generated ${pendingEvents.length} events from pending parts`,
          );

          // Subscribe to raw parts stream
          const rawStream = yield* store.subscribeThread(threadId);

          // Buffer for accumulating text (per agent)
          const textBuffer = new Map<string, string>();

          // Transform raw parts to display events
          const transformedStream: Stream.Stream<DisplayEvent, never, never> =
            rawStream.pipe(
              Stream.filterMap((part) => {
                const event = transformPartToDisplayEvent(
                  part,
                  channelType,
                  textBuffer,
                );
                return event ? Option.some(event) : Option.none();
              }),
            );

          // Combine: historical messages + pending parts + new streaming events
          const allInitialEvents = [...historicalEvents, ...pendingEvents];
          console.log(
            `[MessagingService.subscribe] Total initial events: ${allInitialEvents.length}`,
          );

          return Stream.concat(
            Stream.fromIterable(allInitialEvents) as Stream.Stream<
              DisplayEvent,
              never,
              never
            >,
            transformedStream,
          );
        }),
    } satisfies MessagingService;
  });

/**
 * Create a MessagingService layer from a registry
 */
export const makeMessagingServiceLayer = (registry: Registry) =>
  Effect.map(createMessagingService(registry), (service) =>
    Context.make(MessagingService, service),
  );

import type { AiError } from "@effect/ai/AiError";
import * as Chat from "@effect/ai/Chat";
import type { LanguageModel } from "@effect/ai/LanguageModel";
import type { MessageEncoded } from "@effect/ai/Prompt";
import type { Handler } from "@effect/ai/Tool";
import * as EffectTool from "@effect/ai/Tool";
import * as EffectToolkit from "@effect/ai/Toolkit";
import type { FileSystem } from "@effect/platform/FileSystem";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import { isAgent, spawn, type Agent } from "./agent.ts";
import type { Channel } from "./chat/channel.ts";
import type { GroupChat } from "./chat/group-chat.ts";
import { isGroup } from "./org/group.ts";
import { StateStore, type MessagePart, type StateStoreError } from "./state/index.ts";
import { collectReferences } from "./util/collect-references.ts";
import { log } from "./util/log.ts";
import { renderTemplate } from "./util/render-template.ts";

// =============================================================================
// Types
// =============================================================================

/**
 * A thread coordinator that determines which agents should respond to messages
 * in group chats and channels.
 */
export interface ThreadCoordinator {
  /**
   * Process a user message and return streams from responding agents.
   * The coordinator uses an LLM to determine which agents should respond
   * based on @mentions, expertise matching, and conversation context.
   */
  process: (
    message: string,
  ) => Stream.Stream<
    { agentId: string; part: MessagePart },
    AiError | StateStoreError,
    LanguageModel | Handler<string> | StateStore | FileSystem
  >;
}

// =============================================================================
// Mention Parsing
// =============================================================================

/**
 * Parse @mentions from a message.
 * Supports hyphenated names like @code-reviewer.
 *
 * @example
 * ```typescript
 * parseMentions("Hey @dev can you help?") // ["dev"]
 * parseMentions("@dev write code and @tester test it") // ["dev", "tester"]
 * parseMentions("Hello everyone") // []
 * ```
 */
export const parseMentions = (message: string): string[] => {
  const regex = /@([\w-]+)/g;
  const mentions: string[] = [];
  let match;
  while ((match = regex.exec(message)) !== null) {
    mentions.push(match[1]);
  }
  return mentions;
};

// =============================================================================
// Extract Participants
// =============================================================================

/**
 * Extract agent participants from a Channel or GroupChat fragment.
 * Uses collectReferences to gather all agents from the fragment's references.
 * Recurses into Groups to find all member agents.
 */
export const extractParticipants = (fragment: Channel | GroupChat): Agent[] =>
  collectReferences(fragment.references, {
    matches: isAgent,
    shouldRecurse: isGroup,
  });

// =============================================================================
// Coordinator Prompt
// =============================================================================

/**
 * Format messages for display in the coordinator prompt.
 */
const formatMessages = (messages: readonly MessageEncoded[]): string => {
  if (messages.length === 0) {
    return "(no recent messages)";
  }

  return messages
    .slice(-10) // Only show last 10 messages
    .map((msg) => {
      const role = msg.role === "user" ? "User" : msg.role === "assistant" ? "Agent" : msg.role;
      const content = typeof msg.content === "string" 
        ? msg.content 
        : Array.isArray(msg.content)
          ? msg.content
              .filter((part): part is { type: "text"; text: string } => 
                typeof part === "object" && part !== null && "type" in part && part.type === "text"
              )
              .map((part) => part.text)
              .join("")
          : "";
      return `${role}: ${content.slice(0, 200)}${content.length > 200 ? "..." : ""}`;
    })
    .join("\n");
};

/**
 * Build the system prompt for the coordinator LLM.
 */
const buildCoordinatorPrompt = (
  participants: Agent[],
  recentMessages: readonly MessageEncoded[],
  userMessage: string,
  mentions: string[],
): string => {
  const agentList = participants
    .map((a) => `- @${a.id}: ${renderTemplate(a.template, a.references).slice(0, 100)}`)
    .join("\n");

  return `You are a thread coordinator for a group chat. Your ONLY job is to decide which agents should respond to the user's message by calling the respond() tool.

## Available Agents
${agentList}

## Recent Messages
${formatMessages(recentMessages)}

## Current Message
${userMessage}

## Detected @mentions
${mentions.length > 0 ? mentions.map((m) => `@${m}`).join(", ") : "(none)"}

## Your Role
Analyze the message and call respond(agentId) for EACH agent that should reply.

### When to invoke an agent:
1. **Direct @mention**: Message explicitly @mentions them - ALWAYS invoke mentioned agents
2. **Expertise match**: Topic matches their expertise
3. **Continuation**: They were recently speaking and should continue
4. **Delegation**: Another agent asked them for help

### When NOT to invoke:
- General announcements with no questions
- Messages clearly directed at a human (not an agent)
- When the relevant agents have already fully responded in recent messages

### Rules:
- Call respond() once per agent that should reply
- You may call respond() multiple times for multiple agents
- Do NOT respond with text yourself - ONLY call the respond() tool
- If no agent should respond, simply don't call respond()
- ALWAYS invoke agents that are explicitly @mentioned`;
};

// =============================================================================
// Thread Coordinator
// =============================================================================

/**
 * Create a thread coordinator for a Channel or GroupChat.
 * Participants are derived from the fragment's references.
 *
 * @example
 * ```typescript
 * class Dev extends Agent("dev")`A developer` {}
 * class Tester extends Agent("tester")`A tester` {}
 * class Engineering extends Channel("engineering")`
 *   Engineering channel.
 *   Members: ${Dev}, ${Tester}
 * ` {}
 *
 * const coordinator = yield* createThreadCoordinator(Engineering, "thread-1");
 * const stream = coordinator.process("Hey @dev can you review this?");
 * ```
 */
export const createThreadCoordinator: (
  fragment: Channel | GroupChat,
  threadId: string,
) => Effect.Effect<
  ThreadCoordinator,
  never,
  LanguageModel | StateStore
> = Effect.fn(function* (fragment: Channel | GroupChat, threadId: string) {
  const store = yield* StateStore;

  // Extract participants from fragment references
  const participants = extractParticipants(fragment);
  log("coordinator", "participants", participants.map((p) => p.id).join(", "));

  // Build participant map for O(1) lookups
  const participantMap = new Map(participants.map((p) => [p.id, p]));

  // Create the respond tool
  const respondTool = EffectTool.make("respond", {
    description: "Invoke an agent to respond to the current message. The agent will see the full conversation context and generate a response.",
    parameters: {
      agentId: S.String.annotations({
        description: `The ID of the agent to invoke. Must be one of: ${participants.map((p) => p.id).join(", ")}`,
      }),
    },
    success: S.Struct({
      invoked: S.String,
    }),
  });

  const toolkit = EffectToolkit.make(respondTool);

  return {
    process: (message: string) =>
      Stream.unwrap(
        Effect.gen(function* () {
          // NOTE: User input is stored by MessagingService before calling process()
          // We don't store it here to avoid duplication

          // Emit coordinator-thinking event so UI can show "Thinking..."
          yield* store.appendThreadPart(threadId, {
            type: "coordinator-thinking",
            timestamp: Date.now(),
          });
          log("coordinator", "emitted thinking event");

          // Parse @mentions from the message
          const mentions = parseMentions(message);
          log("coordinator", "mentions", mentions.join(", ") || "(none)");

          // Get recent messages for context
          // All participants share the same thread
          const recentMessages = yield* store.readThreadMessages(threadId);
          log("coordinator", "recent messages", `${recentMessages.length} messages`);

          // Build the coordinator prompt
          const systemPrompt = buildCoordinatorPrompt(
            participants,
            recentMessages,
            message,
            mentions,
          );

          // Create a chat instance for the coordinator
          const chat = yield* Chat.fromPrompt([]);

          // Collect agents that should respond
          const agentsToRespond: string[] = [];

          // Create handler for the respond tool
          const handleRespond = (params: { agentId: string }) => {
            log("coordinator", "respond called", params.agentId);
            agentsToRespond.push(params.agentId);
            return Effect.succeed({ invoked: params.agentId });
          };

          const handlerLayer = toolkit.toLayer({
            respond: handleRespond,
          });

          // Run the coordinator LLM to determine which agents should respond
          yield* chat
            .generateText({
              toolkit,
              prompt: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
              ],
            })
            .pipe(
              Effect.provide(handlerLayer as Layer.Layer<EffectTool.Handler<"respond">>),
            );

          log("coordinator", "agents to respond", agentsToRespond.join(", ") || "(none)");

          // If no agents should respond, return empty stream
          if (agentsToRespond.length === 0) {
            return Stream.empty;
          }

          // Deduplicate agents
          const uniqueAgents = [...new Set(agentsToRespond)];

          // Emit coordinator-invoke event so UI can show "Invoking @agent..." bubbles
          yield* store.appendThreadPart(threadId, {
            type: "coordinator-invoke",
            agents: uniqueAgents,
            timestamp: Date.now(),
          });
          log("coordinator", "emitted invoke event", uniqueAgents.join(", "));

          // Spawn each agent and tag their streams
          // Use skipUserInput: true since MessagingService already stored the user message
          const spawnAndTag = (agentId: string) =>
            Effect.gen(function* () {
              const agent = participantMap.get(agentId);
              if (!agent) {
                log("coordinator", "unknown agent", agentId);
                return Stream.empty;
              }

              const instance = yield* spawn(agent, {
                threadId,
                skipUserInput: true,
              });
              
              // Wrap the stream to emit invoke-complete when agent finishes
              return instance.send(message).pipe(
                Stream.map((part) => ({ agentId, part })),
                Stream.ensuring(
                  store
                    .appendThreadPart(threadId, {
                      type: "coordinator-invoke-complete",
                      agentId,
                      timestamp: Date.now(),
                    })
                    .pipe(
                      Effect.tap(() =>
                        Effect.sync(() =>
                          log("coordinator", "emitted invoke-complete", agentId),
                        ),
                      ),
                      Effect.ignore, // Ignore errors in cleanup
                    ),
                ),
              );
            });

          // Spawn all agents and get their streams
          const streams = yield* Effect.all(
            uniqueAgents.map((id) => spawnAndTag(id)),
          );

          // Merge all agent streams
          return Stream.mergeAll(streams, { concurrency: "unbounded" });
        }),
      ),
  } satisfies ThreadCoordinator;
});

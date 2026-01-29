import type { MessageEncoded } from "@effect/ai/Prompt";
import type { AnyPart } from "@effect/ai/Response";
import type { Fiber } from "effect/Fiber";
import type * as PubSub from "effect/PubSub";

import type { StateStoreError } from "./state-store.ts";

/**
 * A message with sender information for display purposes.
 */
export type MessageWithSender = MessageEncoded & {
  /**
   * The sender of this message (agent ID or undefined for human user).
   */
  readonly sender?: string;
};

export type Thread = {
  pubsub: PubSub.PubSub<MessagePart>;
  daemon: Fiber<void, StateStoreError>;
};

/**
 * Represents a user input message in the thread stream.
 * This allows user messages to be part of the unified stream alongside AI responses.
 */
export interface UserInputPart {
  readonly type: "user-input";
  readonly content: string;
  readonly timestamp: number;
  /**
   * The sender of this message (agent ID or undefined for human user).
   */
  readonly sender?: string;
}

/**
 * Base type for AI response parts with optional sender.
 */
export type AnyPartWithSender = AnyPart & {
  readonly sender?: string;
};

// =============================================================================
// Coordinator Event Parts
// =============================================================================

/**
 * Emitted when the coordinator starts thinking about which agents to invoke.
 * UI can show "Thinking..." indicator.
 */
export interface CoordinatorThinkingPart {
  readonly type: "coordinator-thinking";
  readonly timestamp: number;
}

/**
 * Emitted when the coordinator decides to invoke one or more agents.
 * UI can show "Invoking @agent..." bubbles for each agent.
 */
export interface CoordinatorInvokePart {
  readonly type: "coordinator-invoke";
  readonly agents: readonly string[];
  readonly timestamp: number;
}

/**
 * Emitted when an agent completes its response.
 * UI can remove the "Invoking @agent..." bubble.
 */
export interface CoordinatorInvokeCompletePart {
  readonly type: "coordinator-invoke-complete";
  readonly agentId: string;
  readonly timestamp: number;
}

/**
 * Union of all coordinator event parts.
 */
export type CoordinatorPart =
  | CoordinatorThinkingPart
  | CoordinatorInvokePart
  | CoordinatorInvokeCompletePart;

// =============================================================================
// Message Part Union
// =============================================================================

/**
 * Union type representing all parts that can appear in a thread stream.
 * Includes user input, AI response parts, and coordinator events.
 * All parts can optionally have a sender field to identify which agent produced them.
 */
export type MessagePart = UserInputPart | AnyPartWithSender | CoordinatorPart;

/**
 * The type of communication channel.
 */
export type ChannelType = "dm" | "group" | "channel";

/**
 * Information about a thread (conversation) in the communication system.
 * Threads can exist in DMs, Groups, or Channels, and can be nested as replies.
 */
export interface ThreadInfo {
  /**
   * Unique identifier for this thread.
   */
  readonly id: string;

  /**
   * The type of channel this thread belongs to.
   */
  readonly channelType: ChannelType;

  /**
   * The ID of the channel, group, or DM this thread belongs to.
   * For DMs, this is a canonical key like "agent1:agent2".
   */
  readonly channelId: string;

  /**
   * If this is a reply thread, the ID of the parent message.
   * Undefined for top-level threads.
   */
  readonly parentMessageId?: number;

  /**
   * Agent IDs participating in this thread.
   */
  readonly participants: readonly string[];

  /**
   * When the thread was created.
   */
  readonly createdAt: number;

  /**
   * When the thread was last updated.
   */
  readonly updatedAt: number;
}

/**
 * Represents a conversation in the system (DM, Group, or Channel conversation).
 */
export interface Conversation {
  /**
   * Unique identifier for this conversation.
   */
  readonly id: string;

  /**
   * The type of channel.
   */
  readonly channelType: ChannelType;

  /**
   * The ID of the channel or group (for channel/group types)
   * or the canonical DM key (for dm type).
   */
  readonly channelId: string;

  /**
   * When the conversation was created.
   */
  readonly createdAt: number;

  /**
   * When the conversation was last updated.
   */
  readonly updatedAt: number;
}

// =============================================================================
// Display Events - UI renders these directly, no processing needed
// =============================================================================

/**
 * Display event for a user message.
 */
export interface DisplayUserMessage {
  readonly type: "display-user-message";
  readonly content: string;
  readonly timestamp: number;
}

/**
 * Display event when an assistant starts responding (for streaming indicator).
 */
export interface DisplayAssistantStart {
  readonly type: "display-assistant-start";
  readonly agentId: string;
  readonly timestamp: number;
}

/**
 * Display event for streaming text delta (DMs only - real-time streaming).
 */
export interface DisplayAssistantDelta {
  readonly type: "display-assistant-delta";
  readonly agentId: string;
  readonly delta: string;
}

/**
 * Display event for a complete assistant message (buffered for channels/groups).
 */
export interface DisplayAssistantComplete {
  readonly type: "display-assistant-complete";
  readonly agentId: string;
  readonly content: string;
  readonly timestamp: number;
}

/**
 * Display event for a tool call.
 */
export interface DisplayToolCall {
  readonly type: "display-tool-call";
  readonly agentId: string;
  readonly toolId: string;
  readonly toolName: string;
  readonly params: Record<string, unknown>;
  readonly timestamp: number;
}

/**
 * Display event for a tool result.
 */
export interface DisplayToolResult {
  readonly type: "display-tool-result";
  readonly agentId: string;
  readonly toolId: string;
  readonly result: unknown;
  readonly error?: string;
  readonly timestamp: number;
}

/**
 * Display event when the coordinator is thinking about which agents to invoke.
 */
export interface DisplayCoordinatorThinking {
  readonly type: "display-coordinator-thinking";
  readonly timestamp: number;
}

/**
 * Display event when the coordinator invokes agents.
 */
export interface DisplayCoordinatorInvoke {
  readonly type: "display-coordinator-invoke";
  readonly agents: readonly string[];
  readonly timestamp: number;
}

/**
 * Display event when an agent completes its response.
 */
export interface DisplayCoordinatorComplete {
  readonly type: "display-coordinator-complete";
  readonly agentId: string;
  readonly timestamp: number;
}

/**
 * Union of all display events that the UI renders.
 * The backend transforms raw parts into these display-ready events.
 */
export type DisplayEvent =
  | DisplayUserMessage
  | DisplayAssistantStart
  | DisplayAssistantDelta
  | DisplayAssistantComplete
  | DisplayToolCall
  | DisplayToolResult
  | DisplayCoordinatorThinking
  | DisplayCoordinatorInvoke
  | DisplayCoordinatorComplete;

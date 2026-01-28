import type { AnyPart } from "@effect/ai/Response";
import type { Fiber } from "effect/Fiber";
import type * as PubSub from "effect/PubSub";

import type { StateStoreError } from "./state-store.ts";

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
}

/**
 * Union type representing all parts that can appear in a thread stream.
 * Includes both user input and AI response stream parts.
 */
export type MessagePart = UserInputPart | AnyPart;

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

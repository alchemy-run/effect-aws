import * as Context from "effect/Context";
import * as Effect from "effect/Effect";

import type { Agent } from "../agent.ts";
import type { Channel } from "../chat/channel.ts";
import type { GroupChat } from "../chat/group-chat.ts";
import type { Group } from "../org/group.ts";
import {
  buildOrgIndex,
  getAgentRoles as getAgentRolesFromIndex,
  getAgentTools as getAgentToolsFromIndex,
  getChannelParticipants as getChannelParticipantsFromIndex,
  getGroupChatParticipants as getGroupChatParticipantsFromIndex,
  getGroupMembers as getGroupMembersFromIndex,
  type OrgIndex,
  type OrgConfig as ResolverOrgConfig,
} from "../org/resolver.ts";
import type { Role } from "../org/role.ts";
import type { Tool } from "../tool/tool.ts";
import type { Toolkit } from "../toolkit/toolkit.ts";
import {
  StateStore,
  type StateStoreError,
  type StateStore as StateStoreInterface,
} from "./state-store.ts";
import type { ChannelType, Conversation, ThreadInfo } from "./thread.ts";

/**
 * Represents the organization configuration defined in code.
 * This includes all agents, channels, group chats, roles, and groups.
 */
export interface OrgConfig {
  /**
   * All agents in the organization.
   */
  readonly agents: ReadonlyArray<Agent>;

  /**
   * All channels in the organization.
   */
  readonly channels: ReadonlyArray<Channel>;

  /**
   * All group chats in the organization.
   */
  readonly groupChats: ReadonlyArray<GroupChat>;

  /**
   * All roles in the organization.
   */
  readonly roles: ReadonlyArray<Role>;

  /**
   * All organizational groups in the organization.
   */
  readonly groups: ReadonlyArray<Group>;
}

/**
 * Service interface for the Org API.
 * Extends StateStore with conversation and thread management capabilities.
 */
export interface OrgService extends StateStoreInterface {
  /**
   * Get the organization configuration.
   */
  readonly getConfig: () => OrgConfig;

  /**
   * Get the pre-built organization index with resolved relationships.
   */
  readonly getIndex: () => OrgIndex;

  // ============================================================
  // Agent methods
  // ============================================================

  /**
   * Get an agent by ID.
   */
  readonly getAgent: (
    agentId: string,
  ) => Effect.Effect<Agent | undefined, StateStoreError>;

  /**
   * List all agents in the organization.
   */
  readonly listAgents: () => Effect.Effect<readonly Agent[], StateStoreError>;

  // ============================================================
  // Channel methods
  // ============================================================

  /**
   * Get a channel by ID.
   */
  readonly getChannel: (
    channelId: string,
  ) => Effect.Effect<Channel | undefined, StateStoreError>;

  /**
   * List all channels in the organization.
   */
  readonly listChannels: () => Effect.Effect<
    readonly Channel[],
    StateStoreError
  >;

  // ============================================================
  // GroupChat methods
  // ============================================================

  /**
   * Get a group chat by ID.
   */
  readonly getGroupChat: (
    groupChatId: string,
  ) => Effect.Effect<GroupChat | undefined, StateStoreError>;

  /**
   * List all group chats in the organization.
   */
  readonly listGroupChats: () => Effect.Effect<
    readonly GroupChat[],
    StateStoreError
  >;

  // ============================================================
  // Role methods
  // ============================================================

  /**
   * Get a role by ID.
   */
  readonly getRole: (
    roleId: string,
  ) => Effect.Effect<Role | undefined, StateStoreError>;

  /**
   * List all roles in the organization.
   */
  readonly listRoles: () => Effect.Effect<readonly Role[], StateStoreError>;

  // ============================================================
  // Group methods
  // ============================================================

  /**
   * Get an organizational group by ID.
   */
  readonly getGroup: (
    groupId: string,
  ) => Effect.Effect<Group | undefined, StateStoreError>;

  /**
   * List all organizational groups in the organization.
   */
  readonly listGroups: () => Effect.Effect<readonly Group[], StateStoreError>;

  // ============================================================
  // Resolved query methods (use pre-built index)
  // ============================================================

  /**
   * Get all roles for an agent (direct + from group membership).
   */
  readonly getAgentRoles: (
    agentId: string,
  ) => Effect.Effect<readonly Role[], StateStoreError>;

  /**
   * Get all tools/toolkits for an agent (direct + from all roles).
   */
  readonly getAgentTools: (
    agentId: string,
  ) => Effect.Effect<readonly (Tool | Toolkit)[], StateStoreError>;

  /**
   * Get all members of a group (including nested groups).
   */
  readonly getGroupMembers: (
    groupId: string,
  ) => Effect.Effect<readonly Agent[], StateStoreError>;

  /**
   * Get all participants of a channel (including expanded groups).
   */
  readonly getChannelParticipants: (
    channelId: string,
  ) => Effect.Effect<readonly Agent[], StateStoreError>;

  /**
   * Get all participants of a group chat (including expanded groups).
   */
  readonly getGroupChatParticipants: (
    groupChatId: string,
  ) => Effect.Effect<readonly Agent[], StateStoreError>;

  // ============================================================
  // Conversation methods
  // ============================================================

  /**
   * Get or create a conversation for a channel, group, or DM.
   */
  readonly getOrCreateConversation: (
    channelType: ChannelType,
    channelId: string,
  ) => Effect.Effect<Conversation, StateStoreError>;

  /**
   * Get a conversation by ID.
   */
  readonly getConversation: (
    conversationId: string,
  ) => Effect.Effect<Conversation | undefined, StateStoreError>;

  /**
   * List all conversations.
   */
  readonly listConversations: (
    channelType?: ChannelType,
  ) => Effect.Effect<readonly Conversation[], StateStoreError>;

  // ============================================================
  // Thread reply methods
  // ============================================================

  /**
   * Get thread info for a specific thread.
   */
  readonly getThreadInfo: (
    threadId: string,
    agentId: string,
  ) => Effect.Effect<ThreadInfo | undefined, StateStoreError>;

  /**
   * Create a reply thread on a message.
   */
  readonly createReplyThread: (
    parentMessageId: number,
    channelType: ChannelType,
    channelId: string,
    participants: readonly string[],
  ) => Effect.Effect<ThreadInfo, StateStoreError>;

  /**
   * List reply threads for a message.
   */
  readonly listReplyThreads: (
    parentMessageId: number,
  ) => Effect.Effect<readonly ThreadInfo[], StateStoreError>;
}

/**
 * The Org service tag.
 */
export class Org extends Context.Tag("Org")<Org, OrgService>() {}

/**
 * Options for creating an Org service.
 */
export interface CreateOrgOptions {
  /**
   * The organization configuration.
   */
  config: OrgConfig;
}

/**
 * Create an Org service from a StateStore and configuration.
 */
export const createOrg = (options: CreateOrgOptions) =>
  Effect.gen(function* () {
    const stateStore = yield* StateStore;
    const { config } = options;

    // Create lookup maps for fast access
    const agentMap = new Map(config.agents.map((a) => [a.id, a]));
    const channelMap = new Map(config.channels.map((c) => [c.id, c]));
    const groupChatMap = new Map(config.groupChats.map((gc) => [gc.id, gc]));
    const roleMap = new Map((config.roles ?? []).map((r) => [r.id, r]));
    const groupMap = new Map((config.groups ?? []).map((g) => [g.id, g]));

    // Build the organization index with resolved relationships
    const resolverConfig: ResolverOrgConfig = {
      agents: config.agents,
      roles: config.roles ?? [],
      groups: config.groups ?? [],
      channels: config.channels,
      groupChats: config.groupChats,
    };
    const index = buildOrgIndex(resolverConfig);

    // In-memory conversation cache (will be populated from SQLite on first access)
    const conversationCache = new Map<string, Conversation>();

    const makeConversationKey = (channelType: ChannelType, channelId: string) =>
      `${channelType}:${channelId}`;

    const service: OrgService = {
      // Forward all StateStore methods
      ...stateStore,

      getConfig: () => config,

      getIndex: () => index,

      // Agent methods
      getAgent: (agentId) => Effect.succeed(agentMap.get(agentId)),

      listAgents: () => Effect.succeed(config.agents),

      // Channel methods
      getChannel: (channelId) => Effect.succeed(channelMap.get(channelId)),

      listChannels: () => Effect.succeed(config.channels),

      // GroupChat methods
      getGroupChat: (groupChatId) =>
        Effect.succeed(groupChatMap.get(groupChatId)),

      listGroupChats: () => Effect.succeed(config.groupChats),

      // Role methods
      getRole: (roleId) => Effect.succeed(roleMap.get(roleId)),

      listRoles: () => Effect.succeed(config.roles ?? []),

      // Group methods
      getGroup: (groupId) => Effect.succeed(groupMap.get(groupId)),

      listGroups: () => Effect.succeed(config.groups ?? []),

      // Resolved query methods (use pre-built index)
      getAgentRoles: (agentId) =>
        Effect.succeed(getAgentRolesFromIndex(index, agentId)),

      getAgentTools: (agentId) =>
        Effect.succeed(getAgentToolsFromIndex(index, agentId)),

      getGroupMembers: (groupId) =>
        Effect.succeed(getGroupMembersFromIndex(index, groupId)),

      getChannelParticipants: (channelId) =>
        Effect.succeed(getChannelParticipantsFromIndex(index, channelId)),

      getGroupChatParticipants: (groupChatId) =>
        Effect.succeed(getGroupChatParticipantsFromIndex(index, groupChatId)),

      // Conversation methods
      getOrCreateConversation: (channelType, channelId) =>
        Effect.gen(function* () {
          const key = makeConversationKey(channelType, channelId);
          const cached = conversationCache.get(key);
          if (cached) {
            return cached;
          }

          // Create new conversation (in real implementation, this would persist to SQLite)
          const now = Date.now();
          const conversation: Conversation = {
            id: crypto.randomUUID(),
            channelType,
            channelId,
            createdAt: now,
            updatedAt: now,
          };

          conversationCache.set(key, conversation);
          return conversation;
        }),

      getConversation: (conversationId) =>
        Effect.gen(function* () {
          for (const conv of conversationCache.values()) {
            if (conv.id === conversationId) {
              return conv;
            }
          }
          return undefined;
        }),

      listConversations: (channelType) =>
        Effect.gen(function* () {
          const conversations = Array.from(conversationCache.values());
          if (channelType) {
            return conversations.filter((c) => c.channelType === channelType);
          }
          return conversations;
        }),

      // Thread reply methods
      getThreadInfo: (_threadId, _agentId) =>
        // TODO: Implement when persisted thread info is needed
        Effect.succeed(undefined),

      createReplyThread: (
        parentMessageId,
        channelType,
        channelId,
        participants,
      ) =>
        Effect.gen(function* () {
          const now = Date.now();
          const threadInfo: ThreadInfo = {
            id: crypto.randomUUID(),
            channelType,
            channelId,
            parentMessageId,
            participants,
            createdAt: now,
            updatedAt: now,
          };
          return threadInfo;
        }),

      listReplyThreads: (_parentMessageId) =>
        // TODO: Implement when persisted thread info is needed
        Effect.succeed([]),
    };

    return service;
  });

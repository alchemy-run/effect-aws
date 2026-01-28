/**
 * Organization Context
 *
 * Provides organization configuration (agents, channels, groups) to the TUI components.
 * Replaces the simpler RegistryContext with full organization support.
 */

import { createContext, useContext, type JSX } from "solid-js";
import type { Agent } from "../../agent.ts";
import type { Channel } from "../../chat/channel.ts";
import type { Group } from "../../chat/group.ts";
import type { OrgConfig } from "../../state/org.ts";

/**
 * Organization context value
 */
export interface OrgContextValue {
  /**
   * Available agent definitions
   */
  agents: readonly Agent[];

  /**
   * Available channel definitions
   */
  channels: readonly Channel[];

  /**
   * Available group definitions
   */
  groups: readonly Group[];

  /**
   * Get an agent by ID
   */
  getAgent: (id: string) => Agent | undefined;

  /**
   * Get a channel by ID
   */
  getChannel: (id: string) => Channel | undefined;

  /**
   * Get a group by ID
   */
  getGroup: (id: string) => Group | undefined;

  /**
   * Get participants of a group (agent IDs)
   */
  getGroupMembers: (groupId: string) => readonly string[];
}

const OrgContext = createContext<OrgContextValue>();

/**
 * Props for OrgProvider
 */
export interface OrgProviderProps {
  /**
   * Organization configuration
   */
  config: OrgConfig;

  /**
   * Child components
   */
  children: JSX.Element;
}

/**
 * Extract agent members from a Group's references
 */
function extractGroupMembers(group: Group, agentMap: Map<string, Agent>): readonly string[] {
  const members: string[] = [];
  for (const ref of group.references) {
    // References could be Agent classes or thunks
    const resolved = typeof ref === "function" && "id" in ref ? ref : undefined;
    if (resolved && agentMap.has(resolved.id)) {
      members.push(resolved.id);
    }
  }
  return members;
}

/**
 * Provider component for organization context
 */
export function OrgProvider(props: OrgProviderProps) {
  const { config } = props;

  // Create lookup maps
  const agentMap = new Map<string, Agent>();
  for (const agent of config.agents) {
    agentMap.set(agent.id, agent);
  }

  const channelMap = new Map<string, Channel>();
  for (const channel of config.channels) {
    channelMap.set(channel.id, channel);
  }

  const groupMap = new Map<string, Group>();
  for (const group of config.groups) {
    groupMap.set(group.id, group);
  }

  // Pre-compute group members
  const groupMembersMap = new Map<string, readonly string[]>();
  for (const group of config.groups) {
    groupMembersMap.set(group.id, extractGroupMembers(group, agentMap));
  }

  const value: OrgContextValue = {
    agents: config.agents,
    channels: config.channels,
    groups: config.groups,
    getAgent: (id: string) => agentMap.get(id),
    getChannel: (id: string) => channelMap.get(id),
    getGroup: (id: string) => groupMap.get(id),
    getGroupMembers: (groupId: string) => groupMembersMap.get(groupId) ?? [],
  };

  return (
    <OrgContext.Provider value={value}>
      {props.children}
    </OrgContext.Provider>
  );
}

/**
 * Hook to access the organization context
 */
export function useOrg(): OrgContextValue {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("useOrg must be used within an OrgProvider");
  }
  return context;
}

/**
 * Hook to get agents (convenience wrapper)
 */
export function useAgents(): readonly Agent[] {
  return useOrg().agents;
}

/**
 * Hook to get channels (convenience wrapper)
 */
export function useChannels(): readonly Channel[] {
  return useOrg().channels;
}

/**
 * Hook to get groups (convenience wrapper)
 */
export function useGroups(): readonly Group[] {
  return useOrg().groups;
}

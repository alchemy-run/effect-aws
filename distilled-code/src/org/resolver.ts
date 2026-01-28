/**
 * Organization resolver - builds an indexed view of all organizational relationships.
 *
 * The resolver processes OrgConfig and builds an OrgIndex that provides:
 * - Fast lookups for all fragment types
 * - Resolved relationships (role inheritance, group membership, channel participants)
 * - Tool aggregation (from direct references and roles)
 */

import { isAgent, type Agent } from "../agent.ts";
import { type Channel } from "../chat/channel.ts";
import { type GroupChat } from "../chat/group-chat.ts";
import { isTool, type Tool } from "../tool/tool.ts";
import { isToolkit, type Toolkit } from "../toolkit/toolkit.ts";
import { resolveThunk } from "../util/render-template.ts";
import { isGroup, type Group } from "./group.ts";
import { isRole, type Role } from "./role.ts";

/**
 * Organization configuration containing all fragments.
 */
export interface OrgConfig {
  agents: readonly Agent[];
  roles: readonly Role[];
  groups: readonly Group[];
  channels: readonly Channel[];
  groupChats: readonly GroupChat[];
}

/**
 * Indexed view of all organizational relationships.
 * Built once from OrgConfig, provides fast lookups.
 */
export interface OrgIndex {
  // Fragment maps (by ID)
  agents: Map<string, Agent>;
  roles: Map<string, Role>;
  groups: Map<string, Group>;
  channels: Map<string, Channel>;
  groupChats: Map<string, GroupChat>;

  // Resolved relationships
  agentRoles: Map<string, Set<Role>>;
  agentTools: Map<string, Set<Tool | Toolkit>>;
  groupMembers: Map<string, Set<Agent>>;
  groupRoles: Map<string, Set<Role>>;
  channelParticipants: Map<string, Set<Agent>>;
  groupChatParticipants: Map<string, Set<Agent>>;
  roleTools: Map<string, Set<Tool | Toolkit>>;
  roleAncestors: Map<string, Set<Role>>;
}

/**
 * Build an indexed view of all organizational relationships.
 *
 * Resolution order:
 * 1. Index all fragments by ID
 * 2. Resolve role inheritance (DFS) and collect tools
 * 3. Resolve group membership (DFS for nested groups)
 * 4. Resolve agent roles (direct + from group membership)
 * 5. Resolve agent tools (direct + from all roles)
 * 6. Expand channel participants (including groups)
 * 7. Expand groupChat participants (including groups)
 */
export const buildOrgIndex = (config: OrgConfig): OrgIndex => {
  const index: OrgIndex = {
    agents: new Map(config.agents.map((a) => [a.id, a])),
    roles: new Map(config.roles.map((r) => [r.id, r])),
    groups: new Map(config.groups.map((g) => [g.id, g])),
    channels: new Map(config.channels.map((c) => [c.id, c])),
    groupChats: new Map(config.groupChats.map((gc) => [gc.id, gc])),
    agentRoles: new Map(),
    agentTools: new Map(),
    groupMembers: new Map(),
    groupRoles: new Map(),
    channelParticipants: new Map(),
    groupChatParticipants: new Map(),
    roleTools: new Map(),
    roleAncestors: new Map(),
  };

  // 1. Resolve role inheritance and collect tools (DFS)
  const resolveRoleTools = (
    role: Role,
    visited = new Set<string>(),
  ): Set<Tool | Toolkit> => {
    if (visited.has(role.id)) return new Set();
    visited.add(role.id);

    const tools = new Set<Tool | Toolkit>();
    const ancestors = new Set<Role>();

    for (const rawRef of role.references) {
      const ref = resolveThunk(rawRef);
      if (isTool(ref) || isToolkit(ref)) {
        tools.add(ref);
      } else if (isRole(ref)) {
        ancestors.add(ref);
        // Inherit tools from parent role
        for (const tool of resolveRoleTools(ref, visited)) {
          tools.add(tool);
        }
      }
    }

    index.roleTools.set(role.id, tools);
    index.roleAncestors.set(role.id, ancestors);
    return tools;
  };

  for (const role of config.roles) {
    resolveRoleTools(role);
  }

  // 2. Resolve group membership (DFS for nested groups)
  const resolveGroupMembers = (
    group: Group,
    visited = new Set<string>(),
  ): Set<Agent> => {
    if (visited.has(group.id)) return new Set();
    visited.add(group.id);

    const members = new Set<Agent>();
    const roles = new Set<Role>();

    for (const rawRef of group.references) {
      const ref = resolveThunk(rawRef);
      if (isAgent(ref)) {
        members.add(ref);
      } else if (isGroup(ref)) {
        // Add all members from nested group
        for (const member of resolveGroupMembers(ref, visited)) {
          members.add(member);
        }
      } else if (isRole(ref)) {
        roles.add(ref);
      }
    }

    index.groupMembers.set(group.id, members);
    index.groupRoles.set(group.id, roles);
    return members;
  };

  for (const group of config.groups) {
    resolveGroupMembers(group);
  }

  // 3. Resolve agent roles (direct + from group membership)
  for (const agent of config.agents) {
    const roles = new Set<Role>();
    const tools = new Set<Tool | Toolkit>();

    // Direct roles from agent references
    for (const rawRef of agent.references) {
      const ref = resolveThunk(rawRef);
      if (isRole(ref)) {
        roles.add(ref);
      } else if (isTool(ref) || isToolkit(ref)) {
        tools.add(ref);
      }
    }

    // Roles from group membership
    for (const [groupId, members] of index.groupMembers) {
      if (members.has(agent)) {
        const groupRoles = index.groupRoles.get(groupId) ?? new Set();
        for (const role of groupRoles) {
          roles.add(role);
        }
      }
    }

    // Collect tools from all roles (including inherited)
    for (const role of roles) {
      const roleTools = index.roleTools.get(role.id) ?? new Set();
      for (const tool of roleTools) {
        tools.add(tool);
      }
    }

    index.agentRoles.set(agent.id, roles);
    index.agentTools.set(agent.id, tools);
  }

  // 4. Resolve channel participants (expand groups)
  for (const channel of config.channels) {
    const participants = new Set<Agent>();

    for (const rawRef of channel.references) {
      const ref = resolveThunk(rawRef);
      if (isAgent(ref)) {
        participants.add(ref);
      } else if (isGroup(ref)) {
        const members = index.groupMembers.get(ref.id) ?? new Set();
        for (const member of members) {
          participants.add(member);
        }
      }
    }

    index.channelParticipants.set(channel.id, participants);
  }

  // 5. Resolve groupChat participants (expand groups)
  for (const groupChat of config.groupChats) {
    const participants = new Set<Agent>();

    for (const rawRef of groupChat.references) {
      const ref = resolveThunk(rawRef);
      if (isAgent(ref)) {
        participants.add(ref);
      } else if (isGroup(ref)) {
        const members = index.groupMembers.get(ref.id) ?? new Set();
        for (const member of members) {
          participants.add(member);
        }
      }
    }

    index.groupChatParticipants.set(groupChat.id, participants);
  }

  return index;
};

// ============================================================
// Query helpers
// ============================================================

/**
 * Get all roles for an agent (direct + from group membership).
 */
export const getAgentRoles = (index: OrgIndex, agentId: string): Role[] =>
  Array.from(index.agentRoles.get(agentId) ?? []);

/**
 * Get all tools for an agent (direct + from all roles).
 */
export const getAgentTools = (
  index: OrgIndex,
  agentId: string,
): (Tool | Toolkit)[] => Array.from(index.agentTools.get(agentId) ?? []);

/**
 * Get all members of a group (including nested groups).
 */
export const getGroupMembers = (index: OrgIndex, groupId: string): Agent[] =>
  Array.from(index.groupMembers.get(groupId) ?? []);

/**
 * Get all participants of a channel (including expanded groups).
 */
export const getChannelParticipants = (
  index: OrgIndex,
  channelId: string,
): Agent[] => Array.from(index.channelParticipants.get(channelId) ?? []);

/**
 * Get all participants of a group chat (including expanded groups).
 */
export const getGroupChatParticipants = (
  index: OrgIndex,
  groupChatId: string,
): Agent[] => Array.from(index.groupChatParticipants.get(groupChatId) ?? []);

/**
 * Get all tools from a role (including inherited from parent roles).
 */
export const getRoleTools = (
  index: OrgIndex,
  roleId: string,
): (Tool | Toolkit)[] => Array.from(index.roleTools.get(roleId) ?? []);

/**
 * Get all ancestor roles of a role (roles it inherits from).
 */
export const getRoleAncestors = (index: OrgIndex, roleId: string): Role[] =>
  Array.from(index.roleAncestors.get(roleId) ?? []);

/**
 * Get all roles assigned to a group.
 */
export const getGroupRoles = (index: OrgIndex, groupId: string): Role[] =>
  Array.from(index.groupRoles.get(groupId) ?? []);

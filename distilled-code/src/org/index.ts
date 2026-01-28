/**
 * Organizational entities for structuring agents, roles, and groups.
 *
 * This module provides:
 * - Role - Permissions and responsibilities that agents can have
 * - Group - Organizational units containing agents
 * - Query functions - Lazy, on-demand queries for membership/tools
 * - Resolver - Builds indexed view of all organizational relationships
 *
 * Semantic Reference Rules:
 * - Agent references Role → Agent gains that Role (and its tools)
 * - Group references Agent → Agent is a member of the Group
 * - Group references Group → Nested group (transitive membership)
 * - Group references Role → All members gain this Role
 * - Channel/GroupChat references Group → All members are participants
 */

export { Group, isGroup, type Group as GroupType } from "./group.ts";
export { Role, isRole, type Role as RoleType } from "./role.ts";

// Lazy query functions (use collect-references, no pre-built index)
export {
  getAgentTools,
  getGroupRoles,
  getInheritedRoles,
  getMembers,
  getNestedGroups,
  getRoles,
  getTools,
} from "./queries.ts";

// Resolver (builds pre-computed index for fast lookups)
export {
  buildOrgIndex,
  getAgentRoles as getAgentRolesFromIndex,
  getAgentTools as getAgentToolsFromIndex,
  getChannelParticipants,
  getGroupChatParticipants,
  getGroupMembers,
  getGroupRoles as getGroupRolesFromIndex,
  getRoleAncestors,
  getRoleTools,
  type OrgConfig,
  type OrgIndex,
} from "./resolver.ts";

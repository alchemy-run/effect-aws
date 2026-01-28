/**
 * Chat entities for Discord/Slack-like communication.
 *
 * This module provides:
 * - Channel - Named channels with multiple agent participants (like Slack channels)
 * - Group - Group chats for ad-hoc collaboration (like Discord group DMs)
 * - DM - Utilities for 1:1 direct messages between agents
 *
 * All communication types support threaded conversations.
 */

export { Channel, isChannel, type Channel as ChannelType } from "./channel.ts";
export { Group, isGroup, type Group as GroupType } from "./group.ts";
export { DM } from "./dm.ts";

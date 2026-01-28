/**
 * Sidebar Component
 *
 * Discord-like sidebar with collapsible sections for DMs, Groups, and Channels.
 */

import type { ChannelType } from "../../../state/thread.ts";
import { ChannelList } from "./channel-list.tsx";
import { DMList } from "./dm-list.tsx";
import { GroupList } from "./group-list.tsx";
import { Section } from "./section.tsx";

/**
 * Selection state for the sidebar
 */
export interface SidebarSelection {
  type: ChannelType;
  id: string;
}

export interface SidebarProps {
  /**
   * Current selection
   */
  selection?: SidebarSelection;

  /**
   * Callback when selection changes
   */
  onSelect?: (selection: SidebarSelection) => void;

  /**
   * Width of the sidebar
   * @default 30
   */
  width?: number;
}

/**
 * Discord-like sidebar with DMs, Groups, and Channels sections
 */
export function Sidebar(props: SidebarProps) {
  const width = () => props.width ?? 30;

  const handleSelectAgent = (agentId: string) => {
    props.onSelect?.({ type: "dm", id: agentId });
  };

  const handleSelectGroup = (groupId: string) => {
    props.onSelect?.({ type: "group", id: groupId });
  };

  const handleSelectChannel = (channelId: string) => {
    props.onSelect?.({ type: "channel", id: channelId });
  };

  const selectedAgentId = () =>
    props.selection?.type === "dm" ? props.selection.id : undefined;

  const selectedGroupId = () =>
    props.selection?.type === "group" ? props.selection.id : undefined;

  const selectedChannelId = () =>
    props.selection?.type === "channel" ? props.selection.id : undefined;

  return (
    <box
      flexDirection="column"
      width={width()}
      height="100%"
      borderStyle="single"
      borderColor="gray"
    >
      {/* DMs Section */}
      <Section title="Direct Messages">
        <DMList
          selectedAgentId={selectedAgentId()}
          onSelectAgent={handleSelectAgent}
        />
      </Section>

      {/* Groups Section */}
      <Section title="Groups">
        <GroupList
          selectedGroupId={selectedGroupId()}
          onSelectGroup={handleSelectGroup}
        />
      </Section>

      {/* Channels Section */}
      <Section title="Channels">
        <ChannelList
          selectedChannelId={selectedChannelId()}
          onSelectChannel={handleSelectChannel}
        />
      </Section>
    </box>
  );
}

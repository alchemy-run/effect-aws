/**
 * MembersSidebar Component
 *
 * Shows the members/participants of a channel or group chat.
 * Useful for seeing who can respond to messages.
 */

import { TextAttributes } from "@opentui/core";
import { For, Show } from "solid-js";
import type { Agent } from "../../agent.ts";
import type { Channel } from "../../chat/channel.ts";
import type { GroupChat } from "../../chat/group-chat.ts";
import type { ChannelType } from "../../state/thread.ts";
import { extractParticipants } from "../../thread.ts";
import { useRegistry } from "../context/registry.tsx";

/**
 * Props for MembersSidebar
 */
export interface MembersSidebarProps {
  /**
   * Type of the selected item
   */
  type: ChannelType;

  /**
   * ID of the channel or group
   */
  id: string;

  /**
   * Width of the sidebar
   */
  width: number;

  /**
   * Height of the sidebar
   */
  height: number;
}

/**
 * Sidebar showing members of a channel or group chat
 */
export function MembersSidebar(props: MembersSidebarProps) {
  const registry = useRegistry();

  // Get the fragment (channel or group)
  const fragment = (): Channel | GroupChat | undefined => {
    if (props.type === "channel") {
      return registry.getChannel(props.id);
    } else if (props.type === "group") {
      return registry.getGroupChat(props.id);
    }
    return undefined;
  };

  // Get participants from the fragment
  const participants = (): Agent[] => {
    const f = fragment();
    if (!f) return [];
    return extractParticipants(f);
  };

  // Get display prefix based on type
  const typeLabel = () => {
    switch (props.type) {
      case "channel":
        return "Channel Members";
      case "group":
        return "Group Members";
      default:
        return "Members";
    }
  };

  return (
    <box
      width={props.width}
      height={props.height}
      flexDirection="column"
      borderStyle="single"
      borderColor="#3a3a3a"
      backgroundColor="#0f0f1a"
    >
      {/* Header */}
      <box
        height={3}
        padding={1}
      >
        <text fg="#8383fa" attributes={TextAttributes.BOLD}>
          {typeLabel()}
        </text>
      </box>

      {/* Separator */}
      <box height={1} backgroundColor="#3a3a3a" />

      {/* Members list */}
      <box
        flexDirection="column"
        padding={1}
        overflow="hidden"
      >
        <Show
          when={participants().length > 0}
          fallback={
            <text fg="#666666">No members found</text>
          }
        >
          <For each={participants()}>
            {(agent) => (
              <box flexDirection="row" gap={1}>
                <text fg="#fab283">@</text>
                <text fg="#e0e0e0">{agent.id}</text>
              </box>
            )}
          </For>
        </Show>

        {/* Count */}
        <box marginTop={1}>
          <text fg="#666666">
            {participants().length} member{participants().length !== 1 ? "s" : ""}
          </text>
        </box>
      </box>
    </box>
  );
}

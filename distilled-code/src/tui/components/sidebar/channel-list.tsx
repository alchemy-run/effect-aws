/**
 * Channel List Component
 *
 * Displays list of channels.
 */

import { For } from "solid-js";
import { useChannels } from "../../context/org.tsx";

export interface ChannelListProps {
  /**
   * Currently selected channel ID
   */
  selectedChannelId?: string;

  /**
   * Callback when a channel is selected
   */
  onSelectChannel?: (channelId: string) => void;
}

/**
 * List of available channels
 */
export function ChannelList(props: ChannelListProps) {
  const channels = useChannels();

  return (
    <box flexDirection="column" width="100%">
      <For each={channels}>
        {(channel) => {
          const isSelected = () => props.selectedChannelId === channel.id;

          return (
            <box
              flexDirection="row"
              width="100%"
              paddingLeft={1}
              paddingRight={1}
              backgroundColor={isSelected() ? "#2a2a4e" : undefined}
            >
              <text fg={isSelected() ? "white" : "green"}>
                #{channel.id}
              </text>
            </box>
          );
        }}
      </For>
    </box>
  );
}

/**
 * DM List Component
 *
 * Displays list of direct message conversations with agents.
 */

import { For } from "solid-js";
import { useAgents } from "../../context/org.tsx";

export interface DMListProps {
  /**
   * Currently selected agent ID for DM
   */
  selectedAgentId?: string;

  /**
   * Callback when an agent is selected for DM
   */
  onSelectAgent?: (agentId: string) => void;
}

/**
 * List of agents available for direct messages
 */
export function DMList(props: DMListProps) {
  const agents = useAgents();

  return (
    <box flexDirection="column" width="100%">
      <For each={agents}>
        {(agent) => {
          const isSelected = () => props.selectedAgentId === agent.id;

          return (
            <box
              flexDirection="row"
              width="100%"
              paddingLeft={1}
              paddingRight={1}
              backgroundColor={isSelected() ? "#2a2a4e" : undefined}
            >
              <text fg={isSelected() ? "white" : "cyan"}>
                @{agent.id}
              </text>
            </box>
          );
        }}
      </For>
    </box>
  );
}

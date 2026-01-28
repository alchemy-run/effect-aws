/**
 * Group List Component
 *
 * Displays list of group chats.
 */

import { For } from "solid-js";
import { useGroups, useOrg } from "../../context/org.tsx";

export interface GroupListProps {
  /**
   * Currently selected group ID
   */
  selectedGroupId?: string;

  /**
   * Callback when a group is selected
   */
  onSelectGroup?: (groupId: string) => void;
}

/**
 * List of available groups
 */
export function GroupList(props: GroupListProps) {
  const groups = useGroups();
  const org = useOrg();

  return (
    <box flexDirection="column" width="100%">
      <For each={groups}>
        {(group) => {
          const isSelected = () => props.selectedGroupId === group.id;
          const members = () => org.getGroupMembers(group.id);

          return (
            <box
              flexDirection="row"
              width="100%"
              paddingLeft={1}
              paddingRight={1}
              backgroundColor={isSelected() ? "#2a2a4e" : undefined}
            >
              <text fg={isSelected() ? "white" : "magenta"}>
                @{"{"}
                {members().join(", ")}
                {"}"}
              </text>
            </box>
          );
        }}
      </For>
    </box>
  );
}

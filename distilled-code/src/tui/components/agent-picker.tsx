/**
 * AgentPicker Component
 *
 * Full-screen fuzzy search for selecting agents.
 * Displays agents as a tree structure based on path hierarchy.
 */

import { TextAttributes, type InputRenderable } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/solid";
import { createEffect, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useRegistry } from "../context/registry.tsx";
import { useAgentTree, type DisplayRow } from "../hooks/use-agent-tree.ts";

/**
 * Props for AgentPicker
 */
export interface AgentPickerProps {
  onSelect: (agentId: string, threadId?: string) => void;
  onExit: () => void;
}

/**
 * Full-screen fuzzy search picker with tree display
 */
export function AgentPicker(props: AgentPickerProps) {
  const dimensions = useTerminalDimensions();
  const registry = useRegistry();

  const [filter, setFilter] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  let inputRef: InputRenderable | undefined;

  // Focus input on mount
  onMount(() => {
    setTimeout(() => inputRef?.focus(), 10);
  });

  // All agent paths
  const allAgentPaths = createMemo(() => registry.agents.map((a) => a.id));

  // Build tree from agent paths
  const { displayRows, selectableRows } = useAgentTree(allAgentPaths, filter);

  // Limit visible rows for performance
  const MAX_VISIBLE = 100;
  const visibleRows = createMemo(() => displayRows().slice(0, MAX_VISIBLE));
  const hasMore = createMemo(() => displayRows().length > MAX_VISIBLE);

  // Reset selection when filter changes
  createEffect(() => {
    filter();
    setSelectedIndex(0);
  });

  // Get currently selected agent
  const selectedAgent = createMemo(() => {
    const rows = selectableRows();
    const idx = selectedIndex();
    if (idx >= 0 && idx < rows.length) {
      return rows[idx];
    }
    return null;
  });

  // Check if a row is selected
  const isSelected = (row: DisplayRow) => {
    const selected = selectedAgent();
    return selected && row.key === selected.key;
  };

  // Handle keyboard input
  useKeyboard((evt) => {
    // Ctrl+C: Exit
    if (evt.ctrl && evt.name === "c") {
      evt.preventDefault();
      evt.stopPropagation();
      props.onExit();
      return;
    }

    // Navigation up
    if (evt.name === "up" || (evt.ctrl && evt.name === "k")) {
      evt.preventDefault();
      evt.stopPropagation();
      setSelectedIndex((i) => Math.max(0, i - 1));
      return;
    }

    // Navigation down
    if (evt.name === "down" || (evt.ctrl && evt.name === "j")) {
      evt.preventDefault();
      evt.stopPropagation();
      setSelectedIndex((i) => Math.min(selectableRows().length - 1, i + 1));
      return;
    }

    // Selection
    if (evt.name === "return") {
      const selected = selectedAgent();
      if (selected?.agentId) {
        evt.preventDefault();
        evt.stopPropagation();
        props.onSelect(selected.agentId);
      }
      return;
    }

    // q to quit (when input is empty)
    if (evt.name === "q" && filter() === "") {
      evt.preventDefault();
      evt.stopPropagation();
      props.onExit();
      return;
    }
  });

  return (
    <box
      width={dimensions().width}
      height={dimensions().height}
      flexDirection="column"
      backgroundColor="#0f0f1a"
    >
      {/* Header */}
      <box
        padding={1}
        flexDirection="row"
        justifyContent="space-between"
        borderStyle="single"
        borderColor="#3a3a3a"
      >
        <text fg="#fab283" attributes={TextAttributes.BOLD}>
          Select Agent
        </text>
        <text fg="#6a6a6a">
          {selectableRows().length} of {allAgentPaths().length}
        </text>
      </box>

      {/* Search input */}
      <box padding={1}>
        <input
          ref={(r) => {
            inputRef = r;
          }}
          onInput={(e) => setFilter(e)}
          placeholder="Type to search..."
          backgroundColor="#1a1a2e"
          focusedBackgroundColor="#2a2a4e"
          cursorColor="#fab283"
          focusedTextColor="#eaeaea"
        />
      </box>

      {/* Tree list */}
      <scrollbox height={dimensions().height - 10}>
        <box flexDirection="column">
          <For each={visibleRows()}>
            {(row) => (
              <box backgroundColor={isSelected(row) ? "#2a2a4e" : undefined}>
                <text
                  fg={
                    isSelected(row)
                      ? "#ffffff"
                      : row.isAgent
                        ? "#a0a0a0"
                        : "#6a6a6a"
                  }
                >
                  {isSelected(row) ? "> " : "  "}
                  {"  ".repeat(row.indent)}
                  {row.label}
                  {row.hasChildren && !row.isAgent ? "/" : ""}
                </text>
              </box>
            )}
          </For>

          <Show when={hasMore()}>
            <text fg="#6a6a6a">
              {"  "}... {displayRows().length - MAX_VISIBLE} more (type to filter)
            </text>
          </Show>

          <Show when={visibleRows().length === 0}>
            <text fg="#6a6a6a">{"  "}No matches found</text>
          </Show>
        </box>
      </scrollbox>

      {/* Footer hints */}
      <box
        padding={1}
        flexDirection="row"
        justifyContent="space-between"
        borderStyle="single"
        borderColor="#3a3a3a"
      >
        <text fg="#6a6a6a">↑↓ navigate</text>
        <text fg="#6a6a6a">enter select</text>
        <text fg="#6a6a6a">q quit</text>
      </box>
    </box>
  );
}

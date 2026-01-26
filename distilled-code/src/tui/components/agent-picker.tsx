/**
 * AgentPicker Component
 *
 * Vim-periscope style fuzzy search dialog for selecting agents and threads.
 */

import {
  createSignal,
  createMemo,
  For,
  Show,
  createEffect,
  onMount,
} from "solid-js";
import { useKeyboard, useTerminalDimensions } from "@opentui/solid";
import { TextAttributes, type InputRenderable } from "@opentui/core";
import * as fuzzysort from "fuzzysort";
import { useRegistry } from "../context/registry.tsx";
import { useStore } from "../context/store.tsx";
import { useEffectOnce } from "../hooks/use-effect.ts";
import { StateStore } from "../../state/index.ts";
import * as Effect from "effect/Effect";

/**
 * Option item in the picker
 */
export interface PickerOption {
  id: string;
  title: string;
  category: "agent" | "thread";
  agentId: string;
  threadId?: string;
}

/**
 * Props for AgentPicker
 */
export interface AgentPickerProps {
  /**
   * Whether the picker is visible
   */
  visible: boolean;

  /**
   * Callback when an option is selected
   */
  onSelect: (option: PickerOption) => void;

  /**
   * Callback when picker is closed
   */
  onClose: () => void;
}

/**
 * Vim-periscope style fuzzy search picker
 */
export function AgentPicker(props: AgentPickerProps) {
  const dimensions = useTerminalDimensions();
  const registry = useRegistry();
  const store = useStore();

  const [filter, setFilter] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  let inputRef: InputRenderable | undefined;

  // Load existing threads from StateStore
  const threads = useEffectOnce(() =>
    Effect.gen(function* () {
      const stateStore = yield* StateStore;
      return yield* stateStore.listThreads();
    }),
  );

  // Focus input when picker becomes visible
  createEffect(() => {
    if (props.visible && inputRef) {
      setTimeout(() => inputRef?.focus(), 1);
    }
  });

  // Build options from agents and threads
  const allOptions = createMemo((): PickerOption[] => {
    const options: PickerOption[] = [];

    // Add agent definitions
    for (const agent of registry.agents) {
      options.push({
        id: `agent:${agent.id}`,
        title: agent.id,
        category: "agent",
        agentId: agent.id,
      });
    }

    // Add existing threads
    const threadList = threads.value();
    if (threadList) {
      for (const thread of threadList) {
        // Skip if it's just the default thread for an agent
        if (thread.threadId === thread.agentId) continue;

        options.push({
          id: `thread:${thread.agentId}:${thread.threadId}`,
          title: `${thread.agentId} / ${thread.threadId}`,
          category: "thread",
          agentId: thread.agentId,
          threadId: thread.threadId,
        });
      }
    }

    return options;
  });

  // Filter options using fuzzysort
  const filteredOptions = createMemo(() => {
    const needle = filter().toLowerCase().trim();
    const options = allOptions();

    if (!needle) return options;

    const result = fuzzysort
      .go(needle, options, {
        keys: ["title", "category"],
        threshold: -10000,
      })
      .map((r) => r.obj);

    return result;
  });

  // Reset selection when filter changes
  createEffect(() => {
    filter();
    setSelectedIndex(0);
  });

  // Handle keyboard input
  useKeyboard((evt) => {
    if (!props.visible) return;

    // Navigation
    if (evt.name === "up" || (evt.ctrl && evt.name === "p")) {
      setSelectedIndex((i) => Math.max(0, i - 1));
      return;
    }

    if (evt.name === "down" || (evt.ctrl && evt.name === "n")) {
      setSelectedIndex((i) => Math.min(filteredOptions().length - 1, i + 1));
      return;
    }

    // Selection
    if (evt.name === "return") {
      const options = filteredOptions();
      if (options.length > 0 && selectedIndex() < options.length) {
        props.onSelect(options[selectedIndex()]);
      }
      return;
    }

    // Close
    if (evt.name === "escape") {
      props.onClose();
      return;
    }
  });

  // Calculate dialog dimensions
  const dialogWidth = () => Math.min(60, dimensions().width - 4);
  const dialogHeight = () => Math.min(20, dimensions().height - 4);
  const dialogX = () => Math.floor((dimensions().width - dialogWidth()) / 2);
  const dialogY = () => Math.floor((dimensions().height - dialogHeight()) / 2);

  if (!props.visible) return null;

  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width={dimensions().width}
      height={dimensions().height}
      backgroundColor="rgba(0, 0, 0, 0.5)"
    >
      <box
        position="absolute"
        top={dialogY()}
        left={dialogX()}
        width={dialogWidth()}
        height={dialogHeight()}
        flexDirection="column"
        backgroundColor="#1a1a2e"
        borderStyle="rounded"
        borderColor="#fab283"
      >
        {/* Header */}
        <box padding={1} flexDirection="row" justifyContent="space-between">
          <text fg="#fab283" attributes={TextAttributes.BOLD}>
            Select Agent
          </text>
          <text fg="#6a6a6a">esc</text>
        </box>

        {/* Search input */}
        <box padding={1}>
          <input
            ref={(r) => {
              inputRef = r;
            }}
            onInput={(e) => setFilter(e)}
            placeholder="Search agents..."
            focusedBackgroundColor="#2a2a4e"
            cursorColor="#fab283"
            focusedTextColor="#eaeaea"
          />
        </box>

        {/* Options list */}
        <scrollbox height={dialogHeight() - 8}>
          <box flexDirection="column">
            <For each={filteredOptions()}>
              {(option, index) => (
                <box
                  padding={1}
                  backgroundColor={
                    index() === selectedIndex() ? "#2a2a4e" : undefined
                  }
                >
                  <box width={8}>
                    <text
                      fg={option.category === "agent" ? "#83fab2" : "#8383fa"}
                    >
                      {option.category === "agent" ? "[agent]" : "[thread]"}
                    </text>
                  </box>
                  <text
                    fg={index() === selectedIndex() ? "#ffffff" : "#d0d0d0"}
                  >
                    {option.title}
                  </text>
                </box>
              )}
            </For>

            <Show when={filteredOptions().length === 0}>
              <box padding={2} justifyContent="center">
                <text fg="#6a6a6a">No matches found</text>
              </box>
            </Show>
          </box>
        </scrollbox>

        {/* Footer hints */}
        <box padding={1} flexDirection="row" justifyContent="space-between">
          <text fg="#6a6a6a">↑↓ navigate</text>
          <text fg="#6a6a6a">enter select</text>
          <text fg="#6a6a6a">esc close</text>
        </box>
      </box>
    </box>
  );
}

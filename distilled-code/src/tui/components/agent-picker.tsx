/**
 * AgentPicker Component
 *
 * Full-screen fuzzy search for selecting agents and threads.
 * This is the home screen of the TUI.
 */

import { TextAttributes, type InputRenderable } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/solid";
import * as Effect from "effect/Effect";
import * as fuzzysort from "fuzzysort";
import { createEffect, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { StateStore } from "../../state/index.ts";
import { log } from "../../util/log.ts";
import { useRegistry } from "../context/registry.tsx";
import { useStore } from "../context/store.tsx";

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
   * Callback when an agent/thread is selected
   */
  onSelect: (agentId: string, threadId?: string) => void;

  /**
   * Callback when user wants to exit
   */
  onExit: () => void;
}

/**
 * Full-screen fuzzy search picker for agents and threads
 */
export function AgentPicker(props: AgentPickerProps) {
  const dimensions = useTerminalDimensions();
  const registry = useRegistry();
  const store = useStore();

  const [filter, setFilter] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [threads, setThreads] = createSignal<ReadonlyArray<{ agentId: string; threadId: string }>>([]);
  let inputRef: InputRenderable | undefined;

  // Load existing threads on mount using runtime.runPromise
  onMount(() => {
    log("AgentPicker", "Loading threads");
    store.runtime
      .runPromise(
        Effect.gen(function* () {
          const stateStore = yield* StateStore;
          return yield* stateStore.listThreads();
        }),
      )
      .then((result) => {
        log("AgentPicker", "Threads loaded", { count: result.length });
        setThreads(result);
      })
      .catch((err) => {
        log("AgentPicker", "Failed to load threads", err);
      });
  });

  // Focus input on mount
  onMount(() => {
    setTimeout(() => inputRef?.focus(), 10);
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
    for (const thread of threads()) {
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

  // Limit visible options for performance
  const MAX_VISIBLE = 50;
  const visibleOptions = createMemo(() => {
    const all = filteredOptions();
    return all.slice(0, MAX_VISIBLE);
  });
  const hasMore = createMemo(() => filteredOptions().length > MAX_VISIBLE);

  // Reset selection when filter changes
  createEffect(() => {
    filter();
    setSelectedIndex(0);
  });

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
      setSelectedIndex((i) => Math.min(visibleOptions().length - 1, i + 1));
      return;
    }

    // Selection
    if (evt.name === "return") {
      const options = visibleOptions();
      if (options.length > 0 && selectedIndex() < options.length) {
        evt.preventDefault();
        evt.stopPropagation();
        const selected = options[selectedIndex()];
        props.onSelect(selected.agentId, selected.threadId);
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
          {filteredOptions().length} of {allOptions().length}
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

      {/* Options list */}
      <scrollbox height={dimensions().height - 10}>
        <box flexDirection="column">
          <For each={visibleOptions()}>
            {(option, index) => (
              <box backgroundColor={index() === selectedIndex() ? "#2a2a4e" : undefined}>
                <text fg={index() === selectedIndex() ? "#ffffff" : "#a0a0a0"}>
                  {index() === selectedIndex() ? "> " : "  "}
                  {option.title}
                </text>
              </box>
            )}
          </For>

          <Show when={hasMore()}>
            <text fg="#6a6a6a">  ... {filteredOptions().length - MAX_VISIBLE} more (type to filter)</text>
          </Show>

          <Show when={visibleOptions().length === 0}>
            <text fg="#6a6a6a">  No matches found</text>
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

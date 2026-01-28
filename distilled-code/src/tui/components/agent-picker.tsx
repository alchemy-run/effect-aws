/**
 * AgentPicker Component
 *
 * Telescope-style fuzzy search for selecting agents.
 * Two-column layout: Results on left, Preview on right.
 * Search input at bottom.
 */

import { TextAttributes, type InputRenderable } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/solid";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js";
import {
  filterAgentPaths,
  type FuzzySearchResult,
} from "../../util/fuzzy-search.ts";
import { renderAgentTemplate } from "../../util/render-template.ts";
import { useRegistry } from "../context/registry.tsx";
import { useTheme } from "../context/theme.tsx";
import { MarkdownContent } from "./markdown-content.tsx";


/**
 * Props for HighlightedText component
 */
interface HighlightedTextProps {
  text: string;
  positions: Set<number>;
  isSelected: boolean;
}

/**
 * Renders text with matched characters highlighted
 * Groups consecutive matches for cleaner rendering
 */
function HighlightedText(props: HighlightedTextProps) {
  const segments = createMemo(() => {
    const result: Array<{ text: string; isMatch: boolean }> = [];
    const chars = props.text.split("");
    let currentSegment = "";
    let currentIsMatch = false;

    for (let i = 0; i < chars.length; i++) {
      const isMatch = props.positions.has(i);

      if (i === 0) {
        currentIsMatch = isMatch;
        currentSegment = chars[i];
      } else if (isMatch === currentIsMatch) {
        currentSegment += chars[i];
      } else {
        result.push({ text: currentSegment, isMatch: currentIsMatch });
        currentSegment = chars[i];
        currentIsMatch = isMatch;
      }
    }

    if (currentSegment) {
      result.push({ text: currentSegment, isMatch: currentIsMatch });
    }

    return result;
  });

  return (
    <box flexDirection="row">
      <For each={segments()}>
        {(segment) => (
          <text
            fg={
              segment.isMatch
                ? "#fab283" // Orange highlight for matches
                : props.isSelected
                  ? "#ffffff"
                  : "#a0a0a0"
            }
            attributes={segment.isMatch ? TextAttributes.BOLD : undefined}
          >
            {segment.text}
          </text>
        )}
      </For>
    </box>
  );
}

/**
 * Props for AgentPicker
 */
export interface AgentPickerProps {
  onSelect: (agentId: string, threadId?: string) => void;
  onExit: () => void;
}

/**
 * Telescope-style fuzzy search picker
 */
export function AgentPicker(props: AgentPickerProps) {
  const dimensions = useTerminalDimensions();
  const registry = useRegistry();

  const [filter, setFilter] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  let inputRef: InputRenderable | undefined;

  // Get theme and syntax highlighting from context
  const { theme, syntax } = useTheme();

  // Focus input on mount
  onMount(() => {
    setTimeout(() => inputRef?.focus(), 10);
  });

  // Layout constants
  const PADDING = 2;
  const SEARCH_HEIGHT = 3;
  const RESULTS_WIDTH_RATIO = 0.35;

  // Calculate available dimensions
  const innerWidth = createMemo(() => dimensions().width - PADDING * 2);
  const innerHeight = createMemo(() => dimensions().height - PADDING * 2);
  const resultsWidth = createMemo(() =>
    Math.floor(innerWidth() * RESULTS_WIDTH_RATIO),
  );
  const previewWidth = createMemo(() => innerWidth() - resultsWidth());
  const contentHeight = createMemo(() => innerHeight() - SEARCH_HEIGHT);

  // All agent paths
  const allAgentPaths = createMemo(() => registry.agents.map((a) => a.id));

  // Filtered results with match positions (FZF score order when filtering, original order when not)
  const filteredResults = createMemo(() =>
    filterAgentPaths(allAgentPaths(), filter()),
  );

  // Limit visible rows for performance
  const MAX_VISIBLE = 100;
  const visibleResults = createMemo(() =>
    filteredResults().slice(0, MAX_VISIBLE),
  );

  // Reset selection when filter changes
  createEffect(() => {
    filter();
    setSelectedIndex(0);
  });

  // Get currently selected result
  const selectedResult = createMemo((): FuzzySearchResult | null => {
    const results = filteredResults();
    const idx = selectedIndex();
    if (idx >= 0 && idx < results.length) {
      return results[idx];
    }
    return null;
  });

  // Get currently selected path (for compatibility)
  const selectedPath = createMemo(() => selectedResult()?.item ?? null);

  // Get selected agent and render its context
  const selectedAgent = createMemo(() => {
    const path = selectedPath();
    if (!path) return null;
    return registry.getAgent(path) ?? null;
  });

  // Render preview content for selected agent
  const previewContent = createMemo(() => {
    const agent = selectedAgent();
    if (!agent) return null;

    const rendered = renderAgentTemplate(agent);
    return `# @${agent.id}\n\n${rendered}`;
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

    // Ctrl+W: Delete word - update filter signal, input is controlled by value={filter()}
    if (evt.ctrl && evt.name === "w") {
      evt.preventDefault();
      evt.stopPropagation();
      setFilter((current) => current.replace(/\s*\S*\s*$/, ""));
      return;
    }

    // Ctrl+U: Clear line
    if (evt.ctrl && evt.name === "u") {
      evt.preventDefault();
      evt.stopPropagation();
      setFilter("");
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
      setSelectedIndex((i) => Math.min(filteredResults().length - 1, i + 1));
      return;
    }

    // Selection
    if (evt.name === "return") {
      const selected = selectedPath();
      if (selected) {
        evt.preventDefault();
        evt.stopPropagation();
        props.onSelect(selected);
      }
      return;
    }

    // Escape or q to quit (when input is empty)
    if (evt.name === "escape" || (evt.name === "q" && filter() === "")) {
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
      justifyContent="center"
      alignItems="center"
      backgroundColor="#0f0f1a"
    >
      {/* Main container with padding */}
      <box width={innerWidth()} height={innerHeight()} flexDirection="row">
        {/* Left column: Results + Search */}
        <box
          width={resultsWidth()}
          height={innerHeight()}
          flexDirection="column"
        >
          {/* Results panel */}
          <box
            width={resultsWidth()}
            height={contentHeight()}
            flexDirection="column"
            borderStyle="single"
            borderColor="#3a3a3a"
          >
            {/* Results header */}
            <box paddingLeft={1} paddingRight={1}>
              <text fg="#fab283" attributes={TextAttributes.BOLD}>
                Results
              </text>
            </box>

            {/* Separator line using text */}
            <box paddingLeft={1} paddingRight={1}>
              <text fg="#3a3a3a">{"─".repeat(resultsWidth() - 4)}</text>
            </box>

            {/* Results list */}
            <scrollbox height={contentHeight() - 5}>
              <box flexDirection="column">
                <For each={visibleResults()}>
                  {(result) => {
                    const isSelected = () => result.item === selectedPath();
                    return (
                      <box
                        backgroundColor={isSelected() ? "#2a2a4e" : undefined}
                        paddingLeft={1}
                        flexDirection="row"
                      >
                        <text fg={isSelected() ? "#ffffff" : "#a0a0a0"}>
                          {isSelected() ? "> " : "  "}
                        </text>
                        <HighlightedText
                          text={result.item}
                          positions={result.positions}
                          isSelected={isSelected()}
                        />
                      </box>
                    );
                  }}
                </For>

                <Show when={visibleResults().length === 0}>
                  <box paddingLeft={1}>
                    <text fg="#6a6a6a">No matches found</text>
                  </box>
                </Show>
              </box>
            </scrollbox>
          </box>

          {/* Search bar (bottom of left column) */}
          <box
            width={resultsWidth()}
            height={SEARCH_HEIGHT}
            flexDirection="column"
            justifyContent="center"
            borderStyle="single"
            borderColor="#3a3a3a"
          >
            {/* Inner row for content */}
            <box
              flexDirection="row"
              paddingLeft={1}
              paddingRight={1}
            >
              {/* Prompt prefix */}
              <text fg="#fab283">{"> "}</text>

              {/* Search input - takes remaining space */}
              <box flexGrow={1}>
                <input
                  ref={(r) => {
                    inputRef = r;
                  }}
                  width={resultsWidth() - 12}
                  value={filter()}
                  onInput={(e) => setFilter(e)}
                  placeholder="Find agents..."
                  backgroundColor="#0f0f1a"
                  focusedBackgroundColor="#0f0f1a"
                  cursorColor="#fab283"
                  focusedTextColor="#eaeaea"
                />
              </box>

              {/* Counter */}
              <text fg="#6a6a6a">
                {" "}
                {filteredResults().length > 0 ? selectedIndex() + 1 : 0}/
                {filteredResults().length}
              </text>
            </box>
          </box>
        </box>

        {/* Preview panel (right) - full height */}
        <box
          width={previewWidth()}
          height={innerHeight()}
          flexDirection="column"
          borderStyle="single"
          borderColor="#3a3a3a"
        >
          {/* Preview header */}
          <box paddingLeft={1} paddingRight={1}>
            <text fg="#8383fa" attributes={TextAttributes.BOLD}>
              Preview
            </text>
          </box>

          {/* Separator line using text */}
          <box paddingLeft={1} paddingRight={1}>
            <text fg="#3a3a3a">{"─".repeat(previewWidth() - 4)}</text>
          </box>

          {/* Preview content with markdown highlighting */}
          <scrollbox height={innerHeight() - 5}>
            <box flexDirection="column" paddingLeft={1} paddingRight={1}>
              <Show
                when={previewContent()}
                fallback={
                  <text fg="#6a6a6a">Select an agent to preview</text>
                }
              >
                <MarkdownContent content={previewContent()!} streaming={false} />
              </Show>
            </box>
          </scrollbox>
        </box>
      </box>
    </box>
  );
}

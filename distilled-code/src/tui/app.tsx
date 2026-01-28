/**
 * App Component
 *
 * Root component for the Agent Browser TUI.
 * Discord-like layout: sidebar on left, chat on right.
 * Arrow keys to navigate, Enter to focus chat, Escape to return to sidebar.
 */

// Initialize parsers before any component that uses <code>
import "./parsers/init.ts";

import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/solid";
import { createMemo, createSignal, For, Show } from "solid-js";
import type { ChannelType } from "../state/thread.ts";
import { ChatView } from "./components/chat-view.tsx";
import { useRegistry } from "./context/registry.tsx";
import { useStore } from "./context/store.tsx";
import { ThemeProvider } from "./context/theme.tsx";

/**
 * Selection state for sidebar items
 */
interface Selection {
  type: ChannelType;
  id: string;
}

/**
 * Navigation item for the sidebar
 */
interface NavItem {
  type: ChannelType;
  id: string;
  label: string;
}

/**
 * Root App component with Discord-like layout
 */
export function App() {
  const dimensions = useTerminalDimensions();
  const renderer = useRenderer();
  const store = useStore();
  const registry = useRegistry();

  // Build navigation items from registry
  const navItems = createMemo<NavItem[]>(() => {
    const items: NavItem[] = [];

    // Add DMs (agents) first
    for (const agent of registry.agents) {
      items.push({
        type: "dm",
        id: agent.id,
        label: `@${agent.id}`,
      });
    }

    // TODO: Add groups and channels when available in registry
    // for (const group of registry.groups) { ... }
    // for (const channel of registry.channels) { ... }

    return items;
  });

  // Currently selected index in sidebar
  const [selectedIndex, setSelectedIndex] = createSignal(0);

  // Whether chat is focused (vs sidebar)
  const [chatFocused, setChatFocused] = createSignal(false);

  // Get current selection
  const currentSelection = createMemo<Selection | undefined>(() => {
    const items = navItems();
    const index = selectedIndex();
    if (index >= 0 && index < items.length) {
      return { type: items[index].type, id: items[index].id };
    }
    return undefined;
  });

  // Layout dimensions
  const sidebarWidth = () => Math.min(30, Math.floor(dimensions().width * 0.25));
  const contentWidth = () => dimensions().width - sidebarWidth();

  // Exit the app
  const handleExit = () => {
    renderer.destroy();
    store.exit();
  };

  // Handle back from chat to sidebar
  const handleBack = () => {
    setChatFocused(false);
  };

  // Keyboard navigation
  useKeyboard((evt) => {
    // Quit on Ctrl+C
    if (evt.ctrl && evt.name === "c") {
      evt.preventDefault();
      evt.stopPropagation();
      handleExit();
      return;
    }

    // If chat is focused, let ChatView handle keyboard
    // Only handle Escape to return to sidebar
    if (chatFocused()) {
      if (evt.name === "escape") {
        evt.preventDefault();
        evt.stopPropagation();
        setChatFocused(false);
      }
      return;
    }

    // Sidebar navigation
    const items = navItems();

    // Navigate up
    if (evt.name === "up" || (evt.ctrl && evt.name === "k")) {
      evt.preventDefault();
      evt.stopPropagation();
      setSelectedIndex((i) => Math.max(0, i - 1));
      return;
    }

    // Navigate down
    if (evt.name === "down" || (evt.ctrl && evt.name === "j")) {
      evt.preventDefault();
      evt.stopPropagation();
      setSelectedIndex((i) => Math.min(items.length - 1, i + 1));
      return;
    }

    // Enter to focus chat
    if (evt.name === "return") {
      evt.preventDefault();
      evt.stopPropagation();
      if (currentSelection()) {
        setChatFocused(true);
      }
      return;
    }

    // Escape or q to quit (when sidebar is focused)
    if (evt.name === "escape" || evt.name === "q") {
      evt.preventDefault();
      evt.stopPropagation();
      handleExit();
      return;
    }
  });

  return (
    <ThemeProvider mode="dark">
      <box
        width={dimensions().width}
        height={dimensions().height}
        backgroundColor="#0f0f1a"
        flexDirection="row"
      >
        {/* Sidebar */}
        <box
          width={sidebarWidth()}
          height={dimensions().height}
          flexDirection="column"
          borderStyle="single"
          borderColor={chatFocused() ? "#3a3a3a" : "#fab283"}
        >
          {/* Header */}
          <box paddingLeft={1} paddingRight={1}>
            <text fg="#fab283">Agents</text>
          </box>

          {/* Separator */}
          <box paddingLeft={1} paddingRight={1}>
            <text fg="#3a3a3a">{"─".repeat(sidebarWidth() - 4)}</text>
          </box>

          {/* Navigation items */}
          <scrollbox height={dimensions().height - 5}>
            <box flexDirection="column">
              <For each={navItems()}>
                {(item, index) => {
                  const isSelected = () => selectedIndex() === index();
                  return (
                    <box
                      backgroundColor={isSelected() ? "#2a2a4e" : undefined}
                      paddingLeft={1}
                      flexDirection="row"
                    >
                      <text fg={isSelected() ? "#ffffff" : "#a0a0a0"}>
                        {isSelected() ? "> " : "  "}
                      </text>
                      <text fg={isSelected() ? "#ffffff" : "#88c0d0"}>
                        {item.label}
                      </text>
                    </box>
                  );
                }}
              </For>
            </box>
          </scrollbox>

          {/* Help text */}
          <box paddingLeft={1} paddingRight={1}>
            <text fg="#666666">
              {chatFocused() ? "ESC: back" : "↑↓: nav  ⏎: chat  q: quit"}
            </text>
          </box>
        </box>

        {/* Chat area */}
        <box
          width={contentWidth()}
          height={dimensions().height}
          flexDirection="column"
        >
          <Show
            when={currentSelection()}
            fallback={
              <box
                width={contentWidth()}
                height={dimensions().height}
                justifyContent="center"
                alignItems="center"
              >
                <text fg="#666666">Select an agent to start chatting</text>
              </box>
            }
          >
            {(selection) => (
              <ChatView
                agentId={selection().id}
                focused={chatFocused()}
                onBack={handleBack}
                onExit={handleExit}
              />
            )}
          </Show>
        </box>
      </box>
    </ThemeProvider>
  );
}

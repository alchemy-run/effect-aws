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
import { DocumentView } from "./components/document-view.tsx";
import { MembersSidebar } from "./components/members-sidebar.tsx";
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
  type: ChannelType | "header";
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

  // Build navigation items from registry with section headers
  const navItems = createMemo<NavItem[]>(() => {
    const items: NavItem[] = [];

    // Channels section
    if (registry.channels.length > 0) {
      items.push({
        type: "header",
        id: "header-channels",
        label: "Channels",
      });
      for (const channel of registry.channels) {
        items.push({
          type: "channel",
          id: channel.id,
          label: `#${channel.id}`,
        });
      }
    }

    // Group Chats section
    if (registry.groupChats.length > 0) {
      items.push({
        type: "header",
        id: "header-groups",
        label: "Group Chats",
      });
      for (const groupChat of registry.groupChats) {
        items.push({
          type: "group",
          id: groupChat.id,
          label: `&${groupChat.id}`,
        });
      }
    }

    // Agents section
    if (registry.agents.length > 0) {
      items.push({
        type: "header",
        id: "header-agents",
        label: "Agents",
      });
      for (const agent of registry.agents) {
        items.push({
          type: "dm",
          id: agent.id,
          label: `@${agent.id}`,
        });
      }
    }

    return items;
  });

  // Get selectable items only (exclude headers)
  const selectableItems = createMemo(() =>
    navItems().filter((item) => item.type !== "header")
  );

  // Currently selected index in sidebar
  const [selectedIndex, setSelectedIndex] = createSignal(0);

  // Whether chat is focused (vs sidebar)
  const [chatFocused, setChatFocused] = createSignal(false);

  // View mode for right panel: "chat" or "document"
  const [viewMode, setViewMode] = createSignal<"chat" | "document">("chat");

  // Get current selection (from selectable items)
  const currentSelection = createMemo<Selection | undefined>(() => {
    const items = selectableItems();
    const index = selectedIndex();
    if (index >= 0 && index < items.length) {
      const item = items[index];
      return { type: item.type as ChannelType, id: item.id };
    }
    return undefined;
  });

  // Get the currently selected item ID for highlighting
  const selectedItemId = createMemo(() => {
    const items = selectableItems();
    const index = selectedIndex();
    if (index >= 0 && index < items.length) {
      return items[index].id;
    }
    return undefined;
  });

  // Layout dimensions
  const sidebarWidth = () => Math.min(30, Math.floor(dimensions().width * 0.25));
  const membersSidebarWidth = () => Math.min(24, Math.floor(dimensions().width * 0.18));
  // Show members sidebar for channels and groups
  const showMembersSidebar = () => {
    const sel = currentSelection();
    return sel && (sel.type === "channel" || sel.type === "group");
  };
  const contentWidth = () => {
    const base = dimensions().width - sidebarWidth();
    return showMembersSidebar() ? base - membersSidebarWidth() : base;
  };

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

    // If document view is showing, ESC returns to chat view
    if (viewMode() === "document") {
      if (evt.name === "escape") {
        evt.preventDefault();
        evt.stopPropagation();
        setViewMode("chat");
      }
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

    // Sidebar navigation (use selectable items for navigation)
    const items = selectableItems();

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

    // p to open document view (preview)
    if (evt.name === "p") {
      evt.preventDefault();
      evt.stopPropagation();
      if (currentSelection()) {
        setViewMode("document");
      }
      return;
    }

    // Enter to focus chat
    if (evt.name === "return") {
      evt.preventDefault();
      evt.stopPropagation();
      if (currentSelection()) {
        setViewMode("chat");
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

  // Determine help text based on current state
  const helpText = () => {
    if (viewMode() === "document") return "ESC: back";
    if (chatFocused()) return "ESC: back";
    return "j/k ent:chat p:doc q";
  };

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
          borderColor={chatFocused() || viewMode() === "document" ? "#3a3a3a" : "#fab283"}
        >
          {/* Header */}
          <box paddingLeft={1} paddingRight={1}>
            <text fg="#fab283">Organization</text>
          </box>

          {/* Separator */}
          <box paddingLeft={1} paddingRight={1}>
            <text fg="#3a3a3a">{"─".repeat(sidebarWidth() - 4)}</text>
          </box>

          {/* Navigation items */}
          <scrollbox height={dimensions().height - 5}>
            <box flexDirection="column">
              <For each={navItems()}>
                {(item) => {
                  // Headers are rendered differently
                  if (item.type === "header") {
                    return (
                      <box paddingLeft={1} paddingTop={1}>
                        <text fg="#6a6a6a">{item.label}</text>
                      </box>
                    );
                  }

                  const isSelected = () => selectedItemId() === item.id;
                  // Color based on item type: channels green, groups purple, agents blue
                  const itemColor = () => {
                    if (isSelected()) return "#ffffff";
                    switch (item.type) {
                      case "channel":
                        return "#a3be8c"; // Green for channels
                      case "group":
                        return "#b48ead"; // Purple for groups
                      default:
                        return "#88c0d0"; // Blue for DMs
                    }
                  };
                  return (
                    <box
                      backgroundColor={isSelected() ? "#2a2a4e" : undefined}
                      paddingLeft={1}
                      flexDirection="row"
                    >
                      <text fg={isSelected() ? "#ffffff" : "#a0a0a0"}>
                        {isSelected() ? "> " : "  "}
                      </text>
                      <text fg={itemColor()}>
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
            <text fg="#666666">{helpText()}</text>
          </box>
        </box>

        {/* Right panel: Chat or Document view */}
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
                <text fg="#666666">Select a channel or agent to start chatting</text>
              </box>
            }
          >
            {(selection) => (
              <Show
                when={viewMode() === "document"}
                fallback={
                  <box flexDirection="row" width="100%" height="100%">
                    <ChatView
                      type={selection().type}
                      id={selection().id}
                      focused={chatFocused()}
                      onBack={handleBack}
                      onExit={handleExit}
                    />
                    <Show when={showMembersSidebar()}>
                      <MembersSidebar
                        type={selection().type}
                        id={selection().id}
                        width={membersSidebarWidth()}
                        height={dimensions().height}
                      />
                    </Show>
                  </box>
                }
              >
                <DocumentView id={selection().id} />
              </Show>
            )}
          </Show>
        </box>
      </box>
    </ThemeProvider>
  );
}

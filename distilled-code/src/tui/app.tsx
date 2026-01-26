/**
 * App Component
 *
 * Root component for the Agent Browser TUI with routing and keyboard handling.
 */

import { createSignal, Show } from "solid-js";
import {
  useKeyboard,
  useRenderer,
  useTerminalDimensions,
} from "@opentui/solid";
import { TextAttributes } from "@opentui/core";
import { AgentPicker, type PickerOption } from "./components/agent-picker.tsx";
import { SessionView } from "./components/session-view.tsx";
import { useStore } from "./context/store.tsx";
import { useRegistry } from "./context/registry.tsx";
import { log, logError } from "../util/log.ts";

/**
 * Route state
 */
type Route =
  | { type: "home" }
  | { type: "session"; agentId: string; threadId?: string };

/**
 * Root App component
 */
export function App() {
  log("App", "App component initializing");

  const dimensions = useTerminalDimensions();
  log("App", "Got terminal dimensions", dimensions());

  const renderer = useRenderer();
  log("App", "Got renderer");

  const store = useStore();
  log("App", "Got store");

  const registry = useRegistry();
  log("App", "Got registry", { agentCount: registry.agents.length });

  // Route state
  const [route, setRoute] = createSignal<Route>({ type: "home" });
  log("App", "Initial route set to home");

  // UI state
  const [pickerVisible, setPickerVisible] = createSignal(true);
  const [inputFocused, setInputFocused] = createSignal(false);

  // Handle keyboard shortcuts
  useKeyboard((evt) => {
    // Ctrl+P: Open agent picker
    if (evt.ctrl && evt.name === "p") {
      setPickerVisible(true);
      setInputFocused(false);
      return;
    }

    // Ctrl+N: New thread with current agent
    if (evt.ctrl && evt.name === "n") {
      const current = route();
      if (current.type === "session") {
        const newThreadId = `${current.agentId}-${Date.now()}`;
        setRoute({
          type: "session",
          agentId: current.agentId,
          threadId: newThreadId,
        });
      }
      return;
    }

    // Escape: Toggle between picker and session
    if (evt.name === "escape") {
      if (pickerVisible()) {
        if (route().type === "session") {
          setPickerVisible(false);
          setInputFocused(true);
        }
      } else {
        setInputFocused(false);
      }
      return;
    }

    // q: Quit (when not in input mode)
    if (evt.name === "q" && !inputFocused() && !pickerVisible()) {
      renderer.destroy();
      store.exit();
      return;
    }

    // i or Enter: Focus input
    if (
      (evt.name === "i" || evt.name === "return") &&
      !inputFocused() &&
      !pickerVisible()
    ) {
      setInputFocused(true);
      return;
    }

    // /: Open picker (vim-style)
    if (evt.name === "slash" && !inputFocused()) {
      setPickerVisible(true);
      return;
    }
  });

  // Handle agent/thread selection
  const handleSelect = (option: PickerOption) => {
    setRoute({
      type: "session",
      agentId: option.agentId,
      threadId: option.threadId,
    });
    setPickerVisible(false);
    setInputFocused(true);
  };

  // Handle picker close
  const handlePickerClose = () => {
    if (route().type === "session") {
      setPickerVisible(false);
      setInputFocused(true);
    }
  };

  return (
    <box
      width={dimensions().width}
      height={dimensions().height}
      backgroundColor="#0f0f1a"
    >
      {/* Main content */}
      <Show
        when={route().type === "session"}
        fallback={<HomeScreen onOpenPicker={() => setPickerVisible(true)} />}
      >
        {(() => {
          const r = route();
          if (r.type !== "session") return null;
          return (
            <SessionView
              agentId={r.agentId}
              threadId={r.threadId}
              inputFocused={inputFocused() && !pickerVisible()}
            />
          );
        })()}
      </Show>

      {/* Agent picker overlay */}
      <AgentPicker
        visible={pickerVisible()}
        onSelect={handleSelect}
        onClose={handlePickerClose}
      />
    </box>
  );
}

/**
 * Home screen shown when no session is active
 */
function HomeScreen(props: { onOpenPicker: () => void }) {
  const dimensions = useTerminalDimensions();
  const registry = useRegistry();

  return (
    <box
      width={dimensions().width}
      height={dimensions().height}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <text fg="#fab283" attributes={TextAttributes.BOLD}>
        Agent Browser TUI
      </text>
      <text fg="#6a6a6a">
        {registry.agents.length} agent{registry.agents.length !== 1 ? "s" : ""}{" "}
        available
      </text>
      <box marginTop={2} flexDirection="column" alignItems="center" gap={1}>
        <text fg="#4a4a4a">Press Ctrl+P or / to open agent picker</text>
        <text fg="#4a4a4a">Press q to quit</text>
      </box>
    </box>
  );
}

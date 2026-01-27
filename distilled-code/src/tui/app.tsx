/**
 * App Component
 *
 * Root component for the Agent Browser TUI.
 * Simple two-screen architecture: home (agent picker) and chat.
 */

// Initialize parsers before any component that uses <code>
import "./parsers/init.ts";

import { useRenderer, useTerminalDimensions } from "@opentui/solid";
import { createSignal, Match, Switch } from "solid-js";
import { log } from "../util/log.ts";
import { AgentPicker } from "./components/agent-picker.tsx";
import { ChatView } from "./components/chat-view.tsx";
import { useStore } from "./context/store.tsx";
import { ThemeProvider } from "./context/theme.tsx";

/**
 * Screen state - either home (picker) or chat
 */
type Screen =
  | { type: "home" }
  | { type: "chat"; agentId: string; threadId?: string };

/**
 * Root App component
 *
 * No global keyboard handler - each screen handles its own keyboard events.
 */
export function App() {
  log("App", "App component initializing");

  const dimensions = useTerminalDimensions();
  const renderer = useRenderer();
  const store = useStore();

  // Simple screen state - start on home (picker)
  const [screen, setScreen] = createSignal<Screen>({ type: "home" });

  // Navigate to chat when agent is selected
  const handleSelect = (agentId: string, threadId?: string) => {
    log("App", "Agent selected", { agentId, threadId });
    setScreen({ type: "chat", agentId, threadId });
  };

  // Navigate back to home
  const handleBack = () => {
    log("App", "Back to home");
    setScreen({ type: "home" });
  };

  // Exit the app
  const handleExit = () => {
    log("App", "Exit requested");
    renderer.destroy();
    store.exit();
  };

  return (
    <ThemeProvider mode="dark">
      <box
        width={dimensions().width}
        height={dimensions().height}
        backgroundColor="#0f0f1a"
      >
        <Switch>
          <Match when={screen().type === "home"}>
            <AgentPicker onSelect={handleSelect} onExit={handleExit} />
          </Match>
          <Match when={screen().type === "chat"}>
            {(() => {
              const s = screen();
              if (s.type !== "chat") return null;
              return (
                <ChatView
                  agentId={s.agentId}
                  threadId={s.threadId}
                  onBack={handleBack}
                  onExit={handleExit}
                />
              );
            })()}
          </Match>
        </Switch>
      </box>
    </ThemeProvider>
  );
}

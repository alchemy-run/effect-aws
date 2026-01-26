/**
 * Agent Browser TUI
 *
 * Terminal UI for browsing agents, viewing message streams, and sending messages.
 */

// Re-export components for custom TUI building
export { App } from "./app.tsx";
export { AgentPicker } from "./components/agent-picker.tsx";
export { InputBox } from "./components/input-box.tsx";
export { MessageStream } from "./components/message-stream.tsx";
export { SessionView } from "./components/session-view.tsx";
export { RegistryProvider, useRegistry } from "./context/registry.tsx";
export { StoreProvider, useStore } from "./context/store.tsx";

import type { LanguageModel } from "@effect/ai/LanguageModel";
import { render } from "@opentui/solid";
import type { Layer } from "effect/Layer";
import type { Agent } from "../agent.ts";
import type { StateStore, StateStoreError } from "../state/index.ts";
import { log, logError } from "../util/log.ts";
import { App } from "./app.tsx";
import { RegistryProvider } from "./context/registry.tsx";
import { StoreProvider } from "./context/store.tsx";

/**
 * Options for starting the TUI
 */
export interface TuiOptions {
  /**
   * Available agent definitions that can be spawned
   */
  agents: Agent[];

  /**
   * Layer providing StateStore, LanguageModel, and other dependencies
   */
  layer: Layer<StateStore | LanguageModel, StateStoreError, never>;
}

/**
 * Start the Agent Browser TUI
 *
 * @example
 * ```typescript
 * import { tui } from "distilled-code/tui";
 * import { StateStoreSqlite } from "distilled-code";
 *
 * class MyAgent extends Agent("my-agent")`A helpful assistant` {}
 *
 * await tui({
 *   agents: [MyAgent],
 *   layer: Layer.mergeAll(StateStoreSqlite.layer, AnthropicLayer),
 * });
 * ```
 */
export function tui(options: TuiOptions): Promise<void> {
  log("TUI", "Starting TUI", { agentCount: options.agents.length });
  log(
    "TUI",
    "Agents",
    options.agents.map((a) => a.id),
  );

  return new Promise<void>((resolve, reject) => {
    const onExit = () => {
      log("TUI", "Exit callback triggered");
      resolve();
    };

    try {
      log("TUI", "About to call render()");
      const renderer = render(
        () => {
          log("TUI", "Render factory called");
          try {
            return (
              <RegistryProvider agents={options.agents}>
                <StoreProvider layer={options.layer} onExit={onExit}>
                  <App />
                </StoreProvider>
              </RegistryProvider>
            );
          } catch (err) {
            logError("TUI", "Error in render function", err);
            throw err;
          }
        },
        {
          targetFps: 60,
          exitOnCtrlC: true,
        },
      );
      log("TUI", "render() returned", { renderer: typeof renderer });
    } catch (err) {
      logError("TUI", "Error calling render()", err);
      reject(err);
    }
  });
}


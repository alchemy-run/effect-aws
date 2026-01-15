/**
 * TUI Entry Point
 * Renders the terminal UI with all context providers
 */
import { render } from "@opentui/solid";
import { createSignal, ErrorBoundary } from "solid-js";
import { App } from "./App.tsx";
import { ThemeProvider, SyncProvider, DialogProvider } from "./context/index.ts";
import {
  MessageData,
  SubAgentTask,
  TuiController,
  TuiCallbacks,
  Part,
  SessionStatus,
} from "./types.ts";

// =============================================================================
// Root Component with Providers
// =============================================================================

interface RootProps {
  onMessage: (message: string) => void;
  onInterrupt: () => void;
  messages: () => MessageData[];
  subAgents: () => SubAgentTask[];
  isProcessing: () => boolean;
}

function Root(props: RootProps) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <ErrorComponent error={error} reset={reset} />
      )}
    >
      <ThemeProvider mode="dark">
        <SyncProvider>
          <DialogProvider>
            <box
              width="100%"
              height="100%"
            >
              <App
                onMessage={props.onMessage}
                onInterrupt={props.onInterrupt}
                messages={props.messages}
                subAgents={props.subAgents}
                isProcessing={props.isProcessing}
              />
            </box>
          </DialogProvider>
        </SyncProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// =============================================================================
// Error Component
// =============================================================================

function ErrorComponent(props: { error: Error; reset: () => void }) {
  return (
    <box flexDirection="column" gap={1} padding={2}>
      <text bold color="red">
        A fatal error occurred!
      </text>
      <text color="gray">{props.error.message}</text>
      <box
        onMouseUp={props.reset}
        backgroundColor="blue"
        paddingX={2}
        paddingY={1}
      >
        <text color="white">Reset TUI</text>
      </box>
      <text color="gray" wrapMode="word">
        {props.error.stack}
      </text>
    </box>
  );
}

// =============================================================================
// Create TUI Function
// =============================================================================

export function createTui(callbacks: TuiCallbacks): TuiController {
  const [messages, setMessages] = createSignal<MessageData[]>([]);
  const [subAgents, setSubAgents] = createSignal<SubAgentTask[]>([]);
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [_parts, setParts] = createSignal<Record<string, Part[]>>({});
  const [_sessionStatus, setSessionStatus] = createSignal<SessionStatus>({ type: "idle" });

  const controller: TuiController = {
    addMessage: (message: MessageData) => {
      setMessages((prev) => [...prev, message]);
    },

    updateMessage: (id: string, update: Partial<MessageData>) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...update } : m))
      );
    },

    setProcessing: (processing: boolean) => {
      setIsProcessing(processing);
    },

    addSubAgent: (task: SubAgentTask) => {
      setSubAgents((prev) => [...prev, task]);
    },

    updateSubAgent: (id: string, update: Partial<SubAgentTask>) => {
      setSubAgents((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...update } : t))
      );
    },

    clearSubAgents: () => {
      setSubAgents([]);
    },

    // New part-based methods
    addPart: (messageID: string, part: Part) => {
      setParts((prev) => {
        const existing = prev[messageID] ?? [];
        return { ...prev, [messageID]: [...existing, part] as Part[] };
      });
    },

    updatePart: (messageID: string, partID: string, update: Partial<Part>) => {
      setParts((prev) => {
        const existing = prev[messageID] ?? [];
        return {
          ...prev,
          [messageID]: existing.map((p) =>
            p.id === partID ? { ...p, ...update } as Part : p
          ) as Part[],
        };
      });
    },

    setSessionStatus: (status: SessionStatus) => {
      setSessionStatus(status);
      setIsProcessing(status.type === "running");
    },
  };

  // Renderer configuration
  const rendererConfig = {
    targetFps: 60,
    gatherStats: false,
    exitOnCtrlC: true,
  } as const;

  render(
    () => (
      <Root
        onMessage={callbacks.onMessage}
        onInterrupt={callbacks.onInterrupt}
        messages={messages}
        subAgents={subAgents}
        isProcessing={isProcessing}
      />
    ),
    rendererConfig
  );

  return controller;
}

// =============================================================================
// Exports
// =============================================================================

export type {
  MessageData,
  SubAgentTask,
  TuiController,
  TuiCallbacks,
  Part,
  ToolPart,
  TextPart,
  ReasoningPart,
  SessionStatus,
} from "./types.ts";

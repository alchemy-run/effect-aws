/**
 * Sync context - Reactive stores for messages, parts, and session state
 * Inspired by OpenCode's sync context pattern
 */
import { createContext, useContext, type ParentProps } from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import type {
  Message,
  Part,
  Session,
  SessionStatus,
  SubAgentTask,
  TuiEvent,
} from "../types.ts";

// =============================================================================
// Store Types
// =============================================================================

interface SyncStore {
  status: "loading" | "ready";
  session: Session | null;
  sessionStatus: SessionStatus;
  messages: Message[];
  parts: Record<string, Part[]>; // messageID -> parts
  subAgents: SubAgentTask[];
}

// =============================================================================
// Sync Context
// =============================================================================

interface SyncContextValue {
  data: SyncStore;
  
  // Session management
  setSession: (session: Session | null) => void;
  setSessionStatus: (status: SessionStatus) => void;
  
  // Message management
  addMessage: (message: Message) => void;
  updateMessage: (id: string, update: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  
  // Part management
  addPart: (messageID: string, part: Part) => void;
  updatePart: (messageID: string, partID: string, update: Partial<Part>) => void;
  removePart: (messageID: string, partID: string) => void;
  
  // Sub-agent management
  addSubAgent: (task: SubAgentTask) => void;
  updateSubAgent: (id: string, update: Partial<SubAgentTask>) => void;
  clearSubAgents: () => void;
  
  // Bulk operations
  handleEvent: (event: TuiEvent) => void;
  reset: () => void;
}

const SyncContext = createContext<SyncContextValue>();

const initialStore: SyncStore = {
  status: "loading",
  session: null,
  sessionStatus: { type: "idle" },
  messages: [],
  parts: {},
  subAgents: [],
};

export function SyncProvider(props: ParentProps) {
  const [store, setStore] = createStore<SyncStore>({ ...initialStore });

  const value: SyncContextValue = {
    get data() {
      return store;
    },

    setSession: (session) => {
      setStore("session", session);
      if (session) {
        setStore("status", "ready");
      }
    },

    setSessionStatus: (status) => {
      setStore("sessionStatus", status);
    },

    addMessage: (message) => {
      setStore(
        "messages",
        produce((messages) => {
          // Insert in sorted order by ID
          const index = messages.findIndex((m) => m.id > message.id);
          if (index === -1) {
            messages.push(message);
          } else {
            messages.splice(index, 0, message);
          }
        })
      );
    },

    updateMessage: (id, update) => {
      setStore(
        "messages",
        produce((messages) => {
          const index = messages.findIndex((m) => m.id === id);
          if (index !== -1) {
            Object.assign(messages[index], update);
          }
        })
      );
    },

    removeMessage: (id) => {
      setStore(
        "messages",
        produce((messages) => {
          const index = messages.findIndex((m) => m.id === id);
          if (index !== -1) {
            messages.splice(index, 1);
          }
        })
      );
      // Also remove associated parts
      setStore("parts", id, undefined as any);
    },

    addPart: (messageID, part) => {
      setStore(
        "parts",
        produce((parts) => {
          if (!parts[messageID]) {
            parts[messageID] = [];
          }
          // Insert in sorted order by ID
          const arr = parts[messageID];
          const index = arr.findIndex((p) => p.id > part.id);
          if (index === -1) {
            arr.push(part);
          } else {
            arr.splice(index, 0, part);
          }
        })
      );
    },

    updatePart: (messageID, partID, update) => {
      setStore(
        "parts",
        messageID,
        produce((parts) => {
          if (!parts) return;
          const index = parts.findIndex((p) => p.id === partID);
          if (index !== -1) {
            Object.assign(parts[index], update);
          }
        })
      );
    },

    removePart: (messageID, partID) => {
      setStore(
        "parts",
        messageID,
        produce((parts) => {
          if (!parts) return;
          const index = parts.findIndex((p) => p.id === partID);
          if (index !== -1) {
            parts.splice(index, 1);
          }
        })
      );
    },

    addSubAgent: (task) => {
      setStore(
        "subAgents",
        produce((agents) => {
          agents.push(task);
        })
      );
    },

    updateSubAgent: (id, update) => {
      setStore(
        "subAgents",
        produce((agents) => {
          const index = agents.findIndex((a) => a.id === id);
          if (index !== -1) {
            Object.assign(agents[index], update);
          }
        })
      );
    },

    clearSubAgents: () => {
      setStore("subAgents", []);
    },

    handleEvent: (event) => {
      switch (event.type) {
        case "message":
          // Convert MessageData to Message format
          const msg = event.data;
          value.addMessage({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            sessionID: store.session?.id ?? "",
            content: msg.content,
            time: { created: Date.now() },
          } as Message);
          break;

        case "messageUpdate":
          value.updateMessage(event.id, event.data as any);
          break;

        case "processing":
          value.setSessionStatus(
            event.value ? { type: "running" } : { type: "idle" }
          );
          break;

        case "sessionStatus":
          value.setSessionStatus(event.status);
          break;

        case "part":
          value.addPart(event.messageID, event.part);
          break;

        case "partUpdate":
          value.updatePart(event.messageID, event.partID, event.update);
          break;

        case "subAgent":
          value.addSubAgent(event.data);
          break;

        case "subAgentUpdate":
          value.updateSubAgent(event.id, event.data);
          break;

        case "clearSubAgents":
          value.clearSubAgents();
          break;
      }
    },

    reset: () => {
      setStore(reconcile({ ...initialStore }));
    },
  };

  return (
    <SyncContext.Provider value={value}>{props.children}</SyncContext.Provider>
  );
}

export function useSync(): SyncContextValue {
  const ctx = useContext(SyncContext);
  if (!ctx) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return ctx;
}

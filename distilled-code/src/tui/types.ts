/**
 * Shared types for the TUI layer - following OpenCode's patterns
 * for messages, parts, and session state management
 */

// =============================================================================
// Message Types
// =============================================================================

export type MessageRole = "user" | "assistant" | "system";

export interface MessageTime {
  created: number;
  completed?: number;
}

export interface UserMessage {
  id: string;
  role: "user";
  sessionID: string;
  parentID?: string;
  content: string;
  time: MessageTime;
}

export interface AssistantMessage {
  id: string;
  role: "assistant";
  sessionID: string;
  parentID: string; // ID of the user message this responds to
  modelID: string;
  agent?: string;
  time: MessageTime;
  finish?: "stop" | "tool-calls" | "error" | "interrupted" | "unknown";
  error?: {
    name: string;
    message: string;
    data?: Record<string, unknown>;
  };
  tokens?: {
    input: number;
    output: number;
    reasoning: number;
  };
  cost?: number;
}

export type Message = UserMessage | AssistantMessage;

// =============================================================================
// Part Types - Content within messages
// =============================================================================

export interface TextPart {
  id: string;
  type: "text";
  messageID: string;
  text: string;
  synthetic?: boolean; // System-generated text
}

export interface ReasoningPart {
  id: string;
  type: "reasoning";
  messageID: string;
  text: string;
}

export type ToolStatus = "pending" | "running" | "completed" | "error";

export interface ToolState {
  status: ToolStatus;
  input?: Record<string, unknown>;
  output?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface ToolPart {
  id: string;
  type: "tool";
  messageID: string;
  callID: string;
  tool: string;
  state: ToolState;
}

export type Part = TextPart | ReasoningPart | ToolPart;

// =============================================================================
// Session Types
// =============================================================================

export type SessionStatus = 
  | { type: "idle" }
  | { type: "running" }
  | { type: "retry"; message: string; attempt: number; next?: number };

export interface Session {
  id: string;
  title: string;
  parentID?: string; // For sub-agent sessions
  time: {
    created: number;
    updated: number;
  };
}

// =============================================================================
// Sub-Agent Types
// =============================================================================

export interface SubAgentTask {
  id: string;
  sessionID?: string; // Child session ID if created
  prompt: string;
  description: string;
  subagentType?: string;
  status: "pending" | "running" | "completed" | "error";
  result?: string;
  error?: string;
  summary?: Array<{
    tool: string;
    state: ToolState;
    title?: string;
  }>;
}

// =============================================================================
// Tool-specific Metadata Types
// =============================================================================

export interface BashMetadata {
  output?: string;
  exitCode?: number;
}

export interface EditMetadata {
  diff?: string;
  diagnostics?: Record<string, Array<{
    message: string;
    severity: number;
    range: {
      start: { line: number; character: number };
      end: { line: number; character: number };
    };
  }>>;
}

export interface WriteMetadata {
  diagnostics?: Record<string, Array<{
    message: string;
    severity: number;
    range: {
      start: { line: number; character: number };
      end: { line: number; character: number };
    };
  }>>;
}

export interface GlobMetadata {
  count?: number;
}

export interface GrepMetadata {
  matches?: number;
}

export interface ReadMetadata {
  lineCount?: number;
}

export interface SpawnMetadata {
  sessionID?: string;
  summary?: SubAgentTask["summary"];
}

// =============================================================================
// Legacy/Controller Types (for compatibility)
// =============================================================================

export interface ToolResult {
  name: string;
  status: "running" | "success" | "error";
  result?: string;
  diff?: {
    filePath: string;
    oldContent: string;
    newContent: string;
  };
}

export interface MessageData {
  id: string;
  role: MessageRole;
  content: string;
  toolResults?: ToolResult[];
  isStreaming?: boolean;
  parts?: Part[];
}

export interface TuiController {
  addMessage: (message: MessageData) => void;
  updateMessage: (id: string, update: Partial<MessageData>) => void;
  setProcessing: (processing: boolean) => void;
  addSubAgent: (task: SubAgentTask) => void;
  updateSubAgent: (id: string, update: Partial<SubAgentTask>) => void;
  clearSubAgents: () => void;
  // New part-based methods
  addPart: (messageID: string, part: Part) => void;
  updatePart: (messageID: string, partID: string, update: Partial<Part>) => void;
  setSessionStatus: (status: SessionStatus) => void;
}

export interface TuiCallbacks {
  onMessage: (message: string) => void;
  onInterrupt: () => void;
}

// =============================================================================
// Event Types for TUI updates
// =============================================================================

export type TuiEvent =
  | { type: "message"; data: MessageData }
  | { type: "messageUpdate"; id: string; data: Partial<MessageData> }
  | { type: "processing"; value: boolean }
  | { type: "sessionStatus"; status: SessionStatus }
  | { type: "part"; messageID: string; part: Part }
  | { type: "partUpdate"; messageID: string; partID: string; update: Partial<Part> }
  | { type: "subAgent"; data: SubAgentTask }
  | { type: "subAgentUpdate"; id: string; data: Partial<SubAgentTask> }
  | { type: "clearSubAgents" };

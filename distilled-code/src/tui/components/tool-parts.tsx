/**
 * Tool Rendering Components
 *
 * Reusable patterns for rendering tool calls and results in the TUI.
 * Based on OpenCode's InlineTool and BlockTool patterns.
 */

import { TextAttributes } from "@opentui/core";
import path from "node:path";
import { createMemo, createSignal, Show, type JSX } from "solid-js";
import { log } from "../../util/log.ts";
import { useTheme } from "../context/theme.tsx";

/**
 * Tool call part from @effect/ai
 */
export interface ToolCallPart {
  readonly type: "tool-call";
  readonly id: string;
  readonly name: string;
  readonly params: Record<string, unknown>;
}

/**
 * Tool result part from @effect/ai
 */
export interface ToolResultPart {
  readonly type: "tool-result";
  readonly id: string;
  readonly value: unknown;
}

/**
 * Accumulated tool state for rendering
 */
export interface ToolState {
  id: string;
  name: string;
  params: Record<string, unknown>;
  result?: unknown;
  error?: string;
  isComplete: boolean;
}

/**
 * Props for InlineTool component
 */
export interface InlineToolProps {
  /**
   * Tool label (e.g., "Read", "Glob", "Bash")
   */
  label: string;

  /**
   * Whether the tool has completed (truthy value shows children, falsy shows pending)
   */
  complete: unknown;

  /**
   * Content to display when complete
   */
  children: JSX.Element;

  /**
   * Optional error message
   */
  error?: string;
}

/**
 * InlineTool - Single line tool status indicator
 *
 * Shows "Label: ..." while pending, then "Label: {content}" when complete.
 * Used for quick operations like Read, Glob, Grep.
 *
 * @example
 * <InlineTool label="Read" complete={props.tool.isComplete}>
 *   {filePath}
 * </InlineTool>
 */
export function InlineTool(props: InlineToolProps) {
  const { theme } = useTheme();
  const hasError = createMemo(() => !!props.error);

  return (
    <text
      fg={hasError() ? theme.error : props.complete ? theme.textMuted : theme.text}
      attributes={hasError() ? TextAttributes.STRIKETHROUGH : undefined}
    >
      <Show fallback={<>{props.label}: ...</>} when={props.complete}>
        {props.label}: {props.children}
      </Show>
    </text>
  );
}

/**
 * Props for BlockTool component
 */
export interface BlockToolProps {
  /**
   * Title/header for the block
   */
  title: string;

  /**
   * Content to display inside the block
   */
  children: JSX.Element;

  /**
   * Optional click handler
   */
  onClick?: () => void;

  /**
   * Optional error message
   */
  error?: string;
}

/**
 * BlockTool - Multi-line tool panel with border
 *
 * Shows a titled block with content. Used for operations with output
 * like Bash commands or file writes.
 *
 * @example
 * <BlockTool title="# Running command">
 *   <text>$ npm install</text>
 *   <text>added 100 packages</text>
 * </BlockTool>
 */
export function BlockTool(props: BlockToolProps) {
  const { theme } = useTheme();
  const [hover, setHover] = createSignal(false);

  return (
    <box
      border={["left"]}
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={2}
      marginTop={1}
      gap={1}
      backgroundColor={hover() ? theme.backgroundMenu : theme.backgroundPanel}
      borderColor={theme.background}
      onMouseOver={() => props.onClick && setHover(true)}
      onMouseOut={() => setHover(false)}
      onMouseUp={() => props.onClick?.()}
    >
      <text paddingLeft={3} fg={theme.textMuted}>
        {props.title}
      </text>
      {props.children}
      <Show when={props.error}>
        <text fg={theme.error}>{props.error}</text>
      </Show>
    </box>
  );
}

// ============================================================================
// Tool-Specific Components
// ============================================================================

/**
 * Bash/Shell tool renderer - shows command
 */
export function BashTool(props: { tool: ToolState }) {
  const command = createMemo(() => (props.tool?.params?.command as string) ?? "");

  return (
    <InlineTool label="Bash" complete={props.tool.isComplete} error={props.tool.error}>
      {command()}
    </InlineTool>
  );
}

/**
 * Read tool renderer - shows file path being read
 */
export function ReadTool(props: { tool: ToolState }) {
  const filePath = createMemo(() => normalizePath((props.tool.params.filePath as string) ?? (props.tool.params.path as string) ?? ""));

  return (
    <InlineTool label="Read" complete={props.tool.isComplete} error={props.tool.error}>
      {filePath()}
    </InlineTool>
  );
}

/**
 * Write tool renderer - shows file being written
 */
export function WriteTool(props: { tool: ToolState }) {
  const filePath = createMemo(() => normalizePath((props.tool.params.filePath as string) ?? (props.tool.params.path as string) ?? ""));

  return (
    <InlineTool label="Write" complete={props.tool.isComplete} error={props.tool.error}>
      {filePath()}
    </InlineTool>
  );
}

/**
 * Glob tool renderer - shows pattern and match count
 */
export function GlobTool(props: { tool: ToolState }) {
  const pattern = createMemo(() => (props.tool.params.pattern as string) ?? (props.tool.params.glob_pattern as string) ?? "");

  return (
    <InlineTool label="Glob" complete={props.tool.isComplete} error={props.tool.error}>
      {pattern()}
    </InlineTool>
  );
}

/**
 * Grep tool renderer - shows search pattern and results
 */
export function GrepTool(props: { tool: ToolState }) {
  const pattern = createMemo(() => (props.tool.params.pattern as string) ?? "");

  return (
    <InlineTool label="Grep" complete={props.tool.isComplete} error={props.tool.error}>
      {pattern()}
    </InlineTool>
  );
}

/**
 * List/LS tool renderer - shows directory being listed
 */
export function ListTool(props: { tool: ToolState }) {
  const dir = createMemo(() => normalizePath((props.tool.params.path as string) ?? (props.tool.params.target_directory as string) ?? "."));

  return (
    <InlineTool label="List" complete={props.tool.isComplete} error={props.tool.error}>
      {dir()}
    </InlineTool>
  );
}

/**
 * Edit/StrReplace tool renderer - shows file being edited
 */
export function EditTool(props: { tool: ToolState }) {
  const filePath = createMemo(() => normalizePath((props.tool.params.filePath as string) ?? (props.tool.params.path as string) ?? ""));

  return (
    <InlineTool label="Edit" complete={props.tool.isComplete} error={props.tool.error}>
      {filePath()}
    </InlineTool>
  );
}

/**
 * WebFetch tool renderer - shows URL being fetched
 */
export function WebFetchTool(props: { tool: ToolState }) {
  const url = createMemo(() => (props.tool.params.url as string) ?? "");

  return (
    <InlineTool label="WebFetch" complete={props.tool.isComplete} error={props.tool.error}>
      {url()}
    </InlineTool>
  );
}

/**
 * WebSearch tool renderer
 */
export function WebSearchTool(props: { tool: ToolState }) {
  const query = createMemo(() => (props.tool.params.search_term as string) ?? (props.tool.params.query as string) ?? "");

  return (
    <InlineTool label="WebSearch" complete={props.tool.isComplete} error={props.tool.error}>
      {query()}
    </InlineTool>
  );
}

/**
 * SemanticSearch tool renderer
 */
export function SemanticSearchTool(props: { tool: ToolState }) {
  const query = createMemo(() => (props.tool.params.query as string) ?? "");

  return (
    <InlineTool label="Search" complete={props.tool.isComplete} error={props.tool.error}>
      {query()}
    </InlineTool>
  );
}

/**
 * Task/Subagent tool renderer
 */
export function TaskTool(props: { tool: ToolState }) {
  const description = createMemo(() => (props.tool.params.description as string) ?? "");

  return (
    <InlineTool label="Task" complete={props.tool.isComplete} error={props.tool.error}>
      {description()}
    </InlineTool>
  );
}

/**
 * TodoWrite tool renderer
 */
export function TodoWriteTool(props: { tool: ToolState }) {
  const todos = createMemo(() => (props.tool.params.todos as Array<{ id: string; content: string; status: string }>) ?? []);
  const count = createMemo(() => todos().length);

  return (
    <InlineTool label="TodoWrite" complete={props.tool.isComplete} error={props.tool.error}>
      {count()} todo{count() !== 1 ? "s" : ""}
    </InlineTool>
  );
}

/**
 * AskQuestion tool renderer
 */
export function AskQuestionTool(props: { tool: ToolState }) {
  const questions = createMemo(() => (props.tool.params.questions as Array<{ prompt: string }>) ?? []);
  const count = createMemo(() => questions().length);

  return (
    <InlineTool label="AskQuestion" complete={props.tool.isComplete} error={props.tool.error}>
      {count()} question{count() !== 1 ? "s" : ""}
    </InlineTool>
  );
}

/**
 * Delete tool renderer
 */
export function DeleteTool(props: { tool: ToolState }) {
  const filePath = createMemo(() => normalizePath((props.tool.params.path as string) ?? ""));

  return (
    <InlineTool label="Delete" complete={props.tool.isComplete} error={props.tool.error}>
      {filePath()}
    </InlineTool>
  );
}

/**
 * Generic/Unknown tool renderer
 */
export function GenericTool(props: { tool: ToolState }) {
  const paramsPreview = createMemo(() => {
    try {
      const entries = Object.entries(props.tool.params).filter(
        ([, value]) => typeof value === "string" || typeof value === "number" || typeof value === "boolean"
      );
      if (entries.length === 0) return "";
      const str = entries.map(([, v]) => String(v)).join(", ");
      return str.length > 50 ? str.slice(0, 50) + "..." : str;
    } catch {
      return "";
    }
  });

  return (
    <InlineTool label={props.tool.name} complete={props.tool.isComplete} error={props.tool.error}>
      {paramsPreview()}
    </InlineTool>
  );
}

// ============================================================================
// Tool Dispatcher Component
// ============================================================================

/**
 * Map of tool names to their rendering components
 */
const TOOL_COMPONENTS: Record<string, (props: { tool: ToolState }) => JSX.Element> = {
  // Shell/Command tools
  Shell: BashTool,
  Bash: BashTool,
  bash: BashTool,
  AnthropicBash: BashTool,

  // Agent communication tools
  send: GenericTool,
  query: GenericTool,

  // File read tools
  Read: ReadTool,
  read: ReadTool,

  // File write tools
  Write: WriteTool,
  write: WriteTool,

  // File edit tools
  Edit: EditTool,
  edit: EditTool,
  StrReplace: EditTool,

  // File search tools
  Glob: GlobTool,
  glob: GlobTool,
  Grep: GrepTool,
  grep: GrepTool,

  // Directory tools
  List: ListTool,
  list: ListTool,
  LS: ListTool,
  ls: ListTool,

  // Delete tools
  Delete: DeleteTool,
  delete: DeleteTool,

  // Web tools
  WebFetch: WebFetchTool,
  webfetch: WebFetchTool,
  WebSearch: WebSearchTool,
  websearch: WebSearchTool,

  // Search tools
  SemanticSearch: SemanticSearchTool,
  semanticsearch: SemanticSearchTool,

  // Task/Agent tools
  Task: TaskTool,
  task: TaskTool,

  // Todo tools
  TodoWrite: TodoWriteTool,
  todowrite: TodoWriteTool,

  // Question tools
  AskQuestion: AskQuestionTool,
  askquestion: AskQuestionTool,
};

/**
 * ToolPart - Main dispatcher component for rendering tools
 *
 * Automatically selects the appropriate tool renderer based on tool name.
 */
export function ToolPart(props: { tool: ToolState }) {
  log("ToolPart", "received props", { tool: props.tool, hasProps: !!props });

  // Get the component directly (not via memo to avoid dynamic component issues)
  const getComponent = () => {
    const name = props.tool?.name ?? "unknown";
    log("ToolPart", "selecting component", { name, hasComponent: !!TOOL_COMPONENTS[name] });
    return TOOL_COMPONENTS[name] ?? TOOL_COMPONENTS[name.toLowerCase()] ?? GenericTool;
  };

  // Use Show to ensure props.tool is available before rendering
  return (
    <Show
      when={props.tool}
      fallback={
        <box>
          <text fg="#fa8383">Error: Tool state is undefined</text>
        </box>
      }
      keyed
    >
      {(tool) => {
        const Comp = getComponent();
        return <Comp tool={tool} />;
      }}
    </Show>
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

function normalizePath(input?: string): string {
  if (!input) return "";
  if (path.isAbsolute(input)) {
    try {
      return path.relative(process.cwd(), input) || ".";
    } catch {
      return input;
    }
  }
  return input;
}


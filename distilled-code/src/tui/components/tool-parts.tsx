/**
 * Tool Rendering Components
 *
 * Reusable patterns for rendering tool calls and results in the TUI.
 * Based on OpenCode's InlineTool and BlockTool patterns.
 */

import type { RGBA } from "@opentui/core";
import { TextAttributes } from "@opentui/core";
import path from "node:path";
import { createMemo, createSignal, For, Match, Show, Switch, type JSX } from "solid-js";
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
   * Icon to display (e.g., "→", "$", "✱", "⚙")
   */
  icon: string;

  /**
   * Optional icon color (defaults to theme accent)
   */
  iconColor?: RGBA;

  /**
   * Text to show while pending
   */
  pending: string;

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
 * Shows a pending message while waiting, then icon + children when complete.
 * Used for quick operations like Read, Glob, Grep.
 *
 * @example
 * <InlineTool icon="→" pending="Reading file..." complete={filePath}>
 *   Read {filePath}
 * </InlineTool>
 */
export function InlineTool(props: InlineToolProps) {
  const { theme } = useTheme();

  const fg = createMemo(() => (props.complete ? theme.textMuted : theme.text));
  const hasError = createMemo(() => !!props.error);

  return (
    <box paddingLeft={3} marginTop={1}>
      <text
        fg={hasError() ? theme.error : fg()}
        attributes={hasError() ? TextAttributes.STRIKETHROUGH : undefined}
      >
        <Show fallback={<>~ {props.pending}</>} when={props.complete}>
          <span style={{ fg: props.iconColor ?? theme.accent, bold: true }}>{props.icon}</span>{" "}
          {props.children}
        </Show>
      </text>
      <Show when={props.error && !props.error.includes("rejected permission")}>
        <text fg={theme.error}> {props.error}</text>
      </Show>
    </box>
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
 * Bash/Shell tool renderer - shows command and output
 */
export function BashTool(props: { tool: ToolState }) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = createSignal(false);
  log("BashTool", "props", props);

  // Guard against undefined tool
  if (!props.tool) {
    return (
      <box>
        <text fg="#fa8383">Error: BashTool received undefined tool</text>
      </box>
    );
  }

  const command = createMemo(() => (props.tool?.params?.command as string) ?? "");
  const description = createMemo(() => (props.tool?.params?.description as string) ?? "Shell");
  const workdir = createMemo(() => props.tool?.params?.workdir as string | undefined);

  const output = createMemo(() => {
    if (!props.tool?.result) return undefined;
    if (typeof props.tool.result === "string") return props.tool.result.trim();
    if (typeof props.tool.result === "object" && props.tool.result !== null) {
      const r = props.tool.result as Record<string, unknown>;
      return (r.output as string)?.trim() ?? (r.stdout as string)?.trim() ?? JSON.stringify(r);
    }
    return String(props.tool.result);
  });

  const lines = createMemo(() => output()?.split("\n") ?? []);
  const overflow = createMemo(() => lines().length > 10);
  const limited = createMemo(() => {
    if (expanded() || !overflow()) return output();
    return [...lines().slice(0, 10), "…"].join("\n");
  });

  const title = createMemo(() => {
    const wd = workdir();
    if (!wd || wd === ".") return `# ${description()}`;
    return `# ${description()} in ${wd}`;
  });

  return (
    <Switch>
      <Match when={props.tool.isComplete && output() !== undefined}>
        <BlockTool
          title={title()}
          error={props.tool.error}
          onClick={overflow() ? () => setExpanded((prev) => !prev) : undefined}
        >
          <box gap={1}>
            <text fg={theme.text}>$ {command()}</text>
            <Show when={limited()}>
              <text fg={theme.text}>{limited()}</text>
            </Show>
            <Show when={overflow()}>
              <text fg={theme.textMuted}>{expanded() ? "Click to collapse" : "Click to expand"}</text>
            </Show>
          </box>
        </BlockTool>
      </Match>
      <Match when={true}>
        <InlineTool icon="$" pending="Running command..." complete={command()} error={props.tool.error}>
          {command()}
        </InlineTool>
      </Match>
    </Switch>
  );
}

/**
 * Read tool renderer - shows file path being read
 */
export function ReadTool(props: { tool: ToolState }) {
  const filePath = createMemo(() => normalizePath((props.tool.params.filePath as string) ?? (props.tool.params.path as string) ?? ""));
  const offset = createMemo(() => props.tool.params.offset as number | undefined);
  const limit = createMemo(() => props.tool.params.limit as number | undefined);

  const extras = createMemo(() => {
    const parts: string[] = [];
    if (offset() !== undefined) parts.push(`offset=${offset()}`);
    if (limit() !== undefined) parts.push(`limit=${limit()}`);
    return parts.length > 0 ? ` [${parts.join(", ")}]` : "";
  });

  return (
    <InlineTool icon="→" pending="Reading file..." complete={props.tool.isComplete} error={props.tool.error}>
      Read {filePath()}
      {extras()}
    </InlineTool>
  );
}

/**
 * Write tool renderer - shows file being written
 */
export function WriteTool(props: { tool: ToolState }) {
  const { theme, syntax } = useTheme();

  const filePath = createMemo(() => normalizePath((props.tool.params.filePath as string) ?? (props.tool.params.path as string) ?? ""));
  const content = createMemo(() => (props.tool.params.content as string) ?? (props.tool.params.contents as string));

  const filetype = createMemo(() => getFiletype(filePath()));

  return (
    <Switch>
      <Match when={props.tool.isComplete && content() !== undefined}>
        <BlockTool title={`# Wrote ${filePath()}`} error={props.tool.error}>
          <line_number fg={theme.textMuted} minWidth={3} paddingRight={1}>
            <code
              conceal={false}
              fg={theme.text}
              filetype={filetype()}
              syntaxStyle={syntax()}
              content={content() ?? ""}
            />
          </line_number>
        </BlockTool>
      </Match>
      <Match when={true}>
        <InlineTool icon="←" pending="Preparing write..." complete={filePath()} error={props.tool.error}>
          Write {filePath()}
        </InlineTool>
      </Match>
    </Switch>
  );
}

/**
 * Glob tool renderer - shows pattern and match count
 */
export function GlobTool(props: { tool: ToolState }) {
  const pattern = createMemo(() => (props.tool.params.pattern as string) ?? (props.tool.params.glob_pattern as string) ?? "");
  const searchPath = createMemo(() => normalizePath((props.tool.params.path as string) ?? (props.tool.params.target_directory as string) ?? ""));

  const matchCount = createMemo(() => {
    if (!props.tool.result) return undefined;
    if (Array.isArray(props.tool.result)) return props.tool.result.length;
    if (typeof props.tool.result === "object" && props.tool.result !== null) {
      const r = props.tool.result as Record<string, unknown>;
      if (Array.isArray(r.files)) return r.files.length;
      if (Array.isArray(r.matches)) return r.matches.length;
    }
    return undefined;
  });

  return (
    <InlineTool icon="✱" pending="Finding files..." complete={props.tool.isComplete} error={props.tool.error}>
      Glob "{pattern()}"
      <Show when={searchPath()}> in {searchPath()}</Show>
      <Show when={matchCount() !== undefined}> ({matchCount()} matches)</Show>
    </InlineTool>
  );
}

/**
 * Grep tool renderer - shows search pattern and results
 */
export function GrepTool(props: { tool: ToolState }) {
  const pattern = createMemo(() => (props.tool.params.pattern as string) ?? "");
  const searchPath = createMemo(() => normalizePath((props.tool.params.path as string) ?? ""));

  const matchCount = createMemo(() => {
    if (!props.tool.result) return undefined;
    if (typeof props.tool.result === "object" && props.tool.result !== null) {
      const r = props.tool.result as Record<string, unknown>;
      if (typeof r.matches === "number") return r.matches;
      if (typeof r.count === "number") return r.count;
      if (Array.isArray(r.results)) return r.results.length;
    }
    return undefined;
  });

  return (
    <InlineTool icon="✱" pending="Searching content..." complete={props.tool.isComplete} error={props.tool.error}>
      Grep "{pattern()}"
      <Show when={searchPath()}> in {searchPath()}</Show>
      <Show when={matchCount() !== undefined}> ({matchCount()} matches)</Show>
    </InlineTool>
  );
}

/**
 * List/LS tool renderer - shows directory being listed
 */
export function ListTool(props: { tool: ToolState }) {
  const dir = createMemo(() => normalizePath((props.tool.params.path as string) ?? (props.tool.params.target_directory as string) ?? "."));

  return (
    <InlineTool icon="→" pending="Listing directory..." complete={props.tool.isComplete} error={props.tool.error}>
      List {dir()}
    </InlineTool>
  );
}

/**
 * Edit/StrReplace tool renderer - shows file being edited
 */
export function EditTool(props: { tool: ToolState }) {
  const { theme } = useTheme();

  const filePath = createMemo(() => normalizePath((props.tool.params.filePath as string) ?? (props.tool.params.path as string) ?? ""));
  const oldString = createMemo(() => (props.tool.params.old_string as string) ?? (props.tool.params.oldString as string));
  const newString = createMemo(() => (props.tool.params.new_string as string) ?? (props.tool.params.newString as string));
  const replaceAll = createMemo(() => props.tool.params.replace_all ?? props.tool.params.replaceAll);

  const truncate = (str: string | undefined, maxLen = 100) => {
    if (!str) return "";
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen) + "...";
  };

  return (
    <Switch>
      <Match when={props.tool.isComplete && oldString() !== undefined && newString() !== undefined}>
        <BlockTool title={`← Edit ${filePath()}`} error={props.tool.error}>
          <box gap={1}>
            <text fg={theme.diffRemoved}>- {truncate(oldString())}</text>
            <text fg={theme.diffAdded}>+ {truncate(newString())}</text>
          </box>
        </BlockTool>
      </Match>
      <Match when={true}>
        <InlineTool icon="✎" pending="Preparing edit..." complete={filePath()} error={props.tool.error}>
          Edit {filePath()}
          <Show when={replaceAll()}> [replaceAll]</Show>
        </InlineTool>
      </Match>
    </Switch>
  );
}

/**
 * WebFetch tool renderer - shows URL being fetched
 */
export function WebFetchTool(props: { tool: ToolState }) {
  const url = createMemo(() => (props.tool.params.url as string) ?? "");

  return (
    <InlineTool icon="%" pending="Fetching from the web..." complete={props.tool.isComplete} error={props.tool.error}>
      WebFetch {url()}
    </InlineTool>
  );
}

/**
 * WebSearch tool renderer
 */
export function WebSearchTool(props: { tool: ToolState }) {
  const query = createMemo(() => (props.tool.params.search_term as string) ?? (props.tool.params.query as string) ?? "");

  const resultCount = createMemo(() => {
    if (!props.tool.result) return undefined;
    if (typeof props.tool.result === "object" && props.tool.result !== null) {
      const r = props.tool.result as Record<string, unknown>;
      if (Array.isArray(r.results)) return r.results.length;
    }
    return undefined;
  });

  return (
    <InlineTool icon="◈" pending="Searching web..." complete={props.tool.isComplete} error={props.tool.error}>
      WebSearch "{query()}"
      <Show when={resultCount() !== undefined}> ({resultCount()} results)</Show>
    </InlineTool>
  );
}

/**
 * SemanticSearch tool renderer
 */
export function SemanticSearchTool(props: { tool: ToolState }) {
  const query = createMemo(() => (props.tool.params.query as string) ?? "");
  const targetDirs = createMemo(() => {
    const dirs = props.tool.params.target_directories as string[] | undefined;
    if (!dirs || dirs.length === 0) return "";
    return ` in ${dirs.join(", ")}`;
  });

  return (
    <InlineTool icon="◇" pending="Searching semantically..." complete={props.tool.isComplete} error={props.tool.error}>
      SemanticSearch "{query()}"{targetDirs()}
    </InlineTool>
  );
}

/**
 * Task/Subagent tool renderer
 */
export function TaskTool(props: { tool: ToolState }) {
  const { theme } = useTheme();

  const description = createMemo(() => (props.tool.params.description as string) ?? "");
  const subagentType = createMemo(() => (props.tool.params.subagent_type as string) ?? "unknown");
  const label = createMemo(() => titlecase(subagentType()));

  return (
    <Switch>
      <Match when={props.tool.isComplete}>
        <BlockTool title={`# ${label()} Task`} error={props.tool.error}>
          <text fg={theme.textMuted}>{description()}</text>
        </BlockTool>
      </Match>
      <Match when={true}>
        <InlineTool
          icon="◉"
          iconColor={theme.secondary}
          pending="Delegating..."
          complete={description()}
          error={props.tool.error}
        >
          <span style={{ fg: theme.text }}>{label()}</span> Task "{description()}"
        </InlineTool>
      </Match>
    </Switch>
  );
}

/**
 * TodoWrite tool renderer
 */
export function TodoWriteTool(props: { tool: ToolState }) {
  const { theme } = useTheme();

  const todos = createMemo(() => (props.tool.params.todos as Array<{ id: string; content: string; status: string }>) ?? []);

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓";
      case "in_progress":
        return "●";
      case "cancelled":
        return "✗";
      default:
        return "○";
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
        return theme.success;
      case "in_progress":
        return theme.warning;
      case "cancelled":
        return theme.error;
      default:
        return theme.textMuted;
    }
  };

  return (
    <Switch>
      <Match when={props.tool.isComplete && todos().length > 0}>
        <BlockTool title="# Todos" error={props.tool.error}>
          <box>
            <For each={todos()}>
              {(todo) => (
                <text fg={theme.text}>
                  <span style={{ fg: statusColor(todo.status) }}>{statusIcon(todo.status)}</span> {todo.content}
                </text>
              )}
            </For>
          </box>
        </BlockTool>
      </Match>
      <Match when={true}>
        <InlineTool icon="☐" pending="Updating todos..." complete={false} error={props.tool.error}>
          Updating todos...
        </InlineTool>
      </Match>
    </Switch>
  );
}

/**
 * AskQuestion tool renderer
 */
export function AskQuestionTool(props: { tool: ToolState }) {
  const { theme } = useTheme();

  const questions = createMemo(() => (props.tool.params.questions as Array<{ prompt: string }>) ?? []);
  const count = createMemo(() => questions().length);

  return (
    <Switch>
      <Match when={props.tool.isComplete}>
        <BlockTool title="# Questions" error={props.tool.error}>
          <box gap={1}>
            <For each={questions()}>
              {(q) => <text fg={theme.textMuted}>{q.prompt}</text>}
            </For>
          </box>
        </BlockTool>
      </Match>
      <Match when={true}>
        <InlineTool icon="?" pending="Asking questions..." complete={count()} error={props.tool.error}>
          Asked {count()} question{count() !== 1 ? "s" : ""}
        </InlineTool>
      </Match>
    </Switch>
  );
}

/**
 * Delete tool renderer
 */
export function DeleteTool(props: { tool: ToolState }) {
  const filePath = createMemo(() => normalizePath((props.tool.params.path as string) ?? ""));

  return (
    <InlineTool icon="✗" pending="Deleting file..." complete={props.tool.isComplete} error={props.tool.error}>
      Delete {filePath()}
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
      const str = entries.map(([k, v]) => `${k}=${v}`).join(", ");
      return str.length > 60 ? `[${str.slice(0, 60)}...]` : `[${str}]`;
    } catch {
      return "";
    }
  });

  return (
    <InlineTool icon="⚙" pending="Running tool..." complete={props.tool.isComplete} error={props.tool.error}>
      {props.tool.name} {paramsPreview()}
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

  // Guard against undefined tool
  if (!props.tool) {
    log("ToolPart", "ERROR: tool is undefined", { props });
    return (
      <box>
        <text fg="#fa8383">Error: Tool state is undefined</text>
      </box>
    );
  }

  const Component = createMemo(() => {
    const name = props.tool?.name ?? "unknown";
    log("ToolPart", "selecting component", { name, hasComponent: !!TOOL_COMPONENTS[name] });
    return TOOL_COMPONENTS[name] ?? TOOL_COMPONENTS[name.toLowerCase()] ?? GenericTool;
  });

  return <Component tool={props.tool} />;
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

function titlecase(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getFiletype(filepath: string): string {
  const ext = path.extname(filepath).toLowerCase();
  const typeMap: Record<string, string> = {
    ".ts": "typescript",
    ".tsx": "typescript",
    ".js": "javascript",
    ".jsx": "javascript",
    ".json": "json",
    ".md": "markdown",
    ".py": "python",
    ".rs": "rust",
    ".go": "go",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".css": "css",
    ".html": "html",
    ".sh": "bash",
    ".bash": "bash",
    ".zsh": "bash",
  };
  return typeMap[ext] ?? "text";
}

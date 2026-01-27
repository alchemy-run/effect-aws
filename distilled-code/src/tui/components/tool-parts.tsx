/**
 * Tool Rendering Components
 *
 * Reusable patterns for rendering tool calls and results in the TUI.
 * Based on OpenCode's InlineTool and BlockTool patterns.
 */

import { createMemo, Show, type JSX } from "solid-js";
import type { RGBA } from "@opentui/core";
import { useTheme } from "../context/theme.tsx";

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

  return (
    <box paddingLeft={3} marginTop={1}>
      <text fg={fg()}>
        <Show fallback={<>~ {props.pending}</>} when={props.complete}>
          <span style={{ fg: props.iconColor ?? theme.accent, bold: true }}>{props.icon}</span>{" "}
          {props.children}
        </Show>
      </text>
      <Show when={props.error}>
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

  return (
    <box
      border={["left"]}
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={2}
      marginTop={1}
      gap={1}
      backgroundColor={theme.backgroundPanel}
      borderColor={theme.background}
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

/**
 * Bash tool renderer - shows command and output
 */
export function BashTool(props: { command?: string; output?: string; description?: string }) {
  const { theme } = useTheme();

  const title = () => `# ${props.description ?? "Shell"}`;

  return (
    <Show
      when={props.output !== undefined}
      fallback={
        <InlineTool icon="$" pending="Writing command..." complete={props.command}>
          {props.command}
        </InlineTool>
      }
    >
      <BlockTool title={title()}>
        <box gap={1}>
          <text fg={theme.text}>$ {props.command}</text>
          <Show when={props.output}>
            <text fg={theme.text}>{props.output}</text>
          </Show>
        </box>
      </BlockTool>
    </Show>
  );
}

/**
 * Read tool renderer - shows file path being read
 */
export function ReadTool(props: { filePath?: string; offset?: number; limit?: number }) {
  const extras = () => {
    const parts: string[] = [];
    if (props.offset !== undefined) parts.push(`offset=${props.offset}`);
    if (props.limit !== undefined) parts.push(`limit=${props.limit}`);
    return parts.length > 0 ? ` (${parts.join(", ")})` : "";
  };

  return (
    <InlineTool icon="→" pending="Reading file..." complete={props.filePath}>
      Read {props.filePath}
      {extras()}
    </InlineTool>
  );
}

/**
 * Write tool renderer - shows file being written
 */
export function WriteTool(props: { filePath?: string; content?: string }) {
  const { theme, syntax } = useTheme();

  // Detect file type from extension
  const filetype = () => {
    const path = props.filePath ?? "";
    const ext = path.split(".").pop()?.toLowerCase() ?? "";
    const typeMap: Record<string, string> = {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      json: "json",
      md: "markdown",
      py: "python",
      rs: "rust",
      go: "go",
    };
    return typeMap[ext] ?? "text";
  };

  return (
    <Show
      when={props.content !== undefined}
      fallback={
        <InlineTool icon="←" pending="Preparing write..." complete={props.filePath}>
          Write {props.filePath}
        </InlineTool>
      }
    >
      <BlockTool title={`# Wrote ${props.filePath}`}>
        <code
          conceal={false}
          drawUnstyledText={false}
          fg={theme.text}
          filetype={filetype()}
          syntaxStyle={syntax()}
          content={props.content ?? ""}
        />
      </BlockTool>
    </Show>
  );
}

/**
 * Glob tool renderer - shows pattern and match count
 */
export function GlobTool(props: { pattern?: string; path?: string; count?: number }) {
  return (
    <InlineTool icon="✱" pending="Finding files..." complete={props.pattern}>
      Glob "{props.pattern}"
      <Show when={props.path}> in {props.path}</Show>
      <Show when={props.count !== undefined}> ({props.count} matches)</Show>
    </InlineTool>
  );
}

/**
 * Grep tool renderer - shows search pattern and results
 */
export function GrepTool(props: { pattern?: string; path?: string; matches?: number }) {
  return (
    <InlineTool icon="✱" pending="Searching content..." complete={props.pattern}>
      Grep "{props.pattern}"
      <Show when={props.path}> in {props.path}</Show>
      <Show when={props.matches !== undefined}> ({props.matches} matches)</Show>
    </InlineTool>
  );
}

/**
 * List/LS tool renderer - shows directory being listed
 */
export function ListTool(props: { path?: string }) {
  return (
    <InlineTool icon="→" pending="Listing directory..." complete={props.path !== undefined}>
      List {props.path ?? "."}
    </InlineTool>
  );
}

/**
 * Edit tool renderer - shows file being edited
 */
export function EditTool(props: { filePath?: string; oldString?: string; newString?: string }) {
  const { theme } = useTheme();

  return (
    <Show
      when={props.oldString !== undefined && props.newString !== undefined}
      fallback={
        <InlineTool icon="✎" pending="Preparing edit..." complete={props.filePath}>
          Edit {props.filePath}
        </InlineTool>
      }
    >
      <BlockTool title={`# Edited ${props.filePath}`}>
        <box gap={1}>
          <text fg={theme.diffRemoved}>- {props.oldString?.slice(0, 50)}...</text>
          <text fg={theme.diffAdded}>+ {props.newString?.slice(0, 50)}...</text>
        </box>
      </BlockTool>
    </Show>
  );
}

/**
 * WebFetch tool renderer - shows URL being fetched
 */
export function WebFetchTool(props: { url?: string }) {
  return (
    <InlineTool icon="%" pending="Fetching from the web..." complete={props.url}>
      WebFetch {props.url}
    </InlineTool>
  );
}

/**
 * Task/Subagent tool renderer
 */
export function TaskTool(props: { description?: string; subagentType?: string }) {
  const { theme } = useTheme();
  const label = () => (props.subagentType ?? "unknown").charAt(0).toUpperCase() + (props.subagentType ?? "unknown").slice(1);

  return (
    <InlineTool
      icon="◆"
      iconColor={theme.secondary}
      pending="Spawning task..."
      complete={props.description}
    >
      {label()} Task: {props.description}
    </InlineTool>
  );
}

/**
 * Generic/Unknown tool renderer
 */
export function GenericTool(props: { name: string; params?: unknown }) {
  const paramsPreview = () => {
    try {
      const str = JSON.stringify(props.params ?? {});
      return str.length > 50 ? str.slice(0, 50) + "..." : str;
    } catch {
      return "{}";
    }
  };

  return (
    <InlineTool icon="⚙" pending="Running tool..." complete={props.name}>
      {props.name} {paramsPreview()}
    </InlineTool>
  );
}

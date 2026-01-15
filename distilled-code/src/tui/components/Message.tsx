/**
 * Message components - User and Assistant message display
 * Following OpenCode's part-based rendering pattern
 */
import { Show, For, Switch, Match, createMemo, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useTheme } from "../context/theme.tsx";
import { SplitBorder } from "./Border.tsx";
import { Spinner } from "./Spinner.tsx";
import {
  BashTool,
  ReadTool,
  EditTool,
  GlobTool,
  GrepTool,
  WriteTool,
  SpawnTool,
  InlineTool,
} from "./tools/index.ts";
import type {
  MessageData,
  Part,
  TextPart,
  ReasoningPart,
  ToolPart as ToolPartType,
  UserMessage as UserMessageType,
  AssistantMessage as AssistantMessageType,
} from "../types.ts";

// =============================================================================
// Props Types
// =============================================================================

export interface MessageProps {
  message: MessageData;
  parts?: Part[];
  showTimestamps?: boolean;
  onNavigateSubAgent?: (sessionID: string) => void;
}

export interface UserMessageProps {
  message: UserMessageType;
  parts?: Part[];
  index?: number;
  showTimestamps?: boolean;
}

export interface AssistantMessageProps {
  message: AssistantMessageType;
  parts?: Part[];
  isLast?: boolean;
  onNavigateSubAgent?: (sessionID: string) => void;
}

// =============================================================================
// Legacy Message Component (for compatibility)
// =============================================================================

export function Message(props: MessageProps) {
  const { theme } = useTheme();

  const roleColor = () => {
    switch (props.message.role) {
      case "user":
        return theme.primary;
      case "assistant":
        return theme.secondary;
      default:
        return theme.textMuted;
    }
  };

  const roleLabel = () => {
    switch (props.message.role) {
      case "user":
        return "You";
      case "assistant":
        return "Agent";
      default:
        return "System";
    }
  };

  // Check if we have text parts to render
  const hasTextParts = () => props.parts?.some((p) => p.type === "text");

  return (
    <box flexDirection="column" marginBottom={1}>
      <box
        border={["left"]}
        borderColor={roleColor()}
        customBorderChars={SplitBorder.customBorderChars}
      >
        <box
          paddingTop={1}
          paddingBottom={1}
          paddingLeft={2}
          backgroundColor={theme.backgroundPanel}
        >
          <text bold color={roleColor()}>
            {roleLabel()}
          </text>
          {/* Only show content if there are no text parts (to avoid duplication) */}
          <Show when={props.message.content && !hasTextParts()}>
            <text color={theme.text} wrapMode="word">
              {props.message.content}
            </text>
          </Show>
          <Show when={props.message.isStreaming && !props.message.content && !hasTextParts()}>
            <Spinner label="Thinking..." />
          </Show>
        </box>
      </box>
      
      {/* Render parts if available */}
      <Show when={props.parts}>
        <For each={props.parts}>
          {(part, index) => (
            <PartRenderer
              part={part}
              isLast={index() === (props.parts?.length ?? 0) - 1}
              onNavigateSubAgent={props.onNavigateSubAgent}
            />
          )}
        </For>
      </Show>
    </box>
  );
}

// =============================================================================
// User Message Component
// =============================================================================

export function UserMessage(props: UserMessageProps) {
  const { theme } = useTheme();
  const [hover, setHover] = createSignal(false);

  const textPart = createMemo(() =>
    props.parts?.find((p) => p.type === "text" && !(p as TextPart).synthetic) as
      | TextPart
      | undefined
  );

  return (
    <Show when={textPart()}>
      <box
        id={props.message.id}
        border={["left"]}
        borderColor={theme.primary}
        customBorderChars={SplitBorder.customBorderChars}
        marginTop={props.index === 0 ? 0 : 1}
      >
        <box
          onMouseOver={() => setHover(true)}
          onMouseOut={() => setHover(false)}
          paddingTop={1}
          paddingBottom={1}
          paddingLeft={2}
          backgroundColor={hover() ? theme.backgroundElement : theme.backgroundPanel}
          flexShrink={0}
        >
          <text color={theme.text}>{textPart()?.text}</text>
          <Show when={props.showTimestamps}>
            <text color={theme.textMuted}>
              {new Date(props.message.time.created).toLocaleTimeString()}
            </text>
          </Show>
        </box>
      </box>
    </Show>
  );
}

// =============================================================================
// Assistant Message Component
// =============================================================================

export function AssistantMessage(props: AssistantMessageProps) {
  const { theme } = useTheme();

  const duration = createMemo(() => {
    if (!props.message.time.completed) return 0;
    return props.message.time.completed - props.message.time.created;
  });

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <>
      <For each={props.parts}>
        {(part, index) => (
          <PartRenderer
            part={part}
            isLast={index() === (props.parts?.length ?? 0) - 1}
            onNavigateSubAgent={props.onNavigateSubAgent}
          />
        )}
      </For>

      {/* Error display */}
      <Show when={props.message.error && props.message.error.name !== "MessageAbortedError"}>
        <box
          border={["left"]}
          paddingTop={1}
          paddingBottom={1}
          paddingLeft={2}
          marginTop={1}
          backgroundColor={theme.backgroundPanel}
          customBorderChars={SplitBorder.customBorderChars}
          borderColor={theme.error}
        >
          <text color={theme.textMuted}>{props.message.error?.message}</text>
        </box>
      </Show>

      {/* Footer with model info */}
      <Show when={props.isLast || props.message.finish}>
        <box paddingLeft={3}>
          <text marginTop={1}>
            <span style={{ color: props.message.error?.name === "MessageAbortedError" ? theme.textMuted : theme.secondary }}>
              ▣{" "}
            </span>
            <span style={{ color: theme.text }}>{props.message.agent ?? "Agent"}</span>
            <span style={{ color: theme.textMuted }}> · {props.message.modelID}</span>
            <Show when={duration() > 0}>
              <span style={{ color: theme.textMuted }}> · {formatDuration(duration())}</span>
            </Show>
            <Show when={props.message.error?.name === "MessageAbortedError"}>
              <span style={{ color: theme.textMuted }}> · interrupted</span>
            </Show>
          </text>
        </box>
      </Show>
    </>
  );
}

// =============================================================================
// Part Renderer
// =============================================================================

interface PartRendererProps {
  part: Part;
  isLast?: boolean;
  onNavigateSubAgent?: (sessionID: string) => void;
}

function PartRenderer(props: PartRendererProps) {
  return (
    <Switch>
      <Match when={props.part.type === "text"}>
        <TextPartView part={props.part as TextPart} />
      </Match>
      <Match when={props.part.type === "reasoning"}>
        <ReasoningPartView part={props.part as ReasoningPart} />
      </Match>
      <Match when={props.part.type === "tool"}>
        <ToolPartView
          part={props.part as ToolPartType}
          onNavigateSubAgent={props.onNavigateSubAgent}
        />
      </Match>
    </Switch>
  );
}

// =============================================================================
// Text Part
// =============================================================================

function TextPartView(props: { part: TextPart }) {
  const { theme } = useTheme();

  return (
    <Show when={props.part.text.trim()}>
      <box id={"text-" + props.part.id} paddingLeft={3} marginTop={1} flexShrink={0}>
        <text color={theme.text} wrapMode="word">
          {props.part.text.trim()}
        </text>
      </box>
    </Show>
  );
}

// =============================================================================
// Reasoning Part
// =============================================================================

function ReasoningPartView(props: { part: ReasoningPart }) {
  const { theme } = useTheme();

  const content = createMemo(() => {
    // Filter out redacted reasoning chunks
    return props.part.text.replace("[REDACTED]", "").trim();
  });

  return (
    <Show when={content()}>
      <box
        id={"reasoning-" + props.part.id}
        paddingLeft={2}
        marginTop={1}
        flexDirection="column"
        border={["left"]}
        customBorderChars={SplitBorder.customBorderChars}
        borderColor={theme.backgroundElement}
      >
        <text color={theme.textMuted} wrapMode="word">
          <i>Thinking:</i> {content()}
        </text>
      </box>
    </Show>
  );
}

// =============================================================================
// Tool Part - Routes to specific tool components
// =============================================================================

const TOOL_MAPPING: Record<string, typeof BashTool> = {
  bash: BashTool,
  read: ReadTool,
  edit: EditTool,
  glob: GlobTool,
  grep: GrepTool,
  write: WriteTool,
  spawn: SpawnTool,
  task: SpawnTool,
};

function ToolPartView(props: {
  part: ToolPartType;
  onNavigateSubAgent?: (sessionID: string) => void;
}) {
  const component = createMemo(() => TOOL_MAPPING[props.part.tool]);

  return (
    <Show
      when={component()}
      fallback={<GenericTool part={props.part} />}
    >
      <Dynamic
        component={component()}
        part={props.part}
      />
    </Show>
  );
}

// =============================================================================
// Generic Tool (fallback)
// =============================================================================

function GenericTool(props: { part: ToolPartType }) {
  const input = createMemo(() => props.part.state.input ?? {});
  
  const formatInput = () => {
    const entries = Object.entries(input())
      .filter(([_, v]) => typeof v === "string" || typeof v === "number" || typeof v === "boolean")
      .slice(0, 3);
    if (entries.length === 0) return "";
    return entries.map(([k, v]) => `${k}=${v}`).join(", ");
  };

  return (
    <InlineTool
      icon="⚙"
      pending="Running..."
      complete={props.part.state.status === "completed" || props.part.state.status === "error"}
      part={props.part}
    >
      {props.part.tool} {formatInput()}
    </InlineTool>
  );
}

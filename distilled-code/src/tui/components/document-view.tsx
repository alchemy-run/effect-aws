/**
 * DocumentView Component
 *
 * Renders an agent's fragment template as a markdown document.
 * Displays in the right panel with syntax highlighting.
 */

import { TextAttributes } from "@opentui/core";
import { useTerminalDimensions } from "@opentui/solid";
import { createMemo, Show } from "solid-js";
import { renderAgentTemplate } from "../../util/render-template.ts";
import { useRegistry } from "../context/registry.tsx";
import { MarkdownContent } from "./markdown-content.tsx";

/**
 * Props for DocumentView
 */
export interface DocumentViewProps {
  /**
   * Agent ID to display
   */
  id: string;
}

/**
 * Document view panel for agent fragments (fits in right panel)
 */
export function DocumentView(props: DocumentViewProps) {
  const dimensions = useTerminalDimensions();
  const registry = useRegistry();

  // Get the agent from registry
  const agent = createMemo(() => registry.getAgent(props.id) ?? null);

  // Render the agent's template as markdown
  const content = createMemo(() => {
    const a = agent();
    if (!a) return null;
    return `# @${a.id}\n\n${renderAgentTemplate(a)}`;
  });

  // Calculate heights
  const headerHeight = 3;
  const contentHeight = () => dimensions().height - headerHeight - 2;

  return (
    <box
      width="100%"
      height="100%"
      flexDirection="column"
      backgroundColor="#0f0f1a"
    >
      {/* Header */}
      <box
        height={headerHeight}
        padding={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        borderStyle="single"
        borderColor="#3a3a3a"
      >
        <box flexDirection="row" gap={2}>
          <text fg="#8383fa" attributes={TextAttributes.BOLD}>
            {props.id}
          </text>
          <text fg="#6a6a6a">(document)</text>
        </box>
        <text fg="#6a6a6a">ESC: back</text>
      </box>

      {/* Content */}
      <scrollbox height={contentHeight()}>
        <box flexDirection="column" paddingLeft={1} paddingRight={1}>
          <Show
            when={content()}
            fallback={
              <text fg="#fa8383">Agent "{props.id}" not found</text>
            }
          >
            <MarkdownContent content={content()!} streaming={false} />
          </Show>
        </box>
      </scrollbox>
    </box>
  );
}

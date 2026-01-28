/**
 * MarkdownContent Component
 *
 * Renders markdown content with mermaid diagram support.
 * Mermaid blocks are parsed and rendered as ASCII art.
 * Reusable across message streams, previews, and document views.
 */

import { For, Show } from "solid-js";
import { logError } from "../../util/log.ts";
import { useTheme } from "../context/theme.tsx";
import {
  hasMermaidBlocks,
  render as renderMermaid,
  splitMarkdownContent,
  type ContentSegment,
} from "../mermaid-ascii/index.ts";

/**
 * Props for MarkdownContent
 */
export interface MarkdownContentProps {
  /**
   * The markdown content to render
   */
  content: string;

  /**
   * Whether the content is still streaming
   * @default false
   */
  streaming?: boolean;
}

/**
 * Render a mermaid diagram as ASCII art in a box
 */
function MermaidDiagram(props: { source: string; isComplete: boolean }) {
  const { theme } = useTheme();

  // Render the mermaid diagram to ASCII
  const asciiOutput = () => {
    try {
      // Don't render incomplete diagrams
      if (!props.isComplete) {
        return props.source;
      }
      return renderMermaid(props.source);
    } catch (err) {
      // Log the error and show the source as fallback
      logError("MermaidDiagram", "mermaid rendering failed", err);
      return props.source;
    }
  };

  return (
    <box
      borderStyle="single"
      borderColor={theme.border}
      padding={1}
      marginTop={1}
      marginBottom={1}
    >
      <text fg={theme.text}>{asciiOutput()}</text>
    </box>
  );
}

/**
 * Render markdown content with mermaid diagram support
 *
 * Splits content into segments and renders mermaid blocks
 * as ASCII diagrams while rendering other content as markdown.
 */
export function MarkdownContent(props: MarkdownContentProps) {
  const { theme, syntax } = useTheme();

  // Check if content contains mermaid blocks
  const containsMermaid = () => hasMermaidBlocks(props.content);

  // Split content into segments (only when mermaid blocks present)
  const segments = (): ContentSegment[] => {
    if (!containsMermaid()) {
      return [];
    }
    return splitMarkdownContent(props.content);
  };

  // Use Show for reactive conditional rendering
  return (
    <Show
      when={containsMermaid()}
      fallback={
        <code
          filetype="markdown"
          streaming={props.streaming ?? false}
          syntaxStyle={syntax()}
          content={props.content}
          conceal={false}
          fg={theme.text}
        />
      }
    >
      {/* Render segments with mermaid diagrams */}
      <box flexDirection="column">
        <For each={segments()}>
          {(segment) => (
            <Show
              when={segment.type === "mermaid"}
              fallback={
                <code
                  filetype="markdown"
                  streaming={false}
                  syntaxStyle={syntax()}
                  content={segment.content}
                  conceal={false}
                  fg={theme.text}
                />
              }
            >
              <MermaidDiagram
                source={segment.content}
                isComplete={segment.isComplete}
              />
            </Show>
          )}
        </For>
      </box>
    </Show>
  );
}

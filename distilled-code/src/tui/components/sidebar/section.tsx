/**
 * Section Component
 *
 * A Discord-like section for the sidebar with a header and content.
 */

import type { JSX } from "solid-js";

export interface SectionProps {
  /**
   * Section title
   */
  title: string;

  /**
   * Child items to render
   */
  children: JSX.Element;
}

/**
 * A section with a header and child items
 */
export function Section(props: SectionProps) {
  return (
    <box flexDirection="column" width="100%">
      {/* Section header */}
      <box
        flexDirection="row"
        width="100%"
        paddingLeft={1}
        paddingRight={1}
      >
        <text fg="gray">
          ▾ {props.title.toUpperCase()}
        </text>
      </box>

      {/* Section content */}
      <box flexDirection="column" width="100%" paddingLeft={2}>
        {props.children}
      </box>
    </box>
  );
}

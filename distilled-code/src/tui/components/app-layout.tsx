/**
 * App Layout Component
 *
 * Discord-like two-column layout with sidebar and main content area.
 */

import { createSignal, type JSX } from "solid-js";
import { useTerminalDimensions } from "@opentui/solid";
import type { ChannelType } from "../../state/thread.ts";
import { Sidebar, type SidebarSelection } from "./sidebar/sidebar.tsx";

export interface AppLayoutProps {
  /**
   * Initial selection
   */
  initialSelection?: SidebarSelection;

  /**
   * Width of the sidebar
   * @default 30
   */
  sidebarWidth?: number;

  /**
   * Child component for the main content area
   * Receives the current selection
   */
  children: (selection: SidebarSelection | undefined) => JSX.Element;
}

/**
 * Discord-like two-column layout with sidebar on left and content on right
 */
export function AppLayout(props: AppLayoutProps) {
  const dimensions = useTerminalDimensions();
  const [selection, setSelection] = createSignal<SidebarSelection | undefined>(
    props.initialSelection
  );

  const sidebarWidth = () => props.sidebarWidth ?? 30;
  const contentWidth = () => dimensions().width - sidebarWidth();

  const handleSelect = (newSelection: SidebarSelection) => {
    setSelection(newSelection);
  };

  return (
    <box
      width={dimensions().width}
      height={dimensions().height}
      flexDirection="row"
    >
      {/* Left sidebar */}
      <Sidebar
        width={sidebarWidth()}
        selection={selection()}
        onSelect={handleSelect}
      />

      {/* Main content area */}
      <box
        width={contentWidth()}
        height="100%"
        flexDirection="column"
      >
        {props.children(selection())}
      </box>
    </box>
  );
}

/**
 * Hook to get the current channel type and ID from selection
 */
export function useChannelInfo(selection: SidebarSelection | undefined): {
  channelType: ChannelType | undefined;
  channelId: string | undefined;
} {
  if (!selection) {
    return { channelType: undefined, channelId: undefined };
  }
  return { channelType: selection.type, channelId: selection.id };
}

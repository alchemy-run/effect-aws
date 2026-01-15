/**
 * Theme context for the TUI - provides colors and styling
 * Uses hex color strings for simplicity
 */
import { createContext, useContext, type ParentProps } from "solid-js";
import { createStore } from "solid-js/store";

// =============================================================================
// Theme Types
// =============================================================================

export interface ThemeColors {
  // Primary colors
  primary: string;
  secondary: string;
  accent: string;

  // Status colors
  error: string;
  warning: string;
  success: string;
  info: string;

  // Text colors
  text: string;
  textMuted: string;

  // Background colors
  background: string;
  backgroundPanel: string;
  backgroundElement: string;
  backgroundMenu: string;

  // Border colors
  border: string;
  borderActive: string;
  borderSubtle: string;

  // Diff colors
  diffAdded: string;
  diffRemoved: string;
  diffContext: string;
  diffAddedBg: string;
  diffRemovedBg: string;
  diffContextBg: string;
  diffLineNumber: string;
  diffHighlightAdded: string;
  diffHighlightRemoved: string;
  diffAddedLineNumberBg: string;
  diffRemovedLineNumberBg: string;
}

export interface Theme extends ThemeColors {
  name: string;
  mode: "dark" | "light";
}

// =============================================================================
// Default Theme - Based on OpenCode's "opencode" theme
// =============================================================================

const darkTheme: Theme = {
  name: "default",
  mode: "dark",

  // Primary colors
  primary: "#60a5fa", // Blue
  secondary: "#c084fc", // Purple
  accent: "#22d3ee", // Cyan

  // Status colors
  error: "#f87171", // Red
  warning: "#fbbf24", // Yellow/Amber
  success: "#4ade80", // Green
  info: "#60a5fa", // Blue

  // Text colors
  text: "#e5e5e5",
  textMuted: "#737373",

  // Background colors
  background: "#0a0a0a",
  backgroundPanel: "#171717",
  backgroundElement: "#262626",
  backgroundMenu: "#262626",

  // Border colors
  border: "#404040",
  borderActive: "#525252",
  borderSubtle: "#262626",

  // Diff colors
  diffAdded: "#4ade80",
  diffRemoved: "#f87171",
  diffContext: "#737373",
  diffAddedBg: "#14532d",
  diffRemovedBg: "#7f1d1d",
  diffContextBg: "#171717",
  diffLineNumber: "#525252",
  diffHighlightAdded: "#86efac",
  diffHighlightRemoved: "#fca5a5",
  diffAddedLineNumberBg: "#14532d",
  diffRemovedLineNumberBg: "#7f1d1d",
};

// =============================================================================
// Theme Context
// =============================================================================

interface ThemeContextValue {
  theme: Theme;
  mode: () => "dark" | "light";
  setMode: (mode: "dark" | "light") => void;
}

const ThemeContext = createContext<ThemeContextValue>();

export function ThemeProvider(props: ParentProps<{ mode?: "dark" | "light" }>) {
  const [store, setStore] = createStore({
    mode: props.mode ?? "dark",
  });

  const value: ThemeContextValue = {
    theme: darkTheme, // For now, just use dark theme
    mode: () => store.mode,
    setMode: (mode) => setStore("mode", mode),
  };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

// =============================================================================
// Helper function for selected foreground color
// =============================================================================

export function selectedForeground(theme: Theme, _bg?: string): string {
  // Simple logic - use background for selected items
  return theme.background;
}

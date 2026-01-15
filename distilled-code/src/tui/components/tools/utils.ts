/**
 * Utility functions for tool components
 */
import path from "path";

/**
 * Normalize a file path to be relative to cwd
 */
export function normalizePath(input?: string): string {
  if (!input) return "";
  if (path.isAbsolute(input)) {
    return path.relative(process.cwd(), input) || ".";
  }
  return input;
}

/**
 * Format input parameters for display
 */
export function formatInput(
  input: Record<string, unknown>,
  omit?: string[]
): string {
  const primitives = Object.entries(input).filter(([key, value]) => {
    if (omit?.includes(key)) return false;
    return (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    );
  });
  if (primitives.length === 0) return "";
  return `[${primitives.map(([key, value]) => `${key}=${value}`).join(", ")}]`;
}

/**
 * Truncate text to a maximum number of lines
 */
export function truncateLines(
  text: string,
  maxLines: number = 10
): { text: string; truncated: boolean; totalLines: number } {
  const lines = text.split("\n");
  if (lines.length <= maxLines) {
    return { text, truncated: false, totalLines: lines.length };
  }
  return {
    text: lines.slice(0, maxLines).join("\n"),
    truncated: true,
    totalLines: lines.length,
  };
}

import { diffLines, Change } from "diff";

// ANSI color codes
const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const CYAN = "\x1b[36m";

export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber?: number;
}

export interface FileDiff {
  filePath: string;
  oldContent: string;
  newContent: string;
  hunks: DiffHunk[];
}

export interface DiffHunk {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: DiffLine[];
}

/**
 * Compute a diff between two strings and return structured diff data
 */
export function computeDiff(oldContent: string, newContent: string): DiffLine[] {
  const changes = diffLines(oldContent, newContent);
  const lines: DiffLine[] = [];

  for (const change of changes) {
    const changeLines = change.value.split("\n");
    // Remove trailing empty line from split
    if (changeLines[changeLines.length - 1] === "") {
      changeLines.pop();
    }

    for (const line of changeLines) {
      if (change.added) {
        lines.push({ type: "added", content: line });
      } else if (change.removed) {
        lines.push({ type: "removed", content: line });
      } else {
        lines.push({ type: "unchanged", content: line });
      }
    }
  }

  return lines;
}

/**
 * Format a diff for terminal display with ANSI colors
 */
export function formatDiff(
  filePath: string,
  oldContent: string,
  newContent: string,
  contextLines: number = 3
): string {
  const lines = computeDiff(oldContent, newContent);
  const output: string[] = [];

  // Header
  output.push(`${BOLD}${CYAN}--- ${filePath}${RESET}`);
  output.push(`${BOLD}${CYAN}+++ ${filePath}${RESET}`);
  output.push("");

  // Find ranges with changes and include context
  const hunks = extractHunks(lines, contextLines);

  for (const hunk of hunks) {
    // Hunk header
    output.push(
      `${CYAN}@@ -${hunk.oldStart},${hunk.oldCount} +${hunk.newStart},${hunk.newCount} @@${RESET}`
    );

    for (const line of hunk.lines) {
      switch (line.type) {
        case "added":
          output.push(`${GREEN}+${line.content}${RESET}`);
          break;
        case "removed":
          output.push(`${RED}-${line.content}${RESET}`);
          break;
        case "unchanged":
          output.push(`${DIM} ${line.content}${RESET}`);
          break;
      }
    }
  }

  return output.join("\n");
}

/**
 * Format a compact diff showing only changes (for inline display)
 */
export function formatCompactDiff(
  oldContent: string,
  newContent: string
): string {
  const lines = computeDiff(oldContent, newContent);
  const output: string[] = [];

  let hasChanges = false;
  for (const line of lines) {
    if (line.type === "added" || line.type === "removed") {
      hasChanges = true;
      break;
    }
  }

  if (!hasChanges) {
    return `${DIM}(no changes)${RESET}`;
  }

  for (const line of lines) {
    switch (line.type) {
      case "added":
        output.push(`${GREEN}+ ${line.content}${RESET}`);
        break;
      case "removed":
        output.push(`${RED}- ${line.content}${RESET}`);
        break;
      // Skip unchanged lines in compact mode
    }
  }

  return output.join("\n");
}

/**
 * Extract hunks from diff lines with context
 */
function extractHunks(lines: DiffLine[], contextLines: number): DiffHunk[] {
  const hunks: DiffHunk[] = [];
  
  // Find indices of changed lines
  const changedIndices: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].type !== "unchanged") {
      changedIndices.push(i);
    }
  }

  if (changedIndices.length === 0) {
    return hunks;
  }

  // Group changes into hunks
  let hunkStart = Math.max(0, changedIndices[0] - contextLines);
  let hunkEnd = Math.min(lines.length - 1, changedIndices[0] + contextLines);

  for (let i = 1; i < changedIndices.length; i++) {
    const changeIdx = changedIndices[i];
    const potentialStart = changeIdx - contextLines;
    
    if (potentialStart <= hunkEnd + 1) {
      // Merge with current hunk
      hunkEnd = Math.min(lines.length - 1, changeIdx + contextLines);
    } else {
      // Create new hunk
      hunks.push(createHunk(lines, hunkStart, hunkEnd));
      hunkStart = potentialStart;
      hunkEnd = Math.min(lines.length - 1, changeIdx + contextLines);
    }
  }

  // Add final hunk
  hunks.push(createHunk(lines, hunkStart, hunkEnd));

  return hunks;
}

function createHunk(lines: DiffLine[], start: number, end: number): DiffHunk {
  const hunkLines = lines.slice(start, end + 1);
  
  let oldCount = 0;
  let newCount = 0;
  
  for (const line of hunkLines) {
    if (line.type === "removed") {
      oldCount++;
    } else if (line.type === "added") {
      newCount++;
    } else {
      oldCount++;
      newCount++;
    }
  }

  // Calculate line numbers (1-indexed)
  let oldLineNum = 1;
  let newLineNum = 1;
  
  for (let i = 0; i < start; i++) {
    if (lines[i].type === "removed") {
      oldLineNum++;
    } else if (lines[i].type === "added") {
      newLineNum++;
    } else {
      oldLineNum++;
      newLineNum++;
    }
  }

  return {
    oldStart: oldLineNum,
    oldCount,
    newStart: newLineNum,
    newCount,
    lines: hunkLines,
  };
}

/**
 * Create a summary of changes
 */
export function diffSummary(oldContent: string, newContent: string): string {
  const lines = computeDiff(oldContent, newContent);
  
  let added = 0;
  let removed = 0;
  
  for (const line of lines) {
    if (line.type === "added") added++;
    if (line.type === "removed") removed++;
  }

  if (added === 0 && removed === 0) {
    return "No changes";
  }

  const parts: string[] = [];
  if (added > 0) parts.push(`${GREEN}+${added}${RESET}`);
  if (removed > 0) parts.push(`${RED}-${removed}${RESET}`);
  
  return parts.join(" ");
}

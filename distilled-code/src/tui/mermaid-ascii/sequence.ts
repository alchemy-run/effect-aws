/**
 * Mermaid ASCII - Sequence Diagram Renderer
 *
 * Parse and render sequence diagrams to ASCII.
 * Ported from the Go implementation (internal/sequence/).
 */

import { type SequenceChars, getSequenceChars } from "./chars.ts";
import { removeComments, splitLines } from "./parser.ts";
import type {
  ArrowType,
  Message,
  Participant,
  RenderConfig,
  SequenceDiagram,
} from "./types.ts";

const DEFAULT_SELF_MESSAGE_WIDTH = 4;
const DEFAULT_MESSAGE_SPACING = 1;
const DEFAULT_PARTICIPANT_SPACING = 5;
const BOX_PADDING_LEFT_RIGHT = 2;
const MIN_BOX_WIDTH = 3;
const BOX_BORDER_WIDTH = 2;
const LABEL_LEFT_MARGIN = 2;
const LABEL_BUFFER_SPACE = 10;

/**
 * Parse a sequence diagram from mermaid syntax
 */
export function parseSequenceDiagram(input: string): SequenceDiagram {
  const rawLines = splitLines(input.trim());
  const lines = removeComments(rawLines);

  if (lines.length === 0) {
    throw new Error("Empty input");
  }

  // First line should be "sequenceDiagram"
  if (!lines[0].trim().startsWith("sequenceDiagram")) {
    throw new Error('Expected "sequenceDiagram" keyword');
  }

  const sd: SequenceDiagram = {
    participants: [],
    messages: [],
    autonumber: false,
  };

  const participantMap = new Map<string, Participant>();

  // Regex patterns
  const participantRegex =
    /^\s*participant\s+(?:"([^"]+)"|(\S+))(?:\s+as\s+(.+))?$/;
  const messageRegex =
    /^\s*(?:"([^"]+)"|([^\s\->]+))\s*(-->>|->>)\s*(?:"([^"]+)"|([^\s\->]+))\s*:\s*(.*)$/;
  const autonumberRegex = /^\s*autonumber\s*$/;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") continue;

    // Check for autonumber
    if (autonumberRegex.test(trimmed)) {
      sd.autonumber = true;
      continue;
    }

    // Check for participant declaration
    const participantMatch = participantRegex.exec(trimmed);
    if (participantMatch) {
      let id = participantMatch[2] || participantMatch[1];
      let label = participantMatch[3] || id;
      label = label.replace(/^"|"$/g, "").trim();

      if (!participantMap.has(id)) {
        const p: Participant = {
          id,
          label,
          index: sd.participants.length,
        };
        sd.participants.push(p);
        participantMap.set(id, p);
      }
      continue;
    }

    // Check for message
    const messageMatch = messageRegex.exec(trimmed);
    if (messageMatch) {
      const fromId = messageMatch[2] || messageMatch[1];
      const arrow = messageMatch[3];
      const toId = messageMatch[5] || messageMatch[4];
      const label = messageMatch[6].trim();

      // Get or create participants
      let from = participantMap.get(fromId);
      if (!from) {
        from = {
          id: fromId,
          label: fromId,
          index: sd.participants.length,
        };
        sd.participants.push(from);
        participantMap.set(fromId, from);
      }

      let to = participantMap.get(toId);
      if (!to) {
        to = {
          id: toId,
          label: toId,
          index: sd.participants.length,
        };
        sd.participants.push(to);
        participantMap.set(toId, to);
      }

      const arrowType: ArrowType = arrow === "->>" ? "solid" : "dotted";

      const msg: Message = {
        from,
        to,
        label,
        arrowType,
        number: sd.autonumber ? sd.messages.length + 1 : 0,
      };
      sd.messages.push(msg);
      continue;
    }

    // Unknown line - skip
  }

  if (sd.participants.length === 0) {
    throw new Error("No participants found");
  }

  return sd;
}

/**
 * Calculate layout for sequence diagram
 */
interface DiagramLayout {
  participantWidths: number[];
  participantCenters: number[];
  totalWidth: number;
  messageSpacing: number;
  selfMessageWidth: number;
}

function calculateLayout(sd: SequenceDiagram): DiagramLayout {
  const participantSpacing = DEFAULT_PARTICIPANT_SPACING;

  // Calculate widths
  const widths: number[] = [];
  for (const p of sd.participants) {
    let w = p.label.length + BOX_PADDING_LEFT_RIGHT;
    if (w < MIN_BOX_WIDTH) w = MIN_BOX_WIDTH;
    widths.push(w);
  }

  // Self-message width is fixed - the label goes above the loop, not next to it
  const selfMessageWidth = DEFAULT_SELF_MESSAGE_WIDTH;

  // Calculate centers
  const centers: number[] = [];
  let currentX = 0;

  for (let i = 0; i < sd.participants.length; i++) {
    const boxWidth = widths[i] + BOX_BORDER_WIDTH;
    if (i === 0) {
      centers.push(Math.floor(boxWidth / 2));
      currentX = boxWidth;
    } else {
      currentX += participantSpacing;
      centers.push(currentX + Math.floor(boxWidth / 2));
      currentX += boxWidth;
    }
  }

  const last = sd.participants.length - 1;
  const totalWidth =
    centers[last] + Math.floor((widths[last] + BOX_BORDER_WIDTH) / 2);

  return {
    participantWidths: widths,
    participantCenters: centers,
    totalWidth,
    messageSpacing: DEFAULT_MESSAGE_SPACING,
    selfMessageWidth,
  };
}

/**
 * Build a line with participant boxes
 */
function buildLine(
  participants: Participant[],
  layout: DiagramLayout,
  draw: (i: number) => string,
): string {
  let result = "";

  for (let i = 0; i < participants.length; i++) {
    const boxWidth = layout.participantWidths[i] + BOX_BORDER_WIDTH;
    const left = layout.participantCenters[i] - Math.floor(boxWidth / 2);

    const needed = left - result.length;
    if (needed > 0) {
      result += " ".repeat(needed);
    }
    result += draw(i);
  }

  return result;
}

/**
 * Build a lifeline row
 */
function buildLifeline(layout: DiagramLayout, chars: SequenceChars): string {
  const line = new Array(layout.totalWidth + 1).fill(" ");

  for (const c of layout.participantCenters) {
    if (c < line.length) {
      line[c] = chars.vertical;
    }
  }

  return line.join("").trimEnd();
}

/**
 * Render a regular message (between different participants)
 */
function renderMessage(
  msg: Message,
  layout: DiagramLayout,
  chars: SequenceChars,
): string[] {
  const lines: string[] = [];
  const from = layout.participantCenters[msg.from.index];
  const to = layout.participantCenters[msg.to.index];

  let label = msg.label;
  if (msg.number > 0) {
    label = `${msg.number}. ${msg.label}`;
  }

  // Draw label line
  if (label) {
    const start = Math.min(from, to) + LABEL_LEFT_MARGIN;
    const labelWidth = label.length;
    const w =
      Math.max(layout.totalWidth, start + labelWidth) + LABEL_BUFFER_SPACE;

    const lifeline = buildLifeline(layout, chars).split("");
    while (lifeline.length < w) lifeline.push(" ");

    for (let i = 0; i < label.length; i++) {
      if (start + i < lifeline.length) {
        lifeline[start + i] = label[i];
      }
    }
    lines.push(lifeline.join("").trimEnd());
  }

  // Draw arrow line
  const arrowLine = buildLifeline(layout, chars).split("");
  const style = msg.arrowType === "solid" ? chars.solidLine : chars.dottedLine;

  if (from < to) {
    arrowLine[from] = chars.teeRight;
    for (let i = from + 1; i < to; i++) {
      arrowLine[i] = style;
    }
    arrowLine[to - 1] = chars.arrowRight;
    arrowLine[to] = chars.vertical;
  } else {
    arrowLine[to] = chars.vertical;
    arrowLine[to + 1] = chars.arrowLeft;
    for (let i = to + 2; i < from; i++) {
      arrowLine[i] = style;
    }
    arrowLine[from] = chars.teeLeft;
  }

  lines.push(arrowLine.join("").trimEnd());
  return lines;
}

/**
 * Render a self-message
 */
function renderSelfMessage(
  msg: Message,
  layout: DiagramLayout,
  chars: SequenceChars,
): string[] {
  const lines: string[] = [];
  const center = layout.participantCenters[msg.from.index];
  const width = layout.selfMessageWidth;

  let label = msg.label;
  if (msg.number > 0) {
    label = `${msg.number}. ${msg.label}`;
  }

  // Calculate minimum width needed for label
  const labelStart = center + LABEL_LEFT_MARGIN;
  const labelEnd = labelStart + label.length;

  const ensureWidth = (s: string): string[] => {
    // Ensure enough width for both self-loop and label
    const target = Math.max(layout.totalWidth + width + 1, labelEnd + 1);
    const arr = s.split("");
    while (arr.length < target) arr.push(" ");
    return arr;
  };

  // Draw label
  if (label) {
    const line = ensureWidth(buildLifeline(layout, chars));
    for (let i = 0; i < label.length; i++) {
      if (labelStart + i < line.length) {
        line[labelStart + i] = label[i];
      }
    }
    lines.push(line.join("").trimEnd());
  }

  // Draw top of self-loop
  const l1 = ensureWidth(buildLifeline(layout, chars));
  l1[center] = chars.teeRight;
  for (let i = 1; i < width; i++) {
    l1[center + i] = chars.horizontal;
  }
  l1[center + width - 1] = chars.selfTopRight;
  lines.push(l1.join("").trimEnd());

  // Draw middle
  const l2 = ensureWidth(buildLifeline(layout, chars));
  l2[center + width - 1] = chars.vertical;
  lines.push(l2.join("").trimEnd());

  // Draw bottom of self-loop
  const l3 = ensureWidth(buildLifeline(layout, chars));
  l3[center] = chars.vertical;
  l3[center + 1] = chars.arrowLeft;
  for (let i = 2; i < width - 1; i++) {
    l3[center + i] = chars.horizontal;
  }
  l3[center + width - 1] = chars.selfBottom;
  lines.push(l3.join("").trimEnd());

  return lines;
}

/**
 * Render a sequence diagram to ASCII
 */
export function renderSequenceDiagram(
  input: string,
  config: RenderConfig = {},
): string {
  const sd = parseSequenceDiagram(input);
  const chars = getSequenceChars(config.ascii ?? false);
  const layout = calculateLayout(sd);

  const lines: string[] = [];

  // Draw participant header boxes
  // Top border
  lines.push(
    buildLine(sd.participants, layout, (i) => {
      const w = layout.participantWidths[i];
      return chars.topLeft + chars.horizontal.repeat(w) + chars.topRight;
    }),
  );

  // Label row
  lines.push(
    buildLine(sd.participants, layout, (i) => {
      const w = layout.participantWidths[i];
      const label = sd.participants[i].label;
      const labelLen = label.length;
      const pad = Math.floor((w - labelLen) / 2);
      return (
        chars.vertical +
        " ".repeat(pad) +
        label +
        " ".repeat(w - pad - labelLen) +
        chars.vertical
      );
    }),
  );

  // Bottom border with lifeline tee
  lines.push(
    buildLine(sd.participants, layout, (i) => {
      const w = layout.participantWidths[i];
      const half = Math.floor(w / 2);
      return (
        chars.bottomLeft +
        chars.horizontal.repeat(half) +
        chars.teeDown +
        chars.horizontal.repeat(w - half - 1) +
        chars.bottomRight
      );
    }),
  );

  // Draw messages
  for (const msg of sd.messages) {
    // Add spacing
    for (let i = 0; i < layout.messageSpacing; i++) {
      lines.push(buildLifeline(layout, chars));
    }

    // Render message
    if (msg.from === msg.to) {
      lines.push(...renderSelfMessage(msg, layout, chars));
    } else {
      lines.push(...renderMessage(msg, layout, chars));
    }
  }

  // Final lifeline
  lines.push(buildLifeline(layout, chars));

  return lines.join("\n") + "\n";
}

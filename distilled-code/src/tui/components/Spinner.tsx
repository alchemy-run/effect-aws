/**
 * Spinner component - Animated loading indicator
 * Supports multiple styles including Knight Rider style from OpenCode
 */
import { createSignal, createMemo, onCleanup, Show } from "solid-js";
import { useTheme } from "../context/theme.tsx";

// =============================================================================
// Spinner Frames
// =============================================================================

const BRAILLE_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const DOTS_FRAMES = ["⠋", "⠙", "⠚", "⠒", "⠂", "⠂", "⠒", "⠲", "⠴", "⠦", "⠖", "⠋"];
const BLOCKS_FRAMES = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃", "▂"];
const SIMPLE_FRAMES = ["|", "/", "-", "\\"];

type SpinnerStyle = "braille" | "dots" | "blocks" | "simple" | "knight-rider";

// =============================================================================
// Types
// =============================================================================

export interface SpinnerProps {
  label?: string;
  style?: SpinnerStyle;
  color?: string;
  interval?: number;
  width?: number;
}

// =============================================================================
// Knight Rider Style Generator
// =============================================================================

function createKnightRiderFrames(width: number = 8): string[] {
  const frames: string[] = [];
  
  // Forward sweep
  for (let i = 0; i < width; i++) {
    const line = Array(width).fill("·");
    line[i] = "●";
    if (i > 0) line[i - 1] = "○";
    if (i > 1) line[i - 2] = "·";
    frames.push(line.join(""));
  }
  
  // Backward sweep
  for (let i = width - 2; i > 0; i--) {
    const line = Array(width).fill("·");
    line[i] = "●";
    if (i < width - 1) line[i + 1] = "○";
    if (i < width - 2) line[i + 2] = "·";
    frames.push(line.join(""));
  }
  
  return frames;
}

// =============================================================================
// Component
// =============================================================================

export function Spinner(props: SpinnerProps) {
  const { theme } = useTheme();
  const [frameIndex, setFrameIndex] = createSignal(0);

  const style = createMemo(() => props.style ?? "braille");
  const color = createMemo(() => props.color ?? theme.primary);
  const interval = createMemo(() => props.interval ?? 80);
  const width = createMemo(() => props.width ?? 8);

  const frames = createMemo(() => {
    switch (style()) {
      case "braille":
        return BRAILLE_FRAMES;
      case "dots":
        return DOTS_FRAMES;
      case "blocks":
        return BLOCKS_FRAMES;
      case "simple":
        return SIMPLE_FRAMES;
      case "knight-rider":
        return createKnightRiderFrames(width());
      default:
        return BRAILLE_FRAMES;
    }
  });

  const timer = setInterval(() => {
    setFrameIndex((f) => (f + 1) % frames().length);
  }, interval());

  onCleanup(() => clearInterval(timer));

  const currentFrame = createMemo(() => frames()[frameIndex()]);

  return (
    <text color={color()}>
      {currentFrame()}
      <Show when={props.label}>
        <span style={{ color: theme.text }}> {props.label}</span>
      </Show>
    </text>
  );
}

// =============================================================================
// Inline Spinner (for use in text)
// =============================================================================

export function InlineSpinner(props: { color?: string }) {
  const { theme } = useTheme();
  const [frameIndex, setFrameIndex] = createSignal(0);
  const color = createMemo(() => props.color ?? theme.textMuted);

  const timer = setInterval(() => {
    setFrameIndex((f) => (f + 1) % BRAILLE_FRAMES.length);
  }, 80);

  onCleanup(() => clearInterval(timer));

  return (
    <span style={{ color: color() }}>
      {BRAILLE_FRAMES[frameIndex()]}
    </span>
  );
}

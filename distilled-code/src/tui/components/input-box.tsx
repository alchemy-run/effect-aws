/**
 * InputBox Component
 *
 * Text input for sending messages to agents.
 */

import type { InputRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/solid";
import { createSignal, onMount } from "solid-js";

/**
 * Props for InputBox
 */
export interface InputBoxProps {
  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Callback when message is submitted
   */
  onSubmit: (message: string) => void;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Whether the input is focused
   */
  focused?: boolean;

  /**
   * Callback when Ctrl+P is pressed (to open agent picker)
   */
  onOpenPicker?: () => void;
}

/**
 * Text input component for sending messages
 */
export function InputBox(props: InputBoxProps) {
  const [value, setValue] = createSignal("");
  let inputRef: InputRenderable | undefined;

  onMount(() => {
    if (props.focused && inputRef) {
      inputRef.focus();
    }
  });

  // Handle global shortcuts even when input is focused
  useKeyboard((evt) => {
    // Ctrl+P: Open agent picker
    if (evt.ctrl && evt.name === "p") {
      props.onOpenPicker?.();
      return;
    }
  });

  const handleInput = (text: string) => {
    // Allow typing even while disabled (loading) so user can compose next message
    setValue(text);
  };

  const handleSubmit = () => {
    const message = value().trim();
    if (message && !props.disabled) {
      props.onSubmit(message);
      setValue("");
    }
  };

  return (
    <box
      width="100%"
      padding={1}
      borderStyle="rounded"
      borderColor={props.focused ? "#fab283" : "#3a3a3a"}
      backgroundColor="#1a1a2e"
    >
      <input
        ref={(r) => {
          inputRef = r;
        }}
        value={value()}
        onInput={handleInput}
        onSubmit={handleSubmit}
        placeholder={props.placeholder || "Type a message..."}
        focusedBackgroundColor="#1a1a2e"
        cursorColor="#fab283"
        focusedTextColor="#eaeaea"
      />
    </box>
  );
}

/**
 * InputBox Component
 *
 * Text input for sending messages to agents.
 */

import type { InputRenderable } from "@opentui/core";
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
}

/**
 * Text input component for sending messages
 */
export function InputBox(props: InputBoxProps) {
  const [value, setValue] = createSignal("");
  let inputRef: InputRenderable | undefined;

  // Focus on mount
  onMount(() => {
    setTimeout(() => inputRef?.focus(), 10);
  });

  const handleInput = (text: string) => {
    if (props.disabled) return;
    setValue(text);
  };

  const handleSubmit = () => {
    const message = value().trim();
    if (message && !props.disabled) {
      props.onSubmit(message);
      setValue("");
      // Clear the input
      if (inputRef) {
        (inputRef as any).text = "";
      }
    }
  };

  return (
    <box
      width="100%"
      padding={1}
      borderStyle="rounded"
      borderColor="#fab283"
      backgroundColor="#1a1a2e"
    >
      <input
        ref={(r) => {
          inputRef = r;
        }}
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

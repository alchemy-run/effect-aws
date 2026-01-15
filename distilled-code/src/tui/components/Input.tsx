import { createSignal } from "solid-js";

export interface InputProps {
  onSubmit: (value: string) => void;
  onEscape?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Input(props: InputProps) {
  const [value, setValue] = createSignal("");

  const handleSubmit = (val: string) => {
    const text = val.trim();
    if (text && !props.disabled) {
      props.onSubmit(text);
      setValue("");
    }
  };

  const handleKeyDown = (event: { key: string }) => {
    // Handle ESC key
    if (event.key === "escape" && props.onEscape) {
      props.onEscape();
    }
  };

  return (
    <input
      value={value()}
      placeholder={props.placeholder ?? "Type a message..."}
      onSubmit={handleSubmit}
      onChange={setValue}
      onKeyDown={handleKeyDown}
      focused={!props.disabled}
      borderStyle="round"
      borderColor={props.disabled ? "gray" : "blue"}
    />
  );
}

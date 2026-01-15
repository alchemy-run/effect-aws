/**
 * Dialog context - Modal dialog management
 * Simplified version for basic confirmations
 */
import {
  createContext,
  useContext,
  type ParentProps,
  type JSX,
  Show,
  batch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useTheme } from "./theme.tsx";

// =============================================================================
// Types
// =============================================================================

interface DialogStackItem {
  element: JSX.Element;
  onClose?: () => void;
}

interface DialogContextValue {
  stack: DialogStackItem[];
  size: "medium" | "large";
  
  // Show a dialog (replaces current stack)
  replace: (element: () => JSX.Element, onClose?: () => void) => void;
  
  // Push a dialog onto the stack
  push: (element: () => JSX.Element, onClose?: () => void) => void;
  
  // Pop the top dialog
  pop: () => void;
  
  // Clear all dialogs
  clear: () => void;
  
  // Set dialog size
  setSize: (size: "medium" | "large") => void;
}

// =============================================================================
// Dialog Component
// =============================================================================

function Dialog(props: ParentProps<{ size?: "medium" | "large"; onClose: () => void }>) {
  const { theme } = useTheme();

  return (
    <box
      onMouseUp={() => props.onClose?.()}
      width="100%"
      height="100%"
      alignItems="center"
      position="absolute"
      paddingTop={10}
      left={0}
      top={0}
      backgroundColor="#00000099"
    >
      <box
        onMouseUp={(e: { stopPropagation: () => void }) => e.stopPropagation()}
        width={props.size === "large" ? 80 : 60}
        backgroundColor={theme.backgroundPanel}
        paddingTop={1}
      >
        {props.children}
      </box>
    </box>
  );
}

// =============================================================================
// Dialog Provider
// =============================================================================

const DialogContext = createContext<DialogContextValue>();

export function DialogProvider(props: ParentProps) {
  const [store, setStore] = createStore({
    stack: [] as DialogStackItem[],
    size: "medium" as "medium" | "large",
  });

  const value: DialogContextValue = {
    get stack() {
      return store.stack;
    },
    get size() {
      return store.size;
    },

    replace(element, onClose) {
      // Call onClose for all existing dialogs
      for (const item of store.stack) {
        item.onClose?.();
      }
      setStore("size", "medium");
      setStore("stack", [{ element: element(), onClose }]);
    },

    push(element, onClose) {
      setStore("stack", [...store.stack, { element: element(), onClose }]);
    },

    pop() {
      const current = store.stack.at(-1);
      current?.onClose?.();
      setStore("stack", store.stack.slice(0, -1));
    },

    clear() {
      for (const item of store.stack) {
        item.onClose?.();
      }
      batch(() => {
        setStore("size", "medium");
        setStore("stack", []);
      });
    },

    setSize(size) {
      setStore("size", size);
    },
  };

  return (
    <DialogContext.Provider value={value}>
      {props.children}
      <box position="absolute">
        <Show when={store.stack.length > 0}>
          <Dialog onClose={() => value.clear()} size={store.size}>
            {store.stack.at(-1)!.element}
          </Dialog>
        </Show>
      </box>
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return ctx;
}

// =============================================================================
// Confirm Dialog Component
// =============================================================================

export interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { theme } = useTheme();

  return (
    <box gap={1} paddingLeft={2} paddingRight={2} paddingBottom={1}>
      <text color={theme.text} bold>
        {props.title}
      </text>
      <text color={theme.textMuted} wrapMode="word">
        {props.message}
      </text>
      <box flexDirection="row" gap={2} paddingTop={1}>
        <box
          onMouseUp={props.onConfirm}
          paddingLeft={2}
          paddingRight={2}
          backgroundColor={theme.primary}
        >
          <text color={theme.background}>
            {props.confirmLabel ?? "Confirm"}
          </text>
        </box>
        <box
          onMouseUp={props.onCancel}
          paddingLeft={2}
          paddingRight={2}
          backgroundColor={theme.error}
        >
          <text color={theme.background}>
            {props.cancelLabel ?? "Cancel"}
          </text>
        </box>
      </box>
      <text color={theme.textMuted}>
        Click to select
      </text>
    </box>
  );
}

// =============================================================================
// Alert Dialog Component
// =============================================================================

export interface AlertDialogProps {
  title: string;
  message: string;
  onClose: () => void;
}

export function AlertDialog(props: AlertDialogProps) {
  const { theme } = useTheme();

  return (
    <box gap={1} paddingLeft={2} paddingRight={2} paddingBottom={1}>
      <text color={theme.warning} bold>
        {props.title}
      </text>
      <text color={theme.text} wrapMode="word">
        {props.message}
      </text>
      <box flexDirection="row" gap={2} paddingTop={1}>
        <box onMouseUp={props.onClose} paddingLeft={2} paddingRight={2} backgroundColor={theme.primary}>
          <text color={theme.background}>OK</text>
        </box>
      </box>
    </box>
  );
}

// =============================================================================
// Helper functions
// =============================================================================

export function showConfirm(
  dialog: DialogContextValue,
  title: string,
  message: string
): Promise<boolean> {
  return new Promise((resolve) => {
    dialog.replace(
      () => (
        <ConfirmDialog
          title={title}
          message={message}
          onConfirm={() => {
            dialog.clear();
            resolve(true);
          }}
          onCancel={() => {
            dialog.clear();
            resolve(false);
          }}
        />
      ),
      () => resolve(false)
    );
  });
}

export function showAlert(
  dialog: DialogContextValue,
  title: string,
  message: string
): Promise<void> {
  return new Promise((resolve) => {
    dialog.replace(
      () => (
        <AlertDialog
          title={title}
          message={message}
          onClose={() => {
            dialog.clear();
            resolve();
          }}
        />
      ),
      () => resolve()
    );
  });
}

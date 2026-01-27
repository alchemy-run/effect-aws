/**
 * StateStore Context
 *
 * Provides runtime services to TUI components.
 * The layer provided to StoreProvider determines what services are available.
 */

import type { Layer } from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import { createContext, useContext, type JSX } from "solid-js";

/**
 * Store context value - exposes runtime directly for simple usage
 *
 * Components can call:
 * - store.runtime.runPromise(effect) - for async operations
 * - store.runtime.runFork(effect) - for fire-and-forget
 */
export interface StoreContextValue<R = unknown> {
  /**
   * The managed runtime - use runPromise() or runFork() directly
   */
  runtime: ManagedRuntime.ManagedRuntime<R, never>;

  /**
   * Exit the TUI
   */
  exit: () => void;
}

const StoreContext = createContext<StoreContextValue>();

/**
 * Props for StoreProvider
 */
export interface StoreProviderProps<R, E> {
  /**
   * Layer providing services for Effects
   */
  layer: Layer<R, E, never>;

  /**
   * Callback when TUI exits
   */
  onExit: () => void;

  /**
   * Child components
   */
  children: JSX.Element;
}

/**
 * Provider component for runtime services
 *
 * The layer determines what services are available to Effects run through the store.
 */
export function StoreProvider<R, E>(props: StoreProviderProps<R, E>) {
  // Create a managed runtime from the layer
  const runtime = ManagedRuntime.make(props.layer);

  const value: StoreContextValue<R> = {
    runtime: runtime as ManagedRuntime.ManagedRuntime<R, never>,
    exit: () => {
      props.onExit();
    },
  };

  return (
    <StoreContext.Provider value={value as StoreContextValue}>
      {props.children}
    </StoreContext.Provider>
  );
}

/**
 * Hook to access the store context
 */
export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

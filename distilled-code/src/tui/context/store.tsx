/**
 * StateStore Context
 *
 * Provides runtime services to TUI components.
 * The layer provided to StoreProvider determines what services are available.
 */

import { createContext, useContext, type JSX } from "solid-js";
import type { Layer } from "effect/Layer";
import * as Fiber from "effect/Fiber";
import * as Effect from "effect/Effect";
import * as ManagedRuntime from "effect/ManagedRuntime";
import { log, logError } from "../../util/log.ts";

/**
 * Store context value - minimal API for Effect-native UI
 *
 * Effects run through runFork can require any services provided by the layer.
 * Type safety is ensured at the call site.
 */
export interface StoreContextValue {
  /**
   * Fork an Effect with the store's layer, returning the fiber for cancellation
   */
  runFork: <A, E, R>(
    effect: Effect.Effect<A, E, R>,
  ) => Fiber.RuntimeFiber<A, E>;

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
  try {
    log("StoreProvider", "Creating StoreProvider");

    // Create a managed runtime from the layer
    log("StoreProvider", "Creating ManagedRuntime from layer");
    const runtime = ManagedRuntime.make(props.layer);
    log("StoreProvider", "ManagedRuntime created");

    const value: StoreContextValue = {
      runFork: <A, Err, Req>(
        effect: Effect.Effect<A, Err, Req>,
      ): Fiber.RuntimeFiber<A, Err> => {
        log("StoreProvider", "runFork called");
        return runtime.runFork(effect as any) as Fiber.RuntimeFiber<A, Err>;
      },
      exit: () => {
        log("StoreProvider", "exit called");
        props.onExit();
      },
    };

    log("StoreProvider", "Rendering children");
    return (
      <StoreContext.Provider value={value}>
        {props.children}
      </StoreContext.Provider>
    );
  } catch (err) {
    logError("StoreProvider", "Error in StoreProvider", err);
    throw err;
  }
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

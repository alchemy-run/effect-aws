/**
 * Effect-Solid Bridge
 *
 * Utilities to convert Effect streams and effects to Solid signals.
 */

import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Stream from "effect/Stream";
import { createSignal, onCleanup, createEffect as solidEffect } from "solid-js";
import { useStore } from "../context/store.tsx";

/**
 * Effect-native createEffect
 *
 * Runs an Effect whenever reactive dependencies change, automatically
 * managing fiber lifecycle (interrupting previous fibers on re-run).
 *
 * The effect must handle its own errors using Effect combinators like
 * `Effect.catchAll`, `Effect.catchTag`, etc. This keeps error handling
 * in Effect-land where it belongs.
 *
 * @example
 * ```typescript
 * createEffectEffect(() =>
 *   Effect.gen(function* () {
 *     const store = yield* StateStore;
 *     const parts = yield* store.readThreadParts(agentId(), threadId());
 *     setParts(parts);
 *   }).pipe(
 *     Effect.catchAll((e) => Effect.sync(() => setError(String(e))))
 *   )
 * );
 * ```
 *
 * @param effectFn - Function returning an Effect (must handle its own errors)
 */
export function createEffectEffect<R>(
  effectFn: () => Effect.Effect<void, never, R>,
): void {
  const store = useStore();
  let currentFiber: Fiber.RuntimeFiber<void, never> | undefined;

  solidEffect(() => {
    // Interrupt previous fiber if still running
    if (currentFiber) {
      Effect.runSync(Fiber.interrupt(currentFiber));
      currentFiber = undefined;
    }

    // Fork the effect
    currentFiber = store.runFork(effectFn());
  });

  onCleanup(() => {
    if (currentFiber) {
      Effect.runFork(Fiber.interrupt(currentFiber));
      currentFiber = undefined;
    }
  });
}

/**
 * Result of useEffectStream hook
 */
export interface StreamResult<A> {
  /**
   * Accumulated items from the stream
   */
  items: () => A[];

  /**
   * Whether the stream is currently loading
   */
  loading: () => boolean;

  /**
   * Error if the stream failed
   */
  error: () => unknown | undefined;

  /**
   * Whether the stream has completed
   */
  completed: () => boolean;
}

/**
 * Subscribe to an Effect stream and accumulate items as a Solid signal
 *
 * @param streamEffect - Effect that produces a Stream
 * @returns StreamResult with reactive signals
 */
export function useEffectStream<A, E, R>(
  streamEffect: () => Effect.Effect<Stream.Stream<A, E, never>, E, R>,
): StreamResult<A> {
  const store = useStore();
  const [items, setItems] = createSignal<A[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<unknown>();
  const [completed, setCompleted] = createSignal(false);

  let fiber: Fiber.RuntimeFiber<void, never> | undefined;

  solidEffect(() => {
    // Interrupt previous fiber if still running
    if (fiber) {
      Effect.runFork(Fiber.interrupt(fiber));
      fiber = undefined;
    }

    // Reset state
    setItems([]);
    setLoading(true);
    setError(undefined);
    setCompleted(false);

    const effect = Effect.gen(function* () {
      const stream = yield* streamEffect();

      yield* stream.pipe(
        Stream.runForEach((item) =>
          Effect.sync(() => {
            setItems((prev) => [...prev, item]);
          }),
        ),
      );

      setCompleted(true);
      setLoading(false);
    }).pipe(
      Effect.catchAll((e: unknown) =>
        Effect.sync(() => {
          setError(e);
          setLoading(false);
        }),
      ),
    );

    // Fork the effect
    fiber = store.runFork(effect);
  });

  onCleanup(() => {
    if (fiber) {
      Effect.runFork(Fiber.interrupt(fiber));
      fiber = undefined;
    }
  });

  return {
    items,
    loading,
    error,
    completed,
  };
}

/**
 * Result of useEffectOnce hook
 */
export interface EffectResult<A> {
  /**
   * The result value (undefined while loading)
   */
  value: () => A | undefined;

  /**
   * Whether the effect is currently loading
   */
  loading: () => boolean;

  /**
   * Error if the effect failed
   */
  error: () => unknown | undefined;

  /**
   * Refetch the effect
   */
  refetch: () => void;
}

/**
 * Run an Effect once and return the result as a Solid signal
 *
 * @param effect - Effect to run
 * @returns EffectResult with reactive signals
 */
export function useEffectOnce<A, E, R>(
  effectFn: () => Effect.Effect<A, E, R>,
): EffectResult<A> {
  const store = useStore();
  const [value, setValue] = createSignal<A>();
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<unknown>();
  const [trigger, setTrigger] = createSignal(0);

  let fiber: Fiber.RuntimeFiber<void, never> | undefined;

  const refetch = () => setTrigger((n) => n + 1);

  solidEffect(() => {
    // Access trigger to create dependency
    trigger();

    // Interrupt previous fiber if still running
    if (fiber) {
      Effect.runFork(Fiber.interrupt(fiber));
      fiber = undefined;
    }

    setLoading(true);
    setError(undefined);

    const effect = effectFn().pipe(
      Effect.tap((result) =>
        Effect.sync(() => {
          setValue(() => result);
          setLoading(false);
        }),
      ),
      Effect.asVoid,
      Effect.catchAll((e: unknown) =>
        Effect.sync(() => {
          setError(e);
          setLoading(false);
        }),
      ),
    );

    fiber = store.runFork(effect);
  });

  onCleanup(() => {
    if (fiber) {
      Effect.runFork(Fiber.interrupt(fiber));
      fiber = undefined;
    }
  });

  return {
    value,
    loading,
    error,
    refetch,
  };
}

/**
 * Run an Effect and return a trigger function
 *
 * @param effectFn - Function that creates the Effect
 * @returns Object with trigger function and state signals
 */
export function useEffectCallback<A, E, R, Args extends unknown[]>(
  effectFn: (...args: Args) => Effect.Effect<A, E, R>,
): {
  trigger: (...args: Args) => void;
  loading: () => boolean;
  error: () => unknown | undefined;
  result: () => A | undefined;
} {
  const store = useStore();
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<unknown>();
  const [result, setResult] = createSignal<A>();

  let currentFiber: Fiber.RuntimeFiber<void, never> | undefined;

  const trigger = (...args: Args): void => {
    // Interrupt previous fiber if still running
    if (currentFiber) {
      Effect.runFork(Fiber.interrupt(currentFiber));
      currentFiber = undefined;
    }

    setLoading(true);
    setError(undefined);

    const effect = effectFn(...args).pipe(
      Effect.tap((value) =>
        Effect.sync(() => {
          setResult(() => value);
          setLoading(false);
        }),
      ),
      Effect.asVoid,
      Effect.catchAll((e: unknown) =>
        Effect.sync(() => {
          setError(e);
          setLoading(false);
        }),
      ),
    );

    currentFiber = store.runFork(effect);
  };

  onCleanup(() => {
    if (currentFiber) {
      Effect.runFork(Fiber.interrupt(currentFiber));
      currentFiber = undefined;
    }
  });

  return {
    trigger,
    loading,
    error,
    result,
  };
}

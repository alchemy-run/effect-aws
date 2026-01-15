import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as FiberRef from "effect/FiberRef";
import * as Ref from "effect/Ref";
import * as Context from "effect/Context";
import * as Layer from "effect/Layer";
import * as Deferred from "effect/Deferred";
import * as Queue from "effect/Queue";
import type { TuiEvent } from "../types.ts";
import { TuiEventQueue } from "./ChatService.ts";

/**
 * Service that provides interruptible execution of agent operations.
 * Allows ESC key to gracefully cancel running operations.
 */
export class InterruptController extends Context.Tag("InterruptController")<
  InterruptController,
  {
    /**
     * Run an effect in an interruptible scope.
     * Returns the result or void if interrupted.
     */
    run: <A, E, R>(
      effect: Effect.Effect<A, E, R>
    ) => Effect.Effect<A | void, E, R>;

    /**
     * Interrupt the currently running operation.
     * Called when ESC is pressed.
     */
    interrupt: () => Effect.Effect<void>;

    /**
     * Check if an operation is currently running.
     */
    isRunning: () => Effect.Effect<boolean>;
  }
>() {}

export const interruptControllerLayer = Layer.effect(
  InterruptController,
  Effect.gen(function* () {
    // Ref to hold the current running fiber (if any)
    const currentFiberRef = yield* Ref.make<Fiber.Fiber<unknown, unknown> | null>(null);
    
    // Ref to track if we're currently running
    const runningRef = yield* Ref.make(false);

    // Optional: Get event queue to emit processing status
    const eventQueue = yield* Effect.serviceOption(TuiEventQueue);

    const emitProcessing = (value: boolean) =>
      eventQueue._tag === "Some"
        ? Queue.offer(eventQueue.value, { type: "processing", value } as TuiEvent)
        : Effect.void;

    return {
      run: <A, E, R>(effect: Effect.Effect<A, E, R>) =>
        Effect.gen(function* () {
          // Check if already running
          const alreadyRunning = yield* Ref.get(runningRef);
          if (alreadyRunning) {
            yield* Effect.logWarning("InterruptController: Already running an operation");
            return undefined as A | void;
          }

          // Set running state
          yield* Ref.set(runningRef, true);
          yield* emitProcessing(true);

          // Fork the effect so we can interrupt it
          const fiber = yield* Effect.fork(effect);
          yield* Ref.set(currentFiberRef, fiber as Fiber.Fiber<unknown, unknown>);

          // Wait for the fiber to complete
          const result = yield* Fiber.join(fiber).pipe(
            Effect.onInterrupt(() =>
              Effect.gen(function* () {
                yield* Effect.log("Operation interrupted by user");
                yield* emitProcessing(false);
                yield* Ref.set(runningRef, false);
                yield* Ref.set(currentFiberRef, null);
              })
            ),
            Effect.catchAllCause((cause) =>
              Effect.gen(function* () {
                // Check if the cause contains an interrupt
                if (cause._tag === "Interrupt") {
                  // Interrupted - return undefined
                  return undefined as A | void;
                }
                // Re-throw other errors
                return yield* Effect.failCause(cause);
              })
            )
          );

          // Clear running state
          yield* Ref.set(runningRef, false);
          yield* Ref.set(currentFiberRef, null);
          yield* emitProcessing(false);

          return result;
        }) as Effect.Effect<A | void, E, R>,

      interrupt: () =>
        Effect.gen(function* () {
          const fiber = yield* Ref.get(currentFiberRef);
          if (fiber) {
            yield* Effect.log("Interrupting current operation...");
            yield* Fiber.interrupt(fiber);
            yield* Ref.set(currentFiberRef, null);
            yield* Ref.set(runningRef, false);
            yield* emitProcessing(false);
          }
        }),

      isRunning: () => Ref.get(runningRef),
    };
  })
);

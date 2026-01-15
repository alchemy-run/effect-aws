import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Ref from "effect/Ref";
import * as HashMap from "effect/HashMap";

export class Locks extends Context.Tag("Locks")<
  Locks,
  {
    getLock: (
      filePath: string,
    ) => Effect.Effect<Effect.Semaphore, never, never>;
  }
>() {}

export const locks = Layer.effect(
  Locks,
  Effect.gen(function* () {
    const locks = yield* Ref.make(HashMap.empty<string, Effect.Semaphore>());
    const getLock = Effect.fn(function* (filePath: string) {
      const lock = yield* Ref.get(locks);
      const existing = HashMap.get(lock, filePath);
      if (existing._tag === "Some") {
        return existing.value;
      }
      const newSemaphore = yield* Effect.makeSemaphore(1);
      yield* Ref.set(locks, HashMap.set(lock, filePath, newSemaphore));
      return newSemaphore;
    });
    return { getLock };
  }),
);

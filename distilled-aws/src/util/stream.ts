/**
 * Shared stream utilities for AWS protocols.
 * Provides helpers for converting between Effect Streams, ReadableStreams, and text.
 */

import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import type { StreamingInputBody } from "../traits.ts";

export const readEffectStreamAsText = <Err>(
  stream: Stream.Stream<Uint8Array, Err>,
): Effect.Effect<string, Err> =>
  readStreamAsText(effectStreamToReadable(stream));

/**
 * Read a ReadableStream as text (for non-streaming responses).
 * This is lazy - only consumes when called.
 */
export const readStreamAsText = (
  stream: string | ReadableStream<Uint8Array>,
): Effect.Effect<string> =>
  typeof stream === "string"
    ? Effect.succeed(stream)
    : Effect.promise(() => new globalThis.Response(stream).text());

/**
 * Convert Effect Stream to ReadableStream for fetch.
 */
export const effectStreamToReadable = <Err>(
  stream: Stream.Stream<Uint8Array, Err>,
) => Stream.toReadableStream(stream);

/**
 * Check if a value is an Effect Stream.
 * Uses duck typing since Stream doesn't have a built-in type guard.
 */
export function isEffectStream(
  u: unknown,
): u is Stream.Stream<unknown, unknown, unknown> {
  return (
    u !== null &&
    typeof u === "object" &&
    Symbol.for("effect/Stream") in (u as object)
  );
}

/**
 * Convert various streaming input types to a format suitable for fetch.
 * Handles strings, Uint8Array, ArrayBuffer, Blob, ReadableStream, and Effect Stream.
 */
export function convertStreamingInput(
  value: string | StreamingInputBody,
): string | Uint8Array | ReadableStream<Uint8Array> {
  if (typeof value === "string") return value;
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (
    typeof globalThis.Blob !== "undefined" &&
    value instanceof globalThis.Blob
  ) {
    return value.stream();
  }
  if (value instanceof ReadableStream) return value;
  // Effect Stream - convert to ReadableStream
  return effectStreamToReadable(value as Stream.Stream<Uint8Array>);
}

/**
 * Create an Effect Stream from a ReadableStream (for streaming responses).
 */
export const readableToEffectStream = (
  stream: string | ReadableStream<Uint8Array>,
): Stream.Stream<Uint8Array, Error, never> =>
  typeof stream === "string"
    ? Stream.fromIterable([new TextEncoder().encode(stream)])
    : Stream.fromReadableStream(
        () => stream,
        (e) => new Error(String(e)),
      );

/**
 * Create a buffered ReadableStream that ensures chunks meet minimum size.
 * This matches AWS SDK's createBufferedReadableStream behavior.
 *
 * Small chunks are accumulated until they reach the minimum size.
 * Chunks already at or above minimum size pass through immediately (if buffer is empty).
 * The last chunk can be any size.
 */
export function createBufferedReadableStream(
  upstream: ReadableStream<Uint8Array>,
  minSize: number,
): ReadableStream<Uint8Array> {
  const reader = upstream.getReader();
  let buffer: Uint8Array[] = [];
  let bufferSize = 0;

  const flush = (): Uint8Array | null => {
    if (bufferSize === 0) return null;

    // Combine buffered chunks
    const combined = new Uint8Array(bufferSize);
    let offset = 0;
    for (const chunk of buffer) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    // Reset buffer
    buffer = [];
    bufferSize = 0;

    return combined;
  };

  const pull = async (
    controller: ReadableStreamDefaultController<Uint8Array>,
  ) => {
    const { value, done } = await reader.read();

    if (done) {
      // Flush any remaining buffered data
      const remainder = flush();
      if (remainder) {
        controller.enqueue(remainder);
      }
      controller.close();
      return;
    }

    const chunkSize = value.byteLength;

    // If chunk is large enough and buffer is empty, emit immediately
    if (chunkSize >= minSize && bufferSize === 0) {
      controller.enqueue(value);
      return;
    }

    // Add to buffer
    buffer.push(value);
    bufferSize += chunkSize;

    // If buffer is large enough, flush it
    if (bufferSize >= minSize) {
      const flushed = flush();
      if (flushed) {
        controller.enqueue(flushed);
      }
    } else {
      // Buffer not full yet, need to pull more data
      await pull(controller);
    }
  };

  return new ReadableStream({
    pull,
    cancel(reason) {
      reader.cancel(reason);
    },
  });
}

/**
 * Event Stream Parser
 *
 * Converts a ReadableStream of bytes into an Effect Stream of typed events.
 * Handles message framing, CRC validation, and event parsing.
 */

import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as Ref from "effect/Ref";
import * as Stream from "effect/Stream";
import {
  decodeMessage,
  EventParseError,
  EventStreamDecodeError,
  getMessageLength,
  parseEvent,
  type StreamEvent,
} from "./codec.ts";

// ============================================================================
// Parser Types
// ============================================================================

/** Errors that can occur during event stream parsing */
export type EventStreamParseError = EventStreamDecodeError | EventParseError;

// ============================================================================
// Stream Parser
// ============================================================================

/**
 * Parse a ReadableStream of bytes into an Effect Stream of events.
 *
 * This handles:
 * - Buffering partial messages
 * - Message framing and CRC validation
 * - Event type parsing
 */
export const parseEventStream = (
  input: ReadableStream<Uint8Array>,
): Stream.Stream<StreamEvent, EventStreamParseError> => {
  // Convert ReadableStream to Effect Stream of chunks
  const chunkStream: Stream.Stream<Uint8Array, EventStreamDecodeError> =
    Stream.unfoldEffect(
      input.getReader(),
      (
        reader,
      ): Effect.Effect<
        Option.Option<
          readonly [Uint8Array, ReadableStreamDefaultReader<Uint8Array>]
        >,
        EventStreamDecodeError
      > =>
        Effect.tryPromise({
          try: () => reader.read(),
          catch: (e) =>
            new EventStreamDecodeError({
              message: `Failed to read from stream: ${e}`,
            }),
        }).pipe(
          Effect.map((result) =>
            result.done
              ? Option.none()
              : Option.some([result.value, reader] as const),
          ),
        ),
    );

  // Process chunks with buffering to extract complete messages
  return Stream.unwrap(
    Effect.gen(function* () {
      // Create a mutable buffer ref
      const bufferRef = yield* Ref.make(new Uint8Array(0));

      return chunkStream.pipe(
        // Append each chunk to the buffer and extract complete messages
        Stream.mapEffect((chunk: Uint8Array) =>
          Effect.gen(function* () {
            // Append chunk to buffer
            const currentBuffer = yield* Ref.get(bufferRef);
            const newBuffer = new Uint8Array(
              currentBuffer.length + chunk.length,
            );
            newBuffer.set(currentBuffer);
            newBuffer.set(chunk, currentBuffer.length);
            yield* Ref.set(bufferRef, newBuffer);

            // Extract all complete messages
            const events: StreamEvent[] = [];
            let buffer = yield* Ref.get(bufferRef);

            while (true) {
              const messageLength = getMessageLength(buffer);
              if (messageLength === 0) {
                break;
              }

              // Extract and decode the message
              const messageData = buffer.subarray(0, messageLength);
              const [message] = yield* decodeMessage(messageData);

              // Parse the message into a typed event
              const event = yield* parseEvent(message);
              events.push(event);

              // Remove processed message from buffer
              buffer = buffer.subarray(messageLength);
            }

            // Update buffer with remaining data
            yield* Ref.set(bufferRef, buffer);

            return events;
          }),
        ),
        // Flatten the arrays of events
        Stream.flatMap((events) => Stream.fromIterable(events)),
        // Add finalizer to check for incomplete data
        Stream.concat(
          Stream.unwrap(
            Effect.gen(function* () {
              const remainingBuffer = yield* Ref.get(bufferRef);
              if (remainingBuffer.length > 0) {
                return Stream.fail(
                  new EventStreamDecodeError({
                    message: `Stream ended with ${remainingBuffer.length} bytes of incomplete message data`,
                  }),
                );
              }
              return Stream.empty;
            }),
          ),
        ),
      );
    }),
  );
};

// ============================================================================
// Event Stream to Union Transformation
// ============================================================================

/**
 * Parsed event in tagged union format: { EventType: payload }
 */
export type ParsedEvent = Record<string, unknown>;

/**
 * Payload parser function - protocol-specific (JSON, XML, etc.)
 */
export type PayloadParser = (payload: Uint8Array) => unknown;

/**
 * Default JSON payload parser
 */
export const jsonPayloadParser: PayloadParser = (payload: Uint8Array) => {
  const text = new TextDecoder().decode(payload);
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    // If payload isn't valid JSON, return as raw text
    return { payload: text };
  }
};

/**
 * Raw text payload parser - returns payload as { payload: string }
 * Useful when caller wants to handle parsing themselves
 */
export const rawPayloadParser: PayloadParser = (payload: Uint8Array) => {
  const text = new TextDecoder().decode(payload);
  return text ? { payload: text } : {};
};

/**
 * Transform a stream of StreamEvents into typed union members.
 *
 * Converts internal event types to the Smithy union format:
 * - MessageEvent → { eventType: parsedPayload }
 * - ExceptionEvent → { exceptionType: parsedPayload }
 * - ErrorEvent → { UnmodeledError: { errorCode, errorMessage } }
 *
 * @param eventStream - Stream of raw StreamEvents from parseEventStream
 * @param payloadParser - Function to parse the payload bytes (default: JSON)
 */
export const transformEventStreamToUnion = (
  eventStream: Stream.Stream<StreamEvent, EventStreamParseError>,
  payloadParser: PayloadParser = jsonPayloadParser,
): Stream.Stream<ParsedEvent, EventStreamParseError> =>
  eventStream.pipe(
    Stream.map((streamEvent) => {
      if (streamEvent._tag === "MessageEvent") {
        // Normal message event - parse payload and wrap in tagged union
        const eventType = streamEvent.eventType;
        const payload = payloadParser(streamEvent.payload);
        return { [eventType]: payload };
      } else if (streamEvent._tag === "ExceptionEvent") {
        // Modeled exception - parse payload and wrap in tagged union
        const errorType = streamEvent.exceptionType;
        const payload = payloadParser(streamEvent.payload);
        return { [errorType]: payload };
      } else {
        // ErrorEvent - unmodeled error, use standard structure
        return {
          UnmodeledError: {
            errorCode: streamEvent.errorCode,
            errorMessage: streamEvent.errorMessage,
          },
        };
      }
    }),
  );

/**
 * Parse a ReadableStream of bytes into a Stream of typed union events.
 *
 * This is the high-level API that combines:
 * 1. parseEventStream - decode wire format to StreamEvents
 * 2. transformEventStreamToUnion - convert to typed union members
 *
 * @param input - ReadableStream of event stream bytes
 * @param payloadParser - Function to parse event payloads (default: JSON)
 */
export const parseEventStreamToUnion = (
  input: ReadableStream<Uint8Array>,
  payloadParser: PayloadParser = jsonPayloadParser,
): Stream.Stream<ParsedEvent, EventStreamParseError> =>
  transformEventStreamToUnion(parseEventStream(input), payloadParser);

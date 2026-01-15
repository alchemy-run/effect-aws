/**
 * Event Stream Serializer
 *
 * Converts an Effect Stream of typed events into encoded bytes.
 * Supports both raw StreamEvent streams and typed input event streams.
 */

import * as Stream from "effect/Stream";
import {
  encodeEvent,
  type EventStreamEncodeError,
  type Headers,
  type MessageEvent,
  type StreamEvent,
} from "./codec.ts";

// ============================================================================
// Serializer Types
// ============================================================================

/** Errors that can occur during event stream serialization */
export type EventStreamSerializeError = EventStreamEncodeError;

// ============================================================================
// Stream Serializer
// ============================================================================

/**
 * Serialize an Effect Stream of events into a Stream of encoded bytes.
 */
export const serializeEventStream = (
  events: Stream.Stream<StreamEvent, EventStreamSerializeError>,
): Stream.Stream<Uint8Array, EventStreamSerializeError> => {
  return Stream.mapEffect(events, encodeEvent);
};

// ============================================================================
// Input Event Stream Serialization
// ============================================================================

/**
 * Input event type - represents an event from a union type.
 *
 * Supports two formats:
 * 1. Tagged format: { _tag: "EventName", ...properties }
 * 2. Smithy union format: { EventName: { ...properties } }
 */
export interface InputEvent {
  readonly _tag?: string;
  [key: string]: unknown;
}

/**
 * Extract event type and payload from an input event.
 * Handles both _tag format and Smithy union format.
 */
function extractEventTypeAndPayload(event: InputEvent): {
  eventType: string;
  payload: unknown;
} {
  // Check for _tag format first
  if (event._tag) {
    const { _tag, ...payload } = event;
    return { eventType: _tag, payload };
  }

  // Smithy union format: { EventName: { ...properties } }
  const keys = Object.keys(event);
  if (keys.length === 1) {
    const eventType = keys[0];
    const innerValue = event[eventType];
    return { eventType, payload: innerValue };
  }

  // Fallback: use "Unknown" as event type
  return { eventType: "Unknown", payload: event };
}

/**
 * Serialize a typed input event (from a union) into a StreamEvent.
 * Converts the event's type to the event type header and serializes
 * the payload as JSON.
 *
 * @param event - The typed event (either _tag or Smithy union format)
 * @param contentType - The content type for the payload (default: application/json)
 * @returns A MessageEvent ready for wire serialization
 */
export const serializeInputEvent = (
  event: InputEvent,
  contentType: string = "application/json",
): MessageEvent => {
  const { eventType, payload } = extractEventTypeAndPayload(event);

  // Create JSON payload from event properties
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));

  return {
    _tag: "MessageEvent",
    eventType,
    contentType,
    payload: payloadBytes,
    headers: {},
  };
};

/**
 * Serialize an Effect Stream of typed events into a ReadableStream of bytes.
 * This is the main entry point for input event stream serialization.
 *
 * For input event streams (like Transcribe's AudioStream), this:
 * 1. Takes each typed event from the stream
 * 2. Converts it to event stream wire format with proper headers
 * 3. Returns a ReadableStream suitable for HTTP request body
 *
 * @param events - Stream of typed events (with _tag property)
 * @param contentType - Content type for JSON payloads
 * @returns ReadableStream of encoded event stream bytes
 */
export const serializeInputEventStream = <E extends InputEvent>(
  events: Stream.Stream<E, unknown>,
  contentType: string = "application/json",
): ReadableStream<Uint8Array> => {
  // Convert typed events to StreamEvents, then encode to bytes
  const byteStream = events.pipe(
    Stream.map((event) => serializeInputEvent(event, contentType)),
    Stream.mapEffect(encodeEvent),
  );

  return Stream.toReadableStream(byteStream);
};

/**
 * Serialize a typed input event with a specific eventPayload member.
 * Used for events that have an @eventPayload member (like AudioEvent with AudioChunk).
 *
 * @param event - The typed event (either _tag or Smithy union format)
 * @param payloadMemberName - The name of the @eventPayload member (e.g., "AudioChunk")
 * @param contentType - The content type for binary payloads (default: application/octet-stream)
 * @returns A MessageEvent ready for wire serialization
 */
export const serializeInputEventWithPayload = (
  event: InputEvent,
  payloadMemberName: string,
  contentType: string = "application/octet-stream",
): MessageEvent => {
  const { eventType, payload: innerPayload } =
    extractEventTypeAndPayload(event);

  // For Smithy format, innerPayload is the event object itself
  // Extract the payload member from it
  const payloadSource =
    innerPayload && typeof innerPayload === "object"
      ? (innerPayload as Record<string, unknown>)
      : event;
  const payloadValue = payloadSource[payloadMemberName];

  // Get the payload bytes
  let payloadBytes: Uint8Array;
  if (payloadValue instanceof Uint8Array) {
    payloadBytes = payloadValue;
  } else if (typeof payloadValue === "string") {
    payloadBytes = new TextEncoder().encode(payloadValue);
  } else if (payloadValue === undefined || payloadValue === null) {
    payloadBytes = new Uint8Array(0);
  } else {
    // Fallback to JSON for complex types
    payloadBytes = new TextEncoder().encode(JSON.stringify(payloadValue));
  }

  // Build custom headers from non-payload members that have eventHeader trait
  // For now, we just pass the event type
  const headers: Headers = {};

  return {
    _tag: "MessageEvent",
    eventType,
    contentType,
    payload: payloadBytes,
    headers,
  };
};

/**
 * Serialize a stream of events where events may have @eventPayload members.
 * This handles the case where some event types have binary payloads (like AudioEvent)
 * while others have JSON payloads (like ConfigurationEvent).
 *
 * @param events - Stream of typed events
 * @param eventPayloadMap - Map of event type (name) to its payload member name, if any
 * @returns ReadableStream of encoded event stream bytes
 */
export const serializeInputEventStreamWithPayloads = <E extends InputEvent>(
  events: Stream.Stream<E, unknown>,
  eventPayloadMap: Record<string, string>,
): ReadableStream<Uint8Array> => {
  const byteStream = events.pipe(
    Stream.map((event) => {
      // Extract event type for lookup (handles both _tag and Smithy formats)
      const { eventType } = extractEventTypeAndPayload(event);
      const payloadMember = eventPayloadMap[eventType];
      if (payloadMember) {
        return serializeInputEventWithPayload(event, payloadMember);
      }
      return serializeInputEvent(event);
    }),
    Stream.mapEffect(encodeEvent),
  );

  return Stream.toReadableStream(byteStream);
};

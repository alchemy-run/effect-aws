/**
 * Amazon Event Stream Codec
 *
 * Implements the binary message framing for event streams as specified in:
 * https://docs.aws.amazon.com/transcribe/latest/dg/streaming-format.html
 *
 * Message format:
 * - Prelude: total_length (4) + headers_length (4) + prelude_crc (4)
 * - Data: headers (variable) + payload (variable) + message_crc (4)
 *
 * Also provides the semantic event layer:
 * - Message events: normal event data (:message-type: event)
 * - Modeled error events: schema-defined errors (:message-type: exception)
 * - Unmodeled error events: unexpected errors (:message-type: error)
 */

import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import { getCrc32ChecksumAlgorithmFunction } from "../hash/crc32.ts";

// ============================================================================
// Constants
// ============================================================================

/** Prelude is 12 bytes: total_length (4) + headers_length (4) + prelude_crc (4) */
const PRELUDE_LENGTH = 12;
/** Message CRC is 4 bytes at the end */
const MESSAGE_CRC_LENGTH = 4;
/** Minimum message size: prelude + message_crc with no headers or payload */
const MIN_MESSAGE_LENGTH = PRELUDE_LENGTH + MESSAGE_CRC_LENGTH;
/** Maximum payload size: 24 MB */
const MAX_PAYLOAD_LENGTH = 25_165_824;
/** Maximum headers size: 128 KB */
const MAX_HEADERS_LENGTH = 131_072;

/** Standard event stream header names */
export const HEADER_MESSAGE_TYPE = ":message-type";
export const HEADER_EVENT_TYPE = ":event-type";
export const HEADER_EXCEPTION_TYPE = ":exception-type";
export const HEADER_ERROR_CODE = ":error-code";
export const HEADER_ERROR_MESSAGE = ":error-message";
export const HEADER_CONTENT_TYPE = ":content-type";

/** Special event types for RPC protocol initial messages */
export const INITIAL_REQUEST_EVENT_TYPE = "initial-request";
export const INITIAL_RESPONSE_EVENT_TYPE = "initial-response";

// ============================================================================
// Errors
// ============================================================================

/** Error decoding an event stream message */
export class EventStreamDecodeError extends Data.TaggedError(
  "EventStreamDecodeError",
)<{
  message: string;
}> {}

/** Error encoding an event stream message */
export class EventStreamEncodeError extends Data.TaggedError(
  "EventStreamEncodeError",
)<{
  message: string;
}> {}

/** Error parsing an event from a message */
export class EventParseError extends Data.TaggedError("EventParseError")<{
  message: string;
}> {}

// ============================================================================
// Header Value Types
// ============================================================================

/** Header type indicators as defined in the spec */
export enum HeaderType {
  BoolTrue = 0,
  BoolFalse = 1,
  Byte = 2,
  Short = 3,
  Int = 4,
  Long = 5,
  ByteArray = 6,
  String = 7,
  Timestamp = 8,
  Uuid = 9,
}

/** Header value type discriminated union */
export type HeaderValue =
  | { type: HeaderType.BoolTrue; value: true }
  | { type: HeaderType.BoolFalse; value: false }
  | { type: HeaderType.Byte; value: number }
  | { type: HeaderType.Short; value: number }
  | { type: HeaderType.Int; value: number }
  | { type: HeaderType.Long; value: bigint }
  | { type: HeaderType.ByteArray; value: Uint8Array }
  | { type: HeaderType.String; value: string }
  | { type: HeaderType.Timestamp; value: Date }
  | { type: HeaderType.Uuid; value: Uint8Array };

/** Headers are a record of name to typed value */
export type Headers = Record<string, HeaderValue>;

// ============================================================================
// Message Structure
// ============================================================================

/** A decoded event stream message */
export interface Message {
  headers: Headers;
  payload: Uint8Array;
}

// ============================================================================
// Event Types (Semantic Layer)
// ============================================================================

/** Message type header values */
export type MessageType = "event" | "exception" | "error";

/**
 * A message event - normal event data from the stream
 */
export interface MessageEvent {
  readonly _tag: "MessageEvent";
  /** The event type name (from :event-type header) */
  readonly eventType: string;
  /** The content type (from :content-type header), e.g., "application/json" */
  readonly contentType?: string;
  /** The event payload */
  readonly payload: Uint8Array;
  /** Additional custom headers */
  readonly headers: Headers;
}

/**
 * A modeled exception event - schema-defined error from the stream
 */
export interface ExceptionEvent {
  readonly _tag: "ExceptionEvent";
  /** The exception type name (from :exception-type header) */
  readonly exceptionType: string;
  /** The content type (from :content-type header) */
  readonly contentType?: string;
  /** The exception payload (usually JSON with error details) */
  readonly payload: Uint8Array;
  /** Additional custom headers */
  readonly headers: Headers;
}

/**
 * An unmodeled error event - unexpected error from the stream
 */
export interface ErrorEvent {
  readonly _tag: "ErrorEvent";
  /** The error code (from :error-code header) */
  readonly errorCode: string;
  /** The error message (from :error-message header) */
  readonly errorMessage: string;
  /** Additional custom headers */
  readonly headers: Headers;
}

/**
 * Discriminated union of all event types
 */
export type StreamEvent = MessageEvent | ExceptionEvent | ErrorEvent;

// ============================================================================
// CRC32 Computation
// ============================================================================

/**
 * Compute CRC32 checksum of data
 */
const computeCrc32 = (data: Uint8Array): Effect.Effect<number> =>
  Effect.promise(async () => {
    const Crc32 = getCrc32ChecksumAlgorithmFunction();
    const hasher = new Crc32();
    hasher.update(data);
    const digest = await hasher.digest();
    // Convert 4-byte digest to uint32 (>>> 0 ensures unsigned)
    return (
      ((digest[0] << 24) | (digest[1] << 16) | (digest[2] << 8) | digest[3]) >>>
      0
    );
  });

// ============================================================================
// Header Helpers
// ============================================================================

/** Create a string header value */
export function stringHeader(value: string): HeaderValue {
  return { type: HeaderType.String, value };
}

/** Get a header value as string, or undefined if not present or wrong type */
export function getStringHeader(
  headers: Headers,
  name: string,
): string | undefined {
  const value = headers[name];
  if (value?.type === HeaderType.String) {
    return value.value;
  }
  return undefined;
}

// ============================================================================
// Encoding
// ============================================================================

/**
 * Encode a header value to bytes
 */
function encodeHeaderValue(value: HeaderValue): Uint8Array {
  switch (value.type) {
    case HeaderType.BoolTrue:
    case HeaderType.BoolFalse:
      return new Uint8Array([value.type]);

    case HeaderType.Byte: {
      const buf = new Uint8Array(2);
      buf[0] = value.type;
      buf[1] = value.value & 0xff;
      return buf;
    }

    case HeaderType.Short: {
      const buf = new Uint8Array(3);
      buf[0] = value.type;
      new DataView(buf.buffer).setInt16(1, value.value, false);
      return buf;
    }

    case HeaderType.Int: {
      const buf = new Uint8Array(5);
      buf[0] = value.type;
      new DataView(buf.buffer).setInt32(1, value.value, false);
      return buf;
    }

    case HeaderType.Long: {
      const buf = new Uint8Array(9);
      buf[0] = value.type;
      new DataView(buf.buffer).setBigInt64(1, value.value, false);
      return buf;
    }

    case HeaderType.ByteArray: {
      const buf = new Uint8Array(3 + value.value.length);
      buf[0] = value.type;
      new DataView(buf.buffer).setUint16(1, value.value.length, false);
      buf.set(value.value, 3);
      return buf;
    }

    case HeaderType.String: {
      const encoded = new TextEncoder().encode(value.value);
      const buf = new Uint8Array(3 + encoded.length);
      buf[0] = value.type;
      new DataView(buf.buffer).setUint16(1, encoded.length, false);
      buf.set(encoded, 3);
      return buf;
    }

    case HeaderType.Timestamp: {
      const buf = new Uint8Array(9);
      buf[0] = value.type;
      // Timestamp is milliseconds since epoch
      new DataView(buf.buffer).setBigInt64(
        1,
        BigInt(value.value.getTime()),
        false,
      );
      return buf;
    }

    case HeaderType.Uuid: {
      const buf = new Uint8Array(17);
      buf[0] = value.type;
      buf.set(value.value, 1);
      return buf;
    }
  }
}

/**
 * Encode headers to bytes
 */
function encodeHeaders(
  headers: Headers,
): Effect.Effect<Uint8Array, EventStreamEncodeError> {
  return Effect.gen(function* () {
    const parts: Uint8Array[] = [];

    for (const [name, value] of Object.entries(headers)) {
      const nameBytes = new TextEncoder().encode(name);
      if (nameBytes.length === 0 || nameBytes.length > 255) {
        return yield* new EventStreamEncodeError({
          message: `Header name must be 1-255 bytes: ${name}`,
        });
      }

      // Name length (1 byte) + name + value
      const valueBytes = encodeHeaderValue(value);
      const header = new Uint8Array(1 + nameBytes.length + valueBytes.length);
      header[0] = nameBytes.length;
      header.set(nameBytes, 1);
      header.set(valueBytes, 1 + nameBytes.length);
      parts.push(header);
    }

    // Concatenate all headers
    const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const part of parts) {
      result.set(part, offset);
      offset += part.length;
    }

    if (result.length > MAX_HEADERS_LENGTH) {
      return yield* new EventStreamEncodeError({
        message: `Headers exceed maximum length: ${result.length} > ${MAX_HEADERS_LENGTH}`,
      });
    }

    return result;
  });
}

/**
 * Encode a message to the wire format
 */
export const encodeMessage = (
  message: Message,
): Effect.Effect<Uint8Array, EventStreamEncodeError> =>
  Effect.gen(function* () {
    const headersBytes = yield* encodeHeaders(message.headers);
    const payload = message.payload;

    if (payload.length > MAX_PAYLOAD_LENGTH) {
      return yield* new EventStreamEncodeError({
        message: `Payload exceeds maximum length: ${payload.length} > ${MAX_PAYLOAD_LENGTH}`,
      });
    }

    // Calculate total length
    const totalLength =
      PRELUDE_LENGTH +
      headersBytes.length +
      payload.length +
      MESSAGE_CRC_LENGTH;

    // Build the message
    const result = new Uint8Array(totalLength);
    const view = new DataView(result.buffer);

    // Write prelude (without CRC)
    view.setUint32(0, totalLength, false);
    view.setUint32(4, headersBytes.length, false);

    // Compute and write prelude CRC
    const preludeCrc = yield* computeCrc32(result.subarray(0, 8));
    view.setUint32(8, preludeCrc, false);

    // Write headers and payload
    result.set(headersBytes, PRELUDE_LENGTH);
    result.set(payload, PRELUDE_LENGTH + headersBytes.length);

    // Compute and write message CRC (over entire message except the CRC itself)
    const messageCrc = yield* computeCrc32(
      result.subarray(0, totalLength - MESSAGE_CRC_LENGTH),
    );
    view.setUint32(totalLength - MESSAGE_CRC_LENGTH, messageCrc, false);

    return result;
  });

// ============================================================================
// Decoding
// ============================================================================

/**
 * Decode a header value from bytes
 * Returns the value and the number of bytes consumed
 */
function decodeHeaderValue(
  data: Uint8Array,
  offset: number,
): Effect.Effect<[HeaderValue, number], EventStreamDecodeError> {
  return Effect.gen(function* () {
    const type = data[offset] as HeaderType;
    const view = new DataView(data.buffer, data.byteOffset + offset);

    switch (type) {
      case HeaderType.BoolTrue:
        return [{ type: HeaderType.BoolTrue, value: true }, 1] as [
          HeaderValue,
          number,
        ];

      case HeaderType.BoolFalse:
        return [{ type: HeaderType.BoolFalse, value: false }, 1] as [
          HeaderValue,
          number,
        ];

      case HeaderType.Byte:
        return [{ type: HeaderType.Byte, value: view.getInt8(1) }, 2] as [
          HeaderValue,
          number,
        ];

      case HeaderType.Short:
        return [
          { type: HeaderType.Short, value: view.getInt16(1, false) },
          3,
        ] as [HeaderValue, number];

      case HeaderType.Int:
        return [
          { type: HeaderType.Int, value: view.getInt32(1, false) },
          5,
        ] as [HeaderValue, number];

      case HeaderType.Long:
        return [
          { type: HeaderType.Long, value: view.getBigInt64(1, false) },
          9,
        ] as [HeaderValue, number];

      case HeaderType.ByteArray: {
        const length = view.getUint16(1, false);
        const value = data.slice(offset + 3, offset + 3 + length);
        return [{ type: HeaderType.ByteArray, value }, 3 + length] as [
          HeaderValue,
          number,
        ];
      }

      case HeaderType.String: {
        const length = view.getUint16(1, false);
        const value = new TextDecoder().decode(
          data.subarray(offset + 3, offset + 3 + length),
        );
        return [{ type: HeaderType.String, value }, 3 + length] as [
          HeaderValue,
          number,
        ];
      }

      case HeaderType.Timestamp: {
        const millis = view.getBigInt64(1, false);
        return [
          { type: HeaderType.Timestamp, value: new Date(Number(millis)) },
          9,
        ] as [HeaderValue, number];
      }

      case HeaderType.Uuid: {
        const value = data.slice(offset + 1, offset + 17);
        return [{ type: HeaderType.Uuid, value }, 17] as [HeaderValue, number];
      }

      default:
        return yield* new EventStreamDecodeError({
          message: `Unknown header type: ${type}`,
        });
    }
  });
}

/**
 * Decode headers from bytes
 */
function decodeHeaders(
  data: Uint8Array,
): Effect.Effect<Headers, EventStreamDecodeError> {
  return Effect.gen(function* () {
    const headers: Headers = {};
    let offset = 0;

    while (offset < data.length) {
      // Read name length and name
      const nameLength = data[offset];
      const name = new TextDecoder().decode(
        data.subarray(offset + 1, offset + 1 + nameLength),
      );
      offset += 1 + nameLength;

      // Read value
      const [value, consumed] = yield* decodeHeaderValue(data, offset);
      offset += consumed;

      headers[name] = value;
    }

    return headers;
  });
}

/**
 * Decode a single message from bytes
 * Returns the message and the total bytes consumed
 */
export const decodeMessage = (
  data: Uint8Array,
): Effect.Effect<[Message, number], EventStreamDecodeError> =>
  Effect.gen(function* () {
    if (data.length < MIN_MESSAGE_LENGTH) {
      return yield* new EventStreamDecodeError({
        message: `Message too short: ${data.length} < ${MIN_MESSAGE_LENGTH}`,
      });
    }

    const view = new DataView(data.buffer, data.byteOffset);

    // Read prelude
    const totalLength = view.getUint32(0, false);
    const headersLength = view.getUint32(4, false);
    const preludeCrc = view.getUint32(8, false);

    if (data.length < totalLength) {
      return yield* new EventStreamDecodeError({
        message: `Incomplete message: have ${data.length}, need ${totalLength}`,
      });
    }

    // Validate prelude CRC
    const computedPreludeCrc = yield* computeCrc32(data.subarray(0, 8));
    if (computedPreludeCrc !== preludeCrc) {
      return yield* new EventStreamDecodeError({
        message: `Prelude CRC mismatch: expected ${preludeCrc}, got ${computedPreludeCrc}`,
      });
    }

    // Validate message CRC
    const messageCrc = new DataView(
      data.buffer,
      data.byteOffset + totalLength - MESSAGE_CRC_LENGTH,
    ).getUint32(0, false);
    const computedMessageCrc = yield* computeCrc32(
      data.subarray(0, totalLength - MESSAGE_CRC_LENGTH),
    );
    if (computedMessageCrc !== messageCrc) {
      return yield* new EventStreamDecodeError({
        message: `Message CRC mismatch: expected ${messageCrc}, got ${computedMessageCrc}`,
      });
    }

    // Extract headers and payload
    const headersData = data.subarray(
      PRELUDE_LENGTH,
      PRELUDE_LENGTH + headersLength,
    );
    const payloadLength =
      totalLength - PRELUDE_LENGTH - headersLength - MESSAGE_CRC_LENGTH;
    const payload = data.subarray(
      PRELUDE_LENGTH + headersLength,
      PRELUDE_LENGTH + headersLength + payloadLength,
    );

    const headers = yield* decodeHeaders(headersData);

    return [{ headers, payload }, totalLength] as [Message, number];
  });

/**
 * Check if we have a complete message in the buffer
 * Returns the total message length if complete, or 0 if incomplete
 */
export function getMessageLength(data: Uint8Array): number {
  if (data.length < PRELUDE_LENGTH) {
    return 0;
  }

  const view = new DataView(data.buffer, data.byteOffset);
  const totalLength = view.getUint32(0, false);

  if (data.length < totalLength) {
    return 0;
  }

  return totalLength;
}

// ============================================================================
// Event Parsing
// ============================================================================

/**
 * Parse a raw message into a typed event
 */
export const parseEvent = (
  message: Message,
): Effect.Effect<StreamEvent, EventParseError> =>
  Effect.gen(function* () {
    const { headers, payload } = message;

    // Get the message type
    const messageType = getStringHeader(headers, HEADER_MESSAGE_TYPE);
    if (!messageType) {
      return yield* new EventParseError({
        message: `Missing ${HEADER_MESSAGE_TYPE} header`,
      });
    }

    switch (messageType) {
      case "event": {
        const eventType = getStringHeader(headers, HEADER_EVENT_TYPE);
        if (!eventType) {
          return yield* new EventParseError({
            message: `Missing ${HEADER_EVENT_TYPE} header for event message`,
          });
        }

        return {
          _tag: "MessageEvent",
          eventType,
          contentType: getStringHeader(headers, HEADER_CONTENT_TYPE),
          payload,
          headers,
        } satisfies MessageEvent;
      }

      case "exception": {
        const exceptionType = getStringHeader(headers, HEADER_EXCEPTION_TYPE);
        if (!exceptionType) {
          return yield* new EventParseError({
            message: `Missing ${HEADER_EXCEPTION_TYPE} header for exception message`,
          });
        }

        return {
          _tag: "ExceptionEvent",
          exceptionType,
          contentType: getStringHeader(headers, HEADER_CONTENT_TYPE),
          payload,
          headers,
        } satisfies ExceptionEvent;
      }

      case "error": {
        const errorCode = getStringHeader(headers, HEADER_ERROR_CODE);
        const errorMessage = getStringHeader(headers, HEADER_ERROR_MESSAGE);

        if (!errorCode) {
          return yield* new EventParseError({
            message: `Missing ${HEADER_ERROR_CODE} header for error message`,
          });
        }
        if (!errorMessage) {
          return yield* new EventParseError({
            message: `Missing ${HEADER_ERROR_MESSAGE} header for error message`,
          });
        }

        return {
          _tag: "ErrorEvent",
          errorCode,
          errorMessage,
          headers,
        } satisfies ErrorEvent;
      }

      default:
        return yield* new EventParseError({
          message: `Unknown message type: ${messageType}`,
        });
    }
  });

// ============================================================================
// Event Encoding
// ============================================================================

/**
 * Encode a StreamEvent into wire format bytes
 */
export const encodeEvent = (
  event: StreamEvent,
): Effect.Effect<Uint8Array, EventStreamEncodeError> => {
  switch (event._tag) {
    case "MessageEvent": {
      const headers: Headers = {
        [HEADER_MESSAGE_TYPE]: stringHeader("event"),
        [HEADER_EVENT_TYPE]: stringHeader(event.eventType),
        ...event.headers,
      };

      if (event.contentType) {
        headers[HEADER_CONTENT_TYPE] = stringHeader(event.contentType);
      }

      return encodeMessage({ headers, payload: event.payload });
    }

    case "ExceptionEvent": {
      const headers: Headers = {
        [HEADER_MESSAGE_TYPE]: stringHeader("exception"),
        [HEADER_EXCEPTION_TYPE]: stringHeader(event.exceptionType),
        ...event.headers,
      };

      if (event.contentType) {
        headers[HEADER_CONTENT_TYPE] = stringHeader(event.contentType);
      }

      return encodeMessage({ headers, payload: event.payload });
    }

    case "ErrorEvent": {
      const headers: Headers = {
        [HEADER_MESSAGE_TYPE]: stringHeader("error"),
        [HEADER_ERROR_CODE]: stringHeader(event.errorCode),
        [HEADER_ERROR_MESSAGE]: stringHeader(event.errorMessage),
        ...event.headers,
      };

      return encodeMessage({ headers, payload: new Uint8Array(0) });
    }
  }
};

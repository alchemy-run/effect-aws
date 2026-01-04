/**
 * Tests for bi-directional event stream support.
 *
 * These tests verify that:
 * 1. Input event streams are properly serialized to wire format
 * 2. Output event streams are properly parsed from wire format
 * 3. Events with @eventPayload are handled correctly
 */

import { it } from "@effect/vitest";
import { Effect, Stream } from "effect";
import { describe, expect } from "vitest";
import {
  decodeMessage,
  encodeEvent,
  getStringHeader,
  HEADER_CONTENT_TYPE,
  HEADER_EVENT_TYPE,
  HEADER_MESSAGE_TYPE,
  type MessageEvent,
} from "../../src/eventstream/codec.ts";
import {
  serializeInputEvent,
  serializeInputEventStream,
  serializeInputEventStreamWithPayloads,
  serializeInputEventWithPayload,
  type InputEvent,
} from "../../src/eventstream/serializer.ts";
import {
  AudioEvent,
  AudioStream,
} from "../../src/services/transcribe-streaming.ts";
import { isInputEventStream, isStreamingType } from "../../src/traits.ts";

// Helper to read all chunks from a ReadableStream
const readAllChunks = (stream: ReadableStream<Uint8Array>) =>
  Effect.promise(async () => {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;
    while (!done) {
      const result = await reader.read();
      if (result.done) {
        done = true;
      } else {
        chunks.push(result.value);
      }
    }
    return chunks;
  });

describe("Input Event Serialization", () => {
  it.effect("should serialize a simple event to JSON payload", () =>
    Effect.gen(function* () {
      const event: InputEvent = {
        _tag: "ConfigurationEvent",
        ChannelDefinitions: [{ ChannelId: 0, ParticipantRole: "AGENT" }],
      };

      const messageEvent = serializeInputEvent(event);

      expect(messageEvent._tag).toBe("MessageEvent");
      expect(messageEvent.eventType).toBe("ConfigurationEvent");
      expect(messageEvent.contentType).toBe("application/json");

      // Parse the payload
      const payloadText = new TextDecoder().decode(messageEvent.payload);
      const parsedPayload = JSON.parse(payloadText);

      expect(parsedPayload).toEqual({
        ChannelDefinitions: [{ ChannelId: 0, ParticipantRole: "AGENT" }],
      });
    }),
  );

  it.effect("should serialize an event with binary payload", () =>
    Effect.gen(function* () {
      const audioData = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);
      const event: InputEvent = {
        _tag: "AudioEvent",
        AudioChunk: audioData,
      };

      const messageEvent = serializeInputEventWithPayload(
        event,
        "AudioChunk",
        "application/octet-stream",
      );

      expect(messageEvent._tag).toBe("MessageEvent");
      expect(messageEvent.eventType).toBe("AudioEvent");
      expect(messageEvent.contentType).toBe("application/octet-stream");
      expect(messageEvent.payload).toEqual(audioData);
    }),
  );

  it.effect(
    "should encode a MessageEvent to wire format and decode it back",
    () =>
      Effect.gen(function* () {
        const event: MessageEvent = {
          _tag: "MessageEvent",
          eventType: "TestEvent",
          contentType: "application/json",
          payload: new TextEncoder().encode('{"foo":"bar"}'),
          headers: {},
        };

        // Encode to wire format
        const encodedBytes = yield* encodeEvent(event);
        expect(encodedBytes).toBeInstanceOf(Uint8Array);
        expect(encodedBytes.length).toBeGreaterThan(16); // At least prelude + CRC

        // Decode it back
        const [decodedMessage] = yield* decodeMessage(encodedBytes);

        // Verify headers
        expect(
          getStringHeader(decodedMessage.headers, HEADER_MESSAGE_TYPE),
        ).toBe("event");
        expect(getStringHeader(decodedMessage.headers, HEADER_EVENT_TYPE)).toBe(
          "TestEvent",
        );
        expect(
          getStringHeader(decodedMessage.headers, HEADER_CONTENT_TYPE),
        ).toBe("application/json");

        // Verify payload
        const payloadText = new TextDecoder().decode(decodedMessage.payload);
        expect(payloadText).toBe('{"foo":"bar"}');
      }),
  );
});

describe("Input Event Stream Serialization", () => {
  it.effect("should serialize a stream of events to ReadableStream", () =>
    Effect.gen(function* () {
      const events: InputEvent[] = [
        { _tag: "Event1", data: "first" },
        { _tag: "Event2", data: "second" },
        { _tag: "Event3", data: "third" },
      ];

      const eventStream = Stream.fromIterable(events);
      const readableStream = serializeInputEventStream(eventStream);

      const chunks = yield* readAllChunks(readableStream);
      expect(chunks.length).toBe(3);

      // Verify each chunk decodes to a valid message
      for (let i = 0; i < chunks.length; i++) {
        const [message] = yield* decodeMessage(chunks[i]);
        expect(getStringHeader(message.headers, HEADER_MESSAGE_TYPE)).toBe(
          "event",
        );
        expect(getStringHeader(message.headers, HEADER_EVENT_TYPE)).toBe(
          events[i]._tag,
        );

        const payloadText = new TextDecoder().decode(message.payload);
        const parsed = JSON.parse(payloadText);
        expect(parsed.data).toBe(events[i].data);
      }
    }),
  );

  it.effect(
    "should serialize events with eventPayload members using binary payload",
    () =>
      Effect.gen(function* () {
        const events: InputEvent[] = [
          { _tag: "AudioEvent", AudioChunk: new Uint8Array([1, 2, 3, 4]) },
          { _tag: "ConfigEvent", setting: "value" },
        ];

        const eventPayloadMap = {
          AudioEvent: "AudioChunk",
        };

        const eventStream = Stream.fromIterable(events);
        const readableStream = serializeInputEventStreamWithPayloads(
          eventStream,
          eventPayloadMap,
        );

        const chunks = yield* readAllChunks(readableStream);
        expect(chunks.length).toBe(2);

        // First event should have binary payload
        const [msg1] = yield* decodeMessage(chunks[0]);
        expect(getStringHeader(msg1.headers, HEADER_EVENT_TYPE)).toBe(
          "AudioEvent",
        );
        expect(getStringHeader(msg1.headers, HEADER_CONTENT_TYPE)).toBe(
          "application/octet-stream",
        );
        expect(msg1.payload).toEqual(new Uint8Array([1, 2, 3, 4]));

        // Second event should have JSON payload
        const [msg2] = yield* decodeMessage(chunks[1]);
        expect(getStringHeader(msg2.headers, HEADER_EVENT_TYPE)).toBe(
          "ConfigEvent",
        );
        expect(getStringHeader(msg2.headers, HEADER_CONTENT_TYPE)).toBe(
          "application/json",
        );
        const parsed = JSON.parse(new TextDecoder().decode(msg2.payload));
        expect(parsed.setting).toBe("value");
      }),
  );
});

describe("Transcribe Streaming Event Simulation", () => {
  it.effect("should create AudioStream events matching Transcribe format", () =>
    Effect.gen(function* () {
      // Simulate audio data chunks
      const audioChunk1 = new Uint8Array(1600); // 100ms of 16kHz mono audio
      const audioChunk2 = new Uint8Array(1600);

      // Create events as Transcribe expects them
      const audioEvents: InputEvent[] = [
        { _tag: "AudioEvent", AudioChunk: audioChunk1 },
        { _tag: "AudioEvent", AudioChunk: audioChunk2 },
      ];

      const eventPayloadMap = { AudioEvent: "AudioChunk" };

      const eventStream = Stream.fromIterable(audioEvents);
      const readableStream = serializeInputEventStreamWithPayloads(
        eventStream,
        eventPayloadMap,
      );

      const chunks = yield* readAllChunks(readableStream);
      expect(chunks.length).toBe(2);

      // Verify first audio event
      const [msg] = yield* decodeMessage(chunks[0]);
      expect(getStringHeader(msg.headers, HEADER_MESSAGE_TYPE)).toBe("event");
      expect(getStringHeader(msg.headers, HEADER_EVENT_TYPE)).toBe(
        "AudioEvent",
      );
      expect(msg.payload.length).toBe(1600);
    }),
  );
});

describe("Transcribe Streaming Schema Integration", () => {
  it.effect("should create AudioEvent instances with correct structure", () =>
    Effect.gen(function* () {
      const audioData = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);
      const audioEvent = new AudioEvent({ AudioChunk: audioData });

      // Verify the AudioEvent class creates the right structure
      expect(audioEvent.AudioChunk).toEqual(audioData);
      expect(audioEvent).toBeInstanceOf(AudioEvent);
    }),
  );

  it.effect("should detect AudioStream as input event stream type", () =>
    Effect.gen(function* () {
      // The AudioStream should be detected as a streaming type
      const ast = AudioStream.ast;
      expect(isStreamingType(ast)).toBe(true);

      // AudioStream is now correctly generated with T.InputEventStream
      expect(isInputEventStream(ast)).toBe(true);
    }),
  );
});

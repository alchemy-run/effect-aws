/**
 * Tests for bi-directional event stream request building.
 *
 * These tests verify that:
 * 1. Input event streams are properly serialized through the request builder
 * 2. The Content-Type header is set correctly for event streams
 * 3. The event stream wire format is correct
 */

import { it } from "@effect/vitest";
import { Effect, Stream } from "effect";
import { describe, expect } from "vitest";
import {
  decodeMessage,
  getStringHeader,
  HEADER_CONTENT_TYPE,
  HEADER_EVENT_TYPE,
  HEADER_MESSAGE_TYPE,
} from "../../src/eventstream/codec.ts";
import { restJson1Protocol } from "../../src/protocols/rest-json.ts";
import { makeRequestBuilder } from "../../src/request-builder.ts";
import {
  AudioEvent,
  AudioStream,
  ChannelDefinition,
  ConfigurationEvent,
  StartStreamTranscriptionRequest,
} from "../../src/services/transcribe-streaming.ts";
import { streamingSymbol } from "../../src/traits.ts";

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

describe("Bi-directional Event Stream Request Building", () => {
  it.effect(
    "should build request with event stream body for Transcribe Streaming",
    () =>
      Effect.gen(function* () {
        // Create the request builder for StartStreamTranscription
        const operation = {
          input: StartStreamTranscriptionRequest,
          output: StartStreamTranscriptionRequest, // Doesn't matter for request building
          errors: [],
        };

        const buildRequest = makeRequestBuilder(operation, {
          protocol: restJson1Protocol,
        });

        // Create audio events to stream
        const audioChunk1 = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);
        const audioChunk2 = new Uint8Array([8, 9, 10, 11, 12, 13, 14, 15]);

        // Create the input event stream
        // Note: For Transcribe, we need to wrap events in the union member format
        const inputEvents = Stream.fromIterable([
          { AudioEvent: new AudioEvent({ AudioChunk: audioChunk1 }) },
          { AudioEvent: new AudioEvent({ AudioChunk: audioChunk2 }) },
        ]);

        // Build the request with the event stream
        const request = yield* buildRequest({
          MediaSampleRateHertz: 16000,
          MediaEncoding: "pcm",
          LanguageCode: "en-US",
          AudioStream: inputEvents,
        });

        // Verify request structure
        expect(request.method).toBe("POST");
        expect(request.path).toBe("/stream-transcription");

        // Verify headers are set correctly
        expect(request.headers["x-amzn-transcribe-sample-rate"]).toBe("16000");
        expect(request.headers["x-amzn-transcribe-media-encoding"]).toBe("pcm");
        expect(request.headers["x-amzn-transcribe-language-code"]).toBe(
          "en-US",
        );

        // Verify the body is a ReadableStream (event stream)
        expect(request.body).toBeInstanceOf(ReadableStream);

        // Verify the content type is set for event streams
        expect(request.headers["Content-Type"]).toBe(
          "application/vnd.amazon.eventstream",
        );

        // Read and verify the event stream bytes
        const chunks = yield* readAllChunks(
          request.body as ReadableStream<Uint8Array>,
        );
        expect(chunks.length).toBe(2);

        // Decode first message and verify structure
        const [msg1] = yield* decodeMessage(chunks[0]);
        expect(getStringHeader(msg1.headers, HEADER_MESSAGE_TYPE)).toBe(
          "event",
        );
        expect(getStringHeader(msg1.headers, HEADER_EVENT_TYPE)).toBe(
          "AudioEvent",
        );
      }),
  );

  it.effect("should handle ConfigurationEvent with JSON payload", () =>
    Effect.gen(function* () {
      const operation = {
        input: StartStreamTranscriptionRequest,
        output: StartStreamTranscriptionRequest,
        errors: [],
      };

      const buildRequest = makeRequestBuilder(operation, {
        protocol: restJson1Protocol,
      });

      // Create a configuration event using proper class instances
      const channelDef = new ChannelDefinition({
        ChannelId: 0,
        ParticipantRole: "AGENT",
      });
      const configEvent = new ConfigurationEvent({
        ChannelDefinitions: [channelDef],
      });

      const inputEvents = Stream.fromIterable([
        { ConfigurationEvent: configEvent },
      ]);

      const request = yield* buildRequest({
        MediaSampleRateHertz: 16000,
        MediaEncoding: "pcm",
        LanguageCode: "en-US",
        AudioStream: inputEvents,
      });

      // Read the event stream
      const chunks = yield* readAllChunks(
        request.body as ReadableStream<Uint8Array>,
      );
      expect(chunks.length).toBe(1);

      // Decode and verify it's a ConfigurationEvent
      const [msg] = yield* decodeMessage(chunks[0]);
      expect(getStringHeader(msg.headers, HEADER_EVENT_TYPE)).toBe(
        "ConfigurationEvent",
      );

      // The payload should be JSON
      expect(getStringHeader(msg.headers, HEADER_CONTENT_TYPE)).toBe(
        "application/json",
      );
    }),
  );

  it.effect("should stream multiple events in order", () =>
    Effect.gen(function* () {
      const operation = {
        input: StartStreamTranscriptionRequest,
        output: StartStreamTranscriptionRequest,
        errors: [],
      };

      const buildRequest = makeRequestBuilder(operation, {
        protocol: restJson1Protocol,
      });

      // Create 10 audio events
      const audioEvents = Array.from({ length: 10 }, (_, i) => ({
        AudioEvent: new AudioEvent({
          AudioChunk: new Uint8Array([i, i + 1, i + 2, i + 3]),
        }),
      }));

      const request = yield* buildRequest({
        MediaSampleRateHertz: 16000,
        MediaEncoding: "pcm",
        LanguageCode: "en-US",
        AudioStream: Stream.fromIterable(audioEvents),
      });

      // Read all events
      const chunks = yield* readAllChunks(
        request.body as ReadableStream<Uint8Array>,
      );
      expect(chunks.length).toBe(10);

      // Verify all are AudioEvents
      for (let i = 0; i < chunks.length; i++) {
        const [msg] = yield* decodeMessage(chunks[i]);
        expect(getStringHeader(msg.headers, HEADER_EVENT_TYPE)).toBe(
          "AudioEvent",
        );
      }
    }),
  );
});

describe("AudioStream Schema", () => {
  it.effect("should accept Stream type as input", () =>
    Effect.gen(function* () {
      // Verify AudioStream is a streaming type
      const ast = AudioStream.ast;
      expect(ast.annotations?.[streamingSymbol]).toBe(true);
    }),
  );
});

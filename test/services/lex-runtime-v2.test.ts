/**
 * Lex Runtime V2 Service Tests - Bi-directional Event Streaming
 *
 * These tests verify bi-directional event streaming with StartConversation.
 *
 * IMPORTANT: These tests require:
 * 1. A real AWS account with Lex V2 bot configured
 * 2. HTTP/2 support (event streams require h2)
 * 3. Environment variables: LEX_BOT_ID, LEX_BOT_ALIAS_ID, LEX_LOCALE_ID
 *
 * The tests will skip if the required environment variables are not set
 * or if running in LocalStack (which doesn't support Lex streaming).
 */

import { Effect, Stream } from "effect";
import {
  ConfigurationEvent,
  DisconnectionEvent,
  recognizeText,
  startConversation,
  TextInputEvent,
} from "../../src/services/lex-runtime-v2.ts";
import { test } from "../test.ts";

// Skip bi-directional streaming tests in LocalStack - not supported
const isLocalStack = process.env.LOCAL === "true" || process.env.LOCAL === "1";

// Configuration for Lex bot - set these environment variables to run tests
const BOT_ID = process.env.LEX_BOT_ID;
const BOT_ALIAS_ID = process.env.LEX_BOT_ALIAS_ID || "TSTALIASID"; // Test alias
const LOCALE_ID = process.env.LEX_LOCALE_ID || "en_US";
const SESSION_ID = `itty-aws-test-${Date.now()}`;

// ============================================================================
// Basic RecognizeText Test (Non-streaming, works in LocalStack)
// ============================================================================

test(
  "recognizeText sends text and receives intent response",
  Effect.gen(function* () {
    // Skip if no bot configured
    if (!BOT_ID) {
      yield* Effect.logInfo(
        "Skipping test: LEX_BOT_ID environment variable not set",
      );
      return;
    }

    const response = yield* recognizeText({
      botId: BOT_ID,
      botAliasId: BOT_ALIAS_ID,
      localeId: LOCALE_ID,
      sessionId: SESSION_ID,
      text: "Hello",
    });

    // Verify we got a response
    yield* Effect.logInfo("RecognizeText response:", response);

    // The response should have session state
    if (!response.sessionState) {
      return yield* Effect.fail(new Error("Expected sessionState in response"));
    }
  }),
);

// ============================================================================
// Bi-directional Event Stream Tests
// ============================================================================

if (!isLocalStack && BOT_ID) {
  test(
    "startConversation bi-directional event stream with text input",
    { timeout: 60_000 },
    Effect.gen(function* () {
      yield* Effect.logInfo("Starting bi-directional event stream test");

      // Create the configuration event (required as first event)
      const configEvent = new ConfigurationEvent({
        sessionState: {
          dialogAction: {
            type: "ElicitIntent",
          },
        },
        responseContentType: "text/plain; charset=utf-8",
      });

      // Create a text input event
      const textEvent = new TextInputEvent({
        text: "Hello",
        eventId: "event-1",
        clientTimestampMillis: Date.now(),
      });

      // Create disconnection event to signal end of conversation
      const disconnectEvent = new DisconnectionEvent({
        eventId: "disconnect-1",
        clientTimestampMillis: Date.now(),
      });

      // Create the input event stream
      const inputEvents = Stream.fromIterable([
        { ConfigurationEvent: configEvent },
        { TextInputEvent: textEvent },
        { DisconnectionEvent: disconnectEvent },
      ]);

      yield* Effect.logInfo("Sending startConversation request...");

      // Call startConversation with bi-directional streaming
      const response = yield* startConversation({
        botId: BOT_ID!,
        botAliasId: BOT_ALIAS_ID,
        localeId: LOCALE_ID,
        sessionId: SESSION_ID,
        conversationMode: "AUDIO", // or "TEXT"
        requestEventStream: inputEvents,
      });

      yield* Effect.logInfo("Got response, processing event stream...");

      // Collect response events
      const responseEvents: unknown[] = [];

      if (response.responseEventStream) {
        yield* Stream.runForEach(response.responseEventStream, (event) =>
          Effect.gen(function* () {
            yield* Effect.logInfo("Received event:", event);
            responseEvents.push(event);
          }),
        ).pipe(
          Effect.timeout("30 seconds"),
          Effect.catchAll((err) =>
            Effect.logWarning(`Event stream error: ${err}`),
          ),
        );
      }

      yield* Effect.logInfo(
        `Received ${responseEvents.length} response events`,
      );

      // We should have received at least one event
      if (responseEvents.length === 0) {
        return yield* Effect.fail(
          new Error("Expected at least one response event"),
        );
      }
    }),
  );

  test(
    "startConversation handles multiple text exchanges",
    { timeout: 120_000 },
    Effect.gen(function* () {
      yield* Effect.logInfo("Starting multi-turn conversation test");

      // Create configuration event
      const configEvent = new ConfigurationEvent({
        sessionState: {
          dialogAction: {
            type: "ElicitIntent",
          },
        },
        responseContentType: "text/plain; charset=utf-8",
      });

      // Create multiple text inputs for a conversation
      const textEvents = [
        new TextInputEvent({
          text: "I want to book a hotel",
          eventId: "event-1",
          clientTimestampMillis: Date.now(),
        }),
        new TextInputEvent({
          text: "In Seattle",
          eventId: "event-2",
          clientTimestampMillis: Date.now() + 1000,
        }),
        new TextInputEvent({
          text: "For next weekend",
          eventId: "event-3",
          clientTimestampMillis: Date.now() + 2000,
        }),
      ];

      const disconnectEvent = new DisconnectionEvent({
        eventId: "disconnect-1",
        clientTimestampMillis: Date.now() + 3000,
      });

      // Build the event stream
      const inputEvents = Stream.fromIterable([
        { ConfigurationEvent: configEvent },
        ...textEvents.map((e) => ({ TextInputEvent: e })),
        { DisconnectionEvent: disconnectEvent },
      ]);

      const response = yield* startConversation({
        botId: BOT_ID!,
        botAliasId: BOT_ALIAS_ID,
        localeId: LOCALE_ID,
        sessionId: `${SESSION_ID}-multi`,
        conversationMode: "TEXT",
        requestEventStream: inputEvents,
      });

      // Collect all response events
      const responseEvents: unknown[] = [];

      if (response.responseEventStream) {
        yield* Stream.runForEach(response.responseEventStream, (event) =>
          Effect.gen(function* () {
            responseEvents.push(event);
          }),
        ).pipe(
          Effect.timeout("60 seconds"),
          Effect.catchAll((err) =>
            Effect.logWarning(`Event stream error: ${err}`),
          ),
        );
      }

      yield* Effect.logInfo(
        `Multi-turn conversation received ${responseEvents.length} events`,
      );

      // Log event types received
      for (const event of responseEvents) {
        const eventType = Object.keys(event as object)[0];
        yield* Effect.logInfo(`  - ${eventType}`);
      }
    }),
  );
}

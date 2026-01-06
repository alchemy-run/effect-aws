/**
 * Stream Parser - converts raw event stream bytes into typed events.
 *
 * This module handles:
 * 1. Detecting event stream members in output schemas
 * 2. Parsing wire format into StreamEvent objects
 * 3. Decoding event payloads into typed schema instances
 * 4. Filtering out internal events (initial-response)
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type * as AST from "effect/SchemaAST";
import * as Stream from "effect/Stream";
import { parseEventStream } from "../eventstream/parser.ts";
import { isStreamingType } from "../traits.ts";
import { getEncodedPropertySignatures } from "../util/ast.ts";

/**
 * Stream parser function - transforms deserialized response if it contains an event stream.
 * Returns the modified response, or null if no event stream handling was needed.
 */
export type StreamParser = (
  deserialized: Record<string, unknown> | undefined,
) => Record<string, unknown> | null;

/**
 * Create a stream parser for the given output schema.
 *
 * @param outputAst - The AST of the output schema
 * @returns A stream parser function, or null if no event stream member
 */
export function makeStreamParser(outputAst: AST.AST): StreamParser | null {
  // Detect event stream output member and get its event schema
  for (const prop of getEncodedPropertySignatures(outputAst)) {
    if (isStreamingType(prop.type)) {
      const propName = String(prop.name);

      // Get the event schema from the streaming annotation
      // It's stored as 'eventSchema' on the Declaration's annotations
      const ast = prop.type;
      const eventSchema =
        ast._tag === "Declaration"
          ? (ast.annotations?.eventSchema as
              | Schema.Schema.AnyNoContext
              | undefined)
          : undefined;

      // Return a parser function that handles this event stream property
      return (deserialized) => {
        if (
          !deserialized?.[propName] ||
          !(deserialized[propName] instanceof ReadableStream)
        ) {
          return null;
        }

        const rawStream = deserialized[propName] as ReadableStream<Uint8Array>;
        const typedEventStream = parseTypedEventStream(rawStream, eventSchema);

        return {
          ...deserialized,
          [propName]: typedEventStream,
        };
      };
    }
  }

  return null;
}

/**
 * Parse a raw ReadableStream into a typed event stream.
 *
 * @param rawStream - The raw bytes from the HTTP response body
 * @param eventSchema - Optional schema for decoding event payloads
 * @returns A Stream of typed events
 */
function parseTypedEventStream<A>(
  rawStream: ReadableStream<Uint8Array>,
  eventSchema?: Schema.Schema<A, unknown>,
): Stream.Stream<A, Error, never> {
  // Parse wire format into StreamEvent objects
  const wireEventStream = parseEventStream(rawStream);

  if (!eventSchema) {
    // No schema provided - return raw wire events
    return wireEventStream as unknown as Stream.Stream<A, Error, never>;
  }

  // Decode each event's payload into the typed event
  return Stream.mapEffect(wireEventStream, (wireEvent) =>
    Effect.gen(function* () {
      // Only decode MessageEvent payloads that have an event type
      if (
        wireEvent._tag === "MessageEvent" &&
        wireEvent.eventType &&
        wireEvent.eventType !== "initial-response"
      ) {
        // Parse the JSON payload
        const payloadText = new TextDecoder().decode(wireEvent.payload);
        const payloadData = JSON.parse(payloadText);

        // Decode using the event schema (union of event types)
        // The _tag should match the eventType for TaggedClass matching
        const decoded = yield* Schema.decodeUnknown(eventSchema)({
          _tag: wireEvent.eventType,
          ...payloadData,
        }).pipe(
          Effect.catchAll(() =>
            // If decoding fails, return the raw payload data
            Effect.succeed(payloadData as A),
          ),
        );
        return decoded;
      }
      // For initial-response or other events, skip them
      return null as A | null;
    }),
  ).pipe(
    // Filter out null values (skipped events)
    Stream.filter((e): e is A => e !== null),
  );
}

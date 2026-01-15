import * as Effect from "effect/Effect";
import * as Context from "effect/Context";
import * as Layer from "effect/Layer";
import * as Queue from "effect/Queue";
import { TuiEventQueue } from "./ChatService.ts";
import { ToolResult, type TuiEvent } from "../types.ts";

/**
 * Service that observes tool execution and emits events for TUI updates
 */
export class ToolObserver extends Context.Tag("ToolObserver")<
  ToolObserver,
  {
    onToolStart: (name: string, params: unknown) => Effect.Effect<string>;
    onToolSuccess: (
      id: string,
      result: unknown,
      diff?: { filePath: string; oldContent: string; newContent: string }
    ) => Effect.Effect<void>;
    onToolError: (id: string, error: unknown) => Effect.Effect<void>;
  }
>() {}

let toolCallIdCounter = 0;
function generateToolCallId(): string {
  return `tool-${++toolCallIdCounter}`;
}

export const toolObserverLayer = Layer.effect(
  ToolObserver,
  Effect.gen(function* () {
    const eventQueue = yield* TuiEventQueue;

    const emit = (event: TuiEvent) => Queue.offer(eventQueue, event);

    // Track current message ID for tool results
    let currentMessageId = "";
    const toolResults = new Map<string, ToolResult>();

    return {
      onToolStart: Effect.fn(function* (name: string, _params: unknown) {
        const id = generateToolCallId();

        const result: ToolResult = {
          name,
          status: "running",
        };
        toolResults.set(id, result);

        // Update current assistant message with tool result
        yield* emit({
          type: "messageUpdate",
          id: currentMessageId,
          data: {
            toolResults: Array.from(toolResults.values()),
          },
        });

        return id;
      }),

      onToolSuccess: Effect.fn(function* (
        id: string,
        result: unknown,
        diff?: { filePath: string; oldContent: string; newContent: string }
      ) {
        const toolResult = toolResults.get(id);
        if (toolResult) {
          toolResult.status = "success";
          toolResult.result = typeof result === "string" ? result : JSON.stringify(result);
          if (diff) {
            toolResult.diff = diff;
          }
        }

        yield* emit({
          type: "messageUpdate",
          id: currentMessageId,
          data: {
            toolResults: Array.from(toolResults.values()),
          },
        });
      }),

      onToolError: Effect.fn(function* (id: string, error: unknown) {
        const toolResult = toolResults.get(id);
        if (toolResult) {
          toolResult.status = "error";
          toolResult.result = String(error);
        }

        yield* emit({
          type: "messageUpdate",
          id: currentMessageId,
          data: {
            toolResults: Array.from(toolResults.values()),
          },
        });
      }),
    };
  })
);

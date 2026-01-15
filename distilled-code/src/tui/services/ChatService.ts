/**
 * ChatService - Bridges Effect AI layer with TUI
 * Uses LanguageModel directly with toolkit for agentic execution
 */
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import * as Queue from "effect/Queue";
import * as Ref from "effect/Ref";
import * as Context from "effect/Context";
import * as Layer from "effect/Layer";
import * as LanguageModel from "@effect/ai/LanguageModel";
import {
  TuiEvent,
  TuiController,
  MessageData,
  Part,
  TextPart,
  ToolPart,
} from "../types.ts";
import { toolkit } from "../../tools/index.ts";
import { log, logError } from "../../util/log.ts";

// =============================================================================
// Event Queue
// =============================================================================

export class TuiEventQueue extends Context.Tag("TuiEventQueue")<
  TuiEventQueue,
  Queue.Queue<TuiEvent>
>() {}

// =============================================================================
// ID Generation
// =============================================================================

let messageIdCounter = 0;
let partIdCounter = 0;

function generateMessageId(): string {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

function generatePartId(): string {
  return `part-${Date.now()}-${++partIdCounter}`;
}

// =============================================================================
// Text Sanitization
// =============================================================================

function sanitizeText(text: string): string {
  // Remove ANSI escape codes
  const withoutAnsi = text.replace(/\x1B\[[0-9;]*[A-Za-z]/g, "");
  // Remove other escape sequences
  const withoutEscapes = withoutAnsi.replace(/\x1B[^[]/g, "");
  return withoutEscapes;
}

// =============================================================================
// ChatBridge Service
// =============================================================================

export class ChatBridge extends Context.Tag("ChatBridge")<
  ChatBridge,
  {
    sendUserMessage: (content: string) => Effect.Effect<void, unknown, any>;
    getEventStream: () => Stream.Stream<TuiEvent>;
    emitToolStart: (messageID: string, tool: string, callID: string, input: Record<string, unknown>) => Effect.Effect<void>;
    emitToolComplete: (messageID: string, callID: string, output: string, metadata?: Record<string, unknown>) => Effect.Effect<void>;
    emitToolError: (messageID: string, callID: string, error: string) => Effect.Effect<void>;
  }
>() {}

export const chatBridgeLayer = Layer.effect(
  ChatBridge,
  Effect.gen(function* () {
    const eventQueue = yield* Queue.unbounded<TuiEvent>();
    const currentMessageId = yield* Ref.make<string | null>(null);

    // Helper to emit events
    const emit = (event: TuiEvent) => Queue.offer(eventQueue, event);

    // Create a text part
    const createTextPart = (messageID: string, text: string): TextPart => ({
      id: generatePartId(),
      type: "text",
      messageID,
      text,
    });

    // Create a tool part
    const createToolPart = (
      messageID: string,
      tool: string,
      callID: string,
      input: Record<string, unknown>
    ): ToolPart => ({
      id: generatePartId(),
      type: "tool",
      messageID,
      callID,
      tool,
      state: {
        status: "running",
        input,
      },
    });

    return {
      sendUserMessage: (content: string) =>
        Effect.gen(function* () {
          log("ChatBridge", "sendUserMessage called", { content: content.slice(0, 100) });
          
          // Create user message
          const userMsgId = generateMessageId();
          const userTextPart = createTextPart(userMsgId, content);

          yield* emit({
            type: "message",
            data: {
              id: userMsgId,
              role: "user",
              content,
              parts: [userTextPart],
            },
          });
          log("ChatBridge", "Emitted user message", { id: userMsgId });

          // Set session status to running
          yield* emit({
            type: "sessionStatus",
            status: { type: "running" },
          });

          // Create assistant message placeholder
          const assistantMsgId = generateMessageId();
          yield* Ref.set(currentMessageId, assistantMsgId);

          yield* emit({
            type: "message",
            data: {
              id: assistantMsgId,
              role: "assistant",
              content: "",
              isStreaming: true,
              parts: [],
            },
          });
          log("ChatBridge", "Created assistant message placeholder", { id: assistantMsgId });

          // Track accumulated text and tool parts across all loop iterations
          const allToolParts = yield* Ref.make<ToolPart[]>([]);
          const allTextParts = yield* Ref.make<string[]>([]);
          
          // Build conversation history for multi-turn
          const conversationHistory = yield* Ref.make<Array<{ role: string; content: string }>>([
            { role: "user", content }
          ]);

          // Agentic loop - continue until model stops calling tools
          let loopIteration = 0;
          const MAX_ITERATIONS = 20; // Safety limit
          let shouldContinue = true;
          
          while (shouldContinue && loopIteration < MAX_ITERATIONS) {
            loopIteration++;
            log("ChatBridge", "Agentic loop iteration", { iteration: loopIteration });
            
            // Track state for this iteration
            const textBuffer = yield* Ref.make("");
            const iterationToolParts = yield* Ref.make<Map<string, ToolPart>>(new Map());
            let currentTextPartId: string | null = null;
            const finishReason = yield* Ref.make<string>("unknown");
            const toolResultsForHistory = yield* Ref.make<Array<{ id: string; name: string; result: string }>>([]);

            // Get conversation history for multi-turn
            const history = yield* Ref.get(conversationHistory);
            
            // Build prompt - use full history for context
            const promptMessages = history.map(h => h.content).join("\n\n");
            
            log("ChatBridge", "Starting streamText", { promptLength: promptMessages.length });
            
            const stream = LanguageModel.streamText({
              prompt: promptMessages,
              toolkit,
            });

            yield* Stream.runForEach(stream, (part) =>
              Effect.gen(function* () {
                const partType = (part as { type: string }).type;
                
                switch (partType) {
                  case "text-start": {
                    currentTextPartId = generatePartId();
                    yield* Ref.set(textBuffer, "");
                    log("ChatBridge", "Text streaming started", { id: currentTextPartId });
                    break;
                  }
                  
                  case "text-delta": {
                    const delta = (part as { delta: string }).delta;
                    const currentText = yield* Ref.get(textBuffer);
                    const newText = currentText + delta;
                    yield* Ref.set(textBuffer, newText);
                    
                    if (currentTextPartId) {
                      const textPart: TextPart = {
                        id: currentTextPartId,
                        type: "text",
                        messageID: assistantMsgId,
                        text: sanitizeText(newText),
                      };
                      yield* emit({
                        type: "part",
                        messageID: assistantMsgId,
                        part: textPart,
                      });
                    }
                    break;
                  }
                  
                  case "text-end": {
                    log("ChatBridge", "Text streaming ended");
                    const text = yield* Ref.get(textBuffer);
                    if (text) {
                      const texts = yield* Ref.get(allTextParts);
                      yield* Ref.set(allTextParts, [...texts, text]);
                    }
                    currentTextPartId = null;
                    break;
                  }
                  
                  case "tool-call": {
                    const toolCall = part as { id: string; name: string; params: Record<string, unknown> };
                    log("ChatBridge", "Tool call starting", { name: toolCall.name, id: toolCall.id });
                    
                    const toolPart = createToolPart(
                      assistantMsgId,
                      toolCall.name,
                      toolCall.id,
                      toolCall.params
                    );
                    
                    const currentParts = yield* Ref.get(iterationToolParts);
                    currentParts.set(toolCall.id, toolPart);
                    yield* Ref.set(iterationToolParts, currentParts);
                    
                    // Add to all tool parts
                    const all = yield* Ref.get(allToolParts);
                    yield* Ref.set(allToolParts, [...all, toolPart]);
                    
                    yield* emit({
                      type: "part",
                      messageID: assistantMsgId,
                      part: toolPart,
                    });
                    break;
                  }
                  
                  case "tool-result": {
                    const toolResult = part as { id: string; name: string; result: unknown; isFailure: boolean };
                    log("ChatBridge", "Tool result", { 
                      name: toolResult.name, 
                      id: toolResult.id,
                      isFailure: toolResult.isFailure 
                    });
                    
                    const currentParts = yield* Ref.get(iterationToolParts);
                    const existingPart = currentParts.get(toolResult.id);
                    
                    if (existingPart) {
                      const resultStr = String(toolResult.result ?? "");
                      existingPart.state = {
                        status: toolResult.isFailure ? "error" : "completed",
                        input: existingPart.state?.input ?? {},
                        output: resultStr,
                      };
                      
                      yield* emit({
                        type: "partUpdate",
                        messageID: assistantMsgId,
                        partID: existingPart.id,
                        update: { state: existingPart.state },
                      });
                      
                      // Store for history
                      const results = yield* Ref.get(toolResultsForHistory);
                      yield* Ref.set(toolResultsForHistory, [...results, {
                        id: toolResult.id,
                        name: toolResult.name,
                        result: resultStr.slice(0, 2000), // Truncate for context
                      }]);
                    }
                    break;
                  }
                  
                  case "finish": {
                    const finish = part as { reason: string; usage: { inputTokens: number; outputTokens: number } };
                    log("ChatBridge", "Stream finished", { reason: finish.reason, usage: finish.usage });
                    yield* Ref.set(finishReason, finish.reason);
                    break;
                  }
                  
                  case "error": {
                    const error = (part as { error: unknown }).error;
                    logError("ChatBridge", "Stream error", error);
                    break;
                  }
                  
                  case "response-metadata":
                  case "reasoning-start":
                  case "reasoning-delta":
                  case "reasoning-end":
                  case "tool-params-start":
                  case "tool-params-delta":
                  case "tool-params-end":
                    break;
                    
                  default:
                    log("ChatBridge", "Unknown stream part type", { type: partType });
                }
              })
            ).pipe(
              Effect.catchAll((error) =>
                Effect.gen(function* () {
                  logError("ChatBridge", "streamText error", error);
                  
                  // If it's a tool error, we should continue the loop with the error message
                  const errorMessage = String(error);
                  
                  // Check if this looks like a tool failure (file not found, etc.)
                  if (errorMessage.includes("File not found") || 
                      errorMessage.includes("not found") ||
                      errorMessage.includes("not exist")) {
                    // Add error message to tool results so model can recover
                    const results = yield* Ref.get(toolResultsForHistory);
                    yield* Ref.set(toolResultsForHistory, [...results, {
                      id: "error",
                      name: "error",
                      result: `Error: ${errorMessage}`,
                    }]);
                    // Set reason to tool-calls so loop continues
                    yield* Ref.set(finishReason, "tool-calls");
                  } else {
                    // For other errors, show to user and stop
                    const errorText = `Error: ${errorMessage}`;
                    const textPart = createTextPart(assistantMsgId, errorText);
                    yield* emit({
                      type: "part",
                      messageID: assistantMsgId,
                      part: textPart,
                    });
                    yield* Ref.set(finishReason, "error");
                  }
                })
              )
            );

            // Check if we should continue the loop
            const reason = yield* Ref.get(finishReason);
            const toolResults = yield* Ref.get(toolResultsForHistory);
            
            if (reason === "tool-calls" && toolResults.length > 0) {
              // Model wants to continue - add assistant response and tool results to history
              const iterText = yield* Ref.get(textBuffer);
              const assistantContent = iterText + "\n\nTool Results:\n" + 
                toolResults.map(r => `[${r.name}]: ${r.result}`).join("\n\n");
              
              const currentHistory = yield* Ref.get(conversationHistory);
              yield* Ref.set(conversationHistory, [
                ...currentHistory,
                { role: "assistant", content: assistantContent },
                { role: "user", content: "Continue based on the tool results above." }
              ]);
              
              log("ChatBridge", "Continuing agentic loop", { toolCount: toolResults.length });
            } else {
              // Model is done (stop, length, error, etc.)
              shouldContinue = false;
              log("ChatBridge", "Ending agentic loop", { reason, iteration: loopIteration });
            }
          }

          // Finalize the message with all accumulated parts
          const allTexts = yield* Ref.get(allTextParts);
          const finalToolPartsArr = yield* Ref.get(allToolParts);
          const allParts: Part[] = [...finalToolPartsArr];
          
          const combinedText = allTexts.join("\n\n");
          if (combinedText) {
            allParts.push(createTextPart(assistantMsgId, sanitizeText(combinedText)));
          }

          yield* emit({
            type: "messageUpdate",
            id: assistantMsgId,
            data: {
              content: sanitizeText(combinedText),
              isStreaming: false,
              parts: allParts,
            },
          });
          log("ChatBridge", "Message finalized", { 
            textLength: combinedText.length, 
            toolCount: finalToolPartsArr.length,
            iterations: loopIteration 
          });

          // Set session status to idle
          yield* emit({
            type: "sessionStatus",
            status: { type: "idle" },
          });
          log("ChatBridge", "Session status set to idle");

          yield* Ref.set(currentMessageId, null);
        }),

      getEventStream: () => Stream.fromQueue(eventQueue),

      // Emit tool start event
      emitToolStart: (messageID: string, tool: string, callID: string, input: Record<string, unknown>) =>
        Effect.gen(function* () {
          const part = createToolPart(messageID, tool, callID, input);
          yield* emit({
            type: "part",
            messageID,
            part,
          });
        }),

      // Emit tool complete event
      emitToolComplete: (messageID: string, callID: string, output: string, metadata?: Record<string, unknown>) =>
        emit({
          type: "partUpdate",
          messageID,
          partID: callID,
          update: {
            state: {
              status: "completed",
              output,
              metadata,
            },
          } as Partial<ToolPart>,
        }),

      // Emit tool error event
      emitToolError: (messageID: string, callID: string, error: string) =>
        emit({
          type: "partUpdate",
          messageID,
          partID: callID,
          update: {
            state: {
              status: "error",
              error,
            },
          } as Partial<ToolPart>,
        }),
    };
  })
);

// =============================================================================
// TUI Controller Connection
// =============================================================================

export const connectTuiController = (controller: TuiController) =>
  Effect.gen(function* () {
    const bridge = yield* ChatBridge;
    const stream = bridge.getEventStream();

    yield* Stream.runForEach(stream, (event) =>
      Effect.sync(() => {
        switch (event.type) {
          case "message":
            controller.addMessage(event.data);
            break;
          case "messageUpdate":
            controller.updateMessage(event.id, event.data);
            break;
          case "processing":
            controller.setProcessing(event.value);
            break;
          case "sessionStatus":
            controller.setSessionStatus(event.status);
            break;
          case "part":
            controller.addPart(event.messageID, event.part);
            break;
          case "partUpdate":
            controller.updatePart(event.messageID, event.partID, event.update);
            break;
          case "subAgent":
            controller.addSubAgent(event.data);
            break;
          case "subAgentUpdate":
            controller.updateSubAgent(event.id, event.data);
            break;
          case "clearSubAgents":
            controller.clearSubAgents();
            break;
        }
      })
    );
  });

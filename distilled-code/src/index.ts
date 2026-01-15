#!/usr/bin/env bun
import { Command, Options, Args } from "@effect/cli";
import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";
import * as FileSystem from "@effect/platform/FileSystem";
import * as ConfigProvider from "effect/ConfigProvider";
import {
  NodeContext,
  NodeHttpClient,
  NodeRuntime,
} from "@effect/platform-node";
import * as S from "effect/Schema";
import * as LanguageModel from "@effect/ai/LanguageModel";
import * as Chat from "@effect/ai/Chat";
import * as Config from "effect/Config";
import * as Queue from "effect/Queue";
import * as Layer from "effect/Layer";
import { AnthropicClient, AnthropicLanguageModel } from "@effect/ai-anthropic";
import { toolkit, toolkitLayer } from "./tools/index.ts";
import * as PlatformConfigProvider from "@effect/platform/PlatformConfigProvider";
import * as Persistence from "@effect/experimental/Persistence";
import { LogLevel } from "effect";
import { createTui } from "./tui/index.tsx";
import {
  ChatBridge,
  chatBridgeLayer,
  connectTuiController,
  TuiEventQueue,
  interruptControllerLayer,
  InterruptController,
} from "./tui/services/index.ts";
import { subAgentOrchestratorLayer } from "./agent/SubAgent.ts";
import { log, logError } from "./util/log.ts";

const Anthropic = AnthropicClient.layerConfig({
  apiKey: Config.redacted("ANTHROPIC_API_KEY"),
});

const claude = AnthropicLanguageModel.model("claude-sonnet-4-20250514");

const generateCommand = Command.make(
  "generate",
  {
    service: Args.text({ name: "service" }).pipe(
      Args.withDescription("Main file to generate"),
    ),
    resource: Options.text("resource").pipe(
      Options.withDefault(undefined),
      Options.withDescription("Resource to generate. Defaults to all."),
    ),
    clean: Options.boolean("clean").pipe(
      Options.withDefault(false),
      Options.withDescription("Clean up all previous sessions."),
    ),
  },
  ({ service, resource, clean }) =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* Chat.fromPrompt([
        {
          role: "system",
          content: yield* fs.readFileString("AGENTS.md"),
        },
      ]);
      const {
        value: { resources },
      } = yield* LanguageModel.generateObject({
        toolkit,
        prompt: `List the resources for the ${service} service. Make sure to use your tools to explore the Terraform Provider and Cloudformation docs.`,
        schema: S.Struct({
          resources: S.Array(S.String),
        }),
      });

      console.log(resources);
    }).pipe(
      Effect.provide(
        Chat.layerPersisted({
          storeId: "chat",
        }),
      ),
    ),
);

// TUI command - launches the interactive terminal UI
const tuiCommand = Command.make(
  "tui",
  {
    model: Options.text("model").pipe(
      Options.withDefault("gpt-5-codex"),
      Options.withDescription("The model to use for the AI agent"),
    ),
  },
  ({ model }) =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const interruptController = yield* InterruptController;
      const chatBridge = yield* ChatBridge;

      // Read system prompt (currently not used since we're not using Chat service)
      const _systemPrompt = yield* fs.readFileString("AGENTS.md").pipe(
        Effect.catchAll(() =>
          Effect.succeed(
            "You are an AI coding assistant. Help the user with their coding tasks."
          )
        )
      );

      // Create TUI
      log("TUI", "Creating TUI controller");
      const controller = createTui({
        onMessage: (message) => {
          log("TUI", "onMessage called", { message: message.slice(0, 100) });
          // Handle user message - run in Effect context with all dependencies provided
          const effect = chatBridge.sendUserMessage(message).pipe(
            Effect.tap(() => Effect.sync(() => log("TUI", "sendUserMessage completed"))),
            Effect.tapError((e) => Effect.sync(() => logError("TUI", "sendUserMessage failed", e))),
            Effect.provide(toolkitLayer),
            Effect.provide(claude),
            Effect.provide(Anthropic),
            Effect.provide(NodeHttpClient.layer),
            Effect.provide(NodeContext.layer),
            Effect.scoped
          ) as Effect.Effect<void>;
          Effect.runFork(interruptController.run(effect));
        },
        onInterrupt: () => {
          log("TUI", "onInterrupt called");
          // Handle ESC key - interrupt current operation
          Effect.runFork(interruptController.interrupt());
        },
      });

      // Connect TUI controller to event stream
      yield* Effect.fork(connectTuiController(controller));

      // Keep the process running
      yield* Effect.never;
    }    ).pipe(
      Effect.provide(
        Layer.mergeAll(
          chatBridgeLayer,
          interruptControllerLayer
        )
      ),
      // Provide TuiEventQueue
      Effect.provideServiceEffect(
        TuiEventQueue,
        Queue.unbounded()
      ),
      // Use file-based logging for TUI to prevent output corruption
      Logger.withMinimumLogLevel(LogLevel.None)
    )
);

const root = Command.make("codegen", {}).pipe(
  Command.withSubcommands([generateCommand, tuiCommand]),
);

// Set up the CLI application
const cli = Command.run(root, {
  name: "Alchemy Effect Code",
  version: "1.0.0",
});

await Effect.gen(function* () {
  // Try to load .env file, but don't fail if it doesn't exist
  const dotEnvProvider = yield* PlatformConfigProvider.fromDotEnv(".env").pipe(
    Effect.catchAll(() => Effect.succeed(ConfigProvider.fromEnv()))
  );
  
  yield* cli(process.argv).pipe(
    Effect.withConfigProvider(dotEnvProvider),
    Effect.provide(toolkitLayer),
    Effect.provide(claude),
    Effect.provide(Anthropic),
  );
}).pipe(
  Logger.withMinimumLogLevel(
    process.env.DEBUG ? LogLevel.Debug : LogLevel.Info,
  ),
  Effect.scoped,
  Effect.provide(NodeContext.layer),
  Effect.provide(NodeHttpClient.layer),
  Effect.provide(Persistence.layerMemory),
  // Effect.runPromise,
  NodeRuntime.runMain,
);
// Prepare and run the CLI application

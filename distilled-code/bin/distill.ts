#!/usr/bin/env bun
/**
 * distilled CLI
 *
 * Usage:
 *   distilled "implement the API"                     # send prompt to all agents
 *   distilled --filter "api/*" "implement the API"   # send prompt to agents matching api/*
 *   distilled --concurrency 10 "implement the API"   # run 10 agents in parallel
 *   distilled --list                                  # list all agents
 *   distilled --list --filter "api/*"                # list agents matching pattern
 */
import { AnthropicClient, AnthropicLanguageModel } from "@effect/ai-anthropic";
import { Args, Command, Options } from "@effect/cli";
import * as Persistence from "@effect/experimental/Persistence";
import { FileSystem, Path } from "@effect/platform";
import {
  NodeContext,
  NodeHttpClient,
  NodeRuntime,
} from "@effect/platform-node";
import * as PlatformConfigProvider from "@effect/platform/PlatformConfigProvider";
import { LogLevel } from "effect";
import * as Config from "effect/Config";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Logger from "effect/Logger";
import * as Option from "effect/Option";
import type { Agent } from "../src/agent.ts";
import type { DistilledConfig } from "../src/config.ts";
import { getAgents, loadConfig } from "../src/config.ts";
import { LSPManagerLive } from "../src/lsp/index.ts";
import { AgentState, FileSystemAgentState } from "../src/services/state.ts";
import { match } from "../src/util/wildcard.ts";

const DEFAULT_CONFIG_FILE = "distilled.config.ts";

const Anthropic = AnthropicClient.layerConfig({
  apiKey: Config.redacted("ANTHROPIC_API_KEY"),
});

const mainCommand = Command.make(
  "distilled",
  {
    prompt: Args.text({ name: "prompt" }).pipe(
      Args.withDescription("Prompt to send to matched agents"),
      Args.optional,
    ),
    filter: Options.text("filter").pipe(
      Options.withAlias("f"),
      Options.withDescription(
        "Glob pattern to filter agents (default: '*' for all)",
      ),
      Options.optional,
    ),
    config: Options.text("config").pipe(
      Options.withAlias("c"),
      Options.withDescription(
        "Path to config file (default: ./distilled.config.ts)",
      ),
      Options.optional,
    ),
    model: Options.text("model").pipe(
      Options.withAlias("m"),
      Options.withDescription("Model to use (default: claude-sonnet)"),
      Options.withDefault("claude-sonnet"),
    ),
    list: Options.boolean("list").pipe(
      Options.withAlias("l"),
      Options.withDescription("List agents (optionally filtered by --filter)"),
      Options.withDefault(false),
    ),
    concurrency: Options.integer("concurrency").pipe(
      Options.withAlias("j"),
      Options.withDescription(
        "Number of agents to run in parallel (default: 1)",
      ),
      Options.withDefault(1),
    ),
  },
  Effect.fn(function* ({ prompt, filter, config, model, list, concurrency }) {
    const configPath = Option.getOrUndefined(config);
    const patternValue = Option.getOrUndefined(filter);
    const promptValue = Option.getOrUndefined(prompt) ?? "do it";

    // Resolve config path
    const resolvedPath = yield* resolveConfigPath(configPath);

    // Load config or use defaults
    const loadedConfig: DistilledConfig = resolvedPath
      ? yield* Effect.tryPromise(() => loadConfig(resolvedPath))
      : { name: "distilled", model };

    // Override model if provided
    if (model !== "claude-sonnet") {
      loadedConfig.model = model;
    }

    // Create model layer
    const modelLayer = getModelLayer(loadedConfig.model || "claude-sonnet");

    // Create LSP manager layer from config
    const lspLayer = LSPManagerLive(loadedConfig.lsp?.servers);

    return yield* Effect.gen(function* () {
      // Get all agents from config
      const allAgents: Agent<string>[] = yield* getAgents(loadedConfig);

      // List agents mode
      if (list) {
        const agents = patternValue
          ? matchAgents(allAgents, patternValue)
          : allAgents;

        if (agents.length === 0) {
          yield* Console.log(
            patternValue
              ? `No agents matching "${patternValue}".`
              : "No agents configured.",
          );
        } else {
          yield* Console.log(
            patternValue
              ? `Agents matching "${patternValue}":\n`
              : "Configured agents:\n",
          );
          const sortedAgents = [...agents].sort((a, b) =>
            a.key.localeCompare(b.key),
          );
          for (const agent of sortedAgents) {
            yield* Console.log(`  ${agent.key}`);
          }
          yield* Console.log();
        }
        return;
      }

      // Match agents (default to all if no pattern)
      const matchedAgents = matchAgents(allAgents, patternValue ?? "*");

      if (matchedAgents.length === 0) {
        yield* Console.error(`No agents matching "${patternValue}".`);
        yield* Console.error("Use --list to see available agents.");
        return;
      }

      // Run each matched agent
      yield* Effect.all(
        matchedAgents.map((agent) => runAgent(agent, promptValue)),
        { concurrency },
      );
      yield* Console.log("Done.");
    }).pipe(Effect.provide(Layer.mergeAll(lspLayer, modelLayer)));
  }),
);

/**
 * Run a single agent with the given prompt.
 */
const runAgent = (
  agent: Agent,
  prompt: string,
): Effect.Effect<void, unknown, never> =>
  Effect.gen(function* () {
    // Build the prompt with context from the agent
    const contextPrompt = agent.prompt
      ? `Context: ${agent.prompt}\n\n${prompt}`
      : prompt;

    yield* agent.send(contextPrompt);
    yield* Console.log("\n");
  });

const getModelLayer = (modelName: string) => {
  const modelMap: Record<string, string> = {
    "claude-sonnet": "claude-sonnet-4-20250514",
    "claude-haiku": "claude-haiku-4-5",
    "claude-opus": "claude-opus-4-20250514",
  };
  const resolvedModel = modelMap[modelName] || modelName;
  return AnthropicLanguageModel.model(resolvedModel as any);
};

/**
 * Filter agents by glob pattern.
 */
const matchAgents = (agents: Agent[], pattern: string): Agent[] => {
  return agents.filter((agent) => match(agent.key, pattern));
};

/**
 * Resolve the config path from user input.
 */
const resolveConfigPath = Effect.fn(function* (inputPath: string | undefined) {
  const fs = yield* FileSystem.FileSystem;
  const pathService = yield* Path.Path;

  const targetPath = !inputPath || inputPath === "." ? "." : inputPath;

  const isDir = yield* fs.stat(targetPath).pipe(
    Effect.map((stat) => stat.type === "Directory"),
    Effect.catchAll(() => Effect.succeed(false)),
  );

  if (isDir) {
    const configPath = pathService.join(targetPath, DEFAULT_CONFIG_FILE);
    const exists = yield* fs.exists(configPath);
    if (!exists) {
      return undefined;
    }
    return pathService.resolve(configPath);
  }

  const exists = yield* fs.exists(targetPath);
  if (!exists) {
    return yield* Effect.fail(
      new Error(`Config file not found: ${targetPath}`),
    );
  }
  return pathService.resolve(targetPath);
});

/**
 * Clean command - removes agent state and files created by agents.
 */
const cleanCommand = Command.make(
  "clean",
  {
    filter: Options.text("filter").pipe(
      Options.withAlias("f"),
      Options.withDescription(
        "Glob pattern to filter agents (default: '*' for all)",
      ),
      Options.optional,
    ),
    files: Options.boolean("files").pipe(
      Options.withDescription("Also delete files created by agents"),
      Options.withDefault(false),
    ),
    dryRun: Options.boolean("dry-run").pipe(
      Options.withDescription("Show what would be deleted without deleting"),
      Options.withDefault(false),
    ),
  },
  ({ filter, files, dryRun }) =>
    Effect.gen(function* () {
      const agentState = yield* AgentState;
      const fs = yield* FileSystem.FileSystem;

      const allAgents = yield* agentState.listAgents();

      const pattern = Option.getOrElse(filter, () => "*");
      const matchedAgents = allAgents.filter((agent) => match(agent, pattern));

      if (matchedAgents.length === 0) {
        return;
      }

      const prefix = dryRun ? "would delete" : "deleted";

      for (const agentKey of matchedAgents) {
        const state = yield* agentState.get(agentKey);

        if (files) {
          for (const file of state.filesCreated) {
            if (!dryRun) {
              yield* fs.remove(file).pipe(Effect.catchAll(() => Effect.void));
            }
            yield* Console.log(`${prefix}: ${file}`);
          }
        }

        if (!dryRun) {
          yield* agentState.delete(agentKey);
        }
        yield* Console.log(`${prefix}: ${agentKey}`);
      }
    }),
);

const cli = Command.run(Command.withSubcommands(mainCommand, [cleanCommand]), {
  name: "distilled",
  version: "0.1.0",
});

Effect.gen(function* () {
  const dotEnvProvider = yield* PlatformConfigProvider.fromDotEnv(".env").pipe(
    Effect.catchAll(() => Effect.succeed(ConfigProvider.fromEnv())),
  );
  yield* cli(process.argv).pipe(Effect.withConfigProvider(dotEnvProvider));
}).pipe(
  Logger.withMinimumLogLevel(
    process.env.DEBUG ? LogLevel.Debug : LogLevel.Info,
  ),
  Effect.scoped,
  Effect.provide(
    Layer.mergeAll(
      Layer.provideMerge(Anthropic, NodeHttpClient.layer),
      Layer.provideMerge(FileSystemAgentState, NodeContext.layer),
      Persistence.layerMemory,
    ),
  ),
  NodeRuntime.runMain,
);

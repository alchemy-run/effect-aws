#!/usr/bin/env bun
/**
 * distilled CLI
 *
 * Usage:
 *   distilled "implement the API"                     # send prompt to all agents
 *   distilled --filter "api/*" "implement the API"   # send prompt to agents matching api/*
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
import * as Logger from "effect/Logger";
import * as Option from "effect/Option";
import { spawn } from "../src/agent.ts";
import type { AgentDefinition, DistilledConfig } from "../src/config.ts";
import { loadConfig } from "../src/config.ts";
import { CodingToolsLayer } from "../src/tools/index.ts";
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
  },
  ({ prompt, filter, config, model, list }) =>
    Effect.gen(function* () {
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

      const allAgents = yield* resolveAgents(loadedConfig.agents);

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
          for (const { key } of sortedAgents) {
            yield* Console.log(`  ${key}`);
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

      yield* Console.log(`Sending to ${matchedAgents.length} agent(s):\n`);
      for (const { key } of matchedAgents) {
        yield* Console.log(`  ${key}`);
      }
      yield* Console.log();

      // Create model layer
      const modelLayer = getModelLayer(loadedConfig.model || "claude-sonnet");

      // TODO: make this configurable
      const isParallel = true;

      // Run each agent
      yield* Effect.all(
        matchedAgents.map((agentDef) =>
          Effect.gen(function* () {
            yield* Effect.gen(function* () {
              const agent = yield* spawn(agentDef, {
                onText: isParallel
                  ? undefined
                  : (delta) => process.stdout.write(delta),
              });

              // Build the prompt with context from the agent definition
              const contextPrompt = agent.definition.metadata?.description
                ? `Context: ${agent.definition.metadata.description}\n\n${promptValue}`
                : promptValue;

              yield* agent.send(contextPrompt);
              yield* Console.log("\n");
            }).pipe(
              Effect.provide(CodingToolsLayer),
              Effect.provide(modelLayer),
              Effect.provide(Anthropic),
              Effect.provide(NodeHttpClient.layer),
              Effect.scoped,
            );
          }),
        ),
        { concurrency: isParallel ? "unbounded" : 1 },
      );
      yield* Console.log("Done.");
    }),
);

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
 * Resolve agents from config - handles both array and Effect.
 */
const resolveAgents = (
  agents: DistilledConfig["agents"],
): Effect.Effect<AgentDefinition[]> => {
  if (!agents) {
    return Effect.succeed([]);
  }
  if (Effect.isEffect(agents)) {
    return agents as Effect.Effect<AgentDefinition[]>;
  }
  return Effect.succeed(agents);
};

/**
 * Filter agents by glob pattern.
 */
const matchAgents = (
  agents: AgentDefinition[],
  pattern: string,
): AgentDefinition[] => {
  return agents.filter((agent) => match(agent.key, pattern));
};

/**
 * Resolve the config path from user input.
 * - undefined or "." -> look for distilled.config.ts in current directory
 * - path to directory -> look for distilled.config.ts in that directory
 * - path to file -> use that file
 */
const resolveConfigPath = Effect.fn(function* (inputPath: string | undefined) {
  const fs = yield* FileSystem.FileSystem;
  const pathService = yield* Path.Path;

  // Default to current directory if no path provided
  const targetPath = !inputPath || inputPath === "." ? "." : inputPath;

  // Check if it's a directory
  const isDir = yield* fs.stat(targetPath).pipe(
    Effect.map((stat) => stat.type === "Directory"),
    Effect.catchAll(() => Effect.succeed(false)),
  );

  if (isDir) {
    // Look for default config file in directory
    const configPath = pathService.join(targetPath, DEFAULT_CONFIG_FILE);
    const exists = yield* fs.exists(configPath);
    if (!exists) {
      return undefined; // No config file found, use defaults
    }
    return pathService.resolve(configPath);
  }

  // It's a file path - verify it exists
  const exists = yield* fs.exists(targetPath);
  if (!exists) {
    return yield* Effect.fail(
      new Error(`Config file not found: ${targetPath}`),
    );
  }
  return pathService.resolve(targetPath);
});

const cli = Command.run(mainCommand, {
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
  Effect.provide(NodeContext.layer),
  Effect.provide(NodeHttpClient.layer),
  Effect.provide(Persistence.layerMemory),
  NodeRuntime.runMain,
);

import { FetchHttpClient, FileSystem, HttpClient } from "@effect/platform";
import { NodeContext } from "@effect/platform-node";
import * as Path from "@effect/platform/Path";
import * as PlatformConfigProvider from "@effect/platform/PlatformConfigProvider";
import { it } from "@effect/vitest";
import { ConfigProvider, LogLevel } from "effect";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Logger from "effect/Logger";
import * as Scope from "effect/Scope";
import * as Credentials from "../src/aws/credentials.ts";
import { Endpoint } from "../src/aws/endpoint.ts";
import { Region } from "../src/aws/region.ts";

type Provided =
  | Scope.Scope
  | HttpClient.HttpClient
  | FileSystem.FileSystem
  | Path.Path
  | Region
  | Credentials.Credentials;

const platform = Layer.mergeAll(
  NodeContext.layer,
  FetchHttpClient.layer,
  Logger.pretty,
);

export function test(
  name: string,
  options: {
    timeout?: number;
  },
  testCase: Effect.Effect<void, any, Provided>,
): void;

export function test(
  name: string,
  testCase: Effect.Effect<void, any, Provided>,
): void;

export function test(
  name: string,
  ...args:
    | [
        {
          timeout?: number;
        },
        Effect.Effect<void, any, Provided>,
      ]
    | [Effect.Effect<void, any, Provided>]
) {
  const [options = {}, testCase] =
    args.length === 1 ? [undefined, args[0]] : args;

  return it.scopedLive(
    name,
    () =>
      provideTestEnv(
        Effect.gen(function* () {
          const fs = yield* FileSystem.FileSystem;
          if (yield* fs.exists(".env")) {
            const configProvider = ConfigProvider.orElse(
              yield* PlatformConfigProvider.fromDotEnv(".env"),
              ConfigProvider.fromEnv,
            );
            return yield* testCase.pipe(
              Effect.withConfigProvider(configProvider),
            );
          } else {
            return yield* testCase.pipe(
              Effect.withConfigProvider(ConfigProvider.fromEnv()),
            );
          }
        }),
      ),
    options.timeout ?? 120_000,
  );
}

/** Run an Effect for use in beforeAll/beforeEach hooks */
export async function run<E>(
  effect: Effect.Effect<void, E, Provided>,
): Promise<void> {
  await Effect.runPromise(provideTestEnv(Effect.scoped(effect)));
}

/** Provide common layers and services to an effect */
function provideTestEnv<A, E, R extends Provided>(
  effect: Effect.Effect<A, E, R>,
) {
  let eff = effect.pipe(
    Effect.provide(platform),
    Effect.provideService(Region, "us-east-1"),
    Logger.withMinimumLogLevel(
      process.env.DEBUG ? LogLevel.Debug : LogLevel.Info,
    ),
    Effect.provide(NodeContext.layer),
  );

  if (process.env.LOCAL) {
    return eff.pipe(
      Effect.provideService(
        Endpoint,
        process.env.LOCALSTACK_HOST ?? "http://localhost:4566",
      ),
      Effect.provide(Credentials.mock),
    );
  } else {
    return eff.pipe(Effect.provide(Credentials.fromChain()));
  }
}

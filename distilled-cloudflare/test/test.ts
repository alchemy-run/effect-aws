import { FetchHttpClient, HttpClient } from "@effect/platform";
import { NodeContext } from "@effect/platform-node";
import { afterAll as _afterAll, beforeAll as _beforeAll, it } from "@effect/vitest";
import { LogLevel } from "effect";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Logger from "effect/Logger";
import * as Scope from "effect/Scope";
import * as Auth from "~/auth.ts";
import * as Retry from "~/retry.ts";

type Provided = Scope.Scope | HttpClient.HttpClient | Auth.ApiToken | Retry.Retry;

const platform = Layer.mergeAll(NodeContext.layer, FetchHttpClient.layer, Logger.pretty);

const TestLayer = Layer.mergeAll(platform, Auth.fromEnv());

type TestCase = Effect.Effect<void, any, Provided> | (() => Effect.Effect<void, any, Provided>);

function resolveTestCase(testCase: TestCase): Effect.Effect<void, any, Provided> {
  return typeof testCase === "function" ? testCase() : testCase;
}

export function test(name: string, options: { timeout?: number }, testCase: TestCase): void;

export function test(name: string, testCase: TestCase): void;

export function test(name: string, ...args: [{ timeout?: number }, TestCase] | [TestCase]) {
  const [options = {}, testCase] = args.length === 1 ? [undefined, args[0]] : args;

  return it(
    name,
    async () => {
      await Effect.runPromise(provideTestEnv(Effect.scoped(resolveTestCase(testCase))));
    },
    options.timeout ?? 120_000,
  );
}

test.skip = function (name: string, ...args: [{ timeout?: number }, TestCase] | [TestCase]) {
  const [options = {}] = args.length === 1 ? [undefined] : args;
  return it.skip(name, () => {}, options.timeout ?? 120_000);
};

/** Run an Effect for use in beforeAll/beforeEach hooks */
export async function run<E>(effect: Effect.Effect<void, E, Provided>): Promise<void> {
  await Effect.runPromise(provideTestEnv(Effect.scoped(effect)));
}

export const beforeAll = (effect: Effect.Effect<void, any, Provided>, timeout?: number) =>
  _beforeAll(() => run(effect), timeout ?? 120_000);

export const afterAll = (effect: Effect.Effect<void, any, Provided>, timeout?: number) =>
  _afterAll(() => run(effect), timeout ?? 120_000);

/** Provide common layers and services to an effect */
function provideTestEnv<A, E, R extends Provided>(effect: Effect.Effect<A, E, R>) {
  return effect.pipe(
    Logger.withMinimumLogLevel(process.env.DEBUG ? LogLevel.Debug : LogLevel.Info),
    Effect.provide(TestLayer),
    // Retry all transient errors (throttling, server errors, network errors) indefinitely
    // This ensures tests are resilient to temporary API issues
    Retry.transient,
  );
}

/**
 * Get the account ID from environment.
 * Throws if not set.
 */
export const getAccountId = (): string => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!accountId) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID environment variable is not set");
  }
  return accountId;
};

/**
 * Get the zone ID from environment.
 * Returns undefined if not set.
 */
export const getZoneId = (): string | undefined => {
  return process.env.CLOUDFLARE_ZONE_ID;
};

/**
 * Check if credentials are available.
 */
export const hasCredentials = (): boolean => {
  const hasToken = !!process.env.CLOUDFLARE_API_TOKEN;
  const hasKey = !!process.env.CLOUDFLARE_API_KEY && !!process.env.CLOUDFLARE_EMAIL;
  const hasAccount = !!process.env.CLOUDFLARE_ACCOUNT_ID;
  return hasAccount && (hasToken || hasKey);
};

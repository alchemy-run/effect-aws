import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Credentials from "../src/credentials.ts";

const withClearedAwsEnv = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
): Effect.Effect<A, E, R> =>
  Effect.acquireUseRelease(
    Effect.sync(() => {
      const previous = {
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN,
      };
      delete process.env.AWS_ACCESS_KEY_ID;
      delete process.env.AWS_SECRET_ACCESS_KEY;
      delete process.env.AWS_SESSION_TOKEN;
      return previous;
    }),
    () => effect,
    (previous) =>
      Effect.sync(() => {
        for (const [key, value] of Object.entries(previous)) {
          if (value === undefined) {
            delete process.env[key];
          } else {
            process.env[key] = value;
          }
        }
      }),
  );

describe("Credentials", () => {
  it("provides hints for known providers", () => {
    const cases: Array<{
      provider: string;
      expected: ReadonlyArray<string> | undefined;
    }> = [
      {
        provider: "env",
        expected: [
          "Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY (and AWS_SESSION_TOKEN if needed).",
        ],
      },
      {
        provider: "ini",
        expected: [
          "Check ~/.aws/credentials and ~/.aws/config for the profile.",
        ],
      },
      {
        provider: "chain",
        expected: [
          "Configure at least one credential source for the default chain.",
          "If using SSO, run `aws sso login` for the profile.",
        ],
      },
      {
        provider: "container",
        expected: ["Ensure a container credential endpoint is available."],
      },
      {
        provider: "http",
        expected: ["Ensure the configured credential endpoint is reachable."],
      },
      {
        provider: "process",
        expected: [
          "Set AWS_CREDENTIAL_PROCESS to a valid command and ensure it exits successfully.",
        ],
      },
      {
        provider: "token-file",
        expected: [
          "Set AWS_WEB_IDENTITY_TOKEN_FILE and ensure the file is readable.",
        ],
      },
      {
        provider: "unknown",
        expected: undefined,
      },
    ];

    for (const { provider, expected } of cases) {
      expect(Credentials._providerHints(provider as any)).toEqual(expected);
    }
  });

  it.effect("wraps env provider failures with AwsCredentialProviderError", () =>
    withClearedAwsEnv(
      Effect.gen(function* () {
        const error = yield* Effect.flip(
          Effect.gen(function* () {
            yield* Credentials.Credentials;
          }).pipe(Effect.provide(Credentials.fromEnv())),
        );

        if (!(error instanceof Credentials.AwsCredentialProviderError)) {
          throw new Error(
            `Expected AwsCredentialProviderError, got ${String(error)}`,
          );
        }

        expect(error.provider).toBe("env");
        expect(error.message).toBe("Failed to resolve credentials from env.");
        expect(error.hints).toEqual([
          "Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY (and AWS_SESSION_TOKEN if needed).",
        ]);
      }),
    ),
  );
});

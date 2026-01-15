import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import * as Category from "../src/category.ts";

// Test error classes with different categories
class TestBadRequestError extends S.TaggedError<TestBadRequestError>()(
  "TestBadRequestError",
  { message: S.String },
).pipe(Category.withBadRequestError) {}

class TestAuthError extends S.TaggedError<TestAuthError>()(
  "TestAuthError",
  {},
).pipe(Category.withAuthError) {}

class TestServerError extends S.TaggedError<TestServerError>()(
  "TestServerError",
  {},
).pipe(Category.withServerError, Category.withRetryableError) {}

class TestThrottlingError extends S.TaggedError<TestThrottlingError>()(
  "TestThrottlingError",
  { retryAfterSeconds: S.optional(S.Number) },
).pipe(Category.withThrottlingError) {}

class TestConflictError extends S.TaggedError<TestConflictError>()(
  "TestConflictError",
  {},
).pipe(Category.withConflictError) {}

class TestQuotaError extends S.TaggedError<TestQuotaError>()(
  "TestQuotaError",
  {},
).pipe(Category.withQuotaError) {}

class TestTimeoutError extends S.TaggedError<TestTimeoutError>()(
  "TestTimeoutError",
  {},
).pipe(Category.withTimeoutError) {}

class TestNetworkError extends S.TaggedError<TestNetworkError>()(
  "TestNetworkError",
  {},
).pipe(Category.withNetworkError) {}

class TestAbortedError extends S.TaggedError<TestAbortedError>()(
  "TestAbortedError",
  {},
).pipe(Category.withAbortedError) {}

class UncategorizedError extends S.TaggedError<UncategorizedError>()(
  "UncategorizedError",
  {},
) {}

describe("Category", () => {
  describe("hasCategory", () => {
    it("returns true when error has the category", () => {
      const error = new TestBadRequestError({ message: "test" });
      expect(Category.hasCategory(error, Category.BadRequestError)).toBe(true);
    });

    it("returns false when error does not have the category", () => {
      const error = new TestBadRequestError({ message: "test" });
      expect(Category.hasCategory(error, Category.AuthError)).toBe(false);
    });

    it("returns false for uncategorized errors", () => {
      const error = new UncategorizedError();
      expect(Category.hasCategory(error, Category.BadRequestError)).toBe(false);
    });

    it("returns false for non-error values", () => {
      expect(Category.hasCategory(null, Category.BadRequestError)).toBe(false);
      expect(Category.hasCategory(undefined, Category.BadRequestError)).toBe(
        false,
      );
      expect(Category.hasCategory("string", Category.BadRequestError)).toBe(
        false,
      );
    });

    it("handles errors with multiple categories", () => {
      const error = new TestServerError();
      expect(Category.hasCategory(error, Category.ServerError)).toBe(true);
      expect(Category.hasCategory(error, Category.RetryableError)).toBe(true);
      expect(Category.hasCategory(error, Category.AuthError)).toBe(false);
    });
  });

  describe("is* predicates", () => {
    it("isBadRequestError", () => {
      expect(
        Category.isBadRequestError(
          new TestBadRequestError({ message: "test" }),
        ),
      ).toBe(true);
      expect(Category.isBadRequestError(new TestAuthError())).toBe(false);
    });

    it("isAuthError", () => {
      expect(Category.isAuthError(new TestAuthError())).toBe(true);
      expect(
        Category.isAuthError(new TestBadRequestError({ message: "test" })),
      ).toBe(false);
    });

    it("isServerError", () => {
      expect(Category.isServerError(new TestServerError())).toBe(true);
      expect(Category.isServerError(new TestAuthError())).toBe(false);
    });

    it("isThrottlingError", () => {
      expect(Category.isThrottlingError(new TestThrottlingError({}))).toBe(
        true,
      );
      expect(Category.isThrottlingError(new TestAuthError())).toBe(false);
    });

    it("isConflictError", () => {
      expect(Category.isConflictError(new TestConflictError())).toBe(true);
      expect(Category.isConflictError(new TestAuthError())).toBe(false);
    });

    it("isQuotaError", () => {
      expect(Category.isQuotaError(new TestQuotaError())).toBe(true);
      expect(Category.isQuotaError(new TestAuthError())).toBe(false);
    });

    it("isTimeoutError", () => {
      expect(Category.isTimeoutError(new TestTimeoutError())).toBe(true);
      expect(Category.isTimeoutError(new TestAuthError())).toBe(false);
    });

    it("isNetworkError", () => {
      expect(Category.isNetworkError(new TestNetworkError())).toBe(true);
      expect(Category.isNetworkError(new TestAuthError())).toBe(false);
    });

    it("isAbortedError", () => {
      expect(Category.isAbortedError(new TestAbortedError())).toBe(true);
      expect(Category.isAbortedError(new TestAuthError())).toBe(false);
    });

    it("isRetryableError", () => {
      expect(Category.isRetryableError(new TestServerError())).toBe(true);
      expect(Category.isRetryableError(new TestAuthError())).toBe(false);
    });
  });

  describe("catch* catchers", () => {
    it.effect("catchBadRequestError catches bad request errors", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(
          new TestBadRequestError({ message: "test" }),
        ).pipe(Category.catchBadRequestError(() => Effect.succeed("caught")));
        expect(result).toBe("caught");
      }),
    );

    it.effect("catchBadRequestError does not catch other errors", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestAuthError()).pipe(
          Category.catchBadRequestError(() => Effect.succeed("caught")),
          Effect.catchAll(() => Effect.succeed("not caught")),
        );
        expect(result).toBe("not caught");
      }),
    );

    it.effect("catchAuthError catches auth errors", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestAuthError()).pipe(
          Category.catchAuthError(() => Effect.succeed("caught")),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("catchServerError catches server errors", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestServerError()).pipe(
          Category.catchServerError(() => Effect.succeed("caught")),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("catchThrottlingError catches throttling errors", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestThrottlingError({})).pipe(
          Category.catchThrottlingError(() => Effect.succeed("caught")),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("catchConflictError catches conflict errors", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestConflictError()).pipe(
          Category.catchConflictError(() => Effect.succeed("caught")),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("catchQuotaError catches quota errors", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestQuotaError()).pipe(
          Category.catchQuotaError(() => Effect.succeed("caught")),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("catchTimeoutError catches timeout errors", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestTimeoutError()).pipe(
          Category.catchTimeoutError(() => Effect.succeed("caught")),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("catchNetworkError catches network errors", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestNetworkError()).pipe(
          Category.catchNetworkError(() => Effect.succeed("caught")),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("catchAbortedError catches aborted errors", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestAbortedError()).pipe(
          Category.catchAbortedError(() => Effect.succeed("caught")),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("catchRetryableError catches retryable errors", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestServerError()).pipe(
          Category.catchRetryableError(() => Effect.succeed("caught")),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("error handler receives the error", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(
          new TestBadRequestError({ message: "hello" }),
        ).pipe(
          Category.catchBadRequestError((err) => Effect.succeed(err.message)),
        );
        expect(result).toBe("hello");
      }),
    );
  });

  describe("catchErrors (multi-category catcher)", () => {
    it.effect("catches errors with single category", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(
          new TestBadRequestError({ message: "test" }),
        ).pipe(
          Category.catchErrors(Category.BadRequestError, () =>
            Effect.succeed("caught"),
          ),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("catches errors matching any of multiple categories", () =>
      Effect.gen(function* () {
        // TestServerError has both serverError and retryableError
        const result = yield* Effect.fail(new TestServerError()).pipe(
          Category.catchErrors(
            Category.ServerError,
            Category.RetryableError,
            () => Effect.succeed("caught"),
          ),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("catches auth error when listing multiple categories", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestAuthError()).pipe(
          Category.catchErrors(
            Category.BadRequestError,
            Category.AuthError,
            () => Effect.succeed("caught"),
          ),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("does not catch errors not in category list", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestAuthError()).pipe(
          Category.catchErrors(
            Category.BadRequestError,
            Category.ServerError,
            () => Effect.succeed("caught"),
          ),
          Effect.catchAll(() => Effect.succeed("not caught")),
        );
        expect(result).toBe("not caught");
      }),
    );

    it.effect("catches errors using string literals", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(
          new TestBadRequestError({ message: "test" }),
        ).pipe(
          Category.catchErrors("BadRequestError", () =>
            Effect.succeed("caught"),
          ),
        );
        expect(result).toBe("caught");
      }),
    );

    it.effect("catches multiple categories using string literals", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(new TestAuthError()).pipe(
          Category.catchErrors("BadRequestError", "AuthError", () =>
            Effect.succeed("caught"),
          ),
        );
        expect(result).toBe("caught");
      }),
    );
  });

  describe("catchCategory (legacy)", () => {
    it.effect("catches errors with specified category", () =>
      Effect.gen(function* () {
        const result = yield* Effect.fail(
          new TestBadRequestError({ message: "test" }),
        ).pipe(
          Category.catchCategory(Category.BadRequestError, () =>
            Effect.succeed("caught"),
          ),
        );
        expect(result).toBe("caught");
      }),
    );
  });

  describe("isTransientError", () => {
    it("returns true for retryable errors", () => {
      expect(Category.isTransientError(new TestServerError())).toBe(true);
    });

    it("returns true for throttling errors", () => {
      expect(Category.isTransientError(new TestThrottlingError({}))).toBe(true);
    });

    it("returns true for network errors", () => {
      expect(Category.isTransientError(new TestNetworkError())).toBe(true);
    });

    it("returns false for auth errors", () => {
      expect(Category.isTransientError(new TestAuthError())).toBe(false);
    });

    it("returns false for bad request errors", () => {
      expect(
        Category.isTransientError(new TestBadRequestError({ message: "test" })),
      ).toBe(false);
    });
  });

  describe("use with Effect.retry", () => {
    it.effect("can use predicates with Effect.retry", () =>
      Effect.gen(function* () {
        let attempts = 0;
        const result = yield* Effect.sync(() => {
          attempts++;
          if (attempts < 3) {
            throw new TestServerError();
          }
          return "success";
        }).pipe(
          Effect.catchAllDefect((e) =>
            e instanceof TestServerError ? Effect.fail(e) : Effect.die(e),
          ),
          Effect.retry({
            times: 3,
            while: Category.isServerError,
          }),
        );
        expect(result).toBe("success");
        expect(attempts).toBe(3);
      }),
    );
  });
});

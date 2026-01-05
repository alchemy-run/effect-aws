import { AwsV4Signer } from "aws4fetch";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Option from "effect/Option";
import type * as ParseResult from "effect/ParseResult";
import * as Redacted from "effect/Redacted";
import * as Ref from "effect/Ref";
import * as Stream from "effect/Stream";
import { Credentials } from "./aws/credentials.ts";
import { Endpoint } from "./aws/endpoint.ts";
import {
  isTransientNetworkError,
  TransientFetchError,
  UnknownAwsError,
  type CommonAwsError,
} from "./aws/errors.ts";
import { Region } from "./aws/region.ts";
import type { Operation } from "./operation.ts";
import { makeRequestBuilder } from "./request-builder.ts";
import { makeResponseParser } from "./response-parser.ts";
import { makeDefault, Retry } from "./retry-policy.ts";
import type {
  EndpointError,
  NoMatchingRuleError,
} from "./rules-engine/index.ts";
import { makeRulesResolver } from "./rules-engine/resolver.ts";
import { getAwsAuthSigv4, getPath } from "./traits.ts";

export const make = <Op extends Operation>(
  initOperation: () => Op,
): ((
  payload: Operation.Input<Op>,
) => Effect.Effect<
  Operation.Output<Op>,
  | Operation.Error<Op>
  | ParseResult.ParseError
  | UnknownAwsError
  | CommonAwsError
  | TransientFetchError
  | EndpointError
  | NoMatchingRuleError,
  Region | Credentials
>) => {
  const op = initOperation();
  let _init;
  const init = () => {
    const inputAst = op.input.ast;

    // Create request builder and response parser (preprocessing done once)
    const buildRequest = makeRequestBuilder(op);
    const parseResponse = makeResponseParser(op);

    // Get SigV4 service name from annotations
    const sigv4 = getAwsAuthSigv4(inputAst);

    // Create rules resolver (if rule set available)
    const rulesResolver = makeRulesResolver(op);

    return {
      buildRequest,
      parseResponse,
      sigv4,
      rulesResolver,
    };
  };

  const fn = Effect.fnUntraced(function* (payload: Operation.Input<Op>) {
    const { buildRequest, parseResponse, sigv4, rulesResolver } = (_init ??=
      init()) as ReturnType<typeof init>;
    yield* Effect.logDebug("Payload", payload);

    // Build request using the request builder (handles protocol serialization + middleware)
    const request = yield* buildRequest(payload);

    yield* Effect.logDebug("Built Request", request);

    // Sign the request
    const credentials = yield* Credentials;
    const region = yield* Region;
    const serviceName = sigv4?.name ?? "s3";

    // Resolve endpoint and adjust request path if needed
    let endpoint: string;
    let resolvedRequest = request;
    const customEndpoint = yield* Effect.serviceOption(Endpoint);

    if (Option.isSome(customEndpoint)) {
      // User provided a custom endpoint - use it directly
      endpoint = customEndpoint.value;
    } else if (rulesResolver) {
      // Use the rules resolver - it handles endpoint resolution AND path adjustment
      const resolved = yield* rulesResolver({
        input: payload,
        region,
        request,
      });
      endpoint = resolved.endpoint.url;
      resolvedRequest = resolved.request;
    } else {
      // Fallback to static endpoint
      endpoint = `https://${serviceName}.${region}.amazonaws.com`;
    }

    // Build full URL with query string
    const queryString = Object.entries(resolvedRequest.query)
      .filter(([_, v]) => v !== undefined)
      .flatMap(([k, v]) => {
        // Handle arrays as repeated query parameters (e.g., tagKeys=A&tagKeys=B)
        if (Array.isArray(v)) {
          return v.map((item) =>
            item
              ? `${encodeURIComponent(k)}=${encodeURIComponent(item)}`
              : encodeURIComponent(k),
          );
        }
        return v
          ? `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
          : encodeURIComponent(k);
      })
      .join("&");

    const fullPath = queryString
      ? `${resolvedRequest.path}?${queryString}`
      : resolvedRequest.path;

    // For streaming bodies (ReadableStream), we can't compute a hash
    // so we use UNSIGNED-PAYLOAD and don't pass the body to the signer
    const isStreamingBody = resolvedRequest.body instanceof ReadableStream;
    // Check if content-sha256 header is already set (e.g., by checksum middleware)
    const hasContentSha256 = Object.keys(resolvedRequest.headers).some(
      (k) => k.toLowerCase() === "x-amz-content-sha256",
    );
    const signingHeaders =
      isStreamingBody && !hasContentSha256
        ? {
            ...resolvedRequest.headers,
            "X-Amz-Content-Sha256": "UNSIGNED-PAYLOAD",
          }
        : resolvedRequest.headers;

    const signer = new AwsV4Signer({
      method: resolvedRequest.method,
      url: `${endpoint}${fullPath}`,
      headers: signingHeaders,
      // Don't pass streaming body to signer - it can't be hashed
      body: isStreamingBody
        ? undefined
        : resolvedRequest.body instanceof Uint8Array
          ? Buffer.from(resolvedRequest.body)
          : resolvedRequest.body,
      accessKeyId: Redacted.value(credentials.accessKeyId),
      secretAccessKey: Redacted.value(credentials.secretAccessKey),
      sessionToken: credentials.sessionToken
        ? Redacted.value(credentials.sessionToken)
        : undefined,
      service: serviceName,
      region,
    });
    const signedRequest = yield* Effect.promise(() => signer.sign());

    // Determine the body for fetch
    // For streaming bodies, use the original request.body (not from signedRequest)
    let fetchBody: BodyInit | undefined;

    if (isStreamingBody) {
      // Streaming body was not passed to signer, use original
      fetchBody = resolvedRequest.body as ReadableStream;
    } else if (signedRequest.body) {
      if (typeof signedRequest.body === "string") {
        fetchBody = signedRequest.body;
      } else if (
        signedRequest.body instanceof Uint8Array ||
        signedRequest.body instanceof ArrayBuffer
      ) {
        fetchBody = signedRequest.body;
      } else if (signedRequest.body instanceof ReadableStream) {
        fetchBody = signedRequest.body;
      }
    }

    // Build headers object for fetch
    const fetchHeaders: Record<string, string> = {};
    signedRequest.headers.forEach((value, key) => {
      fetchHeaders[key] = value;
    });

    // Make the fetch request with full control
    // The signal from Effect.tryPromise enables proper interruption
    const rawResponse = yield* Effect.tryPromise({
      try: (signal) =>
        fetch(signedRequest.url, {
          method: signedRequest.method,
          headers: fetchHeaders,
          body: fetchBody,
          signal, // Propagate abort signal for Effect interruption
          // Enable streaming uploads - required for ReadableStream bodies
          ...(isStreamingBody ? { duplex: "half" as const } : {}),
        } as RequestInit),
      catch: (error) => {
        // Check if this is a transient network error that should be retried
        if (isTransientNetworkError(error)) {
          return new TransientFetchError({
            message: `Fetch error: ${error}`,
            cause: error,
          });
        }
        return new Error(`Fetch error: ${error}`);
      },
    });

    yield* Effect.logDebug("Raw Response Status", rawResponse.status);

    // Convert response headers to Record
    const responseHeaders: Record<string, string> = {};
    rawResponse.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Create response body stream
    const contentLength = responseHeaders["content-length"];
    const isEmptyBody = contentLength === "0" || rawResponse.status === 204;
    const responseBody = isEmptyBody
      ? new ReadableStream<Uint8Array>({ start: (c) => c.close() })
      : (rawResponse.body ??
        new ReadableStream<Uint8Array>({ start: (c) => c.close() }));

    // Parse response using the response parser
    // Handles both success (protocol deserialization + schema decoding)
    // and error responses (error deserialization + schema matching)
    const parsed = yield* parseResponse({
      status: rawResponse.status,
      statusText: rawResponse.statusText,
      headers: responseHeaders,
      body: responseBody,
    });

    yield* Effect.logDebug("Parsed Response", parsed);

    return parsed;
  });

  return Object.assign(
    Effect.fn(function* (payload: Operation.Input<Op>) {
      const lastError = yield* Ref.make<unknown>(undefined);
      const policy = (yield* Effect.serviceOption(Retry)).pipe(
        Option.map((value) =>
          typeof value === "function" ? value(lastError) : value,
        ),
        Option.getOrElse(() => makeDefault(lastError)),
      );

      return yield* pipe(
        fn(payload),
        Effect.tapError((error) => Ref.set(lastError, error)),
        policy.while
          ? (eff) =>
              Effect.retry(eff, {
                while: policy.while,
                schedule: policy.schedule,
              })
          : (eff) => eff,
      );
    }),
    op,
  );
};

// =============================================================================
// Paginated Operation Types
// =============================================================================

/** Error types returned by paginated operations */
type PaginatedErrors =
  | ParseResult.ParseError
  | UnknownAwsError
  | CommonAwsError
  | TransientFetchError
  | EndpointError
  | NoMatchingRuleError;

/** Extract the item type from a paginated operation's output */
type PaginatedItemType<Op extends Operation> = Op["pagination"] extends {
  items: string;
}
  ? Op["pagination"]["items"] extends keyof Operation.Output<Op>
    ? Operation.Output<Op>[Op["pagination"]["items"]] extends
        | readonly (infer Item)[]
        | undefined
      ? Item
      : never
    : never
  : never;

/** A paginated operation with both Effect and Stream interfaces */
export interface PaginatedOperation<Op extends Operation> {
  /** Call the operation once, returning a single page */
  (
    payload: Operation.Input<Op>,
  ): Effect.Effect<
    Operation.Output<Op>,
    Operation.Error<Op> | PaginatedErrors,
    Region | Credentials
  >;

  /** Stream all pages (full response objects) */
  pages: (
    payload: Operation.Input<Op>,
  ) => Stream.Stream<
    Operation.Output<Op>,
    Operation.Error<Op> | PaginatedErrors,
    Region | Credentials
  >;

  /** Stream individual items from the paginated field across all pages */
  items: (
    payload: Operation.Input<Op>,
  ) => Stream.Stream<
    PaginatedItemType<Op>,
    Operation.Error<Op> | PaginatedErrors,
    Region | Credentials
  >;

  /** The operation metadata */
  input: Op["input"];
  output: Op["output"];
  errors: Op["errors"];
  pagination: Op["pagination"];
}

/**
 * Create a paginated operation that supports both single-call and streaming interfaces.
 *
 * @param initOperation - Factory function that returns the operation definition
 * @returns A callable with `.pages()` and `.items()` methods for paginated access
 */
export const makePaginated = <Op extends Operation>(
  initOperation: () => Op,
): PaginatedOperation<Op> => {
  const op = initOperation();
  const pagination = op.pagination!;

  // Reuse API.make for the Effect-based single-call interface
  const baseFn = make(initOperation);

  type State = { token: unknown; done: boolean };
  type Errors = Operation.Error<Op> | PaginatedErrors;
  type Deps = Region | Credentials;

  // Stream all pages (full response objects)
  const pagesFn = (
    payload: Operation.Input<Op>,
  ): Stream.Stream<Operation.Output<Op>, Errors, Deps> => {
    const unfoldFn = (
      state: State,
    ): Effect.Effect<
      Option.Option<readonly [Operation.Output<Op>, State]>,
      Errors,
      Deps
    > =>
      Effect.gen(function* () {
        if (state.done) {
          return Option.none();
        }

        // Build the request with the continuation token
        const requestPayload =
          state.token !== undefined
            ? { ...payload, [pagination.inputToken]: state.token }
            : payload;

        // Make the API call
        const response = yield* baseFn(requestPayload);

        // Extract the next token using path traversal
        const nextToken = getPath(response, pagination.outputToken);

        // Return the full page and next state
        const nextState: State = {
          token: nextToken,
          done: nextToken === undefined || nextToken === null,
        };
        return Option.some([response, nextState] as const);
      });

    return Stream.unfoldEffect(
      { token: undefined, done: false } as State,
      unfoldFn,
    );
  };

  // Stream individual items from the paginated field
  const itemsFn = (
    payload: Operation.Input<Op>,
  ): Stream.Stream<PaginatedItemType<Op>, Errors, Deps> => {
    if (!pagination.items) {
      // If no items path is specified, this operation doesn't support .items()
      // Return an empty stream (caller should use .pages() instead)
      return Stream.empty as Stream.Stream<PaginatedItemType<Op>, Errors, Deps>;
    }

    return pagesFn(payload).pipe(
      Stream.flatMap((page) => {
        const items = getPath(page, pagination.items!) as
          | PaginatedItemType<Op>[]
          | undefined;
        return Stream.fromIterable(items ?? []);
      }),
    );
  };

  // Return callable with .pages and .items methods and operation metadata
  return Object.assign(baseFn, {
    pages: pagesFn,
    items: itemsFn,
    input: op.input,
    output: op.output,
    errors: op.errors,
    pagination: op.pagination,
  }) as PaginatedOperation<Op>;
};

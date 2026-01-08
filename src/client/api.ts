import { HttpBody, HttpClient, HttpClientRequest } from "@effect/platform";
import { AwsV4Signer } from "aws4fetch";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Option from "effect/Option";
import * as Redacted from "effect/Redacted";
import * as Ref from "effect/Ref";
import * as Stream from "effect/Stream";

import { makeDefault, Retry } from "../retry.ts";
import { makeEndpointResolver } from "../rules-engine/endpoint-resolver.ts";
import { getAwsAuthSigv4, getPath } from "../traits.ts";
import type { Operation } from "./operation.ts";
import { makeRequestBuilder } from "./request-builder.ts";
import { makeResponseParser } from "./response-parser.ts";

import { Credentials, Endpoint, Region } from "../index.ts";

export const make = <Op extends Operation>(initOperation: () => Op): any => {
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
    const resolveEndpoint = makeEndpointResolver(op);

    return {
      buildRequest,
      parseResponse,
      sigv4,
      resolveEndpoint,
    };
  };

  const fn = Effect.fnUntraced(function* (payload: Operation.Input<Op>) {
    const {
      buildRequest,
      parseResponse,
      sigv4,
      resolveEndpoint: rulesResolver,
    } = (_init ??= init()) as ReturnType<typeof init>;
    yield* Effect.logDebug("Payload", payload);

    // Build request using the request builder (handles protocol serialization + middleware)
    const request = yield* buildRequest(payload);

    yield* Effect.logDebug("Built Request", request);

    // Sign the request
    const credentials = yield* Credentials.Credentials;
    const region = yield* Region.Region;
    const serviceName = sigv4?.name ?? "s3";

    // Resolve endpoint and adjust request path if needed
    let endpoint: string;
    let resolvedRequest = request;
    const customEndpoint = yield* Effect.serviceOption(Endpoint.Endpoint);

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

    // Build headers object from signed request
    const signedHeaders: Record<string, string> = {};
    signedRequest.headers.forEach((value, key) => {
      signedHeaders[key] = value;
    });

    // Get content type from signed headers for body constructor
    const contentType = signedHeaders["content-type"];

    // Build HttpBody based on body type
    // We must pass the content type to avoid HttpBody overriding the signed Content-Type header
    let httpBody: HttpBody.HttpBody;
    if (isStreamingBody) {
      // Convert ReadableStream to Effect Stream for HttpClient
      const effectStream = Stream.fromReadableStream(
        () => resolvedRequest.body as ReadableStream<Uint8Array>,
        (error) => new Error(String(error)),
      );
      httpBody = HttpBody.stream(effectStream, contentType);
    } else if (resolvedRequest.body === undefined) {
      httpBody = HttpBody.empty;
    } else if (typeof resolvedRequest.body === "string") {
      httpBody = HttpBody.text(resolvedRequest.body, contentType);
    } else if (resolvedRequest.body instanceof Uint8Array) {
      httpBody = HttpBody.uint8Array(resolvedRequest.body, contentType);
    } else {
      httpBody = HttpBody.empty;
    }

    // Build HttpClientRequest
    // Note: setBody must come after setHeaders because setBody adds content-type/content-length
    // from the HttpBody, which should match our signed headers
    const httpRequest = pipe(
      HttpClientRequest.make(
        resolvedRequest.method as
          | "GET"
          | "POST"
          | "PUT"
          | "DELETE"
          | "PATCH"
          | "HEAD"
          | "OPTIONS",
      )(signedRequest.url),
      HttpClientRequest.setHeaders(signedHeaders),
      HttpClientRequest.setBody(httpBody),
    );

    // Execute request via HttpClient
    const client = yield* HttpClient.HttpClient;
    const rawResponse = yield* client.execute(httpRequest);

    yield* Effect.logDebug("Raw Response Status", rawResponse.status);

    // Convert response headers to Record
    const responseHeaders = rawResponse.headers as Record<string, string>;

    // Create response body stream
    // Convert Effect Stream to ReadableStream for the response parser
    // Note: HEAD requests never have a body, and some responses have no body (204, etc.)
    // Effect's HttpClientResponse.stream throws an error for empty bodies, so we need to check first
    const contentLength = responseHeaders["content-length"];
    const isEmptyBody =
      resolvedRequest.method === "HEAD" ||
      contentLength === "0" ||
      rawResponse.status === 204;
    const responseBody = isEmptyBody
      ? new ReadableStream<Uint8Array>({ start: (c) => c.close() })
      : yield* Stream.toReadableStreamEffect(rawResponse.stream);

    // Parse response using the response parser
    // Handles both success (protocol deserialization + schema decoding)
    // and error responses (error deserialization + schema matching)
    const parsed = yield* parseResponse({
      status: rawResponse.status,
      statusText: "OK",
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

export const makePaginated = <Op extends Operation>(
  initOperation: () => Op,
): any => {
  const op = initOperation();
  const pagination = op.pagination!;

  // Reuse API.make for the Effect-based single-call interface
  const baseFn = make(initOperation);

  // Stream all pages (full response objects)
  const pagesFn = (payload: Operation.Input<Op>) => {
    type State = { token: unknown; done: boolean };
    const unfoldFn = (state: State) =>
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
  const itemsFn = (payload: Operation.Input<Op>) => {
    if (!pagination.items) {
      return Stream.empty;
    }

    return pagesFn(payload).pipe(
      Stream.flatMap((page) => {
        const items = getPath(page, pagination.items!) as unknown[] | undefined;
        return Stream.fromIterable(items ?? []);
      }),
    );
  };

  return Object.assign(baseFn, {
    pages: pagesFn,
    items: itemsFn,
    input: op.input,
    output: op.output,
    errors: op.errors,
    pagination: op.pagination,
  });
};

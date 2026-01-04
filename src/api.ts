import { AwsV4Signer } from "aws4fetch";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import type * as ParseResult from "effect/ParseResult";
import * as Redacted from "effect/Redacted";
import { Credentials } from "./aws/credentials.ts";
import { Endpoint } from "./aws/endpoint.ts";
import { UnknownAwsError, type CommonAwsError } from "./aws/errors.ts";
import { Region } from "./aws/region.ts";
import type { Operation } from "./operation.ts";
import { makeRequestBuilder } from "./request-builder.ts";
import { makeResponseParser } from "./response-parser.ts";
import type {
  EndpointError,
  NoMatchingRuleError,
} from "./rules-engine/index.ts";
import { makeRulesResolver } from "./rules-engine/resolver.ts";
import { getAwsAuthSigv4 } from "./traits.ts";

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
      .map(([k, v]) =>
        v
          ? `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
          : encodeURIComponent(k),
      )
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
      catch: (error) => new Error(`Fetch error: ${error}`),
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

  return Object.assign(fn, op);
};

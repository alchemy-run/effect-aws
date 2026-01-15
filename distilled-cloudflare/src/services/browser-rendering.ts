/**
 * Cloudflare BROWSER-RENDERING API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service browser-rendering
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Content
// =============================================================================

export interface CreateContentRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: Cache TTL default is 5s. Set to 0 to disable. */
  cacheTTL?: number;
  /** Body param: The maximum duration allowed for the browser action to complete after the page has loaded (such as taking screenshots, extracting content, or generating PDFs). If this time limit is exceed */
  actionTimeout?: number;
  /** Body param: Adds a `<script>` tag into the page with the desired URL or content. */
  addScriptTag?: { id?: string; content?: string; type?: string; url?: string }[];
  /** Body param: Adds a `<link rel="stylesheet">` tag into the page with the desired URL or a `<style type="text/css">` tag with the content. */
  addStyleTag?: { content?: string; url?: string }[];
  /** Body param: Only allow requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  allowRequestPattern?: string[];
  /** Body param: Only allow requests that match the provided resource types, eg. 'image' or 'script'. */
  allowResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: Provide credentials for HTTP authentication. */
  authenticate?: { password: string; username: string };
  /** Body param: Attempt to proceed when 'awaited' events fail or timeout. */
  bestAttempt?: boolean;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setcookie). */
  cookies?: {
    name: string;
    value: string;
    domain?: string;
    expires?: number;
    httpOnly?: boolean;
    partitionKey?: string;
    path?: string;
    priority?: "Low" | "Medium" | "High";
    sameParty?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
    sourcePort?: number;
    sourceScheme?: "Unset" | "NonSecure" | "Secure";
    url?: string;
  }[];
  /** Body param: */
  emulateMediaType?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.gotooptions). */
  gotoOptions?: {
    referer?: string;
    referrerPolicy?: string;
    timeout?: number;
    waitUntil?:
      | "load"
      | "domcontentloaded"
      | "networkidle0"
      | "networkidle2"
      | ("load" | "domcontentloaded" | "networkidle0" | "networkidle2")[];
  };
  /** Body param: Set the content of the page, eg: `<h1>Hello World!!</h1>`. Either `html` or `url` must be set. */
  html?: string;
  /** Body param: Block undesired requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  rejectRequestPattern?: string[];
  /** Body param: Block undesired requests that match the provided resource types, eg. 'image' or 'script'. */
  rejectResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: */
  setExtraHTTPHeaders?: Record<string, unknown>;
  /** Body param: */
  setJavaScriptEnabled?: boolean;
  /** Body param: URL to navigate to, eg. `https://example.com`. */
  url?: string;
  /** Body param: */
  userAgent?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setviewport). */
  viewport?: {
    height: number;
    width: number;
    deviceScaleFactor?: number;
    hasTouch?: boolean;
    isLandscape?: boolean;
    isMobile?: boolean;
  };
  /** Body param: Wait for the selector to appear in page. Check [options](https://pptr.dev/api/puppeteer.page.waitforselector). */
  waitForSelector?: { selector: string; hidden?: true; timeout?: number; visible?: true };
  /** Body param: Waits for a specified timeout before continuing. */
  waitForTimeout?: number;
}

export const CreateContentRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cacheTTL: Schema.optional(Schema.Number).pipe(T.HttpQuery("cacheTTL")),
  actionTimeout: Schema.optional(Schema.Number),
  addScriptTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        content: Schema.optional(Schema.String),
        type: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  addStyleTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        content: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  allowRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  allowResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  authenticate: Schema.optional(
    Schema.Struct({
      password: Schema.String,
      username: Schema.String,
    }),
  ),
  bestAttempt: Schema.optional(Schema.Boolean),
  cookies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
        domain: Schema.optional(Schema.String),
        expires: Schema.optional(Schema.Number),
        httpOnly: Schema.optional(Schema.Boolean),
        partitionKey: Schema.optional(Schema.String),
        path: Schema.optional(Schema.String),
        priority: Schema.optional(Schema.Literal("Low", "Medium", "High")),
        sameParty: Schema.optional(Schema.Boolean),
        sameSite: Schema.optional(Schema.Literal("Strict", "Lax", "None")),
        secure: Schema.optional(Schema.Boolean),
        sourcePort: Schema.optional(Schema.Number),
        sourceScheme: Schema.optional(Schema.Literal("Unset", "NonSecure", "Secure")),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  emulateMediaType: Schema.optional(Schema.String),
  gotoOptions: Schema.optional(
    Schema.Struct({
      referer: Schema.optional(Schema.String),
      referrerPolicy: Schema.optional(Schema.String),
      timeout: Schema.optional(Schema.Number),
      waitUntil: Schema.optional(
        Schema.Union(
          Schema.Literal("load"),
          Schema.Literal("domcontentloaded"),
          Schema.Literal("networkidle0"),
          Schema.Literal("networkidle2"),
          Schema.Array(Schema.Literal("load", "domcontentloaded", "networkidle0", "networkidle2")),
        ),
      ),
    }),
  ),
  html: Schema.optional(Schema.String),
  rejectRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  rejectResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  setExtraHTTPHeaders: Schema.optional(Schema.Struct({})),
  setJavaScriptEnabled: Schema.optional(Schema.Boolean),
  url: Schema.optional(Schema.String),
  userAgent: Schema.optional(Schema.String),
  viewport: Schema.optional(
    Schema.Struct({
      height: Schema.Number,
      width: Schema.Number,
      deviceScaleFactor: Schema.optional(Schema.Number),
      hasTouch: Schema.optional(Schema.Boolean),
      isLandscape: Schema.optional(Schema.Boolean),
      isMobile: Schema.optional(Schema.Boolean),
    }),
  ),
  waitForSelector: Schema.optional(
    Schema.Struct({
      selector: Schema.String,
      hidden: Schema.optional(Schema.Literal(true)),
      timeout: Schema.optional(Schema.Number),
      visible: Schema.optional(Schema.Literal(true)),
    }),
  ),
  waitForTimeout: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/browser-rendering/content" }),
) as unknown as Schema.Schema<CreateContentRequest>;

export type CreateContentResponse = string;

export const CreateContentResponse =
  Schema.String as unknown as Schema.Schema<CreateContentResponse>;

export const createContent = API.make(() => ({
  input: CreateContentRequest,
  output: CreateContentResponse,
  errors: [],
}));

// =============================================================================
// Json
// =============================================================================

export interface CreateJsonRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: Cache TTL default is 5s. Set to 0 to disable. */
  cacheTTL?: number;
  /** Body param: The maximum duration allowed for the browser action to complete after the page has loaded (such as taking screenshots, extracting content, or generating PDFs). If this time limit is exceed */
  actionTimeout?: number;
  /** Body param: Adds a `<script>` tag into the page with the desired URL or content. */
  addScriptTag?: { id?: string; content?: string; type?: string; url?: string }[];
  /** Body param: Adds a `<link rel="stylesheet">` tag into the page with the desired URL or a `<style type="text/css">` tag with the content. */
  addStyleTag?: { content?: string; url?: string }[];
  /** Body param: Only allow requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  allowRequestPattern?: string[];
  /** Body param: Only allow requests that match the provided resource types, eg. 'image' or 'script'. */
  allowResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: Provide credentials for HTTP authentication. */
  authenticate?: { password: string; username: string };
  /** Body param: Attempt to proceed when 'awaited' events fail or timeout. */
  bestAttempt?: boolean;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setcookie). */
  cookies?: {
    name: string;
    value: string;
    domain?: string;
    expires?: number;
    httpOnly?: boolean;
    partitionKey?: string;
    path?: string;
    priority?: "Low" | "Medium" | "High";
    sameParty?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
    sourcePort?: number;
    sourceScheme?: "Unset" | "NonSecure" | "Secure";
    url?: string;
  }[];
  /** Body param: Optional list of custom AI models to use for the request. The models will be tried in the order provided, and in case a model returns an error, the next one will be used as fallback. */
  customAi?: { authorization: string; model: string }[];
  /** Body param: */
  emulateMediaType?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.gotooptions). */
  gotoOptions?: {
    referer?: string;
    referrerPolicy?: string;
    timeout?: number;
    waitUntil?:
      | "load"
      | "domcontentloaded"
      | "networkidle0"
      | "networkidle2"
      | ("load" | "domcontentloaded" | "networkidle0" | "networkidle2")[];
  };
  /** Body param: Set the content of the page, eg: `<h1>Hello World!!</h1>`. Either `html` or `url` must be set. */
  html?: string;
  /** Body param: */
  prompt?: string;
  /** Body param: Block undesired requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  rejectRequestPattern?: string[];
  /** Body param: Block undesired requests that match the provided resource types, eg. 'image' or 'script'. */
  rejectResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: */
  responseFormat?: { type: string; jsonSchema?: Record<string, unknown> | null };
  /** Body param: */
  setExtraHTTPHeaders?: Record<string, unknown>;
  /** Body param: */
  setJavaScriptEnabled?: boolean;
  /** Body param: URL to navigate to, eg. `https://example.com`. */
  url?: string;
  /** Body param: */
  userAgent?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setviewport). */
  viewport?: {
    height: number;
    width: number;
    deviceScaleFactor?: number;
    hasTouch?: boolean;
    isLandscape?: boolean;
    isMobile?: boolean;
  };
  /** Body param: Wait for the selector to appear in page. Check [options](https://pptr.dev/api/puppeteer.page.waitforselector). */
  waitForSelector?: { selector: string; hidden?: true; timeout?: number; visible?: true };
  /** Body param: Waits for a specified timeout before continuing. */
  waitForTimeout?: number;
}

export const CreateJsonRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cacheTTL: Schema.optional(Schema.Number).pipe(T.HttpQuery("cacheTTL")),
  actionTimeout: Schema.optional(Schema.Number),
  addScriptTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        content: Schema.optional(Schema.String),
        type: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  addStyleTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        content: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  allowRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  allowResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  authenticate: Schema.optional(
    Schema.Struct({
      password: Schema.String,
      username: Schema.String,
    }),
  ),
  bestAttempt: Schema.optional(Schema.Boolean),
  cookies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
        domain: Schema.optional(Schema.String),
        expires: Schema.optional(Schema.Number),
        httpOnly: Schema.optional(Schema.Boolean),
        partitionKey: Schema.optional(Schema.String),
        path: Schema.optional(Schema.String),
        priority: Schema.optional(Schema.Literal("Low", "Medium", "High")),
        sameParty: Schema.optional(Schema.Boolean),
        sameSite: Schema.optional(Schema.Literal("Strict", "Lax", "None")),
        secure: Schema.optional(Schema.Boolean),
        sourcePort: Schema.optional(Schema.Number),
        sourceScheme: Schema.optional(Schema.Literal("Unset", "NonSecure", "Secure")),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  customAi: Schema.optional(
    Schema.Array(
      Schema.Struct({
        authorization: Schema.String,
        model: Schema.String,
      }),
    ),
  ).pipe(T.JsonName("custom_ai")),
  emulateMediaType: Schema.optional(Schema.String),
  gotoOptions: Schema.optional(
    Schema.Struct({
      referer: Schema.optional(Schema.String),
      referrerPolicy: Schema.optional(Schema.String),
      timeout: Schema.optional(Schema.Number),
      waitUntil: Schema.optional(
        Schema.Union(
          Schema.Literal("load"),
          Schema.Literal("domcontentloaded"),
          Schema.Literal("networkidle0"),
          Schema.Literal("networkidle2"),
          Schema.Array(Schema.Literal("load", "domcontentloaded", "networkidle0", "networkidle2")),
        ),
      ),
    }),
  ),
  html: Schema.optional(Schema.String),
  prompt: Schema.optional(Schema.String),
  rejectRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  rejectResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  responseFormat: Schema.optional(
    Schema.Struct({
      type: Schema.String,
      jsonSchema: Schema.optional(Schema.Union(Schema.Struct({}), Schema.Null)).pipe(
        T.JsonName("json_schema"),
      ),
    }),
  ).pipe(T.JsonName("response_format")),
  setExtraHTTPHeaders: Schema.optional(Schema.Struct({})),
  setJavaScriptEnabled: Schema.optional(Schema.Boolean),
  url: Schema.optional(Schema.String),
  userAgent: Schema.optional(Schema.String),
  viewport: Schema.optional(
    Schema.Struct({
      height: Schema.Number,
      width: Schema.Number,
      deviceScaleFactor: Schema.optional(Schema.Number),
      hasTouch: Schema.optional(Schema.Boolean),
      isLandscape: Schema.optional(Schema.Boolean),
      isMobile: Schema.optional(Schema.Boolean),
    }),
  ),
  waitForSelector: Schema.optional(
    Schema.Struct({
      selector: Schema.String,
      hidden: Schema.optional(Schema.Literal(true)),
      timeout: Schema.optional(Schema.Number),
      visible: Schema.optional(Schema.Literal(true)),
    }),
  ),
  waitForTimeout: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/browser-rendering/json" }),
) as unknown as Schema.Schema<CreateJsonRequest>;

export type CreateJsonResponse = Record<string, unknown>;

export const CreateJsonResponse = Schema.Struct({}) as unknown as Schema.Schema<CreateJsonResponse>;

export const createJson = API.make(() => ({
  input: CreateJsonRequest,
  output: CreateJsonResponse,
  errors: [],
}));

// =============================================================================
// Link
// =============================================================================

export interface CreateLinkRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: Cache TTL default is 5s. Set to 0 to disable. */
  cacheTTL?: number;
  /** Body param: The maximum duration allowed for the browser action to complete after the page has loaded (such as taking screenshots, extracting content, or generating PDFs). If this time limit is exceed */
  actionTimeout?: number;
  /** Body param: Adds a `<script>` tag into the page with the desired URL or content. */
  addScriptTag?: { id?: string; content?: string; type?: string; url?: string }[];
  /** Body param: Adds a `<link rel="stylesheet">` tag into the page with the desired URL or a `<style type="text/css">` tag with the content. */
  addStyleTag?: { content?: string; url?: string }[];
  /** Body param: Only allow requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  allowRequestPattern?: string[];
  /** Body param: Only allow requests that match the provided resource types, eg. 'image' or 'script'. */
  allowResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: Provide credentials for HTTP authentication. */
  authenticate?: { password: string; username: string };
  /** Body param: Attempt to proceed when 'awaited' events fail or timeout. */
  bestAttempt?: boolean;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setcookie). */
  cookies?: {
    name: string;
    value: string;
    domain?: string;
    expires?: number;
    httpOnly?: boolean;
    partitionKey?: string;
    path?: string;
    priority?: "Low" | "Medium" | "High";
    sameParty?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
    sourcePort?: number;
    sourceScheme?: "Unset" | "NonSecure" | "Secure";
    url?: string;
  }[];
  /** Body param: */
  emulateMediaType?: string;
  /** Body param: */
  excludeExternalLinks?: boolean;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.gotooptions). */
  gotoOptions?: {
    referer?: string;
    referrerPolicy?: string;
    timeout?: number;
    waitUntil?:
      | "load"
      | "domcontentloaded"
      | "networkidle0"
      | "networkidle2"
      | ("load" | "domcontentloaded" | "networkidle0" | "networkidle2")[];
  };
  /** Body param: Set the content of the page, eg: `<h1>Hello World!!</h1>`. Either `html` or `url` must be set. */
  html?: string;
  /** Body param: Block undesired requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  rejectRequestPattern?: string[];
  /** Body param: Block undesired requests that match the provided resource types, eg. 'image' or 'script'. */
  rejectResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: */
  setExtraHTTPHeaders?: Record<string, unknown>;
  /** Body param: */
  setJavaScriptEnabled?: boolean;
  /** Body param: URL to navigate to, eg. `https://example.com`. */
  url?: string;
  /** Body param: */
  userAgent?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setviewport). */
  viewport?: {
    height: number;
    width: number;
    deviceScaleFactor?: number;
    hasTouch?: boolean;
    isLandscape?: boolean;
    isMobile?: boolean;
  };
  /** Body param: */
  visibleLinksOnly?: boolean;
  /** Body param: Wait for the selector to appear in page. Check [options](https://pptr.dev/api/puppeteer.page.waitforselector). */
  waitForSelector?: { selector: string; hidden?: true; timeout?: number; visible?: true };
  /** Body param: Waits for a specified timeout before continuing. */
  waitForTimeout?: number;
}

export const CreateLinkRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cacheTTL: Schema.optional(Schema.Number).pipe(T.HttpQuery("cacheTTL")),
  actionTimeout: Schema.optional(Schema.Number),
  addScriptTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        content: Schema.optional(Schema.String),
        type: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  addStyleTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        content: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  allowRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  allowResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  authenticate: Schema.optional(
    Schema.Struct({
      password: Schema.String,
      username: Schema.String,
    }),
  ),
  bestAttempt: Schema.optional(Schema.Boolean),
  cookies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
        domain: Schema.optional(Schema.String),
        expires: Schema.optional(Schema.Number),
        httpOnly: Schema.optional(Schema.Boolean),
        partitionKey: Schema.optional(Schema.String),
        path: Schema.optional(Schema.String),
        priority: Schema.optional(Schema.Literal("Low", "Medium", "High")),
        sameParty: Schema.optional(Schema.Boolean),
        sameSite: Schema.optional(Schema.Literal("Strict", "Lax", "None")),
        secure: Schema.optional(Schema.Boolean),
        sourcePort: Schema.optional(Schema.Number),
        sourceScheme: Schema.optional(Schema.Literal("Unset", "NonSecure", "Secure")),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  emulateMediaType: Schema.optional(Schema.String),
  excludeExternalLinks: Schema.optional(Schema.Boolean),
  gotoOptions: Schema.optional(
    Schema.Struct({
      referer: Schema.optional(Schema.String),
      referrerPolicy: Schema.optional(Schema.String),
      timeout: Schema.optional(Schema.Number),
      waitUntil: Schema.optional(
        Schema.Union(
          Schema.Literal("load"),
          Schema.Literal("domcontentloaded"),
          Schema.Literal("networkidle0"),
          Schema.Literal("networkidle2"),
          Schema.Array(Schema.Literal("load", "domcontentloaded", "networkidle0", "networkidle2")),
        ),
      ),
    }),
  ),
  html: Schema.optional(Schema.String),
  rejectRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  rejectResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  setExtraHTTPHeaders: Schema.optional(Schema.Struct({})),
  setJavaScriptEnabled: Schema.optional(Schema.Boolean),
  url: Schema.optional(Schema.String),
  userAgent: Schema.optional(Schema.String),
  viewport: Schema.optional(
    Schema.Struct({
      height: Schema.Number,
      width: Schema.Number,
      deviceScaleFactor: Schema.optional(Schema.Number),
      hasTouch: Schema.optional(Schema.Boolean),
      isLandscape: Schema.optional(Schema.Boolean),
      isMobile: Schema.optional(Schema.Boolean),
    }),
  ),
  visibleLinksOnly: Schema.optional(Schema.Boolean),
  waitForSelector: Schema.optional(
    Schema.Struct({
      selector: Schema.String,
      hidden: Schema.optional(Schema.Literal(true)),
      timeout: Schema.optional(Schema.Number),
      visible: Schema.optional(Schema.Literal(true)),
    }),
  ),
  waitForTimeout: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/browser-rendering/links" }),
) as unknown as Schema.Schema<CreateLinkRequest>;

export type CreateLinkResponse = string[];

export const CreateLinkResponse = Schema.Array(
  Schema.String,
) as unknown as Schema.Schema<CreateLinkResponse>;

export const createLink = API.make(() => ({
  input: CreateLinkRequest,
  output: CreateLinkResponse,
  errors: [],
}));

// =============================================================================
// Markdown
// =============================================================================

export interface CreateMarkdownRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: Cache TTL default is 5s. Set to 0 to disable. */
  cacheTTL?: number;
  /** Body param: The maximum duration allowed for the browser action to complete after the page has loaded (such as taking screenshots, extracting content, or generating PDFs). If this time limit is exceed */
  actionTimeout?: number;
  /** Body param: Adds a `<script>` tag into the page with the desired URL or content. */
  addScriptTag?: { id?: string; content?: string; type?: string; url?: string }[];
  /** Body param: Adds a `<link rel="stylesheet">` tag into the page with the desired URL or a `<style type="text/css">` tag with the content. */
  addStyleTag?: { content?: string; url?: string }[];
  /** Body param: Only allow requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  allowRequestPattern?: string[];
  /** Body param: Only allow requests that match the provided resource types, eg. 'image' or 'script'. */
  allowResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: Provide credentials for HTTP authentication. */
  authenticate?: { password: string; username: string };
  /** Body param: Attempt to proceed when 'awaited' events fail or timeout. */
  bestAttempt?: boolean;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setcookie). */
  cookies?: {
    name: string;
    value: string;
    domain?: string;
    expires?: number;
    httpOnly?: boolean;
    partitionKey?: string;
    path?: string;
    priority?: "Low" | "Medium" | "High";
    sameParty?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
    sourcePort?: number;
    sourceScheme?: "Unset" | "NonSecure" | "Secure";
    url?: string;
  }[];
  /** Body param: */
  emulateMediaType?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.gotooptions). */
  gotoOptions?: {
    referer?: string;
    referrerPolicy?: string;
    timeout?: number;
    waitUntil?:
      | "load"
      | "domcontentloaded"
      | "networkidle0"
      | "networkidle2"
      | ("load" | "domcontentloaded" | "networkidle0" | "networkidle2")[];
  };
  /** Body param: Set the content of the page, eg: `<h1>Hello World!!</h1>`. Either `html` or `url` must be set. */
  html?: string;
  /** Body param: Block undesired requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  rejectRequestPattern?: string[];
  /** Body param: Block undesired requests that match the provided resource types, eg. 'image' or 'script'. */
  rejectResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: */
  setExtraHTTPHeaders?: Record<string, unknown>;
  /** Body param: */
  setJavaScriptEnabled?: boolean;
  /** Body param: URL to navigate to, eg. `https://example.com`. */
  url?: string;
  /** Body param: */
  userAgent?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setviewport). */
  viewport?: {
    height: number;
    width: number;
    deviceScaleFactor?: number;
    hasTouch?: boolean;
    isLandscape?: boolean;
    isMobile?: boolean;
  };
  /** Body param: Wait for the selector to appear in page. Check [options](https://pptr.dev/api/puppeteer.page.waitforselector). */
  waitForSelector?: { selector: string; hidden?: true; timeout?: number; visible?: true };
  /** Body param: Waits for a specified timeout before continuing. */
  waitForTimeout?: number;
}

export const CreateMarkdownRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cacheTTL: Schema.optional(Schema.Number).pipe(T.HttpQuery("cacheTTL")),
  actionTimeout: Schema.optional(Schema.Number),
  addScriptTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        content: Schema.optional(Schema.String),
        type: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  addStyleTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        content: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  allowRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  allowResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  authenticate: Schema.optional(
    Schema.Struct({
      password: Schema.String,
      username: Schema.String,
    }),
  ),
  bestAttempt: Schema.optional(Schema.Boolean),
  cookies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
        domain: Schema.optional(Schema.String),
        expires: Schema.optional(Schema.Number),
        httpOnly: Schema.optional(Schema.Boolean),
        partitionKey: Schema.optional(Schema.String),
        path: Schema.optional(Schema.String),
        priority: Schema.optional(Schema.Literal("Low", "Medium", "High")),
        sameParty: Schema.optional(Schema.Boolean),
        sameSite: Schema.optional(Schema.Literal("Strict", "Lax", "None")),
        secure: Schema.optional(Schema.Boolean),
        sourcePort: Schema.optional(Schema.Number),
        sourceScheme: Schema.optional(Schema.Literal("Unset", "NonSecure", "Secure")),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  emulateMediaType: Schema.optional(Schema.String),
  gotoOptions: Schema.optional(
    Schema.Struct({
      referer: Schema.optional(Schema.String),
      referrerPolicy: Schema.optional(Schema.String),
      timeout: Schema.optional(Schema.Number),
      waitUntil: Schema.optional(
        Schema.Union(
          Schema.Literal("load"),
          Schema.Literal("domcontentloaded"),
          Schema.Literal("networkidle0"),
          Schema.Literal("networkidle2"),
          Schema.Array(Schema.Literal("load", "domcontentloaded", "networkidle0", "networkidle2")),
        ),
      ),
    }),
  ),
  html: Schema.optional(Schema.String),
  rejectRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  rejectResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  setExtraHTTPHeaders: Schema.optional(Schema.Struct({})),
  setJavaScriptEnabled: Schema.optional(Schema.Boolean),
  url: Schema.optional(Schema.String),
  userAgent: Schema.optional(Schema.String),
  viewport: Schema.optional(
    Schema.Struct({
      height: Schema.Number,
      width: Schema.Number,
      deviceScaleFactor: Schema.optional(Schema.Number),
      hasTouch: Schema.optional(Schema.Boolean),
      isLandscape: Schema.optional(Schema.Boolean),
      isMobile: Schema.optional(Schema.Boolean),
    }),
  ),
  waitForSelector: Schema.optional(
    Schema.Struct({
      selector: Schema.String,
      hidden: Schema.optional(Schema.Literal(true)),
      timeout: Schema.optional(Schema.Number),
      visible: Schema.optional(Schema.Literal(true)),
    }),
  ),
  waitForTimeout: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/browser-rendering/markdown" }),
) as unknown as Schema.Schema<CreateMarkdownRequest>;

export type CreateMarkdownResponse = string;

export const CreateMarkdownResponse =
  Schema.String as unknown as Schema.Schema<CreateMarkdownResponse>;

export const createMarkdown = API.make(() => ({
  input: CreateMarkdownRequest,
  output: CreateMarkdownResponse,
  errors: [],
}));

// =============================================================================
// Pdf
// =============================================================================

export interface CreatePdfRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: Cache TTL default is 5s. Set to 0 to disable. */
  cacheTTL?: number;
  /** Body param: The maximum duration allowed for the browser action to complete after the page has loaded (such as taking screenshots, extracting content, or generating PDFs). If this time limit is exceed */
  actionTimeout?: number;
  /** Body param: Adds a `<script>` tag into the page with the desired URL or content. */
  addScriptTag?: { id?: string; content?: string; type?: string; url?: string }[];
  /** Body param: Adds a `<link rel="stylesheet">` tag into the page with the desired URL or a `<style type="text/css">` tag with the content. */
  addStyleTag?: { content?: string; url?: string }[];
  /** Body param: Only allow requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  allowRequestPattern?: string[];
  /** Body param: Only allow requests that match the provided resource types, eg. 'image' or 'script'. */
  allowResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: Provide credentials for HTTP authentication. */
  authenticate?: { password: string; username: string };
  /** Body param: Attempt to proceed when 'awaited' events fail or timeout. */
  bestAttempt?: boolean;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setcookie). */
  cookies?: {
    name: string;
    value: string;
    domain?: string;
    expires?: number;
    httpOnly?: boolean;
    partitionKey?: string;
    path?: string;
    priority?: "Low" | "Medium" | "High";
    sameParty?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
    sourcePort?: number;
    sourceScheme?: "Unset" | "NonSecure" | "Secure";
    url?: string;
  }[];
  /** Body param: */
  emulateMediaType?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.gotooptions). */
  gotoOptions?: {
    referer?: string;
    referrerPolicy?: string;
    timeout?: number;
    waitUntil?:
      | "load"
      | "domcontentloaded"
      | "networkidle0"
      | "networkidle2"
      | ("load" | "domcontentloaded" | "networkidle0" | "networkidle2")[];
  };
  /** Body param: Set the content of the page, eg: `<h1>Hello World!!</h1>`. Either `html` or `url` must be set. */
  html?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.pdfoptions). */
  pdfOptions?: {
    displayHeaderFooter?: boolean;
    footerTemplate?: string;
    format?:
      | "letter"
      | "legal"
      | "tabloid"
      | "ledger"
      | "a0"
      | "a1"
      | "a2"
      | "a3"
      | "a4"
      | "a5"
      | "a6";
    headerTemplate?: string;
    height?: string | number;
    landscape?: boolean;
    margin?: {
      bottom?: string | number;
      left?: string | number;
      right?: string | number;
      top?: string | number;
    };
    omitBackground?: boolean;
    outline?: boolean;
    pageRanges?: string;
    preferCSSPageSize?: boolean;
    printBackground?: boolean;
    scale?: number;
    tagged?: boolean;
    timeout?: number;
    width?: string | number;
  };
  /** Body param: Block undesired requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  rejectRequestPattern?: string[];
  /** Body param: Block undesired requests that match the provided resource types, eg. 'image' or 'script'. */
  rejectResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: */
  setExtraHTTPHeaders?: Record<string, unknown>;
  /** Body param: */
  setJavaScriptEnabled?: boolean;
  /** Body param: URL to navigate to, eg. `https://example.com`. */
  url?: string;
  /** Body param: */
  userAgent?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setviewport). */
  viewport?: {
    height: number;
    width: number;
    deviceScaleFactor?: number;
    hasTouch?: boolean;
    isLandscape?: boolean;
    isMobile?: boolean;
  };
  /** Body param: Wait for the selector to appear in page. Check [options](https://pptr.dev/api/puppeteer.page.waitforselector). */
  waitForSelector?: { selector: string; hidden?: true; timeout?: number; visible?: true };
  /** Body param: Waits for a specified timeout before continuing. */
  waitForTimeout?: number;
}

export const CreatePdfRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cacheTTL: Schema.optional(Schema.Number).pipe(T.HttpQuery("cacheTTL")),
  actionTimeout: Schema.optional(Schema.Number),
  addScriptTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        content: Schema.optional(Schema.String),
        type: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  addStyleTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        content: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  allowRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  allowResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  authenticate: Schema.optional(
    Schema.Struct({
      password: Schema.String,
      username: Schema.String,
    }),
  ),
  bestAttempt: Schema.optional(Schema.Boolean),
  cookies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
        domain: Schema.optional(Schema.String),
        expires: Schema.optional(Schema.Number),
        httpOnly: Schema.optional(Schema.Boolean),
        partitionKey: Schema.optional(Schema.String),
        path: Schema.optional(Schema.String),
        priority: Schema.optional(Schema.Literal("Low", "Medium", "High")),
        sameParty: Schema.optional(Schema.Boolean),
        sameSite: Schema.optional(Schema.Literal("Strict", "Lax", "None")),
        secure: Schema.optional(Schema.Boolean),
        sourcePort: Schema.optional(Schema.Number),
        sourceScheme: Schema.optional(Schema.Literal("Unset", "NonSecure", "Secure")),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  emulateMediaType: Schema.optional(Schema.String),
  gotoOptions: Schema.optional(
    Schema.Struct({
      referer: Schema.optional(Schema.String),
      referrerPolicy: Schema.optional(Schema.String),
      timeout: Schema.optional(Schema.Number),
      waitUntil: Schema.optional(
        Schema.Union(
          Schema.Literal("load"),
          Schema.Literal("domcontentloaded"),
          Schema.Literal("networkidle0"),
          Schema.Literal("networkidle2"),
          Schema.Array(Schema.Literal("load", "domcontentloaded", "networkidle0", "networkidle2")),
        ),
      ),
    }),
  ),
  html: Schema.optional(Schema.String),
  pdfOptions: Schema.optional(
    Schema.Struct({
      displayHeaderFooter: Schema.optional(Schema.Boolean),
      footerTemplate: Schema.optional(Schema.String),
      format: Schema.optional(
        Schema.Literal(
          "letter",
          "legal",
          "tabloid",
          "ledger",
          "a0",
          "a1",
          "a2",
          "a3",
          "a4",
          "a5",
          "a6",
        ),
      ),
      headerTemplate: Schema.optional(Schema.String),
      height: Schema.optional(Schema.Union(Schema.String, Schema.Number)),
      landscape: Schema.optional(Schema.Boolean),
      margin: Schema.optional(
        Schema.Struct({
          bottom: Schema.optional(Schema.Union(Schema.String, Schema.Number)),
          left: Schema.optional(Schema.Union(Schema.String, Schema.Number)),
          right: Schema.optional(Schema.Union(Schema.String, Schema.Number)),
          top: Schema.optional(Schema.Union(Schema.String, Schema.Number)),
        }),
      ),
      omitBackground: Schema.optional(Schema.Boolean),
      outline: Schema.optional(Schema.Boolean),
      pageRanges: Schema.optional(Schema.String),
      preferCSSPageSize: Schema.optional(Schema.Boolean),
      printBackground: Schema.optional(Schema.Boolean),
      scale: Schema.optional(Schema.Number),
      tagged: Schema.optional(Schema.Boolean),
      timeout: Schema.optional(Schema.Number),
      width: Schema.optional(Schema.Union(Schema.String, Schema.Number)),
    }),
  ),
  rejectRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  rejectResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  setExtraHTTPHeaders: Schema.optional(Schema.Struct({})),
  setJavaScriptEnabled: Schema.optional(Schema.Boolean),
  url: Schema.optional(Schema.String),
  userAgent: Schema.optional(Schema.String),
  viewport: Schema.optional(
    Schema.Struct({
      height: Schema.Number,
      width: Schema.Number,
      deviceScaleFactor: Schema.optional(Schema.Number),
      hasTouch: Schema.optional(Schema.Boolean),
      isLandscape: Schema.optional(Schema.Boolean),
      isMobile: Schema.optional(Schema.Boolean),
    }),
  ),
  waitForSelector: Schema.optional(
    Schema.Struct({
      selector: Schema.String,
      hidden: Schema.optional(Schema.Literal(true)),
      timeout: Schema.optional(Schema.Number),
      visible: Schema.optional(Schema.Literal(true)),
    }),
  ),
  waitForTimeout: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/browser-rendering/pdf" }),
) as unknown as Schema.Schema<CreatePdfRequest>;

export type CreatePdfResponse = unknown;

export const CreatePdfResponse = Schema.Unknown as unknown as Schema.Schema<CreatePdfResponse>;

export const createPdf = API.make(() => ({
  input: CreatePdfRequest,
  output: CreatePdfResponse,
  errors: [],
}));

// =============================================================================
// Scrape
// =============================================================================

export interface CreateScrapeRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: Cache TTL default is 5s. Set to 0 to disable. */
  cacheTTL?: number;
  /** Body param: */
  elements: { selector: string }[];
  /** Body param: The maximum duration allowed for the browser action to complete after the page has loaded (such as taking screenshots, extracting content, or generating PDFs). If this time limit is exceed */
  actionTimeout?: number;
  /** Body param: Adds a `<script>` tag into the page with the desired URL or content. */
  addScriptTag?: { id?: string; content?: string; type?: string; url?: string }[];
  /** Body param: Adds a `<link rel="stylesheet">` tag into the page with the desired URL or a `<style type="text/css">` tag with the content. */
  addStyleTag?: { content?: string; url?: string }[];
  /** Body param: Only allow requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  allowRequestPattern?: string[];
  /** Body param: Only allow requests that match the provided resource types, eg. 'image' or 'script'. */
  allowResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: Provide credentials for HTTP authentication. */
  authenticate?: { password: string; username: string };
  /** Body param: Attempt to proceed when 'awaited' events fail or timeout. */
  bestAttempt?: boolean;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setcookie). */
  cookies?: {
    name: string;
    value: string;
    domain?: string;
    expires?: number;
    httpOnly?: boolean;
    partitionKey?: string;
    path?: string;
    priority?: "Low" | "Medium" | "High";
    sameParty?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
    sourcePort?: number;
    sourceScheme?: "Unset" | "NonSecure" | "Secure";
    url?: string;
  }[];
  /** Body param: */
  emulateMediaType?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.gotooptions). */
  gotoOptions?: {
    referer?: string;
    referrerPolicy?: string;
    timeout?: number;
    waitUntil?:
      | "load"
      | "domcontentloaded"
      | "networkidle0"
      | "networkidle2"
      | ("load" | "domcontentloaded" | "networkidle0" | "networkidle2")[];
  };
  /** Body param: Set the content of the page, eg: `<h1>Hello World!!</h1>`. Either `html` or `url` must be set. */
  html?: string;
  /** Body param: Block undesired requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  rejectRequestPattern?: string[];
  /** Body param: Block undesired requests that match the provided resource types, eg. 'image' or 'script'. */
  rejectResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: */
  setExtraHTTPHeaders?: Record<string, unknown>;
  /** Body param: */
  setJavaScriptEnabled?: boolean;
  /** Body param: URL to navigate to, eg. `https://example.com`. */
  url?: string;
  /** Body param: */
  userAgent?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setviewport). */
  viewport?: {
    height: number;
    width: number;
    deviceScaleFactor?: number;
    hasTouch?: boolean;
    isLandscape?: boolean;
    isMobile?: boolean;
  };
  /** Body param: Wait for the selector to appear in page. Check [options](https://pptr.dev/api/puppeteer.page.waitforselector). */
  waitForSelector?: { selector: string; hidden?: true; timeout?: number; visible?: true };
  /** Body param: Waits for a specified timeout before continuing. */
  waitForTimeout?: number;
}

export const CreateScrapeRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cacheTTL: Schema.optional(Schema.Number).pipe(T.HttpQuery("cacheTTL")),
  elements: Schema.Array(
    Schema.Struct({
      selector: Schema.String,
    }),
  ),
  actionTimeout: Schema.optional(Schema.Number),
  addScriptTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        content: Schema.optional(Schema.String),
        type: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  addStyleTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        content: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  allowRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  allowResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  authenticate: Schema.optional(
    Schema.Struct({
      password: Schema.String,
      username: Schema.String,
    }),
  ),
  bestAttempt: Schema.optional(Schema.Boolean),
  cookies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
        domain: Schema.optional(Schema.String),
        expires: Schema.optional(Schema.Number),
        httpOnly: Schema.optional(Schema.Boolean),
        partitionKey: Schema.optional(Schema.String),
        path: Schema.optional(Schema.String),
        priority: Schema.optional(Schema.Literal("Low", "Medium", "High")),
        sameParty: Schema.optional(Schema.Boolean),
        sameSite: Schema.optional(Schema.Literal("Strict", "Lax", "None")),
        secure: Schema.optional(Schema.Boolean),
        sourcePort: Schema.optional(Schema.Number),
        sourceScheme: Schema.optional(Schema.Literal("Unset", "NonSecure", "Secure")),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  emulateMediaType: Schema.optional(Schema.String),
  gotoOptions: Schema.optional(
    Schema.Struct({
      referer: Schema.optional(Schema.String),
      referrerPolicy: Schema.optional(Schema.String),
      timeout: Schema.optional(Schema.Number),
      waitUntil: Schema.optional(
        Schema.Union(
          Schema.Literal("load"),
          Schema.Literal("domcontentloaded"),
          Schema.Literal("networkidle0"),
          Schema.Literal("networkidle2"),
          Schema.Array(Schema.Literal("load", "domcontentloaded", "networkidle0", "networkidle2")),
        ),
      ),
    }),
  ),
  html: Schema.optional(Schema.String),
  rejectRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  rejectResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  setExtraHTTPHeaders: Schema.optional(Schema.Struct({})),
  setJavaScriptEnabled: Schema.optional(Schema.Boolean),
  url: Schema.optional(Schema.String),
  userAgent: Schema.optional(Schema.String),
  viewport: Schema.optional(
    Schema.Struct({
      height: Schema.Number,
      width: Schema.Number,
      deviceScaleFactor: Schema.optional(Schema.Number),
      hasTouch: Schema.optional(Schema.Boolean),
      isLandscape: Schema.optional(Schema.Boolean),
      isMobile: Schema.optional(Schema.Boolean),
    }),
  ),
  waitForSelector: Schema.optional(
    Schema.Struct({
      selector: Schema.String,
      hidden: Schema.optional(Schema.Literal(true)),
      timeout: Schema.optional(Schema.Number),
      visible: Schema.optional(Schema.Literal(true)),
    }),
  ),
  waitForTimeout: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/browser-rendering/scrape" }),
) as unknown as Schema.Schema<CreateScrapeRequest>;

export type CreateScrapeResponse = {
  results: {
    attributes: { name: string; value: string }[];
    height: number;
    html: string;
    left: number;
    text: string;
    top: number;
    width: number;
  };
  selector: string;
}[];

export const CreateScrapeResponse = Schema.Array(
  Schema.Struct({
    results: Schema.Struct({
      attributes: Schema.Array(
        Schema.Struct({
          name: Schema.String,
          value: Schema.String,
        }),
      ),
      height: Schema.Number,
      html: Schema.String,
      left: Schema.Number,
      text: Schema.String,
      top: Schema.Number,
      width: Schema.Number,
    }),
    selector: Schema.String,
  }),
) as unknown as Schema.Schema<CreateScrapeResponse>;

export const createScrape = API.make(() => ({
  input: CreateScrapeRequest,
  output: CreateScrapeResponse,
  errors: [],
}));

// =============================================================================
// Screenshot
// =============================================================================

export interface CreateScreenshotRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: Cache TTL default is 5s. Set to 0 to disable. */
  cacheTTL?: number;
  /** Body param: The maximum duration allowed for the browser action to complete after the page has loaded (such as taking screenshots, extracting content, or generating PDFs). If this time limit is exceed */
  actionTimeout?: number;
  /** Body param: Adds a `<script>` tag into the page with the desired URL or content. */
  addScriptTag?: { id?: string; content?: string; type?: string; url?: string }[];
  /** Body param: Adds a `<link rel="stylesheet">` tag into the page with the desired URL or a `<style type="text/css">` tag with the content. */
  addStyleTag?: { content?: string; url?: string }[];
  /** Body param: Only allow requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  allowRequestPattern?: string[];
  /** Body param: Only allow requests that match the provided resource types, eg. 'image' or 'script'. */
  allowResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: Provide credentials for HTTP authentication. */
  authenticate?: { password: string; username: string };
  /** Body param: Attempt to proceed when 'awaited' events fail or timeout. */
  bestAttempt?: boolean;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setcookie). */
  cookies?: {
    name: string;
    value: string;
    domain?: string;
    expires?: number;
    httpOnly?: boolean;
    partitionKey?: string;
    path?: string;
    priority?: "Low" | "Medium" | "High";
    sameParty?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
    sourcePort?: number;
    sourceScheme?: "Unset" | "NonSecure" | "Secure";
    url?: string;
  }[];
  /** Body param: */
  emulateMediaType?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.gotooptions). */
  gotoOptions?: {
    referer?: string;
    referrerPolicy?: string;
    timeout?: number;
    waitUntil?:
      | "load"
      | "domcontentloaded"
      | "networkidle0"
      | "networkidle2"
      | ("load" | "domcontentloaded" | "networkidle0" | "networkidle2")[];
  };
  /** Body param: Set the content of the page, eg: `<h1>Hello World!!</h1>`. Either `html` or `url` must be set. */
  html?: string;
  /** Body param: Block undesired requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  rejectRequestPattern?: string[];
  /** Body param: Block undesired requests that match the provided resource types, eg. 'image' or 'script'. */
  rejectResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.screenshotoptions). */
  screenshotOptions?: {
    captureBeyondViewport?: boolean;
    clip?: { height: number; width: number; x: number; y: number; scale?: number };
    encoding?: "binary" | "base64";
    fromSurface?: boolean;
    fullPage?: boolean;
    omitBackground?: boolean;
    optimizeForSpeed?: boolean;
    quality?: number;
    type?: "png" | "jpeg" | "webp";
  };
  /** Body param: */
  scrollPage?: boolean;
  /** Body param: */
  selector?: string;
  /** Body param: */
  setExtraHTTPHeaders?: Record<string, unknown>;
  /** Body param: */
  setJavaScriptEnabled?: boolean;
  /** Body param: URL to navigate to, eg. `https://example.com`. */
  url?: string;
  /** Body param: */
  userAgent?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setviewport). */
  viewport?: {
    height: number;
    width: number;
    deviceScaleFactor?: number;
    hasTouch?: boolean;
    isLandscape?: boolean;
    isMobile?: boolean;
  };
  /** Body param: Wait for the selector to appear in page. Check [options](https://pptr.dev/api/puppeteer.page.waitforselector). */
  waitForSelector?: { selector: string; hidden?: true; timeout?: number; visible?: true };
  /** Body param: Waits for a specified timeout before continuing. */
  waitForTimeout?: number;
}

export const CreateScreenshotRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cacheTTL: Schema.optional(Schema.Number).pipe(T.HttpQuery("cacheTTL")),
  actionTimeout: Schema.optional(Schema.Number),
  addScriptTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        content: Schema.optional(Schema.String),
        type: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  addStyleTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        content: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  allowRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  allowResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  authenticate: Schema.optional(
    Schema.Struct({
      password: Schema.String,
      username: Schema.String,
    }),
  ),
  bestAttempt: Schema.optional(Schema.Boolean),
  cookies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
        domain: Schema.optional(Schema.String),
        expires: Schema.optional(Schema.Number),
        httpOnly: Schema.optional(Schema.Boolean),
        partitionKey: Schema.optional(Schema.String),
        path: Schema.optional(Schema.String),
        priority: Schema.optional(Schema.Literal("Low", "Medium", "High")),
        sameParty: Schema.optional(Schema.Boolean),
        sameSite: Schema.optional(Schema.Literal("Strict", "Lax", "None")),
        secure: Schema.optional(Schema.Boolean),
        sourcePort: Schema.optional(Schema.Number),
        sourceScheme: Schema.optional(Schema.Literal("Unset", "NonSecure", "Secure")),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  emulateMediaType: Schema.optional(Schema.String),
  gotoOptions: Schema.optional(
    Schema.Struct({
      referer: Schema.optional(Schema.String),
      referrerPolicy: Schema.optional(Schema.String),
      timeout: Schema.optional(Schema.Number),
      waitUntil: Schema.optional(
        Schema.Union(
          Schema.Literal("load"),
          Schema.Literal("domcontentloaded"),
          Schema.Literal("networkidle0"),
          Schema.Literal("networkidle2"),
          Schema.Array(Schema.Literal("load", "domcontentloaded", "networkidle0", "networkidle2")),
        ),
      ),
    }),
  ),
  html: Schema.optional(Schema.String),
  rejectRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  rejectResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  screenshotOptions: Schema.optional(
    Schema.Struct({
      captureBeyondViewport: Schema.optional(Schema.Boolean),
      clip: Schema.optional(
        Schema.Struct({
          height: Schema.Number,
          width: Schema.Number,
          x: Schema.Number,
          y: Schema.Number,
          scale: Schema.optional(Schema.Number),
        }),
      ),
      encoding: Schema.optional(Schema.Literal("binary", "base64")),
      fromSurface: Schema.optional(Schema.Boolean),
      fullPage: Schema.optional(Schema.Boolean),
      omitBackground: Schema.optional(Schema.Boolean),
      optimizeForSpeed: Schema.optional(Schema.Boolean),
      quality: Schema.optional(Schema.Number),
      type: Schema.optional(Schema.Literal("png", "jpeg", "webp")),
    }),
  ),
  scrollPage: Schema.optional(Schema.Boolean),
  selector: Schema.optional(Schema.String),
  setExtraHTTPHeaders: Schema.optional(Schema.Struct({})),
  setJavaScriptEnabled: Schema.optional(Schema.Boolean),
  url: Schema.optional(Schema.String),
  userAgent: Schema.optional(Schema.String),
  viewport: Schema.optional(
    Schema.Struct({
      height: Schema.Number,
      width: Schema.Number,
      deviceScaleFactor: Schema.optional(Schema.Number),
      hasTouch: Schema.optional(Schema.Boolean),
      isLandscape: Schema.optional(Schema.Boolean),
      isMobile: Schema.optional(Schema.Boolean),
    }),
  ),
  waitForSelector: Schema.optional(
    Schema.Struct({
      selector: Schema.String,
      hidden: Schema.optional(Schema.Literal(true)),
      timeout: Schema.optional(Schema.Number),
      visible: Schema.optional(Schema.Literal(true)),
    }),
  ),
  waitForTimeout: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/browser-rendering/screenshot" }),
) as unknown as Schema.Schema<CreateScreenshotRequest>;

export interface CreateScreenshotResponse {
  /** Response status */
  status: boolean;
  errors?: { code: number; message: string }[];
}

export const CreateScreenshotResponse = Schema.Struct({
  status: Schema.Boolean,
  errors: Schema.optional(
    Schema.Array(
      Schema.Struct({
        code: Schema.Number,
        message: Schema.String,
      }),
    ),
  ),
}) as unknown as Schema.Schema<CreateScreenshotResponse>;

export const createScreenshot = API.make(() => ({
  input: CreateScreenshotRequest,
  output: CreateScreenshotResponse,
  errors: [],
}));

// =============================================================================
// Snapshot
// =============================================================================

export interface CreateSnapshotRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: Cache TTL default is 5s. Set to 0 to disable. */
  cacheTTL?: number;
  /** Body param: The maximum duration allowed for the browser action to complete after the page has loaded (such as taking screenshots, extracting content, or generating PDFs). If this time limit is exceed */
  actionTimeout?: number;
  /** Body param: Adds a `<script>` tag into the page with the desired URL or content. */
  addScriptTag?: { id?: string; content?: string; type?: string; url?: string }[];
  /** Body param: Adds a `<link rel="stylesheet">` tag into the page with the desired URL or a `<style type="text/css">` tag with the content. */
  addStyleTag?: { content?: string; url?: string }[];
  /** Body param: Only allow requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  allowRequestPattern?: string[];
  /** Body param: Only allow requests that match the provided resource types, eg. 'image' or 'script'. */
  allowResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: Provide credentials for HTTP authentication. */
  authenticate?: { password: string; username: string };
  /** Body param: Attempt to proceed when 'awaited' events fail or timeout. */
  bestAttempt?: boolean;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setcookie). */
  cookies?: {
    name: string;
    value: string;
    domain?: string;
    expires?: number;
    httpOnly?: boolean;
    partitionKey?: string;
    path?: string;
    priority?: "Low" | "Medium" | "High";
    sameParty?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
    sourcePort?: number;
    sourceScheme?: "Unset" | "NonSecure" | "Secure";
    url?: string;
  }[];
  /** Body param: */
  emulateMediaType?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.gotooptions). */
  gotoOptions?: {
    referer?: string;
    referrerPolicy?: string;
    timeout?: number;
    waitUntil?:
      | "load"
      | "domcontentloaded"
      | "networkidle0"
      | "networkidle2"
      | ("load" | "domcontentloaded" | "networkidle0" | "networkidle2")[];
  };
  /** Body param: Set the content of the page, eg: `<h1>Hello World!!</h1>`. Either `html` or `url` must be set. */
  html?: string;
  /** Body param: Block undesired requests that match the provided regex patterns, eg. '/^.\ \.(css)'. */
  rejectRequestPattern?: string[];
  /** Body param: Block undesired requests that match the provided resource types, eg. 'image' or 'script'. */
  rejectResourceTypes?: (
    | "document"
    | "stylesheet"
    | "image"
    | "media"
    | "font"
    | "script"
    | "texttrack"
    | "xhr"
    | "fetch"
    | "prefetch"
    | "eventsource"
    | "websocket"
    | "manifest"
    | "signedexchange"
    | "ping"
    | "cspviolationreport"
    | "preflight"
    | "other"
  )[];
  /** Body param: */
  screenshotOptions?: {
    captureBeyondViewport?: boolean;
    clip?: { height: number; width: number; x: number; y: number; scale?: number };
    fromSurface?: boolean;
    fullPage?: boolean;
    omitBackground?: boolean;
    optimizeForSpeed?: boolean;
    quality?: number;
    type?: "png" | "jpeg" | "webp";
  };
  /** Body param: */
  setExtraHTTPHeaders?: Record<string, unknown>;
  /** Body param: */
  setJavaScriptEnabled?: boolean;
  /** Body param: URL to navigate to, eg. `https://example.com`. */
  url?: string;
  /** Body param: */
  userAgent?: string;
  /** Body param: Check [options](https://pptr.dev/api/puppeteer.page.setviewport). */
  viewport?: {
    height: number;
    width: number;
    deviceScaleFactor?: number;
    hasTouch?: boolean;
    isLandscape?: boolean;
    isMobile?: boolean;
  };
  /** Body param: Wait for the selector to appear in page. Check [options](https://pptr.dev/api/puppeteer.page.waitforselector). */
  waitForSelector?: { selector: string; hidden?: true; timeout?: number; visible?: true };
  /** Body param: Waits for a specified timeout before continuing. */
  waitForTimeout?: number;
}

export const CreateSnapshotRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cacheTTL: Schema.optional(Schema.Number).pipe(T.HttpQuery("cacheTTL")),
  actionTimeout: Schema.optional(Schema.Number),
  addScriptTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        content: Schema.optional(Schema.String),
        type: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  addStyleTag: Schema.optional(
    Schema.Array(
      Schema.Struct({
        content: Schema.optional(Schema.String),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  allowRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  allowResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  authenticate: Schema.optional(
    Schema.Struct({
      password: Schema.String,
      username: Schema.String,
    }),
  ),
  bestAttempt: Schema.optional(Schema.Boolean),
  cookies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
        value: Schema.String,
        domain: Schema.optional(Schema.String),
        expires: Schema.optional(Schema.Number),
        httpOnly: Schema.optional(Schema.Boolean),
        partitionKey: Schema.optional(Schema.String),
        path: Schema.optional(Schema.String),
        priority: Schema.optional(Schema.Literal("Low", "Medium", "High")),
        sameParty: Schema.optional(Schema.Boolean),
        sameSite: Schema.optional(Schema.Literal("Strict", "Lax", "None")),
        secure: Schema.optional(Schema.Boolean),
        sourcePort: Schema.optional(Schema.Number),
        sourceScheme: Schema.optional(Schema.Literal("Unset", "NonSecure", "Secure")),
        url: Schema.optional(Schema.String),
      }),
    ),
  ),
  emulateMediaType: Schema.optional(Schema.String),
  gotoOptions: Schema.optional(
    Schema.Struct({
      referer: Schema.optional(Schema.String),
      referrerPolicy: Schema.optional(Schema.String),
      timeout: Schema.optional(Schema.Number),
      waitUntil: Schema.optional(
        Schema.Union(
          Schema.Literal("load"),
          Schema.Literal("domcontentloaded"),
          Schema.Literal("networkidle0"),
          Schema.Literal("networkidle2"),
          Schema.Array(Schema.Literal("load", "domcontentloaded", "networkidle0", "networkidle2")),
        ),
      ),
    }),
  ),
  html: Schema.optional(Schema.String),
  rejectRequestPattern: Schema.optional(Schema.Array(Schema.String)),
  rejectResourceTypes: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "document",
        "stylesheet",
        "image",
        "media",
        "font",
        "script",
        "texttrack",
        "xhr",
        "fetch",
        "prefetch",
        "eventsource",
        "websocket",
        "manifest",
        "signedexchange",
        "ping",
        "cspviolationreport",
        "preflight",
        "other",
      ),
    ),
  ),
  screenshotOptions: Schema.optional(
    Schema.Struct({
      captureBeyondViewport: Schema.optional(Schema.Boolean),
      clip: Schema.optional(
        Schema.Struct({
          height: Schema.Number,
          width: Schema.Number,
          x: Schema.Number,
          y: Schema.Number,
          scale: Schema.optional(Schema.Number),
        }),
      ),
      fromSurface: Schema.optional(Schema.Boolean),
      fullPage: Schema.optional(Schema.Boolean),
      omitBackground: Schema.optional(Schema.Boolean),
      optimizeForSpeed: Schema.optional(Schema.Boolean),
      quality: Schema.optional(Schema.Number),
      type: Schema.optional(Schema.Literal("png", "jpeg", "webp")),
    }),
  ),
  setExtraHTTPHeaders: Schema.optional(Schema.Struct({})),
  setJavaScriptEnabled: Schema.optional(Schema.Boolean),
  url: Schema.optional(Schema.String),
  userAgent: Schema.optional(Schema.String),
  viewport: Schema.optional(
    Schema.Struct({
      height: Schema.Number,
      width: Schema.Number,
      deviceScaleFactor: Schema.optional(Schema.Number),
      hasTouch: Schema.optional(Schema.Boolean),
      isLandscape: Schema.optional(Schema.Boolean),
      isMobile: Schema.optional(Schema.Boolean),
    }),
  ),
  waitForSelector: Schema.optional(
    Schema.Struct({
      selector: Schema.String,
      hidden: Schema.optional(Schema.Literal(true)),
      timeout: Schema.optional(Schema.Number),
      visible: Schema.optional(Schema.Literal(true)),
    }),
  ),
  waitForTimeout: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/browser-rendering/snapshot" }),
) as unknown as Schema.Schema<CreateSnapshotRequest>;

export interface CreateSnapshotResponse {
  /** HTML content */
  content: string;
  /** Base64 encoded image */
  screenshot: string;
}

export const CreateSnapshotResponse = Schema.Struct({
  content: Schema.String,
  screenshot: Schema.String,
}) as unknown as Schema.Schema<CreateSnapshotResponse>;

export const createSnapshot = API.make(() => ({
  input: CreateSnapshotRequest,
  output: CreateSnapshotResponse,
  errors: [],
}));

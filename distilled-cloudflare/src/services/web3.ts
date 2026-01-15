/**
 * Cloudflare WEB3 API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service web3
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Hostname
// =============================================================================

export interface GetHostnameRequest {
  identifier: string;
  /** Specify the identifier of the hostname. */
  zoneId: string;
}

export const GetHostnameRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/web3/hostnames/{identifier}" }),
) as unknown as Schema.Schema<GetHostnameRequest>;

export interface GetHostnameResponse {
  /** Specify the identifier of the hostname. */
  id?: string;
  createdOn?: string;
  /** Specify an optional description of the hostname. */
  description?: string;
  /** Specify the DNSLink value used if the target is ipfs. */
  dnslink?: string;
  modifiedOn?: string;
  /** Specify the hostname that points to the target gateway via CNAME. */
  name?: string;
  /** Specifies the status of the hostname's activation. */
  status?: "active" | "pending" | "deleting" | "error";
  /** Specify the target gateway of the hostname. */
  target?: "ethereum" | "ipfs" | "ipfs_universal_path";
}

export const GetHostnameResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  dnslink: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  status: Schema.optional(Schema.Literal("active", "pending", "deleting", "error")),
  target: Schema.optional(Schema.Literal("ethereum", "ipfs", "ipfs_universal_path")),
}) as unknown as Schema.Schema<GetHostnameResponse>;

export const getHostname = API.make(() => ({
  input: GetHostnameRequest,
  output: GetHostnameResponse,
  errors: [],
}));

export interface CreateHostnameRequest {
  /** Path param: Specify the identifier of the hostname. */
  zoneId: string;
  /** Body param: Specify the hostname that points to the target gateway via CNAME. */
  name: string;
  /** Body param: Specify the target gateway of the hostname. */
  target: "ethereum" | "ipfs" | "ipfs_universal_path";
  /** Body param: Specify an optional description of the hostname. */
  description?: string;
  /** Body param: Specify the DNSLink value used if the target is ipfs. */
  dnslink?: string;
}

export const CreateHostnameRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  name: Schema.String,
  target: Schema.Literal("ethereum", "ipfs", "ipfs_universal_path"),
  description: Schema.optional(Schema.String),
  dnslink: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/web3/hostnames" }),
) as unknown as Schema.Schema<CreateHostnameRequest>;

export interface CreateHostnameResponse {
  /** Specify the identifier of the hostname. */
  id?: string;
  createdOn?: string;
  /** Specify an optional description of the hostname. */
  description?: string;
  /** Specify the DNSLink value used if the target is ipfs. */
  dnslink?: string;
  modifiedOn?: string;
  /** Specify the hostname that points to the target gateway via CNAME. */
  name?: string;
  /** Specifies the status of the hostname's activation. */
  status?: "active" | "pending" | "deleting" | "error";
  /** Specify the target gateway of the hostname. */
  target?: "ethereum" | "ipfs" | "ipfs_universal_path";
}

export const CreateHostnameResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  dnslink: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  status: Schema.optional(Schema.Literal("active", "pending", "deleting", "error")),
  target: Schema.optional(Schema.Literal("ethereum", "ipfs", "ipfs_universal_path")),
}) as unknown as Schema.Schema<CreateHostnameResponse>;

export const createHostname = API.make(() => ({
  input: CreateHostnameRequest,
  output: CreateHostnameResponse,
  errors: [],
}));

export interface PatchHostnameRequest {
  identifier: string;
  /** Path param: Specify the identifier of the hostname. */
  zoneId: string;
  /** Body param: Specify an optional description of the hostname. */
  description?: string;
  /** Body param: Specify the DNSLink value used if the target is ipfs. */
  dnslink?: string;
}

export const PatchHostnameRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  description: Schema.optional(Schema.String),
  dnslink: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/web3/hostnames/{identifier}" }),
) as unknown as Schema.Schema<PatchHostnameRequest>;

export interface PatchHostnameResponse {
  /** Specify the identifier of the hostname. */
  id?: string;
  createdOn?: string;
  /** Specify an optional description of the hostname. */
  description?: string;
  /** Specify the DNSLink value used if the target is ipfs. */
  dnslink?: string;
  modifiedOn?: string;
  /** Specify the hostname that points to the target gateway via CNAME. */
  name?: string;
  /** Specifies the status of the hostname's activation. */
  status?: "active" | "pending" | "deleting" | "error";
  /** Specify the target gateway of the hostname. */
  target?: "ethereum" | "ipfs" | "ipfs_universal_path";
}

export const PatchHostnameResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  dnslink: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  status: Schema.optional(Schema.Literal("active", "pending", "deleting", "error")),
  target: Schema.optional(Schema.Literal("ethereum", "ipfs", "ipfs_universal_path")),
}) as unknown as Schema.Schema<PatchHostnameResponse>;

export const patchHostname = API.make(() => ({
  input: PatchHostnameRequest,
  output: PatchHostnameResponse,
  errors: [],
}));

export interface DeleteHostnameRequest {
  identifier: string;
  /** Specify the identifier of the hostname. */
  zoneId: string;
}

export const DeleteHostnameRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/web3/hostnames/{identifier}" }),
) as unknown as Schema.Schema<DeleteHostnameRequest>;

export type DeleteHostnameResponse = unknown;

export const DeleteHostnameResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteHostnameResponse>;

export const deleteHostname = API.make(() => ({
  input: DeleteHostnameRequest,
  output: DeleteHostnameResponse,
  errors: [],
}));

// =============================================================================
// HostnameIpfsUniversalPathContentList
// =============================================================================

export interface GetHostnameIpfsUniversalPathContentListRequest {
  identifier: string;
  /** Specify the identifier of the hostname. */
  zoneId: string;
}

export const GetHostnameIpfsUniversalPathContentListRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/web3/hostnames/{identifier}/ipfs_universal_path/content_list",
  }),
) as unknown as Schema.Schema<GetHostnameIpfsUniversalPathContentListRequest>;

export interface GetHostnameIpfsUniversalPathContentListResponse {
  /** Behavior of the content list. */
  action?: "block";
}

export const GetHostnameIpfsUniversalPathContentListResponse = Schema.Struct({
  action: Schema.optional(Schema.Literal("block")),
}) as unknown as Schema.Schema<GetHostnameIpfsUniversalPathContentListResponse>;

export const getHostnameIpfsUniversalPathContentList = API.make(() => ({
  input: GetHostnameIpfsUniversalPathContentListRequest,
  output: GetHostnameIpfsUniversalPathContentListResponse,
  errors: [],
}));

export interface PutHostnameIpfsUniversalPathContentListRequest {
  identifier: string;
  /** Path param: Specify the identifier of the hostname. */
  zoneId: string;
  /** Body param: Behavior of the content list. */
  action: "block";
  /** Body param: Provides content list entries. */
  entries: { content?: string; description?: string; type?: "cid" | "content_path" }[];
}

export const PutHostnameIpfsUniversalPathContentListRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  action: Schema.Literal("block"),
  entries: Schema.Array(
    Schema.Struct({
      content: Schema.optional(Schema.String),
      description: Schema.optional(Schema.String),
      type: Schema.optional(Schema.Literal("cid", "content_path")),
    }),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/zones/{zone_id}/web3/hostnames/{identifier}/ipfs_universal_path/content_list",
  }),
) as unknown as Schema.Schema<PutHostnameIpfsUniversalPathContentListRequest>;

export interface PutHostnameIpfsUniversalPathContentListResponse {
  /** Behavior of the content list. */
  action?: "block";
}

export const PutHostnameIpfsUniversalPathContentListResponse = Schema.Struct({
  action: Schema.optional(Schema.Literal("block")),
}) as unknown as Schema.Schema<PutHostnameIpfsUniversalPathContentListResponse>;

export const putHostnameIpfsUniversalPathContentList = API.make(() => ({
  input: PutHostnameIpfsUniversalPathContentListRequest,
  output: PutHostnameIpfsUniversalPathContentListResponse,
  errors: [],
}));

// =============================================================================
// HostnameIpfsUniversalPathContentListEntry
// =============================================================================

export interface GetHostnameIpfsUniversalPathContentListEntryRequest {
  identifier: string;
  contentListEntryIdentifier: string;
  /** Specify the identifier of the hostname. */
  zoneId: string;
}

export const GetHostnameIpfsUniversalPathContentListEntryRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  contentListEntryIdentifier: Schema.String.pipe(T.HttpPath("contentListEntryIdentifier")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/web3/hostnames/{identifier}/ipfs_universal_path/content_list/entries/{contentListEntryIdentifier}",
  }),
) as unknown as Schema.Schema<GetHostnameIpfsUniversalPathContentListEntryRequest>;

export interface GetHostnameIpfsUniversalPathContentListEntryResponse {
  /** Specify the identifier of the hostname. */
  id?: string;
  /** Specify the CID or content path of content to block. */
  content?: string;
  createdOn?: string;
  /** Specify an optional description of the content list entry. */
  description?: string;
  modifiedOn?: string;
  /** Specify the type of content list entry to block. */
  type?: "cid" | "content_path";
}

export const GetHostnameIpfsUniversalPathContentListEntryResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  content: Schema.optional(Schema.String),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  type: Schema.optional(Schema.Literal("cid", "content_path")),
}) as unknown as Schema.Schema<GetHostnameIpfsUniversalPathContentListEntryResponse>;

export const getHostnameIpfsUniversalPathContentListEntry = API.make(() => ({
  input: GetHostnameIpfsUniversalPathContentListEntryRequest,
  output: GetHostnameIpfsUniversalPathContentListEntryResponse,
  errors: [],
}));

export interface ListHostnameIpfsUniversalPathContentListEntriesRequest {
  identifier: string;
  /** Specify the identifier of the hostname. */
  zoneId: string;
}

export const ListHostnameIpfsUniversalPathContentListEntriesRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/web3/hostnames/{identifier}/ipfs_universal_path/content_list/entries",
  }),
) as unknown as Schema.Schema<ListHostnameIpfsUniversalPathContentListEntriesRequest>;

export type ListHostnameIpfsUniversalPathContentListEntriesResponse = unknown;

export const ListHostnameIpfsUniversalPathContentListEntriesResponse =
  Schema.Unknown as unknown as Schema.Schema<ListHostnameIpfsUniversalPathContentListEntriesResponse>;

export const listHostnameIpfsUniversalPathContentListEntries = API.make(() => ({
  input: ListHostnameIpfsUniversalPathContentListEntriesRequest,
  output: ListHostnameIpfsUniversalPathContentListEntriesResponse,
  errors: [],
}));

export interface CreateHostnameIpfsUniversalPathContentListEntryRequest {
  identifier: string;
  /** Path param: Specify the identifier of the hostname. */
  zoneId: string;
  /** Body param: Specify the CID or content path of content to block. */
  content: string;
  /** Body param: Specify the type of content list entry to block. */
  type: "cid" | "content_path";
  /** Body param: Specify an optional description of the content list entry. */
  description?: string;
}

export const CreateHostnameIpfsUniversalPathContentListEntryRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  content: Schema.String,
  type: Schema.Literal("cid", "content_path"),
  description: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/zones/{zone_id}/web3/hostnames/{identifier}/ipfs_universal_path/content_list/entries",
  }),
) as unknown as Schema.Schema<CreateHostnameIpfsUniversalPathContentListEntryRequest>;

export interface CreateHostnameIpfsUniversalPathContentListEntryResponse {
  /** Specify the identifier of the hostname. */
  id?: string;
  /** Specify the CID or content path of content to block. */
  content?: string;
  createdOn?: string;
  /** Specify an optional description of the content list entry. */
  description?: string;
  modifiedOn?: string;
  /** Specify the type of content list entry to block. */
  type?: "cid" | "content_path";
}

export const CreateHostnameIpfsUniversalPathContentListEntryResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  content: Schema.optional(Schema.String),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  type: Schema.optional(Schema.Literal("cid", "content_path")),
}) as unknown as Schema.Schema<CreateHostnameIpfsUniversalPathContentListEntryResponse>;

export const createHostnameIpfsUniversalPathContentListEntry = API.make(() => ({
  input: CreateHostnameIpfsUniversalPathContentListEntryRequest,
  output: CreateHostnameIpfsUniversalPathContentListEntryResponse,
  errors: [],
}));

export interface UpdateHostnameIpfsUniversalPathContentListEntryRequest {
  identifier: string;
  contentListEntryIdentifier: string;
  /** Path param: Specify the identifier of the hostname. */
  zoneId: string;
  /** Body param: Specify the CID or content path of content to block. */
  content: string;
  /** Body param: Specify the type of content list entry to block. */
  type: "cid" | "content_path";
  /** Body param: Specify an optional description of the content list entry. */
  description?: string;
}

export const UpdateHostnameIpfsUniversalPathContentListEntryRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  contentListEntryIdentifier: Schema.String.pipe(T.HttpPath("contentListEntryIdentifier")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  content: Schema.String,
  type: Schema.Literal("cid", "content_path"),
  description: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/zones/{zone_id}/web3/hostnames/{identifier}/ipfs_universal_path/content_list/entries/{contentListEntryIdentifier}",
  }),
) as unknown as Schema.Schema<UpdateHostnameIpfsUniversalPathContentListEntryRequest>;

export interface UpdateHostnameIpfsUniversalPathContentListEntryResponse {
  /** Specify the identifier of the hostname. */
  id?: string;
  /** Specify the CID or content path of content to block. */
  content?: string;
  createdOn?: string;
  /** Specify an optional description of the content list entry. */
  description?: string;
  modifiedOn?: string;
  /** Specify the type of content list entry to block. */
  type?: "cid" | "content_path";
}

export const UpdateHostnameIpfsUniversalPathContentListEntryResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  content: Schema.optional(Schema.String),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  type: Schema.optional(Schema.Literal("cid", "content_path")),
}) as unknown as Schema.Schema<UpdateHostnameIpfsUniversalPathContentListEntryResponse>;

export const updateHostnameIpfsUniversalPathContentListEntry = API.make(() => ({
  input: UpdateHostnameIpfsUniversalPathContentListEntryRequest,
  output: UpdateHostnameIpfsUniversalPathContentListEntryResponse,
  errors: [],
}));

export interface DeleteHostnameIpfsUniversalPathContentListEntryRequest {
  identifier: string;
  contentListEntryIdentifier: string;
  /** Specify the identifier of the hostname. */
  zoneId: string;
}

export const DeleteHostnameIpfsUniversalPathContentListEntryRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  contentListEntryIdentifier: Schema.String.pipe(T.HttpPath("contentListEntryIdentifier")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/web3/hostnames/{identifier}/ipfs_universal_path/content_list/entries/{contentListEntryIdentifier}",
  }),
) as unknown as Schema.Schema<DeleteHostnameIpfsUniversalPathContentListEntryRequest>;

export type DeleteHostnameIpfsUniversalPathContentListEntryResponse = unknown;

export const DeleteHostnameIpfsUniversalPathContentListEntryResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteHostnameIpfsUniversalPathContentListEntryResponse>;

export const deleteHostnameIpfsUniversalPathContentListEntry = API.make(() => ({
  input: DeleteHostnameIpfsUniversalPathContentListEntryRequest,
  output: DeleteHostnameIpfsUniversalPathContentListEntryResponse,
  errors: [],
}));

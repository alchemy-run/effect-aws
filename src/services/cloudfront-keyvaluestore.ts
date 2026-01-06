import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "CloudFront KeyValueStore",
  serviceShapeName: "CloudFrontKeyValueStore",
});
const auth = T.AwsAuthSigv4({ name: "cloudfront-keyvaluestore" });
const ver = T.ServiceVersion("2022-07-26");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    KvsARN: {
      required: false,
      documentation: "The ARN of the Key Value Store",
      type: "string",
    },
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
    UseFIPS: {
      builtIn: "AWS::UseFIPS",
      required: true,
      default: false,
      documentation:
        "When true, send this request to the FIPS-compliant regional endpoint. If the configured endpoint does not have a FIPS compliant endpoint, dispatching the request will return an error.",
      type: "boolean",
    },
    Endpoint: {
      builtIn: "SDK::Endpoint",
      required: false,
      documentation: "Override the endpoint used to send this request",
      type: "string",
    },
  },
  rules: [
    {
      conditions: [{ fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] }],
      rules: [
        {
          conditions: [{ fn: "isSet", argv: [{ ref: "KvsARN" }] }],
          rules: [
            {
              conditions: [
                {
                  fn: "aws.parseArn",
                  argv: [{ ref: "KvsARN" }],
                  assign: "parsedArn",
                },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "parsedArn" }, "service"],
                        },
                        "cloudfront",
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "parsedArn" }, "region"],
                            },
                            "",
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "parsedArn" }, "resourceId[0]"],
                              assign: "arnType",
                            },
                          ],
                          rules: [
                            {
                              conditions: [
                                {
                                  fn: "not",
                                  argv: [
                                    {
                                      fn: "stringEquals",
                                      argv: [{ ref: "arnType" }, ""],
                                    },
                                  ],
                                },
                              ],
                              rules: [
                                {
                                  conditions: [
                                    {
                                      fn: "stringEquals",
                                      argv: [
                                        { ref: "arnType" },
                                        "key-value-store",
                                      ],
                                    },
                                  ],
                                  rules: [
                                    {
                                      conditions: [
                                        {
                                          fn: "stringEquals",
                                          argv: [
                                            {
                                              fn: "getAttr",
                                              argv: [
                                                { ref: "parsedArn" },
                                                "partition",
                                              ],
                                            },
                                            "aws",
                                          ],
                                        },
                                      ],
                                      rules: [
                                        {
                                          conditions: [
                                            {
                                              fn: "isSet",
                                              argv: [{ ref: "Region" }],
                                            },
                                          ],
                                          rules: [
                                            {
                                              conditions: [
                                                {
                                                  fn: "aws.partition",
                                                  argv: [{ ref: "Region" }],
                                                  assign: "partitionResult",
                                                },
                                              ],
                                              rules: [
                                                {
                                                  conditions: [
                                                    {
                                                      fn: "stringEquals",
                                                      argv: [
                                                        {
                                                          fn: "getAttr",
                                                          argv: [
                                                            {
                                                              ref: "partitionResult",
                                                            },
                                                            "name",
                                                          ],
                                                        },
                                                        "{parsedArn#partition}",
                                                      ],
                                                    },
                                                  ],
                                                  rules: [
                                                    {
                                                      conditions: [
                                                        {
                                                          fn: "isSet",
                                                          argv: [
                                                            { ref: "Endpoint" },
                                                          ],
                                                        },
                                                      ],
                                                      rules: [
                                                        {
                                                          conditions: [
                                                            {
                                                              fn: "parseURL",
                                                              argv: [
                                                                {
                                                                  ref: "Endpoint",
                                                                },
                                                              ],
                                                              assign: "url",
                                                            },
                                                          ],
                                                          rules: [
                                                            {
                                                              conditions: [],
                                                              endpoint: {
                                                                url: "{url#scheme}://{parsedArn#accountId}.{url#authority}{url#path}",
                                                                properties: {
                                                                  authSchemes: [
                                                                    {
                                                                      name: "sigv4a",
                                                                      signingName:
                                                                        "cloudfront-keyvaluestore",
                                                                      signingRegionSet:
                                                                        ["*"],
                                                                    },
                                                                  ],
                                                                },
                                                                headers: {},
                                                              },
                                                              type: "endpoint",
                                                            },
                                                          ],
                                                          type: "tree",
                                                        },
                                                        {
                                                          conditions: [],
                                                          error:
                                                            "Provided endpoint is not a valid URL",
                                                          type: "error",
                                                        },
                                                      ],
                                                      type: "tree",
                                                    },
                                                    {
                                                      conditions: [],
                                                      endpoint: {
                                                        url: "https://{parsedArn#accountId}.cloudfront-kvs.global.api.aws",
                                                        properties: {
                                                          authSchemes: [
                                                            {
                                                              name: "sigv4a",
                                                              signingName:
                                                                "cloudfront-keyvaluestore",
                                                              signingRegionSet:
                                                                ["*"],
                                                            },
                                                          ],
                                                        },
                                                        headers: {},
                                                      },
                                                      type: "endpoint",
                                                    },
                                                  ],
                                                  type: "tree",
                                                },
                                                {
                                                  conditions: [],
                                                  error:
                                                    "Client was configured for partition `{partitionResult#name}` but Kvs ARN has `{parsedArn#partition}`",
                                                  type: "error",
                                                },
                                              ],
                                              type: "tree",
                                            },
                                          ],
                                          type: "tree",
                                        },
                                        {
                                          conditions: [
                                            {
                                              fn: "isSet",
                                              argv: [{ ref: "Endpoint" }],
                                            },
                                          ],
                                          rules: [
                                            {
                                              conditions: [
                                                {
                                                  fn: "parseURL",
                                                  argv: [{ ref: "Endpoint" }],
                                                  assign: "url",
                                                },
                                              ],
                                              rules: [
                                                {
                                                  conditions: [],
                                                  endpoint: {
                                                    url: "{url#scheme}://{parsedArn#accountId}.{url#authority}{url#path}",
                                                    properties: {
                                                      authSchemes: [
                                                        {
                                                          name: "sigv4a",
                                                          signingName:
                                                            "cloudfront-keyvaluestore",
                                                          signingRegionSet: [
                                                            "*",
                                                          ],
                                                        },
                                                      ],
                                                    },
                                                    headers: {},
                                                  },
                                                  type: "endpoint",
                                                },
                                              ],
                                              type: "tree",
                                            },
                                            {
                                              conditions: [],
                                              error:
                                                "Provided endpoint is not a valid URL",
                                              type: "error",
                                            },
                                          ],
                                          type: "tree",
                                        },
                                        {
                                          conditions: [],
                                          endpoint: {
                                            url: "https://{parsedArn#accountId}.cloudfront-kvs.global.api.aws",
                                            properties: {
                                              authSchemes: [
                                                {
                                                  name: "sigv4a",
                                                  signingName:
                                                    "cloudfront-keyvaluestore",
                                                  signingRegionSet: ["*"],
                                                },
                                              ],
                                            },
                                            headers: {},
                                          },
                                          type: "endpoint",
                                        },
                                      ],
                                      type: "tree",
                                    },
                                    {
                                      conditions: [],
                                      error:
                                        "CloudFront-KeyValueStore is not supported in partition `{parsedArn#partition}`",
                                      type: "error",
                                    },
                                  ],
                                  type: "tree",
                                },
                                {
                                  conditions: [],
                                  error:
                                    "ARN resource type is invalid. Expected `key-value-store`, found: `{arnType}`",
                                  type: "error",
                                },
                              ],
                              type: "tree",
                            },
                            {
                              conditions: [],
                              error:
                                "No resource type found in the KVS ARN. Resource type must be `key-value-store`.",
                              type: "error",
                            },
                          ],
                          type: "tree",
                        },
                        {
                          conditions: [],
                          error:
                            "No resource type found in the KVS ARN. Resource type must be `key-value-store`.",
                          type: "error",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      error:
                        "Provided ARN must be a global resource ARN. Found: `{parsedArn#region}`",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "Provided ARN is not a valid CloudFront Service ARN. Found: `{parsedArn#service}`",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              error: "KVS ARN must be a valid ARN",
              type: "error",
            },
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "KVS ARN must be provided to use this service",
          type: "error",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      error:
        "Invalid Configuration: FIPS is not supported with CloudFront-KeyValueStore.",
      type: "error",
    },
  ],
});

//# Newtypes
export type KvsARN = string;
export type Key = string;
export type Etag = string;
export type Value = string | Redacted.Redacted<string>;

//# Schemas
export interface DeleteKeyRequest {
  KvsARN: string;
  Key: string;
  IfMatch: string;
}
export const DeleteKeyRequest = S.suspend(() =>
  S.Struct({
    KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/key-value-stores/{KvsARN}/keys/{Key}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKeyRequest",
}) as any as S.Schema<DeleteKeyRequest>;
export interface DescribeKeyValueStoreRequest {
  KvsARN: string;
}
export const DescribeKeyValueStoreRequest = S.suspend(() =>
  S.Struct({
    KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/key-value-stores/{KvsARN}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeKeyValueStoreRequest",
}) as any as S.Schema<DescribeKeyValueStoreRequest>;
export interface GetKeyRequest {
  KvsARN: string;
  Key: string;
}
export const GetKeyRequest = S.suspend(() =>
  S.Struct({
    KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")),
    Key: S.String.pipe(T.HttpLabel("Key")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/key-value-stores/{KvsARN}/keys/{Key}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKeyRequest",
}) as any as S.Schema<GetKeyRequest>;
export interface ListKeysRequest {
  KvsARN: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListKeysRequest = S.suspend(() =>
  S.Struct({
    KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/key-value-stores/{KvsARN}/keys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKeysRequest",
}) as any as S.Schema<ListKeysRequest>;
export interface PutKeyRequest {
  Key: string;
  Value: string | Redacted.Redacted<string>;
  KvsARN: string;
  IfMatch: string;
}
export const PutKeyRequest = S.suspend(() =>
  S.Struct({
    Key: S.String.pipe(T.HttpLabel("Key")),
    Value: SensitiveString,
    KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/key-value-stores/{KvsARN}/keys/{Key}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutKeyRequest",
}) as any as S.Schema<PutKeyRequest>;
export interface PutKeyRequestListItem {
  Key: string;
  Value: string | Redacted.Redacted<string>;
}
export const PutKeyRequestListItem = S.suspend(() =>
  S.Struct({ Key: S.String, Value: SensitiveString }),
).annotations({
  identifier: "PutKeyRequestListItem",
}) as any as S.Schema<PutKeyRequestListItem>;
export type PutKeyRequestsList = PutKeyRequestListItem[];
export const PutKeyRequestsList = S.Array(PutKeyRequestListItem);
export interface DeleteKeyRequestListItem {
  Key: string;
}
export const DeleteKeyRequestListItem = S.suspend(() =>
  S.Struct({ Key: S.String }),
).annotations({
  identifier: "DeleteKeyRequestListItem",
}) as any as S.Schema<DeleteKeyRequestListItem>;
export type DeleteKeyRequestsList = DeleteKeyRequestListItem[];
export const DeleteKeyRequestsList = S.Array(DeleteKeyRequestListItem);
export interface DeleteKeyResponse {
  ItemCount: number;
  TotalSizeInBytes: number;
  ETag: string;
}
export const DeleteKeyResponse = S.suspend(() =>
  S.Struct({
    ItemCount: S.Number,
    TotalSizeInBytes: S.Number,
    ETag: S.String.pipe(T.HttpHeader("ETag")),
  }),
).annotations({
  identifier: "DeleteKeyResponse",
}) as any as S.Schema<DeleteKeyResponse>;
export interface DescribeKeyValueStoreResponse {
  ItemCount: number;
  TotalSizeInBytes: number;
  KvsARN: string;
  Created: Date;
  ETag: string;
  LastModified?: Date;
  Status?: string;
  FailureReason?: string;
}
export const DescribeKeyValueStoreResponse = S.suspend(() =>
  S.Struct({
    ItemCount: S.Number,
    TotalSizeInBytes: S.Number,
    KvsARN: S.String,
    Created: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ETag: S.String.pipe(T.HttpHeader("ETag")),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeKeyValueStoreResponse",
}) as any as S.Schema<DescribeKeyValueStoreResponse>;
export interface GetKeyResponse {
  Key: string;
  Value: string | Redacted.Redacted<string>;
  ItemCount: number;
  TotalSizeInBytes: number;
}
export const GetKeyResponse = S.suspend(() =>
  S.Struct({
    Key: S.String,
    Value: SensitiveString,
    ItemCount: S.Number,
    TotalSizeInBytes: S.Number,
  }),
).annotations({
  identifier: "GetKeyResponse",
}) as any as S.Schema<GetKeyResponse>;
export interface PutKeyResponse {
  ItemCount: number;
  TotalSizeInBytes: number;
  ETag: string;
}
export const PutKeyResponse = S.suspend(() =>
  S.Struct({
    ItemCount: S.Number,
    TotalSizeInBytes: S.Number,
    ETag: S.String.pipe(T.HttpHeader("ETag")),
  }),
).annotations({
  identifier: "PutKeyResponse",
}) as any as S.Schema<PutKeyResponse>;
export interface UpdateKeysRequest {
  KvsARN: string;
  IfMatch: string;
  Puts?: PutKeyRequestsList;
  Deletes?: DeleteKeyRequestsList;
}
export const UpdateKeysRequest = S.suspend(() =>
  S.Struct({
    KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    Puts: S.optional(PutKeyRequestsList),
    Deletes: S.optional(DeleteKeyRequestsList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/key-value-stores/{KvsARN}/keys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKeysRequest",
}) as any as S.Schema<UpdateKeysRequest>;
export interface ListKeysResponseListItem {
  Key: string;
  Value: string | Redacted.Redacted<string>;
}
export const ListKeysResponseListItem = S.suspend(() =>
  S.Struct({ Key: S.String, Value: SensitiveString }),
).annotations({
  identifier: "ListKeysResponseListItem",
}) as any as S.Schema<ListKeysResponseListItem>;
export type ListKeysResponseList = ListKeysResponseListItem[];
export const ListKeysResponseList = S.Array(ListKeysResponseListItem);
export interface ListKeysResponse {
  NextToken?: string;
  Items?: ListKeysResponseList;
}
export const ListKeysResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Items: S.optional(ListKeysResponseList),
  }),
).annotations({
  identifier: "ListKeysResponse",
}) as any as S.Schema<ListKeysResponse>;
export interface UpdateKeysResponse {
  ItemCount: number;
  TotalSizeInBytes: number;
  ETag: string;
}
export const UpdateKeysResponse = S.suspend(() =>
  S.Struct({
    ItemCount: S.Number,
    TotalSizeInBytes: S.Number,
    ETag: S.String.pipe(T.HttpHeader("ETag")),
  }),
).annotations({
  identifier: "UpdateKeysResponse",
}) as any as S.Schema<UpdateKeysResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns metadata information about Key Value Store.
 */
export const describeKeyValueStore: (
  input: DescribeKeyValueStoreRequest,
) => Effect.Effect<
  DescribeKeyValueStoreResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeKeyValueStoreRequest,
  output: DescribeKeyValueStoreResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a key value pair.
 */
export const getKey: (
  input: GetKeyRequest,
) => Effect.Effect<
  GetKeyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyRequest,
  output: GetKeyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of key value pairs.
 */
export const listKeys: {
  (
    input: ListKeysRequest,
  ): Effect.Effect<
    ListKeysResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKeysRequest,
  ) => Stream.Stream<
    ListKeysResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKeysRequest,
  ) => Stream.Stream<
    ListKeysResponseListItem,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKeysRequest,
  output: ListKeysResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Puts or Deletes multiple key value pairs in a single, all-or-nothing operation.
 */
export const updateKeys: (
  input: UpdateKeysRequest,
) => Effect.Effect<
  UpdateKeysResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKeysRequest,
  output: UpdateKeysResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new key value pair or replaces the value of an existing key.
 */
export const putKey: (
  input: PutKeyRequest,
) => Effect.Effect<
  PutKeyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutKeyRequest,
  output: PutKeyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Deletes the key value pair specified by the key.
 */
export const deleteKey: (
  input: DeleteKeyRequest,
) => Effect.Effect<
  DeleteKeyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKeyRequest,
  output: DeleteKeyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export class DeleteKeyRequest extends S.Class<DeleteKeyRequest>(
  "DeleteKeyRequest",
)(
  {
    KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/key-value-stores/{KvsARN}/keys/{Key}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeKeyValueStoreRequest extends S.Class<DescribeKeyValueStoreRequest>(
  "DescribeKeyValueStoreRequest",
)(
  { KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")) },
  T.all(
    T.Http({ method: "GET", uri: "/key-value-stores/{KvsARN}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKeyRequest extends S.Class<GetKeyRequest>("GetKeyRequest")(
  {
    KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")),
    Key: S.String.pipe(T.HttpLabel("Key")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/key-value-stores/{KvsARN}/keys/{Key}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKeysRequest extends S.Class<ListKeysRequest>(
  "ListKeysRequest",
)(
  {
    KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/key-value-stores/{KvsARN}/keys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutKeyRequest extends S.Class<PutKeyRequest>("PutKeyRequest")(
  {
    Key: S.String.pipe(T.HttpLabel("Key")),
    Value: S.String,
    KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/key-value-stores/{KvsARN}/keys/{Key}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutKeyRequestListItem extends S.Class<PutKeyRequestListItem>(
  "PutKeyRequestListItem",
)({ Key: S.String, Value: S.String }) {}
export const PutKeyRequestsList = S.Array(PutKeyRequestListItem);
export class DeleteKeyRequestListItem extends S.Class<DeleteKeyRequestListItem>(
  "DeleteKeyRequestListItem",
)({ Key: S.String }) {}
export const DeleteKeyRequestsList = S.Array(DeleteKeyRequestListItem);
export class DeleteKeyResponse extends S.Class<DeleteKeyResponse>(
  "DeleteKeyResponse",
)({
  ItemCount: S.Number,
  TotalSizeInBytes: S.Number,
  ETag: S.String.pipe(T.HttpHeader("ETag")),
}) {}
export class DescribeKeyValueStoreResponse extends S.Class<DescribeKeyValueStoreResponse>(
  "DescribeKeyValueStoreResponse",
)({
  ItemCount: S.Number,
  TotalSizeInBytes: S.Number,
  KvsARN: S.String,
  Created: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ETag: S.String.pipe(T.HttpHeader("ETag")),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  FailureReason: S.optional(S.String),
}) {}
export class GetKeyResponse extends S.Class<GetKeyResponse>("GetKeyResponse")({
  Key: S.String,
  Value: S.String,
  ItemCount: S.Number,
  TotalSizeInBytes: S.Number,
}) {}
export class PutKeyResponse extends S.Class<PutKeyResponse>("PutKeyResponse")({
  ItemCount: S.Number,
  TotalSizeInBytes: S.Number,
  ETag: S.String.pipe(T.HttpHeader("ETag")),
}) {}
export class UpdateKeysRequest extends S.Class<UpdateKeysRequest>(
  "UpdateKeysRequest",
)(
  {
    KvsARN: S.String.pipe(T.HttpLabel("KvsARN"), T.ContextParam("KvsARN")),
    IfMatch: S.String.pipe(T.HttpHeader("If-Match")),
    Puts: S.optional(PutKeyRequestsList),
    Deletes: S.optional(DeleteKeyRequestsList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/key-value-stores/{KvsARN}/keys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKeysResponseListItem extends S.Class<ListKeysResponseListItem>(
  "ListKeysResponseListItem",
)({ Key: S.String, Value: S.String }) {}
export const ListKeysResponseList = S.Array(ListKeysResponseListItem);
export class ListKeysResponse extends S.Class<ListKeysResponse>(
  "ListKeysResponse",
)({
  NextToken: S.optional(S.String),
  Items: S.optional(ListKeysResponseList),
}) {}
export class UpdateKeysResponse extends S.Class<UpdateKeysResponse>(
  "UpdateKeysResponse",
)({
  ItemCount: S.Number,
  TotalSizeInBytes: S.Number,
  ETag: S.String.pipe(T.HttpHeader("ETag")),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns metadata information about Key Value Store.
 */
export const describeKeyValueStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeKeyValueStoreRequest,
    output: DescribeKeyValueStoreResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns a key value pair.
 */
export const getKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listKeys = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

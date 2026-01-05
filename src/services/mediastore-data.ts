import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace(
  "https://object.mediastore.amazonaws.com/doc/2017-09-01",
);
const svc = T.AwsApiService({
  sdkId: "MediaStore Data",
  serviceShapeName: "MediaStoreObject_20170901",
});
const auth = T.AwsAuthSigv4({ name: "mediastore" });
const ver = T.ServiceVersion("2017-09-01");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
    UseDualStack: {
      builtIn: "AWS::UseDualStack",
      required: true,
      default: false,
      documentation:
        "When true, use the dual-stack endpoint. If the configured endpoint does not support dual-stack, dispatching the request MAY return an error.",
      type: "boolean",
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
      conditions: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }],
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          error:
            "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Region" }] }],
      rules: [
        {
          conditions: [
            {
              fn: "aws.partition",
              argv: [{ ref: "Region" }],
              assign: "PartitionResult",
            },
          ],
          rules: [
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                      ],
                    },
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://data.mediastore-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
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
                    "FIPS and DualStack are enabled, but this partition does not support one or both",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://data.mediastore-fips.{Region}.{PartitionResult#dnsSuffix}",
                        properties: {},
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
                    "FIPS is enabled but this partition does not support FIPS",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://data.mediastore.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
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
                    "DualStack is enabled but this partition does not support DualStack",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://data.mediastore.{Region}.{PartitionResult#dnsSuffix}",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
          ],
          type: "tree",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      error: "Invalid Configuration: Missing Region",
      type: "error",
    },
  ],
});

//# Schemas
export class DeleteObjectRequest extends S.Class<DeleteObjectRequest>(
  "DeleteObjectRequest",
)(
  { Path: S.String.pipe(T.HttpLabel("Path")) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/{Path+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteObjectResponse extends S.Class<DeleteObjectResponse>(
  "DeleteObjectResponse",
)({}, ns) {}
export class DescribeObjectRequest extends S.Class<DescribeObjectRequest>(
  "DescribeObjectRequest",
)(
  { Path: S.String.pipe(T.HttpLabel("Path")) },
  T.all(
    ns,
    T.Http({ method: "HEAD", uri: "/{Path+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetObjectRequest extends S.Class<GetObjectRequest>(
  "GetObjectRequest",
)(
  {
    Path: S.String.pipe(T.HttpLabel("Path")),
    Range: S.optional(S.String).pipe(T.HttpHeader("Range")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/{Path+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListItemsRequest extends S.Class<ListItemsRequest>(
  "ListItemsRequest",
)(
  {
    Path: S.optional(S.String).pipe(T.HttpQuery("Path")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(ns, T.Http({ method: "GET", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutObjectRequest extends S.Class<PutObjectRequest>(
  "PutObjectRequest",
)(
  {
    Body: T.StreamingInput.pipe(T.HttpPayload()),
    Path: S.String.pipe(T.HttpLabel("Path")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    StorageClass: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-storage-class"),
    ),
    UploadAvailability: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-upload-availability"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/{Path+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeObjectResponse extends S.Class<DescribeObjectResponse>(
  "DescribeObjectResponse",
)(
  {
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("Last-Modified"),
    ),
  },
  ns,
) {}
export class GetObjectResponse extends S.Class<GetObjectResponse>(
  "GetObjectResponse",
)(
  {
    Body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ContentRange: S.optional(S.String).pipe(T.HttpHeader("Content-Range")),
    ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("Last-Modified"),
    ),
    StatusCode: S.Number.pipe(T.HttpResponseCode()),
  },
  ns,
) {}
export class PutObjectResponse extends S.Class<PutObjectResponse>(
  "PutObjectResponse",
)(
  {
    ContentSHA256: S.optional(S.String),
    ETag: S.optional(S.String),
    StorageClass: S.optional(S.String),
  },
  ns,
) {}
export class Item extends S.Class<Item>("Item")({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  ETag: S.optional(S.String),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ContentType: S.optional(S.String),
  ContentLength: S.optional(S.Number),
}) {}
export const ItemList = S.Array(Item);
export class ListItemsResponse extends S.Class<ListItemsResponse>(
  "ListItemsResponse",
)({ Items: S.optional(ItemList), NextToken: S.optional(S.String) }, ns) {}

//# Errors
export class ContainerNotFoundException extends S.TaggedError<ContainerNotFoundException>()(
  "ContainerNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { Message: S.optional(S.String) },
) {}
export class ObjectNotFoundException extends S.TaggedError<ObjectNotFoundException>()(
  "ObjectNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class RequestedRangeNotSatisfiableException extends S.TaggedError<RequestedRangeNotSatisfiableException>()(
  "RequestedRangeNotSatisfiableException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Provides a list of metadata entries about folders and objects in the specified
 * folder.
 */
export const listItems = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListItemsRequest,
  output: ListItemsResponse,
  errors: [ContainerNotFoundException, InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Uploads an object to the specified path. Object sizes are limited to 25 MB for standard upload availability and 10 MB for streaming upload availability.
 */
export const putObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutObjectRequest,
  output: PutObjectResponse,
  errors: [ContainerNotFoundException, InternalServerError],
}));
/**
 * Deletes an object at the specified path.
 */
export const deleteObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteObjectRequest,
  output: DeleteObjectResponse,
  errors: [
    ContainerNotFoundException,
    InternalServerError,
    ObjectNotFoundException,
  ],
}));
/**
 * Gets the headers for an object at the specified path.
 */
export const describeObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeObjectRequest,
  output: DescribeObjectResponse,
  errors: [
    ContainerNotFoundException,
    InternalServerError,
    ObjectNotFoundException,
  ],
}));
/**
 * Downloads the object at the specified path. If the object’s upload availability is set to `streaming`, AWS Elemental MediaStore downloads the object even if it’s still uploading the object.
 */
export const getObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectRequest,
  output: GetObjectResponse,
  errors: [
    ContainerNotFoundException,
    InternalServerError,
    ObjectNotFoundException,
    RequestedRangeNotSatisfiableException,
  ],
}));

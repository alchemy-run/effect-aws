import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "S3Outposts",
  serviceShapeName: "S3Outposts",
});
const auth = T.AwsAuthSigv4({ name: "s3-outposts" });
const ver = T.ServiceVersion("2017-07-25");
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
                        url: "https://s3-outposts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://s3-outposts-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://s3-outposts.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://s3-outposts.{Region}.{PartitionResult#dnsSuffix}",
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
export class CreateEndpointRequest extends S.Class<CreateEndpointRequest>(
  "CreateEndpointRequest",
)(
  {
    OutpostId: S.String,
    SubnetId: S.String,
    SecurityGroupId: S.String,
    AccessType: S.optional(S.String),
    CustomerOwnedIpv4Pool: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/S3Outposts/CreateEndpoint" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEndpointRequest extends S.Class<DeleteEndpointRequest>(
  "DeleteEndpointRequest",
)(
  {
    EndpointId: S.String.pipe(T.HttpQuery("endpointId")),
    OutpostId: S.String.pipe(T.HttpQuery("outpostId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/S3Outposts/DeleteEndpoint" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEndpointResponse extends S.Class<DeleteEndpointResponse>(
  "DeleteEndpointResponse",
)({}) {}
export class ListEndpointsRequest extends S.Class<ListEndpointsRequest>(
  "ListEndpointsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/S3Outposts/ListEndpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOutpostsWithS3Request extends S.Class<ListOutpostsWithS3Request>(
  "ListOutpostsWithS3Request",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/S3Outposts/ListOutpostsWithS3" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSharedEndpointsRequest extends S.Class<ListSharedEndpointsRequest>(
  "ListSharedEndpointsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    OutpostId: S.String.pipe(T.HttpQuery("outpostId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/S3Outposts/ListSharedEndpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEndpointResult extends S.Class<CreateEndpointResult>(
  "CreateEndpointResult",
)({ EndpointArn: S.optional(S.String) }) {}
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({ NetworkInterfaceId: S.optional(S.String) }) {}
export const NetworkInterfaces = S.Array(NetworkInterface);
export class FailedReason extends S.Class<FailedReason>("FailedReason")({
  ErrorCode: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  EndpointArn: S.optional(S.String),
  OutpostsId: S.optional(S.String),
  CidrBlock: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NetworkInterfaces: S.optional(NetworkInterfaces),
  VpcId: S.optional(S.String),
  SubnetId: S.optional(S.String),
  SecurityGroupId: S.optional(S.String),
  AccessType: S.optional(S.String),
  CustomerOwnedIpv4Pool: S.optional(S.String),
  FailedReason: S.optional(FailedReason),
}) {}
export const Endpoints = S.Array(Endpoint);
export class ListSharedEndpointsResult extends S.Class<ListSharedEndpointsResult>(
  "ListSharedEndpointsResult",
)({ Endpoints: S.optional(Endpoints), NextToken: S.optional(S.String) }) {}
export class Outpost extends S.Class<Outpost>("Outpost")({
  OutpostArn: S.optional(S.String),
  S3OutpostArn: S.optional(S.String),
  OutpostId: S.optional(S.String),
  OwnerId: S.optional(S.String),
  CapacityInBytes: S.optional(S.Number),
}) {}
export const Outposts = S.Array(Outpost);
export class ListOutpostsWithS3Result extends S.Class<ListOutpostsWithS3Result>(
  "ListOutpostsWithS3Result",
)({ Outposts: S.optional(Outposts), NextToken: S.optional(S.String) }) {}
export class ListEndpointsResult extends S.Class<ListEndpointsResult>(
  "ListEndpointsResult",
)({ Endpoints: S.optional(Endpoints), NextToken: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class OutpostOfflineException extends S.TaggedError<OutpostOfflineException>()(
  "OutpostOfflineException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the Outposts with S3 on Outposts capacity for your Amazon Web Services account.
 * Includes S3 on Outposts that you have access to as the Outposts owner, or as a shared user
 * from Resource Access Manager (RAM).
 */
export const listOutpostsWithS3 = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListOutpostsWithS3Request,
    output: ListOutpostsWithS3Result,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Outposts",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all endpoints associated with an Outpost that has been shared by Amazon Web Services Resource Access Manager (RAM).
 *
 * Related actions include:
 *
 * - CreateEndpoint
 *
 * - DeleteEndpoint
 */
export const listSharedEndpoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSharedEndpointsRequest,
    output: ListSharedEndpointsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Endpoints",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Creates an endpoint and associates it with the specified Outpost.
 *
 * It can take up to 5 minutes for this action to finish.
 *
 * Related actions include:
 *
 * - DeleteEndpoint
 *
 * - ListEndpoints
 */
export const createEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEndpointRequest,
  output: CreateEndpointResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    OutpostOfflineException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an endpoint.
 *
 * It can take up to 5 minutes for this action to finish.
 *
 * Related actions include:
 *
 * - CreateEndpoint
 *
 * - ListEndpoints
 */
export const deleteEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointRequest,
  output: DeleteEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    OutpostOfflineException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists endpoints associated with the specified Outpost.
 *
 * Related actions include:
 *
 * - CreateEndpoint
 *
 * - DeleteEndpoint
 */
export const listEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEndpointsRequest,
    output: ListEndpointsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Endpoints",
      pageSize: "MaxResults",
    } as const,
  }),
);

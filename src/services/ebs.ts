import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({ sdkId: "EBS", serviceShapeName: "Ebs" });
const auth = T.AwsAuthSigv4({ name: "ebs" });
const ver = T.ServiceVersion("2019-11-02");
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
                        url: "https://ebs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://ebs-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://ebs.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://ebs.{Region}.{PartitionResult#dnsSuffix}",
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
export class CompleteSnapshotRequest extends S.Class<CompleteSnapshotRequest>(
  "CompleteSnapshotRequest",
)(
  {
    SnapshotId: S.String.pipe(T.HttpLabel()),
    ChangedBlocksCount: S.Number.pipe(T.HttpHeader("x-amz-ChangedBlocksCount")),
    Checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-Checksum")),
    ChecksumAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-Checksum-Algorithm"),
    ),
    ChecksumAggregationMethod: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-Checksum-Aggregation-Method"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/snapshots/completion/{SnapshotId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSnapshotBlockRequest extends S.Class<GetSnapshotBlockRequest>(
  "GetSnapshotBlockRequest",
)(
  {
    SnapshotId: S.String.pipe(T.HttpLabel()),
    BlockIndex: S.Number.pipe(T.HttpLabel()),
    BlockToken: S.String.pipe(T.HttpQuery("blockToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/snapshots/{SnapshotId}/blocks/{BlockIndex}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListChangedBlocksRequest extends S.Class<ListChangedBlocksRequest>(
  "ListChangedBlocksRequest",
)(
  {
    FirstSnapshotId: S.optional(S.String).pipe(T.HttpQuery("firstSnapshotId")),
    SecondSnapshotId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("pageToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    StartingBlockIndex: S.optional(S.Number).pipe(
      T.HttpQuery("startingBlockIndex"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/snapshots/{SecondSnapshotId}/changedblocks",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSnapshotBlocksRequest extends S.Class<ListSnapshotBlocksRequest>(
  "ListSnapshotBlocksRequest",
)(
  {
    SnapshotId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("pageToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    StartingBlockIndex: S.optional(S.Number).pipe(
      T.HttpQuery("startingBlockIndex"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/snapshots/{SnapshotId}/blocks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutSnapshotBlockRequest extends S.Class<PutSnapshotBlockRequest>(
  "PutSnapshotBlockRequest",
)(
  {
    SnapshotId: S.String.pipe(T.HttpLabel()),
    BlockIndex: S.Number.pipe(T.HttpLabel()),
    BlockData: T.StreamingInput.pipe(T.HttpPayload()),
    DataLength: S.Number.pipe(T.HttpHeader("x-amz-Data-Length")),
    Progress: S.optional(S.Number).pipe(T.HttpHeader("x-amz-Progress")),
    Checksum: S.String.pipe(T.HttpHeader("x-amz-Checksum")),
    ChecksumAlgorithm: S.String.pipe(T.HttpHeader("x-amz-Checksum-Algorithm")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/snapshots/{SnapshotId}/blocks/{BlockIndex}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const Tags = S.Array(Tag);
export class CompleteSnapshotResponse extends S.Class<CompleteSnapshotResponse>(
  "CompleteSnapshotResponse",
)({ Status: S.optional(S.String) }) {}
export class GetSnapshotBlockResponse extends S.Class<GetSnapshotBlockResponse>(
  "GetSnapshotBlockResponse",
)({
  DataLength: S.optional(S.Number).pipe(T.HttpHeader("x-amz-Data-Length")),
  BlockData: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  Checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-Checksum")),
  ChecksumAlgorithm: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-Checksum-Algorithm"),
  ),
}) {}
export class PutSnapshotBlockResponse extends S.Class<PutSnapshotBlockResponse>(
  "PutSnapshotBlockResponse",
)({
  Checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-Checksum")),
  ChecksumAlgorithm: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-Checksum-Algorithm"),
  ),
}) {}
export class StartSnapshotRequest extends S.Class<StartSnapshotRequest>(
  "StartSnapshotRequest",
)(
  {
    VolumeSize: S.Number,
    ParentSnapshotId: S.optional(S.String),
    Tags: S.optional(Tags),
    Description: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    KmsKeyArn: S.optional(S.String),
    Timeout: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/snapshots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ChangedBlock extends S.Class<ChangedBlock>("ChangedBlock")({
  BlockIndex: S.optional(S.Number),
  FirstBlockToken: S.optional(S.String),
  SecondBlockToken: S.optional(S.String),
}) {}
export const ChangedBlocks = S.Array(ChangedBlock);
export class Block extends S.Class<Block>("Block")({
  BlockIndex: S.optional(S.Number),
  BlockToken: S.optional(S.String),
}) {}
export const Blocks = S.Array(Block);
export class ListChangedBlocksResponse extends S.Class<ListChangedBlocksResponse>(
  "ListChangedBlocksResponse",
)({
  ChangedBlocks: S.optional(ChangedBlocks),
  ExpiryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VolumeSize: S.optional(S.Number),
  BlockSize: S.optional(S.Number),
  NextToken: S.optional(S.String),
}) {}
export class ListSnapshotBlocksResponse extends S.Class<ListSnapshotBlocksResponse>(
  "ListSnapshotBlocksResponse",
)({
  Blocks: S.optional(Blocks),
  ExpiryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VolumeSize: S.optional(S.Number),
  BlockSize: S.optional(S.Number),
  NextToken: S.optional(S.String),
}) {}
export class StartSnapshotResponse extends S.Class<StartSnapshotResponse>(
  "StartSnapshotResponse",
)({
  Description: S.optional(S.String),
  SnapshotId: S.optional(S.String),
  OwnerId: S.optional(S.String),
  Status: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VolumeSize: S.optional(S.Number),
  BlockSize: S.optional(S.Number),
  Tags: S.optional(Tags),
  ParentSnapshotId: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  SseType: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class RequestThrottledException extends S.TaggedError<RequestThrottledException>()(
  "RequestThrottledException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ConcurrentLimitExceededException extends S.TaggedError<ConcurrentLimitExceededException>()(
  "ConcurrentLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns information about the blocks in an Amazon Elastic Block Store snapshot.
 *
 * You should always retry requests that receive server (`5xx`)
 * error responses, and `ThrottlingException` and `RequestThrottledException`
 * client error responses. For more information see Error retries in the
 * *Amazon Elastic Compute Cloud User Guide*.
 */
export const listSnapshotBlocks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSnapshotBlocksRequest,
  output: ListSnapshotBlocksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestThrottledException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Writes a block of data to a snapshot. If the specified block contains
 * data, the existing data is overwritten. The target snapshot must be in the
 * `pending` state.
 *
 * Data written to a snapshot must be aligned with 512-KiB sectors.
 *
 * You should always retry requests that receive server (`5xx`)
 * error responses, and `ThrottlingException` and `RequestThrottledException`
 * client error responses. For more information see Error retries in the
 * *Amazon Elastic Compute Cloud User Guide*.
 */
export const putSnapshotBlock = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSnapshotBlockRequest,
  output: PutSnapshotBlockResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestThrottledException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Seals and completes the snapshot after all of the required blocks of data have been
 * written to it. Completing the snapshot changes the status to `completed`. You
 * cannot write new blocks to a snapshot after it has been completed.
 *
 * You should always retry requests that receive server (`5xx`)
 * error responses, and `ThrottlingException` and `RequestThrottledException`
 * client error responses. For more information see Error retries in the
 * *Amazon Elastic Compute Cloud User Guide*.
 */
export const completeSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompleteSnapshotRequest,
  output: CompleteSnapshotResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestThrottledException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns the data in a block in an Amazon Elastic Block Store snapshot.
 *
 * You should always retry requests that receive server (`5xx`)
 * error responses, and `ThrottlingException` and `RequestThrottledException`
 * client error responses. For more information see Error retries in the
 * *Amazon Elastic Compute Cloud User Guide*.
 */
export const getSnapshotBlock = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSnapshotBlockRequest,
  output: GetSnapshotBlockResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestThrottledException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns information about the blocks that are different between two
 * Amazon Elastic Block Store snapshots of the same volume/snapshot lineage.
 *
 * You should always retry requests that receive server (`5xx`)
 * error responses, and `ThrottlingException` and `RequestThrottledException`
 * client error responses. For more information see Error retries in the
 * *Amazon Elastic Compute Cloud User Guide*.
 */
export const listChangedBlocks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListChangedBlocksRequest,
  output: ListChangedBlocksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestThrottledException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new Amazon EBS snapshot. The new snapshot enters the `pending` state
 * after the request completes.
 *
 * After creating the snapshot, use PutSnapshotBlock to
 * write blocks of data to the snapshot.
 *
 * You should always retry requests that receive server (`5xx`)
 * error responses, and `ThrottlingException` and `RequestThrottledException`
 * client error responses. For more information see Error retries in the
 * *Amazon Elastic Compute Cloud User Guide*.
 */
export const startSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSnapshotRequest,
  output: StartSnapshotResponse,
  errors: [
    AccessDeniedException,
    ConcurrentLimitExceededException,
    ConflictException,
    InternalServerException,
    RequestThrottledException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));

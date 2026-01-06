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

//# Newtypes
export type SnapshotId = string;
export type ChangedBlocksCount = number;
export type Checksum = string;
export type BlockIndex = number;
export type BlockToken = string;
export type PageToken = string;
export type MaxResults = number;
export type DataLength = number;
export type Progress = number;
export type VolumeSize = number;
export type Description = string;
export type IdempotencyToken = string;
export type KmsKeyArn = string | Redacted.Redacted<string>;
export type Timeout = number;
export type TagKey = string;
export type TagValue = string;
export type BlockSize = number;
export type ErrorMessage = string;
export type OwnerId = string;

//# Schemas
export interface CompleteSnapshotRequest {
  SnapshotId: string;
  ChangedBlocksCount: number;
  Checksum?: string;
  ChecksumAlgorithm?: string;
  ChecksumAggregationMethod?: string;
}
export const CompleteSnapshotRequest = S.suspend(() =>
  S.Struct({
    SnapshotId: S.String.pipe(T.HttpLabel("SnapshotId")),
    ChangedBlocksCount: S.Number.pipe(T.HttpHeader("x-amz-ChangedBlocksCount")),
    Checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-Checksum")),
    ChecksumAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-Checksum-Algorithm"),
    ),
    ChecksumAggregationMethod: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-Checksum-Aggregation-Method"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/snapshots/completion/{SnapshotId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CompleteSnapshotRequest",
}) as any as S.Schema<CompleteSnapshotRequest>;
export interface GetSnapshotBlockRequest {
  SnapshotId: string;
  BlockIndex: number;
  BlockToken: string;
}
export const GetSnapshotBlockRequest = S.suspend(() =>
  S.Struct({
    SnapshotId: S.String.pipe(T.HttpLabel("SnapshotId")),
    BlockIndex: S.Number.pipe(T.HttpLabel("BlockIndex")),
    BlockToken: S.String.pipe(T.HttpQuery("blockToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSnapshotBlockRequest",
}) as any as S.Schema<GetSnapshotBlockRequest>;
export interface ListChangedBlocksRequest {
  FirstSnapshotId?: string;
  SecondSnapshotId: string;
  NextToken?: string;
  MaxResults?: number;
  StartingBlockIndex?: number;
}
export const ListChangedBlocksRequest = S.suspend(() =>
  S.Struct({
    FirstSnapshotId: S.optional(S.String).pipe(T.HttpQuery("firstSnapshotId")),
    SecondSnapshotId: S.String.pipe(T.HttpLabel("SecondSnapshotId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("pageToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    StartingBlockIndex: S.optional(S.Number).pipe(
      T.HttpQuery("startingBlockIndex"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListChangedBlocksRequest",
}) as any as S.Schema<ListChangedBlocksRequest>;
export interface ListSnapshotBlocksRequest {
  SnapshotId: string;
  NextToken?: string;
  MaxResults?: number;
  StartingBlockIndex?: number;
}
export const ListSnapshotBlocksRequest = S.suspend(() =>
  S.Struct({
    SnapshotId: S.String.pipe(T.HttpLabel("SnapshotId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("pageToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    StartingBlockIndex: S.optional(S.Number).pipe(
      T.HttpQuery("startingBlockIndex"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/snapshots/{SnapshotId}/blocks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSnapshotBlocksRequest",
}) as any as S.Schema<ListSnapshotBlocksRequest>;
export interface PutSnapshotBlockRequest {
  SnapshotId: string;
  BlockIndex: number;
  BlockData: T.StreamingInputBody;
  DataLength: number;
  Progress?: number;
  Checksum: string;
  ChecksumAlgorithm: string;
}
export const PutSnapshotBlockRequest = S.suspend(() =>
  S.Struct({
    SnapshotId: S.String.pipe(T.HttpLabel("SnapshotId")),
    BlockIndex: S.Number.pipe(T.HttpLabel("BlockIndex")),
    BlockData: T.StreamingInput.pipe(T.HttpPayload()),
    DataLength: S.Number.pipe(T.HttpHeader("x-amz-Data-Length")),
    Progress: S.optional(S.Number).pipe(T.HttpHeader("x-amz-Progress")),
    Checksum: S.String.pipe(T.HttpHeader("x-amz-Checksum")),
    ChecksumAlgorithm: S.String.pipe(T.HttpHeader("x-amz-Checksum-Algorithm")),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutSnapshotBlockRequest",
}) as any as S.Schema<PutSnapshotBlockRequest>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CompleteSnapshotResponse {
  Status?: string;
}
export const CompleteSnapshotResponse = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({
  identifier: "CompleteSnapshotResponse",
}) as any as S.Schema<CompleteSnapshotResponse>;
export interface GetSnapshotBlockResponse {
  DataLength?: number;
  BlockData?: T.StreamingOutputBody;
  Checksum?: string;
  ChecksumAlgorithm?: string;
}
export const GetSnapshotBlockResponse = S.suspend(() =>
  S.Struct({
    DataLength: S.optional(S.Number).pipe(T.HttpHeader("x-amz-Data-Length")),
    BlockData: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    Checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-Checksum")),
    ChecksumAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-Checksum-Algorithm"),
    ),
  }),
).annotations({
  identifier: "GetSnapshotBlockResponse",
}) as any as S.Schema<GetSnapshotBlockResponse>;
export interface PutSnapshotBlockResponse {
  Checksum?: string;
  ChecksumAlgorithm?: string;
}
export const PutSnapshotBlockResponse = S.suspend(() =>
  S.Struct({
    Checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-Checksum")),
    ChecksumAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-Checksum-Algorithm"),
    ),
  }),
).annotations({
  identifier: "PutSnapshotBlockResponse",
}) as any as S.Schema<PutSnapshotBlockResponse>;
export interface StartSnapshotRequest {
  VolumeSize: number;
  ParentSnapshotId?: string;
  Tags?: Tags;
  Description?: string;
  ClientToken?: string;
  Encrypted?: boolean;
  KmsKeyArn?: string | Redacted.Redacted<string>;
  Timeout?: number;
}
export const StartSnapshotRequest = S.suspend(() =>
  S.Struct({
    VolumeSize: S.Number,
    ParentSnapshotId: S.optional(S.String),
    Tags: S.optional(Tags),
    Description: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    KmsKeyArn: S.optional(SensitiveString),
    Timeout: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/snapshots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartSnapshotRequest",
}) as any as S.Schema<StartSnapshotRequest>;
export interface ChangedBlock {
  BlockIndex?: number;
  FirstBlockToken?: string;
  SecondBlockToken?: string;
}
export const ChangedBlock = S.suspend(() =>
  S.Struct({
    BlockIndex: S.optional(S.Number),
    FirstBlockToken: S.optional(S.String),
    SecondBlockToken: S.optional(S.String),
  }),
).annotations({ identifier: "ChangedBlock" }) as any as S.Schema<ChangedBlock>;
export type ChangedBlocks = ChangedBlock[];
export const ChangedBlocks = S.Array(ChangedBlock);
export interface Block {
  BlockIndex?: number;
  BlockToken?: string;
}
export const Block = S.suspend(() =>
  S.Struct({
    BlockIndex: S.optional(S.Number),
    BlockToken: S.optional(S.String),
  }),
).annotations({ identifier: "Block" }) as any as S.Schema<Block>;
export type Blocks = Block[];
export const Blocks = S.Array(Block);
export interface ListChangedBlocksResponse {
  ChangedBlocks?: ChangedBlocks;
  ExpiryTime?: Date;
  VolumeSize?: number;
  BlockSize?: number;
  NextToken?: string;
}
export const ListChangedBlocksResponse = S.suspend(() =>
  S.Struct({
    ChangedBlocks: S.optional(ChangedBlocks),
    ExpiryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    VolumeSize: S.optional(S.Number),
    BlockSize: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListChangedBlocksResponse",
}) as any as S.Schema<ListChangedBlocksResponse>;
export interface ListSnapshotBlocksResponse {
  Blocks?: Blocks;
  ExpiryTime?: Date;
  VolumeSize?: number;
  BlockSize?: number;
  NextToken?: string;
}
export const ListSnapshotBlocksResponse = S.suspend(() =>
  S.Struct({
    Blocks: S.optional(Blocks),
    ExpiryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    VolumeSize: S.optional(S.Number),
    BlockSize: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSnapshotBlocksResponse",
}) as any as S.Schema<ListSnapshotBlocksResponse>;
export interface StartSnapshotResponse {
  Description?: string;
  SnapshotId?: string;
  OwnerId?: string;
  Status?: string;
  StartTime?: Date;
  VolumeSize?: number;
  BlockSize?: number;
  Tags?: Tags;
  ParentSnapshotId?: string;
  KmsKeyArn?: string | Redacted.Redacted<string>;
  SseType?: string;
}
export const StartSnapshotResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    SnapshotId: S.optional(S.String),
    OwnerId: S.optional(S.String),
    Status: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    VolumeSize: S.optional(S.Number),
    BlockSize: S.optional(S.Number),
    Tags: S.optional(Tags),
    ParentSnapshotId: S.optional(S.String),
    KmsKeyArn: S.optional(SensitiveString),
    SseType: S.optional(S.String),
  }),
).annotations({
  identifier: "StartSnapshotResponse",
}) as any as S.Schema<StartSnapshotResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), Reason: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConcurrentLimitExceededException extends S.TaggedError<ConcurrentLimitExceededException>()(
  "ConcurrentLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RequestThrottledException extends S.TaggedError<RequestThrottledException>()(
  "RequestThrottledException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
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
export const completeSnapshot: (
  input: CompleteSnapshotRequest,
) => Effect.Effect<
  CompleteSnapshotResponse,
  | AccessDeniedException
  | InternalServerException
  | RequestThrottledException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startSnapshot: (
  input: StartSnapshotRequest,
) => Effect.Effect<
  StartSnapshotResponse,
  | AccessDeniedException
  | ConcurrentLimitExceededException
  | ConflictException
  | InternalServerException
  | RequestThrottledException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Returns information about the blocks that are different between two
 * Amazon Elastic Block Store snapshots of the same volume/snapshot lineage.
 *
 * You should always retry requests that receive server (`5xx`)
 * error responses, and `ThrottlingException` and `RequestThrottledException`
 * client error responses. For more information see Error retries in the
 * *Amazon Elastic Compute Cloud User Guide*.
 */
export const listChangedBlocks: {
  (
    input: ListChangedBlocksRequest,
  ): Effect.Effect<
    ListChangedBlocksResponse,
    | AccessDeniedException
    | InternalServerException
    | RequestThrottledException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChangedBlocksRequest,
  ) => Stream.Stream<
    ListChangedBlocksResponse,
    | AccessDeniedException
    | InternalServerException
    | RequestThrottledException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChangedBlocksRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | RequestThrottledException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about the blocks in an Amazon Elastic Block Store snapshot.
 *
 * You should always retry requests that receive server (`5xx`)
 * error responses, and `ThrottlingException` and `RequestThrottledException`
 * client error responses. For more information see Error retries in the
 * *Amazon Elastic Compute Cloud User Guide*.
 */
export const listSnapshotBlocks: {
  (
    input: ListSnapshotBlocksRequest,
  ): Effect.Effect<
    ListSnapshotBlocksResponse,
    | AccessDeniedException
    | InternalServerException
    | RequestThrottledException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSnapshotBlocksRequest,
  ) => Stream.Stream<
    ListSnapshotBlocksResponse,
    | AccessDeniedException
    | InternalServerException
    | RequestThrottledException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSnapshotBlocksRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | RequestThrottledException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the data in a block in an Amazon Elastic Block Store snapshot.
 *
 * You should always retry requests that receive server (`5xx`)
 * error responses, and `ThrottlingException` and `RequestThrottledException`
 * client error responses. For more information see Error retries in the
 * *Amazon Elastic Compute Cloud User Guide*.
 */
export const getSnapshotBlock: (
  input: GetSnapshotBlockRequest,
) => Effect.Effect<
  GetSnapshotBlockResponse,
  | AccessDeniedException
  | InternalServerException
  | RequestThrottledException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putSnapshotBlock: (
  input: PutSnapshotBlockRequest,
) => Effect.Effect<
  PutSnapshotBlockResponse,
  | AccessDeniedException
  | InternalServerException
  | RequestThrottledException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

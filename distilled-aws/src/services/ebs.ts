import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
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
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://ebs-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://ebs-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ebs.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ebs.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
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
export type KmsKeyArn = string | redacted.Redacted<string>;
export type Timeout = number;
export type TagKey = string;
export type TagValue = string;
export type BlockSize = number;
export type ErrorMessage = string;
export type OwnerId = string;

//# Schemas
export type ChecksumAlgorithm = "SHA256" | (string & {});
export const ChecksumAlgorithm = S.String;
export type ChecksumAggregationMethod = "LINEAR" | (string & {});
export const ChecksumAggregationMethod = S.String;
export interface CompleteSnapshotRequest {
  SnapshotId: string;
  ChangedBlocksCount: number;
  Checksum?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ChecksumAggregationMethod?: ChecksumAggregationMethod;
}
export const CompleteSnapshotRequest = S.suspend(() =>
  S.Struct({
    SnapshotId: S.String.pipe(T.HttpLabel("SnapshotId")),
    ChangedBlocksCount: S.Number.pipe(T.HttpHeader("x-amz-ChangedBlocksCount")),
    Checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-Checksum")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-Checksum-Algorithm"),
    ),
    ChecksumAggregationMethod: S.optional(ChecksumAggregationMethod).pipe(
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
  ChecksumAlgorithm: ChecksumAlgorithm;
}
export const PutSnapshotBlockRequest = S.suspend(() =>
  S.Struct({
    SnapshotId: S.String.pipe(T.HttpLabel("SnapshotId")),
    BlockIndex: S.Number.pipe(T.HttpLabel("BlockIndex")),
    BlockData: T.StreamingInput.pipe(T.HttpPayload()),
    DataLength: S.Number.pipe(T.HttpHeader("x-amz-Data-Length")),
    Progress: S.optional(S.Number).pipe(T.HttpHeader("x-amz-Progress")),
    Checksum: S.String.pipe(T.HttpHeader("x-amz-Checksum")),
    ChecksumAlgorithm: ChecksumAlgorithm.pipe(
      T.HttpHeader("x-amz-Checksum-Algorithm"),
    ),
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
export type Status = "completed" | "pending" | "error" | (string & {});
export const Status = S.String;
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
  Status?: Status;
}
export const CompleteSnapshotResponse = S.suspend(() =>
  S.Struct({ Status: S.optional(Status) }),
).annotations({
  identifier: "CompleteSnapshotResponse",
}) as any as S.Schema<CompleteSnapshotResponse>;
export interface GetSnapshotBlockResponse {
  DataLength?: number;
  BlockData?: T.StreamingOutputBody;
  Checksum?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
}
export const GetSnapshotBlockResponse = S.suspend(() =>
  S.Struct({
    DataLength: S.optional(S.Number).pipe(T.HttpHeader("x-amz-Data-Length")),
    BlockData: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    Checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-Checksum")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-Checksum-Algorithm"),
    ),
  }),
).annotations({
  identifier: "GetSnapshotBlockResponse",
}) as any as S.Schema<GetSnapshotBlockResponse>;
export interface PutSnapshotBlockResponse {
  Checksum?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
}
export const PutSnapshotBlockResponse = S.suspend(() =>
  S.Struct({
    Checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-Checksum")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-Checksum-Algorithm"),
    ),
  }),
).annotations({
  identifier: "PutSnapshotBlockResponse",
}) as any as S.Schema<PutSnapshotBlockResponse>;
export interface StartSnapshotRequest {
  VolumeSize: number;
  ParentSnapshotId?: string;
  Tags?: Tag[];
  Description?: string;
  ClientToken?: string;
  Encrypted?: boolean;
  KmsKeyArn?: string | redacted.Redacted<string>;
  Timeout?: number;
}
export const StartSnapshotRequest = S.suspend(() =>
  S.Struct({
    VolumeSize: S.Number,
    ParentSnapshotId: S.optional(S.String),
    Tags: S.optional(Tags),
    Description: S.optional(S.String),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
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
export type AccessDeniedExceptionReason =
  | "UNAUTHORIZED_ACCOUNT"
  | "DEPENDENCY_ACCESS_DENIED"
  | (string & {});
export const AccessDeniedExceptionReason = S.String;
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
export type SSEType = "sse-ebs" | "sse-kms" | "none" | (string & {});
export const SSEType = S.String;
export interface ListChangedBlocksResponse {
  ChangedBlocks?: ChangedBlock[];
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
  Blocks?: Block[];
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
  Status?: Status;
  StartTime?: Date;
  VolumeSize?: number;
  BlockSize?: number;
  Tags?: Tag[];
  ParentSnapshotId?: string;
  KmsKeyArn?: string | redacted.Redacted<string>;
  SseType?: SSEType;
}
export const StartSnapshotResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    SnapshotId: S.optional(S.String),
    OwnerId: S.optional(S.String),
    Status: S.optional(Status),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    VolumeSize: S.optional(S.Number),
    BlockSize: S.optional(S.Number),
    Tags: S.optional(Tags),
    ParentSnapshotId: S.optional(S.String),
    KmsKeyArn: S.optional(SensitiveString),
    SseType: S.optional(SSEType),
  }),
).annotations({
  identifier: "StartSnapshotResponse",
}) as any as S.Schema<StartSnapshotResponse>;
export type RequestThrottledExceptionReason =
  | "ACCOUNT_THROTTLED"
  | "DEPENDENCY_REQUEST_THROTTLED"
  | "RESOURCE_LEVEL_THROTTLE"
  | (string & {});
export const RequestThrottledExceptionReason = S.String;
export type ResourceNotFoundExceptionReason =
  | "SNAPSHOT_NOT_FOUND"
  | "GRANT_NOT_FOUND"
  | "DEPENDENCY_RESOURCE_NOT_FOUND"
  | "IMAGE_NOT_FOUND"
  | (string & {});
export const ResourceNotFoundExceptionReason = S.String;
export type ServiceQuotaExceededExceptionReason =
  | "DEPENDENCY_SERVICE_QUOTA_EXCEEDED"
  | (string & {});
export const ServiceQuotaExceededExceptionReason = S.String;
export type ValidationExceptionReason =
  | "INVALID_CUSTOMER_KEY"
  | "INVALID_PAGE_TOKEN"
  | "INVALID_BLOCK_TOKEN"
  | "INVALID_GRANT_TOKEN"
  | "INVALID_SNAPSHOT_ID"
  | "UNRELATED_SNAPSHOTS"
  | "INVALID_BLOCK"
  | "INVALID_CONTENT_ENCODING"
  | "INVALID_TAG"
  | "INVALID_DEPENDENCY_REQUEST"
  | "INVALID_PARAMETER_VALUE"
  | "INVALID_VOLUME_SIZE"
  | "CONFLICTING_BLOCK_UPDATE"
  | "INVALID_IMAGE_ID"
  | "WRITE_REQUEST_TIMEOUT"
  | (string & {});
export const ValidationExceptionReason = S.String;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), Reason: AccessDeniedExceptionReason },
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
  {
    Message: S.optional(S.String),
    Reason: S.optional(RequestThrottledExceptionReason),
  },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(ResourceNotFoundExceptionReason),
  },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(ServiceQuotaExceededExceptionReason),
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(ValidationExceptionReason),
  },
).pipe(C.withBadRequestError) {}
export class InvalidSignatureException extends S.TaggedError<InvalidSignatureException>()(
  "InvalidSignatureException",
  {},
) {}

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
) => effect.Effect<
  CompleteSnapshotResponse,
  | AccessDeniedException
  | InternalServerException
  | RequestThrottledException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | InvalidSignatureException
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
    InvalidSignatureException,
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
) => effect.Effect<
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
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
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
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
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
) => effect.Effect<
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
) => effect.Effect<
  PutSnapshotBlockResponse,
  | AccessDeniedException
  | InternalServerException
  | RequestThrottledException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | InvalidSignatureException
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
    InvalidSignatureException,
  ],
}));

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
const ns = T.XmlNamespace("http://dynamodb.amazonaws.com/doc/2012-08-10/");
const svc = T.AwsApiService({
  sdkId: "DynamoDB Streams",
  serviceShapeName: "DynamoDBStreams_20120810",
});
const auth = T.AwsAuthSigv4({ name: "dynamodb" });
const ver = T.ServiceVersion("2012-08-10");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://streams-dynamodb.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://streams-dynamodb-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://streams-dynamodb.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://streams-dynamodb-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://streams-dynamodb.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://streams-dynamodb-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://streams.dynamodb.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://streams.dynamodb-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://streams.dynamodb-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://streams.dynamodb.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://streams.dynamodb.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type StreamArn = string;
export type PositiveIntegerObject = number;
export type ShardId = string;
export type ShardIterator = string;
export type SequenceNumber = string;
export type TableName = string;
export type ErrorMessage = string;
export type PositiveLongObject = number;
export type AttributeName = string;
export type KeySchemaAttributeName = string;
export type StringAttributeValue = string;
export type NumberAttributeValue = string;
export type BinaryAttributeValue = Uint8Array;
export type NullAttributeValue = boolean;
export type BooleanAttributeValue = boolean;

//# Schemas
export type ShardIteratorType =
  | "TRIM_HORIZON"
  | "LATEST"
  | "AT_SEQUENCE_NUMBER"
  | "AFTER_SEQUENCE_NUMBER";
export const ShardIteratorType = S.Literal(
  "TRIM_HORIZON",
  "LATEST",
  "AT_SEQUENCE_NUMBER",
  "AFTER_SEQUENCE_NUMBER",
);
export interface GetRecordsInput {
  ShardIterator: string;
  Limit?: number;
}
export const GetRecordsInput = S.suspend(() =>
  S.Struct({ ShardIterator: S.String, Limit: S.optional(S.Number) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecordsInput",
}) as any as S.Schema<GetRecordsInput>;
export interface GetShardIteratorInput {
  StreamArn: string;
  ShardId: string;
  ShardIteratorType: ShardIteratorType;
  SequenceNumber?: string;
}
export const GetShardIteratorInput = S.suspend(() =>
  S.Struct({
    StreamArn: S.String,
    ShardId: S.String,
    ShardIteratorType: ShardIteratorType,
    SequenceNumber: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetShardIteratorInput",
}) as any as S.Schema<GetShardIteratorInput>;
export interface ListStreamsInput {
  TableName?: string;
  Limit?: number;
  ExclusiveStartStreamArn?: string;
}
export const ListStreamsInput = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    Limit: S.optional(S.Number),
    ExclusiveStartStreamArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStreamsInput",
}) as any as S.Schema<ListStreamsInput>;
export type ShardFilterType = "CHILD_SHARDS";
export const ShardFilterType = S.Literal("CHILD_SHARDS");
export interface ShardFilter {
  Type?: ShardFilterType;
  ShardId?: string;
}
export const ShardFilter = S.suspend(() =>
  S.Struct({
    Type: S.optional(ShardFilterType),
    ShardId: S.optional(S.String),
  }),
).annotations({ identifier: "ShardFilter" }) as any as S.Schema<ShardFilter>;
export interface DescribeStreamInput {
  StreamArn: string;
  Limit?: number;
  ExclusiveStartShardId?: string;
  ShardFilter?: ShardFilter;
}
export const DescribeStreamInput = S.suspend(() =>
  S.Struct({
    StreamArn: S.String,
    Limit: S.optional(S.Number),
    ExclusiveStartShardId: S.optional(S.String),
    ShardFilter: S.optional(ShardFilter),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeStreamInput",
}) as any as S.Schema<DescribeStreamInput>;
export interface GetShardIteratorOutput {
  ShardIterator?: string;
}
export const GetShardIteratorOutput = S.suspend(() =>
  S.Struct({ ShardIterator: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetShardIteratorOutput",
}) as any as S.Schema<GetShardIteratorOutput>;
export type OperationType = "INSERT" | "MODIFY" | "REMOVE";
export const OperationType = S.Literal("INSERT", "MODIFY", "REMOVE");
export interface Stream {
  StreamArn?: string;
  TableName?: string;
  StreamLabel?: string;
}
export const Stream = S.suspend(() =>
  S.Struct({
    StreamArn: S.optional(S.String),
    TableName: S.optional(S.String),
    StreamLabel: S.optional(S.String),
  }),
).annotations({ identifier: "Stream" }) as any as S.Schema<Stream>;
export type StreamList = Stream[];
export const StreamList = S.Array(Stream);
export type StreamViewType =
  | "NEW_IMAGE"
  | "OLD_IMAGE"
  | "NEW_AND_OLD_IMAGES"
  | "KEYS_ONLY";
export const StreamViewType = S.Literal(
  "NEW_IMAGE",
  "OLD_IMAGE",
  "NEW_AND_OLD_IMAGES",
  "KEYS_ONLY",
);
export interface ListStreamsOutput {
  Streams?: Stream[];
  LastEvaluatedStreamArn?: string;
}
export const ListStreamsOutput = S.suspend(() =>
  S.Struct({
    Streams: S.optional(StreamList),
    LastEvaluatedStreamArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStreamsOutput",
}) as any as S.Schema<ListStreamsOutput>;
export type StreamStatus = "ENABLING" | "ENABLED" | "DISABLING" | "DISABLED";
export const StreamStatus = S.Literal(
  "ENABLING",
  "ENABLED",
  "DISABLING",
  "DISABLED",
);
export interface Identity {
  PrincipalId?: string;
  Type?: string;
}
export const Identity = S.suspend(() =>
  S.Struct({ PrincipalId: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({ identifier: "Identity" }) as any as S.Schema<Identity>;
export type KeyType = "HASH" | "RANGE";
export const KeyType = S.Literal("HASH", "RANGE");
export type StringSetAttributeValue = string[];
export const StringSetAttributeValue = S.Array(S.String);
export type NumberSetAttributeValue = string[];
export const NumberSetAttributeValue = S.Array(S.String);
export type BinarySetAttributeValue = Uint8Array[];
export const BinarySetAttributeValue = S.Array(T.Blob);
export type ListAttributeValue = AttributeValue[];
export const ListAttributeValue = S.Array(
  S.suspend(() => AttributeValue).annotations({ identifier: "AttributeValue" }),
) as any as S.Schema<ListAttributeValue>;
export interface KeySchemaElement {
  AttributeName: string;
  KeyType: KeyType;
}
export const KeySchemaElement = S.suspend(() =>
  S.Struct({ AttributeName: S.String, KeyType: KeyType }),
).annotations({
  identifier: "KeySchemaElement",
}) as any as S.Schema<KeySchemaElement>;
export type KeySchema = KeySchemaElement[];
export const KeySchema = S.Array(KeySchemaElement);
export interface SequenceNumberRange {
  StartingSequenceNumber?: string;
  EndingSequenceNumber?: string;
}
export const SequenceNumberRange = S.suspend(() =>
  S.Struct({
    StartingSequenceNumber: S.optional(S.String),
    EndingSequenceNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "SequenceNumberRange",
}) as any as S.Schema<SequenceNumberRange>;
export type MapAttributeValue = { [key: string]: AttributeValue };
export const MapAttributeValue = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue).annotations({
    identifier: "AttributeValue",
  }),
}) as any as S.Schema<MapAttributeValue>;
export interface Shard {
  ShardId?: string;
  SequenceNumberRange?: SequenceNumberRange;
  ParentShardId?: string;
}
export const Shard = S.suspend(() =>
  S.Struct({
    ShardId: S.optional(S.String),
    SequenceNumberRange: S.optional(SequenceNumberRange),
    ParentShardId: S.optional(S.String),
  }),
).annotations({ identifier: "Shard" }) as any as S.Schema<Shard>;
export type ShardDescriptionList = Shard[];
export const ShardDescriptionList = S.Array(Shard);
export type AttributeValue =
  | { S: string }
  | { N: string }
  | { B: Uint8Array }
  | { SS: string[] }
  | { NS: string[] }
  | { BS: Uint8Array[] }
  | { M: { [key: string]: AttributeValue } }
  | { L: AttributeValue[] }
  | { NULL: boolean }
  | { BOOL: boolean };
export const AttributeValue = S.Union(
  S.Struct({ S: S.String }),
  S.Struct({ N: S.String }),
  S.Struct({ B: T.Blob }),
  S.Struct({ SS: StringSetAttributeValue }),
  S.Struct({ NS: NumberSetAttributeValue }),
  S.Struct({ BS: BinarySetAttributeValue }),
  S.Struct({
    M: S.suspend(() => MapAttributeValue).annotations({
      identifier: "MapAttributeValue",
    }),
  }),
  S.Struct({
    L: S.suspend(() => ListAttributeValue).annotations({
      identifier: "ListAttributeValue",
    }),
  }),
  S.Struct({ NULL: S.Boolean }),
  S.Struct({ BOOL: S.Boolean }),
) as any as S.Schema<AttributeValue>;
export interface StreamDescription {
  StreamArn?: string;
  StreamLabel?: string;
  StreamStatus?: StreamStatus;
  StreamViewType?: StreamViewType;
  CreationRequestDateTime?: Date;
  TableName?: string;
  KeySchema?: KeySchemaElement[];
  Shards?: Shard[];
  LastEvaluatedShardId?: string;
}
export const StreamDescription = S.suspend(() =>
  S.Struct({
    StreamArn: S.optional(S.String),
    StreamLabel: S.optional(S.String),
    StreamStatus: S.optional(StreamStatus),
    StreamViewType: S.optional(StreamViewType),
    CreationRequestDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TableName: S.optional(S.String),
    KeySchema: S.optional(KeySchema),
    Shards: S.optional(ShardDescriptionList),
    LastEvaluatedShardId: S.optional(S.String),
  }),
).annotations({
  identifier: "StreamDescription",
}) as any as S.Schema<StreamDescription>;
export type AttributeMap = { [key: string]: AttributeValue };
export const AttributeMap = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue).annotations({
    identifier: "AttributeValue",
  }),
});
export interface DescribeStreamOutput {
  StreamDescription?: StreamDescription;
}
export const DescribeStreamOutput = S.suspend(() =>
  S.Struct({ StreamDescription: S.optional(StreamDescription) }).pipe(ns),
).annotations({
  identifier: "DescribeStreamOutput",
}) as any as S.Schema<DescribeStreamOutput>;
export interface StreamRecord {
  ApproximateCreationDateTime?: Date;
  Keys?: { [key: string]: AttributeValue };
  NewImage?: { [key: string]: AttributeValue };
  OldImage?: { [key: string]: AttributeValue };
  SequenceNumber?: string;
  SizeBytes?: number;
  StreamViewType?: StreamViewType;
}
export const StreamRecord = S.suspend(() =>
  S.Struct({
    ApproximateCreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Keys: S.optional(AttributeMap),
    NewImage: S.optional(AttributeMap),
    OldImage: S.optional(AttributeMap),
    SequenceNumber: S.optional(S.String),
    SizeBytes: S.optional(S.Number),
    StreamViewType: S.optional(StreamViewType),
  }),
).annotations({ identifier: "StreamRecord" }) as any as S.Schema<StreamRecord>;
export interface Record {
  eventID?: string;
  eventName?: OperationType;
  eventVersion?: string;
  eventSource?: string;
  awsRegion?: string;
  dynamodb?: StreamRecord;
  userIdentity?: Identity;
}
export const Record = S.suspend(() =>
  S.Struct({
    eventID: S.optional(S.String),
    eventName: S.optional(OperationType),
    eventVersion: S.optional(S.String),
    eventSource: S.optional(S.String),
    awsRegion: S.optional(S.String),
    dynamodb: S.optional(StreamRecord),
    userIdentity: S.optional(Identity),
  }),
).annotations({ identifier: "Record" }) as any as S.Schema<Record>;
export type RecordList = Record[];
export const RecordList = S.Array(Record);
export interface GetRecordsOutput {
  Records?: Record[];
  NextShardIterator?: string;
}
export const GetRecordsOutput = S.suspend(() =>
  S.Struct({
    Records: S.optional(RecordList),
    NextShardIterator: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetRecordsOutput",
}) as any as S.Schema<GetRecordsOutput>;

//# Errors
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class TrimmedDataAccessException extends S.TaggedError<TrimmedDataAccessException>()(
  "TrimmedDataAccessException",
  { message: S.optional(S.String) },
) {}
export class ExpiredIteratorException extends S.TaggedError<ExpiredIteratorException>()(
  "ExpiredIteratorException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns an array of stream ARNs associated with the current account and endpoint. If the
 * `TableName` parameter is present, then `ListStreams` will return only the
 * streams ARNs for that table.
 *
 * You can call `ListStreams` at a maximum rate of 5 times per second.
 */
export const listStreams: (
  input: ListStreamsInput,
) => effect.Effect<
  ListStreamsOutput,
  InternalServerError | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStreamsInput,
  output: ListStreamsOutput,
  errors: [InternalServerError, ResourceNotFoundException],
}));
/**
 * Returns a shard iterator. A shard iterator provides information
 * about how to retrieve the stream records from within a shard. Use
 * the shard iterator in a subsequent
 * `GetRecords` request to read the stream records
 * from the shard.
 *
 * A shard iterator expires 15 minutes after it is returned to the requester.
 */
export const getShardIterator: (
  input: GetShardIteratorInput,
) => effect.Effect<
  GetShardIteratorOutput,
  | InternalServerError
  | ResourceNotFoundException
  | TrimmedDataAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetShardIteratorInput,
  output: GetShardIteratorOutput,
  errors: [
    InternalServerError,
    ResourceNotFoundException,
    TrimmedDataAccessException,
  ],
}));
/**
 * Returns information about a stream, including the current status of the stream, its Amazon Resource Name (ARN), the composition of its shards, and its corresponding DynamoDB table.
 *
 * You can call `DescribeStream` at a maximum rate of 10 times per second.
 *
 * Each shard in the stream has a `SequenceNumberRange` associated with it. If the
 * `SequenceNumberRange` has a `StartingSequenceNumber` but no
 * `EndingSequenceNumber`, then the shard is still open (able to receive more stream
 * records). If both `StartingSequenceNumber` and `EndingSequenceNumber`
 * are present, then that shard is closed and can no longer receive more data.
 */
export const describeStream: (
  input: DescribeStreamInput,
) => effect.Effect<
  DescribeStreamOutput,
  InternalServerError | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStreamInput,
  output: DescribeStreamOutput,
  errors: [InternalServerError, ResourceNotFoundException],
}));
/**
 * Retrieves the stream records from a given shard.
 *
 * Specify a shard iterator using the `ShardIterator` parameter. The shard iterator
 * specifies the position in the shard from which you want to start reading stream records
 * sequentially. If there are no stream records available in the portion of the shard that the
 * iterator points to, `GetRecords` returns an empty list. Note that it might take
 * multiple calls to get to a portion of the shard that contains stream records.
 *
 * `GetRecords` can retrieve a maximum of 1 MB of data or 1000 stream records,
 * whichever comes first.
 */
export const getRecords: (
  input: GetRecordsInput,
) => effect.Effect<
  GetRecordsOutput,
  | ExpiredIteratorException
  | InternalServerError
  | LimitExceededException
  | ResourceNotFoundException
  | TrimmedDataAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecordsInput,
  output: GetRecordsOutput,
  errors: [
    ExpiredIteratorException,
    InternalServerError,
    LimitExceededException,
    ResourceNotFoundException,
    TrimmedDataAccessException,
  ],
}));

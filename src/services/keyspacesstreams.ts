import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "KeyspacesStreams",
  serviceShapeName: "KeyspacesStreams",
});
const auth = T.AwsAuthSigv4({ name: "cassandra" });
const ver = T.ServiceVersion("2024-09-09");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      rules: [
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
                  ],
                  endpoint: {
                    url: "https://cassandra-streams-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://cassandra-streams.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export class GetRecordsInput extends S.Class<GetRecordsInput>(
  "GetRecordsInput",
)(
  { shardIterator: S.String, maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetShardIteratorInput extends S.Class<GetShardIteratorInput>(
  "GetShardIteratorInput",
)(
  {
    streamArn: S.String,
    shardId: S.String,
    shardIteratorType: S.String,
    sequenceNumber: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStreamsInput extends S.Class<ListStreamsInput>(
  "ListStreamsInput",
)(
  {
    keyspaceName: S.optional(S.String),
    tableName: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ShardFilter extends S.Class<ShardFilter>("ShardFilter")({
  type: S.optional(S.String),
  shardId: S.optional(S.String),
}) {}
export class GetShardIteratorOutput extends S.Class<GetShardIteratorOutput>(
  "GetShardIteratorOutput",
)({ shardIterator: S.optional(S.String) }) {}
export class GetStreamInput extends S.Class<GetStreamInput>("GetStreamInput")(
  {
    streamArn: S.String,
    maxResults: S.optional(S.Number),
    shardFilter: S.optional(ShardFilter),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Stream extends S.Class<Stream>("Stream")({
  streamArn: S.String,
  keyspaceName: S.String,
  tableName: S.String,
  streamLabel: S.String,
}) {}
export const StreamList = S.Array(Stream);
export class ListStreamsOutput extends S.Class<ListStreamsOutput>(
  "ListStreamsOutput",
)({ streams: S.optional(StreamList), nextToken: S.optional(S.String) }) {}
export const ShardIdList = S.Array(S.String);
export class KeyspacesMetadata extends S.Class<KeyspacesMetadata>(
  "KeyspacesMetadata",
)({ expirationTime: S.optional(S.String), writeTime: S.optional(S.String) }) {}
export class KeyspacesCell extends S.Class<KeyspacesCell>("KeyspacesCell")({
  value: S.optional(S.suspend(() => KeyspacesCellValue)),
  metadata: S.optional(KeyspacesMetadata),
}) {}
export const KeyspacesCells = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<KeyspacesCell, any> => KeyspacesCell),
});
export class KeyspacesRow extends S.Class<KeyspacesRow>("KeyspacesRow")({
  valueCells: S.optional(KeyspacesCells),
  staticCells: S.optional(KeyspacesCells),
  rowMetadata: S.optional(KeyspacesMetadata),
}) {}
export class SequenceNumberRange extends S.Class<SequenceNumberRange>(
  "SequenceNumberRange",
)({
  startingSequenceNumber: S.optional(S.String),
  endingSequenceNumber: S.optional(S.String),
}) {}
export type KeyspacesCellList = KeyspacesCell[];
export const KeyspacesCellList = S.Array(
  S.suspend((): S.Schema<KeyspacesCell, any> => KeyspacesCell),
) as any as S.Schema<KeyspacesCellList>;
export class KeyspacesCellMapDefinition extends S.Class<KeyspacesCellMapDefinition>(
  "KeyspacesCellMapDefinition",
)({
  key: S.optional(S.suspend(() => KeyspacesCellValue)),
  value: S.optional(S.suspend(() => KeyspacesCellValue)),
  metadata: S.optional(KeyspacesMetadata),
}) {}
export type KeyspacesCellMap = KeyspacesCellMapDefinition[];
export const KeyspacesCellMap = S.Array(
  S.suspend(
    (): S.Schema<KeyspacesCellMapDefinition, any> => KeyspacesCellMapDefinition,
  ),
) as any as S.Schema<KeyspacesCellMap>;
export type KeyspacesUdtMap = { [key: string]: KeyspacesCell };
export const KeyspacesUdtMap = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<KeyspacesCell, any> => KeyspacesCell),
}) as any as S.Schema<KeyspacesUdtMap>;
export class Shard extends S.Class<Shard>("Shard")({
  shardId: S.optional(S.String),
  sequenceNumberRange: S.optional(SequenceNumberRange),
  parentShardIds: S.optional(ShardIdList),
}) {}
export const ShardDescriptionList = S.Array(Shard);
export type KeyspacesCellValue =
  | { asciiT: string }
  | { bigintT: string }
  | { blobT: Uint8Array }
  | { boolT: boolean }
  | { counterT: string }
  | { dateT: string }
  | { decimalT: string }
  | { doubleT: string }
  | { floatT: string }
  | { inetT: string }
  | { intT: string }
  | { listT: KeyspacesCellList }
  | { mapT: KeyspacesCellMap }
  | { setT: KeyspacesCellList }
  | { smallintT: string }
  | { textT: string }
  | { timeT: string }
  | { timestampT: string }
  | { timeuuidT: string }
  | { tinyintT: string }
  | { tupleT: KeyspacesCellList }
  | { uuidT: string }
  | { varcharT: string }
  | { varintT: string }
  | { udtT: KeyspacesUdtMap };
export const KeyspacesCellValue = S.Union(
  S.Struct({ asciiT: S.String }),
  S.Struct({ bigintT: S.String }),
  S.Struct({ blobT: T.Blob }),
  S.Struct({ boolT: S.Boolean }),
  S.Struct({ counterT: S.String }),
  S.Struct({ dateT: S.String }),
  S.Struct({ decimalT: S.String }),
  S.Struct({ doubleT: S.String }),
  S.Struct({ floatT: S.String }),
  S.Struct({ inetT: S.String }),
  S.Struct({ intT: S.String }),
  S.Struct({ listT: S.suspend(() => KeyspacesCellList) }),
  S.Struct({ mapT: S.suspend(() => KeyspacesCellMap) }),
  S.Struct({ setT: S.suspend(() => KeyspacesCellList) }),
  S.Struct({ smallintT: S.String }),
  S.Struct({ textT: S.String }),
  S.Struct({ timeT: S.String }),
  S.Struct({ timestampT: S.String }),
  S.Struct({ timeuuidT: S.String }),
  S.Struct({ tinyintT: S.String }),
  S.Struct({ tupleT: S.suspend(() => KeyspacesCellList) }),
  S.Struct({ uuidT: S.String }),
  S.Struct({ varcharT: S.String }),
  S.Struct({ varintT: S.String }),
  S.Struct({ udtT: S.suspend(() => KeyspacesUdtMap) }),
) as any as S.Schema<KeyspacesCellValue>;
export class GetStreamOutput extends S.Class<GetStreamOutput>(
  "GetStreamOutput",
)({
  streamArn: S.String,
  streamLabel: S.String,
  streamStatus: S.String,
  streamViewType: S.String,
  creationRequestDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  keyspaceName: S.String,
  tableName: S.String,
  shards: S.optional(ShardDescriptionList),
  nextToken: S.optional(S.String),
}) {}
export const KeyspacesKeysMap = S.Record({
  key: S.String,
  value: S.suspend(() => KeyspacesCellValue),
});
export class Record extends S.Class<Record>("Record")({
  eventVersion: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  origin: S.optional(S.String),
  partitionKeys: S.optional(KeyspacesKeysMap),
  clusteringKeys: S.optional(KeyspacesKeysMap),
  newImage: S.optional(KeyspacesRow),
  oldImage: S.optional(KeyspacesRow),
  sequenceNumber: S.optional(S.String),
}) {}
export const RecordList = S.Array(Record);
export class GetRecordsOutput extends S.Class<GetRecordsOutput>(
  "GetRecordsOutput",
)({
  changeRecords: S.optional(RecordList),
  nextShardIterator: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessDeniedException", httpResponseCode: 403 }),
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServerException", httpResponseCode: 500 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ThrottlingException", httpResponseCode: 429 }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String), errorCode: S.optional(S.String) },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * Returns a shard iterator that serves as a bookmark for reading data from a specific position in an Amazon Keyspaces data stream's shard. The shard iterator specifies the shard position from which to start reading data records sequentially. You can specify whether to begin reading at the latest record, the oldest record, or at a particular sequence number within the shard.
 */
export const getShardIterator = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetShardIteratorInput,
  output: GetShardIteratorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns detailed information about a specific data capture stream for an Amazon Keyspaces table. The information includes the stream's Amazon Resource Name (ARN), creation time, current status, retention period, shard composition, and associated table details. This operation helps you monitor and manage the configuration of your Amazon Keyspaces data streams.
 */
export const getStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStreamInput,
  output: GetStreamOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all data capture streams associated with your Amazon Keyspaces account or for a specific keyspace or table. The response includes information such as stream ARNs, table associations, creation timestamps, and current status. This operation helps you discover and manage all active data streams in your Amazon Keyspaces environment.
 */
export const listStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStreamsInput,
  output: ListStreamsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves data records from a specified shard in an Amazon Keyspaces data stream. This operation returns a collection of data records from the shard, including the primary key columns and information about modifications made to the captured table data. Each record represents a single data modification in the Amazon Keyspaces table and includes metadata about when the change occurred.
 */
export const getRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecordsInput,
  output: GetRecordsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

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
const svc = T.AwsApiService({
  sdkId: "KeyspacesStreams",
  serviceShapeName: "KeyspacesStreams",
});
const auth = T.AwsAuthSigv4({ name: "cassandra" });
const ver = T.ServiceVersion("2024-09-09");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { UseFIPS = false, Endpoint, Region } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true) {
          return e(
            `https://cassandra-streams-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return e(
          `https://cassandra-streams.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ShardIterator = string;
export type StreamArn = string;
export type ShardId = string;
export type SequenceNumber = string;
export type ShardIdToken = string;
export type KeyspaceName = string;
export type TableName = string;
export type StreamArnToken = string;

//# Schemas
export type ShardIteratorType =
  | "TRIM_HORIZON"
  | "LATEST"
  | "AT_SEQUENCE_NUMBER"
  | "AFTER_SEQUENCE_NUMBER"
  | (string & {});
export const ShardIteratorType = S.String;
export interface GetRecordsInput {
  shardIterator: string;
  maxResults?: number;
}
export const GetRecordsInput = S.suspend(() =>
  S.Struct({ shardIterator: S.String, maxResults: S.optional(S.Number) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRecordsInput",
}) as any as S.Schema<GetRecordsInput>;
export interface GetShardIteratorInput {
  streamArn: string;
  shardId: string;
  shardIteratorType: ShardIteratorType;
  sequenceNumber?: string;
}
export const GetShardIteratorInput = S.suspend(() =>
  S.Struct({
    streamArn: S.String,
    shardId: S.String,
    shardIteratorType: ShardIteratorType,
    sequenceNumber: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetShardIteratorInput",
}) as any as S.Schema<GetShardIteratorInput>;
export interface ListStreamsInput {
  keyspaceName?: string;
  tableName?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListStreamsInput = S.suspend(() =>
  S.Struct({
    keyspaceName: S.optional(S.String),
    tableName: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListStreamsInput",
}) as any as S.Schema<ListStreamsInput>;
export type ShardFilterType = "CHILD_SHARDS" | (string & {});
export const ShardFilterType = S.String;
export interface ShardFilter {
  type?: ShardFilterType;
  shardId?: string;
}
export const ShardFilter = S.suspend(() =>
  S.Struct({
    type: S.optional(ShardFilterType),
    shardId: S.optional(S.String),
  }),
).annotations({ identifier: "ShardFilter" }) as any as S.Schema<ShardFilter>;
export interface GetShardIteratorOutput {
  shardIterator?: string;
}
export const GetShardIteratorOutput = S.suspend(() =>
  S.Struct({ shardIterator: S.optional(S.String) }),
).annotations({
  identifier: "GetShardIteratorOutput",
}) as any as S.Schema<GetShardIteratorOutput>;
export interface GetStreamInput {
  streamArn: string;
  maxResults?: number;
  shardFilter?: ShardFilter;
  nextToken?: string;
}
export const GetStreamInput = S.suspend(() =>
  S.Struct({
    streamArn: S.String,
    maxResults: S.optional(S.Number),
    shardFilter: S.optional(ShardFilter),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetStreamInput",
}) as any as S.Schema<GetStreamInput>;
export type OriginType = "USER" | "REPLICATION" | "TTL" | (string & {});
export const OriginType = S.String;
export type StreamStatus =
  | "ENABLING"
  | "ENABLED"
  | "DISABLING"
  | "DISABLED"
  | (string & {});
export const StreamStatus = S.String;
export type StreamViewType =
  | "NEW_IMAGE"
  | "OLD_IMAGE"
  | "NEW_AND_OLD_IMAGES"
  | "KEYS_ONLY"
  | (string & {});
export const StreamViewType = S.String;
export interface Stream {
  streamArn: string;
  keyspaceName: string;
  tableName: string;
  streamLabel: string;
}
export const Stream = S.suspend(() =>
  S.Struct({
    streamArn: S.String,
    keyspaceName: S.String,
    tableName: S.String,
    streamLabel: S.String,
  }),
).annotations({ identifier: "Stream" }) as any as S.Schema<Stream>;
export type StreamList = Stream[];
export const StreamList = S.Array(Stream);
export interface ListStreamsOutput {
  streams?: Stream[];
  nextToken?: string;
}
export const ListStreamsOutput = S.suspend(() =>
  S.Struct({
    streams: S.optional(StreamList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStreamsOutput",
}) as any as S.Schema<ListStreamsOutput>;
export type ShardIdList = string[];
export const ShardIdList = S.Array(S.String);
export interface KeyspacesMetadata {
  expirationTime?: string;
  writeTime?: string;
}
export const KeyspacesMetadata = S.suspend(() =>
  S.Struct({
    expirationTime: S.optional(S.String),
    writeTime: S.optional(S.String),
  }),
).annotations({
  identifier: "KeyspacesMetadata",
}) as any as S.Schema<KeyspacesMetadata>;
export interface KeyspacesCell {
  value?: KeyspacesCellValue;
  metadata?: KeyspacesMetadata;
}
export const KeyspacesCell = S.suspend(() =>
  S.Struct({
    value: S.optional(
      S.suspend(() => KeyspacesCellValue).annotations({
        identifier: "KeyspacesCellValue",
      }),
    ),
    metadata: S.optional(KeyspacesMetadata),
  }),
).annotations({
  identifier: "KeyspacesCell",
}) as any as S.Schema<KeyspacesCell>;
export type KeyspacesCells = { [key: string]: KeyspacesCell | undefined };
export const KeyspacesCells = S.Record({
  key: S.String,
  value: S.UndefinedOr(
    S.suspend((): S.Schema<KeyspacesCell, any> => KeyspacesCell).annotations({
      identifier: "KeyspacesCell",
    }),
  ),
});
export interface KeyspacesRow {
  valueCells?: { [key: string]: KeyspacesCell | undefined };
  staticCells?: { [key: string]: KeyspacesCell | undefined };
  rowMetadata?: KeyspacesMetadata;
}
export const KeyspacesRow = S.suspend(() =>
  S.Struct({
    valueCells: S.optional(KeyspacesCells),
    staticCells: S.optional(KeyspacesCells),
    rowMetadata: S.optional(KeyspacesMetadata),
  }),
).annotations({ identifier: "KeyspacesRow" }) as any as S.Schema<KeyspacesRow>;
export interface SequenceNumberRange {
  startingSequenceNumber?: string;
  endingSequenceNumber?: string;
}
export const SequenceNumberRange = S.suspend(() =>
  S.Struct({
    startingSequenceNumber: S.optional(S.String),
    endingSequenceNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "SequenceNumberRange",
}) as any as S.Schema<SequenceNumberRange>;
export type KeyspacesCellList = KeyspacesCell[];
export const KeyspacesCellList = S.Array(
  S.suspend((): S.Schema<KeyspacesCell, any> => KeyspacesCell).annotations({
    identifier: "KeyspacesCell",
  }),
) as any as S.Schema<KeyspacesCellList>;
export interface KeyspacesCellMapDefinition {
  key?: KeyspacesCellValue;
  value?: KeyspacesCellValue;
  metadata?: KeyspacesMetadata;
}
export const KeyspacesCellMapDefinition = S.suspend(() =>
  S.Struct({
    key: S.optional(
      S.suspend(() => KeyspacesCellValue).annotations({
        identifier: "KeyspacesCellValue",
      }),
    ),
    value: S.optional(
      S.suspend(() => KeyspacesCellValue).annotations({
        identifier: "KeyspacesCellValue",
      }),
    ),
    metadata: S.optional(KeyspacesMetadata),
  }),
).annotations({
  identifier: "KeyspacesCellMapDefinition",
}) as any as S.Schema<KeyspacesCellMapDefinition>;
export type KeyspacesCellMap = KeyspacesCellMapDefinition[];
export const KeyspacesCellMap = S.Array(
  S.suspend(
    (): S.Schema<KeyspacesCellMapDefinition, any> => KeyspacesCellMapDefinition,
  ).annotations({ identifier: "KeyspacesCellMapDefinition" }),
) as any as S.Schema<KeyspacesCellMap>;
export type KeyspacesUdtMap = { [key: string]: KeyspacesCell | undefined };
export const KeyspacesUdtMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(
    S.suspend((): S.Schema<KeyspacesCell, any> => KeyspacesCell).annotations({
      identifier: "KeyspacesCell",
    }),
  ),
}) as any as S.Schema<KeyspacesUdtMap>;
export interface Shard {
  shardId?: string;
  sequenceNumberRange?: SequenceNumberRange;
  parentShardIds?: string[];
}
export const Shard = S.suspend(() =>
  S.Struct({
    shardId: S.optional(S.String),
    sequenceNumberRange: S.optional(SequenceNumberRange),
    parentShardIds: S.optional(ShardIdList),
  }),
).annotations({ identifier: "Shard" }) as any as S.Schema<Shard>;
export type ShardDescriptionList = Shard[];
export const ShardDescriptionList = S.Array(Shard);
export type KeyspacesCellValue =
  | {
      asciiT: string;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT: string;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT: Uint8Array;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT: boolean;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT: string;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT: string;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT: string;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT: string;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT: string;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT: string;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT: string;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT: KeyspacesCell[];
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT: KeyspacesCellMapDefinition[];
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT: KeyspacesCell[];
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT: string;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT: string;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT: string;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT: string;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT: string;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT: string;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT: KeyspacesCell[];
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT: string;
      varcharT?: never;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT: string;
      varintT?: never;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT: string;
      udtT?: never;
    }
  | {
      asciiT?: never;
      bigintT?: never;
      blobT?: never;
      boolT?: never;
      counterT?: never;
      dateT?: never;
      decimalT?: never;
      doubleT?: never;
      floatT?: never;
      inetT?: never;
      intT?: never;
      listT?: never;
      mapT?: never;
      setT?: never;
      smallintT?: never;
      textT?: never;
      timeT?: never;
      timestampT?: never;
      timeuuidT?: never;
      tinyintT?: never;
      tupleT?: never;
      uuidT?: never;
      varcharT?: never;
      varintT?: never;
      udtT: { [key: string]: KeyspacesCell | undefined };
    };
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
  S.Struct({
    listT: S.suspend(() => KeyspacesCellList).annotations({
      identifier: "KeyspacesCellList",
    }),
  }),
  S.Struct({
    mapT: S.suspend(() => KeyspacesCellMap).annotations({
      identifier: "KeyspacesCellMap",
    }),
  }),
  S.Struct({
    setT: S.suspend(() => KeyspacesCellList).annotations({
      identifier: "KeyspacesCellList",
    }),
  }),
  S.Struct({ smallintT: S.String }),
  S.Struct({ textT: S.String }),
  S.Struct({ timeT: S.String }),
  S.Struct({ timestampT: S.String }),
  S.Struct({ timeuuidT: S.String }),
  S.Struct({ tinyintT: S.String }),
  S.Struct({
    tupleT: S.suspend(() => KeyspacesCellList).annotations({
      identifier: "KeyspacesCellList",
    }),
  }),
  S.Struct({ uuidT: S.String }),
  S.Struct({ varcharT: S.String }),
  S.Struct({ varintT: S.String }),
  S.Struct({
    udtT: S.suspend(() => KeyspacesUdtMap).annotations({
      identifier: "KeyspacesUdtMap",
    }),
  }),
) as any as S.Schema<KeyspacesCellValue>;
export interface GetStreamOutput {
  streamArn: string;
  streamLabel: string;
  streamStatus: StreamStatus;
  streamViewType: StreamViewType;
  creationRequestDateTime: Date;
  keyspaceName: string;
  tableName: string;
  shards?: Shard[];
  nextToken?: string;
}
export const GetStreamOutput = S.suspend(() =>
  S.Struct({
    streamArn: S.String,
    streamLabel: S.String,
    streamStatus: StreamStatus,
    streamViewType: StreamViewType,
    creationRequestDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    keyspaceName: S.String,
    tableName: S.String,
    shards: S.optional(ShardDescriptionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetStreamOutput",
}) as any as S.Schema<GetStreamOutput>;
export type KeyspacesKeysMap = {
  [key: string]: KeyspacesCellValue | undefined;
};
export const KeyspacesKeysMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(
    S.suspend(() => KeyspacesCellValue).annotations({
      identifier: "KeyspacesCellValue",
    }),
  ),
});
export interface Record {
  eventVersion?: string;
  createdAt?: Date;
  origin?: OriginType;
  partitionKeys?: { [key: string]: KeyspacesCellValue | undefined };
  clusteringKeys?: { [key: string]: KeyspacesCellValue | undefined };
  newImage?: KeyspacesRow;
  oldImage?: KeyspacesRow;
  sequenceNumber?: string;
}
export const Record = S.suspend(() =>
  S.Struct({
    eventVersion: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    origin: S.optional(OriginType),
    partitionKeys: S.optional(KeyspacesKeysMap),
    clusteringKeys: S.optional(KeyspacesKeysMap),
    newImage: S.optional(KeyspacesRow),
    oldImage: S.optional(KeyspacesRow),
    sequenceNumber: S.optional(S.String),
  }),
).annotations({ identifier: "Record" }) as any as S.Schema<Record>;
export type RecordList = Record[];
export const RecordList = S.Array(Record);
export interface GetRecordsOutput {
  changeRecords?: Record[];
  nextShardIterator?: string;
}
export const GetRecordsOutput = S.suspend(() =>
  S.Struct({
    changeRecords: S.optional(RecordList),
    nextShardIterator: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRecordsOutput",
}) as any as S.Schema<GetRecordsOutput>;
export type ValidationExceptionType =
  | "InvalidFormat"
  | "TrimmedDataAccess"
  | "ExpiredIterator"
  | "ExpiredNextToken"
  | (string & {});
export const ValidationExceptionType = S.String;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessDeniedException", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServerException", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ThrottlingException", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    errorCode: S.optional(ValidationExceptionType),
  },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a shard iterator that serves as a bookmark for reading data from a specific position in an Amazon Keyspaces data stream's shard. The shard iterator specifies the shard position from which to start reading data records sequentially. You can specify whether to begin reading at the latest record, the oldest record, or at a particular sequence number within the shard.
 */
export const getShardIterator: (
  input: GetShardIteratorInput,
) => effect.Effect<
  GetShardIteratorOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getStream: {
  (
    input: GetStreamInput,
  ): effect.Effect<
    GetStreamOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetStreamInput,
  ) => stream.Stream<
    GetStreamOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetStreamInput,
  ) => stream.Stream<
    Shard,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetStreamInput,
  output: GetStreamOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "shards",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all data capture streams associated with your Amazon Keyspaces account or for a specific keyspace or table. The response includes information such as stream ARNs, table associations, creation timestamps, and current status. This operation helps you discover and manage all active data streams in your Amazon Keyspaces environment.
 */
export const listStreams: {
  (
    input: ListStreamsInput,
  ): effect.Effect<
    ListStreamsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStreamsInput,
  ) => stream.Stream<
    ListStreamsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStreamsInput,
  ) => stream.Stream<
    Stream,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStreamsInput,
  output: ListStreamsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "streams",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves data records from a specified shard in an Amazon Keyspaces data stream. This operation returns a collection of data records from the shard, including the primary key columns and information about modifications made to the captured table data. Each record represents a single data modification in the Amazon Keyspaces table and includes metadata about when the change occurred.
 */
export const getRecords: (
  input: GetRecordsInput,
) => effect.Effect<
  GetRecordsOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

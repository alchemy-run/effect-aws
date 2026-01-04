import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://dynamodb.amazonaws.com/doc/2012-08-10/");
const svc = T.AwsApiService({
  sdkId: "DynamoDB Streams",
  serviceShapeName: "DynamoDBStreams_20120810",
});
const auth = T.AwsAuthSigv4({ name: "dynamodb" });
const ver = T.ServiceVersion("2012-08-10");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://streams-dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://streams-dynamodb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://streams-dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://streams-dynamodb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://streams-dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://streams-dynamodb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://streams.dynamodb.{Region}.{PartitionResult#dnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                            url: "https://streams.dynamodb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "booleanEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://streams.dynamodb-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                            url: "https://streams.dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://streams.dynamodb.{Region}.{PartitionResult#dnsSuffix}",
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
  { ShardIterator: S.String, Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetShardIteratorInput extends S.Class<GetShardIteratorInput>(
  "GetShardIteratorInput",
)(
  {
    StreamArn: S.String,
    ShardId: S.String,
    ShardIteratorType: S.String,
    SequenceNumber: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStreamsInput extends S.Class<ListStreamsInput>(
  "ListStreamsInput",
)(
  {
    TableName: S.optional(S.String),
    Limit: S.optional(S.Number),
    ExclusiveStartStreamArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ShardFilter extends S.Class<ShardFilter>("ShardFilter")({
  Type: S.optional(S.String),
  ShardId: S.optional(S.String),
}) {}
export class DescribeStreamInput extends S.Class<DescribeStreamInput>(
  "DescribeStreamInput",
)(
  {
    StreamArn: S.String,
    Limit: S.optional(S.Number),
    ExclusiveStartShardId: S.optional(S.String),
    ShardFilter: S.optional(ShardFilter),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetShardIteratorOutput extends S.Class<GetShardIteratorOutput>(
  "GetShardIteratorOutput",
)({ ShardIterator: S.optional(S.String) }, ns) {}
export class Stream extends S.Class<Stream>("Stream")({
  StreamArn: S.optional(S.String),
  TableName: S.optional(S.String),
  StreamLabel: S.optional(S.String),
}) {}
export const StreamList = S.Array(Stream);
export class ListStreamsOutput extends S.Class<ListStreamsOutput>(
  "ListStreamsOutput",
)(
  {
    Streams: S.optional(StreamList),
    LastEvaluatedStreamArn: S.optional(S.String),
  },
  ns,
) {}
export class Identity extends S.Class<Identity>("Identity")({
  PrincipalId: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const StringSetAttributeValue = S.Array(S.String);
export const NumberSetAttributeValue = S.Array(S.String);
export const BinarySetAttributeValue = S.Array(T.Blob);
export type ListAttributeValue = AttributeValue[];
export const ListAttributeValue = S.Array(
  S.suspend(() => AttributeValue),
) as any as S.Schema<ListAttributeValue>;
export class KeySchemaElement extends S.Class<KeySchemaElement>(
  "KeySchemaElement",
)({ AttributeName: S.String, KeyType: S.String }) {}
export const KeySchema = S.Array(KeySchemaElement);
export class SequenceNumberRange extends S.Class<SequenceNumberRange>(
  "SequenceNumberRange",
)({
  StartingSequenceNumber: S.optional(S.String),
  EndingSequenceNumber: S.optional(S.String),
}) {}
export type MapAttributeValue = { [key: string]: AttributeValue };
export const MapAttributeValue = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue),
}) as any as S.Schema<MapAttributeValue>;
export class Shard extends S.Class<Shard>("Shard")({
  ShardId: S.optional(S.String),
  SequenceNumberRange: S.optional(SequenceNumberRange),
  ParentShardId: S.optional(S.String),
}) {}
export const ShardDescriptionList = S.Array(Shard);
export type AttributeValue =
  | { S: string }
  | { N: string }
  | { B: Uint8Array }
  | { SS: (typeof StringSetAttributeValue)["Type"] }
  | { NS: (typeof NumberSetAttributeValue)["Type"] }
  | { BS: (typeof BinarySetAttributeValue)["Type"] }
  | { M: MapAttributeValue }
  | { L: ListAttributeValue }
  | { NULL: boolean }
  | { BOOL: boolean };
export const AttributeValue = S.Union(
  S.Struct({ S: S.String }),
  S.Struct({ N: S.String }),
  S.Struct({ B: T.Blob }),
  S.Struct({ SS: StringSetAttributeValue }),
  S.Struct({ NS: NumberSetAttributeValue }),
  S.Struct({ BS: BinarySetAttributeValue }),
  S.Struct({ M: S.suspend(() => MapAttributeValue) }),
  S.Struct({ L: S.suspend(() => ListAttributeValue) }),
  S.Struct({ NULL: S.Boolean }),
  S.Struct({ BOOL: S.Boolean }),
) as any as S.Schema<AttributeValue>;
export class StreamDescription extends S.Class<StreamDescription>(
  "StreamDescription",
)({
  StreamArn: S.optional(S.String),
  StreamLabel: S.optional(S.String),
  StreamStatus: S.optional(S.String),
  StreamViewType: S.optional(S.String),
  CreationRequestDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TableName: S.optional(S.String),
  KeySchema: S.optional(KeySchema),
  Shards: S.optional(ShardDescriptionList),
  LastEvaluatedShardId: S.optional(S.String),
}) {}
export const AttributeMap = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue),
});
export class DescribeStreamOutput extends S.Class<DescribeStreamOutput>(
  "DescribeStreamOutput",
)({ StreamDescription: S.optional(StreamDescription) }, ns) {}
export class StreamRecord extends S.Class<StreamRecord>("StreamRecord")({
  ApproximateCreationDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Keys: S.optional(AttributeMap),
  NewImage: S.optional(AttributeMap),
  OldImage: S.optional(AttributeMap),
  SequenceNumber: S.optional(S.String),
  SizeBytes: S.optional(S.Number),
  StreamViewType: S.optional(S.String),
}) {}
export class Record extends S.Class<Record>("Record")({
  eventID: S.optional(S.String),
  eventName: S.optional(S.String),
  eventVersion: S.optional(S.String),
  eventSource: S.optional(S.String),
  awsRegion: S.optional(S.String),
  dynamodb: S.optional(StreamRecord),
  userIdentity: S.optional(Identity),
}) {}
export const RecordList = S.Array(Record);
export class GetRecordsOutput extends S.Class<GetRecordsOutput>(
  "GetRecordsOutput",
)(
  { Records: S.optional(RecordList), NextShardIterator: S.optional(S.String) },
  ns,
) {}

//# Errors
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
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
export const listStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getShardIterator = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
